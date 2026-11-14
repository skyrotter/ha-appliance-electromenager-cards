/* Carte « Chauffage diesel » — custom:appliance-diesel-heater-card
 * Poêle à gazole en volume : plateau fonte en perspective, conduit inox, chambre de combustion
 * (couronne bleue du brûleur à mèche + flammes en trois couches), hublot de niveau de gazole.
 * États : off, standby, ignition, heating, cooldown (purge du souffleur), alarm.
 */
(() => {
  const TAG = 'appliance-diesel-heater-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n diesel_heater*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--dh-heat:var(--appliance-heat-color,#ff8a3d);--dh-cold:var(--appliance-cold-color,#2b9af9);
  --dh-alert:var(--appliance-alert-color,#db4437);--dh-ok:var(--appliance-ok-color,#43a047);--mod:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge,.ignition .badge{background:color-mix(in srgb,var(--dh-heat) 22%,transparent);color:var(--dh-heat)}
.cooldown .badge{background:color-mix(in srgb,var(--dh-cold) 22%,transparent);color:var(--dh-cold)}
.alarm .badge{background:color-mix(in srgb,var(--dh-alert) 22%,transparent);color:var(--dh-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--dh-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(190px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--dh-alert)}

/* ---- illustration ---- */
/* flammes : le groupe prend l'échelle de l'état, chaque couche vacille à son rythme */
.flames{opacity:0;transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.1);transition:opacity .5s,transform .5s}
.ignition .flames{opacity:.9;transform:scaleY(.38)}
.heating .flames{opacity:1;transform:scaleY(calc(.6 + .4*var(--mod)))}
.fl{transform-box:fill-box;transform-origin:50% 100%}
.ignition .fl,.heating .fl{animation:dhflick .5s ease-in-out infinite alternate}
.ignition .fl.f2,.heating .fl.f2{animation-duration:.36s;animation-delay:-.12s}
.ignition .fl.f3,.heating .fl.f3{animation-duration:.27s;animation-delay:-.2s}
@keyframes dhflick{0%{transform:scale(1,1)}100%{transform:scale(.9,.86) translate(1px,0)}}
.crown{opacity:0;transition:opacity .5s}
.ignition .crown{opacity:.55}
.heating .crown{opacity:1}
.crown .cf{transform-box:fill-box;transform-origin:50% 100%}
.ignition .cf,.heating .cf{animation:dhcrown .32s ease-in-out infinite alternate}
.crown .cf:nth-child(odd){animation-duration:.24s;animation-delay:-.1s}
@keyframes dhcrown{0%{transform:scaleY(1)}100%{transform:scaleY(.72)}}
.glow{opacity:0;transition:opacity .6s}
.ignition .glow{opacity:.3}
.heating .glow{opacity:calc(.4 + .45*var(--mod));animation:dhpulse 1.6s ease-in-out infinite alternate}
@keyframes dhpulse{to{opacity:calc(.25 + .3*var(--mod))}}
.embers{opacity:0}
.cooldown .embers{animation:dhember 4s ease-in-out infinite alternate}
@keyframes dhember{0%{opacity:.7}100%{opacity:.15}}
.plug{opacity:0}
.ignition .plug{animation:dhplug .6s ease-in-out infinite alternate}
@keyframes dhplug{0%{opacity:.45}100%{opacity:1}}
.puff{opacity:0;transform-box:fill-box;transform-origin:center}
.heating .puff,.ignition .puff,.cooldown .puff{animation:dhrise 3.4s ease-out infinite}
.puff:nth-child(2){animation-delay:-1.1s!important}.puff:nth-child(3){animation-delay:-2.2s!important}
.cooldown .puff{fill:#f4f7fa}
@keyframes dhrise{0%{opacity:0;transform:translate(0,8px) scale(.5)}20%{opacity:.6}100%{opacity:0;transform:translate(9px,-34px) scale(1.9)}}
.wave{fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round;opacity:0}
.heating .wave{animation:dhwave 2.4s ease-out infinite}
.wave:nth-child(2){animation-delay:-.8s!important}.wave:nth-child(3){animation-delay:-1.6s!important}
@keyframes dhwave{0%{opacity:0;transform:translateY(4px)}30%{opacity:.5}100%{opacity:0;transform:translateY(-16px)}}
.blades{transform-box:fill-box;transform-origin:50% 50%}
.ignition .blades{animation:dhspin .7s linear infinite}
.heating .blades{animation:dhspin .45s linear infinite}
.cooldown .blades{animation:dhspin .22s linear infinite}
@keyframes dhspin{to{transform:rotate(360deg)}}
.purge{fill:none;stroke:#bfe3ff;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:6 9;opacity:0}
.cooldown .purge{opacity:.85;animation:dhpurge .6s linear infinite}
@keyframes dhpurge{to{stroke-dashoffset:-15}}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.ignition .led{fill:#ffd24a;animation:dhblink .7s steps(2) infinite}.cooldown .led{fill:#3fa3ff;animation:dhblink 1.2s steps(2) infinite}
.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:dhblink .8s steps(2) infinite}
@keyframes dhblink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}.ignition .dsp{fill:#ffd24a}
.fuelfill{fill:url(#dhfuelg)}
.low .fuelfill{fill:var(--dh-alert)}
.off .body-shade{opacity:.8}
.noanim *{animation:none!important}
.noanim .fl,.noanim .cf{transform:none}
`;

  const SVG = (label) => `
<svg viewBox="0 0 240 226" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="dhsteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8c96a1"/><stop offset=".3" stop-color="#eef2f6"/><stop offset=".55" stop-color="#b4bdc7"/><stop offset="1" stop-color="#707a86"/></linearGradient>
  <linearGradient id="dhbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c333b"/><stop offset=".22" stop-color="#4a535d"/><stop offset=".5" stop-color="#39424b"/><stop offset="1" stop-color="#1f252b"/></linearGradient>
  <linearGradient id="dhtop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c7682"/><stop offset="1" stop-color="#3a424b"/></linearGradient>
  <linearGradient id="dhside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#171c21"/><stop offset="1" stop-color="#2a3138"/></linearGradient>
  <linearGradient id="dhfo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a1f"/><stop offset=".6" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ffc766"/></linearGradient>
  <linearGradient id="dhfm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9d28"/><stop offset=".7" stop-color="#ffd24a"/><stop offset="1" stop-color="#fff0a0"/></linearGradient>
  <linearGradient id="dhfi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2b5"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <linearGradient id="dhfb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1239ff"/><stop offset=".55" stop-color="#3fa3ff"/><stop offset="1" stop-color="#c9f2ff"/></linearGradient>
  <radialGradient id="dhgl" cx=".5" cy="1" r=".95"><stop offset="0" stop-color="#ffb04a" stop-opacity=".9"/><stop offset=".55" stop-color="#ff6a1f" stop-opacity=".3"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
  <radialGradient id="dhem" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="#ff4a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient>
  <linearGradient id="dhfuelg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8a317"/><stop offset=".5" stop-color="#ffd25a"/><stop offset="1" stop-color="#c88a0c"/></linearGradient>
 </defs>
 <!-- ombre au sol -->
 <ellipse cx="120" cy="214" rx="92" ry="8" fill="#000" opacity=".18"/>
 <!-- conduit inox -->
 <rect x="110" y="14" width="20" height="56" fill="url(#dhsteel)"/>
 <rect x="107" y="40" width="26" height="5" rx="2" fill="url(#dhsteel)" stroke="#8a949f" stroke-width=".6"/>
 <rect x="107" y="22" width="26" height="4" rx="2" fill="url(#dhsteel)" stroke="#8a949f" stroke-width=".6"/>
 <ellipse cx="120" cy="14" rx="10" ry="3" fill="#2a3138"/>
 <g fill="#e8eef4"><circle class="puff" cx="120" cy="10" r="5"/><circle class="puff" cx="118" cy="10" r="4"/><circle class="puff" cx="123" cy="10" r="4.5"/></g>
 <!-- ondes de chaleur au-dessus du plateau -->
 <g><path class="wave" d="M70 56 q6 -5 12 0 t12 0"/><path class="wave" d="M146 56 q6 -5 12 0 t12 0"/><path class="wave" d="M96 60 q6 -5 12 0 t12 0"/></g>
 <!-- corps : plateau en fonte en perspective, face avant, flanc -->
 <path class="body-shade" d="M42 84 L198 84 L198 200 L42 200Z" fill="url(#dhbody)"/>
 <path class="body-shade" d="M198 84 L214 72 L214 190 L198 200Z" fill="url(#dhside)"/>
 <path class="body-shade" d="M64 60 L176 60 L214 72 L198 84 L42 84 L26 72Z" fill="url(#dhtop)" stroke="#232a31" stroke-width="1.2" stroke-linejoin="round"/>
 <path d="M64 60 L176 60 L214 72" fill="none" stroke="#9aa4b0" stroke-width=".8" opacity=".6"/>
 <ellipse cx="120" cy="68" rx="30" ry="6.5" fill="#2a3138" stroke="#8a949f" stroke-width="1.2"/>
 <ellipse cx="120" cy="67" rx="21" ry="4" fill="#12161a"/>
 <!-- bandeau de commande -->
 <rect x="52" y="90" width="42" height="14" rx="3" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="73" y="100.5" id="dhdsp">--</text>
 <circle class="led" cx="106" cy="97" r="3.2"/>
 <circle cx="124" cy="97" r="5" fill="#8a949f" stroke="#c4ccd5"/><line x1="124" y1="97" x2="127" y2="93.5" stroke="#1d2329" stroke-width="1.6" stroke-linecap="round"/>
 <!-- souffleur -->
 <circle cx="178" cy="97" r="8.5" fill="#12161a" stroke="#6c7682"/>
 <g class="blades"><path d="M178 97 L178 90.5 Q182 92 180.5 96Z M178 97 L184.5 97 Q183 101 179.5 99Z M178 97 L178 103.5 Q174 102 175.5 98Z M178 97 L171.5 97 Q173 93 176.5 95Z" fill="#9aa4b0"/></g>
 <circle cx="178" cy="97" r="1.6" fill="#2a3138"/>
 <!-- chambre de combustion : hublot -->
 <rect x="50" y="112" width="102" height="62" rx="7" fill="#1b2026" stroke="#5b6672" stroke-width="2"/>
 <rect x="55" y="117" width="92" height="52" rx="4" fill="#0f1217"/>
 <rect class="glow" x="55" y="117" width="92" height="52" rx="4" fill="url(#dhgl)"/>
 <rect class="embers" x="55" y="117" width="92" height="52" rx="4" fill="url(#dhem)"/>
 <!-- brûleur à mèche : cuve, trous de la mèche, bougie de préchauffage -->
 <path d="M70 169 L72 160 Q101 154 130 160 L132 169Z" fill="#59636e" stroke="#3a424b"/>
 <ellipse cx="101" cy="160" rx="29" ry="5" fill="#2a3138" stroke="#7b8590" stroke-width=".8"/>
 <g fill="#12161a" id="dhholes"></g>
 <circle class="plug" cx="125" cy="158" r="3" fill="#ff7a2a"/>
 <!-- couronne bleue (mèche) puis flammes en trois couches -->
 <g class="crown" id="dhcrown"></g>
 <g class="flames" id="dhflames">
  <path class="fl f1" d="M101 160 C74 160 76 142 90 134 C88 144 94 141 101 122 C108 141 114 144 112 134 C126 142 128 160 101 160Z" fill="url(#dhfo)"/>
  <path class="fl f2" d="M101 158 C85 158 87 146 95 140 C94 148 98 146 101 130 C104 146 108 148 107 140 C115 146 117 158 101 158Z" fill="url(#dhfm)"/>
  <path class="fl f3" d="M101 156 C93 156 94 149 98 146 C98 150 100 148 101 140 C102 148 104 150 104 146 C108 149 109 156 101 156Z" fill="url(#dhfi)"/>
 </g>
 <path d="M55 119 L86 119 L55 146Z" fill="#fff" opacity=".07"/>
 <!-- hublot de niveau de gazole -->
 <rect x="160" y="112" width="20" height="62" rx="6" fill="#1b2026" stroke="#5b6672" stroke-width="1.6"/>
 <rect x="165" y="117" width="10" height="52" rx="3" fill="#0f1217"/>
 <rect class="fuelfill" id="dhfuel" x="165" y="143" width="10" height="26" rx="3"/>
 <g stroke="#c4ccd5" stroke-width=".9" opacity=".75"><path d="M163 130 h4 M163 143 h4 M163 156 h4"/></g>
 <path d="M166 119 v48" stroke="#fff" stroke-width="1.2" opacity=".18"/>
 <!-- air de purge -->
 <g><path class="purge" d="M186 106 q8 4 4 12"/><path class="purge" d="M188 114 q8 6 2 16" style="animation-delay:-.2s"/></g>
 <!-- grille basse + pieds -->
 <g stroke="#12161a" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M58 184 H146 M58 190 H146"/></g>
 <rect x="52" y="200" width="14" height="9" rx="2" fill="#1b2026"/><rect x="176" y="200" width="14" height="9" rx="2" fill="#1b2026"/>
</svg>`;

  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['fuel', 'mdi:gas-station', 'show_fuel'],
    ['used', 'mdi:water', 'show_fuel_used'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['temp', 'mdi:thermometer', 'show_temps'],
    ['flue', 'mdi:chimney', 'show_temps'],
  ];

  class ApplianceDieselHeaterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/diesel|gazole|fioul|mazout|poele|stove|heater/i, 'climate') || f(/(diesel|gazole|fioul|mazout|poele|stove|heater).*(status|etat|state)/i, 'sensor'),
        entity_power: f(/(diesel|gazole|fioul|mazout|poele|stove|heater).*(power|puissance)/i, 'sensor'),
        entity_fuel_level: f(/(diesel|gazole|fioul|mazout|fuel).*(level|niveau)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_fuel: true, show_fuel_used: true, show_cost: true, show_temps: true,
        show_status: true, threshold: 15, ignition_threshold: 60, off_threshold: 0.5, fuel_alert: 15, ...c };
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

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="dhtitle">${esc(c.name || this._t('name'))}</div><div class="badge" id="dhbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="dhalert"></div>
        <div class="tiles" id="dhtiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // couronne bleue : petites flammes en cercle autour de la mèche (ellipse vue en perspective)
      let cr = '', ho = '';
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2, x = 101 + 24 * Math.cos(a), y = 158.5 + 3.6 * Math.sin(a);
        cr += `<path class="cf" d="M${(x - 2).toFixed(1)} ${y.toFixed(1)} C${(x - 2.4).toFixed(1)} ${(y - 4).toFixed(1)} ${(x - 1).toFixed(1)} ${(y - 7).toFixed(1)} ${x.toFixed(1)} ${(y - 9).toFixed(1)} C${(x + 1).toFixed(1)} ${(y - 7).toFixed(1)} ${(x + 2.4).toFixed(1)} ${(y - 4).toFixed(1)} ${(x + 2).toFixed(1)} ${y.toFixed(1)}Z" fill="url(#dhfb)"/>`;
      }
      for (let i = 0; i < 9; i++) ho += `<circle cx="${(77 + i * 6).toFixed(0)}" cy="164.5" r="1.1"/>`;
      root.getElementById('dhcrown').innerHTML = cr;
      root.getElementById('dhholes').innerHTML = ho;
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
      const flameEnt = this._st(c.entity_flame);
      const flame = flameEnt ? flameEnt.state === 'on' : null;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou|lockout/.test(txt)) st = 'alarm';
      else if (/cool|purge|refroid|extingu|shut|arr[eê]t en cours|stopping|post.?run/.test(txt)) st = 'cooldown';
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt) && flame !== true) st = 'off';
      else if (/ignit|allum|start|glow|pr[eé]chauff|prehe/.test(txt)) st = 'ignition';
      else if (/heat|chauff|burn|brûl|brul|running|^on/.test(txt) || flame === true) st = 'heating';
      else if (txt) st = 'standby';
      else if (flame === false) st = 'standby';
      else if (!isNaN(pw)) st = pw > c.ignition_threshold ? 'ignition' : (pw > c.threshold ? 'heating' : (pw > c.off_threshold ? 'standby' : 'off'));
      else st = 'standby';
      if (flame === false && st === 'heating' && /standby|idle|veille/.test(txt)) st = 'standby';
      return { st, pw };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, pw } = this._compute();
      // températures dans l'unité d'affichage (°C / °F) ; flue_temp_max par défaut : 300 °C
      const tc = window.applianceTemp(this._hass, c), tv = (id) => tc.conv(this._num(id), this._st(id));
      const temp = tv(c.entity_temp), flue = tv(c.entity_flue_temp), flueMax = c.flue_temp_max ?? tc.c(300);
      let fuel = this._num(c.entity_fuel_level);
      const low = !isNaN(fuel) && fuel < Number(c.fuel_alert);
      let mod = this._num(c.entity_modulation); mod = isNaN(mod) ? 1 : Math.max(0, Math.min(100, mod)) / 100;
      card.className = `${st} ${low ? 'low' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--mod', mod);

      r.getElementById('dhtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('dhbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const dsp = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : st === 'ignition' ? 'IGN' : st === 'cooldown' ? 'PURG' : (!isNaN(temp) ? `${Math.round(temp)}°` : '--');
      r.getElementById('dhdsp').textContent = dsp;

      // hublot de niveau : 52 px de haut, de y=117 (plein) à y=169 (vide)
      const lvl = isNaN(fuel) ? 0.5 : Math.max(0, Math.min(100, fuel)) / 100, h = Math.max(2, 52 * lvl);
      const fe = r.getElementById('dhfuel'); fe.setAttribute('y', (169 - h).toFixed(1)); fe.setAttribute('height', h.toFixed(1));

      // alertes
      let al = '';
      if (low) al = `${this._t('lowfuel')} (${this._fmt(fuel, 0)} %)`;
      else if (!isNaN(flue) && flue > flueMax) al = this._t('hotflue');
      const ae = r.getElementById('dhalert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy), used = this._num(c.entity_fuel_used);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_liter && !isNaN(used)) { cost = used * Number(c.price_per_liter); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        fuel: [c.entity_fuel_level, this._fmt(fuel, 0), '%'],
        used: [c.entity_fuel_used, this._fmt(used, 1), this._unit(c.entity_fuel_used, 'L')],
        cost: [c.entity_cost || (c.price_per_liter && c.entity_fuel_used), this._fmt(cost, 2), costU],
        temp: [c.entity_temp, this._fmt(temp, 1), tc.unit],
        flue: [c.entity_flue_temp, this._fmt(flue, 0), tc.unit],
      };
      const ENT = { power: c.entity_power, energy: c.entity_energy, fuel: c.entity_fuel_level, used: c.entity_fuel_used, cost: c.entity_cost, temp: c.entity_temp, flue: c.entity_flue_temp };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.classList.toggle('bad', (k === 'fuel' && low) || (k === 'flue' && !isNaN(flue) && flue > flueMax));
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = ENT[k]; if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceDieselHeaterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceDieselHeaterCardEditor extends HTMLElement {
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
        ...window.applianceTileFields(this._hass),
        ent('entity_status'), ent('entity_flame', 'binary_sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_fuel_level', 'sensor'), ent('entity_fuel_used', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_liter', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_flue_temp', 'sensor'), ent('entity_modulation', 'sensor'),
        { type: 'grid', name: '', schema: [
          { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'ignition_threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'fuel_alert', selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_fuel', selector: { boolean: {} }, default: true },
          { name: 'show_fuel_used', selector: { boolean: {} }, default: true }, { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'show_temps', selector: { boolean: {} }, default: true }, { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceDieselHeaterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Chauffage diesel / Diesel heater', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Poêle à gazole animé : couronne bleue et flammes, allumage, purge du souffleur, niveau de gazole, conso élec.', preview: true,
  });
})();
