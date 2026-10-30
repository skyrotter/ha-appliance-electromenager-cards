/* Cartes « Volets » — volet roulant, store vénitien, volets battants, pergola bioclimatique
 * custom:appliance-roller-shutter-card, appliance-venetian-blind-card, appliance-swing-shutter-card, appliance-pergola-card.
 * Une entité cover donne l'état (open, closed, opening, closing) ; current_position (0 fermé → 100 ouvert)
 * et current_tilt_position (store vénitien) pilotent le dessin par des variables CSS (--p, --t) dont
 * les transformations sont animées. La vue extérieure passe en nuit quand sun.sun est sous l'horizon.
 * Boutons ouvrir / stop / fermer, curseurs de position et d'inclinaison, puissance du moteur.
 * Pergola : les lames pivotent selon l'inclinaison (sinon la position), redessinées image par image ;
 * en option pluie (entity_rain), éclairage LED (entity_light) et vent (entity_wind).
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
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.rng{display:flex;align-items:center;gap:8px;margin:8px 2px 0;font-size:10px;color:var(--secondary-text-color)}
.rng.hide{display:none}
.rng span{min-width:56px}
.rng input{flex:1;accent-color:var(--sh-cold);margin:0;cursor:pointer}
.rng.tl input{accent-color:#c9a96b}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
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

/* ---- store vénitien : les lamelles se tassent en haut, s'inclinent (--t, 100 = à plat) ---- */
.lift{transform-box:view-box;transform-origin:100px 42px;transform:scaleY(calc(1 - var(--p) * .0092))}
.rail{transform:translateY(calc(var(--p) * -.94px))}
.sl{transform-box:fill-box;transform-origin:center;transform:scaleY(calc(1 - var(--t) * .0085));transition:transform 1.2s ease-in-out}
.vb .beam{opacity:calc(max(var(--p), var(--t) * .7) * .0022)}
.isnight .vb .beam{opacity:0}

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
.pg-candle{opacity:0}.isnight .pg-candle{opacity:1}.pg-candle circle{animation:pgflick 1.3s ease-in-out infinite}
@keyframes pgflick{50%{opacity:.6}}
.pg-drops line{animation:pgdrop .7s linear infinite}
.pg-drops line:nth-child(3n){animation-delay:-.23s}.pg-drops line:nth-child(3n+1){animation-delay:-.47s}
@keyframes pgdrop{from{transform:translate(0,-40px)}to{transform:translate(-8px,150px)}}
.pg-drain circle{animation:pgdrain 1.4s linear infinite}.pg-drain circle:nth-child(2){animation-delay:-.7s}
@keyframes pgdrain{from{transform:translateY(0);opacity:1}to{transform:translateY(80px);opacity:.3}}
.ctl button.on{background:color-mix(in srgb,#ffc94a 35%,var(--secondary-background-color))}
.noanim .pg-ray,.noanim .pg-candle circle,.noanim .pg-drops line,.noanim .pg-drain circle{animation:none}
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
  </defs>`;
  const ARROW = (x, y) => `<g class="arrow" transform="translate(${x} ${y})"><circle r="9" fill="#ff8a3d"/>
    <path class="up" d="M-4 2 L0 -3 L4 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="dn" d="M-4 -2 L0 3 L4 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;

  const X0 = 34, X1 = 166, Y0 = 36, Y1 = 146, W = X1 - X0, H = Y1 - Y0;
  const SVGS = {
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
      for (let y = Y0 + 8; y < Y1 - 4; y += 7) sl += `<g class="sl"><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="var(--sc)"/><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="url(#shrelief)"/></g>`;
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
  const PERGOLA = () => {
    const { BL, BR, FL, FR, H } = PG, floor = [[BL[0], BL[1] + H], [BR[0], BR[1] + H], [FR[0], FR[1] + H], [FL[0], FL[1] + H]];
    const post = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${H}" fill="url(#pgalu)"/>`;
    const rays = [.18, .38, .58, .78].map((k) => { const P = lerp(lerp(BL, FL, k), lerp(BR, FR, k), .35); return `<path class="pg-ray" d="M${P[0].toFixed(1)} ${P[1].toFixed(1)}l${PG.SX} ${H}h12l${-PG.SX} ${-H}z"/>`; }).join('');
    const drops = [...Array(30)].map((_, k) => { const x = (k * 37.3) % 250, y = (k * 23) % 40; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    return `<defs>
      <linearGradient id="pgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb2f0"/><stop offset="1" stop-color="#cfe9fb"/></linearGradient>
      <linearGradient id="pgwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe4d2"/><stop offset="1" stop-color="#e2d3bb"/></linearGradient>
      <linearGradient id="pgdeck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99f72"/><stop offset="1" stop-color="#b0855a"/></linearGradient>
      <linearGradient id="pgalu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d434b"/><stop offset=".5" stop-color="#5b626b"/><stop offset="1" stop-color="#2e3339"/></linearGradient>
      <radialGradient id="pgpool" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <clipPath id="pgfloor"><polygon points="${pts(floor)}"/></clipPath></defs>
      <g class="day"><rect width="240" height="180" fill="url(#pgsky)"/><g class="pg-sun"><circle cx="26" cy="6" r="10" fill="#ffe17a" opacity=".3"/><circle cx="26" cy="6" r="6" fill="#ffe17a"/></g></g>
      <g class="night"><rect width="240" height="180" fill="url(#shskyn)"/><circle cx="212" cy="6" r="4.5" fill="#f4f1d0"/><circle cx="214" cy="4.6" r="3.8" fill="#0b1430"/>
        ${[[50, 8], [80, 4], [130, 9], [165, 3], [110, 5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#fff"/>`).join('')}</g>
      <g class="pg-cloud"><rect width="240" height="16" fill="#8d99a8"/><ellipse cx="70" cy="5" rx="40" ry="7" fill="#7d8896"/><ellipse cx="170" cy="4" rx="48" ry="7" fill="#86919f"/></g>
      <rect x="0" y="22" width="240" height="${BL[1] + H - 22}" fill="url(#pgwall)"/>
      <rect x="0" y="22" width="240" height="5" fill="#000" opacity=".08"/>
      <polygon points="-6,25 246,25 238,11 2,11" fill="#a9503a"/>
      ${[14, 17.5, 21].map((y) => `<path d="M0 ${y}H240" stroke="#7f3a28" stroke-width=".8"/>`).join('')}
      ${[...Array(30)].map((_, k) => `<path d="M${k * 8.4 + ((k % 2) * 4)} 11v14" stroke="#8a412e" stroke-width=".5" opacity=".7"/>`).join('')}
      <polygon points="-6,25 246,25 238,11 2,11" fill="url(#shrelief)" opacity=".6"/>
      <rect x="-2" y="24.5" width="244" height="3.2" rx="1.5" fill="#c3c9cf"/><rect x="-2" y="26.6" width="244" height="1.1" fill="#8d959d"/>
      <rect x="226" y="27" width="3" height="${BL[1] + H - 27}" fill="#b9c0c7"/>
      <rect x="104" y="60" width="44" height="58" fill="#5d7690"/>
      <rect x="0" y="${BL[1] + H}" width="240" height="70" fill="#79b35c"/>
      <polygon points="${pts([[BL[0] - 14, BL[1] + H], [BR[0] + 14, BR[1] + H], [FR[0] + 10, FR[1] + H + 8], [FL[0] - 14, FL[1] + H + 8]])}" fill="url(#pgdeck)"/>
      <g clip-path="url(#pgfloor)"><g class="pg-shadow" fill="#000"></g></g>
      ${post(BL[0], BL[1], 6)}${post(BR[0], BR[1], 6)}
      <path d="M70 140l12-12h88l14 12z" fill="#e8dcc6" opacity=".9"/><path d="M70 140l12-12h88l14 12z" fill="none" stroke="#cdbb9c" stroke-width="1" stroke-dasharray="3 2"/>
      <rect x="84" y="111" width="74" height="16" rx="4" fill="#3b4048"/>
      <rect x="88" y="113" width="22" height="13" rx="3" fill="#ece6da"/><rect x="110" y="113" width="22" height="13" rx="3" fill="#e6dfd1"/><rect x="132" y="113" width="22" height="13" rx="3" fill="#ece6da"/>
      <rect x="82" y="124" width="78" height="9" rx="2.5" fill="#3b4048"/><rect x="88" y="122" width="66" height="6" rx="2.5" fill="#f4efe5"/>
      <path d="M110 122.2v5.6M132 122.2v5.6" stroke="#d8cfbd" stroke-width=".6"/>
      <rect x="80" y="114" width="7" height="19" rx="2.5" fill="#454b54"/><rect x="155" y="114" width="7" height="19" rx="2.5" fill="#454b54"/>
      <rect x="83" y="133" width="2.4" height="3" fill="#2b2f35"/><rect x="157" y="133" width="2.4" height="3" fill="#2b2f35"/>
      <path d="M91 121q-1-7 6-8q6 1 5 8z" fill="#d9774a"/><path d="M140 121q-1-7 6-8q7 1 5 8z" fill="#5aa39b"/><path d="M146 121q0-6 5-6q5 1 3 6z" fill="#e7b54a"/>
      <ellipse cx="121" cy="146" rx="22" ry="2.4" fill="#000" opacity=".18"/>
      <rect x="100" y="136" width="42" height="5" rx="1.5" fill="#a4774b"/><rect x="100" y="136" width="42" height="1.6" rx="1" fill="#c39566"/>
      <rect x="103" y="141" width="2.4" height="5" fill="#7a5532"/><rect x="137" y="141" width="2.4" height="5" fill="#7a5532"/>
      <path d="M110 136l1.5-6h7l1.5 6z" fill="#c9673f"/>
      <path d="M115 130q-6-6-3-12q4 4 3 12zM115 130q5-7 9-9q-1 6-9 9zM115 130q-1-9 2-13q2 6-2 13z" fill="#4f9a55"/>
      <rect x="128" y="132" width="4" height="4" rx=".6" fill="#f3efe6"/>
      <rect class="pg-dim" x="0" y="11" width="240" height="169" fill="#0a1020"/>
      <rect class="night" x="104" y="60" width="44" height="58" fill="#ffcf7a" opacity=".75"/>
      <rect x="104" y="60" width="44" height="58" fill="none" stroke="#fff" stroke-width="2"/><path d="M126 60v58" stroke="#fff" stroke-width="1.5"/>
      <g clip-path="url(#pgfloor)"><ellipse class="pg-pool" cx="122" cy="135" rx="90" ry="28" fill="url(#pgpool)"/></g>
      <g class="pg-candle"><circle cx="130" cy="131" r="7" fill="#ffcf6a" opacity=".22"/><circle cx="130" cy="130.6" r="1.4" fill="#ffcf6a"/></g>
      <g fill="#fff6c8" fill-opacity=".3">${rays}</g>
      <g class="pg-roof"><polygon class="pg-gap" points="${pts([BL, BR, FR, FL])}"/><g class="pg-blades mv-js"></g></g>
      <polyline points="${pts([FL, BL, BR])}" fill="none" stroke="#2b3036" stroke-width="3"/>
      <polyline points="${pts([BR, FR])}" fill="none" stroke="#3a4048" stroke-width="3.4"/>
      <rect x="${FL[0] - 2}" y="${FL[1] - 4}" width="${FR[0] - FL[0] + 4}" height="8" fill="url(#pgalu)"/>
      <rect class="pg-strip" x="${FL[0] + 2}" y="${FL[1] + 4}" width="${FR[0] - FL[0] - 4}" height="1.6" fill="#ffd27a"/>
      ${post(FL[0], FL[1], 7)}${post(FR[0], FR[1], 7)}
      <rect x="${FL[0] - 5}" y="${FL[1] + H - 2}" width="10" height="3" fill="#2b3036"/><rect x="${FR[0] - 5}" y="${FR[1] + H - 2}" width="10" height="3" fill="#2b3036"/>
      <g class="pg-drain"><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.4" fill="#9fd0ff"/><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.2" fill="#9fd0ff"/>
        <path d="M${FR[0] + 3} ${FR[1] + H + 1}q6 2 12 0" stroke="#9fd0ff" stroke-width="1.4" fill="none"/></g>
      <g class="pg-drops" stroke="#dfeeff" stroke-width="1" opacity=".8">${drops}</g>
      <circle class="led" cx="${FL[0] + 8}" cy="${FL[1]}" r="1.8"/>${ARROW(FR[0] + 16, FR[1] - 14)}`;
  };

  // couleur du tablier / des lamelles / des vantaux par défaut, et motifs de nom pour l'éditeur
  const KINDS = {
    roller_shutter: { color: '#d5dbe1', re: /volet|shutter|roll|rollo|store/i, icon: 'mdi:window-shutter' },
    venetian_blind: { color: '#ece2cf', re: /venitien|vénitien|venetian|blind|jalousie|lamel|store/i, icon: 'mdi:blinds-horizontal' },
    swing_shutter: { color: '#4f7d5c', re: /volet|shutter|battant|persienne|swing/i, icon: 'mdi:window-shutter-open' },
    pergola: { color: '#d5dae0', re: /pergola|bioclim|lame|louvre|lamelle/i, icon: 'mdi:pergola' },
  };
  const TILES = [['position', 'mdi:arrow-expand-vertical', 'show_position'], ['tilt', 'mdi:rotate-3d-variant', 'show_tilt'],
    ['power', 'mdi:flash', 'show_power'], ['rain', 'mdi:weather-pouring', 'show_rain'], ['wind', 'mdi:weather-windy', 'show_wind'], ['since', 'mdi:history', 'show_since']];

  class ApplianceShutterCard extends HTMLElement {
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_position: true, show_tilt: true, show_power: true, show_since: true,
        show_rain: true, show_wind: true, sun_entity: 'sun.sun', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) {
      // pergola : libellés au féminin (« Ouverte », « Fermée ») et « Lames » au lieu de « Position »
      const L = T[this._lang()], pk = this.kind === 'pergola' ? `pg_${k}` : null;
      return (pk && (L[pk] ?? T.en[pk])) ?? L[k] ?? T.en[k] ?? k;
    }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _watts(id) { const v = this._num(id); return /^kw$/i.test(this._unit(id, 'W')) ? v * 1000 : v; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
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
      const swing = this.kind === 'swing_shutter', pergola = this.kind === 'pergola';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        <div class="scene${swing ? ' sw' : pergola ? ' pg' : ''}"><svg viewBox="${pergola ? '0 0 240 180' : '0 0 200 172'}" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${pergola ? PERGOLA() : SVGS[this.kind]()}</svg>
          ${swing ? `<div class="leaf l mv">${LEAF(false)}</div><div class="leaf r mv">${LEAF(true)}</div>` : ''}</div>
        <div class="rng ps" id="shpos"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="rng tl" id="shtilt"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="ctl" id="shctl">
          <button data-a="open"><ha-icon icon="mdi:arrow-up"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="mdi:arrow-down"></ha-icon><span></span></button>
          ${pergola ? '<button data-a="light"><ha-icon icon="mdi:led-strip-variant"></ha-icon><span></span></button>' : ''}
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('.scene').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.a === 'light') { if (this._hass && this._c.entity_light) this._hass.callService('homeassistant', 'toggle', { entity_id: this._c.entity_light }); return; }
        if (this._hass && this._c.entity) this._hass.callService('cover', `${b.dataset.a}_cover`, { entity_id: this._c.entity });
      }));
      root.querySelector('#shpos input').addEventListener('change', (e) => {
        if (!this._hass) return;
        const v = this._c.invert ? 100 - Number(e.target.value) : Number(e.target.value);
        // pergola pilotée par l'inclinaison des lames
        if (this._tiltDriven) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: v });
        else this._hass.callService('cover', 'set_cover_position', { entity_id: this._c.entity, position: v });
      });
      root.querySelector('#shtilt input').addEventListener('change', (e) => {
        if (this._hass) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: Number(e.target.value) });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more({ power: this._c.entity_power, rain: this._c.entity_rain, wind: this._c.entity_wind }[k] || this._c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._pos = null; this._ang = null;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
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
      return { st, pos, known, tilt, s };
    }

    // pergola : fait pivoter les lames de l'angle affiché vers la cible en dur secondes
    _tween(to, dur, linear) {
      const from = this._ang == null ? to : this._ang, t0 = performance.now(), card = this._card;
      cancelAnimationFrame(this._raf);
      const draw = (a) => {
        this._ang = a;
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
      const { st, pos, known, tilt, s } = this._compute();
      const sun = this._st(c.sun_entity), night = !!sun && sun.state === 'below_horizon';
      const rainS = this._st(c.entity_rain), rain = !!rainS && (/^(on|true|wet|rain|pluie|raining)$/i.test(String(rainS.state)) || this._num(c.entity_rain) > 0);
      const lightS = this._st(c.entity_light), leds = !!lightS && /^on$/i.test(String(lightS.state));
      card.className = `${st}${night ? ' isnight' : ''}${c.animations === false ? ' noanim' : ''}${rain ? ' rain' : ''}${leds ? ' leds' : ''}`;

      // course : durée proportionnelle à l'écart si travel_time est donné, sinon 1,2 s
      if (pos !== this._pos) {
        const tt = Number(c.travel_time);
        const dur = this._pos == null ? 0 : tt > 0 ? Math.abs(pos - this._pos) / 100 * tt : 1.2;
        card.style.setProperty('--sh-d', `${dur.toFixed(2)}s`);
        // avec un temps de course, la cover envoie sa position par paliers : mouvement linéaire pour enchaîner sans à-coups
        card.style.setProperty('--sh-e', tt > 0 ? 'linear' : 'ease-in-out');
        if (this.kind === 'pergola') this._tween(pos, c.animations === false ? 0 : dur, tt > 0);
        this._pos = pos;
      }
      card.style.setProperty('--p', String(pos));
      card.style.setProperty('--t', String(isNaN(tilt) ? (st === 'closed' ? 0 : 100) : tilt));
      card.style.setProperty('--sc', /^[#a-z0-9(),.\s%]+$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : KINDS[this.kind].color);

      const name = c.name || this._t(this.kind);
      r.getElementById('shtitle').textContent = name;
      const badge = r.getElementById('shbadge');
      const moving = st === 'opening' || st === 'closing';
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : moving && known ? `${this._t(st)}… ${Math.round(pos)} %` : this._t(st);
      badge.style.display = c.show_status === false || st === 'unknown' ? 'none' : '';

      // commandes et curseurs selon ce que la cover sait faire (supported_features)
      const isCover = (c.entity || '').startsWith('cover.');
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || !!(sf & bit);
      const assumed = !!(s && s.attributes && s.attributes.assumed_state === true);
      const ctl = r.getElementById('shctl');
      ctl.classList.toggle('hide', c.show_controls === false || !isCover);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', (a === 'stop' && !has(8)) || (a === 'light' && !c.entity_light));
        if (a === 'light') { b.classList.toggle('on', leds); b.disabled = !lightS; return; }
        // assumed_state (RFXCOM, Somfy RTS…) : l'état est supposé, pas mesuré, donc on laisse tout cliquable comme la carte HA
        b.disabled = st === 'unavailable' || (!assumed && ((a === 'open' && (st === 'open' || st === 'opening')) || (a === 'close' && (st === 'closed' || st === 'closing'))));
      });
      const rng = (id, show, label, val) => {
        const el = r.getElementById(id), inp = el.querySelector('input');
        el.classList.toggle('hide', !show);
        el.querySelector('span').textContent = label;
        if (this._root.activeElement !== inp) inp.value = String(Math.round(val));
      };
      rng('shpos', isCover && known && (this._tiltDriven ? has(128) : has(4)) && c.show_slider !== false && st !== 'unavailable', this._l('position'), pos);
      rng('shtilt', isCover && this.kind === 'venetian_blind' && !isNaN(tilt) && has(128) && c.show_slider !== false && st !== 'unavailable', this._l('tilt'), tilt);

      const pw = this._watts(c.entity_power);
      const V = {
        position: [known && st !== 'unavailable', this._fmt(pos, 0), '%'],
        tilt: [this.kind === 'venetian_blind' && !isNaN(tilt), this._fmt(tilt, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), isNaN(pw) ? '' : 'W'],
        rain: [this.kind === 'pergola' && rainS, this._t(rain ? 'yes' : 'no'), ''],
        wind: [this.kind === 'pergola' && c.entity_wind, this._fmt(this._num(c.entity_wind), 0), this._unit(c.entity_wind, 'km/h')],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
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
        ent('entity', 'cover'), ent('entity_power', 'sensor'), ent('sun_entity', 'sun'),
        ...(this.kind === 'pergola' ? [ent('entity_rain'), ent('entity_light'), ent('entity_wind', 'sensor')] : []),
        { type: 'grid', name: '', schema: [
          { name: 'color', selector: { text: {} } },
          { name: 'travel_time', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
        ] },
        bool('invert', false),
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_position'),
          ...(this.kind === 'venetian_blind' ? [bool('show_tilt')] : []), bool('show_power'),
          ...(this.kind === 'pergola' ? [bool('show_rain'), bool('show_wind')] : []), bool('show_since'), bool('animations'),
        ] },
      ];
      // « color » a le libellé « couleur de la lumière » pour les lampes : ici, couleur du volet
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'color' ? (this.kind === 'pergola' ? 'louvre_color' : 'shutter_color') : s.name === 'invert' ? 'invert_position' : s.name, this._hass);
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
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, preview: true,
      description: kind === 'pergola' ? `${T.fr[kind]} animée : lames orientables, pluie, éclairage LED et vue jour / nuit.` : `${T.fr[kind]} animé : position, inclinaison, mouvement et vue jour / nuit.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
