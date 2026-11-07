/* Carte « Mini PC » — custom:appliance-mini-pc-card (photo détourée du BMAX B9 Max)
 * Serveur domestique (Home Assistant, Proxmox, Jellyfin…) suivi par Glances ou System Monitor.
 * Animations : bouton d'alimentation qui respire, reflet qui balaie le boîtier, air chaud qui sort des
 * ouïes (vitesse selon le CPU), chaleur qui monte au-dessus du capot (rouge en surchauffe), paquets
 * réseau qui montent / descendent selon le débit, jauges CPU / RAM / disque en néon sur le côté.
 * États : off, idle, running, busy, hot, unavailable.
 */
(() => {
  const TAG = 'appliance-mini-pc-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n mini_pc*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = 'data:image/webp;base64,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';

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --mp-ok:var(--appliance-ok-color,#43a047);--mp-warn:#ffa31a;--mp-alert:var(--appliance-alert-color,#db4437);--mp-blue:#2f9bff;
  --cpu:0;--ram:0;--dsk:0;--spd:2s;--net-d:0;--net-u:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--mp-ok) 22%,transparent);color:var(--mp-ok)}
.busy .badge{background:color-mix(in srgb,var(--mp-warn) 22%,transparent);color:var(--mp-warn)}
.hot .badge{background:color-mix(in srgb,var(--mp-alert) 22%,transparent);color:var(--mp-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--mp-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--mp-alert)}

