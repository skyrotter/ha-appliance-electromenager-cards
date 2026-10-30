SVG.garland = () => {
  // deux rangées de festons sous une poutre de terrasse, trois globes par feston
  const sw = [[6, 24, 60, 26], [60, 24, 114, 26], [6, 62, 42, 16], [42, 62, 78, 16], [78, 62, 114, 16]], P = [];
  sw.forEach(([x0, y, x1, h]) => { for (const t of [.25, .5, .75]) P.push([x0 + (x1 - x0) * t, y + 4 * h * t * (1 - t)]); });
  const cord = sw.map(([x0, y, x1, h]) => `M${x0} ${y} Q${(x0 + x1) / 2} ${y + 2 * h} ${x1} ${y}`).join("");
  return `
<defs>${DEFS}<radialGradient id="ID-glh"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect class="gl-sky" width="120" height="140"/>
<rect x="0" y="18" width="120" height="7" fill="#8a6239"/><rect x="0" y="18" width="120" height="2" fill="#a77a4b"/>
<rect x="2" y="25" width="6" height="115" fill="#7a5532"/><rect x="112" y="25" width="6" height="115" fill="#7a5532"/>
<path class="gl-hedge" d="M8 118 q8-10 16 0 q8-12 18 0 q9-10 18 0 q9-12 18 0 q8-10 16 0 q6-8 10 0 v22 h-96z"/>
<rect x="0" y="128" width="120" height="12" fill="#b9a68a"/>
<path d="${cord}" stroke="#2b3036" stroke-width="1.1" fill="none"/>
${P.map(([x, y], i) => `<g class="gl-bulb" style="--d:${(-i * .3).toFixed(1)}s">
  <circle class="gl-h" cx="${x.toFixed(1)}" cy="${(y + 8).toFixed(1)}" r="8"/>
  <rect x="${(x - 1.8).toFixed(1)}" y="${y.toFixed(1)}" width="3.6" height="3" rx=".6" fill="#2b3036"/>
  <circle class="gl-b" cx="${x.toFixed(1)}" cy="${(y + 8).toFixed(1)}" r="5"/>
  <circle class="gl-g" cx="${x.toFixed(1)}" cy="${(y + 8).toFixed(1)}" r="5" fill="url(#ID-glh)"/>
</g>`).join("")}`;
};
