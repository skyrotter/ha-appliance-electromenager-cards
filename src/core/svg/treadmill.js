/* Tapis de course vu de l'arrière, en perspective : la bande vient vers nous, la console est au bout entre ses deux montants.
   Les rayures de la bande avancent vers l'avant à la vitesse du capteur speed (--fp = durée d'un pas de rayure, posée par la carte) :
   chaque rayure glisse jusqu'à la position de la suivante, en s'épaississant, ce qui donne l'effet de perspective. */
SVG.treadmill = () => {
  const N = 8, Y0 = 67, Y1 = 118, W0 = 0.6, W1 = 3.4;
  const pos = (i) => Y0 + (Y1 - Y0) * Math.pow(i / N, 1.7), thick = (i) => W0 + (W1 - W0) * Math.pow(i / N, 1.7);
  // N + 1 rayures : la rayure i va vers la place de la rayure i + 1, la dernière sort par le bas
  const stripes = Array.from({ length: N + 1 }, (_, i) => {
    const a = pos(i), b = pos(i + 1), d = b - a, k = thick(i + 1) / thick(i);
    return `<rect class="tm-stripe" x="0" y="${a.toFixed(2)}" width="120" height="${thick(i).toFixed(2)}" fill="${i % 2 ? "#3a424b" : "#4a525b"}" style="--d:${d.toFixed(2)}px;--k:${k.toFixed(3)}"/>`;
  }).join("");
  return `
<defs>${DEFS}
<linearGradient id="ID-tmbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a525b"/><stop offset="1" stop-color="#1d2228"/></linearGradient>
<linearGradient id="ID-tmbelt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1013"/><stop offset="1" stop-color="#1b2025"/></linearGradient>
<clipPath id="ID-tmclip"><path d="M18 118L102 118L79 67L41 67Z"/></clipPath></defs>
<ellipse cx="60" cy="128" rx="54" ry="4" fill="url(#ID-shadow)"/>
<path d="M8 122L112 122L86 64L34 64Z" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8" stroke-linejoin="round"/>
<path d="M18 118L102 118L79 67L41 67Z" fill="url(#ID-tmbelt)"/>
<g clip-path="url(#ID-tmclip)"><g class="tm-belt">${stripes}</g></g>
<path d="M18 118L41 67M102 118L79 67" stroke="#9aa3ad" stroke-width="1.1" opacity=".55"/>
<path d="M60 118L60 67" stroke="#59616b" stroke-width=".6" stroke-dasharray="3 4" opacity=".35"/>
<rect x="6" y="119" width="108" height="6" rx="3" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".7"/><path d="M14 122H106" stroke="#e5484d" stroke-width="1" opacity=".8"/>
<path d="M36 64L33 30M84 64L87 30" stroke="#2b3138" stroke-width="5" stroke-linecap="round"/>
<path d="M35 38L16 98M85 38L104 98" stroke="#59616b" stroke-width="3.4" stroke-linecap="round"/><path d="M35 38L16 98M85 38L104 98" stroke="#e5484d" stroke-width="1" stroke-linecap="round" opacity=".7"/>
<rect x="26" y="10" width="68" height="25" rx="6" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8"/>
${lcd(34, 13, 52, 13)}
<circle class="tm-led" cx="44" cy="31" r="1.3"/><circle class="tm-led" cx="54" cy="31" r="1.3"/><circle class="tm-led" cx="64" cy="31" r="1.3"/>`;
};
