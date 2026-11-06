/* Carte « NAS » — custom:appliance-nas-card (photo détourée du Synology DS423+, 4 baies)
 * Intégration Synology DSM : volume, 4 disques (état + température), CPU, RAM, température, débits,
 * sécurité, mise à jour DSM. Animations : LED des disques qui clignotent selon l'activité, faisceau
 * de lecture qui balaie les baies, paquets qui volent vers l'anneau du volume (écriture) ou en
 * repartent (lecture), baie en défaut qui pulse en rouge, LED STATUS orange qui clignote en alerte,
 * bouton bleu qui respire, chaleur au-dessus du boîtier en surchauffe.
 * États : off, idle, running, busy, warning, unavailable.
 */
(() => {
  const TAG = 'appliance-nas-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n nas*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = 'data:image/webp;base64,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';
  const BAD = /crash|fail|degrad|warn|attention|critical|abnormal|danger|broken|error/i; // états DSM d'un disque / volume en défaut
  const EMPTY = /not_?use|not_?insert|none|empty|absent/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --ns-ok:var(--appliance-ok-color,#43a047);--ns-warn:#ffa31a;--ns-alert:var(--appliance-alert-color,#db4437);--ns-blue:#2f9bff;
  --vol:0;--act:0;--blink:1s;--net-d:0;--net-u:0;--tmp:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--ns-ok) 22%,transparent);color:var(--ns-ok)}
.busy .badge{background:color-mix(in srgb,var(--ns-blue) 22%,transparent);color:var(--ns-blue)}
.warning .badge{background:color-mix(in srgb,var(--ns-alert) 22%,transparent);color:var(--ns-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--ns-alert);font-weight:500;text-align:center}
.alert.on{display:block}
.info{display:none;margin-top:2px;font-size:11px;color:var(--ns-blue);font-weight:500;text-align:center;cursor:pointer}
.info.on{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--ns-alert)}

