/* Lave-vaisselle vu de côté (option view: side) : voir washer_side.js. La fenêtre sur la cuve et tous ses calques animés sont conservés. */
const DISHWASHER_FRONT = SVG.dishwasher;
const DISHWASHER_SIDE = () => {
  // fenêtre de la cuve : polygone en perspective ; chaque zone du contenu est posée avec sa propre perspective locale
  const win = sidePoly(22, 38, 98, 114, "");
  const pts = win.match(/points="([^"]+)"/)[1];
  return `
<defs>${DEFS}<clipPath id="ID-winp"><polygon points="${pts}"/></clipPath>
<linearGradient id="ID-tub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b646d"/><stop offset="1" stop-color="#2c3238"/></linearGradient>
<linearGradient id="ID-wside" x1="0" x2="1"><stop offset="0" stop-color="#a9b0b8"/><stop offset="1" stop-color="#cdd2d7"/></linearGradient></defs>
${sideBody(`
  ${sidePoly(14, 8, 106, 23, 'fill="url(#ID-dark)"')}
  ${sidePlace(60, 15.5, `
    ${lcd(45, 10, 30, 11)}
    <circle class="led l1" cx="22" cy="15.5" r="1.4"/><circle class="led l2" cx="28" cy="15.5" r="1.4"/>
    <circle class="led l4" cx="34" cy="15.5" r="1.4"/>
    <rect x="82" y="12.5" width="7" height="6" rx="1.5" fill="#3b424a" stroke="#58616b" stroke-width=".5"/>
    <rect x="92" y="12.5" width="7" height="6" rx="1.5" fill="#3b424a" stroke="#58616b" stroke-width=".5"/>`)}
  ${sidePlace(60, 28.5, `
    <rect x="40" y="26" width="40" height="5" rx="2.5" fill="#7c848d"/>
    <rect x="41" y="26" width="38" height="2.4" rx="1.2" fill="#2f353b" opacity=".6"/>`)}
  ${sidePoly(22, 38, 98, 114, 'fill="url(#ID-tub)" stroke-linejoin="round"')}
  <g clip-path="url(#ID-winp)">
    <g class="wash-light">${sidePoly(22, 38, 98, 114, 'fill="#8fd3ff" opacity=".18"')}</g>
    ${sidePlace(60, 52, `
      <path d="M26 62h68M26 66h68" stroke="#aab2ba" stroke-width="1.1"/>
      <path d="M30 62v-8M42 62v-8M54 62v-8M66 62v-8M78 62v-8M90 62v-8" stroke="#aab2ba" stroke-width=".7"/>
      <path d="M32 61l2-12h7l2 12z M47 61l2-12h7l2 12z M65 61l2-12h7l2 12z M80 61l2-12h7l2 12z" fill="#dff3ff" opacity=".7" stroke="#fff" stroke-width=".5"/>
      <g class="drops"><circle cx="35" cy="44" r="1"/><circle cx="52" cy="46" r="1.2"/><circle cx="68" cy="43" r="1"/><circle cx="86" cy="47" r="1.1"/></g>`)}
    ${sidePlace(60, 69, '<g class="arm arm-top"><rect x="36" y="68" width="48" height="2.6" rx="1.3" fill="#9aa3ad"/></g><circle cx="60" cy="69.3" r="2" fill="#7d868f"/>')}
    ${sidePlace(60, 90, `
      <ellipse cx="33" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
      <ellipse cx="43" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
      <ellipse cx="53" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
      <ellipse cx="63" cy="91" rx="2.6" ry="10" fill="#e7f1fb" stroke="#c8ced5" stroke-width=".6"/>
      <ellipse cx="72" cy="91" rx="2.6" ry="10" fill="#e7f1fb" stroke="#c8ced5" stroke-width=".6"/>
      <path d="M80 99l3-14h9l3 14z" fill="#c4473a"/>
      <g class="jets"><path d="M40 106l-6-38M50 106l-2-40M70 106l2-40M80 106l6-38M45 67l-4-22M75 67l4-22"/></g>
      <g class="steam-in"><path d="M40 112q-4-10 2-18t0-16M60 112q-4-10 2-18t0-16M80 112q-4-10 2-18t0-16"/></g>`)}
    ${sidePlace(60, 105, `
      <path d="M26 100h68M26 104h68" stroke="#aab2ba" stroke-width="1.1"/>
      <g class="arm arm-bot"><rect x="30" y="107" width="60" height="3" rx="1.5" fill="#9aa3ad"/></g><circle cx="60" cy="108.5" r="2.4" fill="#7d868f"/>`)}
  </g>
  ${sidePoly(22, 38, 98, 114, 'fill="url(#ID-gloss)"')}
  ${sidePoly(22, 38, 98, 114, 'fill="none" stroke="#7e8790" stroke-width="1.2" stroke-linejoin="round"')}`, { face: "#ID-inox", edge: "#9aa2ab", sideExtra: '<polygon points="6,114 36,121 36,128 6,121" fill="#2b3036"/>', faceExtra: '<polygon points="36,121 104,114 104,121 36,128" fill="#2b3036"/>' })}`;
};
SVG.dishwasher = (c) => (c && c.view === "side" ? DISHWASHER_SIDE() : DISHWASHER_FRONT(c));
