/* Carte « Sauna » — custom:appliance-sauna-card
 * Cabine en lames de bois vue de face : porte vitrée teintée, poêle et pierres visibles à travers
 * la vitre, banquette, plafonnier, conduit de ventilation sur le toit, thermomètre et panneau.
 * États : off, heating, ready, cooling, fault. La lueur du poêle suit la température
 * (--heat, 0 → 1 de 25 °C à la consigne ; °C ou °F selon temperature_unit / Home Assistant), ondes de chaleur en chauffe, vapeur au conduit,
 * thermomètre animé, boutons marche/arrêt et consigne ± pour une entité climate.
 */
(() => {
  const TAG = 'appliance-sauna-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n sauna*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sn-heat-c:var(--appliance-heat-color,#ff8a3d);--sn-ok:var(--appliance-ok-color,#43a047);
  --sn-cold:var(--appliance-cold-color,#2b9af9);--sn-alert:var(--appliance-alert-color,#db4437);--heat:0;--tf:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--sn-heat-c) 22%,transparent);color:var(--sn-heat-c)}
.ready .badge{background:color-mix(in srgb,var(--sn-ok) 22%,transparent);color:var(--sn-ok)}
.cooling .badge{background:color-mix(in srgb,var(--sn-cold) 22%,transparent);color:var(--sn-cold)}
.fault .badge{background:color-mix(in srgb,var(--sn-alert) 22%,transparent);color:var(--sn-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--sn-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(250px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
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
.tile.bad .v{color:var(--sn-alert)}

/* ---- illustration ---- */
/* lueur du poêle et de la cabine : proportionnelle à --heat */
.glow{opacity:calc(var(--heat) * .9);transition:opacity 1.5s}
.stones{fill:#5e5a57;transition:fill 1.5s}
.heating .stones,.ready .stones{fill:#7a4a3a}
.ember{opacity:0;transform-box:fill-box;transform-origin:center}
.heating .ember,.ready .ember{opacity:calc(.35 + var(--heat) * .65);animation:snember 1.6s ease-in-out infinite alternate}
.ember:nth-child(2n){animation-delay:-.7s!important}.ember:nth-child(3n){animation-delay:-1.1s!important}
@keyframes snember{to{opacity:.25}}
/* ondes de chaleur au-dessus des pierres */
.wave{fill:none;stroke:#ffd9a0;stroke-width:1.4;stroke-linecap:round;opacity:0}
.heating .wave,.ready .wave{animation:snwave 2.4s ease-in infinite}
.wave:nth-child(2){animation-delay:-.8s!important}.wave:nth-child(3){animation-delay:-1.6s!important}
@keyframes snwave{0%{opacity:0;transform:translateY(0)}30%{opacity:.75}100%{opacity:0;transform:translateY(-34px)}}
/* vapeur au conduit du toit */
.steam{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center}
.heating .steam,.ready .steam{animation:snsteam 3.2s ease-out infinite}
.cooling .steam{animation:snsteam 5s ease-out infinite}
.steam:nth-child(2){animation-delay:-.8s!important}.steam:nth-child(3){animation-delay:-1.6s!important}.steam:nth-child(4){animation-delay:-2.4s!important}
@keyframes snsteam{0%{opacity:0;transform:translate(0,4px) scale(.4)}25%{opacity:.55}100%{opacity:0;transform:translate(10px,-34px) scale(2)}}
.cooling .steam{fill:#cfd8e0}
.lightbulb{opacity:0;transition:opacity .6s}
.heating .lightbulb,.ready .lightbulb{opacity:1}
.therm{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--tf));transition:transform 1.2s ease-out}
.led{fill:#5b6570}
.heating .led{fill:#ff8a3d;animation:snblink 1.2s steps(2) infinite}.ready .led{fill:#43a047}.cooling .led{fill:#3fa3ff}.fault .led{fill:#db4437;animation:snblink .6s steps(2) infinite}
@keyframes snblink{50%{opacity:.25}}
.dsp{fill:#ff9f43;font:700 9px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.off .dsp{fill:#5a6470}.fault .dsp{fill:#ff5a4e}
.off .glass{filter:brightness(.8)}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 260 190" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="snwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8743b"/><stop offset=".5" stop-color="#d39457"/><stop offset="1" stop-color="#a9672f"/></linearGradient>
  <linearGradient id="snglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2420"/><stop offset="1" stop-color="#14110f"/></linearGradient>
  <radialGradient id="snglow" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".95"/><stop offset=".55" stop-color="#ff6a1f" stop-opacity=".4"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
  <linearGradient id="snroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d959c"/><stop offset="1" stop-color="#5d656c"/></linearGradient>
  <linearGradient id="snstove" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3f45"/><stop offset=".5" stop-color="#5b626a"/><stop offset="1" stop-color="#2c3136"/></linearGradient>
  <clipPath id="sndoor"><rect x="98" y="52" width="58" height="114" rx="3"/></clipPath>
 </defs>
 <ellipse cx="130" cy="180" rx="104" ry="6" fill="#000" opacity=".18"/>
 <!-- vapeur au conduit -->
 <g><ellipse class="steam" cx="196" cy="10" rx="7" ry="5"/><ellipse class="steam" cx="200" cy="8" rx="6" ry="4"/><ellipse class="steam" cx="193" cy="12" rx="8" ry="5"/><ellipse class="steam" cx="198" cy="9" rx="6" ry="4"/></g>
 <rect x="190" y="12" width="12" height="16" rx="1.5" fill="#6d757c"/><rect x="187" y="10" width="18" height="4" rx="1" fill="#4a5158"/>
 <!-- cabine en lames verticales -->
 <rect x="44" y="30" width="172" height="144" fill="url(#snwood)"/>
 <g stroke="#8a5528" stroke-width="1" opacity=".6"><path id="snslats"/></g>
 <rect x="44" y="30" width="172" height="144" fill="none" stroke="#7a4a22" stroke-width="1"/>
 <!-- toit en débord -->
 <rect x="34" y="22" width="192" height="10" rx="2" fill="url(#snroof)"/>
 <path d="M36 23 H224" stroke="#fff" stroke-width="1" opacity=".35"/>
 <!-- socle -->
 <rect x="38" y="172" width="184" height="7" rx="2" fill="#a7afb6"/>
 <!-- applique au-dessus de la porte -->
 <rect x="119" y="36" width="16" height="6" rx="2" fill="#3a3f45"/>
 <ellipse class="lightbulb" cx="127" cy="44" rx="16" ry="6" fill="#ffd27a" opacity=".6"/>
 <!-- porte vitrée : intérieur visible -->
 <rect x="94" y="48" width="66" height="122" rx="4" fill="#3a3f45"/>
 <g clip-path="url(#sndoor)" class="glass">
  <rect x="98" y="52" width="58" height="114" fill="url(#snglass)"/>
  <rect class="glow" x="80" y="52" width="94" height="114" fill="url(#snglow)"/>
  <!-- banquettes -->
  <rect x="98" y="96" width="58" height="6" fill="#6b4524" opacity=".85"/><rect x="98" y="122" width="58" height="6" fill="#6b4524" opacity=".85"/>
  <!-- poêle et pierres -->
  <rect x="112" y="138" width="30" height="28" rx="2" fill="url(#snstove)"/>
  <g class="stones"><circle cx="117" cy="137" r="5"/><circle cx="126" cy="135" r="6"/><circle cx="136" cy="137" r="5"/><circle cx="121" cy="131" r="4"/><circle cx="132" cy="131" r="4.5"/></g>
  <g fill="#ff7a2a"><circle class="ember" cx="119" cy="136" r="1.6"/><circle class="ember" cx="127" cy="133" r="1.8"/><circle class="ember" cx="134" cy="136" r="1.5"/><circle class="ember" cx="124" cy="139" r="1.3"/><circle class="ember" cx="131" cy="131" r="1.4"/></g>
  <g><path class="wave" d="M118 126 q3 -4 0 -8 t0 -8"/><path class="wave" d="M127 124 q3 -4 0 -8 t0 -8"/><path class="wave" d="M136 126 q3 -4 0 -8 t0 -8"/></g>
  <path d="M102 56 L118 56 L104 120 Z" fill="#fff" opacity=".07"/>
 </g>
 <rect x="98" y="52" width="58" height="114" rx="3" fill="none" stroke="#1d2125" stroke-width="1.5"/>
 <rect x="148" y="94" width="4" height="30" rx="2" fill="#c9a06a" stroke="#7a4a22" stroke-width=".6"/>
 <!-- thermomètre -->
 <rect x="62" y="62" width="14" height="86" rx="7" fill="#f3efe8" stroke="#7a4a22" stroke-width=".8"/>
 <rect x="67" y="68" width="4" height="70" rx="2" fill="#d9d2c6"/>
 <rect class="therm" x="67" y="68" width="4" height="70" rx="2" fill="#e53935"/>
 <circle cx="69" cy="141" r="4.5" fill="#e53935"/>
 <g stroke="#7a4a22" stroke-width=".7"><path d="M72 76 H75 M72 90 H75 M72 104 H75 M72 118 H75 M72 132 H75"/></g>
 <!-- panneau de commande -->
 <rect x="172" y="84" width="30" height="34" rx="4" fill="#1b1e22" stroke="#3a3f45"/>
 <rect x="176" y="89" width="22" height="13" rx="2" fill="#0d0f11"/>
 <text class="dsp" x="187" y="99" id="sndsp">--</text>
 <circle class="led" cx="181" cy="110" r="2.2"/><circle cx="193" cy="110" r="2.6" fill="#3a3f45" stroke="#6d757c" stroke-width=".6"/>
</svg>`;

  const TILES = [
    ['temp', 'mdi:thermometer', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['humidity', 'mdi:water-percent', 'show_humidity'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceSaunaCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity: f(/sauna/i, 'climate') || f(/sauna/i, 'switch'),
        entity_power: f(/sauna.*(power|puissance)/i, 'sensor'),
        entity_temp: f(/sauna.*temp/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_temp: true, show_humidity: true, show_power: true, show_energy: true, show_cost: true,
        heater_threshold: 300, off_threshold: 5, ...c };
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
        <div class="head"><div class="title" id="sntitle"></div><div class="badge" id="snbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="snalert"></div>
        <div class="ctl" id="snctl">
          <button class="sm" data-a="down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button class="sm" data-a="up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      // lames de bois verticales de part et d'autre de la porte
      let d = '';
      for (let x = 54; x < 216; x += 10) if (x < 94 || x > 160) d += `M${x} 32 V172 `;
      root.getElementById('snslats').setAttribute('d', d);
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_temp));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ temp: cc.entity_temp || cc.entity, target: cc.entity_target_temp || cc.entity, humidity: cc.entity_humidity, power: cc.entity_power,
          energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k]);
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
        const a2 = s.attributes || {}, step = Number(a2.target_temp_step) || 1, cur = Number(a2.temperature);
        if (!isFinite(cur)) return;
        const lim = (v) => Math.max(Number(a2.min_temp) || -Infinity, Math.min(Number(a2.max_temp) || Infinity, v));
        h.callService('climate', 'set_temperature', { entity_id: c.entity, temperature: lim(cur + (a === 'up' ? step : -step)) });
      }
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), a = (s && s.attributes) || {};
      const pw = this._watts(c.entity_power);
      // températures dans l'unité d'affichage (°C / °F) ; réglages par défaut écrits en °C, convertis
      const tc = window.applianceTemp(this._hass, c);
      let temp = tc.conv(this._num(c.entity_temp), this._st(c.entity_temp));
      if (isNaN(temp) && isFinite(Number(a.current_temperature))) temp = tc.conv(Number(a.current_temperature), s);
      let target = tc.conv(this._tgt(c.entity_target_temp), this._st(c.entity_target_temp));
      if (isNaN(target) && isFinite(Number(a.temperature))) target = tc.conv(Number(a.temperature), s);
      if (isNaN(target)) target = Number(c.target_temp ?? tc.c(80));
      const t = { tc, temp, target, tMax: Number(c.temp_max ?? tc.c(110)), tScale: Number(c.temp_scale ?? tc.c(120)) };
      const txt = s ? String(s.state).toLowerCase() : '';
      let on;
      if (/error|erreur|fault|défaut|defaut|alarm/.test(txt)) return { st: 'fault', pw, ...t };
      if (s && !/^(unavailable|unknown)$/.test(txt)) on = !/^(off|false|0|arr[eê]t|éteint|eteint)$/.test(txt);
      else on = !isNaN(pw) && pw > Number(c.off_threshold);
      let st;
      if (!on) st = !isNaN(temp) && temp > tc.c(40) ? 'cooling' : 'off';
      else if (!isNaN(temp)) st = temp >= target - Number(c.ready_margin ?? tc.d(3)) ? 'ready' : 'heating';
      else if (a.hvac_action) st = /heat/.test(String(a.hvac_action)) ? 'heating' : 'ready';
      else st = !isNaN(pw) && pw < Number(c.heater_threshold) ? 'ready' : 'heating';
      return { st, pw, ...t };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, tc, temp, target, tMax, tScale } = this._compute();
      const clamp = (v) => Math.max(0, Math.min(1, v));
      // lueur et thermomètre calculés en °C
      const heat = !isNaN(temp) ? clamp((tc.toC(temp) - 25) / Math.max(1, tc.toC(target) - 25)) : ({ heating: 0.6, ready: 1, cooling: 0.3 }[st] || 0);
      card.className = `${st} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--heat', (st === 'off' || st === 'fault' ? 0 : heat).toFixed(3));
      card.style.setProperty('--tf', (isNaN(temp) ? 0 : clamp(tc.toC(temp) / (tc.toC(tScale) || 120))).toFixed(3));

      r.getElementById('sntitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('snbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('sndsp').textContent = st === 'off' ? 'OFF' : st === 'fault' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 0)}°` : 'ON';
      const hot = !isNaN(temp) && temp > tMax;
      const al = r.getElementById('snalert'); al.textContent = hot ? `${this._t('overheat')} (${this._fmt(temp, 0)} ${tc.unit})` : ''; al.classList.toggle('on', hot);

      // commandes : marche/arrêt, et consigne ± seulement pour une entité climate
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('snctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['climate', 'switch', 'input_boolean'].includes(d));
      const isOn = st === 'heating' || st === 'ready';
      ctl.querySelector('[data-a="power"] span').textContent = this._t(isOn ? 'turn_off' : 'turn_on');
      ctl.querySelectorAll('.sm').forEach((b) => b.classList.toggle('hide', d !== 'climate'));

      const energy = this._num(c.entity_energy), hum = this._num(c.entity_humidity);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        temp: [!isNaN(temp), this._fmt(temp, 0), tc.unit],
        target: [!isNaN(target), this._fmt(target, 0), tc.unit],
        humidity: [c.entity_humidity, this._fmt(hum, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'temp' && hot);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSaunaCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSaunaCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      // champs de température dans l'unité d'affichage (bornes données en °C) ; dlt : écart (marge)
      const tc = window.applianceTemp(this._hass, this._c);
      const tnum = (name, min, max, step) => ({ name, selector: { number: { ...tc.range(min, max), step, mode: 'box', unit_of_measurement: tc.unit } } });
      const dlt = (name, max, step) => ({ name, selector: { number: { min: 0, max: Math.ceil(tc.d(max)), step, mode: 'box', unit_of_measurement: tc.unit } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_humidity', 'sensor'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          tnum('target_temp', 40, 120, 1), dlt('ready_margin', 20, 0.5),
          num('heater_threshold', 0, 15000, 10, 'W'), num('off_threshold', 0, 500, 0.5, 'W'),
          tnum('temp_max', 60, 140, 1), tnum('temp_scale', 60, 150, 1),
        ] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_temp'), bool('show_humidity'),
          bool('show_power'), bool('show_energy'), bool('show_cost'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSaunaCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Sauna', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Cabine de sauna animée : lueur du poêle selon la température, ondes de chaleur, vapeur, thermomètre, consommation.', preview: true,
  });
})();
