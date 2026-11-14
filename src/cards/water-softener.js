/* Carte « Adoucisseur d'eau » — custom:appliance-water-softener-card
 * Deux dessins au choix (option model) : culligan (défaut) = cuve à résine avec tête de commande (écran LCD, boutons) et bac à sel ;
 * generic = bouteille composite (tube central, crépines), vanne en tête, bac à sel séparé avec canne à saumure et flotteur.
 * custom:appliance-water-softener-generic-card reste reconnue (alias de model: generic) pour les tableaux de bord existants.
 * En service sans débit (entity_flow à 0), plus aucune animation.
 * Phases : service (eau adoucie), contre-lavage, aspiration de saumure, rinçage, renvoi d'eau (remplissage du bac à sel) ; alerte sel bas.
 * Tuiles : débit, capacité restante, sel, dureté (entrée → sortie), consommation du jour, prochaine régénération, puissance.
 */
(() => {
  const TAG = 'appliance-water-softener-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n softener*/{};

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--ws-ok:var(--appliance-ok-color,#43a047);--ws-warn:var(--appliance-warn-color,#ffa000);
  --ws-alert:var(--appliance-alert-color,#db4437);--ws-cold:var(--appliance-cold-color,#2b9af9);--spd:1.2s;--salt:.65;--lvl:.2}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.head.below{flex-direction:column;align-items:flex-start;gap:3px}
.leak{display:none;align-items:center;gap:6px;font-size:11px;font-weight:600;margin-top:3px;padding:2px 8px;border-radius:12px;width:fit-content;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--secondary-background-color);color:var(--secondary-text-color);cursor:pointer}
.leak.on{display:inline-flex}.leak.ok{background:color-mix(in srgb,var(--ws-ok) 22%,transparent);color:var(--ws-ok)}.leak.bad{background:color-mix(in srgb,var(--ws-alert) 22%,transparent);color:var(--ws-alert)}
.prog{display:none;margin:6px 0 2px}.prog.on{display:block}
.prog .bar{display:flex;gap:3px;height:8px}.prog .seg{position:relative;overflow:hidden;border-radius:4px;background:var(--secondary-background-color);min-width:6px}
.prog .seg i{position:absolute;inset:0 auto 0 0;width:0;background:var(--ws-warn);border-radius:4px;transition:width .9s linear}
.prog .seg.cur i{background:var(--ws-cold)}
.prog .txt{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--secondary-text-color);margin-top:3px}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.service .badge{background:color-mix(in srgb,var(--ws-cold) 22%,transparent);color:var(--ws-cold)}
.backwash .badge,.brine .badge,.rinse .badge,.refill .badge{background:color-mix(in srgb,var(--ws-warn) 24%,transparent);color:var(--ws-warn)}
.lowsalt .badge{background:color-mix(in srgb,var(--ws-alert) 22%,transparent);color:var(--ws-alert)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--ws-alert)}
/* ---- illustration ---- */
.pipe{fill:none;stroke-linecap:round}
.pbase{stroke:#8793a3;stroke-width:5.4}
.pflow{stroke-width:2.4;stroke-dasharray:1 7;opacity:0}
.pin .pflow{stroke:#6f8cff}.pout .pflow{stroke:#4fd8ff}.pdr .pflow{stroke:#b59a7a}.pbr .pflow{stroke:#ffc04d}
.service .pin .pflow,.service .pout .pflow{opacity:1;animation:wsd var(--spd) linear infinite}
.backwash .pin .pflow,.backwash .pdr .pflow{opacity:1;animation:wsd var(--spd) linear infinite}
.rinse .pin .pflow,.rinse .pdr .pflow{opacity:1;animation:wsd calc(var(--spd) * .6) linear infinite}
.brine .pbr .pflow,.brine .pdr .pflow{opacity:1;animation:wsd calc(var(--spd) * 1.4) linear infinite}
.refill .pin .pflow,.refill .pbr .pflow{opacity:1;animation:wsd var(--spd) linear infinite}.refill .pbr .pflow{stroke:#6f8cff;animation-direction:reverse}
.pbr .pflow{animation-direction:normal}
@keyframes wsd{to{stroke-dashoffset:-16}}
.drop{fill:#7fdcff;opacity:0}
.service .drop,.rinse .drop{opacity:.9;animation:wsfall calc(var(--spd) * 1.6) linear infinite}
.backwash .drop{opacity:.9;fill:#c8aa82;animation:wsrise calc(var(--spd) * 1.6) linear infinite}
.brine .drop{opacity:.9;fill:#ffd27a;animation:wsfall calc(var(--spd) * 2.6) linear infinite}
.drop:nth-child(2){animation-delay:-.35s!important}.drop:nth-child(3){animation-delay:-.7s!important}.drop:nth-child(4){animation-delay:-1.05s!important}.drop:nth-child(5){animation-delay:-1.4s!important}
@keyframes wsfall{0%{transform:translateY(0);opacity:0}15%{opacity:.95}85%{opacity:.95}100%{transform:translateY(110px);opacity:0}}
@keyframes wsrise{0%{transform:translateY(110px);opacity:0}15%{opacity:.95}85%{opacity:.95}100%{transform:translateY(0);opacity:0}}
.beads{transform-box:fill-box;transform-origin:50% 100%}
.backwash .beads{animation:wsjig .5s ease-in-out infinite alternate}
@keyframes wsjig{from{transform:translateY(-6px) scaleY(1.04)}to{transform:translateY(0) scaleY(.98)}}
.bed{fill:#ffb300;opacity:0;transition:opacity .6s}
.brine .bed{opacity:.5;animation:wspulse 1.2s ease-in-out infinite alternate}
@keyframes wspulse{from{opacity:.22}to{opacity:.55}}
.muddy{fill:#b08a5a;opacity:0;transition:opacity .6s}.backwash .muddy{opacity:.32}
.brinew{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--lvl));transition:transform 1.4s ease}
.brine .brinew{animation:wsbrine 5s ease-in-out infinite alternate}
.refill .brinew{animation:wsrefill 5s ease-in-out infinite alternate}
@keyframes wsrefill{from{transform:scaleY(.12)}to{transform:scaleY(.3)}}
@keyframes wsbrine{from{transform:scaleY(.3)}to{transform:scaleY(.12)}}
.salt{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--salt));transition:transform 1.2s ease}
.alertw{opacity:0}.lowsalt .alertw{opacity:1;animation:wsblink 1s ease-in-out infinite}
.lowsalt .lid{animation:wsblink 1.6s ease-in-out infinite}
@keyframes wsblink{50%{opacity:.35}}
.lcdt{font:700 6.6px/1 ui-monospace,Consolas,monospace;fill:#2c3a10;text-anchor:middle;letter-spacing:.2px}
.led{fill:#43d17a}.backwash .led,.brine .led,.rinse .led,.refill .led{fill:#ffa000;animation:wsblink .8s steps(2) infinite}.lowsalt .led{fill:#e53935}
.off svg,.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
/* service sans débit : tout est figé */
.still *{animation:none!important}.still .pflow,.still .drop{opacity:0!important}
/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante, tuiles en colonne ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  // Ébauche vectorielle : tête de commande (écran + panneau bleu), cuve à résine en écorché (lit de résine, tube central),
  // bac à sel en écorché (sel, saumure). Repères : 250 × 290.
  const SVG_CULLIGAN = (label) => `<svg viewBox="0 0 250 290" role="img" aria-label="${label}"><defs>
    <linearGradient id="wsc" x1="0" x2="1"><stop offset="0" stop-color="#f6f0df"/><stop offset=".55" stop-color="#e8dfc7"/><stop offset="1" stop-color="#cfc4a6"/></linearGradient>
    <linearGradient id="wsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf8ef"/><stop offset="1" stop-color="#e2d9c0"/></linearGradient>
    <linearGradient id="wsb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b57c9"/><stop offset="1" stop-color="#1f3499"/></linearGradient>
    <linearGradient id="wsw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeaf8"/><stop offset="1" stop-color="#8fcdef"/></linearGradient>
    <radialGradient id="wssh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <pattern id="wsr" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#c98f2a"/><circle cx="1.4" cy="1.4" r="1.2" fill="#e7b04a"/><circle cx="3.9" cy="3.6" r="1.3" fill="#e0a43a"/><circle cx="3.8" cy="1" r=".7" fill="#a8731a"/></pattern>
    <pattern id="wss" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#d3dade"/><circle cx="1.6" cy="1.6" r="1.5" fill="#fff" stroke="#9aa6ae" stroke-width=".5"/><circle cx="4.4" cy="4.2" r="1.6" fill="#fff" stroke="#9aa6ae" stroke-width=".5"/></pattern>
    <clipPath id="wsrw"><rect x="49" y="106" width="52" height="152" rx="5"/></clipPath>
    <clipPath id="wsbw"><rect x="139" y="168" width="82" height="92" rx="5"/></clipPath></defs>
    <ellipse cx="125" cy="274" rx="112" ry="7" fill="url(#wssh)"/>
    <!-- tuyaux : arrivée (eau dure), départ (eau adoucie), saumure, évacuation -->
    <g class="pipe pin"><path class="pbase" d="M6 46 H27"/><path class="pflow" d="M6 46 H27"/></g>
    <g class="pipe pout"><path class="pbase" d="M113 46 H244"/><path class="pflow" d="M113 46 H244"/></g>
    <g class="pipe pbr"><path class="pbase" d="M186 150 C186 112 150 104 113 60" style="stroke-width:3.4"/><path class="pflow" d="M186 150 C186 112 150 104 113 60"/></g>
    <g class="pipe pdr"><path class="pbase" d="M27 62 C10 62 8 130 8 262" style="stroke:#a9a39a"/><path class="pflow" d="M27 62 C10 62 8 130 8 262"/></g>
    <!-- cuve à résine -->
    <rect x="38" y="68" width="74" height="204" rx="34" fill="url(#wsc)" stroke="#b9b095" stroke-width="1.2"/>
    <rect x="46" y="102" width="58" height="160" rx="8" fill="#fbf8ef" stroke="#c8bfa4" stroke-width=".8"/>
    <g clip-path="url(#wsrw)"><rect x="49" y="106" width="52" height="152" fill="url(#wsw)"/><rect class="muddy" x="49" y="106" width="52" height="152"/>
      <g class="beads"><rect x="49" y="158" width="52" height="86" fill="url(#wsr)"/></g><rect class="bed" x="49" y="158" width="52" height="86"/>
      <rect x="49" y="244" width="52" height="14" fill="#9aa1a8"/><rect x="72.4" y="104" width="5.2" height="150" rx="2.6" fill="#f5f5f2" stroke="#bfc3c6" stroke-width=".6"/>
      <g>${[0, 1, 2, 3, 4].map((i) => `<circle class="drop" cx="${58 + i * 9}" cy="112" r="1.9"/>`).join('')}</g></g>
    <!-- tête de commande -->
    <rect x="22" y="12" width="96" height="56" rx="7" fill="url(#wsh)" stroke="#b9b095" stroke-width="1"/>
    <rect x="29" y="20" width="42" height="15" rx="2" fill="#a9c957" stroke="#6f8a2c" stroke-width=".7"/><text class="lcdt" id="wslcd" x="50" y="30.5">SERVICE</text>
    <rect x="78" y="18" width="34" height="42" rx="3.5" fill="url(#wsb)"/><text x="95" y="26" text-anchor="middle" font-size="5.2" font-style="italic" font-weight="700" fill="#fff" font-family="Georgia,serif">Culligan</text>
    <circle cx="95" cy="43" r="9.5" fill="#1b2c82"/><path d="M95 35l-3 4h6zM95 51l-3-4h6z" fill="#cfd8ff"/><circle cx="95" cy="43" r="2.2" fill="#cfd8ff"/>
    <circle class="led" cx="36" cy="55" r="2.1"/><rect x="43" y="52.5" width="22" height="5" rx="2.5" fill="#d6cdb4"/>
    <!-- bac à sel -->
    <rect x="128" y="150" width="104" height="122" rx="12" fill="url(#wsc)" stroke="#b9b095" stroke-width="1.2"/>
    <rect x="134" y="164" width="92" height="100" rx="8" fill="#fbf8ef" stroke="#c8bfa4" stroke-width=".8"/>
    <g clip-path="url(#wsbw)"><rect x="139" y="168" width="82" height="92" fill="#f2f5f6"/>
      <rect class="brinew" x="139" y="168" width="82" height="92" fill="#9ed8f2" opacity=".7"/><rect class="salt" x="139" y="168" width="82" height="92" fill="url(#wss)" opacity=".92"/>
      <rect x="139" y="252" width="82" height="8" fill="#b9c4cb"/></g>
    <rect class="lid" x="124" y="142" width="112" height="14" rx="7" fill="url(#wsh)" stroke="#b9b095" stroke-width="1"/><rect x="170" y="145" width="20" height="5" rx="2.5" fill="#cfc5a8"/>
    <g class="alertw"><circle cx="218" cy="128" r="11" fill="#e53935"/><path d="M218 121v8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="218" cy="134" r="1.5" fill="#fff"/></g>
  </svg>`;

  // Dessin générique (d'après le schéma type « bouteille + bac ») : vanne à deux fenêtres sur la bouteille,
  // bouteille composite translucide (intérieur PE) remplie de résine, tube central, crépines haute et basse (fentes 0,2 mm),
  // pied évasé ; bac à sel avec couvercle, canne à saumure + flotteur, coude trop-plein, sel au-dessus de la saumure. Repères : 250 × 290.
  const SVG_GENERIC = (label) => `<svg viewBox="0 0 250 290" role="img" aria-label="${label}"><defs>
    <linearGradient id="wsc" x1="0" x2="1"><stop offset="0" stop-color="#cfe6f4" stop-opacity=".9"/><stop offset=".35" stop-color="#eef7fc" stop-opacity=".95"/><stop offset="1" stop-color="#a9cbe2" stop-opacity=".9"/></linearGradient>
    <linearGradient id="wsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f4f6"/><stop offset="1" stop-color="#c3c8ce"/></linearGradient>
    <linearGradient id="wsv" x1="0" x2="1"><stop offset="0" stop-color="#b9bfc6"/><stop offset=".45" stop-color="#e9ecef"/><stop offset="1" stop-color="#9aa2ab"/></linearGradient>
    <linearGradient id="wsw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3f3fb"/><stop offset="1" stop-color="#b8e0f4"/></linearGradient>
    <linearGradient id="wsg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="wssh"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <pattern id="wsr" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#e9dcc0"/><circle cx="1" cy="1.1" r=".9" fill="#c9b38a"/><circle cx="3" cy="2.9" r="1" fill="#d8c49c"/><circle cx="3.1" cy=".8" r=".45" fill="#a88f63"/><circle cx="1.1" cy="3.2" r=".4" fill="#fff"/></pattern>
    <pattern id="wss" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#e4e8eb"/><circle cx="1.3" cy="1.4" r="1.2" fill="#fff" stroke="#aab4bb" stroke-width=".4"/><circle cx="3.8" cy="3.6" r="1.3" fill="#fff" stroke="#aab4bb" stroke-width=".4"/><circle cx="3.9" cy="1" r=".5" fill="#c9d1d6"/></pattern>
    <clipPath id="wsrw"><rect x="43.5" y="63.5" width="43" height="196" rx="21"/></clipPath>
    <clipPath id="wsbw"><rect x="145" y="159" width="88" height="110" rx="2"/></clipPath></defs>
    <ellipse cx="128" cy="279" rx="116" ry="6" fill="url(#wssh)"/>
    <!-- tuyaux : arrivée (eau dure), départ (eau adoucie), saumure (canne → vanne), évacuation à l'égout -->
    <g class="pipe pin"><path class="pbase" d="M4 30 H32"/><path class="pflow" d="M4 30 H32"/></g>
    <g class="pipe pout"><path class="pbase" d="M98 30 H246"/><path class="pflow" d="M98 30 H246"/></g>
    <g class="pipe pbr"><path class="pbase" d="M156 172 H140 V50 Q140 44 134 44 H98" style="stroke-width:3"/><path class="pflow" d="M156 172 H140 V50 Q140 44 134 44 H98"/></g>
    <g class="pipe pdr"><path class="pbase" d="M32 42 C14 42 12 120 12 272" style="stroke:#a9a39a;stroke-width:4"/><path class="pflow" d="M32 42 C14 42 12 120 12 272"/></g>
    <!-- pied évasé -->
    <path d="M42 258 H88 L96 276 H34 Z" fill="#9aa3ab" stroke="#7d868f" stroke-width=".8"/><rect x="32" y="274" width="66" height="4" rx="1.5" fill="#7d868f"/>
    <!-- bouteille : coque composite translucide, intérieur PE -->
    <rect x="40" y="60" width="50" height="203" rx="25" fill="url(#wsc)" stroke="#8fb4cf" stroke-width="1.1"/>
    <g clip-path="url(#wsrw)"><rect x="43" y="60" width="44" height="200" fill="url(#wsw)"/><rect class="muddy" x="43" y="60" width="44" height="200"/>
      <g class="beads"><rect x="43" y="96" width="44" height="166" fill="url(#wsr)"/></g><rect class="bed" x="43" y="96" width="44" height="166"/>
      <g>${[48, 55, 75, 82, 59].map((x) => `<circle class="drop" cx="${x}" cy="72" r="1.8"/>`).join('')}</g></g>
    <rect x="43.5" y="63.5" width="43" height="196" rx="21" fill="none" stroke="#ffffff" stroke-opacity=".8" stroke-width=".8"/>
    <rect x="46" y="70" width="7" height="180" rx="3.5" fill="url(#wsg)"/>
    <!-- tube central + crépine basse (cône à fentes) -->
    <rect x="63" y="50" width="4" height="190" rx="2" fill="#f7f7f4" stroke="#b5bbbf" stroke-width=".5"/>
    <path d="M57.5 238 H72.5 V246 L68 255 H62 L57.5 246 Z" fill="#6c747b" stroke="#4d545a" stroke-width=".6"/>
    <path d="M59 241 H71 M59 244 H71 M60 247 H70 M61.5 250 H68.5" stroke="#b9c0c6" stroke-width=".6"/>
    <!-- col + crépine haute -->
    <rect x="55" y="48" width="20" height="14" rx="2" fill="url(#wsv)" stroke="#7d868f" stroke-width=".6"/>
    <rect x="59" y="62" width="12" height="9" rx="1.5" fill="#cfc2a3" stroke="#8d7f5f" stroke-width=".5"/><path d="M60.5 64.5h9M60.5 67h9M60.5 69.5h9" stroke="#8d7f5f" stroke-width=".4"/>
    <!-- vanne : deux fenêtres (écran + programmateur) -->
    <rect x="32" y="10" width="66" height="40" rx="4" fill="url(#wsh)" stroke="#7d868f" stroke-width="1"/>
    <rect x="32" y="10" width="66" height="5" rx="2.5" fill="#fff" opacity=".45"/>
    <rect x="35.5" y="15" width="34" height="22" rx="2" fill="#5a636c" stroke="#3f464c" stroke-width=".6"/>
    <rect x="37.5" y="19" width="30" height="12" rx="1" fill="#a9c957"/><text class="lcdt" id="wslcd" x="52.5" y="27.5">SERVICE</text>
    <rect x="72.5" y="15" width="22" height="22" rx="2" fill="#5a636c" stroke="#3f464c" stroke-width=".6"/>
    <rect x="74.5" y="17" width="18" height="18" rx="1.5" fill="#cfd5db"/><circle cx="83.5" cy="26" r="5" fill="#eef1f3" stroke="#8e979f" stroke-width=".6"/><path d="M83.5 22.5v3.5l2.4 1.6" stroke="#5a636c" stroke-width=".8" fill="none" stroke-linecap="round"/>
    <circle class="led" cx="39" cy="43.5" r="2"/><rect x="45" y="41.5" width="16" height="4" rx="2" fill="#aab1b8"/><rect x="74" y="41" width="20" height="5" rx="2.5" fill="#aab1b8"/>
    <!-- bac à sel : paroi translucide -->
    <rect x="142" y="156" width="94" height="116" rx="3" fill="url(#wsc)" stroke="#8fb4cf" stroke-width="1.1"/>
    <g clip-path="url(#wsbw)"><rect x="145" y="159" width="88" height="110" fill="#f4f8fa" opacity=".7"/>
      <rect class="salt" x="145" y="159" width="88" height="110" fill="url(#wss)"/>
      <rect class="brinew" x="145" y="159" width="88" height="110" fill="#6fc2ea" opacity=".45"/></g>
    <rect x="146" y="162" width="5" height="104" rx="2.5" fill="url(#wsg)"/>
    <!-- coude trop-plein -->
    <path d="M142 186 H134 V196" fill="none" stroke="#9aa6ae" stroke-width="3.4" stroke-linecap="round"/>
    <!-- canne à saumure (puits) + tuyau intérieur + flotteur -->
    <rect x="152" y="166" width="10" height="102" rx="2" fill="#f2f6f8" fill-opacity=".85" stroke="#8e9aa3" stroke-width=".8"/>
    <path d="M157 172 V256" stroke="#7d868f" stroke-width="1.6"/>
    <path d="M157 200 V214" stroke="#5a636c" stroke-width="1"/><rect x="154" y="214" width="6" height="9" rx="1.5" fill="#ffb300" stroke="#a87400" stroke-width=".6"/>
    <rect x="152" y="260" width="10" height="8" fill="#8e9aa3" opacity=".5"/>
    <!-- couvercle -->
    <rect class="lid" x="138" y="150" width="102" height="7" rx="2" fill="url(#wsh)" stroke="#7d868f" stroke-width=".9"/>
    <g class="alertw"><circle cx="224" cy="134" r="10" fill="#e53935"/><path d="M224 127.5v7.5" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/><circle cx="224" cy="139.5" r="1.4" fill="#fff"/></g>
  </svg>`;

  const TILES = [['flow', 'mdi:water-pump', 'show_flow'], ['capacity', 'mdi:gauge', 'show_capacity'], ['salt', 'mdi:shaker-outline', 'show_salt'],
    ['hardness', 'mdi:water-opacity', 'show_hardness'], ['today', 'mdi:calendar-today', 'show_today'], ['regen', 'mdi:calendar-refresh', 'show_regen'],
    ['last_regen', 'mdi:calendar-check', 'show_last_regen'], ['cycle_volume', 'mdi:water-sync', 'show_cycle_volume'], ['salt_year', 'mdi:shaker-outline', 'show_salt_year'], ['power', 'mdi:flash', 'show_power']];
  const RE = {
    backwash: /backwash|back.?wash|contre.?lavage|d[ée]tassage|gegenstrom/i,
    brine: /brine|saumure|aspir|draw|slow|regener|r[ée]g[ée]n[ée]ration|recharge|regen/i,
    rinse: /rins|rin[cç]|fast|spül|spuel/i,
    refill: /refill|remplissage|renvoi|water.?return|return/i,
  };

  class ApplianceWaterSoftenerCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /(adoucisseur|softener|culligan)/i.test(i) && /^(sensor|binary_sensor|switch|input_boolean)\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_flow: true, show_capacity: true, show_salt: true, show_hardness: true, show_today: true, show_regen: true, show_last_regen: true, show_cycle_volume: true, show_salt_year: true, show_power: true, salt_low: 20, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _on(id) { const s = this._st(id); return !!s && /^(on|true|active|running|open)$/i.test(String(s.state)); }
    // timer HA (timer.xxx) : durée totale, temps restant et état, calculés à partir de ses attributs (duration, finishes_at, remaining)
    _tsec(v) { if (v == null || v === '') return NaN; if (typeof v === 'number') return v; const p = String(v).split(':').map(Number); return p.some(isNaN) ? NaN : p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : p[0]; }
    _timer(id) {
      const s = this._st(id); if (!s) return null;
      const a = s.attributes || {}, dur = this._tsec(a.duration), st = String(s.state).toLowerCase();
      let rem = dur;
      if (st === 'active') { const t = Date.parse(a.finishes_at); rem = isNaN(t) ? dur : Math.max(0, (t - Date.now()) / 1000); }
      else if (st === 'paused') { const r = this._tsec(a.remaining); rem = isNaN(r) ? dur : r; }
      return { dur, rem, running: st === 'active' || st === 'paused' };
    }
    _hms(sec) { const n = Math.max(0, Math.round(sec)), h = Math.floor(n / 3600), m = Math.floor(n % 3600 / 60), s = n % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`; }
    // barre de progression de la régénération : un segment par phase (largeur = durée de son timer), visible seulement pendant le cycle
    _progress(phase) {
      const c = this._c, r = this._root, box = r.getElementById('wsprog');
      const ORDER = ['backwash', 'brine', 'rinse', 'refill'], KEY = { backwash: 'entity_backwash_timer', brine: 'entity_brine_timer', rinse: 'entity_rinse_timer', refill: 'entity_refill_timer' };
      const cur = ORDER.indexOf(phase), phases = ORDER.filter((p) => c[KEY[p]]), total = c.entity_timer && this._timer(c.entity_timer);
      const show = c.show_progress !== false && cur >= 0 && (phases.length || (total && total.running));
      box.classList.toggle('on', !!show);
      clearInterval(this._tick); this._tick = null;
      if (!show) return;
      const bar = r.getElementById('wsbar');
      const segs = phases.length ? phases : ['total'];
      if (bar.children.length !== segs.length || bar.dataset.k !== segs.join()) {
        bar.dataset.k = segs.join();
        bar.innerHTML = segs.map((p) => `<div class="seg" data-p="${p}" title="${p === 'total' ? '' : this._t(p)}"><i></i></div>`).join('');
      }
      const paint = () => {
        const pt = phases.length ? null : total;
        segs.forEach((p, i) => {
          const el = bar.children[i], t = p === 'total' ? pt : this._timer(c[KEY[p]]);
          const dur = t && t.dur > 0 ? t.dur : 1;
          el.style.flex = `${p === 'total' ? 1 : dur} 1 0`;
          let f = 0;
          if (p === 'total') f = t && t.dur > 0 ? 1 - t.rem / t.dur : 0;
          else if (ORDER.indexOf(p) < cur) f = 1;
          else if (p === phase) f = t && t.running && t.dur > 0 ? 1 - t.rem / t.dur : 0;
          el.firstChild.style.width = `${Math.max(0, Math.min(1, f)) * 100}%`;
          el.classList.toggle('cur', p === phase);
        });
        const tt = c.entity_timer && this._timer(c.entity_timer);
        r.getElementById('wsptxt').textContent = this._t(phase);
        r.getElementById('wsprem').textContent = tt && tt.running ? `${this._t('remaining')} ${this._hms(tt.rem)}` : '';
      };
      paint();
      // HA n'envoie pas d'état chaque seconde : on fait avancer la barre localement tant que le cycle tourne
      this._tick = setInterval(paint, 1000);
    }
    disconnectedCallback() { clearInterval(this._tick); this._tick = null; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head${this._c.status_position === 'below' ? ' below' : ''}"><div class="title" id="wstitle"></div><div class="badge" id="wsbadge"></div></div>
        <div class="leak" id="wsleak"></div>
        <div class="prog" id="wsprog"><div class="bar" id="wsbar"></div><div class="txt"><span id="wsptxt"></span><span id="wsprem"></span></div></div>
        <div class="body">${(this._c.model === 'generic' ? SVG_GENERIC : SVG_CULLIGAN)((this._c.name || this._t('name')).replace(/"/g, ''))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_flow));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow, capacity: c.entity_capacity, salt: c.entity_salt, hardness: c.entity_hardness_out || c.entity_hardness_in, today: c.entity_today, regen: c.entity_regen_days, last_regen: c.entity_last_regen, cycle_volume: c.entity_cycle_volume, salt_year: c.entity_salt_year, power: c.entity_power }[el.dataset.k]);
      }));
      root.getElementById('wsleak').addEventListener('click', () => this._more(this._c.entity_leak));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, e = this._st(c.entity);
      const flow = this._num(c.entity_flow), salt = this._num(c.entity_salt);
      const raw = e ? String(e.state) : '';
      const known = [c.entity, c.entity_flow, c.entity_capacity, c.entity_salt, c.entity_backwash, c.entity_brine, c.entity_rinse, c.entity_refill, c.entity_service].some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      let phase = 'idle';
      if (!known) phase = 'unavailable';
      else if (e && /^(off)$/i.test(raw)) phase = 'off';
      else if (RE.backwash.test(raw)) phase = 'backwash';
      else if (RE.refill.test(raw)) phase = 'refill';
      else if (RE.rinse.test(raw)) phase = 'rinse';
      else if (RE.brine.test(raw) || (e && /^on$/i.test(raw) && /regen/i.test(String(e.entity_id) + JSON.stringify(e.attributes || {})))) phase = 'brine';
      // une entité par phase (interrupteur / binary_sensor), prises en compte si `entity` ne donne pas déjà la phase
      else if (this._on(c.entity_backwash)) phase = 'backwash';
      else if (this._on(c.entity_brine)) phase = 'brine';
      else if (this._on(c.entity_rinse)) phase = 'rinse';
      else if (this._on(c.entity_refill)) phase = 'refill';
      // « service » : entité dédiée, texte « service », ou `entity` allumée dont le nom contient « service » (ex. « Cycle Service »)
      else if (this._on(c.entity_service) || /^(service|en.?service)$/i.test(raw.trim()) || (e && /^on$/i.test(raw) && /service/i.test(String(e.entity_id) + ' ' + ((e.attributes && e.attributes.friendly_name) || ''))) || (!isNaN(flow) && flow > 0.05)) phase = 'service';
      // sel en kg / lb / g : avec la capacité maxi du bac (entity_salt_max, ex. un input_number, ou salt_max), la hauteur de sel dans le bac
      // est salt / max ; sans maxi, ou si l'entité est déjà en %, la valeur est un pourcentage (comportement historique)
      const mx = !isNaN(this._num(c.entity_salt_max)) ? this._num(c.entity_salt_max) : Number(c.salt_max);
      const pct = !isNaN(salt) && mx > 0 && this._unit(c.entity_salt, '%') !== '%' ? salt / mx * 100 : salt;
      const low = !isNaN(pct) && pct <= Number(c.salt_low);
      const still = phase === 'service' && !isNaN(flow) && flow <= 0.05;
      return { phase, flow, salt, pct, low, still };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { phase, flow, salt, pct, low, still } = this._compute();
      card.className = `${phase}${still ? ' still' : ''}${low ? ' lowsalt' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--spd', `${(isNaN(flow) ? 1.2 : Math.max(.5, Math.min(2.4, 2.4 - flow / 12))).toFixed(2)}s`);
      card.style.setProperty('--salt', String(isNaN(pct) ? .6 : Math.max(.03, Math.min(1, pct / 100)).toFixed(3)));
      r.getElementById('wstitle').textContent = c.name || this._t('name');
      const state = low && !/^(backwash|brine|rinse|refill)$/.test(phase) ? 'lowsalt' : phase;
      r.getElementById('wsbadge').textContent = this._t(state);
      r.getElementById('wslcd').textContent = this._t(`lcd_${state}`);
      // dessin générique : écran étroit, texte long (CONTRE-LAVAGE…) compressé pour rester dans la fenêtre
      const lcd = r.getElementById('wslcd');
      if (c.model === 'generic' && lcd.textContent.length > 7) { lcd.setAttribute('textLength', '28'); lcd.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } else lcd.removeAttribute('textLength');
      // fuites : état texte d'une entité (ex. template) ; vert si l'état est dans la liste « normale », rouge sinon
      this._progress(phase);
      const lk = r.getElementById('wsleak'), ls0 = this._st(c.entity_leak);
      lk.classList.toggle('on', !!ls0);
      if (ls0) {
        const raw = String(ls0.state).trim(), low = raw.toLowerCase();
        const okList = (Array.isArray(c.leak_ok_states) ? c.leak_ok_states : String(c.leak_ok_states || 'off, ok, none, no, false, normal, aucune, pas de fuite, no leak, rejet égout, rejet egout, sewer discharge').split(','))
          .map((x) => String(x).trim().toLowerCase()).filter(Boolean);
        const gone = /^(unavailable|unknown)$/.test(low);
        lk.classList.toggle('ok', !gone && okList.includes(low));
        lk.classList.toggle('bad', !gone && !okList.includes(low));
        lk.textContent = gone ? '--' : raw;
      }
      const fu = this._unit(c.entity_flow, 'L/min'), tu = this._unit(c.entity_today, 'L');
      const hin = this._num(c.entity_hardness_in), hout = this._num(c.entity_hardness_out), hu = this._unit(c.entity_hardness_out || c.entity_hardness_in, '°f');
      let lastTxt = null;
      const ls = this._st(c.entity_last_regen);
      if (ls && !/^(unavailable|unknown|none)$/i.test(ls.state)) {
        const d = new Date(ls.state);
        lastTxt = !isNaN(d) && /\d{4}-\d{2}-\d{2}/.test(ls.state)
          ? d.toLocaleString(window.applianceLocale(c, this._hass, true), /T\d|\d:\d/.test(ls.state) ? { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' } : { day: '2-digit', month: '2-digit', year: '2-digit' })
          : String(ls.state);
      }
      const V = {
        flow: [c.entity_flow, this._fmt(flow, 1), fu],
        capacity: [c.entity_capacity, this._fmt(this._num(c.entity_capacity), 0), this._unit(c.entity_capacity, '%')],
        salt: [c.entity_salt, this._fmt(salt, 0), this._unit(c.entity_salt, '%')],
        hardness: [c.entity_hardness_in || c.entity_hardness_out, !isNaN(hin) && !isNaN(hout) ? `${this._fmt(hin, 0)} → ${this._fmt(hout, 0)}` : this._fmt(!isNaN(hout) ? hout : hin, 0), hu],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 0), tu],
        regen: [c.entity_regen_days, this._fmt(this._num(c.entity_regen_days), 0), this._t('days')],
        // date du dernier cycle : horodatage / date ISO → format court local, sinon le texte de l'entité tel quel
        last_regen: [lastTxt != null && c.entity_last_regen, lastTxt, ''],
        cycle_volume: [c.entity_cycle_volume, this._fmt(this._num(c.entity_cycle_volume), 0), this._unit(c.entity_cycle_volume, 'L')],
        salt_year: [c.entity_salt_year, this._fmt(this._num(c.entity_salt_year), 0), this._unit(c.entity_salt_year, 'kg')],
        power: [c.entity_power, this._fmt(this._num(c.entity_power), 0), this._unit(c.entity_power, 'W')],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'salt' && low);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceWaterSoftenerCard);
  // ancienne carte « générique » : même carte avec model: generic par défaut (tableaux de bord existants)
  customElements.define('appliance-water-softener-generic-card', class extends ApplianceWaterSoftenerCard {
    setConfig(c) { super.setConfig({ model: 'generic', ...c }); }
  });

  /* ---- éditeur visuel ---- */
  class ApplianceWaterSoftenerCardEditor extends HTMLElement {
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
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', default: 'culligan', selector: { select: { mode: 'dropdown', options: ['culligan', 'generic'].map((value) => ({ value, label: this._lbl(`model_${value}`) })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['sensor', 'binary_sensor', 'switch', 'input_boolean', 'select']),
        ent('entity_backwash', ['binary_sensor', 'switch', 'input_boolean', 'sensor']), ent('entity_brine', ['binary_sensor', 'switch', 'input_boolean', 'sensor']), ent('entity_rinse', ['binary_sensor', 'switch', 'input_boolean', 'sensor']), ent('entity_refill', ['binary_sensor', 'switch', 'input_boolean', 'sensor']), ent('entity_service', ['binary_sensor', 'switch', 'input_boolean', 'sensor']),
        ent('entity_flow', ['sensor', 'input_number', 'number']), ent('entity_capacity', ['sensor', 'input_number', 'number']), ent('entity_salt', ['sensor', 'input_number', 'number']), ent('entity_salt_max', ['sensor', 'input_number', 'number']), { name: 'salt_max', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box' } } },
        ent('entity_hardness_in', ['sensor', 'input_number', 'number']), ent('entity_hardness_out', ['sensor', 'input_number', 'number']),
        ent('entity_leak', ['sensor', 'binary_sensor', 'input_text', 'input_select']), { name: 'leak_ok_states', selector: { text: {} } },
        { name: 'status_position', selector: { select: { mode: 'dropdown', options: ['right', 'below'] } } },
        ent('entity_timer', 'timer'), ent('entity_backwash_timer', 'timer'), ent('entity_brine_timer', 'timer'), ent('entity_rinse_timer', 'timer'), ent('entity_refill_timer', 'timer'), bool('show_progress'),
        ent('entity_today', ['sensor', 'input_number', 'number']), ent('entity_regen_days', ['sensor', 'input_number', 'number']), ent('entity_last_regen', ['sensor', 'input_datetime']), ent('entity_cycle_volume', ['sensor', 'input_number', 'number']), ent('entity_salt_year', ['sensor', 'input_number', 'number']), ent('entity_power', ['sensor', 'input_number', 'number']),
        { name: 'salt_low', default: 20, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => (s.name === 'model' ? this._lbl('f_model') : window.applianceEditorLabel(s.name, this._hass));
    }
    _lbl(k) { const l = window.applianceLang(T, this._c, this._hass); return T[l][k] ?? T.en[k] ?? k; }
  }
  customElements.define(TAG + '-editor', ApplianceWaterSoftenerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Adoucisseur d'eau animé : service, contre-lavage, saumure, rinçage, sel, capacité, dureté.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/water-softener.md',
  });
})();
