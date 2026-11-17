/* Carte « Barre de son + caisson de basses » — custom:appliance-soundbar-card
 * Barre de son (Bose Smart Soundbar 900) et son caisson de basses (Bose Bass Module 500), photos détourées.
 * Entité media_player : en lecture, la barre lumineuse du dessus s'allume en blanc et des ondes sortent de la barre ;
 * muet : barre orange ; en veille / éteinte : tout est éteint. Le caisson (interrupteur) pulse avec des ondes basses
 * quand la barre joue, il est grisé quand il est éteint ou non relié (indisponible).
 * Boutons : marche / arrêt, muet, volume − / +, source suivante, caisson ; curseur de volume (pas = volume_step).
 * Tuiles (toutes facultatives) : volume, source, caisson (marche / arrêt), niveau du caisson, graves, aigus, voix centrale,
 * enceintes de hauteur, enceintes arrière (entités number) et mode audio (select).
 */
(() => {
  const TAG = 'appliance-soundbar-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n soundbar*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sb-ok:var(--appliance-ok-color,#43a047);--sb-alert:var(--appliance-alert-color,#db4437);
  --sb-warn:var(--appliance-warn-color,#ffa000);--sb-cold:var(--appliance-cold-color,#2b9af9);--sb-c:#9aa3ad}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.playing{--sb-c:var(--sb-cold)}ha-card.paused,ha-card.on{--sb-c:var(--sb-ok)}ha-card.muted{--sb-c:var(--sb-warn)}
.playing .badge,.paused .badge,.on .badge,.muted .badge{background:color-mix(in srgb,var(--sb-c) 22%,transparent);color:var(--sb-c)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.unavailable svg{filter:grayscale(.8) opacity(.55)}
.off .sb-art{filter:brightness(.9)}
/* barre lumineuse du dessus : blanche en lecture, orange en muet */
.sb-led{fill:#fff;opacity:0;filter:drop-shadow(0 0 3px #fff);transition:opacity .4s,fill .3s}
.on .sb-led,.paused .sb-led{opacity:.55}.playing .sb-led{opacity:.95;animation:sbglow 2.6s ease-in-out infinite}
.muted .sb-led{fill:var(--sb-warn);filter:drop-shadow(0 0 3px var(--sb-warn));opacity:.95;animation:none}
/* ondes sonores sous la barre */
.sb-wave{fill:none;stroke:var(--sb-c);stroke-width:1.8;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 0}
.playing:not(.muted) .sb-wave{animation:sbwave 2.2s ease-out infinite}
.sb-wave:nth-child(2){animation-delay:.55s!important}.sb-wave:nth-child(3){animation-delay:1.1s!important}
.sb-mute{opacity:0;transition:opacity .3s}.muted .sb-mute{opacity:1}
/* caisson de basses : pulse et ondes graves quand la barre joue, grisé s'il est éteint ou non relié */
.sw-wrap{transition:filter .4s,opacity .4s}
.sub-off .sw-wrap,.sub-dead .sw-wrap{filter:grayscale(1);opacity:.4}
.sw-art{transform-box:fill-box;transform-origin:50% 100%}
.playing.sub-on:not(.muted) .sw-art{animation:swpulse .5s ease-in-out infinite alternate}
.sw-ring{fill:none;stroke:var(--sb-cold);stroke-width:2.2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.playing.sub-on:not(.muted) .sw-ring{animation:swring 1.5s ease-out infinite}
.sw-ring.r2{animation-delay:.75s!important}
.noanim .sb-led,.noanim .sb-wave,.noanim .sw-art,.noanim .sw-ring{animation:none!important}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 36px;max-width:62px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:7px 4px;cursor:pointer;min-width:0;
  background:var(--secondary-background-color);color:var(--primary-text-color)}
.ctl button ha-icon{--mdc-icon-size:18px;flex:none}
.ctl button:hover{filter:brightness(1.12)}.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--sb-c) 28%,var(--secondary-background-color))}
.vol{display:flex;align-items:center;gap:8px;margin-top:6px}.vol.hide{display:none}.vol ha-icon{--mdc-icon-size:18px;flex:none;color:var(--secondary-text-color)}
.vol input{flex:1;min-width:0;margin:0;accent-color:var(--sb-c)}.vol .vv{flex:none;min-width:3.2em;text-align:right;font-size:12px;font-variant-numeric:tabular-nums;color:var(--primary-text-color)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l ha-icon{--mdc-icon-size:12px;flex:none}.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--sb-warn)}
@keyframes sbglow{50%{opacity:.55}}
@keyframes sbwave{0%{opacity:.8;transform:translateY(0) scale(.85)}100%{opacity:0;transform:translateY(16px) scale(1.12)}}
@keyframes swpulse{from{transform:scale(1)}to{transform:scale(1.035,.985)}}
@keyframes swring{0%{opacity:.75;transform:scale(.6)}100%{opacity:0;transform:scale(1.55)}}
`;

  // barre de son : dessin vectoriel (net à toutes les tailles), d'après la Bose Smart Soundbar 900 ; caisson : photo détourée (placée à (206, 98) sur 78 de large)
  const SUB = 'data:image/webp;base64,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';
  const SVG = (label) => `<svg viewBox="0 0 300 184" role="img" aria-label="${esc(label)}">
    <defs>
      <linearGradient id="sbFront" x1="0" x2="1"><stop offset="0" stop-color="#242528"/><stop offset=".12" stop-color="#17181a"/><stop offset=".5" stop-color="#0f1011"/><stop offset=".88" stop-color="#17181a"/><stop offset="1" stop-color="#232427"/></linearGradient>
      <linearGradient id="sbTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34363a"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient>
      <linearGradient id="sbRefl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8b8f96" stop-opacity=".75"/><stop offset="1" stop-color="#4a4d53" stop-opacity=".35"/></linearGradient>
    </defs>
    <ellipse cx="243" cy="164" rx="42" ry="5" fill="rgba(0,0,0,.22)"/>
    <g class="sw-wrap"><ellipse class="sw-ring" cx="245" cy="160" rx="46" ry="9"/><ellipse class="sw-ring r2" cx="245" cy="160" rx="46" ry="9"/>
      <image class="sw-art" href="${SUB}" x="206" y="98" width="78" height="68.3"/></g>
    <g class="sb-waves"><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/></g>
    <g class="sb-art">
      <rect x="24" y="30" width="252" height="22" rx="4.2" fill="url(#sbFront)" stroke="#46484d" stroke-width=".35"/>
      <path d="M28.2 30h243.6q4.2 0 4.2 4.2v4.4H24v-4.4q0-4.2 4.2-4.2z" fill="url(#sbTop)"/>
      <path d="M150 30.4h121.8q4.2 0 4.2 3.8v4.2H135z" fill="url(#sbRefl)"/>
      <ellipse cx="33.2" cy="33.6" rx="4.3" ry="1.3" fill="#08080a" stroke="#53565c" stroke-width=".35"/>
      <ellipse cx="266.8" cy="33.6" rx="4.3" ry="1.3" fill="#08080a" stroke="#53565c" stroke-width=".35"/>
      <rect x="25.2" y="38.4" width="249.6" height=".55" rx=".27" fill="#9a9da4" opacity=".6"/>
      <rect x="27" y="30" width="246" height=".4" fill="#c4c7cd" opacity=".4"/>
      <rect x="24.6" y="51.3" width="250.8" height=".7" rx=".35" fill="#000" opacity=".55"/>
    </g>
    <rect class="sb-led" x="38" y="37.4" width="224" height="1.4" rx=".7"/>
    <g class="sb-mute" transform="translate(142 104)"><path d="M0 4h5l6-5v18l-6-5H0z" fill="var(--sb-warn,#ffa000)"/><path d="M14 3l8 10M22 3l-8 10" stroke="var(--sb-warn,#ffa000)" stroke-width="2" stroke-linecap="round"/></g>
  </svg>`;

  const TILES = [['volume', 'mdi:volume-high', 'show_volume'], ['source', 'mdi:import', 'show_source'], ['subwoofer', 'mdi:speaker', 'show_subwoofer'],
    ['sub_gain', 'mdi:speaker-wireless', 'show_sub_gain'], ['bass', 'mdi:music-clef-bass', 'show_bass'], ['treble', 'mdi:music-clef-treble', 'show_treble'],
    ['center', 'mdi:speaker-multiple', 'show_center'], ['height', 'mdi:arrow-up-bold-box-outline', 'show_height'], ['rear', 'mdi:surround-sound', 'show_rear'],
    ['sound_mode', 'mdi:tune-variant', 'show_sound_mode']];
  // entité qui ouvre la fiche de chaque tuile
  const TILE_ENT = { volume: 'entity', source: 'entity', subwoofer: 'entity_subwoofer', sub_gain: 'entity_subwoofer_gain', bass: 'entity_bass', treble: 'entity_treble',
    center: 'entity_center', height: 'entity_height', rear: 'entity_rear', sound_mode: 'entity_sound_mode' };

  class ApplianceSoundbarCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    // détection automatique : media_player « bose / soundbar / barre de son », puis son caisson (switch) et ses réglages (number)
    static getStubConfig(hass) {
      const st = (hass && hass.states) || {}, ids = Object.keys(st);
      const RE = /soundbar|sound_bar|barre.?de.?son|bose|sonos.*(arc|beam|ray)|homebar|playbar|nakamichi|bar/i;
      const mp = ids.find((i) => i.startsWith('media_player.') && RE.test(i)) || ids.find((i) => i.startsWith('media_player.') && /bose/i.test((st[i].attributes || {}).friendly_name || '')) || '';
      const pre = (mp.split('.')[1] || '\u0000').replace(/_(media_player|player)$/, '');
      const near = (d, re) => ids.find((i) => i.startsWith(d + '.') && i.split('.')[1].startsWith(pre) && re.test(i)) || '';
      return {
        entity: mp,
        ...(near('switch', /sub|bass|caisson/i) ? { entity_subwoofer: near('switch', /sub|bass|caisson/i) } : {}),
        ...(near('number', /sub/i) ? { entity_subwoofer_gain: near('number', /sub/i) } : {}),
        ...(near('number', /bass|grave/i) ? { entity_bass: near('number', /^(?!.*sub).*(bass|grave)/i) || near('number', /bass|grave/i) } : {}),
        ...(near('number', /treble|aigu/i) ? { entity_treble: near('number', /treble|aigu/i) } : {}),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_volume: true, show_source: true, show_subwoofer: true, show_sub_gain: true, show_bass: true,
        show_treble: true, show_center: true, show_height: true, show_rear: true, show_sound_mode: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _compute() {
      const c = this._c, s = this._st(c.entity), a = (s && s.attributes) || {};
      const raw = s ? String(s.state).toLowerCase() : 'unavailable';
      let st = 'unavailable';
      if (s && raw !== 'unavailable') st = raw === 'playing' ? 'playing' : raw === 'paused' ? 'paused' : raw === 'off' || raw === 'standby' || raw === 'unknown' ? 'off' : 'on';
      const muted = st !== 'off' && st !== 'unavailable' && a.is_volume_muted === true;
      const vol = a.volume_level != null && isFinite(Number(a.volume_level)) ? Math.max(0, Math.min(1, Number(a.volume_level))) : null;
      // caisson : interrupteur (marche / arrêt) ; indisponible = non relié ; sans interrupteur on le suppose actif
      const sw = this._st(c.entity_subwoofer);
      const sub = !c.entity_subwoofer ? 'on' : !sw || /^unavailable$/i.test(String(sw.state)) ? 'dead' : /^on$/i.test(String(sw.state)) ? 'on' : 'off';
      return { st, a, muted, vol, sub, s };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sbtitle"></div><div class="badge" id="sbbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="vol" id="sbvol"><ha-icon icon="mdi:volume-medium"></ha-icon><input type="range" min="0" max="100" step="1"><span class="vv"></span></div>
        <div class="ctl" id="sbctl">
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon></button>
          <button data-a="mute"><ha-icon icon="mdi:volume-high"></ha-icon></button>
          <button data-a="vol_down"><ha-icon icon="mdi:volume-minus"></ha-icon></button>
          <button data-a="vol_up"><ha-icon icon="mdi:volume-plus"></ha-icon></button>
          <button data-a="source"><ha-icon icon="mdi:import"></ha-icon></button>
          <button data-a="sub"><ha-icon icon="mdi:speaker"></ha-icon></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('#sbctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      const rg = root.querySelector('#sbvol input'), vv = root.querySelector('#sbvol .vv');
      rg.addEventListener('input', () => { this._drag = true; vv.textContent = `${rg.value} %`; });
      rg.addEventListener('change', () => { this._drag = false; this._call('media_player', 'volume_set', { volume_level: Number(rg.value) / 100 }); });
      rg.addEventListener('blur', () => { this._drag = false; });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[TILE_ENT[el.dataset.k]])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _call(dom, svc, data = {}, id) {
      const e = id || this._c.entity;
      if (this._hass && e) this._hass.callService(dom, svc, { entity_id: e, ...data });
    }
    _action(a) {
      const c = this._c, { st, a: at, vol } = this._compute(), step = Number(c.volume_step) || 0.05;
      if (a === 'power') this._call('media_player', st === 'off' ? 'turn_on' : 'turn_off');
      else if (a === 'mute') this._call('media_player', 'volume_mute', { is_volume_muted: !at.is_volume_muted });
      else if (a === 'vol_up' || a === 'vol_down') {
        if (vol != null) this._call('media_player', 'volume_set', { volume_level: Math.round(Math.max(0, Math.min(1, vol + (a === 'vol_up' ? step : -step))) * 100) / 100 });
        else this._call('media_player', a === 'vol_up' ? 'volume_up' : 'volume_down');
      } else if (a === 'source') {
        const list = Array.isArray(at.source_list) ? at.source_list : [];
        if (list.length) this._call('media_player', 'select_source', { source: list[(list.indexOf(at.source) + 1) % list.length] });
      } else if (a === 'sub' && c.entity_subwoofer) {
        const d = c.entity_subwoofer.split('.')[0];
        this._hass.callService(['switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity_subwoofer });
      }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, a, muted, vol, sub } = this._compute();
      card.className = `${st}${muted ? ' muted' : ''} sub-${sub}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('sbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('sbbadge');
      badge.textContent = muted ? this._t('muted') : this._t(`st_${st}`);
      badge.style.display = c.show_status === false ? 'none' : '';

      const off = st === 'off' || st === 'unavailable', sf = Number(a.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || (sf & bit) !== 0;   // VOLUME_SET 4, VOLUME_MUTE 8, TURN_ON 128, TURN_OFF 256, SELECT_SOURCE 2048
      const ctl = r.getElementById('sbctl');
      ctl.classList.toggle('hide', c.show_controls === false || !c.entity);
      ctl.querySelectorAll('button').forEach((b) => {
        const k = b.dataset.a, label = this._t(`btn_${k}`);
        b.title = label; b.setAttribute('aria-label', label);
        b.classList.toggle('hide', (k === 'mute' && !has(8)) || (k === 'vol_down' && !(has(4) || has(1024))) || (k === 'vol_up' && !(has(4) || has(1024)))
          || (k === 'source' && !(has(2048) && Array.isArray(a.source_list) && a.source_list.length > 1)) || (k === 'sub' && !c.entity_subwoofer) || (k === 'power' && !(has(128) || has(256))));
        b.classList.toggle('on', (k === 'power' && !off) || (k === 'mute' && muted) || (k === 'sub' && sub === 'on'));
        b.disabled = st === 'unavailable' ? true : (k === 'sub' ? sub === 'dead' : (off && k !== 'power'));
        if (k === 'mute') b.querySelector('ha-icon').setAttribute('icon', muted ? 'mdi:volume-off' : 'mdi:volume-high');
      });

      // curseur de volume (volume_set) : pas = volume_step si défini, sinon 1 % ; pas de reconstruction pendant qu'on le tient
      const vrow = r.getElementById('sbvol'), rg = vrow.querySelector('input'), vv = vrow.querySelector('.vv');
      vrow.classList.toggle('hide', c.show_slider === false || c.show_controls === false || !c.entity || vol == null || !has(4));
      rg.step = String(Math.max(1, Math.round((Number(c.volume_step) || 0.01) * 100)));
      rg.disabled = off;
      if (!this._drag) { rg.value = String(Math.round((vol || 0) * 100)); vv.textContent = vol == null ? '' : `${Math.round(vol * 100)} %`; }

      const num = (id) => { const s = this._st(id); return this._ok(s) ? [this._fmt(this._num(s)), (s.attributes || {}).unit_of_measurement || ''] : null; };
      const sm = this._st(c.entity_sound_mode);
      const V = {
        volume: [c.entity && vol != null, vol == null ? '--' : String(Math.round(vol * 100)), '%'],
        source: [c.entity && a.source, a.source ? String(a.source) : '--', ''],
        subwoofer: [c.entity_subwoofer, sub === 'dead' ? this._t('sub_unlinked') : this._t(sub === 'on' ? 'on' : 'off'), '', sub === 'dead' ? 'warn' : ''],
        sub_gain: [c.entity_subwoofer_gain, ...(num(c.entity_subwoofer_gain) || ['--', ''])],
        bass: [c.entity_bass, ...(num(c.entity_bass) || ['--', ''])],
        treble: [c.entity_treble, ...(num(c.entity_treble) || ['--', ''])],
        center: [c.entity_center, ...(num(c.entity_center) || ['--', ''])],
        height: [c.entity_height, ...(num(c.entity_height) || ['--', ''])],
        rear: [c.entity_rear, ...(num(c.entity_rear) || ['--', ''])],
        sound_mode: [c.entity_sound_mode, this._ok(sm) ? String(sm.state) : '--', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
    _fmt(v) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: 1 }); }
  }
  customElements.define(TAG, ApplianceSoundbarCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSoundbarCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', 'media_player'), ent('entity_subwoofer', ['switch', 'input_boolean']), ent('entity_subwoofer_gain', 'number'), ent('entity_bass', 'number'), ent('entity_treble', 'number'),
        ent('entity_center', 'number'), ent('entity_height', 'number'), ent('entity_rear', 'number'), ent('entity_sound_mode', ['select', 'input_select', 'sensor']),
        { name: 'volume_step', selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: 'box' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_volume'), bool('show_source'), bool('show_subwoofer'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSoundbarCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Barre de son et caisson de basses animés (Bose Smart Soundbar 900, Bass Module 500…) : ondes, barre lumineuse, volume, source, réglages des graves et des aigus.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/soundbar.md',
  });
})();
