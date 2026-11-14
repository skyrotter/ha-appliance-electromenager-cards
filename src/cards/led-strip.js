/* Carte « Ruban LED » — custom:appliance-led-strip-card
 * Ruban LED piloté par une entité `light` (couleur, luminosité, effet) ou un simple `switch` / `input_boolean` (module on / off).
 * `shape: bars` : deux barres verticales (type Govee DreamView) de part et d'autre d'un téléviseur, même entité.
 * Dessin : le ruban seul (pastilles LED sur une bande souple) avec sa lueur, sans décor.
 * La lueur prend la couleur réelle de l'ampoule (rgb_color, hs_color, color_temp_kelvin), à défaut un blanc chaud, et suit la luminosité.
 * Commandes : marche / arrêt, curseur de luminosité (si l'entité sait varier), effet suivant (si l'entité a des effets).
 */
(() => {
  const TAG = 'appliance-led-strip-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n led_strip*/{};
  const ON_RE = /^(on|true|1)$/i;
  const BAD_RE = /^(unavailable|unknown)$/i;

  const CSS = `
:host{display:block;height:100%} ha-card{display:block;height:100%;box-sizing:border-box;padding:10px 12px 12px;overflow:hidden;--ls-c:255,214,153;--ls-c2:255,214,153;--ls-b:.8;--ls-ok:var(--appliance-ok-color,#43a047)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.on .badge{background:rgba(var(--ls-c),.28);color:var(--primary-text-color)}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px}
.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:18px;height:34px;min-width:34px;padding:0 10px;cursor:pointer;background:var(--secondary-background-color,rgba(127,127,127,.18));color:var(--primary-text-color);font:600 12px var(--paper-font-body1_-_font-family,Roboto,sans-serif);--mdc-icon-size:18px}
.ctl button.on{background:rgb(var(--ls-c));color:#1b1b1b;box-shadow:0 0 12px rgba(var(--ls-c),.55)}
.ctl button.hide{display:none}.ctl button:disabled{opacity:.4;cursor:default}
.ctl input[type=range]{flex:1 1 auto;min-width:60px;max-width:160px;accent-color:rgb(var(--ls-c));cursor:pointer}
.ctl input.hide{display:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
/* ---- illustration : la lueur suit la couleur (--ls-c) et la luminosité (--ls-b) ---- */
.sbase{fill:none;stroke:#d9dee3;stroke-width:12;stroke-linecap:round}
.sglow{fill:none;stroke:rgb(var(--ls-c));stroke-width:34;stroke-linecap:round;filter:blur(9px);opacity:0;transition:opacity .6s}
.on .sglow{opacity:calc(.25 + var(--ls-b) * .65)}
.sled{fill:none;stroke:#aab2ba;stroke-width:6;stroke-dasharray:2.4 8.6;transition:stroke .5s}
.on .sled{stroke:#fff;filter:drop-shadow(0 0 2px rgb(var(--ls-c)))}
.on .sbase{stroke:rgb(var(--ls-c));stroke-opacity:.55}
.on.fx .sled{animation:lsmove 1s linear infinite}
@keyframes lsmove{to{stroke-dashoffset:-22}}
.wall{fill:#171a22}.on .wall{fill:#10121a}
.wl,.wr{filter:blur(16px);opacity:0;transition:opacity .6s}.wl{fill:rgb(var(--ls-c))}.wr{fill:rgb(var(--ls-c2))}
.on .wl,.on .wr{opacity:calc(.2 + var(--ls-b) * .6)}
.tvscr{fill:#242831;stroke:#07080b;stroke-width:1.5}
.tvpic{opacity:0;transition:opacity .6s}.on .tvpic{opacity:calc(.35 + var(--ls-b) * .6)}
.cam{fill:#1b1d22}
.board{fill:#2c303a}.boardl{stroke:#171a22;stroke-width:1}
.table{fill:#3a3f4b}.tleg{fill:#1b1d22}.spk{fill:#8b93a1}
.bbase{fill:none;stroke:#3b414d;stroke-width:5;stroke-linecap:round}
.bfoot{fill:#3b414d}
.bglow{fill:none;stroke-width:26;stroke-linecap:round;filter:blur(8px);opacity:0;transition:opacity .6s}
.bgl{stroke:rgb(var(--ls-c))}.bgr{stroke:rgb(var(--ls-c2))}
.on .bglow{opacity:calc(.25 + var(--ls-b) * .65)}
.bled{fill:none;stroke:#59606d;stroke-width:3;stroke-dasharray:2 4;stroke-linecap:round;transition:stroke .5s}
.on .bledl{stroke:#fff;filter:drop-shadow(0 0 2px rgb(var(--ls-c)))}.on .bledr{stroke:#fff;filter:drop-shadow(0 0 2px rgb(var(--ls-c2)))}
.on.fx .bled{animation:lsmove 1s linear infinite}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1,var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctl{margin-top:4px}.compact .ctl button{height:24px;font-size:10px;--mdc-icon-size:14px}
.compact .tiles{margin-top:4px;gap:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px}
`;

  // Dessin : repères 270 × 100, bande souple ondulée ; la lueur est le même tracé flouté, teinté de la couleur de l'ampoule.
  const STRIP = 'M16 62 C58 22 100 22 135 50 S212 78 254 38';
  const SVG_STRIP = (label) => `<svg viewBox="0 0 270 100" role="img" aria-label="${label}"><path class="sglow" d="${STRIP}"/><path class="sbase" d="${STRIP}"/><path class="sled" d="${STRIP}"/></svg>`;
  // Barres TV (d'après la photo des Govee DreamView) : salon de nuit, mur éclairé de deux couleurs (gauche / droite), téléviseur
  // avec caméra, meuble bas, deux barres posées de chaque côté, table basse. Barre gauche = couleur de l'ampoule, droite = couleur 2.
  const BARL = 'M32 112 L32 150', BARR = 'M238 112 L238 150';
  const SVG_BARS = (label) => `<svg viewBox="0 0 270 200" role="img" aria-label="${label}"><defs><linearGradient id="lspic" x1="0" x2="1" y1="0.2" y2="0.8"><stop offset="0" style="stop-color:rgb(var(--ls-c))"/><stop offset="1" style="stop-color:rgb(var(--ls-c2))"/></linearGradient></defs><rect class="wall" width="270" height="168" rx="8"/><rect class="wl" x="6" y="14" width="140" height="140"/><rect class="wr" x="124" y="14" width="140" height="140"/><path class="bglow bgl" d="${BARL}"/><path class="bglow bgr" d="${BARR}"/><rect class="tvscr" x="58" y="30" width="154" height="90" rx="2"/><rect class="tvpic" x="60" y="32" width="150" height="86" fill="url(#lspic)"/><rect class="cam" x="130" y="24" width="10" height="6" rx="3"/><rect class="board" x="10" y="150" width="250" height="20" rx="2"/><path class="boardl" d="M95 150V170M175 150V170"/><path class="bbase" d="${BARL}"/><path class="bled bledl" d="${BARL}"/><path class="bbase" d="${BARR}"/><path class="bled bledr" d="${BARR}"/><rect class="bfoot" x="26" y="148" width="12" height="3" rx="1.5"/><rect class="bfoot" x="232" y="148" width="12" height="3" rx="1.5"/><ellipse class="table" cx="135" cy="182" rx="56" ry="7"/><rect class="tleg" x="125" y="184" width="20" height="14" rx="2"/><ellipse class="spk" cx="118" cy="180" rx="6" ry="2.5"/></svg>`;
  const SVG = (label, shape) => (shape === 'bars' ? SVG_BARS : SVG_STRIP)(label);

  const TILES = [['brightness', 'mdi:brightness-6', 'show_brightness'], ['effect', 'mdi:palette-swatch-variant', 'show_effect'],
    ['power', 'mdi:flash', 'show_power'], ['energy', 'mdi:lightning-bolt-circle', 'show_energy']];

  // température de couleur (kelvins) → RGB approximatif (formule de Tanner Helland)
  const kelvinRgb = (k) => {
    const t = Math.max(1000, Math.min(40000, k)) / 100, cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
    const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    return [cl(r), cl(g), cl(b)];
  };
  const hsRgb = (h, s) => { // teinte 0-360, saturation 0-100 → RGB (luminosité maximale)
    s /= 100; const f = (n) => { const k = (n + h / 60) % 6; return Math.round(255 * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)))); };
    return [f(5), f(3), f(1)];
  };

  // teinte décalée : RGB → HSL, +deg, retour RGB (pour la 2e couleur du mur par défaut)
  const shiftHue = ([r, g, b], deg) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, sa = 0;
    if (d) { sa = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    const k = (n) => { const q = (n + (h + deg) / 30) % 12; return Math.round(255 * (l - sa * Math.min(l, 1 - l) * Math.max(-1, Math.min(q - 3, 9 - q, 1)))); };
    return [k(0), k(8), k(4)];
  };

  class ApplianceLedStripCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^light\./.test(i) && /(ruban|strip|led)/i.test(i)) || ids.find((i) => /^light\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_brightness: true, show_effect: true, show_power: true, show_energy: true, ...c };
      this._built = false; // reconstruit aussi le dessin quand `shape` change
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch && !this._dragging) this._render(); }
    getCardSize() { return 4; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _dom() { return String(this._c.entity || '').split('.')[0]; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lstitle"></div><div class="badge" id="lsbadge"></div></div>
        ${SVG((c.name || this._t('name')).replace(/"/g, ''), c.shape)}
        <div class="ctl" id="lsctl"><button id="lspw" aria-pressed="false"><ha-icon icon="mdi:power"></ha-icon></button><input id="lsbr" class="hide" type="range" min="1" max="100" step="1" aria-label="${this._t('brightness')}"><button id="lsfx" class="hide"><ha-icon icon="mdi:palette-swatch-variant"></ha-icon></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(c.entity));
      root.getElementById('lspw').addEventListener('click', () => {
        const d = this._dom(); this._hass.callService(['light', 'switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity });
      });
      const br = root.getElementById('lsbr');
      br.addEventListener('input', () => { this._dragging = true; });
      br.addEventListener('change', () => { this._dragging = false; this._hass.callService('light', 'turn_on', { entity_id: c.entity, brightness_pct: Number(br.value) }); });
      root.getElementById('lsfx').addEventListener('click', () => {
        const s = this._st(c.entity), list = (s && s.attributes && s.attributes.effect_list) || [];
        if (list.length) this._hass.callService('light', 'turn_on', { entity_id: c.entity, effect: list[(list.indexOf(s.attributes.effect) + 1) % list.length] });
      });
      const tgt = { brightness: c.entity, effect: c.entity, power: c.entity_power, energy: c.entity_energy };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(tgt[el.dataset.k])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // couleur imposée : #rrggbb, rgb(…) ou nom CSS, résolue par le navigateur (null si absente ou invalide)
    _css(v) {
      if (!v) return null;
      const el = document.createElement('canvas').getContext('2d'); el.fillStyle = '#ffd699'; el.fillStyle = String(v);
      const m = /^#([0-9a-f]{6})$/i.exec(el.fillStyle); return m ? [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16)) : null;
    }
    _color(a) {
      const c = this._c, forced = this._css(c.color);
      if (forced) return forced;
      if (Array.isArray(a.rgb_color) && a.rgb_color.length >= 3) return a.rgb_color.slice(0, 3);
      if (Array.isArray(a.hs_color) && a.hs_color.length >= 2 && Number(a.hs_color[1]) > 4) return hsRgb(Number(a.hs_color[0]), Number(a.hs_color[1]));
      const k = Number(a.color_temp_kelvin) || (Number(a.color_temp) > 0 ? 1e6 / Number(a.color_temp) : NaN);
      return isNaN(k) ? [255, 214, 153] : kelvinRgb(k);
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity);
      const raw = s ? String(s.state) : '', a = (s && s.attributes) || {};
      const st = !s || BAD_RE.test(raw) ? 'unavailable' : ON_RE.test(raw) ? 'on' : 'off';
      const dimmable = this._dom() === 'light' && Array.isArray(a.supported_color_modes) ? a.supported_color_modes.some((m) => m !== 'onoff') : this._dom() === 'light' && a.brightness != null;
      const bri = a.brightness != null ? Math.max(0, Math.min(1, Number(a.brightness) / 255)) : 1;
      const fx = st === 'on' && !!a.effect && !/^(none|off)$/i.test(String(a.effect));
      card.className = `${st}${fx ? ' fx' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const col = this._color(a);
      card.style.setProperty('--ls-c', col.join(','));
      card.style.setProperty('--ls-c2', (this._css(c.color2) || shiftHue(col, 150)).join(',')); // barres TV : 2e couleur du mur
      card.style.setProperty('--ls-b', (st === 'on' ? Math.max(0.15, bri) : 0).toFixed(2));
      r.getElementById('lstitle').textContent = c.name || (s && s.attributes && s.attributes.friendly_name) || this._t('name');
      const badge = r.getElementById('lsbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      // commandes
      const ctl = r.getElementById('lsctl'), pw = r.getElementById('lspw'), br = r.getElementById('lsbr'), fxb = r.getElementById('lsfx');
      ctl.classList.toggle('hide', c.show_controls === false || !s);
      pw.classList.toggle('on', st === 'on'); pw.setAttribute('aria-pressed', String(st === 'on')); pw.disabled = st === 'unavailable'; pw.title = this._t(st === 'on' ? 'turn_off' : 'turn_on');
      br.classList.toggle('hide', !dimmable || st === 'unavailable'); br.disabled = st !== 'on';
      if (!this._dragging) br.value = String(Math.round(bri * 100));
      const hasFx = Array.isArray(a.effect_list) && a.effect_list.length > 1;
      fxb.classList.toggle('hide', !hasFx || st === 'unavailable'); fxb.title = this._t('next_effect');

      // tuiles
      const V = {
        brightness: [dimmable && st === 'on', this._fmt(bri * 100, 0), '%'],
        effect: [hasFx || fx, a.effect ? String(a.effect) : this._t('none'), ''],
        power: [c.entity_power, this._fmt(this._num(c.entity_power), 0), this._unit(c.entity_power, 'W')],
        energy: [c.entity_energy, this._fmt(this._num(c.entity_energy), 2), this._unit(c.entity_energy, 'kWh')],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceLedStripCard);

  /* ---- éditeur visuel ---- */
  class ApplianceLedStripCardEditor extends HTMLElement {
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
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        { name: 'shape', selector: { select: { mode: 'dropdown', options: [{ value: 'strip', label: window.applianceEditorLabel('shape_strip', this._hass) }, { value: 'bars', label: window.applianceEditorLabel('shape_bars', this._hass) }] } } },
        ent('entity', ['light', 'switch', 'input_boolean']), { name: 'color', selector: { text: {} } }, { name: 'color2', selector: { text: {} } },
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_controls'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceLedStripCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Ruban LED animé ou barres lumineuses TV : plafond, toiture ou terrasse, couleur et luminosité réelles, marche / arrêt, effet.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/led-strip.md',
  });
})();
