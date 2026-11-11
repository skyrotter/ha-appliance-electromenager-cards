SVG.heat_pump = () => `
<defs>${DEFS}
<linearGradient id="ID-hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#cfd5db"/></linearGradient>
<radialGradient id="ID-grill" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3a4048"/><stop offset="1" stop-color="#1c2025"/></radialGradient></defs>
<ellipse cx="60" cy="126" rx="56" ry="4" fill="url(#ID-shadow)"/>
<g class="hp-steam"><path d="M30 30q-3-5 0-9t0-9"/><path d="M46 28q-3-5 0-9t0-9"/><path d="M62 30q-3-5 0-9t0-9"/></g>
<g class="hp-body">
<rect x="14" y="114" width="14" height="8" rx="1" fill="#59616b"/><rect x="92" y="114" width="14" height="8" rx="1" fill="#59616b"/>
<rect x="8" y="34" width="104" height="82" rx="4" fill="url(#ID-hp)" stroke="#9aa2ab" stroke-width=".7"/>
<path d="M10 37h100" stroke="#fff" stroke-width="1.2"/>
<path d="M84 40v72" stroke="#b9c0c7" stroke-width=".7"/>
<g stroke="#bfc6cd" stroke-width=".6"><path d="M88 46h20M88 50h20M88 54h20M88 58h20M88 62h20M88 66h20"/></g>
<rect x="86" y="84" width="24" height="22" rx="1.5" fill="#e3e7eb" stroke="#aab2ba" stroke-width=".5"/>
${lcd(87.5, 86, 21, 12)}
<circle cx="98" cy="102" r="1.3" fill="#9aa2ab"/>
<circle class="hp-led" cx="104" cy="75" r="1.2"/>
<circle cx="46" cy="75" r="31" fill="#d4d9de" stroke="#aab2ba" stroke-width=".6"/>
<circle cx="46" cy="75" r="28" fill="url(#ID-grill)"/>
<g class="hp-fan" fill="#8e979f"><path d="M46 75q-2-16 8-23q3 9-8 23z"/><path d="M46 75q15-6 23 3q-9 4-23-3z"/><path d="M46 75q-13 10-24 4q5-8 24-4z"/></g>
<circle cx="46" cy="75" r="4" fill="#59616b"/>
<g fill="none" stroke="#e6eaee" stroke-opacity=".8" stroke-width=".7"><circle cx="46" cy="75" r="9"/><circle cx="46" cy="75" r="15"/><circle cx="46" cy="75" r="21"/><circle cx="46" cy="75" r="27"/><path d="M46 47v56M18 75h56"/></g>
</g>
<g class="hp-out"><circle cx="46" cy="75" r="30"/><circle cx="46" cy="75" r="30"/><circle cx="46" cy="75" r="30"/></g>
<path d="M112 98h4q3 0 3 3v19" stroke="#c77b3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M112 104h2q2 0 2 2v14" stroke="#2a2f35" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
