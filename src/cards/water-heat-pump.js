/* Carte « PAC eau/eau » — custom:appliance-water-heat-pump-card
 * Pompe à chaleur eau/eau ou sol/eau (géothermie, nappe) : compresseur qui vibre entre
 * l'évaporateur (boucle de captage, à gauche) et le condenseur (boucle de chauffage, à droite),
 * départ/retour qui changent de couleur avec la température, COP instantané.
 */
(() => {
  const TAG = 'appliance-water-heat-pump-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n water_heat_pump*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--wp-heat:var(--appliance-heat-color,#ff8a3d);--wp-cold:var(--appliance-cold-color,#2b9af9);
  --wp-alert:var(--appliance-alert-color,#db4437)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--wp-heat) 22%,transparent);color:var(--wp-heat)}
.dhw .badge,.cooling .badge{background:color-mix(in srgb,var(--wp-cold) 22%,transparent);color:var(--wp-cold)}
.alarm .badge{background:color-mix(in srgb,var(--wp-alert) 22%,transparent);color:var(--wp-alert)}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- illustration ---- */
.comp{transform-box:fill-box;transform-origin:50% 100%}
.run .comp{animation:vib .11s linear infinite alternate}
@keyframes vib{0%{transform:translate(-.5px,0)}100%{transform:translate(.5px,-.4px)}}
.dash{stroke-dasharray:3 8;opacity:0}
.src .dash.src,.run .dash.ref,.circ .dash.ch,.chg .dash.chg{opacity:.9;animation:flow 1s linear infinite}
.run .dash.ref{opacity:.55;animation-duration:1.6s}
@keyframes flow{to{stroke-dashoffset:-11}}
.rad{fill:#e9edf1;transition:fill .8s}
.heating .rad{fill:color-mix(in srgb,var(--wp-flowc,#e5533d) 35%,#f4f6f8)}
.cooling .rad{fill:color-mix(in srgb,#3b8fe8 22%,#f4f6f8)}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.dhw .led{fill:#3fa3ff}.cooling .led{fill:#4dd0e1}.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:blink .8s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 13px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.off .body-shade{opacity:.55}
.buf{display:none}.buffer .buf{display:inline}.buffer .direct{display:none}
.noanim *{animation:none!important}
`;

  const SVG = `
<svg viewBox="0 0 290 204" role="img" aria-label="water heat pump">
 <defs>
  <linearGradient id="wp-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe6"/></linearGradient>
  <linearGradient id="wp-comp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b6570"/><stop offset=".45" stop-color="#3a434d"/><stop offset="1" stop-color="#22292f"/></linearGradient>
  <linearGradient id="wp-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--wp-tankc,#e5533d)"/><stop offset="1" style="stop-color:var(--wp-retc,#3b8fe8)"/></linearGradient>
  <linearGradient id="wp-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a1856a"/><stop offset="1" stop-color="#6f5641"/></linearGradient>
 </defs>
 <!-- sol et sonde de captage -->
 <rect x="0" y="158" width="66" height="46" rx="3" fill="url(#wp-soil)" opacity=".85"/>
 <path d="M0 158 H66" stroke="#6aa84f" stroke-width="3"/>
 <!-- radiateur -->
 <g transform="translate(40 0)">
 <rect x="184" y="14" width="52" height="50" rx="5" fill="#000" opacity=".1" transform="translate(1.5 2)"/>
 <g class="rad" stroke="#aab3bd" stroke-width="1">
  <rect x="184" y="14" width="52" height="8" rx="3"/><rect x="184" y="56" width="52" height="8" rx="3"/>
  <rect x="187" y="18" width="7" height="42" rx="3"/><rect x="198" y="18" width="7" height="42" rx="3"/>
  <rect x="209" y="18" width="7" height="42" rx="3"/><rect x="220" y="18" width="7" height="42" rx="3"/>
 </g>
 </g>
 <!-- caisson -->
 <rect x="76" y="26" width="96" height="128" rx="9" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="72" y="24" width="96" height="128" rx="9" fill="url(#wp-body)" stroke="#aeb6c0" stroke-width="1.2"/>
 <rect x="82" y="31" width="58" height="21" rx="4" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" id="dsp" x="111" y="46">--</text>
 <circle class="led" cx="152" cy="37" r="3.2"/>
 <circle cx="152" cy="47" r="3.6" fill="#c8cfd7" stroke="#9aa3ad"/>
 <rect x="80" y="58" width="80" height="88" rx="6" fill="#18212c" stroke="#2a3340" stroke-width="1.4"/>
 <!-- boucles d'eau : captage (gauche) et chauffage (droite), jusqu'aux échangeurs -->
 <g fill="none" stroke-width="6" stroke-linecap="round">
  <path d="M92 80 H30 V188" stroke="#4aa3df"/>
  <path d="M30 188 Q38 199 46 188" stroke="#3d8fd0"/>
  <path d="M46 188 V104 H92" stroke="#2b6cb0"/>
 </g>
 <g class="direct" fill="none" stroke-width="6" stroke-linecap="round">
  <path d="M148 80 H236 V64" style="stroke:var(--wp-flowc,#e5533d)"/>
  <path d="M264 64 V104 H148" style="stroke:var(--wp-retc,#3b8fe8)"/>
 </g>
 <!-- ballon tampon : boucle de charge (PAC ↔ ballon) et boucle de distribution (ballon ↔ émetteurs) -->
 <g class="buf">
  <g fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
   <path d="M148 80 H204 V128 H232" style="stroke:var(--wp-flowc,#e5533d)"/>
   <path d="M232 186 H190 V104 H148" style="stroke:var(--wp-retc,#3b8fe8)"/>
   <path d="M251 118 V84 H236 V64" style="stroke:var(--wp-tankc,#e5533d)"/>
   <path d="M264 64 V96 H280 V180 H270" style="stroke:var(--wp-retc,#3b8fe8)"/>
  </g>
  <rect x="234" y="120" width="38" height="78" rx="12" fill="#000" opacity=".12"/>
  <rect x="232" y="118" width="38" height="78" rx="12" fill="url(#wp-tank)" stroke="#8f99a4" stroke-width="1.2"/>
  <rect x="237" y="124" width="6" height="66" rx="3" fill="#fff" opacity=".28"/>
 </g>
 <!-- évaporateur (captage) et condenseur (chauffage) : échangeurs à plaques -->
 <g fill="#5fa8e8" stroke="#2f6ea8" stroke-width=".5">
  <rect x="86" y="70" width="2.6" height="42" rx=".8"/><rect x="89.6" y="70" width="2.6" height="42" rx=".8"/><rect x="93.2" y="70" width="2.6" height="42" rx=".8"/>
  <rect x="96.8" y="70" width="2.6" height="42" rx=".8"/><rect x="100.4" y="70" width="2.6" height="42" rx=".8"/>
 </g>
 <g fill="#f0883e" stroke="#a8541c" stroke-width=".5">
  <rect x="137" y="70" width="2.6" height="42" rx=".8"/><rect x="140.6" y="70" width="2.6" height="42" rx=".8"/><rect x="144.2" y="70" width="2.6" height="42" rx=".8"/>
  <rect x="147.8" y="70" width="2.6" height="42" rx=".8"/><rect x="151.4" y="70" width="2.6" height="42" rx=".8"/>
 </g>
 <!-- circuit frigorifique : aspiration, refoulement, détendeur -->
 <g fill="none" stroke="#c98a55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M94 70 V64 H114 V92"/><path d="M126 92 V64 H146 V70"/><path d="M146 112 V136 H94 V112"/>
 </g>
 <circle cx="120" cy="136" r="3" fill="#8c95a0" stroke="#5c6570"/>
 <g stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none">
  <path class="dash ref" d="M94 70 V64 H114 V92"/><path class="dash ref" d="M126 92 V64 H146 V70"/><path class="dash ref" d="M146 112 V136 H94 V112"/>
 </g>
 <!-- compresseur -->
 <g class="comp">
  <rect x="107" y="88" width="26" height="40" rx="11" fill="url(#wp-comp)" stroke="#1b2127"/>
  <ellipse cx="120" cy="92" rx="11" ry="4" fill="#6b7580" opacity=".55"/>
  <rect x="103" y="127" width="34" height="6" rx="2" fill="#4a535e"/>
 </g>
 <!-- circulation de l'eau -->
 <g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">
  <path class="dash src" d="M30 188 V80 H72"/><path class="dash src" d="M72 104 H46 V188"/>
  <g class="direct"><path class="dash ch" d="M172 80 H236 V64"/><path class="dash ch" d="M264 64 V104 H172"/></g>
  <g class="buf"><path class="dash chg" d="M168 80 H204 V128 H232"/><path class="dash chg" d="M232 186 H190 V104 H168"/>
   <path class="dash ch" d="M251 118 V84 H236 V64"/><path class="dash ch" d="M264 64 V96 H280 V180 H270"/></g>
 </g>
</svg>`;

  const TILES = [
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
    ['heat', 'mdi:heat-wave', 'show_heat', 'entity_heat_power'],
    ['cop', 'mdi:speedometer', 'show_cop', 'entity_cop'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps', 'entity_flow_temp'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps', 'entity_return_temp'],
    ['delta', 'mdi:delta', 'show_temps', 'entity_flow_temp'],
    ['buffer', 'mdi:storage-tank', 'show_temps', 'entity_buffer_temp'],
    ['src_in', 'mdi:thermometer-water', 'show_source', 'entity_source_in_temp'],
    ['src_out', 'mdi:thermometer-low', 'show_source', 'entity_source_out_temp'],
    ['rate', 'mdi:pump', 'show_flow_rate', 'entity_flow_rate'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy', 'entity_energy'],
    ['heat_energy', 'mdi:fire-circle', 'show_energy', 'entity_heat_energy'],
    ['scop', 'mdi:chart-line', 'show_scop', 'entity_scop'],
  ];
  const SHOW = ['show_status', 'show_power', 'show_heat', 'show_cop', 'show_temps', 'show_source', 'show_flow_rate', 'show_energy', 'show_scop', 'animations'];

  class ApplianceWaterHeatPumpCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/pac|heat_?pump|pompe_a_chaleur|geotherm/i, 'climate'),
        entity_power: f(/(pac|heat_?pump|pompe_a_chaleur|geotherm).*(power|puissance)/i, 'sensor'),
        entity_heat_power: f(/(chaleur|heat_meter|thermi|multical|kamstrup).*(power|puissance)/i, 'sensor'),
      };
    }
    static getConfigForm() {
      const ent = (name, domain, extra = {}) => ({ name, selector: { entity: { domain, ...extra } } });
      const RELAY = ['binary_sensor', 'switch', 'input_boolean', 'sensor'];
      return {
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'labels', selector: { object: {} } },
          { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
          ent('entity_status', ['climate', 'sensor', 'select', 'input_select', 'water_heater']),
          { type: 'grid', name: '', schema: [ent('entity_power', 'sensor'), ent('entity_heat_power', 'sensor'), ent('entity_cop', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_flow_rate', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_source_in_temp', 'sensor'), ent('entity_source_out_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [{ name: 'buffer_tank', selector: { boolean: {} } }, ent('entity_buffer_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_energy', 'sensor'), ent('entity_heat_energy', 'sensor'), ent('entity_scop', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_compressor', RELAY), ent('entity_source_pump', RELAY)] },
          { type: 'grid', name: '', schema: [
            { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'source_threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'compressor_threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'heating_delay', selector: { number: { min: 0, max: 600, step: 1, mode: 'box', unit_of_measurement: 's' } } },
            { name: 'flow_threshold', selector: { number: { min: 0, max: 10000, step: 1, mode: 'box' } } },
          ] },
          { type: 'grid', name: '', schema: SHOW.map((name) => ({ name, selector: { boolean: {} }, default: true })) },
          window.applianceTempField,
          ...window.applianceActionFields,
          window.applianceLanguageField(T),
        ],
        computeLabel: (s) => window.applianceEditorLabel(s.name),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { ...Object.fromEntries(SHOW.map((k) => [k, true])), threshold: 100, off_threshold: 0.5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    disconnectedCallback() { clearTimeout(this._dt); this._dt = null; }
    // Chauffage seulement si la puissance reste au-dessus du seuil pendant heating_delay secondes
    // (ex. pompes de puits et du primaire qui tournent ~20 s par jour pendant la veille).
    _sustained(above) {
      const d = (+this._c.heating_delay || 0) * 1000;
      if (!above) { this._since = null; this._sinceQ = (this._sinceQ || 0) + 1; clearTimeout(this._dt); this._dt = null; return false; }
      if (!d) return true;
      const now = Date.now();
      if (this._since == null) {
        this._since = Math.min(now, Date.parse((this._st(this._c.entity_power) || {}).last_changed) || now);
        if (this._since + d > now) this._sinceFromHistory(d);
      }
      const left = this._since + d - now;
      if (left <= 0) return true;
      if (!this._dt) this._dt = setTimeout(() => { this._dt = null; if (this._hass) this._render(); }, left + 50);
      return false;
    }
    // Carte ouverte ou recréée pendant la chauffe : last_changed d'un capteur rafraîchi souvent (toutes les 15 s…)
    // ne dit pas depuis quand la puissance dépasse le seuil ; l'historique de la fenêtre heating_delay le dit.
    _sinceFromHistory(d) {
      const h = this._hass, id = this._c.entity_power, q = this._sinceQ = (this._sinceQ || 0) + 1;
      if (!h || typeof h.callWS !== 'function' || !id) return;
      const now = Date.now(), u = ((this._st(id) || {}).attributes || {}).unit_of_measurement || '';
      const k = /^kw$/i.test(u) ? 1000 : /^mw$/i.test(u) ? 1e6 : 1;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(now - d).toISOString(), end_time: new Date(now).toISOString(),
        entity_ids: [id], minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          if (q !== this._sinceQ || this._since == null) return;
          const pts = ((r && r[id]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: parseFloat(p.s) * k })).filter((p) => Number.isFinite(p.t));
          if (!pts.length) return;
          // début de la fenêtre si tout est au-dessus du seuil, sinon le point qui suit le dernier passage dessous
          let since = Math.min(pts[0].t, now - d);
          pts.forEach((p, i) => { if (!(p.v > this._c.threshold)) since = i + 1 < pts.length ? pts[i + 1].t : now; });
          if (since < this._since) { this._since = since; clearTimeout(this._dt); this._dt = null; if (this._hass) this._render(); }
        })
        .catch(() => {});
    }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    // relais (binary_sensor, switch…) : on / off ; capteur numérique : marche au-dessus de 0
    _on(id) {
      const s = this._st(id); if (!s) return false;
      const v = this._num(id);
      return isNaN(v) ? /^(on|true|running|marche|heat|cool)/i.test(String(s.state)) : v > 0;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _kw(w) { return isNaN(w) ? ['--', ''] : w >= 1000 ? [this._fmt(w / 1000, 2), 'kW'] : [this._fmt(w, 0), 'W']; }
    // Compteurs d'énergie toujours en kWh (Wh et MWh convertis), sans décimale au-delà de 1000 kWh
    _kwh(id) {
      const v = this._num(id), u = String(this._unit(id, 'kWh'));
      const k = isNaN(v) ? NaN : /^wh$/i.test(u) ? v / 1000 : /^mwh$/i.test(u) ? v * 1000 : /^gwh$/i.test(u) ? v * 1e6 : v;
      return [this._fmt(k, Math.abs(k) >= 1000 ? 0 : 1), 'kWh'];
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${SVG}
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => { const c = this._c; window.applianceMore(this, c.entity_status || c.entity_power); });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // État : entité climate / texte si fournie, sinon puissance électrique (compresseur au-dessus du seuil)
    _compute() {
      const c = this._c, pw = this._watts(c.entity_power), heat = this._watts(c.entity_heat_power);
      const s = this._st(c.entity_status);
      const state = s ? String(s.state).toLowerCase() : '';
      const action = s ? String((s.attributes || {}).hvac_action || '').toLowerCase() : '';
      const txt = `${state} ${action}`, key = action || state;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (s && /^(unavailable|unknown|off|arr[eê]t|eteint|éteint)$/.test(state)) st = 'off';
      else if (/idle|standby|veille|attente/.test(action)) st = 'standby';
      else if (/dhw|ecs|hot.?water|eau.?chaude|sanitaire/.test(txt) || (s && String(c.entity_status).startsWith('water_heater.'))) st = 'dhw';
      else if (/cool|rafra|froid/.test(key) && key !== 'heat_cool') st = 'cooling';
      else if (/heat|chauff|compress|running|marche|^on/.test(key)) st = 'heating';
      else if (s) st = 'standby';
      else if (!isNaN(pw)) st = this._sustained(pw > c.threshold) ? 'heating' : pw > c.off_threshold ? 'standby' : 'off';
      else if (!isNaN(heat)) st = heat > 0 ? 'heating' : 'standby';
      else st = 'standby';
      const active = st === 'heating' || st === 'dhw' || st === 'cooling';
      // Trois animations séparées, par paliers de puissance ou par entité (relais) :
      // - circuit de chauffage au-dessus de threshold (une PAC tout-ou-rien chauffe souvent
      //   avec le seul circulateur, ~40 W, compresseur à l'arrêt) ;
      // - captage (pompes de puits / primaire) au-dessus de source_threshold : elles démarrent
      //   avant le compresseur et s'arrêtent après ; sans réglage, captage = compresseur ;
      // - compresseur et circuit frigorifique au-dessus de compressor_threshold (sinon threshold).
      const pump = active && (isNaN(pw) || pw > c.threshold);
      const run = c.entity_compressor ? this._on(c.entity_compressor) : active && (isNaN(pw) || pw > (c.compressor_threshold ?? c.threshold));
      const src = c.entity_source_pump ? this._on(c.entity_source_pump)
        : c.source_threshold != null && !isNaN(pw) ? pw > c.source_threshold || run : run;
      const rate = this._num(c.entity_flow_rate);
      // débit au-dessus de flow_threshold (unité du capteur) : un compteur de chaleur lit souvent quelques l/h à l'arrêt
      const flowing = rate > (+c.flow_threshold || 0);
      // ballon tampon : la PAC charge le ballon (compresseur, ou débit côté PAC s'il est mesuré)
      // et le circulateur distribue l'eau du ballon vers les émetteurs, compresseur arrêté ou non
      if (c.buffer_tank) {
        const chg = c.entity_flow_rate ? flowing : run;
        return { st, run, src, chg, circ: pump, pw, heat, rate };
      }
      const circ = c.entity_flow_rate ? flowing : pump || heat > 0;
      return { st, run, src, chg: false, circ, pw, heat, rate };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, run, src, chg, circ, pw, heat, rate } = this._compute();
      // températures dans l'unité d'affichage (°C / °F)
      const tu = window.applianceTemp(this._hass, c), tv = (id) => tu.conv(this._num(id), this._st(id));
      const flow = tv(c.entity_flow_temp), ret = tv(c.entity_return_temp);
      card.className = `${st} ${run ? 'run' : ''} ${src ? 'src' : ''} ${chg ? 'chg' : ''} ${circ ? 'circ' : ''} ${c.buffer_tank ? 'buffer' : ''} ${c.animations === false ? 'noanim' : ''}`;
      // départ / retour : bleu à 20 °C, rouge à 55 °C (températures de PAC, plus basses qu'une chaudière)
      const tc = (t, d) => isNaN(t) ? d : `color-mix(in srgb, #e5392b ${Math.round(Math.max(0, Math.min(1, (tu.toC(t) - 20) / 35)) * 100)}%, #3b8fe8)`;
      card.style.setProperty('--wp-flowc', tc(flow, '#e5533d'));
      card.style.setProperty('--wp-retc', tc(ret, '#3b8fe8'));
      const buf = tv(c.entity_buffer_temp);
      card.style.setProperty('--wp-tankc', tc(isNaN(buf) ? flow : buf, '#e5533d'));

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('dsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : isNaN(flow) ? '--' : `${Math.round(flow)}°`;

      // COP : capteur si fourni, sinon puissance thermique / puissance électrique quand le compresseur tourne
      let cop = this._num(c.entity_cop);
      if (!c.entity_cop && run && heat > 0 && pw > 0) cop = heat / pw;
      const hasCop = c.entity_cop || (c.entity_heat_power && c.entity_power);
      const V = {
        power: [c.entity_power, ...this._kw(pw)],
        heat: [c.entity_heat_power, ...this._kw(heat)],
        cop: [hasCop, this._fmt(cop, 1), ''],
        flow: [c.entity_flow_temp, this._fmt(flow, 1), tu.unit],
        ret: [c.entity_return_temp, this._fmt(ret, 1), tu.unit],
        delta: [c.entity_flow_temp && c.entity_return_temp, this._fmt(flow - ret, 1), tu.unit === '°F' ? '°F' : 'K'],
        buffer: [c.entity_buffer_temp, this._fmt(buf, 1), tu.unit],
        src_in: [c.entity_source_in_temp, this._fmt(tv(c.entity_source_in_temp), 1), tu.unit],
        src_out: [c.entity_source_out_temp, this._fmt(tv(c.entity_source_out_temp), 1), tu.unit],
        rate: [c.entity_flow_rate, this._fmt(rate, 2), this._unit(c.entity_flow_rate, 'l/h')],
        energy: [c.entity_energy, ...this._kwh(c.entity_energy)],
        heat_energy: [c.entity_heat_energy, ...this._kwh(c.entity_heat_energy)],
        scop: [c.entity_scop, this._fmt(this._num(c.entity_scop), 2), ''],
      };
      TILES.forEach(([k, , opt, more]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [shown, val, unit] = V[k];
        el.classList.toggle('hide', !shown || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        const id = k === 'cop' && !c.entity_cop ? c.entity_heat_power : c[more];
        el.onclick = () => { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceWaterHeatPumpCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – PAC eau/eau / Water heat pump', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Pompe à chaleur eau/eau ou géothermique animée : compresseur, captage, départ/retour, COP.', preview: true,
  });
})();
