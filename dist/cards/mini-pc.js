/* Carte « Mini PC » — custom:appliance-mini-pc-card (photo détourée du BMAX B9 Max)
 * Serveur domestique (Home Assistant, Proxmox, Jellyfin…) suivi par Glances ou System Monitor.
 * Animations : bouton d'alimentation qui respire, reflet qui balaie le boîtier, air chaud qui sort des
 * ouïes (vitesse selon le CPU), chaleur qui monte au-dessus du capot (rouge en surchauffe), paquets
 * réseau qui montent / descendent selon le débit, jauges CPU / RAM / disque en néon sur le côté.
 * États : off, idle, running, busy, hot, unavailable.
 */
(() => {
  const TAG = 'appliance-mini-pc-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Mini PC","off":"Off","idle":"Idle","running":"Running","busy":"Busy","hot":"Overheating","unavailable":"Unavailable","cpu":"CPU","temp":"CPU temp.","ram":"RAM","disk":"Disk","down":"Download","up":"Upload","uptime":"Uptime","model_minisforum_x1":"Minisforum X1 (mini PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Power","energy":"Energy","overheating":"Overheating","disk_full":"Disk almost full","ram_full":"Memory saturated","d":"d"},"cs":{"name":"Mini PC","off":"Vypnuto","idle":"Nečinný","running":"Běží","busy":"Vytížený","hot":"Přehřívá se","unavailable":"Nedostupné","cpu":"CPU","temp":"Tepl. CPU","ram":"RAM","disk":"Disk","down":"Stahování","up":"Odesílání","uptime":"Doba běhu","power":"Výkon","overheating":"Přehřívání","disk_full":"Disk téměř plný","ram_full":"Paměť je plná","d":"d"},"da":{"name":"Mini-PC","off":"Slukket","idle":"Inaktiv","running":"Kører","busy":"Travl","hot":"Overophedet","unavailable":"Utilgængelig","cpu":"CPU","temp":"CPU-temp.","ram":"RAM","disk":"Disk","down":"Download","up":"Upload","uptime":"Oppetid","model_minisforum_x1":"Minisforum X1 (mini-PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (mini-PC)","model_home_assistant_green":"Home Assistant Green","power":"Effekt","energy":"Energi","overheating":"Overophedning","disk_full":"Disken er næsten fuld","ram_full":"Hukommelsen er fuld","d":"d"},"de":{"name":"Mini-PC","off":"Aus","idle":"Leerlauf","running":"Läuft","busy":"Ausgelastet","hot":"Überhitzung","unavailable":"Nicht verfügbar","cpu":"CPU","temp":"CPU-Temp.","ram":"RAM","disk":"Festplatte","down":"Download","up":"Upload","uptime":"Laufzeit","power":"Leistung","overheating":"Überhitzung","disk_full":"Festplatte fast voll","ram_full":"Speicher ausgelastet","d":"T","model_minisforum_x1":"Minisforum X1 (Mini-PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (Mini-PC)","model_home_assistant_green":"Home Assistant Green","energy":"Energie"},"es":{"name":"Mini PC","off":"Apagado","idle":"Inactivo","running":"En marcha","busy":"Ocupado","hot":"Sobrecalentamiento","unavailable":"No disponible","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disco","down":"Descarga","up":"Subida","uptime":"Tiempo en marcha","model_minisforum_x1":"Minisforum X1 (mini PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Potencia","energy":"Energía","overheating":"Sobrecalentamiento","disk_full":"Disco casi lleno","ram_full":"Memoria saturada","d":"d"},"fr":{"name":"Mini PC","off":"Éteint","idle":"Au repos","running":"En marche","busy":"Très sollicité","hot":"Surchauffe","unavailable":"Indisponible","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disque","down":"Réception","up":"Envoi","uptime":"Allumé depuis","model_minisforum_x1":"Minisforum X1 (mini PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Puissance","energy":"Énergie","overheating":"Surchauffe","disk_full":"Disque presque plein","ram_full":"Mémoire saturée","d":"j"},"hu":{"name":"Mini PC","off":"Ki","idle":"Tétlen","running":"Fut","busy":"Elfoglalt","hot":"Túlmelegedés","unavailable":"Nem elérhető","cpu":"CPU","temp":"CPU hőm.","ram":"RAM","disk":"Lemez","down":"Letöltés","up":"Feltöltés","uptime":"Üzemidő","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Teljesítmény","overheating":"Túlmelegedés","disk_full":"Lemez majdnem tele","ram_full":"Memória telített","d":"n"},"it":{"name":"Mini PC","off":"Spento","idle":"Inattivo","running":"In funzione","busy":"Sotto carico","hot":"Surriscaldamento","unavailable":"Non disponibile","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disco","down":"Download","up":"Upload","uptime":"Uptime","power":"Potenza","overheating":"Surriscaldamento","disk_full":"Disco quasi pieno","ram_full":"Memoria satura","d":"g"},"nb":{"name":"Mini-PC","off":"Av","idle":"Inaktiv","running":"Kjører","busy":"Høy belastning","hot":"Overoppheting","unavailable":"Utilgjengelig","cpu":"CPU","temp":"CPU-temp.","ram":"RAM","disk":"Disk","down":"Ned","up":"Opp","uptime":"Oppetid","power":"Effekt","overheating":"Overoppheting","disk_full":"Disken er nesten full","ram_full":"Minnet er fullt","d":"d"},"nl":{"name":"Mini-pc","off":"Uit","idle":"Inactief","running":"Actief","busy":"Zwaar belast","hot":"Oververhit","unavailable":"Niet beschikbaar","cpu":"CPU","temp":"CPU-temp.","ram":"RAM","disk":"Schijf","down":"Download","up":"Upload","uptime":"Uptime","power":"Vermogen","overheating":"Oververhitting","disk_full":"Schijf bijna vol","ram_full":"Geheugen vol","d":"d"},"pl":{"name":"Mini PC","off":"Wył.","idle":"Bezczynny","running":"Pracuje","busy":"Zajęty","hot":"Przegrzanie","unavailable":"Niedostępny","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Dysk","down":"Pobieranie","up":"Wysyłanie","uptime":"Czas działania","power":"Moc","overheating":"Przegrzanie","disk_full":"Dysk prawie pełny","ram_full":"Pamięć przepełniona","d":"d"},"pt-BR":{"name":"Mini PC","off":"Desligado","idle":"Inativo","running":"Em funcionamento","busy":"Atividade elevada","hot":"Superaquecimento","unavailable":"Indisponível","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disco","down":"Download","up":"Upload","uptime":"Tempo de atividade","model_minisforum_x1":"Minisforum X1 (mini PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Potência","energy":"Energia","overheating":"Superaquecimento","disk_full":"Disco quase cheio","ram_full":"Memória saturada","d":"d","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini"},"pt-PT":{"name":"Mini PC","off":"Desligado","idle":"Inativo","running":"Em funcionamento","busy":"Atividade elevada","hot":"Sobreaquecimento","unavailable":"Indisponível","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disco","down":"Receção","up":"Envio","uptime":"Tempo de atividade","model_minisforum_x1":"Minisforum X1 (mini PC)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (mini PC)","model_home_assistant_green":"Home Assistant Green","power":"Potência","energy":"Energia","overheating":"Sobreaquecimento","disk_full":"Disco quase cheio","ram_full":"Memória saturada","d":"d","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini"},"ro":{"name":"Mini PC","off":"Oprit","idle":"Inactiv","running":"Pornit","busy":"Solicitat","hot":"Supraîncălzire","unavailable":"Indisponibil","cpu":"CPU","temp":"Temp. CPU","ram":"RAM","disk":"Disc","down":"Descărcare","up":"Încărcare","uptime":"Timp pornit","power":"Putere","overheating":"Supraîncălzire","disk_full":"Disc aproape plin","ram_full":"Memorie saturată","d":"z"},"ru":{"name":"Мини-ПК","off":"Выключен","idle":"Простой","running":"Работает","busy":"Нагружен","hot":"Перегрев","unavailable":"Недоступно","cpu":"ЦП","temp":"Темп. ЦП","ram":"ОЗУ","disk":"Диск","down":"Загрузка","up":"Отдача","uptime":"Аптайм","model_minisforum_x1":"Minisforum X1 (мини-ПК)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini","model_bmax_b9":"BMAX B9 Max (мини-ПК)","model_home_assistant_green":"Home Assistant Green","power":"Мощность","energy":"Энергия","overheating":"Перегрев","disk_full":"Диск почти заполнен","ram_full":"Память переполнена","d":"д"},"sr":{"name":"Мини рачунар","off":"Искључено","idle":"Мировање","running":"У раду","busy":"Оптерећен","hot":"Прегревање","unavailable":"Недоступно","cpu":"Процесор","temp":"Темп. процесора","ram":"РАМ","disk":"Диск","down":"Преузимање","up":"Отпремање","uptime":"Време рада","model_minisforum_x1":"Minisforum X1 (мини рачунар)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (мини рачунар)","model_home_assistant_green":"Home Assistant Green","power":"Снага","energy":"Енергија","overheating":"Прегревање","disk_full":"Диск је скоро пун","ram_full":"Меморија је пуна","d":"д"},"sr-Latn":{"name":"Mini računar","off":"Isključeno","idle":"Mirovanje","running":"U radu","busy":"Opterećen","hot":"Pregrevanje","unavailable":"Nedostupno","cpu":"Procesor","temp":"Temp. procesora","ram":"RAM","disk":"Disk","down":"Preuzimanje","up":"Otpremanje","uptime":"Vreme rada","model_minisforum_x1":"Minisforum X1 (mini računar)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_bmax_b9":"BMAX B9 Max (mini računar)","model_home_assistant_green":"Home Assistant Green","power":"Snaga","energy":"Energija","overheating":"Pregrevanje","disk_full":"Disk je skoro pun","ram_full":"Memorija je puna","d":"d"},"uk":{"name":"Міні-ПК","off":"Вимк.","idle":"Очікування","running":"Працює","busy":"Зайнятий","hot":"Перегрів","unavailable":"Недоступно","cpu":"ЦП","temp":"Темп. ЦП","ram":"ОЗП","disk":"Диск","down":"Завантаження","up":"Вивантаження","uptime":"Час роботи","model_minisforum_x1":"Minisforum X1 (міні-ПК)","model_mac_mini":"Mac mini","model_lenovo_m720s":"Lenovo ThinkCentre M720s SFF","model_lenovo_m920q":"Lenovo ThinkCentre M920q Tiny","model_lenovo_m715q":"Lenovo ThinkCentre M715q Tiny","model_intel_nuc":"Intel NUC 7 (NUC7i3BNH…)","model_hp_prodesk_600_g3":"HP ProDesk 600 G3 Desktop Mini","model_bmax_b9":"BMAX B9 Max (міні-ПК)","model_home_assistant_green":"Home Assistant Green","power":"Потужність","energy":"Енергія","overheating":"Перегрів","disk_full":"Диск майже повний","ram_full":"Пам'ять переповнена","d":"д"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = window.__acImg("mini-pc",0);

  // Photo détourée du Minisforum X1 (fond transparent, 440 × 317)
  const IMG_X1 = window.__acImg("mini-pc",1);

  // Photo du Mac mini (aluminium, vue de face, fond transparent, 440 × 148)
  const IMG_MACMINI = window.__acImg("mini-pc",2);

  // Modèles : photo + géométrie dans la scène 300 × 180 (photo x, y, largeur, hauteur ; halo, ombre, câble, chaleur, air des ouïes,
  // bouton d'alimentation [cx, cy, r] ou null, voyant [cx, cy])
  const MODELS = {
    bmax_b9: { img: IMG, x: 30, y: 26, w: 220, h: 145.4, aura: [140, 100, 125, 70], shadow: [142, 170, 112, 7],
      cable: 'M232 52 C 244 40 236 18 222 14', cableRev: 'M222 14 C 236 18 244 40 232 52',
      heat: ['M110 40 q-4 -6 0 -12 t0 -12', 'M140 34 q-4 -6 0 -12 t0 -12', 'M170 32 q-4 -6 0 -12 t0 -12'],
      air: ['M34 108 C 24 106 14 110 4 106', 'M36 120 C 26 118 16 122 6 118', 'M38 132 C 28 130 18 134 8 130', 'M40 144 C 30 142 20 146 10 142'],
      pwr: [223.1, 127.4, 8.4], led: [209, 120.1] },
    // minisforum_x1 : photo détourée (vue de face, bouton bleu en bas à gauche, voyant à sa gauche)
    minisforum_x1: { img: IMG_X1, x: 40, y: 14, w: 220, h: 158.5, aura: [150, 96, 130, 66], shadow: [152, 168, 112, 7],
      cable: 'M250 60 C 266 48 262 26 248 20', cableRev: 'M248 20 C 262 26 266 48 250 60',
      heat: ['M110 28 q-4 -5 0 -10 t0 -10', 'M140 24 q-4 -5 0 -10 t0 -10', 'M170 24 q-4 -5 0 -10 t0 -10'],
      air: ['M38 108 C 28 106 18 110 8 106', 'M40 120 C 30 118 20 122 10 118', 'M42 132 C 32 130 22 134 12 130', 'M44 144 C 34 142 24 146 14 142'],
      pwr: [173, 136, 6], led: [163, 142] },
    // mac_mini : photo de face (pas de bouton visible : seul le voyant, à droite de la façade)
    mac_mini: { img: IMG_MACMINI, x: 40, y: 62, w: 220, h: 74, aura: [150, 98, 130, 52], shadow: [150, 140, 112, 6],
      cable: 'M248 70 C 264 60 260 40 246 34', cableRev: 'M246 34 C 260 40 264 60 248 70',
      heat: ['M110 58 q-4 -6 0 -12 t0 -12', 'M150 56 q-4 -6 0 -12 t0 -12', 'M190 58 q-4 -6 0 -12 t0 -12'],
      air: ['M44 96 C 34 94 24 98 14 94', 'M44 108 C 34 106 24 110 14 106', 'M44 120 C 34 118 24 122 14 118'],
      pwr: null, led: [224, 106] },
    // lenovo_m720s : photo détourée du ThinkCentre M720s SFF (tour fine, vue de trois quarts), bouton rond en haut de la façade, voyant juste dessous
    lenovo_m720s: { img: window.__acImg("mini-pc",3), x: 100, y: 14, w: 80.7, h: 152, aura: [140, 90, 70, 85], shadow: [140, 168, 50, 6],
      cable: 'M178 44 C 204 44 214 34 214 20', cableRev: 'M214 20 C 214 34 204 44 178 44',
      heat: ['M122 14 q-3 -4 0 -7 t0 -7', 'M140 14 q-3 -4 0 -7 t0 -7', 'M158 14 q-3 -4 0 -7 t0 -7'],
      air: ['M98 110 C 88 108 78 112 68 108', 'M98 122 C 88 120 78 124 68 120', 'M98 134 C 88 132 78 136 68 132', 'M98 146 C 88 144 78 148 68 144'],
      pwr: [127.6, 24.6, 3.2], led: [126.5, 30.1] },
    // hp_prodesk_600_g3 : photo détourée (vue de face) du HP ProDesk 600 G3 Desktop Mini, bouton d'alimentation à droite, voyant disque à sa gauche
    hp_prodesk_600_g3: { img: window.__acImg("mini-pc",4), x: 36, y: 66.5, w: 200, h: 47.1, aura: [136, 90, 118, 42], shadow: [136, 117, 100, 6],
      cable: 'M230 68 C 244 58 240 38 226 32', cableRev: 'M226 32 C 240 38 244 58 230 68',
      heat: ['M100 58 q-4 -6 0 -12 t0 -12', 'M136 56 q-4 -6 0 -12 t0 -12', 'M172 58 q-4 -6 0 -12 t0 -12'],
      air: ['M40 78 C 30 76 20 80 10 76', 'M40 88 C 30 86 20 90 10 86', 'M40 98 C 30 96 20 100 10 96', 'M40 108 C 30 106 20 110 10 106'],
      pwr: [223.5, 103.2, 3], led: [202.1, 103.2] },
    // lenovo_m920q : photo détourée du ThinkCentre M920q Tiny (1 litre, vue de face debout), gros bouton rond en haut, voyant dessous
    // intel_nuc : photo détourée de l'Intel NUC 7 (boîtier carré vu de trois quarts), bouton marche carré à droite de la façade (voyant intégré)
    intel_nuc: { img: window.__acImg("mini-pc",5), x: 30, y: 58, w: 190, h: 90.2, aura: [125, 103, 108, 52], shadow: [125, 149, 98, 6],
      cable: 'M214 70 C 230 60 226 40 212 34', cableRev: 'M212 34 C 226 40 230 60 214 70',
      heat: ['M90 52 q-4 -6 0 -12 t0 -12', 'M125 50 q-4 -6 0 -12 t0 -12', 'M160 52 q-4 -6 0 -12 t0 -12'],
      air: ['M34 90 C 24 88 14 92 4 88', 'M34 102 C 24 100 14 104 4 100', 'M34 114 C 24 112 14 116 4 112', 'M34 126 C 24 124 14 128 4 124'],
      pwr: [196.5, 97.6, 4.3], led: [196.5, 97.6] },
    lenovo_m920q: { img: window.__acImg("mini-pc",6), x: 135, y: 15, w: 30.3, h: 150, aura: [150, 90, 50, 80], shadow: [150, 168, 30, 5],
      cable: 'M166 50 C 196 50 214 40 214 20', cableRev: 'M214 20 C 214 40 196 50 166 50',
      heat: ['M142 16 q-3 -4 0 -7 t0 -7', 'M150 16 q-3 -4 0 -7 t0 -7', 'M158 16 q-3 -4 0 -7 t0 -7'],
      air: ['M133 100 C 123 98 113 102 103 98', 'M133 112 C 123 110 113 114 103 110', 'M133 124 C 123 122 113 126 103 122', 'M133 136 C 123 134 113 138 103 134'],
      pwr: [146.1, 27.5, 4.7], led: [146.1, 37.2] },
    // lenovo_m715q : photo détourée du ThinkCentre M715q Tiny (vue de trois quarts, debout), gros bouton rond en haut de la façade, voyant dessous
    lenovo_m715q: { img: window.__acImg("mini-pc",7), x: 120, y: 15, w: 60.2, h: 150, aura: [150, 90, 55, 80], shadow: [150, 168, 32, 5],
      cable: 'M178 50 C 200 50 214 40 214 20', cableRev: 'M214 20 C 214 40 200 50 178 50',
      heat: ['M130 12 q-3 -4 0 -7 t0 -7', 'M142 12 q-3 -4 0 -7 t0 -7', 'M154 12 q-3 -4 0 -7 t0 -7'],
      air: ['M122 108 C 112 106 102 110 92 106', 'M122 120 C 112 118 102 122 92 118', 'M122 132 C 112 130 102 134 92 130', 'M122 144 C 112 142 102 146 92 142'],
      pwr: [129.8, 28.8, 4.8], led: [129.8, 37.8] },
    // home_assistant_green : photo détourée (capot transparent sur radiateur à ailettes), pas de bouton : voyant à l'angle avant
    home_assistant_green: { img: window.__acImg("mini-pc",8), x: 24, y: 40, w: 200, h: 113, aura: [124, 100, 118, 62], shadow: [124, 154, 100, 6],
      cable: 'M220 72 C 240 58 238 26 222 16', cableRev: 'M222 16 C 238 26 240 58 220 72',
      heat: ['M100 38 q-4 -6 0 -12 t0 -12', 'M126 34 q-4 -6 0 -12 t0 -12', 'M152 40 q-4 -6 0 -12 t0 -12'],
      air: ['M36 113 C 26 112 16 116 6 112', 'M54 122 C 44 121 34 125 24 121', 'M72 131 C 62 130 52 134 42 130', 'M91 140 C 81 139 71 143 61 139'],
      pwr: null, led: [120.4, 128.5] },
  };
  const modelOf = (c) => MODELS[c && c.model] || MODELS.bmax_b9;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --mp-ok:var(--appliance-ok-color,#43a047);--mp-warn:#ffa31a;--mp-alert:var(--appliance-alert-color,#db4437);--mp-blue:#2f9bff;
  --cpu:0;--ram:0;--dsk:0;--spd:2s;--net-d:0;--net-u:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--mp-ok) 22%,transparent);color:var(--mp-ok)}
