/* Cave à vin vue de côté (option view: side) : voir side_kit.js (sideFromFront). */
const WINE_COOLER_PREV = SVG.wine_cooler;
SVG.wine_cooler = (c) => {
  if (!(c && c.view === "side")) return WINE_COOLER_PREV(c);
  const s = WINE_COOLER_PREV(c), d = s.match(/<defs>[\s\S]*?<\/defs>/)[0];
  return d + sideFromFront(s.replace(d, ""), [22, 6, 98, 128], { sw: .45, sideFill: "#20252b", sideEdge: "#05070a", body: /<rect[^>]*fill="url\(#ID-wncab\)"[^>]*\/>/ });
};
