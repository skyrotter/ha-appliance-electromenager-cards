/* Sèche-linge vu de côté (option style: side) : voir washer_side.js. */
const DRYER_FRONT = SVG.dryer;
const DRYER_SIDE = () => `
<defs>${DEFS}<clipPath id="ID-win"><circle cx="60" cy="80" r="29"/></clipPath>
<radialGradient id="ID-heat" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffb347" stop-opacity=".55"/><stop offset="1" stop-color="#ff7b2e" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-wside" x1="0" x2="1"><stop offset="0" stop-color="#c3cad1"/><stop offset="1" stop-color="#e3e7eb"/></linearGradient></defs>
${sideBody(`
    ${sidePoly(14, 8, 106, 33, 'fill="url(#ID-panel)"')}
    ${sideLine(33, 'stroke="#bfc6ce" stroke-width=".8"')}
    ${sidePlace(27, 21, `
      <g stroke="#8d96a0" stroke-width=".9" stroke-linecap="round">${knobTicks(27, 21)}</g>
      <circle cx="27" cy="21" r="8.2" fill="url(#ID-chrome)" stroke="#88919a" stroke-width=".6"/>
      <circle cx="27" cy="21" r="5.8" fill="#eff2f5" stroke="#b2b9c1" stroke-width=".6"/>
      <g class="knob"><line x1="27" y1="21" x2="27" y2="16.2" stroke="#4f5964" stroke-width="1.5" stroke-linecap="round"/></g>`)}
    ${sidePlace(58, 21, `
      ${lcd(43, 13, 30, 11)}
      <circle class="led l1" cx="49" cy="29" r="1.4"/><circle class="led l2" cx="55" cy="29" r="1.4"/>
      <circle class="led l3" cx="61" cy="29" r="1.4"/><circle class="led l4" cx="67" cy="29" r="1.4"/>`)}
    ${sidePlace(89.5, 21.5, `
      <rect x="80" y="15" width="8" height="5" rx="1.5" fill="#e7eaee" stroke="#aeb5bd" stroke-width=".6"/>
      <rect x="91" y="15" width="8" height="5" rx="1.5" fill="#e7eaee" stroke="#aeb5bd" stroke-width=".6"/>
      <rect x="80" y="23" width="19" height="5" rx="1.5" fill="#dfe3e8" stroke="#aeb5bd" stroke-width=".6"/>`)}
    ${sidePlace(60, 80, sidePorthole(60, 80, 29, `
      <rect x="20" y="40" width="80" height="80" fill="#3a4148" opacity=".25"/>
      ${drumInside(60, 80, 29)}
      <circle class="heat" cx="60" cy="80" r="29" fill="url(#ID-heat)"/>`))}
    ${sidePlace(60, 118.5, `
      <rect x="22" y="114" width="76" height="9" rx="2" fill="#e3e7eb" stroke="#c3c9d0" stroke-width=".6"/>
      <path d="M28 116.5h64M28 118.5h64M28 120.5h64" stroke="#b7bec6" stroke-width=".6"/>`)}`, { shake: "shake-soft" })}`;
SVG.dryer = (c) => (c && c.style === "side" ? DRYER_SIDE() : DRYER_FRONT(c));
