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

  const T = {
    "en": {
      "name": "Soundbar + subwoofer",
      "muted": "Muted",
      "st_playing": "Playing",
      "st_paused": "Paused",
      "st_on": "On",
      "st_off": "Off",
      "st_unavailable": "Unavailable",
      "on": "On",
      "off": "Off",
      "sub_unlinked": "Not linked",
      "btn_power": "On / off",
      "btn_mute": "Mute",
      "btn_vol_down": "Volume down",
      "btn_vol_up": "Volume up",
      "btn_source": "Next source",
      "btn_sub": "Subwoofer",
      "volume": "Volume",
      "source": "Source",
      "subwoofer": "Subwoofer",
      "sub_gain": "Subwoofer level",
      "bass": "Bass",
      "treble": "Treble",
      "center": "Center voice",
      "height": "Height speakers",
      "rear": "Rear speakers",
      "sound_mode": "Audio mode"
    },
    "fr": {
      "name": "Barre de son + caisson",
      "muted": "Muet",
      "st_playing": "En lecture",
      "st_paused": "En pause",
      "st_on": "Allumée",
      "st_off": "Éteinte",
      "st_unavailable": "Indisponible",
      "on": "Marche",
      "off": "Arrêt",
      "sub_unlinked": "Non relié",
      "btn_power": "Marche / arrêt",
      "btn_mute": "Muet",
      "btn_vol_down": "Volume −",
      "btn_vol_up": "Volume +",
      "btn_source": "Source suivante",
      "btn_sub": "Caisson de basses",
      "volume": "Volume",
      "source": "Source",
      "subwoofer": "Caisson",
      "sub_gain": "Niveau caisson",
      "bass": "Graves",
      "treble": "Aigus",
      "center": "Voix centrale",
      "height": "Enceintes de hauteur",
      "rear": "Enceintes arrière",
      "sound_mode": "Mode audio"
    },
    "pt-BR": {
      "name": "Soundbar + subwoofer",
      "muted": "Mudo",
      "st_playing": "Tocando",
      "st_paused": "Pausada",
      "st_on": "Ligada",
      "st_off": "Desligada",
      "st_unavailable": "Indisponível",
      "on": "Ligado",
      "off": "Desligado",
      "sub_unlinked": "Não conectado",
      "btn_power": "Ligar / desligar",
      "btn_mute": "Silenciar",
      "btn_vol_down": "Volume −",
      "btn_vol_up": "Volume +",
      "btn_source": "Próxima fonte",
      "btn_sub": "Subwoofer",
      "volume": "Volume",
      "source": "Fonte",
      "subwoofer": "Subwoofer",
      "sub_gain": "Nível do subwoofer",
      "bass": "Graves",
      "treble": "Agudos",
      "center": "Voz central",
      "height": "Alto-falantes de altura",
      "rear": "Alto-falantes traseiros",
      "sound_mode": "Modo de áudio"
    },
    "pt-PT": {
      "name": "Barra de som + subwoofer",
      "muted": "Sem som",
      "st_playing": "A reproduzir",
      "st_paused": "Em pausa",
      "st_on": "Ligada",
      "st_off": "Desligada",
      "st_unavailable": "Indisponível",
      "on": "Ligado",
      "off": "Desligado",
      "sub_unlinked": "Não ligado",
      "btn_power": "Ligar / desligar",
      "btn_mute": "Silenciar",
      "btn_vol_down": "Volume −",
      "btn_vol_up": "Volume +",
      "btn_source": "Fonte seguinte",
      "btn_sub": "Subwoofer",
      "volume": "Volume",
      "source": "Fonte",
      "subwoofer": "Subwoofer",
      "sub_gain": "Nível do subwoofer",
      "bass": "Graves",
      "treble": "Agudos",
      "center": "Voz central",
      "height": "Colunas de altura",
      "rear": "Colunas traseiras",
      "sound_mode": "Modo de áudio"
    }
  };
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

  // photos détourées : barre de son 754 × 66 (placée à (24, 30) sur 252 de large), caisson 282 × 247 (placé à (206, 98) sur 78 de large)
  const BAR = 'data:image/webp;base64,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';
  const SUB = 'data:image/webp;base64,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';
  const SVG = (label) => `<svg viewBox="0 0 300 184" role="img" aria-label="${esc(label)}">
    <ellipse cx="243" cy="164" rx="42" ry="5" fill="rgba(0,0,0,.22)"/>
    <g class="sw-wrap"><ellipse class="sw-ring" cx="245" cy="160" rx="46" ry="9"/><ellipse class="sw-ring r2" cx="245" cy="160" rx="46" ry="9"/>
      <image class="sw-art" href="${SUB}" x="206" y="98" width="78" height="68.3"/></g>
    <g class="sb-waves"><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/></g>
    <image class="sb-art" href="${BAR}" x="24" y="30" width="252" height="22.1"/>
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
