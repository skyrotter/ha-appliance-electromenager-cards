/* Cartes « Lumières » — douze luminaires animés qui partagent ce fichier
 * custom:appliance-light-bulb-card, -color-bulb-, -filament-bulb-, -pendant-light-, -pendant-cluster-,
 * -desk-lamp-, -floor-lamp-, -chandelier-, -garden-spotlight-, -christmas-tree-, -ceiling-spot-, -ceiling-globe-card.
 * Spots encastrés (#213) : 1 à 4 spots (option spot_count) pilotés par la même entité, allumage en cascade.
 * La couleur de la lumière (--lc) vient de l'ampoule dans Home Assistant (rgb_color, sinon température
 * de blanc en kelvins) ou de l'option `color` ; l'intensité de la lueur (--b) suit la luminosité.
 * Entité light (Allumer / Éteindre, et Couleur pour l'ampoule couleur), switch ou input_boolean.
 */
(() => {
  if (customElements.get('appliance-light-bulb-card')) return;

  const T = {"en":{"white_warm":"Warm white","white_neutral":"Neutral white","white_cold":"Cold white","light_bulb":"Bulb","color_bulb":"Colour bulb","filament_bulb":"Filament bulb","pendant_light":"Pendant light","pendant_cluster":"Pendant cluster","desk_lamp":"Desk lamp","floor_lamp":"Floor lamp","chandelier":"Chandelier","garden_spotlight":"Garden spotlight","christmas_tree":"Christmas tree","on":"On","off":"Off","unavailable":"Unavailable","turn_on":"On","turn_off":"Off","color":"Colour","brightness":"Brightness","power":"Power","energy":"Energy","ceiling_spot":"Recessed spotlights","ceiling_globe":"Ceiling globe light","slider_bottom":"Below the bulb","slider_left":"Left","slider_right":"Right"},"cs":{"ceiling_globe":"Stropní svítidlo koule","light_bulb":"Žárovka","color_bulb":"Barevná žárovka","filament_bulb":"Filamentová žárovka","pendant_light":"Závěsné svítidlo","pendant_cluster":"Závěsný lustr (shluk)","desk_lamp":"Stolní lampa","floor_lamp":"Stojací lampa","chandelier":"Lustr","garden_spotlight":"Zahradní reflektor","christmas_tree":"Vánoční stromek","on":"Zapnuto","off":"Vypnuto","unavailable":"Nedostupné","turn_on":"Zap","turn_off":"Vyp","color":"Barva","brightness":"Jas","power":"Výkon","energy":"Energie","ceiling_spot":"Zápustné bodovky"},"da":{"ceiling_globe":"Loftlampe kugle","light_bulb":"Pære","color_bulb":"Farvepære","filament_bulb":"Filamentpære","pendant_light":"Pendel","pendant_cluster":"Pendelklynge","desk_lamp":"Skrivebordslampe","floor_lamp":"Gulvlampe","chandelier":"Lysekrone","garden_spotlight":"Havespot","christmas_tree":"Juletræ","on":"Tændt","off":"Slukket","unavailable":"Utilgængelig","turn_on":"Tænd","turn_off":"Sluk","color":"Farve","brightness":"Lysstyrke","power":"Effekt","energy":"Energi","ceiling_spot":"Indbygningsspots"},"de":{"ceiling_globe":"Deckenleuchte Kugel","light_bulb":"Glühbirne","color_bulb":"Farbige Glühbirne","filament_bulb":"Filament-Glühbirne","pendant_light":"Pendelleuchte","pendant_cluster":"Pendelleuchten-Gruppe","desk_lamp":"Schreibtischlampe","floor_lamp":"Stehlampe","chandelier":"Kronleuchter","garden_spotlight":"Gartenstrahler","christmas_tree":"Weihnachtsbaum","on":"An","off":"Aus","unavailable":"Nicht verfügbar","turn_on":"Ein","turn_off":"Aus","color":"Farbe","brightness":"Helligkeit","power":"Leistung","energy":"Energie","ceiling_spot":"Einbaustrahler","slider_bottom":"Unter der Glühbirne","slider_left":"Links","slider_right":"Rechts"},"es":{"ceiling_globe":"Plafón globo","white_warm":"Blanco cálido","white_neutral":"Blanco neutro","white_cold":"Blanco frío","light_bulb":"Bombilla","color_bulb":"Bombilla de color","filament_bulb":"Bombilla de filamento","pendant_light":"Lámpara colgante","pendant_cluster":"Conjunto de colgantes","desk_lamp":"Lámpara de escritorio","floor_lamp":"Lámpara de pie","chandelier":"Lámpara de araña","garden_spotlight":"Foco de jardín","christmas_tree":"Árbol de Navidad","on":"Encendida","off":"Apagada","unavailable":"No disponible","turn_on":"Encender","turn_off":"Apagar","color":"Color","brightness":"Brillo","power":"Potencia","energy":"Energía","ceiling_spot":"Focos empotrados","slider_bottom":"Debajo de la bombilla","slider_left":"Izquierda","slider_right":"Derecha"},"fr":{"white_warm":"Blanc chaud","white_neutral":"Blanc neutre","white_cold":"Blanc froid","light_bulb":"Ampoule","color_bulb":"Ampoule couleur","filament_bulb":"Ampoule à filament","pendant_light":"Suspension","pendant_cluster":"Suspensions en grappe","desk_lamp":"Lampe de bureau","floor_lamp":"Lampadaire","chandelier":"Lustre","garden_spotlight":"Spot de jardin","christmas_tree":"Sapin de Noël","on":"Allumée","off":"Éteinte","unavailable":"Indisponible","turn_on":"Allumer","turn_off":"Éteindre","color":"Couleur","brightness":"Luminosité","power":"Puissance","energy":"Énergie","ceiling_spot":"Spots encastrés","ceiling_globe":"Plafonnier globe","slider_bottom":"Sous l'ampoule","slider_left":"Gauche","slider_right":"Droite"},"hu":{"ceiling_globe":"Mennyezeti gömblámpa","light_bulb":"Izzó","color_bulb":"Színes izzó","filament_bulb":"Filament izzó","pendant_light":"Függesztett lámpa","pendant_cluster":"Függesztett csoport","desk_lamp":"Asztali lámpa","floor_lamp":"Állólámpa","chandelier":"Csillár","garden_spotlight":"Kerti spotlámpa","christmas_tree":"Karácsonyfa","on":"Be","off":"Ki","unavailable":"Nem elérhető","turn_on":"Be","turn_off":"Ki","color":"Szín","brightness":"Fényerő","power":"Teljesítmény","energy":"Energia","ceiling_spot":"Süllyesztett spotok"},"it":{"ceiling_globe":"Plafoniera globo","light_bulb":"Lampadina","color_bulb":"Lampadina a colori","filament_bulb":"Lampadina a filamento","pendant_light":"Lampada a sospensione","pendant_cluster":"Sospensioni a grappolo","desk_lamp":"Lampada da scrivania","floor_lamp":"Lampada da terra","chandelier":"Lampadario","garden_spotlight":"Faretto da giardino","christmas_tree":"Albero di Natale","on":"Accesa","off":"Spenta","unavailable":"Non disponibile","turn_on":"Accendi","turn_off":"Spegni","color":"Colore","brightness":"Luminosità","power":"Potenza","energy":"Energia","ceiling_spot":"Faretti a incasso"},"nb":{"ceiling_globe":"Taklampe kule","light_bulb":"Lyspære","color_bulb":"Fargepære","filament_bulb":"Glødetrådpære","pendant_light":"Taklampe","pendant_cluster":"Taklampeklynge","desk_lamp":"Skrivebordslampe","floor_lamp":"Gulvlampe","chandelier":"Lysekrone","garden_spotlight":"Hagespot","christmas_tree":"Juletre","on":"På","off":"Av","unavailable":"Utilgjengelig","turn_on":"På","turn_off":"Av","color":"Farge","brightness":"Lysstyrke","power":"Effekt","energy":"Energi","ceiling_spot":"Innfelte spotter"},"nl":{"ceiling_globe":"Plafondlamp bol","light_bulb":"Lamp","color_bulb":"Kleurenlamp","filament_bulb":"Filamentlamp","pendant_light":"Hanglamp","pendant_cluster":"Hanglampen-cluster","desk_lamp":"Bureaulamp","floor_lamp":"Staande lamp","chandelier":"Kroonluchter","garden_spotlight":"Tuinspot","christmas_tree":"Kerstboom","on":"Aan","off":"Uit","unavailable":"Niet beschikbaar","turn_on":"Aan","turn_off":"Uit","color":"Kleur","brightness":"Helderheid","power":"Vermogen","energy":"Energie","ceiling_spot":"Inbouwspots"},"pl":{"ceiling_globe":"Plafon kula","light_bulb":"Żarówka","color_bulb":"Żarówka kolorowa","filament_bulb":"Żarówka żarnikowa","pendant_light":"Lampa wisząca","pendant_cluster":"Zespół lamp wiszących","desk_lamp":"Lampka biurkowa","floor_lamp":"Lampa podłogowa","chandelier":"Żyrandol","garden_spotlight":"Reflektor ogrodowy","christmas_tree":"Choinka","on":"Wł.","off":"Wył.","unavailable":"Niedostępny","turn_on":"Wł.","turn_off":"Wył.","color":"Kolor","brightness":"Jasność","power":"Moc","energy":"Energia","ceiling_spot":"Oprawy wpuszczane"},"pt-BR":{"ceiling_globe":"Plafon globo","white_warm":"Branco quente","white_neutral":"Branco neutro","white_cold":"Branco frio","light_bulb":"Lâmpada","color_bulb":"Lâmpada de cor","filament_bulb":"Lâmpada de filamento","pendant_light":"Luminária pendente","pendant_cluster":"Conjunto de luminárias pendentes","desk_lamp":"Luminária de mesa","floor_lamp":"Luminária de piso","chandelier":"Lustre","garden_spotlight":"Spot de jardim","christmas_tree":"Árvore de Natal","on":"Ligado","off":"Desligado","unavailable":"Indisponível","turn_on":"Ligado","turn_off":"Desligado","color":"Cor","brightness":"Brilho","power":"Potência","energy":"Energia","ceiling_spot":"Spots embutidos","slider_bottom":"Por baixo da lâmpada","slider_left":"Esquerda","slider_right":"Direita"},"pt-PT":{"ceiling_globe":"Candeeiro de teto globo","white_warm":"Branco quente","white_neutral":"Branco neutro","white_cold":"Branco frio","light_bulb":"Lâmpada","color_bulb":"Lâmpada de cor","filament_bulb":"Lâmpada de filamento","pendant_light":"Candeeiro suspenso","pendant_cluster":"Conjunto de candeeiros suspensos","desk_lamp":"Candeeiro de secretária","floor_lamp":"Candeeiro de pé","chandelier":"Lustre","garden_spotlight":"Foco de jardim","christmas_tree":"Árvore de Natal","on":"Ligado","off":"Desligado","unavailable":"Indisponível","turn_on":"Ligado","turn_off":"Desligado","color":"Cor","brightness":"Brilho","power":"Potência","energy":"Energia","ceiling_spot":"Focos embutidos","slider_bottom":"Por baixo da lâmpada","slider_left":"Esquerda","slider_right":"Direita"},"ro":{"ceiling_globe":"Plafonieră glob","light_bulb":"Bec","color_bulb":"Bec color","filament_bulb":"Bec cu filament","pendant_light":"Pendul","pendant_cluster":"Grup de pendule","desk_lamp":"Lampă de birou","floor_lamp":"Lampadar","chandelier":"Candelabru","garden_spotlight":"Spot de grădină","christmas_tree":"Brad de Crăciun","on":"Aprins","off":"Stins","unavailable":"Indisponibil","turn_on":"Aprinde","turn_off":"Stinge","color":"Culoare","brightness":"Luminozitate","power":"Putere","energy":"Energie","ceiling_spot":"Spoturi încastrate"},"ru":{"white_warm":"Тёплый белый","white_neutral":"Нейтральный белый","white_cold":"Холодный белый","light_bulb":"Лампа","color_bulb":"Цветная лампа","filament_bulb":"Филаментная лампа","pendant_light":"Подвесной светильник","pendant_cluster":"Группа подвесов","desk_lamp":"Настольная лампа","floor_lamp":"Торшер","chandelier":"Люстра","garden_spotlight":"Садовый прожектор","christmas_tree":"Ёлка","on":"Вкл.","off":"Выкл.","unavailable":"Недоступно","turn_on":"Вкл.","turn_off":"Выкл.","color":"Цвет","brightness":"Яркость","power":"Мощность","energy":"Энергия","ceiling_spot":"Встраиваемые светильники","ceiling_globe":"Потолочный светильник-шар","slider_bottom":"Под лампой","slider_left":"Слева","slider_right":"Справа"},"sr":{"ceiling_globe":"Плафоњера лопта","light_bulb":"Сијалица","color_bulb":"RGB сијалица","filament_bulb":"Едисон (Филамент) сијалица","pendant_light":"Висећи лустер","pendant_cluster":"Група висећих светиљки","desk_lamp":"Стона лампа","floor_lamp":"Подна лампа","chandelier":"Лустер","garden_spotlight":"Баштенски рефлектор","christmas_tree":"Новогодишња јелка","on":"Укључено","off":"Искључено","unavailable":"Недоступно","turn_on":"Укључено","turn_off":"Искључено","color":"Боја","brightness":"Осветљеност","power":"Снага","energy":"Енергија","ceiling_spot":"Уградни спотови"},"sr-Latn":{"ceiling_globe":"Plafonjera lopta","light_bulb":"Sijalica","color_bulb":"RGB sijalica","filament_bulb":"Edison (Filament) sijalica","pendant_light":"Viseći luster","pendant_cluster":"Grupa visećih svetiljki","desk_lamp":"Stona lampa","floor_lamp":"Podna lampa","chandelier":"Luster","garden_spotlight":"Baštenski reflektor","christmas_tree":"Novogodišnja jelka","on":"Uključeno","off":"Isključeno","unavailable":"Nedostupno","turn_on":"Uključeno","turn_off":"Isključeno","color":"Boja","brightness":"Osvetljenost","power":"Snaga","energy":"Energija","ceiling_spot":"Ugradni spotovi"},"uk":{"ceiling_globe":"Стельовий світильник-куля","white_warm":"Теплий білий","white_neutral":"Нейтральний білий","white_cold":"Холодний білий","light_bulb":"Лампочка","color_bulb":"Кольорова лампочка","filament_bulb":"Філаментна лампочка","pendant_light":"Підвісний світильник","pendant_cluster":"Група підвісних світильників","desk_lamp":"Настільна лампа","floor_lamp":"Торшер","chandelier":"Люстра","garden_spotlight":"Садовий прожектор","christmas_tree":"Ялинка","on":"Увімк.","off":"Вимк.","unavailable":"Недоступно","turn_on":"Увімк.","turn_off":"Вимк.","color":"Колір","brightness":"Яскравість","power":"Потужність","energy":"Енергія","ceiling_spot":"Вбудовані світильники","slider_bottom":"Під лампочкою","slider_left":"Ліворуч","slider_right":"Праворуч"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--lc:#ffb347;--b:1;--lt-ok:#f5c45e}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.on .badge{background:color-mix(in srgb,var(--lc) 26%,transparent);color:color-mix(in srgb,var(--lc) 75%,var(--primary-text-color))}
.stage.ph{background:none;border-radius:0}
/* image perso (option image) : la photo remplace le dessin ; éclairée selon la luminosité (--pb = --b x image_max, lueur --gb = --b x glow_max), avec une lueur de la couleur de l'ampoule */
.uph{position:relative;display:flex;align-items:center;justify-content:center;padding:6px 0}
.uph .glow{position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle,var(--lc,#ffd98a) 0%,transparent 68%);opacity:calc(var(--gb,0) * .75);filter:blur(16px);transition:opacity .4s}
.uph img{position:relative;display:block;max-width:100%;max-height:220px;zoom:var(--illus-scale,1);object-fit:contain;filter:brightness(calc(.4 + var(--pb,0) * .6)) saturate(calc(.55 + var(--pb,0) * .45)) drop-shadow(0 0 calc(var(--gb,0) * 12px) color-mix(in srgb,var(--lc,#ffd98a) calc(var(--gb,0) * 100%),transparent));transition:filter .4s}
.uph.pair img.on{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);opacity:var(--b,0);filter:drop-shadow(0 0 calc(var(--gb,0) * 12px) color-mix(in srgb,var(--lc,#ffd98a) 70%,transparent));transition:opacity .4s}
.uph.pair img.off{filter:none}
.compact .uph{height:100%}
.stage.ceil{background:radial-gradient(ellipse at 50% 45%,#4a5058,#2c3137 80%)}
.stage{position:relative;margin:4px auto 0;max-width:calc(240px * var(--illus-scale,1));border-radius:14px;background:radial-gradient(ellipse at 50% 55%,#1d232b,#12161b 75%);overflow:hidden;cursor:pointer}
svg{display:block;width:100%;height:auto;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:8px}
.ctl.hide,.ctl button.hide{display:none}
/* palette de couleurs (option color_palette) : teintes RGB et blancs chaud / neutre / froid, un clic = allume avec cette couleur */
.pal{display:none;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:8px}.pal.on{display:flex}
.pal button{width:24px;height:24px;padding:0;border-radius:50%;border:2px solid color-mix(in srgb,var(--primary-text-color) 22%,transparent);cursor:pointer;background:var(--sw);transition:transform .15s}
.pal button:hover{transform:scale(1.15)}.pal button.sel{border-color:var(--primary-text-color)}
.pal .sep{width:1px;background:color-mix(in srgb,var(--primary-text-color) 22%,transparent);margin:2px 0}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif);transition:background .3s,color .3s}
.ctl button.sel{background:var(--lt-ok);color:#2a2112}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.ico ha-icon{--mdc-icon-size:22px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
/* curseur de luminosité (brightness_slider) : posé dans la scène, sous l'ampoule, sans tuile en plus (gagne en hauteur) */
.sb{position:absolute;left:8%;right:8%;bottom:6px;display:none;align-items:center;gap:6px;padding:2px 9px;border-radius:12px;background:rgba(255,255,255,.14);backdrop-filter:blur(3px);cursor:default}
.stage.hasbs .sb{display:flex}
.sb .bs{flex:1 1 auto;min-width:0;margin:0;height:20px;accent-color:var(--lt-ok);cursor:pointer}
.sb .sv{flex:none;min-width:32px;text-align:right;font:600 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);color:#fff}
.sb.dim{opacity:.6}.sb.dim .bs{accent-color:#9aa0a6}
.compact .sb{bottom:3px;padding:0 6px}
/* slider_position left / right : curseur vertical sur le côté de la scène, on glisse vers le haut ou vers le bas */
.stage.sbl .sb,.stage.sbr .sb{top:12%;bottom:12%;left:auto;right:auto;width:30px;flex-direction:column;padding:8px 0 6px;gap:4px;border-radius:15px}
.stage.sbl .sb{left:6px}.stage.sbr .sb{right:6px}
.stage.sbl .sb .bs,.stage.sbr .sb .bs{writing-mode:vertical-lr;direction:rtl;-webkit-appearance:slider-vertical;appearance:slider-vertical;width:20px;height:auto;flex:1 1 auto;min-height:0}
.stage.sbl .sb .sv,.stage.sbr .sb .sv{order:-1;min-width:0;text-align:center;font-size:10px}
.compact .stage.sbl .sb,.compact .stage.sbr .sb{top:6%;bottom:6%;padding:5px 0 3px}

/* ---- compact : petits emplacements fixes (ex. 120 × 130 px) ; l'illustration prend la hauteur restante ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .stage{flex:1 1 auto;min-height:0;width:100%;max-width:none;margin-top:3px;border-radius:10px;display:flex;align-items:center;justify-content:center}
/* illustration_size s'applique aussi en compact : la scène garde sa place, le dessin est réduit et centré */
.compact svg{width:calc(100% * min(1, var(--illus-scale,1)));height:calc(100% * min(1, var(--illus-scale,1)))}
.compact .ctl{flex:none;gap:4px;margin-top:4px}
.compact .ctl button{padding:3px;border-radius:8px;font-size:11px;line-height:14px}
.compact .ctl button ha-icon{--mdc-icon-size:14px}
.compact .ctl button.ico ha-icon{--mdc-icon-size:18px}
.compact .tiles{flex:none;gap:4px;margin-top:4px}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}

/* ---- commun : tout ce qui éclaire ne se voit qu'allumé, à proportion de la luminosité ---- */
.lit{opacity:0;transition:opacity .8s}
.on .lit{opacity:calc(var(--b) * var(--k,1))}
.lcf{fill:var(--lc)}.lcs{stroke:var(--lc)}
.halo{transform-box:fill-box;transform-origin:center}
.on .halo{animation:ltbreath 4s ease-in-out infinite}
@keyframes ltbreath{50%{transform:scale(1.06);opacity:calc(var(--b) * var(--k,1) * .8)}}
.wire{fill:none;stroke:#8a8f96;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;transition:stroke .6s}
.on .wire{stroke:#fff6dc;filter:drop-shadow(0 0 2px var(--lc))}
.cycle .tint{animation:lthue 9s linear infinite}
@keyframes lthue{to{filter:hue-rotate(360deg)}}
@keyframes ltflicker{0%,100%{opacity:calc(var(--b) * var(--k,1))}40%{opacity:calc(var(--b) * var(--k,1) * .82)}55%{opacity:calc(var(--b) * var(--k,1) * .95)}70%{opacity:calc(var(--b) * var(--k,1) * .78)}}
.on .flick{animation:ltflicker 2.3s ease-in-out infinite}
.flick:nth-of-type(2n){animation-delay:-.8s!important}.flick:nth-of-type(3n){animation-delay:-1.5s!important}
@keyframes ltsway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
.sway{transform-box:view-box}
.on .sway{animation:ltsway 6s ease-in-out infinite}
.sway.s2{animation-delay:-2s!important}.sway.s3{animation-delay:-4s!important}
@keyframes ltbeam{0%,100%{opacity:calc(var(--b) * var(--k,1))}50%{opacity:calc(var(--b) * var(--k,1) * .7)}}
.on .beam{animation:ltbeam 3.5s ease-in-out infinite}
.mote{fill:#fff;opacity:0}
.on .mote{animation:ltmote 5s linear infinite}
.mote:nth-of-type(2){animation-delay:-1.2s!important}.mote:nth-of-type(3){animation-delay:-2.6s!important}.mote:nth-of-type(4){animation-delay:-3.8s!important}
@keyframes ltmote{0%{opacity:0;transform:translateY(0)}20%{opacity:calc(var(--b) * .7)}100%{opacity:0;transform:translateY(-70px)}}
.spark{opacity:0}
.on .spark{animation:ltspark 2.6s ease-in-out infinite}
.spark:nth-of-type(2){animation-delay:-.5s!important}.spark:nth-of-type(3){animation-delay:-1.1s!important}.spark:nth-of-type(4){animation-delay:-1.7s!important}.spark:nth-of-type(5){animation-delay:-2.2s!important}
@keyframes ltspark{0%,70%,100%{opacity:0}80%{opacity:var(--b)}}
/* sapin : guirlande qui clignote en séquence, étoile qui rayonne */
.xb{opacity:.35;transition:opacity .4s}
.on .xb{animation:lttwinkle 2.4s steps(1) infinite}
@keyframes lttwinkle{0%{opacity:var(--b)}50%{opacity:.4}}
.on .star{filter:drop-shadow(0 0 6px #ffd54f)}
.star .rays{opacity:0;transform-box:fill-box;transform-origin:center}
.on .star .rays{opacity:var(--b);animation:ltspin 10s linear infinite}
@keyframes ltspin{to{transform:rotate(360deg)}}
.spot .lit{transition-delay:var(--d,0s)}
.noanim *{animation:none!important}
`;

  // ---- dessins (viewBox 0 0 200 180), gradients préfixés par la sorte pour rester uniques ----
  const halo = (cx, cy, r, k = 0.55) => `<circle class="lit halo lcf" cx="${cx}" cy="${cy}" r="${r}" style="--k:${k}" filter="url(#ltblur)"/>`;
  const DEFS = `<defs>
   <filter id="ltblur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
   <filter id="ltsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
   <radialGradient id="ltglass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></radialGradient>
   <radialGradient id="ltfill" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="var(--lc)" stop-opacity=".95"/><stop offset="1" stop-color="var(--lc)" stop-opacity=".55"/></radialGradient>
   <linearGradient id="ltsteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f767e"/><stop offset=".45" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
   <linearGradient id="ltbrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5f22"/><stop offset=".45" stop-color="#f1cf7a"/><stop offset="1" stop-color="#7b521b"/></linearGradient>
   <linearGradient id="ltcone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--lc)" stop-opacity=".75"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></linearGradient>
   <radialGradient id="ltspot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="color-mix(in srgb,var(--lc) 45%,#fff)"/><stop offset="1" stop-color="var(--lc)"/></radialGradient>
   <radialGradient id="ltceil" cx=".5" cy=".45" r=".75"><stop offset="0" stop-color="#4a5058"/><stop offset="1" stop-color="#2c3137"/></radialGradient>
   <radialGradient id="ltbezel" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e9ecef"/><stop offset="1" stop-color="#c9ced4"/></radialGradient>
   <radialGradient id="ltdiff" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#f3f4f6"/><stop offset="1" stop-color="#d4d8dd"/></radialGradient>
   <linearGradient id="ltup" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="var(--lc)" stop-opacity=".8"/><stop offset="1" stop-color="var(--lc)" stop-opacity="0"/></linearGradient>
  </defs>`;
  const screw = (x, y, w) => `<g><rect x="${x}" y="${y}" width="${w}" height="22" rx="3" fill="url(#ltsteel)"/>
    ${[4, 9, 14].map((d) => `<path d="M${x} ${y + d} L${x + w} ${y + d + 3}" stroke="#4d535a" stroke-width="1.2"/>`).join('')}
    <path d="M${x + 3} ${y + 22} Q${x + w / 2} ${y + 32} ${x + w - 3} ${y + 22} Z" fill="#3b4046"/></g>`;
  const BULB = 'M100 22 C126 22 142 42 142 64 C142 82 130 92 122 104 C118 110 117 116 117 122 L83 122 C83 116 82 110 78 104 C70 92 58 82 58 64 C58 42 74 22 100 22 Z';

  const SVGS = {
    // ampoule classique : verre clair et filament gris, puis verre plein de lumière et filament incandescent
    light_bulb: () => `${halo(100, 70, 70)}
      <path d="${BULB}" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
      <path class="lit" d="${BULB}" fill="url(#ltfill)" style="--k:.9"/>
      <path class="wire" d="M92 120 L92 86 M108 120 L108 86"/>
      <path class="wire" d="M92 86 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5" stroke-width="1.8"/>
      <path d="${BULB}" fill="url(#ltglass)"/>
      ${screw(83, 122, 34)}`,
    // ampoule connectée : verre dépoli opaque, qui se teinte de la couleur choisie (ou fait défiler les teintes)
    color_bulb: () => `<g class="tint">${halo(100, 70, 72, .65)}
      <path d="${BULB}" fill="#e6eaef"/>
      <path class="lit" d="${BULB}" fill="url(#ltfill)" style="--k:1"/></g>
      <path d="${BULB}" fill="url(#ltglass)"/><path d="${BULB}" fill="none" stroke="#fff" stroke-opacity=".5"/>
      <rect x="83" y="118" width="34" height="6" rx="2" fill="#f4f6f8"/>
      ${screw(83, 124, 34)}`,
    // ampoule à filament vintage : verre ambré, filaments verticaux en ressort qui rougeoient et vacillent
    filament_bulb: () => {
      const glass = 'M100 14 C124 14 136 34 136 58 C136 84 124 100 118 112 C116 117 116 120 116 124 L84 124 C84 120 84 117 82 112 C76 100 64 84 64 58 C64 34 76 14 100 14 Z';
      const coil = (x) => `M${x} 104 ${Array.from({ length: 9 }, (_, i) => `q2 -3 0 -6`).join(' ')}`;
      return `${halo(100, 64, 66, .6)}
      <path d="${glass}" fill="#c98a2b" fill-opacity=".28" stroke="#e7b260" stroke-opacity=".55" stroke-width="1.5"/>
      <path class="lit" d="${glass}" fill="url(#ltfill)" style="--k:.55"/>
      <path class="wire" d="M100 118 V52 M86 104 L100 118 L114 104 M86 50 L100 52 L114 50" stroke-width="1.1"/>
      <g class="flick lit" style="--k:1"><path d="${coil(86)} ${coil(93)} ${coil(100)} ${coil(107)} ${coil(114)}" fill="none" stroke="#fff3c4" stroke-width="1.6" filter="url(#ltsoft)"/></g>
      <path d="${coil(86)} ${coil(93)} ${coil(100)} ${coil(107)} ${coil(114)}" class="wire" stroke-width="1.2"/>
      <path d="${glass}" fill="url(#ltglass)"/>
      ${screw(84, 124, 32).replace(/url\(#ltsteel\)/, 'url(#ltbrass)')}`;
    },
    // suspension à abat-jour dôme : l'intérieur s'illumine et un cône de lumière chaude descend
    pendant_light: () => `<path d="M100 0 V40" stroke="#3a3f45" stroke-width="2"/><rect x="94" y="0" width="12" height="5" rx="1.5" fill="#cfd5db"/>
      <path class="lit beam" d="M58 104 L18 180 L182 180 L142 104 Z" fill="url(#ltcone)" style="--k:.7"/>
      <ellipse class="lit" cx="100" cy="176" rx="74" ry="6" fill="var(--lc)" style="--k:.25" filter="url(#ltsoft)"/>
      <rect x="92" y="38" width="16" height="10" rx="2" fill="url(#ltbrass)"/>
      <path d="M100 46 C66 46 46 70 42 102 L158 102 C154 70 134 46 100 46 Z" fill="#525b66"/>
      <path d="M100 46 C80 46 62 58 54 78 C70 60 86 54 100 54 Z" fill="#fff" fill-opacity=".18"/>
      <ellipse cx="100" cy="102" rx="58" ry="7" fill="#2a2f35"/>
      <ellipse class="lit" cx="100" cy="102" rx="56" ry="6" fill="url(#ltfill)" style="--k:1"/>
      <ellipse class="lit" cx="100" cy="104" rx="16" ry="6" fill="#fff8e6" style="--k:1"/>
      <path d="M42 102 L158 102" stroke="#c99a3e" stroke-width="2.5"/>`,
    // grappe de trois globes de verre sur une même barre : chacun brille et éclaire en dessous
    pendant_cluster: () => {
      const globe = (x, y, cls) => `<g class="sway ${cls}" style="transform-origin:${x}px 22px">
        <path d="M${x} 24 V${y - 18}" stroke="#2f3439" stroke-width="1.5"/>
        <rect x="${x - 5}" y="${y - 22}" width="10" height="6" rx="1.5" fill="url(#ltbrass)"/>
        ${halo(x, y, 34, .7)}
        <circle cx="${x}" cy="${y}" r="17" fill="#fff" fill-opacity=".07" stroke="#fff" stroke-opacity=".4"/>
        <circle class="lit" cx="${x}" cy="${y}" r="16" fill="url(#ltfill)" style="--k:.95"/>
        <path class="wire" d="M${x - 4} ${y + 4} q2 -6 4 0 t4 0"/>
        <circle cx="${x}" cy="${y}" r="17" fill="url(#ltglass)"/></g>`;
      return `<rect x="46" y="16" width="108" height="7" rx="3.5" fill="url(#ltbrass)"/><path d="M100 0 V16" stroke="#2f3439" stroke-width="2"/>
      <ellipse class="lit" cx="100" cy="174" rx="80" ry="7" fill="var(--lc)" style="--k:.3" filter="url(#ltsoft)"/>
      ${globe(66, 92, 's1')}${globe(134, 84, 's2')}${globe(100, 124, 's3')}`;
    },
    // lampe de bureau articulée : l'ampoule brille sous l'abat-jour et éclaire le plan de travail
    desk_lamp: () => `<rect x="0" y="168" width="200" height="12" fill="#2a2420"/>
      <path class="lit beam" d="M126 92 L108 168 L200 168 L168 66 Z" fill="url(#ltcone)" style="--k:.7"/>
      <ellipse class="lit" cx="156" cy="168" rx="44" ry="5" fill="var(--lc)" style="--k:.55" filter="url(#ltsoft)"/>
      <ellipse cx="54" cy="166" rx="26" ry="6" fill="url(#ltsteel)"/><rect x="50" y="150" width="8" height="16" rx="2" fill="#7c838b"/>
      <path d="M54 152 L74 96 L126 56" fill="none" stroke="url(#ltsteel)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="74" cy="96" r="5" fill="#9aa1a8"/><circle cx="128" cy="58" r="4.5" fill="#9aa1a8"/>
      <g transform="rotate(-32 140 66)"><path d="M126 52 L154 52 L166 80 L114 80 Z" fill="#4c555e"/><path d="M126 52 L134 52 L118 80 L114 80 Z" fill="#fff" fill-opacity=".14"/>
       <ellipse cx="140" cy="80" rx="26" ry="4.5" fill="#2a2f35"/><ellipse class="lit" cx="140" cy="80" rx="24" ry="4" fill="url(#ltfill)" style="--k:1"/></g>`,
    // lampadaire trépied : l'abat-jour en tissu rayonne et la lumière filtre en haut et en bas
    floor_lamp: () => `<path class="lit beam" d="M70 42 L40 0 L160 0 L130 42 Z" fill="url(#ltup)" style="--k:.55"/>
      <path class="lit beam" d="M72 104 L52 160 L148 160 L128 104 Z" fill="url(#ltcone)" style="--k:.45"/>
      <path d="M100 104 L64 178 M100 104 L136 178 M100 104 L102 172" stroke="#b07a46" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="106" r="4" fill="#7a5530"/>
      ${halo(100, 74, 56, .45)}
      <path d="M70 42 L130 42 L140 106 L60 106 Z" fill="#e9e1d2"/>
      <path class="lit" d="M70 42 L130 42 L140 106 L60 106 Z" fill="url(#ltfill)" style="--k:.95"/>
      <path d="M70 42 L84 42 L76 106 L60 106 Z" fill="#000" fill-opacity=".1"/><path d="M118 42 L130 42 L140 106 L126 106 Z" fill="#000" fill-opacity=".14"/>
      <path d="M70 42 L130 42 M60 106 L140 106" stroke="#c9bda7" stroke-width="1.5"/>`,
    // lustre à pampilles : les bougies s'allument en vacillant, les cristaux scintillent
    chandelier: () => {
      const candles = [[46, 92], [72, 82], [100, 78], [128, 82], [154, 92]];
      const arm = (x, y) => `<path d="M100 104 C${(100 + x) / 2} 128 ${x} 120 ${x} ${y + 18}" fill="none" stroke="url(#ltbrass)" stroke-width="4" stroke-linecap="round"/>`;
      const candle = ([x, y]) => `<ellipse cx="${x}" cy="${y + 18}" rx="7" ry="2.5" fill="url(#ltbrass)"/><rect x="${x - 3.5}" y="${y + 2}" width="7" height="16" rx="1.5" fill="#f4efe6"/>
        <circle class="lit halo lcf" cx="${x}" cy="${y - 3}" r="12" style="--k:.6" filter="url(#ltsoft)"/>
        <path class="lit flick" d="M${x} ${y - 10} C${x + 4} ${y - 4} ${x + 4} ${y + 2} ${x} ${y + 2} C${x - 4} ${y + 2} ${x - 4} ${y - 4} ${x} ${y - 10} Z" fill="url(#ltfill)" style="--k:1"/>
        <path d="M${x} ${y - 10} C${x + 4} ${y - 4} ${x + 4} ${y + 2} ${x} ${y + 2} C${x - 4} ${y + 2} ${x - 4} ${y - 4} ${x} ${y - 10} Z" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
      const crystal = (x, y) => `<path d="M${x} ${y} L${x + 3} ${y + 6} L${x} ${y + 13} L${x - 3} ${y + 6} Z" fill="#e8f3ff" fill-opacity=".75" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>`;
      const sparks = [[61, 128], [100, 146], [139, 128], [80, 118], [120, 118]].map(([x, y]) => `<path class="spark" d="M${x} ${y - 5} L${x + 1.2} ${y - 1.2} L${x + 5} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 5} L${x - 1.2} ${y + 1.2} L${x - 5} ${y} L${x - 1.2} ${y - 1.2} Z" fill="#fff"/>`).join('');
      return `${halo(100, 96, 84, .4)}
      <rect x="90" y="0" width="20" height="6" rx="2" fill="url(#ltbrass)"/><path d="M100 6 V44" stroke="#9c7a3a" stroke-width="2" stroke-dasharray="3 2"/>
      <path d="M94 44 L106 44 L104 64 Q110 70 106 78 L108 104 L92 104 L94 78 Q90 70 96 64 Z" fill="url(#ltbrass)"/>
      ${candles.map(([x, y]) => arm(x, y)).join('')}
      <circle cx="100" cy="106" r="7" fill="url(#ltbrass)"/>
      ${[[61, 122], [80, 112], [100, 132], [120, 112], [139, 122]].map(([x, y]) => `<path d="M${x} ${y - 8} V${y}" stroke="#d9c79a" stroke-width=".6"/>${crystal(x, y)}`).join('')}
      ${candles.map(candle).join('')}${sparks}`;
    },
    // spot de jardin planté dans la pelouse : la lentille s'allume et un faisceau monte vers le ciel
    garden_spotlight: () => `<path class="lit beam" d="M86 60 L40 0 L160 0 L114 60 Z" fill="url(#ltup)" style="--k:.8"/>
      <g><circle class="mote" cx="92" cy="50" r="1.4"/><circle class="mote" cx="108" cy="46" r="1.1"/><circle class="mote" cx="100" cy="54" r="1.6"/><circle class="mote" cx="96" cy="40" r="1"/></g>
      <path d="M0 160 Q50 152 100 158 T200 156 V180 H0 Z" fill="#20361f"/>
      <g fill="#3f7a3a">${[12, 34, 58, 142, 166, 188].map((x) => `<path d="M${x} 162 l-4 -14 l6 12 l2 -16 l3 18 l6 -12 l-3 14 Z"/>`).join('')}</g>
      <path d="M96 140 L100 172 L104 140 Z" fill="#7c838b"/>
      <rect x="86" y="70" width="28" height="64" rx="5" fill="url(#ltsteel)"/>
      ${[86, 98, 110, 122].map((y) => `<path d="M86 ${y} H114" stroke="#4d535a" stroke-width="1.2" opacity=".6"/>`).join('')}
      <rect x="90" y="132" width="20" height="9" rx="2" fill="#5a6067"/>
      <ellipse cx="100" cy="68" rx="15" ry="5" fill="#3b4046"/><ellipse cx="100" cy="64" rx="15" ry="5" fill="url(#ltsteel)"/>
      <ellipse cx="100" cy="64" rx="11" ry="3.5" fill="#2a2f35"/><ellipse class="lit" cx="100" cy="64" rx="11" ry="3.5" fill="url(#ltfill)" style="--k:1"/>
      <ellipse class="lit" cx="100" cy="60" rx="22" ry="10" fill="var(--lc)" style="--k:.45" filter="url(#ltsoft)"/>`,
    // spots encastrés vus de dessous : collerette blanche à plat au plafond, diffuseur en léger retrait qui s'éclaire
    // uniformément, halo sur le plafond autour ; 1 à 4 spots (spot_count), allumés en cascade
    ceiling_spot: (c) => {
      const n = Math.max(1, Math.min(4, Math.round(Number(c && c.spot_count) || 1)));
      const L = { 1: [[100, 90, 34]], 2: [[60, 90, 28], [140, 90, 28]], 3: [[100, 56, 23], [56, 124, 23], [144, 124, 23]],
        4: [[58, 56, 23], [142, 56, 23], [58, 124, 23], [142, 124, 23]] }[n];
      const spot = ([x, y, r], i) => `<g class="spot" style="--d:${(i * 0.15).toFixed(2)}s">
        <circle class="lit halo lcf" cx="${x}" cy="${y}" r="${r * 2.3}" style="--k:.55" filter="url(#ltblur)"/>
        <circle cx="${x}" cy="${y + 1.5}" r="${r + 1}" fill="#000" opacity=".35" filter="url(#ltsoft)"/>
        <circle cx="${x}" cy="${y}" r="${r}" fill="url(#ltbezel)"/>
        <circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="#b7bcc3"/>
        <circle cx="${x}" cy="${y}" r="${r * 0.68}" fill="url(#ltdiff)"/>
        <circle class="lit" cx="${x}" cy="${y}" r="${r * 0.7}" fill="url(#ltspot)" style="--k:1"/>
        <circle class="lit" cx="${x}" cy="${y}" r="${r * 0.9}" fill="var(--lc)" style="--k:.35" filter="url(#ltsoft)"/></g>`;
      // le plafond est le fond de la scène (.stage.ceil), pour remplir aussi les côtés en compact
      return `        <rect class="lit" x="-300" y="-100" width="800" height="380" fill="var(--lc)" style="--k:.12"/>
        ${L.map(spot).join('')}`;
    },
    // sapin de Noël : guirlande d'ampoules qui clignotent en séquence et étoile qui rayonne
    christmas_tree: () => {
      const bulbs = [[78, 64], [96, 70], [114, 66], [70, 96], [88, 104], [108, 104], [128, 98], [62, 132], [80, 140], [100, 142], [120, 140], [140, 134]];
      const cols = ['#ff4b4b', '#ffd54f', '#4fc3f7', '#69f0ae', '#ff80ab', '#ffa726'];
      return `<path d="M100 22 L132 70 L118 70 L146 106 L128 106 L158 146 L42 146 L72 106 L54 106 L82 70 L68 70 Z" fill="#1f6b3a"/>
      <path d="M100 22 L132 70 L118 70 L146 106 L128 106 L158 146 L100 146 Z" fill="#000" fill-opacity=".14"/>
      <path d="M78 62 Q100 76 120 64 M68 94 Q98 112 132 96 M58 130 Q100 148 144 132" fill="none" stroke="#d6dde3" stroke-width="1" opacity=".7"/>
      <rect x="92" y="146" width="16" height="12" fill="#6b4524"/><path d="M80 156 L120 156 L114 176 L86 176 Z" fill="#e8edf2"/><path d="M80 156 L120 156" stroke="#c9d1d8" stroke-width="2"/>
      ${bulbs.map(([x, y], i) => `<circle class="xb" cx="${x}" cy="${y}" r="3.6" fill="${cols[i % cols.length]}" data-i="${i}" style="animation-delay:${-(i % 4) * 0.6}s"/>`).join('')}
      <g class="star"><g class="rays"><path d="M100 2 V-6 M100 38 V46 M82 20 H74 M118 20 H126 M88 8 L83 3 M112 8 L117 3 M88 32 L83 37 M112 32 L117 37" stroke="#ffe082" stroke-width="1.6" stroke-linecap="round"/></g>
       <path d="M100 6 L104 16 L115 17 L106 24 L109 35 L100 29 L91 35 L94 24 L85 17 L96 16 Z" fill="#e0b84a"/>
       <path class="lit" d="M100 6 L104 16 L115 17 L106 24 L109 35 L100 29 L91 35 L94 24 L85 17 L96 16 Z" fill="#ffe27a" style="--k:1"/></g>`;
    },
  };

  // plafonnier globe : photo détourée intégrée (pas de dessin), même traitement que l'option image (éclairée selon la luminosité, lueur de la couleur de l'ampoule)
  const GLOBE_IMG = 'data:image/webp;base64,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';

  // couleur par défaut de chaque luminaire (blanc chaud, sauf les cas particuliers)
  const KINDS = {
    light_bulb: { color: '#ffc46b', re: /ampoule|bulb|lampe|lamp/i, icon: 'mdi:lightbulb' },
    color_bulb: { color: '#ff7ad9', re: /ampoule|bulb|rgb|couleur|color|hue/i, icon: 'mdi:lightbulb-variant' },
    filament_bulb: { color: '#ff9f3d', re: /filament|edison|vintage|ampoule|bulb/i, icon: 'mdi:lightbulb-on-outline' },
    pendant_light: { color: '#ffc46b', re: /suspension|pendant|cuisine|kitchen|ilot|island|table/i, icon: 'mdi:ceiling-light' },
    pendant_cluster: { color: '#ffbf5e', re: /suspension|pendant|cluster|grappe|salon|living/i, icon: 'mdi:ceiling-light-multiple' },
    desk_lamp: { color: '#ffd8a0', re: /bureau|desk|lampe|lamp/i, icon: 'mdi:desk-lamp' },
    floor_lamp: { color: '#ffc46b', re: /lampadaire|floor|lampe|lamp|salon/i, icon: 'mdi:floor-lamp' },
    chandelier: { color: '#ffb44d', re: /lustre|chandelier/i, icon: 'mdi:chandelier' },
    garden_spotlight: { color: '#fff1c9', re: /jardin|garden|spot|exterieur|outdoor/i, icon: 'mdi:spotlight-beam' },
    christmas_tree: { color: '#ffd54f', re: /sapin|noel|noël|christmas|xmas|guirlande/i, icon: 'mdi:pine-tree' },
    ceiling_spot: { color: '#ffd9a0', re: /spot|encastr|downlight|recessed|plafond|ceiling/i, icon: 'mdi:light-recessed' },
    ceiling_globe: { color: '#ffe2b0', re: /globe|boule|plafonnier|opaline|ceiling|plafond/i, icon: 'mdi:ceiling-light' },
  };
  // couleurs proposées par le bouton « Couleur » de l'ampoule couleur
  const modesOf = (a) => (Array.isArray(a.supported_color_modes) ? a.supported_color_modes : []);
  const PRESETS = [[255, 122, 217], [64, 156, 255], [52, 211, 153], [255, 196, 70], [255, 82, 82], [167, 114, 255]];

  // température de blanc (K) → couleur affichable
  const kelvin = (k) => {
    const t = Math.max(1000, Math.min(12000, k)) / 100;
    const cl = (v) => Math.round(Math.max(0, Math.min(255, v)));
    const r = t <= 66 ? 255 : cl(329.698727446 * Math.pow(t - 60, -0.1332047592));
    const g = t <= 66 ? cl(99.4708025861 * Math.log(t) - 161.1195681661) : cl(288.1221695283 * Math.pow(t - 60, -0.0755148492));
    const b = t >= 66 ? 255 : t <= 19 ? 0 : cl(138.5177312231 * Math.log(t - 10) - 305.0447927307);
    return `rgb(${r},${g},${b})`;
  };
  // préréglages de couleur (option presets) : seulement des triplets [r, g, b] entiers 0-255 (rien de brut dans le HTML)
  const rgb3 = (v) => (Array.isArray(v) && v.length === 3 ? v.map((x) => Math.max(0, Math.min(255, Math.round(Number(x) || 0)))) : null);
  const presetsOf = (c) => { const l = Array.isArray(c.presets) ? c.presets.map(rgb3).filter(Boolean) : []; return l.length ? l : PRESETS; };
  // couleur de l'option : [r, g, b] (sélecteur de l'éditeur) ou texte CSS (#ffaa00, orange…)
  const cfgColor = (v) => (Array.isArray(v) && v.length === 3 ? `rgb(${v.map((x) => Math.round(Number(x) || 0)).join(',')})` :
    typeof v === 'string' && /^[#a-z0-9(),.\s%]+$/i.test(v.trim()) ? v.trim() : '');

  class ApplianceLightCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_brightness: true, show_power: true, show_energy: true, show_button_labels: true, follow_light_color: true, ...c };
      this._built = false; this._lastLc = null;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const color = this.kind === 'color_bulb', cfgImg = String(this._c.image || '').trim(), imgOn = String(this._c.image_on || '').trim(), imgOff = String(this._c.image_off || '').trim();
      // image_on / image_off : deux photos distinctes ; la photo « allumée » apparaît en fondu selon la luminosité (l'une des deux peut retomber sur `image`)
      const pair = !!(imgOn || imgOff), img = pair ? (imgOff || cfgImg || imgOn) : cfgImg || (this.kind === 'ceiling_globe' ? GLOBE_IMG : '');
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lttitle"></div><div class="badge" id="ltbadge"></div></div>
        <div class="stage${img && this._c.image_background !== true ? ' ph' : this.kind === 'ceiling_spot' ? ' ceil' : ''}">${img ? `<div class="uph${pair ? ' pair' : ''}"><div class="glow"></div><img class="off" src="${esc(img)}" alt="${esc(this._c.name || this._t(this.kind))}">${pair ? `<img class="on" src="${esc(imgOn || cfgImg || imgOff)}" alt="">` : ''}</div>` : `<svg viewBox="0 0 200 180" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${SVGS[this.kind](this._c)}</svg>`}<div class="sb" id="ltsb"><input class="bs" id="ltbs" type="range" min="0" max="100" step="1"><span class="sv" id="ltsv"></span></div></div>
        <div class="ctl" id="ltctl">
          <button data-a="on"><ha-icon icon="mdi:lightbulb-on"></ha-icon><span></span></button>
          <button data-a="color" class="hide"><ha-icon icon="mdi:palette"></ha-icon><span></span></button>
          <button data-a="off"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon><span></span></button>
        </div>
        <div class="pal" id="ltpal"></div>
        <div class="tiles">${[['brightness', 'mdi:brightness-6'], ['power', 'mdi:flash'], ['energy', 'mdi:lightning-bolt-circle']].map(([k, ic]) =>
          `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      // illustration : tap_action / hold_action (appui long 0,5 s) ; par défaut, la fiche de l'entité
      const stage = root.querySelector('.stage'), stop = () => clearTimeout(this._holdTimer);
      // le curseur ne déclenche ni tap_action ni hold_action de la scène
      for (const ev of ['click', 'pointerdown']) root.getElementById('ltsb').addEventListener(ev, (e) => e.stopPropagation());
      stage.addEventListener('click', () => {
        if (this._held) { this._held = false; return; } // clic qui suit un appui long : ignoré
        if (this._c.tap_action) this._run(this._c.tap_action); else this._more(this._c.entity);
      });
      stage.addEventListener('pointerdown', (ev) => {
        this._held = false;
        if (!this._c.hold_action || (ev.button != null && ev.button > 0)) return;
        stop();
        this._holdTimer = setTimeout(() => { this._held = true; this._run(this._c.hold_action); }, 500);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => stage.addEventListener(t, stop));
      stage.addEventListener('contextmenu', (ev) => { if (this._c.hold_action) ev.preventDefault(); });
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.getElementById('ltpal').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-sw]'); if (!b || !this._hass || !this._c.entity) return;
        const [kind, v] = b.dataset.sw.split(':'), data = { entity_id: this._c.entity };
        if (kind === 'k') data.color_temp_kelvin = Number(v); else data.rgb_color = v.split(',').map(Number);
        this._hass.callService('light', 'turn_on', data);
        this._palOpen = false; this._render();
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more(k === 'brightness' ? this._c.entity : this._c[`entity_${k}`]);
      }));
      // curseur de luminosité : la valeur suit le doigt, l'appel part au relâchement (0 = éteindre)
      const bs = root.getElementById('ltbs');
      bs.addEventListener('input', () => { this._sliding = true; root.getElementById('ltsv').textContent = `${bs.value} %`; });
      bs.addEventListener('change', () => {
        const v = Number(bs.value), h = this._hass, id = this._c.entity;
        this._sliding = false;
        if (!h || !id) return;
        h.callService('light', v > 0 ? 'turn_on' : 'turn_off', v > 0 ? { entity_id: id, brightness_pct: v } : { entity_id: id });
      });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // action standard Home Assistant : more-info / toggle / none gérés ici,
    // le reste (navigate, url, perform-action…) confié à Home Assistant via l'événement hass-action
    _run(a0) {
      // confirmation (option HA standard) : fenêtre Annuler / OK avant l'action, retirée ensuite pour ne pas être redemandée par Home Assistant
      const a = a0 && typeof a0 === 'object' && a0.confirmation ? { ...a0, confirmation: undefined } : a0;
      if (window.applianceConfirm) { window.applianceConfirm(this, a0, () => this._run1(a)); return; }
      this._run1(a);
    }
    _run1(a) {
      const c = this._c;
      const type = typeof a === 'string' ? a : a && a.action;
      if (!type || type === 'none' || !this._hass) return;
      if (type === 'more-info') { this._more((a && a.entity) || c.entity); return; }
      if (type === 'toggle' && c.entity) {
        // service adapté au domaine (verrou, scène, script, bouton, cover…), défini dans editor-labels
        if (window.applianceToggle) { window.applianceToggle(this._hass, c.entity); return; }
        const d = c.entity.split('.')[0];
        this._hass.callService(['light', 'switch', 'input_boolean', 'fan'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity });
        return;
      }
      this.dispatchEvent(new CustomEvent('hass-action', { detail: { config: { entity: c.entity, tap_action: typeof a === 'string' ? { action: a } : a }, action: 'tap' }, bubbles: true, composed: true }));
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'color' && c.color_palette === true) { this._palOpen = !this._palOpen; this._render(); return; } // ouvre ou ferme la palette
      if (a === 'color') {
        // couleur suivante de la liste (presets en configuration, sinon une palette de six teintes)
        const list = presetsOf(c);
        this._preset = ((this._preset ?? -1) + 1) % list.length;
        h.callService('light', 'turn_on', { entity_id: c.entity, rgb_color: list[this._preset] });
        return;
      }
      if (d === 'light') {
        const data = { entity_id: c.entity };
        // allumage avec la couleur choisie dans la carte, si la carte ne suit pas la couleur de l'ampoule
        if (a === 'on' && c.follow_light_color === false && Array.isArray(c.color)) data.rgb_color = c.color;
        h.callService('light', a === 'on' ? 'turn_on' : 'turn_off', data);
      } else h.callService('homeassistant', a === 'on' ? 'turn_on' : 'turn_off', { entity_id: c.entity });
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, K = KINDS[this.kind];
      const s = this._st(c.entity), a = (s && s.attributes) || {};
      const raw = s ? String(s.state) : '';
      const pw = this._num(c.entity_power);
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s) st = /^(on|true|1|home|open)$/i.test(raw) ? 'on' : 'off';
      else st = !isNaN(pw) ? (pw > Number(c.threshold ?? 1) ? 'on' : 'off') : 'unavailable';

      // couleur : celle de l'ampoule (RVB ou kelvins) si on la suit, sinon l'option color, sinon celle du luminaire
      let col = '';
      if (c.follow_light_color !== false) {
        // kelvins / mireds à null (lampe éteinte) : Number(null) = 0 donnerait un rouge-orangé pendant le fondu
        const pos = (v) => v != null && v !== '' && isFinite(Number(v)) && Number(v) > 0;
        const rgb = rgb3(a.rgb_color);
        if (rgb) col = `rgb(${rgb.join(',')})`;
        else if (pos(a.color_temp_kelvin)) col = kelvin(Number(a.color_temp_kelvin));
        else if (pos(a.color_temp)) col = kelvin(1e6 / Number(a.color_temp));
        // éteinte : on garde la dernière couleur connue de l'ampoule pour le fondu
        if (col) this._lastLc = col; else if (st !== 'on') col = this._lastLc || '';
      }
      col = col || cfgColor(c.color) || K.color;
      // luminosité réelle (tuile) ; plancher de 15 % seulement pour la lueur, pour qu'une lampe très tamisée reste visible
      const briReal = a.brightness != null && isFinite(Number(a.brightness)) ? Number(a.brightness) / 255 : 1;
      const bri = Math.max(0.15, briReal);
      const cycle = this.kind === 'color_bulb' && st === 'on' && (c.color_cycle === true || /loop|rainbow|cycle|colou?r/i.test(String(a.effect || '')));
      card.className = `${st}${cycle ? ' cycle' : ''} ${c.animations === false ? 'noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--lc', col);
      card.style.setProperty('--b', (st === 'on' ? bri : 0).toFixed(3));
      // photo perso : plafond de l'éclairage de la photo (image_max), plancher de l'éclairage de la photo allumée (image_min) et plafond de la lueur (glow_max), en % de la luminosité de la lampe
      const cap = (v) => (isFinite(Number(v)) && v !== '' && v !== null ? Math.max(0, Math.min(100, Number(v))) / 100 : 1);
      const imin = isFinite(Number(c.image_min)) && c.image_min !== '' && c.image_min !== null ? Math.max(0, Math.min(100, Number(c.image_min))) / 100 : 0;
      // image_min : plancher de l'éclairage de la photo, lampe allumée (même dimmée très bas) ET éteinte, pour qu'on la reconnaisse toujours
      card.style.setProperty('--pb', (st === 'on' ? Math.max(bri * cap(c.image_max), imin) : imin).toFixed(3));
      card.style.setProperty('--gb', (st === 'on' ? bri * cap(c.glow_max) : 0).toFixed(3));
      // sapin : guirlande d'une seule couleur si multicolor: false
      if (this.kind === 'christmas_tree') r.querySelectorAll('.xb').forEach((el, i) => {
        const multi = c.multicolor !== false, cc = multi ? el.getAttribute('fill') : col;
        el.style.fill = multi ? '' : col; el.style.filter = st === 'on' ? `drop-shadow(0 0 3px ${cc})` : 'none';
      });

      r.getElementById('lttitle').textContent = c.name || this._t(this.kind);
      const badge = r.getElementById('ltbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('ltctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['light', 'switch', 'input_boolean'].includes(d));
      ctl.querySelectorAll('button').forEach((b) => {
        const k = b.dataset.a;
        const txt = this._l(k === 'on' ? 'turn_on' : k === 'off' ? 'turn_off' : 'color');
        const span = b.querySelector('span');
        span.textContent = txt;
        // icônes seules : libellé masqué, conservé en tooltip / accessibilité
        const icoOnly = c.show_button_labels === false;
        span.style.display = icoOnly ? 'none' : '';
        b.classList.toggle('ico', icoOnly);
        b.title = icoOnly ? txt : '';
        if (icoOnly) b.setAttribute('aria-label', txt); else b.removeAttribute('aria-label');
        b.classList.toggle('sel', k === 'on' ? st === 'on' && !cycle : k === 'off' ? st !== 'on' : cycle);
        if (k === 'color') {
          const m = modesOf(a), can = m.some((x) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww', 'color_temp'].includes(x)) || a.min_color_temp_kelvin != null;
          // bouton Couleur : ampoule couleur (défilement des teintes) ou, avec color_palette, toute lumière qui gère la couleur / le blanc réglable
          b.classList.toggle('hide', d !== 'light' || !(c.color_palette === true ? can : this.kind === 'color_bulb'));
          if (c.color_palette === true) b.classList.toggle('sel', !!this._palOpen);
        }
      });

      // palette de couleurs (option color_palette) : seulement pour une entité light qui gère la couleur ou le blanc réglable
      const pal = r.getElementById('ltpal');
      const rgbOk = modesOf(a).some((m) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].includes(m)), ctOk = modesOf(a).some((m) => ['color_temp', 'rgbw', 'rgbww'].includes(m)) || a.min_color_temp_kelvin != null;
      const showPal = c.color_palette === true && d === 'light' && st !== 'unavailable' && (rgbOk || ctOk) && !!this._palOpen;
      pal.classList.toggle('on', showPal);
      if (showPal) {
        const list = presetsOf(c);
        const lo = Number(a.min_color_temp_kelvin) || 2000, hi = Number(a.max_color_temp_kelvin) || 6500;
        const WHITES = [[Math.max(lo, 2700), 'warm', 'rgb(255,167,87)'], [Math.min(Math.max(lo, 4000), hi), 'neutral', 'rgb(255,228,206)'], [Math.min(hi, 6500), 'cold', 'rgb(206,224,255)']];
        const html = (ctOk ? WHITES.map(([k, n, col]) => `<button type="button" style="--sw:${col}" data-sw="k:${k}" title="${esc(this._l('white_' + n))}" aria-label="${esc(this._l('white_' + n))}"></button>`).join('') : '')
          + (ctOk && rgbOk ? '<span class="sep"></span>' : '')
          + (rgbOk ? list.map((rgb) => `<button type="button" style="--sw:rgb(${rgb.join(',')})" data-sw="c:${rgb.join(',')}" aria-label="rgb(${rgb.join(',')})"></button>`).join('') : '');
        if (pal.dataset.h !== html) { pal.innerHTML = html; pal.dataset.h = html; }
      }
      const energy = this._num(c.entity_energy);
      // curseur : option brightness_slider (par défaut sur les spots encastrés), entité light réglable en intensité
      const modes = Array.isArray(a.supported_color_modes) ? a.supported_color_modes : [];
      const dimmable = d === 'light' && st !== 'unavailable' && (modes.some((m) => m !== 'onoff') || a.brightness != null);
      const slider = dimmable && (c.brightness_slider ?? this.kind === 'ceiling_spot') !== false;
      const pct = st === 'on' && isFinite(Number(a.brightness)) ? Math.max(1, Math.round(Number(a.brightness) / 2.55)) : 0;
      const V = {
        brightness: [!slider && st === 'on' && isFinite(Number(a.brightness)), Math.round(briReal * 100), '%', 'show_brightness'],
        power: [c.entity_power, this._fmt(pw, pw < 10 ? 1 : 0), this._unit(c.entity_power, 'W'), 'show_power'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh'), 'show_energy'],
      };
      const bs = r.getElementById('ltbs');
      const pos = ['left', 'right'].includes(c.slider_position) ? c.slider_position : 'bottom'; // emplacement : sous l'ampoule (défaut), à gauche ou à droite
      const stg = r.querySelector('.stage');
      stg.classList.toggle('hasbs', slider); stg.classList.toggle('sbl', pos === 'left'); stg.classList.toggle('sbr', pos === 'right');
      r.getElementById('ltsb').classList.toggle('dim', st !== 'on');
      if (slider && !this._sliding) { bs.value = String(pct); r.getElementById('ltsv').textContent = `${pct} %`; }
      bs.setAttribute('aria-label', this._l('brightness'));
      r.querySelectorAll('.tile').forEach((el) => {
        const [show, val, unit, opt] = V[el.dataset.k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(el.dataset.k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceLightCardEditor extends HTMLElement {
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
        { name: 'image', selector: { text: {} } },
        { name: 'image_off', selector: { image: { original: true } } },
        { name: 'image_on', selector: { image: { original: true } } },
        ...(String(this._c.image || '').trim() || this._c.image_on || this._c.image_off ? [
          { name: 'image_background', selector: { boolean: {} } },
          { name: 'image_min', selector: { number: { min: 0, max: 100, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'image_max', selector: { number: { min: 0, max: 100, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'glow_max', selector: { number: { min: 0, max: 100, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        ] : []),
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { name: 'tap_action', selector: { ui_action: { actions: ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'] } } },
        { name: 'hold_action', selector: { ui_action: { actions: ['more-info', 'toggle', 'navigate', 'url', 'perform-action', 'none'] } } },
        { name: 'confirm_action', selector: { boolean: {} } }, { name: 'confirm_text', selector: { text: {} } },
        { name: 'slider_position', default: 'bottom', selector: { select: { mode: 'dropdown', options: ['bottom', 'left', 'right'].map((value) => ({ value, label: T[window.applianceLang(T, this._c, this._hass)][`slider_${value}`] ?? T.en[`slider_${value}`] })) } } },
        { name: 'color', selector: { color_rgb: {} } },
        { type: 'grid', name: '', schema: [
          bool('follow_light_color'),
          bool('color_palette', false),
          bool('brightness_slider', this.kind === 'ceiling_spot'),
          ...(this.kind === 'color_bulb' ? [bool('color_cycle', false)] : []),
          ...(this.kind === 'christmas_tree' ? [bool('multicolor')] : []),
        ] },
        // spots encastrés : nombre de spots pilotés par la même entité
        ...(this.kind === 'ceiling_spot' ? [{ name: 'spot_count', default: 1, selector: { number: { min: 1, max: 4, step: 1, mode: 'slider' } } }] : []),
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_button_labels'), bool('show_brightness'), bool('show_power'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace(/_/g, '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceLightCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        return { entity: ids.find((i) => i.startsWith('light.') && K.re.test(i)) || ids.find((i) => i.startsWith('light.')) || '' };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceLightCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l][kind]])), preview: true,
      description: `${T.fr[kind]} animé(e) : la lumière suit l'état, la luminosité et la couleur de l'ampoule.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
