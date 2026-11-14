/* Carte « Chauffage soufflant » — custom:appliance-fan-heater-card
 * Petit radiateur soufflant de table / salle de bains : boîtier blanc, grille ronde à lamelles en biais, deux boutons dessus,
 * voyant rouge. Marche : le voyant s'allume, l'hélice tourne derrière la grille, la résistance rougeoie et de l'air chaud
 * (ou froid en simple ventilation) sort sur le côté. Deux allures (1000 W / 2000 W) et ventilation seule.
 * Facultatifs : puissance, énergie, coût, température de la pièce, consigne, allure, minuterie, alarme (renversement, surchauffe),
 * bouton marche / arrêt.
 */
(() => {
  const TAG = 'appliance-fan-heater-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n fan_heater*/{};
  const ALARM_RE = /(alarm|alarme|error|erreur|fault|d[ée]faut|tip|overheat|surchauffe|renvers|kipp|ribalt)/i;

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--fh-heat:var(--appliance-heat-color,#ff8a3d);--fh-cold:var(--appliance-cold-color,#2b9af9);
  --fh-alert:var(--appliance-alert-color,#db4437);--fh-ok:var(--appliance-ok-color,#43a047);--spd:1;--wave:#ff8a3d}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.low .badge,.high .badge{background:color-mix(in srgb,var(--fh-heat) 22%,transparent);color:var(--fh-heat)}
.fan .badge{background:color-mix(in srgb,var(--fh-cold) 22%,transparent);color:var(--fh-cold)}
.alarm .badge{background:color-mix(in srgb,var(--fh-alert) 22%,transparent);color:var(--fh-alert)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--fh-alert);font-weight:500;text-align:center}.alert.on{display:block}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(200px * var(--illus-scale,1));width:calc(200px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.side{flex:1 1 130px;min-width:0}
.ctl{display:flex;justify-content:center;margin-bottom:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:5px;border:0;border-radius:10px;padding:6px 16px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,inherit)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.on{background:color-mix(in srgb,var(--fh-heat) 28%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--fh-heat)}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante, tuiles en colonne ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .side{flex:0 0 42%;display:flex;flex-direction:column;justify-content:center}
.compact .tiles{grid-template-columns:1fr;gap:3px}.compact .ctl{margin-bottom:3px}.compact .ctl button{padding:3px 10px}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration ---- */
.blades{transform-box:view-box;transform-origin:106px 108px}
.fan .blades{animation:fhspin calc(.9s / var(--spd)) linear infinite}
.low .blades{animation:fhspin calc(.55s / var(--spd)) linear infinite}
.high .blades{animation:fhspin calc(.34s / var(--spd)) linear infinite}
.elem{opacity:0;transition:opacity .8s}
.low .elem{opacity:.5}.high .elem{opacity:.95;animation:fhpulse 1.6s ease-in-out infinite alternate}
.pilot{fill:#7d2323;transition:fill .3s}
.pilotg{opacity:0;fill:#ff3d3d;transition:opacity .3s}
.fan .pilot,.low .pilot,.high .pilot,.alarm .pilot{fill:#ff2e2e}.fan .pilotg,.low .pilotg,.high .pilotg,.alarm .pilotg{opacity:.55}
.alarm .pilot,.alarm .pilotg{animation:fhblink .6s steps(2) infinite}
.wv{fill:none;stroke:var(--wave);stroke-width:2.2;stroke-linecap:round;opacity:0}
.fan .wv{stroke:#8fd3ff}.low .wv,.high .wv{stroke:#ff8a3d}
.fan .wv.w1,.fan .wv.w2{animation:fhwave calc(1.6s / var(--spd)) ease-out infinite}
.low .wv.w1,.low .wv.w2{animation:fhwave calc(1.4s / var(--spd)) ease-out infinite}
.high .wv{animation:fhwave calc(1.1s / var(--spd)) ease-out infinite}
.wv.w2{animation-delay:-.5s!important}.wv.w3{animation-delay:-.9s!important}
.shim{fill:none;stroke:#ffb380;stroke-width:1.6;stroke-linecap:round;opacity:0}
.low .shim,.high .shim{animation:fhshim 2.4s ease-in-out infinite}.shim.s2{animation-delay:-.8s!important}.shim.s3{animation-delay:-1.6s!important}
.warn{opacity:0}.alarm .warn{opacity:1;animation:fhblink .6s steps(2) infinite}
.off svg,.unavailable svg{filter:grayscale(.5) brightness(.96)}.unavailable svg{opacity:.6}
.noanim *{animation:none!important}
@keyframes fhspin{to{transform:rotate(360deg)}}
@keyframes fhpulse{to{opacity:.65}}
@keyframes fhblink{50%{opacity:.15}}
@keyframes fhwave{0%{opacity:0;transform:translateX(-4px)}25%{opacity:.9}100%{opacity:0;transform:translateX(18px)}}
@keyframes fhshim{0%{opacity:0;transform:translateY(4px)}40%{opacity:.7}100%{opacity:0;transform:translateY(-12px)}}
`;

  // lamelles en biais de la grille (rotation de la grille de lignes horizontales)
  const SLATS = (() => { let s = ''; for (let k = -76; k <= 76; k += 9.5) s += `<line x1="26" y1="${(108 + k).toFixed(1)}" x2="186" y2="${(108 + k).toFixed(1)}"/>`; return s; })();
  const BLADE = 'M106 108 C112 88 128 80 142 86 C138 100 124 108 106 108Z';
  const BLADES = [0, 72, 144, 216, 288].map((a) => `<path d="${BLADE}" transform="rotate(${a} 106 108)" fill="#58606c"/>`).join('');

  const SVG = (label) => `<svg viewBox="0 0 224 200" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="fhbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dde2e8"/></linearGradient>
    <linearGradient id="fhside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#aab2bc"/><stop offset="1" stop-color="#d3d9df"/></linearGradient>
    <radialGradient id="fhdark" cx=".5" cy=".5"><stop offset="0" stop-color="#454b55"/><stop offset="1" stop-color="#15171b"/></radialGradient>
    <radialGradient id="fhglow" cx=".5" cy=".5"><stop offset="0" stop-color="#ffd27a"/><stop offset=".45" stop-color="#ff7a2a"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></radialGradient>
    <radialGradient id="fhsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <clipPath id="fhgrill"><circle cx="106" cy="108" r="60"/></clipPath></defs>
    <ellipse cx="96" cy="190" rx="78" ry="6" fill="url(#fhsh)"/>
    <!-- flanc gauche (épaisseur du boîtier) et pieds -->
    <path d="M24 62 Q24 44 40 38 L52 34 L52 176 L40 176 Q24 176 24 158 Z" fill="url(#fhside)"/>
    <rect x="52" y="174" width="22" height="9" rx="3.5" fill="#aeb6c0"/><rect x="132" y="174" width="22" height="9" rx="3.5" fill="#aeb6c0"/>
    <!-- boîtier, boutons dessus, voyant -->
    <rect x="76" y="19" width="26" height="14" rx="5" fill="#cdd3da"/><rect x="118" y="19" width="26" height="14" rx="5" fill="#cdd3da"/>
    <path d="M84 21v8M126 21v8" stroke="#8d96a1" stroke-width="2" stroke-linecap="round"/>
    <rect x="44" y="28" width="132" height="150" rx="28" fill="url(#fhbody)" stroke="#c9d0d7" stroke-width="1.2"/>
    <rect class="pilotg" x="50" y="40" width="16" height="22" rx="8" transform="rotate(-24 58 51)" style="filter:blur(3px)"/>
    <rect class="pilot" x="54" y="43" width="8" height="17" rx="4" transform="rotate(-24 58 51)"/>
    <!-- grille : fond sombre, résistance, hélice, lamelles -->
    <circle cx="106" cy="108" r="64" fill="#e9edf1" stroke="#cfd5dc" stroke-width="1.2"/>
    <circle cx="106" cy="108" r="60" fill="url(#fhdark)"/>
    <circle class="elem" cx="106" cy="108" r="52" fill="url(#fhglow)"/>
    <g class="blades">${BLADES}<circle cx="106" cy="108" r="7" fill="#8a93a0"/></g>
    <g clip-path="url(#fhgrill)"><g transform="rotate(48 106 108)" stroke="#f4f6f8" stroke-width="6.2" stroke-linecap="butt">${SLATS}</g></g>
    <circle cx="106" cy="108" r="60.5" fill="none" stroke="#d9dfe5" stroke-width="3"/>
    <!-- air chaud / froid sorti sur le côté, ondulations de chaleur au-dessus -->
    <g><path class="wv w1" d="M176 84q6-5 12 0t12 0"/><path class="wv w2" d="M176 106q6-5 12 0t12 0"/><path class="wv w3" d="M176 128q6-5 12 0t12 0"/></g>
    <g><path class="shim" d="M70 12q4-5 0-10"/><path class="shim s2" d="M104 12q4-5 0-10"/><path class="shim s3" d="M140 12q4-5 0-10"/></g>
    <g class="warn"><path d="M196 20l14 24h-28z" fill="#ffb300" stroke="#8a5a00" stroke-width="1.5" stroke-linejoin="round"/><path d="M196 29v8" stroke="#3a2600" stroke-width="2.4" stroke-linecap="round"/><circle cx="196" cy="41" r="1.6" fill="#3a2600"/></g>
  </svg>`;

  const TILES = [['power', 'mdi:flash', 'show_power'], ['energy', 'mdi:lightning-bolt-circle', 'show_energy'], ['cost', 'mdi:cash', 'show_cost'],
    ['temp', 'mdi:thermometer', 'show_temp'], ['target', 'mdi:thermometer-check', 'show_target'], ['mode', 'mdi:fire', 'show_mode'], ['timer', 'mdi:timer-outline', 'show_timer']];
  const ENT = { power: 'entity_power', energy: 'entity_energy', cost: 'entity_cost', temp: 'entity_temp', target: 'entity_target_temp', mode: 'entity_mode', timer: 'entity_timer' };

  class ApplianceFanHeaterCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_status: ids.find((i) => /^(switch|climate|input_boolean)\./.test(i) && /(soufflant|fan.?heater|chauffage|heater|radiateur)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { heat_threshold: 300, high_threshold: 1500, power_max: 2000, off_threshold: 0.5, show_status: true, show_buttons: true, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
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
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { return window.applianceNum(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _switchId() { const c = this._c; return c.entity_switch || (/^(switch|input_boolean|fan|climate|light)\./.test(c.entity_status || '') ? c.entity_status : ''); }
    // minuterie : nombre (min / h / s) ou texte H:MM
    _timer(id) {
      const s = this._st(id); if (!this._ok(s)) return '--';
      const v = parseFloat(String(s.state).replace(',', '.')), u = this._unit(id, 'min');
      if (!isFinite(v) || /:/.test(String(s.state))) return String(s.state);
      const min = /^h/i.test(u) ? v * 60 : /^s/i.test(u) ? v / 60 : v;
      return min >= 60 ? `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, '0')}` : `${Math.round(min)} min`;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity_status), sw = this._st(this._switchId());
      const pw = this._num(c.entity_power) * (/^kw$/i.test(this._unit(c.entity_power, 'W')) ? 1000 : 1);
      const known = [c.entity_status, c.entity_switch, c.entity_power, c.entity_mode].some((i) => this._ok(this._st(i)));
      // texte d'état : climate → hvac_action (heating / idle / fan / off), sinon l'état tel quel
      let txt = '';
      if (this._ok(s)) { const a = s.attributes || {}; txt = String(/^climate\./.test(s.entity_id) && /^off$/i.test(String(s.state)) ? 'off' : (a.hvac_action || s.state)).toLowerCase().trim(); }
      const swOn = this._ok(sw) ? /^(on|true|heat|fan_only|cool|auto)$/i.test(String(sw.state)) : null;
      const al = this._st(c.entity_alarm);
      const alarm = (this._ok(al) && /^(on|true|alarm|problem|tipped|detected|triggered)$/i.test(String(al.state))) || ALARM_RE.test(txt);
      const explicitOff = /^(off|false|no|0|arr[eê]t|[ée]teint|aus)$/i.test(txt), standbyTxt = /^(idle|standby|veille)$/i.test(txt);
      let on;
      if (swOn === false || explicitOff) on = false;
      else if (standbyTxt) on = false;
      else if (txt) on = true;
      else if (swOn === true) on = true;
      else on = !isNaN(pw) && pw > Number(c.off_threshold);
      // allure : entité d'allure, sinon état texte, sinon puissance
      const md = this._st(c.entity_mode), mtxt = this._ok(md) ? String(md.state).toLowerCase() : txt;
      let level = /fan|vent|cool|froid|l[üu]ft/.test(mtxt) ? 'fan' : /high|fort|max|hoch|2000|^2$|^ii$/.test(mtxt) ? 'high' : /low|faible|eco|niedrig|1000|^1$|^i$/.test(mtxt) ? 'low' : '';
      if (!isNaN(pw) && (!level || !this._ok(md))) level = pw < Number(c.heat_threshold) ? 'fan' : pw < Number(c.high_threshold) ? 'low' : 'high';
      if (!level) level = 'low';
      const st = !known ? 'unavailable' : alarm ? 'alarm' : standbyTxt ? 'standby' : !on ? 'off' : level;
      return { st, pw, on: on && st !== 'off' && st !== 'standby', alarm };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="fhtitle"></div><div class="badge" id="fhbadge"></div></div>
        <div class="alert" id="fhalert"></div>
        <div class="body">${SVG(this._c.name || this._t('name'))}
          <div class="side"><div class="ctl" id="fhctl"><button id="fhbtn"><ha-icon icon="mdi:power"></ha-icon><span></span></button></div>
            <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div></div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_status || this._c.entity_switch || this._c.entity_power));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]] || (el.dataset.k === 'cost' ? this._c.entity_energy : ''))));
      root.getElementById('fhbtn').addEventListener('click', () => {
        const id = this._switchId(); if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        this._hass.callService(['switch', 'input_boolean', 'fan', 'light'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
      });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, on, alarm } = this._compute();
      card.className = `${st}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const spd = !isNaN(pw) ? 0.8 + 0.6 * Math.max(0, Math.min(1, pw / Number(c.power_max || 2000))) : 1;
      card.style.setProperty('--spd', spd.toFixed(2));
      r.getElementById('fhtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('fhbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('fhalert'); al.textContent = alarm ? this._t('alarm_alert') : ''; al.classList.toggle('on', alarm);

      const tc = window.applianceTemp(this._hass, c);
      const tObj = this._st(c.entity_temp), temp = tc.conv(this._num(c.entity_temp), tObj);
      const target = (() => { const s = this._st(c.entity_target_temp); if (s && /^climate\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return tc.conv(isFinite(t) && s.attributes.temperature != null ? t : NaN, s); } return tc.conv(this._num(c.entity_target_temp), s); })();
      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const md = this._st(c.entity_mode);
      const modeTxt = this._ok(md) ? (isNaN(parseFloat(md.state)) ? String(md.state) : this._fmt(parseFloat(md.state), 0)) : (['fan', 'low', 'high'].includes(st) ? this._t(`mode_${st}`) : '--');
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
        temp: [c.entity_temp, this._fmt(temp, 1), tc.unit],
        target: [c.entity_target_temp, this._fmt(target, 1), tc.unit],
        mode: [c.entity_mode || (c.entity_power && 'x'), modeTxt, ''],
        timer: [c.entity_timer, this._timer(c.entity_timer), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', k === 'mode' && (st === 'high' || st === 'low'));
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      const sid = this._switchId(), ctl = r.getElementById('fhctl'), btn = r.getElementById('fhbtn');
      ctl.classList.toggle('hide', !sid || c.show_buttons === false);
      btn.classList.toggle('on', on && st !== 'off');
      btn.querySelector('span').textContent = this._t(on && st !== 'off' ? 'btn_off' : 'btn_on');
      btn.disabled = !this._ok(this._st(sid));
    }
  }
  customElements.define(TAG, ApplianceFanHeaterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceFanHeaterCardEditor extends HTMLElement {
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
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_status', ['switch', 'climate', 'input_boolean', 'fan', 'binary_sensor', 'sensor']), ent('entity_switch', ['switch', 'input_boolean', 'fan', 'light']),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_temp', ['sensor', 'climate']), ent('entity_target_temp', ['climate', 'number', 'input_number', 'sensor']),
        ent('entity_mode', ['select', 'input_select', 'sensor', 'number']), ent('entity_timer', ['sensor', 'number', 'input_number']),
        ent('entity_alarm', ['binary_sensor', 'sensor', 'input_boolean']),
        { type: 'grid', name: '', schema: [num('heat_threshold', 0, 2000, 1, 'W'), num('high_threshold', 0, 5000, 10, 'W'), num('power_max', 100, 5000, 10, 'W'), num('off_threshold', 0, 500, 0.1, 'W')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_buttons'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceFanHeaterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Chauffage soufflant animé : hélice, résistance incandescente, air chaud, voyant, deux allures, consigne, minuterie, alarme.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/fan-heater.md',
  });
})();
