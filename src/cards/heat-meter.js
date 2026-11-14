/* Carte « Compteur de chaleur » — custom:appliance-heat-meter-card
 * Chauffage urbain / collectif : compteur de chaleur à ultrasons (Landis+Gyr UH50 / T350, Kamstrup Multical, Sharky…),
 * tuyau d'arrivée rouge (départ Tv, fin) et tuyau de retour bleu (Tr, plus gros) avec particules animées, radiateur à eau
 * avec ondes de chaleur, badge puissance (kW) et écart de température ΔT.
 * Tous les capteurs sont optionnels : entity_energy (Wh, kWh, MWh, GJ, MJ), entity_supply_temp, entity_return_temp,
 * entity_power (W, kW, MW), entity_flow (L/h, L/min, m³/h…), entity_water_volume (m³, L), entity_room_temp.
 * Sans capteur de puissance, la puissance est calculée : débit × ΔT × 1,163 Wh/(kg·K).
 */
(() => {
  const TAG = 'appliance-heat-meter-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n heat_meter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // conversions : puissance → kW, débit → L/h, énergie → kWh, volume → m³
  const POWER = { w: 0.001, kw: 1, mw: 1000, 'gj/h': 277.778, 'mj/h': 0.277778, 'btu/h': 0.000293071 };
  const FLOW = { 'l/h': 1, 'l/min': 60, 'l/s': 3600, 'm³/h': 1000, 'm3/h': 1000, 'm³/min': 60000, 'gal/min': 227.125, 'gpm': 227.125, 'gal/h': 3.78541 };
  const ENERGY = { wh: 0.001, kwh: 1, mwh: 1000, gj: 277.778, mj: 0.277778, gwh: 1e6 };
  const VOLUME = { 'm³': 1, m3: 1, l: 0.001, litre: 0.001, liter: 0.001, 'gal': 0.00378541, 'ft³': 0.0283168 };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--hm-hot:var(--appliance-heat-color,#e53935);--hm-cold:var(--appliance-cold-color,#2b7de9);
  --hm-ok:var(--appliance-ok-color,#43a047);--spd:1.4s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--hm-hot) 20%,transparent);color:var(--hm-hot)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:auto;margin:4px auto 0;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.hot .v{color:var(--hm-hot)}.tile.cold .v{color:var(--hm-cold)}
/* ---- illustration ---- */
.hm-sup,.hm-ret{fill:none;stroke-linecap:round;stroke-dasharray:1 9;opacity:0;transition:opacity .4s}
.hm-sup{stroke:#ffd2cf;stroke-width:2.4}.hm-ret{stroke:#bfdcff;stroke-width:3.6}
.heating .hm-sup,.heating .hm-ret{opacity:1;animation:hmflow var(--spd) linear infinite}
.hm-wave{fill:none;stroke:#ff7043;stroke-width:2.2;stroke-linecap:round;opacity:0}
.heating .hm-wave{animation:hmwave 2.4s ease-in-out infinite}
.heating .hm-wave:nth-of-type(2){animation-delay:.6s}.heating .hm-wave:nth-of-type(3){animation-delay:1.2s}
.hm-glow{opacity:0;transition:opacity .6s}.heating .hm-glow{opacity:.55}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .hm-sup,.noanim .hm-ret,.noanim .hm-wave{animation:none}.noanim .heating .hm-wave,.noanim.heating .hm-wave{opacity:.7}
@keyframes hmflow{to{stroke-dashoffset:-20}}
@keyframes hmwave{0%{opacity:0;transform:translateY(6px)}40%{opacity:.9}100%{opacity:0;transform:translateY(-8px)}}
`;

  const SVG = (label) => {
    // ailettes du radiateur : 9 panneaux verticaux
    const fins = Array.from({ length: 9 }, (_, i) => `<rect x="${143 + i * 9.4}" y="46" width="7.2" height="58" rx="2" fill="url(#hmfin)" stroke="#cbd5e1" stroke-width="0.6"/>`).join('');
    return `<svg viewBox="0 0 240 130" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="hmbrass" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset=".35" stop-color="#eab308"/><stop offset=".7" stop-color="#ca8a04"/><stop offset="1" stop-color="#854d0e"/></linearGradient>
    <linearGradient id="hmfin" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient>
    <linearGradient id="hmbezel" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#64748b"/><stop offset=".5" stop-color="#475569"/><stop offset="1" stop-color="#334155"/></linearGradient>
    <linearGradient id="hmsheen" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="rgba(255,255,255,0.6)"/><stop offset=".4" stop-color="rgba(255,255,255,0.1)"/><stop offset="1" stop-color="rgba(255,255,255,0.2)"/></linearGradient>
    <linearGradient id="hmpiperead" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="138" y2="0"><stop offset="0%" stop-color="#ff1744"/><stop offset="40%" stop-color="#ef4444"/><stop offset="80%" stop-color="#dc2626"/><stop offset="100%" stop-color="#be123c"/></linearGradient>
    <radialGradient id="hmhot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7043" stop-opacity=".7"/><stop offset="1" stop-color="#ff7043" stop-opacity="0"/></radialGradient></defs>
    <ellipse class="hm-glow" cx="186" cy="74" rx="55" ry="40" fill="url(#hmhot)"/>
    <!-- tuyau de retour (bleu, plus gros) : bas du radiateur → courbe arrondie → réseau -->
    <path d="M 136 98 L 116 98 Q 104 98 104 110 L 104 114 Q 104 120 94 120 L 0 120" fill="none" stroke="#2563eb" stroke-width="4.8" stroke-linecap="round"/>
    <path class="hm-ret" d="M 136 98 L 116 98 Q 104 98 104 110 L 104 114 Q 104 120 94 120 L 0 120"/>
    <!-- tuyau de départ (rouge, plus fin) : réseau → compteur → entrée du radiateur, tout droit -->
    <path d="M 0 54 L 138 54" fill="none" stroke="url(#hmpiperead)" stroke-width="3.2" stroke-linecap="round"/>
    <path class="hm-sup" d="M 0 54 L 138 54"/>
    <!-- pastilles Tv / Tr -->
    <rect x="6" y="37" width="30" height="11" rx="5.5" fill="#dc2626"/><text x="21" y="45" fill="#fff" font-size="6" font-weight="700" text-anchor="middle" font-family="sans-serif">Tv</text>
    <rect x="6" y="103" width="30" height="11" rx="5.5" fill="#0288d1"/><text x="21" y="111" fill="#fff" font-size="6" font-weight="700" text-anchor="middle" font-family="sans-serif">Tr</text>
    <g transform="translate(42, 10)">
      <!-- corps laiton + raccords -->
      <g transform="translate(0, 44)">
        <rect x="-14" y="-4.5" width="10" height="9" rx="1.5" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.6"/>
        <rect x="-4" y="-6" width="3" height="12" rx="0.8" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.5"/>
        <rect x="-1" y="-3.5" width="56" height="7" rx="1.5" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.5"/>
        <rect x="55" y="-6" width="3" height="12" rx="0.8" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.5"/>
        <rect x="58" y="-4.5" width="10" height="9" rx="1.5" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.6"/>
      </g>
      <!-- boîtier du calculateur : liseré brillant, plaque, écran LCD, bouton, code-barres, cache trapézoïdal -->
      <rect x="0" y="0" width="54" height="64" rx="5" fill="url(#hmbezel)"/>
      <rect x="1.5" y="1.5" width="51" height="61" rx="4" fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.8"/>
      <rect x="2" y="2" width="50" height="60" rx="3.5" fill="url(#hmsheen)"/>
      <rect x="3.5" y="3.5" width="47" height="44" rx="2.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.5"/>
      <text x="6" y="9" fill="#0f172a" font-size="4.2" font-weight="900" font-family="sans-serif">HEAT</text>
      <text x="47" y="9" fill="#475569" font-size="3.6" font-weight="700" text-anchor="end" font-family="sans-serif">EN 1434</text>
      <rect x="6" y="12" width="32" height="13" rx="1.5" fill="#064e3b" stroke="#022c22" stroke-width="0.7"/>
      <text id="hmlcd" x="36" y="21" text-anchor="end" font-size="8" fill="#4ade80" font-family="monospace" font-weight="800">--</text>
      <text id="hmlcdu" x="36" y="23.5" text-anchor="end" font-size="3.2" fill="#34d399" font-family="monospace" font-weight="700"></text>
      <circle cx="43.5" cy="18.5" r="3.2" fill="#0f172a" stroke="#475569" stroke-width="0.6"/>
      <g transform="translate(6, 33)" fill="#1e293b">
        <rect x="0" y="0" width="0.8" height="5"/><rect x="1.5" y="0" width="0.5" height="5"/><rect x="2.5" y="0" width="1.2" height="5"/>
        <rect x="4.5" y="0" width="0.5" height="5"/><rect x="6" y="0" width="1" height="5"/><rect x="8" y="0" width="1.4" height="5"/>
      </g>
      <circle cx="43" cy="35" r="2.5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      <polygon points="3.5,49 11,60 43,60 50.5,49" fill="rgba(241, 245, 249, 0.85)" stroke="#94a3b8" stroke-width="0.7"/>
      <circle cx="27" cy="54.5" r="1.8" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.4"/>
    </g>
    <!-- radiateur à eau : raccords laiton, panneau, ailettes -->
    <rect x="130" y="49.5" width="8" height="9" rx="1.2" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.5"/>
    <rect x="130" y="93" width="8" height="10" rx="1.2" fill="url(#hmbrass)" stroke="#713f12" stroke-width="0.5"/>
    <rect x="138" y="34" width="94" height="76" rx="5" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
    <rect x="142" y="38" width="86" height="5" rx="1.5" fill="#cbd5e1"/>
    ${fins}
    <!-- ondes de chaleur -->
    <path class="hm-wave" d="M 160 32 Q 163 26 160 20 Q 157 14 160 8"/>
    <path class="hm-wave" d="M 185 32 Q 188 26 185 20 Q 182 14 185 8"/>
    <path class="hm-wave" d="M 210 32 Q 213 26 210 20 Q 207 14 210 8"/>
    <!-- badge sombre : puissance et ΔT -->
    <rect x="156" y="58" width="58" height="26" rx="13" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
    <text id="hmpow" x="185" y="70" text-anchor="middle" font-size="8.5" fill="#fbbf24" font-family="sans-serif" font-weight="800">--</text>
    <text id="hmdt" x="185" y="79" text-anchor="middle" font-size="6" fill="#f8fafc" font-family="sans-serif" font-weight="600"></text>
  </svg>`;
  };

  const TILES = [['supply', 'mdi:thermometer-chevron-up', 'show_supply'], ['return', 'mdi:thermometer-chevron-down', 'show_return'], ['delta', 'mdi:delta', 'show_delta'],
    ['power', 'mdi:fire', 'show_power'], ['flow', 'mdi:water-pump', 'show_flow'], ['energy', 'mdi:counter', 'show_energy'],
    ['volume', 'mdi:water', 'show_volume'], ['room', 'mdi:home-thermometer', 'show_room']];

  class ApplianceHeatMeterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const find = (re) => ids.find((i) => i.startsWith('sensor.') && re.test(i)) || '';
      return {
        entity_energy: find(/(heat|chaleur|waerme|wärme|calor).*(energy|energie|énergie)|(energy|energie).*(heat|chaleur)/i),
        entity_supply_temp: find(/(flow|supply|depart|départ|vorlauf).*temp/i),
        entity_return_temp: find(/(return|retour|ruecklauf|rücklauf).*temp/i),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_supply: true, show_return: true, show_delta: true, show_power: true, show_flow: true, show_energy: true, show_volume: true, show_room: true, power_threshold: 0.05, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    // valeur convertie dans l'unité de référence de la table (kW, L/h, kWh, m³) ; unité inconnue = unité de référence
    _conv(id, table, d) { const v = this._num(id); return isNaN(v) ? NaN : v * (table[this._unit(id, d).toLowerCase().replace(/litres?|liters?/, 'l')] ?? 1); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    // température ramenée en °C quel que soit l'unité du capteur (°F, K)
    _celsius(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, '°C').toLowerCase().replace(/[°\s]/g, '');
      return u === 'f' ? (v - 32) / 1.8 : u === 'k' ? v - 273.15 : v;
    }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="hmtitle"></div><div class="badge" id="hmbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_power || this._c.entity_energy || this._c.entity_supply_temp));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ supply: c.entity_supply_temp, return: c.entity_return_temp, delta: c.entity_supply_temp, power: c.entity_power, flow: c.entity_flow, energy: c.entity_energy, volume: c.entity_water_volume, room: c.entity_room_temp }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const tv = this._celsius(c.entity_supply_temp), tr = this._celsius(c.entity_return_temp);
      const dt = isNaN(tv) || isNaN(tr) ? NaN : tv - tr;
      const flow = this._conv(c.entity_flow, FLOW, 'L/h'); // L/h
      // puissance : capteur dédié, sinon calculée (débit × ΔT × 1,163 Wh/kg/K → kW)
      let power = this._conv(c.entity_power, POWER, 'kW');
      const calc = isNaN(power) && !isNaN(flow) && !isNaN(dt);
      if (calc) power = Math.max(0, flow * dt * 1.163 / 1000);
      const thr = Number(c.power_threshold) || 0;
      const heating = !isNaN(power) ? power > thr : !isNaN(flow) && !isNaN(dt) && flow > 5 && dt > 1;
      const ids = [c.entity_energy, c.entity_power, c.entity_flow, c.entity_supply_temp, c.entity_return_temp].filter(Boolean);
      const usable = ids.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      return { st: !usable ? 'unavailable' : heating ? 'heating' : 'idle', tv, tr, dt, flow, power, heating };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, tv, tr, dt, flow, power, heating } = this._compute();
      card.className = `${st}${c.animations === false ? ' noanim' : ''}`;
      // vitesse des particules : plus la puissance est élevée, plus ça circule vite (de 2,5 s à 0,5 s par cycle)
      card.style.setProperty('--spd', `${Math.max(.5, Math.min(2.5, 2.5 - (power || 0) * .25)).toFixed(2)}s`);

      // écran LCD : énergie cumulée dans l'unité du capteur
      const eU = this._unit(c.entity_energy, 'kWh'), eV = this._num(c.entity_energy);
      const eD = /^(mwh|gj|gwh)$/i.test(eU) ? 3 : 1;
      r.getElementById('hmlcd').textContent = isNaN(eV) ? '--' : this._fmt(eV, eD);
      r.getElementById('hmlcdu').textContent = isNaN(eV) ? '' : eU;
      // badge radiateur : puissance et ΔT
      r.getElementById('hmpow').textContent = isNaN(power) ? '--' : `${this._fmt(power, power < 10 ? 1 : 0)} kW`;
      r.getElementById('hmdt').textContent = isNaN(dt) ? '' : `ΔT ${this._fmt(dt, 1)}°`;

      r.getElementById('hmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('hmbadge');
      badge.textContent = this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      // températures affichées dans l'unité de HA (°C / °F) via applianceTemp si dispo, sinon en °C
      const tt = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const tmp = (v) => (isNaN(v) ? ['--', '°C'] : tt ? [this._fmt(tt.c(v), 1), tt.unit] : [this._fmt(v, 1), '°C']);
      const room = this._celsius(c.entity_room_temp);
      const vol = this._conv(c.entity_water_volume, VOLUME, 'm³'), en = this._num(c.entity_energy);
      const V = {
        supply: [c.entity_supply_temp, ...tmp(tv)],
        return: [c.entity_return_temp, ...tmp(tr)],
        delta: [c.entity_supply_temp && c.entity_return_temp, this._fmt(tt ? tt.d(dt) : dt, 1), tt && tt.unit === '°F' ? '°F' : 'K'],
        power: [c.entity_power || (c.entity_flow && c.entity_supply_temp && c.entity_return_temp), this._fmt(power, power < 10 ? 1 : 0), 'kW'],
        flow: [c.entity_flow, this._fmt(this._num(c.entity_flow), 1), this._unit(c.entity_flow, 'L/h')],
        energy: [c.entity_energy, this._fmt(en, eD), eU],
        volume: [c.entity_water_volume, this._fmt(vol, 1), 'm³'],
        room: [c.entity_room_temp, ...tmp(room)],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('hot', (k === 'supply' || k === 'power') && heating);
        el.classList.toggle('cold', k === 'return' && heating);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceHeatMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHeatMeterCardEditor extends HTMLElement {
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
      const ent = (name, domain, extra) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(extra || {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_energy', 'sensor'), ent('entity_supply_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_power', 'sensor'),
        ent('entity_flow', 'sensor'), ent('entity_water_volume', 'sensor'), ent('entity_room_temp', 'sensor'),
        { name: 'power_threshold', default: 0.05, selector: { number: { min: 0, max: 5, step: 0.01, mode: 'box', unit_of_measurement: 'kW' } } },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_supply'), bool('show_return'), bool('show_delta'), bool('show_power'), bool('show_flow'), bool('show_energy'), bool('show_volume'), bool('show_room'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceHeatMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Compteur de chaleur à ultrasons animé : départ / retour, radiateur, puissance, ΔT, énergie et débit.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
