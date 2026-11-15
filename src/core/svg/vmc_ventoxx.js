/* VMC double flux décentralisée Ventoxx Harmony (option model: ventoxx), vue de face : cache blanc mural, chiffre de vitesse (1 à 3)
   et flèche rouge sur l'afficheur. L'air entre dans la pièce (Befúvás / supply) ou en sort (Elszívás / extract) par le pourtour du cache. */
const VX_DRAW = SVG.vmc;
SVG.vmc = (c) => {
  const k = String((c && c.model) || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!["ventoxx", "ventoxxharmony", "harmony"].includes(k)) return VX_DRAW(c);
  // traits d'air autour du cache : [x, y, dx, dy] (dx, dy = direction d'éloignement du cache)
  const L = [[40, 12, 0, -1], [60, 12, 0, -1], [80, 12, 0, -1], [40, 108, 0, 1], [60, 108, 0, 1], [80, 108, 0, 1],
    [19, 38, -1, 0], [19, 60, -1, 0], [19, 82, -1, 0], [101, 38, 1, 0], [101, 60, 1, 0], [101, 82, 1, 0]];
  const air = L.map(([x, y, dx, dy], i) => `<path class="vx-l vx-l${i % 3}" style="--dx:${dx};--dy:${dy};animation-delay:${-(i % 4) * 0.35}s" d="M${x} ${y}l${dx * 5} ${dy * 5}"/>`).join("");
  return `<defs>${DEFS}
<linearGradient id="ID-vxwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece9e3"/><stop offset="1" stop-color="#d9d5cd"/></linearGradient>
<linearGradient id="ID-vxface" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f4f6f8"/><stop offset="1" stop-color="#dde2e7"/></linearGradient></defs>
<g class="vx">
<rect x="0" y="0" width="120" height="140" rx="12" fill="url(#ID-vxwall)"/>
<rect x="25" y="19" width="72" height="92" rx="5" fill="#000" opacity=".16"/>
<rect x="22" y="16" width="76" height="92" rx="5" fill="#cfd5db"/>
<rect x="24" y="17" width="72" height="75" rx="4" fill="url(#ID-vxface)" stroke="#c9ced4" stroke-width=".5"/>
<rect x="24" y="86" width="72" height="20" rx="4" fill="url(#ID-vxface)" stroke="#c9ced4" stroke-width=".5"/>
<path d="M26 18.5h68" stroke="#fff" stroke-width="1.2" opacity=".9"/>
<g class="vx-disp"><text class="vx-d1" x="52" y="101" text-anchor="middle">1</text><text class="vx-d2" x="52" y="101" text-anchor="middle">2</text><text class="vx-d3" x="52" y="101" text-anchor="middle">3</text>
<path class="vx-tri" d="M60 96.5l2.8 4.8h-5.6z"/></g>
<rect x="76" y="97" width="16" height="5" rx="1.2" fill="#c8cdd2"/><text x="84" y="100.9" text-anchor="middle" font-size="3" font-weight="700" fill="#7c848c">VENTOXX</text>
<g class="vx-air">${air}</g>
</g>`;
};
