/* Carte « Moniteur de consommation » — custom:appliance-energy-monitor-card
 * Moniteur d'énergie façon écran de maison (style Ecojoko) à partir d'un seul capteur de puissance (W / kW) et / ou d'énergie (Wh / kWh) :
 *   - anneau + visage qui passent du vert au rouge selon la puissance (seuils réglables), puissance du moment ;
 *   - consommation du jour (kWh) et coût (capteur ou tarif au kWh), talon de consommation (plus basse puissance moyenne sur 24 h) ;
 *   - histogramme des 24 dernières heures (puissance moyenne par heure, colorée selon le niveau) avec la ligne du talon.
 * Source : une seule entité suffit (ex. un capteur qui remonte la plaque de cuisson et le four). Sans capteur de puissance, la puissance est déduite
 * des variations de l'énergie. L'historique vient du recorder de Home Assistant (history/history_during_period), complété par la valeur en direct.
 */
(() => {
  const TAG = 'appliance-energy-monitor-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Energy monitor",
      "now": "Now",
      "today": "Today",
      "cost": "Cost",
      "base": "Base load",
      "hourly": "Hourly average power",
      "last24": "last 24 h",
      "now_short": "now",
      "eco_good": "Economical",
      "eco_ok": "Moderate",
      "eco_high": "High use",
      "unavailable": "Unavailable",
      "loading": "Loading history…",
      "no_history": "No history available",
      "f_entity_power": "Power sensor (W / kW)",
      "f_entity_energy": "Energy sensor (kWh, total)",
      "f_entity_cost": "Cost of the day (sensor)",
      "f_price_per_kwh": "Price per kWh (number or entity)",
      "f_currency": "Currency symbol",
      "f_max_power": "Full ring power (W)",
      "f_thresholds": "Thresholds [orange from, red from] (W)",
      "f_show_graph": "24 h histogram",
      "f_show_base": "Base load",
      "f_show_cost": "Cost"
    },
    "fr": {
      "name": "Moniteur de consommation",
      "now": "En ce moment",
      "today": "Aujourd'hui",
      "cost": "Coût",
      "base": "Talon",
      "hourly": "Puissance moyenne par heure",
      "last24": "24 dernières heures",
      "now_short": "maint.",
      "eco_good": "Économe",
      "eco_ok": "Modéré",
      "eco_high": "Forte conso",
      "unavailable": "Indisponible",
      "loading": "Chargement de l'historique…",
      "no_history": "Aucun historique disponible",
      "f_entity_power": "Capteur de puissance (W / kW)",
      "f_entity_energy": "Capteur d'énergie (kWh, cumul)",
      "f_entity_cost": "Coût du jour (capteur)",
      "f_price_per_kwh": "Prix du kWh (nombre ou entité)",
      "f_currency": "Symbole de la devise",
      "f_max_power": "Puissance de l'anneau plein (W)",
      "f_thresholds": "Seuils [orange à partir de, rouge à partir de] (W)",
      "f_show_graph": "Histogramme 24 h",
      "f_show_base": "Talon",
      "f_show_cost": "Coût"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const H = 3600e3;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--em-c0:var(--appliance-ok-color,#43a047);--em-c1:#f9a825;--em-c2:var(--appliance-alert-color,#e53935);--em-c:var(--em-c0)}
ha-card.lv1{--em-c:var(--em-c1)}ha-card.lv2{--em-c:var(--em-c2)}ha-card.na{--em-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--em-c) 22%,transparent);color:var(--em-c)}
.hero{display:flex;align-items:center;gap:14px;margin-top:6px}
svg.gauge{flex:none;width:calc(104px * var(--illus-scale,1));height:auto;cursor:pointer;overflow:visible}
.ringbg{fill:none;stroke:rgba(127,127,127,.18);stroke-width:7}.ring{fill:none;stroke:var(--em-c);stroke-width:7;stroke-linecap:round;transition:stroke-dasharray .6s,stroke .4s}
.facebg{fill:color-mix(in srgb,var(--em-c) 22%,#fff);transition:fill .4s}.mouth{fill:none;stroke:#2b2f36;stroke-width:3;stroke-linecap:round}
.big{min-width:0}.big .v{font-size:34px;line-height:38px;font-weight:700;color:var(--em-c);white-space:nowrap}.big .v small{font-size:15px;font-weight:500;color:var(--secondary-text-color);margin-left:4px}
.big .l{font-size:12px;color:var(--secondary-text-color)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-top:10px}
.tile{box-sizing:border-box;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:6px 8px;min-width:0}
.tile .l{font-size:10.5px;color:var(--secondary-text-color)}.tile .v{font-size:16px;line-height:22px;font-weight:700;color:var(--primary-text-color);white-space:nowrap}.tile .v small{font-size:10px;font-weight:500;color:var(--secondary-text-color);margin-left:3px}
.tile.hide,.chart.hide{display:none}
.chart{margin-top:10px;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:12px;padding:8px 8px 2px}
.chart .ct{display:flex;justify-content:space-between;font-size:11px;color:var(--secondary-text-color);padding:0 2px}.chart .ct b{font-size:12px;color:var(--primary-text-color);font-weight:600}
.chart svg{display:block;width:100%;height:auto}
.chart .msg{padding:14px 4px;text-align:center;font-size:12px;color:var(--secondary-text-color)}
`;

  const MOUTH = ['M-12 7 Q0 20 12 7', 'M-11 10 H11', 'M-12 15 Q0 4 12 15'];
  // unités → W, kWh
  const toW = (v, u) => (/^\s*mw\s*$/i.test(u) ? v * 1e6 : /^\s*kw\s*$/i.test(u) ? v * 1e3 : v);
  const toKwh = (v, u) => (/^\s*mwh\s*$/i.test(u) ? v * 1e3 : /^\s*wh\s*$/i.test(u) ? v / 1e3 : v);

  class ApplianceEnergyMonitorCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      return { entity_power: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'power') || '', entity_energy: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'energy') || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (!c.entity_power && !c.entity_energy) throw new Error('A power or energy sensor is required (entity_power, entity_energy)');
      this._c = { show_graph: true, show_base: true, show_cost: true, ...c };
      this._built = false; this._hist = null; this._histAt = 0;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 2 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _val(id, conv) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return Number.isFinite(v) ? conv(v, String((s.attributes || {}).unit_of_measurement || '')) : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _fmt(v, d) { try { return new Intl.NumberFormat(this._lang(), { maximumFractionDigits: d }).format(v); } catch (e) { return String(Math.round(v * 10 ** d) / 10 ** d); } }
    _level(w) { const th = Array.isArray(this._c.thresholds) && this._c.thresholds.length === 2 && this._c.thresholds.every((x) => fin(Number(x))) ? this._c.thresholds.map(Number) : [1000, 3000]; return w < th[0] ? 0 : w < th[1] ? 1 : 2; }
    _th() { const t = this._c.thresholds; return Array.isArray(t) && t.length === 2 && t.every((x) => fin(Number(x))) ? t.map(Number) : [1000, 3000]; }

    // historique 24 h de la puissance et de l'énergie (rafraîchi toutes les 5 min)
    _loadHist() {
      const h = this._hass, c = this._c, ids = [c.entity_power, c.entity_energy].filter(Boolean);
      if (!ids.length || this._histBusy || Date.now() - this._histAt < 5 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - 24 * H;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), entity_ids: ids, minimal_response: true, no_attributes: false, significant_changes_only: false })
        .then((r) => {
          const out = {};
          ids.forEach((id) => {
            const rows = (r && r[id]) || [], u = (rows.find((p) => p.a && p.a.unit_of_measurement) || { a: {} }).a.unit_of_measurement || String((this._st(id) || { attributes: {} }).attributes.unit_of_measurement || ''), conv = id === c.entity_power ? toW : toKwh;
            out[id] = rows.map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: conv(parseFloat(String(p.s).replace(',', '.')), (p.a && p.a.unit_of_measurement) || u) })).filter((p) => fin(p.v) && fin(p.t));
          });
          this._hist = out;
        }).catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; if (this._hass) this._render(); });
    }
    // série d'une entité : historique + valeur en direct
    _series(id, conv) {
      const now = Date.now(), cur = this._val(id, conv), S = ((this._hist && this._hist[id]) || []).slice();
      if (fin(cur)) S.push({ t: now, v: cur });
      return S;
    }
    // moyenne pondérée par la durée d'une série en escalier sur [a, b]
    _avg(S, a, b) {
      if (!S.length || b <= a) return null;
      let sum = 0, dur = 0;
      for (let i = 0; i < S.length; i++) {
        const st = Math.max(S[i].t, a), en = Math.min(i + 1 < S.length ? S[i + 1].t : b, b);
        if (en > st) { sum += S[i].v * (en - st); dur += en - st; }
      }
      return dur > 0 ? sum / dur : null;
    }
    _at(S, t) { let v = null; for (const p of S) { if (p.t <= t) v = p.v; else break; } return v == null && S.length ? S[0].v : v; }

    _compute() {
      const c = this._c, now = Date.now(), hs = Math.floor(now / H) * H;
      const P = c.entity_power ? this._series(c.entity_power, toW) : [], E = c.entity_energy ? this._series(c.entity_energy, toKwh) : [];
      const bars = [];
      for (let i = 0; i < 24; i++) {
        const a = hs - (23 - i) * H, b = Math.min(a + H, now);
        let w = null;
        if (P.length) w = this._avg(P, a, b);
        else if (E.length && b > a) { const e0 = this._at(E, a), e1 = this._at(E, b); w = e0 != null && e1 != null ? Math.max(0, e1 - e0) * 1000 / ((b - a) / H) : null; }
        bars.push({ a, w });
      }
      const cur = c.entity_power ? this._val(c.entity_power, toW) : (() => { const e1 = this._val(c.entity_energy, toKwh), e0 = this._at(E, now - 10 * 60000); return fin(e1) && e0 != null && E.length > 1 ? Math.max(0, e1 - e0) * 1000 / (10 / 60) : NaN; })();
      const mid = new Date().setHours(0, 0, 0, 0);
      let today = NaN;
      if (E.length) { const e1 = this._val(c.entity_energy, toKwh), e0 = this._at(E, mid); if (fin(e1) && e0 != null) today = Math.max(0, e1 - e0); }
      else if (P.length) { const w = this._avg(P, mid, now); if (w != null) today = w * (now - mid) / H / 1000; }
      const vals = bars.map((x) => x.w).filter((x) => x != null), base = vals.length ? Math.min(...vals) : NaN;
      return { cur, today, base, bars };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="emtitle"></div><div class="badge" id="embadge"></div></div>
        <div class="hero"><svg class="gauge" viewBox="-60 -60 120 120" role="img" id="emgauge">
          <circle class="ringbg" r="52"/><circle class="ring" id="emring" r="52" transform="rotate(-90)" stroke-dasharray="0 327"/>
          <circle class="facebg" r="38"/><ellipse cx="-13" cy="-8" rx="3.6" ry="5" fill="#2b2f36"/><ellipse cx="13" cy="-8" rx="3.6" ry="5" fill="#2b2f36"/><path class="mouth" id="emmouth" d="${MOUTH[0]}"/></svg>
          <div class="big"><div class="v" id="emval"></div><div class="l" id="emlab"></div></div></div>
        <div class="tiles"><div class="tile" id="emt1"></div><div class="tile" id="emt2"></div><div class="tile" id="emt3"></div></div>
        <div class="chart" id="emchart"><div class="ct"><b id="emct"></b><span id="emcs"></span></div><div id="emcc"></div></div>
      </ha-card>`;
      window.applianceBindIllus(this, root.getElementById('emgauge'), () => this._more(this._c.entity_power || this._c.entity_energy));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      this._loadHist();
      const c = this._c, r = this._root, hass = this._hass, d = this._compute(), th = this._th(), max = Number(c.max_power) > 0 ? Number(c.max_power) : th[1] * 1.5;
      const ok = fin(d.cur), lv = ok ? this._level(d.cur) : -1;
      this._card.className = lv < 0 ? 'na' : `lv${lv}`;
      r.getElementById('emtitle').textContent = c.name || this._t('name');
      r.getElementById('embadge').textContent = ok ? this._t(['eco_good', 'eco_ok', 'eco_high'][lv]) : this._t('unavailable');
      r.getElementById('emring').setAttribute('stroke-dasharray', `${(ok ? Math.min(1, d.cur / max) * 326.7 : 0).toFixed(1)} 327`);
      r.getElementById('emmouth').setAttribute('d', MOUTH[Math.max(0, lv)]);
      const kw = ok && d.cur >= 10000;
      r.getElementById('emval').innerHTML = ok ? `${this._fmt(kw ? d.cur / 1000 : d.cur, kw ? 1 : 0)}<small>${kw ? 'kW' : 'W'}</small>` : '--';
      r.getElementById('emlab').textContent = this._t('now');
      // tuiles : jour, coût, talon
      const price = c.price_per_kwh != null && c.price_per_kwh !== '' ? window.appliancePrice(hass, c.price_per_kwh) : NaN, cs = c.entity_cost && this._st(c.entity_cost);
      let cost = cs && this._ok(cs) ? parseFloat(String(cs.state).replace(',', '.')) : (fin(price) && fin(d.today) ? d.today * price : NaN);
      const cur = c.currency || (hass.config && hass.config.currency) || '€', sym = ({ EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' })[cur] || cur;
      const tile = (id, label, v, u, show) => { const el = r.getElementById(id); el.classList.toggle('hide', !show); el.innerHTML = `<div class="l">${esc(label)}</div><div class="v">${v}<small>${esc(u)}</small></div>`; };
      tile('emt1', this._t('today'), fin(d.today) ? this._fmt(d.today, d.today < 10 ? 2 : 1) : '--', 'kWh', true);
      tile('emt2', this._t('cost'), fin(cost) ? this._fmt(cost, 2) : '--', sym, c.show_cost !== false && (fin(cost) || c.entity_cost || c.price_per_kwh != null));
      tile('emt3', this._t('base'), fin(d.base) ? this._fmt(d.base, 0) : '--', 'W', c.show_base !== false);
      this._chart(d, th, sym);
    }

    // histogramme des 24 dernières heures (puissance moyenne par heure) avec la ligne du talon
    _chart(d, th, sym) {
      const r = this._root, box = r.getElementById('emchart'), c = this._c;
      box.classList.toggle('hide', c.show_graph === false);
      if (c.show_graph === false) return;
      r.getElementById('emct').textContent = `${this._t('hourly')} · ${this._t('last24')}`;
      r.getElementById('emcs').textContent = '';
      const cc = r.getElementById('emcc'), has = d.bars.some((x) => x.w != null);
      if (!has) { cc.innerHTML = `<div class="msg">${esc(this._t(this._hist === null && this._histAt ? 'no_history' : 'loading'))}</div>`; return; }
      const W = 320, Hh = 110, L = 4, Rr = 4, Tp = 6, B = 18, iw = W - L - Rr, ih = Hh - Tp - B, bw = iw / 24, mx = Math.max(th[1], ...d.bars.map((x) => x.w || 0)) * 1.05;
      const COL = ['var(--em-c0)', 'var(--em-c1)', 'var(--em-c2)'], Y = (v) => Tp + ih - Math.min(1, v / mx) * ih;
      let g = '';
      d.bars.forEach((x, i) => {
        if (x.w == null) return;
        const hh = new Date(x.a).getHours(), y = Y(x.w), last = i === 23;
        g += `<rect x="${(L + i * bw + 1).toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${Math.max(1.5, Tp + ih - y).toFixed(1)}" rx="1.5" fill="${COL[this._level(x.w)]}" opacity="${last ? 1 : .8}"><title>${hh} h · ${this._fmt(x.w, 0)} W</title></rect>`;
      });
      if (fin(d.base) && c.show_base !== false) g += `<line x1="${L}" x2="${W - Rr}" y1="${Y(d.base).toFixed(1)}" y2="${Y(d.base).toFixed(1)}" stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>`;
      [[0, '-24 h', 'start'], [.5, '-12 h', 'middle'], [1, this._t('now_short'), 'end']].forEach(([f, lab, an]) => { g += `<text x="${(L + f * iw).toFixed(1)}" y="${Hh - 4}" text-anchor="${an}" font-size="9" fill="var(--secondary-text-color)">${esc(lab)}</text>`; });
      cc.innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${esc(this._t('hourly'))}">${g}</svg>`;
    }
  }
  customElements.define(TAG, ApplianceEnergyMonitorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceEnergyMonitorCardEditor extends HTMLElement {
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
        ent('entity_power'), ent('entity_energy'), ent('entity_cost'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { name: 'currency', selector: { text: {} } },
        { name: 'max_power', selector: { number: { min: 100, max: 100000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
        { name: 'thresholds', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_graph'), bool('show_base'), bool('show_cost')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceEnergyMonitorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Moniteur de consommation façon écran de maison : puissance du moment avec visage et anneau, consommation du jour, coût, talon, histogramme sur 24 h.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/energy-monitor.md',
  });
})();