/* ---- illustration ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:grayscale(.5) brightness(.6)}
.aura{opacity:0;transition:opacity .8s}
.idle .aura,.running .aura,.busy .aura{opacity:calc(.2 + var(--act) * .6)}
.warning .aura{opacity:.85;animation:nsaura 1.6s ease-in-out infinite}
.warning .aura stop{stop-color:#ff3b30}
@keyframes nsaura{50%{opacity:.3}}
/* LED : on masque les LED vertes de la photo puis on les rallume selon l'état */
.ledmask{fill:#17191c}
.led{opacity:0;fill:#3ddc5a;filter:drop-shadow(0 0 1.6px #3ddc5a)}
.on .led{opacity:1}
.on .led.dk{animation:nsblink var(--blink) steps(2) infinite;animation-delay:var(--dl,0s)}
.idle .led.dk{animation:none}
.led.bad{fill:#ff9800;filter:drop-shadow(0 0 2px #ff9800);animation:nsblink .7s steps(2) infinite!important}
.led.empty{opacity:0!important}
.warning .led.st{fill:#ff9800;filter:drop-shadow(0 0 2px #ff9800);animation:nsblink 1s steps(2) infinite}
@keyframes nsblink{50%{opacity:.15}}
.pwr{fill:none;stroke:var(--ns-blue);stroke-width:1.3;opacity:0;filter:drop-shadow(0 0 2.5px var(--ns-blue))}
.on .pwr{opacity:1;animation:nsbreath 3.2s ease-in-out infinite}
@keyframes nsbreath{50%{opacity:.35}}
/* faisceau de lecture qui balaie les baies */
.beam{opacity:0}
.busy .beam,.running .beam{opacity:calc(.25 + var(--act) * .75);animation:nsbeam calc(3.4s - var(--act) * 1.8s) ease-in-out infinite}
@keyframes nsbeam{0%{transform:translateX(-30px)}50%{transform:translateX(112px)}100%{transform:translateX(-30px)}}
.bay{fill:#ff3b30;opacity:0}
.bay.bad{animation:nsbay 1.2s ease-in-out infinite}
@keyframes nsbay{50%{opacity:.38}}
.bayhit{fill:transparent}
/* chaleur au-dessus du boîtier */
.heat path{fill:none;stroke:#ff6e40;stroke-width:1.5;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.hot .heat path{animation:nsheat 2s ease-in infinite}
.heat path:nth-child(2){animation-delay:-.65s}.heat path:nth-child(3){animation-delay:-1.3s}
@keyframes nsheat{0%{opacity:0;transform:translateY(6px) scaleY(.6)}35%{opacity:.85}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
/* flux de données : vers l'anneau (téléversement) et depuis l'anneau (téléchargement) */
.flow{fill:none;stroke-width:2.4;stroke-linecap:round;opacity:0}
.flow.d{stroke:#4fc3ff;stroke-dasharray:.1 11}.flow.u{stroke:#5df28a;stroke-dasharray:.1 14}
.on .flow.d{opacity:calc(var(--net-d) * 1);animation:nsfd var(--sd,1.6s) linear infinite}
.on .flow.u{opacity:calc(var(--net-u) * 1);animation:nsfu var(--su,1.6s) linear infinite}
@keyframes nsfd{to{stroke-dashoffset:-22}}@keyframes nsfu{to{stroke-dashoffset:28}}
/* anneau du volume */
.ring-bg{fill:none;stroke:color-mix(in srgb,var(--primary-text-color) 12%,transparent);stroke-width:6}
.ring{fill:none;stroke:url(#ns-ring);stroke-width:6;stroke-linecap:round;stroke-dasharray:0 100;transition:stroke-dasharray 1.2s cubic-bezier(.3,1.3,.5,1);transform:rotate(-90deg);transform-origin:262px 60px}
.ring.full{stroke:#ff3b30}
.ring-glow{fill:none;stroke:#7c4dff;stroke-width:1;opacity:0;transform-origin:262px 60px}
.on .ring-glow{animation:nsspin 6s linear infinite;opacity:.6}
@keyframes nsspin{to{transform:rotate(360deg)}}
.rv{fill:var(--primary-text-color);font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.rl{fill:var(--secondary-text-color);font:600 6px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;letter-spacing:.06em}
/* mini barres réseau et température */
.mb{fill:color-mix(in srgb,var(--primary-text-color) 10%,transparent)}
.mf{transform-box:fill-box;transform-origin:0 50%;transition:transform 1s cubic-bezier(.3,1.3,.5,1)}
.mf.d{fill:#4fc3ff;transform:scaleX(var(--net-d))}.mf.u{fill:#5df28a;transform:scaleX(var(--net-u))}.mf.t{fill:url(#ns-temp);transform:scaleX(var(--tmp))}
.hot .mf.t{animation:nsblink .8s steps(2) infinite}
.mi{fill:var(--secondary-text-color);font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.off .hud,.unavailable .hud{opacity:.4}
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

  /* Photo 400 × 299 px réduite à 200 de large, posée en (12, 22) : px photo × 0,5 + décalage */
  const BAYS = [[32.5, 21.5], [58, 22], [83.5, 22], [109, 24]];
  const LEDY = [70, 79, 88, 97.5];
  const SVG = (label) => `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="ns-aura"><stop offset="0" stop-color="#2f9bff" stop-opacity=".5"/><stop offset="1" stop-color="#2f9bff" stop-opacity="0"/></radialGradient>
  <radialGradient id="ns-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="ns-beam" x1="0" x2="1"><stop offset="0" stop-color="#8fd3ff" stop-opacity="0"/><stop offset=".5" stop-color="#8fd3ff" stop-opacity=".45"/><stop offset="1" stop-color="#8fd3ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="ns-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00e5ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
  <linearGradient id="ns-temp" x1="0" x2="1"><stop offset="0" stop-color="#4fc3ff"/><stop offset=".6" stop-color="#ffc400"/><stop offset="1" stop-color="#ff3b30"/></linearGradient>
  <clipPath id="ns-bays">${BAYS.map(([x, w]) => `<rect x="${x}" y="47" width="${w}" height="94" rx="1.5"/>`).join('')}</clipPath>
 </defs>
 <ellipse class="aura" cx="112" cy="96" rx="112" ry="78" fill="url(#ns-aura)"/>
 <ellipse cx="112" cy="171" rx="100" ry="6" fill="url(#ns-shadow)"/>
 <g class="heat"><path d="M70 22 q-4 -6 0 -12 t0 -12"/><path d="M110 20 q-4 -6 0 -12 t0 -12"/><path d="M150 20 q-4 -6 0 -12 t0 -12"/></g>
 <path class="flow d" d="M236 60 C 210 20 170 10 140 28"/>
 <path class="flow u" d="M140 28 C 170 10 210 20 236 60"/>
 <image class="photo" href="${IMG}" x="12" y="22" width="200" height="149.5"/>
 ${BAYS.map(([x, w], i) => `<rect class="bay" data-i="${i}" x="${x}" y="47" width="${w}" height="94" rx="1.5"/>`).join('')}
 <g clip-path="url(#ns-bays)"><rect class="beam" x="20" y="45" width="26" height="100" fill="url(#ns-beam)"/></g>
 <g>${[61, ...LEDY].map((y) => `<circle class="ledmask" cx="164.5" cy="${y}" r="1.9"/>`).join('')}</g>
 <circle class="led st" cx="164.5" cy="61" r="1.3"/>
 ${LEDY.map((y, i) => `<circle class="led dk" data-i="${i}" cx="164.5" cy="${y}" r="1.3" style="--dl:-${(i * 0.37).toFixed(2)}s"/>`).join('')}
 <circle class="pwr" cx="157" cy="150.5" r="5.6"/>
 ${BAYS.map(([x, w], i) => `<rect class="bayhit" data-i="${i}" x="${x}" y="47" width="${w}" height="94"><title></title></rect>`).join('')}
 <!-- volume et barres -->
 <g class="hud">
  <circle class="ring-bg" cx="262" cy="60" r="26"/>
  <circle class="ring" cx="262" cy="60" r="26" pathLength="100"/>
  <circle class="ring-glow" cx="262" cy="60" r="32" stroke-dasharray="6 14"/>
  <text class="rv" id="ns-vol" x="262" y="62">--</text>
  <text class="rl" id="ns-voll" x="262" y="71">VOLUME</text>
  <text class="mi" x="226" y="112">↓</text><rect class="mb" x="234" y="107" width="62" height="5" rx="2.5"/><rect class="mf d" x="234" y="107" width="62" height="5" rx="2.5"/>
  <text class="mi" x="226" y="127">↑</text><rect class="mb" x="234" y="122" width="62" height="5" rx="2.5"/><rect class="mf u" x="234" y="122" width="62" height="5" rx="2.5"/>
  <text class="mi" x="225" y="142">°</text><rect class="mb" x="234" y="137" width="62" height="5" rx="2.5"/><rect class="mf t" x="234" y="137" width="62" height="5" rx="2.5"/>
 </g>
</svg>`;

  const TILES = [
    ['volume', 'mdi:database', 'show_volume', 'entity_volume_used'],
    ['cpu', 'mdi:cpu-64-bit', 'show_cpu', 'entity_cpu'],
    ['ram', 'mdi:memory', 'show_ram', 'entity_ram'],
    ['temp', 'mdi:thermometer', 'show_temp', 'entity_temp'],
    ['disks', 'mdi:harddisk', 'show_disks', '_disks'],
    ['down', 'mdi:download-network', 'show_down', 'entity_net_down'],
    ['up', 'mdi:upload-network', 'show_up', 'entity_net_up'],
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
  const toMbit = (v, unit) => {
    if (isNaN(v)) return NaN;
    const u = String(unit || '').replace(/\s/g, '');
    const m = u.match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)/);
    if (!m) return v;
    const mul = { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]] * (m[2] ? 1.024 : 1);
    return (v * mul * (/^(B|byte|Bps)$/.test(m[3]) ? 8 : 1)) / 1e6;
  };

  class ApplianceNasCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      const o = {
        entity_volume: f(/volume_1_status/i, 'sensor'),
        entity_volume_used: f(/volume_1_volume_used|volume_1_.*used.*percent/i, 'sensor'),
        entity_cpu: f(/cpu_utili[sz]ation_total|cpu_load_total/i, 'sensor'),
        entity_ram: f(/memory_usage_real|memory_usage/i, 'sensor'),
        entity_temp: f(/(ds\d|nas|synology|diskstation).*_temperature$/i, 'sensor'),
        entity_net_down: f(/download_throughput/i, 'sensor'),
        entity_net_up: f(/upload_throughput/i, 'sensor'),
      };
      for (let i = 1; i <= 4; i++) {
        o[`entity_drive_${i}`] = f(new RegExp(`(drive|disk)_${i}_status`, 'i'), 'sensor');
        o[`entity_drive_${i}_temp`] = f(new RegExp(`(drive|disk)_${i}_temperature`, 'i'), 'sensor');
      }
      return Object.fromEntries(Object.entries(o).filter(([, v]) => v));
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_volume: true, show_cpu: true, show_ram: true, show_temp: true, show_disks: true, show_network: true, show_power: true,
        cpu_busy: 60, temp_max: 60, disk_temp_max: 50, volume_max: 85, ...c };
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

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="nstitle"></div><div class="badge" id="nsbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="nsalert"></div><div class="info" id="nsinfo"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      const svg = root.querySelector('svg');
      // clic sur une baie : fiche du disque ; ailleurs : action de l'illustration
      svg.addEventListener('click', (e) => {
        const b = e.target.closest && e.target.closest('.bayhit'); if (!b) return;
        const id = this._c[`entity_drive_${+b.dataset.i + 1}`]; if (id) { e.stopImmediatePropagation(); this._more(id); }
      }, true);
      window.applianceBindIllus(this, svg, () => this._more(this._c.entity || this._c.entity_volume || this._c.entity_cpu));
      root.getElementById('nsinfo').addEventListener('click', () => this._more(this._c.entity_update));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k);
        this._more(t[3] === '_disks' ? [1, 2, 3, 4].map((i) => this._c[`entity_drive_${i}`]).find(Boolean) : this._c[t[3]]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _drives() {
      const c = this._c;
      return [1, 2, 3, 4].map((i) => {
        const id = c[`entity_drive_${i}`], s = this._st(id), raw = s ? String(s.state) : '';
        const tp = this._temp(c[`entity_drive_${i}_temp`]);
        const empty = !!s && EMPTY.test(raw);
        const bad = !!s && !empty && (BAD.test(raw) || (!isNaN(tp.v) && tp.v >= Number(c.disk_temp_max)));
        return { i, id, raw, tp, empty, bad, known: !!s };
      });
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), raw = s ? String(s.state).toLowerCase() : '';
      const cpu = this._num(c.entity_cpu), ram = this._num(c.entity_ram), vol = this._num(c.entity_volume_used);
      const tp = this._temp(c.entity_temp), pw = this._watts(c.entity_power);
      const dn = toMbit(this._num(c.entity_net_down), this._unit(c.entity_net_down, 'kB/s')), up = toMbit(this._num(c.entity_net_up), this._unit(c.entity_net_up, 'kB/s'));
      const drives = this._drives();
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && /^(off|not_home|offline|down|false)$/.test(raw)) st = 'off';
      else if (!s && c.entity_cpu && isNaN(cpu) && isNaN(vol)) st = 'unavailable';
      else st = 'running';
      const alerts = [];
      if (st === 'running') {
        const vs = this._st(c.entity_volume);
        if (vs && BAD.test(String(vs.state))) alerts.push(this._t('volume_alert'));
        drives.filter((d) => d.bad).forEach((d) => alerts.push(this._t('drive_alert').replace('{n}', d.i)));
        if (!isNaN(tp.v) && tp.v >= Number(c.temp_max)) alerts.push(this._t('hot'));
        if (!isNaN(vol) && vol >= Number(c.volume_max)) alerts.push(this._t('volume_full'));
        const sec = this._st(c.entity_security);
        if (sec && (sec.state === 'on' || BAD.test(String(sec.state)) || /outofdate|risk/i.test(String(sec.state)))) alerts.push(this._t('security'));
      }
      const lvl = (m) => (isNaN(m) || m <= 0.001 ? 0 : Math.max(0, Math.min(1, (Math.log10(m) + 3) / 6)));
      const nd = lvl(dn), nu = lvl(up);
      const act = Math.max(isNaN(cpu) ? 0 : cpu / 100, nd, nu);
      if (st === 'running') {
        if (alerts.length) st = 'warning';
        else if ((!isNaN(cpu) && cpu >= Number(c.cpu_busy)) || Math.max(nd, nu) > 0.7) st = 'busy';
        else if (act < 0.2) st = 'idle';
      }
      const hot = !isNaN(tp.v) && tp.v >= Number(c.temp_max);
      return { st, cpu, ram, vol, tp, pw, nd, nu, act, drives, alerts, hot };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, cpu, ram, vol, tp, pw, nd, nu, act, drives, alerts, hot } = this._compute();
      const on = st !== 'off' && st !== 'unavailable';
      const clamp = (x) => Math.max(0, Math.min(1, isNaN(x) ? 0 : x));
      card.className = `${st}${on ? ' on' : ''}${hot && on ? ' hot' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const set = (k, v) => card.style.setProperty(k, v);
      set('--vol', clamp(vol / 100).toFixed(3)); set('--act', on ? act.toFixed(2) : 0);
      set('--blink', `${(1.1 - act * 0.9).toFixed(2)}s`);
      set('--net-d', on ? nd.toFixed(2) : 0); set('--net-u', on ? nu.toFixed(2) : 0);
      set('--sd', `${(2.2 - nd * 1.8).toFixed(2)}s`); set('--su', `${(2.2 - nu * 1.8).toFixed(2)}s`);
      // barre de température : 20 °C → vide, temp_max → pleine (échelle dans l'unité d'affichage)
      const tmax = Number(c.temp_max), tmin = tp.unit === '°F' ? 68 : 20;
      set('--tmp', clamp((tp.v - tmin) / (tmax - tmin)).toFixed(3));
      const ring = r.querySelector('.ring');
      ring.classList.toggle('full', !isNaN(vol) && vol >= Number(c.volume_max));
      ring.style.strokeDasharray = `${(clamp(vol / 100) * 100).toFixed(1)} 100`;
      r.getElementById('ns-vol').textContent = isNaN(vol) ? '--' : `${Math.round(vol)}%`;
      r.getElementById('ns-voll').textContent = this._l('volume').toUpperCase();
      drives.forEach((d) => {
        const led = r.querySelector(`.led.dk[data-i="${d.i - 1}"]`);
        led.classList.toggle('bad', on && d.bad); led.classList.toggle('empty', d.empty);
        r.querySelector(`.bay[data-i="${d.i - 1}"]`).classList.toggle('bad', on && d.bad);
        const tip = r.querySelector(`.bayhit[data-i="${d.i - 1}"] title`);
        tip.textContent = `${this._t('disk')} ${d.i}${d.known ? ` · ${d.raw}` : ''}${isNaN(d.tp.v) ? '' : ` · ${this._fmt(d.tp.v, 0)} ${d.tp.unit}`}`;
      });

      r.getElementById('nstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('nsbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('nsalert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);
      const upd = this._st(c.entity_update);
      const info = r.getElementById('nsinfo'); info.textContent = this._t('update'); info.classList.toggle('on', !!upd && upd.state === 'on');

      const fmtNet = (id) => fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass));
      const known = drives.filter((d) => d.known && !d.empty), ok = known.filter((d) => !d.bad).length;
      const temps = drives.map((d) => d.tp.v).filter((v) => !isNaN(v));
      const V = {
        volume: [this._fmt(vol, 0), '%'], cpu: [this._fmt(cpu, 0), '%'], ram: [this._fmt(ram, 0), '%'], temp: [this._fmt(tp.v, 0), tp.unit],
        disks: known.length ? [`${ok}/${known.length}`, temps.length ? `${this._fmt(Math.max(...temps), 0)}${tp.unit}` : ''] : ['--', ''],
        down: fmtNet(c.entity_net_down), up: fmtNet(c.entity_net_up), power: [this._fmt(pw, 0), 'W'],
      };
      const bad = { volume: !isNaN(vol) && vol >= Number(c.volume_max), temp: hot, disks: ok < known.length };
      TILES.forEach(([k, , opt, ent]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        const has = ent === '_disks' ? known.length > 0 : !!c[ent];
        el.classList.toggle('hide', !has || c[opt] === false || (c.show_network === false && (k === 'down' || k === 'up')));
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceNasCard);

  /* ---- éditeur visuel ---- */
  class ApplianceNasCardEditor extends HTMLElement {
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
        ent('entity'), ent('entity_volume', 'sensor'), ent('entity_volume_used', 'sensor'), ent('entity_cpu', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_temp', 'sensor'),
        ent('entity_net_down', 'sensor'), ent('entity_net_up', 'sensor'),
        { type: 'grid', name: '', schema: [1, 2, 3, 4].flatMap((i) => [ent(`entity_drive_${i}`, 'sensor'), ent(`entity_drive_${i}_temp`, 'sensor')]) },
        ent('entity_security', 'binary_sensor'), ent('entity_update', 'update'), ent('entity_power', 'sensor'),
        { type: 'grid', name: '', schema: [num('cpu_busy', 10, 100, 1, 60, '%'), num('volume_max', 10, 100, 1, 85, '%'), num('temp_max', 30, 100, 1, 60, '°'), num('disk_temp_max', 30, 80, 1, 50, '°')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_volume'), bool('show_cpu'), bool('show_ram'), bool('show_temp'), bool('show_disks'), bool('show_down'), bool('show_up'), bool('show_power'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceNasCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'NAS Synology DS423+ en photo : LED des 4 disques selon l\'activité, faisceau sur les baies, disque en défaut, anneau du volume, flux réseau (Synology DSM).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
