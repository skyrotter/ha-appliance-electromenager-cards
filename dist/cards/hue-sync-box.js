/* Carte « Hue Sync Box » — custom:appliance-hue-sync-box-card
 * Philips Hue Play HDMI Sync Box (intégration Hue de Home Assistant) : photos détourées du boîtier (2 vues, option model : top ou ports),
 * voyant qui s'allume, halo de lumière animé quand la synchronisation tourne.
 * Commandes : alimentation, synchronisation des lumières, luminosité (curseur), listes (espace de divertissement,
 * intensité, mode de synchronisation, sortie HDMI, voyant LED), Dolby Vision. Tuiles : état des 4 entrées HDMI.
 * Toutes les entités sont facultatives : seuls les contrôles configurés s'affichent.
 */
(() => {
  const TAG = 'appliance-hue-sync-box-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Hue Sync Box","model_top":"Top view","model_ports":"Ports view (power, USB, HDMI)","off":"Off","on":"On","syncing":"Syncing","unavailable":"Unavailable","btn_power":"Power","btn_sync":"Light sync","btn_dolby":"Dolby Vision","area":"Entertainment area","intensity":"Intensity","mode":"Sync mode","input":"HDMI input","led":"LED indicator","plugged":"Plugged","unplugged":"Unplugged"},"es":{"name":"Hue Sync Box","model_top":"Vista superior","model_ports":"Vista de los puertos (alimentación, USB, HDMI)","off":"Apagado","on":"Encendido","syncing":"Sincronizando","unavailable":"No disponible","btn_power":"Encendido","btn_sync":"Sincronización de luces","btn_dolby":"Dolby Vision","area":"Área de entretenimiento","intensity":"Intensidad","mode":"Modo de sincronización","input":"Entrada HDMI","led":"Indicador LED","plugged":"Conectado","unplugged":"Desconectado"},"fr":{"name":"Hue Sync Box","model_top":"Vue de dessus","model_ports":"Vue des ports (alimentation, USB, HDMI)","off":"Éteint","on":"Allumé","syncing":"Synchronisation","unavailable":"Indisponible","btn_power":"Alimentation","btn_sync":"Synchro lumières","btn_dolby":"Dolby Vision","area":"Espace de divertissement","intensity":"Intensité","mode":"Mode de synchronisation","input":"Sortie HDMI","led":"Voyant LED","plugged":"Branché","unplugged":"Débranché"},"pt-BR":{"name":"Hue Sync Box","model_top":"Vista de cima","model_ports":"Vista das portas (alimentação, USB, HDMI)","off":"Desligada","on":"Ligada","syncing":"Sincronizando","unavailable":"Indisponível","btn_power":"Alimentação","btn_sync":"Sincronizar luzes","btn_dolby":"Dolby Vision","area":"Área de entretenimento","intensity":"Intensidade","mode":"Modo de sincronização","input":"Saída HDMI","led":"Indicador LED","plugged":"Ligado","unplugged":"Desligado"},"pt-PT":{"name":"Hue Sync Box","model_top":"Vista de cima","model_ports":"Vista das portas (alimentação, USB, HDMI)","off":"Desligada","on":"Ligada","syncing":"A sincronizar","unavailable":"Indisponível","btn_power":"Alimentação","btn_sync":"Sincronizar luzes","btn_dolby":"Dolby Vision","area":"Área de entretenimento","intensity":"Intensidade","mode":"Modo de sincronização","input":"Saída HDMI","led":"Indicador LED","plugged":"Ligado","unplugged":"Desligado"},"ru":{"name":"Hue Sync Box","model_top":"Вид сверху","model_ports":"Вид с портами (питание, USB, HDMI)","off":"Выключен","on":"Включён","syncing":"Синхронизация","unavailable":"Недоступно","btn_power":"Питание","btn_sync":"Синхронизация света","btn_dolby":"Dolby Vision","area":"Зона развлечений","intensity":"Интенсивность","mode":"Режим синхронизации","input":"Вход HDMI","led":"Светодиодный индикатор","plugged":"Подключено","unplugged":"Отключено"},"uk":{"name":"Hue Sync Box","model_top":"Вигляд згори","model_ports":"Вигляд з боку роз'ємів (живлення, USB, HDMI)","off":"Вимк.","on":"Увімк.","syncing":"Синхронізація","unavailable":"Недоступно","btn_power":"Живлення","btn_sync":"Синхронізація світла","btn_dolby":"Dolby Vision","area":"Зона розваг","intensity":"Інтенсивність","mode":"Режим синхронізації","input":"Вхід HDMI","led":"Світлодіодний індикатор","plugged":"Підключено","unplugged":"Відключено"}};

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
  const IMG_TOP = window.__acImg("hue-sync-box",0);
  const IMG_PORTS = window.__acImg("hue-sync-box",1);
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
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
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
