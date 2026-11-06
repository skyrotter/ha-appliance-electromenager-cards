/* Fonctions partagées par les cartes autonomes (chargées avant elles, une seule fois).
 * window.applianceLang(T, cfg, hass)   → langue des textes : option language, sinon langue de Home Assistant,
 *                                        si elle existe dans T (sr-Latn, puis code à 2 lettres, no / nn → nb), sinon en.
 * window.applianceLocale(cfg, hass)    → locale des nombres et dates : option language, sinon langue de Home Assistant,
 *                                        même sans traduction (un utilisateur polonais garde « 1,5 »).
 * window.applianceNum(st)              → valeur numérique d'un état (climate / water_heater : current_temperature), sinon NaN.
 * window.applianceWatts(st)            → puissance en W (kW et MW convertis), sinon NaN.
 */
(() => {
  const haLang = (cfg, hass) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    return String((cfg && cfg.language) || (h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').replace('_', '-');
  };
  window.applianceLang = (T, cfg, hass) => {
    const full = haLang(cfg, hass);
    if (T[full]) return full;
    if (/^sr-latn$/i.test(full) && T['sr-Latn']) return 'sr-Latn';
    let l = full.toLowerCase().slice(0, 2);
    if (l === 'no' || l === 'nn') l = 'nb'; // norvégien : no / nn → nb (bokmål)
    return T[l] ? l : 'en';
  };
  window.applianceLocale = (cfg, hass) => {
    const l = haLang(cfg, hass);
    try { return Intl.NumberFormat.supportedLocalesOf(l).length ? l : 'en'; } catch (e) { return 'en'; }
  };
  window.applianceNum = (s) => {
    if (!s) return NaN;
    // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
    if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
    const v = parseFloat(String(s.state).replace(',', '.'));
    return isFinite(v) ? v : NaN;
  };
  window.applianceWatts = (s) => {
    const v = window.applianceNum(s); if (isNaN(v)) return NaN;
    const u = String((s.attributes || {}).unit_of_measurement || '').trim();
    return /^kw$/i.test(u) ? v * 1000 : u === 'MW' ? v * 1e6 : v;
  };
})();
