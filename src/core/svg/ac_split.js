SVG.ac_split = () => `
<defs>${DEFS}
<radialGradient id="ID-acheat" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".45"/><stop offset=".6" stop-color="#ff7a2e" stop-opacity=".15"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-split" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef1f4"/><stop offset="1" stop-color="#cfd5db"/></linearGradient></defs>
<ellipse class="ac-warm" cx="60" cy="98" rx="54" ry="30" fill="url(#ID-acheat)"/>
<g class="ac-waves"><path d="M30 122q4-4 0-8t0-8"/><path d="M60 126q4-4 0-8t0-8"/><path d="M90 122q4-4 0-8t0-8"/></g>
<g class="ac-air">
  <path d="M22 84q-6 14 0 26t-2 22"/><path d="M40 84q-4 14 2 26t0 22"/><path d="M60 84q-3 14 3 26t-1 22"/>
  <path d="M80 84q-2 14 4 26t0 22"/><path d="M98 84q0 14 6 26t2 22"/>
</g>
<g class="ac-drops"><circle cx="34" cy="90" r="1.3"/><circle cx="56" cy="92" r="1.3"/><circle cx="76" cy="90" r="1.3"/><circle cx="92" cy="93" r="1.3"/></g>
<path d="M6 54q0-10 10-10h88q10 0 10 10v18q0 6-6 8h-96q-6-2-6-8z" fill="url(#ID-split)" stroke="#aab2ba" stroke-width=".7"/>
<path d="M14 48h92" stroke="#c4cbd2" stroke-width=".6"/>
<path d="M16 51h88M16 53.5h88" stroke="#d7dce1" stroke-width=".5"/>
<path d="M10 70h100" stroke="#fff" stroke-opacity=".9" stroke-width="1"/>
<rect class="ac-slot" x="12" y="73.5" width="96" height="5" rx="2.5" fill="#2a2f35"/>
<g class="ac-flap"><path d="M12 74.5h96q0 4.5-4 5h-88q-4-.5-4-5z" fill="#f2f4f6" stroke="#aab2ba" stroke-width=".5"/></g>
<rect x="80" y="56" width="30" height="14" rx="2.5" fill="#0c1720" opacity=".9"/>
<text class="lcd" x="95" y="63.4" text-anchor="middle">OFF</text>
<g class="ac-ico ico-cool" transform="translate(-9 3)" stroke="#4fc3f7" stroke-width=".9" stroke-linecap="round"><path d="M78 59v8M74.5 61l7 4M74.5 65l7-4"/></g>
<g class="ac-ico ico-heat" transform="translate(-9 3)"><circle cx="78" cy="63" r="2" fill="#ff8a3d"/><path d="M78 58.6v1.2M78 66.2v1.2M73.6 63h1.2M81.2 63h1.2M74.9 59.9l.8.8M80.3 65.3l.8.8M74.9 66.1l.8-.8M80.3 60.7l.8-.8" stroke="#ff8a3d" stroke-width=".8" stroke-linecap="round"/></g>
<g class="ac-ico ico-dry" transform="translate(-9 3)"><path d="M78 59q-3 4-3 5.6a3 3 0 0 0 6 0q0-1.6-3-5.6z" fill="#7fd6c0"/></g>
<g class="ac-ico ico-fan" transform="translate(-9 3)" stroke="#cfd6dd" stroke-width="1" stroke-linecap="round" fill="none"><path d="M78 63q-3-4 0-4.5M78 63q4-1 3.5 2.4M78 63q-1 4-4 2"/></g>
<circle class="led l1" cx="18" cy="64" r="1.1"/>`;
