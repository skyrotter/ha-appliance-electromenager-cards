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
  // voiture dans le garage : dessin d'origine (bleue, vue de dos) ou, avec car_model: puma / garage_car_image, une photo de face détourée
  const PUMA_FRONT = 'data:image/webp;base64,UklGRmZYAABXRUJQVlA4WAoAAAAQAAAAZwEAGgEAQUxQSMETAAAB/yckSPD/eGtEpO4TsCTJrdtgFzAfheX9DyyZFmEn3xH9nwDb1FrYFN63tbshPD82N+iPxRPTn0NrH00/olLgjhD2OoQgF1prKxO0eYrDZqKNxesx9EGCaq11zgqZKTXDAPx6BEjXzSIqpiKiTUcN9hXR0lGWlNdhDM46oEgWuv6sWYuVUEy1+E+gftj1x+mY9sgaUhHerSq8segdsPMAIDcDrIIBMmNAbiPJkRT03+yRVbsnnhExAV17WKLKaPdRTbz5TpPPWs0MV85nyrEQGpaEisZ1SlZQQUvldE1FO523F23epVVps13tsqtfw38leQGCR1/ZMinjUTltI+FX2/ZFkl/ber6IhKpGsc/ydABkyZfGOAU8gXECwxzWMNEbw2Qmi3kMMWP1f3RVY2ZWcsAvfr/XiMjsrGil4hscERPgSdu2NZJs23rfn8Rg7AYO4RAMIyliTGZm5lmdVe7CbAI1Y16zCQwlZp7JmUGeEU5m0leQTCb3uMLMixExAZxjQnDZxFIq3ypcbiqCxBuLuzW6xfDkCoCpodKqJfqeYsWEcZpaXorK9WZbxOOUQpFOohQlQPHAsGRNU+UZZ23sFEAVpB7bMXHq1bi0m18W1XK52DZvEDbrRm2kYl1JxGKfOmIdijQcAAWlbNIJTIVeknWSKIt1Jcx8tKvDyNZoz3eWuFyFqqj1Bs1+F0+i3bqUFFbrKEDlcj5bLKskLEOU9Y0AnJ+kSdSdbd/oeawEWZ5GXuARAI1TLVFpAgCFhBJeDkgy1ASlyElo6iSIRZVaVKv5s6vr2aqyy/ujKlIyB8B1DEz6072D3elkZ293khhUjHNaU5ECEJdIXFnjpOLUMplIoi011Wb28vXtnoePR8UsdeCiQJXrkyK0TmY37t4+2BmPRr0ksBr1JAAQb3NxWKkJVdEwmWbNpJ8nnhQLAQVrMAHoMIgs8vHhzdu7vdBZ52sl4JI3k5egt+JogRBm4EdpJ/M9v1RKgHKx7ojys9FsMoy068zG/diSAHHJ1oMfiWqpsVAsb1/evFgtl5vlahavNzoZzvZv7Y8zXynP9zQBojHbOduyCkiWQlnU+91utfjekV1n8q1Z9/buOPcNCRBEc2L9lBUAgZTUhPJqigXXFY53Z/75MHQaANGclbVWBzoFSjN5fiJrCkc3xnh6bkghGhNrso4AxO7i2fGC64ndny1OipJYkVindQQKLMoC62neC78qSjRkzRquLvl5P9PriRfIeQmpIdZ7AXLd/e2Ma0lxPhfUEut+C/rDaUdKriOLAqxZ/ztAv5sbwfrJuBcpANwEOql0kHpcrB/x/lG3slHqKPMV1wvCHn3Tw3TjoJdlXgGuFfroW75tz8OGSeiwGytZJ4itn//W2zG5SQgAoeNOqGR9IINv/72vdTSxcVJ5ncyU4LoghU26jQSg4SAAqfzvv/j7LyHrAaVwWUz3gOgUevnPf/NPr7keADaMbZcxNI3F03/82w9PAfCtx4JRHqiuASq5+Pzf/ve1UgZve0IHncSiraEhOi++eoW8e7/ztpOFl+Uea4arSmZ7P3TLgW81hnk3UOAw0QHtZb13+8UCb3OdjCaZITFQrYOkUuHi6QvhW8uUbjeBTg0S1ALMbHc9j5zvmne2EQ2YY7X+4U15vrTZfLeQMXgFps0PnuzOV72Y/zCIYazy+p3VuTLKbfk6MoBNQJzfbM6WptNpmTSA2qLZluk8mfT4/Q8TgIYQ2XScNeeJ/PH73ztlONvF44ejZOdIXNYPVUvDhwCp425m5fxQyqAbGwykKunyrjfHzo2cSRBbsjWUqYI8NJzd8uzMOIUNW4exrpOdmfl5YRW4MbFCulDHirNKlCZwJICGEQgAVE7v9+cFsYkig+pQWqpZ7Jqzou7GmacIwBjKrKFutqV+5FAuIdrPY40NXKqO7nbA9igA34BLHdxNHblpCSDtPX6QClsDlODKh4bl/Kwdihoe+USVQ6q7+87jHcoqBEBDZUzoRUYWAK+MzQfjjr54+vGXug2U0pkqsrJZC5CbvXOQYmWbpUHs/DTvRrdGoZwscEW9bDi+d9C155/9+99Psjbm6A6IKjcvdLQ9C1cg4juHh91OGKRpEtzb7emT04vF3TFwSXfYtze6vipOP//3R4cZV6HM/WEfBEBs4KL8UINNKMGjxw93otAYYzU7aWrn88UFjbCTKdvbScJuGuD4RWAIlItXh3dmjmwG8frbGTZyAaAisWLv9jsjp0kQgKLWymo9saZOp6HXufmtv/Q7gZXzl8fnBUEIUMa96NWLcgXTP5wGBMCNCwNAOb0Cs4MdBwpRJQht/eTd962pUzxB2hntHx1sj5LQc1qBdMv17z2aamnCuQ5iD0O+ena9P2755LrCQDQUKSRJQLI4WYHq8M7+0eGsF1lNAkRTne8NfTQkTdSJ9QZnZmFXJGty+8MXgTcWynp+HKjTHhth9/F3HA1SXxPEqqTr5K6JmGzY8RQBG2aQT8fU4rK4fLpMAmCNOoBUxou8s8O4UbT/zjf0LUk0NgSAOkpsk7nujiKFjd6mD/ImYXm1XAWMhuoCCBp9cWfolhHdWze6HkA0JJ0CoqOOt4xYMIkMucmZjS7zslpCYsPIOF5dAIhie2QL1sFObw8diHpWlgukC+wymFMGlgTAhhpmIza7JYhpcn9sAmwA6JDEKc8KVoj08DBQqCdWFADjDOuI8MXCEBt/ps0tWSH29fQyx2jfqJdfnKFWj+9MQQJEi4Iol0a2Dhx9OScJwGyYsS6PVQSi+vp5MDNOSVYE5//3X8cVwu7fTQpOT7g05LL+IhqAMeQJI59XDZ0pRk5ugIkjk9l+IHY6QFuzzPbXMmPQEwCUPglVy9i9uCl0qrYsNFnW5Q1nEblDEg3T7QoPJA0UAu1w/YPbpDsglmFqXQwHfe8uGrN7KGvZwAOVGdd1y+Ls6mXgLsOyeYipdSHJONKdcFm4fTM3wwEFZhT2jQHsX8xPJpCKJReIdnmiJ30AnWwpEe7t5sbQJwBC5fVqr1bcl+lEAkib9dSsg3JS5JMkQHckurs9MAAbdCAAMqsXy2QAEncZbnfv5vDFiZtG2roTQnWniRlOaGG2qLlTtbRb6OIIZN/ww/cChardRfnlhy/hhoS8fv6qQq1aEQYorp+GaKpu/8A39zUr2AlonQaA+csvTsUFiKrh+YWAYtPYtCC6y5ennSZE9xu+4yggK93WyHbHAQgASisDbOjVUjstBaC6eyPbSB3dqbl95dsmgDl48s7QkQ0A2GD64CAAve6w4+CDBCD00jzRTO6/s2WWiOOlZnkdeqA0IPy9uzdyqwCTHQBYZ0ZPvuPR9njncDfT1wRV0mbbu+Mbh9/zXlex7khhUirnT3cPAUFzNxr3A4N66wIIgIju/NDP/sR3Pb7VdyRgDkAApLd198kPHz7ZdQSADggkC02xfvWifgQFzQkTeXJx8mpfNZBhdbVU+YMf+9UfejhwJDyRKpw9+cm85xFNRWpCXYViPbstLt8DgtV5cfr0w/9+53q2DWQ52ABQ8fbt3dySuGZU/vBAKaJqAkQsFq/my9vtuubiPRNOrcLeOIg7W7sHR3tF0jEeqdYpy9c3/7GoyPNJ5iu0TlSV7/Lpzfee7JNvoBNdfHHdTB9dTDKuqNc9/Lebqst0nPkBejMCPH8xntJfChB96/vrhAHYcW4pAGgvUnMw9aZ2/nylHDcRgCoa9CNiiV4zLIvxNDMvAQRuuNMPieh7o4sHIxyFurO/EwnpvRHH9yeG+Umwczg0grdQzk6zWaRwUzn58FWGN/P8lZoMjKO8+lKrN4EATsvxyHOU+Znmm1BV/tbA+gmsW5y/Ca4UJLuTgH6iwl7x5dmV483e+bHZuzUQ8RNGE//pR1eMuPuDUxxnd7dVcZ1iR+OTj15cKWL0Az+zn6WjqVmU8FNR6W74xf/O+yRP//M/7bfuF6P33svNUQjl4fOPX1V4Rcrjjz8vOkqWmeGlBEAY8+rDTwsAIMHLIhQWp3NRGDJ8lTR49tkXJMKJO4VcCsHIaikBctj8BDBe+ezjYyTv3xssOvZSEM1GmYNAcNjwUdbAhfr0qbn16N40ngZyGendb9rLLUEArMNNCYDQYSdV+cHEi0eZBtsi4lvf9C0Dj6h3FhAAoZPZ7lZaFipS5fyrOdsBsoM7E0Nc09QSJh9mUpRQWLz8+BjSzvDh+zOfA4a7im5hAKb/4OEI7ar+0dgRx1XXQbqtw4Frx096oaox8xnQUUI/j0w7sJ4mAOG/AlJEpB0b+QrXxgIoLxZok8x3+vZ6STnHFij+jftjAyA/csNZAq4Ejh/ey3nNtPP+/Ryr3z55shZ+BIiw3tQ7cIXw1fVtgy+BYrVdoTk5eDqvJW9CzXbTUeQyluH+053w6FBOI5Flgkn/VcCVrUOkZtoP1DL4vWSdfAkzACMNd7aMcEmco+yQH4EApGQ6DQqwLsjnjVqu3AE6StW8QK1O+qkBmCuRFdr0fQ/mt6Er7nh4NFHNHry3XhQHEmcG5k31Nr1n62AAYTq5xaVJAJTIEAD4veuqWpVruw+AqLSfacdKu8Ukb4HxMKZ51vaSriT3iF+rbkYtQsWpq5hTUUqpCMI0NXBsIVFvolDRsaCtrqPWGo6tgtSvW2peRT/16qgocGxqq+uMb3mdBRL1QR5ebzWc3J9kPmZZjpMbXi4vk5JzkXWhqOVaJvB1TbksklsRUK6TeDX1rpZbVV2WmRqlZK6l044DAQzf1mFscC1ObdU1mRf5SloyeRaVn4cKQD7NcW16kc/K5eN7mWvBxqECZI/e710mTTXQ5uY24dvac4SFxbwy56JWgOrFSu5lfQvW8z0t8yuqOAvIbFaZGW5NAMoPLezZTYl3K20Au3pamTmXgAr2/esa76ZxBlzcH7fMtbw8Uhf3H+SGd3uxj8nDR2O8m9QKNhqZeRdAIOx3UWDOBaDYbAIurqpKgPyKS/4LupLkY00VcfG0X5VyMYpt7WSKwr2pUZDkYNbHBYpJ3kUdyIKwLZJ3ibIGKta7JOciqrGqhX8TgOHj+cXEXMzuP36Quxij+9PMXAwhPFxhVyYXY7/aJoH8K1ZB+LgSXib5mOo6+VizWdU+lvb7xsEExIhrC0SnmW8BlpoI2eXlyLvUbHc12cPHY3lXWK72ZBeXuXlXdbsRZoZ77293IoWQPEtACrsK0nYdnEtpv6lE2m4az2qnIo4g1VUj76rSJaRyXUm+1ezzSyztVkXCtRUqJkCsI84dIyNAwrubJm9Z5lxSXU0yYHwxNtdCVRhhyh+869K5UDQgu3gwycy3urPL+yPhYg8fTczFsDzDxeNuVftYup3tkxzM4vrlOuHh2r64bTxMVK/nNSDvgvp2USc8vN5tanw8BjmZYnKyalvKx4rlPvlYUzXyMZB52f87WG7m6fKx1MTkY3G7TRouUsc1wKg2m4ae607YQD8mkIDgzaQ0kx1jPVOHaOqQeiYjAaBqR4QVkfGGSWcKi//+ZLqnrwBVC8JmkNRhmWQ9UwsQ1jPSt//llOXkcSotmFCjvip0jG3+9cbOE8///J8ePTGXp/zrQ1nF914vGln95e+q9aFPPqLfKVSpq/fKbn7/+oyy9X7SggbfNZWa+MV/CUdtv/CMc31aGB9XMPtgsArfufknH7IJzVe/n8A0/uxnrF9xsw7o7bDbK2qJFsODtE7PruMxIM43BVeSWJWT3v8co7kAxNPso1nPil3gLdV+ahQAwhYETe0YYedLAF4JCFcQAFyh0yT6npo6vR3Kt//2Xi6RDcSP+QSkDcD6JFDclXo7oPr24i4csi7y0XHqEcgcRTFkOHnCyaOyAykmrxKgqhl3qdzUcqp2KqvLrrRbVZ4VyzTtoi4jfRYyT1HacdkljF6brp56CnXFGBOAhAHqC/HfvjLwDNSrMssR7VCPJqLP+2LYxWdL+pxCOcroLqrxJb02hryo/upb1ieakHVZCtEm/Rr4xnxLj6WmmVgHpNrGjgJmfSIVYdolmp3uuUqPBahKOSbaaZvuSb2Rp3QqZRwU3dlK9DhFXzmWBeNJn+zJFyo06MxQjyTsAFCGWxFQT7j6QjQGfXlTWo9iZdMj4G819FiRQS9e/+VLU3/C3i7QITeoBagng9+a1xW9lEBqymzC4YUbBNrqR9TAA6V+dGpfTvIj4A9qtXr67tHA06PPfhDrgTrqfRxjOqA/65ZRLfWh+cXnpkFH+qNfpelBWzF+4eoCcVDhW39iYiuwO5NCBiA2+5yfjJW7GsQXT86IpsRP73sgAOyuFsUfdfWmN8l+TvvgSkjld7Ai1cM7CVFvd3MqPw2HDd9G7/8TnQRsTx2GqG/+hGwGXSapU6zBTifi/PR7td702n/+/SgIEABXEYct5L+MxqrEt09IqTnMukaHxjD/Dmhs/hnTX/v1G6hfSKPcOCzxcmxmJZSDW54S2FH1ccThF82v70PhmnCrt/jDg1KBUzRXh1DMlL5Q5FidpbEX8xIJE9ZA2W+VplbKf+GHwOB60MwcS/8glGWmzz0WlpQqjevd6itYCyDmn/7XFxl5SAgUYKUZ/9LPc6ShcG1IQiqC5l/5RKOUb58u/uUvPvDxb2GpDRBe+gvfYPN3urE/L32ZK4GcffmuDaxzgCwIj7RsQLn5G/Fe/dfzv78yAKDQskLtD3Yi923TP/7hW3OF+eJ3YXF9Sums9JvNNQCtlEXrpIIt5wC6+X9NxwtCHu+S1yiA/akJkInVAQBWUDggfkQAANADAZ0BKmgBGwE+MRaJQyIhIRV5NdggAwSkCpqrGS5lOZP9vxV+6v+q/oCxIHIIuAm5fFQ/02hFRC6/rd5me//L38qvmk5J7yfVP4H9Qflz+Kn8ztx+v/6/lrc9/7r/F/kf8x/97/2/9V+1/zB/RX/I9wr9U/8X+bP+L+d3/b/cL32/27/qfkB8Ff59/bf+F/lfej/4X/U/xfvY/xH+c/Jn5CP67/ff+766Xstf47/vexF+w/pq/+v/i/Dv/YP9/+1HwR/zr+o/8v8//+53gHqAfwDrfPw5/Tf5UdLfyQ/aD1r8sHr72t/wnuQ/7nkl9/8EP5j+E/0n+F/cL/A/uL89+EP5n/H/9D1DvyD+ef5n+9fuR/iP3c+nqOFzQ+3/7XqQe2f27/h/m//pPLK9XPtT/zPWT/Y/89+cHQ3en+wV+av9T/k/3I/1P0q/5H/h/1n5o/Df86/03/Q/0n71f6b7Ef5H/Tf9B/c/8z/zf8f////X94HsR/bn2D/1AQpf5qdxv29enF0pjNeObMDvjsFsiTbL5MwTbmoQMcooZdPFej7005Q3QigLKg2DTNeoUcnrytHjvq3/QaXdFrLmlfx8jnYN9+WZBdMJkrAq3OGPvhoQy1XWkdANGccyna4quBn0tP7aORwSQauIWejc/Vlb/Wr8+WmlGP498INtsUGcvvOpjD2Muf407brhMyNa+ptWziQbRIACOFyPoyDZaidxaa6xoJzXx+IYv2T2AUKGP2HqN9FYXbm/M8Nbc7CYBT7r6kW9Yq2oekdWL24z10P6iAY784tgTAP+nZ+yTEAS1G+skcfpKjvsRZRJo3xuBXeE38QWESdGrRqxyZiBSO3dwqHVGDy45t5Pgi/F3uWIVQjtZoyYE8zRHlXu2ts6Hl43FrtqI+XH6DSKD8zbJMjljOu65PEO7LIzO2zwCexuaWpZQ+mCQyx5ZkjqKKhVKjV5nZ6vSQbozxKG6ShcQ/7WC/1gZ4fEdvLM+gS4siPmDuHQ0QloJzjh/4yRcdBc+3IyoIF41kjMYIR3QU4iv+KZjaKdcIWm5auFGYCNiCTSnpsKBYVa/zxZyzE5xXJYZL9d8A9qmfdnw4UUpsBGbAUqAEvdXbynhm1ZCMhKl6yX8AfIrOcTjuEbhszLez7VRXI1kb+bEBJh1R1e50LpCgYuu1kPkY2fvwQdMU4H+8d5xdC1zssBPXUbG7ZhRWRzVUC0a9MpnODGDKbssx/zBcdMZ0GVj/8NG96JykYDcy2/uZflD/trKZ0CEEJAUN6hhn1THjF57hSD4QbDw9w9EVf45HpK++VxTcKDppW0zI4M8qNk5Z6grYaiNRCO1YJBSftX6LAaZZ9RFjMH/6VUBHQnk/PVhVCzPhjq8oh7jYQhtJyBnla7gjC5RzkxClXoJp9iVzVao+0uYa3Jdv6oBQ4wIpNRaDpdTJGl7fba5JiIkAu/arcmSinOZQn4FtOKWFlOBuQHpoVF1xezn+8rxHm3VI35Vy090/ZeKUzztabAKWSzat7sLbM4//7b6n20XQRUKIsx09iUBuqVMl/KeotYwOvHn6MtRFFTjt/M9t9PwajKQ04MT5PplFLfLMtU8qRoQzbdbcvkU3EzLMEvBPznL76NPGuCh/1zgBOFalPx6DsP/CzKFwR5wvDLX8lCCylJzLCMUrW6rv05FmF1d+Q0TgTTr4sLMRlccF0j3hSCx0Y6VMc+JfEArcHzYrohqt6CBGxAlF+3HTX6zKPQ5cSn4SbSXwxmjHTAvzX+Oqkc+jhZhRDsYbvXLZdW0+pnESFh/yBVSJvwi8EsiXARpc5bvME/b8SQvhb8UzSwEzM5rxdLxvBLV/VEMDvEKm1eWmHhny/7wYrQ/eJ3LbFrETBoYiy+ZffF08P9XJoXV6mz9VRqm/EW3XtN/Hs8Kbioa3ickjXFDkO+vEMnhayKTNYK9Jo51FfGhmz5UhttGalo5e5V261aqvI8HXKpiajSN/7p5agoWXG7nnBOLqSlCsPVIzSmHsZ8cLXOF7Fwm1Te+mzuB/DI/Ll6Dvdahy5BiWpWz0btAj/4LM9UEfy+bNMPZq6oYEPJJSbpdRgFir1aDc+0F/3POI4gEkeHu9hS9lQKuQ+2iAsv5uPzirlbVDfi2gmFfhoPf12wrMO9k90gCMlaS9WFr8Rz0MLAsQFb73prAhK0YdIPAYHRcd0JOIQLkfTFEuRxFW7WL9yEI2rNOGExKWyF79eX7c8YIGd6dV1SNxhajP/VX5jNiiq870xkfz0hT5GUCRd/qtq7QUbxuMq5nxPvw34kIbkJO2N9sEi4Glb3zCBXu39UzJS0ABNeXoG3bm1VE9Jou3eQ2md4EFD1yUBpr/jyB7zRYNtb/tIxzyln/EcEJl9h+782aOgfCRSbtsem+qqDwvdawTaCQ7EeHCHb7omtw/Hif9URu5SHpaCP94AJ0T3JR0IaoEicThtoxrL0wmc4Q1XHMM0jowp2rqCnOew26eaFv5+2PtLrOsFx/nUEWkvDApQUO5/bKAr4LCPLhX5exQTYJY21150pgKyTgYt3N1S/Ju8PbREYl5Bpc72UxenySPun6R7s698ufaJ+EHnd1wiqFxm4U37OC60Nfhhp8G3EKqgaQLopL5McYpx4Ahgqo7jX15g3VxyWAmWqOmfBbpkCfRUrC22sxs67Q5WLWQXTCZka3Okx/XUmukOKe1CxBfPgqAf2HrJa4PDQq5f8Nquv23+cvW+ITbqEHcq2A5WLWQXTCZkbY+g0Evvq0lSKDh2rTfgV8zfFuzQAAP7yLsC8/27YyVkLJn+0tmTwbB8J3EdqaQQ4zjlgPP+HAYuJPY1m1l6atIV2VOSDH1ARpERbLRZX4/V3XSpSfngB9oKpq2igi07ddfHehfndLG9xg/JNYZLUPBof/um7Q6jbTvepNdnwBGWNcf3zY1rBwnHv7Cn7JPwxkbOk3RT1snIBOrX2rWkRfFjyVyODsOwWMPQA86segsz7TKykVrjwgECKe8ArJA7GOe3RLp9ZVX23MckJcH0GVvPOB1INY/azPqIZa9zr7W2F9AMOKL4nDOAbrVblIZchKnmada7rkj4jYHOdBllA9Oj5iCQ4F5qneySDwZE6zbbW3HVlg6pYnsM66Izorb0mKU1qpNeDNUqHTJeA22hUwmbgPoP9B3IJalIIq/vw84T3BHfvwU9dOHUapQtbuB1Ulq0mXO1873B60hNestvPdFtz3GSIb/pd3jk6rx2h76PtFBv8yeFVegL97xdUzL+vsr7Zrc+xLJPhs7NDGcUX17Rm/HaxEC2w3SEYTEsxQdd5ug781BOkUbI/4TZ4b1iTOLbsVD2FrdNf5OqQxTIfOZJREXp5k3X6fCzD7aP/Ow7CZRhCkkOr92iSfqVLRR7OLBnKHQZUEnF3YgDN7hn5x8Gue1jY9pw/loCt8fxvnZZOGdvqTTuSz/4urqvMIijAuIDM9HxBoWiBIybGKt0/uczq3f9fYvRJuzqNsofufg3aaV2hE6rmwqA0cF3BAJlIum2aUClITMPbwcjdblxPhc6YaOfWGLpyB7wCNPrBT61fvIp3/pYYZMco2yymzhv21y5XbRIYOFevB15//hW7mA5490h2pIT/450qDfltPD5yBebrlbSFQgbfi6UBfcyyVqWXk3VsltcizK4EzDDdPHadMb2OurA/kbwFF3wP2/m7IArxhFhSgmbS6B6vqCAWZ+ar+LPba4BgWN1fUnEQQJKwhK5Xc5KibvEnmJ3zbZ+E9OyXPZ+sqRSKi1sw2Ali4kiNjGDGyI5XgRsZVf6taNoVAI6zJsOA3Zfmv/TK/ub4+eIJI1p+xa5rxx96XzYRIRgMro+16UXDpw4xowdA6PmNNZznc27aOeeexElaJi/TUqbWlfMX3EBT9RBWeRc6ZrmRqBHw2Hq/HNxuuxJiT/5gP26PgADC/lo4BQhFA6a7rsIHuoXFT2ecKARrLH0rhK1nxzdrEBpbz0gKzMB/6HXPHEPt6OiCbVgmGqULyILy84x/fBzmZLmP2xlGeOdLgoZGub0if4JNm+bhNNQB3tZRqg8p/1SC0MII/NFY4310RvNqX7Ioezdii/pHjy0N9RhPzEQCCw2sxbRBESqwb4IcyjG6QNi5Zg/fUy8/C9esBczeDHJlZ8KvM/1Tkpec7o90JCsYLfoZd2ac2aEGom4Bl/WDPFg8TSvWznwYea1Dcg5rAoRByZI14K2OxsuxV8LLfBigK7HFxTIFi5Uq0N2z3e5RSYIYBgA4BbE/EgyA/Yxfwh4Gztpucd7QN2S2E6BkmlC6bAdrqQKJ6x8YuKCnbx+HgiPUsbBkmqOMQCXsEnJGRb9OKjVuW4Xu+nUfLzumu/qUl7T2AlpkyuJfx1FMJKxp52IGzBD0tKy7Pze/Z4ex8XNoxObpQvtMlCPEX2Tw4qgJxoVt2H9P/vAh2AnBjZuDipUEHloeszTohEDlX7asXYt2fnNvD1b/EnISp0jxgHUsOSnXMtdrFsDrMs8pB8ndReNr3i1pofsEKCSXgL84jkJYi+f0y1u6LnAMW9+WK43aLxVUf/nqKRYAAY35p+wyUEa3g+6wAwJQhq9heXH3eGsyAeAwruqrYnbvRupNiaERiRDIX/3u1L8pRzUPd5fn0I/Lz9MyhNWGyArdIJMpqVmKYghRrmoszjL9VFrdxe1IQAXyNlZ6KhBmjQ8nEbgDkA69cDWUk4S1QLyZllolxohUB/WN2urpPjKjyvtLNy5jHDiinx2U2ZtJdsKNmUS6tK4V2Ait5bHVb0S8xWhj2PVjuWrrIKvmvQRdyQjDefG4A3j/5NX59PzjyqTJzVzAofXx5ioIVphxg99RyqzwxhFoAVyc3GBVgkgbzbU5Lws3lavq0CTiWfr2BwhN9aptssmWYdlebEEAA+Qrca8O3kMNUzyrxG4eJevLyTFfLQ/oEpeQJMGhfHcEWmU2kSwGrJN8uyBDdlAQXzAtGXCaxFgOfY2FYmsuunupHln/7rS56DfmiOc14xDtki+440cEA7sLksKra5a4Padrtb9AzX2gGUCXwB5mZ5qPEV2o1LYKeBHDWyO19v3eh+wAMn+YF3+1F3FRT5PEG4JC4z8QB1qboNTg/Btsoq5oCyE3eMGYQ3qhI+0u6Uf57PghiLMwaK54CJ/D80yH5g3T41fQfSH/BVeLZXdUQV8C+j8M6WMPHW8yPsriAdv3jkrQmuyA66ZxMk3Wem8E/Z8ja1h3j1jWbjmQaKjL6NyIkZmqL0Jq95MR/Jr/sMEPHLaR/Qt7yafhmtTyqeAO0fH/FvGn30eVyBd3Bx9QjxHWfL9ykrRFiTt2HlgAbwp+QSix+ke35UZNseTsoLGQglvaG4RCztzaSdemwVvDzZM1ZHH9f89Opm6D+riMXoQa5p3tLoGmxObtfTSLkozZC+ZaNyMypN98phrCWGLUpHIwcg0fNZWWcANPG3unPMFVgrvUIJLGD/AVu/jazgoFnVCs7Awq0th6wtjO3tmY4jRcxLvJf+pXIthZN4NeclM4R6L/O+8rJDz1Zfmfyk4BSvvJ66TjF9gW1pWmvVNuATk/wWaj2dTCJAOBu7nUvAMLTrx/EfWTw57ySivxOneizp27WUfczYi3tWEjzJJu4tBK8kjSmzkwLAa1BuYuPl6dEQvaj8AjWGUUFy5k30Wk+ZPW4hxlVFvnT3KFUAoY4hxZjsEm7uZGGiRKwzDwMIFdRpPDteK9bukaZ/LBSirhhvUy/3XIeCUkcDcQWJ4UTwdOOc3dwl/X2lYGGfponqDBDaJVME18gTUqtG+NOfI2HcOXeX1CaYeTcP4FwPP7kUoOpj2HZcxzWCDHLXBJ0aFYzHoWqovCli/7MFzs0Da0v0I6j+4pNOSWkpcJjGvKrO2Zv3pNnLKEOfMowXDH11Va4mAICmuf+/3NepDuou7uKpAktydxC8znyuqAneBxEcf1EmH6+haj63piFg9ucizf32UjCIeZpG2s8sE4TSraKB4ghKIC6LO023F/92VSvjx+aGGGNm+hGccYsXy56DLyY3Ci18/VgDT8T5FlUD5LJhej6ytINuigIQoasOKsBCCmcC8lYrghlo/SZpeMKJMrNqnjZ766s6fd4I6E40ZxFXeIjiY6AAzJ3+Fg7awQNqTXZNYHonvMDSQVnzHV8QDVAkiAiJvDSTfNJNTRtVTAsiUIUR0jYw7rv4dma5PwmTpGDB39YzKyid2gyccQXreKfpM3Ddvu4MSLNoxGX9KY7u/YiKuZPEVtGKC7TC4Zg1qP/U/nShCGqQXBKKCTHvVJWH7rbe4vQyhSjP3uO3AlOlC7Y2R2Kk701pWPO/j00bGX19ZmSiNUU0DWH+KIKE1pflRX60LcwBVDldZtcciapIZz80XPc0BsoyrN1LSArIlC8vhrw9pa94bCT3FGjB+5tH3ueFeEr79iSt+t1oXrXUmPS562TOusOTOebBdsJQjSuv0glfY5exKCUXtbzzKJVeuulJH4VPO7VHyJLpMd0EmLJPLu/hRmwSg6MsYIx6GIwlBsCA8a4bpu8ofteZKvqT9VBF0LNXFAK+22uZYQ/OOYaxdk9Hi3vq1e96NfXDBHdccCjtjY60mGi5uKr8KbgL+swKVGz0WwbNRnVbZw8n7qqoKMlJ7Ajx/+A2mc/uhPJFDAeAQiTxWmtxzHh439VAGKuhXO0pluLSY9Jufv8YmOCHnujJP0Q2ZRnu4GfqKd14AQu5E19SMg6mrh3QDs1myMm7s99MYj0SnJtY1yNct1ksN5X5/bSsgllvlyUsrjSeNoZZhUbtS1pIWCMMWouwR2r5wf4khgb6nRrIu1Of0WvuDrwv44XsARC1g683WyG98t9ycYVhRs9fIdFdRHjT/EJLH0v7o+nq0sKcs9gWhhFcXaECQtEsehMx0jIrzWiJkxtCyj7vzwQF6pMMBPx7z+GT/xr92/eqplzNfbB439DHZsdR5j5hPsGIs4x/+p1//niTV8JeowTNunDHMOs3qOEizhQFxefAE1qs/OHxQKoWIVPKFiUpJrgBefSd+qgZ5GLCpfYzrKuOmLwj+hZ5+zgN0e70bD7mFFB+cTDcVPKzOSQCaloELAtcWkK8ZgiAce8sMV9Ep04lepjntcLJl+95rn4iHKAw22XzAheMQTl7ExkiFnIt4tkAlUryutULjR+J8Rwq9sOrwUu1/7qhDMou4xEvkxO8dUznwJvedU//m6S5Filtxjfa53+C473o4QTmKgQqJpooT7nb5XM71qywOZJUdL+NV5pIeJjCm1xKanzPYKMzTKBab+Ey+d4ZOb+7mZDO9IYGHGqvleaPYDd/67/rSOJ22R/9+QWSs2xebwR1Laa+pxbqnLLjwRN2kL+VFoxNq/Gon/BARylbDkBMk8G9jAQxT7z8FQ/wAr44bCf7M0dAGY/QpqHG8FwjAndylTO3PdcPooa44NohU8TTzl7ZRpobvBSDYz2H5gLmWSGlm0tU+OVG/8Zvr5sEoeCxivOvxJNph/Krtht/1bp8wxxphozPsw8pqhXzN9hdLQCn9VcPQ0UfS1RCHAVdh3hwIPFFUUtzuRyYejsYaVXY9ih8WnvFobmktHvigz1Du3rxFCqc+TkapnX5hot/BWLQV1If8tvmMW1P/YFneogKFqnuqbb7cnJQRnlpSnIdUv+D9MP4cDmOjhXtkVzRcY56F/vpj9NyYkGxi1gEug1c4pHo2YHaDhXa4kQiABTaXk7NWSy6TSv4synxmaIMahmwGdpkJXXXY0pEPP2IGYZzDk8CZg+Plx/ePo38EI/0CG3C6IBQ5gKOpGhYZsOySGsNPX6nA1WxdJANt8n2povqi0vKbbuzc17F42Qttq5chMXcX6OTW3SQ5PfK8udkFI9lzxYleBnUge1US3y38TMDkO7whrR2BAxR9dQlTAZmxxvyvdQTeu6rmtZu2Rnr1fw59EvcYLVMPRaA7sjkHvrFblh7RFjQin8hQP/h23Qs8b+mZdQxJoplF9x80p5UDUdELwRnH9IxseVU50zRmlVhHKIfQXCW8E8M/2gK/SUydUJCYXXBMrp8P4nRoqT085cHu+xEpUKBmFQ4ybR3Or+b4Sw3yjZP5QpqT7CLtFs+1UhNSYvtokCpjJMUxDTS3ZyOhveznfrt5/8qZpPya+Qe3Vqr/AimAStjwWJJuH6YZYINFadddSUsPiD9gXbtxysfhZeFWokwp4mu4q3QTN1vagCABAQiNMSRxynCQgEDXMtxEno7qZc+M7ryMDPgZ5Ul1kAyBEejaFSP9i/r9XZwVIPURBf0TyDkbRa2F3tiD8jvmnvG+pYocSbaVQKXrykMdUHhlUOGDzHSEnGskiugRHZxo4YiuaAQdJC3PYZGFZ+RdiZJs2fx3AMPtL5cakXE+3klg/+Al1JzuX2WU0TtNQZPGEgQ5q9uspMIumbE4LxdBIyqO2wTCpyj91J1gW7RsBHjvvx7/X//fiwQPRNpElDvnhVU7DDpHRnxsp19dFMMtGpXJwugFCBZSEXuP8X5KECj+agY7TMqP3OT2PaUE3Y7muu+FQWfLPu4mNXSiFEcZfp2bIdAxndHGmoVof2NIvCFJJ/HSSAixKoNZHfMDSZyOiZMh3cfNAJI0ksFn07JzS//wwQYDNmdZgKFvi28vOcJAN+TQnKgrSc0JvihmEC43AAGPBov/deXg59HG4RY1NiTTuOfHykcadQlWdlsWDCvJLw/b/lm8ppXbg2tDCv7yhMFXN6OO1ZaEyYNFe+NM2t9YoeTC/F0SYmBGcXs2YMvUof94mWoIHq0IP/t4YB4/2gwlKq1CjCkP+DfX5DhCpb77CHb4HOulI5+mquLGxb/EEpVbaO1OCvvXKJtcCg72X1J7CVdP84dZp/C+dBoe4WwMEwVg0mRcPrXCqQm9keF5NduRAcsicVgEItkAjJR+lela7DszG8xryrrN/xrn8PSP+nMPSgY3LRnfhZCYMBxs6OOp2GHCZDNFGJIAhqo65myFu1iEtj4wm9N65pHyhZw5RJrW0mbkpuYNwxbChHyXEFaWvlLNqwEb5T4EusZ/CLfgMsqoo/7hmU7OeVIcn9LBtcU+u8Vl6LVRqZKLt79gXVG0w08pORqqCyxq/TRxHcAeRt52sVnPJZuxh6puGhI5LtcGaC5VvzjJvhGGrRSB+PvaTf0usbeAX6JY/2kxqmO65cVVyKJEcbE/30N6Hr7V2RMjeXFvuLK6A8q8l0BTRQ35tET3ksSrHLnvbdpqXHW7CEk/RKUz9Vm0Zkfh8d+75d90wqLiZKsWBM2j7oaZ0NU3ZM66OD5CenGVnoVZ9OP91CQMxB2CKW/DSieh8lU9bSAp2zJg1sFSmuETFS/O9qYvThgZwOfPO0So3CV2OU8yArVw3bvUL+32Ffh7AmR1MYijE02Ai3Xk5pNADc/G3rB3PvG1CvslA4P4YIQIq8j/+WrPFycu5dXoma6w+AQ4SDKnRx6f6a8LRwUaraBOQ7+zhPBGujUBrhDkg/hBszkJ+bgG2xPsx6vWG0Y3I7RvGpXIXAqxjWRcLgkwPDzrc6qF5Q/h/F26IlVGziPCl/O9g621N7823tdACD2TiU1JUu0YAYzHHHH61yrUYDNt7GQyRLOEIVanVtMrIloR0v+Hf/0Yy1ZFi6w4/brp/KiQRSfSABOLjN20Uiw5qRgUcThdYjBBT6dbcx/ZJHlu9RJUQ8bBdn1p/V/UrS2ujMhJ7n5cdlq1fQ+lBfn6pAxtob/9kcDU7TLxY1oR2EKb3dAeciCfynLP23VhDhDoMLn9Mzi/isjmoOhuiwtfesHalCPB5HmyKP303lyOXk7vqMtMli/8r54Ukjg/YGWrq2SHKnHlNbQsyzLK8GACBIkovMVsuOzi3f4FIAYxvhhbE/Q0CwoWAArnp61FP3viP7MGdltK66/R7JY0k6kNc6J99MoMelVmjljTz6FPKjIY7EiZI/kUC929HYrNpA5ng5vWw9dlWQj07WN9tXTep2DZ/MviAFBu92n/8sug38qtQoK1X06/QQ0tx2EIs8BRIajqZHPaVvW/St3y4AZJOCtYuzFusqXqCx/SXMJ1ypaOKEaejE+E8HwRopzUaGiN0tYa5x11r8GIKwMx8DwwM9BfoJm8GxlNx53EN9llXQDXqLM7KVuXioirp6zEvW/o9SbVAWBi5I/ctEb62LkzyUDIBUWljD7VzPZ916HYNNfxPPWNbH8nFzXdVl5qk1qdNc1C8b+rGgsbyST/e0KNtiRp3uwxJ0lkrjWjbFFYcvi6xPz4GwCizDV32f3Lk0seAnbXKMk4dYu/SzwtxGTh7GcIxwiEHidU3nKh85Q3OkrIW2d8DANYYTOO1vq/iTfWEy/Je+yMHlrVZCH08Fmiuw4t6pirX37dLMges7hQCYiCVk+ouRTh8vUHAAhWq/TdhrI1tMHaSBO5tdDJEKeF8QIWIZsTWweA1N9EZTgAbQEDFKcm6wMr7UJZQOl4QKrbxBKhPRQzbGs+adRNl9AwWedc3dxRXEHldUDRki0NpPJA0A/jpZRpA9sMBiFvg27CQqHNsFxIO7CdNrHw88r2jOZh6vq/MvNySY3Arn9pG0DnaKFWgAUm3hX0rXsipil2Q25xX87hIPglu0rsiiP0cmsmw12kK+3j+y8XNSNg9Swjfv5u4EpcyIUEf47sgR684wKixj2P3vSf1lA0wDylfv7Yg9uYUxHo4tqGUMNQiCmzuVEGa4qw9SDGzwDwfDZCA8Dcn7QHg2Mt0Yuqg1668LjsbKytRFxlYeRGK0qvTcJz2sJM1Yg4MDTvxQa/LLW5h1msZrZqMwT34R/YXix1q1gU8SQflu45wICsvNivKV0T+R/loLHVoxza6brkc8lV8JUeQgHyOPkwPPsCgjcRZGpWDg+sCT6v5Z3Nq309s//JRIjx4CD9lvpSj73YhhXc+35W4NJTXnteJ/2gTL3G9KzH7lqgRN3fGf75kQSSisY8l7/FNqB4Qt0hHy9pf519tBeVH6dr08G6vCqszelI1m0R/jr5425gVoJj1udPtQ9PewlWa8/aoH+jZky2q+8tRv7XpcOn4c1eBMWuCgPxIzdVuFXq9u0JkDzj743lD7Q3T9g3NNrAyMwn02E4/+yUiTMt/LzMynOT6puJV5S2zuHnLwkyGKROLXB36jk/PySiyfDZ1LZu0XuaIXcwkpWB6rg0qiuAhTE41pDtUPDL/wCPF9xI8JXCXWVSIgiEFLO1aTDpxbW1iLjiqs04y2UWuYjquAODG6nmzu3ljMl0PWMHtK7XcdFrXTGb0W/B04jTGQGwirNA1eJF+qGGvJvTbgF7AIIDo5w3B8bOpUR0FD3RPkllDqSsQQV1v2Wt3MS6QocqCWYfsOleqnRChWiVc1txaWow/f07sWDB9Tbvzysvh3h6f/CuSpYnGNe/uVorAg+eY0dBdySVmkoPdUFH0mREhWZM+3cAIdSKMeI7gmIR5+d+GBW3L6NmpI2ecIY+P/qFNkC/zaYsGMGLv6H1VDAElHyiGuf4AX1jH/knOBHzMMoz5RQDCaRiEcCucCfVJhnh7trMvFyhQ6RLy7OKvdJnpA8JQyORBFVWLNJZlSuva2wRsBpKC58UqmJ8jbYN6uVRXBUqayOA0wFpyS0SQNCDkrJd06we2yPuDZ+kPyCV/cBQJI2grAs1zv3XNUczO+f8P/GUZkhkjFj8+GYRNEQDF/x8YjdIn+BwP2TFAAd4ZchvDw13yVt6sL7lsUXiC0qb2ctFyGGZXUb9SHvf/DmRLGLlSOLZyA5oXSjS59PMNqcHyzs6rccIjjWQfTFuV2QKIiO+03YXdvpwBRjO5xhgPxQQQHmFy3TNPlEaj4nkNjiFtjTosEOpCMfTQzPGGsJDVxJ75FQdfganwmEtL+WQ+A/JyC/NNUg1a1Rbb4xLt/GJ5omgqoTfr1Y9DFb9HHkCdFtnDwzP3nSeIsiGTVYOI8o3gEF8oZtS+FDyo5dPPfrcJkdkkhgajn1/lGXfnXjxKc7p5hIKcrwslrLrwfNzPomlENkjrsvHDszXOam2FjO9yYR/uB2mZdJwSlEQ9uBB/znlFe0KQpVQp+nn0rw/RwzO9ErNH3KKeE8n0F7P4lwrki3tmJVS6/R2MLci1edBcqFuJQsQzHvvcF9YzWY7oVH0F/y3K/EBDOZgAHK65zypdEEBxTOJVS9f9OR9TJ2yawISJ9hgsdVspkRA3nHIkLHxn/rGxBzR6i4GGNbjE17G1MdQijr57Dn3Kde8Ba+C6Xdw2YZyLtAJ0zkceSYyBi64lECKR2ovMsYigG1wA5PAKu1NLkm/Nr9nQ/OZIUug6IltDpR8PVoF14ZSDG1ysHppKd22D8DmmVKYnH+7KV6amgbzcSQ8Ua0/eO/yLLjurIfsN8XHpk6gxz7GpcZjfLxbAPQVXkMKCd+EA5z7ydBRsrAJ8N63TID5eLVXOhiJZE6KP9Jo53KhDNR2ifG2hxpn3pBXMki2bappAhVLY9uoSSebQs2U13O4txZJVK2m+MyYlW9bxb1kdnZgKKszwWPFmpGSV0tuwQ5RHGIm/YwqE/4EmDlTD48lf6ZnbI6JzWAaqi+bYPdRL5vi/IDrglXV0vJqWM7Jp2A3CTBE5elqlrBRm9Cd5LUdN6W93axQ44j3Xch1vgzXzaj/iiGVZ+//2wzsgJjKIBM8+7Q8XTXrSbSd9koPY1rttk9TGE+aC4VOEkCe3WKAl8rEOKdKjoEbujXOkPqBcIwPHTA3joZXqftEWTRs5ghE28wtvX/ebcRmUKMyzHlKBYhJklf+KGHjDRxuUL9EhKWH53ktQpwoOsLE7YdNgSf7HFW29mCM6h6yaUbehXac5PGwAw+d38b31GLUNhMQANwx1NOWBUe3zUHZOa524vvxmG4AwrNlHpI78H8DlqvaZM6Jdh9vLv3jVzDYmTXeZ0Y8Up4q4ymWYlX3ITsHdCbXTmur39BwF8YflKgA5bveiF4LUAwcjrE7x8RF+hKghqDsRDDz/DOrSq6wV82S5H1FoPBUsB3yKGeFekUZ8sscft19Tq/0nkdjnj0PosCO9ywCF3OXVXk1qPecBmPAi6DglNdJLgdS9I+hz1bnXjqrcqz4IL7O89u/xuf8Efby6VxvFgIm3Q/gWVbdazhC79JpXvAsF+tbWoONcTxPwJXOlL9aR4sfrbCUodWAl6NYIJ8wVSbsPyDPURekp3aUmyc5oPqwl0esagXnwt2YH59uP6xCNZ2W2delY/9PCXU6Cu9e/S3mYqOOItNsTmFTZw9N7H88JOLw2i4rTNFBlaUD+UW+wmJbYwoB8b7lAeQzjDS3rw9pQ5948+BRndAn7v38UgfPOSGPx+a7AK/4tRQ/FpX9ziqFWIG6/e2W+7dktKI9n30wuwypgj9NYoNvncafLJ6SU/AScoveh32HAhg9deUGNnPjEwroM5OQ6Xs4BdeuWDzcR6HwM3ZkPm6w6aEHNT8My1ZEPjMr3P/vhhTj4KO2p3+uN/HMQSpSspruMzw74YjoXRXoDe8jNgEsNNUWV2v0GohxK1DqNdpI4p4euL44asRhE7Nt7JMzC/IY1DFAFzBSJ4Q+vvSLvtDY8p8nxZHSUgW4M8NgyLhaKtJgwFwbcPezKXyUOnJgD3lb/+Q8i5a9Oe4mm/V29M3qJeJsb+zslbsXArXzSOMXbzKgINnamtNZfxqRkALb/JPkVPJ69Q5mQ6PdQVD7vYbNcDYWcCNWOheKEAdNDtwJPDwK/AW0dlydM8znWQmRgqQzvl1cyve9l7NvX1uDoqDe/TDzGyR4viPdAHbmdeCMeDL2TtHwJ/6V88nJDBUX7F7yb24T5SRKyVWLD0Xnig0UdZXwlM/SqpsGW3S3jrpD7YBHhvAQNrvbdwShCdjxvyiVdbC/9iMaBVnPHvF/Lq8hylTvOu30oky9mDrUi/F8A0eZoClQpe1xIpedHLYBhD6GUbznmqDelT8H0dpk5PAIcp1ZvnFD/NviEEpOB0oVndGjl9TjXekUE2CyKu/PkvZnsj6lF6JjaBr4b+s0GDS0X2byTP0wRHjxhv76fBmWruJkpBpTavB1kUld8DqiOlReKOPGT9eg3mVwOrxBfxr7s8NSNfgmraYy1ZIJPRYv3cDVmXWkrIlSjNHAyaEiaHNojt/qVQvNO22WQELx2i/rLOSi8dwoE4vfGfpD9LQMhMDpOJ58mA9/VMOJ22zll2pRXTlBgpoCZDMOJPcewNcHXY36pmNB4POxFxv5K4CuLQKEmzSlEG82H43XmfkMFJ3LiDXxfCFdmRA18gb13FxCwDEdNnlnIVAL3Xs1kvIUsguRE0VhgPMWWI9HYDgkvKYm0eV19t0vX+gcWJ2H/m6210b5iCO3pdbSoKUGD3HQ0OvRX2PokVQyAZJnotaBRoIGSAPvIWCPG92Tq7bHEgoG3sKD9v2v9SKAoUEeC8JaqDacw+dmfoyxOiOCuGmn+EBo+uIX9viz00/fggQKpPSU1AA2J1ZlgUi6MFf19DltI66Z8jwIjdl/Rtx8gznF2emTZoYsoaaguEokDRYvv3sQDAzf06hPuNf+RhHrxoaXDZQwVqqAZ5qbTTvm8JrwGkKUzvLBG4JJFgG9BzKMxDbiUUAkF0flyXBxgXLngGW8Ob3gtxplwnCDbR2sJIaiatgfkR9nDB7/4P4kZWVF0M832SOUcxsX2seHQ82XrXZIOlYdCmmHKBVrj3TLZWrstW1JVawC5BZ6BkkwOx9XO703VAcRY+3doAzFGiKEooMZ4kgVWHfe0Oij9ZIoGpDJ5SFjvhEUg3cvYYiZqfnmesL18F63YKL0TV4XMYt1R4Do4+Fc+wLWrv1LU1VTRpHDuGJukfMiG+Sx2l7PrbEyOZu32XL0OaNhEthrqmOKj7/4TGMo6AaiBBhssh/6LqGwkXo7WRdjv8uGZ2eyCEpzQ18Y2uDCnAo3u+qeHHawPb+GQaWoQUTZw9cziAgehJaiWFmwe/xxd/9XaM8S2L56TJsSbyevUk0dJHFJS4A9sFapF+qraVDlB9E2sKhwxzV86SVvvaOGFyr3LUtJ/0qJNJlSwhsCbvOIM6k3OCTSiK8RkRWNHDLUaYApxB1k/sR26l0Pbyb5UaVRB0QjJeXkdhtSNIpwfsYxG5YGVjNGHTfo6zhlFnS2kyuKPJBFFZixDvz8JcFwSUCrGsrBWDuQpz3PnkmBIeSA742/sX8Ts2l+DzEqOQV6+I5B0Rt2yQyOWSd7yAq0R5DP8pDAB+MQoWpi0Duh5omC+D0wd2/qN04klYOCEoAOjA7cjwWWnjC4OXghkUM7g8WEi34HsHrj9zY9Gh2RTCLVFreRtL+GUxxnlFwtT7f4WDileQP0mdYHPjyEzJ8mSZVZSSA1uetZ+aV+1AC1k5dbSHV0sZPY4Xcw8z3QOnxWoVhUQGF6o/bgKYSs/2HO2ybSYWEhBssKwy7a6ijbWZ1R3YbQ4nxw/GDkDUst7P6tYK3ZrWUCzZnXtDzqoMQ8ptVfmvapJeHMbJEZgyS8hhHn3OAc4qHqTDh1FlgCYaKE2TbEMGBEfrvNgdso5fUb/SxG8OEFxyabfADM4lUzZ0W1/qLP0BjX00aSIszbxgImn9ySY7Qz5CSOUX4m7MVKlg+qDaH/IpoeP47G0SB5dSeCbD6iFwYFZYWUc9HKO6MPMHf3n0VW6fsuwXAVfuGtdlXJ4w1ATRLVSFgRISgK8NeCZ6Yg8WuWFTlz9HaMRuKTAnYvjNAbdn2uV6KGGj9zuJWn5rRHWpr0WjpwP693TqxbUeCE8PaHWvKxAKDk1gAFTz6s5QaZPWfL6H0D4AJVVrs5PtF80c7NvKYKeh2dEl2zUHPieEk1dhAsUFzVO83r7IsnxIrBJTM6k+dpIn1aWGzfsjmOcNN026EWGHCVzQFU+LgcwrGfTbhsx4NovuqkfO/fb4QZFGIVNr0zuwl6PIPboVI9tVwi6ouCbnXDSCJaf2riRfDT/Jl/rvIANmfeHI/ohUy3L34JBX63GglgsdJ73EV6MLKduYPs40VQzO855lg+I/qY45Ic8MHRhJHmbksBAHJlUFY3DItfjY6bgG8VtOKcODsCsVKgKnqccB4TpoL1zTZ5KBhZnizeDuINZAO8KRPL6I3EByEhZMMNh8i/n1WJJcVLipxy34TnEBD7Qr4SN7//RKAnWGmW2292lTlZmiMcj8rOfSclDh8nN17wfLZx9Sfd1RwApkN0Iz/jmE60lVlzy58hhKKFhOG/656FmJb4zFdTW4phBhAzfr8qb1h012507TeVPjlsSqKNnkJBWH+SY4PGO6c7oi2RzgPqSmWvgT5CuUGFrDbDx32lyP+tlJcJ0ADUrkKnsU/+TYifJGuBrNWZh9FzeJoKhbjTvlwi//okRnoMc33aR2BX1cvkdMakt3dO/Fp1kdjVXSFx4aOTnzoso//WpS5HpSnpfDqvVACTuE7MuevEaqZ6EkvZyH2f5bCgwiWZ+Vd7njJ92FzIN3c966GnPK/hTyA6y4JSNQM24QxJsFrYOwyrlHj8jtgLALnH5Cm9/FtwxEvk+ukF3cX2FzEE1+3spCjG5kyJrJcNIxvZyDJPotwA1yyIbXtihq43+FsKrIiccVwgaD//1bHUiu1OWCn65YNH5miFmK8BHkNcvO7H7WJKomgX8lRX9lvZZMN/d7fXjUPgj/zkNvRQ298U79LnWl/zGg9lF7fQHTUFzaYppAJbUAoN6+8zrSBtOVLwW++AQ4RSpAsnwjamLExqEdS1cOG3Im0gN5Pcdtzvjbrc1q5lgnc4V0Py7KHKjwR6NBw0aY/QVtC61QPWd6s1OrUCfC1RAxC2fdIa4Rg0zDt9QU6o3wl/BPRxTIEd5hCyMzsnI8Z/mwmqJJ2O29PEPAaba8R+etgYpet81akubk0f76BYVdnplIG/rYSRwQVZIcdtPHhRnymwJIrgGtG/dn+DXjWiFjMo0gahwd6PxJnQxu0ASxeZKFom5i65DHNaTDUFUZegGshJJbMdoqsiO8Yd29K9Sqd/4TO8UZf17N98Tf5tTbVOnA3H/imdKffgDkb0uF1TfBq80JdGax6m7JEAqsSyl3RGl+3viPtecedKTurP543EouH3e/kmbMkG8P8sqwF2bwP1tAHB1jBynzH5JL66t57+kMa2J1gcsdVqcRhtyJmhgq8ayOmLG2Wxs3xmiPDBd0d6IpViYwZdeD+Gtpx50TWldKzaLgnkWap0uteTurLcRgq+1+gGztuOTBrvfo744IO1nqF48xW7c+MhMyj3VRdXBRl+1y1Ma+55t1OrS54K5kAGwen4SGwpiwNrv4wHY8mXE2hHX3KzXWyT8vzxr4LFNOQE6Yv3k7/50xZ6p2lHIH1HGs4pIB1wnIUOcTFZh2qNHTGkni4YgUghnHItxqC4hdzAVDy7bt0+uR7qEh8ZmVl45Y73hLb1n5tyOI8CKWGh4IKTT/tYsUQRz71x4NGSAnpQUv0pAQIG8iaxHUMEl5LcpbNOR1B6SRxl9djKI1Zo6sHrPS2u3AplerPC0jc7W0UIywVPyFyJKqBToZgYcV3GanmWePKx/pC3wWw9rGUvsnvOm4i21aHu2uBhsVL6pCAZmETtCsbvXDFXArOHaEjJI2gaJtc1m6frVDgSl4bVhHVHorKklAHw/EJbIIGyKGH4aB9enJmUOGLgJcmbnNrAayDhk6ADQckAJa8nipeuNdgo2yFYr/KtOxmld/5ki/IbrTwgnrsp59PFjcg53JTaiiwTECDACDtatz4tjtiAXsOeP3WNXEWq030/SIaxA25g7GxsEmsWZ1vl6cmnxwbA7BeWIbfr9mBpPzssZRmuTCpxZYm87i+DNITpUphRcDaBS6BgFIEfVp2lNPvOK+eJfuKAyZLm6RwurLPv+z6PffC3BuGDPp6+ttctROt5oFQpROrjiVmSrn8l1/cjkF764O5M/P6z96Hwb39AOwjnAezTq1ZZippNJTU9KDOtPoGt8tGmqjpue+U76Flet5DHvNPG5juPMVtxAw9Er9gYW4sRrQRguj4YFviOh1671q6NHxVaQd30VjWVx01CbPKCem1NwsvaQ23btak8r5lopfx5NLNWmTX8M05ObCT01MiTEUUzm5guNsW1sIUDXIXaS4vpnM2G8bEHJgZZQ7h74SLkNlPbvzDMdXJU3sHl+NUgM+xY1Eu+Nu83HVbeQ2tJhzeT4A4IPEVb+GJFkSYJCPx6uuWr7bWzRZeTPZhZTHrsqFUSn63evu2r2uzF9V2pRa2tBdMbFf+GGBGA9tYJsSpHvR7ahjfFzX8XCcD6SVDF5I77SmuGFbEtKbX7droaJ/KRVWXCaSPZL6FHVl/5vi1XgB5zNFg5+tTAO7oFwXcP97pWVybzYnrYiyQ5SbJ11gEP+bNweUxbG1tZxgQykRtQJgr+nBAgA2IHA5EutiFDLKZndB2S3C/dL3wEjqFO59Cnv23/2YGMgRTgFuQ2nf3Yrlr5OoZ7mUjcZFw/KO/XkjyC6kxwZkSZN0oQnzFCA0wuMJlzTyevIj8bcGUVqc4cq4TBWvDK/tziq17zbD8Z9vw5n2dPj4+ycYYthb7bRjHWY1bk/MVEu+u3F5fWxXSZ9cZSMrMAT0nOiBvfZ9CGj/3nAgZdph6C4+cDIlSXDae9sL7qO39zJX53hvSWePw1YmiR4pZbSboPqwIC6KV+hDI2oDNp6Bbw+RCTuky4IYhNwwXlooDbK0X4SgGwM8RcmQqEUy94/NImm/L3QpYsX5ZXjFZpJU4s4a9NpZn6Yzdk3B+J4D4ooQamQhtRvQg2xxcwDWUN3xidWfUV9D9/ed3Otw9DNulf2rrV9Tvn71bXttvm7f7v7s9T4KwJUkJiTu4BwhefFmc6U8Qt7W3G9qBnbnVJvPJ/19llHPgNh0+5aQLOv5nlL5v2eChSzpD8QU4HEEz+XwKxRRijTrpYgvb+IsDwWtMNXStq8BhgZazlrdFTZgSuDzZWDBqhvOt7V0bByg93n+4KOdjbtqPqarJlnQt5yitpHiHBlRFWE1ng/55Fs7qbQTAnzQHGgzCBw64P/hQBcnDNqTcJ+vFVsWhMRqFEyyfPEHuE1tZqJ3CWDCfo17lW6G5wOkyfeE7VyXVJXRrGZeOP77DeD7UieYw5dH3cV8leRuPJzr8PnsjtDUw2c2RONvt4sU9wJWidUl79EWGl6m3mo4nDnAyPluKoH3NP7gVozmSk5fPqUk3BxjSCFpI1puIK0KxRzdv41FFmvfNTeeht2QhqIUq9GUN6oS/Km88jtaC6chRztOFNenkEWbnGOAfKayAobU5T8yjAec7QnjGTGCvCRkyXVMEH4EYtx8QwKW+U4FwtMjXjJxDCjdCkdkdz39r3vU9M6bFwC/sYMLVLIQxecyBQcmicNsZQHxl8CEYUq4Mh8xbmGRrsaWK+JJ8a3fdO+dTXn2g2Vvx7zAJVRicuXPhB0B1eSQb3U21MOaBOEq/WPGMH0PahTQsRkhtXL2q6ppB2QPdwyn58J2zVPfAVKNfr+6UXUaUgbEHfyIMliIncgJzFN2qIkurkJ3YHXPctYhe/5VWmaUMEhs9UOh4/8zzVQTJFbMoqT+2Q2BSEK9S2OleBqcqkHm9LTlaxmSpAbP2389H8+zL2qfppadwA9FN1QwK4mw8m+0ftD6G9BiKjaZWIdk1OS7cFQA+GOazcEwcQUunXQJfDahY8CfhJ8V8RlsuPDxcDp1oEriREh8/6tc3OtVDpskgnfTMjLTNm4WbSJtv+9EqaBSr4FsJttksMIZ18DNkYrqlnCUrSXaQ01xmDgGfvjqOvfMBt6rfWvFx1RdWu4ay2JBBl8XydkSXDa9MjFmp0GcUGhPfi4kbRXXGANCUpK9rIZZiSB3zU4XfiRYgZjVlfRhxb6eviyFYINcWla/2eZAxivAdBSFhx6r1osbhpPoc5hc/ftf9bJ6kVE9Mc5uRPS7cJks8D3Q/0EDXVk8iHT3Hy4bP5HSqnV8Ry6VQyGWoO3SJTA8XDoSyxjJ7Wna2Y8i8E0CxTnVpH8x/bMp2EDVHeHxqlRNuZH/O0dZQmqbT6RwhBK3DrdZ10LFcWgE5IlSL037fXH9E6oKfTGla0qgTBRmkNxi+JlZgoY7D/KRxJ3eKCLA8SOgl53XtYbMaeZPLJuq/5Dd2gZYK9jsIOg6Frn0oPWo0RVZwTZwQLhC2PlCYb5+3H4rObWPG/pTGLjeOdrFn15tdY+gT9GEl/gji8TdYHDU1FSVuVOGfPtMNxmrK4xbG+rh5WwoaF0evRR7YoaK/EsJFdEKcv2gDsA9wmC79GR1Ne+fGIWNV4+ObRCZFkKZHZGBYKB6lkV4P0oo3QZBXOyCG5qE1zg+Y3pfA6YlbxyP2EqiHX+LGo5eW3vwqGW/7wC3pjDgA1vDvqoZ2aA0B1E+WeoWOiosnCXryf8BGuZKDlI5x3VCAgfYs+852SWMyVjFu8b3VfnMgEX5hfHKK3Vnf3WqgLETRnMuriO7nFQhmmhWKca34/sao4eBmTRF/j2wL6IKg95qqFZx51meXMZLfEoW8gOD4Mb1DQWHlX71r7uX6HlCpAKng4f8QcslZdRwAwkxa+yfXUqVp5lOS9PxF7puX0M819XcKCpJ4HrFK26Yx1xsyRI4OqfwUOHD1wJGz48eMjOsoSobkCf2ZDaGt1TIu04uWKAjX+E+iaCwOL/i5MgC0JIBWmeRhFVUSODWBwZ8dxpzUyLDrUU03OrY/YOfVGCOXhZWqkbWUfDiTtQXRNnTSvKn9xHscQApYwe0nP1LTzGJE8qiC1uDQcGNXDp2fPmdyQA45pDElTwyco+7s8akI/OUxa5eUEidrbtwBhJadgX0O/OYWeGDMF38MNy2SKd72ALifs193zsVwstHgEAOqlf876jLFYsGWKJd8rZf6L9hOqFlszmpfdqF1LAPLWZ8hy2XW3cHVWlqr5aGqq/BJKwp4QfCNWUcBJQE9Dh27w+xDmQ4TWrpHbZR+WLHQlHVon+TUjx1G50a6+lr3nJPNFO08jqcHxwVZkQhzHa9ghFQDqJfT8hNscYtK2fRGXhpXKXVmjeQO/zhPxwNwMQUcoprY2uha2doqYX+YPKwxrJl7p0l9OvKlRGLtRFZFUMXZrWKtO64iStuZ6ZtFc7yKENwTZvX9D4JW//N2YO8b3lyj0YstNJ1Dv+1+gu2L80tl06z3jMBSxYVKPvw10bekG9QuyKsYOBWckr6axvSoF9575h4jbNqFAAKhWMEg8GoNOVl+euamnaVVtHn1Dtfkm6LkpAU+X+H6t5eRC+FXSqPQobwb35UANqyov9xf//2/wNhqrVrkXxgOJnIA19BdvaDS0wXZfSCJX2BIqc05y4H3vScqU2L+gHyyQeEGg8SQYTFuknyJLhUHHCH4yBkP4mFu0B/BLqbLR8mlAVD9P4uqSyeFPL4sd2B7TiolH0/EporHJbg+W0OJALV0A0vLRoPFhkLnkOXyHix+dSFjMWMOtoKLwE9bFp29UcCNdkEscKyQU9evHJ5iSWFxhuMZXYlLdoClsGmICAP5y//ke3PtSEEe6IF6gyy8sY6DlEYIhEZLAsAvWR4IXptAfS9nvpkYYE2Gc8FOqluWxCFnMjmnMVEDrjBycUzknUjsqJqUAPLQWrTQE0YPaJJIXlTqzUnwQzgtJ5NDXMod5f4/O8Vf4/Xmrhde8HMQHrqckrNYkC9BJtml24tLt6p/41vLOX0vIHSQhu0eMMZ58abMOOcjsHwNKRXIE1GddVprsbZeaM/tPzfsAsGQzN6/DxjeO4PSFRnKG+JXrEe8wQ/8bplVC3YkBGZHmhx6lk7yDv55hgqVtjQ2SIovKOlbLdbYdBncKUXL5diM0Rc1p9KJqsZblJql/OHXSlxbVMtzjHlyxfHGitN3CNBYi74sJUNA+1vXKLQHnBPanaMMmce8FZhxqquaZ3ydlVc4GgrPR8Eweis6N1IYa3ihBA5nmcsrU6ecAtPsdn1DC/qEngIzDLfmCaMIa1UPdxOCDV0Z9p7bUe1+vH2W8aAGjsAjvuQk8olpFS775f0+B/rATA489sslYIFw1YO9x7c9HhNeYFODOLernE0/BORq7hfVjxAl+n9msdnq7O8CTcRfniDaANrirOXq+OVClvsDPeV7rlCjVJH4EwXEiB1mp7XM/87m28LXfU6SDf3cxQeD0R4l3OHCGqT+kT2Tb7xWqw8hbSTr/5XGkjBEEahxt0wun0+O/vbPAT2K1qFtvYDOjthznVGOaSqm+EaSxe5IaqYIyTcXqYpWaWwz/os4rnY170ezQTvXoPpeRW/8ZvDrlZceGV/+Gr1wjw4GAD0LIGIrdcg0NGU91Xjv3EcY1UZnc1vBb2C/HZbzcfrA4veCIAhKLVkmEY6CRGxwopfmnj+68R2/P9jmwTestt3Q2wnoqMS1Pa3GX1jT3Au/zVe6C14evRK35Ru9qAV/E04CUwx2tZJq4pNk1kbYF61Mczp9rONVsCJ9DX90cMaPmYvzcc2ZeoYw6D53sAAAAABybE8qxTKdtFlWoeR30zHlboZB8XsG6XecMWeqIdwif95cBfiwNP8XCRM0vJxR3C6Kw0ayYiCrmeu+yo3IUENKdQy4LLQkmNm/WFAuPMjnHLn8t4T4hLDwVVdLOX4j3GsumCq8pEnST3u3bPh3vhmyw3ogPa93ePQcx98Z4RLojHU4x3A49aDu02/uLx7ZTrbBzd5R90oOzkgjtExtk0qNCK+0zD5zliNaQgOft7vzzsVWXWLT34HNAlagsGHyUiIZXY/qu0vePD3D2UEomXTRHJYqb8f/mv5l/ghvp38ZyBrMnbVgQoyFJqSLwsmpb6TQdXeJ/r2Mb+azXvxX+crL7f/7ikcfFXfHujbJzSUyGrYU5WZreB/edr35ABWMBD0hzzz9NaS9sgPzWxD6qF+DVbwPYPFsV61SyMjs93jGzOygUNGKCOjgEy2gj7gOqs164PON91vEZrB09cUxeM1QX207fxADOUUbVqb10hAGG92qKMT39fPeAtL3RBu9JeNLhOmJ7dg2BHHcSLDREr/UJYgM0ozw/BR1I3WVc5WnriVWc7eTafhd8Wq6I7XLt7gCAAAAADLivOAqCFuHmmuis/q+h6mzo+qpPcU/p2xeiw0qQUHM9VB+cC9eZN6+ipzHYXM5j7EML9L0RgZxkxFFQdEMriQq6uyGzCrr+ok4hSRTawXkK2wYV2dYyHKYa/5ExHiE74+VaUxGHzZx1mPKH6FsQNPzQy2GfCf+VF1JJTBFHlWJEev2kTSdzvDNIDt88+tDQ3bz89VTDu9LON9xAOBqf3CirSRJ15Vw0qK6ZbTutaGV2108/xbANxIPGX/17zscvlXQ13stviAAAA';
  const SVG_GARAGE = (c = {}) => {
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
 ${c.garage_car_image || c.car_model === 'puma' ? `<g><ellipse cx="130" cy="150" rx="52" ry="4" fill="#000" opacity=".35"/><image href="${esc(c.garage_car_image || PUMA_FRONT)}" x="76" y="${c.garage_car_image ? 82 : 75}" width="108" height="${c.garage_car_image ? 70 : 76}" preserveAspectRatio="xMidYMax meet"/></g>` : ` <g>
  <path d="M84 146 V112 Q86 98 100 96 H160 Q174 98 176 112 V146 Z" fill="#2f6db5"/>
  <path d="M96 99 Q100 88 110 86 H150 Q160 88 164 99 Z" fill="#1d4a80"/>
  <path d="M100 98 Q104 90 112 89 H148 Q156 90 160 98 Z" fill="#9cc6ea" opacity=".55"/>
  <rect x="88" y="114" width="16" height="6" rx="2" fill="#e53935"/><rect x="156" y="114" width="16" height="6" rx="2" fill="#e53935"/>
  <rect x="116" y="124" width="28" height="8" rx="1" fill="#f2f2f2"/>
  <rect x="84" y="136" width="92" height="8" rx="2" fill="#1f3f66"/>
  <rect x="88" y="142" width="14" height="8" rx="2" fill="#15191d"/><rect x="158" y="142" width="14" height="8" rx="2" fill="#15191d"/>
 </g>
`}
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
    disconnectedCallback() { clearTimeout(this._acTimer); }
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
      if (this.kind !== 'swing_gate') return `<div class="scene" style="aspect-ratio:${w}/${h}">${K.svg(this._c)}</div>`;
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
    // a = commande demandée (open / close / stop) : pour une entité cover, close → close_cover, stop → stop_cover (sinon open_cover)
    _fire(id, a) {
      const h = this._hass, d = id.split('.')[0];
      if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
      else if (d === 'cover') h.callService('cover', a === 'close' ? 'close_cover' : a === 'stop' ? 'stop_cover' : 'open_cover', { entity_id: id });
      else h.callService(['script', 'scene', 'switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'turn_on', { entity_id: id });
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h) return;
      if (a === 'pedestrian') { this._fire(c.entity_pedestrian); return; } // ouverture partielle : entité dédiée
      // contact sec double : une entité par commande (entity_open / entity_close / entity_stop)
      const own = { open: c.entity_open, close: c.entity_close, stop: c.entity_stop }[a];
      if (own) { this._fire(own, a); if (a === 'open') { this._pressAt = Date.now(); this._render(); } return; }
      if (a === 'command') {
        this._pressAt = Date.now(); // départ du compte à rebours auto_close
        this._render();
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
      // auto_close : portail sans retour de position (bouton poussoir…). Après une ouverture (appui sur le bouton de la carte, impulsion de
      // l'entité bouton, ou état « ouvert »), la carte passe par « ouverture » (travel_time) puis « ouvert », et revient sur « fermé » au bout de N secondes
      const ac = Number(c.auto_close) || 0;
      clearTimeout(this._acTimer);
      if (ac > 0 && st !== 'unavailable' && isNaN(pos)) {
        const now = Date.now(), T = Math.max(0, Number(c.travel_time) || 0), dom = c.entity.split('.')[0];
        // entité bouton : son état (horodatage du dernier appui) change à chaque impulsion, même depuis ailleurs
        if (s && ['button', 'input_button'].includes(dom)) { if (this._btn !== undefined && this._btn !== s.state) this._pressAt = now; this._btn = s.state; }
        let t0 = this._pressAt || 0;
        if ((st === 'open' || st === 'opening') && s) { const lc = Date.parse(s.last_changed); if (lc > t0) t0 = lc; }
        if (t0) {
          const el = (now - t0) / 1000;
          st = el < T ? 'opening' : el < ac ? 'open' : el < ac + T ? 'closing' : 'closed';
          const next = [T, ac, ac + T].find((b) => b > el);
          if (next != null) this._acTimer = setTimeout(() => { if (this._hass && this._c) this._render(); }, (next - el) * 1000 + 60);
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
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy) && Number.isFinite(window.appliancePrice(this._hass, c.price_per_kwh))) { cost = energy * window.appliancePrice(this._hass, c.price_per_kwh); costU = c.currency || '€'; }
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
          num('travel_time', 0, 120, 0.5, 's'), num('auto_close', 0, 600, 1, 's'), num('moving_threshold', 0, 2000, 1, 'W'),
          ...(this.kind === 'swing_gate' ? [{ name: 'leaves', selector: { select: { options: [{ value: 1, label: '1' }, { value: 2, label: '2' }] } } }] : []),
          { name: 'invert', selector: { boolean: {} } },
        ] },
        ...(this.kind === 'garage_door' ? [{ name: 'car_model', selector: { select: { mode: 'dropdown', options: [{ value: 'default', label: 'Voiture dessinée (bleue) / Drawn car' }, { value: 'puma', label: 'Ford Puma Gen-E jaune (photo de face)' }] } } }, { name: 'garage_car_image', selector: { text: {} } }] : []),
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
