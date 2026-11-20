/* Four à deux cavités (option cavities: 2, ex. Samsung Dual Cook) : la porte est séparée en deux par une tablette, cavité du haut = cavité 1
   (celle du four principal), cavité du bas = cavité 2 (entités *_2). Chaque cavité a sa lumière, sa résistance et sa vapeur (.active / .active2). */
const OVEN_SINGLE = SVG.oven;
const OVEN_DUAL = () => `
<defs>${DEFS}<clipPath id="ID-win"><rect x="22" y="56" width="76" height="31" rx="3"/></clipPath><clipPath id="ID-win2"><rect x="22" y="91" width="76" height="21" rx="3"/></clipPath>
<linearGradient id="ID-cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3330"/><stop offset="1" stop-color="#181412"/></linearGradient></defs>
<ellipse cx="60" cy="133" rx="52" ry="5" fill="url(#ID-shadow)"/>
<rect x="10" y="10" width="100" height="120" rx="5" fill="url(#ID-inox)" stroke="#949ca5" stroke-width=".8"/>
<rect x="10" y="10" width="100" height="22" rx="5" fill="url(#ID-dark)"/>
<rect x="10" y="26" width="100" height="6" fill="url(#ID-dark)"/>
<circle cx="22" cy="21" r="6.5" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/>
<circle cx="22" cy="21" r="4.2" fill="#2a3036"/><g class="knob"><line x1="22" y1="21" x2="22" y2="17.6" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/></g>
<circle cx="98" cy="21" r="6.5" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/>
<circle cx="98" cy="21" r="4.2" fill="#2a3036"/><line x1="98" y1="21" x2="100.6" y2="18.8" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/>
<rect x="33" y="15" width="54" height="12" rx="1.5" fill="#0c1720" stroke="#8f98a2" stroke-width=".6"/>
<text class="lcd" x="47.5" y="21.3" text-anchor="middle" fill="#7ec8e3">OFF</text><path d="M60 17.5v7" stroke="#3a4a58" stroke-width=".6"/><text class="ovl2" x="73" y="21.3" text-anchor="middle">--</text>
<circle class="led l1" cx="30" cy="21" r="1.2"/>
<rect x="14" y="36" width="92" height="90" rx="3" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".6"/>
<rect x="20" y="40.5" width="80" height="4.5" rx="2.25" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/>
<rect x="24" y="44.5" width="3" height="4" fill="#8f979f"/><rect x="93" y="44.5" width="3" height="4" fill="#8f979f"/>
<rect x="22" y="56" width="76" height="56" rx="4" fill="#0f0d0c"/>
<rect x="22" y="56" width="76" height="31" rx="3" fill="url(#ID-cavity)"/>
<g clip-path="url(#ID-win)">
  <rect class="ilight" x="22" y="56" width="76" height="31" fill="url(#ID-warm)"/>
  <path class="element" d="M26 60h8l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3h8"/>
  <path d="M24 77h72" stroke="#8d8680" stroke-width=".9"/>
  <path d="M38 77l3-8h38l3 8z" fill="#b5442f"/><path d="M41 69q19-6 38 0z" fill="#d06a3c"/>
  <g class="haze"><path d="M46 66q-3-4 0-8t0-8M60 65q-3-4 0-8t0-8M74 66q-3-4 0-8t0-8"/></g>
</g>
<rect x="22" y="87" width="76" height="4" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".4"/>
<rect x="22" y="91" width="76" height="21" rx="3" fill="url(#ID-cavity)"/>
<g clip-path="url(#ID-win2)">
  <rect class="ilight ilight2" x="22" y="91" width="76" height="21" fill="url(#ID-warm)"/>
  <path class="element element2" d="M26 95h8l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5h8"/>
  <path d="M24 106h72" stroke="#8d8680" stroke-width=".8"/>
  <ellipse cx="60" cy="104.5" rx="11" ry="2.6" fill="#c9a064"/><ellipse cx="60" cy="103.8" rx="8" ry="1.6" fill="#dcbc82"/>
  <g class="haze haze2"><path d="M50 101q-2-3 0-6t0-6M60 101q-2-3 0-6t0-6M70 101q-2-3 0-6t0-6"/></g>
</g>
<path d="M22 70L44 56h16L22 82z" fill="#fff" opacity=".08"/>
<rect x="22" y="56" width="76" height="56" rx="4" fill="none" stroke="#5d656d" stroke-width="1.2"/>
<rect x="14" y="118" width="92" height="8" rx="1.5" fill="#000" opacity=".12"/>`;
SVG.oven = (c) => (c && Number(c.cavities) === 2 ? OVEN_DUAL() : OVEN_SINGLE(c));
