/* Carte « Adoucisseur d'eau » — custom:appliance-water-softener-card 
 * Adoucisseur à résine (type Culligan) : cuve à résine avec tête de commande (écran LCD, boutons) et bac à sel.
 * Phases : service (eau adoucie), contre-lavage, aspiration de saumure, rinçage ; alerte sel bas.
 * Tuiles : débit, capacité restante, sel, dureté (entrée → sortie), consommation du jour, prochaine régénération, puissance.
 */
(() => {
  const TAG = 'appliance-water-softener-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n softener*/{};

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--ws-ok:var(--appliance-ok-color,#43a047);--ws-warn:var(--appliance-warn-color,#ffa000);
  --ws-alert:var(--appliance-alert-color,#db4437);--ws-cold:var(--appliance-cold-color,#2b9af9);--spd:1.2s;--salt:.65;--lvl:.85}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.service .badge{background:color-mix(in srgb,var(--ws-cold) 22%,transparent);color:var(--ws-cold)}
.backwash .badge,.brine .badge,.rinse .badge{background:color-mix(in srgb,var(--ws-warn) 24%,transparent);color:var(--ws-warn)}
.lowsalt .badge{background:color-mix(in srgb,var(--ws-alert) 22%,transparent);color:var(--ws-alert)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--ws-alert)}
/* ---- illustration ---- */
.pipe{fill:none;stroke-linecap:round}
.pbase{stroke:#8793a3;stroke-width:5.4}
.pflow{stroke-width:2.4;stroke-dasharray:1 7;opacity:0}
.pin .pflow{stroke:#6f8cff}.pout .pflow{stroke:#4fd8ff}.pdr .pflow{stroke:#b59a7a}.pbr .pflow{stroke:#ffc04d}
.service .pin .pflow,.service .pout .pflow{opacity:1;animation:wsd var(--spd) linear infinite}
.backwash .pin .pflow,.backwash .pdr .pflow{opacity:1;animation:wsd var(--spd) linear infinite}
.rinse .pin .pflow,.rinse .pdr .pflow{opacity:1;animation:wsd calc(var(--spd) * .6) linear infinite}
.brine .pbr .pflow,.brine .pdr .pflow{opacity:1;animation:wsd calc(var(--spd) * 1.4) linear infinite}
.pbr .pflow{animation-direction:normal}
@keyframes wsd{to{stroke-dashoffset:-16}}
.drop{fill:#7fdcff;opacity:0}
.service .drop,.rinse .drop{opacity:.9;animation:wsfall calc(var(--spd) * 1.6) linear infinite}
.backwash .drop{opacity:.9;fill:#c8aa82;animation:wsrise calc(var(--spd) * 1.6) linear infinite}
.brine .drop{opacity:.9;fill:#ffd27a;animation:wsfall calc(var(--spd) * 2.6) linear infinite}
.drop:nth-child(2){animation-delay:-.35s!important}.drop:nth-child(3){animation-delay:-.7s!important}.drop:nth-child(4){animation-delay:-1.05s!important}.drop:nth-child(5){animation-delay:-1.4s!important}
@keyframes wsfall{0%{transform:translateY(0);opacity:0}15%{opacity:.95}85%{opacity:.95}100%{transform:translateY(110px);opacity:0}}
@keyframes wsrise{0%{transform:translateY(110px);opacity:0}15%{opacity:.95}85%{opacity:.95}100%{transform:translateY(0);opacity:0}}
.beads{transform-box:fill-box;transform-origin:50% 100%}
.backwash .beads{animation:wsjig .5s ease-in-out infinite alternate}
@keyframes wsjig{from{transform:translateY(-6px) scaleY(1.04)}to{transform:translateY(0) scaleY(.98)}}
.bed{fill:#ffb300;opacity:0;transition:opacity .6s}
.brine .bed{opacity:.5;animation:wspulse 1.2s ease-in-out infinite alternate}
@keyframes wspulse{from{opacity:.22}to{opacity:.55}}
.muddy{fill:#b08a5a;opacity:0;transition:opacity .6s}.backwash .muddy{opacity:.32}
.brinew{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--lvl));transition:transform 1.4s ease}
.brine .brinew{animation:wsbrine 5s ease-in-out infinite alternate}
@keyframes wsbrine{from{transform:scaleY(.9)}to{transform:scaleY(.55)}}
.salt{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--salt));transition:transform 1.2s ease}
.alertw{opacity:0}.lowsalt .alertw{opacity:1;animation:wsblink 1s ease-in-out infinite}
.lowsalt .lid{animation:wsblink 1.6s ease-in-out infinite}
@keyframes wsblink{50%{opacity:.35}}
.lcdt{font:700 6.6px/1 ui-monospace,Consolas,monospace;fill:#2c3a10;text-anchor:middle;letter-spacing:.2px}
.led{fill:#43d17a}.backwash .led,.brine .led,.rinse .led{fill:#ffa000;animation:wsblink .8s steps(2) infinite}.lowsalt .led{fill:#e53935}
.off svg,.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante, tuiles en colonne ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  // Ébauche vectorielle : tête de commande (écran + panneau bleu), cuve à résine en écorché (lit de résine, tube central),
  // bac à sel en écorché (sel, saumure). Repères : 250 × 290.
  const SVG = (label) => `<svg viewBox="0 0 250 290" role="img" aria-label="${label}"><defs>
    <linearGradient id="wsc" x1="0" x2="1"><stop offset="0" stop-color="#f6f0df"/><stop offset=".55" stop-color="#e8dfc7"/><stop offset="1" stop-color="#cfc4a6"/></linearGradient>
    <linearGradient id="wsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf8ef"/><stop offset="1" stop-color="#e2d9c0"/></linearGradient>
    <linearGradient id="wsb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b57c9"/><stop offset="1" stop-color="#1f3499"/></linearGradient>
    <linearGradient id="wsw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeaf8"/><stop offset="1" stop-color="#8fcdef"/></linearGradient>
    <radialGradient id="wssh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <pattern id="wsr" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#c98f2a"/><circle cx="1.4" cy="1.4" r="1.2" fill="#e7b04a"/><circle cx="3.9" cy="3.6" r="1.3" fill="#e0a43a"/><circle cx="3.8" cy="1" r=".7" fill="#a8731a"/></pattern>
    <pattern id="wss" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#d3dade"/><circle cx="1.6" cy="1.6" r="1.5" fill="#fff" stroke="#9aa6ae" stroke-width=".5"/><circle cx="4.4" cy="4.2" r="1.6" fill="#fff" stroke="#9aa6ae" stroke-width=".5"/></pattern>
    <clipPath id="wsrw"><rect x="49" y="106" width="52" height="152" rx="5"/></clipPath>
    <clipPath id="wsbw"><rect x="139" y="168" width="82" height="92" rx="5"/></clipPath></defs>
    <ellipse cx="125" cy="274" rx="112" ry="7" fill="url(#wssh)"/>
    <!-- tuyaux : arrivée (eau dure), départ (eau adoucie), saumure, évacuation -->
    <g class="pipe pin"><path class="pbase" d="M6 46 H27"/><path class="pflow" d="M6 46 H27"/></g>
    <g class="pipe pout"><path class="pbase" d="M113 46 H244"/><path class="pflow" d="M113 46 H244"/></g>
    <g class="pipe pbr"><path class="pbase" d="M186 150 C186 112 150 104 113 60" style="stroke-width:3.4"/><path class="pflow" d="M186 150 C186 112 150 104 113 60"/></g>
    <g class="pipe pdr"><path class="pbase" d="M27 62 C10 62 8 130 8 262" style="stroke:#a9a39a"/><path class="pflow" d="M27 62 C10 62 8 130 8 262"/></g>
    <!-- cuve à résine -->
    <rect x="38" y="68" width="74" height="204" rx="34" fill="url(#wsc)" stroke="#b9b095" stroke-width="1.2"/>
    <rect x="46" y="102" width="58" height="160" rx="8" fill="#fbf8ef" stroke="#c8bfa4" stroke-width=".8"/>
    <g clip-path="url(#wsrw)"><rect x="49" y="106" width="52" height="152" fill="url(#wsw)"/><rect class="muddy" x="49" y="106" width="52" height="152"/>
      <g class="beads"><rect x="49" y="158" width="52" height="86" fill="url(#wsr)"/></g><rect class="bed" x="49" y="158" width="52" height="86"/>
      <rect x="49" y="244" width="52" height="14" fill="#9aa1a8"/><rect x="72.4" y="104" width="5.2" height="150" rx="2.6" fill="#f5f5f2" stroke="#bfc3c6" stroke-width=".6"/>
      <g>${[0, 1, 2, 3, 4].map((i) => `<circle class="drop" cx="${58 + i * 9}" cy="112" r="1.9"/>`).join('')}</g></g>
    <!-- tête de commande -->
    <rect x="22" y="12" width="96" height="56" rx="7" fill="url(#wsh)" stroke="#b9b095" stroke-width="1"/>
    <rect x="29" y="20" width="42" height="15" rx="2" fill="#a9c957" stroke="#6f8a2c" stroke-width=".7"/><text class="lcdt" id="wslcd" x="50" y="30.5">SERVICE</text>
    <rect x="78" y="18" width="34" height="42" rx="3.5" fill="url(#wsb)"/><text x="95" y="26" text-anchor="middle" font-size="5.2" font-style="italic" font-weight="700" fill="#fff" font-family="Georgia,serif">Culligan</text>
    <circle cx="95" cy="43" r="9.5" fill="#1b2c82"/><path d="M95 35l-3 4h6zM95 51l-3-4h6z" fill="#cfd8ff"/><circle cx="95" cy="43" r="2.2" fill="#cfd8ff"/>
    <circle class="led" cx="36" cy="55" r="2.1"/><rect x="43" y="52.5" width="22" height="5" rx="2.5" fill="#d6cdb4"/>
    <!-- bac à sel -->
    <rect x="128" y="150" width="104" height="122" rx="12" fill="url(#wsc)" stroke="#b9b095" stroke-width="1.2"/>
    <rect x="134" y="164" width="92" height="100" rx="8" fill="#fbf8ef" stroke="#c8bfa4" stroke-width=".8"/>
    <g clip-path="url(#wsbw)"><rect x="139" y="168" width="82" height="92" fill="#f2f5f6"/>
      <rect class="brinew" x="139" y="168" width="82" height="92" fill="#9ed8f2" opacity=".7"/><rect class="salt" x="139" y="168" width="82" height="92" fill="url(#wss)" opacity=".92"/>
      <rect x="139" y="252" width="82" height="8" fill="#b9c4cb"/></g>
    <rect class="lid" x="124" y="142" width="112" height="14" rx="7" fill="url(#wsh)" stroke="#b9b095" stroke-width="1"/><rect x="170" y="145" width="20" height="5" rx="2.5" fill="#cfc5a8"/>
    <g class="alertw"><circle cx="218" cy="128" r="11" fill="#e53935"/><path d="M218 121v8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="218" cy="134" r="1.5" fill="#fff"/></g>
  </svg>`;

  const TILES = [['flow', 'mdi:water-pump', 'show_flow'], ['capacity', 'mdi:gauge', 'show_capacity'], ['salt', 'mdi:shaker-outline', 'show_salt'],
    ['hardness', 'mdi:water-opacity', 'show_hardness'], ['today', 'mdi:calendar-today', 'show_today'], ['regen', 'mdi:calendar-refresh', 'show_regen'], ['power', 'mdi:flash', 'show_power']];
  const RE = {
    backwash: /backwash|back.?wash|contre.?lavage|gegenstrom/i,
    brine: /brine|saumure|aspir|draw|slow|regener|r[ée]g[ée]n[ée]ration|recharge|regen/i,
    rinse: /rins|rin[cç]|fast|spül|spuel|refill|remplissage/i,
  };

  class ApplianceWaterSoftenerCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /(adoucisseur|softener|culligan)/i.test(i) && /^(sensor|binary_sensor|switch|input_boolean)\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_flow: true, show_capacity: true, show_salt: true, show_hardness: true, show_today: true, show_regen: true, show_power: true, salt_low: 20, ...c };
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
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="wstitle"></div><div class="badge" id="wsbadge"></div></div>
        <div class="body">${SVG((this._c.name || this._t('name')).replace(/"/g, ''))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_flow));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow, capacity: c.entity_capacity, salt: c.entity_salt, hardness: c.entity_hardness_out || c.entity_hardness_in, today: c.entity_today, regen: c.entity_regen_days, power: c.entity_power }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, e = this._st(c.entity);
      const flow = this._num(c.entity_flow), salt = this._num(c.entity_salt);
      const raw = e ? String(e.state) : '';
      const known = [c.entity, c.entity_flow, c.entity_capacity, c.entity_salt].some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      let phase = 'idle';
      if (!known) phase = 'unavailable';
      else if (e && /^(off)$/i.test(raw)) phase = 'off';
      else if (RE.backwash.test(raw)) phase = 'backwash';
      else if (RE.rinse.test(raw)) phase = 'rinse';
      else if (RE.brine.test(raw) || (e && /^on$/i.test(raw) && /regen/i.test(String(e.entity_id) + JSON.stringify(e.attributes || {})))) phase = 'brine';
      else if (!isNaN(flow) && flow > 0.05) phase = 'service';
      const low = !isNaN(salt) && salt <= Number(c.salt_low);
      return { phase, flow, salt, low };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { phase, flow, salt, low } = this._compute();
      card.className = `${phase}${low ? ' lowsalt' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--spd', `${(isNaN(flow) ? 1.2 : Math.max(.5, Math.min(2.4, 2.4 - flow / 12))).toFixed(2)}s`);
      card.style.setProperty('--salt', String(isNaN(salt) ? .6 : Math.max(.03, Math.min(1, salt / 100)).toFixed(3)));
      r.getElementById('wstitle').textContent = c.name || this._t('name');
      const state = low && phase !== 'backwash' && phase !== 'brine' && phase !== 'rinse' ? 'lowsalt' : phase;
      r.getElementById('wsbadge').textContent = this._t(state);
      r.getElementById('wslcd').textContent = this._t(`lcd_${state}`);
      const fu = this._unit(c.entity_flow, 'L/min'), tu = this._unit(c.entity_today, 'L');
      const hin = this._num(c.entity_hardness_in), hout = this._num(c.entity_hardness_out), hu = this._unit(c.entity_hardness_out || c.entity_hardness_in, '°f');
      const V = {
        flow: [c.entity_flow, this._fmt(flow, 1), fu],
        capacity: [c.entity_capacity, this._fmt(this._num(c.entity_capacity), 0), this._unit(c.entity_capacity, '%')],
        salt: [c.entity_salt, this._fmt(salt, 0), this._unit(c.entity_salt, '%')],
        hardness: [c.entity_hardness_in || c.entity_hardness_out, !isNaN(hin) && !isNaN(hout) ? `${this._fmt(hin, 0)} → ${this._fmt(hout, 0)}` : this._fmt(!isNaN(hout) ? hout : hin, 0), hu],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 0), tu],
        regen: [c.entity_regen_days, this._fmt(this._num(c.entity_regen_days), 0), this._t('days')],
        power: [c.entity_power, this._fmt(this._num(c.entity_power), 0), this._unit(c.entity_power, 'W')],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'salt' && low);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceWaterSoftenerCard);

  /* ---- éditeur visuel ---- */
  class ApplianceWaterSoftenerCardEditor extends HTMLElement {
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
        ent('entity', ['sensor', 'binary_sensor', 'switch', 'input_boolean', 'select']),
        ent('entity_flow', 'sensor'), ent('entity_capacity', 'sensor'), ent('entity_salt', 'sensor'),
        ent('entity_hardness_in', 'sensor'), ent('entity_hardness_out', 'sensor'),
        ent('entity_today', 'sensor'), ent('entity_regen_days', 'sensor'), ent('entity_power', 'sensor'),
        { name: 'salt_low', default: 20, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('compact', false), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceWaterSoftenerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Adoucisseur d'eau animé : service, contre-lavage, saumure, rinçage, sel, capacité, dureté.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/water-softener.md',
  });
})();