/* ---- illustration ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:grayscale(.5) brightness(.62)}
/* halo derrière le boîtier : bleu en marche, rouge qui pulse en surchauffe */
.aura{opacity:0;transition:opacity .8s}
.idle .aura,.running .aura,.busy .aura{opacity:calc(.25 + var(--cpu) * .5)}
.hot .aura{opacity:.9;animation:mpaura 1.4s ease-in-out infinite}
.aura stop{transition:stop-color .6s}
.hot .aura stop{stop-color:#ff3b30}
@keyframes mpaura{50%{opacity:.35}}
/* bouton d'alimentation : anneau bleu qui respire */
.pwr{fill:none;stroke:var(--mp-blue);stroke-width:1.6;opacity:0;filter:drop-shadow(0 0 3px var(--mp-blue))}
.idle .pwr,.running .pwr,.busy .pwr,.hot .pwr{opacity:1;animation:mpbreath 3s ease-in-out infinite}
.hot .pwr{stroke:#ff3b30;filter:drop-shadow(0 0 3px #ff3b30);animation-duration:.8s}
@keyframes mpbreath{50%{opacity:.35}}
.led{fill:#fff;opacity:0}
.idle .led,.running .led,.busy .led,.hot .led{opacity:1;filter:drop-shadow(0 0 2px #fff)}
.busy .led,.hot .led{animation:mpblink .25s steps(2) infinite}
@keyframes mpblink{50%{opacity:.25}}
/* reflet qui balaie le boîtier (masqué par la silhouette de la photo) */
.glint{opacity:0}
.idle .glint,.running .glint,.busy .glint,.hot .glint{opacity:1;animation:mpglint 5s ease-in-out infinite}
@keyframes mpglint{0%,55%{transform:translateX(-140px)}100%{transform:translateX(260px)}}
/* air chaud qui sort des ouïes latérales */
.air path{fill:none;stroke:#9fd2ff;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:3 9;opacity:0}
.running .air path,.busy .air path,.hot .air path{opacity:calc(.35 + var(--cpu) * .6);animation:mpair var(--spd) linear infinite}
.hot .air path{stroke:#ff8a65}
.air path:nth-child(2){animation-delay:-.3s}.air path:nth-child(3){animation-delay:-.6s}.air path:nth-child(4){animation-delay:-.9s}
@keyframes mpair{to{stroke-dashoffset:24}}
/* chaleur au-dessus du capot */
.heat path{fill:none;stroke:#ffb74d;stroke-width:1.5;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.busy .heat path,.hot .heat path{animation:mpheat 2.2s ease-in infinite}
.hot .heat path{stroke:#ff5252}
.heat path:nth-child(2){animation-delay:-.7s}.heat path:nth-child(3){animation-delay:-1.4s}
@keyframes mpheat{0%{opacity:0;transform:translateY(6px) scaleY(.6)}35%{opacity:.85}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
/* réseau : paquets qui descendent (bleu) et montent (vert) le long du câble */
.cable{fill:none;stroke:#3a4148;stroke-width:2.4;stroke-linecap:round}
.pk{fill:none;stroke-width:2.6;stroke-linecap:round;opacity:0}
.pk.d{stroke:#4fc3ff;stroke-dasharray:.1 12}.pk.u{stroke:#5df28a;stroke-dasharray:.1 16}
.on-net .pk.d{opacity:calc(.25 + var(--net-d) * .75);animation:mpdown var(--sd,1.6s) linear infinite}
.on-net .pk.u{opacity:calc(.25 + var(--net-u) * .75);animation:mpup var(--su,1.6s) linear infinite}
@keyframes mpdown{to{stroke-dashoffset:-24}}@keyframes mpup{to{stroke-dashoffset:32}}
.globe{fill:none;stroke:#7d8791;stroke-width:1.1}
.on-net .globe{stroke:#4fc3ff;animation:mpglobe 4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes mpglobe{50%{stroke:#5df28a}}
/* jauges néon CPU / RAM / disque */
.gb{fill:#1d2126;stroke:#2c333a}
.gf{transform-box:fill-box;transform-origin:50% 100%;transition:transform 1s cubic-bezier(.3,1.4,.5,1),fill .4s}
.g-cpu .gf{transform:scaleY(var(--cpu));fill:url(#mp-gcpu)}.g-ram .gf{transform:scaleY(var(--ram));fill:url(#mp-gram)}.g-dsk .gf{transform:scaleY(var(--dsk));fill:url(#mp-gdsk)}
.gf.bad{fill:#ff3b30!important}
.busy .g-cpu .gf,.hot .g-cpu .gf{animation:mpjit .45s steps(3) infinite}
@keyframes mpjit{33%{opacity:.75}66%{opacity:1}}
.gl{fill:var(--secondary-text-color);font:600 5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.gv{fill:var(--primary-text-color);font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.gscan{fill:#fff;opacity:0}
.idle .gscan,.running .gscan,.busy .gscan,.hot .gscan{animation:mpscan 2.6s linear infinite;opacity:.25}
@keyframes mpscan{from{transform:translateY(0)}to{transform:translateY(-78px)}}
.off .gauges,.unavailable .gauges{opacity:.35}
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
`;

  /* Photo de 360 × 238 px réduite à 220 de large, posée en (30, 26) : px photo × 0,611 + décalage */
  const SVG = (label) => `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="mp-aura"><stop offset="0" stop-color="#2f9bff" stop-opacity=".55"/><stop offset="1" stop-color="#2f9bff" stop-opacity="0"/></radialGradient>
  <radialGradient id="mp-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="mp-glint" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="mp-gcpu" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#00b3ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
  <linearGradient id="mp-gram" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#00e5a0"/><stop offset="1" stop-color="#00b3ff"/></linearGradient>
  <linearGradient id="mp-gdsk" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc400"/><stop offset="1" stop-color="#ff6d00"/></linearGradient>
  <mask id="mp-sil" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="180"><image href="${IMG}" x="30" y="26" width="220" height="145.4"/></mask>
  <clipPath id="mp-gclip"><rect x="252" y="40" width="9" height="80" rx="4.5"/><rect x="268" y="40" width="9" height="80" rx="4.5"/><rect x="284" y="40" width="9" height="80" rx="4.5"/></clipPath>
 </defs>
 <ellipse class="aura" cx="140" cy="100" rx="125" ry="70" fill="url(#mp-aura)"/>
 <ellipse cx="142" cy="170" rx="112" ry="7" fill="url(#mp-shadow)"/>
 <!-- câble réseau vers Internet -->
 <path class="cable" d="M232 52 C 244 40 236 18 222 14"/>
 <path class="pk d" d="M222 14 C 236 18 244 40 232 52"/>
 <path class="pk u" d="M232 52 C 244 40 236 18 222 14"/>
 <g class="globe"><circle cx="214" cy="12" r="7"/><ellipse cx="214" cy="12" rx="3" ry="7"/><path d="M207 12 H221 M208.5 8 H219.5 M208.5 16 H219.5"/></g>
 <g class="heat"><path d="M110 40 q-4 -6 0 -12 t0 -12"/><path d="M140 34 q-4 -6 0 -12 t0 -12"/><path d="M170 32 q-4 -6 0 -12 t0 -12"/></g>
 <g class="air"><path d="M34 108 C 24 106 14 110 4 106"/><path d="M36 120 C 26 118 16 122 6 118"/><path d="M38 132 C 28 130 18 134 8 130"/><path d="M40 144 C 30 142 20 146 10 142"/></g>
 <image class="photo" href="${IMG}" x="30" y="26" width="220" height="145.4"/>
 <g mask="url(#mp-sil)"><g transform="skewX(-20)"><rect class="glint" x="0" y="0" width="70" height="180" fill="url(#mp-glint)"/></g></g>
 <circle class="pwr" cx="223.1" cy="127.4" r="8.4"/>
 <circle class="led" cx="209" cy="120.1" r="1.1"/>
 <!-- jauges -->
 <g class="gauges">
  <g class="g-cpu"><rect class="gb" x="252" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="252" y="40" width="9" height="80" rx="4.5"/></g>
  <g class="g-ram"><rect class="gb" x="268" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="268" y="40" width="9" height="80" rx="4.5"/></g>
  <g class="g-dsk"><rect class="gb" x="284" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="284" y="40" width="9" height="80" rx="4.5"/></g>
  <g clip-path="url(#mp-gclip)"><rect class="gscan" x="250" y="118" width="42" height="3"/></g>
  <text class="gl" x="256.5" y="130">CPU</text><text class="gl" x="272.5" y="130">RAM</text><text class="gl" x="288.5" y="130">SSD</text>
  <text class="gv" id="mp-vcpu" x="256.5" y="36">--</text><text class="gv" id="mp-vram" x="272.5" y="36">--</text><text class="gv" id="mp-vdsk" x="288.5" y="36">--</text>
 </g>
</svg>`;

  const TILES = [
    ['cpu', 'mdi:cpu-64-bit', 'show_cpu', 'entity_cpu'],
    ['temp', 'mdi:thermometer', 'show_temp', 'entity_cpu_temp'],
    ['ram', 'mdi:memory', 'show_ram', 'entity_ram'],
    ['disk', 'mdi:harddisk', 'show_disk', 'entity_disk'],
    ['down', 'mdi:download-network', 'show_down', 'entity_net_down'],
    ['up', 'mdi:upload-network', 'show_up', 'entity_net_up'],
    ['uptime', 'mdi:timer-outline', 'show_uptime', 'entity_uptime'],
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
  ];

  // débit lisible : garde la famille de l'unité (octets ou bits) et choisit k / M / G
  const fmtRate = (v, unit, loc) => {
    const u = String(unit || '');
    const m = u.replace(/\s/g, '').match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)(\/s|ps)?$/);
    if (isNaN(v)) return ['--', u];
    if (!m) return [v.toLocaleString(loc, { maximumFractionDigits: v < 10 ? 1 : 0 }), u];
    const base = v * { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]];
    const bytes = /^(B|byte|Bps)$/.test(m[3]);
    const [div, p] = base >= 1e9 ? [1e9, 'G'] : base >= 1e6 ? [1e6, 'M'] : base >= 1e3 ? [1e3, 'k'] : [1, ''];
    const x = base / div;
    return [x.toLocaleString(loc, { maximumFractionDigits: x < 10 ? 1 : 0 }), bytes ? `${p}B/s` : `${p}bit/s`];
  };
  // débit → Mbit/s, quelle que soit l'unité (B/s, kB/s, KiB/s, MB/s, Mbit/s, kbps…)
  const toMbit = (v, unit) => {
    if (isNaN(v)) return NaN;
    const u = String(unit || '').replace(/\s/g, '');
    const m = u.match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)/);
    if (!m) return v;
    const mul = { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]] * (m[2] ? 1.024 : 1);
    const bits = /^(B|byte|Bps)$/.test(m[3]) ? 8 : 1;
    return (v * mul * bits) / 1e6;
  };

  class ApplianceMiniPcCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_cpu: f(/(processor_use|cpu_(use|usage|load|percent)|cpu_utili[sz]ation)/i, 'sensor'),
        entity_cpu_temp: f(/(cpu|processor|package).*temp/i, 'sensor'),
        entity_ram: f(/(memory_use_percent|memory_usage|ram_(used_)?percent|ram_use)/i, 'sensor'),
        entity_disk: f(/disk_use_percent|disk_usage|(root|disk).*used_percent/i, 'sensor'),
        entity_uptime: f(/last_boot|uptime/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_cpu: true, show_temp: true, show_ram: true, show_disk: true, show_network: true, show_uptime: true, show_power: true,
        cpu_busy: 70, temp_max: 85, ram_max: 90, disk_max: 90, off_threshold: 3, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _watts(id) { const v = this._num(id); if (isNaN(v)) return NaN; return this._unit(id, 'W').toLowerCase() === 'kw' ? v * 1000 : v; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _temp(id) {
      const s = this._st(id), v = this._num(id);
      if (!window.applianceTemp) return { v, unit: '°C' };
      const tt = window.applianceTemp(this._hass, this._c);
      return { v: tt.conv(v, s), unit: tt.unit };
    }
    // temps écoulé depuis le démarrage : capteur horodaté (« Last boot ») ou durée (s, min, h, d)
    _uptimeSec(id) {
      const s = this._st(id); if (!s) return NaN;
      const raw = String(s.state);
      if (/^\d{4}-\d\d-\d\d/.test(raw)) { const t = Date.parse(raw); return isNaN(t) ? NaN : Math.max(0, (Date.now() - t) / 1000); }
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 's').toLowerCase();
      return v * (/^d/.test(u) ? 86400 : /^h/.test(u) ? 3600 : /^min/.test(u) ? 60 : 1);
    }
    _dur(sec) {
      if (isNaN(sec)) return '--';
      const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
      return d ? `${d} ${this._t('d')} ${h} h` : h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mptitle"></div><div class="badge" id="mpbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="mpalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_cpu));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k); this._more(this._c[t[3]]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const cpu = this._num(c.entity_cpu), ram = this._num(c.entity_ram), dsk = this._num(c.entity_disk);
      const tp = this._temp(c.entity_cpu_temp), pw = this._watts(c.entity_power);
      const raw = s ? String(s.state).toLowerCase() : '';
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && /^(off|not_home|offline|down|false|stopped)$/.test(raw)) st = 'off';
      else if (!s && !isNaN(pw) && pw < Number(c.off_threshold) && isNaN(cpu)) st = 'off';
      else if (!s && c.entity_cpu && isNaN(cpu)) st = 'unavailable';
      else st = 'running';
      const alerts = [];
      if (st === 'running') {
        if (!isNaN(tp.v) && tp.v >= Number(c.temp_max)) { st = 'hot'; alerts.push('overheating'); }
        else if (!isNaN(cpu) && cpu >= Number(c.cpu_busy)) st = 'busy';
        else if (!isNaN(cpu) && cpu < 8) st = 'idle';
      }
      if (st !== 'off' && st !== 'unavailable') {
        if (!isNaN(dsk) && dsk >= Number(c.disk_max)) alerts.push('disk_full');
        if (!isNaN(ram) && ram >= Number(c.ram_max)) alerts.push('ram_full');
      }
      return { st, cpu, ram, dsk, tp, pw, alerts };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, cpu, ram, dsk, tp, pw, alerts } = this._compute();
      const on = st !== 'off' && st !== 'unavailable';
      const clamp = (x) => Math.max(0, Math.min(1, isNaN(x) ? 0 : x));
      // débits en Mbit/s, intensité sur une échelle log (1 kbit/s → 0, 1 Gbit/s → 1)
      const dn = toMbit(this._num(c.entity_net_down), this._unit(c.entity_net_down)), upr = toMbit(this._num(c.entity_net_up), this._unit(c.entity_net_up));
      const lvl = (m) => (isNaN(m) || m <= 0.001 ? 0 : clamp((Math.log10(m) + 3) / 6));
      const nd = lvl(dn), nu = lvl(upr), net = on && (nd > 0 || nu > 0);
      card.className = `${st}${net ? ' on-net' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const set = (k, v) => card.style.setProperty(k, v);
      set('--cpu', on ? clamp(cpu / 100).toFixed(3) : 0); set('--ram', clamp(ram / 100).toFixed(3)); set('--dsk', clamp(dsk / 100).toFixed(3));
      set('--spd', `${(2.4 - clamp(cpu / 100) * 1.9).toFixed(2)}s`);
      set('--net-d', nd.toFixed(2)); set('--net-u', nu.toFixed(2));
      set('--sd', `${(2.2 - nd * 1.8).toFixed(2)}s`); set('--su', `${(2.2 - nu * 1.8).toFixed(2)}s`);
      const pct = (v) => (isNaN(v) ? '--' : `${Math.round(v)}`);
      r.getElementById('mp-vcpu').textContent = pct(cpu); r.getElementById('mp-vram').textContent = pct(ram); r.getElementById('mp-vdsk').textContent = pct(dsk);
      r.querySelector('.g-ram .gf').classList.toggle('bad', alerts.includes('ram_full'));
      r.querySelector('.g-dsk .gf').classList.toggle('bad', alerts.includes('disk_full'));
      r.querySelector('.g-cpu .gf').classList.toggle('bad', st === 'hot');

      r.getElementById('mptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('mpbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('mpalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      const fmtNet = (id) => fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass));
      const V = {
        cpu: [this._fmt(cpu, 0), '%'], temp: [this._fmt(tp.v, 0), tp.unit], ram: [this._fmt(ram, 0), '%'], disk: [this._fmt(dsk, 0), '%'],
        down: fmtNet(c.entity_net_down), up: fmtNet(c.entity_net_up), uptime: [this._dur(this._uptimeSec(c.entity_uptime)), ''],
        power: [this._fmt(pw, 0), 'W'],
      };
      const bad = { temp: st === 'hot', ram: alerts.includes('ram_full'), disk: alerts.includes('disk_full') };
      TILES.forEach(([k, , opt, ent]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        el.classList.toggle('hide', !c[ent] || c[opt] === false || (c.show_network === false && (k === 'down' || k === 'up')));
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceMiniPcCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMiniPcCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_cpu', 'sensor'), ent('entity_cpu_temp', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_disk', 'sensor'),
        ent('entity_net_down', 'sensor'), ent('entity_net_up', 'sensor'), ent('entity_uptime', 'sensor'), ent('entity_power', 'sensor'),
        { type: 'grid', name: '', schema: [num('cpu_busy', 10, 100, 1, 70, '%'), num('temp_max', 40, 110, 1, 85, '°'), num('ram_max', 10, 100, 1, 90, '%'), num('disk_max', 10, 100, 1, 90, '%')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', pl: 'Polski', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_cpu'), bool('show_temp'), bool('show_ram'), bool('show_disk'), bool('show_down'), bool('show_up'), bool('show_uptime'), bool('show_power'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMiniPcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Mini PC BMAX B9 Max en photo : bouton qui respire, air chaud des ouïes, paquets réseau, jauges CPU / RAM / disque (Glances, System Monitor).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
