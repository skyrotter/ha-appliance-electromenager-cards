/* Four vu de côté (option view: side), une ou deux cavités (cavities: 2) : voir side_kit.js. Même calques animés que la vue de face. */
const OVEN_FRONT = SVG.oven;
const OVEN_SIDE = (dual) => {
  const K = sideKit([10, 10, 110, 130], { sw: .33 });
  const wy1 = dual ? 112 : 112, pts = K.poly(22, 56, 98, wy1, "").match(/points="([^"]+)"/)[1];
  const pts2 = K.poly(22, 91, 98, 112, "").match(/points="([^"]+)"/)[1];
  const lcdBox = dual
    ? `<rect x="33" y="15" width="54" height="12" rx="1.5" fill="#0c1720" stroke="#8f98a2" stroke-width=".6"/><text class="lcd" x="47.5" y="21.3" text-anchor="middle" fill="#7ec8e3">OFF</text><path d="M60 17.5v7" stroke="#3a4a58" stroke-width=".6"/><text class="ovl2" x="73" y="21.3" text-anchor="middle">--</text>`
    : lcd(43, 15, 34, 12);
  const cav1 = dual ? [56, 87] : [56, 112];
  const food = dual
    ? `<path d="M24 77h72" stroke="#8d8680" stroke-width=".9"/><path d="M38 77l3-8h38l3 8z" fill="#b5442f"/><path d="M41 69q19-6 38 0z" fill="#d06a3c"/><g class="haze"><path d="M46 66q-3-4 0-8t0-8M60 65q-3-4 0-8t0-8M74 66q-3-4 0-8t0-8"/></g>`
    : `<path d="M24 97h72M24 99.5h72" stroke="#8d8680" stroke-width=".9"/><path d="M36 97l3-10h42l3 10z" fill="#b5442f"/><path d="M39 87q21-8 42 0z" fill="#d06a3c"/><ellipse cx="60" cy="86.5" rx="5" ry="1.4" fill="#5b2a1a"/><path d="M42 90h36" stroke="#e48a5c" stroke-width=".8"/><g class="haze"><path d="M44 82q-3-5 0-10t0-10M60 80q-3-5 0-10t0-10M76 82q-3-5 0-10t0-10"/></g>`;
  const elem = dual
    ? `<path class="element" d="M26 60h8l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3h8"/>`
    : `<path class="element" d="M26 61h8l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3h8"/>`;
  const second = dual ? `
  ${K.poly(22, 87, 98, 91, 'fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".4"')}
  ${K.poly(22, 91, 98, 112, 'fill="url(#ID-cavity)"')}
  <g clip-path="url(#ID-winp2)">${K.place(60, 101, `
    <rect class="ilight ilight2" x="22" y="91" width="76" height="21" fill="url(#ID-warm)"/>
    <path class="element element2" d="M26 95h8l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5l3 2.5l3-2.5h8"/>
    <path d="M24 106h72" stroke="#8d8680" stroke-width=".8"/>
    <ellipse cx="60" cy="104.5" rx="11" ry="2.6" fill="#c9a064"/><ellipse cx="60" cy="103.8" rx="8" ry="1.6" fill="#dcbc82"/>
    <g class="haze haze2"><path d="M50 101q-2-3 0-6t0-6M60 101q-2-3 0-6t0-6M70 101q-2-3 0-6t0-6"/></g>`)}</g>` : "";
  return `
<defs>${DEFS}<clipPath id="ID-winp"><polygon points="${dual ? K.poly(22, 56, 98, 87, "").match(/points="([^"]+)"/)[1] : pts}"/></clipPath>
<clipPath id="ID-winp2"><polygon points="${pts2}"/></clipPath>
<linearGradient id="ID-cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3330"/><stop offset="1" stop-color="#181412"/></linearGradient>
<linearGradient id="ID-oside" x1="0" x2="1"><stop offset="0" stop-color="#9aa2ab"/><stop offset="1" stop-color="#c3c8ce"/></linearGradient></defs>
<ellipse cx="${K.cx.toFixed(1)}" cy="133" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
${K.side('fill="url(#ID-oside)" stroke="#949ca5" stroke-width=".8"')}
${K.quad('fill="url(#ID-inox)" stroke="#949ca5" stroke-width=".8"')}
${K.poly(10, 10, 110, 32, 'fill="url(#ID-dark)"')}
${K.place(22, 21, `<circle cx="${dual ? 22 : 24}" cy="21" r="${dual ? 6.5 : 7}" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/><circle cx="${dual ? 22 : 24}" cy="21" r="4.4" fill="#2a3036"/><g class="knob"><line x1="${dual ? 22 : 24}" y1="21" x2="${dual ? 22 : 24}" y2="17.4" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/></g>`)}
${K.place(60, 21, `${lcdBox}<circle class="led l1" cx="${dual ? 30 : 38}" cy="21" r="1.3"/>`)}
${K.place(98, 21, `<circle cx="${dual ? 98 : 96}" cy="21" r="${dual ? 6.5 : 7}" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/><circle cx="${dual ? 98 : 96}" cy="21" r="4.4" fill="#2a3036"/><line x1="${dual ? 98 : 96}" y1="21" x2="${(dual ? 98 : 96) + 3}" y2="18.6" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/>`)}
${K.poly(14, 36, 106, 126, 'fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".6"')}
${K.place(60, 43, `<rect x="20" y="40.5" width="80" height="4.5" rx="2.25" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/><rect x="24" y="44.5" width="3" height="4" fill="#8f979f"/><rect x="93" y="44.5" width="3" height="4" fill="#8f979f"/>`)}
${K.poly(22, 56, 98, 112, 'fill="#0f0d0c"')}
${K.poly(22, 56, 98, cav1[1], 'fill="url(#ID-cavity)"')}
<g clip-path="url(#ID-winp)">${K.place(60, 84, `
  <rect class="ilight" x="22" y="56" width="76" height="${cav1[1] - 56}" fill="url(#ID-warm)"/>
  ${elem}${food}`)}</g>
${second}
${K.poly(22, 56, 98, 112, 'fill="none" stroke="#5d656d" stroke-width="1.2" stroke-linejoin="round"')}
${K.poly(14, 118, 106, 126, 'fill="#000" opacity=".12"')}`;
};
SVG.oven = (c) => (c && c.view === "side" ? OVEN_SIDE(Number(c.cavities) === 2) : OVEN_FRONT(c));
