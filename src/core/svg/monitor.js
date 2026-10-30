/* nombre d'écrans dessinés : 1, 2 (défaut) ou 3 */
const mnCount = (c) => Math.max(1, Math.min(3, Math.round(Number(c?.screens) || 2)));

/* contenu d'un écran, dessiné dans un repère local 100 × 60 puis mis à l'échelle */
const MN_CONTENT = [
  // éditeur de code
  `<rect width="100" height="60" fill="url(#ID-mnwall)"/>
  <circle cx="84" cy="12" r="10" fill="#bfeaff" opacity=".3"/>
  <rect x="5" y="6" width="54" height="42" rx="2" fill="#0d1520" stroke="#2b4a73" stroke-width=".5"/>
  <rect x="5" y="6" width="54" height="5" rx="2" fill="#22344d"/>
  <circle cx="8.5" cy="8.5" r="1" fill="#ff5f56"/><circle cx="12" cy="8.5" r="1" fill="#ffbd2e"/><circle cx="15.5" cy="8.5" r="1" fill="#27c93f"/>
  <g class="mn-code"><rect x="10" y="15" width="28" height="2.4" rx="1.2" fill="#6fd8ff"/><rect x="15" y="20" width="34" height="2.4" rx="1.2" fill="#b894ff"/><rect x="15" y="25" width="20" height="2.4" rx="1.2" fill="#ffd76a"/><rect x="10" y="30" width="38" height="2.4" rx="1.2" fill="#6fe3a1"/><rect x="15" y="35" width="24" height="2.4" rx="1.2" fill="#6fd8ff"/><rect x="10" y="40" width="16" height="2.4" rx="1.2" fill="#ff8fab"/></g>
  <rect x="64" y="26" width="31" height="22" rx="2" fill="#f4f7fb" opacity=".9"/>
  <rect x="67" y="30" width="18" height="2" rx="1" fill="#8fa3bd"/><rect x="67" y="35" width="24" height="2" rx="1" fill="#c3cfdc"/><rect x="67" y="40" width="14" height="2" rx="1" fill="#c3cfdc"/>
  <rect y="53" width="100" height="7" fill="#0b1626" opacity=".85"/>
  <circle cx="5" cy="56.5" r="2" fill="#5ec8ff"/><rect x="11" y="55.3" width="5" height="2.4" rx=".6" fill="#8fa3bd"/><rect x="18" y="55.3" width="5" height="2.4" rx=".6" fill="#8fa3bd"/><rect x="25" y="55.3" width="5" height="2.4" rx=".6" fill="#8fa3bd"/>`,
  // tableau de bord
  `<rect width="100" height="60" fill="#eef2f7"/>
  <rect width="100" height="7" fill="#1f3b63"/><circle cx="5" cy="3.5" r="1.6" fill="#5ec8ff"/><rect x="10" y="2.5" width="22" height="2" rx="1" fill="#9fb4d1"/>
  <rect x="4" y="11" width="44" height="30" rx="2" fill="#fff"/>
  <g class="mn-bars"><rect x="9" y="25" width="6" height="12" fill="#3b82f6"/><rect x="18" y="18" width="6" height="19" fill="#22c55e"/><rect x="27" y="22" width="6" height="15" fill="#f59e0b"/><rect x="36" y="15" width="6" height="22" fill="#ef4444"/></g>
  <rect x="52" y="11" width="44" height="30" rx="2" fill="#fff"/>
  <path class="mn-line" d="M56 35l7-6l6 3l7-9l6 4l6-8l4 3" fill="none" stroke="#8b5cf6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="4" y="45" width="28" height="11" rx="2" fill="#fff"/><rect x="7" y="48" width="12" height="2" rx="1" fill="#8fa3bd"/><rect x="7" y="52" width="18" height="2" rx="1" fill="#22c55e"/>
  <rect x="36" y="45" width="28" height="11" rx="2" fill="#fff"/><rect x="39" y="48" width="12" height="2" rx="1" fill="#8fa3bd"/><rect x="39" y="52" width="16" height="2" rx="1" fill="#3b82f6"/>
  <rect x="68" y="45" width="28" height="11" rx="2" fill="#fff"/><rect x="71" y="48" width="12" height="2" rx="1" fill="#8fa3bd"/><rect x="71" y="52" width="20" height="2" rx="1" fill="#f59e0b"/>`,
  // visio / vidéo
  `<rect width="100" height="60" fill="url(#ID-mnsky)"/>
  <circle class="mn-sun" cx="74" cy="20" r="7" fill="#ffd27a"/>
  <path d="M0 46l18-16l12 9l18-20l22 22l12-8l18 13v14h-100z" fill="#2c4a6e"/>
  <path d="M0 52l24-12l20 10l22-9l34 13v6h-100z" fill="#17304d"/>
  <rect y="53" width="100" height="7" fill="#000" opacity=".55"/>
  <path d="M4 54.5v4l3.4-2z" fill="#fff"/>
  <rect x="11" y="56" width="80" height="1.2" rx=".6" fill="#fff" opacity=".35"/>
  <rect class="mn-prog" x="11" y="56" width="80" height="1.2" rx=".6" fill="#ff4d5e"/>`,
];

