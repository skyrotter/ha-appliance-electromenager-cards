/* DOM, illustration and telemetry tile rendering per appliance kind (split out of base.js). */
ApplianceCardBase.prototype._render = function (m) {
  const hass = this._hass, c = this._config, kind = this._kind;
  const $ = (i) => this.shadowRoot.getElementById(i);
  const active = ["screen_open", "screen_opening", "screen_closing", "iron_heating", "iron_ready", "steaming", "grilling", "grill_ready", "fryer_heating", "fryer_ready", "running", "heating", "preheating", "cooling", "ignition", "filtering", "dosing", "in_use", "printing", "scanning", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming", "mixing", "turbo"].includes(m.status);
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
  if (kind === "projector_screen") $("wrap").style.setProperty("--sp", (m.scrPos ?? 0).toFixed(3));
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
    const clock = fmtClock(hass, new Date());
    this.shadowRoot.querySelector(".phn-time").textContent = clock;
    this.shadowRoot.querySelector(".phn-pct").textContent = lv != null ? `${Math.round(lv)} %` : "";
    // hors charge : écran « toujours allumé » avec le mode Concentration, sinon l'activité (icône + libellé), à luminosité réduite
    const PHN_ICON = {
      moon: "M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z", work: "M14,6H10V4H14M20,6H16V4A2,2 0 0,0 14,2H10A2,2 0 0,0 8,4V6H4A2,2 0 0,0 2,8V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V8A2,2 0 0,0 20,6Z",
      dnd: "M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M7,13H17V11H7", home: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
      walking: "M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z",
      running: "M13.49,5.48C14.59,5.48 15.49,4.58 15.49,3.48C15.49,2.38 14.59,1.48 13.49,1.48C12.39,1.48 11.49,2.38 11.49,3.48C11.49,4.58 12.39,5.48 13.49,5.48M9.89,19.38L10.89,15.08L12.99,17.08V23.08H14.99V15.58L12.89,13.58L13.49,10.58C14.69,11.98 16.69,12.98 18.99,12.98V10.98C17.09,10.98 15.49,9.98 14.69,8.58L13.69,6.98C13.29,6.38 12.69,5.98 11.99,5.98C11.69,5.98 11.49,6.08 11.19,6.08L5.99,8.28V12.98H7.99V9.58L9.79,8.78L8.19,16.98L3.29,15.98L2.89,17.98L9.89,19.38Z",
      automotive: "M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z",
      cycling: "M5,20.5A3.5,3.5 0 0,1 1.5,17A3.5,3.5 0 0,1 5,13.5A3.5,3.5 0 0,1 8.5,17A3.5,3.5 0 0,1 5,20.5M5,12A5,5 0 0,0 0,17A5,5 0 0,0 5,22A5,5 0 0,0 10,17A5,5 0 0,0 5,12M14.8,10H19V8.2H15.8L13.86,4.93C13.57,4.43 13,4.1 12.4,4.1C11.93,4.1 11.5,4.29 11.2,4.6L7.5,8.29C7.19,8.6 7,9 7,9.5C7,10.13 7.33,10.66 7.85,10.97L11.2,13V18H13V11.5L10.75,9.85L13.07,7.5M19,20.5A3.5,3.5 0 0,1 15.5,17A3.5,3.5 0 0,1 19,13.5A3.5,3.5 0 0,1 22.5,17A3.5,3.5 0 0,1 19,20.5M19,12A5,5 0 0,0 14,17A5,5 0 0,0 19,22A5,5 0 0,0 24,17A5,5 0 0,0 19,12M16,4.8C17,4.8 17.8,4 17.8,3C17.8,2 17,1.2 16,1.2C15,1.2 14.2,2 14.2,3C14.2,4 15,4.8 16,4.8Z",
      stationary: "M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M10.5,7H13.5A2,2 0 0,1 15.5,9V14.5H14V22H10V14.5H8.5V9A2,2 0 0,1 10.5,7Z" };
    const fn = String(m.focusName || "").toLowerCase(); // absent quand l'appareil est indisponible (_compute s'arrête avant)
    const fIcon = /sleep|sommeil|dormir|schlaf|sue[ñn]o|slaap|sonno|dormi|noc|søvn|søvn|alvás/.test(fn) ? "moon" : /work|travail|arbeit|trabajo|lavoro|werk|trabalho|praca/.test(fn) ? "work" : /personal|perso|home|maison|zuhause|casa|thuis/.test(fn) ? "home" : /driv|conduite|fahren|conducci|guida|rijden/.test(fn) ? "automotive" : /fitness|sport|workout/.test(fn) ? "running" : "dnd";
    let aIcon = "", aLab = "";
    if (m.status !== "charging" && m.status !== "charged") {
      if (m.focusOn) { aIcon = PHN_ICON[fIcon]; aLab = m.focusName || tr(hass, "focus_on"); }
      else if (m.activity) { aIcon = PHN_ICON[m.activity] || PHN_ICON.stationary; aLab = tr(hass, `act_${m.activity}`) === `act_${m.activity}` ? m.activity : tr(hass, `act_${m.activity}`); }
      else if (m.presenceKnown) { aIcon = m.atHome ? PHN_ICON.home : PHN_ICON.stationary; aLab = tr(hass, m.atHome ? "pres_home" : "pres_away"); }
    }
    const sr = this.shadowRoot;
    $("wrap").classList.toggle("aod", !!aIcon && c.always_on_screen !== false);
    sr.querySelector(".phn-aico").setAttribute("d", aIcon);
    sr.querySelector(".phn-alab").textContent = aLab;
    sr.querySelector(".phn-atime").textContent = clock;
    sr.querySelector(".phn-apct").textContent = lv != null ? `${Math.round(lv)} %` : "";
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
  if (kind === "generic" && c.ring_light) {
    // anneau / halo de la couleur et de la luminosité réelles d'une lumière (ex. passerelle Xiaomi) : rgb_color, sinon hs_color, sinon blanc chaud
    const ls = hass.states[c.ring_light], gs = sr.querySelectorAll(".gn-ringg");
    if (gs.length) {
      const a = (ls && ls.attributes) || {}, on = !!ls && String(ls.state).toLowerCase() === "on";
      let rgb = Array.isArray(a.rgb_color) ? a.rgb_color : null;
      if (!rgb && Array.isArray(a.hs_color)) {
        const [h, sa] = a.hs_color, l = 0.5 - sa / 200, f = (n) => { const k = (n + h / 30) % 12, q = (sa / 100) * Math.min(l, 1 - l); return Math.round(255 * (l - q * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
        rgb = [f(0), f(8), f(4)];
      }
      if (!rgb) rgb = [255, 226, 176];
      const bri = Number.isFinite(Number(a.brightness)) ? Math.max(0.15, Math.min(1, Number(a.brightness) / 255)) : 1;
      gs.forEach((g) => { g.style.setProperty("--rc", `rgb(${rgb.join(",")})`); g.style.setProperty("--rb", on ? bri.toFixed(3) : "0"); });
    }
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
    const cad = num(m.fit.cadence), rower = kind === "rowing_machine", belt = kind === "treadmill";
    let per;
    // tapis : la bande défile à la vitesse du capteur speed (km/h), sinon selon la puissance ; l'inclinaison (%) relève le plateau
    const spd = belt ? num(m.speed) : null;
    if (belt && spd != null && spd > 0) per = 9 / spd;
    else if (!belt && cad != null && cad > 0) per = 60 / cad;
    else {
      const f = m.watts != null ? Math.max(0, Math.min(1, m.watts / (c.max_power || 250))) : 0.4;
      per = rower ? 3.4 - 1.6 * f : 2.2 - 1.5 * f;
    }
    $("wrap").style.setProperty("--fp", `${Math.max(0.35, Math.min(4, per)).toFixed(2)}s`);
    if (belt) {
      const inc = num(m.fit.incline);
      $("wrap").style.setProperty("--inc", (inc != null ? Math.max(0, Math.min(15, Math.atan(inc / 100) * 180 / Math.PI)) : 0).toFixed(1));
    }
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
    const ang = t == null ? -135 : -135 + Math.max(0, Math.min(1, (toDegC(t, m.tempUnit) - 10) / 70)) * 270; // cadran de 10 à 80 °C
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
    frPill = `<span class="fr-pill" style="${tCol}"><ha-icon icon="mdi:thermometer" style="color: inherit;"></ha-icon>${fmtNum(hass, m.tempVal, 1)} ${esc(m.tempUnit)}</span>`;
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
    const console_ = (kind === "ps5" || kind === "switch2") && ["screen_on", "ps_gaming", "ps_rest", "sw_sleep"].includes(m.status);
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
  } else $("actions").replaceChildren();

  // progress bar
  let pct = null;
  if (active && m.progress != null) pct = m.progress;
  else if (["tool_charger", "phone_charger", "wet_vacuum"].includes(kind) && m.status === "charging" && m.batt != null) pct = m.batt;
  else if (kind === "kettle" && m.status === "boiling" && m.tempVal != null) pct = ((toDegC(m.tempVal, m.tempUnit) - 15) / 85) * 100; // de 15 à 100 °C
  else if ((kind === "oven" && m.status === "preheating") || (kind === "water_heater" && m.status !== "off")) {
    if (m.tempVal != null && m.targetVal) {
      // départ à 10 / 20 °C : température et consigne ramenées en °C (capteur en °F)
      const floor = kind === "water_heater" ? 10 : 20;
      pct = ((toDegC(m.tempVal, m.tempUnit) - floor) / (toDegC(m.targetVal, m.tempUnit) - floor)) * 100;
    }
  }
  if (pct != null && Number.isFinite(pct)) {
    pct = Math.max(0, Math.min(100, pct));
    if (c.progress_reverse) pct = 100 - pct; // compte à rebours : la barre part pleine et se vide (vide à 100 %)
    $("bar").style.display = "";
    $("barfill").style.width = `${pct}%`;
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
  } else if (kind === "projector_screen" && m.main && c.show_buttons !== false) {
    // boutons ouvrir (dérouler) / stop / fermer (enrouler) : services cover, ou allumer / éteindre pour un switch
    const cov = domainOf(c.entity) === "cover";
    const bt = [["open", "mdi:arrow-down", "btn_open", true], ["stop", "mdi:stop", "btn_stop", cov], ["close", "mdi:arrow-up", "btn_close", true]].filter((b) => b[3]);
    modesEl.innerHTML = bt.map(([k, ic, lab]) => `<button class="mode-btn" data-act="${k}"><ha-icon icon="${ic}"></ha-icon>${esc(tr(hass, lab))}</button>`).join("");
    modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => {
      ev.stopPropagation();
      const k = b.dataset.act, dom = domainOf(c.entity);
      const up = (k === "open") !== (c.invert_position === true); // « dérouler » = ouvrir le cover, sauf position inversée (module de volet roulant)
      if (dom === "cover") hass.callService("cover", k === "stop" ? "stop_cover" : up ? "open_cover" : "close_cover", { entity_id: c.entity });
      else hass.callService(["switch", "input_boolean"].includes(dom) ? dom : "homeassistant", up ? "turn_on" : "turn_off", { entity_id: c.entity });
    }; });
  } else modesEl.replaceChildren();

  // stats
  const tiles = [];
  let lastKey = null;
  // libellé perso (option labels) sinon traduction
  const lb = (k) => { lastKey = k; return c.labels && c.labels[k] != null && c.labels[k] !== "" ? String(c.labels[k]) : tr(hass, k); };
  const ICON_ALIAS = { fridge_temp: "temperature", water: "temperature", production: "power", grid: "power", energy_grid: "energy", today: "energy", savings: "cost" };
  const resolveIcon = (k, def) => {
    if (!c.icons || typeof c.icons !== "object") return def;
    const raw = (k && c.icons[k]) || (k && ICON_ALIAS[k] && c.icons[ICON_ALIAS[k]]);
    return typeof raw === "string" && /^[\w-]+:[\w-]+$/.test(raw.trim()) ? raw.trim() : def;
  };
  const tile = (icon, value, label, entity, cls = "", key = null) => {
    const k = key || lastKey; lastKey = null;
    if (value == null) return;
    const ic = resolveIcon(k, icon);
    const spk = entity && c.show_sparklines === true ? this._sparkSvg(entity, /\bwarn\b/.test(cls)) : "";
    tiles.push(`<div class="tile ${cls}" ${entity ? `data-entity="${esc(entity)}"` : ""}>
      <span class="val">${esc(value)}</span><span class="lbl"><ha-icon icon="${esc(ic)}"></ha-icon>${esc(label)}</span>${spk}</div>`);
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
    if (m.focusOn) tile("mdi:moon-waning-crescent", m.focusName || tr(hass, "focus_on"), lb("focus"), c.entity_focus);
    if (m.activity) tile("mdi:run", tr(hass, `act_${m.activity}`) === `act_${m.activity}` ? m.activity : tr(hass, `act_${m.activity}`), lb("activity"), c.entity_activity);
    if (m.presenceKnown) tile(m.atHome ? "mdi:home" : "mdi:home-export-outline", tr(hass, m.atHome ? "pres_home" : "pres_away"), lb("presence"), c.entity_presence, m.atHome ? "" : "warn");
  } else if (kind === "garland") {
    if (m.glEffect && m.status === "lit") tile("mdi:auto-fix", m.glEffect, lb("effect"), c.entity);
  } else if (kind === "iron" || kind === "steam_station") {
    if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 0, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
    if (m.waterE) tile("mdi:water", m.waterPct != null ? `${fmtNum(hass, m.waterPct, 0, 0, c.water_level)} %` : tr(hass, m.waterLow ? "tank_empty_short" : "tank_ok"), lb("water"), c.water_level, m.waterLow ? "warn" : "");
    if (m.steamE) tile("mdi:weather-fog", stateText(hass, m.steamE), lb("steam"), c.steam);
  } else if (kind === "projector_screen") {
    if (m.scrHasPos) tile("mdi:arrow-expand-vertical", `${Math.round(m.scrPos * 100)} %`, lb("screen_position"), c.entity);
  } else if (kind === "infrared_panel") {
    if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1, 0, tEntity)} ${m.tempUnit}`, lb("temperature"), tEntity);
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
        tile("mdi:printer-3d-nozzle-heat", v != null ? `${fmtNum(hass, v, 0, 0, id)} ${m.tempUnit}` : "—", `T${i}`, id, "", "nozzle");
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
    const f = m.fit, rower = kind === "rowing_machine", belt = kind === "treadmill";
    if (m.speed) tile("mdi:speedometer", fmtUnit(hass, m.speed, 1), lb("speed"), c.speed);
    if (f.incline && !BAD.includes(String(f.incline.state).toLowerCase())) tile("mdi:slope-uphill", fmtUnit(hass, f.incline, 1), lb("incline"), c.incline);
    if (f.cadence) tile(rower ? "mdi:rowing" : belt ? "mdi:shoe-print" : "mdi:rotate-right", fmtUnit(hass, f.cadence, 0), lb(rower ? "stroke_rate" : "cadence"), c.cadence);
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
  // prix : entité (sensor.x, input_number.x) ou nombre, aussi en texte (« 0.25 », « 0,25 » : virgule décimale acceptée)
  const prEnt = priceEntity(c.price_per_kwh);
  const pr = prEnt ? num(hass.states[prEnt]) : typeof c.price_per_kwh === "string" ? (/^\s*-?\d*[.,]?\d+\s*$/.test(c.price_per_kwh) ? Number(c.price_per_kwh.trim().replace(",", ".")) : NaN) : Number(c.price_per_kwh);
  const hasPr = c.price_per_kwh != null && c.price_per_kwh !== "" && Number.isFinite(pr);
  // tarif variable (HC / HP) : prix moyen pondéré par la consommation de la période [t0, t1] (historique de HA), à défaut le prix actuel
  const avgPr = (src, t0, t1) => { if (!prEnt || !src) return pr; const a = window.appliancePrice(hass, prEnt, this, src, t0, t1); return Number.isFinite(a) ? a : pr; };
  const perStart = (p) => { const d = new Date(), R = ROLLING[p]; return R ? new Date(Date.now() - R * 86400000) : p === "week" ? new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)) : p === "month" ? new Date(d.getFullYear(), d.getMonth(), 1) : p === "year" ? new Date(d.getFullYear(), 0, 1) : new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  // kWh calculés ou convertis : la précision d'affichage d'un capteur ne vaut que pour un compteur déjà en kWh (pas pour la puissance, ni un compteur en Wh)
  const kwhEnt = m.energy && m.energy.attributes && m.energy.attributes.unit_of_measurement === "kWh" ? c.energy : undefined;
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
    if (showKwh) tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2, 0, kwhEnt)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.energy, "", "energy");
    // coût de la période (mode € ou les deux) : conso de la période × prix du kWh actuel
    if (showCost && (c.display === "cost" || c.display === "both") && showOpt("show_cost")) tile("mdi:cash", money(this._perKwh * avgPr(c.energy, perStart(per))), tr(hass, `cost_${per}`), prEnt || c.energy, "", "cost");
  } else if (!c.energy && !m.energy && per && c.power && !dual && !solar) {
    // période calculée depuis la puissance de la prise (pas de compteur kWh) : kWh puis coût (avec price_per_kwh)
    if (showKwh) tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.power, "", "energy");
    if (showCost && showOpt("show_cost")) tile("mdi:cash", money(this._perKwh * avgPr(c.power, perStart(per))), tr(hass, `cost_${per}`), prEnt || c.power, "", "cost");
  } else if (m.energy) {
    const eVal = fmtEnergy(hass, m.energy) ?? "—";
    const yp = m.energy.attributes && m.energy.attributes.last_period;
    // en-tête choisi par l'utilisateur (labels.energy, ou energy_tile_period pour le capteur qu'il fournit) : prioritaire sur « hier »
    const eHdr = c.labels && c.labels.energy ? lb("energy") : !solar && !dual && TILE_PERIODS.includes(c.energy_tile_period) ? tr(hass, `energy_${c.energy_tile_period}`) : null;
    if (eHdr == null && yp !== undefined && yp !== null && !isNaN(parseFloat(yp))) {
      const ydayStr = parseFloat(yp).toFixed(1);
      tile("mdi:history", eVal, `${tr(hass, "yday")} ${ydayStr} kWh`, c.energy, "", "energy");
    } else {
      tile("mdi:lightning-bolt-circle", eVal, eHdr ?? lb(solar ? "today" : dual ? "energy_grid" : "energy"), c.energy, "", "energy");
    }
    // prix du kWh (nombre ou entité tarif) avec un simple compteur d'énergie : coût = énergie du compteur × prix (sans capteur de coût, ni solaire / double compteur)
    const eF = { Wh: 1e-3, kWh: 1, MWh: 1e3, GWh: 1e6 }[m.energy.attributes && m.energy.attributes.unit_of_measurement], eV = num(m.energy);
    if (hasPr && showCost && !m.cost && !solar && !dual && showOpt("show_cost") && eF !== undefined && eV != null) {
      tile("mdi:cash", money(eV * eF * avgPr(c.energy, TILE_PERIODS.includes(c.energy_tile_period) && c.energy_tile_period !== "total" ? perStart(c.energy_tile_period) : undefined)), !(c.labels && c.labels.cost) && TILE_PERIODS.includes(c.energy_tile_period) ? tr(hass, `cost_${c.energy_tile_period}`) : lb("cost"), prEnt || c.energy, "", "cost");
    }
  }
  if (m.energyS) tile("mdi:solar-power-variant", fmtEnergy(hass, m.energyS) ?? "—", lb("energy_solar"), c.energy_solar);
  if (m.cost && showOpt("show_cost")) {
    // labels.cost (text libre) > cost_tile_period (période du capteur de coût) > « Coût »
    const cHdr = !solar && !(c.labels && c.labels.cost) && TILE_PERIODS.includes(c.cost_tile_period) ? tr(hass, `cost_${c.cost_tile_period}`) : lb(solar ? "savings" : "cost");
    tile(solar ? "mdi:piggy-bank-outline" : "mdi:cash", fmtUnit(hass, m.cost, 2, 2) ?? "—", cHdr, c.cost, "", "cost");
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
    if (showKwh) tile("mdi:lightning-bolt", `${fmtNum(hass, cy.kwh, 2, 0, kwhEnt)} kWh`, lb("cycle_energy"), c.energy || c.power);
    // prix du kWh : nombre, ou entité (tarif) ; devise de Home Assistant
    if (showCost) tile("mdi:cash", money(cy.kwh * avgPr(c.energy || c.power, s0, s1)), lb("cycle_cost"), prEnt || c.energy || c.power);
  }
  if (solar && m.status !== "night" && m.frac != null && m.pw && !BAD.includes(String(m.pw.state).toLowerCase())) tile("mdi:white-balance-sunny", `${Math.round(m.frac * 100)} %`, lb("of_peak"), c.power);
  $("stats").innerHTML = tiles.join("");
  if (window.applianceExtraTiles) window.applianceExtraTiles(this, $("stats"), c.extra_tiles, hass, c);
  $("stats").style.display = (tiles.length || $("stats").children.length) ? "" : "none";
};
