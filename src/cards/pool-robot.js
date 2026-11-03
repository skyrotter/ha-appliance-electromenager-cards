/* Carte « Robot de piscine » — custom:appliance-pool-robot-card
 * Bassin vu en coupe : margelle, carrelage, eau avec vagues en surface et reflets au fond.
 * Le robot (coque, chenilles, brosse avant, câble flottant) fait des allers-retours sur le fond
 * en nettoyant : chenilles et brosse tournent, débris aspirés, bulles. Le niveau d'eau suit
 * entity_water_level (repère « min » sur la paroi), la jauge du filtre sur la coque suit
 * entity_filter (saturation, 0 → 100 %).
 * États : cleaning, paused, returning, idle, error, unavailable. Entité vacuum (Démarrer / Pause /
 * Remonter), switch / input_boolean (Marche / Arrêt) ou sensor texte. Les deux se combinent :
 * entity_switch = prise connectée qui alimente le robot (bouton Marche / Arrêt en plus).
 */
(() => {
  const TAG = 'appliance-pool-robot-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n pool_robot*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--pr-ok:var(--appliance-ok-color,#43a047);--pr-cold:var(--appliance-cold-color,#2b9af9);
  --pr-warn:#ffa31a;--pr-alert:var(--appliance-alert-color,#db4437);--wl:.85;--dirt:0;--pr-water:#2fa6d9}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.cleaning .badge{background:color-mix(in srgb,var(--pr-ok) 22%,transparent);color:var(--pr-ok)}
.returning .badge,.paused .badge{background:color-mix(in srgb,var(--pr-cold) 22%,transparent);color:var(--pr-cold)}
.error .badge{background:color-mix(in srgb,var(--pr-alert) 22%,transparent);color:var(--pr-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pr-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(280px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:120px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.on{background:var(--primary-color,#03a9f4);color:#fff}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--pr-alert)}

/* ---- eau : la surface descend avec le niveau, vagues permanentes ---- */
.water{transform:translateY(calc((1 - var(--wl)) * 60px));transition:transform 1.2s ease-out}
.wave{animation:prwave 5s linear infinite}.wave.b{animation-duration:3.4s;animation-direction:reverse}
@keyframes prwave{to{transform:translateX(-32px)}}
.caus{fill:none;stroke:#fff;stroke-width:1.2;stroke-linecap:round;opacity:.15;animation:prcaus 3s ease-in-out infinite alternate}
.caus:nth-of-type(2n){animation-delay:-1.5s}
@keyframes prcaus{to{opacity:.4}}
/* ---- robot : allers-retours sur le fond, demi-tour à chaque paroi ---- */
.drive{transform:translateX(0)}
.flip{transform-box:view-box;transform-origin:72px 150px}
.cleaning .drive{animation:prdrive 14s ease-in-out infinite}
.cleaning .flip{animation:prflip 14s linear infinite}
.returning .drive{animation:prdrive 22s ease-in-out infinite}
.returning .flip{animation:prflip 22s linear infinite}
@keyframes prdrive{0%,4%{transform:translateX(0)}46%,54%{transform:translateX(136px)}96%,100%{transform:translateX(0)}}
@keyframes prflip{0%,49.9%{transform:scaleX(1)}50%,99.9%{transform:scaleX(-1)}}
.error .bot{transform-box:view-box;transform-origin:72px 160px;animation:prshake .35s ease-in-out infinite}
@keyframes prshake{25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
.tread{fill:none;stroke:#5a636b;stroke-width:3;stroke-dasharray:3 3}
.cleaning .tread,.returning .tread{animation:prtread .3s linear infinite}
@keyframes prtread{to{stroke-dashoffset:-6}}
.brush{transform:rotate(0)}
.cleaning .brush{animation:prspin .35s linear infinite}
@keyframes prspin{to{transform:rotate(-360deg)}}
.bub{fill:#fff;opacity:0}
.cleaning .bub{animation:prbub 2.2s ease-in infinite}
.bub:nth-of-type(2){animation-delay:-.7s!important}.bub:nth-of-type(3){animation-delay:-1.4s!important}.bub:nth-of-type(4){animation-delay:-1.9s!important}
@keyframes prbub{0%{opacity:0;transform:translateY(0)}15%{opacity:.8}100%{opacity:0;transform:translateY(-70px)}}
.deb{opacity:0}
.cleaning .deb{animation:prdeb 1.1s ease-in infinite}
.deb:nth-of-type(2){animation-delay:-.4s!important}.deb:nth-of-type(3){animation-delay:-.8s!important}
@keyframes prdeb{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(-14px,-2px) scale(.4)}}
/* jauge du filtre sur la coque : se remplit avec --dirt, vire à l'orange puis au rouge */
.dirt{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--dirt));transition:transform 1s,fill .6s;fill:#8d6e4a}
.full .dirt{fill:var(--pr-alert)}
.led{fill:#59636c}
.cleaning .led{fill:#3ddc5a;animation:prblink 1.6s ease-in-out infinite}
.returning .led,.paused .led{fill:#3fa3ff}
.error .led{fill:#ff3b30;animation:prblink .5s steps(2) infinite}
@keyframes prblink{50%{opacity:.3}}
.mark{fill:var(--pr-alert);font:600 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.low .mark{animation:prblink 1s steps(2) infinite}
.noanim *{animation:none!important}
`;

  const SVG = (label) => {
    const wave = (y, h) => `M-10 ${y} q8 -3.5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V${y + h} H-10 Z`;
    const tiles = Array.from({ length: 16 }, (_, i) => `M${30 + i * 15} 162 V170`).join(' ') + ' ' + Array.from({ length: 8 }, (_, i) => `M8 ${42 + i * 15} H18 M262 ${42 + i * 15} H272`).join(' ');
    return `
<svg viewBox="0 0 280 184" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="prw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pr-water)" stop-opacity=".55"/><stop offset="1" stop-color="#0c5f8a" stop-opacity=".9"/></linearGradient>
  <linearGradient id="prshell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#dfe5ea"/><stop offset="1" stop-color="#b6c0c8"/></linearGradient>
  <clipPath id="prpool"><rect x="18" y="30" width="244" height="132"/></clipPath>
 </defs>
 <ellipse cx="140" cy="178" rx="136" ry="4" fill="#000" opacity=".15"/>
 <!-- bassin : parois et fond carrelés, margelle -->
 <rect x="8" y="30" width="264" height="140" rx="3" fill="#dfe8ee"/>
 <rect x="18" y="30" width="244" height="132" fill="#eaf4f8"/>
 <path d="${tiles}" stroke="#b9cbd6" stroke-width="1"/>
 <rect x="2" y="24" width="276" height="8" rx="2" fill="#c8cdd1"/>
 <g clip-path="url(#prpool)">
  <g class="water">
   <path class="wave b" d="${wave(46, 130)}" fill="url(#prw)" opacity=".55"/>
   <path class="wave" d="${wave(48, 130)}" fill="url(#prw)"/>
  </g>
  <path class="caus" d="M40 150 q10 -4 20 0 t20 0"/><path class="caus" d="M110 154 q10 -4 20 0 t20 0"/><path class="caus" d="M180 150 q10 -4 20 0 t20 0"/>
 </g>
 <!-- repère de niveau minimum sur la paroi droite -->
 <path id="prmin" d="M250 0 H262" stroke="var(--pr-alert)" stroke-width="1.2" stroke-dasharray="2 1.5"/>
 <text class="mark" id="prmint" x="248" y="0" text-anchor="end">min</text>
 <!-- robot -->
 <g class="drive"><g class="flip"><g class="bot">
  <!-- câble flottant vers la surface -->
  <path d="M72 126 C70 104 96 96 92 74 S104 50 110 40" fill="none" stroke="#2a3138" stroke-width="1.6" stroke-linecap="round"/>
  <!-- bulles -->
  <circle class="bub" cx="64" cy="124" r="1.8"/><circle class="bub" cx="78" cy="122" r="1.4"/><circle class="bub" cx="70" cy="126" r="2.2"/><circle class="bub" cx="84" cy="125" r="1.2"/>
  <!-- débris aspirés devant la brosse -->
  <g fill="#7a5b3a"><rect class="deb" x="112" y="156" width="3" height="2" rx="1"/><circle class="deb" cx="118" cy="157" r="1.3"/><rect class="deb" x="122" y="155.5" width="2.5" height="2.5" rx=".8"/></g>
  <!-- chenilles -->
  <rect x="38" y="146" width="68" height="15" rx="7.5" fill="#2a3138"/>
  <rect class="tread" x="39.5" y="147.5" width="65" height="12" rx="6"/>
  <circle cx="46" cy="153.5" r="4" fill="#4a535b"/><circle cx="98" cy="153.5" r="4" fill="#4a535b"/>
  <!-- coque -->
  <path d="M36 148 V136 Q36 122 52 120 H92 Q108 122 108 136 V148 Z" fill="url(#prshell)" stroke="#9aa6b0"/>
  <rect x="36" y="140" width="72" height="5" fill="#1e7fd0"/>
  <!-- poignée -->
  <path d="M52 120 V112 Q52 106 58 106 H86 Q92 106 92 112 V120" fill="none" stroke="#9aa6b0" stroke-width="4" stroke-linecap="round"/>
  <!-- jauge du filtre (saleté) -->
  <rect x="45" y="125" width="9" height="13" rx="2" fill="#f4f7f9" stroke="#9aa6b0" stroke-width=".8"/>
  <rect class="dirt" x="46.5" y="126.5" width="6" height="10" rx="1"/>
  <circle class="led" cx="98" cy="128" r="2.3"/>
  <!-- brosse avant -->
  <g transform="translate(108 152)"><g class="brush"><circle r="7" fill="#1e7fd0"/>
   <path d="M-7 0 H7 M0 -7 V7 M-5 -5 L5 5 M-5 5 L5 -5" stroke="#bfe3ff" stroke-width="1.4"/><circle r="2" fill="#0f3e66"/></g></g>
 </g></g></g>
</svg>`;
  };

  const TILES = [
    ['status', 'mdi:robot-vacuum', 'show_status_tile'],
    ['filter', 'mdi:filter-variant', 'show_filter'],
    ['water_level', 'mdi:waves', 'show_water_level'],
    ['water_temp', 'mdi:pool-thermometer', 'show_water_temp'],
    ['time', 'mdi:timer-sand', 'show_time'],
    ['battery', 'mdi:battery', 'show_battery'],
    ['mode', 'mdi:format-list-bulleted', 'show_mode'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
  ];

  class AppliancePoolRobotCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const re = /pool.?robot|robot.?piscine|dolphin|zodiac|piscine|pool/i;
      const f = (r, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && r.test(i)) || '';
      return {
        entity: f(re, 'vacuum') || f(re, 'switch'),
        entity_switch: f(re, 'vacuum') ? f(re, 'switch') : '',
        entity_filter: f(/(pool|piscine|robot|dolphin).*filt/i, 'sensor'),
        entity_water_temp: f(/(pool|piscine).*(temp)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_status_tile: true, show_filter: true, show_water_level: true, show_water_temp: true,
        show_time: true, show_battery: true, show_mode: true, show_power: true, show_energy: true,
        filter_alert: 80, water_level_full: 100, water_level_min: 70, run_threshold: 30, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
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
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // durée restante en minutes, quelle que soit l'unité du capteur (s, min, h)
    _minutes(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 'min').toLowerCase();
      return u === 's' ? v / 60 : u === 'h' ? v * 60 : v;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="prtitle"></div><div class="badge" id="prbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="pralert"></div>
        <div class="ctl" id="prctl">
          <button data-a="start"><ha-icon icon="mdi:play"></ha-icon><span></span></button>
          <button data-a="pause"><ha-icon icon="mdi:pause"></ha-icon><span></span></button>
          <button data-a="dock"><ha-icon icon="mdi:arrow-collapse-up"></ha-icon><span></span></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ status: cc.entity_status || cc.entity, filter: cc.entity_filter, water_level: cc.entity_water_level, water_temp: cc.entity_water_temp,
          time: cc.entity_time, battery: cc.entity_battery || cc.entity, mode: cc.entity_mode, power: cc.entity_power, energy: cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h || !(c.entity || c.entity_switch)) return;
      if (a === 'power') { h.callService('homeassistant', 'toggle', { entity_id: this._plug() }); return; }
      if (!c.entity) return;
      h.callService('vacuum', { start: 'start', pause: 'pause', dock: 'return_to_base' }[a], { entity_id: c.entity });
    }

    // prise qui alimente le robot : entity_switch, sinon l'entité principale si c'est un switch
    _plug() {
      const c = this._c;
      if (c.entity_switch) return c.entity_switch;
      return ['switch', 'input_boolean'].includes((c.entity || '').split('.')[0]) ? c.entity : '';
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const pw = this._watts(c.entity_power);
      // prise coupée = robot hors tension, même si l'entité vacuum est devenue indisponible
      const plug = c.entity_switch && this._st(c.entity_switch);
      if (plug && plug.state === 'off') return 'idle';
      if (!s && plug && plug.state === 'on') return !isNaN(pw) && pw <= Number(c.run_threshold) ? 'idle' : 'cleaning';
      const txt = String((this._st(c.entity_status) || {}).state || (s && s.state) || '').toLowerCase();
      if (!s && isNaN(pw)) return 'unavailable';
      if (s && /^(unavailable|unknown)$/.test(s.state) && isNaN(pw)) return 'unavailable';
      if (/error|erreur|fault|défaut|defaut|stuck|bloqu/.test(txt)) return 'error';
      if (/pause/.test(txt)) return 'paused';
      if (/return|retour|remont|waterline|ligne|pickup/.test(txt)) return 'returning';
      if (/clean|nettoy|running|^on$|marche|working/.test(txt)) return 'cleaning';
      if (/^(off|idle|docked|stopped|finished|done|ready|arr[eê]t|termin)/.test(txt)) return 'idle';
      return !isNaN(pw) && pw > Number(c.run_threshold) ? 'cleaning' : 'idle';
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const st = this._compute(), clamp = (x) => Math.max(0, Math.min(1, x));
      const s = this._st(c.entity), attr = (s && s.attributes) || {};
      const filter = this._num(c.entity_filter), lvl = this._num(c.entity_water_level);
      // température dans l'unité d'affichage (°C / °F)
      const tc = window.applianceTemp(this._hass, c), temp = tc.conv(this._num(c.entity_water_temp), this._st(c.entity_water_temp));
      const time = this._minutes(c.entity_time), pw = this._watts(c.entity_power), energy = this._num(c.entity_energy);
      let batt = this._num(c.entity_battery); if (isNaN(batt) && isFinite(Number(attr.battery_level))) batt = Number(attr.battery_level);
      const full = Number(c.water_level_full) || 100;
      const filterFull = !isNaN(filter) && filter >= Number(c.filter_alert);
      const low = !isNaN(lvl) && lvl < Number(c.water_level_min);

      card.className = `${st}${filterFull ? ' full' : ''}${low ? ' low' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--wl', (isNaN(lvl) ? 0.85 : clamp(lvl / full)).toFixed(3));
      card.style.setProperty('--dirt', (isNaN(filter) ? 0 : clamp(filter / 100)).toFixed(3));
      // repère « min » : surface d'eau quand le niveau vaut water_level_min (même formule que .water)
      const ymin = 48 + (1 - clamp(Number(c.water_level_min) / full)) * 60;
      r.getElementById('prmin').setAttribute('d', `M250 ${ymin.toFixed(1)} H262`);
      r.getElementById('prmint').setAttribute('y', (ymin + 2.5).toFixed(1));
      r.getElementById('prmin').style.display = r.getElementById('prmint').style.display = c.entity_water_level ? '' : 'none';

      r.getElementById('prtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('prbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const alerts = [];
      if (st === 'error') alerts.push(attr.error ? String(attr.error) : this._t('error'));
      if (filterFull) alerts.push(this._t('filter_full'));
      if (low) alerts.push(this._t('low_water'));
      const al = r.getElementById('pralert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);

      // commandes : vacuum = Démarrer / Pause / Remonter, prise (switch) = Marche / Arrêt, les deux si entity_switch
      const d = (c.entity || '').split('.')[0], vac = d === 'vacuum', plugId = this._plug();
      const plugOn = plugId && (this._st(plugId) || {}).state === 'on';
      const ctl = r.getElementById('prctl');
      ctl.classList.toggle('hide', c.show_controls === false || (!vac && !plugId));
      const active = { cleaning: 'start', paused: 'pause', returning: 'dock' }[st];
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.classList.toggle('hide', a === 'power' ? !plugId : !vac);
        b.classList.toggle('on', a === 'power' ? !!(plugOn && vac) : vac && a === active);
        b.querySelector('span').textContent = this._t(a === 'power' ? (plugOn ? 'turn_off' : 'turn_on') : a);
      });

      const mode = this._st(c.entity_mode);
      const V = {
        status: [true, this._t(st), ''],
        filter: [c.entity_filter, this._fmt(filter, 0), this._unit(c.entity_filter, '%')],
        water_level: [c.entity_water_level, this._fmt(lvl, 0), this._unit(c.entity_water_level, '%')],
        water_temp: [c.entity_water_temp, this._fmt(temp, 1), tc.unit],
        time: [c.entity_time, isNaN(time) ? '--' : time >= 60 ? `${Math.floor(time / 60)} h ${String(Math.round(time % 60)).padStart(2, '0')}` : this._fmt(time, 0), isNaN(time) || time >= 60 ? '' : 'min'],
        battery: [c.entity_battery || isFinite(Number(attr.battery_level)), this._fmt(batt, 0), '%'],
        mode: [c.entity_mode, mode ? String(mode.state) : '--', ''],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), 'W'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
      };
      const bad = { filter: filterFull, water_level: low };
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
  customElements.define(TAG, AppliancePoolRobotCard);

  /* ---- éditeur visuel ---- */
  class AppliancePoolRobotCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box' } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_switch'), ent('entity_status', 'sensor'), ent('entity_filter', 'sensor'), ent('entity_water_level', 'sensor'),
        ent('entity_water_temp', 'sensor'), ent('entity_time', 'sensor'), ent('entity_battery', 'sensor'), ent('entity_mode'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { type: 'grid', name: '', schema: [
          num('filter_alert', 0, 100, 1, 80), num('water_level_min', 0, 1000, 1, 70), num('water_level_full', 1, 1000, 1, 100), num('run_threshold', 0, 2000, 1, 30),
        ] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_status_tile'), bool('show_filter'), bool('show_water_level'), bool('show_water_temp'),
          bool('show_time'), bool('show_battery'), bool('show_mode'), bool('show_power'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', AppliancePoolRobotCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Pool robot / Robot de piscine',
    description: 'Robot nettoyeur de piscine animé : allers-retours sur le fond, brosse, bulles, jauge du filtre, niveau d\'eau, commandes.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
