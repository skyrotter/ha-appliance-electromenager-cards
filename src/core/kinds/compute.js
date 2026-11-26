/* State model per appliance kind (split out of base.js). */
ApplianceCardBase.prototype._compute = function () {
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
    fit: FIT_KINDS.includes(kind) ? { incline: S(c.incline), cadence: S(c.cadence), distance: S(c.distance), hr: S(c.heart_rate), kcal: S(c.calories) } : null,
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
    const t2u = S(c.temperature_2)?.attributes?.unit_of_measurement || m.tempUnit; // seuil de 50 °C : capteur en °F converti
    m.active2 = m.st2 ? /running|cooking|heating|preheat|en cours|chauff|cuisson|^on$|^true$/.test(raw2) : m.temp2 != null && toDegC(m.temp2, t2u) >= 50;
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
  const refBase = base; // état lu dans l'entité, avant toute déduction par la puissance
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
  } else if (kind === "projector_screen") {
    // écran de projection (cover : position 0-100 %, 100 = déroulé ; switch / input_boolean : on = déroulé) : ouvert / fermé / en mouvement
    // invert_position : écran piloté par un module de volet roulant (100 % = écran entièrement enroulé, 0 % = déployé) : tout est inversé
    const inv = c.invert_position === true, sv = main ? String(main.state).toLowerCase() : "", cp = main && main.attributes ? Number(main.attributes.current_position) : NaN;
    m.scrPos = Number.isFinite(cp) ? Math.max(0, Math.min(1, inv ? 1 - cp / 100 : cp / 100)) : /^(open|opening|on)$/.test(sv) !== inv ? 1 : 0;
    m.scrHasPos = Number.isFinite(cp);
    const sOpen = inv ? "screen_closed" : "screen_open", sClosed = inv ? "screen_open" : "screen_closed";
    m.status = !main || sv === "unavailable" ? "unavailable" : sv === "opening" ? (inv ? "screen_closing" : "screen_opening") : sv === "closing" ? (inv ? "screen_opening" : "screen_closing") : /^(open|on)$/.test(sv) ? sOpen : sClosed;
  } else if (kind === "infrared_panel") {
    m.status = base === "running" ? "heating" : base;
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
  } else if (kind === "ps5" || kind === "switch2") {
    // PlayStation 5 : la prise fait foi (éteinte / mode repos / allumée / en jeu au-dessus de gaming_threshold) ;
    // le media_player PlayStation Network donne « en jeu » et le titre du jeu, et sert seul s'il n'y a pas de prise
    // Nintendo Switch 2 : pas d'intégration, la prise seule suffit (veille 0,5 W, allumée 6 W, en jeu 18 W par défaut) ; « sw_sleep » = mode veille
    const sw2 = kind === "switch2", restSt = sw2 ? "sw_sleep" : "ps_rest";
    const isMp = main && domainOf(c.entity) === "media_player", ms = isMp ? String(main.state).toLowerCase() : "";
    const mpOk = isMp && !BAD.includes(ms), playing = mpOk && ms === "playing";
    if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
    else if (watts !== null) m.status = watts > threshold ? (playing || watts > (c.gaming_threshold ?? (sw2 ? 18 : 100)) ? "ps_gaming" : "screen_on") : watts >= (c.standby_threshold ?? (sw2 ? 0.5 : 0.8)) ? restSt : "off";
    else if (mpOk) m.status = playing ? "ps_gaming" : ["on", "idle", "paused", "buffering"].includes(ms) ? "screen_on" : "off";
    else m.status = base === "unavailable" ? "unavailable" : base === "running" ? "screen_on" : base === "standby" ? restSt : "off";
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
    // capteur « en charge » explicite (binary_sensor / input_boolean) sur off : l'appareil n'est pas en charge, même batterie pleine
    if (kind === "phone_charger" && main && ["binary_sensor", "input_boolean"].includes(domainOf(c.entity)) && String(main.state).toLowerCase() === "off" && watts === null) m.status = "standby";
    if (kind === "phone_charger" && main && ["sensor", "input_select", "select"].includes(domainOf(c.entity))) {
      // capteur texte d'état de la batterie (application Companion : battery_state / watch_battery_state) : Charging / Not Charging / Full / Unplugged
      const bs = String(main.state).toLowerCase().replace(/[_-]+/g, " ").trim();
      if (/^(not charging|unplugged|discharging|d[ée]branch|pas en charge|non en charge|entl[äa]dt)/.test(bs)) m.status = full ? "charged" : "standby";
      else if (/^(full|charged|plein|charg[ée]e?|voll)/.test(bs)) m.status = "charged";
      else if (/^(charging|en charge|l[äa]dt)/.test(bs)) m.status = full ? "charged" : "charging";
    }
    if (kind === "phone_charger") {
      // mode Concentration (binary_sensor on / capteur texte avec le nom du mode), activité (Stationary, Walking…), présence (person / device_tracker)
      const OFFW = /^(off|none|unknown|unavailable|no focus|aucun|ninguno|keine|nessuno|geen|false|0|)$/i;
      const fo = S(c.entity_focus), ac = S(c.entity_activity), pe = S(c.entity_presence);
      const fs = fo ? String(fo.state).trim() : "";
      m.focusOn = !!fo && !OFFW.test(fs);
      m.focusName = m.focusOn ? (/^on$/i.test(fs) ? (fo.attributes && (fo.attributes.focus_name || fo.attributes.mode || fo.attributes.name)) || "" : fs) : "";
      const as = ac ? String(ac.state).toLowerCase().trim() : "";
      m.activity = !ac || BAD.includes(as) ? "" : /^(stationary|immobile|still|parked|statique|idle|ruhig)/.test(as) ? "stationary" : /walk|marche|gehen|a pie|camina|wandel/.test(as) ? "walking" : /run|course|cour|lauf|corr/.test(as) ? "running" : /autom|vehicle|driv|voiture|conduite|auto|car/.test(as) ? "automotive" : /cycl|bike|v[ée]lo|rad|bici/.test(as) ? "cycling" : as;
      const ps = pe ? String(pe.state).toLowerCase() : "";
      m.presenceKnown = !!pe && !BAD.includes(ps);
      m.atHome = ps === "home" || ps === "on" || ps === "présent" || ps === "present";
    }
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
    // hot_temperature est dans l'unité du capteur ; le seuil par défaut (60 °C) est comparé à la température ramenée en °C
    else if (kind === "kettle" && m.tempVal != null) m.status = (c.hot_temperature != null ? m.tempVal >= c.hot_temperature : toDegC(m.tempVal, m.tempUnit) >= 60) ? "hot_water" : "off";
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
    // 2e cas, séchage déduit d'une activité récente : sauf si l'entité dit explicitement terminé / arrêt / repos ou si la prise est coupée
    if (base === "running" && watts !== null && watts <= threshold) {
      m.status = "running";
      m.phase = "dry";
    } else if (base !== "running" && !explicitState && recentlyActive && (watts === null || watts <= threshold)
      && !["finished", "off", "idle", "standby", "unavailable"].includes(refBase) && base !== "unavailable" && (!sw || isOn(sw))) {
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
};
