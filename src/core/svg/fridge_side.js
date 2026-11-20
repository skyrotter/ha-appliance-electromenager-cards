/* Réfrigérateur vu de côté (option view: side) : style « congélateur en haut » (top). Les portes gardent leur animation d'ouverture (repère de la vue de face). */
const FRIDGE_TOP_FRONT = FRIDGE.top;
FRIDGE.top = (flex, c) => {
  if (!(c && c.view === "side")) return FRIDGE_TOP_FRONT(flex);
  const K = sideKit([26, 4, 94, 130], { sw: .5 });
  return `
<defs><linearGradient id="ID-fside" x1="0" x2="1"><stop offset="0" stop-color="#9ea6af"/><stop offset="1" stop-color="#c9ced4"/></linearGradient></defs>
<ellipse cx="${K.cx.toFixed(1)}" cy="134" rx="46" ry="4.5" fill="url(#ID-shadow)"/>
${K.side('fill="url(#ID-fside)" stroke="#8f979f" stroke-width=".7"')}
<path d="${[0, 1, 2].map((i) => `M${(K.left - K.sw * (.2 + .22 * i)).toFixed(1)} ${(K.top + 30 + i * 2).toFixed(1)}V${(K.bottom - 14 - i * 2).toFixed(1)}`).join("")}" stroke="#fff" stroke-opacity=".25" stroke-width=".7"/>
${K.quad('fill="#9aa2ab"')}
${K.poly(29, 7, 91, 43, 'fill="url(#ID-frost)"')}
${K.place(60, 25, `<path d="M31 25h58" stroke="#a9cbe2" stroke-width="1"/><rect x="34" y="28" width="22" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/><rect x="60" y="28" width="26" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>`)}
${K.poly(29, 47, 91, 125, 'fill="url(#ID-in)"')}
${K.place(60, 86, `<path d="M31 72h58M31 96h58" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="36" y="58" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="44" y="62" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="56" y="64" width="12" height="8" rx="2" fill="#e5484d"/><rect x="72" y="60" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="38" y="86" width="14" height="10" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><circle cx="64" cy="91" r="5" fill="#ff8f3d"/><circle cx="74" cy="92" r="4" fill="#9fd356"/>
<rect x="32" y="104" width="56" height="18" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>`)}
${K.poly(29, 47, 91, 125, 'class="flight" fill="#fffbe6" opacity="0"')}
${K.bands("ID-bz", 26, 94, [4, 24, 44], () => `<g class="fz-door">
  <rect x="26" y="4" width="68" height="40" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="12" width="3.4" height="24" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
</g>`)}
${K.bands("ID-bf", 26, 94, [46, 76, 103, 130], (i) => `<g class="fr-door">
  <rect x="26" y="46" width="68" height="84" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="52" width="3.4" height="40" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${i === 0 ? fridgeLcd(35, 54) : ""}
  <path d="M30 50v76" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`)}`;
};
// SVG.fridge appelle FRIDGE[style](flex) : on lui transmet aussi la config pour la vue de côté
const FRIDGE_SVG_PREV = SVG.fridge;
SVG.fridge = (c) => {
  if (!(c && c.view === "side") || fridgeStyle(c) !== "top") return FRIDGE_SVG_PREV(c);
  const f = fridgeFinish(c), body = FRIDGE.top(!!c.flex_temperature, c);
  return `${FRIDGE_DEFS}${f ? body.replace(/url\(#ID-inox\)/g, `url(#ID-${f})`) : body}${fridgeMist}`;
};
