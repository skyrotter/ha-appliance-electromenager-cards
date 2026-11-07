/* Fonctions partagées par les cartes autonomes (chargées avant elles, une seule fois).
 * window.applianceLang(T, cfg, hass)   → langue des textes : option language, sinon langue de Home Assistant,
 *                                        si elle existe dans T (sr-Latn, puis code à 2 lettres, no / nn → nb), sinon en.
 * window.applianceLocale(cfg, hass, dates) → locale des nombres et dates : option language, sinon langue de Home Assistant,
 *                                        même sans traduction (un utilisateur polonais garde « 1,5 »).
 *                                        Pour les nombres, le réglage « Format des nombres » du profil HA (number_format) prime
 *                                        sur la langue ; dates = true l'ignore.
 * window.applianceNum(st)              → valeur numérique d'un état (climate / water_heater : current_temperature), sinon NaN.
 * window.applianceWatts(st)            → puissance en W (kW et MW convertis), sinon NaN.
 * window.applianceChanged(el, hass, cfg) → faut-il redessiner la carte ? (entités de la config, langue, format, 30 s)
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
  // Réglage « Format des nombres » du profil HA (hass.locale.number_format) → locale équivalente
  const NUM_FMT = { comma_decimal: 'en-US', decimal_comma: 'de-DE', space_comma: 'fr-FR' };
  window.applianceLocale = (cfg, hass, dates) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    let l = haLang(cfg, hass);
    if (!dates && !(cfg && cfg.language) && h && h.locale) {
      const nf = h.locale.number_format;
      if (NUM_FMT[nf]) l = NUM_FMT[nf];
      else if (nf === 'system' && typeof navigator !== 'undefined' && navigator.language) l = navigator.language;
    }
    try { return Intl.NumberFormat.supportedLocalesOf(l).length ? l : 'en'; } catch (e) { return 'en'; }
  };
  window.applianceNum = (s) => {
    if (!s) return NaN;
    // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
    if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
    const v = parseFloat(String(s.state).replace(',', '.'));
    return isFinite(v) ? v : NaN;
  };
  // Redessiner ? Home Assistant passe un nouveau hass à chaque changement d'une entité quelconque de la maison :
  // on ne redessine que si une entité citée dans la configuration (listes comprises), la langue, le format des
  // nombres, la config HA, le registre des entités ou la configuration de la carte ont changé, et au moins toutes
  // les 30 s (textes relatifs à l'heure : « il y a 5 min »). Les états de HA sont immuables : comparer les objets suffit.
  const ENTITY_RE = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;
  const idsOf = (v, out = new Set()) => {
    if (typeof v === 'string') { if (ENTITY_RE.test(v)) out.add(v); }
    else if (Array.isArray(v)) v.forEach((x) => idsOf(x, out));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => idsOf(x, out));
    return out;
  };
  // réglages de HA lus par les cartes (langue, formats, unité de température, devise), comparés par valeur
  const settings = (h) => [h.language, h.locale?.language, h.locale?.number_format, h.locale?.time_format,
    h.config?.unit_system?.temperature, h.config?.currency].join('|');
  window.applianceChanged = (el, hass, cfg) => {
    const p = el._applianceSeen, now = Date.now();
    if (!p || p.cfg !== cfg) el._applianceIds = [...idsOf(cfg)];
    const set = hass ? settings(hass) : '';
    const changed = !p || !hass || p.cfg !== cfg || now - p.at >= 30000 || p.set !== set || p.hass.entities !== hass.entities
      || el._applianceIds.some((i) => p.hass.states[i] !== hass.states[i]);
    if (changed && hass) el._applianceSeen = { hass, set, cfg, at: now };
    return changed;
  };
  window.applianceWatts = (s) => {
    const v = window.applianceNum(s); if (isNaN(v)) return NaN;
    const u = String((s.attributes || {}).unit_of_measurement || '').trim();
    return /^kw$/i.test(u) ? v * 1000 : u === 'MW' ? v * 1e6 : v;
  };
})();
