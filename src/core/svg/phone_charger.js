SVG.phone_charger = () => `
<defs>${DEFS}<linearGradient id="ID-phnwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a63"/><stop offset=".5" stop-color="#6b3fc9"/><stop offset="1" stop-color="#ff8fab"/></linearGradient></defs>
<ellipse cx="60" cy="122" rx="46" ry="6" fill="url(#ID-shadow)"/>
<ellipse cx="60" cy="112" rx="40" ry="10" fill="url(#ID-dark)"/><ellipse cx="60" cy="110" rx="38" ry="9" fill="#2b3036"/>
<ellipse class="phn-ring" cx="60" cy="110" rx="34" ry="7.5" fill="none" stroke-width="1.6"/>
<g transform="rotate(-6 60 70)">
  <rect x="34" y="18" width="52" height="92" rx="9" fill="#1b1f24"/>
  <rect x="37" y="22" width="46" height="84" rx="6.5" fill="#0d1116"/>
  <rect class="phn-scr" x="37" y="22" width="46" height="84" rx="6.5" fill="url(#ID-phnwall)"/>
  <rect x="53" y="24" width="14" height="3.4" rx="1.7" fill="#0b0d10"/>
  <g class="phn-ui">
    <text class="phn-time" x="60" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="sans-serif">--:--</text>
    <rect x="45" y="66" width="30" height="12" rx="3" fill="none" stroke="#fff" stroke-width="1.4"/><rect x="75" y="70" width="2.4" height="4" rx="1" fill="#fff"/>
    <rect class="phn-fill" x="47" y="68" width="26" height="8" rx="1.6"/>
    <path class="phn-bolt" d="M61 63l-5 9h4l-2 7l6-10h-4z" fill="#fff" stroke="#1b1f24" stroke-width=".5"/>
    <text class="phn-pct" x="60" y="92" text-anchor="middle" font-size="7" fill="#fff" font-family="sans-serif"></text>
  </g>
</g>`;
