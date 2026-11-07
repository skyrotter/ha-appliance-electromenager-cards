/* Carte « Compteur électrique » — custom:appliance-electric-meter-card
 * Compteur à disque : disque rotatif qui tourne selon la puissance, LED d'impulsion qui clignote, totalisateur kWh
 * (5 chiffres + 1 décimale rouge). Tous les capteurs sont optionnels : puissance (W, kW, MW), index (Wh, kWh, MWh),
 * consommation du jour, coût, tarif en cours, puissance par phase (L1 / L2 / L3), puissance souscrite (kVA).
 * Sans capteur de puissance, la puissance est déduite des variations de l'index.
 * Au-dessus de subscribed_power : état « Dépassement » (bandeau d'alerte).
 */
(() => {
  const TAG = 'appliance-electric-meter-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n electric_meter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // conversion en W (puissance) et en kWh (énergie) selon l'unité du capteur
  const PWR = { w: 1, kw: 1000, mw: 1e6, va: 1, kva: 1000 };
  const NRG = { wh: 1 / 1000, kwh: 1, mwh: 1000 };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--em-on:var(--appliance-power-color,#f5a623);--em-alert:var(--appliance-alert-color,#db4437);--spd:2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.consuming .badge{background:color-mix(in srgb,var(--em-on) 22%,transparent);color:var(--em-on)}
.overload .badge{background:color-mix(in srgb,var(--em-alert) 22%,transparent);color:var(--em-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--em-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--em-alert)}
/* ---- illustration ---- */
.em-disc{transform-box:fill-box;transform-origin:50% 50%}
.consuming .em-disc,.overload .em-disc{animation:emrot var(--spd) linear infinite}
.em-led{fill:#5b1a1a;transition:fill .3s}
.consuming .em-led,.overload .em-led{fill:#ff3b30;animation:emled calc(var(--spd) * .5) steps(1) infinite}
.em-bolt{fill:#ffc107;opacity:.25;transition:opacity .4s}
.consuming .em-bolt{opacity:1;animation:emglow 1.4s ease-in-out infinite alternate}
.overload .em-bolt{fill:#e53935;opacity:1;animation:emblink 1s ease-in-out infinite}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .em-disc,.noanim .em-led,.noanim .em-bolt{animation:none}
@keyframes emrot{to{transform:rotate(360deg)}}
@keyframes emled{50%{fill:#5b1a1a}}
@keyframes emglow{to{opacity:.55}}
@keyframes emblink{50%{opacity:.3}}
`;

  const SVG = (label) => `<svg viewBox="0 18 120 108" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="emsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="embody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fdfdfd"/><stop offset=".6" stop-color="#dfe4ea"/><stop offset="1" stop-color="#aeb6bf"/></linearGradient>
    <radialGradient id="emdisc" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9aa4ae"/></radialGradient>
    <radialGradient id="emglass" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="122" rx="44" ry="4.5" fill="url(#emsh)"/>
    <!-- bornes -->
    <rect x="34" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/><rect x="56" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/><rect x="78" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/>
    <!-- boîtier -->
    <rect x="22" y="22" width="76" height="92" rx="10" fill="url(#embody)" stroke="#8a929b" stroke-width="1"/>
    <!-- totalisateur kWh : 5 chiffres + 1 décimale -->
    <rect x="32" y="30" width="56" height="14" rx="2.5" fill="#20252b"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${34 + i * 8.2}" y="32" width="7.4" height="10" fill="#111"/><text class="em-d" x="${(37.7 + i * 8.2).toFixed(1)}" y="40" text-anchor="middle" font-size="8" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <rect x="75.4" y="32" width="7.4" height="10" fill="#b71c1c"/><text class="em-l" x="79.1" y="40" text-anchor="middle" font-size="8" fill="#fff" font-family="monospace" font-weight="700">0</text>
    <text x="85" y="40.5" font-size="4" fill="#fff" font-family="sans-serif">kWh</text>
    <!-- fenêtre du disque -->
    <circle cx="60" cy="72" r="22" fill="#2b3138"/><circle cx="60" cy="72" r="19" fill="url(#emdisc)"/>
    <g class="em-disc"><circle cx="60" cy="72" r="19" fill="none"/><path d="M60 72V54" stroke="#d32f2f" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="72" r="2.2" fill="#6d7680"/></g>
    <circle cx="60" cy="72" r="19" fill="url(#emglass)"/>
    <!-- éclair et LED d'impulsion -->
    <path class="em-bolt" d="M32 86l7-10h-4.5l3-9-8 11h4.5z"/>
    <circle class="em-led" cx="88" cy="94" r="3.2" stroke="#7a1313" stroke-width=".6"/>
    <text x="60" y="106" text-anchor="middle" font-size="5" fill="#6d7680" font-family="sans-serif" font-weight="700" letter-spacing=".8">1 imp/Wh</text>
  </svg>`;

  const TILES = [['power', 'mdi:flash', 'show_power'], ['today', 'mdi:calendar-today', 'show_today'], ['index', 'mdi:counter', 'show_index'], ['cost', 'mdi:cash', 'show_cost'],
    ['tariff', 'mdi:tag-outline', 'show_tariff'], ['l1', 'mdi:numeric-1-box-outline', 'show_phases'], ['l2', 'mdi:numeric-2-box-outline', 'show_phases'], ['l3', 'mdi:numeric-3-box-outline', 'show_phases']];

  class ApplianceElectricMeterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), st = (i) => hass.states[i].attributes || {};
      const s = (i) => i.startsWith('sensor.');
      return {
        entity_power: ids.find((i) => s(i) && st(i).device_class === 'power' && /(grid|house|total|mains|maison|reseau|réseau|compteur|meter)/i.test(i)) || ids.find((i) => s(i) && st(i).device_class === 'power') || '',
        entity_index: ids.find((i) => s(i) && st(i).device_class === 'energy' && st(i).state_class === 'total_increasing') || ids.find((i) => s(i) && st(i).device_class === 'energy') || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_power: true, show_today: true, show_index: true, show_cost: true, show_tariff: true, show_phases: true, power_threshold: 5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
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
    // puissance en W et énergie en kWh, quelle que soit l'unité du capteur
    _watts(id) { const v = this._num(id); return isNaN(v) ? NaN : v * (PWR[this._unit(id, 'W').toLowerCase()] ?? 1); }
    _kwh(id) { const v = this._num(id); return isNaN(v) ? NaN : v * (NRG[this._unit(id, 'kWh').toLowerCase()] ?? 1); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _pw(w) { return isNaN(w) ? ['--', 'W'] : Math.abs(w) >= 10000 ? [this._fmt(w / 1000, 2), 'kW'] : [this._fmt(w, 0), 'W']; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="emtitle"></div><div class="badge" id="embadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="emalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_power || this._c.entity_index));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ power: c.entity_power || c.entity_index, today: c.entity_today, index: c.entity_index, cost: c.entity_cost, tariff: c.entity_tariff, l1: c.entity_power_l1, l2: c.entity_power_l2, l3: c.entity_power_l3 }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, now = Date.now();
      const idx = this._kwh(c.entity_index);
      // puissance : capteur dédié, sinon déduite de l'index (kWh écoulés depuis le dernier changement)
      let power = this._watts(c.entity_power);
      if (!c.entity_power && !isNaN(idx)) {
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = now; this._dpower = 0; }
        else if (idx !== this._lastIdx) {
          const h = Math.max(.0003, (now - this._lastAt) / 3600000);
          this._dpower = idx > this._lastIdx ? (idx - this._lastIdx) * 1000 / h : 0;
          this._lastIdx = idx; this._lastAt = now;
        } else if (now - this._lastAt > 15 * 60000) this._dpower = 0;
        power = this._dpower;
      }
      const consuming = !isNaN(power) && power > (Number(c.power_threshold) || 0);
      const sub = Number(c.subscribed_power) * 1000, overload = sub > 0 && !isNaN(power) && power > sub;
      const anyId = [c.entity_power, c.entity_index, c.entity_today, c.entity_power_l1, c.entity_power_l2, c.entity_power_l3].filter(Boolean);
      const usable = anyId.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      const st = !usable ? 'unavailable' : overload ? 'overload' : consuming ? 'consuming' : 'idle';
      return { st, idx, power, consuming };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, idx, power } = this._compute();
      card.className = `${st}${c.animations === false ? ' noanim' : ''}`;
      // vitesse du disque : un tour en 2 s à 1 kW, bornée (plus la puissance est forte, plus il tourne vite)
      card.style.setProperty('--spd', `${Math.max(.25, Math.min(8, 2000 / Math.max(50, power || 0))).toFixed(2)}s`);
      // totalisateur : 5 chiffres de kWh + 1 décimale
      const base = isNaN(idx) ? 0 : Math.max(0, idx), whole = Math.floor(base);
      const ent = String(whole % 100000).padStart(5, '0'), dec = String(Math.floor((base - whole) * 10));
      r.querySelectorAll('.em-d').forEach((el, i) => { el.textContent = ent[i]; });
      r.querySelectorAll('.em-l').forEach((el) => { el.textContent = dec; });

      r.getElementById('emtitle').textContent = c.name || this._t('name');
      const [pv, pu] = this._pw(power);
      const badge = r.getElementById('embadge');
      badge.textContent = st === 'consuming' || st === 'overload' ? `${pv} ${pu}` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('emalert');
      al.textContent = st === 'overload' ? this._t('overload_alert').replace('{n}', this._fmt(Number(c.subscribed_power), 1)) : '';
      al.classList.toggle('on', !!al.textContent);

      const tariff = this._st(c.entity_tariff), ph = (id) => this._pw(this._watts(id));
      const V = {
        power: [c.entity_power || c.entity_index, pv, pu],
        today: [c.entity_today, this._fmt(this._kwh(c.entity_today), 2), 'kWh'],
        index: [c.entity_index, this._fmt(idx, 1), 'kWh'],
        cost: [c.entity_cost, this._fmt(this._num(c.entity_cost), 2), this._unit(c.entity_cost, '€')],
        tariff: [c.entity_tariff, tariff ? String(tariff.state) : '--', ''],
        l1: [c.entity_power_l1, ...ph(c.entity_power_l1)], l2: [c.entity_power_l2, ...ph(c.entity_power_l2)], l3: [c.entity_power_l3, ...ph(c.entity_power_l3)],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'power' && st === 'overload');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceElectricMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceElectricMeterCardEditor extends HTMLElement {
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
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_power', 'sensor'), ent('entity_index', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']), ent('entity_tariff', ['sensor', 'select', 'input_select']),
        ent('entity_power_l1', 'sensor'), ent('entity_power_l2', 'sensor'), ent('entity_power_l3', 'sensor'),
        { type: 'grid', name: '', schema: [num('subscribed_power', 0, 100, 0.5, 0, 'kVA')] },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_power'), bool('show_today'), bool('show_index'), bool('show_cost'), bool('show_tariff'), bool('show_phases'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceElectricMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Compteur électrique animé : disque rotatif, LED d\'impulsion, totalisateur kWh, puissance, consommation du jour, coût, tarif et phases.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
