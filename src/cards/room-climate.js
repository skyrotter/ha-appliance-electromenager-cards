/* Carte « Climat de la pièce » — custom:appliance-room-climate-card
 * Carte compacte : température, humidité, tendance sur 1 h, courbe des 24 h, thermomètre et goutte animés,
 * badge de confort (seuils réglables), alertes de seuil, point de rosée, risque de moisissure / condensation,
 * conseil d'aération (capteurs extérieurs), fenêtre ouverte (capteur ou chute brutale de température),
 * batterie faible du capteur. Un clic ouvre un pop-up d'historique (24 h / 7 jours / 30 jours,
 * température, humidité ou les deux) lu dans les statistiques long terme de Home Assistant.
 * Calculs internes en °C, affichage dans l'unité choisie (window.applianceTemp, voir editor-labels.js).
 */
(() => {
  const TAG = 'appliance-room-climate-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n room_climate*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
  const BAD = /^(unavailable|unknown|none|)$/i;
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);

  /* ---- physique de l'air (°C, %) ---- */
  // point de rosée (formule de Magnus)
  const dewPoint = (t, rh) => { const a = 17.62, b = 243.12, g = Math.log(Math.max(1, rh) / 100) + (a * t) / (b + t); return (b * g) / (a - g); };
  // humidité absolue en g/m³ : compare l'air intérieur et extérieur (aérer n'assèche que si l'air extérieur contient moins d'eau)
  const absHum = (t, rh) => (6.112 * Math.exp((17.67 * t) / (t + 243.5)) * rh * 2.1674) / (273.15 + t);
  // température estimée de la face intérieure d'un double vitrage : la condensation apparaît quand le point de rosée l'atteint
  const glassTemp = (tin, tout) => tin - 0.3 * (tin - tout);

  const RANGES = { 1: { n: 96 }, 7: { n: 168 }, 30: { n: 180 } }; // nombre de points du graphique par période

  const CSS = `
:host{display:block;height:100%}
ha-card{height:100%;box-sizing:border-box;padding:12px 12px 8px;cursor:pointer;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center;
  --rc-heat:var(--appliance-heat-color,var(--state-climate-heat-color,#ff8a3d));--rc-cold:var(--appliance-cold-color,var(--state-climate-cool-color,#2b9af9));
  --rc-ok:var(--appliance-ok-color,var(--success-color,#43a047));--rc-alert:var(--appliance-alert-color,var(--error-color,#db4437));
  --rc-hum:var(--appliance-humidity-color,#26b5c9);--rc-dry:var(--appliance-warning-color,var(--warning-color,#e8a317));--c:var(--rc-ok)}
ha-card:focus-visible{outline:2px solid var(--c);outline-offset:-2px}
.warm{--c:var(--rc-heat)}.cool{--c:var(--rc-cold)}.humid{--c:var(--rc-hum)}.dry{--c:var(--rc-dry)}.alert{--c:var(--rc-alert)}.unavailable{--c:var(--disabled-text-color,#9e9e9e)}
/* halo de couleur qui « respire » selon le confort */
.halo{position:absolute;top:-50px;right:-40px;width:150px;height:150px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%);animation:rcbreathe 5s ease-in-out infinite}
.alert .halo{animation-duration:1.6s}
.head{display:flex;align-items:center;gap:6px;position:relative;min-width:0}
.name{flex:1;min-width:0;font-size:14px;font-weight:600;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hic{--mdc-icon-size:17px;flex:none;cursor:pointer}.hic[hidden]{display:none!important}
.win{color:var(--rc-cold)}.bat{color:var(--rc-alert)}
.chip{flex:none;font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:10px;color:var(--c);background:color-mix(in srgb,var(--c) 15%,transparent);white-space:nowrap}
.chip.hide{display:none}
.body{display:flex;align-items:center;gap:10px;margin-top:6px;position:relative}
.vals{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.vt{font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1;color:var(--primary-text-color);white-space:nowrap}
.vt small{font-size:14px;font-weight:600;color:var(--secondary-text-color);margin-left:1px}
.vh{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--secondary-text-color);white-space:nowrap}
.trend{font-size:11px}.trend.up{color:var(--rc-heat)}.trend.down{color:var(--rc-cold)}
.meta{display:flex;flex-wrap:wrap;column-gap:8px;font-size:11px;color:var(--secondary-text-color)}
.meta span{white-space:nowrap}
.meta:empty{display:none}
.gfx{display:flex;gap:4px;align-items:flex-end;flex:none;width:calc(52px * var(--illus-scale,1))}
.gfx svg{display:block;height:auto}
.gfx .th{width:38%}.gfx .dr{width:62%}
.merc{transform-origin:50% 100%;transform-box:fill-box;transition:y .8s,height .8s;animation:rcrise 1.4s cubic-bezier(.2,.8,.2,1) both,rcpulse 3s 1.4s ease-in-out infinite}
.wave{animation:rcwave 2.4s linear infinite}
.notes{display:flex;flex-direction:column;gap:2px;margin-top:6px;position:relative}
.notes:empty{display:none}
.note{display:flex;align-items:flex-start;gap:4px;font-size:11.5px;font-weight:500;color:var(--secondary-text-color);min-width:0}
.note span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3}
.note ha-icon{--mdc-icon-size:14px;flex:none;margin-top:1px}
.note.n-alert{color:var(--rc-alert);font-weight:600}.note.n-risk{color:var(--rc-hum)}.note.n-air{color:var(--rc-ok)}.note.n-win{color:var(--rc-cold)}
.spark{display:block;width:100%;height:24px;margin-top:6px;position:relative;animation:rcdraw 1.6s ease-out both}
.spark.hide{display:none}
.spark .l{fill:none;stroke:var(--c);stroke-width:1.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.spark .a{fill:color-mix(in srgb,var(--c) 14%,transparent)}
.unavailable .gfx{opacity:.5;filter:grayscale(1)}
.noanim .halo,.noanim .merc,.noanim .wave,.noanim .spark{animation:none}
@media (prefers-reduced-motion:reduce){.halo,.merc,.wave,.spark{animation:none}}
@keyframes rcbreathe{50%{transform:scale(1.15);opacity:.7}}
@keyframes rcrise{from{transform:scaleY(0)}}
@keyframes rcpulse{50%{transform:scaleY(.94)}}
@keyframes rcwave{to{transform:translateX(-20px)}}
@keyframes rcdraw{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
`;

  const DROP = 'M15 3C15 3 4 17 4 26a11 11 0 0 0 22 0C26 17 15 3 15 3Z';
  let uid = 0;

  class ApplianceRoomClimateCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const S = (hass && hass.states) || {}, ids = Object.keys(S), dc = (i, d) => i.startsWith('sensor.') && (S[i].attributes || {}).device_class === d;
      const out = /(outdoor|outside|exterieur|extérieur|ext_|_ext|weather|meteo|météo|garden|jardin)/i;
      const t = ids.find((i) => dc(i, 'temperature') && !out.test(i)) || '';
      const twin = t && t.replace(/temp(erature)?/i, 'humidity');
      const h = (twin && S[twin] && twin) || ids.find((i) => dc(i, 'humidity') && !out.test(i)) || '';
      return { entity_temperature: t, entity_humidity: h };
    }
    setConfig(c) {
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (window.applianceSize) window.applianceSize(this, c);
      this._c = { show_status: true, show_outdoor: true, show_dew_point: true, show_advice: true, show_graph: true,
        humidity_min: 35, humidity_max: 65, mold_humidity: 70, battery_low: 20, history_days: 7, history_mode: 'both', ...c };
      this._built = false; this._hist = null; this._histAt = 0;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); if (this._dlg) this._dlg.hass = h; }
    get hass() { return this._hass; }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 2; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 2 }; }

    /* ---- textes ---- */
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _fmt(v, d = 1) { return fin(v) ? v.toLocaleString(this._lang(), { minimumFractionDigits: d, maximumFractionDigits: d }) : '--'; }
    _tmp() { return window.applianceTemp(this._hass, this._c); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _raw(id) { const s = this._st(id); if (!s || BAD.test(String(s.state))) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return Number.isFinite(v) ? v : NaN; }
    // température d'une entité dans l'unité d'affichage
    _temp(id) { const v = this._raw(id); return fin(v) ? this._tmp().conv(v, this._st(id)) : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // seuil réglé dans l'éditeur (unité d'affichage), sinon valeur par défaut écrite en °C
    _thr(k, defC) { const v = this._c[k]; return v === '' || v == null || !Number.isFinite(Number(v)) ? (defC == null ? NaN : this._tmp().c(defC)) : Number(v); }
    _num(k, def) { const v = this._c[k]; return v === '' || v == null || !Number.isFinite(Number(v)) ? def : Number(v); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), id = `rc${++uid}`;
      root.innerHTML = `<style>${CSS}</style><ha-card tabindex="0" role="button">
        <div class="halo"></div>
        <div class="head"><span class="name" id="name"></span>
          <ha-icon class="hic win" id="win" icon="mdi:window-open-variant" hidden></ha-icon><ha-icon class="hic bat" id="bat" icon="mdi:battery-alert-variant-outline" hidden></ha-icon>
          <span class="chip" id="chip"></span></div>
        <div class="body"><div class="vals">
            <div class="vt"><span id="t">--</span><small id="tu"></small></div>
            <div class="vh"><span id="h"></span><span class="trend" id="trend"></span></div>
            <div class="meta" id="meta"></div></div>
          <div class="gfx">
            <svg class="th" viewBox="0 0 18 46" aria-hidden="true"><rect x="5" y="2" width="8" height="34" rx="4" fill="none" stroke="var(--secondary-text-color)" stroke-opacity=".45" stroke-width="1.5"/>
              <circle cx="9" cy="38" r="6.5" fill="var(--c)"/><rect class="merc" id="merc" x="7" y="20" width="4" height="18" rx="2" fill="var(--c)"/></svg>
            <svg class="dr" viewBox="0 0 30 42" aria-hidden="true"><defs><clipPath id="${id}"><path d="${DROP}"/></clipPath></defs>
              <path d="${DROP}" fill="var(--rc-hum)" fill-opacity=".12" stroke="var(--rc-hum)" stroke-width="1.5"/>
              <g clip-path="url(#${id})"><path class="wave" id="wave" fill="var(--rc-hum)" fill-opacity=".75" d=""/></g></svg>
          </div></div>
        <div class="notes" id="notes"></div>
        <svg class="spark hide" id="spark" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path class="a" d=""/><path class="l" d=""/></svg>
      </ha-card>`;
      const card = root.querySelector('ha-card');
      card.addEventListener('click', () => this._open());
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._open(); } });
      // icônes de l'en-tête : ouvrent la fiche de l'entité concernée
      root.getElementById('win').addEventListener('click', (e) => { if (this._c.entity_window) { e.stopPropagation(); this._more(this._c.entity_window); } });
      root.getElementById('bat').addEventListener('click', (e) => { e.stopPropagation(); this._more(this._c.entity_battery || this._c.entity_temperature || this._c.entity_humidity); });
      this._root = root; this._card = card; this._built = true;
    }

    /* ---- historique 24 h pour la courbe, la tendance et la détection d'ouverture de fenêtre ---- */
    _loadHist() {
      const c = this._c, h = this._hass, ids = [c.entity_temperature, c.entity_humidity].filter(Boolean);
      if (!ids.length || this._histBusy || Date.now() - this._histAt < 15 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - 24 * 3600e3;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
        entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          const pts = (id, f) => ((r && r[id]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: f(parseFloat(p.s)) })).filter((p) => Number.isFinite(p.t) && fin(p.v));
          const tmp = this._tmp(), ts = this._st(c.entity_temperature);
          this._hist = { t: c.entity_temperature ? pts(c.entity_temperature, (v) => tmp.conv(v, ts)) : [], h: c.entity_humidity ? pts(c.entity_humidity, (v) => v) : [] };
        })
        .catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; if (this._hass) this._render(); });
    }
    // série 24 h : historique + valeurs vues en direct (sans recorder, la courbe se construit au fil des mises à jour)
    _series(key, now, cur) {
      this._live = this._live || { t: [], h: [] };
      const L = this._live[key];
      if (fin(cur) && (!L.length || L[L.length - 1].v !== cur || now - L[L.length - 1].t > 10 * 60000)) L.push({ t: now, v: cur });
      while (L.length && L[0].t < now - 24 * 3600e3) L.shift();
      const H = ((this._hist && this._hist[key]) || []).filter((p) => p.t >= now - 24 * 3600e3);
      const last = H.length ? H[H.length - 1].t : 0;
      return H.concat(L.filter((p) => p.t > last));
    }
    // valeur d'une série à un instant (dernier point connu avant)
    _at(s, t) { let v = NaN; for (const p of s) { if (p.t > t) break; v = p.v; } return v; }

    _compute() {
      const c = this._c, now = Date.now(), tmp = this._tmp();
      const t = this._temp(c.entity_temperature), h = this._raw(c.entity_humidity);
      const tOut = this._temp(c.entity_outdoor_temperature), hOut = this._raw(c.entity_outdoor_humidity);
      const toC = (v) => tmp.toC(v);
      const sT = this._series('t', now, t), sH = this._series('h', now, h);
      const tMin = this._thr('comfort_temp_min', 19), tMax = this._thr('comfort_temp_max', 25);
      const hMin = this._num('humidity_min', 35), hMax = this._num('humidity_max', 65);
      const aTMax = this._thr('alert_temp_max'), aTMin = this._thr('alert_temp_min'), aHMax = this._num('alert_humidity_max', NaN), aHMin = this._num('alert_humidity_min', NaN);
      const ok = fin(t) || fin(h);
      // badge de confort
      let cls = 'ok', chip = 'comfort';
      if (!ok) { cls = 'unavailable'; chip = 'unavailable'; }
      else if (fin(t) && t > tMax) { cls = 'warm'; chip = 'warm'; }
      else if (fin(t) && t < tMin) { cls = 'cool'; chip = 'cool'; }
      else if (fin(h) && h > hMax) { cls = 'humid'; chip = 'humid'; }
      else if (fin(h) && h < hMin) { cls = 'dry'; chip = 'dry'; }
      // alertes de seuil : priorité sur le confort
      const alerts = [];
      if (fin(t) && fin(aTMax) && t >= aTMax) alerts.push(['too_hot', aTMax, tmp.unit]);
      if (fin(t) && fin(aTMin) && t <= aTMin) alerts.push(['too_cold', aTMin, tmp.unit]);
      if (fin(h) && fin(aHMax) && h >= aHMax) alerts.push(['too_humid', aHMax, ' %']);
      if (fin(h) && fin(aHMin) && h <= aHMin) alerts.push(['too_dry', aHMin, ' %']);
      if (alerts.length) { cls = 'alert'; chip = alerts[0][0]; }
      // point de rosée, moisissure, condensation (en °C)
      const tC = toC(t), dpC = fin(t) && fin(h) ? dewPoint(tC, h) : NaN;
      const mold = fin(h) && h >= this._num('mold_humidity', 70);
      const tOutC = toC(tOut);
      const cond = fin(dpC) && fin(tOutC) && tOutC < tC && dpC >= glassTemp(tC, tOutC);
      // fenêtre : capteur, sinon chute brutale (window_drop en 15 min ; 0 = désactivé)
      const winS = this._st(c.entity_window);
      const winOpen = !!winS && /^(on|open|opening|true)$/i.test(String(winS.state));
      const drop = this._num('window_drop', tmp.d(1.5));
      let winGuess = false, dropBy = 0;
      if (!c.entity_window && drop > 0 && fin(t)) {
        const recent = sT.filter((p) => p.t >= now - 15 * 60000).map((p) => p.v);
        dropBy = recent.length ? Math.max(...recent) - t : 0;
        winGuess = dropBy >= drop;
      }
      // conseil d'aération : l'air extérieur assèche (humidité absolue plus basse) ou rafraîchit la pièce
      let air = null;
      if (!winOpen && !winGuess && fin(tOutC) && fin(tC)) {
        if (fin(h) && fin(hOut) && h > hMax && absHum(tOutC, hOut) < absHum(tC, h) - 1) air = 'air_dry';
        else if (fin(t) && t > tMax && tOutC < tC - 2) air = 'air_cool';
      }
      // batterie du capteur : entité dédiée (binaire ou %), sinon attribut battery_level / battery du capteur
      let bat = NaN, batLow = false;
      const bs = this._st(c.entity_battery);
      if (bs && c.entity_battery.startsWith('binary_sensor.')) batLow = String(bs.state) === 'on';
      else {
        bat = this._raw(c.entity_battery);
        if (!fin(bat)) for (const id of [c.entity_temperature, c.entity_humidity]) { const a = (this._st(id) || {}).attributes || {}; const v = parseFloat(a.battery_level ?? a.battery); if (Number.isFinite(v)) { bat = v; break; } }
        batLow = fin(bat) && bat < this._num('battery_low', 20);
      }
      // tendance : écart avec la valeur d'il y a une heure
      const t1h = this._at(sT, now - 3600e3), trend = fin(t) && fin(t1h) ? t - t1h : NaN;
      return { t, h, tOut, hOut, dp: fin(dpC) ? tmp.c(dpC) : NaN, cls, chip, alerts, mold, cond, winOpen, winGuess, dropBy, air, bat, batLow, trend, sT, sH, tmp };
    }

    _render() {
      if (!this._built) this._build();
      this._loadHist();
      const c = this._c, r = this._root, s = this._compute(), tmp = s.tmp;
      this._card.className = `${s.cls}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('name').textContent = c.name || this._t('name');
      const chip = r.getElementById('chip');
      chip.textContent = this._l(s.chip); chip.classList.toggle('hide', c.show_status === false);
      r.getElementById('t').textContent = fin(s.t) ? this._fmt(s.t) : fin(s.h) ? `${this._fmt(s.h, 0)}` : '--';
      r.getElementById('tu').textContent = fin(s.t) || !fin(s.h) ? tmp.unit : ' %';
      r.getElementById('h').textContent = fin(s.t) && fin(s.h) ? `${this._fmt(s.h, 0)} %` : '';
      const tr = r.getElementById('trend'), dt = Math.round(s.trend * 10) / 10;
      tr.className = 'trend' + (dt > 0 ? ' up' : dt < 0 ? ' down' : '');
      tr.textContent = !fin(s.trend) ? '' : Math.abs(dt) < 0.2 ? `= ${this._t('stable')}` : `${dt > 0 ? '▲' : '▼'} ${this._fmt(Math.abs(dt))}°`;
      tr.title = this._t('trend_1h');
      // ligne d'infos : extérieur et point de rosée
      const meta = [];
      if (c.show_outdoor !== false && (fin(s.tOut) || fin(s.hOut))) meta.push(`${this._l('outdoor')} ${[fin(s.tOut) ? `${this._fmt(s.tOut)}°` : '', fin(s.hOut) ? `${this._fmt(s.hOut, 0)} %` : ''].filter(Boolean).join(' · ')}`);
      if (c.show_dew_point !== false && fin(s.dp)) meta.push(`${this._l('dew_point')} ${this._fmt(s.dp)}°`);
      r.getElementById('meta').innerHTML = meta.map((m) => `<span>${esc(m)}</span>`).join('');
      // icônes : fenêtre ouverte, batterie faible
      const win = r.getElementById('win'), bat = r.getElementById('bat');
      win.hidden = !(s.winOpen || s.winGuess);
      win.setAttribute('icon', s.winOpen ? 'mdi:window-open-variant' : 'mdi:window-open');
      win.title = this._t(s.winOpen ? 'window_open' : 'window_guess');
      bat.hidden = !s.batLow;
      bat.title = `${this._t('battery_low')}${fin(s.bat) ? ` (${Math.round(s.bat)} %)` : ''}`;
      // thermomètre (10 → 30 °C) et goutte (niveau = humidité)
      const pct = fin(s.t) ? Math.max(0.12, Math.min(1, (tmp.toC(s.t) - 10) / 20)) : 0.12, mh = 34 * pct;
      const merc = r.getElementById('merc'); merc.setAttribute('y', (36 - mh).toFixed(1)); merc.setAttribute('height', (mh + 2).toFixed(1));
      const lvl = (42 - 34 * ((fin(s.h) ? s.h : 0) / 100)).toFixed(1);
      r.getElementById('wave').setAttribute('d', `M0 ${lvl} q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 V50 H0Z`);
      // lignes d'alerte et de conseil (2 au plus)
      const notes = [];
      s.alerts.forEach(([k, v, u]) => notes.push(['n-alert', 'mdi:alert', `${this._l(k)} (${u === ' %' ? this._fmt(v, 0) : this._fmt(v)}${u})`]));
      if (s.winGuess) notes.push(['n-win', 'mdi:window-open', this._t('window_drop_note').replace('{n}', this._fmt(s.dropBy))]);
      if (c.show_advice !== false) {
        if (s.cond) notes.push(['n-risk', 'mdi:water-alert-outline', this._l('condensation_risk')]);
        else if (s.mold) notes.push(['n-risk', 'mdi:water-alert-outline', this._l('mold_risk')]);
        if (s.air) notes.push(['n-air', 'mdi:weather-windy', `${this._l('ventilate')} : ${this._t(s.air)}`]);
      }
      r.getElementById('notes').innerHTML = notes.slice(0, 2).map(([k, ic, txt]) => `<div class="note ${k}"><ha-icon icon="${ic}"></ha-icon><span title="${esc(txt)}">${esc(txt)}</span></div>`).join('');
      this._spark(fin(s.t) ? s.sT : s.sH);
    }

    // courbe des 24 h sous les valeurs
    _spark(pts) {
      const sp = this._root.getElementById('spark'), show = this._c.show_graph !== false && pts.length > 2;
      sp.classList.toggle('hide', !show);
      if (!show) return;
      const now = Date.now(), t0 = now - 24 * 3600e3, W = 300, H = 30, vs = pts.map((p) => p.v);
      const mn = Math.min(...vs), mx = Math.max(...vs), span = Math.max(mx - mn, 0.6);
      const x = (t) => ((Math.max(t0, t) - t0) / (now - t0)) * W, y = (v) => H - 2 - ((v - mn) / span) * (H - 6) - (span > mx - mn ? (span - (mx - mn)) / span * (H - 6) / 2 : 0);
      // marches d'escalier : un capteur garde sa valeur jusqu'au point suivant
      let d = `M0 ${y(pts[0].v).toFixed(1)}`;
      pts.forEach((p) => { d += `L${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`; });
      d += `L${W} ${y(pts[pts.length - 1].v).toFixed(1)}`;
      sp.querySelector('.l').setAttribute('d', d);
      sp.querySelector('.a').setAttribute('d', `${d}L${W} ${H}L0 ${H}Z`);
    }

    _open() {
      if (!this._c.entity_temperature && !this._c.entity_humidity) return;
      const dlg = document.createElement(TAG.replace('-card', '-dialog'));
      dlg.card = this; this._dlg = dlg;
      dlg.addEventListener('closed', () => { if (this._dlg === dlg) this._dlg = null; });
      document.body.appendChild(dlg);
    }
  }
  customElements.define(TAG, ApplianceRoomClimateCard);

  /* ---- pop-up d'historique ----
   * Ajouté à <body> (et non dans la carte) : un parent avec transform / contain n'emprisonne pas la superposition.
   * Les variables du thème sont recopiées depuis la carte, car <body> est hors de <home-assistant>.
   */
  const DCSS = `
:host{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;
  font-family:var(--paper-font-body1_-_font-family,var(--ha-font-family-body,Roboto,system-ui,sans-serif));-webkit-font-smoothing:antialiased}
.bd{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;transition:opacity .25s}
:host(.open) .bd{opacity:1}
.dlg{position:relative;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);border-radius:18px;
  width:min(640px,100%);max-height:92vh;overflow:auto;padding:16px 18px 18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.35);
  transform:translateY(20px) scale(.97);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .2s}
