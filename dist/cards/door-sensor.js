/* Carte « Détecteur d'ouverture » — custom:appliance-door-sensor-card
 * Porte d'entrée en PVC blanc (vitrage, panneau mouluré, poignée barre inox) vue de trois quarts, avec le capteur d'ouverture
 * posé sur le cadre et son aimant sur le battant. Entité binary_sensor (door / opening / window / garage_door) :
 * fermée → le battant se referme ; ouverte → il pivote vers l'intérieur et la pièce s'éclaire ;
 * restée ouverte au-delà de open_alert_minutes → voyant rouge qui clignote, contour d'alerte, ondes et durée.
 * Batterie facultative (capteur % ou binary_sensor « pile faible ») : tuile + pictogramme qui clignote sous le seuil.
 * Tuiles : batterie, durée depuis le dernier changement.
 * La scène est en vraie 3D (rotation de 30° puis perspective douce) : les points sont projetés en JavaScript, le battant est animé
 * par interpolation (requestAnimationFrame) ; clignotements et ondes sont en CSS.
 */
(() => {
  const TAG = 'appliance-door-sensor-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Door sensor",
      "closed": "Closed",
      "open": "Open",
      "left_open": "Left open",
      "unavailable": "Unavailable",
      "unknown": "Unavailable",
      "battery": "Battery",
      "since": "Since",
      "open_since": "Open since",
      "closed_since": "Closed since",
      "open_for": "Open for {time}",
      "low": "Low",
      "ok": "OK"
    },
    "fr": {
      "name": "Détecteur d'ouverture",
      "closed": "Fermée",
      "open": "Ouverte",
      "left_open": "Restée ouverte",
      "unavailable": "Indisponible",
      "unknown": "Indisponible",
      "battery": "Batterie",
      "since": "Depuis",
      "open_since": "Ouverte depuis",
      "closed_since": "Fermée depuis",
      "open_for": "Ouverte depuis {time}",
      "low": "Faible",
      "ok": "OK"
    },
    "pt-BR": {
      "name": "Sensor de porta",
      "closed": "Fechada",
      "open": "Aberta",
      "left_open": "Deixada aberta",
      "unavailable": "Indisponível",
      "unknown": "Indisponível",
      "battery": "Bateria",
      "since": "Desde",
      "open_since": "Aberta desde",
      "closed_since": "Fechada desde",
      "open_for": "Aberta há {time}",
      "low": "Fraca",
      "ok": "OK"
    },
    "pt-PT": {
      "name": "Sensor de porta",
      "closed": "Fechada",
      "open": "Aberta",
      "left_open": "Deixada aberta",
      "unavailable": "Indisponível",
      "unknown": "Indisponível",
      "battery": "Bateria",
      "since": "Desde",
      "open_since": "Aberta desde",
      "closed_since": "Fechada desde",
      "open_for": "Aberta há {time}",
      "low": "Fraca",
      "ok": "OK"
    }
  };

  const CSS = `
:host{display:block;height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--ds-ok:var(--appliance-ok-color,#43a047);--ds-warn:var(--appliance-warn-color,#ffa000);--ds-alert:var(--appliance-alert-color,#e53935);--ds-c:var(--ds-ok)}
ha-card.open{--ds-c:var(--ds-warn)}ha-card.left_open{--ds-c:var(--ds-alert)}ha-card.unavailable,ha-card.unknown{--ds-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--ds-c) 22%,transparent);color:var(--ds-c)}
svg{display:block;width:100%;max-width:calc(240px * var(--illus-scale,1));height:auto;margin:10px auto 0;cursor:pointer;overflow:visible;color:var(--ds-c)}
.alert{display:none;align-items:center;justify-content:center;gap:5px;margin-top:2px;font-size:12px;font-weight:600;color:var(--ds-alert)}
.alert.on{display:flex}.alert ha-icon{--mdc-icon-size:16px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile.hide{display:none}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.warn .v{color:var(--ds-warn)}.tile.bad .v{color:var(--ds-alert)}
/* ---- illustration : halo, voyant, contour d'alerte, ondes ---- */
.halo{fill:url(#dshalo);opacity:.3;transition:opacity .5s}.open .halo{opacity:.4}.left_open .halo{animation:dspulse 1.1s ease-in-out infinite}
.unavailable .halo,.unknown .halo{opacity:0}
.led{fill:var(--ds-c);filter:drop-shadow(0 0 3px var(--ds-c))}.left_open .led{animation:dsblink .7s steps(2,jump-none) infinite}
.contour{fill:none;stroke:var(--ds-alert);stroke-width:2;opacity:0}.left_open .contour{animation:dspulse 1.1s ease-in-out infinite}
.wave{fill:none;stroke:var(--ds-alert);stroke-width:2;stroke-linecap:round;opacity:0}
.left_open .wave{animation:dswave 1.1s ease-in-out infinite}.wave.w2{animation-delay:.25s!important}
.bat{opacity:0}.lowbat .bat{opacity:1;animation:dsblink 1.6s infinite}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}.noanim .left_open .contour{opacity:.6}
@keyframes dspulse{50%{opacity:.8}}
@keyframes dsblink{50%{opacity:.2}}
@keyframes dswave{0%,100%{opacity:.15}50%{opacity:1}}
`;

  // ---- scène 3D : rotation de 30° autour de l'axe vertical de la porte, puis perspective douce ----
  const TH = 30 * Math.PI / 180, cT = Math.cos(TH), sT = Math.sin(TH), F = 420, OX = 118, OY = 94;
  const D = 16, WD = 98, HD = 158, TK = 5, Z0 = 3; // profondeur de l'embrasure, battant : largeur, hauteur, épaisseur, retrait
  const rot = (x, y, z) => [(x - 50) * cT - z * sT, y - 80, (x - 50) * sT + z * cT];
  const pr = (x, y, z) => { const [a, b, c] = rot(x, y, z), s = F / (F + c); return [OX + a * s, OY + b * s]; };
  const vis = (n, p) => { const r = rot(...p), nr = [n[0] * cT - n[2] * sT, n[1], n[0] * sT + n[2] * cT]; return nr[0] * -r[0] + nr[1] * -r[1] + nr[2] * (-F - r[2]) > 0; };
  const pts = (arr) => arr.map((p) => pr(...p).map((v) => v.toFixed(1)).join(',')).join(' ');
  const poly = (P, fill, extra = '') => `<polygon points="${pts(P)}" fill="${fill}" ${extra}/>`;
  const EDGE = 'stroke="#b4bac1" stroke-width=".8"';

  // décor dynamique (dépend de l'angle a de 0 à 1) : pièce vue par l'ouverture, embrasures, battant. Charnière à droite, ouverture vers l'intérieur.
  const scene = (a) => {
    const A = a * 70 * Math.PI / 180, ca = Math.cos(A), sa = Math.sin(A);
    const dp = (u, v, e = 0) => [100 - (1 + u * WD * ca - e * sa), 1 + v * HD, Z0 + u * WD * sa + e * ca]; // u : 0 charnière → 1 bord libre ; e : épaisseur
    const eU = [-ca, 0, sa], eD = [sa, 0, ca];
    let g = '';
    g += poly([[0, 0, D], [100, 0, D], [100, 160, D], [0, 160, D]], 'url(#dsroom)');
    g += `<g clip-path="url(#dsclip)">${poly([[0, 160, D], [100, 160, D], [100, 160, 70], [0, 160, 70]], '#9c7440', 'opacity=".6"')}`
      + poly([[99, 160, Z0], [100 - (1 + WD * ca), 160, Z0 + WD * sa], [100 - (1 + WD * ca) - 10, 160, 70], [99, 160, 70]], '#fff3c8', `opacity="${(.28 * Math.sin(A)).toFixed(2)}"`) + '</g>';
    [[[[0, 0, 0], [0, 0, D], [0, 160, D], [0, 160, 0]], [1, 0, 0], '#c9ced4'], [[[100, 0, 0], [100, 160, 0], [100, 160, D], [100, 0, D]], [-1, 0, 0], '#aeb4bb'],
      [[[0, 0, 0], [100, 0, 0], [100, 0, D], [0, 0, D]], [0, 1, 0], '#bfc4ca'], [[[0, 160, 0], [0, 160, D], [100, 160, D], [100, 160, 0]], [0, -1, 0], '#d9dde2']]
      .forEach(([P, n, f]) => { if (vis(n, P[0])) g += poly(P, f); });
    // tranches du battant (visibles selon l'angle), puis face avant avec ses décors
    [[[dp(0, 0, 0), dp(1, 0, 0), dp(1, 0, TK), dp(0, 0, TK)], [0, -1, 0], '#dfe3e8'], [[dp(0, 1, 0), dp(0, 1, TK), dp(1, 1, TK), dp(1, 1, 0)], [0, 1, 0], '#cfd4da'],
      [[dp(0, 0, 0), dp(0, 0, TK), dp(0, 1, TK), dp(0, 1, 0)], [-eU[0], 0, -eU[2]], '#c4c9cf'], [[dp(1, 0, 0), dp(1, 1, 0), dp(1, 1, TK), dp(1, 0, TK)], eU, '#cdd2d8'],
      [[dp(0, 0, TK), dp(1, 0, TK), dp(1, 1, TK), dp(0, 1, TK)], eD, '#d3d7dc']]
      .forEach(([P, n, f]) => { if (vis(n, P[0])) g += poly(P, f, 'stroke="#b4bac1" stroke-width=".6"'); });
    const front = [dp(0, 0), dp(1, 0), dp(1, 1), dp(0, 1)];
    if (vis([-eD[0], 0, -eD[2]], front[0])) {
      const R = (u0, v0, u1, v1) => [dp(u0, v0), dp(u1, v0), dp(u1, v1), dp(u0, v1)];
      g += poly(front, 'url(#dspvc)', EDGE);
      g += poly(R(.16, .07, .84, .52), '#e3e6ea', EDGE) + poly(R(.21, .105, .79, .485), 'url(#dsglass)', 'stroke="#8d949b" stroke-width=".7"');                // vitrage
      g += poly([dp(.24, .12), dp(.40, .12), dp(.27, .47), dp(.24, .47)], '#fff', 'opacity=".28"') + poly([dp(.46, .12), dp(.52, .12), dp(.39, .47), dp(.33, .47)], '#fff', 'opacity=".18"');
      g += poly(R(.16, .58, .84, .94), '#eceef1', EDGE) + poly(R(.23, .64, .77, .88), '#f6f7f9', 'stroke="#c4c9cf" stroke-width=".8"');                      // panneau mouluré
      g += poly(R(.855, .36, .935, .72), '#dfe2e6', 'stroke="#9aa3ad" stroke-width=".7"') + poly(R(.885, .40, .905, .60), '#aeb6bf', 'stroke="#6f7881" stroke-width=".8"')
        + poly(R(.884, .40, .896, .60), '#e8ecf0', 'opacity=".8"');                                                                                               // plaque + poignée barre inox
      const cp = pr(...dp(.895, .665));
      g += `<ellipse cx="${cp[0].toFixed(1)}" cy="${cp[1].toFixed(1)}" rx="2.6" ry="3.2" fill="#c8ced4" stroke="#6f7881" stroke-width=".8"/><rect x="${(cp[0] - .5).toFixed(1)}" y="${(cp[1] - .5).toFixed(1)}" width="1" height="3" fill="#4a5058"/>`; // cylindre
      g += poly(R(.90, .004, .985, .026), '#cfd4da', 'stroke="#7d858d" stroke-width=".6"'); // aimant du capteur
    }
    return g;
  };

  // décor fixe : cadre PVC (cache la charnière quand le battant s'ouvre), capteur, voyant, pile, contour d'alerte, ondes
  const FR = (x0, y0, x1, y1) => [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0]];
  const frame = () => {
    let g = [FR(-9, -9, 109, 0), FR(-9, 0, 0, 160), FR(100, 0, 109, 160), FR(-9, 160, 109, 168)].map((P) => poly(P, '#f3f5f7', EDGE)).join('');
    g += poly(FR(-9, 168, 109, 172), '#d9dde2', 'stroke="#b4bac1" stroke-width=".6"');
    g += poly([[2, -7.5, 0], [16, -7.5, 0], [16, -1.8, 0], [2, -1.8, 0]], '#fff', 'stroke="#8d949b" stroke-width=".8"');
    const lp = pr(9, -4.6, 0), wp = pr(16, -5, 0);
    g += `<circle class="led" cx="${lp[0].toFixed(1)}" cy="${lp[1].toFixed(1)}" r="1.8"/>`;
    g += `<polygon class="contour" points="${pts(FR(-13, -13, 113, 176))}"/>`;
    g += `<g transform="translate(${(wp[0] + 6).toFixed(1)} ${(wp[1] - 3).toFixed(1)})"><path class="wave" d="M0 0 q9 7 0 14"/><path class="wave w2" d="M7 -4 q14 11 0 22"/></g>`;
    g += `<g class="bat" transform="translate(206 6)"><rect x="0" y="0" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="22" y="3" width="3" height="6" fill="#ffa000"/><path d="M3 3h4v6H3z" fill="#ffa000"/></g>`;
    return g;
  };

  const DEFS = `<defs><radialGradient id="dshalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="currentColor" stop-opacity=".55"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient>
    <linearGradient id="dsroom" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e6b8"/><stop offset="1" stop-color="#b98a4e"/></linearGradient>
    <linearGradient id="dsglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4eefb"/><stop offset=".55" stop-color="#8fc3df"/><stop offset="1" stop-color="#6aa3c4"/></linearGradient>
    <linearGradient id="dspvc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7f8fa"/><stop offset="1" stop-color="#e6e9ed"/></linearGradient>
    <clipPath id="dsclip"><polygon points="${pts([[0, 0, 0], [100, 0, 0], [100, 160, 0], [0, 160, 0]])}"/></clipPath></defs>`;

  const TILES = [['battery', 'mdi:battery', 'show_battery'], ['since', 'mdi:clock-outline', 'show_since']];

  class ApplianceDoorSensorCard extends HTMLElement {
    get _config() { return this._c; } // nom standard lu par card-mod
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const door = ids.find((i) => i.startsWith('binary_sensor.') && ['door', 'opening', 'window', 'garage_door'].includes(dc(i))) || '';
      const dev = door.split('.')[1]?.replace(/_(door|contact|opening|window)$/, '') || '\u0000';
      return { entity: door, entity_battery: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'battery' && i.includes(dev)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object' || !c.entity) throw new Error('entity is required');
      this._c = { open_alert_minutes: 5, battery_low: 20, show_status: true, show_battery: true, show_since: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }
    disconnectedCallback() { cancelAnimationFrame(this._raf); }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _dur(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 60 ? [sec, 'second'] : sec < 3600 ? [sec / 60, 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short', maximumFractionDigits: 0 }).format(Math.floor(n)); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="dstitle"></div><div class="badge" id="dsbadge"></div></div>
        <svg viewBox="0 0 240 200" role="img" aria-label="${(this._c.name || this._t('name')).replace(/"/g, '')}">${DEFS}
          <ellipse class="halo" cx="120" cy="96" rx="116" ry="100"/><ellipse cx="120" cy="184" rx="86" ry="6" fill="#000" fill-opacity=".28"/>
          <g id="dsscene"></g><g>${frame()}</g></svg>
        <div class="alert" id="dsalert"><ha-icon icon="mdi:clock-alert-outline"></ha-icon><span></span></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more({ battery: this._c.entity_battery, since: this._c.entity }[el.dataset.k])));
      this._root = root; this._card = root.querySelector('ha-card'); this._scene = root.getElementById('dsscene'); this._built = true; this._a = null;
    }

    // anime le battant vers l'angle cible (0 fermé → 1 ouvert) ; sans animation il saute directement
    _swing(target) {
      cancelAnimationFrame(this._raf);
      if (this._a == null || this._c.animations === false || matchMedia('(prefers-reduced-motion: reduce)').matches) { this._a = target; this._scene.innerHTML = scene(target); return; }
      const from = this._a, t0 = performance.now(), dur = 900, ease = (x) => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur); this._a = from + (target - from) * ease(k); this._scene.innerHTML = scene(this._a);
        if (k < 1) this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity);
      const raw = s ? String(s.state).toLowerCase() : 'unavailable', alive = this._ok(s);
      const isOpen = alive && /^(on|open|opened|true)$/.test(raw);
      const mins = isOpen ? (Date.now() - Date.parse(s.last_changed)) / 60000 : 0;
      const left = isOpen && Number(c.open_alert_minutes) > 0 && mins >= Number(c.open_alert_minutes);
      const st = !alive ? (raw === 'unknown' ? 'unknown' : 'unavailable') : left ? 'left_open' : isOpen ? 'open' : 'closed';
      // batterie : % (sensor) ou binary_sensor « pile faible »
      const bS = this._st(c.entity_battery), bin = !!bS && /^binary_sensor\./.test(c.entity_battery), bat = !bin && this._ok(bS) ? parseFloat(String(bS.state).replace(',', '.')) : NaN;
      const low = bin ? this._ok(bS) && /^(on|true|low)$/i.test(bS.state) : isFinite(bat) && bat < Number(c.battery_low);
      card.className = `${st}${low ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('dstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('dsbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('dsalert'); al.classList.toggle('on', left); al.querySelector('span').textContent = left ? this._t('open_for').replace('{time}', this._dur(s)) : '';
      this._swing(isOpen ? 1 : 0);

      const V = {
        battery: [c.entity_battery, isFinite(bat) ? String(Math.round(bat)) : this._ok(bS) ? this._t(low ? 'low' : 'ok') : '--', isFinite(bat) ? '%' : '', low ? 'bad' : ''],
        since: [c.entity, this._dur(s), '', ''],
      };
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', low ? 'mdi:battery-alert' : 'mdi:battery');
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false); el.classList.toggle('bad', cls === 'bad');
        el.querySelector('.lbl').textContent = k === 'since' ? this._l(isOpen ? 'open_since' : 'closed_since') : this._l(k);
        const small = document.createElement('small'); small.textContent = unit; el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  customElements.define(TAG, ApplianceDoorSensorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceDoorSensorCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', required: true, selector: { entity: { domain: 'binary_sensor' } } },
        { name: 'entity_battery', selector: { entity: { domain: ['sensor', 'binary_sensor'] } } },
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        { name: 'open_alert_minutes', default: 5, selector: { number: { min: 0, max: 1440, step: 1, mode: 'box', unit_of_measurement: 'min' } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_battery'), bool('show_since'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceDoorSensorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Détecteur d\'ouverture de porte animé (porte d\'entrée PVC blanc) : fermée, ouverte, restée ouverte, batterie.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/door-sensor.md',
  });
})();
