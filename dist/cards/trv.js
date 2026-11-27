/* Carte « Tête thermostatique » — custom:appliance-trv-card (issue #208)
 * Tête thermostatique de radiateur à eau (photo détourée d'une Tado X) ou thermostat connecté (option model :
 * netatmo, nest, tado, t6 = Honeywell Home T6) : l'écran est redessiné en direct
 * (consigne en grand, température mesurée, ondes de chauffe animées, OFF, fenêtre ouverte), halo orange
 * qui respire en chauffe, flocons bleus quand la fenêtre est ouverte.
 * entity : l'entité climate de la tête (Zigbee2MQTT, ZHA, Tado, Netatmo…) — température, consigne, hvac_action.
 * Modèles en photo : netatmo_trv, netatmo_trv2, danfoss, shelly, somfy, atlantic_io, atlantic_io2 (thermostats Atlantic io / Overkiz) ; classic = tête générique dessinée.
 * Dérogation (Netatmo) : la consigne − / + peut valoir pour une durée (45 min, 3 h, 12 h…), puis retour au planning.
 * Options : consigne réglable − / + (envoyée 0,8 s après le dernier clic), boutons de mode (show_hvac_modes),
 * capteur de fenêtre (entity_window, sinon l'attribut window_open de la tête), batterie (entity_battery, sinon
 * l'attribut battery), ouverture de vanne en % (entity_valve_position, sinon pi_heating_demand / valve_position).
 */
