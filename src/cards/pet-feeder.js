/* Carte « Distributeur de croquettes » — custom:appliance-pet-feeder-card
 * Distributeur connecté (Aqara Smart Pet Feeder C1 via Zigbee2MQTT, Petlibro, PETKIT…) : photo détourée de l'Aqara C1.
 * Entités (toutes facultatives) : distribution (select / button / switch), source de la dernière distribution, taille de la portion,
 * portions et poids du jour, erreur, indicateur LED, sécurité enfant, mode (manuel / programmé), portions réglées, poids d'une portion.
 * Animations : croquettes qui tombent de la trappe dans la gamelle pendant la distribution, tas de croquettes qui grossit avec les
 * portions du jour, écran qui s'allume, voyant rouge qui clignote en cas d'erreur, cadenas affiché quand la sécurité enfant est active.
 * Réserve de croquettes (facultatif) : `entity_level` (grammes restants ou %) + `hopper_capacity` → tuiles Réserve et
 * Autonomie (jours), alerte sous `food_low` %, bouton Remplir (remet `entity_level` à la capacité).
 * États : ready, feeding, error, unavailable.
 */
(() => {
  const TAG = 'appliance-pet-feeder-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n pet_feeder*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Repère du dessin = pixels de la photo (356 × 464). */
  const MODELS = {
    aqara_c1: {
      label: 'Aqara Smart Pet Feeder C1', pw: 356, ph: 464, box: [84, 8, 131, 171],
      img: 'data:image/webp;base64,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',
    },
  };
  const modelKey = () => 'aqara_c1';
  const BAD_RE = /^(on|error|fault|problem|true|1|jam|blocked|stuck|low_battery|food_low|empty)$/i;
  const ON_RE = /^(on|true|1|locked|lock|enabled|enable)$/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --pf-ok:var(--appliance-ok-color,#43a047);--pf-alert:var(--appliance-alert-color,#db4437);--kib:#b5682a;--glow:#4db2ff;--fill:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ready .badge{background:color-mix(in srgb,var(--pf-ok) 22%,transparent);color:var(--pf-ok)}
.feeding .badge{background:color-mix(in srgb,var(--kib) 28%,transparent);color:var(--kib)}
.error .badge{background:color-mix(in srgb,var(--pf-alert) 22%,transparent);color:var(--pf-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pf-alert);font-weight:500;text-align:center}
.error .alert,.lowfood .alert{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile .v small.pc{display:block;margin:0;line-height:12px}
.tile.hide{display:none}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{height:34px;min-width:34px;padding:0 10px;border-radius:17px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;color:var(--primary-text-color);font:600 12px var(--paper-font-body1_-_font-family,Roboto,sans-serif);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:18px}
.ctrls button:hover{transform:scale(1.05)}.ctrls button:active{transform:scale(.94)}
.ctrls button.main{background:var(--kib);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--kib) 55%,transparent)}
.ctrls button.on{background:var(--glow);color:#fff}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- distributeur ---- */
.photo{transition:filter .6s}
.unavailable .photo{filter:grayscale(.6) brightness(.8)}
.disp{fill:var(--glow);opacity:0;filter:blur(2.5px);transition:opacity .5s,fill .4s}
.ready .disp{opacity:.18}
.feeding .disp{opacity:.7;animation:pfdisp .8s ease-in-out infinite}
.error .disp{fill:#ff3b30;opacity:.8;animation:pfblink 1s steps(2) infinite}
@keyframes pfdisp{50%{opacity:.25}}
@keyframes pfblink{50%{opacity:.1}}
.btnglow{fill:var(--glow);opacity:0}
.feeding .btnglow{animation:pfdisp .8s ease-in-out infinite}
.lock{opacity:0;fill:none;stroke:#e8eaef;stroke-width:2.4;stroke-linecap:round}
.lock rect{fill:#e8eaef;stroke:none}
.locked .lock{opacity:.95}
.kib{fill:var(--kib);opacity:0;stroke:#7a3f12;stroke-width:.8}
.feeding .kib{animation:pffall 1.1s cubic-bezier(.4,0,.8,.6) infinite}
.kib:nth-child(2){animation-delay:.18s!important}.kib:nth-child(3){animation-delay:.36s!important}.kib:nth-child(4){animation-delay:.55s!important}.kib:nth-child(5){animation-delay:.74s!important}.kib:nth-child(6){animation-delay:.9s!important}
@keyframes pffall{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(var(--dx,24px),48px)}}
.kib:nth-child(2){--dx:30px}.kib:nth-child(3){--dx:20px}.kib:nth-child(4){--dx:36px}.kib:nth-child(5){--dx:26px}.kib:nth-child(6){--dx:32px}
.mound{fill:var(--kib);stroke:#7a3f12;stroke-width:1;transform-box:fill-box;transform-origin:50% 100%;transform:scale(calc(.25 + var(--fill) * .75));opacity:calc(var(--fill) * 1.4);transition:transform .8s,opacity .8s}
.mound.dots{fill:#8b4a17;stroke:none}
.feeding .mound{animation:pfbump .55s ease-in-out infinite}
@keyframes pfbump{50%{transform:scale(calc(.3 + var(--fill) * .75)) translateY(-1px)}}
.tile.bad .v{color:var(--pf-alert)}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .alert{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{height:22px;min-width:22px;padding:0 6px;font-size:10px;--mdc-icon-size:13px}
`;

  const SVG = (label, m) => {
    const [bx, by, bw, bh] = m.box, k = bw / m.pw;
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <g transform="translate(${bx} ${by}) scale(${k.toFixed(5)})">
  <image class="photo" href="${m.img}" x="0" y="0" width="${m.pw}" height="${m.ph}"/>
  <!-- tas de croquettes dans la gamelle -->
  <g class="mounds"><ellipse class="mound" cx="232" cy="378" rx="46" ry="17"/><g class="mound dots"><circle cx="212" cy="368" r="4"/><circle cx="226" cy="362" r="4"/><circle cx="242" cy="364" r="4"/><circle cx="256" cy="370" r="4"/><circle cx="234" cy="372" r="4"/></g></g>
  <!-- croquettes qui tombent de la trappe -->
  <g class="kibs"><circle class="kib" cx="172" cy="334" r="4.5"/><circle class="kib" cx="184" cy="332" r="4"/><circle class="kib" cx="178" cy="336" r="4.5"/><circle class="kib" cx="192" cy="334" r="4"/><circle class="kib" cx="168" cy="332" r="4"/><circle class="kib" cx="186" cy="336" r="4.5"/></g>
  <!-- écran, boutons, cadenas -->
  <rect class="disp" x="152" y="196" width="62" height="86" rx="28"/>
  <g class="btnglow"><circle cx="164" cy="285" r="7"/><circle cx="184" cy="285" r="7"/><circle cx="205" cy="285" r="7"/></g>
  <g class="lock" transform="translate(183 258)"><path d="M-5 -2 V-6 a5 5 0 0 1 10 0 V-2"/><rect x="-8" y="-2" width="16" height="12" rx="2.5"/></g>
 </g>
</svg>`;
  };

  class AppliancePetFeederCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || dom.includes(i.split('.')[0])) && re.test(i)) || '';
      const feed = f(/feed/i, ['select', 'button', 'switch']);
      const base = feed.replace(/^[a-z_]+\./, '').replace(/_feed(er)?$|^feed_?/i, '');
      const pick = (re, dom) => f(re, dom);
      return { model: 'aqara_c1', ...(feed ? { entity_feed: feed } : {}), ...(pick(/portions_per_day/i, ['sensor']) ? { entity_portions: pick(/portions_per_day/i, ['sensor']) } : {}), ...(pick(/weight_per_day/i, ['sensor']) ? { entity_weight: pick(/weight_per_day/i, ['sensor']) } : {}), ...(base && pick(new RegExp(base + '.*error', 'i'), ['binary_sensor', 'sensor']) ? { entity_error: pick(new RegExp(base + '.*error', 'i'), ['binary_sensor', 'sensor']) } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_portions: true, show_weight: true, show_source: true, show_serving: true, show_mode: true, show_level: true, show_autonomy: true, food_low: 25, daily_goal: 6, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    disconnectedCallback() { clearTimeout(this._feedT); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _unit(id, d = '') { return (this._st(id)?.attributes || {}).unit_of_measurement || d; }
    _isOn(id) { const s = this._st(id); return !!s && ON_RE.test(String(s.state)); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      this._model = m;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="pftitle"></div><div class="badge" id="pfbadge"></div></div>
        <div class="alert" id="pfalert"></div>
        ${SVG(this._c.name || m.label, m)}
        <div class="ctrls" id="pfctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="portions"><div class="l"><ha-icon icon="mdi:food-drumstick"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="weight"><div class="l"><ha-icon icon="mdi:scale"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="serving"><div class="l"><ha-icon icon="mdi:bowl-mix"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="source"><div class="l"><ha-icon icon="mdi:history"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="mode"><div class="l"><ha-icon icon="mdi:calendar-clock"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="level"><div class="l"><ha-icon icon="mdi:storage-tank-outline"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="autonomy"><div class="l"><ha-icon icon="mdi:calendar-end"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_feed || this._c.entity_portions));
      const tgt = { portions: 'entity_portions', weight: 'entity_weight', serving: 'entity_serving', source: 'entity_source', mode: 'entity_mode', level: 'entity_level', autonomy: 'entity_level' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]])));
      root.getElementById('pfctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true; this._lastPortions = undefined;
    }

    _feedAnim(sec = 7) { this._feeding = true; clearTimeout(this._feedT); this._feedT = setTimeout(() => { this._feeding = false; if (this._built) this._render(); }, sec * 1000); }

    _cmd(k) {
      const c = this._c, h = this._hass; if (!h) return;
      if (k === 'feed' && c.entity_feed) {
        const d = c.entity_feed.split('.')[0];
        if (d === 'select') h.callService('select', 'select_option', { entity_id: c.entity_feed, option: c.feed_option || 'start' });
        else if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: c.entity_feed });
        else h.callService(d === 'script' ? 'script' : 'homeassistant', 'turn_on', { entity_id: c.entity_feed });
        this._feedAnim(); this._render();
      } else if (k === 'led' && c.entity_led) h.callService('homeassistant', 'toggle', { entity_id: c.entity_led });
      else if (k === 'lock' && c.entity_child_lock) h.callService('homeassistant', 'toggle', { entity_id: c.entity_child_lock });
      else if (k === 'refill' && c.entity_level) {
        // trémie remplie : remet le niveau à la capacité (grammes, ou 100 si l'entité est en %)
        const d = c.entity_level.split('.')[0], pct = /%/.test(this._unit(c.entity_level));
        h.callService(d, 'set_value', { entity_id: c.entity_level, value: pct ? 100 : this._cap() });
      } else if (k === 'mode' && c.entity_mode) {
        const s = this._st(c.entity_mode), opts = (s && s.attributes && s.attributes.options) || [];
        if (opts.length) h.callService('select', 'select_option', { entity_id: c.entity_mode, option: opts[(opts.indexOf(s.state) + 1) % opts.length] });
      }
    }

    _cap() { return Number(this._c.hopper_capacity) > 0 ? Number(this._c.hopper_capacity) : 1500; }
    // niveau de la trémie : { frac (0-1), grams, days } ; NaN si `entity_level` absente ou indisponible
    _level() {
      const c = this._c, v = this._num(c.entity_level), cap = this._cap();
      if (isNaN(v)) return { frac: NaN, grams: NaN, days: NaN };
      const frac = Math.max(0, Math.min(1, /%/.test(this._unit(c.entity_level)) ? v / 100 : v / cap)), grams = frac * cap;
      // consommation par jour : option daily_consumption (g), sinon poids du jour, sinon portions du jour × poids d'une portion
      const w = this._num(c.entity_weight), pp = this._num(c.entity_portions), pw = this._num(c.entity_portion_weight);
      const daily = Number(c.daily_consumption) > 0 ? Number(c.daily_consumption) : w > 0 ? w : pp > 0 && pw > 0 ? pp * pw : NaN;
      return { frac, grams, days: isNaN(daily) ? NaN : grams / daily };
    }

    _state() {
      const c = this._c;
      const main = this._st(c.entity_feed) || this._st(c.entity_portions) || this._st(c.entity_weight);
      if (!main || /^(unavailable)$/i.test(String(main.state))) return 'unavailable';
      const e = this._st(c.entity_error);
      if (e && String(e.state) && !/^(off|false|0|none|ok|no_error|unknown|unavailable|)$/i.test(String(e.state)) && BAD_RE.test(String(e.state).replace(/\s+/g, '_'))) return 'error';
      if (e && !/^(off|false|0|none|ok|no_error|unknown|unavailable|)$/i.test(String(e.state)) && e.entity_id.startsWith('sensor.')) return 'error';
      if (this._feeding) return 'feeding';
      return 'ready';
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, m = this._model;
      // une portion de plus aujourd'hui = une distribution vient d'avoir lieu
      const pp = this._num(c.entity_portions);
      if (this._lastPortions !== undefined && !isNaN(pp) && pp > this._lastPortions) this._feedAnim();
      if (!isNaN(pp)) this._lastPortions = pp;
      const st = this._state(), lv = this._level();
      const low = !isNaN(lv.frac) && lv.frac * 100 <= (Number(c.food_low) >= 0 ? Number(c.food_low) : 25);
      card.className = `${st}${low ? ' lowfood' : ''}${this._isOn(c.entity_child_lock) ? ' locked' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const goal = Number(c.daily_goal) > 0 ? Number(c.daily_goal) : 6;
      card.style.setProperty('--fill', (isNaN(pp) ? 0 : Math.max(0, Math.min(1, pp / goal))).toFixed(3));

      r.getElementById('pftitle').textContent = c.name || m.label;
      const badge = r.getElementById('pfbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const es = this._st(c.entity_error);
      r.getElementById('pfalert').textContent = st === 'error' ? `${this._t('error')}${es && !/^(on|true)$/i.test(es.state) ? ` : ${es.state}` : ''}` : low && st !== 'unavailable' ? this._t('low_food') : '';

      const modeS = this._st(c.entity_mode), ledOn = this._isOn(c.entity_led), lockOn = this._isOn(c.entity_child_lock);
      const btns = [
        ['feed', 'mdi:food-drumstick', this._t('feed'), 'main', !!c.entity_feed && !!this._st(c.entity_feed)],
        ['led', 'mdi:led-on', this._t('led'), ledOn ? 'on' : '', !!this._st(c.entity_led)],
        ['lock', lockOn ? 'mdi:lock' : 'mdi:lock-open-variant', this._t('child_lock'), lockOn ? 'on' : '', !!this._st(c.entity_child_lock)],
        // Remplir : seulement si le niveau est un input_number / number (modifiable)
        ['refill', 'mdi:bucket-outline', this._t('refill'), '', !!this._st(c.entity_level) && /^(input_number|number)\./.test(c.entity_level)],
      ].filter((b) => b[4] && c.show_controls !== false);
      const ctr = r.getElementById('pfctrls');
      ctr.classList.toggle('hide', !btns.length);
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, cls]) => `<button class="${cls}" data-k="${k}" title="${esc(lbl)}" aria-label="${esc(lbl)}"${st === 'unavailable' || (k === 'feed' && (st === 'feeding' || this._isOn(c.entity_child_lock))) ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon>${k === 'feed' ? `<span>${esc(lbl)}</span>` : ''}</button>`).join('');
      }

      const w = this._num(c.entity_weight), sv = this._num(c.entity_serving), pw = this._num(c.entity_portion_weight);
      const src = this._st(c.entity_source), val = (s) => (s ? String(s.state) : '');
      const V = {
        portions: [!!this._st(c.entity_portions) && c.show_portions !== false, this._fmt(pp, 0), ''],
        weight: [!!this._st(c.entity_weight) && c.show_weight !== false, this._fmt(w, 0), this._unit(c.entity_weight, 'g')],
        serving: [!!this._st(c.entity_serving) && c.show_serving !== false, this._fmt(sv, 0), isNaN(pw) ? this._t('portions_unit') : `× ${this._fmt(pw, 0)} g`],
        source: [!!src && c.show_source !== false, this._tr(val(src)), ''],
        mode: [!!modeS && c.show_mode !== false, this._tr(val(modeS)), ''],
        level: [!isNaN(lv.frac) && c.show_level !== false, this._fmt(lv.grams, 0), 'g', `${this._fmt(lv.frac * 100, 0)} %`],
        autonomy: [!isNaN(lv.days) && c.show_autonomy !== false, this._fmt(lv.days, lv.days < 10 ? 1 : 0), this._t('days_short')],
      };
      Object.entries(V).forEach(([k, [show, v, unit, sub]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit;
        const parts = [String(v), small];
        if (sub) { const pc = document.createElement('small'); pc.className = 'pc'; pc.textContent = sub; parts.push(pc); }
        el.querySelector('.v').replaceChildren(...parts);
        el.classList.toggle('bad', low && (k === 'level' || k === 'autonomy'));
        if (k === 'mode') el.onclick = () => this._cmd('mode');
      });
    }
    // valeurs Zigbee2MQTT (schedule, manual, remote, mode…) → texte traduit quand il existe
    _tr(v) { const k = `v_${String(v).toLowerCase().replace(/[^a-z0-9]+/g, '_')}`; return T[this._lang()][k] ?? T.en[k] ?? v; }
  }
  customElements.define(TAG, AppliancePetFeederCard);

  /* ---- éditeur visuel ---- */
  class AppliancePetFeederCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: m.label })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_feed'), { name: 'feed_option', selector: { text: {} } }, ent('entity_source'), ent('entity_serving', 'number'), ent('entity_portion_weight', 'number'),
        ent('entity_portions', 'sensor'), ent('entity_weight', 'sensor'), ent('entity_error'), ent('entity_led', 'switch'), ent('entity_child_lock', 'switch'), ent('entity_mode', 'select'),
        ent('entity_level', ['input_number', 'number', 'sensor']),
        { name: 'hopper_capacity', default: 1500, selector: { number: { min: 50, max: 20000, step: 50, mode: 'box', unit_of_measurement: 'g' } } },
        { name: 'daily_consumption', selector: { number: { min: 0, max: 2000, step: 5, mode: 'box', unit_of_measurement: 'g' } } },
        { name: 'food_low', default: 25, selector: { number: { min: 0, max: 100, step: 5, mode: 'box', unit_of_measurement: '%' } } },
        { name: 'daily_goal', default: 6, selector: { number: { min: 1, max: 20, step: 1, mode: 'box' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_portions'), bool('show_weight'), bool('show_serving'), bool('show_source'), bool('show_mode'), bool('show_level'), bool('show_autonomy'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'pet_feeder_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', AppliancePetFeederCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Distributeur de croquettes en photo (Aqara Smart Pet Feeder C1) : croquettes qui tombent dans la gamelle, portions du jour, erreur, sécurité enfant, mode.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
