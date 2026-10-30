/* nombre de prises dessinées : option sockets, sinon nombre d'entités outlets, sinon 4 (2 à 6) */
const msCount = (c) => Math.max(2, Math.min(6, Math.round(Number(c?.sockets) || (Array.isArray(c?.outlets) && c.outlets.length) || 4)));

SVG.power_strip = (c) => {
  const n = msCount(c), cols = ["#2b3036", "#8d96a0"];
  // positions des prises le long de la face supérieure, vue de trois quarts
  const sock = [...Array(n)].map((_, i) => { const t = (i + .9) / (n + .6); return [14 + t * 96, 73 - t * 12]; });
  return `
<defs>${DEFS}<linearGradient id="ID-mstop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e9ed"/></linearGradient></defs>
<g transform="translate(60 104) scale(1.06) translate(-62 -78)">
<ellipse cx="62" cy="96" rx="56" ry="6" fill="url(#ID-shadow)"/>
<path d="M116 72 q10 4 4 30 q-4 20 -2 40" stroke="#d5dae0" stroke-width="3.4" fill="none"/>
<path class="ms-flow" d="M116 72 q10 4 4 30 q-4 20 -2 40" stroke="#38a8ff" stroke-width="1.6" fill="none"/>
<polygon points="20,78 116,66 116,78 20,90" fill="#d3d8de" stroke="#b5bcc4" stroke-width=".6"/>
<polygon points="8,70 104,58 116,66 20,78" fill="url(#ID-mstop)" stroke="#c4cad1" stroke-width=".6"/>
<polygon class="ms-sw" points="10,71 17,70 19,73 12,74"/>
${sock.map(([x, y], i) => { const col = cols[i % 2]; return `<g class="ms-s ms-s${i}">
  <ellipse cx="${x}" cy="${y}" rx="8" ry="4.2" fill="#eef1f4" stroke="#bfc6ce" stroke-width=".7"/>
  <ellipse class="ms-ring" cx="${x}" cy="${y}" rx="8.8" ry="4.8" fill="none" stroke-width="1"/>
  <circle cx="${x - 2.6}" cy="${y + .4}" r=".9" fill="#5b6168"/><circle cx="${x + 2.6}" cy="${y - .4}" r=".9" fill="#5b6168"/><rect x="${x - .6}" y="${y - 3.4}" width="1.2" height="1.6" fill="#9aa2ab"/>
  <g class="ms-plug">
    <path d="M${x} ${y - 12} q${-4 + i * 3} -18 ${-10 + i * 7} -40" stroke="${col}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M${x - 6.5} ${y - 1} v-11 q0 -3 6.5 -3 q6.5 0 6.5 3 v11 q0 3 -6.5 3 q-6.5 0 -6.5 -3z" fill="${col}" stroke="#7c848d" stroke-width=".6"/>
    <ellipse cx="${x}" cy="${y - 12}" rx="6.5" ry="2.6" fill="${i % 2 ? "#b7bec6" : "#4a525c"}"/>
  </g></g>`; }).join("")}
</g>`;
};
