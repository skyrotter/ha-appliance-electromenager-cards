/* Carte « Clavier d'alarme » — custom:appliance-alarm-keypad-card
 * Clavier tactile blanc (écran, cadenas, pavé numérique, touches de navigation et de fonction) qui affiche l'état de l'alarme.
 * Entité d'état : capteur texte (non actif, tempo entrée, tempo sortie, actif, actif partiel, prêt, intrusion, en anglais ou en français)
 * ou alarm_control_panel (disarmed, armed_home, armed_away, arming, pending, triggered…). L'écran du clavier n'affiche que le statut
 * et le nombre de zones ouvertes. Facultatifs : compteurs de zones ouvertes / en défaut, et jusqu'à 8 zones { name, entity, entity_fault }
 * (binary_sensor) affichées en pastilles : ouverte = orange, en défaut = rouge.
 * Lecture seule : un appui ouvre la fiche de l'entité d'état. Le dessin est entièrement vectoriel (aucune image).
 */
(() => {
  const TAG = 'appliance-alarm-keypad-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n alarm_keypad*/{};

  const CSS = `
:host{display:block;height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--ak-ok:var(--appliance-ok-color,#43a047);--ak-warn:var(--appliance-warn-color,#ffa000);--ak-alert:var(--appliance-alert-color,#e53935);--ak-cold:var(--appliance-cold-color,#4a90d9);--ak-c:var(--ak-ok)}
ha-card.armed{--ak-c:var(--ak-cold)}ha-card.armed_partial,ha-card.entry_delay,ha-card.exit_delay{--ak-c:var(--ak-warn)}ha-card.intrusion{--ak-c:var(--ak-alert)}ha-card.unavailable,ha-card.unknown{--ak-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--ak-c) 22%,transparent);color:var(--ak-c)}
svg{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:8px auto 0;cursor:pointer;overflow:visible}
.zones{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:8px}.zones:empty{display:none}
.zone{display:flex;align-items:center;gap:4px;font-size:11px;padding:3px 9px;border-radius:12px;background:var(--ac-tile-bg,rgba(127,127,127,.09));color:var(--secondary-text-color);cursor:pointer}
.zone ha-icon{--mdc-icon-size:13px}.zone.open{color:var(--ak-warn);background:color-mix(in srgb,var(--ak-warn) 18%,transparent)}.zone.fault{color:var(--ak-alert);background:color-mix(in srgb,var(--ak-alert) 18%,transparent)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile.hide{display:none}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile.warn .v{color:var(--ak-warn)}.tile.bad .v{color:var(--ak-alert)}
/* ---- illustration ---- */
.scr-t{font:600 13px/1 system-ui,sans-serif;fill:var(--ak-c)}.scr-s{font:500 9.5px/1 system-ui,sans-serif;fill:#5b6570}
.lk-on{opacity:.25}.lk-off{opacity:.25}
.armed .lk-on,.armed_partial .lk-on,.exit_delay .lk-on,.entry_delay .lk-on,.intrusion .lk-on,.disarmed .lk-off,.ready .lk-off{opacity:1}
.armed_partial .lk-off,.exit_delay .lk-off{opacity:.25}
.glow{fill:var(--ak-c);opacity:0}.intrusion .glow{animation:akp 1s ease-in-out infinite}.entry_delay .glow,.exit_delay .glow{animation:akp 1.6s ease-in-out infinite}
.armed .glow,.armed_partial .glow{opacity:.1}
.key{pointer-events:none}.live .key{cursor:pointer;pointer-events:all}.key rect.hit{fill:transparent}.live .key:active rect.hit{fill:rgba(127,127,127,.2)}
.scr-t.err{fill:var(--ak-alert)}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
@keyframes akp{0%,100%{opacity:.04}50%{opacity:.32}}
`;

  // ---- dessin du clavier (viewBox 200 × 280) ----
  const KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['×', ''], ['0', ''], ['↵', '']];
  const SVG = () => {
    let k = '';
    KEYS.forEach(([n, l], i) => {
      const x = 50 + (i % 3) * 50, y = 138 + Math.floor(i / 3) * 28;
      k += `<g class="key" data-k="${n === '×' ? 'clear' : n === '↵' ? 'enter' : n}"><rect class="hit" x="${x - 22}" y="${y - 20}" width="44" height="27" rx="6"/>`
        + `<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#3a4450">${n}</text>`
        + (l ? `<text x="${x}" y="${y + 8}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="5.5" fill="#8a929a">${l}</text>` : '') + '</g>';
    });
    const nav = [['M-4 0h8M-1.5-3L-4 0l2.5 3', 56], ['M0 4v-8M-3-1.5L0-4l3 2.5', 90], ['M0-4v8M-3 1.5L0 4l3-2.5', 124], ['M-4 0h8M1.5-3L4 0l-2.5 3', 158]]
      .map(([d, x]) => `<circle cx="${x - 6}" cy="244" r="10" fill="#1f2a36"/><path d="${d}" transform="translate(${x - 6} 244)" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
    const fn = ['Stay', 'Force', 'Memory', 'Bypass'].map((t, i) => `<text x="${34 + i * 44}" y="276" text-anchor="middle" font-family="system-ui,sans-serif" font-size="6" fill="#4a5560">${t}</text>`).join('');
    return `<defs><linearGradient id="akbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e9ec"/></linearGradient></defs>
      <g id="akbg"><rect x="4" y="2" width="192" height="276" rx="16" fill="url(#akbody)" stroke="#cfd4d9" stroke-width="2"/>
      <rect x="14" y="12" width="172" height="76" rx="3" fill="#fff" stroke="#e2e5e8"/>
      <rect class="glow" x="14" y="12" width="172" height="76" rx="3"/>
      <text class="scr-t" id="aktitle" x="100" y="44" text-anchor="middle"></text><text class="scr-s" id="aksub" x="100" y="64" text-anchor="middle"></text></g>
      <g class="key" data-k="arm"><rect class="hit" x="30" y="90" width="42" height="26" rx="6"/><g class="lk-on"><rect x="43" y="100" width="14" height="11" rx="2" fill="#b3194d"/><path d="M46 100v-4a4 4 0 0 1 8 0v4" stroke="#b3194d" stroke-width="2.6" fill="none"/></g></g>
      <g class="key" data-k="disarm"><rect class="hit" x="79" y="90" width="42" height="26" rx="6"/><g class="lk-off"><rect x="93" y="100" width="14" height="11" rx="2" fill="#1fa64a"/><path d="M96 100v-4a4 4 0 0 1 8 0" stroke="#1fa64a" stroke-width="2.6" fill="none"/></g></g>
      <rect x="143" y="93" width="11" height="15" rx="2" fill="none" stroke="#7d8791" stroke-width="1.5"/><rect x="147" y="97" width="11" height="15" rx="2" fill="#fff" stroke="#7d8791" stroke-width="1.5"/>
      ${k}${nav}
      <rect x="10" y="252" width="180" height="24" rx="0" fill="#c9cdd2" opacity=".55"/>${fn}<g class="key" data-k="stay"><rect class="hit" x="12" y="252" width="44" height="26" rx="4"/></g>`;
  };

  // état de l'alarme → clé unique, d'après le texte du capteur ou l'état d'un alarm_control_panel
  const norm = (raw) => {
    const r = String(raw).toLowerCase().replace(/[_-]+/g, ' ').trim();
    if (/^(unavailable|unknown|none|)$/.test(r)) return r === 'unavailable' ? 'unavailable' : 'unknown';
    if (/intrusion|trigger|d[eé]clench|alarm$/.test(r)) return 'intrusion';
    if (/entry|entr[eé]e|pending/.test(r)) return 'entry_delay';
    if (/exit|sortie|arming/.test(r)) return 'exit_delay';
    if (/not armed|disarm|inactive|non actif|d[eé]sarm|^off$/.test(r)) return 'disarmed';
    if (/partial|partiel|home|night|nuit|vacation|custom|stay/.test(r)) return 'armed_partial';
    if (/armed|away|actif|^on$/.test(r)) return 'armed';
    if (/ready|pr[eê]t/.test(r)) return 'ready';
    return 'unknown';
  };

  const TILES = [['open', 'mdi:door-open', 'show_open'], ['fault', 'mdi:alert-circle-outline', 'show_fault']];

  class ApplianceAlarmKeypadCard extends HTMLElement {
    get _config() { return this._c; } // nom standard lu par card-mod
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => i.startsWith('alarm_control_panel.')) || ids.find((i) => /^sensor\..*alarm/.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object' || !c.entity) throw new Error('entity is required');
      this._c = { show_status: true, show_open: true, show_fault: true, show_zones: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(s) { return this._ok(s) && /^(on|open|detected|true)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // centrale pilotée : entity_control, sinon entity si c'est déjà une alarm_control_panel
    _ctl() { const c = this._c; return c.entity_control || (/^alarm_control_panel\./.test(c.entity) ? c.entity : ''); }
    // saisie du code sur le pavé : chiffres affichés masqués sur l'écran, effacés après 10 s d'inactivité ou après l'envoi
    _press(k) {
      const ctl = this._ctl(); if (!ctl || !this._hass) return;
      clearTimeout(this._tb); this._msg = '';
      if (/^\d$/.test(k)) { this._buf = ((this._buf || '') + k).slice(0, 8); }
      else if (k === 'clear') this._buf = '';
      else {
        const st = norm((this._st(this._c.entity) || {}).state), code = this._buf || undefined;
        const svc = k === 'arm' ? 'alarm_arm_away' : k === 'stay' ? 'alarm_arm_home' : k === 'disarm' ? 'alarm_disarm' : st === 'disarmed' || st === 'ready' ? 'alarm_arm_away' : 'alarm_disarm';
        this._buf = '';
        Promise.resolve(this._hass.callService('alarm_control_panel', svc, { entity_id: ctl, ...(code ? { code } : {}) }))
          .catch(() => { this._msg = this._t('code_error'); this._render(); this._tb = setTimeout(() => { this._msg = ''; this._render(); }, 3000); });
      }
      if (this._buf) this._tb = setTimeout(() => { this._buf = ''; this._render(); }, 10000);
      this._render();
    }
    disconnectedCallback() { clearTimeout(this._tb); }
    _zones() { return (Array.isArray(this._c.zones) ? this._c.zones : []).filter((z) => z && (z.entity || z.entity_fault)).slice(0, 8); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="aktt"></div><div class="badge" id="akbadge"></div></div>
        <svg viewBox="0 0 200 282" role="img" aria-label="${(this._c.name || this._t('name')).replace(/"/g, '')}">${SVG()}</svg>
        <div class="zones" id="akzones"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      // le fond du clavier ouvre la fiche de l'entité ; les touches (data-k) pilotent l'alarme quand une centrale est configurée
      window.applianceBindIllus(this, root.getElementById('akbg'), () => this._more(this._c.entity));
      root.querySelectorAll('.key').forEach((el) => el.addEventListener('click', () => this._press(el.dataset.k)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more({ open: this._c.entity_zones_open, fault: this._c.entity_zones_fault }[el.dataset.k] || this._c.entity)));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // nombre : capteur dédié s'il existe, sinon décompte des zones configurées
    _count(id, zones, key) {
      const s = this._st(id), v = this._ok(s) ? parseInt(String(s.state), 10) : NaN;
      if (isFinite(v)) return v;
      if (id) return null;
      return zones.length ? zones.filter((z) => this._on(this._st(z[key]))).length : null;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity), zones = this._zones();
      const st = norm(s ? s.state : 'unavailable'), nOpen = this._count(c.entity_zones_open, zones, 'entity'), nFault = this._count(c.entity_zones_fault, zones, 'entity_fault');
      card.className = `${st}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('aktt').textContent = c.name || this._t('name');
      const badge = r.getElementById('akbadge'); badge.textContent = this._l(st); badge.style.display = c.show_status === false ? 'none' : '';
      // écran du clavier : statut + nombre de zones ouvertes
      const ti = r.getElementById('aktitle'), sub = r.getElementById('aksub');
      card.classList.toggle('live', !!this._ctl());
      ti.classList.toggle('err', !!this._msg);
      ti.textContent = this._msg || (this._buf ? '•'.repeat(this._buf.length) : this._l(st));
      sub.textContent = this._msg || this._buf ? (this._buf ? this._t('enter_code') : '') : nOpen == null ? '' : `${nOpen} ${this._t(nOpen === 1 ? 'zone_open_one' : 'zone_open_many')}`;
      // pastilles de zones
      const zEl = r.getElementById('akzones'); zEl.replaceChildren();
      if (c.show_zones !== false) zones.forEach((z) => {
        const fault = this._on(this._st(z.entity_fault)), open = this._on(this._st(z.entity));
        const el = document.createElement('div'); el.className = `zone${fault ? ' fault' : open ? ' open' : ''}`;
        const ic = document.createElement('ha-icon'); ic.setAttribute('icon', fault ? 'mdi:alert-circle' : open ? 'mdi:door-open' : 'mdi:shield-check-outline');
        el.append(ic, z.name || z.entity || z.entity_fault);
        el.addEventListener('click', () => this._more(fault ? z.entity_fault : z.entity || z.entity_fault));
        zEl.appendChild(el);
      });
      const V = { open: [nOpen, nOpen > 0 ? 'warn' : ''], fault: [nFault, nFault > 0 ? 'bad' : ''] };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [v, cls] = V[k];
        el.classList.toggle('hide', v == null || c[opt] === false); el.classList.toggle('warn', cls === 'warn'); el.classList.toggle('bad', cls === 'bad');
        el.querySelector('.lbl').textContent = this._l(k === 'open' ? 'zones_open' : 'zones_fault'); el.querySelector('.v').textContent = v == null ? '' : String(v);
      });
    }
  }
  customElements.define(TAG, ApplianceAlarmKeypadCard);

  /* ---- éditeur visuel ---- */
  class ApplianceAlarmKeypadCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', required: true, selector: { entity: { domain: ['sensor', 'alarm_control_panel', 'input_select', 'select'] } } },
        { name: 'entity_control', selector: { entity: { domain: 'alarm_control_panel' } } },
        { name: 'entity_zones_open', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_zones_fault', selector: { entity: { domain: 'sensor' } } },
        { name: 'zones', selector: { object: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_open'), bool('show_fault'), bool('show_zones'), bool('animations')] },
      ];
      const tr = T[window.applianceLang(T, null, this._hass)] || {};
      this._form.computeLabel = (s) => tr['f_' + s.name] || T.en['f_' + s.name] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceAlarmKeypadCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Clavier d'alarme : statut (non actif, tempo entrée / sortie, actif, partiel, intrusion), nombre de zones ouvertes ou en défaut et pastilles par zone.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/alarm-keypad.md',
  });
})();
