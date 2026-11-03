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
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
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

  const SVG = (label) => `<svg viewBox="0 0 200 150" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
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
    <!-- palet détecteur et sondes -->
    <ellipse cx="100" cy="124" rx="30" ry="7" fill="#000" opacity=".3"/>
    <path d="M72 112 Q72 124 100 124 Q128 124 128 112 Z" fill="#c4cbd3"/>
    <ellipse cx="100" cy="112" rx="28" ry="8" fill="url(#lkbody)"/>
    <circle class="lk-led" cx="112" cy="111" r="2.2"/>
    <path d="M90 110 q3 -5 6 0 q-3 3 -6 0 Z" fill="#5aa9e6"/>
    <rect x="82" y="123" width="3" height="3" fill="#c9973f"/><rect x="115" y="123" width="3" height="3" fill="#c9973f"/>
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
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en'; if (!T[l]) l = l.slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
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
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="lkalert"></div>
        <div class="ctl" id="lkctl"><button id="lkvalve"><ha-icon icon="mdi:valve"></ha-icon><span></span></button><button id="lksiren"><ha-icon icon="mdi:volume-off"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => { const { wet, probes } = this._compute(); this._more(wet[0] || probes[0]); });
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
        temperature: [c.entity_temperature, isNaN(temp) ? '--' : (Math.round(temp * 10) / 10).toLocaleString(this._lang()), tc ? tc.unit : '°C', st === 'freeze' ? 'cold' : ''],
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
        ent('entity_leak', ['binary_sensor', 'sensor', 'input_boolean'], true),
        ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        ent('entity_siren', ['siren', 'switch', 'input_boolean', 'button', 'script']),
        ent('entity_battery', ['sensor', 'binary_sensor'], true),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_temperature', 'sensor'),
        { name: 'freeze_temp', default: 3, selector: { number: { min: -30, max: 40, step: 0.5, mode: 'box' } } },
        window.applianceTempField,
        ent('entity_humidity', 'sensor'),
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_probes'), bool('show_battery'), bool('show_temperature'), bool('show_humidity'), bool('show_buttons'), bool('animations')] },
      ].filter(Boolean);
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceLeakDetectorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: "Détecteur de fuite d'eau animé : flaque, gouttes, une ou plusieurs sondes, vanne d'arrêt, sirène, alerte gel.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/leak-detector.md',
  });
})();
