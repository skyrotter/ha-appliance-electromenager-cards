/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const BAD = ["unavailable", "unknown", "none", ""];
const OFF_STATES = ["off", "idle", "inactive", "false", "standby", "stopped", "stop", "ready", "arret", "arrêt", "veille", "inactif", "pause", "paused", "0"];
const DONE_STATES = ["finished", "finish", "done", "end", "ended", "complete", "completed", "termine", "terminé", "fin", "cycle_finished"];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (st) => {
  if (!st || BAD.includes(String(st.state).toLowerCase())) return null;
  const n = parseFloat(st.state);
  return Number.isFinite(n) ? n : null;
};
const domainOf = (id) => (id || "").split(".")[0];
// modes radiateur / sèche-serviettes : confort, éco, hors-gel, arrêt
const MODE_RX = { comfort: /confort|comfort/, eco: /eco|nuit|night|sleep|economy|reduit|réduit/, frost: /hors|frost|gel|away|absent/, off: /^(off|arret|arrêt|stop)$/ };
const MODE_ORDER = ["comfort", "eco", "frost", "off"];
const MODE_ICON = { comfort: "mdi:fire", eco: "mdi:leaf", frost: "mdi:snowflake", off: "mdi:power" };
const modeOptions = (st) => {
  if (!st) return [];
  const d = domainOf(st.entity_id);
  if (d === "select" || d === "input_select") return st.attributes.options || [];
  if (d === "climate") return [...(st.attributes.preset_modes || []), ...(st.attributes.hvac_modes || [])];
  return [];
};
const pickMode = (opts, key) => opts.find((o) => MODE_RX[key].test(String(o).toLowerCase()));
function modeOf(m, main, c) {
  const isClimate = main && domainOf(c.entity) === "climate";
  const raw = isClimate && main.state === "off" ? "off"
    : String(m.mode && !BAD.includes(String(m.mode.state).toLowerCase()) ? m.mode.state
      : isClimate ? (main.attributes.preset_mode || main.state) : "").toLowerCase();
  return /hors|frost|gel|away|absent/.test(raw) ? "frost"
    : /eco|nuit|night|sleep|economy|reduit|réduit/.test(raw) ? "eco"
    : /^(off|arret|arrêt|stop)$/.test(raw) ? "off"
    : raw ? "comfort" : null;
}
const loc = (hass) => hass?.locale?.language || hass?.language || undefined;

function fmtNum(hass, n, digits, minDigits = 0) {
  try {
    return new Intl.NumberFormat(loc(hass), { maximumFractionDigits: digits, minimumFractionDigits: minDigits }).format(n);
  } catch (e) { return n.toFixed(digits); }
}
const powerW = (st) => { const v = num(st); if (v === null) return null; return st.attributes.unit_of_measurement === "kW" ? v * 1000 : v; };
function fmtPower(hass, st) {
  const w = powerW(st); if (w === null) return null;
  return w >= 1000 ? `${fmtNum(hass, w / 1000, 2)} kW` : `${fmtNum(hass, w, w < 10 ? 1 : 0)} W`;
}
function fmtUnit(hass, st, digits, minDigits = 0) {
  const v = num(st); if (v === null) return null;
  const u = st.attributes.unit_of_measurement;
  return u ? `${fmtNum(hass, v, digits, minDigits)} ${u}` : fmtNum(hass, v, digits, minDigits);
}
// Énergie en kWh (Wh et MWh convertis), sans décimale au-delà de 1000 kWh ; autres unités inchangées
function fmtEnergy(hass, st) {
  const v = num(st); if (v === null) return null;
  const u = st.attributes.unit_of_measurement;
  const f = { Wh: 1e-3, kWh: 1, MWh: 1e3, GWh: 1e6 }[u];
  if (f === undefined) return fmtUnit(hass, st, 2);
  const k = v * f;
  return `${fmtNum(hass, k, Math.abs(k) >= 1000 ? 0 : 2)} kWh`;
}
function parseRemaining(st) {
  if (!st) return null;
  const v = String(st.state);
  if (BAD.includes(v.toLowerCase())) return null;
  const a = st.attributes || {};
  if (a.device_class === "timestamp" || /^\d{4}-\d\d-\d\dT/.test(v)) {
    const d = (new Date(v).getTime() - Date.now()) / 60000;
    return Number.isFinite(d) ? Math.max(0, d) : null;
  }
  const m = v.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (m) return (+m[1]) * 60 + (+m[2]) + (m[3] ? +m[3] / 60 : 0);
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return null;
  const u = String(a.unit_of_measurement || "min").toLowerCase();
  if (u === "h") return n * 60;
  if (u === "s") return n / 60;
  if (u === "d") return n * 1440;
  return n;
}
function fmtDuration(min) {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${String(r).padStart(2, "0")}` : `${h} h`;
}
/* Dernier cycle terminé d'après l'historique de la puissance.
   pw : [{ t (ms), w (W) }] trié ; un cycle = puissance > seuil, les creux plus courts que gapMin (trempage, séchage) restent dans le cycle.
   en : [{ t, v (kWh) }] compteur d'énergie, facultatif. Renvoie { start, end, kwh } ou null (aucun cycle, ou cycle en cours). */
function lastCycle(pw, threshold, gapMin = 15, en = []) {
  const gap = gapMin * 60000;
  let start = null, lastOn = null, cyc = null;
  for (let i = 0; i < pw.length; i++) {
    const p = pw[i], next = pw[i + 1];
    if (!(p.w > threshold)) continue;
    // fin de cette période au-dessus du seuil : instant du point suivant (ou maintenant)
    const offAt = next ? next.t : null;
    if (start === null || p.t - lastOn > gap) { if (start !== null) cyc = { start, end: lastOn }; start = p.t; }
    lastOn = offAt;
    if (offAt === null) return null; // encore au-dessus du seuil : cycle en cours
  }
  if (start !== null && lastOn !== null) cyc = { start, end: lastOn };
  if (!cyc || cyc.end - cyc.start < 120000) return null; // < 2 min : pic parasite
  // énergie : écart du compteur, sinon intégrale de la puissance
  const at = (T) => { let v = null; for (const e of en) { if (e.t <= T) v = e.v; else break; } return v; };
  const e0 = at(cyc.start), e1 = at(cyc.end + 60000);
  let kwh = e0 != null && e1 != null && e1 >= e0 ? e1 - e0 : null;
  if (kwh === null) {
    kwh = 0;
    for (let i = 0; i < pw.length - 1; i++) {
      const a = Math.max(pw[i].t, cyc.start), b = Math.min(pw[i + 1].t, cyc.end);
      if (b > a && pw[i].w > 0) kwh += pw[i].w * (b - a) / 3.6e9;
    }
  }
  return { ...cyc, kwh };
}
// H:MM like a real washer/oven display; M:SS for short countdowns (microwave)
const lcdDuration = (min, short = false) => {
  if (short) { const s = Math.round(min * 60); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
  const m = Math.ceil(min - 1e-9); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};
function fmtClock(hass, date) {
  try { return date.toLocaleTimeString(loc(hass), { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`; }
}
function stateText(hass, st) {
  if (!st) return "";
  try { if (hass.formatEntityState) return hass.formatEntityState(st); } catch (e) { /* ignore */ }
  return st.state;
}
const isOn = (st) => !!st && String(st.state).toLowerCase() === "on";
