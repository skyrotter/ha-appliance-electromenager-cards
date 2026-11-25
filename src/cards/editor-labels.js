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
    // « none » : tuiles sans aucun fond (la variable CSS --ac-tile-bg peut aussi être posée dans le thème pour toutes les cartes)
    if (cfg && cfg.tile_background === 'theme') el.style.setProperty('--ac-tile-bg', 'var(--secondary-background-color, rgba(127,127,127,.12))');
    else if (cfg && cfg.tile_background === 'none') el.style.setProperty('--ac-tile-bg', 'transparent');
    else el.style.removeProperty('--ac-tile-bg');
    // illustration_background : « none » retire le cadre sombre derrière le dessin (--ac-illus-bg, aussi posable dans le thème)
    if (cfg && cfg.illustration_background === 'none') el.style.setProperty('--ac-illus-bg', 'transparent');
    else el.style.removeProperty('--ac-illus-bg');
    // tile_order : « name » (nom au-dessus) ou « value » (valeur au-dessus) → attribut tile-order sur la carte ; absent = ordre historique de la carte
    if (cfg && (cfg.tile_order === 'name' || cfg.tile_order === 'value')) el.setAttribute('tile-order', cfg.tile_order);
    else el.removeAttribute('tile-order');
    // title_size : taille du titre des cartes de base en px (défaut 14, comme les cartes récentes) ; title_bold : titre en gras
    const ts = Number(cfg && cfg.title_size);
    if (ts >= 8 && ts <= 40) el.style.setProperty('--ac-title-size', `${ts}px`); else el.style.removeProperty('--ac-title-size');
    if (cfg && cfg.title_bold === true) el.style.setProperty('--ac-title-weight', '600'); else el.style.removeProperty('--ac-title-weight');
    // vertical_align: center → contenu des cartes de base centré verticalement dans une case plus haute (sinon calé en haut)
    el.toggleAttribute('valign-center', !!cfg && cfg.vertical_align === 'center');
    // illustration_position: left | right → dessin à côté des 2 premières tuiles (attribut illus-pos, voir card.css) ; absent = centré (défaut)
    if (cfg && !(cfg.tiles_position === 'top' || cfg.tiles_position === 'left' || cfg.tiles_position === 'right' || cfg.tiles_position === 'bottom') && (cfg.illustration_position === 'left' || cfg.illustration_position === 'right')) el.setAttribute('illus-pos', cfg.illustration_position); else el.removeAttribute('illus-pos');
    // tiles_position : top | left | right → tuiles au-dessus / à gauche / à droite du dessin (attribut tiles-pos, voir applianceTilePos) ; absent = en dessous (défaut)
    const tp = cfg && cfg.tiles_position;
    if (tp === 'top' || tp === 'left' || tp === 'right' || tp === 'bottom') el.setAttribute('tiles-pos', tp); else el.removeAttribute('tiles-pos');
    queueMicrotask(() => window.applianceTilePos && window.applianceTilePos(el));
    // title_layout: stacked → ancienne disposition des cartes de base (titre puis état, empilés) ; par défaut titre à gauche et état à droite
    if (cfg && cfg.title_layout === 'stacked') el.setAttribute('title-layout', 'stacked'); else el.removeAttribute('title-layout');
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
  // Position des tuiles (option tiles_position) : les cartes autonomes ont toutes le même squelette (.head, le dessin, .tiles dans un même
  // conteneur). On repère le conteneur des .tiles (.ac-tp) et le bloc du dessin (.ac-ill), et une feuille de style injectée dans le shadow DOM
  // les réorganise : au-dessus (colonne, tuiles juste sous le titre) ou à côté (grille 2 colonnes, titre et autres blocs pleine largeur).
  // Rappelée à chaque rendu : une reconstruction du DOM efface les marques et la feuille.
  const TP_CSS = `
:host([tiles-pos="top"]) .ac-tp{display:flex;flex-direction:column}
:host([tiles-pos="top"]) .ac-tp>.head{order:-3}
:host([tiles-pos="top"]) .ac-tp>.ac-tl{order:-2;margin:6px 0 4px}
:host([tiles-pos="left"]) .ac-tp,:host([tiles-pos="right"]) .ac-tp{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);column-gap:10px;align-items:center}
:host([tiles-pos="left"]) .ac-tp>*,:host([tiles-pos="right"]) .ac-tp>*{grid-column:1/-1}
:host([tiles-pos="left"]) .ac-tp>.head,:host([tiles-pos="right"]) .ac-tp>.head{grid-row:1}
:host([tiles-pos="left"]) .ac-tp>.ac-ill,:host([tiles-pos="right"]) .ac-tp>.ac-ill,:host([tiles-pos="left"]) .ac-tp>.ac-tl,:host([tiles-pos="right"]) .ac-tp>.ac-tl{grid-row:2}
:host([tiles-pos="left"]) .ac-tp>.ac-tl,:host([tiles-pos="right"]) .ac-tp>.ac-tl{margin:0;grid-template-columns:minmax(0,1fr)}
:host([tiles-pos="right"]) .ac-tp>.ac-ill,:host([tiles-pos="left"]) .ac-tp>.ac-tl{grid-column:1}
:host([tiles-pos="right"]) .ac-tp>.ac-tl,:host([tiles-pos="left"]) .ac-tp>.ac-ill{grid-column:2}`;
  window.applianceTilePos = (el) => {
    const root = el.shadowRoot;
    if (!root || !el.hasAttribute('tiles-pos')) return;
    if (root.querySelector('.top .illus')) return; // cartes de base : mise en page gérée par card.css
    const tiles = root.querySelector('.tiles, .stats'), box = tiles && tiles.parentElement;
    if (!box) return;
    if (!root.querySelector('style[data-actp]')) { const st = document.createElement('style'); st.dataset.actp = ''; st.textContent = TP_CSS; root.appendChild(st); }
    box.classList.add('ac-tp'); tiles.classList.add('ac-tl');
    const ill = [...box.children].find((n) => !n.matches('.head,.ac-tl') && (n.matches('svg,img') || n.querySelector('svg,img')));
    if (ill) ill.classList.add('ac-ill');
  };
  // Champs d'éditeur communs : fond et ordre des tuiles (vide = comportement historique de la carte)
  window.applianceTileFields = (hass) => [
    { name: 'tile_background', selector: { select: { mode: 'dropdown', options: [
      { value: 'transparent', label: window.applianceEditorLabel('tile_bg_transparent', hass) }, { value: 'theme', label: window.applianceEditorLabel('tile_bg_theme', hass) }, { value: 'none', label: window.applianceEditorLabel('tile_bg_none', hass) }] } } },
    { name: 'illustration_background', selector: { select: { mode: 'dropdown', options: [
      { value: 'default', label: window.applianceEditorLabel('illus_bg_default', hass) }, { value: 'none', label: window.applianceEditorLabel('illus_bg_none', hass) }] } } },
    { name: 'tiles_position', selector: { select: { mode: 'dropdown', options: [
      { value: 'bottom', label: window.applianceEditorLabel('tiles_pos_bottom', hass) }, { value: 'top', label: window.applianceEditorLabel('tiles_pos_top', hass) },
      { value: 'left', label: window.applianceEditorLabel('tiles_pos_left', hass) }, { value: 'right', label: window.applianceEditorLabel('tiles_pos_right', hass) }] } } },
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
  window.applianceActionFields = [...['tap_action', 'hold_action'].map((name) => ({ name, selector: { ui_action: { actions: ACT } } })), { name: 'confirm_action', selector: { boolean: {} } }, { name: 'confirm_text', selector: { text: {} } }];
  // entité par défaut d'une action : « entity », sinon la première option entity_* renseignée
  const dfltEntity = (c) => {
    if (!c) return '';
    if (typeof c.entity === 'string' && c.entity) return c.entity;
    const k = Object.keys(c).find((n) => /^entity_/.test(n) && typeof c[n] === 'string' && c[n]);
    return k ? c[k] : '';
  };
  // exécute une action : more-info / toggle / none gérés ici, le reste (navigate, url, perform-action…) confié à Home Assistant
  // confirmation demandée pour une action : celle de l'action (confirmation: true | { text, exemptions }, comme Home Assistant) ou, si la case
  // « Demander confirmation » de la carte est cochée (confirm_action, texte confirm_text), toute action sauf more-info / none. Sinon rien (facultatif).
  window.applianceConf = (el, a) => {
    const c = el._c || el._config || {}, t = typeof a === 'string' ? a : a && a.action;
    if (a && typeof a === 'object' && a.confirmation) return a.confirmation;
    if (c.confirm_action === true && t && t !== 'none' && t !== 'more-info') return c.confirm_text ? { text: String(c.confirm_text) } : true;
    return undefined;
  };
  // confirmation (option HA standard d'une action) : confirmation: true, ou { text, exemptions: [{ user: id }] } ; fenêtre « Annuler / OK » posée sur la page,
  // texte par défaut traduit par Home Assistant. Les utilisateurs de exemptions ne sont pas interrogés. run() est appelé seulement si on valide.
  window.applianceConfirm = (el, a, run) => {
    const conf = window.applianceConf(el, a), hass = el._hass;
    if (!conf || !hass) { run(); return; }
    const ex = typeof conf === 'object' && Array.isArray(conf.exemptions) ? conf.exemptions : [];
    if (hass.user && ex.some((e) => e && e.user === hass.user.id)) { run(); return; }
    const loc = (k, p) => { try { const v = hass.localize && hass.localize(k, p); return v || ''; } catch (e) { return ''; } };
    const type = typeof a === 'string' ? a : a.action;
    const fr = /^fr/i.test(String(hass.language || ''));
    const text = (typeof conf === 'object' && conf.text ? String(conf.text) : '')
      || loc('ui.panel.lovelace.cards.actions.action_confirmation', { action: loc(`ui.panel.lovelace.editor.action-editor.actions.${type}`) || type })
      || (fr ? 'Voulez-vous vraiment effectuer cette action ?' : 'Are you sure?');
    const okTxt = loc('ui.common.ok') || 'OK', noTxt = loc('ui.common.cancel') || (fr ? 'Annuler' : 'Cancel');
    const ov = document.createElement('div');
    ov.setAttribute('role', 'alertdialog'); ov.setAttribute('aria-modal', 'true');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif)';
    const box = document.createElement('div');
    box.style.cssText = 'box-sizing:border-box;width:min(92vw,360px);padding:20px 22px 12px;border-radius:var(--ha-card-border-radius,12px);background:var(--card-background-color,#fff);color:var(--primary-text-color,#212121);box-shadow:0 8px 32px rgba(0,0,0,.4)';
    const msg = document.createElement('div'); msg.textContent = text; msg.style.cssText = 'font-size:16px;line-height:22px;margin-bottom:14px;white-space:pre-line';
    const row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px';
    const mk = (label, strong) => { const bt = document.createElement('button'); bt.type = 'button'; bt.textContent = label; bt.style.cssText = `border:0;background:none;cursor:pointer;padding:8px 12px;border-radius:8px;font:600 14px/20px inherit;color:var(--primary-color,#03a9f4)${strong ? ';background:color-mix(in srgb,var(--primary-color,#03a9f4) 14%,transparent)' : ''}`; return bt; };
    const no = mk(noTxt, false), ok = mk(okTxt, true);
    const close = (go) => { document.removeEventListener('keydown', key, true); ov.remove(); if (go) run(); };
    const key = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(false); } };
    no.onclick = () => close(false); ok.onclick = () => close(true);
    ov.addEventListener('click', (ev) => { if (ev.target === ov) close(false); });
    document.addEventListener('keydown', key, true);
    row.append(no, ok); box.append(msg, row); ov.append(box); document.body.appendChild(ov); ok.focus();
  };
  window.applianceRunAction = (el, a0) => {
    // la confirmation est gérée ici : on retire l'option avant de confier l'action à Home Assistant (pas de 2e fenêtre)
    const a = a0 && typeof a0 === 'object' && a0.confirmation ? { ...a0, confirmation: undefined } : a0;
    window.applianceConfirm(el, a0, () => window.applianceRunAction1(el, a));
  };
  // « toggle » selon le domaine : homeassistant.toggle ne fait rien pour un verrou, une scène, un script ou un bouton
  window.applianceToggle = (hass, id) => {
    const d = id.split('.')[0], st = hass.states && hass.states[id] && hass.states[id].state;
    if (d === 'lock') hass.callService('lock', st === 'locked' ? 'unlock' : 'lock', { entity_id: id });
    else if (d === 'scene' || d === 'script') hass.callService(d, 'turn_on', { entity_id: id });
    else if (d === 'button' || d === 'input_button') hass.callService(d, 'press', { entity_id: id });
    else hass.callService(['light', 'switch', 'input_boolean', 'fan', 'cover'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: id });
  };
  window.applianceRunAction1 = (el, a) => {
    const c = el._c || el._config, hass = el._hass;
    const type = typeof a === 'string' ? a : a && a.action;
    if (!type || type === 'none' || !hass) return;
    const id = (a && a.entity) || dfltEntity(c);
    if (type === 'more-info') { window.applianceMore(el, id); return; }
    if (type === 'toggle' && id && /^(select|input_select|number|input_number|sensor|counter|binary_sensor)\./.test(id)) { window.applianceMore(el, id); return; } // pas basculable : fiche de l'entité
    if (type === 'toggle' && id) { window.applianceToggle(hass, id); return; }
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
