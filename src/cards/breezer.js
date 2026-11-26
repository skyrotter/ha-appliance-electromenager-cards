/* Carte « Purificateur d'air insufflé / Breather » — custom:appliance-breezer-card
 * Приточный очиститель (бризер) с подогревом, заслонкой, HEPA-фильтром и мониторингом CO₂ / PM2.5.
 *   - Заслонка притока слева (поворачивается при открытии свежего воздуха; закрывается при выключении и рециркуляции).
 *   - Внутренний фильтр, PTC-нагреватель (светится тёплым оранжевым при нагреве) и вращающаяся крыльчатка.
 *   - Передний круглый OLED-экран с кольцом качества воздуха (CO₂ / PM2.5) и выходящие потоки воздуха сверху.
 *   - Управление: питание, подогрев, заслонка, скорость / режим + extra_tiles и icons.
 */
(() => {
  const TAG = 'appliance-breezer-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n breezer*/{};
  const esc = window.applianceEsc || ((s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));

  const CSS = `
:host{display:block;height:100%}
ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --bz-ok:var(--appliance-ok-color,#2fd27a);--bz-cold:var(--appliance-cold-color,#29b6f6);--bz-heat:var(--appliance-heat-color,#ff8a3d);
  --bz-warn:var(--appliance-warn-color,#ffb300);--bz-alert:var(--appliance-alert-color,#db4437);--bz-aq:var(--bz-ok);--spd:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ventilating .badge,.boost .badge{background:color-mix(in srgb,var(--bz-cold) 22%,transparent);color:var(--bz-cold)}
.heating .badge{background:color-mix(in srgb,var(--bz-heat) 24%,transparent);color:var(--bz-heat)}
.recirculation .badge{background:color-mix(in srgb,var(--bz-ok) 22%,transparent);color:var(--bz-ok)}
.alert{display:none;margin-top:3px;font-size:11.5px;font-weight:600;color:var(--bz-alert);text-align:center}.alert.on{display:block}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(210px * var(--illus-scale,1));width:calc(210px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.side{flex:1 1 135px;min-width:0}
.ctrls{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin-bottom:6px}.ctrls.hide{display:none}
.ctrls button{display:inline-flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:5px 9px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 11.5px/15px var(--paper-font-body1_-_font-family,inherit);transition:background .2s,color .2s}
.ctrls button ha-icon{--mdc-icon-size:15px}
.ctrls button.on{background:color-mix(in srgb,var(--bz-cold) 26%,var(--secondary-background-color));color:var(--bz-cold)}
.ctrls button.heat.on{background:color-mix(in srgb,var(--bz-heat) 26%,var(--secondary-background-color));color:var(--bz-heat)}
.ctrls button:disabled{opacity:.45;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile.extra{flex-direction:column-reverse}:host([tile-order="name"]) .tile.extra{flex-direction:column}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--bz-warn)}.tile.bad .v,.tile.bad .l{color:var(--bz-alert)}
/* ---- SVG animation ---- */
.damper{transform-origin:42px 118px;transition:transform .7s cubic-bezier(.4,0,.2,1);transform:rotate(0deg)}
.damper-open .damper{transform:rotate(-66deg)}
.imp{transform-origin:152px 118px}
.ventilating .imp,.heating .imp,.boost .imp,.recirculation .imp{animation:bzspin calc(.9s / var(--spd)) linear infinite}
.ptc{opacity:.25;transition:opacity .5s,filter .5s}
.heating .ptc{opacity:1;filter:drop-shadow(0 0 6px #ff7020);animation:bzheat 1.5s ease-in-out infinite alternate}
.flt-warn{opacity:0}.bad-filter .flt-warn{opacity:1;animation:bzblink .9s steps(2) infinite}
.aqring{stroke:var(--bz-aq);transition:stroke .4s}
.oled-num{font:700 13px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);fill:#e8f6ff;text-anchor:middle}
.oled-sub{font:500 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);fill:#8fb4cc;text-anchor:middle}
.inflow{fill:none;stroke:#4fc3f7;stroke-width:2;stroke-linecap:round;opacity:0}
.damper-open.ventilating .inflow,.damper-open.heating .inflow,.damper-open.boost .inflow{animation:bzin 1.6s ease-out infinite}
.inflow.i2{animation-delay:-.8s!important}
.wv{fill:none;stroke:#4fc3f7;stroke-width:2.2;stroke-linecap:round;opacity:0}
.heating .wv{stroke:#ff9248}
.recirculation .wv{stroke:#4dd0a8}
.ventilating .wv,.heating .wv,.boost .wv,.recirculation .wv{animation:bzwave calc(1.5s / var(--spd)) ease-out infinite}
.wv.w2{animation-delay:-.5s!important}.wv.w3{animation-delay:-1s!important}
.off svg,.unavailable svg{filter:grayscale(.65) brightness(.95)}.unavailable svg{opacity:.55}
.off .oled-num,.off .oled-sub,.unavailable .oled-num,.unavailable .oled-sub{opacity:.3}
.noanim *{animation:none!important;transition:none!important}
/* compact */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .side{flex:0 0 44%;display:flex;flex-direction:column;justify-content:center}
.compact .tiles{grid-template-columns:1fr;gap:3px}.compact .ctrls{margin-bottom:3px;gap:3px}.compact .ctrls button{padding:3px 7px;font-size:10.5px}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
@keyframes bzspin{to{transform:rotate(360deg)}}
@keyframes bzheat{from{opacity:.75}to{opacity:1}}
@keyframes bzblink{50%{opacity:.2}}
@keyframes bzin{0%{opacity:0;transform:translateX(-10px)}30%{opacity:.85}100%{opacity:0;transform:translateX(14px)}}
@keyframes bzwave{0%{opacity:0;transform:translateY(5px)}30%{opacity:.9}100%{opacity:0;transform:translateY(-16px)}}
`;

  const BLADES = [0, 60, 120, 180, 240, 300].map((a) =>
    `<path d="M152 118 C156 105 166 101 174 106 C171 114 162 118 152 118Z" transform="rotate(${a} 152 118)" fill="#6b7785"/>`
  ).join('');

  const SVG = (label) => `<svg viewBox="0 0 260 190" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="bzbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dce3eb"/></linearGradient>
    <linearGradient id="bzside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa4b0"/><stop offset="1" stop-color="#cfd6df"/></linearGradient>
    <linearGradient id="bzchamber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#222933"/><stop offset="1" stop-color="#141920"/></linearGradient>
    <linearGradient id="bzptc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5722"/><stop offset=".5" stop-color="#ffab40"/><stop offset="1" stop-color="#ff5722"/></linearGradient>
    <radialGradient id="bzoled" cx=".5" cy=".45"><stop offset="0" stop-color="#1b2634"/><stop offset="1" stop-color="#0b1017"/></radialGradient>
    <radialGradient id="bzsh"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <clipPath id="bzfanclip"><circle cx="152" cy="118" r="24"/></clipPath></defs>
    <ellipse cx="146" cy="182" rx="82" ry="6" fill="url(#bzsh)"/>
    <!-- Воздуховод притока слева и заслонка -->
    <rect x="8" y="96" width="58" height="44" rx="4" fill="#b4bec9" stroke="#8f9aa8" stroke-width="1.2"/>
    <rect x="12" y="101" width="52" height="34" fill="#2c3540"/>
    <path class="inflow" d="M12 112 h22 m-5 -4 l5 4 l-5 4"/>
    <path class="inflow i2" d="M12 124 h22 m-5 -4 l5 4 l-5 4"/>
    <g class="damper">
      <rect x="40" y="102" width="4.5" height="32" rx="2" fill="#e6ecf2" stroke="#64707d" stroke-width="1"/>
      <circle cx="42.2" cy="118" r="2.6" fill="#525d6a"/>
    </g>
    <!-- Боковая грань и корпус бризера -->
    <path d="M58 44 Q58 30 72 28 L86 26 L86 174 L72 174 Q58 174 58 160 Z" fill="url(#bzside)"/>
    <rect x="74" y="26" width="146" height="148" rx="18" fill="url(#bzbody)" stroke="#c2cad4" stroke-width="1.3"/>
    <!-- Верхняя решётка выдува и выходящие волны воздуха -->
    <rect x="92" y="30" width="110" height="10" rx="4" fill="#3a434f"/>
    <path d="M100 35 h94" stroke="#808b97" stroke-width="1.4" stroke-dasharray="6 4"/>
    <g><path class="wv" d="M104 22 q6-5 12 0 t12 0"/><path class="wv w2" d="M135 20 q6-5 12 0 t12 0"/><path class="wv w3" d="M166 22 q6-5 12 0 t12 0"/></g>
    <!-- Внутренняя камера: фильтр + PTC нагреватель + крыльчатка -->
    <rect x="86" y="48" width="94" height="108" rx="10" fill="url(#bzchamber)" stroke="#55606e" stroke-width="1.2"/>
    <!-- Фильтр -->
    <g class="flt">
      <rect x="91" y="54" width="22" height="96" rx="3" fill="#e8edf2" stroke="#9ea8b4" stroke-width="1"/>
      <path d="M94 60 l16 6 l-16 6 l16 6 l-16 6 l16 6 l-16 6 l16 6 l-16 6 l16 6 l-16 6 l16 6 l-16 6 l16 6 l-16 6" fill="none" stroke="#8f9aa6" stroke-width="1.3"/>
      <g class="flt-warn"><circle cx="102" cy="102" r="9" fill="#db4437"/><path d="M102 97v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="102" cy="106.5" r="1.3" fill="#fff"/></g>
    </g>
    <!-- PTC керамический нагреватель -->
    <g class="ptc">
      <rect x="116" y="64" width="11" height="76" rx="2" fill="url(#bzptc)"/>
      <path d="M118 70 h7 M118 78 h7 M118 86 h7 M118 94 h7 M118 102 h7 M118 110 h7 M118 118 h7 M118 126 h7 M118 134 h7" stroke="#5c1900" stroke-width="1.4" opacity=".6"/>
    </g>
    <!-- Центробежная крыльчатка -->
    <circle cx="152" cy="118" r="25" fill="#1b212a" stroke="#4b5563" stroke-width="1"/>
    <g clip-path="url(#bzfanclip)"><g class="imp">${BLADES}<circle cx="152" cy="118" r="5" fill="#9aa5b4"/></g></g>
    <!-- Круглый передний OLED дисплей с кольцом качества воздуха -->
    <circle cx="195" cy="102" r="26" fill="#2c343f" stroke="#b6c0cb" stroke-width="1.5"/>
    <circle cx="195" cy="102" r="22" fill="url(#bzoled)"/>
    <circle class="aqring" cx="195" cy="102" r="22" fill="none" stroke-width="2.6"/>
    <text class="oled-num" id="bzoledv" x="195" y="104">--</text>
    <text class="oled-sub" id="bzoleds" x="195" y="114">CO₂</text>
  </svg>`;

  const TILES = [
    ['co2', 'mdi:molecule-co2', 'entity_co2', 'show_co2'],
    ['pm25', 'mdi:blur', 'entity_pm25', 'show_pm25'],
    ['outdoor_temp', 'mdi:thermometer-chevron-down', 'entity_outdoor_temp', 'show_outdoor_temp'],
    ['temp', 'mdi:thermometer', 'entity_temp', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'entity_target_temp', 'show_target'],
    ['humidity', 'mdi:water-percent', 'entity_humidity', 'show_humidity'],
    ['speed', 'mdi:fan', 'entity_speed', 'show_speed'],
    ['damper', 'mdi:valve', 'entity_damper', 'show_damper'],
    ['heater', 'mdi:heating-coil', 'entity_heater', 'show_heater'],
    ['filter', 'mdi:air-filter', 'entity_filter', 'show_filter'],
    ['power', 'mdi:flash', 'entity_power', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'entity_energy', 'show_energy'],
  ];

  const Base = window.ApplianceStandaloneBase || HTMLElement;
  class ApplianceBreezerCard extends Base {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const find = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: find(/(breezer|breather|tion|fresh.?air|ventilation|приточ|бризер)/i, 'fan')
          || find(/(breezer|breather|tion|fresh.?air|приточ|бризер)/i, 'climate')
          || find(/(breezer|breather|tion|fresh.?air|приточ|бризер)/i, 'switch'),
        entity_co2: find(/co2/i, 'sensor'),
        entity_temp: find(/(supply|outlet|breezer|tion).*temp/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = {
        co2_max: 1000, pm25_max: 35, filter_low: 10, heat_threshold: 80, off_threshold: 1,
        show_status: true, show_controls: true, ...Object.fromEntries(TILES.map(([, , , o]) => [o, true])), ...c,
      };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return (T[this._lang(T)] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._loc(), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _on(id) { const s = this._st(id); return this._ok(s) && /^(on|true|1|open|heating|heat|active|high|yes)$/i.test(String(s.state).trim()); }
    _powerId() { const c = this._c; return c.entity_switch || (/^(switch|input_boolean|fan|climate)\./.test(c.entity_status || '') ? c.entity_status : ''); }

    _compute() {
      const c = this._c, s = this._st(c.entity_status), sw = this._st(this._powerId());
      const pw = this._watts(c.entity_power);
      const known = [c.entity_status, c.entity_switch, c.entity_power, c.entity_co2, c.entity_pm25, c.entity_temp, c.entity_heater, c.entity_damper]
        .some((i) => i && this._ok(this._st(i)));
      if (!known) return { st: 'unavailable', on: false, heating: false, damperOpen: false, spdPct: 0, co2: NaN, pm25: NaN, filterPct: NaN, alerts: [] };

      const rawSt = this._ok(s) ? String(s.state).toLowerCase().trim() : '';
      const isClim = s && /^climate\./.test(s.entity_id);
      const isFan = s && /^fan\./.test(s.entity_id);
      const hvacAct = isClim ? String((s.attributes || {}).hvac_action || '').toLowerCase() : '';
      const swOn = this._ok(sw) ? !/^(off|false|0|standby|closed)$/i.test(String(sw.state).trim()) : null;
      const modeS = this._st(c.entity_mode), modeTxt = this._ok(modeS) ? String(modeS.state).toLowerCase() : (isClim && this._ok(s) ? String((s.attributes || {}).preset_mode || rawSt).toLowerCase() : rawSt);

      let on;
      if (swOn === false || /^(off|false|0|standby|stopped|aus)$/i.test(rawSt)) on = false;
      else if (swOn === true || (rawSt && !/^(idle)$/i.test(rawSt))) on = true;
      else on = !isNaN(pw) && pw > Number(c.off_threshold);

      const dmpS = this._st(c.entity_damper), dmpTxt = this._ok(dmpS) ? String(dmpS.state).toLowerCase() : '';
      const recirc = /recirc|рецирк|indoor|interne|closed_recirc/.test(dmpTxt) || /recirc|рецирк/.test(modeTxt);
      let damperOpen = on && !recirc;
      if (this._ok(dmpS)) {
        if (/^(off|closed|close|false|0)$/.test(dmpTxt) || recirc) damperOpen = false;
        else if (/^(on|open|opened|true|supply|fresh|outside|mixed)$/.test(dmpTxt)) damperOpen = true;
      }

      const tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : { conv: (v) => v, toC: (v) => v, unit: '°C' };
      const tIn = tc.conv(this._num(c.entity_temp), this._st(c.entity_temp));
      const tOut = tc.conv(this._num(c.entity_outdoor_temp), this._st(c.entity_outdoor_temp));
      const heatS = this._st(c.entity_heater);
      const heating = on && (
        (this._ok(heatS) && /^(on|true|1|heating|heat|eco|auto|high|active)$/i.test(String(heatS.state).trim()))
        || hvacAct === 'heating'
        || (!this._ok(heatS) && !isNaN(pw) && pw >= Number(c.heat_threshold))
        || (!this._ok(heatS) && !isNaN(tIn) && !isNaN(tOut) && (tc.toC(tIn) - tc.toC(tOut)) >= 4)
      );

      let spdPct = on ? 45 : 0;
      const spS = this._st(c.entity_speed);
      const spVal = this._num(c.entity_speed);
      if (isFan && on && Number.isFinite(Number((s.attributes || {}).percentage))) spdPct = Number(s.attributes.percentage);
      else if (!isNaN(spVal)) spdPct = this._unit(c.entity_speed) === '%' || spVal > 10 ? Math.min(100, spVal) : Math.min(100, Math.round(spVal / 6 * 100));
      else if (this._ok(spS)) {
        const stx = String(spS.state).toLowerCase();
        if (/turbo|boost|max|high/.test(stx)) spdPct = 95;
        else if (/night|sleep|silent|low|min/.test(stx)) spdPct = 25;
        else if (/med|mid|norm|auto/.test(stx)) spdPct = 55;
      }
      const boost = on && (spdPct >= 80 || /turbo|boost|max/.test(modeTxt));

      const co2 = this._num(c.entity_co2), pm25 = this._num(c.entity_pm25);
      const fltS = this._st(c.entity_filter), fltBin = !!fltS && /^binary_sensor\./.test(c.entity_filter);
      const filterPct = !fltBin ? this._num(c.entity_filter) : NaN;
      const filterBad = this._ok(fltS) && (fltBin ? /^(on|true|problem|replace)$/i.test(String(fltS.state)) : (!isNaN(filterPct) && filterPct <= Number(c.filter_low)) || /replace|change|expired/.test(String(fltS.state).toLowerCase()));
      const alerts = [];
      if (!isNaN(co2) && co2 >= Number(c.co2_max)) alerts.push('co2_high');
      if (!isNaN(pm25) && pm25 >= Number(c.pm25_max)) alerts.push('pm25_high');
      if (filterBad) alerts.push('filter_replace');

      const st = !on ? 'off' : heating ? 'heating' : recirc ? 'recirculation' : boost ? 'boost' : 'ventilating';
      return { st, on, heating, damperOpen, recirc, spdPct, co2, pm25, filterPct, filterBad, tIn, tOut, tc, alerts };
    }

    _build() {
      const root = this._ensureRoot();
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="bztitle"></div><div class="badge" id="bzbadge"></div></div>
        <div class="alert" id="bzalert"></div>
        <div class="body">${SVG(this._c.name || this._t('name'))}
          <div class="side">
            <div class="ctrls" id="bzctrls"></div>
            <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
          </div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_status || this._c.entity_switch || this._c.entity_co2));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const def = TILES.find((t) => t[0] === el.dataset.k);
        if (def) this._more(this._c[def[2]]);
      }));
      root.getElementById('bzctrls').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        e.stopPropagation();
        const k = b.dataset.k, c = this._c, h = this._hass; if (!h) return;
        const tog = (id) => { const d = id.split('.')[0]; h.callService(['switch', 'input_boolean', 'fan', 'light', 'cover'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: id }); };
        if (k === 'power') {
          const id = this._powerId(); if (!id) return;
          const d = id.split('.')[0];
          if (d === 'climate') h.callService('climate', this._on(id) ? 'turn_off' : 'turn_on', { entity_id: id });
          else tog(id);
        } else if (k === 'heater' && c.entity_heater) tog(c.entity_heater);
        else if (k === 'damper' && c.entity_damper) tog(c.entity_damper);
      });
      this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const m = this._compute();
      card.className = `${m.st}${m.damperOpen ? ' damper-open' : ''}${m.filterBad ? ' bad-filter' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--spd', (0.6 + 1.1 * Math.max(0, Math.min(1, m.spdPct / 100))).toFixed(2));
      const aqCol = (m.alerts.includes('co2_high') || m.alerts.includes('pm25_high')) ? 'var(--bz-alert)'
        : (!isNaN(m.co2) && m.co2 >= Number(c.co2_max) * 0.8) || (!isNaN(m.pm25) && m.pm25 >= Number(c.pm25_max) * 0.7) ? 'var(--bz-warn)' : 'var(--bz-ok)';
      card.style.setProperty('--bz-aq', aqCol);

      r.getElementById('bztitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('bzbadge'); badge.textContent = this._t(m.st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('bzalert'); al.textContent = m.alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', m.alerts.length > 0);

      // Передний OLED экран: CO₂ (если есть) или температура подачи
      const ov = r.getElementById('bzoledv'), os = r.getElementById('bzoleds');
      if (!isNaN(m.co2)) { ov.textContent = String(Math.round(m.co2)); os.textContent = 'ppm CO₂'; }
      else if (!isNaN(m.tIn)) { ov.textContent = `${this._fmt(m.tIn, 1)}°`; os.textContent = m.tc.unit; }
      else { ov.textContent = m.on ? 'ON' : 'OFF'; os.textContent = ''; }

      // Кнопки управления
      const pid = this._powerId(), ctr = r.getElementById('bzctrls');
      const btns = [
        pid ? ['power', 'mdi:power', this._t(m.on ? 'btn_off' : 'btn_on'), m.on, false] : null,
        c.entity_heater && /^(switch|input_boolean)\./.test(c.entity_heater) ? ['heater', 'mdi:heating-coil', this._l('heater'), m.heating, true] : null,
        c.entity_damper && /^(switch|input_boolean|cover)\./.test(c.entity_damper) ? ['damper', 'mdi:valve', this._l('damper'), m.damperOpen, false] : null,
      ].filter(Boolean);
      ctr.classList.toggle('hide', !btns.length || c.show_controls === false);
      const sig = btns.map((b) => b.join('|')).join(';');
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, ic, lbl, on, ht]) => `<button class="${on ? 'on' : ''}${ht ? ' heat' : ''}" data-k="${k}" title="${esc(lbl)}" aria-label="${esc(lbl)}"><ha-icon icon="${ic}"></ha-icon><span>${esc(lbl)}</span></button>`).join('');
      }

      const tgtS = this._st(c.entity_target_temp);
      const tgt = tgtS && /^climate\./.test(tgtS.entity_id) && tgtS.attributes?.temperature != null ? m.tc.conv(Number(tgtS.attributes.temperature), tgtS) : m.tc.conv(this._num(c.entity_target_temp), tgtS);
      const pw = this._watts(c.entity_power), en = this._num(c.entity_energy), hum = this._num(c.entity_humidity);
      const spS = this._st(c.entity_speed), spRaw = this._num(c.entity_speed);
      const spTxt = !isNaN(spRaw) ? this._fmt(spRaw, 0) : this._ok(spS) ? String(spS.state) : (m.on ? `${Math.round(m.spdPct)}` : '--');
      const spU = !isNaN(spRaw) ? this._unit(c.entity_speed, '') : (!this._ok(spS) && m.on ? '%' : '');
      const heatS = this._st(c.entity_heater), dmpS = this._st(c.entity_damper);
      const dmpTxt = this._ok(dmpS) ? (m.recirc ? this._t('recirculation') : m.damperOpen ? this._t('damper_open') : this._t('damper_closed')) : '--';
      const heatTxt = this._ok(heatS) ? this._t(m.heating ? 'on' : 'off') : '--';
      const fltS = this._st(c.entity_filter), fltBin = !!fltS && /^binary_sensor\./.test(c.entity_filter);
      const fltTxt = !isNaN(m.filterPct) ? this._fmt(m.filterPct, 0) : this._ok(fltS) ? this._t(m.filterBad ? 'replace_short' : 'ok') : '--';

      const V = {
        co2: [c.entity_co2, this._fmt(m.co2, 0), this._unit(c.entity_co2, 'ppm'), m.alerts.includes('co2_high') ? 'bad' : ''],
        pm25: [c.entity_pm25, this._fmt(m.pm25, 0), this._unit(c.entity_pm25, 'µg/m³'), m.alerts.includes('pm25_high') ? 'bad' : ''],
        outdoor_temp: [c.entity_outdoor_temp, this._fmt(m.tOut, 1), m.tc.unit, ''],
        temp: [c.entity_temp, this._fmt(m.tIn, 1), m.tc.unit, ''],
        target: [c.entity_target_temp, this._fmt(tgt, 1), m.tc.unit, ''],
        humidity: [c.entity_humidity, this._fmt(hum, 0), this._unit(c.entity_humidity, '%'), ''],
        speed: [c.entity_speed || (m.on && c.entity_status), spTxt, spU, ''],
        damper: [c.entity_damper, dmpTxt, '', ''],
        heater: [c.entity_heater, heatTxt, '', m.heating ? 'warn' : ''],
        filter: [c.entity_filter, fltTxt, !fltBin && !isNaN(m.filterPct) ? this._unit(c.entity_filter, '%') : '', m.filterBad ? 'bad' : ''],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W'), ''],
        energy: [c.entity_energy, this._fmt(en, 2), this._unit(c.entity_energy, 'kWh'), ''],
      };
      TILES.forEach(([k, defIc, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit, cls] = V[k];
        el.className = `tile${!show || c[opt] === false ? ' hide' : ''}${cls ? ' ' + cls : ''}`;
        const ic = window.applianceIcon ? window.applianceIcon(c, k, defIc) : defIc;
        const ico = el.querySelector('.l ha-icon'); if (ico && ico.getAttribute('icon') !== ic) ico.setAttribute('icon', ic);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      if (window.applianceExtraTiles) window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceBreezerCardEditor extends HTMLElement {
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
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'icons', selector: { object: {} } },
        ent('entity_status', ['fan', 'climate', 'switch', 'input_boolean', 'sensor', 'binary_sensor']),
        ent('entity_switch', ['switch', 'input_boolean', 'fan']),
        ent('entity_heater', ['switch', 'binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_damper', ['binary_sensor', 'switch', 'select', 'input_select', 'cover', 'sensor']),
        ent('entity_mode', ['select', 'input_select', 'sensor']),
        ent('entity_speed', ['sensor', 'number', 'input_number', 'select', 'fan']),
        ent('entity_outdoor_temp', ['sensor']),
        ent('entity_temp', ['sensor', 'climate']),
        ent('entity_target_temp', ['number', 'input_number', 'climate', 'sensor']),
        ent('entity_co2', ['sensor']),
        ent('entity_pm25', ['sensor']),
        ent('entity_humidity', ['sensor']),
        ent('entity_filter', ['sensor', 'binary_sensor']),
        ent('entity_power', ['sensor']),
        ent('entity_energy', ['sensor']),
        { name: 'extra_tiles', selector: { object: {} } },
        { type: 'grid', name: '', schema: [num('co2_max', 400, 5000, 50, 1000, 'ppm'), num('pm25_max', 5, 500, 1, 35, 'µg/m³'), num('filter_low', 0, 50, 1, 10, '%'), num('heat_threshold', 10, 2000, 10, 80, 'W')] },
        window.applianceTempField,
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_controls'), ...TILES.map(([, , , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => {
        const l = window.applianceLang(T, this._c, this._hass);
        return T[l]?.[`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass);
      };
    }
  }
  if (!customElements.get(TAG + '-editor')) customElements.define(TAG + '-editor', ApplianceBreezerCardEditor);

  window.applianceDefine(TAG, ApplianceBreezerCard, {
    name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Приточный очиститель воздуха (бризер) с заслонкой, HEPA-фильтром, подогревом притока, CO₂ и PM2.5.',
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/breezer.md',
  });
})();
