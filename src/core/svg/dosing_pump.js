/* Pompe doseuse péristaltique (pH+ / pH-) : boîtier bleu, tête transparente, rotor à galets qui tourne, tuyau beige, raccords noirs */
SVG.dosing_pump = () => `
<defs>${DEFS}
<linearGradient id="ID-dpblue" x1="0" x2="1" y1="0" y2="1"><stop offset="0" style="stop-color:var(--dp-color,#3b86e0)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--dp-color,#3b86e0) 62%,#000)"/></linearGradient>
<linearGradient id="ID-dpwin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset="1" stop-color="#cfd8e2"/></linearGradient>
<clipPath id="ID-dpclip"><rect x="26" y="40" width="68" height="58" rx="8"/></clipPath></defs>
<ellipse cx="60" cy="126" rx="44" ry="4" fill="url(#ID-shadow)"/>
<rect x="18" y="4" width="84" height="108" rx="10" fill="url(#ID-dpblue)" style="stroke:color-mix(in srgb,var(--dp-color,#3b86e0) 40%,#000)" stroke-width="1"/>
<rect x="26" y="10" width="68" height="26" rx="6" fill="#eef1f5" stroke="#c4ccd6" stroke-width=".8"/>
<circle cx="37" cy="23" r="6" fill="#fff" stroke="#c4ccd6" stroke-width=".8"/><circle cx="83" cy="23" r="6" fill="#fff" stroke="#c4ccd6" stroke-width=".8"/>
${[0, 1, 2, 3, 4].map((k) => `<circle class="dp-led${k === 2 ? " dp-on" : ""}" cx="${48 + k * 6}" cy="20" r="1.7"/>`).join("")}
<rect x="26" y="40" width="68" height="58" rx="8" fill="url(#ID-dpwin)" stroke="#aeb9c6" stroke-width=".8"/>
<g clip-path="url(#ID-dpclip)">
  <path d="M44 100V66a16 16 0 0 1 32 0V100" fill="none" stroke="#e6d6a1" stroke-width="5.4" stroke-linecap="round"/>
  <path class="dp-flow" d="M44 100V66a16 16 0 0 1 32 0V100" fill="none" stroke="#5db4ff" stroke-width="2.4" stroke-dasharray="3 5"/>
  <g class="dp-rotor">
    <path d="M60 66 L60 52 M60 66 L48 73 M60 66 L72 73" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <circle cx="60" cy="66" r="13" fill="#fff" stroke="#cdd5de" stroke-width="1"/>
    <circle cx="60" cy="52" r="3.3" fill="#9aa5b2"/><circle cx="48" cy="73" r="3.3" fill="#9aa5b2"/><circle cx="72" cy="73" r="3.3" fill="#9aa5b2"/>
    <circle cx="60" cy="66" r="4" fill="#c4ccd5" stroke="#aab3be" stroke-width=".8"/>
  </g>
  <path d="M38 88l-5 7h3v6h4v-6h3z" fill="#2b3036"/><path d="M82 101l-5-7h3v-6h4v6h3z" fill="#2b3036"/>
</g>
<path d="M30 46q0-4 6-4" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/>
<rect x="36" y="108" width="16" height="14" rx="3" fill="#1f2328"/><rect x="68" y="108" width="16" height="14" rx="3" fill="#1f2328"/>
<rect x="39" y="120" width="10" height="3" rx="1" fill="#14171a"/><rect x="71" y="120" width="10" height="3" rx="1" fill="#14171a"/>`;
