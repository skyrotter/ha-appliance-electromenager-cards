/* ------------------------------------------------------------------ */
/* i18n — strings live in src/i18n/<lang>.json, inlined by build.js    */
/* ------------------------------------------------------------------ */
const STRINGS = /*@i18n common*/{};
// Keep regional translations distinct; accept HA/browser casing and underscore variants.
window.applianceResolveLanguage = (table, language) => {
  const full = String(language || 'en').replace(/_/g, '-').toLowerCase();
  const exact = Object.keys(table).find((key) => key.toLowerCase() === full);
  if (exact) return exact;
  let base = full.split('-')[0];
  if (base === 'no' || base === 'nn') base = 'nb';
  if (base === 'pt' && Object.prototype.hasOwnProperty.call(table, 'pt-PT')) return 'pt-PT';
  return Object.prototype.hasOwnProperty.call(table, base) ? base : 'en';
};
const lang = (hass) => window.applianceResolveLanguage(STRINGS,
  (hass && (hass.locale?.language || hass.language)) || document.documentElement.lang || 'en');
const tr = (hass, key) => STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;
