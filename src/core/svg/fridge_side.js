/* Réfrigérateur et congélateur à tiroirs vus de côté (option view: side), tous les styles : voir side_kit.js (sideFromFront). */
const FRIDGE_SVG_PREV = SVG.fridge;
const fridgeRect = (st) => ({ four_door: [16, 4, 104, 130], french: [16, 4, 104, 130], american: [12, 4, 108, 130] }[st] || [26, 4, 94, 130]);
SVG.fridge = (c) => {
  if (!(c && c.view === "side")) return FRIDGE_SVG_PREV(c);
  const st = fridgeStyle(c), f = fridgeFinish(c);
  let body = sideFromFront(FRIDGE[st](!!c.flex_temperature), fridgeRect(st), { sw: .45 });
  if (f) body = body.replace(/url\(#ID-inox\)/g, `url(#ID-${f})`);
  return `${FRIDGE_DEFS}${body}${fridgeMist}`;
};
const DRAWER_FREEZER_PREV = SVG.drawer_freezer;
SVG.drawer_freezer = (c) => (c && c.view === "side" ? (() => { const s = DRAWER_FREEZER_PREV(c), d = s.match(/<defs>[\s\S]*?<\/defs>/)[0]; return d + sideFromFront(s.replace(d, ""), [26, 4, 94, 130], { sw: .45, sideFill: "#cfd5db", sideEdge: "#bfc6ce", body: /<rect[^>]*fill="#9aa2ab"[^>]*\/>/ }); })() : DRAWER_FREEZER_PREV(c));
