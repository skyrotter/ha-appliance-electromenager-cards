/* Fonctions partagées par les cartes autonomes (chargées avant elles, une seule fois).
 * window.applianceLang(T, cfg, hass)   → langue des textes : option language, sinon langue de Home Assistant,
 *                                        si elle existe dans T (région conservée, pt → pt-PT, no / nn → nb), sinon en.
 * window.applianceLanguageField(T)    → champ language de l'éditeur, limité aux traductions de T.
 * window.applianceLocale(cfg, hass, dates) → locale des nombres et dates : option language, sinon langue de Home Assistant,
 *                                        même sans traduction (un utilisateur polonais garde « 1,5 »).
 *                                        Pour les nombres, le réglage « Format des nombres » du profil HA (number_format) prime
 *                                        sur la langue ; dates = true l'ignore.
 * window.applianceNum(st)              → valeur numérique d'un état (climate / water_heater : current_temperature), sinon NaN.
 * window.applianceWatts(st)            → puissance en W (kW et MW convertis), sinon NaN.
 * window.applianceChanged(el, hass, cfg, ttl) → faut-il redessiner la carte ? (entités de la config, langue, format, ttl ms)
 */
(() => {
  const haLang = (cfg, hass) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    return String((cfg && cfg.language) || (h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').replace('_', '-');
  };
  window.applianceLang = (T, cfg, hass) => window.applianceResolveLanguage(T, haLang(cfg, hass));
  // Shared native language names: adding a translation never requires editing every card.
  const LANGUAGE_NAMES = {
    en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', it: 'Italiano',
    cs: 'Čeština', da: 'Dansk', hu: 'Magyar', nb: 'Norsk bokmål', nl: 'Nederlands',
    pl: 'Polski', ro: 'Română', ru: 'Русский', uk: 'Українська', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)',
    'pt-PT': 'Português (Portugal)', 'pt-BR': 'Português (Brasil)',
  };
  window.applianceLanguageField = (T) => ({
    name: 'language', selector: { select: {
      options: Object.keys(T).map((value) => ({ value, label: LANGUAGE_NAMES[value] || value })),
    } },
  });
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
  // Heure d'une date au format du profil HA (hass.locale.time_format : language / system / 12 / 24) ; extra = options Intl en plus (ex. weekday)
  window.applianceClock = (hass, date, locale, extra) => {
    const h = hass || document.querySelector('home-assistant')?.hass, tf = h && h.locale && h.locale.time_format;
    const o = { hour: '2-digit', minute: '2-digit', ...(extra || {}) };
    if (tf === '24') o.hourCycle = 'h23'; else if (tf === '12') o.hourCycle = 'h12';
    const l = tf === 'system' && typeof navigator !== 'undefined' && navigator.language ? navigator.language : locale;
    try { return (extra ? date.toLocaleString(l, o) : date.toLocaleTimeString(l, o)); } catch (e) { return date.toTimeString().slice(0, 5); }
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
  // prix du kWh (option price_per_kwh) : un nombre, ou une entité (capteur de tarif heures pleines / creuses) ; NaN si l'entité est absente ou indisponible
  window.appliancePrice = (hass, v) => {
    if (typeof v === 'string' && /^[a-z_]+\.[a-z0-9_]+$/.test(v.trim())) { const st = hass && hass.states && hass.states[v.trim()]; return st ? parseFloat(String(st.state).replace(',', '.')) : NaN; }
    return Number(v);
  };
  window.applianceChanged = (el, hass, cfg, ttl = 30000) => {
    const p = el._applianceSeen, now = Date.now();
    if (el && el.hasAttribute && el.hasAttribute('tiles-pos')) Promise.resolve().then(() => window.applianceTilePos && window.applianceTilePos(el)); // tiles_position : réapplique après un rendu
    if (!p || p.cfg !== cfg) el._applianceIds = [...idsOf(cfg)];
    const set = hass ? settings(hass) : '';
    const due = ttl > 0 && p && now - p.at >= ttl;
    const changed = !p || !hass || p.cfg !== cfg || due || p.set !== set || p.hass.entities !== hass.entities
      || el._applianceIds.some((i) => p.hass.states[i] !== hass.states[i]);
    if (changed && hass) el._applianceSeen = { hass, set, cfg, at: now };
    return changed;
  };
  // extra_tiles : liste { entity, name, icon } rendue comme tuiles supplémentaires à la suite des autres (même style, un clic
  // ouvre le more-info de l'entité, masquée si l'entité est absente ou indisponible). `card` fournit _more(id).
  window.applianceExtraTiles = (card, container, list, hass, cfg) => {
    if (!container) return;
    container.querySelectorAll('.tile.extra').forEach((el) => el.remove());
    if (!Array.isArray(list) || !hass) return;
    const loc = window.applianceLocale(cfg, hass);
    list.forEach((it) => {
      const item = typeof it === 'string' ? { entity: it } : it;
      const id = item && item.entity, st = id && hass.states[id];
      if (!st || /^(unavailable|unknown)$/i.test(String(st.state))) return;
      const a = st.attributes || {}, n = Number(st.state), unit = a.unit_of_measurement || '';
      const el = document.createElement('div'); el.className = 'tile extra'; el.dataset.eid = id; el.dataset.entity = id;
      const l = document.createElement('div'); l.className = 'l';
      const ic = item.icon || a.icon;
      if (ic) { const i = document.createElement('ha-icon'); i.setAttribute('icon', ic); l.appendChild(i); }
      const lbl = document.createElement('span'); lbl.className = 'lbl'; lbl.textContent = item.name || a.friendly_name || id; l.appendChild(lbl);
      const v = document.createElement('div'); v.className = 'v';
      if (unit && st.state !== '' && Number.isFinite(n)) {
        const small = document.createElement('small'); small.textContent = unit;
        v.replaceChildren(n.toLocaleString(loc, { maximumFractionDigits: 2 }), small);
      } else v.textContent = hass.formatEntityState ? hass.formatEntityState(st) : String(st.state);
      el.append(l, v);
      el.addEventListener('click', (ev) => { ev.stopPropagation(); if (card._more) card._more(id); else if (card._moreInfo) card._moreInfo(id); });
      container.appendChild(el);
    });
  };
  window.applianceWatts = (s) => {
    const v = window.applianceNum(s); if (isNaN(v)) return NaN;
    const u = String((s.attributes || {}).unit_of_measurement || '').trim();
    return /^kw$/i.test(u) ? v * 1000 : u === 'MW' ? v * 1e6 : v;
  };
  // Libellé d'éditeur : repli lisible tant que le dictionnaire editor-labels n'est pas encore chargé (déclenche son chargement).
  const human = (n) => { const t = String(n).replace(/^entity_/, '').replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
  if (!window.applianceEditorLabel) {
    window.applianceEditorLabel = (name) => {
      if (typeof window.applianceLoadChunk === 'function') window.applianceLoadChunk('editor-labels');
      return name ? human(name) : '';
    };
  }
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
      c: (v) => (ok(v) ? fromC(Number(v)) : v),
      d: (v) => (ok(v) && f ? Number(v) * 1.8 : v),
      toC: (v) => (ok(v) && f ? (v - 32) / 1.8 : v),
      range: (min, max) => ({ min: Math.floor(fromC(min)), max: Math.ceil(fromC(max)) }),
    };
  };
  window.applianceTempField = { name: 'temperature_unit', selector: { select: { mode: 'dropdown', options: [{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }] } } };
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
    if (root.querySelector('.top .illus')) return;
    const tiles = root.querySelector('.tiles, .stats'), box = tiles && tiles.parentElement;
    if (!box) return;
    if (!root.querySelector('style[data-actp]')) { const st = document.createElement('style'); st.dataset.actp = ''; st.textContent = TP_CSS; root.appendChild(st); }
    box.classList.add('ac-tp'); tiles.classList.add('ac-tl');
    const ill = [...box.children].find((n) => !n.matches('.head,.ac-tl') && (n.matches('svg,img') || n.querySelector('svg,img')));
    if (ill) ill.classList.add('ac-ill');
  };
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
  window.applianceIcon = (cfg, key, def) => { const v = cfg && cfg.icons && cfg.icons[key]; return typeof v === 'string' && /^[\w-]+:[\w-]+$/.test(v.trim()) ? v.trim() : def; };
  window.applianceMore = (el, id) => { if (id) el.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
  const escA = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  window.applianceTileAttrs = (id) => (id ? ` data-e="${escA(id)}" role="button" tabindex="0" style="cursor:pointer"` : '');
  window.applianceLinkTiles = (box, el) => {
    if (!box || box._applianceLinked) return;
    box._applianceLinked = true;
    const go = (e) => { const t = e.target.closest && e.target.closest('[data-e]'); if (t && box.contains(t)) { e.stopPropagation(); window.applianceMore(el, t.dataset.e); } };
    box.addEventListener('click', go);
    box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
  };
  const ACT = ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'];
  window.applianceActionFields = [...['tap_action', 'hold_action'].map((name) => ({ name, selector: { ui_action: { actions: ACT } } })), { name: 'confirm_action', selector: { boolean: {} } }, { name: 'confirm_text', selector: { text: {} } }];
  const dfltEntity = (c) => {
    if (!c) return '';
    if (typeof c.entity === 'string' && c.entity) return c.entity;
    const k = Object.keys(c).find((n) => /^entity_/.test(n) && typeof c[n] === 'string' && c[n]);
    return k ? c[k] : '';
  };
  window.applianceConf = (el, a) => {
    const c = el._c || el._config || {}, t = typeof a === 'string' ? a : a && a.action;
    if (a && typeof a === 'object' && a.confirmation) return a.confirmation;
    if (c.confirm_action === true && t && t !== 'none' && t !== 'more-info') return c.confirm_text ? { text: String(c.confirm_text) } : true;
    return undefined;
  };
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
    const dlg = document.createElement('dialog');
    dlg.setAttribute('role', 'alertdialog'); dlg.setAttribute('closedby', 'any');
    dlg.style.cssText = 'border:0;padding:0;margin:auto;background:transparent;max-width:none;max-height:none;overflow:visible;font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif)';
    if (!document.getElementById('ac-dlg-bd')) {
      const st = document.createElement('style'); st.id = 'ac-dlg-bd';
      st.textContent = 'dialog[role="alertdialog"]::backdrop{background:rgba(0,0,0,.5)}';
      document.head && document.head.appendChild(st);
    }
    const box = document.createElement('div');
    box.style.cssText = 'box-sizing:border-box;width:min(92vw,360px);padding:20px 22px 12px;border-radius:var(--ha-card-border-radius,12px);background:var(--card-background-color,#fff);color:var(--primary-text-color,#212121);box-shadow:0 8px 32px rgba(0,0,0,.4)';
    const msg = document.createElement('div'); msg.textContent = text; msg.style.cssText = 'font-size:16px;line-height:22px;margin-bottom:14px;white-space:pre-line';
    const row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:flex-end;gap:8px';
    const mk = (label, strong) => { const bt = document.createElement('button'); bt.type = 'button'; bt.textContent = label; bt.style.cssText = `border:0;background:none;cursor:pointer;padding:8px 12px;border-radius:8px;font:600 14px/20px inherit;color:var(--primary-color,#03a9f4)${strong ? ';background:color-mix(in srgb,var(--primary-color,#03a9f4) 14%,transparent)' : ''}`; return bt; };
    const no = mk(noTxt, false), ok = mk(okTxt, true);
    let settled = false;
    const finish = (go) => {
      if (settled) return; settled = true;
      dlg.remove();
      if (go) run();
    };
    const close = (go) => {
      if (typeof dlg.close === 'function' && dlg.open) { dlg.returnValue = go ? 'ok' : 'cancel'; dlg.close(go ? 'ok' : 'cancel'); }
      finish(go);
    };
    dlg.addEventListener('close', () => finish(dlg.returnValue === 'ok'));
    dlg.addEventListener('click', (ev) => {
      if (ev.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) close(false);
    });
    no.onclick = () => close(false); ok.onclick = () => close(true);
    row.append(no, ok); box.append(msg, row); dlg.append(box); document.body.appendChild(dlg);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    ok.focus();
  };
  window.applianceRunAction = (el, a0) => {
    const a = a0 && typeof a0 === 'object' && a0.confirmation ? { ...a0, confirmation: undefined } : a0;
    window.applianceConfirm(el, a0, () => window.applianceRunAction1(el, a));
  };
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
    if (type === 'toggle' && id && /^(select|input_select|number|input_number|sensor|counter|binary_sensor)\./.test(id)) { window.applianceMore(el, id); return; }
    if (type === 'toggle' && id) { window.applianceToggle(hass, id); return; }
    el.dispatchEvent(new CustomEvent('hass-action', { detail: { config: { entity: id, tap_action: typeof a === 'string' ? { action: a } : a }, action: 'tap' }, bubbles: true, composed: true }));
  };
  window.applianceBindIllus = (el, target, fallback) => {
    if (!target || target._applianceActions) return;
    target._applianceActions = true;
    const cfg = () => el._c || el._config || {};
    let timer, held = false;
    const stop = () => clearTimeout(timer);
    target.addEventListener('click', () => {
      if (held) { held = false; return; }
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
    // iOS ignore preventDefault sur « contextmenu » pour les images : sans ces propriétés (héritées), un appui long sur une photo ouvre le menu
    // Partager / Enregistrer / Copier par-dessus l'action tenir (hold_action)
    target.style.webkitTouchCallout = 'none'; target.style.webkitUserSelect = 'none'; target.style.userSelect = 'none';
  };
  window.applianceEsc = escA;
  window.applianceDefine = (tag, cls, meta) => {
    if (typeof customElements !== 'undefined' && !(window.__acHasReal ? window.__acHasReal(tag) : customElements.get(tag))) customElements.define(tag, cls);
    if (meta && typeof window !== 'undefined') {
      window.customCards = window.customCards || [];
      window.customCards.push({
        preview: true,
        documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
        ...meta,
        type: tag,
      });
    }
  };
  const BaseHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
  window.ApplianceStandaloneBase = class extends BaseHTMLElement {
    _ensureRoot() {
      if (!this._root) this._root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      return this._root;
    }
    _st(id) { return id && this._hass && this._hass.states ? this._hass.states[id] : undefined; }
    _ok(s) { return !!s && !/^(unavailable|unknown|none|)$/i.test(String(s.state)); }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _more(id) { window.applianceMore(this, id); }
    _lang(T) { return window.applianceLang(T, this._c || this._config, this._hass); }
    _loc(dates) { return window.applianceLocale(this._c || this._config, this._hass, dates); }
    getCardSize() { return 3; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  };
})();
