/* Prise connectée : variante de la multiprise, une seule prise murale (française par défaut ; `plug_type: us` = prise nord-américaine NEMA 5-15 :
 * deux fentes verticales et un trou de terre rond).
 * Option `image` (URL) et/ou `icon` (mdi:...) : l'appareil branché derrière la prise, affiché dans une pastille
 * au-dessus (l'image prime sur l'icône). Sans les deux : la prise seule, centrée et agrandie. */
SVG.smart_plug = (c = {}) => {
  const img = String((c && c.image) || "").trim(), ico = String((c && c.icon) || "").trim();
  const dev = !!(img || ico), us = String((c && c.plug_type) || "").toLowerCase() === "us";
  const badge = !dev ? "" : `
  <g class="sp-dev">
    <circle cx="60" cy="34" r="27" fill="url(#ID-mstop)" stroke="#c4cad1" stroke-width=".8"/>
    ${img
      ? `<image class="sp-img" href="${esc(img)}" x="38" y="12" width="44" height="44" preserveAspectRatio="xMidYMid meet"/>`
      : `<foreignObject x="39" y="13" width="42" height="42"><div xmlns="http://www.w3.org/1999/xhtml" class="sp-ico"><ha-icon icon="${esc(ico)}"></ha-icon></div></foreignObject>`}
  </g>
  <path d="M60 80 V61" stroke="#d5dae0" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path class="sp-flow" d="M60 80 V61" stroke="#38a8ff" stroke-width="1.6" fill="none"/>`;
  // sans appareil : la prise seule, centrée et agrandie
  const tf = dev ? "" : ` transform="translate(60 72) scale(1.25) translate(-60 -105)"`;
  return `
<defs>${DEFS}<linearGradient id="ID-mstop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e9ed"/></linearGradient></defs>
<g${tf}>
  <ellipse cx="60" cy="134" rx="32" ry="4.5" fill="url(#ID-shadow)"/>
  ${badge}
  <ellipse class="sp-glow" cx="60" cy="106" rx="34" ry="32" fill="#38a8ff"/>
  <rect x="34" y="80" width="52" height="52" rx="14" fill="url(#ID-mstop)" stroke="#c4cad1" stroke-width=".8"/>
  ${us ? `<rect class="sp-ring" x="43" y="83" width="34" height="39" rx="11" fill="none" stroke-width="1.6"/>
  <rect x="45.5" y="85.5" width="29" height="34" rx="9" fill="#eef1f4" stroke="#bfc6ce" stroke-width=".8"/>
  <rect x="52.2" y="91" width="2.8" height="11.5" rx="1.1" fill="#5b6168"/><rect x="65" y="92.6" width="2.8" height="8.5" rx="1.1" fill="#5b6168"/>
  <circle cx="60" cy="111.6" r="3.2" fill="#5b6168"/>`
  : `<circle class="sp-ring" cx="60" cy="106" r="19" fill="none" stroke-width="1.6"/>
  <circle cx="60" cy="106" r="16" fill="#eef1f4" stroke="#bfc6ce" stroke-width=".8"/>
  <circle cx="53.5" cy="107" r="2.1" fill="#5b6168"/><circle cx="66.5" cy="107" r="2.1" fill="#5b6168"/><rect x="58.8" y="94" width="2.4" height="5.5" rx="1" fill="#9aa2ab"/>`}
  <circle class="sp-led" cx="60" cy="${us ? 127 : 125.5}" r="${us ? 2.6 : 3}"/>
  <g class="sp-bolt-b"><circle cx="79" cy="88" r="7.5"/><path class="sp-bolt" d="M80.4 82.8 L76 89.2 H79 L77.8 93.6 L82.6 87 H79.6 Z"/></g>
</g>`;
};
