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
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Soundbar + subwoofer","muted":"Muted","st_playing":"Playing","st_paused":"Paused","st_on":"On","st_off":"Off","st_unavailable":"Unavailable","on":"On","off":"Off","sub_unlinked":"Not linked","btn_power":"On / off","btn_mute":"Mute","btn_vol_down":"Volume down","btn_vol_up":"Volume up","btn_source":"Next source","btn_sub":"Subwoofer","volume":"Volume","source":"Source","subwoofer":"Subwoofer","sub_gain":"Subwoofer level","bass":"Bass","treble":"Treble","center":"Center voice","height":"Height speakers","rear":"Rear speakers","sound_mode":"Audio mode"},"es":{"name":"Barra de sonido + subwoofer","muted":"Silenciada","st_playing":"Reproduciendo","st_paused":"En pausa","st_on":"Encendida","st_off":"Apagada","st_unavailable":"No disponible","on":"Encendido","off":"Apagado","sub_unlinked":"No vinculado","btn_power":"Encender / apagar","btn_mute":"Silenciar","btn_vol_down":"Bajar volumen","btn_vol_up":"Subir volumen","btn_source":"Fuente siguiente","btn_sub":"Subwoofer","volume":"Volumen","source":"Fuente","subwoofer":"Subwoofer","sub_gain":"Nivel del subwoofer","bass":"Graves","treble":"Agudos","center":"Voz central","height":"Altavoces de altura","rear":"Altavoces traseros","sound_mode":"Modo de sonido"},"fr":{"name":"Barre de son + caisson","muted":"Muet","st_playing":"En lecture","st_paused":"En pause","st_on":"Allumée","st_off":"Éteinte","st_unavailable":"Indisponible","on":"Marche","off":"Arrêt","sub_unlinked":"Non relié","btn_power":"Marche / arrêt","btn_mute":"Muet","btn_vol_down":"Volume −","btn_vol_up":"Volume +","btn_source":"Source suivante","btn_sub":"Caisson de basses","volume":"Volume","source":"Source","subwoofer":"Caisson","sub_gain":"Niveau caisson","bass":"Graves","treble":"Aigus","center":"Voix centrale","height":"Enceintes de hauteur","rear":"Enceintes arrière","sound_mode":"Mode audio"},"pt-BR":{"name":"Soundbar + subwoofer","muted":"Mudo","st_playing":"Tocando","st_paused":"Pausada","st_on":"Ligada","st_off":"Desligada","st_unavailable":"Indisponível","on":"Ligado","off":"Desligado","sub_unlinked":"Não conectado","btn_power":"Ligar / desligar","btn_mute":"Silenciar","btn_vol_down":"Volume −","btn_vol_up":"Volume +","btn_source":"Próxima fonte","btn_sub":"Subwoofer","volume":"Volume","source":"Fonte","subwoofer":"Subwoofer","sub_gain":"Nível do subwoofer","bass":"Graves","treble":"Agudos","center":"Voz central","height":"Alto-falantes de altura","rear":"Alto-falantes traseiros","sound_mode":"Modo de áudio"},"pt-PT":{"name":"Barra de som + subwoofer","muted":"Sem som","st_playing":"A reproduzir","st_paused":"Em pausa","st_on":"Ligada","st_off":"Desligada","st_unavailable":"Indisponível","on":"Ligado","off":"Desligado","sub_unlinked":"Não ligado","btn_power":"Ligar / desligar","btn_mute":"Silenciar","btn_vol_down":"Volume −","btn_vol_up":"Volume +","btn_source":"Fonte seguinte","btn_sub":"Subwoofer","volume":"Volume","source":"Fonte","subwoofer":"Subwoofer","sub_gain":"Nível do subwoofer","bass":"Graves","treble":"Agudos","center":"Voz central","height":"Colunas de altura","rear":"Colunas traseiras","sound_mode":"Modo de áudio"},"ru":{"name":"Саундбар + сабвуфер","muted":"Без звука","st_playing":"Воспроизведение","st_paused":"Пауза","st_on":"Вкл","st_off":"Выкл","st_unavailable":"Недоступно","on":"Вкл","off":"Выкл","sub_unlinked":"Не подключён","btn_power":"Вкл / Выкл","btn_mute":"Без звука","btn_vol_down":"Тише","btn_vol_up":"Громче","btn_source":"Следующий источник","btn_sub":"Сабвуфер","volume":"Громкость","source":"Источник","subwoofer":"Сабвуфер","sub_gain":"Уровень сабвуфера","bass":"Басы","treble":"Высокие частоты","center":"Центральный канал","height":"Верхние динамики","rear":"Тыловые динамики","sound_mode":"Режим звука"},"uk":{"name":"Саундбар + сабвуфер","muted":"Звук вимкнено","st_playing":"Відтворення","st_paused":"Пауза","st_on":"Увімк.","st_off":"Вимк.","st_unavailable":"Недоступно","on":"Увімк.","off":"Вимк.","sub_unlinked":"Не під'єднано","btn_power":"Увімк. / вимк.","btn_mute":"Вимкнути звук","btn_vol_down":"Гучність тихіше","btn_vol_up":"Гучність голосніше","btn_source":"Наступне джерело","btn_sub":"Сабвуфер","volume":"Гучність","source":"Джерело","subwoofer":"Сабвуфер","sub_gain":"Рівень сабвуфера","bass":"Низькі","treble":"Високі","center":"Центральний канал голосу","height":"Верхні динаміки","rear":"Задні динаміки","sound_mode":"Аудіорежим"}};
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

  // photos détourées : barre de son (placée à (24, 24) sur 252 de large), caisson 282 × 247 (placé à (206, 98) sur 78 de large)
  const BAR = window.__acImg("soundbar",0);
  const SUB = window.__acImg("soundbar",1);
  const SVG = (label) => `<svg viewBox="0 0 300 184" role="img" aria-label="${esc(label)}">
    <ellipse cx="243" cy="164" rx="42" ry="5" fill="rgba(0,0,0,.22)"/>
    <g class="sw-wrap"><ellipse class="sw-ring" cx="245" cy="160" rx="46" ry="9"/><ellipse class="sw-ring r2" cx="245" cy="160" rx="46" ry="9"/>
      <image class="sw-art" href="${SUB}" x="206" y="98" width="78" height="68.3"/></g>
    <g class="sb-waves"><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/><path class="sb-wave" d="M60 62 Q150 98 240 62"/></g>
    <image class="sb-art" href="${BAR}" x="24" y="24" width="252" height="31.6"/>
    <rect class="sb-led" x="36" y="36.3" width="228" height="1.3" rx=".65"/>
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
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceSoundbarCard);

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
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceSoundbarCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Barre de son et caisson de basses animés (Bose Smart Soundbar 900, Bass Module 500…) : ondes, barre lumineuse, volume, source, réglages des graves et des aigus.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/soundbar.md',
  });
})();
