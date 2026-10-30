const PC_TOWER = `
<g class="pc-tower">
  <rect x="86" y="38" width="28" height="74" rx="3" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
  <rect x="90" y="43" width="20" height="62" rx="1.5" fill="url(#ID-pcglass)" stroke="#3b424a" stroke-width=".4"/>
  <g class="pc-rgb" fill="none" stroke-width="1.3">
    <circle cx="100" cy="53" r="7.6"/><circle cx="100" cy="72" r="7.6"/><circle cx="100" cy="91" r="7.6"/>
  </g>
  <g class="pc-fan"><circle cx="100" cy="53" r="6.5" fill="#12161a"/><path d="M100 53v-6M100 53l5.2 3M100 53l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="53" r="7.6" fill="none"/></g>
  <g class="pc-fan"><circle cx="100" cy="72" r="6.5" fill="#12161a"/><path d="M100 72v-6M100 72l5.2 3M100 72l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="72" r="7.6" fill="none"/></g>
  <g class="pc-fan"><circle cx="100" cy="91" r="6.5" fill="#12161a"/><path d="M100 91v-6M100 91l5.2 3M100 91l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="91" r="7.6" fill="none"/></g>
  <circle cx="100" cy="53" r="1.4" fill="#d7dce1"/><circle cx="100" cy="72" r="1.4" fill="#d7dce1"/><circle cx="100" cy="91" r="1.4" fill="#d7dce1"/>
  <path d="M91 44h8l-8 14z" fill="#fff" opacity=".07"/>
  <rect x="104" y="40.2" width="6" height="1.8" rx=".9" fill="#2a2f35"/>
  <circle class="pc-led" cx="94" cy="41" r="1.2"/>
  <rect x="90" y="106.6" width="20" height="3" rx="1" fill="#2a2f35"/>
</g>`;

/* style du PC fixe : complet (écran + tour + clavier, défaut) ou unité centrale seule */
const pcStyle = (c) => ({ tower: "tower", tour: "tower", unite_centrale: "tower", case: "tower" }[String(c?.style || "full").toLowerCase()] || "full");

SVG.desktop_pc = (c) => pcStyle(c) === "tower" ? pcTowerSvg() : `
<defs>${DEFS}
<linearGradient id="ID-pcwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f2a5c"/><stop offset=".55" stop-color="#1c5fc4"/><stop offset="1" stop-color="#5ec8ff"/></linearGradient>
<linearGradient id="ID-pcdesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c3a5"/><stop offset="1" stop-color="#b79a74"/></linearGradient>
<linearGradient id="ID-pcglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#090b0e"/></linearGradient>
<clipPath id="ID-pcclip"><rect x="10" y="22" width="68" height="44" rx="1"/></clipPath></defs>
<ellipse cx="60" cy="126" rx="56" ry="3.5" fill="url(#ID-shadow)"/>
<path d="M2 110h116l-5 12h-106z" fill="url(#ID-pcdesk)"/>
<path d="M2 110h116" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
<path d="M36 104h12l2 7h-16z" fill="url(#ID-dark)"/>
<rect x="38" y="70" width="8" height="36" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>
<ellipse cx="42" cy="108" rx="16" ry="3.2" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>
<rect x="6" y="18" width="76" height="52" rx="3.5" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<rect x="10" y="22" width="68" height="44" rx="1" fill="#0a0d11"/>
<g class="pc-screen" clip-path="url(#ID-pcclip)">
  <rect x="10" y="22" width="68" height="44" fill="url(#ID-pcwall)"/>
  <circle cx="64" cy="32" r="9" fill="#bfeaff" opacity=".35"/>
  <rect x="13" y="26" width="30" height="24" rx="1.5" fill="#0d1520" stroke="#2b4a73" stroke-width=".4"/>
  <rect x="13" y="26" width="30" height="3.4" rx="1.5" fill="#22344d"/>
  <circle cx="15.2" cy="27.7" r=".7" fill="#ff5f56"/><circle cx="17.6" cy="27.7" r=".7" fill="#ffbd2e"/><circle cx="20" cy="27.7" r=".7" fill="#27c93f"/>
  <g class="pc-code"><rect x="16" y="32" width="16" height="1.6" rx=".8" fill="#6fd8ff"/><rect x="19" y="35.4" width="20" height="1.6" rx=".8" fill="#b894ff"/><rect x="19" y="38.8" width="12" height="1.6" rx=".8" fill="#ffd76a"/><rect x="16" y="42.2" width="22" height="1.6" rx=".8" fill="#6fe3a1"/><rect x="19" y="45.6" width="14" height="1.6" rx=".8" fill="#6fd8ff"/></g>
  <rect x="46" y="38" width="28" height="19" rx="1.5" fill="#f4f7fb" opacity=".92"/>
  <g class="pc-bars"><rect x="50" y="48" width="4" height="7" fill="#3b82f6"/><rect x="56" y="43" width="4" height="12" fill="#22c55e"/><rect x="62" y="45.5" width="4" height="9.5" fill="#f59e0b"/><rect x="68" y="41" width="4" height="14" fill="#ef4444"/></g>
  <rect x="10" y="61" width="68" height="5" fill="#0b1626" opacity=".85"/>
  <circle cx="14" cy="63.5" r="1.4" fill="#5ec8ff"/><rect x="19" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/><rect x="24" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/><rect x="29" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/>
  <path class="pc-cursor" d="M0 0l0 6l1.7 -1.6l1.2 2.7l1.1 -.5l-1.2 -2.6l2.3 0z" fill="#fff" stroke="#000" stroke-width=".4"/>
</g>
<path d="M10 22h68l-28 44h-40z" fill="url(#ID-gloss)" opacity=".35"/>
<circle class="pc-mled" cx="44" cy="68" r=".9"/>
${PC_TOWER}
<rect x="10" y="114" width="62" height="7" rx="1.4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/>
<g class="pc-keys" fill="#4b535c"><rect x="12" y="115.2" width="58" height="1.2" opacity=".9"/><rect x="12" y="117.2" width="58" height="1.2" opacity=".9"/><rect x="12" y="119.2" width="58" height="1.2" opacity=".9"/></g>
<path d="M12 116.4h58M12 118.4h58" stroke="#05070a" stroke-width=".4" stroke-dasharray="2.2 .8"/>
<ellipse cx="78" cy="117" rx="3.6" ry="3" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/><path d="M78 114.2v2" stroke="#6f7780" stroke-width=".6"/>`;


const pcTowerSvg = () => `
<defs>${DEFS}
<linearGradient id="ID-pcdesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c3a5"/><stop offset="1" stop-color="#b79a74"/></linearGradient>
<linearGradient id="ID-pcglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#090b0e"/></linearGradient></defs>
<ellipse cx="60" cy="126" rx="56" ry="3.5" fill="url(#ID-shadow)"/>
<path d="M2 110h116l-5 12h-106z" fill="url(#ID-pcdesk)"/>
<path d="M2 110h116" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
<ellipse cx="60" cy="110.5" rx="24" ry="2.4" fill="url(#ID-shadow)"/>
<g transform="translate(60 110) scale(1.3) translate(-100 -110)">${PC_TOWER}</g>`;