(() => {
  const TAG = 'appliance-trv-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Radiator valve","idle":"At target","heating":"Heating","off":"Off","window":"Window open","unavailable":"Unavailable","window_alert":"Window open: heating paused","target":"Target","temperature":"Temperature","valve":"Valve","battery":"Battery","open":"Open","closed":"Closed","model":"Model","model_trv":"Radiator valve (Tado X)","model_netatmo":"Netatmo thermostat","model_nest":"Google Nest thermostat","model_tado":"Tado X wall thermostat","model_t6":"Honeywell Home T6 thermostat","model_bht6000":"Tuya BHT6000 thermostat (round, black screen)","model_vitotrol":"Viessmann Vitotrol 200 thermostat","model_atlantic_io":"Atlantic io thermostat (square, Zone Control)","model_atlantic_io2":"Atlantic io thermostat (vertical, dial)","model_classic":"Radiator valve (classic)","model_netatmo_trv":"Netatmo valve (1st gen.)","model_netatmo_trv2":"Netatmo valve (new)","model_danfoss":"Danfoss Ally valve","model_shelly":"Shelly TRV valve","model_somfy":"Somfy io valve","duration":"Duration","dur_default":"Default","resume":"Back to schedule"},"cs":{"name":"Termostatická hlavice","idle":"Na cílové teplotě","heating":"Topí","off":"Vypnuto","window":"Otevřené okno","unavailable":"Nedostupné","window_alert":"Otevřené okno: topení pozastaveno","target":"Cíl","temperature":"Teplota","valve":"Ventil","battery":"Baterie","open":"Otevřeno","closed":"Zavřeno","model":"Model","model_trv":"Termostatická hlavice (Tado X)","model_netatmo":"Termostat Netatmo","model_nest":"Termostat Google Nest","model_tado":"Nástěnný termostat Tado X","model_t6":"Termostat Honeywell Home T6","model_bht6000":"Termostat Tuya BHT6000 (kulatý, černý displej)"},"da":{"name":"Radiatortermostat","idle":"Mål nået","heating":"Varmer","off":"Slukket","window":"Vindue åbent","unavailable":"Utilgængelig","window_alert":"Vindue åbent: varme sat på pause","target":"Mål","temperature":"Temperatur","valve":"Ventil","battery":"Batteri","open":"Åben","closed":"Lukket","model":"Model","model_trv":"Radiatortermostat (Tado X)","model_netatmo":"Netatmo-termostat","model_nest":"Google Nest-termostat","model_tado":"Tado X rumtermostat","model_t6":"Honeywell Home T6-termostat","model_bht6000":"Tuya BHT6000-termostat (rund, sort skærm)","model_atlantic_io":"Atlantic io-termostat (firkantet, Zone Control)","model_atlantic_io2":"Atlantic io-termostat (lodret, drejeknap)","model_classic":"Radiatortermostat (klassisk)","model_netatmo_trv":"Netatmo-termostat (1. gen.)","model_netatmo_trv2":"Netatmo-termostat (ny)","model_danfoss":"Danfoss Ally-termostat","model_shelly":"Shelly TRV-termostat","model_somfy":"Somfy io-termostat","duration":"Varighed","dur_default":"Standard","resume":"Tilbage til tidsplan"},"de":{"name":"Heizkörperthermostat","idle":"Temperatur erreicht","heating":"Heizt","off":"Aus","window":"Fenster offen","unavailable":"Nicht verfügbar","window_alert":"Fenster offen: Heizung pausiert","target":"Solltemperatur","temperature":"Temperatur","valve":"Ventil","battery":"Batterie","open":"Offen","closed":"Geschlossen","model":"Modell","model_trv":"Heizkörperthermostat (Tado X)","model_netatmo":"Netatmo-Thermostat","model_nest":"Google-Nest-Thermostat","model_tado":"Tado X Wandthermostat","model_t6":"Honeywell Home T6 Thermostat","model_bht6000":"Tuya BHT6000 Thermostat (rund, schwarzes Display)","model_classic":"Heizkörperthermostat (klassisch)","model_netatmo_trv":"Netatmo-Thermostat (1. Gen.)","model_netatmo_trv2":"Netatmo-Thermostat (neu)","model_danfoss":"Danfoss Ally Thermostat","model_shelly":"Shelly TRV Thermostat","model_somfy":"Somfy io Thermostat","duration":"Dauer","dur_default":"Standard","resume":"Zurück zum Zeitplan","model_vitotrol":"Viessmann Vitotrol 200 Thermostat","model_atlantic_io":"Atlantic io Thermostat (quadratisch, Zone Control)","model_atlantic_io2":"Atlantic io Thermostat (vertikal, Drehrad)"},"es":{"name":"Válvula de radiador","idle":"En objetivo","heating":"Calentando","off":"Apagada","window":"Ventana abierta","unavailable":"No disponible","window_alert":"Ventana abierta: calefacción en pausa","target":"Objetivo","temperature":"Temperatura","valve":"Válvula","battery":"Batería","open":"Abierta","closed":"Cerrada","model":"Modelo","model_trv":"Válvula de radiador (Tado X)","model_netatmo":"Termostato Netatmo","model_nest":"Termostato Google Nest","model_tado":"Termostato de pared Tado X","model_t6":"Termostato Honeywell Home T6","model_bht6000":"Termostato Tuya BHT6000 (redondo, pantalla negra)","model_vitotrol":"Termostato Viessmann Vitotrol 200","model_atlantic_io":"Termostato Atlantic io (cuadrado, Zone Control)","model_atlantic_io2":"Termostato Atlantic io (vertical, dial)","model_classic":"Válvula de radiador (clásica)","model_netatmo_trv":"Válvula Netatmo (1.ª gen.)","model_netatmo_trv2":"Válvula Netatmo (nueva)","model_danfoss":"Válvula Danfoss Ally","model_shelly":"Válvula Shelly TRV","model_somfy":"Válvula Somfy io","duration":"Duración","dur_default":"Por defecto","resume":"Volver al horario"},"fr":{"name":"Tête thermostatique","idle":"En pause","heating":"En chauffe","off":"Éteinte","window":"Fenêtre ouverte","unavailable":"Indisponible","window_alert":"Fenêtre ouverte : chauffage en pause","target":"Consigne","temperature":"Température","valve":"Vanne","battery":"Batterie","open":"Ouverte","closed":"Fermée","model":"Modèle","model_trv":"Tête thermostatique (Tado X)","model_netatmo":"Thermostat Netatmo","model_nest":"Thermostat Google Nest","model_tado":"Thermostat mural Tado X","model_t6":"Thermostat Honeywell Home T6","model_bht6000":"Thermostat Tuya BHT6000 (rond, écran noir)","model_vitotrol":"Thermostat Viessmann Vitotrol 200","model_atlantic_io":"Thermostat Atlantic io (carré, Zone Control)","model_atlantic_io2":"Thermostat Atlantic io (vertical, molette)","model_classic":"Tête thermostatique (classique)","model_netatmo_trv":"Tête Netatmo (1re génération)","model_netatmo_trv2":"Tête Netatmo (nouvelle)","model_danfoss":"Tête Danfoss Ally","model_shelly":"Tête Shelly TRV","model_somfy":"Tête Somfy io","duration":"Durée","dur_default":"Défaut","resume":"Reprendre le planning"},"hu":{"name":"Radiátorszelep","idle":"Célértéken","heating":"Fűtés","off":"Ki","window":"Ablak nyitva","unavailable":"Nem elérhető","window_alert":"Ablak nyitva: fűtés szünetel","target":"Cél","temperature":"Hőmérséklet","valve":"Szelep","battery":"Akkumulátor","open":"Nyitva","closed":"Zárva","model":"Modell","model_trv":"Radiátorszelep (Tado X)","model_netatmo":"Netatmo termosztát","model_nest":"Google Nest termosztát","model_tado":"Tado X fali termosztát","model_t6":"Honeywell Home T6 termosztát","model_bht6000":"Tuya BHT6000 termosztát (kerek, fekete kijelző)","model_atlantic_io":"Atlantic io termosztát (négyzet, Zone Control)","model_atlantic_io2":"Atlantic io termosztát (függőleges, tárcsa)","model_classic":"Radiátorszelep (klasszikus)","model_netatmo_trv":"Netatmo szelep (1. gen.)","model_netatmo_trv2":"Netatmo szelep (új)","model_danfoss":"Danfoss Ally szelep","model_shelly":"Shelly TRV szelep","model_somfy":"Somfy io szelep","duration":"Időtartam","dur_default":"Alapértelmezett","resume":"Vissza az ütemezéshez"},"it":{"name":"Valvola termostatica","idle":"Temperatura raggiunta","heating":"In riscaldamento","off":"Spenta","window":"Finestra aperta","unavailable":"Non disponibile","window_alert":"Finestra aperta: riscaldamento in pausa","target":"Temperatura impostata","temperature":"Temperatura","valve":"Valvola","battery":"Batteria","open":"Aperta","closed":"Chiusa","model":"Modello","model_trv":"Valvola termostatica (Tado X)","model_netatmo":"Termostato Netatmo","model_nest":"Termostato Google Nest","model_tado":"Termostato a parete Tado X","model_t6":"Termostato Honeywell Home T6","model_bht6000":"Termostato Tuya BHT6000 (rotondo, schermo nero)","model_classic":"Testa termostatica (classica)","model_netatmo_trv":"Testa Netatmo (1ª gen.)","model_netatmo_trv2":"Testa Netatmo (nuova)","model_danfoss":"Testa Danfoss Ally","model_shelly":"Testa Shelly TRV","model_somfy":"Testa Somfy io","duration":"Durata","dur_default":"Predefinita","resume":"Torna al programma"},"nb":{"name":"Radiatortermostat","idle":"Måltemperatur nådd","heating":"Varmer","off":"Av","window":"Vindu åpent","unavailable":"Utilgjengelig","window_alert":"Vindu åpent: oppvarming på pause","target":"Måltemperatur","temperature":"Temperatur","valve":"Ventil","battery":"Batteri","open":"Åpent","closed":"Lukket","model":"Modell","model_trv":"Radiatortermostat (Tado X)","model_netatmo":"Netatmo-termostat","model_nest":"Google Nest-termostat","model_tado":"Tado X veggtermostat","model_t6":"Honeywell Home T6-termostat","model_bht6000":"Tuya BHT6000-termostat (rund, svart skjerm)","model_classic":"Radiatortermostat (klassisk)","model_netatmo_trv":"Netatmo-termostat (1. gen.)","model_netatmo_trv2":"Netatmo-termostat (ny)","model_danfoss":"Danfoss Ally-termostat","model_shelly":"Shelly TRV-termostat","model_somfy":"Somfy io-termostat","duration":"Varighet","dur_default":"Standard","resume":"Tilbake til timeplan"},"nl":{"name":"Radiatorkraan","idle":"Doel bereikt","heating":"Verwarmt","off":"Uit","window":"Raam open","unavailable":"Niet beschikbaar","window_alert":"Raam open: verwarming gepauzeerd","target":"Doeltemperatuur","temperature":"Temperatuur","valve":"Klep","battery":"Batterij","open":"Open","closed":"Dicht","model":"Model","model_trv":"Radiatorkraan (Tado X)","model_netatmo":"Netatmo-thermostaat","model_nest":"Google Nest-thermostaat","model_tado":"Tado X wandthermostaat","model_t6":"Honeywell Home T6-thermostaat","model_bht6000":"Tuya BHT6000-thermostaat (rond, zwart scherm)","model_classic":"Radiatorkraan (klassiek)","model_netatmo_trv":"Netatmo-radiatorkraan (1e gen.)","model_netatmo_trv2":"Netatmo-radiatorkraan (nieuw)","model_danfoss":"Danfoss Ally-radiatorkraan","model_shelly":"Shelly TRV-radiatorkraan","model_somfy":"Somfy io-radiatorkraan","duration":"Duur","dur_default":"Standaard","resume":"Terug naar schema"},"pl":{"name":"Zawór grzejnikowy","idle":"Osiągnięto cel","heating":"Grzanie","off":"Wył.","window":"Okno otwarte","unavailable":"Niedostępny","window_alert":"Okno otwarte: ogrzewanie wstrzymane","target":"Cel","temperature":"Temperatura","valve":"Zawór","battery":"Bateria","open":"Otwarta","closed":"Zamknięta","model":"Model","model_trv":"Zawór grzejnikowy (Tado X)","model_netatmo":"Termostat Netatmo","model_nest":"Termostat Google Nest","model_tado":"Termostat ścienny Tado X","model_t6":"Termostat Honeywell Home T6","model_bht6000":"Termostat Tuya BHT6000 (okrągły, czarny ekran)","model_classic":"Zawór grzejnikowy (klasyczny)","model_netatmo_trv":"Zawór Netatmo (1. gen.)","model_netatmo_trv2":"Zawór Netatmo (nowy)","model_danfoss":"Zawór Danfoss Ally","model_shelly":"Zawór Shelly TRV","model_somfy":"Zawór Somfy io","duration":"Czas trwania","dur_default":"Domyślny","resume":"Powrót do harmonogramu"},"pt-BR":{"name":"Válvula do radiador","idle":"Temperatura desejada atingida","heating":"Aquecendo","off":"Desligado","window":"Janela aberta","unavailable":"Indisponível","window_alert":"Janela aberta: aquecimento em pausa","target":"Desejada","temperature":"Temperatura","valve":"Válvula","battery":"Bateria","open":"Aberto","closed":"Fechado","model":"Modelo","model_trv":"Válvula do radiador (Tado X)","model_netatmo":"Termostato Netatmo","model_nest":"Termostato Google Nest","model_tado":"Termostato de parede Tado X","model_t6":"Termostato Honeywell Home T6","model_bht6000":"Termostato Tuya BHT6000 (redondo, tela preta)","model_vitotrol":"Termostato Viessmann Vitotrol 200","model_atlantic_io":"Termostato Atlantic io (quadrado, Zone Control)","model_atlantic_io2":"Termostato Atlantic io (vertical, mostrador)","model_classic":"Válvula do radiador (clássica)","model_netatmo_trv":"Válvula Netatmo (1ª geração)","model_netatmo_trv2":"Válvula Netatmo (nova)","model_danfoss":"Válvula Danfoss Ally","model_shelly":"Válvula Shelly TRV","model_somfy":"Válvula Somfy io","duration":"Duração","dur_default":"Padrão","resume":"Voltar ao horário"},"pt-PT":{"name":"Válvula do radiador","idle":"Temperatura pretendida atingida","heating":"A aquecer","off":"Desligado","window":"Janela aberta","unavailable":"Indisponível","window_alert":"Janela aberta: aquecimento em pausa","target":"Pretendida","temperature":"Temperatura","valve":"Válvula","battery":"Bateria","open":"Aberto","closed":"Fechado","model":"Modelo","model_trv":"Válvula do radiador (Tado X)","model_netatmo":"Termóstato Netatmo","model_nest":"Termóstato Google Nest","model_tado":"Termóstato de parede Tado X","model_t6":"Termóstato Honeywell Home T6","model_bht6000":"Termóstato Tuya BHT6000 (redondo, ecrã preto)","model_vitotrol":"Termóstato Viessmann Vitotrol 200","model_atlantic_io":"Termóstato Atlantic io (quadrado, Zone Control)","model_atlantic_io2":"Termóstato Atlantic io (vertical, mostrador)","model_classic":"Válvula do radiador (clássica)","model_netatmo_trv":"Válvula Netatmo (1.ª geração)","model_netatmo_trv2":"Válvula Netatmo (nova)","model_danfoss":"Válvula Danfoss Ally","model_shelly":"Válvula Shelly TRV","model_somfy":"Válvula Somfy io","duration":"Duração","dur_default":"Predefinição","resume":"Voltar ao horário"},"ro":{"name":"Cap termostatic","idle":"Temperatură atinsă","heating":"Încălzește","off":"Oprit","window":"Fereastră deschisă","unavailable":"Indisponibil","window_alert":"Fereastră deschisă: încălzire în pauză","target":"Temperatură setată","temperature":"Temperatură","valve":"Supapă","battery":"Baterie","open":"Deschisă","closed":"Închisă","model":"Model","model_trv":"Cap termostatic (Tado X)","model_netatmo":"Termostat Netatmo","model_nest":"Termostat Google Nest","model_tado":"Termostat de perete Tado X","model_t6":"Termostat Honeywell Home T6","model_bht6000":"Termostat Tuya BHT6000 (rotund, ecran negru)","model_classic":"Cap termostatic (clasic)","model_netatmo_trv":"Cap Netatmo (gen. 1)","model_netatmo_trv2":"Cap Netatmo (nou)","model_danfoss":"Cap Danfoss Ally","model_shelly":"Cap Shelly TRV","model_somfy":"Cap Somfy io","duration":"Durată","dur_default":"Implicit","resume":"Revino la program"},"ru":{"name":"Термоголовка радиатора","idle":"Температура достигнута","heating":"Нагрев","off":"Выключена","window":"Окно открыто","unavailable":"Недоступно","window_alert":"Окно открыто: отопление приостановлено","target":"Уставка","temperature":"Температура","valve":"Клапан","battery":"Батарея","open":"Открыто","closed":"Закрыто","model":"Модель","model_trv":"Термоголовка (Tado X)","model_netatmo":"Термостат Netatmo","model_nest":"Термостат Google Nest","model_tado":"Настенный термостат Tado X","model_t6":"Термостат Honeywell Home T6","model_bht6000":"Термостат Tuya BHT6000 (круглый, чёрный экран)","model_vitotrol":"Термостат Viessmann Vitotrol 200","model_atlantic_io":"Термостат Atlantic io (квадратный, Zone Control)","model_atlantic_io2":"Термостат Atlantic io (вертикальный, поворотный)","model_classic":"Термоголовка (классическая)","model_netatmo_trv":"Термоголовка Netatmo (1-е пок.)","model_netatmo_trv2":"Термоголовка Netatmo (новая)","model_danfoss":"Термоголовка Danfoss Ally","model_shelly":"Термоголовка Shelly TRV","model_somfy":"Термоголовка Somfy io","duration":"Длительность","dur_default":"По умолчанию","resume":"Вернуться к расписанию"},"sr":{"name":"Радијаторски вентил","idle":"На циљној темп.","heating":"Грејање","off":"Искључено","window":"Прозор отворен","unavailable":"Недоступно","window_alert":"Прозор отворен: грејање паузирано","target":"Циљна","temperature":"Температура","valve":"Вентил","battery":"Батерија","open":"Отворен","closed":"Затворен","model":"Модел","model_trv":"Радијаторски вентил (Tado X)","model_netatmo":"Netatmo термостат","model_nest":"Google Nest термостат","model_tado":"Tado X зидни термостат","model_t6":"Honeywell Home T6 термостат","model_bht6000":"Tuya BHT6000 термостат (округли, црни екран)","model_vitotrol":"Viessmann Vitotrol 200 термостат","model_atlantic_io":"Atlantic io термостат (квадратни, Zone Control)","model_atlantic_io2":"Atlantic io термостат (вертикални, точкић)","model_classic":"Радијаторски вентил (класични)","model_netatmo_trv":"Netatmo вентил (1. ген.)","model_netatmo_trv2":"Netatmo вентил (нови)","model_danfoss":"Danfoss Ally вентил","model_shelly":"Shelly TRV вентил","model_somfy":"Somfy io вентил","duration":"Трајање","dur_default":"Подразумевано","resume":"Назад на распоред"},"sr-Latn":{"name":"Radijatorski ventil","idle":"Na ciljnoj temp.","heating":"Grejanje","off":"Isključeno","window":"Prozor otvoren","unavailable":"Nedostupno","window_alert":"Prozor otvoren: grejanje pauzirano","target":"Ciljna","temperature":"Temperatura","valve":"Ventil","battery":"Baterija","open":"Otvoren","closed":"Zatvoren","model":"Model","model_trv":"Radijatorski ventil (Tado X)","model_netatmo":"Netatmo termostat","model_nest":"Google Nest termostat","model_tado":"Tado X zidni termostat","model_t6":"Honeywell Home T6 termostat","model_bht6000":"Tuya BHT6000 termostat (okrugli, crni ekran)","model_vitotrol":"Viessmann Vitotrol 200 termostat","model_atlantic_io":"Atlantic io termostat (kvadratni, Zone Control)","model_atlantic_io2":"Atlantic io termostat (vertikalni, točkić)","model_classic":"Radijatorski ventil (klasični)","model_netatmo_trv":"Netatmo ventil (1. gen.)","model_netatmo_trv2":"Netatmo ventil (novi)","model_danfoss":"Danfoss Ally ventil","model_shelly":"Shelly TRV ventil","model_somfy":"Somfy io ventil","duration":"Trajanje","dur_default":"Podrazumevano","resume":"Nazad na raspored"},"uk":{"name":"Радіаторний клапан","idle":"Ціль досягнуто","heating":"Нагрівання","off":"Вимк.","window":"Вікно відчинене","unavailable":"Недоступно","window_alert":"Вікно відчинене: нагрівання призупинено","target":"Ціль","temperature":"Температура","valve":"Клапан","battery":"Батарея","open":"Відчинено","closed":"Зачинено","model":"Модель","model_trv":"Радіаторний клапан (Tado X)","model_netatmo":"Термостат Netatmo","model_nest":"Термостат Google Nest","model_tado":"Настінний термостат Tado X","model_t6":"Термостат Honeywell Home T6","model_bht6000":"Термостат Tuya BHT6000 (круглий, чорний екран)","model_vitotrol":"Термостат Viessmann Vitotrol 200","model_atlantic_io":"Термостат Atlantic io (квадратний, Zone Control)","model_atlantic_io2":"Термостат Atlantic io (вертикальний, з диском)","model_classic":"Радіаторний клапан (класичний)","model_netatmo_trv":"Клапан Netatmo (1-ше покоління)","model_netatmo_trv2":"Клапан Netatmo (новий)","model_danfoss":"Клапан Danfoss Ally","model_shelly":"Клапан Shelly TRV","model_somfy":"Клапан Somfy io","duration":"Тривалість","dur_default":"Типово","resume":"Повернутися до розкладу"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const HVAC_ICON = { off: 'mdi:power', heat: 'mdi:fire', cool: 'mdi:snowflake', heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:thermostat-auto', dry: 'mdi:water-percent', fan_only: 'mdi:fan' };
  const HVAC_ORDER = ['off', 'fan_only', 'dry', 'cool', 'heat', 'heat_cool', 'auto'];
  /* Modèles : photo détourée + écran redessiné en direct. Coordonnées en pixels de chaque photo.
   * big : valeur affichée en grand ('target' = consigne, 'current' = température mesurée) ; pendant un réglage − / +,
   * l'écran montre toujours la nouvelle consigne, comme sur l'appareil. */
  const IMGS = {
    trv: window.__acImg("trv",0),
    netatmo: window.__acImg("trv",1),
    nest: window.__acImg("trv",2),
    tado: window.__acImg("trv",3),
    t6: window.__acImg("trv",4),
    netatmo_trv: window.__acImg("trv",5),
    netatmo_trv2: window.__acImg("trv",6),
    danfoss: window.__acImg("trv",7),
    shelly: window.__acImg("trv",8),
    atlantic_io: window.__acImg("trv",9),
    atlantic_io2: window.__acImg("trv",10),
    somfy: window.__acImg("trv",11),
    vitotrol: window.__acImg("trv",12),
  };
  // anneaux lumineux de la Netatmo 1re génération, affichés seulement en chauffe (calque posé sur la photo)
  const RING = window.__acImg("trv",13);
  // modèles sans écran : la carte a besoin des deux textes, ils restent masqués
  const NOTXT = '<text id="tvbig" display="none"></text><text id="tvsmall" display="none"></text>';
  const DOTS = '<pattern id="tvdots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.9" fill="#fff"/></pattern>';
  const SNOW = (x, y, s, col) => `<g class="tv-snow" stroke="${col}" stroke-width="${s / 8}" stroke-linecap="round"><path d="M${x} ${y - s / 2} v${s} M${x - s * .43} ${y - s / 4} l${s * .86} ${s / 2} M${x - s * .43} ${y + s / 4} l${s * .86} ${-s / 2}"/></g>`;
  const FLAME = (x, y, s, col) => `<path class="tv-heat" transform="translate(${x} ${y}) scale(${s / 24})" fill="${col}" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26z"/>`;
  const MODELS = {
    // tête thermostatique Tado X : écran rond (centre 176,159, rayon 100)
    trv: { w: 357, h: 274, big: 'target', glow: [188, 155, 150, 156], svg: () => `
      <circle cx="176" cy="159" r="99" fill="url(#tvscr)"/>
      <g class="tv-heat tv-waves" fill="none" stroke="#f5a623" stroke-width="3.2" stroke-linecap="round">
        ${[0, 1, 2].map((i) => `<path class="tv-w tv-w${i + 1}" d="M${164 + i * 12} 112 q-5 -6 0 -12 q5 -6 0 -12"/>`).join('')}</g>
      <text class="tv-txt tv-big" id="tvbig" x="176" y="182" text-anchor="middle" font-size="62" font-weight="300" letter-spacing="-1">--</text>
      <g class="tv-txt" opacity=".9"><path d="M146 207 v14 a5 5 0 1 0 6 0 v-14 a3 3 0 0 0 -6 0z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="149" cy="225" r="2.6" fill="#fff"/>
        <text id="tvsmall" x="160" y="226" font-size="19">--</text></g>
      ${SNOW(176, 98, 24, '#7cc4ff')}` },
    // Netatmo : écran e-ink gris ; en grand la température mesurée, en petit la consigne
    netatmo: { w: 416, h: 398, big: 'current', glow: [208, 199, 250, 250], svg: () => `
      <rect x="147" y="93" width="134" height="200" fill="url(#tvink)"/>
      <text class="tv-ink tv-big" id="tvbig" x="212" y="196" text-anchor="middle" font-size="44" font-weight="700" letter-spacing="-1">--</text>
      <text class="tv-ink" x="262" y="125" font-size="15" font-weight="700">°C</text>
      ${FLAME(158, 238, 24, '#222')}
      <text class="tv-ink" id="tvsmall" x="232" y="264" text-anchor="middle" font-size="28" font-weight="700" opacity=".8">--</text>
      ${SNOW(170, 116, 20, '#222')}` },
    // Google Nest : écran noir rond, arc de consigne ; fond orange en chauffe
    nest: { w: 398, h: 398, big: 'target', glow: [199, 199, 230, 230], svg: () => `
      <circle cx="199" cy="199" r="184" fill="url(#tvnest)"/>
      <circle class="tv-nestheat" cx="199" cy="199" r="184" fill="url(#tvnesth)"/>
      <path d="${ARC}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="10" stroke-linecap="round"/>
      <path class="tv-arc" id="tvarc" d="${ARC}" fill="none" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"/>
      <path class="tv-hit" id="tvhit" d="${ARC}" fill="none" stroke="transparent" stroke-width="56" stroke-linecap="round"/>
      <text class="tv-txt" id="tvmode" x="199" y="128" text-anchor="middle" font-size="20" font-weight="600" letter-spacing="2" opacity=".85"></text>
      <text class="tv-txt tv-big" id="tvbig" x="199" y="236" text-anchor="middle" font-size="104" font-weight="400">--</text>
      <text class="tv-txt" id="tvsmall" x="199" y="304" text-anchor="middle" font-size="42" font-weight="500" opacity=".9">--</text>
      <g class="tv-txt" id="tvhum" opacity=".8" display="none"><path d="M168 334 q-9 12 -9 18 a9 9 0 0 0 18 0 q0 -6 -9 -18z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><text id="tvhumt" x="186" y="352" font-size="26">--</text></g>
      ${SNOW(199, 110, 26, '#7cc4ff')}` },
    // Tado X thermostat mural : chiffres en points blancs sur la façade
    tado: { w: 435, h: 416, big: 'current', glow: [217, 208, 260, 250], svg: () => `
      <rect x="122" y="141" width="228" height="126" rx="12" fill="url(#tvface)" filter="url(#tvsoft)"/>
      <text class="tv-big" id="tvbig" x="236" y="244" text-anchor="middle" font-size="84" font-weight="800" letter-spacing="1" fill="url(#tvdots)" filter="url(#tvdot)">--</text>
      <g class="tv-heat tv-waves" fill="none" stroke="#ff9a2e" stroke-width="4" stroke-linecap="round" stroke-dasharray=".1 6">
        ${[0, 1, 2].map((i) => `<path class="tv-w tv-w${i + 1}" d="M${340 + i * 13} 130 q-6 -7 0 -14 q6 -7 0 -14"/>`).join('')}</g>
      <text id="tvsmall" x="236" y="290" text-anchor="middle" font-size="18" fill="#9a9aa0">--</text>
      ${SNOW(130, 116, 24, '#4aa8ff')}` },
    // Honeywell Home T6 : écran LCD bleu clair, température en grand, consigne en dessous, touches − ≡ +
    t6: { w: 419, h: 400, big: 'current', glow: [210, 200, 250, 240], svg: () => `
      <rect x="78" y="79" width="270" height="261" rx="8" fill="url(#tvlcd)"/>
      <path d="M318 103 a14 14 0 0 1 18 0 M321 107 a9 9 0 0 1 12 0" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/><circle cx="327" cy="111" r="2" fill="#222"/>
      ${FLAME(92, 92, 22, '#ff7a00')}
      <text class="tv-lcd tv-big" id="tvbig" x="213" y="212" text-anchor="middle" font-size="72" font-weight="400" letter-spacing="-2">--</text>
      <text class="tv-lcd" id="tvsmall" x="213" y="250" text-anchor="middle" font-size="17">--</text>
      <g fill="none" stroke="#222" stroke-width="2.2">${[113, 213, 313].map((x) => `<circle cx="${x}" cy="302" r="22"/>`).join('')}
        <path d="M103 302 h20 M303 302 h20 M313 292 v20 M203 294 h20 M203 302 h20 M203 310 h20"/></g>
      ${SNOW(130, 103, 20, '#1e88e5')}` },
    // Viessmann Vitotrol 200 (RF / E) : thermostat d'ambiance mural à écran LCD gris (photo détourée, écran redessiné en direct).
    // En grand la consigne, en petit la température mesurée ; date et heure de l'appareil, flamme en chauffe.
    vitotrol: { w: 445, h: 308, big: 'target', nodeg: true, dec: true, glow: [222, 154, 240, 170], svg: () => `
      <rect x="49" y="46" width="229" height="150" fill="url(#tvvit)"/>
      <g style="fill:none" stroke="#16181b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M57 56 h9 a3 3 0 0 1 3 3 v2 M60 56 v-2"/><path d="M80 53.5 v10 M84 53.5 v10 M88 53.5 v10 M92 53.5 v10 M96 53.5 v10"/>
        <path d="M218 54 l-4 5 l4 5 M270 54 l4 5 l-4 5"/><path d="M53 71 h221" stroke-width="1.2"/>
        <circle cx="64" cy="94" r="3.6" fill="#16181b"/><path d="M64 80 v14" stroke-width="3"/>
        <path d="M140 152 V108 L188 94 L240 108" stroke-width="2.4"/>
        <path d="M243 126 l3 -3 l3 3 M243 136 l3 3 l3 -3" stroke-width="1.6"/>
        <circle cx="253" cy="178" r="5.5" stroke-width="1.2"/><path d="M253 175 v3.4 l2.4 1.4" stroke-width="1.1"/></g>
      <text class="tv-lcd" x="69" y="86" font-size="7">3</text>
      <text class="tv-lcd" x="244" y="63" text-anchor="middle" font-size="11.5" font-weight="500">HK1</text>
      ${FLAME(106, 52, 13, '#16181b')}
      <text class="tv-lcd" id="tvsmall" x="72" y="136" font-size="17" font-weight="500">--</text>
      <text class="tv-lcd tv-big" id="tvbig" x="205" y="136" text-anchor="end" font-size="23" font-weight="500">--</text>
      <text class="tv-lcd" id="tvunit" x="206" y="136" font-size="23" font-weight="500">°C</text>
      <text class="tv-lcd" id="tvdate" x="62" y="182" font-size="9.5"></text>
      <text class="tv-lcd" id="tvclock" x="245" y="182" text-anchor="end" font-size="9.5"></text>
      ${SNOW(86, 160, 14, '#1e88e5')}` },
    // tête classique générique (dessin vectoriel) : cylindre blanc, petit écran, anneau LED orange en chauffe, écrou chromé
    classic: { w: 240, h: 400, mw: 130, big: 'target', glow: [120, 190, 150, 220], svg: () => `
      <defs><linearGradient id="tvclb" x1="0" x2="1"><stop offset="0" stop-color="#cfd3d8"/><stop offset=".18" stop-color="#f4f5f7"/><stop offset=".45" stop-color="#ffffff"/><stop offset=".8" stop-color="#e6e9ec"/><stop offset="1" stop-color="#bfc4ca"/></linearGradient>
        <linearGradient id="tvcln" x1="0" x2="1"><stop offset="0" stop-color="#7d838a"/><stop offset=".3" stop-color="#e9ecef"/><stop offset=".55" stop-color="#9ea4ab"/><stop offset=".8" stop-color="#f3f5f7"/><stop offset="1" stop-color="#6f757c"/></linearGradient>
        <radialGradient id="tvclc" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e6ea"/></radialGradient>
        <filter id="tvclf" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4"/></filter></defs>
      <path d="M78 318 h84 v52 a42 9 0 0 1 -84 0z" fill="url(#tvcln)"/>
      <g stroke="#5f656c" stroke-width="1.2" opacity=".35">${Array.from({ length: 13 }, (_, i) => `<line x1="${84 + i * 6}" y1="320" x2="${84 + i * 6}" y2="376"/>`).join('')}</g>
      <path d="M58 300 L74 322 a46 8 0 0 0 92 0 L182 300z" fill="url(#tvclb)"/>
      <path d="M40 50 v246 a80 14 0 0 0 160 0 v-246z" fill="url(#tvclb)"/>
      <path d="M40 286 a80 14 0 0 0 160 0" fill="none" stroke="#c9cdd2" stroke-width="5"/>
      <path class="tv-heat" d="M40 286 a80 14 0 0 0 160 0" fill="none" stroke="#ff9a2e" stroke-width="8" filter="url(#tvclf)"/>
      <path class="tv-heat" d="M40 286 a80 14 0 0 0 160 0" fill="none" stroke="#ffb35c" stroke-width="4"/>
      <ellipse cx="120" cy="50" rx="80" ry="14" fill="#e9ecef"/>
      <ellipse cx="120" cy="48" rx="66" ry="10" fill="url(#tvclc)" stroke="#d5d9dd"/>
      <rect x="72" y="118" width="96" height="70" rx="14" fill="url(#tvscr)"/>
      <text class="tv-txt tv-big" id="tvbig" x="120" y="164" text-anchor="middle" font-size="34" font-weight="400">--</text>
      <text class="tv-txt" id="tvsmall" x="120" y="181" text-anchor="middle" font-size="11" opacity=".75">--</text>
      <text x="120" y="226" text-anchor="middle" font-size="16" font-weight="600" fill="#b9bec4" font-family="system-ui,sans-serif">−</text>
      <text x="120" y="108" text-anchor="middle" font-size="16" font-weight="600" fill="#b9bec4" font-family="system-ui,sans-serif">+</text>
      ${FLAME(78, 126, 13, '#ff9a2e')}${SNOW(155, 134, 13, '#7cc4ff')}` },
    // têtes thermostatiques en photo (image fournie dans l'issue #208), réduites à 75 %
    // Netatmo 1re génération : chiffres e-ink au centre (redessinés), anneaux orange qui s'allument en chauffe
    netatmo_trv: { w: 256, h: 407, mw: 130, big: 'target', fit: [3, 92], glow: [128, 205, 150, 220], svg: () => `
      <image class="tv-ring" href="${RING}" x="0" y="0" width="256" height="407"/>
      <text class="tv-ink tv-big" id="tvbig" x="168" y="203" text-anchor="middle" font-size="64" font-weight="700" fill="#2d2f31">--</text>
      <text id="tvsmall" display="none"></text>
      ${SNOW(132, 118, 18, '#3a3d40')}` },
    // Netatmo nouvelle génération : pas d'écran ; halo de chauffe
    netatmo_trv2: { w: 242, h: 408, mw: 125, big: 'target', glow: [121, 205, 145, 220], svg: () => `${NOTXT}${SNOW(92, 150, 22, '#4aa8ff')}` },
    // Danfoss Ally : écran LCD vert (consigne, °C et Wi-Fi redessinés)
    danfoss: { w: 230, h: 433, mw: 118, big: 'target', nodeg: true, fit: [3, 66], glow: [115, 216, 140, 230], svg: () => `
      <g class="tv-lcd" opacity=".85"><path d="M106 92 a11 11 0 0 1 16 0 M109 96 a6.5 6.5 0 0 1 10 0" fill="none" stroke="#16181b" stroke-width="2" stroke-linecap="round"/><circle cx="114" cy="99" r="1.8"/></g>
      <text class="tv-lcd tv-big" id="tvbig" x="112" y="148" text-anchor="middle" font-size="44" font-weight="400" letter-spacing="-1">--</text>
      <text class="tv-lcd" x="146" y="117" font-size="11">°C</text>
      <text id="tvsmall" display="none"></text>
      ${FLAME(70, 84, 14, '#16181b')}${SNOW(78, 146, 12, '#16181b')}` },
    // Shelly TRV : LED sous le logo (bleue au repos, orange en chauffe, clignote fenêtre ouverte)
    shelly: { w: 250, h: 399, mw: 128, big: 'target', glow: [125, 200, 150, 210], svg: () => `
      <defs><filter id="tvledf" x="-200%" y="-60%" width="500%" height="220%"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect class="tv-led" x="133" y="211" width="14" height="34" rx="7" filter="url(#tvledf)"/>
      <rect class="tv-led" x="136" y="214" width="8" height="28" rx="4"/>
      ${NOTXT}${SNOW(140, 272, 18, '#4aa8ff')}` },
    // Atlantic io (Zone Control, Overkiz) : thermostat mural carré à écran LCD turquoise (photo fournie sur le forum).
    // Petit en haut à gauche la température mesurée, en grand la consigne, radiateur (chauffe) et flèche en bas à droite
    atlantic_io: { w: 345, h: 334, big: 'target', nodeg: true, dec: true, fit: [3, 84], glow: [172, 167, 205, 200], svg: () => `
      <rect x="108" y="37" width="129" height="93" fill="#5baca3"/>
      <text class="tv-lcd" id="tvsmall" x="125" y="54" font-size="19" font-weight="500">--</text>
      <path d="M128 79 l-4 6 h8z M128 92 l-4 -6 h8z" fill="#16181b" class="tv-lcd"/>
      <text class="tv-lcd tv-big" id="tvbig" x="186" y="106" text-anchor="middle" font-size="54" font-weight="800" letter-spacing="1">--</text>
      <g class="tv-heat" stroke="#16181b" stroke-width="3" stroke-linecap="round">${[0, 1, 2, 3].map((i) => `<path d="M${201 + i * 5} 113 v13"/>`).join('')}</g>
      <path d="M222 112 l13 7 l-13 7z" fill="none" stroke="#16181b" stroke-width="2.4" stroke-linejoin="round"/>
      ${SNOW(160, 120, 18, '#16181b')}` },
    // Atlantic io (Zone Control, Overkiz) : télécommande verticale à molette, écran LCD turquoise avec cercle central :
    // consigne en grand, température mesurée en petit, heure et date en haut, pastille soleil (flamme en chauffe)
    atlantic_io2: { w: 181, h: 336, mw: 118, big: 'target', dec: true, fit: [4, 42], glow: [91, 168, 120, 200], svg: () => `
      <rect x="37" y="24" width="109" height="118" fill="#5aa7a0"/>
      <text class="tv-lcd" id="tvclock" x="44" y="36" font-size="9.5" font-weight="500"></text>
      <text class="tv-lcd" id="tvdate" x="140" y="36" text-anchor="end" font-size="9.5" font-weight="500"></text>
      <path d="M43 40 h98" stroke="#16181b" stroke-width="1.2" opacity=".6"/>
      <circle cx="92" cy="94" r="32" fill="none" stroke="#16181b" stroke-width="1.2" opacity=".75"/>
      <path d="M81 69 v10 a3.4 3.4 0 1 0 4 0 v-10 a2 2 0 0 0 -4 0z" fill="#16181b"/>
      <text class="tv-lcd" id="tvsmall" x="88" y="80" font-size="12.5">--</text>
      <text class="tv-lcd tv-big" id="tvbig" x="91" y="104" text-anchor="middle" font-size="23" font-weight="800">--</text>
      <circle cx="113" cy="121" r="13" fill="#5aa7a0" stroke="#16181b" stroke-width="1.2" opacity=".85"/>
      <g class="atl-sun" stroke="#16181b" stroke-width="1.6" stroke-linecap="round"><circle cx="113" cy="121" r="3.4" fill="#16181b" stroke="none"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M113 114.5 v-3" transform="rotate(${a} 113 121)"/>`).join('')}</g>
      ${FLAME(103, 111, 20, '#16181b')}
      ${SNOW(60, 55, 14, '#16181b')}` },
    // Somfy io : pas d'écran ; halo de chauffe
    somfy: { w: 246, h: 416, mw: 125, big: 'target', glow: [123, 208, 150, 220], svg: () => `${NOTXT}${SNOW(123, 132, 22, '#4aa8ff')}` },
    // Tuya BHT6000 (et thermostats ronds à écran noir du même type) : dessin vectoriel, sans photo.
    // Plaque carrée, façade ronde blanche, écran rond noir à chiffres blancs, touches tactiles à droite.
    bht6000: { w: 300, h: 300, big: 'current', nodeg: true, glow: [150, 150, 170, 170], svg: () => `
      <rect x="18" y="18" width="264" height="264" rx="14" fill="url(#tvplate)" stroke="#d3d8dd"/>
      <circle cx="150" cy="152" r="128" fill="#000" opacity=".12" filter="url(#tvsoft)"/>
      <circle cx="150" cy="150" r="128" fill="url(#tvbody)" stroke="#aeb4bb" stroke-width="3"/>
      <circle cx="150" cy="150" r="121" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
      <circle cx="150" cy="150" r="70" fill="url(#tvbht)"/>
      <path d="M104 110 A70 70 0 0 1 194 94 L138 222 A70 70 0 0 1 104 110Z" fill="#fff" opacity=".05"/>
      <g fill="none" stroke="#9aa1a8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M234 82 a7 7 0 1 0 6 0 M237 77 v7"/><path d="M230 122 v-11 l7 7 l7 -7 v11"/>
        <circle cx="237" cy="150" r="7"/><path d="M237 146 v4 l3 2"/><path d="M230 188 l7 -9 l7 9"/><path d="M230 213 l7 9 l7 -9"/></g>
      <g class="tv-heat tv-waves" fill="none" stroke="#ff9a2e" stroke-width="2.6" stroke-linecap="round">
        ${[0, 1, 2].map((i) => `<path class="tv-w tv-w${i + 1}" d="M${140 + i * 9} 104 q-4 -5 0 -10 q4 -5 0 -10"/>`).join('')}</g>
      <text class="tv-txt tv-big" id="tvbig" x="146" y="166" text-anchor="middle" font-size="44" font-weight="500" letter-spacing="-1">--</text>
      <text class="tv-txt" x="190" y="132" font-size="12" opacity=".9">°C</text>
      <text class="tv-txt" id="tvsmall" x="150" y="192" text-anchor="middle" font-size="15" opacity=".8">--</text>
      <text class="tv-txt" id="tvclock" x="150" y="213" text-anchor="middle" font-size="13" opacity=".6" letter-spacing="1"></text>
      ${SNOW(114, 128, 16, '#7cc4ff')}` },
  };
  // arc du Nest : 270°, de 135° (bas gauche) à 45° (bas droite), rayon 150
  const ARC = (() => { const c = 199, r = 150, a0 = 135 * Math.PI / 180, a1 = 405 * Math.PI / 180, p = (a) => `${(c + r * Math.cos(a)).toFixed(1)} ${(c + r * Math.sin(a)).toFixed(1)}`; return `M${p(a0)} A${r} ${r} 0 1 1 ${p(a1)}`; })();

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--tv-heat:var(--appliance-heat-color,#ff8a00);--tv-cold:var(--appliance-cold-color,#2b9af9);
  --tv-alert:var(--appliance-alert-color,#db4437);--tv-ok:var(--appliance-ok-color,#43a047)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--tv-heat) 22%,transparent);color:var(--tv-heat)}
.idle .badge{background:color-mix(in srgb,var(--tv-ok) 20%,transparent);color:var(--tv-ok)}
.window .badge{background:color-mix(in srgb,var(--tv-cold) 22%,transparent);color:var(--tv-cold)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--tv-cold);font-weight:500;text-align:center}.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:4px auto 0;cursor:pointer;overflow:visible}
/* consigne − / + */
.set{display:flex;align-items:center;gap:6px;margin-top:6px;padding:4px 6px 4px 10px;border-radius:12px;background:rgba(127,127,127,.09);font-size:12px;color:var(--secondary-text-color)}
.set .sl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.set button{width:28px;height:28px;flex:none;border-radius:50%;border:none;background:rgba(127,127,127,.18);color:var(--primary-text-color);cursor:pointer;font:600 17px/1 system-ui,sans-serif;display:grid;place-items:center;padding:0}
.set button:disabled{opacity:.35;cursor:default}
.set b{min-width:52px;text-align:center;color:var(--primary-text-color);font-size:14px;white-space:nowrap}.set b.pending{color:var(--tv-heat)}
/* boutons de mode */
.modes{display:flex;gap:4px;margin-top:6px;padding:4px;border-radius:12px;background:rgba(127,127,127,.09)}
.modes[hidden]{display:none}
.modes button{flex:1;min-width:0;height:34px;border:none;border-radius:9px;background:transparent;color:var(--secondary-text-color);cursor:pointer;display:grid;place-items:center;padding:0}
.modes button ha-icon{--mdc-icon-size:18px}
.modes button.on{background:rgba(127,127,127,.28);color:var(--primary-text-color)}
.modes button.on[data-m="heat"]{background:color-mix(in srgb,var(--tv-heat) 22%,transparent);color:var(--tv-heat)}
.modes button:disabled{opacity:.35;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--tv-alert)}.tile.cold .v{color:var(--tv-cold)}
/* ---- illustration (coordonnées de la photo détourée, 357 × 274 ; écran : centre 176,159, rayon 100) ---- */
.tv-glow{opacity:0;transition:opacity .5s}
.heating .tv-glow{opacity:.8;animation:tvbreathe 2.4s ease-in-out infinite}
.tv-waves{opacity:0}
.heating .tv-waves{opacity:1}
.heating .tv-w{animation:tvwave 1.6s ease-in-out infinite}.heating .tv-w2{animation-delay:.2s}.heating .tv-w3{animation-delay:.4s}
.tv-txt{fill:#fff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.off .tv-big{fill:#9aa0a6}
.tv-ink{fill:#1b1b1b;font-family:'DIN Condensed','Arial Narrow',system-ui,sans-serif}
.tv-lcd{fill:#16181b;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.atl-sun{transition:opacity .4s}.heating .atl-sun{opacity:0}
.tv-heat{opacity:0;transition:opacity .4s}
.heating .tv-heat{opacity:1}
.heating path.tv-heat{animation:tvflame 1.2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tv-nestheat{opacity:0;transition:opacity .8s}
.heating .tv-nestheat{opacity:1;animation:tvbreathe 3s ease-in-out infinite}
.tv-hit{pointer-events:stroke;cursor:grab;touch-action:none}.tv-hit.drag{cursor:grabbing}
.tv-arc{stroke:#2b9af9;transition:stroke-dasharray .6s}.dragging .tv-arc{transition:none}.heating .tv-arc{stroke:#fff}
.off .tv-arc{stroke:#555}
/* LED (Shelly) et anneaux lumineux (Netatmo 1re génération) */
.tv-led{fill:#3d8bff;opacity:.85;transition:fill .4s,opacity .4s}
.heating .tv-led{fill:#ff8a00;opacity:1;animation:tvbreathe 2.4s ease-in-out infinite}
.window .tv-led{fill:#7cc4ff;animation:tvblink 1.4s ease-in-out infinite}
.off .tv-led,.unavailable .tv-led{opacity:0}
.tv-ring{opacity:0;transition:opacity .5s}
.heating .tv-ring{opacity:1;animation:tvbreathe 2.4s ease-in-out infinite}
/* dérogation : durée de la nouvelle consigne, retour au planning */
.dur{display:flex;align-items:center;gap:6px;margin-top:6px;padding:4px 6px 4px 10px;border-radius:12px;background:rgba(127,127,127,.09);font-size:12px;color:var(--secondary-text-color);flex-wrap:wrap}
.dur[hidden]{display:none}
/* carte étroite : le libellé « Durée » passe en info-bulle, les puces tiennent sur une ligne */
.dur>span{display:none}
.dur .chips{display:flex;gap:4px;flex:1 1 150px;justify-content:space-between;flex-wrap:wrap}
.dur button{height:26px;border:none;border-radius:13px;padding:0 7px;background:rgba(127,127,127,.18);color:var(--primary-text-color);cursor:pointer;font:500 11px/1 system-ui,sans-serif;white-space:nowrap}
.dur button.on{background:color-mix(in srgb,var(--tv-heat) 25%,transparent);color:var(--tv-heat)}
.dur button.res{display:inline-flex;align-items:center;justify-content:center;gap:4px;flex-basis:100%}.dur button.res ha-icon{--mdc-icon-size:14px}
.dur button.res[hidden]{display:none}
.tv-snow{opacity:0}
.window .tv-snow{opacity:1;animation:tvblink 1.4s ease-in-out infinite}
.unavailable svg{filter:grayscale(.8) opacity(.7)}
.noanim .tv-glow,.noanim .tv-w,.noanim .tv-snow,.noanim .tv-heat,.noanim .tv-nestheat,.noanim .tv-led,.noanim .tv-ring{animation:none}
@keyframes tvbreathe{50%{opacity:.35}}
@keyframes tvwave{0%,100%{transform:translateY(0);opacity:.6}50%{transform:translateY(-3px);opacity:1}}
@keyframes tvblink{50%{opacity:.35}}
@keyframes tvflame{from{opacity:.55}to{opacity:1}}
`;

  const SVG = (label, model) => { const M = MODELS[model]; const [gx, gy, grx, gry] = M.glow; return `<svg viewBox="-12 -12 ${M.w + 24} ${M.h + 24}" role="img" aria-label="${esc(label)}"${M.mw ? ` style="max-width:calc(${M.mw}px * var(--illus-scale,1))"` : ''}><defs>
    <radialGradient id="tvglowg" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#ff8a00" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient>
    <radialGradient id="tvscr" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#3a3d42"/><stop offset="1" stop-color="#1c1e21"/></radialGradient>
    <linearGradient id="tvink" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#c3c3c3"/><stop offset="1" stop-color="#b3b3b3"/></linearGradient>
    <radialGradient id="tvnest" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#111"/><stop offset="1" stop-color="#000"/></radialGradient>
    <radialGradient id="tvnesth" cx=".5" cy=".42" r=".65"><stop offset="0" stop-color="#ff8a2a"/><stop offset="1" stop-color="#c2410c"/></radialGradient>
    <linearGradient id="tvface" x1="0" x2="1"><stop offset="0" stop-color="#e8e7ec"/><stop offset="1" stop-color="#dedde2"/></linearGradient>
    <linearGradient id="tvlcd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0e8f1"/><stop offset="1" stop-color="#d0dbea"/></linearGradient>
    <linearGradient id="tvvit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a4a4a4"/><stop offset="1" stop-color="#8f8f8f"/></linearGradient>
    <linearGradient id="tvplate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6f7f8"/><stop offset="1" stop-color="#dfe3e7"/></linearGradient>
    <radialGradient id="tvbody" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#f1f3f5"/><stop offset="1" stop-color="#dde1e5"/></radialGradient>
    <radialGradient id="tvbht" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#1b1f26"/><stop offset="1" stop-color="#05070a"/></radialGradient>
    <filter id="tvsoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="tvdot"><feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#000" flood-opacity=".45"/></filter>${DOTS}</defs>
    <!-- halo de chauffe derrière l'appareil -->
    <ellipse class="tv-glow" cx="${gx}" cy="${gy}" rx="${grx}" ry="${gry}" fill="url(#tvglowg)"/>
    ${IMGS[model] ? `<image href="${IMGS[model]}" x="0" y="0" width="${M.w}" height="${M.h}"/>` : ''}
    ${M.svg()}
  </svg>`; };

  const TILES = [['temperature', 'mdi:thermometer', 'show_temperature'], ['valve', 'mdi:valve', 'show_valve'], ['battery', 'mdi:battery', 'show_battery'], ['window', 'mdi:window-closed-variant', 'show_window']];

  class ApplianceTrvCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}).filter((i) => i.startsWith('climate.'));
      return { entity: ids.find((i) => /(trv|vanne|valve|thermostati|radiat|tado|tete|tête)/i.test(i)) || ids[0] || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_hvac_modes: true, show_temperature: true, show_valve: true, show_battery: true, show_window: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    // horloge de l'écran (BHT6000) : rafraîchie chaque minute
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c && ['bht6000', 'atlantic_io2'].includes(this._model())) this._render(); }, 30000); }
    disconnectedCallback() {
      clearInterval(this._tick);
      // consigne déjà envoyée : on lâche tout de suite la valeur en attente au lieu de laisser courir le minuteur de 4 s
      if (this._clr) { clearTimeout(this._clr); this._clr = null; this._pending = null; }
    }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(v) { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : NaN; }
    _fmt(v, d = 1, mn = 0) { return fin(v) ? v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: mn }) : '--'; }
    _model() { const m = String(this._c.model || 'trv').toLowerCase(); return MODELS[m] ? m : 'trv'; }
    // dérogation : active pour une entité de l'intégration Netatmo (ou override: true), désactivée par override: false
    _ovr() { const c = this._c; if (c.override === false) return false; return c.override === true || (this._hass?.entities?.[c.entity]?.platform === 'netatmo'); }
    _durs() { const l = Array.isArray(this._c.override_durations) ? this._c.override_durations.map(Number).filter((n) => n > 0 && n <= 1440).map(Math.round) : []; return l.length ? [...new Set(l)] : [45, 180, 720]; }
    _unit() { return String(this._hass?.config?.unit_system?.temperature || '°C'); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _label(cs, v) { try { if (this._hass.formatEntityState) return this._hass.formatEntityState(cs, v); } catch (e) { /* ancienne version de HA */ } const t = String(v).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="tvtitle"></div><div class="badge" id="tvbadge"></div></div>
        ${SVG(this._c.name || this._t('name'), this._model())}
        <div class="alert" id="tvalert"></div>
        <div class="set" id="tvsetrow"><ha-icon icon="mdi:thermostat"></ha-icon><span class="sl" id="tvsl"></span><button id="tvm" type="button">−</button><b id="tvt"></b><button id="tvp" type="button">+</button></div>
        <div class="dur" id="tvdur" hidden><ha-icon icon="mdi:timer-outline"></ha-icon><span id="tvdurl"></span><div class="chips" id="tvchips"></div>
          <button type="button" class="res" id="tvres" hidden><ha-icon icon="mdi:calendar-sync"></ha-icon><span id="tvresl"></span></button></div>
        <div class="modes" id="tvmodes" role="group" hidden></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.getElementById('tvsl').addEventListener('click', () => this._more(this._c.entity));
      // Nest : on règle la consigne en faisant glisser l'arc (un simple clic ouvre toujours la fiche de l'entité)
      const hit = root.getElementById('tvhit');
      if (hit) this._bindArc(root, hit);
      root.getElementById('tvm').addEventListener('click', () => this._step(-1));
      root.getElementById('tvp').addEventListener('click', () => this._step(1));
      // dérogation : choix de la durée appliquée aux prochains réglages − / +, retour au planning
      root.getElementById('tvchips').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-d]'); if (!b) return;
        this._dur = Number(b.dataset.d); this._render();
      });
      root.getElementById('tvres').addEventListener('click', () => {
        if (this._hass) this._hass.callService('climate', 'set_hvac_mode', { entity_id: this._c.entity, hvac_mode: 'auto' });
      });
      root.getElementById('tvmodes').addEventListener('click', (e) => {
        const b = e.target.closest('button[data-m]');
        if (b && !b.disabled && this._hass) this._hass.callService('climate', 'set_hvac_mode', { entity_id: this._c.entity, hvac_mode: b.dataset.m });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ temperature: c.entity_temperature || c.entity, valve: c.entity_valve_position || c.entity, battery: c.entity_battery || c.entity, window: c.entity_window || c.entity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, cs = this._st(c.entity), a = (cs && cs.attributes) || {};
      // température mesurée : capteur externe (entity_temperature) si renseigné et lisible, sinon celle de la tête (current_temperature)
      const xs = this._st(c.entity_temperature), xv = xs ? this._num(xs.state) : NaN;
      const cur = fin(xv) ? xv : this._num(a.current_temperature), target = this._num(a.temperature);
      // état « unknown » : certains thermostats (Tuya BHT6000…) ne remontent pas leur mode mais bien la température
      // et la consigne ; la carte reste alors pilotable. Indisponible seulement si rien n'est lisible.
      const dead = !cs || /^unavailable$/i.test(String(cs.state)) || (/^unknown$/i.test(String(cs.state)) && !fin(cur) && !fin(target));
      const act = String(a.hvac_action || ''), off = !dead && String(cs.state) === 'off';
      // fenêtre : capteur dédié, sinon l'attribut de la tête (window_open / window_detection)
      const ws = this._st(c.entity_window);
      const win = ws ? /^(on|open|true)$/i.test(String(ws.state)) : a.window_open === true || /^(on|open|true)$/i.test(String(a.window_open ?? ''));
      const bs = this._st(c.entity_battery), bat = bs ? (/^(on|low)$/i.test(String(bs.state)) ? 5 : /^off$/i.test(String(bs.state)) ? 100 : this._num(bs.state)) : this._num(a.battery ?? a.battery_level);
      const vs = this._st(c.entity_valve_position), valve = vs ? this._num(vs.state) : this._num(a.pi_heating_demand ?? a.valve_position ?? a.position);
      // en chauffe : hvac_action, sinon vanne ouverte
      // en chauffe : hvac_action, sinon vanne ouverte, sinon (ni l'un ni l'autre) température sous la consigne
      const heating = !off && (act === 'heating' || act === 'preheating' || (!act && fin(valve) && valve > 0)
        || (!act && !fin(valve) && fin(cur) && fin(target) && cur <= target - 0.5));
      const st = dead ? 'unavailable' : win ? 'window' : off ? 'off' : heating ? 'heating' : 'idle';
      return { cs, a, cur, target, st, win, bat, valve, off, dead };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, k = this._compute(), u = this._unit();
      card.className = `${k.st}${c.animations === false ? ' noanim' : ''}${this._drag ? ' dragging' : ''}`;
      // en-tête : nom (défaut), icône seule ou les deux (header: name / icon / both, icône au choix avec icon)
      const hd = ['icon', 'both'].includes(c.header) ? c.header : 'name', title = r.getElementById('tvtitle');
      const nm = c.name || (k.cs && k.cs.attributes.friendly_name) || this._t('name');
      title.replaceChildren();
      if (hd !== 'name') { const ic = document.createElement('ha-icon'); ic.setAttribute('icon', c.icon || 'mdi:thermostat'); ic.style.cssText = 'margin-right:6px;--mdc-icon-size:20px'; title.appendChild(ic); title.title = nm; }
      if (hd !== 'icon') title.append(nm);
      // mode minimal : seulement le cadran (et l'en-tête) ; un tap_action navigate ouvre une fenêtre avec toutes les infos
      const mini = c.minimal === true;
      r.querySelector('.tiles').style.display = mini ? 'none' : '';
      const badge = r.getElementById('tvbadge');
      badge.textContent = this._t(k.st); badge.style.display = c.show_status === false || mini ? 'none' : '';
      const al = r.getElementById('tvalert');
      al.textContent = k.win && !mini ? this._t('window_alert') : ''; al.classList.toggle('on', !!al.textContent);

      // écran : consigne en grand (OFF si éteinte), température mesurée en petit
      const shown = this._pending != null ? this._pending : k.target;
      // en grand : la consigne ou la température selon le modèle ; pendant un réglage, la nouvelle consigne
      const model = this._model(), M = MODELS[model], tgt = fin(shown) ? `${this._fmt(shown, 1, M.dec ? 1 : 0)}°` : '--', now = fin(k.cur) ? `${this._fmt(k.cur, 1, M.dec ? 1 : 0)}°` : '--'; // M.dec : toujours une décimale (19,0), comme l'écran d'origine
      // big_value : choix de la valeur en grand (target / current) sur les modèles qui affichent aussi la petite valeur
      const hasSmall = r.getElementById('tvsmall').getAttribute('display') !== 'none';
      const big = hasSmall && ['target', 'current'].includes(c.big_value) ? c.big_value : M.big;
      const bigTarget = big === 'target' || this._pending != null;
      const bigTxt = k.dead ? '--' : k.off && big === 'target' ? 'OFF' : bigTarget ? tgt : now;
      const bigEl = r.getElementById('tvbig');
      bigEl.textContent = M.nodeg ? bigTxt.replace(/°$/, '') : bigTxt;
      const unitEl = r.getElementById('tvunit'); if (unitEl) unitEl.setAttribute('display', /\d/.test(bigEl.textContent) ? '' : 'none');
      // écran étroit (photo) : « 21,5° » est resserré dans la largeur des chiffres d'origine
      if (M.fit && bigEl.textContent.length > M.fit[0]) { bigEl.setAttribute('textLength', String(M.fit[1])); bigEl.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } else bigEl.removeAttribute('textLength');
      const dte = r.getElementById('tvdate');
      if (dte) dte.textContent = new Date().toLocaleDateString(this._lang(), { day: '2-digit', month: '2-digit', year: 'numeric' });
      const clk = r.getElementById('tvclock');
      if (clk) clk.textContent = window.applianceClock(this._hass, new Date(), this._lang());
      r.getElementById('tvsmall').textContent = k.dead ? '' : model === 't6' ? `${this._l('target')} : ${k.off ? 'OFF' : tgt}`
        : model === 'bht6000' ? (bigTarget ? now : `SET ${k.off ? 'OFF' : tgt}`)
        : bigTarget ? now : k.off ? 'OFF' : tgt;
      // Nest : arc de consigne (entre min_temp et max_temp) et mention « CHAUFFE »
      const arc = r.getElementById('tvarc');
      if (arc) {
        const mn = fin(this._num(k.a.min_temp)) ? this._num(k.a.min_temp) : 5, mx = fin(this._num(k.a.max_temp)) ? this._num(k.a.max_temp) : 30;
        const f = fin(shown) && mx > mn ? Math.max(0, Math.min(1, (shown - mn) / (mx - mn))) : 0;
        arc.setAttribute('stroke-dasharray', `${(f * 100).toFixed(1)} 100`);
        // humidité : entité dédiée, sinon l'attribut current_humidity du thermostat
        const hS = this._st(c.entity_humidity), hum = hS ? this._num(hS.state) : this._num(k.a.current_humidity ?? k.a.humidity);
        const hg = r.getElementById('tvhum'), showH = fin(hum) && c.show_humidity !== false && !k.dead;
        hg.setAttribute('display', showH ? '' : 'none');
        if (showH) r.getElementById('tvhumt').textContent = `${this._fmt(hum, 0)} %`;
        r.getElementById('tvmode').textContent = k.st === 'heating' ? this._t('heating').toUpperCase() : k.off ? 'OFF' : '';
      }

      // consigne − / +
      const step = Number(k.a.target_temp_step) || (u.includes('F') ? 1 : 0.5);
      r.getElementById('tvsl').textContent = k.off ? this._t('off') : this._l('target');
      const tb = r.getElementById('tvt'); tb.textContent = fin(shown) ? `${this._fmt(shown, step < 1 ? 1 : 0)} ${u}` : '--'; tb.classList.toggle('pending', this._pending != null);
      r.getElementById('tvm').disabled = r.getElementById('tvp').disabled = k.dead || k.off || !fin(k.target);
      r.getElementById('tvsetrow').style.display = mini ? 'none' : '';

      // dérogation temporaire (Netatmo) : durées proposées, « Défaut » = durée réglée dans l'application Netatmo
      const ovr = this._ovr(), dr = r.getElementById('tvdur');
      dr.hidden = !ovr || mini || k.dead;
      if (!dr.hidden) {
        r.getElementById('tvdurl').textContent = this._t('duration'); dr.title = this._t('duration');
        const ch = r.getElementById('tvchips'), list = [0, ...this._durs()], key = list.join(',');
        if (ch.dataset.k !== key) { ch.dataset.k = key; ch.innerHTML = list.map((d) => `<button type="button" data-d="${d}"></button>`).join(''); }
        if (!list.includes(this._dur || 0)) this._dur = 0;
        ch.querySelectorAll('button').forEach((b) => {
          const d = Number(b.dataset.d);
          b.textContent = d ? (d < 60 ? `${d} min` : `${this._fmt(d / 60, 1)} h`) : this._t('dur_default');
          b.classList.toggle('on', d === (this._dur || 0)); b.disabled = k.off;
        });
        // consigne manuelle en cours (mode heat alors que la tête sait suivre un planning) : bouton « Reprendre le planning »
        const res = r.getElementById('tvres'), modes0 = Array.isArray(k.a.hvac_modes) ? k.a.hvac_modes : [];
        res.hidden = !(String(k.cs.state) === 'heat' && modes0.includes('auto'));
        r.getElementById('tvresl').textContent = this._t('resume');
      }

      // boutons de mode : modes proposés par la tête, dans l'ordre de Home Assistant
      const box = r.getElementById('tvmodes');
      const modes = Array.isArray(k.a.hvac_modes) ? k.a.hvac_modes.toSorted((x, y) => (HVAC_ORDER.indexOf(x) + 1 || 99) - (HVAC_ORDER.indexOf(y) + 1 || 99)) : [];
      box.hidden = c.show_hvac_modes === false || modes.length < 2 || mini;
      if (!box.hidden) {
        const key = modes.join(',');
        if (box.dataset.k !== key) { box.dataset.k = key; box.innerHTML = modes.map((m) => `<button type="button" data-m="${esc(m)}"><ha-icon icon="${HVAC_ICON[m] || 'mdi:thermostat'}"></ha-icon></button>`).join(''); }
        box.querySelectorAll('button').forEach((b) => {
          const on = k.cs && String(k.cs.state) === b.dataset.m, lbl = k.cs ? this._label(k.cs, b.dataset.m) : b.dataset.m;
          b.classList.toggle('on', !!on); b.disabled = k.dead; b.title = lbl; b.setAttribute('aria-label', lbl); b.setAttribute('aria-pressed', String(!!on));
        });
      }

      const V = {
        temperature: [fin(k.cur), `${this._fmt(k.cur, 1)}`, u],
        valve: [fin(k.valve), this._fmt(k.valve, 0), '%'],
        battery: [fin(k.bat), this._fmt(k.bat, 0), '%'],
        window: [!!c.entity_window || k.a.window_open != null, this._t(k.win ? 'open' : 'closed'), ''],
      };
      TILES.forEach(([key, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${key}"]`); const [show, val, unit] = V[key];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', key === 'battery' && k.bat < 20);
        el.classList.toggle('cold', key === 'window' && k.win);
        el.querySelector('.lbl').textContent = this._l(key);
        if (key === 'window') el.querySelector('ha-icon').setAttribute('icon', k.win ? 'mdi:window-open-variant' : 'mdi:window-closed-variant');
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }

    // consigne arrondie au pas du thermostat et bornée par min_temp / max_temp
    _snap(v) {
      const a = this._compute().a, step = Number(a.target_temp_step) || (this._unit().includes('F') ? 1 : 0.5);
      const mn = this._num(a.min_temp), mx = this._num(a.max_temp);
      if (!fin(v)) return NaN;
      if (fin(mn)) v = Math.max(mn, v); if (fin(mx)) v = Math.min(mx, v);
      v = Math.round(v / step) * step;
      if (fin(mn) && v < mn) v = Math.ceil(mn / step) * step; // l'arrondi ne doit jamais sortir de min_temp / max_temp
      if (fin(mx) && v > mx) v = Math.floor(mx / step) * step;
      return Math.round(v * 100) / 100; // pas de reste flottant (30.000000000000004)
    }
    // − / + : la consigne change tout de suite à l'écran, l'appel part 0,8 s après le dernier clic
    _step(dir) {
      const k = this._compute(); if (!fin(k.target)) return;
      const step = Number(k.a.target_temp_step) || (this._unit().includes('F') ? 1 : 0.5);
      const v = this._snap((this._pending != null ? this._pending : k.target) + dir * step);
      if (!fin(v)) return;
      clearTimeout(this._clr); this._clr = null; // la remise à zéro de l'envoi précédent ne doit pas effacer cette consigne
      this._pending = v;
      this._render();
      this._schedule();
    }
    _schedule() {
      clearTimeout(this._timer);
      clearTimeout(this._clr); this._clr = null;
      this._timer = setTimeout(() => {
        this._timer = null;
        if (!fin(this._pending) || !this._hass) return; // jamais d'envoi sans consigne (0 °)
        const t = Math.round(this._pending * 10) / 10, d = this._ovr() ? this._dur || 0 : 0;
        if (d > 0) {
          // dérogation : la tête revient à son planning à la fin de la durée (service de l'intégration Netatmo)
          const hh = String(Math.floor(d / 60)).padStart(2, '0'), mm = String(d % 60).padStart(2, '0');
          this._hass.callService('netatmo', 'set_temperature_with_time_period', { entity_id: this._c.entity, target_temperature: t, time_period: `${hh}:${mm}:00` });
        } else this._hass.callService('climate', 'set_temperature', { entity_id: this._c.entity, temperature: t });
        this._clr = setTimeout(() => { this._clr = null; this._pending = null; if (this._hass) this._render(); }, 4000);
      }, 800);
    }
    // Nest : glisser l'arc (270°, de 135° à 405°) règle la consigne entre min_temp et max_temp ; l'appel part au relâchement (+ 0,8 s)
    _bindArc(root, hit) {
      const svg = hit.ownerSVGElement;
      let from = null;
      this._arcMoved = false; // partagé avec la garde du clic, posée une seule fois sur la racine
      const frac = (ev) => {
        const m = svg.getScreenCTM(); if (!m) return NaN;
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const p = pt.matrixTransform(m.inverse());
        const deg = (Math.atan2(p.y - 199, p.x - 199) * 180 / Math.PI + 360) % 360, t = (deg - 135 + 360) % 360; // 0 = bas gauche, 270 = bas droite
        return t <= 270 ? t / 270 : (t - 270 < 360 - t ? 1 : 0); // dans le creux du bas : l'extrémité la plus proche
      };
      hit.addEventListener('pointerdown', (ev) => {
        const k = this._compute();
        if ((ev.button != null && ev.button > 0) || k.dead || k.off || !fin(k.target)) return;
        from = { x: ev.clientX, y: ev.clientY }; this._arcMoved = false;
        try { hit.setPointerCapture(ev.pointerId); } catch (e) { /* navigateur ancien */ }
      });
      hit.addEventListener('touchstart', (ev) => { const k = this._compute(); if (!k.dead && !k.off && fin(k.target)) ev.preventDefault(); }, { passive: false });
      hit.addEventListener('pointermove', (ev) => {
        if (!from) return;
        if (!this._arcMoved && Math.hypot(ev.clientX - from.x, ev.clientY - from.y) < 5) return; // un simple appui n'est pas un glissement
        this._arcMoved = true; this._drag = true; clearTimeout(this._timer); clearTimeout(this._clr); this._clr = null;
        hit.classList.add('drag'); this._card && this._card.classList.add('dragging');
        const a = this._compute().a, mn = fin(this._num(a.min_temp)) ? this._num(a.min_temp) : 5, mx = fin(this._num(a.max_temp)) ? this._num(a.max_temp) : 30;
        const v = this._snap(mn + frac(ev) * (mx - mn));
        if (fin(v) && v !== this._pending) { this._pending = v; this._render(); }
      });
      const end = (ev) => {
        if (!from) return;
        from = null; hit.classList.remove('drag'); this._card && this._card.classList.remove('dragging');
        if (this._arcMoved) { this._drag = false; this._schedule(); setTimeout(() => { this._arcMoved = false; }, 0); }
        // au doigt, touchstart annulé = pas de clic synthétique : un simple appui rouvre la fiche de l'entité
        else if (ev.type === 'pointerup' && ev.pointerType === 'touch') svg.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      };
      ['pointerup', 'pointercancel'].forEach((t) => hit.addEventListener(t, end));
      // le clic qui suit un glissement ne doit pas ouvrir la fiche de l'entité
      // (une seule fois : _build est rappelé à chaque changement de config, la racine reste la même)
      if (!root._tvClickGuard) {
        root._tvClickGuard = true;
        root.addEventListener('click', (ev) => { if (this._arcMoved) { ev.stopPropagation(); ev.preventDefault(); } }, true);
      }
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceTrvCard);

  /* ---- éditeur visuel ---- */
  class ApplianceTrvCardEditor extends HTMLElement {
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
      const ent = (name, domain, dc) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(dc ? { device_class: dc } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const lang = window.applianceLang(T, null, this._hass);
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        ent('entity', 'climate'),
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.keys(MODELS).map((value) => ({ value, label: ({ ...T.en, ...T[lang] })['model_' + value] || T.en['model_' + value] || value })) } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_temperature', 'sensor'), ent('entity_window', ['binary_sensor', 'input_boolean']), ent('entity_humidity', 'sensor'), ent('entity_battery', ['sensor', 'binary_sensor']), ent('entity_valve_position', ['sensor', 'number']),
        { type: 'grid', name: '', schema: [{ name: 'override', selector: { boolean: {} } }, { name: 'override_durations', selector: { object: {} } }] },
        { type: 'grid', name: '', schema: [{ name: 'header', selector: { select: { mode: 'dropdown', options: ['name', 'icon', 'both'] } } }, { name: 'icon', selector: { icon: {} } }] },
        { name: 'big_value', selector: { select: { mode: 'dropdown', options: ['target', 'current'] } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_hvac_modes'), bool('show_temperature'), bool('show_valve'), bool('show_battery'), bool('show_window'), bool('show_humidity'), { name: 'minimal', selector: { boolean: {} } }, bool('animations')] },
      ];
      // « model » : libellé propre à la carte (le libellé partagé de l'éditeur parle d'un modèle de détecteur)
      this._form.computeLabel = (s) => (s.name === 'model' ? ({ ...T.en, ...T[lang] }).model || T.en.model : window.applianceEditorLabel(s.name, this._hass));
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceTrvCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Tête thermostatique de radiateur à eau (photo Tado X) : écran en direct, consigne − / +, modes, fenêtre ouverte, batterie, ouverture de vanne.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/trv.md',
  });
})();
