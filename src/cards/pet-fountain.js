/* Carte « Fontaine à eau pour animaux » — custom:appliance-pet-fountain-card
 * Fontaine connectée (Petlibro Dockstream, Catit, Xiaomi, Petkit…) : socle bois, corps blanc, bac en inox, cascade au centre.
 * Animations : la nappe d'eau coule en continu et des ondes s'étendent dans le bac ; une bulle monte dans la fenêtre de niveau ;
 * quand un animal boit (entity_drinking), un chat penche la tête vers le bac et des gouttes sautent ; niveau d'eau bas ou vide :
 * la fenêtre clignote en rouge et la pompe s'arrête ; filtre à changer / nettoyage à faire : pictogrammes qui clignotent ;
 * lumière : les voyants du socle s'allument.
 * Tout est facultatif : entity (interrupteur / pompe), niveau d'eau (en % ou avec capacity), alerte eau basse, filtre (jours restants, %
 * ou capteur binaire), consommation du jour, dernière gorgée, nettoyage, puissance, batterie. Boutons : marche / arrêt, lumière,
 * modes de la fontaine (select), remise à zéro du filtre et du nettoyage (2e clic de confirmation).
 */
(() => {
  const TAG = 'appliance-pet-fountain-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n pet_fountain*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
  const MODE_KEYS = ['continuous', 'intermittent', 'sensor', 'smart', 'normal', 'flowing', 'night', 'eco'];

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--pf-ok:var(--appliance-ok-color,#43a047);--pf-alert:var(--appliance-alert-color,#db4437);
  --pf-warn:var(--appliance-warn-color,#ffa000);--pf-cold:var(--appliance-cold-color,#2b9af9);--pf-c:#9aa3ad;--lvl:.7}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.flowing{--pf-c:var(--pf-cold)}ha-card.drinking{--pf-c:var(--pf-ok)}ha-card.low{--pf-c:var(--pf-warn)}ha-card.empty{--pf-c:var(--pf-alert)}
.flowing .badge,.drinking .badge,.low .badge,.empty .badge{background:color-mix(in srgb,var(--pf-c) 22%,transparent);color:var(--pf-c)}
ha-card.empty{box-shadow:0 0 0 1px color-mix(in srgb,var(--pf-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--pf-alert) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--pf-alert);font-weight:500;text-align:center}
.alert.on{display:block}.alert.warn{color:var(--pf-warn)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 74px;max-width:130px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;min-width:0;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ctl button ha-icon{--mdc-icon-size:16px;flex:none}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--pf-cold) 28%,var(--secondary-background-color))}
.ctl button.confirm{background:color-mix(in srgb,var(--pf-warn) 35%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--pf-alert)}.tile.warn .v{color:var(--pf-warn)}
/* ---- illustration ---- */
.pf-aura{opacity:.45;transition:opacity .6s}.off .pf-aura,.unavailable .pf-aura{opacity:0}
.pf-auras{stop-color:var(--pf-c);transition:stop-color .4s}
/* niveau d'eau : la hauteur de l'eau suit --lvl (0 à 1) */
.pf-lvl{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--lvl));transition:transform 1s ease}
.pf-wave{transform:translateY(calc((1 - var(--lvl)) * 32px));transition:transform 1s ease}
.low .pf-win,.empty .pf-win{animation:pfblink 1.2s infinite}.empty .pf-win{stroke:var(--pf-alert)}.low .pf-win{stroke:var(--pf-warn)}
.pf-win{stroke:#b9c0c7;stroke-width:1.6}
/* cascade : filets d'eau qui descendent, ondes dans le bac */
.pf-flow{opacity:0;fill:none;stroke:#8fd0f5;stroke-width:3;stroke-linecap:round;stroke-dasharray:6 7}
.flowing .pf-flow,.drinking .pf-flow{opacity:.95;animation:pfflow .7s linear infinite}.pf-flow.f2{animation-duration:.55s!important;stroke-width:2.2}.pf-flow.f3{animation-duration:.85s!important}
.pf-sheet{opacity:0;fill:#aee0fa;transition:opacity .5s}.flowing .pf-sheet,.drinking .pf-sheet{opacity:.85}
.pf-rip{fill:none;stroke:#fff;stroke-width:1.4;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.flowing .pf-rip,.drinking .pf-rip{animation:pfrip 2.2s ease-out infinite}.pf-rip.r2{animation-delay:.7s!important}.pf-rip.r3{animation-delay:1.4s!important}
.pf-surf{fill:#8fd0f5;transition:fill .6s}.off .pf-surf,.empty .pf-surf{fill:#cdd5db}
/* bulles dans la fenêtre de niveau */
.pf-bub{fill:#fff;opacity:0}.flowing .pf-bub,.drinking .pf-bub{animation:pfbub 3s ease-in infinite}.pf-bub.b2{animation-delay:1.1s!important}.pf-bub.b3{animation-delay:2s!important}
/* chat qui boit : la tête descend vers le bac, gouttes qui sautent */
.pf-cat{opacity:0;transition:opacity .5s}.drinking .pf-cat{opacity:1}
.pf-head{transform-box:view-box;transform-origin:24px 96px}.drinking .pf-head{animation:pfdrink 1.5s ease-in-out infinite}
.pf-drop{fill:#8fd0f5;opacity:0}.drinking .pf-drop{animation:pfdrop 1.5s ease-out infinite}.pf-drop.d2{animation-delay:.25s!important}.pf-drop.d3{animation-delay:.5s!important}
/* voyants du socle : lumière allumée */
.pf-led{fill:#c9ced3;transition:fill .4s}.lighton .pf-led{fill:#7fd4ff;filter:drop-shadow(0 0 3px #7fd4ff)}.lighton.flowing .pf-led,.lighton.drinking .pf-led{animation:pfglow 2.4s ease-in-out infinite}
.pf-glow{opacity:0;transition:opacity .6s}.lighton .pf-glow{opacity:.5}
/* alertes : eau basse, filtre, nettoyage */
.pf-wl,.pf-wf,.pf-wc{opacity:0}.low .pf-wl,.empty .pf-wl{opacity:1;animation:pfblink 1.1s infinite}.filterdue .pf-wf{opacity:1;animation:pfblink 1.6s infinite}.cleandue .pf-wc{opacity:1;animation:pfblink 1.9s infinite}
.pf-bat{opacity:0}.lowbat .pf-bat{opacity:1;animation:pfblink 1.6s infinite}
.off svg .pf-body,.unavailable svg .pf-body{filter:saturate(.3)}.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes pfflow{to{stroke-dashoffset:-13}}
@keyframes pfrip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(2.6,1.9)}}
@keyframes pfbub{0%{opacity:0;transform:translateY(0)}15%{opacity:.8}100%{opacity:0;transform:translateY(-26px)}}
@keyframes pfdrink{0%,100%{transform:rotate(0)}45%{transform:rotate(9deg) translate(2px,2px)}}
@keyframes pfdrop{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(7px,-14px)}}
@keyframes pfglow{50%{opacity:.55}}
@keyframes pfblink{50%{opacity:.2}}
`;

  const DEFS = `<radialGradient id="pfaurag"><stop offset="0" class="pf-auras" stop-opacity=".5"/><stop offset=".6" class="pf-auras" stop-opacity=".12"/><stop offset="1" class="pf-auras" stop-opacity="0"/></radialGradient>
    <linearGradient id="pfbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3e6ea"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dde2"/></linearGradient>
    <linearGradient id="pfwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2bd8c"/><stop offset="1" stop-color="#c9975f"/></linearGradient>
    <linearGradient id="pfsteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0f2"/><stop offset=".5" stop-color="#b4bac1"/><stop offset="1" stop-color="#8e959c"/></linearGradient>
    <linearGradient id="pfwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f5"/><stop offset="1" stop-color="#4aa9e0"/></linearGradient>
    <radialGradient id="pfglowg"><stop offset="0" stop-color="#7fd4ff" stop-opacity=".7"/><stop offset="1" stop-color="#7fd4ff" stop-opacity="0"/></radialGradient>
    <clipPath id="pfwinc"><rect x="62" y="98" width="26" height="36" rx="6"/></clipPath>
    <clipPath id="pftray"><ellipse cx="120" cy="86" rx="62" ry="10"/></clipPath>`;

  const SVG = (label) => `<svg viewBox="0 0 240 180" role="img" aria-label="${esc(label)}"><defs>${DEFS}</defs>
      <ellipse class="pf-aura" cx="120" cy="96" rx="112" ry="78" fill="url(#pfaurag)"/>
      <ellipse class="pf-glow" cx="120" cy="158" rx="84" ry="14" fill="url(#pfglowg)"/>
      <ellipse cx="120" cy="165" rx="82" ry="6" fill="#000" fill-opacity=".16"/>
      <g class="pf-body">
        <!-- socle blanc, bandeau bois, corps blanc -->
        <rect x="52" y="152" width="136" height="12" rx="6" fill="#f4f5f7" stroke="#d5d9de"/>
        <rect x="46" y="140" width="148" height="14" rx="7" fill="url(#pfwood)"/>
        <path d="M50 92 H190 V132 Q190 142 178 142 H62 Q50 142 50 132Z" fill="url(#pfbody)" stroke="#d0d5da" stroke-width="1.2"/>
        <!-- bac en inox, eau -->
        <ellipse cx="120" cy="88" rx="72" ry="14" fill="url(#pfsteel)"/>
        <ellipse cx="120" cy="87" rx="65" ry="11" fill="#7d858c"/>
        <ellipse class="pf-surf" cx="120" cy="86" rx="62" ry="10"/>
        <g clip-path="url(#pftray)">${['', ' r2', ' r3'].map((r) => `<ellipse class="pf-rip${r}" cx="120" cy="88" rx="16" ry="3.6"/>`).join('')}</g>
        <!-- cascade au centre : rampe blanche, nappe et filets d'eau -->
        <path d="M96 76 Q96 56 112 54 H132 Q146 54 146 70 V82 H96Z" fill="#fdfdfe" stroke="#d5d9de"/>
        <path d="M104 62 Q104 58 112 58 H126" fill="none" stroke="#e6e9ed" stroke-width="3" stroke-linecap="round"/>
        <path class="pf-sheet" d="M100 78 H142 L140 87 H102Z"/>
        <path class="pf-flow" d="M108 79 V88"/><path class="pf-flow f2" d="M121 79 V88"/><path class="pf-flow f3" d="M134 79 V88"/>
        <!-- fenêtre de niveau d'eau -->
        <rect class="pf-win" x="62" y="98" width="26" height="36" rx="6" fill="#eef3f6"/>
        <g clip-path="url(#pfwinc)"><rect class="pf-lvl" x="62" y="98" width="26" height="36" fill="url(#pfwater)"/>
          <g class="pf-wave"><path d="M62 98 q3.25 -3 6.5 0 t6.5 0 t6.5 0 t6.5 0 V106 H62Z" fill="#8fd0f5" opacity=".8"/></g>
          <circle class="pf-bub" cx="70" cy="130" r="1.8"/><circle class="pf-bub b2" cx="78" cy="132" r="1.4"/><circle class="pf-bub b3" cx="83" cy="130" r="1.6"/></g>
        <!-- voyants du socle -->
        <g>${[112, 124, 136, 148, 160].map((x) => `<circle class="pf-led" cx="${x + 4}" cy="147" r="1.9"/>`).join('')}</g>
        <path d="M100 118 h60" stroke="#e1e5e9" stroke-width="2" stroke-linecap="round"/><path d="M108 126 h44" stroke="#e1e5e9" stroke-width="2" stroke-linecap="round"/>
      </g>
      <!-- chat qui boit -->
      <g class="pf-cat">
        <path d="M2 160 Q-2 112 22 92 L36 100 Q26 126 30 160Z" fill="#33363d"/>
        <g class="pf-head"><g transform="translate(32 80) rotate(28)">
          <path d="M-13 -4 L-11 -20 L-3 -11 Q2 -13 7 -11 L15 -20 L17 -4 Q19 9 2 14 Q-15 9 -13 -4Z" fill="#33363d"/>
          <ellipse cx="-4" cy="-2" rx="1.6" ry="2.2" fill="#ffd54f"/><ellipse cx="8" cy="-2" rx="1.6" ry="2.2" fill="#ffd54f"/></g>
          <ellipse cx="50" cy="86" rx="3.2" ry="1.8" fill="#f4a3b0"/></g>
        <circle class="pf-drop" cx="56" cy="84" r="1.8"/><circle class="pf-drop d2" cx="62" cy="82" r="1.4"/><circle class="pf-drop d3" cx="52" cy="85" r="1.6"/></g>
      <!-- alertes -->
      <g class="pf-wl"><path d="M212 18 q-12 16 -12 24 a12 12 0 0 0 24 0 q0 -8 -12 -24Z" fill="#db4437"/><path d="M212 28 V38" stroke="#fff" stroke-width="2.4"/><circle cx="212" cy="43" r="1.5" fill="#fff"/></g>
      <g class="pf-wf"><rect x="16" y="20" width="26" height="22" rx="4" fill="none" stroke="#ffa000" stroke-width="2.2"/><path d="M21 26 h16 M21 31 h16 M21 36 h16" stroke="#ffa000" stroke-width="1.8" stroke-linecap="round"/></g>
      <g class="pf-wc"><path d="M30 56 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z" fill="#ffa000"/><path d="M44 54 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5Z" fill="#ffa000"/></g>
      <g class="pf-bat"><rect x="192" y="152" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="214" y="155" width="3" height="6" fill="#ffa000"/><path d="M195 155 h4 v6 h-4z" fill="#ffa000"/></g>
    </svg>`;

  const TILES = [['level', 'mdi:water-percent', 'show_level'], ['filter', 'mdi:air-filter', 'show_filter'], ['today', 'mdi:cup-water', 'show_today'], ['drink', 'mdi:cat', 'show_drink'],
    ['clean', 'mdi:broom', 'show_clean'], ['power', 'mdi:flash', 'show_power'], ['battery', 'mdi:battery', 'show_battery']];

  class AppliancePetFountainCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    // détection automatique : préfixe commun des entités de la fontaine (Petlibro, Petkit, Xiaomi / Mijia, Catit, Tuya…),
    // puis chaque entité par son nom (niveau, filtre, eau du jour, lumière, mode, boutons de remise à zéro…)
    static getStubConfig(hass) {
      const st = (hass && hass.states) || {}, ids = Object.keys(st), at = (i) => st[i].attributes || {};
      const KEY = /fontaine|fountain|petlibro|dockstream|eversweet|petkit|catit|drinking_?(fountain|station)|water_?dispenser|trinkbrunnen|fontanella|drinkfontein|drikkefontene/i;
      const ref = ids.find((i) => /^(sensor|switch)\./.test(i) && KEY.test(i)) || ids.find((i) => KEY.test(i)) || '';
      // préfixe = nom jusqu'au dernier mot-clé (petlibro_dockstream_water_level → petlibro_dockstream)
      const o = ref.split('.')[1] || '', ms = [...o.matchAll(new RegExp(KEY.source, 'gi'))], m = ms[ms.length - 1], pre = m ? o.slice(0, m.index + m[0].length) : '\u0000';
      const mine = (d) => ids.filter((i) => i.startsWith(d + '.') && i.split('.')[1].startsWith(pre));
      const near = (doms, re, not) => doms.flatMap(mine).find((i) => re.test(i.split('.')[1].slice(pre.length)) && !(not && not.test(i))) || '';
      const dc = (d, cls) => mine(d).find((i) => at(i).device_class === cls) || '';
      const pick = (k, v) => (v ? { [k]: v } : {});
      return {
        entity: near(['switch'], /^$|pump|power|switch|on_?off|enable/, /light|led|lamp|indicator|display|child|lock|sound|buzzer/i),
        entity_water_level: near(['sensor'], /water_?level|niveau|level|remaining_?water|water_?volume/, /filter/i),
        ...pick('entity_low_water', near(['binary_sensor'], /low_?water|water_?(shortage|lack)|lack_?water|no_?water|eau_?basse|empty/)),
        entity_filter: near(['sensor', 'binary_sensor'], /filter|filtre/, /reset/i),
        ...pick('entity_water_today', near(['sensor'], /today|daily|consumption|drink.*amount|amount|purified|drunk|bue/, /time|count|last/i)),
        ...pick('entity_drinking', near(['binary_sensor'], /drink|pet_?(present|detected)|motion|occupancy|presence/)),
        ...pick('entity_last_drink', near(['sensor'], /last_?drink|last_?(use|visit)|derni/)),
        ...pick('entity_clean', near(['binary_sensor', 'sensor'], /clean|wash|nettoy|machine_?cleaning/, /reset/i)),
        ...pick('entity_light', near(['light', 'switch'], /light|led|lamp|indicator|lumi/)),
        ...pick('entity_mode', near(['select'], /mode|modus|flow/)),
        ...pick('entity_filter_reset', near(['button'], /filter|filtre/)),
        ...pick('entity_clean_reset', near(['button'], /clean|wash|nettoy/)),
        ...pick('entity_power', dc('sensor', 'power')),
        ...pick('entity_battery', dc('sensor', 'battery')),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { level_low: 20, battery_low: 20, filter_low_days: 7, filter_low: 10, show_status: true, show_buttons: true, show_level: true, show_filter: true, show_today: true, show_drink: true, show_clean: true, show_power: true, show_battery: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k, v) { let s = T[this._lang()][k] ?? T.en[k] ?? k; if (v) for (const [a, b] of Object.entries(v)) s = s.replace(`{${a}}`, b); return s; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(s) { return this._ok(s) && /^(on|true|open|opened|1|yes|low|detected|drinking|problem)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(s) { return String((s && s.attributes && s.attributes.unit_of_measurement) || ''); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const raw = s && this._ok(s) ? (/^\d{4}-\d\d-\d\d/.test(s.state) ? s.state : s.last_changed) : null, t = raw && Date.parse(raw);
      if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }
    // bouton : entité button / script ; interrupteur : toggle du domaine
    _press(id) {
      if (!this._hass || !id) return;
      const [dom, svc] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'] }[id.split('.')[0]] || ['homeassistant', 'turn_on'];
      this._hass.callService(dom, svc, { entity_id: id });
    }
    _toggle(id) { if (this._hass && id) this._hass.callService('homeassistant', 'toggle', { entity_id: id }); }

    _compute() {
      const c = this._c, pS = this._st(c.entity), lS = this._st(c.entity_water_level);
      const wS = this._st(c.entity_power), w = this._num(wS);
      // niveau d'eau : % (ou volume / capacity), sinon texte (low / ok / empty)
      let level = this._num(lS);
      if (!isNaN(level) && Number(c.capacity) > 0 && this._unit(lS) !== '%') level = level / Number(c.capacity) * 100;
      if (isNaN(level) && this._ok(lS)) { const s = String(lS.state).toLowerCase(); level = /empty|vide|leer|none|0/.test(s) ? 0 : /low|bas|niedrig/.test(s) ? c.level_low / 2 : 70; }
      const lowFlag = this._on(this._st(c.entity_low_water));
      const empty = !isNaN(level) && level <= 3;
      const low = lowFlag || empty || (!isNaN(level) && level < Number(c.level_low));
      const drinking = this._on(this._st(c.entity_drinking));
      // marche : interrupteur / pompe, sinon puissance mesurée, sinon allumée
      const dead = (c.entity && !pS) || (pS && /^unavailable$/i.test(String(pS.state)));
      const off = !dead && (pS && this._ok(pS) ? /^(off|false|0|standby|idle|closed)$/i.test(String(pS.state)) : !isNaN(w) && !c.entity ? w < Number(c.power_on ?? 0.5) : false);
      const state = dead ? 'unavailable' : off ? 'off' : empty ? 'empty' : drinking ? 'drinking' : low ? 'low' : 'flowing';
      // filtre : jours restants, % restant ou capteur binaire « à changer »
      const fS = this._st(c.entity_filter), fv = this._num(fS), fu = this._unit(fS).toLowerCase();
      const fBinary = !!fS && /^binary_sensor\./.test(c.entity_filter);
      const filterDue = fBinary ? this._on(fS) : !isNaN(fv) && (fu === '%' ? fv < Number(c.filter_low) : /^(d|j|day|days|jour|jours|tag|tage)/.test(fu) ? fv < Number(c.filter_low_days) : /^h/.test(fu) ? fv < Number(c.filter_low_days) * 24 : fv <= 0);
      const cS = this._st(c.entity_clean), cleanDue = !!cS && /^binary_sensor\./.test(c.entity_clean) && this._on(cS);
      const bS = this._st(c.entity_battery), bat = this._num(bS), batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const lowbat = (batBinary && this._on(bS)) || (!isNaN(bat) && bat < Number(c.battery_low));
      const light = this._on(this._st(c.entity_light));
      return { pS, lS, wS, w, level, low, empty, drinking, state, fS, fv, fu, fBinary, filterDue, cS, cleanDue, bS, bat, batBinary, lowbat, light };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="pftitle"></div><div class="badge" id="pfbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="pfalert"></div>
        <div class="ctl" id="pfctl"></div>
        <div class="ctl" id="pfmodes"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_water_level));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ level: c.entity_water_level || c.entity_low_water, filter: c.entity_filter, today: c.entity_water_today, drink: c.entity_last_drink || c.entity_drinking,
          clean: c.entity_clean, power: c.entity_power, battery: c.entity_battery }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // 2e clic dans les 4 s pour les remises à zéro (filtre, nettoyage)
    _action(a) {
      const c = this._c;
      if (a === 'power') return this._toggle(c.entity);
      if (a === 'light') return this._toggle(c.entity_light);
      const id = a === 'filter_reset' ? c.entity_filter_reset : c.entity_clean_reset;
      if (this._confirmId !== a || Date.now() > this._confirmUntil) {
        this._confirmId = a; this._confirmUntil = Date.now() + 4000;
        clearTimeout(this._confirmTimer); this._confirmTimer = setTimeout(() => { this._confirmId = null; this._render(); }, 4000);
        this._render(); return;
      }
      this._confirmId = null; clearTimeout(this._confirmTimer);
      this._press(id); this._render();
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { pS, level, low, empty, state, fS, fv, fu, fBinary, filterDue, cS, cleanDue, wS, w, bS, bat, batBinary, lowbat, light } = this._compute();
      card.className = `${state}${light ? ' lighton' : ''}${filterDue ? ' filterdue' : ''}${cleanDue ? ' cleandue' : ''}${lowbat ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      card.style.setProperty('--lvl', String(isNaN(level) ? 0.7 : Math.max(0, Math.min(1, level / 100)).toFixed(3)));
      r.getElementById('pftitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('pfbadge');
      badge.textContent = this._t(`state_${state}`);
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('pfalert');
      const msgs = [empty ? this._t('alert_empty') : low ? this._t('alert_low') : '', filterDue ? this._t('alert_filter') : '', cleanDue ? this._t('alert_clean') : '', lowbat ? this._t('battery_low') : ''].filter(Boolean);
      al.textContent = msgs.join(' · ');
      al.classList.toggle('on', !!msgs.length); al.classList.toggle('warn', !empty);

      // boutons : marche / arrêt, lumière, remises à zéro
      const BTN = [['power', 'mdi:power', c.entity, state === 'unavailable'], ['light', 'mdi:lightbulb', c.entity_light, false],
        ['filter_reset', 'mdi:air-filter', c.entity_filter_reset, false], ['clean_reset', 'mdi:broom', c.entity_clean_reset, false]].filter((b) => b[2]);
      const ctl = r.getElementById('pfctl'), sig = BTN.map((b) => b[0]).join('|');
      if (this._sig !== sig) {
        this._sig = sig;
        ctl.replaceChildren(...BTN.map(([a, ic]) => {
          const b = document.createElement('button'); b.dataset.a = a;
          const i = document.createElement('ha-icon'); i.setAttribute('icon', ic); b.append(i, document.createElement('span'));
          b.addEventListener('click', () => this._action(a)); return b;
        }));
      }
      ctl.classList.toggle('hide', c.show_buttons === false || !BTN.length);
      const confirming = (a) => this._confirmId === a && Date.now() < this._confirmUntil;
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = confirming(a) ? this._t('btn_confirm') : a === 'power' ? this._t(state === 'off' ? 'btn_turn_on' : 'btn_turn_off') : this._t(`btn_${a}`);
        b.classList.toggle('on', (a === 'power' && state !== 'off' && state !== 'unavailable') || (a === 'light' && light));
        b.classList.toggle('confirm', confirming(a));
        b.disabled = state === 'unavailable' && a !== 'power';
      });
      // modes de la fontaine : une pastille par option du select
      const mS = this._st(c.entity_mode), opts = mS && Array.isArray(mS.attributes.options) ? mS.attributes.options : [];
      const mbox = r.getElementById('pfmodes'), msig = opts.join('|');
      if (this._msig !== msig) {
        this._msig = msig;
        const human = (o) => { const t = String(o).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
        mbox.replaceChildren(...opts.map((o) => {
          const b = document.createElement('button'); b.dataset.o = o;
          const key = String(o).toLowerCase().replace(/[\s-]+/g, '_');
          const i = document.createElement('ha-icon'); i.setAttribute('icon', 'mdi:water-sync');
          const sp = document.createElement('span'); sp.textContent = MODE_KEYS.includes(key) ? this._t(`mode_${key}`) : human(o);
          b.append(i, sp);
          b.addEventListener('click', () => this._hass.callService(c.entity_mode.split('.')[0], 'select_option', { entity_id: c.entity_mode, option: o }));
          return b;
        }));
      }
      mbox.classList.toggle('hide', c.show_buttons === false || !opts.length);
      mbox.querySelectorAll('button').forEach((b) => { const cur = !!mS && mS.state === b.dataset.o; b.classList.toggle('on', cur); b.disabled = cur || state === 'unavailable'; });

      // tuiles
      const num = (v, d = 0) => (isNaN(v) ? '--' : v.toLocaleString(this._lang(), { maximumFractionDigits: d }));
      const tS = this._st(c.entity_water_today), tv = this._num(tS), dS = this._st(c.entity_last_drink);
      const dState = dS && this._ok(dS) && !/^\d{4}-\d\d-\d\d/.test(dS.state) && isNaN(this._num(dS)) && !/^(on|off)$/i.test(dS.state) ? dS.state : null;
      const clv = this._num(cS);
      const V = {
        level: [c.entity_water_level || c.entity_low_water, !isNaN(level) ? num(level) : this._t(low ? 'low' : 'ok'), !isNaN(level) ? '%' : '', empty ? 'bad' : low ? 'warn' : ''],
        filter: [c.entity_filter, fBinary ? this._t(filterDue ? 'to_change' : 'ok') : num(fv, fu === '%' ? 0 : 1), fBinary ? '' : this._unit(fS) === 'd' ? this._t('days') : this._unit(fS), filterDue ? 'warn' : ''],
        today: [c.entity_water_today, num(tv, Math.abs(tv) < 10 ? 1 : 0), this._unit(tS), ''],
        drink: [c.entity_last_drink || c.entity_drinking, dState || this._since(dS || this._st(c.entity_drinking)), '', ''],
        clean: [c.entity_clean, /^binary_sensor\./.test(c.entity_clean || '') ? this._t(cleanDue ? 'to_clean' : 'ok') : num(clv, 0), /^binary_sensor\./.test(c.entity_clean || '') ? '' : this._unit(cS), cleanDue ? 'warn' : ''],
        power: [c.entity_power, num(w, w < 10 ? 1 : 0), this._unit(wS) || 'W', ''],
        battery: [c.entity_battery, !isNaN(bat) && !batBinary ? num(bat) : this._ok(bS) ? this._t(lowbat ? 'low' : 'ok') : '--', !isNaN(bat) && !batBinary ? '%' : '', lowbat ? 'warn' : ''],
      };
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', lowbat ? 'mdi:battery-alert' : 'mdi:battery');
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', cls === 'bad'); el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, AppliancePetFountainCard);

  /* ---- éditeur visuel ---- */
  class AppliancePetFountainCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const num = (name, def, max, unit) => ({ name, default: def, selector: { number: { min: 0, max, step: 1, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['switch', 'input_boolean', 'binary_sensor', 'sensor']),
        ent('entity_water_level', ['sensor', 'input_number']),
        ent('entity_low_water', 'binary_sensor'),
        ent('entity_filter', ['sensor', 'binary_sensor']),
        ent('entity_water_today', 'sensor'),
        ent('entity_drinking', 'binary_sensor'),
        ent('entity_last_drink', ['sensor', 'binary_sensor']),
        ent('entity_clean', ['sensor', 'binary_sensor']),
        ent('entity_light', ['switch', 'light', 'input_boolean']),
        ent('entity_mode', ['select', 'input_select']),
        ent('entity_filter_reset', ['button', 'input_button', 'script']),
        ent('entity_clean_reset', ['button', 'input_button', 'script']),
        ent('entity_power', 'sensor'),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        num('capacity', 0, 10000),
        num('level_low', 20, 100, '%'),
        num('filter_low_days', 7, 365),
        num('filter_low', 10, 100, '%'),
        num('battery_low', 20, 100, '%'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_buttons'), bool('show_level'), bool('show_filter'), bool('show_today'), bool('show_drink'), bool('show_clean'), bool('show_power'), bool('show_battery'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', AppliancePetFountainCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Fontaine à eau connectée animée pour chats et chiens (Petlibro…) : niveau d\'eau, filtre, consommation, lumière, modes, nettoyage.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/pet-fountain.md',
  });
})();
