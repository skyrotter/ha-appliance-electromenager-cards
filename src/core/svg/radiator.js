const RADIATOR_INERTIA = () => `
<defs>${DEFS}
<clipPath id="ID-fins"><path d="M12.0 27H23.4V100Q23.4 104 20.4 104H15.0Q12.0 104 12.0 100Z"/><path d="M24.8 27H36.2V100Q36.2 104 33.2 104H27.8Q24.8 104 24.8 100Z"/><path d="M37.6 27H49.0V100Q49.0 104 46.0 104H40.6Q37.6 104 37.6 100Z"/><path d="M50.4 27H61.8V100Q61.8 104 58.8 104H53.4Q50.4 104 50.4 100Z"/><path d="M63.2 27H74.6V100Q74.6 104 71.6 104H66.2Q63.2 104 63.2 100Z"/><path d="M76.0 27H87.4V100Q87.4 104 84.4 104H79.0Q76.0 104 76.0 100Z"/></clipPath>
<linearGradient id="ID-fin" x1="0" x2="1"><stop offset="0" stop-color="#e3e6e9"/><stop offset=".25" stop-color="#ffffff"/><stop offset=".85" stop-color="#f6f7f8"/><stop offset="1" stop-color="#d9dde1"/></linearGradient>
<linearGradient id="ID-side" x1="0" x2="1"><stop offset="0" stop-color="#e7eaed"/><stop offset="1" stop-color="#cdd2d7"/></linearGradient>
<linearGradient id="ID-heatglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".15"/><stop offset="1" stop-color="#ff5a1f" stop-opacity=".9"/></linearGradient>
<linearGradient id="ID-box" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e5e8"/></linearGradient></defs>
<g class="rwaves"><path d="M22 18q-3-5 0-10t0-10"/><path d="M38 16q-3-5 0-10t0-10"/><path d="M54 18q-3-5 0-10t0-10"/><path d="M70 16q-3-5 0-10t0-10"/></g>
<g class="cold-air"><path d="M-6 50q6-3 12 0t12 0"/><path d="M-8 66q6-3 12 0t12 0"/><path d="M-6 82q6-3 12 0t12 0"/></g>
<path d="M16 30H95.4V108H16Z" fill="#000" opacity=".1" filter="blur(2px)"/>
<path d="M87.4 27L91.4 23V100L87.4 104Z" fill="url(#ID-side)" stroke="#c9ced4" stroke-width=".4"/>
<circle cx="89.4" cy="31" r="1.6" fill="#e9ecef" stroke="#aeb5bc" stroke-width=".5"/>
<path d="M12.0 27L15.5 23H26.9L23.4 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="15.0" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M24.8 27L28.3 23H39.7L36.2 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="27.8" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M37.6 27L41.1 23H52.5L49.0 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="40.6" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M50.4 27L53.9 23H65.3L61.8 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="53.4" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M63.2 27L66.7 23H78.1L74.6 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="66.2" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M76.0 27L79.5 23H90.9L87.4 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="79.0" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/>
<path d="M12.0 27H23.4V100Q23.4 104 20.4 104H15.0Q12.0 104 12.0 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M24.8 27H36.2V100Q36.2 104 33.2 104H27.8Q24.8 104 24.8 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M37.6 27H49.0V100Q49.0 104 46.0 104H40.6Q37.6 104 37.6 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M50.4 27H61.8V100Q61.8 104 58.8 104H53.4Q50.4 104 50.4 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M63.2 27H74.6V100Q74.6 104 71.6 104H66.2Q63.2 104 63.2 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M76.0 27H87.4V100Q87.4 104 84.4 104H79.0Q76.0 104 76.0 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/>
<g clip-path="url(#ID-fins)"><rect class="rglow" x="10" y="26" width="87.4" height="80" fill="url(#ID-heatglow)"/></g>
<path d="M82.4 84h18q2 0 2 2v16q0 3-3 6l-3 10h-10q-2 0-2-2V86q0-2 2-2z" fill="url(#ID-box)" stroke="#bfc6ce" stroke-width=".6"/>
${lcd(84.8, 86.5, 15, 8)}
<g class="micon m-comfort" transform="translate(87.4 97.3) scale(.48)"><circle r="2.2"/><path d="M0-4.2v1.1M0 3.1v1.1M-4.2 0h1.1M3.1 0h1.1M-3 -3l.8.8M2.2 2.2l.8.8M-3 3l.8-.8M2.2-2.2l.8-.8" stroke-width=".9" stroke-linecap="round"/></g>
<g class="micon m-eco" transform="translate(92.4 97.3) scale(.48)"><path d="M1.6-3a3.4 3.4 0 1 0 1.8 5.6a2.8 2.8 0 0 1-1.8-5.6z"/></g>
<g class="micon m-frost" transform="translate(97.4 97.3) scale(.48)"><path d="M0-3.4v6.8M-3 -1.7l6 3.4M-3 1.7l6-3.4" stroke-width="1.1" stroke-linecap="round"/></g>
<g fill="#eef0f2" stroke="#a7aeb5" stroke-width=".4"><circle cx="86.8" cy="102.5" r="1.4"/><circle cx="91.8" cy="102.5" r="1.4"/><circle cx="96.8" cy="102.5" r="1.4"/><circle cx="89.3" cy="106.5" r="1.4"/><circle cx="94.3" cy="106.5" r="1.4"/></g>
<circle class="led l1" cx="96.8" cy="106.5" r=".8"/>`;

