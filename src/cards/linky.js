/* ================================================================== */
/* appliance-linky-card.js                                          */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-linky-card — compteur Linky animé (écran LCD, jauge vs puissance souscrite, index HP/HC)
 * type: custom:appliance-linky-card
 */
const I18N_LINKY = /*@i18n linky*/{};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
// Aiguilles L1 / L2 / L3 (mode « needles ») : couleurs distinctes du vert / orange / rouge de la jauge
const PHASE_COLORS = ['#1e88e5', '#8e24aa', '#00897b'];

class ApplianceLinkyCard extends HTMLElement {
  static getStubConfig(hass) {
    // entités Linky (intégrations Linky / téléinfo) : puissance apparente, index HP / HC
    const ids = Object.keys((hass && hass.states) || {}).filter((i) => i.startsWith('sensor.') && /linky|teleinfo|tic/i.test(i));
    const f = (re) => ids.find((i) => re.test(i)) || '';
    return { entity_power: f(/sinst|papp|puissance|power/i), entity_hp: f(/hchp|_hp|pleine|peak/i), entity_hc: f(/hchc|_hc|creuse|offpeak/i), subscribed_power: 9, hc_ranges: '01:00-07:00,12:30-14:30' };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_active_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { type: 'grid', name: '', schema: [
          { name: 'entity_power_l1', selector: { entity: { domain: 'sensor' } } },
          { name: 'entity_power_l2', selector: { entity: { domain: 'sensor' } } },
          { name: 'entity_power_l3', selector: { entity: { domain: 'sensor' } } },
        ] },
        { name: 'phase_gauge', selector: { select: { mode: 'dropdown', options: ['needles', 'cycle', 'max'] } }, default: 'needles' },
        { name: 'entity_hp', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_hc', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        // Plusieurs index de soutirage (Tempo : 6, semaine/week-end : 4…) : [{ entity, name }], remplace HP/HC
        { name: 'indexes', selector: { object: {} } },
        { name: 'entity_injection', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_power_injection', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_tariff', selector: { entity: { domain: ['sensor', 'select'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'subscribed_power', selector: { number: { min: 3, max: 36, step: 1, mode: 'box', unit_of_measurement: 'kVA' } } },
        { name: 'hc_ranges', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          { name: 'show_gauge', selector: { boolean: {} }, default: true },
          { name: 'show_phases', selector: { boolean: {} }, default: true },
          { name: 'show_index', selector: { boolean: {} }, default: true },
          { name: 'show_injection', selector: { boolean: {} }, default: true },
          { name: 'show_tariff', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_LINKY) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = {
      show_gauge: true, show_phases: true, show_index: true, show_injection: true, show_tariff: true, show_cost: true,
      phase_gauge: 'needles', subscribed_power: 9, hc_ranges: '', ...config,
    };
    this._built = false;
    this._build();
  }

  set hass(hass) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(hass));
    if (l && l !== this._lng) { this._lng = l; this._hass = hass; this._built = false; this._build(); }
    this._hass = hass; this._update(); }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_LINKY[this._config.language || lang(this._hass)] || I18N_LINKY.en)[k] ?? I18N_LINKY.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  connectedCallback() {
    // Défilement des pages de l'écran LCD toutes les 3 s (et des phases, en mode jauge « cycle »)
    this._timer = setInterval(() => {
      this._page = (this._page || 0) + 1; this._renderLcd();
      this._cycle = (this._cycle || 0) + 1;
      if (this._tri && this._config.phase_gauge === 'cycle') this._update();
      const b = this.shadowRoot && this.shadowRoot.getElementById('b2');
      if (b) { b.classList.add('press'); setTimeout(() => b.classList.remove('press'), 250); }
    }, 3000);
  }
  disconnectedCallback() { clearInterval(this._timer); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const ticks = Array.from({ length: 21 }, (_, i) => {
      const a = (-180 + i * 9) * Math.PI / 180, r1 = 78, r2 = i % 5 === 0 ? 68 : 72;
      return `<line x1="${100 + r1 * Math.cos(a)}" y1="${100 + r1 * Math.sin(a)}" x2="${100 + r2 * Math.cos(a)}" y2="${100 + r2 * Math.sin(a)}" stroke="#8a99a8" stroke-width="1.5"/>`;
    }).join('');
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; }
      .title { font-weight:600; margin:0 4px 10px; }
      .wrap { display:flex; gap:14px; align-items:center; flex-wrap:wrap; justify-content:center; }
      /* Boîtier : coque vert anis, cadre blanc, écran LCD vert sombre, 2 boutons, croix en bas */
      /* illustration_size : le compteur (HTML) est agrandi d'un bloc avec zoom */
      .box { zoom:var(--illus-scale,1); width:150px; background:linear-gradient(160deg,#d4ea35,#b5d11c); border-radius:10px; padding:16px 14px 14px;
        box-shadow:0 3px 10px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.35); position:relative; }
      .eye { width:8px; height:8px; background:#1d2a05; border-radius:2px; margin:-6px auto 8px; }
      .bezel { background:linear-gradient(#f7f7f7,#dcdcdc); border-radius:12px; padding:10px 9px 8px; box-shadow:inset 0 0 0 1px #c9c9c9; }
      .lcd { background:#1f4d2a; border-radius:3px; padding:8px 6px; min-height:66px; text-align:center; position:relative; overflow:hidden;
        box-shadow:inset 0 0 8px rgba(0,0,0,.7); font-family:'Courier New',monospace; color:#b9f08a; display:flex; flex-direction:column; justify-content:center; }
      .lcd::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 1px,transparent 1px 3px); pointer-events:none; }
      .lcd .lab { font-size:.58em; letter-spacing:.08em; opacity:.85; }
      .lcd .val { font-size:1.25em; font-weight:700; text-shadow:0 0 6px rgba(185,240,138,.6); animation:fadein .5s; }
      .btns { display:flex; gap:6px; margin-top:8px; justify-content:center; }
      .btn { width:44px; height:12px; border-radius:3px; background:linear-gradient(#fff,#d2d2d2); border:1px solid #b0b0b0; cursor:pointer; padding:0; transition:transform .1s; }
      .btn:active, .btn.press { transform:translateY(1px); background:#c8c8c8; }
      .plus { text-align:center; font-size:20px; line-height:1; color:#3b4a08; margin-top:12px; font-weight:300; }
      .leds { display:flex; justify-content:center; gap:14px; margin-top:8px; font-size:.55em; letter-spacing:.06em; color:#3b4a08; }
      .led { width:9px; height:9px; border-radius:50%; background:#5a2a2a; margin:0 auto 2px; }
      .led.conso { background:#ff3b30; box-shadow:0 0 8px #ff3b30; animation:pulse var(--pulse,2s) infinite; }
      .led.hc { background:#ffb300; box-shadow:0 0 8px #ffb300; } .led.hp { background:#f4511e; box-shadow:0 0 8px #f4511e; }
      .led.prod { background:#2a4a2a; } .led.prod.on { background:#43a047; box-shadow:0 0 8px #43a047; }
      .gauge { flex:1; min-width:calc(170px * min(var(--illus-scale,1),1)); max-width:calc(260px * var(--illus-scale,1)); }
      .gauge svg { width:100%; display:block; transform:scale(0.8); transform-origin:top center; }
      .arc-bg { fill:none; stroke:rgba(127,127,127,.25); stroke-width:12; stroke-linecap:round; }
      .arc { fill:none; stroke:var(--gc,#43a047); stroke-width:12; stroke-linecap:round; transition:stroke-dashoffset 1s ease, stroke .6s; }
      .needle { transform-origin:100px 100px; transition:transform 1s cubic-bezier(.3,1.4,.5,1); stroke:var(--primary-text-color,#223); stroke-width:3; stroke-linecap:round; }
      .gtxt { text-anchor:middle; font-size:15px; font-weight:700; fill:var(--primary-text-color,#223); }
      .gsub { text-align:center; font-size:.7em; opacity:.65; }
      .gact { text-align:center; font-size:.8em; font-weight:600; margin-top:2px; }
      /* Triphasé : une barre par phase, pleine à 1/3 de la puissance souscrite */
      .phases { margin-top:6px; display:grid; grid-template-columns:auto 1fr auto; gap:3px 6px; align-items:center; font-size:.7em; }
      .phases .bar { height:6px; border-radius:3px; background:rgba(127,127,127,.25); overflow:hidden; }
      .phases .bar i { display:block; height:100%; width:0; border-radius:3px; background:#43a047; transition:width 1s ease, background .6s; }
      .phases .pv { text-align:right; font-variant-numeric:tabular-nums; opacity:.8; }
      .phases .cur { font-weight:700; }
      .needle.pn { stroke-width:2.5; }
      .over .arc { animation:pulse .6s infinite; }
      .badge { text-align:center; font-size:.8em; font-weight:700; margin-top:4px; color:#e53935; display:none; }
      .over .badge { display:block; animation:pulse .6s infinite; }
      @keyframes pulse { 50% { opacity:.25 } }
      @keyframes fadein { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:none } }
    </style>
    <ha-card id="meter">
      <div class="title" id="name">${esc(this._config.name || this._t('name'))}</div>
      <div class="wrap">
        <div class="box">
          <div class="eye"></div>
          <div class="bezel">
            <div class="lcd"><div class="lab" id="lab"></div><div class="val" id="val"></div></div>
            <div class="btns"><button class="btn" id="b1" aria-label="-"></button><button class="btn" id="b2" aria-label="+"></button></div>
          </div>
          <div class="plus">+</div>
          <div class="leds"><div><div class="led conso" id="ledc"></div>${this._t('conso')}</div><div><div class="led hp" id="ledt"></div><span id="ledtl">HP</span></div><div id="ledpw" style="display:none"><div class="led prod" id="ledp"></div>${this._t('prod')}</div></div>
        </div>
        <div class="gauge" id="gaugebox">
          <svg viewBox="0 0 200 120">
            <path class="arc-bg" d="M20 100 A80 80 0 0 1 180 100"/>
            <path class="arc" id="arc" d="M20 100 A80 80 0 0 1 180 100" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
            ${ticks}
            <line class="needle" id="needle" x1="100" y1="100" x2="100" y2="32" style="transform:rotate(-90deg)"/>
            ${PHASE_COLORS.map((col, i) => `<line class="needle pn" id="n${i + 1}" x1="100" y1="100" x2="100" y2="${32 + i * 8}" style="stroke:${col};transform:rotate(-90deg);display:none"/>`).join('')}
            <circle cx="100" cy="100" r="6" fill="var(--primary-text-color,#223)"/>
            <text class="gtxt" x="100" y="118" id="gtxt"></text>
          </svg>
          <div class="gsub" id="gsub"></div>
          <div class="gact" id="gact"></div>
          <div class="phases" id="phases">${[1, 2, 3].map((i) =>
            `<span id="phl${i}">L${i}</span><div class="bar"><i id="ph${i}"></i></div><span class="pv" id="phv${i}"></span>`).join('')}</div>
          <div class="badge">${this._t('alert')}</div>
        </div>
      </div>
    </ha-card>`;
    const flip = (d) => () => { this._page = (this._page || 0) + d; this._renderLcd(); };
    this.shadowRoot.getElementById('b1').onclick = flip(-1);
    this.shadowRoot.getElementById('b2').onclick = flip(1);
    // clic : écran → entité de la page affichée, jauge → puissance, barre de phase → puissance de la phase
    const sr = this.shadowRoot, c0 = this._config, more = (id) => window.applianceMore(this, id);
    const lcd = sr.querySelector('.lcd'); lcd.style.cursor = 'pointer'; lcd.onclick = () => more(this._pageId);
    const g = sr.getElementById('gaugebox').querySelector('svg'); g.style.cursor = 'pointer';
    g.onclick = () => more(c0.entity_power || c0.entity_active_power || c0.entity_power_l1);
    [1, 2, 3].forEach((i) => ['phl', 'phv'].forEach((k) => { const e = sr.getElementById(`${k}${i}`); e.style.cursor = 'pointer'; e.onclick = () => more(c0[`entity_power_l${i}`]); }));
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  // Puissance en W ou VA (kW / kVA convertis), avec l'unité du capteur
  _power(id) {
    const v = this._num(id);
    if (v === null) return null;
    const u = this._hass.states[id].attributes.unit_of_measurement || 'W';
    return { v: /^k/i.test(u) ? v * 1000 : v, unit: /va/i.test(u) ? 'VA' : 'W' };
  }

  // Index en kWh (Wh / MWh convertis) : les modules TIC remontent souvent les index en Wh
  _kwh(id) {
    const v = this._num(id);
    if (v === null) return null;
    const u = this._hass.states[id].attributes.unit_of_measurement || 'kWh';
    return /^wh$/i.test(u) ? v / 1000 : /^mwh$/i.test(u) ? v * 1000 : v;
  }

  // Index de soutirage : liste « indexes » ([{ entity, name }] ou identifiants seuls), sinon HP / HC
  _indexes() {
    const c = this._config;
    if (Array.isArray(c.indexes) && c.indexes.length) {
      return c.indexes.map((it) => {
        const id = typeof it === 'string' ? it : it && it.entity, st = id && this._hass.states[id];
        const name = (it && it.name) || (st && st.attributes.friendly_name) || id || '';
        return [String(name).toUpperCase(), this._kwh(id), id];
      });
    }
    return [[this._l('hp'), this._kwh(c.entity_hp), c.entity_hp], [this._l('hc'), this._kwh(c.entity_hc), c.entity_hc]];
  }

  // Heures creuses : entité tarif si fournie, sinon plages "HH:MM-HH:MM,..."
  _isHC() {
    const c = this._config;
    if (c.entity_tariff && this._hass.states[c.entity_tariff]) {
      return /hc|creuse|off|low/i.test(this._hass.states[c.entity_tariff].state);
    }
    const now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    return String(c.hc_ranges).split(',').some((r) => {
      const [a, b] = r.trim().split('-'); if (!a || !b) return false;
      const f = (x) => { const [h, mi] = x.split(':').map(Number); return h * 60 + (mi || 0); };
      const s = f(a), e = f(b);
      return s <= e ? m >= s && m < e : m >= s || m < e;
    });
  }

  _renderLcd() {
    if (!this._built || !this._data) return;
    const d = this._data, c = this._config, pages = [];
    pages.push([this._l('power'), d.power === null ? '—' : `${Math.round(d.power)} ${d.unit}`, c.entity_power || c.entity_active_power]);
    if (c.entity_active_power) pages.push([this._l('active'), d.active === null ? '—' : `${Math.round(d.active.v)} ${d.active.unit}`, c.entity_active_power]);
    const kwh = (v) => (v === null ? '—' : `${Math.round(v)} kWh`);
    if (c.show_index) d.indexes.forEach(([lab, v, id]) => pages.push([lab, kwh(v), id]));
    if (c.show_injection) {
      if (c.entity_power_injection) pages.push([this._l('injection_power'), d.injPower === null ? '—' : `${Math.round(d.injPower.v)} ${d.injPower.unit}`, c.entity_power_injection]);
      if (c.entity_injection) pages.push([this._l('injection'), kwh(d.injection), c.entity_injection]);
    }
    if (c.show_tariff) pages.push([this._l('tariff'), this._t(d.hcNow ? 'offpeak' : 'peak'), c.entity_tariff]);
    if (c.show_cost && d.cost !== null) pages.push([this._l('cost'), `${d.cost.toFixed(2)} €`, c.entity_cost]);
    const p = pages[(this._page || 0) % pages.length];
    this._pageId = p[2]; // entité de la page affichée : ouverte par un clic sur l'écran
    const lab = this.shadowRoot.getElementById('lab'), val = this.shadowRoot.getElementById('val');
    lab.textContent = p[0];
    // On ne relance le fondu que si la page affichée change (pas à chaque mise à jour d'état)
    const key = p[0];
    val.textContent = p[1];
    if (this._lastKey !== key) { this._lastKey = key; val.style.animation = 'none'; void val.offsetWidth; val.style.animation = ''; }
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, root = this.shadowRoot;
    const pState = c.entity_power && this._hass.states[c.entity_power];
    let unit = (pState && pState.attributes.unit_of_measurement) || 'W';
    let power = this._num(c.entity_power);
    const indexes = this._indexes();
    const hcNow = this._isHC();
    let cost = this._num(c.entity_cost);
    const active = this._power(c.entity_active_power);
    const injPower = this._power(c.entity_power_injection), injection = this._kwh(c.entity_injection);

    // Jauge : puissance (W ou VA, kW ou kVA) / puissance souscrite (kVA × 1000).
    // Le Linky donne la puissance apparente en VA : on garde l'unité du capteur.
    // En triphasé, il coupe phase par phase à 1/3 de la souscription. Selon phase_gauge :
    // « needles » une aiguille par phase, « cycle » L1 → L2 → L3 toutes les 3 s,
    // « max » la phase la plus chargée. L'alerte suit toujours la phase la plus chargée.
    const max = c.subscribed_power * 1000, phaseMax = max / 3;
    const phases = [c.entity_power_l1, c.entity_power_l2, c.entity_power_l3].map((id) => this._power(id));
    const tri = phases.some(Boolean), mode = ['cycle', 'max'].includes(c.phase_gauge) ? c.phase_gauge : 'needles';
    const pr = (p) => (p ? Math.min(p.v / phaseMax, 1) : 0);
    this._tri = tri;
    let ratio, alertRatio, gtxt, shown = -1;
    if (tri) {
      const worst = phases.reduce((w, p, i) => (p && (w < 0 || p.v > phases[w].v) ? i : w), -1);
      const avail = phases.map((p, i) => (p ? i : -1)).filter((i) => i >= 0);
      shown = mode === 'cycle' ? avail[(this._cycle || 0) % avail.length] : worst;
      ratio = pr(phases[shown]); alertRatio = pr(phases[worst]);
      gtxt = `L${shown + 1} · ${Math.round(phases[shown].v)} ${phases[shown].unit}`;
      if (power === null) { power = phases.reduce((s, p) => s + (p ? p.v : 0), 0); unit = phases[worst].unit; }
    } else {
      const gaugeUnit = /va/i.test(unit) ? 'VA' : 'W';
      const base = power === null ? 0 : (/^k/i.test(unit) ? power * 1000 : power);
      ratio = alertRatio = Math.min(base / max, 1);
      gtxt = power === null ? '—' : `${Math.round(base)} ${gaugeUnit}`;
    }
    this._data = { power, unit, active, indexes, hcNow, cost, injPower, injection };
    const colorOf = (r) => (r > 0.9 ? '#e53935' : r > 0.65 ? '#fb8c00' : '#43a047');
    const needles = tri && mode === 'needles';
    root.getElementById('arc').style.strokeDashoffset = 251.3 * (1 - ratio);
    root.getElementById('needle').style.transform = `rotate(${-90 + ratio * 180}deg)`;
    root.getElementById('needle').style.display = needles ? 'none' : '';
    phases.forEach((p, i) => {
      const n = root.getElementById(`n${i + 1}`);
      n.style.display = needles && p ? '' : 'none';
      n.style.transform = `rotate(${-90 + pr(p) * 180}deg)`;
      const lab = root.getElementById(`phl${i + 1}`);
      lab.style.color = needles ? PHASE_COLORS[i] : '';
      lab.classList.toggle('cur', tri && mode === 'cycle' && i === shown);
    });
    root.getElementById('gaugebox').style.setProperty('--gc', colorOf(ratio));
    root.getElementById('gtxt').textContent = gtxt;
    root.getElementById('gsub').textContent = `${this._t('subscribed')} : ${c.subscribed_power} kVA`
      + (tri ? ` · ${+(c.subscribed_power / 3).toFixed(1)} kVA ${this._t('per_phase')}` : '');
    const gact = root.getElementById('gact');
    gact.textContent = active ? `${this._t('active_short')} : ${Math.round(active.v)} ${active.unit}` : '';
    gact.style.display = active ? '' : 'none';
    root.getElementById('phases').style.display = tri && c.show_phases ? '' : 'none';
    phases.forEach((p, i) => {
      const r = p ? Math.min(p.v / phaseMax, 1) : 0, bar = root.getElementById(`ph${i + 1}`);
      bar.style.width = `${(r * 100).toFixed(1)}%`;
      bar.style.background = colorOf(r);
      root.getElementById(`phv${i + 1}`).textContent = p ? `${Math.round(p.v)} ${p.unit}` : '—';
    });
    root.getElementById('gaugebox').style.display = c.show_gauge ? '' : 'none';
    root.getElementById('meter').classList.toggle('over', alertRatio > 0.95);

    // LED conso : clignote plus vite quand la puissance monte (2 s → 0.25 s)
    root.getElementById('ledc').style.setProperty('--pulse', `${(2 - alertRatio * 1.75).toFixed(2)}s`);
    const ledt = root.getElementById('ledt');
    ledt.className = `led ${hcNow ? 'hc' : 'hp'}`;
    root.getElementById('ledtl').textContent = hcNow ? 'HC' : 'HP';
    // LED prod : allumée quand le compteur voit de l'énergie partir vers le réseau
    root.getElementById('ledpw').style.display = c.entity_power_injection && c.show_injection ? '' : 'none';
    root.getElementById('ledp').classList.toggle('on', !!injPower && injPower.v > 0);
    this._renderLcd();
  }
}

define('appliance-linky-card', ApplianceLinkyCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-linky-card', name: 'Appliance – Linky', description: 'Compteur Linky animé : LCD, jauge, index HP/HC', preview: true });
})();
