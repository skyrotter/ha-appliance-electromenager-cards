/* Carte « Jacuzzi » — custom:appliance-jacuzzi-card
 * Spa vu en plongée : épaisseur d'acrylique au rebord, eau en dégradé de profondeur, banquette
 * immergée, buses chromées, appuie-têtes, bec de cascade, trappe du spa pack.
 * États : off, standby, filtering, heating, jets, alarm. Bulles et jets qui s'accélèrent avec la
 * puissance, vapeur en chauffe, éclairage LED, alertes pH et température.
 */
(() => {
  const TAG = 'appliance-jacuzzi-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n jacuzzi*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--jz-heat:var(--appliance-heat-color,#ff8a3d);--jz-cold:var(--appliance-cold-color,#2b9af9);
  --jz-alert:var(--appliance-alert-color,#db4437);--jz-ok:var(--appliance-ok-color,#43a047);--spd:1;--jz-led:#7a5cff}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--jz-heat) 22%,transparent);color:var(--jz-heat)}
.filtering .badge,.jets .badge{background:color-mix(in srgb,var(--jz-cold) 22%,transparent);color:var(--jz-cold)}
.alarm .badge{background:color-mix(in srgb,var(--jz-alert) 22%,transparent);color:var(--jz-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--jz-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--jz-alert)}

/* ---- illustration ---- */
/* --spd : vitesse relative des animations, liée à la puissance (1 = normal) */
.bub{opacity:0;transform-box:fill-box;transform-origin:center}
.jets .bub{animation:jzbub calc(1.5s / var(--spd)) ease-out infinite}
.heating .bub:nth-child(3n),.filtering .bub:nth-child(5n){animation:jzbub calc(2.6s / var(--spd)) ease-out infinite}
@keyframes jzbub{0%{opacity:0;transform:scale(.3)}25%{opacity:.85}100%{opacity:0;transform:scale(1.5)}}
.js{stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:3 6;opacity:0}
.jets .js{opacity:.85;animation:jzjet calc(.9s / var(--spd)) linear infinite}
@keyframes jzjet{to{stroke-dashoffset:-9}}
.fall{stroke:#e6fbff;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:4 5;opacity:0}
.filtering .fall,.heating .fall,.jets .fall{opacity:.9;animation:jzfall calc(.7s / var(--spd)) linear infinite}
.fallbody{opacity:0;transition:opacity .5s}
.filtering .fallbody,.heating .fallbody,.jets .fallbody{opacity:.45}
@keyframes jzfall{to{stroke-dashoffset:-9}}
.rip{fill:none;stroke:#fff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:center}
.filtering .rip,.heating .rip,.jets .rip{animation:jzrip calc(1.8s / var(--spd)) ease-out infinite}
.rip:nth-child(2){animation-delay:-.9s!important}
@keyframes jzrip{0%{opacity:.7;transform:scale(.4)}100%{opacity:0;transform:scale(1.6)}}
.steam{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center}
.heating .steam{animation:jzsteam 3.6s ease-out infinite}
.steam:nth-child(2){animation-delay:-.9s!important}.steam:nth-child(3){animation-delay:-1.8s!important}.steam:nth-child(4){animation-delay:-2.7s!important}
@keyframes jzsteam{0%{opacity:0;transform:translate(0,6px) scale(.5)}25%{opacity:.5}100%{opacity:0;transform:translate(6px,-34px) scale(2)}}
.leds{opacity:0;transition:opacity .6s;mix-blend-mode:screen}
.lit .leds{opacity:.85;animation:jzhue 12s linear infinite}
@keyframes jzhue{to{filter:hue-rotate(360deg)}}
.lit.fixed .leds{animation:none}
.shellglow{fill:none;stroke:var(--jz-alert);stroke-width:2.5;opacity:0}
.alarm .shellglow{animation:jzalarm .9s steps(2) infinite}
@keyframes jzalarm{50%{opacity:.9}}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.filtering .led{fill:#3fa3ff}.jets .led{fill:#8ee0ff;animation:jzblink 1s steps(2) infinite}.standby .led{fill:#43a047}
.alarm .led{fill:#db4437;animation:jzblink .8s steps(2) infinite}
@keyframes jzblink{50%{opacity:.2}}
.packled{fill:#44505c}
.heating .packled{fill:#ff8a3d}.filtering .packled,.jets .packled{fill:#3fa3ff}.alarm .packled{fill:#db4437}
.dsp{fill:#7fe3ff;font:700 9px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.off .water{filter:saturate(.55) brightness(.9)}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 240 200" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="jzwater" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#0a4d7a"/><stop offset=".5" stop-color="#1b86b3"/><stop offset="1" stop-color="#58d2e6"/></radialGradient>
  <linearGradient id="jzshell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd9e0"/></linearGradient>
  <linearGradient id="jzwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc7da"/><stop offset="1" stop-color="#3f9db8"/></linearGradient>
  <linearGradient id="jzcab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b4636"/><stop offset=".5" stop-color="#7a604a"/><stop offset="1" stop-color="#4f3c2e"/></linearGradient>
  <radialGradient id="jzchrome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bfc8d0"/><stop offset="1" stop-color="#6c7782"/></radialGradient>
  <linearGradient id="jzblade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fa"/><stop offset=".5" stop-color="#aeb8c2"/><stop offset="1" stop-color="#e2e8ee"/></linearGradient>
  <radialGradient id="jzled" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="var(--jz-led)" stop-opacity=".95"/><stop offset=".6" stop-color="var(--jz-led)" stop-opacity=".35"/><stop offset="1" stop-color="var(--jz-led)" stop-opacity="0"/></radialGradient>
  <clipPath id="jzclip"><rect x="28" y="30" width="184" height="112" rx="22"/></clipPath>
 </defs>
 <!-- ombre au sol + caisson (jupe) avec trappe du spa pack -->
 <ellipse cx="120" cy="193" rx="106" ry="6" fill="#000" opacity=".16"/>
 <rect x="16" y="120" width="208" height="74" rx="18" fill="url(#jzcab)"/>
 <g stroke="#3d2e22" stroke-width="1" opacity=".55"><path d="M40 176 V192 M70 176 V192 M170 176 V192 M200 176 V192"/></g>
 <rect x="86" y="175" width="68" height="17" rx="3" fill="#6a5340" stroke="#2f241a" stroke-width="1"/>
 <g stroke="#2f241a" stroke-width="1.2" stroke-linecap="round" opacity=".8"><path d="M92 180 H122 M92 184 H122 M92 188 H122"/></g>
 <rect x="130" y="180" width="18" height="7" rx="2" fill="url(#jzchrome)" stroke="#555e68" stroke-width=".6"/>
 <circle class="packled" cx="127" cy="183.5" r="1.8"/>
 <!-- coque acrylique : épaisseur au rebord, face supérieure, ouverture -->
 <rect x="10" y="22" width="220" height="150" rx="36" fill="#aebbc5"/>
 <rect x="10" y="14" width="220" height="150" rx="36" fill="url(#jzshell)" stroke="#9aa9b4" stroke-width="1"/>
 <rect x="14" y="17" width="212" height="144" rx="33" fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"/>
 <rect class="shellglow" x="10" y="14" width="220" height="150" rx="36"/>
 <rect x="24" y="26" width="192" height="120" rx="26" fill="url(#jzwall)" stroke="#6f8a97" stroke-width="2"/>
 <rect x="26" y="28" width="188" height="116" rx="24" fill="none" stroke="#2a6a82" stroke-width="2" opacity=".55"/>
 <!-- eau -->
 <g class="water">
  <rect x="28" y="30" width="184" height="112" rx="22" fill="url(#jzwater)"/>
  <!-- banquette immergée : eau moins profonde -->
  <path d="M34 36 H202 V62 H62 V136 H34 Z" fill="#7fe0ee" opacity=".42" stroke="#b8f3fa" stroke-width="1" stroke-linejoin="round"/>
  <path d="M34 36 H202 V62 H62 V136 H34 Z" fill="none" stroke="#0a4d7a" stroke-width="2" opacity=".25" stroke-linejoin="round" transform="translate(1.5 1.5)"/>
  <!-- éclairage LED sous l'eau -->
  <g class="leds" clip-path="url(#jzclip)"><ellipse cx="120" cy="86" rx="92" ry="58" fill="url(#jzled)"/><ellipse cx="46" cy="50" rx="22" ry="18" fill="url(#jzled)"/><ellipse cx="196" cy="128" rx="22" ry="16" fill="url(#jzled)"/></g>
  <!-- bulles + jets (générés) -->
  <g id="jzbubbles"></g>
  <g id="jzstreams" fill="none"></g>
  <!-- reflet -->
  <path d="M36 40 Q100 34 150 42" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".22"/>
 </g>
 <!-- buses chromées -->
 <g id="jzjets"></g>
 <!-- appuie-têtes -->
 <g fill="#3a444e" stroke="#1d242b" stroke-width=".8">
  <rect x="48" y="19" width="28" height="13" rx="6.5"/><rect x="88" y="19" width="28" height="13" rx="6.5"/><rect x="128" y="19" width="28" height="13" rx="6.5"/>
  <rect x="15" y="74" width="13" height="28" rx="6.5"/>
 </g>
 <g fill="#fff" opacity=".22"><rect x="52" y="21" width="20" height="3" rx="1.5"/><rect x="92" y="21" width="20" height="3" rx="1.5"/><rect x="132" y="21" width="20" height="3" rx="1.5"/><rect x="17" y="78" width="3" height="20" rx="1.5"/></g>
 <!-- bec de cascade -->
 <rect class="fallbody" x="176" y="32" width="22" height="22" fill="#e6fbff"/>
 <g><line class="fall" x1="180" y1="32" x2="180" y2="54"/><line class="fall" x1="187" y1="32" x2="187" y2="54" style="animation-delay:-.25s"/><line class="fall" x1="194" y1="32" x2="194" y2="54" style="animation-delay:-.45s"/></g>
 <g><ellipse class="rip" cx="187" cy="56" rx="14" ry="4"/><ellipse class="rip" cx="187" cy="56" rx="14" ry="4"/></g>
 <rect x="170" y="21" width="34" height="11" rx="4" fill="url(#jzblade)" stroke="#7f8b97" stroke-width=".8"/>
 <rect x="174" y="29" width="26" height="4" rx="2" fill="url(#jzchrome)"/>
 <!-- vapeur en chauffe -->
 <g><ellipse class="steam" cx="86" cy="88" rx="12" ry="7"/><ellipse class="steam" cx="132" cy="104" rx="14" ry="8"/><ellipse class="steam" cx="170" cy="84" rx="11" ry="6"/><ellipse class="steam" cx="108" cy="72" rx="10" ry="6"/></g>
 <!-- panneau de commande sur le rebord -->
 <rect x="150" y="148" width="62" height="13" rx="4" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="181" y="158" id="jzdsp">--</text>
 <circle class="led" cx="141" cy="154.5" r="3"/>
</svg>`;

  // buses : [x, y] — dossier de la banquette (haut), côté gauche, fond du bassin
  const JETS = [[66, 43], [96, 43], [126, 43], [156, 43], [44, 92], [44, 118], [100, 133], [130, 133], [160, 133], [190, 133], [199, 86], [199, 110]];
  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['temp', 'mdi:thermometer-water', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['ph', 'mdi:ph', 'show_ph'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceJacuzziCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/jacuzzi|spa|hot.?tub/i, 'climate') || f(/(jacuzzi|spa|hot.?tub).*(status|etat|state|mode)/i, 'sensor'),
        entity_power: f(/(jacuzzi|spa|hot.?tub).*(power|puissance)/i, 'sensor'),
        entity_temp: f(/(jacuzzi|spa|hot.?tub).*(temp)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_temp: true, show_ph: true, show_cost: true, show_status: true,
        filter_threshold: 30, jets_threshold: 700, heater_threshold: 1800, power_max: 2500, off_threshold: 0.5,
        ph_min: 7, ph_max: 7.8, ...c };
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

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="jztitle">${esc(c.name || this._t('name'))}</div><div class="badge" id="jzbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="jzalert"></div>
        <div class="tiles" id="jztiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // buses chromées et jets d'eau qui partent vers le centre du bassin
      let jt = '', js = '';
      JETS.forEach(([x, y], i) => {
        const dx = 120 - x, dy = 88 - y, n = Math.hypot(dx, dy) || 1, ex = x + dx / n * 17, ey = y + dy / n * 17;
        jt += `<circle cx="${x}" cy="${y}" r="3.6" fill="url(#jzchrome)" stroke="#4d5762" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="1.1" fill="#2a3138"/>`;
        js += `<line class="js" x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" style="animation-delay:${(-i * 0.13).toFixed(2)}s"/>`;
      });
      // bulles : positions déterministes pour ne pas changer d'un rendu à l'autre
      let bb = '';
      for (let i = 0; i < 24; i++) {
        const x = 40 + ((i * 53) % 150), y = 40 + ((i * 37) % 95), r = 1.6 + (i % 4) * 0.7;
        bb += `<circle class="bub" cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#fff" style="animation-delay:${(-(i % 8) * 0.19).toFixed(2)}s"/>`;
      }
      root.getElementById('jzjets').innerHTML = jt;
      root.getElementById('jzstreams').innerHTML = js;
      root.getElementById('jzbubbles').innerHTML = bb;
      window.applianceBindIllus(this, root.querySelector('svg'), () => { const c = this._c; window.applianceMore(this, c.entity_temp || c.entity_power); });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      let txt = '';
      if (stObj) {
        const a = stObj.attributes || {};
        // climate : hvac_action décrit l'état réel, l'état « heat » n'est que le mode demandé
        txt = a.hvac_action ? String(a.hvac_action).toLowerCase() + (/^off$/i.test(String(stObj.state)) ? ' off' : '') : String(stObj.state).toLowerCase();
      }
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt)) st = 'off';
      else if (/jet|massage|bubbl|bulle|turbo|blower|souffl/.test(txt)) st = 'jets';
      else if (/heat|chauff/.test(txt)) st = 'heating';
      else if (/filt|circul|clean|ozon|sanit|pump|pompe/.test(txt)) st = 'filtering';
      else if (txt) st = 'standby';
      else if (!isNaN(pw)) {
        st = pw > c.heater_threshold ? 'heating' : pw > c.jets_threshold ? 'jets' : pw > c.filter_threshold ? 'filtering' : (pw > c.off_threshold ? 'standby' : 'off');
      } else st = 'standby';
      return { st, pw };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, pw } = this._compute();
      // températures dans l'unité d'affichage (°C / °F) ; temp_max par défaut : 40 °C
      const tc = window.applianceTemp(this._hass, c), tMax = c.temp_max ?? tc.c(40);
      const temp = tc.conv(this._num(c.entity_temp), this._st(c.entity_temp)), target = tc.conv(this._tgt(c.entity_target_temp), this._st(c.entity_target_temp)), ph = this._num(c.entity_ph);
      // vitesse des animations : suit la puissance (0.7 à 2.3), 1.4 si on ne la connaît pas en mode jets
      const spd = !isNaN(pw) ? 0.7 + 1.6 * Math.max(0, Math.min(1, pw / Number(c.power_max || 2500))) : (st === 'jets' ? 1.4 : 1);
      // éclairage : entité allumée ; la couleur vient de rgb_color si la lumière la fournit
      const lightEnt = this._st(c.entity_light), lit = !!lightEnt && lightEnt.state === 'on';
      const rgb = lit && lightEnt.attributes && Array.isArray(lightEnt.attributes.rgb_color) ? lightEnt.attributes.rgb_color.slice(0, 3).map((n) => Math.max(0, Math.min(255, Math.round(Number(n)) || 0))) : null;
      card.className = `${st} ${lit ? 'lit' : ''} ${rgb ? 'fixed' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--spd', spd.toFixed(2));
      if (rgb) card.style.setProperty('--jz-led', `rgb(${rgb.join(',')})`); else card.style.removeProperty('--jz-led');

      r.getElementById('jztitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('jzbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('jzdsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 1)}°` : '--';

      // alertes : pH hors plage, eau trop chaude
      const phBad = !isNaN(ph) && (ph < Number(c.ph_min) || ph > Number(c.ph_max)), hot = !isNaN(temp) && temp > Number(tMax);
      let al = '';
      if (!isNaN(ph) && ph < Number(c.ph_min)) al = `${this._t('lowph')} (${this._fmt(ph, 1)})`;
      else if (!isNaN(ph) && ph > Number(c.ph_max)) al = `${this._t('highph')} (${this._fmt(ph, 1)})`;
      else if (hot) al = `${this._t('hot')} (${this._fmt(temp, 1)} ${tc.unit})`;
      const ae = r.getElementById('jzalert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        temp: [c.entity_temp, this._fmt(temp, 1), tc.unit],
        target: [c.entity_target_temp, this._fmt(target, 1), tc.unit],
        ph: [c.entity_ph, this._fmt(ph, 1), ''],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      const ENT = { power: c.entity_power, energy: c.entity_energy, temp: c.entity_temp, target: c.entity_target_temp, ph: c.entity_ph, cost: c.entity_cost };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.classList.toggle('bad', (k === 'ph' && phBad) || (k === 'temp' && hot));
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = ENT[k] || (k === 'cost' ? c.entity_energy : ''); if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceJacuzziCard);

  /* ---- éditeur visuel ---- */
  class ApplianceJacuzziCardEditor extends HTMLElement {
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
      const tc = window.applianceTemp(this._hass, this._c), tr = (n, min, max, step) => ({ name: n, selector: { number: { ...tc.range(min, max), step, mode: 'box', unit_of_measurement: tc.unit } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_status'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_ph', 'sensor'), ent('entity_light'),
        { type: 'grid', name: '', schema: [
          num('filter_threshold', 0, 2000, 1, 'W'), num('jets_threshold', 0, 5000, 1, 'W'),
          num('heater_threshold', 0, 10000, 1, 'W'), num('power_max', 100, 10000, 10, 'W'),
          num('off_threshold', 0, 500, 0.1, 'W'), tr('temp_max', 20, 60, 0.5),
          num('ph_min', 0, 14, 0.1), num('ph_max', 0, 14, 0.1),
        ] },
        window.applianceTempField,
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_temp', selector: { boolean: {} }, default: true },
          { name: 'show_ph', selector: { boolean: {} }, default: true }, { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceJacuzziCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Jacuzzi / Hot tub', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Spa animé vu du dessus : jets, bulles, vapeur, cascade, éclairage LED, température et alertes pH.', preview: true,
  });
})();
