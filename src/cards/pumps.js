/* Cartes « Pompes » — pompe à eau, pompe industrielle et pompe de relevage
 * custom:appliance-water-pump-card, appliance-industrial-pump-card, appliance-sump-pump-card.
 * Pompe à eau : style sobre, cuve source dont le niveau suit entity_level, roue à aubes visible
 * dans la volute, eau qui circule dans les tuyaux, jet et vagues dans le bassin de sortie.
 * Pompe industrielle : groupe moteur + pompe à engrenage interne sur châssis, finition métal,
 * voyants RUN / ALERTE / DÉFAUT, manomètre, pulsations du tuyau de refoulement, vibrations.
 * La vitesse des animations suit le débit (ou la puissance) : --spd, 0 → 1 de 0 à max_flow.
 * Le débit est lu en L/min, m³/h, L/h, L/s ou gal/min et converti en L/min pour la vitesse et
 * les seuils (max_flow, no_flow_threshold) ; la tuile garde l'unité du capteur.
 * Pompe de relevage : fosse en coupe, eau qui arrive par le drain, niveau (entity_level) et flotteur,
 * pompe immergée, refoulement vers l'égout, repère « max » et gyrophare si le niveau est trop haut.
 * États : off, running, warning (marche avec alerte), alarm (niveau haut, pompe arrêtée), fault, unavailable.
 */
