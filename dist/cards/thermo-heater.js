/* Carte « Chauffe-eau thermodynamique » — custom:appliance-thermo-heater-card
 * Ballon à pompe à chaleur (type Ariston Nuos) : photo détourée + écorché du ballon (dessin proposé par Ppatou, #268).
 * Le ballon se remplit du bleu (froid) au rouge (chaud) selon la réserve d'eau chaude, le ventilateur tourne en modes
 * Éco (green) et Boost, la résistance rougit en Boost. Modes : off / pause / green / boost, lus sur l'entité (water_heater,
 * select…) ou déduits de la puissance. Tuiles : énergie, puissance, mode, température, consigne, eau chaude, volume,
 * dernier cycle (option last_cycle : début → fin, durée, conso, lus dans l'historique de Home Assistant).
 */
(() => {
  const TAG = 'appliance-thermo-heater-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Thermodynamic water heater",
      "mode_off": "Off",
      "mode_pause": "Pause",
      "mode_green": "Green",
      "mode_boost": "Boost",
      "mode_unavailable": "Unavailable",
      "energy": "Energy",
      "power": "Power",
      "mode": "Mode",
      "temp": "Temperature",
      "target": "Target",
      "bottom": "Bottom",
      "reserve": "Hot water",
      "volume": "Volume",
      "cycle": "Last cycle",
      "duration": "Cycle duration",
      "cycle_kwh": "Cycle energy"
    },
    "da": {
      "name": "Varmepumpevandvarmer",
      "mode_off": "Slukket",
      "mode_pause": "Pause",
      "mode_green": "Grøn",
      "mode_boost": "Boost",
      "mode_unavailable": "Utilgængelig",
      "energy": "Energi",
      "power": "Effekt",
      "mode": "Tilstand",
      "temp": "Temperatur",
      "target": "Mål",
      "bottom": "Bund",
      "reserve": "Varmt vand"
    },
    "de": {
      "name": "Wärmepumpen-Warmwasserbereiter",
      "mode_off": "Aus",
      "mode_pause": "Pause",
      "mode_green": "Eco",
      "mode_boost": "Boost",
      "mode_unavailable": "Nicht verfügbar",
      "energy": "Energie",
      "power": "Leistung",
      "mode": "Modus",
      "temp": "Temperatur",
      "target": "Soll",
      "bottom": "Unten",
      "reserve": "Warmwasser",
      "volume": "Volumen",
      "cycle": "Letzter Zyklus",
      "duration": "Zyklusdauer",
      "cycle_kwh": "Zyklusenergie"
    },
    "es": {
      "name": "Termo termodinámico",
      "mode_off": "Apagado",
      "mode_pause": "Pausa",
      "mode_green": "Verde",
      "mode_boost": "Boost",
      "mode_unavailable": "No disponible",
      "energy": "Energía",
      "power": "Potencia",
      "mode": "Modo",
      "temp": "Temperatura",
      "target": "Objetivo",
      "bottom": "Parte inferior",
      "reserve": "Agua caliente",
      "volume": "Volumen",
      "cycle": "Último ciclo",
      "duration": "Duración del ciclo",
      "cycle_kwh": "Energía del ciclo"
    },
    "fr": {
      "name": "Chauffe-eau thermodynamique",
      "mode_off": "Arrêt",
      "mode_pause": "Pause",
      "mode_green": "Vert (éco)",
      "mode_boost": "Boost",
      "mode_unavailable": "Indisponible",
      "energy": "Énergie",
      "power": "Puissance",
      "mode": "Mode",
      "temp": "Température",
      "target": "Consigne",
      "bottom": "Bas du ballon",
      "reserve": "Eau chaude",
      "volume": "Volume",
      "cycle": "Dernier cycle",
      "duration": "Durée du cycle",
      "cycle_kwh": "Conso du cycle"
    },
    "hu": {
      "name": "Termodinamikus bojler",
      "mode_off": "Ki",
      "mode_pause": "Szünet",
      "mode_green": "Zöld",
      "mode_boost": "Boost",
      "mode_unavailable": "Nem elérhető",
      "energy": "Energia",
      "power": "Teljesítmény",
      "mode": "Mód",
      "temp": "Hőmérséklet",
      "target": "Cél",
      "bottom": "Alsó",
      "reserve": "Meleg víz"
    },
    "pl": {
      "name": "Termodynamiczny podgrzewacz wody",
      "mode_off": "Wył.",
      "mode_pause": "Pauza",
      "mode_green": "Eko",
      "mode_boost": "Boost",
      "mode_unavailable": "Niedostępny",
      "energy": "Energia",
      "power": "Moc",
      "mode": "Tryb",
      "temp": "Temperatura",
      "target": "Cel",
      "bottom": "Dół",
      "reserve": "Ciepła woda"
    },
    "pt-BR": {
      "name": "Aquecedor de água termodinâmico",
      "mode_off": "Desligado",
      "mode_pause": "Pausa",
      "mode_green": "Verde",
      "mode_boost": "Reforço",
      "mode_unavailable": "Indisponível",
      "energy": "Energia",
      "power": "Potência",
      "mode": "Modo",
      "temp": "Temperatura",
      "target": "Desejada",
      "bottom": "Parte inferior",
      "reserve": "Água quente",
      "volume": "Volume",
      "cycle": "Último ciclo",
      "duration": "Duração do ciclo",
      "cycle_kwh": "Energia do ciclo"
    },
    "pt-PT": {
      "name": "Aquecedor de água termodinâmico",
      "mode_off": "Desligado",
      "mode_pause": "Pausa",
      "mode_green": "Verde",
      "mode_boost": "Reforço",
      "mode_unavailable": "Indisponível",
      "energy": "Energia",
      "power": "Potência",
      "mode": "Modo",
      "temp": "Temperatura",
      "target": "Pretendida",
      "bottom": "Parte inferior",
      "reserve": "Água quente",
      "volume": "Volume",
      "cycle": "Último ciclo",
      "duration": "Duração do ciclo",
      "cycle_kwh": "Energia do ciclo"
    },
    "sr": {
      "name": "Термодинамички бојлер",
      "mode_off": "Искључено",
      "mode_pause": "Пауза",
      "mode_green": "Зелени",
      "mode_boost": "Појачано",
      "mode_unavailable": "Недоступно",
      "energy": "Енергија",
      "power": "Снага",
      "mode": "Режим",
      "temp": "Температура",
      "target": "Циљна",
      "bottom": "Дно",
      "reserve": "Топла вода"
    },
    "sr-Latn": {
      "name": "Termodinamički bojler",
      "mode_off": "Isključeno",
      "mode_pause": "Pauza",
      "mode_green": "Zeleni",
      "mode_boost": "Pojačano",
      "mode_unavailable": "Nedostupno",
      "energy": "Energija",
      "power": "Snaga",
      "mode": "Režim",
      "temp": "Temperatura",
      "target": "Ciljna",
      "bottom": "Dno",
      "reserve": "Topla voda"
    },
    "uk": {
      "name": "Термодинамічний бойлер",
      "mode_off": "Вимк.",
      "mode_pause": "Пауза",
      "mode_green": "Еко",
      "mode_boost": "Форсаж",
      "mode_unavailable": "Недоступно",
      "energy": "Енергія",
      "power": "Потужність",
      "mode": "Режим",
      "temp": "Температура",
      "target": "Ціль",
      "bottom": "Низ",
      "reserve": "Гаряча вода",
      "volume": "Об'єм",
      "cycle": "Останній цикл",
      "duration": "Тривалість циклу",
      "cycle_kwh": "Енергія циклу"
    }
  };
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
.at-tint{opacity:.9}
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
.off .at-tint,.unavailable .at-tint{opacity:.35}
.noanim .at-in,.noanim .at-out,.noanim .at-body,.noanim .at-glow,.noanim .at-d{animation:none!important}
.th-fan{transform-box:fill-box;transform-origin:50% 50%}
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
  const PHOTO = 'data:image/webp;base64,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';
  const FAN = 'data:image/webp;base64,UklGRiwVAABXRUJQVlA4WAoAAAAQAAAA3wAA3wAAQUxQSCEGAAABylDcto0j77926vX7RUSSiLVlUYnr6xegK9u2Gkl6UqWkGraYmZnxA5iaLeb+BSZ7LGZm+IeJsSqGmdFCqyFTypRuRFZSZUvveRPn3BsRENw2ciRJEzBd1b15t8PdB9C2bZv/fw/EpGMREWjbts0BOaCtI6sr6mqSpZmb9+pryZuufV+6HOPn+/27QxrmzdIscT61NWPoe8+a1bpRFqz279w9Q3fWh0Qx3IDbnnlWZd5eV9W0mgSoqapx3v6d3Dbijnvt/ZI4IONxc59/NvDM5X25YNG3Yl+1ueMyOiDx1c3EaeJw0tWLOodMyLIgK5maKMhSSDtki65WhySN/cPAh3bd2o+F8yUAp+uYO2u6buBbwC/56HvdM08L2e3xCGtK8ulnrgMAX6QzgUP2zmd/CYu8lBqIvBCavpM5JPBBQQrgyu0dIYuu1EYthDRc6YC0+aXu5LXrhazKivVxxMNYr+YaXcjIAY9/JOyVrKUw8iMd+C1ubD6yPZ8Lc7C2AqTtyVwz0yOH85e0hUVPaq0VwvaS84GogV9np637T8iStRck1U5r4BfcCR9J1WNDNPCjE5rVvY0x+9ZP0qnYGGH8SWdd3GrKDuxoC3tslEa2dwCthrR57775H0Y2TFSkWgOajGKHFSMzGpegQM3HpQSu+rRddaShGtqfar27+zM48caDwoqNFeTBG090Wt8245M/ORId3Pp1hz+xOK1pG3DHfyQdNl7jR8cjqmMTSeze/km69IBKmIuTGv4a8a2Jvq8be7OagrW7yZWvS1GJJ0Qhr5uLa3aTO4UlPSJIrdMtRqnbI4e64hX1kMClUV32Wbdd8oqeETm3O63J1sJO9ughjYpWTWrsYpdeUmmYqUmNduUnYAMVZk1EDdSoRtZAfWqEDdSmRtpAPWrEDdSghmgghvZreFHlziPSyU+z0TX6BrL0CAyjFw3s3twWTX2gHSXuxbIr3lTxokuiaSe9JyU9KvjelHMS96bk9Krgmy6Z7vzqn0XpV1DoNOdjY5z8cdUTz2r4+OSpBaPWaR9Jl95Vaae1MK3zLdKhhzUq4imdrzzQEy9rB66czinF91L6GfD7qcw2G1b83a38DPTvFc6m8Ce/dxUVxNMCxV1qC05y+yWntwXNLTQnSnazS4+rRLJQHEt6XdAtjMS9kfue/I0F9X9jnPhn5XsqPXEBvQsml07U3/Vw/1eTibcUa6RN72tUpBOXnflbXvkf5HbmpEVMl0mPAdCIdOJLqRgEwYmvd+ehIN892WXKP6QMA+AfKSdq5ZGCEggL2gSNxK2LPyx7ocDw4cWtePx5q3QYDI1bx58SrO/l4QC2PsH4PkVXJSCqYlwjUbpDypAA7hi/mCzBcdxCgL6dl2EBuamOHk9/w9BAc8mobL3z97IKCyh/Nx2RnOEtyRkYQXXZiE7FzNNVERoKPK3pcDxa1wvOmYSti4bCKZZIJzwYl2DwFMVnfdArwwNMzxr8HyniUikkQBaiGKjMaJFZiDBbhMFGZyVY6lC1Q6HiEAY5rhMqTAGghTkpwwQ45wyw+Mtw8WU8Dz4OF9YvSaOdh7uhKtbDO5Fm7mUpQkUhcBmjZ0KGIqN7NGTAZdGD/xVVqEChFrmNkjNYguqwugoZ1WqHVWE7rHLRhrCxIbqmqxIwVXGdhA1ed23ouDZ83BQ6bjojdNj7LEMGqAye3fDt/3vt+zyX+e5FfPdavnvJ+92b+951fO9yvndV3rs4MNfgy6X4ckW6XJgw1+fLZfpytbhctDDX7ttL0O2VAPeCfHtdvr08316lby+Wt9fs20vncQV8XAgf14PHZfFxdXhcJB/Xyscl43HlfFxAH9eRx+XkcVV9XFwe19jHpfZxxXlceB/Xn9fLwOvV0PWiAHttfL1EvF4pXi8Yr9fN18vH61X09WLyek15vbS8XmFeL7Sv15vXy87r1ed5EfC8FnxeEjyvDJ0XCM/rxOflwvOq0Xnx8LyGfF5KPK8onRcWz+uL52XG82rjedHpvPZ4XoI8r0SeFyTO65Ln5cnzKqV5sQK9ZnleujyvYJ0XMs7rWedlzfPqxnmR47zWdV7yOK983b8AtvWvA96/HAAAVlA4IOQOAADQTwCdASrgAOAAPmEqkkWkIqGVOMZUQAYEtIbjvEMDLyEKxIfNf+S/HX9O/ML/l/2/7K825Av/L2dzsv4AX5D+rd8rtp6BHfPzcPvfO7xAO+78LygB+gvRs0HJt2+kI8deXORUIFc0vft8bLpYlu/HIkJ2oqaXutlXMc/3PRYMEjBgFSWGH6myybZ7Pcg8JIJ0epWTxQYa8obA4kMMhJKaLRB/3xPYGtT1PSNTy7Y/XIKLx3u/t0u/zy7yHueoS/3ux9KRuA7GWdXGtu46+EcO6tlb5yuV/qPQ3sb2dCrzJOwKeL3B712qvTS2On4UExKgQlAZoEBLwOkZsNp+xKp10ZPq8CozPndburKhACzdzAoQVDOA2ekSzzVvtJmdy/SRz2JW4njBfvj+tb0SUK4ZwIenZJj5RCsLno9mIcaY+ZCPNx6Tkmw88ItQAtpCuL7+bx2PEd0ACOlb+x7RbfdPy5Ue2QRGgqiuk/ewGJcZdkKrJ0/2H6X+B3xWqK/C8qyhflvpm9M775WRdoVvk3p917LoNMSR9HwJwuL2rhtXL7Hw1Oh7A/mYEx0u1tJ6r4tj6kfhgDxpVWK0C+PycFwtFMlm4OYlX6Sdz1KMbEVabQUmWzmu24LfIrYSvLEx/c9Q/yHbONwDX3QXPZUARX7ot03g/ixmL/Z0xBoOSFwPq8zyBSMKhLKvX9otcczjRBOgZprcmCVl5jqrl15124Y+5qAA5CWh34VVCXeBGuW4QRMmBZEGEU8dNYzIhx1wPZHgmlHf94yYlssSR89eq7f7v6FxOJWWo+dRoeHa1NK6qHfG7UOy2z300+nck9M4IgD5GOFzwGDthsPk0OX/+2wXw5T+t2eIAAD+24soP0AR/5tnW+u+HWB3iLWclXuc+RPluOSYdZrHUVzOcg3bhgEe8iXYmoVvDHLPeZD5iWDmvOYQCZfQFeR+PmYjZLgaa6nvFV5+lftdyVuX6eV74XX2Ftl+U+FZPJKeIicrCmIEiHty1IVmlAOrElmn6kWmILZWdJ7Qva09bVZY/WLHMMx60gO9Qt++yNHeVTuINOM3qEVBhNN8BxOpGcEPGC+lDe82O+ZjYa8DuIxWw+4tbT1uD9B7+h7KTR43VtXOKME9tQyp5L+i9aVJ2r///XqUFGxyxCFyL8pxRvWLyM+cjoF52/9dkDX82xeucJELwh38WJ/9fgON89HmjmGACgjhHo7mwRzeaog2tPc5VT51FJDfpHYuLZ+EZ9lG/g4z9uNp07dsaNUXbXZFmNK/UyOkyZh/EaDIdUVgBQIPr+rJVAwPu6jchYUu/tqF3cpw/v4PUGDyANVzy49mmuaw9VkDrYQivSYwOjub0/25QoLUMgfbtIJ8j060awe7yCqv+uK4S8TufIc7kg3nhP4Elq+Lre6Mu7Nk0CvX4cIqyPPZwij1YX8aHstSpYmKpSKxAXzgFotFiFaH3EnMxNJg7RjZ4VVa5pM18g5O0DUd/OoHZ5vt6ft1WmJZC0Mwn/+Hj+vw2PLaGk9tPzEK3mxMNxrmEV0gaWdSxnqDxJcgabsVlG/g4z+RoXmU18ES8B0/poKo5y/w7JhH4zE8TwcpVBNnspsbPOz+tuCYHccegC0BcCoMHmuFSz5GjS15xrHTFXusVlN8oEBDFSlgGui74rlfv/y6OpLHtVHMuyjhueF5LiG0QVJkukSVNsP7m5ALDi6bFra0d0fJecrBmrc0hZdSn1DcT59/t8aO0z1cpqO/E+FPh99DtLLFctHzdnp4NHKDJTyMmRLGtj7zQUUDLtoEXP1RUJ9EzcpVVL4RxrvMA8Qo2vzOcZG+2r185P3BziLdIxhHxwvyLyWGea6F0MbymgfhCRju6fAOB8P3C78xMu2SHL1rNlNYoiCakQGrFjqaeq9xkSsaNXZS4jeiRSSpNb2ZdAN94VgMSCVe8FHsaG78gGWm/odrzTEsUgsjt2eT98TbXmCvkAFjVJ1DYj8f0TpY4JFOC4oi3rjpIA43pGGXm36McbmdQg0DYGGdhzjCG7hjUX7U9mmPcFY1rB6wpyx1vT+fViAIa13ehd+EkPjlKCAc3Auu5Uza+YusBJrNihUdYA7Coh0YWgi9qFcUTnVhaBY///tBeSX2UtXHeelXplY4lQMPO8c/hz8P9qIS4JGvz9E8E5mVcjQnrjm8FnMCqnCUZF5TZ9eb0xfLnqShFkWwK/iX5NjCV3xnlqbdLHP9AJEsEihDTwWtPMCHp+kwq8QayxalLlpUGc9v+xAf7zGO/FWOCcjw7868I1On1DjHj7yE2i3AEqkVocT6U6kDSe2tT84cDsMkFl4KgRz9QMOXGUmhLRkKS7IjM4c20D9b8EaJX5gEW6D5MlMSxYpNoXtCxHCcjhotI/z5kxRHoC0uMMbj+Ob4ujuEGhA6l/dh6nXMqqL5UgkZDpSldxZpBNQCXZfCcKPluMiM7D47LkIJRIzS5xjL6tn7AN+pdEgPWz9LYNZmCc+EK37iqyrzlJTH39Ugf0JvVtRhD1m3eCA+BTwPwwoUEJK5Cg9Ovz1Ui70hjX8I29oe0s33iWKBJTan7pvEkdly60eYLLdqAFx+pagvZmooE1Y/7h2DCw1QhzyYZ6ldH0GhkLeCyc7zmOqzevedZoTaMOUHhiNWLV7GpeCCuYltn0rvwkVVqWXYqSyC/avvEc+c5VXSjfGK0H5cjzZEy5PZEyO9jwVKTVu1jwvFBgTjg1UF6mMmtDalzvYZTf3I0114cFS4750tUr7git3q0WDeFKaPCV0m1W5+NzmTyPX4lbxs7ATHLfyEJ0Mu+l4UnGmT494n22K3kWTH0vOKTXBk59J42PeKiwOdGjGyWU7C58qVG87RLlyThXYsYhSyUZ+PHawRQW1+b6uzv+QOz7RXTWTPKdzkD5KR177V1cBFgBuNzo3MGuCUdcE00dUd04hFBIXVDnwhM9IocTGke2gBo2MrfehgJrcIZF1MfqIk0Ad0VdvW68l/r30UHtsqyt8YRqizOnP8hefbNhgjTfF4wCpJ2B4MwnO+OlKClz6IaAkvVy1L9G2VlrzWpJaWcM+WVVNDmGxsRDCl2AV3zRBSZ0dOV1XyQK4mvdbax5QPsbuRC6x9sddReF28qgwh1s+YDaAra3pWGIR4bdW1qdEBOSxMcTqDBXpxLb4psCb46ONFILu4UblC9pbsh4WPzrxpuv4hvMxNmu9PZmcigUqBfILKZ/HDN4IYCeloKSJEUPs/Lah5VYnPSnXE/+LZFZ35zo5konzJy20zTfvUAKB37O98OAH3QbYqRPFzCpkYifACn7RUN22ecZYRjwEheSF/HcWu9akBuMdVWH5zNdeyMKfsNLl0m93TDSQP8tZQMOIgMnyRdw4sG1NNygzCemGf57TJpbmk6qxDjORNGsd/EDPhaXm9+zO2bIhupz7lamy+IAIBe0QT67q3ygGVaMEBt5jwa6+CbTuZ4dDMjJCSWbMnrKCIce9xN9ouJPC1nWciX4xcXhCSusVcD2N774FK2/ePtYdQ9sLKlL7ijLQ9ZvLGg2sQXTghgZCCzaUCrHBujuHeVgb4e4HEly9HfAF24u+eO+9BIR5V7TIjR66QxdD0C5ZGyV3N2CYheBomAEEC5Tv2kMKUlMHbiWPbEI6Wdt3yudnX6pwNszwMXFxGGGcYc7ConM+DZ76ekDCDSvywc2FRa7Ljv6yNMaqlDF2S7zDYi6TuuAG0jPlrp7gCO6ZEQpsEZFXW0+4V4kyc4Jnm733LcTbONmVkJ3yz8iKR2UfbMewwF+H5O71mRR9sB31KKwrIN/MJgNf52uh3qKhlJ3vMvRFCsyMQX+jF9wtXzRYtEKrMXhpTB2pZRdEs5dqnMpn8KPf2M01gY1ltxZ0lzpN7/xOy8Vi3NAMoTJONZVOKFgU53CHr4hcd7swCId2PyWQG4wQltHKtzhb3olxWQWnbj2s3X1vHfpYsiwgjsB4Gu/UXJT5T7KTwKmhga8ospAMViVPAAqPv4cDN+1jLui6X7qJJalHSKVy1LjqvkGKuxhNu09wxHw1cDateaUP/AvDo89aMH1qGMjEeIa/36gJa/VQ6Rgm9vt/wXa8isLa7/TuniHWHI7/ceJME4jM4NJgFzQEXkBfSgUiF18ZkQcU42lovv3wvpzuqlP1iiZ6TO7Pf5i88tbtUAPGVnoN1Tfz59V3rrfRC4ADtb2/zRUrwQmeSMglOEnu0Y43HRQRr4xT2NKHGNvFT6Q4VYMVZxpo9420ehbWNQ9S5CNpCaCWJQ5a+DHiyCObwekh82lroI42zazjb4fV31swjbJkYIkGImVQJAp9LbcGGdhz+mlR89+wA3gKbV3MVVtxcZ2O+bSNOBALKcP/ELHCYuLFzYTc2s/CORt9YldwFQ3B+Jm2ryOAzFwwCRtlkmMqDSRXd+bzb5W+3ll0gd61rRHuGs3oSRsfcSpeZ70k/xRhpuqphY2YEt2FpOvx+kMhSI/+g4o0v/M8jKjB5aH6KH3jTeWGyY6i8+VHPTtqpgbopt689dbMEow2OdvqmBO4dLZY1sk4F1vS8ALB7y5DAL6DU1axJVwyLJ0D2NMi8kVJyJ8zZigL61eXQ6Nj+csgwh3tGmlnCcRzKWnyuXt8dykB2iGf/Dd3k7PE+/qmxaa06HPnml0SE4LZKHbozW2X6E2TGkt1rc5tnkgNMlMk4YRKwPYFXWfoMDkblbqTUtt7zKr6sTfqrrKaLzHeY9TiCLgo7AgXYzKRHFxRkCccZNuocJUcdXge4o9TnTpncOCPyrxsTBL91fFTPFp5WjEqyQWZfA094n1LKlbuhXqzdtEA89AuvRF+LPtuMAOmSXv//Qcx4yfgBMwbcA9lT17XoE4QA2uACoXKoK67+4jyt4vLNjmUGxjjbwqpbW7WFsFK11DFBSWKruJrgxfm0J9Te6it7qMdzt+2i5sSMrpal27JD0kPmcDDcaxTJ41szKMNFU2xxIZc03go2jv25I+2Oc36H4byGKZ2hXO24bRTTT+GTAZey/FaoZlEv3X6mBS71+MAZAiDsKSThdnxiU3P34drI+ntB6AbmdzEQqBg+7lvRMffK4AAAAA==';
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
  const ATLANTIC_IMG = 'data:image/webp;base64,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';
  const DROP = 'M668.5 378C668.5 378 654.5 396 654.5 405A14 14 0 0 0 682.5 405C682.5 396 668.5 378 668.5 378Z';
  const ATLANTIC = (label) => `<svg viewBox="0 -150 1086 1598" role="img" aria-label="${label}" class="at">
 <defs><clipPath id="at-clip"><rect x="0" y="0" width="1086" height="1448" rx="40"/></clipPath>
  <clipPath id="at-body"><rect x="318" y="126" width="454" height="1204" rx="60"/></clipPath>
  <clipPath id="at-drop"><path d="${DROP}"/></clipPath>
  <linearGradient id="at-g" gradientUnits="userSpaceOnUse" x1="0" y1="252" x2="0" y2="1240"><stop id="at-s0" offset="0" stop-color="#ff3b2e"/><stop id="at-s1" offset=".4" stop-color="#ff3b2e"/><stop id="at-s2" offset=".5" stop-color="#2d7bff"/><stop offset="1" stop-color="#2d7bff"/></linearGradient>
  <radialGradient id="at-ge" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8a1f" stop-opacity=".9"/><stop offset="1" stop-color="#ff5a00" stop-opacity="0"/></radialGradient></defs>
 <g class="at-air" fill="none">
  <path class="at-in" d="M395 -135Q420 -105 395 -75T395 -10" /><path class="at-in" d="M445 -140Q470 -110 445 -80T445 -10" style="animation-delay:-.5s"/><path class="at-in" d="M495 -135Q520 -105 495 -75T495 -10" style="animation-delay:-1s"/>
  <path class="at-out" d="M575 -10Q600 -40 575 -70T575 -135" /><path class="at-out" d="M625 -10Q650 -40 625 -70T625 -140" style="animation-delay:-.5s"/><path class="at-out" d="M675 -10Q700 -40 675 -70T675 -135" style="animation-delay:-1s"/>
 </g>
 <g class="at-body">
  <image href="${ATLANTIC_IMG}" width="1086" height="1448" clip-path="url(#at-clip)"/>
  <g clip-path="url(#at-body)"><ellipse class="at-glow" cx="545" cy="1270" rx="300" ry="170" fill="url(#at-ge)"/></g>
  <!-- bande verticale : fenêtre sur l'eau du ballon (rouge = chaude en haut, bleu = froide en bas) -->
  <rect x="408" y="246" width="74" height="1000" rx="37" fill="#15181d" opacity=".55"/>
  <rect x="414" y="252" width="62" height="988" rx="31" fill="url(#at-g)" class="at-tint"/>
  <rect x="422" y="270" width="12" height="950" rx="6" fill="#fff" opacity=".28"/>
  <rect x="408" y="246" width="74" height="1000" rx="37" fill="none" stroke="#c9ced6" stroke-width="5"/>
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
    _clock(t) { try { return new Date(t).toLocaleTimeString(window.applianceLocale(this._c, this._hass), { hour: '2-digit', minute: '2-digit' }); } catch (e) { return new Date(t).toTimeString().slice(0, 5); } }
    _photo() { return this._c && this._c.model === 'atlantic_explorer_v5'; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="thtitle"></div><div class="badge" id="thbadge"></div></div>
        <div class="body">${(this._c.model === 'atlantic_explorer_v5' ? ATLANTIC : SVG)((this._c.name || this._t('name')).replace(/"/g, ''))}
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
      const power = this._num(c.entity_power);
      const temp = !isNaN(this._num(c.entity_temp)) ? this._num(c.entity_temp) : parseFloat(a.current_temperature);
      const target = !isNaN(this._num(c.entity_target)) ? this._num(c.entity_target) : parseFloat(a.temperature);
      const reserve = this._num(c.entity_reserve), bottom = this._num(c.entity_temp_bottom);
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
      return { mode, power, temp, bottom, target, reserve };
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
    _renderPhoto({ f, mode, temp, lvl, bottom }) {
      const c = this._c, r = this._root, $ = (id) => r.getElementById(id);
      // dégradé du haut (eau chaude, rouge) vers le bas (eau froide, bleu) : la limite est à la hauteur de la réserve
      $('at-s1').setAttribute('offset', String(Math.max(0, f - .05).toFixed(3)));
      $('at-s2').setAttribute('offset', String(Math.min(1, f + .05).toFixed(3)));
      $('at-fill').setAttribute('y', String((419 - f * 41).toFixed(1)));
      $('at-fill').setAttribute('height', String((f * 41 + 1).toFixed(1)));
      const v = c.lcd_value === 'target' ? this._compute().target : temp;
      $('at-val').textContent = isNaN(v) ? '--' : String(Math.round(v));
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

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { mode, power, temp, bottom, target, reserve: reserve0 } = this._compute();
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
      card.className = `${mode}${c.animations === false ? ' noanim' : ''}${keepDraw ? ' draw' : ''}`;
      // vitesse du ventilateur : plus la puissance est élevée, plus il tourne vite (bornée)
      const spd = isNaN(power) ? 2 : Math.max(.7, Math.min(3, 3 - power / 500));
      card.style.setProperty('--spd', `${spd.toFixed(2)}s`);
      // réserve d'eau chaude (%), position de la limite eau froide / eau chaude dans le ballon ; sans capteur, déduite de la température / consigne
      let lvl = reserve;
      if (isNaN(lvl) && !isNaN(temp) && !isNaN(target) && target > 15) lvl = Math.max(0, Math.min(100, (temp - 15) / (target - 15) * 100));
      if (isNaN(lvl)) lvl = mode === 'off' ? 0 : 60;
      const f = Math.max(0, Math.min(1, lvl / 100));
      if (this._photo()) this._renderPhoto({ f, mode, temp, lvl, bottom, reserve });
      else {
      r.getElementById('thg0').setAttribute('offset', '0');
      // le dégradé va du bleu (bas) au rouge (haut) : l'étape violette est la limite entre l'eau froide en bas et l'eau chaude en haut,
      // donc à (1 − réserve) en partant du bas : réserve pleine → ballon rouge, réserve vide → ballon bleu (#307)
      r.getElementById('thg1').setAttribute('offset', String(Math.max(.02, Math.min(.98, 1 - f)).toFixed(3)));

      // lcd_big : grande valeur lisible sur le ballon (icône thermomètre = température actuelle, cible = consigne, selon lcd_value)
      const big = r.getElementById('thbig');
      if (c.lcd_big === true) {
        const cur = c.lcd_value !== 'target', v = cur ? temp : target;
        const txt = `${this._fmt(v, 0)}${isNaN(v) ? '' : '°C'}`, w = txt.length * 72, slot = 130, x0 = 378 - (w + slot) / 2;
        const ico = cur
          ? '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M0 -42V12"/><circle cx="0" cy="26" r="18" fill="#fff"/></g>'
          : '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><circle r="32"/><circle r="8" fill="#fff"/><path d="M0 -52V-36M0 36V52M-52 0H-36M36 0H52"/></g>';
        big.innerHTML = `<g transform="translate(${(x0 + 45).toFixed(0)} 770)">${ico}</g><text x="${(x0 + slot + w / 2).toFixed(0)}" y="770">${txt}</text>`;
      } else big.textContent = '';
      }
      // écran dessiné sur l'appareil : température actuelle de l'eau
      if (!this._photo()) r.getElementById('thlcd').textContent = isNaN(temp) ? '--°' : `${this._fmt(temp, 1)}°`;
      r.getElementById('thtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('thbadge');
      badge.textContent = this._t(`mode_${mode}`);
      badge.style.display = c.show_status === false ? 'none' : '';

      const eu = this._unit(c.entity_energy, 'kWh'), tu = this._unit(c.entity_temp || c.entity, '°C'), ru = this._unit(c.entity_reserve, '%');
      const V = {
        energy: [c.entity_energy, this._fmt(this._num(c.entity_energy), 2), eu],
        power: [c.entity_power, this._fmt(power, 0), this._unit(c.entity_power, 'W')],
        mode: [c.entity_mode || c.entity || c.entity_power, this._t(`mode_${mode}`), ''],
        temp: [c.entity_temp || c.entity, this._fmt(temp, 1), tu === '%' ? '°C' : (tu || '°C')],
        bottom: [c.entity_temp_bottom, this._fmt(bottom, 1), tu === '%' ? '°C' : (tu || '°C')],
        target: [c.entity_target || c.entity, this._fmt(target, 0), tu === '%' ? '°C' : (tu || '°C')],
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
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Ariston Nuos (dessin / drawing)' }, { value: 'atlantic_explorer_v5', label: 'Atlantic Explorer V5 200 L (photo)' }] } } },
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
