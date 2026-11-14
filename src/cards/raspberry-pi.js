/* Carte « Raspberry Pi » — custom:appliance-raspberry-pi-card
 * Carte Raspberry Pi 4 vue de dessus, dessinée en SVG, suivie par l'intégration System Monitor (ou Glances / Raspberry Pi Power Supply Checker).
 * Animations : LED verte d'activité qui clignote avec le CPU, LED rouge d'alimentation, LED du port Ethernet et paquets qui montent / descendent selon le débit,
 * halo du processeur qui vire au rouge avec la température, chaleur qui monte en surchauffe, sous-tension (éclair orange).
 * Tuiles avec barre de progression : CPU, température, RAM, disque ; débits, volumes, durée de fonctionnement.
 * États : idle, running, busy, hot, off, unavailable.
 */
(() => {
  const TAG = 'appliance-raspberry-pi-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n raspberry_pi*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --rp-ok:var(--appliance-ok-color,#43a047);--rp-warn:#ffa31a;--rp-alert:var(--appliance-alert-color,#db4437);--rp-blue:#2f9bff;
  --cpu:0;--heat:0;--act:1s;--net-d:0;--net-u:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--rp-ok) 22%,transparent);color:var(--rp-ok)}
.busy .badge{background:color-mix(in srgb,var(--rp-warn) 22%,transparent);color:var(--rp-warn)}
.hot .badge{background:color-mix(in srgb,var(--rp-alert) 22%,transparent);color:var(--rp-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--rp-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;gap:4px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile .bar{display:none;height:4px;border-radius:2px;background:rgba(127,127,127,.22);margin-top:4px;overflow:hidden}
.tile.has-bar .bar{display:block}
.tile .bar b{display:block;height:100%;width:0;border-radius:2px;background:var(--bc,var(--rp-blue));transition:width 1s,background .4s}
.tile.hide{display:none}.tile.bad .v{color:var(--rp-alert)}.tile.bad .bar b{background:var(--rp-alert)}

/* ---- illustration ---- */
.board{transition:filter .6s}
.off .board,.unavailable .board{filter:grayscale(.7) brightness(.6)}
/* halo du processeur : bleu au repos, rouge selon la température */
.glow{opacity:0;transition:opacity .8s}
.idle .glow,.running .glow,.busy .glow,.hot .glow{opacity:calc(.25 + var(--heat) * .65)}
.glow stop{transition:stop-color .6s}
.busy .glow stop{stop-color:#ffa31a}.hot .glow stop{stop-color:#ff3b30}
.hot .glow{animation:rpglow 1.2s ease-in-out infinite}
@keyframes rpglow{50%{opacity:.4}}
/* LED rouge (alimentation) fixe, LED verte (activité) qui clignote plus vite avec le CPU */
.ledr,.ledg{fill:#3a2020;transition:fill .3s}
.idle .ledr,.running .ledr,.busy .ledr,.hot .ledr{fill:#ff3b30;filter:drop-shadow(0 0 2px #ff3b30)}
.uv .ledr{animation:rpblink .5s steps(2) infinite}
.running .ledg,.busy .ledg,.hot .ledg{fill:#5df28a;filter:drop-shadow(0 0 2px #5df28a);animation:rpblink var(--act) steps(2) infinite}
.idle .ledg{fill:#5df28a;filter:drop-shadow(0 0 2px #5df28a);animation:rpblink 2.4s steps(2) infinite}
@keyframes rpblink{50%{opacity:.15}}
/* Ethernet : LED verte (liaison) et ambre (activité) */
.elk,.eac{fill:#2b3138}
.on-net .elk{fill:#5df28a}.on-net .eac{fill:#ffb300;animation:rpblink .35s steps(2) infinite}
.cable{fill:none;stroke:#3a4148;stroke-width:3;stroke-linecap:round}
.pk{fill:none;stroke-width:2.6;stroke-linecap:round;opacity:0}
.pk.d{stroke:#4fc3ff;stroke-dasharray:.1 12}.pk.u{stroke:#5df28a;stroke-dasharray:.1 16}
.on-net .pk.d{opacity:calc(.25 + var(--net-d) * .75);animation:rpdown var(--sd,1.6s) linear infinite}
.on-net .pk.u{opacity:calc(.25 + var(--net-u) * .75);animation:rpup var(--su,1.6s) linear infinite}
@keyframes rpdown{to{stroke-dashoffset:-24}}@keyframes rpup{to{stroke-dashoffset:32}}
/* chaleur au-dessus de la carte */
.heatw path{fill:none;stroke:#ffb74d;stroke-width:1.6;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.busy .heatw path,.hot .heatw path{animation:rpheat 2.2s ease-in infinite}
.hot .heatw path{stroke:#ff5252}
.heatw path:nth-child(2){animation-delay:-.7s}.heatw path:nth-child(3){animation-delay:-1.4s}
@keyframes rpheat{0%{opacity:0;transform:translateY(6px) scaleY(.6)}35%{opacity:.85}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
/* sous-tension : éclair orange qui clignote */
.uvb{display:none;fill:#ffb300;filter:drop-shadow(0 0 3px #ffb300)}
.uv .uvb{display:block;animation:rpblink .7s steps(2) infinite}
/* reflet sur le dissipateur */
.glint{opacity:0}
.idle .glint,.running .glint,.busy .glint,.hot .glint{opacity:1;animation:rpglint 5s ease-in-out infinite}
@keyframes rpglint{0%,55%{transform:translateX(-40px)}100%{transform:translateX(60px)}}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .alert{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(86px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
`;

  // 20 broches du connecteur GPIO (2 rangées de 20) : repères de la carte 300 × 190
  const PINS = Array.from({ length: 20 }, (_, i) => `<rect x="${72 + i * 8}" y="30" width="4" height="4" rx=".6"/><rect x="${72 + i * 8}" y="36" width="4" height="4" rx=".6"/>`).join('');

  /* Carte Pi 4 vue de dessus (85 × 56 mm ≈ 238 × 156), connecteurs à droite (Ethernet, USB) et en bas (USB-C, 2 × micro-HDMI, jack) */
  const SVG = (label) => `
<svg viewBox="0 0 300 190" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="rp-pcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#27a24c"/><stop offset="1" stop-color="#157a35"/></linearGradient>
  <linearGradient id="rp-met" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e7ea"/><stop offset="1" stop-color="#9aa3aa"/></linearGradient>
  <radialGradient id="rp-glow"><stop offset="0" stop-color="#2f9bff" stop-opacity=".7"/><stop offset="1" stop-color="#2f9bff" stop-opacity="0"/></radialGradient>
  <radialGradient id="rp-shadow"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="rp-gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <clipPath id="rp-sink"><rect x="112" y="68" width="48" height="48" rx="3"/></clipPath>
 </defs>
 <ellipse cx="146" cy="180" rx="130" ry="8" fill="url(#rp-shadow)"/>
 <ellipse class="glow" cx="136" cy="92" rx="82" ry="64" fill="url(#rp-glow)"/>
 <!-- câble réseau vers la box -->
 <path class="cable" d="M268 62 C 282 62 288 50 288 34"/>
 <path class="pk d" d="M288 34 C 288 50 282 62 268 62"/>
 <path class="pk u" d="M268 62 C 282 62 288 50 288 34"/>
 <g class="heatw"><path d="M104 62 q-4 -6 0 -12 t0 -12"/><path d="M136 58 q-4 -6 0 -12 t0 -12"/><path d="M168 62 q-4 -6 0 -12 t0 -12"/></g>
 <g class="board">
  <rect x="30" y="22" width="238" height="150" rx="9" fill="url(#rp-pcb)" stroke="#0e5a25" stroke-width="1.5"/>
  <!-- trous de fixation -->
  <g fill="#0b3d19" stroke="#c9a24a" stroke-width="1"><circle cx="40" cy="32" r="3.4"/><circle cx="40" cy="162" r="3.4"/><circle cx="98" cy="32" r="0" /><circle cx="98" cy="162" r="3.4"/></g>
  <!-- GPIO -->
  <rect x="68" y="27" width="168" height="16" rx="1.5" fill="#1b1d20"/><g fill="#c9a24a">${PINS}</g>
  <!-- processeur sous son dissipateur -->
  <rect x="112" y="68" width="48" height="48" rx="3" fill="url(#rp-met)" stroke="#7d868d"/>
  <g stroke="#8a939a" stroke-width="1"><path d="M118 74v36M124 74v36M130 74v36M136 74v36M142 74v36M148 74v36M154 74v36"/></g>
  <g clip-path="url(#rp-sink)"><g transform="skewX(-20)"><rect class="glint" x="90" y="60" width="26" height="70" fill="url(#rp-gl)"/></g></g>
  <!-- mémoire, puces, condensateurs -->
  <rect x="176" y="76" width="30" height="24" rx="2" fill="#1a1c1f"/><rect x="176" y="106" width="22" height="14" rx="2" fill="#1a1c1f"/>
  <rect x="64" y="76" width="30" height="20" rx="2" fill="#1a1c1f"/><rect x="64" y="104" width="14" height="14" rx="2" fill="#2a2e33"/>
  <g fill="#cfd3d6"><rect x="84" y="108" width="6" height="10" rx="1"/><rect x="94" y="108" width="6" height="10" rx="1"/><rect x="104" y="130" width="6" height="10" rx="1"/></g>
  <!-- LED : rouge = alimentation, verte = activité -->
  <circle class="ledr" cx="48" cy="118" r="3"/><circle class="ledg" cx="48" cy="130" r="3"/>
  <text x="56" y="120" font-family="sans-serif" font-size="5" fill="#d7f2dc" opacity=".8">PWR</text><text x="56" y="132" font-family="sans-serif" font-size="5" fill="#d7f2dc" opacity=".8">ACT</text>
  <text x="76" y="156" font-family="sans-serif" font-size="9" font-weight="700" fill="#e9f7ec" opacity=".9" letter-spacing=".4">Raspberry Pi 4 B</text>
  <!-- connecteurs bas : USB-C, 2 × micro-HDMI, jack audio -->
  <rect x="104" y="160" width="18" height="12" rx="2" fill="url(#rp-met)" stroke="#6f777d"/><rect x="108" y="164" width="10" height="4" rx="1.5" fill="#222"/>
  <rect x="134" y="162" width="14" height="10" rx="1.5" fill="url(#rp-met)" stroke="#6f777d"/><rect x="137" y="165" width="8" height="3.4" fill="#222"/>
  <rect x="156" y="162" width="14" height="10" rx="1.5" fill="url(#rp-met)" stroke="#6f777d"/><rect x="159" y="165" width="8" height="3.4" fill="#222"/>
  <rect x="186" y="156" width="14" height="16" rx="2" fill="#23272b" stroke="#555"/>
  <!-- Ethernet (haut droite) et 4 × USB -->
  <rect x="222" y="42" width="52" height="40" rx="2" fill="url(#rp-met)" stroke="#6f777d"/><rect x="230" y="50" width="38" height="26" rx="1.5" fill="#15181c"/>
  <circle class="elk" cx="228" cy="46.5" r="1.8"/><circle class="eac" cx="268" cy="46.5" r="1.8"/>
  <g fill="#c9a24a"><rect x="234" y="66" width="30" height="1.6"/><rect x="234" y="70" width="30" height="1.6"/></g>
  <rect x="222" y="86" width="52" height="38" rx="2" fill="url(#rp-met)" stroke="#6f777d"/><rect x="230" y="91" width="38" height="12" rx="1" fill="#2f77e8"/><rect x="230" y="107" width="38" height="12" rx="1" fill="#2f77e8"/>
  <rect x="222" y="128" width="52" height="38" rx="2" fill="url(#rp-met)" stroke="#6f777d"/><rect x="230" y="133" width="38" height="12" rx="1" fill="#15181c"/><rect x="230" y="149" width="38" height="12" rx="1" fill="#15181c"/>
 </g>
 <path class="uvb" d="M126 124 l-7 12 h5 l-2 10 l9 -14 h-5 l3 -8z"/>
</svg>`;

  // [clé, icône, option d'affichage, entité, barre (0 = non)]
  const TILES = [
    ['cpu', 'mdi:cpu-64-bit', 'show_cpu', 'entity_cpu', 1],
    ['temp', 'mdi:thermometer', 'show_temp', 'entity_cpu_temp', 1],
    ['ram', 'mdi:memory', 'show_ram', 'entity_ram', 1],
    ['ram_free', 'mdi:memory', 'show_ram_free', 'entity_ram_free', 0],
    ['disk', 'mdi:harddisk', 'show_disk', 'entity_disk', 1],
    ['down', 'mdi:download-network', 'show_down', 'entity_net_down', 0],
    ['up', 'mdi:upload-network', 'show_up', 'entity_net_up', 0],
    ['data_down', 'mdi:download', 'show_data_down', 'entity_data_down', 0],
    ['data_up', 'mdi:upload', 'show_data_up', 'entity_data_up', 0],
    ['uptime', 'mdi:timer-outline', 'show_uptime', 'entity_uptime', 0],
    ['power', 'mdi:flash', 'show_power', 'entity_power_status', 0],
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
  // débit → Mbit/s, quelle que soit l'unité
  const toMbit = (v, unit) => {
    if (isNaN(v)) return NaN;
    const m = String(unit || '').replace(/\s/g, '').match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)/);
    if (!m) return v;
    const mul = { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]] * (m[2] ? 1.024 : 1);
    return (v * mul * (/^(B|byte|Bps)$/.test(m[3]) ? 8 : 1)) / 1e6;
  };

  class ApplianceRaspberryPiCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_cpu: f(/(processor_use|cpu_(use|usage|load|percent))/i, 'sensor'),
        entity_cpu_temp: f(/(cpu|processor).*temp/i, 'sensor'),
        entity_ram: f(/(memory_use_percent|memory_usage|ram_use)/i, 'sensor'),
        entity_disk: f(/disk_use_percent|disk_usage/i, 'sensor'),
        entity_uptime: f(/last_boot|uptime/i, 'sensor'),
        entity_power_status: f(/rpi_power|power_status|under_?voltage/i, 'binary_sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_cpu: true, show_temp: true, show_ram: true, show_ram_free: true, show_disk: true, show_down: true, show_up: true,
        show_data_down: true, show_data_up: true, show_uptime: true, show_power: true, cpu_busy: 70, temp_max: 80, ram_max: 90, disk_max: 90, ...c };
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
      const u = String(this._unit(id, 's')).toLowerCase();
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
        <div class="head"><div class="title" id="rptitle"></div><div class="badge" id="rpbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="rpalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div><div class="bar"><b></b></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_cpu));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k); this._more(this._c[t[3]]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // alimentation : binary_sensor « problème » (on = sous-tension) ou texte
    _underV() {
      const s = this._st(this._c.entity_power_status); if (!s) return null;
      const v = String(s.state).toLowerCase();
      if (/^(unavailable|unknown)$/.test(v)) return null;
      return /^(on|true|problem|undervoltage|under_voltage|low|1)$/.test(v);
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const cpu = this._num(c.entity_cpu), ram = this._num(c.entity_ram), dsk = this._num(c.entity_disk), tp = this._temp(c.entity_cpu_temp);
      const raw = s ? String(s.state).toLowerCase() : '';
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && /^(off|not_home|offline|down|false|stopped)$/.test(raw)) st = 'off';
      else if (!s && c.entity_cpu && isNaN(cpu)) st = 'unavailable';
      else st = 'running';
      const alerts = [];
      if (st === 'running') {
        if (!isNaN(tp.v) && tp.v >= Number(c.temp_max)) { st = 'hot'; alerts.push('overheating'); }
        else if (!isNaN(cpu) && cpu >= Number(c.cpu_busy)) st = 'busy';
        else if (!isNaN(cpu) && cpu < 8) st = 'idle';
      }
      const uv = st !== 'off' && st !== 'unavailable' && this._underV() === true;
      if (uv) alerts.push('undervoltage');
      if (st !== 'off' && st !== 'unavailable') {
        if (!isNaN(dsk) && dsk >= Number(c.disk_max)) alerts.push('disk_full');
        if (!isNaN(ram) && ram >= Number(c.ram_max)) alerts.push('ram_full');
      }
      return { st, cpu, ram, dsk, tp, alerts, uv };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, cpu, ram, dsk, tp, alerts, uv } = this._compute();
      const on = st !== 'off' && st !== 'unavailable';
      const clamp = (x) => Math.max(0, Math.min(1, isNaN(x) ? 0 : x));
      const dn = toMbit(this._num(c.entity_net_down), this._unit(c.entity_net_down)), upr = toMbit(this._num(c.entity_net_up), this._unit(c.entity_net_up));
      const lvl = (m) => (isNaN(m) || m <= 0.001 ? 0 : clamp((Math.log10(m) + 3) / 6));
      const nd = lvl(dn), nu = lvl(upr), net = on && (nd > 0 || nu > 0);
      card.className = `${st}${net ? ' on-net' : ''}${uv ? ' uv' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const set = (k, v) => card.style.setProperty(k, v);
      const heat = isNaN(tp.v) ? clamp(cpu / 100) * .6 : clamp((tp.v - 40) / (Number(c.temp_max) - 40));
      set('--cpu', on ? clamp(cpu / 100).toFixed(3) : 0); set('--heat', on ? heat.toFixed(3) : 0);
      set('--act', `${(1.2 - clamp(cpu / 100) * 1.05).toFixed(2)}s`);
      set('--net-d', nd.toFixed(2)); set('--net-u', nu.toFixed(2));
      set('--sd', `${(2.2 - nd * 1.8).toFixed(2)}s`); set('--su', `${(2.2 - nu * 1.8).toFixed(2)}s`);

      r.getElementById('rptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('rpbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('rpalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      const fmtNet = (id) => fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass));
      const volume = (id) => { const [v, u] = fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass)); return [v, String(u).replace(/\/s$|ps$/, '')]; };
      const pow = this._underV();
      const rd = this._num(c.entity_ram_free);
      const V = {
        cpu: [this._fmt(cpu, 0), '%'], temp: [this._fmt(tp.v, 0), tp.unit], ram: [this._fmt(ram, 0), '%'], disk: [this._fmt(dsk, 0), '%'],
        ram_free: [this._fmt(rd, rd < 10 ? 1 : 0), this._unit(c.entity_ram_free, 'MiB')],
        down: fmtNet(c.entity_net_down), up: fmtNet(c.entity_net_up), data_down: volume(c.entity_data_down), data_up: volume(c.entity_data_up),
        uptime: [this._dur(this._uptimeSec(c.entity_uptime)), ''], power: [pow == null ? '--' : this._t(pow ? 'undervoltage_short' : 'power_ok'), ''],
      };
      const bars = { cpu: [cpu, Number(c.cpu_busy)], temp: [tp.v, Number(c.temp_max), 100], ram: [ram, Number(c.ram_max)], disk: [dsk, Number(c.disk_max)] };
      const bad = { temp: st === 'hot', ram: alerts.includes('ram_full'), disk: alerts.includes('disk_full'), power: pow === true };
      const colors = { cpu: '#4f8dff', temp: '#e5533d', ram: '#e5533d', disk: '#9aa3aa' };
      TILES.forEach(([k, , opt, ent, bar]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        el.classList.toggle('hide', !c[ent] || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.classList.toggle('has-bar', !!bar);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        if (bar) {
          const [v, , full] = bars[k], b = el.querySelector('.bar b');
          b.style.width = `${isNaN(v) ? 0 : Math.round(clamp(v / (full || 100)) * 100)}%`;
          b.style.setProperty('--bc', colors[k]);
        }
      });
      window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
    }
  }
  customElements.define(TAG, ApplianceRaspberryPiCard);

  /* ---- éditeur visuel ---- */
  class ApplianceRaspberryPiCardEditor extends HTMLElement {
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
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_cpu', 'sensor'), ent('entity_cpu_temp', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_ram_free', 'sensor'), ent('entity_disk', 'sensor'),
        ent('entity_net_down', 'sensor'), ent('entity_net_up', 'sensor'), ent('entity_data_down', 'sensor'), ent('entity_data_up', 'sensor'), ent('entity_uptime', 'sensor'),
        ent('entity_power_status'),
        { name: 'extra_tiles', selector: { object: {} } },
        { type: 'grid', name: '', schema: [num('cpu_busy', 10, 100, 1, 70, '%'), num('temp_max', 40, 110, 1, 80, '°'), num('ram_max', 10, 100, 1, 90, '%'), num('disk_max', 10, 100, 1, 90, '%')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_cpu'), bool('show_temp'), bool('show_ram'), bool('show_ram_free'), bool('show_disk'), bool('show_down'), bool('show_up'),
          bool('show_data_down'), bool('show_data_up'), bool('show_uptime'), bool('show_power'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass); return T[l][`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  customElements.define(TAG + '-editor', ApplianceRaspberryPiCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Raspberry Pi 4 dessiné en SVG : LED d\'activité, halo de température, paquets réseau, sous-tension, tuiles CPU / RAM / disque avec barres (System Monitor).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/raspberry-pi.md',
  });
})();
