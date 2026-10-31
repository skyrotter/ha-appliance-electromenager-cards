/* ================================================================== */
/* appliance-pellet-boiler-card.js                                  */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-pellet-boiler-card — chaudière à granulés + trémie + vis sans fin, sans fond, animée
 * type: custom:appliance-pellet-boiler-card
 */
const I18N_PB = /*@i18n pellet_boiler*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class AppliancePelletBoilerCard extends HTMLElement {
  static getStubConfig(hass) {
    // chaudière : puissance dont le nom évoque une chaudière à granulés
    const S = (hass && hass.states) || {}, ids = Object.keys(S).filter((i) => i.startsWith('sensor.') && /pellet|granul|chaudiere|chaudière|boiler|okofen|hargassner/i.test(i)), dc = (i) => (S[i].attributes || {}).device_class;
    return { entity_power: ids.find((i) => dc(i) === 'power') || '', entity_flow_temp: '', entity_return_temp: '', entity_pellet_level: '' };
  }

  static getConfigForm() {
    const tc = window.applianceTemp();
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_status', selector: { entity: { domain: ['sensor', 'select', 'climate', 'switch', 'binary_sensor'] } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_flow_temp', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_return_temp', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_pellet_level', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
          { name: 'threshold', selector: { number: { min: 0, max: 500, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'ignition_threshold', selector: { number: { min: 50, max: 2000, step: 10, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'pellet_alert', selector: { number: { min: 0, max: 50, step: 1, mode: 'box', unit_of_measurement: '%' } } },
          { name: 'flow_temp_max', selector: { number: { ...tc.range(40, 95), step: 1, mode: 'box', unit_of_measurement: tc.unit } } },
        ] },
        window.applianceTempField,
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'show_temps', selector: { boolean: {} }, default: true },
          { name: 'show_pellets', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_PB) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = { show_power: true, show_energy: true, show_cost: true, show_temps: true, show_pellets: true, show_status: true,
      price_per_kwh: 0, threshold: 30, ignition_threshold: 300, pellet_alert: 15, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_PB[this._config.language || lang(this._hass)] || I18N_PB.en)[k] ?? I18N_PB.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    // Granulés : petits bâtonnets en rangées (dans l'ouverture de la trémie et le hublot de niveau)
    const pellets = (x0, y0, w, h, n) => Array.from({ length: n }, (_, i) => {
      const x = x0 + ((i * 37) % 100) / 100 * w, y = y0 + ((i * 53) % 100) / 100 * h, a = (i * 47) % 180;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="3.2" height="1.6" rx=".8" transform="rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 3 ? '#c9a066' : '#b38a50'}"/>`;
    }).join('');
    const tube = 'M76 172 L136 112';
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; gap:6px; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .alarm .badge.al, .low .badge.lo { display:inline-block; } .badge.lo { background:#fb8c00; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
      /* Flamme dans le hublot */
      .flame { transform-box:fill-box; transform-origin:50% 100%; opacity:0; transition:opacity .8s; }
      .ignition .flame.small, .heating .flame, .extinguishing .flame.small { opacity:1; animation:flick .35s ease-in-out infinite alternate; }
      .extinguishing .flame.small { animation-duration:.7s; opacity:.6; }
      .flame.f2 { animation-delay:.12s !important; } .flame.f3 { animation-delay:.23s !important; }
      .glow { fill:#ff8a2a; opacity:0; transition:opacity .8s; } .heating .glow { opacity:.55; animation:breathe 1.6s ease-in-out infinite; }
      .ignition .glow { opacity:.25; }
      .igniter { stroke:#555; stroke-width:2; } .ignition .igniter { stroke:#ff3b1f; filter:drop-shadow(0 0 3px #ff3b1f); animation:breathe .8s infinite; }
      /* Vis sans fin + granulés qui montent */
      .screw { fill:none; stroke:#7b828a; stroke-width:6; stroke-dasharray:3 4; }
      .feed { fill:none; stroke:#c9a066; stroke-width:3.4; stroke-linecap:round; stroke-dasharray:.1 9; opacity:0; }
      .ignition .screw, .heating .screw { animation:dash var(--fs,1.2s) linear infinite; }
      .ignition .feed, .heating .feed { opacity:1; animation:dash2 var(--fs,1.2s) linear infinite; }
      .pile { transition:transform 1.2s ease; } .heating .pilej, .ignition .pilej { animation:jig .9s ease-in-out infinite alternate; }
      .lvl { transition:y 1.2s ease, height 1.2s ease; }
      .low .hopper-front { animation:warn 1s infinite; }
      /* Tuyaux départ / retour */
      .pipe { fill:none; stroke-width:6; stroke-linecap:round; transition:stroke 1.2s; }
      .flow { fill:none; stroke:rgba(255,255,255,.75); stroke-width:2; stroke-linecap:round; stroke-dasharray:.1 8; opacity:0; }
      .heating .flow { opacity:1; animation:dash2 1s linear infinite; } .heating .flow.ret { animation-direction:reverse; }
      .heat path { fill:none; stroke:#ffb36b; stroke-width:1.6; stroke-linecap:round; opacity:0; }
      .heating .heat path { animation:rise 2.4s ease-in infinite; } .heat path:nth-child(2) { animation-delay:.8s !important; } .heat path:nth-child(3) { animation-delay:1.6s !important; }
      /* Écran */
      .scr { fill:#0d1a24; } .alarm .scr { fill:#4a0d0d; animation:blink .6s infinite; }
      .scrtxt { fill:#7fe0ff; font:700 7px 'Courier New',monospace; text-anchor:middle; } .scrlab { fill:#7fe0ff; font:5px 'Courier New',monospace; text-anchor:middle; opacity:.8; }
      .off .scrtxt, .off .scrlab { fill:#4f7d8f; }
      .led { fill:#6b6b6b; } .heating .led { fill:#43ff64; } .ignition .led { fill:#ffb300; animation:blink .8s infinite; }
      .extinguishing .led { fill:#3fa9ff; animation:blink 1.2s infinite; } .alarm .led { fill:#ff3b30; animation:blink .4s infinite; }
      .stats { display:grid; gap:8px; margin-top:6px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.02em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes flick { from { transform:scaleY(.82) scaleX(1.05) } to { transform:scaleY(1.12) scaleX(.94) } }
      @keyframes dash { to { stroke-dashoffset:-14 } } @keyframes dash2 { to { stroke-dashoffset:-18 } }
      @keyframes jig { to { transform:translateY(.8px) } }
      @keyframes rise { 0% { opacity:0; transform:translateY(0) } 30% { opacity:.7 } 100% { opacity:0; transform:translateY(-22px) } }
      @keyframes warn { 50% { fill:#a86a2a } }
      @keyframes blink { 50% { opacity:.35 } } @keyframes breathe { 50% { opacity:.3 } }
    </style>
    <ha-card id="card">
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span><span class="badge lo">${this._t('low')}</span> <span class="badge al">${this._t('alarm')}</span></span></div>
      <svg viewBox="0 0 280 214" id="svg">
        <defs>
          <linearGradient id="pbf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9ebed"/><stop offset="1" stop-color="#cfd3d7"/></linearGradient>
          <linearGradient id="pbs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b3b8bd"/><stop offset="1" stop-color="#9aa0a6"/></linearGradient>
          <linearGradient id="hop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a7076"/><stop offset="1" stop-color="#4c5157"/></linearGradient>
          <clipPath id="open"><polygon points="20,66 36,55 104,51 96,63"/></clipPath>
          <clipPath id="sight"><rect x="40" y="74" width="9" height="44" rx="2"/></clipPath>
          <radialGradient id="fire" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f"/></radialGradient>
        </defs>
        <ellipse cx="160" cy="206" rx="118" ry="6" fill="rgba(0,0,0,.22)"/>

        <!-- Tuyaux cuivre départ (gauche) / retour (droite) -->
        <path class="pipe" id="pdep" d="M156 32 V6 H186"/>
        <path class="flow dep" d="M156 32 V6 H186"/>
        <path class="pipe" id="pret" d="M172 32 V14 H186"/>
        <path class="flow ret" d="M172 32 V14 H186"/>
        <text class="scrlab" x="200" y="8" style="fill:var(--primary-text-color,#ddd);text-anchor:start;font-size:6px" id="tdep"></text>
        <text class="scrlab" x="200" y="17" style="fill:var(--primary-text-color,#ddd);text-anchor:start;font-size:6px" id="tret"></text>
        <g class="heat"><path d="M222 28 q3 -5 0 -10 q-3 -5 0 -10"/><path d="M236 28 q3 -5 0 -10 q-3 -5 0 -10"/><path d="M250 28 q3 -5 0 -10 q-3 -5 0 -10"/></g>

        <!-- Chaudière -->
        <polygon points="132,40 146,30 266,30 252,40" fill="#6d7379"/>
        <polygon points="252,40 266,30 266,190 252,200" fill="url(#pbs)"/>
        <rect x="132" y="40" width="120" height="160" fill="url(#pbf)"/>
        <rect x="132" y="40" width="120" height="12" fill="#50565c"/>
        <line x1="132" y1="120" x2="252" y2="120" stroke="#aeb3b8" stroke-width="1.2"/>
        <rect x="244" y="74" width="3" height="16" rx="1.5" fill="#9aa0a6"/><rect x="244" y="150" width="3" height="16" rx="1.5" fill="#9aa0a6"/>
        <rect x="138" y="198" width="10" height="5" fill="#2e3237"/><rect x="236" y="198" width="10" height="5" fill="#2e3237"/>
        <!-- Écran tactile -->
        <rect x="208" y="55" width="36" height="24" rx="3" fill="#2b2f35"/>
        <rect class="scr" x="211" y="58" width="30" height="18" rx="2"/>
        <text class="scrlab" x="226" y="65" id="lab"></text><text class="scrtxt" x="226" y="73" id="val"></text>
        <circle class="led" cx="214" cy="82" r="1.6"/>
        <!-- Hublot de combustion -->
        <circle cx="192" cy="160" r="15" fill="#2b2f35"/>
        <circle cx="192" cy="160" r="11.5" fill="#120a06"/>
        <circle class="glow" cx="192" cy="161" r="11"/>
        <line class="igniter" x1="183" y1="168" x2="201" y2="168"/>
        <g>
          <path class="flame" d="M186 168 Q184 160 189 154 Q189 160 192 160 Q190 152 195 147 Q196 157 199 160 Q201 164 198 168 Z" fill="url(#fire)"/>
          <path class="flame small f2" d="M188 168 Q187 163 191 159 Q192 163 194 163 Q195 160 196 158 Q199 164 196 168 Z" fill="#ffcf4a"/>
          <path class="flame small f3" d="M190 168 Q190 165 192 163 Q194 165 194 168 Z" fill="#fff3b0"/>
        </g>
        <circle cx="192" cy="160" r="11.5" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/>

        <!-- Vis sans fin (tube incliné) -->
        <path d="${tube}" stroke="#3f444a" stroke-width="13" stroke-linecap="round" fill="none"/>
        <path class="screw" d="${tube}"/>
        <path class="feed" d="${tube}"/>
        <rect x="128" y="104" width="10" height="16" rx="2" fill="#3f444a"/>
        <!-- Pied + boîtier moteur -->
        <rect x="62" y="126" width="12" height="40" fill="#4c5157"/>
        <rect x="56" y="160" width="30" height="42" rx="3" fill="#3a3f45"/>
        <rect x="60" y="196" width="22" height="6" fill="#2e3237"/>

        <!-- Trémie -->
        <polygon class="hopper-front" points="20,66 96,63 82,126 50,128" fill="url(#hop)"/>
        <polygon points="96,63 104,51 90,116 82,126" fill="#3f444a"/>
        <polygon points="20,66 36,55 104,51 96,63" fill="#1e2125"/>
        <g clip-path="url(#open)"><g class="pile" id="pile"><g class="pilej">${pellets(18, 50, 90, 16, 120)}</g></g></g>
        <polygon points="20,66 36,55 104,51 96,63" fill="none" stroke="#7b828a" stroke-width="1.2"/>
        <!-- Hublot de niveau -->
        <rect x="40" y="74" width="9" height="44" rx="2" fill="#1e2125"/>
        <g clip-path="url(#sight)"><rect class="lvl" id="lvl" x="40" y="118" width="9" height="0" fill="#c9a066"/>${pellets(40, 74, 9, 44, 30).replace(/fill="#c9a066"|fill="#b38a50"/g, 'fill="rgba(0,0,0,.28)"')}</g>
        <rect x="40" y="74" width="9" height="44" rx="2" fill="none" stroke="#8a9096" stroke-width="1"/>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _st(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) {
    const s = this._st(id); if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  // Statut : entité (mots-clés FR/EN) sinon déduit de la puissance
  _state(w) {
    const c = this._config, s = this._st(c.entity_status);
    if (s) {
      const v = String(s.state).toLowerCase();
      if (/alarm|alarme|error|erreur|d[ée]faut|fault/.test(v)) return 'alarm';
      if (/allum|ignit|start|d[ée]marr|pr[ée]chauf/.test(v)) return 'ignition';
      if (/extinc|shut|refroid|cool|stopping|nettoy|clean/.test(v)) return 'extinguishing';
      if (/chauff|heat|run|marche|modul|burn|^on$/.test(v)) return w !== null && w > c.ignition_threshold ? 'ignition' : 'heating';
      if (/off|arr[êe]t|standby|veille|idle/.test(v)) return 'off';
    }
    if (w === null) return 'off';
    if (w > c.ignition_threshold) return 'ignition';
    if (w > c.threshold) return 'heating';
    return 'off';
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const w = this._num(c.entity_power), e = this._num(c.entity_energy);
    // températures dans l'unité d'affichage (°C / °F)
    const tc = window.applianceTemp(this._hass, c), tv = (id) => tc.conv(this._num(id), this._st(id));
    const dep = tv(c.entity_flow_temp), ret = tv(c.entity_return_temp), lvl = this._num(c.entity_pellet_level);
    let cost = this._num(c.entity_cost); if (cost === null && e !== null && c.price_per_kwh) cost = e * c.price_per_kwh;
    const st = this._state(w);
    const low = lvl !== null && lvl <= c.pellet_alert;
    r.getElementById('svg').setAttribute('class', st);
    const card = r.getElementById('card'); card.classList.toggle('alarm', st === 'alarm'); card.classList.toggle('low', low);
    r.getElementById('svg').classList.toggle('low', low);

    // Vitesse de la vis selon la puissance (si connue)
    r.getElementById('svg').style.setProperty('--fs', `${st === 'ignition' ? 0.8 : 1.4}s`);

    // Tuyaux : cuivre froid → rouge chaud (départ), cuivre → orange (retour) ; dégradé calculé en °C (25 → flow_temp_max, 80 °C par défaut)
    const fMax = c.flow_temp_max != null ? tc.toC(c.flow_temp_max) : 80;
    const mix = (t) => { const k = t === null ? 0 : Math.max(0, Math.min(1, (tc.toC(t) - 25) / (fMax - 25)));
      const a = [184, 115, 51], b = [229, 57, 53]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`; };
    r.getElementById('pdep').style.stroke = mix(dep);
    r.getElementById('pret').style.stroke = mix(ret === null ? null : ret - tc.d(10));
    r.getElementById('tdep').textContent = dep === null ? '' : `▲ ${Math.round(dep)}°`;
    r.getElementById('tret').textContent = ret === null ? '' : `▼ ${Math.round(ret)}°`;

    // Niveau de granulés : hublot + tas dans la trémie
    const p = lvl === null ? 70 : Math.max(0, Math.min(100, lvl));
    const lv = r.getElementById('lvl'); lv.setAttribute('y', 118 - 44 * p / 100); lv.setAttribute('height', 44 * p / 100);
    lv.setAttribute('fill', low ? '#e0782e' : '#c9a066');
    r.getElementById('pile').style.transform = `translateY(${((100 - p) / 100 * 14).toFixed(1)}px)`;
    r.getElementById('pile').style.opacity = p < 8 ? 0.2 : 1;

    // Écran
    const lab = r.getElementById('lab'), val = r.getElementById('val');
    if (st === 'heating') { lab.textContent = this._t('flow').toUpperCase(); val.textContent = dep === null ? 'ON' : `${Math.round(dep)}${tc.unit}`; }
    else if (st === 'off') { lab.textContent = this._t('off').toUpperCase(); val.textContent = dep === null ? '--' : `${Math.round(dep)}${tc.unit}`; }
    else { lab.textContent = ''; val.textContent = this._t(st).toUpperCase().slice(0, 9); }

    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_status) it.push([this._l('status'), this._t(st), c.entity_status || c.entity_power]);
    if (c.show_power) it.push([this._l('power'), w === null ? '—' : w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`, c.entity_power]);
    if (c.show_temps) { it.push([this._l('flow'), f(dep, 0, tc.unit), c.entity_flow_temp]); it.push([this._l('ret'), f(ret, 0, tc.unit), c.entity_return_temp]); }
    if (c.show_pellets) it.push([this._l('pellets'), f(lvl, 0, '%'), c.entity_pellet_level]);
    if (c.show_energy) it.push([this._l('energy'), f(e, 1, 'kWh'), c.entity_energy]);
    if (c.show_cost && cost !== null) it.push([this._l('cost'), f(cost, 2, '€'), c.entity_cost || c.entity_energy]);
    const stats = r.getElementById('stats');
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
    window.applianceLinkTiles(stats, this);
  }
}
define('appliance-pellet-boiler-card', AppliancePelletBoilerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-pellet-boiler-card', name: 'Appliance – Pellet boiler / Chaudière à granulés', description: 'Chaudière à granulés animée (trémie, vis sans fin, flamme, départ/retour)', preview: true });
})();
