/* Carte « Arrosage » — custom:appliance-irrigation-card
 * Arrosage automatique du jardin : de 1 à 8 zones (électrovannes `valve`, `switch` ou `input_boolean`), pompe de puits,
 * détecteur de pluie, humidité du sol. Un bouton par zone (clic = marche / arrêt), arrêt général, arrosage auto (interrupteur maître).
 * Tout est facultatif : les entités sont génériques (aucune marque), la carte lit simplement l'état on / off des zones.
 */
(() => {
  const TAG = 'appliance-irrigation-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n irrigation*/{};

  const ON_RE = /^(on|open|opening|true|yes|1|running|watering|irrigating|active)$/i;
  const RAIN_RE = /^(on|true|yes|1|rain|raining|wet|detected|pluie)$/i;

  const CSS = `
:host{display:block;height:100%} ha-card{display:block;height:100%;box-sizing:border-box;padding:10px 12px 12px;overflow:hidden;
  --ir-ok:var(--appliance-ok-color,#43a047);--ir-warn:var(--appliance-warn-color,#ffa000);--ir-alert:var(--appliance-alert-color,#db4437);--ir-cold:var(--appliance-cold-color,#2b9af9)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap;max-width:60%;overflow:hidden;text-overflow:ellipsis}
.watering .badge{background:color-mix(in srgb,var(--ir-cold) 22%,transparent);color:var(--ir-cold)}
.rain .badge{background:color-mix(in srgb,var(--ir-warn) 24%,transparent);color:var(--ir-warn)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(250px * var(--illus-scale,1));width:calc(250px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--ir-warn)}
.zones{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:6px;margin-top:8px}
.zones:empty{display:none}
.zb{display:flex;align-items:center;justify-content:center;gap:5px;min-width:0;padding:7px 6px;border:0;border-radius:12px;cursor:pointer;font:inherit;font-size:12px;font-weight:500;
  background:var(--ac-tile-bg,rgba(127,127,127,.12));color:var(--primary-text-color)}
.zb span{min-width:0;overflow:hidden;text-align:center;line-height:1.15;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.zb ha-icon{--mdc-icon-size:17px;flex:none}
.zb.on{background:color-mix(in srgb,var(--ir-cold) 28%,transparent);color:var(--ir-cold)}
.zb.stop.on{background:color-mix(in srgb,var(--ir-alert) 24%,transparent);color:var(--ir-alert)}
.zb:disabled{opacity:.4;cursor:default}
/* ---- image perso (option image) : la photo ou le plan remplace le dessin, les vannes sont posées dessus (x / y en %) ---- */
.map{position:relative;flex:1 1 100%;width:calc(100% * min(1,var(--illus-scale,1)));max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;cursor:pointer;line-height:0}
.map img{display:block;width:100%;height:auto}
.zb.mk{position:absolute;transform:translate(-50%,-50%);flex-direction:column;gap:1px;padding:5px;min-width:32px;min-height:32px;border-radius:50%;line-height:1.1;
  background:rgba(20,24,30,.62);color:#fff;backdrop-filter:blur(2px);box-shadow:0 1px 4px rgba(0,0,0,.45)}
.zb.mk.lbl{border-radius:12px;padding:4px 7px}
.zb.mk span{font-size:10px;max-width:84px}.zb.mk:not(.lbl) span{display:none}
.zb.mk ha-icon{--mdc-icon-size:20px;display:inline-flex;width:20px;height:20px}
.zb.mk.on{background:color-mix(in srgb,var(--ir-cold) 78%,#000);color:#fff;box-shadow:0 0 0 3px color-mix(in srgb,var(--ir-cold) 40%,transparent),0 0 12px var(--ir-cold)}
.noanim .zb.mk.on{box-shadow:0 0 0 3px color-mix(in srgb,var(--ir-cold) 40%,transparent)}
.zb.mk.on ha-icon{animation:irpulse 1.4s ease-in-out infinite}@keyframes irpulse{50%{transform:scale(1.18)}}
.compact .map{flex:1 1 0;min-width:0}
/* ---- illustration ---- */
.spr{opacity:0}.spr.on{opacity:1}
.arc{fill:none;stroke:#5fb8ff;stroke-width:2;stroke-linecap:round;stroke-dasharray:3 6}
.on .arc,.spr.on .arc{animation:irsp 1s linear infinite}
.arc.b{animation-duration:1.4s!important;opacity:.75}
@keyframes irsp{to{stroke-dashoffset:-18}}
.lawn.wet{filter:saturate(1.25) brightness(.95)}
.cloud{opacity:0;transition:opacity .6s}.rain .cloud{opacity:1}
.rd{fill:#7fb6ff;opacity:0}.rain .rd{opacity:.9;animation:irfall 1.1s linear infinite}
.rd:nth-child(2){animation-delay:-.3s!important}.rd:nth-child(3){animation-delay:-.6s!important}.rd:nth-child(4){animation-delay:-.9s!important}
@keyframes irfall{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(32px);opacity:0}}
.pled{fill:#9aa3ad}.pump-on .pled{fill:#43d17a;animation:irblink 1s steps(2) infinite}
@keyframes irblink{50%{opacity:.35}}
.sun{opacity:.95;transition:opacity .6s}.rain .sun,.watering .sun{opacity:.2}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
/* ---- compact ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact .zones{margin-top:4px;gap:4px}.compact .zb{padding:4px;font-size:11px}
`;

  const TILES = [['flow', 'mdi:water-pump', 'show_flow'], ['soil', 'mdi:water-percent', 'show_soil'], ['today', 'mdi:calendar-today', 'show_today'],
    ['next', 'mdi:calendar-clock', 'show_next'], ['pressure', 'mdi:gauge', 'show_pressure'], ['pump', 'mdi:pump', 'show_pump'], ['power', 'mdi:flash', 'show_power'], ['rain', 'mdi:weather-rainy', 'show_rain']];

  // Liste de zones : ['valve.x', {entity, name, icon, x, y}, …] ou « a, b, c » → [{id, name}]
  const parseZones = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((z) => {
    const o = typeof z === 'string' ? { entity: z.trim() } : z || {};
    const pct = (v) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(n) ? Math.max(0, Math.min(100, n)) : null; };
    const x = pct(o.x), y = pct(o.y); // position sur l'image perso, en % depuis le coin haut-gauche
    return o.entity ? { id: String(o.entity), name: o.name || '', icon: o.icon || '', x: x != null && y != null ? x : null, y: x != null && y != null ? y : null } : null;
  }).filter(Boolean).slice(0, 8);

  class ApplianceIrrigationCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { zones: ids.filter((i) => /^valve\./.test(i)).slice(0, 4) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_flow: true, show_soil: true, show_today: true, show_next: true, show_pressure: true, show_pump: true, show_power: true, show_rain: true, show_buttons: true, ...c };
      this._zones = parseZones(this._c.zones);
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _on(id) { const s = this._st(id); return !!s && ON_RE.test(String(s.state)); }
    _dom(id) { return String(id).split('.')[0]; }
    _name(z) { const s = this._st(z.id); return z.name || (s && s.attributes && s.attributes.friendly_name) || z.id; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // marche / arrêt d'une entité : valve (open_valve / close_valve), switch / input_boolean / autre (turn_on / turn_off)
    _set(id, on) {
      const d = this._dom(id);
      if (d === 'valve') this._hass.callService('valve', on ? 'open_valve' : 'close_valve', { entity_id: id });
      else this._hass.callService(['switch', 'input_boolean', 'light', 'fan'].includes(d) ? d : 'homeassistant', on ? 'turn_on' : 'turn_off', { entity_id: id });
    }

    // Repères : 250 × 150. Une tête d'arrosage par zone, régulièrement espacées sur la pelouse.
    _svg(label) {
      const n = Math.max(1, this._zones.length), heads = [];
      for (let i = 0; i < n; i++) {
        const x = n === 1 ? 125 : 52 + (i * (196 - 52)) / (n - 1);
        heads.push(`<g class="spr" data-z="${i}"><path class="arc" d="M${x} 106 Q${x - 16} 80 ${x - 30} 112"/><path class="arc" d="M${x} 106 Q${x + 16} 80 ${x + 30} 112"/>
          <path class="arc b" d="M${x} 106 Q${x - 7} 84 ${x - 14} 112"/><path class="arc b" d="M${x} 106 Q${x + 7} 84 ${x + 14} 112"/></g>
          <rect x="${x - 2}" y="104" width="4" height="12" rx="1.5" fill="#6b7480"/><rect x="${x - 4}" y="102" width="8" height="4" rx="2" fill="#2b2f36"/>`);
      }
      return `<svg viewBox="0 0 250 150" role="img" aria-label="${label}"><defs>
        <linearGradient id="irg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec850"/><stop offset="1" stop-color="#4f9a34"/></linearGradient>
        <linearGradient id="irs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient></defs>
        <rect x="0" y="0" width="250" height="108" rx="10" fill="url(#irs)" opacity=".55"/>
        <g class="sun"><circle cx="214" cy="26" r="13" fill="#ffd54f"/><g stroke="#ffd54f" stroke-width="2" stroke-linecap="round"><path d="M214 5v5M214 42v5M193 26h5M230 26h5M199 11l3 3M226 38l3 3M229 11l-3 3M202 38l-3 3"/></g></g>
        <path class="lawn" d="M0 100 Q60 90 125 98 T250 96 V140 a10 10 0 0 1-10 10 H10 a10 10 0 0 1-10-10Z" fill="url(#irg)"/>
        <g class="cloud"><ellipse cx="96" cy="30" rx="30" ry="14" fill="#8e9aa8"/><ellipse cx="120" cy="24" rx="24" ry="14" fill="#9fabb8"/><ellipse cx="74" cy="34" rx="18" ry="10" fill="#8e9aa8"/>
          <g><circle class="rd" cx="84" cy="52" r="2"/><circle class="rd" cx="100" cy="50" r="2"/><circle class="rd" cx="116" cy="52" r="2"/><circle class="rd" cx="130" cy="50" r="2"/></g></g>
        ${heads.join('')}
        <g class="pump"><rect x="6" y="116" width="30" height="24" rx="5" fill="#cfd6dd" stroke="#9aa3ad"/><circle cx="21" cy="128" r="6" fill="#5b6672"/><circle class="pled" cx="31" cy="120" r="2"/></g>
      </svg>`;
    }

    // Image perso : <img> en fond, une pastille cliquable par zone qui a x / y (en % de l'image). Les autres zones restent en boutons dessous.
    _map(label) {
      const e = (v) => String(v).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
      const mk = this._zones.map((z, i) => (z.x == null ? '' : `<button class="zb mk${this._c.marker_names === true ? ' lbl' : ''}" data-b="z${i}" data-id="${e(z.id)}" style="left:${z.x}%;top:${z.y}%"><ha-icon icon="${e(z.icon || (this._dom(z.id) === 'valve' ? 'mdi:valve' : 'mdi:sprinkler-variant'))}"></ha-icon><span></span></button>`)).join('');
      return `<div class="map" role="img" aria-label="${e(label)}"><img src="${e(this._c.image)}" alt="" loading="lazy">${mk}</div>`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="irtitle"></div><div class="badge" id="irbadge"></div></div>
        <div class="body">${this._c.image ? this._map((this._c.name || this._t('name')).replace(/"/g, '')) : this._svg((this._c.name || this._t('name')).replace(/"/g, ''))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div><div class="zones" id="irzones"></div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg, .map'), () => this._more((this._zones[0] || {}).id || this._c.entity_pump));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow, soil: c.entity_soil, today: c.entity_today, next: c.entity_next, pressure: c.entity_pressure, pump: c.entity_pump, power: c.entity_power, rain: c.entity_rain }[el.dataset.k]);
      }));
      // boutons : un par zone, arrêt général, arrosage auto (interrupteur maître) — reconstruits seulement quand la config change
      const zb = root.getElementById('irzones');
      const btn = (key, icon, id) => `<button class="zb" data-b="${key}"${id ? ` data-id="${id}"` : ''}><ha-icon icon="${icon}"></ha-icon><span></span></button>`;
      zb.innerHTML = this._c.show_buttons === false ? '' :
        this._zones.map((z, i) => (this._c.image && z.x != null ? '' : btn('z' + i, z.icon || (this._dom(z.id) === 'valve' ? 'mdi:valve' : 'mdi:sprinkler-variant'), z.id))).join('')
        + (this._zones.length > 1 ? btn('stop', 'mdi:stop', '').replace('class="zb"', 'class="zb stop"') : '')
        + (this._c.entity_master ? btn('master', 'mdi:calendar-check', this._c.entity_master) : '');
      // boutons du bas et pastilles de l'image : même comportement (stopPropagation : pas d'action tap_action de l'image)
      root.querySelectorAll('.zb').forEach((b) => b.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const k = b.dataset.b;
        if (k === 'stop') { this._zones.forEach((z) => this._on(z.id) && this._set(z.id, false)); return; }
        if (k === 'master') { this._set(this._c.entity_master, !this._on(this._c.entity_master)); return; }
        const z = this._zones[Number(k.slice(1))]; if (z) this._set(z.id, !this._on(z.id));
      }));
      root.querySelectorAll('.zb.mk').forEach((b) => b.addEventListener('pointerdown', (ev) => ev.stopPropagation()));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, zs = this._zones;
      const rainSt = this._st(c.entity_rain), rainRaw = rainSt ? String(rainSt.state) : '';
      const rain = !!rainSt && (RAIN_RE.test(rainRaw) || (isFinite(parseFloat(rainRaw)) && parseFloat(rainRaw) > 0 && /^sensor\./.test(c.entity_rain) && !/%|lx|°|°c/i.test(this._unit(c.entity_rain, ''))));
      const known = [...zs.map((z) => z.id), c.entity_pump, c.entity_flow, c.entity_soil, c.entity_rain].some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      const active = zs.filter((z) => this._on(z.id));
      const flow = this._num(c.entity_flow);
      const pump = this._on(c.entity_pump);
      const watering = active.length > 0 || (!zs.length && (pump || (!isNaN(flow) && flow > 0.05)));
      const phase = !known ? 'unavailable' : watering ? 'watering' : rain ? 'rain' : 'idle';
      return { phase, active, rain, pump, flow };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { phase, active, rain, pump, flow } = this._compute();
      card.className = `${phase}${rain ? ' rain' : ''}${pump ? ' pump-on' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      r.getElementById('irtitle').textContent = c.name || this._t('name');
      r.getElementById('irbadge').textContent = phase === 'watering'
        ? (active.length === 1 ? this._name(active[0]) : active.length > 1 ? `${active.length} ${this._t('zones')}` : this._t('watering'))
        : this._t(rain && phase !== 'unavailable' ? 'rain' : phase);
      // têtes d'arrosage : celles des zones ouvertes projettent l'eau
      r.querySelectorAll('.spr').forEach((el) => el.classList.toggle('on', this._zones[Number(el.dataset.z)] ? this._on(this._zones[Number(el.dataset.z)].id) : false));
      const lawn = r.querySelector('.lawn'); if (lawn) lawn.classList.toggle('wet', phase === 'watering');
      // boutons
      const blocked = c.block_on_rain === true && rain;
      r.querySelectorAll('.zb').forEach((b) => {
        const k = b.dataset.b, span = b.querySelector('span'), st = this._st(b.dataset.id);
        if (k === 'stop') { span.textContent = this._t('stop'); b.classList.toggle('on', active.length > 0); b.disabled = !active.length; return; }
        if (k === 'master') { const on = this._on(c.entity_master); span.textContent = this._t('auto'); b.classList.toggle('on', on); b.disabled = !st || st.state === 'unavailable'; return; }
        const z = this._zones[Number(k.slice(1))], on = this._on(z.id);
        span.textContent = this._name(z); b.title = this._name(z); b.classList.toggle('on', on);
        b.disabled = !st || st.state === 'unavailable' || (blocked && !on);
        if (blocked && !on) b.title = this._t('blocked');
      });
      // tuiles
      const fu = this._unit(c.entity_flow, 'L/min'), tu = this._unit(c.entity_today, 'L');
      let next = null;
      const ns = this._st(c.entity_next);
      if (ns && !/^(unavailable|unknown|none)$/i.test(ns.state)) {
        const d = new Date(ns.state);
        next = ns.attributes && ns.attributes.device_class === 'timestamp' || (!isNaN(d) && /\d{4}-\d{2}-\d{2}|T\d/.test(ns.state))
          ? d.toLocaleString(window.applianceLocale(c, this._hass, true), { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : String(ns.state);
      }
      const ps = this._st(c.entity_pump);
      const V = {
        flow: [c.entity_flow, this._fmt(flow, 1), fu],
        soil: [c.entity_soil, this._fmt(this._num(c.entity_soil), 0), this._unit(c.entity_soil, '%')],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 0), tu],
        next: [next != null && c.entity_next, next, ''],
        pressure: [c.entity_pressure, this._fmt(this._num(c.entity_pressure), 1), this._unit(c.entity_pressure, 'bar')],
        pump: [ps && c.entity_pump, this._t(pump ? 'on' : 'off'), ''],
        power: [c.entity_power, this._fmt(this._num(c.entity_power), 0), this._unit(c.entity_power, 'W')],
        rain: [c.entity_rain, this._t(rain ? 'rain' : 'dry'), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'rain' && rain);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceIrrigationCard);

  /* ---- éditeur visuel ---- */
  class ApplianceIrrigationCardEditor extends HTMLElement {
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
        // zones : liste d'objets {entity, name, icon, x, y} (HA ≥ 2024.12) ; une ancienne version de HA affiche le YAML. x / y : position sur l'image perso, en %
        { name: 'zones', selector: { object: { multiple: true, label_field: 'entity', fields: {
          entity: { label: window.applianceEditorLabel('zone_entity', this._hass), required: true, selector: { entity: { domain: ['valve', 'switch', 'input_boolean'] } } },
          name: { label: window.applianceEditorLabel('zone_name', this._hass), selector: { text: {} } },
          icon: { label: window.applianceEditorLabel('zone_icon', this._hass), selector: { icon: {} } },
          x: { label: window.applianceEditorLabel('zone_x', this._hass), selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
          y: { label: window.applianceEditorLabel('zone_y', this._hass), selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        } } } },
        { name: 'image', selector: { text: {} } }, bool('marker_names', false),
        ent('entity_pump', ['switch', 'input_boolean', 'binary_sensor']), ent('entity_master', ['switch', 'input_boolean']),
        ent('entity_rain', ['binary_sensor', 'sensor', 'input_boolean']), bool('block_on_rain', false),
        ent('entity_flow', 'sensor'), ent('entity_soil', 'sensor'), ent('entity_today', 'sensor'), ent('entity_next', ['sensor', 'input_datetime']),
        ent('entity_pressure', 'sensor'), ent('entity_power', 'sensor'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_buttons'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceIrrigationCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Arrosage du jardin : zones (électrovannes), pompe de puits, pluie, humidité du sol, arrêt général.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/irrigation.md',
  });
})();
