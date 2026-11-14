/* Carte « Humidificateur » — custom:appliance-humidifier-card
 * Humidificateur à évaporation (Xiaomi Smartmi Evaporative Humidifier 2…) : humidité actuelle et cible, vitesse du ventilateur,
 * modes (Dry, Clean…), niveau d'eau du réservoir, température. Deux illustrations au choix (option style) :
 *   svg (dessin générique) et smartmi (photo détourée du Smartmi Evaporative Humidifier 2).
 * Mêmes calques animés dans les deux cas, dans le repère de la photo (1023 × 1590) : écran LCD redessiné (humidité, wifi, barre d'eau,
 * vitesse, mode), brume qui monte de l'ouverture du dessus, halo du bouton « Clean » pendant le nettoyage.
 * États : off, humidifying, target (humidité cible atteinte), dry (mode Dry), clean (mode Clean), unavailable ; alerte « réservoir bas ».
 * Boutons : marche / arrêt, humidité cible − / +, un bouton par mode, un bouton par vitesse du ventilateur.
 */
(() => {
  const TAG = 'appliance-humidifier-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n humidifier*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = 'data:image/webp;base64,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';
  const STYLES = ['svg', 'smartmi'];
  const OFF_RE = /^(off|false|0|standby|idle_off)$/i, BAD_RE = /^(unavailable|unknown|none|)$/i;
  const CLEAN_RE = /clean|nettoy|reinig|pulizia|schoon|czysz|curat|очист|clea/i, DRY_RE = /^(dry|sec|trocken|secco|droog|suchy|uscat|сух)|dry/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --hm-ok:var(--appliance-ok-color,#43a047);--hm-cold:var(--appliance-cold-color,#2b9af9);--hm-warn:var(--appliance-warn-color,#ffa000);--hm-alert:var(--appliance-alert-color,#db4437);--spd:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.humidifying .badge{background:color-mix(in srgb,var(--hm-cold) 22%,transparent);color:var(--hm-cold)}
.target .badge{background:color-mix(in srgb,var(--hm-ok) 22%,transparent);color:var(--hm-ok)}
.dry .badge,.clean .badge{background:color-mix(in srgb,var(--hm-warn) 24%,transparent);color:var(--hm-warn)}
.lowwater .badge{background:color-mix(in srgb,var(--hm-alert) 22%,transparent);color:var(--hm-alert)}
.alert-line{display:none;margin-top:4px;font-size:12px;font-weight:600;color:var(--hm-alert);align-items:center;gap:4px}.lowwater .alert-line{display:flex}.alert-line ha-icon{--mdc-icon-size:16px}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--hm-alert)}
/* ---- boutons : marche / arrêt, humidité cible, modes, vitesses ---- */
.ctl{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;margin-top:8px}.ctl.hide{display:none}
.ctl button{flex:0 1 auto;min-width:44px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 10px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}.ctl button:hover{filter:brightness(1.12)}.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:var(--hm-cold);color:#fff}
.ctl .tg{font-size:13px;font-weight:600;min-width:64px;text-align:center;color:var(--primary-text-color)}
.ctl .lbl{width:100%;text-align:center;font-size:10px;color:var(--secondary-text-color);margin-bottom:-2px}
/* ---- compact ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration (repère 1023 × 1590) ---- */
.shadow{opacity:.2}
.lcd{transition:opacity .5s}.off .lcd,.unavailable .lcd{opacity:.1}
.mist{opacity:0}
.humidifying .mist{animation:hmrise calc(4s * var(--spd)) ease-out infinite}.dry .mist{animation:hmrise calc(5s * var(--spd)) ease-out infinite;opacity:0}
.mist.m2{animation-delay:calc(-1.3s * var(--spd))!important}.mist.m3{animation-delay:calc(-2.6s * var(--spd))!important}.mist.m4{animation-delay:calc(-3.5s * var(--spd))!important}
.cring{opacity:0;fill:none;stroke:#7fe9ff;stroke-width:6}.clean .cring{opacity:.9;animation:hmpulse 1.6s ease-in-out infinite}
.wbar{fill:#eef2f5}.wbar.e{fill:#ffffff;opacity:.22}.lowwater .wbar:not(.e){fill:#ff5a4d;animation:hmblink 1s steps(2) infinite}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
@keyframes hmrise{0%{opacity:0;transform:translateY(40px) scale(.6)}15%{opacity:.8}100%{opacity:0;transform:translateY(-260px) scale(1.7)}}
@keyframes hmpulse{50%{opacity:.3}}
@keyframes hmblink{50%{opacity:.25}}
`;

  // corps : photo détourée (smartmi) ou dessin générique, dans le repère 1023 × 1590
  const BODY = {
    smartmi: () => `<image href="${IMG}" x="0" y="0" width="1023" height="1590"/>`,
    svg: () => `<defs><linearGradient id="hmb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3e7eb"/><stop offset=".12" stop-color="#fbfcfd"/><stop offset=".85" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3e8"/></linearGradient>
      <linearGradient id="hmt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#dde2e7"/></linearGradient></defs>
      <rect x="0" y="0" width="1023" height="1560" rx="70" fill="url(#hmb)" stroke="#d3d9df" stroke-width="5"/>
      <rect x="40" y="36" width="943" height="110" rx="50" fill="url(#hmt)"/><rect x="101" y="51" width="810" height="66" rx="30" fill="#dfe4e9"/><rect x="101" y="51" width="810" height="14" rx="7" fill="#000" opacity=".1"/>
      <path d="M2 930H1021" stroke="#cfd5db" stroke-width="5"/><path d="M2 937H1021" stroke="#fff" stroke-width="4" opacity=".9"/>
      <rect x="150" y="1546" width="110" height="44" rx="20" fill="#e6eaee" stroke="#cfd5db" stroke-width="4"/><rect x="763" y="1546" width="110" height="44" rx="20" fill="#e6eaee" stroke="#cfd5db" stroke-width="4"/>
      <rect x="209" y="324" width="604" height="98" rx="49" fill="url(#hmlcd)"/>
      <circle cx="259" cy="372" r="30" fill="none" stroke="#8d949b" stroke-width="3"/><circle cx="259" cy="372" r="7" fill="none" stroke="#8d949b" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<line x1="259" y1="348" x2="259" y2="341" stroke="#8d949b" stroke-width="3" transform="rotate(${k * 45} 259 372)"/>`).join('')}
      <circle cx="763" cy="372" r="30" fill="none" stroke="#8d949b" stroke-width="3"/>`,
  };

  const SVG = (style, label) => `<svg viewBox="-40 -250 1103 1890" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="hmlcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25272b"/><stop offset=".5" stop-color="#0d0e10"/><stop offset="1" stop-color="#050506"/></linearGradient>
    <filter id="hmblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <ellipse class="shadow" cx="511" cy="1590" rx="470" ry="26" fill="#000"/>
    ${(BODY[style] || BODY.svg)()}
    <!-- brume : monte de l'ouverture du dessus -->
    <g filter="url(#hmblur)" fill="#8fc2e8"><ellipse class="mist m1" cx="330" cy="90" rx="95" ry="48"/><ellipse class="mist m2" cx="520" cy="80" rx="110" ry="50"/><ellipse class="mist m3" cx="700" cy="92" rx="95" ry="46"/><ellipse class="mist m4" cx="450" cy="86" rx="80" ry="42"/></g>
    <!-- écran LCD redessiné : humidité, wifi, barre d'eau, vitesse, mode -->
    <rect x="322" y="334" width="400" height="76" rx="14" fill="url(#hmlcd)"/>
    <g class="lcd" fill="#f4f7f9">
      <text id="hmv" x="362" y="394" font-size="68" font-family="Roboto,Arial,sans-serif" font-weight="300" letter-spacing="-2">--</text>
      <text x="452" y="394" font-size="30" font-family="Roboto,Arial,sans-serif" font-weight="300">%</text>
      <rect x="486" y="346" width="6" height="52" rx="3" fill="#3ddc5a"/>
      <g transform="translate(523 366)" fill="none" stroke="#f4f7f9" stroke-width="4" stroke-linecap="round"><path d="M-17 -6a24 24 0 0 1 34 0"/><path d="M-10 2a14 14 0 0 1 20 0"/><circle cx="0" cy="11" r="2.4" fill="#f4f7f9"/></g>
      <path d="M514 384h10v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="none" stroke="#f4f7f9" stroke-width="3"/>
      <g id="hmw">${[...Array(20)].map((_, k) => `<rect class="wbar e" x="${536 + k * 5.2}" y="385" width="3" height="14"/>`).join('')}</g>
      <text id="hmf" x="618" y="378" font-size="52" font-family="Roboto,Arial,sans-serif" font-weight="300" text-anchor="middle">A</text>
      <text id="hmm" x="690" y="372" font-size="24" font-family="Roboto,Arial,sans-serif" font-weight="600" text-anchor="middle" fill="#ffb74d"></text>
    </g>
    <!-- bouton Clean : tourne pendant le nettoyage -->
    <circle class="cring" cx="763" cy="372" r="34"/>
  </svg>`;

  const TILES = [['humidity', 'mdi:water-percent', 'show_humidity'], ['target', 'mdi:target', 'show_target'], ['temperature', 'mdi:thermometer', 'show_temperature'],
    ['tank', 'mdi:water', 'show_tank'], ['fan', 'mdi:fan', 'show_fan']];

  class ApplianceHumidifierCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^humidifier\./.test(i) && !/dehum|deshum/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { style: 'svg', water_low: 20, target_step: 5, show_controls: true, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
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
    _ok(s) { return !!s && !BAD_RE.test(String(s.state)) && !/^unavailable$/i.test(String(s.state)); }
    _dom(id) { return id ? String(id).split('.')[0] : ''; }
    _val(id, attr) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(attr ? s.attributes[attr] : s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _style() { return STYLES.includes(this._c.style) ? this._c.style : 'svg'; }
    _main() { return this._c.entity || this._c.switch || ''; }

    // options d'une entité de sélection (select, input_select, fan, humidifier) et option active
    _opts(id) {
      const s = this._st(id); if (!s) return [];
      const a = s.attributes || {}, d = this._dom(id);
      return (d === 'select' || d === 'input_select' ? a.options : d === 'fan' ? a.preset_modes : d === 'humidifier' ? a.available_modes : []) || [];
    }
    _cur(id) {
      const s = this._st(id); if (!this._ok(s)) return '';
      const a = s.attributes || {}, d = this._dom(id);
      return String(d === 'fan' ? a.preset_mode ?? '' : d === 'humidifier' ? a.mode ?? '' : s.state);
    }
    // entité des modes : option mode, sinon l'entité humidifier elle-même
    _modeId() { const c = this._c; return c.mode || (this._dom(c.entity) === 'humidifier' ? c.entity : ''); }
    _fanId() { return this._c.fan_speed || ''; }
    _pick(id, opt) {
      if (!this._hass || !id) return;
      const d = this._dom(id), svc = { select: ['select', 'select_option', { option: opt }], input_select: ['input_select', 'select_option', { option: opt }],
        fan: ['fan', 'set_preset_mode', { preset_mode: opt }], humidifier: ['humidifier', 'set_mode', { mode: opt }] }[d];
      if (svc) this._hass.callService(svc[0], svc[1], { entity_id: id, ...svc[2] });
    }
    _power() {
      const id = this._c.switch || this._c.entity; if (!this._hass || !id) return;
      this._hass.callService('homeassistant', 'toggle', { entity_id: id });
    }
    // humidité cible : number / input_number ; à défaut l'attribut humidity de l'entité humidifier
    _setTarget(v) {
      const c = this._c; if (!this._hass) return;
      const t = c.target_humidity, d = this._dom(t);
      const lo = this._lim('min'), hi = this._lim('max'); v = Math.max(lo, Math.min(hi, Math.round(v)));
      if (t && (d === 'number' || d === 'input_number')) this._hass.callService(d, 'set_value', { entity_id: t, value: v });
      else if (this._dom(c.entity) === 'humidifier') this._hass.callService('humidifier', 'set_humidity', { entity_id: c.entity, humidity: v });
    }
    _lim(k) {
      const t = this._st(this._c.target_humidity), e = this._st(this._c.entity), a = (t && t.attributes) || {}, b = (e && e.attributes) || {};
      const v = Number(a[k] ?? b[`${k}_humidity`] ?? NaN);
      return isFinite(v) ? v : k === 'min' ? 30 : 80;
    }
    _targetCtl() {
      const c = this._c;
      return !!(c.target_humidity && ['number', 'input_number'].includes(this._dom(c.target_humidity))) || this._dom(c.entity) === 'humidifier';
    }

    _compute() {
      const c = this._c, e = this._st(c.entity), sw = this._st(c.switch), a = (e && e.attributes) || {};
      const mainOk = this._ok(e) || this._ok(sw);
      const stateOf = (s) => (this._ok(s) ? String(s.state).toLowerCase() : '');
      const swS = stateOf(sw), eS = stateOf(e);
      const on = swS ? !OFF_RE.test(swS) : eS ? !OFF_RE.test(eS) : false;
      const hum = !isNaN(this._val(c.humidity)) ? this._val(c.humidity) : isFinite(Number(a.current_humidity)) ? Number(a.current_humidity) : NaN;
      const tgt = !isNaN(this._val(c.target_humidity)) ? this._val(c.target_humidity) : isFinite(Number(a.humidity)) ? Number(a.humidity) : NaN;
      const mode = this._cur(this._modeId()).toLowerCase(), action = String(a.action || '').toLowerCase();
      const fanTxt = this._cur(this._fanId());
      const water = this._val(c.water_level), lowS = this._st(c.low_water);
      const wl = Number(c.water_low) > 0 ? Number(c.water_low) : 20;
      const low = (this._ok(lowS) && /^(on|true|low|empty|vide|bas)$/i.test(String(lowS.state))) || (!isNaN(water) && water <= wl);
      let st = !mainOk ? 'unavailable' : !on ? 'off' : CLEAN_RE.test(mode) ? 'clean' : DRY_RE.test(mode) ? 'dry'
        : action === 'idle' || (!isNaN(hum) && !isNaN(tgt) && hum >= tgt) ? 'target' : 'humidifying';
      if (st === 'unavailable' || st === 'off') { /* pas d'alerte réservoir quand l'appareil est éteint */ }
      return { st, on, hum, tgt, mode, fanTxt, water, low: low && st !== 'off' && st !== 'unavailable', temp: this._val(c.temperature) };
    }

    // lettre de la vitesse affichée sur l'écran : A (auto), 1, 2, 3
    _fanLetter(t) {
      const s = String(t || '').toLowerCase().trim(); if (!s) return '';
      if (/auto/.test(s)) return 'A';
      const n = s.match(/\d+/); if (n) return n[0];
      return /low|bas|nuit|night|sleep|silent|min/.test(s) ? '1' : /med|moy|mid/.test(s) ? '2' : /high|haut|max|turbo/.test(s) ? '3' : s.charAt(0).toUpperCase();
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="hmtitle"></div><div class="badge" id="hmbadge"></div></div>
        <div class="alert-line"><ha-icon icon="mdi:water-alert-outline"></ha-icon><span id="hmalert"></span></div>
        <div class="body">${SVG(this._style(), this._c.name || this._t('name'))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div>
        <div class="ctl" id="hmmain"><button id="hmpw"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button id="hmdn" aria-label="-"><ha-icon icon="mdi:minus"></ha-icon></button><span class="tg" id="hmtg"></span><button id="hmup" aria-label="+"><ha-icon icon="mdi:plus"></ha-icon></button></div>
        <div class="ctl" id="hmmodes"></div><div class="ctl" id="hmfans"></div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.humidity || this._c.switch));
      root.getElementById('hmpw').addEventListener('click', () => this._power());
      root.getElementById('hmdn').addEventListener('click', () => { const v = this._compute().tgt; this._setTarget((isNaN(v) ? this._lim('min') + (this._lim('max') - this._lim('min')) / 2 : v) - (Number(this._c.target_step) || 5)); });
      root.getElementById('hmup').addEventListener('click', () => { const v = this._compute().tgt; this._setTarget((isNaN(v) ? this._lim('min') : v) + (Number(this._c.target_step) || 5)); });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ humidity: c.humidity || c.entity, target: c.target_humidity || c.entity, temperature: c.temperature, tank: c.water_level || c.low_water, fan: c.fan_speed }[el.dataset.k] || c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // une rangée de boutons (modes ou vitesses) : le bouton de l'option active est allumé
    _row(el, id, label, fmt) {
      const opts = this._opts(id), cur = this._cur(id);
      el.classList.toggle('hide', !opts.length || this._c.show_controls === false);
      el.replaceChildren();
      if (!opts.length) return;
      const lb = document.createElement('div'); lb.className = 'lbl'; lb.textContent = label; el.appendChild(lb);
      opts.forEach((o) => {
        const b = document.createElement('button'); b.textContent = fmt(o); b.className = String(o).toLowerCase() === cur.toLowerCase() ? 'on' : '';
        b.disabled = !this._ok(this._st(id)); b.addEventListener('click', () => this._pick(id, o)); el.appendChild(b);
      });
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, on, hum, tgt, mode, fanTxt, water, low, temp } = this._compute();
      card.className = `${st}${low ? ' lowwater' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--spd', String(st === 'humidifying' && !isNaN(hum) && !isNaN(tgt) ? Math.max(.7, Math.min(1.4, 1 + (hum - tgt) / 40)).toFixed(2) : 1));
      r.getElementById('hmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('hmbadge');
      badge.textContent = low && st !== 'off' && st !== 'unavailable' ? this._t('low_water') : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('hmalert').textContent = this._t('low_water_alert');

      // écran LCD
      const hv = r.getElementById('hmv'); hv.textContent = isNaN(hum) ? '--' : String(Math.round(hum));
      r.getElementById('hmf').textContent = this._fanLetter(fanTxt) || '';
      const mm = r.getElementById('hmm'); mm.textContent = st === 'clean' ? 'CLEAN' : st === 'dry' ? 'DRY' : ''; mm.setAttribute('fill', st === 'clean' ? '#7fe9ff' : '#ffb74d');
      const full = isNaN(water) ? (low ? 1 : 20) : Math.round(Math.max(0, Math.min(100, water)) / 5);
      r.querySelectorAll('#hmw .wbar').forEach((b, i) => b.classList.toggle('e', i >= full));

      // boutons
      const mainRow = r.getElementById('hmmain'), hasT = this._targetCtl();
      mainRow.classList.toggle('hide', c.show_controls === false || (!c.entity && !c.switch));
      const pw = r.getElementById('hmpw'); pw.classList.toggle('on', on); pw.querySelector('span').textContent = this._t(on ? 'turn_off' : 'turn_on'); pw.disabled = st === 'unavailable';
      ['hmdn', 'hmup', 'hmtg'].forEach((id) => { r.getElementById(id).style.display = hasT ? '' : 'none'; });
      r.getElementById('hmtg').textContent = isNaN(tgt) ? '-- %' : `${Math.round(tgt)} %`;
      r.getElementById('hmdn').disabled = r.getElementById('hmup').disabled = !on || st === 'unavailable';
      this._row(r.getElementById('hmmodes'), this._modeId(), this._l('mode'), (o) => String(o));
      this._row(r.getElementById('hmfans'), this._fanId(), this._l('fan'), (o) => String(o));

      const V = {
        humidity: [!isNaN(hum), this._fmt(hum, 0), '%'],
        target: [!isNaN(tgt), this._fmt(tgt, 0), '%'],
        temperature: [c.temperature, this._fmt(temp, 1), this._unit(c.temperature, '°C')],
        tank: [c.water_level || c.low_water, !isNaN(water) ? this._fmt(water, 0) : low ? this._t('low') : this._t('ok'), !isNaN(water) ? this._unit(c.water_level, '%') : ''],
        fan: [fanTxt, fanTxt, ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', k === 'tank' && low);
        el.querySelector('.lbl').textContent = this._l(k === 'target' ? 'target_tile' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceHumidifierCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHumidifierCardEditor extends HTMLElement {
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
      const tr = T[window.applianceLang(T, this._c, this._hass)] || T.en;
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'style', selector: { select: { mode: 'dropdown', options: STYLES.map((value) => ({ value, label: tr[`style_${value}`] || T.en[`style_${value}`] || value })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['humidifier', 'switch', 'fan', 'input_boolean']), ent('switch', ['switch', 'input_boolean', 'fan']),
        ent('humidity', 'sensor'), ent('target_humidity', ['number', 'input_number', 'sensor']), ent('temperature', 'sensor'),
        ent('fan_speed', ['select', 'input_select', 'fan']), ent('mode', ['select', 'input_select', 'fan', 'humidifier']),
        ent('water_level', 'sensor'), ent('low_water', ['binary_sensor', 'sensor', 'input_boolean']),
        { type: 'grid', name: '', schema: [
          { name: 'water_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
          { name: 'target_step', default: 5, selector: { number: { min: 1, max: 20, step: 1, mode: 'box', unit_of_measurement: '%' } } }] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_controls'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceHumidifierCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Humidificateur animé (Smartmi, Xiaomi…) : humidité actuelle et cible, vitesses, modes Dry / Clean, niveau d\'eau, brume ; dessin SVG ou photo.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/humidifier.md',
  });
})();
