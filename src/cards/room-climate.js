/* Carte « Climat de la pièce » — custom:appliance-room-climate-card
 * Carte compacte : température, humidité, tendance sur 1 h, courbe des 24 h, thermomètre et goutte animés,
 * badge de confort (seuils réglables), alertes de seuil, point de rosée, risque de moisissure / condensation,
 * conseil d'aération (capteurs extérieurs), fenêtre ouverte (capteur ou chute brutale de température),
 * batterie faible du capteur. Un clic ouvre un pop-up d'historique (24 h / 7 jours / 30 jours,
 * température, humidité ou les deux) lu dans les statistiques long terme de Home Assistant.
 * Calculs internes en °C, affichage dans l'unité choisie (window.applianceTemp, voir editor-labels.js).
 */
(() => {
  const TAG = 'appliance-room-climate-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n room_climate*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
  const BAD = /^(unavailable|unknown|none|)$/i;
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);

  /* ---- physique de l'air (°C, %) ---- */
  // point de rosée (formule de Magnus)
  const dewPoint = (t, rh) => { const a = 17.62, b = 243.12, g = Math.log(Math.max(1, rh) / 100) + (a * t) / (b + t); return (b * g) / (a - g); };
  // humidité absolue en g/m³ : compare l'air intérieur et extérieur (aérer n'assèche que si l'air extérieur contient moins d'eau)
  const absHum = (t, rh) => (6.112 * Math.exp((17.67 * t) / (t + 243.5)) * rh * 2.1674) / (273.15 + t);
  // température estimée de la face intérieure d'un double vitrage : la condensation apparaît quand le point de rosée l'atteint
  const glassTemp = (tin, tout) => tin - 0.3 * (tin - tout);

  const RANGES = { 1: { n: 96 }, 7: { n: 168 }, 30: { n: 180 } }; // nombre de points du graphique par période

  const CSS = `
:host{display:block;height:100%}
[hidden]{display:none!important}
ha-card{height:100%;box-sizing:border-box;padding:12px 12px 8px;cursor:pointer;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:safe center;container-type:inline-size;
  --rc-heat:var(--appliance-heat-color,var(--state-climate-heat-color,#ff8a3d));--rc-cold:var(--appliance-cold-color,var(--state-climate-cool-color,#2b9af9));
  --rc-ok:var(--appliance-ok-color,var(--success-color,#43a047));--rc-alert:var(--appliance-alert-color,var(--error-color,#db4437));
  --rc-hum:var(--appliance-humidity-color,#26b5c9);--rc-dry:var(--appliance-warning-color,var(--warning-color,#e8a317));--rc-trk:rgba(127,127,127,.16);--c:var(--rc-ok);--tc:var(--c)}
ha-card:focus-visible{outline:2px solid var(--c);outline-offset:-2px}
.warm{--c:var(--rc-heat)}.cool{--c:var(--rc-cold)}.humid{--c:var(--rc-hum)}.dry{--c:var(--rc-dry)}.alert{--c:var(--rc-alert)}.unavailable{--c:var(--disabled-text-color,#9e9e9e)}
/* halo de couleur qui « respire » selon le confort */
.halo{position:absolute;top:-50px;right:-40px;width:150px;height:150px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,color-mix(in srgb,var(--c) 22%,transparent),transparent 70%);animation:rcbreathe 5s ease-in-out infinite}
.alert .halo{animation-duration:1.6s}
/* fond transparent : pas de halo coloré (carte superposée à autre chose) */
.transparent .halo{display:none}
.head{display:flex;align-items:center;gap:6px;position:relative;min-width:0}
.ric{--mdc-icon-size:18px;flex:none;color:var(--c)}
.name{flex:1;min-width:0;font-size:14px;font-weight:600;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hic{--mdc-icon-size:17px;flex:none;cursor:pointer}
.win{color:var(--rc-cold)}.bat{color:var(--rc-alert)}
.chip{flex:none;font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:10px;color:var(--c);background:color-mix(in srgb,var(--c) 15%,transparent);white-space:nowrap}
.chip.hide{display:none}
.chip.plain{background:none;padding:0;font-weight:500}
.vt{font-size:26px;font-weight:700;letter-spacing:-.02em;line-height:1;color:var(--primary-text-color);white-space:nowrap}
.vt small{font-size:14px;font-weight:600;color:var(--secondary-text-color);margin-left:1px}
.vh{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--secondary-text-color);white-space:nowrap}
.vh ha-icon{--mdc-icon-size:15px;color:var(--rc-hum)}
.trend{font-size:11px;white-space:nowrap}.trend.up{color:var(--rc-heat)}.trend.down{color:var(--rc-cold)}
.meta{display:flex;flex-wrap:wrap;column-gap:8px;font-size:11px;color:var(--secondary-text-color)}
.meta span{white-space:nowrap}
.meta:empty{display:none}
.notes{display:flex;flex-direction:column;gap:2px;margin-top:6px;position:relative}
.notes:empty{display:none}
.note{display:flex;align-items:flex-start;gap:4px;font-size:11.5px;font-weight:500;color:var(--secondary-text-color);min-width:0}
.note span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.3}
.note ha-icon{--mdc-icon-size:14px;flex:none;margin-top:1px}
.note.n-alert{color:var(--rc-alert);font-weight:600}.note.n-risk{color:var(--rc-hum)}.note.n-air{color:var(--rc-ok)}.note.n-win{color:var(--rc-cold)}
.spark{display:block;width:100%;height:24px;margin-top:6px;position:relative;animation:rcdraw 1.6s ease-out backwards}
.spark.hide{display:none}
.spark .l{fill:none;stroke:var(--c);stroke-width:1.6;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.spark .a{fill:color-mix(in srgb,var(--c) 14%,transparent)}
.trk{fill:none;stroke:var(--rc-trk)}
.arcv{fill:none;stroke-linecap:round;stroke-dasharray:0 100;transition:stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)}
.mm{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:8px;font-size:11px;color:var(--secondary-text-color)}
.mm div{min-width:0}.mm div:nth-child(2){text-align:center}.mm div:nth-child(3){text-align:right}
.mm span,.mm i{display:block;font-style:normal;white-space:nowrap}
.mm b{display:block;font-size:12.5px;color:var(--primary-text-color);white-space:nowrap}
.corner{position:absolute;top:8px;right:8px;display:flex;gap:2px;z-index:1}
.unavailable svg{filter:grayscale(1);opacity:.6}

/* ---- 1. standard ---- */
.body{display:flex;align-items:center;gap:10px;margin-top:6px;position:relative}
.vals{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.gfx{display:flex;gap:4px;align-items:flex-end;flex:none;width:calc(52px * var(--illus-scale,1))}
.gfx svg{display:block;height:auto}
.gfx .th{width:38%}.gfx .dr{width:62%}
.merc{transform-origin:50% 100%;transform-box:fill-box;transition:y .8s,height .8s;animation:rcrise 1.4s cubic-bezier(.2,.8,.2,1) backwards,rcpulse 3s 1.4s ease-in-out infinite}
.wave{animation:rcwave 2.4s linear infinite}

/* ---- 2. jauge ---- */
.g2{display:flex;align-items:center;gap:12px;position:relative}
.g2 .ring{position:relative;flex:none;width:calc(92px * var(--illus-scale,1));aspect-ratio:1}
.g2 svg{width:100%;height:100%;display:block}
.g2 .rv{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.g2 .rv .vt{font-size:19px}.g2 .rv .vt small{font-size:11px}
.g2 .rv #h{font-size:11.5px;font-weight:600;color:var(--rc-hum)}
.g2 .info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.g2 .row{display:flex;align-items:center;gap:6px}

/* ---- 3. dégradé ---- */
ha-card.st-gradient{color:#fff;min-height:128px;padding:12px 14px 14px;background:linear-gradient(135deg,var(--c),color-mix(in srgb,var(--c) 55%,#1a2a6c))}
.st-gradient .name,.st-gradient .vt,.st-gradient .vt small,.st-gradient .vh,.st-gradient .meta,.st-gradient .note,.st-gradient .ric,.st-gradient .trend,.st-gradient .vh ha-icon{color:#fff}
.st-gradient .vt{font-size:34px;font-weight:300;margin-top:8px}.st-gradient .vt small{opacity:.8}
.st-gradient .chip{color:#fff;background:rgba(255,255,255,.22)}
.st-gradient .hic{color:#fff}
.st-gradient .note{font-weight:600}
.st-gradient .fg{position:relative;display:flex;flex-direction:column;gap:3px}
.water{position:absolute;left:0;right:0;bottom:0;height:var(--lvl,30%);opacity:.3;transition:height 1s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.water svg{position:absolute;bottom:calc(100% - 1px);left:0;width:200%;height:10px;animation:rcwave2 4s linear infinite}
.water div{position:absolute;inset:0;background:#fff}
.water.w2{opacity:.16}.water.w2 svg{animation-duration:6.5s;animation-direction:reverse}

/* ---- 4. minimal ---- */
ha-card.st-minimal{padding:12px 14px 12px 18px}
.st-minimal::before{content:"";position:absolute;left:0;top:10px;bottom:10px;width:4px;border-radius:0 4px 4px 0;background:var(--c);transition:background .4s}
.mrow{display:flex;align-items:baseline;gap:12px;margin-top:4px;flex-wrap:wrap}
.mrow .vt{font-size:30px;letter-spacing:-.03em}
.mrow #h{font-size:18px;font-weight:600;color:var(--rc-hum)}
.mbar{height:4px;border-radius:2px;background:var(--rc-trk);margin-top:8px;overflow:hidden}
.mbar i{display:block;height:100%;width:0;background:var(--rc-hum);border-radius:2px;transition:width 1s cubic-bezier(.2,.8,.2,1)}

/* ---- 5. station météo (LCD) ---- */
ha-card.st-lcd{padding:10px;background:linear-gradient(#3a3f45,#24282d);--lcd-bg:linear-gradient(#a8c3a0,#8fae87);--lcd-fg:#1e2a1c;--lcd-glow:none}
.st-lcd.lcd-blue{--lcd-bg:linear-gradient(#0f2730,#0a1a20);--lcd-fg:#38d9ff;--lcd-glow:0 0 6px rgba(56,217,255,.6)}
.st-lcd.lcd-amber{--lcd-bg:linear-gradient(#2b1a06,#1c1104);--lcd-fg:#ffb02e;--lcd-glow:0 0 6px rgba(255,176,46,.55)}
.st-lcd .lbl{display:flex;align-items:center;gap:6px;margin:0 2px 6px}
.st-lcd .name,.st-lcd .ric{color:#e3e7eb}.st-lcd .chip{color:#e3e7eb;background:rgba(255,255,255,.12)}
.scr{border-radius:8px;padding:8px 10px;background:var(--lcd-bg);color:var(--lcd-fg);text-shadow:var(--lcd-glow);box-shadow:inset 0 2px 6px rgba(0,0,0,.35);font-family:"Courier New",ui-monospace,monospace}
.scr .l1{display:flex;justify-content:space-between;font:600 10px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;opacity:.85}
.scr .ind{animation:rcblink 1.6s steps(1) infinite}
.scr .big{font-size:34px;font-weight:700;line-height:1.05}.scr .big small{font-size:15px}
.scr .l3{display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:15px;font-weight:700}
.scr .l3 small{font:600 9px system-ui,sans-serif}
.scr .trend{color:inherit;font-family:system-ui,sans-serif}
.scr .face{width:20px;height:20px;flex:none}
.st-lcd .meta{color:#aeb6be;margin-top:6px}.st-lcd .note{color:#d5dbe0}

/* ---- 6. tuile mini ---- */
ha-card.st-tile{padding:10px;aspect-ratio:1;justify-content:space-between;text-align:center;align-items:stretch}
.st-tile .thead{display:flex;justify-content:center;align-items:center;gap:4px;min-width:0;padding:0 14px}
.st-tile .name{flex:0 1 auto;font-size:12.5px}
.st-tile .ring{position:relative;width:calc(56% * var(--illus-scale,1));max-width:140px;aspect-ratio:1;margin:4px auto}
.st-tile .ring svg{width:100%;height:100%;display:block}
.st-tile .rv{position:absolute;inset:0;display:grid;place-items:center}
.st-tile .vt{font-size:clamp(14px,11cqi,24px)}.st-tile .vt small{font-size:.6em}
.st-tile .tsub{font-size:11.5px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--c);margin-right:4px;vertical-align:1px;animation:rcbreathe2 2s ease-in-out infinite}

/* ---- 7. grand thermomètre ---- */
ha-card.st-thermometer{text-align:center;padding:14px 12px 12px}
.st-thermometer .hd{display:flex;justify-content:center;align-items:center;gap:5px;min-width:0}
.st-thermometer .name{flex:0 1 auto;font-weight:500;font-size:15px}
.st-thermometer .vt{font-size:22px;margin-top:6px}.st-thermometer .vt small{font-size:13px;font-weight:500}
.st-thermometer .vh{justify-content:center;font-weight:600;color:var(--rc-hum)}
.st-thermometer .chip{align-self:center;margin-top:4px}
.th7{display:block;width:calc(130px * var(--illus-scale,1));max-width:100%;height:auto;margin:6px auto 0}
.th7 .tk{stroke:var(--tc);transition:stroke .6s}.th7 text{fill:var(--tc);font-size:10px;transition:fill .6s}
.th7 .glass{fill:rgba(127,127,127,.18);stroke:var(--tc);stroke-width:2.5;transition:stroke .6s}
.th7 .fill{transition:y 1s cubic-bezier(.2,.8,.2,1),height 1s cubic-bezier(.2,.8,.2,1);animation:rcrise 1.4s cubic-bezier(.2,.8,.2,1) backwards;transform-origin:50% 100%;transform-box:fill-box}
.th7 .fill{fill:var(--tc)}
.st-thermometer .mm i{display:none}

/* ---- 8. anneau dégradé ---- */
.g8{display:flex;gap:10px;align-items:stretch}
.g8 .main{flex:1;min-width:0;max-width:240px;margin:0 auto;display:flex;flex-direction:column;align-items:center}
.g8 .head{justify-content:center;width:100%}.g8 .name{flex:0 1 auto}
.ring8{position:relative;width:calc(160px * var(--illus-scale,1));max-width:100%;aspect-ratio:1;margin-top:4px}
.ring8 svg{width:100%;height:100%;display:block}
.ring8 .seg{fill:none;opacity:0;transition:opacity .25s}
.ring8 .seg.on{opacity:1}
.ring8 .v8{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.pill{display:flex;align-items:center;gap:7px;font-weight:700;font-size:17px;color:var(--primary-text-color);white-space:nowrap}
.pill .vt{font-size:17px}.pill .vt small{font-size:12px}
.pi{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;flex:none}
.pi ha-icon{--mdc-icon-size:16px}
.pi.t{background:color-mix(in srgb,var(--tc) 20%,transparent);color:var(--tc)}.pi.h{background:color-mix(in srgb,var(--rc-hum) 20%,transparent);color:var(--rc-hum)}
.g8 .c8{display:flex;gap:6px;align-items:center;margin-top:2px}
.g8 .side{display:none;flex-direction:column;gap:8px;flex:1;min-width:0}
.mini{position:relative;flex:1;min-height:80px;background:rgba(127,127,127,.07);border-radius:12px;padding:6px 10px;overflow:hidden}
.mini b{font-size:12px;color:var(--secondary-text-color)}
.mini svg{position:absolute;left:34px;right:8px;bottom:8px;top:24px;width:calc(100% - 42px);height:calc(100% - 32px)}
.mini .l{fill:none;stroke-width:2;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.tag{position:absolute;left:6px;font-size:10px;background:rgba(0,0,0,.55);color:#fff;border-radius:8px;padding:1px 5px}
.tag.hi{top:24px}.tag.lo{bottom:8px}
@container (min-width:400px){.g8 .side{display:flex}.g8 .main{flex:none;width:200px}}

/* ---- 9. double anneau ---- */
ha-card.st-double_ring{padding:14px 14px 0;--t9:var(--appliance-temperature-color,#4a90e2);--h9:var(--appliance-humidity-ring-color,#f5b942)}
.st-double_ring>.chip{position:absolute;top:10px;left:10px;z-index:1}
.ring9{position:relative;width:calc(140px * var(--illus-scale,1));aspect-ratio:1;margin:0 auto}
.ring9 svg{width:100%;height:100%;display:block}
.c9{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;padding:0 18px}
.c9 .ric{--mdc-icon-size:22px;color:var(--secondary-text-color)}
.c9 .name{flex:none;max-width:100%;font-size:11px;font-weight:400;font-style:italic;color:var(--secondary-text-color);text-align:center}
.c9 .vt{font-size:28px;font-weight:300;letter-spacing:0}
.c9 .vh{font-size:12.5px}
.lg9{display:flex;justify-content:center;gap:14px;font-size:12px;color:var(--secondary-text-color);margin:6px 0 2px}
.lg9 i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;vertical-align:-1px}
.st-double_ring .notes{margin-bottom:4px}
.bg9{display:block;width:calc(100% + 28px);height:44px;margin:4px -14px 0;animation:rcdraw 1.6s ease-out backwards}
.bg9 .a1{fill:var(--h9);opacity:.18}.bg9 .a2{fill:var(--t9);opacity:.22}.bg9 .l{fill:none;stroke:var(--t9);stroke-width:1.2;vector-effect:non-scaling-stroke}

/* ---- 10. cadran à aiguilles ---- */
.st-dial .dial{display:block;width:calc(170px * var(--illus-scale,1));max-width:100%;height:auto;margin:6px auto 2px}
.dial .needle{transform-box:view-box;transform-origin:100px 100px;transition:transform 1.6s cubic-bezier(.3,1.5,.5,1)}
.dial .wob{transform-box:view-box;transform-origin:100px 100px;animation:rcwob 4s ease-in-out infinite}
.dial .wob.b{animation-duration:5.3s;animation-delay:-1s}
.dial text{font-family:Georgia,"Times New Roman",serif}
.d10{display:flex;justify-content:center;align-items:baseline;gap:10px;flex-wrap:wrap}
.d10 .vt{font-size:22px}
.d10 #h{font-size:15px;font-weight:600;color:var(--rc-hum)}
.st-dial .meta{justify-content:center}

/* ---- 11. néon ---- */
ha-card.st-neon{background:#07080c;--ha-card-border-color:#000;color:#fff}
.st-neon .name{color:#fff;font-weight:500;text-shadow:0 0 6px rgba(255,255,255,.5)}
.st-neon .ric{color:var(--c);filter:drop-shadow(0 0 4px var(--c))}
.st-neon .chip{background:none;border:1px solid var(--c);box-shadow:0 0 6px var(--c),inset 0 0 4px var(--c);text-shadow:0 0 4px var(--c)}
.st-neon .vt{font-size:36px;font-weight:300;color:#fff;margin-top:8px;text-shadow:0 0 4px #fff,0 0 12px var(--c),0 0 24px var(--c),0 0 40px var(--c);animation:rcflicker 2.2s linear backwards}
.st-neon .vt small{color:#fff}
.st-neon .vh{color:#bff6ff;font-size:15px;text-shadow:0 0 4px var(--rc-hum),0 0 12px var(--rc-hum)}
.st-neon .vh ha-icon{color:var(--rc-hum);filter:drop-shadow(0 0 4px var(--rc-hum))}
.st-neon .meta{color:#9aa3ad}.st-neon .note{text-shadow:0 0 6px currentColor}
.st-neon .spark .l{stroke-width:2;filter:drop-shadow(0 0 3px var(--c))}.st-neon .spark .a{fill:color-mix(in srgb,var(--c) 10%,transparent)}
.st-neon .hic{filter:drop-shadow(0 0 4px currentColor)}

/* ---- 12. barres ---- */
.b12{display:flex;gap:12px;align-items:flex-end;margin-top:8px}
.col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:none}
.col .cv{font-size:15px;font-weight:700;color:var(--primary-text-color);white-space:nowrap}
.col .cv small{font-size:11px;color:var(--secondary-text-color)}
.tube{position:relative;width:calc(30px * var(--illus-scale,1));height:calc(92px * var(--illus-scale,1));border-radius:9px;background:var(--rc-trk);overflow:hidden}
.tube i{position:absolute;left:0;right:0;bottom:0;height:0;border-radius:9px;background:var(--tc);transition:height 1s cubic-bezier(.2,.8,.2,1),background .6s}
.tube i.h{background:linear-gradient(var(--rc-hum),color-mix(in srgb,var(--rc-hum) 60%,#0b3d91))}
.tube i::after{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:rgba(255,255,255,.35);border-radius:9px}
.tube .zone{position:absolute;left:-1px;right:-1px;border:1.5px dashed color-mix(in srgb,var(--rc-ok) 70%,transparent);border-left:0;border-right:0;pointer-events:none}
.col ha-icon{--mdc-icon-size:16px;color:var(--secondary-text-color)}
.b12 .side{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;align-self:stretch;justify-content:flex-end}

/* ---- thermostat lié (entity_climate) ---- */
.clim{display:flex;align-items:center;gap:6px;margin-top:8px;padding:4px 6px 4px 8px;border-radius:12px;background:rgba(127,127,127,.09);font-size:12px;color:var(--secondary-text-color);position:relative;cursor:default}
.clim .cl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.clim button{width:26px;height:26px;flex:none;border-radius:50%;border:none;background:rgba(127,127,127,.18);color:var(--primary-text-color);cursor:pointer;font:600 16px/1 system-ui,sans-serif;display:grid;place-items:center;padding:0}
.clim button:disabled{opacity:.35;cursor:default}
.clim button:focus-visible{outline:2px solid var(--c);outline-offset:1px}
.clim b{min-width:44px;text-align:center;color:var(--primary-text-color);font-size:13px;white-space:nowrap}
.clim b.pending{color:var(--c)}
.clim ha-icon{--mdc-icon-size:16px;flex:none}
.clim.heating ha-icon{color:var(--rc-heat);animation:rcbreathe2 1.4s ease-in-out infinite}
.clim.cooling ha-icon{color:var(--rc-cold);animation:rcbreathe2 1.4s ease-in-out infinite}
.st-gradient .clim,.st-lcd .clim,.st-neon .clim{background:rgba(255,255,255,.12);color:#e9edf1}
.st-gradient .clim b,.st-lcd .clim b,.st-neon .clim b,.st-gradient .clim button,.st-lcd .clim button,.st-neon .clim button{color:#fff}
.st-gradient .clim{position:relative}
.st-tile .clim{display:none!important}
.st-double_ring .clim{order:1;margin:6px 0 2px}.st-double_ring .bg9{order:2}
.noanim *,.noanim *::before,.noanim *::after{animation:none!important}
@media (prefers-reduced-motion:reduce){ha-card *,ha-card *::before{animation:none!important}}
@keyframes rcbreathe{50%{transform:scale(1.15);opacity:.7}}
@keyframes rcbreathe2{50%{opacity:.35}}
@keyframes rcrise{from{transform:scaleY(0)}}
@keyframes rcpulse{50%{transform:scaleY(.94)}}
@keyframes rcwave{to{transform:translateX(-20px)}}
@keyframes rcwave2{to{transform:translateX(-50%)}}
@keyframes rcdraw{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes rcblink{50%{opacity:.2}}
@keyframes rcwob{25%{transform:rotate(.8deg)}75%{transform:rotate(-.8deg)}}
@keyframes rcflicker{0%,18%,22%,25%,53%,57%{opacity:1}20%,24%,55%{opacity:.25}from{opacity:0}}
`;

  const DROP = 'M15 3C15 3 4 17 4 26a11 11 0 0 0 22 0C26 17 15 3 15 3Z';
  const WAVE = '<svg viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path d="M0 5Q12.5 0 25 5T50 5T75 5T100 5T125 5T150 5T175 5T200 5V10H0Z" fill="#fff"/></svg>';
  const STYLES = ['standard', 'gauge', 'gradient', 'minimal', 'lcd', 'tile', 'thermometer', 'gradient_ring', 'double_ring', 'dial', 'neon', 'bars'];
  const DIAL = { t0: 215, h0: 145, span: 110 };
  const DEF_ICON = { double_ring: 'mdi:home-thermometer-outline' };
  // arc de cercle (degrés, 0 = droite, sens horaire)
  const arc = (cx, cy, r, a0, a1) => {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const clamp01 = (v) => (fin(v) ? Math.max(0, Math.min(1, v)) : 0);
  // graduations d'une échelle en unité d'affichage : pas de 10 (°C) ou 20 (°F)
  const ticks = (lo, hi, step) => { const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(v); return out; };
  let uid = 0;
  // options de couleur → variables CSS
  const COLORS = { color_comfort: '--appliance-ok-color', color_cool: '--appliance-cold-color', color_warm: '--appliance-heat-color',
    color_humidity: '--appliance-humidity-color', color_dry: '--appliance-warning-color', color_alert: '--appliance-alert-color' };
  // couleur saisie : [r, g, b] (sélecteur de couleur) ou texte CSS (#hex, nom…)
  const cssColor = (v) => (Array.isArray(v) && v.length >= 3 ? `rgb(${v.slice(0, 3).map((x) => Math.round(Number(x) || 0)).join(',')})` : typeof v === 'string' && /^[#a-z0-9(),.%\s-]+$/i.test(v.trim()) && v.trim() ? v.trim() : '');

  /* ---- gabarits HTML par style (ids communs : name, ric, chip, t, tu, h, trend, meta, win, bat, notes, spark, mm) ---- */
  const ICONS = '<ha-icon class="hic win" id="win" icon="mdi:window-open-variant" hidden></ha-icon><ha-icon class="hic bat" id="bat" icon="mdi:battery-alert-variant-outline" hidden></ha-icon>';
  const RIC = '<ha-icon class="ric" id="ric" hidden></ha-icon>';
  const HEAD = (chip = true) => `<div class="head">${RIC}<span class="name" id="name"></span>${ICONS}${chip ? '<span class="chip" id="chip"></span>' : ''}</div>`;
  const VT = '<div class="vt"><span id="t">--</span><small id="tu"></small></div>';
  const VH = '<div class="vh"><ha-icon icon="mdi:water-percent"></ha-icon><span id="h"></span><span class="trend" id="trend"></span></div>';
  const META = '<div class="meta" id="meta"></div>', NOTES = '<div class="notes" id="notes"></div>';
  const SPARK = '<svg class="spark hide" id="spark" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path class="a" d=""/><path class="l" d=""/></svg>';
  const CLIM = '<div class="clim" id="clim" hidden><ha-icon id="cico" icon="mdi:thermostat"></ha-icon><span class="cl" id="cl"></span><button id="cm" type="button">−</button><b id="ct"></b><button id="cp" type="button">+</button></div>';
  const MM = '<div class="mm" id="mm">' + ['min', 'avg', 'max'].map((k) => `<div data-k="${k}"><span></span><b></b><i></i></div>`).join('') + '</div>';

  const TPL = {
    standard: (id) => `<div class="halo"></div>${HEAD()}
      <div class="body"><div class="vals">${VT}<div class="vh"><span id="h"></span><span class="trend" id="trend"></span></div>${META}</div>
        <div class="gfx">
          <svg class="th" viewBox="0 0 18 46" aria-hidden="true"><rect x="5" y="2" width="8" height="34" rx="4" fill="none" stroke="var(--secondary-text-color)" stroke-opacity=".45" stroke-width="1.5"/>
            <circle cx="9" cy="38" r="6.5" fill="var(--c)"/><rect class="merc" id="merc" x="7" y="20" width="4" height="18" rx="2" fill="var(--c)"/></svg>
          <svg class="dr" viewBox="0 0 30 42" aria-hidden="true"><defs><clipPath id="${id}d"><path d="${DROP}"/></clipPath></defs>
            <path d="${DROP}" fill="var(--rc-hum)" fill-opacity=".12" stroke="var(--rc-hum)" stroke-width="1.5"/>
            <g clip-path="url(#${id}d)"><path class="wave" id="wave" fill="var(--rc-hum)" fill-opacity=".75" d=""/></g></svg>
        </div></div>${NOTES}${SPARK}`,
    gauge: () => `<div class="halo"></div><div class="g2">
        <div class="ring"><svg viewBox="0 0 100 100" aria-hidden="true">
          <path class="trk" d="${arc(50, 50, 44, 135, 405)}" stroke-width="7" stroke-linecap="round"/><path class="arcv" id="ra" pathLength="100" d="${arc(50, 50, 44, 135, 405)}" stroke="var(--c)" stroke-width="7"/>
          <path class="trk" d="${arc(50, 50, 33, 135, 405)}" stroke-width="4" stroke-linecap="round"/><path class="arcv" id="rb" pathLength="100" d="${arc(50, 50, 33, 135, 405)}" stroke="var(--rc-hum)" stroke-width="4"/></svg>
          <div class="rv">${VT}<span id="h"></span></div></div>
        <div class="info">${HEAD(false)}<div class="row"><span class="chip" id="chip"></span><span class="trend" id="trend"></span></div>${META}${NOTES}</div></div>`,
    gradient: () => `<div class="water w2">${WAVE}<div></div></div><div class="water">${WAVE}<div></div></div>
      <div class="fg">${HEAD()}${VT}${VH}${META}${NOTES}</div>`,
    minimal: () => `${HEAD(false)}<div class="mrow">${VT}<span id="h"></span><span class="trend" id="trend"></span><span class="chip plain" id="chip"></span></div>
      <div class="mbar"><i id="hb"></i></div>${NOTES}`,
    lcd: () => `<div class="lbl head">${RIC}<span class="name" id="name"></span>${ICONS}<span class="chip" id="chip"></span></div>
      <div class="scr"><div class="l1"><span id="lin"></span><span class="ind" id="ind"></span></div>
        <div class="big"><span id="t">--</span><small id="tu"></small></div>
        <div class="l3"><span><span id="hl"></span><small>%RH</small></span><span class="trend" id="trend"></span>
          <svg class="face" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7" cy="8" r="1.2" fill="currentColor"/><circle cx="13" cy="8" r="1.2" fill="currentColor"/><path id="mouth" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d=""/></svg></div></div>
      ${META}${NOTES}`,
    tile: () => `<div class="corner">${ICONS}</div><div class="thead">${RIC}<span class="name" id="name"></span></div>
      <div class="ring"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="27" stroke-width="5"/>
        <circle class="arcv" id="ra" cx="32" cy="32" r="27" pathLength="100" stroke="var(--rc-hum)" stroke-width="5" transform="rotate(-90 32 32)"/></svg><div class="rv">${VT}</div></div>
      <div class="tsub"><span class="dot"></span><span id="h"></span> · <span class="chip plain" id="chip"></span></div>`,
    thermometer: (id, tmp) => {
      // échelle -20 → 40 °C (ou °F équivalents), tube et réservoir
      const lo = tmp.c(-20), hi = tmp.c(40), step = tmp.unit === '°F' ? 20 : 10, y0 = 22, y1 = 196;
      const y = (v) => y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
      let tk = '';
      for (let v = Math.ceil(lo / (step / 5)) * (step / 5); v <= hi + 1e-9; v += step / 5) {
        const big = Math.abs(v / step - Math.round(v / step)) < 1e-6, yy = y(v).toFixed(1);
        tk += `<line class="tk" x1="${big ? 22 : 27}" x2="34" y1="${yy}" y2="${yy}" stroke-width="${big ? 1.6 : 0.8}"/>`;
        if (big) tk += `<text x="17" y="${(+yy + 3.5).toFixed(1)}" text-anchor="end">${Math.round(v)}</text>`;
      }
      return `<div class="hd">${RIC}<span class="name" id="name"></span>${ICONS}</div>${VT}${VH}<span class="chip" id="chip"></span>
        <svg class="th7" viewBox="0 0 130 250" aria-hidden="true" data-lo="${lo}" data-hi="${hi}" data-y0="${y0}" data-y1="${y1}">
          <defs><clipPath id="${id}k"><path d="M70 22a16 16 0 0 1 32 0v168a30 30 0 1 1-32 0Z"/></clipPath></defs>${tk}
          <path class="glass" d="M64 22a22 22 0 0 1 44 0v164a36 36 0 1 1-44 0Z"/>
          <g clip-path="url(#${id}k)"><rect x="40" y="0" width="100" height="250" fill="rgba(127,127,127,.22)"/><rect class="fill" id="tf" x="40" y="196" width="100" height="60"/>
</g>
          <path d="M77 30v150" stroke="#fff" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/></svg>
        ${MM}${NOTES}`;
    },
    gradient_ring: (id) => {
      const N = 40, a0 = 135, span = 270;
      const seg = Array.from({ length: N }, (_, k) => `<path class="seg" d="${arc(85, 85, 74, a0 + (span * k) / N, a0 + (span * (k + 1)) / N + 0.6)}" stroke="hsl(${200 - (k / N) * 150} 85% 52%)" stroke-width="9" style="transition-delay:${k * 18}ms"/>`).join('');
      return `<div class="g8"><div class="main">${HEAD(false)}
          <div class="ring8"><svg viewBox="0 0 170 170" aria-hidden="true"><path class="trk" d="${arc(85, 85, 74, a0, a0 + span)}" stroke-width="9" stroke-linecap="round"/>${seg}
            <path class="trk" d="${arc(85, 85, 60, a0, a0 + span)}" stroke-width="5" stroke-linecap="round"/><path class="arcv" id="rb" pathLength="100" d="${arc(85, 85, 60, a0, a0 + span)}" stroke="var(--rc-hum)" stroke-width="5"/></svg>
            <div class="v8"><div class="pill"><span class="pi t"><ha-icon icon="mdi:thermometer"></ha-icon></span>${VT}</div><div class="pill"><span class="pi h"><ha-icon icon="mdi:water-percent"></ha-icon></span><span id="h"></span></div></div></div>
          <div class="c8"><span class="chip" id="chip"></span><span class="trend" id="trend"></span></div>${NOTES}</div>
        <div class="side" id="side">
          <div class="mini"><b id="u8"></b><span class="tag hi" id="t8hi"></span><span class="tag lo" id="t8lo"></span><svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2c12e"/><stop offset=".5" stop-color="#3fbf8f"/><stop offset="1" stop-color="#2ab4e6"/></linearGradient></defs>
            <path id="t8a" fill="url(#${id}g)" opacity=".2" d=""/><path class="l" id="t8l" stroke="url(#${id}g)" d=""/></svg></div>
          <div class="mini"><b>%</b><span class="tag hi" id="h8hi"></span><span class="tag lo" id="h8lo"></span><svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path class="l" id="h8l" stroke="var(--rc-hum)" d=""/></svg></div>
        </div></div>`;
    },
    double_ring: () => `<span class="chip" id="chip"></span><div class="corner">${ICONS}</div>
      <div class="ring9"><svg viewBox="0 0 140 140" aria-hidden="true"><circle class="trk" cx="70" cy="70" r="64" stroke-width="5"/><circle class="trk" cx="70" cy="70" r="56" stroke-width="5"/>
        <circle class="arcv" id="ra" cx="70" cy="70" r="64" pathLength="100" stroke="var(--t9)" stroke-width="5" transform="rotate(-90 70 70)"/>
        <circle class="arcv" id="rb" cx="70" cy="70" r="56" pathLength="100" stroke="var(--h9)" stroke-width="5" transform="rotate(-90 70 70)"/></svg>
        <div class="c9">${RIC}<span class="name" id="name"></span>${VT}<div class="vh"><ha-icon icon="mdi:water-percent"></ha-icon><span id="h"></span></div></div></div>
      ${MM}<div class="lg9"><span><i style="background:var(--t9)"></i><span id="lt"></span></span><span><i style="background:var(--h9)"></i><span id="lh"></span></span></div>${NOTES}
      <svg class="bg9" id="bg9" viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden="true"><path class="a1" id="bgh" d=""/><path class="a2" id="bgt" d=""/><path class="l" id="bgl" d=""/></svg>`,
    dial: (id, tmp) => {
      // cadran thermo-hygromètre : température sur l'arc du haut (215° → 325°), humidité sur l'arc du bas (145° → 35°)
      const tlo = tmp.c(0), thi = tmp.c(40), tstep = tmp.unit === '°F' ? 20 : 10;
      const aT = (v) => DIAL.t0 + ((v - tlo) / (thi - tlo)) * DIAL.span, aH = (v) => DIAL.h0 - (v / 100) * DIAL.span;
      const pt = (a, r) => [100 + r * Math.cos((a * Math.PI) / 180), 100 + r * Math.sin((a * Math.PI) / 180)];
      const line = (a, r0, r1, w) => { const [x0, y0] = pt(a, r0), [x1, y1] = pt(a, r1); return `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#3a3328" stroke-width="${w}"/>`; };
      const txt = (a, r, s, fs = 11) => { const [x, y] = pt(a, r); return `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-size="${fs}" fill="#3a3328">${s}</text>`; };
      let g = '';
      for (let v = tlo; v <= thi + 1e-9; v += tstep / 5) { const big = Math.abs(v / tstep - Math.round(v / tstep)) < 1e-6; g += line(aT(v), 74, big ? 64 : 69, big ? 1.4 : 0.7); }
      ticks(tlo, thi, tstep).forEach((v) => { g += txt(aT(v), 55, Math.round(v)); });
      for (let v = 0; v <= 100; v += 5) { const big = v % 20 === 0; g += line(aH(v), 74, big ? 64 : 69, big ? 1.4 : 0.7); }
      [0, 20, 40, 60, 80, 100].forEach((v) => { g += txt(aH(v), 55, v); });
      return `${HEAD()}<svg class="dial" viewBox="0 0 200 200" aria-hidden="true" data-tlo="${tlo}" data-thi="${thi}">
          <defs><linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d68b"/><stop offset=".45" stop-color="#c9973f"/><stop offset="1" stop-color="#8a6324"/></linearGradient>
            <radialGradient id="${id}f" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#efe7d4"/></radialGradient></defs>
          <circle cx="100" cy="100" r="97" fill="url(#${id}b)"/><circle cx="100" cy="100" r="88" fill="url(#${id}f)" stroke="#7a5520" stroke-width="1"/>
          <path id="zt" d="" fill="none" stroke="#43a047" stroke-opacity=".55" stroke-width="5"/><path id="zh" d="" fill="none" stroke="#26b5c9" stroke-opacity=".55" stroke-width="5"/>
          ${g}${txt(270, 32, tmp.unit, 12)}${txt(90, 32, '%RH', 10)}
          <g class="needle" id="nh"><g class="wob b"><path d="M100 100L98.4 112L100 168L101.6 112Z" fill="#1f6fbf"/></g></g>
          <g class="needle" id="nt"><g class="wob"><path d="M100 100L98.2 88L100 30L101.8 88Z" fill="#c62828"/></g></g>
          <circle cx="100" cy="100" r="6" fill="#3a3328"/><circle cx="100" cy="100" r="2.2" fill="#c9973f"/>
          <ellipse cx="78" cy="58" rx="46" ry="20" fill="#fff" opacity=".18" transform="rotate(-25 78 58)"/></svg>
        <div class="d10">${VT}<span id="h"></span><span class="trend" id="trend"></span></div>${META}${NOTES}`;
    },
    neon: () => `${HEAD()}${VT}${VH}${META}${NOTES}${SPARK}`,
    bars: () => `${HEAD()}<div class="b12">
        <div class="col"><div class="cv"><span id="t">--</span><small id="tu"></small></div><div class="tube"><span class="zone" id="zbt"></span><i id="bt"></i></div><ha-icon icon="mdi:thermometer"></ha-icon></div>
        <div class="col"><div class="cv"><span id="h"></span></div><div class="tube"><span class="zone" id="zbh"></span><i class="h" id="bh"></i></div><ha-icon icon="mdi:water-percent"></ha-icon></div>
        <div class="side"><span class="trend" id="trend"></span>${META}${NOTES}</div></div>`,
  };

  class ApplianceRoomClimateCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const S = (hass && hass.states) || {}, ids = Object.keys(S), dc = (i, d) => i.startsWith('sensor.') && (S[i].attributes || {}).device_class === d;
      const out = /(outdoor|outside|exterieur|extérieur|ext_|_ext|weather|meteo|météo|garden|jardin)/i;
      const t = ids.find((i) => dc(i, 'temperature') && !out.test(i)) || '';
      const twin = t && t.replace(/temp(erature)?/i, 'humidity');
      const h = (twin && S[twin] && twin) || ids.find((i) => dc(i, 'humidity') && !out.test(i)) || '';
      return { entity_temperature: t, entity_humidity: h };
    }
    setConfig(c) {
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (window.applianceSize) window.applianceSize(this, c);
      this._c = { show_status: true, show_outdoor: true, show_dew_point: true, show_advice: true, show_graph: true,
        humidity_min: 35, humidity_max: 65, mold_humidity: 70, battery_low: 20, history_days: 7, history_mode: 'both', ...c };
      this._built = false; this._hist = null; this._histAt = 0;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); if (this._dlg) this._dlg.hass = h; }
    get hass() { return this._hass; }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    // variant : nom du style ; « style » reste accepté (anciennes configs) quand c'est un nom de style,
    // car dans une carte picture-elements, style est l'objet CSS de positionnement de Home Assistant
    _style() { const c = this._c || {}, v = STYLES.includes(c.variant) ? c.variant : c.style; return STYLES.includes(v) ? v : 'standard'; }
    getCardSize() { return { thermometer: 6, double_ring: 5, gradient_ring: 4, dial: 5, tile: 2 }[this._style()] || 2; }
    getGridOptions() {
      const st = this._style();
      if (st === 'tile') return { columns: 3, min_columns: 2, rows: 'auto', min_rows: 2 };
      if (st === 'thermometer') return { columns: 4, min_columns: 3, rows: 'auto', min_rows: 4 };
      return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 2 };
    }

    /* ---- textes ---- */
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _fmt(v, d = 1) { return fin(v) ? v.toLocaleString(this._lang(), { minimumFractionDigits: d, maximumFractionDigits: d }) : '--'; }
    _tmp() { return window.applianceTemp(this._hass, this._c); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _raw(id) { const s = this._st(id); if (!s || BAD.test(String(s.state))) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return Number.isFinite(v) ? v : NaN; }
    // température d'une entité dans l'unité d'affichage
    _temp(id) { const v = this._raw(id); return fin(v) ? this._tmp().conv(v, this._st(id)) : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // seuil réglé dans l'éditeur (unité d'affichage), sinon valeur par défaut écrite en °C
    _thr(k, defC) { const v = this._c[k]; return v === '' || v == null || !Number.isFinite(Number(v)) ? (defC == null ? NaN : this._tmp().c(defC)) : Number(v); }
    _num(k, def) { const v = this._c[k]; return v === '' || v == null || !Number.isFinite(Number(v)) ? def : Number(v); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), id = `rc${++uid}`, st = this._style();
      this._unit = this._tmp().unit;
      root.innerHTML = `<style>${CSS}</style><ha-card tabindex="0" role="button" class="st-${st}">${TPL[st](id, this._tmp())}${CLIM}</ha-card>`;
      const card = root.querySelector('ha-card');
      card.addEventListener('click', () => this._tap());
      card.addEventListener('keydown', (e) => { if (e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this._tap(); } });
      // thermostat : un clic ne déclenche pas l'action de la carte
      const clim = root.getElementById('clim');
      clim.addEventListener('click', (e) => e.stopPropagation());
      clim.addEventListener('keydown', (e) => e.stopPropagation());
      root.getElementById('cm').addEventListener('click', () => this._setTarget(-1));
      root.getElementById('cp').addEventListener('click', () => this._setTarget(1));
      root.getElementById('cl').addEventListener('click', () => this._more(this._c.entity_climate));
      // icônes : ouvrent la fiche de l'entité concernée
      root.getElementById('win').addEventListener('click', (e) => { if (this._c.entity_window) { e.stopPropagation(); this._more(this._c.entity_window); } });
      root.getElementById('bat').addEventListener('click', (e) => { e.stopPropagation(); this._more(this._c.entity_battery || this._c.entity_temperature || this._c.entity_humidity); });
      this._root = root; this._card = card; this._built = true;
    }

    /* ---- historique 24 h pour les courbes, la tendance, min / moy / max et la détection d'ouverture de fenêtre ---- */
    _loadHist() {
      const c = this._c, h = this._hass, ids = [c.entity_temperature, c.entity_humidity].filter(Boolean);
      if (!ids.length || this._histBusy || Date.now() - this._histAt < 15 * 60000 || !h || typeof h.callWS !== 'function') return;
      this._histBusy = true; this._histAt = Date.now();
      const end = Date.now(), start = end - 24 * 3600e3;
      h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
        entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
        .then((r) => {
          const pts = (id, f) => ((r && r[id]) || []).map((p) => ({ t: (p.lu ?? p.lc) * 1000, v: f(parseFloat(p.s)) })).filter((p) => Number.isFinite(p.t) && fin(p.v));
          const tmp = this._tmp(), ts = this._st(c.entity_temperature);
          this._hist = { t: c.entity_temperature ? pts(c.entity_temperature, (v) => tmp.conv(v, ts)) : [], h: c.entity_humidity ? pts(c.entity_humidity, (v) => v) : [] };
        })
        .catch(() => { this._hist = null; })
        .finally(() => { this._histBusy = false; if (this._hass) this._render(); });
    }
    // série 24 h : historique + valeurs vues en direct (sans recorder, la courbe se construit au fil des mises à jour)
    _series(key, now, cur) {
      this._live = this._live || { t: [], h: [] };
      const L = this._live[key];
      if (fin(cur) && (!L.length || L[L.length - 1].v !== cur || now - L[L.length - 1].t > 10 * 60000)) L.push({ t: now, v: cur });
      while (L.length && L[0].t < now - 24 * 3600e3) L.shift();
      const H = ((this._hist && this._hist[key]) || []).filter((p) => p.t >= now - 24 * 3600e3);
      const last = H.length ? H[H.length - 1].t : 0;
      return H.concat(L.filter((p) => p.t > last));
    }
    // valeur d'une série à un instant (dernier point connu avant)
    _at(s, t) { let v = NaN; for (const p of s) { if (p.t > t) break; v = p.v; } return v; }
    // min / moyenne (pondérée par la durée) / max sur la série, avec l'heure du min et du max
    _mm(s, now) {
      if (!s.length) return null;
      let mn = s[0], mx = s[0], area = 0, dur = 0;
      s.forEach((p, i) => {
        if (p.v < mn.v) mn = p; if (p.v > mx.v) mx = p;
        const t1 = i + 1 < s.length ? s[i + 1].t : now, d = Math.max(0, t1 - p.t); area += p.v * d; dur += d;
      });
      return { min: mn.v, minAt: mn.t, max: mx.v, maxAt: mx.t, avg: dur ? area / dur : s.reduce((a, p) => a + p.v, 0) / s.length };
    }
    // tracé d'une série sur 24 h dans une boîte W × H
    _path(pts, W, H, pad = 2) {
      if (pts.length < 2) return null;
      const now = Date.now(), t0 = now - 24 * 3600e3, vs = pts.map((p) => p.v);
      const mn = Math.min(...vs), mx = Math.max(...vs), span = Math.max(mx - mn, 0.6), off = (span - (mx - mn)) / 2;
      const x = (t) => ((Math.max(t0, t) - t0) / (now - t0)) * W, y = (v) => H - pad - ((v - mn + off) / span) * (H - 2 * pad);
      let d = `M0 ${y(pts[0].v).toFixed(1)}`;
      pts.forEach((p) => { d += `L${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`; });
      d += `L${W} ${y(pts[pts.length - 1].v).toFixed(1)}`;
      return { d, area: `${d}L${W} ${H}L0 ${H}Z`, mn, mx };
    }

    _compute() {
      const c = this._c, now = Date.now(), tmp = this._tmp();
      const t = this._temp(c.entity_temperature), h = this._raw(c.entity_humidity);
      const tOut = this._temp(c.entity_outdoor_temperature), hOut = this._raw(c.entity_outdoor_humidity);
      const toC = (v) => tmp.toC(v);
      const sT = this._series('t', now, t), sH = this._series('h', now, h);
      const tMin = this._thr('comfort_temp_min', 19), tMax = this._thr('comfort_temp_max', 25);
      const hMin = this._num('humidity_min', 35), hMax = this._num('humidity_max', 65);
      const aTMax = this._thr('alert_temp_max'), aTMin = this._thr('alert_temp_min'), aHMax = this._num('alert_humidity_max', NaN), aHMin = this._num('alert_humidity_min', NaN);
      const ok = fin(t) || fin(h);
      // badge de confort
      let cls = 'ok', chip = 'comfort';
      if (!ok) { cls = 'unavailable'; chip = 'unavailable'; }
      else if (fin(t) && t > tMax) { cls = 'warm'; chip = 'warm'; }
      else if (fin(t) && t < tMin) { cls = 'cool'; chip = 'cool'; }
      else if (fin(h) && h > hMax) { cls = 'humid'; chip = 'humid'; }
      else if (fin(h) && h < hMin) { cls = 'dry'; chip = 'dry'; }
      // alertes de seuil : priorité sur le confort
      const alerts = [];
      if (fin(t) && fin(aTMax) && t >= aTMax) alerts.push(['too_hot', aTMax, tmp.unit]);
      if (fin(t) && fin(aTMin) && t <= aTMin) alerts.push(['too_cold', aTMin, tmp.unit]);
      if (fin(h) && fin(aHMax) && h >= aHMax) alerts.push(['too_humid', aHMax, ' %']);
      if (fin(h) && fin(aHMin) && h <= aHMin) alerts.push(['too_dry', aHMin, ' %']);
      if (alerts.length) { cls = 'alert'; chip = alerts[0][0]; }
      // couleur de la température (thermomètre, barres, anneau) : bleu froid → vert confort → orange → rouge
      const tcol = !fin(t) ? '#9e9e9e' : t < tMin - tmp.d(4) ? '#2f6fe0' : t < tMin ? '#4aa8e8' : t <= tMax ? '#3fbf8f' : t <= tMax + tmp.d(3) ? '#f2a33a' : '#e5482f';
      // point de rosée, moisissure, condensation (en °C)
      const tC = toC(t), dpC = fin(t) && fin(h) ? dewPoint(tC, h) : NaN;
      const mold = fin(h) && h >= this._num('mold_humidity', 70);
      const tOutC = toC(tOut);
      const cond = fin(dpC) && fin(tOutC) && tOutC < tC && dpC >= glassTemp(tC, tOutC);
      // fenêtre : capteur, sinon chute brutale (window_drop en 15 min ; 0 = désactivé)
      const winS = this._st(c.entity_window);
      const winOpen = !!winS && /^(on|open|opening|true)$/i.test(String(winS.state));
      const drop = this._num('window_drop', tmp.d(1.5));
      let winGuess = false, dropBy = 0;
      if (!c.entity_window && drop > 0 && fin(t)) {
        const recent = sT.filter((p) => p.t >= now - 15 * 60000).map((p) => p.v);
        dropBy = recent.length ? Math.max(...recent) - t : 0;
        winGuess = dropBy >= drop;
      }
      // conseil d'aération : l'air extérieur assèche (humidité absolue plus basse) ou rafraîchit la pièce
      let air = null;
      if (!winOpen && !winGuess && fin(tOutC) && fin(tC)) {
        if (fin(h) && fin(hOut) && h > hMax && absHum(tOutC, hOut) < absHum(tC, h) - 1) air = 'air_dry';
        else if (fin(t) && t > tMax && tOutC < tC - 2) air = 'air_cool';
      }
      // batterie du capteur : entité dédiée (binaire ou %), sinon attribut battery_level / battery du capteur
      let bat = NaN, batLow = false;
      const bs = this._st(c.entity_battery);
      if (bs && c.entity_battery.startsWith('binary_sensor.')) batLow = String(bs.state) === 'on';
      else {
        bat = this._raw(c.entity_battery);
        if (!fin(bat)) for (const id of [c.entity_temperature, c.entity_humidity]) { const a = (this._st(id) || {}).attributes || {}; const v = parseFloat(a.battery_level ?? a.battery); if (Number.isFinite(v)) { bat = v; break; } }
        batLow = fin(bat) && bat < this._num('battery_low', 20);
      }
      // tendance : écart avec la valeur d'il y a une heure
      const t1h = this._at(sT, now - 3600e3), trend = fin(t) && fin(t1h) ? t - t1h : NaN;
      return { t, h, tOut, hOut, dp: fin(dpC) ? tmp.c(dpC) : NaN, cls, chip, alerts, mold, cond, winOpen, winGuess, dropBy, air, bat, batLow, trend, sT, sH, tmp, tcol, tMin, tMax, hMin, hMax, now };
    }

    _render() {
      if (this._built && this._unit !== this._tmp().unit) this._built = false; // les échelles dessinées dépendent de l'unité
      if (!this._built) this._build();
      this._loadHist();
      const c = this._c, r = this._root, s = this._compute(), tmp = s.tmp, st = this._style();
      const $ = (id) => r.getElementById(id), txt = (id, v) => { const e = $(id); if (e) e.textContent = v; };
      this._card.className = `st-${st} ${s.cls}${c.animations === false ? ' noanim' : ''}${c.transparent ? ' transparent' : ''}`;
      this._card.style.setProperty('--tc', s.tcol);
      // couleurs personnalisées (éditeur) : variables --appliance-*, lues aussi par le pop-up
      Object.entries(COLORS).forEach(([k, v]) => { const col = cssColor(c[k]); if (col) this.style.setProperty(v, col); else this.style.removeProperty(v); });
      this._renderClimate(tmp);
      txt('name', c.name || this._t('name'));
      const ric = $('ric'), icon = c.icon || DEF_ICON[st];
      if (ric) { ric.hidden = !icon; if (icon) ric.setAttribute('icon', icon); }
      const chip = $('chip');
      if (chip) { chip.textContent = this._l(s.chip); chip.classList.toggle('hide', c.show_status === false); }
      txt('t', fin(s.t) ? this._fmt(s.t) : fin(s.h) ? `${this._fmt(s.h, 0)}` : '--');
      txt('tu', fin(s.t) || !fin(s.h) ? tmp.unit : ' %');
      txt('h', fin(s.t) && fin(s.h) ? `${this._fmt(s.h, 0)} %` : '');
      const tr = $('trend');
      if (tr) {
        const dt = Math.round(s.trend * 10) / 10;
        tr.className = 'trend' + (dt > 0 ? ' up' : dt < 0 ? ' down' : '');
        tr.hidden = c.show_trend === false;
        tr.textContent = !fin(s.trend) ? '' : Math.abs(dt) < 0.2 ? `= ${this._t('stable')}` : `${dt > 0 ? '▲' : '▼'} ${this._fmt(Math.abs(dt))}°`;
        tr.title = this._t('trend_1h');
      }
      // ligne d'infos : extérieur et point de rosée
      const meta = [];
      if (c.show_outdoor !== false && (fin(s.tOut) || fin(s.hOut))) meta.push(`${this._l('outdoor')} ${[fin(s.tOut) ? `${this._fmt(s.tOut)}°` : '', fin(s.hOut) ? `${this._fmt(s.hOut, 0)} %` : ''].filter(Boolean).join(' · ')}`);
      if (c.show_dew_point !== false && fin(s.dp)) meta.push(`${this._l('dew_point')} ${this._fmt(s.dp)}°`);
      if ($('meta')) $('meta').innerHTML = meta.map((m) => `<span>${esc(m)}</span>`).join('');
      // icônes : fenêtre ouverte, batterie faible
      const win = $('win'), bat = $('bat');
      win.hidden = !(s.winOpen || s.winGuess);
      win.setAttribute('icon', s.winOpen ? 'mdi:window-open-variant' : 'mdi:window-open');
      win.title = this._t(s.winOpen ? 'window_open' : 'window_guess');
      bat.hidden = !s.batLow;
      bat.title = `${this._t('battery_low')}${fin(s.bat) ? ` (${Math.round(s.bat)} %)` : ''}`;
      // lignes d'alerte et de conseil
      const notes = [];
      s.alerts.forEach(([k, v, u]) => notes.push(['n-alert', 'mdi:alert', `${this._l(k)} (${u === ' %' ? this._fmt(v, 0) : this._fmt(v)}${u})`]));
      if (s.winGuess) notes.push(['n-win', 'mdi:window-open', this._t('window_drop_note').replace('{n}', this._fmt(s.dropBy))]);
      if (c.show_advice !== false) {
        if (s.cond) notes.push(['n-risk', 'mdi:water-alert-outline', this._l('condensation_risk')]);
        else if (s.mold) notes.push(['n-risk', 'mdi:water-alert-outline', this._l('mold_risk')]);
        if (s.air) notes.push(['n-air', 'mdi:weather-windy', `${this._l('ventilate')} : ${this._t(s.air)}`]);
      }
      const maxN = st === 'minimal' ? 1 : 2;
      if ($('notes')) $('notes').innerHTML = notes.slice(0, maxN).map(([k, ic, tx]) => `<div class="note ${k}"><ha-icon icon="${ic}"></ha-icon><span title="${esc(tx)}">${esc(tx)}</span></div>`).join('');
      this._card.title = notes.map((n) => n[2]).join('\n');
      // courbe 24 h (standard, néon)
      const sp = $('spark');
      if (sp) {
        const p = c.show_graph !== false && this._path(fin(s.t) ? s.sT : s.sH, 300, 30);
        sp.classList.toggle('hide', !p);
        if (p) { sp.querySelector('.l').setAttribute('d', p.d); sp.querySelector('.a').setAttribute('d', p.area); }
      }
      // min / moy / max sur 24 h
      const mmEl = $('mm');
      if (mmEl) {
        const m = this._mm(fin(s.t) ? s.sT : s.sH, s.now), u = fin(s.t) ? (st === 'thermometer' ? '°' : ` ${tmp.unit}`) : ' %', d = fin(s.t) ? 1 : 0;
        const hm = new Intl.DateTimeFormat(this._lang(), { hour: '2-digit', minute: '2-digit' });
        const V = { min: [m && m.min, m && m.minAt], avg: [m && m.avg, null], max: [m && m.max, m && m.maxAt] };
        mmEl.querySelectorAll('[data-k]').forEach((el) => {
          const [v, at] = V[el.dataset.k];
          el.querySelector('span').textContent = this._l(el.dataset.k === 'avg' ? 'avg_short' : el.dataset.k);
          el.querySelector('b').textContent = fin(v) ? `${this._fmt(v, d)}${u}` : '--';
          el.querySelector('i').textContent = at ? hm.format(at) : ' ';
        });
      }
      const pT = clamp01((tmp.toC(s.t) - 10) / 20); // 10 → 30 °C : remplissage des anneaux
      const ring = (id, p) => { const e = $(id); if (e) e.style.strokeDasharray = `${(p * 100).toFixed(1)} 100`; };
      const paint = {
        standard: () => {
          const pct = fin(s.t) ? Math.max(0.12, pT) : 0.12, mh = 34 * pct;
          $('merc').setAttribute('y', (36 - mh).toFixed(1)); $('merc').setAttribute('height', (mh + 2).toFixed(1));
          const lvl = (42 - 34 * ((fin(s.h) ? s.h : 0) / 100)).toFixed(1);
          $('wave').setAttribute('d', `M0 ${lvl} q5 -3 10 0 t10 0 t10 0 t10 0 t10 0 V50 H0Z`);
        },
        gauge: () => { ring('ra', fin(s.t) ? Math.max(0.03, pT) : 0); ring('rb', clamp01(s.h / 100)); },
        gradient: () => { this._card.style.setProperty('--lvl', `${(fin(s.h) ? s.h : 0) * 0.55}%`); },
        minimal: () => { $('hb').style.width = `${clamp01(s.h / 100) * 100}%`; },
        lcd: () => {
          // couleur de l'écran : vert le jour, bleu en thème sombre (lcd_color : auto / green / blue / amber)
          const lc = ['green', 'blue', 'amber'].includes(c.lcd_color) ? c.lcd_color : this._hass && this._hass.themes && this._hass.themes.darkMode ? 'blue' : 'green';
          this._card.classList.add(`lcd-${lc}`);
          txt('lin', this._t('indoor'));
          txt('ind', s.cls === 'ok' || s.cls === 'unavailable' ? '' : `${s.cls === 'cool' || s.cls === 'dry' || s.chip === 'too_cold' || s.chip === 'too_dry' ? '▼' : '▲'} ${this._l(s.chip)}`);
          txt('hl', fin(s.h) ? this._fmt(s.h, 0) : '--');
          $('mouth').setAttribute('d', s.cls === 'ok' ? 'M6.5 12.2Q10 15.4 13.5 12.2' : s.cls === 'unavailable' ? 'M6.5 13.5H13.5' : 'M6.5 14.4Q10 11.2 13.5 14.4');
        },
        tile: () => ring('ra', clamp01(s.h / 100)),
        thermometer: () => {
          const sv = r.querySelector('.th7'), lo = +sv.dataset.lo, hi = +sv.dataset.hi, y0 = +sv.dataset.y0, y1 = +sv.dataset.y1;
          const v = fin(s.t) ? Math.max(lo, Math.min(hi, s.t)) : lo, yy = y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
          $('tf').setAttribute('y', yy.toFixed(1)); $('tf').setAttribute('height', (250 - yy).toFixed(1));
        },
        gradient_ring: () => {
          const segs = r.querySelectorAll('.seg'), n = fin(s.t) ? Math.max(1, Math.round(pT * segs.length)) : 0;
          segs.forEach((e, k) => e.classList.toggle('on', k < n));
          ring('rb', clamp01(s.h / 100));
          const side = $('side'), pt = this._path(s.sT, 200, 60, 3), ph = this._path(s.sH, 200, 60, 3);
          side.hidden = c.show_graph === false || (!pt && !ph);
          txt('u8', tmp.unit);
          $('t8l').setAttribute('d', pt ? pt.d : ''); $('t8a').setAttribute('d', pt ? pt.area : ''); $('h8l').setAttribute('d', ph ? ph.d : '');
          txt('t8hi', pt ? this._fmt(pt.mx) : ''); txt('t8lo', pt ? this._fmt(pt.mn) : ''); txt('h8hi', ph ? this._fmt(ph.mx, 0) : ''); txt('h8lo', ph ? this._fmt(ph.mn, 0) : '');
          $('t8hi').hidden = $('t8lo').hidden = !pt; $('h8hi').hidden = $('h8lo').hidden = !ph;
        },
        double_ring: () => {
          ring('ra', fin(s.t) ? Math.max(0.03, pT) : 0); ring('rb', clamp01(s.h / 100));
          txt('lt', this._l('temperature')); txt('lh', this._l('humidity'));
          const pt = this._path(s.sT, 300, 44, 4), ph = this._path(s.sH, 300, 44, 4), bg = $('bg9');
          bg.style.display = c.show_graph === false || (!pt && !ph) ? 'none' : '';
          $('bgt').setAttribute('d', pt ? pt.area : ''); $('bgl').setAttribute('d', pt ? pt.d : ''); $('bgh').setAttribute('d', ph ? ph.area : '');
        },
        dial: () => {
          const sv = r.querySelector('.dial'), tlo = +sv.dataset.tlo, thi = +sv.dataset.thi;
          const aT = (v) => DIAL.t0 + ((Math.max(tlo, Math.min(thi, v)) - tlo) / (thi - tlo)) * DIAL.span, aH = (v) => DIAL.h0 - (Math.max(0, Math.min(100, v)) / 100) * DIAL.span;
          // aiguilles : température vers le haut (270°), humidité vers le bas (90°) ; ressort à l'arrivée
          $('nt').style.transform = `rotate(${(fin(s.t) ? aT(s.t) : DIAL.t0) - 270}deg)`;
          $('nh').style.transform = `rotate(${(fin(s.h) ? aH(s.h) : DIAL.h0) - 90}deg)`;
          $('zt').setAttribute('d', arc(100, 100, 78, aT(s.tMin), aT(s.tMax)));
          $('zh').setAttribute('d', arc(100, 100, 78, aH(s.hMax), aH(s.hMin)));
        },
        neon: () => {},
        bars: () => {
          const lo = tmp.c(0), hi = tmp.c(40), pt = fin(s.t) ? clamp01((s.t - lo) / (hi - lo)) : 0;
          $('bt').style.height = `${pt * 100}%`; $('bh').style.height = `${clamp01(s.h / 100) * 100}%`;
          const zone = (id, a, b) => { const e = $(id); e.style.bottom = `${clamp01(a) * 100}%`; e.style.top = `${(1 - clamp01(b)) * 100}%`; };
          zone('zbt', (s.tMin - lo) / (hi - lo), (s.tMax - lo) / (hi - lo)); zone('zbh', s.hMin / 100, s.hMax / 100);
        },
      };
      paint[st]();
    }

    // action au clic : pop-up d'historique (défaut), fiche de l'entité, navigation ou rien
    _tap() {
      const c = this._c, a = c.tap_action || 'history';
      if (a === 'none') return;
      if (a === 'more-info') { this._more(c.entity_temperature || c.entity_humidity); return; }
      if (a === 'navigate') {
        if (!c.navigation_path) return;
        history.pushState(null, '', c.navigation_path);
        window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
        return;
      }
      this._open();
    }

    /* ---- thermostat lié : consigne, action en cours, boutons − / + ---- */
    // unité des attributs d'une entité climate = unité de Home Assistant
    _sysF() { const u = String(this._hass?.config?.unit_system?.temperature || '').toLowerCase(); return u.includes('f'); }
    _climTarget(tmp) {
      const cs = this._st(this._c.entity_climate);
      if (!cs) return null;
      const a = cs.attributes || {}, cv = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? tmp.conv(n, cs) : NaN; };
      return { cs, a, t: cv(a.temperature), lo: cv(a.target_temp_low), hi: cv(a.target_temp_high), min: cv(a.min_temp), max: cv(a.max_temp),
        step: Number(a.target_temp_step) || (tmp.unit === '°F' ? 1 : 0.5) };
    }
    _renderClimate(tmp) {
      const r = this._root, el = r.getElementById('clim'), c = this._c, k = c.entity_climate && this._climTarget(tmp);
      el.hidden = !k;
      if (!k) return;
      const off = /^(off|unavailable|unknown)$/i.test(String(k.cs.state)), act = String(k.a.hvac_action || '');
      const heating = act === 'heating' || act === 'preheating', cooling = act === 'cooling';
      el.className = `clim${heating ? ' heating' : cooling ? ' cooling' : ''}`;
      r.getElementById('cico').setAttribute('icon', off ? 'mdi:power' : heating ? 'mdi:fire' : cooling ? 'mdi:snowflake' : act === 'drying' ? 'mdi:water-percent' : 'mdi:thermostat');
      const cl = r.getElementById('cl');
      cl.textContent = off ? this._l('thermostat_off') : this._l('target');
      el.title = `${cl.textContent}${heating ? ` · ${this._t('heating')}` : cooling ? ` · ${this._t('cooling')}` : ''}`;
      const single = fin(k.t), shown = this._pending != null ? this._pending : k.t;
      const ct = r.getElementById('ct');
      ct.textContent = single ? `${this._fmt(shown, k.step < 1 ? 1 : 0)}°` : fin(k.lo) && fin(k.hi) ? `${this._fmt(k.lo, 0)}–${this._fmt(k.hi, 0)}°` : '--';
      ct.classList.toggle('pending', this._pending != null);
      r.getElementById('cm').disabled = r.getElementById('cp').disabled = off || !single;
      r.getElementById('cm').hidden = r.getElementById('cp').hidden = !single;
    }
    // − / + : la consigne change tout de suite à l'écran, l'appel part 0,8 s après le dernier clic
    _setTarget(dir) {
      const tmp = this._tmp(), k = this._climTarget(tmp);
      if (!k || !fin(k.t)) return;
      let v = (this._pending != null ? this._pending : k.t) + dir * k.step;
      if (fin(k.min)) v = Math.max(k.min, v); if (fin(k.max)) v = Math.min(k.max, v);
      this._pending = Math.round(v / k.step) * k.step;
      this._renderClimate(tmp);
      clearTimeout(this._climTimer);
      this._climTimer = setTimeout(() => {
        const disp = this._pending, f = tmp.unit === '°F', sf = this._sysF();
        const send = f === sf ? disp : f ? (disp - 32) / 1.8 : disp * 1.8 + 32;
        this._hass.callService('climate', 'set_temperature', { entity_id: this._c.entity_climate, temperature: Math.round(send * 10) / 10 });
        setTimeout(() => { this._pending = null; if (this._hass) this._render(); }, 4000);
      }, 800);
    }

    _open() {
      if (!this._c.entity_temperature && !this._c.entity_humidity) return;
      const dlg = document.createElement(TAG.replace('-card', '-dialog'));
      dlg.card = this; this._dlg = dlg;
      dlg.addEventListener('closed', () => { if (this._dlg === dlg) this._dlg = null; });
      document.body.appendChild(dlg);
    }
  }
  customElements.define(TAG, ApplianceRoomClimateCard);

  /* ---- pop-up d'historique ----
   * Ajouté à <body> (et non dans la carte) : un parent avec transform / contain n'emprisonne pas la superposition.
   * Les variables du thème sont recopiées depuis la carte, car <body> est hors de <home-assistant>.
   */
  const DCSS = `
:host{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;
  font-family:var(--paper-font-body1_-_font-family,var(--ha-font-family-body,Roboto,system-ui,sans-serif));-webkit-font-smoothing:antialiased}
.bd{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;transition:opacity .25s}
:host(.open) .bd{opacity:1}
.dlg{position:relative;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);border-radius:18px;
  width:min(640px,100%);max-height:92vh;overflow:auto;padding:16px 18px 18px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.35);
  transform:translateY(20px) scale(.97);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .2s}
:host(.open) .dlg{transform:none;opacity:1}
.hd{display:flex;align-items:center;gap:10px}
.tt{flex:1;min-width:0}.tt b{display:block;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tt span{font-size:12px;color:var(--secondary-text-color,#727272)}
.x{width:36px;height:36px;border-radius:50%;border:none;background:rgba(127,127,127,.14);color:inherit;cursor:pointer;display:grid;place-items:center;flex:none}
.x ha-icon{--mdc-icon-size:20px}
.bar{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 10px}
.seg{display:flex;gap:3px;background:rgba(127,127,127,.12);padding:3px;border-radius:10px;flex:1;min-width:200px}
.seg.r{flex:0 1 auto;min-width:0}
.seg button{flex:1;border:none;background:none;color:var(--secondary-text-color,#727272);padding:6px 10px;border-radius:8px;cursor:pointer;font:inherit;font-size:13px;white-space:nowrap}
.seg button.on{background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#212121);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:10px}
.st{background:rgba(127,127,127,.09);border-radius:10px;padding:6px 9px;min-width:0}
.st span{display:block;font-size:11px;color:var(--secondary-text-color,#727272)}
.st b{display:block;font-size:15px;white-space:nowrap}.st i{display:block;font-style:normal;font-size:12px;color:var(--secondary-text-color,#727272)}
.chart{position:relative;min-height:120px}
.chart svg{display:block;width:100%;height:auto;overflow:visible;touch-action:pan-y}
.gl{stroke:var(--divider-color,rgba(127,127,127,.25))}
.chart text{fill:var(--secondary-text-color,#727272);font-size:10px}
.lt{fill:none;stroke:var(--rc-heat);stroke-width:2;stroke-linejoin:round}.lh{fill:none;stroke:var(--rc-hum);stroke-width:2;stroke-linejoin:round}
.prev{stroke-dasharray:5 4;opacity:.5;stroke-width:1.6}
.seg button ha-icon{--mdc-icon-size:15px;vertical-align:-3px}
.lo{fill:none;stroke:var(--secondary-text-color,#888);stroke-width:1.4;stroke-dasharray:4 4;opacity:.8}
.bt{fill:color-mix(in srgb,var(--rc-heat) 16%,transparent)}.bh{fill:color-mix(in srgb,var(--rc-hum) 16%,transparent)}
.zone{fill:var(--rc-ok);fill-opacity:.09}
.anim{animation:rcdraw 1.1s ease-out both}
.msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--secondary-text-color,#727272)}
.tip{position:absolute;pointer-events:none;background:var(--primary-text-color,#212121);color:var(--ha-card-background,var(--card-background-color,#fff));font-size:11.5px;
  padding:5px 8px;border-radius:7px;white-space:nowrap;transform:translate(-50%,-115%);opacity:0;transition:opacity .15s}
.lg{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--secondary-text-color,#727272);margin-top:6px}
.lg i{display:inline-block;width:12px;height:3px;border-radius:2px;vertical-align:middle;margin-right:5px}
.days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-top:12px}
.days:empty{display:none}
.day{text-align:center;background:rgba(127,127,127,.07);border-radius:9px;padding:6px 2px;font-size:11px;color:var(--secondary-text-color,#727272);min-width:0}
.day b{display:block;color:var(--primary-text-color,#212121);font-size:12px;white-space:nowrap}
@media (max-width:480px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.days{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){.anim{animation:none}.dlg,.bd{transition:none}}
@keyframes rcdraw{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
`;
  const THEME = ['--ha-card-background', '--card-background-color', '--primary-text-color', '--secondary-text-color', '--divider-color', '--primary-color',
    '--paper-font-body1_-_font-family', '--ha-font-family-body', '--appliance-heat-color', '--appliance-humidity-color', '--appliance-ok-color', '--state-climate-heat-color', '--success-color'];

  class ApplianceRoomClimateDialog extends HTMLElement {
    connectedCallback() {
      const card = this.card, c = card._c, cs = getComputedStyle(card);
      THEME.forEach((v) => { const x = cs.getPropertyValue(v).trim(); if (x) this.style.setProperty(v, x); });
      this.style.setProperty('--rc-heat', cs.getPropertyValue('--appliance-heat-color').trim() || cs.getPropertyValue('--state-climate-heat-color').trim() || '#ff8a3d');
      this.style.setProperty('--rc-hum', cs.getPropertyValue('--appliance-humidity-color').trim() || '#26b5c9');
      this.style.setProperty('--rc-ok', cs.getPropertyValue('--appliance-ok-color').trim() || cs.getPropertyValue('--success-color').trim() || '#43a047');
      const days = [1, 7, 30].includes(Number(c.history_days)) ? Number(c.history_days) : 7;
      let mode = ['both', 'temperature', 'humidity'].includes(c.history_mode) ? c.history_mode : 'both';
      if (!c.entity_humidity) mode = 'temperature'; else if (!c.entity_temperature) mode = 'humidity';
      this._days = days; this._mode = mode; this._data = {}; this._busy = {}; this._cmp = false;
      const t = (k) => card._l(k), both = c.entity_temperature && c.entity_humidity;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${DCSS}</style><div class="bd"></div>
        <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="ti">
          <div class="hd"><div class="tt"><b id="ti">${esc(c.name || card._t('name'))}</b><span>${esc(card._t('history'))}</span></div>
            <button class="x" aria-label="${esc(card._t('close'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
          <div class="bar">
            ${both ? `<div class="seg m">${[['both', 'both'], ['temperature', 'temperature'], ['humidity', 'humidity']].map(([m, k]) => `<button data-m="${m}">${esc(t(k))}</button>`).join('')}</div>` : ''}
            <div class="seg r">${[[1, 'h24'], [7, 'd7'], [30, 'd30']].map(([d, k]) => `<button data-d="${d}">${esc(t(k))}</button>`).join('')}</div>
            <div class="seg r"><button data-c aria-pressed="false"><ha-icon icon="mdi:compare-horizontal"></ha-icon> ${esc(t('compare'))}</button></div>
          </div>
          <div class="stats" id="stats"></div>
          <div class="chart" id="chart"></div>
          <div class="lg" id="lg"></div>
          <div class="days" id="days"></div>
        </div>`;
      root.querySelector('.bd').addEventListener('click', () => this.close());
      root.querySelector('.x').addEventListener('click', () => this.close());
      root.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => { this._mode = b.dataset.m; this._draw(); }));
      root.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => { this._days = Number(b.dataset.d); this._load(); }));
      root.querySelector('[data-c]').addEventListener('click', () => { this._cmp = !this._cmp; this._load(); });
      this._key = (e) => { if (e.key === 'Escape') this.close(); };
      window.addEventListener('keydown', this._key);
      this._root = root;
      requestAnimationFrame(() => { this.classList.add('open'); root.querySelector('.x').focus(); });
      this._load();
    }
    disconnectedCallback() { window.removeEventListener('keydown', this._key); }
    close() {
      this.classList.remove('open');
      setTimeout(() => { this.remove(); this.dispatchEvent(new CustomEvent('closed')); }, 250);
      if (this.card && this.card._card) this.card._card.focus();
    }

    // lecture : statistiques long terme (moyenne / min / max à l'heure) pour 7 et 30 jours, historique brut pour 24 h ou à défaut
    async _fetch(start, end, days) {
      const card = this.card, c = card._c, h = card._hass;
      const ids = { t: c.entity_temperature, h: c.entity_humidity, o: c.entity_outdoor_temperature, oh: c.entity_outdoor_humidity };
      const list = Object.values(ids).filter(Boolean);
      const tmp = card._tmp(), conv = { t: (v) => tmp.conv(v, card._st(ids.t)), o: (v) => tmp.conv(v, card._st(ids.o)), h: (v) => v, oh: (v) => v };
      const out = { t: [], h: [], o: [], oh: [] };
      if (!h || typeof h.callWS !== 'function') return { err: true, ...out };
      let stats = {};
      if (days > 1) {
        stats = await h.callWS({ type: 'recorder/statistics_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
          statistic_ids: list, period: 'hour', types: ['mean', 'min', 'max'] }).catch(() => ({}));
      }
      const missing = list.filter((id) => !(stats && stats[id] && stats[id].length));
      let hist = {};
      if (missing.length) {
        hist = await h.callWS({ type: 'history/history_during_period', start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
          entity_ids: missing, minimal_response: true, no_attributes: true, significant_changes_only: false }).catch(() => ({}));
      }
      for (const [k, id] of Object.entries(ids)) {
        if (!id) continue;
        const f = conv[k];
        if (stats && stats[id] && stats[id].length) {
          out[k] = stats[id].map((p) => {
            const t0 = typeof p.start === 'number' ? p.start : Date.parse(p.start);
            const m = parseFloat(p.mean), mn = parseFloat(p.min), mx = parseFloat(p.max);
            return { t: t0 + 1800e3, v: f(m), mn: f(Number.isFinite(mn) ? mn : m), mx: f(Number.isFinite(mx) ? mx : m) };
          }).filter((p) => fin(p.v));
        } else {
          out[k] = ((hist && hist[id]) || []).map((p) => { const v = f(parseFloat(p.s)); return { t: (p.lu ?? p.lc) * 1000, v, mn: v, mx: v }; }).filter((p) => fin(p.v) && Number.isFinite(p.t));
        }
      }
      return out;
    }
    // période affichée, et période précédente (décalée d'autant pour se superposer) quand « Comparer » est actif
    async _load() {
      const days = this._days, end = Date.now(), span = days * 86400e3, h = this.card._hass;
      // sans recorder (pas de callWS) : message tout de suite
      if (!h || typeof h.callWS !== 'function') { this._data[days] = { err: true, t: [], h: [], o: [], oh: [] }; this._draw(); return; }
      this._draw();
      const jobs = [[days, end - span, end, 0]];
      if (this._cmp) jobs.push([`${days}p`, end - 2 * span, end - span, span]);
      for (const [key, a, b, shift] of jobs) {
        if (this._data[key] || this._busy[key]) continue;
        this._busy[key] = true;
        let out;
        try { out = await this._fetch(a, b, days); } catch (e) { out = { err: true, t: [], h: [], o: [], oh: [] }; }
        if (shift) ['t', 'h', 'o', 'oh'].forEach((k) => { out[k] = out[k].map((p) => ({ ...p, t: p.t + shift })); });
        this._data[key] = out; this._busy[key] = false;
        if (this._days === days) this._draw(true);
      }
    }

    // regroupe les points en n cases régulières (moyenne, min, max) ; une case vide garde la dernière valeur connue
    _bucket(pts, start, end, n) {
      const step = (end - start) / n, B = [];
      let i = 0, last = null;
      while (i < pts.length && pts[i].t < start) { last = pts[i]; i++; }
      for (let k = 0; k < n; k++) {
        const b0 = start + k * step, b1 = b0 + step;
        let sum = 0, cnt = 0, mn = Infinity, mx = -Infinity;
        while (i < pts.length && pts[i].t < b1) { const p = pts[i]; sum += p.v; cnt++; mn = Math.min(mn, p.mn); mx = Math.max(mx, p.mx); last = p; i++; }
        if (cnt) B.push({ t: b0 + step / 2, v: sum / cnt, mn, mx });
        else if (last && b0 >= pts[0].t - step) B.push({ t: b0 + step / 2, v: last.v, mn: last.v, mx: last.v });
        else B.push(null);
      }
      return B;
    }

    _draw(anim) {
      const r = this._root, card = this.card, c = card._c, days = this._days, mode = this._mode, tmp = card._tmp(), lang = card._lang();
      r.querySelectorAll('[data-m]').forEach((b) => b.classList.toggle('on', b.dataset.m === mode));
      r.querySelectorAll('[data-d]').forEach((b) => b.classList.toggle('on', Number(b.dataset.d) === days));
      const cb = r.querySelector('[data-c]'); cb.classList.toggle('on', this._cmp); cb.setAttribute('aria-pressed', String(this._cmp));
      const D = this._data[days], chart = r.getElementById('chart');
      const showT = mode !== 'humidity' && !!c.entity_temperature, showH = mode !== 'temperature' && !!c.entity_humidity;
      // valeurs actuelles, ajoutées en fin de série
      const curT = card._temp(c.entity_temperature), curH = card._raw(c.entity_humidity);
      const fT = (v) => `${card._fmt(v)}${tmp.unit}`, fH = (v) => `${card._fmt(v, 0)} %`;
      if (!D) { chart.innerHTML = `<div class="msg">${esc(card._t('loading'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }
      if (D.err || (!D.t.length && !D.h.length)) { chart.innerHTML = `<div class="msg">${esc(card._t('no_history'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }
      const end = Date.now(), start = end - days * 86400e3, n = RANGES[days].n;
      const withCur = (s, v) => (fin(v) ? s.concat([{ t: end - 1, v, mn: v, mx: v }]) : s);
      const sT = this._bucket(withCur(D.t, curT), start, end, n), sH = this._bucket(withCur(D.h, curH), start, end, n);
      const sO = this._bucket(D.o, start, end, n), sOH = this._bucket(D.oh, start, end, n);
      // période précédente, superposée en pointillés
      const P = this._cmp ? this._data[`${days}p`] : null, none = Array(n).fill(null);
      const pT = P && P.t.length ? this._bucket(P.t, start, end, n) : none, pH = P && P.h.length ? this._bucket(P.h, start, end, n) : none;
      const prevLbl = card._l(days === 1 ? 'yesterday' : 'previous');
      const vals = (s) => s.filter(Boolean);
      if (!vals(sT).length && !vals(sH).length) { chart.innerHTML = `<div class="msg">${esc(card._t('no_history'))}</div>`; r.getElementById('stats').innerHTML = ''; r.getElementById('lg').innerHTML = ''; r.getElementById('days').innerHTML = ''; return; }

      // tuiles : actuelle, moyenne, min, max
      const agg = (s) => { const v = vals(s); return v.length ? { avg: v.reduce((a, p) => a + p.v, 0) / v.length, min: Math.min(...v.map((p) => p.mn)), max: Math.max(...v.map((p) => p.mx)) } : null; };
      const aT = agg(sT), aH = agg(sH);
      const tile = (lbl, vt, vh) => `<div class="st"><span>${esc(card._l(lbl))}</span>${showT ? `<b>${fin(vt) ? fT(vt) : '--'}</b>` : ''}${showH ? (showT ? `<i>${fin(vh) ? fH(vh) : '--'}</i>` : `<b>${fin(vh) ? fH(vh) : '--'}</b>`) : ''}</div>`;
      r.getElementById('stats').innerHTML = tile('current', curT, curH) + tile('average', aT?.avg, aH?.avg) + tile('min', aT?.min, aH?.min) + tile('max', aT?.max, aH?.max);

      // échelles
      const W = 600, H = 210, L = 34, R = showT && showH ? 34 : 10, Tp = 8, B = 22, iw = W - L - R, ih = H - Tp - B;
      const x = (k) => L + ((k + 0.5) / n) * iw;
      const scale = (lists, pad, step, lo, hi) => {
        const all = lists.flatMap((s) => vals(s).flatMap((p) => [p.mn, p.mx]));
        let a = Math.min(...all), b = Math.max(...all);
        if (!all.length) { a = 0; b = 1; }
        a = Math.floor((a - pad) / step) * step; b = Math.ceil((b + pad) / step) * step;
        if (lo != null) a = Math.max(lo, a); if (hi != null) b = Math.min(hi, b);
        if (b - a < step * 2) b = a + step * 2;
        return [a, b];
      };
      const [t0, t1] = scale(mode === 'temperature' ? [sT, sO, pT] : [sT, pT], 0.3, 1);
      const [h0, h1] = scale(mode === 'humidity' ? [sH, sOH, pH] : [sH, pH], 2, 5, 0, 100);
      const yT = (v) => Tp + ih - ((v - t0) / (t1 - t0)) * ih, yH = (v) => Tp + ih - ((v - h0) / (h1 - h0)) * ih;
      const line = (s, y, k = 'v') => { let d = '', pen = false; s.forEach((p, i) => { if (!p) { pen = false; return; } d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p[k]).toFixed(1)}`; pen = true; }); return d; };
      const band = (s, y) => { // bande min-max, segment par segment (les trous coupent la bande)
        let d = '', seg = [];
        const flush = () => { if (seg.length > 1) d += `M${seg.map(([i, p]) => `${x(i).toFixed(1)} ${y(p.mx).toFixed(1)}`).join('L')}L${seg.slice().reverse().map(([i, p]) => `${x(i).toFixed(1)} ${y(p.mn).toFixed(1)}`).join('L')}Z`; seg = []; };
        s.forEach((p, i) => { if (p) seg.push([i, p]); else flush(); }); flush();
        return d;
      };
      let g = '';
      for (let k = 0; k <= 4; k++) {
        const yy = Tp + (ih * k) / 4;
        g += `<line class="gl" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/>`;
        if (showT) g += `<text x="${L - 5}" y="${yy + 3}" text-anchor="end">${card._fmt(t1 - ((t1 - t0) * k) / 4, t1 - t0 < 4 ? 1 : 0)}°</text>`;
        if (showH) g += `<text x="${showT ? W - R + 5 : L - 5}" y="${yy + 3}" text-anchor="${showT ? 'start' : 'end'}">${Math.round(h1 - ((h1 - h0) * k) / 4)}%</text>`;
      }
      // repères de temps : toutes les 4 h (24 h), chaque jour (7 j), tous les 5 jours (30 j)
      const xt = (t) => L + ((t - start) / (end - start)) * iw;
      const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
      if (days === 1) {
        const first = new Date(start); first.setMinutes(0, 0, 0); first.setHours(first.getHours() + 1);
        for (let t = first.getTime(); t < end; t += 3600e3) {
          if (new Date(t).getHours() % 4) continue;
          g += `<line class="gl" x1="${xt(t)}" x2="${xt(t)}" y1="${Tp}" y2="${Tp + ih}" stroke-dasharray="2 3"/><text x="${xt(t)}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { hour: 'numeric' }).format(t)}</text>`;
        }
      } else {
        for (let t = dayStart(start) + 86400e3; t < end; t = dayStart(t + 30 * 3600e3)) {
          const dd = new Date(t), lbl = days === 7 || dd.getDate() % 5 === 1;
          g += `<line class="gl" x1="${xt(t)}" x2="${xt(t)}" y1="${Tp}" y2="${Tp + ih}" stroke-dasharray="2 3" ${days === 30 && !lbl ? 'opacity=".35"' : ''}/>`;
          if (days === 7) g += `<text x="${Math.min(W - R - 12, xt(t + 43200e3))}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(t)}</text>`;
          else if (lbl) g += `<text x="${xt(t)}" y="${H - 6}" text-anchor="middle">${new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(t)}</text>`;
        }
      }
      // zone de confort (une seule mesure affichée)
      const ct0 = card._thr('comfort_temp_min', 19), ct1 = card._thr('comfort_temp_max', 25), ch0 = card._num('humidity_min', 35), ch1 = card._num('humidity_max', 65);
      const zone = (a, b, y, lo, hi) => { const ya = y(Math.min(hi, Math.max(lo, b))), yb = y(Math.min(hi, Math.max(lo, a))); return yb - ya > 0 ? `<rect class="zone" x="${L}" width="${iw}" y="${ya}" height="${yb - ya}"/>` : ''; };
      if (showT && !showH) g += zone(ct0, ct1, yT, t0, t1);
      if (showH && !showT) g += zone(ch0, ch1, yH, h0, h1);
      const A = anim ? ' anim' : '';
      if (showT && !showH) g += `<path class="bt${A}" d="${band(sT, yT)}"/>`;
      if (showH && !showT) g += `<path class="bh${A}" d="${band(sH, yH)}"/>`;
      if (showT && !showH && vals(sO).length) g += `<path class="lo${A}" d="${line(sO, yT)}"/>`;
      if (showH && !showT && vals(sOH).length) g += `<path class="lo${A}" d="${line(sOH, yH)}"/>`;
      if (showT && vals(pT).length) g += `<path class="lt prev${A}" d="${line(pT, yT)}"/>`;
      if (showH && vals(pH).length) g += `<path class="lh prev${A}" d="${line(pH, yH)}"/>`;
      if (showT) g += `<path class="lt${A}" d="${line(sT, yT)}"/>`;
      if (showH) g += `<path class="lh${A}" d="${line(sH, yH)}"/>`;
      g += `<line id="cur" y1="${Tp}" y2="${Tp + ih}" stroke="var(--secondary-text-color,#888)" opacity="0"/>`;
      chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(card._t('history'))}">${g}<rect x="${L}" y="${Tp}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;

      // survol / toucher : infobulle date + valeurs
      const svg = chart.querySelector('svg'), tip = chart.querySelector('.tip'), cur = chart.querySelector('#cur');
      const fmtD = new Intl.DateTimeFormat(lang, days === 1 ? { hour: '2-digit', minute: '2-digit' } : days === 7 ? { weekday: 'short', hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      const move = (e) => {
        const b = svg.getBoundingClientRect(), px = ((e.touches ? e.touches[0].clientX : e.clientX) - b.left) / b.width * W;
        const k = Math.max(0, Math.min(n - 1, Math.floor(((px - L) / iw) * n)));
        const pt = sT[k], ph = sH[k], po = mode === 'humidity' ? sOH[k] : sO[k];
        if (!(showT && pt) && !(showH && ph)) { tip.style.opacity = 0; return; }
        cur.setAttribute('x1', x(k)); cur.setAttribute('x2', x(k)); cur.setAttribute('opacity', '.5');
        const yy = showT && pt ? yT(pt.v) : yH(ph.v);
        tip.style.left = `${(x(k) / W) * 100}%`; tip.style.top = `${(yy / H) * b.height}px`; tip.style.opacity = 1;
        const parts = [];
        if (showT && pt) parts.push(`<b>${fT(pt.v)}</b>`);
        if (showH && ph) parts.push(`<b>${fH(ph.v)}</b>`);
        if (showT && pT[k]) parts.push(`${esc(prevLbl)} ${fT(pT[k].v)}`);
        else if (showH && pH[k]) parts.push(`${esc(prevLbl)} ${fH(pH[k].v)}`);
        if (!(showT && showH) && po) parts.push(`${esc(card._l('outdoor'))} ${showT ? fT(po.v) : fH(po.v)}`);
        tip.innerHTML = `${esc(fmtD.format((pt || ph).t))} · ${parts.join(' · ')}`;
      };
      const leave = () => { tip.style.opacity = 0; cur.setAttribute('opacity', '0'); };
      svg.addEventListener('mousemove', move); svg.addEventListener('touchmove', move, { passive: true });
      svg.addEventListener('touchstart', move, { passive: true }); svg.addEventListener('mouseleave', leave);

      // légende
      const lg = [];
      if (showT) lg.push(`<span><i style="background:var(--rc-heat)"></i>${esc(card._l('temperature'))}</span>`);
      if (showH) lg.push(`<span><i style="background:var(--rc-hum)"></i>${esc(card._l('humidity'))}</span>`);
      if (vals(pT).length || vals(pH).length) lg.push(`<span><i style="background:repeating-linear-gradient(90deg,${showT ? 'var(--rc-heat)' : 'var(--rc-hum)'} 0 5px,transparent 5px 8px);opacity:.6"></i>${esc(prevLbl)}</span>`);
      if (!(showT && showH) && vals(mode === 'humidity' ? sOH : sO).length) lg.push(`<span><i style="background:repeating-linear-gradient(90deg,var(--secondary-text-color,#888) 0 4px,transparent 4px 7px)"></i>${esc(card._l('outdoor'))}</span>`);
      if (!(showT && showH)) lg.push(`<span><i style="background:var(--rc-ok);opacity:.35;height:8px"></i>${esc(card._l('ideal_zone'))} ${showT ? `${card._fmt(ct0, 0)}–${card._fmt(ct1, 0)}°` : `${ch0}–${ch1} %`}</span>`);
      r.getElementById('lg').innerHTML = lg.join('');

      // récapitulatif par jour (7 jours)
      let dh = '';
      if (days === 7) {
        const by = new Map();
        sT.forEach((p, i) => { const q = p || sH[i]; if (!q) return; const k = dayStart(q.t); if (!by.has(k)) by.set(k, { t: [], h: [] }); if (p) by.get(k).t.push(p); if (sH[i]) by.get(k).h.push(sH[i]); });
        sH.forEach((p) => { if (!p) return; const k = dayStart(p.t); if (!by.has(k)) by.set(k, { t: [], h: [] }); if (!c.entity_temperature) by.get(k).h.push(p); });
        dh = [...by.entries()].slice(-7).map(([k, v]) => {
          const tt = v.t.length ? `<b>${card._fmt(Math.max(...v.t.map((p) => p.mx)), 0)}° / ${card._fmt(Math.min(...v.t.map((p) => p.mn)), 0)}°</b>` : '';
          const hh = v.h.length ? `${Math.round(Math.min(...v.h.map((p) => p.mn)))}–${Math.round(Math.max(...v.h.map((p) => p.mx)))} %` : '';
          return `<div class="day">${esc(new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(k))}${showT ? tt : ''}${showH ? (showT ? `<span>${hh}</span>` : `<b>${hh}</b>`) : ''}</div>`;
        }).join('');
      }
      r.getElementById('days').innerHTML = dh;
    }
  }
  customElements.define(TAG.replace('-card', '-dialog'), ApplianceRoomClimateDialog);

  /* ---- éditeur visuel ---- */
  class ApplianceRoomClimateCardEditor extends HTMLElement {
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
      const tmp = window.applianceTemp(this._hass, this._c), u = tmp.unit;
      const ent = (name, domain, dc) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(dc ? { device_class: dc } : {}) } } });
      const num = (name, min, max, step, unit, def) => ({ name, ...(def != null ? { default: def } : {}), selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const tr = (name, minC, maxC, def) => { const g = tmp.range(minC, maxC); return num(name, g.min, g.max, 0.5, u, def); };
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const sel = (name, opts) => ({ name, selector: { select: { mode: 'dropdown', options: opts.map(([value, k]) => ({ value, label: (T[this._lang()] || T.en)[k] || T.en[k] })) } } });
      this._form.hass = this._hass;
      const d = { ...this._c };
      if (!d.variant && typeof d.style === 'string' && STYLES.includes(d.style)) { d.variant = d.style; delete d.style; }
      this._form.data = d;
      const color = (name) => ({ name, selector: { color_rgb: {} } });
      this._form.schema = [
        { type: 'grid', name: '', schema: [sel('variant', STYLES.map((v) => [v, `st_${v}`])), { name: 'icon', selector: { icon: {} } }] },
        { name: 'name', selector: { text: {} } },
        ent('entity_temperature', 'sensor', 'temperature'), ent('entity_humidity', 'sensor', 'humidity'),
        ent('entity_outdoor_temperature', 'sensor', 'temperature'), ent('entity_outdoor_humidity', 'sensor', 'humidity'),
        ent('entity_window', 'binary_sensor'), ent('entity_battery', ['sensor', 'binary_sensor']), ent('entity_climate', 'climate'),
        { type: 'grid', name: '', schema: [tr('comfort_temp_min', 5, 30, Math.round(tmp.c(19))), tr('comfort_temp_max', 10, 40, Math.round(tmp.c(25))),
          num('humidity_min', 0, 100, 1, '%', 35), num('humidity_max', 0, 100, 1, '%', 65)] },
        { type: 'grid', name: '', schema: [tr('alert_temp_min', -20, 30), tr('alert_temp_max', 10, 50), num('alert_humidity_min', 0, 100, 1, '%'), num('alert_humidity_max', 0, 100, 1, '%')] },
        { type: 'grid', name: '', schema: [num('mold_humidity', 40, 100, 1, '%', 70), num('window_drop', 0, 10, 0.1, u), num('battery_low', 0, 100, 1, '%', 20)] },
        { type: 'grid', name: '', schema: [sel('history_days', [['1', 'h24'], ['7', 'd7'], ['30', 'd30']]), sel('history_mode', [['both', 'both'], ['temperature', 'temperature'], ['humidity', 'humidity']])] },
        { type: 'grid', name: '', schema: [sel('tap_action', [['history', 'tap_history'], ['more-info', 'tap_more_info'], ['navigate', 'tap_navigate'], ['none', 'tap_none']]),
          ...(this._c && this._c.tap_action === 'navigate' ? [{ name: 'navigation_path', selector: { text: {} } }] : [])] },
        ...((this._c && (this._c.variant || this._c.style)) === 'lcd' ? [sel('lcd_color', [['auto', 'lcd_auto'], ['green', 'lcd_green'], ['blue', 'lcd_blue'], ['amber', 'lcd_amber']])] : []),
        { type: 'grid', name: '', schema: [color('color_comfort'), color('color_cool'), color('color_warm'), color('color_humidity'), color('color_dry'), color('color_alert')] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'labels', selector: { object: {} } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_outdoor'), bool('show_dew_point'), bool('show_advice'), bool('show_graph'), bool('show_trend'), bool('animations'), { name: 'transparent', selector: { boolean: {} } }] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
    _lang() { const h = this._hass; let l = ((this._c && this._c.language) || (h && (h.locale?.language || h.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
  }
  customElements.define(TAG + '-editor', ApplianceRoomClimateCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: 'Température et humidité d\'une pièce, animées : confort, alertes, point de rosée, conseil d\'aération, fenêtre ouverte, batterie, historique 24 h / 7 j / 30 j.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