/* un écran : cadre, dalle, contenu, pied ; `skew` incline les écrans latéraux */
const mnScreen = (i, x, y, w, h, content, skew, cursor) => {
  const cx = x + w / 2, neckH = 110 - (y + h) - 3;
  return `
<g${skew ? ` transform="translate(${cx} ${y + h}) skewY(${skew}) translate(${-cx} ${-(y + h)})"` : ""}>
  <rect x="${cx - 3}" y="${y + h - 2}" width="6" height="${neckH + 2}" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
  <rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 5}" rx=".8" fill="#0a0d11"/>
  <g class="mn-screen" clip-path="url(#ID-mnclip${i})">
    <g transform="translate(${x + 2} ${y + 2}) scale(${(w - 4) / 100} ${(h - 5) / 60})">${MN_CONTENT[content]}${cursor ? `
      <path class="mn-cursor" d="M0 0v8l2.3-2.1l1.6 3.6l1.5-.7l-1.6-3.5l3.1 0z" fill="#fff" stroke="#000" stroke-width=".5"/>` : ""}</g>
  </g>
  <rect class="mn-sleep" x="${cx - 6}" y="${y + h / 2 - 3}" width="12" height="4" rx="1" fill="#1d2630" stroke="#3a4552" stroke-width=".3"/>
  <path d="M${x + 2} ${y + 2}h${w - 4}l${-(w - 4) * 0.42} ${h - 5}h${-(w - 4) * 0.58}z" fill="url(#ID-gloss)" opacity=".28"/>
  <circle class="mn-led" cx="${x + w - 4}" cy="${y + h - 1.5}" r=".75"/>
</g>
<ellipse cx="${cx}" cy="109.4" rx="${Math.min(14, w * 0.28)}" ry="2.4" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>`;
};

SVG.monitor = (c) => {
  const n = mnCount(c);
  // [x, y, largeur, hauteur, contenu, inclinaison, curseur]
  const L = {
    1: [[16, 30, 88, 56, 0, 0, true]],
    2: [[2, 44, 57, 40, 0, 0, true], [61, 44, 57, 40, 1, 0, false]],
    3: [[1, 50, 38, 28, 1, 8, false], [40, 44, 40, 34, 0, 0, true], [81, 50, 38, 28, 2, -8, false]],
  }[n];
  const clips = L.map(([x, y, w, h], i) => `<clipPath id="ID-mnclip${i}"><rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 5}" rx=".8"/></clipPath>`).join("");
  // écran central dessiné en dernier (au premier plan)
  const order = n === 3 ? [0, 2, 1] : L.map((_, i) => i);
  return `
<defs>${DEFS}
<linearGradient id="ID-mnwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f2a5c"/><stop offset=".55" stop-color="#1c5fc4"/><stop offset="1" stop-color="#5ec8ff"/></linearGradient>
<linearGradient id="ID-mnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a6b"/><stop offset=".6" stop-color="#c8577f"/><stop offset="1" stop-color="#4b2c6e"/></linearGradient>
<linearGradient id="ID-mndesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c3a5"/><stop offset="1" stop-color="#b79a74"/></linearGradient>
<radialGradient id="ID-mnglow" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#7fd0ff" stop-opacity=".6"/><stop offset="1" stop-color="#7fd0ff" stop-opacity="0"/></radialGradient>
${clips}</defs>
<ellipse cx="60" cy="126" rx="56" ry="3.5" fill="url(#ID-shadow)"/>
<path d="M2 110h116l-5 12h-106z" fill="url(#ID-mndesk)"/>
<path d="M2 110h116" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
<ellipse class="mn-glow" cx="60" cy="111" rx="54" ry="7" fill="url(#ID-mnglow)"/>
${order.map((i) => mnScreen(i, ...L[i])).join("")}
<rect x="24" y="114" width="58" height="7" rx="1.4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/>
<g fill="#4b535c"><rect x="26" y="115.2" width="54" height="1.2" opacity=".9"/><rect x="26" y="117.2" width="54" height="1.2" opacity=".9"/><rect x="26" y="119.2" width="54" height="1.2" opacity=".9"/></g>
<path d="M26 116.4h54M26 118.4h54" stroke="#05070a" stroke-width=".4" stroke-dasharray="2.2 .8"/>
<ellipse cx="90" cy="117" rx="3.6" ry="3" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/><path d="M90 114.2v2" stroke="#6f7780" stroke-width=".6"/>`;
};
