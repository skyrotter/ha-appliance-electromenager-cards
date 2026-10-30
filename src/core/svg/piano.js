SVG.piano = () => {
  // 14 touches blanches, touches noires selon le motif d'une octave
  const X0 = 8, KW = 104 / 14;
  const white = [...Array(14)].map((_, i) => `<path class="pn-k" style="--d:${((i * 7) % 11) * -.37}s;--t:${2.2 + (i % 5) * .45}s" d="M${(X0 + i * KW).toFixed(2)} 86h${(KW - .5).toFixed(2)}l2 26h-${(KW + 1.5).toFixed(2)}z" fill="#fbfbfb" stroke="#b7bcc2" stroke-width=".5"/>`).join("");
  const black = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i, k) => `<rect class="pn-kb" style="--d:${((k * 5) % 9) * -.41}s;--t:${2.6 + (k % 4) * .5}s" x="${(X0 + (i + 1) * KW - 2.2).toFixed(2)}" y="86" width="4.4" height="15" rx=".8" fill="#14171b"/>`).join("");
  return `
<defs>${DEFS}</defs>
<ellipse cx="60" cy="128" rx="56" ry="4" fill="url(#ID-shadow)"/>
<g class="pn-notes" fill="#3b8fe0"><text x="30" y="60" font-size="14">♪</text><text x="62" y="58" font-size="12">♫</text><text x="88" y="62" font-size="13">♪</text></g>
<rect x="2" y="74" width="116" height="40" fill="url(#ID-dark)"/><rect x="2" y="70" width="116" height="16" rx="3" fill="#2b3036"/>
<rect class="pn-scr" x="48" y="74" width="24" height="8" rx="1.5"/>
<g fill="#5b626b">${[0, 1, 2, 3].map((k) => `<circle cx="${12 + k * 7}" cy="78" r="2"/>`).join("")}${[0, 1, 2].map((k) => `<rect x="${82 + k * 8}" y="75" width="5" height="6" rx="1"/>`).join("")}</g>
<circle class="pn-led" cx="112" cy="78" r="1.2"/>
${white}${black}
<rect x="2" y="112" width="116" height="4" rx="1.5" fill="#16191d"/>
<rect x="10" y="116" width="4" height="12" fill="#2b3036"/><rect x="106" y="116" width="4" height="12" fill="#2b3036"/>`;
};
