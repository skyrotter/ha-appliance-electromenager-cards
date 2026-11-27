/* Carte « Chaudière à gaz » — custom:appliance-gas-boiler-card
 * Chaudière murale gaz : flamme bleue sur rampe de brûleur, circuit départ/retour qui
 * change de couleur avec la température, arrivée gaz, ECS, manomètre, fumées.
 */
(() => {
  const TAG = 'appliance-gas-boiler-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Gas boiler","off":"Off","standby":"Standby","heating":"Heating","dhw":"Hot water","alarm":"Fault","power":"Electric","energy":"Elec. energy","gas":"Gas","cost":"Cost","flow":"Flow","ret":"Return","pressure":"Pressure","mod":"Modulation","delta":"ΔT","lowp":"Low pressure","highp":"High pressure","hotf":"Flow too hot","outdoor":"Outdoor","room":"Room","setpoint":"Setpoint"},"cs":{"name":"Plynový kotel","off":"Vypnuto","standby":"Pohotovost","heating":"Topí","dhw":"Teplá voda","alarm":"Porucha","power":"Elektřina","energy":"El. energie","gas":"Plyn","cost":"Cena","flow":"Výstup","ret":"Zpátečka","pressure":"Tlak","mod":"Modulace","delta":"ΔT","lowp":"Nízký tlak","highp":"Vysoký tlak","hotf":"Výstup příliš horký"},"da":{"name":"Gasfyr","off":"Slukket","standby":"Standby","heating":"Varmer","dhw":"Varmt vand","alarm":"Fejl","power":"El","energy":"El-energi","gas":"Gas","cost":"Pris","flow":"Fremløb","ret":"Retur","pressure":"Tryk","mod":"Modulering","delta":"ΔT","lowp":"Lavt tryk","highp":"Højt tryk","hotf":"Fremløb for varmt"},"de":{"name":"Gastherme","off":"Aus","standby":"Standby","heating":"Heizen","dhw":"Warmwasser","alarm":"Störung","power":"Elektrisch","energy":"Elektr. Energie","gas":"Gas","cost":"Kosten","flow":"Vorlauf","ret":"Rücklauf","pressure":"Druck","mod":"Modulation","delta":"ΔT","lowp":"Druck zu niedrig","highp":"Druck zu hoch","hotf":"Vorlauf zu heiß"},"es":{"name":"Caldera de gas","off":"Apagada","standby":"En espera","heating":"Calefacción","dhw":"Agua caliente","alarm":"Avería","power":"Eléctrica","energy":"Energía eléct.","gas":"Gas","cost":"Coste","flow":"Ida","ret":"Retorno","pressure":"Presión","mod":"Modulación","delta":"ΔT","lowp":"Presión baja","highp":"Presión alta","hotf":"Ida demasiado caliente","outdoor":"Exterior","room":"Estancia","setpoint":"Consigna"},"fr":{"name":"Chaudière gaz","off":"Éteinte","standby":"Veille","heating":"Chauffage","dhw":"Eau chaude","alarm":"Défaut","power":"Électrique","energy":"Énergie élec.","gas":"Gaz","cost":"Coût","flow":"Départ","ret":"Retour","pressure":"Pression","mod":"Modulation","delta":"ΔT","lowp":"Pression basse","highp":"Pression haute","hotf":"Départ trop chaud","outdoor":"Extérieur","room":"Pièce","setpoint":"Consigne"},"hu":{"name":"Gázkazán","off":"Ki","standby":"Készenlét","heating":"Fűtés","dhw":"Meleg víz","alarm":"Hiba","power":"Elektromos","energy":"Villamos energia","gas":"Gáz","cost":"Költség","flow":"Előremenő","ret":"Visszatérő","pressure":"Nyomás","mod":"Moduláció","delta":"ΔT","lowp":"Alacsony nyomás","highp":"Magas nyomás","hotf":"Előremenő túl forró"},"it":{"name":"Caldaia a gas","off":"Spenta","standby":"Stand-by","heating":"Riscaldamento","dhw":"Acqua calda","alarm":"Guasto","power":"Elettrica","energy":"Energia elettr.","gas":"Gas","cost":"Costo","flow":"Mandata","ret":"Ritorno","pressure":"Pressione","mod":"Modulazione","delta":"ΔT","lowp":"Pressione bassa","highp":"Pressione alta","hotf":"Mandata troppo calda"},"nb":{"name":"Gasskjel","off":"Av","standby":"Hvilemodus","heating":"Varmer","dhw":"Varmtvann","alarm":"Feil","power":"Elektrisk","energy":"Elektr. energi","gas":"Gass","cost":"Kostnad","flow":"Tur","ret":"Retur","pressure":"Trykk","mod":"Modulering","delta":"ΔT","lowp":"Lavt trykk","highp":"Høyt trykk","hotf":"For varm tur"},"nl":{"name":"Gasketel","off":"Uit","standby":"Stand-by","heating":"Verwarmen","dhw":"Warm water","alarm":"Storing","power":"Elektrisch","energy":"Elek. energie","gas":"Gas","cost":"Kost","flow":"Aanvoer","ret":"Retour","pressure":"Druk","mod":"Modulatie","delta":"ΔT","lowp":"Lage druk","highp":"Hoge druk","hotf":"Aanvoer te heet"},"pl":{"name":"Kocioł gazowy","off":"Wył.","standby":"Czuwanie","heating":"Grzanie","dhw":"Gorąca woda","alarm":"Usterka","power":"Prąd","energy":"Energia el.","gas":"Gaz","cost":"Koszt","flow":"Zasilanie","ret":"Powrót","pressure":"Ciśnienie","mod":"Modulacja","delta":"ΔT","lowp":"Niskie ciśnienie","highp":"Wysokie ciśnienie","hotf":"Zasilanie za gorące","outdoor":"Na zewnątrz","room":"Pokój","setpoint":"Temperatura zadana"},"pt-BR":{"name":"Caldeira a gás","off":"Desligado","standby":"Em espera","heating":"Aquecendo","dhw":"Água quente","alarm":"Falha","power":"Elétrica","energy":"Energia elét.","gas":"Gás","cost":"Custo","flow":"Saída","ret":"Retorno","pressure":"Pressão","mod":"Modulação","delta":"ΔT","lowp":"Pressão baixa","highp":"Pressão alta","hotf":"Temperatura de saída excessiva","outdoor":"Exterior","room":"Ambiente","setpoint":"Temp. desejada"},"pt-PT":{"name":"Caldeira a gás","off":"Desligado","standby":"Em espera","heating":"A aquecer","dhw":"Água quente","alarm":"Avaria","power":"Elétrica","energy":"Energia elét.","gas":"Gás","cost":"Custo","flow":"Ida","ret":"Retorno","pressure":"Pressão","mod":"Modulação","delta":"ΔT","lowp":"Pressão baixa","highp":"Pressão alta","hotf":"Temperatura de ida excessiva","outdoor":"Exterior","room":"Divisão","setpoint":"Temp. pretendida"},"ro":{"name":"Centrală pe gaz","off":"Oprită","standby":"Standby","heating":"Încălzire","dhw":"Apă caldă","alarm":"Defecțiune","power":"Electric","energy":"Energie el.","gas":"Gaz","cost":"Cost","flow":"Tur","ret":"Retur","pressure":"Presiune","mod":"Modulare","delta":"ΔT","lowp":"Presiune scăzută","highp":"Presiune ridicată","hotf":"Tur prea cald"},"ru":{"name":"Газовый котёл","off":"Выкл.","standby":"Ожидание","heating":"Нагрев","dhw":"Горячая вода","alarm":"Неисправность","power":"Электричество","energy":"Эл. энергия","gas":"Газ","cost":"Стоимость","flow":"Подача","ret":"Обратка","pressure":"Давление","mod":"Модуляция","delta":"ΔT","lowp":"Низкое давление","highp":"Высокое давление","hotf":"Подача слишком горячая","outdoor":"Улица","room":"Комната","setpoint":"Уставка"},"sr":{"name":"Гасни котао","off":"Искључено","standby":"Приправност","heating":"Грејање","dhw":"Топла вода","alarm":"Квар","power":"Струја","energy":"Ел. енергија","gas":"Гас","cost":"Трошак","flow":"Полазни вод","ret":"Повратни вод","pressure":"Притисак","mod":"Модулација","delta":"ΔT","lowp":"Низак притисак","highp":"Висок притисак","hotf":"Полаз преврућ"},"sr-Latn":{"name":"Gasni kotao","off":"Isključeno","standby":"Pripravnost","heating":"Grejanje","dhw":"Topla voda","alarm":"Kvar","power":"Struja","energy":"El. energija","gas":"Gas","cost":"Trošak","flow":"Polazni vod","ret":"Povratni vod","pressure":"Pritisak","mod":"Modulacija","delta":"ΔT","lowp":"Nizak pritisak","highp":"Visok pritisak","hotf":"Polaz prevruć"},"uk":{"name":"Газовий котел","off":"Вимк.","standby":"Режим очікування","heating":"Нагрівання","dhw":"Гаряча вода","alarm":"Несправність","power":"Електрика","energy":"Ел. енергія","gas":"Газ","cost":"Вартість","flow":"Подача","ret":"Зворот","pressure":"Тиск","mod":"Модуляція","delta":"ΔT","lowp":"Низький тиск","highp":"Високий тиск","hotf":"Подача надто гаряча","outdoor":"Надворі","room":"Кімната","setpoint":"Уставка"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--gb-heat:var(--appliance-heat-color,#ff8a3d);--gb-cold:var(--appliance-cold-color,#2b9af9);
  --gb-alert:var(--appliance-alert-color,#db4437);--gb-ok:var(--appliance-ok-color,#43a047);--gb-flow:#3b8fe8;--gb-ret:#3b8fe8;--mod:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--gb-heat) 22%,transparent);color:var(--gb-heat)}
.dhw .badge{background:color-mix(in srgb,var(--gb-cold) 22%,transparent);color:var(--gb-cold)}
.alarm .badge{background:color-mix(in srgb,var(--gb-alert) 22%,transparent);color:var(--gb-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--gb-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- illustration ---- */
.flame{transform-box:fill-box;transform-origin:50% 100%;opacity:0;transform:scaleY(.1)}
.burning .flame{opacity:1;transform:scaleY(calc(.45 + .55*var(--mod)));animation:flick .45s ease-in-out infinite alternate}
.burning .flame:nth-child(odd){animation-duration:.33s;animation-delay:-.1s}
.burning .flame:nth-child(3n){animation-duration:.52s;animation-delay:-.2s}
@keyframes flick{0%{transform:scaleY(calc(.45 + .55*var(--mod)))}100%{transform:scaleY(calc(.3 + .5*var(--mod))) scaleX(1.12)}}
.glow{opacity:0;transition:opacity .6s}
.burning .glow{opacity:calc(.35 + .45*var(--mod));animation:pulse 1.6s ease-in-out infinite alternate}
@keyframes pulse{to{opacity:calc(.2 + .35*var(--mod))}}
.puff{opacity:0;transform-box:fill-box;transform-origin:center}
.burning .puff{animation:rise 3.2s ease-out infinite}
.burning .puff:nth-child(2){animation-delay:-1.1s}.burning .puff:nth-child(3){animation-delay:-2.1s}
@keyframes rise{0%{opacity:0;transform:translate(0,8px) scale(.5)}20%{opacity:.7}100%{opacity:0;transform:translate(10px,-34px) scale(1.9)}}
.dash{stroke-dasharray:3 8;opacity:0}
.pump .dash.ch,.burning .dash.gas,.dhw .dash.dhw{opacity:.9}
.dash.down{animation:dd 1s linear infinite}
.dash.up{animation:du 1s linear infinite}
@keyframes dd{to{stroke-dashoffset:-11}}
@keyframes du{to{stroke-dashoffset:11}}
.noanim *{animation:none!important}
.noanim .flame{transform:scaleY(calc(.45 + .55*var(--mod)))}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.dhw .led{fill:#3fa3ff}.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:blink .8s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 15px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}

/* ---- modèle photo ---- */
.photo svg{max-width:calc(100% * var(--illus-scale,.75))}
.pv-led{fill:#27e052;opacity:0}.standby .pv-led,.heating .pv-led,.dhw .pv-led{opacity:1}.standby .pv-led{opacity:.55}.alarm .pv-led{fill:#ff3b30;opacity:1;animation:blink .8s steps(2) infinite}
.pv-leaf-on{fill:#27e052;stroke:#27e052}.pv-leaf-off{fill:#2c3a30;stroke:#2c3a30}
.pv-d{stroke-dasharray:2 52;opacity:0}
.heating .pv-heat,.dhw .pv-dhw{opacity:.95}
.pv-fw{animation:pvfw 1.3s linear infinite}.pv-dn{animation:pvfw 1.3s linear infinite}.pv-up{animation:pvup 1.3s linear infinite}
@keyframes pvfw{to{stroke-dashoffset:-54}}@keyframes pvup{to{stroke-dashoffset:54}}
.pv-sp{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.burning .pv-sp{animation:pvrise 3.6s ease-out infinite}.burning .pv-sp:nth-child(2){animation-delay:-1.2s}.burning .pv-sp:nth-child(3){animation-delay:-2.4s}
@keyframes pvrise{0%{opacity:0;transform:translate(0,30px) scale(.5)}25%{opacity:.8}100%{opacity:0;transform:translate(30px,-110px) scale(1.7)}}
#pv-pbg{fill:rgba(8,12,18,.82);stroke:#43a047;stroke-width:3}.pv-plow #pv-pbg{stroke:#db4437}
#pv-pv{fill:#fff;font:600 30px Roboto,system-ui,sans-serif}.pv-plow #pv-pv{fill:#ffb4ab}
.noanim .pv-d,.noanim .pv-sp{animation:none!important}
.needle{transform-origin:172px 66px;transition:transform .8s}
.off .body-shade{opacity:.55}
`;

  const SVG = `
<svg viewBox="0 0 240 212" role="img" aria-label="gas boiler">
 <defs>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe6"/></linearGradient>
  <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1239ff"/><stop offset=".5" stop-color="#3fa3ff"/><stop offset="1" stop-color="#c9f2ff"/></linearGradient>
  <radialGradient id="gl" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="#4aa8ff" stop-opacity=".85"/><stop offset=".6" stop-color="#2b6cff" stop-opacity=".25"/><stop offset="1" stop-color="#2b6cff" stop-opacity="0"/></radialGradient>
  <linearGradient id="cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e59a5a"/><stop offset="1" stop-color="#a45a28"/></linearGradient>
 </defs>
 <!-- conduit de fumées -->
 <rect x="112" y="8" width="16" height="36" rx="2" fill="#cdd3da" stroke="#9aa3ad" stroke-width="1"/>
 <rect x="108" y="4" width="24" height="7" rx="2" fill="#b4bcc5" stroke="#8f98a3" stroke-width="1"/>
 <g fill="#e8eef4"><circle class="puff" cx="120" cy="6" r="5"/><circle class="puff" cx="118" cy="6" r="4"/><circle class="puff" cx="123" cy="6" r="4.5"/></g>
 <!-- caisson -->
 <rect x="48" y="42" width="144" height="116" rx="11" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="44" y="40" width="152" height="116" rx="11" fill="url(#body)" stroke="#aeb6c0" stroke-width="1.2"/>
 <!-- bandeau de commande -->
 <rect x="56" y="48" width="70" height="26" rx="5" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="91" y="67" id="dsp">--</text>
 <circle class="led" cx="136" cy="55" r="3.4"/>
 <circle cx="138" cy="67" r="4.5" fill="#c8cfd7" stroke="#9aa3ad"/><circle cx="152" cy="67" r="4.5" fill="#c8cfd7" stroke="#9aa3ad"/>
 <!-- manomètre -->
 <circle cx="172" cy="66" r="15" fill="#f6f8fa" stroke="#9aa3ad" stroke-width="1.4"/>
 <path d="M160.5 73 A13 13 0 0 1 183.5 73" fill="none" stroke="#e1e5ea" stroke-width="3"/>
 <path id="okarc" d="M165 63 A13 13 0 0 1 179 63" fill="none" stroke="#43a047" stroke-width="3" stroke-linecap="round"/>
 <line class="needle" id="needle" x1="172" y1="66" x2="172" y2="55" stroke="#db4437" stroke-width="1.8" stroke-linecap="round"/>
 <circle cx="172" cy="66" r="2.2" fill="#444"/>
 <!-- fenêtre de combustion -->
 <rect x="56" y="82" width="128" height="62" rx="7" fill="#0f1620" stroke="#2a3340" stroke-width="1.5"/>
 <!-- échangeur cuivre -->
 <g fill="none" stroke="url(#cu)" stroke-width="3" stroke-linecap="round" opacity=".95">
  <path d="M66 90 H174"/><path d="M66 97 H174"/><path d="M66 104 H174"/>
 </g>
 <g stroke="#e5a468" stroke-width="1" opacity=".6"><path d="M70 88 v18 M82 88 v18 M94 88 v18 M106 88 v18 M118 88 v18 M130 88 v18 M142 88 v18 M154 88 v18 M166 88 v18"/></g>
 <rect class="glow" x="56" y="82" width="128" height="62" rx="7" fill="url(#gl)"/>
 <!-- rampe de brûleur + flammes -->
 <g id="flames"></g>
 <rect x="66" y="130" width="108" height="8" rx="3" fill="#6a7480" stroke="#4a535e"/>
 <g fill="#2a323b" id="ports"></g>
 <path d="M62 86 L84 86 L62 108Z" fill="#fff" opacity=".07"/>
 <!-- platine -->
 <rect x="44" y="156" width="152" height="9" rx="3" fill="#aab3bd"/>
 <!-- tuyauteries -->
 <g stroke-linecap="round">
  <line x1="62" y1="165" x2="62" y2="202" style="stroke:var(--gb-flowc,#3b8fe8)" stroke-width="8"/>
  <line x1="91" y1="165" x2="91" y2="202" stroke="#f0883e" stroke-width="8"/>
  <line x1="120" y1="165" x2="120" y2="202" stroke="#f5c518" stroke-width="8"/>
  <line x1="149" y1="165" x2="149" y2="202" stroke="#3b8fe8" stroke-width="8"/>
  <line x1="178" y1="165" x2="178" y2="202" style="stroke:var(--gb-retc,#3b8fe8)" stroke-width="8"/>
 </g>
 <g fill="#8c95a0"><rect x="57" y="172" width="10" height="5" rx="1"/><rect x="86" y="172" width="10" height="5" rx="1"/><rect x="115" y="172" width="10" height="5" rx="1"/><rect x="144" y="172" width="10" height="5" rx="1"/><rect x="173" y="172" width="10" height="5" rx="1"/></g>
 <g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">
  <line class="dash ch down" x1="62" y1="167" x2="62" y2="200"/>
  <line class="dash dhw down" x1="91" y1="167" x2="91" y2="200"/>
  <line class="dash gas up" x1="120" y1="200" x2="120" y2="167"/>
  <line class="dash dhw up" x1="149" y1="200" x2="149" y2="167"/>
  <line class="dash ch up" x1="178" y1="200" x2="178" y2="167"/>
 </g>
</svg>`;


  /* ---- modèle photo : Vaillant ecoTEC plus (scène entière 1024 × 1536, coordonnées de la photo) ----
   * Calques : écran (température de départ, extérieur, heure, feuille), tuyaux animés (circuit rouge, eau chaude, eau froide, retour),
   * panache de condensation au-dessus du conduit, barre de LED du boîtier mural, pression au-dessus du vase d'expansion. */
  const VAILLANT_IMG = window.__acImg("gas-boiler",0);
  const VAILLANT = `
<svg viewBox="0 -130 1024 1666" role="img" aria-label="Vaillant ecoTEC plus" class="pv">
 <defs><clipPath id="pv-clip"><rect x="0" y="0" width="1024" height="1536" rx="40"/></clipPath>
  <radialGradient id="pv-puff"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
 <g class="pv-steam"><circle class="pv-sp" cx="490" cy="0" r="58" fill="url(#pv-puff)"/><circle class="pv-sp" cx="520" cy="0" r="50" fill="url(#pv-puff)"/><circle class="pv-sp" cx="500" cy="0" r="64" fill="url(#pv-puff)"/></g>
 <image href="${VAILLANT_IMG}" width="1024" height="1536" clip-path="url(#pv-clip)"/>
 <g clip-path="url(#pv-clip)">
  <!-- boîtier mural : barre de LED -->
  <rect x="114" y="759" width="106" height="9" rx="4.5" fill="#b9bcc4" stroke="#7b7f88" stroke-width="1.2"/>
  <rect id="pv-led" class="pv-led" x="115.5" y="760.5" width="0" height="6" rx="3"/>
  <!-- écran -->
  <g id="pv-screen">
   <rect x="446" y="770" width="132" height="26" fill="#000"/><rect x="480" y="796" width="70" height="42" fill="#02060a"/><rect x="418" y="800" width="34" height="30" fill="#02060a"/>
   <g id="pv-top" fill="#fff" font-family="Roboto,system-ui,sans-serif" font-size="15" font-weight="500">
    <g id="pv-out"><path d="M455 774v9.5a3.8 3.8 0 1 0 3.6 0V774a1.8 1.8 0 0 0-3.6 0z" fill="none" stroke="#fff" stroke-width="1.5"/><text id="pv-outv" x="463" y="788">--</text></g>
    <g id="pv-clk"><circle cx="527" cy="780.5" r="6" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M527 777v4l2.8 1.6" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><text id="pv-time" x="536" y="788">--:--</text></g>
   </g>
   <text id="pv-val" x="525" y="829" text-anchor="end" fill="#fff" font-family="Roboto,system-ui,sans-serif" font-size="40" font-weight="500">--</text>
   <text id="pv-unit" x="528" y="812" fill="#fff" font-family="Roboto,system-ui,sans-serif" font-size="17">°C</text>
   <path id="pv-leaf" d="M432.5 826c-8-8-9-15 8-19 2 11-1 17-8 19zM430 828l6-9" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>
  </g>
  <!-- tuyaux : flux animés -->
  <g class="pv-flow" fill="none" stroke-linecap="round">
   <path class="pv-d pv-heat pv-fw" d="M673 1010V1030Q673 1070 713 1070H833Q873 1070 873 1030V725" stroke="#ffe0c2" stroke-width="10"/>
   <path class="pv-d pv-dhw pv-dn" d="M523 1238V1495" stroke="#ffd2c4" stroke-width="10"/>
   <path class="pv-d pv-dhw pv-up" d="M623 1470V1240" stroke="#9fd2ff" stroke-width="10"/>
   <path class="pv-d pv-heat pv-up" d="M358 1450V1050" stroke="#9fd2ff" stroke-width="10"/>
  </g>
  <!-- pression d'eau près du vase d'expansion -->
  <g id="pv-p" style="display:none"><rect id="pv-pbg" x="788" y="232" width="170" height="54" rx="27"/><text id="pv-pv" x="873" y="269" text-anchor="middle"></text></g>
 </g>
</svg>`.replace('__IMG__', '');

  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['gas', 'mdi:fire', 'show_gas'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps'],
    ['pressure', 'mdi:gauge', 'show_pressure'],
    ['mod', 'mdi:percent-circle', 'show_modulation'],
    ['outdoor', 'mdi:thermometer', 'show_temps'],
    ['room', 'mdi:home-thermometer', 'show_temps'],
    ['setpoint', 'mdi:target', 'show_temps'],
  ];

  class ApplianceGasBoilerCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/chaudiere|boiler|gaz|gas/i, 'climate') || f(/chaudiere|boiler|gaz|gas/i, 'sensor'),
        entity_power: f(/(chaudiere|boiler|gaz|gas).*(power|puissance)/i, 'sensor'),
        entity_gas: f(/(gaz|gas).*(conso|consum|m3|volume|daily|jour)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_gas: true, show_cost: true, show_temps: true,
        show_pressure: true, show_modulation: true, show_status: true, threshold: 15, off_threshold: 0.5,
        pressure_min: 1, pressure_max: 2.5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { return window.applianceWatts(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${this._photo() ? VAILLANT : SVG}
        <div class="alert" id="alert"></div>
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // flammes bleues sur la rampe : 11 becs
      const fl = root.getElementById('flames'); const ports = root.getElementById('ports');
      if (!fl) { window.applianceBindIllus(this, root.querySelector('svg'), () => { const c = this._c; window.applianceMore(this, c.entity_status || c.entity_power); }); this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._tick(); clearInterval(this._tm); this._tm = setInterval(() => this._tick(), 20000); return; }
      let f = '', p = '';
      for (let i = 0; i < 11; i++) {
        const x = 72 + i * 9.6;
        f += `<path class="flame" d="M${x} 130 C${x - 4} 124 ${x - 3.5} 117 ${x} 108 C${x + 3.5} 117 ${x + 4} 124 ${x} 130Z" fill="url(#fl)"/>`;
        p += `<rect x="${x - 2}" y="132" width="4" height="3" rx="1"/>`;
      }
      fl.innerHTML = f; ports.innerHTML = p;
      window.applianceBindIllus(this, root.querySelector('svg'), () => { const c = this._c; window.applianceMore(this, c.entity_status || c.entity_power); });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _photo() { return this._c && this._c.model === 'vaillant_ecotec_plus'; }
    disconnectedCallback() { clearInterval(this._tm); }
    // heure affichée sur l'écran de la chaudière (modèle photo)
    _tick() {
      const t = this._root && this._root.getElementById('pv-time'); if (!t) return;
      t.textContent = new Date().toLocaleTimeString(window.applianceLocale(this._c, this._hass), { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      // état et hvac_action lus séparément : « heat » + « idle » ne doit pas donner « chauffe »
      let txt = '', act = '';
      if (stObj) {
        txt = String(stObj.state).toLowerCase();
        const a = stObj.attributes || {};
        if (a.hvac_action) act = String(a.hvac_action).toLowerCase();
      }
      const flameEnt = this._st(c.entity_flame);
      const flame = flameEnt ? flameEnt.state === 'on' : null;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      // hvac_action présent : il prime (heating / preheating → chauffe, off → arrêt, idle et autres → veille ; flamme allumée → chauffe)
      else if (act) {
        if (/^(pre)?heating$/.test(act) || flame === true) st = /dhw|ecs|hot.?water|eau chaude|sanitaire|water_heat/.test(txt) ? 'dhw' : 'heating';
        else if (act === 'off' || /unavailable|unknown|^off$/.test(txt)) st = 'off';
        else st = 'standby';
      }
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt) && flame !== true) st = 'off';
      else if (/dhw|ecs|hot.?water|eau chaude|sanitaire|water_heat/.test(txt)) st = 'dhw';
      else if (/heat|chauff|ignit|allum|burn|brûl|brul|running|^on/.test(txt) || flame === true) st = 'heating';
      else if (txt) st = 'standby';
      else if (flame === false) st = 'standby';
      else if (!isNaN(pw)) st = pw > c.threshold ? 'heating' : (pw > c.off_threshold ? 'standby' : 'off');
      else st = 'standby';
      if (flame === false && (st === 'heating' || st === 'dhw') && /standby|idle|veille/.test(txt)) st = 'standby';
      const burning = st === 'heating' || st === 'dhw';
      const pump = burning || (!isNaN(pw) && pw > c.threshold);
      return { st, burning, pump, pw };
    }

    // modèle photo : écran (départ, extérieur, heure), feuille, LED du boîtier mural, pression près du vase
    _renderPhoto({ st, burning, flow, press, mod, tc }) {
      const c = this._c, r = this._root, $ = (id) => r.getElementById(id);
      const off = st === 'off', t1 = (v) => (isNaN(v) ? '--' : this._fmt(v, 1));
      $('pv-val').textContent = off ? '--' : isNaN(flow) ? '--' : String(Math.round(flow));
      $('pv-unit').textContent = tc.unit;
      const out = tc.conv(this._num(c.entity_outdoor_temp), this._st(c.entity_outdoor_temp));
      $('pv-out').style.display = c.entity_outdoor_temp && !isNaN(out) ? '' : 'none';
      $('pv-outv').textContent = `${t1(out)}${tc.unit}`;
      const leaf = $('pv-leaf'); leaf.setAttribute('class', burning ? 'pv-leaf-on' : 'pv-leaf-off');
      // barre de LED : pleine selon la modulation quand le brûleur tourne, tiers en veille, rouge clignotante en défaut
      const led = $('pv-led'); led.setAttribute('width', String(st === 'off' ? 0 : st === 'alarm' ? 103 : burning ? Math.round(103 * (0.35 + 0.65 * mod)) : 35));
      const pe = $('pv-p'); const has = c.entity_pressure && !isNaN(press) && c.show_pressure !== false;
      pe.style.display = has ? '' : 'none';
      if (has) { $('pv-pv').textContent = `${this._fmt(press, 1)} bar`; pe.setAttribute('class', press < c.pressure_min || press > c.pressure_max ? 'pv-plow' : ''); }
      this._tick();
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, h = this._hass, card = this._card, r = this._root;
      const { st, burning, pump, pw } = this._compute();
      // températures dans l'unité d'affichage (°C / °F) ; flow_temp_max par défaut : 80 °C
      const tc = window.applianceTemp(h, c), tv = (id) => tc.conv(this._num(id), this._st(id));
      const flow = tv(c.entity_flow_temp), ret = tv(c.entity_return_temp), flowMax = c.flow_temp_max ?? tc.c(80);
      const press = this._num(c.entity_pressure);
      // modulation indisponible : animation à 100 % mais tuile « -- »
      const modV = this._num(c.entity_modulation);
      const mod = isNaN(modV) ? 1 : Math.max(0, Math.min(100, modV)) / 100;
      card.className = `${st} ${burning ? 'burning' : ''} ${pump ? 'pump' : ''} ${c.animations === false ? 'noanim' : ''} ${this._photo() ? 'photo' : ''}`;
      card.style.setProperty('--mod', mod);
      // couleur des tuyaux : bleu à 25 °C, rouge à 75 °C
      const pipe = (t, d) => isNaN(t) ? d : `color-mix(in srgb, #e5392b ${Math.round(Math.max(0, Math.min(1, (tc.toC(t) - 25) / 50)) * 100)}%, #3b8fe8)`;
      card.style.setProperty('--gb-flowc', pipe(flow, '#e5533d'));
      card.style.setProperty('--gb-retc', pipe(ret, '#3b8fe8'));

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      if (this._photo()) this._renderPhoto({ st, burning, flow, press, mod, tc });
      else {
      const dsp = !isNaN(flow) && st !== 'off' ? `${Math.round(flow)}°` : (st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : st === 'dhw' ? 'ECS' : st === 'heating' ? 'CH' : '--');
      r.getElementById('dsp').textContent = dsp;

      // manomètre : 0–4 bar sur 180°, zone verte = pressure_min..pressure_max
      const ang = (p) => -90 + Math.max(0, Math.min(4, p)) / 4 * 180;
      r.getElementById('needle').style.transform = `rotate(${isNaN(press) ? -90 : ang(press)}deg)`;
      const pt = (p) => { const a = (ang(p) - 90) * Math.PI / 180; return [172 + 13 * Math.cos(a), 66 + 13 * Math.sin(a)]; };
      const [x1, y1] = pt(c.pressure_min), [x2, y2] = pt(c.pressure_max);
      r.getElementById('okarc').setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A13 13 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);
      }

      // alertes
      let al = '';
      if (!isNaN(press) && press < c.pressure_min) al = `${this._t('lowp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(press) && press > c.pressure_max) al = `${this._t('highp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(flow) && flow > flowMax) al = this._t('hotf');
      const ae = r.getElementById('alert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy), gas = this._num(c.entity_gas);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, '€');
      if (isNaN(cost) && c.price_per_unit && !isNaN(gas)) { cost = gas * Number(c.price_per_unit); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        gas: [c.entity_gas, this._fmt(gas, 2), this._unit(c.entity_gas, 'm³')],
        cost: [c.entity_cost || (c.price_per_unit && c.entity_gas), this._fmt(cost, 2), costU],
        flow: [c.entity_flow_temp, this._fmt(flow, 1), tc.unit],
        ret: [c.entity_return_temp, this._fmt(ret, 1), tc.unit],
        pressure: [c.entity_pressure, this._fmt(press, 2), 'bar'],
        mod: [c.entity_modulation, this._fmt(isNaN(modV) ? NaN : mod * 100, 0), '%'],
        outdoor: [c.entity_outdoor_temp, this._fmt(tv(c.entity_outdoor_temp), 1), tc.unit],
        room: [c.entity_room_temp, this._fmt(tv(c.entity_room_temp), 1), tc.unit],
        setpoint: [c.entity_room_target, this._fmt(tv(c.entity_room_target), 1), tc.unit],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = ent; if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceGasBoilerCard);

  /* ---- éditeur visuel ---- */
  class ApplianceGasBoilerCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Dessin / Drawing' }, { value: 'vaillant_ecotec_plus', label: 'Vaillant ecoTEC plus (photo)' }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_status'), ent('entity_flame', 'binary_sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_gas', 'sensor'), ent('entity_cost', 'sensor'), { name: 'price_per_unit', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_pressure', 'sensor'), ent('entity_modulation', 'sensor'),
        ent('entity_outdoor_temp', 'sensor'), ent('entity_room_temp', 'sensor'), ent('entity_room_target', 'sensor'),
        { type: 'grid', name: '', schema: [
          { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
        ] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_gas', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true }, { name: 'show_temps', selector: { boolean: {} }, default: true },
          { name: 'show_pressure', selector: { boolean: {} }, default: true }, { name: 'show_modulation', selector: { boolean: {} }, default: true },
          { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceGasBoilerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Chaudière gaz / Gas boiler', names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Chaudière gaz animée : flamme, départ/retour, ECS, pression, conso élec et gaz.', preview: true,
  });
})();
