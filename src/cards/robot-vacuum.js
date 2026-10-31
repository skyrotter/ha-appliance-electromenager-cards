/* ================================================================== */
/* appliance-robot-vacuum-card.js                                   */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-robot-vacuum-card — robot aspirateur + station de vidage, animé, avec commandes
 * type: custom:appliance-robot-vacuum-card
 */
const I18N_VAC = /*@i18n robot_vacuum*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
const ICONS_VAC = {
  start: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
  dock: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/>',
};

// Logique commune (états, services, stats) — le dessin est dans la carte « seule » ci-dessous
class ApplianceRobotVacuumCard extends HTMLElement {
  static getStubConfig(hass) { return { entity: Object.keys((hass && hass.states) || {}).find((i) => i.startsWith('vacuum.')) || '' }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'vacuum' } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_battery', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_area', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_time', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_status', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_filter', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_brush', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_battery', selector: { boolean: {} }, default: true },
          { name: 'show_area', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_fan', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_consumables', selector: { boolean: {} }, default: true },
          { name: 'show_buttons', selector: { boolean: {} }, default: true },
        ] },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'compact'] } } },
        { name: 'image', selector: { text: {} } },
        { name: 'language', selector: { select: { options: Object.keys(I18N_VAC) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    if (!config.entity) throw new Error('entity (vacuum.xxx) requise');
    this._config = { show_battery: true, show_area: true, show_time: true, show_fan: true, show_status: true,
      show_consumables: true, show_buttons: true, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return this._config && this._config.layout === 'compact' ? 3 : 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_VAC[this._config.language || lang(this._hass)] || I18N_VAC.en)[k] ?? I18N_VAC.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _call(action) {
    if (!this._hass) return;
    const svc = { start: 'start', pause: 'pause', dock: 'return_to_base' }[action];
    this._hass.callService('vacuum', svc, { entity_id: this._config.entity });
  }

  _st(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) {
    const s = this._st(id); if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot, e = this._st(c.entity);
    if (!e) return;
    const a = e.attributes || {};
    const status = String((this._st(c.entity_status) || {}).state || a.status || '').toLowerCase();
    let st = ['cleaning', 'docked', 'returning', 'paused', 'idle', 'error'].includes(e.state) ? e.state : 'idle';
    if (st === 'docked' && /charg/.test(status)) st = 'charging';
    const emptying = /empt|vidage|evacu|self.?clean/.test(status);

    const svg = r.getElementById('svg');
    const prev = this._lastSt;
    svg.setAttribute('class', `${st}${emptying ? ' emptying' : ''}${st === 'charging' ? ' docked' : ''}`);
    r.getElementById('card').classList.toggle('error', st === 'error');
    r.getElementById('err').textContent = st === 'error' ? (a.error || this._t('error')) : '';
    this._lastSt = st;

    // Boutons : met en évidence l'action correspondant à l'état
    const active = { cleaning: 'start', paused: 'pause', returning: 'dock', docked: 'dock', charging: 'dock' }[st];
    r.querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', b.dataset.a === active));
    r.getElementById('btns').style.display = c.show_buttons ? '' : 'none';

    const batt = this._num(c.entity_battery) ?? (a.battery_level ?? null);
    const area = this._num(c.entity_area), time = this._num(c.entity_time);
    const it = [], compact = c.layout === 'compact';
    if (compact) {
      r.getElementById('card').dataset.st = st;
      r.getElementById('cst').textContent = this._t(emptying ? 'emptying' : st);
    }
    if (c.show_battery) it.push([this._l('battery'), batt === null ? '—' : `${Math.round(batt)} %`, c.entity_battery || c.entity]);
    if (c.show_status && !compact) it.push([this._l('status'), this._t(emptying ? 'emptying' : st), c.entity_status || c.entity]);
    if (c.show_area) it.push([this._l('area'), area === null ? '—' : `${Math.round(area)} m²`, c.entity_area]);
    if (c.show_time) it.push([this._l('time'), time === null ? '—' : `${Math.round(time)} min`, c.entity_time]);
    if (c.show_fan && a.fan_speed) it.push([this._l('fan'), String(a.fan_speed), c.entity]);
    if (c.show_consumables) {
      const fl = this._num(c.entity_filter), br = this._num(c.entity_brush);
      if (fl !== null) it.push([this._l('filter'), `${Math.round(fl)} %`, c.entity_filter]);
      if (br !== null) it.push([this._l('brush'), `${Math.round(br)} %`, c.entity_brush]);
    }
    const stats = r.getElementById('stats');
    window.applianceLinkTiles(stats, this);
    if (compact) { stats.innerHTML = it.map(([l, v, id]) => `<div class="tile"${window.applianceTileAttrs(id)}><span class="val">${esc(v)}</span><span class="lbl">${esc(l)}</span></div>`).join(''); return; }
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
window.customCards = window.customCards || [];

/* ───────────────────────────────────────────────────────────────
 * Variante « robot seul » : pas de fond, pas de station, animation sur place
 * type: custom:appliance-robot-vacuum-solo-card  (mêmes options que la carte complète)
 * ─────────────────────────────────────────────────────────────── */
