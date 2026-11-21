/* Carte « Tablette murale » — custom:appliance-wall-tablet-card
 * Tablette tactile fixée au mur (couloir, cuisine, entrée…) dessinée en SVG : écran éteint (vitre sombre), allumé (tableau de bord avec l'heure),
 * mode « fond d'écran » (diaporama de photos qui se fondent l'une dans l'autre, avec un léger zoom). Tout est facultatif :
 * l'état de l'écran (binary_sensor / switch), le mode fond d'écran (switch / binary_sensor), la luminosité, la batterie, le CPU, la RAM, la puissance.
 * Boutons : écran (switch), fond d'écran (switch), recharger la page du kiosque (button / script), redémarrer le PC (button / script, avec confirmation).
 * Pensée pour un mini PC Windows + navigateur en kiosque piloté par HASS.Agent, mais fonctionne avec toute entité (Fully Kiosk, Wallpanel…).
 */
(() => {
  const TAG = 'appliance-wall-tablet-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n wall_tablet*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--wt-ok:var(--appliance-ok-color,#43a047);--wt-warn:var(--appliance-warn-color,#ffa000);--wt-alert:var(--appliance-alert-color,#db4437);--br:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.on .badge{background:color-mix(in srgb,var(--wt-ok) 20%,transparent);color:var(--wt-ok)}
.wall .badge{background:color-mix(in srgb,#29b6f6 22%,transparent);color:#29b6f6}
.unavailable .badge{background:color-mix(in srgb,var(--wt-alert) 20%,transparent);color:var(--wt-alert)}
svg{display:block;width:100%;max-width:calc(250px * var(--illus-scale,1));height:auto;margin:4px auto 0;overflow:visible;cursor:pointer}
.portrait svg{max-width:calc(170px * var(--illus-scale,1))}
/* écran : éteint = vitre noire ; allumé = tableau de bord ; fond d'écran = diaporama */
.ui,.slides,.halo{opacity:0;transition:opacity .6s}
.on .ui{opacity:calc(.35 + var(--br) * .65)}
.wall .slides{opacity:calc(.35 + var(--br) * .65)}.wall .ui{opacity:0}
.on .halo,.wall .halo{opacity:calc(.12 + var(--br) * .38)}
.off .frame,.unavailable .frame{filter:none}.unavailable svg{filter:grayscale(1) opacity(.6)}
.sl{opacity:0;transform-origin:50% 50%}
.wall .sl{animation:wtslide 12s linear infinite}
.wall .sl.s2{animation-delay:-8s}.wall .sl.s3{animation-delay:-4s}
@keyframes wtslide{0%{opacity:0;transform:scale(1)}8%{opacity:1}33%{opacity:1}41%{opacity:0;transform:scale(1.12)}100%{opacity:0;transform:scale(1.12)}}
.clock{font:700 17px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);fill:#fff}
.sub{font:500 6px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);fill:#9fb3c8}
.tl{fill:#1d2733}.tl.on2{fill:#2f6fb5}
.cam{fill:#2b3038}.led{fill:#2b3038}.on .led,.wall .led{fill:#3ddc6a;filter:drop-shadow(0 0 2px #3ddc6a)}
.glint{opacity:0;fill:url(#wt-gl)}.on .glint,.wall .glint,.off .glint{opacity:1}
.noanim *{animation:none!important}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--wt-alert)}
.ctrls{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.ctrls.hide{display:none}
.ctrls button{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctrls button.on{background:#29b6f6;color:#06202b}
.ctrls button ha-icon{--mdc-icon-size:16px}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{margin-top:3px}.compact .tiles{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  // tablette dessinée dans un repère W × H (paysage 250 × 170, portrait 170 × 250) ; écran = (sx, sy, sw, sh)
  const SVG = (label, portrait) => {
    const W = portrait ? 170 : 250, H = portrait ? 250 : 170, sx = 14, sy = 14, sw = W - 28, sh = H - 28;
    const slides = [['#ff8a65', '#5c6bc0', '#1a237e'], ['#26a69a', '#66bb6a', '#1b5e20'], ['#29b6f6', '#80deea', '#01579b']].map(([a, b, c], i) =>
      `<g class="sl s${i + 1}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="url(#wt-s${i + 1})"/><circle cx="${sx + sw * (0.3 + i * 0.2)}" cy="${sy + sh * 0.38}" r="${sh * 0.13}" fill="#fff" opacity=".85"/><path d="M${sx} ${sy + sh} L${sx} ${sy + sh * 0.72} Q${sx + sw * 0.3} ${sy + sh * 0.55} ${sx + sw * 0.55} ${sy + sh * 0.72} T${sx + sw} ${sy + sh * 0.66} L${sx + sw} ${sy + sh}Z" fill="${c}" opacity=".9"/></g>`).join('');
    const defs = [['#ff8a65', '#5c6bc0'], ['#26a69a', '#a5d6a7'], ['#29b6f6', '#e0f7fa']].map(([a, b], i) => `<linearGradient id="wt-s${i + 1}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('');
    const tw = (sw - 30) / 2, th = (sh - 56) / 2;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}"><defs>${defs}
  <radialGradient id="wt-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5aa9ff" stop-opacity=".8"/><stop offset="1" stop-color="#5aa9ff" stop-opacity="0"/></radialGradient>
  <linearGradient id="wt-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="wt-clip"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="5"/></clipPath></defs>
  <ellipse class="halo" cx="${W / 2}" cy="${H / 2}" rx="${W * 0.62}" ry="${H * 0.62}" fill="url(#wt-halo)"/>
  <rect x="3" y="5" width="${W - 6}" height="${H - 6}" rx="12" fill="#000" opacity=".28"/>
  <rect class="frame" x="2" y="2" width="${W - 4}" height="${H - 4}" rx="11" fill="#2a2f36" stroke="#4a525c" stroke-width="1.4"/>
  <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="5" fill="#06080b"/>
  <g clip-path="url(#wt-clip)">
   <g class="ui"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="#0f1620"/>
    <text class="clock" x="${sx + 10}" y="${sy + 24}" id="wtclock">--:--</text><text class="sub" x="${sx + 10}" y="${sy + 36}" id="wtsub"></text>
    <rect class="tl on2" x="${sx + 10}" y="${sy + 46}" width="${tw}" height="${th}" rx="5"/><rect class="tl" x="${sx + 20 + tw}" y="${sy + 46}" width="${tw}" height="${th}" rx="5"/>
    <rect class="tl" x="${sx + 10}" y="${sy + 56 + th}" width="${tw}" height="${th}" rx="5"/><rect class="tl on2" x="${sx + 20 + tw}" y="${sy + 56 + th}" width="${tw}" height="${th}" rx="5"/></g>
   <g class="slides">${slides}</g>
   <rect class="glint" x="${sx}" y="${sy}" width="${sw}" height="${sh}"/>
  </g>
  <circle class="cam" cx="${W / 2}" cy="8" r="2.4"/><circle class="led" cx="${W - 9}" cy="${H - 8}" r="1.8"/>
 </svg>`;
  };

  // grandeur → fraction 0..1 : % (≤ 100) ou 0..255
  const frac = (v) => (isNaN(v) ? 1 : Math.max(0, Math.min(1, v <= 100 ? v / 100 : v / 255)));
  const uptimeSeconds = (st) => {
    if (!st || /^(unavailable|unknown|none)$/i.test(String(st.state))) return NaN;
    const raw = String(st.state), n = parseFloat(raw.replace(',', '.'));
    if ((st.attributes || {}).device_class === 'timestamp' || (!isFinite(n) && !isNaN(Date.parse(raw)))) { const ms = Date.now() - Date.parse(raw); return ms > 0 ? ms / 1000 : NaN; }
    if (!isFinite(n)) return NaN;
    const u = String((st.attributes || {}).unit_of_measurement || 's').toLowerCase();
    return n * (u === 'd' ? 86400 : u === 'h' ? 3600 : u === 'min' ? 60 : u === 'ms' ? 0.001 : 1);
  };
  const fmtUptime = (sec, loc) => {
    if (!isFinite(sec)) return '--';
    const f = (v, unit) => new Intl.NumberFormat(loc, { style: 'unit', unit, unitDisplay: 'narrow', maximumFractionDigits: 0 }).format(v);
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), mi = Math.floor((sec % 3600) / 60);
    return d ? `${f(d, 'day')} ${f(h, 'hour')}` : h ? `${f(h, 'hour')} ${f(mi, 'minute')}` : f(mi, 'minute');
  };

  const TILES = [['brightness', 'mdi:brightness-6', 'entity_brightness', 'show_brightness'], ['battery', 'mdi:battery', 'entity_battery', 'show_battery'], ['cpu', 'mdi:cpu-64-bit', 'entity_cpu', 'show_cpu'],
    ['ram', 'mdi:memory', 'entity_ram', 'show_ram'], ['uptime', 'mdi:timer-outline', 'entity_uptime', 'show_uptime'], ['power', 'mdi:flash', 'entity_power', 'show_power'], ['energy', 'mdi:lightning-bolt-circle', 'entity_energy', 'show_energy']];

  class ApplianceWallTabletCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), pick = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return { entity_screen: pick(/(screen|ecran|écran|display|monitor)/i, 'binary_sensor') || pick(/(screen|ecran|écran|display|monitor)/i, 'switch'), entity_wallpaper: pick(/(wallpaper|slideshow|diaporama)/i, 'switch'), entity_reload: pick(/(reload|refresh|kiosk)/i, 'button') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_clock: true, animations: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._clock(); }, 20000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 4; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(id) { const s = this._st(id); return this._ok(s) && /^(on|true|1|home|playing|active|poweron|power_on|awake|wake|waking)$/i.test(String(s.state).trim()); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _unit(id, d) { return String((this._st(id)?.attributes || {}).unit_of_measurement || d || '').trim(); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _dom(id) { return String(id || '').split('.')[0]; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), portrait = this._c.orientation === 'portrait';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="wttitle"></div><div class="badge" id="wtbadge"></div></div>
        ${SVG(this._c.name || this._t('name'), portrait)}
        <div class="ctrls" id="wtctrls"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_screen || this._c.entity_wallpaper || this._c.entity_reload));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[TILES.find((t) => t[0] === el.dataset.k)[2]])));
      root.getElementById('wtctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true;
    }

    // état : indisponible / éteint / allumé / fond d'écran (diaporama)
    _state() {
      const c = this._c, scr = this._st(c.entity_screen), wp = this._st(c.entity_wallpaper);
      const seen = [scr, wp, this._st(c.entity_reload), this._st(c.entity_screen_on), this._st(c.entity_cpu), this._st(c.entity_battery), this._st(c.entity_brightness), this._st(c.entity_power)].filter(Boolean);
      if (!seen.length || !seen.some((s) => this._ok(s))) return 'unavailable';
      const wall = c.entity_wallpaper && this._on(c.entity_wallpaper);
      const screenOn = c.entity_screen ? this._on(c.entity_screen) : true;
      return !screenOn ? 'off' : wall ? 'wall' : 'on';
    }

    _cmd(k) {
      const c = this._c, h = this._hass; if (!h) return;
      const toggle = (id) => { const d = this._dom(id); h.callService(['switch', 'input_boolean', 'light'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: id }); };
      const press = (id) => { const d = this._dom(id), svc = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], scene: ['scene', 'turn_on'], automation: ['automation', 'trigger'] }[d] || ['homeassistant', 'toggle']; h.callService(svc[0], svc[1], { entity_id: id }); };
      // écran piloté par deux boutons (veille / réveil) : on appelle celui qui change l'état courant
      const wantOn = !this._on(c.entity_screen), pair = wantOn ? c.entity_screen_on : c.entity_screen_off;
      if (k === 'screen' && c.entity_screen && pair) press(pair);
      else if (k === 'screen_on' && c.entity_screen_on) press(c.entity_screen_on);
      else if (k === 'screen_off' && c.entity_screen_off) press(c.entity_screen_off);
      else if (k === 'screen' && c.entity_screen) toggle(c.entity_screen);
      else if (k === 'wallpaper' && c.entity_wallpaper) toggle(c.entity_wallpaper);
      else if (k === 'reload' && c.entity_reload) press(c.entity_reload);
      else if (k === 'reboot' && c.entity_reboot && (!window.confirm || window.confirm(this._t('reboot_confirm')))) press(c.entity_reboot);
    }

    _clock() {
      const r = this._root; if (!r) return;
      const el = r.getElementById('wtclock'), sub = r.getElementById('wtsub'), now = new Date(), loc = window.applianceLocale(this._c, this._hass);
      if (el) el.textContent = this._c.show_clock === false ? '' : window.applianceClock(this._hass, now, loc);
      if (sub) sub.textContent = this._c.show_clock === false ? '' : now.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' });
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, st = this._state();
      const br = c.entity_brightness ? frac(this._num(c.entity_brightness)) : 1;
      card.className = `${st}${c.orientation === 'portrait' ? ' portrait' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--br', String(isNaN(br) ? 1 : br.toFixed(2)));
      r.getElementById('wttitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('wtbadge'); badge.textContent = this._t(`st_${st}`); badge.style.display = c.show_status === false ? 'none' : '';
      this._clock();

      const ctr = r.getElementById('wtctrls'), wallOn = c.entity_wallpaper && this._on(c.entity_wallpaper), scrOn = c.entity_screen && this._on(c.entity_screen);
      const btns = [
        c.entity_screen && (['switch', 'input_boolean', 'light'].includes(this._dom(c.entity_screen)) || (c.entity_screen_on && c.entity_screen_off)) ? ['screen', scrOn ? 'mdi:monitor' : 'mdi:monitor-off', 'screen', scrOn] : null,
        // veille / réveil par deux boutons sans entité d'état : un bouton chacun
        !c.entity_screen && c.entity_screen_on ? ['screen_on', 'mdi:monitor', 'screen_on', false] : null,
        !c.entity_screen && c.entity_screen_off ? ['screen_off', 'mdi:monitor-off', 'screen_off', false] : null,
        c.entity_wallpaper && ['switch', 'input_boolean'].includes(this._dom(c.entity_wallpaper)) ? ['wallpaper', 'mdi:image-multiple', 'wallpaper', wallOn] : null,
        c.entity_reload ? ['reload', 'mdi:refresh', 'reload', false] : null,
        c.entity_reboot ? ['reboot', 'mdi:restart', 'reboot', false] : null,
      ].filter(Boolean);
      ctr.classList.toggle('hide', !btns.length || c.show_controls === false);
      const sig = btns.map((b) => b.join('|')).join(';');
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on]) => `<button class="${on ? 'on' : ''}" data-k="${k}" title="${esc(this._l(lbl))}" aria-label="${esc(this._l(lbl))}"><ha-icon icon="${icon}"></ha-icon></button>`).join('');
      }

      const loc = window.applianceLocale(c, this._hass);
      const V = {
        brightness: [this._fmt(isNaN(this._num(c.entity_brightness)) ? NaN : br * 100, 0), '%'],
        battery: [this._fmt(this._num(c.entity_battery), 0), this._unit(c.entity_battery, '%')],
        cpu: [this._fmt(this._num(c.entity_cpu), 0), this._unit(c.entity_cpu, '%')],
        ram: [this._fmt(this._num(c.entity_ram), 0), this._unit(c.entity_ram, '%')],
        uptime: [fmtUptime(uptimeSeconds(this._st(c.entity_uptime)), loc), ''],
        power: [this._fmt(this._num(c.entity_power), this._num(c.entity_power) < 10 ? 1 : 0), this._unit(c.entity_power, 'W')],
        energy: [this._fmt(this._num(c.entity_energy), 2), this._unit(c.entity_energy, 'kWh')],
      };
      TILES.forEach(([k, , ent, opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        el.classList.toggle('hide', !c[ent] || c[opt] === false);
        el.classList.toggle('bad', k === 'battery' && this._num(c[ent]) < 15);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val), small);
      });
      if (window.applianceExtraTiles) window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
    }
  }
  customElements.define(TAG, ApplianceWallTabletCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWallTabletCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        { name: 'orientation', default: 'landscape', selector: { select: { mode: 'dropdown', options: ['landscape', 'portrait'].map((value) => ({ value, label: T[window.applianceLang(T, this._c, this._hass)]['o_' + value] || value })) } } },
        ent('entity_screen', ['binary_sensor', 'switch', 'input_boolean', 'sensor', 'light']), ent('entity_screen_on', ['button', 'input_button', 'script', 'automation']), ent('entity_screen_off', ['button', 'input_button', 'script', 'automation']), ent('entity_wallpaper', ['switch', 'input_boolean', 'binary_sensor']),
        ent('entity_reload', ['button', 'input_button', 'script', 'automation']), ent('entity_reboot', ['button', 'input_button', 'script', 'automation']),
        ent('entity_brightness', ['sensor', 'number', 'input_number']), ent('entity_battery', 'sensor'), ent('entity_cpu', 'sensor'), ent('entity_ram', 'sensor'),
        ent('entity_uptime', 'sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { name: 'extra_tiles', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_clock'), ...TILES.map(([, , , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass); return T[l][`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  customElements.define(TAG + '-editor', ApplianceWallTabletCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Tablette murale (couloir, kiosque) dessinée en SVG : écran éteint / allumé / diaporama, boutons écran, fond d'écran, recharger la page et redémarrer le PC, luminosité, batterie, CPU.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/wall-tablet.md',
  });
})();
