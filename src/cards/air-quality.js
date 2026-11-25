/* Carte « Qualité de l'air » — custom:appliance-air-quality-card
 * Moniteur de qualité de l'air : CO₂, PM0.3, PM1, PM2.5, PM4, PM10, COV / TVOC, NOx, formaldéhyde, CO, NO₂, O₃, radon, propane, O₂, humidité, température, pression, bruit (tout est facultatif).
 *   - Indicateur central : un visage dans un anneau qui passe de « Bon » à « Mauvais » selon le pire polluant ;
 *     l'humidité, la température, la pression et le bruit sont colorés mais ne comptent pas dans l'indicateur. Particules en suspension qui s'agitent quand l'air se dégrade,
 *     étincelles quand il est bon.
 *   - Une tuile par mesure : valeur colorée selon des seuils, mini-courbe 24 h.
 *   - Courbe 24 h de la mesure choisie (un clic sur une tuile), avec les bandes de seuils colorées et une infobulle au survol.
 * L'historique vient du recorder de Home Assistant (history/history_during_period), complété par les valeurs vues en direct.
 */
(() => {
  const TAG = 'appliance-air-quality-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n air_quality*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // mesures : clé de config, icône, seuils [bon → moyen, moyen → médiocre, médiocre → mauvais] ; comfort = plages de confort [bon min, bon max, moyen min, moyen max]
  const METRICS = {
    co2: { opt: 'entity_co2', icon: 'mdi:molecule-co2', unit: 'ppm', th: [800, 1000, 1500], poll: true, dec: 0 },
    pm03: { opt: 'entity_pm03', icon: 'mdi:dots-hexagon', unit: '#/cm³', th: [500, 1500, 3000], poll: true, dec: 0 },
    pm1: { opt: 'entity_pm1', icon: 'mdi:blur-linear', unit: 'µg/m³', th: [10, 25, 40], poll: true },
    pm25: { opt: 'entity_pm25', icon: 'mdi:blur', unit: 'µg/m³', th: [12, 35, 55], poll: true },
    pm4: { opt: 'entity_pm4', icon: 'mdi:grain', unit: 'µg/m³', th: [15, 40, 75], poll: true },
    pm10: { opt: 'entity_pm10', icon: 'mdi:grain', unit: 'µg/m³', th: [20, 50, 100], poll: true },
    voc: { opt: 'entity_voc', icon: 'mdi:air-filter', unit: 'ppb', th: [220, 660, 2200], poll: true, dec: 0 },
    nox: { opt: 'entity_nox', icon: 'mdi:molecule', unit: 'index', th: [20, 150, 300], poll: true, dec: 0 },
    hcho: { opt: 'entity_hcho', icon: 'mdi:flask-outline', unit: 'µg/m³', th: [30, 60, 100], poll: true },
    co: { opt: 'entity_co', icon: 'mdi:molecule-co', unit: 'ppm', th: [9, 25, 50], poll: true },
    no2: { opt: 'entity_no2', icon: 'mdi:smog', unit: 'µg/m³', th: [40, 100, 200], poll: true },
    o3: { opt: 'entity_o3', icon: 'mdi:weather-hazy', unit: 'µg/m³', th: [60, 100, 180], poll: true },
    radon: { opt: 'entity_radon', icon: 'mdi:radioactive', unit: 'Bq/m³', th: [100, 150, 300], poll: true, dec: 0 },
    radon_long_term: { opt: 'entity_radon_long_term', icon: 'mdi:radioactive', unit: 'Bq/m³', th: [100, 150, 300], poll: true, dec: 0 },
    propane: { opt: 'entity_propane', icon: 'mdi:gas-cylinder', unit: '%LEL', th: [5, 10, 20], poll: true },
    o2: { opt: 'entity_o2', icon: 'mdi:gas-mask', unit: '%', comfort: [19.5, 23.5, 18, 25], margin: 2, poll: true },
    humidity: { opt: 'entity_humidity', icon: 'mdi:water-percent', unit: '%', comfort: [40, 60, 30, 70] },
    temperature: { opt: 'entity_temperature', icon: 'mdi:thermometer', unit: '°C', comfort: [19, 24, 17, 26] },
    pressure: { opt: 'entity_pressure', icon: 'mdi:gauge', unit: 'hPa', comfort: [1000, 1026, 985, 1040], margin: 15, dec: 0 },
    noise: { opt: 'entity_noise', icon: 'mdi:volume-high', unit: 'dB', th: [45, 65, 80], dec: 0 },
  };
  const ORDER = ['co2', 'pm03', 'pm1', 'pm25', 'pm4', 'pm10', 'voc', 'nox', 'hcho', 'co', 'no2', 'o3', 'radon', 'radon_long_term', 'propane', 'o2', 'humidity', 'temperature', 'pressure', 'noise'];
  const LEVELS = ['good', 'moderate', 'poor', 'bad'];

  const CSS = `
:host{display:block;height:100%} ha-card{height:100%;box-sizing:border-box;container-type:inline-size}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--aq-c0:var(--appliance-ok-color,#43a047);--aq-c1:#f9a825;--aq-c2:#f4511e;--aq-c3:var(--appliance-alert-color,#d32f2f);--aq-c:var(--aq-c0)}
ha-card.lv1{--aq-c:var(--aq-c1)}ha-card.lv2{--aq-c:var(--aq-c2)}ha-card.lv3{--aq-c:var(--aq-c3)}ha-card.unavailable{--aq-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--aq-c) 22%,transparent);color:var(--aq-c)}
.hero{display:flex;flex-direction:column;align-items:center;margin-top:4px}
svg.face{display:block;width:100%;max-width:calc(190px * var(--illus-scale,1));height:auto;cursor:pointer;overflow:visible}
.sub{margin-top:2px;text-align:center;font-size:12px;font-weight:600;color:var(--aq-c)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:6px;margin-top:10px}
.tile{position:relative;overflow:hidden;box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:6px 8px 4px;min-width:0;cursor:pointer;border:1.5px solid transparent;transition:border-color .2s}
.tile.sel{border-color:color-mix(in srgb,var(--tc) 70%,transparent)}
.tile .l{display:flex;align-items:center;gap:4px;font-size:10.5px;line-height:14px;color:var(--secondary-text-color)}.tile .l ha-icon{--mdc-icon-size:14px;flex:none;color:var(--tc)}
.tile .v{font-size:17px;line-height:22px;font-weight:700;color:var(--tc);white-space:nowrap}.tile .v small{font-size:10px;font-weight:500;color:var(--secondary-text-color);margin-left:3px}
.tile svg{display:block;width:100%;height:22px;margin-top:2px}
.tile.hide{display:none}
.chart{margin-top:10px;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:12px;padding:8px 8px 4px;position:relative}
.chart .ct{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;color:var(--secondary-text-color);padding:0 2px}.chart .ct b{font-size:12px;color:var(--primary-text-color);font-weight:600}
.chart .cv{color:var(--tc);font-weight:700}
.chart svg{display:block;width:100%;height:auto;touch-action:none}
.chart .msg{padding:14px 4px;text-align:center;font-size:12px;color:var(--secondary-text-color)}
.chart.hide{display:none}
.unavailable .face{filter:grayscale(1) opacity(.6)}
/* ---- visage animé ---- */
.ring{fill:none;stroke:var(--aq-c);stroke-width:5;stroke-linecap:round;transition:stroke .4s}
.ringbg{fill:none;stroke:rgba(127,127,127,.18);stroke-width:5}
.facebg{fill:color-mix(in srgb,var(--aq-c) 22%,#fff);transition:fill .4s}
.glow{fill:var(--aq-c);opacity:.18;animation:aqglow 3s ease-in-out infinite}.lv2 .glow,.lv3 .glow{animation-duration:1.4s}
.eye{transform-box:fill-box;transform-origin:center;animation:aqblink 4.5s infinite}
.mouth{fill:none;stroke:#2b2f36;stroke-width:3.2;stroke-linecap:round}
.dust circle{fill:#9a8b78;opacity:0;animation:aqdust var(--d,6s) linear var(--w,0s) infinite}
.lv0 .dust,.lv1 .dust .hi,.lv1 .dust .mid,.lv2 .dust .hi{display:none}
.dust .lo{display:none}.lv1 .dust .lo{display:inline}
.spark{fill:#fff;opacity:0;animation:aqspark 2.6s ease-in-out var(--w,0s) infinite;transform-box:fill-box;transform-origin:center}
.lv1 .spark,.lv2 .spark,.lv3 .spark{display:none}
.lv3 .face-all{animation:aqshake 1.1s ease-in-out infinite}
.noanim *{animation:none!important;transition:none!important}
.noanim .dust circle{opacity:.5}.noanim .spark{opacity:.8}
@container (min-width:440px){
  :host(:not([tiles-pos])) .aq-wrap{display:grid;grid-template-columns:clamp(120px,24%,164px) minmax(0,1fr);column-gap:12px;align-items:center}
  :host(:not([tiles-pos])) .head,:host(:not([tiles-pos])) .chart{grid-column:1/-1}
  :host(:not([tiles-pos])) .hero{margin-top:0}
  :host(:not([tiles-pos])) svg.face{max-width:calc(146px * var(--illus-scale,1))}
  :host(:not([tiles-pos])) .tiles{margin-top:6px;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));align-self:stretch;align-content:center}
}
@keyframes aqglow{50%{opacity:.34}}
@keyframes aqblink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
@keyframes aqdust{0%{opacity:0;transform:translate(0,0)}15%{opacity:.7}85%{opacity:.55}100%{opacity:0;transform:translate(var(--dx,12px),var(--dy,-30px))}}
@keyframes aqspark{0%,100%{opacity:0;transform:scale(.3)}50%{opacity:.95;transform:scale(1)}}
@keyframes aqshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.2px)}75%{transform:translateX(1.2px)}}
`;

  // visage : bouche selon le niveau (0 bon … 3 mauvais)
  const MOUTH = ['M-15 8 Q0 24 15 8', 'M-13 11 Q0 18 13 11', 'M-12 15 H12', 'M-14 19 Q0 4 14 19'];
  const face = (name) => {
    // particules : 14 grains placés autour du visage, plus ou moins visibles selon le niveau (classes hi / mid / lo)
    const P = [[-70, -20, 'hi'], [-62, 30, 'hi'], [-50, -52, 'lo'], [-30, 62, 'mid'], [-8, -68, 'hi'], [18, 64, 'lo'], [40, -58, 'mid'], [58, 40, 'hi'], [68, -14, 'lo'], [72, 12, 'hi'], [-76, 6, 'mid'], [28, -70, 'hi'], [-42, 54, 'lo'], [52, -36, 'mid']];
    const dust = P.map(([x, y, k], i) => `<circle class="${k}" cx="${x}" cy="${y}" r="${(2.2 + (i % 3) * .9).toFixed(1)}" style="--d:${(5 + (i % 5) * 1.2).toFixed(1)}s;--w:${(-i * .7).toFixed(1)}s;--dx:${(i % 2 ? 14 : -14)}px;--dy:${-26 - (i % 4) * 6}px"/>`).join('');
    const spk = [[-62, -34], [60, -42], [-48, 48], [66, 30], [4, -72], [-72, 8]].map(([x, y], i) => `<path class="spark" d="M${x} ${y - 5}L${x + 1.6} ${y - 1.6}L${x + 5} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 5}L${x - 1.6} ${y + 1.6}L${x - 5} ${y}L${x - 1.6} ${y - 1.6}Z" style="--w:${(-i * .45).toFixed(2)}s"/>`).join('');
    return `<svg class="face" viewBox="-90 -90 180 180" role="img" aria-label="${esc(name)}">
      <circle class="glow" r="82"/><circle class="ringbg" r="66"/><circle class="ring" id="aqring" r="66" transform="rotate(-90)" stroke-dasharray="0 415"/>
      <g class="face-all"><circle class="facebg" r="50"/>
        <ellipse class="eye" cx="-17" cy="-9" rx="4.4" ry="6" fill="#2b2f36"/><ellipse class="eye" cx="17" cy="-9" rx="4.4" ry="6" fill="#2b2f36" style="animation-delay:.05s"/>
        <path class="mouth" id="aqmouth" d="${MOUTH[0]}"/>
        <g id="aqextra"></g></g>
      <g class="dust">${dust}</g>${spk}</svg>`;
  };

  class ApplianceAirQualityCard extends HTMLElement {
    get _config() { return this._c; } // nom standard lu par card-mod
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const f = (...cls) => ids.find((i) => i.startsWith('sensor.') && cls.includes(dc(i))) || '';
      const cfg = { entity_co2: f('carbon_dioxide'), entity_pm25: f('pm25'), entity_pm10: f('pm10'), entity_voc: f('volatile_organic_compounds', 'volatile_organic_compounds_parts'), entity_humidity: f('humidity'), entity_temperature: f('temperature') };
      const opt = { entity_pm1: f('pm1'), entity_nox: f('nitrogen_oxide'), entity_no2: f('nitrogen_dioxide'), entity_o3: f('ozone'), entity_co: f('carbon_monoxide'), entity_pressure: f('atmospheric_pressure', 'pressure'), entity_noise: f('sound_pressure') };
      for (const [k, v] of Object.entries(opt)) if (v) cfg[k] = v;
      return cfg;
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (!ORDER.some((k) => c[METRICS[k].opt])) throw new Error('At least one sensor is required (entity_co2, entity_pm25, entity_pm10, entity_voc, ...)');
      this._c = { show_status: true, show_chart: true, show_sparklines: true, ...c };
      this._built = false; this._hist = null; this._histAt = 0; this._live = {};
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _fmt(v, d) { try { return new Intl.NumberFormat(this._lang(), { maximumFractionDigits: d }).format(v); } catch (e) { return String(Math.round(v * 10 ** d) / 10 ** d); } }
    _dec(k, s) {
      const u = String((s && s.attributes && s.attributes.unit_of_measurement) || '').toLowerCase();
      if (k === 'pressure' && u.includes('inhg')) return 2;
      if ((k === 'co' || k === 'pm03') && (u.includes('µg') || u.includes('ug'))) return 1;
      return METRICS[k].dec != null ? METRICS[k].dec : 1;
    }

    // seuils : option thresholds {co2: [a, b, c], …} sinon seuils par défaut (adaptés à l'unité de l'entité)
    _th(k, s) {
      const o = this._c.thresholds && this._c.thresholds[k];
      if (Array.isArray(o) && o.length === 3 && o.every((x) => isFinite(Number(x)))) return o.map(Number);
      const u = String((s && s.attributes && s.attributes.unit_of_measurement) || '').toLowerCase();
      if (k === 'voc') return u.includes('µg') || u.includes('ug') || u.includes('mg') ? (u.includes('mg') ? [.3, 1, 3] : [300, 1000, 3000]) : u === 'ppm' ? [.22, .66, 2.2] : u === '' || u.includes('index') ? [100, 200, 300] : METRICS.voc.th;
      if (k === 'nox') return u === 'ppb' ? [20, 100, 200] : u === 'ppm' ? [.02, .1, .2] : u.includes('µg') || u.includes('ug') ? [40, 200, 400] : METRICS.nox.th;
      // formaldéhyde : seuils en µg/m³ convertis (mg/m³ ÷ 1000 ; 1 ppb ≈ 1,23 µg/m³)
      if (k === 'hcho') return u.includes('mg') ? [.03, .06, .1] : u === 'ppb' ? [24, 49, 81] : u === 'ppm' ? [.024, .049, .081] : METRICS.hcho.th;
      if (k === 'co2' && u === '%') return [.08, .1, .15];
      if (k === 'pm03' && (u.includes('µg') || u.includes('ug'))) return [10, 25, 40];
      if ((k === 'radon' || k === 'radon_long_term') && u.includes('pci')) return [2.7, 4, 8.1];
      if (k === 'co') return u.includes('mg') ? [10, 30, 60] : u.includes('µg') || u.includes('ug') ? [10000, 30000, 60000] : METRICS.co.th;
      if (k === 'no2') return u === 'ppb' ? [21, 53, 106] : u === 'ppm' ? [.021, .053, .106] : METRICS.no2.th;
      if (k === 'o3') return u === 'ppb' ? [30, 50, 90] : u === 'ppm' ? [.03, .05, .09] : METRICS.o3.th;
      if (k === 'propane' && u === 'ppm') return [500, 1000, 2000];
      return METRICS[k].th;
    }
    // niveau 0 (bon) … 3 (mauvais) d'une valeur
    _level(k, v, s) {
      if (!isFinite(v)) return -1;
      const M = METRICS[k];
      if (M.comfort) {
        const u = String((s && s.attributes && s.attributes.unit_of_measurement) || '').toLowerCase();
        const x = k === 'temperature' && /f/i.test(u) ? (v - 32) / 1.8
          : k === 'pressure' ? (u.includes('mmhg') ? v * 1.33322 : u.includes('kpa') ? v * 10 : u.includes('inhg') ? v * 33.8639 : v)
          : v;
        const [a, b, c, d] = M.comfort, m = M.margin || 8;
        return x >= a && x <= b ? 0 : x >= c && x <= d ? 1 : (x < c - m || x > d + m) ? 3 : 2;
      }
      return this._th(k, s).filter((t) => v >= t).length;
    }

    // historique 24 h du recorder (toutes les entités en un appel, rafraîchi toutes les 10 min) + valeurs vues en direct
    _loadHist() {
      const h = this._hass, ids = ORDER.map((k) => this._c[METRICS[k].opt]).filter(Boolean);
      if (!ids.length || this._histBusy || Date.now() - this._histAt < 10 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - 24 * 3600e3;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          const out = {};
          ids.forEach((id) => { out[id] = ((r && r[id]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: parseFloat(p.s) })).filter((p) => isFinite(p.v) && isFinite(p.t)); });
          this._hist = out;
        }).catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; if (this._hass) this._render(); });
    }
    _series(id) {
      const now = Date.now(), cur = this._num(this._st(id)), L = (this._live[id] = this._live[id] || []);
      if (isFinite(cur) && (!L.length || now - L[L.length - 1].t > 60000)) L.push({ t: now, v: cur });
      while (L.length && L[0].t < now - 24 * 3600e3) L.shift();
      const H = ((this._hist && this._hist[id]) || []).filter((p) => p.t >= now - 24 * 3600e3);
      const lastH = H.length ? H[H.length - 1].t : 0;
      const pts = [...H, ...L.filter((p) => p.t > lastH)];
      if (isFinite(cur)) pts.push({ t: now, v: cur });
      return pts;
    }
    // regroupe en n cases (moyenne), une case vide reprend la dernière valeur
    _bucket(pts, n) {
      const end = Date.now(), start = end - 24 * 3600e3, step = (end - start) / n, out = [];
      let i = 0, last = null;
      while (i < pts.length && pts[i].t < start) { last = pts[i].v; i++; }
      for (let k = 0; k < n; k++) {
        const b1 = start + (k + 1) * step; let s = 0, c = 0;
        while (i < pts.length && pts[i].t < b1) { s += pts[i].v; c++; last = pts[i].v; i++; }
        out.push(c ? s / c : last);
      }
      return out;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="aq-wrap">
        <div class="head"><div class="title" id="aqtitle"></div><div class="badge" id="aqbadge"></div></div>
        <div class="hero">${face(this._c.name || this._t('name'))}<div class="sub" id="aqsub"></div></div>
        <div class="tiles">${ORDER.map((k) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${METRICS[k].icon}"></ha-icon><span></span></div><div class="v"></div><svg viewBox="0 0 100 22" preserveAspectRatio="none"></svg></div>`).join('')}</div>
        <div class="chart hide" id="aqchart"><div class="ct"><b id="aqct"></b><span class="cv" id="aqcv"></span></div><div id="aqcc"></div></div>
      </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg.face'), () => this._more(this._sel && this._c[METRICS[this._sel].opt]));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => { this._sel = el.dataset.k; this._userSel = true; this._render(); }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => {
        const w = Math.round(this._card.clientWidth || 0);
        if (w && w !== this._lastW && this._lastRow) { this._lastW = w; this._drawChart(this._lastRow); }
      }).observe(this._card);
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      this._loadHist();
      const rows = ORDER.filter((k) => c[METRICS[k].opt]).map((k) => {
        const id = c[METRICS[k].opt], s = this._st(id), v = this._num(s), lv = this._level(k, v, s);
        return { k, id, s, v, lv, M: METRICS[k], unit: (s && s.attributes && s.attributes.unit_of_measurement) || METRICS[k].unit };
      });
      const live = rows.filter((x) => x.lv >= 0);
      // pire polluant (humidité et température exclues de l'indicateur)
      const pol = live.filter((x) => x.M.poll);
      const worst = pol.reduce((a, x) => (!a || x.lv > a.lv ? x : a), null);
      const level = !live.length ? -1 : worst ? worst.lv : Math.max(...live.map((x) => x.lv));
      const lvC = Math.max(0, level);
      card.className = `${level < 0 ? 'unavailable' : 'lv' + lvC}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('aqtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('aqbadge'); badge.textContent = level < 0 ? this._t('unavailable') : this._t(LEVELS[lvC]); badge.style.display = c.show_status === false ? 'none' : '';
      // anneau : remplissage = niveau (¼ → plein), visage et bouche
      r.getElementById('aqring').setAttribute('stroke-dasharray', `${(level < 0 ? 0 : (lvC + 1) / 4 * 414.7).toFixed(1)} 415`);
      r.getElementById('aqmouth').setAttribute('d', MOUTH[lvC]);
      r.getElementById('aqextra').innerHTML = lvC === 3 ? '<path d="M-26 -22 L-10 -17M26 -22 L10 -17" stroke="#2b2f36" stroke-width="3" stroke-linecap="round"/>' : lvC === 2 ? '<path d="M30 -2 q4 7 0 11 q-4 -4 0 -11Z" fill="#6ab7ff"/>' : '';
      r.getElementById('aqsub').textContent = level < 0 ? '' : lvC === 0 || !worst ? this._t('all_good') : `${this._t('main')} : ${this._l(worst.k)} ${this._fmt(worst.v, this._dec(worst.k, worst.s))} ${worst.unit}`;

      // choix de la mesure du graphique : celle cliquée, sinon la pire, sinon la première
      if (!this._sel || !rows.find((x) => x.k === this._sel) || !this._userSel) this._sel = (worst || rows[0] || {}).k;
      const COL = ['var(--aq-c0)', 'var(--aq-c1)', 'var(--aq-c2)', 'var(--aq-c3)'];
      ORDER.forEach((k) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), x = rows.find((y) => y.k === k);
        el.classList.toggle('hide', !x);
        if (!x) return;
        el.style.setProperty('--tc', x.lv < 0 ? '#8a929a' : COL[x.lv]);
        el.classList.toggle('sel', this._sel === k && c.show_chart !== false);
        el.querySelector('.l span').textContent = this._l(k);
        const d = this._dec(k, x.s), small = document.createElement('small'); small.textContent = isFinite(x.v) ? x.unit : '';
        el.querySelector('.v').replaceChildren(isFinite(x.v) ? this._fmt(x.v, d) : '--', small);
        const sv = el.querySelector('svg'); sv.style.display = c.show_sparklines === false ? 'none' : '';
        if (c.show_sparklines !== false) {
          const b = this._bucket(this._series(x.id), 36).map((v) => (v == null ? NaN : v)), f = b.filter(isFinite);
          if (f.length > 1) {
            const mn = Math.min(...f), mx = Math.max(...f), rg = mx - mn || 1;
            const P = b.map((v, i) => (isFinite(v) ? [i / (b.length - 1) * 100, 19 - (v - mn) / rg * 16] : null)).filter(Boolean);
            sv.innerHTML = `<polyline points="${P.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${x.lv < 0 ? '#8a929a' : COL[x.lv]}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".85"/>`;
          } else sv.innerHTML = '';
        }
      });
      this._lastRow = rows.find((x) => x.k === this._sel);
      this._drawChart(this._lastRow);
    }

    // courbe 24 h de la mesure choisie, avec bandes de seuils colorées et infobulle
    _drawChart(x) {
      const r = this._root, box = r.getElementById('aqchart'), c = this._c;
      box.classList.toggle('hide', !x || c.show_chart === false);
      if (!x || c.show_chart === false) return;
      const COL = ['var(--aq-c0)', 'var(--aq-c1)', 'var(--aq-c2)', 'var(--aq-c3)'];
      r.getElementById('aqct').textContent = `${this._l(x.k)} · ${this._t('last24')}`;
      const cv = r.getElementById('aqcv'); cv.textContent = isFinite(x.v) ? `${this._fmt(x.v, this._dec(x.k, x.s))} ${x.unit}` : ''; box.style.setProperty('--tc', x.lv < 0 ? '#8a929a' : COL[x.lv]);
      const cc = r.getElementById('aqcc'), pts = this._series(x.id).filter((p) => isFinite(p.v));
      if (pts.length < 2) { cc.innerHTML = `<div class="msg">${esc(this._t(this._hist === null && this._histAt ? 'no_history' : 'loading'))}</div>`; return; }
      const cw = Math.round(cc.clientWidth || (this._card && this._card.clientWidth - 40) || 0);
      this._lastW = Math.round((this._card && this._card.clientWidth) || 0);
      const now = Date.now(), t0 = now - 24 * 3600e3, W = Math.max(320, cw || 320), H = 115, L = 34, R = 6, Tp = 8, B = 20, iw = W - L - R, ih = H - Tp - B;
      const vals = pts.map((p) => p.v), th = x.M.th ? this._th(x.k, x.s) : null;
      let lo = Math.min(...vals), hi = Math.max(...vals);
      if (th) { lo = Math.min(lo, 0); hi = Math.max(hi, th[0] * 1.15); } else { const m = (hi - lo) * .15 || 1; lo -= m; hi += m; }
      const X = (t) => L + (t - t0) / (now - t0) * iw, Y = (v) => Tp + (1 - (v - lo) / (hi - lo)) * ih;
      let g = '';
      // bandes de seuils (polluants) ou plage de confort (humidité, température)
      if (th) {
        const e = [lo, ...th, Math.max(hi, th[2] * 1.2)], bandsHi = e[4];
        for (let i = 0; i < 4; i++) { const a = Math.min(e[i + 1], hi), b = Math.max(e[i], lo); if (a > b) g += `<rect x="${L}" y="${Y(a).toFixed(1)}" width="${iw}" height="${(Y(b) - Y(a)).toFixed(1)}" fill="${COL[i]}" opacity=".13"/>`; }
        let lastY = -99;
        th.forEach((t) => { if (t > lo && t < hi) { const yy = Y(t), show = Math.abs(yy - lastY) > 10; if (show) lastY = yy; g += `<line x1="${L}" x2="${W - R}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}" stroke="rgba(127,127,127,.35)" stroke-dasharray="3 3"/>${show ? `<text x="${L - 4}" y="${(yy + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--secondary-text-color)">${this._fmt(t, t < 10 ? 1 : 0)}</text>` : ''}`; } });
        void bandsHi;
      } else if (x.M.comfort) {
        const u = String((x.s && x.s.attributes && x.s.attributes.unit_of_measurement) || '').toLowerCase();
        const factor = x.k === 'pressure' ? (u.includes('mmhg') ? 1 / 1.33322 : u.includes('kpa') ? 0.1 : u.includes('inhg') ? 1 / 33.8639 : 1) : 1;
        const conv = (n) => (x.k === 'temperature' && /f/i.test(u) ? n * 1.8 + 32 : n * factor);
        const [a, b] = x.M.comfort.slice(0, 2).map(conv);
        g += `<rect x="${L}" y="${Y(Math.min(b, hi)).toFixed(1)}" width="${iw}" height="${Math.max(0, Y(Math.max(a, lo)) - Y(Math.min(b, hi))).toFixed(1)}" fill="var(--aq-c0)" opacity=".13"/>`;
      }
      // axe du bas : -24 h, -12 h, maintenant
      [[0, '-24 h'], [.5, '-12 h'], [1, this._t('now')]].forEach(([f, lab]) => { g += `<text x="${(L + f * iw).toFixed(1)}" y="${H - 5}" text-anchor="${f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}" font-size="9" fill="var(--secondary-text-color)">${esc(lab)}</text>`; });
      [lo, hi].forEach((v) => { if (!th) g += `<text x="${L - 4}" y="${(Y(v) + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--secondary-text-color)">${this._fmt(v, 0)}</text>`; });
      const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`).join('');
      const col = x.lv < 0 ? '#8a929a' : COL[x.lv];
      g += `<path d="${path}L${X(pts[pts.length - 1].t).toFixed(1)} ${Y(lo).toFixed(1)}L${X(pts[0].t).toFixed(1)} ${Y(lo).toFixed(1)}Z" fill="${col}" opacity=".16"/><path d="${path}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      const lp = pts[pts.length - 1]; g += `<circle cx="${X(lp.t).toFixed(1)}" cy="${Y(lp.v).toFixed(1)}" r="3.4" fill="${col}"/>`;
      g += '<g id="aqcur" style="display:none"><line y1="' + Tp + '" y2="' + (Tp + ih) + '" stroke="var(--secondary-text-color)" stroke-width="1" opacity=".6"/><circle r="3.6" fill="var(--primary-text-color)"/></g>';
      cc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(this._l(x.k))}">${g}<rect x="${L}" y="${Tp}" width="${iw}" height="${ih}" fill="transparent" id="aqhit"/></svg>`;
      // infobulle : valeur et heure du point le plus proche
      const svg = cc.querySelector('svg'), cur = svg.querySelector('#aqcur'), hit = svg.querySelector('#aqhit'), vEl = r.getElementById('aqcv'), base = vEl.textContent;
      const move = (ev) => {
        const rc = svg.getBoundingClientRect(), px = (ev.clientX - rc.left) / rc.width * W, t = t0 + Math.min(1, Math.max(0, (px - L) / iw)) * (now - t0);
        let best = pts[0]; for (const p of pts) if (Math.abs(p.t - t) < Math.abs(best.t - t)) best = p;
        cur.style.display = ''; cur.setAttribute('transform', `translate(${X(best.t).toFixed(1)} 0)`); cur.querySelector('circle').setAttribute('cy', Y(best.v).toFixed(1));
        const hhmm = window.applianceClock(this._hass, new Date(best.t), this._lang());
        vEl.textContent = `${this._fmt(best.v, this._dec(x.k, x.s))} ${x.unit} · ${hhmm}`;
      };
      const leave = () => { cur.style.display = 'none'; vEl.textContent = base; };
      hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move); hit.addEventListener('pointerleave', leave);
    }
  }
  customElements.define(TAG, ApplianceAirQualityCard);

  /* ---- éditeur visuel ---- */
  class ApplianceAirQualityCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        ...ORDER.map((k) => ent(METRICS[k].opt)),
        { name: 'thresholds', selector: { object: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_sparklines'), bool('show_chart'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceAirQualityCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Qualité de l\'air : visage animé selon le pire polluant, CO₂, PM0.3/1/2.5/4/10, COV, NOx, formaldéhyde, gaz, radon, O₂, humidité, température, pression, bruit, courbes 24 h.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/air-quality.md',
  });
})();
