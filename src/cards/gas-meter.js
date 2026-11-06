/* Carte « Compteur de gaz » — custom:appliance-gas-meter-card
 * Compteur à soufflet jaune : totalisateur (5 chiffres + 3 décimales rouges), flamme animée selon le débit,
 * roue de contrôle qui tourne. Tous les capteurs sont optionnels : index (m³, kWh, ft³… affiché dans l'unité
 * du capteur, sans conversion), débit, consommation du jour, coût, détecteur(s) de gaz / fuite, vanne d'arrêt.
 * Sans capteur de débit, le débit est déduit des variations de l'index (unité de l'index par heure).
 * entity_leak accepte une entité OU une liste : le bandeau nomme les détecteurs déclenchés.
 */
(() => {
  const TAG = 'appliance-gas-meter-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n gas_meter*/{};
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []); // entity_leak : string ou array → array
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--gm-ok:var(--appliance-ok-color,#43a047);--gm-gas:var(--appliance-gas-color,#f5a623);
  --gm-alert:var(--appliance-alert-color,#db4437);--spd:1s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.flowing .badge{background:color-mix(in srgb,var(--gm-gas) 22%,transparent);color:var(--gm-gas)}
.leak .badge{background:color-mix(in srgb,var(--gm-alert) 22%,transparent);color:var(--gm-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--gm-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer}
.ctl{display:flex;justify-content:center;margin-top:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.closed{background:color-mix(in srgb,var(--gm-alert) 20%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--gm-alert)}
/* ---- illustration ---- */
.gm-wheel{transform-box:fill-box;transform-origin:50% 50%}
.flowing .gm-wheel,.moving .gm-wheel{animation:gmrot var(--spd) linear infinite}
.gm-flame{transform-box:fill-box;transform-origin:50% 100%;opacity:.25;transition:opacity .4s}
.flowing .gm-flame,.moving .gm-flame{opacity:1;animation:gmflame calc(var(--spd) * .6) ease-in-out infinite alternate}
.gm-alert{opacity:0}.leak .gm-alert{opacity:1;animation:gmblink 1s ease-in-out infinite}
.gm-valve{fill:#2b9af9;transition:transform .4s,fill .3s;transform-box:fill-box;transform-origin:50% 100%}
.valve_closed .gm-valve{fill:#db4437;transform:rotate(90deg)}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .gm-wheel,.noanim .gm-flame,.noanim .gm-alert{animation:none}
@keyframes gmrot{to{transform:rotate(360deg)}}
@keyframes gmflame{from{transform:scale(.85,.9)}to{transform:scale(1.05,1.1)}}
@keyframes gmblink{50%{opacity:.3}}
`;

  const SVG = (label) => `<svg viewBox="0 22 120 104" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="gmsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="gmbody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffd54f"/><stop offset=".55" stop-color="#f2b705"/><stop offset="1" stop-color="#b78400"/></linearGradient>
    <linearGradient id="gmpipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#b6bec6"/><stop offset="1" stop-color="#7f8891"/></linearGradient>
    <radialGradient id="gmglass" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="120" rx="48" ry="5" fill="url(#gmsh)"/>
    <!-- tuyaux d'arrivée (gauche) et de départ (droite) -->
    <rect x="8" y="30" width="10" height="32" fill="url(#gmpipe)"/><rect x="102" y="30" width="10" height="32" fill="url(#gmpipe)"/>
    <rect x="5" y="26" width="16" height="6" rx="2" fill="#8d959e"/><rect x="99" y="26" width="16" height="6" rx="2" fill="#8d959e"/>
    <!-- vanne d'arrêt sur le tuyau d'arrivée -->
    <rect x="10.5" y="44" width="5" height="8" rx="1" fill="#8d959e"/><rect class="gm-valve" x="3" y="40" width="20" height="5" rx="2.5"/>
    <!-- corps du compteur -->
    <rect x="16" y="56" width="88" height="62" rx="9" fill="url(#gmbody)" stroke="#7a5a00" stroke-width="1"/>
    <rect x="22" y="62" width="76" height="22" rx="4" fill="#f4f7fb" stroke="#7a5a00" stroke-width=".6"/>
    <text x="28" y="70" font-size="4.4" fill="#7a5a00" font-family="sans-serif" font-weight="700">GAZ</text>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${28 + i * 8.4}" y="72" width="7.4" height="9" fill="#111"/><text class="gm-d" x="${(31.7 + i * 8.4).toFixed(1)}" y="79.2" text-anchor="middle" font-size="7.6" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    ${[0, 1, 2].map((i) => `<rect x="${71 + i * 7.6}" y="72" width="6.8" height="9" fill="#b71c1c"/><text class="gm-l" x="${(74.4 + i * 7.6).toFixed(1)}" y="79.2" text-anchor="middle" font-size="7.2" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <!-- roue de contrôle -->
    <circle cx="32" cy="101" r="9" fill="#fff" stroke="#7a5a00" stroke-width=".8"/>
    <g class="gm-wheel"><path d="M32 101v-7.5" stroke="#b71c1c" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="101" r="1.6" fill="#7a5a00"/></g>
    <!-- flamme -->
    <g class="gm-flame"><path d="M78 112c-9-6-11-13-6-22 1 4 3 5 5 6-1-6 1-11 6-15 0 6 3 8 5 12 3 6 1 14-10 19z" fill="#ff7a00"/><path d="M79 112c-5-3-6-8-3-13 1 2 2 3 3 3 0-3 1-5 3-7 0 3 2 5 3 7 1 5-2 8-6 10z" fill="#ffd54f"/></g>
    <rect x="22" y="62" width="76" height="56" rx="4" fill="url(#gmglass)" opacity=".5"/>
    <g class="gm-alert"><circle cx="100" cy="46" r="9" fill="#e53935"/><path d="M100 40v7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="100" cy="51" r="1.3" fill="#fff"/></g>
  </svg>`;

  const TILES = [['flow', 'mdi:fire', 'show_flow'], ['today', 'mdi:calendar-today', 'show_today'], ['index', 'mdi:counter', 'show_index'], ['cost', 'mdi:cash', 'show_cost']];

  class ApplianceGasMeterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), st = (i) => hass.states[i].attributes || {};
      return {
        entity_index: ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'gas' && st(i).state_class === 'total_increasing') || ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'gas') || '',
        entity_leak: ids.find((i) => i.startsWith('binary_sensor.') && st(i).device_class === 'gas') || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_flow: true, show_today: true, show_index: true, show_cost: true, flow_threshold: 0.01, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 20000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="gmtitle"></div><div class="badge" id="gmbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="gmalert"></div>
        <div class="ctl" id="gmctl"><button><ha-icon icon="mdi:valve"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_index || this._c.entity_flow));
      root.querySelector('#gmctl button').addEventListener('click', () => {
        const id = this._c.entity_valve; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        this._hass.callService(['switch', 'valve', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow || c.entity_index, today: c.entity_today, index: c.entity_index, cost: c.entity_cost }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, now = Date.now();
      const idx = this._num(c.entity_index);
      // débit : capteur dédié, sinon déduit de l'index (unité de l'index par heure)
      let flow = this._num(c.entity_flow);
      if (!c.entity_flow && !isNaN(idx)) {
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = now; this._dflow = 0; }
        else if (idx !== this._lastIdx) {
          const h = Math.max(.001, (now - this._lastAt) / 3600000);
          this._dflow = idx > this._lastIdx ? (idx - this._lastIdx) / h : 0;
          this._lastIdx = idx; this._lastAt = now;
        } else if (now - this._lastAt > 10 * 60000) this._dflow = 0;
        flow = this._dflow;
      }
      const moving = !isNaN(flow) && flow > (Number(c.flow_threshold) || 0);
      // détecteurs de gaz : un ou plusieurs ; « fuite » dès qu'au moins un est déclenché
      const leakIds = asList(c.entity_leak), leakS = leakIds.some((i) => this._st(i));
      const wet = leakIds.filter((i) => { const s = this._st(i); return !!s && /^(on|wet|leak|detected|gas|true)$/i.test(String(s.state)); });
      const valveS = this._st(c.entity_valve), valveClosed = !!valveS && /^(off|closed|closing)$/i.test(String(valveS.state));
      const anyId = [c.entity_index, c.entity_flow, c.entity_today].filter(Boolean);
      const usable = anyId.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      const st = !usable && !leakS ? 'unavailable' : wet.length ? 'leak' : valveClosed ? 'valve_closed' : moving ? 'flowing' : 'idle';
      return { st, idx, flow, moving, wet, valveS, valveClosed };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, idx, flow, moving, wet, valveS, valveClosed } = this._compute();
      card.className = `${st}${moving ? ' moving' : ''}${c.animations === false ? ' noanim' : ''}`;
      // vitesse de la roue et de la flamme : plus le débit est fort, plus elles vont vite (bornée)
      card.style.setProperty('--spd', `${Math.max(.3, Math.min(4, 1.2 / Math.max(.05, flow || 0))).toFixed(2)}s`);
      // totalisateur : 5 chiffres entiers et 3 décimales
      const base = isNaN(idx) ? 0 : Math.max(0, idx), whole = Math.floor(base);
      const ent = String(whole % 100000).padStart(5, '0'), dec = String(Math.floor((base - whole) * 1000)).padStart(3, '0');
      r.querySelectorAll('.gm-d').forEach((el, i) => { el.textContent = ent[i]; });
      r.querySelectorAll('.gm-l').forEach((el, i) => { el.textContent = dec[i]; });

      const iu = this._unit(c.entity_index, 'm³'), fu = this._unit(c.entity_flow, `${iu}/h`);
      r.getElementById('gmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('gmbadge');
      badge.textContent = st === 'flowing' ? `${this._fmt(flow, 2)} ${fu}` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('gmalert');
      const names = wet.map((i) => this._st(i)?.attributes?.friendly_name || i).join(', ');
      al.textContent = wet.length ? (names ? this._t('leak_detected_by').replace('{n}', names) : this._t('leak_detected')) : '';
      al.classList.toggle('on', !!al.textContent);

      const ctl = r.getElementById('gmctl'), btn = ctl.querySelector('button');
      ctl.classList.toggle('hide', !c.entity_valve);
      btn.classList.toggle('closed', valveClosed);
      btn.querySelector('span').textContent = this._t(valveClosed ? 'open_valve' : 'close_valve');
      btn.disabled = !valveS;

      const V = {
        flow: [c.entity_flow || c.entity_index, isNaN(flow) ? '--' : this._fmt(flow, 2), fu],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 2), this._unit(c.entity_today, iu)],
        index: [c.entity_index, this._fmt(idx, 3), iu],
        cost: [c.entity_cost, this._fmt(this._num(c.entity_cost), 2), this._unit(c.entity_cost, '€')],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'flow' && st === 'leak');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceGasMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceGasMeterCardEditor extends HTMLElement {
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
      const ent = (name, domain, extra) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(extra || {}) } } });
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = { ...this._c, entity_leak: asList(this._c && this._c.entity_leak) }; // le form attend un array
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_index', 'sensor'), ent('entity_flow', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']),
        ent('entity_leak', ['binary_sensor', 'input_boolean'], { multiple: true }), ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        { type: 'grid', name: '', schema: [num('flow_threshold', 0, 5, 0.01, 0.01)] },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_flow'), bool('show_today'), bool('show_index'), bool('show_cost'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceGasMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Compteur de gaz animé : totalisateur, débit, consommation du jour, coût, détecteur(s) de gaz et vanne d'arrêt.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
