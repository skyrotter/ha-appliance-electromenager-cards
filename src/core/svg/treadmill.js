/* Tapis de course vu de l'arrière, en perspective : la bande vient vers nous, la console est au bout entre ses deux montants, les mains
   courantes en arc descendent de chaque côté. Les rayures de la bande avancent vers l'avant à la vitesse du capteur speed (--fp = durée
   d'un pas de rayure) : chaque rayure glisse jusqu'à la place de la suivante en s'épaississant (effet de perspective). Deux baskets
   (vues de dos) alternent sur la bande quand on court. */
SVG.treadmill = () => {
  const N = 8, Y0 = 66, Y1 = 121, W0 = 0.6, W1 = 3.4;
  const pos = (i) => Y0 + (Y1 - Y0) * Math.pow(i / N, 1.7), thick = (i) => W0 + (W1 - W0) * Math.pow(i / N, 1.7);
  // N + 1 rayures : la rayure i va vers la place de la rayure i + 1, la dernière sort par le bas
  const stripes = Array.from({ length: N + 1 }, (_, i) => {
    const a = pos(i), b = pos(i + 1), d = b - a, k = thick(i + 1) / thick(i);
    return `<rect class="tm-stripe" x="0" y="${a.toFixed(2)}" width="120" height="${thick(i).toFixed(2)}" fill="${i % 2 ? "#323941" : "#444c56"}" style="--d:${d.toFixed(2)}px;--k:${k.toFixed(3)}"/>`;
  }).join("");
  // basket vue de dos : semelle, talon, languette réfléchissante ; (cx, cy) = bas de la semelle, s = échelle de perspective
  const shoe = (cx, cy, s, cls) => `<g class="tm-shoe ${cls}"><g transform="translate(${cx} ${cy}) scale(${s})">
    <rect x="-5" y="-12" width="10" height="12" rx="3.6" fill="#f1f3f5" stroke="#aeb6bf" stroke-width=".5"/><rect x="-5" y="-3" width="10" height="3" rx="1.5" fill="#e5484d"/>
    <rect x="-1" y="-10" width="2" height="6" rx="1" fill="#ffd24a"/></g></g>`;
  return `
<defs>${DEFS}
<linearGradient id="ID-tmbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f5760"/><stop offset="1" stop-color="#1d2228"/></linearGradient>
<linearGradient id="ID-tmbelt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1013"/><stop offset="1" stop-color="#1b2025"/></linearGradient>
<linearGradient id="ID-tmrail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b3138"/><stop offset=".5" stop-color="#6b747e"/><stop offset="1" stop-color="#2b3138"/></linearGradient>
<clipPath id="ID-tmclip"><path d="M22 120L98 120L80 67L40 67Z"/></clipPath></defs>
<ellipse cx="60" cy="131" rx="56" ry="4" fill="url(#ID-shadow)"/>
<path d="M4 125L116 125L89 64L31 64Z" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8" stroke-linejoin="round"/>
<path d="M22 120L98 120L80 67L40 67Z" fill="url(#ID-tmbelt)"/>
<g clip-path="url(#ID-tmclip)"><g class="tm-belt">${stripes}</g></g>
<path d="M4 125L22 120L40 67L31 64ZM116 125L98 120L80 67L89 64Z" fill="#2b3138" stroke="#12161a" stroke-width=".6" stroke-linejoin="round"/>
<path d="M22 120L40 67M98 120L80 67" stroke="#aab3bd" stroke-width="1.2" opacity=".7"/>
<path d="M60 118L60 68" stroke="#59616b" stroke-width=".6" stroke-dasharray="3 4" opacity=".3"/>
${shoe(50, 108, 1, "tm-sa")}${shoe(70, 98, .8, "tm-sb")}
<rect x="2" y="122" width="116" height="7" rx="3.5" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".7"/><path d="M10 125.5H110" stroke="#e5484d" stroke-width="1.1" opacity=".85"/>
<rect x="12" y="129" width="14" height="4" rx="2" fill="#12161a"/><rect x="94" y="129" width="14" height="4" rx="2" fill="#12161a"/>
<path d="M36 66L32 26M84 66L88 26" stroke="#12161a" stroke-width="7" stroke-linecap="round"/><path d="M36 66L32 26M84 66L88 26" stroke="url(#ID-tmrail)" stroke-width="5" stroke-linecap="round"/>
<path d="M26 30C9 40 6 70 10 96" fill="none" stroke="#12161a" stroke-width="5.6" stroke-linecap="round"/><path d="M26 30C9 40 6 70 10 96" fill="none" stroke="#59616b" stroke-width="3.6" stroke-linecap="round"/><path d="M10 82L10 97" stroke="#e5484d" stroke-width="5.2" stroke-linecap="round"/>
<path d="M94 30C111 40 114 70 110 96" fill="none" stroke="#12161a" stroke-width="5.6" stroke-linecap="round"/><path d="M94 30C111 40 114 70 110 96" fill="none" stroke="#59616b" stroke-width="3.6" stroke-linecap="round"/><path d="M110 82L110 97" stroke="#e5484d" stroke-width="5.2" stroke-linecap="round"/>
<path d="M20 6H100Q104 6 103 11L97 35Q96 38 92 38H28Q24 38 23 35L17 11Q16 6 20 6Z" fill="url(#ID-tmbody)" stroke="#12161a" stroke-width=".8"/>
${lcd(30, 9, 60, 17)}
<circle class="tm-led" cx="38" cy="32" r="1.5"/><circle class="tm-led" cx="46" cy="32" r="1.5"/><circle class="tm-led" cx="54" cy="32" r="1.5"/>
<rect x="66" y="30" width="6" height="4" rx="2" fill="#59616b"/><rect x="75" y="30" width="6" height="4" rx="2" fill="#59616b"/><circle cx="87" cy="32" r="2.4" fill="#e5484d"/>`;
};
