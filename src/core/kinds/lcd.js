/* LCD display text formatting per appliance kind (split out of base.js). */
ApplianceCardBase.prototype._lcdText = function (m) {
  const hass = this._hass, kind = this._kind, c = this._config;
  // lcd_value : « current » affiche la température actuelle plutôt que la consigne (radiateur, sèche-serviettes, clim)
  const lcdT = () => (c.lcd_value === "current" ? m.tempVal ?? m.targetVal : m.targetVal ?? m.tempVal);
  const active = ["screen_open", "screen_opening", "screen_closing", "iron_heating", "iron_ready", "steaming", "grilling", "grill_ready", "fryer_heating", "fryer_ready", "running", "heating", "preheating", "cooling", "ignition", "filtering", "dosing", "in_use", "printing", "scanning", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging", "drying", "boiling", "toasting", "powered", "lit", "wv_cleaning", "wv_selfclean", "wv_drying", "ps_gaming", "mixing", "turbo"].includes(m.status);
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
};
