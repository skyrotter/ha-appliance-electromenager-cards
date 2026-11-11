/* purificateur d'air colonne (type IKEA FÖRNUFTIG) : façade textile, grille de sortie en haut, bouton rotatif 0-1-2-3 */
SVG.air_purifier = () => `
<defs>${DEFS}
<linearGradient id="ID-apbody" x1="0" x2="1"><stop offset="0" stop-color="#d9dee3"/><stop offset=".45" stop-color="#f7f8f9"/><stop offset="1" stop-color="#c3cad1"/></linearGradient>
<linearGradient id="ID-apfab" x1="0" x2="1"><stop offset="0" stop-color="#4a5159"/><stop offset=".5" stop-color="#5d656e"/><stop offset="1" stop-color="#434a52"/></linearGradient>
<pattern id="ID-apweave" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 1.2h2.4M1.2 0v2.4" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/></pattern>
<radialGradient id="ID-apknob" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#d4d9de"/><stop offset="1" stop-color="#9aa3ac"/></radialGradient>
<clipPath id="ID-apfront"><rect x="37" y="34" width="46" height="86" rx="3"/></clipPath></defs>
<ellipse cx="60" cy="133" rx="34" ry="3.5" fill="url(#ID-shadow)"/>
<g class="ap-out" fill="none" stroke-linecap="round"><path d="M44 12q-3-5 0-10"/><path d="M53 12q3-5 0-10"/><path d="M67 12q-3-5 0-10"/><path d="M76 12q3-5 0-10"/></g>
<g class="ap-dust"><circle cx="10" cy="50" r="1.3"/><circle cx="16" cy="72" r="1.1"/><circle cx="8" cy="92" r="1.4"/><circle cx="18" cy="108" r="1"/><circle cx="12" cy="62" r=".9"/><circle cx="14" cy="84" r="1.2"/></g>
<rect x="32" y="14" width="56" height="114" rx="6" fill="url(#ID-apbody)" stroke="#9aa3ac" stroke-width=".6"/>
<rect x="35" y="16.5" width="50" height="9" rx="2" fill="#d1d7dc"/>
<g stroke="#69727c" stroke-width="1" stroke-linecap="round"><path d="M38 19h44M38 21h44M38 23h44"/></g>
<rect x="37" y="34" width="46" height="86" rx="3" fill="url(#ID-apfab)"/>
<rect x="37" y="34" width="46" height="86" rx="3" fill="url(#ID-apweave)"/>
<g clip-path="url(#ID-apfront)"><g class="ap-flow" fill="none" stroke-linecap="round">
  <path d="M42 112q6 -24 0 -48t0 -26"/><path d="M52 116q-6 -26 0 -52t0 -26"/><path d="M68 116q6 -26 0 -52t0 -26"/><path d="M78 112q-6 -24 0 -48t0 -26"/></g></g>
<path d="M39 37v80" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>
<circle cx="74" cy="30" r="5" fill="#b8c0c7"/>
<g class="ap-knob"><circle cx="74" cy="30" r="4.2" fill="url(#ID-apknob)" stroke="#8b949d" stroke-width=".4"/>
  <path d="M74 30v-3.4" stroke="#3a424b" stroke-width="1.1" stroke-linecap="round"/></g>
<g class="ap-ticks" fill="#6c757e"><circle cx="68.8" cy="32" r=".55"/><circle cx="69.6" cy="27" r=".55"/><circle cx="74" cy="24.4" r=".55"/><circle cx="78.4" cy="27" r=".55"/></g>
${lcd(45, 102, 30, 11)}
<rect x="34" y="124" width="52" height="5" rx="2" fill="#3a3f45"/>`;
