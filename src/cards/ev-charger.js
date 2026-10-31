/* ================================================================== */
/* appliance-ev-charger-card.js                                     */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-ev-charger-card — wallbox murale + voiture branchée, animée
 * type: custom:appliance-ev-charger-card
 */
const I18N_EV = /*@i18n ev_charger*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class ApplianceEvChargerCard extends HTMLElement {
  static getStubConfig(hass) {
    // borne : puissance dont le nom évoque une borne / wallbox
    const S = (hass && hass.states) || {}, ids = Object.keys(S).filter((i) => i.startsWith('sensor.') && /charger|wallbox|borne|evse|zappi|easee|_ev_/i.test(i)), dc = (i) => (S[i].attributes || {}).device_class;
    return { entity_power: ids.find((i) => dc(i) === 'power') || '', entity_session_energy: '', entity_car_soc: '', entity_status: '', max_power: 7400, price_per_kwh: 0.2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_session_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_car_soc', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_status', selector: { entity: { domain: ['sensor', 'binary_sensor', 'select'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'max_power', selector: { number: { min: 1000, max: 22000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
          { name: 'car_color', selector: { text: {} } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_soc', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_duration', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_EV) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = { show_power: true, show_energy: true, show_soc: true, show_status: true, show_duration: true, show_cost: true,
      max_power: 7400, price_per_kwh: 0.2, car_color: '#3d6fb6', ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    this._hass = h;
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config.language || lang(h);
    if (l !== this._lng) { this._lng = l; this._built = false; this._build(); }
    this._update();
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  connectedCallback() { this._timer = setInterval(() => this._update(), 30000); } // rafraîchit la durée
  disconnectedCallback() { clearInterval(this._timer); }
  _t(k) { return (I18N_EV[this._config.language || lang(this._hass)] || I18N_EV.en)[k] ?? I18N_EV.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const car = esc(this._config.car_color);
    const cable = 'M44 112 C 44 168, 112 170, 134 118';
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; margin:0 4px 4px; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
      .ledbar { fill:var(--st,#9e9e9e); filter:drop-shadow(0 0 4px var(--st,#9e9e9e)); transition:fill .6s; }
      .charging .ledbar { animation:breathe var(--sp,2s) ease-in-out infinite; }
      .scr { fill:#0c1a24; } .scrtxt { fill:#7fe0ff; font:700 8px 'Courier New',monospace; text-anchor:middle; }
      .cable { fill:none; stroke:#1b1b1b; stroke-width:6; stroke-linecap:round; }
      .flow { fill:none; stroke:#7cff9b; stroke-width:2.6; stroke-linecap:round; stroke-dasharray:2 9; opacity:0; }
      .charging .flow { opacity:1; animation:dash var(--sp,1s) linear infinite; }
      .plugged-cable { transition:opacity .6s; } .disconnected .plugged-cable { opacity:0; }
      .hang { opacity:0; transition:opacity .6s; } .disconnected .hang { opacity:1; }
      .spark { fill:#fff59d; opacity:0; } .charging .spark { animation:spark 1.2s ease-in-out infinite; }
      .gfill { fill:var(--gc,#43a047); transition:width 1.2s ease, fill .6s; }
      .charging .gfill { animation:breathe 2s ease-in-out infinite; }
      .gtxt { fill:#fff; font:800 10px system-ui,sans-serif; text-anchor:middle; text-shadow:0 1px 2px rgba(0,0,0,.6); }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } }
      @keyframes breathe { 50% { opacity:.45; } }
      @keyframes spark { 0%,100% { opacity:0; transform:scale(.6); } 50% { opacity:1; transform:scale(1.1); } }
    </style>
    <ha-card>
      <div class="title">${esc(this._config.name || this._t('name'))}</div>
      <svg viewBox="0 0 340 172" id="svg">
        <defs>
          <linearGradient id="wb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#40454d"/><stop offset="1" stop-color="#16191d"/></linearGradient>
          <linearGradient id="carb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${car}"/><stop offset="1" stop-color="${car}" stop-opacity=".75"/></linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc3dc"/><stop offset="1" stop-color="#2d4456"/></linearGradient>
        </defs>

        <!-- Wallbox -->
        <rect x="12" y="6" width="64" height="106" rx="14" fill="url(#wb)"/>
        <rect x="18" y="12" width="52" height="94" rx="10" fill="#2c3036" stroke="rgba(255,255,255,.08)"/>
        <rect class="ledbar" x="41" y="22" width="6" height="44" rx="3"/>
        <rect class="scr" x="25" y="76" width="38" height="16" rx="3"/>
        <text class="scrtxt" x="44" y="87" id="scr"></text>
        <rect x="36" y="104" width="16" height="10" rx="3" fill="#111"/>
        <!-- Câble rangé (débranché) -->
        <path class="hang cable" d="M44 112 C 44 150, 92 150, 84 110"/>
        <rect class="hang" x="78" y="96" width="12" height="16" rx="3" fill="#2a2a2a"/>

        <!-- Voiture de profil (avant à droite) -->
        <ellipse cx="228" cy="160" rx="108" ry="5" fill="rgba(0,0,0,.18)"/>
        <path d="M122 142 L122 120 Q124 108 142 104 L180 99 Q200 78 236 75 L272 75 Q300 77 318 98 L328 102 Q338 106 338 122 L338 142 Z" fill="url(#carb)"/>
        <path d="M188 99 Q206 82 236 80 L250 80 L250 99 Z" fill="url(#glass)"/>
        <path d="M256 80 L272 80 Q294 82 308 99 L256 99 Z" fill="url(#glass)"/>
        <rect x="251" y="80" width="4" height="20" fill="${car}"/>
        <path d="M200 104 V138 M256 104 V138" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
        <rect x="236" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/><rect x="292" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/>
        <path d="M330 106 l6 2 v6 l-7 -1 z" fill="#fff6c2"/><rect x="122" y="108" width="5" height="8" rx="1" fill="#e53935"/>
        <rect x="122" y="132" width="216" height="6" fill="rgba(0,0,0,.25)"/>
        ${[160, 300].map((x) => `<g><circle cx="${x}" cy="142" r="17" fill="#141414"/><circle cx="${x}" cy="142" r="9" fill="#9aa3ad"/><circle cx="${x}" cy="142" r="3" fill="#555"/></g>`).join('')}
        <!-- Trappe de recharge -->
        <rect x="130" y="112" width="10" height="10" rx="2" fill="#1d1d1d"/>
        <!-- Jauge batterie voiture sur la portière -->
        <g id="gauge">
          <rect x="205" y="110" width="80" height="20" rx="5" fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
          <rect x="285" y="116" width="4" height="8" rx="1.5" fill="rgba(255,255,255,.85)"/>
          <rect class="gfill" id="gfill" x="208" y="113" width="0" height="14" rx="3"/>
          <text class="gtxt" x="245" y="124" id="gtxt"></text>
        </g>

        <!-- Câble branché + flux -->
        <g class="plugged-cable">
          <path class="cable" d="${cable}"/>
          <path class="flow" d="${cable}"/>
          <rect x="128" y="111" width="12" height="12" rx="3" fill="#2a2a2a"/>
          <g transform="translate(134 117)"><path class="spark" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" style="transform-box:fill-box;transform-origin:center"/></g>
        </g>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  // Statut : depuis l'entité si fournie (mots-clés FR/EN), sinon déduit de la puissance
  _status(watts) {
    const c = this._config, s = c.entity_status && this._hass.states[c.entity_status];
    if (s) {
      const v = String(s.state).toLowerCase();
      if (/charg(ing|e)\b|en charge|charging/.test(v) && !/dis|termin|complete/.test(v)) return 'charging';
      if (/complete|finish|termin|full|plein|done/.test(v)) return 'done';
      if (/connect|plug|branch|on|wait|attente|ready|prêt/.test(v) && !/disconnect|déconnect|débranch|unplug/.test(v)) return watts > 50 ? 'charging' : 'plugged';
      return 'disconnected';
    }
    return watts > 50 ? 'charging' : 'plugged';
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const ps = c.entity_power && this._hass.states[c.entity_power];
    let w = this._num(c.entity_power);
    if (w !== null && ps && /kw/i.test(ps.attributes.unit_of_measurement || '')) w *= 1000;
    const energy = this._num(c.entity_session_energy), soc = this._num(c.entity_car_soc);
    let cost = this._num(c.entity_cost);
    if (cost === null && energy !== null && c.price_per_kwh) cost = energy * c.price_per_kwh;
    const st = this._status(w || 0);

    const svg = r.getElementById('svg');
    svg.classList.remove('charging', 'plugged', 'done', 'disconnected'); svg.classList.add(st);
    const colors = { charging: '#43ff64', plugged: '#3fa9ff', done: '#43a047', disconnected: '#d0d0d0' };
    svg.style.setProperty('--st', colors[st]);
    const ratio = Math.min((w || 0) / c.max_power, 1);
    svg.style.setProperty('--sp', `${(1.6 - ratio * 1.2).toFixed(2)}s`);
    r.getElementById('scr').textContent = st === 'charging' ? `${((w || 0) / 1000).toFixed(1)} kW` : this._t(st).toUpperCase().slice(0, 9);

    // Jauge voiture
    const pct = soc === null ? 0 : Math.max(0, Math.min(100, soc));
    r.getElementById('gfill').setAttribute('width', (74 * pct / 100).toFixed(1));
    r.getElementById('gauge').style.display = soc === null ? 'none' : '';
    svg.style.setProperty('--gc', pct < 20 ? '#e53935' : pct < 50 ? '#fb8c00' : '#43a047');
    r.getElementById('gtxt').textContent = soc === null ? '' : `${Math.round(pct)}%`;

    // Durée depuis le dernier changement d'état (statut, sinon puissance)
    let dur = null;
    const ref = (c.entity_status && this._hass.states[c.entity_status]) || ps;
    if (st === 'charging' && ref && ref.last_changed) {
      const m = Math.max(0, Math.round((Date.now() - new Date(ref.last_changed).getTime()) / 60000));
      dur = `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
    }

    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), w === null ? '—' : w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`, c.entity_power]);
    if (c.show_energy) it.push([this._l('energy'), f(energy, 1, 'kWh'), c.entity_session_energy]);
    if (c.show_soc && soc !== null) it.push([this._l('soc'), f(soc, 0, '%'), c.entity_car_soc]);
    if (c.show_status) it.push([this._l('status'), this._t(st), c.entity_status || c.entity_power]);
    if (c.show_duration) it.push([this._l('duration'), dur || '—', c.entity_status || c.entity_power]);
    if (c.show_cost) it.push([this._l('cost'), f(cost, 2, '€'), c.entity_cost || c.entity_session_energy]);
    // 5-6 valeurs → 2 lignes équilibrées
    r.getElementById('stats').style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    r.getElementById('stats').innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
    window.applianceLinkTiles(r.getElementById('stats'), this);
  }
}
define('appliance-ev-charger-card', ApplianceEvChargerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-ev-charger-card', name: 'Appliance – EV charger / Borne de recharge', description: 'Wallbox murale animée avec voiture branchée', preview: true });
})();
