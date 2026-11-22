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
const FIT_KINDS = ["elliptical", "exercise_bike", "rowing_machine"];
const USAGE_KINDS = ["tv", "monitor", "ps5", "desktop_pc", "laptop", "air_compressor", ...FIT_KINDS];
const USAGE_ON = ["on", "playing", "paused", "idle", "buffering", "home"];

// piscine : équipements commandables [option, icône, clé de libellé]
const POOL_CTL = [["switch_ph_plus", "mdi:plus-circle-outline", "pool_ph_plus"], ["switch_ph_minus", "mdi:minus-circle-outline", "pool_ph_minus"],
  ["switch_electrolysis", "mdi:flash", "electrolysis"], ["switch_heat_pump", "mdi:heat-pump", "pool_heat_pump"], ["switch_shower", "mdi:shower-head", "shower"]];
// appareils larges et plats dont la zone d'illustration s'ajuste au dessin : sélecteur des calques d'effets animés
const AUTOFIT = { ac_split: ".ac-warm,.ac-waves,.ac-air,.ac-drops", av_receiver: ".av-waves,.av-notes,.av-ring" };
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
    // keep LCD clock / countdown fresh even when no entity changes
    this._tick = setInterval(() => { if (this._hass && this._config) this._update(false); }, 20000);
  }
  disconnectedCallback() { clearInterval(this._tick); clearTimeout(this._cycTimer); this._cycBusy = false; this._closeSourcePopup(); }

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
      "switch_low", "switch_high", "direction", "pressure", "runtime_total", "switch_ph_plus", "switch_ph_minus", "switch_electrolysis", "switch_heat_pump", "switch_shower", "presence", "low_water", "water_level", "steam", "power_level", "pellet_level", "ph", "orp", "dose_interval", "dose_timer", "dose_volume", "dose_time", "pressure", "tds", "salt", "chlorine", "runtime", "usage_time", "speed", "bed_temperature", "humidity", "light", "keg_level", "pouring", "battery_level", "zone2_temperature", "zone_1", "zone_2", "zone_3", "zone_4", "mode", "window", "temperature", "target_temperature", "freezer_temperature", "flex_temperature", "freezer_door", "target_humidity", "tank_full", "fan_speed", "clean_water", "dirty_water", "hot_water_level", "hot_water_volume", "pm25", "filter"].map((k) => c[k]).concat(typeof c.tank_volume === "string" ? [c.tank_volume] : []).filter(Boolean).concat(this._nozzles()).concat(Array.isArray(c.outlets) ? c.outlets.filter((i) => typeof i === "string" && i) : [])
      .concat(Array.isArray(c.images) ? c.images.map((i) => i && typeof i.entity === "string" && i.entity).filter(Boolean) : []);
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
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
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
  }

  _moreInfo(eid) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: eid }, bubbles: true, composed: true }));
  }

  // action standard Home Assistant (tap_action / hold_action) :
  // toggle → la prise (switch), avec la même confirmation que le bouton ; more-info / none gérés ici ;
  // le reste (navigate, url, perform-action…) est confié à Home Assistant via l'événement hass-action
  _action(a) {
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
    const done = () => { this._perBusy = false; if (this._hass) this._render(this._compute()); };
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
        .then(([h, m5]) => { this._perKwh = (h * 1 + m5 / 12) / 1000; })
        .catch(() => { this._perKwh = null; })
        .finally(done);
      return;
    }
    const win = ROLLING[per] ? { rolling_window: { duration: { days: ROLLING[per] } } } : { calendar: { period: per } };
    hass.callWS({ type: "recorder/statistic_during_period", statistic_id: c.energy, ...win, types: ["change"], units: { energy: "kWh" } })
      .then((r) => { this._perKwh = r && Number.isFinite(r.change) ? r.change : null; })
      .catch(() => { this._perKwh = null; })
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
    this._cycTimer = setTimeout(() => {
      const now = Date.now(), pIds = [c.power].concat(wh && c.power_solar ? [c.power_solar] : []), eIds = [c.energy].concat(wh && c.energy_solar ? [c.energy_solar] : []).filter(Boolean);
      const ids = pIds.concat(eIds);
      const unit = (i, f) => f[(hass.states[i] && hass.states[i].attributes.unit_of_measurement) || ""] ?? 1;
      hass.callWS({ type: "history/history_during_period", start_time: new Date(now - (est ? 10 : 4) * 86400000).toISOString(), end_time: new Date(now).toISOString(),
        entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
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
        .catch(() => { this._cycle = null; })
        .finally(() => { this._cycBusy = false; if (this._hass) this._render(this._compute()); });
    }, was === true ? 20000 : 0);
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
    hass.callWS({ type: "history/history_during_period", start_time: start.toISOString(), end_time: new Date(now).toISOString(),
      entity_ids: [id], minimal_response: true, no_attributes: true, significant_changes_only: false })
      .then((r) => {
        const pts = ((r && r[id]) || []).map((p) => ({ t: Math.max(t0, (p.lu ?? p.lc) * 1000), s: p.s })).filter((p) => Number.isFinite(p.t)).sort((a, b) => a.t - b.t);
        let ms = 0;
        pts.forEach((p, i) => { if (on(p.s)) ms += (i + 1 < pts.length ? pts[i + 1].t : now) - p.t; });
        this._use = { min: ms / 60000, at: now, on: pts.length ? on(pts[pts.length - 1].s) : false };
      })
      .catch(() => { this._use = null; })
      .finally(() => { this._useBusy = false; if (this._hass) this._render(this._compute()); });
  }

  _update(force) {
    const hass = this._hass;
    this._fetchPeriod();
    this._fetchUsage();
    const key = this._ids().map((i) => {
      const s = hass.states[i];
      return s ? `${s.state}|${s.attributes.temperature ?? ""}|${s.attributes.current_temperature ?? ""}|${s.attributes.current_humidity ?? ""}|${s.attributes.humidity ?? ""}|${s.attributes.action ?? ""}|${s.attributes.mode ?? ""}|${s.attributes.percentage ?? ""}|${s.attributes.volume_level ?? ""}|${s.attributes.is_volume_muted ?? ""}|${s.attributes.media_title ?? ""}` : "x";
    }).join(";") + "|" + lang(hass) + "|" + numLoc(hass) + "|" + Math.floor(Date.now() / 30000);
    if (!force && key === this._lastKey) return;
    this._lastKey = key;
    this._render(this._compute());
  }

  /* ---------------- state model ---------------- */
  _compute() {
    const hass = this._hass, c = this._config, d = this._def, kind = this._kind;
    const S = (i) => (i ? hass.states[i] : undefined);
    const main = S(c.entity), pw = S(c.power), pwS = S(c.power_solar), sw = S(c.switch);
    const threshold = c.threshold ?? d.threshold;
    // deux sources de puissance possibles (ex. contacteur réseau + routeur solaire) : on additionne
    const wGrid = powerW(pw), wSolar = powerW(pwS);
    const watts = wGrid === null && wSolar === null ? null : (wGrid || 0) + (wSolar || 0);
    const m = {
      main, pw, pwS, wGrid, wSolar, sw, watts, threshold,
      energy: S(c.energy), energyS: S(c.energy_solar), cost: S(c.cost), remaining: parseRemaining(S(c.remaining)),
      progress: num(S(c.progress)), program: S(c.program), door: S(c.door),
      temp: S(c.temperature), target: S(c.target_temperature),
      ftemp: S(c.freezer_temperature), fdoor: S(c.freezer_door), flex: S(c.flex_temperature),
      level: num(S(c.power_level)), pellets: num(S(c.pellet_level)),
      pool: kind === "pool_pump" || kind === "dosing_pump" ? Object.fromEntries(["ph", "orp", "pressure", "tds", "salt", "chlorine"].map((k) => [k, S(c[k])])) : null,
      fit: FIT_KINDS.includes(kind) ? { cadence: S(c.cadence), distance: S(c.distance), hr: S(c.heart_rate), kcal: S(c.calories) } : null,
      runtime: parseRemaining(S(c.runtime)), runtimeTotal: parseRemaining(S(c.runtime_total)), usage: parseRemaining(S(c.usage_time)), speed: S(c.speed), bedTemp: num(S(c.bed_temperature)), humidity: num(S(c.humidity)), mode: S(c.mode), window: S(c.window), light: S(c.light), keg: num(S(c.keg_level)), pouring: S(c.pouring), batt: num(S(c.battery_level)), zone2: num(S(c.zone2_temperature)), zone2Ent: S(c.zone2_temperature),
      lampE: S(c.lamp_hours), picMode: S(c.picture_mode), tank: S(c.tank_full), fanSpeed: S(c.fan_speed), targetHum: S(c.target_humidity), cleanW: S(c.clean_water), dirtyW: S(c.dirty_water), pm25: S(c.pm25), filterE: S(c.filter),
      status: "idle", phase: null, alerts: [],
    };
    if (main && ["water_heater", "climate"].includes(domainOf(c.entity))) {
      if (!m.temp && main.attributes.current_temperature != null) m.tempVal = main.attributes.current_temperature;
      if (!m.target && main.attributes.temperature != null) m.targetVal = main.attributes.temperature;
      // humidité du thermostat (current_humidity) quand aucun capteur n'est choisi
      if (!c.humidity && Number.isFinite(Number(main.attributes.current_humidity ?? NaN))) m.humidity = Number(main.attributes.current_humidity);
    }
    // déshumidificateur : entité humidifier, humidité mesurée (current_humidity) et consigne (humidity)
    if (main && domainOf(c.entity) === "humidifier") {
      const a = main.attributes || {};
      if (!c.humidity && Number.isFinite(Number(a.current_humidity ?? NaN))) m.humidity = Number(a.current_humidity);
      if (!c.target_humidity && Number.isFinite(Number(a.humidity ?? NaN))) m.targetHumVal = Number(a.humidity);
    }
    if (m.targetHumVal == null) m.targetHumVal = m.targetHum && domainOf(c.target_humidity) === "humidifier"
      ? (Number.isFinite(Number(m.targetHum.attributes.humidity ?? NaN)) ? Number(m.targetHum.attributes.humidity) : null) : num(m.targetHum);
    // une entité climate / water_heater dans temperature ou target_temperature : son état est un mode (« off », « heat »),
    // les valeurs sont dans current_temperature et temperature
    const tOf = (st, key) => (st && ["climate", "water_heater"].includes(domainOf(st.entity_id))
      ? (st.attributes[key] != null && Number.isFinite(Number(st.attributes[key])) ? Number(st.attributes[key]) : null) : num(st));
    if (m.tempVal == null) m.tempVal = tOf(m.temp, "current_temperature");
    if (m.targetVal == null) m.targetVal = tOf(m.target, "temperature");
    m.tempUnit = m.temp?.attributes.unit_of_measurement || hass.config?.unit_system?.temperature || "°C";
    // four à deux cavités (cavities: 2) : température, consigne, temps restant et état de la cavité 2 ; en cuisson d'après l'état (en cours,
    // chauffe…) ou, sans entité d'état, d'après la température ≥ 50 °C
    if (kind === "oven" && Number(c.cavities) === 2) {
      m.dual = true; m.st2 = S(c.status_2);
      m.temp2 = num(S(c.temperature_2)); m.target2 = num(S(c.target_temperature_2)); m.remaining2 = parseRemaining(S(c.remaining_2));
      const raw2 = m.st2 ? String(m.st2.state).toLowerCase() : "";
      m.active2 = m.st2 ? /running|cooking|heating|preheat|en cours|chauff|cuisson|^on$|^true$/.test(raw2) : m.temp2 != null && m.temp2 >= 50;
    }
    // frigo : option temperature_unit (C / F). Les valeurs sont converties depuis l'unité de chaque capteur ; les seuils saisis
    // sont dans l'unité choisie, les seuils par défaut (écrits en °C) sont convertis. Sans l'option, rien ne change.
    if (["fridge", "wine_cooler", "chest_freezer", "drawer_freezer"].includes(kind) && c.temperature_unit && window.applianceTemp) {
      m.T = window.applianceTemp(hass, c);
      m.tempUnit = m.T.unit;
      if (m.tempVal != null) m.tempVal = m.T.conv(m.tempVal, m.temp);
      if (m.zone2 != null) m.zone2 = m.T.conv(m.zone2, m.zone2Ent);
    }
    m.nozzles = kind === "printer_3d" ? this._nozzles() : [];
    if (m.nozzles.length) {
      const t = m.nozzles.map((i) => num(S(i))).filter((v) => v != null);
      if (t.length) m.tempVal = Math.max(...t);
    }

    const ref = main || sw;
    const mainIds = ["entity", "power", "power_solar", "switch", "switch_low", "switch_high", "temperature", "zone_1", "zone_2", "zone_3", "zone_4"].map((k) => c[k]).filter(Boolean)
      .concat(kind === "power_strip" && Array.isArray(c.outlets) ? c.outlets.filter((i) => typeof i === "string" && i) : []); // multiprise : les prises comptent
    // lave-linge / sèche-linge / lave-vaisselle : « none » (SmartThings job_state au repos) est un état valide = au repos, pas « indisponible »
    const noneIdle = ["washer", "washer_dryer", "dryer", "dishwasher"].includes(kind);
    const usable = mainIds.some((i) => hass.states[i] && (!BAD.includes(String(hass.states[i].state).toLowerCase()) || (noneIdle && String(hass.states[i].state).toLowerCase() === "none")));
    if (!usable) { m.status = "unavailable"; return m; }
    let base = null;
    if (ref) {
      const s = String(ref.state).toLowerCase();
      const dom = domainOf(main ? c.entity : c.switch);
      if (noneIdle && s === "none") base = "idle";
      else if (BAD.includes(s)) base = null;
      else if (DONE_STATES.includes(s)) base = "finished";
      else if (OFF_STATES.includes(s)) {
        base = ["standby", "veille", "espera", "en espera", "reposo"].includes(s) ? "standby"
          : ["idle", "inactive", "inactif", "ready", "stopped", "stop", "pause", "paused", "pausar", "parado", "pausa por retirada de cesta", "precalentamiento en pausa"].includes(s) ? "idle"
          : ["input_boolean", "binary_sensor"].includes(dom) ? "idle" : "off";
      }
      // a plug/switch being "on" only means powered: let the power sensor decide
      else if (["switch", "light", "water_heater", "climate", "fan"].includes(dom)) base = "on";
      // input_boolean / binary_sensor "on", or a descriptive sensor state, means running
      else base = "running";
    }
    /* un état explicite (binary_sensor / input_boolean) prime sur la puissance : la prise peut être coupée alors que l'appareil tourne */
    const explicitState = !!main && ["input_boolean", "binary_sensor"].includes(domainOf(c.entity)) && !BAD.includes(String(main.state).toLowerCase());
    if (base === null && !pw && !pwS && ref) base = "unavailable";
    const powered = watts !== null && watts > threshold;
    if (base === "on" || base === null) {
      if (watts !== null) base = powered ? "running" : (base === "on" ? "standby" : "idle");
      else base = base === "on" ? "running" : "idle";
    }
    if (base === "finished" && powered) base = "running";
    if (sw && String(sw.state).toLowerCase() === "off" && base !== "unavailable") base = "off";

    m.solarHeat = kind === "water_heater" && wSolar !== null && wSolar > threshold;
    if (kind === "water_heater") {
      // eau chaude restante : hot_water_level (%) ou hot_water_volume (L) ; tank_volume (L, nombre ou entité) fait le lien entre les deux
      const lvl = num(S(c.hot_water_level)), vol = num(S(c.hot_water_volume));
      const cap = typeof c.tank_volume === "string" ? num(S(c.tank_volume)) : Number(c.tank_volume);
      const capOk = Number.isFinite(cap) && cap > 0;
      const pct = lvl != null ? lvl : vol != null && capOk ? (vol / cap) * 100 : null;
      m.hotPct = pct == null ? null : Math.max(0, Math.min(100, pct));
      m.hotL = vol != null ? vol : lvl != null && capOk ? (lvl * cap) / 100 : null;
      if (base === "off" || base === "unavailable") m.status = base;
      else if (powered || (watts === null && base === "running")) m.status = "heating";
      else m.status = "ready";
    } else if (kind === "oven") {
      if (["off", "idle", "standby", "unavailable", "finished"].includes(base)) m.status = base === "standby" ? "off" : base;
      else if (m.tempVal != null && m.targetVal != null && m.tempVal < m.targetVal - 5) m.status = "preheating";
      else m.status = "heating";
    } else if (kind === "pellet_stove") {
      const raw = main ? `${main.state} ${main.attributes.hvac_action || ""} ${main.attributes.status || ""}`.toLowerCase() : "";
      const ign = c.ignition_threshold ?? 250;
      const byPower = () => (watts > ign ? "ignition" : powered ? "heating" : "standby");
      if (/alarm|alarme|error|erreur|d[eé]faut|fault|bloqu|block/.test(raw)) m.status = "alarm";
      else if (/allum|ignit|d[eé]marr|start|pr[eé]chauf|preheat|charg/.test(raw)) m.status = "ignition";
      else if (/extin|shut.?down|cool|refroid|clean|nettoy/.test(raw)) m.status = "extinguishing";
      else if (base === "off" || base === "unavailable") m.status = base;
      else if (main && ["climate", "water_heater"].includes(domainOf(c.entity))) {
        const act = String(main.attributes.hvac_action || "").toLowerCase();
        m.status = act === "off" ? "off" : act === "heating" ? (watts !== null ? (watts > ign ? "ignition" : "heating") : "heating")
          : act ? "standby" : (watts !== null ? byPower() : "heating");
      }
      else if (/eco|veille|standby|attente|wait/.test(raw)) m.status = "standby";
      else if (watts !== null) m.status = base === "idle" && !powered ? "off" : byPower();
      else m.status = base === "running" ? "heating" : base === "standby" ? "standby" : "off";
      if (m.pellets != null && m.pellets < (c.pellet_alert ?? 15)) m.alerts.push("pellets_low");
    } else if (kind === "dosing_pump") {
      m.status = base === "running" ? "dosing" : base;
    } else if (FIT_KINDS.includes(kind)) {
      m.status = base === "running" ? "in_use" : base;
    } else if (kind === "pool_pump") {
      m.status = base === "running" ? "filtering" : base;
      // piscine : manque d'eau (capteur ou détecteur de porte) = alerte rouge ; présence = tuile
      if (isOn(S(c.low_water))) m.alerts.push("low_water");
      m.presence = S(c.presence);
    } else if (kind === "printer") {
      // imprimante / scanner sur prise connectée : puissance > print_threshold (100 W) = impression, > scan_threshold (45 W) = numérisation,
      // >= standby_threshold (1 W) = veille ; une entité d'état texte (IPP...) prime si elle le dit explicitement
      const raw = main && !["switch", "light", "input_boolean", "binary_sensor"].includes(domainOf(c.entity)) ? String(main.state).toLowerCase() : "";
      if (base === "unavailable" || base === "off" || (sw && !isOn(sw))) m.status = base === "unavailable" ? base : "off";
      else if (/error|erreur|jam|bourrage|fault|d[eé]faut/.test(raw)) m.status = "failed";
      else if (/scan|num[eé]ris/.test(raw)) m.status = "scanning";
      else if (/print|impress|processing|busy/.test(raw)) m.status = "printing";
      else if (watts !== null) m.status = watts > (c.print_threshold ?? c.threshold ?? 100) ? "printing" : watts > (c.scan_threshold ?? 45) ? "scanning" : watts >= (c.standby_threshold ?? 1) ? "standby" : "off";
      // capteur d'état texte sans prise (Brother, IPP…) : veille / prête / en attente = veille ; sommeil profond, éteinte = éteinte
      else if (raw && /deep.?sleep|hibernat|power.?off|[eé]teint|sommeil.?prof/.test(raw)) m.status = "off";
      else if (raw && /idle|ready|wait|sleep|standby|veille|attente|pr[eê]t|warm|cool|chauff|refroid|inactive/.test(raw)) m.status = "standby";
      else m.status = base === "running" || base === "on" ? "standby" : "off";
      // niveaux d'encre (barres colorées), quel que soit le modèle : noir, cyan, magenta, jaune, ou une cartouche tri-couleur (ink_color).
      // Cyan, magenta et jaune pointant vers le même capteur (cartouche tri-couleur) donnent une seule jauge « Couleur ».
      {
        let inks = [["k", "ink_black", c.ink_black], ["c", "ink_cyan", c.ink_cyan], ["m", "ink_magenta", c.ink_magenta], ["y", "ink_yellow", c.ink_yellow], ["t", "ink_color", c.ink_color]].filter((x) => x[2]);
        const cmy = inks.filter((x) => ["c", "m", "y"].includes(x[0]));
        if (cmy.length > 1 && cmy.every((x) => x[2] === cmy[0][2]) && !inks.some((x) => x[0] === "t" && x[2] !== cmy[0][2])) {
          inks = inks.filter((x) => !["c", "m", "y", "t"].includes(x[0])).concat([["t", "ink_color", cmy[0][2]]]);
        }
        if (inks.length) {
          const low = Number(c.ink_low) > 0 ? Number(c.ink_low) : 15;
          m.ink = inks.map(([k, key, id]) => { const v = num(S(id)); return { k, key, id, v: v == null ? null : Math.max(0, Math.min(100, v)), low: v != null && v < low }; });
          if (m.ink.some((i) => i.low) && m.status !== "unavailable") m.alerts.push("ink_low");
        }
      }
      // Brother MFC-J5955DW : message de l'imprimante (alerte)
      if (/^brother|mfc.?j5955/i.test(String(c.model || ""))) {
        const msg = c.status_message ? S(c.status_message) : null, mt = msg ? String(msg.state).trim() : "";
        if (mt && !BAD.includes(mt.toLowerCase()) && !/^(ok|ready|idle|waiting|sleep|none|no error|aucun|pr[eê]te?|normal|(en )?espera|listo|lista|reposo|inactiv[oa]|ninguno|sin errores?|bereit|leerlauf|in attesa|pronto|inattiv[oa]|em espera|pronta)$/i.test(mt)) m.alerts.push(mt);
      }
    } else if (kind === "printer_3d") {
      const raw = main ? `${main.state}`.toLowerCase() : "";
      if (/fail|error|erreur|[eé]chec/.test(raw)) m.status = "failed";
      else if (/paus/.test(raw)) m.status = "paused";
      else if (/finish|done|complete|termin|fini/.test(raw)) m.status = "finished";
      else if (/prepar|heat|chauff|preheat|calibr|level|homing|init/.test(raw)) m.status = "heating";
      else if (/print|running|impression|en cours|busy|slicing/.test(raw)) m.status = "printing";
      else if (/offline|hors ligne/.test(raw)) m.status = "off";
      else if (/idle|ready|pr[eê]t|operational|standby/.test(raw)) m.status = powered ? "printing" : "ready";
      else if (base === "running") m.status = "printing";
      else if (base === "standby" || base === "idle") m.status = main || sw ? "ready" : "off";
      else m.status = base;
      // lampe de la tête : l'entité light si elle est configurée, sinon allumée pendant la chauffe et l'impression
      m.lights = m.light ? isOn(m.light) : (m.status === "printing" || m.status === "heating");
    } else if (kind === "radiator") {
      const isClimate = main && domainOf(c.entity) === "climate";
      const act = isClimate ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      m.radMode = modeOf(m, main, c);
      if (base === "unavailable") m.status = "unavailable";
      else if (m.radMode === "off" || base === "off" || act === "off" || (isClimate && main.state === "off")) m.status = "off";
      else if (act === "heating" || (watts != null && powered) || (watts == null && !isClimate && base === "running")) m.status = "heating";
      else m.status = "standby";
      m.heat = m.status !== "heating" ? 0 : watts != null ? Math.max(0.3, Math.min(1, watts / (c.max_power || 1500))) : 0.8;
      if (isOn(m.window)) m.alerts.push("window_open");
    } else if (kind === "hob") {
      const zp = c.zone_power || 1500;
      const lvlOf = (st) => {
        if (!st || BAD.includes(String(st.state).toLowerCase())) return null;
        const t = String(st.state).toLowerCase(), n = parseFloat(t), u = String(st.attributes.unit_of_measurement || "");
        if (/boost|^p$|power/.test(t)) return 9;
        if (["off", "arret", "arrêt", "0"].includes(t)) return 0;
        if (!Number.isFinite(n)) return t === "on" ? 5 : 0;
        if (u === "W") return Math.max(0, Math.min(9, Math.round(n / zp * 9)));
        if (u === "kW") return Math.max(0, Math.min(9, Math.round(n * 1000 / zp * 9)));
        if (u === "%") return Math.max(0, Math.min(9, Math.round(n / 100 * 9)));
        return Math.max(0, Math.min(9, Math.round(n)));
      };
      let zl = [1, 2, 3, 4].map((i) => lvlOf(S(c[`zone_${i}`])));
      if (zl.every((v) => v == null)) {
        // no per-zone data: spread the total power over zones (front-left, back-right, front-right, back-left)
        zl = [0, 0, 0, 0];
        if (base !== "off" && base !== "unavailable" && watts != null && watts > threshold) {
          const n = Math.max(1, Math.min(4, Math.ceil(watts / (zp * 1.4))));
          const per = watts / n;
          const lv = Math.max(1, Math.min(9, Math.round(per / zp * 9)));
          [0, 3, 1, 2].slice(0, n).forEach((z) => { zl[z] = lv; });
        } else if (watts == null && base === "running") {
          // pas de capteur de puissance : l'état de `entity` (binary_sensor, sensor d'état "run"…) suffit pour « en marche »
          zl[0] = 5;
        }
      } else zl = zl.map((v) => v ?? 0);
      const now = Date.now(), keep = (c.residual_minutes ?? 10) * 60000;
      this._hot = this._hot || [0, 0, 0, 0];
      zl.forEach((v, i) => { if (v > 0) this._hot[i] = now; });
      m.zones = zl;
      m.residualZones = zl.map((v, i) => v === 0 && this._hot[i] && now - this._hot[i] < keep);
      m.activeZones = zl.filter((v) => v > 0).length;
      if (base === "unavailable") m.status = "unavailable";
      else if (m.activeZones > 0) m.status = "cooking";
      else if (m.residualZones.some(Boolean)) m.status = "residual";
      else m.status = "off";
    } else if (kind === "vmc") {
      const sp = m.speed ? String(m.speed.state).toLowerCase() : "";
      const spn = num(m.speed);
      const hi = c.high_threshold ?? 35;
      // entité fan : preset_mode (texte) puis percentage, si aucun capteur `speed` n'est fourni
      const isFan = !m.speed && main && domainOf(c.entity) === "fan";
      const fPre = isFan ? String(main.attributes.preset_mode || "").toLowerCase() : "", fPct = isFan ? Number(main.attributes.percentage) : NaN;
      // VMC simple flux à deux interrupteurs (petite / grande vitesse) : grande vitesse allumée = vitesse 2, petite = vitesse 1
      const swL = c.switch_low ? hass.states[c.switch_low] : null, swH = c.switch_high ? hass.states[c.switch_high] : null;
      if (swL || swH) {
        m.status = swH && isOn(swH) ? "speed2" : swL && isOn(swL) ? "speed1" : [swL, swH].every((s) => !s || BAD.includes(String(s.state).toLowerCase())) ? "unavailable" : "off";
      } else if (base === "off" || base === "unavailable") m.status = base;
      else if (isFan && /boost|grande|high|max|rapide|fast|gv/.test(fPre)) m.status = "speed2";
      else if (isFan && /petite|low|eco|lente|slow|min|pv|auto|normal/.test(fPre)) m.status = "speed1";
      else if (isFan && Number.isFinite(fPct) && fPct > 0) m.status = fPct > 60 ? "speed2" : "speed1";
      else if (m.speed && !BAD.includes(sp) && /boost|grande|high|max|rapide|fast|gv/.test(sp)) m.status = "speed2";
      else if (m.speed && !BAD.includes(sp) && /petite|low|eco|lente|slow|min|pv|auto|normal/.test(sp)) m.status = "speed1";
      else if (spn != null && spn > 0) m.status = (String(m.speed.attributes.unit_of_measurement || "") === "%" ? spn > 60 : spn >= 2) ? "speed2" : "speed1";
      else if (spn === 0) m.status = "off";
      else if (watts != null) m.status = watts > hi ? "speed2" : powered ? "speed1" : (base === "standby" ? "standby" : "off");
      else m.status = base === "running" ? "speed1" : base;
      // Ventoxx Harmony (push-pull) : entité de sens (Befúvás = soufflage, Elszívás = extraction, Inaktív) avec attributs speed (1-3) et dstate (1 = extraction, 2 = soufflage)
      const dr = c.direction ? hass.states[c.direction] : null;
      if (dr && !BAD.includes(String(dr.state).toLowerCase())) {
        const ds = String(dr.state).toLowerCase(), at = dr.attributes || {}, dst = Number(at.dstate), spd = Number(at.speed);
        m.vxDir = /bef|supply|intake|zuluft|souffl|insuff/.test(ds) || (!/elsz|extract|exhaust|abluft|evac/.test(ds) && dst === 2) ? "supply"
          : /elsz|extract|exhaust|abluft|evac|aspir/.test(ds) || dst === 1 ? "extract" : null;
        m.vxState = m.vxDir ? tr(hass, m.vxDir === "supply" ? "vx_supply" : "vx_extract") : stateText(hass, dr);
        if (m.vxDir && Number.isFinite(spd) && spd > 0) { m.vxSpeed = Math.max(1, Math.min(3, Math.round(spd))); m.status = m.vxSpeed >= 3 ? "speed2" : "speed1"; }
        else if (!m.vxDir) m.status = "off";
      } else if (m.status === "speed1" || m.status === "speed2") { m.vxSpeed = m.status === "speed2" ? 3 : 1; }
      if (m.humidity != null && m.humidity > (c.humidity_max ?? 70)) m.alerts.push("humid");
    } else if (kind === "solar") {
      const sunSt = hass.states[c.sun_entity || "sun.sun"];
      const hr = new Date().getHours();
      const night = sunSt ? sunSt.state === "below_horizon" : (hr >= 21 || hr < 6);
      m.frac = watts != null ? Math.max(0, Math.min(1, watts / (c.max_power || 3000))) : 0;
      if (base === "unavailable") m.status = "unavailable";
      else if (watts != null && watts > threshold) m.status = m.frac < 0.15 ? "low" : "producing";
      else m.status = night ? "night" : "idle";
    } else if (kind === "chest_freezer" || kind === "drawer_freezer") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered ? "cooling" : "standby";
      if (m.tempVal != null && m.tempVal > (c.freezer_max_temperature ?? c.max_temperature ?? (m.T ? m.T.c(-12) : -12))) m.alerts.push("too_warm");
    } else if (kind === "ac_split" || kind === "heat_pump") {
      const isClim = main && domainOf(c.entity) === "climate";
      const mode = isClim ? String(main.state).toLowerCase() : null;
      const act = isClim ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      const hint = String(c.hvac || "auto").toLowerCase(), mon = new Date().getMonth();
      const guess = hint === "cool" || hint === "clim" ? "cooling" : hint === "heat" || hint === "chauffage" ? "heating" : (mon >= 4 && mon <= 8 ? "cooling" : "heating");
      const fromMode = (md) => ({ cool: "cooling", heat: "heating", dry: "ac_dry", fan_only: "ac_fan" }[md]);
      if (isClim && BAD.includes(mode)) m.status = "unavailable";
      else if (mode === "off" || (!isClim && ["off", "unavailable"].includes(base))) m.status = mode === "off" ? "off" : base;
      else if (act && act !== "off") m.status = ({ cooling: "cooling", heating: "heating", preheating: "heating", drying: "ac_dry", fan: "ac_fan", idle: "at_target", defrosting: "defrost" }[act]) || fromMode(mode) || guess;
      else if (mode) m.status = (watts !== null && !powered && !["fan_only", "dry"].includes(mode)) ? "at_target" : (fromMode(mode) || guess);
      else if (watts !== null) m.status = powered ? guess : "off";
      else m.status = base === "running" || base === "on" ? guess : "off";
      // puissance sous le seuil : le groupe extérieur ne tourne pas (veille du contrôleur), on ignore hvac_action/mode
      if (watts !== null && !powered && (m.status === "cooling" || m.status === "heating")) m.status = "at_target";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      m.acMode = mode && mode !== "off" ? mode : null;
      m.accent = m.status === "heating" ? "heat" : "cold";
    } else if (kind === "fan" || kind === "ceiling_fan") {
      const isFan = main && domainOf(c.entity) === "fan", fs = isFan ? String(main.state).toLowerCase() : "";
      let lvl = 0, st = null;
      if (isFan && !BAD.includes(fs)) {
        if (fs === "on") { const p = Number(main.attributes.percentage); lvl = Number.isFinite(p) && p > 0 ? (p <= 34 ? 1 : p <= 67 ? 2 : 3) : 2; m.pct = Number.isFinite(p) ? p : null; }
      } else if (["off", "unavailable"].includes(base)) st = base;
      else if (watts !== null) {
        lvl = watts > (c.high_threshold ?? 40) ? 3 : watts > (c.mid_threshold ?? 30) ? 2 : powered ? 1 : 0;
        if (!lvl) st = watts >= (c.standby_threshold ?? 0.3) ? "standby" : "off";
      } else lvl = ["running", "on"].includes(base) ? 2 : 0;
      m.status = st || (lvl ? `fan_${lvl}` : "off");
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (kind === "fan") m.osc = isFan && main.attributes.oscillating != null ? !!main.attributes.oscillating : c.oscillating !== false;
      else {
        // ventilateur de plafond : lampe intégrée (entité `light`), « lumière seule » si les pales sont à l'arrêt
        m.lights = c.show_light !== false && isOn(m.light);
        if (m.lights && m.status === "off" && base !== "unavailable") m.status = "lights";
      }
    } else if (kind === "air_purifier") {
      // vitesse : entité fan (pourcentage), sinon la puissance de la prise (FÖRNUFTIG : bouton 3 vitesses, pas d'entité)
      const isFan = main && domainOf(c.entity) === "fan", fs = isFan ? String(main.state).toLowerCase() : "";
      const fromPct = (p) => (p <= 34 ? 1 : p <= 67 ? 2 : 3);
      let lvl = 0, st = null;
      if (isFan && !BAD.includes(fs)) {
        if (fs === "on") { const p = Number(main.attributes.percentage); lvl = Number.isFinite(p) && p > 0 ? fromPct(p) : 2; m.pct = Number.isFinite(p) ? p : null; }
      } else if (["off", "unavailable"].includes(base)) st = base;
      else if (watts !== null) lvl = watts > (c.high_threshold ?? 9) ? 3 : watts > (c.mid_threshold ?? 5) ? 2 : powered ? 1 : 0;
      else lvl = ["running", "on"].includes(base) ? 2 : 0;
      // fan_speed (select 1 / 2 / 3, nuit, turbo…, nombre ou %) prime sur l'estimation par la puissance
      const sp = m.fanSpeed, spTxt = sp && !BAD.includes(String(sp.state).toLowerCase()) ? String(sp.state).toLowerCase() : "";
      if (lvl && spTxt) {
        const spDom = domainOf(c.fan_speed), spPct = spDom === "fan" ? Number(sp.attributes.percentage) : num(sp) ?? NaN;
        if (Number.isFinite(spPct)) lvl = spPct > 3 || spDom === "fan" ? fromPct(spPct) : Math.max(1, Math.min(3, Math.round(spPct)));
        else if (/silen|quiet|sleep|night|nuit|low|bas|faible|min|eco/.test(spTxt)) lvl = 1;
        else if (/high|haut|fort|max|turbo|boost/.test(spTxt)) lvl = 3;
      }
      m.status = st || (lvl ? `fan_${lvl}` : "off");
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      // qualité de l'air (PM2.5, µg/m³) et filtre (% de vie restante, ou binary_sensor « à remplacer »)
      m.pm = num(m.pm25);
      if (m.pm != null && m.pm > (c.pm25_max ?? 35)) m.alerts.push("air_poor");
      const fv = m.filterE && !BAD.includes(String(m.filterE.state).toLowerCase()) ? m.filterE : null;
      m.filterBin = !!fv && ["binary_sensor", "input_boolean"].includes(domainOf(c.filter));
      m.filterPct = fv && !m.filterBin ? num(fv) : null;
      m.filterBad = !!fv && (m.filterBin ? isOn(fv) : m.filterPct != null ? m.filterPct <= (c.filter_alert ?? 10) : /replace|remplac|wechsel|change|expired/.test(String(fv.state).toLowerCase()));
      if (m.filterBad && m.status !== "unavailable") m.alerts.push("replace_filter");
    } else if (kind === "beer_tap") {
      if (["off", "unavailable"].includes(base)) m.status = base;
      else if (isOn(m.pouring)) m.status = "pouring";
      else if (watts !== null) m.status = watts > threshold ? "cooling" : watts >= (c.standby_threshold ?? 0.3) ? "ready" : "off";
      else m.status = base === "running" ? "cooling" : "ready";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (m.keg != null && m.keg <= (c.keg_alert ?? 10) && m.status !== "off") m.alerts.push("keg_low");
    } else if (kind === "av_receiver") {
      const isMp = main && domainOf(c.entity) === "media_player", ms = isMp ? String(main.state).toLowerCase() : "";
      const a = isMp ? (main.attributes || {}) : {};
      if (isMp && !BAD.includes(ms)) m.status = ["on", "playing", "idle", "buffering"].includes(ms) ? "playing" : ms === "paused" ? "paused" : ms === "standby" ? "standby" : "off";
      else if (["off", "unavailable"].includes(base)) m.status = base;
      else if (watts !== null) m.status = watts > threshold ? "playing" : watts >= (c.standby_threshold ?? 0.2) ? "standby" : "off";
      else m.status = base === "running" ? "playing" : "standby";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (m.status === "playing" && a.is_volume_muted) m.status = "muted";
      m.vol = a.volume_level != null ? Number(a.volume_level) : null;
      m.source = a.source || null;
      const maxP = c.max_power ?? 250;
      m.amp = m.vol != null ? m.vol : (watts !== null ? Math.max(.25, Math.min(1, watts / maxP)) : .6);
    } else if (kind === "smart_speaker") {
      // media_player : lecture / pause / inactif / veille / éteint, sourdine ; sans media_player, la prise (puissance) fait foi
      const isMp = main && domainOf(c.entity) === "media_player", ms = isMp ? String(main.state).toLowerCase() : "";
      const a = isMp ? (main.attributes || {}) : {};
      if (isMp && !BAD.includes(ms)) m.status = ["playing", "buffering"].includes(ms) ? "playing" : ms === "paused" ? "paused" : ["idle", "on"].includes(ms) ? "idle" : ms === "standby" ? "standby" : "off";
      else if (["off", "unavailable"].includes(base)) m.status = base;
      else if (watts !== null) m.status = watts > threshold ? "playing" : watts >= (c.standby_threshold ?? 0.5) ? "idle" : "off";
      else m.status = base === "running" ? "playing" : "idle";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      m.muted = !!a.is_volume_muted;
      if (m.status === "playing" && m.muted) m.status = "muted";
      m.vol = a.volume_level != null && Number.isFinite(Number(a.volume_level)) ? Number(a.volume_level) : null;
      m.app = a.app_name || a.source || null;
      m.track = [a.media_artist, a.media_title].filter(Boolean).join(" · ") || null;
      m.amp = m.vol != null ? m.vol : 0.5;
    } else if (kind === "tv") {
      const dom = main ? domainOf(c.entity) : null, ms = main ? String(main.state).toLowerCase() : "";
      if (dom === "media_player" && !BAD.includes(ms)) {
        m.status = ["on", "playing", "paused", "idle", "buffering"].includes(ms) ? "screen_on" : ms === "standby" ? "standby" : "off";
        if (watts !== null && m.status !== "screen_on" && watts > threshold) m.status = "screen_on";
      } else if (["off", "unavailable"].includes(base)) m.status = base;
      else if (watts !== null) m.status = watts > threshold ? "screen_on" : watts >= (c.standby_threshold ?? 0.2) ? "standby" : "off";
      else m.status = base === "running" ? "screen_on" : "standby";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
    } else if (kind === "range_hood") {
      const sp = m.speed ? String(m.speed.state).toLowerCase() : "", spn = num(m.speed);
      const hi = c.high_threshold ?? 130, lightT = c.light_threshold ?? 3;
      if (base === "off" || base === "unavailable") m.status = base;
      else if (m.speed && !BAD.includes(sp) && /boost|grande|high|max|rapide|fast|3|intensi/.test(sp)) m.status = "speed2";
      else if (m.speed && !BAD.includes(sp) && /petite|low|eco|lente|slow|min|1|2|moyen|medium/.test(sp)) m.status = "speed1";
      else if (spn === 0) m.status = "off";
      else if (watts !== null) m.status = watts > hi ? "speed2" : powered ? "speed1" : watts > lightT ? "lights" : "off";
      else m.status = base === "running" ? "speed1" : base === "standby" ? "off" : base;
      m.lights = m.light ? isOn(m.light) : (m.status === "lights" || ((m.status === "speed1" || m.status === "speed2") && c.light === undefined && watts !== null && watts > threshold));
    } else if (kind === "towel_dryer") {
      // entité climate : hvac_action fait foi (heating / idle / off), hvac_mode seulement en repli
      const isClimate = main && domainOf(c.entity) === "climate";
      const act = isClimate ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      m.radMode = modeOf(m, main, c);
      if (base === "off" || base === "unavailable") m.status = base;
      else if (m.radMode === "off" || act === "off" || (isClimate && main.state === "off")) m.status = "off";
      else if (act === "heating" || powered || (watts === null && !act && base === "running" && !m.mode)) m.status = "heating";
      else m.status = act || base === "standby" || isOn(sw) || m.radMode ? "at_target" : "off";
    } else if (kind === "server_rack") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = powered ? "online" : watts > 0.5 ? "standby" : "off";
      else m.status = base === "running" ? "online" : base === "standby" ? "standby" : "off";
      m.load = watts !== null ? Math.max(0, Math.min(1, watts / (c.max_power || 300))) : 0.4;
    } else if (kind === "ps5") {
      // PlayStation 5 : la prise fait foi (éteinte / mode repos / allumée / en jeu au-dessus de gaming_threshold) ;
      // le media_player PlayStation Network donne « en jeu » et le titre du jeu, et sert seul s'il n'y a pas de prise
      const isMp = main && domainOf(c.entity) === "media_player", ms = isMp ? String(main.state).toLowerCase() : "";
      const mpOk = isMp && !BAD.includes(ms), playing = mpOk && ms === "playing";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      else if (watts !== null) m.status = watts > threshold ? (playing || watts > (c.gaming_threshold ?? 100) ? "ps_gaming" : "screen_on") : watts >= (c.standby_threshold ?? 0.8) ? "ps_rest" : "off";
      else if (mpOk) m.status = playing ? "ps_gaming" : ["on", "idle", "paused", "buffering"].includes(ms) ? "screen_on" : "off";
      else m.status = base === "unavailable" ? "unavailable" : base === "running" ? "screen_on" : base === "standby" ? "ps_rest" : "off";
      m.game = m.status === "ps_gaming" && playing ? main.attributes.media_title || null : null;
    } else if (kind === "desktop_pc" || kind === "laptop" || kind === "monitor") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (explicitState) m.status = base === "running" ? "screen_on" : powered ? "standby" : "off";
      else if (watts !== null) m.status = powered ? "screen_on" : watts >= (c.standby_threshold ?? (kind === "monitor" ? 0.3 : 0.5)) ? "standby" : "off";
      else m.status = base === "running" ? "screen_on" : "standby";
    } else if (kind === "dehumidifier") {
      // entité humidifier : action (drying / idle / off) fait foi, sinon la puissance, sinon humidité ≤ consigne
      const isHum = main && domainOf(c.entity) === "humidifier";
      const act = isHum ? String(main.attributes.action || "").toLowerCase() : "";
      const reached = m.humidity != null && m.targetHumVal != null && m.humidity <= m.targetHumVal;
      if (base === "off" || base === "unavailable") m.status = base;
      else if (act === "off") m.status = "off";
      else if (act === "drying") m.status = "drying";
      else if (act === "idle") m.status = "at_target";
      else if (watts !== null) m.status = powered ? "drying" : watts >= (c.standby_threshold ?? 1) || isHum ? "at_target" : "off";
      else m.status = reached ? "at_target" : "drying";
      // bac plein : binary_sensor « on » ou texte (full, plein…) ; l'appareil s'arrête
      const tk = m.tank ? String(m.tank.state).toLowerCase() : "";
      m.tankFull = isOn(m.tank) || /full|plein|voll|vol\b|pieno|lleno/.test(tk);
      if (m.tankFull && m.status !== "unavailable") { m.alerts.push("empty_tank"); if (m.status !== "off") m.status = "tank_full"; }
      if (c.humidity_max != null && m.humidity != null && m.humidity > c.humidity_max && m.status !== "off") m.alerts.push("humid");
      // vitesse du ventilateur : pourcentage, entité fan, ou texte (silence / bas / moyen / haut / turbo)
      const fs = m.fanSpeed, fsTxt = fs ? String(fs.state).toLowerCase() : "";
      const fsDom = domainOf(c.fan_speed), pct = !fs ? NaN : fsDom === "fan" ? Number(fs.attributes.percentage) : num(fs) ?? NaN;
      let lvl = 2;
      // 0 à 3 : numéro de vitesse ; au-delà : pourcentage
      if (Number.isFinite(pct)) lvl = pct > 3 || fsDom === "fan" ? (pct <= 34 ? 1 : pct <= 67 ? 2 : 3) : Math.max(1, Math.round(pct));
      else if (/silen|quiet|sleep|night|nuit|low|bas|faible|lent|min|eco/.test(fsTxt)) lvl = 1;
      else if (/high|haut|fort|[eé]lev|max|turbo|boost|rapide|fast|strong/.test(fsTxt)) lvl = 3;
      m.spd = fs ? [0, .55, 1, 1.6][lvl] : 1;
      const md = m.mode && !BAD.includes(String(m.mode.state).toLowerCase()) ? m.mode : null;
      const attrTxt = (st, k) => { try { if (hass.formatEntityAttributeValue) return hass.formatEntityAttributeValue(st, k); } catch (e) { /* ignore */ } return String(st.attributes[k]); };
      m.dhMode = md ? stateText(hass, md) : isHum && main.attributes.mode ? attrTxt(main, "mode") : null;
    } else if (kind === "smart_plug") {
      // prise allumée (interrupteur) ou qui consomme : « On » ; interrupteur allumé mais rien ne consomme : « Veille »
      // interrupteur mis dans « entity » (switch, input_boolean, light) au lieu de « switch » : son état « on » compte aussi,
      // même si une faible conso a fait passer base de « on » à « standby »
      const entOn = !sw && !!main && ["switch", "input_boolean", "light"].includes(domainOf(c.entity)) && isOn(main);
      const swOn = isOn(sw) || entOn || (!sw && base === "on");
      const draws = watts !== null ? powered : base === "running";
      m.status = base === "off" || base === "unavailable" ? base : draws ? "powered" : swOn && watts !== null ? "standby" : swOn ? "powered" : "off";
    } else if (kind === "power_strip") {
      // sous tension si la prise / l'interrupteur est allumé, si ça consomme, ou si une des prises commandées est allumée
      const outs = (Array.isArray(c.outlets) ? c.outlets : []).map((i) => hass.states[i]);
      m.outlets = outs.map((o) => isOn(o));
      const on = (watts !== null && powered) || (watts === null && base === "running") || isOn(sw) || m.outlets.some(Boolean);
      m.status = base === "off" || base === "unavailable" ? base : on ? "powered" : "off";
    } else if (kind === "piano") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = powered ? "powered" : watts >= (c.standby_threshold ?? 0.3) ? "standby" : "off";
      else m.status = base === "running" ? "powered" : "off";
    } else if (kind === "garland") {
      // entité light : état, couleur et luminosité ; sinon la prise
      const isLight = main && domainOf(c.entity) === "light";
      const on = isLight ? isOn(main) : (watts !== null ? powered : base === "running");
      m.status = base === "unavailable" ? "unavailable" : on ? "lit" : "off";
      const a = isLight ? main.attributes || {} : {};
      m.glColor = Array.isArray(a.rgb_color) ? `rgb(${a.rgb_color.join(",")})` : null;
      m.glBri = a.brightness != null ? Math.max(.25, Number(a.brightness) / 255) : 1;
      m.glEffect = a.effect && !/^(none|off|aucun)$/i.test(a.effect) ? String(a.effect) : null;
    } else if (kind === "wet_vacuum") {
      // statut de l'intégration (vacuum ou texte) d'abord, sinon la prise de la base : au-dessus de selfclean_threshold
      // = auto-nettoyage, au-dessus du seuil = charge, sinon chargé (batterie pleine) ou appareil hors de la base
      const raw = main ? `${main.state} ${main.attributes.status || ""}`.toLowerCase() : "";
      const full = m.batt != null && m.batt >= (c.full_level ?? 100);
      let st = null;
      if (/self.?clean|auto.?nett|autonett|selbstrein|zelfrein|rin[cç]|rinse|brush_clean|cleaning_roller/.test(raw)) st = "wv_selfclean";
      else if (/dry|s[eé]ch|trock|droog/.test(raw)) st = "wv_drying";
      else if (/charged|charg[eé]e\b|fully|complet|geladen/.test(raw)) st = "charged";
      else if (/charg|laden|docked/.test(raw)) st = full ? "charged" : "charging";
      else if (/clean|nettoy|wash|lav|mop|vacuum|aspir|working|running|in_use|reinig|schoonm/.test(raw)) st = "wv_cleaning";
      if (/error|erreur|fault|d[eé]faut|stuck|bloqu|fehler/.test(raw)) m.alerts.push("error");
      if (st) m.status = st;
      else if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = watts > (c.selfclean_threshold ?? 60) ? "wv_selfclean" : powered && !full ? "charging" : full || powered ? "charged" : "idle";
      else m.status = base === "running" ? "wv_cleaning" : full ? "charged" : "idle";
      // réservoirs : pourcentage, ou capteur binaire (on = vide pour l'eau propre, plein pour l'eau sale)
      const lvl = (st0) => {
        if (!st0 || BAD.includes(String(st0.state).toLowerCase())) return null;
        const n = num(st0);
        if (n != null && !["binary_sensor", "input_boolean"].includes(domainOf(st0.entity_id))) return Math.max(0, Math.min(100, n));
        const s = String(st0.state).toLowerCase();
        return { on: true, off: false, empty: true, vide: true, low: true, full: true, plein: true, ok: false, normal: false }[s] ?? null;
      };
      const cl = lvl(m.cleanW), dt = lvl(m.dirtyW);
      m.cleanPct = typeof cl === "number" ? cl : null;
      m.dirtyPct = typeof dt === "number" ? dt : null;
      m.cleanEmpty = typeof cl === "number" ? cl <= (c.clean_water_low ?? 10) : cl === true;
      m.dirtyFull = typeof dt === "number" ? dt >= (c.dirty_water_full ?? 90) : dt === true;
      m.battLow = m.batt != null && m.batt <= (c.battery_low ?? 20) && m.status !== "charging";
      if (m.status !== "unavailable") {
        if (m.cleanEmpty) m.alerts.push("clean_water_empty");
        if (m.dirtyFull) m.alerts.push("dirty_water_full");
        if (m.battLow) m.alerts.push("battery_low");
      }
    } else if (kind === "tool_charger" || kind === "phone_charger") {
      // > seuil : en charge ; petite conso résiduelle : batterie chargée (maintien) ; sinon socle vide / veille
      const full = m.batt != null && m.batt >= (c.full_level ?? 100);
      if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = powered && !full ? "charging" : full || watts >= (c.standby_threshold ?? (kind === "phone_charger" ? 0.3 : 1)) ? "charged" : "standby";
      else m.status = base === "running" && !full ? "charging" : full ? "charged" : "standby";
    } else if (kind === "coffee_maker") {
      const warmT = c.warm_threshold ?? 5;
      if (["off", "unavailable"].includes(base)) m.status = base;
      else if (base === "finished") m.status = "ready";
      else if (watts !== null) m.status = watts > threshold ? "brewing" : watts > warmT ? (cfStyle(c) === "filtre" ? "keep_warm" : "ready") : "idle";
      else m.status = base === "running" ? "brewing" : "idle";
    } else if (kind === "air_fryer") {
      m.status = base === "running" ? "cooking" : base === "standby" ? "idle" : base;
    } else if (kind === "thermomix") {
      // prise : éteint sous standby_threshold, veille (écran allumé) jusqu'à threshold, puis mixage / turbo / chauffe selon la puissance
      // (la résistance tire 600 à 1000 W, le moteur 20 à 80 W aux vitesses 1-4 et jusqu'à 500 W en turbo / vitesse 10)
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      else if (base === "unavailable") m.status = "unavailable";
      else if (watts !== null) {
        // chauffe = forte puissance continue (montée en température) ; cuisson = la résistance se coupe et se rallume
        // pour maintenir la température (forte / faible en alternance sur 90 s) ; mixage / turbo = moteur seul
        const heatW = c.heat_threshold ?? 650, win = 90000, now = Date.now();
        if (watts > heatW) {
          m.status = this._tmxLow && now - this._tmxLow < win ? "cooking" : "heating";
          this._tmxHeat = now;
        } else if (watts > threshold && this._tmxHeat && now - this._tmxHeat < win) {
          m.status = "cooking"; this._tmxLow = now;
        } else {
          m.status = watts > (c.turbo_threshold ?? 250) ? "turbo" : watts > threshold ? "mixing" : watts >= (c.standby_threshold ?? 0.5) ? "standby" : "off";
          if (m.status !== "turbo" && m.status !== "mixing") this._tmxHeat = this._tmxLow = 0;
        }
      }
      else m.status = base === "running" ? "mixing" : base === "off" ? "off" : "standby";
    } else if (kind === "cookeo") {
      // prise : éteint sous standby_threshold, veille (écran allumé) jusqu'à threshold ;
      // montée en température = résistance en continu (au-dessus de heat_threshold) ;
      // cuisson sous pression = la résistance se coupe et se rallume pour tenir la pression (alternance sur 2 min) ;
      // maintien au chaud = faible puissance sans chauffe récente
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      else if (base === "unavailable") m.status = "unavailable";
      else if (watts !== null) {
        const heatW = c.heat_threshold ?? 600, win = 120000, now = Date.now(), stby = c.standby_threshold ?? 0.5;
        if (watts > heatW) {
          m.status = this._ckoLow && now - this._ckoLow < win ? "cooking" : "heating";
          this._ckoHeat = now;
        } else if (watts >= stby && this._ckoHeat && now - this._ckoHeat < win) {
          m.status = "cooking"; this._ckoLow = now;
        } else {
          m.status = watts > threshold ? "keep_warm" : watts >= stby ? "standby" : "off";
          this._ckoHeat = this._ckoLow = 0;
        }
      }
      else m.status = base === "running" ? "cooking" : base === "finished" ? "finished" : base === "off" ? "off" : "standby";
    } else if (kind === "kettle" || kind === "toaster") {
      // en marche au-dessus du seuil ; après la coupure : « eau chaude » / « toasts prêts » pendant quelques minutes
      // bouilloire dont l'état est un capteur texte (ESPHome : ready / heating / cooling) : « heating » = en chauffe, « cooling » = eau chaude
      // ProfiCook ESPHome : Lifted (soulevée de son socle) / Standby / Heating / Cooling / Maintaining Temp (maintien au chaud)
      // textes d'état d'autres langues (ESPHome en polonais…) ramenés aux valeurs de référence
      const KT = [[/^podniesiony|^angehoben|^soulev/, "lifted"], [/^gotowy|^bereit|^pr[eê]t/, "standby"], [/^grzanie/, "heating"], [/^ch[lł]odzenie|^abk[uü]hl|^refroid/, "cooling"], [/^utrzymanie|^warmhalt|^maintien/, "maintaining"]];
      let rawK = kind === "kettle" && main && ["sensor", "select", "input_select"].includes(domainOf(c.entity)) ? String(main.state).toLowerCase().trim() : "";
      const kf = KT.find(([rx]) => rx.test(rawK));
      if (kf) { rawK = kf[1]; m.kettleForeign = true; }
      const textOn = /^(heating|boiling)$/.test(rawK), textCool = /^(cooling|maintaining)/.test(rawK);
      m.kettleLifted = rawK === "lifted";
      const knownK = /^(lifted|standby|heating|cooling|maintaining)/.test(rawK), on = knownK ? textOn : !textCool && (powered || textOn || (watts === null && base === "running")), now = Date.now();
      const keep = (kind === "kettle" ? c.hot_minutes ?? 5 : c.ready_minutes ?? 2) * 60000;
      if (on && base !== "unavailable") this._onAt = now;
      if (base === "unavailable") m.status = "unavailable";
      else if (on) m.status = kind === "kettle" ? "boiling" : "toasting";
      else if (textCool) m.status = "hot_water";
      else if (m.kettleLifted) m.status = "off";
      else if (kind === "kettle" && m.tempVal != null) m.status = m.tempVal >= (c.hot_temperature ?? 60) ? "hot_water" : "off";
      else m.status = this._onAt && now - this._onAt < keep ? (kind === "kettle" ? "hot_water" : "toast_ready") : "off";
      // bouilloire ESPHome / Tuya : entité « défaut » (binary_sensor allumé, ou capteur texte autre que « ok / aucun / none… »)
      const er = kind === "kettle" ? S(c.error) : null;
      if (er && !BAD.includes(String(er.state).toLowerCase()) && (domainOf(c.error) === "sensor" ? !/^(ok|none|no.?error|aucun[e]?|normal|false|0|off|-?)$/i.test(String(er.state).trim()) : isOn(er))) m.alerts.push("kettle_error");
      if (m.alerts.includes("kettle_error") && domainOf(c.error) === "sensor") m.kettleErr = String(er.state).trim();
      // consigne affichée = celle du mode choisi (45°, 60°, 85°, 100°, « 100° and off ») ; « Custom » garde la valeur du curseur, « Off » n'en a pas
      const mo = kind === "kettle" ? S(c.mode) : null;
      if (mo && ["select", "input_select"].includes(domainOf(c.mode))) {
        const mm = String(mo.state).match(/^(\d{2,3})\s*°/);
        if (mm) m.targetVal = Number(mm[1]); else if (/^(off|arr[eê]t|aus)$/i.test(String(mo.state).trim())) m.targetVal = null;
      }
    } else if (kind === "iron" || kind === "steam_station") {
      // prise : chauffe pendant preheat_minutes (2 min fer, 4 min centrale), puis prêt, et encore ready_minutes après la coupure (le thermostat
      // coupe et rallume) ; entité steam active = vapeur ; réservoir (water_level : % ou capteur binaire « vide ») bas = alerte
      const station = kind === "steam_station", on = powered || (watts === null && base === "running"), now = Date.now();
      const pre = (c.preheat_minutes ?? (station ? 4 : 2)) * 60000, keep = (c.ready_minutes ?? 10) * 60000;
      const sE = S(c.steam), sRaw = sE ? String(sE.state).toLowerCase() : "";
      const steamOn = !!sE && !BAD.includes(sRaw) && (["sensor", "number", "input_number"].includes(domainOf(c.steam)) ? (num(sE) != null ? num(sE) > 0 : /^(on|steam|steaming|vapeur|dampf|true)/.test(sRaw)) : isOn(sE));
      m.steamE = sE && !BAD.includes(sRaw) ? sE : null;
      if (base === "unavailable") m.status = "unavailable";
      else if (on) {
        if (!this._gStart) this._gStart = now;
        this._gOn = now;
        m.status = steamOn ? "steaming" : now - this._gStart >= pre ? "iron_ready" : "iron_heating";
      } else if (this._gStart && this._gOn - this._gStart >= 120000 && now - this._gOn < keep) m.status = steamOn ? "steaming" : "iron_ready";
      else { this._gStart = 0; m.status = "off"; }
      const wE = S(c.water_level), wRaw = wE ? String(wE.state).toLowerCase() : "";
      if (wE && !BAD.includes(wRaw)) {
        const wn = ["binary_sensor", "input_boolean"].includes(domainOf(c.water_level)) ? null : num(wE);
        m.waterPct = wn != null ? Math.max(0, Math.min(100, wn)) : null;
        m.waterE = wE;
        m.waterLow = wn != null ? m.waterPct <= (c.water_low ?? 10) : { on: true, off: false, empty: true, vide: true, low: true, ok: false, normal: false }[wRaw] ?? false;
        if (m.waterLow && m.status !== "unavailable") m.alerts.push("low_water");
      }
    } else if (kind === "contact_grill" || kind === "deep_fryer") {
      // prise : voyant rouge tant qu'il chauffe (premières preheat_minutes), voyant vert ensuite et pendant ready_minutes après la coupure
      // (le thermostat coupe et rallume la résistance) ; une coupure avant 2 min de chauffe = simple arrêt
      // friteuse : même logique (voyant rouge = sous tension, vert = huile à température), mais 8 min de chauffe par défaut (bain d'huile)
      const fry = kind === "deep_fryer", sHeat = fry ? "fryer_heating" : "grilling", sReady = fry ? "fryer_ready" : "grill_ready";
      const on = powered || (watts === null && base === "running"), now = Date.now();
      const pre = (c.preheat_minutes ?? (fry ? 8 : 4)) * 60000, keep = (c.ready_minutes ?? 15) * 60000;
      if (base === "unavailable") m.status = "unavailable";
      else if (on) {
        if (!this._gStart) this._gStart = now;
        this._gOn = now;
        m.status = now - this._gStart >= pre ? sReady : sHeat;
      } else if (this._gStart && this._gOn - this._gStart >= 120000 && now - this._gOn < keep) m.status = sReady;
      else { this._gStart = 0; m.status = "off"; }
    } else if (kind === "wine_cooler") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered || (watts === null && base === "running") ? "cooling" : "standby";
      const maxW = c.max_temperature ?? (m.T ? m.T.c(18) : 18);
      if (m.tempVal != null && m.tempVal > maxW) m.alerts.push("too_warm");
      // hygrométrie de la cave : alerte seulement si humidity_max est donné
      if (c.humidity_max != null && m.humidity != null && m.humidity > c.humidity_max) m.alerts.push("humid");
      // bi-zone : seuil propre à la zone basse (vins blancs), sinon le même
      if (m.zone2 != null && m.zone2 > (c.max_temperature_2 ?? maxW)) m.alerts.push("too_warm");
    } else if (kind === "fridge") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered ? "cooling" : "standby";
      const T = m.T;
      m.maxF = c.max_temperature ?? (T ? T.c(8) : 8); m.maxZ = c.freezer_max_temperature ?? (T ? T.c(-12) : -12);
      m.ftempVal = T ? T.conv(num(m.ftemp), m.ftemp) : num(m.ftemp);
      if (m.tempVal != null && m.tempVal > m.maxF) m.alerts.push("too_warm");
      if (m.ftempVal != null && m.ftempVal > m.maxZ) m.alerts.push("too_warm");
      // zone flex (3e compartiment à température réglable) : alerte seulement si un seuil est donné
      m.flexVal = m.flex && ["climate", "water_heater"].includes(domainOf(m.flex.entity_id)) ? num({ state: m.flex.attributes.current_temperature }) : num(m.flex);
      if (T && m.flexVal != null) m.flexVal = T.conv(m.flexVal, m.flex);
      if (m.flexVal != null && c.flex_max_temperature != null && m.flexVal > c.flex_max_temperature) m.alerts.push("too_warm");
    } else {
      m.status = base;
    }

    // For dishwashers on smart plugs: track recent cycle activity to detect the low-power drying phase
    if (kind === "dishwasher") {
      if (watts !== null && watts > threshold) {
        this._dwLastActive = Date.now();
      }
      const dryingTimeout = 20 * 60 * 1000; // 20 minutes
      const recentlyActive = this._dwLastActive && (Date.now() - this._dwLastActive < dryingTimeout);
      if (base === "running" && watts !== null && watts <= threshold) {
        m.status = "running";
        m.phase = "dry";
      } else if (base !== "running" && !explicitState && recentlyActive && (watts === null || watts <= threshold)) {
        m.status = "running";
        m.phase = "dry";
      }
    }

    // phase detection (washer / dryer / dishwasher) from status or program text, with smart-plug power inference fallback
    if (m.status === "running" && ["washer", "washer_dryer", "dryer", "dishwasher"].includes(kind)) {
      const txt = `${main ? main.state : ""} ${m.program ? m.program.state : ""}`.toLowerCase();
      if (/rin[cç]|rinse/.test(txt)) m.phase = "rinse";
      else if (/essor|spin|centrif|essorage/.test(txt)) m.phase = "spin";
      else if (/refroid|cool|anti.?froiss|wrinkle/.test(txt)) m.phase = "cool";
      // en début de mot : les clés Home Connect « laundry_care_washer_program_… » contiennent « dry »
      else if (/(^|[^a-zà-ÿ])(s[eé]ch|dry)/.test(txt)) m.phase = "dry";
      else if (/(^|[^a-zà-ÿ])(heat|chauff)/.test(txt)) m.phase = "heat";
      else if (kind === "dryer") {
        m.phase = "dry";
      } else if (watts !== null && ["washer", "washer_dryer", "dishwasher"].includes(kind)) {
        // Fallback: infer phase from power draw on smart plugs when text entity gives no phase
        const heatThreshold = c.heating_power ?? this._def.heating_power ?? 1000;
        const spinThreshold = c.spin_power ?? this._def.spin_power ?? 200;
        if (heatThreshold > 0 && watts >= heatThreshold) {
          m.phase = "heat";
        } else if ((kind === "washer" || kind === "washer_dryer") && spinThreshold > 0 && watts >= spinThreshold) {
          m.phase = "spin";
        } else if (!m.phase) {
          m.phase = "wash";
        }
      } else if (!m.phase) {
        m.phase = "wash";
      }
    }
    // estimate : temps restant et progression d'après la durée habituelle des cycles (médiane), si aucun capteur ne les donne
    if (c.estimate && m.status === "running" && ["washer", "washer_dryer", "dryer", "dishwasher"].includes(kind) && this._refDur && this._runStart) {
      const el = Date.now() - this._runStart, left = (this._refDur - el) / 60000;
      if (!c.remaining) { if (left >= 1) { m.remaining = left; m.estimated = true; } else m.soon = true; }
      if (!c.progress && m.progress == null) m.progress = Math.max(0, Math.min(99, (el / this._refDur) * 100));
    }
    if (isOn(m.door) || isOn(m.fdoor)) m.alerts.unshift("door_open");
    m.alerts = [...new Set(m.alerts)];
    return m;
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
    if (this._srcEl) { this._srcEl.remove(); this._srcEl = null; }
    if (this._srcKey) { document.removeEventListener("keydown", this._srcKey, true); this._srcKey = null; }
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
      :host { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: flex-end; justify-content: center; font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); }
      .bd { position: absolute; inset: 0; background: rgba(0,0,0,.5); animation: fi .2s ease-out; }
      .sheet { position: relative; box-sizing: border-box; width: 100%; max-width: 460px; max-height: 82vh; overflow: auto; background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); border-radius: 22px 22px 0 0; padding: 14px 14px calc(18px + env(safe-area-inset-bottom, 0px)); box-shadow: 0 -6px 30px rgba(0,0,0,.35); animation: up .25s ease-out; }
      @media (min-width: 600px) { :host { align-items: center; } .sheet { border-radius: 22px; } }
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
      @media (prefers-reduced-motion: reduce) { .bd, .sheet { animation: none; } .tile { transition: none; } .tile:active { transform: none; } }
    </style>
    <div class="bd"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(tr(hass, "source_select"))}">
      <div class="hd"><div class="tt"><b>${esc(tr(hass, "source_select"))}</b><span>${esc(title)}</span></div>
        <button class="x" aria-label="${esc(tr(hass, "close_dialog"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
      ${groups.map(([k, arr]) => `${groups.length > 1 ? `<div class="sec">${esc(tr(hass, k))}</div>` : ""}<div class="grid">${arr.map((i) => `<button class="tile${i.cur ? " cur" : ""}"${i.cur ? ' aria-current="true"' : ""} data-n="${esc(i.name)}">${i.cur ? '<span class="ck"><ha-icon icon="mdi:check"></ha-icon></span>' : ""}<span class="ic"><ha-icon icon="${i.icon}"></ha-icon>${i.badge ? `<i>${esc(i.badge)}</i>` : ""}</span><span class="lb">${esc(i.name)}</span>${i.cur ? `<span class="on">${esc(tr(hass, "source_active"))}</span>` : ""}</button>`).join("")}</div>`).join("")}
    </div>`;
    const close = () => this._closeSourcePopup();
    root.querySelector(".bd").onclick = close;
    root.querySelector(".x").onclick = close;
    root.querySelectorAll(".tile").forEach((b) => {
      b.onclick = () => {
        this._press(b);
        hass.callService("media_player", "select_source", { entity_id: id, source: b.dataset.n });
        setTimeout(close, 180);
      };
    });
    this._srcKey = (ev) => { if (ev.key === "Escape") { ev.stopPropagation(); close(); } };
    document.addEventListener("keydown", this._srcKey, true);
    document.body.appendChild(host);
    this._srcEl = host;
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

  /* ---------------- rendering ---------------- */
  _lcdText(m) {
    const hass = this._hass, kind = this._kind, c = this._config;
    // lcd_value : « current » affiche la température actuelle plutôt que la consigne (radiateur, sèche-serviettes, clim)
    const lcdT = () => (c.lcd_value === "current" ? m.tempVal ?? m.targetVal : m.targetVal ?? m.tempVal);
    const active = ["iron_heating", "iron_ready", "steaming", "grilling", "grill_ready", "fryer_heating", "fryer_ready", "running", "heating", "preheating", "cooling", "ignition", "filtering", "dosing", "in_use", "printing", "scanning", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming", "mixing", "turbo"].includes(m.status);
    if (m.status === "unavailable") return "- - -";
    if (["fridge", "wine_cooler", "chest_freezer", "drawer_freezer"].includes(kind)) return m.tempVal != null ? `${fmtNum(hass, m.tempVal, 0)}°` : "--°";
    if (kind === "towel_dryer") {
      if (m.status === "off") return "OFF";
      if (m.radMode === "frost") return "H-G";
      const v = lcdT();
      return v != null ? `${Math.round(v)}°` : "ON";
    }
    if (kind === "server_rack") {
      if (m.status === "off") return "OFF";
      if (m.status === "standby") return "STBY";
      return m.watts != null ? `${Math.round(m.watts)}W` : "ON";
    }
    if (kind === "radiator") {
      if (m.status === "off") return "OFF";
      if (m.radMode === "frost") return "H-G";
      const v = lcdT();
      return v != null ? `${Math.round(v)}°` : "ON";
    }
    if (kind === "solar") {
      if (m.status === "night") return tr(hass, "lcd_night");
      if (m.watts == null) return "--";
      return m.watts >= 1000 ? `${(m.watts / 1000).toFixed(m.watts >= 10000 ? 0 : 1)}kW` : `${Math.round(m.watts)}W`;
    }
    if (kind === "printer_3d") {
      if (m.status === "printing") return m.progress != null ? `${Math.round(m.progress)}%` : m.remaining ? lcdDuration(m.remaining) : "PRINT";
      if (m.status === "heating") return m.tempVal != null ? `${Math.round(m.tempVal)}°` : "HEAT";
      if (m.status === "paused") return "PAUSE";
      if (m.status === "finished") return "DONE";
      if (m.status === "failed") return "ERROR";
      if (m.status === "ready") return "READY";
      return "OFF";
    }
    if (kind === "pool_pump") {
      if (m.status === "filtering") {
        const sp = num(m.speed), u = String(m.speed?.attributes.unit_of_measurement || "").toLowerCase();
        if (sp != null && u !== "%") return `${Math.round(sp)}`;
        if (sp != null) return `${Math.round(sp)}%`;
        return m.watts != null ? `${Math.round(m.watts)}W` : "ON";
      }
      return m.status === "standby" ? "STBY" : "OFF";
    }
    if (kind === "pellet_stove") {
      if (m.status === "ignition") return tr(hass, "lcd_ignition");
      if (m.status === "extinguishing") return tr(hass, "lcd_extinguishing");
      if (m.status === "alarm") return "ALARM";
      if (m.status === "standby") return "ECO";
      if (m.status === "heating") return m.tempVal != null ? `${Math.round(m.tempVal)}°` : m.level != null ? `P${Math.round(m.level)}` : "ON";
      return fmtClock(hass, new Date());
    }
    if (kind === "oven") {
      if (active && m.tempVal != null) return `${Math.round(m.tempVal)}°`;
      if (active) return m.remaining ? lcdDuration(m.remaining) : "ON";
      return fmtClock(hass, new Date());
    }
    if (kind === "wet_vacuum") {
      if (m.status === "unavailable" || m.status === "off") return "--";
      if (m.dirtyFull) return "FULL";
      return m.batt != null ? `${Math.round(m.batt)}` : m.status === "wv_drying" ? "DRY" : "ON";
    }
    if (kind === "dehumidifier") {
      if (m.status === "off") return "OFF";
      if (m.status === "tank_full") return "FULL";
      return m.humidity != null ? `${Math.round(m.humidity)}%` : m.targetHumVal != null ? `${Math.round(m.targetHumVal)}%` : "ON";
    }
    if (kind === "beer_tap") {
      if (m.status === "off" || m.status === "unavailable") return "";
      return m.tempVal != null ? `${fmtNum(hass, m.tempVal, 1)}°` : m.status === "cooling" ? "COLD" : "READY";
    }
    if (kind === "av_receiver") {
      if (["off", "unavailable", "standby"].includes(m.status)) return "";
      if (m.status === "muted") return "MUTE";
      if (m.status === "paused") return "PAUSE";
      if (m.source) return String(m.source).toUpperCase().slice(0, 9);
      return m.vol != null ? `VOL ${Math.round(m.vol * 100)}` : "ON";
    }
    if (kind === "ac_split") {
      if (m.status === "off" || m.status === "unavailable") return "";
      const v = lcdT();
      return v != null ? `${Math.round(v)}°` : "ON";
    }
    if (kind === "heat_pump") {
      if (m.status === "off") return "OFF";
      if (m.watts == null) return "ON";
      return m.watts >= 1000 ? `${(m.watts / 1000).toFixed(m.watts >= 10000 ? 0 : 1)}kW` : `${Math.round(m.watts)}W`;
    }
    if (kind === "air_purifier") return m.pm != null ? `PM ${Math.round(m.pm)}` : m.status === "off" ? "OFF" : "PM --";
    if (kind === "coffee_maker") {
      if (m.status === "brewing") return tr(hass, "lcd_brewing");
      if (m.status === "ready") return tr(hass, "lcd_ready");
      if (m.status === "off") return "OFF";
      return fmtClock(hass, new Date());
    }
    if (kind === "air_fryer") {
      if (m.status === "finished") return "End";
      if (active && m.remaining != null && m.remaining > 0) return lcdDuration(m.remaining, m.remaining < 60);
      if (active && m.tempVal != null) return `${Math.round(m.tempVal)}°`;
      return active ? "ON" : "OFF";
    }
    if (kind === "microwave") {
      if (m.status === "finished") return "End";
      if (active) return m.remaining != null ? lcdDuration(m.remaining, m.remaining < 60) : "ON";
      return fmtClock(hass, new Date());
    }
    if (m.status === "finished") return "END";
    if (!active) return "OFF";
    if (m.remaining != null && m.remaining > 0) return lcdDuration(m.remaining);
    return { wash: "WASH", rinse: "RINSE", spin: "SPIN", dry: "DRY", cool: "COOL", heat: "HEAT" }[m.phase] || "RUN";
  }

  _render(m) {
    const hass = this._hass, c = this._config, kind = this._kind;
    const $ = (i) => this.shadowRoot.getElementById(i);
    const active = ["iron_heating", "iron_ready", "steaming", "grilling", "grill_ready", "fryer_heating", "fryer_ready", "running", "heating", "preheating", "cooling", "ignition", "filtering", "dosing", "in_use", "printing", "scanning", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming", "mixing", "turbo"].includes(m.status);
    this._fetchCycle(active);
    const hideWouldApply = this._applyHide(active, m.alerts.length > 0);
    this._fit(active);
    $("wrap").className = [
      "wrap", c.layout === "split" ? "layout-split" : "", `k-${kind}`, `st-${m.status}`, `accent-${m.accent || this._def.accent}`,
      active ? "active" : "", m.dual ? "dual" : "", m.active2 ? "active2" : "", m.phase ? `ph-${m.phase}` : "",
      m.alerts.length ? "alert" : "", isOn(m.door) ? "door-open" : "", isOn(m.fdoor) ? "fz-open" : "",
      m.alerts.includes("too_warm") ? "warm" : "", m.alerts.includes("humid") ? "humid" : "", kind === "smart_plug" ? this._indClasses() : "", c.animations === false ? "no-anim" : c.animations === true ? "force-anim" : "", m.lights ? "lights-on" : "", kind === "ceiling_fan" && c.show_light === false ? "no-light" : "", m.solarHeat ? "solar-heat" : "", hideWouldApply ? "would-hide" : "", m.acMode ? `mode-${m.acMode}` : "", m.osc ? "osc" : "", m.vxDir ? `vx-${m.vxDir}` : kind === "vmc" ? "vx-extract" : "", m.vxSpeed ? `vx-s${m.vxSpeed}` : "",
    ].filter(Boolean).join(" ");

    // illustration dynamic parts
    if (kind === "av_receiver") $("wrap").style.setProperty("--amp", (m.amp ?? .6).toFixed(2));
    if (kind === "smart_speaker") $("wrap").style.setProperty("--amp", (m.amp ?? .5).toFixed(2));
    // enceinte avec lampe (SYMFONISK) : entité light facultative, l'abat-jour suit son état et sa luminosité (sans entité : toujours allumé)
    if (kind === "smart_speaker") {
      const lt = c.light ? hass.states[c.light] : undefined;
      if (lt && !["unavailable", "unknown"].includes(String(lt.state))) $("wrap").style.setProperty("--lum", (isOn(lt) ? Math.max(.25, lt.attributes && lt.attributes.brightness != null ? Number(lt.attributes.brightness) / 255 : 1) : 0).toFixed(2));
      else $("wrap").style.removeProperty("--lum");
    }
    // dosing_pump : color = couleur du boîtier (n'importe quelle couleur CSS), pour repérer chaque produit (pH+, fer, potassium…)
    if (kind === "dosing_pump") { if (c.color) $("wrap").style.setProperty("--dp-color", String(c.color)); else $("wrap").style.removeProperty("--dp-color"); }
    if (kind === "beer_tap") $("wrap").style.setProperty("--keg", ((m.keg ?? 70) / 100).toFixed(2));
    if (kind === "power_strip") {
      // fiche branchée : prises commandées (outlets), sinon toutes sauf la dernière ; LED allumée si la prise est active
      const outs = m.outlets || [], on = m.status === "powered";
      this.shadowRoot.querySelectorAll(".ms-s").forEach((g, i) => {
        const plug = outs.length ? i < outs.length : i < this.shadowRoot.querySelectorAll(".ms-s").length - 1;
        g.classList.toggle("plug", plug);
        g.classList.toggle("on", on && (outs.length ? !!outs[i] : plug));
      });
    }
    if (kind === "phone_charger") {
      const lv = m.batt != null ? Math.max(0, Math.min(100, m.batt)) : null;
      $("wrap").style.setProperty("--batt", String(lv != null ? Math.max(.04, lv / 100) : m.status === "charged" ? 1 : .6));
      $("wrap").classList.toggle("seq", m.status === "charging" && lv == null);
      this.shadowRoot.querySelector(".phn-time").textContent = fmtClock(hass, new Date());
      this.shadowRoot.querySelector(".phn-pct").textContent = lv != null ? `${Math.round(lv)} %` : "";
    }
    if (kind === "garland") {
      const multi = c.multicolor !== false && !(m.glColor && c.multicolor === undefined && m.glEffect == null && this._glSingle(m));
      $("wrap").classList.toggle("gl-multi", multi);
      $("wrap").style.setProperty("--glc", m.glColor || "#ffcf6a");
      $("wrap").style.setProperty("--bri", (m.glBri ?? 1).toFixed(2));
    }
    if (kind === "tool_charger") {
      // jauge 4 LED : niveau réel si capteur, sinon remplissage en boucle pendant la charge
      const st = m.status, lv = m.batt != null ? Math.max(0, Math.min(100, m.batt)) : null;
      const lit = st === "charged" ? 4 : st === "charging" && lv != null ? Math.min(4, Math.floor(lv / 25)) : 0;
      $("wrap").classList.toggle("seq", st === "charging" && lv == null);
      this.shadowRoot.querySelectorAll(".tc-g").forEach((g, i) => {
        g.classList.toggle("on", i < lit);
        g.classList.toggle("next", st === "charging" && lv != null && i === lit);
      });
    }
    if (kind === "ps5") {
      // démarrage (éteinte / repos → allumée) : balayage bleu des bandeaux, puis blanc
      const on = (s) => ["screen_on", "ps_gaming"].includes(s), prev = this._psPrev;
      if (prev !== undefined && on(m.status) && !on(prev)) {
        const g = this.shadowRoot.querySelector("svg");
        g.classList.remove("ps-boot"); void g.getBoundingClientRect(); g.classList.add("ps-boot");
        clearTimeout(this._psT); this._psT = setTimeout(() => g.classList.remove("ps-boot"), 2600);
      }
      this._psPrev = m.status;
    }
    if (kind === "tv") {
      const prev = this._tvPrev, on = m.status === "screen_on";
      const scr = this.shadowRoot.querySelector(".tv-flash");
      if (prev !== undefined && scr && (prev === "screen_on") !== on) {
        const g = this.shadowRoot.querySelector("svg");
        g.classList.remove("tv-boot", "tv-shut"); void g.getBoundingClientRect(); g.classList.add(on ? "tv-boot" : "tv-shut");
        clearTimeout(this._tvT); this._tvT = setTimeout(() => g.classList.remove("tv-boot", "tv-shut"), 3400);
      }
      this._tvPrev = m.status;
    }
    const sr = this.shadowRoot;
    const lcdEl = sr.querySelector(".lcd");
    if (lcdEl) lcdEl.textContent = this._lcdText(m);
    const lcd2o = sr.querySelector(".ovl2");
    if (lcd2o) lcd2o.textContent = m.status === "unavailable" ? "--" : m.active2 ? (m.temp2 != null ? `${Math.round(m.temp2)}°` : m.remaining2 ? lcdDuration(m.remaining2) : "ON") : "--";
    // split : l'humidité s'affiche sous la température sur l'écran (lcd_humidity: false pour la masquer)
    if (kind === "ac_split" && lcdEl) {
      const showH = c.lcd_humidity !== false && m.humidity != null && !["off", "unavailable"].includes(m.status);
      let hEl = sr.querySelector(".lcdh");
      if (showH && !hEl) {
        hEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        hEl.setAttribute("class", "lcdh"); hEl.setAttribute("x", lcdEl.getAttribute("x")); hEl.setAttribute("y", "68.8");
        lcdEl.parentNode.insertBefore(hEl, lcdEl.nextSibling);
      }
      if (showH) hEl.textContent = `${Math.round(m.humidity)}%`; else if (hEl) hEl.remove();
      lcdEl.classList.toggle("with-hum", showH);
      lcdEl.setAttribute("y", showH ? "62.2" : "63.4");
    }
    // lcd_big : grande valeur lisible (icône + température) posée sur le dessin ; icône thermomètre = actuelle, cible = consigne (lcd_value)
    if (c.lcd_big === true && ["radiator", "towel_dryer", "ac_split"].includes(kind)) {
      const sv = sr.querySelector(".illus svg");
      let bg = sv && sv.querySelector(".bigval");
      if (sv && !bg) { bg = document.createElementNS("http://www.w3.org/2000/svg", "g"); bg.setAttribute("class", "bigval"); sv.appendChild(bg); }
      if (bg) {
        const raw = this._lcdText(m), num = /^-?\d+°$/.test(raw), txt = num ? `${raw.slice(0, -1)}${m.tempUnit || "°C"}` : raw;
        const [cx, cy] = { radiator: { convector: [60, 72], baseboard: [50, 96], convector_photo: [60, 74], baseboard_photo: [60, 100] }[c.style] || [50, 64], towel_dryer: [60, 66], ac_split: [46, 60] }[kind];
        const ico = c.lcd_value === "current"
          ? `<g fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"><path d="M-0.1 -4V1.2"/><circle cx="-0.1" cy="2.7" r="2" fill="#fff"/><path d="M-1.4 -3a1.3 1.3 0 0 1 2.6 0V1.4" /></g>`
          : `<g fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"><circle r="3.4"/><circle r=".8" fill="#fff"/><path d="M0 -5.4V-3.6M0 3.6V5.4M-5.4 0H-3.6M3.6 0H5.4"/></g>`;
        const slot = num ? 14 : 0, w = txt.length * 8.6 + slot, x0 = cx - w / 2;
        bg.innerHTML = `${num ? `<g transform="translate(${(x0 + 5.5).toFixed(1)} ${cy}) scale(1.25)">${ico}</g>` : ""}<text x="${(x0 + slot + (w - slot) / 2).toFixed(1)}" y="${cy}">${esc(txt)}</text>`;
      }
    }
    const lcd3 = sr.querySelector(".lcd3");
    if (lcd3) lcd3.textContent = m.status === "unavailable" || m.flexVal == null ? "--°" : `${fmtNum(hass, m.flexVal, 0)}°`;
    const lcd2 = sr.querySelector(".lcd2");
    if (lcd2) lcd2.textContent = m.status === "unavailable" ? "--" : m.zone2 != null ? `${fmtNum(hass, m.zone2, 0)}°` : "--°";
    if (kind === "generic" && Array.isArray(c.images)) {
      // image conditionnelle : la dernière entrée dont toutes les conditions sont vraies (une entrée sans condition vaut toujours)
      const main = hass.states[c.entity];
      let src = c.image || "";
      for (const it of c.images) {
        if (!it || !it.image) continue;
        const st = it.entity ? hass.states[it.entity] : null;
        const val = it.entity ? num(st) : m.pw ? powerW(m.pw) : num(main);
        const raw = String((it.entity ? st : main)?.state ?? "").toLowerCase();
        const okAbove = it.above == null || (val != null && val > Number(it.above));
        const okBelow = it.below == null || (val != null && val < Number(it.below));
        const okState = it.state == null || [].concat(it.state).some((v) => String(v).toLowerCase() === raw);
        if (okAbove && okBelow && okState) src = it.image;
      }
      const img = sr.querySelector(".gn-img");
      if (img && img.tagName.toLowerCase() === "image" && img.getAttribute("href") !== String(src).trim()) img.setAttribute("href", String(src).trim());
    }
    if (kind === "wet_vacuum") {
      // niveaux des réservoirs (capteur %, sinon plein / vide selon l'alerte), anneau de l'écran = batterie
      const w = $("wrap");
      w.style.setProperty("--clean", String(m.cleanPct != null ? Math.max(.04, m.cleanPct / 100) : m.cleanEmpty ? .06 : .7));
      w.style.setProperty("--dirty", String(m.dirtyPct != null ? m.dirtyPct / 100 : m.dirtyFull ? .95 : m.status === "wv_cleaning" || m.status === "wv_selfclean" ? .35 : .15));
      w.classList.toggle("wv-empty", !!m.cleanEmpty);
      w.classList.toggle("wv-full", !!m.dirtyFull);
      w.classList.toggle("wv-low", !!m.battLow);
      const ring = sr.querySelector(".wv-ring");
      if (ring) ring.style.strokeDasharray = m.status === "wv_selfclean" ? "" : `${m.batt != null ? Math.max(2, Math.min(100, m.batt)) : 100} 100`;
    }
    if (kind === "dehumidifier") {
      // bac : plein si capteur, sinon un tiers
      $("wrap").style.setProperty("--lvl", m.tankFull ? "0.95" : "0.35");
      $("wrap").style.setProperty("--spd", String(m.spd ?? 1));
      $("wrap").classList.toggle("tank-full", !!m.tankFull);
    }
    if (kind === "air_purifier") {
      $("wrap").classList.toggle("air-poor", m.alerts.includes("air_poor"));
      $("wrap").classList.toggle("filter-bad", !!m.filterBad);
    }
    if (kind === "server_rack") $("wrap").style.setProperty("--load", (m.load ?? 0.4).toFixed(2));
    if (kind === "solar") $("wrap").style.setProperty("--sun", (m.frac || 0).toFixed(2));
    if (kind === "radiator" || kind === "towel_dryer") {
      $("wrap").style.setProperty("--heat", (m.heat || 0).toFixed(2));
      // confort -1 / -2 : même illustration que confort
      const rm = /^comfort_/.test(m.radMode || "") ? "comfort" : m.radMode;
      ["comfort", "eco", "frost"].forEach((k) => $("wrap").classList.toggle(`mode-${k}`, rm === k || (k === "comfort" && !rm && m.status !== "off")));
      if (kind === "radiator") $("wrap").classList.toggle("win-open", isOn(m.window));
    }
    if (kind === "hob" && m.zones) {
      m.zones.forEach((v, i) => {
        const z = sr.querySelector(`.z${i + 1}`), d = sr.querySelector(`.zd${i + 1}`);
        const res = m.residualZones[i];
        z.style.setProperty("--lvl", v > 0 ? (0.25 + v * 0.083).toFixed(2) : res ? "0.12" : "0");
        z.classList.toggle("on", v > 0); z.classList.toggle("res", !!res);
        d.textContent = v > 0 ? String(v) : res ? "H" : "0";
        d.classList.toggle("on", v > 0 || !!res);
      });
      $("wrap").classList.toggle("pot-on", m.zones[0] > 0);
      $("wrap").classList.toggle("pot-boil", m.zones[0] >= 7);
      $("wrap").classList.toggle("pan-on", m.zones[3] > 0);
    }
    if (kind === "printer_3d") {
      const H = 38;
      let frac = m.progress != null ? Math.max(0, Math.min(1, m.progress / 100)) : null;
      if (m.status === "finished") frac = 1;
      if (m.progress == null && m.status !== "printing" && m.status !== "finished") frac = 0;
      const wrap = $("wrap");
      wrap.classList.toggle("indeterminate", frac == null);
      const h = (frac ?? 0) * H;
      wrap.style.setProperty("--h", h.toFixed(2));
      const clip = sr.querySelector(".objclip");
      // modèles en photo : bas et hauteur de l'objet dans data-b / data-h (le dessin : 104 / 38, H)
      const cb = Number(clip.dataset.b) || 104, ch = Number(clip.dataset.h) || H, hh = (frac ?? 0) * ch;
      clip.setAttribute("y", (cb - hh).toFixed(2)); clip.setAttribute("height", hh.toFixed(2));
      wrap.style.setProperty("--h-obj", hh.toFixed(2));
      wrap.style.setProperty("--pr", (frac ?? 1).toFixed(3)); // barre de progression sur l'écran (modèles en photo)
      wrap.style.setProperty("--fil", c.filament_color || "#ff8a1f");
    }
    if (FIT_KINDS.includes(kind)) {
      // durée d'un tour de pédalier (ou d'un coup de rame) : cadence si elle est fournie, sinon la puissance (max_power = effort maximal)
      const cad = num(m.fit.cadence), rower = kind === "rowing_machine";
      let per;
      if (cad != null && cad > 0) per = 60 / cad;
      else {
        const f = m.watts != null ? Math.max(0, Math.min(1, m.watts / (c.max_power || 250))) : 0.4;
        per = rower ? 3.4 - 1.6 * f : 2.2 - 1.5 * f;
      }
      $("wrap").style.setProperty("--fp", `${Math.max(0.35, Math.min(4, per)).toFixed(2)}s`);
    }
    if (kind === "pool_pump") {
      const sp = num(m.speed), u = String(m.speed?.attributes.unit_of_measurement || "").toLowerCase();
      let spd = 1;
      if (sp != null) spd = u === "%" ? 0.3 + sp / 100 : sp / 2800;
      else if (m.watts != null && c.max_power) spd = m.watts / c.max_power;
      spd = Math.max(0.3, Math.min(1.6, spd));
      $("wrap").style.setProperty("--spd", spd.toFixed(2));
    }
    if (kind === "pellet_stove") {
      const fs = m.level != null ? Math.max(0.55, Math.min(1.2, 0.55 + 0.13 * m.level)) : 1;
      sr.querySelector(".fire").style.setProperty("--fs", fs.toFixed(2));
    }
    if (kind === "water_heater") {
      const t = m.tempVal;
      const ang = t == null ? -135 : -135 + Math.max(0, Math.min(1, (t - 10) / 70)) * 270;
      sr.querySelector(".needle").setAttribute("transform", `rotate(${ang.toFixed(1)} 60 76)`);
      sr.querySelector(".gauge-txt").textContent = t == null ? "--°" : `${Math.round(t)}°`;
      // niveau d'eau chaude : l'eau chaude occupe le haut du ballon, l'eau froide (bleue) le bas
      const hot = sr.querySelector(".hw-hot");
      if (hot) hot.style.transform = `scaleY(${((m.hotPct ?? 0) / 100).toFixed(3)})`;
    }

    // name + status
    const name = c.name || tr(hass, kind === "monitor" && mnCount(c) > 1 ? "monitors" : kind === "desktop_pc" && pcStyle(c) === "tower" ? "pc_tower" : kind);
    let statusTxt = m.phase ? tr(hass, `ph_${m.phase}`) : tr(hass, m.status);
    if (kind === "monitor" && m.status === "screen_on") statusTxt = tr(hass, mnCount(c) > 1 ? "monitors_on" : "monitor_on");
    if (m.main && ["sensor", "input_select", "select"].includes(domainOf(c.entity)) &&
        active && !["fridge", "water_heater", "printer_3d", "pool_pump", "wet_vacuum", "kettle"].includes(kind) && !(kind === "printer" && /^brother|mfc.?j5955/i.test(String(c.model || "")))) {
      const raw = String(m.main.state).toLowerCase();
      if (![...OFF_STATES, ...DONE_STATES, "on", "running", "run"].includes(raw)) statusTxt = stateText(hass, m.main);
    }
    if (kind === "kettle" && (m.kettleLifted || m.kettleForeign)) statusTxt = stateText(hass, m.main);
    if ((kind === "radiator" || kind === "towel_dryer") && m.radMode && m.radMode !== "off" && m.status !== "off" && m.status !== "unavailable") statusTxt += ` · ${tr(hass, m.radMode === "none" ? "mode_none" : m.radMode)}`;
    if ((kind === "fan" || kind === "ceiling_fan" || kind === "air_purifier") && m.pct != null && /^fan_/.test(m.status)) statusTxt += ` · ${Math.round(m.pct)} %`;
    if (kind === "av_receiver" && m.vol != null && ["playing", "paused"].includes(m.status)) statusTxt += ` · Vol ${Math.round(m.vol * 100)} %`;
    if (kind === "av_receiver" && m.source && ["playing", "paused", "muted"].includes(m.status)) statusTxt += ` · ${m.source}`;
    if (kind === "tv" && c.show_media !== false && m.status === "screen_on" && m.main && domainOf(c.entity) === "media_player") {
      const a = m.main.attributes || {}, what = a.app_name || a.media_title || a.source;
      if (what) statusTxt += ` · ${what}`;
    }
    if (kind === "ps5" && m.game) statusTxt += ` · ${m.game}`;
    const spOn = kind === "smart_speaker" && ["playing", "paused", "muted"].includes(m.status);
    if (spOn && m.app) statusTxt += ` · ${m.app}`;
    if (m.solarHeat && active) statusTxt += ` · ${tr(hass, "solar_surplus")}`;
    const prog = m.program && active && !BAD.includes(String(m.program.state).toLowerCase()) ? stateText(hass, m.program) : "";
    let sub = "";
    if (active && m.remaining != null && m.remaining > 0) {
      sub = `${tr(hass, m.estimated ? "ends_at_est" : "ends_at")} ${fmtClock(hass, new Date(Date.now() + m.remaining * 60000))}`;
    } else if (active && m.soon) sub = tr(hass, "almost_done");
    if (spOn && !sub && m.track && c.show_media !== false) sub = m.track;
    // téléviseur avec boutons de commande : volume en % sous l'état (sourdine en rouge)
    let subMute = false;
    if (kind === "tv" && !sub && m.status === "screen_on" && (c.show_controls ?? tvProjector(c)) && m.main && domainOf(c.entity) === "media_player") {
      const a = m.main.attributes || {}, v = Number(a.volume_level);
      if (a.volume_level != null && Number.isFinite(v)) { subMute = !!a.is_volume_muted; sub = subMute ? tr(hass, "mute") : `${tr(hass, "volume")} ${Math.round(v * 100)} %`; }
    }
    const alertTxt = m.alerts.map((a) => (a === "kettle_error" && m.kettleErr ? `${tr(hass, a)} : ${m.kettleErr}` : tr(hass, a))).join(" · ");
    let frPill = "";
    if (kind === "fridge" && m.tempVal != null) {
      const tv = m.T ? m.T.toC(m.tempVal) : m.tempVal; // seuils de couleur en °C
      let tCol = "color: #4caf50; border-color: rgba(76, 175, 80, 0.45); background: rgba(76, 175, 80, 0.15); box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);";
      if (tv >= 10) {
        tCol = "color: #ff5252; border-color: rgba(244, 67, 54, 0.5); background: rgba(244, 67, 54, 0.18); box-shadow: 0 0 8px rgba(244, 67, 54, 0.3);";
      } else if (tv >= 8) {
        tCol = "color: #ff9800; border-color: rgba(255, 152, 0, 0.5); background: rgba(255, 152, 0, 0.18); box-shadow: 0 0 8px rgba(255, 152, 0, 0.25);";
      } else if (tv >= 6) {
        tCol = "color: #ffeb3b; border-color: rgba(255, 235, 59, 0.45); background: rgba(255, 235, 59, 0.15); box-shadow: 0 0 8px rgba(255, 235, 59, 0.2);";
      }
      frPill = `<span class="fr-pill" style="${tCol}"><ha-icon icon="mdi:thermometer" style="color: inherit;"></ha-icon>${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}</span>`;
    }
    if (c.layout === "split") {
      $("info").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:4px;">
          <div class="name">${esc(name)}</div>
          ${frPill}
        </div>
        <div class="status"><span class="dot"></span><span>${esc(statusTxt)}${prog && prog !== statusTxt ? ` · ${esc(prog)}` : ""}</span></div>
        ${alertTxt ? `<div class="alert-line"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(alertTxt)}</div>` : ""}
        ${sub ? `<div class="sub${subMute ? " sub-mute" : ""}">${esc(sub)}</div>` : ""}`;
    } else {
      $("info").innerHTML = `
        <div class="name">${esc(name)}</div>
        <div class="status"><span class="dot"></span><span>${esc(statusTxt)}${prog && prog !== statusTxt ? ` · ${esc(prog)}` : ""}</span>${frPill}</div>
        ${alertTxt ? `<div class="alert-line"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(alertTxt)}</div>` : ""}
        ${sub ? `<div class="sub${subMute ? " sub-mute" : ""}">${esc(sub)}</div>` : ""}`;
    }

    const swId = c.switch || (kind === "dehumidifier" && domainOf(c.entity) === "humidifier" ? c.entity : null)
      || (kind === "garland" && domainOf(c.entity) === "light" ? c.entity : null);
    this._sw = null;
    // multiprise sans switch global : le bouton marche / arrêt pilote toutes les prises (une allumée → tout couper, sinon tout allumer)
    const outIds = kind === "power_strip" && !swId && Array.isArray(c.outlets) ? c.outlets.filter((i) => typeof i === "string" && i && hass.states[i]) : [];
    if (outIds.length) {
      const on = outIds.some((i) => isOn(hass.states[i]));
      this._sw = { id: null, outlets: outIds, on, guarded: (c.confirm_always === true || c.confirm_off === "always") && on };
      const arming = this._sw.guarded && this._confirmUntil && Date.now() < this._confirmUntil;
      const label = tr(hass, arming ? "confirm_off_always" : "toggle");
      const tip = arming ? `<div class="confirm-tip">${esc(label)}</div>` : "";
      if (c.show_toggle !== false) {
        $("actions").innerHTML = `<button class="toggle ${on ? "on" : ""} ${arming ? "confirm" : ""}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${on}"><ha-icon icon="${arming ? "mdi:alert" : "mdi:power"}"></ha-icon></button>${tip}`;
        $("actions").querySelector("button").onclick = (ev) => { ev.stopPropagation(); this._toggleSw(); };
      } else $("actions").innerHTML = tip;
    } else if (swId) {
      const on = isOn(hass.states[swId]);
      // safety: cutting a washer/dryer/dishwasher mid-cycle needs a second click
      const freezer = ["chest_freezer", "drawer_freezer"].includes(kind);
      // PC fixe / baie serveur : couper la prise d'une machine allumée ou en veille = arrêt brutal
      const computer = ["desktop_pc", "server_rack"].includes(kind) && ["screen_on", "online", "standby"].includes(m.status);
      // PS5 : couper la prise allumée ou en mode repos (téléchargements, mises à jour) peut abîmer les données
      const console_ = kind === "ps5" && ["screen_on", "ps_gaming", "ps_rest"].includes(m.status);
      // confirm_always: true (ou confirm_off: always) : 2e clic dès que la prise est allumée ;
      // sinon confirm_off : true (défaut, protection selon l'appareil) / false (jamais)
      const always = c.confirm_always === true || c.confirm_off === "always";
      const cOff = always ? "always" : c.confirm_off === false || c.confirm_off === "off" ? "off" : "auto";
      const autoGuard = freezer || computer || console_ || ((active || ["extinguishing", "paused"].includes(m.status)) && ["washer", "washer_dryer", "dryer", "dishwasher", "pellet_stove", "printer_3d", "thermomix", "cookeo"].includes(kind));
      const guarded = cOff !== "off" && on && (cOff === "always" || autoGuard);
      this._sw = { id: swId, guarded };
      const arming = guarded && this._confirmUntil && Date.now() < this._confirmUntil;
      const label = arming ? tr(hass, computer ? "confirm_off_pc" : console_ ? "confirm_off_console" : autoGuard ? "confirm_off" : "confirm_off_always") : tr(hass, "toggle");
      const tip = arming ? `<div class="confirm-tip">${esc(label)}</div>` : "";
      if (c.show_toggle !== false) {
        $("actions").innerHTML = `<button class="toggle ${on ? "on" : ""} ${arming ? "confirm" : ""}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${on}"><ha-icon icon="${arming ? "mdi:alert" : "mdi:power"}"></ha-icon></button>${tip}`;
        $("actions").querySelector("button").onclick = (ev) => { ev.stopPropagation(); this._toggleSw(); };
      } else $("actions").innerHTML = tip; // bouton masqué : la confirmation d'un tap sur l'illustration reste visible
    } else $("actions").innerHTML = "";

    // progress bar
    let pct = null;
    if (active && m.progress != null) pct = m.progress;
    else if (["tool_charger", "phone_charger", "wet_vacuum"].includes(kind) && m.status === "charging" && m.batt != null) pct = m.batt;
    else if (kind === "kettle" && m.status === "boiling" && m.tempVal != null) pct = ((m.tempVal - 15) / 85) * 100;
    else if ((kind === "oven" && m.status === "preheating") || (kind === "water_heater" && m.status !== "off")) {
      if (m.tempVal != null && m.targetVal) {
        const floor = kind === "water_heater" ? 10 : 20;
        pct = ((m.tempVal - floor) / (m.targetVal - floor)) * 100;
      }
    }
    if (pct != null && Number.isFinite(pct)) {
      $("bar").style.display = "";
      $("barfill").style.width = `${Math.max(0, Math.min(100, pct))}%`;
    } else $("bar").style.display = "none";

    // boutons de mode (confort / confort -1 / confort -2 / éco / hors-gel / arrêt)
    const modesEl = $("modes");
    const mEnt = c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
    if ((kind === "radiator" || kind === "towel_dryer") && mEnt && c.show_modes !== false && hass.states[mEnt]) {
      const opts = modeOptions(hass.states[mEnt]);
      const cur = m.radMode ?? (m.status !== "off" ? "comfort" : "off");
      modesEl.innerHTML = MODE_ORDER.filter((k) => pickMode(opts, k)).map((k) =>
        `<button class="mode-btn ${cur === k ? "on" : ""}" data-mode="${k}" aria-pressed="${cur === k}"><ha-icon icon="${MODE_ICON[k]}"></ha-icon>${esc(tr(hass, k === "off" ? "mode_off" : k === "none" ? "mode_none" : k === "drying" ? "mode_drying" : k))}</button>`).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._setMode(b.dataset.mode); }; });
    } else if (kind === "kettle" && c.show_modes !== false) {
      // bouilloire : sélecteur de mode (une touche par option), boutons on/off (entités button) et curseur de température,
      // chacun activable séparément (show_selector / show_buttons / show_slider) ; le curseur est toujours visible
      const dis = m.status === "unavailable" ? " disabled" : "";
      const pst = this._presetEntity() && hass.states[this._presetEntity()];
      const cap = (x) => { const t = String(x).replace(/_/g, " "); return t.charAt(0).toUpperCase() + t.slice(1); };
      let html = "";
      if (c.show_selector !== false && pst) {
        const cur = String(pst.state).toLowerCase();
        html += this._presetOptions(pst).map((o) => {
          const raw = String(o).toLowerCase(), on = raw === cur, key = MODE_ORDER.find((k) => MODE_RX[k].test(raw) && modeKey(raw) === k) || "";
          return `<button class="mode-btn ${on ? "on" : ""}" data-preset="${esc(o)}" data-mode="${key}" aria-pressed="${on}"${dis}><ha-icon icon="${MODE_ICON[key] || "mdi:tune-variant"}"></ha-icon>${esc(cap(o))}</button>`;
        }).join("");
      }
      if (c.show_buttons !== false) {
        html += [["on", c.button_on, "mdi:power"], ["off", c.button_off, "mdi:power-off"]].filter((x) => x[1]).map(([k, id, ic]) => {
          const st = hass.states[id], nm = c[`button_${k}_label`] || (st && st.attributes.friendly_name) || (k === "on" ? "On" : tr(hass, "mode_off"));
          return `<button class="mode-btn" data-ext="${k}"${dis}><ha-icon icon="${ic}"></ha-icon>${esc(nm)}</button>`;
        }).join("");
      }
      // pendant qu'on déplace le curseur, on ne remplace pas la zone (sinon le geste est interrompu)
      const dragging = modesEl.querySelector(".kt-slider input:active");
      const tn = c.show_slider !== false && c.target_temperature && hass.states[c.target_temperature], tdom = domainOf(c.target_temperature);
      if (tn && ["number", "input_number"].includes(tdom) && !BAD.includes(String(tn.state).toLowerCase())) {
        const mn = Number(tn.attributes.min ?? 35), mx = Number(tn.attributes.max ?? 100), stp = Number(tn.attributes.step ?? 1), val = Number(tn.state);
        html += `<div class="kt-slider"><span>${esc(tr(hass, "target"))}</span><input type="range" min="${mn}" max="${mx}" step="${stp}" value="${Number.isFinite(val) ? val : mn}" aria-label="${esc(tr(hass, "target"))}"${dis}><b>${Number.isFinite(val) ? Math.round(val) : "--"}°</b></div>`;
      }
      if (!dragging) modesEl.innerHTML = html;
      modesEl.querySelectorAll("button").forEach((b) => {
        b.onclick = (ev) => {
          ev.stopPropagation();
          if (b.dataset.ext) { const id = c[`button_${b.dataset.ext}`], d = domainOf(id); hass.callService(d, d === "script" ? "turn_on" : "press", { entity_id: id }); } else this._setPreset(b.dataset.preset);
        };
      });
      const rg = modesEl.querySelector(".kt-slider input");
      if (rg) {
        // le geste sur le curseur ne doit pas déclencher l'action de la carte (fenêtre de détails)
        ["click", "pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "mouseup"].forEach((e) => rg.addEventListener(e, (ev) => ev.stopPropagation()));
        rg.oninput = () => { rg.nextElementSibling.textContent = `${rg.value}°`; };
        rg.onchange = () => hass.callService(tdom, "set_value", { entity_id: c.target_temperature, value: Number(rg.value) });
      }
    } else if (kind === "pellet_stove" && c.show_modes !== false && this._presetEntity() && hass.states[this._presetEntity()]) {
      // poêle à granulés : un bouton par pré-réglage réel de l'entité (preset_modes du climate, options du select)
      const pst = hass.states[this._presetEntity()], opts = this._presetOptions(pst);
      const cur = String(domainOf(pst.entity_id) === "climate" ? pst.attributes.preset_mode ?? "" : pst.state).toLowerCase();
      const cap = (s) => { const t = String(s).replace(/_/g, " "); return t.charAt(0).toUpperCase() + t.slice(1); };
      const presetHtml = opts.map((o) => {
        const raw = String(o).toLowerCase(), on = raw === cur;
        // icône / couleur seulement pour un nom reconnu (confort, éco, hors-gel…), sinon icône neutre
        const key = MODE_ORDER.find((k) => MODE_RX[k].test(raw) && modeKey(raw) === k) || "";
        return `<button class="mode-btn ${on ? "on" : ""}" data-preset="${esc(o)}" data-mode="${key}" aria-pressed="${on}"${m.status === "unavailable" ? " disabled" : ""}><ha-icon icon="${MODE_ICON[key] || "mdi:tune-variant"}"></ha-icon>${esc(cap(o))}</button>`;
      }).join("");
      // pendant qu'on déplace le curseur de la bouilloire, on ne remplace pas la zone des boutons (sinon le geste est interrompu)
      const dragging = kind === "kettle" && modesEl.querySelector(".kt-slider input:active");
      if (!dragging) modesEl.innerHTML = presetHtml;
      // bouilloire : curseur de la température personnalisée (entité number / input_number) quand le mode « Custom » est actif
      const tn = kind === "kettle" && c.target_temperature && hass.states[c.target_temperature], tdom = domainOf(c.target_temperature);
      if (!dragging && tn && ["number", "input_number"].includes(tdom) && /custom|personnalis/i.test(String(pst.state)) && !BAD.includes(String(tn.state).toLowerCase())) {
        const mn = Number(tn.attributes.min ?? 35), mx = Number(tn.attributes.max ?? 100), stp = Number(tn.attributes.step ?? 1), val = Number(tn.state);
        modesEl.innerHTML += `<div class="kt-slider"><span>${esc(tr(hass, "target"))}</span><input type="range" min="${mn}" max="${mx}" step="${stp}" value="${Number.isFinite(val) ? val : mn}" aria-label="${esc(tr(hass, "target"))}"><b>${Number.isFinite(val) ? Math.round(val) : "--"}°</b></div>`;
      }
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._setPreset(b.dataset.preset); }; });
      const rg = modesEl.querySelector(".kt-slider input");
      if (rg) {
        rg.oninput = () => { rg.nextElementSibling.textContent = `${rg.value}°`; };
        rg.onchange = () => hass.callService(tdom, "set_value", { entity_id: c.target_temperature, value: Number(rg.value) });
      }
    } else if (kind === "printer" && m.ink) {
      // niveaux d'encre : une barre par couleur (noir, cyan, magenta, jaune), clic = historique de l'entité
      modesEl.innerHTML = `<div class="ink">${m.ink.map((i) => `<div class="ink-row ${i.k}${i.low ? " low" : ""}" data-entity="${esc(i.id)}"><span>${esc(c.labels && c.labels[i.key] ? String(c.labels[i.key]) : tr(hass, i.key))}</span><div class="ink-bar"><div class="ink-fill" style="width:${i.v ?? 0}%"></div></div><span class="ink-v">${i.v == null ? "—" : `${fmtNum(hass, i.v, 0)} %`}</span></div>`).join("")}</div>`;
    } else if (kind === "vmc" && (c.switch_low || c.switch_high) && c.show_modes !== false) {
      // VMC à deux interrupteurs : un bouton par vitesse configurée, celui de la vitesse active est allumé
      const sp = [["low", c.switch_low, "mdi:fan-speed-1", "speed1"], ["high", c.switch_high, "mdi:fan-speed-3", "speed2"]].filter((x) => x[1]);
      modesEl.innerHTML = sp.map(([k, id, icon, lbl]) => {
        const st = hass.states[id], on = m.status === lbl, dis = !st || BAD.includes(String(st.state).toLowerCase());
        return `<button class="mode-btn ${on ? "on" : ""}" data-vmc="${k}" title="${esc(tr(hass, lbl))}" aria-label="${esc(tr(hass, lbl))}" aria-pressed="${on}"${dis ? " disabled" : ""}><ha-icon icon="${icon}"></ha-icon>${esc(tr(hass, lbl))}</button>`;
      }).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._setVmcSpeed(b.dataset.vmc); }; });
    } else if (kind === "smart_speaker" && c.show_controls !== false && domainOf(c.entity) === "media_player" && hass.states[c.entity]) {
      // enceinte : marche / arrêt, volume −, lecture / pause, volume +, sourdine (selon les fonctions annoncées par l'entité)
      const sf = Number(hass.states[c.entity].attributes.supported_features);
      // MediaPlayerEntityFeature : PAUSE 1, VOLUME_SET 4, VOLUME_MUTE 8, TURN_ON 128, TURN_OFF 256, VOLUME_STEP 1024, PLAY 16384
      const has = (bit) => !Number.isFinite(sf) || (sf & bit) !== 0;
      const off = ["off", "standby", "unavailable"].includes(m.status), play = ["playing", "muted"].includes(m.status), vol = has(4) || has(1024);
      const all = {
        power: has(128) || has(256) ? ["power", "mdi:power", "toggle", !off] : null,
        vol_down: vol ? ["vol_down", "mdi:volume-minus", "volume_down", null] : null,
        play_pause: has(1) || has(16384) ? ["play_pause", play ? "mdi:pause" : "mdi:play", play ? "pause" : "play", play] : null,
        vol_up: vol ? ["vol_up", "mdi:volume-plus", "volume_up", null] : null,
        mute: has(8) ? ["mute", m.muted ? "mdi:volume-off" : "mdi:volume-high", "mute", m.muted] : null,
        prev_track: has(16) ? ["prev_track", "mdi:skip-previous", "previous_track", null] : null,
        next_track: has(32) ? ["next_track", "mdi:skip-next", "next_track", null] : null,
      };
      // buttons : liste ordonnée des boutons à afficher (ex. [power, play_pause, mute]) ; par défaut : marche / arrêt, volume −, lecture / pause, volume +, sourdine
      const order = Array.isArray(c.buttons) && c.buttons.length ? c.buttons : ["power", "vol_down", "play_pause", "vol_up", "mute"];
      const btns = order.map((k) => all[k]).filter(Boolean);
      // curseur de volume (volume_set) : dès que l'enceinte annonce VOLUME_SET et un volume ; pas = volume_step, sinon 1 %
      const sa = hass.states[c.entity].attributes || {};
      const stepPct = Math.max(1, Math.round((Number(c.volume_step) || 0.01) * 100)), vp = m.vol != null ? Math.round(m.vol * 100) : 0;
      const slider = has(4) && c.show_volume_slider !== false && sa.volume_level != null
        ? `<label class="av-vol-row"><ha-icon icon="mdi:volume-medium"></ha-icon><input class="av-vol" type="range" min="0" max="100" step="${stepPct}" value="${vp}" aria-label="${esc(tr(hass, "volume"))}"${off ? " disabled" : ""}><span class="av-vol-v">${vp} %</span></label>` : "";
      // pas de reconstruction pendant que le curseur est tenu (sinon il saute sous le doigt)
      if (!this._avDrag) {
        modesEl.innerHTML = slider + btns.map(([k, icon, lbl, on]) => {
          const dis = m.status === "unavailable" || (off && k !== "power");
          return `<button class="mode-btn sp-btn ${on ? "on" : ""}" data-sp="${k}" title="${esc(tr(hass, lbl))}" aria-label="${esc(tr(hass, lbl))}"${on != null ? ` aria-pressed="${on}"` : ""}${dis ? " disabled" : ""}><ha-icon icon="${icon}"></ha-icon></button>`;
        }).join("");
        modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._press(b); this._spkCmd(b.dataset.sp); }; });
        const rg = modesEl.querySelector(".av-vol");
        if (rg) {
          const lab = modesEl.querySelector(".av-vol-v");
          ["click", "pointerdown", "pointerup", "touchstart", "touchend", "mousedown", "mouseup"].forEach((e) => rg.addEventListener(e, (ev) => ev.stopPropagation()));
          rg.oninput = () => { this._avDrag = true; lab.textContent = `${rg.value} %`; };
          rg.onchange = () => { this._avDrag = false; hass.callService("media_player", "volume_set", { entity_id: c.entity, volume_level: Number(rg.value) / 100 }); };
          rg.onblur = () => { this._avDrag = false; };
        }
      }
    } else if (kind === "ceiling_fan" && c.show_controls !== false && domainOf(c.entity) === "fan" && hass.states[c.entity]) {
      // ventilateur de plafond : marche / arrêt, 3 vitesses, sens de rotation (selon les fonctions annoncées par l'entité)
      // FanEntityFeature : SET_SPEED 1, DIRECTION 4, TURN_OFF 16, TURN_ON 32
      const fst = hass.states[c.entity], a = fst.attributes || {}, sf = Number(a.supported_features);
      const has = (bit) => !Number.isFinite(sf) || (sf & bit) !== 0;
      const on = String(fst.state).toLowerCase() === "on", unav = m.status === "unavailable";
      const lvl = on ? Number((/^fan_(\d)$/.exec(m.status) || [])[1]) || 0 : 0;
      const rev = String(a.direction || "").toLowerCase() === "reverse";
      const btns = [
        ["power", `<ha-icon icon="mdi:power"></ha-icon>`, tr(hass, "toggle"), on, false],
        ...(has(1) || a.percentage != null ? [1, 2, 3].map((n) => [`speed${n}`, `<span class="fan-n">${n}</span>`, `${tr(hass, "fan_speed")} ${n}`, lvl === n, !on]) : []),
        ...(has(4) || a.direction != null ? [["dir", `<ha-icon icon="${rev ? "mdi:white-balance-sunny" : "mdi:snowflake"}"></ha-icon>`, tr(hass, rev ? "fan_dir_reverse" : "fan_dir_forward"), rev, !on]] : []),
      ];
      modesEl.innerHTML = btns.map(([k, inner, lbl, act, dis]) =>
        `<button class="mode-btn sp-btn ${act ? "on" : ""}" data-fan="${k}" title="${esc(lbl)}" aria-label="${esc(lbl)}" aria-pressed="${!!act}"${unav || dis ? " disabled" : ""}>${inner}</button>`).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._fanCmd(b.dataset.fan); }; });
    } else if (kind === "av_receiver" && c.show_controls !== false && domainOf(c.entity) === "media_player" && hass.states[c.entity]) {
      // ampli : pochette et morceau en cours, curseur de volume, puis marche / arrêt, sourdine, volume −, volume +, piste précédente / suivante, source suivante, mode audio suivant (selon les fonctions annoncées par l'entité)
      const a = hass.states[c.entity].attributes || {}, sf = Number(a.supported_features);
      // MediaPlayerEntityFeature : PAUSE 1, VOLUME_SET 4, VOLUME_MUTE 8, PREVIOUS_TRACK 16, NEXT_TRACK 32, TURN_ON 128, TURN_OFF 256, VOLUME_STEP 1024, SELECT_SOURCE 2048, PLAY 16384
      const has = (bit) => !Number.isFinite(sf) || (sf & bit) !== 0;
      const off = ["off", "standby", "unavailable"].includes(m.status), muted = m.status === "muted" || !!a.is_volume_muted, vol = has(4) || has(1024);
      const ms = String(hass.states[c.entity].state).toLowerCase(), play = ms === "playing";
      const btns = [
        has(16) ? ["prev_track", "mdi:skip-previous", "previous_track", null] : null,
        has(1) || has(16384) ? ["play_pause", play ? "mdi:pause" : "mdi:play", play ? "pause" : "play", play] : null,
        has(32) ? ["next_track", "mdi:skip-next", "next_track", null] : null,
        has(8) ? ["mute", muted ? "mdi:volume-off" : "mdi:volume-high", "mute", muted] : null,
        vol ? ["vol_down", "mdi:volume-minus", "volume_down", null] : null,
        vol ? ["vol_up", "mdi:volume-plus", "volume_up", null] : null,
        has(128) || has(256) ? ["power", "mdi:power", "toggle", !off] : null,
        has(2048) && Array.isArray(a.source_list) && a.source_list.length > 1 ? ["source", "mdi:import", "source_next", null] : null,
        Array.isArray(a.sound_mode_list) && a.sound_mode_list.length > 1 ? ["sound_mode", "mdi:surround-sound", "sound_mode_next", null] : null,
      ].filter(Boolean);
      // pochette (entity_picture, relative à HA ou absolue), artiste et titre
      const pic = a.entity_picture_local || a.entity_picture;
      const cover = pic && /^(https?:\/\/|\/)/.test(pic) && !off && c.show_media !== false ? (/^https?:/.test(pic) ? pic : typeof hass.hassUrl === "function" ? hass.hassUrl(pic) : pic) : "";
      const title = a.media_title ? String(a.media_title) : "", artist = a.media_artist ? String(a.media_artist) : "";
      const media = c.show_media !== false && !off && (cover || title || artist)
        ? `<div class="av-media">${cover ? `<img class="av-cover" src="${esc(cover)}" alt="" loading="lazy">` : ""}<div class="av-track"><div class="av-title">${esc(title)}</div><div class="av-artist">${esc(artist)}</div></div></div>` : "";
      // curseur de volume (volume_set) : pas = volume_step si défini, sinon 1 %
      const stepPct = Math.max(1, Math.round((Number(c.volume_step) || 0.01) * 100)), vp = m.vol != null ? Math.round(m.vol * 100) : 0;
      const slider = has(4) && c.show_volume_slider !== false && a.volume_level != null
        ? `<label class="av-vol-row"><ha-icon icon="mdi:volume-medium"></ha-icon><input class="av-vol" type="range" min="0" max="100" step="${stepPct}" value="${vp}" aria-label="${esc(tr(hass, "volume"))}"${off ? " disabled" : ""}><span class="av-vol-v">${vp} %</span></label>` : "";
      // pas de reconstruction pendant que le curseur est tenu (sinon il saute sous le doigt)
      if (!this._avDrag) {
        modesEl.innerHTML = media + slider + btns.map(([k, icon, lbl, on]) => {
          const dis = m.status === "unavailable" || (off && k !== "power");
          return `<button class="mode-btn sp-btn ${on ? "on" : ""}" data-sp="${k}" title="${esc(tr(hass, lbl))}" aria-label="${esc(tr(hass, lbl))}"${on != null ? ` aria-pressed="${on}"` : ""}${dis ? " disabled" : ""}><ha-icon icon="${icon}"></ha-icon></button>`;
        }).join("");
        modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._press(b); this._spkCmd(b.dataset.sp); }; });
        const rg = modesEl.querySelector(".av-vol");
        if (rg) {
          const lab = modesEl.querySelector(".av-vol-v");
          rg.onclick = (ev) => ev.stopPropagation();
          rg.oninput = () => { this._avDrag = true; lab.textContent = `${rg.value} %`; };
          rg.onchange = () => { this._avDrag = false; hass.callService("media_player", "volume_set", { entity_id: c.entity, volume_level: Number(rg.value) / 100 }); };
          rg.onblur = () => { this._avDrag = false; };
        }
      }
    } else if (kind === "tv" && (c.show_controls ?? tvProjector(c)) && domainOf(c.entity) === "media_player" && hass.states[c.entity]) {
      // télé / vidéoprojecteur, en 2 rangées : marche / arrêt (vert), chaîne +, chaîne −, lecture / pause (bleu en pause) ;
      // sourdine (rouge), volume +, volume −, source (fenêtre de choix avec icônes)
      const a = hass.states[c.entity].attributes || {}, sf = Number(a.supported_features);
      // MediaPlayerEntityFeature : PAUSE 1, VOLUME_SET 4, VOLUME_MUTE 8, PREVIOUS_TRACK 16, NEXT_TRACK 32, TURN_ON 128, TURN_OFF 256, VOLUME_STEP 1024, SELECT_SOURCE 2048, PLAY 16384
      const has = (bit) => !Number.isFinite(sf) || (sf & bit) !== 0;
      const off = m.status !== "screen_on", muted = !!a.is_volume_muted, vol = has(4) || has(1024), pp = this._playState(hass.states[c.entity]);
      const btns = [
        has(128) || has(256) ? ["power", "mdi:power", "toggle", !off] : null,
        has(32) ? ["ch_up", "mdi:chevron-up", "channel_up", null] : null,
        has(16) ? ["ch_down", "mdi:chevron-down", "channel_down", null] : null,
        Number.isFinite(sf) && ((sf & 1) || (sf & 16384)) ? ["play_pause", off ? "mdi:play-pause" : pp.paused ? "mdi:play" : "mdi:pause", pp.paused ? "play" : "pause", !off && pp.paused] : null,
        has(8) ? ["mute", muted ? "mdi:volume-off" : "mdi:volume-high", "mute", muted] : null,
        vol ? ["vol_up", "mdi:volume-plus", "volume_up", null] : null,
        vol ? ["vol_down", "mdi:volume-minus", "volume_down", null] : null,
        has(2048) && Array.isArray(a.source_list) && a.source_list.length > 1 ? ["source_menu", "mdi:video-input-hdmi", "source_select", null] : null,
      ].filter(Boolean);
      modesEl.innerHTML = btns.map(([k, icon, lbl, on]) => {
        const dis = m.status === "unavailable" || (off && k !== "power");
        return `<button class="mode-btn sp-btn ${on ? "on" : ""}" data-sp="${k}" title="${esc(tr(hass, lbl))}" aria-label="${esc(tr(hass, lbl))}"${on != null ? ` aria-pressed="${on}"` : ""}${dis ? " disabled" : ""}><ha-icon icon="${icon}"></ha-icon></button>`;
      }).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._press(b); this._spkCmd(b.dataset.sp); }; });
    } else if (kind === "dosing_pump" && c.dose_timer) {
      // doseuse programmée (aquarium) : bouton Timer, clic = bascule, allumé = distribue selon l'intervalle prévu
      const id = c.dose_timer, st = hass.states[id], on = isOn(st), name = tr(hass, "dose_timer");
      modesEl.innerHTML = `<button class="mode-btn outlet-btn ${on ? "on" : ""}" data-outlet="${esc(id)}" title="${esc(name)}" aria-label="${esc(name)}" aria-pressed="${on}" ${!st || st.state === "unavailable" ? "disabled" : ""}><ha-icon icon="mdi:timer-outline"></ha-icon>${esc(name)}</button>`;
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => {
        ev.stopPropagation();
        const dom = domainOf(b.dataset.outlet);
        hass.callService(["switch", "input_boolean", "light", "fan"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: b.dataset.outlet });
      }; });
    } else if (kind === "pool_pump" && POOL_CTL.some(([k]) => c[k])) {
      // piscine : un bouton par équipement commandé (doseuses pH+ / pH-, électrolyse, PAC, douche), clic = bascule, bouton allumé = en marche
      modesEl.innerHTML = POOL_CTL.filter(([k]) => c[k]).map(([k, icon, lbl]) => {
        const id = c[k], st = hass.states[id], on = isOn(st), name = tr(hass, lbl);
        return `<button class="mode-btn outlet-btn ${on ? "on" : ""}" data-outlet="${esc(id)}" title="${esc(name)}" aria-label="${esc(name)}" aria-pressed="${on}" ${!st || st.state === "unavailable" ? "disabled" : ""}><ha-icon icon="${icon}"></ha-icon>${esc(name)}</button>`;
      }).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.outlet, dom = domainOf(id);
        hass.callService(["switch", "input_boolean", "light", "fan"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: id });
      }; });
    } else if (kind === "power_strip" && Array.isArray(c.outlets) && c.outlets.length) {
      // multiprise : un bouton par prise commandée (numéro, nom de l'entité en infobulle), clic = bascule
      modesEl.innerHTML = c.outlets.map((id, i) => {
        const st = hass.states[id], on = isOn(st), name = (st && st.attributes.friendly_name) || id;
        return `<button class="mode-btn outlet-btn ${on ? "on" : ""}" data-outlet="${esc(id)}" title="${esc(name)}" aria-label="${esc(name)}" aria-pressed="${on}" ${!st || st.state === "unavailable" ? "disabled" : ""}><ha-icon icon="mdi:power-socket-fr"></ha-icon>${i + 1}</button>`;
      }).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.outlet, dom = domainOf(id);
        hass.callService(["switch", "input_boolean", "light"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: id });
      }; });
    } else modesEl.innerHTML = "";

    // stats
    const tiles = [];
    // libellé perso (option labels) sinon traduction
    const lb = (k) => (c.labels && c.labels[k] != null && c.labels[k] !== "" ? String(c.labels[k]) : tr(hass, k));
    const tile = (icon, value, label, entity, cls = "") => {
      if (value == null) return;
      tiles.push(`<div class="tile ${cls}" ${entity ? `data-entity="${esc(entity)}"` : ""}>
        <span class="val">${esc(value)}</span><span class="lbl"><ha-icon icon="${icon}"></ha-icon>${esc(label)}</span></div>`);
    };
    const tEntity = c.temperature || (["water_heater", "climate"].includes(domainOf(c.entity)) ? c.entity : null);
    if (kind === "chest_freezer" || kind === "drawer_freezer") {
      if (m.tempVal != null) tile("mdi:snowflake-thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity,
        m.alerts.includes("too_warm") ? "warn" : "");
    } else if (kind === "beer_tap") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.keg != null) tile("mdi:keg", `${fmtNum(hass, m.keg, 0, 0, c.keg_level)} %`, lb("keg"), c.keg_level, m.alerts.includes("keg_low") ? "warn" : "");
    } else if (kind === "power_strip") {
      // prises commandées : boutons dans la rangée .modes (plus de tuile « 1 / 3 »)
    } else if (kind === "phone_charger") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0, 0, c.battery_level)} %`, lb("battery"), c.battery_level);
    } else if (kind === "garland") {
      if (m.glEffect && m.status === "lit") tile("mdi:auto-fix", m.glEffect, lb("effect"), c.entity);
    } else if (kind === "iron" || kind === "steam_station") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 0, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.waterE) tile("mdi:water", m.waterPct != null ? `${fmtNum(hass, m.waterPct, 0, 0, c.water_level)} %` : tr(hass, m.waterLow ? "tank_empty_short" : "tank_ok"), lb("water"), c.water_level, m.waterLow ? "warn" : "");
      if (m.steamE) tile("mdi:weather-fog", stateText(hass, m.steamE), lb("steam"), c.steam);
    } else if (kind === "kettle") {
      if (m.tempVal != null) tile("mdi:thermometer-water", `${fmtNum(hass, m.tempVal, 0, 0, tEntity)} ${m.tempUnit}`, lb("water"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 0, 0, c.target_temperature)} ${m.tempUnit}`, lb("target"), c.target_temperature);
      if (c.counter && hass.states[c.counter] && !BAD.includes(String(hass.states[c.counter].state).toLowerCase())) tile("mdi:counter", fmtUnit(hass, hass.states[c.counter], 0), lb("counter"), c.counter);
    } else if (kind === "tool_charger") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0, 0, c.battery_level)} %`, lb("battery"), c.battery_level);
    } else if (kind === "wine_cooler") {
      const dual = !!c.zone2_temperature, max1 = c.max_temperature ?? (m.T ? m.T.c(18) : 18), max2 = c.max_temperature_2 ?? max1;
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb(dual ? "zone_top" : "temperature"), tEntity, m.tempVal > max1 ? "warn" : "");
      if (dual && m.zone2 != null) tile("mdi:thermometer-low", `${fmtNum(hass, m.zone2, 1, 0, c.zone2_temperature)} ${m.T ? m.T.unit : m.zone2Ent?.attributes.unit_of_measurement || m.tempUnit}`, lb("zone_bottom"), c.zone2_temperature, m.zone2 > max2 ? "warn" : "");
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, c.humidity)} %`, lb("humidity"), c.humidity, m.alerts.includes("humid") ? "warn" : "");
    } else if (kind === "fridge") {
      if ((!c.energy || c.layout !== "split") && m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("fridge_temp"), tEntity,
        m.tempVal > m.maxF ? "warn" : "");
      if (m.ftemp) tile("mdi:snowflake", m.T ? (m.ftempVal != null ? `${fmtNum(hass, m.ftempVal, 1, 0, c.freezer_temperature)} ${m.T.unit}` : null) : fmtUnit(hass, m.ftemp, 1), lb("freezer_temp"), c.freezer_temperature,
        m.ftempVal > m.maxZ ? "warn" : "");
      if (m.flexVal != null) tile("mdi:thermometer-lines", `${fmtNum(hass, m.flexVal, 1, 0, c.flex_temperature)} ${m.T ? m.T.unit : m.flex.attributes.unit_of_measurement || m.tempUnit}`, lb("flex_temp"), c.flex_temperature,
        c.flex_max_temperature != null && m.flexVal > c.flex_max_temperature ? "warn" : "");
    } else if (kind === "radiator") {
      const te = c.temperature || (domainOf(c.entity) === "climate" ? c.entity : null);
      if (m.tempVal != null) tile("mdi:home-thermometer", `${fmtNum(hass, m.tempVal, 1, 0, te)} ${m.tempUnit}`, lb("temperature"), te);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1, 0, c.target_temperature || te)} ${m.tempUnit}`, lb("target"), c.target_temperature || te);
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, c.humidity || c.entity)} %`, lb("humidity"), c.humidity || c.entity);
    } else if (kind === "dehumidifier") {
      const hEnt = c.humidity || (domainOf(c.entity) === "humidifier" ? c.entity : null);
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, hEnt)} %`, lb("humidity"), hEnt, m.alerts.includes("humid") ? "warn" : "");
      if (m.targetHumVal != null) tile("mdi:target", `${fmtNum(hass, m.targetHumVal, 0, 0, c.target_humidity || hEnt)} %`, lb("target"), c.target_humidity || hEnt);
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.tank) tile(m.tankFull ? "mdi:cup-water" : "mdi:cup-outline", tr(hass, m.tankFull ? "tank_full_short" : "tank_ok"), lb("tank"), c.tank_full, m.tankFull ? "warn" : "");
      if (m.fanSpeed && !BAD.includes(String(m.fanSpeed.state).toLowerCase())) tile("mdi:fan", domainOf(c.fan_speed) === "fan" ? `${fmtNum(hass, Number(m.fanSpeed.attributes.percentage) || 0, 0, 0, c.fan_speed)} %` : stateText(hass, m.fanSpeed), lb("fan_speed"), c.fan_speed);
      if (m.dhMode) tile("mdi:tune-variant", m.dhMode, lb("mode"), c.mode || c.entity);
    } else if (kind === "air_purifier") {
      if (m.pm != null) tile("mdi:blur", `${fmtNum(hass, m.pm, 0, 0, c.pm25)} µg/m³`, lb("pm25"), c.pm25, m.alerts.includes("air_poor") ? "warn" : "");
      if (m.fanSpeed && !BAD.includes(String(m.fanSpeed.state).toLowerCase())) tile("mdi:fan", domainOf(c.fan_speed) === "fan" ? `${fmtNum(hass, Number(m.fanSpeed.attributes.percentage) || 0, 0, 0, c.fan_speed)} %` : stateText(hass, m.fanSpeed), lb("fan_speed"), c.fan_speed);
      if (m.filterE && !BAD.includes(String(m.filterE.state).toLowerCase())) tile("mdi:air-filter", m.filterPct != null ? `${fmtNum(hass, m.filterPct, 0, 0, c.filter)} %` : tr(hass, m.filterBad ? "replace_short" : "tank_ok"), lb("filter"), c.filter, m.filterBad ? "warn" : "");
    } else if (kind === "wet_vacuum") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0, 0, c.battery_level)} %`, lb("battery"), c.battery_level, m.battLow ? "warn" : "");
      const tank = (pct, alert, okKey, badKey) => (pct != null ? `${fmtNum(hass, pct, 0)} %` : tr(hass, alert ? badKey : okKey));
      if (m.cleanW) tile("mdi:water", tank(m.cleanPct, m.cleanEmpty, "tank_ok", "tank_empty_short"), lb("clean_water"), c.clean_water, m.cleanEmpty ? "warn" : "");
      if (m.dirtyW) tile("mdi:water-opacity", tank(m.dirtyPct, m.dirtyFull, "tank_ok", "tank_full_short"), lb("dirty_water"), c.dirty_water, m.dirtyFull ? "warn" : "");
      if (m.mode && !BAD.includes(String(m.mode.state).toLowerCase())) tile("mdi:tune-variant", stateText(hass, m.mode), lb("mode"), c.mode);
    } else if (kind === "hob") {
      /* no extra tile */
    } else if (kind === "vmc") {
      if (m.vxDir || m.vxState) tile(m.vxDir === "supply" ? "mdi:arrow-up-bold-box-outline" : "mdi:arrow-down-bold-box-outline", m.vxSpeed ? `${m.vxState} · ${m.vxSpeed}` : m.vxState, lb("direction"), c.direction);
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, c.humidity)} %`, lb("humidity"), c.humidity, m.alerts.includes("humid") ? "warn" : "");
    } else if (kind === "printer_3d") {
      if (m.progress != null) tile("mdi:progress-check", `${fmtNum(hass, m.progress, 0, 0, c.progress)} %`, lb("progress"), c.progress);
      if (m.nozzles && m.nozzles.length) {
        // une puce par buse : T0, T1, T2…
        m.nozzles.forEach((id, i) => {
          const v = num(hass.states[id]);
          tile("mdi:printer-3d-nozzle-heat", v != null ? `${fmtNum(hass, v, 0, 0, id)} ${m.tempUnit}` : "—", `T${i}`, id);
        });
      } else if (m.tempVal != null) tile("mdi:printer-3d-nozzle-heat", `${fmtNum(hass, m.tempVal, 0, 0, tEntity)} ${m.tempUnit}`, lb("nozzle"), tEntity);
      if (m.bedTemp != null) tile("mdi:heat-wave", `${fmtNum(hass, m.bedTemp, 0, 0, c.bed_temperature)} ${m.tempUnit}`, lb("bed"), c.bed_temperature);
    } else if (kind === "tv") {
      // télé / vidéoprojecteur : source, volume (media_player), heures de lampe, mode d'image, température
      const pj = tvProjector(c), on = m.status === "screen_on";
      const a = m.main && domainOf(c.entity) === "media_player" ? m.main.attributes || {} : {};
      if (on && a.source && (c.show_source ?? pj)) tile("mdi:video-input-hdmi", String(a.source), lb("source"), c.entity);
      if (on && a.volume_level != null && Number.isFinite(Number(a.volume_level)) && (c.show_volume ?? pj))
        tile(a.is_volume_muted ? "mdi:volume-off" : "mdi:volume-high", `${Math.round(Number(a.volume_level) * 100)} %`, lb("volume"), c.entity, a.is_volume_muted ? "warn" : "");
      if (m.lampE && c.show_lamp !== false && !BAD.includes(String(m.lampE.state).toLowerCase()))
        tile("mdi:lightbulb-on-outline", num(m.lampE) != null ? `${fmtNum(hass, num(m.lampE), 0, 0, c.lamp_hours)} ${m.lampE.attributes.unit_of_measurement || "h"}` : stateText(hass, m.lampE), lb("lamp"), c.lamp_hours);
      if (m.picMode && c.show_picture_mode !== false && !BAD.includes(String(m.picMode.state).toLowerCase()))
        tile("mdi:palette", stateText(hass, m.picMode), lb("picture_mode"), c.picture_mode);
      if (m.tempVal != null && c.show_temperature !== false) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 0, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
    } else if (kind === "av_receiver") {
      // ampli : source active et mode audio actuel (attributs `source` et `sound_mode` du media_player)
      const a = m.main && domainOf(c.entity) === "media_player" ? m.main.attributes || {} : {}, up = !["off", "standby", "unavailable"].includes(m.status);
      if (up && a.source && c.show_source !== false) tile("mdi:import", String(a.source), lb("source_active"), c.entity);
      if (up && a.sound_mode && c.show_sound_mode !== false) tile("mdi:surround-sound", String(a.sound_mode), lb("sound_mode"), c.entity);
    } else if (kind === "smart_speaker") {
      if (m.vol != null && !["off", "standby", "unavailable"].includes(m.status)) tile(m.muted ? "mdi:volume-off" : "mdi:volume-high", `${Math.round(m.vol * 100)} %`, lb("volume"), c.entity, m.muted ? "warn" : "");
      if (spOn && m.app) tile("mdi:music-box-outline", m.app, lb("source"), c.entity);
    } else if (FIT_KINDS.includes(kind)) {
      const f = m.fit, rower = kind === "rowing_machine";
      if (m.speed) tile("mdi:speedometer", fmtUnit(hass, m.speed, 1), lb("speed"), c.speed);
      if (f.cadence) tile(rower ? "mdi:rowing" : "mdi:rotate-right", fmtUnit(hass, f.cadence, 0), lb(rower ? "stroke_rate" : "cadence"), c.cadence);
      if (f.distance) tile("mdi:map-marker-distance", fmtUnit(hass, f.distance, 2), lb("distance"), c.distance);
      if (f.hr) tile("mdi:heart-pulse", fmtUnit(hass, f.hr, 0), lb("heart_rate"), c.heart_rate);
      if (f.kcal) tile("mdi:fire", fmtUnit(hass, f.kcal, 0), lb("calories"), c.calories);
    } else if (kind === "dosing_pump") {
      if (m.pool && m.pool.ph) tile("mdi:ph", fmtUnit(hass, m.pool.ph, 2), lb("ph"), c.ph);
      // aquarium (doseuse Jebao…) : intervalle en jours, volume par dose, heure de distribution
      const dst = (k) => { const s = c[k] && hass.states[c[k]]; return s && !BAD.includes(String(s.state).toLowerCase()) ? s : null; };
      const dInt = dst("dose_interval"), dVol = dst("dose_volume"), dTime = dst("dose_time");
      if (dInt && num(dInt) != null) tile("mdi:calendar-refresh-outline", `${fmtNum(hass, num(dInt), 0, 0, c.dose_interval)} ${tr(hass, "day_short")}`, lb("dose_interval"), c.dose_interval);
      if (dVol) tile("mdi:cup-water", fmtUnit(hass, dVol, 1), lb("dose_volume"), c.dose_volume);
      if (dTime) {
        const sched = Array.isArray(dTime.attributes.schedule) && dTime.attributes.schedule[0] && dTime.attributes.schedule[0].time;
        const t = /^\d{1,2}:\d{2}/.test(String(dTime.state)) ? String(dTime.state).slice(0, 5) : sched ? String(sched).slice(0, 5) : String(dTime.state);
        tile("mdi:clock-outline", t, lb("dose_time"), c.dose_time);
      }
    } else if (kind === "pool_pump") {
      if (m.tempVal != null && c.show_temperature !== false) tile("mdi:thermometer-water", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("water"), tEntity);
      // analyses de l'eau : [clé, icône, décimales] ; chaque mesure se masque avec show_<clé>: false
      for (const [k, ic, dg] of [["ph", "mdi:ph", 2], ["orp", "mdi:flash-triangle-outline", 0], ["pressure", "mdi:gauge", 2], ["tds", "mdi:water-opacity", 0], ["salt", "mdi:shaker-outline", 1], ["chlorine", "mdi:flask-outline", 2]])
        if (c[`show_${k}`] !== false && m.pool && m.pool[k]) tile(ic, fmtUnit(hass, m.pool[k], dg), lb(k), c[k]);
      if (m.presence && !BAD.includes(String(m.presence.state).toLowerCase())) tile(isOn(m.presence) ? "mdi:account-check" : "mdi:account-off-outline", tr(hass, isOn(m.presence) ? "presence_on" : "presence_off"), lb("presence"), c.presence);
      if (m.runtime != null) tile("mdi:timer-outline", fmtDuration(m.runtime), lb("today"), c.runtime);
      if (num(m.speed) != null) tile("mdi:speedometer", fmtUnit(hass, m.speed, 0), lb("speed"), c.speed);
    } else if (kind === "pellet_stove") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1, 0, c.target_temperature || tEntity)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
      if (m.level != null) tile("mdi:fire", `P${fmtNum(hass, m.level, 0, 0, c.power_level)}`, lb("level"), c.power_level);
      if (m.pellets != null) tile("mdi:grain", `${fmtNum(hass, m.pellets, 0, 0, c.pellet_level)} %`, lb("pellets"), c.pellet_level, m.alerts.includes("pellets_low") ? "warn" : "");
    } else if (["water_heater", "oven", "air_fryer", "ac_split", "heat_pump", "towel_dryer", "server_rack", "cookeo"].includes(kind)) {
      // température et consigne au dixième (18,2 / 16,5 ; un entier reste sans décimale), sauf four et friteuse (200 °C)
      const td = ["oven", "air_fryer", "cookeo"].includes(kind) ? 0 : 1;
      // show_temperature / show_target : masquer la température de la pièce et la consigne (clim : icône seule)
      if (m.tempVal != null && c.show_temperature !== false) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, td, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null && c.show_target !== false) tile("mdi:target", `${fmtNum(hass, m.targetVal, td, 0, c.target_temperature || tEntity)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
      if (m.dual) {
        if (m.temp2 != null) tile("mdi:thermometer", `${fmtNum(hass, m.temp2, 0, 0, c.temperature_2)} ${m.tempUnit}`, lb("temperature_2"), c.temperature_2);
        if (m.target2 != null && m.target2 > 0) tile("mdi:target", `${fmtNum(hass, m.target2, 0, 0, c.target_temperature_2)} ${m.tempUnit}`, lb("target_2"), c.target_temperature_2);
        if (m.remaining2 != null && m.remaining2 > 0) tile("mdi:timer-sand", fmtDuration(m.remaining2), lb("remaining_2"), c.remaining_2);
        if (m.st2) tile("mdi:stove", stateText(hass, m.st2), lb("cavity_2"), c.status_2);
      }
      // eau chaude restante : % (tuile « Eau chaude ») et litres (tuile « Volume ») — deux tuiles, sinon le texte est tronqué
      if (kind === "water_heater" && m.hotPct != null) tile("mdi:water-thermometer", `${fmtNum(hass, m.hotPct, 0, 0, c.hot_water_level || c.hot_water_volume)} %`, lb("hot_water"), c.hot_water_level || c.hot_water_volume);
      if (kind === "water_heater" && m.hotL != null) tile("mdi:water", `${fmtNum(hass, m.hotL, 0, 0, c.hot_water_volume || c.hot_water_level)} L`, lb("volume"), c.hot_water_volume || c.hot_water_level);
      if (kind === "ac_split" && m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, c.humidity || c.entity)} %`, lb("humidity"), c.humidity || c.entity);
      if (kind === "towel_dryer" && m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0, 0, c.humidity || c.entity)} %`, lb("humidity"), c.humidity || c.entity);
    }
    if (m.remaining != null && m.remaining > 0 && active && kind !== "water_heater") tile("mdi:timer-sand", `${m.estimated ? "≈ " : ""}${fmtDuration(m.remaining)}`, lb("remaining"), c.remaining);
    else if (m.soon && active) tile("mdi:timer-sand-complete", tr(hass, "almost_done"), lb("remaining"), c.power);
    const solar = kind === "solar";
    const dual = kind === "water_heater" && (m.pwS || m.energyS);
    const showOpt = (k) => c[k] !== false;
    // hide_zero_power (activé par défaut) : tuiles de puissance masquées quand elles valent 0 (moins de 1 W), ex. chauffe-eau au repos
    const zero = (st) => c.hide_zero_power !== false && Math.abs(powerW(st) ?? 0) < 1;
    if (m.pw && showOpt("show_power") && !zero(m.pw)) tile(solar ? "mdi:solar-power" : "mdi:flash", fmtPower(hass, m.pw) ?? "—", lb(solar ? "production" : dual ? "grid" : "power"), c.power);
    // PAC et plaque : facteur de puissance (cos φ), capteur en valeur décimale (0,92) ou en %
    if ((kind === "heat_pump" || kind === "hob") && c.power_factor) {
      const pfS = hass.states[c.power_factor], pf = pfS ? num(pfS) : null;
      if (pf != null && Number.isFinite(pf) && !(m.pw && zero(m.pw))) {
        const pct = String((pfS.attributes && pfS.attributes.unit_of_measurement) || "").trim() === "%" || Math.abs(pf) > 1.5;
        tile("mdi:cosine-wave", pct ? `${fmtNum(hass, pf, 0, 0, c.power_factor)} %` : fmtNum(hass, pf, 2, 0, c.power_factor), lb("power_factor"), c.power_factor);
      }
    }
    // prise connectée : intensité (A) et tension (V), à la suite de la puissance
    if (kind === "smart_plug") {
      [["current", "mdi:current-ac", c.current], ["voltage", "mdi:sine-wave", c.voltage]].forEach(([k, ic, id]) => {
        const st = id && hass.states[id], v = st ? num(st) : null;
        if (v == null || !Number.isFinite(v)) return;
        const u = (st.attributes && st.attributes.unit_of_measurement) || (k === "current" ? "A" : "V"), a = Math.abs(v);
        tile(ic, `${fmtNum(hass, v, k === "current" ? (a < 10 ? 2 : 1) : (a >= 100 ? 0 : 1), 0, id)} ${u}`, lb(k), id);
      });
    }
    if (m.pwS && !zero(m.pwS)) tile("mdi:solar-power", fmtPower(hass, m.pwS) ?? "—", lb("solar_surplus"), c.power_solar);
    // display : "energy" (kWh seuls), "cost" (€ seuls, si price_per_kwh est valide), "both" (kWh ET coût de la période), sinon le comportement historique
    const pr = typeof c.price_per_kwh === "string" ? num(hass.states[c.price_per_kwh]) : Number(c.price_per_kwh);
    const hasPr = c.price_per_kwh != null && c.price_per_kwh !== "" && Number.isFinite(pr);
    const prEnt = typeof c.price_per_kwh === "string" ? c.price_per_kwh : null;
    const showKwh = !(c.display === "cost" && hasPr), showCost = hasPr && c.display !== "energy";
    const money = (x) => {
      const cur = (hass.config && hass.config.currency) || "EUR";
      try { return new Intl.NumberFormat(numLoc(hass), { style: "currency", currency: cur, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x); }
      catch (e) { return `${fmtNum(hass, x, 2, 2)} ${cur}`; }
    };
    const per = PERIODS.includes(c.energy_period) && this._perKwh != null ? c.energy_period : null;
    // energy_period: none → aucune tuile énergie (le compteur sert encore au dernier cycle)
    // show_energy / show_cost (cases de l'éditeur, cochées par défaut) : masquent les tuiles énergie / coût
    const noEnergy = c.energy_period === "none" || !showOpt("show_energy");
    if (noEnergy) { /* tuile masquée */ } else if (m.energy && per && !dual && !solar) {
      if (showKwh) tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2, 0, c.energy)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.energy);
      // coût de la période (mode € ou les deux) : conso de la période × prix du kWh actuel
      if (showCost && (c.display === "cost" || c.display === "both") && showOpt("show_cost")) tile("mdi:cash", money(this._perKwh * pr), tr(hass, `cost_${per}`), prEnt || c.energy);
    } else if (!c.energy && !m.energy && per && c.power && !dual && !solar) {
      // période calculée depuis la puissance de la prise (pas de compteur kWh) : kWh puis coût (avec price_per_kwh)
      if (showKwh) tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2, 0, c.power)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.power);
      if (showCost && showOpt("show_cost")) tile("mdi:cash", money(this._perKwh * pr), tr(hass, `cost_${per}`), prEnt || c.power);
    } else if (m.energy) {
      const eVal = fmtEnergy(hass, m.energy) ?? "—";
      const yp = m.energy.attributes && m.energy.attributes.last_period;
      // en-tête choisi par l'utilisateur (labels.energy, ou energy_tile_period pour le capteur qu'il fournit) : prioritaire sur « hier »
      const eHdr = c.labels && c.labels.energy ? lb("energy") : !solar && !dual && TILE_PERIODS.includes(c.energy_tile_period) ? tr(hass, `energy_${c.energy_tile_period}`) : null;
      if (eHdr == null && yp !== undefined && yp !== null && !isNaN(parseFloat(yp))) {
        const ydayStr = parseFloat(yp).toFixed(1);
        tile("mdi:history", eVal, `${tr(hass, "yday")} ${ydayStr} kWh`, c.energy);
      } else {
        tile("mdi:lightning-bolt-circle", eVal, eHdr ?? lb(solar ? "today" : dual ? "energy_grid" : "energy"), c.energy);
      }
    }
    if (m.energyS) tile("mdi:solar-power-variant", fmtEnergy(hass, m.energyS) ?? "—", lb("energy_solar"), c.energy_solar);
    if (m.cost && showOpt("show_cost")) {
      // labels.cost (text libre) > cost_tile_period (période du capteur de coût) > « Coût »
      const cHdr = !solar && !(c.labels && c.labels.cost) && TILE_PERIODS.includes(c.cost_tile_period) ? tr(hass, `cost_${c.cost_tile_period}`) : lb(solar ? "savings" : "cost");
      tile(solar ? "mdi:piggy-bank-outline" : "mdi:cash", fmtUnit(hass, m.cost, 2, 2) ?? "—", cHdr, c.cost);
    }
    // durée d'utilisation du jour (écrans, consoles, PC) : capteur usage_time, sinon historique (+ temps écoulé depuis la lecture si toujours allumé)
    if (USAGE_KINDS.includes(kind) && c.show_usage_time !== false) {
      const u = this._use, today = u && this._useDay === new Date().toDateString();
      const min = m.usage != null ? m.usage : today ? u.min + (u.on && active ? (Date.now() - u.at) / 60000 : 0) : null;
      if (min != null) tile("mdi:timer-outline", fmtDuration(min), lb("usage_today"), c.usage_time || c.power || c.entity);
    }
    // compresseur : durée cumulée et pression du réservoir (capteurs facultatifs)
    if (kind === "air_compressor") {
      if (m.runtimeTotal != null) tile("mdi:timer-sand", fmtDuration(m.runtimeTotal), lb("runtime_total"), c.runtime_total);
      const ps = c.pressure ? hass.states[c.pressure] : null;
      if (ps && !BAD.includes(String(ps.state).toLowerCase())) tile("mdi:gauge", fmtUnit(hass, ps, 1), lb("pressure"), c.pressure);
    }
    // dernier cycle (option last_cycle), affiché hors cycle
    const cy = c.last_cycle && !active ? this._cycle : null;
    if (cy) {
      const s0 = new Date(cy.start), s1 = new Date(cy.end), today = new Date().toDateString();
      const ago = Math.round((new Date(today) - new Date(s0.toDateString())) / 86400000);
      let day = "";
      if (ago === 1) day = ` · ${tr(hass, "yesterday")}`;
      else if (ago > 1) { try { day = ` · ${s0.toLocaleDateString(loc(hass), { day: "numeric", month: "short" })}`; } catch (e) { day = ` · ${s0.getDate()}/${s0.getMonth() + 1}`; } }
      tile("mdi:history", `${fmtClock(hass, s0)} → ${fmtClock(hass, s1)}`, `${lb("last_cycle")}${day}`, c.power);
      tile("mdi:timer-outline", fmtDuration((cy.end - cy.start) / 60000), lb("cycle_duration"), c.power);
      if (showKwh) tile("mdi:lightning-bolt", `${fmtNum(hass, cy.kwh, 2, 0, c.energy || c.power)} kWh`, lb("cycle_energy"), c.energy || c.power);
      // prix du kWh : nombre, ou entité (tarif) ; devise de Home Assistant
      if (showCost) tile("mdi:cash", money(cy.kwh * pr), lb("cycle_cost"), prEnt || c.energy || c.power);
    }
    if (solar && m.status !== "night" && m.frac != null && m.pw && !BAD.includes(String(m.pw.state).toLowerCase())) tile("mdi:white-balance-sunny", `${Math.round(m.frac * 100)} %`, lb("of_peak"), c.power);
    $("stats").innerHTML = tiles.join("");
    $("stats").style.display = tiles.length ? "" : "none";
  }
}
