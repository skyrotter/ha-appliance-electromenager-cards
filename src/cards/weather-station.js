/* Carte « Station météo » — custom:appliance-weather-station-card
 * Console de station météo dans le style Davis Vantage Pro2, entièrement dessinée en SVG, avec son écran LCD rétroéclairé redessiné en direct :
 * rose des vents (direction + vitesse), icône de prévision, phase de la lune, heure et date, température / humidité extérieures, baromètre avec
 * flèche de tendance (sur 3 h), température / humidité intérieures, une valeur au choix (indice de chaleur, point de rosée, UV…), pluie du jour et
 * intensité (parapluie quand il pleut), mini graphique sur 24 h et bandeau défilant (texte de prévision).
 * Sources : une entité weather.* (station locale ou météo du web) et / ou des capteurs séparés, tous facultatifs ; un capteur séparé l'emporte sur
 * l'attribut de l'entité météo.
 */
(() => {
  const TAG = 'appliance-weather-station-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n weather_station*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
.head.hide{display:none}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
svg{display:block;width:100%;max-width:calc(440px * var(--illus-scale,1));height:auto;margin:0 auto;cursor:pointer}
.lcdtxt{font-family:"Arial Narrow",Arial,Roboto,sans-serif;font-weight:700;fill:var(--ink)}
.seg{fill:var(--ink)}.ghost{fill:var(--ink);opacity:.07}
.tick{animation:wsticker var(--dur,14s) linear infinite}
.rainy .umb{opacity:1}.umb{opacity:0;transition:opacity .4s}
.noanim .tick{animation:none}
@keyframes wsticker{0%{transform:translateX(0)}100%{transform:translateX(var(--dx,-200px))}}
`;

  // chiffres 7 segments (penchés comme sur un écran LCD) : segments éteints en filigrane, allumés en encre ; ':' '.' '/' '-' gérés
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '' };
  const poly = (pts) => `M${pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('L')}Z`;
  const digitPaths = (x, w, h, t) => {
    const g = t * 0.14, hh = h / 2;
    const hb = (yc) => poly([[x + t * 0.5 + g, yc], [x + t + g, yc - t / 2], [x + w - t - g, yc - t / 2], [x + w - t * 0.5 - g, yc], [x + w - t - g, yc + t / 2], [x + t + g, yc + t / 2]]);
    const vb = (xc, y0, y1) => poly([[xc, y0], [xc + t / 2, y0 + t / 2], [xc + t / 2, y1 - t / 2], [xc, y1], [xc - t / 2, y1 - t / 2], [xc - t / 2, y0 + t / 2]]);
    return { a: hb(t / 2), g: hb(hh), d: hb(h - t / 2), f: vb(x + t / 2, t * 0.5 + g, hh - g), b: vb(x + w - t / 2, t * 0.5 + g, hh - g), e: vb(x + t / 2, hh + g, h - t * 0.5 - g), c: vb(x + w - t / 2, hh + g, h - t * 0.5 - g) };
  };
  // nombre aligné à droite sur xr ; (y, h) = haut et hauteur des chiffres ; w = largeur d'un chiffre
  const seg7 = (txt, xr, y, h, w, lean = 7) => {
    const t = Math.max(1.2, w * 0.2), gap = w * 0.22, s = String(txt);
    const widthOf = (ch) => (ch === '.' || ch === ':' ? t * 1.6 : ch === '/' ? w * 0.6 : w);
    const tw = [...s].reduce((a, ch) => a + widthOf(ch) + gap, -gap);
    let x = 0, out = '';
    for (const ch of s) {
      const cw = widthOf(ch);
      if (ch === '.') out += `<rect class="seg" x="${(x + cw / 2 - t * 0.55).toFixed(2)}" y="${(h - t * 1.1).toFixed(2)}" width="${(t * 1.1).toFixed(2)}" height="${(t * 1.1).toFixed(2)}"/>`;
      else if (ch === ':') out += `<rect class="seg" x="${(x + cw / 2 - t * 0.55).toFixed(2)}" y="${(h * 0.28).toFixed(2)}" width="${(t * 1.1).toFixed(2)}" height="${(t * 1.1).toFixed(2)}"/><rect class="seg" x="${(x + cw / 2 - t * 0.55).toFixed(2)}" y="${(h * 0.66).toFixed(2)}" width="${(t * 1.1).toFixed(2)}" height="${(t * 1.1).toFixed(2)}"/>`;
      else if (ch === '/') out += `<path class="seg" d="M${(x + cw * 0.15).toFixed(2)} ${h}L${(x + cw * 0.85).toFixed(2)} 0" stroke="var(--ink)" stroke-width="${(t * 0.8).toFixed(2)}"/>`;
      else {
        const P = digitPaths(x, cw, h, t), on = SEG[ch] ?? '';
        out += Object.keys(P).map((k) => `<path class="${on.includes(k) ? 'seg' : 'ghost'}" d="${P[k]}"/>`).join('');
      }
      x += cw + gap;
    }
    const x0 = xr - tw + h * Math.tan(lean * Math.PI / 180) * 0.5;
    return `<g transform="translate(${x0.toFixed(2)} ${y}) skewX(${-lean})">${out}</g>`;
  };

  // icônes de prévision (traits de l'encre LCD), centrées sur (0,0), environ 30 × 22
  const CLOUD = '<path d="M-9 6h17a5.5 5.5 0 0 0 0-11 7.5 7.5 0 0 0-14-1.5A5.5 5.5 0 0 0-9 6z" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>';
  const SUN = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="var(--ink)" stroke-width="1.6"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return `<path d="M${(x + c * (r + 2)).toFixed(1)} ${(y + s * (r + 2)).toFixed(1)}L${(x + c * (r + 5)).toFixed(1)} ${(y + s * (r + 5)).toFixed(1)}" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round"/>`; }).join('')}`;
  const ICON = (cond) => {
    const c = String(cond || '').toLowerCase();
    if (/sunny|clear/.test(c)) return SUN(0, 0, 5.5);
    if (/partly/.test(c)) return `${SUN(-6, -4, 4)}<g transform="translate(3 3) scale(.85)">${CLOUD}</g>`;
    if (/pour|rain/.test(c)) return `<g transform="translate(0 -4)">${CLOUD}</g>${[-6, 0, 6].map((x) => `<path d="M${x} 6l-2 5" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round"/>`).join('')}`;
    if (/snow|hail/.test(c)) return `<g transform="translate(0 -4)">${CLOUD}</g>${[-6, 0, 6].map((x) => `<circle cx="${x}" cy="9" r="1.3" fill="var(--ink)"/>`).join('')}`;
    if (/lightning|storm/.test(c)) return `<g transform="translate(0 -4)">${CLOUD}</g><path d="M1 3l-4 6h3l-2 5 5-7h-3z" fill="var(--ink)"/>`;
    if (/fog/.test(c)) return [-4, 0, 4].map((y) => `<path d="M-10 ${y}h20" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round"/>`).join('');
    if (/cloud/.test(c)) return CLOUD;
    return `${SUN(-6, -4, 4)}<g transform="translate(3 3) scale(.85)">${CLOUD}</g>`;
  };
  // phase de la lune (0 = nouvelle, 0,5 = pleine) calculée à partir de la date
  const moonPhase = (d = new Date()) => { const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14); return (((d.getTime() - ref) / 864e5) % syn + syn) % syn / syn; };
  const MOON = (cx, cy, r, p) => {
    const lit = p <= 0.5, k = Math.cos(2 * Math.PI * p), rx = Math.abs(k) * r, side = lit ? 1 : 0;
    // partie éclairée (en encre) : demi-disque d'un côté + ellipse du terminateur
    const half = `M${cx} ${cy - r}A${r} ${r} 0 0 ${side} ${cx} ${cy + r}`;
    const term = `A${rx.toFixed(2)} ${r} 0 0 ${(k > 0) === lit ? 1 - side : side} ${cx} ${cy - r}`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--ink)" stroke-width=".8" opacity=".5"/><path d="${half}${term}Z" fill="var(--ink)"/>`;
  };
  const CARD = { N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5, S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5, O: 270, NO: 315, SO: 225, ONO: 292.5, OSO: 247.5, NNO: 337.5, SSO: 202.5 };

  class ApplianceWeatherStationCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_weather: ids.find((i) => i.startsWith('weather.')) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { backlight: true, show_name: true, ...c };
      this._built = false; this._histAt = 0;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 30000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto', min_rows: 2 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k, d) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : d; }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return Number.isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || ''); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    // une mesure : capteur séparé s'il est renseigné, sinon attribut de l'entité weather.*
    _m(opt, attr, unitAttr, dflt) {
      const c = this._c;
      if (c[opt]) return { v: this._num(c[opt]), u: this._unit(c[opt], dflt) };
      const w = this._st(c.entity_weather), a = (w && w.attributes) || {};
      const v = parseFloat(a[attr]);
      return { v: Number.isFinite(v) ? v : NaN, u: String(a[unitAttr] || dflt || '') };
    }
    _bearing() {
      const c = this._c, raw = c.entity_wind_bearing ? (this._st(c.entity_wind_bearing) || {}).state : ((this._st(c.entity_weather) || {}).attributes || {}).wind_bearing;
      const n = parseFloat(raw); if (Number.isFinite(n)) return n;
      const k = String(raw || '').toUpperCase().trim(); return k in CARD ? CARD[k] : NaN;
    }

    // historique : 24 h pour le mini graphique, 3 h pour la tendance du baromètre (rafraîchi toutes les 10 min)
    _loadHist() {
      const h = this._hass, c = this._c, gid = c.entity_graph || c.entity_temp_out, ids = [...new Set([gid, c.entity_pressure].filter(Boolean))];
      if (!ids.length || this._histBusy || Date.now() - this._histAt < 10 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - 24 * 3600e3;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(), entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          const out = {};
          ids.forEach((id) => { out[id] = ((r && r[id]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: parseFloat(p.s) })).filter((p) => fin(p.v) && fin(p.t)); });
          this._hist = out;
        }).catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; if (this._hass) this._render(); });
    }
    // tendance du baromètre sur 3 h : -2 (baisse rapide) … +2 (hausse rapide)
    _trend(p) {
      const H = (this._hist && this._hist[this._c.entity_pressure]) || [];
      if (!fin(p) || !H.length) return null;
      const t0 = Date.now() - 3 * 3600e3, old = H.find((x) => x.t >= t0) || H[0];
      const d = p - old.v; return d > 2 ? 2 : d > 0.5 ? 1 : d < -2 ? -2 : d < -0.5 ? -1 : 0;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="head" id="wshead"><div class="title" id="wstitle"></div></div><div id="wsart"></div></ha-card>`;
      window.applianceBindIllus(this, root.getElementById('wsart'), () => this._more(this._c.entity_weather || this._c.entity_temp_out));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      this._loadHist();
      const c = this._c, r = this._root, hass = this._hass, loc = window.applianceLocale(c, hass);
      const f = (v, d) => (fin(v) ? v.toFixed(d) : '--');
      const w = this._st(c.entity_weather), cond = w ? String(w.state) : '';
      const tOut = this._m('entity_temp_out', 'temperature', 'temperature_unit', '°C'), hOut = this._m('entity_hum_out', 'humidity', '', '%');
      const pr = this._m('entity_pressure', 'pressure', 'pressure_unit', 'hPa'), ws = this._m('entity_wind_speed', 'wind_speed', 'wind_speed_unit', 'km/h');
      const tIn = { v: this._num(c.entity_temp_in), u: this._unit(c.entity_temp_in, '°C') }, hIn = { v: this._num(c.entity_hum_in), u: '%' };
      const ex = { v: this._num(c.entity_extra), u: this._unit(c.entity_extra, '') };
      const rd = { v: this._num(c.entity_rain_day), u: this._unit(c.entity_rain_day, 'mm') }, rr = { v: this._num(c.entity_rain_rate), u: this._unit(c.entity_rain_rate, 'mm/h') };
      const bear = this._bearing(), trend = this._trend(pr.v);
      const raining = (fin(rr.v) && rr.v > 0) || /rain|pour/.test(cond);
      this._card.className = `${raining ? 'rainy' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('wstitle').textContent = c.name || this._t('name');
      r.getElementById('wshead').classList.toggle('hide', c.show_name === false);
      const now = new Date(), h12 = !/^(fr|de|es|it|pt|nl|da|nb|cs|hu|pl|ro|ru|uk|sr)/i.test(String(loc || ''));
      let hh = now.getHours(); const ampm = h12 ? (hh >= 12 ? 'pm' : 'am') : ''; if (h12) hh = hh % 12 || 12;
      const time = `${hh}:${String(now.getMinutes()).padStart(2, '0')}`, date = h12 ? `${now.getMonth() + 1}/${now.getDate()}` : `${now.getDate()}/${now.getMonth() + 1}`;
      // mini graphique 24 h
      const gid = c.entity_graph || c.entity_temp_out, G = (this._hist && this._hist[gid]) || [];
      let plot = '';
      if (G.length > 1) {
        const t0 = Date.now() - 24 * 3600e3, cols = 24, vals = [];
        for (let i = 0; i < cols; i++) { const a = t0 + i * 3600e3, b = a + 3600e3, s = G.filter((p) => p.t >= a && p.t < b); if (s.length) vals.push([i, s.reduce((x, y) => x + y.v, 0) / s.length]); }
        const vs = vals.map((x) => x[1]), mn = Math.min(...vs), mx = Math.max(...vs), span = mx - mn || 1;
        plot = vals.map(([i, v]) => `<rect class="seg" x="${(38 + i * 2.75).toFixed(1)}" y="${(170 - (v - mn) / span * 26).toFixed(1)}" width="1.9" height="1.9"/>`).join('');
      }
      // bandeau : texte du capteur choisi, sinon la prévision traduite par Home Assistant
      const condTxt = cond ? ((hass.localize && hass.localize(`component.weather.entity_component._.state.${cond}`)) || cond.replace(/-/g, ' ')) : '';
      const ticker = String((c.entity_ticker && (this._st(c.entity_ticker) || {}).state) || [condTxt, fin(ws.v) ? `${this._t('wind')} ${f(ws.v, 0)} ${ws.u}` : ''].filter(Boolean).join('  ·  ') || this._t('name')).toUpperCase();
      const lcd = c.backlight === false ? ['#c9cfb7', '#aeb69a'] : ['#f6c46d', '#e7963d'];
      const L = (k, d) => esc(this._l(k, d));
      // pointeur du vent sur la rose
      const bx = 74, by = 95, br = 33, ba = (bear - 90) * Math.PI / 180;
      const ptr = fin(bear) ? `<path d="M${(bx + Math.cos(ba) * (br - 1)).toFixed(1)} ${(by + Math.sin(ba) * (br - 1)).toFixed(1)}l${(Math.cos(ba + 2.6) * 7).toFixed(1)} ${(Math.sin(ba + 2.6) * 7).toFixed(1)}l${(Math.cos(ba - 2.6) * 7 - Math.cos(ba + 2.6) * 7).toFixed(1)} ${(Math.sin(ba - 2.6) * 7 - Math.sin(ba + 2.6) * 7).toFixed(1)}z" fill="var(--ink)"/>` : '';
      const trendArrow = trend == null ? '' : `<g transform="translate(287 82) rotate(${-trend * 30})"><path d="M-7 0h11M1 -3.5l4 3.5-4 3.5" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      const keyL = [['HEAT', 'TEMP'], ['DEW', 'HUM'], ['CHILL', 'WIND'], ['SOLAR', 'RAIN DAY'], ['UV', 'RAIN YR'], ['ET', 'BAR']], keyR = [['LAMPS', '2nd'], ['TIME', 'FORECAST'], ['UNITS', 'GRAPH'], ['CLEAR', 'HI/LOW'], ['SET', 'ALARM'], ['', 'DONE']];
      const key = (x, y, top, txt) => `${top ? `<text x="${x + 20}" y="${y - 2}" text-anchor="middle" font-size="5.4" fill="#86b7e6" font-weight="600">${top}</text>` : ''}<rect x="${x}" y="${y}" width="40" height="10.5" rx="5.25" fill="#1a1f26" stroke="#5d6875" stroke-width=".7"/><text x="${x + 20}" y="${y + 7.6}" text-anchor="middle" font-size="5.6" fill="#e9eef3" font-weight="600">${txt}</text>`;
      const tickW = ticker.length * 6.3, dx = Math.max(0, tickW - 236);
      r.getElementById('wsart').innerHTML = `<svg viewBox="0 0 424 262" role="img" aria-label="${esc(c.name || this._t('name'))}" style="--ink:#2a1a0b">
        <defs>
          <linearGradient id="wsbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4552"/><stop offset=".55" stop-color="#2a3039"/><stop offset="1" stop-color="#1c2027"/></linearGradient>
          <linearGradient id="wslcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lcd[0]}"/><stop offset="1" stop-color="${lcd[1]}"/></linearGradient>
          <radialGradient id="wsglow" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
          <clipPath id="wstk"><rect x="36" y="200" width="250" height="12"/></clipPath>
        </defs>
        <ellipse cx="212" cy="256" rx="190" ry="5" fill="#000" opacity=".22"/>
        <path d="M24 10h376a18 18 0 0 1 18 18v200a20 20 0 0 1-20 20H26a20 20 0 0 1-20-20V28a18 18 0 0 1 18-18z" fill="url(#wsbody)" stroke="#11151a" stroke-width="1.2"/>
        <path d="M26 13h372" stroke="#fff" stroke-opacity=".12" stroke-width="1.4"/>
        <text x="28" y="27" font-size="12.5" font-weight="800" font-style="italic" fill="#f1f4f7" letter-spacing=".6">DAVIS</text><path d="M72 18h12l-3 9h-12z" fill="none" stroke="#f1f4f7" stroke-width="1.2"/>
        <rect x="20" y="33" width="282" height="190" rx="9" fill="#12161c" stroke="#4b5561" stroke-width="1"/>
        <rect x="27" y="39" width="268" height="178" rx="5" fill="url(#wslcd)"/><rect x="27" y="39" width="268" height="178" rx="5" fill="url(#wsglow)"/>
        <!-- rose des vents -->
        <circle cx="${bx}" cy="${by}" r="${br}" fill="none" stroke="var(--ink)" stroke-width="1.1"/>
        ${Array.from({ length: 16 }, (_, i) => { const a = i * 22.5 * Math.PI / 180, l = i % 4 === 0 ? 5 : 2.6; return `<path d="M${(bx + Math.sin(a) * br).toFixed(1)} ${(by - Math.cos(a) * br).toFixed(1)}L${(bx + Math.sin(a) * (br - l)).toFixed(1)} ${(by - Math.cos(a) * (br - l)).toFixed(1)}" stroke="var(--ink)" stroke-width="1"/>`; }).join('')}
        <text class="lcdtxt" x="${bx}" y="${by - br + 12}" text-anchor="middle" font-size="6.5">N</text><text class="lcdtxt" x="${bx + br - 9}" y="${by + 2.2}" text-anchor="middle" font-size="6.5">E</text>
        <text class="lcdtxt" x="${bx}" y="${by + br - 6}" text-anchor="middle" font-size="6.5">S</text><text class="lcdtxt" x="${bx - br + 9}" y="${by + 2.2}" text-anchor="middle" font-size="6.5">W</text>
        ${ptr}
        ${seg7(fin(ws.v) ? f(ws.v, 0) : '--', bx + 11, by - 10, 17, 9)}
        <text class="lcdtxt" x="${bx}" y="${by + 16}" text-anchor="middle" font-size="5.6">${esc(ws.u.toUpperCase())}</text>
        <text class="lcdtxt" x="38" y="50" font-size="5.2">${L('wind', 'WIND')}</text>
        <!-- prévision, lune, heure et date -->
        <g transform="translate(132 54)">${ICON(cond)}</g>
        ${MOON(166, 54, 7, moonPhase(now))}
        ${seg7(time, 236, 47, 13, 6.8)}<text class="lcdtxt" x="239" y="59" font-size="6">${ampm}</text>${seg7(date, 287, 47, 13, 6.8)}
        <!-- zone fixe : extérieur et baromètre -->
        <text class="lcdtxt" x="142" y="78" text-anchor="middle" font-size="6.2">${L('temp_out', 'TEMP OUT')}</text><text class="lcdtxt" x="196" y="78" text-anchor="middle" font-size="6.2">${L('hum_out', 'HUM OUT')}</text><text class="lcdtxt" x="252" y="78" text-anchor="middle" font-size="6.2">${L('barometer', 'BAROMETER')}</text>
        ${seg7(f(tOut.v, 1), 158, 82, 19, 9)}<text class="lcdtxt" x="160" y="88" font-size="6.5">${esc(tOut.u)}</text>
        ${seg7(f(hOut.v, 0), 206, 82, 19, 9)}<text class="lcdtxt" x="208" y="100" font-size="7">%</text>
        ${seg7(f(pr.v, pr.v >= 100 ? 0 : 2), 274, 82, 19, 8.6)}<text class="lcdtxt" x="275" y="100" font-size="5.5">${esc(pr.u)}</text>
        ${trendArrow}
        <!-- zone variable : intérieur et valeur au choix -->
        <rect x="113" y="108" width="178" height="40" fill="none" stroke="var(--ink)" stroke-width=".9"/>
        <text class="lcdtxt" x="142" y="116" text-anchor="middle" font-size="6">${L('temp_in', 'TEMP IN')}</text><text class="lcdtxt" x="196" y="116" text-anchor="middle" font-size="6">${L('hum_in', 'HUM IN')}</text><text class="lcdtxt" x="252" y="116" text-anchor="middle" font-size="6">${esc(String(c.extra_label || this._t('extra')).toUpperCase())}</text>
        ${seg7(c.entity_temp_in ? f(tIn.v, 1) : '--', 158, 120, 16, 7.6)}<text class="lcdtxt" x="160" y="126" font-size="6">${esc(tIn.u)}</text>
        ${seg7(c.entity_hum_in ? f(hIn.v, 0) : '--', 206, 120, 16, 7.6)}<text class="lcdtxt" x="208" y="136" font-size="6.5">%</text>
        ${seg7(c.entity_extra ? f(ex.v, ex.v >= 100 ? 0 : 1) : '--', 272, 120, 16, 7.6)}<text class="lcdtxt" x="274" y="136" font-size="5.5">${esc(ex.u)}</text>
        <!-- mini graphique 24 h -->
        <path d="M36 140V172H104" fill="none" stroke="var(--ink)" stroke-width=".9"/>
        ${[0, 1, 2, 3].map((i) => `<path d="M${36 + i * 22.6} 172v2" stroke="var(--ink)" stroke-width=".8"/>`).join('')}
        ${plot}
        <text class="lcdtxt" x="38" y="182" font-size="5">${L('last_24h', 'Last 24 hrs')}</text>
        <!-- pluie -->
        <g class="umb" transform="translate(122 166)"><path d="M-8 0a8 7 0 0 1 16 0z" fill="var(--ink)"/><path d="M0 0v7a2 2 0 0 1-4 0" fill="none" stroke="var(--ink)" stroke-width="1.3"/></g>
        <text class="lcdtxt" x="170" y="159" text-anchor="middle" font-size="6">${L('daily_rain', 'DAILY RAIN')}</text><text class="lcdtxt" x="252" y="159" text-anchor="middle" font-size="6">${L('rain_rate', 'RAIN RATE')}</text>
        ${seg7(c.entity_rain_day ? f(rd.v, 1) : '--', 188, 163, 16, 7.6)}<text class="lcdtxt" x="190" y="178" font-size="5.5">${esc(rd.u)}</text>
        ${seg7(c.entity_rain_rate ? f(rr.v, 1) : '--', 270, 163, 16, 7.6)}<text class="lcdtxt" x="272" y="178" font-size="5.5">${esc(rr.u)}</text>
        <text class="lcdtxt" x="220" y="192" text-anchor="middle" font-size="5">${L('station', 'STATION NO. 1')}</text>
        <!-- bandeau défilant -->
        <path d="M33 197h256" stroke="var(--ink)" stroke-width=".6" opacity=".6"/>
        <g clip-path="url(#wstk)"><text class="lcdtxt ${dx > 0 ? 'tick' : ''}" x="38" y="209.5" font-size="9.5" letter-spacing="1.4" style="--dx:${-dx - 20}px;--dur:${Math.max(8, dx / 18)}s" font-family="monospace">${esc(ticker)}</text></g>
        <!-- clavier -->
        ${keyL.map(([t, k], i) => key(312, 48 + i * 27, t, k)).join('')}
        ${keyR.map(([t, k], i) => key(364, 48 + i * 27, t, k)).join('')}
        <g transform="translate(392 222)"><rect x="-13" y="-13" width="26" height="26" rx="7" transform="rotate(45)" fill="#1a1f26" stroke="#5d6875" stroke-width=".7"/>
          ${[0, 90, 180, 270].map((a) => `<path d="M0 -12l3.5 4.5h-7z" fill="#8a96a3" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#2b323b"/></g>
        <text x="182" y="241" text-anchor="middle" font-size="14" font-style="italic" fill="#eef2f6" font-weight="600">Vantage <tspan font-weight="800">PRO2</tspan></text>
      </svg>`;
    }
  }
  customElements.define(TAG, ApplianceWeatherStationCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWeatherStationCardEditor extends HTMLElement {
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
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        ent('entity_weather', 'weather'),
        ent('entity_temp_out', 'sensor'), ent('entity_hum_out', 'sensor'), ent('entity_pressure', 'sensor'),
        ent('entity_wind_speed', 'sensor'), ent('entity_wind_bearing', 'sensor'),
        ent('entity_temp_in', 'sensor'), ent('entity_hum_in', 'sensor'),
        ent('entity_extra', 'sensor'), { name: 'extra_label', selector: { text: {} } },
        ent('entity_rain_day', 'sensor'), ent('entity_rain_rate', 'sensor'),
        ent('entity_graph', 'sensor'), ent('entity_ticker', ['sensor', 'input_text']),
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('backlight'), bool('show_name'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceWeatherStationCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Console de station météo dans le style Davis Vantage Pro2 : écran LCD rétroéclairé avec rose des vents, prévision, lune, températures, humidité, baromètre et tendance, pluie, graphique 24 h et bandeau défilant.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/weather-station.md',
  });
})();
