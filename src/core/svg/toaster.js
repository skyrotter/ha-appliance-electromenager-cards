SVG.toaster = () => `
<defs>${DEFS}
<linearGradient id="ID-tbinox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#b9c0c7"/></linearGradient></defs>
<ellipse cx="60" cy="126" rx="48" ry="4" fill="url(#ID-shadow)"/>
<g class="tb-heat"><path d="M44 40q-3-5 0-10t0-10"/><path d="M62 38q-3-5 0-10t0-10"/><path d="M76 40q-3-5 0-10t0-10"/></g>
<g class="tb-bread">
  <path class="tb-crust" d="M38 64 v-18 q0-8 10-8 q10 0 10 8 v18z" stroke="#a8692b" stroke-width="1"/><path d="M41 64v-16q0-6 7-6q7 0 7 6v16z" fill="#f4dcae" opacity=".55"/>
  <path class="tb-crust" d="M62 64 v-18 q0-8 10-8 q10 0 10 8 v18z" stroke="#a8692b" stroke-width="1"/><path d="M65 64v-16q0-6 7-6q7 0 7 6v16z" fill="#f4dcae" opacity=".55"/>
</g>
<path d="M16 72 q0-12 14-12 h60 q14 0 14 12 v40 q0 8-8 8 h-72 q-8 0-8-8z" fill="url(#ID-inox)" stroke="#8d969f" stroke-width=".8"/>
<rect class="tb-slot" x="34" y="61" width="26" height="4" rx="2"/><rect class="tb-slot" x="60" y="61" width="26" height="4" rx="2"/>
<path d="M22 74 q0-8 10-8" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
<circle cx="44" cy="98" r="7" fill="url(#ID-tbinox)" stroke="#8d969f" stroke-width=".8"/><path d="M44 98l3-5" stroke="#3a414b" stroke-width="1.4" stroke-linecap="round"/>
${[0, 1, 2, 3, 4, 5].map((k) => { const a = (-150 + k * 60) * Math.PI / 180; return `<circle cx="${(44 + 10 * Math.cos(a)).toFixed(1)}" cy="${(98 + 10 * Math.sin(a)).toFixed(1)}" r=".7" fill="#59616a"/>`; }).join("")}
<rect x="64" y="94" width="16" height="7" rx="3.5" fill="#2b3036"/><circle class="tb-led" cx="86" cy="97.5" r="1.6"/>
<rect x="102" y="76" width="4" height="34" rx="2" fill="#7f8891"/>
<rect class="tb-lever" x="100" y="74" width="10" height="6" rx="2" fill="#2b3036"/>
<rect x="20" y="120" width="10" height="3" rx="1" fill="#2b3036"/><rect x="90" y="120" width="10" height="3" rx="1" fill="#2b3036"/>`;
