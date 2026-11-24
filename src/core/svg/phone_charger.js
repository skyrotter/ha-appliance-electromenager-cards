/* Chargeur d'appareil Apple / Android : iPhone (défaut) sur un support de charge à induction, iPad sur son pied ou Apple Watch sur son
   socle de charge magnétique (option model). Dessins détaillés : cadres en métal brossé, boutons latéraux, verre avec reflet, socles en
   épaisseur avec câble. Écran : heure, batterie et éclair en charge (.phn-ui) ; hors charge, écran « toujours allumé » à luminosité réduite
   (.phn-aod) avec le mode Concentration ou l'activité (icône + libellé), remplis par la carte. Mêmes classes (phn-*) et même CSS pour les trois. */
const PHN_BOLT = "M61 63l-5 9h4l-2 7l6-10h-4z"; // éclair, boîte 56-66 × 63-79, centre (61, 71)
const PHN_LAYOUT = {
  // iphone / ipad : écran vertical centré en (60, 64)
  phone: { time: [60, 52, 12], batt: [45, 66, 30, 12], bolt: [61, 71, 1], pct: [60, 92, 7], aTime: [60, 40, 9], aIcon: [60, 66, 20], aLab: [60, 88, 6.4], aPct: [60, 99, 6] },
  // apple watch : cadran carré 36 × 36
  watch: { time: [60, 57, 9], batt: [50, 63, 20, 8], bolt: [60, 67, .78], pct: [60, 77, 5.5], aTime: [60, 54, 8.5], aIcon: [60, 63.5, 12], aLab: [60, 72.5, 4.8], aPct: [60, 77.5, 4.4] },
};
const phnUi = (L) => `
  <g class="phn-ui">
    <text class="phn-time" x="${L.time[0]}" y="${L.time[1]}" text-anchor="middle" font-size="${L.time[2]}" font-weight="700" fill="#fff" font-family="sans-serif">--:--</text>
    <rect x="${L.batt[0]}" y="${L.batt[1]}" width="${L.batt[2]}" height="${L.batt[3]}" rx="${L.batt[3] / 4}" fill="none" stroke="#fff" stroke-width="${L.batt[3] > 10 ? 1.4 : 1}"/><rect x="${L.batt[0] + L.batt[2]}" y="${L.batt[1] + L.batt[3] / 2 - 2}" width="2.4" height="4" rx="1" fill="#fff"/>
    <rect class="phn-fill" x="${L.batt[0] + 2}" y="${L.batt[1] + 2}" width="${L.batt[2] - 4}" height="${L.batt[3] - 4}" rx="1.4"/>
    <path class="phn-bolt" transform="translate(${(L.bolt[0] - 61 * L.bolt[2]).toFixed(2)} ${(L.bolt[1] - 71 * L.bolt[2]).toFixed(2)}) scale(${L.bolt[2]})" d="${PHN_BOLT}" fill="#fff" stroke="#1b1f24" stroke-width=".5"/>
    <text class="phn-pct" x="${L.pct[0]}" y="${L.pct[1]}" text-anchor="middle" font-size="${L.pct[2]}" fill="#fff" font-family="sans-serif"></text>
  </g>
  <g class="phn-aod">
    <text class="phn-atime" x="${L.aTime[0]}" y="${L.aTime[1]}" text-anchor="middle" font-size="${L.aTime[2]}" font-weight="600" fill="#fff" font-family="sans-serif">--:--</text>
    <path class="phn-aico" fill="#fff" d="" transform="translate(${L.aIcon[0] - L.aIcon[2] / 2} ${L.aIcon[1] - L.aIcon[2] / 2}) scale(${(L.aIcon[2] / 24).toFixed(3)})"/>
    <text class="phn-alab" x="${L.aLab[0]}" y="${L.aLab[1]}" text-anchor="middle" font-size="${L.aLab[2]}" fill="#fff" font-family="sans-serif"></text>
    <text class="phn-apct" x="${L.aPct[0]}" y="${L.aPct[1]}" text-anchor="middle" font-size="${L.aPct[2]}" fill="#fff" opacity=".7" font-family="sans-serif"></text>
  </g>`;
