/* Carte « Détecteur de mouvement » — custom:appliance-motion-sensor-card
 * Coin de pièce en illustration à plat (murs greige, plafond, parquet, cadres, plante) avec un détecteur blanc fixé en haut du mur.
 * Entité binary_sensor (motion / occupancy / presence) :
 *   aucun mouvement   → voyant vert, arcs verts discrets qui balayent la pièce ;
 *   mouvement détecté → arcs rouges rapides, lentille et pièce qui rougeoient, silhouette avec lampe de poche qui marche sur le parquet,
 *                       son ombre sur le mur et « Mouvement détecté depuis X » ;
 *   mouvement récent  → pièce calme, voyant bleu, « Dernier mouvement il y a X » (pendant recent_minutes après la fin du mouvement).
 * Option model : « room » (scène ci-dessus) ou une photo détourée de détecteur (aqara, luminea, wall, radar), sans décor, avec ondes de détection
 * qui partent de la lentille.
 * Batterie facultative (capteur % ou binary_sensor « pile faible »), luminosité et température facultatives.
 * Les arcs, la lueur et le voyant sont animés en CSS ; seule la silhouette est animée en JavaScript, uniquement pendant un mouvement.
 */
(() => {
  const TAG = 'appliance-motion-sensor-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Motion sensor",
      "model_room": "Room scene (default)",
      "model_aqara": "Stand sensor (Aqara type)",
      "model_luminea": "Flat sensor (Luminea type)",
      "model_wall": "Round wall sensor",
      "model_radar": "PIR + radar sensor (Tuya type)",
      "background_image": "Background photo (URL or /local/… path, detector photo models only)",
      "clear": "No motion",
      "motion": "Motion detected",
      "recent": "Recent motion",
      "unavailable": "Unavailable",
      "unknown": "Unavailable",
      "battery": "Battery",
      "since_motion": "Active for",
      "since_clear": "Quiet for",
      "motion_for": "Motion detected for {time}",
      "last_motion": "Last motion {time} ago",
      "illuminance": "Light",
      "temperature": "Temperature",
      "low": "Low",
      "ok": "OK"
    },
    "es": {
      "name": "Sensor de movimiento",
      "model_room": "Escena de habitación (por defecto)",
      "model_aqara": "Sensor con soporte (tipo Aqara)",
      "model_luminea": "Sensor plano (tipo Luminea)",
      "model_wall": "Sensor de pared redondo",
      "model_radar": "Sensor PIR + radar (tipo Tuya)",
      "clear": "Sin movimiento",
      "motion": "Movimiento detectado",
      "recent": "Movimiento reciente",
      "unavailable": "No disponible",
      "unknown": "No disponible",
      "battery": "Batería",
      "since_motion": "Activo desde hace",
      "since_clear": "En calma desde hace",
      "motion_for": "Movimiento detectado desde hace {time}",
      "last_motion": "Último movimiento hace {time}",
      "illuminance": "Luz",
      "temperature": "Temperatura",
      "low": "Baja",
      "ok": "OK"
    },
    "fr": {
      "name": "Détecteur de mouvement",
      "model_room": "Scène de pièce (défaut)",
      "model_aqara": "Détecteur sur pied (type Aqara)",
      "model_luminea": "Détecteur plat (type Luminea)",
      "model_wall": "Détecteur mural rond",
      "model_radar": "Détecteur PIR + radar (type Tuya)",
      "background_image": "Photo de fond (URL ou chemin /local/…, modèles photo du détecteur uniquement)",
      "clear": "Aucun mouvement",
      "motion": "Mouvement détecté",
      "recent": "Mouvement récent",
      "unavailable": "Indisponible",
      "unknown": "Indisponible",
      "battery": "Batterie",
      "since_motion": "Actif depuis",
      "since_clear": "Calme depuis",
      "motion_for": "Mouvement détecté depuis {time}",
      "last_motion": "Dernier mouvement il y a {time}",
      "illuminance": "Luminosité",
      "temperature": "Température",
      "low": "Faible",
      "ok": "OK"
    },
    "pt-BR": {
      "name": "Sensor de movimento",
      "model_room": "Cena de cômodo (padrão)",
      "model_aqara": "Sensor com suporte (tipo Aqara)",
      "model_luminea": "Sensor plano (tipo Luminea)",
      "model_wall": "Sensor de parede redondo",
      "model_radar": "Sensor PIR + radar (tipo Tuya)",
      "clear": "Sem movimento",
      "motion": "Movimento detectado",
      "recent": "Movimento recente",
      "unavailable": "Indisponível",
      "unknown": "Indisponível",
      "battery": "Bateria",
      "since_motion": "Ativo há",
      "since_clear": "Calmo há",
      "motion_for": "Movimento detectado há {time}",
      "last_motion": "Último movimento há {time}",
      "illuminance": "Luminosidade",
      "temperature": "Temperatura",
      "low": "Fraca",
      "ok": "OK",
      "background_image": "Foto de fundo (URL ou caminho /local/…, apenas modelos com foto do detector)"
    },
    "pt-PT": {
      "name": "Sensor de movimento",
      "model_room": "Cena de divisão (predefinição)",
      "model_aqara": "Sensor com suporte (tipo Aqara)",
      "model_luminea": "Sensor plano (tipo Luminea)",
      "model_wall": "Sensor de parede redondo",
      "model_radar": "Sensor PIR + radar (tipo Tuya)",
      "clear": "Sem movimento",
      "motion": "Movimento detetado",
      "recent": "Movimento recente",
      "unavailable": "Indisponível",
      "unknown": "Indisponível",
      "battery": "Bateria",
      "since_motion": "Ativo há",
      "since_clear": "Calmo há",
      "motion_for": "Movimento detetado há {time}",
      "last_motion": "Último movimento há {time}",
      "illuminance": "Luminosidade",
      "temperature": "Temperatura",
      "low": "Fraca",
      "ok": "OK",
      "background_image": "Foto de fundo (URL ou caminho /local/…, apenas modelos com foto do detector)"
    },
    "uk": {
      "name": "Датчик руху",
      "model_room": "Кімната (типово)",
      "model_aqara": "Датчик на підставці (типу Aqara)",
      "model_luminea": "Плаский датчик (типу Luminea)",
      "model_wall": "Круглий настінний датчик",
      "model_radar": "Датчик PIR + радар (типу Tuya)",
      "clear": "Руху немає",
      "motion": "Виявлено рух",
      "recent": "Нещодавно був рух",
      "unavailable": "Недоступно",
      "unknown": "Недоступно",
      "battery": "Батарея",
      "since_motion": "Рух триває",
      "since_clear": "Тихо вже",
      "motion_for": "Рух уже {time}",
      "last_motion": "Останній рух {time} тому",
      "illuminance": "Освітленість",
      "temperature": "Температура",
      "low": "Низький",
      "ok": "ОК"
    }
  };

  const CSS = `
:host{display:block;height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--ms-ok:var(--appliance-ok-color,#43a047);--ms-alert:var(--appliance-alert-color,#e53935);--ms-cold:var(--appliance-cold-color,#4a90d9);--ms-c:var(--ms-ok)}
ha-card.motion{--ms-c:var(--ms-alert)}ha-card.recent{--ms-c:var(--ms-cold)}ha-card.unavailable,ha-card.unknown{--ms-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--ms-c) 22%,transparent);color:var(--ms-c)}
svg{display:block;width:100%;max-width:calc(360px * var(--illus-scale,1));height:auto;margin:8px auto 0;border-radius:10px;cursor:pointer;overflow:visible}
.line{min-height:0;margin-top:6px;text-align:center;font-size:12px;font-weight:600;color:var(--ms-c)}.line:empty{display:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile.hide{display:none}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.bad .v{color:var(--ms-alert)}
/* ---- illustration ---- */
.arc{fill:none;stroke:#2ea88a;stroke-linecap:round;vector-effect:non-scaling-stroke;transform-box:view-box;transform-origin:108px 54px;opacity:0;animation:msarc var(--p) ease-out infinite}
ha-card{--p:4.8s}ha-card.motion{--p:1.15s}ha-card.recent{--p:6s}
.motion .arc{stroke:#e53935;animation-name:msarcm}
.unavailable .arc,.unknown .arc{display:none}
.a1{animation-delay:0s}.a2{animation-delay:calc(var(--p) * -.2)}.a3{animation-delay:calc(var(--p) * -.4)}.a4{animation-delay:calc(var(--p) * -.6)}.a5{animation-delay:calc(var(--p) * -.8)}
@keyframes msarc{0%{transform:scale(1);opacity:.55;stroke-width:2}100%{transform:scale(var(--sc,8.4));opacity:0;stroke-width:6}}
@keyframes msarcm{0%{transform:scale(1);opacity:.95;stroke-width:2.6}100%{transform:scale(var(--sc,8.4));opacity:0;stroke-width:8}}
.alertglow{fill:url(#msglow);opacity:0}.motion .alertglow{animation:mspulse 1.1s ease-in-out infinite}
.lensglow{fill:var(--ms-alert);opacity:0}.motion .lensglow{animation:mslens .7s ease-in-out infinite}
.led{fill:var(--ms-c);filter:drop-shadow(0 0 3px var(--ms-c))}.motion .led{animation:msblink .5s steps(2,jump-none) infinite}
.fig{opacity:0;transition:opacity .4s}.motion .fig{opacity:1}
.bat{opacity:0}.lowbat .bat{opacity:1;animation:msblink 1.6s infinite}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}.noanim .motion .arc,.noanim.motion .arc{display:none}
@keyframes mspulse{0%,100%{opacity:.35}50%{opacity:.9}}
@keyframes msblink{50%{opacity:.2}}
@keyframes mslens{0%,100%{opacity:.2}50%{opacity:.55}}
`;

  // ---- décor fixe : pièce, déco, détecteur ----
  const wl = (x, f) => { const t = 16 + x * 20 / 84, b = 186 - x * 16 / 84; return t + f * (b - t); };      // mur de gauche : x, fraction de hauteur → y
  const wr = (x, f) => { const t = 36 - (x - 84) * 24 / 156, b = 170 + (x - 84) * 14 / 156; return t + f * (b - t); }; // mur de droite
  const quad = (fn, x0, f0, x1, f1) => `${x0},${fn(x0, f0).toFixed(1)} ${x1},${fn(x1, f0).toFixed(1)} ${x1},${fn(x1, f1).toFixed(1)} ${x0},${fn(x0, f1).toFixed(1)}`;
  const arcPath = (r, a) => { const cx = 108, cy = 54, k = a * Math.PI / 180; return `M${(cx + r * Math.cos(-k)).toFixed(1)} ${(cy + r * Math.sin(-k)).toFixed(1)}A${r} ${r} 0 0 1 ${(cx + r * Math.cos(k)).toFixed(1)} ${(cy + r * Math.sin(k)).toFixed(1)}`; };

  const SCENE = `<defs><clipPath id="msclip"><rect width="240" height="200" rx="10"/></clipPath>
    <linearGradient id="mswl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdb3a3"/><stop offset="1" stop-color="#aaa090"/></linearGradient>
    <linearGradient id="mswr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ddd6ca"/><stop offset="1" stop-color="#cfc7ba"/></linearGradient>
    <radialGradient id="mslens" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#dfe3e8"/><stop offset="1" stop-color="#aab2bb"/></radialGradient>
    <radialGradient id="msglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e53935" stop-opacity=".30"/><stop offset=".6" stop-color="#e53935" stop-opacity=".12"/><stop offset="1" stop-color="#e53935" stop-opacity="0"/></radialGradient>
    <linearGradient id="msbeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffd24d" stop-opacity=".55"/><stop offset="1" stop-color="#ffd24d" stop-opacity="0"/></linearGradient>
    <linearGradient id="msbl1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2c6a46"/><stop offset="1" stop-color="#5aa874"/></linearGradient>
    <linearGradient id="msbl2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#255a3b"/><stop offset="1" stop-color="#3f8a5c"/></linearGradient>
    <linearGradient id="mspot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d0c2"/><stop offset=".45" stop-color="#f4efe6"/><stop offset="1" stop-color="#d0c7b9"/></linearGradient></defs>`;

  const room = () => {
    let g = '<g clip-path="url(#msclip)"><rect width="240" height="200" fill="#1c2430"/>';
    g += '<polygon points="0,16 84,36 84,170 0,186" fill="url(#mswl)"/><polygon points="84,36 240,12 240,184 84,170" fill="url(#mswr)"/>';
    g += '<polygon points="0,0 240,0 240,12 84,36 0,16" fill="#faf8f4"/><polygon points="0,16 84,36 240,12 240,16 84,41 0,21" fill="#e4ded4"/>';
    g += '<polygon points="0,186 84,170 240,184 240,200 0,200" fill="#7a5f48"/><polygon points="0,190 84,174 240,188 240,200 0,200" fill="#6d5440"/><polygon points="0,186 84,170 240,184 240,189 84,175 0,191" fill="#f6f3ee"/>';
    g += '<line x1="84" y1="36" x2="84" y2="170" stroke="#8f8576" stroke-width="1.2" opacity=".55"/>';
    // cadres : un grand à gauche (paysage), deux petits à droite
    g += `<polygon points="${quad(wl, 12, .2, 60, .52)}" fill="#fdfcf9" stroke="#8a6f52" stroke-width="2.4"/>`;
    g += `<polygon points="${quad(wl, 17, .25, 55, .47)}" fill="#8fb7c9"/><polygon points="${quad(wl, 17, .38, 55, .47)}" fill="#5f8f6a"/><polygon points="${quad(wl, 17, .33, 36, .47)}" fill="#7fa57a"/><circle cx="46" cy="${wl(46, .31).toFixed(1)}" r="3.6" fill="#f2c14e"/>`;
    g += `<polygon points="${quad(wr, 132, .14, 164, .34)}" fill="#fdfcf9" stroke="#6f5a46" stroke-width="2"/><polygon points="${quad(wr, 136, .18, 160, .30)}" fill="#d98b6a"/><polygon points="${quad(wr, 136, .25, 160, .30)}" fill="#b86a4e"/>`;
    g += `<polygon points="${quad(wr, 172, .20, 198, .38)}" fill="#fdfcf9" stroke="#6f5a46" stroke-width="2"/><polygon points="${quad(wr, 176, .24, 194, .34)}" fill="#6f98b3"/>`;
    // tapis, puis plante (sansevieria dans un pot crème) posée sur le parquet
    g += '<polygon points="60,196 150,190 232,196 120,199" fill="#c9604e" opacity=".5"/><polygon points="72,196.5 150,192 218,196.5 120,198.5" fill="#e3a07f" opacity=".5"/>';
    g += '<g transform="translate(0 13)"><ellipse cx="38" cy="179.5" rx="20" ry="3.2" fill="#000" opacity=".22"/>';
    [[-10, -24, -8, 112, 3.2], [-5, -14, -3, 104, 3.6], [0, -6, 2, 100, 3.8], [5, 6, 7, 108, 3.4], [10, 18, 13, 116, 3], [-12, -30, -17, 126, 2.6], [13, 26, 21, 128, 2.6]].forEach(([bx, mx, tx, ty, w], i) => {
      const cx = 38 + bx * .5, my = (152 + ty) / 2, tcx = 38 + tx;
      g += `<path d="M${cx - w} 153 Q${38 + mx - w} ${my} ${tcx} ${ty} Q${38 + mx + w} ${my} ${cx + w} 153Z" fill="${i % 2 ? 'url(#msbl2)' : 'url(#msbl1)'}" stroke="#c9d86b" stroke-width=".8" stroke-linejoin="round"/><path d="M${cx} 152 Q${38 + mx} ${my} ${tcx} ${ty + 4}" fill="none" stroke="#8fc08a" stroke-width=".7" opacity=".7"/>`;
    });
    g += '<path d="M24 153 H52 L49 176 Q38 181 27 176Z" fill="url(#mspot)"/><ellipse cx="38" cy="153" rx="14" ry="3.4" fill="#f7f3eb"/><ellipse cx="38" cy="153.4" rx="12" ry="2.4" fill="#3a2f27"/><path d="M26 160 H50" stroke="#d6cdbf" stroke-width="1.2" opacity=".8"/></g>';
    // ambiance rouge pendant l'alerte, arcs de détection (animés en CSS)
    g += '<ellipse class="alertglow" cx="108" cy="54" rx="120" ry="95"/>';
    g += [12, 12, 12, 12, 12].map((r, i) => `<path class="arc a${i + 1}" d="${arcPath(r, 36)}"/>`).join('');
    g += '<g class="fig" id="msfig"></g>';
    // détecteur : boîtier blanc, lentille, voyant, pile
    g += '<ellipse cx="97" cy="47" rx="14" ry="22" fill="#000" opacity=".18" transform="translate(4 4)"/>';
    g += '<rect x="88" y="34" width="20" height="30" rx="5" fill="#f7f8fa" stroke="#c9ced5" stroke-width="1"/><rect x="88" y="34" width="20" height="30" rx="5" fill="none" stroke="#fff" stroke-width=".8" opacity=".8"/>';
    g += '<circle cx="98" cy="46" r="6.2" fill="url(#mslens)" stroke="#a5adb6" stroke-width=".8"/><circle cx="98" cy="46" r="3.6" fill="none" stroke="#c4cad1" stroke-width=".6"/><circle class="lensglow" cx="98" cy="46" r="6"/>';
    g += '<circle class="led" cx="98" cy="57" r="1.9"/>';
    g += '<g class="bat" transform="translate(206 8)"><rect x="0" y="0" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="22" y="3" width="3" height="6" fill="#ffa000"/><path d="M3 3h4v6H3z" fill="#ffa000"/></g></g>';
    return g;
  };

  // silhouette : membres en traits épais arrondis ; t = temps (s) pour la marche
  const figure = (x, fy, t, col) => {
    const sw = Math.sin(t * 5) * 9, bob = Math.abs(Math.sin(t * 5)) * -2, lean = 6 + Math.sin(t * 5) * 2;
    const hip = [x, fy - 52 + bob], sh = [x + lean, fy - 96 + bob], hd = [x + lean + 4, fy - 109 + bob];
    const f = (n) => n.toFixed(1), P = (a) => `${f(a[0])} ${f(a[1])}`;
    const leg = (k, s) => { const kn = [x + k * 5 + s * .5, fy - 26], ft = [x + k * 8 + s, fy - 1]; return `<path d="M${P(hip)}L${P(kn)}L${P(ft)}" stroke-width="11"/><path d="M${P(ft)}l9 0" stroke-width="7"/>`; };
    const hnd = [sh[0] - 28 + sw * .4, sh[1] + 8];
    const armF = `<path d="M${P([sh[0], sh[1] + 4])}L${P([sh[0] - 13, sh[1] + 18])}L${P(hnd)}" stroke-width="8"/><rect x="${f(hnd[0] - 14)}" y="${f(hnd[1] - 3)}" width="16" height="6" rx="2" stroke="none" transform="rotate(-8 ${f(hnd[0])} ${f(hnd[1])})"/>`;
    const armB = `<path d="M${P([sh[0] + 2, sh[1] + 4])}L${P([sh[0] + 20, sh[1] + 22])}L${P([sh[0] + 30 - sw * .3, sh[1] + 44])}" stroke-width="8"/><ellipse cx="${f(sh[0] + 31 - sw * .3)}" cy="${f(sh[1] + 54)}" rx="9" ry="8" stroke="none"/>`;
    return `<g fill="${col}" stroke="${col}" stroke-linecap="round" stroke-linejoin="round">${leg(-1, -sw)}${leg(1, sw)}<path d="M${P(hip)}L${P(sh)}" stroke-width="24"/>${armB}${armF}<circle cx="${f(hd[0])}" cy="${f(hd[1])}" r="9.5" stroke="none"/></g>`;
  };
  // silhouette sur le parquet, son ombre sur le mur (pieds à la plinthe), faisceau de la lampe de poche
  const actors = (t) => {
    const x = 168 + Math.sin(t * .9) * 16, fy = 193;
    return `<g opacity=".22" transform="translate(${(x * .28 + 44).toFixed(1)} -10) skewX(-34) scale(.98 .96)">${figure(x * .8 + 10, 178, t, '#000')}</g>`
      + `<ellipse cx="${(x + 2).toFixed(1)}" cy="${fy + 1.5}" rx="24" ry="3.4" fill="#000" opacity=".3"/>`
      + `<polygon points="${(x - 40).toFixed(0)},${fy - 87} 96,${fy - 135} 96,${fy - 40}" fill="url(#msbeam)" opacity="${(.7 + .2 * Math.sin(t * 7)).toFixed(2)}"/>${figure(x, fy, t, '#0b0d10')}`;
  };


  // Modèles « photo » : détecteurs détourés posés sur un mur uni ; fx / fy = position de la lentille (et du voyant) dans la photo, en fraction de sa taille.
  const MODELS = {
    room: null,
    aqara: { img: 'data:image/webp;base64,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', w: 240, h: 576, x: 89, y: 30, dw: 62, dh: 148, lens: [.51, .22], led: [.315, .07], floor: true, sc: 7 },
    luminea: { img: 'data:image/webp;base64,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', w: 199, h: 466, x: 90, y: 24, dw: 60, dh: 140, lens: [.34, .48], led: [.34, .88], sc: 7 },
    wall: { img: 'data:image/webp;base64,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', w: 350, h: 292, x: 55, y: 38, dw: 130, dh: 108, lens: [.82, .71], led: null, sc: 7 },
    radar: { img: 'data:image/webp;base64,UklGRkAkAABXRUJQVlA4WAoAAAAQAAAA7wAAggEAQUxQSJ0JAAABN6SgbRum7caf9d8ARMQ6gAreBnznqIQjSXLbBkus8vr/DxYBEs7HiP5PgKWVXfsZyWNA4j3yPABUIeUzkNAxZ498Clrr+HCgm08M0MyOo8hL5C+kouOomfyP0reyv9RDRWSRisiqda0xzVKPe421Iu5TFNm+15AcU8ZIjsjdPTKsUkojZgZpVXKsjxRDbds2krT/2nnvrroqIibAMpvStY5dpCoXuzRtOkUyHbCossPNLn3qTifbjhmPpS493iXApdiSR9u23bS2tq33MSUhwMY+y/v+b+3kfLxsgQClOfoJOxoxx8mOiAmQJNt23Da/5wfw0ZD0LPtfZuYkUYCmETEBsE7iloXSTpvKcNue56mg0mFL441Jyn1fStVLXSXeGuTuuevL6KWuEo3gLQkA3IXrnN3zrKL5WTIzG2fplizVDWgGApB8OJ+KBQ8VgeXouHnbP1myRAByXzLmEuF8/pN80RvW8XHfkoQASEhNU9cVvSB2h5bUPvmM1VV/7EiAkpZzl8vAXrbJTHpqE1b5VLEioOzL/DqXQP1SWQLoXwwrvW/5D/C8zK8FsH02UhyGCettVUqpbuTu+f3uPe0SXZejY/3tkACM/X17eCLler/iPv6MyTB1Czs8GaElv864l9+kyqCyqvJcGeV5fHXczfol1fTitKJotfbrHAGrvXRv2ZWXE+O6eo0WsOLuMBFZC6V6XnevBRZtqqq2EtKjjH42WLeImOdyN4zEjghYOqvn2vfVfRCJRWH15Ln3XXMXKCAxbGCpueG0rJ8IAMIWkmo6n1dPglCO07U7nlcuZ0dJet/1l3XTvGRXQeB8uY6+asM4LY6iHKcMW7H+dB4mFGZGanb71erejj2K05rt4bCvVur9tTuVB9rd02HXrFM/vnUo0f3jruG0rNB0Pfd9kQC1pnO/Pr5M44BSna5dd1kbeV5mFYv33WltBHnOKNfz+TJMqyIBEkp2GKd5WZGc3SEUrc/LvOTV0Ly4C4Wbl3mZfS0u13HOKN5lnoZhLWB1U5cPprHitA40uRqU8BnydbDLuFgR9XKf1qEfMsrYJa2Cny8qJBg5rwAf16sV0sbMtAIN8sRColF5urmU0AylXOd5ON9a/Wy6oJjJ3XQyezFmLycwVZ7sS2UuFDQL01y7bYLei4qI5zok0/VaUsQyl7WVeERJs6pNtTFwzEWl6k4ztSIGFDWmUstEb3/8ze8HFPZDArp5+q9/+KPKyzzPwrJcujcU94G4lVxy5YOX1wPgNAN5aW1XOcqbLWQTsHqu9aFCibfwCYTFjpxR5g3MP2cqqga73tASfisimYjAvv/h5zW+1M4xwpVh4/tf9fadUsd9nZEItv4354iPRKu1X+cI2PxT79+IcV29RgvYfo+S8AMe47p7LfALupu+x0fp/WzwG5oqv/Yf2HLAr8jC9Ja1u4fHLeJA9NZkdbvdII7EIi+5LG0RSBbVdyY5iEiquuMrRmATCkwlyhvU1JUhltFGewF9u6mbYNQ+RjyX0m67RTTbaI9ps9stGeGMUpI+ZE27XRBPSm4PTVZtNoioqsgzElMbEiamRyY5iJAiIeITZlATFHjWmroyBDptt23TBKrxvMxCnOsv8pwR5+rFICHO/CYRQqBfKpMQ6N02CaE+JMM1UtZW4jFSjZFjDhUMAyLdwjFFii1coXqgfPBIHYjcI9APFT1YCToi0NQa0EfKjBgUKhgGRNrhmCKFDleoAuWDBwobKvcIdGP0JVKjaIZIuwNNpCbPIiLtkjeRmkFEm9xEanKRDNU4LRUiXTdtm0KVqrpGqC1ZFSqSxlD9Y7w+/f/p/0//f/r/U5uKl0sKVaaIUM8gQu0jjaHqCUOoj26xOrkQ697dQqXBxVDNyIh1loLliJaET/9/pl+hkuSxQvPwfGhDVe0PD7tQsd1tY5XrpqksUgCJJlSTADBScIFtqGYwpVABVlmsJjM7hwoEulhNrvc+VBC6YC3pfFWotBnmOVRo5jnHykRaqEgohcokxgoONaHKcmwYKQwuPISqz8ITQ7W48SlS2D8+PT6GCo9Pz4cUqt3T874JFR4eNsyhqjech+scKHAZLkO2QGEahpzaFCjAq/3zl1CBVnETqitoTagGCm2oRoc2KVI+LNQhUjhmx3YXqcs1E4dNoPC6OO05UkjJiFgTYKxAhFuMFuL1b+z7Kljab+sgCOBHkO+3bRuGD+m+3W7MmggsBD8CfLOpQOdm/2bwY0BmkpuJbp5G2AcBJndZEmDduhNo+LiTrGJAOmjjfiukDwTg2WV19Y0VW5+d+OA9kOrqueDw4ZYuW6oeWGga3D8c0NEqbgptRsYtXkhrCs1dNzFQaEtN0C2MDm0KTbhNHxYqVJB7y7GCnI4hVmQ6DCyxhcA5gOU6TCywGaRJQK7jgvLWCMNZYM5iXVw9aDAPq2ZfXEchzaO6fdizsPrsxMTTPGcUF24qL9kLywfXbbnnwprkuGnPS3HhxvI8T4U1wG5rnq6XXFQaQLspXfrTsah6wHDbp7evX68FpaOYbgxyOlTK6ehO3DqZqrCYOofdHLCojCykXplYQVGbvZCO4iqA+aJNEXUCsY4FZiV0PcuqlQhL1pTP/C4Y1tJoVjz+Kud6QPKmdF6z07CaY86uwjlNWYYVdRfasukWJ9Z0BlMqmt5dWFkza0rmJHFlJhJeMOfshrVVnmeVy7tzfaZxHK5eKp07sb5sUjIWi2yFkMxQqL0yscokWCZHcaVAoUg7gVhrsUSuF7dqtVAiYycSgZ7e5Rap6c1lhkgTJOI8AhAR58tRoBDn7iIXcUd15y6dS+64o/J8z5avk4vJcUfleZnv1/yaZ1nCXXVfprHv79XrsjiIO0v33w062nv07tlxj2NITmPDe9OPuNvuopnPm7pJ9yN3M2n3CpNomgcY2v3jnehOAFN9t4BZeboAiZUdHrh+53d3Z1Xhrk/XiwOkmdq6MkuVrVZ/yu4y4u5rHge5BEAg2Z7WqX8/umCGMlR/zIuyALDir3970ur46+vru5hQlCZMJJqCZmrrZN9CS+Ttza95EYgyxXAJgPBt4HnS5sau73IR5XrMi7Lw3bxMIhvejndXORNK9nQeXNC3EcMsMk9Tsu9FS5X9JL5kF+B5HinSULi+ZP82z/MlC5qGXvh+INv94492Og8SBICAmRkKe8IynDv8UCZL9rS3H8HPnWfPwrfSrEKBT+fzUT8EhBnR1Mm+l+d5gtwhfCtJlHqWfy/3+Qq5A4C+FwHAjAhqRDLBD6WZIbCmrB9AEtH1H7CmAFZQOCB8GgAAsK4AnQEq8ACDAT4pEodCoaEKlRqmDAFCWdu9tJoALXa2M0p/lbrbbWB0mEDwr5Z94/hPyd9sfk3xA9EeK/an4NxzvXT4l/kf2b8nfnv/w/Xt+oPYP/U//k9XHza/t/6p3Qmf4frx/Qa8uH90PiY/bT9vPbD1RHs36Pepfirxxffvxh+l9b+C9maZE/cof5/kw/OP9X7A/8o/tPWM9Gb9awfpdTTAeNCV5vW8kpz2Vm95k7FwKtLULZf7EezAKVH1W5lO7sLGTLM30P6VpYQ1XpBfKCF7lJV0yMmKTuk1+qE2Ygs206VOI8JBPAT5ph/P2kYxMmtlGkgGhyxrOeFclXuNVsbZwt1XZl6FkM1akzakAGYNtX3yQX/norgehx5qFd5vZWrY1PXXt0J0sMI1ZWtv3pbDP0EpYoW3TrWb6UaW01kSJWjLNK0lo9R3Y5Aon7HDoaayrozHpG4xDJ5p9wQbqRnhMk7V/p1/Y/JEoCPBG2D7BwrWCjexlO5SmfVHkjQrHBat/Rl9QAiG8jrEhCKR6zzNlbQfASW9Lon3JC6kk4ziBz66DHA34BRqaENCwKJP8iEEMCiOrnn1CcBN66K79sLYB3D661mxr3vQM7ktF980x8566TqWGPU6riuI1BEkqS7ADPbkRLFKsDoP8gQerNGUt2e+x6H2GLORSTZMNNXac7O0PDVbZpRoITFaAdS7ZqLANlD/qR1DFf6j3wbmNn/gDLVajNPkaWgVSgnEpjfKSiqOZGYx8Jv85aS43tWauficF5Vae1dL10PqN9Ku6MlEVqs0jAhCFqgQrkofcRb95E9GbhhT0yvUrbuin0C4iwiOmig1k9/R9YehPEm3PVut0k5gK6/ohO+oI/IUgvOm12WRyPh8DkBmIy+TePjSodJ4ooXF6Xt8AbXDjHX4EL+VjgVmnC90X2cguca0PEDZKLVaDar1aMCAAC6Ebb7sz7ojAzd1ePrgO0T4b0a6njmprV8hJK5nesYF9JdtHsKsr7ZIAjfTeTHonfbvABiHEvyzMDESI+dUJ3drahEaG4G2oRO8bWDVJgkoy5RGUdZwXTUex/kvPYe9MaaSQElHizf1htC9+5cqDnrXSrOWIGAaqmQTmLzQPyGGneDUIFdlW23p2oNFec1kYbraYUEFO2rLtX5btKDOHrqO5MXKMgACWLmieGsazfu8vIQaS680FOFZoE93ywtpAiZF8HYuax9Pp6Elrr+5X8s0T/Z0w1RaUdmKwSG4g2l0u9TIvLt0lAylEhWGbhW7IU0EJUmQjaLjyac8/WSYrD2f8sXqaPVaLWRXhXXm8uxbc2c+lByI1FlwYxY2dEbYozf47vjdrKAiPSMjpGC4ISIM7jSKhBuKqITEIb9OMTvo7Rm+5ZHEUQtpw9jetPNfDgUHoY1iaQnd0WoNjxcN7gQMXt5OamwofNsBvn71JRmaIUoSlkvRraNQxc8txQ4kx1Q6u6zvWT731O0bnBqQ9OyThdxZbD0q6vgAZ7nHR6fiB9/52zcvnTRKRgYRur1RMeV97SePDzGgG70zLJa06QOv+rN4VIjqvUuDg9cIma6ctHdT8eAowelyL7GDOXL2oLbBIswIzhvNms5miNn0IFFwCLeu+VHBo8EjN5Xh8MT7i31d6wmIjI9Y94yXnLlyVJ9XaH2Tq9PlCP/o3bhes7CC94Yoql+Xwzb4HWQ7iTs3VXJ/SqjKCAgNg+ZdauFVHiug0SHelnPP/r3MlgptsSIe/PXgtinjZL7ifx8YH6GxBy3Fp+A/yJtOgbXHWkXCbot4zwIQsbf9RYByJ+daLMdYut2oZEtqvcA8lg78n+PPAHowAZDtdql5AIavs2dFJfCTYpqjx0y8NX/p7/M7wQAA/vgzP/V3yAhfPP/Xd/6/p+v6df0rykxxE6iQacWln1hNvxevmSw5j4JkuxhQl4Le9fbsUygeZrQlDDuUeU1vj2B42gL5R7Q2xlhn8RarSq/U98RiudAfdTrg6PDy3AODe1ZCi0lYqH6Xu4HvbSU8McenlTXgk1H7e3AaLoGAkkHtgx59OeNkgeXIRLynyLy5QHNbJRGsBRxyvZk+R2l092zanmDDDHyBR2JS5rMkmNwvUuJOL6fzMG0z6klGMO3XwyqLpC3ii4YevnM7w9UDTfT9gIQB8Y13oSjZz8pE5cmjkcuqJxj0uEW//RiuFu7PLUqxdiA3cn/u2/sUowjQ4tbUWeB5b16p5WLu0PO3zGnLwG7MNOYBqrIHyh9X+krvSbfx+hx7V8hgAhoCaULGffy3DaSAjLJ2h+JRBheX5H1dDFxNiksXPRxtqq969/FkgkRSJs66laR+BtY5DgzavHvClZjMtZ3KeqDIPY+Qk1hIkdQp/Wti61ld5JP7U3vkx0RlqtsSPN0qO5OnTvwRwBl4nDvwTEqvQmeY3wrilutLw6TFdQqvMLfGK1vroqshdIuJ8E4U+OorNMtQx/xxt2MIenVCwJP/mV8WCkXqhdGIkkKUtZpNW73llvfzvmFZ9yGku0x0LnC0Ot1iXSn6scqvZ9fLHKIe6bOvKzBPDiwj8Wx1r4fGAdoG80V5DZzEkoZXb/y4A6ViPBZgCRi5cHq0xbaeNJsa78gMN3OcCK1aOcF1FDCLE9DFCu7d71xB46AeugSMtfK28hXf46nmlafnYXLZbQYAkp5PcJpkLxEc8hqP9ZEWJKPn36ByaqsabOUngqiCNfHKtjUw54WQI/lQPkemjZW4M6Gr82zVbnE+JhesVtMxv9BG6xYRUr0I5kIzGlCSee8lhOmxEb8Cffdz0sF3qWH8DA98KzVybpI9AA1Gsu4n1euCQMECGV5lZX/pb+plUpRT7htn1tD6WFkBWS+ffURvWu6ZT1FR8OZnzWK6ylQf/Bm6wKRfy+YypfV0mZGZOA37VBGD9+vMcOBy4538tX7bmlGv+TdsSaVeg0mIVKOVLGgQsl9iVFa+R5SMm8ESw7/ysJRQCkKRX+EAigOWLRw8tiGwmDirReAs4hp49NtTFlyVldvKTHk99K3CpBGDuqJr+saAJhuYpMtie1E+gqlVrhOu7sUNv4ECWolWR1+pKrY5e13PYo+jA3TFJ7DnykiLi8NmxmaICpn1Z+uF29L+SQupSX8abLbko6CL8/sgtiasMSK7Amd3dpwx8ugHiXv4Ekhq2bLrEE+n2HFKCPlE+oIT0FHu/sDlOJ0LGIwT95orSbCzwiw7CFAcrp5HfVLix5xdlfWpCk6xhWbKWcHKC8wLS7fYlqQR2puJWV9lbjz7uE7z+ARu+HzY0PSmRXOmEx6fOVChJZ30ymulRfr4pofKZ3iDceYUl/7MfDOczd2syDPpYFmsBv57HVZQvuESrtJtM9u5npwr3Rgp3gg+ncb2gmuWc7aQSDHmwioVjvbbCrf0G1cqJIwu4WrWPIOsU1b/AWVCBmK/JAdynsfwq9w78h75n3TNAT5110NQRN61UFqXgbpV9ist/qei2Qxj88/aLdFnvLZbbSS8t3poOO+9U7mkA42DY+RBXgJAgCYUVGyHbd+C0/iVhycCRzXl7VmBHPlfRUGcTSmcFzcqV4mQYlj8ONF8ZfKe7E7yEJBhjmGGb7jte/lX+DbyZSSWtoa+sEF1HCnsm8E/bnCzM/LrbzP0JURk41+TY8hab4HAvkEOHQKgLON+kazX4Qdf5AYsb6eDQ1YqufsL0BCIc0G3SgfhEbxiiYmhJ5y7zGaMKiNRqKseaoTdGEjIAQ7LET3UrxkgYUtKFMRoIolDqq5dwIQE6GOEIPIlh7bb5YPyIIIYmt5Cg2E42YEwKGSqPp4ofEVHyh4aM25iHiH9DHkhLsjqsaUi+coV133CIai5E+ZD4gvXfFGwKJsEXS74opsylq4zStHornjBZBObC2ZRRHpycExsXoKCkzU/na3/YB9fvJJpiCqI7cFOMihyXfoa01obYy+2SpW+jDNu7xWr79hXM8+Wo/wq4hHUeMJgiPFif1ZD/BuaBC7mvi4FwoGZuBz4mHErv00S9rmYq1dmzUJ7QL2G10qZmvmgOGMSis4FgbcPJih9KgaqHlnqUKLoeFCEyzkO4PeAqBnIxilpOnDRlFB4d0KZYlRsgrevN51p5Cl8mpM/sgZoUL29WRvj7jOYcPU1jClPHN/IpKE15WZ880ztKqMsucGDQAxrS7nqAj5/mIGqJH43uvtAv/XfBd9Czdw3Z6kl+Ukr8ebfgWLLwgfO/0972DLcCYIK7HkOP/mxD+P/I/mow8nhbn0nR2l96XWab2EY/b9ckugeCJ6YKmxJWZZ4HCH0lwFwDqSUXPiUdIIQH15jTdUcA3ypGqUA51dIH7lAShoAr+WfzTzlvz9ofIsFY1UY6BigMTQBeg4ulBx9eWxTWSYENrJHml4k6z68lLc7bn0ESGddmzhVho0gY48VKHaDtjcUOyoaBAS2gcaaR8KitOd6D6bXPxTo1f1482zgQoA1P77XTu/feFeVFZKrDNzWWsBuX09meqCh+KUrr2Rfo7175YOFXXmw0yopAL1ypNCTFBKazByeN2TCJsBjW3ncmR8iN1W9hB2ZeyUiBex0vnKOxHp6NO9KNiJj8O1gLLxhgq5M4W48kPksQOYTQV/UL92oXkDXGr/FiMti1tUwvzQjxfbDz2nH+LW096bLhIHXsUjtdb5JajPC3mYYOMV3TAdvmm2XKRwK+ctRouwNChAkyF5FdKZnaWpoepsR6Fwg/1APpBsBAopjCg/7aDe1ACTIOUgkGuZdCliXRqzYAtJfdPgQ370r20mfF9ZagGwDg5H2xAThx2vPPzkKX6cKw5DhXmvOQOmsyVqJYZPh+IiZzvXGsut1kbySC6h34ZzdecOkbHDVqTIatxv5Ofl3vbaA8RgxOGoyDs4VtSZWnpNaUJdUYkD8kdsSYpxeDm2eedrzBaJqzFgsFX+Ks0zcjvm/9zcKetgDE5+suZ455M/JSYhM/2IrlMwFZI3oCmwcjpSFl+aC3gVGKR/qrKQq/hn3HMjeq4ULQ/JG51QRbnK33UnGwApaH1iBkQwCvpn9TXIjkY3mXEKdrp3z6lavXgYBBweC+bf2zLNNqvDSvxpQW4+wZHJi5+TfpFZJTCbPA9sp4ydnYzRhLim5CwuYsm+zrMF/UEjAS8jh7+1n7DmVH/tOIxqZ1iKsKJeotLN6jiM5fKX6hOXl70WkXoINK/HdUF1Ml90yYeY2l8GW5ISXFnP2WhEfWrdJTWCEagqy+qL511FG5hI8W0vxmdySSqEgOhqT6fJpEpTQmwGCNdiqosTcmzpGVIsAIPWycB6PhhOE3xgF4EvaRX4ko3VR1CBVr5YFqd7Vp0j36AA1oOGZP4DqF7RvLspUX5Hmu1lNWblUOxdQsPtsvAPv59OApcGXVEz7mrC2tMEx3Bha/rqxg5ErfFhsmx6MltZ5rv6ZZq8jgK6Yd3WYiL/8uq5PSUoGAfdoQbAR4Mz3fg66BeCdo5I33DsYklFFONMtK+h2LIOd9cZbzGvhxEn3R9nSwXCswA548WXBQEsj9cnx6YFIN7Z74dBDgU/QJKMjJHLL52cc/C1kEY1DiIrY2zoV9Cg8lH4wqelw+gRt2n0iMN1k1h/oOWw+Y49gqo3VVesnANO70toMGbekuR5UJ9d9SCu++dDnzCpTI2cChMXg3/JIN7y44RJXlwGbBt8/t8gqLOtpKQYI6/jHBdcc+jRQdnSx8mKv+lXEoQ731fbZqhMI1Zxrn622rI4kVOmZ0SqVb+/FJy18k/+lSltsk/gSz6Fb5jsAwBXtw9APbp2wAghHrHIL0UlE73Z9SWgDGlWuOOqxNNDmUC3yaixD1RXn63RH5wVWb/rGeyXJA6ipGIZ0NpErSCgpB1HXyfKug6rABdKOX28XhJN5ewM/xkvscCBsx6BfzCE0QgevMMm7ecoA7eTmsEaG0E8/RIUYRYmdXpi8GkxCjFt4+j//UiZV53BjCz8g76yULHYuL27ZjBbkFo33BvO/YN1O9pA9Q//5SDX1cGJ/v7QYvO11l8SAVMfVVLoJAc/OZozZc6qymE4TTLGgth35k/rcMp977Dec/sKGL8qPHwn0b3N+ZM4fp8/njjIkVXlaCCEuTsHtL/+AANohGzx9Gab4BPJXmboSE8BENkbVfS+sdqeHOxcV/uy8hE5W4TvvfBvCsFApTjY5KCJ53P2FqvPWxKtEZea37ZmoHsztvMvJz+epZ08vBN3LziodOgvqkl95RNVpog3lcG/VSEaiICGa+kFir73zFzF/s+gFHh7JGB0t3gaNBqMywGoQXlE7J+MSU5/RwnNTLp+U6Afne15y/liK1BRSnQ5ZVb3/DB4/9BYWZ0ayBoPf4zNI3dflHCCoAH1V0mwqe9dUkfT+QNojAJww0du/DZEUB8jxyelWqWAfh32ZteO8DELebLaH7ghCBDDGVjhYQ9mLe3MwQuDYOQ5FXlIYHeWdPR7WJY2W60KLECM3F1aA/ve2/4oR9h7mj9k3fYGdPshWcF8+rE5vgR51894E8uWzj362UpgAHJGRq2S6MXD+xoMwaHrDrjA/YaWZtxCDRAnWBkL9hH8Slv/fcsKESMjzYpjXPQDlb81DH+NHe3aSePk6OeEEkEZEUGoxTKRhp0Hr7fGUFEOXlnAa1cK4q4LhpeDPXfgBaKb34CH/8Oh71XdvW7BllRAhjAV8zgn9iXtcF50mrlRkvRGCbDgmoxvTCqGOBFpm4HXn41Rl0RO/jzf0fJ1KH7Xvrr3IA7ZpEtgFc1qd9F38mk05sDJrwUI3DmhyCyzW8w3ICygKeZhKSPqVC3lCujw95IlcJLUHad99B2lnPj5VsJxFH6cDRHGanAJSpq3v4Cd8hPVe3VoDrPEq6JmymmEmSyoD4e/iEmw8xd8QOlXO/yyLJIXWLHLghfkcGz1TgAcjjduPdii1ghRpU7SbbIuXEJ8o30Ydwoca4Wt/3O2Ptuczk5HEc2YkLYPAUDDUV30aXPTz423X217D8p/BTIBbSDrvEsczSOZo+H+p+CflSVwuw/o3sb0k+1wM1Fac88hR/uYZJ1mNDbT6kS35LxnMO0gHE8H6x7oKIQ/atvTIMfcySONG9HMnyJzxMSIsXnaFSIgAdNjgoCXxFfLxXERMxv0ofZxs7DEp6ORNqhCMcgBireFlXBddRDDf8m39+qBIkcmrhvKdvs+U45pO9BVkJsgMFMa4BwBUru38VPV4I82F29Il/vGGM5KEYF3rZuP3H1US/ZXX2yEw8QzWVLDRWSxMgqSK8kY1VWzybSbcYrVza4jkCSVIBPJUCMtDQTB6NtY93V1OmX3cKO3iwVXV9bjGapR3Fan9JgDAGPZnBq5eaeyEaJlUvN4V+X5rWRh5t/et6Kbvre/Uxx+vV1BoM8RmlfX/T8FiXjz8j/4X35+HBas9L/h56rINIjM+R+knuk/iwtaLAnDZKotO3GZAqZGIhztFrdsw9V/VmSXfd8TSYi7negtKq96SAcKDvQGMoh4402yGc2yKqf2I/wIK71qSv9TSquPDxqz55QgrG6NK41pMHcSjF0LzoPGIG7iMVTBkVaxDmnjOTwGxn8NfGZujaDrGFu4zY0+Ma9UjO7ilFhQVJr4UoQm22aKAMJFNMB9jIq7mkunt5mrpjGhvKxhAXUYSZ4piN48zTEJ748nQ8A3UWbc8YrxrR/KKTGMK3JRDY+Sdd1i2k176dydLWlpB6LFEWT6tBPcPi0bCCWCTuPYgCPH9WeMojVSBzaloSswELDq+y/t4OTR2Lgffsi7m32wgv9G16Sf+0/WuW409MsGIkQ1RNF140i8c74Ir1ZoftV4P/bFmpfJaMmaYVywdA7dwT/I8dmQhR49Y6gaEXQum+h3yCr8PlptOmXt1M7fE73zIri2A0YRl99Gv2CLuxgVxqnxmX5dEhnD9VMwPzLaQa5iXUblgyaMC26sOLrua9jVpfBbr3x2pKm+pddfY75W5Fh5LjNQQgUvhdhm4r8cMVx5fevMUlw2pKQS7o6g1lOyuVlifjI9NLm8l/ZSqqbx9/I+f5Zgr6/O0UStKlQIHTaiVsLR94T0qexKoGjSn19ZpOgO4iGj3u0MckEH8aGP73lNa/k2sGd9lJsaAE7myTf0tfSf7VhHr3RosbDChrrc3ifboXZTWG84yOC2xGDkSn9wC5GO2Epdt/ymxd5TmuavSMhV8OJ31JVdUWBLyf8x6l8Sj6c+HzF/qzdlmfg9+bkbwcKJogBD9ZQLVpSWOP03RzuEwYhFI/neGfHC0Csw/0t8H8tsn8Ekn/oS6BjKg9SYUMURYf8EFVoTsqtS74TCCDCoqToUCA2T0vzNmogdgJsPB2XebTsmB4yWHJjdMAohNk79RFLFLuC/vNHXG3lept78isQ6e6lZitQgmiBMIS4wAfOBuOpBUCS9nx8qzv/KX0dAlCmVU5YcYnfziz5pJnR0zlGGnnTmLi1u54ELnLrjOWcVzetgP06xlejcDa0z8+3eyd0oKXgaEvYx73kexzJb8ECkyL2q2bQMbv/7ZGcU6KnjEw3nGAjnp9f8xH0+F42e3oNmwpZTf2caX7ETNwvA6a2LXyYAGLY9pAaXHnq01WA0dLGNpyqp8I75ptF6puj4I79qFFh34/7QBfwKFlcFU32/2XyMYLgXw3yT46Uc7naGpLJW2V8+fy4hY8TBqzMF6s5KqZ/gRm8Z3dILO3ymB2oo9ShehGHcDlTW1YCslPjR/FbZRIL5FifO5nSD4xkQG8p3pcnpyhHyLnBOK7t1YHlcGmWd5xn7D/S2t/CB6WJcD89BfKK5dHVB72gAqcIpjd+6bKeSi9ga+CsQS53883aHRKwZdduXf3srxIddw8A6cm91uwfszrkg+D6Tuf6wJdx2jC+5kUH9Q8efbJWprFPaowj7v57sKD1aOKkSp4B0jv7f1jMnUUaAhmYW1JNgkdqsXa5uOtjiggIgl+HDyEoI7Drpg71rbB2i78ZIq7hXVNk6MN6QIWWhKugd6RXXlK6pJGHoy/3wPp/4x1/jPZjezq1UjveTJqcRhgAAA', w: 240, h: 387, x: 83, y: 30, dw: 74, dh: 120, lens: [.77, .21], led: null, sc: 7 },
  };
  // détecteur photo détouré, sans décor : seules les ondes de détection, la lueur, le voyant et la pile l'accompagnent
  const photoScene = (M) => {
    const lx = M.x + M.lens[0] * M.dw, ly = M.y + M.lens[1] * M.dh;
    let g = `<g><ellipse class="alertglow" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="110" ry="100"/>`;
    g += '<g class="fig" id="msfig"></g>';
    g += [0, 1, 2, 3, 4].map((i) => `<circle class="arc a${i + 1}" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="9" style="transform-origin:${lx.toFixed(1)}px ${ly.toFixed(1)}px;--sc:${M.sc}"/>`).join('');
    g += `<image href="${M.img}" x="${M.x}" y="${M.y}" width="${M.dw}" height="${M.dh}"/>`;
    g += `<circle class="lensglow" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${Math.max(5, M.dw * .11)}"/>`;
    if (M.led) g += `<circle class="led" cx="${(M.x + M.led[0] * M.dw).toFixed(1)}" cy="${(M.y + M.led[1] * M.dh).toFixed(1)}" r="1.9"/>`;
    g += '<g class="bat" transform="translate(206 8)"><rect x="0" y="0" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="22" y="3" width="3" height="6" fill="#ffa000"/><path d="M3 3h4v6H3z" fill="#ffa000"/></g></g>';
    return g;
  };

  // background_image : photo de la pièce derrière un détecteur « photo » (URL http(s), /local/…, /api/… ou data:image) ;
  // recadrée pour remplir la carte, avec les mêmes coins arrondis que l'illustration
  const bgImage = (u) => {
    u = typeof u === 'string' ? u.trim() : '';
    if (!/^(https?:\/\/|\/|data:image\/)/i.test(u) || /^\/\//.test(u)) return '';
    return `<g clip-path="url(#msclip)"><image href="${u.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')}" width="240" height="200" preserveAspectRatio="xMidYMid slice"/></g>`;
  };

  const TILES = [['battery', 'mdi:battery', 'show_battery'], ['since', 'mdi:clock-outline', 'show_since'], ['lux', 'mdi:brightness-5', 'show_lux'], ['temp', 'mdi:thermometer', 'show_temp']];

  class ApplianceMotionSensorCard extends HTMLElement {
    get _config() { return this._c; } // nom standard lu par card-mod
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const m = ids.find((i) => i.startsWith('binary_sensor.') && ['motion', 'occupancy', 'presence'].includes(dc(i))) || '';
      const dev = m.split('.')[1]?.replace(/_(motion|occupancy|presence)$/, '') || '\u0000';
      const f = (cls) => ids.find((i) => i.startsWith('sensor.') && dc(i) === cls && i.includes(dev)) || '';
      return { entity: m, entity_battery: f('battery'), entity_illuminance: f('illuminance'), entity_temperature: f('temperature') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object' || !c.entity) throw new Error('entity is required');
      this._c = { model: 'room', recent_motion_minutes: 10, battery_low: 20, show_status: true, show_battery: true, show_since: true, show_lux: true, show_temp: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }
    disconnectedCallback() { this._stop(); }
    connectedCallback() { if (this._built && this._motion) this._play(); }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _dur(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 60 ? [sec, 'second'] : sec < 3600 ? [sec / 60, 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return new Intl.NumberFormat(window.applianceLocale(this._c, this._hass, true), { style: 'unit', unitDisplay: 'short', unit: u, maximumFractionDigits: 0 }).format(Math.floor(n)); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), M = MODELS[this._c.model] || null;
      this._photo = !!M;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mstitle"></div><div class="badge" id="msbadge"></div></div>
        <svg viewBox="0 0 240 200" role="img" aria-label="${(this._c.name || this._t('name')).replace(/"/g, '')}">${SCENE}${M ? bgImage(this._c.background_image) + photoScene(M) : room()}</svg>
        <div class="line" id="msline"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more({ battery: this._c.entity_battery, since: this._c.entity, lux: this._c.entity_illuminance, temp: this._c.entity_temperature }[el.dataset.k])));
      this._root = root; this._card = root.querySelector('ha-card'); this._fig = root.getElementById('msfig'); this._built = true; this._motion = false;
    }

    // la silhouette marche en JavaScript, uniquement pendant un mouvement (sans animation : une pose figée)
    _play() {
      this._stop();
      if (this._photo) return; // modèles photo : pas de silhouette, seulement les ondes (CSS)
      const still = this._c.animations === false || matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) { this._fig.innerHTML = actors(1.3); return; }
      const t0 = performance.now(), step = (now) => { this._fig.innerHTML = actors((now - t0) / 1000 + 1.3); this._raf = requestAnimationFrame(step); };
      this._raf = requestAnimationFrame(step);
    }
    _stop() { cancelAnimationFrame(this._raf); this._raf = 0; }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity);
      const raw = s ? String(s.state).toLowerCase() : 'unavailable', alive = this._ok(s), on = alive && /^(on|detected|motion|true|home)$/.test(raw);
      const mins = alive ? (Date.now() - Date.parse(s.last_changed)) / 60000 : 0;
      const recent = alive && !on && Number(c.recent_motion_minutes) > 0 && mins < Number(c.recent_motion_minutes);
      const st = !alive ? (raw === 'unknown' ? 'unknown' : 'unavailable') : on ? 'motion' : recent ? 'recent' : 'clear';
      const bS = this._st(c.entity_battery), bin = !!bS && /^binary_sensor\./.test(c.entity_battery), bat = !bin ? this._num(bS) : NaN;
      const low = bin ? this._ok(bS) && /^(on|true|low)$/i.test(bS.state) : isFinite(bat) && bat < Number(c.battery_low);
      card.className = `${st}${low ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('mstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('msbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('msline').textContent = st === 'motion' ? this._t('motion_for').replace('{time}', this._dur(s)) : st === 'recent' ? this._t('last_motion').replace('{time}', this._dur(s)) : '';
      if (on !== this._motion) { this._motion = on; if (on) this._play(); else setTimeout(() => { if (!this._motion) this._stop(); }, 450); }
      // les tuiles : batterie, durée, luminosité, température
      const lS = this._st(c.entity_illuminance), tS = this._st(c.entity_temperature);
      const fmt = (x, n) => { try { return new Intl.NumberFormat(this._lang(), { maximumFractionDigits: n }).format(x); } catch (e) { return String(x); } };
      const unit = (e) => (e && e.attributes && e.attributes.unit_of_measurement) || '';
      const lx = this._num(lS), tp = this._num(tS);
      const V = {
        battery: [c.entity_battery, isFinite(bat) ? String(Math.round(bat)) : this._ok(bS) ? this._t(low ? 'low' : 'ok') : '--', isFinite(bat) ? '%' : '', low ? 'bad' : ''],
        since: [c.entity, this._dur(s), '', ''],
        lux: [c.entity_illuminance, isFinite(lx) ? fmt(lx, 0) : '--', isFinite(lx) ? (unit(lS) || 'lx') : '', ''],
        temp: [c.entity_temperature, isFinite(tp) ? fmt(tp, 1) : '--', isFinite(tp) ? unit(tS) : '', ''],
      };
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', low ? 'mdi:battery-alert' : 'mdi:battery');
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, un, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false); el.classList.toggle('bad', cls === 'bad');
        el.querySelector('.lbl').textContent = k === 'since' ? this._l(on ? 'since_motion' : 'since_clear') : this._l(k === 'lux' ? 'illuminance' : k === 'temp' ? 'temperature' : k);
        const small = document.createElement('small'); small.textContent = un; el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  customElements.define(TAG, ApplianceMotionSensorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMotionSensorCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'room', label: tr.model_room }, { value: 'aqara', label: tr.model_aqara }, { value: 'luminea', label: tr.model_luminea }, { value: 'wall', label: tr.model_wall }, { value: 'radar', label: tr.model_radar }] } } },
        { name: 'entity', required: true, selector: { entity: { domain: 'binary_sensor' } } },
        { name: 'entity_battery', selector: { entity: { domain: ['sensor', 'binary_sensor'] } } },
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        { name: 'entity_illuminance', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor' } } },
        { name: 'background_image', selector: { text: {} } },
        { name: 'recent_motion_minutes', default: 10, selector: { number: { min: 0, max: 1440, step: 1, mode: 'box', unit_of_measurement: 'min' } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_battery'), bool('show_since'), bool('show_lux'), bool('show_temp'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'door_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMotionSensorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Détecteur de mouvement animé : coin de pièce, arcs de détection, silhouette qui marche, mouvement récent, batterie, luminosité, température.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/motion-sensor.md',
  });
})();
