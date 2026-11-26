/* ------------------------------------------------------------------ */
/* Base card                                                           */
/* ------------------------------------------------------------------ */
let SEQ = 0;

// energy_period : périodes calendaires, puis glissantes (durée en jours)
const ROLLING = { "24h": 1, "7d": 7, "30d": 30 };
const PERIODS = ["day", "week", "month", ...Object.keys(ROLLING)];
// energy_tile_period / cost_tile_period : période d'un capteur fourni par l'utilisateur (texte de l'en-tête seulement, rien n'est calculé)
const TILE_PERIODS = [...PERIODS, "year", "total"];
// cartes avec la tuile « durée d'utilisation du jour » (capteur usage_time, sinon calcul depuis l'historique)
// fitness (vélo elliptique, vélo d'appartement, rameur) : allure de l'animation et tuiles de séance
const FIT_KINDS = ["elliptical", "exercise_bike", "rowing_machine", "treadmill"];
const USAGE_KINDS = ["tv", "monitor", "ps5", "switch2", "desktop_pc", "laptop", "air_compressor", ...FIT_KINDS];
const USAGE_ON = ["on", "playing", "paused", "idle", "buffering", "home"];

// piscine : équipements commandables [option, icône, clé de libellé]
const POOL_CTL = [["switch_ph_plus", "mdi:plus-circle-outline", "pool_ph_plus"], ["switch_ph_minus", "mdi:minus-circle-outline", "pool_ph_minus"],
  ["switch_electrolysis", "mdi:flash", "electrolysis"], ["switch_heat_pump", "mdi:heat-pump", "pool_heat_pump"], ["switch_shower", "mdi:shower-head", "shower"]];
// appareils larges et plats dont la zone d'illustration s'ajuste au dessin : sélecteur des calques d'effets animés
const AUTOFIT = { ac_split: ".ac-warm,.ac-waves,.ac-air,.ac-drops", av_receiver: ".av-waves,.av-notes,.av-ring", switch2: ".sw-air,.sw-amb" };
// température ramenée en °C d'après son unité (°F → °C), pour la comparer aux seuils écrits en °C
const toDegC = (v, unit) => (v == null || !Number.isFinite(v) ? v : /^\s*°?\s*F\s*$/i.test(String(unit || "")) ? (v - 32) / 1.8 : v);
// price_per_kwh : entité (sensor.tarif, input_number.prix…) ou nombre, éventuellement en texte (« 0.25 », « 0,25 »)
const priceEntity = (v) => (typeof v === "string" && /^[a-z_]+\.[a-z0-9_]+$/i.test(v.trim()) ? v.trim() : null);
// options dont dépendent les lectures d'historique / statistiques (_fetchCycle, _fetchPeriod, _fetchUsage) : si l'une change, on relit tout
const FETCH_KEYS = ["entity", "power", "power_solar", "energy", "energy_solar", "threshold", "cycle_gap", "energy_period", "estimate", "last_cycle", "price_per_kwh", "usage_time", "show_usage_time", "show_sparklines"];
const KINDS = {};
const registerKind = (names, spec) => { [].concat(names).forEach((k) => { KINDS[k] = { ...(KINDS[k] || {}), ...spec }; }); };
const ACTIVE_BASE_CARDS = new Set();
if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      ACTIVE_BASE_CARDS.forEach((card) => {
        if (card._hass && card._config) card._update(false);
      });
    }
  });
}
const OFFSCREEN_OBSERVER = (typeof IntersectionObserver !== "undefined")
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.boundingClientRect;
        if (rect && (rect.width > 0 || rect.height > 0)) {
          entry.target.toggleAttribute("offscreen", !entry.isIntersecting);
        }
      }
    }, { rootMargin: "100px" })
  : null;
