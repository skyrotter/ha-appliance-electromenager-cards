/* Compresseur d'air à courroie (cuve horizontale, moteur, volant, tête de piston), sur prise connectée (Shelly…) :
   en marche, le moteur et le volant tournent, la courroie défile, le piston monte et descend et la cuve vibre. */
SVG.air_compressor = () => `
<defs>${DEFS}
<linearGradient id="ID-cptank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9bec4"/><stop offset=".45" stop-color="#8d939a"/><stop offset="1" stop-color="#5c6269"/></linearGradient>
<linearGradient id="ID-cpmot" x1="0" x2="1"><stop offset="0" stop-color="#6c727a"/><stop offset=".5" stop-color="#a9afb6"/><stop offset="1" stop-color="#6c727a"/></linearGradient></defs>
<ellipse cx="58" cy="133" rx="52" ry="4.5" fill="url(#ID-shadow)"/>
<g class="cp-body">
  <path d="M96 84L106 72V52q0-3 4-3h4" fill="none" stroke="#2a2f35" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M96 84L106 72V52q0-3 4-3h4" fill="none" stroke="#9aa1a8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="9" y="84" width="94" height="38" rx="19" fill="url(#ID-cptank)" stroke="#2a2f35" stroke-width="1.8"/>
  <path d="M20 90h72" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
  <circle class="cp-led" cx="90" cy="103" r="2.6"/>
  <rect x="94" y="116" width="8" height="14" rx="2" fill="#7a8088" stroke="#2a2f35" stroke-width="1.4"/><rect x="92" y="128" width="12" height="4" rx="1.5" fill="#2a2f35"/>
  <circle cx="26" cy="124" r="8.5" fill="#6f757c" stroke="#2a2f35" stroke-width="1.8"/><circle cx="26" cy="124" r="2.4" fill="#2a2f35"/>
  <rect x="18" y="62" width="26" height="24" rx="4" fill="url(#ID-cpmot)" stroke="#2a2f35" stroke-width="1.4"/>
  <path d="M20 68h22M20 73h22M20 78h22" stroke="#4c5259" stroke-width="1.1"/>
  <g class="cp-piston">
    <rect x="68" y="8" width="16" height="30" rx="2" fill="url(#ID-cpmot)" stroke="#2a2f35" stroke-width="1.2"/>
    <path d="M66 12h20M66 17h20M66 22h20M66 27h20" stroke="#4c5259" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="72" y="4" width="8" height="5" rx="1.5" fill="#5c6269" stroke="#2a2f35" stroke-width="1"/>
  </g>
  <path class="cp-belt" d="M31 64L72 38M31 74L80 70" fill="none" stroke="#14171a" stroke-width="2.4" stroke-linecap="round"/>
  <path class="cp-belt-run" d="M31 64L72 38M31 74L80 70" fill="none" stroke="#9aa1a8" stroke-width="1" stroke-linecap="round"/>
  <g class="cp-fly">
    <circle cx="76" cy="56" r="19" fill="#dfe3e7" fill-opacity=".55" stroke="#2a2f35" stroke-width="2.2"/>
    <circle cx="76" cy="56" r="3.6" fill="#4c5259"/>
    <path d="M76 38v36M58 56h36M63.3 43.3l25.4 25.4M63.3 68.7l25.4-25.4" stroke="#3a4047" stroke-width="1.3"/>
    <circle cx="76" cy="44" r="2" fill="#2a2f35"/>
  </g>
  <g class="cp-pul"><circle cx="31" cy="69" r="6.4" fill="#2a2f35"/><circle cx="31" cy="69" r="5" fill="#c9ced4"/><path d="M31 64v10M26 69h10" stroke="#2a2f35" stroke-width="1.1"/></g>
</g>
<g class="cp-air"><path d="M108 46q4-4 8-2"/><path d="M110 40q5-5 9-2"/></g>`;
