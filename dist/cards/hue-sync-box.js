/* Carte « Hue Sync Box » — custom:appliance-hue-sync-box-card
 * Philips Hue Play HDMI Sync Box (intégration Hue de Home Assistant) : boîtier dessiné en SVG, 4 entrées HDMI
 * qui s'allument quand un appareil est branché, halo de lumière animé quand la synchronisation tourne.
 * Commandes : alimentation, synchronisation des lumières, luminosité (curseur), listes (espace de divertissement,
 * intensité, mode de synchronisation, sortie HDMI, voyant LED), Dolby Vision. Tuiles : état des 4 entrées HDMI.
 * Toutes les entités sont facultatives : seuls les contrôles configurés s'affichent.
 */
(() => {
  const TAG = 'appliance-hue-sync-box-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Hue Sync Box",
      "off": "Off",
      "on": "On",
      "syncing": "Syncing",
      "unavailable": "Unavailable",
      "btn_power": "Power",
      "btn_sync": "Light sync",
      "btn_dolby": "Dolby Vision",
      "area": "Entertainment area",
      "intensity": "Intensity",
      "mode": "Sync mode",
      "input": "HDMI input",
      "led": "LED indicator",
      "plugged": "Plugged",
      "unplugged": "Unplugged"
    },
    "fr": {
      "name": "Hue Sync Box",
      "off": "Éteint",
      "on": "Allumé",
      "syncing": "Synchronisation",
      "unavailable": "Indisponible",
      "btn_power": "Alimentation",
      "btn_sync": "Synchro lumières",
      "btn_dolby": "Dolby Vision",
      "area": "Espace de divertissement",
      "intensity": "Intensité",
      "mode": "Mode de synchronisation",
      "input": "Sortie HDMI",
      "led": "Voyant LED",
      "plugged": "Branché",
      "unplugged": "Débranché"
    }
  };

  const CSS = `
:host{display:block;height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--hs-ok:var(--appliance-ok-color,#43a047);--hs-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.on{--hs-c:#ffb300}ha-card.sync{--hs-c:#b36bff}
.on .badge,.sync .badge{background:color-mix(in srgb,var(--hs-c) 22%,transparent);color:var(--hs-c)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.hide{display:none!important}
.ctl button{flex:1 1 74px;max-width:150px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}.ctl button:hover{filter:brightness(1.12)}.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--hs-c) 28%,var(--secondary-background-color))}
.sels{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-top:8px}
.sel{display:flex;flex-direction:column;gap:2px;min-width:0;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:4px 7px}
.sel span{font-size:10px;line-height:14px;color:var(--secondary-text-color)}
.sel select{width:100%;border:0;background:transparent;color:var(--primary-text-color);font:600 13px/18px var(--paper-font-body1_-_font-family,Roboto,sans-serif);padding:0;cursor:pointer;text-overflow:ellipsis}
.sel select option{color:#000}
.bri{display:flex;align-items:center;gap:8px;margin-top:8px;padding:2px 4px}.bri ha-icon{--mdc-icon-size:18px;color:var(--secondary-text-color)}
.bri input{flex:1;min-width:0;accent-color:var(--hs-c)}.bri b{min-width:38px;text-align:right;font-size:13px;color:var(--primary-text-color)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color)}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:12px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile.plug .v{color:var(--hs-ok)}
/* ---- illustration ---- */
.hs-aura{opacity:0;transition:opacity .6s}.on .hs-aura{opacity:.35}.sync .hs-aura{opacity:.9;animation:hshue 6s linear infinite}
.hs-led{fill:#555;transition:fill .4s}.on .hs-led{fill:#fff;filter:drop-shadow(0 0 3px #fff)}.sync .hs-led{fill:#b36bff;filter:drop-shadow(0 0 4px #b36bff);animation:hsbeat 1.6s ease-in-out infinite}
.hs-logo{fill:#3a3f45;transition:fill .4s}.on .hs-logo{fill:#8a929a}.sync .hs-logo{fill:#d9b8ff}
.hs-port{fill:#0c0d0f;stroke:#4a4f55;stroke-width:1}.hs-port.plug{stroke:var(--hs-ok);fill:#12301a;filter:drop-shadow(0 0 2.5px var(--hs-ok))}
.hs-wave{fill:none;stroke:var(--hs-c);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.sync .hs-wave{animation:hswave 2.4s ease-out infinite}.hs-wave.w2{animation-delay:.8s}.hs-wave.w3{animation-delay:1.6s}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes hshue{to{filter:hue-rotate(360deg)}}
@keyframes hsbeat{50%{opacity:.35}}
@keyframes hswave{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.8)}}
`;

  // Boîtier noir mat vu de trois quarts : dessus, face avant gauche avec 4 entrées HDMI, LED et logo.
  const SVG = (label) => `<svg viewBox="0 0 240 150" role="img" aria-label="${label}"><defs>
      <radialGradient id="hsaura"><stop offset="0" stop-color="#ff3d9a"/><stop offset=".35" stop-color="#7a5cff"/><stop offset=".7" stop-color="#19c8ff" stop-opacity=".5"/><stop offset="1" stop-color="#19c8ff" stop-opacity="0"/></radialGradient>
      <linearGradient id="hstop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b3f45"/><stop offset="1" stop-color="#16181b"/></linearGradient>
      <linearGradient id="hsfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2226"/><stop offset="1" stop-color="#0d0e10"/></linearGradient></defs>
    <ellipse class="hs-aura" cx="120" cy="96" rx="112" ry="52" fill="url(#hsaura)"/>
    <ellipse cx="124" cy="128" rx="92" ry="9" fill="#000" fill-opacity=".22"/>
    ${['', ' w2', ' w3'].map((w) => `<ellipse class="hs-wave${w}" cx="120" cy="84" rx="62" ry="22"/>`).join('')}
    <path d="M30 78 L40 62 Q42 58 48 58 L192 50 Q200 50 204 55 L214 70 L214 86 Q214 90 210 91 L48 108 Q42 108 38 104 L30 94Z" fill="url(#hsfront)"/>
    <path d="M30 78 Q28 74 34 70 L52 52 Q56 48 62 47 L176 30 Q184 29 190 34 L214 62 Q216 66 210 69 L52 96 Q44 97 38 93Z" fill="url(#hstop)"/>
    <path d="M52 52 L176 31" stroke="#fff" stroke-opacity=".14" stroke-width="1.2" fill="none"/>
    <text class="hs-logo" x="124" y="66" text-anchor="middle" transform="rotate(-9 124 66) skewX(-32)" font-family="Arial,sans-serif" font-weight="700" font-size="13" letter-spacing="1">hue</text>
    <circle class="hs-led" cx="45" cy="84" r="2.4"/>
    ${[0, 1, 2, 3].map((i) => `<rect class="hs-port" data-p="${i + 1}" x="${64 + i * 31}" y="${79 - i * 2}" width="22" height="9" rx="2" transform="skewY(-6)"/>`).join('')}
  </svg>`;

  // sélecteurs : [clé config, clé de traduction, icône]
  const SELECTS = [['entity_area', 'area'], ['entity_intensity', 'intensity'], ['entity_mode', 'mode'], ['entity_input', 'input'], ['entity_led', 'led']];

  class ApplianceHueSyncBoxCard extends HTMLElement {
    get _config() { return this._c; } // nom standard lu par card-mod
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), f = (re, dom) => ids.find((i) => i.startsWith(dom + '.') && re.test(i)) || '';
      return { entity_power: f(/sync_?box|hue_play|play_hdmi/, 'switch'), entity_sync: f(/(light|lights?)_?sync|sync_?lights?|synchron/, 'switch') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (!c.entity_power && !c.entity_sync && !c.entity_hdmi1) throw new Error('entity_power (or entity_sync) is required');
      this._c = { show_status: true, show_buttons: true, show_selects: true, show_brightness: true, show_hdmi: true, ...c };
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
    _on(s) { return this._ok(s) && /^(on|true|1|yes|connected|plugged)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _toggle(id) { if (id && this._hass) this._hass.callService(id.split('.')[0], this._on(this._st(id)) ? 'turn_off' : 'turn_on', { entity_id: id }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="hstitle"></div><div class="badge" id="hsbadge"></div></div>
        ${SVG((this._c.name || this._t('name')).replace(/"/g, ''))}
        <div class="ctl" id="hsctl">
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button data-a="sync"><ha-icon icon="mdi:television-ambient-light"></ha-icon><span></span></button>
          <button data-a="dolby"><ha-icon icon="mdi:dolby"></ha-icon><span></span></button>
        </div>
        <div class="bri hide" id="hsbri"><ha-icon icon="mdi:brightness-6"></ha-icon><input type="range"><b></b></div>
        <div class="sels" id="hssels">${SELECTS.map(([, k]) => `<label class="sel hide" data-k="${k}"><span></span><select></select></label>`).join('')}</div>
        <div class="tiles" id="hstiles">${[1, 2, 3, 4].map((n) => `<div class="tile hide" data-n="${n}"><div class="l"><ha-icon icon="mdi:video-input-hdmi"></ha-icon><span></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_power || this._c.entity_sync));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => {
        const c = this._c; this._toggle({ power: c.entity_power, sync: c.entity_sync, dolby: c.entity_dolby }[b.dataset.a]);
      }));
      SELECTS.forEach(([opt, k]) => root.querySelector(`.sel[data-k="${k}"] select`).addEventListener('change', (e) => {
        if (this._c[opt]) this._hass.callService('select', 'select_option', { entity_id: this._c[opt], option: e.target.value });
      }));
      const rng = root.querySelector('#hsbri input');
      rng.addEventListener('input', () => { this._drag = true; root.querySelector('#hsbri b').textContent = `${rng.value} %`; });
      rng.addEventListener('change', () => {
        this._drag = false; const c = this._c, s = this._st(c.entity_brightness); if (!s) return;
        const a = s.attributes || {}, mn = Number(a.min ?? 0), mx = Number(a.max ?? 100);
        this._hass.callService('number', 'set_value', { entity_id: c.entity_brightness, value: Math.round(mn + (Number(rng.value) / 100) * (mx - mn)) });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[`entity_hdmi${el.dataset.n}`])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const pS = this._st(c.entity_power), yS = this._st(c.entity_sync);
      const dead = c.entity_power ? !this._ok(pS) : !this._ok(yS) && !c.entity_hdmi1;
      const power = c.entity_power ? this._on(pS) : true, sync = power && this._on(yS);
      const st = dead ? 'unavailable' : sync ? 'sync' : power ? 'on' : 'off';
      card.className = `${st}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('hstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('hsbadge');
      badge.textContent = this._t(st === 'sync' ? 'syncing' : st); badge.style.display = c.show_status === false ? 'none' : '';

      // ports HDMI de l'illustration
      [1, 2, 3, 4].forEach((n) => r.querySelector(`.hs-port[data-p="${n}"]`).classList.toggle('plug', this._on(this._st(c[`entity_hdmi${n}`]))));

      // boutons
      const ctl = r.getElementById('hsctl');
      ctl.classList.toggle('hide', c.show_buttons === false);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a, id = { power: c.entity_power, sync: c.entity_sync, dolby: c.entity_dolby }[a], s = this._st(id);
        b.classList.toggle('hide', !id);
        b.querySelector('span').textContent = this._l(`btn_${a}`);
        b.classList.toggle('on', this._on(s)); b.disabled = !this._ok(s);
      });

      // luminosité (number → 0-100 %)
      const bS = this._st(c.entity_brightness), bri = r.getElementById('hsbri'), rng = bri.querySelector('input');
      bri.classList.toggle('hide', !c.entity_brightness || c.show_brightness === false);
      if (this._ok(bS) && !this._drag) {
        const a = bS.attributes || {}, mn = Number(a.min ?? 0), mx = Number(a.max ?? 100), v = Number(bS.state);
        const pct = isFinite(v) && mx > mn ? Math.round(((v - mn) / (mx - mn)) * 100) : 0;
        rng.value = String(pct); bri.querySelector('b').textContent = `${pct} %`;
      }
      rng.disabled = !this._ok(bS);

      // listes déroulantes : options lues dans l'attribut « options » de l'entité select
      r.getElementById('hssels').classList.toggle('hide', c.show_selects === false);
      SELECTS.forEach(([opt, k]) => {
        const lab = r.querySelector(`.sel[data-k="${k}"]`), sel = lab.querySelector('select'), s = this._st(c[opt]);
        lab.classList.toggle('hide', !c[opt]); lab.querySelector('span').textContent = this._l(k);
        const opts = (s && s.attributes && s.attributes.options) || [];
        if (sel.dataset.sig !== opts.join('\u0001')) {
          sel.replaceChildren(...opts.map((o) => { const e = document.createElement('option'); e.value = o; e.textContent = o; return e; }));
          sel.dataset.sig = opts.join('\u0001');
        }
        if (this._ok(s)) sel.value = s.state;
        sel.disabled = !this._ok(s);
      });

      // entrées HDMI
      r.getElementById('hstiles').classList.toggle('hide', c.show_hdmi === false);
      [1, 2, 3, 4].forEach((n) => {
        const el = r.querySelector(`.tile[data-n="${n}"]`), s = this._st(c[`entity_hdmi${n}`]), plug = this._on(s);
        el.classList.toggle('hide', !c[`entity_hdmi${n}`]); el.classList.toggle('plug', plug);
        el.querySelector('span').textContent = `HDMI ${n}`;
        el.querySelector('.v').textContent = this._ok(s) ? this._t(plug ? 'plugged' : 'unplugged') : '--';
      });
    }
  }
  customElements.define(TAG, ApplianceHueSyncBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHueSyncBoxCardEditor extends HTMLElement {
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
      const ent = (name, domain) => ({ name, selector: { entity: { domain } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_power', 'switch'), ent('entity_sync', 'switch'), ent('entity_dolby', 'switch'),
        ent('entity_brightness', 'number'),
        ent('entity_area', 'select'), ent('entity_intensity', 'select'), ent('entity_mode', 'select'), ent('entity_input', 'select'), ent('entity_led', 'select'),
        ent('entity_hdmi1', 'binary_sensor'), ent('entity_hdmi2', 'binary_sensor'), ent('entity_hdmi3', 'binary_sensor'), ent('entity_hdmi4', 'binary_sensor'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_buttons'), bool('show_selects'), bool('show_brightness'), bool('show_hdmi'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceHueSyncBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Philips Hue Play HDMI Sync Box : alimentation, synchronisation des lumières, luminosité, mode, intensité, entrées HDMI, Dolby Vision.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/hue-sync-box.md',
  });
})();
