/* Écran de projection motorisé (idée du forum) : boîtier chromé avec voyant, toile qui se déroule avec une barre de lestage.
   --sp (posé par la carte) = part déroulée de la toile, 0 (enroulée) à 1 (déployée), animée en douceur ; le voyant est rouge fermé, vert ouvert,
   orange clignotant pendant le mouvement. */
SVG.projector_screen = () => `
<defs>${DEFS}
<linearGradient id="ID-fabric" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f3f6f9"/><stop offset="1" stop-color="#dce3ea"/></linearGradient>
<clipPath id="ID-screen-clip"><rect x="14" y="23" width="92" height="78"/></clipPath></defs>
<ellipse cx="60" cy="112" rx="46" ry="4" fill="url(#ID-shadow)"/>
<g clip-path="url(#ID-screen-clip)">
  <g class="sc-roll">
    <rect x="17" y="20" width="86" height="67" fill="#181b20"/>
    <rect x="20" y="20" width="80" height="64" fill="url(#ID-fabric)"/>
    <path d="M20 84 L75 20 L100 20 L100 84 Z" fill="#ffffff" opacity="0.35"/>
    <rect x="15" y="87" width="90" height="5" rx="2.5" fill="url(#ID-dark)" stroke="#59616b" stroke-width="0.5"/>
    <line x1="18" y1="88.5" x2="102" y2="88.5" stroke="#ffffff" stroke-opacity="0.2" stroke-width="0.8"/>
  </g>
</g>
<g class="sc-casing">
  <rect x="13" y="21" width="94" height="3" rx="1" fill="#14171a"/>
  <rect x="10" y="10" width="100" height="12" rx="3" fill="url(#ID-chrome)" stroke="#68707a" stroke-width="0.6"/>
  <line x1="14" y1="12.5" x2="106" y2="12.5" stroke="#ffffff" stroke-opacity="0.65" stroke-width="1.2" stroke-linecap="round"/>
  <rect x="8" y="9.5" width="5" height="13" rx="1.5" fill="url(#ID-dark)"/>
  <rect x="107" y="9.5" width="5" height="13" rx="1.5" fill="url(#ID-dark)"/>
  <circle class="sc-led" cx="109.5" cy="16" r="1.2"/>
</g>`;
