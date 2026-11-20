/* Vue « de côté » pour un appareil quelconque : `sideKit(rect)` construit la perspective d'une face avant (rect = x0, y0, x1, y1 dans le
   repère de la vue de face). Même principe que washer_side.js (homographie + matrice locale par groupe), mais pour n'importe quelle taille. */
const sideKit = (rect, o = {}) => {
  const [rx0, ry0, rx1, ry1] = rect, w = rx1 - rx0, h = ry1 - ry0, cx = (rx0 + rx1) / 2;
  const fw = (o.fw || .74) * w, sw = (o.sw || .33) * w, slope = (o.slope || .075) * h / 2;
  const left = cx - (fw + sw) / 2 + sw, right = left + fw;
  const Q = [[left, ry0], [right, ry0 + slope], [right, ry1 - slope], [left, ry1]];
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = Q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, bb = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  const map = (x, y) => { const u = (x - rx0) / w, v = (y - ry0) / h, ww = g * u + hh * v + 1; return [(a * u + bb * v + x0) / ww, (d * u + e * v + y0) / ww]; };
  const f = (n) => +n.toFixed(3), P = (pts) => pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
  const place = (px, py, content) => {
    const [sx, sy] = map(px, py), [p1x, p1y] = map(px + 1, py), [p0x, p0y] = map(px - 1, py), [q1x, q1y] = map(px, py + 1), [q0x, q0y] = map(px, py - 1);
    const m = [(p1x - p0x) / 2, (p1y - p0y) / 2, (q1x - q0x) / 2, (q1y - q0y) / 2];
    return `<g transform="matrix(${m.map(f).join(" ")} ${f(sx - m[0] * px - m[2] * py)} ${f(sy - m[1] * px - m[3] * py)})">${content}</g>`;
  };
  const poly = (ax, ay, bx, by, attrs) => `<polygon points="${P([map(ax, ay), map(bx, ay), map(bx, by), map(ax, by)])}" ${attrs}/>`;
  const quad = (attrs) => `<polygon points="${P(Q)}" ${attrs}/>`;
  // côté gauche : arête avant = arête gauche de la face, arête arrière plus courte (perspective)
  const side = (attrs) => `<polygon points="${P([[left - sw, ry0 + slope * 1.7], [left, ry0], [left, ry1], [left - sw, ry1 - slope * 1.7]])}" ${attrs}/>`;
  // tranches horizontales d'un grand groupe (porte, vitre…) : le même contenu est posé plusieurs fois, chaque copie avec la matrice locale de
  // sa tranche et rognée à cette tranche (coordonnées écran), pour que les bords suivent exactement la perspective. build(i) = contenu de la copie i.
  const bands = (id, x0r, x1r, ys, build) => ys.slice(0, -1).map((ya, i) => {
    const yb = ys[i + 1], pad = i === ys.length - 2 ? 0 : .5, pad0 = i === 0 ? 0 : .5;
    return `<clipPath id="${id}${i}"><polygon points="${P([map(x0r, ya - pad0), map(x1r, ya - pad0), map(x1r, yb + pad), map(x0r, yb + pad)])}"/></clipPath><g clip-path="url(#${id}${i})">${place((x0r + x1r) / 2, (ya + yb) / 2, build(i))}</g>`;
  }).join("");
  return { map, place, poly, quad, side, bands, left, right, sw, bottom: ry1, top: ry0, cx: (left + right) / 2 - sw / 2 };
};

// découpe un gabarit en nœuds de premier niveau (une ligne = un nœud, sauf les <g> sur plusieurs lignes)
const sideNodes = (src) => {
  const nodes = []; let depth = 0, cur = "";
  for (const line of src.split("\n")) {
    if (!line.trim()) continue;
    cur += (cur ? "\n" : "") + line;
    depth += (line.match(/<g[\s>]/g) || []).length - (line.match(/<\/g>/g) || []).length;
    if (depth <= 0) { nodes.push(cur); cur = ""; depth = 0; }
  }
  if (cur) nodes.push(cur);
  return nodes;
};
/* Convertit le dessin de FACE d'un appareil (gabarit déjà évalué) en vue de côté : la caisse devient le trapèze en perspective, et chaque calque
   (intérieur, portes, tiroirs…) est dupliqué par tranches horizontales, chacune avec la perspective locale de sa tranche (voir sideKit.bands).
   Les afficheurs (texte .lcd) ne sont gardés que dans la tranche où ils se trouvent : le code qui les met à jour n'en trouve qu'un.
   rect = caisse dans le repère de face ; o.body = expression du nœud « caisse » ; o.sideFill = couleur du côté. */
const sideFromFront = (src, rect, o = {}) => {
  const K = sideKit(rect, { sw: o.sw }), [rx0, ry0, rx1, ry1] = rect, nodes = sideNodes(src), h = ry1 - ry0;
  const n = Math.max(3, Math.round(h / 24)), ys = Array.from({ length: n + 1 }, (_, i) => ry0 + h * i / n);
  const lcdY = [...src.matchAll(/<text\b[^>]*class="[^"]*\blcd[^"]*"[^>]*>/g)].map((m) => +((m[0].match(/\sy="([\d.]+)"/) || [])[1])).filter((v) => v);
  for (let i = 1; i < n; i++) for (const ty of lcdY) if (ys[i] > ty - 11 && ys[i] < ty + 4) ys[i] = ty + 6;   // pas de coupure à travers un afficheur
  const bodyRe = o.body || /<rect[^>]*fill="#9aa2ab"[^>]*\/>/;
  let body = "", layers = [], run = [];
  const flush = () => { if (run.length) { layers.push(run.join("\n")); run = []; } };
  for (const nd of nodes) {
    if (/ID-shadow/.test(nd) && /^<ellipse/.test(nd.trim())) continue;
    if (!body && bodyRe.test(nd)) { body = nd; continue; }
    if (/^<g[\s>]/.test(nd.trim())) { flush(); layers.push(nd); } else run.push(nd);
  }
  flush();
  const fill = (body.match(/fill="([^"]+)"/) || [])[1] || "#9aa2ab", stroke = (body.match(/stroke="([^"]+)"/) || [])[1];
  let out = `<ellipse cx="${K.cx.toFixed(1)}" cy="${ry1 + 4}" rx="${(rx1 - rx0) * .68}" ry="4.5" fill="url(#ID-shadow)"/>`;
  out += K.side(`fill="${o.sideFill || "#b3bac2"}" stroke="${o.sideEdge || "#8f979f"}" stroke-width=".7"`);
  out += K.quad(`fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width=".8"` : ""}`);
  layers.forEach((layer, li) => {
    out += ys.slice(0, -1).map((ya, i) => {
      const yb = ys[i + 1], pad = i === n - 1 ? 0 : .5, pad0 = i === 0 ? 0 : .5, id = `ID-sb${li}_${i}`;
      const mine = layer.replace(/<text\b[^>]*class="[^"]*\blcd[^"]*"[^>]*>[^<]*<\/text>/g, (t) => { const ty = +((t.match(/\sy="([\d.]+)"/) || [])[1]); return ty >= ya && ty < yb ? t : ""; });
      const clip = [K.map(rx0 - 2, ya - pad0), K.map(rx1 + 2, ya - pad0), K.map(rx1 + 2, yb + pad), K.map(rx0 - 2, yb + pad)].map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
      return `<clipPath id="${id}"><polygon points="${clip}"/></clipPath><g clip-path="url(#${id})">${K.place((rx0 + rx1) / 2, (ya + yb) / 2, mine)}</g>`;
    }).join("");
  });
  return out;
};
