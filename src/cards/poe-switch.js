/* Carte « Switch PoE » — custom:appliance-poe-switch-card
 * Switchs PoE gérés dans le cloud (SSCPOE / Steamemo : GPS208, GPS204V, GPS105S…) : face avant dessinée en SVG avec ses ports
 * (LED de liaison verte qui clignote avec le trafic, LED PoE orange qui respire quand le port alimente un appareil).
 * Une seule option `prefix` (ex. gps208xxxx_arubg3l) retrouve toutes les entités : switch.<prefix>_<n>_poe / _extend,
 * sensor.<prefix>_<n>_link / _power / _rx / _tx, ports LAN <prefix>_lan<n>_*, <prefix>_total_power et <prefix>_voltage.
 * Un clic sur un port le sélectionne : détail (liaison, PoE, puissance, débits) et boutons PoE / Extend (confirmation avant de couper le PoE).
 */
(() => {
  const TAG = 'appliance-poe-switch-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n poe_switch*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  // modèles : nombre de ports PoE et de ports LAN (liaison montante)
  const MODELS = { gps208: { poe: 8, lan: 2, label: 'GPS208' }, gps204v: { poe: 4, lan: 2, label: 'GPS204V' }, gps105s: { poe: 4, lan: 1, label: 'GPS105S' } };
  const DOWN_RE = /^(off|down|false|no|0|none|disconnected|unplugged|no.?link|nolink|unavailable|unknown|)$/i;

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--ps-ok:var(--appliance-ok-color,#43a047);--ps-warn:var(--appliance-warn-color,#ffa000);--ps-alert:var(--appliance-alert-color,#db4437)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--ps-ok) 20%,transparent);color:var(--ps-ok)}
.unavailable .badge{background:color-mix(in srgb,var(--ps-alert) 20%,transparent);color:var(--ps-alert)}
svg{display:block;width:100%;max-width:calc(560px * var(--illus-scale,1));height:auto;margin:6px auto 0;overflow:visible}
.port{cursor:pointer}
.sock{fill:#15181c;stroke:#5b636c;stroke-width:1}.lan .sock{stroke:#7a8cff}
.pin{fill:#c9a24a}
.led{fill:#2b3138;transition:fill .3s}
.up .ll{fill:#3ddc6a;filter:drop-shadow(0 0 2px #3ddc6a)}
.up.traf .ll{animation:psblink var(--tr,1s) steps(1) infinite}
.poe .pl{fill:#7a5a1a}
.act .pl{fill:#ffb300;filter:drop-shadow(0 0 3px #ffb300);animation:psbreath 2.4s ease-in-out infinite}
.num{font:600 7.5px/1 sans-serif;fill:#aeb7c0;text-anchor:middle}
.sel .sock{stroke:var(--primary-color,#03a9f4);stroke-width:2}
.sel .selr{opacity:1}.selr{opacity:0;fill:none;stroke:var(--primary-color,#03a9f4);stroke-width:1.2;stroke-dasharray:3 2}
.dim{opacity:.35}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
@keyframes psblink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes psbreath{50%{opacity:.45}}
.noanim *{animation:none!important}
.detail{margin-top:8px;padding:8px 10px;border-radius:12px;background:var(--ac-tile-bg,rgba(127,127,127,.09));font-size:12px;color:var(--primary-text-color)}
.detail.hint{color:var(--secondary-text-color);text-align:center}
.detail .dh{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:600;font-size:13px}
.detail .dg{display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:4px 10px;margin-top:6px;color:var(--secondary-text-color)}
.detail .dg b{display:block;color:var(--primary-text-color);font-weight:600}
.detail .btns{display:flex;gap:6px;margin-top:8px}
.detail button{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.detail button.on{background:#ffb300;color:#2a2112}
.detail button.hide{display:none}.detail button ha-icon{--mdc-icon-size:16px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{margin-top:3px}.compact .tiles{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  const TILES = [['total', 'mdi:flash'], ['voltage', 'mdi:sine-wave'], ['poe', 'mdi:ethernet-cable'], ['links', 'mdi:lan-connect']];

  class ApplianceSwitchPoeCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), m = ids.map((i) => /^switch\.(.+?)_(?:1|lan1)_(?:poe|extend)$/.exec(i)).find(Boolean);
      return { model: 'gps208', prefix: m ? m[1] : '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'gps208', show_status: true, show_total: true, show_voltage: true, show_poe: true, show_links: true, ...c };
      this._model = MODELS[this._c.model] || MODELS.gps208;
      const p = String(this._c.prefix || '').trim().replace(/^(sensor|switch)\./, '').replace(/_+$/, '');
      this._p = p;
      // entités dérivées du préfixe : liste suivie par applianceChanged (le préfixe seul n'est pas un identifiant d'entité)
      this._ports = [];
      for (let i = 1; i <= this._model.poe; i++) this._ports.push(this._mk('poe', i, `${i}`));
      for (let i = 1; i <= this._model.lan; i++) this._ports.push(this._mk('lan', i, `lan${i}`));
      const all = this._ports.flatMap((o) => [o.link, o.rx, o.tx, o.ext, o.poe, o.pw]).filter(Boolean);
      this._tot = this._c.entity_total_power || (p ? `sensor.${p}_total_power` : '');
      this._volt = this._c.entity_voltage || (p ? `sensor.${p}_voltage` : '');
      this._watch = { ids: [...all, this._tot, this._volt].filter(Boolean) };
      this._sel = this._sel && this._ports.some((o) => o.key === this._sel) ? this._sel : '';
      this._built = false;
      if (this._hass) this._render();
    }
    // entités d'un port : PoE (1…n) ou LAN (lan1…)
    _mk(kind, n, tag) {
      const p = this._p, e = (d, s) => (p ? `${d}.${p}_${tag}_${s}` : '');
      return { kind, n, key: `${kind}${n}`, link: e('sensor', 'link'), rx: e('sensor', 'rx'), tx: e('sensor', 'tx'), ext: e('switch', 'extend'),
        poe: kind === 'poe' ? e('switch', 'poe') : '', pw: kind === 'poe' ? e('sensor', 'power') : '' };
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._watch); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 4; }
    getGridOptions() { return { columns: 12, min_columns: 4, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _on(id) { const s = this._st(id); return this._ok(s) && /^(on|true|1)$/i.test(String(s.state).trim()); }
    _more(id) { window.applianceMore(this, id); }

    // face avant : n ports PoE, un espace, puis les ports LAN. Repères : largeur variable × 100.
    _svg() {
      const m = this._model, W = 40, M = 18, gap = 16, w = M * 2 + m.poe * W + gap + m.lan * W;
      const cell = (o, i, x) => `<g class="port ${o.kind}" data-k="${o.key}" transform="translate(${x} 0)">
        <rect class="selr" x="1" y="26" width="${W - 2}" height="58" rx="5"/>
        <circle class="led ll" cx="12" cy="36" r="2.4"/>${o.kind === 'poe' ? '<circle class="led pl" cx="28" cy="36" r="2.4"/>' : ''}
        <rect class="sock" x="7" y="44" width="26" height="22" rx="3"/><path class="pin" d="M11 47h18v2H11z"/><path class="pin" d="M12 56h16v1.6H12zM12 60h16v1.6H12z" opacity=".7"/>
        <text class="num" x="20" y="79">${o.kind === 'lan' ? 'LAN' + o.n : o.n}</text><rect x="0" y="22" width="${W}" height="64" fill="transparent"/></g>`;
      let x = M, out = '';
      this._ports.forEach((o, i) => { if (o.kind === 'lan' && o.n === 1) x += gap; out += cell(o, i, x); x += W; });
      return `<svg viewBox="0 0 ${w} 100" role="img" aria-label="${esc(this._c.name || this._t('name'))}">
        <rect x="2" y="6" width="${w - 4}" height="90" rx="9" fill="#2a2f36" stroke="#4a525b" stroke-width="1.5"/>
        <rect x="2" y="6" width="${w - 4}" height="14" rx="9" fill="#39404a"/><rect x="2" y="14" width="${w - 4}" height="6" fill="#39404a"/>
        <text x="${M}" y="16.5" font-family="sans-serif" font-size="8" font-weight="700" fill="#cfd6dd" letter-spacing=".6">PoE SWITCH · ${m.label}</text>
        <circle cx="${w - 16}" cy="13" r="2.4" class="led pwr" fill="#3ddc6a"/>
        <text x="${M + m.poe * W + gap / 2 + 0.5}" y="94" class="num" style="font-size:6.5px;opacity:.8">${esc(this._t('uplink'))}</text>
        ${out}</svg>`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="pstitle"></div><div class="badge" id="psbadge"></div></div>
        ${this._svg()}
        <div class="detail hint" id="psdetail"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelectorAll('.port').forEach((g) => g.addEventListener('click', () => {
        this._sel = this._sel === g.dataset.k ? '' : g.dataset.k;
        this._render();
      }));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more({ total: this._tot, voltage: this._volt }[el.dataset.k])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // liaison : texte d'état, vitesse numérique (Mbit/s) → « 1 G », sinon l'état tel quel
    _link(o) {
      const s = this._st(o.link);
      if (!this._ok(s)) return { up: false, txt: '--' };
      const raw = String(s.state).trim(), n = parseFloat(raw.replace(',', '.'));
      if (isFinite(n) && /^[\d.,]+$/.test(raw)) return { up: n > 0, txt: n <= 0 ? this._t('down') : n >= 1000 ? `${this._fmt(n / 1000, 1)} G` : `${this._fmt(n)} M` };
      const up = !DOWN_RE.test(raw);
      return { up, txt: /^(on|up|true|connected|link)$/i.test(raw) ? this._t('up') : /^(off|down|false)$/i.test(raw) ? this._t('down') : raw };
    }
    _traffic(o) { const a = this._num(o.rx), b = this._num(o.tx); return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b); }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const known = this._watch.ids.some((i) => this._ok(this._st(i)));
      let up = 0, poeOn = 0;
      this._ports.forEach((o) => {
        const g = r.querySelector(`.port[data-k="${o.key}"]`); if (!g) return;
        const l = this._link(o), pw = this._num(o.pw), poe = o.poe ? this._on(o.poe) : false, act = poe && (isNaN(pw) ? l.up : pw > 0.05), tr = this._traffic(o);
        if (l.up) up++; if (poe) poeOn++;
        g.classList.toggle('up', l.up); g.classList.toggle('poe', poe); g.classList.toggle('act', act); g.classList.toggle('traf', l.up && tr > 0);
        g.classList.toggle('sel', this._sel === o.key);
        g.style.setProperty('--tr', `${Math.max(.15, Math.min(1.4, 1.4 - Math.log10(1 + tr) * .45)).toFixed(2)}s`);
        g.classList.toggle('dim', !known);
      });
      card.className = `${known ? 'online' : 'unavailable'}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      r.getElementById('pstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('psbadge'); badge.textContent = known ? `${up}/${this._ports.length} ${this._t('up').toLowerCase()}` : this._t('unavailable'); badge.style.display = c.show_status === false ? 'none' : '';
      this._detail(r.getElementById('psdetail'));
      const tot = this._num(this._tot), vol = this._num(this._volt);
      const V = {
        total: [this._tot, this._fmt(tot, tot < 10 ? 1 : 0), this._unit(this._tot, 'W'), 'show_total'],
        voltage: [this._volt, this._fmt(vol, 1), this._unit(this._volt, 'V'), 'show_voltage'],
        poe: [this._model.poe && this._p, `${poeOn}/${this._model.poe}`, '', 'show_poe'],
        links: [this._p, `${up}/${this._ports.length}`, '', 'show_links'],
      };
      r.querySelectorAll('.tile').forEach((el) => {
        const [id, val, unit, opt] = V[el.dataset.k];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(el.dataset.k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }

    // détail du port sélectionné : liaison, PoE, puissance, débits, boutons PoE / Extend
    _detail(box) {
      const o = this._ports.find((p) => p.key === this._sel);
      if (!o) { box.className = 'detail hint'; box.textContent = this._t('hint'); return; }
      const l = this._link(o), pw = this._num(o.pw), rx = this._num(o.rx), tx = this._num(o.tx), poe = o.poe ? this._on(o.poe) : false, ext = o.ext ? this._on(o.ext) : false;
      const name = o.kind === 'lan' ? `LAN ${o.n}` : `${this._t('port')} ${o.n}`;
      box.className = 'detail';
      box.innerHTML = `<div class="dh"><span>${esc(name)}</span><span>${esc(l.txt)}</span></div>
        <div class="dg">${o.kind === 'poe' ? `<div>PoE<b>${esc(this._t(poe ? 'on' : 'off'))}</b></div><div>${esc(this._t('power'))}<b>${this._fmt(pw, pw < 10 ? 1 : 0)} ${esc(this._unit(o.pw, 'W'))}</b></div>` : ''}
          <div>↓ rx<b>${this._fmt(rx, 1)} ${esc(this._unit(o.rx, ''))}</b></div><div>↑ tx<b>${this._fmt(tx, 1)} ${esc(this._unit(o.tx, ''))}</b></div></div>
        <div class="btns"><button id="bpoe" class="${poe ? 'on' : ''}${o.poe && this._st(o.poe) ? '' : ' hide'}"><ha-icon icon="mdi:flash"></ha-icon>PoE ${esc(this._t(poe ? 'on' : 'off'))}</button>
          <button id="bext" class="${ext ? 'on' : ''}${o.ext && this._st(o.ext) ? '' : ' hide'}"><ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>${esc(this._t('extend'))} ${esc(this._t(ext ? 'on' : 'off'))}</button></div>`;
      const sw = (id, ask) => () => {
        const on = this._on(id);
        if (ask && on && !window.confirm(this._t('confirm_off').replace('{port}', name))) return;
        this._hass.callService('switch', on ? 'turn_off' : 'turn_on', { entity_id: id });
      };
      if (o.poe) box.querySelector('#bpoe').addEventListener('click', sw(o.poe, true));
      if (o.ext) box.querySelector('#bext').addEventListener('click', sw(o.ext, false));
    }
  }
  customElements.define(TAG, ApplianceSwitchPoeCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSwitchPoeCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        { name: 'model', default: 'gps208', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: `${m.label} (${m.poe} PoE + ${m.lan} LAN)` })) } } },
        { name: 'prefix', selector: { text: {} } },
        { name: 'entity_total_power', selector: { entity: { domain: 'sensor' } } }, { name: 'entity_voltage', selector: { entity: { domain: 'sensor' } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('animations'), bool('show_total'), bool('show_voltage'), bool('show_poe'), bool('show_links')] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass); return T[l][`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  customElements.define(TAG + '-editor', ApplianceSwitchPoeCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Switch PoE (SSCPOE / Steamemo GPS208, GPS204V, GPS105S) : face avant avec ports, LED de liaison et PoE, puissance, débits ; un clic sur un port le détaille et pilote son PoE.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/poe-switch.md',
  });
})();
