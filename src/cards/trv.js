/* Carte « Tête thermostatique » — custom:appliance-trv-card (issue #208)
 * Tête thermostatique de radiateur à eau (photo détourée d'une Tado X) : l'écran est redessiné en direct
 * (consigne en grand, température mesurée, ondes de chauffe animées, OFF, fenêtre ouverte), halo orange
 * qui respire en chauffe, flocons bleus quand la fenêtre est ouverte.
 * entity : l'entité climate de la tête (Zigbee2MQTT, ZHA, Tado, Netatmo…) — température, consigne, hvac_action.
 * Options : consigne réglable − / + (envoyée 0,8 s après le dernier clic), boutons de mode (show_hvac_modes),
 * capteur de fenêtre (entity_window, sinon l'attribut window_open de la tête), batterie (entity_battery, sinon
 * l'attribut battery), ouverture de vanne en % (entity_valve_position, sinon pi_heating_demand / valve_position).
 */
(() => {
  const TAG = 'appliance-trv-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n trv*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const HVAC_ICON = { off: 'mdi:power', heat: 'mdi:fire', cool: 'mdi:snowflake', heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:thermostat-auto', dry: 'mdi:water-percent', fan_only: 'mdi:fan' };
  const HVAC_ORDER = ['off', 'fan_only', 'dry', 'cool', 'heat', 'heat_cool', 'auto'];
  const IMG = 'data:image/webp;base64,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';

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--tv-heat:var(--appliance-heat-color,#ff8a00);--tv-cold:var(--appliance-cold-color,#2b9af9);
  --tv-alert:var(--appliance-alert-color,#db4437);--tv-ok:var(--appliance-ok-color,#43a047)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--tv-heat) 22%,transparent);color:var(--tv-heat)}
.idle .badge{background:color-mix(in srgb,var(--tv-ok) 20%,transparent);color:var(--tv-ok)}
.window .badge{background:color-mix(in srgb,var(--tv-cold) 22%,transparent);color:var(--tv-cold)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--tv-cold);font-weight:500;text-align:center}.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:4px auto 0;cursor:pointer;overflow:visible}
/* consigne − / + */
.set{display:flex;align-items:center;gap:6px;margin-top:6px;padding:4px 6px 4px 10px;border-radius:12px;background:rgba(127,127,127,.09);font-size:12px;color:var(--secondary-text-color)}
.set .sl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.set button{width:28px;height:28px;flex:none;border-radius:50%;border:none;background:rgba(127,127,127,.18);color:var(--primary-text-color);cursor:pointer;font:600 17px/1 system-ui,sans-serif;display:grid;place-items:center;padding:0}
.set button:disabled{opacity:.35;cursor:default}
.set b{min-width:52px;text-align:center;color:var(--primary-text-color);font-size:14px;white-space:nowrap}.set b.pending{color:var(--tv-heat)}
/* boutons de mode */
.modes{display:flex;gap:4px;margin-top:6px;padding:4px;border-radius:12px;background:rgba(127,127,127,.09)}
.modes[hidden]{display:none}
.modes button{flex:1;min-width:0;height:34px;border:none;border-radius:9px;background:transparent;color:var(--secondary-text-color);cursor:pointer;display:grid;place-items:center;padding:0}
.modes button ha-icon{--mdc-icon-size:18px}
.modes button.on{background:rgba(127,127,127,.28);color:var(--primary-text-color)}
.modes button.on[data-m="heat"]{background:color-mix(in srgb,var(--tv-heat) 22%,transparent);color:var(--tv-heat)}
.modes button:disabled{opacity:.35;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--tv-alert)}.tile.cold .v{color:var(--tv-cold)}
/* ---- illustration (coordonnées de la photo détourée, 357 × 274 ; écran : centre 176,159, rayon 100) ---- */
.tv-glow{opacity:0;transition:opacity .5s}
.heating .tv-glow{opacity:.8;animation:tvbreathe 2.4s ease-in-out infinite}
.tv-waves{opacity:0}
.heating .tv-waves{opacity:1}
.heating .tv-w{animation:tvwave 1.6s ease-in-out infinite}.heating .tv-w2{animation-delay:.2s}.heating .tv-w3{animation-delay:.4s}
.tv-txt{fill:#fff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.off .tv-big{fill:#9aa0a6}
.tv-snow{opacity:0}
.window .tv-snow{opacity:1;animation:tvblink 1.4s ease-in-out infinite}
.unavailable svg{filter:grayscale(.8) opacity(.7)}
.noanim .tv-glow,.noanim .tv-w,.noanim .tv-snow{animation:none}
@keyframes tvbreathe{50%{opacity:.35}}
@keyframes tvwave{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(-3px);opacity:1}}
@keyframes tvblink{50%{opacity:.35}}
`;

  const SVG = (label) => `<svg viewBox="-10 -10 377 294" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="tvglowg" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#ff8a00" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient>
    <radialGradient id="tvscr" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3a3d42"/><stop offset="1" stop-color="#1c1e21"/></radialGradient></defs>
    <!-- halo de chauffe autour de la couronne -->
    <ellipse class="tv-glow" cx="188" cy="155" rx="150" ry="156" fill="url(#tvglowg)"/>
    <image href="${IMG}" x="0" y="0" width="357" height="274"/>
    <!-- écran redessiné : masque l'écran de la photo -->
    <circle cx="176" cy="159" r="99" fill="url(#tvscr)"/>
    <g class="tv-waves" fill="none" stroke="#f5a623" stroke-width="3.2" stroke-linecap="round">
      ${[0, 1, 2].map((i) => `<path class="tv-w tv-w${i + 1}" d="M${164 + i * 12} 112 q-5 -6 0 -12 q5 -6 0 -12"/>`).join('')}
    </g>
    <text class="tv-txt tv-big" id="tvset" x="176" y="182" text-anchor="middle" font-size="62" font-weight="300" letter-spacing="-1">--</text>
    <g class="tv-txt" id="tvcur" opacity=".9"><path d="M146 207 v14 a5 5 0 1 0 6 0 v-14 a3 3 0 0 0 -6 0z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="149" cy="225" r="2.6" fill="#fff"/>
      <text id="tvcurt" x="160" y="226" font-size="19" font-weight="400">--</text></g>
    <!-- fenêtre ouverte : flocon sur l'écran -->
    <g class="tv-snow" stroke="#7cc4ff" stroke-width="3" stroke-linecap="round"><path d="M176 86 v24 M165.6 92 l20.8 12 M165.6 104 l20.8 -12"/></g>
  </svg>`;

  const TILES = [['temperature', 'mdi:thermometer', 'show_temperature'], ['valve', 'mdi:valve', 'show_valve'], ['battery', 'mdi:battery', 'show_battery'], ['window', 'mdi:window-closed-variant', 'show_window']];

  class ApplianceTrvCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}).filter((i) => i.startsWith('climate.'));
      return { entity: ids.find((i) => /(trv|vanne|valve|thermostati|radiat|tado|tete|tête)/i.test(i)) || ids[0] || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_hvac_modes: true, show_temperature: true, show_valve: true, show_battery: true, show_window: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en'); if (!T[l]) l = l.slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(v) { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : NaN; }
    _fmt(v, d = 1) { return fin(v) ? v.toLocaleString(this._lang(), { maximumFractionDigits: d, minimumFractionDigits: 0 }) : '--'; }
    _unit() { return String(this._hass?.config?.unit_system?.temperature || '°C'); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _label(cs, v) { try { if (this._hass.formatEntityState) return this._hass.formatEntityState(cs, v); } catch (e) { /* ancienne version de HA */ } const t = String(v).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="tvtitle"></div><div class="badge" id="tvbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="tvalert"></div>
        <div class="set" id="tvsetrow"><ha-icon icon="mdi:thermostat"></ha-icon><span class="sl" id="tvsl"></span><button id="tvm" type="button">−</button><b id="tvt"></b><button id="tvp" type="button">+</button></div>
        <div class="modes" id="tvmodes" role="group" hidden></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity));
      root.getElementById('tvsl').addEventListener('click', () => this._more(this._c.entity));
      root.getElementById('tvm').addEventListener('click', () => this._step(-1));
      root.getElementById('tvp').addEventListener('click', () => this._step(1));
      root.getElementById('tvmodes').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-m]');
        if (b && !b.disabled && this._hass) this._hass.callService('climate', 'set_hvac_mode', { entity_id: this._c.entity, hvac_mode: b.dataset.m });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ temperature: c.entity, valve: c.entity_valve_position || c.entity, battery: c.entity_battery || c.entity, window: c.entity_window || c.entity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, cs = this._st(c.entity), a = (cs && cs.attributes) || {};
      const dead = !cs || /^(unavailable|unknown)$/i.test(String(cs.state));
      const cur = this._num(a.current_temperature), target = this._num(a.temperature);
      const act = String(a.hvac_action || ''), off = !dead && String(cs.state) === 'off';
      // fenêtre : capteur dédié, sinon l'attribut de la tête (window_open / window_detection)
      const ws = this._st(c.entity_window);
      const win = ws ? /^(on|open|true)$/i.test(String(ws.state)) : a.window_open === true || /^(on|open|true)$/i.test(String(a.window_open ?? ''));
      const bs = this._st(c.entity_battery), bat = bs ? (/^(on|low)$/i.test(String(bs.state)) ? 5 : /^off$/i.test(String(bs.state)) ? 100 : this._num(bs.state)) : this._num(a.battery ?? a.battery_level);
      const vs = this._st(c.entity_valve_position), valve = vs ? this._num(vs.state) : this._num(a.pi_heating_demand ?? a.valve_position ?? a.position);
      // en chauffe : hvac_action, sinon vanne ouverte
      const heating = !off && (act === 'heating' || act === 'preheating' || (!act && fin(valve) && valve > 0));
      const st = dead ? 'unavailable' : win ? 'window' : off ? 'off' : heating ? 'heating' : 'idle';
      return { cs, a, cur, target, st, win, bat, valve, off, dead };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, k = this._compute(), u = this._unit();
      card.className = `${k.st}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('tvtitle').textContent = c.name || (k.cs && k.cs.attributes.friendly_name) || this._t('name');
      const badge = r.getElementById('tvbadge');
      badge.textContent = this._t(k.st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('tvalert');
      al.textContent = k.win ? this._t('window_alert') : ''; al.classList.toggle('on', !!al.textContent);

      // écran : consigne en grand (OFF si éteinte), température mesurée en petit
      const shown = this._pending != null ? this._pending : k.target;
      r.getElementById('tvset').textContent = k.dead ? '--' : k.off ? 'OFF' : fin(shown) ? `${this._fmt(shown, 1)}°` : '--';
      r.getElementById('tvcurt').textContent = fin(k.cur) ? `${this._fmt(k.cur, 1)}°` : '--';

      // consigne − / +
      const step = Number(k.a.target_temp_step) || (u.includes('F') ? 1 : 0.5);
      r.getElementById('tvsl').textContent = k.off ? this._t('off') : this._l('target');
      const tb = r.getElementById('tvt'); tb.textContent = fin(shown) ? `${this._fmt(shown, step < 1 ? 1 : 0)} ${u}` : '--'; tb.classList.toggle('pending', this._pending != null);
      r.getElementById('tvm').disabled = r.getElementById('tvp').disabled = k.dead || k.off || !fin(k.target);

      // boutons de mode : modes proposés par la tête, dans l'ordre de Home Assistant
      const box = r.getElementById('tvmodes');
      const modes = Array.isArray(k.a.hvac_modes) ? [...k.a.hvac_modes].sort((x, y) => (HVAC_ORDER.indexOf(x) + 1 || 99) - (HVAC_ORDER.indexOf(y) + 1 || 99)) : [];
      box.hidden = c.show_hvac_modes === false || modes.length < 2;
      if (!box.hidden) {
        const key = modes.join(',');
        if (box.dataset.k !== key) { box.dataset.k = key; box.innerHTML = modes.map((m) => `<button type="button" data-m="${esc(m)}"><ha-icon icon="${HVAC_ICON[m] || 'mdi:thermostat'}"></ha-icon></button>`).join(''); }
        box.querySelectorAll('button').forEach((b) => {
          const on = k.cs && String(k.cs.state) === b.dataset.m, lbl = k.cs ? this._label(k.cs, b.dataset.m) : b.dataset.m;
          b.classList.toggle('on', !!on); b.disabled = k.dead; b.title = lbl; b.setAttribute('aria-label', lbl); b.setAttribute('aria-pressed', String(!!on));
        });
      }

      const V = {
        temperature: [fin(k.cur), `${this._fmt(k.cur, 1)}`, u],
        valve: [fin(k.valve), this._fmt(k.valve, 0), '%'],
        battery: [fin(k.bat), this._fmt(k.bat, 0), '%'],
        window: [!!c.entity_window || k.a.window_open != null, this._t(k.win ? 'open' : 'closed'), ''],
      };
      TILES.forEach(([key, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${key}"]`); const [show, val, unit] = V[key];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', key === 'battery' && k.bat < 20);
        el.classList.toggle('cold', key === 'window' && k.win);
        el.querySelector('.lbl').textContent = this._l(key);
        if (key === 'window') el.querySelector('ha-icon').setAttribute('icon', k.win ? 'mdi:window-open-variant' : 'mdi:window-closed-variant');
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }

    // − / + : la consigne change tout de suite à l'écran, l'appel part 0,8 s après le dernier clic
    _step(dir) {
      const k = this._compute(); if (!fin(k.target)) return;
      const a = k.a, step = Number(a.target_temp_step) || (this._unit().includes('F') ? 1 : 0.5);
      let v = (this._pending != null ? this._pending : k.target) + dir * step;
      const mn = this._num(a.min_temp), mx = this._num(a.max_temp);
      if (fin(mn)) v = Math.max(mn, v); if (fin(mx)) v = Math.min(mx, v);
      this._pending = Math.round(v / step) * step;
      this._render();
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this._hass.callService('climate', 'set_temperature', { entity_id: this._c.entity, temperature: Math.round(this._pending * 10) / 10 });
        setTimeout(() => { this._pending = null; if (this._hass) this._render(); }, 4000);
      }, 800);
    }
  }
  customElements.define(TAG, ApplianceTrvCard);

  /* ---- éditeur visuel ---- */
  class ApplianceTrvCardEditor extends HTMLElement {
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
      const ent = (name, domain, dc) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(dc ? { device_class: dc } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        ent('entity', 'climate'),
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_window', ['binary_sensor', 'input_boolean']), ent('entity_battery', ['sensor', 'binary_sensor']), ent('entity_valve_position', ['sensor', 'number']),
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_hvac_modes'), bool('show_temperature'), bool('show_valve'), bool('show_battery'), bool('show_window'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceTrvCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Tête thermostatique de radiateur à eau (photo Tado X) : écran en direct, consigne − / +, modes, fenêtre ouverte, batterie, ouverture de vanne.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/trv.md',
  });
})();
