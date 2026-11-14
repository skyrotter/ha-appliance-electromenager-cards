/* Carte « Spa gonflable » — custom:appliance-inflatable-spa-card
 * Spa gonflable rond type Lay-Z-Spa : paroi grise effet bois, boudin clair, intérieur blanc, bloc pompe sur le côté
 * (écran de température, voyant d'état). Les fonctions sont indépendantes : chauffage, filtration, bulles, jets, lumière, couvercle.
 * Chauffe : l'eau rougeoie et de la vapeur monte ; filtration : rides lentes ; bulles : bulles qui montent ; jets : jets d'eau
 * depuis la paroi ; lumière : l'eau s'éclaire (couleur rgb_color si fournie) ; couvercle fermé : le spa est caché sous sa bâche.
 * Facultatifs : puissance, énergie, coût, températures (eau, consigne), pH, chlore, minuterie, code défaut, boutons de commande.
 */
(() => {
  const TAG = 'appliance-inflatable-spa-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n inflatable_spa*/{};
  const NO_ERR = /^(|0|none|no|ok|off|false|normal|no_error|aucune?|kein|unknown|unavailable)$/i;

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sp-heat:var(--appliance-heat-color,#ff8a3d);--sp-cold:var(--appliance-cold-color,#2b9af9);
  --sp-alert:var(--appliance-alert-color,#db4437);--sp-ok:var(--appliance-ok-color,#43a047);--spd:1;--sp-led:#7a5cff}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--sp-heat) 22%,transparent);color:var(--sp-heat)}
.filtering .badge,.bubbles .badge,.jets .badge{background:color-mix(in srgb,var(--sp-cold) 22%,transparent);color:var(--sp-cold)}
.alarm .badge{background:color-mix(in srgb,var(--sp-alert) 22%,transparent);color:var(--sp-alert)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--sp-alert);font-weight:500;text-align:center}.alert.on{display:block}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(240px * var(--illus-scale,1));width:calc(240px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.side{flex:1 1 130px;min-width:0}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 10px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 11px/16px var(--paper-font-body1_-_font-family,inherit)}
.ctl button.hide{display:none}.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.on{background:color-mix(in srgb,var(--sp-cold) 30%,var(--secondary-background-color))}
.ctl button.on.heat{background:color-mix(in srgb,var(--sp-heat) 32%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--sp-alert)}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante, tuiles en colonne ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .side{flex:0 0 42%;display:flex;flex-direction:column;justify-content:center}
.compact .tiles{grid-template-columns:1fr;gap:3px}.compact .ctl{gap:3px;margin-bottom:3px}.compact .ctl button{padding:3px 7px}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration : chaque fonction (f-heat, f-filter, f-bub, f-jet, f-light, f-cover) agit seule ---- */
.bub{opacity:0;transform-box:fill-box;transform-origin:center}
.f-bub .bub{animation:spbub calc(1.5s / var(--spd)) ease-out infinite}
.f-jet .bub:nth-child(3n){animation:spbub calc(1.8s / var(--spd)) ease-out infinite}
.f-heat .bub:nth-child(4n),.f-filter .bub:nth-child(7n){animation:spbub calc(2.8s / var(--spd)) ease-out infinite}
@keyframes spbub{0%{opacity:0;transform:scale(.3)}25%{opacity:.9}100%{opacity:0;transform:scale(1.5)}}
.js{stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:3 6;opacity:0}
.f-jet .js{opacity:.9;animation:spjet calc(.8s / var(--spd)) linear infinite}
@keyframes spjet{to{stroke-dashoffset:-9}}
.rip{fill:none;stroke:#fff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:center}
.f-filter .rip,.f-heat .rip,.f-bub .rip,.f-jet .rip{animation:sprip calc(2.2s / var(--spd)) ease-out infinite}
.rip:nth-child(2){animation-delay:-1.1s!important}
@keyframes sprip{0%{opacity:.7;transform:scale(.3)}100%{opacity:0;transform:scale(1.15)}}
.hot{fill:#ff7a2a;opacity:0;mix-blend-mode:screen;transition:opacity .8s}
.f-heat .hot{opacity:.45;animation:sppulse 2.4s ease-in-out infinite alternate}
@keyframes sppulse{to{opacity:.18}}
.steam{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center}
.f-heat .steam{animation:spsteam 3.6s ease-out infinite}
.steam:nth-child(2){animation-delay:-.9s!important}.steam:nth-child(3){animation-delay:-1.8s!important}.steam:nth-child(4){animation-delay:-2.7s!important}
@keyframes spsteam{0%{opacity:0;transform:translate(0,6px) scale(.5)}25%{opacity:.5}100%{opacity:0;transform:translate(6px,-34px) scale(2)}}
.leds{opacity:0;mix-blend-mode:screen;transition:opacity .6s;fill:var(--sp-led)}
.f-light .leds{opacity:.8;animation:sphue 12s linear infinite}
.f-light.fixed .leds{animation:none}
@keyframes sphue{to{filter:hue-rotate(360deg)}}
.lid{opacity:0;transition:opacity .6s}.f-cover .lid{opacity:1}
.f-cover .bub,.f-cover .js,.f-cover .rip,.f-cover .steam{display:none}
.pled{fill:#555;transition:fill .3s}
.filtering .pled,.bubbles .pled,.jets .pled,.standby .pled{fill:#43d17a}.heating .pled{fill:#ffa000;animation:spblink 1.4s steps(2) infinite}.alarm .pled{fill:#ff3d3d;animation:spblink .6s steps(2) infinite}
.warn{opacity:0}.alarm .warn{opacity:1;animation:spblink .6s steps(2) infinite}
.off svg,.unavailable svg{filter:grayscale(.45) brightness(.97)}.unavailable svg{opacity:.6}
.noanim *{animation:none!important}
@keyframes spblink{50%{opacity:.25}}
`;

  // veines du bois : ondulations horizontales sur la paroi (positions fixes, aspect naturel)
  const GRAIN = (() => { let g = ''; const ys = [72, 76, 80, 83, 87, 91, 94, 98, 102, 106, 109, 113, 117, 121]; ys.forEach((y, i) => { g += `<path d="M30 ${y}q${10 + (i % 4) * 3} ${i % 2 ? -2.2 : 2} ${22 + (i % 3) * 4} 0t${24 + (i % 5) * 3} 0t${20 + (i % 4) * 4} 0t${26} 0t${22} 0t${24} 0t${26} 0t${22} 0t${24} 0" opacity="${(0.25 + (i % 4) * 0.12).toFixed(2)}"/>`; }); return g; })();
  // bulles réparties dans l'eau (spirale dorée) et jets : buses sur la paroi intérieure
  const BUBS = (() => { let b = ''; for (let i = 0; i < 20; i++) { const t = Math.sqrt((i + 0.5) / 20), a = i * 2.39996, x = 128 + 58 * t * Math.cos(a), y = 67 + 15 * t * Math.sin(a), r = 1.4 + (i % 4) * 0.6; b += `<circle class="bub" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" style="animation-delay:${(-(i % 9) * 0.17).toFixed(2)}s"/>`; } return b; })();
  const JETS = (() => { let j = ''; [[74, 58, 98, 63], [90, 51, 108, 60], [166, 51, 148, 60], [182, 58, 158, 63], [84, 78, 106, 71], [172, 78, 150, 71]].forEach(([x1, y1, x2, y2], i) => { j += `<line class="js" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="animation-delay:${(-i * 0.13).toFixed(2)}s"/>`; }); return j; })();

  const SVG = (label) => `<svg viewBox="0 0 250 170" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="spwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5d6268"/><stop offset=".35" stop-color="#8b9096"/><stop offset=".75" stop-color="#6f747a"/><stop offset="1" stop-color="#4f5459"/></linearGradient>
    <linearGradient id="sprim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e6e9"/><stop offset="1" stop-color="#b9bec4"/></linearGradient>
    <radialGradient id="spwat" cx=".5" cy=".4"><stop offset="0" stop-color="#bfe9ff"/><stop offset=".6" stop-color="#6fc3ee"/><stop offset="1" stop-color="#3a9bd6"/></radialGradient>
    <linearGradient id="sppump" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eceef0"/><stop offset="1" stop-color="#b4babf"/></linearGradient>
    <radialGradient id="spsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <clipPath id="spwallc"><path d="M40 66V116A88 28 0 0 0 216 116V66Z"/></clipPath>
    <clipPath id="spwatc"><ellipse cx="128" cy="67" rx="66" ry="18"/></clipPath></defs>
    <ellipse cx="128" cy="150" rx="100" ry="10" fill="url(#spsh)"/>
    <!-- paroi effet bois -->
    <path d="M40 66V116A88 28 0 0 0 216 116V66Z" fill="url(#spwall)"/>
    <g clip-path="url(#spwallc)" fill="none" stroke="#2c3034" stroke-width=".9">${GRAIN}</g>
    <!-- poignées de vanne -->
    <rect x="82" y="96" width="4.5" height="16" rx="2.2" fill="#d5dade" stroke="#8b939b" stroke-width=".6"/><rect x="170" y="98" width="4.5" height="16" rx="2.2" fill="#d5dade" stroke="#8b939b" stroke-width=".6"/>
    <!-- boudin supérieur et intérieur blanc -->
    <ellipse cx="128" cy="64" rx="88" ry="28" fill="url(#sprim)"/>
    <ellipse cx="128" cy="64" rx="78" ry="23" fill="#f6f8fa"/>
    <ellipse cx="128" cy="66" rx="72" ry="21" fill="#e6ecf1"/>
    <!-- eau : dégradé, chaleur, lumière, bulles, jets, rides -->
    <ellipse cx="128" cy="67" rx="66" ry="18" fill="url(#spwat)"/>
    <g clip-path="url(#spwatc)"><ellipse class="hot" cx="128" cy="67" rx="66" ry="18"/><ellipse class="leds" cx="128" cy="67" rx="66" ry="18"/></g>
    <g>${BUBS}</g><g>${JETS}</g>
    <ellipse class="rip" cx="128" cy="67" rx="58" ry="15"/><ellipse class="rip" cx="128" cy="67" rx="58" ry="15"/>
    <g><ellipse class="steam" cx="104" cy="52" rx="9" ry="5"/><ellipse class="steam" cx="132" cy="48" rx="10" ry="5.5"/><ellipse class="steam" cx="156" cy="53" rx="8" ry="4.5"/><ellipse class="steam" cx="120" cy="56" rx="7" ry="4"/></g>
    <!-- couvercle -->
    <g class="lid"><ellipse cx="128" cy="64" rx="86" ry="27" fill="#4b5058" stroke="#6b7179" stroke-width="1.2"/><ellipse cx="128" cy="62" rx="70" ry="20" fill="none" stroke="#626872" stroke-width="1"/><rect x="116" y="56" width="24" height="5" rx="2.5" fill="#757c85"/></g>
    <!-- bloc pompe : écran, voyant, boutons, grilles -->
    <rect x="42" y="100" width="12" height="6" rx="3" fill="#8e969e"/>
    <rect x="8" y="72" width="40" height="62" rx="8" fill="url(#sppump)" stroke="#9aa1a8" stroke-width="1"/>
    <rect x="14" y="79" width="28" height="13" rx="2.5" fill="#1b2b24"/><text id="spdsp" x="28" y="89" text-anchor="middle" font-size="8.4" font-weight="700" fill="#7cffa4" font-family="ui-monospace,Consolas,monospace">--</text>
    <circle class="pled" cx="15" cy="99" r="2.3"/>
    <circle cx="23" cy="99" r="2.3" fill="#8f979f"/><circle cx="31" cy="99" r="2.3" fill="#8f979f"/><circle cx="39" cy="99" r="2.3" fill="#8f979f"/>
    <path d="M14 112h28M14 117h28M14 122h28" stroke="#98a0a8" stroke-width="1.6" stroke-linecap="round"/>
    <g class="warn"><path d="M226 22l14 24h-28z" fill="#ffb300" stroke="#8a5a00" stroke-width="1.5" stroke-linejoin="round"/><path d="M226 31v8" stroke="#3a2600" stroke-width="2.4" stroke-linecap="round"/><circle cx="226" cy="43" r="1.6" fill="#3a2600"/></g>
  </svg>`;

  const TILES = [['temp', 'mdi:thermometer-water', 'show_temp'], ['target', 'mdi:thermometer-check', 'show_target'], ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'], ['cost', 'mdi:cash', 'show_cost'], ['ph', 'mdi:ph', 'show_ph'], ['chlorine', 'mdi:flask-outline', 'show_chlorine'],
    ['timer', 'mdi:timer-outline', 'show_timer'], ['cover', 'mdi:window-closed-variant', 'show_cover']];
  const ENT = { temp: 'entity_temp', target: 'entity_target_temp', power: 'entity_power', energy: 'entity_energy', cost: 'entity_cost', ph: 'entity_ph', chlorine: 'entity_chlorine', timer: 'entity_timer', cover: 'entity_cover' };
  // boutons de commande : [clé, icône, option d'entité, classe]
  const BTNS = [['heater', 'mdi:radiator', 'entity_heater', 'heat'], ['filter', 'mdi:air-filter', 'entity_filter', ''], ['bubbles', 'mdi:chart-bubble', 'entity_bubbles', ''],
    ['jets', 'mdi:waves', 'entity_jets', ''], ['light', 'mdi:led-strip-variant', 'entity_light', '']];

  class ApplianceInflatableSpaCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_status: ids.find((i) => /^(climate|water_heater)\./.test(i) && /(spa|lay.?z|jacuzzi|hot.?tub)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { filter_threshold: 20, bubbles_threshold: 300, heater_threshold: 1500, power_max: 2500, off_threshold: 0.5, ph_min: 7, ph_max: 7.8, show_status: true, show_buttons: true,
        ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
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
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _isOn(id) { const s = this._st(id); return this._ok(s) && /^(on|true|heat|heating|auto|open|running)$/i.test(String(s.state)); }
    _tgt(id) {
      const s = this._st(id);
      if (s && /^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return s.attributes && s.attributes.temperature != null && isFinite(t) ? t : NaN; }
      return window.applianceNum(s);
    }
    _timer(id) {
      const s = this._st(id); if (!this._ok(s)) return '--';
      const v = parseFloat(String(s.state).replace(',', '.')), u = this._unit(id, 'min');
      if (!isFinite(v) || /:/.test(String(s.state))) return String(s.state);
      const min = /^h/i.test(u) ? v * 60 : /^s/i.test(u) ? v / 60 : v;
      return min >= 60 ? `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, '0')}` : `${Math.round(min)} min`;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity_status), pw = this._watts(c.entity_power);
      const known = ['entity_status', 'entity_power', 'entity_heater', 'entity_filter', 'entity_bubbles', 'entity_jets', 'entity_temp'].some((k) => this._ok(this._st(c[k])));
      let txt = '';
      if (this._ok(s)) { const a = s.attributes || {}; txt = String(/^(climate|water_heater)\./.test(s.entity_id) && /^off$/i.test(String(s.state)) ? 'off' : (a.hvac_action || s.state)).toLowerCase().trim(); }
      const has = (k) => !!c[k] && this._ok(this._st(c[k]));
      const heat = has('entity_heater') ? this._isOn(c.entity_heater) : /heat|chauff/.test(txt) ? true : (!c.entity_heater && !isNaN(pw) && pw >= Number(c.heater_threshold));
      const bub = has('entity_bubbles') ? this._isOn(c.entity_bubbles) : /bubbl|bulle|blower|air/.test(txt) || (!c.entity_bubbles && !isNaN(pw) && pw >= Number(c.bubbles_threshold) && pw < Number(c.heater_threshold));
      const jet = has('entity_jets') ? this._isOn(c.entity_jets) : /jet|massage|hydro/.test(txt);
      const filt = has('entity_filter') ? this._isOn(c.entity_filter) : /filt|circul|pump|pompe/.test(txt) || (!c.entity_filter && !isNaN(pw) && pw > Number(c.filter_threshold)) || heat || bub || jet;
      const err = this._st(c.entity_error);
      const errCode = this._ok(err) && !NO_ERR.test(String(err.state).trim()) ? (/^(on|true)$/i.test(String(err.state)) ? '' : String(err.state)) : null;
      const alarm = errCode !== null || /alarm|alarme|error|erreur|fault|d[ée]faut/.test(txt);
      const lightS = this._st(c.entity_light), lit = this._isOn(c.entity_light);
      const rgb = lit && lightS.attributes && Array.isArray(lightS.attributes.rgb_color) ? lightS.attributes.rgb_color.slice(0, 3).map((n) => Math.max(0, Math.min(255, Math.round(Number(n)) || 0))) : null;
      const cv = this._st(c.entity_cover);
      // couvercle : cover.* « closed » = fermé ; binary_sensor / switch : on = ouvert, off = fermé
      const closed = this._ok(cv) ? (/^cover\./.test(cv.entity_id) ? /^closed$/i.test(String(cv.state)) : /^(off|closed|false)$/i.test(String(cv.state))) : false;
      const explicitOff = /^(off|false|arr[eê]t|[ée]teint)$/.test(txt);
      let st = !known ? 'unavailable' : alarm ? 'alarm' : heat ? 'heating' : jet ? 'jets' : bub ? 'bubbles' : filt ? 'filtering' : (explicitOff || (!txt && (isNaN(pw) || pw <= Number(c.off_threshold)) && !has('entity_filter'))) ? 'off' : 'standby';
      if (st === 'standby' && !isNaN(pw) && pw <= Number(c.off_threshold) && !txt) st = 'off';
      return { st, pw, heat, bub, jet, filt, lit, rgb, closed, errCode };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sptitle"></div><div class="badge" id="spbadge"></div></div>
        <div class="alert" id="spalert"></div>
        <div class="body">${SVG(this._c.name || this._t('name'))}
          <div class="side"><div class="ctl" id="spctl">${BTNS.map(([k, ic, , cl]) => `<button class="hide ${cl}" data-b="${k}"><ha-icon icon="${ic}"></ha-icon><span></span></button>`).join('')}</div>
            <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div></div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_status || this._c.entity_temp || this._c.entity_power));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]] || (el.dataset.k === 'cost' ? this._c.entity_energy : ''))));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => {
        const id = this._c[(BTNS.find((x) => x[0] === b.dataset.b) || [])[2]]; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        this._hass.callService(['switch', 'input_boolean', 'light', 'fan'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, heat, bub, jet, filt, lit, rgb, closed, errCode } = this._compute();
      const spd = !isNaN(pw) ? 0.7 + 1.6 * Math.max(0, Math.min(1, pw / Number(c.power_max || 2500))) : (bub || jet ? 1.4 : 1);
      card.className = [st, heat ? 'f-heat' : '', filt ? 'f-filter' : '', bub ? 'f-bub' : '', jet ? 'f-jet' : '', lit ? 'f-light' : '', rgb ? 'fixed' : '', closed ? 'f-cover' : '',
        c.animations === false ? 'noanim' : '', c.compact === true ? 'compact' : ''].filter(Boolean).join(' ');
      card.style.setProperty('--spd', spd.toFixed(2));
      if (rgb) card.style.setProperty('--sp-led', `rgb(${rgb.join(',')})`); else card.style.removeProperty('--sp-led');
      r.getElementById('sptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('spbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      const tc = window.applianceTemp(this._hass, c), tMax = c.temp_max ?? tc.c(40);
      const temp = tc.conv(this._num(c.entity_temp), this._st(c.entity_temp)), target = tc.conv(this._tgt(c.entity_target_temp), this._st(c.entity_target_temp));
      r.getElementById('spdsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 0)}°` : '--';
      const ph = this._num(c.entity_ph), chl = this._num(c.entity_chlorine);
      const phBad = !isNaN(ph) && (ph < Number(c.ph_min) || ph > Number(c.ph_max)), hot = !isNaN(temp) && temp > Number(tMax);
      let al = '';
      if (st === 'alarm') al = errCode ? this._t('alarm_alert').replace('{e}', errCode) : this._t('alarm_short');
      else if (!isNaN(ph) && ph < Number(c.ph_min)) al = `${this._t('lowph')} (${this._fmt(ph, 1)})`;
      else if (!isNaN(ph) && ph > Number(c.ph_max)) al = `${this._t('highph')} (${this._fmt(ph, 1)})`;
      else if (hot) al = `${this._t('hot')} (${this._fmt(temp, 1)} ${tc.unit})`;
      const ae = r.getElementById('spalert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        temp: [c.entity_temp, this._fmt(temp, 1), tc.unit],
        target: [c.entity_target_temp, this._fmt(target, 1), tc.unit],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
        ph: [c.entity_ph, this._fmt(ph, 1), ''],
        chlorine: [c.entity_chlorine, this._fmt(chl, 1), this._unit(c.entity_chlorine, 'mg/L')],
        timer: [c.entity_timer, this._timer(c.entity_timer), ''],
        cover: [c.entity_cover, this._ok(this._st(c.entity_cover)) ? this._t(closed ? 'cover_closed' : 'cover_open') : '--', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', (k === 'ph' && phBad) || (k === 'temp' && hot));
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      // boutons : un par fonction dont l'entité est renseignée ; allumé quand la fonction est active
      const act = { heater: heat, filter: filt, bubbles: bub, jets: jet, light: lit };
      let shown = 0;
      r.querySelectorAll('.ctl button').forEach((b) => {
        const [, , opt] = BTNS.find((x) => x[0] === b.dataset.b), id = c[opt], vis = !!id && c.show_buttons !== false;
        b.classList.toggle('hide', !vis); if (vis) shown++;
        b.classList.toggle('on', !!act[b.dataset.b]);
        b.querySelector('span').textContent = this._t(`btn_${b.dataset.b}`);
        b.disabled = !this._ok(this._st(id));
      });
      r.getElementById('spctl').classList.toggle('hide', !shown);
    }
  }
  customElements.define(TAG, ApplianceInflatableSpaCard);

  /* ---- éditeur visuel ---- */
  class ApplianceInflatableSpaCardEditor extends HTMLElement {
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
      const tc = window.applianceTemp(this._hass, this._c), tr = (n, min, max, step) => ({ name: n, selector: { number: { ...tc.range(min, max), step, mode: 'box', unit_of_measurement: tc.unit } } });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_status', ['climate', 'water_heater', 'switch', 'input_boolean', 'sensor', 'binary_sensor']),
        ent('entity_heater', ['switch', 'input_boolean', 'climate', 'binary_sensor']), ent('entity_filter', ['switch', 'input_boolean', 'binary_sensor']),
        ent('entity_bubbles', ['switch', 'input_boolean', 'binary_sensor']), ent('entity_jets', ['switch', 'input_boolean', 'binary_sensor']),
        ent('entity_light', ['light', 'switch', 'input_boolean']), ent('entity_cover', ['cover', 'binary_sensor', 'switch', 'input_boolean']),
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp', ['climate', 'water_heater', 'number', 'input_number', 'sensor']),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_ph', 'sensor'), ent('entity_chlorine', 'sensor'), ent('entity_timer', ['sensor', 'number', 'input_number']), ent('entity_error', ['sensor', 'binary_sensor']),
        { type: 'grid', name: '', schema: [
          num('filter_threshold', 0, 2000, 1, 'W'), num('bubbles_threshold', 0, 5000, 10, 'W'), num('heater_threshold', 0, 10000, 10, 'W'), num('power_max', 100, 10000, 10, 'W'),
          num('off_threshold', 0, 500, 0.1, 'W'), tr('temp_max', 20, 60, 0.5), num('ph_min', 0, 14, 0.1), num('ph_max', 0, 14, 0.1),
        ] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_buttons'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceInflatableSpaCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Spa gonflable animé : chauffage, filtration, bulles, jets, lumière LED, couvercle, température, pH, chlore, minuterie, défaut.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/inflatable-spa.md',
  });
})();
