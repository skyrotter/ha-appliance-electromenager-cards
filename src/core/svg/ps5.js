/* PlayStation 5 : console debout sur son socle, vue de trois quarts (grande face blanche galbée, cœur noir,
   bandeaux lumineux le long du cœur, ouïes en haut) et manette posée au pied, reliée par un câble en mode repos.
   Silhouette seulement : aucun logo ni symbole de boutons. */
SVG.ps5 = () => `
<defs>${DEFS}
<linearGradient id="ID-psw" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd5db"/></linearGradient>
<linearGradient id="ID-psfar" x1="0" x2="1"><stop offset="0" stop-color="#aab2ba"/><stop offset="1" stop-color="#dde2e7"/></linearGradient>
<linearGradient id="ID-pscore" x1="0" x2="1"><stop offset="0" stop-color="#0b0d10"/><stop offset=".6" stop-color="#262b31"/><stop offset="1" stop-color="#121519"/></linearGradient>
<linearGradient id="ID-pspad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d9df"/></linearGradient>
<radialGradient id="ID-psamb"><stop offset="0" stop-color="#3b8cff" stop-opacity=".55"/><stop offset="1" stop-color="#3b8cff" stop-opacity="0"/></radialGradient></defs>
<ellipse class="ps-amb" cx="46" cy="70" rx="46" ry="58" fill="url(#ID-psamb)"/>
<ellipse cx="60" cy="134" rx="54" ry="3.6" fill="url(#ID-shadow)"/>
<g class="ps-air" fill="none" stroke-width="1.3" stroke-linecap="round">
  <path d="M42 14q-2.5-3 0-6t0-6"/><path d="M54 11q-2.5-3 0-6t0-6"/><path d="M66 9q-2.5-3 0-6t0-6"/>
</g>
<g class="ps-body">
  <ellipse cx="34" cy="128" rx="17" ry="3.4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".5"/>
  <path d="M17 19C20 23 23 26 26 27C27 60 28 94 29 125L24 124C23 96 22 62 21 30C20 26 18.5 22 17 19Z" fill="url(#ID-psfar)" stroke="#8d969f" stroke-width=".4"/>
  <path d="M26 27C27 60 28 94 29 125L36 126C35 94 34 58 33 24Z" fill="url(#ID-pscore)"/>
  <path d="M33 24C44 19 58 15 70 13C66 34 63 60 64 86C65 104 67 116 70 126L36 126C35 94 34 58 33 24Z" fill="url(#ID-psw)" stroke="#9aa3ac" stroke-width=".5"/>
  <path d="M33 24C44 19 58 15 70 13L69.3 16.4C58 18.2 44.6 22 33.7 27Z" fill="#1b2026"/>
  <path d="M38 23.4l.6 1.8M44 21.2l.6 1.8M50 19.4l.6 1.8M56 17.8l.6 1.8M62 16.4l.6 1.8" stroke="#4a525b" stroke-width=".6"/>
  <path d="M37 30C39 60 40 92 41 120" stroke="#fff" stroke-opacity=".9" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M60 22C58 50 57 80 59 110" stroke="#000" stroke-opacity=".05" stroke-width="5" fill="none"/>
  <path class="ps-led" pathLength="100" d="M36 126C35 94 34 58 33 24" fill="none" stroke-width="1.2" stroke-linecap="round"/>
  <path class="ps-led" pathLength="100" d="M29 125C28 94 27 60 26 27" fill="none" stroke-width="1.2" stroke-linecap="round"/>
  <rect x="29.6" y="108" width="3.2" height="1.4" rx=".5" fill="#4a525b"/>
  <rect x="29.9" y="112" width="2.6" height="1.6" rx=".6" fill="#05070a" stroke="#3a424b" stroke-width=".3"/>
  <circle class="ps-pwr" cx="31.2" cy="104" r=".8"/>
</g>
<path class="ps-cable" d="M31.2 113.6C34 124 50 131 66 129C74 128 78 124 82 117" fill="none" stroke="#1d2228" stroke-width="1.1" stroke-linecap="round"/>
<g transform="translate(-4 0)"><g class="ps-pad">
  <path d="M70 116C76 112 100 112 106 116C110 120 113 129 110 134.5C108 137.5 104 137 102 134L98 129H78L74 134C72 137 68 137.5 66 134.5C63 129 66 120 70 116Z" fill="url(#ID-pspad)" stroke="#8d969f" stroke-width=".5"/>
  <path d="M78 122.5H98L96.4 129H79.6Z" fill="#1d2228"/>
  <rect x="80.5" y="114" width="15" height="7" rx="1.6" fill="#eef1f4" stroke="#aab2ba" stroke-width=".4"/>
  <path class="ps-bar" d="M80 114.6V120.4M96 114.6V120.4" fill="none" stroke-width="1.1" stroke-linecap="round"/>
  <circle cx="83" cy="125.4" r="2.5" fill="#2a2f35"/><circle cx="83" cy="125.4" r="1.5" fill="#3d444c"/>
  <circle cx="93" cy="125.4" r="2.5" fill="#2a2f35"/><circle cx="93" cy="125.4" r="1.5" fill="#3d444c"/>
  <path d="M72 119.6h4M74 117.6v4" stroke="#6f7780" stroke-width="1.3" stroke-linecap="round"/>
  <g class="ps-btn"><circle cx="104" cy="117.6" r=".9"/><circle cx="106" cy="119.6" r=".9"/><circle cx="104" cy="121.6" r=".9"/><circle cx="102" cy="119.6" r=".9"/></g>
</g></g>`;
