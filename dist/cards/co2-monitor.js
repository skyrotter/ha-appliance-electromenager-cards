/* Carte « Moniteur de CO₂ » — custom:appliance-co2-monitor-card
 * Capteur de CO₂ de bureau / de salon (NDIR, écran LCD) en photo détourée, avec son écran redessiné par-dessus : modèle rectangle
 * (jauge en arc vert → jaune → rouge, grands chiffres 7 segments, température, humidité, batterie) ou modèle rond (chiffres, sourire,
 * voyant du haut). Écran éteint quand l'entité marche / arrêt est sur off. Niveaux : bon sous co2_good (800 ppm), mauvais au-dessus de
 * co2_bad (1 200 ppm) ; la jauge se remplit jusqu'à co2_max (2 000 ppm).
 */
(() => {
  const TAG = 'appliance-co2-monitor-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"CO₂ monitor","good":"Good air","moderate":"Moderate","poor":"Poor air","off":"Off","unavailable":"Unavailable","co2":"CO₂","temperature":"Temperature","humidity":"Humidity","battery":"Battery","model_rectangle":"Rectangle","model_round":"Round","f_model":"Model","f_entity_status":"On / off (switch, binary sensor)","f_entity_battery":"Battery level (%)","f_co2_good":"Good air below (ppm)","f_co2_bad":"Poor air above (ppm)","f_co2_max":"Gauge full scale (ppm)","f_show_co2":"CO₂ tile","f_show_temperature":"temperature tile","f_show_humidity":"humidity tile","pressure":"Pressure","f_entity_pressure":"Pressure sensor (hPa)","f_rotate_seconds":"Rotate the big value every (s, 0 = off)","f_rotate_title":"Show the shown value's name as title","f_show_pressure":"pressure tile","f_show_battery":"battery tile"},"cs":{"name":"Monitor CO₂","good":"Dobrý vzduch","moderate":"Střední","poor":"Špatný vzduch","off":"Vypnuto","unavailable":"Nedostupné","co2":"CO₂","temperature":"Teplota","humidity":"Vlhkost","battery":"Baterie","model_rectangle":"Obdélník","model_round":"Kulatý","f_model":"Model","f_entity_status":"Zapnuto / vypnuto (spínač, binární senzor)","f_entity_battery":"Stav baterie (%)","f_co2_good":"Dobrý vzduch pod (ppm)","f_co2_bad":"Špatný vzduch nad (ppm)","f_co2_max":"Plný rozsah ukazatele (ppm)","f_show_co2":"Dlaždice CO₂","f_show_temperature":"Dlaždice teplota","f_show_humidity":"Dlaždice vlhkost","pressure":"Tlak","f_entity_pressure":"Snímač tlaku (hPa)","f_rotate_seconds":"Střídat velkou hodnotu každých (s, 0 = vyp.)","f_rotate_title":"Zobrazit název hodnoty jako titulek","f_show_pressure":"dlaždice tlaku","f_show_battery":"Dlaždice baterie"},"da":{"name":"CO₂-måler","good":"God luft","moderate":"Moderat","poor":"Dårlig luft","off":"Slukket","unavailable":"Utilgængelig","co2":"CO₂","temperature":"Temperatur","humidity":"Fugtighed","battery":"Batteri","model_rectangle":"Rektangel","model_round":"Rund","f_model":"Model","f_entity_status":"Til / fra (kontakt, binær sensor)","f_entity_battery":"Batteriniveau (%)","f_co2_good":"God luft under (ppm)","f_co2_bad":"Dårlig luft over (ppm)","f_co2_max":"Fuld skala på måleren (ppm)","f_show_co2":"Felt CO₂","f_show_temperature":"Felt temperatur","f_show_humidity":"Felt fugtighed","pressure":"Lufttryk","f_entity_pressure":"Tryksensor (hPa)","f_rotate_seconds":"Skift den store værdi hver (s, 0 = fra)","f_rotate_title":"Vis værdiens navn som titel","f_show_pressure":"trykfelt","f_show_battery":"Felt batteri"},"de":{"name":"CO₂-Monitor","good":"Gute Luft","moderate":"Mäßig","poor":"Schlechte Luft","off":"Aus","unavailable":"Nicht verfügbar","co2":"CO₂","temperature":"Temperatur","humidity":"Luftfeuchtigkeit","battery":"Batterie","model_rectangle":"Rechteck","model_round":"Rund","f_model":"Modell","f_entity_status":"Ein / Aus (Schalter, Binärsensor)","f_entity_battery":"Batteriestand (%)","f_co2_good":"Gute Luft unter (ppm)","f_co2_bad":"Schlechte Luft über (ppm)","f_co2_max":"Skalenendwert der Anzeige (ppm)","f_show_co2":"Kachel CO₂","f_show_temperature":"Kachel Temperatur","f_show_humidity":"Kachel Luftfeuchtigkeit","pressure":"Luftdruck","f_entity_pressure":"Drucksensor (hPa)","f_rotate_seconds":"Großen Wert wechseln alle (s, 0 = aus)","f_rotate_title":"Namen des Werts als Titel anzeigen","f_show_pressure":"Druck-Kachel","f_show_battery":"Kachel Batterie"},"es":{"name":"Monitor de CO₂","good":"Aire bueno","moderate":"Moderado","poor":"Aire malo","off":"Apagado","unavailable":"No disponible","co2":"CO₂","temperature":"Temperatura","humidity":"Humedad","battery":"Batería","model_rectangle":"Rectángulo","model_round":"Redondo","f_model":"Modelo","f_entity_status":"Encendido / apagado (interruptor, sensor binario)","f_entity_battery":"Nivel de batería (%)","f_co2_good":"Aire bueno por debajo de (ppm)","f_co2_bad":"Aire malo por encima de (ppm)","f_co2_max":"Fondo de escala del indicador (ppm)","f_show_co2":"Mosaico CO₂","f_show_temperature":"Mosaico temperatura","f_show_humidity":"Mosaico humedad","pressure":"Presión","f_entity_pressure":"Sensor de presión (hPa)","f_rotate_seconds":"Cambiar el valor grande cada (s, 0 = no)","f_rotate_title":"Mostrar el nombre del valor como título","f_show_pressure":"tarjeta de presión","f_show_battery":"Mosaico batería"},"fr":{"name":"Moniteur de CO₂","good":"Air sain","moderate":"Moyen","poor":"Air vicié","off":"Éteint","unavailable":"Indisponible","co2":"CO₂","temperature":"Température","humidity":"Humidité","battery":"Batterie","model_rectangle":"Rectangle","model_round":"Rond","f_model":"Modèle","f_entity_status":"Marche / arrêt (interrupteur, capteur binaire)","f_entity_battery":"Niveau de batterie (%)","f_co2_good":"Air sain sous (ppm)","f_co2_bad":"Air vicié au-dessus (ppm)","f_co2_max":"Pleine échelle de la jauge (ppm)","f_show_co2":"Tuile CO₂","f_show_temperature":"Tuile température","f_show_humidity":"Tuile humidité","pressure":"Pression","f_entity_pressure":"Capteur de pression (hPa)","f_rotate_seconds":"Faire défiler la grande valeur toutes les (s, 0 = non)","f_rotate_title":"Afficher le nom de la valeur en titre","f_show_pressure":"tuile pression","f_show_battery":"Tuile batterie"},"hu":{"name":"CO₂-mérő","good":"Jó levegő","moderate":"Közepes","poor":"Rossz levegő","off":"Ki","unavailable":"Nem elérhető","co2":"CO₂","temperature":"Hőmérséklet","humidity":"Páratartalom","battery":"Akkumulátor","model_rectangle":"Téglalap","model_round":"Kerek","f_model":"Modell","f_entity_status":"Be / ki (kapcsoló, bináris érzékelő)","f_entity_battery":"Akkumulátor szintje (%)","f_co2_good":"Jó levegő ez alatt (ppm)","f_co2_bad":"Rossz levegő ez felett (ppm)","f_co2_max":"A skála teljes értéke (ppm)","f_show_co2":"CO₂ csempe","f_show_temperature":"hőmérséklet csempe","f_show_humidity":"páratartalom csempe","pressure":"Légnyomás","f_entity_pressure":"Nyomásérzékelő (hPa)","f_rotate_seconds":"A nagy érték váltása (mp, 0 = ki)","f_rotate_title":"Az érték nevének megjelenítése címként","f_show_pressure":"nyomás csempe","f_show_battery":"akkumulátor csempe"},"it":{"name":"Monitor CO₂","good":"Aria buona","moderate":"Moderata","poor":"Aria scadente","off":"Spento","unavailable":"Non disponibile","co2":"CO₂","temperature":"Temperatura","humidity":"Umidità","battery":"Batteria","model_rectangle":"Rettangolare","model_round":"Rotondo","f_model":"Modello","f_entity_status":"Acceso / spento (interruttore, sensore binario)","f_entity_battery":"Livello batteria (%)","f_co2_good":"Aria buona sotto (ppm)","f_co2_bad":"Aria scadente sopra (ppm)","f_co2_max":"Fondo scala dell'indicatore (ppm)","f_show_co2":"Riquadro CO₂","f_show_temperature":"Riquadro temperatura","f_show_humidity":"Riquadro umidità","pressure":"Pressione","f_entity_pressure":"Sensore di pressione (hPa)","f_rotate_seconds":"Cambia il valore grande ogni (s, 0 = no)","f_rotate_title":"Mostra il nome del valore come titolo","f_show_pressure":"riquadro pressione","f_show_battery":"Riquadro batteria"},"nb":{"name":"CO₂-måler","good":"God luft","moderate":"Moderat","poor":"Dårlig luft","off":"Av","unavailable":"Utilgjengelig","co2":"CO₂","temperature":"Temperatur","humidity":"Luftfuktighet","battery":"Batteri","model_rectangle":"Rektangel","model_round":"Rund","f_model":"Modell","f_entity_status":"På / av (bryter, binær sensor)","f_entity_battery":"Batterinivå (%)","f_co2_good":"God luft under (ppm)","f_co2_bad":"Dårlig luft over (ppm)","f_co2_max":"Full skala på måleren (ppm)","f_show_co2":"Rute CO₂","f_show_temperature":"Rute temperatur","f_show_humidity":"Rute luftfuktighet","pressure":"Lufttrykk","f_entity_pressure":"Trykksensor (hPa)","f_rotate_seconds":"Bytt den store verdien hvert (s, 0 = av)","f_rotate_title":"Vis verdiens navn som tittel","f_show_pressure":"trykkflis","f_show_battery":"Rute batteri"},"nl":{"name":"CO₂-monitor","good":"Goede lucht","moderate":"Matig","poor":"Slechte lucht","off":"Uit","unavailable":"Niet beschikbaar","co2":"CO₂","temperature":"Temperatuur","humidity":"Luchtvochtigheid","battery":"Batterij","model_rectangle":"Rechthoek","model_round":"Rond","f_model":"Model","f_entity_status":"Aan / uit (schakelaar, binaire sensor)","f_entity_battery":"Batterijniveau (%)","f_co2_good":"Goede lucht onder (ppm)","f_co2_bad":"Slechte lucht boven (ppm)","f_co2_max":"Volle schaal van de meter (ppm)","f_show_co2":"Tegel CO₂","f_show_temperature":"Tegel temperatuur","f_show_humidity":"Tegel luchtvochtigheid","pressure":"Luchtdruk","f_entity_pressure":"Druksensor (hPa)","f_rotate_seconds":"Grote waarde wisselen elke (s, 0 = uit)","f_rotate_title":"Naam van de waarde als titel tonen","f_show_pressure":"druktegel","f_show_battery":"Tegel batterij"},"pl":{"name":"Monitor CO₂","good":"Dobre powietrze","moderate":"Umiarkowane","poor":"Złe powietrze","off":"Wyłączony","unavailable":"Niedostępny","co2":"CO₂","temperature":"Temperatura","humidity":"Wilgotność","battery":"Bateria","model_rectangle":"Prostokątny","model_round":"Okrągły","f_model":"Model","f_entity_status":"Wł. / wył. (przełącznik, czujnik binarny)","f_entity_battery":"Poziom baterii (%)","f_co2_good":"Dobre powietrze poniżej (ppm)","f_co2_bad":"Złe powietrze powyżej (ppm)","f_co2_max":"Pełna skala wskaźnika (ppm)","f_show_co2":"Kafelek CO₂","f_show_temperature":"Kafelek temperatura","f_show_humidity":"Kafelek wilgotność","pressure":"Ciśnienie","f_entity_pressure":"Czujnik ciśnienia (hPa)","f_rotate_seconds":"Zmieniaj dużą wartość co (s, 0 = wył.)","f_rotate_title":"Pokaż nazwę wartości jako tytuł","f_show_pressure":"kafelek ciśnienia","f_show_battery":"Kafelek bateria"},"pt-BR":{"name":"Monitor de CO₂","good":"Ar bom","moderate":"Moderado","poor":"Ar ruim","off":"Desligado","unavailable":"Indisponível","co2":"CO₂","temperature":"Temperatura","humidity":"Umidade","battery":"Bateria","model_rectangle":"Retângulo","model_round":"Redondo","f_model":"Modelo","f_entity_status":"Ligado / desligado (interruptor, sensor binário)","f_entity_battery":"Nível da bateria (%)","f_co2_good":"Ar bom abaixo de (ppm)","f_co2_bad":"Ar ruim acima de (ppm)","f_co2_max":"Fundo de escala do medidor (ppm)","f_show_co2":"Bloco CO₂","f_show_temperature":"Bloco temperatura","f_show_humidity":"Bloco umidade","pressure":"Pressão","f_entity_pressure":"Sensor de pressão (hPa)","f_rotate_seconds":"Alternar o valor grande a cada (s, 0 = não)","f_rotate_title":"Mostrar o nome do valor como título","f_show_pressure":"bloco de pressão","f_show_battery":"Bloco bateria"},"pt-PT":{"name":"Monitor de CO₂","good":"Ar bom","moderate":"Moderado","poor":"Ar mau","off":"Desligado","unavailable":"Indisponível","co2":"CO₂","temperature":"Temperatura","humidity":"Humidade","battery":"Bateria","model_rectangle":"Retângulo","model_round":"Redondo","f_model":"Modelo","f_entity_status":"Ligado / desligado (interruptor, sensor binário)","f_entity_battery":"Nível da bateria (%)","f_co2_good":"Ar bom abaixo de (ppm)","f_co2_bad":"Ar mau acima de (ppm)","f_co2_max":"Fundo de escala do medidor (ppm)","f_show_co2":"Bloco CO₂","f_show_temperature":"Bloco temperatura","f_show_humidity":"Bloco humidade","pressure":"Pressão","f_entity_pressure":"Sensor de pressão (hPa)","f_rotate_seconds":"Alternar o valor grande a cada (s, 0 = não)","f_rotate_title":"Mostrar o nome do valor como título","f_show_pressure":"bloco de pressão","f_show_battery":"Bloco bateria"},"ro":{"name":"Monitor CO₂","good":"Aer bun","moderate":"Moderat","poor":"Aer slab","off":"Oprit","unavailable":"Indisponibil","co2":"CO₂","temperature":"Temperatură","humidity":"Umiditate","battery":"Baterie","model_rectangle":"Dreptunghi","model_round":"Rotund","f_model":"Model","f_entity_status":"Pornit / oprit (comutator, senzor binar)","f_entity_battery":"Nivel baterie (%)","f_co2_good":"Aer bun sub (ppm)","f_co2_bad":"Aer slab peste (ppm)","f_co2_max":"Scala maximă a indicatorului (ppm)","f_show_co2":"Placă CO₂","f_show_temperature":"Placă temperatură","f_show_humidity":"Placă umiditate","pressure":"Presiune","f_entity_pressure":"Senzor de presiune (hPa)","f_rotate_seconds":"Schimbă valoarea mare la fiecare (s, 0 = oprit)","f_rotate_title":"Afișează numele valorii ca titlu","f_show_pressure":"cardul presiune","f_show_battery":"Placă baterie"},"ru":{"name":"Датчик CO₂","good":"Хороший воздух","moderate":"Умеренный","poor":"Плохой воздух","off":"Выкл.","unavailable":"Недоступно","co2":"CO₂","temperature":"Температура","humidity":"Влажность","battery":"Батарея","model_rectangle":"Прямоугольный","model_round":"Круглый","f_model":"Модель","f_entity_status":"Вкл. / выкл. (переключатель, бинарный датчик)","f_entity_battery":"Уровень заряда (%)","f_co2_good":"Хороший воздух ниже (ppm)","f_co2_bad":"Плохой воздух выше (ppm)","f_co2_max":"Полная шкала индикатора (ppm)","f_show_co2":"Плитка CO₂","f_show_temperature":"Плитка температура","f_show_humidity":"Плитка влажность","pressure":"Давление","f_entity_pressure":"Датчик давления (гПа)","f_rotate_seconds":"Менять крупное значение каждые (с, 0 = выкл.)","f_rotate_title":"Показывать название значения в заголовке","f_show_pressure":"плитка давления","f_show_battery":"Плитка батарея"},"sr":{"name":"CO₂ монитор","good":"Добар ваздух","moderate":"Умерен","poor":"Лош ваздух","off":"Искључен","unavailable":"Недоступно","co2":"CO₂","temperature":"Температура","humidity":"Влажност","battery":"Батерија","model_rectangle":"Правоугаони","model_round":"Округли","f_model":"Модел","f_entity_status":"Укљ. / искљ. (прекидач, бинарни сензор)","f_entity_battery":"Ниво батерије (%)","f_co2_good":"Добар ваздух испод (ppm)","f_co2_bad":"Лош ваздух изнад (ppm)","f_co2_max":"Пуна скала мерача (ppm)","f_show_co2":"Плочица CO₂","f_show_temperature":"Плочица температура","f_show_humidity":"Плочица влажност","pressure":"Притисак","f_entity_pressure":"Сензор притиска (hPa)","f_rotate_seconds":"Мењај велику вредност сваких (с, 0 = искљ.)","f_rotate_title":"Прикажи назив вредности као наслов","f_show_pressure":"плочица притиска","f_show_battery":"Плочица батерија"},"sr-Latn":{"name":"CO₂ monitor","good":"Dobar vazduh","moderate":"Umeren","poor":"Loš vazduh","off":"Isključen","unavailable":"Nedostupno","co2":"CO₂","temperature":"Temperatura","humidity":"Vlažnost","battery":"Baterija","model_rectangle":"Pravougaoni","model_round":"Okrugli","f_model":"Model","f_entity_status":"Uklj. / isklj. (prekidač, binarni senzor)","f_entity_battery":"Nivo baterije (%)","f_co2_good":"Dobar vazduh ispod (ppm)","f_co2_bad":"Loš vazduh iznad (ppm)","f_co2_max":"Puna skala merača (ppm)","f_show_co2":"Pločica CO₂","f_show_temperature":"Pločica temperatura","f_show_humidity":"Pločica vlažnost","pressure":"Pritisak","f_entity_pressure":"Senzor pritiska (hPa)","f_rotate_seconds":"Menjaj veliku vrednost svakih (s, 0 = isklj.)","f_rotate_title":"Prikaži naziv vrednosti kao naslov","f_show_pressure":"pločica pritiska","f_show_battery":"Pločica baterija"},"uk":{"name":"Датчик CO₂","good":"Гарне повітря","moderate":"Помірне","poor":"Погане повітря","off":"Вимк.","unavailable":"Недоступно","co2":"CO₂","temperature":"Температура","humidity":"Вологість","battery":"Батарея","model_rectangle":"Прямокутний","model_round":"Круглий","f_model":"Модель","f_entity_status":"Увімк. / вимк. (перемикач, бінарний датчик)","f_entity_battery":"Рівень заряду (%)","f_co2_good":"Гарне повітря нижче (ppm)","f_co2_bad":"Погане повітря вище (ppm)","f_co2_max":"Повна шкала індикатора (ppm)","f_show_co2":"Плитка CO₂","f_show_temperature":"Плитка температура","f_show_humidity":"Плитка вологість","pressure":"Тиск","f_entity_pressure":"Датчик тиску (гПа)","f_rotate_seconds":"Змінювати велике значення кожні (с, 0 = вимк.)","f_rotate_title":"Показувати назву значення в заголовку","f_show_pressure":"плитка тиску","f_show_battery":"Плитка батарея"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photos détourées (fond retiré, WebP transparent) : rectangle écran éteint (340 × 462), rectangle écran avec icônes, rond écran éteint (346 × 406)
  const IMG_RECT = window.__acImg("co2-monitor",0);
  const IMG_RECT_ICONS = window.__acImg("co2-monitor",1);
  const IMG_ROUND = window.__acImg("co2-monitor",2);
  const MODELS = ['rectangle', 'round'];
  const VB = { rectangle: [340, 462], round: [346, 406] };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --co-ok:var(--appliance-ok-color,#2fd27a);--co-warn:var(--appliance-warn-color,#ffb300);--co-alert:var(--appliance-alert-color,#ff4d3d)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.good .badge{background:color-mix(in srgb,var(--co-ok) 22%,transparent);color:var(--co-ok)}
.moderate .badge{background:color-mix(in srgb,var(--co-warn) 26%,transparent);color:var(--co-warn)}
.poor .badge{background:color-mix(in srgb,var(--co-alert) 22%,transparent);color:var(--co-alert)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(170px * var(--illus-scale,1));width:calc(170px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--co-warn)}.tile.bad .v{color:var(--co-alert)}
/* ---- compact : petits emplacements fixes ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration ---- */
.shadow{opacity:.3}
.scr{font-family:Roboto,"Helvetica Neue",Arial,sans-serif;font-weight:500;fill:#fff}
.glow{filter:drop-shadow(0 0 3px rgba(255,255,255,.55))}
.arc{fill:none;stroke-linecap:round;stroke-width:8;transition:stroke-dasharray .9s ease}
.led{transition:fill .4s}.poor .led.on{animation:copulse 1.1s ease-in-out infinite}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
/* mode rotation : un seul grand affichage (sans tuiles), fondu à chaque changement de valeur */
.rot .tiles{display:none}
/* compact sans tuiles visibles : l'image est centrée (et prend toute la place) */
.compact.notiles .body{justify-content:center}.compact.notiles .tiles{display:none}.compact.notiles svg{max-width:calc(170px * var(--illus-scale,1));margin:0 auto}.rot svg{flex:0 1 calc(280px * var(--illus-scale,1));width:calc(280px * var(--illus-scale,1))}
.swap .scr{animation:cofade .7s ease}
@keyframes cofade{from{opacity:0}to{opacity:1}}
.noanim *{animation:none!important;transition:none!important}
@keyframes copulse{50%{opacity:.45}}
`;

  // chiffres 7 segments (penchés comme sur l'écran) : x = position du chiffre, w × h = boîte du chiffre, t = épaisseur des segments
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g' };
  const poly = (pts) => `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`;
  const digit = (ch, x, w, h, t) => {
    const g = t * 0.14, hh = h / 2;
    const hb = (yc) => poly([[t * 0.5 + g, yc], [t + g, yc - t / 2], [w - t - g, yc - t / 2], [w - t * 0.5 - g, yc], [w - t - g, yc + t / 2], [t + g, yc + t / 2]]);
    const vb = (xc, y0, y1) => poly([[xc, y0], [xc + t / 2, y0 + t / 2], [xc + t / 2, y1 - t / 2], [xc, y1], [xc - t / 2, y1 - t / 2], [xc - t / 2, y0 + t / 2]]);
    const P = { a: hb(t / 2), g: hb(hh), d: hb(h - t / 2), f: vb(t / 2, t * 0.5 + g, hh - g), b: vb(w - t / 2, t * 0.5 + g, hh - g), e: vb(t / 2, hh + g, h - t * 0.5 - g), c: vb(w - t / 2, hh + g, h - t * 0.5 - g) };
    return `<g transform="translate(${x} 0)">${(SEG[ch] || '').split('').map((s) => `<path d="${P[s]}"/>`).join('')}</g>`;
  };
  // nombre en chiffres 7 segments (avec point décimal), aligné à droite sur xr, dans une zone de largeur maxW ; (y, h) = haut et hauteur des chiffres
  const number = (txt, xr, y, h, maxW, wMax, lean = 8) => {
    const toks = [...String(txt).slice(-5)], nd = toks.filter((c) => c !== '.').length, nDot = toks.length - nd, gap = wMax * 0.2;
    const w = Math.min(wMax, (maxW - (toks.length - 1) * gap - nDot * wMax * 0.3) / Math.max(1, nd)), t = Math.max(3, w * 0.22), dw = Math.max(t, w * 0.3);
    const tw = nd * w + nDot * dw + (toks.length - 1) * gap, x0 = xr - tw + h * Math.tan(lean * Math.PI / 180) * 0.5;
    let x = 0;
    const out = toks.map((ch) => {
      const g = ch === '.' ? `<rect x="${(x + dw / 2 - t * 0.6).toFixed(1)}" y="${(h - t * 1.2).toFixed(1)}" width="${(t * 1.2).toFixed(1)}" height="${(t * 1.2).toFixed(1)}" rx="1"/>` : digit(ch, x, w, h, t);
      x += (ch === '.' ? dw : w) + gap; return g;
    }).join('');
    return `<g class="glow" fill="#fff" transform="translate(${x0.toFixed(1)} ${y}) skewX(${-lean})">${out}</g>`;
  };

  // largeur d'un nombre 7 segments (même calcul que number) ; sert à centrer le groupe « chiffres + unité » dans l'écran
  const numWidth = (txt, maxW, wMax) => {
    const toks = [...String(txt).slice(-5)], nd = toks.filter((c) => c !== '.').length, nDot = toks.length - nd, gap = wMax * 0.2;
    const w = Math.min(wMax, (maxW - (toks.length - 1) * gap - nDot * wMax * 0.3) / Math.max(1, nd)), dw = Math.max(Math.max(3, w * 0.22), w * 0.3);
    return nd * w + nDot * dw + (toks.length - 1) * gap;
  };
  // renvoie le bord droit des chiffres (xr) et le départ de l'unité (xu) pour un groupe centré sur xc
  const centerGroup = (txt, maxW, wMax, xc, unitLen, perChar, gapU = 9) => {
    const tw = numWidth(txt, maxW, wMax), G = tw + gapU + unitLen * perChar, xr = xc - G / 2 + tw;
    return { xr, xu: xr + gapU };
  };

  // pictogrammes des petites valeurs (mode rotation) : dessinés autour de (0,0)
  const GLYPH = {
    temperature: '<path d="M-2.6 -8a2.6 2.6 0 0 1 5.2 0v9.5a5 5 0 1 1-5.2 0Z" fill="none"/><path d="M5 -6h3M5 -2h3" />',
    humidity: '<path d="M0 -9C4 -3 7 0 7 3.5a7 7 0 0 1-14 0C-7 0-4-3 0-9Z" fill="none"/>',
    pressure: '<path d="M-8 5A9.5 9.5 0 1 1 8 5" fill="none"/><path d="M0 3L4.5 -4.5" /><circle r="1.4" cy="3" fill="#fff"/>',
    co2: '<text y="3.6" font-size="10" font-weight="700" text-anchor="middle" fill="#fff" stroke="none">CO₂</text>',
  };
  // valeur courte d'une petite grandeur : { txt, unit }
  const smallTxt = (k, v, unit) => ({ txt: isNaN(v) ? '--' : k === 'temperature' ? String(Math.round(v)) : String(Math.round(v)), unit: k === 'temperature' ? (unit || '°C').replace(/^°?c$/i, '°C') : k === 'humidity' ? '%' : k === 'pressure' ? 'hPa' : 'ppm' });

  // photo + écran redessiné : v = mesures, lvl = bon / moyen / mauvais, on = écran allumé, f = remplissage de la jauge (0 à 1)
  const SCREENS = {
    rectangle: (o) => {
      const { v, on, f } = o;
      const battery = isNaN(v.battery) ? '' : (() => {
        const lv = Math.max(0, Math.min(100, v.battery)), bc = lv < 20 ? 'var(--co-alert)' : '#fff';
        return `<g class="glow"><rect x="277" y="83" width="26" height="15" rx="3.5" fill="none" stroke="${bc}" stroke-width="2"/><rect x="304.5" y="87" width="3" height="7" rx="1" fill="${bc}"/><rect x="280" y="86" width="${(20 * lv / 100).toFixed(1)}" height="9" rx="1.5" fill="${bc}"/></g>`;
      })();
      const pt = (a) => `${(197 + 92 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(172 + 92 * Math.sin(a * Math.PI / 180)).toFixed(1)}`;
      const arc = `M${pt(116)}A92 92 0 1 1 ${pt(299)}`;
      const cg = centerGroup(o.big.txt, 116, 32, 214, o.big.unit.length, 10.5), num = number(o.big.txt, cg.xr, 138, 62, 116, 32);
      return `<image href="${IMG_RECT}" width="340" height="462" style="opacity:${on ? 0 : 1}"/><image href="${IMG_RECT_ICONS}" width="340" height="462" style="opacity:${on ? 1 : 0}"/>
        ${on ? `<g class="scr">
          <path class="arc" d="${arc}" pathLength="100" stroke="#2a3a35" opacity=".8"/>
          <path class="arc glow" d="${arc}" pathLength="100" stroke="${o.big.key === 'co2' ? 'url(#cogr)' : '#35d07a'}" stroke-dasharray="${Math.max(1.5, f * 100).toFixed(1)} 100"/>
          ${num}
          <text x="${cg.xu.toFixed(1)}" y="190" font-size="15" font-weight="600">${esc(o.big.unit)}</text>
          <text x="${o.big.label.length > 5 ? 208 : 198}" y="${o.big.label.length > 5 ? 248 : 258}" font-size="${o.big.label.length > 5 ? 11 : 17}" text-anchor="middle">${esc(o.big.label)}</text>
          ${o.rot ? [[145, 285, 352], [250, 278, 350]].map(([cx, cy, ty], i) => {
            const sm = o.small[i]; if (!sm) return `<circle cx="${cx}" cy="${cy}" r="24" fill="#050505"/>`;
            return `<circle cx="${cx}" cy="${cy}" r="24" fill="#050505"/><g class="glow" transform="translate(${cx} ${cy})" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle r="20" fill="none"/><g transform="scale(1.05)">${GLYPH[sm.key]}</g></g>
              <text x="${i ? 254 : 145}" y="${ty}" font-size="${sm.txt.length > 3 ? 32 : 44}" text-anchor="middle">${esc(sm.txt)}<tspan font-size="${sm.unit.length > 2 ? 12 : 22}" dy="${sm.key === 'temperature' ? -17 : 0}">${esc(sm.unit)}</tspan></text>`;
          }).join('') : `<text x="145" y="352" font-size="44" text-anchor="middle">${esc(o.t)}<tspan font-size="19" dy="-19">${esc(o.tu)}</tspan></text>
          <text x="254" y="350" font-size="44" text-anchor="middle">${esc(o.h)}<tspan font-size="34" dy="0">%</tspan></text>`}
          ${battery}</g>` : ''}`;
    },
    round: (o) => {
      const { v, col, on, lvl } = o, val = o.big.txt, cg = centerGroup(val, 146, 31, 150, o.big.unit.length, 8);
      const smile = lvl === 'good' ? 'M214 188Q222 196 230 188' : lvl === 'moderate' ? 'M214 190H230' : 'M214 193Q222 185 230 193';
      return `<image href="${IMG_ROUND}" width="346" height="406"/>
        <rect class="led ${on ? 'on' : ''}" x="${on ? 153 : 151}" y="${on ? 6 : 5}" width="${on ? 42 : 46}" height="${on ? 23 : 25}" rx="12" fill="${on ? col : '#2d3136'}" ${on ? `style="filter:drop-shadow(0 0 5px ${col})"` : ''}/>
        ${on ? `<g class="scr">
          <text x="151" y="118" font-size="${o.big.label.length > 5 ? 12 : 17}" text-anchor="middle">${esc(o.big.label)}</text>
          ${number(val, cg.xr, 140, 68, 146, 31, 9)}
          <text x="${cg.xu.toFixed(1)}" y="166" font-size="13" opacity=".85">${esc(o.big.unit)}</text>
          ${o.big.key === 'co2' ? `<circle cx="222" cy="185" r="14" fill="none" stroke="#fff" stroke-width="1.7" opacity=".9"/><circle cx="217" cy="180" r="1.5"/><circle cx="227" cy="180" r="1.5"/>
          <path d="${smile}" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>` : ''}
          ${o.rot ? [[80, 91], [139, 150]].map(([ix, tx], i) => { const sm = o.small[i]; return sm ? `<g transform="translate(${ix} 227) scale(.62)" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">${GLYPH[sm.key]}</g><text x="${tx}" y="243" font-size="${sm.txt.length > 3 ? 14 : 17}" font-style="italic" opacity=".92">${esc(sm.txt)}<tspan font-size="${sm.unit.length > 2 ? 7.5 : 9}">${esc(sm.unit)}</tspan></text>` : ''; }).join('') : `<path d="M78 214a3.2 3.2 0 0 1 6.4 0v14.4a6.6 6.6 0 1 1-6.4 0Z" fill="#ffc933"/>
          <text x="97" y="243" font-size="17" font-style="italic" opacity=".92">${esc(o.t)}<tspan font-size="10">${esc(o.tu)}</tspan></text>
          <path d="M142 224c-5 6-7 9-7 12.5a7 7 0 0 0 14 0c0-3.500-2-6.500-7-12.500Z" fill="none" stroke="#35d07a" stroke-width="2"/>
          <text x="154" y="243" font-size="17" font-style="italic" opacity=".92">${esc(o.h)}<tspan font-size="10">%</tspan></text>`}
          ${isNaN(v.battery) ? '' : `<rect x="139" y="270" width="17" height="9" rx="1.5" fill="none" stroke="#fff" stroke-width="1.1" opacity=".9"/><rect x="141" y="272" width="${(13 * Math.max(0, Math.min(100, v.battery)) / 100).toFixed(1)}" height="5" fill="${v.battery < 20 ? 'var(--co-alert)' : '#fff'}"/>`}
        </g>` : ''}`;
    },
  };

  const TILES = [['co2', 'mdi:molecule-co2', 'show_co2'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['humidity', 'mdi:water-percent', 'show_humidity'], ['pressure', 'mdi:gauge', 'show_pressure'], ['battery', 'mdi:battery', 'show_battery']];
  const ENT = { co2: 'entity_co2', temperature: 'entity_temperature', humidity: 'entity_humidity', pressure: 'entity_pressure', battery: 'entity_battery' };
  const COLS = { good: '#2fd27a', moderate: '#ffb300', poor: '#ff4d3d' };

  class ApplianceCo2MonitorCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_co2: ids.find((i) => /^sensor\./.test(i) && /(co2|carbon_dioxide)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'rectangle', co2_good: 800, co2_bad: 1200, co2_max: 2000, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
      this._built = false; this._rot = 0; this._startRot();
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _model() { return MODELS.includes(this._c.model) ? this._c.model : 'rectangle'; }

    // rotate_seconds : la grandeur affichée en grand change toutes les N secondes (CO₂, température, humidité, pression) ; le nom suit
    _metrics() { const c = this._c; return ['co2', 'temperature', 'humidity', 'pressure'].filter((k) => c[ENT[k]] && c[`show_${k}`] !== false || (k === 'co2' && c[ENT.co2])); }
    _focusKey() {
      const c = this._c, list = this._metrics(), sec = Number(c.rotate_seconds);
      if (!(sec > 0) || list.length < 2) return 'co2';
      return list[(this._rot || 0) % list.length];
    }
    _startRot() {
      clearInterval(this._rotTimer); this._rotTimer = null;
      const sec = Number(this._c && this._c.rotate_seconds);
      if (sec > 0 && this.isConnected) this._rotTimer = setInterval(() => { this._rot = (this._rot || 0) + 1; if (this._hass && this._built) this._render(); }, Math.max(1, sec) * 1000);
    }
    connectedCallback() { this._startRot(); }
    disconnectedCallback() { clearInterval(this._rotTimer); this._rotTimer = null; }

    // état : unavailable (aucune mesure ou entité marche / arrêt indisponible), off (entité marche / arrêt éteinte), sinon good / moderate / poor selon le CO₂
    _compute() {
      const c = this._c, v = Object.fromEntries(TILES.map(([k]) => [k, this._num(c[ENT[k]])]));
      if (!isNaN(v.pressure)) { const u = this._unit(c.entity_pressure, 'hPa').toLowerCase(); v.pressure = u === 'kpa' ? v.pressure * 10 : u === 'pa' ? v.pressure / 100 : u === 'inhg' ? v.pressure * 33.8639 : u === 'mmhg' ? v.pressure * 1.33322 : v.pressure; }
      const known = TILES.some(([k]) => !isNaN(v[k]));
      const sw = this._st(c.entity_status), swOff = !!sw && /^(off|closed|standby)$/i.test(String(sw.state)), swBad = !!sw && /^unavailable$/i.test(String(sw.state));
      const lvl = isNaN(v.co2) ? 'good' : v.co2 < Number(c.co2_good) ? 'good' : v.co2 > Number(c.co2_bad) ? 'poor' : 'moderate';
      const st = swBad || !known ? 'unavailable' : swOff ? 'off' : lvl;
      return { v, on: st !== 'off' && st !== 'unavailable', lvl, st };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const [W, H] = VB[this._model()];
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="cotitle"></div><div class="badge" id="cobadge"></div></div>
        <div class="body"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(this._c.name || this._t('name'))}"><defs>
          <linearGradient id="cogr" gradientUnits="userSpaceOnUse" x1="160" y1="250" x2="200" y2="78"><stop offset="0" stop-color="#22c55e"/><stop offset=".45" stop-color="#b5e03a"/><stop offset=".7" stop-color="#ffd23b"/><stop offset="1" stop-color="#ff5a3d"/></linearGradient></defs>
          <ellipse class="shadow" cx="${W / 2}" cy="${H - 3}" rx="${W * 0.36}" ry="6" fill="#000"/><g id="coscr"></g></svg>
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_co2 || this._c.entity_status));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, m = this._model();
      const { v, on, lvl, st } = this._compute();
      card.className = `${st}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      r.getElementById('cotitle').textContent = Number(c.rotate_seconds) > 0 && this._metrics().length > 1 && c.rotate_title !== false ? this._l(this._focusKey()) : (c.name || this._t('name'));
      const badge = r.getElementById('cobadge');
      badge.textContent = this._t(st);
      badge.style.display = c.show_status === false || (Number(c.rotate_seconds) > 0 && this._metrics().length > 1 && this._focusKey() !== 'co2') ? 'none' : ''; // l'état « air sain / vicié » ne concerne que le CO₂
      const fk = this._focusKey(), fv = v[fk];
      const SC = { co2: [0, Number(c.co2_max) > 0 ? Number(c.co2_max) : 2000], temperature: [10, 35], humidity: [20, 80], pressure: [980, 1040] };
      const big = { key: fk, label: fk === 'co2' ? 'CO₂' : this._l(fk).toUpperCase(), unit: fk === 'co2' ? this._unit(c.entity_co2, 'ppm').toUpperCase() : fk === 'pressure' ? 'HPA' : this._unit(c[ENT[fk]], { temperature: '°C', humidity: '%' }[fk]).toUpperCase(),
        txt: isNaN(fv) ? '---' : fk === 'temperature' ? String(Math.round(fv * 10) / 10) : String(Math.round(fv)) };
      const f = isNaN(fv) ? 0 : Math.max(0, Math.min(1, (fv - SC[fk][0]) / (SC[fk][1] - SC[fk][0])));
      // mode rotation : un seul affichage, les deux petites valeurs sont les deux AUTRES grandeurs (jamais celle affichée en grand)
      const list = this._metrics(), rot = Number(c.rotate_seconds) > 0 && list.length > 1;
      const others = rot ? [...list.slice(list.indexOf(fk) + 1), ...list.slice(0, list.indexOf(fk))].slice(0, 2) : [];
      const small = others.map((k) => ({ key: k, ...smallTxt(k, v[k], this._unit(c[ENT[k]], '°C')) }));
      card.classList.toggle('rot', rot && c.show_tiles !== true);
      const scr = r.getElementById('coscr'); scr.classList.toggle('swap', rot && this._lastFocus != null && this._lastFocus !== fk); this._lastFocus = fk;
      scr.innerHTML = SCREENS[m]({ v, on, lvl, f, big, rot, small, col: fk === 'co2' ? COLS[lvl] : COLS.good, unit: this._unit(c.entity_co2, 'ppm').toUpperCase(),
        t: this._fmt(v.temperature, 0), h: this._fmt(v.humidity, 0), tu: this._unit(c.entity_temperature, '°C') });
      const dec = { co2: 0, temperature: 1, humidity: 0, pressure: 0, battery: 0 }, dflt = { co2: 'ppm', temperature: '°C', humidity: '%', pressure: 'hPa', battery: '%' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), id = c[ENT[k]];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.classList.toggle('bad', k === 'co2' && lvl === 'poor' && !isNaN(v.co2));
        el.classList.toggle('warn', (k === 'co2' && lvl === 'moderate') || (k === 'battery' && !isNaN(v.battery) && v.battery < 20));
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = isNaN(v[k]) ? '' : k === 'pressure' ? 'hPa' : this._unit(id, dflt[k]);
        el.querySelector('.v').replaceChildren(this._fmt(v[k], dec[k]), small);
      });
      card.classList.toggle('notiles', !r.querySelector('.tile:not(.hide)')); // aucune tuile visible : l'image est centrée en mode compact
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceCo2MonitorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceCo2MonitorCardEditor extends HTMLElement {
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
      const num = (name, def, min, max, step, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', unit_of_measurement: unit } } });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: MODELS.map((value) => ({ value, label: tr[`model_${value}`] || value })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_status', ['switch', 'binary_sensor', 'input_boolean', 'sensor']), ent('entity_co2', 'sensor'), ent('entity_temperature', 'sensor'), ent('entity_humidity', 'sensor'), ent('entity_pressure', 'sensor'), ent('entity_battery', 'sensor'),
        num('rotate_seconds', 0, 0, 60, 1, 's'), bool('rotate_title'),
        { type: 'grid', name: '', schema: [num('co2_good', 800, 400, 3000, 50, 'ppm'), num('co2_bad', 1200, 400, 5000, 50, 'ppm'), num('co2_max', 2000, 800, 10000, 100, 'ppm')] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceCo2MonitorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Moniteur de CO₂ en photo (modèle rectangle ou rond) : l\'écran est redessiné (jauge, chiffres, température, humidité, batterie), niveaux bon / moyen / mauvais.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/co2-monitor.md',
  });
})();