class ApplianceCardBase extends HTMLElement {
  static get kind() { return "washer"; }
  static getConfigForm() { return buildForm(this.kind); }
  static getStubConfig(hass) { return stubFor(this.kind, hass); }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    // les aides (applianceSize : transparence, taille, disposition du titre) viennent d'un morceau chargé en parallèle : s'il n'est pas encore là,
    // on applique le tout dès qu'il arrive (sinon la carte reste sans transparence ni disposition)
    const tok = (this._cfgTok = {});
    if (window.applianceSize) window.applianceSize(this, config);
    else window.addEventListener("appliance-helpers-ready", () => {
      if (this._cfgTok !== tok) return; // la carte a reçu une autre config entre-temps
      window.applianceSize(this, config);
      if (this._hass && this._config) this._update(true);
    }, { once: true });
    // multiprise : les prises commandées (outlets) suffisent, sans entité globale (ex. Lidl TS011F, un switch par prise)
    if (!["entity", "power", "power_solar", "switch", "switch_low", "switch_high", "temperature", "zone_1"].some((f) => config[f]) && !(Array.isArray(config.outlets) && config.outlets.some((i) => typeof i === "string" && i))) {
      throw new Error(tr(undefined, "err_need_entity"));
    }
    this._config = { ...config };
    // options des lectures d'historique changées : on oublie ce qui a été lu (dernier cycle, durée de référence, période, durée d'utilisation)
    // et les lectures encore en cours pour l'ancienne config sont ignorées (jeton _fetchTok)
    const fsig = JSON.stringify(FETCH_KEYS.map((k) => config[k] ?? null));
    if (fsig !== this._fetchSig) {
      this._fetchSig = fsig; this._fetchTok = {};
      clearTimeout(this._cycTimer);
      this._cycAt = 0; this._cycle = null; this._refDur = null; this._runStart = 0; this._offAt = 0; this._cycActive = undefined; this._cycBusy = false; this._cycResume = null;
      this._perKwh = null; this._perSig = null; this._perAt = 0; this._perBusy = false;
      this._use = null; this._useAt = 0; this._useDay = null; this._useBusy = false;
      this._dwLastActive = 0;
      this._spkHist = null; this._spkAt = 0; this._spkBusy = false; this._spkLive = {};
    }
    this._kind = this.constructor.kind;
    this._def = DEF[this._kind];
    this._lastKey = null;
    this._fitBox = null;
    this._build();
    if (this._hass) this._update(true);
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config) this._update(false);
  }

  connectedCallback() {
    ACTIVE_BASE_CARDS.add(this);
    if (OFFSCREEN_OBSERVER) OFFSCREEN_OBSERVER.observe(this);
    // keep LCD clock / countdown fresh even when no entity changes (skip while tab/screen is hidden)
    this._tick = setInterval(() => { if (!document.hidden && this._hass && this._config) this._update(false); }, 20000);
    // relecture du dernier cycle annulée par un retrait de la page (changement de vue…) : reprogrammée pour l'échéance prévue
    const r = this._cycResume;
    if (r) { clearTimeout(this._cycTimer); this._cycBusy = true; this._cycTimer = setTimeout(r.run, Math.max(0, r.due - Date.now())); }
  }
  // une relecture programmée (_cycResume) reste en attente et repart au retour de la carte ; sinon plus rien n'est en cours
  disconnectedCallback() {
    ACTIVE_BASE_CARDS.delete(this);
    if (OFFSCREEN_OBSERVER) OFFSCREEN_OBSERVER.unobserve(this);
    this.removeAttribute("offscreen");
    clearInterval(this._tick); clearTimeout(this._cycTimer); if (!this._cycResume) this._cycBusy = false; this._closeSourcePopup();
  }

  getCardSize() { return 4; }

  // HA passe preview = true dans l'éditeur de carte et en mode édition du tableau de bord : la carte reste alors visible
  set preview(v) { this._preview = !!v; if (this._hass && this._config) this._update(true); }
  get preview() { return !!this._preview; }
  set editMode(v) { this._editMode = !!v; if (this._hass && this._config) this._update(true); }
  get editMode() { return !!this._editMode; }

  /* hide_when_inactive : carte masquée quand l'appareil ne fonctionne pas (ni cycle, ni alerte),
   * hide_delay minutes après la fin d'activité (pour voir « Terminé »). Renvoie true quand la carte serait masquée
   * mais reste visible parce qu'on édite (affichée en transparence). */
  _applyHide(active, alert) {
    const c = this._config, now = Date.now();
    if (active || alert) this._lastActive = now;
    let hide = false;
    if (c.hide_when_inactive) {
      const delay = Math.max(0, Number(c.hide_delay) || 0) * 60000;
      hide = !(active || alert || (this._lastActive && now - this._lastActive < delay));
    }
    const editing = this._preview || this._editMode;
    const hidden = hide && !editing;
    if (hidden !== !!this._hiddenNow) {
      this._hiddenNow = hidden;
      this.style.display = hidden ? "none" : "";
      // prévient le tableau de bord (sections) que la carte apparaît / disparaît
      this.dispatchEvent(new CustomEvent("card-visibility-changed", { detail: { value: !hidden }, bubbles: true, composed: true }));
    }
    return hide && editing;
  }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

  // liste des capteurs de buse (imprimante multi-buses) ; une simple chaîne est acceptée
  _nozzles() {
    const n = this._config.nozzle_temperatures;
    return (Array.isArray(n) ? n : n ? [n] : []).filter((i) => typeof i === "string" && i);
  }

  _ids() {
    const c = this._config;
    return ["entity", "error", "status_2", "temperature_2", "target_temperature_2", "remaining_2", "power", "power_factor", "current", "voltage", "power_solar", "energy_solar", "energy", "cost", "remaining", "progress", "program", "door", "switch",
      "switch_low", "switch_high", "direction", "pressure", "runtime_total", "switch_ph_plus", "switch_ph_minus", "switch_electrolysis", "switch_heat_pump", "switch_shower", "presence", "entity_focus", "entity_activity", "entity_presence", "low_water", "water_level", "steam", "incline", "power_level", "pellet_level", "ph", "orp", "dose_interval", "dose_timer", "dose_volume", "dose_time", "pressure", "tds", "salt", "chlorine", "runtime", "usage_time", "speed", "bed_temperature", "humidity", "light", "keg_level", "pouring", "battery_level", "zone2_temperature", "zone_1", "zone_2", "zone_3", "zone_4", "mode", "window", "temperature", "target_temperature", "freezer_temperature", "flex_temperature", "freezer_door", "target_humidity", "tank_full", "fan_speed", "clean_water", "dirty_water", "hot_water_level", "hot_water_volume", "pm25", "filter",
      // autres entités lues à l'affichage (tuiles de séance, projecteur, encres, message d'imprimante, compteur, boutons, soleil, prix du kWh)
      "cadence", "distance", "heart_rate", "calories", "lamp_hours", "picture_mode", "ink_black", "ink_cyan", "ink_magenta", "ink_yellow", "ink_color",
      "status_message", "counter", "button_on", "button_off", "sun_entity"].map((k) => c[k])
      .concat(this._kind === "solar" && !c.sun_entity ? ["sun.sun"] : []).concat(priceEntity(c.price_per_kwh) ? [priceEntity(c.price_per_kwh)] : []).concat(typeof c.tank_volume === "string" ? [c.tank_volume] : []).filter(Boolean).concat(this._nozzles()).concat(Array.isArray(c.outlets) ? c.outlets.filter((i) => typeof i === "string" && i) : [])
      .concat(typeof c.ring_light === "string" && c.ring_light ? [c.ring_light] : [])
      .concat(Array.isArray(c.images) ? c.images.map((i) => i && typeof i.entity === "string" && i.entity).filter(Boolean) : [])
      .concat(Array.isArray(c.extra_tiles) ? c.extra_tiles.map((it) => (typeof it === "string" ? it : it && typeof it.entity === "string" ? it.entity : null)).filter(Boolean) : []);
  }

  // prise connectée : voyants d'état choisis (option indicators : led, bolt, ring, glow, flow), par défaut led + bolt
  _indClasses() {
    const l = this._config.indicators;
    const list = Array.isArray(l) ? l : typeof l === "string" && l ? [l] : ["led", "bolt"];
    return list.filter((k) => ["led", "bolt", "ring", "glow", "flow"].includes(k)).map((k) => `ind-${k}`).join(" ");
  }

  // guirlande : une couleur choisie autre que blanc chaud → unicolore ; sinon arc-en-ciel
  _glSingle(m) { return !/^rgb\(255,\s*2[0-9]{2},\s*1[0-9]{2}\)$|^rgb\(255,255,255\)$/.test(String(m.glColor).replace(/ /g, "")); }

  // zone d'illustration dynamique : le cadre et le viewBox suivent le contour réel du dessin (getBBox) plus une marge, au lieu d'un format
  // fixe 120 × 140 (clim, récepteur AV : appareils larges et plats). Sans animation, on ne mesure que l'appareil ; effets en cours
  // (air de la clim, ondes sonores…), la zone s'agrandit pour les contenir. Option autofit: false pour revenir au format fixe.
  _fit(fxOn) {
    const sel = AUTOFIT[this._kind];
    if (!sel || this._config.autofit === false || this._config.layout === "split") return;
    const il = this.shadowRoot && this.shadowRoot.querySelector(".illus"), sv = il && il.querySelector("svg");
    if (!sv) return;
    if (!this._fitBox) {
      // mesure unique (la carte doit être affichée, sinon on réessaie à la mise à jour suivante)
      const union = (list) => list.reduce((u, el) => {
        let r; try { r = el.getBBox(); } catch (e) { return u; }
        if (!(r.width || r.height)) return u;
        return u ? { x1: Math.min(u.x1, r.x), y1: Math.min(u.y1, r.y), x2: Math.max(u.x2, r.x + r.width), y2: Math.max(u.y2, r.y + r.height) } : { x1: r.x, y1: r.y, x2: r.x + r.width, y2: r.y + r.height };
      }, null);
      const kids = [...sv.children].filter((el) => el.tagName.toLowerCase() !== "defs");
      const body = union(kids.filter((el) => !el.matches(sel))), all = union(kids);
      if (!body || !all || all.x2 - all.x1 < 4 || all.y2 - all.y1 < 4) return;
      this._fitBox = { body, all };
    }
    const u = fxOn ? this._fitBox.all : this._fitBox.body, bw = u.x2 - u.x1, bh = u.y2 - u.y1, pad = Math.max(bw, bh) * 0.06;
    const w = bw + 2 * pad, h = bh + 2 * pad;
    sv.setAttribute("viewBox", `${(u.x1 - pad).toFixed(1)} ${(u.y1 - pad).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
    il.style.aspectRatio = `${w.toFixed(1)} / ${h.toFixed(1)}`;
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const id = `ac${++SEQ}`;
    const svg = SVG[this._kind](this._config).replace(/ID-/g, `${id}-`);
    const useAdopted = Boolean(STYLE_SHEET && "adoptedStyleSheets" in this.shadowRoot);
    if (useAdopted) {
      try { this.shadowRoot.adoptedStyleSheets = [STYLE_SHEET]; } catch (e) {}
    }
    const styleTag = (useAdopted && this.shadowRoot.adoptedStyleSheets.length) ? "" : `<style>${STYLE}</style>`;
    this.shadowRoot.innerHTML = `${styleTag}
      <ha-card>
        <div class="wrap" id="wrap">
          <div class="top">
            <div class="illus"><svg viewBox="0 0 120 140" aria-hidden="true">${svg}</svg></div>
            <div class="right-col" id="right-col">
              <div class="head">
                <div class="info" id="info"></div>
                <div class="actions" id="actions"></div>
              </div>
              <div class="stats" id="stats"></div>
            </div>
          </div>
          <div class="modes" id="modes"></div>
          <div class="bar" id="bar"><div class="bar-fill" id="barfill"></div></div>
        </div>
      </ha-card>`;
    // illustration_only: only the animated drawing, without name, status, tiles or buttons
    // (e.g. above another card that already shows them)
    if (this._config.illustration_only) {
      const st = document.createElement("style");
      st.textContent = ".right-col,.modes,.bar{display:none!important}.top{justify-content:center!important}.illus{margin:0 auto!important}";
      this.shadowRoot.appendChild(st);
    }
    this.shadowRoot.querySelector("ha-card").addEventListener("click", (ev) => {
      const path = ev.composedPath();
      if (path.some((n) => n.classList && (n.classList.contains("toggle") || n.classList.contains("mode-btn")))) return;
      const c = this._config;
      // illustration : tap_action / hold_action (le clic qui suit un appui long est ignoré)
      if (path.some((n) => n.classList && n.classList.contains("illus"))) {
        if (this._held) { this._held = false; return; }
        if (c.tap_action) { this._action(c.tap_action); return; }
      }
      const tile = path.find((n) => n.dataset && n.dataset.entity);
      const eid = tile ? tile.dataset.entity : (c.entity || c.power || c.switch || c.temperature || (Array.isArray(c.outlets) && c.outlets[0]));
      if (eid) this._moreInfo(eid);
    });
    // appui long sur l'illustration (500 ms), seulement si hold_action est défini
    const il = this.shadowRoot.querySelector(".illus");
    const stop = () => clearTimeout(this._holdTimer);
    il.addEventListener("pointerdown", (ev) => {
      this._held = false;
      if (!this._config.hold_action || (ev.button != null && ev.button > 0)) return;
      stop();
      this._holdTimer = setTimeout(() => { this._held = true; this._action(this._config.hold_action); }, 500);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((t) => il.addEventListener(t, stop));
    il.addEventListener("contextmenu", (ev) => { if (this._config.hold_action) ev.preventDefault(); });
    if (this._config.color) this.style.setProperty("--ac-accent", this._config.color);
    if (typeof window.__acHydrateRoot === "function") window.__acHydrateRoot(this.shadowRoot);
  }

  _more(eid) { this._moreInfo(eid); }
  _moreInfo(eid) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: eid }, bubbles: true, composed: true }));
  }

  // action standard Home Assistant (tap_action / hold_action) :
  // toggle → la prise (switch), avec la même confirmation que le bouton ; more-info / none gérés ici ;
  // le reste (navigate, url, perform-action…) est confié à Home Assistant via l'événement hass-action
  _action(a0) {
    // confirmation facultative : option HA standard de l'action (true ou { text, exemptions }) ou case « Demander confirmation » de la carte (confirm_action) ; fenêtre Annuler / OK avant l'action, puis l'option est retirée (pas de 2e fenêtre côté HA)
    const a1 = a0 && typeof a0 === "object" && a0.confirmation ? { ...a0, confirmation: undefined } : a0, go = () => this._action1(a1);
    if (this._hass && window.applianceConfirm) window.applianceConfirm(this, a0, go); else go();
  }

  _action1(a) {
    const c = this._config, hass = this._hass;
    if (!a || !hass) return;
    const type = typeof a === "string" ? a : a.action;
    const dflt = c.entity || c.power || c.switch || c.temperature || (Array.isArray(c.outlets) && c.outlets[0]);
    if (!type || type === "none") return;
    if (type === "more-info") { const e = a.entity || dflt; if (e) this._moreInfo(e); return; }
    if (type === "toggle" && this._sw) { this._toggleSw(); return; }
    this.dispatchEvent(new CustomEvent("hass-action", { detail: { config: { entity: dflt, tap_action: typeof a === "string" ? { action: a } : a }, action: "tap" }, bubbles: true, composed: true }));
  }

  // marche / arrêt de la prise ; un arrêt protégé (cycle en cours…) demande un 2e clic dans les 4 s
  _toggleSw() {
    const sw = this._sw, hass = this._hass;
    if (!sw || !hass) return;
    if (sw.guarded && !(this._confirmUntil && Date.now() < this._confirmUntil)) {
      this._confirmUntil = Date.now() + 4000;
      this._render(this._compute());
      clearTimeout(this._confirmTimer);
      this._confirmTimer = setTimeout(() => { this._confirmUntil = 0; if (this._hass) this._render(this._compute()); }, 4100);
      return;
    }
    this._confirmUntil = 0;
    clearTimeout(this._confirmTimer);
    if (sw.outlets) { hass.callService("homeassistant", sw.on ? "turn_off" : "turn_on", { entity_id: sw.outlets }); return; }
    const dom = domainOf(sw.id);
    hass.callService(["switch", "input_boolean", "light", "fan", "humidifier"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: sw.id });
  }

  // energy_period : consommation de la période d'après les statistiques de Home Assistant,
  // calendaire (day / week / month, comme le tableau de bord Énergie) ou glissante (24h / 7d / 30d),
  // relue au plus toutes les 5 min ou quand le compteur bouge
  _fetchPeriod() {
    const c = this._config, hass = this._hass, per = c.energy_period;
    // sans capteur d'énergie cumulée mais avec la puissance (prise connectée) : kWh = somme des moyennes horaires de la puissance
    const fromPower = !c.energy && !!c.power;
    const src = fromPower ? c.power : c.energy;
    if (!PERIODS.includes(per) || !src || !hass || typeof hass.callWS !== "function") return;
    const st = hass.states[src], sig = `${per}|${src}|${fromPower ? "" : st ? st.state : ""}`, now = Date.now();
    if (this._perBusy || (sig === this._perSig && now - (this._perAt || 0) < 300000) || (this._perAt && now - this._perAt < 60000)) return;
    this._perBusy = true; this._perSig = sig; this._perAt = now;
    const tok = this._fetchTok, cur = () => this._fetchTok === tok; // résultat d'une config plus ancienne : ignoré
    const set = (v) => { if (cur()) this._perKwh = v; };
    const done = () => { if (!cur()) return; this._perBusy = false; if (this._hass) this._render(this._compute()); };
    if (fromPower) {
      // début de la période : minuit, lundi 0 h, le 1er à 0 h (calendaire) ou maintenant − N jours (glissante)
      const d = new Date(now);
      let start;
      if (ROLLING[per]) start = new Date(now - ROLLING[per] * 86400000);
      else if (per === "week") { start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)); }
      else if (per === "month") start = new Date(d.getFullYear(), d.getMonth(), 1);
      else start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const hourStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
      const q = (period, from, to) => hass.callWS({ type: "recorder/statistics_during_period", start_time: from.toISOString(), end_time: to.toISOString(), statistic_ids: [src], period, types: ["mean"], units: { power: "W" } })
        .then((r) => ((r && r[src]) || []).reduce((w, x) => w + (Number.isFinite(x.mean) ? x.mean : 0), 0));
      // heures complètes (statistiques horaires) + heure en cours (statistiques de 5 min) ; chaque mesure est une moyenne en W sur sa durée
      Promise.all([q("hour", start, hourStart), q("5minute", hourStart, new Date(now))])
        .then(([h, m5]) => { set((h * 1 + m5 / 12) / 1000); })
        .catch(() => { set(null); })
        .finally(done);
      return;
    }
    const win = ROLLING[per] ? { rolling_window: { duration: { days: ROLLING[per] } } } : { calendar: { period: per } };
    hass.callWS({ type: "recorder/statistic_during_period", statistic_id: c.energy, ...win, types: ["change"], units: { energy: "kWh" } })
      .then((r) => { set(r && Number.isFinite(r.change) ? r.change : null); })
      .catch(() => { set(null); })
      .finally(done);
  }

  // last_cycle : début, fin, durée, énergie et coût du dernier cycle, lus dans l'historique de Home Assistant (4 derniers jours).
  // Relu au chargement puis 20 s après chaque fin de cycle (le temps que l'enregistreur écrive les derniers points).
  // estimate : même lecture sur 10 jours, relue aussi au chargement en plein cycle, pour la durée de référence
  // (médiane des 7 derniers cycles) et le début du cycle en cours.
  // Chauffe-eau : last_cycle seulement (pas d'estimate), puissance réseau + solaire (power + power_solar), énergie idem.
  _fetchCycle(active) {
    const c = this._config, hass = this._hass, wash = ["washer", "washer_dryer", "dryer", "dishwasher"].includes(this._kind), wh = this._kind === "water_heater" || this._kind === "oven";
    const est = !!c.estimate && wash;
    if (!(c.last_cycle || est) || !(wash || wh) || !c.power || !hass || typeof hass.callWS !== "function") return;
    const was = this._cycActive, gap = (c.cycle_gap ?? 15) * 60000;
    this._cycActive = active;
    // départ vu en direct ; une reprise après un creux plus court que cycle_gap reste dans le même cycle
    if (active && was === false && !(this._runStart && this._offAt && Date.now() - this._offAt < gap)) this._runStart = Date.now();
    if (!active && was === true) this._offAt = Date.now();
    const first = !this._cycAt, ended = was === true && !active;
    if (this._cycBusy || !(first || ended) || (first && active && !est)) return;
    this._cycBusy = true; this._cycAt = Date.now();
    clearTimeout(this._cycTimer);
    const tok = this._fetchTok, cur = () => this._fetchTok === tok; // résultat d'une config plus ancienne : ignoré
    const delay = was === true ? 20000 : 0;
    const run = () => {
      this._cycResume = null;
      if (!cur()) return;
      const now = Date.now(), pIds = [c.power].concat(wh && c.power_solar ? [c.power_solar] : []), eIds = [c.energy].concat(wh && c.energy_solar ? [c.energy_solar] : []).filter(Boolean);
      const ids = pIds.concat(eIds);
      const unit = (i, f) => f[(hass.states[i] && hass.states[i].attributes.unit_of_measurement) || ""] ?? 1;
      hass.callWS({ type: "history/history_during_period", start_time: new Date(now - (est ? 10 : 4) * 86400000).toISOString(), end_time: new Date(now).toISOString(),
        entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          if (!cur()) return;
          const pts = (i, f) => ((r && r[i]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: parseFloat(p.s) * f })).filter((p) => Number.isFinite(p.t));
          // plusieurs capteurs : somme des séries (chaque capteur garde sa valeur jusqu'à son point suivant)
          const pw = sumSeries(pIds.map((i) => pts(i, unit(i, { kW: 1000 })).map((p) => ({ t: p.t, v: Number.isFinite(p.v) ? p.v : 0 })))).map((p) => ({ t: p.t, w: p.v }));
          const en = eIds.length ? sumSeries(eIds.map((i) => pts(i, unit(i, { Wh: 1e-3, MWh: 1e3 })).filter((p) => Number.isFinite(p.v)))) : [];
          this._cycle = lastCycle(pw, c.threshold ?? this._def.threshold, c.cycle_gap ?? 15, en);
          if (est) {
            const l = cycleList(pw, c.threshold ?? this._def.threshold, c.cycle_gap ?? 15), done = l.done;
            let cur = l.cur;
            // cycle en pause (creux plus court que cycle_gap) au moment de la lecture : c'est le cycle en cours
            if (cur === null && this._cycActive && done.length && now - done[done.length - 1].end < gap) cur = done.pop().start;
            this._refDur = median(done.slice(-7).map((x) => x.end - x.start));
            if (cur !== null && this._cycActive) this._runStart = cur;
          }
        })
        .catch(() => { if (cur()) this._cycle = null; })
        .finally(() => { if (!cur()) return; this._cycBusy = false; if (this._hass) this._render(this._compute()); });
    };
    // retenu jusqu'au départ du minuteur : une carte retirée de la page puis remise relance la lecture (connectedCallback)
    this._cycResume = { run, due: Date.now() + delay };
    this._cycTimer = setTimeout(run, delay);
  }

  // durée d'utilisation du jour, sans capteur usage_time : historique depuis minuit de la puissance
  // (allumé = au-dessus du seuil), sinon de l'entité principale (on / playing / idle…).
  // Relu au plus toutes les 5 min et au changement de jour ; entre deux lectures, le temps court tant que l'appareil est allumé.
  _fetchUsage() {
    const c = this._config, hass = this._hass;
    if (!USAGE_KINDS.includes(this._kind) || c.show_usage_time === false || c.usage_time || !hass || typeof hass.callWS !== "function") return;
    const id = c.power || c.entity;
    if (!id || !hass.states[id]) return;
    const day = new Date().toDateString(), now = Date.now();
    if (this._useBusy || (this._useDay === day && now - (this._useAt || 0) < 300000)) return;
    this._useBusy = true; this._useAt = now; this._useDay = day;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const t0 = start.getTime(), byPower = !!c.power, thr = c.threshold ?? this._def.threshold;
    const f = byPower && hass.states[id].attributes.unit_of_measurement === "kW" ? 1000 : 1;
    const on = (s) => byPower ? parseFloat(s) * f > thr : USAGE_ON.includes(String(s).toLowerCase());
    const tok = this._fetchTok, cur = () => this._fetchTok === tok; // résultat d'une config plus ancienne : ignoré
    hass.callWS({ type: "history/history_during_period", start_time: start.toISOString(), end_time: new Date(now).toISOString(),
      entity_ids: [id], minimal_response: true, no_attributes: true, significant_changes_only: false })
      .then((r) => {
        if (!cur()) return;
        const pts = ((r && r[id]) || []).map((p) => ({ t: Math.max(t0, (p.lu ?? p.lc) * 1000), s: p.s })).filter((p) => Number.isFinite(p.t)).sort((a, b) => a.t - b.t);
        let ms = 0;
        pts.forEach((p, i) => { if (on(p.s)) ms += (i + 1 < pts.length ? pts[i + 1].t : now) - p.t; });
        this._use = { min: ms / 60000, at: now, on: pts.length ? on(pts[pts.length - 1].s) : false };
      })
      .catch(() => { if (cur()) this._use = null; })
      .finally(() => { if (!cur()) return; this._useBusy = false; if (this._hass) this._render(this._compute()); });
  }

  _sparkEntities() {
    const c = this._config, h = this._hass;
    if (!c || !h || !h.states) return { powerIds: [], tempIds: [], all: [] };
    const mainTemp = ["water_heater", "climate"].includes(domainOf(c.entity)) ? c.entity : null;
    const powerIds = [c.power, c.power_solar].filter((id, idx, arr) => id && arr.indexOf(id) === idx);
    const tempIds = [c.temperature || mainTemp, c.freezer_temperature, c.flex_temperature, c.zone2_temperature, c.temperature_2, c.bed_temperature, ...this._nozzles()]
      .filter((id, idx, arr) => id && arr.indexOf(id) === idx);
    const all = powerIds.concat(tempIds).filter((id, idx, arr) => arr.indexOf(id) === idx && h.states[id]);
    return { powerIds, tempIds, all };
  }
  _sparkVal(id, isPower) {
    const st = id && this._hass && this._hass.states[id];
    if (!st) return NaN;
    if (isPower) { const w = powerW(st); return w == null ? NaN : w; }
    if (["climate", "water_heater"].includes(domainOf(id))) {
      const t = Number(st.attributes && st.attributes.current_temperature);
      return st.attributes && st.attributes.current_temperature != null && Number.isFinite(t) ? t : NaN;
    }
    const v = num(st);
    return v == null ? NaN : v;
  }
  _fetchSparklines() {
    const c = this._config, hass = this._hass;
    if (!c || c.show_sparklines !== true || !hass || typeof hass.callWS !== "function") return;
    const { powerIds, all } = this._sparkEntities();
    if (!all.length || this._spkBusy || Date.now() - (this._spkAt || 0) < 600000) return;
    this._spkBusy = true; this._spkAt = Date.now();
    const now = Date.now(), tok = this._fetchTok, cur = () => this._fetchTok === tok;
    const needAttr = all.some((i) => ["climate", "water_heater"].includes(domainOf(i)));
    hass.callWS({ type: "history/history_during_period", start_time: new Date(now - 24 * 3600e3).toISOString(), end_time: new Date(now).toISOString(),
      entity_ids: all, minimal_response: true, no_attributes: !needAttr, significant_changes_only: false })
      .then((r) => {
        if (!cur()) return;
        const out = {};
        all.forEach((id) => {
          const isPw = powerIds.includes(id), st = hass.states[id], dom = domainOf(id);
          const mul = isPw && st && st.attributes && st.attributes.unit_of_measurement === "kW" ? 1000 : 1;
          out[id] = ((r && r[id]) || []).map((p) => {
            const t = (p.lu ?? p.lc) * 1000;
            const raw = ["climate", "water_heater"].includes(dom) ? Number(p.a && p.a.current_temperature) : parseFloat(p.s) * mul;
            return { t, v: raw };
          }).filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
        });
        this._spkHist = out;
      })
      .catch(() => { if (cur()) this._spkHist = null; })
      .finally(() => { if (!cur()) return; this._spkBusy = false; if (this._hass) this._render(this._compute()); });
  }
  _sparkSeries(id, isPower) {
    const now = Date.now(), cut = now - 24 * 3600e3;
    const cur = this._sparkVal(id, isPower);
    this._spkLive = this._spkLive || {};
    const L = (this._spkLive[id] = this._spkLive[id] || []);
    if (Number.isFinite(cur) && (!L.length || now - L[L.length - 1].t > 60000 || L[L.length - 1].v !== cur)) {
      L.push({ t: L.length && L[L.length - 1].t >= now ? L[L.length - 1].t + 1 : now, v: cur });
    }
    while (L.length && L[0].t < cut) L.shift();
    const H = ((this._spkHist && this._spkHist[id]) || []).filter((p) => p.t >= cut);
    const lastH = H.length ? H[H.length - 1].t : 0;
    const pts = [...H, ...L.filter((p) => p.t > lastH)];
    if (Number.isFinite(cur) && (!pts.length || pts[pts.length - 1].t < now)) pts.push({ t: now, v: cur });
    return pts;
  }
  _sparkSvg(id, isWarn) {
    const c = this._config;
    if (!c || c.show_sparklines !== true || !id) return "";
    const { powerIds, tempIds } = this._sparkEntities();
    const isPower = powerIds.includes(id), isTemp = tempIds.includes(id);
    if (!isPower && !isTemp) return "";
    const pts = this._sparkSeries(id, isPower).filter((p) => Number.isFinite(p.v));
    if (pts.length < 2) return "";
    let series;
    const span = pts[pts.length - 1].t - pts[0].t;
    if (span < 60000) {
      series = pts.slice(-36).map((p) => p.v);
    } else {
      const end = Date.now(), start = Math.max(pts[0].t, end - 24 * 3600e3), winStart = Math.min(start, end - 6 * 3600e3);
      const n = 36, step = (end - winStart) / n, out = [];
      let i = 0, last = null;
      while (i < pts.length && pts[i].t < winStart) { last = pts[i].v; i++; }
      for (let k = 0; k < n; k++) {
        const b1 = winStart + (k + 1) * step; let s = 0, cnt = 0;
        while (i < pts.length && pts[i].t <= b1) { s += pts[i].v; cnt++; last = pts[i].v; i++; }
        const val = cnt ? s / cnt : last;
        if (val != null) out.push(val);
      }
      series = out.length >= 2 ? out : pts.slice(-36).map((p) => p.v);
    }
    if (series.length < 2) return "";
    const mn = Math.min(...series), mx = Math.max(...series), rg = mx - mn || 1;
    const coords = series.map((v, idx) => [idx / (series.length - 1) * 100, 21 - (v - mn) / rg * 17]);
    const poly = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const d = `M${coords[0][0].toFixed(1)} 24 ${coords.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} L${coords[coords.length - 1][0].toFixed(1)} 24 Z`;
    const color = isWarn ? "var(--ac-alert)" : isPower ? "#ffb74d" : "#00e5ff";
    return `<svg class="tile-spark" style="--spark-c:${color}" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><path class="spark-area" d="${d}"/><polyline class="spark-line" points="${poly}"/></svg>`;
  }

  _update(force) {
    const hass = this._hass;
    this._fetchPeriod();
    this._fetchUsage();
    this._fetchSparklines();
    // clé de rendu : last_updated change à chaque changement d'état OU d'attribut de l'entité (Home Assistant) ;
    // sans horodatage (état simulé), repli sur l'état et les attributs affichés. La tranche de 30 s garde à jour les textes horaires.
    const ATTRS = ["temperature", "current_temperature", "current_humidity", "humidity", "action", "mode", "percentage", "volume_level", "is_volume_muted", "media_title",
      "hvac_action", "preset_mode", "source", "app_name", "sound_mode", "current_position", "direction", "oscillating", "brightness", "rgb_color", "effect", "status"];
    const key = this._ids().map((i) => {
      const s = hass.states[i];
      if (!s) return "x";
      if (s.last_updated) return `${s.state}|${s.last_updated}`;
      const a = s.attributes || {};
      return `${s.state}|${ATTRS.map((k) => (a[k] == null ? "" : String(a[k]))).join("|")}`;
    }).join(";") + "|" + lang(hass) + "|" + numLoc(hass) + "|" + Math.floor(Date.now() / 30000);
    if (!force && key === this._lastKey) return;
    this._lastKey = key;
    this._render(this._compute());
  }

  async _setMode(key) {
    const hass = this._hass, c = this._config;
    const id = c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
    const st = id && hass.states[id];
    if (!st) return;
    const dom = domainOf(id), opts = modeOptions(st);
    const opt = pickMode(opts, key);
    if (!opt) return;
    if (dom === "select" || dom === "input_select") {
      hass.callService(dom, "select_option", { entity_id: id, option: opt });
    } else if (dom === "climate") {
      const hv = st.attributes.hvac_modes || [];
      if (key === "off") { hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: hv.find((x) => x === "off") || "off" }); return; }
      if (st.state === "off") {
        const on = hv.find((x) => ["heat", "heat_cool", "auto"].includes(x));
        if (on) await hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: on });
      }
      if ((st.attributes.preset_modes || []).includes(opt)) hass.callService("climate", "set_preset_mode", { entity_id: id, preset_mode: opt });
    }
  }

  // VMC à deux interrupteurs : allumer une vitesse coupe l'autre ; un second clic sur la vitesse active l'éteint
  _setVmcSpeed(which) {
    const c = this._config, hass = this._hass;
    if (!hass) return;
    const ids = { low: c.switch_low, high: c.switch_high }, target = ids[which], other = ids[which === "low" ? "high" : "low"];
    if (!target) return;
    const call = (id, svc) => hass.callService(["switch", "input_boolean", "light", "fan"].includes(domainOf(id)) ? domainOf(id) : "homeassistant", svc, { entity_id: id });
    if (isOn(hass.states[target])) { call(target, "turn_off"); return; }
    if (other && isOn(hass.states[other])) call(other, "turn_off");
    call(target, "turn_on");
  }

  // pré-réglages du poêle à granulés : l'option exacte de l'entité `mode` (select) ou du climate (preset_mode)
  _presetEntity() {
    const c = this._config;
    return c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
  }
  _presetOptions(st) {
    if (!st) return [];
    const d = domainOf(st.entity_id);
    if (d === "select" || d === "input_select") return st.attributes.options || [];
    if (d === "climate") return st.attributes.preset_modes || [];
    return [];
  }
  _setPreset(opt) {
    const hass = this._hass, id = this._presetEntity(), st = id && hass.states[id];
    if (!st) return;
    const d = domainOf(id);
    if (d === "climate") hass.callService("climate", "set_preset_mode", { entity_id: id, preset_mode: opt });
    else hass.callService(d, "select_option", { entity_id: id, option: opt });
  }

  // état de lecture d'un lecteur : { known, paused }. « playing » / « buffering » / « paused » sont fiables ; pour on / idle (téléviseurs qui
  // ne remontent pas la lecture) l'état est supposé : lecture au départ, basculé par le bouton, remis à zéro si la source, l'appli ou le titre change
  _playState(st) {
    const a = st.attributes || {}, ms = String(st.state).toLowerCase();
    if (ms === "playing" || ms === "buffering") return { known: true, paused: false };
    if (ms === "paused") return { known: true, paused: true };
    const sig = [ms, a.source, a.app_name, a.media_title].join("|");
    if (!this._pp || this._pp.sig !== sig) this._pp = { sig, paused: false };
    return { known: false, paused: this._pp.paused };
  }

  // retour tactile d'un bouton de commande : impulsion + événement « haptic » de Home Assistant (vibration sur mobile si activée dans le profil)
  _press(btn) {
    if (!btn || btn.disabled) return;
    btn.classList.remove("pulse"); void btn.offsetWidth; btn.classList.add("pulse");
    setTimeout(() => btn.classList.remove("pulse"), 450);
    try { btn.dispatchEvent(new CustomEvent("haptic", { detail: "light", bubbles: true, composed: true })); } catch (e) { /* ignore */ }
  }

  // icône, type (entrée / appli) et pastille d'une source, d'après son nom : valable pour tout téléviseur (LG webOS, Samsung, Android TV, Sony, Philips…)
  _srcInfo(name) {
    const l = String(name).trim().toLowerCase(), num = (l.match(/(\d+)\s*$/) || l.match(/(\d+)/) || [])[1];
    const R = [
      [/hdmi/, "mdi:video-input-hdmi", "input", num],
      [/^(av|cvbs|composite|video)\b|component|ypbpr|scart/, "mdi:video-input-component", "input", num],
      [/usb/, "mdi:usb", "input"],
      [/antenn|antenă|\bdvb|\bdtv|\batv\b|terrestr/, "mdi:antenna", "input"],
      [/live\s*tv|^tv$|^tv\b|televiz|cable|cablu|satell/, "mdi:television-classic", "input"],
      [/\bvga\b|\bdvi\b|\brgb\b|\bpc\b|computer|laptop/, "mdi:laptop", "input"],
      [/ps[2-5]\b|playstation/, "mdi:sony-playstation", "input"],
      [/xbox/, "mdi:microsoft-xbox", "input"],
      [/nintendo|switch/, "mdi:nintendo-switch", "input"],
      [/bluetooth/, "mdi:bluetooth", "input"],
      [/screen\s*share|miracast|mirror|airplay|chromecast|\bcast\b|wi-?fi\s*display/, "mdi:cast", "input"],
      [/soundbar|optical|\barc\b|audio|speaker/, "mdi:speaker", "input"],
      [/set.?top|decoder|\bdigi\b|\brcs\b|orange|vodafone|telekom|\bupc\b/, "mdi:set-top-box", "input"],
      [/netflix/, "mdi:netflix", "app"],
      [/youtube/, "mdi:youtube", "app"],
      [/spotify/, "mdi:spotify", "app"],
      [/twitch/, "mdi:twitch", "app"],
      [/plex/, "mdi:plex", "app"],
      [/kodi/, "mdi:kodi", "app"],
      [/vlc/, "mdi:vlc", "app"],
      [/prime|amazon/, "mdi:movie-play", "app"],
      [/disney|hbo|\bmax\b|hulu|paramount|peacock|voyo|pro\s*tv|apple\s*tv\+?/, "mdi:movie-star", "app"],
      [/apple/, "mdi:apple", "app"],
      [/facebook/, "mdi:facebook", "app"],
      [/google\s*play|play\s*store/, "mdi:google-play", "app"],
      [/browser|internet|\bweb\b|chrome|firefox/, "mdi:web", "app"],
      [/setting|settings|setări|setari/, "mdi:cog", "app"],
      [/gallery|galerie|photo|picture|foto/, "mdi:image-multiple", "app"],
      [/music|muzic/, "mdi:music", "app"],
      [/guide|epg/, "mdi:television-guide", "app"],
      [/game|joc/, "mdi:gamepad-variant", "app"],
      [/home|launcher|acas/, "mdi:home-outline", "app"],
    ];
    for (const [re, icon, kind, badge] of R) if (re.test(l)) return { icon, kind, badge: badge || "" };
    return /input|source|port|intrare/.test(l) ? { icon: "mdi:import", kind: "input", badge: "" } : { icon: "mdi:apps", kind: "app", badge: "" };
  }

  // fenêtre de choix de la source : entrées (HDMI, TV, AV…) puis applis, avec icône / logo ; la source active est mise en évidence
  _closeSourcePopup() {
    const host = this._srcEl;
    if (!host) return;
    this._srcEl = null;
    const dlg = host.shadowRoot && host.shadowRoot.querySelector("dialog");
    if (dlg && dlg.open && typeof dlg.close === "function") dlg.close();
    host.remove();
  }
  _sourcePopup() {
    const hass = this._hass, c = this._config, id = c.entity, st = id && hass.states[id];
    if (!st) return;
    const a = st.attributes || {}, list = Array.isArray(a.source_list) ? a.source_list : [];
    if (!list.length) return;
    this._closeSourcePopup();
    // source active : correspondance tolérante (casse, espaces, tirets) sur « source », puis « app_name » ; sinon correspondance partielle
    const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s_\-.:+]+/g, ""), ln = list.map(norm);
    let curIdx = -1;
    for (const v of [a.source, a.app_name]) { const n = norm(v); if (n && curIdx < 0) curIdx = ln.indexOf(n); }
    if (curIdx < 0) for (const v of [a.source, a.app_name]) { const n = norm(v); if (n.length >= 3 && curIdx < 0) curIdx = ln.findIndex((x) => x.length >= 3 && (x.includes(n) || n.includes(x))); }
    const items = list.map((name, i) => ({ name, cur: i === curIdx, ...this._srcInfo(name) }));
    const groups = [["sources_inputs", items.filter((i) => i.kind === "input")], ["sources_apps", items.filter((i) => i.kind !== "input")]].filter((g) => g[1].length);
    const title = c.name || a.friendly_name || id, host = document.createElement("div"), root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>
      dialog.dlg { border: none; padding: 0; margin: 0; width: 100%; max-width: none; height: 100%; max-height: none; background: transparent; display: flex; align-items: flex-end; justify-content: center; font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); }
      dialog.dlg::backdrop { background: rgba(0,0,0,.5); animation: fi .2s ease-out; }
      .sheet { position: relative; box-sizing: border-box; width: 100%; max-width: 460px; max-height: 82vh; overflow: auto; background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); border-radius: 22px 22px 0 0; padding: 14px 14px calc(18px + env(safe-area-inset-bottom, 0px)); box-shadow: 0 -6px 30px rgba(0,0,0,.35); animation: up .25s ease-out; }
      @media (min-width: 600px) { dialog.dlg { align-items: center; } .sheet { border-radius: 22px; } }
      .hd { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
      .tt { flex: 1; min-width: 0; } .tt b { display: block; font-size: 17px; font-weight: 600; } .tt span { display: block; font-size: 13px; opacity: .75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .x { border: none; background: rgba(127,127,127,.16); color: inherit; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .sec { font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; opacity: .75; margin: 14px 4px 6px; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 84px; padding: 10px 6px; border: none; border-radius: 14px; background: rgba(127,127,127,.14); color: inherit; font: inherit; cursor: pointer; transition: transform .12s ease, background .2s; -webkit-tap-highlight-color: transparent; }
      .tile:hover { background: rgba(127,127,127,.24); } .tile:active { transform: scale(.93); }
      .tile { position: relative; }
      .tile.cur { background: #1e88e5; color: #fff; box-shadow: 0 0 0 2px #fff inset, 0 2px 10px rgba(30,136,229,.55); }
      .tile.cur .ic i { background: #fff; color: #1e88e5; border-color: #fff; }
      .ck { position: absolute; top: 5px; right: 5px; width: 18px; height: 18px; border-radius: 50%; background: #fff; color: #1e88e5; display: flex; align-items: center; justify-content: center; --mdc-icon-size: 14px; }
      .on { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; opacity: .95; }
      .ic { position: relative; display: flex; --mdc-icon-size: 30px; }
      .ic i { position: absolute; right: -9px; bottom: -5px; font-style: normal; font-weight: 600; font-size: 12px; line-height: 16px; padding: 0 4px; border-radius: 8px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); border: 1px solid rgba(127,127,127,.45); }
      .lb { font-size: 13px; line-height: 1.2; text-align: center; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-word; }
      @keyframes fi { from { opacity: 0; } } @keyframes up { from { transform: translateY(40px); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { dialog.dlg::backdrop, .sheet { animation: none; } .tile { transition: none; } .tile:active { transform: none; } }
    </style>
    <dialog class="dlg" closedby="any" aria-label="${esc(tr(hass, "source_select"))}">
      <div class="sheet">
        <div class="hd"><div class="tt"><b>${esc(tr(hass, "source_select"))}</b><span>${esc(title)}</span></div>
          <button class="x" aria-label="${esc(tr(hass, "close_dialog"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
        ${groups.map(([k, arr]) => `${groups.length > 1 ? `<div class="sec">${esc(tr(hass, k))}</div>` : ""}<div class="grid">${arr.map((i) => `<button class="tile${i.cur ? " cur" : ""}"${i.cur ? ' aria-current="true"' : ""} data-n="${esc(i.name)}">${i.cur ? '<span class="ck"><ha-icon icon="mdi:check"></ha-icon></span>' : ""}<span class="ic"><ha-icon icon="${i.icon}"></ha-icon>${i.badge ? `<i>${esc(i.badge)}</i>` : ""}</span><span class="lb">${esc(i.name)}</span>${i.cur ? `<span class="on">${esc(tr(hass, "source_active"))}</span>` : ""}</button>`).join("")}</div>`).join("")}
      </div>
    </dialog>`;
    const dlg = root.querySelector("dialog");
    const close = () => this._closeSourcePopup();
    dlg.addEventListener("close", close);
    dlg.addEventListener("click", (ev) => { if (ev.target === dlg) close(); });
    root.querySelector(".x").onclick = close;
    root.querySelectorAll(".tile").forEach((b) => {
      b.onclick = () => {
        this._press(b);
        hass.callService("media_player", "select_source", { entity_id: id, source: b.dataset.n });
        setTimeout(close, 180);
      };
    });
    document.body.appendChild(host);
    this._srcEl = host;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    const cur = root.querySelector(".tile.cur"); if (cur) cur.scrollIntoView({ block: "nearest" });
  }

  // boutons de l'enceinte / du téléviseur : services media_player (volume par pas de volume_step, 5 % par défaut (1 % pour un téléviseur), si volume_set est disponible)
  _spkCmd(key) {
    const hass = this._hass, id = this._config.entity, st = id && hass.states[id];
    if (!st) return;
    // pas de volume par défaut : 1 % pour un téléviseur (échelle 0-100 : Samsung, LG…), 5 % pour une enceinte ; volume_step le remplace
    const a = st.attributes || {}, sf = Number(a.supported_features), step = Number(this._config.volume_step) || (this._kind === "tv" ? 0.01 : 0.05);
    const call = (svc, data = {}) => hass.callService("media_player", svc, { entity_id: id, ...data });
    if (key === "power") call(["off", "standby"].includes(String(st.state).toLowerCase()) ? "turn_on" : "turn_off");
    else if (key === "play_pause") {
      // État de lecture : « playing » / « paused » si l'intégration les remonte. Beaucoup de téléviseurs (LG webOS, Samsung…) ne
      // signalent que on / off : l'état est alors supposé (lecture au départ, basculé à chaque appui) et on envoie
      // media_pause / media_play explicitement, car media_play_pause de HA n'enverrait que « play » quand l'état est « on ».
      const pp = this._playState(st);
      const canPause = !Number.isFinite(sf) || (sf & 1), canPlay = !Number.isFinite(sf) || (sf & 16384);
      if (pp.known) call(pp.paused ? (canPlay ? "media_play" : "media_play_pause") : (canPause ? "media_pause" : "media_play_pause"));
      else if (canPause && canPlay) { this._pp.paused = !pp.paused; call(pp.paused ? "media_play" : "media_pause"); this._update(true); }
      else call("media_play_pause");
    }
    else if (key === "ch_up") call("media_next_track");
    else if (key === "ch_down") call("media_previous_track");
    else if (key === "prev_track") call("media_previous_track");
    else if (key === "next_track") call("media_next_track");
    else if (key === "source_menu") this._sourcePopup();
    else if (key === "source") {
      // source suivante dans source_list (HDMI 1 → HDMI 2 → …)
      const list = Array.isArray(a.source_list) ? a.source_list : [];
      if (list.length) call("select_source", { source: list[(list.indexOf(a.source) + 1) % list.length] });
    }
    else if (key === "sound_mode") {
      // mode audio suivant dans sound_mode_list (DTS Surround → Dolby → Stéréo → …)
      const list = Array.isArray(a.sound_mode_list) ? a.sound_mode_list : [];
      if (list.length) call("select_sound_mode", { sound_mode: list[(list.indexOf(a.sound_mode) + 1) % list.length] });
    }
    else if (key === "mute") call("volume_mute", { is_volume_muted: !a.is_volume_muted });
    else {
      const v = Number(a.volume_level), up = key === "vol_up";
      if (a.volume_level != null && Number.isFinite(v) && (!Number.isFinite(sf) || (sf & 4))) call("volume_set", { volume_level: Math.round(Math.max(0, Math.min(1, v + (up ? step : -step))) * 100) / 100 });
      else call(up ? "volume_up" : "volume_down");
    }
  }

  // boutons du ventilateur de plafond (entité fan) : marche / arrêt, vitesse 1 / 2 / 3 (33 / 67 / 100 %), sens de rotation
  _fanCmd(key) {
    const hass = this._hass, id = this._config.entity, st = id && hass.states[id];
    if (!st) return;
    const call = (svc, data = {}) => hass.callService("fan", svc, { entity_id: id, ...data });
    if (key === "power") call(String(st.state).toLowerCase() === "on" ? "turn_off" : "turn_on");
    else if (key === "dir") call("set_direction", { direction: String(st.attributes.direction).toLowerCase() === "reverse" ? "forward" : "reverse" });
    else if (/^speed[123]$/.test(key)) call("set_percentage", { percentage: [33, 67, 100][Number(key.slice(5)) - 1] });
  }

}