:host(.open) .dlg{transform:none;opacity:1}
.hd{display:flex;align-items:center;gap:10px}
.tt{flex:1;min-width:0}.tt b{display:block;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tt span{font-size:12px;color:var(--secondary-text-color,#727272)}
.x{width:36px;height:36px;border-radius:50%;border:none;background:rgba(127,127,127,.14);color:inherit;cursor:pointer;display:grid;place-items:center;flex:none}
.x ha-icon{--mdc-icon-size:20px}
.bar{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 10px}
.seg{display:flex;gap:3px;background:rgba(127,127,127,.12);padding:3px;border-radius:10px;flex:1;min-width:200px}
.seg.r{flex:0 1 auto;min-width:0}
.seg button{flex:1;border:none;background:none;color:var(--secondary-text-color,#727272);padding:6px 10px;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;white-space:nowrap}
.seg button.on{background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:10px}
.st{background:rgba(127,127,127,.09);border-radius:10px;padding:6px 9px;min-width:0}
.st span{display:block;font-size:11px;color:var(--secondary-text-color,#727272)}
.st b{display:block;font-size:15px;white-space:nowrap}.st i{display:block;font-style:normal;font-size:12px;color:var(--secondary-text-color,#727272)}
.chart{position:relative;min-height:120px}
.chart svg{display:block;width:100%;height:auto;overflow:visible;touch-action:pan-y}
.gl{stroke:var(--divider-color,rgba(127,127,127,.25))}
.chart text{fill:var(--secondary-text-color,#727272);font-size:10px}
.lt{fill:none;stroke:var(--rc-heat);stroke-width:2;stroke-linejoin:round}.lh{fill:none;stroke:var(--rc-hum);stroke-width:2;stroke-linejoin:round}
.lo{fill:none;stroke:var(--secondary-text-color,#888);stroke-width:1.4;stroke-dasharray:4 4;opacity:.8}
.bt{fill:color-mix(in srgb,var(--rc-heat) 16%,transparent)}.bh{fill:color-mix(in srgb,var(--rc-hum) 16%,transparent)}
.zone{fill:var(--rc-ok);fill-opacity:.09}
.anim{animation:rcdraw 1.1s ease-out both}
.msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--secondary-text-color,#727272)}
.tip{position:absolute;pointer-events:none;background:var(--primary-text-color,#212121);color:var(--ha-card-background,var(--card-background-color,#fff));font-size:11.5px;
  padding:5px 8px;border-radius:7px;white-space:nowrap;transform:translate(-50%,-115%);opacity:0;transition:opacity .15s}
.lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--secondary-text-color,#727272);margin-top:6px}
.lg i{display:inline-block;width:12px;height:3px;border-radius:2px;vertical-align:middle;margin-right:5px}
.days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-top:12px}
.days:empty{display:none}
.day{text-align:center;background:rgba(127,127,127,.07);border-radius:9px;padding:6px 2px;font-size:11px;color:var(--secondary-text-color,#727272);min-width:0}
.day b{display:block;color:var(--primary-text-color,#212121);font-size:12px;white-space:nowrap}
@media (max-width:480px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.days{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){.anim{animation:none}.dlg,.bd{transition:none}}
@keyframes rcdraw{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
`;
  const THEME = ['--ha-card-background', '--card-background-color', '--primary-text-color', '--secondary-text-color', '--divider-color', '--primary-color',
    '--paper-font-body1_-_font-family', '--ha-font-family-body', '--appliance-heat-color', '--appliance-humidity-color', '--appliance-ok-color', '--state-climate-heat-color', '--success-color'];

  class ApplianceRoomClimateDialog extends HTMLElement {
    connectedCallback() {
      const card = this.card, c = card._c, cs = getComputedStyle(card);
      THEME.forEach((v) => { const x = cs.getPropertyValue(v).trim(); if (x) this.style.setProperty(v, x); });
      this.style.setProperty('--rc-heat', cs.getPropertyValue('--appliance-heat-color').trim() || cs.getPropertyValue('--state-climate-heat-color').trim() || '#ff8a3d');
      this.style.setProperty('--rc-hum', cs.getPropertyValue('--appliance-humidity-color').trim() || '#26b5c9');
      this.style.setProperty('--rc-ok', cs.getPropertyValue('--appliance-ok-color').trim() || cs.getPropertyValue('--success-color').trim() || '#43a047');
      const days = [1, 7, 30].includes(Number(c.history_days)) ? Number(c.history_days) : 7;
      let mode = ['both', 'temperature', 'humidity'].includes(c.history_mode) ? c.history_mode : 'both';
      if (!c.entity_humidity) mode = 'temperature'; else if (!c.entity_temperature) mode = 'humidity';
      this._days = days; this._mode = mode; this._data = {};
      const t = (k) => card._l(k), both = c.entity_temperature && c.entity_humidity;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${DCSS}</style><div class="bd"></div>
        <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="ti">
          <div class="hd"><div class="tt"><b id="ti">${esc(c.name || card._t('name'))}</b><span>${esc(card._t('history'))}</span></div>
            <button class="x" aria-label="${esc(card._t('close'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
          <div class="bar">
            ${both ? `<div class="seg m">${[['both', 'both'], ['temperature', 'temperature'], ['humidity', 'humidity']].map(([m, k]) => `<button data-m="${m}">${esc(t(k))}</button>`).join('')}</div>` : ''}
            <div class="seg r">${[[1, 'h24'], [7, 'd7'], [30, 'd30']].map(([d, k]) => `<button data-d="${d}">${esc(t(k))}</button>`).join('')}</div>
          </div>
          <div class="stats" id="stats"></div>
          <div class="chart" id="chart"></div>
          <div class="lg" id="lg"></div>
          <div class="days" id="days"></div>
        </div>`;
      root.querySelector('.bd').addEventListener('click', () => this.close());
      root.querySelector('.x').addEventListener('click', () => this.close());
      root.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => { this._mode = b.dataset.m; this._draw(); }));
      root.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => { this._days = Number(b.dataset.d); this._load(); }));
      this._key = (e) => { if (e.key === 'Escape') this.close(); };
      window.addEventListener('keydown', this._key);
      this._root = root;
      requestAnimationFrame(() => { this.classList.add('open'); root.querySelector('.x').focus(); });
      this._load();
    }
    disconnectedCallback() { window.removeEventListener('keydown', this._key); }
    close() {
      this.classList.remove('open');
      setTimeout(() => { this.remove(); this.dispatchEvent(new CustomEvent('closed')); }, 250);
      if (this.card && this.card._card) this.card._card.focus();
    }

    // lecture : statistiques long terme (moyenne / min / max à l'heure) pour 7 et 30 jours, historique brut pour 24 h ou à défaut
    async _load() {
      const card = this.card, c = card._c, h = card._hass, days = this._days, key = days;
      this._draw();
      if (this._data[key] || this._busy === key) return;
      this._busy = key;
      const ids = { t: c.entity_temperature, h: c.entity_humidity, o: c.entity_outdoor_temperature, oh: c.entity_outdoor_humidity };
      const list = Object.values(ids).filter(Boolean), end = Date.now(), start = end - days * 86400e3;
      const tmp = card._tmp(), conv = { t: (v) => tmp.conv(v, card._st(ids.t)), o: (v) => tmp.conv(v, card._st(ids.o)), h: (v) => v, oh: (v) => v };
      const out = { t: [], h: [], o: [], oh: [] };
      if (!h || typeof h.callWS !== 'function') { this._data[key] = { err: true, ...out }; this._busy = 0; this._draw(); return; }
      try {
        let stats = {};
        if (days > 1) {
          stats = await h.callWS({ type: 'recorder/statistics_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
            statistic_ids: list, period: 'hour', types: ['mean', 'min', 'max'] }).catch(() => ({}));
        }
        const missing = list.filter((id) => !(stats && stats[id] && stats[id].length));
        let hist = {};
        if (missing.length) {
          hist = await h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
            entity_ids: missing, minimal_response: true, no_attributes: true, significant_changes_only: false }).catch(() => ({}));
        }
        for (const [k, id] of Object.entries(ids)) {
          if (!id) continue;
          const f = conv[k];
          if (stats && stats[id] && stats[id].length) {
            out[k] = stats[id].map((p) => {
              const t0 = typeof p.start === 'number' ? p.start : Date.parse(p.start);
              const m = parseFloat(p.mean), mn = parseFloat(p.min), mx = parseFloat(p.max);
              return { t: t0 + 1800e3, v: f(m), mn: f(Number.isFinite(mn) ? mn : m), mx: f(Number.isFinite(mx) ? mx : m) };
            }).filter((p) => fin(p.v));
          } else {
            out[k] = ((hist && hist[id]) || []).map((p) => { const v = f(parseFloat(p.s)); return { t: (p.lu ?? p.lc) * 1000, v, mn: v, mx: v }; }).filter((p) => fin(p.v) && Number.isFinite(p.t));
          }
        }
        this._data[key] = out;
      } catch (e) { this._data[key] = { err: true, ...out }; }
      this._busy = 0;
      if (this._days === key) this._draw(true);
    }

    // regroupe les points en n cases régulières (moyenne, min, max) ; une case vide garde la dernière valeur connue
    _bucket(pts, start, end, n) {
      const step = (end - start) / n, B = [];
      let i = 0, last = null;
      while (i < pts.length && pts[i].t < start) { last = pts[i]; i++; }
      for (let k = 0; k < n; k++) {
        const b0 = start + k * step, b1 = b0 + step;
        let sum = 0, cnt = 0, mn = Infinity, mx = -Infinity;
        while (i < pts.length && pts[i].t < b1) { const p = pts[i]; sum += p.v; cnt++; mn = Math.min(mn, p.mn); mx = Math.max(mx, p.mx); last = p; i++; }
        if (cnt) B.push({ t: b0 + step / 2, v: sum / cnt, mn, mx });
        else if (last && b0 >= pts[0].t - step) B.push({ t: b0 + step / 2, v: last.v, mn: last.v, mx: last.v });
        else B.push(null);
      }
      return B;
    }

    _draw(anim) {
      const r = this._root, card = this.card, c = card._c, days = this._days, mode = this._mode, tmp = card._tmp(), lang = card._lang();
      r.querySelectorAll('[data-m]').forEach((b) => b.classList.toggle('on', b.dataset.m === mode));
      r.querySelectorAll('[data-d]').forEach((b) => b.classList.toggle('on', Number(b.dataset.d) === days));
      const D = this._data[days], chart = r.getElementById('chart');
      const showT = mode !== 'humidity' && !!c.entity_temperature, showH = mode !== 'temperature' && !!c.entity_humidity;
      // valeurs actuelles, ajoutées en fin de série
      const curT = card._temp(c.entity_temperature), curH = card._raw(c.entity_humidity);
      const fT = (v) => `${card._fmt(v)}${tmp.unit}`, fH = (v) => `${card._fmt(v, 0)} %`;
      if (!D) { chart.innerHTML = `<div class="msg">${esc(card._t('loading'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }
      if (D.err || (!D.t.length && !D.h.length)) { chart.innerHTML = `<div class="msg">${esc(card._t('no_history'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }
      const end = Date.now(), start = end - days * 86400e3, n = RANGES[days].n;
      const withCur = (s, v) => (fin(v) ? s.concat([{ t: end - 1, v, mn: v, mx: v }]) : s);
      const sT = this._bucket(withCur(D.t, curT), start, end, n), sH = this._bucket(withCur(D.h, curH), start, end, n);
      const sO = this._bucket(D.o, start, end, n), sOH = this._bucket(D.oh, start, end, n);
      const vals = (s) => s.filter(Boolean);
      if (!vals(sT).length && !vals(sH).length) { chart.innerHTML = `<div class="msg">${esc(card._t('no_history'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }

      // tuiles : actuelle, moyenne, min, max
      const agg = (s) => { const v = vals(s); return v.length ? { avg: v.reduce((a, p) => a + p.v, 0) / v.length, min: Math.min(...v.map((p) => p.mn)), max: Math.max(...v.map((p) => p.mx)) } : null; };
      const aT = agg(sT), aH = agg(sH);
      const tile = (lbl, vt, vh) => `<div class="st"><span>${esc(card._l(lbl))}</span>${showT ? `<b>${fin(vt) ? fT(vt) : '--'}</b>` : ''}${showH ? (showT ? `<i>${fin(vh) ? fH(vh) : '--'}</i>` : `<b>${fin(vh) ? fH(vh) : '--'}</b>`) : ''}</div>`;
      r.getElementById('stats').innerHTML = tile('current', curT, curH) + tile('average', aT?.avg, aH?.avg) + tile('min', aT?.min, aH?.min) + tile('max', aT?.max, aH?.max);

      // échelles
      const W = 600, H = 210, L = 34, R = showT && showH ? 34 : 10, Tp = 8, B = 22, iw = W - L - R, ih = H - Tp - B;
      const x = (k) => L + ((k + 0.5) / n) * iw;
      const scale = (lists, pad, step, lo, hi) => {
        const all = lists.flatMap((s) => vals(s).flatMap((p) => [p.mn, p.mx]));
        let a = Math.min(...all), b = Math.max(...all);
        if (!all.length) { a = 0; b = 1; }
        a = Math.floor((a - pad) / step) * step; b = Math.ceil((b + pad) / step) * step;
        if (lo != null) a = Math.max(lo, a); if (hi != null) b = Math.min(hi, b);
        if (b - a < step * 2) b = a + step * 2;
        return [a, b];
      };
      const [t0, t1] = scale(mode === 'temperature' ? [sT, sO] : [sT], 0.3, 1);
      const [h0, h1] = scale(mode === 'humidity' ? [sH, sOH] : [sH], 2, 5, 0, 100);
      const yT = (v) => Tp + ih - ((v - t0) / (t1 - t0)) * ih, yH = (v) => Tp + ih - ((v - h0) / (h1 - h0)) * ih;
      const line = (s, y, k = 'v') => { let d = '', pen = false; s.forEach((p, i) => { if (!p) { pen = false; return; } d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p[k]).toFixed(1)}`; pen = true; }); return d; };
      const band = (s, y) => { // bande min-max, segment par segment (les trous coupent la bande)
        let d = '', seg = [];
        const flush = () => { if (seg.length > 1) d += `M${seg.map(([i, p]) => `${x(i).toFixed(1)} ${y(p.mx).toFixed(1)}`).join('L')}L${seg.slice().reverse().map(([i, p]) => `${x(i).toFixed(1)} ${y(p.mn).toFixed(1)}`).join('L')}Z`; seg = []; };
        s.forEach((p, i) => { if (p) seg.push([i, p]); else flush(); }); flush();
        return d;
      };
      let g = '';
      for (let k = 0; k <= 4; k++) {
        const yy = Tp + (ih * k) / 4;
        g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/>`;
        if (showT) g += `<text x="${L - 5}" y="${yy + 3}" text-anchor="end">${card._fmt(t1 - ((t1 - t0) * k) / 4, t1 - t0 < 4 ? 1 : 0)}°</text>`;
        if (showH) g += `<text x="${showT ? W - R + 5 : L - 5}" y="${yy + 3}" text-anchor="${showT ? 'start' : 'end'}">${Math.round(h1 - ((h1 - h0) * k) / 4)}%</text>`;
      }
      // repères de temps : toutes les 4 h (24 h), chaque jour (7 j), tous les 5 jours (30 j)
      const xt = (t) => L + ((t - start) / (end - start)) * iw;
      const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
      if (days === 1) {
        const first = new Date(start); first.setMinutes(0, 0, 0); first.setHours(first.getHours() + 1);
        for (let t = first.getTime(); t < end; t += 3600e3) {
          if (new Date(t).getHours() % 4) continue;
          g += `<line class="gl" x1="${xt(t)}" x2="${xt(t)}" y1="${Tp}" y2="${Tp + ih}" stroke-dasharray="2 3"/><text x="${xt(t)}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { hour: 'numeric' }).format(t)}</text>`;
        }
      } else {
        for (let t = dayStart(start) + 86400e3; t < end; t = dayStart(t + 30 * 3600e3)) {
          const dd = new Date(t), lbl = days === 7 || dd.getDate() % 5 === 1;
          g += `<line class="gl" x1="${xt(t)}" x2="${xt(t)}" y1="${Tp}" y2="${Tp + ih}" stroke-dasharray="2 3" ${days === 30 && !lbl ? 'opacity=".35"' : ''}/>`;
          if (days === 7) g += `<text x="${Math.min(W - R - 12, xt(t + 43200e3))}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(t)}</text>`;
          else if (lbl) g += `<text x="${xt(t)}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(t)}</text>`;
        }
      }
      // zone de confort (une seule mesure affichée)
      const ct0 = card._thr('comfort_temp_min', 19), ct1 = card._thr('comfort_temp_max', 25), ch0 = card._num('humidity_min', 35), ch1 = card._num('humidity_max', 65);
      const zone = (a, b, y, lo, hi) => { const ya = y(Math.min(hi, Math.max(lo, b))), yb = y(Math.min(hi, Math.max(lo, a))); return yb - ya > 0 ? `<rect class="zone" x="${L}" width="${iw}" y="${ya}" height="${yb - ya}"/>` : ''; };
      if (showT && !showH) g += zone(ct0, ct1, yT, t0, t1);
      if (showH && !showT) g += zone(ch0, ch1, yH, h0, h1);
      const A = anim ? ' anim' : '';
      if (showT && !showH) g += `<path class="bt${A}" d="${band(sT, yT)}"/>`;
      if (showH && !showT) g += `<path class="bh${A}" d="${band(sH, yH)}"/>`;
      if (showT && !showH && vals(sO).length) g += `<path class="lo${A}" d="${line(sO, yT)}"/>`;
      if (showH && !showT && vals(sOH).length) g += `<path class="lo${A}" d="${line(sOH, yH)}"/>`;
      if (showT) g += `<path class="lt${A}" d="${line(sT, yT)}"/>`;
      if (showH) g += `<path class="lh${A}" d="${line(sH, yH)}"/>`;
      g += `<line id="cur" y1="${Tp}" y2="${Tp + ih}" stroke="var(--secondary-text-color,#888)" opacity="0"/>`;
      chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(card._t('history'))}">${g}<rect x="${L}" y="${Tp}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;

      // survol / toucher : infobulle date + valeurs
      const svg = chart.querySelector('svg'), tip = chart.querySelector('.tip'), cur = chart.querySelector('#cur');
      const fmtD = new Intl.DateTimeFormat(lang, days === 1 ? { hour: '2-digit', minute: '2-digit' } : days === 7 ? { weekday: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      const move = (e) => {
        const b = svg.getBoundingClientRect(), px = ((e.touches ? e.touches[0].clientX : e.clientX) - b.left) / b.width * W;
        const k = Math.max(0, Math.min(n - 1, Math.floor(((px - L) / iw) * n)));
        const pt = sT[k], ph = sH[k], po = mode === 'humidity' ? sOH[k] : sO[k];
        if (!(showT && pt) && !(showH && ph)) { tip.style.opacity = 0; return; }
        cur.setAttribute('x1', x(k)); cur.setAttribute('x2', x(k)); cur.setAttribute('opacity', '.5');
        const yy = showT && pt ? yT(pt.v) : yH(ph.v);
        tip.style.left = `${(x(k) / W) * 100}%`; tip.style.top = `${(yy / H) * b.height}px`; tip.style.opacity = 1;
        const parts = [];
        if (showT && pt) parts.push(`<b>${fT(pt.v)}</b>`);
        if (showH && ph) parts.push(`<b>${fH(ph.v)}</b>`);
        if (!(showT && showH) && po) parts.push(`${esc(card._l('outdoor'))} ${showT ? fT(po.v) : fH(po.v)}`);
        tip.innerHTML = `${esc(fmtD.format((pt || ph).t))} · ${parts.join(' · ')}`;
      };
      const leave = () => { tip.style.opacity = 0; cur.setAttribute('opacity', '0'); };
      svg.addEventListener('mousemove', move); svg.addEventListener('touchmove', move, { passive: true });
      svg.addEventListener('touchstart', move, { passive: true }); svg.addEventListener('mouseleave', leave);

      // légende
      const lg = [];
      if (showT) lg.push(`<span><i style="background:var(--rc-heat)"></i>${esc(card._l('temperature'))}</span>`);
      if (showH) lg.push(`<span><i style="background:var(--rc-hum)"></i>${esc(card._l('humidity'))}</span>`);
      if (!(showT && showH) && vals(mode === 'humidity' ? sOH : sO).length) lg.push(`<span><i style="background:repeating-linear-gradient(90deg,var(--secondary-text-color,#888) 0 4px,transparent 4px 7px)"></i>${esc(card._l('outdoor'))}</span>`);
      if (!(showT && showH)) lg.push(`<span><i style="background:var(--rc-ok);opacity:.35;height:8px"></i>${esc(card._l('ideal_zone'))} ${showT ? `${card._fmt(ct0, 0)}–${card._fmt(ct1, 0)}°` : `${ch0}–${ch1} %`}</span>`);
      r.getElementById('lg').innerHTML = lg.join('');

      // récapitulatif par jour (7 jours)
      let dh = '';
      if (days === 7) {
        const by = new Map();
        sT.forEach((p, i) => { const q = p || sH[i]; if (!q) return; const k = dayStart(q.t); if (!by.has(k)) by.set(k, { t: [], h: [] }); if (p) by.get(k).t.push(p); if (sH[i]) by.get(k).h.push(sH[i]); });
        sH.forEach((p) => { if (!p) return; const k = dayStart(p.t); if (!by.has(k)) by.set(k, { t: [], h: [] }); if (!c.entity_temperature) by.get(k).h.push(p); });
        dh = [...by.entries()].slice(-7).map(([k, v]) => {
          const tt = v.t.length ? `<b>${card._fmt(Math.max(...v.t.map((p) => p.mx)), 0)}° / ${card._fmt(Math.min(...v.t.map((p) => p.mn)), 0)}°</b>` : '';
          const hh = v.h.length ? `${Math.round(Math.min(...v.h.map((p) => p.mn)))}–${Math.round(Math.max(...v.h.map((p) => p.mx)))} %` : '';
          return `<div class="day">${esc(new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(k))}${showT ? tt : ''}${showH ? (showT ? `<span>${hh}</span>` : `<b>${hh}</b>`) : ''}</div>`;
        }).join('');
      }
      r.getElementById('days').innerHTML = dh;
    }
  }
  customElements.define(TAG.replace('-card', '-dialog'), ApplianceRoomClimateDialog);

  /* ---- éditeur visuel ---- */
  class ApplianceRoomClimateCardEditor extends HTMLElement {
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
      const tmp = window.applianceTemp(this._hass, this._c), u = tmp.unit;
      const ent = (name, domain, dc) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(dc ? { device_class: dc } : {}) } } });
      const num = (name, min, max, step, unit, def) => ({ name, ...(def != null ? { default: def } : {}), selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const tr = (name, minC, maxC, def) => { const g = tmp.range(minC, maxC); return num(name, g.min, g.max, 0.5, u, def); };
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const sel = (name, opts) => ({ name, selector: { select: { mode: 'dropdown', options: opts.map(([value, k]) => ({ value, label: (T[this._lang()] || T.en)[k] || T.en[k] })) } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        ent('entity_temperature', 'sensor', 'temperature'), ent('entity_humidity', 'sensor', 'humidity'),
        ent('entity_outdoor_temperature', 'sensor', 'temperature'), ent('entity_outdoor_humidity', 'sensor', 'humidity'),
        ent('entity_window', 'binary_sensor'), ent('entity_battery', ['sensor', 'binary_sensor']),
        { type: 'grid', name: '', schema: [tr('comfort_temp_min', 5, 30, Math.round(tmp.c(19))), tr('comfort_temp_max', 10, 40, Math.round(tmp.c(25))),
          num('humidity_min', 0, 100, 1, '%', 35), num('humidity_max', 0, 100, 1, '%', 65)] },
        { type: 'grid', name: '', schema: [tr('alert_temp_min', -20, 30), tr('alert_temp_max', 10, 50), num('alert_humidity_min', 0, 100, 1, '%'), num('alert_humidity_max', 0, 100, 1, '%')] },
        { type: 'grid', name: '', schema: [num('mold_humidity', 40, 100, 1, '%', 70), num('window_drop', 0, 10, 0.1, u), num('battery_low', 0, 100, 1, '%', 20)] },
        { type: 'grid', name: '', schema: [sel('history_days', [['1', 'h24'], ['7', 'd7'], ['30', 'd30']]), sel('history_mode', [['both', 'both'], ['temperature', 'temperature'], ['humidity', 'humidity']])] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'labels', selector: { object: {} } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_outdoor'), bool('show_dew_point'), bool('show_advice'), bool('show_graph'), bool('animations'), { name: 'transparent', selector: { boolean: {} } }] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
    _lang() { const h = this._hass; let l = ((this._c && this._c.language) || (h && (h.locale?.language || h.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
  }
  customElements.define(TAG + '-editor', ApplianceRoomClimateCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: 'Température et humidité d\'une pièce, animées : confort, alertes, point de rosée, conseil d\'aération, fenêtre ouverte, batterie, historique 24 h / 7 j / 30 j.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
