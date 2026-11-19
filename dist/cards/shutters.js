/* Cartes « Volets » — volet roulant, store vénitien, volets battants, rideaux coulissants, pergola bioclimatique
 * custom:appliance-roller-shutter-card, appliance-venetian-blind-card, appliance-swing-shutter-card,
 * appliance-sliding-curtain-card, appliance-pergola-card.
 * Une entité cover donne l'état (open, closed, opening, closing) ; current_position (0 fermé → 100 ouvert)
 * et current_tilt_position (store vénitien) pilotent le dessin par des variables CSS (--p, --t) dont
 * les transformations sont animées. La vue extérieure passe en nuit quand sun.sun est sous l'horizon.
 * Boutons ouvrir / stop / fermer, curseurs de position et d'inclinaison, puissance du moteur.
 * Pergola : les lames pivotent selon l'inclinaison (sinon la position), redessinées image par image ;
 * en option pluie (entity_rain), éclairage LED (entity_light) et vent (entity_wind).
 * Capteurs externes (volet sans retour d'état) : entity_state (contact on/off ou cover) et entity_position (0-100) remplacent l'état de la cover.
 * Fenêtre de toit (Velux) : l'ouvrant pivote sur son axe, volet roulant extérieur en option (entity_blind), pluie.
 */
(() => {
  if (customElements.get('appliance-roller-shutter-card')) return;

  const T = {
    "en": {
      "sliding_curtain": "Sliding curtains",
      "roller_shutter": "Roller shutter",
      "venetian_blind": "Venetian blind",
      "swing_shutter": "Swing shutters",
      "open": "Open",
      "closed": "Closed",
      "opening": "Opening",
      "closing": "Closing",
      "partial": "Open",
      "unavailable": "Unavailable",
      "btn_open": "Open",
      "btn_stop": "Stop",
      "btn_close": "Close",
      "btn_half": "Half-open",
      "position": "Position",
      "tilt": "Tilt",
      "power": "Motor",
      "since": "Last change",
      "pergola": "Bioclimatic pergola",
      "pg_open": "Open",
      "pg_closed": "Closed",
      "pg_partial": "Open",
      "pg_position": "Louvres",
      "rain": "Rain",
      "wind": "Wind",
      "yes": "Yes",
      "no": "No",
      "btn_light": "LED",
      "roof_window": "Roof window",
      "rw_open": "Open",
      "rw_closed": "Closed",
      "rw_partial": "Open",
      "rw_position": "Opening",
      "blind": "Blind",
      "blind_down": "Blind down",
      "btn_blind": "Blind",
      "awning": "Retractable awning",
      "double_awning": "Free-standing double awning",
      "aw_open": "Extended",
      "aw_closed": "Retracted",
      "aw_partial": "Extended",
      "aw_opening": "Extending",
      "aw_closing": "Retracting",
      "aw_position": "Extension",
      "aw_btn_open": "Extend",
      "aw_btn_close": "Retract",
      "aw_wind_alert": "Strong wind",
      "lux": "Sunlight",
      "temperature": "Temperature"
    },
    "cs": {
      "sliding_curtain": "Posuvné závěsy",
      "roller_shutter": "Venkovní roleta",
      "venetian_blind": "Žaluzie",
      "swing_shutter": "Okenice",
      "open": "Otevřeno",
      "closed": "Zavřeno",
      "opening": "Otevírá se",
      "closing": "Zavírá se",
      "partial": "Otevřeno",
      "unavailable": "Nedostupné",
      "btn_open": "Otevřít",
      "btn_stop": "Stop",
      "btn_close": "Zavřít",
      "position": "Poloha",
      "tilt": "Náklon",
      "power": "Motor",
      "since": "Poslední změna",
      "pergola": "Bioklimatická pergola",
      "pg_open": "Otevřeno",
      "pg_closed": "Zavřeno",
      "pg_partial": "Otevřeno",
      "pg_position": "Lamely",
      "rain": "Déšť",
      "wind": "Vítr",
      "yes": "Ano",
      "no": "Ne",
      "btn_light": "LED",
      "roof_window": "Střešní okno",
      "rw_open": "Otevřeno",
      "rw_closed": "Zavřeno",
      "rw_partial": "Otevřeno",
      "rw_position": "Otevření",
      "blind": "Žaluzie",
      "blind_down": "Žaluzie stažená",
      "btn_blind": "Žaluzie",
      "awning": "Markýza",
      "aw_open": "Vysunutá",
      "aw_closed": "Zasunutá",
      "aw_partial": "Vysunutá",
      "aw_opening": "Vysouvá se",
      "aw_closing": "Zasouvá se",
      "aw_position": "Vysunutí",
      "aw_btn_open": "Vysunout",
      "aw_btn_close": "Zasunout",
      "aw_wind_alert": "Silný vítr",
      "lux": "Osvit",
      "temperature": "Teplota"
    },
    "da": {
      "sliding_curtain": "Skydegardiner",
      "roller_shutter": "Rulleskodde",
      "venetian_blind": "Persienne",
      "swing_shutter": "Skodder",
      "open": "Åben",
      "closed": "Lukket",
      "opening": "Åbner",
      "closing": "Lukker",
      "partial": "Åben",
      "unavailable": "Utilgængelig",
      "btn_open": "Åbn",
      "btn_stop": "Stop",
      "btn_close": "Luk",
      "position": "Position",
      "tilt": "Vinkling",
      "power": "Motor",
      "since": "Seneste ændring",
      "pergola": "Bioklimatisk pergola",
      "pg_open": "Åben",
      "pg_closed": "Lukket",
      "pg_partial": "Åben",
      "pg_position": "Lameller",
      "rain": "Regn",
      "wind": "Vind",
      "yes": "Ja",
      "no": "Nej",
      "btn_light": "LED",
      "roof_window": "Ovenlysvindue",
      "rw_open": "Åben",
      "rw_closed": "Lukket",
      "rw_partial": "Åben",
      "rw_position": "Åbning",
      "blind": "Rullegardin",
      "blind_down": "Rullegardin nede",
      "btn_blind": "Rullegardin",
      "awning": "Markise",
      "aw_open": "Rullet ud",
      "aw_closed": "Rullet ind",
      "aw_partial": "Rullet ud",
      "aw_opening": "Ruller ud",
      "aw_closing": "Ruller ind",
      "aw_position": "Udrulning",
      "aw_btn_open": "Rul ud",
      "aw_btn_close": "Rul ind",
      "aw_wind_alert": "Kraftig vind",
      "lux": "Sollys",
      "temperature": "Temperatur"
    },
    "de": {
      "sliding_curtain": "Schiebevorhänge",
      "roller_shutter": "Rollladen",
      "venetian_blind": "Jalousie",
      "swing_shutter": "Klappläden",
      "open": "Offen",
      "closed": "Geschlossen",
      "opening": "Öffnet",
      "closing": "Schließt",
      "partial": "Offen",
      "unavailable": "Nicht verfügbar",
      "btn_open": "Öffnen",
      "btn_stop": "Stopp",
      "btn_close": "Schließen",
      "position": "Position",
      "tilt": "Neigung",
      "power": "Motor",
      "since": "Letzte Änderung",
      "pergola": "Bioklimatische Pergola",
      "pg_open": "Offen",
      "pg_closed": "Geschlossen",
      "pg_partial": "Offen",
      "pg_position": "Lamellen",
      "rain": "Regen",
      "wind": "Wind",
      "yes": "Ja",
      "no": "Nein",
      "btn_light": "LED",
      "roof_window": "Dachfenster",
      "rw_open": "Offen",
      "rw_closed": "Geschlossen",
      "rw_partial": "Offen",
      "rw_position": "Öffnung",
      "blind": "Rollladen",
      "blind_down": "Rollladen unten",
      "btn_blind": "Rollladen",
      "awning": "Markise",
      "aw_open": "Ausgefahren",
      "aw_closed": "Eingefahren",
      "aw_partial": "Ausgefahren",
      "aw_opening": "Fährt aus",
      "aw_closing": "Fährt ein",
      "aw_position": "Ausfahrweite",
      "aw_btn_open": "Ausfahren",
      "aw_btn_close": "Einfahren",
      "aw_wind_alert": "Starker Wind",
      "lux": "Sonnenlicht",
      "temperature": "Temperatur"
    },
    "es": {
      "sliding_curtain": "Cortinas correderas",
      "roller_shutter": "Persiana enrollable",
      "venetian_blind": "Persiana veneciana",
      "swing_shutter": "Contraventanas",
      "open": "Abierta",
      "closed": "Cerrada",
      "opening": "Abriendo",
      "closing": "Cerrando",
      "partial": "Abierta",
      "unavailable": "No disponible",
      "btn_open": "Abrir",
      "btn_stop": "Parar",
      "btn_close": "Cerrar",
      "btn_half": "Media altura",
      "position": "Posición",
      "tilt": "Inclinación",
      "power": "Motor",
      "since": "Último cambio",
      "pergola": "Pérgola bioclimática",
      "pg_open": "Abierta",
      "pg_closed": "Cerrada",
      "pg_partial": "Abierta",
      "pg_position": "Lamas",
      "rain": "Lluvia",
      "wind": "Viento",
      "yes": "Sí",
      "no": "No",
      "btn_light": "LED",
      "roof_window": "Ventana de tejado",
      "rw_open": "Abierta",
      "rw_closed": "Cerrada",
      "rw_partial": "Abierta",
      "rw_position": "Apertura",
      "blind": "Estor",
      "blind_down": "Estor bajado",
      "btn_blind": "Estor",
      "awning": "Toldo retráctil",
      "double_awning": "Toldo doble independiente",
      "aw_open": "Extendido",
      "aw_closed": "Recogido",
      "aw_partial": "Extendido",
      "aw_opening": "Extendiendo",
      "aw_closing": "Recogiendo",
      "aw_position": "Extensión",
      "aw_btn_open": "Extender",
      "aw_btn_close": "Recoger",
      "aw_wind_alert": "Viento fuerte",
      "lux": "Luz solar",
      "temperature": "Temperatura"
    },
    "fr": {
      "sliding_curtain": "Rideaux coulissants",
      "roller_shutter": "Volet roulant",
      "venetian_blind": "Store vénitien",
      "swing_shutter": "Volets battants",
      "open": "Ouvert",
      "closed": "Fermé",
      "opening": "Ouverture",
      "closing": "Fermeture",
      "partial": "Ouvert à",
      "unavailable": "Indisponible",
      "btn_open": "Ouvrir",
      "btn_stop": "Stop",
      "btn_close": "Fermer",
      "btn_half": "Mi-ouvert",
      "position": "Position",
      "tilt": "Inclinaison",
      "power": "Moteur",
      "since": "Depuis",
      "pergola": "Pergola bioclimatique",
      "pg_open": "Ouverte",
      "pg_closed": "Fermée",
      "pg_partial": "Ouverte à",
      "pg_position": "Lames",
      "rain": "Pluie",
      "wind": "Vent",
      "yes": "Oui",
      "no": "Non",
      "btn_light": "LED",
      "roof_window": "Fenêtre de toit",
      "rw_open": "Ouverte",
      "rw_closed": "Fermée",
      "rw_partial": "Ouverte à",
      "rw_position": "Ouverture",
      "blind": "Volet",
      "blind_down": "Volet baissé",
      "btn_blind": "Volet",
      "awning": "Store banne",
      "double_awning": "Store double sur pied",
      "aw_open": "Déployé",
      "aw_closed": "Rentré",
      "aw_partial": "Déployé",
      "aw_opening": "Déploiement",
      "aw_closing": "Rentrée",
      "aw_position": "Déploiement",
      "aw_btn_open": "Déployer",
      "aw_btn_close": "Rentrer",
      "aw_wind_alert": "Vent fort",
      "lux": "Ensoleillement",
      "temperature": "Température"
    },
    "hu": {
      "sliding_curtain": "Elhúzható függönyök",
      "roller_shutter": "Redőny",
      "venetian_blind": "Reluxa",
      "swing_shutter": "Nyíló zsalugáter",
      "open": "Nyitva",
      "closed": "Zárva",
      "opening": "Nyitás",
      "closing": "Zárás",
      "partial": "Nyitva",
      "unavailable": "Nem elérhető",
      "btn_open": "Nyitás",
      "btn_stop": "Stop",
      "btn_close": "Zárás",
      "position": "Pozíció",
      "tilt": "Döntés",
      "power": "Motor",
      "since": "Utolsó változás",
      "pergola": "Bioklimatikus pergola",
      "pg_open": "Nyitva",
      "pg_closed": "Zárva",
      "pg_partial": "Nyitva",
      "pg_position": "Lamellák",
      "rain": "Eső",
      "wind": "Szél",
      "yes": "Igen",
      "no": "Nem",
      "btn_light": "LED",
      "roof_window": "Tetőtéri ablak",
      "rw_open": "Nyitva",
      "rw_closed": "Zárva",
      "rw_partial": "Nyitva",
      "rw_position": "Nyitás",
      "blind": "Reluxa",
      "blind_down": "Reluxa le",
      "btn_blind": "Reluxa",
      "awning": "Kihúzható napellenző",
      "aw_open": "Kihúzva",
      "aw_closed": "Behúzva",
      "aw_partial": "Kihúzva",
      "aw_opening": "Kihúzás",
      "aw_closing": "Behútás",
      "aw_position": "Kihúzás",
      "aw_btn_open": "Kihúzás",
      "aw_btn_close": "Behútás",
      "aw_wind_alert": "Erős szél",
      "lux": "Napfény",
      "temperature": "Hőmérséklet"
    },
    "it": {
      "sliding_curtain": "Tende scorrevoli",
      "roller_shutter": "Tapparella",
      "venetian_blind": "Veneziana",
      "swing_shutter": "Persiane a battente",
      "open": "Aperta",
      "closed": "Chiusa",
      "opening": "In apertura",
      "closing": "In chiusura",
      "partial": "Aperta al",
      "unavailable": "Non disponibile",
      "btn_open": "Apri",
      "btn_stop": "Stop",
      "btn_close": "Chiudi",
      "position": "Posizione",
      "tilt": "Inclinazione",
      "power": "Motore",
      "since": "Da",
      "pergola": "Pergola bioclimatica",
      "pg_open": "Aperta",
      "pg_closed": "Chiusa",
      "pg_partial": "Aperta al",
      "pg_position": "Lamelle",
      "rain": "Pioggia",
      "wind": "Vento",
      "yes": "Sì",
      "no": "No",
      "btn_light": "LED",
      "roof_window": "Finestra da tetto",
      "rw_open": "Aperta",
      "rw_closed": "Chiusa",
      "rw_partial": "Aperta al",
      "rw_position": "Apertura",
      "blind": "Tenda",
      "blind_down": "Tenda abbassata",
      "btn_blind": "Tenda",
      "awning": "Tenda da sole",
      "aw_open": "Aperta",
      "aw_closed": "Chiusa",
      "aw_partial": "Aperta",
      "aw_opening": "In apertura",
      "aw_closing": "In chiusura",
      "aw_position": "Estensione",
      "aw_btn_open": "Apri",
      "aw_btn_close": "Chiudi",
      "aw_wind_alert": "Vento forte",
      "lux": "Luminosità",
      "temperature": "Temperatura"
    },
    "nb": {
      "sliding_curtain": "Skyvegardiner",
      "roller_shutter": "Rullegardin",
      "venetian_blind": "Persienne",
      "swing_shutter": "Vinduslemmer",
      "open": "Åpen",
      "closed": "Lukket",
      "opening": "Åpner",
      "closing": "Lukker",
      "partial": "Åpen",
      "unavailable": "Utilgjengelig",
      "btn_open": "Åpne",
      "btn_stop": "Stopp",
      "btn_close": "Lukk",
      "position": "Posisjon",
      "tilt": "Vinkel",
      "power": "Motor",
      "since": "Sist endret",
      "pergola": "Bioklimatisk pergola",
      "pg_open": "Åpen",
      "pg_closed": "Lukket",
      "pg_partial": "Åpen",
      "pg_position": "Lameller",
      "rain": "Regn",
      "wind": "Vind",
      "yes": "Ja",
      "no": "Nei",
      "btn_light": "LED",
      "roof_window": "Takvindu",
      "rw_open": "Åpent",
      "rw_closed": "Lukket",
      "rw_partial": "Åpent",
      "rw_position": "Åpning",
      "blind": "Rullegardin",
      "blind_down": "Rullegardin nede",
      "btn_blind": "Rullegardin",
      "awning": "Markise",
      "aw_open": "Utfelt",
      "aw_closed": "Inntrukket",
      "aw_partial": "Utfelt",
      "aw_opening": "Trekker ut",
      "aw_closing": "Trekker inn",
      "aw_position": "Utfelling",
      "aw_btn_open": "Trekk ut",
      "aw_btn_close": "Trekk inn",
      "aw_wind_alert": "Sterk vind",
      "lux": "Sollys",
      "temperature": "Temperatur"
    },
    "nl": {
      "sliding_curtain": "Schuifgordijnen",
      "roller_shutter": "Rolluik",
      "venetian_blind": "Jaloezie",
      "swing_shutter": "Luiken",
      "open": "Open",
      "closed": "Gesloten",
      "opening": "Gaat open",
      "closing": "Sluit",
      "partial": "Open",
      "unavailable": "Niet beschikbaar",
      "btn_open": "Openen",
      "btn_stop": "Stop",
      "btn_close": "Sluiten",
      "position": "Positie",
      "tilt": "Kanteling",
      "power": "Motor",
      "since": "Laatste wijziging",
      "pergola": "Bioklimatische pergola",
      "pg_open": "Open",
      "pg_closed": "Gesloten",
      "pg_partial": "Open",
      "pg_position": "Lamellen",
      "rain": "Regen",
      "wind": "Wind",
      "yes": "Ja",
      "no": "Nee",
      "btn_light": "LED",
      "roof_window": "Dakraam",
      "rw_open": "Open",
      "rw_closed": "Gesloten",
      "rw_partial": "Open",
      "rw_position": "Opening",
      "blind": "Rolluik",
      "blind_down": "Rolluik dicht",
      "btn_blind": "Rolluik",
      "awning": "Zonnescherm",
      "aw_open": "Uitgerold",
      "aw_closed": "Ingerold",
      "aw_partial": "Uitgerold",
      "aw_opening": "Rolt uit",
      "aw_closing": "Rolt in",
      "aw_position": "Uitrolling",
      "aw_btn_open": "Uitrollen",
      "aw_btn_close": "Inrollen",
      "aw_wind_alert": "Harde wind",
      "lux": "Zonlicht",
      "temperature": "Temperatuur"
    },
    "pl": {
      "sliding_curtain": "Zasłony przesuwne",
      "roller_shutter": "Roleta zewnętrzna",
      "venetian_blind": "Żaluzja",
      "swing_shutter": "Okiennice skrzydłowe",
      "open": "Otwarta",
      "closed": "Zamknięta",
      "opening": "Otwieranie",
      "closing": "Zamykanie",
      "partial": "Otwarta",
      "unavailable": "Niedostępny",
      "btn_open": "Otwarta",
      "btn_stop": "Stop",
      "btn_close": "Zamknij",
      "position": "Pozycja",
      "tilt": "Pochylenie",
      "power": "Silnik",
      "since": "Ostatnia zmiana",
      "pergola": "Pergola bioklimatyczna",
      "pg_open": "Otwarta",
      "pg_closed": "Zamknięta",
      "pg_partial": "Otwarta",
      "pg_position": "Lamele",
      "rain": "Deszcz",
      "wind": "Wiatr",
      "yes": "Tak",
      "no": "Nie",
      "btn_light": "LED",
      "roof_window": "Okno dachowe",
      "rw_open": "Otwarta",
      "rw_closed": "Zamknięta",
      "rw_partial": "Otwarta",
      "rw_position": "Otwieranie",
      "blind": "Roleta",
      "blind_down": "Roleta opuszczona",
      "btn_blind": "Roleta",
      "awning": "Markiza",
      "aw_open": "Rozwinięta",
      "aw_closed": "Zwinięta",
      "aw_partial": "Rozwinięta",
      "aw_opening": "Rozwija się",
      "aw_closing": "Zwija się",
      "aw_position": "Rozwinięcie",
      "aw_btn_open": "Rozwiń",
      "aw_btn_close": "Zwiń",
      "aw_wind_alert": "Silny wiatr",
      "lux": "Nasłonecznienie",
      "temperature": "Temperatura"
    },
    "pt-BR": {
      "sliding_curtain": "Cortinas deslizantes",
      "roller_shutter": "Persiana de enrolar",
      "venetian_blind": "Persiana veneziana",
      "swing_shutter": "Persianas de abrir",
      "open": "Aberta",
      "closed": "Fechada",
      "opening": "Abrindo",
      "closing": "Fechando",
      "partial": "Aberta",
      "unavailable": "Indisponível",
      "btn_open": "Abrir",
      "btn_stop": "Parar",
      "btn_close": "Fechar",
      "btn_half": "Meio aberto",
      "position": "Posição",
      "tilt": "Inclinação",
      "power": "Motor",
      "since": "Última alteração",
      "pergola": "Pérgula bioclimática",
      "pg_open": "Aberta",
      "pg_closed": "Fechada",
      "pg_partial": "Aberta",
      "pg_position": "Lâminas",
      "rain": "Chuva",
      "wind": "Vento",
      "yes": "Sim",
      "no": "Não",
      "btn_light": "LED",
      "roof_window": "Janela de telhado",
      "rw_open": "Aberta",
      "rw_closed": "Fechada",
      "rw_partial": "Aberta",
      "rw_position": "Abertura",
      "blind": "Persiana",
      "blind_down": "Persiana abaixada",
      "btn_blind": "Persiana",
      "awning": "Toldo retrátil",
      "double_awning": "Toldo duplo autoportante",
      "aw_open": "Estendido",
      "aw_closed": "Retraído",
      "aw_partial": "Estendido",
      "aw_opening": "Estendendo",
      "aw_closing": "Recolhendo",
      "aw_position": "Extensão",
      "aw_btn_open": "Estender",
      "aw_btn_close": "Recolher",
      "aw_wind_alert": "Vento forte",
      "lux": "Luz solar",
      "temperature": "Temperatura"
    },
    "pt-PT": {
      "sliding_curtain": "Cortinas deslizantes",
      "roller_shutter": "Estore de enrolar",
      "venetian_blind": "Persiana veneziana",
      "swing_shutter": "Portadas",
      "open": "Aberto",
      "closed": "Fechado",
      "opening": "A abrir",
      "closing": "A fechar",
      "partial": "Aberto",
      "unavailable": "Indisponível",
      "btn_open": "Abrir",
      "btn_stop": "Parar",
      "btn_close": "Fechar",
      "btn_half": "Meio aberto",
      "position": "Posição",
      "tilt": "Inclinação",
      "power": "Motor",
      "since": "Última alteração",
      "pergola": "Pérgula bioclimática",
      "pg_open": "Aberta",
      "pg_closed": "Fechada",
      "pg_partial": "Aberta",
      "pg_position": "Lâminas",
      "rain": "Chuva",
      "wind": "Vento",
      "yes": "Sim",
      "no": "Não",
      "btn_light": "LED",
      "roof_window": "Janela de telhado",
      "rw_open": "Aberta",
      "rw_closed": "Fechada",
      "rw_partial": "Aberta",
      "rw_position": "Abertura",
      "blind": "Estore",
      "blind_down": "Estore descido",
      "btn_blind": "Estore",
      "awning": "Toldo retrátil",
      "double_awning": "Toldo duplo autoportante",
      "aw_open": "Estendido",
      "aw_closed": "Recolhido",
      "aw_partial": "Estendido",
      "aw_opening": "A estender",
      "aw_closing": "A recolher",
      "aw_position": "Extensão",
      "aw_btn_open": "Estender",
      "aw_btn_close": "Recolher",
      "aw_wind_alert": "Vento forte",
      "lux": "Luz solar",
      "temperature": "Temperatura"
    },
    "ro": {
      "sliding_curtain": "Perdele glisante",
      "roller_shutter": "Rulou exterior",
      "venetian_blind": "Jaluzea",
      "swing_shutter": "Obloane",
      "open": "Deschis",
      "closed": "Închis",
      "opening": "Se deschide",
      "closing": "Se închide",
      "partial": "Deschis",
      "unavailable": "Indisponibil",
      "btn_open": "Deschide",
      "btn_stop": "Stop",
      "btn_close": "Închide",
      "position": "Poziție",
      "tilt": "Înclinare",
      "power": "Motor",
      "since": "Ultima schimbare",
      "pergola": "Pergolă bioclimatică",
      "pg_open": "Deschisă",
      "pg_closed": "Închisă",
      "pg_partial": "Deschisă",
      "pg_position": "Lamele",
      "rain": "Ploaie",
      "wind": "Vânt",
      "yes": "Da",
      "no": "Nu",
      "btn_light": "LED",
      "roof_window": "Fereastră de mansardă",
      "rw_open": "Deschisă",
      "rw_closed": "Închisă",
      "rw_partial": "Deschisă",
      "rw_position": "Deschidere",
      "blind": "Rulou",
      "blind_down": "Rulou coborât",
      "btn_blind": "Rulou",
      "awning": "Copertină retractabilă",
      "aw_open": "Desfăcută",
      "aw_closed": "Strânsă",
      "aw_partial": "Desfăcută",
      "aw_opening": "Se desface",
      "aw_closing": "Se strânge",
      "aw_position": "Desfacere",
      "aw_btn_open": "Desface",
      "aw_btn_close": "Strânge",
      "aw_wind_alert": "Vânt puternic",
      "lux": "Luminozitate",
      "temperature": "Temperatură"
    },
    "ru": {
      "sliding_curtain": "Раздвижные шторы",
      "roller_shutter": "Рольставни",
      "venetian_blind": "Жалюзи",
      "swing_shutter": "Распашные ставни",
      "open": "Открыто",
      "closed": "Закрыто",
      "opening": "Открывание",
      "closing": "Закрывание",
      "partial": "Открыто",
      "unavailable": "Недоступно",
      "btn_open": "Открыть",
      "btn_stop": "Стоп",
      "btn_close": "Закрыть",
      "position": "Позиция",
      "tilt": "Наклон",
      "power": "Мотор",
      "since": "Последнее изменение",
      "pergola": "Биоклиматическая пергола",
      "pg_open": "Открыта",
      "pg_closed": "Закрыта",
      "pg_partial": "Открыта на",
      "pg_position": "Ламели",
      "rain": "Дождь",
      "wind": "Ветер",
      "yes": "Да",
      "no": "Нет",
      "btn_light": "LED",
      "roof_window": "Мансардное окно",
      "rw_open": "Открыто",
      "rw_closed": "Закрыто",
      "rw_partial": "Открыто на",
      "rw_position": "Открытие",
      "blind": "Рольставня",
      "blind_down": "Рольставня опущена",
      "btn_blind": "Ставня",
      "awning": "Маркиза",
      "aw_open": "Раскрыта",
      "aw_closed": "Убрана",
      "aw_partial": "Раскрыта",
      "aw_opening": "Раскрывается",
      "aw_closing": "Убирается",
      "aw_position": "Вылет",
      "aw_btn_open": "Раскрыть",
      "aw_btn_close": "Убрать",
      "aw_wind_alert": "Сильный ветер",
      "lux": "Освещённость",
      "temperature": "Температура"
    },
    "sr": {
      "sliding_curtain": "Клизне завесе",
      "roller_shutter": "Ролетна",
      "venetian_blind": "Венецијанер",
      "swing_shutter": "Шкуре (Шалкане)",
      "open": "Отворено",
      "closed": "Затворено",
      "opening": "Отварање",
      "closing": "Затварање",
      "partial": "Отворено",
      "unavailable": "Недоступно",
      "btn_open": "Отвори",
      "btn_stop": "Заустави",
      "btn_close": "Затвори",
      "position": "Позиција",
      "tilt": "Нагиб",
      "power": "Мотор",
      "since": "Последња промена",
      "pergola": "Биоклиматска пергола",
      "pg_open": "Отворено",
      "pg_closed": "Затворено",
      "pg_partial": "Отворено",
      "pg_position": "Жалузине",
      "rain": "Киша",
      "wind": "Ветар",
      "yes": "Да",
      "no": "Не",
      "btn_light": "LED",
      "roof_window": "Кровни прозор",
      "rw_open": "Отворено",
      "rw_closed": "Затворено",
      "rw_partial": "Отворено",
      "rw_position": "Отварање",
      "blind": "Застор (Роло жалузина)",
      "blind_down": "Застор спуштен",
      "btn_blind": "Застор",
      "awning": "Тенда",
      "aw_open": "Развучена",
      "aw_closed": "Увучена",
      "aw_partial": "Развучена",
      "aw_opening": "Развлачи се",
      "aw_closing": "Увлачи се",
      "aw_position": "Извлачење",
      "aw_btn_open": "Развуци",
      "aw_btn_close": "Увуци",
      "aw_wind_alert": "Јак ветар",
      "lux": "Осветљеност",
      "temperature": "Температура"
    },
    "sr-Latn": {
      "sliding_curtain": "Klizne zavese",
      "roller_shutter": "Roletna",
      "venetian_blind": "Venecijaner",
      "swing_shutter": "Škure (Šalkane)",
      "open": "Otvoreno",
      "closed": "Zatvoreno",
      "opening": "Otvaranje",
      "closing": "Zatvaranje",
      "partial": "Otvoreno",
      "unavailable": "Nedostupno",
      "btn_open": "Otvori",
      "btn_stop": "Zaustavi",
      "btn_close": "Zatvori",
      "position": "Pozicija",
      "tilt": "Nagib",
      "power": "Motor",
      "since": "Poslednja promena",
      "pergola": "Bioklimatska pergola",
      "pg_open": "Otvoreno",
      "pg_closed": "Zatvoreno",
      "pg_partial": "Otvoreno",
      "pg_position": "Žaluzine",
      "rain": "Kiša",
      "wind": "Vetar",
      "yes": "Da",
      "no": "Ne",
      "btn_light": "LED",
      "roof_window": "Krovni prozor",
      "rw_open": "Otvoreno",
      "rw_closed": "Zatvoreno",
      "rw_partial": "Otvoreno",
      "rw_position": "Otvaranje",
      "blind": "Zastor (Rolo žaluzina)",
      "blind_down": "Zastor spušten",
      "btn_blind": "Zastor",
      "awning": "Tenda",
      "aw_open": "Razvučena",
      "aw_closed": "Uvučena",
      "aw_partial": "Razvučena",
      "aw_opening": "Razvlači se",
      "aw_closing": "Uvlači se",
      "aw_position": "Izvlačenje",
      "aw_btn_open": "Razvuci",
      "aw_btn_close": "Uvuci",
      "aw_wind_alert": "Jak vetar",
      "lux": "Osvetljenost",
      "temperature": "Temperatura"
    },
    "uk": {
      "sliding_curtain": "Розсувні штори",
      "roller_shutter": "Рольставні",
      "venetian_blind": "Жалюзі",
      "swing_shutter": "Віконниці",
      "open": "Відчинено",
      "closed": "Зачинено",
      "opening": "Відчиняється",
      "closing": "Зачиняється",
      "partial": "Відчинено",
      "unavailable": "Недоступно",
      "btn_open": "Відчинити",
      "btn_stop": "Стоп",
      "btn_close": "Зачинити",
      "position": "Положення",
      "tilt": "Нахил",
      "power": "Двигун",
      "since": "Остання зміна",
      "pergola": "Біокліматична пергола",
      "pg_open": "Відчинено",
      "pg_closed": "Зачинено",
      "pg_partial": "Відчинено",
      "pg_position": "Ламелі",
      "rain": "Дощ",
      "wind": "Вітер",
      "yes": "Так",
      "no": "Ні",
      "btn_light": "LED",
      "roof_window": "Мансардне вікно",
      "rw_open": "Відчинено",
      "rw_closed": "Зачинено",
      "rw_partial": "Відчинено",
      "rw_position": "Відкриття",
      "blind": "Штора",
      "blind_down": "Штора опущена",
      "btn_blind": "Штора",
      "awning": "Висувна маркіза",
      "double_awning": "Подвійна вільностояча маркіза",
      "aw_open": "Висунуто",
      "aw_closed": "Складено",
      "aw_partial": "Висунуто",
      "aw_opening": "Висувається",
      "aw_closing": "Складається",
      "aw_position": "Висування",
      "aw_btn_open": "Висунути",
      "aw_btn_close": "Скласти",
      "aw_wind_alert": "Сильний вітер",
      "lux": "Сонячне світло",
      "temperature": "Температура"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sh-move:var(--appliance-heat-color,#ff8a3d);--sh-ok:var(--appliance-ok-color,#43a047);
  --sh-cold:var(--appliance-cold-color,#2b9af9);--sc:#d5dbe1;--p:0;--t:100;--sh-d:1.2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--sh-ok) 22%,transparent);color:var(--sh-ok)}
.partial .badge{background:color-mix(in srgb,var(--sh-cold) 22%,transparent);color:var(--sh-cold)}
.opening .badge,.closing .badge{background:color-mix(in srgb,var(--sh-move) 22%,transparent);color:var(--sh-move)}
.scene{position:relative;max-width:calc(250px * var(--illus-scale,1));margin:4px auto 0;cursor:pointer}
.scene>svg{display:block;width:100%;height:auto}
.scene.pg{max-width:calc(360px * var(--illus-scale,1))}
.scene.pg>svg{border-radius:10px}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 64px;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.rng{display:flex;align-items:center;gap:8px;margin:8px 2px 0;font-size:10px;color:var(--secondary-text-color)}
.rng.hide{display:none}
.rng span{min-width:56px;flex:none}
.rng input{flex:1;min-width:0;width:100%;accent-color:var(--sh-cold);margin:0;cursor:pointer}
.rng.tl input{accent-color:#c9a96b}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- commun : jour / nuit, voyant, flèche de mouvement ---- */
.day,.night{transition:opacity .8s}
.night{opacity:0}
.isnight .night{opacity:1}.isnight .day{opacity:0}
.led{fill:var(--sh-ok)}
.closed .led{fill:#db4437}
.opening .led,.closing .led{fill:var(--sh-move);animation:shblink .5s steps(2) infinite}
@keyframes shblink{50%{opacity:.25}}
.arrow{opacity:0;transition:opacity .3s}
.opening .arrow,.closing .arrow{opacity:1}
.arrow .dn{display:none}.closing .arrow .dn{display:inline}.closing .arrow .up{display:none}
.opening .arrow circle,.closing .arrow circle{animation:shpulse 1s ease-in-out infinite}
@keyframes shpulse{50%{opacity:.75}}
.beam{opacity:calc(var(--p) * .0022);transition:opacity var(--sh-d)}
.isnight .beam{opacity:0}
.unavailable .scene{filter:grayscale(.7) opacity(.7)}
.mv{transition:transform var(--sh-d) var(--sh-e,ease-in-out)}
.noanim .mv,.noanim .beam{transition:none}
.noanim .led,.noanim .arrow circle{animation:none}

/* ---- volet roulant : le tablier remonte dans le coffre ---- */
.tab{transform:translateY(calc(var(--p) * -1.12px))}
.slit{fill:#ffe9a8;opacity:.55}
.isnight .slit{opacity:0}

/* ---- store vénitien : les lamelles se tassent en haut et s'inclinent (--t : 0 = fermées, 50 = ouvertes à plat, 100 = refermées dans l'autre sens) ----
   --sf = hauteur apparente d'une lamelle vue de face, --sd / --sl = face qui s'assombrit / s'éclaire, --lt = lumière qui passe (0-100) */
.lift{transform-box:view-box;transform-origin:100px 42px;transform:scaleY(calc(1 - var(--p) * .0092))}
.rail{transform:translateY(calc(var(--p) * -.94px))}
.sl{transform-box:fill-box;transform-origin:center;transform:scaleY(var(--sf,1));transition:transform 1.2s ease-in-out}
.sl .sd,.sl .sw{transition:opacity 1.2s ease-in-out}.sl .sd{opacity:var(--sd,0)}.sl .sw{opacity:var(--sl,0)}
.vb .beam{opacity:calc(max(var(--p), var(--lt,0) * .7) * .0022)}
/* inclinaison seule : les lamelles restent réparties sur toute la fenêtre, seul leur angle change */
.tonly .lift,.tonly .rail{transform:none}.tonly .vb .arrow{display:none}
.tonly .vb .beam{opacity:calc(var(--lt,0) * .0015)}
.isnight .vb .beam{opacity:0}

/* ---- rideaux : deux pans de tissu qui se replient horizontalement ---- */
.curtain-panel{transform-box:view-box;transform-origin:22px 31px;transform:scaleX(calc(1 - var(--p) * .0075))}
@media(prefers-reduced-motion:reduce){.curtain-panel{transition:none}}

/* ---- volets battants : deux vantaux en 3D, pivot sur les gonds ---- */
.sw{perspective:520px;perspective-origin:50% 45%}
.leaf{position:absolute;top:22.1%;height:60.5%;width:20%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.leaf.l{left:30%;transform-origin:0 50%;transform:rotateY(calc(var(--p) * 1.72deg))}
.leaf.r{left:50%;transform-origin:100% 50%;transform:rotateY(calc(var(--p) * -1.72deg))}
.leaf .sh{opacity:calc(var(--p) * .004);transition:opacity var(--sh-d)}

/* ---- pergola bioclimatique : pluie, nuit, éclairage LED ---- */
.pg-gap{fill:#8fd0f7;transition:fill .8s}.isnight .pg-gap{fill:#24305a}.rain .pg-gap{fill:#b9c4d0}
.pg-cloud,.pg-drops,.pg-drain{opacity:0;transition:opacity .8s}.rain .pg-cloud,.rain .pg-drops,.rain .pg-drain{opacity:1}
.rain .pg-sun{opacity:0}
.pg-dim{opacity:0;transition:opacity .8s}.isnight .pg-dim{opacity:.6}
.pg-roof{transition:filter .8s}.isnight .pg-roof{filter:brightness(.42)}
.pg-shadow{opacity:.22;transition:opacity .8s}.rain .pg-shadow{opacity:.1}.isnight .pg-shadow{opacity:0}
.pg-ray{opacity:calc(var(--a) * .004);animation:pgray 4s ease-in-out infinite}.isnight .pg-ray,.rain .pg-ray{opacity:0}
.pg-ray:nth-child(2){animation-delay:-1.2s}.pg-ray:nth-child(3){animation-delay:-2.4s}.pg-ray:nth-child(4){animation-delay:-3.1s}
@keyframes pgray{50%{fill-opacity:.45}}
.pg-strip,.pg-pool{opacity:0;transition:opacity .6s}.leds .pg-strip{opacity:1;filter:drop-shadow(0 0 2px #ffd27a)}.isnight.leds .pg-pool{opacity:1}
.pg-candle,.pg-glow{opacity:0}.isnight .pg-candle,.isnight .pg-glow{opacity:.7}
.pg-water path{animation:pgwave 3s ease-in-out infinite alternate}.pg-water path:nth-child(2n){animation-delay:-1.5s}
@keyframes pgwave{to{transform:translateX(6px)}}.pg-candle circle{animation:pgflick 1.3s ease-in-out infinite}
@keyframes pgflick{50%{opacity:.6}}
.pg-drops line{animation:pgdrop .7s linear infinite}
.pg-drops line:nth-child(3n){animation-delay:-.23s}.pg-drops line:nth-child(3n+1){animation-delay:-.47s}
@keyframes pgdrop{from{transform:translate(0,-40px)}to{transform:translate(-8px,150px)}}
.pg-drain circle{animation:pgdrain 1.4s linear infinite}.pg-drain circle:nth-child(2){animation-delay:-.7s}
@keyframes pgdrain{from{transform:translateY(0);opacity:1}to{transform:translateY(80px);opacity:.3}}
.ctl button.on{background:color-mix(in srgb,#ffc94a 35%,var(--secondary-background-color))}
.rw-blind{transform:translateY(calc((var(--bl,0) - 100) * .96px));transition:transform 1.2s ease-in-out}
.rw-in{transition:fill .8s}.isnight .rw-in{fill:#ffcf7a}.isnight .rw-in2{fill:#e9a85a}
.noanim .rw-blind{transition:none}
/* ---- store banne : ombre portée, éclairage LED, vent fort (la toile flotte), pluie ---- */
.aw-shadow{opacity:.24;transition:opacity .8s}.rain .aw-shadow{opacity:.1}.isnight .aw-shadow{opacity:0}
.aw-dyn{transition:filter .8s}.rain .aw-dyn{filter:brightness(.84) saturate(.8)}.isnight .aw-dyn{filter:brightness(.45)}.isnight.rain .aw-dyn{filter:brightness(.4) saturate(.8)}
.aw-strip,.aw-pool{opacity:0;transition:opacity .6s}.leds .aw-strip{opacity:1;filter:drop-shadow(0 0 2px #ffd27a)}.isnight.leds .aw-pool{opacity:1}
.aw-flap{transform-box:view-box;transform-origin:120px 38px}
.windy .aw-flap{animation:awflap .55s ease-in-out infinite alternate}
@keyframes awflap{from{transform:skewX(-1.6deg) translateY(-.6px)}to{transform:skewX(1.6deg) translateY(1px)}}
.aw-wind{opacity:0;transition:opacity .4s}.windy .aw-wind{opacity:.85}.windy .aw-wind path{animation:awgust 1.1s ease-in-out infinite}
.aw-wind path:nth-child(2){animation-delay:-.35s!important}.aw-wind path:nth-child(3){animation-delay:-.7s!important}
@keyframes awgust{from{transform:translateX(-6px);opacity:.3}to{transform:translateX(10px);opacity:1}}
.tile.warn{background:color-mix(in srgb,var(--sh-move) 30%,var(--secondary-background-color))}
.windy .badge{background:color-mix(in srgb,var(--sh-move) 28%,transparent);color:var(--sh-move)}
.aw-flap2{transform-box:view-box;transform-origin:50% 22%}
.windy .aw-flap2{animation:awflap2 .6s ease-in-out infinite alternate}
@keyframes awflap2{from{transform:skewX(-.7deg) translateY(-1px)}to{transform:skewX(.7deg) translateY(1.5px)}}
.isnight .ph-dyn{filter:none}.rain .ph-dyn{filter:brightness(.88) saturate(.85)}
.noanim .aw-flap,.noanim .aw-flap2,.noanim .aw-wind path{animation:none}
.noanim .pg-water path,.noanim .windy .aw-flap,.noanim .pg-ray,.noanim .pg-candle circle,.noanim .pg-drops line,.noanim .pg-drain circle{animation:none}
`;

  // ciel et paysage vus par la fenêtre (x0..x1, y0..y1), en version jour et nuit
  const outside = (x0, y0, x1, y1, id) => {
    const w = x1 - x0, h = y1 - y0, cx = x0 + w * .78, cy = y0 + h * .26;
    const hills = (c1, c2) => `<path d="M${x0} ${y0 + h * .76} Q${x0 + w * .27} ${y0 + h * .58} ${x0 + w * .53} ${y0 + h * .72} T${x1} ${y0 + h * .65} V${y1} H${x0}Z" fill="${c1}"/>
      <path d="M${x0} ${y0 + h * .87} Q${x0 + w * .4} ${y0 + h * .74} ${x1} ${y0 + h * .85} V${y1} H${x0}Z" fill="${c2}"/>`;
    return `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath>
    <g clip-path="url(#${id})">
      <g class="day"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyd)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .12}" fill="#ffe27a" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#ffd54a"/>${hills('#7fbf6a', '#5ea552')}</g>
      <g class="night"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#shskyn)"/>
        <circle cx="${cx}" cy="${cy}" r="${w * .07}" fill="#f4f1d0"/><circle cx="${cx + w * .03}" cy="${cy - h * .03}" r="${w * .062}" fill="#16234a"/>
        ${[[.2, .15], [.47, .09], [.63, .35], [.29, .4], [.12, .3]].map(([a, b]) => `<circle cx="${x0 + w * a}" cy="${y0 + h * b}" r="1" fill="#fff"/>`).join('')}${hills('#13233d', '#0e1b30')}</g>
    </g>`;
  };
  const DEFS = `<defs>
    <linearGradient id="shskyd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ff"/><stop offset="1" stop-color="#d7f0ff"/></linearGradient>
    <linearGradient id="shskyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1430"/><stop offset="1" stop-color="#1b2a55"/></linearGradient>
    <linearGradient id="shalu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f7f9"/><stop offset="1" stop-color="#bfc6cd"/></linearGradient>
    <linearGradient id="shrelief" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <linearGradient id="shcurtainfold"><stop stop-color="#000" stop-opacity=".19"/><stop offset=".28" stop-color="#fff" stop-opacity=".13"/><stop offset=".6" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <pattern id="shcurtainfabric" width="12" height="130" patternUnits="userSpaceOnUse"><rect width="12" height="130" fill="var(--sc)"/><rect width="12" height="130" fill="url(#shcurtainfold)"/></pattern>
  </defs>`;
  const ARROW = (x, y) => `<g class="arrow" transform="translate(${x} ${y})"><circle r="9" fill="#ff8a3d"/>
    <path class="up" d="M-4 2 L0 -3 L4 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="dn" d="M-4 -2 L0 3 L4 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;

  const X0 = 34, X1 = 166, Y0 = 36, Y1 = 146, W = X1 - X0, H = Y1 - Y0;
  const SVGS = {
    // Deux pans de tissu qui se replient vers les bords (panels: 2, défaut), ou un seul pan qui s'empile
    // à gauche ou à droite (panels: 1 + side), sans jamais s'enrouler verticalement.
    sliding_curtain: (c = {}) => {
      const waves = (d) => `t${d} 0`.repeat(12);
      const panel = '<path d="M22 31q6 3 12 0t12 0t12 0t12 0t12 0t12 0h6v117q-6 3-12 0t-12 0t-12 0t-12 0t-12 0t-12 0h-6Z" fill="url(#shcurtainfabric)"/>';
      // pan unique : 13 ondulations de 12 couvrent toute la largeur du rail (x 22 → 178)
      const single = `<path d="M22 31q6 3 12 0${waves(12)}v117q-6 3-12 0${waves(-12)}Z" fill="url(#shcurtainfabric)"/>`;
      const one = Number(c.panels) === 1;
      const curtains = one
        ? (c.side === 'right'
          ? `<g transform="translate(200 0) scale(-1 1)"><g class="curtain-right curtain-panel mv">${single}</g></g>`
          : `<g class="curtain-left curtain-panel mv">${single}</g>`)
        : `<g class="curtain-left curtain-panel mv">${panel}</g>
        <g transform="translate(200 0) scale(-1 1)"><g class="curtain-right curtain-panel mv">${panel}</g></g>`;
      return `<rect x="28" y="36" width="144" height="110" rx="2" fill="#8a96a2"/>
        <g class="day"><rect x="32" y="40" width="136" height="102" fill="url(#shskyd)"/><circle cx="142" cy="59" r="7" fill="#ffe27a"/></g>
        <g class="night"><rect x="32" y="40" width="136" height="102" fill="url(#shskyn)"/><path d="M140 53a7 7 0 1 0 8 9 8 8 0 0 1-8-9" fill="#d9e4e8"/></g>
        <path d="${one ? '' : 'M100 40v102'}M32 142h136" stroke="#7c8c9d" stroke-width="3"/>
        <rect x="24" y="145" width="152" height="4" rx="1" fill="#a7b1b9"/>
        ${curtains}
        <rect x="18" y="25" width="164" height="4" rx="1.5" fill="url(#shalu)"/>
        <path d="M20 29v3m160-3v3" stroke="#7c8791" stroke-width="2"/>`;
    },
    // tablier de lames alu (couleur --sc) qui remonte dans le coffre
    roller_shutter: () => {
      let sl = '';
      for (let y = Y0 - 2; y < Y1; y += 7) {
        sl += `<rect x="${X0}" y="${y}" width="${W}" height="7" fill="var(--sc)"/><rect x="${X0}" y="${y}" width="${W}" height="7" fill="url(#shrelief)"/>
          <line x1="${X0}" x2="${X1}" y1="${y + 6.5}" y2="${y + 6.5}" stroke="#00000055" stroke-width=".8"/>`;
        for (let x = X0 + 6; x < X1 - 4; x += 9) sl += `<rect class="slit" x="${x}" y="${y + 5.6}" width="4" height=".9"/>`;
      }
      return `<rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwr')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <g clip-path="url(#shwr)"><g class="tab mv">${sl}${ARROW(100, Y1 - 12)}</g></g>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0 - 6}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/><rect x="${X1}" y="${Y0 - 2}" width="6" height="${H + 4}" fill="#9aa3ac"/>
        <rect x="${X0 - 8}" y="18" width="${W + 16}" height="20" rx="3" fill="url(#shalu)"/><rect x="${X0 - 8}" y="35" width="${W + 16}" height="3" fill="#8d959d"/>
        <circle class="led" cx="${X1 + 2}" cy="28" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/>`;
    },
    // lamelles (couleur --sc) qui se tassent sous le caisson et pivotent sur elles-mêmes
    venetian_blind: () => {
      let sl = '';
      for (let y = Y0 + 8; y < Y1 - 4; y += 7) sl += `<g class="sl"><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="var(--sc)"/><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="url(#shrelief)"/><rect class="sd" x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="#000"/><rect class="sw" x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="#fff"/></g>`;
      const cords = [64, 136].map((x) => `<line x1="${x}" y1="${Y0 + 4}" x2="${x}" y2="${Y1 - 4}" stroke="#00000035" stroke-width=".8"/>`).join('');
      return `<g class="vb"><rect x="14" y="14" width="172" height="146" rx="4" fill="#3a3f47"/>${outside(X0, Y0, X1, Y1, 'shwv')}
        <line x1="100" y1="${Y0}" x2="100" y2="${Y1}" stroke="#e9edf1" stroke-width="3"/>
        <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="none" stroke="#e9edf1" stroke-width="3"/>
        <g class="lift mv">${cords}${sl}</g>
        <g class="rail mv"><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="var(--sc)"/><rect x="${X0 + 1}" y="${Y1 - 5}" width="${W - 2}" height="4" rx="1.5" fill="#000" opacity=".25"/>${ARROW(100, Y1 - 16)}</g>
        <rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="var(--sc)"/><rect x="${X0 - 4}" y="${Y0 - 4}" width="${W + 8}" height="8" rx="2" fill="url(#shrelief)"/>
        <circle class="led" cx="${X1}" cy="${Y0}" r="2.2"/>
        <polygon class="beam" points="${X0},${Y1} ${X1},${Y1} ${X1 + 16},172 ${X0 - 16},172" fill="#ffe9a8"/>
        <rect x="${X0 - 12}" y="${Y1 + 2}" width="${W + 24}" height="7" rx="2" fill="#d9dde1"/></g>`;
    },
    // façade et fenêtre ; les deux vantaux sont des calques 3D posés par-dessus (voir LEAF)
    swing_shutter: () => `<rect x="6" y="14" width="188" height="146" rx="4" fill="#d8cbb5"/>${outside(62, 40, 138, 142, 'shws')}
        <line x1="100" y1="40" x2="100" y2="142" stroke="#f3eee6" stroke-width="3"/><rect x="62" y="40" width="76" height="102" fill="none" stroke="#f3eee6" stroke-width="3"/>
        <rect x="52" y="143" width="96" height="6" rx="2" fill="#efe9df"/>
        <circle class="led" cx="100" cy="26" r="2.2"/>${ARROW(100, 92)}`,
  };
  // un vantail à persiennes (couleur --sc), dessiné dans un rectangle 40 × 104
  const LEAF = (right) => {
    let lv = '';
    for (let y = 8; y < 100; y += 5.4) lv += `<line x1="4" y1="${y.toFixed(1)}" x2="36" y2="${(y + 2).toFixed(1)}" stroke="#00000048" stroke-width="1.3"/>`;
    const hx = right ? 36 : 0;
    return `<svg viewBox="0 0 40 104" preserveAspectRatio="none"><rect width="40" height="104" fill="var(--sc)"/>${lv}
      <rect x="1" y="1" width="38" height="102" fill="none" stroke="#00000055" stroke-width="2"/><rect x="2" y="48" width="36" height="4" fill="#00000030"/>
      <rect x="${hx}" y="14" width="4" height="4" fill="#30343a"/><rect x="${hx}" y="86" width="4" height="4" fill="#30343a"/>
      <rect class="sh" width="40" height="104" fill="#000"/></svg>`;
  };

  /* ---- pergola : repère 240 × 180 ; coins du toit (arrière / avant, gauche / droite), hauteur des poteaux, nombre de lames ---- */
  const PG = { BL: [62, 34], BR: [222, 34], FL: [22, 70], FR: [182, 70], H: 84, N: 9, SX: 16 };
  const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const pts = (a) => a.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  // lames et leur ombre sur la terrasse pour un angle a (0 = fermée, à plat ; 100 = lames verticales)
  const pgBlades = (a) => {
    const th = a / 100 * Math.PI / 2, co = Math.cos(th), up = 1.2 * Math.sin(th);
    const dv = [(PG.FL[0] - PG.BL[0]) / PG.N / 2 * co, (PG.FL[1] - PG.BL[1]) / PG.N / 2 * co];
    let bl = '', sh = '';
    for (let i = 0; i < PG.N; i++) {
      const k = (i + .5) / PG.N, L = lerp(PG.BL, PG.FL, k), R = lerp(PG.BR, PG.FR, k);
      const q = [[L[0] - dv[0], L[1] - dv[1] + up], [R[0] - dv[0], R[1] - dv[1] + up], [R[0] + dv[0], R[1] + dv[1] - up], [L[0] + dv[0], L[1] + dv[1] - up]];
      // face qui fonce en pivotant, arête claire
      bl += `<polygon points="${pts(q)}" fill="var(--sc)" stroke="#8d969f" stroke-width=".5"/><polygon points="${pts(q)}" fill="#000" opacity="${(.3 * (1 - co)).toFixed(2)}"/>`;
      if (a > 8) bl += `<line x1="${q[3][0].toFixed(1)}" y1="${q[3][1].toFixed(1)}" x2="${q[2][0].toFixed(1)}" y2="${q[2][1].toFixed(1)}" stroke="#fff" stroke-width="1" opacity=".9"/>`;
      const f = (p) => [p[0] + PG.SX, p[1] + PG.H];
      sh += `<polygon points="${pts([f([L[0] - dv[0], L[1] - dv[1]]), f([R[0] - dv[0], R[1] - dv[1]]), f([R[0] + dv[0], R[1] + dv[1]]), f([L[0] + dv[0], L[1] + dv[1]])])}"/>`;
    }
    return [bl, sh];
  };
  // décor : maison contemporaine à toit plat (bardage bois, baie vitrée), terrasse en pierre, piscine au premier plan
  const PERGOLA = () => {
    const { BL, BR, FL, FR, H } = PG, gy = BL[1] + H, floor = [[BL[0], gy], [BR[0], gy], [FR[0], FR[1] + H], [FL[0], FL[1] + H]];
    const post = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${H}" fill="url(#pgalu)"/>`;
    const rays = [.18, .38, .58, .78].map((k) => { const P = lerp(lerp(BL, FL, k), lerp(BR, FR, k), .35); return `<path class="pg-ray" d="M${P[0].toFixed(1)} ${P[1].toFixed(1)}l${PG.SX} ${H}h12l${-PG.SX} ${-H}z"/>`; }).join('');
    const drops = [...Array(30)].map((_, k) => { const x = (k * 37.3) % 250, y = (k * 23) % 40; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    // bardage : lames verticales de teintes légèrement différentes
    const clad = [...Array(60)].map((_, k) => `<rect x="${k * 4}" y="22" width="4" height="${gy - 22}" fill="${['#b9834f', '#ad7845', '#c08b57', '#a87344'][(k * 7) % 4]}"/>`).join('')
      + [...Array(60)].map((_, k) => `<path d="M${k * 4} 22V${gy}" stroke="#7d522c" stroke-width=".35"/>`).join('');
    // claustra bois sur le côté gauche, entre les deux poteaux
    const screen = [...Array(9)].map((_, k) => {
      const y = 76 + k * 6.4, t = (y - FL[1]) / H;
      return `<polygon points="${pts([[FL[0] + 3, FL[1] + t * H], [BL[0] - 3, BL[1] + t * H], [BL[0] - 3, BL[1] + t * H + 4], [FL[0] + 3, FL[1] + t * H + 4]])}" fill="${k % 2 ? '#a5703f' : '#b27b48'}"/>`;
    }).join('');
    const lantern = (x, y) => `<g><rect x="${x - 3}" y="${y - 8}" width="6" height="8" rx="1.5" fill="none" stroke="#3a3027" stroke-width=".8"/>
      <path d="M${x - 3} ${y - 5}h6M${x - 3} ${y - 2.5}h6M${x} ${y - 8}v8" stroke="#3a3027" stroke-width=".5"/><circle class="pg-glow" cx="${x}" cy="${y - 4}" r="4.5" fill="#ffcf6a"/></g>`;
    return `<defs>
      <linearGradient id="pgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6db7ef"/><stop offset="1" stop-color="#d6ecfb"/></linearGradient>
      <linearGradient id="pgglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5466"/><stop offset=".5" stop-color="#6f8ba0"/><stop offset="1" stop-color="#2f4252"/></linearGradient>
      <linearGradient id="pgwarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset="1" stop-color="#e8954a"/></linearGradient>
      <linearGradient id="pgstone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ddd7cc"/><stop offset="1" stop-color="#c9c2b5"/></linearGradient>
      <linearGradient id="pgwater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc3e6"/><stop offset="1" stop-color="#1f8fc4"/></linearGradient>
      <linearGradient id="pgalu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d434b"/><stop offset=".5" stop-color="#5b626b"/><stop offset="1" stop-color="#2e3339"/></linearGradient>
      <radialGradient id="pgpool" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffd27a" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <clipPath id="pgfloor"><polygon points="${pts(floor)}"/></clipPath></defs>
      <g class="day"><rect width="240" height="180" fill="url(#pgsky)"/><g class="pg-sun"><circle cx="30" cy="9" r="11" fill="#ffe17a" opacity=".3"/><circle cx="30" cy="9" r="6.5" fill="#ffe17a"/></g></g>
      <g class="night"><rect width="240" height="180" fill="url(#shskyn)"/><circle cx="212" cy="8" r="4.5" fill="#f4f1d0"/><circle cx="214" cy="6.6" r="3.8" fill="#0b1430"/>
        ${[[50, 8], [80, 4], [130, 9], [165, 3], [110, 5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#fff"/>`).join('')}</g>
      <g class="pg-cloud"><rect width="240" height="20" fill="#8d99a8"/><ellipse cx="70" cy="6" rx="40" ry="8" fill="#7d8896"/><ellipse cx="170" cy="5" rx="48" ry="8" fill="#86919f"/></g>
      <!-- maison : bardage bois, acrotère du toit plat, baie vitrée, appliques -->
      ${clad}
      <rect x="-2" y="16" width="244" height="7" fill="#3a3f46"/><rect x="-2" y="16" width="244" height="1.4" fill="#5b626b"/>
      <rect x="0" y="23" width="240" height="3" fill="#000" opacity=".15"/>
      <rect x="96" y="52" width="76" height="${gy - 52}" fill="#24292f"/>
      <rect x="99" y="55" width="34" height="${gy - 55}" fill="url(#pgglass)"/><rect x="135" y="55" width="34" height="${gy - 55}" fill="url(#pgglass)"/>
      <path d="M99 ${gy - 6}l14 -${gy - 61}h8l-14 ${gy - 61}zM135 ${gy - 10}l12 -${gy - 65}h5l-12 ${gy - 65}z" fill="#fff" opacity=".12"/>
      <rect x="88" y="62" width="2.6" height="5" rx=".8" fill="#2b2f35"/><rect x="178" y="62" width="2.6" height="5" rx=".8" fill="#2b2f35"/>
      <!-- terrasse en pierre, pelouse, piscine -->
      <rect x="0" y="${gy}" width="240" height="${180 - gy}" fill="#6fae58"/>
      <polygon points="${pts([[0, gy], [240, gy], [240, 164], [0, 164]])}" fill="url(#pgstone)"/>
      ${[0, 1, 2, 3].map((k) => `<path d="M0 ${gy + 11 + k * 11}H240" stroke="#b9b1a3" stroke-width=".5"/>`).join('')}
      <g clip-path="url(#pgfloor)"><g class="pg-shadow" fill="#000"></g></g>
      ${post(BL[0], BL[1], 6)}${post(BR[0], BR[1], 6)}
      <!-- tapis, canapé d'angle, fauteuil en rotin, table basse, plante -->
      <path d="M56 142l12-12h96l12 12z" fill="#cfc4b2"/>
      <rect x="66" y="110" width="88" height="15" rx="3" fill="#c49a62"/><rect x="66" y="110" width="88" height="15" rx="3" fill="#000" opacity=".08"/>
      ${[0, 1, 2, 3].map((k) => `<rect x="${69 + k * 21}" y="111" width="20" height="12" rx="3" fill="${k % 2 ? '#dcd9d3' : '#e6e3dd'}"/>`).join('')}
      <rect x="64" y="122" width="92" height="9" rx="2.5" fill="#c49a62"/><rect x="67" y="120.5" width="86" height="6" rx="2.5" fill="#efece6"/>
      <path d="M48 128l12-8h8v12l-14 7z" fill="#c49a62"/><path d="M51 127l10-6.5h6v7l-12 6z" fill="#efece6"/>
      <path d="M72 119q0-6 6-6q5 1 4 6z" fill="#9a8f80"/><path d="M134 119q0-6 6-6q6 1 4 6z" fill="#7d8a7a"/><path d="M142 120q0-5 5-5q5 1 3 5z" fill="#d6cdbd"/>
      <g transform="translate(166 116)"><path d="M0 4h18l-2 12h-14z" fill="#a98454"/>
        ${[0, 1, 2, 3, 4].map((k) => `<path d="M${1 + k * 3.6} 5l1 10" stroke="#8a683f" stroke-width=".5"/>`).join('')}
        <rect x="2" y="-2" width="14" height="8" rx="2.5" fill="#efece6"/><rect x="3" y="15" width="1.6" height="4" fill="#3a3027"/><rect x="13.4" y="15" width="1.6" height="4" fill="#3a3027"/></g>
      <ellipse cx="110" cy="146" rx="18" ry="2.2" fill="#000" opacity=".15"/>
      <ellipse cx="110" cy="135.5" rx="17" ry="3.4" fill="#2f3237"/><rect x="108.8" y="137" width="2.4" height="8" fill="#2f3237"/>
      <path d="M104 135l1-4h5l1 4z" fill="#d9d4ca"/><path d="M107.5 131q-4-5-1-9q3 3 1 9zM107.5 131q3-6 7-7q-1 5-7 7z" fill="#5c8f52"/>
      <rect x="114" y="132" width="3" height="3" rx=".5" fill="#f3efe6"/>
      <g transform="translate(205 102)"><path d="M-6 10h12l-1.5 14h-9z" fill="#5b5f66"/><circle cx="0" cy="2" r="9" fill="#5f8a55"/><circle cx="-4" cy="-3" r="5" fill="#6f9c63"/><circle cx="5" cy="-2" r="5" fill="#557d4c"/></g>
      ${lantern(36, 152)}${lantern(196, 150)}
      <rect class="pg-dim" x="0" y="0" width="240" height="180" fill="#0a1020"/>
      <!-- nuit : intérieur éclairé, appliques, halos -->
      <g class="night"><rect x="99" y="55" width="34" height="${gy - 55}" fill="url(#pgwarm)" opacity=".85"/><rect x="135" y="55" width="34" height="${gy - 55}" fill="url(#pgwarm)" opacity=".85"/>
        <circle cx="89.3" cy="64" r="5" fill="#ffcf6a" opacity=".45"/><circle cx="179.3" cy="64" r="5" fill="#ffcf6a" opacity=".45"/></g>
      <g clip-path="url(#pgfloor)"><ellipse class="pg-pool" cx="112" cy="135" rx="90" ry="28" fill="url(#pgpool)"/></g>
      <g class="pg-candle"><circle cx="115.5" cy="131" r="6" fill="#ffcf6a" opacity=".22"/><circle cx="115.5" cy="131" r="1.2" fill="#ffcf6a"/></g>
      <g fill="#fff6c8" fill-opacity=".3">${rays}</g>
      ${screen}
      <g class="pg-roof"><polygon class="pg-gap" points="${pts([BL, BR, FR, FL])}"/><g class="pg-blades"></g></g>
      <polyline points="${pts([FL, BL, BR])}" fill="none" stroke="#2b3036" stroke-width="3"/>
      <polyline points="${pts([BR, FR])}" fill="none" stroke="#3a4048" stroke-width="3.4"/>
      <rect x="${FL[0] - 2}" y="${FL[1] - 4}" width="${FR[0] - FL[0] + 4}" height="8" fill="url(#pgalu)"/>
      <rect class="pg-strip" x="${FL[0] + 2}" y="${FL[1] + 4}" width="${FR[0] - FL[0] - 4}" height="1.6" fill="#ffd27a"/>
      ${post(FL[0], FL[1], 7)}${post(FR[0], FR[1], 7)}
      <g class="pg-drain"><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.4" fill="#9fd0ff"/><circle cx="${FR[0]}" cy="${FR[1] + 4}" r="1.2" fill="#9fd0ff"/></g>
      <!-- piscine au premier plan : margelle, eau, reflets -->
      <rect x="-2" y="162" width="176" height="20" fill="#e9e5dd"/>
      <rect x="4" y="166" width="164" height="16" fill="url(#pgwater)"/>
      <g class="pg-water" stroke="#bff0ff" stroke-width=".8" fill="none" opacity=".8">
        <path d="M10 170q6-2 12 0t12 0"/><path d="M60 173q6-2 12 0t12 0"/><path d="M118 169q6-2 12 0t12 0"/><path d="M30 177q6-2 12 0t12 0"/><path d="M95 178q6-2 12 0t12 0"/></g>
      <rect class="pg-dim" x="4" y="166" width="164" height="16" fill="#0a1020"/>
      <g class="night"><ellipse cx="86" cy="174" rx="60" ry="6" fill="#5fe1ff" opacity=".35"/></g>
      <g class="pg-drops" stroke="#dfeeff" stroke-width="1" opacity=".8">${drops}</g>
      <circle class="led" cx="${FL[0] + 8}" cy="${FL[1]}" r="1.8"/>${ARROW(FR[0] + 16, FR[1] - 14)}`;
  };

  /* ---- store banne : repère 240 × 180, vue de face (maison, terrasse en bois, pelouse) ; la toile, les bras et l'ombre sont
     redessinés image par image (awDyn) selon le déploiement (0-100) et l'inclinaison (0-100) ---- */
  const AW = { BL: [22, 38], BR: [218, 38], GY: 118 };
  const awDyn = (p, t) => {
    const e = Math.max(0, Math.min(1, p / 100)), tt = isNaN(t) ? 45 : t, { BL, BR, GY } = AW;
    const drop = e * (34 + tt * .28), grow = e * 14;
    const FL = [BL[0] - grow, BL[1] + 2 + drop], FR = [BR[0] + grow, BR[1] + 2 + drop], N = 10;
    let fab = '';
    if (e > .02) {
      for (let i = 0; i < N; i++) {
        const q = [lerp(BL, BR, i / N), lerp(BL, BR, (i + 1) / N), lerp(FL, FR, (i + 1) / N), lerp(FL, FR, i / N)];
        fab += `<polygon points="${pts(q)}" fill="var(--sc)"/>${i % 2 ? `<polygon points="${pts(q)}" fill="#fff" opacity=".14"/>` : ''}<polygon points="${pts(q)}" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".4"/>`;
      }
      fab += `<polygon points="${pts([BL, BR, FR, FL])}" fill="url(#ID-awfab)"/>`;
      // lambrequin festonné sous la barre de charge
      const y0 = FL[1] + 5, n = 16, w = FR[0] - FL[0];
      let d = `M${FL[0].toFixed(1)} ${y0.toFixed(1)}H${FR[0].toFixed(1)}`;
      for (let i = n - 1; i >= 0; i--) d += `Q${(FL[0] + w * (i + .5) / n).toFixed(1)} ${(y0 + 9).toFixed(1)} ${(FL[0] + w * i / n).toFixed(1)} ${y0.toFixed(1)}`;
      fab += `<path d="${d}Z" fill="var(--sc)"/><path d="${d}Z" fill="#000" opacity=".1"/>`;
    }
    fab += `<path d="M${FL[0].toFixed(1)} ${FL[1].toFixed(1)}H${FR[0].toFixed(1)}V${(FR[1] + 5).toFixed(1)}H${FL[0].toFixed(1)}Z" fill="#3b4047"/>
      <path d="M${FL[0].toFixed(1)} ${(FL[1] + .6).toFixed(1)}H${FR[0].toFixed(1)}" stroke="#9aa2aa" stroke-width="1"/>
      <circle cx="${FL[0].toFixed(1)}" cy="${(FL[1] + 2.5).toFixed(1)}" r="3" fill="#2c3136"/><circle cx="${FR[0].toFixed(1)}" cy="${(FR[1] + 2.5).toFixed(1)}" r="3" fill="#2c3136"/>`;
    // bras articulés : coude qui descend un peu quand le store est replié
    const arm = (A, F, side) => {
      const M = lerp(A, F, .5), E = [M[0] + side * 3 * (1 - e), M[1] + 7 + 9 * (1 - e)], P = pts([A, E, F]);
      return `<polyline points="${P}" fill="none" stroke="#2c3136" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
        <polyline points="${P}" fill="none" stroke="#8a929a" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${E[0].toFixed(1)}" cy="${E[1].toFixed(1)}" r="1.9" fill="#1e2226"/>`;
    };
    const arms = arm([BL[0] + 9, BL[1] + 3], [FL[0] + 8, FL[1] + 3], 1) + arm([BR[0] - 9, BR[1] + 3], [FR[0] - 8, FR[1] + 3], -1);
    const sy = GY + e * 46, sh = `<polygon points="${pts([[BL[0] - 6, GY], [BR[0] + 6, GY], [BR[0] + 6 + grow + 8, sy], [BL[0] - 6 - grow - 8, sy]])}"/>`;
    const led = e > .05 ? `<line x1="${(FL[0] + 7).toFixed(1)}" y1="${(FL[1] + 5.6).toFixed(1)}" x2="${(FR[0] - 7).toFixed(1)}" y2="${(FR[1] + 5.6).toFixed(1)}" stroke="#ffe08a" stroke-width="1.6" stroke-dasharray="3 2.2" class="aw-strip"/>
      <ellipse class="aw-pool" cx="120" cy="${(GY + e * 30 + 12).toFixed(1)}" rx="${(34 + e * 52).toFixed(1)}" ry="${(7 + e * 4).toFixed(1)}" fill="url(#ID-awpool)"/>` : '';
    return [`<g class="aw-flap">${fab}</g>${arms}`, sh, led];
  };
  const AWNING = () => {
    const { BL, BR, GY } = AW;
    const chair = (x, y, f) => `<g transform="translate(${x} ${y}) scale(${f} 1)"><rect x="-1" y="-11" width="3" height="11" rx="1" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="-1" y="-11" width="12" height="3" rx="1.2" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="-1" y="-3" width="12" height="3.2" rx="1.2" fill="#efece6" stroke="#cfc8b8" stroke-width=".4"/><rect x="0" y="0" width="1.6" height="7" fill="#b7ae9e"/><rect x="8" y="0" width="1.6" height="7" fill="#b7ae9e"/></g>`;
    const planks = [0, 1, 2, 3, 4].map((k) => `<path d="M0 ${GY + 6 + k * (6 + k * 1.4)}H240" stroke="#8a6338" stroke-width=".6" opacity=".7"/>`).join('')
      + [...Array(16)].map((_, k) => `<path d="M${(k * 31 + (k % 3) * 9) % 240} ${GY + 6 + (k % 4) * 8}v${5 + (k % 3)}" stroke="#8a6338" stroke-width=".5" opacity=".6"/>`).join('');
    const lantern = (x, y) => `<g><rect x="${x - 2.6}" y="${y - 7}" width="5.2" height="7" rx="1.4" fill="none" stroke="#2a2f35" stroke-width=".8"/><path d="M${x - 2.6} ${y - 3.5}h5.2M${x} ${y - 7}v7" stroke="#2a2f35" stroke-width=".5"/><circle class="pg-glow" cx="${x}" cy="${y - 3.5}" r="5" fill="#ffcf6a"/></g>`;
    const drops = [...Array(32)].map((_, k) => { const x = (k * 37.3) % 250, y = (k * 23) % 40; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    return `<defs>
      <linearGradient id="ID-awglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3e5466"/><stop offset=".5" stop-color="#6f8ba0"/><stop offset="1" stop-color="#2f4252"/></linearGradient>
      <linearGradient id="ID-awwarm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd08a"/><stop offset="1" stop-color="#e8954a"/></linearGradient>
      <linearGradient id="ID-awfab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".45" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
      <radialGradient id="ID-awpool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
      <clipPath id="ID-awg"><rect x="0" y="${GY}" width="240" height="${180 - GY}"/></clipPath></defs>
      <g class="day"><rect width="240" height="${GY}" fill="url(#shskyd)"/><g class="pg-sun"><circle cx="34" cy="7" r="13" fill="#ffe17a" opacity=".3"/><circle cx="34" cy="7" r="7" fill="#ffe17a"/></g></g>
      <g class="night"><rect width="240" height="${GY}" fill="url(#shskyn)"/><circle cx="206" cy="6" r="4.5" fill="#f4f1d0"/><circle cx="208" cy="4.6" r="3.8" fill="#0b1430"/>${[[50, 5], [90, 3], [140, 6], [170, 3]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="#fff"/>`).join('')}</g>
      <g class="pg-cloud"><rect width="240" height="14" fill="#8d99a8"/><ellipse cx="60" cy="5" rx="38" ry="8" fill="#7d8896"/><ellipse cx="170" cy="4" rx="46" ry="8" fill="#86919f"/></g>
      <!-- maison : enduit clair, toit plat, baie vitrée coulissante, fenêtres, appliques -->
      <rect x="0" y="16" width="240" height="${GY - 16}" fill="#e9e3d6"/><rect x="0" y="${GY - 6}" width="240" height="6" fill="#cfc7b6"/>
      <rect x="-2" y="10" width="244" height="8" fill="#3a3f46"/><rect x="-2" y="10" width="244" height="1.5" fill="#5b626b"/>
      <rect x="88" y="50" width="92" height="${GY - 56}" fill="#2b3036"/>
      <rect x="91" y="53" width="41" height="${GY - 62}" fill="url(#ID-awglass)"/><rect x="136" y="53" width="41" height="${GY - 62}" fill="url(#ID-awglass)"/>
      <path d="M95 ${GY - 12}l16 -${GY - 70}h9l-16 ${GY - 70}zM140 ${GY - 12}l14 -${GY - 70}h6l-14 ${GY - 70}z" fill="#fff" opacity=".13"/>
      <rect x="14" y="60" width="46" height="40" fill="#f6f3ec" stroke="#cfc7b6" stroke-width=".8"/><rect x="17" y="63" width="40" height="34" fill="url(#ID-awglass)"/><path d="M37 63v34M17 80h40" stroke="#f6f3ec" stroke-width="1.6"/>
      <rect x="196" y="60" width="30" height="40" fill="#f6f3ec" stroke="#cfc7b6" stroke-width=".8"/><rect x="199" y="63" width="24" height="34" fill="url(#ID-awglass)"/><path d="M211 63v34" stroke="#f6f3ec" stroke-width="1.6"/>
      <g class="night"><rect x="91" y="53" width="41" height="${GY - 62}" fill="url(#ID-awwarm)" opacity=".85"/><rect x="136" y="53" width="41" height="${GY - 62}" fill="url(#ID-awwarm)" opacity=".85"/>
        <rect x="17" y="63" width="40" height="34" fill="url(#ID-awwarm)" opacity=".8"/><rect x="199" y="63" width="24" height="34" fill="url(#ID-awwarm)" opacity=".8"/></g>
      ${lantern(76, 84)}${lantern(192, 84)}
      <!-- terrasse en bois, pelouse, salon de jardin -->
      <rect x="0" y="${GY}" width="240" height="${180 - GY}" fill="#6fae58"/>
      <path d="M0 ${GY + 38}H240V180H0Z" fill="#5ea552" opacity=".55"/>
      <polygon points="0,${GY} 240,${GY} 240,${GY + 40} 0,${GY + 40}" fill="#b88a5c"/>${planks}
      <rect x="0" y="${GY + 40}" width="240" height="3" fill="#8f6a40"/>
      <g transform="translate(0 6)"><ellipse cx="120" cy="${GY + 28}" rx="30" ry="3.5" fill="#000" opacity=".16"/>
        ${chair(84, GY + 22, 1)}${chair(156, GY + 22, -1)}${chair(103, GY + 29, 1)}${chair(137, GY + 29, -1)}
        <rect x="118.4" y="${GY + 9}" width="3.2" height="17" fill="#cfc8b8"/><ellipse cx="120" cy="${GY + 26.5}" rx="9" ry="1.8" fill="#cfc8b8"/>
        <ellipse cx="120" cy="${GY + 9}" rx="24" ry="5.4" fill="#efece6" stroke="#cfc8b8" stroke-width=".6"/></g>
      <g transform="translate(212 ${GY - 12})"><path d="M-5 8h10l-1.4 12h-7.2z" fill="#5b5f66"/><circle cx="0" cy="2" r="8" fill="#5f8a55"/><circle cx="-3.5" cy="-2" r="4.5" fill="#6f9c63"/><circle cx="4.5" cy="-1.5" r="4.5" fill="#557d4c"/></g>
      <g clip-path="url(#ID-awg)"><g class="aw-shadow" fill="#000"></g></g>
      <rect class="pg-dim" x="0" y="0" width="240" height="180" fill="#0a1020"/>
      <g class="night"><circle cx="76" cy="80.5" r="6" fill="#ffcf6a" opacity=".45"/><circle cx="192" cy="80.5" r="6" fill="#ffcf6a" opacity=".45"/></g>
      <!-- caisson du store, toile et bras (redessinés par awDyn) -->
      <g class="aw-wind" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".0"><path d="M2 54q14 -5 30 0t26 -2"/><path d="M0 70q12 -4 24 0t22 -2"/><path d="M4 86q10 -3 20 0t18 -1"/></g>
      <g class="aw-dyn"></g>
      <rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="13" rx="3.2" fill="#3b4047"/><rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="13" rx="3.2" fill="url(#shrelief)"/>
      <rect x="${BL[0] - 6}" y="26" width="${BR[0] - BL[0] + 12}" height="2" rx="1" fill="#fff" opacity=".28"/>
      <rect x="${BL[0] - 9}" y="24" width="5" height="17" rx="1.6" fill="#2c3136"/><rect x="${BR[0] + 4}" y="24" width="5" height="17" rx="1.6" fill="#2c3136"/>
      <g class="aw-leds"></g>
      <g class="pg-drops" stroke="#dfeeff" stroke-width="1" opacity=".8">${drops}</g>
      <circle class="led" cx="${BR[0] + 10}" cy="32" r="1.9"/>${ARROW(BR[0] + 6, 58)}`;
  };

  /* ---- store double sur pied, d'après une photo : la photo (étiquettes retirées) sert de fond ; la toile (deux pans), les barres de charge et les bras
     sont redessinés image par image selon le déploiement (0-100) : la toile est découpée jusqu'à la barre, qui glisse avec ses bras articulés ---- */
  const PH = {"img":{"plate":"data:image/webp;base64,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","canvas":"data:image/webp;base64,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","fg":"data:image/webp;base64,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","bars":"data:image/webp;base64,UklGRvwiAABXRUJQVlA4WAoAAAAQAAAAtQIANQIAQUxQSAUEAAABJyAQSOFmFxERA8Xatts2Fh7gArhkFECCLMABBZji678nZQRycCb8j4j+S3AkSZEkH4g8H6jjjoHuBxiyp+4/3X+6//zvCHo7Oaicb0SorHfhmfJzhwpSPhRsjEo2HliQsqlyXeH8QGT6wMcgSxSmD8S6wnCF6wpKNvRpkCUiBesKSjaUbOiLELCoJ4sKWTxZ1JIl0gTrCko2NCXIokIWzxGysZGNc1o4skSMJAZZIln0nSwqZPEMSQ+yeLKoI0skSE6QJZJFPVlUyOLxATbWTBaAnxxhXWG8wnWFNTfIqihklUerhJ4iGyPaWHNXIKscPYU21swgq6KQVR6tEnwqM8gqS1ZFQ1Y5fAptrHmBVglZ5dEq4afIxoD2IZ95K/BTZGPIC7LqHa0SssqjVUJWLYascmRVNAAV2RiygqzyaJWQVR6tErJqMWSVI6uiIascWRUFoWJ+REKCCm18ZARZFQ1Z5RCqjCCrHFolZJVHqwShygiyypJV0ZBVjqFKD7LKoVVCVnm0Shiq9CCrHERFdoWhfnzMQkvFsn8nZgtLvRf+itViqagtdYXShyeJJ1LKl/9px8DksDi1Q5+cglBSS52NxCw8VOUVfl79TbCIVKx2CLPlREi5ekeHiyc+KlZ9IRnwKF/ugYmDwFFSAyQ15SMxasCkpqyJUYqs4cRFLRUOsQWlpnzUW+Gs2acARcXS5GxJkShXiCKDBaKilIZLTVkrrfDzlOwtKQ4l+4DA+/QfdWLctOgpsFAlbp4KD7M0W9VaYTwXHiwH5cwOh8VSUEuxf2lft4FNTdlqfodnCIWH0F5GTTiZkqfCgwZpvxJTdmBTU7bq+wdOG5gt6Zj5Fepd1pRTy9WbMTUGLDVly9ypYp8dUEOr1VLtJSWUmrLm/WDHHXCWBqtX3YFfTRlf7ht4pOHUQpWxj9UBakpoqfK7+McHo6aMOfc8RAecpZFqN5u0IZQebBOV2dEpKIaaMu5yT+Fpo/DCe93nsQMmCjVlS7zn0TqghpYpu8tfD4Kasqbd85gd0DZJvX67jWRNGfd9BJygja8p684PgDNtbd+SJmy6DtMB27wb3OE74Exr+KLwwvs4HbDBu8H9QmoKrqF8TWF1mja0NWWCW1POvxc1Be0QA9oOqLiGDe2WdCo+WLQdcLFoO6A1YGvKW0M54Fep/B1QO+DyANMO+AygHVCeQqumlHkg18GgOw1fZUHZARfD7xRKAbOmvF2AOJSAZU2xmcD7KpW8hF4HzHwukh0wGp6nkPxcLGuKvwB1SHsukh3QXeA6iCF76v7T/af7T/ef7j/df7r/dP/p/tP9p/tP95/uP91/uv90/+n+0/2n+0/3n+4/3X+6/3T/6f7T/ef/ODEAVlA4INAeAADw+gCdASq2AjYCPm00lUekIySjobNtYJANiWNu8YA+I2UMpI2h8k/qr/VZ8U/t5Pcd+mf2X8KP2A/y+BY7H/mC/UQhHT3+SW4m+I/Mvp8OzdUiZd2VmbP/ceq78/f873C/1I9QPpx8yv7NfuP72nnkeoB/a+p39F3wt/h//tVgt/jP7l+0XZhevpr5LPjF/pvGXgHfjX84/2XAc7F5iPtb9j/6n9s9eibv9ZMSBqfkn+tvYU/X7rY+ir+2B0stWGnP4QxVqGazLfsEMcq1DNZlv2CGOVahmsy37BDGnVGsAxwS+NRgFoim8ajALRFN41GAWiKbxqMAtEU3jUYBaIpvE2nxj+9poLplpe7zgXTLS93nAumWl7vOBdMpRkul0y0vd5wLplpY1ZpZV/Z0sm+saOTfWNHJvrGjk31jRyb6xo5N9Y0UKu2ehAZXC6/NsQuQ1FcAzGvoY97X0Mez64/hDFWoZrMt+wQxyrUM1mW/YIY5VqGUm+iNfgOQrOQi13b6mJIBahmsy37Bb5aaNedhn3tbXTyn8W47r58+XgD3FTHQxlr+vEYrbsdutVEvnGE/GGgliaU+0JT4ST/yXXarUM+XgD3FTHQxlr+xxqZT+Lcd18+fLwB7fmFnfUvE4KDgjDLi3nq2xOV5IDYYZ2K4ZKeukX/6udiXFXOxLirnYlxVzsS4q52JcVc7EuKudiXFXOjTSPJV9CJVjZEzHK9WNfDkxVghJ5VALvzDLfsDsIu24F0y0vd5wLplpe7zgXTLS93nAumWl7vOBbpiEuTfM+CuaBhhpqHfEgIBSBCockIO/LlTjzahTCRXPLwrepl4VvUy8K3qZeFb1MvCt6mXhW9TLwrepl4VvUy2SaEnayxvTuLOIRozc4Jo9QboBGGq6j46l+PZ8/gYD1WV75qUumuPCg2qryKQa/C0uep+xwS+NRgFoim8ajALRFN41GAWiKbxjFnYcQvMMlQZIgyXGs79/IE4ITU0b69O/ICSFhezml5aYaQ1m4/53EgNXF621JJ99qOLIkh9JyN1wacEvjUYBaIpvGowC0RTeNRgFoim8ai/h4/Y3v3kkdOZabIKU7yKwtuetdbxI5TIi+P/WJialRXq3cGHEQToPCiiEyP4CUbNSvqt8CwNPqHmMZdWF9UFFbTB6ZaXu84F0y0vd5wLplpe7uJarxSMI8mknOEmAlkJXg0rsAtDcR+KWh2Bt8VmDN4JNqmyQp3H/pjES38S9nOy7VoMaxJg5KO0qjG5yKbxqMAtEU3jUYBaIpvGowC0NaC0dQnviuNRgFoiioYy1Jc6FljPC989SOlF3gpIyUIAdqDCvrgM8wNpzlA++NW9c6fWF8ajALRFN41GAWiKbxqMAs5zoPKPVrRs9MtL3ecC6ZaXu838elR89s/71vpxIYOBQIFvQXTLS93nAumWl7vOBdMtL3c8RBs7aXlCwWX9nSyb6xo5N9Y0cm+saOTfNRqgFoim8ajALRFN41GAWiKbxqLjNh/q88V5/txo5N9Y0cm+saOTfWNHJvrGjk31jRyb6xo5N9Y0cm+saOTfWNHJvrDHiCaCCI8ijHCisAxwS+NRgFoim8ajALRFN41GAWiKbxqMAtEU3jUYBaIcXYwaLnnYPEZ+xwS+NRgFoim8ajALRFN41GAWiKbxqMAtEU3jUYBaIpvGl2L/1j5QKXxqMAtEU3jUYBaIpvGowC0RTeNRgFoim8ajALRFN41GAWc5eZB2O9Y9cAzczjUYBaIpvGowC0RTeNRgFoim8ajALRFN41GAWiKbxqMAbJ/BqeOd03+44UVgGOCXxqMAtEU3jUYBaIpvGowC0RTeNRgFoim8ajALRDiO7McJefp5eFb1MvCt6mXhW9TLwrepl4VvUy8K3qZeFb1MvCt6mXhW9TLwreomasyL2HGN7/i84F0y0vd5wLplpe7zgXTLS93nAumWl7vOBdMtL3ecC6ZOI4Hu6qMbypxqMAtEU3jUYBaIpvGowC0RTeNRgFoim8ajALRFN41GAWiIwz+1Zhf8ajALRFN41GAWiKbxqMAtEU3jUYBaIpvGowC0RTeNRgFohzYv3ldNX+xwS+NRgFoim8ajALRFN41GAWiKbxqMAtEU3jUYBaIpvGl2U2WgKoLNsUJwLplpe7zgXTLS93nAumWl7vOBdMtL3ecC6ZaXu84F0lXPg6WTfWNHJvrGjk31jRyb6xo5N9Y0cm+saOTfWNHJvrGjk31jRyb6xSGR7PU/Y4JfGowC0RTeNRgFoim8ajALRFN41GAWiKbxqMAtETjL7Gjk31jRyb6xo5N9Y0cm+saOTfWNHJvrGjk31jRyb6xo5N9Y0cm+sM3fUj0/N41GAWiKbxqMAtEU3jUYBaIpvGowC0RTeNRgFoim8ajALRDv5v6GRKz3tNBdMtL3ecC6ZaXu84F0y0vd5wLplpe7zgXTLS93nAumTfZWLQSsKxworAMcEvjUYBaIpvGowC0RTeNRgFoim8ajALRFN41GAWiHxMhjsEMmqULEaCvF9dlETa2zIX9TPOZDH6/hSRKyvg99b7xVIKk/JSSeDBwS6mb6bQMErNR3o4SIBbJk8FGzlUp6rdRbabslbw3W1es693NXUu0mKoI1Ok9Tfr1o3M5B8yF1c5jf3X/0b0O1em3qY3cII2dVoKTggvjxd9pKRieG5nXTnVAA/vVF5+wE8xtApAexI9wN6LfNw5BtDKeExvtHH6DaGU8JjfaOP0G0Mp4TG+0cfoNoZTwmN9o4/QbQynhMb7Rx+g2hlPCY32jj9BtDKeExvwfnxv4HiEuubaYJ5dm5pGRyfHp1tJ83dEJMBgAAAAAABDz/Yi4CovuY0d3W64BSTa8ZLDoHkR/ENLQAAAAD2zN5l7xvPcSoHq6tlJUzTjKvY/DawHK/+ymxUN7NABtlMmqy/H6pbl6kQ3hp0vfxS8oKsHfO+d8753zvnfO+d8753zvnfO+d8753zvnfO+d8753zvnfPj/yfqmf0X6m2/fBVN4n6dU3s8htlYJD/sHJ+w8eSnN7ZgzH5vwKcEBraskyVD8EKiY4jgiYIoWF5fR0kIGzOC0h0665S3SMsRHW+tCEB1Tn9FwGXTfKvMRPZOpWpXOUSaDMbjk/rcNAI4Y2v1+aDDqjL0Av4iOTWI2Gn7yVFyXqiHegvIZ3iHTjwNlPEoVH/2d4h048DZTxKFR/9neIdOPA2U8ShUf/dgeWILf8c67GL89xlMiTpOQ02RCgNsfL1tJxm3hgnBBfMl3xH/v26jlPQvxoSzAmgpscOwyWVk4dMaqIXxJ0GA7EU5ZOmqCj2XTqqnMYlIFKWBOTcmsS+ZX27rmaD+I/rvTLALC6rTTvWOObD6ZO9y/IukWnMhGQrI0UDmurU6ZN79i1xUrjTZGDKurul47qPeMfbpL01RiYZMHt4Ag0e8Y+3SXpqjEwygrpbg7CQwkLnnIpYr0M5fZ2ChBPke9GBYbUeXqYzpA5Ir6e4ON7CV1T/oun/YvFVcy28qiQOdDljgOCJX6ONT3IXo5W6aXRutGCRUHB9BgnCaUuRIL+ndpaROn5fXd9xssqHFElh4AwWoBkfl+cxA+Zw0ih31B9txlscp4KWemEPu2/+/uM6nBmyEwtoR7Hura6NH/ejGJfRb2sS8hz1Y6fcZ1ODNkJhbQj2PdWvmjaVPjyGd1DqjwITOH4nxrHhvj93lFbu7aCYX3nWPeB9/bW90fkT4FHpmF+wEtjJyIgJixaX+RvZS35Kms5Hjax9QyMVFSEKE4mQyQG0HycLUvQOwxq86GxaqLOoV0mfyWsp/sjOMMsY0xPKjr4sCswyqtdvTJsE6SR18WFADYgU8stHfOPfNDVmFk5O8LS9h6rR4b0TgXLw4nCpDKexE+uzMkQW6cs4VV4cThUhlPYifXZmSILdOWcKq8OJwqRBbYUG1qxV32x94YwxYWYV1OjT3+EqDRisqWC/jSgk2ccbK4XeMfC4mWqerm9dmhozh85JLsnNu/WapBmAEmh2+WHzDKnt62YVYDibTppnWv3fONIwp0Q+3yvUDm+LqURYIh4pYvKDoNI4CImUCw4nGL0InVSBpI8cV47u1Kfjnr3MoQjcUnryVUD7PCF4oHDqQC4buDnoaH6EMlNtozODQk7yE+cFLj5jY0AAAAAAAAAAArZa3oURHG7RCLkGM8GPTwH+mUbyPDRH1xJ/gUMN8C82yf9VJSX838ucGpROGTj4MLhGsDxcDOrVV4/aUXObcsudp1BwsSvg9juYGqCm2F5/orynzNsK09lZhpqaYRsOrdqhc61aGgcf6mKLWNSVxF/uN43jLhIDAkAOOYEEy14TuiYPAoeNYI0RMZjZlYtalbAudV6Zqu2uDVZAAAAAAAWvAKLWl3GDbtYkFDzYzXV7dmokXLy/oE2d9QvS8NaOnjqpBK77HHsBIWwUMfI/jFD2+bt/GRCzeA0vLLNdbz/c1DfQ/+TT54GjUwCEUOLIqW8Y/5FEcbvBrOjzDklaXK/iSu76gfdOjHN+6lETFBalaotlLz+SZuByGQu1x4pfUI4TWdJ7s2gZPgXydxIPaFgVvzROhSfbq2ONF/E8VftrvuEfvQjBP+PiTbMfuPRIzvOlLYcuAshhyrGkVDiUTn0+xT+Jgjf+Aa/MmLTkEvvvU7d7IsPvfUr+0yhO5SsipmB2m4+Tn9o+ztZoUsqdFpNqgw99ZlNN2KsI8xySMs4I4xHs6XuXkOZnlT5cisL4hduH08gdXjzTPyLAIyRodTVGewC74WeOg+u158iN1/49JlzEFw3raL0xiGIPCyKZoFC82w4AGIOXdpHV2Q8xwtfn/q11lfQNLJxxhUWArq4TJ1zL/pgAAAAK1BIU5uNJzM3HkKjn8B3yzCJjR5yNB/s8ElvDQ8MKETvjWyRe13zojYXE57b2acLTWPgdKYbiPxUnkMhFPGdmYoCdGsXZES9px5ML5mRn40qPFmjFVxK9AS9+gt5QGBrIh/aRAVl1ILjFjglWqWoiaCxpRHc9902M/OgyedTxDiPZQzZuvDi7joCuU9pRSf1h6QUs/Ad2pD83Tx0EeDcUFD3W+lRQ/W8RnWOP8JDIKf7yKG4gsmUffg/imNZIwhiHR08YgVbX9ESVeDyCEMdNcNC4AMkEG05B0LpUl4XPHJzBLw7Eze4IQce32isTfESrKpHPqEsAeQLh+VAEHqt28jV7QrjEkUkLWNokS3WHQWqjbat3dqgWsOuhd0zPJbAxxThPS/SrfQX7rwl2fA4yQZ8i0TumBkJNhsVMQP33OC03xHODT2ZsazQvQgoLY/jQzfZ4+3Y08UqGkBeuB1HeW20L3xVHbg+kxxTAGTrTndAEaQ0bHPjC+0HtTM+BTSKH3P+KlZlRzm2IN+kfQf4mMojBcyKteYMmvMD6T4xflNbUvEq+86x5fgbe/pVxLWE6n4h8GbLxD2jk1iNh7RyaxGw9o5NYjYKrzMi7GPpOWwXGk56XX1twvnu6jo6pRBpbw5LGblrvv3dwrceYezr2ItT6wk3AcfWRvEj/7ZCiXhPjsu+2iyUkRQ4pZtcC/95in0M3LJxwq4N/uL8KsU0uHsodXUOHJha+/USJHalPXf73PjiT74GWPC3dh56Wo9BHiQ+P4LPZK/n5ZFFKQzXnhIecKwMAO3T0H3ly9bMbilUzeNDqAMvdENgM+71KkEsyChf8s9Jyw2irwOfRU8TDspzLyW+427Ay6o7BhL1JBTYCdXouP4Vn9E+FDmwhYMDVW7enmYMvG3Q9LZxHgADdciz1ivq3WOvz9uZwuVHdlpgE68+KqheTgnDoN8rWv3AedMxEMM8dfI2z2K/rFUbpFuSgak6tA5/Lo08rAHRR4ch9Z1R08DIAmrBwQuvsSAuFqJQvJRp3/Z6QHvV9L82cfNeBuYL9DAHHCSTs6vLKdGiKNyJIOzY9v6O6+sRwOWaVr6aczoc+O5NIVta5rrOLqrlUi8JXJ/KIIhi3NecR9GIKPb3HsdWV4HbtkmfCESYCu6pI1NTvoUVbTp7pJS+kPGXOK1HnE6J/1Q//kUF/8J2sbie+ZEcefpcaXPZYAAAAvvpiw9FHFeFclUzW/ez+E2dZ43VjfjwaF58phzWM6e6lPiYfAzADEJ8184z1PHe1BXYX8w2DcWufP4Uk4GAPBezNdsg4Ek5BPY67DiieILuPIKranoDBFYY3u7fIuk1Q4+VGlAP9rjeLX2zUYRXyh2fH3E4hVPppKvOSEEQAe0Ai05sLy6IpQlogObmGGgtr8dD4+dHXJHBmEmiLzLru7CfdADSM1uAH/ao1LyUe9afI+mdp4kB++0VzkhLF6XlPvjb7FuPt0vf3/iBWfyPVIUxxsgX4UfK4vW6tw9xuffG/33JpFpJlW1GkFBq24IyvLZHxeJa5bvyOXLKc6ShLzXuATcLh+HokYSEQQ9nmLewlbPKBrsE6HSmuYeumizr5RZg9gFNSFP9dsJjLl7i1FfQbHkOE3vKUZJGsfbYkFpkEAxCY0jcEzS5U3dGwzGduHTxINBx6ucPej0Mj1KxO4kmjfQb9GZqoCEVk2/0WbabKVCvOkYlyulxDT4wd7xg0ZTcZX9+BdaeomAMCBtG/H2QFj+XboqszOYwv364uUsDRo8X02Po0eL6bGk4eJfX//Etm4QCHL8iqbprc0md34npXp7J91GrTo03uvLTytAilUtjPBS01WjEtc/L+Td/6hR34tHrC2HiOldqyeDtTYRfyAw5xHr0StcbAzesNY5bWSs6khpMmJ5+4Y/yzMJgKLcW9svVYL+L07fd5MJiOE8JqT9hz5OeWjSrEkYgFNOgswnbdHySi+ZKllYHXLnTKPbky3LUyS3kzP3iZrjeaYxa9yJE/nXpUjdqKqBDz8IgfW01+4rqHY7ookVgTRdimUTR4/S+rELiooKavdW8z6l5G1gnCvkpqdsJbzGNgBCOji6OENiOJ4j81rZmEiINJ1G8L9o1vF2+jimpljaic22fKA+/IpSjPKIuDbECXJ9ovlvgvi4/0VU7Swohqn7uKnSJYPS6JgXv5aJeMlqh78VPwNegG9AA/QKzGav6pGuJA0u3podI5KGvJXSHdrQwtAO2JObNWrVq1atWrVq1atWjMx1ZCtkfYjgc4jK8NxaaWGqh/hvAYw4J1X9CZ7w1LeGv6iTQPCXilry3DJtTvBs4HdYKGtxXEaSmpcWCP4m/dc4NCyz3RB/irghnEaUAAABTwJMesxs7HD0r7iOeqoph+3sR76TCttCJBnvJnJ6o06SWySZ/F8G+ep4p7zscywGVLvhcb4nvxHxsZUv8WIoRyYEuPTq0jTjcwf/YILSnDImT6kMN1/WmemGY/W+8pN5kmytSKgRGMljtMXa08nMLumtpf6WS4VX61QyUCx9wl8gRDim+Dq18HZ3XAqDz6N2a4q6SNgmu8JWZLm7jmw9QSBXN/s0XV/m+Xw5gqzZOn3JaH9qG2o+V6W8AuYM8ep6oqnNV6DlvMXyucvJbcu0HLeYvlc5cHZ9c9cgPVcBOv5PooAAOHdqfh4lNAVb6jzZw0hJHVf3k0rIfdy+vHPpncJ1Ga95ojL5aCeAU26R+j2SZo9AfucWeUW/x4au4f9pdITbX4g/Swkx/v02eOwMXv1eh+Kem5xYGNywbnFgY3LBucWBjcsG5xYGNywbnFgY3LBucWBjENFcDraunlRKOIJXqRoxiXjiRpvHnsiROoQ4r38eOR2YWrwDg22cJJfjU/ro88hWKqPxR8rXmN//BBKpv/n9KwW3PoHyB1Jz6oxN6bcbHnYI7/uT9UfYJLbtZYAAAAAABh7B1ZXvtvHbdOwP+RphJZ44BBAKy/P5rqPY2E4bINJDct1CCEJWLlyE0/dAYb6IioS13uXJMJgjvrV0rdkvLppc8auBaqTZW0M1cWTAAAAAAApR5FhXEB/Sz73ACvDtzorSaoDCQB4t6M/FOAGcncM9fqmVHiu+vS9ScK3rfil7BaxgEvP3SCjVFTKmhoxHjCxIXSffRVsnV6BAAAAAAAAR1cIl2iX1KHVUdUVKTBj3ElTb+T+T8YqBa6jGhrG7JFS2E9uPqYqQdXiYrtOR77ucdU6VIn/FglhlvgZKgOPjUSnbMy2VeJ/TX+edKcQ/xCVYwAAAAAAAO5JEn+RNSoXB7MnUqMGfLqBdC5nItcLZ0BQoifT8Rza/LPgS7cspiRVJwk0cQwa3v8qNoBL1wA0eSlZV2RXlG4ShFwRixScdWam/NCoMcG+yhaQXtVDEc1D4J9/sAAAAAAAaQsf+PGyhA72Ok0gTP/6MNj4lCBKKlLTUlnj+jFDv0vnNKbFlrhccgsqXJpyeflDYMCM6hZ92o63oYbv0tSWN4emsNz5/IcGuV1u2a0iOKCjISQAcuT1C+Ie0cmsRsPaOTWI2HtHJrEbD2jk1iNh7RyaxHCM14n/eys+eswCZtiI3sB8vonqBV+Zp+9fJS9MdQjgdrnLu6tFjA2Kq5wxLit1keUuGuKfkgI6yBCM10Gm0QZeJ8Mgji94IBG1wxnB6IRsgio6UUxEEvIlVyzAIAAAAAAAAAA1/D5eT3Ho19VvlPTuUb5djncL3ztF3OTGQVKyhALAJhCFu2k9b4RVwj3kNFfkNyRPc92RKqQUTnaQk3gAAAAAABA4JsLu4jgustPuyub4gpYjt19oWhFXZ/Gkbrn9dn9h7Ek26KCn2riGWkAAAAAAAKwKWtXCORkM1fz8+BFXcsQ3OlAikaFbtsCSAAAAAAAD00s+TQ+qPeJIBpJONg/b1/1EZwf4f0kxJuXhKzsN8u+AAAAAAAjJ9qCTxOti03KjDljf9UEsRzD8MzdxHMPwzN3Ecw/DM3cRzD8MzdxHMPwzN3Ecx2tgg7LSy9BJNI2vRa3McZUPh0K/2zm3qjIRwCAAAAAAAi5/eyQBVD0DSF+vpWIpAeMHZfa6SKxniwMblg3OLAxuWDc4sDG5YNziwMblg3OLAxuWDcv3hHqzfPP2mRAVL+zRVHEDVTIlIwUFAAAAAAAgzIbyUiSwjXImhTh34dgw6O5uBYP3DB3q2MptgxKIB2hapkscWoRJOpStxAIAAAAAAAMIQK94QDk4dtOUFDlpLlfcv0o8DTaYvb+3WdoNJHcqIK3n+igIGqKphr5g40iKQTPqxJingAAAAAACnVV0EbOMd084MKGcapp5N7mGYwqT6w/Fhh4aC0i1IUVgkTrX8RUPzN8sPBeaUdlLlv8+kcd+SwnMzcVQBxkofOdE9b9Wg7UOfvl5CZfcpm7fq+c4+/nt8yuZMOh+ccbvCfzoGcnuPCNJCfBoopP/acnZTm8F9Za1JQjcOJ5DdIDCYrIy5qjPS70URLXcH91bbPp0pPyFlT7xns+k9/We1NxOMZbKmPReTLd7EFU5s7o6uIPPGE8GfcZMEo98kvf5GOyB1DurWcK4kmNlA1JQ0gav/hcId7795AJdhfm0H15AvlP8G3CUpOYweW5aRZXWqiHQEed3StX0fXifISLi1wd+/0+DDKZpPTlGvGJJze1BFj/wAlG5wViS5OV88go0qUh1Hujrf8gb+hdFhsj15hNs87fjm+f+t5kqbWXeHq629eVIN8uWbL8VQI/F0nRxk1woLwdnV+jzIkuuYzw5nwGAfj4M61wg3T5xizMHLaJNdY599lcbroygyCIf45bk1tDe0GHp1rYy88Gdg7HRiIWHFVk50XsneL3N/JobQGY91SJz1l2r1S546JT5NIy9CEibxb2HmgiXYG4q6YkVnHQ3hL9B4UT1DxwzPLdI88i1CdOjBpmrAHY2KRk+jUvHEeG4mCmKNNMsf+MD14y+oQqvNRnLk22bk/9dgAkZsSS1jhcLwLiBW+LGvcLiNTfezb+o2I3AMBvXMyGlo9CxJgkCjMekNivgFVTvLx2/Qs9cYNfh0rSphTqzBsWyzhZG3+Y9PFpj6rlhe7TdX+ONqvZHSOaYgeT8dLkizXCGj2Q9OWXr4s2CPb1E6JrsPveqhz/YveKMaq/ULWoI41ctb148u5DFq2ylaURt4Uro0WxQYCa5cPUS/lJXgjp/9+m5abl3WaIuV9PXhXqD2NZKGZndPdolFegsQjAc3riD9gvSBWlFHoTKXXcouqf6cJhx3Sk/T90U/kWg8LoGzOONcffTWq5Xxqb6ZEMES4fxb+EPzto1mH2b7Z643aIPyVGZk4NYv4EjXOLTOsFNciiDEs4rUsb86yiM4RiaZlGlEMH+VwzZXGxBDHB806vTvq5e7Hc0RVuh+pwSQGpV8JTXEJpS27bb6Piy2oV/0wt7/ALosvKy8HUOhJ11ZOKwfraMlT/F8/4j1sBZEc8iZmnPNg74r904ysbefaFSMItR4BzT6fuu7yUpyjcsj0YEC0xLAB9gMuC8pY7K6+6qsNE/WzypaCWetn92v7PlZSyLuuP8SFQWSZvFUdbukZrEkOSo3c0wt/sLBwEASZZ4RaaifCzTIUk8mUnwvAl+TlS12m7wCDPiGI+cvjebyWdp6BwWXU6+oAA"},"G":{"L":{"H0":[440,176],"H1":[905,383],"F0":[72,335],"F1":[626,462]},"R":{"H0":[480,157],"H1":[915,374],"F0":[1008,105],"F1":[1332,388]}},"barL":[[66,326],[640,458],[644,470],[636,500],[78,370],[75,342]],"barR":[[996,84],[1016,84],[1342,376],[1346,392],[1332,426],[1005,182],[1004,110]],"arms":{"Lt":{"A":[480,193],"E":[284,318],"F":[112,347]},"Lb":{"A":[912,392],"E":[716,457],"F":[628,470]},"Rt":{"A":[484,194],"E":[745,215],"F":[1003,143]},"Rb":{"A":[930,390],"E":[1100,410],"F":[1290,388]}}};
  const phDyn = (p) => {
  const e = Math.max(0, Math.min(1, p / 100)), G = PH.G, f = (n) => n.toFixed(1);
  const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const pts = (a) => a.map((q) => `${f(q[0])},${f(q[1])}`).join(' ');
  const H0 = { L: G.L.H0, R: G.R.H0 }, H1 = { L: G.L.H1, R: G.R.H1 }, F0 = { L: G.L.F0, R: G.R.F0 }, F1 = { L: G.L.F1, R: G.R.F1 };
  const side = (k) => {
    const a0 = lerp2(H0[k], F0[k], e), a1 = lerp2(H1[k], F1[k], e);
    return { a0, a1, clip: [H0[k], H1[k], a1, a0] };
  };
  const S = { L: side('L'), R: side('R') };
  // barre + retombée : transformation affine qui suit le bord avant
  const barM = (k) => {
    const s0 = F0[k], s1 = F1[k], d0 = S[k].a0, d1 = S[k].a1, u = [s1[0] - s0[0], s1[1] - s0[1]], U = [d1[0] - d0[0], d1[1] - d0[1]];
    // (u, v=(0,1)) -> (U, (0,1)) : x' = U0/u0 * dx + ..., on résout a,c : [U0 = a*u0 + c*0]... avec v=(0,1) fixe
    const a = U[0] / u[0], b = (U[1] - 0 * 0) / u[0] - 0, c = 0, d = 1;
    // a*u0 = U0 ; b*u0 + d*u1.. : on impose l'image de (0,1) = (0,1) donc c=0,d=1 ; b = (U1 - u1*d)/u0
    const bb = (U[1] - u[1]) / u[0];
    const tx = d0[0] - a * s0[0] - c * s0[1], ty = d0[1] - bb * s0[0] - d * s0[1];
    return `matrix(${a.toFixed(5)} ${bb.toFixed(5)} ${c} ${d} ${f(tx)} ${f(ty)})`;
  };
  // bras articulés : deux segments de longueurs fixes, le genou reste du même côté
  const barPt = (k, bar, pt) => { // pt (plein déploiement) -> position avec la barre déplacée
    const s0 = F0[k], s1 = F1[k], u = [s1[0] - s0[0], s1[1] - s0[1]], l2 = u[0] * u[0] + u[1] * u[1];
    const t = ((pt[0] - s0[0]) * u[0] + (pt[1] - s0[1]) * u[1]) / l2, base = [s0[0] + u[0] * t, s0[1] + u[1] * t], off = [pt[0] - base[0], pt[1] - base[1]];
    const n = lerp2(S[k].a0, S[k].a1, t);
    return [n[0] + off[0], n[1] + off[1]];
  };
  const arm = (key, k) => {
    const a = PH.arms[key], A = a.A, E0 = a.E, Fp = barPt(k, null, a.F);
    // le bras garde sa forme : même figure, réduite et tournée vers la barre ; le genou ressort un peu quand il est replié
    const w0 = [a.F[0] - A[0], a.F[1] - A[1]], w = [Fp[0] - A[0], Fp[1] - A[1]], d0 = Math.hypot(w0[0], w0[1]), d = Math.hypot(w[0], w[1]) || 1;
    const s = d / d0, ang = Math.atan2(w[1], w[0]) - Math.atan2(w0[1], w0[0]), c = Math.cos(ang), sn = Math.sin(ang), r = [E0[0] - A[0], E0[1] - A[1]];
    let E = [A[0] + s * (c * r[0] - sn * r[1]), A[1] + s * (sn * r[0] + c * r[1])];
    const u = [w[0] / d, w[1] / d], nrm = [-u[1], u[0]], q = (E[0] - A[0]) * nrm[0] + (E[1] - A[1]) * nrm[1], bulge = q * .45 * (1 - e);
    E = [E[0] + nrm[0] * bulge, E[1] + nrm[1] * bulge];
    const F = Fp, pl = pts([A, E, F]);
    return `<polyline points="${pl}" fill="none" stroke="#14161a" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pl}" fill="none" stroke="#2a2d33" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${pts([[A[0], A[1] - 2.5], [E[0], E[1] - 2.5], [F[0], F[1] - 2.5]])}" fill="none" stroke="#5b626a" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" opacity=".8"/><circle cx="${f(E[0])}" cy="${f(E[1])}" r="9" fill="#14161a"/><circle cx="${f(E[0])}" cy="${f(E[1])}" r="4" fill="#7a8189"/>`;
  };
  const cv = (k) => `<g clip-path="url(#ID-phc${k})"><image href="${PH.img.canvas}" x="0" y="0" width="1388" height="1133"/></g>`;
  const bar = (k) => `<g transform="${barM(k)}"><g clip-path="url(#ID-phb${k})"><image href="${PH.img.bars}" x="0" y="0" width="1388" height="1133"/></g></g>`;
  const clips = `<clipPath id="ID-phcL"><polygon points="${pts(S.L.clip)}"/></clipPath><clipPath id="ID-phcR"><polygon points="${pts(S.R.clip)}"/></clipPath>`;
  return `<defs>${clips}</defs><g class="aw-flap2">${cv('L')}${cv('R')}${bar('L')}${bar('R')}${arm('Lt', 'L')}${arm('Lb', 'L')}${arm('Rt', 'R')}${arm('Rb', 'R')}</g>`;
};

  const DAWNING = () => `<defs><clipPath id="ID-phbL"><polygon points="${PH.barL.map((q) => q.join(',')).join(' ')}"/></clipPath><clipPath id="ID-phbR"><polygon points="${PH.barR.map((q) => q.join(',')).join(' ')}"/></clipPath></defs>
      <image href="${PH.img.plate}" x="0" y="0" width="1388" height="1133"/><g class="aw-shadow" fill="#000"></g>
      <g class="aw-dyn ph-dyn"></g>
      <image href="${PH.img.fg}" x="0" y="0" width="1388" height="1133"/><g class="aw-leds"></g>
      <rect class="pg-dim" x="0" y="0" width="1388" height="1133" fill="#0a1020"/>
      <g class="aw-wind" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".0"><path d="M90 190q70 -22 150 0t120 -8"/><path d="M60 260q60 -18 120 0t100 -6"/><path d="M110 330q50 -14 100 0t80 -4"/></g>
      <circle class="led" cx="1340" cy="130" r="9"/><g transform="scale(4.6)">${ARROW(1296 / 4.6, 190 / 4.6)}</g>`;

  /* ---- fenêtre de toit : pan de toit en tuiles, ouvrant à rotation (transform posé par JS), volet roulant extérieur ---- */
  const RW = { X: 58, Y: 40, W: 84, H: 96 };
  // ouvrant pour une ouverture a (0 à 100) : il pivote sur son axe médian, le bas sort vers l'extérieur
  const rwSash = (a) => {
    const { X, Y, W, H } = RW, ang = a / 100 * .9, cx = X + W / 2, cy = Y + H / 2;
    return `translate(0 ${(Math.sin(ang) * H * .22).toFixed(1)}) translate(${cx} ${cy}) scale(1 ${Math.cos(ang).toFixed(3)}) translate(${-cx} ${-cy})`;
  };
  const ROOF = () => {
    const { X, Y, W, H } = RW;
    // rangs de tuiles de plus en plus serrés vers le faîtage (effet de pente)
    const rows = []; let y = 26; for (let r = 0; r < 12; r++) { const h = 6 + r * 1.25; rows.push([y, h]); y += h; }
    const tiles = rows.map(([y, h], r) => {
      const w = 10 + r * .9, o = (r % 2) * w / 2; let d = '';
      for (let x = -w; x < 210; x += w) d += `M${(x + o).toFixed(1)} ${(y + h).toFixed(1)}q${(w / 2).toFixed(1)} ${(-h * .5).toFixed(1)} ${w.toFixed(1)} 0`;
      return `<path d="M0 ${y.toFixed(1)}h200" stroke="#8f3f2c" stroke-width=".5" opacity=".6"/><path d="${d}" stroke="#8f3f2c" stroke-width="1.1" fill="none"/>`;
    }).join('');
    const drops = [...Array(28)].map((_, k) => { const x = (k * 37.3) % 210, y = (k * 23) % 60; return `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(x - 2).toFixed(1)}" y2="${y + 8}"/>`; }).join('');
    return `<defs><linearGradient id="rwtile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0573c"/><stop offset="1" stop-color="#a94a33"/></linearGradient>
      <linearGradient id="rwrefl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9d6f5"/><stop offset=".5" stop-color="#e6f4fd"/><stop offset="1" stop-color="#7fb8e3"/></linearGradient>
      <clipPath id="rwclip"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath></defs>
      <g class="day"><rect width="200" height="172" fill="url(#shskyd)"/><g class="pg-sun"><circle cx="24" cy="10" r="7" fill="#ffd54a"/></g></g>
      <g class="night"><rect width="200" height="172" fill="url(#shskyn)"/><circle cx="130" cy="9" r="4.5" fill="#f4f1d0"/><circle cx="132" cy="7.6" r="3.8" fill="#0b1430"/></g>
      <g class="pg-cloud"><rect width="200" height="22" fill="#8d99a8"/><ellipse cx="60" cy="8" rx="36" ry="8" fill="#7d8896"/><ellipse cx="140" cy="6" rx="40" ry="8" fill="#86919f"/></g>
      <rect y="22" width="200" height="150" fill="url(#rwtile)"/>${tiles}
      <rect y="18" width="200" height="6" fill="#7d3524"/><path d="M0 18h200" stroke="#5a2a1d" stroke-width="1.2"/>
      <rect x="160" y="2" width="16" height="20" fill="#b9ad9c"/><rect x="158" y="0" width="20" height="4" fill="#9a8f80"/>
      <rect x="0" y="164" width="200" height="8" fill="#d6dadf"/><rect x="0" y="164" width="200" height="2" fill="#f1f3f5"/>
      <rect class="pg-dim" x="0" y="0" width="200" height="172" fill="#0a1020"/>
      <rect x="${X - 10}" y="${Y - 10}" width="${W + 20}" height="${H + 18}" rx="2" fill="#3e444c"/>
      <rect x="${X - 6}" y="${Y - 6}" width="${W + 12}" height="${H + 10}" rx="1.5" fill="#575e67"/>
      <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#2a2f35"/>
      <g clip-path="url(#rwclip)"><rect class="rw-in" x="${X}" y="${Y}" width="${W}" height="${H}" fill="#4a3d33"/><rect class="rw-in rw-in2" x="${X}" y="${Y + H * .55}" width="${W}" height="${H * .45}" fill="#33291f"/>
        <!-- pièce vue par l'ouverture : plafond en pente et suspension allumée, pour ne pas confondre avec un store -->
        <path d="M${X} ${Y}h${W}l-${W * .18} ${H * .2}h-${W * .64}z" fill="#000" opacity=".25"/>
        <path d="M${X + W / 2} ${Y + H * .2}v${H * .12}" stroke="#1d1814" stroke-width="1"/><circle cx="${X + W / 2}" cy="${Y + H * .36}" r="7" fill="#ffd98a" opacity=".35"/><path d="M${X + W / 2 - 5} ${Y + H * .36}h10l-2 -4h-6z" fill="#ffcf7a"/></g>
      <g class="rw-sash">
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="var(--sc)"/>
        <rect x="${X + 4}" y="${Y + 4}" width="${W - 8}" height="${H - 8}" fill="url(#rwrefl)"/>
        <rect class="night" x="${X + 4}" y="${Y + 4}" width="${W - 8}" height="${H - 8}" fill="#1b2a55"/>
        <path d="M${X + 10} ${Y + H - 10}L${X + W - 30} ${Y + 8}h12L${X + 20} ${Y + H - 10}z" fill="#fff" opacity=".35"/>
        <rect x="${X}" y="${Y}" width="${W}" height="7" fill="#3e444c"/><rect x="${X + W / 2 - 12}" y="${Y + 1.5}" width="24" height="3" rx="1.5" fill="#22262b"/>
        <rect x="${X}" y="${Y + H - 3}" width="${W}" height="3" fill="#7b838d"/>
      </g>
      <g clip-path="url(#rwclip)"><g class="rw-blind">${[...Array(16)].map((_, k) => `<rect x="${X}" y="${Y + k * 6}" width="${W}" height="6" fill="#3a3f46" stroke="#22262b" stroke-width=".5"/>`).join('')}</g></g>
      <rect x="${X - 10}" y="${Y - 14}" width="${W + 20}" height="8" rx="2" fill="#3e444c"/>
      <circle class="led" cx="${X + W + 4}" cy="${Y - 10}" r="1.8"/>
      <g class="pg-drops" stroke="#e7f2ff" stroke-width="1" opacity=".85">${drops}</g>
      ${ARROW(X + W / 2, Y + H + 20)}`;
  };

  // couleur du tablier / des lamelles / des vantaux par défaut, et motifs de nom pour l'éditeur
  const KINDS = {
    sliding_curtain: { color: '#b6a997', re: /curtain|drape|rideau|vorhang|cortina|tenda|gordijn/i, icon: 'mdi:curtains' },
    roller_shutter: { color: '#d5dbe1', re: /volet|shutter|roll|rollo|store/i, icon: 'mdi:window-shutter' },
    venetian_blind: { color: '#ece2cf', re: /venitien|vénitien|venetian|blind|jalousie|lamel|store/i, icon: 'mdi:blinds-horizontal' },
    swing_shutter: { color: '#4f7d5c', re: /volet|shutter|battant|persienne|swing/i, icon: 'mdi:window-shutter-open' },
    pergola: { color: '#d5dae0', re: /pergola|bioclim|lame|louvre|lamelle/i, icon: 'mdi:pergola' },
    double_awning: { color: '#c9bfa5', re: /double|autoport|pied|free|stand|sunsquare|store_banne|banne|awning/i, icon: 'mdi:umbrella-beach-outline' },
    awning: { color: '#b3a086', re: /store_banne|banne|awning|markise|toldo|tenda|luifel|markiza|markyza|store/i, icon: 'mdi:awning-outline' },
    roof_window: { color: '#4b525b', re: /velux|fenetre_toit|fenetre_de_toit|roof|skylight|dachfenster|tabatiere|fakro/i, icon: 'mdi:window-open-variant' },
  };
  const TILES = [['position', 'mdi:arrow-expand-vertical', 'show_position'], ['tilt', 'mdi:rotate-3d-variant', 'show_tilt'],
    ['power', 'mdi:flash', 'show_power'], ['blind', 'mdi:window-shutter', 'show_blind'], ['rain', 'mdi:weather-pouring', 'show_rain'], ['wind', 'mdi:weather-windy', 'show_wind'], ['lux', 'mdi:white-balance-sunny', 'show_lux'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['since', 'mdi:history', 'show_since']];

  class ApplianceShutterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_position: true, show_tilt: true, show_power: true, show_since: true,
        show_rain: true, show_wind: true, show_blind: true, show_lux: true, show_temperature: true, sun_entity: 'sun.sun', ...c };
      // volet extérieur = la fenêtre elle-même : sans objet, on l'ignore (sinon bouton et tuile « Volet » en double)
      if (this._c.entity_blind && this._c.entity_blind === this._c.entity) delete this._c.entity_blind;
      // fenêtre de toit sans ouvrant motorisé, seulement un volet roulant (Velux solaire…) : les commandes pilotent le volet
      this._blindOnly = this.kind === 'roof_window' && !this._c.entity && !!this._c.entity_blind;
      // store vénitien « inclinaison seule » : ni montée ni descente, seulement l'angle des lames (curseur + préréglages)
      // tilt_from_position : moteur ordinaire (sans fonction d'inclinaison) branché sur le cordon d'inclinaison (Aqara E1…) :
      // la position de la cover (0-100) sert d'angle des lames ; implique l'inclinaison seule
      this._tiltFromPos = this.kind === 'venetian_blind' && !!this._c.tilt_from_position;
      this._tiltOnly = this.kind === 'venetian_blind' && (!!this._c.tilt_only || this._tiltFromPos);
      this._assume = undefined;
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) {
      // pergola : libellés au féminin (« Ouverte », « Fermée ») et « Lames » au lieu de « Position »
      const L = T[this._lang()], pre = { pergola: 'pg_', roof_window: 'rw_', awning: 'aw_', double_awning: 'aw_' }[this.kind], pk = pre ? `${pre}${k}` : null;
      return (pk && (L[pk] ?? T.en[pk])) ?? L[k] ?? T.en[k] ?? k;
    }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    get _aw() { return this.kind === 'awning' || this.kind === 'double_awning'; }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { return window.applianceNum(this._st(id)); }
    _watts(id) { const v = this._num(id); return /^kw$/i.test(this._unit(id, 'W')) ? v * 1000 : v; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    // vitesse du vent en km/h, quelle que soit l'unité du capteur (m/s, mph, nœuds)
    _windKmh() {
      const id = this._c.entity_wind, v = this._num(id); if (isNaN(v)) return NaN;
      const u = String(this._unit(id, 'km/h')).toLowerCase().replace(/\s/g, '');
      return /^(m\/s|ms)$/.test(u) ? v * 3.6 : /mph|mi\/h/.test(u) ? v * 1.609 : /^(kn|kt|kts|knots?)$/.test(u) ? v * 1.852 : v;
    }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      // durée courte (« 12 min », « 3 h ») : la tuile s'appelle déjà « Depuis » ; « maintenant » sous 45 s
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const swing = this.kind === 'swing_shutter', pergola = this.kind === 'pergola', roof = this.kind === 'roof_window', awning = this.kind === 'awning' || this.kind === 'double_awning', dbl = this.kind === 'double_awning', curtain = this.kind === 'sliding_curtain';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        <div class="scene${swing ? ' sw' : pergola || awning ? ' pg' : ''}"><svg viewBox="${dbl ? '50 70 1338 930' : pergola || awning ? '0 0 240 180' : '0 0 200 172'}" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${pergola ? PERGOLA() : dbl ? DAWNING() : awning ? AWNING() : roof ? ROOF() : SVGS[this.kind](this._c)}</svg>
          ${swing ? `<div class="leaf l mv">${LEAF(false)}</div><div class="leaf r mv">${LEAF(true)}</div>` : ''}</div>
        <div class="rng ps" id="shpos"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="rng tl" id="shtilt"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="ctl" id="shpre">${this._tiltPresets().map((v) => `<button data-tilt="${v}"><span>${v} %</span></button>`).join('')}</div>
        <div class="ctl" id="shtbt">
          <button data-k="open" data-a="open_cover_tilt"><ha-icon icon="mdi:blinds-open"></ha-icon><span></span></button>
          <button data-k="stop" data-a="stop_cover_tilt"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-k="close" data-a="close_cover_tilt"><ha-icon icon="mdi:blinds-horizontal-closed"></ha-icon><span></span></button>
        </div>
        <div class="ctl" id="shctl">
          <button data-a="open"><ha-icon icon="${curtain ? 'mdi:arrow-expand-horizontal' : awning ? 'mdi:arrow-expand-down' : 'mdi:arrow-up'}"></ha-icon><span></span></button>
          <button data-a="half"><ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="${curtain ? 'mdi:arrow-collapse-horizontal' : awning ? 'mdi:arrow-collapse-up' : 'mdi:arrow-down'}"></ha-icon><span></span></button>
          ${pergola || awning ? '<button data-a="light"><ha-icon icon="mdi:led-strip-variant"></ha-icon><span></span></button>' : ''}
          ${roof ? '<button data-a="blind"><ha-icon icon="mdi:window-shutter"></ha-icon><span></span></button>' : ''}
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${curtain && k === 'position' ? 'mdi:arrow-expand-horizontal' : ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      if (curtain) root.getElementById('shctl').after(root.getElementById('shpos'));
      window.applianceBindIllus(this, root.querySelector('.scene'), () => this._more(this._main()));
      root.querySelectorAll('#shctl button').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.a === 'blind') {
          const id = this._c.entity_blind; if (!this._hass || !id) return;
          this._hass.callService('cover', this._blindDown > 0 ? 'open_cover' : 'close_cover', { entity_id: id }); return;
        }
        if (b.dataset.a === 'light') { if (this._hass && this._c.entity_light) this._hass.callService('homeassistant', 'toggle', { entity_id: this._c.entity_light }); return; }
        if (b.dataset.a === 'half') { this._half(); return; }
        // invert_buttons : moteur câblé à l'envers, « Ouvrir » ferme la cover et inversement (le dessin et la position ne changent pas)
        const a = this._c.invert_buttons ? { open: 'close', close: 'open' }[b.dataset.a] || b.dataset.a : b.dataset.a;
        // dispositifs indépendants : un bouton / script / interrupteur par commande (volets sans entité cover, ou commandes à part)
        const own = this._c['entity_' + a];
        if (own && ['open', 'close', 'stop'].includes(a)) { this._fire(own); this._remember(a); return; }
        if (this._hass && this._main()) this._hass.callService('cover', `${a}_cover`, { entity_id: this._main() });
      }));
      root.querySelector('#shpos input').addEventListener('change', (e) => {
        if (!this._hass) return;
        const v = this._c.invert ? 100 - Number(e.target.value) : Number(e.target.value);
        // pergola pilotée par l'inclinaison des lames
        if (this._tiltDriven) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: v });
        else this._hass.callService('cover', 'set_cover_position', { entity_id: this._main(), position: this._blindOnly ? Number(e.target.value) : v });
      });
      // préréglages d'inclinaison (0 % = lames fermées, 50 % = mi-ouvertes, 100 % = refermées dans l'autre sens)
      root.querySelectorAll('#shpre button').forEach((b) => b.addEventListener('click', () => {
        this._setTilt(Number(b.dataset.tilt));
      }));
      // cover sans set_cover_tilt_position : commandes d'inclinaison ouvrir / stop / fermer
      root.querySelectorAll('#shtbt button').forEach((b) => b.addEventListener('click', () => {
        // angle porté par la position : ouvrir / stop / fermer la cover elle-même
        if (this._hass) this._hass.callService('cover', this._tiltFromPos ? `${b.dataset.k}_cover` : b.dataset.a, { entity_id: this._c.entity });
      }));
      root.querySelector('#shtilt input').addEventListener('change', (e) => {
        this._setTilt(Number(e.target.value));
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more({ position: this._c.entity_position, power: this._c.entity_power, rain: this._c.entity_rain, wind: this._c.entity_wind, blind: this._c.entity_blind, lux: this._c.entity_lux, temperature: this._c.entity_temperature }[k] || this._c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._pos = null; this._ang = null;
    }

    // règle l'angle des lames : set_cover_tilt_position, ou set_cover_position quand l'angle est porté par la position (invert respecté)
    _setTilt(v) {
      if (!this._hass) return;
      if (this._tiltFromPos) this._hass.callService('cover', 'set_cover_position', { entity_id: this._c.entity, position: this._c.invert ? 100 - v : v });
      else this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: v });
    }

    // valeurs des boutons d'inclinaison : option tilt_presets (nombres 0-100), sinon 0 / 25 / 50 / 75 / 100
    _tiltPresets() {
      const l = Array.isArray(this._c.tilt_presets) ? this._c.tilt_presets.map(Number).filter((n) => isFinite(n)).map((n) => Math.max(0, Math.min(100, Math.round(n)))) : [];
      return l.length ? [...new Set(l)] : [0, 25, 50, 75, 100];
    }

    // commande par un dispositif : bouton (press), script / scène / interrupteur (turn_on), cover (open_cover)
    _fire(id) {
      const h = this._hass; if (!h || !id) return;
      const d = id.split('.')[0];
      if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
      else if (d === 'cover') h.callService('cover', 'open_cover', { entity_id: id });
      else h.callService(['script', 'scene', 'switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'turn_on', { entity_id: id });
    }
    // volet commandé seulement par des dispositifs, sans cover ni capteur : l'état affiché est celui de la dernière commande
    _cmdOnly() { const c = this._c; return !this._main() && !c.entity_state && !c.entity_position && !!(c.entity_open || c.entity_close || c.entity_half); }
    _memKey() { const c = this._c; return `appliance-shutter:${c.entity_open || ''}|${c.entity_close || ''}|${c.entity_half || ''}`; }
    _remember(a) {
      if (!this._cmdOnly() || !['open', 'close', 'half'].includes(a)) return;
      this._assume = a; this._assumeAt = Date.now();
      try { localStorage.setItem(this._memKey(), a); } catch (e) { /* stockage indisponible */ }
      this._render();
    }
    // position mi-ouvert : entity_half (bouton / script), sinon set_cover_position à half_position (la cover doit savoir se placer)
    _half() {
      const c = this._c;
      if (c.entity_half) { this._fire(c.entity_half); this._remember('half'); return; }
      const hp = Number(c.half_position);
      if (this._hass && this._main() && isFinite(hp)) this._hass.callService('cover', 'set_cover_position', { entity_id: this._main(), position: c.invert ? 100 - hp : hp });
    }
    // entité pilotée par les boutons et le curseur : l'ouvrant, ou le volet en mode « volet seul »
    _main() { return this._c.entity || (this._blindOnly ? this._c.entity_blind : ''); }

    _compute() {
      const c = this._c;
      if (this._blindOnly) {
        // fenêtre dessinée fermée ; l'état affiché est celui du volet (voir _render)
        const b = this._st(c.entity_blind), ok = !!b && !/^(unavailable|unknown)$/i.test(String(b.state));
        this._tiltDriven = false;
        return { st: ok ? 'closed' : 'unavailable', pos: 0, known: true, tilt: NaN, s: b };
      }
      const s = this._st(c.entity);
      let st = 'unavailable', pos = NaN, tilt = NaN;
      // unknown : HA ne connaît pas l'état (ex. après redémarrage), mais la cover reste pilotable
      if (s && /^unknown$/i.test(String(s.state))) {
        st = 'unknown';
      } else if (s && !/^(unavailable|unknown)$/i.test(String(s.state))) {
        const v = String(s.state).toLowerCase(), a = s.attributes || {};
        st = ['open', 'closed', 'opening', 'closing'].includes(v) ? v : /^(on|true|1)$/.test(v) ? 'open' : 'closed';
        if (a.current_position != null && isFinite(Number(a.current_position))) pos = Math.max(0, Math.min(100, Number(a.current_position)));
        if (a.current_tilt_position != null && isFinite(Number(a.current_tilt_position))) tilt = Math.max(0, Math.min(100, Number(a.current_tilt_position)));
      }
      // capteurs externes (cover sans retour d'état natif) : entity_position (0-100) remplace current_position,
      // entity_state (binary_sensor contact : on = ouvert, off = fermé ; ou cover / sensor open|closed) remplace l'état.
      // Un mouvement annoncé par la cover (opening / closing) reste prioritaire.
      const es = this._st(c.entity_state), ev = es ? String(es.state).toLowerCase() : '', epv = this._num(c.entity_position);
      let sensed = false;
      if (!isNaN(epv)) { pos = Math.max(0, Math.min(100, epv)); sensed = true; }
      if (/^(on|true|1|open|opened|opening|unlocked)$/.test(ev) || /^(off|false|0|closed|closing|locked)$/.test(ev)) {
        sensed = true;
        if (st !== 'opening' && st !== 'closing') st = /^(on|true|1|open|opened|opening|unlocked)$/.test(ev) ? (ev === 'opening' ? 'opening' : 'open') : (ev === 'closing' ? 'closing' : 'closed');
      } else if (!isNaN(epv) && st !== 'opening' && st !== 'closing') {
        st = pos > 0 ? 'open' : 'closed'; // position seule : l'état en découle
      }
      if (!isNaN(epv) && st === 'closed' && pos > 0) st = 'open'; // capteurs contradictoires : la position prime
      if (!isNaN(epv) && st === 'open' && pos <= 0) st = 'closed';
      // pergola : l'angle des lames est dans current_tilt_position si la cover le donne, sinon dans current_position
      this._tiltDriven = this.kind === 'pergola' && !isNaN(tilt);
      if (this._tiltDriven) { pos = tilt; if (st === 'closed' && pos > 0) st = 'open'; }
      const known = !isNaN(pos); // position réelle fournie par la cover
      // invert : cover qui remonte sa position à l'envers (fréquent avec Tuya), 0 = ouvert et 100 = fermé.
      // L'état HA en découle et est donc faux lui aussi : on le recalcule depuis la position corrigée.
      if (c.invert && st !== 'unavailable' && st !== 'unknown') {
        if (st === 'opening' || st === 'closing') st = st === 'opening' ? 'closing' : 'opening';
        else if (known) st = 'open';
        else st = st === 'open' ? 'closed' : 'open';
        if (known) pos = 100 - pos;
      }
      if (!known) pos = st === 'open' || st === 'opening' ? 100 : 0;
      else if (st === 'open' && pos < 100) st = pos > 0 ? 'partial' : 'closed';
      // angle des lames porté par la position de la cover (tilt_from_position)
      if (this._tiltFromPos && st !== 'unavailable') tilt = pos;
      // commandes seules (aucune cover ni capteur) : état supposé d'après la dernière commande envoyée
      if (this._cmdOnly()) {
        if (this._assume === undefined) { try { this._assume = localStorage.getItem(this._memKey()) || null; } catch (e) { this._assume = null; } }
        const hp = Number(c.half_position), half = isFinite(hp) ? Math.max(1, Math.min(99, hp)) : 50;
        if (this._assume === 'open') return { st: 'open', pos: 100, known: true, tilt: NaN, s: null, sensed: false };
        if (this._assume === 'close') return { st: 'closed', pos: 0, known: true, tilt: NaN, s: null, sensed: false };
        if (this._assume === 'half') return { st: 'partial', pos: half, known: true, tilt: NaN, s: null, sensed: false };
        return { st: 'unknown', pos: 0, known: false, tilt: NaN, s: null, sensed: false };
      }
      return { st, pos, known, tilt, s: s || es, sensed };
    }

    // pergola : fait pivoter les lames de l'angle affiché vers la cible en dur secondes
    _tween(to, dur, linear) {
      const from = this._ang == null ? to : this._ang, t0 = performance.now(), card = this._card;
      cancelAnimationFrame(this._raf);
      const draw = (a) => {
        this._ang = a;
        if (this.kind === 'roof_window') { this._root.querySelector('.rw-sash').setAttribute('transform', rwSash(a)); return; }
        if (this._aw) {
          const [dyn, sh, led] = this.kind === 'double_awning' ? [phDyn(a), '', ''] : awDyn(a, this._awTilt);
          this._root.querySelector('.aw-dyn').innerHTML = dyn;
          this._root.querySelector('.aw-shadow').innerHTML = sh;
          this._root.querySelector('.aw-leds').innerHTML = led;
          card.style.setProperty('--a', a.toFixed(1));
          return;
        }
        const [bl, sh] = pgBlades(a);
        this._root.querySelector('.pg-blades').innerHTML = bl;
        this._root.querySelector('.pg-shadow').innerHTML = sh;
        card.style.setProperty('--a', a.toFixed(1));
      };
      if (!(dur > 0) || from === to) { draw(to); return; }
      const step = (now) => {
        const k = Math.min(1, (now - t0) / (dur * 1000)), e = linear ? k : k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        draw(from + (to - from) * e);
        if (k < 1) this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pos, known, tilt, s, sensed } = this._compute();
      const sun = this._st(c.sun_entity), night = !!sun && sun.state === 'below_horizon';
      const rainS = this._st(c.entity_rain), rain = !!rainS && (/^(on|true|wet|rain|pluie|raining)$/i.test(String(rainS.state)) || this._num(c.entity_rain) > 0);
      const lightS = this._st(c.entity_light), leds = !!lightS && /^on$/i.test(String(lightS.state));
      const wk = this._aw ? this._windKmh() : NaN, windy = !isNaN(wk) && wk >= (Number(c.wind_max) > 0 ? Number(c.wind_max) : 40);
      card.className = `${st}${windy ? ' windy' : ''}${night ? ' isnight' : ''}${c.animations === false ? ' noanim' : ''}${this._tiltOnly ? ' tonly' : ''}${rain ? ' rain' : ''}${leds ? ' leds' : ''}`;
      const blS = this._st(c.entity_blind), blA = (blS && blS.attributes) || {};
      const blPos = blS ? (isFinite(Number(blA.current_position)) && blA.current_position != null ? Number(blA.current_position) : /^(closed|closing)$/i.test(blS.state) ? 0 : 100) : 100;
      this._blindDown = 100 - Math.max(0, Math.min(100, blPos));
      card.style.setProperty('--bl', String(this._blindDown));

      // course : durée proportionnelle à l'écart si travel_time est donné, sinon 1,2 s
      if (pos !== this._pos) {
        const tt = Number(c.travel_time);
        const dur = this._pos == null ? 0 : tt > 0 ? Math.abs(pos - this._pos) / 100 * tt : 1.2;
        card.style.setProperty('--sh-d', `${dur.toFixed(2)}s`);
        // avec un temps de course, la cover envoie sa position par paliers : mouvement linéaire pour enchaîner sans à-coups
        card.style.setProperty('--sh-e', tt > 0 ? 'linear' : 'ease-in-out');
        if (this.kind === 'pergola' || this.kind === 'roof_window' || this._aw) this._tween(pos, c.animations === false ? 0 : dur, tt > 0);
        this._pos = pos;
      }
      // store banne : l'inclinaison change l'angle de la toile, sans déplacer le store
      if (this.kind === 'awning') {
        const aw = isNaN(tilt) ? NaN : tilt;
        if (aw !== this._awTilt && !(isNaN(aw) && isNaN(this._awTilt))) { this._awTilt = aw; if (this._ang != null) this._tween(this._ang, 0); }
      }
      card.style.setProperty('--p', String(pos));
      card.style.setProperty('--t', String(isNaN(tilt) ? (st === 'closed' ? 0 : 100) : tilt));
      // lamelles vues de face : hauteur apparente = sin(angle depuis l'horizontale), 80° au maximum quand elles sont fermées
      const tv = isNaN(tilt) ? (st === 'closed' ? 0 : 50) : tilt, dev = Math.abs(tv - 50) / 50;
      card.style.setProperty('--sf', Math.max(.12, Math.sin(dev * 80 * Math.PI / 180)).toFixed(3));
      card.style.setProperty('--sd', tv > 50 ? (dev * .35).toFixed(3) : '0');
      card.style.setProperty('--sl', tv < 50 ? (dev * .25).toFixed(3) : '0');
      card.style.setProperty('--lt', String(Math.round((1 - dev) * 100)));
      card.style.setProperty('--sc', /^[#a-z0-9(),.\s%]+$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : KINDS[this.kind].color);

      const name = c.name || this._t(this.kind);
      r.getElementById('shtitle').textContent = name;
      const badge = r.getElementById('shbadge');
      const moving = st === 'opening' || st === 'closing';
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : moving && known ? `${this._t(st)}… ${Math.round(pos)} %` : this._t(st);
      if (this.kind === 'roof_window' && this._blindDown >= 100 && !moving && !this._blindOnly) badge.textContent += ` · ${this._t('blind_down')}`;
      if (windy && st !== 'unavailable') badge.textContent += ` · ${this._t('wind_alert')}`;
      // volet seul : le badge donne l'état du volet (libellés sans le préfixe rw_ de la fenêtre)
      // état du volet en mode « volet seul » ; ouvert à moins de 100 % = partiel, comme pour la fenêtre (Ouvrir et Fermer restent actifs)
      let bst = this._blindOnly && blS ? String(blS.state).toLowerCase() : st;
      if (this._blindOnly && bst === 'open' && blPos < 100) bst = blPos > 0 ? 'partial' : 'closed';
      if (this._blindOnly && st !== 'unavailable') {
        const g = (k) => (T[this._lang()] || T.en)[k] ?? T.en[k] ?? k;
        badge.textContent = this._blindDown >= 100 ? g('blind_down') : this._blindDown <= 0 && !/ing$/.test(bst) ? `${g('blind')} · ${g('open')}`
          : /ing$/.test(bst) ? `${g('blind')} · ${g(bst)}… ${Math.round(blPos)} %` : `${g('blind')} · ${g('partial')} ${Math.round(blPos)} %`;
      }
      badge.style.display = c.show_status === false || st === 'unknown' ? 'none' : '';

      // commandes et curseurs selon ce que la cover sait faire (supported_features)
      const isCover = this._main().startsWith('cover.');
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || !!(sf & bit);
      const assumed = !!(s && s.attributes && s.attributes.assumed_state === true);
      const posKnown = this._blindOnly ? blA.current_position != null && isFinite(Number(blA.current_position)) : known || sensed;
      const ctl = r.getElementById('shctl');
      const dual = !!(c.entity_open || c.entity_close || c.entity_stop || c.entity_half);
      ctl.classList.toggle('hide', c.show_controls === false || !(isCover || dual) || this._tiltOnly);
      const tiltSet = this._tiltFromPos ? has(4) : has(128);
      const pre = r.getElementById('shpre');
      pre.classList.toggle('hide', !(this._tiltOnly && isCover && tiltSet && c.show_controls !== false));
      // sans set_cover_tilt_position, la carte ne reste pas vide : boutons ouvrir / stop / fermer l'inclinaison
      const tbt = r.getElementById('shtbt');
      tbt.classList.toggle('hide', !(this._tiltOnly && isCover && !tiltSet && c.show_controls !== false));
      tbt.querySelectorAll('button').forEach((b) => {
        b.querySelector('span').textContent = this._t(`btn_${b.dataset.k}`);
        b.classList.toggle('hide', b.dataset.k === 'stop' && !has(64));
        b.disabled = st === 'unavailable';
      });
      pre.querySelectorAll('button').forEach((b) => { b.classList.toggle('on', !isNaN(tilt) && Math.abs(tilt - Number(b.dataset.tilt)) <= 2); b.disabled = st === 'unavailable'; });
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        // stop : fonction STOP de la cover, ou entity_stop ; mi-ouvert : seulement si configuré (entity_half, ou half_position avec une cover qui se place)
        b.classList.toggle('hide', (a === 'stop' && !(c.entity_stop || (isCover && has(8)))) || (a === 'half' && !(c.entity_half || (isCover && has(4) && isFinite(Number(c.half_position))))) || (a === 'light' && !c.entity_light) || (a === 'blind' && (!c.entity_blind || this._blindOnly)));
        if (a === 'blind') { b.classList.toggle('on', this._blindDown > 0); b.disabled = !blS; return; }
        if (a === 'light') { b.classList.toggle('on', leds); b.disabled = !lightS; return; }
        // assumed_state (RFXCOM, Somfy RTS…) : l'état est supposé, pas mesuré, donc on laisse tout cliquable comme la carte HA,
        // sauf si la cover remonte une position (current_position) : on s'y fie et on grise Ouvrir à 100 %, Fermer à 0 %
        // Avec un capteur externe (entity_state / entity_position), l'état affiché est l'état réel du store : on grise selon le bouton affiché.
        // Sans capteur, l'état vient de la cover, qui suit la commande envoyée : on grise selon l'action réellement envoyée.
        if (a === 'half') { const hp = Number(c.half_position); b.classList.toggle('on', isFinite(hp) && known && Math.abs(pos - hp) <= 3); b.disabled = st === 'unavailable'; return; }
        // commandes seules, sans retour d'état : toujours cliquables (l'état affiché n'est que supposé)
        if (this._cmdOnly()) { b.disabled = false; return; }
        const ea = c.invert_buttons && !sensed ? { open: 'close', close: 'open' }[a] || a : a;
        b.disabled = st === 'unavailable' || ((!assumed || posKnown) && ((ea === 'open' && (bst === 'open' || bst === 'opening')) || (ea === 'close' && (bst === 'closed' || bst === 'closing'))));
      });
      const rng = (id, show, label, val) => {
        const el = r.getElementById(id), inp = el.querySelector('input');
        el.classList.toggle('hide', !show);
        el.querySelector('span').textContent = label;
        if (this._root.activeElement !== inp) inp.value = String(Math.round(val));
      };
      rng('shpos', isCover && !this._tiltOnly && known && (this._tiltDriven ? has(128) : has(4)) && c.show_slider !== false && st !== 'unavailable', this._blindOnly ? this._l('blind') : this._l('position'), this._blindOnly ? blPos : pos);
      // en inclinaison seule le curseur reste affiché même si la cover ne remonte pas current_tilt_position
      rng('shtilt', isCover && (this.kind === 'venetian_blind' || this.kind === 'awning') && (this._tiltOnly || !isNaN(tilt)) && (this._tiltOnly ? tiltSet : has(128)) && c.show_slider !== false && st !== 'unavailable', this._l('tilt'), isNaN(tilt) ? 0 : tilt);

      const pw = this._watts(c.entity_power);
      const V = {
        position: [known && st !== 'unavailable' && !this._blindOnly && !this._tiltOnly, this._fmt(pos, 0), '%'],
        tilt: [(this.kind === 'venetian_blind' || this.kind === 'awning') && !isNaN(tilt), this._fmt(tilt, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), isNaN(pw) ? '' : 'W'],
        blind: [this.kind === 'roof_window' && blS, this._fmt(blPos, 0), '%'],
        rain: [['pergola', 'roof_window', 'awning', 'double_awning'].includes(this.kind) && rainS, this._t(rain ? 'yes' : 'no'), ''],
        wind: [(this.kind === 'pergola' || this._aw) && c.entity_wind, this._fmt(this._num(c.entity_wind), 0), this._unit(c.entity_wind, 'km/h')],
        lux: [this._aw && c.entity_lux, this._fmt(this._num(c.entity_lux), 0), this._unit(c.entity_lux, 'lx')],
        temperature: [this._aw && c.entity_temperature, this._fmt(this._num(c.entity_temperature), 1), this._unit(c.entity_temperature, '°C')],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', k === 'wind' && windy);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceShutterCardEditor extends HTMLElement {
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
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', 'cover'), ent('entity_open', ['button', 'input_button', 'script', 'switch', 'scene', 'input_boolean', 'cover']), ent('entity_close', ['button', 'input_button', 'script', 'switch', 'scene', 'input_boolean', 'cover']), ent('entity_stop', ['button', 'input_button', 'script', 'switch', 'scene', 'input_boolean', 'cover']), ent('entity_half', ['button', 'input_button', 'script', 'switch', 'scene', 'input_boolean', 'cover']),
        { name: 'half_position', selector: { number: { min: 1, max: 99, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_state'), ent('entity_position', 'sensor'), ent('entity_power', 'sensor'), ent('sun_entity', 'sun'),
        ...(this.kind === 'pergola' ? [ent('entity_rain'), ent('entity_light'), ent('entity_wind', 'sensor')] : []),
        ...(this.kind === 'awning' || this.kind === 'double_awning' ? [ent('entity_wind', 'sensor'), ent('entity_rain'), ent('entity_light'), ent('entity_lux', 'sensor'), ent('entity_temperature', 'sensor'),
          { name: 'wind_max', selector: { number: { min: 5, max: 120, step: 1, mode: 'box', unit_of_measurement: 'km/h' } } }] : []),
        ...(this.kind === 'roof_window' ? [ent('entity_blind', 'cover'), ent('entity_rain')] : []),
        { type: 'grid', name: '', schema: [
          { name: 'color', selector: { text: {} } },
          { name: 'travel_time', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
        ] },
        bool('invert', false),
        bool('invert_buttons', false),
        ...(this.kind === 'sliding_curtain' ? [{ name: 'panels', selector: { number: { min: 1, max: 2, step: 1, mode: 'box' } } }, { name: 'side', selector: { select: { mode: 'dropdown', options: ['left', 'right'] } } }] : []),
        ...(this.kind === 'venetian_blind' ? [bool('tilt_only', false), bool('tilt_from_position', false), { name: 'tilt_presets', selector: { object: {} } }] : []),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_position'),
          ...(this.kind === 'venetian_blind' || this.kind === 'awning' ? [bool('show_tilt')] : []), bool('show_power'),
          ...(this.kind === 'pergola' ? [bool('show_rain'), bool('show_wind')] : []),
          ...(this.kind === 'awning' || this.kind === 'double_awning' ? [bool('show_rain'), bool('show_wind'), bool('show_lux'), bool('show_temperature')] : []),
          ...(this.kind === 'roof_window' ? [bool('show_blind'), bool('show_rain')] : []), bool('show_since'), bool('animations'),
        ] },
      ];
      // « color » a le libellé « couleur de la lumière » pour les lampes : ici, couleur du volet
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'color' ? (this.kind === 'pergola' ? 'louvre_color' : this.kind === 'awning' || this.kind === 'double_awning' || this.kind === 'sliding_curtain' ? 'fabric_color' : 'shutter_color') : s.name === 'invert' ? 'invert_position' : s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace(/_/g, '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceShutterCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        return { entity: ids.find((i) => i.startsWith('cover.') && K.re.test(i)) || ids.find((i) => i.startsWith('cover.')) || '' };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceShutterCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l][kind]])), preview: true,
      description: kind === 'sliding_curtain' ? `Animated sliding curtains: one or two fabric panels, open / stop / close controls, position, and day / night view.` : kind === 'double_awning' ? `${T.fr[kind]} animé : toile des deux côtés, bras articulés, ombre, vent fort, pluie, éclairage LED et vue jour / nuit.` : kind === 'awning' ? `${T.fr[kind]} animé : toile qui se déploie, bras articulés, ombre sur la terrasse, vent fort, pluie, éclairage LED et vue jour / nuit.` : kind === 'roof_window' ? `${T.fr[kind]} animée : ouvrant à rotation, volet roulant extérieur, pluie et vue jour / nuit.` : kind === 'pergola' ? `${T.fr[kind]} animée : lames orientables, pluie, éclairage LED et vue jour / nuit.` : `${T.fr[kind]} animé : position, inclinaison, mouvement et vue jour / nuit.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
