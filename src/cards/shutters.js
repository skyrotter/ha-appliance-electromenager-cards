/* Cartes « Volets » — volet roulant, store vénitien, volets battants, rideaux coulissants, pergola bioclimatique
 * custom:appliance-roller-shutter-card, appliance-venetian-blind-card, appliance-swing-shutter-card,
 * appliance-sliding-curtain-card, appliance-pergola-card.
 * Une entité cover donne l'état (open, closed, opening, closing) ; current_position (0 fermé → 100 ouvert)
 * et current_tilt_position (store vénitien) pilotent le dessin par des variables CSS (--p, --t) dont
 * les transformations sont animées. La vue extérieure passe en nuit quand sun.sun est sous l'horizon.
 * Boutons ouvrir / stop / fermer, curseurs de position et d'inclinaison, puissance du moteur.
 * Pergola : les lames pivotent selon l'inclinaison (sinon la position), redessinées image par image ;
 * en option pluie (entity_rain), éclairage LED (entity_light) et vent (entity_wind).
 * Capteurs externes (volet sans retour d'état) : entity_state (contact on/off ou cover) et entity_position (0-100) remplacent l'état de la cover.
 * Fenêtre de toit (Velux) : l'ouvrant pivote sur son axe, volet roulant extérieur en option (entity_blind), pluie.
 */
