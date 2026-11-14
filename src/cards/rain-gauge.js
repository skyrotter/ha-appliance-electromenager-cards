/* Carte « Pluviomètre connecté » — custom:appliance-rain-gauge-card
 * Pluviomètre à auget (type Netatmo) : coupelle en verre, collecteur noir, socle blanc.
 * Il pleut : un nuage apparaît, des gouttes tombent dans la coupelle (plus nombreuses et plus rapides selon l'intensité),
 * des rides se forment sur l'eau, le niveau de la coupelle suit le cumul du jour, l'auget « bat » à chaque basculement.
 * Intensité : faible (< 2,5 mm/h), modérée, forte (≥ heavy_rate, 7,6 mm/h), violente (≥ 50 mm/h, éclair).
 * Tuiles (chacune désactivable) : intensité, dernière heure, jour, semaine, mois, année, dernière pluie, batterie, signal.
 */
(() => {
  const TAG = 'appliance-rain-gauge-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n rain_gauge*/{};

  // états texte reconnus quand l'entité principale n'est pas un nombre (binary_sensor « il pleut », sensor texte…)
  const RAIN_RE = /^(on|true|yes|rain|raining|rainy|pluie|pleut|pleuvoir|regen|regnet|regnerisch|pioggia|piove|regn|regner|regent|neer?slag|regent|ploaie|plouă|дождь|kiša|kisa|deszcz|pada)/i;
  const HEAVY_RE = /(heavy|strong|violent|forte|stark|intens|forte pioggia|zwaar|puternic|сильный)/i;
  const LIGHT_RE = /(light|drizzle|bruine|faible|leicht|nieselregen|debole|licht|slab|слабый)/i;
  const DRY_RE = /^(off|false|no|dry|none|clear|sec|sèche|trocken|asciutto|tørr|tørt|droog|uscat|сухо|0)$/i;

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--rg-ok:var(--appliance-ok-color,#43a047);--rg-warn:var(--appliance-warn-color,#ffa000);
  --rg-alert:var(--appliance-alert-color,#db4437);--rg-cold:var(--appliance-cold-color,#2b9af9);--spd:1s;--lvl:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.light .badge,.moderate .badge{background:color-mix(in srgb,var(--rg-cold) 22%,transparent);color:var(--rg-cold)}
.heavy .badge{background:color-mix(in srgb,var(--rg-warn) 24%,transparent);color:var(--rg-warn)}
.violent .badge{background:color-mix(in srgb,var(--rg-alert) 22%,transparent);color:var(--rg-alert)}
.dry .badge{background:color-mix(in srgb,var(--rg-ok) 20%,transparent);color:var(--rg-ok)}
.dry.lowbat .badge{background:color-mix(in srgb,var(--rg-warn) 24%,transparent);color:var(--rg-warn)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(200px * var(--illus-scale,1));width:calc(200px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--rg-alert)}.tile.warn .v{color:var(--rg-warn)}.tile.cold .v{color:var(--rg-cold)}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante, tuiles en colonne ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration ---- */
.cloud{opacity:0;transform:translateY(-10px);transition:opacity .8s,transform .8s}
.light .cloud,.moderate .cloud,.heavy .cloud,.violent .cloud{opacity:1;transform:none}
.cloud ellipse,.cloud path{fill:#c9d3de;transition:fill .8s}
.heavy .cloud ellipse,.heavy .cloud path{fill:#8c97a5}.violent .cloud ellipse,.violent .cloud path{fill:#5d6672}
.light .cloud{animation:rgfloat 6s ease-in-out infinite alternate}
.rd{stroke:#7cc6ff;stroke-width:1.5;stroke-linecap:round;opacity:0}
.light .rd:nth-child(-n+5){animation:rgfall calc(var(--spd) * 1.15) linear infinite}
.moderate .rd:nth-child(-n+9){animation:rgfall calc(var(--spd) * .85) linear infinite}
.heavy .rd{stroke-width:1.9;animation:rgfall calc(var(--spd) * .62) linear infinite}
.violent .rd{stroke-width:2.3;stroke:#a6d8ff;animation:rgfall calc(var(--spd) * .46) linear infinite}
.bolt{fill:#ffe45c;opacity:0}.violent .bolt{animation:rgbolt 3.2s infinite}
.rip{fill:none;stroke:#bfe6ff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.light .rip,.moderate .rip,.heavy .rip,.violent .rip{animation:rgrip calc(var(--spd) * 1.8) ease-out infinite}
.rip.r2{animation-delay:calc(var(--spd) * -.9)!important}.rip.r3{animation-delay:calc(var(--spd) * -.45)!important}
.spl{fill:#bfe6ff;opacity:0}
.moderate .spl,.heavy .spl,.violent .spl{animation:rgspl calc(var(--spd) * .7) ease-out infinite}
.spl:nth-child(2){animation-delay:-.25s!important}.spl:nth-child(3){animation-delay:-.5s!important}.spl:nth-child(4){animation-delay:-.15s!important}
.water{fill:#4aa8ff;opacity:.62;transform-box:fill-box;transform-origin:50% 100%;transform:scale(calc(.35 + var(--lvl) * .65),var(--lvl));transition:transform 1.4s ease}
.pinglow{fill:#7fdcff;opacity:0}
.light .pinglow,.moderate .pinglow,.heavy .pinglow,.violent .pinglow{animation:rgtick calc(var(--spd) * 1.6) ease-in-out infinite}
.tickring{fill:none;stroke:#7fdcff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.light .tickring,.moderate .tickring,.heavy .tickring,.violent .tickring{animation:rgring calc(var(--spd) * 1.6) ease-out infinite}
.glint{fill:#fff;opacity:0}.dry .glint{animation:rgglint 7s ease-in-out infinite}
.rgbat{opacity:0}.lowbat .rgbat{opacity:1;animation:rgblink 2s infinite}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
@keyframes rgfall{0%{transform:translateY(0);opacity:0}12%{opacity:.95}85%{opacity:.95}100%{transform:translateY(33px);opacity:0}}
@keyframes rgrip{0%{opacity:.9;transform:scale(.2)}100%{opacity:0;transform:scale(1)}}
@keyframes rgspl{0%{opacity:.9;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--sx,3px),-9px)}}
@keyframes rgtick{0%,100%{opacity:0}50%{opacity:.95}}
@keyframes rgring{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(2.6)}}
@keyframes rgbolt{0%,86%,100%{opacity:0}88%{opacity:1}90%{opacity:.1}92%{opacity:1}96%{opacity:0}}
@keyframes rgfloat{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
@keyframes rgglint{0%,70%,100%{opacity:0;transform:translateX(0)}78%{opacity:.5}90%{opacity:0;transform:translateX(120px)}}
@keyframes rgblink{50%{opacity:.25}}
`;

  // gouttes : 14 emplacements, la CSS n'en affiche que 5 (faible), 9 (modérée) ou 14 selon l'intensité
  const DROPS = [100, 62, 138, 30, 82, 120, 160, 46, 112, 150, 72, 26, 128, 94]
    .map((x, i) => `<line class="rd" x1="${x}" y1="27" x2="${x - 1.4}" y2="33" style="animation-delay:${-(i * 0.173).toFixed(2)}s"/>`).join('');

  const SVG = (label) => `<svg viewBox="0 0 200 170" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}"><defs>
    <linearGradient id="rgbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b2e34"/><stop offset=".18" stop-color="#17191d"/><stop offset=".7" stop-color="#0c0d10"/><stop offset="1" stop-color="#1c1e23"/></linearGradient>
    <linearGradient id="rgbase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d8de"/></linearGradient>
    <linearGradient id="rgglass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".12" stop-color="#cfe6f5" stop-opacity=".16"/><stop offset=".85" stop-color="#cfe6f5" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity=".45"/></linearGradient>
    <radialGradient id="rgcone" cx=".5" cy=".4"><stop offset="0" stop-color="#34383f"/><stop offset="1" stop-color="#0d0e11"/></radialGradient>
    <radialGradient id="rgshadow"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <clipPath id="rgdish"><path d="M22 60 Q30 86 66 96 L134 96 Q170 86 178 60 Z"/></clipPath></defs>
    <!-- nuage -->
    <g class="cloud"><ellipse cx="62" cy="17" rx="26" ry="10"/><ellipse cx="92" cy="12" rx="24" ry="11"/><ellipse cx="124" cy="15" rx="26" ry="10"/><ellipse cx="146" cy="19" rx="18" ry="7"/><ellipse cx="100" cy="21" rx="52" ry="6"/>
      <path class="bolt" d="M104 22l-9 14h6l-4 12 12-16h-7z"/></g>
    <!-- pluie -->
    <g>${DROPS}</g>
    <!-- ombre et socle blanc -->
    <ellipse cx="100" cy="160" rx="62" ry="6" fill="url(#rgshadow)"/>
    <path d="M48 150 Q48 158 60 158 L140 158 Q152 158 152 150 L152 140 L48 140 Z" fill="url(#rgbase)"/>
    <path d="M48 140 H152" stroke="#aeb5bd" stroke-width=".8" opacity=".7"/>
    <!-- corps noir -->
    <rect x="52" y="86" width="96" height="55" rx="6" fill="url(#rgbody)"/>
    <rect x="58" y="92" width="4" height="44" rx="2" fill="#fff" opacity=".12"/>
    <!-- collecteur noir dans la coupelle, eau, rides, auget -->
    <ellipse cx="100" cy="76" rx="56" ry="13" fill="url(#rgcone)"/>
    <g clip-path="url(#rgdish)"><ellipse class="water" cx="100" cy="78" rx="52" ry="11"/></g>
    <ellipse class="rip" cx="100" cy="76" rx="40" ry="8"/><ellipse class="rip r2" cx="100" cy="76" rx="40" ry="8"/><ellipse class="rip r3" cx="100" cy="76" rx="40" ry="8"/>
    <g><circle class="spl" cx="72" cy="74" r="1.4" style="--sx:-3px"/><circle class="spl" cx="118" cy="73" r="1.4" style="--sx:3px"/><circle class="spl" cx="92" cy="78" r="1.2" style="--sx:-2px"/><circle class="spl" cx="134" cy="76" r="1.2" style="--sx:3px"/></g>
    <circle class="tickring" cx="100" cy="68" r="3.2"/><circle class="pinglow" cx="100" cy="68" r="3.6"/>
    <path d="M97.6 76 L97.6 66.5 Q100 63 102.4 66.5 L102.4 76 Z" fill="#c9cfd6"/>
    <!-- coupelle en verre -->
    <path d="M14 56 Q22 90 64 98 L136 98 Q178 90 186 56 Z" fill="url(#rgglass)" stroke="#d7e6f1" stroke-opacity=".75" stroke-width="1.1"/>
    <ellipse cx="100" cy="56" rx="86" ry="16" fill="#e8f3fb" fill-opacity=".12" stroke="#e3f0f8" stroke-opacity=".9" stroke-width="1.4"/>
    <path d="M24 53 Q100 40 176 53" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>
    <rect class="glint" x="22" y="48" width="9" height="30" rx="4.5" transform="rotate(14 26 62)"/>
    <!-- batterie faible -->
    <g class="rgbat"><rect x="164" y="104" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="186" y="107" width="3" height="6" fill="#ffa000"/><rect x="167" y="107" width="4" height="6" fill="#ffa000"/></g>
  </svg>`;

  const TILES = [['rate', 'mdi:weather-pouring', 'show_rate'], ['hour', 'mdi:clock-outline', 'show_hour'], ['day', 'mdi:calendar-today', 'show_day'],
    ['week', 'mdi:calendar-week', 'show_week'], ['month', 'mdi:calendar-month', 'show_month'], ['year', 'mdi:calendar', 'show_year'],
    ['last', 'mdi:weather-rainy', 'show_last'], ['battery', 'mdi:battery', 'show_battery'], ['signal', 'mdi:wifi', 'show_signal']];
  const ENT = { rate: 'entity', hour: 'entity_hour', day: 'entity_day', week: 'entity_week', month: 'entity_month', year: 'entity_year', last: 'entity_last', battery: 'entity_battery', signal: 'entity_signal' };

  class ApplianceRainGaugeCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^sensor\./.test(i) && /(rain|pluie|precip|regen|pioggia)/i.test(i) && !/(battery|batterie|signal|rssi|wifi)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { heavy_rate: 7.6, gauge_max: 50, battery_low: 20, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 1) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // valeur en mm (ou mm/h) : les pluviomètres américains donnent des pouces
    _mm(v, unit) { return /^in/i.test(unit) ? v * 25.4 : /^cm/i.test(unit) ? v * 10 : v; }
    // date relative (« il y a 2 h ») pour la tuile Dernière pluie ; texte brut si l'état n'est pas une date
    _ago(s) {
      if (!this._ok(s)) return '--';
      const t = Date.parse(s.state);
      if (!t || !/\d{4}-\d{2}-\d{2}|T\d{2}:/.test(String(s.state))) return String(s.state);
      const sec = (t - Date.now()) / 1000, a = Math.abs(sec);
      const [v, u] = a < 90 ? [Math.round(sec / 60), 'minute'] : a < 5400 ? [Math.round(sec / 60), 'minute'] : a < 129600 ? [Math.round(sec / 3600), 'hour'] : [Math.round(sec / 86400), 'day'];
      try { return new Intl.RelativeTimeFormat(window.applianceLocale(this._c, this._hass, true), { numeric: 'auto', style: 'short' }).format(v, u); } catch (e) { return String(s.state); }
    }

    _compute() {
      const c = this._c, e = this._st(c.entity), raw = e ? String(e.state).trim() : '';
      const known = Object.values(ENT).some((k) => this._ok(this._st(c[k])));
      const rateV = this._num(c.entity), rate = isNaN(rateV) ? NaN : this._mm(rateV, this._unit(c.entity, 'mm/h'));
      const heavy = Number(c.heavy_rate) > 0 ? Number(c.heavy_rate) : 7.6;
      let lvl = 'dry';
      if (!known) lvl = 'unavailable';
      else if (!isNaN(rate)) lvl = rate <= 0.05 ? 'dry' : rate < 2.5 ? 'light' : rate < heavy ? 'moderate' : rate < 50 ? 'heavy' : 'violent';
      else if (this._ok(e) && !DRY_RE.test(raw) && RAIN_RE.test(raw)) lvl = 'moderate';
      else if (this._ok(e) && !DRY_RE.test(raw) && HEAVY_RE.test(raw)) lvl = 'heavy';
      else if (this._ok(e) && !DRY_RE.test(raw) && LIGHT_RE.test(raw)) lvl = 'light';
      // niveau d'eau dans la coupelle : cumul du jour (à défaut de l'heure) rapporté à gauge_max
      const dayV = this._num(c.entity_day), hourV = this._num(c.entity_hour);
      const tot = !isNaN(dayV) ? this._mm(dayV, this._unit(c.entity_day, 'mm')) : !isNaN(hourV) ? this._mm(hourV, this._unit(c.entity_hour, 'mm')) : NaN;
      const full = Number(c.gauge_max) > 0 ? Number(c.gauge_max) : 50;
      const level = isNaN(tot) ? (lvl === 'dry' || lvl === 'unavailable' ? 0 : .25) : Math.max(tot > 0 ? .08 : 0, Math.min(1, tot / full));
      const bat = this._num(c.entity_battery), low = !isNaN(bat) && bat < Number(c.battery_low);
      return { lvl, rate, bat, low, level };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="rgtitle"></div><div class="badge" id="rgbadge"></div></div>
        <div class="body">${SVG(this._c.name || this._t('name'))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_day || this._c.entity_hour));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { lvl, rate, bat, low, level } = this._compute();
      card.className = `${lvl}${low ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--lvl', level.toFixed(3));
      r.getElementById('rgtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('rgbadge');
      badge.textContent = this._t(lvl === 'dry' && low ? 'low_battery' : lvl);
      badge.style.display = c.show_status === false ? 'none' : '';

      const numeric = !isNaN(this._num(c.entity));
      const V = {
        rate: [numeric, this._fmt(this._num(c.entity), 1), this._unit(c.entity, 'mm/h')],
        hour: [c.entity_hour, this._fmt(this._num(c.entity_hour), 1), this._unit(c.entity_hour, 'mm')],
        day: [c.entity_day, this._fmt(this._num(c.entity_day), 1), this._unit(c.entity_day, 'mm')],
        week: [c.entity_week, this._fmt(this._num(c.entity_week), 1), this._unit(c.entity_week, 'mm')],
        month: [c.entity_month, this._fmt(this._num(c.entity_month), 0), this._unit(c.entity_month, 'mm')],
        year: [c.entity_year, this._fmt(this._num(c.entity_year), 0), this._unit(c.entity_year, 'mm')],
        last: [c.entity_last, this._ago(this._st(c.entity_last)), ''],
        battery: [c.entity_battery, this._fmt(bat, 0), this._unit(c.entity_battery, '%')],
        signal: [c.entity_signal, this._fmt(this._num(c.entity_signal), 0), isNaN(this._num(c.entity_signal)) ? '' : this._unit(c.entity_signal, '%')],
      };
      // signal sous forme de texte (« Bon », « good »…) : on affiche l'état tel quel
      const sg = this._st(c.entity_signal); if (this._ok(sg) && isNaN(this._num(c.entity_signal))) V.signal[1] = String(sg.state);
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('cold', k === 'rate' && (lvl === 'light' || lvl === 'moderate'));
        el.classList.toggle('warn', (k === 'rate' && lvl === 'heavy') || (k === 'battery' && low));
        el.classList.toggle('bad', k === 'rate' && lvl === 'violent');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      // vitesse des gouttes : plus la pluie est forte, plus la durée de chute est courte (variable --spd en secondes)
      card.style.setProperty('--spd', `${(isNaN(rate) ? 1 : Math.max(.7, Math.min(1.3, 1.3 - rate / 40))).toFixed(2)}s`);
    }
  }
  customElements.define(TAG, ApplianceRainGaugeCard);

  /* ---- éditeur visuel ---- */
  class ApplianceRainGaugeCardEditor extends HTMLElement {
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
      const num = (name, def, min, max, step, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', unit_of_measurement: unit } } });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['sensor', 'binary_sensor', 'input_boolean']),
        ent('entity_hour', 'sensor'), ent('entity_day', 'sensor'), ent('entity_week', 'sensor'), ent('entity_month', 'sensor'), ent('entity_year', 'sensor'),
        ent('entity_last', 'sensor'), ent('entity_battery', 'sensor'), ent('entity_signal', 'sensor'),
        num('heavy_rate', 7.6, 0.5, 50, 0.1, 'mm/h'), num('gauge_max', 50, 1, 500, 1, 'mm'), num('battery_low', 20, 1, 100, 1, '%'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceRainGaugeCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Pluviomètre connecté animé : nuage, gouttes selon l\'intensité, niveau de la coupelle, cumuls heure / jour / semaine / mois / année, batterie, signal.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/rain-gauge.md',
  });
})();
