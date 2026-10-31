/* ================================================================== */
/* appliance-robot-mower-card.js                                    */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-robot-mower-card — robot tondeuse + station sur bande de pelouse, animé, avec commandes
 * type: custom:appliance-robot-mower-card
 * Compatible lawn_mower.* (recommandé) et vacuum.* (certaines intégrations de tondeuses)
 */
const I18N_MOW = /*@i18n robot_mower*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
const ICONS_MOW = {
  start: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
  dock: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/>',
};

// Logique commune (états, services, stats) — le dessin est dans la carte « seule » ci-dessous
class ApplianceRobotMowerCard extends HTMLElement {
  static getStubConfig(hass) { return { entity: Object.keys((hass && hass.states) || {}).find((i) => i.startsWith('lawn_mower.')) || '' }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['lawn_mower', 'vacuum'] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_battery', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_area', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_time', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_next_start', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_blade', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_rain', selector: { entity: { domain: ['binary_sensor', 'sensor'] } } },
        { name: 'entity_status', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_battery', selector: { boolean: {} }, default: true },
          { name: 'show_area', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_next', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_blade', selector: { boolean: {} }, default: true },
          { name: 'show_buttons', selector: { boolean: {} }, default: true },
        ] },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'compact'] } } },
        { name: 'image', selector: { text: {} } },
        { name: 'language', selector: { select: { options: Object.keys(I18N_MOW) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    if (!config.entity) throw new Error('entity (lawn_mower.xxx) requise');
    this._config = { show_battery: true, show_area: true, show_time: true, show_next: true, show_status: true,
      show_blade: true, show_buttons: true, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return this._config && this._config.layout === 'compact' ? 3 : 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_MOW[this._config.language || lang(this._hass)] || I18N_MOW.en)[k] ?? I18N_MOW.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _call(action) {
    if (!this._hass) return;
    const domain = this._config.entity.split('.')[0];
    const map = domain === 'vacuum'
      ? { start: 'start', pause: 'pause', dock: 'return_to_base' }
      : { start: 'start_mowing', pause: 'pause', dock: 'dock' };
    this._hass.callService(domain, map[action], { entity_id: this._config.entity });
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
    let st = e.state === 'cleaning' ? 'mowing' : e.state;
    if (!['mowing', 'docked', 'returning', 'paused', 'idle', 'error'].includes(st)) st = 'idle';
    if (st === 'docked' && /charg/.test(status)) st = 'charging';
    const rainS = this._st(c.entity_rain);
    const raining = !!rainS && (rainS.state === 'on' || /rain|pluie|wet/i.test(rainS.state));

    r.getElementById('svg').setAttribute('class', `${st}${st === 'charging' ? ' docked' : ''}${raining ? ' raining' : ''}`);
    r.getElementById('card').classList.toggle('error', st === 'error');
    r.getElementById('err').textContent = st === 'error' ? (a.error || this._t('error')) : '';

    const active = { mowing: 'start', paused: 'pause', returning: 'dock', docked: 'dock', charging: 'dock' }[st];
    r.querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', b.dataset.a === active));
    r.getElementById('btns').style.display = c.show_buttons ? '' : 'none';

    const batt = this._num(c.entity_battery) ?? (a.battery_level ?? null);
    const area = this._num(c.entity_area), time = this._num(c.entity_time), blade = this._num(c.entity_blade);
    // Prochain départ : timestamp → "ven. 14:30", sinon texte brut
    let next = null; const ns = this._st(c.entity_next_start);
    if (ns && !['unavailable', 'unknown'].includes(ns.state)) {
      const d = new Date(ns.state);
      next = isNaN(d) ? ns.state : d.toLocaleString(c.language === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    const it = [], compact = c.layout === 'compact';
    const stTxt = raining && st !== 'mowing' ? `${this._t(st)} · ${this._t('rain')}` : this._t(st);
    if (compact) { r.getElementById('card').dataset.st = st; r.getElementById('cst').textContent = stTxt; }
    if (c.show_battery) it.push([this._l('battery'), batt === null ? '—' : `${Math.round(batt)} %`, c.entity_battery || c.entity]);
    if (c.show_status && !compact) it.push([this._l('status'), stTxt, c.entity_status || c.entity]);
    if (c.show_area && area !== null) it.push([this._l('area'), `${Math.round(area)} m²`, c.entity_area]);
    if (c.show_time && time !== null) it.push([this._l('time'), time >= 60 ? `${Math.floor(time / 60)}h${String(Math.round(time % 60)).padStart(2, '0')}` : `${Math.round(time)} min`, c.entity_time]);
    if (c.show_next && next) it.push([this._l('next'), next, c.entity_next_start]);
    if (c.show_blade && blade !== null) it.push([this._l('blade'), `${Math.round(blade)} %`, c.entity_blade]);
    const stats = r.getElementById('stats');
    window.applianceLinkTiles(stats, this);
    if (compact) { stats.innerHTML = it.map(([l, v, id]) => `<div class="tile"${window.applianceTileAttrs(id)}><span class="val">${esc(v)}</span><span class="lbl">${esc(l)}</span></div>`).join(''); return; }
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
window.customCards = window.customCards || [];

/* ───────────────────────────────────────────────────────────────
 * Variante « tondeuse seule » : pas de fond, pas de station, pas de pelouse
 * type: custom:appliance-robot-mower-solo-card  (mêmes options que la carte complète)
 * ─────────────────────────────────────────────────────────────── */