(() => {
  if (customElements.get('appliance-roller-shutter-card')) return;

  const T = /*@i18n shutter*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sh-move:var(--appliance-heat-color,#ff8a3d);--sh-ok:var(--appliance-ok-color,#43a047);
  --sh-cold:var(--appliance-cold-color,#2b9af9);--sc:#d5dbe1;--p:0;--t:100;--sh-d:1.2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--sh-ok) 22%,transparent);color:var(--sh-ok)}
.partial .badge{background:color-mix(in srgb,var(--sh-cold) 22%,transparent);color:var(--sh-cold)}
.opening .badge,.closing .badge{background:color-mix(in srgb,var(--sh-move) 22%,transparent);color:var(--sh-move)}
.scene{position:relative;max-width:calc(250px * var(--illus-scale,1));margin:4px auto 0;cursor:pointer}
.scene>svg{display:block;width:100%;height:auto}
.scene.pg{max-width:calc(360px * var(--illus-scale,1))}
.scene.pg>svg{border-radius:10px}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 64px;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.rng{display:flex;align-items:center;gap:8px;margin:8px 2px 0;font-size:10px;color:var(--secondary-text-color)}
.rng.hide{display:none}
.rng span{min-width:56px;flex:none}
.rng input{flex:1;min-width:0;width:100%;accent-color:var(--sh-cold);margin:0;cursor:pointer}
.rng.tl input{accent-color:#c9a96b}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- commun : jour / nuit, voyant, flèche de mouvement ---- */
.day,.night{transition:opacity .8s}
.night{opacity:0}
.isnight .night{opacity:1}.isnight .day{opacity:0}
.led{fill:var(--sh-ok)}
.closed .led{fill:#db4437}
.opening .led,.closing .led{fill:var(--sh-move);animation:shblink .5s steps(2) infinite}
@keyframes shblink{50%{opacity:.25}}
.arrow{opacity:0;transition:opacity .3s}
.opening .arrow,.closing .arrow{opacity:1}
.arrow .dn{display:none}.closing .arrow .dn{display:inline}.closing .arrow .up{display:none}
.opening .arrow circle,.closing .arrow circle{animation:shpulse 1s ease-in-out infinite}
@keyframes shpulse{50%{opacity:.75}}
.beam{opacity:calc(var(--p) * .0022);transition:opacity var(--sh-d)}
.isnight .beam{opacity:0}
.unavailable .scene{filter:grayscale(.7) opacity(.7)}
.mv{transition:transform var(--sh-d) var(--sh-e,ease-in-out)}
.noanim .mv,.noanim .beam{transition:none}
.noanim .led,.noanim .arrow circle{animation:none}

/* ---- volet roulant : le tablier remonte dans le coffre ---- */
.tab{transform:translateY(calc(var(--p) * -1.12px))}
.slit{fill:#ffe9a8;opacity:.55}
.isnight .slit{opacity:0}

/* ---- store vénitien : les lamelles se tassent en haut et s'inclinent (--t : 0 = fermées, 50 = ouvertes à plat, 100 = refermées dans l'autre sens) ----
   --sf = hauteur apparente d'une lamelle vue de face, --sd / --sl = face qui s'assombrit / s'éclaire, --lt = lumière qui passe (0-100) */
.lift{transform-box:view-box;transform-origin:100px 42px;transform:scaleY(calc(1 - var(--p) * .0092))}
.rail{transform:translateY(calc(var(--p) * -.94px))}
.sl{transform-box:fill-box;transform-origin:center;transform:scaleY(var(--sf,1));transition:transform 1.2s ease-in-out}
.sl .sd,.sl .sw{transition:opacity 1.2s ease-in-out}.sl .sd{opacity:var(--sd,0)}.sl .sw{opacity:var(--sl,0)}
.vb .beam{opacity:calc(max(var(--p), var(--lt,0) * .7) * .0022)}
/* inclinaison seule : les lamelles restent réparties sur toute la fenêtre, seul leur angle change */
.tonly .lift,.tonly .rail{transform:none}.tonly .vb .arrow{display:none}
.tonly .vb .beam{opacity:calc(var(--lt,0) * .0015)}
.isnight .vb .beam{opacity:0}

/* ---- rideaux : deux pans de tissu qui se replient horizontalement ---- */
.curtain-panel{transform-box:view-box;transform-origin:22px 31px;transform:scaleX(calc(1 - var(--p) * .0075))}
@media(prefers-reduced-motion:reduce){.curtain-panel{transition:none}}

/* ---- volets battants : deux vantaux en 3D, pivot sur les gonds ---- */
.sw{perspective:520px;perspective-origin:50% 45%}
.leaf{position:absolute;top:22.1%;height:60.5%;width:20%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.leaf.l{left:30%;transform-origin:0 50%;transform:rotateY(calc(var(--p) * 1.72deg))}
.leaf.r{left:50%;transform-origin:100% 50%;transform:rotateY(calc(var(--p) * -1.72deg))}
.leaf .sh{opacity:calc(var(--p) * .004);transition:opacity var(--sh-d)}

/* ---- pergola bioclimatique : pluie, nuit, éclairage LED ---- */
.pg-gap{fill:#8fd0f7;transition:fill .8s}.isnight .pg-gap{fill:#24305a}.rain .pg-gap{fill:#b9c4d0}
.pg-cloud,.pg-drops,.pg-drain{opacity:0;transition:opacity .8s}.rain .pg-cloud,.rain .pg-drops,.rain .pg-drain{opacity:1}
.rain .pg-sun{opacity:0}
.pg-dim{opacity:0;transition:opacity .8s}.isnight .pg-dim{opacity:.6}
.pg-roof{transition:filter .8s}.isnight .pg-roof{filter:brightness(.42)}
.pg-shadow{opacity:.22;transition:opacity .8s}.rain .pg-shadow{opacity:.1}.isnight .pg-shadow{opacity:0}
.pg-ray{opacity:calc(var(--a) * .004);animation:pgray 4s ease-in-out infinite}.isnight .pg-ray,.rain .pg-ray{opacity:0}
.pg-ray:nth-child(2){animation-delay:-1.2s}.pg-ray:nth-child(3){animation-delay:-2.4s}.pg-ray:nth-child(4){animation-delay:-3.1s}
@keyframes pgray{50%{fill-opacity:.45}}
.pg-strip,.pg-pool{opacity:0;transition:opacity .6s}.leds .pg-strip{opacity:1;filter:drop-shadow(0 0 2px #ffd27a)}.isnight.leds .pg-pool{opacity:1}
.pg-candle,.pg-glow{opacity:0}.isnight .pg-candle,.isnight .pg-glow{opacity:.7}
.pg-water path{animation:pgwave 3s ease-in-out infinite alternate}.pg-water path:nth-child(2n){animation-delay:-1.5s}
@keyframes pgwave{to{transform:translateX(6px)}}.pg-candle circle{animation:pgflick 1.3s ease-in-out infinite}
@keyframes pgflick{50%{opacity:.6}}
.pg-drops line{animation:pgdrop .7s linear infinite}
.pg-drops line:nth-child(3n){animation-delay:-.23s}.pg-drops line:nth-child(3n+1){animation-delay:-.47s}
@keyframes pgdrop{from{transform:translate(0,-40px)}to{transform:translate(-8px,150px)}}
.pg-drain circle{animation:pgdrain 1.4s linear infinite}.pg-drain circle:nth-child(2){animation-delay:-.7s}
@keyframes pgdrain{from{transform:translateY(0);opacity:1}to{transform:translateY(80px);opacity:.3}}
.ctl button.on{background:color-mix(in srgb,#ffc94a 35%,var(--secondary-background-color))}
.rw-blind{transform:translateY(calc((var(--bl,0) - 100) * .96px));transition:transform 1.2s ease-in-out}
.rw-in{transition:fill .8s}.isnight .rw-in{fill:#ffcf7a}.isnight .rw-in2{fill:#e9a85a}
.noanim .rw-blind{transition:none}
/* ---- store banne : ombre portée, éclairage LED, vent fort (la toile flotte), pluie ---- */
.aw-shadow{opacity:.24;transition:opacity .8s}.rain .aw-shadow{opacity:.1}.isnight .aw-shadow{opacity:0}
.aw-dyn{transition:filter .8s}.rain .aw-dyn{filter:brightness(.84) saturate(.8)}.isnight .aw-dyn{filter:brightness(.45)}.isnight.rain .aw-dyn{filter:brightness(.4) saturate(.8)}
.aw-strip,.aw-pool{opacity:0;transition:opacity .6s}.leds .aw-strip{opacity:1;filter:drop-shadow(0 0 2px #ffd27a)}.isnight.leds .aw-pool{opacity:1}
.aw-flap{transform-box:view-box;transform-origin:120px 38px}
.windy .aw-flap{animation:awflap .55s ease-in-out infinite alternate}
@keyframes awflap{from{transform:skewX(-1.6deg) translateY(-.6px)}to{transform:skewX(1.6deg) translateY(1px)}}
.aw-wind{opacity:0;transition:opacity .4s}.windy .aw-wind{opacity:.85}.windy .aw-wind path{animation:awgust 1.1s ease-in-out infinite}
.aw-wind path:nth-child(2){animation-delay:-.35s!important}.aw-wind path:nth-child(3){animation-delay:-.7s!important}
@keyframes awgust{from{transform:translateX(-6px);opacity:.3}to{transform:translateX(10px);opacity:1}}
.tile.warn{background:color-mix(in srgb,var(--sh-move) 30%,var(--secondary-background-color))}
.windy .badge{background:color-mix(in srgb,var(--sh-move) 28%,transparent);color:var(--sh-move)}
.noanim .aw-flap,.noanim .aw-wind path{animation:none}
.noanim .pg-water path,.noanim .windy .aw-flap,.noanim .pg-ray,.noanim .pg-candle circle,.noanim .pg-drops line,.noanim .pg-drain circle{animation:none}
`;

  // ciel et paysage vus par la fenêtre (x0..x1, y0..y1), en version jour et nuit
  const outside = (x0, y0, x1, y1, id) => {
    const w = x1 - x0, h = y1 - y0, cx = x0 + w * .78, cy = y0 + h * .26;
    const hills = (c1, c2) => `<path d="M${x0} ${y0 + h * .76} Q${x0 + w * .27} ${y0 + h * .58} ${x0 + w * .53} ${y0 + h * .72} T${x1} ${y0 + h * .65} V${y1} H${x0}Z" fill="${c1}"/>
      <path d="M${x0} ${y0 + h * .87} Q${x0 + w * .4} ${y0 + h * .74} ${x1} ${y0 + h * .85} V${y1} H${x0}Z" fill="${c2}"/>`;
    return `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#${id})">
      <g class="day"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyd)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .12}" fill="#ffe27a" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#ffd54a"/>${hills('#7fbf6a', '#5ea552')}</g>
      <g class="night"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyn)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#f4f1d0"/><circle cx="${cx + w * .03}" cy="${cy - h * .03}" r="${w * .062}" fill="#16234a"/>
        ${[[.2, .15], [.47, .09], [.63, .35], [.29, .4], [.12, .3]].map(([a, b]) => `<circle cx="${x0 + w * a}" cy="${y0 + h * b}" r="1" fill="#fff"/>`).join('')}${hills('#13233d', '#0e1b30')}</g>
    </g>`;
  };
  const DEFS = `<defs>
    <linearGradient id="shskyd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d7f0ff"/></linearGradient>
    <linearGradient id="shskyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset="1" stop-color="#1b2a55"/></linearGradient>
    <linearGradient id="shalu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f7f9"/><stop offset="1" stop-color="#bfc6cd"/></linearGradient>
    <linearGradient id="shrelief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <linearGradient id="shcurtainfold"><stop stop-color="#000" stop-opacity=".19"/><stop offset=".28" stop-color="#fff" stop-opacity=".13"/><stop offset=".6" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <pattern id="shcurtainfabric" width="12" height="130" patternUnits="userSpaceOnUse"><rect width="12" height="130" fill="var(--sc)"/><rect width="12" height="130" fill="url(#shcurtainfold)"/></pattern>
  </defs>`;
  const ARROW = (x, y) => `<g class="arrow" transform="translate(${x} ${y})"><circle r="9" fill="#ff8a3d"/>
    <path class="up" d="M-4 2 L0 -3 L4 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="dn" d="M-4 -2 L0 3 L4 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;

  const X0 = 34, X1 = 166, Y0 = 36, Y1 = 146, W = X1 - X0, H = Y1 - Y0;
  const SVGS = {
    // Two fabric panels gather sideways from the centre, never roll vertically.
    sliding_curtain: () => {
      const panel = '<path d="M22 31q6 3 12 0t12 0t12 0t12 0t12 0t12 0h6v117q-6 3-12 0t-12 0t-12 0t-12 0t-12 0t-12 0h-6Z" fill="url(#shcurtainfabric)"/>';
      return `<rect x="28" y="36" width="144" height="110" rx="2" fill="#8a96a2"/>
        <g class="day"><rect x="32" y="40" width="136" height="102" fill="url(#shskyd)"/><circle cx="142" cy="59" r="7" fill="#ffe27a"/></g>
        <g class="night"><rect x="32" y="40" width="136" height="102" fill="url(#shskyn)"/><path d="M140 53a7 7 0 1 0 8 9 8 8 0 0 1-8-9" fill="#d9e4e8"/></g>
        <path d="M100 40v102M32 142h136" stroke="#7c8c9d" stroke-width="3"/>
        <rect x="24" y="145" width="152" height="4" rx="1" fill="#a7b1b9"/>
        <g class="curtain-left curtain-panel mv">${panel}</g>
        <g transform="translate(200 0) scale(-1 1)"><g class="curtain-right curtain-panel mv">${panel}</g></g>
        <rect x="18" y="25" width="164" height="4" rx="1.5" fill="url(#shalu)"/>
        <path d="M20 29v3m160-3v3" stroke="#7c8791" stroke-width="2"/>`;
    },
    // tablier de lames alu (couleur --sc) qui remonte dans le coffre
    roller_shutter: () => {
      let sl = '';
      for (let y = Y0 - 2; y < Y1; y += 7) {
        sl += `<rect x="${X0}" y="${y}" width="${W}" height="7" fill="var(--sc)"/><rect x="${X0}" y="${y}" width="${W}" height="7" fill="url(#shrelief)"/>
          <line x1="${X0}" x2="${X1}" y1="${y + 6.5}" y2="${y + 6.5}" stroke="#00000055" stroke-width=".8"/>`;
        for (let x = X0 + 6; x < X1 - 4; x += 9) sl += `<rect class="slit" x="${x}" y="${y + 5.6}" width="4" height=".9"/>`;
      }
      return `<rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwr')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <g clip-path="url(#shwr)"><g class="tab mv">${sl}${ARROW(100, Y1 - 12)}</g></g>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0 - 6}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/><rect x="${X1}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/>
        <rect x="${X0 - 8}" y="18" width="${W + 16}" height="20" rx="3" fill="url(#shalu)"/><rect x="${X0 - 8}" y="35" width="${W + 16}" height="3" fill="#8d959d"/>
        <circle class="led" cx="${X1 + 2}" cy="28" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/>`;
    },
    // lamelles (couleur --sc) qui se tassent sous le caisson et pivotent sur elles-mêmes
    venetian_blind: () => {
      let sl = '';
      for (let y = Y0 + 8; y < Y1 - 4; y += 7) sl += `<g class="sl"><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="var(--sc)"/><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="url(#shrelief)"/><rect class="sd" x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="#000"/><rect class="sw" x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="#fff"/></g>`;
      const cords = [64, 136].map((x) => `<line x1="${x}" y1="${Y0 + 4}" x2="${x}" y2="${Y1 - 4}" stroke="#00000035" stroke-width=".8"/>`).join('');
      return `<g class="vb"><rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwv')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <g class="lift mv">${cords}${sl}</g>
        <g class="rail mv"><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="var(--sc)"/><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="#000" opacity=".25"/>${ARROW(100, Y1 - 16)}</g>
        <rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="var(--sc)"/><rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="url(#shrelief)"/>
        <circle class="led" cx="${X1}" cy="${Y0}" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/></g>`;
    },
    // façade et fenêtre ; les deux vantaux sont des calques 3D posés par-dessus (voir LEAF)
    swing_shutter: () => `<rect x="6" y="14" width="188" height="146" rx="4" fill="#d8cbb5"/>${outside(62, 40, 138, 142, 'shws')}
        <line x1="100" y1="40" x2="100" y2="142" stroke="#f3eee6" stroke-width="3"/><rect x="62" y="40" width="76" height="102" fill="none" stroke="#f3eee6" stroke-width="3"/>
        <rect x="52" y="143" width="96" height="6" rx="2" fill="#efe9df"/>
        <circle class="led" cx="100" cy="26" r="2.2"/>${ARROW(100, 92)}`,
  };
  // un vantail à persiennes (couleur --sc), dessiné dans un rectangle 40 × 104
  const LEAF = (right) => {
    let lv = '';
    for (let y = 8; y < 100; y += 5.4) lv += `<line x1="4" y1="${y.toFixed(1)}" x2="36" y2="${(y + 2).toFixed(1)}" stroke="#00000048" stroke-width="1.3"/>`;
    const hx = right ? 36 : 0;
    return `<svg viewBox="0 0 40 104" preserveAspectRatio="none"><rect width="40" height="104" fill="var(--sc)"/>${lv}
      <rect x="1" y="1" width="38" height="102" fill="none" stroke="#00000055" stroke-width="2"/><rect x="2" y="48" width="36" height="4" fill="#00000030"/>
      <rect x="${hx}" y="14" width="4" height="4" fill="#30343a"/><rect x="${hx}" y="86" width="4" height="4" fill="#30343a"/>
      <rect class="sh" width="40" height="104" fill="#000"/></svg>`;
  };

  /* ---- pergola : repère 240 × 180 ; coins du toit (arrière / avant, gauche / droite), hauteur des poteaux, nombre de lames ---- */
  const PG = { BL: [62, 34], BR: [222, 34], FL: [22, 70], FR: [182, 70], H: 84, N: 9, SX: 16 };
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const pts = (a) => a.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  // lames et leur ombre sur la terrasse pour un angle a (0 = fermée, à plat ; 100 = lames verticales)
  const pgBlades = (a) => {
    const th = a / 100 * Math.PI / 2, co = Math.cos(th), up = 1.2 * Math.sin(th);
    const dv = [(PG.FL[0] - PG.BL[0]) / PG.N / 2 * co, (PG.FL[1] - PG.BL[1]) / PG.N / 2 * co];
    let bl = '', sh = '';
    for (let i = 0; i < PG.N; i++) {
      const k = (i + .5) / PG.N, L = lerp(PG.BL, PG.FL, k), R = lerp(PG.BR, PG.FR, k);
      const q = [[L[0] - dv[0], L[1] - dv[1] + up], [R[0] - dv[0], R[1] - dv[1] + up], [R[0] + dv[0], R[1] + dv[1] - up], [L[0] + dv[0], L[1] + dv[1] - up]];
      // face qui fonce en pivotant, arête claire
      bl += `<polygon points="${pts(q)}" fill="var(--sc)" stroke="#8d969f" stroke-width=".5"/><polygon points="${pts(q)}" fill="#000" opacity="${(.3 * (1 - co)).toFixed(2)}"/>`;
      if (a > 8) bl += `<line x1="${q[3][0].toFixed(1)}" y1="${q[3][1].toFixed(1)}" x2="${q[2][0].toFixed(1)}" y2="${q[2][1].toFixed(1)}" stroke="#fff" stroke-width="1" opacity=".9"/>`;
      const f = (p) => [p[0] + PG.SX, p[1] + PG.H];
      sh += `<polygon points="${pts([f([L[0] - dv[0], L[1] - dv[1]]), f([R[0] - dv[0], R[1] - dv[1]]), f([R[0] + dv[0], R[1] + dv[1]]), f([L[0] + dv[0], L[1] + dv[1]])])}"/>`;
    }
    return [bl, sh];
  };
  // décor : maison contemporaine à toit plat (bardage bois, baie vitrée), terrasse en pierre, piscine au premier plan
  const PERGOLA = () => {
    const { BL, BR, FL, FR, H } = PG, gy = BL[1] + H, floor = [[BL[0], gy], [BR[0], gy], [FR[0], FR[1] + H], [FL[0], FL[1] + H]];
    const post = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${H}" fill="url(#pgalu)"/>`;
    const rays = [.18, .38, .58, .78].map((k) => { const P = lerp(lerp(BL, FL, k), lerp(BR, FR, k), .35); return `<path class="pg-ray" d="M${P[0].toFixed(1)} ${P[1].toFixed(1)}l${PG.SX} ${H}h12l${-PG.SX} ${-H}z"/>`; }).join('');
    const drops = [...Array(30)].map((_, k) => { const x = (k * 37.3) % 250, y = (k * 23) % 40; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    // bardage : lames verticales de teintes légèrement différentes
    const clad = [...Array(60)].map((_, k) => `<rect x="${k * 4}" y="22" width="4" height="${gy - 22}" fill="${['#b9834f', '#ad7845', '#c08b57', '#a87344'][(k * 7) % 4]}"/>`).join('')
      + [...Array(60)].map((_, k) => `<path d="M${k * 4} 22V${gy}" stroke="#7d522c" stroke-width=".35"/>`).join('');
    // claustra bois sur le côté gauche, entre les deux poteaux
    const screen = [...Array(9)].map((_, k) => {
      const y = 76 + k * 6.4, t = (y - FL[1]) / H;
      return `<polygon points="${pts([[FL[0] + 3, FL[1] + t * H], [BL[0] - 3, BL[1] + t * H], [BL[0] - 3, BL[1] + t * H + 4], [FL[0] + 3, FL[1] + t * H + 4]])}" fill="${k % 2 ? '#a5703f' : '#b27b48'}"/>`;
    }).join('');
    const lantern = (x, y) => `<g><rect x="${x - 3}" y="${y - 8}" width="6" height="8" rx="1.5" fill="none" stroke="#3a3027" stroke-width=".8"/>
      <path d="M${x - 3} ${y - 5}h6M${x - 3} ${y - 2.5}h6M${x} ${y - 8}v8" stroke="#3a3027" stroke-width=".5"/><circle class="pg-glow" cx="${x}" cy="${y - 4}" r="4.5" fill="#ffcf6a"/></g>`;
    return `<defs>
      <linearGradient id="pgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6db7ef"/><stop offset="1" stop-color="#d6ecfb"/></linearGradient>
      <linearGradient id="pgglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5466"/><stop offset=".5" stop-color="#6f8ba0"/><stop offset="1" stop-color="#2f4252"/></linearGradient>
      <linearGradient id="pgwarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset="1" stop-color="#e8954a"/></linearGradient>
      <linearGradient id="pgstone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ddd7cc"/><stop offset="1" stop-color="#c9c2b5"/></linearGradient>
      <linearGradient id="pgwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc3e6"/><stop offset="1" stop-color="#1f8fc4"/></linearGradient>
      <linearGradient id="pgalu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d434b"/><stop offset=".5" stop-color="#5b626b"/><stop offset="1" stop-color="#2e3339"/></linearGradient>
      <radialGradient id="pgpool" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <clipPath id="pgfloor"><polygon points="${pts(floor)}"/></clipPath></defs>
      <g class="day"><rect width="240" height="180" fill="url(#pgsky)"/><g class="pg-sun"><circle cx="30" cy="9" r="11" fill="#ffe17a" opacity=".3"/><circle cx="30" cy="9" r="6.5" fill="#ffe17a"/></g></g>
      <g class="night"><rect width="240" height="180" fill="url(#shskyn)"/><circle cx="212" cy="8" r="4.5" fill="#f4f1d0"/><circle cx="214" cy="6.6" r="3.8" fill="#0b1430"/>
        ${[[50, 8], [80, 4], [130, 9], [165, 3], [110, 5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#fff"/>`).join('')}</g>
      <g class="pg-cloud"><rect width="240" height="20" fill="#8d99a8"/><ellipse cx="70" cy="6" rx="40" ry="8" fill="#7d8896"/><ellipse cx="170" cy="5" rx="48" ry="8" fill="#86919f"/></g>
      <!-- maison : bardage bois, acrotère du toit plat, baie vitrée, appliques -->
      ${clad}
      <rect x="-2" y="16" width="244" height="7" fill="#3a3f46"/><rect x="-2" y="16" width="244" height="1.4" fill="#5b626b"/>
      <rect x="0" y="23" width="240" height="3" fill="#000" opacity=".15"/>
      <rect x="96" y="52" width="76" height="${gy - 52}" fill="#24292f"/>
      <rect x="99" y="55" width="34" height="${gy - 55}" fill="url(#pgglass)"/><rect x="135" y="55" width="34" height="${gy - 55}" fill="url(#pgglass)"/>
      <path d="M99 ${gy - 6}l14 -${gy - 61}h8l-14 ${gy - 61}zM135 ${gy - 10}l12 -${gy - 65}h5l-12 ${gy - 65}z" fill="#fff" opacity=".12"/>
      <rect x="88" y="62" width="2.6" height="5" rx=".8" fill="#2b2f35"/><rect x="178" y="62" width="2.6" height="5" rx=".8" fill="#2b2f35"/>
      <!-- terrasse en pierre, pelouse, piscine -->
      <rect x="0" y="${gy}" width="240" height="${180 - gy}" fill="#6fae58"/>
      <polygon points="${pts([[0, gy], [240, gy], [240, 164], [0, 164]])}" fill="url(#pgstone)"/>
      ${[0, 1, 2, 3].map((k) => `<path d="M0 ${gy + 11 + k * 11}H240" stroke="#b9b1a3" stroke-width=".5"/>`).join('')}
      <g clip-path="url(#pgfloor)"><g class="pg-shadow" fill="#000"></g></g>
      ${post(BL[0], BL[1], 6)}${post(BR[0], BR[1], 6)}
      <!-- tapis, canapé d'angle, fauteuil en rotin, table basse, plante -->
      <path d="M56 142l12-12h96l12 12z" fill="#cfc4b2"/>
      <rect x="66" y="110" width="88" height="15" rx="3" fill="#c49a62"/><rect x="66" y="110" width="88" height="15" rx="3" fill="#000" opacity=".08"/>
      ${[0, 1, 2, 3].map((k) => `<rect x="${69 + k * 21}" y="111" width="20" height="12" rx="3" fill="${k % 2 ? '#dcd9d3' : '#e6e3dd'}"/>`).join('')}
      <rect x="64" y="122" width="92" height="9" rx="2.5" fill="#c49a62"/><rect x="67" y="120.5" width="86" height="6" rx="2.5" fill="#efece6"/>
      <path d="M48 128l12-8h8v12l-14 7z" fill="#c49a62"/><path d="M51 127l10-6.5h6v7l-12 6z" fill="#efece6"/>
      <path d="M72 119q0-6 6-6q5 1 4 6z" fill="#9a8f80"/><path d="M134 119q0-6 6-6q6 1 4 6z" fill="#7d8a7a"/><path d="M142 120q0-5 5-5q5 1 3 5z" fill="#d6cdbd"/>
      <g transform="translate(166 116)"><path d="M0 4h18l-2 12h-14z" fill="#a98454"/>
        ${[0, 1, 2, 3, 4].map((k) => `<path d="M${1 + k * 3.6} 5l1 10" stroke="#8a683f" stroke-width=".5"/>`).join('')}
        <rect x="2" y="-2" width="14" height="8" rx="2.5" fill="#efece6"/><rect x="3" y="15" width="1.6" height="4" fill="#3a3027"/><rect x="13.4" y="15" width="1.6" height="4" fill="#3a3027"/></g>
      <ellipse cx="110" cy="146" rx="18" ry="2.2" fill="#000" opacity=".15"/>
      <ellipse cx="110" cy="135.5" rx="17" ry="3.4" fill="#2f3237"/><rect x="108.8" y="137" width="2.4" height="8" fill="#2f3237"/>
      <path d="M104 135l1-4h5l1 4z" fill="#d9d4ca"/><path d="M107.5 131q-4-5-1-9q3 3 1 9zM107.5 131q3-6 7-7q-1 5-7 7z" fill="#5c8f52"/>
      <rect x="114" y="132" width="3" height="3" rx=".5" fill="#f3efe6"/>
      <g transform="translate(205 102)"><path d="M-6 10h12l-1.5 14h-9z" fill="#5b5f66"/><circle cx="0" cy="2" r="9" fill="#5f8a55"/><circle cx="-4" cy="-3" r="5" fill="#6f9c63"/><circle cx="5" cy="-2" r="5" fill="#557d4c"/></g>
      ${lantern(36, 152)}${lantern(196, 150)}
      <rect class="pg-dim" x="0" y="0" width="240" height="180" fill="#0a1020"/>
      <!-- nuit : intérieur éclairé, appliques, halos -->
      <g class="night"><rect x="99" y="55" width="34" height="${gy - 55}" fill="url(#pgwarm)" opacity=".85"/><rect x="135" y="55" width="34" height="${gy - 55}" fill="url(#pgwarm)" opacity=".85"/>
        <circle cx="89.3" cy="64" r="5" fill="#ffcf6a" opacity=".45"/><circle cx="179.3" cy="64" r="5" fill="#ffcf6a" opacity=".45"/></g>
      <g clip-path="url(#pgfloor)"><ellipse class="pg-pool" cx="112" cy="135" rx="90" ry="28" fill="url(#pgpool)"/></g>
      <g class="pg-candle"><circle cx="115.5" cy="131" r="6" fill="#ffcf6a" opacity=".22"/><circle cx="115.5" cy="131" r="1.2" fill="#ffcf6a"/></g>
      <g fill="#fff6c8" fill-opacity=".3">${rays}</g>
      ${screen}
      <g class="pg-roof"><polygon class="pg-gap" points="${pts([BL, BR, FR, FL])}"/><g class="pg-blades"></g></g>
      <polyline points="${pts([FL, BL, BR])}" fill="none" stroke="#2b3036" stroke-width="3"/>
      <polyline points="${pts([BR, FR])}" fill="none" stroke="#3a4048" stroke-width="3.4"/>
      <rect x="${FL[0] - 2}" y="${FL[1] - 4}" width="${FR[0] - FL[0] + 4}" height="8" fill="url(#pgalu)"/>
      <rect class="pg-strip" x="${FL[0] + 2}" y="${FL[1] + 4}" width="${FR[0] - FL[0] - 4}" height="1.6" fill="#ffd27a"/>
      ${post(FL[0], FL[1], 7)}${post(FR[0], FR[1], 7)}
      <g class="pg-drain"><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.4" fill="#9fd0ff"/><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.2" fill="#9fd0ff"/></g>
      <!-- piscine au premier plan : margelle, eau, reflets -->
      <rect x="-2" y="162" width="176" height="20" fill="#e9e5dd"/>
      <rect x="4" y="166" width="164" height="16" fill="url(#pgwater)"/>
      <g class="pg-water" stroke="#bff0ff" stroke-width=".8" fill="none" opacity=".8">
        <path d="M10 170q6-2 12 0t12 0"/><path d="M60 173q6-2 12 0t12 0"/><path d="M118 169q6-2 12 0t12 0"/><path d="M30 177q6-2 12 0t12 0"/><path d="M95 178q6-2 12 0t12 0"/></g>
      <rect class="pg-dim" x="4" y="166" width="164" height="16" fill="#0a1020"/>
      <g class="night"><ellipse cx="86" cy="174" rx="60" ry="6" fill="#5fe1ff" opacity=".35"/></g>
      <g class="pg-drops" stroke="#dfeeff" stroke-width="1" opacity=".8">${drops}</g>
      <circle class="led" cx="${FL[0] + 8}" cy="${FL[1]}" r="1.8"/>${ARROW(FR[0] + 16, FR[1] - 14)}`;
  };

  /* ---- store banne : repère 240 × 180, vue de face (maison, terrasse en bois, pelouse) ; la toile, les bras et l'ombre sont
     redessinés image par image (awDyn) selon le déploiement (0-100) et l'inclinaison (0-100) ---- */
  const AW = { BL: [22, 38], BR: [218, 38], GY: 118 };
  const awDyn = (p, t) => {
    const e = Math.max(0, Math.min(1, p / 100)), tt = isNaN(t) ? 45 : t, { BL, BR, GY } = AW;
    const drop = e * (34 + tt * .28), grow = e * 14;
    const FL = [BL[0] - grow, BL[1] + 2 + drop], FR = [BR[0] + grow, BR[1] + 2 + drop], N = 10;
    let fab = '';
    if (e > .02) {
      for (let i = 0; i < N; i++) {
        const q = [lerp(BL, BR, i / N), lerp(BL, BR, (i + 1) / N), lerp(FL, FR, (i + 1) / N), lerp(FL, FR, i / N)];
        fab += `<polygon points="${pts(q)}" fill="var(--sc)"/>${i % 2 ? `<polygon points="${pts(q)}" fill="#fff" opacity=".14"/>` : ''}<polygon points="${pts(q)}" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".4"/>`;
      }
      fab += `<polygon points="${pts([BL, BR, FR, FL])}" fill="url(#ID-awfab)"/>`;
      // lambrequin festonné sous la barre de charge
      const y0 = FL[1] + 5, n = 16, w = FR[0] - FL[0];
      let d = `M${FL[0].toFixed(1)} ${y0.toFixed(1)}H${FR[0].toFixed(1)}`;
      for (let i = n - 1; i >= 0; i--) d += `Q${(FL[0] + w * (i + .5) / n).toFixed(1)} ${(y0 + 9).toFixed(1)} ${(FL[0] + w * i / n).toFixed(1)} ${y0.toFixed(1)}`;
      fab += `<path d="${d}Z" fill="var(--sc)"/><path d="${d}Z" fill="#000" opacity=".1"/>`;
    }
    fab += `<path d="M${FL[0].toFixed(1)} ${FL[1].toFixed(1)}H${FR[0].toFixed(1)}V${(FR[1] + 5).toFixed(1)}H${FL[0].toFixed(1)}Z" fill="#3b4047"/>
      <path d="M${FL[0].toFixed(1)} ${(FL[1] + .6).toFixed(1)}H${FR[0].toFixed(1)}" stroke="#9aa2aa" stroke-width="1"/>
      <circle cx="${FL[0].toFixed(1)}" cy="${(FL[1] + 2.5).toFixed(1)}" r="3" fill="#2c3136"/><circle cx="${FR[0].toFixed(1)}" cy="${(FR[1] + 2.5).toFixed(1)}" r="3" fill="#2c3136"/>`;
    // bras articulés : coude qui descend un peu quand le store est replié
    const arm = (A, F, side) => {
      const M = lerp(A, F, .5), E = [M[0] + side * 3 * (1 - e), M[1] + 7 + 9 * (1 - e)], P = pts([A, E, F]);
      return `<polyline points="${P}" fill="none" stroke="#2c3136" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
        <polyline points="${P}" fill="none" stroke="#8a929a" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${E[0].toFixed(1)}" cy="${E[1].toFixed(1)}" r="1.9" fill="#1e2226"/>`;
    };
    const arms = arm([BL[0] + 9, BL[1] + 3], [FL[0] + 8, FL[1] + 3], 1) + arm([BR[0] - 9, BR[1] + 3], [FR[0] - 8, FR[1] + 3], -1);
    const sy = GY + e * 46, sh = `<polygon points="${pts([[BL[0] - 6, GY], [BR[0] + 6, GY], [BR[0] + 6 + grow + 8, sy], [BL[0] - 6 - grow - 8, sy]])}"/>`;
    const led = e > .05 ? `<line x1="${(FL[0] + 7).toFixed(1)}" y1="${(FL[1] + 5.6).toFixed(1)}" x2="${(FR[0] - 7).toFixed(1)}" y2="${(FR[1] + 5.6).toFixed(1)}" stroke="#ffe08a" stroke-width="1.6" stroke-dasharray="3 2.2" class="aw-strip"/>
      <ellipse class="aw-pool" cx="120" cy="${(GY + e * 30 + 12).toFixed(1)}" rx="${(34 + e * 52).toFixed(1)}" ry="${(7 + e * 4).toFixed(1)}" fill="url(#ID-awpool)"/>` : '';
    return [`<g class="aw-flap">${fab}</g>${arms}`, sh, led];
  };
  const AWNING = () => {
    const { BL, BR, GY } = AW;
    const chair = (x, y, f) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><rect x="-1" y="-11" width="3" height="11" rx="1" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="-1" y="-11" width="12" height="3" rx="1.2" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="-1" y="-3" width="12" height="3.2" rx="1.2" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="0" y="0" width="1.6" height="7" fill="#b7ae9e"/><rect x="8" y="0" width="1.6" height="7" fill="#b7ae9e"/></g>`;
    const planks = [0, 1, 2, 3, 4].map((k) => `<path d="M0 ${GY + 6 + k * (6 + k * 1.4)}H240" stroke="#8a6338" stroke-width=".6" opacity=".7"/>`).join('')
      + [...Array(16)].map((_, k) => `<path d="M${(k * 31 + (k % 3) * 9) % 240} ${GY + 6 + (k % 4) * 8}v${5 + (k % 3)}" stroke="#8a6338" stroke-width=".5" opacity=".6"/>`).join('');
    const lantern = (x, y) => `<g><rect x="${x - 2.6}" y="${y - 7}" width="5.2" height="7" rx="1.4" fill="none" stroke="#2a2f35" stroke-width=".8"/><path d="M${x - 2.6} ${y - 3.5}h5.2M${x} ${y - 7}v7" stroke="#2a2f35" stroke-width=".5"/><circle class="pg-glow" cx="${x}" cy="${y - 3.5}" r="5" fill="#ffcf6a"/></g>`;
    const drops = [...Array(32)].map((_, k) => { const x = (k * 37.3) % 250, y = (k * 23) % 40; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    return `<defs>
      <linearGradient id="ID-awglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5466"/><stop offset=".5" stop-color="#6f8ba0"/><stop offset="1" stop-color="#2f4252"/></linearGradient>
      <linearGradient id="ID-awwarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset="1" stop-color="#e8954a"/></linearGradient>
      <linearGradient id="ID-awfab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".45" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
      <radialGradient id="ID-awpool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <clipPath id="ID-awg"><rect x="0" y="${GY}" width="240" height="${180 - GY}"/></clipPath></defs>
      <g class="day"><rect width="240" height="${GY}" fill="url(#shskyd)"/><g class="pg-sun"><circle cx="34" cy="7" r="13" fill="#ffe17a" opacity=".3"/><circle cx="34" cy="7" r="7" fill="#ffe17a"/></g></g>
      <g class="night"><rect width="240" height="${GY}" fill="url(#shskyn)"/><circle cx="206" cy="6" r="4.5" fill="#f4f1d0"/><circle cx="208" cy="4.6" r="3.8" fill="#0b1430"/>${[[50, 5], [90, 3], [140, 6], [170, 3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#fff"/>`).join('')}</g>
      <g class="pg-cloud"><rect width="240" height="14" fill="#8d99a8"/><ellipse cx="60" cy="5" rx="38" ry="8" fill="#7d8896"/><ellipse cx="170" cy="4" rx="46" ry="8" fill="#86919f"/></g>
      <!-- maison : enduit clair, toit plat, baie vitrée coulissante, fenêtres, appliques -->
      <rect x="0" y="16" width="240" height="${GY - 16}" fill="#e9e3d6"/><rect x="0" y="${GY - 6}" width="240" height="6" fill="#cfc7b6"/>
      <rect x="-2" y="10" width="244" height="8" fill="#3a3f46"/><rect x="-2" y="10" width="244" height="1.5" fill="#5b626b"/>
      <rect x="88" y="50" width="92" height="${GY - 56}" fill="#2b3036"/>
      <rect x="91" y="53" width="41" height="${GY - 62}" fill="url(#ID-awglass)"/><rect x="136" y="53" width="41" height="${GY - 62}" fill="url(#ID-awglass)"/>
      <path d="M95 ${GY - 12}l16 -${GY - 70}h9l-16 ${GY - 70}zM140 ${GY - 12}l14 -${GY - 70}h6l-14 ${GY - 70}z" fill="#fff" opacity=".13"/>
      <rect x="14" y="60" width="46" height="40" fill="#f6f3ec" stroke="#cfc7b6" stroke-width=".8"/><rect x="17" y="63" width="40" height="34" fill="url(#ID-awglass)"/><path d="M37 63v34M17 80h40" stroke="#f6f3ec" stroke-width="1.6"/>
      <rect x="196" y="60" width="30" height="40" fill="#f6f3ec" stroke="#cfc7b6" stroke-width=".8"/><rect x="199" y="63" width="24" height="34" fill="url(#ID-awglass)"/><path d="M211 63v34" stroke="#f6f3ec" stroke-width="1.6"/>
      <g class="night"><rect x="91" y="53" width="41" height="${GY - 62}" fill="url(#ID-awwarm)" opacity=".85"/><rect x="136" y="53" width="41" height="${GY - 62}" fill="url(#ID-awwarm)" opacity=".85"/>
        <rect x="17" y="63" width="40" height="34" fill="url(#ID-awwarm)" opacity=".8"/><rect x="199" y="63" width="24" height="34" fill="url(#ID-awwarm)" opacity=".8"/></g>
      ${lantern(76, 84)}${lantern(192, 84)}
      <!-- terrasse en bois, pelouse, salon de jardin -->
      <rect x="0" y="${GY}" width="240" height="${180 - GY}" fill="#6fae58"/>
      <path d="M0 ${GY + 38}H240V180H0Z" fill="#5ea552" opacity=".55"/>
      <polygon points="0,${GY} 240,${GY} 240,${GY + 40} 0,${GY + 40}" fill="#b88a5c"/>${planks}
      <rect x="0" y="${GY + 40}" width="240" height="3" fill="#8f6a40"/>
      <g transform="translate(0 6)"><ellipse cx="120" cy="${GY + 28}" rx="30" ry="3.5" fill="#000" opacity=".16"/>
        ${chair(84, GY + 22, 1)}${chair(156, GY + 22, -1)}${chair(103, GY + 29, 1)}${chair(137, GY + 29, -1)}
        <rect x="118.4" y="${GY + 9}" width="3.2" height="17" fill="#cfc8b8"/><ellipse cx="120" cy="${GY + 26.5}" rx="9" ry="1.8" fill="#cfc8b8"/>
        <ellipse cx="120" cy="${GY + 9}" rx="24" ry="5.4" fill="#efece6" stroke="#cfc8b8" stroke-width=".6"/></g>
      <g transform="translate(212 ${GY - 12})"><path d="M-5 8h10l-1.4 12h-7.2z" fill="#5b5f66"/><circle cx="0" cy="2" r="8" fill="#5f8a55"/><circle cx="-3.5" cy="-2" r="4.5" fill="#6f9c63"/><circle cx="4.5" cy="-1.5" r="4.5" fill="#557d4c"/></g>
      <g clip-path="url(#ID-awg)"><g class="aw-shadow" fill="#000"></g></g>
      <rect class="pg-dim" x="0" y="0" width="240" height="180" fill="#0a1020"/>
      <g class="night"><circle cx="76" cy="80.5" r="6" fill="#ffcf6a" opacity=".45"/><circle cx="192" cy="80.5" r="6" fill="#ffcf6a" opacity=".45"/></g>
      <!-- caisson du store, toile et bras (redessinés par awDyn) -->
      <g class="aw-wind" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".0"><path d="M2 54q14 -5 30 0t26 -2"/><path d="M0 70q12 -4 24 0t22 -2"/><path d="M4 86q10 -3 20 0t18 -1"/></g>
      <g class="aw-dyn"></g>
      <rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="13" rx="3.2" fill="#3b4047"/><rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="13" rx="3.2" fill="url(#shrelief)"/>
      <rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="2" rx="1" fill="#fff" opacity=".28"/>
      <rect x="${BL[0] - 9}" y="24" width="5" height="17" rx="1.6" fill="#2c3136"/><rect x="${BR[0] + 4}" y="24" width="5" height="17" rx="1.6" fill="#2c3136"/>
      <g class="aw-leds"></g>
      <g class="pg-drops" stroke="#dfeeff" stroke-width="1" opacity=".8">${drops}</g>
      <circle class="led" cx="${BR[0] + 10}" cy="32" r="1.9"/>${ARROW(BR[0] + 6, 58)}`;
  };

  /* ---- fenêtre de toit : pan de toit en tuiles, ouvrant à rotation (transform posé par JS), volet roulant extérieur ---- */
  const RW = { X: 58, Y: 40, W: 84, H: 96 };
  // ouvrant pour une ouverture a (0 à 100) : il pivote sur son axe médian, le bas sort vers l'extérieur
  const rwSash = (a) => {
    const { X, Y, W, H } = RW, ang = a / 100 * .9, cx = X + W / 2, cy = Y + H / 2;
    return `translate(0 ${(Math.sin(ang) * H * .22).toFixed(1)}) translate(${cx} ${cy}) scale(1 ${Math.cos(ang).toFixed(3)}) translate(${-cx} ${-cy})`;
  };
  const ROOF = () => {
    const { X, Y, W, H } = RW;
    // rangs de tuiles de plus en plus serrés vers le faîtage (effet de pente)
    const rows = []; let y = 26; for (let r = 0; r < 12; r++) { const h = 6 + r * 1.25; rows.push([y, h]); y += h; }
    const tiles = rows.map(([y, h], r) => {
      const w = 10 + r * .9, o = (r % 2) * w / 2; let d = '';
      for (let x = -w; x < 210; x += w) d += `M${(x + o).toFixed(1)} ${(y + h).toFixed(1)}q${(w / 2).toFixed(1)} ${(-h * .5).toFixed(1)} ${w.toFixed(1)} 0`;
      return `<path d="M0 ${y.toFixed(1)}h200" stroke="#8f3f2c" stroke-width=".5" opacity=".6"/><path d="${d}" stroke="#8f3f2c" stroke-width="1.1" fill="none"/>`;
    }).join('');
    const drops = [...Array(28)].map((_, k) => { const x = (k * 37.3) % 210, y = (k * 23) % 60; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    return `<defs><linearGradient id="rwtile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0573c"/><stop offset="1" stop-color="#a94a33"/></linearGradient>
      <linearGradient id="rwrefl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9d6f5"/><stop offset=".5" stop-color="#e6f4fd"/><stop offset="1" stop-color="#7fb8e3"/></linearGradient>
      <clipPath id="rwclip"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath></defs>
      <g class="day"><rect width="200" height="172" fill="url(#shskyd)"/><g class="pg-sun"><circle cx="24" cy="10" r="7" fill="#ffd54a"/></g></g>
      <g class="night"><rect width="200" height="172" fill="url(#shskyn)"/><circle cx="130" cy="9" r="4.5" fill="#f4f1d0"/><circle cx="132" cy="7.6" r="3.8" fill="#0b1430"/></g>
      <g class="pg-cloud"><rect width="200" height="22" fill="#8d99a8"/><ellipse cx="60" cy="8" rx="36" ry="8" fill="#7d8896"/><ellipse cx="140" cy="6" rx="40" ry="8" fill="#86919f"/></g>
      <rect y="22" width="200" height="150" fill="url(#rwtile)"/>${tiles}
      <rect y="18" width="200" height="6" fill="#7d3524"/><path d="M0 18h200" stroke="#5a2a1d" stroke-width="1.2"/>
      <rect x="160" y="2" width="16" height="20" fill="#b9ad9c"/><rect x="158" y="0" width="20" height="4" fill="#9a8f80"/>
      <rect x="0" y="164" width="200" height="8" fill="#d6dadf"/><rect x="0" y="164" width="200" height="2" fill="#f1f3f5"/>
      <rect class="pg-dim" x="0" y="0" width="200" height="172" fill="#0a1020"/>
      <rect x="${X - 10}" y="${Y - 10}" width="${W + 20}" height="${H + 18}" rx="2" fill="#3e444c"/>
      <rect x="${X - 6}" y="${Y - 6}" width="${W + 12}" height="${H + 10}" rx="1.5" fill="#575e67"/>
      <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#2a2f35"/>
      <g clip-path="url(#rwclip)"><rect class="rw-in" x="${X}" y="${Y}" width="${W}" height="${H}" fill="#4a3d33"/><rect class="rw-in rw-in2" x="${X}" y="${Y + H * .55}" width="${W}" height="${H * .45}" fill="#33291f"/>
        <!-- pièce vue par l'ouverture : plafond en pente et suspension allumée, pour ne pas confondre avec un store -->
        <path d="M${X} ${Y}h${W}l-${W * .18} ${H * .2}h-${W * .64}z" fill="#000" opacity=".25"/>
        <path d="M${X + W / 2} ${Y + H * .2}v${H * .12}" stroke="#1d1814" stroke-width="1"/><circle cx="${X + W / 2}" cy="${Y + H * .36}" r="7" fill="#ffd98a" opacity=".35"/><path d="M${X + W / 2 - 5} ${Y + H * .36}h10l-2 -4h-6z" fill="#ffcf7a"/></g>
      <g class="rw-sash">
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="var(--sc)"/>
        <rect x="${X + 4}" y="${Y + 4}" width="${W - 8}" height="${H - 8}" fill="url(#rwrefl)"/>
        <rect class="night" x="${X + 4}" y="${Y + 4}" width="${W - 8}" height="${H - 8}" fill="#1b2a55"/>
        <path d="M${X + 10} ${Y + H - 10}L${X + W - 30} ${Y + 8}h12L${X + 20} ${Y + H - 10}z" fill="#fff" opacity=".35"/>
        <rect x="${X}" y="${Y}" width="${W}" height="7" fill="#3e444c"/><rect x="${X + W / 2 - 12}" y="${Y + 1.5}" width="24" height="3" rx="1.5" fill="#22262b"/>
        <rect x="${X}" y="${Y + H - 3}" width="${W}" height="3" fill="#7b838d"/>
      </g>
      <g clip-path="url(#rwclip)"><g class="rw-blind">${[...Array(16)].map((_, k) => `<rect x="${X}" y="${Y + k * 6}" width="${W}" height="6" fill="#3a3f46" stroke="#22262b" stroke-width=".5"/>`).join('')}</g></g>
      <rect x="${X - 10}" y="${Y - 14}" width="${W + 20}" height="8" rx="2" fill="#3e444c"/>
      <circle class="led" cx="${X + W + 4}" cy="${Y - 10}" r="1.8"/>
      <g class="pg-drops" stroke="#e7f2ff" stroke-width="1" opacity=".85">${drops}</g>
      ${ARROW(X + W / 2, Y + H + 20)}`;
  };

  // couleur du tablier / des lamelles / des vantaux par défaut, et motifs de nom pour l'éditeur
  const KINDS = {
    sliding_curtain: { color: '#b6a997', re: /curtain|drape|rideau|vorhang|cortina|tenda|gordijn/i, icon: 'mdi:curtains' },
    roller_shutter: { color: '#d5dbe1', re: /volet|shutter|roll|rollo|store/i, icon: 'mdi:window-shutter' },
    venetian_blind: { color: '#ece2cf', re: /venitien|vénitien|venetian|blind|jalousie|lamel|store/i, icon: 'mdi:blinds-horizontal' },
    swing_shutter: { color: '#4f7d5c', re: /volet|shutter|battant|persienne|swing/i, icon: 'mdi:window-shutter-open' },
    pergola: { color: '#d5dae0', re: /pergola|bioclim|lame|louvre|lamelle/i, icon: 'mdi:pergola' },
    awning: { color: '#b3a086', re: /store_banne|banne|awning|markise|toldo|tenda|luifel|markiza|markyza|store/i, icon: 'mdi:awning-outline' },
    roof_window: { color: '#4b525b', re: /velux|fenetre_toit|fenetre_de_toit|roof|skylight|dachfenster|tabatiere|fakro/i, icon: 'mdi:window-open-variant' },
  };
  const TILES = [['position', 'mdi:arrow-expand-vertical', 'show_position'], ['tilt', 'mdi:rotate-3d-variant', 'show_tilt'],
    ['power', 'mdi:flash', 'show_power'], ['blind', 'mdi:window-shutter', 'show_blind'], ['rain', 'mdi:weather-pouring', 'show_rain'], ['wind', 'mdi:weather-windy', 'show_wind'], ['lux', 'mdi:white-balance-sunny', 'show_lux'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['since', 'mdi:history', 'show_since']];

  class ApplianceShutterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_position: true, show_tilt: true, show_power: true, show_since: true,
        show_rain: true, show_wind: true, show_blind: true, show_lux: true, show_temperature: true, sun_entity: 'sun.sun', ...c };
      // volet extérieur = la fenêtre elle-même : sans objet, on l'ignore (sinon bouton et tuile « Volet » en double)
      if (this._c.entity_blind && this._c.entity_blind === this._c.entity) delete this._c.entity_blind;
      // fenêtre de toit sans ouvrant motorisé, seulement un volet roulant (Velux solaire…) : les commandes pilotent le volet
      this._blindOnly = this.kind === 'roof_window' && !this._c.entity && !!this._c.entity_blind;
      // store vénitien « inclinaison seule » : ni montée ni descente, seulement l'angle des lames (curseur + préréglages)
      // tilt_from_position : moteur ordinaire (sans fonction d'inclinaison) branché sur le cordon d'inclinaison (Aqara E1…) :
      // la position de la cover (0-100) sert d'angle des lames ; implique l'inclinaison seule
      this._tiltFromPos = this.kind === 'venetian_blind' && !!this._c.tilt_from_position;
      this._tiltOnly = this.kind === 'venetian_blind' && (!!this._c.tilt_only || this._tiltFromPos);
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) {
      // pergola : libellés au féminin (« Ouverte », « Fermée ») et « Lames » au lieu de « Position »
      const L = T[this._lang()], pre = { pergola: 'pg_', roof_window: 'rw_', awning: 'aw_' }[this.kind], pk = pre ? `${pre}${k}` : null;
      return (pk && (L[pk] ?? T.en[pk])) ?? L[k] ?? T.en[k] ?? k;
    }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { const v = this._num(id); return /^kw$/i.test(this._unit(id, 'W')) ? v * 1000 : v; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    // vitesse du vent en km/h, quelle que soit l'unité du capteur (m/s, mph, nœuds)
    _windKmh() {
      const id = this._c.entity_wind, v = this._num(id); if (isNaN(v)) return NaN;
      const u = String(this._unit(id, 'km/h')).toLowerCase().replace(/\s/g, '');
      return /^(m\/s|ms)$/.test(u) ? v * 3.6 : /mph|mi\/h/.test(u) ? v * 1.609 : /^(kn|kt|kts|knots?)$/.test(u) ? v * 1.852 : v;
    }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      // durée courte (« 12 min », « 3 h ») : la tuile s'appelle déjà « Depuis » ; « maintenant » sous 45 s
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const swing = this.kind === 'swing_shutter', pergola = this.kind === 'pergola', roof = this.kind === 'roof_window', awning = this.kind === 'awning', curtain = this.kind === 'sliding_curtain';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        <div class="scene${swing ? ' sw' : pergola || awning ? ' pg' : ''}"><svg viewBox="${pergola || awning ? '0 0 240 180' : '0 0 200 172'}" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${pergola ? PERGOLA() : awning ? AWNING() : roof ? ROOF() : SVGS[this.kind]()}</svg>
          ${swing ? `<div class="leaf l mv">${LEAF(false)}</div><div class="leaf r mv">${LEAF(true)}</div>` : ''}</div>
        <div class="rng ps" id="shpos"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="rng tl" id="shtilt"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="ctl" id="shpre">${this._tiltPresets().map((v) => `<button data-tilt="${v}"><span>${v} %</span></button>`).join('')}</div>
        <div class="ctl" id="shtbt">
          <button data-k="open" data-a="open_cover_tilt"><ha-icon icon="mdi:blinds-open"></ha-icon><span></span></button>
          <button data-k="stop" data-a="stop_cover_tilt"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-k="close" data-a="close_cover_tilt"><ha-icon icon="mdi:blinds-horizontal-closed"></ha-icon><span></span></button>
        </div>
        <div class="ctl" id="shctl">
          <button data-a="open"><ha-icon icon="${curtain ? 'mdi:arrow-expand-horizontal' : awning ? 'mdi:arrow-expand-down' : 'mdi:arrow-up'}"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="${curtain ? 'mdi:arrow-collapse-horizontal' : awning ? 'mdi:arrow-collapse-up' : 'mdi:arrow-down'}"></ha-icon><span></span></button>
          ${pergola || awning ? '<button data-a="light"><ha-icon icon="mdi:led-strip-variant"></ha-icon><span></span></button>' : ''}
          ${roof ? '<button data-a="blind"><ha-icon icon="mdi:window-shutter"></ha-icon><span></span></button>' : ''}
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${curtain && k === 'position' ? 'mdi:arrow-expand-horizontal' : ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      if (curtain) root.getElementById('shctl').after(root.getElementById('shpos'));
      window.applianceBindIllus(this, root.querySelector('.scene'), () => this._more(this._main()));
      root.querySelectorAll('#shctl button').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.a === 'blind') {
          const id = this._c.entity_blind; if (!this._hass || !id) return;
          this._hass.callService('cover', this._blindDown > 0 ? 'open_cover' : 'close_cover', { entity_id: id }); return;
        }
        if (b.dataset.a === 'light') { if (this._hass && this._c.entity_light) this._hass.callService('homeassistant', 'toggle', { entity_id: this._c.entity_light }); return; }
        if (this._hass && this._main()) {
          // invert_buttons : moteur câblé à l'envers, « Ouvrir » ferme la cover et inversement (le dessin et la position ne changent pas)
          const a = this._c.invert_buttons ? { open: 'close', close: 'open' }[b.dataset.a] || b.dataset.a : b.dataset.a;
          this._hass.callService('cover', `${a}_cover`, { entity_id: this._main() });
        }
      }));
      root.querySelector('#shpos input').addEventListener('change', (e) => {
        if (!this._hass) return;
        const v = this._c.invert ? 100 - Number(e.target.value) : Number(e.target.value);
        // pergola pilotée par l'inclinaison des lames
        if (this._tiltDriven) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: v });
        else this._hass.callService('cover', 'set_cover_position', { entity_id: this._main(), position: this._blindOnly ? Number(e.target.value) : v });
      });
      // préréglages d'inclinaison (0 % = lames fermées, 50 % = mi-ouvertes, 100 % = refermées dans l'autre sens)
      root.querySelectorAll('#shpre button').forEach((b) => b.addEventListener('click', () => {
        this._setTilt(Number(b.dataset.tilt));
      }));
      // cover sans set_cover_tilt_position : commandes d'inclinaison ouvrir / stop / fermer
      root.querySelectorAll('#shtbt button').forEach((b) => b.addEventListener('click', () => {
        // angle porté par la position : ouvrir / stop / fermer la cover elle-même
        if (this._hass) this._hass.callService('cover', this._tiltFromPos ? `${b.dataset.k}_cover` : b.dataset.a, { entity_id: this._c.entity });
      }));
      root.querySelector('#shtilt input').addEventListener('change', (e) => {
        this._setTilt(Number(e.target.value));
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more({ position: this._c.entity_position, power: this._c.entity_power, rain: this._c.entity_rain, wind: this._c.entity_wind, blind: this._c.entity_blind, lux: this._c.entity_lux, temperature: this._c.entity_temperature }[k] || this._c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._pos = null; this._ang = null;
    }

    // règle l'angle des lames : set_cover_tilt_position, ou set_cover_position quand l'angle est porté par la position (invert respecté)
    _setTilt(v) {
      if (!this._hass) return;
      if (this._tiltFromPos) this._hass.callService('cover', 'set_cover_position', { entity_id: this._c.entity, position: this._c.invert ? 100 - v : v });
      else this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: v });
    }

    // valeurs des boutons d'inclinaison : option tilt_presets (nombres 0-100), sinon 0 / 25 / 50 / 75 / 100
    _tiltPresets() {
      const l = Array.isArray(this._c.tilt_presets) ? this._c.tilt_presets.map(Number).filter((n) => isFinite(n)).map((n) => Math.max(0, Math.min(100, Math.round(n)))) : [];
      return l.length ? [...new Set(l)] : [0, 25, 50, 75, 100];
    }

    // entité pilotée par les boutons et le curseur : l'ouvrant, ou le volet en mode « volet seul »
    _main() { return this._c.entity || (this._blindOnly ? this._c.entity_blind : ''); }

    _compute() {
      const c = this._c;
      if (this._blindOnly) {
        // fenêtre dessinée fermée ; l'état affiché est celui du volet (voir _render)
        const b = this._st(c.entity_blind), ok = !!b && !/^(unavailable|unknown)$/i.test(String(b.state));
        this._tiltDriven = false;
        return { st: ok ? 'closed' : 'unavailable', pos: 0, known: true, tilt: NaN, s: b };
      }
      const s = this._st(c.entity);
      let st = 'unavailable', pos = NaN, tilt = NaN;
      // unknown : HA ne connaît pas l'état (ex. après redémarrage), mais la cover reste pilotable
      if (s && /^unknown$/i.test(String(s.state))) {
        st = 'unknown';
      } else if (s && !/^(unavailable|unknown)$/i.test(String(s.state))) {
        const v = String(s.state).toLowerCase(), a = s.attributes || {};
        st = ['open', 'closed', 'opening', 'closing'].includes(v) ? v : /^(on|true|1)$/.test(v) ? 'open' : 'closed';
        if (a.current_position != null && isFinite(Number(a.current_position))) pos = Math.max(0, Math.min(100, Number(a.current_position)));
        if (a.current_tilt_position != null && isFinite(Number(a.current_tilt_position))) tilt = Math.max(0, Math.min(100, Number(a.current_tilt_position)));
      }
      // capteurs externes (cover sans retour d'état natif) : entity_position (0-100) remplace current_position,
      // entity_state (binary_sensor contact : on = ouvert, off = fermé ; ou cover / sensor open|closed) remplace l'état.
      // Un mouvement annoncé par la cover (opening / closing) reste prioritaire.
      const es = this._st(c.entity_state), ev = es ? String(es.state).toLowerCase() : '', epv = this._num(c.entity_position);
      let sensed = false;
      if (!isNaN(epv)) { pos = Math.max(0, Math.min(100, epv)); sensed = true; }
      if (/^(on|true|1|open|opened|opening|unlocked)$/.test(ev) || /^(off|false|0|closed|closing|locked)$/.test(ev)) {
        sensed = true;
        if (st !== 'opening' && st !== 'closing') st = /^(on|true|1|open|opened|opening|unlocked)$/.test(ev) ? (ev === 'opening' ? 'opening' : 'open') : (ev === 'closing' ? 'closing' : 'closed');
      } else if (!isNaN(epv) && st !== 'opening' && st !== 'closing') {
        st = pos > 0 ? 'open' : 'closed'; // position seule : l'état en découle
      }
      if (!isNaN(epv) && st === 'closed' && pos > 0) st = 'open'; // capteurs contradictoires : la position prime
      if (!isNaN(epv) && st === 'open' && pos <= 0) st = 'closed';
      // pergola : l'angle des lames est dans current_tilt_position si la cover le donne, sinon dans current_position
      this._tiltDriven = this.kind === 'pergola' && !isNaN(tilt);
      if (this._tiltDriven) { pos = tilt; if (st === 'closed' && pos > 0) st = 'open'; }
      const known = !isNaN(pos); // position réelle fournie par la cover
      // invert : cover qui remonte sa position à l'envers (fréquent avec Tuya), 0 = ouvert et 100 = fermé.
      // L'état HA en découle et est donc faux lui aussi : on le recalcule depuis la position corrigée.
      if (c.invert && st !== 'unavailable' && st !== 'unknown') {
        if (st === 'opening' || st === 'closing') st = st === 'opening' ? 'closing' : 'opening';
        else if (known) st = 'open';
        else st = st === 'open' ? 'closed' : 'open';
        if (known) pos = 100 - pos;
      }
      if (!known) pos = st === 'open' || st === 'opening' ? 100 : 0;
      else if (st === 'open' && pos < 100) st = pos > 0 ? 'partial' : 'closed';
      // angle des lames porté par la position de la cover (tilt_from_position)
      if (this._tiltFromPos && st !== 'unavailable') tilt = pos;
      return { st, pos, known, tilt, s: s || es, sensed };
    }

    // pergola : fait pivoter les lames de l'angle affiché vers la cible en dur secondes
    _tween(to, dur, linear) {
      const from = this._ang == null ? to : this._ang, t0 = performance.now(), card = this._card;
      cancelAnimationFrame(this._raf);
      const draw = (a) => {
        this._ang = a;
        if (this.kind === 'roof_window') { this._root.querySelector('.rw-sash').setAttribute('transform', rwSash(a)); return; }
        if (this.kind === 'awning') {
          const [dyn, sh, led] = awDyn(a, this._awTilt);
          this._root.querySelector('.aw-dyn').innerHTML = dyn;
          this._root.querySelector('.aw-shadow').innerHTML = sh;
          this._root.querySelector('.aw-leds').innerHTML = led;
          card.style.setProperty('--a', a.toFixed(1));
          return;
        }
        const [bl, sh] = pgBlades(a);
        this._root.querySelector('.pg-blades').innerHTML = bl;
        this._root.querySelector('.pg-shadow').innerHTML = sh;
        card.style.setProperty('--a', a.toFixed(1));
      };
      if (!(dur > 0) || from === to) { draw(to); return; }
      const step = (now) => {
        const k = Math.min(1, (now - t0) / (dur * 1000)), e = linear ? k : k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        draw(from + (to - from) * e);
        if (k < 1) this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pos, known, tilt, s, sensed } = this._compute();
      const sun = this._st(c.sun_entity), night = !!sun && sun.state === 'below_horizon';
      const rainS = this._st(c.entity_rain), rain = !!rainS && (/^(on|true|wet|rain|pluie|raining)$/i.test(String(rainS.state)) || this._num(c.entity_rain) > 0);
      const lightS = this._st(c.entity_light), leds = !!lightS && /^on$/i.test(String(lightS.state));
      const wk = this.kind === 'awning' ? this._windKmh() : NaN, windy = !isNaN(wk) && wk >= (Number(c.wind_max) > 0 ? Number(c.wind_max) : 40);
      card.className = `${st}${windy ? ' windy' : ''}${night ? ' isnight' : ''}${c.animations === false ? ' noanim' : ''}${this._tiltOnly ? ' tonly' : ''}${rain ? ' rain' : ''}${leds ? ' leds' : ''}`;
      const blS = this._st(c.entity_blind), blA = (blS && blS.attributes) || {};
      const blPos = blS ? (isFinite(Number(blA.current_position)) && blA.current_position != null ? Number(blA.current_position) : /^(closed|closing)$/i.test(blS.state) ? 0 : 100) : 100;
      this._blindDown = 100 - Math.max(0, Math.min(100, blPos));
      card.style.setProperty('--bl', String(this._blindDown));

      // course : durée proportionnelle à l'écart si travel_time est donné, sinon 1,2 s
      if (pos !== this._pos) {
        const tt = Number(c.travel_time);
        const dur = this._pos == null ? 0 : tt > 0 ? Math.abs(pos - this._pos) / 100 * tt : 1.2;
        card.style.setProperty('--sh-d', `${dur.toFixed(2)}s`);
        // avec un temps de course, la cover envoie sa position par paliers : mouvement linéaire pour enchaîner sans à-coups
        card.style.setProperty('--sh-e', tt > 0 ? 'linear' : 'ease-in-out');
        if (this.kind === 'pergola' || this.kind === 'roof_window' || this.kind === 'awning') this._tween(pos, c.animations === false ? 0 : dur, tt > 0);
        this._pos = pos;
      }
      // store banne : l'inclinaison change l'angle de la toile, sans déplacer le store
      if (this.kind === 'awning') {
        const aw = isNaN(tilt) ? NaN : tilt;
        if (aw !== this._awTilt && !(isNaN(aw) && isNaN(this._awTilt))) { this._awTilt = aw; if (this._ang != null) this._tween(this._ang, 0); }
      }
      card.style.setProperty('--p', String(pos));
      card.style.setProperty('--t', String(isNaN(tilt) ? (st === 'closed' ? 0 : 100) : tilt));
      // lamelles vues de face : hauteur apparente = sin(angle depuis l'horizontale), 80° au maximum quand elles sont fermées
      const tv = isNaN(tilt) ? (st === 'closed' ? 0 : 50) : tilt, dev = Math.abs(tv - 50) / 50;
      card.style.setProperty('--sf', Math.max(.12, Math.sin(dev * 80 * Math.PI / 180)).toFixed(3));
      card.style.setProperty('--sd', tv > 50 ? (dev * .35).toFixed(3) : '0');
      card.style.setProperty('--sl', tv < 50 ? (dev * .25).toFixed(3) : '0');
      card.style.setProperty('--lt', String(Math.round((1 - dev) * 100)));
      card.style.setProperty('--sc', /^[#a-z0-9(),.\s%]+$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : KINDS[this.kind].color);

      const name = c.name || this._t(this.kind);
      r.getElementById('shtitle').textContent = name;
      const badge = r.getElementById('shbadge');
      const moving = st === 'opening' || st === 'closing';
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : moving && known ? `${this._t(st)}… ${Math.round(pos)} %` : this._t(st);
      if (this.kind === 'roof_window' && this._blindDown >= 100 && !moving && !this._blindOnly) badge.textContent += ` · ${this._t('blind_down')}`;
      if (windy && st !== 'unavailable') badge.textContent += ` · ${this._t('wind_alert')}`;
      // volet seul : le badge donne l'état du volet (libellés sans le préfixe rw_ de la fenêtre)
      // état du volet en mode « volet seul » ; ouvert à moins de 100 % = partiel, comme pour la fenêtre (Ouvrir et Fermer restent actifs)
      let bst = this._blindOnly && blS ? String(blS.state).toLowerCase() : st;
      if (this._blindOnly && bst === 'open' && blPos < 100) bst = blPos > 0 ? 'partial' : 'closed';
      if (this._blindOnly && st !== 'unavailable') {
        const g = (k) => (T[this._lang()] || T.en)[k] ?? T.en[k] ?? k;
        badge.textContent = this._blindDown >= 100 ? g('blind_down') : this._blindDown <= 0 && !/ing$/.test(bst) ? `${g('blind')} · ${g('open')}`
          : /ing$/.test(bst) ? `${g('blind')} · ${g(bst)}… ${Math.round(blPos)} %` : `${g('blind')} · ${g('partial')} ${Math.round(blPos)} %`;
      }
      badge.style.display = c.show_status === false || st === 'unknown' ? 'none' : '';

      // commandes et curseurs selon ce que la cover sait faire (supported_features)
      const isCover = this._main().startsWith('cover.');
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || !!(sf & bit);
      const assumed = !!(s && s.attributes && s.attributes.assumed_state === true);
      const posKnown = this._blindOnly ? blA.current_position != null && isFinite(Number(blA.current_position)) : known || sensed;
      const ctl = r.getElementById('shctl');
      ctl.classList.toggle('hide', c.show_controls === false || !isCover || this._tiltOnly);
      const tiltSet = this._tiltFromPos ? has(4) : has(128);
      const pre = r.getElementById('shpre');
      pre.classList.toggle('hide', !(this._tiltOnly && isCover && tiltSet && c.show_controls !== false));
      // sans set_cover_tilt_position, la carte ne reste pas vide : boutons ouvrir / stop / fermer l'inclinaison
      const tbt = r.getElementById('shtbt');
      tbt.classList.toggle('hide', !(this._tiltOnly && isCover && !tiltSet && c.show_controls !== false));
      tbt.querySelectorAll('button').forEach((b) => {
        b.querySelector('span').textContent = this._t(`btn_${b.dataset.k}`);
        b.classList.toggle('hide', b.dataset.k === 'stop' && !has(64));
        b.disabled = st === 'unavailable';
      });
      pre.querySelectorAll('button').forEach((b) => { b.classList.toggle('on', !isNaN(tilt) && Math.abs(tilt - Number(b.dataset.tilt)) <= 2); b.disabled = st === 'unavailable'; });
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', (a === 'stop' && !has(8)) || (a === 'light' && !c.entity_light) || (a === 'blind' && (!c.entity_blind || this._blindOnly)));
        if (a === 'blind') { b.classList.toggle('on', this._blindDown > 0); b.disabled = !blS; return; }
        if (a === 'light') { b.classList.toggle('on', leds); b.disabled = !lightS; return; }
        // assumed_state (RFXCOM, Somfy RTS…) : l'état est supposé, pas mesuré, donc on laisse tout cliquable comme la carte HA,
        // sauf si la cover remonte une position (current_position) : on s'y fie et on grise Ouvrir à 100 %, Fermer à 0 %
        // Avec un capteur externe (entity_state / entity_position), l'état affiché est l'état réel du store : on grise selon le bouton affiché.
        // Sans capteur, l'état vient de la cover, qui suit la commande envoyée : on grise selon l'action réellement envoyée.
        const ea = c.invert_buttons && !sensed ? { open: 'close', close: 'open' }[a] || a : a;
        b.disabled = st === 'unavailable' || ((!assumed || posKnown) && ((ea === 'open' && (bst === 'open' || bst === 'opening')) || (ea === 'close' && (bst === 'closed' || bst === 'closing'))));
      });
      const rng = (id, show, label, val) => {
        const el = r.getElementById(id), inp = el.querySelector('input');
        el.classList.toggle('hide', !show);
        el.querySelector('span').textContent = label;
        if (this._root.activeElement !== inp) inp.value = String(Math.round(val));
      };
      rng('shpos', isCover && !this._tiltOnly && known && (this._tiltDriven ? has(128) : has(4)) && c.show_slider !== false && st !== 'unavailable', this._blindOnly ? this._l('blind') : this._l('position'), this._blindOnly ? blPos : pos);
      // en inclinaison seule le curseur reste affiché même si la cover ne remonte pas current_tilt_position
      rng('shtilt', isCover && (this.kind === 'venetian_blind' || this.kind === 'awning') && (this._tiltOnly || !isNaN(tilt)) && (this._tiltOnly ? tiltSet : has(128)) && c.show_slider !== false && st !== 'unavailable', this._l('tilt'), isNaN(tilt) ? 0 : tilt);

      const pw = this._watts(c.entity_power);
      const V = {
        position: [known && st !== 'unavailable' && !this._blindOnly && !this._tiltOnly, this._fmt(pos, 0), '%'],
        tilt: [(this.kind === 'venetian_blind' || this.kind === 'awning') && !isNaN(tilt), this._fmt(tilt, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), isNaN(pw) ? '' : 'W'],
        blind: [this.kind === 'roof_window' && blS, this._fmt(blPos, 0), '%'],
        rain: [['pergola', 'roof_window', 'awning'].includes(this.kind) && rainS, this._t(rain ? 'yes' : 'no'), ''],
        wind: [(this.kind === 'pergola' || this.kind === 'awning') && c.entity_wind, this._fmt(this._num(c.entity_wind), 0), this._unit(c.entity_wind, 'km/h')],
        lux: [this.kind === 'awning' && c.entity_lux, this._fmt(this._num(c.entity_lux), 0), this._unit(c.entity_lux, 'lx')],
        temperature: [this.kind === 'awning' && c.entity_temperature, this._fmt(this._num(c.entity_temperature), 1), this._unit(c.entity_temperature, '°C')],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', k === 'wind' && windy);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceShutterCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          this._c = e.detail.value;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', 'cover'), ent('entity_state'), ent('entity_position', 'sensor'), ent('entity_power', 'sensor'), ent('sun_entity', 'sun'),
        ...(this.kind === 'pergola' ? [ent('entity_rain'), ent('entity_light'), ent('entity_wind', 'sensor')] : []),
        ...(this.kind === 'awning' ? [ent('entity_wind', 'sensor'), ent('entity_rain'), ent('entity_light'), ent('entity_lux', 'sensor'), ent('entity_temperature', 'sensor'),
          { name: 'wind_max', selector: { number: { min: 5, max: 120, step: 1, mode: 'box', unit_of_measurement: 'km/h' } } }] : []),
        ...(this.kind === 'roof_window' ? [ent('entity_blind', 'cover'), ent('entity_rain')] : []),
        { type: 'grid', name: '', schema: [
          { name: 'color', selector: { text: {} } },
          { name: 'travel_time', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
        ] },
        bool('invert', false),
        bool('invert_buttons', false),
        ...(this.kind === 'venetian_blind' ? [bool('tilt_only', false), bool('tilt_from_position', false), { name: 'tilt_presets', selector: { object: {} } }] : []),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_position'),
          ...(this.kind === 'venetian_blind' || this.kind === 'awning' ? [bool('show_tilt')] : []), bool('show_power'),
          ...(this.kind === 'pergola' ? [bool('show_rain'), bool('show_wind')] : []),
          ...(this.kind === 'awning' ? [bool('show_rain'), bool('show_wind'), bool('show_lux'), bool('show_temperature')] : []),
          ...(this.kind === 'roof_window' ? [bool('show_blind'), bool('show_rain')] : []), bool('show_since'), bool('animations'),
        ] },
      ];
      // « color » a le libellé « couleur de la lumière » pour les lampes : ici, couleur du volet
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'color' ? (this.kind === 'pergola' ? 'louvre_color' : this.kind === 'awning' || this.kind === 'sliding_curtain' ? 'fabric_color' : 'shutter_color') : s.name === 'invert' ? 'invert_position' : s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace(/_/g, '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceShutterCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        return { entity: ids.find((i) => i.startsWith('cover.') && K.re.test(i)) || ids.find((i) => i.startsWith('cover.')) || '' };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceShutterCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l][kind]])), preview: true,
      description: kind === 'sliding_curtain' ? `Animated sliding curtains: two fabric panels, open / stop / close controls, position, and day / night view.` : kind === 'awning' ? `${T.fr[kind]} animé : toile qui se déploie, bras articulés, ombre sur la terrasse, vent fort, pluie, éclairage LED et vue jour / nuit.` : kind === 'roof_window' ? `${T.fr[kind]} animée : ouvrant à rotation, volet roulant extérieur, pluie et vue jour / nuit.` : kind === 'pergola' ? `${T.fr[kind]} animée : lames orientables, pluie, éclairage LED et vue jour / nuit.` : `${T.fr[kind]} animé : position, inclinaison, mouvement et vue jour / nuit.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
