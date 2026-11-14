/* Carte « Climatiseur mobile » — custom:appliance-portable-ac-card
 * Climatiseur monobloc portable avec gaine d'évacuation (Tuya / Smart Life / Midea / De'Longhi…) : dessin SVG du bloc sur roulettes,
 * écran avec la consigne, grille de soufflage, réservoir de condensats et gaine qui part vers la fenêtre.
 * Entités (toutes facultatives) : climate (mode, consigne, température, ventilation) ou simple interrupteur ; température, consigne,
 * ventilation, minuterie, réservoir (plein / niveau), puissance. Boutons : marche / arrêt, consigne − / +, mode.
 * Animations : air froid bleu qui sort de la grille (orange en chauffage, gris en ventilation), air chaud orange qui part par la gaine
 * vers l'extérieur, gouttes qui tombent dans le réservoir en déshumidification, réservoir plein qui clignote en rouge, écran qui
 * s'éteint à l'arrêt. La vitesse des flux suit la ventilation.
 * États : off, cooling, dry, fan, heating, idle, unavailable. Alerte : réservoir plein.
 */
(() => {
  const TAG = 'appliance-portable-ac-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n portable_ac*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const FULL_RE = /^(on|true|full|plein|1)$/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --pa-ok:var(--appliance-ok-color,#43a047);--pa-alert:var(--appliance-alert-color,#db4437);--cold:#4db6ff;--hot:#ff8a3d;--spd:1.6s;--tank:.2}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.cooling .badge{background:color-mix(in srgb,var(--cold) 24%,transparent);color:var(--cold)}
.heating .badge{background:color-mix(in srgb,var(--hot) 24%,transparent);color:var(--hot)}
.dry .badge,.fan .badge,.idle .badge{background:color-mix(in srgb,var(--pa-ok) 20%,transparent);color:var(--pa-ok)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pa-alert);font-weight:500;text-align:center}
.tankfull .alert{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--pa-alert)}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{width:34px;height:34px;border-radius:50%;border:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:19px;padding:0}
.ctrls button:hover{transform:scale(1.08)}.ctrls button:active{transform:scale(.92)}
.ctrls button.on{background:var(--cold);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--cold) 55%,transparent)}
.heating .ctrls button.on{background:var(--hot);box-shadow:0 0 12px color-mix(in srgb,var(--hot) 55%,transparent)}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- appareil ---- */
.body{fill:url(#pa-body);stroke:#c9ccd2;stroke-width:1.2}
.screen{fill:#0d1013;transition:fill .4s}
.dt{fill:var(--cold);font:700 17px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;transition:opacity .4s,fill .4s}
.dm{fill:#9fb0c0;font:600 5.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;letter-spacing:.08em;transition:opacity .4s}
.off .dt,.off .dm,.unavailable .dt,.unavailable .dm{opacity:0}
.heating .dt{fill:var(--hot)}.dry .dt,.fan .dt,.idle .dt{fill:#8be0a4}
.led{fill:#555;transition:fill .3s}.cooling .led{fill:var(--cold)}.heating .led{fill:var(--hot)}.dry .led,.fan .led,.idle .led{fill:#43d17a}.tankfull .led{fill:var(--pa-alert);animation:pablink .8s steps(2) infinite}
.slat{stroke:#9aa0aa;stroke-width:1.4;stroke-linecap:round}
.air{fill:none;stroke:var(--cold);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:7 9;opacity:0}
.cooling .air{opacity:.9;animation:paair var(--spd) linear infinite}
.heating .air{stroke:var(--hot);opacity:.9;animation:paair var(--spd) linear infinite}
.fan .air{stroke:#aab4c0;opacity:.8;animation:paair var(--spd) linear infinite}
.dry .air{stroke:#9fe0c4;opacity:.6;animation:paair calc(var(--spd) * 1.6) linear infinite}
.idle .air{opacity:.35;animation:paair calc(var(--spd) * 3) linear infinite}
.air:nth-child(2){animation-delay:-.4s!important}.air:nth-child(3){animation-delay:-.8s!important}
@keyframes paair{to{stroke-dashoffset:-32}}
.hose{fill:none;stroke:#cfd3d9;stroke-width:9;stroke-linecap:round}
.hoseribs{fill:none;stroke:#9ea4ad;stroke-width:9;stroke-dasharray:1.4 3.2;stroke-linecap:butt}
.exh{fill:none;stroke:var(--hot);stroke-width:2.6;stroke-linecap:round;stroke-dasharray:3 10;opacity:0}
.cooling .exh,.dry .exh,.heating .exh{opacity:.95;animation:paexh calc(var(--spd) * .9) linear infinite}
.heating .exh{stroke:#ffb86b;opacity:.35}
.fan .exh{stroke:#aab4c0;opacity:.6;animation:paexh var(--spd) linear infinite}
.idle .exh{opacity:.3;animation:paexh calc(var(--spd) * 3) linear infinite}
@keyframes paexh{to{stroke-dashoffset:-26}}
.wave{fill:none;stroke:var(--hot);stroke-width:1.6;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.cooling .wave,.dry .wave{animation:pawave 2.4s ease-in-out infinite}
.wave.w2{animation-delay:.8s!important}.wave.w3{animation-delay:1.6s!important}
@keyframes pawave{0%{opacity:0;transform:translateY(5px)}30%{opacity:.8}100%{opacity:0;transform:translateY(-10px)}}
.sun{fill:#ffcc4d;opacity:.75}.cooling .sun,.dry .sun{filter:drop-shadow(0 0 4px #ffb300)}
.tankwin{fill:#e8f4ff;stroke:#b7bfc9;stroke-width:1}
.water{fill:#58b8ff;opacity:.85;transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--tank));transition:transform 1s,fill .4s}
.tankfull .water{fill:#ff5a4d;animation:pablink 1s steps(2) infinite}
.drop{fill:#7cc8ff;opacity:0}
.dry .drop{animation:padrop 1.3s ease-in infinite}
.drop.d2{animation-delay:.45s!important}.drop.d3{animation-delay:.85s!important}
@keyframes padrop{0%{opacity:0;transform:translateY(0)}15%{opacity:.95}85%{opacity:.95}100%{opacity:0;transform:translateY(12px)}}
@keyframes pablink{50%{opacity:.25}}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact ---- */
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
.compact .ctrls button{width:21px;height:21px;--mdc-icon-size:13px}
`;

  const SVG = (label) => `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="pa-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e4e7ec"/><stop offset=".4" stop-color="#fbfbfc"/><stop offset="1" stop-color="#d4d8de"/></linearGradient>
  <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#dff2ff"/></linearGradient>
  <radialGradient id="pa-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 </defs>
 <!-- mur et fenêtre -->
 <rect x="236" y="0" width="64" height="170" fill="var(--secondary-background-color)" opacity=".6"/>
 <rect x="244" y="14" width="48" height="98" rx="3" fill="url(#pa-sky)" stroke="#b4bcc6" stroke-width="2"/>
 <circle class="sun" cx="276" cy="32" r="8"/>
 <path d="M244 112 H292" stroke="#b4bcc6" stroke-width="3"/>
 <g class="waves"><path class="wave" d="M262 50 q-4 -6 0 -12 q4 -6 0 -12"/><path class="wave w2" d="M272 54 q-4 -6 0 -12 q4 -6 0 -12"/><path class="wave w3" d="M282 50 q-4 -6 0 -12 q4 -6 0 -12"/></g>
 <ellipse cx="133" cy="168" rx="52" ry="5" fill="url(#pa-shadow)"/>
 <line x1="0" y1="168" x2="300" y2="168" stroke="currentColor" stroke-opacity=".12"/>
 <!-- gaine d'évacuation -->
 <path class="hose" d="M176 78 C214 78 206 70 244 66"/><path class="hoseribs" d="M176 78 C214 78 206 70 244 66"/>
 <path class="exh" d="M176 78 C214 78 206 70 246 66"/>
 <rect x="240" y="58" width="9" height="16" rx="2" fill="#aeb5be"/>
 <!-- appareil -->
 <g class="unit">
  <rect class="body" x="90" y="16" width="86" height="146" rx="12"/>
  <rect x="98" y="22" width="70" height="12" rx="5" fill="#e4e7ec" stroke="#c9ccd2"/>
  <path class="slat" d="M104 28 H162 M104 31 H162"/>
  <rect class="screen" x="102" y="42" width="62" height="34" rx="6"/>
  <text class="dt" id="padt" x="133" y="62">--</text>
  <text class="dm" id="padm" x="133" y="71"></text>
  <circle class="led" cx="156" cy="48" r="1.8"/>
  <g stroke="#c4c8cf" stroke-width="1.6" stroke-linecap="round"><path d="M104 88 H162 M104 94 H162 M104 100 H162 M104 106 H162 M104 112 H162"/></g>
  <rect class="tankwin" x="106" y="124" width="54" height="22" rx="4"/>
  <rect class="water" x="108" y="126" width="50" height="18" rx="3"/>
  <g class="drops"><circle class="drop" cx="120" cy="116" r="1.8"/><circle class="drop d2" cx="133" cy="116" r="1.8"/><circle class="drop d3" cx="146" cy="116" r="1.8"/></g>
  <circle cx="104" cy="166" r="3.6" fill="#4b4f57"/><circle cx="162" cy="166" r="3.6" fill="#4b4f57"/>
 </g>
 <!-- air soufflé par la grille du haut -->
 <g class="airs"><path class="air" d="M110 20 C102 12 88 10 72 17"/><path class="air" d="M126 18 C122 8 100 4 80 11"/><path class="air" d="M142 18 C142 5 116 1 90 5"/></g>
</svg>`;

  class AppliancePortableAcCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const cl = ids.find((i) => i.startsWith('climate.') && /portable|mobile|clim|ac_|aircon|monobloc/i.test(i)) || ids.find((i) => i.startsWith('climate.')) || '';
      return cl ? { entity: cl } : {};
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_temperature: true, show_target: true, show_fan: true, show_timer: true, show_power: true, temp_step: 1, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _unit() { return (this._hass && this._hass.config && this._hass.config.unit_system && this._hass.config.unit_system.temperature) || '°C'; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="patitle"></div><div class="badge" id="pabadge"></div></div>
        <div class="alert" id="paalert"></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="ctrls" id="pactrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="temperature"><div class="l"><ha-icon icon="mdi:thermometer"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="target"><div class="l"><ha-icon icon="mdi:target"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="fan"><div class="l"><ha-icon icon="mdi:fan"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="timer"><div class="l"><ha-icon icon="mdi:timer-outline"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="tank"><div class="l"><ha-icon icon="mdi:water"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="power"><div class="l"><ha-icon icon="mdi:flash"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      const tgt = { temperature: 'entity_temperature', target: 'entity_target', fan: 'entity_fan', timer: 'entity_timer', tank: 'entity_tank', power: 'entity_power' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]] || this._c.entity)));
      root.getElementById('pactrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true;
    }

    // mode affiché : off, cooling, dry, fan, heating, idle, unavailable
    _mode() {
      const c = this._c, s = this._st(c.entity);
      if (!s || /^(unavailable|unknown)$/i.test(String(s.state))) return 'unavailable';
      const raw = String(s.state).toLowerCase(), a = s.attributes || {}, act = String(a.hvac_action || '').toLowerCase();
      if (raw === 'off' || act === 'off') return 'off';
      if (act === 'idle') return 'idle';
      const m = { cooling: 'cooling', drying: 'dry', fan: 'fan', heating: 'heating' }[act];
      if (m) return m;
      return { cool: 'cooling', dry: 'dry', fan_only: 'fan', heat: 'heating', auto: 'cooling', heat_cool: 'cooling', on: 'cooling' }[raw] || 'cooling';
    }

    _cmd(k) {
      const c = this._c, h = this._hass, s = this._st(c.entity); if (!h || !s) return;
      const d = c.entity.split('.')[0], a = s.attributes || {}, off = String(s.state).toLowerCase() === 'off';
      if (k === 'power') {
        if (d === 'climate') h.callService('climate', off ? 'turn_on' : 'turn_off', { entity_id: c.entity });
        else h.callService('homeassistant', 'toggle', { entity_id: c.entity });
      } else if ((k === 'up' || k === 'down') && d === 'climate') {
        const step = Number(c.temp_step) || 1, cur = Number(a.temperature);
        if (isFinite(cur)) h.callService('climate', 'set_temperature', { entity_id: c.entity, temperature: Math.max(Number(a.min_temp) || 16, Math.min(Number(a.max_temp) || 30, cur + (k === 'up' ? step : -step))) });
      } else if ((k === 'up' || k === 'down') && c.entity_target) {
        const t = this._st(c.entity_target), v = this._num(c.entity_target), st = Number(t && t.attributes && t.attributes.step) || Number(c.temp_step) || 1;
        if (!isNaN(v)) h.callService('number', 'set_value', { entity_id: c.entity_target, value: v + (k === 'up' ? st : -st) });
      } else if (k === 'mode' && d === 'climate') {
        const modes = (a.hvac_modes || []).filter((m) => m !== 'off');
        if (modes.length) h.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: modes[(modes.indexOf(s.state) + 1) % modes.length] });
      }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity), a = (s && s.attributes) || {};
      const mode = this._mode();
      const tankS = this._st(c.entity_tank);
      const tankFull = !!tankS && (FULL_RE.test(String(tankS.state)) || (!isNaN(this._num(c.entity_tank)) && this._num(c.entity_tank) >= 100));
      const tankPct = !tankS ? NaN : /^(on|off|true|false)$/i.test(String(tankS.state)) ? (tankFull ? 100 : 15) : this._num(c.entity_tank);
      card.className = `${mode}${tankFull ? ' tankfull' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--tank', String(isNaN(tankPct) ? (mode === 'dry' ? 0.45 : 0.2) : Math.max(0.08, Math.min(1, tankPct / 100))));

      // ventilation : vitesse des flux (low / medium / high / auto, ou nombre)
      const fanS = this._st(c.entity_fan), fanRaw = String((fanS && fanS.state) ?? a.fan_mode ?? '').toLowerCase();
      const spd = /high|haut|fort|3|max|turbo/.test(fanRaw) ? 0.9 : /med|moy|2/.test(fanRaw) ? 1.4 : /low|bas|faible|1|quiet|silent/.test(fanRaw) ? 2.1 : 1.5;
      card.style.setProperty('--spd', spd + 's');

      const cur = c.entity_temperature ? this._num(c.entity_temperature) : Number(a.current_temperature);
      const tgt = c.entity_target ? this._num(c.entity_target) : Number(a.temperature);
      const unit = this._unit(), u = String(unit).replace(/^°?/, '°');
      r.getElementById('patitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('pabadge'); badge.textContent = this._t(mode); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('paalert').textContent = tankFull ? this._t('tank_full') : '';
      r.getElementById('padt').textContent = isFinite(tgt) ? this._fmt(tgt, tgt % 1 ? 1 : 0) + '°' : isFinite(cur) ? this._fmt(cur, 1) + '°' : '--';
      r.getElementById('padm').textContent = mode === 'off' || mode === 'unavailable' ? '' : this._t(`lcd_${mode}`);

      // boutons
      const isClimate = !!c.entity && c.entity.startsWith('climate.');
      const canTemp = (isClimate && a.temperature != null) || (!!c.entity_target && !!this._st(c.entity_target));
      const modes = isClimate ? (a.hvac_modes || []).filter((m) => m !== 'off') : [];
      const on = mode !== 'off' && mode !== 'unavailable';
      const btns = [
        ['power', 'mdi:power', 'power', on, !!s],
        ['down', 'mdi:minus', 'temp_down', null, canTemp],
        ['up', 'mdi:plus', 'temp_up', null, canTemp],
        ['mode', 'mdi:sun-snowflake-variant', 'mode', null, modes.length > 1],
      ].filter((b) => b[4] && c.show_controls !== false);
      const ctr = r.getElementById('pactrls');
      ctr.classList.toggle('hide', !btns.length);
      const sig = btns.map((b) => b.join('|')).join(';') + mode;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, onb]) => `<button class="${onb ? 'on' : ''}" data-k="${k}" title="${esc(this._t(lbl))}" aria-label="${esc(this._t(lbl))}"${mode === 'unavailable' || (!on && k !== 'power') ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon></button>`).join('');
      }

      const tm = this._num(c.entity_timer), pw = this._num(c.entity_power);
      const fanTxt = fanRaw && fanRaw !== 'unknown' ? (this._t(`fan_${fanRaw}`) !== `fan_${fanRaw}` ? this._t(`fan_${fanRaw}`) : fanRaw) : '';
      const V = {
        temperature: [isFinite(cur) && c.show_temperature !== false, this._fmt(cur, 1), u],
        target: [isFinite(tgt) && c.show_target !== false, this._fmt(tgt, tgt % 1 ? 1 : 0), u],
        fan: [!!fanTxt && c.show_fan !== false, fanTxt, ''],
        timer: [!isNaN(tm) && c.show_timer !== false, this._fmt(tm, 0), this._st(c.entity_timer)?.attributes?.unit_of_measurement || 'min'],
        tank: [!!tankS && c.show_tank !== false, tankFull ? this._t('full') : isNaN(tankPct) ? this._t('ok') : `${this._fmt(tankPct, 0)} %`, ''],
        power: [!!this._st(c.entity_power) && c.show_power !== false, this._fmt(pw, pw < 10 ? 1 : 0), this._st(c.entity_power)?.attributes?.unit_of_measurement || 'W'],
      };
      Object.entries(V).forEach(([k, [show, val, un]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.classList.toggle('bad', k === 'tank' && tankFull);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = un;
        el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  customElements.define(TAG, AppliancePortableAcCard);

  /* ---- éditeur visuel ---- */
  class AppliancePortableAcCardEditor extends HTMLElement {
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
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        { name: 'entity', selector: { entity: { domain: ['climate', 'switch', 'input_boolean'] } } },
        ent('entity_temperature', 'sensor'), ent('entity_target', 'number'), ent('entity_fan'), ent('entity_timer'), ent('entity_tank'), ent('entity_power', 'sensor'),
        { name: 'temp_step', default: 1, selector: { number: { min: 0.5, max: 5, step: 0.5, mode: 'box' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_temperature'), bool('show_target'), bool('show_fan'), bool('show_timer'), bool('show_tank'), bool('show_power'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', AppliancePortableAcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Climatiseur mobile (monobloc avec gaine) en dessin SVG : air froid, gaine d\'évacuation, réservoir de condensats, consigne, ventilation, minuterie.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