// ---- convecteur mural (panneau plat, grille de sortie d'air en haut) et plinthe électrique (barre basse, grilles haute et basse) ----
// mêmes accroches que le radiateur à inertie : .rwaves, .cold-air, .rglow (dans le clip ID-fins), .lcd, .micon m-*, .led.l1
const RAD_DEFS = `<defs>${DEFS}
<linearGradient id="ID-cbody" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f3f5f6"/><stop offset="1" stop-color="#d9dde1"/></linearGradient>
<linearGradient id="ID-heatglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".25"/><stop offset="1" stop-color="#ff5a1f" stop-opacity=".9"/></linearGradient>`;
const RAD_ICONS = (x, y, dx) => `<g class="micon m-comfort" transform="translate(${x} ${y}) scale(.48)"><circle r="2.2"/><path d="M0-4.2v1.1M0 3.1v1.1M-4.2 0h1.1M3.1 0h1.1M-3 -3l.8.8M2.2 2.2l.8.8M-3 3l.8-.8M2.2-2.2l.8-.8" stroke-width=".9" stroke-linecap="round"/></g>
<g class="micon m-eco" transform="translate(${x + dx} ${y}) scale(.48)"><path d="M1.6-3a3.4 3.4 0 1 0 1.8 5.6a2.8 2.8 0 0 1-1.8-5.6z"/></g>
<g class="micon m-frost" transform="translate(${x + 2 * dx} ${y}) scale(.48)"><path d="M0-3.4v6.8M-3 -1.7l6 3.4M-3 1.7l6-3.4" stroke-width="1.1" stroke-linecap="round"/></g>`;
const RAD_WAVES = (y, xs) => `<g class="rwaves">${xs.map((x, i) => `<path d="M${x} ${y - (i % 2) * 2}q-3-5 0-10t0-10"/>`).join('')}</g>
<g class="cold-air"><path d="M-6 ${y + 10}q6-3 12 0t12 0"/><path d="M-8 ${y + 26}q6-3 12 0t12 0"/><path d="M-6 ${y + 42}q6-3 12 0t12 0"/></g>`;

const RADIATOR_CONVECTOR = () => {
  const slots = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 20 + i * 14.2, y: 30, w: 11, h: 19 }));
  const lines = (r) => [0, 1, 2, 3, 4, 5].map((k) => `<rect x="${r.x}" y="${r.y + 1.5 + k * 3}" width="${r.w}" height="1.6" rx=".8" fill="#8f98a1"/>`).join('');
  return `${RAD_DEFS}<clipPath id="ID-fins">${slots.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="1.6"/>`).join('')}</clipPath></defs>
${RAD_WAVES(24, [26, 42, 58, 74, 90])}
<rect x="16" y="29" width="92" height="86" rx="5" fill="#000" opacity=".1" filter="blur(2px)"/>
<rect x="14" y="26" width="92" height="86" rx="5" fill="url(#ID-cbody)" stroke="#cfd4d9" stroke-width=".6"/>
<path d="M106 31v76l-3 3V29z" fill="#cdd2d7"/>
${slots.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="1.6" fill="#dde1e5"/>${lines(r)}`).join('')}
<g clip-path="url(#ID-fins)"><rect class="rglow" x="14" y="28" width="92" height="24" fill="url(#ID-heatglow)"/></g>
<path d="M18 54H102" stroke="#e3e6e9" stroke-width=".8"/>
${lcd(72, 92, 26, 10)}
${RAD_ICONS(77.5, 108, 6)}
<circle class="led l1" cx="22" cy="106" r="1"/>`;
};

const RADIATOR_BASEBOARD = () => {
  const y = 78, h = 34;
  const slits = Array.from({ length: 23 }, (_, i) => `<rect x="${(20 + i * 3.7).toFixed(1)}" y="${y + 4}" width="1.4" height="5" rx=".7" fill="#8f98a1"/>`).join('');
  const dots = Array.from({ length: 24 }, (_, i) => `<circle cx="${(20.5 + i * 3.4).toFixed(1)}" cy="${y + h - 4.5}" r=".8" fill="#8f98a1"/>`).join('');
  return `${RAD_DEFS}<clipPath id="ID-fins"><rect x="18" y="${y + 3}" width="76" height="7" rx="2"/></clipPath></defs>
${RAD_WAVES(y - 4, [26, 42, 58, 74, 90])}
<rect x="7" y="${y + 3}" width="108" height="${h}" rx="3" fill="#000" opacity=".1" filter="blur(2px)"/>
<rect x="6" y="${y}" width="108" height="${h}" rx="3" fill="url(#ID-cbody)" stroke="#cfd4d9" stroke-width=".6"/>
<rect x="6" y="${y}" width="11" height="${h}" rx="3" fill="#eceff1" stroke="#cfd4d9" stroke-width=".6"/>
<rect x="17" y="${y + 2}" width="79" height="9" rx="2" fill="#dde1e5"/>${slits}
<g clip-path="url(#ID-fins)"><rect class="rglow" x="17" y="${y + 1}" width="79" height="10" fill="url(#ID-heatglow)"/></g>
<path d="M19 ${y + 13}H94" stroke="#e3e6e9" stroke-width=".8"/>
<path d="M17 ${y + h - 8}H96" stroke="#d3d8dc" stroke-width=".8"/>${dots}
<rect x="96" y="${y}" width="18" height="${h}" rx="3" fill="#eceff1" stroke="#cfd4d9" stroke-width=".6"/>
${lcd(97.5, y + 4, 15, 8)}
${RAD_ICONS(100, y + 17, 5.2)}
<circle class="led l1" cx="105" cy="${y + 26}" r=".9"/>`;
};

SVG.radiator = (c) => (c && c.style === "convector" ? RADIATOR_CONVECTOR() : c && c.style === "baseboard" ? RADIATOR_BASEBOARD() : RADIATOR_INERTIA());
