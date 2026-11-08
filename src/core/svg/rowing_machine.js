/* Rameur à air (vue de côté) : volant à ailettes à l'avant, rail incliné, siège qui coulisse, poignée tirée par la sangle */
SVG.rowing_machine = () => `
<defs>${DEFS}
<linearGradient id="ID-rwbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1d2228"/></linearGradient>
<clipPath id="ID-rwclip"><circle cx="28" cy="88" r="22"/></clipPath></defs>
<ellipse cx="62" cy="130" rx="56" ry="4" fill="url(#ID-shadow)"/>
<rect x="4" y="122" width="40" height="5" rx="2.5" fill="#1d2228"/><rect x="92" y="122" width="26" height="5" rx="2.5" fill="#1d2228"/>
<path d="M106 112V122" stroke="#2b3138" stroke-width="6" stroke-linecap="round"/>
<path d="M34 112L112 112" stroke="#3a424b" stroke-width="2" opacity=".25"/>
<rect x="34" y="106" width="80" height="7" rx="3.5" fill="url(#ID-rwbody)" stroke="#12161a" stroke-width=".6"/>
<path d="M40 109.5H110" stroke="#9aa3ad" stroke-width="1.2" opacity=".55"/>
<rect class="rw-strap" x="30" y="86.4" width="60" height="1.6" fill="#e5484d" style="transform-origin:30px 87px"/>
<circle cx="28" cy="88" r="25" fill="url(#ID-rwbody)" stroke="#12161a" stroke-width="1"/>
<circle cx="28" cy="88" r="22" fill="#12161a"/>
<g clip-path="url(#ID-rwclip)"><g class="rw-fan">
  ${[0, 36, 72, 108, 144].map((a) => `<path d="M28 88V66" stroke="#59616b" stroke-width="4.2" stroke-linecap="round" transform="rotate(${a} 28 88)"/><path d="M28 88V66" stroke="#59616b" stroke-width="4.2" stroke-linecap="round" transform="rotate(${a + 180} 28 88)"/>`).join("")}
  <circle cx="28" cy="88" r="14" fill="none" stroke="#7d858e" stroke-width=".8" stroke-dasharray="3 3"/>
  <circle cx="28" cy="67.5" r="2.2" fill="#e5484d"/>
</g></g>
<circle cx="28" cy="88" r="5" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".6"/>
<path d="M28 62V40" stroke="#3a424b" stroke-width="4" stroke-linecap="round"/>
<rect x="8" y="18" width="40" height="23" rx="5" fill="url(#ID-rwbody)" stroke="#12161a" stroke-width=".8"/>
${lcd(12, 21, 32, 13)}
<circle class="rw-led" cx="18" cy="37.5" r="1.3"/><circle class="rw-led" cx="25" cy="37.5" r="1.3"/><circle class="rw-led" cx="32" cy="37.5" r="1.3"/>
<path d="M50 112L58 96" stroke="#2b3138" stroke-width="4" stroke-linecap="round"/>
<rect x="50" y="94" width="14" height="3.6" rx="1.8" fill="#59616b" transform="rotate(-62 57 96)"/>
<g class="rw-seat">
  <circle cx="60" cy="108.5" r="2.6" fill="#7d858e"/><circle cx="76" cy="108.5" r="2.6" fill="#7d858e"/>
  <rect x="55" y="100" width="26" height="6.4" rx="3.2" fill="#2b3138" stroke="#12161a" stroke-width=".6"/><path d="M60 102h16" stroke="#e5484d" stroke-width="1.2" stroke-linecap="round"/>
</g>
<g class="rw-handle"><g transform="translate(24 0)">
  <rect x="35" y="79" width="3" height="16" rx="1.5" fill="#9aa3ad"/>
  <rect x="31.5" y="82" width="10" height="9" rx="4.5" fill="#2b3138" stroke="#12161a" stroke-width=".6"/>
  <rect x="33.2" y="84" width="6.6" height="2.2" rx="1.1" fill="#e5484d"/>
</g></g>`;
