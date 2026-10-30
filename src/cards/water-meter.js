/* Carte « Compteur d'eau » — custom:appliance-water-meter-card
 * Compteur laiton à cadran bleu : totalisateur m³ (noir) + litres (rouge), étoile de débit qui tourne
 * selon le débit, eau qui circule dans les tuyaux. Tous les capteurs sont optionnels :
 * index (m³, L, gal, ft³), débit (L/min, L/h, m³/h, gal/min…), consommation du jour, coût,
 * détecteur de fuite, vanne d'arrêt. Sans capteur de débit, le débit est déduit des variations de l'index.
 * Sans détecteur de fuite : « fuite possible » si l'eau coule sans interruption plus de leak_minutes.
 */
(() => {
  const TAG = 'appliance-water-meter-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n water_meter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // conversion en litres (volume) et en L/min (débit) selon l'unité du capteur
  const VOL = { 'm³': 1000, m3: 1000, 'l': 1, 'litre': 1, 'liter': 1, 'litres': 1, 'liters': 1, 'gal': 3.78541, 'ft³': 28.3168, ft3: 28.3168, 'ccf': 2831.68, 'dm³': 1 };
  const FLOW = { 'l/min': 1, 'l/h': 1 / 60, 'l/s': 60, 'm³/h': 1000 / 60, 'm3/h': 1000 / 60, 'm³/min': 1000, 'gal/min': 3.78541, 'gpm': 3.78541, 'gal/h': 3.78541 / 60, 'ft³/min': 28.3168 };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--wm-ok:var(--appliance-ok-color,#43a047);--wm-cold:var(--appliance-cold-color,#2b9af9);
  --wm-alert:var(--appliance-alert-color,#db4437);--spd:1s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.flowing .badge{background:color-mix(in srgb,var(--wm-cold) 22%,transparent);color:var(--wm-cold)}
.leak .badge{background:color-mix(in srgb,var(--wm-alert) 22%,transparent);color:var(--wm-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--wm-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer}
.ctl{display:flex;justify-content:center;margin-top:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.closed{background:color-mix(in srgb,var(--wm-alert) 20%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--wm-alert)}
/* ---- illustration ---- */
.wm-star{transform-box:fill-box;transform-origin:50% 50%}
.flowing .wm-star,.leak.moving .wm-star{animation:wmrot var(--spd) linear infinite}
.wm-flow{fill:none;stroke:#3ba7ff;stroke-width:3;stroke-dasharray:4 5;opacity:0;transition:opacity .4s}
.flowing .wm-flow,.leak.moving .wm-flow{opacity:1;animation:wmflow calc(var(--spd) * .8) linear infinite}
.wm-alert{opacity:0}.leak .wm-alert{opacity:1;animation:wmblink 1s ease-in-out infinite}
.wm-valve{fill:#2b9af9;transition:transform .4s,fill .3s;transform-box:fill-box;transform-origin:50% 100%}
.valve_closed .wm-valve{fill:#db4437;transform:rotate(90deg)}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .wm-star,.noanim .wm-flow,.noanim .wm-alert{animation:none}
@keyframes wmrot{to{transform:rotate(360deg)}}
@keyframes wmflow{to{stroke-dashoffset:-9}}
@keyframes wmblink{50%{opacity:.3}}
`;

  const SVG = (label) => `<svg viewBox="0 22 120 104" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="wmsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="wmbrass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#f3d68b"/><stop offset=".45" stop-color="#c9973f"/><stop offset="1" stop-color="#8a6324"/></linearGradient>
    <linearGradient id="wmpipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#b6bec6"/><stop offset="1" stop-color="#7f8891"/></linearGradient>
    <radialGradient id="wmglass" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="120" rx="52" ry="5" fill="url(#wmsh)"/>
    <rect x="0" y="80" width="30" height="14" fill="url(#wmpipe)"/><rect x="90" y="80" width="30" height="14" fill="url(#wmpipe)"/>
    <path class="wm-flow" d="M0 87h30M90 87h30"/>
    <!-- vanne d'arrêt sur le tuyau d'arrivée -->
    <rect x="8" y="76" width="8" height="6" rx="1" fill="#8d959e"/><rect class="wm-valve" x="4" y="70" width="16" height="5" rx="2.5"/>
    <rect x="24" y="76" width="10" height="22" rx="2" fill="url(#wmbrass)"/><rect x="86" y="76" width="10" height="22" rx="2" fill="url(#wmbrass)"/>
    <circle cx="60" cy="72" r="38" fill="url(#wmbrass)" stroke="#7a5520" stroke-width="1"/>
    <circle cx="60" cy="72" r="32" fill="#1f6fbf"/><circle cx="60" cy="72" r="29" fill="#f4f7fb"/>
    <text x="60" y="56" text-anchor="middle" font-size="5" fill="#1f6fbf" font-family="sans-serif" font-weight="700">m³</text>
    <rect x="36" y="60" width="48" height="10" rx="1.5" fill="#20252b"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${37 + i * 6.6}" y="61" width="5.8" height="8" fill="#111"/><text class="wm-d" x="${(39.9 + i * 6.6).toFixed(1)}" y="67.6" text-anchor="middle" font-size="7" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <rect x="52" y="72" width="22" height="9" rx="1.5" fill="#20252b"/>
    ${[0, 1, 2].map((i) => `<rect x="${53 + i * 7}" y="73" width="6" height="7" fill="#b71c1c"/><text class="wm-l" x="${56 + i * 7}" y="79" text-anchor="middle" font-size="6.4" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <text x="76" y="79" font-size="4" fill="#b71c1c" font-family="sans-serif">L</text>
    <g class="wm-star"><circle cx="46" cy="86" r="5" fill="#fff" stroke="#b71c1c" stroke-width=".6"/>${[0, 1, 2, 3, 4, 5].map((k) => `<path d="M46 86l${(4.4 * Math.cos(k * Math.PI / 3)).toFixed(2)} ${(4.4 * Math.sin(k * Math.PI / 3)).toFixed(2)}" stroke="#b71c1c" stroke-width="1.6"/>`).join('')}</g>
    <circle cx="70" cy="90" r="4.6" fill="#fff" stroke="#9aa2ab" stroke-width=".5"/><path class="wm-star" d="M70 90v-3.6" stroke="#b71c1c" stroke-width="1"/>
    <circle cx="60" cy="72" r="29" fill="url(#wmglass)"/>
    <g class="wm-alert"><circle cx="96" cy="40" r="9" fill="#e53935"/><path d="M96 34v7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="96" cy="45" r="1.3" fill="#fff"/></g>
  </svg>`;

  const TILES = [['flow', 'mdi:water-pump', 'show_flow'], ['today', 'mdi:water', 'show_today'], ['index', 'mdi:counter', 'show_index'], ['cost', 'mdi:cash', 'show_cost']];

  class ApplianceWaterMeterCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), st = (i) => hass.states[i].attributes || {};
      const water = (i) => /(eau|water|wasser|compteur|meter)/i.test(i);
      return {
        entity_index: ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'water' && st(i).state_class === 'total_increasing') || ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'water') || '',
        entity_flow: ids.find((i) => i.startsWith('sensor.') && water(i) && /(flow|debit|débit|rate)/i.test(i)) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_flow: true, show_today: true, show_index: true, show_cost: true, leak_minutes: 60, flow_threshold: 0.05, ...c };
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
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    // volume en litres et débit en L/min, quelle que soit l'unité du capteur
    _liters(id, d = 'm³') { const v = this._num(id); return isNaN(v) ? NaN : v * (VOL[this._unit(id, d).toLowerCase()] ?? 1); }
    _lpm(id) { const v = this._num(id); return isNaN(v) ? NaN : v * (FLOW[this._unit(id, 'L/min').toLowerCase().replace('litre', 'l').replace('liter', 'l')] ?? 1); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _vol(l) { return isNaN(l) ? ['--', 'L'] : l >= 10000 ? [this._fmt(l / 1000, 1), 'm³'] : [this._fmt(l, 0), 'L']; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="wmtitle"></div><div class="badge" id="wmbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="wmalert"></div>
        <div class="ctl" id="wmctl"><button><ha-icon icon="mdi:valve"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity_index || this._c.entity_flow));
      root.querySelector('#wmctl button').addEventListener('click', () => {
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
      const idx = this._liters(c.entity_index);
      // débit : capteur dédié, sinon déduit de l'index (litres écoulés depuis le dernier changement)
      let flow = this._lpm(c.entity_flow);
      if (!c.entity_flow && !isNaN(idx)) {
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = now; this._dflow = 0; }
        else if (idx !== this._lastIdx) {
          const min = Math.max(.1, (now - this._lastAt) / 60000);
          this._dflow = idx > this._lastIdx ? (idx - this._lastIdx) / min : 0;
          this._lastIdx = idx; this._lastAt = now;
        } else if (now - this._lastAt > 3 * 60000) this._dflow = 0;
        flow = this._dflow;
      }
      const thr = Number(c.flow_threshold) || 0;
      const moving = !isNaN(flow) && flow > thr;
      // écoulement continu : depuis quand l'eau coule sans interruption
      if (moving) { if (!this._flowSince) this._flowSince = now; } else this._flowSince = 0;
      const leakS = this._st(c.entity_leak);
      const leakSensor = !!leakS && /^(on|wet|leak|detected|true)$/i.test(String(leakS.state));
      const leakLong = moving && this._flowSince && now - this._flowSince > Number(c.leak_minutes) * 60000 && Number(c.leak_minutes) > 0;
      const valveS = this._st(c.entity_valve), valveClosed = !!valveS && /^(off|closed|closing)$/i.test(String(valveS.state));
      const anyId = [c.entity_index, c.entity_flow, c.entity_today].filter(Boolean);
      const usable = anyId.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      let st = !usable && !leakS ? 'unavailable' : leakSensor || leakLong ? 'leak' : valveClosed ? 'valve_closed' : moving ? 'flowing' : 'idle';
      return { st, idx, flow, moving, leakSensor, leakLong, valveS, valveClosed };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, idx, flow, moving, leakSensor, leakLong, valveS, valveClosed } = this._compute();
      card.className = `${st}${moving ? ' moving' : ''}${c.animations === false ? ' noanim' : ''}`;
      // vitesse de l'étoile : un tour par seconde à 6 L/min, bornée
      card.style.setProperty('--spd', `${Math.max(.15, Math.min(4, 6 / Math.max(.1, flow || 0))).toFixed(2)}s`);
      // totalisateur : 5 chiffres de m³ et 3 chiffres de litres
      const L = isNaN(idx) ? 0 : Math.max(0, Math.floor(idx));
      const m3 = String(Math.floor(L / 1000) % 100000).padStart(5, '0'), li = String(L % 1000).padStart(3, '0');
      r.querySelectorAll('.wm-d').forEach((el, i) => { el.textContent = m3[i]; });
      r.querySelectorAll('.wm-l').forEach((el, i) => { el.textContent = li[i]; });

      r.getElementById('wmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('wmbadge');
      badge.textContent = st === 'flowing' ? `${this._fmt(flow, 1)} L/min` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('wmalert');
      al.textContent = leakSensor ? this._t('leak_detected') : leakLong ? this._t('leak_continuous').replace('{n}', String(c.leak_minutes)) : '';
      al.classList.toggle('on', !!al.textContent);

      const ctl = r.getElementById('wmctl'), btn = ctl.querySelector('button');
      ctl.classList.toggle('hide', !c.entity_valve);
      btn.classList.toggle('closed', valveClosed);
      btn.querySelector('span').textContent = this._t(valveClosed ? 'open_valve' : 'close_valve');
      btn.disabled = !valveS;

      const today = this._liters(c.entity_today, 'L'), cost = this._num(c.entity_cost);
      const [tv, tu] = this._vol(today);
      const V = {
        flow: [c.entity_flow || c.entity_index, isNaN(flow) ? '--' : this._fmt(flow, 1), 'L/min'],
        today: [c.entity_today, tv, tu],
        index: [c.entity_index, this._fmt(idx / 1000, 3), 'm³'],
        cost: [c.entity_cost, this._fmt(cost, 2), this._unit(c.entity_cost, '€')],
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
  customElements.define(TAG, ApplianceWaterMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWaterMeterCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_index', 'sensor'), ent('entity_flow', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']),
        ent('entity_leak', 'binary_sensor'), ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        { type: 'grid', name: '', schema: [num('leak_minutes', 0, 1440, 5, 60, 'min'), num('flow_threshold', 0, 5, 0.01, 0.05, 'L/min')] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_flow'), bool('show_today'), bool('show_index'), bool('show_cost'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceWaterMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: "Compteur d'eau animé : totalisateur, débit, consommation du jour, coût, alerte fuite et vanne d'arrêt.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
