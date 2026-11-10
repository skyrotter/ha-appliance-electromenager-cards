/* Carte « Box internet » — custom:appliance-internet-box-card
 * Photos détourées : Freebox Pop (model: freebox_pop) et SFR Box (model: sfr_box), chacune avec son dessin SVG
 * vectoriel (illustration: svg) à la place de la photo.
 * Entités : état de la connexion (binary_sensor connectivity, sensor, device_tracker…), débit descendant / montant,
 * nombre d'appareils connectés, interrupteur Wi-Fi et bouton de redémarrage (tous facultatifs).
 * Animations : ondes Wi-Fi émises par la box, paquets qui descendent vers la box (téléchargement) et en repartent
 * (envoi) à la vitesse du débit, LED de la box (blanche en ligne, rouge qui clignote hors ligne), tuile Wi-Fi allumée
 * sur l'écran de la SFR Box, nuage « Internet » barré en cas de coupure.
 * États : online, offline, unavailable.
 */
(() => {
  const TAG = 'appliance-internet-box-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n internet_box*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Chaque modèle : photo (px de la photo = repère du dessin), emplacement dans la carte (box = x, y, w, h sur 300 × 180),
     point d'émission des ondes Wi-Fi, LED, et dessin SVG vectoriel dans le même repère que la photo. */
  const MODELS = {
    freebox_pop: {
      label: 'Freebox Pop', pw: 601, ph: 335, box: [70, 56, 160, 89], wave: [150, 52],
      img: 'data:image/webp;base64,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',
      // voyant blanc sur le rebord avant
      led: `<ellipse class="ledglow" cx="300" cy="272" rx="14" ry="10"/><circle class="led" cx="300" cy="272" r="5"/>`,
      svg: `
        <path d="M8 138 V204 A292 124 0 0 0 592 204 V138 Z" fill="url(#ib-fbside)"/>
        <ellipse cx="300" cy="138" rx="292" ry="130" fill="url(#ib-fbtop)"/>
        <ellipse cx="300" cy="138" rx="292" ry="130" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
        <rect x="252" y="70" width="270" height="40" rx="20" fill="url(#ib-fbslot)"/>
        <text x="338" y="98" fill="#e8e8ea" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="30" letter-spacing="1">free</text>
        <circle cx="486" cy="90" r="22" fill="#15161a"/><circle cx="486" cy="90" r="22" fill="none" stroke="#5a5c63" stroke-width="2"/>
        <path d="M478 84 L492 90 L478 96 Z" fill="#8a8d96"/>`,
    },
    sfr_box: {
      label: 'SFR Box', pw: 139, ph: 205, box: [100, 28, 99, 146], wave: [150, 24],
      img: 'data:image/webp;base64,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',
      // fente lumineuse au-dessus de l'écran tactile
      led: `<rect class="ledglow" x="25" y="52" width="16" height="9" rx="4.5"/><rect class="led" x="28" y="55" width="10" height="2.6" rx="1.3"/>
            <rect class="wifitile" x="34" y="107" width="12" height="12" rx="2.5"/>`,
      svg: `
        <path d="M10 22 Q12 8 40 7 L64 7 V197 L40 197 Q14 196 12 184 Z" fill="url(#ib-sfwhite)"/>
        <path d="M64 7 Q124 9 129 42 L131 168 Q127 197 64 197 Z" fill="#26262a"/>
        <path d="M64 7 Q124 9 129 42 L131 168 Q127 197 64 197 Z" fill="url(#ib-sffabric)"/>
        <path d="M64 7 V197" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>
        <rect x="14" y="70" width="38" height="95" rx="3.5" fill="#0b0c0e" stroke="#2a2b2f" stroke-width="1"/>
        <rect x="19" y="82" width="11" height="3" rx="1.5" fill="#8d9097"/><circle cx="46" cy="83.5" r="2.4" fill="none" stroke="#8d9097" stroke-width=".9"/>
        <g fill="#d8dadf"><rect x="19" y="107" width="12" height="12" rx="2.5"/><rect x="34" y="107" width="12" height="12" rx="2.5"/><rect x="19" y="122" width="12" height="12" rx="2.5"/><rect x="34" y="122" width="12" height="12" rx="2.5"/></g>
        <g fill="none" stroke="#2b2d33" stroke-width="1.1" stroke-linecap="round"><path d="M36.5 114.5 q3.5 -3.5 7 0 M38.4 116.4 q1.6 -1.6 3.2 0"/><path d="M23 128 l5 -4 M22 132 q3 -1 6 -6"/><path d="M40 130 q3 0 3 -4 l-1 -1 l-3 3 z"/><rect x="21.5" y="109.5" width="7" height="7" rx="1"/></g>
        <circle cx="40" cy="117.4" r=".9" fill="#2b2d33"/>
        <rect x="27" y="52" width="12" height="3.4" rx="1.7" fill="#d2d4d9" stroke="#b9bbc1" stroke-width=".5"/>`,
    },
  };
  const ALIAS = { freebox: 'freebox_pop', pop: 'freebox_pop', free: 'freebox_pop', sfr: 'sfr_box', sfrbox: 'sfr_box', box8: 'sfr_box', sfrbox8: 'sfr_box' };
  const modelKey = (m) => { const k = String(m || '').toLowerCase(); if (MODELS[k]) return k; const n = k.replace(/[^a-z0-9]/g, ''); return ALIAS[n] || 'freebox_pop'; };

  const ON_RE = /^(on|online|connected|connect[ée]|home|up|true|ok|available|running|active|1)$/i;
  const OFF_RE = /^(off|offline|disconnected|d[ée]connect[ée]|not_home|down|false|problem|inactive|0)$/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --ib-ok:var(--appliance-ok-color,#43a047);--ib-alert:var(--appliance-alert-color,#db4437);--dn:#2f9bff;--up:#ff9f1a;--wifi:#4db2ff;--act:0;--spd:2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--ib-ok) 22%,transparent);color:var(--ib-ok)}
.offline .badge{background:color-mix(in srgb,var(--ib-alert) 22%,transparent);color:var(--ib-alert)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile[data-k=download] .l ha-icon{color:var(--dn)}.tile[data-k=upload] .l ha-icon{color:var(--up)}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{width:34px;height:34px;border-radius:50%;border:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:19px;padding:0}
.ctrls button:hover{transform:scale(1.08)}.ctrls button:active{transform:scale(.92)}
.ctrls button.on{background:var(--wifi);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--wifi) 60%,transparent)}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- box ---- */
.shadow{opacity:.55}
.photo{transition:filter .6s}
.offline .photo,.unavailable .photo{filter:saturate(.6) brightness(.85)}
.unavailable .box{opacity:.6}
.ledglow{fill:var(--ledc,#fff);opacity:0;filter:blur(3px);transition:opacity .6s}
.led{fill:var(--ledc,#fff);opacity:0;filter:drop-shadow(0 0 3px var(--ledc,#fff));transition:opacity .6s,fill .4s}
.online .led{--ledc:#f4fbff;opacity:1}.online .ledglow{--ledc:#7fd0ff;opacity:.85;animation:ibled 3.2s ease-in-out infinite}
.offline .led,.offline .ledglow{--ledc:#ff3b30;opacity:1;animation:ibblink 1.2s steps(2) infinite}
.offline .ledglow{opacity:.8}
@keyframes ibled{50%{opacity:.35}}
@keyframes ibblink{50%{opacity:.1}}
.wifitile{fill:var(--wifi);opacity:0;filter:drop-shadow(0 0 3px var(--wifi))}
.online.wifion .wifitile{animation:ibtile 2.4s ease-in-out infinite}
@keyframes ibtile{0%,100%{opacity:.1}50%{opacity:.55}}
.waves path{fill:none;stroke:var(--wifi);stroke-width:1.8;stroke-linecap:round;opacity:0}
.online.wifion .waves path{animation:ibwave 2.2s ease-out infinite}
.waves path:nth-child(2){animation-delay:.35s!important}.waves path:nth-child(3){animation-delay:.7s!important}
@keyframes ibwave{0%{opacity:0;transform:translateY(6px)}25%{opacity:.9}100%{opacity:0;transform:translateY(-8px)}}

/* ---- ligne Internet : nuage, paquets, appareils ---- */
.line{fill:none;stroke-width:1.6;stroke-linecap:round;opacity:.22;transition:opacity .6s}
.line.dn{stroke:var(--dn)}.line.up{stroke:var(--up)}
.pk{fill:none;stroke-width:3;stroke-linecap:round;stroke-dasharray:0.1 11;opacity:0;transition:opacity .6s}
.pk.dn{stroke:var(--dn);filter:drop-shadow(0 0 2px var(--dn))}.pk.up{stroke:var(--up);filter:drop-shadow(0 0 2px var(--up))}
.online .pk{opacity:calc(.35 + var(--act) * .65);animation:ibpk var(--spd) linear infinite}
@keyframes ibpk{to{stroke-dashoffset:-22}}
.cloud{fill:var(--secondary-text-color);opacity:.55;transition:fill .5s,opacity .5s}
.online .cloud{fill:var(--dn);opacity:.85}
.offline .cloud{fill:var(--ib-alert);opacity:.9}
.cut{stroke:var(--ib-alert);stroke-width:2.4;stroke-linecap:round;opacity:0}
.offline .cut{opacity:1}
.dev{fill:var(--secondary-text-color);opacity:.55;transition:fill .5s,opacity .5s}
.online .dev{fill:var(--wifi);opacity:.85}
.dev.d2{animation:none}.online .dev.d2{animation:ibdev 3s ease-in-out infinite}
.online .dev.d3{animation:ibdev 3s ease-in-out infinite;animation-delay:-1.5s}
@keyframes ibdev{50%{opacity:.4}}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (même règles que les autres cartes) ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{width:21px;height:21px;--mdc-icon-size:13px}
`;

  const SVG = (label, m, drawing) => {
    const [bx, by, bw, bh] = m.box, [wx, wy] = m.wave, k = bw / m.pw;
    const mid = by + bh * 0.62; // hauteur de la ligne Internet
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="ib-shadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="ib-fbtop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eceef1"/><stop offset="1" stop-color="#d3d6db"/></linearGradient>
  <linearGradient id="ib-fbside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd2d7"/><stop offset=".25" stop-color="#f7f8fa"/><stop offset=".6" stop-color="#e3e5e9"/><stop offset="1" stop-color="#b9bdc4"/></linearGradient>
  <linearGradient id="ib-fbslot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7178"/><stop offset=".5" stop-color="#3a3b40"/><stop offset="1" stop-color="#26272b"/></linearGradient>
  <linearGradient id="ib-sfwhite" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9eaec"/><stop offset=".6" stop-color="#fafafa"/><stop offset="1" stop-color="#dcdde0"/></linearGradient>
  <linearGradient id="ib-sffabric" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
 </defs>
 <!-- ligne Internet : nuage à gauche, appareils à droite -->
 <g class="net">
  <path class="line dn" d="M40 ${mid} H${bx - 4}"/><path class="line up" d="M${bx + bw + 4} ${mid} H260"/>
  <path class="pk dn" d="M40 ${mid} H${bx - 4}"/><path class="pk up" d="M260 ${mid} H${bx + bw + 4}"/>
  <g transform="translate(8 ${mid - 17})"><path class="cloud" d="M9 28 a7 7 0 0 1 1 -14 a10 10 0 0 1 19 -2 a8 8 0 0 1 4 16 z"/><path class="cut" d="M5 31 L35 7"/></g>
  <g transform="translate(264 ${mid - 17})">
   <rect class="dev" x="4" y="2" width="9" height="15" rx="2"/>
   <rect class="dev d2" x="16" y="8" width="18" height="12" rx="1.5"/><rect class="dev d2" x="13" y="21" width="24" height="2.2" rx="1"/>
   <circle class="dev d3" cx="9" cy="28" r="3"/>
  </g>
 </g>
 <g class="box">
  <ellipse class="shadow" cx="${bx + bw / 2}" cy="${by + bh - 1}" rx="${bw * 0.5}" ry="5" fill="url(#ib-shadow)"/>
  <g class="waves"><path d="M${wx - 7} ${wy} q7 -6 14 0"/><path d="M${wx - 12} ${wy - 5} q12 -11 24 0"/><path d="M${wx - 17} ${wy - 10} q17 -16 34 0"/></g>
  <g transform="translate(${bx} ${by}) scale(${k.toFixed(5)})">
   ${drawing ? `<g class="photo">${m.svg}</g>` : `<image class="photo" href="${m.img}" x="0" y="0" width="${m.pw}" height="${m.ph}"/>`}
   ${m.led}
  </g>
 </g>
</svg>`;
  };

  // état → débit en Mb/s (pour régler la vitesse des paquets)
  const toMbps = (v, unit) => {
    const u = String(unit || '');
    let f = 1;
    if (/^g/i.test(u)) f = 1000; else if (/^k/i.test(u)) f = 0.001; else if (/^m/i.test(u)) f = 1; else if (/^t/i.test(u)) f = 1e6; else if (/^[bo]\/s|^bit/i.test(u)) f = 1e-6;
    if (/B\/s|o\/s/.test(u)) f *= 8; // octets → bits
    return v * f;
  };

  class ApplianceInternetBoxCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const pick = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      const entity = pick(/freebox|sfr|livebox|bbox|box|wan|internet|connectivity/i, 'binary_sensor');
      const down = pick(/(download|down|rx).*(speed|rate)|(speed|rate).*(download|down)|download/i, 'sensor');
      const up = pick(/(upload|up|tx).*(speed|rate)|(speed|rate).*(upload|up)|upload/i, 'sensor');
      return { model: /sfr/i.test(entity) ? 'sfr_box' : 'freebox_pop', ...(entity ? { entity } : {}), ...(down ? { entity_download: down } : {}), ...(up ? { entity_upload: up } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_download: true, show_upload: true, show_devices: true, show_wifi: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _unit(id) { return (this._st(id)?.attributes || {}).unit_of_measurement || ''; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      const drawing = /^(svg|drawing|dessin)$/i.test(String(this._c.illustration || ''));
      this._model = m; this._drawing = drawing;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="ibtitle"></div><div class="badge" id="ibbadge"></div></div>
        ${SVG(this._c.name || m.label, m, drawing)}
        <div class="ctrls" id="ibctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="download"><div class="l"><ha-icon icon="mdi:download"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="upload"><div class="l"><ha-icon icon="mdi:upload"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="devices"><div class="l"><ha-icon icon="mdi:devices"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="wifi"><div class="l"><ha-icon icon="mdi:wifi"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_download));
      const tgt = { download: 'entity_download', upload: 'entity_upload', devices: 'entity_devices', wifi: 'entity_wifi' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]])));
      root.getElementById('ibctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true;
    }

    _state() {
      const c = this._c, s = this._st(c.entity);
      if (c.entity) {
        if (!s) return 'unavailable';
        const raw = String(s.state).trim();
        if (/^(unavailable|unknown)$/i.test(raw)) return 'unavailable';
        if (OFF_RE.test(raw)) return 'offline';
        return 'online'; // on, connected, home… ou n'importe quel texte (type de connexion « FTTH », IP…)
      }
      // sans entité d'état : en ligne dès qu'un débit est lisible
      const d = this._st(c.entity_download) || this._st(c.entity_upload);
      return d && !/^(unavailable|unknown)$/i.test(String(d.state)) ? 'online' : 'unavailable';
    }

    _cmd(k) {
      const c = this._c, hass = this._hass; if (!hass) return;
      if (k === 'wifi' && c.entity_wifi) hass.callService('homeassistant', 'toggle', { entity_id: c.entity_wifi });
      else if (k === 'reboot' && c.entity_reboot) {
        if (!window.confirm || window.confirm(this._t('reboot_confirm'))) hass.callService(c.entity_reboot.split('.')[0], c.entity_reboot.startsWith('button.') ? 'press' : 'turn_on', { entity_id: c.entity_reboot });
      }
    }

    _render() {
      if (!this._built || this._model !== MODELS[modelKey(this._c.model)] || this._drawing !== /^(svg|drawing|dessin)$/i.test(String(this._c.illustration || ''))) this._build();
      const c = this._c, r = this._root, card = this._card, m = this._model;
      const st = this._state();
      const wifiS = this._st(c.entity_wifi), wifiOn = !wifiS || String(wifiS.state).toLowerCase() === 'on';
      card.className = `${st}${wifiOn ? ' wifion' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;

      // activité : débit cumulé / débit de référence (max_speed, 1000 Mb/s par défaut) → vitesse et visibilité des paquets
      const dn = this._num(c.entity_download), up = this._num(c.entity_upload);
      const mbDn = isNaN(dn) ? 0 : toMbps(dn, this._unit(c.entity_download)), mbUp = isNaN(up) ? 0 : toMbps(up, this._unit(c.entity_upload));
      const ref = Number(c.max_speed) > 0 ? Number(c.max_speed) : 1000;
      const act = Math.max(0, Math.min(1, Math.sqrt((mbDn + mbUp) / ref)));
      card.style.setProperty('--act', act.toFixed(3));
      card.style.setProperty('--spd', (2.6 - act * 2.1).toFixed(2) + 's');
      const only = (cls, mb) => r.querySelectorAll(cls).forEach((el) => { el.style.animationDuration = (2.6 - Math.max(0, Math.min(1, Math.sqrt(mb / ref))) * 2.1).toFixed(2) + 's'; });
      only('.pk.dn', mbDn); only('.pk.up', mbUp);

      r.getElementById('ibtitle').textContent = c.name || m.label;
      const badge = r.getElementById('ibbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      // boutons : Wi-Fi (interrupteur) et redémarrage
      const ctr = r.getElementById('ibctrls');
      const btns = [
        ['wifi', wifiOn ? 'mdi:wifi' : 'mdi:wifi-off', 'wifi', wifiOn, !!wifiS],
        ['reboot', 'mdi:restart', 'reboot', null, !!this._st(c.entity_reboot)],
      ].filter((b) => b[4] && c.show_controls !== false);
      ctr.classList.toggle('hide', !btns.length);
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on]) => `<button class="${on ? 'on' : ''}" data-k="${k}" title="${esc(this._t(lbl))}" aria-label="${esc(this._t(lbl))}"${st === 'unavailable' ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon></button>`).join('');
      }

      const dv = this._num(c.entity_devices);
      const V = {
        download: [!!this._st(c.entity_download) && c.show_download !== false, this._fmt(dn, dn < 10 ? 1 : 0), this._unit(c.entity_download) || 'Mb/s'],
        upload: [!!this._st(c.entity_upload) && c.show_upload !== false, this._fmt(up, up < 10 ? 1 : 0), this._unit(c.entity_upload) || 'Mb/s'],
        devices: [!!this._st(c.entity_devices) && c.show_devices !== false, this._fmt(dv, 0), ''],
        wifi: [!!wifiS && c.show_wifi !== false, this._t(wifiOn ? 'on' : 'off'), ''],
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
  customElements.define(TAG, ApplianceInternetBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceInternetBoxCardEditor extends HTMLElement {
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
        { name: 'illustration', selector: { select: { mode: 'dropdown', options: [{ value: 'photo', label: 'Photo' }, { value: 'svg', label: 'SVG' }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_download', 'sensor'), ent('entity_upload', 'sensor'), ent('entity_devices', 'sensor'), ent('entity_wifi', 'switch'), ent('entity_reboot'),
        { name: 'max_speed', default: 1000, selector: { number: { min: 10, max: 10000, step: 10, mode: 'box', unit_of_measurement: 'Mb/s' } } },
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', es: 'Español', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', cs: 'Čeština', hu: 'Magyar', sr: 'Српски', 'sr-Latn': 'Srpski' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_download'), bool('show_upload'), bool('show_devices'), bool('show_wifi'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'internet_box_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceInternetBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Box internet en photo ou en dessin SVG (Freebox Pop, SFR Box) : ondes Wi-Fi, paquets à la vitesse du débit, LED de la box, appareils connectés, Wi-Fi et redémarrage.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
