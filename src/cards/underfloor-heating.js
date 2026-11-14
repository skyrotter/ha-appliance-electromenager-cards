/* Carte « Plancher chauffant » — custom:appliance-underfloor-heating-card
 * Pièce vue en coupe : dalle en perspective dont le carrelage est retiré à gauche pour montrer
 * le circuit en serpentin, collecteur départ / retour au mur (hydraulique) ou câble chauffant
 * (heating_type: electric), thermostat mural. En chauffe, l'eau ou le courant circule, la dalle
 * rougeoit (--heat) et des ondes de chaleur montent du sol.
 * `surface: wall` : mur chauffant (même circuit, vue de face : l'enduit est retiré à gauche pour montrer le serpentin).
 * États : off, heating, idle (allumé, consigne atteinte), fault. Entité climate (consigne ± et
 * marche / arrêt), switch / input_boolean / binary_sensor (vanne, circulateur) ou puissance seule.
 */
(() => {
  const TAG = 'appliance-underfloor-heating-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n underfloor*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--uf-heat-c:var(--appliance-heat-color,#ff8a3d);--uf-ok:var(--appliance-ok-color,#43a047);
  --uf-alert:var(--appliance-alert-color,#db4437);--heat:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--uf-heat-c) 22%,transparent);color:var(--uf-heat-c)}
.idle .badge{background:color-mix(in srgb,var(--uf-ok) 22%,transparent);color:var(--uf-ok)}
.fault .badge{background:color-mix(in srgb,var(--uf-alert) 22%,transparent);color:var(--uf-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--uf-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:120px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.sm{flex:0 0 40px}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--uf-alert)}

/* ---- illustration ---- */
/* circuit : gris à l'arrêt, rouge (eau chaude) ou orange (câble) en chauffe */
.pipe{fill:none;stroke:#8d969e;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .8s}
.heating .pipe{stroke:#d9483b}.idle .pipe{stroke:#c47a6e}
.elec .pipe{stroke-width:2.6}.elec.heating .pipe{stroke:#ff8a1f;filter:drop-shadow(0 0 2px #ffb15c)}
.flow{fill:none;stroke:#ffd0c4;stroke-width:2;stroke-linecap:round;stroke-dasharray:4 10;opacity:0}
.heating .flow{opacity:.9;animation:ufflow 1.2s linear infinite}
.elec .flow{stroke:#fff3c4;stroke-width:1.2;stroke-dasharray:2 8}
@keyframes ufflow{to{stroke-dashoffset:-28}}
.glow{opacity:calc(var(--heat) * .75);transition:opacity 1.5s}
.glow2{opacity:calc(var(--heat) * .3);transition:opacity 1.5s}
.wave{fill:none;stroke:var(--uf-heat-c);stroke-width:1.6;stroke-linecap:round;opacity:0}
.heating .wave{animation:ufwave 3s ease-in infinite}
.idle .wave{animation:ufwave 5s ease-in infinite;stroke-opacity:.5}
.wave:nth-of-type(2){animation-delay:-.6s!important}.wave:nth-of-type(3){animation-delay:-1.2s!important}.wave:nth-of-type(4){animation-delay:-1.8s!important}.wave:nth-of-type(5){animation-delay:-2.4s!important}
@keyframes ufwave{0%{opacity:0;transform:translateY(6px)}30%{opacity:.8}100%{opacity:0;transform:translateY(-40px)}}
.hyd{display:inline}.elec .hyd{display:none}
.cab{display:none}.elec .cab{display:inline}
.dsp{fill:#ff9f43;font:700 8px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.off .dsp{fill:#5a6470}.fault .dsp{fill:#ff5a4e}.idle .dsp{fill:#7dff9a}
.led{fill:#5b6570}
.heating .led{fill:#ff8a3d;animation:ufblink 1.2s steps(2) infinite}.idle .led{fill:#43a047}.fault .led{fill:#db4437;animation:ufblink .6s steps(2) infinite}
@keyframes ufblink{50%{opacity:.25}}
.noanim *{animation:none!important}
`;

  // serpentin en vue de dessus (0 → 220 × 0 → 80), projeté en perspective par la matrice du groupe
  const COIL = 'M-8 8 H200 Q210 8 210 18 Q210 28 200 28 H20 Q10 28 10 38 Q10 48 20 48 H200 Q210 48 210 58 Q210 68 200 68 H-8';
  const SVG = (label) => `
<svg viewBox="0 0 270 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="ufwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset="1" stop-color="#d9dfe4"/></linearGradient>
  <linearGradient id="ufglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a3d" stop-opacity=".1"/><stop offset="1" stop-color="#ff5a2a" stop-opacity=".75"/></linearGradient>
  <pattern id="uftile" width="27.5" height="20" patternUnits="userSpaceOnUse"><rect width="27.5" height="20" fill="#e9e2d6"/><path d="M0 0 H27.5 M0 0 V20" stroke="#c7bca9" stroke-width="1.4"/></pattern>
  <clipPath id="ufslab"><rect x="0" y="0" width="220" height="80"/></clipPath>
 </defs>
 <ellipse cx="135" cy="164" rx="128" ry="4" fill="#000" opacity=".15"/>
 <!-- mur du fond, fenêtre, thermostat -->
 <path d="M40 18 H262 V118 H40 Z" fill="url(#ufwall)" stroke="#c3cad1"/>
 <rect x="96" y="32" width="58" height="50" rx="2" fill="#bfe0f5" stroke="#9fb3c3" stroke-width="2"/>
 <path d="M125 32 V82 M96 57 H154" stroke="#9fb3c3" stroke-width="2"/>
 <rect x="206" y="44" width="30" height="36" rx="4" fill="#f9fafb" stroke="#b9c1c8"/>
 <rect x="210" y="49" width="22" height="13" rx="2" fill="#1b1e22"/>
 <text class="dsp" id="ufdsp" x="221" y="58.5">--</text>
 <circle class="led" cx="221" cy="71" r="2.2"/>
 <!-- ondes de chaleur qui montent du sol -->
 <g><path class="wave" d="M70 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M110 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M150 112 q4 -5 0 -10 t0 -10"/>
  <path class="wave" d="M190 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M230 112 q4 -5 0 -10 t0 -10"/></g>
 <!-- dalle en perspective : chape et serpentin, carrelage posé à droite -->
 <g transform="matrix(1 0 -.4 .5 40 118)">
  <rect x="0" y="0" width="220" height="80" fill="#cdc6ba"/>
  <g clip-path="url(#ufslab)">
   <path class="pipe" d="${COIL}"/>
   <path class="flow" d="${COIL}"/>
  </g>
  <path d="M120 0 L100 80 H220 V0 Z" fill="url(#uftile)"/>
  <path d="M120 0 L100 80" stroke="#a89c86" stroke-width="2"/>
  <rect class="glow" x="0" y="0" width="220" height="80" fill="url(#ufglow)"/>
 </g>
 <!-- épaisseur de la dalle -->
 <path d="M8 158 H228 L232 158 V164 H8 Z" fill="#9c9486"/>
 <path d="M228 158 L260 118 V124 L232 164 Z" fill="#8a8274"/>
 <!-- collecteur départ / retour (hydraulique) -->
 <g class="hyd">
  <rect x="6" y="64" width="30" height="48" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <rect x="10" y="74" width="22" height="4" rx="2" fill="#d9483b"/><rect x="10" y="94" width="22" height="4" rx="2" fill="#2b7fd9"/>
  <g fill="#5b636b"><circle cx="15" cy="76" r="2.4"/><circle cx="27" cy="76" r="2.4"/><circle cx="15" cy="96" r="2.4"/><circle cx="27" cy="96" r="2.4"/></g>
  <path d="M15 112 V122 M27 112 V128" stroke="#8d969e" stroke-width="3"/>
 </g>
 <!-- boîtier du câble chauffant (électrique) -->
 <g class="cab">
  <rect x="10" y="84" width="22" height="26" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <path d="M21 90 l-4 7 h4 l-2 6 l6 -9 h-4 l2 -4 z" fill="#ff8a1f"/>
  <path d="M21 110 V124" stroke="#ff8a1f" stroke-width="2"/>
 </g>
</svg>`;

  // mur chauffant (surface: wall) : mur vu de face, enduit retiré à gauche pour montrer le serpentin ; mêmes classes que le sol (couleurs, flux, lueur, ondes)
  const WCOIL = 'M24 30 H138 Q148 30 148 40 Q148 50 138 50 H46 Q36 50 36 60 Q36 70 46 70 H138 Q148 70 148 80 Q148 90 138 90 H46 Q36 90 36 100 Q36 110 46 110 H138 Q148 110 148 120 Q148 130 138 130 H24';
  const SVG_WALL = (label) => `
<svg viewBox="0 0 270 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="ufwwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f3f5"/><stop offset="1" stop-color="#dde2e6"/></linearGradient>
  <linearGradient id="ufglow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a3d" stop-opacity=".75"/><stop offset="1" stop-color="#ff5a2a" stop-opacity=".2"/></linearGradient>
  <clipPath id="ufwslab"><rect x="24" y="22" width="126" height="116"/></clipPath>
 </defs>
 <ellipse cx="135" cy="164" rx="128" ry="4" fill="#000" opacity=".15"/>
 <!-- mur, plinthe, sol -->
 <rect x="14" y="14" width="242" height="128" rx="3" fill="url(#ufwwall)" stroke="#c3cad1"/>
 <rect x="0" y="142" width="270" height="20" fill="#b9a98f"/><rect x="14" y="136" width="242" height="6" fill="#e8e4dc" stroke="#c9c2b4" stroke-width=".8"/>
 <!-- enduit retiré : chape et serpentin -->
 <rect x="24" y="22" width="126" height="116" rx="2" fill="#cdc6ba" stroke="#a89c86" stroke-width="1.4"/>
 <g clip-path="url(#ufwslab)"><path class="pipe" d="${WCOIL}"/><path class="flow" d="${WCOIL}"/></g>
 <rect class="glow" x="24" y="22" width="126" height="116" rx="2" fill="url(#ufglow)"/>
 <rect class="glow2" x="150" y="14" width="106" height="122" fill="#ff7a3d"/>
 <!-- ondes de chaleur qui rayonnent du mur -->
 <g><path class="wave" d="M170 128 q4 -5 0 -10 t0 -10"/><path class="wave" d="M188 128 q4 -5 0 -10 t0 -10"/><path class="wave" d="M206 128 q4 -5 0 -10 t0 -10"/>
  <path class="wave" d="M224 128 q4 -5 0 -10 t0 -10"/><path class="wave" d="M242 128 q4 -5 0 -10 t0 -10"/></g>
 <!-- thermostat -->
 <rect x="186" y="34" width="30" height="36" rx="4" fill="#f9fafb" stroke="#b9c1c8"/>
 <rect x="190" y="39" width="22" height="13" rx="2" fill="#1b1e22"/>
 <text class="dsp" id="ufdsp" x="201" y="48.5">--</text>
 <circle class="led" cx="201" cy="61" r="2.2"/>
 <!-- collecteur (hydraulique) / boîtier du câble (électrique) -->
 <g class="hyd">
  <rect x="222" y="86" width="28" height="44" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <rect x="226" y="95" width="20" height="4" rx="2" fill="#d9483b"/><rect x="226" y="113" width="20" height="4" rx="2" fill="#2b7fd9"/>
  <g fill="#5b636b"><circle cx="231" cy="97" r="2.2"/><circle cx="241" cy="97" r="2.2"/><circle cx="231" cy="115" r="2.2"/><circle cx="241" cy="115" r="2.2"/></g>
 </g>
 <g class="cab">
  <rect x="224" y="96" width="24" height="28" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <path d="M236 102 l-4 7 h4 l-2 6 l6 -9 h-4 l2 -4 z" fill="#ff8a1f"/>
 </g>
</svg>`;

  const TILES = [
    ['temp', 'mdi:home-thermometer', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['floor', 'mdi:heating-coil', 'show_floor'],
    ['water', 'mdi:coolant-temperature', 'show_water'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceUnderfloorHeatingCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const re = /plancher|underfloor|floor_heat|fussboden|vloerverwarming/i;
      const f = (r, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && r.test(i)) || '';
      return { entity: f(re, 'climate') || f(re, 'switch'), entity_floor_temp: f(/(plancher|floor|sol).*temp/i, 'sensor') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_temp: true, show_floor: true, show_water: true, show_power: true, show_energy: true, show_cost: true,
        heating_type: 'water', heat_threshold: 20, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    // consigne : attribut temperature d'une entité climate / water_heater, sinon valeur numérique de l'état
    _tgt(id) {
      const s = this._st(id);
      if (s && /^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return s.attributes && s.attributes.temperature != null && isFinite(t) ? t : NaN; }
      return this._num(id);
    }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="uftitle"></div><div class="badge" id="ufbadge"></div></div>
        ${(c.surface === 'wall' ? SVG_WALL : SVG)(c.name || this._t(c.surface === 'wall' ? 'name_wall' : 'name'))}
        <div class="alert" id="ufalert"></div>
        <div class="ctl" id="ufctl">
          <button class="sm" data-a="down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button class="sm" data-a="up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_floor_temp));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ temp: cc.entity_temp || cc.entity, target: cc.entity_target_temp || cc.entity, floor: cc.entity_floor_temp, water: cc.entity_water_temp,
          power: cc.entity_power, energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass, s = this._st(c.entity); if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'power') {
        if (d === 'climate') h.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: s && s.state !== 'off' ? 'off' : 'heat' });
        else h.callService('homeassistant', 'toggle', { entity_id: c.entity });
      } else if (d === 'climate' && s) {
        const a2 = s.attributes || {}, step = Number(a2.target_temp_step) || 0.5, cur = Number(a2.temperature);
        if (!isFinite(cur)) return;
        const lim = (v) => Math.max(Number(a2.min_temp) || -Infinity, Math.min(Number(a2.max_temp) || Infinity, v));
        h.callService('climate', 'set_temperature', { entity_id: c.entity, temperature: lim(cur + (a === 'up' ? step : -step)) });
      }
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), a = (s && s.attributes) || {};
      const pw = this._watts(c.entity_power);
      // températures dans l'unité d'affichage (°C / °F) ; seuils par défaut : sol 29 °C, eau 45 °C
      const tc = window.applianceTemp(this._hass, c), tv = (id) => tc.conv(this._num(id), this._st(id));
      let temp = tv(c.entity_temp);
      if (isNaN(temp) && isFinite(Number(a.current_temperature))) temp = tc.conv(Number(a.current_temperature), s);
      let target = tc.conv(this._tgt(c.entity_target_temp), this._st(c.entity_target_temp));
      if (isNaN(target) && isFinite(Number(a.temperature))) target = tc.conv(Number(a.temperature), s);
      const floor = tv(c.entity_floor_temp), water = tv(c.entity_water_temp);
      const v = { pw, tc, temp, target, floor, water, floorMax: Number(c.floor_max ?? tc.c(29)), waterMax: Number(c.water_max ?? tc.c(45)) };
      const txt = s ? String(s.state).toLowerCase() : '';
      if (/error|erreur|fault|défaut|defaut|alarm/.test(txt)) return { ...v, st: 'fault' };
      if (s && !/^(unavailable|unknown)$/.test(txt)) {
        if (/^(off|false|0|arr[eê]t|éteint|eteint)$/.test(txt)) return { ...v, st: 'off' };
        if (s.entity_id.startsWith('climate.')) {
          // hvac_action fait foi, sinon on compare la pièce à la consigne
          if (a.hvac_action) return { ...v, st: /heat/.test(String(a.hvac_action)) ? 'heating' : /off/.test(String(a.hvac_action)) ? 'off' : 'idle' };
          if (!isNaN(pw)) return { ...v, st: pw > Number(c.heat_threshold) ? 'heating' : 'idle' };
          return { ...v, st: !isNaN(temp) && !isNaN(target) && temp >= target - tc.d(0.2) ? 'idle' : 'heating' };
        }
        if (!isNaN(pw)) return { ...v, st: pw > Number(c.heat_threshold) ? 'heating' : 'idle' };
        return { ...v, st: 'heating' };
      }
      return { ...v, st: !isNaN(pw) && pw > Number(c.heat_threshold) ? 'heating' : 'off' };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, tc, temp, target, floor, water, floorMax, waterMax } = this._compute();
      const clamp = (x) => Math.max(0, Math.min(1, x));
      // lueur de la dalle : température du sol si connue (20 °C → floor_max, calcul en °C), sinon selon l'état
      const heat = !isNaN(floor) ? clamp((tc.toC(floor) - 20) / Math.max(1, tc.toC(floorMax) - 20)) : ({ heating: 0.8, idle: 0.3 }[st] || 0);
      const elec = String(c.heating_type).toLowerCase() === 'electric', wall = c.surface === 'wall';
      card.className = `${st}${elec ? ' elec' : ''}${wall ? ' wall' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--heat', (st === 'off' || st === 'fault' ? 0 : heat).toFixed(3));

      r.getElementById('uftitle').textContent = c.name || this._t(wall ? 'name_wall' : 'name');
      const badge = r.getElementById('ufbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('ufdsp').textContent = st === 'off' ? 'OFF' : st === 'fault' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 1)}°` : 'ON';
      const alerts = [];
      if (!isNaN(floor) && floor > floorMax) alerts.push(this._t(wall ? 'wall_hot' : 'floor_hot'));
      if (!isNaN(water) && water > waterMax) alerts.push(this._t('water_hot'));
      const al = r.getElementById('ufalert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);

      // commandes : marche/arrêt, et consigne ± seulement pour une entité climate
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('ufctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['climate', 'switch', 'input_boolean'].includes(d));
      ctl.querySelector('[data-a="power"] span').textContent = this._t(st === 'off' ? 'turn_on' : 'turn_off');
      ctl.querySelectorAll('.sm').forEach((b) => b.classList.toggle('hide', d !== 'climate'));

      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        temp: [!isNaN(temp), this._fmt(temp, 1), tc.unit],
        target: [!isNaN(target), this._fmt(target, 1), tc.unit],
        floor: [c.entity_floor_temp, this._fmt(floor, 1), tc.unit],
        water: [c.entity_water_temp, this._fmt(water, 0), tc.unit],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      const bad = { floor: !isNaN(floor) && floor > floorMax, water: !isNaN(water) && water > waterMax };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = k === 'floor' && wall && !(c.labels && c.labels.floor) ? this._t('wall') : this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceUnderfloorHeatingCard);

  /* ---- éditeur visuel ---- */
  class ApplianceUnderfloorHeatingCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      // seuils de température dans l'unité d'affichage (bornes et défauts donnés en °C)
      const tc = window.applianceTemp(this._hass, this._c);
      const tnum = (name, min, max, step, def) => ({ name, default: tc.c(def), selector: { number: { ...tc.range(min, max), step, mode: 'box', unit_of_measurement: tc.unit } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_floor_temp', 'sensor'), ent('entity_water_temp', 'sensor'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { name: 'surface', selector: { select: { options: ['floor', 'wall'] } } },
        { name: 'heating_type', selector: { select: { options: ['water', 'electric'] } } },
        { type: 'grid', name: '', schema: [tnum('floor_max', 20, 40, 0.5, 29), tnum('water_max', 25, 70, 1, 45), num('heat_threshold', 0, 5000, 1, 20, 'W')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_temp'), bool('show_floor'), bool('show_water'),
          bool('show_power'), bool('show_energy'), bool('show_cost'), bool('animations'),
        ] },
      ];
      // ici, la température de l'eau est celle du départ du circuit
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'entity_water_temp' ? 'entity_flow_temp' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceUnderfloorHeatingCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Underfloor heating / Plancher chauffant', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Plancher chauffant animé (hydraulique ou électrique) : serpentin, collecteur, sol qui rougeoit, ondes de chaleur, thermostat.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
