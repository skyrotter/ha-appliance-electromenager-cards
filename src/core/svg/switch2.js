/* Nintendo Switch 2 : console sur son dock, vue de face (dock noir mat, écran entrevu au-dessus, Joy-Con 2 sur les côtés avec leur anneau
   bleu à gauche et orange à droite autour du stick). Silhouette seulement : aucun logo. */
SVG.switch2 = () => `
<defs>${DEFS}
<linearGradient id="ID-swd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d42"/><stop offset=".5" stop-color="#2a2c30"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient>
<linearGradient id="ID-swj" x1="0" x2="1"><stop offset="0" stop-color="#4a4d53"/><stop offset=".5" stop-color="#2d2f33"/><stop offset="1" stop-color="#1c1d20"/></linearGradient>
<linearGradient id="ID-swscr" x1="0" x2="1"><stop offset="0" stop-color="#5fb4ff"/><stop offset=".5" stop-color="#b9e0ff"/><stop offset="1" stop-color="#ff9a6b"/></linearGradient>
<radialGradient id="ID-swamb"><stop offset="0" stop-color="#4aa8ff" stop-opacity=".55"/><stop offset="1" stop-color="#4aa8ff" stop-opacity="0"/></radialGradient></defs>
<ellipse class="sw-amb" cx="60" cy="68" rx="62" ry="40" fill="url(#ID-swamb)"/>
<ellipse cx="60" cy="101" rx="56" ry="3.4" fill="url(#ID-shadow)"/>
<g class="sw-air" fill="none" stroke-width="1.3" stroke-linecap="round">
  <path d="M42 40q-2.5-3 0-6t0-6"/><path d="M60 38q-2.5-3 0-6t0-6"/><path d="M78 40q-2.5-3 0-6t0-6"/>
</g>
<g class="sw-body">
  <rect x="19" y="44" width="82" height="48" rx="4" fill="#0b0c0e" stroke="#000" stroke-width=".5"/>
  <rect class="sw-scr" x="21" y="45.5" width="78" height="8" rx="1.5" fill="url(#ID-swscr)"/>
  <rect x="21" y="45.5" width="78" height="2" rx="1" fill="#fff" opacity=".08"/>
  <path d="M21 56Q21 53 24 53H96Q99 53 99 56V90H21Z" fill="url(#ID-swd)" stroke="#0b0c0e" stroke-width=".5"/>
  <path d="M23 54.2H97" stroke="#fff" stroke-opacity=".14" stroke-width=".7" stroke-linecap="round"/>
  <rect x="19" y="90" width="82" height="8" rx="2" fill="url(#ID-swd)" stroke="#0b0c0e" stroke-width=".5"/>
  <rect class="sw-led" x="21.4" y="93.6" width="3.2" height="1.3" rx=".5"/>
</g>
<g class="sw-jcl">
  <path d="M8 49Q8 42 15 42H19V92H15Q8 92 8 85Z" fill="url(#ID-swj)" stroke="#0b0c0e" stroke-width=".5"/>
  <circle cx="13.5" cy="53" r="4.6" fill="#17181a"/><circle class="sw-ring l" cx="13.5" cy="53" r="4.6" fill="none" stroke-width="1.1"/><circle cx="13.5" cy="53" r="2.6" fill="#2b2d31"/>
  <g class="sw-btn" fill="#23252a" stroke="#0b0c0e" stroke-width=".3"><circle cx="13.5" cy="65" r="1.5"/><circle cx="10.2" cy="68.3" r="1.5"/><circle cx="16.8" cy="68.3" r="1.5"/><circle cx="13.5" cy="71.6" r="1.5"/></g>
  <rect x="11.5" y="78" width="3.4" height="3.4" rx=".8" fill="#23252a" stroke="#0b0c0e" stroke-width=".3"/>
  <path d="M10 45.6h4" stroke="#6a6e75" stroke-width=".8" stroke-linecap="round"/>
</g>
<g class="sw-jcr">
  <path d="M112 49Q112 42 105 42H101V92H105Q112 92 112 85Z" fill="url(#ID-swj)" stroke="#0b0c0e" stroke-width=".5"/>
  <circle cx="106.5" cy="72" r="4.6" fill="#17181a"/><circle class="sw-ring r" cx="106.5" cy="72" r="4.6" fill="none" stroke-width="1.1"/><circle cx="106.5" cy="72" r="2.6" fill="#2b2d31"/>
  <g class="sw-btn" fill="#23252a" stroke="#0b0c0e" stroke-width=".3"><circle cx="106.5" cy="53" r="1.5"/><circle cx="103.2" cy="56.3" r="1.5"/><circle cx="109.8" cy="56.3" r="1.5"/><circle cx="106.5" cy="59.6" r="1.5"/></g>
  <rect x="105" y="83" width="3.4" height="3.4" rx=".8" fill="#23252a" stroke="#0b0c0e" stroke-width=".3"/>
  <path d="M104 45.6h4M106 43.8v3.6" stroke="#6a6e75" stroke-width=".8" stroke-linecap="round"/>
</g>`;
