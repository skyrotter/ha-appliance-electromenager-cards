/* Libellés de l'éditeur visuel des cartes autonomes (Pompe, Onduleur, Plancher chauffant, Sauna…)
 * et unité des températures (°C / °F) partagée par ces cartes.
 * window.applianceEditorLabel(nom, hass) → libellé traduit dans la langue de Home Assistant,
 * à défaut un libellé lisible tiré du nom de l'option (entity_floor_temp → « Floor temp »).
 */
(() => {
  if (window.applianceEditorLabel) return;
  const L = /*@i18n editor*/{};
  const lang = (hass) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    let l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
    if (l === 'no' || l === 'nn') l = 'nb'; // norvégien : no / nn → nb (bokmål)
    return L[l] ? l : 'en';
  };
  const human = (n) => { const t = String(n).replace(/^entity_/, '').replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
  // illustration_size (en %, 30 à 300) : échelle du dessin, lue par chaque carte via --illus-scale
  window.applianceSize = (el, cfg) => {
    const n = Number(cfg && cfg.illustration_size);
    if (n > 0) el.style.setProperty('--illus-scale', String(Math.max(0.3, Math.min(3, n / 100))));
    else el.style.removeProperty('--illus-scale');
    // dessin agrandi : la carte passe en disposition empilée plus tôt (voir card.css), sinon le titre est tronqué
    el.toggleAttribute('illus-big', n > 100);
    // transparent : la carte laisse voir le fond du tableau de bord (variables de ha-card, héritées dans le shadow DOM)
    const T = { '--ha-card-background': 'transparent', '--ha-card-box-shadow': 'none', '--ha-card-border-width': '0' };
    for (const [k, v] of Object.entries(T)) { if (cfg && cfg.transparent) el.style.setProperty(k, v); else el.style.removeProperty(k); }
  };
  // Températures (multi-pays) : unité d'affichage = option temperature_unit (C / F), sinon celle de Home Assistant, sinon °C.
  // conv() convertit la valeur d'une entité depuis son unit_of_measurement (à défaut l'unité de HA : climate / water_heater
  // n'en ont pas) ; les seuils saisis sont dans l'unité d'affichage, les valeurs par défaut écrites en °C passent par c() / d().
  const tu = (u) => {
    const s = String(u || '').trim().toLowerCase();
    return s === '℉' || /^°?f(ahrenheit)?$/.test(s) ? 'F' : s === '℃' || /^°?c(elsius)?$/.test(s) ? 'C' : /^k(elvin)?$/.test(s) ? 'K' : null;
  };
  window.applianceTemp = (hass, cfg) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    const sys = tu(h?.config?.unit_system?.temperature) || 'C';
    const f = (tu(cfg && cfg.temperature_unit) || (sys === 'F' ? 'F' : 'C')) === 'F';
    const ok = (v) => v != null && Number.isFinite(Number(v));
    const fromC = (v) => (f ? v * 1.8 + 32 : v);
    return {
      unit: f ? '°F' : '°C',
      conv: (v, st) => {
        if (!ok(v)) return v;
        const src = tu(st && st.attributes && st.attributes.unit_of_measurement) || sys;
        const vc = src === 'F' ? (v - 32) / 1.8 : src === 'K' ? v - 273.15 : v;
        return src === (f ? 'F' : 'C') ? v : fromC(vc);
      },
      c: (v) => (ok(v) ? fromC(Number(v)) : v), // température écrite en °C → affichage
      d: (v) => (ok(v) && f ? Number(v) * 1.8 : v), // écart en °C (marge) → affichage
      toC: (v) => (ok(v) && f ? (v - 32) / 1.8 : v), // affichage → °C (dégradés, échelles internes)
      // bornes d'un champ de l'éditeur données en °C, arrondies dans l'unité d'affichage
      range: (min, max) => ({ min: Math.floor(fromC(min)), max: Math.ceil(fromC(max)) }),
    };
  };
  // champ « Unité de température » des éditeurs (vide : automatique)
  window.applianceTempField = { name: 'temperature_unit', selector: { select: { mode: 'dropdown', options: [{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }] } } };
  // Fiche d'une entité (more-info de Home Assistant)
  window.applianceMore = (el, id) => { if (id) el.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
  // Tuile cliquable : attributs à ajouter à une tuile liée à une entité (rien sans entité)
  const escA = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  window.applianceTileAttrs = (id) => (id ? ` data-e="${escA(id)}" role="button" tabindex="0" style="cursor:pointer"` : '');
  // Clic (ou Entrée / Espace) sur un élément [data-e] du conteneur : ouvre la fiche de son entité
  window.applianceLinkTiles = (box, el) => {
    if (!box || box._applianceLinked) return;
    box._applianceLinked = true;
    const go = (e) => { const t = e.target.closest && e.target.closest('[data-e]'); if (t && box.contains(t)) { e.stopPropagation(); window.applianceMore(el, t.dataset.e); } };
    box.addEventListener('click', go);
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
  };
  window.applianceEditorLabel = (name, hass) => (name ? (L[lang(hass)] || L.en)[name] ?? L.en[name] ?? human(name) : '');
})();
