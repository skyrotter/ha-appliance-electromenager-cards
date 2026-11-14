/* Carte « Filtre à eau sous évier » — custom:appliance-water-filter-card
 * Filtre à eau potable à 1, 2 ou 3 cartouches (option stages) avec son robinet : cartouches blanches sous un support à fenêtres témoins
 * (verte / orange / rouge selon l'usure), étiquettes bleues avec la durée de vie restante, robinet chromé. Quand l'eau coule
 * (débit > 0), des gouttes tombent du robinet et un reflet balaie les cartouches ; sans débit, plus aucune animation.
 * Entités : compteur du filtre (litres déjà filtrés ou restants, filter_mode), capacité de la cartouche (filter_capacity),
 * date de remplacement, débit, consommation (jour, mois, année, total), script / bouton de remise à zéro (confirmation).
 */
(() => {
  const TAG = 'appliance-water-filter-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n water_filter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--wf-ok:var(--appliance-ok-color,#43a047);--wf-warn:var(--appliance-warn-color,#ffa000);--wf-alert:var(--appliance-alert-color,#db4437);--wf-cold:var(--appliance-cold-color,#2b9af9);--wf-c:var(--wf-ok);transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ok{--wf-c:var(--wf-ok)}.soon{--wf-c:var(--wf-warn)}.replace{--wf-c:var(--wf-alert)}
.ok .badge,.soon .badge,.replace .badge{background:color-mix(in srgb,var(--wf-c) 22%,transparent);color:var(--wf-c)}
ha-card.replace{box-shadow:0 0 0 1px color-mix(in srgb,var(--wf-alert) 60%,transparent),0 0 20px color-mix(in srgb,var(--wf-alert) 28%,transparent)}
svg{display:block;width:100%;max-width:calc(290px * var(--illus-scale,1));height:auto;margin:6px auto 0;cursor:pointer;overflow:visible}
.cart{fill:url(#wfc);stroke:#cfd6dd;stroke-width:1}
.lab{fill:#2f55c4}.lt{fill:#fff;opacity:.85}
.bar{fill:rgba(255,255,255,.28)}.fill{fill:var(--sc,#43a047);transition:width .8s}
.win{fill:#c7ccd2;stroke:#9aa1a8;stroke-width:.8}.wl{fill:var(--sc,#43a047);filter:drop-shadow(0 0 2px var(--sc,#43a047))}
.stg0{--sc:var(--wf-ok)}.stg1{--sc:var(--wf-warn)}.stg2{--sc:var(--wf-alert)}
.wl.stg2{animation:wfblink 1s steps(2) infinite}
.shine{fill:url(#wfs);opacity:0}
.flow .shine{animation:wfsweep 2.4s ease-in-out infinite}.flow .shine.s2{animation-delay:.5s}.flow .shine.s3{animation-delay:1s}
.drop{fill:#6bb8ff;opacity:0}
.flow .drop{animation:wfdrop 1s ease-in infinite}.flow .drop.d2{animation-delay:.5s}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
@keyframes wfblink{50%{opacity:.25}}
@keyframes wfsweep{0%{opacity:0;transform:translateX(0)}30%{opacity:.7}100%{opacity:0;transform:translateX(36px)}}
@keyframes wfdrop{0%{opacity:0;transform:translateY(0)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translateY(112px)}}
.noanim *{animation:none!important}
.alert{display:none;margin-top:4px;font-size:11px;font-weight:500;text-align:center;color:var(--wf-c)}.alert.on{display:block}
.ctl{display:flex;justify-content:center;margin-top:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:5px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.arm{background:color-mix(in srgb,var(--wf-alert) 30%,var(--secondary-background-color))}.ctl button ha-icon{--mdc-icon-size:16px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--wf-warn)}.tile.bad .v{color:var(--wf-alert)}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{margin-top:3px}.compact .tiles{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  const TILES = [['flow', 'mdi:water-pump', 'show_flow'], ['left', 'mdi:filter-variant', 'show_left'], ['date', 'mdi:calendar-clock', 'show_date'], ['today', 'mdi:calendar-today', 'show_today'],
    ['month', 'mdi:calendar-month', 'show_month'], ['year', 'mdi:calendar', 'show_year'], ['total', 'mdi:sigma', 'show_total']];
  // statut d'usure : 0 ok, 1 bientôt à remplacer, 2 à remplacer
  const lvl = (pct, soon, repl) => (isNaN(pct) ? 0 : pct <= repl ? 2 : pct <= soon ? 1 : 0);

  class ApplianceWaterFilterCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_filter: ids.find((i) => /^sensor\./.test(i) && /(filter|filtre)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { stages: 3, filter_mode: 'used', date_mode: 'last', soon_pct: 25, replace_pct: 5, warn_days: 30, show_status: true, show_flow: true, show_left: true, show_date: true, show_today: true, show_month: true, show_year: true, show_total: true, show_buttons: true, ...c };
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
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { window.applianceMore(this, id); }

    // centres des cartouches selon le nombre d'étages
    _centers() { return { 1: [172], 2: [134, 210], 3: [96, 172, 248] }[Math.max(1, Math.min(3, Math.round(Number(this._c.stages) || 3)))]; }

    _svg() {
      const cs = this._centers(), x0 = cs[0] - 40, x1 = cs[cs.length - 1] + 40;
      const cart = (cx, i) => `<g>
        <rect class="cart" x="${cx - 30}" y="46" width="60" height="184" rx="15"/><rect x="${cx - 24}" y="60" width="6" height="160" rx="3" fill="#fff" opacity=".7"/>
        <rect class="lab" x="${cx - 24}" y="108" width="48" height="84" rx="2"/>
        <rect class="lt" x="${cx - 18}" y="114" width="36" height="4" rx="1"/><rect class="lt" x="${cx - 18}" y="122" width="26" height="2.4" rx="1" opacity=".6"/><rect class="lt" x="${cx - 18}" y="128" width="30" height="2.4" rx="1" opacity=".6"/>
        <text x="${cx}" y="158" text-anchor="middle" font-family="sans-serif" font-size="17" font-weight="700" fill="#fff">${i + 1}</text>
        <rect class="bar" x="${cx - 18}" y="172" width="36" height="7" rx="3.5"/><rect class="fill" id="wff${i}" x="${cx - 18}" y="172" width="36" height="7" rx="3.5"/>
        <rect class="shine s${i + 1}" x="${cx - 26}" y="52" width="14" height="172" rx="7"/>
        <rect class="win" x="${cx - 13}" y="22" width="26" height="15" rx="3"/><rect class="wl" id="wfw${i}" x="${cx - 9}" y="25.5" width="18" height="8" rx="2"/></g>`;
      return `<svg viewBox="0 0 290 250" role="img" aria-label="${esc(this._c.name || this._t('name'))}"><defs>
        <linearGradient id="wfc" x1="0" x2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".3" stop-color="#ffffff"/><stop offset="1" stop-color="#d4dbe2"/></linearGradient>
        <linearGradient id="wfb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe5ea"/></linearGradient>
        <linearGradient id="wfs" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#bfe4ff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="wfm" x1="0" x2="1"><stop offset="0" stop-color="#7d868f"/><stop offset=".45" stop-color="#f3f5f7"/><stop offset="1" stop-color="#7d868f"/></linearGradient></defs>
        <ellipse cx="150" cy="240" rx="136" ry="6" fill="#000" opacity=".18"/>
        <rect x="${x0}" y="12" width="${x1 - x0}" height="44" rx="14" fill="url(#wfb)" stroke="#cfd6dd"/>
        ${cs.map(cart).join('')}
        <!-- robinet chromé : socle, col en arc, bec et manette -->
        <path d="M22 232 V118 Q22 88 40 88 Q56 88 57 106" fill="none" stroke="url(#wfm)" stroke-width="7" stroke-linecap="round"/>
        <path d="M57 106 V113" stroke="#aeb6bd" stroke-width="6" stroke-linecap="round"/>
        <rect x="8" y="226" width="28" height="9" rx="4" fill="url(#wfm)"/><path d="M22 214 L8 208" stroke="url(#wfm)" stroke-width="6" stroke-linecap="round"/><circle cx="6" cy="207" r="5" fill="#cfd5da"/>
        <circle class="drop" cx="57" cy="119" r="2.6"/><circle class="drop d2" cx="57" cy="119" r="2.6"/>
      </svg>`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="wftitle"></div><div class="badge" id="wfbadge"></div></div>
        ${this._svg()}
        <div class="alert" id="wfalert"></div>
        <div class="ctl" id="wfctl"><button id="wfreset"><ha-icon icon="mdi:filter-check"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_filter));
      const btn = root.getElementById('wfreset');
      // remise à zéro : 2e clic de confirmation (le bouton se « arme » 4 s)
      btn.addEventListener('click', () => {
        const id = this._c.entity_reset, h = this._hass; if (!id || !h) return;
        if (!btn.classList.contains('arm')) {
          btn.classList.add('arm'); btn.querySelector('span').textContent = this._t('confirm');
          clearTimeout(this._armT); this._armT = setTimeout(() => { btn.classList.remove('arm'); btn.querySelector('span').textContent = this._l('replaced'); }, 4000);
          return;
        }
        clearTimeout(this._armT); btn.classList.remove('arm'); btn.querySelector('span').textContent = this._l('replaced');
        const d = id.split('.')[0];
        if (d === 'script') h.callService('script', 'turn_on', { entity_id: id });
        else if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
        else h.callService('homeassistant', 'turn_on', { entity_id: id });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow, left: c.entity_filter, date: c.entity_date, today: c.entity_today, month: c.entity_month, year: c.entity_year, total: c.entity_total }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // part de vie restante (%) d'un compteur : litres filtrés ou restants selon filter_mode, avec la capacité ; sinon valeur en %
    _pct(id, cap) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      if (this._unit(id, '') === '%') return this._c.filter_mode === 'used' ? 100 - v : v;
      if (!(cap > 0)) return NaN;
      return Math.max(0, Math.min(100, (this._c.filter_mode === 'used' ? cap - v : v) / cap * 100));
    }
    // date : jours restants avant la date de remplacement (date_mode « next »), ou, en mode « last » (date du dernier remplacement),
    // jours restants = replace_after_days - jours écoulés (NaN sans replace_after_days) ; elapsed = jours depuis le dernier remplacement
    _date(id) {
      const s = this._st(id), c = this._c, none = { days: NaN, elapsed: NaN };
      if (!this._ok(s)) return none;
      const t = Date.parse(s.state); if (!t) return none;
      if (c.date_mode === 'next') return { days: Math.ceil((t - Date.now()) / 86400000), elapsed: NaN };
      const elapsed = Math.max(0, Math.floor((Date.now() - t) / 86400000)), after = Number(c.replace_after_days);
      return { days: after > 0 ? after - elapsed : NaN, elapsed };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const cap = Number(c.filter_capacity);
      const ids = [c.entity_filter, c.entity_filter_2, c.entity_filter_3];
      const pcts = this._centers().map((_, i) => this._pct(ids[i] || c.entity_filter, i === 0 ? cap : Number(c[`filter_capacity_${i + 1}`]) || cap));
      const dt = this._date(c.entity_date), days = dt.days, flow = this._num(c.entity_flow);
      const known = [c.entity_filter, c.entity_flow, c.entity_date, c.entity_today, c.entity_total].some((i) => i && this._ok(this._st(i)));
      let level = Math.max(0, ...pcts.map((p) => lvl(p, Number(c.soon_pct), Number(c.replace_pct))));
      if (!isNaN(days)) level = Math.max(level, days < 0 ? 2 : days <= Number(c.warn_days) ? 1 : 0);
      const flowing = !isNaN(flow) && flow > 0.05;
      card.className = `${known ? ['ok', 'soon', 'replace'][level] : 'unavailable'}${flowing ? ' flow' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      r.getElementById('wftitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('wfbadge'); badge.textContent = known ? this._t(['ok', 'soon', 'replace'][level]) : this._t('unavailable'); badge.style.display = c.show_status === false ? 'none' : '';
      this._centers().forEach((cx, i) => {
        const p = pcts[i], l = lvl(p, Number(c.soon_pct), Number(c.replace_pct)), f = r.getElementById(`wff${i}`), w = r.getElementById(`wfw${i}`);
        f.setAttribute('width', (36 * (isNaN(p) ? 1 : p / 100)).toFixed(1));
        for (const e of [f, w]) { e.classList.remove('stg0', 'stg1', 'stg2'); e.classList.add(`stg${isNaN(p) ? level : l}`); }
      });
      const al = r.getElementById('wfalert');
      al.classList.toggle('on', level > 0);
      al.textContent = level === 2 ? this._t('alert_replace') : level === 1 ? this._t('alert_soon') : '';
      const ctl = r.getElementById('wfctl'); ctl.classList.toggle('hide', !c.entity_reset || c.show_buttons === false);
      const btn = r.getElementById('wfreset'); if (!btn.classList.contains('arm')) btn.querySelector('span').textContent = this._l('replaced');
      const left = pcts.filter((p) => !isNaN(p)).sort((a, b) => a - b)[0], lu = this._unit(c.entity_filter, 'L');
      const V = {
        flow: [c.entity_flow, this._fmt(flow, 1), this._unit(c.entity_flow, 'L/min'), flowing ? '' : '', 'show_flow'],
        left: [c.entity_filter, !isNaN(left) ? this._fmt(left, 0) : this._fmt(this._num(c.entity_filter), 0), !isNaN(left) ? '%' : lu, level === 2 ? 'bad' : level === 1 ? 'warn' : '', 'show_left'],
        date: [c.entity_date, !isNaN(days) ? (days < 0 ? this._t('overdue') : `${this._fmt(days)} ${this._t('d')}`) : !isNaN(dt.elapsed) ? `${this._fmt(dt.elapsed)} ${this._t('d')}` : (this._st(c.entity_date) ? String(this._st(c.entity_date).state) : '--'), '', !isNaN(days) && days < 0 ? 'bad' : !isNaN(days) && days <= Number(c.warn_days) ? 'warn' : '', 'show_date'],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 1), this._unit(c.entity_today, 'L'), '', 'show_today'],
        month: [c.entity_month, this._fmt(this._num(c.entity_month), 0), this._unit(c.entity_month, 'L'), '', 'show_month'],
        year: [c.entity_year, this._fmt(this._num(c.entity_year), 0), this._unit(c.entity_year, 'L'), '', 'show_year'],
        total: [c.entity_total, this._fmt(this._num(c.entity_total), 0), this._unit(c.entity_total, 'L'), '', 'show_total'],
      };
      r.querySelectorAll('.tile').forEach((el) => {
        const k = el.dataset.k, [id, val, unit, cls, opt] = V[k];
        el.className = `tile${!id || c[opt] === false ? ' hide' : ''}${cls ? ' ' + cls : ''}`;
        el.querySelector('.lbl').textContent = k === 'date' && c.date_mode !== 'next' && isNaN(days) ? this._l('date_last') : this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceWaterFilterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWaterFilterCardEditor extends HTMLElement {
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
      const num = (name, def, min, max, unit) => ({ name, default: def, selector: { number: { min, max, step: 1, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        { name: 'stages', default: 3, selector: { number: { min: 1, max: 3, step: 1, mode: 'slider' } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_filter', 'sensor'), ent('entity_filter_2', 'sensor'), ent('entity_filter_3', 'sensor'),
        { name: 'filter_mode', default: 'used', selector: { select: { mode: 'dropdown', options: [{ value: 'used', label: this._lbl('filter_mode_used') }, { value: 'remaining', label: this._lbl('filter_mode_remaining') }] } } },
        num('filter_capacity', undefined, 0, 100000, 'L'), num('filter_capacity_2', undefined, 0, 100000, 'L'), num('filter_capacity_3', undefined, 0, 100000, 'L'),
        ent('entity_date', ['sensor', 'input_datetime']),
        { name: 'date_mode', default: 'last', selector: { select: { mode: 'dropdown', options: [{ value: 'last', label: this._lbl('date_mode_last') }, { value: 'next', label: this._lbl('date_mode_next') }] } } }, num('replace_after_days', undefined, 0, 3650, 'd'),
        ent('entity_reset', ['script', 'button', 'input_button', 'switch', 'input_boolean']),
        ent('entity_flow', 'sensor'), ent('entity_today', 'sensor'), ent('entity_month', 'sensor'), ent('entity_year', 'sensor'), ent('entity_total', 'sensor'),
        num('soon_pct', 25, 0, 100, '%'), num('replace_pct', 5, 0, 100, '%'), num('warn_days', 30, 0, 365, 'd'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_buttons'), bool('animations'), ...TILES.map(([, , o]) => bool(o))] },
      ];
      this._form.computeLabel = (s) => this._lbl(`f_${s.name}`, s.name);
    }
    _lbl(k, name) { const l = window.applianceLang(T, this._c, this._hass); return T[l][k] ?? T.en[k] ?? (name ? window.applianceEditorLabel(name, this._hass) : k); }
  }
  customElements.define(TAG + '-editor', ApplianceWaterFilterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Filtre à eau sous évier (1 à 3 cartouches) : usure du filtre, date de remplacement, débit et consommation, remise à zéro avec confirmation.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/water-filter.md',
  });
})();
