/* Carte « Détecteur de fuite d'eau » — custom:appliance-leak-detector-card
 * Palet détecteur posé au sol sous un tuyau. Fuite : la flaque s'étend, des ondulations, des gouttes tombent du raccord,
 * la LED passe au rouge. entity_leak accepte une sonde ou une liste de sondes : l'alerte nomme celles qui sont mouillées.
 * Facultatifs : vanne d'arrêt (bouton Fermer / Ouvrir, gouttes arrêtées vanne fermée), sirène (bouton Couper la sirène),
 * batterie (une ou plusieurs, la plus basse est affichée), température (alerte gel sous freeze_temp), humidité.
 */
(() => {
  const TAG = 'appliance-leak-detector-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n leak_detector*/{};

  // états reconnus : on / off des binary_sensor, et textes des capteurs (toutes langues des traductions)
  const WET_RE = /^(on|true|yes|1|wet|leak|leaking|detected|water|alarm|triggered)$/i;
  const DRY_RE = /^(off|false|no|0|dry|ok|normal|clear|idle|none|not_detected|no_leak)$/i;
  const WET_WORDS = ['wet', 'leak', 'water', 'mouillé', 'mouille', 'fuite', 'eau', 'nass', 'wasser', 'leck', 'bagnato', 'perdita', 'acqua', 'våt', 'lekk', 'vann', 'nat', 'lek', 'ud', 'scurgere', 'apă', 'мокро', 'протечка', 'вода', 'curenje', 'цурење', 'mokro'];
  const list = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((s) => String(s).trim()).filter(Boolean);

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--lk-ok:var(--appliance-ok-color,#43a047);--lk-alert:var(--appliance-alert-color,#db4437);
  --lk-warn:var(--appliance-warn-color,#ffa000);--lk-cold:var(--appliance-cold-color,#2b9af9);transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.dry .badge{background:color-mix(in srgb,var(--lk-ok) 20%,transparent);color:var(--lk-ok)}
.leak .badge{background:color-mix(in srgb,var(--lk-alert) 22%,transparent);color:var(--lk-alert)}
.freeze .badge{background:color-mix(in srgb,var(--lk-cold) 22%,transparent);color:var(--lk-cold)}
.low_battery .badge{background:color-mix(in srgb,var(--lk-warn) 22%,transparent);color:var(--lk-warn)}
ha-card.leak{box-shadow:0 0 0 1px color-mix(in srgb,var(--lk-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--lk-alert) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--lk-alert);font-weight:500;text-align:center}
.alert.on{display:block}.freeze .alert{color:var(--lk-cold)}
svg{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.red{background:color-mix(in srgb,var(--lk-alert) 25%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--lk-alert)}.tile.warn .v{color:var(--lk-warn)}.tile.cold .v{color:var(--lk-cold)}
/* ---- illustration ---- */
.lk-water{transform-box:fill-box;transform-origin:50% 50%;transform:scale(0);transition:transform 1.2s cubic-bezier(.2,.9,.3,1)}
.leak .lk-water{transform:scale(1)}
.lk-ripple{fill:none;stroke:#bfe3ff;stroke-width:1.2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.leak .lk-ripple{animation:lkrip 2s ease-out infinite}.leak .lk-ripple.r2{animation-delay:1s}
.lk-drop{opacity:0}
.leak .lk-drop{animation:lkdrop 1.4s ease-in infinite}.leak .lk-drop.d2{animation-delay:.7s}
.valve_closed .lk-drop{animation:none;opacity:0}
.lk-led{fill:#2e7d32}
.lk-warn{opacity:0}.leak .lk-warn{opacity:1;animation:lkfast 1s infinite}
.dry .lk-led{animation:lkbeat 6s infinite}
.leak .lk-led{fill:#ff1744;animation:lkfast .5s infinite}
.low_battery .lk-led{fill:#ffa000;animation:lkbeat 3s infinite}
.freeze .lk-led{fill:#4fc3f7;animation:lkbeat 3s infinite}
.unavailable .lk-led{fill:#444}
.lk-wave{fill:none;stroke:#ff5252;stroke-width:2;opacity:0;transform-box:view-box;transform-origin:100px 112px}
.leak .lk-wave{animation:lkwave 1.2s ease-out infinite}.leak .lk-wave.w2{animation-delay:.6s}
.lk-valve{fill:#2b9af9;transition:transform .4s,fill .3s;transform-box:fill-box;transform-origin:50% 100%}
.valve_closed .lk-valve{fill:#db4437;transform:rotate(90deg)}
.lk-frost{opacity:0;transition:opacity .6s}.freeze .lk-frost{opacity:1}
.lk-bat{opacity:0}.low_battery .lk-bat{opacity:1;animation:lkfast 2s infinite}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
@keyframes lkbeat{0%,92%,100%{fill-opacity:.25}95%{fill-opacity:1}}
@keyframes lkfast{50%{opacity:.15}}
@keyframes lkwave{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes lkrip{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.1)}}
@keyframes lkdrop{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:1;transform:translateY(62px)}100%{opacity:0;transform:translateY(66px)}}
`;

  // modèles photo (option model) : photos détourées (webp transparent) d'appareils Zigbee posés au sol, à la place du palet.
  // ikea = IKEA BADRING (E2202) : boîtier ajouré à plat ; sonoff = Sonoff SNZB-05P : base à deux plots dorés ; x, y, w, h = place dans le dessin (le bas de l'appareil est dans la flaque), led = position du voyant d'état
  const MODELS = {
    sonoff: { x: 62, y: 74, w: 76, h: 52, led: [131, 84], uri: 'data:image/webp;base64,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' },
    ikea: { x: 74, y: 66, w: 48, h: 60, led: [118, 76], uri: 'data:image/webp;base64,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' },
  };
  // palet détecteur et sondes (modèle par défaut)
  const PUCK = `    <ellipse cx="100" cy="124" rx="30" ry="7" fill="#000" opacity=".3"/>
    <path d="M72 112 Q72 124 100 124 Q128 124 128 112 Z" fill="#c4cbd3"/>
    <ellipse cx="100" cy="112" rx="28" ry="8" fill="url(#lkbody)"/>
    <circle class="lk-led" cx="112" cy="111" r="2.2"/>
    <path d="M90 110 q3 -5 6 0 q-3 3 -6 0 Z" fill="#5aa9e6"/>
    <rect x="82" y="123" width="3" height="3" fill="#c9973f"/><rect x="115" y="123" width="3" height="3" fill="#c9973f"/>`;
  // modèle photo : ombre, photo, voyant d'état (LED) et avertissement rouge qui clignote en cas de fuite
  const photo = (m) => `<ellipse cx="100" cy="${m.y + m.h - 2}" rx="${m.w * 0.5}" ry="5" fill="#000" opacity=".3"/>
    <image href="${m.uri}" x="${m.x}" y="${m.y}" width="${m.w}" height="${m.h}" preserveAspectRatio="xMidYMid meet"/>
    <circle class="lk-led" cx="${m.led[0]}" cy="${m.led[1]}" r="3" stroke="#fff" stroke-width="1"/>
    <g class="lk-warn"><path d="M28 74 L46 104 H10 Z" fill="#ff1744" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M28 83 V94" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="99" r="1.8" fill="#fff"/></g>`;
  const SVG = (label, model) => `<svg viewBox="0 0 200 150" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="lkpipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#b6bec6"/><stop offset="1" stop-color="#7f8891"/></linearGradient>
    <linearGradient id="lkbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd5dc"/></linearGradient>
    <radialGradient id="lkwat" cx=".45" cy=".4"><stop offset="0" stop-color="#7cc4ff" stop-opacity=".9"/><stop offset="1" stop-color="#2b8be0" stop-opacity=".55"/></radialGradient></defs>
    <path d="M0 112 H200 V150 H0 Z" fill="#2a3140"/>
    <!-- tuyau, raccord laiton et vanne d'arrêt -->
    <rect x="0" y="22" width="200" height="12" fill="url(#lkpipe)"/>
    <rect x="92" y="18" width="16" height="20" rx="2" fill="#c9973f"/>
    <rect x="34" y="14" width="8" height="8" rx="1" fill="#8d959e"/><rect class="lk-valve" x="28" y="8" width="20" height="5" rx="2.5"/>
    <!-- givre sur le tuyau (gel) -->
    <g class="lk-frost" fill="#e3f4ff">${[8, 26, 56, 76, 120, 140, 162, 184].map((x, i) => `<path d="M${x} 22 l3 -${3 + (i % 3)} l3 ${3 + (i % 3)} Z"/><circle cx="${x + 5}" cy="34" r="1.4"/>`).join('')}<rect x="0" y="22" width="200" height="12" fill="#bfe6ff" opacity=".35"/></g>
    <!-- gouttes -->
    <path class="lk-drop" d="M100 40 q-4 6 0 9 q4 -3 0 -9 Z" fill="#6bb8ff"/>
    <path class="lk-drop d2" d="M100 40 q-4 6 0 9 q4 -3 0 -9 Z" fill="#6bb8ff"/>
    <!-- flaque -->
    <ellipse class="lk-water" cx="100" cy="124" rx="86" ry="15" fill="url(#lkwat)"/>
    <ellipse class="lk-ripple" cx="100" cy="124" rx="60" ry="10"/><ellipse class="lk-ripple r2" cx="100" cy="124" rx="60" ry="10"/>
    <path class="lk-wave" d="M66 112 Q56 100 64 88 M134 112 Q144 100 136 88"/><path class="lk-wave w2" d="M66 112 Q56 100 64 88 M134 112 Q144 100 136 88"/>
    ${MODELS[model] ? photo(MODELS[model]) : PUCK}
    <g class="lk-bat"><rect x="158" y="76" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="180" y="79" width="3" height="6" fill="#ffa000"/><rect x="161" y="79" width="4" height="6" fill="#ffa000"/></g>
  </svg>`;

  const TILES = [['since', 'mdi:clock-outline', 'show_since'], ['probes', 'mdi:water-alert', 'show_probes'], ['battery', 'mdi:battery', 'show_battery'],
    ['temperature', 'mdi:thermometer', 'show_temperature'], ['humidity', 'mdi:water-percent', 'show_humidity']];

  class ApplianceLeakDetectorCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      return { entity_leak: ids.find((i) => i.startsWith('binary_sensor.') && dc(i) === 'moisture') || ids.find((i) => /(leak|fuite|water_leak)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { battery_low: 20, freeze_temp: 3, show_status: true, show_since: true, show_probes: true, show_battery: true, show_temperature: true, show_humidity: true, show_buttons: true, ...c };
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
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _wet(s) {
      if (!this._ok(s)) return false;
      const v = String(s.state).trim().toLowerCase();
      if (DRY_RE.test(v) || /^(no|not|pas|kein|nessun|ingen|geen|nu |нет|nema)\b/.test(v) || /^(sec|sèche|trocken|asciutto|tørr|droog|uscat|сухо|suvo|суво)$/.test(v)) return false;
      return WET_RE.test(v) || WET_WORDS.some((w) => (w.length > 3 ? v.includes(w) : v === w)); // mots courts : égalité stricte
    }
    _name(id) { const s = this._st(id); return (s && s.attributes && s.attributes.friendly_name) || id; }
    _time(iso) {
      const t = Date.parse(iso); if (!t) return '--';
      const d = new Date(t), loc = this._lang(), time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
      return d.toDateString() === new Date().toDateString() ? time : `${d.toLocaleDateString(loc, { day: 'numeric', month: 'short' })} ${time}`;
    }

    _compute() {
      const c = this._c, probes = list(c.entity_leak);
      const usable = probes.filter((i) => this._ok(this._st(i)));
      const wet = probes.filter((i) => this._wet(this._st(i)));
      // dernier changement : la sonde mouillée la plus récente, sinon la sonde changée en dernier
      const pick = (wet.length ? wet : usable).map((i) => this._st(i).last_changed).sort().pop();
      // batterie : une entité ou une liste, la plus basse compte (binary_sensor battery : on = faible)
      const bats = list(c.entity_battery).map((i) => this._st(i)).filter((s) => this._ok(s));
      const binLow = bats.some((s) => /^binary_sensor\./.test(s.entity_id) && WET_RE.test(String(s.state)));
      const pcts = bats.map((s) => this._num(s)).filter((v) => !isNaN(v));
      const bat = pcts.length ? Math.min(...pcts) : NaN;
      const low = binLow || (!isNaN(bat) && bat < Number(c.battery_low));
      const vS = this._st(c.entity_valve), valveClosed = this._ok(vS) && /^(off|closed|closing)$/i.test(String(vS.state));
      const tS = this._st(c.entity_temperature), tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const temp = tc ? tc.conv(this._num(tS), tS) : this._num(tS);
      const freeze = !isNaN(temp) && c.freeze_temp !== '' && c.freeze_temp != null && temp <= Number(c.freeze_temp);
      const st = !usable.length ? 'unavailable' : wet.length ? 'leak' : freeze ? 'freeze' : low ? 'low_battery' : 'dry';
      return { st, probes, usable, wet, last: pick, bat, low, binLow, valveClosed, vS, temp, tc };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lktitle"></div><div class="badge" id="lkbadge"></div></div>
        ${SVG(this._c.name || this._t('name'), this._c.model)}
        <div class="alert" id="lkalert"></div>
        <div class="ctl" id="lkctl"><button id="lkvalve"><ha-icon icon="mdi:valve"></ha-icon><span></span></button><button id="lksiren"><ha-icon icon="mdi:volume-off"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => { const { wet, probes } = this._compute(); this._more(wet[0] || probes[0]); });
      root.getElementById('lkvalve').addEventListener('click', () => {
        const id = this._c.entity_valve; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        this._hass.callService(['switch', 'valve', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
      });
      root.getElementById('lksiren').addEventListener('click', () => {
        const id = this._c.entity_siren; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        const [d, s] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'] }[dom] || [['siren', 'switch', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'turn_off'];
        this._hass.callService(d, s, { entity_id: id });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c, { wet, probes } = this._compute();
        this._more({ since: wet[0] || probes[0], probes: wet[0] || probes[0], battery: list(c.entity_battery)[0], temperature: c.entity_temperature, humidity: c.entity_humidity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, probes, usable, wet, last, bat, low, binLow, valveClosed, vS, temp, tc } = this._compute();
      card.className = `${st}${valveClosed ? ' valve_closed' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('lktitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('lkbadge');
      badge.textContent = st === 'leak' && valveClosed ? this._t('leak_valve_closed') : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('lkalert');
      al.textContent = st === 'leak'
        ? (probes.length > 1 ? this._t('leak_where').replace('{names}', wet.map((i) => this._name(i)).join(', ')) : this._t('leak_at').replace('{t}', this._time(last)))
          + (valveClosed ? ` · ${this._t('water_off')}` : '')
        : st === 'freeze' ? this._t('freeze_alert') : '';
      al.classList.toggle('on', !!al.textContent);

      const bv = r.getElementById('lkvalve'), bs = r.getElementById('lksiren');
      bv.classList.toggle('hide', !c.entity_valve);
      bv.classList.toggle('red', st === 'leak' && !valveClosed);
      bv.querySelector('span').textContent = this._t(valveClosed ? 'open_valve' : 'close_valve');
      bv.disabled = !this._ok(vS);
      bs.classList.toggle('hide', !c.entity_siren || st !== 'leak');
      bs.querySelector('span').textContent = this._t('silence');
      r.getElementById('lkctl').classList.toggle('hide', c.show_buttons === false || (bv.classList.contains('hide') && bs.classList.contains('hide')));

      const hum = this._num(this._st(c.entity_humidity));
      const V = {
        since: [probes.length, last ? this._time(last) : '--', '', ''],
        probes: [probes.length > 1, `${wet.length}/${usable.length}`, '', wet.length ? 'bad' : ''],
        battery: [list(c.entity_battery).length, isNaN(bat) ? (binLow ? this._t('low') : list(c.entity_battery).length ? this._t('ok') : '--') : String(Math.round(bat)), isNaN(bat) ? '' : '%', low ? 'warn' : ''],
        temperature: [c.entity_temperature, isNaN(temp) ? '--' : (Math.round(temp * 10) / 10).toLocaleString(window.applianceLocale(this._c, this._hass)), tc ? tc.unit : '°C', st === 'freeze' ? 'cold' : ''],
        humidity: [c.entity_humidity, isNaN(hum) ? '--' : String(Math.round(hum)), '%', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        ['bad', 'warn', 'cold'].forEach((x) => el.classList.toggle(x, cls === x));
        el.querySelector('.lbl').textContent = this._l(k === 'since' && st === 'leak' ? 'leak_tile' : k === 'battery' && list(c.entity_battery).length > 1 ? 'battery_min' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceLeakDetectorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceLeakDetectorCardEditor extends HTMLElement {
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
      const ent = (name, domain, multiple) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(multiple ? { multiple: true } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      // l'éditeur « multiple » attend une liste : une chaîne saisie en YAML est convertie pour l'affichage
      const data = { ...this._c };
      ['entity_leak', 'entity_battery'].forEach((k) => { if (data[k] != null && !Array.isArray(data[k])) data[k] = list(data[k]); });
      this._form.hass = this._hass;
      this._form.data = data;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        { name: 'model', default: 'puck', selector: { select: { mode: 'dropdown', options: [{ value: 'puck', label: 'Palet / Puck' }, { value: 'ikea', label: 'IKEA BADRING (E2202)' }, { value: 'sonoff', label: 'Sonoff SNZB-05P' }] } } },
        ent('entity_leak', ['binary_sensor', 'sensor', 'input_boolean'], true),
        ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        ent('entity_siren', ['siren', 'switch', 'input_boolean', 'button', 'script']),
        ent('entity_battery', ['sensor', 'binary_sensor'], true),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_temperature', 'sensor'),
        { name: 'freeze_temp', default: 3, selector: { number: { min: -30, max: 40, step: 0.5, mode: 'box' } } },
        window.applianceTempField,
        ent('entity_humidity', 'sensor'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_probes'), bool('show_battery'), bool('show_temperature'), bool('show_humidity'), bool('show_buttons'), bool('animations')] },
      ].filter(Boolean);
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceLeakDetectorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Détecteur de fuite d'eau animé : flaque, gouttes, une ou plusieurs sondes, vanne d'arrêt, sirène, alerte gel.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/leak-detector.md',
  });
})();
