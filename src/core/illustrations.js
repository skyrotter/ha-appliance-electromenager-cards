/* ------------------------------------------------------------------ */
/* Realistic illustrations — viewBox 0 0 120 140, "ID" = unique prefix  */
/* ------------------------------------------------------------------ */
const DEFS = `
<linearGradient id="ID-body" x1="0" x2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d4d9df"/></linearGradient>
<linearGradient id="ID-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f5f7"/><stop offset="1" stop-color="#d9dee3"/></linearGradient>
<linearGradient id="ID-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfcfd"/><stop offset=".3" stop-color="#a3abb4"/><stop offset=".55" stop-color="#eef1f4"/><stop offset=".8" stop-color="#8d959f"/><stop offset="1" stop-color="#c9ced4"/></linearGradient>
<linearGradient id="ID-inox" x1="0" x2="1"><stop offset="0" stop-color="#b9bfc6"/><stop offset=".22" stop-color="#eceff2"/><stop offset=".5" stop-color="#c5cad0"/><stop offset=".75" stop-color="#e6e9ec"/><stop offset="1" stop-color="#a8afb7"/></linearGradient>
<radialGradient id="ID-steel" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="#eef1f3"/><stop offset=".55" stop-color="#aab2ba"/><stop offset="1" stop-color="#5f6770"/></radialGradient>
<linearGradient id="ID-gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="ID-shadow"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#101317"/></linearGradient>
<radialGradient id="ID-warm" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#ffe2a3"/><stop offset=".6" stop-color="#f3a54a" stop-opacity=".75"/><stop offset="1" stop-color="#7a3b12" stop-opacity=".2"/></radialGradient>
<pattern id="ID-holes" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.25" cy="2.25" r=".75" fill="#4f5760" opacity=".55"/></pattern>
<pattern id="ID-mesh" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".55" fill="#000" opacity=".45"/></pattern>`;

const lcd = (x, y, w, h) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#0c1720" stroke="#8f98a2" stroke-width=".6"/>
<text class="lcd" x="${x + w / 2}" y="${y + h / 2 + 0.3}" text-anchor="middle" dominant-baseline="central" fill="#7ec8e3">OFF</text>`;

const clothes = `
<g class="clothes">
  <path d="M38 92 q8 -7 17 -2 q4 6 -3 9 q-8 3 -14 -7z" fill="#e5484d"/>
  <path d="M52 95 q9 -9 19 -3 q3 7 -6 9 q-9 2 -13 -6z" fill="#3e8ed0"/>
  <path d="M66 90 q8 -4 13 3 q-1 7 -9 6 q-6 -2 -4 -9z" fill="#f2c94c"/>
  <path d="M44 99 q10 -3 18 3 q-4 6 -12 5 q-6 -2 -6 -8z" fill="#9b6ad6"/>
  <path d="M60 101 q8 -5 15 1 q-3 6 -10 5z" fill="#3fbf7f"/>
  <path d="M41 86 q5 -4 10 0 q-2 4 -6 4z" fill="#ff8fab"/>
</g>`;

const porthole = (cx, cy, inner, tag) => `
<circle cx="${cx}" cy="${cy}" r="${inner + 9}" fill="#000" opacity=".08"/>
<circle cx="${cx}" cy="${cy}" r="${inner + 7}" fill="url(#ID-chrome)"/>
<circle cx="${cx}" cy="${cy}" r="${inner + 3}" fill="#2a2f35"/>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="url(#ID-steel)"/>
<g clip-path="url(#ID-win)">${tag}</g>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="url(#ID-gloss)"/>
<path d="M${cx - inner * 0.72} ${cy - inner * 0.42} a${inner * 0.85} ${inner * 0.85} 0 0 1 ${inner * 0.62} -${inner * 0.48}" stroke="#fff" stroke-opacity=".75" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="none" stroke="#000" stroke-opacity=".25"/>`;

const drumInside = (cx, cy, r) => `
<g class="drum">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ID-holes)"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="none" stroke="#8b939c" stroke-opacity=".5"/>
  <path d="M${cx} ${cy - r} l-3 7 h6z M${cx - r * 0.866} ${cy + r / 2} l6.5 -1 l-3 -5.5z M${cx + r * 0.866} ${cy + r / 2} l-6.5 -1 l3 -5.5z" fill="#c9cfd5" stroke="#7d858e" stroke-width=".5"/>
  ${clothes}
</g>`;

const feet = (xs, y) => xs.map((x) => `<rect x="${x}" y="${y}" width="10" height="7" rx="1.5" fill="#3a3f45"/>`).join("");

const cfStyle = (c) => ({ filtre: "filtre", filter: "filtre", drip: "filtre", dosette: "dosette", dosettes: "dosette", pod: "dosette", capsule: "dosette", capsules: "dosette", senseo: "dosette", nespresso: "dosette", expresso: "expresso", espresso: "expresso", grains: "expresso", bean: "expresso", beans: "expresso", latte: "latte", lattego: "latte", ep544x: "latte", philips: "latte", philips5400: "latte", photo: "latte" }[String(c?.style || "filtre").toLowerCase()] || "filtre");
const SVG = {};
