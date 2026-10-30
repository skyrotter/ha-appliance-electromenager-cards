SVG.kettle = () => `
<defs>${DEFS}
<linearGradient id="ID-ktglass" x1="0" x2="1"><stop offset="0" stop-color="#dfe9ef" stop-opacity=".55"/><stop offset=".25" stop-color="#fff" stop-opacity=".25"/><stop offset=".8" stop-color="#cfdbe3" stop-opacity=".3"/><stop offset="1" stop-color="#9fb3c0" stop-opacity=".55"/></linearGradient>
<linearGradient id="ID-ktwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6fb" stop-opacity=".85"/><stop offset="1" stop-color="#7cc6f0" stop-opacity=".9"/></linearGradient>
<radialGradient id="ID-ktglow" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="#38a8ff"/><stop offset="1" stop-color="#38a8ff" stop-opacity="0"/></radialGradient>
<clipPath id="ID-ktin"><path d="M36 50 Q33 80 34 112 Q34 116 40 116 H80 Q86 116 86 112 Q87 80 84 50 Z"/></clipPath></defs>
<ellipse cx="60" cy="131" rx="40" ry="4" fill="url(#ID-shadow)"/>
<g class="kt-steam"><path d="M30 36q-4-6 0-12t0-12"/><path d="M58 30q-4-6 0-12t0-12"/><path d="M24 40q-4-6 0-12t0-10"/></g>
<path d="M26 120h68l-3 8h-62z" fill="url(#ID-dark)"/><ellipse cx="60" cy="120" rx="34" ry="3" fill="#2a3037"/>
<circle class="kt-led" cx="60" cy="125" r="1.4"/>
<path d="M84 52 q22 2 20 30 q-2 26 -18 30" fill="none" stroke="url(#ID-dark)" stroke-width="9" stroke-linecap="round"/>
<path d="M98 66 v-6" stroke="#5a626b" stroke-width="3" stroke-linecap="round"/>
<path d="M36 50 Q33 80 34 112 Q34 116 40 116 H80 Q86 116 86 112 Q87 80 84 50 Z" fill="#eaf4f9" opacity=".5"/>
<g clip-path="url(#ID-ktin)">
  <rect x="30" y="70" width="60" height="50" fill="url(#ID-ktwater)"/>
  <ellipse class="kt-surf" cx="60" cy="70" rx="26" ry="1.6" fill="#e6f6ff"/>
  <ellipse class="kt-glow" cx="60" cy="116" rx="30" ry="20" fill="url(#ID-ktglow)"/>
  <g class="kt-bub" fill="#fff">${[...Array(16)].map((_, k) => `<circle cx="${40 + (k * 7.3) % 40}" cy="${110 - (k * 3) % 10}" r="${1 + (k % 3) * .6}"/>`).join("")}</g>
  <path d="M36 98h48M36 84h48" stroke="#9fb3c0" stroke-width=".5" opacity=".6"/>
</g>
<path d="M36 50 Q33 80 34 112 Q34 116 40 116 H80 Q86 116 86 112 Q87 80 84 50 Z" fill="url(#ID-ktglass)" stroke="#9fb3c0" stroke-width=".8"/>
<path d="M40 56 Q38 80 39 108" stroke="#fff" stroke-width="2.4" opacity=".7" fill="none" stroke-linecap="round"/>
<rect x="33" y="112" width="54" height="8" rx="2" fill="url(#ID-dark)"/>
<path d="M36 50 l-12 -8 h10 l6 6z" fill="url(#ID-dark)"/>
<path d="M34 44 Q60 36 86 44 L84 52 H36 Z" fill="url(#ID-dark)"/>
<rect x="54" y="35" width="12" height="5" rx="2.5" fill="#2a3037"/>`;