class ApplianceRobotMowerSoloCard extends ApplianceRobotMowerCard {
  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const wheel = (x, y, rr) => `<g transform="translate(${x} ${y})"><circle r="${rr}" fill="#1b1b1b"/>
      <g class="spin">${[0, 45, 90, 135].map((a) => `<rect x="${-rr}" y="-.7" width="${rr * 2}" height="1.4" fill="#2e2e2e" transform="rotate(${a})"/>`).join('')}
      <circle r="${rr * .55}" fill="#8d959c"/><path d="M${-rr * .55} 0 H${rr * .55} M0 ${-rr * .55} V${rr * .55}" stroke="#4a4f55" stroke-width="1.2"/></g></g>`;
    const clips = Array.from({ length: 10 }, (_, i) =>
      `<path class="clip" d="M${36 + (i % 4) * 2} ${-3 - (i % 3) * 2} l2 -3" stroke="${i % 2 ? '#6cc457' : '#3f9d35'}" style="animation-delay:${i * .11}s"/>`).join('');
    const rain = Array.from({ length: 18 }, (_, i) =>
      `<line class="drop" x1="${14 + (i * 13) % 212}" y1="${-10 - (i * 9) % 30}" x2="${12 + (i * 13) % 212}" y2="${-2 - (i * 9) % 30}" style="animation-delay:${(i * .13) % 1}s"/>`).join('');
    const compact = this._config.layout === 'compact', img = String(this._config.image || '').trim();
    // option image : la photo de l'utilisateur remplace le dessin (mêmes classes d'état pour l'atténuer à l'arrêt)
    const art = img ? `<svg viewBox="${compact ? '0 0 120 140' : '0 0 240 132'}" id="svg"><image class="uimg" href="${esc(img)}" width="${compact ? 120 : 240}" height="${compact ? 140 : 132}" preserveAspectRatio="xMidYMid meet"/></svg>` : `
      <svg viewBox="${compact ? '30 0 196 132' : '0 0 240 132'}" id="svg">
        <defs><linearGradient id="shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f7f8"/><stop offset="1" stop-color="#b8bec4"/></linearGradient></defs>
        <g class="rain">${rain}</g>
        <g transform="translate(112 120) scale(2.05)">
          <ellipse cx="2" cy="1" rx="40" ry="3" fill="rgba(0,0,0,.25)"/>
          <g>${[[42, -14], [46, -8], [40, -20]].map(([x, y], i) => `<line class="speed" x1="${x}" y1="${y}" x2="${x + 8}" y2="${y}" style="animation-delay:${i * .2}s"/>`).join('')}</g>
          ${clips}
          <g class="body">
            <ellipse class="blade" cx="0" cy="-4" rx="14" ry="1.2"/>
            <path d="M-34 -6 Q-36 -22 -16 -27 L16 -28 Q34 -27 37 -12 L37 -6 Z" fill="url(#shell)"/>
            <path d="M-30 -18 Q-26 -26 -12 -27 L14 -28 Q28 -27 32 -18 Z" fill="#8bc34a"/>
            <path d="M-30 -18 H32" stroke="rgba(0,0,0,.12)" stroke-width=".6"/>
            <rect x="-36" y="-10" width="10" height="5" rx="2" fill="#30343a"/>
            <rect x="-6" y="-31" width="16" height="4" rx="2" fill="#30343a"/><circle cx="12" cy="-29" r="1.6" fill="#e53935"/>
            <path d="M8 -31 V-42" stroke="#30343a" stroke-width="1.6"/><circle cx="8" cy="-43" r="2.4" fill="#30343a"/>
            <circle class="led" cx="-14" cy="-23" r="1.8"/>
          </g>
          ${wheel(22, -9, 10)}${wheel(-24, -5, 5.5)}
        </g>
        <path class="ico bolt" d="M214 6 l-10 16 h7 l-3 13 l11 -17 h-7 z" fill="#ffd43b"/>
        <path class="ico home" d="M214 8 l-12 11 h4 v10 h6 v-7 h4 v7 h6 v-10 h4 z" fill="#3fa9ff"/>
        <path class="ico pz" d="M206 10 h5 v18 h-5z M216 10 h5 v18 h-5z" fill="#ffb300"/>
      </svg>`;
    const btns = `<div class="btns" id="btns">${['start', 'pause', 'dock'].map((a) => `<button class="btn" data-a="${a}"><svg viewBox="0 0 24 24">${ICONS_MOW[a]}</svg>${this._t(a)}</button>`).join('')}</div>`;
    this.shadowRoot.innerHTML = `
    <style>${COMMON_CSS_MOW}
      .body { animation:none; } .mowing .body { animation:bounce .35s ease-in-out infinite alternate; }
      .error .body { animation:shake .4s ease-in-out infinite; transform-origin:0 -10px; }
      .spin { transform:rotate(0); } .mowing .spin, .returning .spin { animation:spin .6s linear infinite; }
      .blade { fill:none; stroke:#9aa1a8; stroke-width:.8; stroke-dasharray:2 2; opacity:.35; }
      .mowing .blade { opacity:.9; animation:bladespin .12s linear infinite; }
      .clip { fill:none; stroke-width:1.4; stroke-linecap:round; opacity:0; transform-box:fill-box; transform-origin:center; } .mowing .clip { animation:fly .8s ease-out infinite; }
      .speed { stroke:var(--primary-text-color,#888); stroke-width:1; stroke-linecap:round; opacity:0; }
      .mowing .speed, .returning .speed { animation:streak .7s linear infinite; }
      .led { fill:#9e9e9e; } .mowing .led { fill:#43ff64; animation:blink 1.4s infinite; }
      .docked .led, .charging .led { fill:#43ff64; animation:breathe 2.4s ease-in-out infinite; }
      .returning .led { fill:#3fa9ff; } .paused .led { fill:#ffb300; animation:blink 1s infinite; } .error .led { fill:#ff3b30; animation:blink .5s infinite; }
      .rain { display:none; } .raining .rain { display:inline; }
      .drop { stroke:#7fb8ff; stroke-width:1.4; stroke-linecap:round; animation:fall 1s linear infinite; }
      .ico { opacity:0; transition:opacity .4s; }
      .charging .bolt, .docked .bolt { opacity:1; animation:breathe 1.6s ease-in-out infinite; }
      .returning .home { opacity:1; animation:hop 1s ease-in-out infinite; } .paused .pz { opacity:1; }
      @keyframes bounce { to { transform:translateY(-.6px) } }
      @keyframes shake { 0%,100% { transform:rotate(0) } 25% { transform:rotate(-2deg) } 75% { transform:rotate(2deg) } }
      @keyframes spin { to { transform:rotate(-360deg) } }
      @keyframes bladespin { to { stroke-dashoffset:6 } }
      @keyframes fly { 0% { opacity:0; transform:translate(0,0) } 25% { opacity:1 } 100% { opacity:0; transform:translate(14px,-10px) rotate(160deg) } }
      @keyframes streak { 0% { opacity:0; transform:translateX(0) } 30% { opacity:.5 } 100% { opacity:0; transform:translateX(14px) } }
      @keyframes fall { from { transform:translateY(0) } to { transform:translateY(140px) } }
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
}
const COMMON_CSS_MOW = `
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
  .btn.on { background:var(--primary-color,#43a047); color:#fff; }
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
define('appliance-robot-mower-solo-card', ApplianceRobotMowerSoloCard);
window.customCards.push({ type: 'appliance-robot-mower-solo-card', name: 'Appliance – Robot mower (solo) / Robot tondeuse (seul)', description: 'Robot tondeuse seule (sans fond ni station), animée, avec commandes', preview: true });
})();
