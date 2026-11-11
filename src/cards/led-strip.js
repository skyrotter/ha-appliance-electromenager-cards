/* Carte « Ruban LED » — custom:appliance-led-strip-card
 * Ruban LED piloté par une entité `light` (couleur, luminosité, effet) ou un simple `switch` / `input_boolean` (module on / off).
 * Trois installations (`style`) : plafond (garage, sous-face d'un plafond), toiture (bord de toit, façade éclairée), terrasse (pourtour / plinthe).
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
:host{display:block;height:100%} ha-card{display:block;height:100%;box-sizing:border-box;padding:10px 12px 12px;overflow:hidden;--ls-c:255,214,153;--ls-b:.8;--ls-ok:var(--appliance-ok-color,#43a047)}
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
.strip{fill:#d8dde2;stroke:#aab2ba;stroke-width:.8;transition:fill .5s}
.on .strip{fill:rgb(var(--ls-c));filter:drop-shadow(0 0 4px rgba(var(--ls-c),.9))}
.cone{fill:url(#lsg);opacity:0;transition:opacity .6s}
.on .cone{opacity:calc(.25 + var(--ls-b) * .75)}
.dot{fill:#fff;opacity:0}
.on .dot{opacity:.9}
.on.fx .dot{animation:lsfx 1.4s ease-in-out infinite;opacity:.9}
.dot:nth-child(2n){animation-delay:-.35s!important}.dot:nth-child(3n){animation-delay:-.7s!important}.dot:nth-child(5n){animation-delay:-1.05s!important}
@keyframes lsfx{50%{opacity:.15}}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1,var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctl{margin-top:4px}.compact .ctl button{height:24px;font-size:10px;--mdc-icon-size:14px}
.compact .tiles{margin-top:4px;gap:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px}
`;

  // Dessins : repères 270 × 150. Le dégradé #lsg (couleur de la lueur) est défini une fois pour les trois installations.
  const DEFS = `<defs><linearGradient id="lsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--ls-c))" stop-opacity=".9"/><stop offset="1" stop-color="rgb(var(--ls-c))" stop-opacity="0"/></linearGradient>
    <linearGradient id="lswall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eceff2"/><stop offset="1" stop-color="#d6dce1"/></linearGradient></defs>`;
  const DOTS = (x0, x1, y) => Array.from({ length: 9 }, (_, i) => `<circle class="dot" cx="${(x0 + ((x1 - x0) * i) / 8).toFixed(1)}" cy="${y}" r="1.4"/>`).join('');
  const SCENES = {
    // garage : plafond vu en perspective, deux rubans fixés sous le plafond qui éclairent le mur et le sol
    ceiling: `<rect x="10" y="10" width="250" height="26" rx="3" fill="#cfd5da" stroke="#b3bbc2"/>
      <rect x="10" y="36" width="250" height="100" fill="url(#lswall)"/><rect x="0" y="136" width="270" height="14" fill="#9aa1a8"/>
      <path class="cone" d="M30 36 H240 L262 136 H8 Z"/>
      <rect class="strip" x="30" y="30" width="210" height="6" rx="3"/><g>${DOTS(36, 234, 33)}</g>
      <rect x="150" y="62" width="80" height="74" rx="3" fill="#b9c1c8" stroke="#9aa3ab" opacity=".85"/><path d="M150 80 H230 M150 98 H230 M150 116 H230" stroke="#9aa3ab"/>`,
    // bord de toiture : façade sous un toit, ruban le long de la sous-face du débord
    roof: `<rect x="0" y="0" width="270" height="150" fill="#1d2433" opacity=".08"/>
      <path d="M0 40 L60 6 H270 V40 Z" fill="#7a5a4a" stroke="#5b4236"/><path d="M0 40 H270 V46 H0 Z" fill="#a98f7c"/>
      <rect x="10" y="46" width="250" height="96" fill="url(#lswall)"/><rect x="0" y="142" width="270" height="8" fill="#7d8a6e"/>
      <path class="cone" d="M12 46 H258 L266 142 H4 Z"/>
      <rect class="strip" x="12" y="43" width="246" height="5" rx="2.5"/><g>${DOTS(18, 252, 45.5)}</g>
      <rect x="50" y="68" width="48" height="52" rx="2" fill="#bfe0f5" stroke="#9fb3c3" stroke-width="2"/><path d="M74 68 V120 M50 94 H98" stroke="#9fb3c3" stroke-width="2"/>
      <rect x="170" y="72" width="30" height="70" rx="2" fill="#8d6e5a" stroke="#6d5444"/>`,
    // terrasse : lames de bois, ruban sous le rebord (pourtour) qui éclaire le sol
    terrace: `<rect x="0" y="0" width="270" height="150" fill="#1d2433" opacity=".08"/>
      <rect x="10" y="30" width="250" height="60" fill="url(#lswall)"/><rect x="10" y="30" width="250" height="5" fill="#cfd5da"/>
      <path d="M0 96 H270 V150 H0 Z" fill="#a98a63"/><path d="M0 108 H270 M0 120 H270 M0 132 H270" stroke="#8b6f4d" stroke-width="1.2"/>
      <path class="cone" d="M14 92 H256 L270 150 H0 Z"/>
      <rect class="strip" x="14" y="88" width="242" height="6" rx="3"/><g>${DOTS(20, 250, 91)}</g>
      <rect x="10" y="90" width="250" height="6" fill="#cfd5da" opacity=".0"/>`,
  };
  const SVG = (label, style) => `<svg viewBox="0 0 270 150" role="img" aria-label="${label}">${DEFS}${SCENES[style] || SCENES.ceiling}</svg>`;

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

  class ApplianceLedStripCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^light\./.test(i) && /(ruban|strip|led)/i.test(i)) || ids.find((i) => /^light\./.test(i)) || '', style: 'ceiling' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { style: 'ceiling', show_status: true, show_controls: true, show_brightness: true, show_effect: true, show_power: true, show_energy: true, ...c };
      this._built = false;
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
        ${SVG((c.name || this._t('name')).replace(/"/g, ''), c.style)}
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

    _color(a) {
      const c = this._c;
      if (c.color) { // couleur imposée : #rrggbb, rgb(…) ou nom CSS, résolue par le navigateur
        const el = document.createElement('canvas').getContext('2d'); el.fillStyle = '#ffd699'; el.fillStyle = String(c.color);
        const m = /^#([0-9a-f]{6})$/i.exec(el.fillStyle); if (m) return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16));
      }
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
      card.style.setProperty('--ls-c', this._color(a).join(','));
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
        { name: 'style', selector: { select: { options: ['ceiling', 'roof', 'terrace'] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['light', 'switch', 'input_boolean']), { name: 'color', selector: { text: {} } },
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', es: 'Español', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_controls'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'style' ? 'led_strip_style' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceLedStripCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Ruban LED animé : plafond, toiture ou terrasse, couleur et luminosité réelles, marche / arrêt, effet.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/led-strip.md',
  });
})();
