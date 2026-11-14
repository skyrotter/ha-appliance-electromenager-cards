/* Carte « Aquarium récifal (eau de mer) » — custom:appliance-reef-aquarium-card
 * Bac récifal sans cadre sous 1 à 3 rampes LED suspendues : pierres vivantes, coraux (acropora, cerveau, zoanthus, xenia, euphyllia),
 * sable blanc, poissons (chirurgien jaune, poisson-clown, chirurgien bleu, anthias), brasseurs sur les vitres.
 * Animations : faisceaux bleutés des rampes et reflets (caustiques) sur le sable selon la luminosité, coraux qui ondulent,
 * polypes de xenia qui pulsent, poissons qui nagent (plus lentement la nuit), courant des brasseurs, résistance qui rougeoie,
 * flocons de nourriture en mode nourrissage (les courants s'arrêtent), triangle rouge si un paramètre sort de sa plage.
 * Paramètres suivis : température, salinité (ppt ou densité), pH, ORP, KH, calcium, magnésium, nitrates, phosphates, réserve d'osmolation.
 * Équipements : pompe de remontée, brasseurs, écumeur, chauffage, osmolation ; boutons Éclairage et Nourrissage.
 */
(() => {
  const TAG = 'appliance-reef-aquarium-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n reef*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const list = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((s) => String(s).trim()).filter(Boolean);
  const ON_RE = /^(on|true|1|yes|open|running|heat|heating|active|filling)$/i;

  // paramètres de l'eau : clé, icône, option d'entité, plage récifale par défaut, décimales, unité par défaut
  const PARAMS = [
    ['temp', 'mdi:thermometer', 'entity_temperature', 24, 27, 1, ''],
    ['salinity', 'mdi:shaker-outline', 'entity_salinity', 33, 36, 1, 'ppt'],
    ['ph', 'mdi:ph', 'entity_ph', 7.8, 8.5, 2, ''],
    ['orp', 'mdi:flash-triangle-outline', 'entity_orp', 250, 450, 0, 'mV'],
    ['alk', 'mdi:alpha-k-circle-outline', 'entity_alkalinity', 7, 11, 1, 'dKH'],
    ['ca', 'mdi:alpha-c-circle-outline', 'entity_calcium', 380, 460, 0, 'ppm'],
    ['mg', 'mdi:alpha-m-circle-outline', 'entity_magnesium', 1250, 1450, 0, 'ppm'],
    ['no3', 'mdi:test-tube', 'entity_nitrate', 1, 15, 1, 'ppm'],
    ['po4', 'mdi:test-tube', 'entity_phosphate', 0.02, 0.1, 2, 'ppm'],
    ['ato_level', 'mdi:cup-water', 'entity_ato_level', 20, 100, 0, '%'],
    ['power', 'mdi:flash', 'entity_power', NaN, NaN, 0, 'W'],
    ['energy', 'mdi:lightning-bolt-circle', 'entity_energy', NaN, NaN, 2, 'kWh'],
  ];
  // équipements : clé, icône, option d'entité
  const GEAR = [['return', 'mdi:pump', 'entity_return'], ['wave', 'mdi:waves', 'entity_wavemaker'], ['skimmer', 'mdi:filter-outline', 'entity_skimmer'],
    ['heater', 'mdi:radiator', 'entity_heater'], ['ato', 'mdi:water-plus-outline', 'entity_ato']];

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--rf-ok:var(--appliance-ok-color,#43a047);--rf-warn:var(--appliance-warn-color,#ffa000);--rf-alert:var(--appliance-alert-color,#db4437);
  --lc:#7d74ff;--b:1;--slow:1;transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.day .badge{background:color-mix(in srgb,var(--lc) 26%,transparent);color:color-mix(in srgb,var(--lc) 70%,var(--primary-text-color))}
.feed .badge{background:color-mix(in srgb,var(--rf-warn) 24%,transparent);color:var(--rf-warn)}
.alert .badge{background:color-mix(in srgb,var(--rf-alert) 22%,transparent);color:var(--rf-alert)}
ha-card.alert{box-shadow:0 0 0 1px color-mix(in srgb,var(--rf-alert) 60%,transparent),0 0 20px color-mix(in srgb,var(--rf-alert) 28%,transparent)}
svg{display:block;width:100%;max-width:calc(420px * var(--illus-scale,1));height:auto;margin:6px auto 0;cursor:pointer;overflow:visible;border-radius:12px}
/* éclairage : tout ce qui éclaire suit la luminosité --b */
.lit{opacity:0;transition:opacity 1s}
.on .lit{opacity:calc(var(--b) * var(--k,1))}
.face{fill:#2a3038;transition:fill .8s}
.on .face{fill:#e9f0ff;filter:drop-shadow(0 0 6px var(--lc))}
.moon{opacity:0;transition:opacity 1s}ha-card:not(.on) .moon{opacity:.22}
.caus{animation:rfcaus 7s ease-in-out infinite alternate}
@keyframes rfcaus{to{transform:translateX(-26px)}}
.ripple{animation:rfrip 3s ease-in-out infinite alternate}
@keyframes rfrip{to{transform:translateX(-12px)}}
/* coraux et poissons */
.sway{transform-box:fill-box;transform-origin:50% 100%;animation:rfsway calc(4s * var(--slow)) ease-in-out infinite alternate}
.sway.s2{animation-delay:-1.5s}.sway.s3{animation-delay:-3s}
@keyframes rfsway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
.pulse{transform-box:fill-box;transform-origin:50% 100%;animation:rfpulse calc(1.8s * var(--slow)) ease-in-out infinite}
@keyframes rfpulse{50%{transform:scale(.72,.9)}}
.fluo{transition:filter 1s}.on .fluo{filter:drop-shadow(0 0 1.6px currentColor)}
.fish{transform-box:fill-box;transform-origin:center;animation:rfswim calc(var(--dur) * var(--slow)) ease-in-out infinite;animation-delay:var(--dl,0s)}
.fish>g{animation:rfbob 2.2s ease-in-out infinite alternate}
@keyframes rfswim{0%{transform:translateX(0) scaleX(1)}46%{transform:translateX(var(--dx)) scaleX(1)}50%{transform:translateX(var(--dx)) scaleX(-1)}96%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}
@keyframes rfbob{to{transform:translateY(4px)}}
/* brasseurs, nourriture, chauffage, alerte */
.cur{fill:none;stroke:#bfe2ff;stroke-width:1.1;stroke-linecap:round;stroke-dasharray:2 9;opacity:0}
.wave .cur{opacity:.55;animation:rfcur .9s linear infinite}
@keyframes rfcur{to{stroke-dashoffset:-22}}
.flake{opacity:0}
.feed .flake{animation:rfflake 3.2s linear infinite}
@keyframes rfflake{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:1}100%{opacity:0;transform:translateY(96px)}}
.heat{opacity:0;transition:opacity .6s}.heating .heat{opacity:.9;animation:rfglow 1.6s ease-in-out infinite alternate}
@keyframes rfglow{from{opacity:.4}}
.warn{opacity:0}.alert .warn{opacity:1;animation:rfblink 1s steps(2) infinite}
@keyframes rfblink{50%{opacity:.3}}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
/* équipements */
.gear{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin-top:8px}
.chip{display:flex;align-items:center;gap:3px;padding:3px 8px;border-radius:12px;font-size:11px;line-height:14px;background:var(--secondary-background-color);color:var(--secondary-text-color);cursor:pointer}
.chip ha-icon{--mdc-icon-size:14px}.chip.on{background:color-mix(in srgb,var(--rf-ok) 22%,transparent);color:var(--rf-ok)}
.chip.hide{display:none}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:8px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:140px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.sel{background:color-mix(in srgb,var(--lc) 60%,#fff);color:#141428}.ctl button.fsel{background:var(--rf-warn);color:#2a2112}
.ctl button ha-icon{--mdc-icon-size:16px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--rf-alert)}.tile.ok .v{color:var(--primary-text-color)}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{margin-top:3px}.compact .tiles,.compact .gear,.compact .ctl{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  /* ---- dessin : bac récifal 320 × 210 ---- */
  // poisson tourné vers la droite, centré sur (0, 0)
  const FISH = {
    tang: '<path d="M-8 0 L-14 -5 L-13 0 L-14 5 Z" fill="#ffd21f"/><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="#ffd21f"/><path d="M-5 -6 Q1 -11 6 -5 Z M-5 6 Q1 11 6 5 Z" fill="#ffc400"/><path d="M6 1 L10 1" stroke="#fff" stroke-width="1"/><circle cx="5" cy="-2" r="1.3" fill="#1b1b1b"/>',
    clown: '<path d="M-7 0 L-11 -4 L-11 4 Z" fill="#ff7a1a"/><ellipse cx="0" cy="0" rx="7.5" ry="4" fill="#ff7a1a"/><path d="M-3.5 -3.8 V3.8 M2 -4 V4" stroke="#fff" stroke-width="1.8"/><path d="M-3.5 -3.8 V3.8 M2 -4 V4" stroke="#111" stroke-width="2.6" opacity=".35" fill="none"/><path d="M-3.5 -3.8 V3.8 M2 -4 V4" stroke="#fff" stroke-width="1.6"/><circle cx="5" cy="-1" r="1" fill="#111"/>',
    blue: '<path d="M-9 0 L-14 -5 L-13 0 L-14 5 Z" fill="#ffd21f"/><ellipse cx="0" cy="0" rx="10" ry="5.5" fill="#2b6cff"/><path d="M-8 -1 Q-1 -6 6 -2 Q0 -3 -3 2 Z" fill="#0d1a40"/><circle cx="6" cy="-1.5" r="1.1" fill="#111"/>',
    anthias: '<path d="M-5 0 L-9 -3 L-8 0 L-9 3 Z" fill="#ff5fa2"/><ellipse cx="0" cy="0" rx="5.5" ry="2.8" fill="#ff8a5c"/><circle cx="3.5" cy="-.6" r=".8" fill="#111"/>',
  };
  const fish = (kind, x, y, dx, dur, dl, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="fish" style="--dx:${dx}px;--dur:${dur}s;--dl:${dl}s"><g>${FISH[kind]}</g></g></g>`;
  // branche d'acropora : traits épais à bouts ronds en éventail
  const acro = (x, y, col, n, h, cls) => `<g class="sway ${cls} fluo" style="color:${col}">${Array.from({ length: n }, (_, i) => {
    const a = (i - (n - 1) / 2) * 0.32, x2 = x + Math.sin(a) * h, y2 = y - Math.cos(a) * h;
    return `<path d="M${x} ${y} Q${(x + x2) / 2 + Math.sin(a) * 3} ${(y + y2) / 2} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${col}" stroke-width="3.2" stroke-linecap="round" fill="none"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="1.7" fill="#fff" opacity=".7"/>`;
  }).join('')}</g>`;

  const svg = (n, label) => {
    const cx = { 1: [160], 2: [104, 216], 3: [62, 160, 258] }[n];
    const fixture = (x) => `<path d="M${x} 0 V14" stroke="#4a4f57" stroke-width="1.2"/>
      <path class="lit" d="M${x - 37} 28 L${x + 37} 28 L${x + 60} 64 L${x - 60} 64 Z" fill="url(#rfbeam)" style="--k:.75"/>
      <rect x="${x - 42}" y="14" width="84" height="13" rx="3" fill="#14171c" stroke="#30353d"/><rect class="face" x="${x - 38}" y="24" width="76" height="4.5" rx="2"/>`;
    const zoa = [[143, 151, '#ff9d2e'], [148, 149, '#5dff9a'], [153, 151, '#ff9d2e'], [146, 154, '#47b6ff'], [151, 155, '#5dff9a'], [156, 154, '#ff6fcf'], [141, 156, '#47b6ff']]
      .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/><circle cx="${x}" cy="${y}" r=".8" fill="#2b1d10"/>`).join('');
    const xenia = [0, 1, 2, 3].map((i) => `<g class="pulse" style="animation-delay:${-i * 0.4}s"><path d="M${203 + i * 4} 132 v-9" stroke="#e8d9ff" stroke-width="2" stroke-linecap="round"/><circle cx="${203 + i * 4}" cy="122" r="2.6" fill="#f3e8ff"/></g>`).join('');
    const euphy = [0, 1, 2, 3, 4, 5].map((i) => `<path d="M110 160 q${(i - 2.5) * 3} -8 ${(i - 2.5) * 4} -13" stroke="#6fe08a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="${110 + (i - 2.5) * 4}" cy="147" r="1.6" fill="#d7ff9e"/>`).join('');
    const flakes = [128, 146, 163, 179, 194].map((x, i) => `<rect class="flake" x="${x}" y="68" width="2.4" height="1.6" rx=".5" fill="#e0a84a" style="animation-delay:${-i * 0.65}s"/>`).join('');
    const curL = [0, 1, 2].map((i) => `<path class="cur" d="M28 ${92 + i * 6} C70 ${86 + i * 8} 110 ${98 + i * 6} 150 ${92 + i * 5}" style="animation-delay:${-i * .3}s"/>`).join('');
    const curR = [0, 1].map((i) => `<path class="cur" d="M290 ${90 + i * 7} C250 ${84 + i * 8} 220 ${96 + i * 6} 185 ${88 + i * 6}" style="animation-delay:${-i * .4}s"/>`).join('');
    const caus = Array.from({ length: 9 }, (_, i) => `<path d="M${10 + i * 36} 176 q8 -4 16 0 t16 0" stroke="#fff" stroke-width="1.1" fill="none"/>`).join('');
    return `<svg viewBox="0 0 320 210" role="img" aria-label="${esc(label)}"><defs>
      <linearGradient id="rfwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151a2e"/><stop offset="1" stop-color="#0b0e1a"/></linearGradient>
      <linearGradient id="rfbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lc)" stop-opacity=".6"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></linearGradient>
      <linearGradient id="rfwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="color-mix(in srgb,var(--lc) 70%,#fff)"/><stop offset=".55" stop-color="var(--lc)"/><stop offset="1" stop-color="color-mix(in srgb,var(--lc) 60%,#1a0f40)"/></linearGradient>
      <linearGradient id="rfnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#162457"/><stop offset="1" stop-color="#070b22"/></linearGradient>
      <linearGradient id="rfrock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a78"/><stop offset="1" stop-color="#241c38"/></linearGradient>
      <linearGradient id="rfsand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f1ff"/><stop offset="1" stop-color="#cfc7ea"/></linearGradient>
      <clipPath id="rfclip"><rect x="11" y="64" width="298" height="132"/></clipPath></defs>
      <rect width="320" height="210" fill="url(#rfwall)"/>
      ${cx.map(fixture).join('')}
      <g clip-path="url(#rfclip)">
        <rect x="11" y="64" width="298" height="132" fill="url(#rfnight)"/>
        <rect class="lit" x="11" y="64" width="298" height="132" fill="url(#rfwater)" style="--k:.85"/>
        <!-- mur de pierres du fond, couvert de coralline -->
        <path d="M11 150 C20 110 40 92 70 96 C96 84 120 100 146 92 C176 80 206 96 236 88 C262 84 290 100 309 92 V196 H11 Z" fill="#2a2140" opacity=".75"/>
        ${Array.from({ length: 26 }, (_, i) => `<circle cx="${16 + (i * 47) % 290}" cy="${100 + (i * 17) % 50}" r="${1.2 + (i % 3)}" fill="#8b5fb8" opacity=".55"/>`).join('')}
        <!-- pierres vivantes -->
        <path d="M18 182 C22 150 44 132 66 138 C82 120 104 126 112 142 C122 136 134 150 128 182 Z" fill="url(#rfrock)"/>
        <path d="M120 182 C126 148 150 124 172 132 C190 112 220 118 226 140 C240 136 254 152 248 182 Z" fill="url(#rfrock)"/>
        <path d="M238 182 C244 158 262 146 278 152 C292 146 306 160 306 182 Z" fill="url(#rfrock)"/>
        <path d="M60 140 C74 128 92 130 104 140" stroke="#a46cd6" stroke-width="2" fill="none" opacity=".6"/><path d="M160 130 C176 120 196 122 212 132" stroke="#a46cd6" stroke-width="2" fill="none" opacity=".6"/>
        <!-- coraux -->
        ${acro(64, 140, '#c58cff', 6, 18, 's1')}${acro(92, 136, '#7fe0a0', 5, 14, 's2')}${acro(176, 130, '#ff8fb8', 7, 20, 's3')}${acro(262, 152, '#8fd0ff', 5, 14, 's1')}
        <g class="fluo" style="color:#ff6fcf">${zoa}</g>
        <g class="sway s2 fluo" style="color:#6fe08a">${euphy}</g>
        ${xenia}
        <g class="fluo" style="color:#9fd36b"><ellipse cx="282" cy="176" rx="13" ry="8" fill="#8fbf5a"/><path d="M272 176 q5 -5 10 0 t10 0 M274 172 q4 -4 8 0 t8 0" stroke="#cdea8f" stroke-width="1" fill="none"/></g>
        <g class="fluo" style="color:#ff9a5c"><path d="M226 182 C224 168 232 160 240 166 C246 160 254 168 250 182 Z" fill="#ff8a55"/></g>
        <!-- sable et reflets -->
        <path d="M11 180 C70 174 130 184 190 178 C240 174 280 182 309 178 V196 H11 Z" fill="url(#rfsand)"/>
        <g class="lit" style="--k:.45"><g class="caus">${caus}${caus.replace(/M(\d+) 176/g, (_, x) => `M${Number(x) + 18} 186`)}</g></g>
        <!-- poissons -->
        ${fish('tang', 70, 106, 150, 14, 0)}${fish('blue', 230, 98, -120, 17, -5)}${fish('clown', 150, 160, 50, 9, -2, .9)}
        ${fish('anthias', 110, 118, 90, 11, -3)}${fish('anthias', 200, 112, -80, 12, -7)}${fish('anthias', 132, 126, 70, 10, -1, .8)}
        <!-- courant des brasseurs, nourriture -->
        ${curL}${curR}${flakes}
        <!-- clair de lune -->
        <rect class="moon" x="11" y="64" width="298" height="132" fill="#3a5bd8" opacity="0" style="mix-blend-mode:screen"/>
        <path class="ripple" d="M0 66 q10 -2.5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" fill="none"/>
      </g>
      <!-- vitres, brasseurs, résistance -->
      <rect x="10" y="62" width="300" height="135" rx="2" fill="none" stroke="#c9dcff" stroke-opacity=".45" stroke-width="1.5"/>
      <path d="M10 62 H310" stroke="#e4eeff" stroke-opacity=".7" stroke-width="1.5"/>
      <rect x="10" y="196" width="300" height="5" fill="#0d1018"/>
      <g><rect x="14" y="88" width="9" height="16" rx="3" fill="#15181d"/><circle cx="24" cy="96" r="6.5" fill="#1d2127" stroke="#3a4049"/><circle cx="24" cy="96" r="2.4" fill="#0b0d10"/></g>
      <g><rect x="297" y="84" width="9" height="16" rx="3" fill="#15181d"/><circle cx="296" cy="92" r="6.5" fill="#1d2127" stroke="#3a4049"/><circle cx="296" cy="92" r="2.4" fill="#0b0d10"/></g>
      <rect x="300" y="118" width="4" height="40" rx="2" fill="#3a3f46"/><rect class="heat" x="300" y="118" width="4" height="40" rx="2" fill="#ff7a2a" style="filter:drop-shadow(0 0 3px #ff7a2a)"/>
      <g class="warn"><path d="M300 34 L314 58 H286 Z" fill="#e53935" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M300 42 V50" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="300" cy="54" r="1.4" fill="#fff"/></g>
    </svg>`;
  };

  class ApplianceReefAquariumCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), f = (re, d) => ids.find((i) => re.test(i) && (!d || i.startsWith(d))) || '';
      return { entity_light: f(/(reef|recif|aqua)/i, 'light.'), entity_temperature: f(/(reef|recif|aqua).*temp/i, 'sensor.') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { lights: 3, ato_low: 20, show_status: true, show_buttons: true, show_gear: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 4, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _on(id) { const s = this._st(id); return this._ok(s) && ON_RE.test(String(s.state).trim()); }
    _anyOn(v) { return list(v).some((i) => this._on(i)); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { window.applianceMore(this, list(id)[0]); }

    _build() {
      const c = this._c, root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const n = Math.max(1, Math.min(3, Math.round(Number(c.lights) || 3)));
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="rftitle"></div><div class="badge" id="rfbadge"></div></div>
        ${svg(n, c.name || this._t('name'))}
        <div class="gear" id="rfgear">${GEAR.map(([k, ic]) => `<div class="chip hide" data-k="${k}"><ha-icon icon="${ic}"></ha-icon><span></span></div>`).join('')}</div>
        <div class="ctl" id="rfctl"><button id="rflight"><ha-icon icon="mdi:led-strip-variant"></ha-icon><span></span></button><button id="rffeed"><ha-icon icon="mdi:fishbowl-outline"></ha-icon><span></span></button></div>
        <div class="tiles">${PARAMS.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(c.entity_light || c.entity_temperature));
      root.querySelectorAll('.chip').forEach((el) => el.addEventListener('click', () => this._more(c[GEAR.find(([k]) => k === el.dataset.k)[2]])));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(c[PARAMS.find(([k]) => k === el.dataset.k)[2]])));
      // éclairage : bascule toutes les rampes ; nourrissage : script / bouton / interrupteur
      root.getElementById('rflight').addEventListener('click', () => {
        const ids = list(this._c.entity_light); if (!ids.length || !this._hass) return;
        const on = this._anyOn(ids);
        ids.forEach((id) => { const d = id.split('.')[0]; this._hass.callService(d === 'light' ? 'light' : 'homeassistant', on ? 'turn_off' : 'turn_on', { entity_id: id }); });
      });
      root.getElementById('rffeed').addEventListener('click', () => {
        const id = this._c.entity_feed; if (!id || !this._hass) return;
        const d = id.split('.')[0];
        if (d === 'script') this._hass.callService('script', 'turn_on', { entity_id: id });
        else if (d === 'button' || d === 'input_button') this._hass.callService(d, 'press', { entity_id: id });
        else this._hass.callService('homeassistant', 'toggle', { entity_id: id });
      });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // plage d'un paramètre : options <clé>_min / <clé>_max, sinon plage récifale (température convertie, salinité en ppt ou en densité)
    _range(k, def0, def1, v) {
      const c = this._c, tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      let lo = def0, hi = def1;
      if (k === 'temp' && tc) { lo = tc.c(def0); hi = tc.c(def1); }
      if (k === 'salinity' && !isNaN(v) && v < 2) { lo = 1.023; hi = 1.027; }
      const o = (x, d) => (x === '' || x == null || !isFinite(Number(x)) ? d : Number(x));
      return [o(c[`${k}_min`], lo), o(c[`${k}_max`], hi)];
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const lights = list(c.entity_light), ls = lights.map((i) => this._st(i)).filter((s) => this._ok(s));
      const lightOn = lights.length ? ls.some((s) => ON_RE.test(String(s.state))) : true;
      // luminosité moyenne des rampes allumées, couleur de la première (rgb), sinon bleu actinique
      const bri = ls.filter((s) => ON_RE.test(String(s.state)) && isFinite(Number(s.attributes && s.attributes.brightness))).map((s) => Number(s.attributes.brightness) / 255);
      const b = bri.length ? Math.max(0.25, bri.reduce((a, x) => a + x, 0) / bri.length) : 1;
      const rgb = ls.map((s) => s.attributes && s.attributes.rgb_color).find((x) => Array.isArray(x));
      const feeding = this._anyOn(c.entity_feed);
      const pumps = (list(c.entity_wavemaker).length ? this._anyOn(c.entity_wavemaker) : true) && !feeding;
      let bad = 0;
      const V = {};
      PARAMS.forEach(([k, , ek, d0, d1, dec, du]) => {
        const id = c[ek]; let v = this._num(id), unit = this._unit(id, du);
        if (k === 'temp' && tc) { v = tc.conv(v, this._st(id)); unit = tc.unit; }
        let cls = '';
        if (!isNaN(v) && !isNaN(d0)) {
          const [lo, hi] = this._range(k, d0, d1, v);
          const out = k === 'ato_level' ? v <= Number(c.ato_low) : (v < lo || v > hi);
          cls = out ? 'bad' : 'ok'; if (out) bad++;
        }
        if (k === 'salinity' && !isNaN(v) && v < 2) { unit = 'SG'; dec = 3; }
        V[k] = [id, this._fmt(v, dec), unit, cls];
      });
      const known = [...lights, ...PARAMS.map(([, , ek]) => c[ek]), ...GEAR.flatMap(([, , ek]) => list(c[ek]))].some((i) => i && this._ok(this._st(i)));
      const st = !known ? 'unavailable' : bad ? 'alert' : feeding ? 'feed' : lightOn ? 'day' : 'night';
      card.className = `${st}${lightOn ? ' on' : ''}${pumps ? ' wave' : ''}${this._anyOn(c.entity_heater) ? ' heating' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--b', b.toFixed(3));
      card.style.setProperty('--lc', rgb ? `rgb(${rgb.join(',')})` : (typeof c.color === 'string' && c.color) || (Array.isArray(c.color) ? `rgb(${c.color.join(',')})` : '#7d74ff'));
      card.style.setProperty('--slow', lightOn ? '1' : '2.2');
      r.getElementById('rftitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('rfbadge');
      badge.textContent = st === 'alert' ? `${this._t('alert')} (${bad})` : this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      // équipements
      r.getElementById('rfgear').style.display = c.show_gear === false ? 'none' : '';
      r.querySelectorAll('.chip').forEach((el) => {
        const ek = GEAR.find(([k]) => k === el.dataset.k)[2], ids = list(c[ek]);
        el.classList.toggle('hide', !ids.length);
        el.classList.toggle('on', this._anyOn(ids));
        el.querySelector('span').textContent = this._l(el.dataset.k);
      });
      // boutons
      const ctl = r.getElementById('rfctl'), bl = r.getElementById('rflight'), bf = r.getElementById('rffeed');
      bl.classList.toggle('hide', !lights.length); bf.classList.toggle('hide', !c.entity_feed);
      ctl.classList.toggle('hide', c.show_buttons === false || (!lights.length && !c.entity_feed));
      bl.classList.toggle('sel', lightOn && lights.length > 0); bf.classList.toggle('fsel', feeding);
      bl.querySelector('span').textContent = this._l('light'); bf.querySelector('span').textContent = this._l('feed_btn');
      // tuiles
      r.querySelectorAll('.tile').forEach((el) => {
        const k = el.dataset.k, [id, val, unit, cls] = V[k];
        el.className = `tile${!id || c[`show_${k}`] === false ? ' hide' : ''}${cls ? ' ' + cls : ''}`;
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceReefAquariumCard);

  /* ---- éditeur visuel ---- */
  class ApplianceReefAquariumCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      const ent = (name, domain, multiple) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(multiple ? { multiple: true } : {}) } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const sw = ['switch', 'input_boolean', 'binary_sensor', 'sensor', 'fan', 'climate'];
      const rng = (k) => [{ name: `${k}_min`, selector: { number: { mode: 'box', step: 'any' } } }, { name: `${k}_max`, selector: { number: { mode: 'box', step: 'any' } } }];
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        { name: 'lights', default: 3, selector: { number: { min: 1, max: 3, step: 1, mode: 'slider' } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_light', ['light', 'switch', 'input_boolean'], true), { name: 'color', selector: { color_rgb: {} } },
        ent('entity_feed', ['switch', 'input_boolean', 'script', 'button', 'input_button']),
        ...PARAMS.map(([, , ek]) => ent(ek, 'sensor')),
        ent('entity_return', sw), ent('entity_wavemaker', sw, true), ent('entity_skimmer', sw), ent('entity_heater', sw), ent('entity_ato', sw),
        { type: 'grid', name: '', schema: ['temp', 'salinity', 'ph', 'orp', 'alk', 'ca', 'mg', 'no3', 'po4'].flatMap(rng) },
        { name: 'ato_low', default: 20, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_buttons'), bool('show_gear'), bool('animations'), ...PARAMS.map(([k]) => bool(`show_${k}`))] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass); return T[l][`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  customElements.define(TAG + '-editor', ApplianceReefAquariumCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Aquarium récifal (eau de mer) animé : rampes LED, coraux, poissons, brasseurs ; température, salinité, pH, ORP, KH, Ca, Mg, NO3, PO4, osmolation, nourrissage.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/reef-aquarium.md',
  });
})();
