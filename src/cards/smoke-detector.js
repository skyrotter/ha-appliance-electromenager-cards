/* Carte « Détecteur de fumée » — custom:appliance-smoke-detector-card
 * Détecteur fixé au plafond, deux modèles (option model) : cylinder (cylindre compact, bouton-LED carré, bande grillagée)
 * ou round (rond plat classique). Alarme : la fumée monte, la LED rouge clignote, des ondes sonores partent du détecteur.
 * CO (facultatif, entity_co : binary_sensor ou sensor en ppm) : nappe de gaz et ondes orange. Test : le bouton s'enfonce,
 * ondes bleues. Pile faible / défaut : LED orange et pictogramme. Boutons « Tester » et « Couper l'alarme » facultatifs.
 */
(() => {
  const TAG = 'appliance-smoke-detector-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n smoke_detector*/{};

  // états reconnus : on / off des binary_sensor, et textes des capteurs (toutes langues des traductions)
  const ON_RE = /^(on|true|yes|1|detected|alarm|alarming|triggered|fire|smoke|emergency|active)$/i;
  const OFF_RE = /^(off|false|no|0|clear|idle|ok|normal|none|safe|not_detected|no_smoke|inactive|standby)$/i;
  const SMOKE_WORDS = ['smoke', 'alarm', 'fire', 'fumée', 'fumee', 'feu', 'rauch', 'feuer', 'fumo', 'incendio', 'røyk', 'brann', 'rook', 'brand', 'fum', 'incendiu', 'дым', 'пожар', 'dim', 'požar', 'дим'];

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sd-ok:var(--appliance-ok-color,#43a047);--sd-alert:var(--appliance-alert-color,#db4437);
  --sd-warn:var(--appliance-warn-color,#ffa000);--sd-cold:var(--appliance-cold-color,#2b9af9);transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ok .badge{background:color-mix(in srgb,var(--sd-ok) 20%,transparent);color:var(--sd-ok)}
.alarm .badge{background:color-mix(in srgb,var(--sd-alert) 22%,transparent);color:var(--sd-alert)}
.co .badge,.low_battery .badge,.fault .badge{background:color-mix(in srgb,var(--sd-warn) 22%,transparent);color:var(--sd-warn)}
.test .badge{background:color-mix(in srgb,var(--sd-cold) 22%,transparent);color:var(--sd-cold)}
ha-card.alarm{box-shadow:0 0 0 1px color-mix(in srgb,var(--sd-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--sd-alert) 30%,transparent)}
ha-card.co{box-shadow:0 0 0 1px color-mix(in srgb,var(--sd-warn) 60%,transparent),0 0 22px color-mix(in srgb,var(--sd-warn) 25%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--sd-alert);font-weight:500;text-align:center}
.alert.on{display:block}.co .alert,.fault .alert{color:var(--sd-warn)}
svg{display:block;width:100%;max-width:calc(200px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.red{background:color-mix(in srgb,var(--sd-alert) 25%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--sd-alert)}.tile.warn .v{color:var(--sd-warn)}
/* ---- illustration ---- */
.sd-led{fill:#2e7d32}
.ok .sd-led{animation:sdbeat 6s infinite}
.alarm .sd-led,.co .sd-led,.test .sd-led{fill:#ff1744;animation:sdfast .5s infinite}
.low_battery .sd-led,.fault .sd-led{fill:#ffa000;animation:sdbeat 3s infinite}
.unavailable .sd-led{fill:#444}
.sd-glow{opacity:0}.alarm .sd-glow,.co .sd-glow,.test .sd-glow{opacity:1;animation:sdfast .5s infinite}
.sd-wave{fill:none;stroke:#ff5252;stroke-width:2.5;opacity:0;transform-box:view-box;transform-origin:100px 54px}
.alarm .sd-wave,.test .sd-wave,.co .sd-wave{animation:sdwave 1.2s ease-out infinite}
.test .sd-wave{stroke:var(--sd-cold)}.co .sd-wave{stroke:var(--sd-warn)}
.sd-wave.w2{animation-delay:.4s}.sd-wave.w3{animation-delay:.8s}
.sd-smoke{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.alarm .sd-smoke{animation:sdsmoke 4s ease-in infinite}
.alarm .sd-smoke.s2{animation-delay:1.3s}.alarm .sd-smoke.s3{animation-delay:2.6s}
.sd-gas{opacity:0}.co .sd-gas{animation:sdgas 3s ease-in-out infinite}
.sd-co{opacity:0}.co .sd-co{opacity:1}
.sd-btn{transform-box:fill-box;transform-origin:50% 50%}.test .sd-btn{animation:sdpress 1.2s infinite}
.sd-bat,.sd-fault{opacity:0}.low_battery .sd-bat{opacity:1;animation:sdbeat 2s infinite}.fault .sd-fault{opacity:1}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
@keyframes sdbeat{0%,92%,100%{fill-opacity:.25}95%{fill-opacity:1}}
@keyframes sdfast{50%{opacity:.15}}
@keyframes sdwave{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes sdsmoke{0%{opacity:0;transform:translate(0,40px) scale(.6)}25%{opacity:.85}100%{opacity:0;transform:translate(0,-8px) scale(1.4)}}
@keyframes sdpress{0%,100%{transform:scale(1)}30%{transform:scale(.85)}}
@keyframes sdgas{0%,100%{opacity:0;transform:translateY(20px)}50%{opacity:.6;transform:translateY(0)}}
`;

  /* éléments communs aux deux modèles : plafond, fumée, gaz, ondes, pictogrammes pile / défaut */
  const DEFS = `<linearGradient id="sdceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4252"/><stop offset="1" stop-color="#262c38"/></linearGradient>
    <radialGradient id="sdsmk"><stop offset="0" stop-color="#9aa3ad" stop-opacity=".9"/><stop offset="1" stop-color="#9aa3ad" stop-opacity="0"/></radialGradient>
    <radialGradient id="sdgasg"><stop offset="0" stop-color="#ffb74d" stop-opacity=".7"/><stop offset="1" stop-color="#ffb74d" stop-opacity="0"/></radialGradient>
    <radialGradient id="sdglowg"><stop offset="0" stop-color="#ff1744" stop-opacity=".8"/><stop offset="1" stop-color="#ff1744" stop-opacity="0"/></radialGradient>`;
  const BACK = `<rect x="0" y="0" width="200" height="12" fill="url(#sdceil)"/>
    <ellipse class="sd-smoke" cx="72" cy="122" rx="30" ry="14" fill="url(#sdsmk)"/>
    <ellipse class="sd-smoke s2" cx="128" cy="126" rx="34" ry="15" fill="url(#sdsmk)"/>
    <ellipse class="sd-smoke s3" cx="100" cy="114" rx="26" ry="12" fill="url(#sdsmk)"/>
    <ellipse class="sd-gas" cx="100" cy="120" rx="64" ry="18" fill="url(#sdgasg)"/>
    ${['', ' w2', ' w3'].map((w) => `<path class="sd-wave${w}" d="M54 70 Q44 54 54 38 M146 70 Q156 54 146 38"/>`).join('')}`;
  const ICONS = `<g class="sd-bat"><rect x="146" y="80" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="168" y="83" width="3" height="6" fill="#ffa000"/><rect x="149" y="83" width="4" height="6" fill="#ffa000"/></g>
    <g class="sd-fault"><path d="M157 76 L171 100 H143 Z" fill="#ffa000"/><path d="M157 84 V92" stroke="#222" stroke-width="2.4"/><circle cx="157" cy="96" r="1.4" fill="#222"/></g>`;

  const MODELS = {
    // cylindre compact : embase évasée, bouton-LED carré, bande grillagée
    cylinder: `<defs>${DEFS}
      <linearGradient id="sdcyl" x1="0" x2="1"><stop offset="0" stop-color="#c9cfd6"/><stop offset=".35" stop-color="#ffffff"/><stop offset=".6" stop-color="#f4f6f8"/><stop offset="1" stop-color="#b9c0c8"/></linearGradient>
      <linearGradient id="sdmesh" x1="0" x2="1"><stop offset="0" stop-color="#7d858e"/><stop offset=".35" stop-color="#e3e7eb"/><stop offset=".6" stop-color="#c5cbd1"/><stop offset="1" stop-color="#6f7780"/></linearGradient>
      <pattern id="sdholes" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#000" fill-opacity=".35"/></pattern></defs>
      ${BACK}
      <path d="M58 12 H142 L136 22 H64 Z" fill="url(#sdcyl)"/><path d="M64 22 H136" stroke="#9aa3ad" stroke-width="1"/>
      <rect x="66" y="22" width="68" height="36" fill="url(#sdcyl)"/>
      <rect x="66" y="58" width="68" height="14" fill="url(#sdmesh)"/><rect x="66" y="58" width="68" height="14" fill="url(#sdholes)"/>
      <path d="M66 58 H134 M66 72 H134" stroke="#8a929b" stroke-width=".8"/>
      <rect x="66" y="72" width="68" height="22" fill="url(#sdcyl)"/>
      <ellipse cx="100" cy="94" rx="34" ry="5" fill="#dfe4e9" stroke="#b5bdc6" stroke-width=".8"/><ellipse cx="100" cy="94.5" rx="9" ry="2" fill="#c7ced6"/>
      <text class="sd-co" x="100" y="86" text-anchor="middle" font-size="8" font-weight="700" fill="#e65100" font-family="sans-serif">CO</text>
      <circle class="sd-glow" cx="100" cy="38" r="16" fill="url(#sdglowg)"/>
      <rect class="sd-btn" x="94" y="32" width="12" height="12" rx="3" fill="#e3e7eb" stroke="#c2c9d1" stroke-width=".8"/>
      <rect class="sd-led" x="96" y="34" width="8" height="8" rx="2"/>
      ${ICONS}`,
    // rond plat classique : socle, corps à fentes, bouton test et LED dessous
    round: `<defs>${DEFS}
      <linearGradient id="sdbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd5dc"/></linearGradient></defs>
      ${BACK}
      <rect x="56" y="12" width="88" height="8" rx="2" fill="#e6eaef"/>
      <path d="M48 20 H152 Q152 50 140 56 H60 Q48 50 48 20 Z" fill="url(#sdbody)"/>
      <g stroke="#aab2bc" stroke-width="2.4" stroke-linecap="round"><path d="M58 30 V44 M68 30 V46 M78 30 V47 M122 30 V47 M132 30 V46 M142 30 V44"/></g>
      <text class="sd-co" x="100" y="42" text-anchor="middle" font-size="9" font-weight="700" fill="#e65100" font-family="sans-serif">CO</text>
      <ellipse cx="100" cy="56" rx="40" ry="7" fill="#e9edf2" stroke="#c4cbd3"/>
      <circle class="sd-glow" cx="124" cy="55" r="12" fill="url(#sdglowg)"/>
      <ellipse class="sd-btn" cx="100" cy="56" rx="13" ry="3.6" fill="#d7dde4" stroke="#b5bdc6"/>
      <circle class="sd-led" cx="124" cy="55" r="2.8"/>
      ${ICONS}`,
  };
  const SVG = (model, label) => `<svg viewBox="25 0 150 140" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}">${MODELS[model] || MODELS.cylinder}</svg>`;

  const TILES = [['since', 'mdi:clock-outline', 'show_since'], ['co_level', 'mdi:molecule-co', 'show_co'], ['battery', 'mdi:battery', 'show_battery'], ['temperature', 'mdi:thermometer', 'show_temperature']];

  class ApplianceSmokeDetectorCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const smoke = ids.find((i) => i.startsWith('binary_sensor.') && dc(i) === 'smoke') || ids.find((i) => /(smoke|fumee|fumée|rauch)/i.test(i)) || '';
      const dev = smoke.split('.')[1] || '\u0000';
      return {
        entity_smoke: smoke,
        entity_battery: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'battery' && i.includes(dev.split('_')[0])) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'cylinder', co_threshold: 50, battery_low: 20, show_status: true, show_since: true, show_co: true, show_battery: true, show_temperature: true, show_buttons: true, ...c };
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
    // vrai si l'état annonce une alarme : on / detected / texte « fumée »…
    _on(s, words = []) {
      if (!this._ok(s)) return false;
      const v = String(s.state).trim().toLowerCase();
      if (OFF_RE.test(v) || /^(no|not|pas|kein|nessun|ingen|geen|nu |нет|nema)\b/.test(v)) return false;
      return ON_RE.test(v) || words.some((w) => (w.length > 3 ? v.includes(w) : v === w)); // mots courts : égalité stricte
    }
    _time(iso) {
      const t = Date.parse(iso); if (!t) return '--';
      const d = new Date(t), loc = this._lang(), time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
      return d.toDateString() === new Date().toDateString() ? time : `${d.toLocaleDateString(loc, { day: 'numeric', month: 'short' })} ${time}`;
    }
    _call(id, pressLike) {
      if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const off = { switch: 'turn_off', siren: 'turn_off', input_boolean: 'turn_off', light: 'turn_off' };
      const [d, s] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'] }[dom]
        || (pressLike ? [dom, 'turn_on'] : off[dom] ? [dom, off[dom]] : ['homeassistant', 'turn_off']);
      this._hass.callService(d, s, { entity_id: id });
    }

    _compute() {
      const c = this._c;
      const sS = this._st(c.entity_smoke), coS = this._st(c.entity_co);
      const smoke = this._on(sS, SMOKE_WORDS);
      // CO : binary_sensor, ou capteur en ppm comparé à co_threshold
      const coPpm = this._num(coS), coNumeric = !isNaN(coPpm) && !/^binary_sensor\./.test(c.entity_co || '');
      const co = coNumeric ? coPpm >= Number(c.co_threshold) : this._on(coS, ['co', 'carbon', 'monoxy', 'gas', 'gaz']);
      const test = this._on(this._st(c.entity_test), ['test']) || /test/i.test(String(sS && sS.state));
      const fault = this._on(this._st(c.entity_fault), ['fault', 'error', 'défaut', 'tamper', 'problem']);
      // batterie : capteur en %, ou binary_sensor battery (on = faible)
      const bS = this._st(c.entity_battery), bat = this._num(bS);
      const batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const low = batBinary ? this._on(bS) : !isNaN(bat) && bat < Number(c.battery_low);
      const st = !this._ok(sS) && !this._ok(coS) ? 'unavailable' : smoke ? 'alarm' : co ? 'co' : test ? 'test' : fault ? 'fault' : low ? 'low_battery' : 'ok';
      return { st, sS, coS, coPpm, coNumeric, bS, bat, batBinary, low };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sdtitle"></div><div class="badge" id="sdbadge"></div></div>
        ${SVG(this._c.model, this._c.name || this._t('name'))}
        <div class="alert" id="sdalert"></div>
        <div class="ctl" id="sdctl"><button id="sdtest"><ha-icon icon="mdi:gesture-tap-button"></ha-icon><span></span></button><button class="red" id="sdmute"><ha-icon icon="mdi:volume-off"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity_smoke || this._c.entity_co));
      root.getElementById('sdtest').addEventListener('click', () => this._call(this._c.entity_test_button, true));
      root.getElementById('sdmute').addEventListener('click', () => this._call(this._c.entity_silence, false));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ since: c.entity_smoke, co_level: c.entity_co, battery: c.entity_battery, temperature: c.entity_temperature }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, sS, coS, coPpm, coNumeric, bS, bat, batBinary, low } = this._compute();
      card.className = st + (c.animations === false ? ' noanim' : '');
      r.getElementById('sdtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('sdbadge');
      badge.textContent = this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('sdalert');
      al.textContent = st === 'alarm' ? this._t('alarm_at').replace('{t}', this._time(sS.last_changed))
        : st === 'co' ? (coNumeric ? this._t('co_ppm').replace('{n}', String(Math.round(coPpm))) : this._t('co_detected'))
          : st === 'fault' ? this._t('fault_detail') : '';
      al.classList.toggle('on', !!al.textContent);

      // « Tester » hors alarme, « Couper l'alarme » seulement pendant une alarme
      const alarming = st === 'alarm' || st === 'co';
      const bt = r.getElementById('sdtest'), bm = r.getElementById('sdmute');
      bt.classList.toggle('hide', !c.entity_test_button || alarming);
      bm.classList.toggle('hide', !c.entity_silence || !alarming);
      bt.querySelector('span').textContent = this._t('test_button');
      bm.querySelector('span').textContent = this._t('silence');
      r.getElementById('sdctl').classList.toggle('hide', c.show_buttons === false || (bt.classList.contains('hide') && bm.classList.contains('hide')));

      const tS = this._st(c.entity_temperature), tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const temp = this._num(tS), tempV = tc ? tc.conv(temp, tS) : temp;
      const V = {
        since: [c.entity_smoke, this._ok(sS) ? this._time(sS.last_changed) : '--', '', ''],
        co_level: [coNumeric || c.entity_co, coNumeric ? String(Math.round(coPpm)) : this._t(this._ok(coS) ? (st === 'co' ? 'co_detected_short' : 'ok') : 'unavailable'), coNumeric ? 'ppm' : '', st === 'co' ? 'bad' : ''],
        battery: [c.entity_battery, batBinary ? this._t(low ? 'low' : 'ok') : isNaN(bat) ? '--' : String(Math.round(bat)), batBinary ? '' : '%', low ? 'warn' : ''],
        temperature: [c.entity_temperature, isNaN(tempV) ? '--' : (Math.round(tempV * 10) / 10).toLocaleString(this._lang()), tc ? tc.unit : '°C', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', cls === 'bad'); el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k === 'since' && st === 'alarm' ? 'alarm_tile' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSmokeDetectorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSmokeDetectorCardEditor extends HTMLElement {
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
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'cylinder', label: tr.model_cylinder }, { value: 'round', label: tr.model_round }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_smoke', ['binary_sensor', 'sensor', 'input_boolean', 'switch', 'event']),
        ent('entity_co', ['binary_sensor', 'sensor']),
        { name: 'co_threshold', default: 50, selector: { number: { min: 1, max: 1000, step: 1, mode: 'box', unit_of_measurement: 'ppm' } } },
        ent('entity_test', ['binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_test_button', ['button', 'input_button', 'script', 'switch']),
        ent('entity_silence', ['button', 'input_button', 'switch', 'siren', 'script', 'input_boolean']),
        ent('entity_fault', 'binary_sensor'),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_temperature', 'sensor'),
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_co'), bool('show_battery'), bool('show_temperature'), bool('show_buttons'), bool('animations')] },
      ].filter(Boolean);
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSmokeDetectorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: 'Détecteur de fumée animé (2 modèles) : alarme, CO, test, pile faible, défaut, boutons Tester et Couper l\'alarme.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/smoke-detector.md',
  });
})();
