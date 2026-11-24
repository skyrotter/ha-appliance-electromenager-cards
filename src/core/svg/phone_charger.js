/* Chargeur d'appareil Apple / Android : iPhone (défaut), iPad sur son support ou Apple Watch sur son chargeur magnétique (option model).
   Écran : heure, batterie et éclair en charge (.phn-ui) ; hors charge, écran « toujours allumé » à luminosité réduite (.phn-aod) avec le mode
   Concentration ou l'activité (icône + libellé), remplis par la carte. Les trois modèles partagent les mêmes classes (phn-*) et le même CSS. */
const PHN_BOLT = "M61 63l-5 9h4l-2 7l6-10h-4z"; // éclair, boîte 56-66 × 63-79, centre (61, 71)
const PHN_LAYOUT = {
  // iphone / ipad : écran vertical 46 × 84 centré en (60, 64)
  phone: { time: [60, 52, 12], batt: [45, 66, 30, 12], bolt: [61, 71, 1], pct: [60, 92, 7], aTime: [60, 40, 9], aIcon: [60, 66, 20], aLab: [60, 88, 6.4], aPct: [60, 99, 6] },
  // apple watch : cadran carré 34 × 34
  watch: { time: [60, 57, 9], batt: [50, 63, 20, 8], bolt: [60, 67, .78], pct: [60, 77, 5.5], aTime: [60, 54, 8.5], aIcon: [60, 63.5, 12], aLab: [60, 72.5, 4.8], aPct: [60, 77.5, 4.4] },
};
const phnUi = (L) => `
  <g class="phn-ui">
    <text class="phn-time" x="${L.time[0]}" y="${L.time[1]}" text-anchor="middle" font-size="${L.time[2]}" font-weight="700" fill="#fff" font-family="sans-serif">--:--</text>
    <rect x="${L.batt[0]}" y="${L.batt[1]}" width="${L.batt[2]}" height="${L.batt[3]}" rx="${L.batt[3] / 4}" fill="none" stroke="#fff" stroke-width="${L.batt[3] > 10 ? 1.4 : 1}"/><rect x="${L.batt[0] + L.batt[2]}" y="${L.batt[1] + L.batt[3] / 2 - 2}" width="2.4" height="4" rx="1" fill="#fff"/>
    <rect class="phn-fill" x="${L.batt[0] + 2}" y="${L.batt[1] + 2}" width="${L.batt[2] - 4}" height="${L.batt[3] - 4}" rx="1.4"/>
    <path class="phn-bolt" transform="translate(${(L.bolt[0] - 61 * L.bolt[2]).toFixed(2)} ${(L.bolt[1] - 71 * L.bolt[2] - (L.bolt[2] === 1 ? 0 : 0)).toFixed(2)}) scale(${L.bolt[2]})" d="${PHN_BOLT}" fill="#fff" stroke="#1b1f24" stroke-width=".5"/>
    <text class="phn-pct" x="${L.pct[0]}" y="${L.pct[1]}" text-anchor="middle" font-size="${L.pct[2]}" fill="#fff" font-family="sans-serif"></text>
  </g>
  <g class="phn-aod">
    <text class="phn-atime" x="${L.aTime[0]}" y="${L.aTime[1]}" text-anchor="middle" font-size="${L.aTime[2]}" font-weight="600" fill="#fff" font-family="sans-serif">--:--</text>
    <path class="phn-aico" fill="#fff" d="" transform="translate(${L.aIcon[0] - L.aIcon[2] / 2} ${L.aIcon[1] - L.aIcon[2] / 2}) scale(${(L.aIcon[2] / 24).toFixed(3)})"/>
    <text class="phn-alab" x="${L.aLab[0]}" y="${L.aLab[1]}" text-anchor="middle" font-size="${L.aLab[2]}" fill="#fff" font-family="sans-serif"></text>
    <text class="phn-apct" x="${L.aPct[0]}" y="${L.aPct[1]}" text-anchor="middle" font-size="${L.aPct[2]}" fill="#fff" opacity=".7" font-family="sans-serif"></text>
  </g>`;
SVG.phone_charger = (c) => {
  const model = c && ["ipad", "apple_watch"].includes(c.model) ? c.model : "iphone";
  const defs = `<defs>${DEFS}<linearGradient id="ID-phnwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a63"/><stop offset=".5" stop-color="#6b3fc9"/><stop offset="1" stop-color="#ff8fab"/></linearGradient></defs>`;
  const base = `<ellipse cx="60" cy="122" rx="46" ry="6" fill="url(#ID-shadow)"/>
<ellipse cx="60" cy="112" rx="40" ry="10" fill="url(#ID-dark)"/><ellipse cx="60" cy="110" rx="38" ry="9" fill="#2b3036"/>
<ellipse class="phn-ring" cx="60" cy="110" rx="34" ry="7.5" fill="none" stroke-width="1.6"/>`;
  if (model === "ipad") return `${defs}${base}
<path d="M44 102h32l5 8H39z" fill="#3a4047"/><rect x="40" y="104" width="40" height="3" rx="1.5" fill="#4b525a"/>
<g transform="rotate(-3 60 62)">
  <rect x="25" y="14" width="70" height="90" rx="8" fill="#9aa1a9"/><rect x="26.4" y="15.4" width="67.2" height="87.2" rx="7" fill="#1b1f24"/>
  <rect x="30" y="19" width="60" height="80" rx="4.5" fill="#0d1116"/>
  <rect class="phn-scr" x="30" y="19" width="60" height="80" rx="4.5" fill="url(#ID-phnwall)"/>
  <circle cx="60" cy="16.8" r="1" fill="#0b0d10"/>${phnUi(PHN_LAYOUT.phone)}
</g>`;
  if (model === "apple_watch") return `${defs}${base}
<rect x="45" y="12" width="30" height="34" rx="9" fill="#2d3238"/><rect x="45" y="76" width="30" height="34" rx="9" fill="#2d3238"/>
<path d="M50 24h20M50 32h20M50 88h20M50 96h20" stroke="#3b4148" stroke-width="1.2" stroke-linecap="round"/>
<rect x="38" y="40" width="44" height="44" rx="12" fill="#8e969e"/><rect x="39.4" y="41.4" width="41.2" height="41.2" rx="11" fill="#1b1f24"/>
<rect x="82" y="54" width="3.4" height="9" rx="1.7" fill="#7b838b"/><rect x="82" y="68" width="2" height="5" rx="1" fill="#4b525a"/>
<rect x="42" y="44" width="36" height="36" rx="9" fill="#0d1116"/>
<rect class="phn-scr" x="42" y="44" width="36" height="36" rx="9" fill="url(#ID-phnwall)"/>${phnUi(PHN_LAYOUT.watch)}`;
  return `${defs}${base}
<g transform="rotate(-6 60 70)">
  <rect x="34" y="18" width="52" height="92" rx="9" fill="#1b1f24"/>
  <rect x="37" y="22" width="46" height="84" rx="6.5" fill="#0d1116"/>
  <rect class="phn-scr" x="37" y="22" width="46" height="84" rx="6.5" fill="url(#ID-phnwall)"/>
  <rect x="53" y="24" width="14" height="3.4" rx="1.7" fill="#0b0d10"/>${phnUi(PHN_LAYOUT.phone)}
</g>`;
};
