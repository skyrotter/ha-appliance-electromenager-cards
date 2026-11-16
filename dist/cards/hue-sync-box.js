/* Carte « Hue Sync Box » — custom:appliance-hue-sync-box-card
 * Philips Hue Play HDMI Sync Box (intégration Hue de Home Assistant) : photos détourées du boîtier (2 vues, option model : top ou ports),
 * voyant qui s'allume, halo de lumière animé quand la synchronisation tourne.
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
      "model_top": "Top view",
      "model_ports": "Ports view (power, USB, HDMI)",
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
      "model_top": "Vue de dessus",
      "model_ports": "Vue des ports (alimentation, USB, HDMI)",
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
.hs-led{fill:#3a3f45;transition:fill .4s}.on .hs-led{fill:#fff;filter:drop-shadow(0 0 3px #fff)}.hs-dev{transition:filter .4s}.off .hs-dev,.unavailable .hs-dev{filter:brightness(.92)}.sync .hs-led{fill:#b36bff;filter:drop-shadow(0 0 4px #b36bff);animation:hsbeat 1.6s ease-in-out infinite}
.hs-wave{fill:none;stroke:var(--hs-c);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.sync .hs-wave{animation:hswave 2.4s ease-out infinite}.hs-wave.w2{animation-delay:.8s}.hs-wave.w3{animation-delay:1.6s}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes hshue{to{filter:hue-rotate(360deg)}}
@keyframes hsbeat{50%{opacity:.35}}
@keyframes hswave{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.8)}}
`;

  // Photos détourées du boîtier (2 vues, option model), posées dans la scène 240 × 150. led = position du voyant sur la photo « top ».
  const IMG_TOP = 'data:image/webp;base64,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';
  const IMG_PORTS = 'data:image/webp;base64,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';
  const MODELS = {
    top: { art: `<image href="${IMG_TOP}" x="22" y="22" width="196" height="118.1"/>`, led: [22 + 26 * 196 / 229, 22 + 74 * 196 / 229], aura: [120, 98, 108, 46] },
    ports: { art: `<image href="${IMG_PORTS}" x="30" y="16" width="180" height="108.8"/>`, led: null, aura: [120, 96, 104, 46] },
  };
  const SVG = (model, label) => {
    const M = MODELS[model] || MODELS.top, [ax, ay, arx, ary] = M.aura;
    return `<svg viewBox="0 0 240 150" role="img" aria-label="${label}"><defs>
      <radialGradient id="hsaura"><stop offset="0" stop-color="#ff3d9a"/><stop offset=".35" stop-color="#7a5cff"/><stop offset=".7" stop-color="#19c8ff" stop-opacity=".5"/><stop offset="1" stop-color="#19c8ff" stop-opacity="0"/></radialGradient></defs>
      <ellipse class="hs-aura" cx="${ax}" cy="${ay}" rx="${arx + 8}" ry="${ary + 12}" fill="url(#hsaura)"/>
      <ellipse cx="${ax + 3}" cy="${ay + 30}" rx="${arx - 18}" ry="7" fill="#000" fill-opacity=".2"/>
      ${['', ' w2', ' w3'].map((w) => `<ellipse class="hs-wave${w}" cx="${ax}" cy="${ay - 10}" rx="${arx - 40}" ry="${ary - 22}"/>`).join('')}
      <g class="hs-dev">${M.art}</g>
      ${M.led ? `<circle class="hs-led" cx="${M.led[0].toFixed(1)}" cy="${M.led[1].toFixed(1)}" r="2.6"/>` : ''}
    </svg>`;
  };

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
      this._c = { model: 'top', show_status: true, show_buttons: true, show_selects: true, show_brightness: true, show_hdmi: true, ...c };
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
        ${SVG(this._c.model, (this._c.name || this._t('name')).replace(/"/g, ''))}
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
      const tr = T[window.applianceLang(T, null, this._hass)] || T.en;
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'top', label: tr.model_top }, { value: 'ports', label: tr.model_ports }] } } },
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
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'sync_box_model' : s.name, this._hass);
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
