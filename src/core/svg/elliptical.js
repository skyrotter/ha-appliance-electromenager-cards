/* Vélo elliptique (vue de côté) : volant d'inertie à l'avant, deux pédales qui décrivent une ellipse, deux bras mobiles en opposition */
SVG.elliptical = () => `
<defs>${DEFS}
<linearGradient id="ID-fxbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1d2228"/></linearGradient></defs>
<ellipse cx="60" cy="130" rx="52" ry="4" fill="url(#ID-shadow)"/>
<rect x="8" y="123" width="30" height="5" rx="2.5" fill="#1d2228"/><rect x="74" y="123" width="38" height="5" rx="2.5" fill="#1d2228"/>
<rect x="14" y="116" width="86" height="8" rx="4" fill="url(#ID-fxbody)"/>
<g class="fx-b">
  <g class="fx-pa"><g class="fx-pb">
    <rect x="30" y="107" width="64" height="3.4" rx="1.7" fill="#9aa3ad"/>
    <rect x="22" y="101" width="24" height="6" rx="2.5" fill="#59616b"/>
  </g></g>
  <g class="fx-armb"><path d="M80 24L99 58L90 96" fill="none" stroke="#59616b" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="24" r="3.2" fill="#3a424b"/></g>
</g>
<circle cx="97" cy="108" r="17" fill="url(#ID-fxbody)" stroke="#12161a" stroke-width="1"/>
<g class="fx-fly">
  <circle cx="97" cy="108" r="12" fill="#2b3138" stroke="#7d858e" stroke-width=".8"/>
  <path d="M97 98v20M87 108h20M90 101l14 14M104 101l-14 14" stroke="#7d858e" stroke-width="1.1"/>
  <circle cx="97" cy="98.6" r="2.2" fill="#e5484d"/>
  <circle cx="97" cy="108" r="3" fill="url(#ID-chrome)"/>
</g>
<path d="M102 94L106 34" stroke="url(#ID-fxbody)" stroke-width="7" stroke-linecap="round"/>
<g class="fx-a">
  <g class="fx-pa"><g class="fx-pb">
    <rect x="30" y="107" width="64" height="3.4" rx="1.7" fill="#dfe4e9"/>
    <rect x="22" y="101" width="24" height="6" rx="2.5" fill="#2b3138"/><path d="M26 103h16" stroke="#7d858e" stroke-width=".8" stroke-dasharray="1.6 2"/>
  </g></g>
  <g class="fx-arma"><path d="M80 24L99 58L90 96" fill="none" stroke="#2b3138" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="24" r="3.4" fill="#e5484d"/></g>
</g>
<circle cx="99" cy="58" r="3.4" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/>
<rect x="84" y="8" width="36" height="22" rx="5" fill="url(#ID-fxbody)" stroke="#12161a" stroke-width=".8"/>
${lcd(88, 11, 28, 12)}
<circle class="fx-led" cx="92" cy="27" r="1.3"/><circle class="fx-led" cx="98" cy="27" r="1.3"/><circle class="fx-led" cx="104" cy="27" r="1.3"/>`;
