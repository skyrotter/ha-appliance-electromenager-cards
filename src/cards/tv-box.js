/* Carte « Box TV » — custom:appliance-tv-box-card
 * Photos détourées : Freebox Player Pop (model: freebox_pop), Xiaomi TV Box S (xiaomi_tv_box_s),
 * NVIDIA Shield TV Pro (shield_tv_pro). Entité media_player (Android TV Remote, Cast, Freebox…),
 * remote facultatif pour l'allumage.
 * Animations : écran flottant avec pochette en fondu « Ken Burns », ambilight à la couleur de la
 * pochette, aurore animée sur l'accueil, égaliseur et barre de progression en lecture, pause qui
 * pulse, chargement qui tourne, ondes émises par la box, LED de la box (bande verte de la Shield,
 * LED blanche de la Xiaomi, halo du Player Pop), affichage du volume à l'écran quand il change.
 * États : off, standby, idle, on, playing, paused, buffering, unavailable.
 */
(() => {
  const TAG = 'appliance-tv-box-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n tv_box*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Chaque modèle : photo, position dans le dessin (x, y, w, h), couleur d'accent, point d'émission des ondes,
     et calque lumineux propre (LED). Coordonnées = px photo × échelle + décalage. */
  const MODELS = {
    shield_tv_pro: {
      label: 'NVIDIA Shield TV Pro', img: 'data:image/webp;base64,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', box: [204, 22, 86.3, 150], accent: '#76b900', wave: [214, 70],
      // bande verte de la photo : coin haut → nœud → bas, et petite branche à droite
      led: `<path class="ledoff" d="M224.6 32.3 L260.3 58.6 L236.1 122.7 M260.3 58.6 L268.9 63.1"/>
            <path class="ledon" d="M224.6 32.3 L260.3 58.6 L236.1 122.7 M260.3 58.6 L268.9 63.1"/>
            <path class="ledrun" pathLength="100" d="M224.6 32.3 L260.3 58.6 L236.1 122.7"/>`,
    },
    xiaomi_tv_box_s: {
      label: 'Xiaomi TV Box S', img: 'data:image/webp;base64,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', box: [196, 76, 96, 96], accent: '#ff6900', wave: [204, 104],
      led: `<rect class="ledoff" x="240.6" y="165.6" width="7" height="2.4" rx="1.2"/><rect class="ledon dot" x="240.6" y="165.6" width="7" height="2.4" rx="1.2"/>`,
    },
    freebox_pop: {
      label: 'Freebox Player Pop', img: 'data:image/webp;base64,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', box: [186, 84, 112, 84.7], accent: '#e2001a', wave: [196, 112],
      // halo lumineux sous le galet (le Player Pop n'a pas de LED en façade)
      led: `<ellipse class="halo" cx="242" cy="166" rx="62" ry="9" fill="url(#tv-halo)"/>`,
    },
  };
  const BTN_KEYS = ['power', 'home', 'prev', 'play_pause', 'next', 'vol_down', 'mute', 'vol_up'];
  const ALIAS = { shield: 'shield_tv_pro', shieldtvpro: 'shield_tv_pro', xiaomi: 'xiaomi_tv_box_s', xiaomitvboxs: 'xiaomi_tv_box_s', mibox: 'xiaomi_tv_box_s', freebox: 'freebox_pop', freeboxpop: 'freebox_pop', playerpop: 'freebox_pop' };
  const modelKey = (m) => { const k = String(m || '').toLowerCase(); if (MODELS[k]) return k; const n = k.replace(/[^a-z0-9]/g, ''); return ALIAS[n] || 'shield_tv_pro'; };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --tv-ok:var(--appliance-ok-color,#43a047);--tv-alert:var(--appliance-alert-color,#db4437);--acc:#76b900;--amb:#3d7bff;--prog:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.playing .badge,.buffering .badge{background:color-mix(in srgb,var(--acc) 24%,transparent);color:var(--acc)}
.on .badge,.idle .badge,.paused .badge{background:color-mix(in srgb,var(--tv-ok) 20%,transparent);color:var(--tv-ok)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{width:34px;height:34px;border-radius:50%;border:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:19px;padding:0}
.ctrls button:hover{transform:scale(1.08)}.ctrls button:active{transform:scale(.92)}
.ctrls button.on{background:var(--acc);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--acc) 60%,transparent)}
.ctrls button.main{width:40px;height:40px;--mdc-icon-size:22px}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- écran flottant ---- */
.amb{opacity:0;transition:opacity 1s,fill 1.2s}
.amb rect{fill:var(--amb);transition:fill 1.2s}
.on .amb,.idle .amb{opacity:.35}
.playing .amb{opacity:.75;animation:tvamb 4s ease-in-out infinite}
.paused .amb,.buffering .amb{opacity:.3}
@keyframes tvamb{50%{opacity:.45}}
.scr{fill:#05070a;stroke:#2a2f36;stroke-width:1.4}
.aur{opacity:0;transition:opacity .8s}
.on .aur,.idle .aur,.buffering .aur,.noart .aur{opacity:1}
.off .aur,.standby .aur,.unavailable .aur{opacity:0!important}
.aur ellipse{transform-box:fill-box;transform-origin:50% 50%}
.aur .a1{fill:var(--acc);opacity:.55;animation:tvau1 9s ease-in-out infinite}
.aur .a2{fill:#3d7bff;opacity:.5;animation:tvau2 11s ease-in-out infinite}
.aur .a3{fill:#b14dff;opacity:.4;animation:tvau3 13s ease-in-out infinite}
@keyframes tvau1{50%{transform:translate(60px,18px) scale(1.3)}}
@keyframes tvau2{50%{transform:translate(-50px,-14px) scale(1.4)}}
@keyframes tvau3{50%{transform:translate(30px,-20px) scale(.8)}}
.art{opacity:0;transition:opacity .9s;transform-box:fill-box;transform-origin:50% 50%}
.hasart.playing .art,.hasart.paused .art,.hasart.buffering .art{opacity:1}
.hasart.playing .art{animation:tvkb 18s ease-in-out infinite alternate}
.paused .art{filter:brightness(.5) saturate(.6)}
@keyframes tvkb{from{transform:scale(1) translate(0,0)}to{transform:scale(1.14) translate(-6px,-3px)}}
.shade{opacity:0;transition:opacity .6s}
.playing .shade,.paused .shade,.buffering .shade,.on .shade,.idle .shade{opacity:1}
.app{fill:#fff;font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);letter-spacing:.08em;opacity:0;transition:opacity .5s}
.mt{fill:#fff;font:700 9.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);opacity:0;transition:opacity .5s}
.ma{fill:#cfd6de;font:500 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);opacity:0;transition:opacity .5s}
.playing .app,.paused .app,.buffering .app,.on .app,.idle .app,.playing .mt,.paused .mt,.playing .ma,.paused .ma,.on .mt,.idle .mt{opacity:1}
.pbar{fill:rgba(255,255,255,.22)}.pfill{fill:var(--acc);transform-box:fill-box;transform-origin:0 50%;transform:scaleX(var(--prog));transition:transform 1s linear}
.prog{opacity:0}.hasdur.playing .prog,.hasdur.paused .prog{opacity:1}
.eq rect{fill:var(--acc);transform-box:fill-box;transform-origin:50% 100%;opacity:0}
.playing .eq rect{opacity:.95;animation:tveq .9s ease-in-out infinite}
.eq rect:nth-child(2){animation-delay:-.3s!important;animation-duration:.7s!important}.eq rect:nth-child(3){animation-delay:-.55s!important;animation-duration:1.1s!important}
.eq rect:nth-child(4){animation-delay:-.15s!important;animation-duration:.8s!important}
@keyframes tveq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.pz{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.paused .pz{opacity:.9;animation:tvpz 1.6s ease-in-out infinite}
@keyframes tvpz{50%{transform:scale(1.12);opacity:.55}}
.spin{fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:22 60;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.buffering .spin{opacity:.9;animation:tvspin .9s linear infinite}
@keyframes tvspin{to{transform:rotate(360deg)}}
.glass{pointer-events:none}
.sby{fill:#ff2d2d;opacity:0}
.off .sby,.standby .sby{opacity:.9;animation:tvsby 3s ease-in-out infinite}
@keyframes tvsby{50%{opacity:.35}}
.osd{opacity:0;transition:opacity .35s}
.osd.show{opacity:1}
.osd .ob{fill:rgba(0,0,0,.55)}.osd .of{fill:#fff;transform-box:fill-box;transform-origin:0 50%;transition:transform .3s}
.osdt{fill:#fff;font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}

/* ---- box ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:brightness(.72) saturate(.7)}
.shadow{opacity:.5}
.waves path{fill:none;stroke:var(--acc);stroke-width:1.6;stroke-linecap:round;opacity:0}
.playing .waves path{animation:tvwave 1.8s ease-out infinite}
.waves path:nth-child(2){animation-delay:.3s!important}.waves path:nth-child(3){animation-delay:.6s!important}
@keyframes tvwave{0%{opacity:0;transform:translateX(4px)}25%{opacity:.9}100%{opacity:0;transform:translateX(-10px)}}
.ledoff{fill:#141618;stroke:#141618;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.ledon{fill:none;stroke:var(--acc);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:0;filter:drop-shadow(0 0 2.5px var(--acc));transition:opacity .6s}
.ledon.dot{fill:#fff;stroke:none;filter:drop-shadow(0 0 3px #fff)}
.on .ledon,.idle .ledon,.paused .ledon,.buffering .ledon{opacity:.85}
.playing .ledon{opacity:1}
.standby .ledon{opacity:.6;animation:tvbr 4s ease-in-out infinite}
@keyframes tvbr{50%{opacity:.08}}
.ledrun{fill:none;stroke:#eaffc0;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:8 92;opacity:0;filter:drop-shadow(0 0 3px #b6ff3b)}
.playing .ledrun{opacity:1;animation:tvrun 2.4s linear infinite}
@keyframes tvrun{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.halo{opacity:0;transition:opacity .8s}
.on .halo,.idle .halo,.paused .halo,.buffering .halo{opacity:.55}
.playing .halo{opacity:.9;animation:tvhalo 3s ease-in-out infinite}
.standby .halo{opacity:.25}
@keyframes tvhalo{50%{opacity:.5}}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (même règles que les autres cartes) ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .alert,.compact .info,.compact .goal{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{width:21px;height:21px;--mdc-icon-size:13px}
.compact .ctrls button.main{width:24px;height:24px;--mdc-icon-size:15px}
`;

  // icônes de lecture dessinées (pause, logo par défaut)
  const SVG = (label, m) => {
    const [bx, by, bw, bh] = m.box, [wx, wy] = m.wave;
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <filter id="tv-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="tv-blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <clipPath id="tv-scr"><rect x="10" y="10" width="176" height="99" rx="6"/></clipPath>
  <linearGradient id="tv-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></linearGradient>
  <linearGradient id="tv-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".38" stop-color="#fff" stop-opacity=".03"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="tv-halo"><stop offset="0" style="stop-color:var(--acc)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--acc)" stop-opacity="0"/></radialGradient>
  <radialGradient id="tv-shadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 </defs>
 <!-- ambilight -->
 <g class="amb" filter="url(#tv-blur)"><rect x="4" y="4" width="188" height="111" rx="10"/></g>
 <rect class="scr" x="10" y="10" width="176" height="99" rx="6"/>
 <g clip-path="url(#tv-scr)">
  <g class="aur" filter="url(#tv-blur2)"><ellipse class="a1" cx="50" cy="40" rx="50" ry="26"/><ellipse class="a2" cx="140" cy="80" rx="55" ry="28"/><ellipse class="a3" cx="100" cy="30" rx="40" ry="22"/></g>
  <image class="art" id="tvart" x="10" y="10" width="176" height="99" preserveAspectRatio="xMidYMid slice"/>
  <rect class="shade" x="10" y="10" width="176" height="99" fill="url(#tv-shade)"/>
  <text class="app" id="tvapp" x="18" y="22"></text>
  <text class="mt" id="tvmt" x="18" y="88"></text>
  <text class="ma" id="tvma" x="18" y="98"></text>
  <g class="eq"><rect x="164" y="80" width="3" height="12" rx="1"/><rect x="169" y="80" width="3" height="12" rx="1"/><rect x="174" y="80" width="3" height="12" rx="1"/><rect x="179" y="80" width="3" height="12" rx="1"/></g>
  <g class="prog"><rect class="pbar" x="18" y="103" width="160" height="2" rx="1"/><rect class="pfill" x="18" y="103" width="160" height="2" rx="1"/></g>
  <g class="pz"><circle cx="98" cy="56" r="14" fill="rgba(0,0,0,.45)"/><rect x="92.5" y="49" width="4" height="14" rx="1.2" fill="#fff"/><rect x="99.5" y="49" width="4" height="14" rx="1.2" fill="#fff"/></g>
  <circle class="spin" cx="98" cy="56" r="10"/>
  <g class="osd" id="tvosd"><rect class="ob" x="58" y="44" width="80" height="22" rx="6"/><text class="osdt" id="tvosdt" x="66" y="53">VOL</text>
   <rect x="66" y="57" width="64" height="3" rx="1.5" fill="rgba(255,255,255,.25)"/><rect class="of" id="tvosdf" x="66" y="57" width="64" height="3" rx="1.5"/></g>
  <rect class="glass" x="10" y="10" width="176" height="99" fill="url(#tv-glass)"/>
 </g>
 <circle class="sby" cx="98" cy="113.5" r="1.3"/>
 <path d="M84 109.5 h28 l3 5 h-34 z" fill="#23272d"/>
 <!-- box -->
 <ellipse class="shadow" cx="${bx + bw / 2}" cy="${by + bh - 1}" rx="${bw * 0.48}" ry="5" fill="url(#tv-shadow)"/>
 <g class="waves"><path d="M${wx} ${wy - 6} q-5 6 0 12"/><path d="M${wx - 5} ${wy - 10} q-8 10 0 20"/><path d="M${wx - 10} ${wy - 14} q-11 14 0 28"/></g>
 <image class="photo" href="${m.img}" x="${bx}" y="${by}" width="${bw}" height="${bh}"/>
 ${m.led}
</svg>`;
  };

  class ApplianceTvBoxCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const mp = ids.filter((i) => i.startsWith('media_player.'));
      const pick = mp.find((i) => /shield|freebox|player|xiaomi|mibox|tv_box|android/i.test(i)) || mp[0] || '';
      const model = /freebox|player_pop|free/i.test(pick) ? 'freebox_pop' : /xiaomi|mibox|mi_box/i.test(pick) ? 'xiaomi_tv_box_s' : 'shield_tv_pro';
      const base = pick.split('.')[1] || '';
      const remote = ids.find((i) => i === `remote.${base}`) || '';
      return { entity: pick, model, ...(remote ? { entity_remote: remote } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_artwork: true, show_app: true, show_volume: true, show_power: true, volume_step: 0.05, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { if (!this._tick) this._tick = setInterval(() => this._progress(), 1000); }
    disconnectedCallback() { clearInterval(this._tick); this._tick = null; clearTimeout(this._osdT); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      this._model = m;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="tvtitle"></div><div class="badge" id="tvbadge"></div></div>
        ${SVG(this._c.name || m.label, m)}
        <div class="ctrls" id="tvctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="app"><div class="l"><ha-icon icon="mdi:apps"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="volume"><div class="l"><ha-icon icon="mdi:volume-high"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="power"><div class="l"><ha-icon icon="mdi:flash"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      this._card.style.setProperty('--acc', m.accent);
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(el.dataset.k === 'power' ? this._c.entity_power : this._c.entity)));
      root.getElementById('tvctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      const art = root.getElementById('tvart');
      art.addEventListener('load', () => this._card.classList.add('artok'));
      this._root = root; this._built = true; this._lastVol = undefined; this._lastPic = undefined;
    }

    _state() {
      const s = this._st(this._c.entity);
      if (!s) return 'unavailable';
      const raw = String(s.state).toLowerCase();
      if (raw === 'unknown') return 'unavailable';
      return ['off', 'standby', 'idle', 'on', 'playing', 'paused', 'buffering', 'unavailable'].includes(raw) ? raw : 'on';
    }

    // couleur moyenne de la pochette (ambilight) ; reste sur l'accent si l'image n'est pas lisible
    _ambient(url) {
      if (!url) { this._card.style.setProperty('--amb', this._model.accent); return; }
      if (this._ambUrl === url) return;
      this._ambUrl = url;
      try {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const cv = document.createElement('canvas'); cv.width = cv.height = 8;
            const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, 8, 8);
            const d = cx.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0, n = 0;
            for (let i = 0; i < d.length; i += 4) { const w = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) + 20; r += d[i] * w; g += d[i + 1] * w; b += d[i + 2] * w; n += w; }
            if (n && this._ambUrl === url) this._card.style.setProperty('--amb', `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`);
          } catch (e) { this._card.style.setProperty('--amb', this._model.accent); }
        };
        img.onerror = () => this._card.style.setProperty('--amb', this._model.accent);
        img.src = url;
      } catch (e) { this._card.style.setProperty('--amb', this._model.accent); }
    }

    // position de lecture estimée : media_position + temps écoulé depuis media_position_updated_at
    _progress() {
      if (!this._built || !this._hass) return;
      const s = this._st(this._c.entity); if (!s) return;
      const a = s.attributes || {}, dur = Number(a.media_duration), pos = Number(a.media_position);
      if (!(dur > 0) || !isFinite(pos)) { this._card.classList.remove('hasdur'); return; }
      let p = pos;
      if (String(s.state) === 'playing' && a.media_position_updated_at) p += (Date.now() - Date.parse(a.media_position_updated_at)) / 1000;
      this._card.classList.add('hasdur');
      this._card.style.setProperty('--prog', Math.max(0, Math.min(1, p / dur)).toFixed(4));
    }

    _osd(vol, muted) {
      const r = this._root, el = r.getElementById('tvosd');
      r.getElementById('tvosdt').textContent = muted ? this._t('muted').toUpperCase() : `VOL ${Math.round(vol * 100)}`;
      r.getElementById('tvosdf').style.transform = `scaleX(${muted ? 0 : vol})`;
      el.classList.add('show'); clearTimeout(this._osdT);
      this._osdT = setTimeout(() => el.classList.remove('show'), 1800);
    }

    _cmd(k) {
      const hass = this._hass, c = this._c, id = c.entity, s = this._st(id); if (!s) return;
      const a = s.attributes || {}, sf = Number(a.supported_features), step = Number(c.volume_step) || 0.05;
      const call = (svc, data = {}) => hass.callService('media_player', svc, { entity_id: id, ...data });
      const off = ['off', 'standby', 'unavailable'].includes(String(s.state).toLowerCase());
      if (k === 'power') {
        // Android TV Remote : l'allumage passe mieux par l'entité remote
        if (c.entity_remote && this._st(c.entity_remote)) hass.callService('remote', off ? 'turn_on' : 'turn_off', { entity_id: c.entity_remote });
        else call(off ? 'turn_on' : 'turn_off');
      } else if (k === 'play_pause') call('media_play_pause');
      else if (k === 'prev') call('media_previous_track');
      else if (k === 'next') call('media_next_track');
      else if (k === 'mute') call('volume_mute', { is_volume_muted: !a.is_volume_muted });
      else if (k === 'home' && c.entity_remote) hass.callService('remote', 'send_command', { entity_id: c.entity_remote, command: 'HOME' });
      else if (k === 'vol_up' || k === 'vol_down') {
        const v = Number(a.volume_level), up = k === 'vol_up';
        if (a.volume_level != null && isFinite(v) && (!isFinite(sf) || (sf & 4))) call('volume_set', { volume_level: Math.round(Math.max(0, Math.min(1, v + (up ? step : -step))) * 100) / 100 });
        else call(up ? 'volume_up' : 'volume_down');
      }
    }

    _render() {
      if (!this._built || this._model !== MODELS[modelKey(this._c.model)]) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity), a = (s && s.attributes) || {};
      const st = this._state(), m = this._model;
      const live = !['off', 'standby', 'unavailable'].includes(st);
      const pic = c.show_artwork !== false && live ? a.entity_picture_local || a.entity_picture || '' : '';
      const art = r.getElementById('tvart');
      if (pic !== this._lastPic) { this._lastPic = pic; card.classList.remove('artok'); if (pic) art.setAttribute('href', pic); else art.removeAttribute('href'); this._ambient(pic); }
      card.className = `${st}${pic ? ' hasart' : ' noart'}${card.classList.contains('artok') ? ' artok' : ''}${card.classList.contains('hasdur') ? ' hasdur' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      if (!pic) card.style.setProperty('--amb', m.accent);

      const app = a.app_name || a.source || '';
      const title = a.media_title || (live ? app || m.label : '');
      const sub = [a.media_series_title, a.media_artist, a.media_album_name].filter(Boolean).join(' · ');
      const cut = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);
      r.getElementById('tvapp').textContent = c.show_app === false ? '' : cut(String(app).toUpperCase(), 30);
      r.getElementById('tvmt').textContent = cut(String(title), 30);
      r.getElementById('tvma').textContent = cut(String(sub), 42);
      this._progress();

      // affichage du volume à l'écran quand il change (pas au premier rendu)
      const vol = Number(a.volume_level), muted = !!a.is_volume_muted, key = `${vol}|${muted}`;
      if (this._lastVol !== undefined && this._lastVol !== key && live && isFinite(vol)) this._osd(vol, muted);
      this._lastVol = key;

      r.getElementById('tvtitle').textContent = c.name || m.label;
      const badge = r.getElementById('tvbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      // télécommande (selon les fonctions annoncées : PAUSE 1, VOLUME_SET 4, MUTE 8, PREVIOUS 16, NEXT 32, TURN_ON 128, TURN_OFF 256, VOLUME_STEP 1024, PLAY 16384)
      const ctr = r.getElementById('tvctrls');
      ctr.classList.toggle('hide', c.show_controls === false || !s);
      const sf = Number(a.supported_features), has = (bit) => !isFinite(sf) || (sf & bit) !== 0;
      const play = st === 'playing', volOk = has(4) || has(1024);
      const btns = [
        ['power', 'mdi:power', 'power', live, has(128) || has(256) || !!c.entity_remote],
        ['home', 'mdi:home', 'home', null, !!c.entity_remote],
        ['prev', 'mdi:skip-previous', 'previous', null, has(16)],
        ['play_pause', play ? 'mdi:pause' : 'mdi:play', play ? 'pause' : 'play', null, has(1) || has(16384), 'main'],
        ['next', 'mdi:skip-next', 'next', null, has(32)],
        ['vol_down', 'mdi:volume-minus', 'vol_down', null, volOk],
        ['mute', muted ? 'mdi:volume-off' : 'mdi:volume-high', 'mute', muted, has(8)],
        ['vol_up', 'mdi:volume-plus', 'vol_up', null, volOk],
      ].filter((b) => b[4] && c[`show_btn_${b[0]}`] !== false); // case décochée dans l'éditeur : bouton masqué
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on, , cls]) => {
          const dis = st === 'unavailable' || (!live && k !== 'power');
          return `<button class="${cls || ''}${on ? ' on' : ''}" data-k="${k}" title="${esc(this._t(lbl))}" aria-label="${esc(this._t(lbl))}"${dis ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon></button>`;
        }).join('');
      }

      const pw = this._num(c.entity_power), pu = (this._st(c.entity_power)?.attributes || {}).unit_of_measurement || 'W';
      const V = {
        app: [!!s && !!app && c.show_app !== false, cut(String(app), 22), ''],
        volume: [!!s && a.volume_level != null && c.show_volume !== false, muted ? '🔇' : this._fmt(vol * 100, 0), muted ? '' : '%'],
        power: [!!c.entity_power && c.show_power !== false, this._fmt(pw, pw < 10 ? 1 : 0), pu],
      };
      Object.entries(V).forEach(([k, [show, val, unit]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit;
        el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  customElements.define(TAG, ApplianceTvBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceTvBoxCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: m.label })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity', 'media_player'), ent('entity_remote', 'remote'), ent('entity_power', 'sensor'),
        { name: 'volume_step', default: 0.05, selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: 'box' } } },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_artwork'), bool('show_app'), bool('show_volume'), bool('show_power'), bool('animations')] },
        // boutons de la télécommande, un par un
        { type: 'grid', name: '', schema: BTN_KEYS.map((k) => bool(`show_btn_${k}`)) },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'tv_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceTvBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Box TV en photo (Freebox Player Pop, Xiaomi TV Box S, NVIDIA Shield TV Pro) : écran flottant avec pochette et ambilight, égaliseur, LED de la box, télécommande (media_player).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
