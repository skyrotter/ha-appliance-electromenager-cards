/* ------------------------------------------------------------------ */
/* i18n — strings live in src/i18n/<lang>.json, inlined by build.js    */
/* ------------------------------------------------------------------ */
const STRINGS = /*@i18n common*/{};
const lang = (hass) => {
  let fullLang = (hass && (hass.locale?.language || hass.language)) || document.documentElement.lang || "en";
  
  // 1. Check for an exact match (e.g. 'sr-Latn')
  if (STRINGS[fullLang]) return fullLang;
  
  // 2. Normalize and check for variations (e.g. 'sr-latn' or 'sr_latn')
  let formatted = fullLang.replace('_', '-');
  let normalizedLatn = formatted.toLowerCase() === 'sr-latn' ? 'sr-Latn' : formatted;
  if (STRINGS[normalizedLatn]) return normalizedLatn;
  
  // 3. Fallback to 2-letter code
  let l = fullLang.toLowerCase().slice(0, 2);
  if (l === "no" || l === "nn") l = "nb"; // Norwegian: no / nn → nb (bokmål)
  return STRINGS[l] ? l : "en";
};
const tr = (hass, key) => STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;
