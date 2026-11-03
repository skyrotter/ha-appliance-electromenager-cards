/* Carte « Chaudière à gaz » — custom:appliance-gas-boiler-card
 * Chaudière murale gaz : flamme bleue sur rampe de brûleur, circuit départ/retour qui
 * change de couleur avec la température, arrivée gaz, ECS, manomètre, fumées.
 */
(() => {
  const TAG = 'appliance-gas-boiler-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n gas_boiler*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--gb-heat:var(--appliance-heat-color,#ff8a3d);--gb-cold:var(--appliance-cold-color,#2b9af9);
  --gb-alert:var(--appliance-alert-color,#db4437);--gb-ok:var(--appliance-ok-color,#43a047);--gb-flow:#3b8fe8;--gb-ret:#3b8fe8;--mod:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--gb-heat) 22%,transparent);color:var(--gb-heat)}
.dhw .badge{background:color-mix(in srgb,var(--gb-cold) 22%,transparent);color:var(--gb-cold)}
.alarm .badge{background:color-mix(in srgb,var(--gb-alert) 22%,transparent);color:var(--gb-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--gb-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(170px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- illustration ---- */
.flame{transform-box:fill-box;transform-origin:50% 100%;opacity:0;transform:scaleY(.1)}
.burning .flame{opacity:1;transform:scaleY(calc(.45 + .55*var(--mod)));animation:flick .45s ease-in-out infinite alternate}
.burning .flame:nth-child(odd){animation-duration:.33s;animation-delay:-.1s}
.burning .flame:nth-child(3n){animation-duration:.52s;animation-delay:-.2s}
@keyframes flick{0%{transform:scaleY(calc(.45 + .55*var(--mod)))}100%{transform:scaleY(calc(.3 + .5*var(--mod))) scaleX(1.12)}}
.glow{opacity:0;transition:opacity .6s}
.burning .glow{opacity:calc(.35 + .45*var(--mod));animation:pulse 1.6s ease-in-out infinite alternate}
@keyframes pulse{to{opacity:calc(.2 + .35*var(--mod))}}
.puff{opacity:0;transform-box:fill-box;transform-origin:center}
.burning .puff{animation:rise 3.2s ease-out infinite}
.burning .puff:nth-child(2){animation-delay:-1.1s}.burning .puff:nth-child(3){animation-delay:-2.1s}
@keyframes rise{0%{opacity:0;transform:translate(0,8px) scale(.5)}20%{opacity:.7}100%{opacity:0;transform:translate(10px,-34px) scale(1.9)}}
.dash{stroke-dasharray:3 8;opacity:0}
.pump .dash.ch,.burning .dash.gas,.dhw .dash.dhw{opacity:.9}
.dash.down{animation:dd 1s linear infinite}
.dash.up{animation:du 1s linear infinite}
@keyframes dd{to{stroke-dashoffset:-11}}
@keyframes du{to{stroke-dashoffset:11}}
.noanim *{animation:none!important}
.noanim .flame{transform:scaleY(calc(.45 + .55*var(--mod)))}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.dhw .led{fill:#3fa3ff}.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:blink .8s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 15px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.needle{transform-origin:172px 66px;transition:transform .8s}
.off .body-shade{opacity:.55}
`;

  const SVG = `
<svg viewBox="0 0 240 212" role="img" aria-label="gas boiler">
 <defs>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe6"/></linearGradient>
  <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1239ff"/><stop offset=".5" stop-color="#3fa3ff"/><stop offset="1" stop-color="#c9f2ff"/></linearGradient>
  <radialGradient id="gl" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="#4aa8ff" stop-opacity=".85"/><stop offset=".6" stop-color="#2b6cff" stop-opacity=".25"/><stop offset="1" stop-color="#2b6cff" stop-opacity="0"/></radialGradient>
  <linearGradient id="cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e59a5a"/><stop offset="1" stop-color="#a45a28"/></linearGradient>
 </defs>
 <!-- conduit de fumées -->
 <rect x="112" y="8" width="16" height="36" rx="2" fill="#cdd3da" stroke="#9aa3ad" stroke-width="1"/>
 <rect x="108" y="4" width="24" height="7" rx="2" fill="#b4bcc5" stroke="#8f98a3" stroke-width="1"/>
 <g fill="#e8eef4"><circle class="puff" cx="120" cy="6" r="5"/><circle class="puff" cx="118" cy="6" r="4"/><circle class="puff" cx="123" cy="6" r="4.5"/></g>
 <!-- caisson -->
 <rect x="48" y="42" width="144" height="116" rx="11" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="44" y="40" width="152" height="116" rx="11" fill="url(#body)" stroke="#aeb6c0" stroke-width="1.2"/>
 <!-- bandeau de commande -->
 <rect x="56" y="48" width="70" height="26" rx="5" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="91" y="67" id="dsp">--</text>
 <circle class="led" cx="136" cy="55" r="3.4"/>
 <circle cx="138" cy="67" r="4.5" fill="#c8cfd7" stroke="#9aa3ad"/><circle cx="152" cy="67" r="4.5" fill="#c8cfd7" stroke="#9aa3ad"/>
 <!-- manomètre -->
 <circle cx="172" cy="66" r="15" fill="#f6f8fa" stroke="#9aa3ad" stroke-width="1.4"/>
 <path d="M160.5 73 A13 13 0 0 1 183.5 73" fill="none" stroke="#e1e5ea" stroke-width="3"/>
 <path id="okarc" d="M165 63 A13 13 0 0 1 179 63" fill="none" stroke="#43a047" stroke-width="3" stroke-linecap="round"/>
 <line class="needle" id="needle" x1="172" y1="66" x2="172" y2="55" stroke="#db4437" stroke-width="1.8" stroke-linecap="round"/>
 <circle cx="172" cy="66" r="2.2" fill="#444"/>
 <!-- fenêtre de combustion -->
 <rect x="56" y="82" width="128" height="62" rx="7" fill="#0f1620" stroke="#2a3340" stroke-width="1.5"/>
 <!-- échangeur cuivre -->
 <g fill="none" stroke="url(#cu)" stroke-width="3" stroke-linecap="round" opacity=".95">
  <path d="M66 90 H174"/><path d="M66 97 H174"/><path d="M66 104 H174"/>
 </g>
 <g stroke="#e5a468" stroke-width="1" opacity=".6"><path d="M70 88 v18 M82 88 v18 M94 88 v18 M106 88 v18 M118 88 v18 M130 88 v18 M142 88 v18 M154 88 v18 M166 88 v18"/></g>
 <rect class="glow" x="56" y="82" width="128" height="62" rx="7" fill="url(#gl)"/>
 <!-- rampe de brûleur + flammes -->
 <g id="flames"></g>
 <rect x="66" y="130" width="108" height="8" rx="3" fill="#6a7480" stroke="#4a535e"/>
 <g fill="#2a323b" id="ports"></g>
 <path d="M62 86 L84 86 L62 108Z" fill="#fff" opacity=".07"/>
 <!-- platine -->
 <rect x="44" y="156" width="152" height="9" rx="3" fill="#aab3bd"/>
 <!-- tuyauteries -->
 <g stroke-linecap="round">
  <line x1="62" y1="165" x2="62" y2="202" style="stroke:var(--gb-flowc,#3b8fe8)" stroke-width="8"/>
  <line x1="91" y1="165" x2="91" y2="202" stroke="#f0883e" stroke-width="8"/>
  <line x1="120" y1="165" x2="120" y2="202" stroke="#f5c518" stroke-width="8"/>
  <line x1="149" y1="165" x2="149" y2="202" stroke="#3b8fe8" stroke-width="8"/>
  <line x1="178" y1="165" x2="178" y2="202" style="stroke:var(--gb-retc,#3b8fe8)" stroke-width="8"/>
 </g>
 <g fill="#8c95a0"><rect x="57" y="172" width="10" height="5" rx="1"/><rect x="86" y="172" width="10" height="5" rx="1"/><rect x="115" y="172" width="10" height="5" rx="1"/><rect x="144" y="172" width="10" height="5" rx="1"/><rect x="173" y="172" width="10" height="5" rx="1"/></g>
 <g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">
  <line class="dash ch down" x1="62" y1="167" x2="62" y2="200"/>
  <line class="dash dhw down" x1="91" y1="167" x2="91" y2="200"/>
  <line class="dash gas up" x1="120" y1="200" x2="120" y2="167"/>
  <line class="dash dhw up" x1="149" y1="200" x2="149" y2="167"/>
  <line class="dash ch up" x1="178" y1="200" x2="178" y2="167"/>
 </g>
</svg>`;

  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['gas', 'mdi:fire', 'show_gas'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps'],
    ['pressure', 'mdi:gauge', 'show_pressure'],
    ['mod', 'mdi:percent-circle', 'show_modulation'],
  ];

  class ApplianceGasBoilerCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/chaudiere|boiler|gaz|gas/i, 'climate') || f(/chaudiere|boiler|gaz|gas/i, 'sensor'),
        entity_power: f(/(chaudiere|boiler|gaz|gas).*(power|puissance)/i, 'sensor'),
        entity_gas: f(/(gaz|gas).*(conso|consum|m3|volume|daily|jour)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_gas: true, show_cost: true, show_temps: true,
        show_pressure: true, show_modulation: true, show_status: true, threshold: 15, off_threshold: 0.5,
        pressure_min: 1, pressure_max: 2.5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { const l = (this._c.language || (this._hass && this._hass.language) || 'en').slice(0, 2); return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _watts(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = ((this._st(id).attributes || {}).unit_of_measurement || '').toLowerCase();
      return u === 'kw' ? v * 1000 : v;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${SVG}
        <div class="alert" id="alert"></div>
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // flammes bleues sur la rampe : 11 becs
      const fl = root.getElementById('flames'); const ports = root.getElementById('ports');
      let f = '', p = '';
      for (let i = 0; i < 11; i++) {
        const x = 72 + i * 9.6;
        f += `<path class="flame" d="M${x} 130 C${x - 4} 124 ${x - 3.5} 117 ${x} 108 C${x + 3.5} 117 ${x + 4} 124 ${x} 130Z" fill="url(#fl)"/>`;
        p += `<rect x="${x - 2}" y="132" width="4" height="3" rx="1"/>`;
      }
      fl.innerHTML = f; ports.innerHTML = p;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      let txt = '';
      if (stObj) {
        txt = String(stObj.state).toLowerCase();
        const a = stObj.attributes || {};
        if (a.hvac_action) txt += ' ' + String(a.hvac_action).toLowerCase();
      }
      const flameEnt = this._st(c.entity_flame);
      const flame = flameEnt ? flameEnt.state === 'on' : null;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt) && flame !== true) st = 'off';
      else if (/dhw|ecs|hot.?water|eau chaude|sanitaire|water_heat/.test(txt)) st = 'dhw';
      else if (/heat|chauff|ignit|allum|burn|brûl|brul|running|^on/.test(txt) || flame === true) st = 'heating';
      else if (txt) st = 'standby';
      else if (flame === false) st = 'standby';
      else if (!isNaN(pw)) st = pw > c.threshold ? 'heating' : (pw > c.off_threshold ? 'standby' : 'off');
      else st = 'standby';
      if (flame === false && (st === 'heating' || st === 'dhw') && /standby|idle|veille/.test(txt)) st = 'standby';
      const burning = st === 'heating' || st === 'dhw';
      const pump = burning || (!isNaN(pw) && pw > c.threshold);
      return { st, burning, pump, pw };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, h = this._hass, card = this._card, r = this._root;
      const { st, burning, pump, pw } = this._compute();
      // températures dans l'unité d'affichage (°C / °F) ; flow_temp_max par défaut : 80 °C
      const tc = window.applianceTemp(h, c), tv = (id) => tc.conv(this._num(id), this._st(id));
      const flow = tv(c.entity_flow_temp), ret = tv(c.entity_return_temp), flowMax = c.flow_temp_max ?? tc.c(80);
      const press = this._num(c.entity_pressure);
      let mod = this._num(c.entity_modulation); mod = isNaN(mod) ? 1 : Math.max(0, Math.min(100, mod)) / 100;
      card.className = `${st} ${burning ? 'burning' : ''} ${pump ? 'pump' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--mod', mod);
      // couleur des tuyaux : bleu à 25 °C, rouge à 75 °C
      const pipe = (t, d) => isNaN(t) ? d : `color-mix(in srgb, #e5392b ${Math.round(Math.max(0, Math.min(1, (tc.toC(t) - 25) / 50)) * 100)}%, #3b8fe8)`;
      card.style.setProperty('--gb-flowc', pipe(flow, '#e5533d'));
      card.style.setProperty('--gb-retc', pipe(ret, '#3b8fe8'));

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const dsp = !isNaN(flow) && st !== 'off' ? `${Math.round(flow)}°` : (st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : st === 'dhw' ? 'ECS' : st === 'heating' ? 'CH' : '--');
      r.getElementById('dsp').textContent = dsp;

      // manomètre : 0–4 bar sur 180°, zone verte = pressure_min..pressure_max
      const ang = (p) => -90 + Math.max(0, Math.min(4, p)) / 4 * 180;
      r.getElementById('needle').style.transform = `rotate(${isNaN(press) ? -90 : ang(press)}deg)`;
      const pt = (p) => { const a = (ang(p) - 90) * Math.PI / 180; return [172 + 13 * Math.cos(a), 66 + 13 * Math.sin(a)]; };
      const [x1, y1] = pt(c.pressure_min), [x2, y2] = pt(c.pressure_max);
      r.getElementById('okarc').setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A13 13 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);

      // alertes
      let al = '';
      if (!isNaN(press) && press < c.pressure_min) al = `${this._t('lowp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(press) && press > c.pressure_max) al = `${this._t('highp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(flow) && flow > flowMax) al = this._t('hotf');
      const ae = r.getElementById('alert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy), gas = this._num(c.entity_gas);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, '€');
      if (isNaN(cost) && c.price_per_unit && !isNaN(gas)) { cost = gas * Number(c.price_per_unit); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        gas: [c.entity_gas, this._fmt(gas, 2), this._unit(c.entity_gas, 'm³')],
        cost: [c.entity_cost || (c.price_per_unit && c.entity_gas), this._fmt(cost, 2), costU],
        flow: [c.entity_flow_temp, this._fmt(flow, 1), tc.unit],
        ret: [c.entity_return_temp, this._fmt(ret, 1), tc.unit],
        pressure: [c.entity_pressure, this._fmt(press, 2), 'bar'],
        mod: [c.entity_modulation, this._fmt(mod * 100, 0), '%'],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = k === 'cost' ? c.entity_cost : c['entity_' + (k === 'ret' ? 'return_temp' : k === 'flow' ? 'flow_temp' : k === 'mod' ? 'modulation' : k)]; if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceGasBoilerCard);

  /* ---- éditeur visuel ---- */
  class ApplianceGasBoilerCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_status'), ent('entity_flame', 'binary_sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_gas', 'sensor'), ent('entity_cost', 'sensor'), { name: 'price_per_unit', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_pressure', 'sensor'), ent('entity_modulation', 'sensor'),
        { type: 'grid', name: '', schema: [
          { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
        ] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_gas', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true }, { name: 'show_temps', selector: { boolean: {} }, default: true },
          { name: 'show_pressure', selector: { boolean: {} }, default: true }, { name: 'show_modulation', selector: { boolean: {} }, default: true },
          { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceGasBoilerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Chaudière gaz / Gas boiler',
    description: 'Chaudière gaz animée : flamme, départ/retour, ECS, pression, conso élec et gaz.', preview: true,
  });
})();
