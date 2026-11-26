/* Libellés de l'éditeur visuel des cartes autonomes (Pompe, Onduleur, Plancher chauffant, Sauna…).
 * Chargé à la demande à l'ouverture d'un éditeur de carte.
 * window.applianceEditorLabel(nom, hass) → libellé traduit dans la langue de Home Assistant,
 * à défaut un libellé lisible tiré du nom de l'option (entity_floor_temp → « Floor temp »).
 */
(() => {
  if (window.applianceEditorLabel && window.applianceEditorLabel._full) return;
  const L = /*@i18n editor*/{};
  const lang = (hass) => window.applianceLang(L, null, hass);
  const human = (n) => { const t = String(n).replace(/^entity_/, '').replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
  const fn = (name, hass) => (name ? (L[lang(hass)] || L.en)[name] ?? L.en[name] ?? human(name) : '');
  fn._full = true;
  window.applianceEditorLabel = fn;
})();