const COMMON_CSS_VAC = `
  :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
  ha-card { padding:12px; overflow:hidden; }
  .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; }
  .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
  .error .badge { display:inline-block; }
  svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
  .btns { display:flex; gap:8px; margin-top:8px; }
  .btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:none; cursor:pointer; border-radius:999px; padding:8px 6px;
    background:var(--secondary-background-color, rgba(127,127,127,.15)); color:var(--primary-text-color,#222); font:600 .85em system-ui,sans-serif; transition:transform .1s, background .2s; }
  .btn:active { transform:scale(.95); } .btn svg { width:18px; height:18px; fill:currentColor; }
  .btn.on { background:var(--primary-color,#03a9f4); color:#fff; }
  .stats { display:grid; gap:8px; margin-top:8px; }
  .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
  .stat .v { font-weight:700; font-size:1.02em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
  @keyframes blink { 50% { opacity:.3 } } @keyframes breathe { 50% { opacity:.4 } }
  /* format compact : vignette à gauche, nom + état, tuiles, boutons dessous */
  .compact { padding:14px; }
  .compact .top { display:grid; grid-template-columns:auto minmax(0,1fr); grid-template-areas:"illus head" "illus stats"; column-gap:14px; row-gap:10px; align-items:start; }
  .compact .illus { grid-area:illus; width:var(--appliance-illustration-size,116px); aspect-ratio:120/140; border-radius:16px; padding:4px; box-sizing:content-box;
    display:flex; align-items:center; background:radial-gradient(circle at 50% 40%, rgba(127,127,127,.10), rgba(127,127,127,.03) 70%); }
  .compact .illus svg { width:100%; height:auto; }
  .compact .head { grid-area:head; display:flex; flex-direction:column; gap:3px; min-width:0; }
  .compact .name { font-size:16px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .status { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--secondary-text-color); }
  .compact .dot { width:8px; height:8px; border-radius:50%; flex:none; background:var(--disabled-text-color,#9e9e9e); }
  .compact[data-st=cleaning] .dot, .compact[data-st=mowing] .dot { background:var(--appliance-ok-color,#43a047); box-shadow:0 0 0 3px rgba(67,160,71,.25); }
  .compact[data-st=cleaning] .status, .compact[data-st=mowing] .status { color:var(--primary-text-color); }
  .compact[data-st=returning] .dot { background:#3fa9ff; } .compact[data-st=paused] .dot { background:#ffb300; } .compact[data-st=error] .dot { background:#e53935; }
  .compact .badge { align-self:flex-start; }
  .compact .stats { grid-area:stats; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; margin-top:0; }
  .compact .tile { display:flex; flex-direction:column; padding:6px 9px; border-radius:10px; min-width:0; background:rgba(127,127,127,.09); }
  .compact .val { font-size:14px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .lbl { font-size:11px; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .btns { margin-top:10px; } .compact .btn { border-radius:10px; }
  /* image perso (option image) : atténuée à l'arrêt, nette en marche */
  .uimg { transition:opacity .4s, filter .4s; opacity:.8; }
  .cleaning .uimg, .mowing .uimg, .returning .uimg { opacity:1; }
  .error .uimg { filter:drop-shadow(0 0 4px #e53935); }`;

