/* Carte « Balance connectée » — custom:appliance-scale-card (photo détourée de la Withings WS-30)
 * Intégration Withings : poids, masse grasse, muscles, os, eau, pouls, graisse viscérale, objectif.
 * La balance est posée au sol en perspective 3D. À chaque nouvelle pesée (et à l'ouverture de la carte) :
 * les empreintes de pieds apparaissent, le plateau s'enfonce, les chiffres défilent puis se fixent en
 * clignotant, des ondes d'impédance traversent le plateau et un halo s'allume au sol ; ensuite l'écran
 * alterne poids / masse grasse / IMC. À côté : jauge IMC à aiguille et courbe des 30 derniers jours
 * avec la ligne d'objectif. Clic sur la balance : rejoue la pesée.
 */
(() => {
  const TAG = 'appliance-scale-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n scale*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = 'data:image/webp;base64,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';
  const BMI_MIN = 15, BMI_MAX = 40;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --sc-acc:#00c2d1;--sc-ok:var(--appliance-ok-color,#43a047);--needle:-90deg}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.recent .badge{background:color-mix(in srgb,var(--sc-acc) 22%,transparent);color:var(--sc-acc)}
.goal{display:none;margin-top:2px;font-size:11px;font-weight:600;text-align:center;color:var(--sc-ok)}
.goal.on{display:block;animation:scgoal 2.4s ease-in-out infinite}
@keyframes scgoal{50%{opacity:.55}}
.stage{display:flex;align-items:center;justify-content:center;gap:4px;margin-top:2px}
.floor{flex:1 1 56%;min-width:0;height:calc(150px * var(--illus-scale,1));perspective:560px;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative}
.side{flex:1 1 44%;min-width:0;max-width:calc(150px * var(--illus-scale,1))}
.side svg{display:block;width:100%;overflow:visible}
.plate{position:relative;width:calc(140px * var(--illus-scale,1));aspect-ratio:1;transform:rotateX(54deg) rotateZ(-6deg);transform-style:preserve-3d;transition:transform .5s cubic-bezier(.3,1.5,.5,1)}
.plate img,.plate svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.plate img{filter:drop-shadow(0 14px 10px rgba(0,0,0,.45))}
.weigh .plate{animation:scpress .7s cubic-bezier(.3,1.6,.5,1)}
@keyframes scpress{0%{transform:rotateX(54deg) rotateZ(-6deg) translateZ(0)}35%{transform:rotateX(54deg) rotateZ(-6deg) translateZ(-7px)}100%{transform:rotateX(54deg) rotateZ(-6deg) translateZ(0)}}
.glow{position:absolute;left:12%;right:12%;bottom:6%;height:26%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--sc-acc) 70%,transparent),transparent);opacity:0;transition:opacity 1s;pointer-events:none}
.recent .glow{opacity:.55}
.weigh .glow{opacity:1}
/* écran LCD redessiné sur la photo */
.lcdbg{fill:#15181b}
.lcd{fill:#eaf6ff;font:700 25px/1 'Segment7','DS-Digital',ui-monospace,'SFMono-Regular',Menlo,monospace;text-anchor:middle;letter-spacing:.5px;filter:drop-shadow(0 0 3px rgba(160,220,255,.9))}
.lcdu{fill:#9fb3c4;font:700 7px/1 ui-monospace,monospace;text-anchor:middle}
.idle .lcd{opacity:.55;filter:none}
.blink .lcd{animation:scblink .35s steps(2) 3}
@keyframes scblink{50%{opacity:0}}
/* empreintes et ondes d'impédance */
.feet{opacity:0;transition:opacity .5s}
.weigh .feet,.recent .feet{opacity:.85}
.feet path{fill:color-mix(in srgb,var(--sc-acc) 55%,#fff);filter:drop-shadow(0 0 6px var(--sc-acc))}
.ring{fill:none;stroke:var(--sc-acc);stroke-width:4;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.weigh .ring{animation:scring 1.6s ease-out 2}
.ring:nth-of-type(2){animation-delay:.4s!important}.ring:nth-of-type(3){animation-delay:.8s!important}
@keyframes scring{0%{opacity:.9;transform:scale(.15)}100%{opacity:0;transform:scale(1.25)}}
.scan{fill:url(#sc-scan);opacity:0}
.weigh .scan{animation:scscan 1.4s ease-in-out 2}
@keyframes scscan{0%{opacity:0;transform:translateY(240px)}20%{opacity:.8}100%{opacity:0;transform:translateY(0)}}
/* jauge IMC */
.zone{fill:none;stroke-width:9}
.needle{transform-origin:65px 62px;transform:rotate(var(--needle));transition:transform 1.6s cubic-bezier(.3,1.5,.4,1)}
.needle path{fill:var(--primary-text-color)}
.hub{fill:var(--primary-text-color)}
.bmi{fill:var(--primary-text-color);font:700 13px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.bmil{fill:var(--secondary-text-color);font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;letter-spacing:.06em}
.nobmi .gauge{opacity:.25}
/* courbe 30 jours */
.grid{stroke:color-mix(in srgb,var(--primary-text-color) 10%,transparent);stroke-width:.6}
.line{fill:none;stroke:var(--sc-acc);stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:400;stroke-dashoffset:400}
.drawn .line{animation:scdraw 1.8s ease-out forwards}
@keyframes scdraw{to{stroke-dashoffset:0}}
.area{fill:url(#sc-area);opacity:0;transition:opacity 1.2s .6s}
.drawn .area{opacity:1}
.goalline{stroke:var(--sc-ok);stroke-width:.9;stroke-dasharray:3 2}
.last{fill:var(--sc-acc)}
.lastp{fill:none;stroke:var(--sc-acc);stroke-width:1;transform-box:fill-box;transform-origin:50% 50%;animation:scping 2s ease-out infinite}
@keyframes scping{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(3)}}
.tl{fill:var(--secondary-text-color);font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.td{font:700 7.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:end}
.td.dn{fill:var(--sc-ok)}.td.up{fill:#ff9800}.td.eq{fill:var(--secondary-text-color)}
.notrend .trend{display:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(66px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.unavailable .plate{filter:grayscale(.6) brightness(.7)}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (même règles que les autres cartes) ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .alert,.compact .info,.compact .goal{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact .stage{flex:1 1 0;min-height:60px;margin-top:3px}
.compact .floor{height:100%}
.compact .plate{width:calc(min(110px, 100%) * var(--illus-scale,1))}
.compact .side svg{max-height:100%}
`;

  // pied (empreinte) : semelle + 5 orteils
  const FOOT = (x, y, flip) => `<g transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1)">
    <path d="M0 0 c-9 0 -14 12 -13 26 c1 14 5 30 4 42 c-1 10 2 18 10 18 c8 0 11 -8 10 -18 c-1 -14 4 -28 4 -44 c0 -14 -6 -24 -15 -24z"/>
    <path d="M-10 -8 a4.5 5 0 1 0 0.1 0z M-2 -12 a3.5 4 0 1 0 0.1 0z M5 -11 a3 3.5 0 1 0 0.1 0z M11 -7 a2.6 3 0 1 0 0.1 0z M15 -1 a2.2 2.6 0 1 0 0.1 0z"/></g>`;

  // arcs de la jauge IMC (zones OMS : maigreur, normal, surpoids, obésité)
  const arcAt = (v) => { const a = Math.PI * (1 - (v - BMI_MIN) / (BMI_MAX - BMI_MIN)); return [65 + 46 * Math.cos(a), 62 - 46 * Math.sin(a)]; };
  const zone = (a, b, col) => { const [x1, y1] = arcAt(a), [x2, y2] = arcAt(b); return `<path class="zone" stroke="${col}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A46 46 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`; };

  const HTML = (label) => `
<div class="stage">
 <div class="floor" id="scfloor" role="img" aria-label="${esc(label)}">
  <div class="glow"></div>
  <div class="plate">
   <img src="${IMG}" alt="">
   <svg viewBox="0 0 300 300">
    <defs><linearGradient id="sc-scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00e5ff" stop-opacity="0"/><stop offset=".5" stop-color="#00e5ff" stop-opacity=".55"/><stop offset="1" stop-color="#00e5ff" stop-opacity="0"/></linearGradient>
     <clipPath id="sc-plate"><rect x="3" y="3" width="294" height="294" rx="26"/></clipPath></defs>
    <g clip-path="url(#sc-plate)"><rect class="scan" x="0" y="0" width="300" height="50"/></g>
    <circle class="ring" cx="150" cy="185" r="110"/><circle class="ring" cx="150" cy="185" r="110"/><circle class="ring" cx="150" cy="185" r="110"/>
    <g class="feet">${FOOT(112, 140, true)}${FOOT(188, 140, false)}</g>
    <rect class="lcdbg" x="121" y="17" width="58" height="39" rx="3"/>
    <text class="lcdu" id="scunit" x="150" y="26">KG</text>
    <text class="lcd" id="sclcd" x="150" y="51">--.-</text>
   </svg>
  </div>
 </div>
 <div class="side">
  <svg viewBox="0 0 130 150">
   <defs><linearGradient id="sc-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00c2d1" stop-opacity=".35"/><stop offset="1" stop-color="#00c2d1" stop-opacity="0"/></linearGradient></defs>
   <g class="gauge">
    ${zone(BMI_MIN, 18.5, '#42a5f5')}${zone(18.5, 25, '#43a047')}${zone(25, 30, '#ffa31a')}${zone(30, BMI_MAX, '#e53935')}
    <g class="needle"><path d="M63.3 62 L65 20 L66.7 62 Z"/></g><circle class="hub" cx="65" cy="62" r="3.4"/>
    <text class="bmi" id="scbmi" x="65" y="80">--</text>
    <text class="bmil" id="scbmil" x="65" y="89">BMI</text>
   </g>
   <g class="trend">
    <line class="grid" x1="4" y1="104" x2="126" y2="104"/><line class="grid" x1="4" y1="142" x2="126" y2="142"/>
    <path class="area" id="scarea"/><line class="goalline" id="scgoalline" x1="4" x2="126" y1="0" y2="0" style="display:none"/>
    <path class="line" id="scline"/>
    <circle class="lastp" id="sclastp" r="2.2" cx="-10" cy="-10"/><circle class="last" id="sclast" r="2.2" cx="-10" cy="-10"/>
    <text class="tl" id="sctl" x="4" y="100">30 j</text><text class="td eq" id="sctd" x="126" y="100"></text>
   </g>
  </svg>
 </div>
</div>`;

  const TILES = [
    // [tuile, icône, entité, option qui l'affiche / la masque]
    ['weight', 'mdi:scale-bathroom', 'entity_weight', 'show_weight'],
    ['fat', 'mdi:water-percent', 'entity_fat_ratio', 'show_fat'],
    ['fat_mass', 'mdi:human', 'entity_fat_mass', 'show_fat_mass'],
    ['muscle', 'mdi:arm-flex', 'entity_muscle_mass', 'show_muscle'],
    ['bone', 'mdi:bone', 'entity_bone_mass', 'show_bone'],
    ['water', 'mdi:water', 'entity_hydration', 'show_hydration'],
    ['visceral', 'mdi:stomach', 'entity_visceral_fat', 'show_visceral'],
    ['pulse', 'mdi:heart-pulse', 'entity_heart_pulse', 'show_pulse'],
    ['goal', 'mdi:flag-checkered', 'entity_weight_goal', 'show_goal'],
    ['battery', 'mdi:battery', 'entity_battery', 'show_battery'],
  ];

  class ApplianceScaleCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re) => ids.find((i) => i.startsWith('sensor.') && re.test(i)) || '';
      const o = {
        entity_weight: f(/withings.*_weight$|^sensor\.weight$|withings.*weight(?!_goal)/i) || f(/(poids|weight)(?!.*goal)/i),
        entity_fat_ratio: f(/fat_ratio|body_fat|fat_percent/i),
        entity_fat_mass: f(/fat_mass/i),
        entity_muscle_mass: f(/muscle_mass/i),
        entity_bone_mass: f(/bone_mass/i),
        entity_hydration: f(/hydration/i),
        entity_heart_pulse: f(/heart_pulse|withings.*heart_rate/i),
        entity_weight_goal: f(/weight_goal/i),
        entity_battery: f(/battery/i),
      };
      return Object.fromEntries(Object.entries(o).filter(([, v]) => v));
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_bmi: true, show_trend: true, show_composition: true, recent_minutes: 5, trend_days: 30, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    disconnectedCallback() { cancelAnimationFrame(this._raf); clearInterval(this._cyc); clearTimeout(this._wt); }
    connectedCallback() { if (this._built && this._hass) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 1) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: d }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _anim() { return this._c.animations !== false; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sctitle"></div><div class="badge" id="scbadge"></div></div>
        ${HTML(this._c.name || this._t('name'))}
        <div class="goal" id="scgoal"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}
          <div class="tile hide" data-k="bmi"><div class="l"><ha-icon icon="mdi:human-male-height"></ha-icon><span class="lbl"></span></div><div class="v"></div></div></div>
      </ha-card>`;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
      // clic sur la balance : action configurée, sinon on rejoue la pesée
      window.applianceBindIllus(this, root.getElementById('scfloor'), () => this._weigh(true));
      root.querySelector('.side').addEventListener('click', () => this._more(this._c.entity_weight));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k); this._more(t ? this._c[t[2]] : this._c.entity_bmi || this._c.entity_weight);
      }));
      this._seen = undefined; this._shown = NaN; this._histAt = 0; this._hist = null; this._drawnKey = '';
    }

    _weightKg() {
      const v = this._num(this._c.entity_weight);
      return /lb/i.test(this._unit(this._c.entity_weight, 'kg')) ? v * 0.45359237 : v;
    }
    _bmi() {
      const c = this._c, b = this._num(c.entity_bmi);
      if (!isNaN(b)) return b;
      const h = Number(c.height) / 100, w = this._weightKg();
      return h > 0.5 && !isNaN(w) ? w / (h * h) : NaN;
    }
    _cat(b) { return isNaN(b) ? '' : b < 18.5 ? 'under' : b < 25 ? 'normal' : b < 30 ? 'over' : 'obese'; }

    // séquence de pesée : chiffres qui défilent jusqu'au poids, puis clignotement et alternance des mesures
    _weigh(force) {
      const r = this._root, card = this._card, w = this._num(this._c.entity_weight), lcd = r.getElementById('sclcd');
      cancelAnimationFrame(this._raf); clearInterval(this._cyc); clearTimeout(this._wt); this._cyc = 0; this._weighing = false;
      if (isNaN(w)) { lcd.textContent = '--.-'; return; }
      if (!this._anim()) { this._shown = w; this._startCycle(); return; }
      this._weighing = true;
      card.classList.remove('weigh', 'blink'); void card.offsetWidth; card.classList.add('weigh');
      r.getElementById('scunit').textContent = this._unit(this._c.entity_weight, 'kg').toUpperCase();
      const t0 = performance.now(), D = 1700, from = force || isNaN(this._shown) ? 0 : this._shown;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
        // petite oscillation avant stabilisation, comme une vraie balance
        const wob = k < 1 ? Math.sin(k * 26) * (1 - k) * 0.9 : 0;
        lcd.textContent = this._fmtLcd(from + (w - from) * e + wob);
        if (k < 1) this._raf = requestAnimationFrame(step);
        else {
          this._shown = w; card.classList.add('blink');
          this._wt = setTimeout(() => { card.classList.remove('weigh', 'blink'); this._weighing = false; this._startCycle(); }, 1600);
        }
      };
      this._raf = requestAnimationFrame(step);
    }
    _fmtLcd(v) { return isNaN(v) ? '--.-' : v.toFixed(1); }
    // écran : alterne poids → masse grasse → IMC tant que la pesée est récente, sinon poids fixe
    _startCycle() {
      const r = this._root, c = this._c, lcd = r.getElementById('sclcd'), unit = r.getElementById('scunit');
      clearInterval(this._cyc); this._cyc = 0;
      const items = [[this._num(c.entity_weight), this._unit(c.entity_weight, 'kg').toUpperCase()]];
      const fat = this._num(c.entity_fat_ratio), bmi = this._bmi();
      if (!isNaN(fat)) items.push([fat, '% FAT']);
      if (!isNaN(bmi)) items.push([bmi, 'BMI']);
      let i = 0;
      const show = () => { const [v, u] = items[i % items.length]; lcd.textContent = this._fmtLcd(v); unit.textContent = u; i++; };
      show();
      this._cycOn = this._card.classList.contains('recent') && items.length > 1 && this._anim();
      if (this._cycOn) this._cyc = setInterval(show, 2600);
    }

    _ago(ms) {
      const m = Math.round(ms / 60000);
      if (m < 1) return this._t('just_now');
      if (m < 60) return this._t('min_ago').replace('{n}', m);
      const h = Math.round(m / 60); if (h < 36) return this._t('h_ago').replace('{n}', h);
      return this._t('d_ago').replace('{n}', Math.round(h / 24));
    }

    _fetchHist() {
      const c = this._c, h = this._hass, id = c.entity_weight;
      if (!id || c.show_trend === false || this._histBusy || Date.now() - this._histAt < 30 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - Number(c.trend_days || 30) * 86400e3;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
        entity_ids: [id], minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((res) => {
          // une valeur par jour (moyenne) : la courbe suit la tendance, pas chaque mise à jour du capteur
          const days = new Map();
          ((res && res[id]) || []).forEach((p) => {
            const t = (p.lu ?? p.lc) * 1000, v = parseFloat(p.s); if (!isFinite(t) || !isFinite(v)) return;
            const k = Math.floor(t / 86400e3), d = days.get(k) || { t: 0, v: 0, n: 0 }; d.t += t; d.v += v; d.n++; days.set(k, d);
          });
          this._hist = [...days.values()].map((d) => ({ t: d.t / d.n, v: d.v / d.n })).sort((a, b) => a.t - b.t);
        })
        .catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; this._drawnKey = ''; if (this._hass) this._render(); });
    }

    _drawTrend() {
      const r = this._root, c = this._c, card = this._card, w = this._num(c.entity_weight), goal = this._num(c.entity_weight_goal);
      const pts = (this._hist || []).slice();
      if (!isNaN(w)) pts.push({ t: Date.now(), v: w });
      const show = c.show_trend !== false && pts.length >= 2;
      card.classList.toggle('notrend', !show);
      if (!show) return;
      const key = pts.map((p) => p.v).join(',') + goal;
      if (key === this._drawnKey) return;
      this._drawnKey = key;
      const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
      const vals = pts.map((p) => p.v).concat(isNaN(goal) ? [] : [goal]);
      let lo = Math.min(...vals), hi = Math.max(...vals); if (hi - lo < 1) { lo -= 0.5; hi += 0.5; }
      const X = (t) => 4 + ((t - t0) / Math.max(1, t1 - t0)) * 122, Y = (v) => 140 - ((v - lo) / (hi - lo)) * 34;
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.t).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(' ');
      r.getElementById('scline').setAttribute('d', d);
      r.getElementById('scarea').setAttribute('d', `${d} L126 142 L4 142 Z`);
      const lx = X(pts[pts.length - 1].t), ly = Y(pts[pts.length - 1].v);
      ['sclast', 'sclastp'].forEach((id) => { const e = r.getElementById(id); e.setAttribute('cx', lx.toFixed(1)); e.setAttribute('cy', ly.toFixed(1)); });
      const gl = r.getElementById('scgoalline');
      if (!isNaN(goal)) { gl.style.display = ''; gl.setAttribute('y1', Y(goal).toFixed(1)); gl.setAttribute('y2', Y(goal).toFixed(1)); } else gl.style.display = 'none';
      const delta = pts[pts.length - 1].v - pts[0].v, td = r.getElementById('sctd');
      td.textContent = `${delta > 0 ? '+' : delta < 0 ? '−' : '±'}${this._fmt(Math.abs(delta), 1)} ${this._unit(c.entity_weight, 'kg')}`;
      td.setAttribute('class', `td ${Math.abs(delta) < 0.05 ? 'eq' : delta < 0 ? 'dn' : 'up'}`);
      r.getElementById('sctl').textContent = this._t('trend').replace('{n}', Number(c.trend_days || 30));
      // retrace la courbe
      card.classList.remove('drawn'); void card.offsetWidth; card.classList.add('drawn');
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity_weight);
      const w = this._num(c.entity_weight), unit = this._unit(c.entity_weight, 'kg');
      const raw = s ? String(s.state) : '';
      const unav = !s || /^(unavailable|unknown)$/.test(raw);
      const since = s ? Date.now() - Date.parse(s.last_changed || s.last_updated) : NaN;
      const recent = !unav && isFinite(since) && since < Number(c.recent_minutes) * 60000;
      const bmi = c.show_bmi === false ? NaN : this._bmi();
      card.classList.toggle('unavailable', unav); card.classList.toggle('recent', recent); card.classList.toggle('idle', !recent && !unav);
      card.classList.toggle('nobmi', isNaN(bmi)); card.classList.toggle('noanim', !this._anim()); card.classList.toggle('compact', c.compact === true);
      r.getElementById('sctitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('scbadge');
      badge.textContent = unav ? this._t('unavailable') : isFinite(since) ? `${this._t('last')} ${this._ago(since)}` : '';
      badge.style.display = c.show_status === false ? 'none' : '';

      // nouvelle mesure (ou premier affichage) : animation de pesée
      const sig = s ? `${raw}|${s.last_changed}` : '';
      if (sig !== this._seen) { const first = this._seen === undefined; this._seen = sig; if (!unav) this._weigh(first); else r.getElementById('sclcd').textContent = '--.-'; }
      // fin de la période « récente » (ou retour) : on relance l'affichage fixe / alterné
      else if (!this._weighing && !unav && !!this._cycOn !== recent) this._startCycle();

      // jauge IMC
      const cl = Math.max(BMI_MIN, Math.min(BMI_MAX, isNaN(bmi) ? BMI_MIN : bmi));
      card.style.setProperty('--needle', `${(-90 + ((cl - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 180).toFixed(1)}deg`);
      r.getElementById('scbmi').textContent = isNaN(bmi) ? '--' : this._fmt(bmi, 1);
      r.getElementById('scbmil').textContent = isNaN(bmi) ? 'BMI' : `BMI · ${this._t(this._cat(bmi)).toUpperCase()}`;

      // objectif atteint (±0,5)
      const goal = this._num(c.entity_weight_goal), ge = r.getElementById('scgoal');
      const reached = !isNaN(goal) && !isNaN(w) && Math.abs(w - goal) <= 0.5;
      ge.textContent = reached ? `🎯 ${this._t('goal_reached')}` : ''; ge.classList.toggle('on', reached);

      this._fetchHist(); this._drawTrend();

      const V = {
        weight: [this._fmt(w), unit], fat: [this._fmt(this._num(c.entity_fat_ratio)), '%'],
        fat_mass: [this._fmt(this._num(c.entity_fat_mass)), this._unit(c.entity_fat_mass, 'kg')],
        muscle: [this._fmt(this._num(c.entity_muscle_mass)), this._unit(c.entity_muscle_mass, 'kg')],
        bone: [this._fmt(this._num(c.entity_bone_mass)), this._unit(c.entity_bone_mass, 'kg')],
        water: [this._fmt(this._num(c.entity_hydration)), this._unit(c.entity_hydration, 'kg')],
        visceral: [this._fmt(this._num(c.entity_visceral_fat), 0), this._unit(c.entity_visceral_fat, '')],
        pulse: [this._fmt(this._num(c.entity_heart_pulse), 0), this._unit(c.entity_heart_pulse, 'bpm')],
        goal: [this._fmt(goal), unit],
        // niveau de batterie de la balance (sensor en %, ou 0-100 sans unité)
        battery: [this._fmt(this._num(c.entity_battery), 0), this._unit(c.entity_battery, '%')],
      };
      const comp = new Set(['fat', 'fat_mass', 'muscle', 'bone', 'water', 'visceral', 'pulse']);
      TILES.forEach(([k, , ent, opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, u] = V[k];
        el.classList.toggle('hide', !c[ent] || c[opt] === false || (comp.has(k) && c.show_composition === false));
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = u ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      const bt = r.querySelector('.tile[data-k="bmi"]');
      bt.classList.toggle('hide', isNaN(bmi) || c.show_bmi === false);
      bt.querySelector('.lbl').textContent = this._l('bmi');
      bt.querySelector('.v').replaceChildren(this._fmt(bmi, 1));
    }
  }
  customElements.define(TAG, ApplianceScaleCard);

  /* ---- éditeur visuel ---- */
  class ApplianceScaleCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_weight'), ent('entity_fat_ratio'), ent('entity_fat_mass'), ent('entity_muscle_mass'), ent('entity_bone_mass'), ent('entity_hydration'),
        ent('entity_visceral_fat'), ent('entity_heart_pulse'), ent('entity_weight_goal'), ent('entity_battery'), ent('entity_bmi'),
        { type: 'grid', name: '', schema: [num('height', 50, 250, 1, undefined, 'cm'), num('recent_minutes', 1, 120, 1, 5, 'min'), num('trend_days', 7, 365, 1, 30)] },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_bmi'), bool('show_trend'), bool('animations')] },
        // une case par tuile
        { type: 'grid', name: '', schema: TILES.map((t) => bool(t[3])) },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceScaleCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Balance Withings en photo 3D : pesée animée (empreintes, chiffres qui défilent, ondes), jauge IMC, courbe 30 jours et objectif (Withings).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
