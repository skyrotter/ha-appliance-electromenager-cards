/* Carte « Onduleur » — custom:appliance-ups-card
 * Prise murale → onduleur tour → box et NAS protégés. Le courant circule dans les câbles ;
 * sur batterie, le secteur s'éteint (éclair barré), l'écran passe à l'orange, l'onduleur bipe
 * et le courant part de la batterie. La batterie visible sur le flanc suit la charge (--bat),
 * la barre de LED suit la charge connectée (--load).
 * États : online, charging, on_battery, low_battery, offline, unavailable. Lit le statut de
 * l'intégration NUT (codes « OL », « OB », « LB », « CHRG », « RB », « OVER » ou texte « Online »,
 * « On Battery »…), un binary_sensor (on = secteur présent) ou, à défaut, la tension d'entrée.
 */
(() => {
  const TAG = 'appliance-ups-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n ups*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--up-ok:var(--appliance-ok-color,#43a047);--up-warn:#ffa31a;
  --up-alert:var(--appliance-alert-color,#db4437);--up-cold:var(--appliance-cold-color,#2b9af9);--bat:1;--load:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--up-ok) 22%,transparent);color:var(--up-ok)}
.charging .badge{background:color-mix(in srgb,var(--up-cold) 22%,transparent);color:var(--up-cold)}
.on_battery .badge{background:color-mix(in srgb,var(--up-warn) 22%,transparent);color:var(--up-warn)}
.low_battery .badge,.offline .badge{background:color-mix(in srgb,var(--up-alert) 22%,transparent);color:var(--up-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--up-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--up-alert)}

/* ---- illustration ---- */
/* courant dans les câbles : depuis le secteur en temps normal, depuis la batterie en coupure */
.cable{fill:none;stroke:#3a4148;stroke-width:4;stroke-linecap:round}
.amp{fill:none;stroke:#ffd43b;stroke-width:2;stroke-linecap:round;stroke-dasharray:4 8;opacity:0;transition:opacity .4s}
.online .amp,.charging .amp{opacity:1;animation:upflow .7s linear infinite}
.on_battery .amp.out,.low_battery .amp.out{opacity:1;stroke:#ff9f1a;animation:upflow 1s linear infinite}
@keyframes upflow{to{stroke-dashoffset:-24}}
.mains{transition:opacity .4s}
.on_battery .mains,.low_battery .mains,.offline .mains{opacity:.35}
.cut{opacity:0;transition:opacity .3s}
.on_battery .cut,.low_battery .cut,.offline .cut{opacity:1}
/* batterie visible sur le flanc */
.batf{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--bat));transition:transform 1.2s,fill .5s;fill:#43a047}
.lowbat .batf{fill:#e53935}.midbat .batf{fill:#fb8c00}
.charging .batf{animation:upchg 1.6s ease-in-out infinite}
@keyframes upchg{50%{opacity:.55}}
/* écran : vert sur secteur, orange sur batterie, rouge batterie faible */
.lcdbg{fill:#14301c;transition:fill .4s}
.on_battery .lcdbg{fill:#3d2a08}.low_battery .lcdbg{fill:#3d0f0c}.offline .lcdbg{fill:#111}
.lcd{fill:#7dff9a;font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.lcds{fill:#7dff9a;font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;opacity:.85}
.on_battery .lcd,.on_battery .lcds{fill:#ffb84d}.low_battery .lcd,.low_battery .lcds{fill:#ff6b5e}.offline .lcd,.offline .lcds{fill:#4a4f56}
.low_battery .lcd{animation:upblink .6s steps(2) infinite}
/* barre de charge connectée : 5 LED allumées selon --load */
.ld{fill:#2b3036}
.ld.on{fill:#43a047}.ld.on.hi{fill:#fb8c00}.ld.on.max{fill:#e53935}
.pwr{fill:#3a4148}
.online .pwr,.charging .pwr{fill:#3ddc5a;filter:drop-shadow(0 0 3px #3ddc5a)}
.on_battery .pwr{fill:#ffb31a;filter:drop-shadow(0 0 3px #ffb31a);animation:upblink 1s steps(2) infinite}
.low_battery .pwr{fill:#ff3b30;animation:upblink .5s steps(2) infinite}
/* bips de l'alarme sur batterie */
.beep{fill:none;stroke:#ffb31a;stroke-width:1.6;stroke-linecap:round;opacity:0}
.on_battery .beep,.low_battery .beep{animation:upbeep 1.2s ease-out infinite}
.low_battery .beep{stroke:#ff3b30;animation-duration:.6s}
.beep:nth-of-type(2){animation-delay:.2s!important}
@keyframes upbeep{0%{opacity:0;transform:translateX(0)}20%{opacity:1}100%{opacity:0;transform:translateX(5px)}}
.dev{transition:opacity .4s}
.offline .dev{opacity:.4}
.devled{fill:#3ddc5a;animation:upblink 1.4s steps(2) infinite}
.devled:nth-of-type(2n){animation-delay:-.5s}
.offline .devled{fill:#4a4f56;animation:none}
@keyframes upblink{50%{opacity:.3}}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 270 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="upbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2f35"/><stop offset=".5" stop-color="#3c434a"/><stop offset="1" stop-color="#23282d"/></linearGradient>
  <linearGradient id="upside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1f23"/><stop offset="1" stop-color="#2a2f35"/></linearGradient>
 </defs>
 <ellipse cx="135" cy="160" rx="128" ry="5" fill="#000" opacity=".18"/>
 <!-- prise murale -->
 <g class="mains">
  <rect x="8" y="70" width="34" height="40" rx="5" fill="#eef1f4" stroke="#b9c1c8"/>
  <circle cx="25" cy="90" r="11" fill="#dfe4e8" stroke="#b9c1c8"/><circle cx="21" cy="90" r="1.8" fill="#5b636b"/><circle cx="29" cy="90" r="1.8" fill="#5b636b"/>
  <path d="M25 52 l-6 10 h5 l-3 8 l9 -12 h-5 l3 -6 z" fill="#ffd43b"/>
 </g>
 <g class="cut"><path d="M25 52 l-6 10 h5 l-3 8 l9 -12 h-5 l3 -6 z" fill="#8a9097"/><path d="M15 54 L36 70" stroke="#e53935" stroke-width="2.6" stroke-linecap="round"/></g>
 <!-- câble secteur → onduleur -->
 <path class="cable" d="M25 101 V140 Q25 148 33 148 H82 Q90 148 90 140 V132"/>
 <path class="amp" d="M25 101 V140 Q25 148 33 148 H82 Q90 148 90 140 V132"/>
 <!-- onduleur tour -->
 <path d="M126 30 L144 22 V142 L126 150 Z" fill="url(#upside)"/>
 <rect x="76" y="30" width="50" height="120" rx="5" fill="url(#upbody)" stroke="#16191c"/>
 <path d="M76 36 Q76 30 82 30 L100 22 H138 Q144 22 144 22 L126 30 Z" fill="#4a5158"/>
 <!-- batterie visible par la grille du flanc -->
 <rect x="130" y="50" width="10" height="64" rx="2" fill="#16191c" transform="skewY(-24) translate(0 58)"/>
 <g transform="skewY(-24) translate(0 58)"><rect x="131.5" y="52" width="7" height="60" rx="1.5" fill="#262b30"/><rect class="batf" x="131.5" y="52" width="7" height="60" rx="1.5"/></g>
 <rect x="84" y="42" width="34" height="26" rx="3" class="lcdbg" stroke="#0d0f11"/>
 <text class="lcd" id="uplcd" x="101" y="56">--</text>
 <text class="lcds" id="uplcds" x="101" y="64">UPS</text>
 <g id="upleds"><rect class="ld" x="86" y="76" width="5" height="4" rx="1"/><rect class="ld" x="92.5" y="76" width="5" height="4" rx="1"/><rect class="ld" x="99" y="76" width="5" height="4" rx="1"/><rect class="ld" x="105.5" y="76" width="5" height="4" rx="1"/><rect class="ld" x="112" y="76" width="5" height="4" rx="1"/></g>
 <circle cx="101" cy="98" r="8" fill="#1b1f23" stroke="#4a5158"/>
 <path d="M101 93 V98 M97.5 95 A5 5 0 1 0 104.5 95" fill="none" stroke="#8a9097" stroke-width="1.4" stroke-linecap="round"/>
 <circle class="pwr" cx="101" cy="112" r="2.4"/>
 <g stroke="#1b1f23" stroke-width="1.2"><path d="M84 122 H118 M84 127 H118 M84 132 H118 M84 137 H118"/></g>
 <path class="beep" d="M150 48 q5 6 0 12"/><path class="beep" d="M155 44 q7 10 0 20"/>
 <!-- câble onduleur → appareils protégés -->
 <path class="cable" d="M112 132 V140 Q112 148 120 148 H200 Q208 148 208 140 V128"/>
 <path class="amp out" d="M112 132 V140 Q112 148 120 148 H200 Q208 148 208 140 V128"/>
 <path class="cable" d="M208 140 Q208 148 216 148 H238 Q246 148 246 140 V86"/>
 <path class="amp out" d="M208 140 Q208 148 216 148 H238 Q246 148 246 140 V86"/>
 <!-- box internet -->
 <g class="dev">
  <rect x="180" y="106" width="56" height="22" rx="4" fill="#eef1f4" stroke="#b9c1c8"/>
  <path d="M190 106 V94 M226 106 V94" stroke="#b9c1c8" stroke-width="2" stroke-linecap="round"/>
  <circle class="devled" cx="190" cy="117" r="1.6"/><circle class="devled" cx="196" cy="117" r="1.6"/><circle class="devled" cx="202" cy="117" r="1.6"/>
 </g>
 <!-- NAS -->
 <g class="dev">
  <rect x="226" y="36" width="38" height="50" rx="4" fill="#2a2f35" stroke="#16191c"/>
  <rect x="231" y="42" width="28" height="9" rx="1.5" fill="#3c434a"/><rect x="231" y="54" width="28" height="9" rx="1.5" fill="#3c434a"/><rect x="231" y="66" width="28" height="9" rx="1.5" fill="#3c434a"/>
  <circle class="devled" cx="255" cy="46.5" r="1.4"/><circle class="devled" cx="255" cy="58.5" r="1.4"/><circle class="devled" cx="255" cy="70.5" r="1.4"/>
 </g>
</svg>`;

  const TILES = [
    ['charge', 'mdi:battery-high', 'show_charge'],
    ['runtime', 'mdi:timer-sand', 'show_runtime'],
    ['load', 'mdi:gauge', 'show_load'],
    ['power', 'mdi:flash', 'show_power'],
    ['input', 'mdi:power-plug', 'show_voltage'],
    ['output', 'mdi:power-socket-eu', 'show_voltage'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
  ];

  class ApplianceUpsCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity: f(/(ups|onduleur).*status_data/i, 'sensor') || f(/(ups|onduleur).*status/i, 'sensor'),
        entity_charge: f(/(ups|onduleur).*(battery_charge|batterie)/i, 'sensor'),
        entity_runtime: f(/(ups|onduleur).*runtime/i, 'sensor'),
        entity_load: f(/(ups|onduleur).*load/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_charge: true, show_runtime: true, show_load: true, show_power: true, show_voltage: true, show_energy: true,
        battery_low: 20, load_max: 90, mains_min: 100, ...c };
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
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // autonomie en minutes : NUT la donne en secondes
    _minutes(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 's').toLowerCase();
      return u === 'min' ? v : u === 'h' ? v * 60 : v / 60;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="uptitle"></div><div class="badge" id="upbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="upalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_charge));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ charge: cc.entity_charge, runtime: cc.entity_runtime, load: cc.entity_load, power: cc.entity_power,
          input: cc.entity_input_voltage, output: cc.entity_output_voltage, energy: cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const charge = this._num(c.entity_charge), load = this._num(c.entity_load), vin = this._num(c.entity_input_voltage);
      const raw = s ? String(s.state) : '', up = raw.toUpperCase(), alerts = [];
      // codes NUT (OL, OB, LB, CHRG, RB, OVER…) et libellés en clair
      if (/\bRB\b|REPLACE/.test(up)) alerts.push('replace_battery');
      if (/\bOVER\b|OVERLOAD/.test(up) || (!isNaN(load) && load > Number(c.load_max))) alerts.push('overload');
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && s.entity_id.startsWith('binary_sensor.')) st = raw === 'on' ? 'online' : 'on_battery';
      else if (s && /\bOFF\b|OFFLINE|\bFSD\b/.test(up)) st = 'offline';
      else if (s && /\bOB\b|ON ?BATT|DISCHRG|DISCHARG|SUR BATTERIE/.test(up)) st = 'on_battery';
      else if (s && /\bLB\b|LOW ?BATT/.test(up)) st = 'on_battery';
      else if (s && /\bOL\b|ONLINE|SECTEUR|\bCHRG\b|CHARGING/.test(up)) st = 'online';
      else if (!isNaN(vin)) st = vin < Number(c.mains_min) ? 'on_battery' : 'online';
      else if (!s && !isNaN(charge)) st = 'online';
      else st = s ? 'online' : 'unavailable';
      const low = /\bLB\b|LOW ?BATT/.test(up) || (!isNaN(charge) && charge < Number(c.battery_low));
      if (st === 'on_battery' && low) st = 'low_battery';
      if (st === 'online' && /\bCHRG\b|CHARGING/.test(up)) st = 'charging';
      if (st === 'low_battery') alerts.unshift('low_battery');
      return { st, charge, load, vin, alerts };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, charge, load, vin, alerts } = this._compute();
      const clamp = (x) => Math.max(0, Math.min(1, x));
      const bat = isNaN(charge) ? 1 : clamp(charge / 100);
      card.className = `${st} ${bat < 0.2 ? 'lowbat' : bat < 0.5 ? 'midbat' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--bat', bat.toFixed(3));
      // barre de LED : une LED par tranche de 20 % de charge connectée
      const n = isNaN(load) ? 0 : Math.ceil(clamp(load / 100) * 5);
      r.querySelectorAll('.ld').forEach((el, i) => el.setAttribute('class', `ld${i < n ? ' on' : ''}${i >= 3 ? ' hi' : ''}${i >= 4 ? ' max' : ''}`));

      const rt = this._minutes(c.entity_runtime);
      const fmtRt = (m) => isNaN(m) ? '--' : m >= 60 ? `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')}` : `${Math.round(m)} min`;
      r.getElementById('uplcd').textContent = st === 'offline' || st === 'unavailable' ? '- - -' : isNaN(charge) ? (st === 'online' ? 'AC' : 'BATT') : `${Math.round(charge)}%`;
      r.getElementById('uplcds').textContent = st === 'on_battery' || st === 'low_battery' ? (isNaN(rt) ? 'BATT' : fmtRt(rt)) : st === 'charging' ? 'CHARGE' : isNaN(vin) ? 'UPS' : `${Math.round(vin)} V`;

      r.getElementById('uptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('upbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('upalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      const pw = this._watts(c.entity_power), vout = this._num(c.entity_output_voltage), energy = this._num(c.entity_energy);
      const V = {
        charge: [c.entity_charge, this._fmt(charge, 0), '%'],
        runtime: [c.entity_runtime, fmtRt(rt), ''],
        load: [c.entity_load, this._fmt(load, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), 'W'],
        input: [c.entity_input_voltage, this._fmt(vin, 0), 'V'],
        output: [c.entity_output_voltage, this._fmt(vout, 0), 'V'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
      };
      const bad = { charge: alerts.includes('low_battery'), load: alerts.includes('overload'), input: st === 'on_battery' || st === 'low_battery' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceUpsCard);

  /* ---- éditeur visuel ---- */
  class ApplianceUpsCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_charge', 'sensor'), ent('entity_runtime', 'sensor'), ent('entity_load', 'sensor'), ent('entity_power', 'sensor'),
        ent('entity_input_voltage', 'sensor'), ent('entity_output_voltage', 'sensor'), ent('entity_energy', 'sensor'),
        { type: 'grid', name: '', schema: [num('battery_low', 0, 100, 1, 20, '%'), num('load_max', 10, 100, 1, 90, '%'), num('mains_min', 0, 250, 1, 100, 'V')] },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_charge'), bool('show_runtime'), bool('show_load'), bool('show_power'), bool('show_voltage'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceUpsCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – UPS / Onduleur', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Onduleur animé : courant du secteur ou de la batterie, coupure de courant, bips, charge batterie, autonomie et charge connectée (NUT).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