class ApplianceRobotVacuumSoloCard extends ApplianceRobotVacuumCard {
  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const brush = (x) => `<g transform="translate(${x} 113)"><g class="brush">
      ${[0, 120, 240].map((a) => `<line x1="0" y1="0" x2="17" y2="0" transform="rotate(${a}) scale(1 .35)" stroke="#6b7178" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
      <circle r="3" fill="#30343a"/></g></g>`;
    const dust = Array.from({ length: 12 }, (_, i) =>
      `<circle class="dust" cx="${70 + (i * 37) % 100}" cy="${132 + (i % 3) * 3}" r="${1.2 + (i % 3) * .5}" style="animation-delay:${(i * .17) % 1.4}s"/>`).join('');
    const compact = this._config.layout === 'compact', img = String(this._config.image || '').trim();
    // option image : la photo de l'utilisateur remplace le dessin (mêmes classes d'état pour l'atténuer à l'arrêt)
    const art = img ? `<svg viewBox="${compact ? '0 0 120 140' : '0 0 240 142'}" id="svg"><image class="uimg" href="${esc(img)}" width="${compact ? 120 : 240}" height="${compact ? 140 : 142}" preserveAspectRatio="xMidYMid meet"/></svg>` : `
      <svg viewBox="${compact ? '28 4 196 136' : '0 0 240 142'}" id="svg">
        <defs>
          <linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d8dd"/></linearGradient>
          <linearGradient id="side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9bfc5"/><stop offset="1" stop-color="#868d94"/></linearGradient>
        </defs>
        ${dust}
        <g class="bot">
          <ellipse cx="120" cy="122" rx="96" ry="11" fill="rgba(0,0,0,.25)"/>
          ${brush(64)}${brush(176)}
          <path d="M30 78 V96 Q30 120 120 120 Q210 120 210 96 V78 Z" fill="url(#side)"/>
          <path d="M34 92 Q40 116 120 117 Q200 116 206 92 V100 Q200 121 120 121 Q40 121 34 100 Z" fill="#2b2f35"/>
          <ellipse cx="120" cy="78" rx="90" ry="30" fill="url(#top)"/>
          <ellipse class="track" cx="120" cy="80" rx="74" ry="23"/>
          <ellipse class="ring" id="ring" cx="120" cy="80" rx="74" ry="23" pathLength="100" stroke-dasharray="0 100" transform="rotate(180 120 80)"/>
          <circle cx="104" cy="94" r="3.5" fill="#cfd4d9" stroke="#b5bbc1"/><circle cx="136" cy="94" r="3.5" fill="#cfd4d9" stroke="#b5bbc1"/>
          <rect x="102" y="54" width="36" height="18" rx="9" fill="#2b2f35"/>
          <ellipse cx="120" cy="55" rx="18" ry="5.5" fill="#4a4f56"/>
          <rect x="108" y="62" width="24" height="4" rx="2" fill="#111"/>
          <rect class="scan" x="108" y="62" width="6" height="4" rx="2"/>
        </g>
        <path class="ico bolt" d="M206 8 l-10 16 h7 l-3 13 l11 -17 h-7 z" fill="#ffd43b"/>
        <path class="ico home" d="M206 10 l-12 11 h4 v10 h6 v-7 h4 v7 h6 v-10 h4 z" fill="#3fa9ff"/>
        <path class="ico pz" d="M198 12 h5 v18 h-5z M208 12 h5 v18 h-5z" fill="#ffb300"/>
      </svg>`;
    const btns = `<div class="btns" id="btns">${['start', 'pause', 'dock'].map((a) => `<button class="btn" data-a="${a}"><svg viewBox="0 0 24 24">${ICONS_VAC[a]}</svg>${this._t(a)}</button>`).join('')}</div>`;
    this.shadowRoot.innerHTML = `
    <style>${COMMON_CSS_VAC}
      .bot { transform-origin:120px 100px; }
      .cleaning .bot { animation:wiggle 2.4s ease-in-out infinite; }
      .returning .bot { animation:wiggle 1.6s ease-in-out infinite; }
      .error .bot { animation:shake .4s ease-in-out infinite; }
      .brush { transform:rotate(0); } .cleaning .brush { animation:spin .3s linear infinite; } .returning .brush { animation:spin 1s linear infinite; }
      .dust { fill:#9a9a9a; opacity:0; } .cleaning .dust { animation:suck 1.4s ease-in infinite; }
      .scan { fill:#7fe0ff; opacity:.0; } .cleaning .scan, .returning .scan { opacity:.9; animation:scan 1.2s linear infinite; }
      .track { fill:none; stroke:rgba(0,0,0,.12); stroke-width:3.5; }
      .ring { fill:none; stroke:var(--rc,#43a047); stroke-width:3.5; stroke-linecap:round; transition:stroke-dasharray 1s ease, stroke .6s;
        filter:drop-shadow(0 0 3px var(--rc,#43a047)); }
      .charging .ring, .docked .ring { animation:breathe 2.4s ease-in-out infinite; }
      .paused .ring { stroke:#ffb300; animation:blink 1s infinite; } .error .ring { stroke:#ff3b30; animation:blink .5s infinite; }
      .ico { opacity:0; transition:opacity .4s; }
      .charging .bolt, .docked .bolt { opacity:1; animation:breathe 1.6s ease-in-out infinite; }
      .returning .home { opacity:1; animation:hop 1s ease-in-out infinite; }
      .paused .pz { opacity:1; }
      @keyframes wiggle { 0%,100% { transform:translateX(0) rotate(0) } 25% { transform:translateX(-6px) rotate(-1.5deg) } 75% { transform:translateX(6px) rotate(1.5deg) } }
      @keyframes shake { 0%,100% { transform:rotate(0) } 25% { transform:rotate(-2deg) } 75% { transform:rotate(2deg) } }
      @keyframes spin { to { transform:rotate(360deg) } }
      @keyframes suck { 0% { opacity:0; transform:translateY(0) } 30% { opacity:.9 } 100% { opacity:0; transform:translateY(-20px) scale(.4) } }
      @keyframes scan { from { transform:translateX(0) } to { transform:translateX(18px) } }
      @keyframes hop { 50% { transform:translateY(-4px) } }
    </style>
    <ha-card id="card"${compact ? ' class="compact"' : ''}>${compact ? `
      <div class="top"><div class="illus">${art}</div>
        <div class="head"><div class="name">${esc(this._config.name || this._t('name'))}</div>
          <div class="status"><span class="dot"></span><span id="cst"></span></div><span class="badge" id="err"></span></div>
        <div class="stats" id="stats"></div></div>${btns}` : `
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge" id="err"></span></div>
      ${art}${btns}
      <div class="stats" id="stats"></div>`}
    </ha-card>`;
    this.shadowRoot.querySelectorAll('.btn').forEach((b) => { b.onclick = () => this._call(b.dataset.a); });
    this._built = true;
  }

  _update() {
    super._update();
    if (!this._built || !this._hass) return;
    const e = this._st(this._config.entity); if (!e) return;
    // Anneau lumineux = niveau de batterie
    const b = this._num(this._config.entity_battery) ?? (e.attributes.battery_level ?? null);
    const pct = b === null ? 100 : Math.max(0, Math.min(100, b));
    const ring = this.shadowRoot.getElementById('ring');
    if (!ring) return; // image perso : pas d'anneau de batterie
    ring.setAttribute('stroke-dasharray', `${pct} 100`);
    this.shadowRoot.getElementById('svg').style.setProperty('--rc', pct < 20 ? '#e53935' : pct < 50 ? '#fb8c00' : '#43a047');
  }
}
define('appliance-robot-vacuum-solo-card', ApplianceRobotVacuumSoloCard);
window.customCards.push({ type: 'appliance-robot-vacuum-solo-card', name: 'Appliance – Robot vacuum (solo) / Robot aspirateur (seul)', description: 'Robot aspirateur seul (sans fond ni station), animé, avec commandes', preview: true });
})();
