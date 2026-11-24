/* Carte générique : l'utilisateur fournit sa propre image (option `image`) */
SVG.generic = (c = {}) => {
  // `images` (liste conditionnelle) : on part de la première ; la carte choisit ensuite selon l'état
  const list = Array.isArray(c && c.images) ? c.images.filter((i) => i && i.image) : [];
  const base = String((c && c.image) || (list[0] && list[0].image) || "").trim();
  // image_on / image_off : deux images distinctes selon que l'appareil fonctionne ou non (l'une des deux peut retomber sur `image`)
  const iOn = String((c && c.image_on) || "").trim(), iOff = String((c && c.image_off) || "").trim(), pair = !!(iOn || iOff);
  const src = pair ? iOff || base || iOn : base;
  const im = (cls, href) => `<image class="${cls}" href="${esc(href)}" x="4" y="6" width="112" height="124" preserveAspectRatio="xMidYMid meet"/>`;
  // anneau lumineux (option ring_light) : position et taille réglables, couleur / luminosité suivies de la lumière
  const rx = Number.isFinite(Number(c && c.ring_x)) && c.ring_x !== "" ? Number(c.ring_x) : 50, ry = Number.isFinite(Number(c && c.ring_y)) && c.ring_y !== "" ? Number(c.ring_y) : 46,
    rs = Number.isFinite(Number(c && c.ring_size)) && c.ring_size !== "" ? Number(c.ring_size) : 60, rr = (Math.max(5, Math.min(150, rs)) / 100) * 56, cxr = (rx / 100) * 120, cyr = (ry / 100) * 140;
  const ringOnly = c && c.ring_style === "ring";
  const ringG = c && c.ring_light ? (below) => (below
    ? `<g class="gn-ringg"><radialGradient id="ID-gnr" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="var(--rc,#fff)" stop-opacity=".9"/><stop offset="1" stop-color="var(--rc,#fff)" stop-opacity="0"/></radialGradient>${ringOnly ? "" : `<circle class="gn-halo" cx="${cxr.toFixed(1)}" cy="${cyr.toFixed(1)}" r="${(rr * 1.25).toFixed(1)}" fill="url(#ID-gnr)"/>`}</g>`
    : `<g class="gn-ringg gn-ringt">${ringOnly ? `<circle class="gn-ring" cx="${cxr.toFixed(1)}" cy="${cyr.toFixed(1)}" r="${rr.toFixed(1)}" fill="none"/>` : ""}</g>`) : () => "";
  const art = pair || src
    ? (pair ? im("gn-p gn-off", src) + im("gn-p gn-on", iOn || base || iOff) : im("gn-img", src))
    // pas d'image : pictogramme de prise pour inviter à renseigner `image`
    : `<g class="gn-img gn-empty">
  <rect x="14" y="22" width="92" height="92" rx="16" fill="none" stroke="#8d959f" stroke-width="2" stroke-dasharray="5 5"/>
  <rect x="44" y="40" width="32" height="40" rx="8" fill="#b9bfc6"/>
  <rect x="51" y="30" width="5" height="14" rx="2" fill="#8d959f"/><rect x="64" y="30" width="5" height="14" rx="2" fill="#8d959f"/>
  <path d="M60 80v14" stroke="#8d959f" stroke-width="4" stroke-linecap="round"/>
</g>`;
  return `<ellipse cx="60" cy="128" rx="34" ry="4" fill="#000" opacity=".18"/>${ringG(true)}${art}${ringG(false)}`;
};
