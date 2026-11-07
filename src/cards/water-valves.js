/* Cartes « Robinet connecté » (custom:appliance-smart-tap-card) et « Vanne motorisée » (custom:appliance-water-valve-card)
 * - Robinet : boîtier noir Zigbee (type Sonoff SWV) entre le robinet et le tuyau d'arrosage, anneau lumineux vert, eau qui coule,
 *   programmation, mode capacité, durées rapides, pluie, humidité du sol, batterie, signal.
 * - Vanne : actionneur noir sur vanne à boule en laiton, levier rose qui tourne, eau qui circule dans le tuyau blanc,
 *   position (%), fuite, gel, batterie, minuterie de fermeture.
 * Tout est facultatif. Le débit accepte L/min, L/h, m³/h, gal/min ; les volumes L, mL, m³, gal.
 */
(() => {
  const TAGS = ['appliance-smart-tap-card', 'appliance-water-valve-card'];
  if (TAGS.some((t) => customElements.get(t))) return;

  const TT = /*@i18n smart_tap*/{};
  const TV = /*@i18n water_valve*/{};

  const OPEN_RE = /^(open|opening|on|true|yes|1|opened|running|watering|irrigating|active)$/i;
  const ON_RE = /^(on|true|yes|1|problem|fault|alarm|detected|triggered|leak|wet|rain|raining)$/i;
  const list = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((s) => String(s).trim()).filter(Boolean);
  // unités → litres
  const VOL = { l: 1, liter: 1, litre: 1, liters: 1, litres: 1, ml: 0.001, 'm³': 1000, m3: 1000, gal: 3.78541, gallon: 3.78541, gallons: 3.78541, 'ft³': 28.3168, ft3: 28.3168 };

  const COMMON_CSS = `
:host{display:block;height:100%} ha-card{display:block;height:100%;box-sizing:border-box;padding:10px 12px 12px;overflow:hidden;
  --wv-ok:var(--appliance-ok-color,#43a047);--wv-alert:var(--appliance-alert-color,#db4437);--wv-warn:var(--appliance-warn-color,#ffa000);--wv-cold:var(--appliance-cold-color,#2b9af9);--wv-water:#2b9af9;transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--wv-water) 22%,transparent);color:var(--wv-water)}
.leak .badge,.fault .badge{background:color-mix(in srgb,var(--wv-alert) 22%,transparent);color:var(--wv-alert)}
.freeze .badge,.rain .badge{background:color-mix(in srgb,var(--wv-cold) 22%,transparent);color:var(--wv-cold)}
.low_battery .badge,.moving .badge{background:color-mix(in srgb,var(--wv-warn) 22%,transparent);color:var(--wv-warn)}
ha-card.leak,ha-card.fault{box-shadow:0 0 0 1px color-mix(in srgb,var(--wv-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--wv-alert) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--wv-alert);font-weight:500;text-align:center}.alert.on{display:block}
.freeze .alert,.rain .alert{color:var(--wv-cold)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl .hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 12px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}.ctl button:disabled{opacity:.45;cursor:default}
.ctl button.on{background:color-mix(in srgb,var(--wv-water) 30%,var(--secondary-background-color))}
.ctl button.red{background:color-mix(in srgb,var(--wv-alert) 25%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--wv-alert)}.tile.warn .v{color:var(--wv-warn)}.tile.cold .v{color:var(--wv-cold)}
/* ---- éléments d'illustration communs ---- */
.wv-stream{fill:none;stroke:#4fb0ff;stroke-width:6;stroke-linecap:round;stroke-dasharray:7 6;opacity:0}
.open .wv-stream{opacity:.9;animation:wvflow calc(.8s / var(--spd,1)) linear infinite}
.wv-ripple{fill:none;stroke:#bfe3ff;stroke-width:1.2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.open .wv-ripple{animation:wvrip 1.6s ease-out infinite}.open .wv-ripple.r2{animation-delay:.8s}
.wv-splash{fill:#8fd0ff;opacity:0}.open .wv-splash{animation:wvsplash .9s ease-out infinite}.open .wv-splash.s2{animation-delay:.3s}.open .wv-splash.s3{animation-delay:.6s}
.wv-drop{opacity:0}.leak .wv-drop{animation:wvdrop 1.3s ease-in infinite}.leak .wv-drop.d2{animation-delay:.65s}
.wv-puddle{transform-box:fill-box;transform-origin:50% 50%;transform:scale(0);transition:transform 1.2s cubic-bezier(.2,.9,.3,1)}.leak .wv-puddle{transform:scale(1)}
.wv-ico{opacity:0;transition:opacity .4s}
.fault .wv-warn,.leak .wv-warn{opacity:1;animation:wvblink 1s infinite}.low_battery .wv-bat{opacity:1;animation:wvblink 2s infinite}
.freeze .wv-frost{opacity:1}.rain .wv-rain{opacity:1}.rain .wv-rd{animation:wvrain .9s linear infinite}.rain .wv-rd.d2{animation-delay:.3s}.rain .wv-rd.d3{animation-delay:.6s}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (comme les autres cartes) ---- */
.stage{display:block}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .stage{flex:1 1 auto;min-height:0;width:100%;margin-top:3px;display:flex;align-items:center;justify-content:center}
.compact svg{width:calc(100% * min(1,var(--illus-scale,1)));height:calc(100% * min(1,var(--illus-scale,1)));max-width:none;margin:0}
.compact .alert{flex:none;font-size:10px;margin-top:2px}
.compact .ctl{flex:none;gap:4px;margin-top:4px}.compact .ctl button{padding:3px 8px;border-radius:8px;font-size:11px;line-height:14px}.compact .ctl button ha-icon{--mdc-icon-size:14px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
@keyframes wvflow{to{stroke-dashoffset:-13}}
@keyframes wvrip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.2)}}
@keyframes wvsplash{0%{opacity:.9;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--sx,6px),-9px)}}
@keyframes wvdrop{0%{opacity:0;transform:translateY(0)}15%{opacity:1}85%{opacity:1;transform:translateY(14px)}100%{opacity:0;transform:translateY(16px)}}
@keyframes wvblink{50%{opacity:.2}}
@keyframes wvrain{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(10px)}}
`;

  /* pictogrammes d'alerte (avertissement, pile, givre, pluie) posés en (x, y) */
  const ICONS = (x, y) => `<g transform="translate(${x} ${y})">
    <g class="wv-ico wv-warn"><path d="M12 1 L23 21 H1 Z" fill="#ff1744"/><rect x="11" y="8" width="2" height="7" fill="#fff"/><rect x="11" y="16.5" width="2" height="2.2" fill="#fff"/></g>
    <g class="wv-ico wv-bat"><rect x="0" y="4" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="22" y="7" width="3" height="6" fill="#ffa000"/><rect x="3" y="7" width="5" height="6" fill="#ffa000"/></g>
    <g class="wv-ico wv-frost" stroke="#8fd3ff" stroke-width="2" stroke-linecap="round"><path d="M12 1V23M2 6.5L22 17.5M2 17.5L22 6.5"/></g>
    <g class="wv-ico wv-rain"><path d="M6 14 a5 5 0 0 1 2 -9.6 a7 7 0 0 1 13 2.4 a4 4 0 0 1 -1 7.2 Z" fill="#9aa7b4"/>
      <path class="wv-rd" d="M8 18 l-1.5 4" stroke="#4fb0ff" stroke-width="1.8" stroke-linecap="round"/><path class="wv-rd d2" d="M13 18 l-1.5 4" stroke="#4fb0ff" stroke-width="1.8" stroke-linecap="round"/><path class="wv-rd d3" d="M18 18 l-1.5 4" stroke="#4fb0ff" stroke-width="1.8" stroke-linecap="round"/></g></g>`;

  /* ---------- Robinet connecté (boîtier Zigbee noir, anneau vert) ---------- */
  const TAP_CSS = `
.tp-ring{fill:#0a0c0e;stroke:#3a3f45;stroke-width:4;transition:stroke .4s}
.open .tp-ring{stroke:#43e05f;animation:tpglow 2.2s ease-in-out infinite}
.rain .tp-ring{stroke:#2b9af9}.fault .tp-ring,.leak .tp-ring{stroke:#ff1744;animation:wvblink .6s infinite}.low_battery .tp-ring{stroke:#ffa000;animation:wvblink 2s infinite}
.unavailable .tp-ring{stroke:#444;animation:none}
.tp-lever{transition:transform .4s}.open .tp-lever{transform:translateY(-3px)}
.tp-grass{fill:#3f8f3a}.open .tp-grass{animation:tpgrass 2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes tpglow{0%,100%{filter:drop-shadow(0 0 1px #43e05f)}50%{filter:drop-shadow(0 0 6px #43e05f)}}
@keyframes tpgrass{50%{transform:scaleY(1.12)}}
`;
  const TAP_SVG = (label) => `<svg viewBox="0 0 200 150" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="tpbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4f56"/><stop offset=".25" stop-color="#25282c"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>
    <linearGradient id="tpchrome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d959e"/><stop offset=".4" stop-color="#e9edf1"/><stop offset="1" stop-color="#7a828b"/></linearGradient></defs>
    <!-- robinet mural, écrou d'entrée -->
    <rect x="66" y="0" width="22" height="18" fill="url(#tpchrome)"/><path d="M66 5H88M66 10H88M66 14H88" stroke="#6c747d" stroke-width=".8"/>
    <rect x="58" y="16" width="38" height="16" rx="3" fill="#1b1e22"/><path d="M68 16V32M86 16V32" stroke="#33383d" stroke-width="1"/>
    <!-- boîtier -->
    <rect x="44" y="30" width="112" height="78" rx="16" fill="url(#tpbody)"/>
    <rect x="52" y="38" width="96" height="62" rx="11" fill="#14161a" stroke="#3a3f45" stroke-width=".8"/>
    <path d="M56 46 Q56 40 64 40 H100" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.5" stroke-linecap="round"/>
    <circle class="tp-ring" cx="122" cy="64" r="12"/>
    <rect x="62" y="48" width="30" height="3" rx="1.5" fill="#3a3f45"/><rect x="62" y="55" width="20" height="3" rx="1.5" fill="#2e3237"/>
    <rect x="104" y="86" width="40" height="2.5" rx="1.2" fill="#3a3f45"/><rect x="112" y="91" width="24" height="2.5" rx="1.2" fill="#2e3237"/>
    <!-- sortie filetée -->
    <rect x="60" y="106" width="34" height="14" rx="3" fill="#1b1e22"/><rect x="64" y="120" width="26" height="14" rx="2" fill="url(#tpchrome)"/>
    <path d="M64 124H90M64 128H90M64 132H90" stroke="#6c747d" stroke-width=".8"/>
    <!-- bouton orange -->
    <g class="tp-lever"><rect x="122" y="104" width="26" height="14" rx="4" fill="#f57c20"/><rect x="127" y="108" width="16" height="3" rx="1.5" fill="#ffb067"/></g>
    <!-- eau et herbe -->
    <ellipse class="wv-puddle" cx="100" cy="147" rx="70" ry="5" fill="#4fb0ff" opacity=".55"/>
    <path class="wv-stream" d="M77 136 V146"/>
    <ellipse class="wv-ripple" cx="77" cy="146" rx="20" ry="3"/><ellipse class="wv-ripple r2" cx="77" cy="146" rx="20" ry="3"/>
    <circle class="wv-splash" cx="72" cy="145" r="1.6" style="--sx:-8px"/><circle class="wv-splash s2" cx="82" cy="145" r="1.6"/><circle class="wv-splash s3" cx="77" cy="145" r="1.3" style="--sx:2px"/>
    <g class="tp-grass"><path d="M24 150 q2 -12 5 0 M30 150 q3 -16 6 0 M36 150 q2 -10 4 0 M150 150 q2 -11 5 0 M156 150 q3 -15 6 0 M163 150 q2 -9 4 0"/></g>
    ${ICONS(166, 10)}
  </svg>`;

  /* ---------- Vanne motorisée (actionneur noir sur vanne à boule) ---------- */
  const VALVE_CSS = `
.vv-lever{transform-box:view-box;transform-origin:100px 72px;transform:scaleX(calc(.14 + .86 * var(--pos,0)));transition:transform 1.2s ease-in-out}
.vv-led{fill:#555;transition:fill .3s}.open .vv-led{fill:#43e05f}.closed .vv-led{fill:#ff3b30;animation:wvblink 4s infinite}
.moving .vv-led{fill:#ffa000;animation:wvblink .5s infinite}.leak .vv-led,.fault .vv-led{fill:#ff1744;animation:wvblink .4s infinite}.low_battery .vv-led{fill:#ffa000;animation:wvblink 2s infinite}
.unavailable .vv-led{fill:#444;animation:none}
.vv-wr{opacity:0;transition:opacity .8s}.open .vv-wr{opacity:.5}
.vv-flow{fill:none;stroke:#3d9bff;stroke-width:6;stroke-linecap:round;stroke-dasharray:10 8;opacity:0}
.open .vv-flow{opacity:.85;animation:vvflow calc(.9s / var(--spd,1)) linear infinite}
.leak .vv-pipe-glow{opacity:1}
@keyframes vvflow{to{stroke-dashoffset:-18}}
`;
  const VALVE_SVG = (label) => `<svg viewBox="0 0 200 150" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="vvpipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#dfe3e8"/><stop offset="1" stop-color="#aab1b9"/></linearGradient>
    <linearGradient id="vvbrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0cd75"/><stop offset=".5" stop-color="#c9973f"/><stop offset="1" stop-color="#7e5d1f"/></linearGradient>
    <linearGradient id="vvmetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d959e"/><stop offset=".5" stop-color="#eef1f4"/><stop offset="1" stop-color="#868e97"/></linearGradient>
    <linearGradient id="vvblack" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2d31"/><stop offset=".35" stop-color="#4b5056"/><stop offset="1" stop-color="#0e0f11"/></linearGradient></defs>
    <!-- tuyau blanc, eau en amont (toujours) et en aval (vanne ouverte) -->
    <rect x="0" y="88" width="200" height="34" fill="url(#vvpipe)"/>
    <rect x="0" y="95" width="70" height="20" rx="3" fill="#8ecbff" opacity=".5"/><rect class="vv-wr" x="130" y="95" width="70" height="20" rx="3" fill="#8ecbff"/>
    <path class="vv-flow" d="M4 105H68"/><path class="vv-flow" d="M132 105H196"/>
    <!-- corps laiton -->
    <rect x="62" y="86" width="12" height="38" rx="3" fill="#b8862f"/><rect x="126" y="86" width="12" height="38" rx="3" fill="#b8862f"/>
    <rect x="70" y="80" width="60" height="48" rx="9" fill="url(#vvbrass)"/>
    <text x="100" y="118" font-size="7" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#5b4210">DN20</text>
    <rect x="93" y="70" width="14" height="12" rx="2" fill="#d6aa52"/>
    <!-- levier rose (tourne d'un quart de tour) -->
    <g class="vv-lever"><rect x="34" y="68" width="66" height="7" rx="3.5" fill="#e91e8c"/><circle cx="38" cy="71.5" r="6" fill="#d11a7f"/></g>
    <!-- étrier métallique et collier de serrage -->
    <rect x="74" y="62" width="52" height="6" rx="2" fill="url(#vvmetal)"/><rect x="74" y="62" width="5" height="22" rx="2" fill="url(#vvmetal)"/>
    <path d="M124 65 H148 V86" fill="none" stroke="#b9c0c7" stroke-width="5" stroke-linejoin="round"/>
    <rect x="140" y="84" width="16" height="42" rx="3" fill="url(#vvmetal)" stroke="#7f8891" stroke-width=".8"/><circle cx="148" cy="96" r="3.6" fill="#6f7780"/><path d="M145.5 94 l5 4" stroke="#3b4148" stroke-width="1"/>
    <!-- actionneur -->
    <path d="M78 62 V28 Q78 11 100 11 Q122 11 122 28 V62 Z" fill="url(#vvblack)"/><rect x="78" y="53" width="44" height="9" fill="#0b0c0d"/>
    <rect x="84" y="20" width="4" height="30" rx="2" fill="#fff" opacity=".14"/><circle class="vv-led" cx="100" cy="38" r="3.2"/>
    <path d="M122 48 C148 48 146 104 156 150" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
    <!-- fuite -->
    <ellipse class="wv-puddle" cx="100" cy="143" rx="80" ry="6" fill="#4fb0ff" opacity=".6"/>
    <path class="wv-drop" d="M100 126 q-3.5 5 0 8 q3.5 -3 0 -8 Z" fill="#6bb8ff"/><path class="wv-drop d2" d="M92 126 q-3.5 5 0 8 q3.5 -3 0 -8 Z" fill="#6bb8ff"/>
    ${ICONS(166, 8)}
  </svg>`;

  /* ---------- carte de base ---------- */
  const TILE_ICONS = { flow: 'mdi:water-pump', volume: 'mdi:cup-water', today: 'mdi:water', total: 'mdi:counter', remaining: 'mdi:timer-sand', next: 'mdi:calendar-clock',
    moisture: 'mdi:water-percent', position: 'mdi:valve', pressure: 'mdi:gauge', temperature: 'mdi:thermometer', power: 'mdi:flash', cost: 'mdi:cash', battery: 'mdi:battery', signal: 'mdi:signal', mode: 'mdi:cog' };

  class Base extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(this.META.tag + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => this.META.guess.test(i) && /^(valve|switch|input_boolean)\./.test(i)) || ids.find((i) => /^valve\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      const m = this.constructor.META;
      this._c = { battery_low: 20, freeze_temp: 3, quick_times: m.quick, show_status: true, show_buttons: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    get _T() { return this.constructor.META.T; }
    _t(k) { return this._T[this._lang()][k] ?? this._T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(this._T, this._c, this._hass); }
    _loc() { return window.applianceLocale(this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _on(id) { return list(id).some((i) => { const s = this._st(i); return this._ok(s) && ON_RE.test(String(s.state)); }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _fmt(v, d = 1) { return isNaN(v) ? '--' : (Math.round(v * 10 ** d) / 10 ** d).toLocaleString(this._loc(), { maximumFractionDigits: d }); }
    _unit(id, dflt) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || dflt; }
    // volume → litres (unité du capteur : L, mL, m³, gal ; sans unité : litres)
    _liters(id) {
      const s = this._st(id), v = this._num(s); if (isNaN(v)) return NaN;
      return v * (VOL[String(this._unit(id, 'L')).trim().toLowerCase()] || 1);
    }
    // débit → L/min (L/min, L/h, m³/h, gal/min, L/s…)
    _flow(id) {
      const s = this._st(id), v = this._num(s); if (isNaN(v)) return NaN;
      const [n, d] = String(this._unit(id, 'L/min')).trim().toLowerCase().split('/');
      const per = { s: 1 / 60, sec: 1 / 60, min: 1, h: 60, hr: 60 }[(d || 'min').trim()] || 1;
      return (v * (VOL[(n || 'l').trim()] || 1)) / per;
    }
    _fmtVol(l) { return isNaN(l) ? ['--', 'L'] : l >= 1000 ? [this._fmt(l / 1000, 2), 'm³'] : [this._fmt(l, l < 10 ? 1 : 0), 'L']; }
    // durée restante → secondes (nombre + unité s / min / h, H:MM:SS, ou horodatage)
    _secs(id) {
      const s = this._st(id); if (!this._ok(s)) return NaN;
      const raw = String(s.state).trim();
      if (/^\d+:\d{2}(:\d{2})?$/.test(raw)) { const p = raw.split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]; }
      if (s.attributes.device_class === 'timestamp' || /^\d{4}-\d{2}-\d{2}T/.test(raw)) { const t = Date.parse(raw); return t ? Math.max(0, (t - Date.now()) / 1000) : NaN; }
      const v = this._num(s); if (isNaN(v)) return NaN;
      const u = String(s.attributes.unit_of_measurement || 'min').toLowerCase();
      return v * (/^h/.test(u) ? 3600 : /^s/.test(u) ? 1 : 60);
    }
    _dur(sec) { if (isNaN(sec)) return ['--', '']; const m = Math.floor(sec / 60); return sec >= 3600 ? [`${Math.floor(sec / 3600)}:${String(m % 60).padStart(2, '0')}`, 'h'] : sec >= 60 ? [String(Math.ceil(sec / 60)), 'min'] : [String(Math.round(sec)), 's']; }
    _time(iso) {
      const t = Date.parse(iso); if (!t) return String(iso);
      const d = new Date(t), loc = this._lang(), time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
      return d.toDateString() === new Date().toDateString() ? time : `${d.toLocaleDateString(loc, { weekday: 'short' })} ${time}`;
    }
    _signal(id) {
      const s = this._st(id), v = this._num(s); if (isNaN(v)) return NaN;
      const u = String(this._unit(id, '')).toLowerCase();
      return /dbm/.test(u) || v < 0 ? Math.max(0, Math.min(100, 2 * (v + 100))) : v > 100 ? v / 2.55 : v;
    }

    _compute() {
      const c = this._c, m = this.constructor.META;
      const s = this._st(c.entity), has = !!c.entity, okE = this._ok(s);
      const state = okE ? String(s.state).toLowerCase() : '';
      const flow = this._flow(c.entity_flow);
      const thr = c.flow_threshold != null ? Number(c.flow_threshold) : 0.05;
      // ouvert : état de l'entité principale, sinon déduit du débit
      const open = has ? okE && OPEN_RE.test(state) : !isNaN(flow) && flow > thr;
      const moving = okE && /^(opening|closing)$/.test(state);
      const unavailable = has ? !okE : isNaN(flow);
      const posAttr = okE && s.attributes ? Number(s.attributes.current_position) : NaN;
      const posS = this._num(this._st(c.entity_position));
      const pos = !isNaN(posS) ? posS : isFinite(posAttr) && s.attributes.current_position != null ? posAttr : NaN;
      const frac = !isNaN(pos) ? Math.max(0, Math.min(1, pos / 100)) : open ? 1 : 0;
      const bats = list(c.entity_battery).map((i) => this._st(i)).filter((x) => this._ok(x));
      const binLow = bats.some((x) => /^binary_sensor\./.test(x.entity_id) && ON_RE.test(String(x.state)));
      const pcts = bats.map((x) => this._num(x)).filter((v) => !isNaN(v));
      const bat = pcts.length ? Math.min(...pcts) : NaN;
      const low = binLow || (!isNaN(bat) && bat < Number(c.battery_low));
      const tS = this._st(c.entity_temperature), tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const temp = tc ? tc.conv(this._num(tS), tS) : this._num(tS);
      const freeze = !isNaN(temp) && c.freeze_temp !== '' && c.freeze_temp != null && temp <= Number(c.freeze_temp);
      const leak = this._on(c.entity_leak), fault = this._on(c.entity_fault), rain = this._on(c.entity_rain);
      // alerte prioritaire : l'état ouvert / fermé reste visible dessous (eau qui coule, levier)
      const alert = unavailable ? 'unavailable' : leak ? 'leak' : fault ? 'fault' : freeze ? 'freeze' : low ? 'low_battery' : m.rain && rain && !open ? 'rain' : '';
      const sCls = unavailable ? '' : moving ? 'moving' : open ? 'open' : 'closed';
      return { s, open, moving, state, unavailable, flow, frac, pos, bat, low, binLow, temp, tc, freeze, leak, fault, rain, alert, sCls };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), m = this.constructor.META;
      root.innerHTML = `<style>${COMMON_CSS}${m.css}</style><ha-card>
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        <div class="stage">${m.svg(this._c.name || this._t('name'))}</div>
        <div class="alert" id="alert"></div>
        <div class="ctl" id="ctl">
          <button data-act="open" id="b-open"><ha-icon icon="mdi:water"></ha-icon><span></span></button>
          <button data-act="close" id="b-close"><ha-icon icon="mdi:water-off"></ha-icon><span></span></button>
          <span id="quick" style="display:contents"></span>
          <button data-act="sched" id="b-sched"><ha-icon icon="mdi:calendar-clock"></ha-icon><span></span></button>
          <span id="modes" style="display:contents"></span>
        </div>
        <div class="tiles">${m.tiles.map((k) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${TILE_ICONS[k]}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_flow));
      root.getElementById('ctl').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-act]'); if (!b || b.disabled) return;
        const a = b.dataset.act, v = b.dataset.v;
        if (a === 'open' || a === 'close') this._set(a === 'open');
        else if (a === 'quick') this._quick(Number(v));
        else if (a === 'mode') this._call(this._c.entity_mode, ['select', 'input_select'].includes(this._c.entity_mode.split('.')[0]) ? this._c.entity_mode.split('.')[0] : 'select', 'select_option', { option: v });
        else if (a === 'sched') {
          const id = this._c.entity_schedule, d = id.split('.')[0];
          this._call(id, ['button', 'input_button'].includes(d) ? d : ['switch', 'input_boolean'].includes(d) ? d : 'homeassistant', ['button', 'input_button'].includes(d) ? 'press' : 'toggle');
        }
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c;
        this._more({ flow: c.entity_flow || c.entity, volume: c.entity_volume, today: c.entity_today, total: c.entity_total, remaining: c.entity_remaining, next: c.entity_next, moisture: c.entity_moisture,
          position: c.entity_position || c.entity, pressure: c.entity_pressure, temperature: c.entity_temperature, power: c.entity_power, cost: c.entity_cost, battery: list(c.entity_battery)[0], signal: c.entity_signal, mode: c.entity_mode }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }
    _call(id, domain, service, data) { if (this._hass && id) return this._hass.callService(domain, service, { entity_id: id, ...(data || {}) }); }
    // ouvre / ferme l'entité principale selon son domaine
    _set(on) {
      const id = this._c.entity; if (!id) return;
      const d = id.split('.')[0];
      const [dom, svc] = { valve: ['valve', on ? 'open_valve' : 'close_valve'], cover: ['cover', on ? 'open_cover' : 'close_cover'],
        switch: ['switch', on ? 'turn_on' : 'turn_off'], input_boolean: ['input_boolean', on ? 'turn_on' : 'turn_off'], light: ['light', on ? 'turn_on' : 'turn_off'] }[d] || ['homeassistant', on ? 'turn_on' : 'turn_off'];
      return this._call(id, dom, svc);
    }
    // durée rapide : règle l'entité de durée (number, minutes / s / h selon son unité), puis ouvre
    _quick(min) {
      const id = this._c.entity_duration; if (!id) return;
      const u = String(this._unit(id, 'min')).toLowerCase(), d = id.split('.')[0];
      const value = /^h/.test(u) ? min / 60 : /^s/.test(u) ? min * 60 : min;
      Promise.resolve(this._call(id, d === 'input_number' ? 'input_number' : 'number', 'set_value', { value })).then(() => this._set(true));
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, m = this.constructor.META;
      const x = this._compute();
      card.className = `${x.sCls} ${x.alert}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`.trim();
      card.style.setProperty('--pos', String(x.frac));
      card.style.setProperty('--spd', String(isNaN(x.flow) ? 1 : Math.max(0.6, Math.min(3, 0.6 + x.flow / 10))));
      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge');
      badge.textContent = this._t(x.alert || (x.moving ? (x.state === 'opening' ? 'opening' : 'closing') : x.sCls === 'open' ? m.openKey : 'closed'));
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('alert');
      al.textContent = x.alert === 'leak' ? this._t('leak_alert') : x.alert === 'fault' ? this._t('fault_alert') : x.alert === 'freeze' ? this._t('freeze_alert') : x.alert === 'rain' ? this._t('rain_alert') : '';
      al.classList.toggle('on', !!al.textContent);

      // boutons : robinet = un seul bouton Ouvrir / Fermer ; vanne = les deux, l'actif est grisé
      const bo = r.getElementById('b-open'), bc = r.getElementById('b-close'), canCtl = !!c.entity && !x.unavailable;
      bo.querySelector('span').textContent = this._t(m.single ? 'open_tap' : 'open_valve'); bc.querySelector('span').textContent = this._t(m.single ? 'close_tap' : 'close_valve');
      bo.classList.toggle('hide', !c.entity || (m.single && x.open)); bc.classList.toggle('hide', !c.entity || (m.single && !x.open));
      bo.disabled = bc.disabled = !canCtl; if (!m.single && canCtl) { bo.disabled = x.sCls === 'open'; bc.disabled = x.sCls === 'closed'; }
      bc.classList.toggle('red', !!x.leak);
      const qt = list(c.quick_times).map(Number).filter((n) => n > 0);
      r.getElementById('quick').replaceChildren(...(c.entity_duration && c.entity ? qt : []).map((n) => {
        const b = document.createElement('button'); b.dataset.act = 'quick'; b.dataset.v = String(n); b.disabled = !canCtl;
        b.innerHTML = '<ha-icon icon="mdi:timer-outline"></ha-icon><span></span>'; b.querySelector('span').textContent = this._t('minutes').replace('{n}', n); return b;
      }));
      const sc = r.getElementById('b-sched'), sS = this._st(c.entity_schedule);
      sc.classList.toggle('hide', !c.entity_schedule); sc.querySelector('span').textContent = this._t('schedule');
      sc.classList.toggle('on', !!sS && /^(on|true|enabled)$/i.test(String(sS.state)));
      const mS = this._st(c.entity_mode), opts = c.entity_mode && mS && mS.attributes && Array.isArray(mS.attributes.options) ? mS.attributes.options : [];
      r.getElementById('modes').replaceChildren(...opts.map((o) => {
        const b = document.createElement('button'); b.dataset.act = 'mode'; b.dataset.v = o; b.classList.toggle('on', mS.state === o);
        b.textContent = (c.mode_labels && c.mode_labels[o]) || String(o).replace(/_/g, ' '); return b;
      }));
      r.getElementById('ctl').classList.toggle('hide', c.show_buttons === false || !r.querySelectorAll('#ctl button:not(.hide)').length);

      // tuiles
      const cur = c.currency || this._hass.config?.currency;
      const vol = this._fmtVol(this._liters(c.entity_volume)), tod = this._fmtVol(this._liters(c.entity_today)), tot = this._fmtVol(this._liters(c.entity_total));
      const rem = this._dur(this._secs(c.entity_remaining)), nxS = this._st(c.entity_next);
      const fl = x.flow, mo = this._num(this._st(c.entity_moisture)), pr = this._num(this._st(c.entity_pressure)), pw = window.applianceWatts ? window.applianceWatts(this._st(c.entity_power)) : NaN;
      const sig = this._signal(c.entity_signal), cost = this._num(this._st(c.entity_cost));
      const V = {
        flow: [c.entity_flow, this._fmt(fl, fl < 10 ? 1 : 0), 'L/min', ''],
        volume: [c.entity_volume, vol[0], vol[1], ''],
        today: [c.entity_today, tod[0], tod[1], ''],
        total: [c.entity_total, tot[0], tot[1], ''],
        remaining: [c.entity_remaining, rem[0], rem[1], ''],
        next: [c.entity_next, this._ok(nxS) ? this._time(nxS.state) : '--', '', ''],
        moisture: [c.entity_moisture, this._fmt(mo, 0), '%', !isNaN(mo) && mo < Number(c.moisture_low ?? 25) ? 'warn' : ''],
        position: [c.entity_position || !isNaN(x.pos), this._fmt(x.pos, 0), '%', ''],
        pressure: [c.entity_pressure, this._fmt(pr, 1), this._unit(c.entity_pressure, 'bar'), ''],
        temperature: [c.entity_temperature, this._fmt(x.temp, 1), x.tc ? x.tc.unit : '°C', x.freeze ? 'cold' : ''],
        power: [c.entity_power, this._fmt(pw, 1), 'W', ''],
        cost: [c.entity_cost, this._fmt(cost, 2), cur || this._unit(c.entity_cost, '€'), ''],
        battery: [list(c.entity_battery).length, isNaN(x.bat) ? (x.binLow ? this._t('low') : '--') : String(Math.round(x.bat)), isNaN(x.bat) ? '' : '%', x.low ? 'warn' : ''],
        signal: [c.entity_signal, this._fmt(sig, 0), '%', ''],
        mode: [c.entity_mode, mS && this._ok(mS) ? String(mS.state).replace(/_/g, ' ') : '--', '', ''],
      };
      m.tiles.forEach((k) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c['show_' + k] === false);
        ['bad', 'warn', 'cold'].forEach((q) => el.classList.toggle(q, cls === q));
        el.querySelector('.lbl').textContent = this._l(k === 'remaining' ? m.remKey : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---------- éditeur visuel ---------- */
  class Editor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      const m = this.constructor.META;
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      const ent = (name, domain, multiple) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(multiple ? { multiple: true } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const data = { ...this._c };
      ['entity_battery', 'entity_leak', 'entity_fault', 'entity_rain'].forEach((k) => { if (data[k] != null && !Array.isArray(data[k])) data[k] = list(data[k]); });
      this._form.hass = this._hass; this._form.data = data;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity', ['valve', 'switch', 'input_boolean', 'cover', 'light']),
        ent('entity_flow', 'sensor'), ent('entity_volume', 'sensor'), ent('entity_today', 'sensor'), ent('entity_total', 'sensor'),
        ent('entity_remaining', ['sensor', 'number', 'input_number']),
        ent('entity_duration', ['number', 'input_number']),
        { name: 'quick_times', selector: { object: {} } },
        ent('entity_schedule', ['switch', 'input_boolean', 'binary_sensor', 'button']),
        ent('entity_next', 'sensor'),
        ent('entity_mode', ['select', 'input_select']),
        ...(m.single ? [ent('entity_rain', ['binary_sensor', 'sensor'], true), ent('entity_moisture', 'sensor'), { name: 'moisture_low', default: 25, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }]
          : [ent('entity_position', ['sensor', 'number', 'input_number'])]),
        ent('entity_leak', ['binary_sensor', 'sensor', 'input_boolean'], true),
        ent('entity_fault', ['binary_sensor', 'sensor'], true),
        ent('entity_battery', ['sensor', 'binary_sensor'], true),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_signal', 'sensor'), ent('entity_temperature', 'sensor'),
        { name: 'freeze_temp', default: 3, selector: { number: { min: -30, max: 40, step: 0.5, mode: 'box' } } },
        window.applianceTempField,
        ent('entity_pressure', 'sensor'), ent('entity_power', 'sensor'), ent('entity_cost', ['sensor', 'input_number']),
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(m.T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_buttons'), ...m.tiles.map((k) => bool('show_' + k)), bool('animations')] },
      ].filter(Boolean);
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  const TAP_META = { tag: TAGS[0], T: TT, css: TAP_CSS, svg: TAP_SVG, single: true, rain: true, openKey: 'watering', remKey: 'remaining', quick: [5, 15, 30], guess: /(robinet|tap|arros|irrig|sprinkl|garden|jardin|swv|hose)/i,
    tiles: ['flow', 'volume', 'remaining', 'today', 'total', 'next', 'moisture', 'mode', 'battery', 'signal', 'temperature', 'pressure', 'cost'] };
  const VALVE_META = { tag: TAGS[1], T: TV, css: VALVE_CSS, svg: VALVE_SVG, single: false, rain: false, openKey: 'open', remKey: 'closes_in', quick: [15, 30, 60], guess: /(vanne|valve|water_main|main_water|eau)/i,
    tiles: ['position', 'flow', 'volume', 'remaining', 'today', 'total', 'next', 'mode', 'pressure', 'temperature', 'power', 'battery', 'signal', 'cost'] };

  [[TAP_META, TT, 'mdi:water-pump'], [VALVE_META, TV, 'mdi:valve']].forEach(([meta, T]) => {
    const Card = class extends Base {}; Card.META = meta;
    const Ed = class extends Editor {}; Ed.META = meta;
    customElements.define(meta.tag, Card); customElements.define(meta.tag + '-editor', Ed);
    window.customCards = window.customCards || [];
    window.customCards.push({
      type: meta.tag, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
      description: meta === TAP_META ? 'Robinet connecté animé : anneau lumineux, eau qui coule, durées rapides, programmation, pluie, batterie.'
        : 'Vanne motorisée animée : levier qui tourne, eau dans le tuyau, position, fuite, gel, minuterie.', preview: true,
      documentationURL: `https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/${meta === TAP_META ? 'smart-tap' : 'water-valve'}.md`,
    });
  });
})();
