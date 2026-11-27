/* Carte « Four + plaque » — custom:appliance-oven-hob-card
 * Le four et la plaque de cuisson côte à côte sur la même carte, avec UN SEUL capteur (puissance et / ou énergie qui remonte les deux appareils).
 * Les deux dessins sont ceux des cartes « Four » (appliance-oven-card) et « Plaque » (appliance-hob-card), réutilisés tels quels en mode
 * illustration seule : ils s'animent ensemble dès que la puissance dépasse le seuil. Sous les dessins, une puissance, une énergie et un coût communs.
 * Pour affiner chaque appareil, `oven:` et `hob:` acceptent n'importe quelles options de la carte correspondante (température du four, zones de la plaque…).
 */
(() => {
  const TAG = 'appliance-oven-hob-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n oven_hob*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--oh-c:#8a929a}
ha-card.on{--oh-c:#ff7043}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--oh-c) 22%,transparent);color:var(--oh-c)}
.row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;align-items:end}
.row>*{min-width:0;display:block}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:6px 8px;min-width:0;cursor:pointer}
.tile .l{font-size:10.5px;color:var(--secondary-text-color)}.tile .v{font-size:16px;line-height:22px;font-weight:700;color:var(--primary-text-color);white-space:nowrap}.tile .v small{font-size:10px;font-weight:500;color:var(--secondary-text-color);margin-left:3px}
.on .tile.p .v{color:var(--oh-c)}.tile.hide{display:none}
`;

  class ApplianceOvenHobCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      return { power: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'power') || '', energy: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'energy') || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (!c.power && !c.energy && !(c.oven && (c.oven.entity || c.oven.power)) && !(c.hob && (c.hob.entity || c.hob.power))) throw new Error('A power or energy sensor is required (power, energy)');
      this._c = { show_energy: true, show_cost: true, show_power: true, threshold: 50, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) {
      const ch = this._c && window.applianceChanged(this, h, this._c);
      this._hass = h;
      if (this._built) { this._oven.hass = h; this._hob.hass = h; }
      if (ch) this._render();
    }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto', min_rows: 2 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _num(id) { const s = id && this._hass.states[id]; if (!s || /^(unavailable|unknown)$/i.test(String(s.state))) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return Number.isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = id && this._hass.states[id]; return String((s && s.attributes && s.attributes.unit_of_measurement) || d); }
    _fmt(v, d) { try { return new Intl.NumberFormat(this._lang(), { maximumFractionDigits: d }).format(v); } catch (e) { return String(Math.round(v * 10 ** d) / 10 ** d); } }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    // configuration des deux cartes enfants : options communes (capteur partagé), puis options propres (oven: / hob:)
    _child(kind) {
      const c = this._c, shared = {};
      ['power', 'energy', 'cost', 'price_per_kwh', 'threshold', 'language', 'animations'].forEach((k) => { if (c[k] != null && c[k] !== '') shared[k] = c[k]; });
      // dessins agrandis (160 % par défaut) : deux appareils se partagent la largeur de la carte
      return { ...shared, illustration_only: true, transparent: true, illustration_size: c.illustration_size || 160, ...(c[kind] || {}), type: `custom:appliance-${kind}-card` };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="ohtitle"></div><div class="badge" id="ohbadge"></div></div>
        <div class="row" id="ohrow"></div>
        <div class="tiles"><div class="tile p" id="oht1"></div><div class="tile" id="oht2"></div><div class="tile" id="oht3"></div></div></ha-card>`;
      this._oven = document.createElement('appliance-oven-card'); this._hob = document.createElement('appliance-hob-card');
      [[this._oven, 'oven'], [this._hob, 'hob']].forEach(([el, kind]) => { try { el.setConfig(this._child(kind)); } catch (e) { /* option invalide : la carte enfant est ignorée */ } root.getElementById('ohrow').appendChild(el); });
      this._oven.hass = this._hass; this._hob.hass = this._hass;
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c.power || this._c.energy)));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, hass = this._hass;
      const w = c.power ? this._num(c.power) : NaN, wu = this._unit(c.power, 'W'), watts = fin(w) ? (/^\s*kw\s*$/i.test(wu) ? w * 1000 : w) : NaN;
      const on = fin(watts) && watts > Number(c.threshold || 50);
      this._card.className = on ? 'on' : '';
      r.getElementById('ohtitle').textContent = c.name || this._t('name');
      r.getElementById('ohbadge').textContent = fin(watts) || c.energy ? this._t(on ? 'active' : 'idle') : this._t('unavailable');
      const e = this._num(c.energy), eu = this._unit(c.energy, 'kWh'), kwh = fin(e) ? (/^\s*wh\s*$/i.test(eu) ? e / 1000 : /^\s*mwh\s*$/i.test(eu) ? e * 1000 : e) : NaN;
      const price = c.price_per_kwh != null && c.price_per_kwh !== '' ? window.appliancePrice(hass, c.price_per_kwh, this, c.energy || c.power) : NaN, cs = c.cost && hass.states[c.cost];
      const cost = cs && !/^(unavailable|unknown)$/i.test(String(cs.state)) ? parseFloat(String(cs.state).replace(',', '.')) : (fin(price) && fin(kwh) ? kwh * price : NaN);
      const cur = c.currency || (hass.config && hass.config.currency) || '€', sym = ({ EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' })[cur] || cur;
      const tile = (id, label, v, u, show) => { const el = r.getElementById(id); el.classList.toggle('hide', !show); el.innerHTML = `<div class="l">${esc(label)}</div><div class="v">${v}<small>${esc(u)}</small></div>`; };
      tile('oht1', this._t('power'), fin(watts) ? this._fmt(watts >= 10000 ? watts / 1000 : watts, watts >= 10000 ? 1 : 0) : '--', watts >= 10000 ? 'kW' : 'W', c.show_power !== false && !!c.power);
      tile('oht2', this._t('energy'), fin(kwh) ? this._fmt(kwh, kwh < 10 ? 2 : 1) : '--', 'kWh', c.show_energy !== false && !!c.energy);
      tile('oht3', this._t('cost'), fin(cost) ? this._fmt(cost, 2) : '--', sym, c.show_cost !== false && (fin(cost) || !!c.cost || c.price_per_kwh != null));
    }
  }
  customElements.define(TAG, ApplianceOvenHobCard);

  /* ---- éditeur visuel ---- */
  class ApplianceOvenHobCardEditor extends HTMLElement {
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
      const ent = (name) => ({ name, selector: { entity: { domain: 'sensor' } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        ent('power'), ent('energy'), ent('cost'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { name: 'threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
        { name: 'oven', selector: { object: {} } },
        { name: 'hob', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_power'), bool('show_energy'), bool('show_cost')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceOvenHobCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Four et plaque de cuisson côte à côte sur la même carte, avec un seul capteur de puissance : les deux dessins s\'animent ensemble, puissance, énergie et coût communs.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/oven-hob.md',
  });
})();
