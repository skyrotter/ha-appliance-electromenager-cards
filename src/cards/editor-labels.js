/* Libellés de l'éditeur visuel des cartes autonomes (Pompe, Onduleur, Plancher chauffant, Sauna…)
 * et unité des températures (°C / °F) partagée par ces cartes.
 * window.applianceEditorLabel(nom, hass) → libellé traduit dans la langue de Home Assistant,
 * à défaut un libellé lisible tiré du nom de l'option (entity_floor_temp → « Floor temp »).
 */
(() => {
  if (window.applianceEditorLabel) return;
  const L = /*@i18n editor*/{};
  const lang = (hass) => window.applianceLang(L, null, hass);
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
    // tile_background : « transparent » (défaut, léger voile gris) ou « theme » (fond secondaire du thème HA) → --ac-tile-bg, lue par les tuiles
    if (cfg && cfg.tile_background === 'theme') el.style.setProperty('--ac-tile-bg', 'var(--secondary-background-color, rgba(127,127,127,.12))');
    else el.style.removeProperty('--ac-tile-bg');
    // tile_order : « name » (nom au-dessus) ou « value » (valeur au-dessus) → attribut tile-order sur la carte ; absent = ordre historique de la carte
    if (cfg && (cfg.tile_order === 'name' || cfg.tile_order === 'value')) el.setAttribute('tile-order', cfg.tile_order);
    else el.removeAttribute('tile-order');
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
  // Champs d'éditeur communs : fond et ordre des tuiles (vide = comportement historique de la carte)
  window.applianceTileFields = (hass) => [
    { name: 'tile_background', selector: { select: { mode: 'dropdown', options: [
      { value: 'transparent', label: window.applianceEditorLabel('tile_bg_transparent', hass) }, { value: 'theme', label: window.applianceEditorLabel('tile_bg_theme', hass) }] } } },
    { name: 'tile_order', selector: { select: { mode: 'dropdown', options: [
      { value: 'name', label: window.applianceEditorLabel('tile_order_name', hass) }, { value: 'value', label: window.applianceEditorLabel('tile_order_value', hass) }] } } },
  ];
  // Icône perso d'une tuile : `icons: { clé: mdi:xxx }` (mêmes clés que `labels`), sinon l'icône par défaut de la carte
  window.applianceIcon = (cfg, key, def) => { const v = cfg && cfg.icons && cfg.icons[key]; return typeof v === 'string' && /^[\w-]+:[\w-]+$/.test(v.trim()) ? v.trim() : def; };
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
  // Actions Home Assistant sur l'illustration (tap_action / hold_action, appui long 0,5 s) — cartes autonomes.
  // Champs à ajouter au schéma de l'éditeur : ...window.applianceActionFields
  const ACT = ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'];
  window.applianceActionFields = ['tap_action', 'hold_action'].map((name) => ({ name, selector: { ui_action: { actions: ACT } } }));
  // entité par défaut d'une action : « entity », sinon la première option entity_* renseignée
  const dfltEntity = (c) => {
    if (!c) return '';
    if (typeof c.entity === 'string' && c.entity) return c.entity;
    const k = Object.keys(c).find((n) => /^entity_/.test(n) && typeof c[n] === 'string' && c[n]);
    return k ? c[k] : '';
  };
  // exécute une action : more-info / toggle / none gérés ici, le reste (navigate, url, perform-action…) confié à Home Assistant
  window.applianceRunAction = (el, a) => {
    const c = el._c || el._config, hass = el._hass;
    const type = typeof a === 'string' ? a : a && a.action;
    if (!type || type === 'none' || !hass) return;
    const id = (a && a.entity) || dfltEntity(c);
    if (type === 'more-info') { window.applianceMore(el, id); return; }
    if (type === 'toggle' && id) {
      const d = id.split('.')[0];
      hass.callService(['light', 'switch', 'input_boolean', 'fan'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: id });
      return;
    }
    el.dispatchEvent(new CustomEvent('hass-action', { detail: { config: { entity: id, tap_action: typeof a === 'string' ? { action: a } : a }, action: 'tap' }, bubbles: true, composed: true }));
  };
  // branche l'illustration : clic → tap_action (sinon fallback, la fiche de l'entité), appui long → hold_action
  window.applianceBindIllus = (el, target, fallback) => {
    if (!target || target._applianceActions) return;
    target._applianceActions = true;
    const cfg = () => el._c || el._config || {};
    let timer, held = false;
    const stop = () => clearTimeout(timer);
    target.addEventListener('click', () => {
      if (held) { held = false; return; } // clic qui suit un appui long : ignoré
      const c = cfg();
      if (c.tap_action) window.applianceRunAction(el, c.tap_action); else if (fallback) fallback();
    });
    target.addEventListener('pointerdown', (ev) => {
      held = false;
      const c = cfg();
      if (!c.hold_action || (ev.button != null && ev.button > 0)) return;
      stop();
      timer = setTimeout(() => { held = true; window.applianceRunAction(el, c.hold_action); }, 500);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => target.addEventListener(t, stop));
    target.addEventListener('contextmenu', (ev) => { if (cfg().hold_action) ev.preventDefault(); });
  };
  window.applianceEditorLabel = (name, hass) => (name ? (L[lang(hass)] || L.en)[name] ?? L.en[name] ?? human(name) : '');
})();
