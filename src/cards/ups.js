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
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
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

  // Photo détourée du CyberPower VP1000ELCD (172 × 300, fond transparent) : modèle « cyberpower_vp1000 »
  const IMG_VP1000 = 'data:image/webp;base64,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';

  // Photo détourée de l'APC Back-UPS 950 (230 × 300, fond transparent) : modèle « apc_bx950 »
  const IMG_APC950 = 'data:image/webp;base64,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';

  const SVG = (label, model) => `
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
 ${model === 'apc_bx950' ? `
  <!-- onduleur APC : photo détourée, le voyant « On Line » de la photo suit l'état (pas d'écran : textes cachés) -->
  <image href="${IMG_APC950}" x="62" y="18" width="103" height="134.4"/>
  <circle class="pwr" cx="93.9" cy="38.6" r="2.4"/>
  <g style="display:none"><text id="uplcd">--</text><text id="uplcds">UPS</text>
  <g id="upleds"><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/></g></g>
 ` : model === 'cyberpower_vp1000' ? `
  <!-- onduleur : photo détourée, voyant sur le bouton, écran de la photo recouvert par le % de charge -->
  <image href="${IMG_VP1000}" x="68" y="18" width="77" height="134.4"/>
  <rect x="88.5" y="58" width="18" height="10" rx="1.5" class="lcdbg"/>
  <text class="lcd" id="uplcd" x="97.5" y="65.6" style="font-size:7px">--</text>
  <text class="lcds" id="uplcds" x="97.5" y="70.6" style="font-size:3.6px">UPS</text>
  <circle class="pwr" cx="98" cy="40.4" r="4.2"/>
  <g id="upleds" style="display:none"><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/><rect class="ld" x="0" y="0" width="1" height="1"/></g>
 ` : `
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
 `}
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
    ['battery_voltage', 'mdi:current-dc', 'show_battery_voltage'],
    ['nominal_power', 'mdi:gauge-full', 'show_nominal_power'],
    ['beeper', 'mdi:volume-high', 'show_beeper'],
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
      this._c = { show_status: true, show_charge: true, show_runtime: true, show_load: true, show_power: true, show_voltage: true, show_energy: true, show_battery_voltage: true, show_nominal_power: true, show_beeper: true,
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
        ${SVG(c.name || this._t('name'), c.model)}
        <div class="alert" id="upalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_charge));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ charge: cc.entity_charge, runtime: cc.entity_runtime, load: cc.entity_load, power: cc.entity_power,
          input: cc.entity_input_voltage, output: cc.entity_output_voltage, energy: cc.entity_energy,
          battery_voltage: cc.entity_battery_voltage, nominal_power: cc.entity_nominal_power, beeper: cc.entity_beeper }[k]);
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
      const vbat = this._num(c.entity_battery_voltage), pnom = this._watts(c.entity_nominal_power);
      const bst = c.entity_beeper && this._hass.states[c.entity_beeper];
      const beeper = !bst || /^(unavailable|unknown)$/.test(String(bst.state)) ? '--' : (this._hass.formatEntityState ? this._hass.formatEntityState(bst) : String(bst.state));
      const V = {
        charge: [c.entity_charge, this._fmt(charge, 0), '%'],
        runtime: [c.entity_runtime, fmtRt(rt), ''],
        load: [c.entity_load, this._fmt(load, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), 'W'],
        input: [c.entity_input_voltage, this._fmt(vin, 0), 'V'],
        output: [c.entity_output_voltage, this._fmt(vout, 0), 'V'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        battery_voltage: [c.entity_battery_voltage, this._fmt(vbat, 1), 'V'],
        nominal_power: [c.entity_nominal_power, isNaN(pnom) ? '--' : this._fmt(pnom, 0), 'W'],
        beeper: [c.entity_beeper, beeper, ''],
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
      window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
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
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_charge', 'sensor'), ent('entity_runtime', 'sensor'), ent('entity_load', 'sensor'), ent('entity_power', 'sensor'),
        ent('entity_input_voltage', 'sensor'), ent('entity_output_voltage', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_battery_voltage', 'sensor'), ent('entity_nominal_power', 'sensor'), ent('entity_beeper'),
        { name: 'extra_tiles', selector: { object: {} } },
        { type: 'grid', name: '', schema: [num('battery_low', 0, 100, 1, 20, '%'), num('load_max', 10, 100, 1, 90, '%'), num('mains_min', 0, 250, 1, 100, 'V')] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_charge'), bool('show_runtime'), bool('show_load'), bool('show_power'), bool('show_voltage'), bool('show_energy'), bool('show_battery_voltage'), bool('show_nominal_power'), bool('show_beeper'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => ['entity_runtime', 'show_runtime'].includes(s.name)
        ? (T[window.applianceLang(T, null, this._hass)].runtime ?? T.en.runtime)
        : window.applianceEditorLabel(s.name, this._hass);
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
