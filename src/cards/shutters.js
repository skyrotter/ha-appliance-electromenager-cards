/* Cartes « Volets » — volet roulant, store vénitien, volets battants
 * custom:appliance-roller-shutter-card, appliance-venetian-blind-card, appliance-swing-shutter-card.
 * Une entité cover donne l'état (open, closed, opening, closing) ; current_position (0 fermé → 100 ouvert)
 * et current_tilt_position (store vénitien) pilotent le dessin par des variables CSS (--p, --t) dont
 * les transformations sont animées. La vue extérieure passe en nuit quand sun.sun est sous l'horizon.
 * Boutons ouvrir / stop / fermer, curseurs de position et d'inclinaison, puissance du moteur.
 */
(() => {
  if (customElements.get('appliance-roller-shutter-card')) return;

  const T = /*@i18n shutter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sh-move:var(--appliance-heat-color,#ff8a3d);--sh-ok:var(--appliance-ok-color,#43a047);
  --sh-cold:var(--appliance-cold-color,#2b9af9);--sc:#d5dbe1;--p:0;--t:100;--sh-d:1.2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--sh-ok) 22%,transparent);color:var(--sh-ok)}
.partial .badge{background:color-mix(in srgb,var(--sh-cold) 22%,transparent);color:var(--sh-cold)}
.opening .badge,.closing .badge{background:color-mix(in srgb,var(--sh-move) 22%,transparent);color:var(--sh-move)}
.scene{position:relative;max-width:calc(250px * var(--illus-scale,1));margin:4px auto 0;cursor:pointer}
.scene>svg{display:block;width:100%;height:auto}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.rng{display:flex;align-items:center;gap:8px;margin:8px 2px 0;font-size:10px;color:var(--secondary-text-color)}
.rng.hide{display:none}
.rng span{min-width:56px}
.rng input{flex:1;accent-color:var(--sh-cold);margin:0;cursor:pointer}
.rng.tl input{accent-color:#c9a96b}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- commun : jour / nuit, voyant, flèche de mouvement ---- */
.day,.night{transition:opacity .8s}
.night{opacity:0}
.isnight .night{opacity:1}.isnight .day{opacity:0}
.led{fill:var(--sh-ok)}
.closed .led{fill:#db4437}
.opening .led,.closing .led{fill:var(--sh-move);animation:shblink .5s steps(2) infinite}
@keyframes shblink{50%{opacity:.25}}
.arrow{opacity:0;transition:opacity .3s}
.opening .arrow,.closing .arrow{opacity:1}
.arrow .dn{display:none}.closing .arrow .dn{display:inline}.closing .arrow .up{display:none}
.opening .arrow circle,.closing .arrow circle{animation:shpulse 1s ease-in-out infinite}
@keyframes shpulse{50%{opacity:.75}}
.beam{opacity:calc(var(--p) * .0022);transition:opacity var(--sh-d)}
.isnight .beam{opacity:0}
.unavailable .scene{filter:grayscale(.7) opacity(.7)}
.mv{transition:transform var(--sh-d) var(--sh-e,ease-in-out)}
.noanim .mv,.noanim .beam{transition:none}
.noanim .led,.noanim .arrow circle{animation:none}

/* ---- volet roulant : le tablier remonte dans le coffre ---- */
.tab{transform:translateY(calc(var(--p) * -1.12px))}
.slit{fill:#ffe9a8;opacity:.55}
.isnight .slit{opacity:0}

/* ---- store vénitien : les lamelles se tassent en haut, s'inclinent (--t, 100 = à plat) ---- */
.lift{transform-box:view-box;transform-origin:100px 42px;transform:scaleY(calc(1 - var(--p) * .0092))}
.rail{transform:translateY(calc(var(--p) * -.94px))}
.sl{transform-box:fill-box;transform-origin:center;transform:scaleY(calc(1 - var(--t) * .0085));transition:transform 1.2s ease-in-out}
.vb .beam{opacity:calc(max(var(--p), var(--t) * .7) * .0022)}
.isnight .vb .beam{opacity:0}

/* ---- volets battants : deux vantaux en 3D, pivot sur les gonds ---- */
.sw{perspective:520px;perspective-origin:50% 45%}
.leaf{position:absolute;top:22.1%;height:60.5%;width:20%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.leaf.l{left:30%;transform-origin:0 50%;transform:rotateY(calc(var(--p) * 1.72deg))}
.leaf.r{left:50%;transform-origin:100% 50%;transform:rotateY(calc(var(--p) * -1.72deg))}
.leaf .sh{opacity:calc(var(--p) * .004);transition:opacity var(--sh-d)}
`;

  // ciel et paysage vus par la fenêtre (x0..x1, y0..y1), en version jour et nuit
  const outside = (x0, y0, x1, y1, id) => {
    const w = x1 - x0, h = y1 - y0, cx = x0 + w * .78, cy = y0 + h * .26;
    const hills = (c1, c2) => `<path d="M${x0} ${y0 + h * .76} Q${x0 + w * .27} ${y0 + h * .58} ${x0 + w * .53} ${y0 + h * .72} T${x1} ${y0 + h * .65} V${y1} H${x0}Z" fill="${c1}"/>
      <path d="M${x0} ${y0 + h * .87} Q${x0 + w * .4} ${y0 + h * .74} ${x1} ${y0 + h * .85} V${y1} H${x0}Z" fill="${c2}"/>`;
    return `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#${id})">
      <g class="day"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyd)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .12}" fill="#ffe27a" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#ffd54a"/>${hills('#7fbf6a', '#5ea552')}</g>
      <g class="night"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyn)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#f4f1d0"/><circle cx="${cx + w * .03}" cy="${cy - h * .03}" r="${w * .062}" fill="#16234a"/>
        ${[[.2, .15], [.47, .09], [.63, .35], [.29, .4], [.12, .3]].map(([a, b]) => `<circle cx="${x0 + w * a}" cy="${y0 + h * b}" r="1" fill="#fff"/>`).join('')}${hills('#13233d', '#0e1b30')}</g>
    </g>`;
  };
  const DEFS = `<defs>
    <linearGradient id="shskyd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d7f0ff"/></linearGradient>
    <linearGradient id="shskyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset="1" stop-color="#1b2a55"/></linearGradient>
    <linearGradient id="shalu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f7f9"/><stop offset="1" stop-color="#bfc6cd"/></linearGradient>
    <linearGradient id="shrelief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  </defs>`;
  const ARROW = (x, y) => `<g class="arrow" transform="translate(${x} ${y})"><circle r="9" fill="#ff8a3d"/>
    <path class="up" d="M-4 2 L0 -3 L4 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="dn" d="M-4 -2 L0 3 L4 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;

  const X0 = 34, X1 = 166, Y0 = 36, Y1 = 146, W = X1 - X0, H = Y1 - Y0;
  const SVGS = {
    // tablier de lames alu (couleur --sc) qui remonte dans le coffre
    roller_shutter: () => {
      let sl = '';
      for (let y = Y0 - 2; y < Y1; y += 7) {
        sl += `<rect x="${X0}" y="${y}" width="${W}" height="7" fill="var(--sc)"/><rect x="${X0}" y="${y}" width="${W}" height="7" fill="url(#shrelief)"/>
          <line x1="${X0}" x2="${X1}" y1="${y + 6.5}" y2="${y + 6.5}" stroke="#00000055" stroke-width=".8"/>`;
        for (let x = X0 + 6; x < X1 - 4; x += 9) sl += `<rect class="slit" x="${x}" y="${y + 5.6}" width="4" height=".9"/>`;
      }
      return `<rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwr')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <g clip-path="url(#shwr)"><g class="tab mv">${sl}${ARROW(100, Y1 - 12)}</g></g>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0 - 6}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/><rect x="${X1}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/>
        <rect x="${X0 - 8}" y="18" width="${W + 16}" height="20" rx="3" fill="url(#shalu)"/><rect x="${X0 - 8}" y="35" width="${W + 16}" height="3" fill="#8d959d"/>
        <circle class="led" cx="${X1 + 2}" cy="28" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/>`;
    },
    // lamelles (couleur --sc) qui se tassent sous le caisson et pivotent sur elles-mêmes
    venetian_blind: () => {
      let sl = '';
      for (let y = Y0 + 8; y < Y1 - 4; y += 7) sl += `<g class="sl"><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="var(--sc)"/><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="url(#shrelief)"/></g>`;
      const cords = [64, 136].map((x) => `<line x1="${x}" y1="${Y0 + 4}" x2="${x}" y2="${Y1 - 4}" stroke="#00000035" stroke-width=".8"/>`).join('');
      return `<g class="vb"><rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwv')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <g class="lift mv">${cords}${sl}</g>
        <g class="rail mv"><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="var(--sc)"/><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="#000" opacity=".25"/>${ARROW(100, Y1 - 16)}</g>
        <rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="var(--sc)"/><rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="url(#shrelief)"/>
        <circle class="led" cx="${X1}" cy="${Y0}" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/></g>`;
    },
    // façade et fenêtre ; les deux vantaux sont des calques 3D posés par-dessus (voir LEAF)
    swing_shutter: () => `<rect x="6" y="14" width="188" height="146" rx="4" fill="#d8cbb5"/>${outside(62, 40, 138, 142, 'shws')}
        <line x1="100" y1="40" x2="100" y2="142" stroke="#f3eee6" stroke-width="3"/><rect x="62" y="40" width="76" height="102" fill="none" stroke="#f3eee6" stroke-width="3"/>
        <rect x="52" y="143" width="96" height="6" rx="2" fill="#efe9df"/>
        <circle class="led" cx="100" cy="26" r="2.2"/>${ARROW(100, 92)}`,
  };
  // un vantail à persiennes (couleur --sc), dessiné dans un rectangle 40 × 104
  const LEAF = (right) => {
    let lv = '';
    for (let y = 8; y < 100; y += 5.4) lv += `<line x1="4" y1="${y.toFixed(1)}" x2="36" y2="${(y + 2).toFixed(1)}" stroke="#00000048" stroke-width="1.3"/>`;
    const hx = right ? 36 : 0;
    return `<svg viewBox="0 0 40 104" preserveAspectRatio="none"><rect width="40" height="104" fill="var(--sc)"/>${lv}
      <rect x="1" y="1" width="38" height="102" fill="none" stroke="#00000055" stroke-width="2"/><rect x="2" y="48" width="36" height="4" fill="#00000030"/>
      <rect x="${hx}" y="14" width="4" height="4" fill="#30343a"/><rect x="${hx}" y="86" width="4" height="4" fill="#30343a"/>
      <rect class="sh" width="40" height="104" fill="#000"/></svg>`;
  };

  // couleur du tablier / des lamelles / des vantaux par défaut, et motifs de nom pour l'éditeur
  const KINDS = {
    roller_shutter: { color: '#d5dbe1', re: /volet|shutter|roll|rollo|store/i, icon: 'mdi:window-shutter' },
    venetian_blind: { color: '#ece2cf', re: /venitien|vénitien|venetian|blind|jalousie|lamel|store/i, icon: 'mdi:blinds-horizontal' },
    swing_shutter: { color: '#4f7d5c', re: /volet|shutter|battant|persienne|swing/i, icon: 'mdi:window-shutter-open' },
  };
  const TILES = [['position', 'mdi:arrow-expand-vertical', 'show_position'], ['tilt', 'mdi:rotate-3d-variant', 'show_tilt'],
    ['power', 'mdi:flash', 'show_power'], ['since', 'mdi:history', 'show_since']];

  class ApplianceShutterCard extends HTMLElement {
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_position: true, show_tilt: true, show_power: true, show_since: true,
        sun_entity: 'sun.sun', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _watts(id) { const v = this._num(id); return /^kw$/i.test(this._unit(id, 'W')) ? v * 1000 : v; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      // durée courte (« 12 min », « 3 h ») : la tuile s'appelle déjà « Depuis » ; « maintenant » sous 45 s
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const swing = this.kind === 'swing_shutter';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        <div class="scene${swing ? ' sw' : ''}"><svg viewBox="0 0 200 172" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${SVGS[this.kind]()}</svg>
          ${swing ? `<div class="leaf l mv">${LEAF(false)}</div><div class="leaf r mv">${LEAF(true)}</div>` : ''}</div>
        <div class="rng ps" id="shpos"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="rng tl" id="shtilt"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="ctl" id="shctl">
          <button data-a="open"><ha-icon icon="mdi:arrow-up"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="mdi:arrow-down"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('.scene').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => {
        if (this._hass && this._c.entity) this._hass.callService('cover', `${b.dataset.a}_cover`, { entity_id: this._c.entity });
      }));
      root.querySelector('#shpos input').addEventListener('change', (e) => {
        if (this._hass) this._hass.callService('cover', 'set_cover_position', { entity_id: this._c.entity, position: this._c.invert ? 100 - Number(e.target.value) : Number(e.target.value) });
      });
      root.querySelector('#shtilt input').addEventListener('change', (e) => {
        if (this._hass) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: Number(e.target.value) });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more(k === 'power' ? this._c.entity_power : this._c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._pos = null;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      let st = 'unavailable', pos = NaN, tilt = NaN;
      // unknown : HA ne connaît pas l'état (ex. après redémarrage), mais la cover reste pilotable
      if (s && /^unknown$/i.test(String(s.state))) {
        st = 'unknown';
      } else if (s && !/^(unavailable|unknown)$/i.test(String(s.state))) {
        const v = String(s.state).toLowerCase(), a = s.attributes || {};
        st = ['open', 'closed', 'opening', 'closing'].includes(v) ? v : /^(on|true|1)$/.test(v) ? 'open' : 'closed';
        if (a.current_position != null && isFinite(Number(a.current_position))) pos = Math.max(0, Math.min(100, Number(a.current_position)));
        if (a.current_tilt_position != null && isFinite(Number(a.current_tilt_position))) tilt = Math.max(0, Math.min(100, Number(a.current_tilt_position)));
      }
      const known = !isNaN(pos); // position réelle fournie par la cover
      // invert : cover qui remonte sa position à l'envers (fréquent avec Tuya), 0 = ouvert et 100 = fermé.
      // L'état HA en découle et est donc faux lui aussi : on le recalcule depuis la position corrigée.
      if (c.invert && st !== 'unavailable' && st !== 'unknown') {
        if (st === 'opening' || st === 'closing') st = st === 'opening' ? 'closing' : 'opening';
        else if (known) st = 'open';
        else st = st === 'open' ? 'closed' : 'open';
        if (known) pos = 100 - pos;
      }
      if (!known) pos = st === 'open' || st === 'opening' ? 100 : 0;
      else if (st === 'open' && pos < 100) st = pos > 0 ? 'partial' : 'closed';
      return { st, pos, known, tilt, s };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pos, known, tilt, s } = this._compute();
      const sun = this._st(c.sun_entity), night = !!sun && sun.state === 'below_horizon';
      card.className = `${st}${night ? ' isnight' : ''}${c.animations === false ? ' noanim' : ''}`;

      // course : durée proportionnelle à l'écart si travel_time est donné, sinon 1,2 s
      if (pos !== this._pos) {
        const tt = Number(c.travel_time);
        const dur = this._pos == null ? 0 : tt > 0 ? Math.abs(pos - this._pos) / 100 * tt : 1.2;
        card.style.setProperty('--sh-d', `${dur.toFixed(2)}s`);
        // avec un temps de course, la cover envoie sa position par paliers : mouvement linéaire pour enchaîner sans à-coups
        card.style.setProperty('--sh-e', tt > 0 ? 'linear' : 'ease-in-out');
        this._pos = pos;
      }
      card.style.setProperty('--p', String(pos));
      card.style.setProperty('--t', String(isNaN(tilt) ? (st === 'closed' ? 0 : 100) : tilt));
      card.style.setProperty('--sc', /^[#a-z0-9(),.\s%]+$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : KINDS[this.kind].color);

      const name = c.name || this._t(this.kind);
      r.getElementById('shtitle').textContent = name;
      const badge = r.getElementById('shbadge');
      const moving = st === 'opening' || st === 'closing';
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : moving && known ? `${this._t(st)}… ${Math.round(pos)} %` : this._t(st);
      badge.style.display = c.show_status === false || st === 'unknown' ? 'none' : '';

      // commandes et curseurs selon ce que la cover sait faire (supported_features)
      const isCover = (c.entity || '').startsWith('cover.');
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || !!(sf & bit);
      const ctl = r.getElementById('shctl');
      ctl.classList.toggle('hide', c.show_controls === false || !isCover);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'stop' && !has(8));
        b.disabled = st === 'unavailable' || (a === 'open' && (st === 'open' || st === 'opening')) || (a === 'close' && (st === 'closed' || st === 'closing'));
      });
      const rng = (id, show, label, val) => {
        const el = r.getElementById(id), inp = el.querySelector('input');
        el.classList.toggle('hide', !show);
        el.querySelector('span').textContent = label;
        if (this._root.activeElement !== inp) inp.value = String(Math.round(val));
      };
      rng('shpos', isCover && known && has(4) && c.show_slider !== false && st !== 'unavailable', this._l('position'), pos);
      rng('shtilt', isCover && this.kind === 'venetian_blind' && !isNaN(tilt) && has(128) && c.show_slider !== false && st !== 'unavailable', this._l('tilt'), tilt);

      const pw = this._watts(c.entity_power);
      const V = {
        position: [known && st !== 'unavailable', this._fmt(pos, 0), '%'],
        tilt: [this.kind === 'venetian_blind' && !isNaN(tilt), this._fmt(tilt, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), isNaN(pw) ? '' : 'W'],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceShutterCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          this._c = e.detail.value;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity', 'cover'), ent('entity_power', 'sensor'), ent('sun_entity', 'sun'),
        { type: 'grid', name: '', schema: [
          { name: 'color', selector: { text: {} } },
          { name: 'travel_time', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
        ] },
        bool('invert', false),
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_position'),
          ...(this.kind === 'venetian_blind' ? [bool('show_tilt')] : []), bool('show_power'), bool('show_since'), bool('animations'),
        ] },
      ];
      // « color » a le libellé « couleur de la lumière » pour les lampes : ici, couleur du volet
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'color' ? 'shutter_color' : s.name === 'invert' ? 'invert_position' : s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace(/_/g, '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceShutterCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        return { entity: ids.find((i) => i.startsWith('cover.') && K.re.test(i)) || ids.find((i) => i.startsWith('cover.')) || '' };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceShutterCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, preview: true,
      description: `${T.fr[kind]} animé : position, inclinaison, mouvement et vue jour / nuit.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
