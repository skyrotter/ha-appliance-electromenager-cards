/* Tapis de course (vue de côté) : plateau à bande défilante (rayures qui avancent à la vitesse du capteur speed), console à l'avant,
   plateau qui se relève selon l'inclinaison (--inc, en degrés, posée par la carte) */
SVG.treadmill = () => `
<defs>${DEFS}
<linearGradient id="ID-tmbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1d2228"/></linearGradient>
<clipPath id="ID-tmtop"><rect x="16" y="98" width="76" height="5"/></clipPath>
<clipPath id="ID-tmbot"><rect x="16" y="111" width="76" height="4"/></clipPath></defs>
<ellipse cx="62" cy="128" rx="56" ry="4" fill="url(#ID-shadow)"/>
<g class="tm-deck">
  <rect x="8" y="97" width="92" height="19" rx="9.5" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8"/>
  <rect x="14" y="98.5" width="80" height="16" rx="8" fill="#171b20"/>
  <g clip-path="url(#ID-tmtop)"><g class="tm-belt tm-belt-a">${Array.from({ length: 12 }, (_, i) => `<rect x="${14 + i * 8}" y="98" width="2.4" height="5" fill="#59616b"/>`).join("")}</g></g>
  <g clip-path="url(#ID-tmbot)"><g class="tm-belt tm-belt-b">${Array.from({ length: 12 }, (_, i) => `<rect x="${14 + i * 8}" y="111" width="2.4" height="4" fill="#3a424b"/>`).join("")}</g></g>
  <path d="M16 103H92" stroke="#9aa3ad" stroke-width=".8" opacity=".5"/>
  <circle cx="17" cy="106.5" r="7" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".7"/><circle cx="17" cy="106.5" r="2.6" fill="url(#ID-chrome)"/>
  <circle cx="91" cy="106.5" r="7" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".7"/><circle cx="91" cy="106.5" r="2.6" fill="url(#ID-chrome)"/>
  <rect x="24" y="115" width="10" height="4" rx="1.5" fill="#12161a"/><rect x="76" y="115" width="10" height="4" rx="1.5" fill="#12161a"/>
</g>
<path d="M94 100L104 48" stroke="#2b3138" stroke-width="5" stroke-linecap="round"/>
<path d="M84 100L96 50" stroke="#3a424b" stroke-width="3" stroke-linecap="round" opacity=".7"/>
<path d="M98 66Q74 60 56 70" fill="none" stroke="#59616b" stroke-width="3.2" stroke-linecap="round"/><path d="M98 66Q74 60 56 70" fill="none" stroke="#e5484d" stroke-width="1" stroke-linecap="round" opacity=".8"/>
<rect x="82" y="20" width="36" height="28" rx="6" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8" transform="rotate(-10 100 34)"/>
<g transform="rotate(-10 100 34)">${lcd(86, 24, 28, 13)}
<circle class="tm-led" cx="91" cy="43" r="1.3"/><circle class="tm-led" cx="98" cy="43" r="1.3"/><circle class="tm-led" cx="105" cy="43" r="1.3"/></g>`;
