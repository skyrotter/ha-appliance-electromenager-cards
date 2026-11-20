/* Vue « de côté » du gros électroménager (option style: side) : lave-linge, sèche-linge et lave-vaisselle.
   Face avant en perspective, côté gauche visible, trois pieds. Les mêmes calques et classes que la vue de face (tambour, voyants, afficheur…)
   sont dessinés dans le repère de la vue de face, puis déformés par une matrice (l'animation du tambour tourne dans son repère d'origine). */
const SIDE_MATRIX = "matrix(.739 .0761 0 .925 25.65 1.535)";
// côté gauche + face avant + pieds ; `inner` = contenu de la face avant dans le repère de la vue de face (x 14-106, y 8-128)
const sideBody = (inner, o = {}) => `
<ellipse cx="60" cy="134" rx="54" ry="5" fill="url(#ID-shadow)"/>
<g class="${o.shake || "shake"}">
  <rect x="9" y="118" width="8" height="8" rx="1.5" fill="#3a3f45"/><rect x="38" y="124" width="9" height="8" rx="1.5" fill="#3a3f45"/><rect x="94" y="118" width="9" height="8" rx="1.5" fill="#3a3f45"/>
  <polygon points="6,18 36,10 36,128 6,121" fill="url(#ID-wside)" stroke="${o.edge || "#bfc6ce"}" stroke-width=".8"/>
  <path d="M13 40v76M20 38v80" stroke="#aeb6be" stroke-width=".5" opacity=".5"/>
  <path d="M7 110L35 117" stroke="#fff" stroke-width=".6" opacity=".5"/>
  <polygon points="36,10 104,17 104,121 36,128" fill="url(${o.face || "#ID-body"})" stroke="${o.edge || "#bfc6ce"}" stroke-width=".8"/>
  <path d="M36.6 11v116" stroke="#fff" stroke-width="1" opacity=".8"/>
  ${o.sideExtra || ""}
  <clipPath id="ID-sface"><polygon points="36,10 104,17 104,121 36,128"/></clipPath>
  <g clip-path="url(#ID-sface)"><g transform="${SIDE_MATRIX}">${inner}</g></g>
  ${o.faceExtra || ""}
</g>`;
// hublot en volume : le cadre de porte dépasse de la face avant (épaisseur visible à gauche), le tambour est en retrait
const sidePorthole = (cx, cy, r, tag) => `
<circle cx="${cx - 4.2}" cy="${cy + 0.6}" r="${r + 9}" fill="#aab2bb"/>
<circle cx="${cx - 2.4}" cy="${cy + 0.3}" r="${r + 9}" fill="#c3cad1"/>
${porthole(cx, cy, r, `<g transform="translate(-2.4 0)">${tag}</g>`)}
<ellipse cx="${cx + r * 0.35}" cy="${cy}" rx="${r * 0.5}" ry="${r * 0.95}" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>`;
// repères de programmes autour d'un bouton
const knobTicks = (cx, cy) => Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30) * Math.PI / 180, x1 = cx + Math.sin(a) * 9.8, y1 = cy - Math.cos(a) * 9.8, x2 = cx + Math.sin(a) * 11.6, y2 = cy - Math.cos(a) * 11.6; return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join("");

const WASHER_FRONT = SVG.washer;
const WASHER_SIDE = () => `
<defs>${DEFS}<clipPath id="ID-win"><circle cx="60" cy="80" r="28"/></clipPath>
<linearGradient id="ID-wside" x1="0" x2="1"><stop offset="0" stop-color="#c3cad1"/><stop offset="1" stop-color="#e3e7eb"/></linearGradient></defs>${sideBody(`
    <path d="M14 8h92v25H14z" fill="url(#ID-panel)"/>
    <line x1="14" y1="33" x2="106" y2="33" stroke="#bfc6ce" stroke-width=".8"/>
    <rect x="19" y="12" width="26" height="17" rx="2" fill="#f8f9fb" stroke="#b9c0c8" stroke-width=".7"/>
    <rect x="21" y="14" width="7" height="9" rx="1" fill="#e4e8ec" stroke="#c5ccd3" stroke-width=".4"/><rect x="29.5" y="14" width="6" height="9" rx="1" fill="#e4e8ec" stroke="#c5ccd3" stroke-width=".4"/><rect x="37" y="14" width="6" height="9" rx="1" fill="#e4e8ec" stroke="#c5ccd3" stroke-width=".4"/>
    <rect x="23" y="24.6" width="18" height="2.6" rx="1.3" fill="#a6aeb7"/>
    ${lcd(49, 13, 30, 11)}
    <circle class="led l1" cx="55" cy="29" r="1.4"/><circle class="led l2" cx="61" cy="29" r="1.4"/>
    <circle class="led l3" cx="67" cy="29" r="1.4"/><circle class="led l4" cx="73" cy="29" r="1.4"/>
    <g stroke="#8d96a0" stroke-width=".9" stroke-linecap="round">${knobTicks(93, 21)}</g>
    <circle cx="93" cy="21" r="8.2" fill="url(#ID-chrome)" stroke="#88919a" stroke-width=".6"/>
    <circle cx="93" cy="21" r="5.8" fill="#eff2f5" stroke="#b2b9c1" stroke-width=".6"/>
    <g class="knob"><line x1="93" y1="21" x2="93" y2="16.2" stroke="#4f5964" stroke-width="1.5" stroke-linecap="round"/></g>
    ${sidePorthole(60, 80, 28, `
      ${drumInside(60, 80, 28)}
      <g class="water"><path class="wave" d="M10 88q10-4 20 0t20 0t20 0t20 0t20 0t20 0v30H10z"/></g>
      <g class="foam">
        <circle cx="44" cy="90" r="2.2"/><circle cx="52" cy="92" r="1.6"/><circle cx="61" cy="89" r="2.6"/>
        <circle cx="70" cy="91" r="1.8"/><circle cx="77" cy="88" r="1.4"/><circle cx="56" cy="95" r="1.2"/>
      </g>`)}
    <rect x="46" y="116" width="28" height="2.2" rx="1.1" fill="#c9d0d7"/>`)}`;
SVG.washer = (c) => (c && c.style === "side" ? WASHER_SIDE() : WASHER_FRONT(c));
