/* ------------------------------------------------------------------ */
/* Base card                                                           */
/* ------------------------------------------------------------------ */
let SEQ = 0;

// energy_period : périodes calendaires, puis glissantes (durée en jours)
const ROLLING = { "24h": 1, "7d": 7, "30d": 30 };
const PERIODS = ["day", "week", "month", ...Object.keys(ROLLING)];

class ApplianceCardBase extends HTMLElement {
  static get kind() { return "washer"; }
  static getConfigForm() { return buildForm(this.kind); }
  static getStubConfig(hass) { return stubFor(this.kind, hass); }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    if (window.applianceSize) window.applianceSize(this, config);
    if (!["entity", "power", "power_solar", "switch", "temperature", "zone_1"].some((f) => config[f])) {
      throw new Error(tr(undefined, "err_need_entity"));
    }
    this._config = { ...config };
    this._kind = this.constructor.kind;
    this._def = DEF[this._kind];
    this._lastKey = null;
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
  disconnectedCallback() { clearInterval(this._tick); clearTimeout(this._cycTimer); this._cycBusy = false; }

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
    return ["entity", "power", "power_solar", "energy_solar", "energy", "cost", "remaining", "progress", "program", "door", "switch",
      "power_level", "pellet_level", "runtime", "speed", "bed_temperature", "humidity", "light", "keg_level", "pouring", "battery_level", "zone2_temperature", "zone_1", "zone_2", "zone_3", "zone_4", "mode", "window", "temperature", "target_temperature", "freezer_temperature", "flex_temperature", "freezer_door", "target_humidity", "tank_full", "fan_speed", "clean_water", "dirty_water"].map((k) => c[k]).filter(Boolean).concat(this._nozzles()).concat(Array.isArray(c.outlets) ? c.outlets.filter((i) => typeof i === "string" && i) : [])
      .concat(Array.isArray(c.images) ? c.images.map((i) => i && typeof i.entity === "string" && i.entity).filter(Boolean) : []);
  }

  // guirlande : une couleur choisie autre que blanc chaud → unicolore ; sinon arc-en-ciel
  _glSingle(m) { return !/^rgb\(255,\s*2[0-9]{2},\s*1[0-9]{2}\)$|^rgb\(255,255,255\)$/.test(String(m.glColor).replace(/ /g, "")); }

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
      const eid = tile ? tile.dataset.entity : (c.entity || c.power || c.switch || c.temperature);
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
    const dflt = c.entity || c.power || c.switch || c.temperature;
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
    const dom = domainOf(sw.id);
    hass.callService(["switch", "input_boolean", "light", "fan", "humidifier"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: sw.id });
  }

  // energy_period : consommation de la période d'après les statistiques de Home Assistant,
  // calendaire (day / week / month, comme le tableau de bord Énergie) ou glissante (24h / 7d / 30d),
  // relue au plus toutes les 5 min ou quand le compteur bouge
  _fetchPeriod() {
    const c = this._config, hass = this._hass, per = c.energy_period;
    if (!PERIODS.includes(per) || !c.energy || !hass || typeof hass.callWS !== "function") return;
    const st = hass.states[c.energy], sig = `${per}|${c.energy}|${st ? st.state : ""}`, now = Date.now();
    if (this._perBusy || (sig === this._perSig && now - (this._perAt || 0) < 300000) || (this._perAt && now - this._perAt < 60000)) return;
    this._perBusy = true; this._perSig = sig; this._perAt = now;
    const win = ROLLING[per] ? { rolling_window: { duration: { days: ROLLING[per] } } } : { calendar: { period: per } };
    hass.callWS({ type: "recorder/statistic_during_period", statistic_id: c.energy, ...win, types: ["change"], units: { energy: "kWh" } })
      .then((r) => { this._perKwh = r && Number.isFinite(r.change) ? r.change : null; })
      .catch(() => { this._perKwh = null; })
      .finally(() => { this._perBusy = false; if (this._hass) this._render(this._compute()); });
  }

  // last_cycle : début, fin, durée, énergie et coût du dernier cycle, lus dans l'historique de Home Assistant (4 derniers jours).
  // Relu au chargement puis 20 s après chaque fin de cycle (le temps que l'enregistreur écrive les derniers points).
  // estimate : même lecture sur 10 jours, relue aussi au chargement en plein cycle, pour la durée de référence
  // (médiane des 7 derniers cycles) et le début du cycle en cours.
  // Chauffe-eau : last_cycle seulement (pas d'estimate), puissance réseau + solaire (power + power_solar), énergie idem.
  _fetchCycle(active) {
    const c = this._config, hass = this._hass, wash = ["washer", "dryer", "dishwasher"].includes(this._kind), wh = this._kind === "water_heater";
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

  _update(force) {
    const hass = this._hass;
    this._fetchPeriod();
    const key = this._ids().map((i) => {
      const s = hass.states[i];
      return s ? `${s.state}|${s.attributes.temperature ?? ""}|${s.attributes.current_temperature ?? ""}|${s.attributes.current_humidity ?? ""}|${s.attributes.humidity ?? ""}|${s.attributes.action ?? ""}|${s.attributes.mode ?? ""}|${s.attributes.percentage ?? ""}` : "x";
    }).join(";") + "|" + lang(hass) + "|" + Math.floor(Date.now() / 30000);
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
      runtime: parseRemaining(S(c.runtime)), speed: S(c.speed), bedTemp: num(S(c.bed_temperature)), humidity: num(S(c.humidity)), mode: S(c.mode), window: S(c.window), light: S(c.light), keg: num(S(c.keg_level)), pouring: S(c.pouring), batt: num(S(c.battery_level)), zone2: num(S(c.zone2_temperature)), zone2Ent: S(c.zone2_temperature),
      tank: S(c.tank_full), fanSpeed: S(c.fan_speed), targetHum: S(c.target_humidity), cleanW: S(c.clean_water), dirtyW: S(c.dirty_water),
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
    m.nozzles = kind === "printer_3d" ? this._nozzles() : [];
    if (m.nozzles.length) {
      const t = m.nozzles.map((i) => num(S(i))).filter((v) => v != null);
      if (t.length) m.tempVal = Math.max(...t);
    }

    const ref = main || sw;
    const mainIds = ["entity", "power", "power_solar", "switch", "temperature", "zone_1", "zone_2", "zone_3", "zone_4"].map((k) => c[k]).filter(Boolean);
    const usable = mainIds.some((i) => hass.states[i] && !BAD.includes(String(hass.states[i].state).toLowerCase()));
    if (!usable) { m.status = "unavailable"; return m; }
    let base = null;
    if (ref) {
      const s = String(ref.state).toLowerCase();
      const dom = domainOf(main ? c.entity : c.switch);
      if (BAD.includes(s)) base = null;
      else if (DONE_STATES.includes(s)) base = "finished";
      else if (OFF_STATES.includes(s)) {
        base = ["standby", "veille"].includes(s) ? "standby"
          : ["idle", "inactive", "inactif", "ready", "stopped", "stop", "pause", "paused"].includes(s) ? "idle"
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
    } else if (kind === "pool_pump") {
      m.status = base === "running" ? "filtering" : base;
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
      if (base === "off" || base === "unavailable") m.status = base;
      else if (isFan && /boost|grande|high|max|rapide|fast|gv/.test(fPre)) m.status = "speed2";
      else if (isFan && /petite|low|eco|lente|slow|min|pv|auto|normal/.test(fPre)) m.status = "speed1";
      else if (isFan && Number.isFinite(fPct) && fPct > 0) m.status = fPct > 60 ? "speed2" : "speed1";
      else if (m.speed && !BAD.includes(sp) && /boost|grande|high|max|rapide|fast|gv/.test(sp)) m.status = "speed2";
      else if (m.speed && !BAD.includes(sp) && /petite|low|eco|lente|slow|min|pv|auto|normal/.test(sp)) m.status = "speed1";
      else if (spn != null && spn > 0) m.status = (String(m.speed.attributes.unit_of_measurement || "") === "%" ? spn > 60 : spn >= 2) ? "speed2" : "speed1";
      else if (spn === 0) m.status = "off";
      else if (watts != null) m.status = watts > hi ? "speed2" : powered ? "speed1" : (base === "standby" ? "standby" : "off");
      else m.status = base === "running" ? "speed1" : base;
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
      if (m.tempVal != null && m.tempVal > (c.freezer_max_temperature ?? c.max_temperature ?? -12)) m.alerts.push("too_warm");
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
        m.lights = isOn(m.light);
        if (m.lights && m.status === "off" && base !== "unavailable") m.status = "lights";
      }
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
    } else if (kind === "kettle" || kind === "toaster") {
      // en marche au-dessus du seuil ; après la coupure : « eau chaude » / « toasts prêts » pendant quelques minutes
      const on = powered || (watts === null && base === "running"), now = Date.now();
      const keep = (kind === "kettle" ? c.hot_minutes ?? 5 : c.ready_minutes ?? 2) * 60000;
      if (on && base !== "unavailable") this._onAt = now;
      if (base === "unavailable") m.status = "unavailable";
      else if (on) m.status = kind === "kettle" ? "boiling" : "toasting";
      else if (kind === "kettle" && m.tempVal != null) m.status = m.tempVal >= (c.hot_temperature ?? 60) ? "hot_water" : "off";
      else m.status = this._onAt && now - this._onAt < keep ? (kind === "kettle" ? "hot_water" : "toast_ready") : "off";
    } else if (kind === "wine_cooler") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered || (watts === null && base === "running") ? "cooling" : "standby";
      if (m.tempVal != null && m.tempVal > (c.max_temperature ?? 18)) m.alerts.push("too_warm");
      // bi-zone : seuil propre à la zone basse (vins blancs), sinon le même
      if (m.zone2 != null && m.zone2 > (c.max_temperature_2 ?? c.max_temperature ?? 18)) m.alerts.push("too_warm");
    } else if (kind === "fridge") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered ? "cooling" : "standby";
      const maxF = c.max_temperature ?? 8, maxZ = c.freezer_max_temperature ?? -12;
      if (m.tempVal != null && m.tempVal > maxF) m.alerts.push("too_warm");
      if (num(m.ftemp) != null && num(m.ftemp) > maxZ) m.alerts.push("too_warm");
      // zone flex (3e compartiment à température réglable) : alerte seulement si un seuil est donné
      m.flexVal = m.flex && ["climate", "water_heater"].includes(domainOf(m.flex.entity_id)) ? num({ state: m.flex.attributes.current_temperature }) : num(m.flex);
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
    if (m.status === "running" && ["washer", "dryer", "dishwasher"].includes(kind)) {
      const txt = `${main ? main.state : ""} ${m.program ? m.program.state : ""}`.toLowerCase();
      if (/rin[cç]|rinse/.test(txt)) m.phase = "rinse";
      else if (/essor|spin|centrif|essorage/.test(txt)) m.phase = "spin";
      else if (/refroid|cool|anti.?froiss|wrinkle/.test(txt)) m.phase = "cool";
      // en début de mot : les clés Home Connect « laundry_care_washer_program_… » contiennent « dry »
      else if (/(^|[^a-zà-ÿ])(s[eé]ch|dry)/.test(txt)) m.phase = "dry";
      else if (/(^|[^a-zà-ÿ])(heat|chauff)/.test(txt)) m.phase = "heat";
      else if (kind === "dryer") {
        m.phase = "dry";
      } else if (watts !== null && ["washer", "dishwasher"].includes(kind)) {
        // Fallback: infer phase from power draw on smart plugs when text entity gives no phase
        const heatThreshold = c.heating_power ?? this._def.heating_power ?? 1000;
        const spinThreshold = c.spin_power ?? this._def.spin_power ?? 200;
        if (heatThreshold > 0 && watts >= heatThreshold) {
          m.phase = "heat";
        } else if (kind === "washer" && spinThreshold > 0 && watts >= spinThreshold) {
          m.phase = "spin";
        } else if (!m.phase) {
          m.phase = "wash";
        }
      } else if (!m.phase) {
        m.phase = "wash";
      }
    }
    // estimate : temps restant et progression d'après la durée habituelle des cycles (médiane), si aucun capteur ne les donne
    if (c.estimate && m.status === "running" && ["washer", "dryer", "dishwasher"].includes(kind) && this._refDur && this._runStart) {
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

  /* ---------------- rendering ---------------- */
  _lcdText(m) {
    const hass = this._hass, kind = this._kind;
    const active = ["running", "heating", "preheating", "cooling", "ignition", "filtering", "printing", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming"].includes(m.status);
    if (m.status === "unavailable") return "- - -";
    if (["fridge", "wine_cooler", "chest_freezer", "drawer_freezer"].includes(kind)) return m.tempVal != null ? `${fmtNum(hass, m.tempVal, 0)}°` : "--°";
    if (kind === "towel_dryer") {
      if (m.status === "off") return "OFF";
      if (m.radMode === "frost") return "H-G";
      const v = m.targetVal ?? m.tempVal;
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
      const v = m.targetVal ?? m.tempVal;
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
      return m.targetVal != null ? `${Math.round(m.targetVal)}°` : m.tempVal != null ? `${Math.round(m.tempVal)}°` : "ON";
    }
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
    const active = ["running", "heating", "preheating", "cooling", "ignition", "filtering", "printing", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming"].includes(m.status);
    this._fetchCycle(active);
    const hideWouldApply = this._applyHide(active, m.alerts.length > 0);
    $("wrap").className = [
      "wrap", c.layout === "split" ? "layout-split" : "", `k-${kind}`, `st-${m.status}`, `accent-${m.accent || this._def.accent}`,
      active ? "active" : "", m.phase ? `ph-${m.phase}` : "",
      m.alerts.length ? "alert" : "", isOn(m.door) ? "door-open" : "", isOn(m.fdoor) ? "fz-open" : "",
      m.alerts.includes("too_warm") ? "warm" : "", m.alerts.includes("humid") ? "humid" : "", c.animations === false ? "no-anim" : c.animations === true ? "force-anim" : "", m.lights ? "lights-on" : "", m.solarHeat ? "solar-heat" : "", hideWouldApply ? "would-hide" : "", m.acMode ? `mode-${m.acMode}` : "", m.osc ? "osc" : "",
    ].filter(Boolean).join(" ");

    // illustration dynamic parts
    if (kind === "av_receiver") $("wrap").style.setProperty("--amp", (m.amp ?? .6).toFixed(2));
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
    if (kind === "server_rack") $("wrap").style.setProperty("--load", (m.load ?? 0.4).toFixed(2));
    if (kind === "solar") $("wrap").style.setProperty("--sun", (m.frac || 0).toFixed(2));
    if (kind === "radiator" || kind === "towel_dryer") {
      $("wrap").style.setProperty("--heat", (m.heat || 0).toFixed(2));
      ["comfort", "eco", "frost"].forEach((k) => $("wrap").classList.toggle(`mode-${k}`, m.radMode === k || (k === "comfort" && !m.radMode && m.status !== "off")));
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
      clip.setAttribute("y", (104 - h).toFixed(2)); clip.setAttribute("height", h.toFixed(2));
      wrap.style.setProperty("--fil", c.filament_color || "#ff8a1f");
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
    }

    // name + status
    const name = c.name || tr(hass, kind === "monitor" && mnCount(c) > 1 ? "monitors" : kind === "desktop_pc" && pcStyle(c) === "tower" ? "pc_tower" : kind);
    let statusTxt = m.phase ? tr(hass, `ph_${m.phase}`) : tr(hass, m.status);
    if (kind === "monitor" && m.status === "screen_on") statusTxt = tr(hass, mnCount(c) > 1 ? "monitors_on" : "monitor_on");
    if (m.main && ["sensor", "input_select", "select"].includes(domainOf(c.entity)) &&
        active && !["fridge", "water_heater", "printer_3d", "pool_pump", "wet_vacuum"].includes(kind)) {
      const raw = String(m.main.state).toLowerCase();
      if (![...OFF_STATES, ...DONE_STATES, "on", "running", "run"].includes(raw)) statusTxt = stateText(hass, m.main);
    }
    if ((kind === "radiator" || kind === "towel_dryer") && m.radMode && m.radMode !== "off" && m.status !== "off" && m.status !== "unavailable") statusTxt += ` · ${tr(hass, m.radMode)}`;
    if ((kind === "fan" || kind === "ceiling_fan") && m.pct != null && /^fan_/.test(m.status)) statusTxt += ` · ${Math.round(m.pct)} %`;
    if (kind === "av_receiver" && m.vol != null && ["playing", "paused"].includes(m.status)) statusTxt += ` · Vol ${Math.round(m.vol * 100)} %`;
    if (kind === "av_receiver" && m.source && ["playing", "paused", "muted"].includes(m.status)) statusTxt += ` · ${m.source}`;
    if (kind === "tv" && m.status === "screen_on" && m.main && domainOf(c.entity) === "media_player") {
      const a = m.main.attributes || {}, what = a.app_name || a.media_title || a.source;
      if (what) statusTxt += ` · ${what}`;
    }
    if (kind === "ps5" && m.game) statusTxt += ` · ${m.game}`;
    if (m.solarHeat && active) statusTxt += ` · ${tr(hass, "solar_surplus")}`;
    const prog = m.program && active && !BAD.includes(String(m.program.state).toLowerCase()) ? stateText(hass, m.program) : "";
    let sub = "";
    if (active && m.remaining != null && m.remaining > 0) {
      sub = `${tr(hass, m.estimated ? "ends_at_est" : "ends_at")} ${fmtClock(hass, new Date(Date.now() + m.remaining * 60000))}`;
    } else if (active && m.soon) sub = tr(hass, "almost_done");
    const alertTxt = m.alerts.map((a) => tr(hass, a)).join(" · ");
    let frPill = "";
    if (kind === "fridge" && m.tempVal != null) {
      let tCol = "color: #4caf50; border-color: rgba(76, 175, 80, 0.45); background: rgba(76, 175, 80, 0.15); box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);";
      if (m.tempVal >= 10) {
        tCol = "color: #ff5252; border-color: rgba(244, 67, 54, 0.5); background: rgba(244, 67, 54, 0.18); box-shadow: 0 0 8px rgba(244, 67, 54, 0.3);";
      } else if (m.tempVal >= 8) {
        tCol = "color: #ff9800; border-color: rgba(255, 152, 0, 0.5); background: rgba(255, 152, 0, 0.18); box-shadow: 0 0 8px rgba(255, 152, 0, 0.25);";
      } else if (m.tempVal >= 6) {
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
        ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}`;
    } else {
      $("info").innerHTML = `
        <div class="name">${esc(name)}</div>
        <div class="status"><span class="dot"></span><span>${esc(statusTxt)}${prog && prog !== statusTxt ? ` · ${esc(prog)}` : ""}</span>${frPill}</div>
        ${alertTxt ? `<div class="alert-line"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(alertTxt)}</div>` : ""}
        ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}`;
    }

    const swId = c.switch || (kind === "dehumidifier" && domainOf(c.entity) === "humidifier" ? c.entity : null)
      || (kind === "garland" && domainOf(c.entity) === "light" ? c.entity : null);
    this._sw = null;
    if (swId) {
      const on = isOn(hass.states[swId]);
      // safety: cutting a washer/dryer/dishwasher mid-cycle needs a second click
      const freezer = ["chest_freezer", "drawer_freezer"].includes(kind);
      // PC fixe / baie serveur : couper la prise d'une machine allumée ou en veille = arrêt brutal
      const computer = ["desktop_pc", "server_rack"].includes(kind) && ["screen_on", "online", "standby"].includes(m.status);
      // PS5 : couper la prise allumée ou en mode repos (téléchargements, mises à jour) peut abîmer les données
      const console_ = kind === "ps5" && ["screen_on", "ps_gaming", "ps_rest"].includes(m.status);
      const guarded = c.confirm_off !== false && on && (freezer || computer || console_ || ((active || ["extinguishing", "paused"].includes(m.status)) && ["washer", "dryer", "dishwasher", "pellet_stove", "printer_3d"].includes(kind)));
      this._sw = { id: swId, guarded };
      const arming = guarded && this._confirmUntil && Date.now() < this._confirmUntil;
      const label = arming ? tr(hass, computer ? "confirm_off_pc" : console_ ? "confirm_off_console" : "confirm_off") : tr(hass, "toggle");
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

    // boutons de mode (confort / éco / hors-gel / arrêt)
    const modesEl = $("modes");
    const mEnt = c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
    if ((kind === "radiator" || kind === "towel_dryer") && mEnt && c.show_modes !== false && hass.states[mEnt]) {
      const opts = modeOptions(hass.states[mEnt]);
      const cur = m.radMode ?? (m.status !== "off" ? "comfort" : "off");
      modesEl.innerHTML = MODE_ORDER.filter((k) => pickMode(opts, k)).map((k) =>
        `<button class="mode-btn ${cur === k ? "on" : ""}" data-mode="${k}" aria-pressed="${cur === k}"><ha-icon icon="${MODE_ICON[k]}"></ha-icon>${esc(tr(hass, k === "off" ? "mode_off" : k))}</button>`).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._setMode(b.dataset.mode); }; });
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
      if (m.tempVal != null) tile("mdi:snowflake-thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity,
        m.alerts.includes("too_warm") ? "warn" : "");
    } else if (kind === "beer_tap") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.keg != null) tile("mdi:keg", `${fmtNum(hass, m.keg, 0)} %`, lb("keg"), c.keg_level, m.alerts.includes("keg_low") ? "warn" : "");
    } else if (kind === "power_strip") {
      // prises commandées : boutons dans la rangée .modes (plus de tuile « 1 / 3 »)
    } else if (kind === "phone_charger") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0)} %`, lb("battery"), c.battery_level);
    } else if (kind === "garland") {
      if (m.glEffect && m.status === "lit") tile("mdi:auto-fix", m.glEffect, lb("effect"), c.entity);
    } else if (kind === "kettle") {
      if (m.tempVal != null) tile("mdi:thermometer-water", `${fmtNum(hass, m.tempVal, 0)} ${m.tempUnit}`, lb("water"), tEntity);
    } else if (kind === "tool_charger") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0)} %`, lb("battery"), c.battery_level);
    } else if (kind === "wine_cooler") {
      const dual = !!c.zone2_temperature, max1 = c.max_temperature ?? 18, max2 = c.max_temperature_2 ?? max1;
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb(dual ? "zone_top" : "temperature"), tEntity, m.tempVal > max1 ? "warn" : "");
      if (dual && m.zone2 != null) tile("mdi:thermometer-low", `${fmtNum(hass, m.zone2, 1)} ${m.zone2Ent?.attributes.unit_of_measurement || m.tempUnit}`, lb("zone_bottom"), c.zone2_temperature, m.zone2 > max2 ? "warn" : "");
    } else if (kind === "fridge") {
      if ((!c.energy || c.layout !== "split") && m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("fridge_temp"), tEntity,
        m.tempVal > (c.max_temperature ?? 8) ? "warn" : "");
      if (m.ftemp) tile("mdi:snowflake", fmtUnit(hass, m.ftemp, 1), lb("freezer_temp"), c.freezer_temperature,
        num(m.ftemp) > (c.freezer_max_temperature ?? -12) ? "warn" : "");
      if (m.flexVal != null) tile("mdi:thermometer-lines", `${fmtNum(hass, m.flexVal, 1)} ${m.flex.attributes.unit_of_measurement || m.tempUnit}`, lb("flex_temp"), c.flex_temperature,
        c.flex_max_temperature != null && m.flexVal > c.flex_max_temperature ? "warn" : "");
    } else if (kind === "radiator") {
      const te = c.temperature || (domainOf(c.entity) === "climate" ? c.entity : null);
      if (m.tempVal != null) tile("mdi:home-thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), te);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1)} ${m.tempUnit}`, lb("target"), c.target_temperature || te);
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0)} %`, lb("humidity"), c.humidity || c.entity);
    } else if (kind === "dehumidifier") {
      const hEnt = c.humidity || (domainOf(c.entity) === "humidifier" ? c.entity : null);
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0)} %`, lb("humidity"), hEnt, m.alerts.includes("humid") ? "warn" : "");
      if (m.targetHumVal != null) tile("mdi:target", `${fmtNum(hass, m.targetHumVal, 0)} %`, lb("target"), c.target_humidity || hEnt);
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.tank) tile(m.tankFull ? "mdi:cup-water" : "mdi:cup-outline", tr(hass, m.tankFull ? "tank_full_short" : "tank_ok"), lb("tank"), c.tank_full, m.tankFull ? "warn" : "");
      if (m.fanSpeed && !BAD.includes(String(m.fanSpeed.state).toLowerCase())) tile("mdi:fan", domainOf(c.fan_speed) === "fan" ? `${fmtNum(hass, Number(m.fanSpeed.attributes.percentage) || 0, 0)} %` : stateText(hass, m.fanSpeed), lb("fan_speed"), c.fan_speed);
      if (m.dhMode) tile("mdi:tune-variant", m.dhMode, lb("mode"), c.mode || c.entity);
    } else if (kind === "wet_vacuum") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0)} %`, lb("battery"), c.battery_level, m.battLow ? "warn" : "");
      const tank = (pct, alert, okKey, badKey) => (pct != null ? `${fmtNum(hass, pct, 0)} %` : tr(hass, alert ? badKey : okKey));
      if (m.cleanW) tile("mdi:water", tank(m.cleanPct, m.cleanEmpty, "tank_ok", "tank_empty_short"), lb("clean_water"), c.clean_water, m.cleanEmpty ? "warn" : "");
      if (m.dirtyW) tile("mdi:water-opacity", tank(m.dirtyPct, m.dirtyFull, "tank_ok", "tank_full_short"), lb("dirty_water"), c.dirty_water, m.dirtyFull ? "warn" : "");
      if (m.mode && !BAD.includes(String(m.mode.state).toLowerCase())) tile("mdi:tune-variant", stateText(hass, m.mode), lb("mode"), c.mode);
    } else if (kind === "hob") {
      /* no extra tile */
    } else if (kind === "vmc") {
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0)} %`, lb("humidity"), c.humidity, m.alerts.includes("humid") ? "warn" : "");
    } else if (kind === "printer_3d") {
      if (m.progress != null) tile("mdi:progress-check", `${fmtNum(hass, m.progress, 0)} %`, lb("progress"), c.progress);
      if (m.nozzles && m.nozzles.length) {
        // une puce par buse : T0, T1, T2…
        m.nozzles.forEach((id, i) => {
          const v = num(hass.states[id]);
          tile("mdi:printer-3d-nozzle-heat", v != null ? `${fmtNum(hass, v, 0)} ${m.tempUnit}` : "—", `T${i}`, id);
        });
      } else if (m.tempVal != null) tile("mdi:printer-3d-nozzle-heat", `${fmtNum(hass, m.tempVal, 0)} ${m.tempUnit}`, lb("nozzle"), tEntity);
      if (m.bedTemp != null) tile("mdi:heat-wave", `${fmtNum(hass, m.bedTemp, 0)} ${m.tempUnit}`, lb("bed"), c.bed_temperature);
    } else if (kind === "pool_pump") {
      if (m.tempVal != null) tile("mdi:thermometer-water", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("water"), tEntity);
      if (m.runtime != null) tile("mdi:timer-outline", fmtDuration(m.runtime), lb("today"), c.runtime);
      if (num(m.speed) != null) tile("mdi:speedometer", fmtUnit(hass, m.speed, 0), lb("speed"), c.speed);
    } else if (kind === "pellet_stove") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
      if (m.level != null) tile("mdi:fire", `P${fmtNum(hass, m.level, 0)}`, lb("level"), c.power_level);
      if (m.pellets != null) tile("mdi:grain", `${fmtNum(hass, m.pellets, 0)} %`, lb("pellets"), c.pellet_level, m.alerts.includes("pellets_low") ? "warn" : "");
    } else if (["water_heater", "oven", "air_fryer", "ac_split", "heat_pump", "towel_dryer", "server_rack"].includes(kind)) {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 0)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 0)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
      if (kind === "towel_dryer" && m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0)} %`, lb("humidity"), c.humidity || c.entity);
    }
    if (m.remaining != null && m.remaining > 0 && active && kind !== "water_heater") tile("mdi:timer-sand", `${m.estimated ? "≈ " : ""}${fmtDuration(m.remaining)}`, lb("remaining"), c.remaining);
    else if (m.soon && active) tile("mdi:timer-sand-complete", tr(hass, "almost_done"), lb("remaining"), c.power);
    const solar = kind === "solar";
    const dual = kind === "water_heater" && (m.pwS || m.energyS);
    if (m.pw && c.show_power !== false) tile(solar ? "mdi:solar-power" : "mdi:flash", fmtPower(hass, m.pw) ?? "—", lb(solar ? "production" : dual ? "grid" : "power"), c.power);
    if (m.pwS) tile("mdi:solar-power", fmtPower(hass, m.pwS) ?? "—", lb("solar_surplus"), c.power_solar);
    // display : "energy" (kWh seuls), "cost" (€ seuls, si price_per_kwh est valide), sinon les deux
    const pr = typeof c.price_per_kwh === "string" ? num(hass.states[c.price_per_kwh]) : Number(c.price_per_kwh);
    const hasPr = c.price_per_kwh != null && c.price_per_kwh !== "" && Number.isFinite(pr);
    const prEnt = typeof c.price_per_kwh === "string" ? c.price_per_kwh : null;
    const showKwh = !(c.display === "cost" && hasPr), showCost = hasPr && c.display !== "energy";
    const money = (x) => {
      const cur = (hass.config && hass.config.currency) || "EUR";
      try { return new Intl.NumberFormat(loc(hass), { style: "currency", currency: cur, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x); }
      catch (e) { return `${fmtNum(hass, x, 2, 2)} ${cur}`; }
    };
    const per = PERIODS.includes(c.energy_period) && this._perKwh != null ? c.energy_period : null;
    if (m.energy && per && !dual && !solar) {
      if (showKwh) tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.energy);
      // coût de la période (mode € ou les deux) : conso de la période × prix du kWh actuel
      if (showCost && c.display === "cost") tile("mdi:cash", money(this._perKwh * pr), tr(hass, `cost_${per}`), prEnt || c.energy);
    } else if (m.energy) {
      const eVal = fmtEnergy(hass, m.energy) ?? "—";
      const yp = m.energy.attributes && m.energy.attributes.last_period;
      if (yp !== undefined && yp !== null && !isNaN(parseFloat(yp))) {
        const ydayStr = parseFloat(yp).toFixed(1);
        tile("mdi:history", eVal, `Yday ${ydayStr} kWh`, c.energy);
      } else {
        tile("mdi:lightning-bolt-circle", eVal, lb(solar ? "today" : dual ? "energy_grid" : "energy"), c.energy);
      }
    }
    if (m.energyS) tile("mdi:solar-power-variant", fmtEnergy(hass, m.energyS) ?? "—", lb("energy_solar"), c.energy_solar);
    if (m.cost) tile(solar ? "mdi:piggy-bank-outline" : "mdi:cash", fmtUnit(hass, m.cost, 2, 2) ?? "—", lb(solar ? "savings" : "cost"), c.cost);
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
      if (showKwh) tile("mdi:lightning-bolt", `${fmtNum(hass, cy.kwh, 2)} kWh`, lb("cycle_energy"), c.energy || c.power);
      // prix du kWh : nombre, ou entité (tarif) ; devise de Home Assistant
      if (showCost) tile("mdi:cash", money(cy.kwh * pr), lb("cycle_cost"), prEnt || c.energy || c.power);
    }
    if (solar && m.status !== "night" && m.frac != null && m.pw && !BAD.includes(String(m.pw.state).toLowerCase())) tile("mdi:white-balance-sunny", `${Math.round(m.frac * 100)} %`, lb("of_peak"), c.power);
    $("stats").innerHTML = tiles.join("");
    $("stats").style.display = tiles.length ? "" : "none";
  }
}