// dégradés communs : fond d'écran, titane / aluminium, socle mat, reflet du verre
const PHN_DEFS = `
<linearGradient id="ID-phnwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d1450"/><stop offset=".45" stop-color="#5b34c4"/><stop offset=".8" stop-color="#d9609b"/><stop offset="1" stop-color="#ffb08a"/></linearGradient>
<linearGradient id="ID-phnti" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d727a"/><stop offset=".08" stop-color="#d6d9dd"/><stop offset=".22" stop-color="#9ea4ab"/><stop offset=".78" stop-color="#8f959c"/><stop offset=".92" stop-color="#dfe2e5"/><stop offset="1" stop-color="#666b72"/></linearGradient>
<linearGradient id="ID-phnalu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef0f2"/><stop offset=".4" stop-color="#c3c8cd"/><stop offset=".7" stop-color="#9aa0a7"/><stop offset="1" stop-color="#d3d7db"/></linearGradient>
<linearGradient id="ID-phnglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".04"/><stop offset=".36" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-phnpadtop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5058"/><stop offset="1" stop-color="#25292e"/></linearGradient>
<linearGradient id="ID-phnpadside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#15181b"/><stop offset=".5" stop-color="#3a4047"/><stop offset="1" stop-color="#15181b"/></linearGradient>
<linearGradient id="ID-phnstand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c1f23"/><stop offset=".55" stop-color="#3b4148"/><stop offset="1" stop-color="#202428"/></linearGradient>
<linearGradient id="ID-phnband" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#23272c"/><stop offset=".5" stop-color="#454c54"/><stop offset="1" stop-color="#23272c"/></linearGradient>
<radialGradient id="ID-phnled" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#38a8ff" stop-opacity="0"/><stop offset="1" stop-color="#38a8ff" stop-opacity=".55"/></radialGradient>`;
// socle de charge en épaisseur (dessus mat, tranche, anneau lumineux, câble qui part à droite) ; (cx, cy) = centre du dessus
const phnPad = (cx, cy, rx, ry, h) => `
<ellipse cx="${cx}" cy="${cy + h + 9}" rx="${rx + 8}" ry="${ry * .7}" fill="url(#ID-shadow)"/>
<path d="M${cx + rx - 4} ${cy + h * .6} q14 2 20 9" fill="none" stroke="#1a1d21" stroke-width="3.6" stroke-linecap="round"/>
<path d="M${cx + rx - 4} ${cy + h * .6} q14 2 20 9" fill="none" stroke="#e8eaed" stroke-width="2.4" stroke-linecap="round"/>
<path d="M${cx - rx} ${cy}a${rx} ${ry} 0 0 0 ${rx * 2} 0v${h}a${rx} ${ry} 0 0 1 ${-rx * 2} 0z" fill="url(#ID-phnpadside)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ID-phnpadtop)"/>
<ellipse cx="${cx}" cy="${cy - ry * .15}" rx="${rx * .86}" ry="${ry * .7}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>
<ellipse class="phn-ring" cx="${cx}" cy="${cy}" rx="${rx - 3.5}" ry="${ry - 1.6}" fill="none" stroke-width="1.8"/>
<circle class="phn-ring" cx="${cx}" cy="${cy + ry + h * .55}" r="1.1" fill="#38a8ff" stroke-width="0"/>`;
SVG.phone_charger = (c) => {
  const model = c && ["ipad", "apple_watch"].includes(c.model) ? c.model : "iphone";
  const defs = `<defs>${DEFS}${PHN_DEFS}</defs>`;
  if (model === "ipad") return `${defs}
${phnPad(60, 112, 32, 7.5, 5)}
<path d="M55 113 L59 66 L66 66 L65 113 Z" fill="url(#ID-phnstand)"/><path d="M59 66 L66 66 L65.5 72 L59.5 72 Z" fill="#4b525a"/>
<g>
  <rect x="25" y="14" width="70" height="90" rx="8.5" fill="url(#ID-phnalu)"/>
  <rect x="25.8" y="14.8" width="68.4" height="88.4" rx="7.8" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".5"/>
  <rect x="26.6" y="15.6" width="66.8" height="86.8" rx="7.2" fill="#08090b"/>
  <rect x="30" y="19" width="60" height="80" rx="4.5" fill="#0d1116"/>
  <rect class="phn-scr" x="30" y="19" width="60" height="80" rx="4.5" fill="url(#ID-phnwall)"/>
  <circle cx="60" cy="17.3" r="1" fill="#141b24"/><circle cx="60" cy="17.3" r=".4" fill="#2c4a66"/>
  <rect x="79" y="13.3" width="9" height="1.2" rx=".6" fill="#8c939a"/>
  <rect x="94.9" y="24" width="1.2" height="7" rx=".6" fill="#8c939a"/><rect x="94.9" y="33" width="1.2" height="7" rx=".6" fill="#8c939a"/>
  ${phnUi(PHN_LAYOUT.phone)}
  <rect x="30" y="19" width="60" height="80" rx="4.5" fill="url(#ID-phnglass)" pointer-events="none"/>
</g>`;
  if (model === "apple_watch") return `${defs}
${phnPad(60, 113, 28, 6.5, 5)}
<rect x="53" y="76" width="14" height="38" rx="4" fill="url(#ID-phnstand)"/>
<circle cx="60" cy="62" r="13" fill="#f1f2f4"/><circle cx="60" cy="62" r="11" fill="#e2e4e7"/>
<rect x="44" y="10" width="32" height="34" rx="10" fill="url(#ID-phnband)"/>
${[18, 25, 32].map((y) => `<circle cx="60" cy="${y}" r="1.3" fill="#15181b"/>`).join("")}
<rect x="44" y="80" width="32" height="34" rx="10" fill="url(#ID-phnband)"/>
<rect x="44" y="96" width="32" height="5" rx="2" fill="#2a2f35" stroke="#3d444b" stroke-width=".6"/>
<rect x="46" y="38" width="28" height="6" fill="#1c2024"/><rect x="46" y="80" width="28" height="6" fill="#1c2024"/>
<rect x="36.5" y="37.5" width="47" height="49" rx="13.5" fill="url(#ID-phnalu)"/>
<rect x="37.3" y="38.3" width="45.4" height="47.4" rx="12.8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>
<rect x="38.8" y="39.8" width="42.4" height="44.4" rx="11.6" fill="#050607"/>
<rect x="42" y="44" width="36" height="36" rx="9" fill="#0d1116"/>
<rect class="phn-scr" x="42" y="44" width="36" height="36" rx="9" fill="url(#ID-phnwall)"/>
<rect x="83" y="49" width="5" height="10" rx="2" fill="url(#ID-phnalu)" stroke="#7b828a" stroke-width=".4"/>
${[50.8, 52.6, 54.4, 56.2, 58].map((y) => `<line x1="83.6" y1="${y}" x2="87.4" y2="${y}" stroke="#7d848b" stroke-width=".35"/>`).join("")}
<circle cx="87.2" cy="54" r=".7" fill="#e5484d"/>
<rect x="83" y="64" width="2.6" height="11" rx="1.2" fill="#a7adb4"/>
${phnUi(PHN_LAYOUT.watch)}
<rect x="38.8" y="39.8" width="42.4" height="44.4" rx="11.6" fill="url(#ID-phnglass)" pointer-events="none"/>`;
  return `${defs}
${phnPad(60, 114, 34, 7.5, 5)}
<g>
  <path d="M42 30 Q42 26 46 26 L80 26 Q84 26 84 30 L86 112 L40 112 Z" fill="url(#ID-phnstand)"/>
  <circle cx="63" cy="64" r="11" fill="none" stroke="#4a5158" stroke-width="1"/>
</g>
<g>
  <rect x="32.4" y="38" width="1.8" height="7" rx=".9" fill="#a1a7ae"/><rect x="32.4" y="49" width="1.8" height="11" rx=".9" fill="#a1a7ae"/><rect x="32.4" y="62" width="1.8" height="11" rx=".9" fill="#a1a7ae"/>
  <rect x="85.8" y="46" width="1.8" height="16" rx=".9" fill="#a1a7ae"/>
  <rect x="34" y="18" width="52" height="92" rx="10" fill="url(#ID-phnti)"/>
  <rect x="34.8" y="18.8" width="50.4" height="90.4" rx="9.4" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".5"/>
  <rect x="35.4" y="19.4" width="49.2" height="89.2" rx="8.8" fill="#060708"/>
  <rect x="37" y="22" width="46" height="84" rx="7.5" fill="#0d1116"/>
  <rect class="phn-scr" x="37" y="22" width="46" height="84" rx="7.5" fill="url(#ID-phnwall)"/>
  <rect x="52" y="24.4" width="16" height="4.6" rx="2.3" fill="#000"/><circle cx="64.6" cy="26.7" r="1" fill="#14202c"/><circle cx="64.6" cy="26.7" r=".4" fill="#2f5577"/>
  ${phnUi(PHN_LAYOUT.phone)}
  <rect x="37" y="22" width="46" height="84" rx="7.5" fill="url(#ID-phnglass)" pointer-events="none"/>
</g>
<path d="M36 108 Q36 104 40 104 L82 104 Q86 104 86 108 L86 112 L36 112 Z" fill="url(#ID-phnstand)"/>
<rect x="38" y="104.6" width="46" height="1" rx=".5" fill="#fff" opacity=".12"/>`;
};