(() => {
  if (customElements.get('appliance-water-pump-card')) return;

  const T = /*@i18n pump*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--pp-ok:var(--appliance-ok-color,#43a047);--pp-warn:#ffa31a;
  --pp-alert:var(--appliance-alert-color,#db4437);--fluid:#3fa9f5;--spd:0;--lvl:.6;--pr:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.running .badge{background:color-mix(in srgb,var(--pp-ok) 22%,transparent);color:var(--pp-ok)}
.warning .badge{background:color-mix(in srgb,var(--pp-warn) 22%,transparent);color:var(--pp-warn)}
.alarm .badge{background:color-mix(in srgb,var(--pp-alert) 22%,transparent);color:var(--pp-alert)}
.fault .badge{background:color-mix(in srgb,var(--pp-alert) 22%,transparent);color:var(--pp-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pp-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide{display:none}
.ctl button{flex:1 1 0;max-width:140px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--pp-alert)}

/* ---- commun : le fluide circule dans les tuyaux, plus vite quand le débit monte ---- */
.flow{fill:none;stroke:var(--fluid);stroke-linecap:round;opacity:0;transition:opacity .6s}
.running .flow,.warning .flow{opacity:1;animation:ppflow calc(var(--fd) / var(--spd)) linear infinite}
@keyframes ppflow{to{stroke-dashoffset:calc(var(--dl) * -1)}}
.rot{transform:rotate(0)}
.running .rot,.warning .rot{animation:ppspin calc(var(--rd) / var(--spd)) linear infinite}
@keyframes ppspin{to{transform:rotate(360deg)}}
.led{fill:#59636c;transition:fill .4s}
.fluidfill{fill:var(--fluid)}

/* ---- pompe à eau (sobre) ---- */
.wp{--fd:.9s;--dl:24px;--rd:.5s}
.wp .tankw{transform:translateY(calc((1 - var(--lvl)) * 80px));transition:transform 1.2s ease-out}
.wp .wave{animation:ppwave 3s linear infinite}
.wp.running .wave,.wp.warning .wave{animation-duration:1.4s}
.wp .basin .wave{animation-duration:4s}
.wp.running .basin .wave,.wp.warning .basin .wave{animation-duration:.9s}
@keyframes ppwave{to{transform:translateX(-24px)}}
.wp .jetd{stroke:#fff}
.wp .jet{opacity:0;transition:opacity .5s}
.wp.running .jet,.wp.warning .jet{opacity:.9}
.wp .ripple{fill:none;stroke:#fff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:center}
.wp.running .ripple,.wp.warning .ripple{animation:ppripple 1.2s ease-out infinite}
.wp .ripple:nth-of-type(2){animation-delay:-.6s!important}
@keyframes ppripple{0%{opacity:.8;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
.wp.running .led{fill:var(--pp-ok)}
.wp.warning .led{fill:var(--pp-warn);animation:ppblink 1s steps(2) infinite}
.wp.fault .led{fill:var(--pp-alert);animation:ppblink .5s steps(2) infinite}
@keyframes ppblink{50%{opacity:.25}}

/* ---- pompe industrielle (robuste) ---- */
.ip{--fd:.45s;--dl:36px;--rd:.6s}
.ip .rot.fast{--rd:.35s}
.ip .rig{transform-box:view-box}
.ip.running .rig,.ip.warning .rig{animation:ppvib .12s linear infinite}
@keyframes ppvib{25%{transform:translate(.4px,-.3px)}75%{transform:translate(-.4px,.3px)}}
/* pulsations : le tuyau de refoulement gonfle au rythme de la pompe, une onde de pression part de la bride */
.ip .pipeo{stroke-width:15}
.ip.running .pipeo,.ip.warning .pipeo{animation:pppulse calc(.5s / var(--spd)) ease-in-out infinite}
@keyframes pppulse{50%{stroke-width:18}}
.ip .wavep{fill:none;stroke:var(--fluid);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center}
.ip.running .wavep,.ip.warning .wavep{animation:ppring calc(.9s / var(--spd)) ease-out infinite}
.ip .wavep:nth-of-type(2){animation-delay:calc(-.45s / var(--spd))!important}
@keyframes ppring{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.8)}}
.ip .glow{opacity:0;transition:opacity .6s}
.ip.running .glow,.ip.warning .glow{opacity:.55;animation:ppglow calc(.5s / var(--spd)) ease-in-out infinite}
@keyframes ppglow{50%{opacity:.15}}
/* manomètre : l'aiguille suit la pression et tremble en marche */
.ip .needle{transform-box:view-box;transform-origin:124px 20px;transform:rotate(calc(var(--pr) * 240deg - 120deg));transition:transform 1s ease-out}
.ip .needle g{transform-box:view-box;transform-origin:124px 20px}
.ip.running .needle g,.ip.warning .needle g{animation:ppjit .18s ease-in-out infinite alternate}
@keyframes ppjit{to{transform:rotate(4deg)}}
.ip .shaft{stroke-dasharray:3 3}
.ip.running .shaft,.ip.warning .shaft{animation:ppshaft .12s linear infinite}
@keyframes ppshaft{to{stroke-dashoffset:-6}}
.ip .led.run{fill:#1f4d24}.ip .led.wrn{fill:#5a4416}.ip .led.flt{fill:#4f1d19}
.ip.running .led.run,.ip.warning .led.run{fill:#3ddc5a;filter:drop-shadow(0 0 3px #3ddc5a)}
.ip.warning .led.wrn{fill:#ffb31a;filter:drop-shadow(0 0 3px #ffb31a);animation:ppblink 1s steps(2) infinite}
.ip.fault .led.flt{fill:#ff3b30;filter:drop-shadow(0 0 3px #ff3b30);animation:ppblink .5s steps(2) infinite}
.ip .plate{fill:#1d2125;font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}

/* ---- pompe de relevage ---- */
.sp{--fd:.8s;--dl:24px}
.sp .pitw,.sp .floatg{transform:translateY(calc((1 - var(--lvl)) * 104px));transition:transform 1.5s ease-out}
.sp .wave{animation:ppwave 3.2s linear infinite}
.sp.running .wave,.sp.warning .wave{animation-duration:1.2s}
.sp .drop{fill:var(--fluid);opacity:0;animation:ppdrop 1.6s ease-in infinite}
.sp .drop:nth-of-type(2){animation-delay:-.55s}.sp .drop:nth-of-type(3){animation-delay:-1.1s}
@keyframes ppdrop{0%{opacity:0;transform:translateY(0)}10%{opacity:.9}100%{opacity:0;transform:translateY(46px)}}
.sp .rig{transform-box:view-box}
.sp.running .rig,.sp.warning .rig{animation:ppvib .12s linear infinite}
.sp .sbub{fill:#fff;opacity:0}
.sp.running .sbub,.sp.warning .sbub{animation:ppsbub 1.4s ease-in infinite}
.sp .sbub:nth-of-type(2){animation-delay:-.45s!important}.sp .sbub:nth-of-type(3){animation-delay:-.9s!important}
@keyframes ppsbub{0%{opacity:0;transform:translateY(0)}20%{opacity:.8}100%{opacity:0;transform:translateY(-34px)}}
.sp .beacon{fill:#5a2a26;transition:fill .3s}
.sp.hi .beacon{fill:#ff3b30;filter:drop-shadow(0 0 5px #ff3b30);animation:ppblink .6s steps(2) infinite}
.sp .maxl{stroke:var(--pp-alert);stroke-width:1.2;stroke-dasharray:3 2}
.sp .maxt{fill:var(--pp-alert);font:600 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.sp.running .led,.sp.warning .led{fill:var(--pp-ok)}
.sp.fault .led,.sp.alarm .led{fill:var(--pp-alert);animation:ppblink .5s steps(2) infinite}
.noanim *{animation:none!important}
`;

  /* Pompe à eau : cuve source à gauche, volute avec roue à aubes, moteur, refoulement vers un bassin */
  const SVG_WATER = (label) => {
    const blades = Array.from({ length: 6 }, (_, i) => `<path d="M0 0 Q7 -4 5 -13" transform="rotate(${i * 60})"/>`).join('');
    const fins = Array.from({ length: 10 }, (_, i) => `M${124 + i * 6} 97 V135`).join(' ');
    const wave = (x, y, w) => `M${x} ${y} q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 V${y + w} H${x} Z`;
    return `
<svg viewBox="0 0 260 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="wpbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#dfe5ea"/><stop offset="1" stop-color="#b9c3cb"/></linearGradient>
  <linearGradient id="wpvol" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fb4ff"/><stop offset="1" stop-color="#1e6fc9"/></linearGradient>
  <linearGradient id="wpwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--fluid)" stop-opacity=".75"/><stop offset="1" stop-color="var(--fluid)" stop-opacity=".95"/></linearGradient>
  <clipPath id="wptank"><rect x="10" y="64" width="36" height="84" rx="2"/></clipPath>
  <clipPath id="wpbasin"><rect x="198" y="128" width="52" height="24" rx="2"/></clipPath>
 </defs>
 <ellipse cx="130" cy="160" rx="122" ry="5" fill="#000" opacity=".15"/>
 <!-- cuve source : niveau = entity_level -->
 <rect x="8" y="60" width="40" height="92" rx="4" fill="#e9f0f5" opacity=".55" stroke="#9fb3c3" stroke-width="1.2"/>
 <g clip-path="url(#wptank)"><g class="tankw"><path class="wave" d="${wave(-2, 66, 90)}" fill="url(#wpwater)"/></g></g>
 <rect x="6" y="56" width="44" height="6" rx="2" fill="#9fb3c3"/>
 <g stroke="#9fb3c3" stroke-width=".8"><path d="M40 80 H46 M40 100 H46 M40 120 H46 M40 140 H46"/></g>
 <!-- tuyaux : enveloppe, intérieur, puis le fluide en tirets animés -->
 <g fill="none" stroke-linecap="round">
  <path d="M46 116 H62" stroke="#c3ced7" stroke-width="10"/>
  <path d="M84 92 V42 Q84 34 92 34 H212 Q220 34 220 42 V58" stroke="#c3ced7" stroke-width="10"/>
  <path d="M46 116 H62" stroke="#eef3f7" stroke-width="6"/>
  <path d="M84 92 V42 Q84 34 92 34 H212 Q220 34 220 42 V58" stroke="#eef3f7" stroke-width="6"/>
  <path class="flow" d="M46 116 H62" stroke-width="4" stroke-dasharray="5 7"/>
  <path class="flow" d="M84 92 V42 Q84 34 92 34 H212 Q220 34 220 42 V58" stroke-width="4" stroke-dasharray="5 7"/>
 </g>
 <rect x="214" y="56" width="12" height="6" rx="1.5" fill="#9fb3c3"/>
 <!-- jet qui tombe dans le bassin -->
 <g class="jet"><rect x="217.5" y="62" width="5" height="70" rx="2.5" class="fluidfill" opacity=".55"/>
  <path class="flow jetd" d="M220 62 V132" stroke-width="2.5" stroke-dasharray="4 8"/></g>
 <!-- bassin de sortie avec vagues -->
 <g class="basin" clip-path="url(#wpbasin)"><path class="wave" d="${wave(186, 134, 30)}" fill="url(#wpwater)"/></g>
 <ellipse class="ripple" cx="220" cy="135" rx="9" ry="2.2"/><ellipse class="ripple" cx="220" cy="135" rx="9" ry="2.2"/>
 <rect x="196" y="126" width="56" height="28" rx="4" fill="none" stroke="#9fb3c3" stroke-width="2"/>
 <!-- socle -->
 <rect x="74" y="138" width="20" height="9" rx="1.5" fill="#a9b4bd"/>
 <rect x="104" y="140" width="92" height="7" rx="2" fill="#a9b4bd"/>
 <!-- moteur à ailettes -->
 <rect x="104" y="106" width="10" height="20" fill="#b9c3cb"/>
 <rect x="110" y="92" width="78" height="48" rx="11" fill="url(#wpbody)" stroke="#aab6c0"/>
 <path d="${fins}" stroke="#c4ced6" stroke-width="1.6"/>
 <rect x="110" y="114" width="78" height="3" fill="var(--fluid)" opacity=".85"/>
 <rect x="186" y="97" width="9" height="38" rx="4" fill="#aab6c0"/>
 <rect x="134" y="82" width="28" height="12" rx="2" fill="#e8edf1" stroke="#aab6c0"/>
 <circle class="led" cx="155" cy="88" r="2.4"/>
 <!-- volute et roue à aubes -->
 <circle cx="84" cy="116" r="24" fill="url(#wpvol)"/>
 <circle cx="84" cy="116" r="16" fill="#0f2f52" opacity=".85"/>
 <g transform="translate(84 116)"><g class="rot" fill="none" stroke="#bfe3ff" stroke-width="2.2" stroke-linecap="round">${blades}<circle r="3.2" fill="#bfe3ff" stroke="none"/></g></g>
 <path d="M72 104 A16 16 0 0 1 92 102" stroke="#fff" stroke-width="1.5" fill="none" opacity=".35"/>
</svg>`;
  };

  /* Pompe industrielle : châssis, pompe à engrenage interne à brides, accouplement protégé, moteur à ailettes */
  const SVG_INDUSTRIAL = (label) => {
    const teeth = (r, n, h) => Array.from({ length: n }, (_, i) => `<rect x="-2" y="${-r - h}" width="4" height="${h + 1}" rx="1" transform="rotate(${(360 / n) * i})"/>`).join('');
    const ring = Array.from({ length: 12 }, (_, i) => `<rect x="-2" y="-21" width="4" height="5" rx="1" transform="rotate(${30 * i})"/>`).join('');
    const bolts = Array.from({ length: 8 }, (_, i) => { const a = (i * 45 + 22.5) * Math.PI / 180;
      return `<circle cx="${(78 + 31 * Math.cos(a)).toFixed(1)}" cy="${(112 + 31 * Math.sin(a)).toFixed(1)}" r="2.2"/>`; }).join('');
    const fins = Array.from({ length: 8 }, (_, i) => `M152 ${80 + i * 8.5} H246`).join(' ');
    // arc du manomètre entre deux angles (0° = aiguille verticale, sens horaire)
    const pt = (a) => { const r = a * Math.PI / 180; return `${(124 + 10.5 * Math.sin(r)).toFixed(2)} ${(20 - 10.5 * Math.cos(r)).toFixed(2)}`; };
    const arc = (a, b, col) => `<path d="M${pt(a)} A10.5 10.5 0 0 1 ${pt(b)}" stroke="${col}" stroke-width="2.2" fill="none"/>`;
    const grill = Array.from({ length: 6 }, (_, i) => `M${252 + i * 2} 86 V138`).join(' ');
    return `
<svg viewBox="0 0 280 190" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="ipsteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dee2"/><stop offset=".45" stop-color="#8c969e"/><stop offset="1" stop-color="#4c555c"/></linearGradient>
  <linearGradient id="ipmotor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8f9c"/><stop offset=".25" stop-color="#c4ced5"/><stop offset=".55" stop-color="#5d6f7c"/><stop offset="1" stop-color="#2f3b44"/></linearGradient>
  <radialGradient id="ippump" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7fa3c4"/><stop offset=".5" stop-color="#3b6488"/><stop offset="1" stop-color="#1d3550"/></radialGradient>
  <pattern id="iphaz" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#f2a516"/><rect width="4" height="8" fill="#22262a"/></pattern>
 </defs>
 <ellipse cx="140" cy="180" rx="134" ry="5" fill="#000" opacity=".2"/>
 <g class="rig">
  <!-- châssis -->
  <rect x="10" y="160" width="260" height="13" rx="2" fill="#3b4248"/><rect x="10" y="160" width="260" height="3" fill="#6b747c"/>
  <g fill="#9aa3aa"><circle cx="22" cy="168" r="2.4"/><circle cx="96" cy="168" r="2.4"/><circle cx="184" cy="168" r="2.4"/><circle cx="258" cy="168" r="2.4"/></g>
  <!-- tuyaux d'aspiration et de refoulement -->
  <g fill="none">
   <path d="M0 112 H40" stroke="#6c757d" stroke-width="15"/>
   <path class="pipeo" d="M78 72 V50 Q78 42 86 42 H280" stroke="#6c757d"/>
   <path d="M0 112 H40" stroke="#262b30" stroke-width="9"/>
   <path d="M78 72 V50 Q78 42 86 42 H280" stroke="#262b30" stroke-width="9"/>
   <path class="glow" d="M78 72 V50 Q78 42 86 42 H280" stroke="var(--fluid)" stroke-width="9"/>
   <path class="flow" d="M0 112 H40" stroke-width="5" stroke-dasharray="10 8"/>
   <path class="flow" d="M78 72 V50 Q78 42 86 42 H280" stroke-width="5" stroke-dasharray="10 8"/>
  </g>
  <!-- brides boulonnées -->
  <rect x="38" y="96" width="7" height="32" rx="1.5" fill="url(#ipsteel)"/><rect x="62" y="66" width="32" height="7" rx="1.5" fill="url(#ipsteel)"/>
  <rect x="196" y="28" width="7" height="28" rx="1.5" fill="url(#ipsteel)"/>
  <g fill="#3b4248"><circle cx="41.5" cy="101" r="1.4"/><circle cx="41.5" cy="123" r="1.4"/><circle cx="67" cy="69.5" r="1.4"/><circle cx="89" cy="69.5" r="1.4"/><circle cx="199.5" cy="32" r="1.4"/><circle cx="199.5" cy="52" r="1.4"/></g>
  <ellipse class="wavep" cx="78" cy="58" rx="9" ry="9"/><ellipse class="wavep" cx="78" cy="58" rx="9" ry="9"/>
  <!-- manomètre -->
  <rect x="122" y="32" width="4" height="6" fill="#8c969e"/>
  <circle cx="124" cy="20" r="15" fill="url(#ipsteel)"/><circle cx="124" cy="20" r="12.5" fill="#f4f6f7"/>
  ${arc(-120, 40, '#43a047')}${arc(40, 80, '#ffb31a')}${arc(80, 120, '#e53935')}
  <g class="needle"><g><path d="M124 20 L124 9.5" stroke="#1d2125" stroke-width="1.4" stroke-linecap="round"/></g></g>
  <circle cx="124" cy="20" r="1.8" fill="#1d2125"/>
  <!-- pompe à engrenage interne -->
  <path d="M58 140 L98 140 L104 160 L52 160 Z" fill="#3b4248"/>
  <circle cx="78" cy="112" r="36" fill="url(#ippump)" stroke="#16283b" stroke-width="1.5"/>
  <g fill="#c9d1d7">${bolts}</g>
  <circle cx="78" cy="112" r="24" fill="#0e1a26"/>
  <g transform="translate(78 112)">
   <g class="rot" fill="#e8ecef"><circle r="21" fill="none" stroke="#e8ecef" stroke-width="2.5"/>${ring}</g>
  </g>
  <path d="M70 102 A11 11 0 0 0 70 122 A30 30 0 0 1 70 102 Z" fill="#f2a516"/>
  <g transform="translate(83 112)"><g class="rot fast" fill="#bfc8cf"><circle r="8.5"/>${teeth(8.5, 8, 3.5)}<circle r="2.5" fill="#4c555c"/></g></g>
  <path d="M56 96 A26 26 0 0 1 92 88" stroke="#fff" stroke-width="2" fill="none" opacity=".25"/>
  <!-- arbre et carter d'accouplement -->
  <path class="shaft" d="M114 112 H150" stroke="#cfd6db" stroke-width="6"/>
  <rect x="116" y="98" width="32" height="28" rx="3" fill="url(#iphaz)" stroke="#22262a"/>
  <rect x="122" y="108" width="20" height="8" rx="2" fill="#22262a"/>
  <path class="shaft" d="M122 112 H142" stroke="#cfd6db" stroke-width="4"/>
  <!-- moteur -->
  <rect x="156" y="150" width="14" height="10" fill="#2f3b44"/><rect x="230" y="150" width="14" height="10" fill="#2f3b44"/>
  <rect x="148" y="72" width="102" height="80" rx="12" fill="url(#ipmotor)" stroke="#232d35"/>
  <path d="${fins}" stroke="#2f3b44" stroke-width="1.6" opacity=".55"/>
  <rect x="248" y="80" width="18" height="64" rx="6" fill="url(#ipsteel)" stroke="#2f3b44"/>
  <path d="${grill}" stroke="#2f3b44" stroke-width="1"/>
  <rect x="160" y="104" width="38" height="17" rx="2" fill="#dfe4e8" stroke="#8c969e"/>
  <text class="plate" id="ipplate" x="179" y="115.5">--</text>
  <!-- boîte à bornes et voyants -->
  <rect x="174" y="54" width="56" height="20" rx="3" fill="#1d2329" stroke="#4c555c"/>
  <circle class="led run" cx="187" cy="64" r="3.6"/><circle class="led wrn" cx="202" cy="64" r="3.6"/><circle class="led flt" cx="217" cy="64" r="3.6"/>
 </g>
</svg>`;
  };

  /* Pompe de relevage : fosse enterrée vue en coupe, drain d'arrivée, pompe immergée et flotteur */
  const SVG_SUMP = (label) => {
    const wave = `M60 58 q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 V200 H60 Z`;
    const grill = Array.from({ length: 6 }, (_, i) => `M${92 + i * 4} 161 V167`).join(' ');
    return `
<svg viewBox="0 0 260 180" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="spsoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a4a"/><stop offset="1" stop-color="#5b4430"/></linearGradient>
  <linearGradient id="spwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--fluid)" stop-opacity=".7"/><stop offset="1" stop-color="#1b4f7a" stop-opacity=".95"/></linearGradient>
  <linearGradient id="spbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5f7f99"/><stop offset=".45" stop-color="#a9c0d2"/><stop offset="1" stop-color="#4a647a"/></linearGradient>
  <clipPath id="sppit"><rect x="70" y="46" width="100" height="124"/></clipPath>
 </defs>
 <!-- sol en coupe et pelouse -->
 <rect x="0" y="40" width="260" height="138" fill="url(#spsoil)"/>
 <g fill="#6f5338" opacity=".6"><circle cx="20" cy="70" r="2"/><circle cx="40" cy="120" r="2.5"/><circle cx="210" cy="100" r="2"/><circle cx="240" cy="150" r="3"/><circle cx="30" cy="160" r="2"/><circle cx="200" cy="160" r="2.4"/></g>
 <rect x="0" y="34" width="260" height="7" fill="#5aa046"/>
 <!-- fosse béton -->
 <rect x="62" y="34" width="116" height="144" fill="#a7adb2"/>
 <rect x="70" y="46" width="100" height="124" fill="#2b3238"/>
 <g clip-path="url(#sppit)"><g class="pitw"><path class="wave" d="${wave}" fill="url(#spwater)"/></g></g>
 <path class="maxl" id="spmax" d="M70 0 H170"/><text class="maxt" id="spmaxt" x="166" y="0" text-anchor="end">max</text>
 <!-- drain d'arrivée et gouttes -->
 <path d="M0 78 H74" stroke="#7d868e" stroke-width="9" fill="none"/><path d="M0 78 H74" stroke="#3b4248" stroke-width="5" fill="none"/>
 <g><circle class="drop" cx="76" cy="82" r="2"/><circle class="drop" cx="77" cy="82" r="1.6"/><circle class="drop" cx="75" cy="82" r="1.8"/></g>
 <!-- flotteur : suit la surface -->
 <g clip-path="url(#sppit)"><g class="floatg">
  <path d="M150 62 C150 90 128 100 116 118" fill="none" stroke="#1d2125" stroke-width="1.4"/>
  <ellipse cx="150" cy="58" rx="9" ry="5" fill="#f2a516" stroke="#a86f0c"/>
 </g></g>
 <!-- refoulement vers l'égout -->
 <g fill="none" stroke-linecap="round">
  <path d="M104 120 V68 Q104 60 112 60 H260" stroke="#7d868e" stroke-width="10"/>
  <path d="M104 120 V68 Q104 60 112 60 H260" stroke="#3b4248" stroke-width="6"/>
  <path class="flow" d="M104 120 V68 Q104 60 112 60 H260" stroke-width="4" stroke-dasharray="5 7"/>
 </g>
 <rect x="97" y="86" width="14" height="10" rx="2" fill="#4c555c" stroke="#2b3238"/>
 <!-- pompe immergée -->
 <g class="rig">
  <rect x="88" y="118" width="32" height="44" rx="7" fill="url(#spbody)" stroke="#2f4558"/>
  <rect x="86" y="160" width="36" height="9" rx="2" fill="#2f4558"/>
  <path d="${grill}" stroke="#a9c0d2" stroke-width="1.6"/>
  <rect x="96" y="114" width="16" height="6" rx="2" fill="#4a647a"/>
  <circle class="led" cx="104" cy="132" r="2.4"/>
  <circle class="sbub" cx="90" cy="158" r="1.6"/><circle class="sbub" cx="118" cy="156" r="1.3"/><circle class="sbub" cx="104" cy="160" r="1.8"/>
 </g>
 <!-- gyrophare d'alarme niveau haut -->
 <rect x="214" y="26" width="16" height="9" rx="1.5" fill="#3b4248"/>
 <path class="beacon" d="M216 26 V18 Q222 10 228 18 V26 Z"/>
</svg>`;
  };

  const KINDS = {
    water_pump: { cls: 'wp', svg: SVG_WATER, re: /pomp|pump|arros|forage|puits|well|irrig/i,
      d: { max_flow: 40, max_power: 1200, run_threshold: 15, max_pressure: 6, pressure_max: 5, temp_max: 70, level_min: 15 } },
    industrial_pump: { cls: 'ip', svg: SVG_INDUSTRIAL, re: /pomp|pump|surpress|booster|process/i,
      d: { max_flow: 200, max_power: 7500, run_threshold: 100, max_pressure: 16, pressure_max: 12, temp_max: 85, level_min: 10 } },
    sump_pump: { cls: 'sp', svg: SVG_SUMP, sump: true, re: /relevage|sump|fosse|puisard|cuve.?eaux/i,
      d: { max_flow: 150, max_power: 800, run_threshold: 20, max_pressure: 2, pressure_max: 2, temp_max: 70, level_min: 0, level_max: 80 } },
  };
  const TILES = [
    ['flow', 'mdi:waves-arrow-right', 'show_flow'],
    ['pressure', 'mdi:gauge', 'show_pressure'],
    ['power', 'mdi:flash', 'show_power'],
    ['temp', 'mdi:thermometer', 'show_temp'],
    ['level', 'mdi:storage-tank-outline', 'show_level'],
    ['runtime', 'mdi:timer-outline', 'show_runtime'],
    ['starts', 'mdi:counter', 'show_starts'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class AppliancePumpCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      // temp_max par défaut (en °C dans KINDS) : converti dans l'unité d'affichage au rendu
      const { temp_max, ...d } = KINDS[this.kind].d;
      this._c = { show_status: true, show_controls: true, show_flow: true, show_pressure: true, show_power: true, show_temp: true, show_level: true,
        show_runtime: true, show_starts: true, show_energy: true, show_cost: true, no_flow_threshold: 0.5, ...d, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { const l = (this._c.language || (this._hass && this._hass.language) || 'en').slice(0, 2); return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _watts(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = ((this._st(id).attributes || {}).unit_of_measurement || '').toLowerCase();
      return u === 'kw' ? v * 1000 : v;
    }
    // débit converti en L/min, quelle que soit l'unité du capteur
    _lpm(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 'L/min').toLowerCase().replace(/\s/g, '').replace('³', '3');
      if (/^m3\/h/.test(u)) return v * 1000 / 60;
      if (/^m3\/min/.test(u)) return v * 1000;
      if (/^l\/h/.test(u)) return v / 60;
      if (/^l\/s/.test(u)) return v * 60;
      if (/^gal\/min|^gpm/.test(u)) return v * 3.78541;
      return v;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c, K = KINDS[this.kind];
      root.innerHTML = `<style>${CSS}</style><ha-card class="${K.cls}">
        <div class="head"><div class="title" id="pptitle"></div><div class="badge" id="ppbadge"></div></div>
        ${K.svg(c.name || this._t(this.kind))}
        <div class="alert" id="ppalert"></div>
        <div class="ctl" id="ppctl"><button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity || this._c.entity_power));
      root.querySelector('[data-a="power"]').addEventListener('click', () => {
        const id = this._c.entity; if (!id || !this._hass) return;
        this._hass.callService('homeassistant', 'toggle', { entity_id: id });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ flow: cc.entity_flow, pressure: cc.entity_pressure, power: cc.entity_power, temp: cc.entity_temp, level: cc.entity_level || cc.entity_float,
          runtime: cc.entity_runtime, starts: cc.entity_starts, energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const pw = this._watts(c.entity_power), flow = this._lpm(c.entity_flow), pres = this._num(c.entity_pressure);
      // température dans l'unité d'affichage (°C / °F)
      const tc = window.applianceTemp(this._hass, c), temp = tc.conv(this._num(c.entity_temp), this._st(c.entity_temp)), level = this._num(c.entity_level);
      const tMax = c.temp_max ?? tc.c(KINDS[this.kind].d.temp_max);
      const txt = s ? String(s.state).toLowerCase() : '';
      const fault = this._st(c.entity_fault);
      const v = { pw, flow, pres, temp, tUnit: tc.unit, level, alerts: [] };
      if ((fault && fault.state === 'on') || /error|erreur|fault|défaut|defaut|alarm|trip/.test(txt)) return { ...v, st: 'fault' };
      let on;
      if (s && !/^(unavailable|unknown)$/.test(txt)) on = !/^(off|false|0|arr[eê]t|éteint|eteint|idle|stopped)$/.test(txt);
      else if (!isNaN(pw)) on = pw > Number(c.run_threshold);
      else if (!isNaN(flow)) on = flow > Number(c.no_flow_threshold);
      else return { ...v, st: c.entity || c.entity_power ? 'unavailable' : 'off' };
      // alertes : marche à sec (pas de débit), surpression, moteur trop chaud, niveau bas
      if (on && !isNaN(flow) && flow < Number(c.no_flow_threshold)) v.alerts.push('no_flow');
      if (!isNaN(pres) && pres > Number(c.pressure_max)) v.alerts.push('overpressure');
      if (!isNaN(temp) && temp > Number(tMax)) v.alerts.push('overheat');
      if (KINDS[this.kind].sump) {
        // relevage : c'est le niveau HAUT qui est dangereux (débordement), signalé par le capteur ou le flotteur d'alarme
        const fl = this._st(c.entity_float);
        if ((!isNaN(level) && level > Number(c.level_max)) || (fl && fl.state === 'on')) v.alerts.push('high_level');
        if (!on && v.alerts.includes('high_level')) return { ...v, st: 'alarm' };
      } else if (!isNaN(level) && level < Number(c.level_min)) v.alerts.push('low_level');
      return { ...v, st: !on ? 'off' : v.alerts.length ? 'warning' : 'running' };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, K = KINDS[this.kind];
      const { st, pw, flow, pres, temp, tUnit, level, alerts } = this._compute();
      const flowRaw = this._num(c.entity_flow); // valeur affichée, dans l'unité du capteur
      const clamp = (x) => Math.max(0, Math.min(1, x));
      const on = st === 'running' || st === 'warning';
      // vitesse d'animation : débit sinon puissance, au moins 0,25 pour que ça reste lisible
      let spd = !isNaN(flow) ? flow / Number(c.max_flow) : !isNaN(pw) ? pw / Number(c.max_power) : 0.7;
      spd = on ? Math.max(0.25, clamp(spd)) : 0.25;
      card.className = `${K.cls} ${st}${alerts.includes('high_level') ? ' hi' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--spd', spd.toFixed(3));
      // sans capteur de niveau, la fosse se vide pendant que la pompe tourne
      const lvl0 = K.sump ? (alerts.includes('high_level') ? 0.9 : on ? 0.3 : 0.55) : 0.6;
      card.style.setProperty('--lvl', (isNaN(level) ? lvl0 : clamp(level / 100)).toFixed(3));
      const mx = r.getElementById('spmax');
      if (mx) {
        // repère « max » : surface de l'eau au niveau level_max (même formule que .pitw)
        const y = 58 + (1 - clamp(Number(c.level_max) / 100)) * 104;
        mx.setAttribute('d', `M70 ${y.toFixed(1)} H170`);
        r.getElementById('spmaxt').setAttribute('y', (y - 2).toFixed(1));
        mx.style.display = r.getElementById('spmaxt').style.display = c.entity_level ? '' : 'none';
      }
      card.style.setProperty('--pr', (isNaN(pres) ? (on ? 0.5 : 0) : clamp(pres / Number(c.max_pressure))).toFixed(3));
      if (c.fluid_color) card.style.setProperty('--fluid', String(c.fluid_color)); else card.style.removeProperty('--fluid');

      r.getElementById('pptitle').textContent = c.name || this._t(this.kind);
      const badge = r.getElementById('ppbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('ppalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);
      const plate = r.getElementById('ipplate');
      if (plate) plate.textContent = isNaN(pw) ? (on ? 'RUN' : 'STOP') : pw >= 1000 ? `${this._fmt(pw / 1000, 1)} kW` : `${this._fmt(pw, 0)} W`;

      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('ppctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['switch', 'input_boolean', 'fan'].includes(d));
      ctl.querySelector('span').textContent = this._t(on ? 'turn_off' : 'turn_on');

      const energy = this._num(c.entity_energy), run = this._num(c.entity_runtime), starts = this._num(c.entity_starts);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        flow: [c.entity_flow, this._fmt(flowRaw, 1), this._unit(c.entity_flow, 'L/min')],
        pressure: [c.entity_pressure, this._fmt(pres, 1), this._unit(c.entity_pressure, 'bar')],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        temp: [c.entity_temp, this._fmt(temp, 0), tUnit],
        level: [c.entity_level, this._fmt(level, 0), this._unit(c.entity_level, '%')],
        runtime: [c.entity_runtime, this._fmt(run, 1), this._unit(c.entity_runtime, 'h')],
        starts: [c.entity_starts, this._fmt(starts, 0), ''],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      const bad = { flow: alerts.includes('no_flow'), pressure: alerts.includes('overpressure'), temp: alerts.includes('overheat'), level: alerts.includes('low_level') || alerts.includes('high_level') };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(K.sump && k === 'level' && !(this._c.labels || {}).level ? 'pit' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class AppliancePumpCardEditor extends HTMLElement {
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
      const D = KINDS[this.kind].d;
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const num = (name, min, max, step, unit) => ({ name, default: D[name], selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tc = window.applianceTemp(this._hass, this._c);
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_power', 'sensor'), ent('entity_flow', 'sensor'), ent('entity_pressure', 'sensor'),
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_level', 'sensor'), ent('entity_fault', 'binary_sensor'), ent('entity_runtime', 'sensor'),
        ...(KINDS[this.kind].sump ? [ent('entity_float', 'binary_sensor'), ent('entity_starts', 'sensor')] : []),
        ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { name: 'fluid_color', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          num('max_flow', 1, 10000, 1, 'L/min'), num('max_power', 10, 100000, 10, 'W'), num('run_threshold', 0, 5000, 1, 'W'),
          num('max_pressure', 1, 100, 0.5, 'bar'), num('pressure_max', 0, 100, 0.1, 'bar'), { name: 'temp_max', default: tc.c(D.temp_max), selector: { number: { ...tc.range(20, 150), step: 1, mode: 'box', unit_of_measurement: tc.unit } } }, KINDS[this.kind].sump ? num('level_max', 0, 100, 1, '%') : num('level_min', 0, 100, 1, '%'),
        ] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_flow'), bool('show_pressure'), bool('show_power'), bool('show_temp'),
          bool('show_level'), bool('show_runtime'), bool('show_starts'), bool('show_energy'), bool('show_cost'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  const DESC = {
    water_pump: 'Pompe à eau sobre (arrosage, puits, piscine) : roue à aubes, eau qui circule, vagues, niveau de cuve, débit et pression.',
    industrial_pump: 'Pompe industrielle robuste : finition métal, voyants, manomètre, pulsations et vibrations selon le débit.',
    sump_pump: 'Pompe de relevage : fosse en coupe, niveau et flotteur, pompe immergée, refoulement, alarme de niveau haut.',
  };
  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace('_', '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends AppliancePumpCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
        const src = K.re.source;
        return {
          entity: f(K.re, 'switch') || f(K.re, 'binary_sensor'),
          entity_power: f(new RegExp(`(${src}).*(power|puissance)`, 'i'), 'sensor'),
          entity_flow: f(new RegExp(`(${src}).*(flow|debit|débit)`, 'i'), 'sensor'),
        };
      }
    });
    customElements.define(tag + '-editor', class extends AppliancePumpCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, description: DESC[kind], preview: true,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
