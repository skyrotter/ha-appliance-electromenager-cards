/* ================================================================== */
/* appliance-aquarium-card.js                                       */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-aquarium-card — carte Lovelace aquarium animé (puissance, kWh, température, coût)
 * type: custom:appliance-aquarium-card
 */
const I18N_AQUARIUM = /*@i18n aquarium*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class ApplianceAquariumCard extends HTMLElement {
  static getStubConfig(hass) {
    const tc = window.applianceTemp(hass);
    // entités dont le nom évoque un aquarium (aperçu du sélecteur de cartes), sinon vide
    const S = (hass && hass.states) || {}, ids = Object.keys(S).filter((i) => /aqua/i.test(i));
    const dc = (i) => (S[i].attributes || {}).device_class;
    const find = (dom, d) => ids.find((i) => i.startsWith(dom) && (!d || dc(i) === d)) || '';
    return { entity_power: find('sensor.', 'power'), entity_energy: find('sensor.', 'energy'), entity_temperature: find('sensor.', 'temperature'),
      entity_light: find('light.') || find('switch.'), temp_min: tc.c(24), temp_max: tc.c(27), price_per_kwh: 0.2 };
  }

  // Éditeur visuel HA
  static getConfigForm() {
    const tc = window.applianceTemp(), tr = tc.range(0, 40);
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_light', selector: { entity: { domain: ['light', 'switch', 'input_boolean'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          { name: 'temp_min', selector: { number: { ...tr, step: 0.5, mode: 'box', unit_of_measurement: tc.unit } } },
          { name: 'temp_max', selector: { number: { ...tr, step: 0.5, mode: 'box', unit_of_measurement: tc.unit } } },
        ] },
        window.applianceTempField,
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_temperature', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_AQUARIUM) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = {
      show_power: true, show_energy: true, show_temperature: true, show_cost: true,
      price_per_kwh: 0.2, max_power: 200,
      ...config,
    };
    this._built = false;
    this._build();
  }

  set hass(hass) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(hass));
    if (l && l !== this._lng) { this._lng = l; this._hass = hass; this._built = false; this._build(); }
   
    this._hass = hass;
    this._update();
  }

  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

  _t(k) { return (I18N_AQUARIUM[this._config.language || lang(this._hass)] || I18N_AQUARIUM.en)[k] ?? I18N_AQUARIUM.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    const c = this._config;
    // Poisson tourné vers la droite (tête à x=34), flip automatique au retour
    const fish = (top, dur, delay, body, fin, scale, stripes) => `
      <g class="fish" style="--top:${top}px;--dur:${dur}s;--delay:${delay}s;--s:${scale}">
        <g style="transform:scale(${scale})">
          <path class="tail" d="M2 0 L-12 -9 L-9 0 L-12 9 Z" fill="${fin}"/>
          <path d="M0 0 C8 -10 26 -10 34 0 C26 10 8 10 0 0 Z" fill="${body}"/>
          <path d="M14 -8 L22 -14 L26 -7 Z" fill="${fin}"/>
          ${stripes ? '<path d="M10 -8 L12 8 M18 -9 L20 9 M26 -6 L27 6" stroke="#111" stroke-width="2.4" fill="none"/>' : ''}
          <circle cx="28" cy="-2" r="2" fill="#fff"/><circle cx="28.6" cy="-2" r="1" fill="#111"/>
        </g>
      </g>`;
    const bubbles = Array.from({ length: 10 }, (_, i) =>
      `<circle class="bubble" cx="${262 + (i % 4) * 5}" cy="140" r="${1.5 + (i % 3)}" style="--d:${3 + (i % 4)}s;--dl:${(i * 0.6) % 3}s"/>`).join('');
    const blade = (x, h, w, col, d, pd) => `<path class="plant" d="M${x} 146 q ${-w} ${-h / 3} 0 ${-h / 2} q ${w} ${-h / 3} 0 ${-h / 2}" stroke="${col}" style="--pd:${pd}s;transform-origin:${x}px 146px;stroke-width:${d}"/>`;
    const plants = [
      blade(30, 95, 8, '#3fbf4a', 6, 4), blade(42, 110, -9, '#58d65a', 5, 5), blade(54, 80, 7, '#35a842', 5, 6),
      blade(78, 100, 9, '#6be06a', 4, 5), blade(90, 85, -7, '#3fbf4a', 4, 4), blade(100, 70, 6, '#7ae27a', 4, 6),
      blade(195, 105, 8, '#4cc94c', 8, 4), blade(210, 85, -9, '#37ae3f', 7, 5), blade(280, 95, 7, '#4cc94c', 5, 5),
    ].join('');
    const feathers = [[135, 105], [148, 120], [160, 95], [170, 110]].map(([x, h], i) =>
      `<path class="plant" d="M${x} 146 C ${x - 10} ${146 - h / 2}, ${x + 10} ${146 - h / 1.5}, ${x} ${146 - h}" stroke="#c0789a" style="--pd:${5 + i}s;transform-origin:${x}px 146px;stroke-width:12;opacity:.85"/>`).join('');
    const urchin = Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return `<line x1="232" y1="136" x2="${232 + Math.cos(a) * 13}" y2="${136 + Math.sin(a) * 11}"/>`; }).join('');
    const speckles = Array.from({ length: 40 }, (_, i) => `<circle cx="${14 + (i * 37) % 292}" cy="${150 + (i * 13) % 12}" r="1" fill="#6f86d6" opacity=".6"/>`).join('');

    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; font-size:1.05em; margin:0 4px 8px; display:flex; justify-content:space-between; align-items:center; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .alert .badge { display:inline-block; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; border-radius:10px; transform:scale(0.8); transform-origin:top center; }
      .tint { fill:var(--water, #2a8fd6); opacity:.45; transition:fill 1.5s; }
      .night-overlay { fill:#050b24; opacity:0; transition:opacity 1.2s; }
      .night .night-overlay { opacity:.6; }
      .lamp-glow { fill:#bfe6ff; opacity:0; transition:opacity 1s; }
      .lit .lamp-glow { opacity:.22; } .lit .lamp-led { fill:#e8f6ff; } .lamp-led { fill:#444; }
      .plant { fill:none; stroke-linecap:round; animation:sway var(--pd) ease-in-out infinite alternate; }
      .bubble { fill:rgba(255,255,255,.35); stroke:rgba(255,255,255,.85); stroke-width:.6;
        animation:rise calc(var(--d) / var(--speed,1)) linear infinite; animation-delay:var(--dl); }
      .fish { animation:swim var(--dur) linear infinite; animation-delay:var(--delay); }
      .tail { transform-origin:2px 0; animation:wag calc(.5s / var(--speed,1)) ease-in-out infinite alternate; }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(70px,1fr)); gap:8px; margin-top:10px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat.link { cursor:pointer; } .stat.link:hover { background:rgba(127,127,127,.2); }
      svg { cursor:pointer; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      .alert .stat.t .v { color:#e53935; animation:blink 1s infinite; }
      @keyframes rise { from { transform:translateY(0); opacity:.9 } to { transform:translateY(-105px); opacity:0 } }
      @keyframes sway { from { transform:rotate(-4deg) } to { transform:rotate(4deg) } }
      /* aller vers la droite, demi-tour, retour vers la gauche */
      @keyframes swim {
        0% { transform:translate(0px,var(--top)) scaleX(1) } 49.9% { transform:translate(290px,var(--top)) scaleX(1) }
        50% { transform:translate(290px,var(--top)) scaleX(-1) } 99.9% { transform:translate(0px,var(--top)) scaleX(-1) }
        100% { transform:translate(0px,var(--top)) scaleX(1) } }
      @keyframes wag { from { transform:scaleY(.7) } to { transform:scaleY(1.2) } }
      @keyframes blink { 50% { opacity:.35 } }
    </style>
    <ha-card>
      <div class="title"><span id="name">${esc(c.name || this._t('name'))}</span><span class="badge" id="badge">${this._t('alert')}</span></div>
      <svg viewBox="0 0 320 200" id="tank">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8cf0"/><stop offset="1" stop-color="#0b4fb8"/></linearGradient>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98534"/><stop offset="1" stop-color="#b8661e"/></linearGradient>
          <clipPath id="glass"><rect x="10" y="24" width="300" height="140"/></clipPath>
        </defs>
        <rect width="320" height="200" fill="#efe6dc"/>
        <rect x="4" y="170" width="312" height="30" fill="url(#wood)"/><line x1="160" y1="172" x2="160" y2="200" stroke="#8a4a14" stroke-width="1.5"/>
        <rect x="10" y="24" width="300" height="140" fill="url(#bg)"/>
        <g clip-path="url(#glass)">
          <rect class="tint" x="10" y="24" width="300" height="140"/>
          <rect x="10" y="24" width="300" height="5" fill="rgba(255,255,255,.35)"/>
          <rect x="108" y="28" width="9" height="115" fill="#10244a" opacity=".85"/>
          ${plants}${feathers}
          <g stroke="#c62828" stroke-width="1.6" stroke-linecap="round">${urchin}</g><circle cx="232" cy="136" r="5" fill="#b71c1c"/>
          <polygon points="95,146 112,120 140,112 160,128 165,146" fill="#555a60"/><polygon points="112,120 140,112 130,128" fill="#6b7076"/>
          <polygon points="180,146 190,124 215,118 228,146" fill="#4a4e54"/><polygon points="270,146 280,128 300,126 306,146" fill="#5a5f66"/>
          <polygon points="45,150 55,140 80,138 90,150" fill="#6a6f76"/>
          <ellipse cx="82" cy="130" rx="9" ry="7" fill="#e8e8e8"/><ellipse cx="128" cy="144" rx="8" ry="5" fill="#dcdcdc"/>
          <circle cx="205" cy="146" r="6" fill="#4caf50"/><circle cx="222" cy="148" r="5" fill="#5cc45c"/><circle cx="244" cy="147" r="6" fill="#4caf50"/><circle cx="258" cy="148" r="5" fill="#5cc45c"/>
          <rect x="10" y="148" width="300" height="16" fill="#12245e"/>${speckles}
          <g>${bubbles}</g>
          ${fish(40, 16, 0, '#ff9a2e', '#ff7a00', 1, false)}
          ${fish(65, 22, -9, '#ffb62e', '#ff9a00', 0.9, false)}
          ${fish(85, 19, -4, '#d8dce6', '#555', 1.05, true)}
          ${fish(105, 25, -14, '#e8c86a', '#c9a227', 0.8, true)}
          ${fish(55, 28, -20, '#ff4d4d', '#d32f2f', 0.7, false)}
          ${fish(120, 21, -6, '#ffc233', '#ff9a00', 0.95, false)}
          <rect class="night-overlay" x="10" y="24" width="300" height="140"/>
          <polygon class="lamp-glow" points="70,24 250,24 305,164 15,164"/>
        </g>
        <rect x="6" y="14" width="308" height="11" fill="#111"/><rect x="6" y="162" width="308" height="8" fill="#111"/>
        <rect x="8" y="24" width="3" height="140" fill="rgba(180,220,255,.5)"/><rect x="309" y="24" width="3" height="140" fill="rgba(180,220,255,.5)"/>
        <rect x="75" y="2" width="170" height="12" rx="3" fill="#1c1c1c"/><rect class="lamp-led" x="82" y="9" width="156" height="3" rx="1.5"/>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    const root = this.shadowRoot;
    root.getElementById('stats').addEventListener('click', (e) => { const t = e.target.closest('[data-e]'); if (t) this._more(t.dataset.e); });
    root.getElementById('stats').addEventListener('keydown', (e) => { const t = e.target.closest('[data-e]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this._more(t.dataset.e); } });
    root.querySelector('svg').addEventListener('click', () => { const c2 = this._config; this._more(c2.entity_light || c2.entity_temperature || c2.entity_power); });
    this._built = true;
  }

  // fiche de l'entité (more-info de Home Assistant)
  _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, root = this.shadowRoot;
    const power = this._num(c.entity_power), energy = this._num(c.entity_energy);
    // température dans l'unité d'affichage (°C / °F) ; seuils par défaut 24-27 °C convertis
    const tc = window.applianceTemp(this._hass, c), temp = tc.conv(this._num(c.entity_temperature), this._hass.states[c.entity_temperature]);
    const tMin = c.temp_min ?? tc.c(24), tMax = c.temp_max ?? tc.c(27);
    let cost = this._num(c.entity_cost);
    if (cost === null && energy !== null && c.price_per_kwh) cost = energy * c.price_per_kwh;

    // Vitesse des bulles/queues liée à la puissance (0.5× à 3×)
    const ratio = power === null ? 0 : Math.min(power / (c.max_power || 200), 1);
    root.querySelector('svg').style.setProperty('--speed', (0.5 + ratio * 2.5).toFixed(2));

    // Couleur de l'eau selon la température : froid=bleu, idéal=turquoise, chaud=orange/rouge
    let water = '#2a8fd6', alert = false;
    if (temp !== null) {
      if (temp < tMin) { water = '#1e5fb5'; alert = true; }
      else if (temp > tMax) { water = temp > tMax + tc.d(3) ? '#d64a2a' : '#d6962a'; alert = true; }
      else water = '#2ab5c4';
    }
    root.querySelector('svg').style.setProperty('--water', water);
    root.querySelector('ha-card').classList.toggle('alert', alert);

    // Éclairage jour/nuit
    const lightState = c.entity_light && this._hass.states[c.entity_light];
    const lit = lightState ? lightState.state === 'on' : true;
    const tank = root.getElementById('tank');
    tank.classList.toggle('lit', lit);
    tank.classList.toggle('night', !lit);

    const fmt = (v, d, u) => v === null ? '—' : `${v.toFixed(d)} ${u}`;
    const items = [];
    if (c.show_power) items.push(['p', this._l('power'), fmt(power, 0, 'W'), c.entity_power]);
    if (c.show_energy) items.push(['e', this._l('energy'), fmt(energy, 2, 'kWh'), c.entity_energy]);
    if (c.show_temperature) items.push(['t', this._l('temp'), fmt(temp, 1, tc.unit), c.entity_temperature]);
    if (c.show_cost) items.push(['c', this._l('cost'), fmt(cost, 2, '€'), c.entity_cost || c.entity_energy]);
    root.getElementById('stats').innerHTML = items.map(([k, l, v, id]) =>
      `<div class="stat ${k}${id ? ' link' : ''}"${id ? ` data-e="${esc(id)}" role="button" tabindex="0"` : ''}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}

define('appliance-aquarium-card', ApplianceAquariumCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-aquarium-card', name: 'Appliance – Aquarium', description: 'Aquarium animé : puissance, kWh, température, coût', preview: true });
})();
