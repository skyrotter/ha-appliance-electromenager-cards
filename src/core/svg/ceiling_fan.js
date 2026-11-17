/* Ventilateur de plafond : pales vues en perspective (disque aplati), bloc moteur, lampe, chaînettes */
SVG.ceiling_fan = () => {
  // une pale vue de dessus, de l'axe (0,0) vers l'extérieur ; le groupe est ensuite aplati en Y
  const blade = (a) => `<g transform="rotate(${a})"><path d="M8 -4L50 -10Q57 0 50 10L8 4z" fill="url(#ID-cfwood)" stroke="#5a3b1e" stroke-width=".8"/><path d="M8 -4L50 -10" stroke="#e8c48f" stroke-width="1" opacity=".7"/><rect x="5" y="-2.4" width="12" height="4.8" rx="1.2" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/></g>`;
  return `
<defs>${DEFS}
<linearGradient id="ID-cfwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8743f"/><stop offset=".5" stop-color="#c9935a"/><stop offset="1" stop-color="#8a5a2b"/></linearGradient>
<linearGradient id="ID-cfbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d959f"/><stop offset=".35" stop-color="#eef1f4"/><stop offset=".7" stop-color="#b7bec6"/><stop offset="1" stop-color="#7d858e"/></linearGradient>
<radialGradient id="ID-cfglass" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dee3"/></radialGradient>
<linearGradient id="ID-cfbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></linearGradient></defs>
<ellipse cx="60" cy="132" rx="40" ry="3.5" fill="url(#ID-shadow)" opacity=".45"/>
<!-- plafond -->
<rect x="0" y="0" width="120" height="6" fill="#000" opacity=".06"/>
<path d="M0 6h120" stroke="#9aa2ab" stroke-opacity=".5" stroke-width=".8"/>
<!-- cône de lumière -->
<path class="cf-beam" d="M50 62L22 132H98L70 62z" fill="url(#ID-cfbeam)"/>
<!-- souffle d'air vers le bas -->
<g class="cf-air" fill="none" stroke-linecap="round"><path d="M24 62q-6 14 0 28t0 28"/><path d="M42 66q-6 14 0 28t0 26"/><path d="M78 66q6 14 0 28t0 26"/><path d="M96 62q6 14 0 28t0 28"/></g>
<!-- rosace et tige -->
<path d="M50 6h20l-3 5h-14z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".5"/>
<rect x="58" y="11" width="4" height="20" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
<!-- pales : disque vu de dessus, aplati pour la perspective -->
<g transform="translate(60 44) scale(1 .3)">
  <circle class="cf-blur" r="56" fill="#c9935a"/>
  <g class="cf-blades">${[0, 90, 180, 270].map(blade).join("")}</g>
</g>
<!-- bloc moteur -->
<path d="M44 34q0-5 16-5t16 5v6q0 6-16 6t-16-6z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".6"/>
<path d="M44 38q16 6 32 0" stroke="#6f7781" stroke-width=".6" fill="none"/>
<ellipse cx="60" cy="31" rx="15" ry="2.6" fill="#fff" opacity=".35"/>
<!-- lampe -->
<path class="cf-lamp" d="M52 46h16l-1 3h-14z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".4"/>
<path class="cf-glass" d="M51 49h18q0 12-9 12t-9-12z" fill="url(#ID-cfglass)" stroke="#aab2ba" stroke-width=".5"/>
<path class="cf-lamp" d="M54 51q1 6 4 8" stroke="#fff" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"/>
<!-- chaînettes de tirage -->
<g class="cf-chain c1"><path d="M47 44v14" stroke="#aab2ba" stroke-width=".7" stroke-dasharray="1 .6"/><circle cx="47" cy="59" r="1.3" fill="url(#ID-chrome)"/></g>
<g class="cf-chain c2"><path d="M73 44v10" stroke="#aab2ba" stroke-width=".7" stroke-dasharray="1 .6"/><circle cx="73" cy="55" r="1.3" fill="url(#ID-chrome)"/></g>`;
};
