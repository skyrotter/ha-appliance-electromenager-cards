SVG.water_heater = (c = {}) => `
<defs>${DEFS}
<linearGradient id="ID-cyl" x1="0" x2="1"><stop offset="0" stop-color="#c3c9cf"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef0f2"/><stop offset="1" stop-color="#aeb5bc"/></linearGradient>
<linearGradient id="ID-copper" x1="0" x2="1"><stop offset="0" stop-color="#a0603a"/><stop offset=".45" stop-color="#e2a477"/><stop offset="1" stop-color="#8a4f2e"/></linearGradient>
<linearGradient id="ID-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5484d"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient>
<clipPath id="ID-tank"><path d="M30 26q0-14 30-14t30 14v80q0 12-30 12t-30-12z"/></clipPath>
<linearGradient id="ID-arc" x1="0" x2="1"><stop offset="0" stop-color="#3e8ed0"/><stop offset=".5" stop-color="#f2c94c"/><stop offset="1" stop-color="#e5484d"/></linearGradient></defs>
<g class="hw-waves">
  <path d="M46 12q-3-4 0-8t0-8"/><path d="M60 10q-3-4 0-8t0-8"/><path d="M74 12q-3-4 0-8t0-8"/>
</g>
<ellipse cx="60" cy="133" rx="34" ry="4" fill="url(#ID-shadow)"/>
<rect x="49" y="114" width="6" height="18" fill="url(#ID-copper)"/>
<rect x="65" y="114" width="6" height="18" fill="url(#ID-copper)"/>
<rect x="48" y="122" width="8" height="3" rx="1" fill="#3e8ed0"/>
<rect x="64" y="122" width="8" height="3" rx="1" fill="#e5484d"/>
<rect x="40" y="117" width="9" height="5" rx="1.2" fill="#c9a43a" stroke="#8a6d1f" stroke-width=".4"/>
<path d="M30 26q0-14 30-14t30 14v80q0 12-30 12t-30-12z" fill="url(#ID-cyl)" stroke="#a7aeb5" stroke-width=".8"/>
<path d="M30 26q0 9 30 9t30-9" fill="none" stroke="#b7bec5" stroke-width=".8"/>
<path d="M30 104q0 9 30 9t30-9" fill="none" stroke="#b7bec5" stroke-width=".8"/>
${c.hot_water_level || c.hot_water_volume ? `<g class="hw-level" clip-path="url(#ID-tank)"><rect x="30" y="12" width="60" height="106" fill="#3e8ed0" opacity=".22"/><rect class="hw-hot" x="30" y="12" width="60" height="106" fill="url(#ID-hot)" opacity=".5"/></g>` : ""}
<rect x="38" y="58" width="44" height="40" rx="5" fill="#f4f6f8" stroke="#b5bcc3" stroke-width=".7"/>
<circle cx="60" cy="76" r="13" fill="url(#ID-chrome)"/>
<circle cx="60" cy="76" r="11" fill="#fcfcfd"/>
<path d="M51.5 84.5a12 12 0 1 1 17 0" fill="none" stroke="url(#ID-arc)" stroke-width="2.2" stroke-linecap="round" transform="rotate(0 60 76)"/>
<path d="M60 67.4v2M52.6 70.6l1.4 1.4M67.4 70.6l-1.4 1.4M50 76h2M68 76h2" stroke="#7d868f" stroke-width=".7"/>
<g class="needle"><path d="M60 76l-1.1 0l1.1-8.5l1.1 8.5z" fill="#c62828"/></g>
<circle cx="60" cy="76" r="1.6" fill="#3a4148"/>
<text class="gauge-txt" x="60" y="85" text-anchor="middle">--°</text>
<circle class="hw-led" cx="76" cy="92" r="1.8"/>
<rect x="43" y="90.5" width="16" height="3" rx="1.2" fill="#d5dade"/>
<path d="M36 40q4-6 6-1" stroke="#fff" stroke-opacity=".9" stroke-width="2" fill="none" stroke-linecap="round"/>
<rect x="34" y="34" width="5" height="70" rx="2.5" fill="#fff" opacity=".35"/>`;
