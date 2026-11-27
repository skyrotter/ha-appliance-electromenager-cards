/* Carte « Chauffe-eau thermodynamique » — custom:appliance-thermo-heater-card
 * Ballon à pompe à chaleur (type Ariston Nuos) : photo détourée + écorché du ballon (dessin proposé par Ppatou, #268).
 * Le ballon se remplit du bleu (froid) au rouge (chaud) selon la réserve d'eau chaude, le ventilateur tourne en modes
 * Éco (green) et Boost, la résistance rougit en Boost. Modes : off / pause / green / boost, lus sur l'entité (water_heater,
 * select…) ou déduits de la puissance. Tuiles : énergie, puissance, mode, température, consigne, eau chaude, volume,
 * dernier cycle (option last_cycle : début → fin, durée, conso, lus dans l'historique de Home Assistant).
 */
(() => {
  const TAG = 'appliance-thermo-heater-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Thermodynamic water heater","mode_off":"Off","mode_pause":"Pause","mode_green":"Green","mode_boost":"Boost","mode_unavailable":"Unavailable","energy":"Energy","power":"Power","mode":"Mode","temp":"Temperature","target":"Target","bottom":"Bottom","reserve":"Hot water","volume":"Volume","cycle":"Last cycle","duration":"Cycle duration","cycle_kwh":"Cycle energy"},"da":{"name":"Varmepumpevandvarmer","mode_off":"Slukket","mode_pause":"Pause","mode_green":"Grøn","mode_boost":"Boost","mode_unavailable":"Utilgængelig","energy":"Energi","power":"Effekt","mode":"Tilstand","temp":"Temperatur","target":"Mål","bottom":"Bund","reserve":"Varmt vand"},"de":{"name":"Wärmepumpen-Warmwasserbereiter","mode_off":"Aus","mode_pause":"Pause","mode_green":"Eco","mode_boost":"Boost","mode_unavailable":"Nicht verfügbar","energy":"Energie","power":"Leistung","mode":"Modus","temp":"Temperatur","target":"Soll","bottom":"Unten","reserve":"Warmwasser","volume":"Volumen","cycle":"Letzter Zyklus","duration":"Zyklusdauer","cycle_kwh":"Zyklusenergie"},"es":{"name":"Termo termodinámico","mode_off":"Apagado","mode_pause":"Pausa","mode_green":"Verde","mode_boost":"Boost","mode_unavailable":"No disponible","energy":"Energía","power":"Potencia","mode":"Modo","temp":"Temperatura","target":"Objetivo","bottom":"Parte inferior","reserve":"Agua caliente","volume":"Volumen","cycle":"Último ciclo","duration":"Duración del ciclo","cycle_kwh":"Energía del ciclo"},"fr":{"name":"Chauffe-eau thermodynamique","mode_off":"Arrêt","mode_pause":"Pause","mode_green":"Vert (éco)","mode_boost":"Boost","mode_unavailable":"Indisponible","energy":"Énergie","power":"Puissance","mode":"Mode","temp":"Température","target":"Consigne","bottom":"Bas du ballon","reserve":"Eau chaude","volume":"Volume","cycle":"Dernier cycle","duration":"Durée du cycle","cycle_kwh":"Conso du cycle"},"hu":{"name":"Termodinamikus bojler","mode_off":"Ki","mode_pause":"Szünet","mode_green":"Zöld","mode_boost":"Boost","mode_unavailable":"Nem elérhető","energy":"Energia","power":"Teljesítmény","mode":"Mód","temp":"Hőmérséklet","target":"Cél","bottom":"Alsó","reserve":"Meleg víz"},"pl":{"name":"Termodynamiczny podgrzewacz wody","mode_off":"Wył.","mode_pause":"Pauza","mode_green":"Eko","mode_boost":"Boost","mode_unavailable":"Niedostępny","energy":"Energia","power":"Moc","mode":"Tryb","temp":"Temperatura","target":"Cel","bottom":"Dół","reserve":"Ciepła woda"},"pt-BR":{"name":"Aquecedor de água termodinâmico","mode_off":"Desligado","mode_pause":"Pausa","mode_green":"Verde","mode_boost":"Reforço","mode_unavailable":"Indisponível","energy":"Energia","power":"Potência","mode":"Modo","temp":"Temperatura","target":"Desejada","bottom":"Parte inferior","reserve":"Água quente","volume":"Volume","cycle":"Último ciclo","duration":"Duração do ciclo","cycle_kwh":"Energia do ciclo"},"pt-PT":{"name":"Aquecedor de água termodinâmico","mode_off":"Desligado","mode_pause":"Pausa","mode_green":"Verde","mode_boost":"Reforço","mode_unavailable":"Indisponível","energy":"Energia","power":"Potência","mode":"Modo","temp":"Temperatura","target":"Pretendida","bottom":"Parte inferior","reserve":"Água quente","volume":"Volume","cycle":"Último ciclo","duration":"Duração do ciclo","cycle_kwh":"Energia do ciclo"},"ru":{"name":"Теплонасосный водонагреватель","mode_off":"Выключен","mode_pause":"Пауза","mode_green":"Эко","mode_boost":"Турбо","mode_unavailable":"Недоступно","energy":"Энергия","power":"Мощность","mode":"Режим","temp":"Температура","target":"Цель","bottom":"Низ бака","reserve":"Горячая вода","volume":"Объём","cycle":"Последний цикл","duration":"Длительность цикла","cycle_kwh":"Энергия цикла"},"sr":{"name":"Термодинамички бојлер","mode_off":"Искључено","mode_pause":"Пауза","mode_green":"Зелени","mode_boost":"Појачано","mode_unavailable":"Недоступно","energy":"Енергија","power":"Снага","mode":"Режим","temp":"Температура","target":"Циљна","bottom":"Дно","reserve":"Топла вода"},"sr-Latn":{"name":"Termodinamički bojler","mode_off":"Isključeno","mode_pause":"Pauza","mode_green":"Zeleni","mode_boost":"Pojačano","mode_unavailable":"Nedostupno","energy":"Energija","power":"Snaga","mode":"Režim","temp":"Temperatura","target":"Ciljna","bottom":"Dno","reserve":"Topla voda"},"uk":{"name":"Термодинамічний бойлер","mode_off":"Вимк.","mode_pause":"Пауза","mode_green":"Еко","mode_boost":"Форсаж","mode_unavailable":"Недоступно","energy":"Енергія","power":"Потужність","mode":"Режим","temp":"Температура","target":"Ціль","bottom":"Низ","reserve":"Гаряча вода","volume":"Об'єм","cycle":"Останній цикл","duration":"Тривалість циклу","cycle_kwh":"Енергія циклу"}};
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  // Dernier cycle terminé d'après l'historique de la puissance (même logique que la carte chauffe-eau).
  // pw : [{ t (ms), w (W) }] trié ; cycle = puissance > seuil, les creux plus courts que gapMin restent dans le cycle.
  // en : [{ t, v (kWh) }] compteur d'énergie, facultatif. Renvoie { start, end, kwh } ou null (aucun cycle, ou cycle en cours).
  const lastCycle = (pw, threshold, gapMin, en) => {
    const gap = gapMin * 60000;
    let start = null, lastOn = null, cyc = null;
    for (let i = 0; i < pw.length; i++) {
      const p = pw[i], next = pw[i + 1];
      if (!(p.w > threshold)) continue;
      const offAt = next ? next.t : null;
      if (start === null || p.t - lastOn > gap) { if (start !== null) cyc = { start, end: lastOn }; start = p.t; }
      lastOn = offAt;
      if (offAt === null) return null; // encore au-dessus du seuil : cycle en cours
    }
    if (start !== null && lastOn !== null) cyc = { start, end: lastOn };
    if (!cyc || cyc.end - cyc.start < 120000) return null; // moins de 2 min : pic parasite
    // énergie : écart du compteur, sinon intégrale de la puissance
    const at = (T) => { let v = null; for (const e of en) { if (e.t <= T) v = e.v; else break; } return v; };
    const e0 = at(cyc.start), e1 = at(cyc.end + 60000);
    let kwh = e0 != null && e1 != null && e1 >= e0 ? e1 - e0 : null;
    if (kwh === null) {
      kwh = 0;
      for (let i = 0; i < pw.length - 1; i++) {
        const a = Math.max(pw[i].t, cyc.start), b = Math.min(pw[i + 1].t, cyc.end);
        if (b > a && pw[i].w > 0) kwh += pw[i].w * (b - a) / 3.6e9;
      }
    }
    return { ...cyc, kwh };
  };
  const fmtDur = (min) => { const m = Math.round(min); if (m < 60) return `${m} min`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`; };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--th-ok:var(--appliance-ok-color,#43a047);--th-heat:var(--appliance-heat-color,#ff8a00);
  --th-alert:var(--appliance-alert-color,#db4437);--spd:2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.green .badge{background:color-mix(in srgb,var(--th-ok) 22%,transparent);color:var(--th-ok)}
.boost .badge{background:color-mix(in srgb,var(--th-heat) 22%,transparent);color:var(--th-heat)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(130px * var(--illus-scale,1));width:calc(130px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
/* ---- illustration ---- */

.at{max-width:calc(100% * var(--illus-scale,.75))}
/* layout: vertical : grande photo pleine largeur, tuiles dessous (défaut du modèle photo) */
.vert .body{flex-direction:column;align-items:stretch;flex-wrap:nowrap}
.vert svg{flex:none;width:calc(100% * var(--illus-scale,.75));max-width:100%}
.vert .tiles{flex:none;width:100%;grid-template-columns:repeat(auto-fit,minmax(76px,1fr))}
.at-tint{opacity:.27;mix-blend-mode:multiply}
.at-air path{stroke:#dfe9f3;stroke-width:5;stroke-linecap:round;stroke-dasharray:26 70;opacity:0}
.green .at-air path,.boost .at-air path{opacity:.75}
.at-in{animation:atin 1.6s linear infinite}.at-out{animation:atout 1.6s linear infinite}
@keyframes atin{to{stroke-dashoffset:-96}}@keyframes atout{to{stroke-dashoffset:96}}
.green .at-body,.boost .at-body{animation:atvib .16s linear infinite}
@keyframes atvib{50%{transform:translate(.9px,.4px)}}
.at-glow{opacity:0}.boost .at-glow{opacity:.85;animation:atglow 1.4s ease-in-out infinite alternate}
@keyframes atglow{from{opacity:.55}to{opacity:1}}
.at-d{stroke-dasharray:2 44;opacity:0}.draw .at-d{opacity:.95}
.draw .at-hot{animation:atup 1.2s linear infinite}.draw .at-cold{animation:atup 1.2s linear infinite}
@keyframes atup{to{stroke-dashoffset:-46}}
.off .at-tint,.unavailable .at-tint{opacity:.12}
.noanim .at-in,.noanim .at-out,.noanim .at-body,.noanim .at-glow,.noanim .at-d{animation:none!important}
.th-fan{transform-box:fill-box;transform-origin:50% 50%}
/* modèle Thermor Aéromax Split */
.tm-tint{opacity:.27;mix-blend-mode:multiply;transition:opacity .4s}.off .tm-tint,.unavailable .tm-tint{opacity:0}
.tm-val{fill:#5b6672;opacity:.88;font:600 118px Roboto,Arial,sans-serif;letter-spacing:-4px}.off .tm-val,.unavailable .tm-val{opacity:.4}
.tm-fanw{pointer-events:none}.tm-fan{transform-box:fill-box;transform-origin:50% 50%}
.tm-blade{fill:#353d46;stroke:#5c6772;stroke-width:2;stroke-linejoin:round}.tm-hub{fill:#262c33;stroke:#56606b;stroke-width:2}
.green .tm-blade,.boost .tm-blade{filter:blur(.7px)}.tm-grille{pointer-events:none}
.green .tm-fan,.boost .tm-fan{animation:thspin var(--spd) linear infinite}.boost .tm-fan{animation-duration:calc(var(--spd) * .55)}
.tm-air path{stroke:#9fc4ea;stroke-width:9;stroke-linecap:round;stroke-dasharray:44 110;opacity:0}
.green .tm-air path,.boost .tm-air path{opacity:.75;animation:tmair 1.5s linear infinite}@keyframes tmair{to{stroke-dashoffset:154}}
.tm-ins{stroke:#2e3338;stroke-width:12}.tm-hot,.tm-cold{stroke-width:4;stroke-dasharray:10 18;opacity:.35}.tm-hot{stroke:#ff7a45}.tm-cold{stroke:#5ec8ff}
.green .tm-hot,.boost .tm-hot,.green .tm-cold,.boost .tm-cold{opacity:1;animation:tmline 1.1s linear infinite}@keyframes tmline{to{stroke-dashoffset:-28}}
.off .tm-hot,.off .tm-cold,.unavailable .tm-hot,.unavailable .tm-cold{opacity:.15}
.tm-glow{opacity:0}.boost .tm-glow{opacity:.85;animation:atglow 1.4s ease-in-out infinite alternate}
.noanim .tm-fan,.noanim .tm-air path,.noanim .tm-glow,.noanim .tm-hot,.noanim .tm-cold{animation:none!important}
.th-big{filter:drop-shadow(0 0 6px rgba(0,0,0,.85));pointer-events:none}
.th-big text{fill:#fff;stroke:rgba(20,22,28,.8);stroke-width:14px;paint-order:stroke;stroke-linejoin:round;font:700 120px Roboto,Arial,sans-serif;text-anchor:middle;dominant-baseline:central}
.th-lcd-txt{fill:#7fe0ff;font:700 29px 'Courier New',monospace;text-anchor:middle;dominant-baseline:central}.off .th-lcd-txt,.unavailable .th-lcd-txt{fill:#4f7d8f}
.green .th-fan,.boost .th-fan{animation:thspin var(--spd) linear infinite}
.boost .th-fan{animation-duration:calc(var(--spd) * .55)}
.th-elem path{fill:#8d8d8d;transition:fill .4s}
.boost .th-elem path{fill:#ff1a1a;animation:thglow 1.2s ease-in-out infinite alternate}
.th-water{transition:filter .4s}
.off .th-water,.unavailable .th-water{filter:grayscale(.85) opacity(.6)}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .th-fan,.noanim .th-elem path{animation:none}
@keyframes thspin{to{transform:rotate(360deg)}}
@keyframes thglow{from{opacity:.65}to{opacity:1}}
`;

  // Photo détourée (480 × 1088) et ventilateur découpé (disque tournant), en pixels de la photo d'origine 738 × 1674.
  const PHOTO = window.__acImg("thermo-heater",0);
  const FAN = window.__acImg("thermo-heater",1);
  // Écorché : coordonnées du dessin d'origine (photo placée en 94, 255, 935 × 2120) → groupe mis à l'échelle de la photo.
  const SVG = (label) => `<svg viewBox="0 0 738 1674" role="img" aria-label="${label}"><defs>
    <radialGradient id="th2" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.00056481 1.02047 -0.0256174 -0.00127952 225 884)" cx="198" cy="1084" r="329" fx="198" fy="1084"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th3" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-1.02038 0.00265846 0.00127951 -0.120586 579 594)" cx="287" cy="530" r="100" fx="287" fy="530"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th4" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-1.02038 0.00322753 0.00127951 -0.1464 612 782)" cx="303" cy="683" r="82" fx="303" fy="683"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th5" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.000385681 1.02047 -0.0174928 -0.00127952 181 961)" cx="161" cy="1124" r="485" fx="161" fy="1124"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th6" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16276 -0.0828705 0.00170577 0.0456112 -94 1502)" cx="561" cy="1526" r="223" fx="561" fy="1526"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th7" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.21902 0.0236432 -0.006381 0.0364952 -106 1434)" cx="528" cy="1501" r="240" fx="528" fy="1501"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th8" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.19047 -0.0579431 -0.000574884 0.0524797 -97 1648)" cx="516" cy="1708" r="169" fx="516" fy="1708"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th9" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16276 -0.0828705 0.00170577 0.0456112 -94 1563)" cx="562" cy="1589" r="223" fx="562" fy="1589"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th10" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16276 -0.0828705 0.00170577 0.0456112 -95 1623)" cx="564" cy="1652" r="223" fx="564" fy="1652"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th11" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16199 0.065115 -0.00857217 0.0450657 -78 1450)" cx="561" cy="1557" r="224" fx="561" fy="1557"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th12" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16199 0.065115 -0.00857217 0.0450657 -77 1510)" cx="563" cy="1620" r="224" fx="563" fy="1620"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient><radialGradient id="th13" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.16199 0.065115 -0.00857217 0.0450657 -77 1570)" cx="564" cy="1683" r="224" fx="564" fy="1683"> <stop offset="0" stop-color="#FEFEFE"/> <stop offset="0.870588" stop-color="#AF9E9D"/> <stop offset="1" stop-color="#613E3D"/> </radialGradient>
    <linearGradient id="thtank" gradientUnits="userSpaceOnUse" x1="506" y1="2157" x2="506" y2="867"><stop id="thg0" offset="0" stop-color="#000dc4"/><stop id="thg1" offset=".5" stop-color="#7f0762"/><stop offset="1" stop-color="#ff0000"/></linearGradient></defs>
    <image href="${PHOTO}" x="0" y="0" width="738" height="1674"/>
    <g class="th-fan"><image href="${FAN}" x="198" y="102" width="280" height="280"/></g>
    <g class="th-lcd"><rect x="488" y="196" width="108" height="62" rx="9" fill="#0c1720" stroke="#8f98a2" stroke-width="3"/><text id="thlcd" class="th-lcd-txt" x="542" y="228">--°</text></g>
    <g transform="scale(.78935) translate(-94 -255)">
      <g class="th-water"><path fill="url(#thtank)" stroke="#2b2a29" stroke-width="3" d="M923 2093c-208,92 -477,87 -699,0l1 -1145c232,-106 446,-119 699,0l-1 1145z"/></g>
      <path fill="url(#th2)" d="M208 708l0 753c0,5 -4,9 -10,9l0 0c-5,0 -12,-4 -12,-9l1 -753c0,-5 5,-9 11,-9l0 0c5,0 10,4 10,9z"/><path fill="url(#th3)" d="M381 543l-188 0c-4,0 -8,-5 -8,-11l0 0c0,-6 4,-13 8,-13l188 1c4,0 8,6 8,12l0 0c0,6 -4,11 -8,11z"/><path fill="url(#th4)" d="M379 695l-152 0c-4,0 -8,-5 -8,-11l0 0c0,-6 4,-13 8,-13l152 1c4,0 8,6 8,12l0 0c0,6 -4,11 -8,11z"/><path fill="url(#th5)" d="M174 566l0 1116c0,5 -5,9 -12,9l0 0c-7,0 -14,-4 -14,-9l2 -1116c0,-5 6,-9 13,-9l0 0c7,0 12,4 12,9z"/><path fill="url(#th6)" d="M311 1533l499 -36c6,0 10,4 11,9l0 0c0,6 -4,11 -10,11l-499 36c-6,0 -10,-4 -11,-9l0 0c0,-6 4,-11 10,-11z"/><path fill="url(#th7)" d="M246 1485l567 12c5,0 8,5 8,10l0 0c-1,6 -5,10 -10,10l-567 -12c-5,0 -8,-5 -7,-10l0 0c1,-6 5,-10 10,-10z"/><path fill="url(#th8)" d="M221 1709l590 -21c7,0 13,4 13,10l0 0c0,6 -6,11 -14,11l-590 21c-7,0 -13,-4 -13,-10l0 0c0,-6 6,-11 14,-11z"/><path fill="url(#th9)" d="M312 1596l499 -36c6,0 10,4 11,9l0 0c0,6 -4,11 -10,11l-499 36c-6,0 -10,-4 -11,-9l0 0c0,-6 4,-11 10,-11z"/><path fill="url(#th10)" d="M314 1659l499 -36c6,0 10,4 11,9l0 0c0,6 -4,11 -10,11l-499 36c-6,0 -10,-4 -11,-9l0 0c0,-6 4,-11 10,-11z"/><path fill="url(#th11)" d="M313 1533l500 28c6,0 9,5 8,11l0 0c-1,6 -6,10 -12,10l-500 -28c-6,0 -9,-5 -8,-11l0 0c1,-6 6,-10 12,-10z"/><path fill="url(#th12)" d="M315 1596l500 28c6,0 9,5 8,11l0 0c-1,6 -6,10 -12,10l-500 -28c-6,0 -9,-5 -8,-11l0 0c1,-6 6,-10 12,-10z"/><path fill="url(#th13)" d="M316 1659l500 28c6,0 9,5 8,11l0 0c-1,6 -6,10 -12,10l-500 -28c-6,0 -9,-5 -8,-11l0 0c1,-6 6,-10 12,-10z"/>
      <path fill="#825F5D" d="M247 1505l-34 -1c-12,0 -26,-12 -26,-25l0 -20 21 0 0 16c0,5 5,7 9,7l29 2 0 20z"/><path fill="#825F5D" d="M221 1729l-40 1c-16,0 -33,-11 -33,-24l0 -24 27 0 0 16c0,5 6,11 12,11l33 -1 1 21z"/><path fill="#825F5D" d="M195 518l-15 0c-14,0 -30,12 -30,24l0 20 25 0 0 -12c0,-4 6,-8 11,-8l9 0 0 -25z"/><path fill="#825F5D" d="M229 670l-11 0c-14,0 -30,12 -30,24l0 20 21 0 0 -12c0,-4 6,-8 11,-8l9 0 0 -25z"/>
      <g class="th-elem"><path d="M563 1779l0 368c0,5 -5,9 -12,9l0 0c-7,0 -14,-4 -14,-9l2 -368c0,-5 6,-9 13,-9l0 0c7,0 12,4 12,9z"/><path d="M595 1779l0 369c0,5 5,9 12,9l0 0c7,0 14,-4 14,-9l-2 -369c0,-5 -6,-9 -13,-9l0 0c-7,0 -12,4 -12,9z"/><path d="M583 1732l-15 0c-14,0 -30,12 -30,24l0 20 25 0 0 -12c0,-4 6,-8 11,-8l9 0 0 -24z"/><path d="M575 1731l15 0c14,0 30,12 30,24l0 20 -25 0 0 -12c0,-4 -6,-8 -11,-9l-9 0 0 -24z"/></g>
      <rect fill="#d3d2d8" stroke="#2b2a29" x="524" y="2124" width="34" height="38"/><rect fill="#d3d2d8" stroke="#2b2a29" x="599" y="2124" width="34" height="38"/><rect fill="#7f7e75" stroke="#2b2a29" x="550" y="2124" width="49" height="38"/>
    </g>
  <g class="th-big" id="thbig"></g></svg>`;


  /* ---- modèle photo : Atlantic Explorer V5 200 L (scène entière 1086 × 1448, coordonnées de la photo) ----
   * Calques : écran (jour et heure, goutte remplie selon l'eau chaude, température), teinte rouge / bleue du ballon selon la réserve,
   * air dans les deux gaines (pompe à chaleur en marche) + légère vibration, lueur orange en bas (appoint électrique / boost),
   * tuyaux rouge (sortie eau chaude) et bleu (arrivée eau froide) animés pendant un puisage. */
  const ATLANTIC_IMG = window.__acImg("thermo-heater",2);
  const DROP = 'M668.5 378C668.5 378 654.5 396 654.5 405A14 14 0 0 0 682.5 405C682.5 396 668.5 378 668.5 378Z';
  const ATLANTIC = (label) => `<svg viewBox="0 -150 1086 1598" role="img" aria-label="${label}" class="at">
 <defs><clipPath id="at-clip"><rect x="0" y="0" width="1086" height="1448" rx="40"/></clipPath>
  <clipPath id="at-body"><rect x="318" y="126" width="454" height="1204" rx="60"/></clipPath>
  <mask id="at-nopanel"><rect x="318" y="126" width="454" height="1204" fill="#fff"/><path d="M575 78L741 112L745 1160L578 1181Z" fill="#000"/></mask>
  <clipPath id="at-drop"><path d="${DROP}"/></clipPath>
  <linearGradient id="at-g" gradientUnits="userSpaceOnUse" x1="0" y1="126" x2="0" y2="1330"><stop id="at-s0" offset="0" stop-color="#ff3b2e"/><stop id="at-s1" offset=".4" stop-color="#ff3b2e"/><stop id="at-s2" offset=".5" stop-color="#2d7bff"/><stop offset="1" stop-color="#2d7bff"/></linearGradient>
  <radialGradient id="at-ge" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient></defs>
 <g class="at-air" fill="none">
  <path class="at-in" d="M395 -135Q420 -105 395 -75T395 -10" /><path class="at-in" d="M445 -140Q470 -110 445 -80T445 -10" style="animation-delay:-.5s"/><path class="at-in" d="M495 -135Q520 -105 495 -75T495 -10" style="animation-delay:-1s"/>
  <path class="at-out" d="M575 -10Q600 -40 575 -70T575 -135" /><path class="at-out" d="M625 -10Q650 -40 625 -70T625 -140" style="animation-delay:-.5s"/><path class="at-out" d="M675 -10Q700 -40 675 -70T675 -135" style="animation-delay:-1s"/>
 </g>
 <g class="at-body">
  <image href="${ATLANTIC_IMG}" width="1086" height="1448" clip-path="url(#at-clip)"/>
  <g clip-path="url(#at-body)"><rect x="318" y="126" width="454" height="1204" fill="url(#at-g)" class="at-tint" mask="url(#at-nopanel)"/><ellipse class="at-glow" cx="545" cy="1270" rx="300" ry="170" fill="url(#at-ge)"/></g>
  <g id="at-screen">
   <rect x="650" y="355" width="51" height="13" fill="#1d3a36"/><text id="at-time" x="651" y="366" fill="#d7efe8" font-family="Roboto,system-ui,sans-serif" font-size="12" font-weight="600">--</text>
   <rect x="634" y="369" width="67" height="82" fill="#000"/>
   <path d="${DROP}" fill="#5fb3ea"/><g clip-path="url(#at-drop)"><rect id="at-fill" x="650" y="419" width="40" height="0" fill="#f0262d"/></g>
   <text id="at-val" x="684" y="447" text-anchor="end" fill="#fff" font-family="Roboto,system-ui,sans-serif" font-size="30" font-weight="700">--</text>
   <text id="at-unit" x="686" y="434" fill="#fff" font-family="Roboto,system-ui,sans-serif" font-size="11" font-weight="600">°C</text>
  </g>
 </g>
 <g class="at-pipes" fill="none" stroke-linecap="round" clip-path="url(#at-clip)">
  <path class="at-d at-hot" d="M815 640V620Q815 600 835 600H880Q897 600 897 585V568" stroke="#ffd9c9" stroke-width="9"/>
  <path class="at-d at-cold" d="M810 1240Q820 1245 820 1225V1112" stroke="#b9dcff" stroke-width="9"/>
  <path class="at-d at-cold" d="M820 955V770" stroke="#b9dcff" stroke-width="9"/>
 </g>
</svg>`;


  /* ---- modèle photo : Thermor Aéromax Split (ballon intérieur + unité extérieure ; scène 793 × 991, coordonnées de la photo) ----
   * Calques : teinte rouge / bleue du ballon selon l'eau chaude, grande température sur le ballon, ventilateur de l'unité extérieure qui tourne
   * (pompe à chaleur en marche, plus vite en Boost), air soufflé devant l'unité, lueur orange en bas du ballon (appoint électrique / Boost). */
  const THERMOR_IMG = window.__acImg("thermo-heater",3);
  // grille de l'unité extérieure découpée dans la photo (fils clairs, fond transparent) : posée par-dessus l'hélice, qui tourne derrière
  const THERMOR_GRILLE = window.__acImg("thermo-heater",4);
  const THERMOR = (label) => `<svg viewBox="0 0 793 991" role="img" aria-label="${label}" class="at tm">
  <defs><clipPath id="tm-body"><rect x="0" y="4" width="222" height="820" rx="40"/></clipPath>
   <linearGradient id="tm-g" gradientUnits="userSpaceOnUse" x1="0" y1="4" x2="0" y2="824"><stop id="tm-s0" offset="0" stop-color="#ff3b2e"/><stop id="tm-s1" offset=".4" stop-color="#ff3b2e"/><stop id="tm-s2" offset=".5" stop-color="#2d7bff"/><stop offset="1" stop-color="#2d7bff"/></linearGradient>
   <radialGradient id="tm-ge" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient></defs>
  <g class="tm-air" fill="none"><path d="M360 880Q300 860 230 880" /><path d="M360 915Q300 895 200 915" style="animation-delay:-.5s"/><path d="M360 950Q300 930 230 950" style="animation-delay:-1s"/></g>
  <!-- liaisons frigorifiques entre l'unité extérieure et le ballon (gaz chaud vers le ballon, liquide de retour vers le groupe), passées derrière les deux appareils -->
  <g class="tm-lines" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path class="tm-ins" d="M420 958H150V800"/><path class="tm-ins" d="M420 976H128V800"/>
   <path class="tm-hot" d="M420 958H150V800"/><path class="tm-cold" d="M128 800V976H420"/></g>
  <image href="${THERMOR_IMG}" x="0" y="0" width="793" height="991"/>
  <g clip-path="url(#tm-body)"><rect x="0" y="4" width="222" height="820" fill="url(#tm-g)" class="tm-tint"/><ellipse class="tm-glow" cx="111" cy="800" rx="170" ry="110" fill="url(#tm-ge)"/></g>
  <text id="tm-val" class="tm-val" x="111" y="400" text-anchor="middle">--</text>
  <!-- logement de l'hélice : ellipse (face avant vue en perspective, bord haut de la grille incliné de 3°), relevée sur la photo -->
  <clipPath id="tm-fc"><ellipse cx="483" cy="783" rx="116" ry="142" transform="rotate(-3 483 783)"/></clipPath>
  <g clip-path="url(#tm-fc)" class="tm-fanw"><ellipse cx="483" cy="783" rx="116" ry="142" transform="rotate(-3 483 783)" fill="#15191e"/>
   <g transform="translate(483 783) rotate(-3) scale(1.036 1.268)"><g class="tm-fan"><circle r="112" fill="none"/>${[0, 72, 144, 216, 288].map((a) => `<path class="tm-blade" d="M-7 -22C-30 -50 -26 -94 2 -108C30 -108 44 -82 33 -54C25 -36 13 -26 8 -22Z" transform="rotate(${a})"/>`).join('')}<circle class="tm-hub" r="24"/></g></g></g>
  <image class="tm-grille" href="${THERMOR_GRILLE}" x="362" y="655" width="242" height="260"/>
</svg>`;

  const TILES = [['energy', 'mdi:lightning-bolt-outline', 'show_energy'], ['power', 'mdi:flash', 'show_power'], ['mode', 'mdi:cog-sync', 'show_mode'],
    ['temp', 'mdi:thermometer', 'show_temp'], ['bottom', 'mdi:thermometer-low', 'show_bottom'], ['target', 'mdi:target', 'show_target'], ['reserve', 'mdi:gauge', 'show_reserve'],
    ['volume', 'mdi:water', 'show_volume'], ['cycle', 'mdi:history', 'show_cycle'], ['duration', 'mdi:timer-outline', 'show_cycle'], ['cycle_kwh', 'mdi:lightning-bolt', 'show_cycle']];
  // mode lu sur l'entité ; les états reconnus (dans toutes les langues courantes) priment sur la puissance
  const RE_OFF = /^(off|unavailable|unknown|none|aus|arr[êe]t|spento|uit|av|oprit)$/i;
  const RE_BOOST = /boost|perform|turbo|electric|[ée]lectri|force|high.?demand|forc[ée]|intensiv|rapid|comfort/i;
  const RE_GREEN = /eco|green|vert|heat.?pump|thermodyn|pompe|auto|energy.?sav|smart|normal|w[äa]rmepumpe/i;
  const RE_PAUSE = /pause|idle|away|vacation|holiday|standby|absence|urlaub|veille|hors.?gel/i;

  class ApplianceThermoHeaterCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => i.startsWith('water_heater.')) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_energy: true, show_power: true, show_mode: true, show_temp: true, show_target: true, show_reserve: true, show_bottom: true, show_volume: true, show_cycle: true, boost_above: 1000, green_above: c.running_above != null && c.green_above == null ? c.running_above : 150, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    disconnectedCallback() { clearTimeout(this._cycTimer); }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _clock(t) { try { return window.applianceClock(this._hass, new Date(t), window.applianceLocale(this._c, this._hass)); } catch (e) { return new Date(t).toTimeString().slice(0, 5); } }
    _photo() { return this._c && this._c.model === 'atlantic_explorer_v5'; }
    _thermor() { return this._c && this._c.model === 'thermor_aeromax_split'; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="thtitle"></div><div class="badge" id="thbadge"></div></div>
        <div class="body">${(this._c.model === 'atlantic_explorer_v5' ? ATLANTIC : this._c.model === 'thermor_aeromax_split' ? THERMOR : SVG)((this._c.name || this._t('name')).replace(/"/g, ''))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_power));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ energy: c.entity_energy, power: c.entity_power, mode: c.entity_mode || c.entity, temp: c.entity_temp || c.entity, bottom: c.entity_temp_bottom, target: c.entity_target || c.entity, reserve: c.entity_reserve || c.hot_water_level || c.hot_water_volume, volume: c.hot_water_volume || c.hot_water_level, cycle: c.entity_power, duration: c.entity_power, cycle_kwh: c.entity_energy || c.entity_power }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, e = this._st(c.entity), a = (e && e.attributes) || {};
      // puissance en W (seuils green_above / boost_above en W, capteurs en kW convertis)
      const power = isNaN(this._num(c.entity_power)) ? NaN : window.applianceWatts(this._st(c.entity_power));
      // températures dans l'unité d'affichage (°C / °F) ; water_heater / climate sans unité : unité de Home Assistant
      const tc = window.applianceTemp(this._hass, c), tv = (id) => tc.conv(this._num(id), this._st(id));
      const temp = !isNaN(this._num(c.entity_temp)) ? tv(c.entity_temp) : tc.conv(parseFloat(a.current_temperature), e);
      const target = !isNaN(this._num(c.entity_target)) ? tv(c.entity_target) : tc.conv(parseFloat(a.temperature), e);
      const reserve = this._num(c.entity_reserve), bottom = tv(c.entity_temp_bottom);
      const mS = this._st(c.entity_mode);
      const known = [c.entity, c.entity_mode, c.entity_power, c.entity_temp, c.entity_temp_bottom].some((i) => this._ok(this._st(i)));
      const raw = String((this._ok(mS) ? mS.state : a.operation_mode || (e && e.state)) || '');
      let mode;
      if (!known) mode = 'unavailable';
      else if (e && /^off$/i.test(String(e.state)) || (this._ok(mS) && RE_OFF.test(raw))) mode = 'off';
      else if (RE_BOOST.test(raw)) mode = 'boost';
      else if (RE_PAUSE.test(raw)) mode = 'pause';
      else if (RE_GREEN.test(raw) || (e && /^(on|heat|heating)$/i.test(String(e.state)))) mode = 'green';
      else mode = null; // inconnu : déduit de la puissance
      if (mode == null || mode === 'green' || mode === 'pause') {
        // puissance : repli si le mode est inconnu, ou signale un chauffage appoint (résistance) malgré un mode éco
        if (!isNaN(power)) {
          if (power >= Number(c.boost_above)) mode = 'boost';
          else if (mode == null || mode === 'green') mode = power >= Number(c.green_above) ? 'green' : 'pause'; // éco sans consommation = en attente
        } else if (mode == null) mode = 'green';
      }
      // entity_boost : capteur on / off du chauffage d'appoint (boost) ; entity_pump : capteur on / off de la pompe à chaleur en marche
      const bS = this._st(c.entity_boost), pS = this._st(c.entity_pump);
      if (this._ok(bS) && /^(on|true|heat|heating|boost)$/i.test(String(bS.state))) mode = 'boost';
      else if (this._ok(pS) && mode !== 'off' && mode !== 'unavailable' && mode !== 'boost') mode = /^(on|true|running|heating)$/i.test(String(pS.state)) ? 'green' : 'pause';
      return { mode, power, temp, bottom, target, reserve, tc };
    }

    // last_cycle : dernier cycle lu dans l'historique (4 jours), relu au chargement puis 20 s après chaque fin de cycle
    // (le temps que l'enregistreur écrive les derniers points). Cycle = puissance au-dessus de green_above.
    _fetchCycle(active) {
      const c = this._c, hass = this._hass;
      if (!c.last_cycle || !c.entity_power || !hass || typeof hass.callWS !== 'function') return;
      const was = this._cycActive;
      this._cycActive = active;
      const first = !this._cycAt, ended = was === true && !active;
      if (this._cycBusy || !(first || ended) || (first && active)) return;
      this._cycBusy = true; this._cycAt = Date.now();
      clearTimeout(this._cycTimer);
      this._cycTimer = setTimeout(() => {
        const now = Date.now(), pId = c.entity_power, eId = c.entity_energy, ids = [pId].concat(eId ? [eId] : []);
        const k = (i, f) => f[(hass.states[i] && hass.states[i].attributes.unit_of_measurement) || ''] ?? 1;
        hass.callWS({ type: 'history/history_during_period', start_time: new Date(now - 4 * 86400000).toISOString(), end_time: new Date(now).toISOString(),
          entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
          .then((r) => {
            const pts = (i, f) => ((r && r[i]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: parseFloat(p.s) * f })).filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
            const pw = pts(pId, k(pId, { kW: 1000 })).map((p) => ({ t: p.t, w: p.v }));
            const en = eId ? pts(eId, k(eId, { Wh: 1e-3, MWh: 1e3 })) : [];
            this._cycle = lastCycle(pw, Number(c.green_above), Number(c.cycle_gap ?? 15), en);
          })
          .catch(() => { this._cycle = null; })
          .finally(() => { this._cycBusy = false; if (this._hass) this._render(); });
      }, was === true ? 20000 : 0);
    }

    // modèle photo : teinte du ballon, goutte et température de l'écran, jour / heure, puisage détecté
    _renderPhoto({ f, mode, temp, lvl, bottom, tc }) {
      const c = this._c, r = this._root, $ = (id) => r.getElementById(id);
      // dégradé du haut (eau chaude, rouge) vers le bas (eau froide, bleu) : la limite est à la hauteur de la réserve
      $('at-s1').setAttribute('offset', String(Math.max(0, f - .05).toFixed(3)));
      $('at-s2').setAttribute('offset', String(Math.min(1, f + .05).toFixed(3)));
      $('at-fill').setAttribute('y', String((419 - f * 41).toFixed(1)));
      $('at-fill').setAttribute('height', String((f * 41 + 1).toFixed(1)));
      const v = c.lcd_value === 'target' ? this._compute().target : temp;
      $('at-val').textContent = isNaN(v) ? '--' : String(Math.round(v));
      $('at-unit').textContent = tc.unit;
      const d = new Date(), loc = window.applianceLocale(c, this._hass);
      let wd = ''; try { wd = d.toLocaleDateString(loc, { weekday: 'short' }).replace('.', ''); } catch (e) { wd = ''; }
      wd = wd.charAt(0).toUpperCase() + wd.slice(1, 3);
      $('at-time').textContent = `${wd} ${d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit', hour12: false })}`;
      // puisage : l'eau chaude restante ou la température du bas du ballon baisse (ou capteur entity_draw on / > 0)
      const dS = this._st(c.entity_draw), now = Date.now();
      let drawing = false;
      if (this._ok(dS)) { const n = parseFloat(dS.state); drawing = /^(on|true|running)$/i.test(String(dS.state)) || (isFinite(n) && n > 0); }
      else {
        const p = this._prev || {};
        if ((!isNaN(lvl) && p.lvl != null && lvl < p.lvl - .5) || (!isNaN(bottom) && p.bottom != null && bottom < p.bottom - .4)) this._drawUntil = now + 90000;
        drawing = !!this._drawUntil && now < this._drawUntil;
        this._prev = { lvl: isNaN(lvl) ? p.lvl : lvl, bottom: isNaN(bottom) ? p.bottom : bottom };
      }
      this._card.classList.toggle('draw', drawing);
    }

    // Thermor Aéromax Split : teinte du ballon (limite eau chaude / froide à la hauteur de la réserve) et température sur le ballon
    _renderThermor({ f, temp, target, tc }) {
      const c = this._c, r = this._root, $ = (id) => r.getElementById(id);
      $('tm-s1').setAttribute('offset', String(Math.max(0, f - .05).toFixed(3)));
      $('tm-s2').setAttribute('offset', String(Math.min(1, f + .05).toFixed(3)));
      const v = c.lcd_value === 'target' ? target : temp;
      $('tm-val').textContent = isNaN(v) ? '--' : `${Math.round(v)}°`;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { mode, power, temp, bottom, target, reserve: reserve0, tc } = this._compute();
      // eau chaude restante : entity_reserve (%), sinon hot_water_level (%), sinon hot_water_volume (L) rapporté à tank_volume (L, nombre ou entité)
      const lvlE = this._num(c.hot_water_level), vol = this._num(c.hot_water_volume);
      const cap = typeof c.tank_volume === 'string' ? this._num(c.tank_volume) : Number(c.tank_volume);
      const capOk = isFinite(cap) && cap > 0;
      const rsv = !isNaN(reserve0) ? reserve0 : !isNaN(lvlE) ? lvlE : !isNaN(vol) && capOk ? (vol / cap) * 100 : NaN;
      const reserve = isNaN(rsv) ? NaN : Math.max(0, Math.min(100, rsv));
      const litres = !isNaN(vol) ? vol : !isNaN(reserve) && capOk ? (reserve * cap) / 100 : NaN;
      const active = mode === 'green' || mode === 'boost';
      this._fetchCycle(active);
      const cy = c.last_cycle && !active ? this._cycle : null;
      const keepDraw = this._card.classList.contains('draw');
      const vert = c.layout === 'vertical' || (c.layout !== 'side' && (this._photo() || this._thermor()));
      card.className = `${mode}${c.animations === false ? ' noanim' : ''}${keepDraw ? ' draw' : ''}${vert ? ' vert' : ''}`;
      // vitesse du ventilateur : plus la puissance est élevée, plus il tourne vite (bornée)
      const spd = isNaN(power) ? 2 : Math.max(.7, Math.min(3, 3 - power / 500));
      card.style.setProperty('--spd', `${spd.toFixed(2)}s`);
      // réserve d'eau chaude (%), position de la limite eau froide / eau chaude dans le ballon ; sans capteur, déduite de la température / consigne
      let lvl = reserve;
      // calcul en °C (eau froide à 15 °C)
      const tC = tc.toC(temp), gC = tc.toC(target);
      if (isNaN(lvl) && !isNaN(tC) && !isNaN(gC) && gC > 15) lvl = Math.max(0, Math.min(100, (tC - 15) / (gC - 15) * 100));
      if (isNaN(lvl)) lvl = mode === 'off' ? 0 : 60;
      const f = Math.max(0, Math.min(1, lvl / 100));
      if (this._photo()) this._renderPhoto({ f, mode, temp, lvl, bottom, reserve, tc });
      else if (this._thermor()) this._renderThermor({ f, temp, target, tc });
      else {
      r.getElementById('thg0').setAttribute('offset', '0');
      // le dégradé va du bleu (bas) au rouge (haut) : l'étape violette est la limite entre l'eau froide en bas et l'eau chaude en haut,
      // donc à (1 − réserve) en partant du bas : réserve pleine → ballon rouge, réserve vide → ballon bleu (#307)
      r.getElementById('thg1').setAttribute('offset', String(Math.max(.02, Math.min(.98, 1 - f)).toFixed(3)));

      // lcd_big : grande valeur lisible sur le ballon (icône thermomètre = température actuelle, cible = consigne, selon lcd_value)
      const big = r.getElementById('thbig');
      if (c.lcd_big === true) {
        const cur = c.lcd_value !== 'target', v = cur ? temp : target;
        const txt = `${this._fmt(v, 0)}${isNaN(v) ? '' : tc.unit}`, w = txt.length * 72, slot = 130, x0 = 378 - (w + slot) / 2;
        const ico = cur
          ? '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M0 -42V12"/><circle cx="0" cy="26" r="18" fill="#fff"/></g>'
          : '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><circle r="32"/><circle r="8" fill="#fff"/><path d="M0 -52V-36M0 36V52M-52 0H-36M36 0H52"/></g>';
        big.innerHTML = `<g transform="translate(${(x0 + 45).toFixed(0)} 770)">${ico}</g><text x="${(x0 + slot + w / 2).toFixed(0)}" y="770">${txt}</text>`;
      } else big.textContent = '';
      }
      // écran dessiné sur l'appareil : température actuelle de l'eau
      if (!this._photo() && !this._thermor()) r.getElementById('thlcd').textContent = isNaN(temp) ? '--°' : `${this._fmt(temp, 1)}°`;
      r.getElementById('thtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('thbadge');
      badge.textContent = this._t(`mode_${mode}`);
      badge.style.display = c.show_status === false ? 'none' : '';

      const eu = this._unit(c.entity_energy, 'kWh'), ru = this._unit(c.entity_reserve, '%');
      const V = {
        energy: [c.entity_energy, this._fmt(this._num(c.entity_energy), 2), eu],
        power: [c.entity_power, this._fmt(this._num(c.entity_power), 0), this._unit(c.entity_power, 'W')],
        mode: [c.entity_mode || c.entity || c.entity_power, this._t(`mode_${mode}`), ''],
        temp: [c.entity_temp || c.entity, this._fmt(temp, 1), tc.unit],
        bottom: [c.entity_temp_bottom, this._fmt(bottom, 1), tc.unit],
        target: [c.entity_target || c.entity, this._fmt(target, 0), tc.unit],
        reserve: [c.entity_reserve || c.hot_water_level || c.hot_water_volume, this._fmt(reserve, 0), c.entity_reserve ? ru : '%'],
        volume: [!isNaN(litres) && (c.hot_water_volume || c.hot_water_level), this._fmt(litres, 0), 'L'],
        cycle: [cy, cy ? `${this._clock(cy.start)} → ${this._clock(cy.end)}` : '', ''],
        duration: [cy, cy ? fmtDur((cy.end - cy.start) / 60000) : '', ''],
        cycle_kwh: [cy, cy ? this._fmt(cy.kwh, 2) : '', 'kWh'],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        const has = !!show && (k === 'mode' || k === 'energy' || k === 'power' || k === 'reserve' || k === 'cycle' || k === 'duration' || k === 'cycle_kwh' ? true : val !== '--');
        el.classList.toggle('hide', !has || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceThermoHeaterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceThermoHeaterCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Ariston Nuos (dessin / drawing)' }, { value: 'atlantic_explorer_v5', label: 'Atlantic Explorer V5 200 L (photo)' }, { value: 'thermor_aeromax_split', label: 'Thermor Aéromax Split (photo)' }] } } },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Auto (photo : vertical) / Auto' }, { value: 'vertical', label: 'Photo pleine largeur, tuiles dessous / Vertical' }, { value: 'side', label: 'Photo à gauche, tuiles à droite / Side by side' }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['water_heater', 'climate', 'switch']), ent('entity_mode', ['select', 'input_select', 'sensor']),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_temp', 'sensor'), ent('entity_target', ['sensor', 'number', 'input_number']),
        ent('entity_temp_bottom', 'sensor'), ent('entity_reserve', 'sensor'),
        ent('entity_pump', ['sensor', 'binary_sensor', 'switch']), ent('entity_boost', ['sensor', 'binary_sensor', 'switch']), ent('entity_draw', ['sensor', 'binary_sensor']),
        ent('hot_water_level', 'sensor'), ent('hot_water_volume', 'sensor'),
        { type: 'grid', name: '', schema: [{ name: 'tank_volume', selector: { number: { min: 0, max: 1000, step: 1, mode: 'box', unit_of_measurement: 'L' } } }, num('cycle_gap', 0, 240, 1, 15, 'min')] },
        { name: 'last_cycle', selector: { boolean: {} } },
        { type: 'grid', name: '', schema: [num('green_above', 0, 2000, 1, 150, 'W'), num('boost_above', 100, 5000, 10, 1000, 'W')] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { name: 'lcd_value', selector: { select: { mode: 'dropdown', options: [{ value: 'current', label: window.applianceEditorLabel('lcd_value_current', this._hass) }, { value: 'target', label: window.applianceEditorLabel('lcd_value_target', this._hass) }] } } },
        { type: 'grid', name: '', schema: [bool('lcd_big', false), bool('show_status'), bool('show_energy'), bool('show_power'), bool('show_mode'), bool('show_temp'), bool('show_bottom'), bool('show_target'), bool('show_reserve'), bool('show_volume'), bool('show_cycle'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceThermoHeaterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Chauffe-eau thermodynamique animé : ballon écorché (réserve d\'eau chaude), ventilateur, résistance, modes off / pause / green / boost.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/thermo-heater.md',
  });
})();
