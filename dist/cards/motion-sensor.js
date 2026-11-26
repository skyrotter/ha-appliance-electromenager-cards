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
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Motion sensor","model_room":"Room scene (default)","model_aqara":"Stand sensor (Aqara type)","model_luminea":"Flat sensor (Luminea type)","model_wall":"Round wall sensor","model_radar":"PIR + radar sensor (Tuya type)","background_image":"Background photo (URL or /local/… path, detector photo models only)","clear":"No motion","motion":"Motion detected","recent":"Recent motion","unavailable":"Unavailable","unknown":"Unavailable","battery":"Battery","since_motion":"Active for","since_clear":"Quiet for","motion_for":"Motion detected for {time}","last_motion":"Last motion {time} ago","illuminance":"Light","temperature":"Temperature","low":"Low","ok":"OK"},"es":{"name":"Sensor de movimiento","model_room":"Escena de habitación (por defecto)","model_aqara":"Sensor con soporte (tipo Aqara)","model_luminea":"Sensor plano (tipo Luminea)","model_wall":"Sensor de pared redondo","model_radar":"Sensor PIR + radar (tipo Tuya)","background_image":"Foto de fondo (URL o ruta /local/…, solo modelos con foto del detector)","clear":"Sin movimiento","motion":"Movimiento detectado","recent":"Movimiento reciente","unavailable":"No disponible","unknown":"No disponible","battery":"Batería","since_motion":"Activo desde hace","since_clear":"En calma desde hace","motion_for":"Movimiento detectado desde hace {time}","last_motion":"Último movimiento hace {time}","illuminance":"Luz","temperature":"Temperatura","low":"Baja","ok":"OK"},"fr":{"name":"Détecteur de mouvement","model_room":"Scène de pièce (défaut)","model_aqara":"Détecteur sur pied (type Aqara)","model_luminea":"Détecteur plat (type Luminea)","model_wall":"Détecteur mural rond","model_radar":"Détecteur PIR + radar (type Tuya)","background_image":"Photo de fond (URL ou chemin /local/…, modèles photo du détecteur uniquement)","clear":"Aucun mouvement","motion":"Mouvement détecté","recent":"Mouvement récent","unavailable":"Indisponible","unknown":"Indisponible","battery":"Batterie","since_motion":"Actif depuis","since_clear":"Calme depuis","motion_for":"Mouvement détecté depuis {time}","last_motion":"Dernier mouvement il y a {time}","illuminance":"Luminosité","temperature":"Température","low":"Faible","ok":"OK"},"pt-BR":{"name":"Sensor de movimento","model_room":"Cena de cômodo (padrão)","model_aqara":"Sensor com suporte (tipo Aqara)","model_luminea":"Sensor plano (tipo Luminea)","model_wall":"Sensor de parede redondo","model_radar":"Sensor PIR + radar (tipo Tuya)","clear":"Sem movimento","motion":"Movimento detectado","recent":"Movimento recente","unavailable":"Indisponível","unknown":"Indisponível","battery":"Bateria","since_motion":"Ativo há","since_clear":"Calmo há","motion_for":"Movimento detectado há {time}","last_motion":"Último movimento há {time}","illuminance":"Luminosidade","temperature":"Temperatura","low":"Fraca","ok":"OK","background_image":"Foto de fundo (URL ou caminho /local/…, apenas modelos com foto do detector)"},"pt-PT":{"name":"Sensor de movimento","model_room":"Cena de divisão (predefinição)","model_aqara":"Sensor com suporte (tipo Aqara)","model_luminea":"Sensor plano (tipo Luminea)","model_wall":"Sensor de parede redondo","model_radar":"Sensor PIR + radar (tipo Tuya)","clear":"Sem movimento","motion":"Movimento detetado","recent":"Movimento recente","unavailable":"Indisponível","unknown":"Indisponível","battery":"Bateria","since_motion":"Ativo há","since_clear":"Calmo há","motion_for":"Movimento detetado há {time}","last_motion":"Último movimento há {time}","illuminance":"Luminosidade","temperature":"Temperatura","low":"Fraca","ok":"OK","background_image":"Foto de fundo (URL ou caminho /local/…, apenas modelos com foto do detector)"},"ru":{"name":"Датчик движения","model_room":"Сцена комнаты (по умолчанию)","model_aqara":"Датчик на подставке (типа Aqara)","model_luminea":"Плоский датчик (типа Luminea)","model_wall":"Круглый настенный датчик","model_radar":"PIR + радар датчик (типа Tuya)","background_image":"Фоновое фото (URL или путь /local/…, только для фото-моделей)","clear":"Нет движения","motion":"Обнаружено движение","recent":"Недавнее движение","unavailable":"Недоступно","unknown":"Недоступно","battery":"Батарея","since_motion":"Активно уже","since_clear":"Тихо уже","motion_for":"Движение {time}","last_motion":"Последнее движение {time} назад","illuminance":"Освещённость","temperature":"Температура","low":"Низкий","ok":"ОК"},"uk":{"name":"Датчик руху","model_room":"Кімната (типово)","model_aqara":"Датчик на підставці (типу Aqara)","model_luminea":"Плаский датчик (типу Luminea)","model_wall":"Круглий настінний датчик","model_radar":"Датчик PIR + радар (типу Tuya)","background_image":"Фонове фото (URL або шлях /local/…, лише для моделей з фото датчика)","clear":"Руху немає","motion":"Виявлено рух","recent":"Нещодавно був рух","unavailable":"Недоступно","unknown":"Недоступно","battery":"Батарея","since_motion":"Рух триває","since_clear":"Тихо вже","motion_for":"Рух уже {time}","last_motion":"Останній рух {time} тому","illuminance":"Освітленість","temperature":"Температура","low":"Низький","ok":"ОК"}};

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
    aqara: { img: window.__acImg("motion-sensor",0), w: 240, h: 576, x: 89, y: 30, dw: 62, dh: 148, lens: [.51, .22], led: [.315, .07], floor: true, sc: 7 },
    luminea: { img: window.__acImg("motion-sensor",1), w: 199, h: 466, x: 90, y: 24, dw: 60, dh: 140, lens: [.34, .48], led: [.34, .88], sc: 7 },
    wall: { img: window.__acImg("motion-sensor",2), w: 350, h: 292, x: 55, y: 38, dw: 130, dh: 108, lens: [.82, .71], led: null, sc: 7 },
    radar: { img: window.__acImg("motion-sensor",3), w: 240, h: 387, x: 83, y: 30, dw: 74, dh: 120, lens: [.77, .21], led: null, sc: 7 },
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
      this._root = root; this._card = root.querySelector('ha-card'); this._fig = root.getElementById('msfig'); this._figEls = null; this._figHtml = ''; this._built = true; this._motion = false;
    }

    // la silhouette marche en JavaScript, uniquement pendant un mouvement (sans animation : une pose figée)
    _play() {
      this._stop();
      if (this._photo) return; // modèles photo : pas de silhouette, seulement les ondes (CSS)
      const still = this._c.animations === false || matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) { this._paint(1.3); return; }
      const t0 = performance.now(), step = (now) => { this._paint((now - t0) / 1000 + 1.3); this._raf = requestAnimationFrame(step); };
      this._raf = requestAnimationFrame(step);
    }
    // une image de la silhouette : le balisage n'est construit qu'une fois ; ensuite (même structure à chaque image)
    // on ne recopie que les attributs qui ont changé sur les éléments existants, sans reconstruire le DOM
    _paint(t) {
      const html = actors(t);
      if (html === this._figHtml) return;
      this._figHtml = html;
      const tags = html.match(/<[a-z][^>]*>/gi) || [], els = this._figEls;
      if (!els || els.length !== tags.length) { this._fig.innerHTML = html; this._figEls = [...this._fig.querySelectorAll('*')]; return; }
      tags.forEach((tag, i) => {
        const el = els[i];
        for (const [, k, v] of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) if (el.getAttribute(k) !== v) el.setAttribute(k, v);
      });
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
