/* Carte « Serrure connectée » — custom:appliance-smart-lock-card
 * Serrure motorisée posée sur le cylindre, côté intérieur de la porte. Deux modèles (option model) :
 * nuki_3_pro ou nuki_pro_5 (5e génération), photos détourées, sur un halo de la couleur de l'état.
 * Entité lock : verrouillée / déverrouillée / ouverte (pêne tiré) / en cours / bloquée. Les reflets du bouton tournent,
 * l'anneau LED prend la couleur de l'état, des ondes partent du bouton à l'ouverture, l'anse du cadenas se lève ;
 * blocage : la serrure tremble.
 * Boutons Verrouiller / Déverrouiller / Ouvrir (2e clic de confirmation) et, facultatifs, boutons Lock 'n' Go.
 * Tuiles : batterie (%, en charge, critique), capteur de porte, dernier changement.
 */
(() => {
  const TAG = 'appliance-smart-lock-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n smart_lock*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--sl-ok:var(--appliance-ok-color,#43a047);--sl-alert:var(--appliance-alert-color,#db4437);
  --sl-warn:var(--appliance-warn-color,#ffa000);--sl-cold:var(--appliance-cold-color,#2b9af9);--sl-c:#9aa3ad}
/* repère couleur (option color) : barre sur le bord gauche + point devant le titre, pour distinguer plusieurs serrures */
.idbar{display:none;position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--sl-id)}
.iddot{display:none;flex:none;width:9px;height:9px;border-radius:50%;background:var(--sl-id);margin-right:6px}
ha-card.hasid .idbar{display:block}ha-card.hasid .iddot{display:inline-block}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.locked{--sl-c:var(--sl-ok)}
ha-card.unlocked{--sl-c:var(--sl-warn)}
ha-card.open,ha-card.opening{--sl-c:var(--sl-cold)}
ha-card.locking{--sl-c:var(--sl-ok)}
ha-card.unlocking{--sl-c:var(--sl-warn)}
ha-card.jammed{--sl-c:var(--sl-alert)}
.locked .badge,.unlocked .badge,.open .badge,.opening .badge,.locking .badge,.unlocking .badge,.jammed .badge{background:color-mix(in srgb,var(--sl-c) 22%,transparent);color:var(--sl-c)}
ha-card.jammed{box-shadow:0 0 0 1px color-mix(in srgb,var(--sl-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--sl-alert) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--sl-alert);font-weight:500;text-align:center}
.alert.on{display:block}.alert.warn{color:var(--sl-warn)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 74px;max-width:130px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--sl-c) 28%,var(--secondary-background-color))}
.ctl button.confirm{background:color-mix(in srgb,var(--sl-cold) 35%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--sl-alert)}.tile.warn .v{color:var(--sl-warn)}
/* ---- illustration ---- */
/* reflet du bouton : tourne avec l'état (verrouillé 0, déverrouillé 2 tours, ouvert 2,5 tours), en continu pendant le mouvement */
.sl-sheen{transition:transform 1.6s cubic-bezier(.45,0,.25,1);transform:rotate(var(--sl-turn,0deg))}
.unlocked{--sl-turn:-720deg}.open{--sl-turn:-900deg}
.locking .sl-spin,.unlocking .sl-spin,.opening .sl-spin{animation:slturn 1.1s linear infinite}
.unlocking .sl-spin,.opening .sl-spin{animation-direction:reverse}
/* anneau LED : couleur de l'état, pulsation verrouillée, segments qui tournent en mouvement, clignote si bloquée */
.sl-ring{fill:none;stroke:var(--sl-c);stroke-width:2.4;filter:drop-shadow(0 0 2.5px var(--sl-c));transition:stroke .4s}
.sl-halo{fill:none;stroke:var(--sl-c);stroke-width:7;opacity:.18;transition:stroke .4s}
.locked .sl-ring,.locked .sl-halo{animation:slbeat 4s ease-in-out infinite}
.locking .sl-ring,.unlocking .sl-ring,.opening .sl-ring{stroke-dasharray:10 7;animation:slspin .9s linear infinite}
.unlocking .sl-ring,.opening .sl-ring{animation-direction:reverse}
.jammed .sl-ring,.jammed .sl-halo{animation:slblink .5s infinite}
.unavailable .sl-ring,.unknown .sl-ring{stroke:#5d646b;filter:none}.unavailable .sl-halo,.unknown .sl-halo{opacity:0}
/* flèches de rotation autour du bouton pendant le mouvement */
.sl-arrows{opacity:0;transition:opacity .3s}.locking .sl-arrows,.unlocking .sl-arrows,.opening .sl-arrows{opacity:1}
.sl-arrows path{fill:none;stroke:var(--sl-c);stroke-width:2;stroke-linecap:round}
.unlocking .sl-arrows,.opening .sl-arrows{transform:scaleX(-1)}
/* halo de la couleur de l'état derrière la serrure (respire quand verrouillée), ombre portée */
.sl-aura{opacity:.55;transition:opacity .6s}.locked .sl-aura{animation:slaura 4s ease-in-out infinite}
.unavailable .sl-aura,.unknown .sl-aura{opacity:0}
.sl-auras{stop-color:var(--sl-c);transition:stop-color .4s}
/* ouverture (pêne tiré) : ondes qui partent du bouton */
.sl-wave{fill:none;stroke:var(--sl-c);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.open .sl-wave,.opening .sl-wave{animation:slwave 1.8s ease-out infinite}.sl-wave.w2{animation-delay:.6s}.sl-wave.w3{animation-delay:1.2s}
/* porte ouverte (capteur) : petite porte entrouverte à côté du cadenas */
.sl-doorpic{opacity:0;transition:opacity .5s}.door .sl-doorpic{opacity:1}
/* cadenas : l'anse se lève et pivote au déverrouillage */
.sl-shackle{transform-box:view-box;transform-origin:28px 22px;transition:transform .8s cubic-bezier(.45,0,.25,1)}
.unlocked .sl-shackle,.open .sl-shackle,.opening .sl-shackle{transform:translateY(-3px) rotate(-28deg)}
.unlocking .sl-shackle,.locking .sl-shackle{transform:translateY(-2px)}
.sl-pad{fill:var(--sl-c);transition:fill .4s}.sl-padbg{fill:color-mix(in srgb,var(--sl-c) 18%,#fff);transition:fill .4s}
/* blocage : la serrure tremble ; pile faible / critique : pictogramme qui clignote */
.jammed .sl-dev{animation:slshake .35s ease-in-out 3,slshake .35s ease-in-out 4s infinite}
.sl-warn,.sl-bat{opacity:0}.jammed .sl-warn{opacity:1;animation:slblink 1s infinite}
.lowbat .sl-bat{opacity:1;animation:slblink 1.6s infinite}.critbat .sl-bat path{fill:var(--sl-alert)}
.sl-dev{transform-box:view-box;transform-origin:120px 100px}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes slbeat{0%,100%{stroke-opacity:.45}50%{stroke-opacity:1}}
@keyframes slspin{to{stroke-dashoffset:-34}}
@keyframes slturn{to{transform:rotate(-360deg)}}
@keyframes slblink{50%{opacity:.15}}
@keyframes slaura{50%{opacity:.85}}
@keyframes slwave{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.9)}}
@keyframes slshake{0%,100%{transform:rotate(0)}25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
`;

  // Photos détourées (coordonnées en pixels de la photo) et dessins ; chaque modèle donne la place de l'anneau LED
  // et du disque tournant (cx, cy, rx, ry) dans la scène 240 × 180.
  const PRO3 = 'data:image/webp;base64,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';
  const PRO5 = 'data:image/webp;base64,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';
  const MODELS = {
    // Nuki Smart Lock 3.0 Pro : photo détourée, 192 × 300, posée à (72, 16) sur 96 × 150
    nuki_3_pro: {
      ring: [102.6, 51.5, 17.3, 17.7], disc: [103.5, 50.1, 30.3, 30.8], shadow: 120,
      art: `<image href="${PRO3}" x="72" y="16" width="96.1" height="150"/>`,
    },
    // Nuki Smart Lock Pro (5e génération) : photo détourée, 205 × 159, posée à (40, 24) à l'échelle 0,78
    nuki_pro_5: {
      ring: [92.8, 86.1, 26.8, 28.6], disc: [95.4, 86, 53.1, 59.3],
      art: `<image href="${PRO5}" x="40" y="24" width="160" height="124.1"/>`,
    },
  };
  // décor commun : halo de l'état, ombre, ondes d'ouverture, cadenas, pictogrammes (porte, blocage, pile)
  const DEFS = `<radialGradient id="slaurag"><stop offset="0" class="sl-auras" stop-opacity=".55"/><stop offset=".6" class="sl-auras" stop-opacity=".12"/><stop offset="1" class="sl-auras" stop-opacity="0"/></radialGradient>
    <radialGradient id="slglint" cx="0" cy="0" r="80" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".7" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  const SVG = (model, label) => {
    const M = MODELS[model] || MODELS.nuki_3_pro, [rx0, ry0, rrx, rry] = M.ring, [dx, dy, drx, dry] = M.disc;
    // reflets du disque : secteurs clairs dessinés autour de (0, 0), étirés en ellipse, qui tournent
    const wedges = [0, 180].map((a) => `<path d="M0 0 L${Math.cos((a - 22) * Math.PI / 180) * 80} ${Math.sin((a - 22) * Math.PI / 180) * 80} A80 80 0 0 1 ${Math.cos((a + 22) * Math.PI / 180) * 80} ${Math.sin((a + 22) * Math.PI / 180) * 80}Z" fill="url(#slglint)"/>`).join('');
    return `<svg viewBox="0 0 240 180" role="img" aria-label="${esc(label)}"><defs>${DEFS}
      <clipPath id="sldisc-${model}"><ellipse cx="${dx}" cy="${dy}" rx="${drx}" ry="${dry}"/></clipPath>
      <clipPath id="slbtnc-${model}"><ellipse cx="${rx0}" cy="${ry0}" rx="${rrx - 1.5}" ry="${rry - 1.5}"/></clipPath></defs>
      <ellipse class="sl-aura" cx="${dx}" cy="${dy + 6}" rx="${drx + 46}" ry="${dry + 34}" fill="url(#slaurag)"/>
      <ellipse cx="${M.shadow || dx + 6}" cy="170" rx="${Math.max(drx + 8, 46)}" ry="5" fill="#000" fill-opacity=".16"/>
      ${['', ' w2', ' w3'].map((w) => `<ellipse class="sl-wave${w}" cx="${rx0}" cy="${ry0}" rx="${rrx + 4}" ry="${rry + 4}"/>`).join('')}
      <g class="sl-dev">${M.art}
          <g clip-path="url(#sldisc-${model})"><g transform="translate(${dx} ${dy}) scale(${(drx / dry).toFixed(3)} 1)"><g class="sl-spin"><g class="sl-sheen">${wedges}</g></g></g></g>
          <g clip-path="url(#slbtnc-${model})"><g transform="translate(${rx0} ${ry0}) scale(${(rrx / rry).toFixed(3)} 1)"><g class="sl-spin"><g class="sl-sheen">${wedges.replace(/80/g, '40')}</g></g></g></g>
          <ellipse class="sl-halo" cx="${rx0}" cy="${ry0}" rx="${rrx}" ry="${rry}"/>
          <ellipse class="sl-ring" cx="${rx0}" cy="${ry0}" rx="${rrx}" ry="${rry}"/>
          <g class="sl-arrows" style="transform-box:view-box;transform-origin:${dx}px ${dy}px">
            <path d="M${dx - drx - 6} ${dy - 10} A${drx + 6} ${dry + 6} 0 0 1 ${dx - 10} ${dy - dry - 6}"/><path d="M${dx - 16} ${dy - dry - 10} L${dx - 10} ${dy - dry - 6} L${dx - 16} ${dy - dry - 1}"/>
          </g>
        </g>
      <g class="sl-doorpic" transform="translate(50 15)"><rect x="0" y="0" width="13" height="20" rx="1.5" fill="none" stroke="var(--sl-c)" stroke-width="1.8"/><path d="M0 0 L9 3 V23 L0 20Z" fill="var(--sl-c)"/></g>
      <g class="sl-padg"><circle class="sl-padbg" cx="28" cy="28" r="15"/>
        <path class="sl-shackle" d="M22 26 V21 A6 6 0 0 1 34 21 V26" fill="none" stroke="var(--sl-c)" stroke-width="2.6" stroke-linecap="round"/>
        <rect class="sl-pad" x="19.5" y="25" width="17" height="12" rx="2.5"/><circle cx="28" cy="30.5" r="1.8" fill="#fff"/></g>
      <g class="sl-warn"><path d="M212 18 L226 42 H198 Z" fill="#db4437"/><path d="M212 26 V34" stroke="#fff" stroke-width="2.4"/><circle cx="212" cy="38" r="1.4" fill="#fff"/></g>
      <g class="sl-bat"><rect x="14" y="152" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="36" y="155" width="3" height="6" fill="#ffa000"/><path d="M17 155 h4 v6 h-4z" fill="#ffa000"/></g>
    </svg>`;
  };

  const TILES = [['battery', 'mdi:battery', 'show_battery'], ['door', 'mdi:door', 'show_door'], ['since', 'mdi:clock-outline', 'show_since']];
  const STATES = ['locked', 'unlocked', 'locking', 'unlocking', 'open', 'opening', 'jammed'];

  class ApplianceSmartLockCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const lock = ids.find((i) => i.startsWith('lock.') && /nuki|serrure|lock|porte|door/i.test(i)) || ids.find((i) => i.startsWith('lock.')) || '';
      const dev = lock.split('.')[1] || '\u0000';
      return {
        entity: lock,
        entity_battery: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'battery' && i.includes(dev)) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'nuki_3_pro', battery_low: 20, confirm_open: true, show_status: true, show_buttons: true, show_battery: true, show_door: true, show_since: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(s) { return this._ok(s) && /^(on|true|open|opened|1|yes|low|charging)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }
    // bouton : entité button / script, sinon service lock
    _press(id) {
      if (!this._hass || !id) return;
      const d = id.split('.')[0];
      const [dom, svc] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'] }[d] || ['homeassistant', 'turn_on'];
      this._hass.callService(dom, svc, { entity_id: id });
    }
    _lock(svc) { if (this._hass && this._c.entity) this._hass.callService('lock', svc, { entity_id: this._c.entity }); }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const raw = s ? String(s.state).toLowerCase() : 'unavailable';
      const st = STATES.includes(raw) ? raw : raw === 'unknown' ? 'unknown' : this._ok(s) ? 'unknown' : 'unavailable';
      // batterie : % (sensor), ou binary_sensor « critique » ; en charge : binary_sensor
      const bS = this._st(c.entity_battery), bat = this._num(bS), batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const crit = this._on(this._st(c.entity_battery_critical)) || (batBinary && this._on(bS));
      const low = crit || (!isNaN(bat) && bat < Number(c.battery_low));
      const charging = this._on(this._st(c.entity_battery_charging));
      const dS = this._st(c.entity_door), door = this._on(dS);
      return { st, s, bS, bat, batBinary, crit, low, charging, dS, door };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="idbar"></div>
        <div class="head"><div class="title"><span class="iddot"></span><span id="sltitle"></span></div><div class="badge" id="slbadge"></div></div>
        ${SVG(this._c.model, this._c.name || this._t('name'))}
        <div class="alert" id="slalert"></div>
        <div class="ctl" id="slctl">
          <button data-a="lock"><ha-icon icon="mdi:lock"></ha-icon><span></span></button>
          <button data-a="unlock"><ha-icon icon="mdi:lock-open-variant"></ha-icon><span></span></button>
          <button data-a="open"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button>
        </div>
        <div class="ctl" id="slgo">
          <button data-a="lock_n_go"><ha-icon icon="mdi:lock-clock"></ha-icon><span></span></button>
          <button data-a="lock_n_go_unlatch"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ battery: c.entity_battery || c.entity_battery_critical, door: c.entity_door, since: c.entity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c;
      if (a === 'lock') return this._lock('lock');
      if (a === 'unlock') return this._lock('unlock');
      if (a === 'lock_n_go') return this._press(c.entity_lock_n_go);
      if (a === 'lock_n_go_unlatch') return this._press(c.entity_lock_n_go_unlatch);
      if (a === 'open') {
        // ouvrir = tirer le pêne : 2e clic dans les 4 s (confirm_open: false pour un seul clic)
        if (c.confirm_open !== false && !(this._confirmUntil && Date.now() < this._confirmUntil)) {
          this._confirmUntil = Date.now() + 4000;
          clearTimeout(this._confirmTimer);
          this._confirmTimer = setTimeout(() => { this._confirmUntil = 0; this._render(); }, 4000);
          this._render();
          return;
        }
        this._confirmUntil = 0; clearTimeout(this._confirmTimer);
        if (c.entity_unlatch) this._press(c.entity_unlatch); else this._lock('open');
        this._render();
      }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, s, bS, bat, batBinary, crit, low, charging, dS, door } = this._compute();
      // color : [r,g,b] (éditeur) ou texte CSS (#hex, rgb(), nom)
      const col = Array.isArray(c.color) && c.color.length >= 3 ? `rgb(${c.color.slice(0, 3).map((x) => Math.round(Number(x) || 0)).join(',')})`
        : typeof c.color === 'string' && /^[#a-z0-9(),.%\s-]+$/i.test(c.color.trim()) ? c.color.trim() : '';
      if (col) card.style.setProperty('--sl-id', col); else card.style.removeProperty('--sl-id');
      card.className = `${col ? 'hasid ' : ''}${st}${door ? ' door' : ''}${low ? ' lowbat' : ''}${crit ? ' critbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('sltitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('slbadge');
      badge.textContent = this._t(st) + (door ? ` · ${this._t('door_open')}` : '');
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('slalert');
      al.textContent = st === 'jammed' ? this._t('jammed_detail') : crit ? this._t('battery_critical') : '';
      al.classList.toggle('on', !!al.textContent);
      al.classList.toggle('warn', st !== 'jammed');

      // commandes : Ouvrir seulement si la serrure sait tirer le pêne (LockEntityFeature.OPEN = 1) ou avec un bouton dédié
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const canOpen = !!c.entity_unlatch || (isFinite(sf) && (sf & 1) === 1);
      const busy = /ing$/.test(st), dead = st === 'unavailable';
      const confirm = this._confirmUntil && Date.now() < this._confirmUntil;
      const ctl = r.getElementById('slctl');
      ctl.classList.toggle('hide', c.show_buttons === false || !c.entity);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = a === 'open' && confirm ? this._t('btn_confirm') : this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'open' && !canOpen);
        b.classList.toggle('on', (a === 'lock' && st === 'locked') || (a === 'unlock' && st === 'unlocked') || (a === 'open' && st === 'open'));
        b.classList.toggle('confirm', a === 'open' && !!confirm);
        b.disabled = dead || busy || (a === 'lock' && st === 'locked') || (a === 'unlock' && st === 'unlocked');
      });
      const go = r.getElementById('slgo');
      go.querySelectorAll('button').forEach((b) => {
        b.querySelector('span').textContent = this._t(`btn_${b.dataset.a}`);
        b.classList.toggle('hide', !c[`entity_${b.dataset.a}`]);
        b.disabled = dead || busy;
      });
      go.classList.toggle('hide', c.show_buttons === false || (!c.entity_lock_n_go && !c.entity_lock_n_go_unlatch));

      const batIcon = charging ? 'mdi:battery-charging' : low ? 'mdi:battery-alert' : 'mdi:battery';
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', batIcon);
      const V = {
        battery: [c.entity_battery || c.entity_battery_critical, !isNaN(bat) && !batBinary ? String(Math.round(bat)) : this._t(crit ? 'critical' : 'ok'),
          !isNaN(bat) && !batBinary ? '%' : '', crit ? 'bad' : low ? 'warn' : ''],
        door: [c.entity_door, this._ok(dS) ? this._t(door ? 'door_opened' : 'door_closed') : '--', '', door ? 'warn' : ''],
        since: [s, this._since(s), '', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', cls === 'bad'); el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k === 'battery' && charging ? 'charging' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSmartLockCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSmartLockCardEditor extends HTMLElement {
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
      const lang = (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en';
      const tr = T[lang] || T[String(lang).slice(0, 2)] || T.en;
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'nuki_3_pro', label: tr.model_nuki_3_pro }, { value: 'nuki_pro_5', label: tr.model_nuki_pro_5 }] } } },
        { name: 'color', selector: { color_rgb: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity', 'lock'),
        ent('entity_unlatch', ['button', 'input_button', 'script']),
        ent('entity_lock_n_go', ['button', 'input_button', 'script']),
        ent('entity_lock_n_go_unlatch', ['button', 'input_button', 'script']),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        ent('entity_battery_charging', 'binary_sensor'),
        ent('entity_battery_critical', 'binary_sensor'),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_door', ['binary_sensor', 'sensor']),
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('confirm_open'), bool('show_status'), bool('show_buttons'), bool('show_battery'), bool('show_door'), bool('show_since'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'lock_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSmartLockCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Serrure connectée animée (Nuki 3.0 Pro, Nuki Pro 5e gén.) : verrouiller, déverrouiller, ouvrir, Lock \'n\' Go, batterie, porte.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/smart-lock.md',
  });
})();
