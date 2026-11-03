/* Cartes « Lumières » — dix luminaires animés qui partagent ce fichier
 * custom:appliance-light-bulb-card, -color-bulb-, -filament-bulb-, -pendant-light-, -pendant-cluster-,
 * -desk-lamp-, -floor-lamp-, -chandelier-, -garden-spotlight-, -christmas-tree-card.
 * La couleur de la lumière (--lc) vient de l'ampoule dans Home Assistant (rgb_color, sinon température
 * de blanc en kelvins) ou de l'option `color` ; l'intensité de la lueur (--b) suit la luminosité.
 * Entité light (Allumer / Éteindre, et Couleur pour l'ampoule couleur), switch ou input_boolean.
 */
(() => {
  if (customElements.get('appliance-light-bulb-card')) return;

  const T = /*@i18n light*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--lc:#ffb347;--b:1;--lt-ok:#f5c45e}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.on .badge{background:color-mix(in srgb,var(--lc) 26%,transparent);color:color-mix(in srgb,var(--lc) 75%,var(--primary-text-color))}
.stage{position:relative;margin:4px auto 0;max-width:calc(240px * var(--illus-scale,1));border-radius:14px;background:radial-gradient(ellipse at 50% 55%,#1d232b,#12161b 75%);overflow:hidden;cursor:pointer}
svg{display:block;width:100%;height:auto;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:8px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif);transition:background .3s,color .3s}
.ctl button.sel{background:var(--lt-ok);color:#2a2112}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.ico ha-icon{--mdc-icon-size:22px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- compact : petits emplacements fixes (ex. 120 × 130 px) ; l'illustration prend la hauteur restante ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .stage{flex:1 1 auto;min-height:0;width:100%;max-width:none;margin-top:3px;border-radius:10px}
.compact svg{width:100%;height:100%}
.compact .ctl{flex:none;gap:4px;margin-top:4px}
.compact .ctl button{padding:3px;border-radius:8px;font-size:11px;line-height:14px}
.compact .ctl button ha-icon{--mdc-icon-size:14px}
.compact .ctl button.ico ha-icon{--mdc-icon-size:18px}
.compact .tiles{flex:none;gap:4px;margin-top:4px}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}

/* ---- commun : tout ce qui éclaire ne se voit qu'allumé, à proportion de la luminosité ---- */
.lit{opacity:0;transition:opacity .8s}
.on .lit{opacity:calc(var(--b) * var(--k,1))}
.lcf{fill:var(--lc)}.lcs{stroke:var(--lc)}
.halo{transform-box:fill-box;transform-origin:center}
.on .halo{animation:ltbreath 4s ease-in-out infinite}
@keyframes ltbreath{50%{transform:scale(1.06);opacity:calc(var(--b) * var(--k,1) * .8)}}
.wire{fill:none;stroke:#8a8f96;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;transition:stroke .6s}
.on .wire{stroke:#fff6dc;filter:drop-shadow(0 0 2px var(--lc))}
.cycle .tint{animation:lthue 9s linear infinite}
@keyframes lthue{to{filter:hue-rotate(360deg)}}
@keyframes ltflicker{0%,100%{opacity:calc(var(--b) * var(--k,1))}40%{opacity:calc(var(--b) * var(--k,1) * .82)}55%{opacity:calc(var(--b) * var(--k,1) * .95)}70%{opacity:calc(var(--b) * var(--k,1) * .78)}}
.on .flick{animation:ltflicker 2.3s ease-in-out infinite}
.flick:nth-of-type(2n){animation-delay:-.8s!important}.flick:nth-of-type(3n){animation-delay:-1.5s!important}
@keyframes ltsway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
.sway{transform-box:view-box}
.on .sway{animation:ltsway 6s ease-in-out infinite}
.sway.s2{animation-delay:-2s!important}.sway.s3{animation-delay:-4s!important}
@keyframes ltbeam{0%,100%{opacity:calc(var(--b) * var(--k,1))}50%{opacity:calc(var(--b) * var(--k,1) * .7)}}
.on .beam{animation:ltbeam 3.5s ease-in-out infinite}
.mote{fill:#fff;opacity:0}
.on .mote{animation:ltmote 5s linear infinite}
.mote:nth-of-type(2){animation-delay:-1.2s!important}.mote:nth-of-type(3){animation-delay:-2.6s!important}.mote:nth-of-type(4){animation-delay:-3.8s!important}
@keyframes ltmote{0%{opacity:0;transform:translateY(0)}20%{opacity:calc(var(--b) * .7)}100%{opacity:0;transform:translateY(-70px)}}
.spark{opacity:0}
.on .spark{animation:ltspark 2.6s ease-in-out infinite}
.spark:nth-of-type(2){animation-delay:-.5s!important}.spark:nth-of-type(3){animation-delay:-1.1s!important}.spark:nth-of-type(4){animation-delay:-1.7s!important}.spark:nth-of-type(5){animation-delay:-2.2s!important}
@keyframes ltspark{0%,70%,100%{opacity:0}80%{opacity:var(--b)}}
/* sapin : guirlande qui clignote en séquence, étoile qui rayonne */
.xb{opacity:.35;transition:opacity .4s}
.on .xb{animation:lttwinkle 2.4s steps(1) infinite}
@keyframes lttwinkle{0%{opacity:var(--b)}50%{opacity:.4}}
.on .star{filter:drop-shadow(0 0 6px #ffd54f)}
.star .rays{opacity:0;transform-box:fill-box;transform-origin:center}
.on .star .rays{opacity:var(--b);animation:ltspin 10s linear infinite}
@keyframes ltspin{to{transform:rotate(360deg)}}
.noanim *{animation:none!important}
`;

  // ---- dessins (viewBox 0 0 200 180), gradients préfixés par la sorte pour rester uniques ----
  const halo = (cx, cy, r, k = 0.55) => `<circle class="lit halo lcf" cx="${cx}" cy="${cy}" r="${r}" style="--k:${k}" filter="url(#ltblur)"/>`;
  const DEFS = `<defs>
   <filter id="ltblur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
   <filter id="ltsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
   <radialGradient id="ltglass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></radialGradient>
   <radialGradient id="ltfill" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="var(--lc)" stop-opacity=".95"/><stop offset="1" stop-color="var(--lc)" stop-opacity=".55"/></radialGradient>
   <linearGradient id="ltsteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f767e"/><stop offset=".45" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
   <linearGradient id="ltbrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5f22"/><stop offset=".45" stop-color="#f1cf7a"/><stop offset="1" stop-color="#7b521b"/></linearGradient>
   <linearGradient id="ltcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lc)" stop-opacity=".75"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></linearGradient>
   <linearGradient id="ltup" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="var(--lc)" stop-opacity=".8"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></linearGradient>
  </defs>`;
  const screw = (x, y, w) => `<g><rect x="${x}" y="${y}" width="${w}" height="22" rx="3" fill="url(#ltsteel)"/>
    ${[4, 9, 14].map((d) => `<path d="M${x} ${y + d} L${x + w} ${y + d + 3}" stroke="#4d535a" stroke-width="1.2"/>`).join('')}
    <path d="M${x + 3} ${y + 22} Q${x + w / 2} ${y + 32} ${x + w - 3} ${y + 22} Z" fill="#3b4046"/></g>`;
  const BULB = 'M100 22 C126 22 142 42 142 64 C142 82 130 92 122 104 C118 110 117 116 117 122 L83 122 C83 116 82 110 78 104 C70 92 58 82 58 64 C58 42 74 22 100 22 Z';

  const SVGS = {
    // ampoule classique : verre clair et filament gris, puis verre plein de lumière et filament incandescent
    light_bulb: () => `${halo(100, 70, 70)}
      <path d="${BULB}" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
      <path class="lit" d="${BULB}" fill="url(#ltfill)" style="--k:.9"/>
      <path class="wire" d="M92 120 L92 86 M108 120 L108 86"/>
      <path class="wire" d="M92 86 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5" stroke-width="1.8"/>
      <path d="${BULB}" fill="url(#ltglass)"/>
      ${screw(83, 122, 34)}`,
    // ampoule connectée : verre dépoli opaque, qui se teinte de la couleur choisie (ou fait défiler les teintes)
    color_bulb: () => `<g class="tint">${halo(100, 70, 72, .65)}
      <path d="${BULB}" fill="#e6eaef"/>
      <path class="lit" d="${BULB}" fill="url(#ltfill)" style="--k:1"/></g>
      <path d="${BULB}" fill="url(#ltglass)"/><path d="${BULB}" fill="none" stroke="#fff" stroke-opacity=".5"/>
      <rect x="83" y="118" width="34" height="6" rx="2" fill="#f4f6f8"/>
      ${screw(83, 124, 34)}`,
    // ampoule à filament vintage : verre ambré, filaments verticaux en ressort qui rougeoient et vacillent
    filament_bulb: () => {
      const glass = 'M100 14 C124 14 136 34 136 58 C136 84 124 100 118 112 C116 117 116 120 116 124 L84 124 C84 120 84 117 82 112 C76 100 64 84 64 58 C64 34 76 14 100 14 Z';
      const coil = (x) => `M${x} 104 ${Array.from({ length: 9 }, (_, i) => `q2 -3 0 -6`).join(' ')}`;
      return `${halo(100, 64, 66, .6)}
      <path d="${glass}" fill="#c98a2b" fill-opacity=".28" stroke="#e7b260" stroke-opacity=".55" stroke-width="1.5"/>
      <path class="lit" d="${glass}" fill="url(#ltfill)" style="--k:.55"/>
      <path class="wire" d="M100 118 V52 M86 104 L100 118 L114 104 M86 50 L100 52 L114 50" stroke-width="1.1"/>
      <g class="flick lit" style="--k:1"><path d="${coil(86)} ${coil(93)} ${coil(100)} ${coil(107)} ${coil(114)}" fill="none" stroke="#fff3c4" stroke-width="1.6" filter="url(#ltsoft)"/></g>
      <path d="${coil(86)} ${coil(93)} ${coil(100)} ${coil(107)} ${coil(114)}" class="wire" stroke-width="1.2"/>
      <path d="${glass}" fill="url(#ltglass)"/>
      ${screw(84, 124, 32).replace(/url\(#ltsteel\)/, 'url(#ltbrass)')}`;
    },
    // suspension à abat-jour dôme : l'intérieur s'illumine et un cône de lumière chaude descend
    pendant_light: () => `<path d="M100 0 V40" stroke="#3a3f45" stroke-width="2"/><rect x="94" y="0" width="12" height="5" rx="1.5" fill="#cfd5db"/>
      <path class="lit beam" d="M58 104 L18 180 L182 180 L142 104 Z" fill="url(#ltcone)" style="--k:.7"/>
      <ellipse class="lit" cx="100" cy="176" rx="74" ry="6" fill="var(--lc)" style="--k:.25" filter="url(#ltsoft)"/>
      <rect x="92" y="38" width="16" height="10" rx="2" fill="url(#ltbrass)"/>
      <path d="M100 46 C66 46 46 70 42 102 L158 102 C154 70 134 46 100 46 Z" fill="#525b66"/>
      <path d="M100 46 C80 46 62 58 54 78 C70 60 86 54 100 54 Z" fill="#fff" fill-opacity=".18"/>
      <ellipse cx="100" cy="102" rx="58" ry="7" fill="#2a2f35"/>
      <ellipse class="lit" cx="100" cy="102" rx="56" ry="6" fill="url(#ltfill)" style="--k:1"/>
      <ellipse class="lit" cx="100" cy="104" rx="16" ry="6" fill="#fff8e6" style="--k:1"/>
      <path d="M42 102 L158 102" stroke="#c99a3e" stroke-width="2.5"/>`,
    // grappe de trois globes de verre sur une même barre : chacun brille et éclaire en dessous
    pendant_cluster: () => {
      const globe = (x, y, cls) => `<g class="sway ${cls}" style="transform-origin:${x}px 22px">
        <path d="M${x} 24 V${y - 18}" stroke="#2f3439" stroke-width="1.5"/>
        <rect x="${x - 5}" y="${y - 22}" width="10" height="6" rx="1.5" fill="url(#ltbrass)"/>
        ${halo(x, y, 34, .7)}
        <circle cx="${x}" cy="${y}" r="17" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".4"/>
        <circle class="lit" cx="${x}" cy="${y}" r="16" fill="url(#ltfill)" style="--k:.95"/>
        <path class="wire" d="M${x - 4} ${y + 4} q2 -6 4 0 t4 0"/>
        <circle cx="${x}" cy="${y}" r="17" fill="url(#ltglass)"/></g>`;
      return `<rect x="46" y="16" width="108" height="7" rx="3.5" fill="url(#ltbrass)"/><path d="M100 0 V16" stroke="#2f3439" stroke-width="2"/>
      <ellipse class="lit" cx="100" cy="174" rx="80" ry="7" fill="var(--lc)" style="--k:.3" filter="url(#ltsoft)"/>
      ${globe(66, 92, 's1')}${globe(134, 84, 's2')}${globe(100, 124, 's3')}`;
    },
    // lampe de bureau articulée : l'ampoule brille sous l'abat-jour et éclaire le plan de travail
    desk_lamp: () => `<rect x="0" y="168" width="200" height="12" fill="#2a2420"/>
      <path class="lit beam" d="M126 92 L108 168 L200 168 L168 66 Z" fill="url(#ltcone)" style="--k:.7"/>
      <ellipse class="lit" cx="156" cy="168" rx="44" ry="5" fill="var(--lc)" style="--k:.55" filter="url(#ltsoft)"/>
      <ellipse cx="54" cy="166" rx="26" ry="6" fill="url(#ltsteel)"/><rect x="50" y="150" width="8" height="16" rx="2" fill="#7c838b"/>
      <path d="M54 152 L74 96 L126 56" fill="none" stroke="url(#ltsteel)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="74" cy="96" r="5" fill="#9aa1a8"/><circle cx="128" cy="58" r="4.5" fill="#9aa1a8"/>
      <g transform="rotate(-32 140 66)"><path d="M126 52 L154 52 L166 80 L114 80 Z" fill="#4c555e"/><path d="M126 52 L134 52 L118 80 L114 80 Z" fill="#fff" fill-opacity=".14"/>
       <ellipse cx="140" cy="80" rx="26" ry="4.5" fill="#2a2f35"/><ellipse class="lit" cx="140" cy="80" rx="24" ry="4" fill="url(#ltfill)" style="--k:1"/></g>`,
    // lampadaire trépied : l'abat-jour en tissu rayonne et la lumière filtre en haut et en bas
    floor_lamp: () => `<path class="lit beam" d="M70 42 L40 0 L160 0 L130 42 Z" fill="url(#ltup)" style="--k:.55"/>
      <path class="lit beam" d="M72 104 L52 160 L148 160 L128 104 Z" fill="url(#ltcone)" style="--k:.45"/>
      <path d="M100 104 L64 178 M100 104 L136 178 M100 104 L102 172" stroke="#b07a46" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="106" r="4" fill="#7a5530"/>
      ${halo(100, 74, 56, .45)}
      <path d="M70 42 L130 42 L140 106 L60 106 Z" fill="#e9e1d2"/>
      <path class="lit" d="M70 42 L130 42 L140 106 L60 106 Z" fill="url(#ltfill)" style="--k:.95"/>
      <path d="M70 42 L84 42 L76 106 L60 106 Z" fill="#000" fill-opacity=".1"/><path d="M118 42 L130 42 L140 106 L126 106 Z" fill="#000" fill-opacity=".14"/>
      <path d="M70 42 L130 42 M60 106 L140 106" stroke="#c9bda7" stroke-width="1.5"/>`,
    // lustre à pampilles : les bougies s'allument en vacillant, les cristaux scintillent
    chandelier: () => {
      const candles = [[46, 92], [72, 82], [100, 78], [128, 82], [154, 92]];
      const arm = (x, y) => `<path d="M100 104 C${(100 + x) / 2} 128 ${x} 120 ${x} ${y + 18}" fill="none" stroke="url(#ltbrass)" stroke-width="4" stroke-linecap="round"/>`;
      const candle = ([x, y]) => `<ellipse cx="${x}" cy="${y + 18}" rx="7" ry="2.5" fill="url(#ltbrass)"/><rect x="${x - 3.5}" y="${y + 2}" width="7" height="16" rx="1.5" fill="#f4efe6"/>
        <circle class="lit halo lcf" cx="${x}" cy="${y - 3}" r="12" style="--k:.6" filter="url(#ltsoft)"/>
        <path class="lit flick" d="M${x} ${y - 10} C${x + 4} ${y - 4} ${x + 4} ${y + 2} ${x} ${y + 2} C${x - 4} ${y + 2} ${x - 4} ${y - 4} ${x} ${y - 10} Z" fill="url(#ltfill)" style="--k:1"/>
        <path d="M${x} ${y - 10} C${x + 4} ${y - 4} ${x + 4} ${y + 2} ${x} ${y + 2} C${x - 4} ${y + 2} ${x - 4} ${y - 4} ${x} ${y - 10} Z" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
      const crystal = (x, y) => `<path d="M${x} ${y} L${x + 3} ${y + 6} L${x} ${y + 13} L${x - 3} ${y + 6} Z" fill="#e8f3ff" fill-opacity=".75" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>`;
      const sparks = [[61, 128], [100, 146], [139, 128], [80, 118], [120, 118]].map(([x, y]) => `<path class="spark" d="M${x} ${y - 5} L${x + 1.2} ${y - 1.2} L${x + 5} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 5} L${x - 1.2} ${y + 1.2} L${x - 5} ${y} L${x - 1.2} ${y - 1.2} Z" fill="#fff"/>`).join('');
      return `${halo(100, 96, 84, .4)}
      <rect x="90" y="0" width="20" height="6" rx="2" fill="url(#ltbrass)"/><path d="M100 6 V44" stroke="#9c7a3a" stroke-width="2" stroke-dasharray="3 2"/>
      <path d="M94 44 L106 44 L104 64 Q110 70 106 78 L108 104 L92 104 L94 78 Q90 70 96 64 Z" fill="url(#ltbrass)"/>
      ${candles.map(([x, y]) => arm(x, y)).join('')}
      <circle cx="100" cy="106" r="7" fill="url(#ltbrass)"/>
      ${[[61, 122], [80, 112], [100, 132], [120, 112], [139, 122]].map(([x, y]) => `<path d="M${x} ${y - 8} V${y}" stroke="#d9c79a" stroke-width=".6"/>${crystal(x, y)}`).join('')}
      ${candles.map(candle).join('')}${sparks}`;
    },
    // spot de jardin planté dans la pelouse : la lentille s'allume et un faisceau monte vers le ciel
    garden_spotlight: () => `<path class="lit beam" d="M86 60 L40 0 L160 0 L114 60 Z" fill="url(#ltup)" style="--k:.8"/>
      <g><circle class="mote" cx="92" cy="50" r="1.4"/><circle class="mote" cx="108" cy="46" r="1.1"/><circle class="mote" cx="100" cy="54" r="1.6"/><circle class="mote" cx="96" cy="40" r="1"/></g>
      <path d="M0 160 Q50 152 100 158 T200 156 V180 H0 Z" fill="#20361f"/>
      <g fill="#3f7a3a">${[12, 34, 58, 142, 166, 188].map((x) => `<path d="M${x} 162 l-4 -14 l6 12 l2 -16 l3 18 l6 -12 l-3 14 Z"/>`).join('')}</g>
      <path d="M96 140 L100 172 L104 140 Z" fill="#7c838b"/>
      <rect x="86" y="70" width="28" height="64" rx="5" fill="url(#ltsteel)"/>
      ${[86, 98, 110, 122].map((y) => `<path d="M86 ${y} H114" stroke="#4d535a" stroke-width="1.2" opacity=".6"/>`).join('')}
      <rect x="90" y="132" width="20" height="9" rx="2" fill="#5a6067"/>
      <ellipse cx="100" cy="68" rx="15" ry="5" fill="#3b4046"/><ellipse cx="100" cy="64" rx="15" ry="5" fill="url(#ltsteel)"/>
      <ellipse cx="100" cy="64" rx="11" ry="3.5" fill="#2a2f35"/><ellipse class="lit" cx="100" cy="64" rx="11" ry="3.5" fill="url(#ltfill)" style="--k:1"/>
      <ellipse class="lit" cx="100" cy="60" rx="22" ry="10" fill="var(--lc)" style="--k:.45" filter="url(#ltsoft)"/>`,
    // sapin de Noël : guirlande d'ampoules qui clignotent en séquence et étoile qui rayonne
    christmas_tree: () => {
      const bulbs = [[78, 64], [96, 70], [114, 66], [70, 96], [88, 104], [108, 104], [128, 98], [62, 132], [80, 140], [100, 142], [120, 140], [140, 134]];
      const cols = ['#ff4b4b', '#ffd54f', '#4fc3f7', '#69f0ae', '#ff80ab', '#ffa726'];
      return `<path d="M100 22 L132 70 L118 70 L146 106 L128 106 L158 146 L42 146 L72 106 L54 106 L82 70 L68 70 Z" fill="#1f6b3a"/>
      <path d="M100 22 L132 70 L118 70 L146 106 L128 106 L158 146 L100 146 Z" fill="#000" fill-opacity=".14"/>
      <path d="M78 62 Q100 76 120 64 M68 94 Q98 112 132 96 M58 130 Q100 148 144 132" fill="none" stroke="#d6dde3" stroke-width="1" opacity=".7"/>
      <rect x="92" y="146" width="16" height="12" fill="#6b4524"/><path d="M80 156 L120 156 L114 176 L86 176 Z" fill="#e8edf2"/><path d="M80 156 L120 156" stroke="#c9d1d8" stroke-width="2"/>
      ${bulbs.map(([x, y], i) => `<circle class="xb" cx="${x}" cy="${y}" r="3.6" fill="${cols[i % cols.length]}" data-i="${i}" style="animation-delay:${-(i % 4) * 0.6}s"/>`).join('')}
      <g class="star"><g class="rays"><path d="M100 2 V-6 M100 38 V46 M82 20 H74 M118 20 H126 M88 8 L83 3 M112 8 L117 3 M88 32 L83 37 M112 32 L117 37" stroke="#ffe082" stroke-width="1.6" stroke-linecap="round"/></g>
       <path d="M100 6 L104 16 L115 17 L106 24 L109 35 L100 29 L91 35 L94 24 L85 17 L96 16 Z" fill="#e0b84a"/>
       <path class="lit" d="M100 6 L104 16 L115 17 L106 24 L109 35 L100 29 L91 35 L94 24 L85 17 L96 16 Z" fill="#ffe27a" style="--k:1"/></g>`;
    },
  };

  // couleur par défaut de chaque luminaire (blanc chaud, sauf les cas particuliers)
  const KINDS = {
    light_bulb: { color: '#ffc46b', re: /ampoule|bulb|lampe|lamp/i, icon: 'mdi:lightbulb' },
    color_bulb: { color: '#ff7ad9', re: /ampoule|bulb|rgb|couleur|color|hue/i, icon: 'mdi:lightbulb-variant' },
    filament_bulb: { color: '#ff9f3d', re: /filament|edison|vintage|ampoule|bulb/i, icon: 'mdi:lightbulb-on-outline' },
    pendant_light: { color: '#ffc46b', re: /suspension|pendant|cuisine|kitchen|ilot|island|table/i, icon: 'mdi:ceiling-light' },
    pendant_cluster: { color: '#ffbf5e', re: /suspension|pendant|cluster|grappe|salon|living/i, icon: 'mdi:ceiling-light-multiple' },
    desk_lamp: { color: '#ffd8a0', re: /bureau|desk|lampe|lamp/i, icon: 'mdi:desk-lamp' },
    floor_lamp: { color: '#ffc46b', re: /lampadaire|floor|lampe|lamp|salon/i, icon: 'mdi:floor-lamp' },
    chandelier: { color: '#ffb44d', re: /lustre|chandelier/i, icon: 'mdi:chandelier' },
    garden_spotlight: { color: '#fff1c9', re: /jardin|garden|spot|exterieur|outdoor/i, icon: 'mdi:spotlight-beam' },
    christmas_tree: { color: '#ffd54f', re: /sapin|noel|noël|christmas|xmas|guirlande/i, icon: 'mdi:pine-tree' },
  };
  // couleurs proposées par le bouton « Couleur » de l'ampoule couleur
  const PRESETS = [[255, 122, 217], [64, 156, 255], [52, 211, 153], [255, 196, 70], [255, 82, 82], [167, 114, 255]];

  // température de blanc (K) → couleur affichable
  const kelvin = (k) => {
    const t = Math.max(1000, Math.min(12000, k)) / 100;
    const cl = (v) => Math.round(Math.max(0, Math.min(255, v)));
    const r = t <= 66 ? 255 : cl(329.698727446 * Math.pow(t - 60, -0.1332047592));
    const g = t <= 66 ? cl(99.4708025861 * Math.log(t) - 161.1195681661) : cl(288.1221695283 * Math.pow(t - 60, -0.0755148492));
    const b = t >= 66 ? 255 : t <= 19 ? 0 : cl(138.5177312231 * Math.log(t - 10) - 305.0447927307);
    return `rgb(${r},${g},${b})`;
  };
  // couleur de l'option : [r, g, b] (sélecteur de l'éditeur) ou texte CSS (#ffaa00, orange…)
  const cfgColor = (v) => (Array.isArray(v) && v.length === 3 ? `rgb(${v.map((x) => Math.round(Number(x) || 0)).join(',')})` :
    typeof v === 'string' && /^[#a-z0-9(),.\s%]+$/i.test(v.trim()) ? v.trim() : '');

  class ApplianceLightCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_brightness: true, show_power: true, show_energy: true, show_button_labels: true, follow_light_color: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const color = this.kind === 'color_bulb';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lttitle"></div><div class="badge" id="ltbadge"></div></div>
        <div class="stage"><svg viewBox="0 0 200 180" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${SVGS[this.kind]()}</svg></div>
        <div class="ctl" id="ltctl">
          <button data-a="on"><ha-icon icon="mdi:lightbulb-on"></ha-icon><span></span></button>
          ${color ? '<button data-a="color"><ha-icon icon="mdi:palette"></ha-icon><span></span></button>' : ''}
          <button data-a="off"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${[['brightness', 'mdi:brightness-6'], ['power', 'mdi:flash'], ['energy', 'mdi:lightning-bolt-circle']].map(([k, ic]) =>
          `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      // illustration : tap_action / hold_action (appui long 0,5 s) ; par défaut, la fiche de l'entité
      const stage = root.querySelector('.stage'), stop = () => clearTimeout(this._holdTimer);
      stage.addEventListener('click', () => {
        if (this._held) { this._held = false; return; } // clic qui suit un appui long : ignoré
        if (this._c.tap_action) this._run(this._c.tap_action); else this._more(this._c.entity);
      });
      stage.addEventListener('pointerdown', (ev) => {
        this._held = false;
        if (!this._c.hold_action || (ev.button != null && ev.button > 0)) return;
        stop();
        this._holdTimer = setTimeout(() => { this._held = true; this._run(this._c.hold_action); }, 500);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => stage.addEventListener(t, stop));
      stage.addEventListener('contextmenu', (ev) => { if (this._c.hold_action) ev.preventDefault(); });
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more(k === 'brightness' ? this._c.entity : this._c[`entity_${k}`]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // action standard Home Assistant : more-info / toggle / none gérés ici,
    // le reste (navigate, url, perform-action…) confié à Home Assistant via l'événement hass-action
    _run(a) {
      const c = this._c;
      const type = typeof a === 'string' ? a : a && a.action;
      if (!type || type === 'none' || !this._hass) return;
      if (type === 'more-info') { this._more((a && a.entity) || c.entity); return; }
      if (type === 'toggle' && c.entity) {
        const d = c.entity.split('.')[0];
        this._hass.callService(['light', 'switch', 'input_boolean', 'fan'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity });
        return;
      }
      this.dispatchEvent(new CustomEvent('hass-action', { detail: { config: { entity: c.entity, tap_action: typeof a === 'string' ? { action: a } : a }, action: 'tap' }, bubbles: true, composed: true }));
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'color') {
        // couleur suivante de la liste (presets en configuration, sinon une palette de six teintes)
        const list = Array.isArray(c.presets) && c.presets.length ? c.presets : PRESETS;
        this._preset = ((this._preset ?? -1) + 1) % list.length;
        h.callService('light', 'turn_on', { entity_id: c.entity, rgb_color: list[this._preset] });
        return;
      }
      if (d === 'light') {
        const data = { entity_id: c.entity };
        // allumage avec la couleur choisie dans la carte, si la carte ne suit pas la couleur de l'ampoule
        if (a === 'on' && c.follow_light_color === false && Array.isArray(c.color)) data.rgb_color = c.color;
        h.callService('light', a === 'on' ? 'turn_on' : 'turn_off', data);
      } else h.callService('homeassistant', a === 'on' ? 'turn_on' : 'turn_off', { entity_id: c.entity });
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, K = KINDS[this.kind];
      const s = this._st(c.entity), a = (s && s.attributes) || {};
      const raw = s ? String(s.state) : '';
      const pw = this._num(c.entity_power);
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s) st = /^(on|true|1|home|open)$/i.test(raw) ? 'on' : 'off';
      else st = !isNaN(pw) ? (pw > Number(c.threshold ?? 1) ? 'on' : 'off') : 'unavailable';

      // couleur : celle de l'ampoule (RVB ou kelvins) si on la suit, sinon l'option color, sinon celle du luminaire
      let col = '';
      if (c.follow_light_color !== false) {
        if (Array.isArray(a.rgb_color)) col = `rgb(${a.rgb_color.join(',')})`;
        else if (isFinite(Number(a.color_temp_kelvin))) col = kelvin(Number(a.color_temp_kelvin));
        else if (isFinite(Number(a.color_temp))) col = kelvin(1e6 / Number(a.color_temp));
      }
      col = col || cfgColor(c.color) || K.color;
      const bri = isFinite(Number(a.brightness)) ? Math.max(0.15, Number(a.brightness) / 255) : 1;
      const cycle = this.kind === 'color_bulb' && st === 'on' && (c.color_cycle === true || /loop|rainbow|cycle|colou?r/i.test(String(a.effect || '')));
      card.className = `${st}${cycle ? ' cycle' : ''} ${c.animations === false ? 'noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--lc', col);
      card.style.setProperty('--b', (st === 'on' ? bri : 0).toFixed(3));
      // sapin : guirlande d'une seule couleur si multicolor: false
      if (this.kind === 'christmas_tree') r.querySelectorAll('.xb').forEach((el, i) => {
        const multi = c.multicolor !== false, cc = multi ? el.getAttribute('fill') : col;
        el.style.fill = multi ? '' : col; el.style.filter = st === 'on' ? `drop-shadow(0 0 3px ${cc})` : 'none';
      });

      r.getElementById('lttitle').textContent = c.name || this._t(this.kind);
      const badge = r.getElementById('ltbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('ltctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['light', 'switch', 'input_boolean'].includes(d));
      ctl.querySelectorAll('button').forEach((b) => {
        const k = b.dataset.a;
        const txt = this._l(k === 'on' ? 'turn_on' : k === 'off' ? 'turn_off' : 'color');
        const span = b.querySelector('span');
        span.textContent = txt;
        // icônes seules : libellé masqué, conservé en tooltip / accessibilité
        const icoOnly = c.show_button_labels === false;
        span.style.display = icoOnly ? 'none' : '';
        b.classList.toggle('ico', icoOnly);
        b.title = icoOnly ? txt : '';
        if (icoOnly) b.setAttribute('aria-label', txt); else b.removeAttribute('aria-label');
        b.classList.toggle('sel', k === 'on' ? st === 'on' && !cycle : k === 'off' ? st !== 'on' : cycle);
        if (k === 'color') b.classList.toggle('hide', d !== 'light');
      });

      const energy = this._num(c.entity_energy);
      const V = {
        brightness: [st === 'on' && isFinite(Number(a.brightness)), Math.round(bri * 100), '%', 'show_brightness'],
        power: [c.entity_power, this._fmt(pw, pw < 10 ? 1 : 0), this._unit(c.entity_power, 'W'), 'show_power'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh'), 'show_energy'],
      };
      r.querySelectorAll('.tile').forEach((el) => {
        const [show, val, unit, opt] = V[el.dataset.k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(el.dataset.k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceLightCardEditor extends HTMLElement {
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
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { name: 'tap_action', selector: { ui_action: { actions: ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'] } } },
        { name: 'hold_action', selector: { ui_action: { actions: ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'] } } },
        { name: 'color', selector: { color_rgb: {} } },
        { type: 'grid', name: '', schema: [
          bool('follow_light_color'),
          ...(this.kind === 'color_bulb' ? [bool('color_cycle', false)] : []),
          ...(this.kind === 'christmas_tree' ? [bool('multicolor')] : []),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_button_labels'), bool('show_brightness'), bool('show_power'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace(/_/g, '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceLightCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        return { entity: ids.find((i) => i.startsWith('light.') && K.re.test(i)) || ids.find((i) => i.startsWith('light.')) || '' };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceLightCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, preview: true,
      description: `${T.fr[kind]} animé(e) : la lumière suit l'état, la luminosité et la couleur de l'ampoule.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
