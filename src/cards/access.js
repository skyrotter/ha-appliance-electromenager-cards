/* Cartes « Accès » — barrière levante, portail coulissant, portail battant, porte de garage
 * custom:appliance-barrier-card, appliance-sliding-gate-card, appliance-swing-gate-card,
 * appliance-garage-door-card. Une entité cover (ou binary_sensor / switch / input_boolean / sensor
 * texte) donne l'état ; current_position pilote l'illustration quand elle existe.
 * La position est une propriété CSS enregistrée (--acc-p, 0 fermé → 100 ouvert) : sa transition
 * dure le temps de course réel du moteur, et lisse les mises à jour de current_position.
 * États : open, closed, opening, closing, partial, unavailable. Gyrophare pendant le mouvement,
 * boutons ouvrir / stop / fermer (ou impulsion), puissance, énergie et coût du moteur.
 */
(() => {
  if (customElements.get('appliance-barrier-card')) return;

  const T = /*@i18n access*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // --acc-p animable seulement si enregistrée comme <number> ; sinon repli sur une transition de transform
  let typed = false;
  try { CSS.registerProperty({ name: '--acc-p', syntax: '<number>', inherits: true, initialValue: '0' }); typed = true; }
  catch (e) { typed = !!e && e.name === 'InvalidModificationError'; } // déjà enregistrée par une autre copie

  const CSS_TXT = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--acc-move:var(--appliance-heat-color,#ff8a3d);--acc-ok:var(--appliance-ok-color,#43a047);
  --acc-cold:var(--appliance-cold-color,#2b9af9);--acc-beacon:#ffa31a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--acc-ok) 22%,transparent);color:var(--acc-ok)}
.opening .badge,.closing .badge{background:color-mix(in srgb,var(--acc-move) 22%,transparent);color:var(--acc-move)}
.partial .badge{background:color-mix(in srgb,var(--acc-cold) 22%,transparent);color:var(--acc-cold)}
.scene{position:relative;width:100%;max-width:calc(260px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:4px auto 0;cursor:pointer;
  --acc-p:0;transition:--acc-p var(--acc-t,0s) linear}
.scene>svg,.scene>.leaf{position:absolute}
.scene>svg{inset:0;width:100%;height:100%;overflow:visible}
.notyped .mv{transition:transform var(--acc-t,0s) linear}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.hide{display:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- éléments communs ---- */
/* gyrophare orange : clignote pendant le mouvement */
.lamp{fill:#8a6a3a}
.halo{opacity:0;transform-box:fill-box;transform-origin:center}
.moving .lamp{fill:var(--acc-beacon);animation:accblink .7s steps(2) infinite}
.moving .halo{animation:accflash .7s ease-out infinite}
@keyframes accblink{50%{fill:#8a6a3a}}
@keyframes accflash{0%{opacity:.85;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
.led{fill:#5b6570}
.closed .led{fill:#db4437}.open .led,.partial .led{fill:#43a047}.moving .led{fill:var(--acc-beacon);animation:accblinkled .5s steps(2) infinite}
@keyframes accblinkled{50%{opacity:.25}}
.unavailable .scene{filter:grayscale(.7) opacity(.7)}
/* roues du portail coulissant */
.wheel{transform-box:fill-box;transform-origin:center}
.opening .wheel{animation:accspin .9s linear infinite}.closing .wheel{animation:accspin .9s linear infinite reverse}
@keyframes accspin{to{transform:rotate(360deg)}}

/* ---- barrière : le bras pivote de 0 à 90° ---- */
.arm{transform-box:view-box;transform-origin:49px 150px;transform:rotate(calc(var(--acc-p) * -0.9deg))}
.armled{fill:#ff4b3e}
.open .armled,.partial .armled{fill:#58e06a}
.moving .armled{fill:var(--acc-beacon);animation:accblinkled .5s steps(2) infinite}
/* ---- portail coulissant : le vantail glisse derrière le pilier ---- */
.slide{transform:translateX(calc(var(--acc-p) * 1.06px))}
/* ---- portail battant : vantaux en 3D, pivot sur les piliers, ouverture vers l'intérieur ---- */
.leaf{top:33.5%;height:52%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.swing{perspective:520px;perspective-origin:50% 35%}
.leaf.l{transform-origin:0 50%;transform:rotateY(calc(var(--acc-p) * 0.82deg))}
.leaf.r{transform-origin:100% 50%;transform:rotateY(calc(var(--acc-p) * -0.82deg))}
.leaf .shade{opacity:calc(var(--acc-p) * .005)}
/* ---- porte de garage : les sections remontent sous le linteau ---- */
.door{transform:translateY(calc(var(--acc-p) * -1.02px))}
.bulb{opacity:0;transition:opacity .6s}
.open .bulb,.partial .bulb,.opening .bulb,.closing .bulb{opacity:1}
.noanim *{animation:none!important}
`;

  const GROUND = (w, y) => `<ellipse cx="${w / 2}" cy="${y + 6}" rx="${w / 2 - 8}" ry="5" fill="#000" opacity=".16"/>`;
  const BEACON = (x, y) => `
 <circle class="halo" cx="${x}" cy="${y - 3}" r="11" fill="#ffb84d"/>
 <rect x="${x - 6}" y="${y + 1}" width="12" height="4" rx="1" fill="#30363d"/>
 <path class="lamp" d="M${x - 5} ${y + 1} V${y - 3} A5 5 0 0 1 ${x + 5} ${y - 3} V${y + 1} Z"/>
 <path d="M${x - 2.5} ${y - 4} A2.5 2.5 0 0 1 ${x} ${y - 6.5}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".55"/>`;
  const DEFS = `
  <linearGradient id="accstone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".6" stop-color="#dfe4e8"/><stop offset="1" stop-color="#b9c1c9"/></linearGradient>
  <linearGradient id="accmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6670"/><stop offset="1" stop-color="#2d333a"/></linearGradient>
  <linearGradient id="accroad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5059"/><stop offset="1" stop-color="#363b42"/></linearGradient>
  <radialGradient id="accchrome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bfc8d0"/><stop offset="1" stop-color="#6c7782"/></radialGradient>`;
  const PILLAR = (x, w, top, bot) => `
 <rect x="${x}" y="${top}" width="${w}" height="${bot - top}" fill="url(#accstone)" stroke="#9aa5ae" stroke-width=".8"/>
 <rect x="${x - 3}" y="${top - 6}" width="${w + 6}" height="7" rx="1.5" fill="#cfd6dc" stroke="#9aa5ae" stroke-width=".8"/>
 <rect x="${x - 2}" y="${bot - 6}" width="${w + 4}" height="6" fill="#c3cad0"/>`;

  // barrière levante : armoire à gauche, bras rayé rouge et blanc, fourche d'appui à droite
  const SVG_BARRIER = () => `
<svg viewBox="0 0 260 200" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="acccab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd54a"/><stop offset=".55" stop-color="#f2b705"/><stop offset="1" stop-color="#c98f00"/></linearGradient>
 </defs>
 ${GROUND(260, 186)}
 <rect x="0" y="176" width="260" height="14" rx="3" fill="url(#accroad)"/>
 <path d="M10 183 H250" stroke="#f5f5f5" stroke-width="1.6" stroke-dasharray="14 10" opacity=".7"/>
 <!-- fourche d'appui -->
 <rect x="203" y="152" width="7" height="26" fill="url(#accmetal)"/>
 <path d="M200 142 V155 H213 V142" fill="none" stroke="#3a4148" stroke-width="3" stroke-linejoin="round"/>
 <rect x="199" y="175" width="15" height="4" rx="1" fill="#2d333a"/>
 <!-- bras (pivote autour du moyeu) -->
 <g class="arm mv">
  <rect x="44" y="145" width="160" height="10" rx="5" fill="#fafafa" stroke="#aab2ba" stroke-width=".8"/>
  <g fill="#d8322b"><rect x="66" y="145" width="14" height="10"/><rect x="94" y="145" width="14" height="10"/><rect x="122" y="145" width="14" height="10"/><rect x="150" y="145" width="14" height="10"/><path d="M178 145 H192 V155 H178 Z"/></g>
  <g class="armled"><circle cx="73" cy="150" r="1.4"/><circle cx="115" cy="150" r="1.4"/><circle cx="157" cy="150" r="1.4"/><circle cx="198" cy="150" r="1.4"/></g>
  <path d="M50 147 H200" stroke="#fff" stroke-width="1.2" opacity=".6"/>
 </g>
 <!-- armoire -->
 <rect x="30" y="124" width="38" height="54" rx="3" fill="url(#acccab)" stroke="#9c7200" stroke-width=".8"/>
 <rect x="26" y="118" width="46" height="8" rx="2" fill="#3a4148"/>
 <rect x="35" y="160" width="28" height="14" rx="2" fill="none" stroke="#9c7200" stroke-width=".8" opacity=".7"/>
 <circle cx="58" cy="167" r="1.5" fill="#5a4400"/>
 <rect x="26" y="176" width="46" height="5" rx="1" fill="#2d333a"/>
 <circle cx="49" cy="150" r="8.5" fill="url(#accchrome)" stroke="#555e68" stroke-width=".8"/>
 <circle cx="49" cy="150" r="2.4" fill="#3a4148"/>
 <circle class="led" cx="38" cy="131" r="2"/>
 ${BEACON(49, 112)}
</svg>`;

  // portail coulissant : vantail à barreaux sur rail, devant un muret, moteur au sol
  const SVG_SLIDING = () => {
    let bars = '';
    for (let x = 42; x <= 140; x += 7) bars += `<rect x="${x}" y="70" width="3" height="72" rx="1"/>`;
    let spikes = '';
    for (let x = 43.5; x <= 141.5; x += 7) spikes += `<path d="M${x - 2.4} 70 L${x} 64 L${x + 2.4} 70 Z"/>`;
    const wheel = (cx) => `<g class="wheel"><circle cx="${cx}" cy="145" r="4.5" fill="#2d333a"/><path d="M${cx - 3} 145 H${cx + 3} M${cx} 142 V148" stroke="#9aa3ab" stroke-width="1"/></g>`;
    return `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="accwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3dccf"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
 </defs>
 ${GROUND(260, 150)}
 <rect x="0" y="148" width="260" height="12" rx="2" fill="url(#accroad)"/>
 <path d="M20 149 H252" stroke="#a9b1b8" stroke-width="2"/>
 <!-- muret le long duquel le vantail glisse -->
 <rect x="160" y="104" width="94" height="44" fill="url(#accwall)" stroke="#a89f8f" stroke-width=".8"/>
 <rect x="157" y="99" width="100" height="6" rx="1.5" fill="#d7d0c3" stroke="#a89f8f" stroke-width=".8"/>
 <g stroke="#b3a996" stroke-width=".7" opacity=".7"><path d="M160 118 H254 M160 133 H254 M190 104 V118 M226 104 V118 M174 118 V133 M210 118 V133 M244 118 V133 M190 133 V148 M226 133 V148"/></g>
 <!-- vantail -->
 <g class="slide mv">
  <g fill="#2f353c">${bars}${spikes}</g>
  <rect x="36" y="68" width="110" height="5" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="104" width="110" height="4" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="138" width="110" height="5" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="68" width="4" height="75" fill="#3a4148"/><rect x="142" y="68" width="4" height="75" fill="#3a4148"/>
  <path d="M38 70 H144" stroke="#fff" stroke-width=".8" opacity=".25"/>
  ${wheel(52)}${wheel(130)}
 </g>
 <!-- moteur -->
 <rect x="168" y="130" width="24" height="18" rx="3" fill="url(#accmetal)"/>
 <rect x="171" y="133" width="18" height="3" rx="1" fill="#8b949c" opacity=".6"/>
 <circle class="led" cx="186" cy="141" r="1.8"/>
 <!-- piliers -->
 ${PILLAR(146, 16, 56, 150)}
 ${PILLAR(16, 18, 56, 150)}
 <rect x="20" y="90" width="9" height="14" rx="1.5" fill="#2d333a"/><circle cx="24.5" cy="95" r="1.6" fill="#7fe3ff"/><rect x="22" y="99" width="5" height="2.5" rx=".8" fill="#8b949c"/>
 ${BEACON(25, 44)}
</svg>`;
  };

  // portail battant : décor (allée, haie) / deux vantaux HTML en 3D / piliers devant
  const SVG_SWING_BACK = () => `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}</defs>
 ${GROUND(260, 150)}
 <path d="M0 94 H260 V150 H0 Z" fill="#5f8f4e" opacity=".55"/>
 <path d="M0 86 Q40 78 80 86 T160 84 T260 86 V98 H0 Z" fill="#3f6b38" opacity=".8"/>
 <path d="M100 96 H160 L232 150 H28 Z" fill="#9aa1a8" opacity=".85"/>
 <g stroke="#7f878f" stroke-width=".7" opacity=".7"><path d="M90 104 H170 M78 114 H182 M62 126 H198 M44 139 H216"/></g>
 <rect x="0" y="148" width="260" height="12" rx="2" fill="url(#accroad)"/>
</svg>`;
  // un vantail : viewBox w×88, barreaux sous une crête courbe qui monte vers le milieu
  const LEAF = (w, mirror) => {
    const top = (x) => { const u = mirror ? 1 - x / w : x / w; return 16 - 11 * u * u; };
    let bars = '', spikes = '';
    for (let x = 7; x <= w - 6; x += 7) {
      const y = top(x);
      bars += `<rect x="${x - 1.5}" y="${y.toFixed(1)}" width="3" height="${(82 - y).toFixed(1)}" rx="1"/>`;
      spikes += `<circle cx="${x}" cy="${(y - 2).toFixed(1)}" r="2.2"/>`;
    }
    let rail = `M0 ${top(0).toFixed(1)}`;
    for (let x = 4; x <= w; x += 4) rail += ` L${x} ${top(x).toFixed(1)}`;
    const lockX = mirror ? 3 : w - 11;
    return `<svg viewBox="0 0 ${w} 88" preserveAspectRatio="none">
  <g fill="#2f353c">${bars}${spikes}</g>
  <path d="${rail}" fill="none" stroke="#3a4148" stroke-width="5" stroke-linejoin="round"/>
  <rect x="0" y="44" width="${w}" height="4" rx="1.5" fill="#3a4148"/>
  <rect x="0" y="78" width="${w}" height="6" rx="1.5" fill="#3a4148"/>
  <rect x="0" y="${top(0) - 2}" width="4" height="${86 - top(0)}" fill="#3a4148"/><rect x="${w - 4}" y="${top(w) - 2}" width="4" height="${86 - top(w)}" fill="#3a4148"/>
  <rect x="${lockX}" y="50" width="8" height="12" rx="1.5" fill="#1f2429" stroke="#555e68" stroke-width=".6"/><rect x="${lockX + 2.5}" y="54" width="3" height="1.6" fill="url(#accchrome)"/>
  <rect class="shade" x="0" y="0" width="${w}" height="88" fill="#000"/>
 </svg>`;
  };
  const SVG_SWING_FRONT = () => `
<svg viewBox="0 0 260 170" aria-hidden="true" style="pointer-events:none">
 <defs>${DEFS}</defs>
 ${PILLAR(14, 22, 48, 150)}
 ${PILLAR(224, 22, 48, 150)}
 <g fill="#3a4148"><rect x="35" y="66" width="4" height="7" rx="1"/><rect x="35" y="124" width="4" height="7" rx="1"/><rect x="221" y="66" width="4" height="7" rx="1"/><rect x="221" y="124" width="4" height="7" rx="1"/></g>
 <rect x="19" y="88" width="11" height="16" rx="1.5" fill="#2d333a"/><circle cx="24.5" cy="93" r="1.8" fill="#7fe3ff"/><rect x="21.5" y="98" width="6" height="2.5" rx=".8" fill="#8b949c"/>
 <circle class="led" cx="235" cy="96" r="1.8"/>
 ${BEACON(235, 36)}
</svg>`;

  // porte de garage sectionnelle : façade, intérieur avec voiture et plafonnier, sections qui remontent
  const SVG_GARAGE = () => {
    let panels = '';
    for (let i = 0; i < 4; i++) {
      const y = 46 + i * 26;
      panels += `<rect x="42" y="${y}" width="176" height="26" fill="url(#accpanel)" stroke="#9aa5ae" stroke-width=".8"/>
   <path d="M44 ${y + 9} H216 M44 ${y + 17} H216" stroke="#b7c0c8" stroke-width=".8"/>
   <path d="M44 ${y + 1.5} H216" stroke="#fff" stroke-width=".8" opacity=".7"/>`;
    }
    let wins = '';
    for (let i = 0; i < 5; i++) wins += `<rect x="${56 + i * 31}" y="50" width="24" height="10" rx="1.5" fill="#2b3640" stroke="#8d969e" stroke-width=".8"/><path d="M${58 + i * 31} 52 L${64 + i * 31} 52" stroke="#9fd3ff" stroke-width="1" opacity=".55"/>`;
    return `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="accpanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f4f6"/><stop offset="1" stop-color="#cdd4da"/></linearGradient>
  <linearGradient id="accfacade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ddd5"/><stop offset="1" stop-color="#cfc8bd"/></linearGradient>
  <linearGradient id="accinside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f25"/><stop offset="1" stop-color="#2b3138"/></linearGradient>
  <radialGradient id="acclight" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".75"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
  <clipPath id="accgap"><rect x="42" y="46" width="176" height="104"/></clipPath>
 </defs>
 ${GROUND(260, 152)}
 <rect x="8" y="22" width="244" height="130" fill="url(#accfacade)" stroke="#b3ab9e" stroke-width=".8"/>
 <rect x="2" y="14" width="256" height="10" rx="2" fill="#4a5058"/>
 <rect x="0" y="150" width="260" height="12" rx="2" fill="url(#accroad)"/>
 <!-- intérieur visible quand la porte remonte -->
 <rect x="42" y="46" width="176" height="104" fill="url(#accinside)"/>
 <g class="bulb"><path d="M130 50 L60 150 H200 Z" fill="url(#acclight)"/><circle cx="130" cy="50" r="3" fill="#fff6d0"/></g>
 <g>
  <path d="M84 146 V112 Q86 98 100 96 H160 Q174 98 176 112 V146 Z" fill="#2f6db5"/>
  <path d="M96 99 Q100 88 110 86 H150 Q160 88 164 99 Z" fill="#1d4a80"/>
  <path d="M100 98 Q104 90 112 89 H148 Q156 90 160 98 Z" fill="#9cc6ea" opacity=".55"/>
  <rect x="88" y="114" width="16" height="6" rx="2" fill="#e53935"/><rect x="156" y="114" width="16" height="6" rx="2" fill="#e53935"/>
  <rect x="116" y="124" width="28" height="8" rx="1" fill="#f2f2f2"/>
  <rect x="84" y="136" width="92" height="8" rx="2" fill="#1f3f66"/>
  <rect x="88" y="142" width="14" height="8" rx="2" fill="#15191d"/><rect x="158" y="142" width="14" height="8" rx="2" fill="#15191d"/>
 </g>
 <!-- porte -->
 <g clip-path="url(#accgap)"><g class="door mv">
  ${panels}${wins}
  <rect x="122" y="136" width="16" height="3" rx="1.5" fill="url(#accchrome)"/>
  <rect x="42" y="146" width="176" height="4" fill="#2d333a"/>
 </g></g>
 <!-- encadrement et linteau -->
 <rect x="38" y="42" width="184" height="108" fill="none" stroke="#9aa1a8" stroke-width="5"/>
 <rect x="34" y="38" width="192" height="6" rx="1" fill="#8d949b"/>
 <!-- applique et voyant -->
 <rect x="230" y="60" width="10" height="16" rx="2" fill="#2d333a"/><circle class="led" cx="235" cy="70" r="2"/>
 ${BEACON(235, 54)}
</svg>`;
  };

  const KINDS = {
    barrier: { travel: 4, vb: [260, 200], re: /barri|boom|schranke|slagboom/i, ico: ['mdi:boom-gate-up-outline', 'mdi:boom-gate-outline'], svg: SVG_BARRIER },
    sliding_gate: { travel: 15, vb: [260, 170], re: /portail|gate|tor\b|poort/i, ico: ['mdi:gate-open', 'mdi:gate'], svg: SVG_SLIDING },
    swing_gate: { travel: 14, vb: [260, 170], re: /portail|gate|tor\b|poort/i, ico: ['mdi:gate-open', 'mdi:gate'], svg: null },
    garage_door: { travel: 14, vb: [260, 170], re: /garage/i, ico: ['mdi:garage-open-variant', 'mdi:garage-variant'], svg: SVG_GARAGE },
  };
  const TILES = [
    ['position', 'mdi:arrow-expand-horizontal', 'show_position'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['since', 'mdi:history', 'show_since'],
  ];

  class ApplianceAccessCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_position: true, show_power: true, show_energy: true, show_cost: true, show_since: true,
        travel_time: KINDS[this.kind].travel, moving_threshold: 15, invert: false, leaves: 2, ...c };
      this._built = false; this._pos = null;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _scene() {
      const K = KINDS[this.kind], [w, h] = K.vb;
      if (this.kind !== 'swing_gate') return `<div class="scene" style="aspect-ratio:${w}/${h}">${K.svg()}</div>`;
      // vantaux entre les piliers (x 36 → 224) : un seul vantail pleine largeur ou deux demi-vantaux
      const one = Number(this._c.leaves) === 1, lw = one ? 188 : 94;
      return `<div class="scene swing" style="aspect-ratio:${w}/${h}">${SVG_SWING_BACK()}
        <div class="leaf l mv" style="left:${(36 / w * 100).toFixed(3)}%;width:${(lw / w * 100).toFixed(3)}%">${LEAF(lw, false)}</div>
        ${one ? '' : `<div class="leaf r mv" style="left:${(130 / w * 100).toFixed(3)}%;width:${(lw / w * 100).toFixed(3)}%">${LEAF(lw, true)}</div>`}
        ${SVG_SWING_FRONT()}</div>`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const K = KINDS[this.kind];
      root.innerHTML = `<style>${CSS_TXT}</style><ha-card class="${typed ? '' : 'notyped'}">
        <div class="head"><div class="title" id="acctitle"></div><div class="badge" id="accbadge"></div></div>
        ${this._scene()}
        <div class="ctl" id="accctl">
          <button data-a="open"><ha-icon icon="${esc(K.ico[0])}"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="${esc(K.ico[1])}"></ha-icon><span></span></button>
          <button data-a="command"><ha-icon icon="mdi:gesture-tap-button"></ha-icon><span></span></button>
          <button data-a="pedestrian"><ha-icon icon="mdi:walk"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('.scene'), () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); this._action(b.dataset.a); }));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k, cc = this._c;
        this._more({ power: cc.entity_power, energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k] || cc.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._sceneEl = root.querySelector('.scene'); this._built = true;
    }

    // déclenche une entité de commande : bouton, script, scène, interrupteur, cover…
    _fire(id) {
      const h = this._hass, d = id.split('.')[0];
      if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
      else if (d === 'cover') h.callService('cover', 'open_cover', { entity_id: id });
      else h.callService(['script', 'scene', 'switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'turn_on', { entity_id: id });
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h) return;
      if (a === 'pedestrian') { this._fire(c.entity_pedestrian); return; } // ouverture partielle : entité dédiée
      // contact sec double : une entité par commande (entity_open / entity_close / entity_stop)
      const own = { open: c.entity_open, close: c.entity_close, stop: c.entity_stop }[a];
      if (own) { this._fire(own); return; }
      if (a === 'command') {
        const id = c.entity_control || c.entity, d = id.split('.')[0];
        if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
        else if (d === 'script') h.callService('script', 'turn_on', { entity_id: id });
        else h.callService('homeassistant', 'toggle', { entity_id: id });
        return;
      }
      h.callService('cover', `${a}_cover`, { entity_id: c.entity });
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      let st = 'unavailable', pos = NaN;
      if (s && !/^(unavailable|unknown)$/i.test(String(s.state))) {
        const d = c.entity.split('.')[0], v = String(s.state).toLowerCase(), a = s.attributes || {};
        if (d === 'cover') {
          st = ['open', 'closed', 'opening', 'closing'].includes(v) ? v : 'closed';
          const p = Number(a.current_position);
          if (a.current_position != null && isFinite(p)) pos = Math.max(0, Math.min(100, p));
        } else if (/clos(ing)|fermeture|schlie(ß|ss)t|sluit|lukker|închide/.test(v)) st = 'closing';
        else if (/opening|ouverture|öffnet|gaat open|åpner|deschide/.test(v)) st = 'opening';
        else {
          const on = /^(on|open|opened|ouvert|ouverte|offen|true|1|unlocked)$/.test(v);
          st = on !== !!c.invert ? 'open' : 'closed';
        }
      }
      const known = !isNaN(pos); // position réelle fournie par la cover
      if (!known) pos = st === 'open' || st === 'opening' ? 100 : 0;
      else if (st === 'open' && pos > 0 && pos < 100) st = 'partial';
      const pw = this._watts(c.entity_power);
      const moving = st === 'opening' || st === 'closing' || (!isNaN(pw) && pw > Number(c.moving_threshold));
      return { st, pos, known, pw, moving, s };
    }

    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      // moins de 45 s : « maintenant » (numeric auto) ; style short car narrow donne « -1 s » en français
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto', style: 'short' }).format(n ? -Math.floor(n) : 0, u); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, K = KINDS[this.kind];
      const { st, pos, known, pw, moving, s } = this._compute();
      this._card.className = `${typed ? '' : 'notyped'} ${st} ${moving ? 'moving' : ''} ${c.animations === false ? 'noanim' : ''}`;

      // course : la transition dure le temps que met le moteur à parcourir l'écart
      if (pos !== this._pos) {
        const dur = this._pos == null || c.animations === false ? 0 : Math.abs(pos - this._pos) / 100 * Math.max(0, Number(c.travel_time) || 0);
        this._sceneEl.style.setProperty('--acc-t', `${dur.toFixed(2)}s`);
        this._sceneEl.style.setProperty('--acc-p', String(pos));
        this._pos = pos;
      }

      const name = c.name || this._t(this.kind);
      r.getElementById('acctitle').textContent = name;
      this._sceneEl.setAttribute('role', 'img'); this._sceneEl.setAttribute('aria-label', `${name} – ${this._t(st)}`);
      const badge = r.getElementById('accbadge');
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      // commandes : ouvrir / stop / fermer pour une cover, sinon un bouton d'impulsion
      const d = (c.entity || '').split('.')[0], dual = !!(c.entity_open || c.entity_close || c.entity_stop), isCover = (d === 'cover' && !c.entity_control) || dual;
      const canCmd = !dual && (!!c.entity_control || ['switch', 'input_boolean', 'button', 'input_button', 'script'].includes(d));
      const sf = s && s.attributes && Number(s.attributes.supported_features);
      const ctl = r.getElementById('accctl');
      ctl.classList.toggle('hide', c.show_controls === false || (!isCover && !canCmd && !c.entity_pedestrian));
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'pedestrian' ? !c.entity_pedestrian : a === 'command' ? isCover || !canCmd : dual ? !c[`entity_${a}`] : !isCover || (a === 'stop' && isFinite(sf) && sf > 0 && !(sf & 8)));
        b.disabled = st === 'unavailable' || (a === 'open' && (st === 'open' || st === 'opening')) || (a === 'close' && (st === 'closed' || st === 'closing'));
      });
      if (K.ico) ctl.querySelector('[data-a="command"] ha-icon').setAttribute('icon', st === 'closed' ? K.ico[0] : K.ico[1]);

      // tuiles : position, consommation du moteur, coût, dernier mouvement
      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        position: [known && st !== 'unavailable', this._fmt(pos, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceAccessCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_control'), ent('entity_open'), ent('entity_close'), ent('entity_stop'), ent('entity_pedestrian'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          num('travel_time', 0, 120, 0.5, 's'), num('moving_threshold', 0, 2000, 1, 'W'),
          ...(this.kind === 'swing_gate' ? [{ name: 'leaves', selector: { select: { options: [{ value: 1, label: '1' }, { value: 2, label: '2' }] } } }] : []),
          { name: 'invert', selector: { boolean: {} } },
        ] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_position'), bool('show_power'),
          bool('show_energy'), bool('show_cost'), bool('show_since'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  const DESC = {
    barrier: 'Barrière levante animée : le bras se lève et s\'abaisse, gyrophare, position, consommation du moteur.',
    sliding_gate: 'Portail coulissant animé : le vantail glisse sur son rail, gyrophare, position, consommation du moteur.',
    swing_gate: 'Portail battant animé en 3D : les vantaux pivotent vers l\'intérieur, gyrophare, consommation du moteur.',
    garage_door: 'Porte de garage sectionnelle animée : la porte remonte et dévoile le garage éclairé, consommation du moteur.',
  };
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace('_', '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceAccessCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
        const src = K.re.source;
        return {
          entity: f(K.re, 'cover') || f(K.re, 'binary_sensor'),
          entity_power: f(new RegExp(`(${src}).*(power|puissance)`, 'i'), 'sensor'),
          entity_energy: f(new RegExp(`(${src}).*(energy|energie|énergie)`, 'i'), 'sensor'),
        };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceAccessCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l][kind]])), description: DESC[kind], preview: true,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