.busy .badge{background:color-mix(in srgb,var(--mp-warn) 22%,transparent);color:var(--mp-warn)}
.hot .badge{background:color-mix(in srgb,var(--mp-alert) 22%,transparent);color:var(--mp-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--mp-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--mp-alert)}

/* ---- illustration ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:grayscale(.5) brightness(.62)}
/* halo derrière le boîtier : bleu en marche, rouge qui pulse en surchauffe */
.aura{opacity:0;transition:opacity .8s}
.idle .aura,.running .aura,.busy .aura{opacity:calc(.25 + var(--cpu) * .5)}
.hot .aura{opacity:.9;animation:mpaura 1.4s ease-in-out infinite}
.aura stop{transition:stop-color .6s}
.hot .aura stop{stop-color:#ff3b30}
@keyframes mpaura{50%{opacity:.35}}
/* bouton d'alimentation : anneau bleu qui respire */
.pwr{fill:none;stroke:var(--mp-blue);stroke-width:1.6;opacity:0;filter:drop-shadow(0 0 3px var(--mp-blue))}
.idle .pwr,.running .pwr,.busy .pwr,.hot .pwr{opacity:1;animation:mpbreath 3s ease-in-out infinite}
.hot .pwr{stroke:#ff3b30;filter:drop-shadow(0 0 3px #ff3b30);animation-duration:.8s}
@keyframes mpbreath{50%{opacity:.35}}
.led{fill:#fff;opacity:0}
.idle .led,.running .led,.busy .led,.hot .led{opacity:1;filter:drop-shadow(0 0 2px #fff)}
.busy .led,.hot .led{animation:mpblink .25s steps(2) infinite}
@keyframes mpblink{50%{opacity:.25}}
/* reflet qui balaie le boîtier (masqué par la silhouette de la photo) */
.glint{opacity:0}
.idle .glint,.running .glint,.busy .glint,.hot .glint{opacity:1;animation:mpglint 5s ease-in-out infinite}
@keyframes mpglint{0%,55%{transform:translateX(-140px)}100%{transform:translateX(260px)}}
/* air chaud qui sort des ouïes latérales */
.air path{fill:none;stroke:#9fd2ff;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:3 9;opacity:0}
.running .air path,.busy .air path,.hot .air path{opacity:calc(.35 + var(--cpu) * .6);animation:mpair var(--spd) linear infinite}
.hot .air path{stroke:#ff8a65}
.air path:nth-child(2){animation-delay:-.3s}.air path:nth-child(3){animation-delay:-.6s}.air path:nth-child(4){animation-delay:-.9s}
@keyframes mpair{to{stroke-dashoffset:24}}
/* chaleur au-dessus du capot */
.heat path{fill:none;stroke:#ffb74d;stroke-width:1.5;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.busy .heat path,.hot .heat path{animation:mpheat 2.2s ease-in infinite}
.hot .heat path{stroke:#ff5252}
.heat path:nth-child(2){animation-delay:-.7s}.heat path:nth-child(3){animation-delay:-1.4s}
@keyframes mpheat{0%{opacity:0;transform:translateY(6px) scaleY(.6)}35%{opacity:.85}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
/* réseau : paquets qui descendent (bleu) et montent (vert) le long du câble */
.cable{fill:none;stroke:#3a4148;stroke-width:2.4;stroke-linecap:round}
.pk{fill:none;stroke-width:2.6;stroke-linecap:round;opacity:0}
.pk.d{stroke:#4fc3ff;stroke-dasharray:.1 12}.pk.u{stroke:#5df28a;stroke-dasharray:.1 16}
.on-net .pk.d{opacity:calc(.25 + var(--net-d) * .75);animation:mpdown var(--sd,1.6s) linear infinite}
.on-net .pk.u{opacity:calc(.25 + var(--net-u) * .75);animation:mpup var(--su,1.6s) linear infinite}
@keyframes mpdown{to{stroke-dashoffset:-24}}@keyframes mpup{to{stroke-dashoffset:32}}
.globe{fill:none;stroke:#7d8791;stroke-width:1.1}
.on-net .globe{stroke:#4fc3ff;animation:mpglobe 4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}
@keyframes mpglobe{50%{stroke:#5df28a}}
/* jauges néon CPU / RAM / disque */
.gb{fill:#1d2126;stroke:#2c333a}
.gf{transform-box:fill-box;transform-origin:50% 100%;transition:transform 1s cubic-bezier(.3,1.4,.5,1),fill .4s}
.g-cpu .gf{transform:scaleY(var(--cpu));fill:url(#mp-gcpu)}.g-ram .gf{transform:scaleY(var(--ram));fill:url(#mp-gram)}.g-dsk .gf{transform:scaleY(var(--dsk));fill:url(#mp-gdsk)}
.gf.bad{fill:#ff3b30!important}
.busy .g-cpu .gf,.hot .g-cpu .gf{animation:mpjit .45s steps(3) infinite}
@keyframes mpjit{33%{opacity:.75}66%{opacity:1}}
.gl{fill:var(--secondary-text-color);font:600 5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.gv{fill:var(--primary-text-color);font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.gscan{fill:#fff;opacity:0}
.idle .gscan,.running .gscan,.busy .gscan,.hot .gscan{animation:mpscan 2.6s linear infinite;opacity:.25}
@keyframes mpscan{from{transform:translateY(0)}to{transform:translateY(-78px)}}
.off .gauges,.unavailable .gauges{opacity:.35}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (même règles que les autres cartes) ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .alert,.compact .info,.compact .goal{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
`;

  /* Photo de 360 × 238 px réduite à 220 de large, posée en (30, 26) : px photo × 0,611 + décalage */
  const SVG = (label, M) => `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="mp-aura"><stop offset="0" stop-color="#2f9bff" stop-opacity=".55"/><stop offset="1" stop-color="#2f9bff" stop-opacity="0"/></radialGradient>
  <radialGradient id="mp-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="mp-glint" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="mp-gcpu" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#00b3ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
  <linearGradient id="mp-gram" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#00e5a0"/><stop offset="1" stop-color="#00b3ff"/></linearGradient>
  <linearGradient id="mp-gdsk" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc400"/><stop offset="1" stop-color="#ff6d00"/></linearGradient>
  <mask id="mp-sil" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="180"><image href="${M.img}" x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}"/></mask>
  <clipPath id="mp-gclip"><rect x="252" y="40" width="9" height="80" rx="4.5"/><rect x="268" y="40" width="9" height="80" rx="4.5"/><rect x="284" y="40" width="9" height="80" rx="4.5"/></clipPath>
 </defs>
 <ellipse class="aura" cx="${M.aura[0]}" cy="${M.aura[1]}" rx="${M.aura[2]}" ry="${M.aura[3]}" fill="url(#mp-aura)"/>
 <ellipse cx="${M.shadow[0]}" cy="${M.shadow[1]}" rx="${M.shadow[2]}" ry="${M.shadow[3]}" fill="url(#mp-shadow)"/>
 <!-- câble réseau vers Internet -->
 <path class="cable" d="${M.cable}"/>
 <path class="pk d" d="${M.cableRev}"/>
 <path class="pk u" d="${M.cable}"/>
 <g class="globe"><circle cx="214" cy="12" r="7"/><ellipse cx="214" cy="12" rx="3" ry="7"/><path d="M207 12 H221 M208.5 8 H219.5 M208.5 16 H219.5"/></g>
 <g class="heat">${M.heat.map((d) => `<path d="${d}"/>`).join('')}</g>
 <g class="air">${M.air.map((d) => `<path d="${d}"/>`).join('')}</g>
 <image class="photo" href="${M.img}" x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}"/>
 <g mask="url(#mp-sil)"><g transform="skewX(-20)"><rect class="glint" x="0" y="0" width="70" height="180" fill="url(#mp-glint)"/></g></g>
 ${M.pwr ? `<circle class="pwr" cx="${M.pwr[0]}" cy="${M.pwr[1]}" r="${M.pwr[2]}"/>` : ''}
 <circle class="led" cx="${M.led[0]}" cy="${M.led[1]}" r="1.1"/>
 <!-- jauges -->
 <g class="gauges">
  <g class="g-cpu"><rect class="gb" x="252" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="252" y="40" width="9" height="80" rx="4.5"/></g>
  <g class="g-ram"><rect class="gb" x="268" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="268" y="40" width="9" height="80" rx="4.5"/></g>
  <g class="g-dsk"><rect class="gb" x="284" y="40" width="9" height="80" rx="4.5"/><rect class="gf" x="284" y="40" width="9" height="80" rx="4.5"/></g>
  <g clip-path="url(#mp-gclip)"><rect class="gscan" x="250" y="118" width="42" height="3"/></g>
  <text class="gl" x="256.5" y="130">CPU</text><text class="gl" x="272.5" y="130">RAM</text><text class="gl" x="288.5" y="130">SSD</text>
  <text class="gv" id="mp-vcpu" x="256.5" y="36">--</text><text class="gv" id="mp-vram" x="272.5" y="36">--</text><text class="gv" id="mp-vdsk" x="288.5" y="36">--</text>
 </g>
</svg>`;

  const TILES = [
    ['cpu', 'mdi:cpu-64-bit', 'show_cpu', 'entity_cpu'],
    ['temp', 'mdi:thermometer', 'show_temp', 'entity_cpu_temp'],
    ['ram', 'mdi:memory', 'show_ram', 'entity_ram'],
    ['disk', 'mdi:harddisk', 'show_disk', 'entity_disk'],
    ['down', 'mdi:download-network', 'show_down', 'entity_net_down'],
    ['up', 'mdi:upload-network', 'show_up', 'entity_net_up'],
    ['uptime', 'mdi:timer-outline', 'show_uptime', 'entity_uptime'],
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy', 'entity_energy'],
  ];

  // débit lisible : garde la famille de l'unité (octets ou bits) et choisit k / M / G
  const fmtRate = (v, unit, loc) => {
    const u = String(unit || '');
    const m = u.replace(/\s/g, '').match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)(\/s|ps)?$/);
    if (isNaN(v)) return ['--', u];
    if (!m) return [v.toLocaleString(loc, { maximumFractionDigits: v < 10 ? 1 : 0 }), u];
    const base = v * { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]];
    const bytes = /^(B|byte|Bps)$/.test(m[3]);
    const [div, p] = base >= 1e9 ? [1e9, 'G'] : base >= 1e6 ? [1e6, 'M'] : base >= 1e3 ? [1e3, 'k'] : [1, ''];
    const x = base / div;
    return [x.toLocaleString(loc, { maximumFractionDigits: x < 10 ? 1 : 0 }), bytes ? `${p}B/s` : `${p}bit/s`];
  };
  // débit → Mbit/s, quelle que soit l'unité (B/s, kB/s, KiB/s, MB/s, Mbit/s, kbps…)
  const toMbit = (v, unit) => {
    if (isNaN(v)) return NaN;
    const u = String(unit || '').replace(/\s/g, '');
    const m = u.match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)/);
    if (!m) return v;
    const mul = { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]] * (m[2] ? 1.024 : 1);
    const bits = /^(B|byte|Bps)$/.test(m[3]) ? 8 : 1;
    return (v * mul * bits) / 1e6;
  };

  class ApplianceMiniPcCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_cpu: f(/(processor_use|cpu_(use|usage|load|percent)|cpu_utili[sz]ation)/i, 'sensor'),
        entity_cpu_temp: f(/(cpu|processor|package).*temp/i, 'sensor'),
        entity_ram: f(/(memory_use_percent|memory_usage|ram_(used_)?percent|ram_use)/i, 'sensor'),
        entity_disk: f(/disk_use_percent|disk_usage|(root|disk).*used_percent/i, 'sensor'),
        entity_uptime: f(/last_boot|uptime/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_cpu: true, show_temp: true, show_ram: true, show_disk: true, show_network: true, show_uptime: true, show_power: true, show_energy: true,
        cpu_busy: 70, ram_max: 90, disk_max: 90, off_threshold: 3, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _watts(id) { const v = this._num(id); if (isNaN(v)) return NaN; return this._unit(id, 'W').toLowerCase() === 'kw' ? v * 1000 : v; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    // seuil de température saisi dans l'unité d'affichage ; valeur par défaut écrite en °C, convertie (°F)
    _tlim(k, defC) { const v = this._c[k]; return v != null && v !== '' ? Number(v) : window.applianceTemp ? window.applianceTemp(this._hass, this._c).c(defC) : defC; }
    _temp(id) {
      const s = this._st(id), v = this._num(id);
      if (!window.applianceTemp) return { v, unit: '°C' };
      const tt = window.applianceTemp(this._hass, this._c);
      return { v: tt.conv(v, s), unit: tt.unit };
    }
    // temps écoulé depuis le démarrage : capteur horodaté (« Last boot ») ou durée (s, min, h, d)
    _uptimeSec(id) {
      const s = this._st(id); if (!s) return NaN;
      const raw = String(s.state);
      if (/^\d{4}-\d\d-\d\d/.test(raw)) { const t = Date.parse(raw); return isNaN(t) ? NaN : Math.max(0, (Date.now() - t) / 1000); }
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 's').toLowerCase();
      return v * (/^d/.test(u) ? 86400 : /^h/.test(u) ? 3600 : /^min/.test(u) ? 60 : 1);
    }
    _dur(sec) {
      if (isNaN(sec)) return '--';
      const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
      return d ? `${d} ${this._t('d')} ${h} h` : h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mptitle"></div><div class="badge" id="mpbadge"></div></div>
        ${SVG(this._c.name || this._t('name'), modelOf(this._c))}
        <div class="alert" id="mpalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_cpu));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k); this._more(this._c[t[3]]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const cpu = this._num(c.entity_cpu), ram = this._num(c.entity_ram), dsk = this._num(c.entity_disk);
      const tp = this._temp(c.entity_cpu_temp), pw = this._watts(c.entity_power);
      const raw = s ? String(s.state).toLowerCase() : '';
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && /^(off|not_home|offline|down|false|stopped)$/.test(raw)) st = 'off';
      else if (!s && !isNaN(pw) && pw < Number(c.off_threshold) && isNaN(cpu)) st = 'off';
      else if (!s && c.entity_cpu && isNaN(cpu)) st = 'unavailable';
      else st = 'running';
      const alerts = [];
      if (st === 'running') {
        if (!isNaN(tp.v) && tp.v >= this._tlim('temp_max', 85)) { st = 'hot'; alerts.push('overheating'); }
        else if (!isNaN(cpu) && cpu >= Number(c.cpu_busy)) st = 'busy';
        else if (!isNaN(cpu) && cpu < 8) st = 'idle';
      }
      if (st !== 'off' && st !== 'unavailable') {
        if (!isNaN(dsk) && dsk >= Number(c.disk_max)) alerts.push('disk_full');
        if (!isNaN(ram) && ram >= Number(c.ram_max)) alerts.push('ram_full');
      }
      return { st, cpu, ram, dsk, tp, pw, alerts };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, cpu, ram, dsk, tp, pw, alerts } = this._compute();
      const on = st !== 'off' && st !== 'unavailable';
      const clamp = (x) => Math.max(0, Math.min(1, isNaN(x) ? 0 : x));
      // débits en Mbit/s, intensité sur une échelle log (1 kbit/s → 0, 1 Gbit/s → 1)
      const dn = toMbit(this._num(c.entity_net_down), this._unit(c.entity_net_down)), upr = toMbit(this._num(c.entity_net_up), this._unit(c.entity_net_up));
      const lvl = (m) => (isNaN(m) || m <= 0.001 ? 0 : clamp((Math.log10(m) + 3) / 6));
      const nd = lvl(dn), nu = lvl(upr), net = on && (nd > 0 || nu > 0);
      card.className = `${st}${net ? ' on-net' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const set = (k, v) => card.style.setProperty(k, v);
      set('--cpu', on ? clamp(cpu / 100).toFixed(3) : 0); set('--ram', clamp(ram / 100).toFixed(3)); set('--dsk', clamp(dsk / 100).toFixed(3));
      set('--spd', `${(2.4 - clamp(cpu / 100) * 1.9).toFixed(2)}s`);
      set('--net-d', nd.toFixed(2)); set('--net-u', nu.toFixed(2));
      set('--sd', `${(2.2 - nd * 1.8).toFixed(2)}s`); set('--su', `${(2.2 - nu * 1.8).toFixed(2)}s`);
      const pct = (v) => (isNaN(v) ? '--' : `${Math.round(v)}`);
      r.getElementById('mp-vcpu').textContent = pct(cpu); r.getElementById('mp-vram').textContent = pct(ram); r.getElementById('mp-vdsk').textContent = pct(dsk);
      r.querySelector('.g-ram .gf').classList.toggle('bad', alerts.includes('ram_full'));
      r.querySelector('.g-dsk .gf').classList.toggle('bad', alerts.includes('disk_full'));
      r.querySelector('.g-cpu .gf').classList.toggle('bad', st === 'hot');

      r.getElementById('mptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('mpbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('mpalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      const fmtNet = (id) => fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass));
      const V = {
        cpu: [this._fmt(cpu, 0), '%'], temp: [this._fmt(tp.v, 0), tp.unit], ram: [this._fmt(ram, 0), '%'], disk: [this._fmt(dsk, 0), '%'],
        down: fmtNet(c.entity_net_down), up: fmtNet(c.entity_net_up), uptime: [this._dur(this._uptimeSec(c.entity_uptime)), ''],
        power: [this._fmt(pw, 0), 'W'], energy: [this._fmt(this._num(c.entity_energy), 2), this._unit(c.entity_energy, 'kWh')],
      };
      const bad = { temp: st === 'hot', ram: alerts.includes('ram_full'), disk: alerts.includes('disk_full') };
      TILES.forEach(([k, , opt, ent]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        el.classList.toggle('hide', !c[ent] || c[opt] === false || (c.show_network === false && (k === 'down' || k === 'up')));
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceMiniPcCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMiniPcCardEditor extends HTMLElement {
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
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      // seuils de température dans l'unité d'affichage (bornes et valeur par défaut données en °C)
      const tc = window.applianceTemp(this._hass, this._c);
      const tnum = (name, min, max, step, def) => ({ name, default: Math.round(tc.c(def)), selector: { number: { ...tc.range(min, max), step, mode: 'box', unit_of_measurement: tc.unit } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.keys(MODELS).map((value) => ({ value, label: tr[`model_${value}`] || T.en[`model_${value}`] || value })) } } },
        ent('entity'), ent('entity_cpu', 'sensor'), ent('entity_cpu_temp', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_disk', 'sensor'),
        ent('entity_net_down', 'sensor'), ent('entity_net_up', 'sensor'), ent('entity_uptime', 'sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { name: 'extra_tiles', selector: { object: {} } },
        { type: 'grid', name: '', schema: [num('cpu_busy', 10, 100, 1, 70, '%'), tnum('temp_max', 40, 110, 1, 85), num('ram_max', 10, 100, 1, 90, '%'), num('disk_max', 10, 100, 1, 90, '%')] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_cpu'), bool('show_temp'), bool('show_ram'), bool('show_disk'), bool('show_down'), bool('show_up'), bool('show_uptime'), bool('show_power'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'mini_pc_model' : s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceMiniPcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Mini PC BMAX B9 Max en photo : bouton qui respire, air chaud des ouïes, paquets réseau, jauges CPU / RAM / disque (Glances, System Monitor).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
