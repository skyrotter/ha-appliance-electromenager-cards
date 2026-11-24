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

  const T = {
    "en": {
      "pressure": "Pressure",
      "st_display_rect": "Digital display (rectangle)",
      "st_display_round": "Digital display (round)",
      "name": "Room climate",
      "comfort": "Comfortable",
      "cool": "Cool",
      "warm": "Warm",
      "humid": "Humid",
      "dry": "Dry",
      "unavailable": "Unavailable",
      "too_hot": "Too hot",
      "too_cold": "Too cold",
      "too_humid": "Too humid",
      "too_dry": "Too dry",
      "mold_risk": "Mould risk",
      "condensation_risk": "Condensation risk",
      "ventilate": "Air the room",
      "air_dry": "outside air holds less water (absolute humidity)",
      "air_cool": "outside air is cooler",
      "window_open": "Window open",
      "window_guess": "Window open? (sudden temperature drop)",
      "window_drop_note": "Window open? −{n}° in 15 min",
      "battery_low": "Low battery",
      "outdoor": "Outside",
      "dew_point": "Dew point",
      "dew_point_room": "Room dew point",
      "trend_1h": "Change over the last hour",
      "stable": "stable",
      "history": "History",
      "close": "Close",
      "both": "Both",
      "temperature": "Temperature",
      "humidity": "Humidity",
      "h24": "24 h",
      "d7": "7 days",
      "d30": "30 days",
      "current": "Now",
      "average": "Average",
      "min": "Min",
      "max": "Max",
      "loading": "Loading…",
      "no_history": "No history available",
      "ideal_zone": "Ideal zone",
      "avg_short": "Avg",
      "indoor": "Indoor",
      "st_standard": "Standard",
      "st_gauge": "Gauge",
      "st_gradient": "Gradient",
      "st_minimal": "Minimal",
      "st_lcd": "Weather station",
      "st_tile": "Mini tile",
      "st_thermometer": "Large thermometer",
      "st_gradient_ring": "Gradient ring",
      "st_double_ring": "Double ring",
      "st_dial": "Needle dial",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Heating",
      "st_bars": "Bars",
      "lcd_auto": "Automatic (green by day, blue in dark mode)",
      "lcd_green": "Green",
      "lcd_blue": "Blue",
      "lcd_amber": "Amber",
      "tap_history": "History pop-up",
      "tap_more_info": "Entity details",
      "tap_navigate": "Open a page",
      "tap_none": "Nothing",
      "target": "Target",
      "thermostat_off": "Thermostat off",
      "heating": "heating",
      "cooling": "cooling",
      "compare": "Compare",
      "yesterday": "Yesterday",
      "previous": "Previous period",
      "fan_mode": "Fan mode",
      "preset_mode": "Preset"
    },
    "cs": {
      "pressure": "Tlak",
      "st_display_rect": "Digitální displej (obdélníkový)",
      "st_display_round": "Digitální displej (kulatý)",
      "name": "Klima v místnosti",
      "comfort": "Příjemně",
      "cool": "Chladno",
      "warm": "Teplo",
      "humid": "Vlhko",
      "dry": "Sucho",
      "unavailable": "Nedostupné",
      "too_hot": "Příliš horko",
      "too_cold": "Příliš chladno",
      "too_humid": "Příliš vlhko",
      "too_dry": "Příliš sucho",
      "mold_risk": "Riziko plísně",
      "condensation_risk": "Riziko kondenzace",
      "ventilate": "Vyvětrejte",
      "air_dry": "venkovní vzduch obsahuje méně vody (absolutní vlhkost)",
      "air_cool": "venkovní vzduch je chladnější",
      "window_open": "Otevřené okno",
      "window_guess": "Otevřené okno? (náhlý pokles teploty)",
      "window_drop_note": "Otevřené okno? −{n}° za 15 min",
      "battery_low": "Slabá baterie",
      "outdoor": "Venku",
      "dew_point": "Rosný bod",
      "dew_point_room": "Rosný bod místnosti",
      "trend_1h": "Změna za poslední hodinu",
      "stable": "stabilní",
      "history": "Historie",
      "close": "Zavřít",
      "both": "Obojí",
      "temperature": "Teplota",
      "humidity": "Vlhkost",
      "h24": "24 h",
      "d7": "7 dní",
      "d30": "30 dní",
      "current": "Nyní",
      "average": "Průměr",
      "min": "Min",
      "max": "Max",
      "loading": "Načítání…",
      "no_history": "Historie není k dispozici",
      "ideal_zone": "Ideální zóna",
      "avg_short": "Prům.",
      "indoor": "Uvnitř",
      "st_standard": "Standardní",
      "st_gauge": "Ručičkový",
      "st_gradient": "Přechod",
      "st_minimal": "Minimální",
      "st_lcd": "Meteostanice",
      "st_tile": "Mini dlaždice",
      "st_thermometer": "Velký teploměr",
      "st_gradient_ring": "Barevný prstenec",
      "st_double_ring": "Dvojitý prstenec",
      "st_dial": "Ručičkový číselník",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Topí",
      "st_bars": "Sloupce",
      "lcd_auto": "Automaticky (ve dne zelená, v tmavém režimu modrá)",
      "lcd_green": "Zelená",
      "lcd_blue": "Modrá",
      "lcd_amber": "Jantarová",
      "tap_history": "Okno s historií",
      "tap_more_info": "Detail entity",
      "tap_navigate": "Otevřít stránku",
      "tap_none": "Nic",
      "target": "Cíl",
      "thermostat_off": "Termostat vypnut",
      "heating": "topí",
      "cooling": "chladí",
      "compare": "Porovnat",
      "yesterday": "Včera",
      "previous": "Předchozí období",
      "fan_mode": "Režim ventilátoru",
      "preset_mode": "Předvolba"
    },
    "da": {
      "pressure": "Lufttryk",
      "st_display_rect": "Digitalt display (rektangulært)",
      "st_display_round": "Digitalt display (rundt)",
      "name": "Indeklima",
      "comfort": "Behageligt",
      "cool": "Køligt",
      "warm": "Varmt",
      "humid": "Fugtigt",
      "dry": "Tørt",
      "unavailable": "Utilgængelig",
      "too_hot": "For varmt",
      "too_cold": "For koldt",
      "too_humid": "For fugtigt",
      "too_dry": "For tørt",
      "mold_risk": "Skimmelrisiko",
      "condensation_risk": "Risiko for kondens",
      "ventilate": "Luft ud",
      "air_dry": "udeluften indeholder mindre vand (absolut fugtighed)",
      "air_cool": "udeluften er køligere",
      "window_open": "Vindue åbent",
      "window_guess": "Vindue åbent? (pludseligt temperaturfald)",
      "window_drop_note": "Vindue åbent? −{n}° på 15 min",
      "battery_low": "Lavt batteri",
      "outdoor": "Ude",
      "dew_point": "Dugpunkt",
      "dew_point_room": "Dugpunkt i rummet",
      "trend_1h": "Ændring den seneste time",
      "stable": "stabil",
      "history": "Historik",
      "close": "Luk",
      "both": "Begge",
      "temperature": "Temperatur",
      "humidity": "Luftfugtighed",
      "h24": "24 t",
      "d7": "7 dage",
      "d30": "30 dage",
      "current": "Nu",
      "average": "Gennemsnit",
      "min": "Min",
      "max": "Maks",
      "loading": "Indlæser…",
      "no_history": "Ingen historik tilgængelig",
      "ideal_zone": "Ideel zone",
      "avg_short": "Gns.",
      "indoor": "Inde",
      "st_standard": "Standard",
      "st_gauge": "Måler",
      "st_gradient": "Farveforløb",
      "st_minimal": "Minimal",
      "st_lcd": "Vejrstation",
      "st_tile": "Miniflise",
      "st_thermometer": "Stort termometer",
      "st_gradient_ring": "Ring med farveforløb",
      "st_double_ring": "Dobbelt ring",
      "st_dial": "Viserskive",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Varmer",
      "st_bars": "Søjler",
      "lcd_auto": "Automatisk (grøn om dagen, blå i mørk tilstand)",
      "lcd_green": "Grøn",
      "lcd_blue": "Blå",
      "lcd_amber": "Rav",
      "tap_history": "Historik-pop-up",
      "tap_more_info": "Entitetsdetaljer",
      "tap_navigate": "Åbn en side",
      "tap_none": "Intet",
      "target": "Mål",
      "thermostat_off": "Termostat slukket",
      "heating": "varmer",
      "cooling": "køler",
      "compare": "Sammenlign",
      "yesterday": "I går",
      "previous": "Forrige periode",
      "fan_mode": "Ventilatortilstand",
      "preset_mode": "Forvalg"
    },
    "de": {
      "pressure": "Luftdruck",
      "st_display_rect": "Digitalanzeige (rechteckig)",
      "st_display_round": "Digitalanzeige (rund)",
      "name": "Raumklima",
      "comfort": "Behaglich",
      "cool": "Kühl",
      "warm": "Warm",
      "humid": "Feucht",
      "dry": "Trocken",
      "unavailable": "Nicht verfügbar",
      "too_hot": "Zu warm",
      "too_cold": "Zu kalt",
      "too_humid": "Zu feucht",
      "too_dry": "Zu trocken",
      "mold_risk": "Schimmelgefahr",
      "condensation_risk": "Kondensationsgefahr",
      "ventilate": "Lüften",
      "air_dry": "Außenluft enthält weniger Wasser (absolute Feuchte)",
      "air_cool": "Außenluft ist kühler",
      "window_open": "Fenster offen",
      "window_guess": "Fenster offen? (plötzlicher Temperaturabfall)",
      "window_drop_note": "Fenster offen? −{n}° in 15 min",
      "battery_low": "Batterie schwach",
      "outdoor": "Außen",
      "dew_point": "Taupunkt",
      "dew_point_room": "Taupunkt Raum",
      "trend_1h": "Änderung in der letzten Stunde",
      "stable": "stabil",
      "history": "Verlauf",
      "close": "Schließen",
      "both": "Beide",
      "temperature": "Temperatur",
      "humidity": "Luftfeuchtigkeit",
      "h24": "24 h",
      "d7": "7 Tage",
      "d30": "30 Tage",
      "current": "Aktuell",
      "average": "Mittelwert",
      "min": "Min",
      "max": "Max",
      "loading": "Wird geladen…",
      "no_history": "Kein Verlauf verfügbar",
      "ideal_zone": "Idealbereich",
      "avg_short": "Mittel",
      "indoor": "Innen",
      "st_standard": "Standard",
      "st_gauge": "Anzeige",
      "st_gradient": "Verlauf",
      "st_minimal": "Minimal",
      "st_lcd": "Wetterstation",
      "st_tile": "Mini-Kachel",
      "st_thermometer": "Großes Thermometer",
      "st_gradient_ring": "Farbverlaufsring",
      "st_double_ring": "Doppelring",
      "st_dial": "Zeigerinstrument",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Heizt",
      "st_bars": "Balken",
      "lcd_auto": "Automatisch (tagsüber grün, dunkel blau)",
      "lcd_green": "Grün",
      "lcd_blue": "Blau",
      "lcd_amber": "Bernstein",
      "tap_history": "Verlaufs-Pop-up",
      "tap_more_info": "Entitätsdetails",
      "tap_navigate": "Seite öffnen",
      "tap_none": "Nichts",
      "target": "Soll",
      "thermostat_off": "Thermostat aus",
      "heating": "heizt",
      "cooling": "kühlt",
      "compare": "Vergleichen",
      "yesterday": "Gestern",
      "previous": "Vorheriger Zeitraum",
      "fan_mode": "Lüftermodus",
      "preset_mode": "Voreinstellung"
    },
    "es": {
      "pressure": "Presión",
      "st_display_rect": "Pantalla digital (rectangular)",
      "st_display_round": "Pantalla digital (redonda)",
      "name": "Clima de la habitación",
      "comfort": "Confortable",
      "cool": "Fresco",
      "warm": "Cálido",
      "humid": "Húmedo",
      "dry": "Seco",
      "unavailable": "No disponible",
      "too_hot": "Demasiado calor",
      "too_cold": "Demasiado frío",
      "too_humid": "Demasiada humedad",
      "too_dry": "Demasiado seco",
      "mold_risk": "Riesgo de moho",
      "condensation_risk": "Riesgo de condensación",
      "ventilate": "Ventila la habitación",
      "air_dry": "el aire exterior contiene menos agua (humedad absoluta)",
      "air_cool": "el aire exterior está más fresco",
      "window_open": "Ventana abierta",
      "window_guess": "¿Ventana abierta? (caída brusca de temperatura)",
      "window_drop_note": "¿Ventana abierta? −{n}° en 15 min",
      "battery_low": "Batería baja",
      "outdoor": "Exterior",
      "dew_point": "Punto de rocío",
      "dew_point_room": "Punto de rocío de la habitación",
      "trend_1h": "Variación en la última hora",
      "stable": "estable",
      "history": "Historial",
      "close": "Cerrar",
      "both": "Ambos",
      "temperature": "Temperatura",
      "humidity": "Humedad",
      "h24": "24 h",
      "d7": "7 días",
      "d30": "30 días",
      "current": "Ahora",
      "average": "Media",
      "min": "Mín.",
      "max": "Máx.",
      "loading": "Cargando…",
      "no_history": "Sin historial disponible",
      "ideal_zone": "Zona ideal",
      "avg_short": "Media",
      "indoor": "Interior",
      "st_standard": "Estándar",
      "st_gauge": "Indicador",
      "st_gradient": "Degradado",
      "st_minimal": "Mínimo",
      "st_lcd": "Estación meteorológica",
      "st_tile": "Mini icono",
      "st_thermometer": "Termómetro grande",
      "st_gradient_ring": "Anillo degradado",
      "st_double_ring": "Doble anillo",
      "st_dial": "Dial de aguja",
      "st_neon": "Neón",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Calentando",
      "st_bars": "Barras",
      "lcd_auto": "Automático (verde de día, azul en modo oscuro)",
      "lcd_green": "Verde",
      "lcd_blue": "Azul",
      "lcd_amber": "Ámbar",
      "tap_history": "Ventana de historial",
      "tap_more_info": "Detalles de la entidad",
      "tap_navigate": "Abrir una página",
      "tap_none": "Nada",
      "target": "Objetivo",
      "thermostat_off": "Termostato apagado",
      "heating": "calefacción",
      "cooling": "refrigeración",
      "compare": "Comparar",
      "yesterday": "Ayer",
      "previous": "Periodo anterior",
      "fan_mode": "Modo de ventilador",
      "preset_mode": "Preajuste"
    },
    "fr": {
      "pressure": "Pression",
      "st_display_rect": "Afficheur numérique (rectangle)",
      "st_display_round": "Afficheur numérique (rond)",
      "name": "Climat pièce",
      "comfort": "Confort",
      "cool": "Frais",
      "warm": "Chaud",
      "humid": "Humide",
      "dry": "Sec",
      "unavailable": "Indisponible",
      "too_hot": "Trop chaud",
      "too_cold": "Trop froid",
      "too_humid": "Trop humide",
      "too_dry": "Trop sec",
      "mold_risk": "Risque de moisissure",
      "condensation_risk": "Risque de condensation",
      "ventilate": "Aérer",
      "air_dry": "l'air extérieur contient moins d'eau (humidité absolue)",
      "air_cool": "l'air extérieur est plus frais",
      "window_open": "Fenêtre ouverte",
      "window_guess": "Fenêtre ouverte ? (chute brutale de température)",
      "window_drop_note": "Fenêtre ouverte ? −{n}° en 15 min",
      "battery_low": "Batterie faible",
      "outdoor": "Ext.",
      "dew_point": "Rosée",
      "dew_point_room": "Rosée de la pièce",
      "trend_1h": "Évolution sur la dernière heure",
      "stable": "stable",
      "history": "Historique",
      "close": "Fermer",
      "both": "Les deux",
      "temperature": "Température",
      "humidity": "Humidité",
      "h24": "24 h",
      "d7": "7 jours",
      "d30": "30 jours",
      "current": "Actuelle",
      "average": "Moyenne",
      "min": "Min",
      "max": "Max",
      "loading": "Chargement…",
      "no_history": "Aucun historique disponible",
      "ideal_zone": "Zone idéale",
      "avg_short": "Moy",
      "indoor": "Intérieur",
      "st_standard": "Standard",
      "st_gauge": "Jauge",
      "st_gradient": "Dégradé",
      "st_minimal": "Minimal",
      "st_lcd": "Station météo",
      "st_tile": "Tuile mini",
      "st_thermometer": "Grand thermomètre",
      "st_gradient_ring": "Anneau dégradé",
      "st_double_ring": "Double anneau",
      "st_dial": "Cadran à aiguilles",
      "st_neon": "Néon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "En chauffe",
      "st_bars": "Barres",
      "lcd_auto": "Automatique (vert le jour, bleu en sombre)",
      "lcd_green": "Vert",
      "lcd_blue": "Bleu",
      "lcd_amber": "Ambre",
      "tap_history": "Pop-up d'historique",
      "tap_more_info": "Fiche de l'entité",
      "tap_navigate": "Ouvrir une page",
      "tap_none": "Rien",
      "target": "Consigne",
      "thermostat_off": "Thermostat éteint",
      "heating": "chauffe",
      "cooling": "refroidit",
      "compare": "Comparer",
      "yesterday": "Hier",
      "previous": "Période précédente",
      "fan_mode": "Ventilation",
      "preset_mode": "Préréglage"
    },
    "hu": {
      "pressure": "Légnyomás",
      "st_display_rect": "Digitális kijelző (téglalap)",
      "st_display_round": "Digitális kijelző (kerek)",
      "name": "Szobaklíma",
      "comfort": "Kellemes",
      "cool": "Hűvös",
      "warm": "Meleg",
      "humid": "Párás",
      "dry": "Száraz",
      "unavailable": "Nem elérhető",
      "too_hot": "Túl meleg",
      "too_cold": "Túl hideg",
      "too_humid": "Túl párás",
      "too_dry": "Túl száraz",
      "mold_risk": "Penészveszély",
      "condensation_risk": "Párakondenzáció veszélye",
      "ventilate": "Szellőztess",
      "air_dry": "a kinti levegő kevesebb vizet tartalmaz (abszolút páratartalom)",
      "air_cool": "a kinti levegő hűvösebb",
      "window_open": "Ablak nyitva",
      "window_guess": "Ablak nyitva? (hirtelen hőmérséklet-esés)",
      "window_drop_note": "Ablak nyitva? −{n}° 15 perc alatt",
      "battery_low": "Alacsony akkuszint",
      "outdoor": "Kint",
      "dew_point": "Harmatpont",
      "dew_point_room": "Szoba harmatpont",
      "trend_1h": "Változás az utolsó órában",
      "stable": "stabil",
      "history": "Előzmények",
      "close": "Bezárás",
      "both": "Mindkettő",
      "temperature": "Hőmérséklet",
      "humidity": "Páratartalom",
      "h24": "24 ó",
      "d7": "7 nap",
      "d30": "30 nap",
      "current": "Most",
      "average": "Átlag",
      "min": "Min",
      "max": "Max",
      "loading": "Betöltés…",
      "no_history": "Nincs elérhető előzmény",
      "ideal_zone": "Ideális zóna",
      "avg_short": "Átl",
      "indoor": "Bent",
      "st_standard": "Standard",
      "st_gauge": "Műszer",
      "st_gradient": "Gradiens",
      "st_minimal": "Minimál",
      "st_lcd": "Időjárás-állomás",
      "st_tile": "Mini csempe",
      "st_thermometer": "Nagy hőmérő",
      "st_gradient_ring": "Gradiens gyűrű",
      "st_double_ring": "Dupla gyűrű",
      "st_dial": "Mutatós",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Fűtés",
      "st_bars": "Sávok",
      "lcd_auto": "Automatikus (zöld nappal, kék sötét módban)",
      "lcd_green": "Zöld",
      "lcd_blue": "Kék",
      "lcd_amber": "Borostyán",
      "tap_history": "Előzmények felugró",
      "tap_more_info": "Entitás részletei",
      "tap_navigate": "Oldal megnyitása",
      "tap_none": "Semmi",
      "target": "Cél",
      "thermostat_off": "Termosztát ki",
      "heating": "fűtés",
      "cooling": "hűtés",
      "compare": "Összehasonlítás",
      "yesterday": "Tegnap",
      "previous": "Előző időszak",
      "fan_mode": "Ventilátor mód",
      "preset_mode": "Előbeállítás"
    },
    "it": {
      "pressure": "Pressione",
      "st_display_rect": "Display digitale (rettangolare)",
      "st_display_round": "Display digitale (rotondo)",
      "name": "Clima della stanza",
      "comfort": "Confortevole",
      "cool": "Fresco",
      "warm": "Caldo",
      "humid": "Umido",
      "dry": "Secco",
      "unavailable": "Non disponibile",
      "too_hot": "Troppo caldo",
      "too_cold": "Troppo freddo",
      "too_humid": "Troppo umido",
      "too_dry": "Troppo secco",
      "mold_risk": "Rischio muffa",
      "condensation_risk": "Rischio condensa",
      "ventilate": "Arieggia",
      "air_dry": "l'aria esterna contiene meno acqua (umidità assoluta)",
      "air_cool": "l'aria esterna è più fresca",
      "window_open": "Finestra aperta",
      "window_guess": "Finestra aperta? (calo improvviso di temperatura)",
      "window_drop_note": "Finestra aperta? −{n}° in 15 min",
      "battery_low": "Batteria scarica",
      "outdoor": "Est.",
      "dew_point": "Rugiada",
      "dew_point_room": "Rugiada della stanza",
      "trend_1h": "Andamento nell'ultima ora",
      "stable": "stabile",
      "history": "Storico",
      "close": "Chiudi",
      "both": "Entrambi",
      "temperature": "Temperatura",
      "humidity": "Umidità",
      "h24": "24 h",
      "d7": "7 giorni",
      "d30": "30 giorni",
      "current": "Attuale",
      "average": "Media",
      "min": "Min",
      "max": "Max",
      "loading": "Caricamento…",
      "no_history": "Nessuno storico disponibile",
      "ideal_zone": "Zona ideale",
      "avg_short": "Med",
      "indoor": "Interno",
      "st_standard": "Standard",
      "st_gauge": "Indicatore",
      "st_gradient": "Sfumato",
      "st_minimal": "Minimale",
      "st_lcd": "Stazione meteo",
      "st_tile": "Mini riquadro",
      "st_thermometer": "Grande termometro",
      "st_gradient_ring": "Anello sfumato",
      "st_double_ring": "Doppio anello",
      "st_dial": "Quadrante a lancette",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "In riscaldamento",
      "st_bars": "Barre",
      "lcd_auto": "Automatico (verde di giorno, blu in modalità scura)",
      "lcd_green": "Verde",
      "lcd_blue": "Blu",
      "lcd_amber": "Ambra",
      "tap_history": "Pop-up dello storico",
      "tap_more_info": "Scheda dell'entità",
      "tap_navigate": "Apri una pagina",
      "tap_none": "Niente",
      "target": "Obiettivo",
      "thermostat_off": "Termostato spento",
      "heating": "riscalda",
      "cooling": "raffresca",
      "compare": "Confronta",
      "yesterday": "Ieri",
      "previous": "Periodo precedente",
      "fan_mode": "Ventilazione",
      "preset_mode": "Preimpostazione"
    },
    "nb": {
      "pressure": "Lufttrykk",
      "st_display_rect": "Digitalt display (rektangulært)",
      "st_display_round": "Digitalt display (rundt)",
      "name": "Romklima",
      "comfort": "Komfortabelt",
      "cool": "Kjølig",
      "warm": "Varmt",
      "humid": "Fuktig",
      "dry": "Tørt",
      "unavailable": "Utilgjengelig",
      "too_hot": "For varmt",
      "too_cold": "For kaldt",
      "too_humid": "For fuktig",
      "too_dry": "For tørt",
      "mold_risk": "Fare for mugg",
      "condensation_risk": "Fare for kondens",
      "ventilate": "Luft ut",
      "air_dry": "uteluften inneholder mindre vann (absolutt fuktighet)",
      "air_cool": "uteluften er kjøligere",
      "window_open": "Vindu åpent",
      "window_guess": "Vindu åpent? (brått temperaturfall)",
      "window_drop_note": "Vindu åpent? −{n}° på 15 min",
      "battery_low": "Lavt batteri",
      "outdoor": "Ute",
      "dew_point": "Duggpunkt",
      "dew_point_room": "Duggpunkt rom",
      "trend_1h": "Endring siste time",
      "stable": "stabil",
      "history": "Historikk",
      "close": "Lukk",
      "both": "Begge",
      "temperature": "Temperatur",
      "humidity": "Fuktighet",
      "h24": "24 t",
      "d7": "7 dager",
      "d30": "30 dager",
      "current": "Nå",
      "average": "Gjennomsnitt",
      "min": "Min",
      "max": "Maks",
      "loading": "Laster…",
      "no_history": "Ingen historikk tilgjengelig",
      "ideal_zone": "Ideell sone",
      "avg_short": "Snitt",
      "indoor": "Inne",
      "st_standard": "Standard",
      "st_gauge": "Måler",
      "st_gradient": "Gradient",
      "st_minimal": "Minimal",
      "st_lcd": "Værstasjon",
      "st_tile": "Minifliser",
      "st_thermometer": "Stort termometer",
      "st_gradient_ring": "Gradientring",
      "st_double_ring": "Dobbel ring",
      "st_dial": "Viserinstrument",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Varmer",
      "st_bars": "Søyler",
      "lcd_auto": "Automatisk (grønn om dagen, blå i mørk modus)",
      "lcd_green": "Grønn",
      "lcd_blue": "Blå",
      "lcd_amber": "Rav",
      "tap_history": "Historikk-popup",
      "tap_more_info": "Enhetsdetaljer",
      "tap_navigate": "Åpne en side",
      "tap_none": "Ingenting",
      "target": "Mål",
      "thermostat_off": "Termostat av",
      "heating": "varmer",
      "cooling": "kjøler",
      "compare": "Sammenlign",
      "yesterday": "I går",
      "previous": "Forrige periode",
      "fan_mode": "Viftemodus",
      "preset_mode": "Forhåndsinnstilling"
    },
    "nl": {
      "pressure": "Luchtdruk",
      "st_display_rect": "Digitaal display (rechthoekig)",
      "st_display_round": "Digitaal display (rond)",
      "name": "Binnenklimaat",
      "comfort": "Comfortabel",
      "cool": "Koel",
      "warm": "Warm",
      "humid": "Vochtig",
      "dry": "Droog",
      "unavailable": "Niet beschikbaar",
      "too_hot": "Te warm",
      "too_cold": "Te koud",
      "too_humid": "Te vochtig",
      "too_dry": "Te droog",
      "mold_risk": "Schimmelrisico",
      "condensation_risk": "Condensrisico",
      "ventilate": "Ventileer",
      "air_dry": "buitenlucht bevat minder water (absolute vochtigheid)",
      "air_cool": "buitenlucht is koeler",
      "window_open": "Raam open",
      "window_guess": "Raam open? (plotselinge temperatuurdaling)",
      "window_drop_note": "Raam open? −{n}° in 15 min",
      "battery_low": "Batterij bijna leeg",
      "outdoor": "Buiten",
      "dew_point": "Dauwpunt",
      "dew_point_room": "Dauwpunt kamer",
      "trend_1h": "Verandering in het laatste uur",
      "stable": "stabiel",
      "history": "Geschiedenis",
      "close": "Sluiten",
      "both": "Beide",
      "temperature": "Temperatuur",
      "humidity": "Luchtvochtigheid",
      "h24": "24 u",
      "d7": "7 dagen",
      "d30": "30 dagen",
      "current": "Nu",
      "average": "Gemiddeld",
      "min": "Min",
      "max": "Max",
      "loading": "Laden…",
      "no_history": "Geen geschiedenis beschikbaar",
      "ideal_zone": "Ideale zone",
      "avg_short": "Gem",
      "indoor": "Binnen",
      "st_standard": "Standaard",
      "st_gauge": "Meter",
      "st_gradient": "Verloop",
      "st_minimal": "Minimaal",
      "st_lcd": "Weerstation",
      "st_tile": "Mini-tegel",
      "st_thermometer": "Grote thermometer",
      "st_gradient_ring": "Verloopring",
      "st_double_ring": "Dubbele ring",
      "st_dial": "Wijzerplaat",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Verwarmt",
      "st_bars": "Staven",
      "lcd_auto": "Automatisch (overdag groen, donker blauw)",
      "lcd_green": "Groen",
      "lcd_blue": "Blauw",
      "lcd_amber": "Amber",
      "tap_history": "Geschiedenis-pop-up",
      "tap_more_info": "Entiteitsdetails",
      "tap_navigate": "Pagina openen",
      "tap_none": "Niets",
      "target": "Doel",
      "thermostat_off": "Thermostaat uit",
      "heating": "verwarmt",
      "cooling": "koelt",
      "compare": "Vergelijken",
      "yesterday": "Gisteren",
      "previous": "Vorige periode",
      "fan_mode": "Ventilatormodus",
      "preset_mode": "Voorinstelling"
    },
    "pl": {
      "pressure": "Ciśnienie",
      "st_display_rect": "Wyświetlacz cyfrowy (prostokątny)",
      "st_display_round": "Wyświetlacz cyfrowy (okrągły)",
      "name": "Klimat pomieszczenia",
      "comfort": "Komfortowo",
      "cool": "Chłodno",
      "warm": "Ciepło",
      "humid": "Wilgotno",
      "dry": "Sucho",
      "unavailable": "Niedostępny",
      "too_hot": "Za gorąco",
      "too_cold": "Za zimno",
      "too_humid": "Za wilgotno",
      "too_dry": "Za sucho",
      "mold_risk": "Ryzyko pleśni",
      "condensation_risk": "Ryzyko kondensacji",
      "ventilate": "Przewietrz pomieszczenie",
      "air_dry": "powietrze na zewnątrz zawiera mniej wody (wilgotność bezwzględna)",
      "air_cool": "powietrze na zewnątrz jest chłodniejsze",
      "window_open": "Okno otwarte",
      "window_guess": "Okno otwarte? (nagły spadek temperatury)",
      "window_drop_note": "Okno otwarte? −{n}° w 15 min",
      "battery_low": "Niski poziom baterii",
      "outdoor": "Na zewnątrz",
      "dew_point": "Punkt rosy",
      "dew_point_room": "Punkt rosy pokoju",
      "trend_1h": "Zmiana w ostatniej godzinie",
      "stable": "stabilnie",
      "history": "Historia",
      "close": "Zamknij",
      "both": "Oba",
      "temperature": "Temperatura",
      "humidity": "Wilgotność",
      "h24": "24 h",
      "d7": "7 dni",
      "d30": "30 dni",
      "current": "Teraz",
      "average": "Średnia",
      "min": "Min",
      "max": "Maks",
      "loading": "Ładowanie…",
      "no_history": "Brak dostępnej historii",
      "ideal_zone": "Strefa idealna",
      "avg_short": "Śr.",
      "indoor": "Wewnątrz",
      "st_standard": "Standardowy",
      "st_gauge": "Wskaźnik",
      "st_gradient": "Gradient",
      "st_minimal": "Minimalistyczny",
      "st_lcd": "Stacja pogodowa",
      "st_tile": "Mini kafelek",
      "st_thermometer": "Duży termometr",
      "st_gradient_ring": "Pierścień gradientowy",
      "st_double_ring": "Podwójny pierścień",
      "st_dial": "Tarcza ze wskazówką",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Grzanie",
      "st_bars": "Słupki",
      "lcd_auto": "Automatycznie (zielony w dzień, niebieski w trybie ciemnym)",
      "lcd_green": "Zielony",
      "lcd_blue": "Niebieski",
      "lcd_amber": "Bursztynowy",
      "tap_history": "Okno historii",
      "tap_more_info": "Szczegóły encji",
      "tap_navigate": "Otwórz stronę",
      "tap_none": "Nic",
      "target": "Cel",
      "thermostat_off": "Termostat wyłączony",
      "heating": "grzanie",
      "cooling": "chłodzenie",
      "compare": "Porównaj",
      "yesterday": "Wczoraj",
      "previous": "Poprzedni okres",
      "fan_mode": "Tryb wentylatora",
      "preset_mode": "Preset"
    },
    "pt-BR": {
      "pressure": "Pressão",
      "st_display_rect": "Display digital (retangular)",
      "st_display_round": "Display digital (redondo)",
      "name": "Clima do cômodo",
      "comfort": "Confortável",
      "cool": "Fresco",
      "warm": "Quente",
      "humid": "Úmido",
      "dry": "Seco",
      "unavailable": "Indisponível",
      "too_hot": "Muito quente",
      "too_cold": "Muito frio",
      "too_humid": "Muito úmido",
      "too_dry": "Muito seco",
      "mold_risk": "Risco de mofo",
      "condensation_risk": "Risco de condensação",
      "ventilate": "Areje o cômodo",
      "air_dry": "o ar externo contém menos água (umidade absoluta)",
      "air_cool": "o ar externo está mais fresco",
      "window_open": "Janela aberta",
      "window_guess": "Janela aberta? (descida súbita de temperatura)",
      "window_drop_note": "Janela aberta? −{n}° em 15 min",
      "battery_low": "Bateria fraca",
      "outdoor": "Externo",
      "dew_point": "Ponto de orvalho",
      "dew_point_room": "Ponto de orvalho do cômodo",
      "trend_1h": "Variação na última hora",
      "stable": "estável",
      "history": "Histórico",
      "close": "Fechar",
      "both": "Ambos",
      "temperature": "Temperatura",
      "humidity": "Umidade",
      "h24": "24 h",
      "d7": "7 dias",
      "d30": "30 dias",
      "current": "Agora",
      "average": "Média",
      "min": "Mín.",
      "max": "Máx.",
      "loading": "Carregando…",
      "no_history": "Sem histórico disponível",
      "ideal_zone": "Zona ideal",
      "avg_short": "Méd.",
      "indoor": "Interno",
      "st_standard": "Padrão",
      "st_gauge": "Indicador",
      "st_gradient": "Gradiente",
      "st_minimal": "Mínimo",
      "st_lcd": "Estação meteorológica",
      "st_tile": "Minibloco",
      "st_thermometer": "Termômetro grande",
      "st_gradient_ring": "Anel com gradiente",
      "st_double_ring": "Anel duplo",
      "st_dial": "Mostrador de ponteiro",
      "st_neon": "Néon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Aquecendo",
      "st_bars": "Barras",
      "lcd_auto": "Automático (verde de dia, azul no modo escuro)",
      "lcd_green": "Verde",
      "lcd_blue": "Azul",
      "lcd_amber": "Âmbar",
      "tap_history": "Janela de histórico",
      "tap_more_info": "Detalhes da entidade",
      "tap_navigate": "Abrir uma página",
      "tap_none": "Nada",
      "target": "Desejada",
      "thermostat_off": "Termostato desligado",
      "heating": "aquecendo",
      "cooling": "resfriando",
      "compare": "Comparar",
      "yesterday": "Ontem",
      "previous": "Período anterior",
      "fan_mode": "Modo de ventilação",
      "preset_mode": "Padrão"
    },
    "pt-PT": {
      "pressure": "Pressão",
      "st_display_rect": "Display digital (retangular)",
      "st_display_round": "Display digital (redondo)",
      "name": "Clima da divisão",
      "comfort": "Confortável",
      "cool": "Fresco",
      "warm": "Quente",
      "humid": "Húmido",
      "dry": "Seco",
      "unavailable": "Indisponível",
      "too_hot": "Demasiado quente",
      "too_cold": "Demasiado frio",
      "too_humid": "Demasiado húmido",
      "too_dry": "Demasiado seco",
      "mold_risk": "Risco de bolor",
      "condensation_risk": "Risco de condensação",
      "ventilate": "Areje a divisão",
      "air_dry": "o ar exterior contém menos água (humidade absoluta)",
      "air_cool": "o ar exterior está mais fresco",
      "window_open": "Janela aberta",
      "window_guess": "Janela aberta? (descida súbita de temperatura)",
      "window_drop_note": "Janela aberta? −{n}° em 15 min",
      "battery_low": "Bateria fraca",
      "outdoor": "Exterior",
      "dew_point": "Ponto de orvalho",
      "dew_point_room": "Ponto de orvalho da divisão",
      "trend_1h": "Variação na última hora",
      "stable": "estável",
      "history": "Histórico",
      "close": "Fechar",
      "both": "Ambos",
      "temperature": "Temperatura",
      "humidity": "Humidade",
      "h24": "24 h",
      "d7": "7 dias",
      "d30": "30 dias",
      "current": "Agora",
      "average": "Média",
      "min": "Mín.",
      "max": "Máx.",
      "loading": "A carregar…",
      "no_history": "Sem histórico disponível",
      "ideal_zone": "Zona ideal",
      "avg_short": "Méd.",
      "indoor": "Interior",
      "st_standard": "Padrão",
      "st_gauge": "Indicador",
      "st_gradient": "Gradiente",
      "st_minimal": "Mínimo",
      "st_lcd": "Estação meteorológica",
      "st_tile": "Minibloco",
      "st_thermometer": "Termómetro grande",
      "st_gradient_ring": "Anel com gradiente",
      "st_double_ring": "Anel duplo",
      "st_dial": "Mostrador de ponteiro",
      "st_neon": "Néon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "A aquecer",
      "st_bars": "Barras",
      "lcd_auto": "Automático (verde de dia, azul no modo escuro)",
      "lcd_green": "Verde",
      "lcd_blue": "Azul",
      "lcd_amber": "Âmbar",
      "tap_history": "Janela de histórico",
      "tap_more_info": "Detalhes da entidade",
      "tap_navigate": "Abrir uma página",
      "tap_none": "Nada",
      "target": "Pretendida",
      "thermostat_off": "Termóstato desligado",
      "heating": "a aquecer",
      "cooling": "a arrefecer",
      "compare": "Comparar",
      "yesterday": "Ontem",
      "previous": "Período anterior",
      "fan_mode": "Modo de ventilação",
      "preset_mode": "Predefinição"
    },
    "ro": {
      "pressure": "Presiune",
      "st_display_rect": "Afișaj digital (dreptunghiular)",
      "st_display_round": "Afișaj digital (rotund)",
      "name": "Climat cameră",
      "comfort": "Confortabil",
      "cool": "Răcoare",
      "warm": "Cald",
      "humid": "Umed",
      "dry": "Uscat",
      "unavailable": "Indisponibil",
      "too_hot": "Prea cald",
      "too_cold": "Prea frig",
      "too_humid": "Prea umed",
      "too_dry": "Prea uscat",
      "mold_risk": "Risc de mucegai",
      "condensation_risk": "Risc de condens",
      "ventilate": "Aerisiți",
      "air_dry": "aerul de afară conține mai puțină apă (umiditate absolută)",
      "air_cool": "aerul de afară este mai răcoros",
      "window_open": "Fereastră deschisă",
      "window_guess": "Fereastră deschisă? (scădere bruscă a temperaturii)",
      "window_drop_note": "Fereastră deschisă? −{n}° în 15 min",
      "battery_low": "Baterie descărcată",
      "outdoor": "Afară",
      "dew_point": "Punct de rouă",
      "dew_point_room": "Punct de rouă cameră",
      "trend_1h": "Variație în ultima oră",
      "stable": "stabil",
      "history": "Istoric",
      "close": "Închide",
      "both": "Ambele",
      "temperature": "Temperatură",
      "humidity": "Umiditate",
      "h24": "24 h",
      "d7": "7 zile",
      "d30": "30 de zile",
      "current": "Acum",
      "average": "Medie",
      "min": "Min",
      "max": "Max",
      "loading": "Se încarcă…",
      "no_history": "Niciun istoric disponibil",
      "ideal_zone": "Zonă ideală",
      "avg_short": "Med",
      "indoor": "Interior",
      "st_standard": "Standard",
      "st_gauge": "Indicator",
      "st_gradient": "Degradeu",
      "st_minimal": "Minimal",
      "st_lcd": "Stație meteo",
      "st_tile": "Placă mini",
      "st_thermometer": "Termometru mare",
      "st_gradient_ring": "Inel degradeu",
      "st_double_ring": "Inel dublu",
      "st_dial": "Cadran cu ace",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Încălzește",
      "st_bars": "Bare",
      "lcd_auto": "Automat (verde ziua, albastru în modul întunecat)",
      "lcd_green": "Verde",
      "lcd_blue": "Albastru",
      "lcd_amber": "Chihlimbar",
      "tap_history": "Fereastră istoric",
      "tap_more_info": "Detalii entitate",
      "tap_navigate": "Deschide o pagină",
      "tap_none": "Nimic",
      "target": "Setat",
      "thermostat_off": "Termostat oprit",
      "heating": "încălzește",
      "cooling": "răcește",
      "compare": "Compară",
      "yesterday": "Ieri",
      "previous": "Perioada anterioară",
      "fan_mode": "Ventilație",
      "preset_mode": "Presetare"
    },
    "ru": {
      "pressure": "Давление",
      "st_display_rect": "Цифровой дисплей (прямоугольный)",
      "st_display_round": "Цифровой дисплей (круглый)",
      "name": "Климат комнаты",
      "comfort": "Комфортно",
      "cool": "Прохладно",
      "warm": "Тепло",
      "humid": "Влажно",
      "dry": "Сухо",
      "unavailable": "Недоступно",
      "too_hot": "Слишком жарко",
      "too_cold": "Слишком холодно",
      "too_humid": "Слишком влажно",
      "too_dry": "Слишком сухо",
      "mold_risk": "Риск плесени",
      "condensation_risk": "Риск конденсата",
      "ventilate": "Проветрите",
      "air_dry": "в уличном воздухе меньше воды (абсолютная влажность)",
      "air_cool": "снаружи воздух прохладнее",
      "window_open": "Окно открыто",
      "window_guess": "Окно открыто? (резкое падение температуры)",
      "window_drop_note": "Окно открыто? −{n}° за 15 мин",
      "battery_low": "Батарея разряжена",
      "outdoor": "Снаружи",
      "dew_point": "Точка росы",
      "dew_point_room": "Точка росы в комнате",
      "trend_1h": "Изменение за последний час",
      "stable": "стабильно",
      "history": "История",
      "close": "Закрыть",
      "both": "Оба",
      "temperature": "Температура",
      "humidity": "Влажность",
      "h24": "24 ч",
      "d7": "7 дней",
      "d30": "30 дней",
      "current": "Сейчас",
      "average": "Среднее",
      "min": "Мин",
      "max": "Макс",
      "loading": "Загрузка…",
      "no_history": "История недоступна",
      "ideal_zone": "Идеальная зона",
      "avg_short": "Сред",
      "indoor": "В помещении",
      "st_standard": "Стандарт",
      "st_gauge": "Шкала",
      "st_gradient": "Градиент",
      "st_minimal": "Минимализм",
      "st_lcd": "Метеостанция",
      "st_tile": "Мини-плитка",
      "st_thermometer": "Большой термометр",
      "st_gradient_ring": "Градиентное кольцо",
      "st_double_ring": "Двойное кольцо",
      "st_dial": "Стрелочный циферблат",
      "st_neon": "Неон",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Нагрев",
      "st_bars": "Столбики",
      "lcd_auto": "Авто (зелёный днём, синий в тёмной теме)",
      "lcd_green": "Зелёный",
      "lcd_blue": "Синий",
      "lcd_amber": "Янтарный",
      "tap_history": "Окно истории",
      "tap_more_info": "Карточка сущности",
      "tap_navigate": "Открыть страницу",
      "tap_none": "Ничего",
      "target": "Уставка",
      "thermostat_off": "Термостат выключен",
      "heating": "нагрев",
      "cooling": "охлаждение",
      "compare": "Сравнить",
      "yesterday": "Вчера",
      "previous": "Предыдущий период",
      "fan_mode": "Вентилятор",
      "preset_mode": "Предустановка"
    },
    "sr": {
      "pressure": "Притисак",
      "st_display_rect": "Дигитални дисплеј (правоугаони)",
      "st_display_round": "Дигитални дисплеј (округли)",
      "name": "Клима у соби",
      "comfort": "Комфорно",
      "cool": "Свеже",
      "warm": "Топло",
      "humid": "Влажно",
      "dry": "Суво",
      "unavailable": "Недоступно",
      "too_hot": "Превише вруће",
      "too_cold": "Превише хладно",
      "too_humid": "Превише влажно",
      "too_dry": "Превише суво",
      "mold_risk": "Ризик од буђи",
      "condensation_risk": "Ризик од кондензације",
      "ventilate": "Проветрите собу",
      "air_dry": "спољашњи ваздух садржи мање воде (апсолутна влажност)",
      "air_cool": "спољашњи ваздух је свежији",
      "window_open": "Прозор је отворен",
      "window_guess": "Прозор је отворен? (нагли пад температуре)",
      "window_drop_note": "Прозор је отворен? −{n}° за 15 мин",
      "battery_low": "Батерија је ниска",
      "outdoor": "Споља",
      "dew_point": "Тачка росе",
      "dew_point_room": "Тачка росе просторије",
      "trend_1h": "Промена током последњег сата",
      "stable": "стабилно",
      "history": "Историја",
      "close": "Затвори",
      "both": "Обоје",
      "temperature": "Температура",
      "humidity": "Влажност",
      "h24": "24 ч",
      "d7": "7 дана",
      "d30": "30 дана",
      "current": "Тренутно",
      "average": "Просек",
      "min": "Мин",
      "max": "Макс",
      "loading": "Учитавање…",
      "no_history": "Историја није доступна",
      "ideal_zone": "Идеална зона",
      "avg_short": "Прос",
      "indoor": "Унутра",
      "st_standard": "Стандардни",
      "st_gauge": "Мерач",
      "st_gradient": "Градијент",
      "st_minimal": "Минималистички",
      "st_lcd": "Временска станица",
      "st_tile": "Мини плочица",
      "st_thermometer": "Велики термометар",
      "st_gradient_ring": "Прстен са градијентом",
      "st_double_ring": "Дупли прстен",
      "st_dial": "Бројчаник са иглом",
      "st_neon": "Неон",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Греје",
      "st_bars": "Траке",
      "lcd_auto": "Аутоматски (зелено дању, плаво у тамном режиму)",
      "lcd_green": "Зелена",
      "lcd_blue": "Плава",
      "lcd_amber": "Ћилибар (Наранџаста)",
      "tap_history": "Искачући прозор за историју",
      "tap_more_info": "Детаљи о ентитету",
      "tap_navigate": "Отвори страницу",
      "tap_none": "Ништа",
      "target": "Циљна",
      "thermostat_off": "Термостат искључен",
      "heating": "грејање",
      "cooling": "хлађење",
      "compare": "Упореди",
      "yesterday": "Јуче",
      "previous": "Претходни период",
      "fan_mode": "Вентилација",
      "preset_mode": "Предподешавање"
    },
    "sr-Latn": {
      "pressure": "Pritisak",
      "st_display_rect": "Digitalni displej (pravougaoni)",
      "st_display_round": "Digitalni displej (okrugli)",
      "name": "Klima u sobi",
      "comfort": "Komforno",
      "cool": "Sveže",
      "warm": "Toplo",
      "humid": "Vlažno",
      "dry": "Suvo",
      "unavailable": "Nedostupno",
      "too_hot": "Previše vruće",
      "too_cold": "Previše hladno",
      "too_humid": "Previše vlažno",
      "too_dry": "Previše suvo",
      "mold_risk": "Rizik od buđi",
      "condensation_risk": "Rizik od kondenzacije",
      "ventilate": "Provetrite sobu",
      "air_dry": "spoljašnji vazduh sadrži manje vode (apsolutna vlažnost)",
      "air_cool": "spoljašnji vazduh je svežiji",
      "window_open": "Prozor je otvoren",
      "window_guess": "Prozor je otvoren? (nagli pad temperature)",
      "window_drop_note": "Prozor je otvoren? −{n}° za 15 min",
      "battery_low": "Baterija je niska",
      "outdoor": "Spolja",
      "dew_point": "Tačka rose",
      "dew_point_room": "Tačka rose prostorije",
      "trend_1h": "Promena tokom poslednjeg sata",
      "stable": "stabilno",
      "history": "Istorija",
      "close": "Zatvori",
      "both": "Oboje",
      "temperature": "Temperatura",
      "humidity": "Vlažnost",
      "h24": "24 č",
      "d7": "7 dana",
      "d30": "30 dana",
      "current": "Trenutno",
      "average": "Prosek",
      "min": "Min",
      "max": "Maks",
      "loading": "Učitavanje…",
      "no_history": "Istorija nije dostupna",
      "ideal_zone": "Idealna zona",
      "avg_short": "Pros",
      "indoor": "Unutra",
      "st_standard": "Standardni",
      "st_gauge": "Merač",
      "st_gradient": "Gradijent",
      "st_minimal": "Minimalistički",
      "st_lcd": "Vremenska stanica",
      "st_tile": "Mini pločica",
      "st_thermometer": "Veliki toplomer",
      "st_gradient_ring": "Prsten sa gradijentom",
      "st_double_ring": "Dupli prsten",
      "st_dial": "Brojčanik sa iglom",
      "st_neon": "Neon",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Greje",
      "st_bars": "Trake",
      "lcd_auto": "Automatski (zeleno danju, plavo u tamnom režimu)",
      "lcd_green": "Zelena",
      "lcd_blue": "Plava",
      "lcd_amber": "Ćilibar (Narandžasta)",
      "tap_history": "Iskačući prozor za istoriju",
      "tap_more_info": "Detalji o entitetu",
      "tap_navigate": "Otvori stranicu",
      "tap_none": "Ništa",
      "target": "Ciljna",
      "thermostat_off": "Termostat isključen",
      "heating": "grejanje",
      "cooling": "hlađenje",
      "compare": "Uporedi",
      "yesterday": "Juče",
      "previous": "Prethodni period",
      "fan_mode": "Ventilacija",
      "preset_mode": "Predpodešavanje"
    },
    "uk": {
      "pressure": "Тиск",
      "st_display_rect": "Цифровий дисплей (прямокутний)",
      "st_display_round": "Цифровий дисплей (круглий)",
      "name": "Мікроклімат кімнати",
      "comfort": "Комфортно",
      "cool": "Прохолодно",
      "warm": "Тепло",
      "humid": "Волого",
      "dry": "Сухо",
      "unavailable": "Недоступно",
      "too_hot": "Занадто спекотно",
      "too_cold": "Занадто холодно",
      "too_humid": "Занадто волого",
      "too_dry": "Занадто сухо",
      "mold_risk": "Ризик цвілі",
      "condensation_risk": "Ризик конденсату",
      "ventilate": "Провітріть кімнату",
      "air_dry": "зовнішнє повітря сухіше (за абсолютною вологістю)",
      "air_cool": "зовнішнє повітря прохолодніше",
      "window_open": "Вікно відчинене",
      "window_guess": "Вікно відчинене? (різке падіння температури)",
      "window_drop_note": "Вікно відчинене? −{n}° за 15 хв",
      "battery_low": "Низький заряд",
      "outdoor": "Надворі",
      "dew_point": "Точка роси",
      "dew_point_room": "Точка роси в кімнаті",
      "trend_1h": "Зміна за останню годину",
      "stable": "стабільно",
      "history": "Історія",
      "close": "Закрити",
      "both": "Обидва",
      "temperature": "Температура",
      "humidity": "Вологість",
      "h24": "24 год",
      "d7": "7 днів",
      "d30": "30 днів",
      "current": "Зараз",
      "average": "Середнє",
      "min": "Мін.",
      "max": "Макс.",
      "loading": "Завантаження…",
      "no_history": "Історія недоступна",
      "ideal_zone": "Ідеальна зона",
      "avg_short": "Сер.",
      "indoor": "У приміщенні",
      "st_standard": "Стандартний",
      "st_gauge": "Шкала",
      "st_gradient": "Градієнт",
      "st_minimal": "Мінімалістичний",
      "st_lcd": "Метеостанція",
      "st_tile": "Міні-плитка",
      "st_thermometer": "Великий термометр",
      "st_gradient_ring": "Градієнтне кільце",
      "st_double_ring": "Подвійне кільце",
      "st_dial": "Стрілковий циферблат",
      "st_neon": "Неон",
      "st_netatmo": "Netatmo",
      "st_nest": "Google Nest",
      "heating_now": "Нагрівання",
      "st_bars": "Смуги",
      "lcd_auto": "Автоматично (зелений вдень, синій у темному режимі)",
      "lcd_green": "Зелений",
      "lcd_blue": "Синій",
      "lcd_amber": "Бурштиновий",
      "tap_history": "Вікно історії",
      "tap_more_info": "Подробиці сутності",
      "tap_navigate": "Відкрити сторінку",
      "tap_none": "Нічого",
      "target": "Ціль",
      "thermostat_off": "Термостат вимкнено",
      "heating": "нагрівання",
      "cooling": "охолодження",
      "compare": "Порівняти",
      "yesterday": "Вчора",
      "previous": "Попередній період",
      "fan_mode": "Режим вентилятора",
      "preset_mode": "Пресет"
    }
  };
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
/* fond transparent : la ligne de consigne (− / +) garde un fond opaque pour rester lisible */
.transparent .clim{background:color-mix(in srgb,var(--primary-text-color,#212121) 9%,var(--card-background-color,#fff))}
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
:host(.nohum) .vh>ha-icon{display:none}
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

/* ---- illustration Netatmo (variant: netatmo) : halo + flamme animés quand le thermostat chauffe ---- */
.st-netatmo .net{display:block;width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:4px auto 2px}
.st-netatmo .meta{justify-content:center}
.tv-ink{fill:#1b1b1b;font-family:'DIN Condensed','Arial Narrow',system-ui,sans-serif}
.tv-glow{opacity:0;transition:opacity .5s}
.heating .tv-glow{opacity:.8;animation:tvbreathe 2.4s ease-in-out infinite}
.tv-heat{opacity:0;transition:opacity .4s}
.heating .tv-heat{opacity:1}
.heating path.tv-heat{animation:tvflame 1.2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
.tv-snow{opacity:0}
.winopen .tv-snow{opacity:1;animation:tvblink 1.4s ease-in-out infinite}
.noanim .tv-glow,.noanim .tv-snow,.noanim .tv-heat{animation:none}
@keyframes tvbreathe{50%{opacity:.35}}
@keyframes tvblink{50%{opacity:.35}}
@keyframes tvflame{from{opacity:.55}to{opacity:1}}

/* ---- illustration Google Nest (variant: nest) : écran rond noir, fond orange qui respire en chauffe, arc de consigne ---- */
.st-nest .nest{display:block;width:calc(210px * var(--illus-scale,1));max-width:100%;height:auto;margin:4px auto 2px}
.st-nest .meta{justify-content:center}
.nst{fill:#fff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.nest-heat{opacity:0;transition:opacity .8s}
.heating .nest-heat{opacity:1;animation:nestbreathe 3s ease-in-out infinite}
.nest-arc{stroke:#2b9af9;transition:stroke-dasharray .6s}.heating .nest-arc{stroke:#fff}
.nest-snow{opacity:0}.winopen .nest-snow{opacity:1;animation:tvblink 1.4s ease-in-out infinite}
.noanim .nest-heat,.noanim .nest-snow{animation:none}
@keyframes nestbreathe{50%{opacity:.78}}

/* ---- afficheurs numériques (variant: display_rect / display_round) : photo + écran redessiné ---- */
.st-display_rect .disp,.st-display_round .disp{display:block;width:calc(170px * var(--illus-scale,1));max-width:100%;height:auto;margin:4px auto 2px}
.st-display_rect .meta,.st-display_round .meta{justify-content:center}
.dscr.swap .dtx{animation:rcfade .7s ease}@keyframes rcfade{from{opacity:0}to{opacity:1}}
.dtx{font-family:Roboto,"Helvetica Neue",Arial,sans-serif;font-weight:500;fill:#fff}
.dglow{filter:drop-shadow(0 0 3px rgba(255,255,255,.5))}
.darc{fill:none;stroke-linecap:round;stroke-width:8;transition:stroke-dasharray .9s ease}
.heating .dled{animation:nestbreathe 3s ease-in-out infinite}
.noanim .dled{animation:none}

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
/* commandes du thermostat (show_hvac_modes / show_fan_modes / show_preset_modes) : boutons de mode, listes ventilation et préréglage */
.crow{display:flex;flex-wrap:wrap;align-items:stretch;gap:6px;margin-top:6px}
.crow:not(:has(> :not([hidden]))){display:none}
.crow .cmodes{flex:1 1 auto;margin-top:0}.crow .csel{flex:1 1 150px;margin-top:0}
.cmodes{display:flex;gap:4px;margin-top:6px;padding:4px;border-radius:12px;background:rgba(127,127,127,.09);cursor:default}
.cmodes button{flex:1;min-width:0;height:34px;border:none;border-radius:9px;background:transparent;color:var(--secondary-text-color);cursor:pointer;display:grid;place-items:center;padding:0;transition:background .2s,color .2s}
.cmodes button ha-icon{--mdc-icon-size:18px}
.cmodes button:hover{background:rgba(127,127,127,.12)}
.cmodes button.on{background:rgba(127,127,127,.28);color:var(--primary-text-color)}
.cmodes button.on[data-m="heat"]{background:color-mix(in srgb,var(--rc-heat) 22%,transparent);color:var(--rc-heat)}
.cmodes button.on[data-m="cool"]{background:color-mix(in srgb,var(--rc-cold) 22%,transparent);color:var(--rc-cold)}
.cmodes button:disabled{opacity:.35;cursor:default}
.cmodes button:focus-visible,.csel select:focus-visible{outline:2px solid var(--c);outline-offset:1px}
.csel{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;margin-top:6px;cursor:default}
.csel label{display:flex;align-items:center;gap:6px;min-width:0;padding:0 8px;height:34px;border-radius:12px;background:rgba(127,127,127,.09);color:var(--secondary-text-color)}
.csel label[hidden]{display:none}
.csel ha-icon{--mdc-icon-size:18px;flex:none}
.csel select{flex:1;min-width:0;border:none;background:transparent;color:var(--primary-text-color);font:500 13px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);cursor:pointer;padding:0;text-overflow:ellipsis}
.csel select option{color:#212121}
.st-gradient .cmodes,.st-lcd .cmodes,.st-neon .cmodes,.st-gradient .csel label,.st-lcd .csel label,.st-neon .csel label{background:rgba(255,255,255,.12);color:#e9edf1}
.st-gradient .cmodes button.on,.st-lcd .cmodes button.on,.st-neon .cmodes button.on,.st-gradient .csel select,.st-lcd .csel select,.st-neon .csel select{color:#fff}
.st-tile .cmodes,.st-tile .csel{display:none!important}
/* liste de ventilation dans la ligne du thermostat */
.clim .cfan{display:flex;flex:0 1 auto;min-width:0;margin:0}.clim .cfan[hidden]{display:none}
.clim .cfan label{height:26px;border-radius:13px;padding:0 6px;background:rgba(127,127,127,.14)}
.clim .cfan ha-icon{animation:none;color:inherit}
.clim .cfan select{max-width:96px;font-size:12px}
.st-gradient .crow{position:relative}
.st-double_ring .crow{order:1}
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
  const STYLES = ['standard', 'gauge', 'gradient', 'minimal', 'lcd', 'tile', 'thermometer', 'gradient_ring', 'double_ring', 'dial', 'neon', 'bars', 'netatmo', 'nest', 'display_rect', 'display_round'];
  // illustration Netatmo (même photo détourée que appliance-trv-card, model: netatmo) : écran e-ink redessiné en direct
  const NET_IMG = 'data:image/webp;base64,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';
  const SNOW = (x, y, s, col) => `<g class="tv-snow" stroke="${col}" stroke-width="${s / 8}" stroke-linecap="round"><path d="M${x} ${y - s / 2} v${s} M${x - s * .43} ${y - s / 4} l${s * .86} ${s / 2} M${x - s * .43} ${y + s / 4} l${s * .86} ${-s / 2}"/></g>`;
  const FLAME = (x, y, s, col) => `<path class="tv-heat" transform="translate(${x} ${y}) scale(${s / 24})" fill="${col}" d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26z"/>`;
  // écrans numériques (variant: display_rect / display_round) : photos détourées d'un afficheur rectangle (icônes thermomètre et goutte) et d'un afficheur rond,
  // écran redessiné en direct : grands chiffres 7 segments = température mesurée, consigne du thermostat lié en petit, humidité, flamme en chauffe
  const DISP_RECT = 'data:image/webp;base64,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';
  const DISP_ROUND = 'data:image/webp;base64,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';
  const SEG7 = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g' };
  const seg7 = (ch, x, w, h, t) => {
    const poly = (pts) => `M${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`, g = t * 0.14, hh = h / 2;
    const hb = (yc) => poly([[t * 0.5 + g, yc], [t + g, yc - t / 2], [w - t - g, yc - t / 2], [w - t * 0.5 - g, yc], [w - t - g, yc + t / 2], [t + g, yc + t / 2]]);
    const vb = (xc, y0, y1) => poly([[xc, y0], [xc + t / 2, y0 + t / 2], [xc + t / 2, y1 - t / 2], [xc, y1], [xc - t / 2, y1 - t / 2], [xc - t / 2, y0 + t / 2]]);
    const P = { a: hb(t / 2), g: hb(hh), d: hb(h - t / 2), f: vb(t / 2, t * 0.5 + g, hh - g), b: vb(w - t / 2, t * 0.5 + g, hh - g), e: vb(t / 2, hh + g, h - t * 0.5 - g), c: vb(w - t / 2, hh + g, h - t * 0.5 - g) };
    return `<g transform="translate(${x} 0)">${(SEG7[ch] || '').split('').map((k) => `<path d="${P[k]}"/>`).join('')}</g>`;
  };
  // nombre en chiffres 7 segments (virgule décimale comprise), aligné à droite sur xr, penché comme sur l'écran
  const num7 = (txt, xr, y, h, maxW, wMax, lean = 8) => {
    const chars = [...String(txt).replace(',', '.')].slice(0, 6), digits = chars.filter((ch) => ch !== '.').length;
    const gap = wMax * 0.2, dotW = wMax * 0.28, dots = chars.length - digits;
    const w = Math.min(wMax, (maxW - dots * dotW - Math.max(0, digits - 1) * gap) / Math.max(1, digits)), t = Math.max(3, w * 0.22);
    let x = 0; const out = chars.map((ch) => { if (ch === '.') { const r = t * 0.62, o = `<circle cx="${(x + dotW / 2 - gap * 0.4).toFixed(1)}" cy="${(h - r).toFixed(1)}" r="${r.toFixed(1)}"/>`; x += dotW; return o; } const o = seg7(ch, x, w, h, t); x += w + gap; return o; });
    const x0 = xr - (x - gap) + h * Math.tan(lean * Math.PI / 180) * 0.5;
    return `<g class="dglow" fill="#fff" transform="translate(${x0.toFixed(1)} ${y}) skewX(${-lean})">${out.join('')}</g>`;
  };
  // arc de consigne du cadran Nest (270°, ouverture en bas), comme appliance-trv-card
  const NEST_ARC = (() => { const c = 199, r = 150, a0 = 135 * Math.PI / 180, a1 = 405 * Math.PI / 180, p = (a) => `${(c + r * Math.cos(a)).toFixed(1)} ${(c + r * Math.sin(a)).toFixed(1)}`; return `M${p(a0)} A${r} ${r} 0 1 1 ${p(a1)}`; })();
  const DIAL = { t0: 215, h0: 145, span: 110 };
  const DEF_ICON = { double_ring: 'mdi:home-thermometer-outline' };
  // arc de cercle (degrés, 0 = droite, sens horaire)
  const arc = (cx, cy, r, a0, a1) => {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  // pictogrammes des petites valeurs (afficheurs en rotation), dessinés autour de (0,0)
  const DGLYPH = {
    temperature: '<path d="M-2.6 -8a2.6 2.6 0 0 1 5.2 0v9.5a5 5 0 1 1-5.2 0Z" fill="none"/><path d="M5 -6h3M5 -2h3"/>',
    setpoint: '<path d="M-2.6 -8a2.6 2.6 0 0 1 5.2 0v9.5a5 5 0 1 1-5.2 0Z" fill="none"/><path d="M5 -6h3M5 -2h3"/>',
    humidity: '<path d="M0 -9C4 -3 7 0 7 3.5a7 7 0 0 1-14 0C-7 0-4-3 0-9Z" fill="none"/>',
    pressure: '<path d="M-8 5A9.5 9.5 0 1 1 8 5" fill="none"/><path d="M0 3L4.5 -4.5"/><circle r="1.4" cy="3" fill="#fff"/>',
    co2: '<text y="3.6" font-size="10" font-weight="700" text-anchor="middle" fill="#fff" stroke="none">CO₂</text>',
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
  const META = '<div class="meta" id="meta"></div><div class="meta" id="meta2"></div>', NOTES = '<div class="notes" id="notes"></div>';
  const SPARK = '<svg class="spark hide" id="spark" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path class="a" d=""/><path class="l" d=""/></svg>';
  const CLIM = '<div class="clim" id="clim" hidden><ha-icon id="cico" icon="mdi:thermostat"></ha-icon><span class="cl" id="cl"></span><button id="cm" type="button">−</button><b id="ct"></b><button id="cp" type="button">+</button><div class="csel cfan" id="cfan" hidden><label id="lfan"><ha-icon icon="mdi:fan"></ha-icon><select id="sfan"></select></label></div></div>'
    + '<div class="crow"><div class="cmodes" id="cmodes" role="group" hidden></div>'
    + '<div class="csel" id="csel" hidden><label id="lpre"><ha-icon icon="mdi:tune-variant"></ha-icon><select id="spre"></select></label></div></div>';
  // icônes des modes (mêmes icônes que Home Assistant)
  const HVAC_ICON = { off: 'mdi:power', heat: 'mdi:fire', cool: 'mdi:snowflake', heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:thermostat-auto', dry: 'mdi:water-percent', fan_only: 'mdi:fan' };
  const HVAC_ORDER = ['off', 'fan_only', 'dry', 'cool', 'heat', 'heat_cool', 'auto'];
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
    netatmo: (id) => `${HEAD()}<svg class="net" viewBox="-12 -12 440 422" aria-hidden="true">
        <defs><radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#ff8a00" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a00" stop-opacity="0"/></radialGradient>
          <linearGradient id="${id}k" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#c3c3c3"/><stop offset="1" stop-color="#b3b3b3"/></linearGradient></defs>
        <ellipse class="tv-glow" cx="208" cy="199" rx="250" ry="250" fill="url(#${id}g)"/>
        <image href="${NET_IMG}" x="0" y="0" width="416" height="398"/>
        <rect x="147" y="93" width="134" height="200" fill="url(#${id}k)"/>
        <text class="tv-ink" id="t" x="212" y="196" text-anchor="middle" font-size="44" font-weight="700" letter-spacing="-1">--</text>
        <text class="tv-ink" id="tu" x="262" y="125" font-size="15" font-weight="700">°C</text>
        ${FLAME(158, 238, 24, '#222')}
        <text class="tv-ink" id="h" x="232" y="264" text-anchor="middle" font-size="28" font-weight="700" opacity=".8"></text>
        ${SNOW(170, 116, 20, '#222')}</svg>${META}${NOTES}`,
    // Google Nest : en grand la température mesurée, en petit la consigne du thermostat lié, humidité en bas
    nest: (id) => `${HEAD()}<svg class="nest" viewBox="0 0 398 398" aria-hidden="true">
        <defs><radialGradient id="${id}k" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#111"/><stop offset="1" stop-color="#000"/></radialGradient>
          <radialGradient id="${id}h" cx=".5" cy=".42" r=".65"><stop offset="0" stop-color="#ff8a2a"/><stop offset="1" stop-color="#c2410c"/></radialGradient>
          <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f1f1"/><stop offset=".5" stop-color="#9a9a9a"/><stop offset="1" stop-color="#e4e4e4"/></linearGradient></defs>
        <circle cx="199" cy="199" r="196" fill="url(#${id}r)"/>
        <circle cx="199" cy="199" r="186" fill="url(#${id}k)"/>
        <circle class="nest-heat" cx="199" cy="199" r="186" fill="url(#${id}h)"/>
        <path d="${NEST_ARC}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="10" stroke-linecap="round"/>
        <path class="nest-arc" id="narc" d="${NEST_ARC}" fill="none" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100"/>
        <text class="nst" id="nmode" x="199" y="128" text-anchor="middle" font-size="20" font-weight="600" letter-spacing="2" opacity=".85"></text>
        <text class="nst" x="199" y="236" text-anchor="middle" font-size="104"><tspan id="t">--</tspan><tspan font-size="60" dy="-34">°</tspan></text>
        <text class="nst" id="nsmall" x="199" y="304" text-anchor="middle" font-size="40" font-weight="500"></text>
        <g class="nst" opacity=".85"><path id="ndrop" d="M168 334 q-9 12 -9 18 a9 9 0 0 0 18 0 q0 -6 -9 -18z" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><text id="h" x="186" y="352" font-size="26"></text></g>
        <g class="nest-snow" stroke="#7cc4ff" stroke-width="3.2" stroke-linecap="round"><path d="M199 84 v52 M176.6 97 l44.8 26 M176.6 123 l44.8 -26"/></g></svg>${META}${NOTES}`,
    // afficheur rectangle : température mesurée en grands chiffres, arc = consigne du thermostat lié, consigne et humidité en bas
    display_rect: () => `${HEAD()}<svg class="disp" viewBox="0 0 340 462" aria-hidden="true">
        <ellipse cx="170" cy="458" rx="122" ry="7" fill="#000" opacity=".3"/><image href="${DISP_RECT}" width="340" height="462"/><g class="dscr" id="dscr"></g></svg>${META}${NOTES}`,
    // afficheur rond : même principe, voyant du haut orange en chauffe
    display_round: () => `${HEAD()}<svg class="disp" viewBox="0 0 346 406" aria-hidden="true">
        <ellipse cx="173" cy="402" rx="124" ry="6" fill="#000" opacity=".3"/><image href="${DISP_ROUND}" width="346" height="406"/><g class="dscr" id="dscr"></g></svg>${META}${NOTES}`,
    neon: () => `${HEAD()}${VT}${VH}${META}${NOTES}${SPARK}`,
    bars: () => `${HEAD()}<div class="b12">
        <div class="col"><div class="cv"><span id="t">--</span><small id="tu"></small></div><div class="tube"><span class="zone" id="zbt"></span><i id="bt"></i></div><ha-icon icon="mdi:thermometer"></ha-icon></div>
        <div class="col"><div class="cv"><span id="h"></span></div><div class="tube"><span class="zone" id="zbh"></span><i class="h" id="bh"></i></div><ha-icon icon="mdi:water-percent"></ha-icon></div>
        <div class="side"><span class="trend" id="trend"></span>${META}${NOTES}</div></div>`,
  };

  class ApplianceRoomClimateCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
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
      this._built = false; this._hist = null; this._histAt = 0; this._rot = 0; this._startRot();
      if (this._hass) this._render();
    }
    // Home Assistant renvoie hass à chaque changement d'état de toute l'installation : on ne redessine que si
    // une entité de la carte (ou la langue / les unités) a changé. Moins de travail, et plus de petits sauts
    // de mise en page qui font remonter la page toute seule sur iPhone (Safari)
    set hass(h) {
      const old = this._hass;
      this._hass = h;
      if (this._dlg) this._dlg.hass = h;
      if (!this._c) return;
      if (this._built && old && !this._changed(old, h)) return;
      this._render();
    }
    _changed(o, h) {
      const c = this._c;
      if (o.locale !== h.locale || o.language !== h.language || o.config !== h.config) return true;
      return ['entity_temperature', 'entity_humidity', 'entity_outdoor_temperature', 'entity_outdoor_humidity', 'entity_window', 'entity_battery', 'entity_climate', 'entity_pressure', 'entity_co2']
        .some((k) => c[k] && o.states[c[k]] !== h.states[c[k]]);
    }
    get hass() { return this._hass; }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); this._startRot(); }
    disconnectedCallback() { clearInterval(this._tick); clearInterval(this._rotTimer); this._rotTimer = null; }
    // rotate_seconds : sur les afficheurs, la grande valeur change toutes les N secondes (température, consigne, humidité, pression, CO₂)
    _startRot() {
      clearInterval(this._rotTimer); this._rotTimer = null;
      const sec = Number(this._c && this._c.rotate_seconds);
      if (sec > 0 && this.isConnected) this._rotTimer = setInterval(() => { this._rot = (this._rot || 0) + 1; if (this._hass && this._built) this._render(); }, Math.max(1, sec) * 1000);
    }
    // variant : nom du style ; « style » reste accepté (anciennes configs) quand c'est un nom de style,
    // car dans une carte picture-elements, style est l'objet CSS de positionnement de Home Assistant
    _style() { const c = this._c || {}, v = STYLES.includes(c.variant) ? c.variant : c.style; return STYLES.includes(v) ? v : 'standard'; }
    getCardSize() { return { thermometer: 6, double_ring: 5, gradient_ring: 4, dial: 5, netatmo: 5, nest: 5, display_rect: 5, display_round: 5, tile: 2 }[this._style()] || 2; }
    getGridOptions() {
      const st = this._style();
      if (st === 'tile') return { columns: 3, min_columns: 2, rows: 'auto', min_rows: 2 };
      if (st === 'thermometer') return { columns: 4, min_columns: 3, rows: 'auto', min_rows: 4 };
      return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 2 };
    }

    /* ---- textes ---- */
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _fmt(v, d = 1) { return fin(v) ? v.toLocaleString(window.applianceLocale(this._c, this._hass), { minimumFractionDigits: d, maximumFractionDigits: d }) : '--'; }
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
      // commandes du thermostat : un clic ne déclenche pas l'action de la carte
      ['cmodes', 'csel'].forEach((i) => { const el = root.getElementById(i); el.addEventListener('click', (e) => e.stopPropagation()); el.addEventListener('keydown', (e) => e.stopPropagation()); });
      root.getElementById('cmodes').addEventListener('click', (e) => { const b = e.target.closest('button[data-m]'); if (b && !b.disabled) this._climCall('set_hvac_mode', { hvac_mode: b.dataset.m }); });
      root.getElementById('sfan').addEventListener('change', (e) => this._climCall('set_fan_mode', { fan_mode: e.target.value }));
      root.getElementById('spre').addEventListener('change', (e) => this._climCall('set_preset_mode', { preset_mode: e.target.value }));
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

    // écran des afficheurs numériques : température mesurée (chiffres 7 segments), consigne du thermostat lié, humidité, flamme / flocon
    _display(r, s, tmp, ck, heat, kind) {
      const c = this._c, g = r.getElementById('dscr');
      if (!g) return;
      const off = !!ck && /^(off|unavailable|unknown)$/i.test(String(ck.cs.state));
      const shown = ck && this._pending != null ? this._pending : ck && ck.t;
      const mn = ck && fin(ck.min) ? ck.min : tmp.c(5), mx = ck && fin(ck.max) ? ck.max : tmp.c(30);
      const f = ck && fin(shown) && mx > mn ? clamp01((shown - mn) / (mx - mn)) : 0;
      const col = heat ? '#ff8a2a' : off ? '#6b7076' : '#2fd27a';
      const main = fin(s.t) ? this._fmt(s.t, 1) : '--', set = ck && !off && fin(shown) ? `${this._fmt(shown, ck.step < 1 ? 1 : 0)}°` : '--';
      const hum = c.show_humidity !== false && fin(s.h) ? `${this._fmt(s.h, 0)}` : '';
      const mode = heat ? this._t('heating_now').toUpperCase() : off ? 'OFF' : '';
      const unit = String(tmp.unit || '°C').replace('°', '°');
      // ---- rotation : un seul affichage, les deux petites valeurs sont les deux autres mesures ----
      const rd = (id, conv) => { const st = id && this._hass.states[id]; if (!st || /^(unavailable|unknown)$/i.test(String(st.state))) return NaN; const v = parseFloat(String(st.state).replace(',', '.')); if (!Number.isFinite(v)) return NaN; return conv ? conv(v, String((st.attributes && st.attributes.unit_of_measurement) || '').toLowerCase()) : v; };
      const V = { temperature: s.t, setpoint: ck && !off && fin(shown) ? shown : NaN, humidity: c.show_humidity !== false ? s.h : NaN,
        pressure: rd(c.entity_pressure, (v, u) => (u === 'kpa' ? v * 10 : u === 'pa' ? v / 100 : u === 'inhg' ? v * 33.8639 : u === 'mmhg' ? v * 1.33322 : v)), co2: rd(c.entity_co2) };
      const list = ['temperature', 'setpoint', 'humidity', 'pressure', 'co2'].filter((k) => fin(V[k]));
      const rot = Number(c.rotate_seconds) > 0 && list.length > 1;
      if (rot) {
        const fk = list[(this._rot || 0) % list.length], fv = V[fk];
        const UN = { temperature: unit, setpoint: unit, humidity: '%', pressure: 'hPa', co2: 'ppm' }, LB = { temperature: this._l('temperature'), setpoint: this._l('target'), humidity: this._l('humidity'), pressure: this._l('pressure'), co2: 'CO₂' };
        const SC = { temperature: [mn, mx], setpoint: [mn, mx], humidity: [0, 100], pressure: [960, 1060], co2: [0, 2000] };
        const fmtV = (k, v, big) => (k === 'temperature' ? this._fmt(v, big ? 1 : 0) : k === 'setpoint' ? this._fmt(v, ck && ck.step < 1 ? 1 : 0) : String(Math.round(v))).replace(/\s/g, '');
        const frac = clamp01((fv - SC[fk][0]) / (SC[fk][1] - SC[fk][0])), label = LB[fk].toUpperCase(), long = label.length > 5;
        const others = [...list.slice(list.indexOf(fk) + 1), ...list.slice(0, list.indexOf(fk))].slice(0, 2).map((k) => ({ key: k, txt: fmtV(k, V[k], false), unit: UN[k] }));
        const swap = this._lastFocus != null && this._lastFocus !== fk; this._lastFocus = fk; g.classList.toggle('swap', swap);
        this._rotLabel = LB[fk];
        const bigtxt = fmtV(fk, fv, true);
        if (kind === 'rect') {
          const pt = (a) => `${(197 + 92 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(172 + 92 * Math.sin(a * Math.PI / 180)).toFixed(1)}`, arc = `M${pt(116)}A92 92 0 1 1 ${pt(299)}`;
          g.innerHTML = `<g class="dtx">
            <path class="darc" d="${arc}" pathLength="100" stroke="#2a3a35" opacity=".8"/>
            <path class="darc dglow" d="${arc}" pathLength="100" stroke="${col}" stroke-dasharray="${Math.max(1.5, frac * 100).toFixed(1)} 100"/>
            ${num7(bigtxt, 258, 138, 62, 112, 32)}
            <text x="262" y="190" font-size="${UN[fk].length > 2 ? 14 : 17}" font-weight="600">${esc(UN[fk])}</text>
            <text x="${long ? 208 : 198}" y="${long ? 248 : 258}" font-size="${long ? 11 : 15}" text-anchor="middle">${esc(label)}</text>
            ${[[145, 285, 352], [250, 278, 350]].map(([cx, cy, ty], i) => { const sm = others[i]; if (!sm) return `<circle cx="${cx}" cy="${cy}" r="24" fill="#050505"/>`;
              return `<circle cx="${cx}" cy="${cy}" r="24" fill="#050505"/><g class="dglow2" transform="translate(${cx} ${cy})" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle r="20" fill="none"/><g transform="scale(1.05)">${DGLYPH[sm.key]}</g></g>
              <text x="${i ? 254 : 145}" y="${ty}" font-size="${sm.txt.length > 3 ? 32 : 44}" text-anchor="middle">${esc(sm.txt)}<tspan font-size="${sm.unit.length > 2 ? 12 : 22}" dy="${sm.unit.length === 2 && sm.unit[0] === '°' ? -17 : 0}">${esc(sm.unit)}</tspan></text>`; }).join('')}
            ${heat ? FLAME(280, 82, 26, '#ff8a2a') : s.winOpen ? SNOW(291, 91, 20, '#7cc4ff') : ''}</g>`;
        } else {
          g.innerHTML = `<rect x="${heat || !off ? 153 : 151}" y="6" width="42" height="23" rx="12" fill="${col}" class="dled" style="filter:drop-shadow(0 0 5px ${col})"/>
            <g class="dtx"><text x="151" y="118" font-size="${long ? 12 : 16}" text-anchor="middle" fill="#fff">${esc(label)}</text>
            ${num7(bigtxt, 197, 140, 68, 146, 31, 9)}
            <text x="227" y="166" font-size="${UN[fk].length > 2 ? 10 : 13}" text-anchor="middle" opacity=".85">${esc(UN[fk])}</text>
            ${heat ? FLAME(222, 185, 26, '#ff8a2a') : s.winOpen ? SNOW(222, 185, 22, '#7cc4ff') : ''}
            ${[[80, 92], [148, 160]].map(([ix, tx], i) => { const sm = others[i]; return sm ? `<g transform="translate(${ix} 227) scale(.62)" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">${DGLYPH[sm.key]}</g><text x="${tx}" y="243" font-size="${sm.txt.length > 3 ? 13 : 15}" font-style="italic" opacity=".92">${esc(sm.txt)}<tspan font-size="${sm.unit.length > 2 ? 7.5 : 9}">${esc(sm.unit)}</tspan></text>` : ''; }).join('')}</g>`;
        }
        return;
      }
      this._rotLabel = null; g.classList.remove('swap');
      if (kind === 'rect') {
        const pt = (a) => `${(197 + 92 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(172 + 92 * Math.sin(a * Math.PI / 180)).toFixed(1)}`, arc = `M${pt(116)}A92 92 0 1 1 ${pt(299)}`;
        g.innerHTML = `<g class="dtx">
          <path class="darc" d="${arc}" pathLength="100" stroke="#2a3a35" opacity=".8"/>
          <path class="darc dglow" d="${arc}" pathLength="100" stroke="${col}" stroke-dasharray="${Math.max(1.5, f * 100).toFixed(1)} 100"/>
          ${num7(main, 258, 138, 62, 112, 32)}
          <text x="262" y="190" font-size="17" font-weight="600">${esc(unit)}</text>
          <text x="222" y="252" font-size="14" text-anchor="middle" fill="${col}">${esc(mode)}</text>
          <text x="145" y="352" font-size="44" text-anchor="middle">${esc(set)}</text>
          ${hum ? `<text x="254" y="350" font-size="44" text-anchor="middle">${esc(hum)}<tspan font-size="34">%</tspan></text>` : ''}
          ${heat ? FLAME(280, 82, 26, '#ff8a2a') : s.winOpen ? SNOW(291, 91, 20, '#7cc4ff') : ''}</g>`;
      } else {
        g.innerHTML = `<rect x="${heat || !off ? 153 : 151}" y="6" width="42" height="23" rx="12" fill="${col}" class="dled" style="filter:drop-shadow(0 0 5px ${col})"/>
          <g class="dtx"><text x="151" y="118" font-size="16" text-anchor="middle" fill="${col}">${esc(mode)}</text>
          ${num7(main, 197, 140, 68, 146, 31, 9)}
          <text x="227" y="166" font-size="13" text-anchor="middle" opacity=".85">${esc(unit)}</text>
          ${heat ? FLAME(222, 185, 26, '#ff8a2a') : s.winOpen ? SNOW(222, 185, 22, '#7cc4ff') : ''}
          <path d="M78 214a3.2 3.2 0 0 1 6.4 0v14.4a6.6 6.6 0 1 1-6.4 0Z" fill="#ffc933"/>
          <text x="94" y="243" font-size="15" font-style="italic" opacity=".92">${esc(set)}</text>
          ${hum ? `<path d="M153 224c-5 6-7 9-7 12.5a7 7 0 0 0 14 0c0-3.500-2-6.500-7-12.500Z" fill="none" stroke="#35d07a" stroke-width="2"/><text x="165" y="243" font-size="15" font-style="italic" opacity=".92">${esc(hum)}<tspan font-size="10">%</tspan></text>` : ''}</g>`;
      }
    }

    _render() {
      if (this._built && this._unit !== this._tmp().unit) this._built = false; // les échelles dessinées dépendent de l'unité
      if (!this._built) this._build();
      this._loadHist();
      const c = this._c, r = this._root, s = this._compute(), tmp = s.tmp, st = this._style();
      const $ = (id) => r.getElementById(id), txt = (id, v) => { const e = $(id); if (e && e.textContent !== v) e.textContent = v; };
      const html = (id, v) => { const e = $(id); if (e && e._html !== v) { e.innerHTML = v; e._html = v; } };
      const icon_ = (e, v) => { if (e && e.getAttribute('icon') !== v) e.setAttribute('icon', v); };
      const ck = c.entity_climate && this._climTarget(tmp), heat = !!ck && /^(heating|preheating)$/.test(String(ck.a.hvac_action || ''));
      this._card.className = `st-${st} ${s.cls}${heat ? ' heating' : ''}${s.winOpen ? ' winopen' : ''}${c.animations === false ? ' noanim' : ''}${c.transparent ? ' transparent' : ''}`;
      this._card.style.setProperty('--tc', s.tcol);
      // couleurs personnalisées (éditeur) : variables --appliance-*, lues aussi par le pop-up
      Object.entries(COLORS).forEach(([k, v]) => { const col = cssColor(c[k]); if (col) this.style.setProperty(v, col); else this.style.removeProperty(v); });
      this._renderClimate(tmp);
      txt('name', (Number(c.rotate_seconds) > 0 && this._rotLabel && c.rotate_title !== false && /^display_/.test(st)) ? this._rotLabel : (c.name || this._t('name')));
      const ric = $('ric'), icon = c.icon || DEF_ICON[st];
      if (ric) { ric.hidden = !icon; if (icon) icon_(ric, icon); }
      const chip = $('chip');
      if (chip) { chip.textContent = this._l(s.chip); chip.classList.toggle('hide', c.show_status === false); }
      txt('t', fin(s.t) ? this._fmt(s.t) : fin(s.h) ? `${this._fmt(s.h, 0)}` : '--');
      txt('tu', fin(s.t) || !fin(s.h) ? tmp.unit : ' %');
      // show_humidity: false : le texte de l'humidité sous la température est masqué (le dessin du capteur reste)
      txt('h', c.show_humidity !== false && fin(s.t) && fin(s.h) ? `${this._fmt(s.h, 0)} %` : '');
      this.classList.toggle('nohum', c.show_humidity === false);
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
      html('meta', meta.map((m) => `<span>${esc(m)}</span>`).join(''));
      // le point de rosée est celui de la pièce (température et humidité intérieures) : ligne à part, pour ne pas le lire comme celui de l'extérieur
      html('meta2', c.show_dew_point !== false && fin(s.dp) ? `<span>${esc(`${this._l('dew_point_room')} ${this._fmt(s.dp)}°`)}</span>` : '');
      // icônes : fenêtre ouverte, batterie faible
      const win = $('win'), bat = $('bat');
      win.hidden = !(s.winOpen || s.winGuess);
      icon_(win, s.winOpen ? 'mdi:window-open-variant' : 'mdi:window-open');
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
      html('notes', notes.slice(0, maxN).map(([k, ic, tx]) => `<div class="note ${k}"><ha-icon icon="${ic}"></ha-icon><span title="${esc(tx)}">${esc(tx)}</span></div>`).join(''));
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
        netatmo: () => {},
        nest: () => {
          // arc = consigne du thermostat lié (entre min_temp et max_temp) ; petit chiffre = consigne ; mention en chauffe
          const ck = c.entity_climate && this._climTarget(tmp), off = !!ck && /^(off|unavailable|unknown)$/i.test(String(ck.cs.state));
          const shown = ck && this._pending != null ? this._pending : ck && ck.t;
          const mn = ck && fin(ck.min) ? ck.min : tmp.c(5), mx = ck && fin(ck.max) ? ck.max : tmp.c(30);
          const f = ck && fin(shown) && mx > mn ? clamp01((shown - mn) / (mx - mn)) : 0;
          $('narc').setAttribute('stroke-dasharray', `${(f * 100).toFixed(1)} 100`);
          txt('nmode', heat ? this._t('heating_now').toUpperCase() : off ? 'OFF' : '');
          txt('nsmall', ck && !off && fin(shown) ? `${this._fmt(shown, ck.step < 1 ? 1 : 0)}°` : '');
          const hv = fin(s.t) && fin(s.h);
          $('ndrop').parentNode.style.display = hv ? '' : 'none';
        },
        display_rect: () => this._display(r, s, tmp, ck, heat, 'rect'),
        display_round: () => this._display(r, s, tmp, ck, heat, 'round'),
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
      this._renderModes(k);
      if (!k) return;
      const off = /^(off|unavailable|unknown)$/i.test(String(k.cs.state)), act = String(k.a.hvac_action || '');
      const heating = act === 'heating' || act === 'preheating', cooling = act === 'cooling';
      el.className = `clim${heating ? ' heating' : cooling ? ' cooling' : ''}`;
      const cico = r.getElementById('cico'), ci = off ? 'mdi:power' : heating ? 'mdi:fire' : cooling ? 'mdi:snowflake' : act === 'drying' ? 'mdi:water-percent' : 'mdi:thermostat';
      if (cico.getAttribute('icon') !== ci) cico.setAttribute('icon', ci);
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
    /* ---- commandes du thermostat : modes (boutons), ventilation et préréglage (listes) ---- */
    // libellé d'un mode ou d'une valeur d'attribut, traduit par Home Assistant quand il le peut
    _climLabel(cs, attr, v) {
      const h = this._hass;
      try {
        if (!attr && h.formatEntityState) return h.formatEntityState(cs, v);
        if (attr && h.formatEntityAttributeValue) return h.formatEntityAttributeValue(cs, attr, v);
      } catch (e) { /* ancienne version de Home Assistant */ }
      const t = String(v).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1);
    }
    _climCall(service, data) { if (this._hass && this._c.entity_climate) this._hass.callService('climate', service, { entity_id: this._c.entity_climate, ...data }); }
    _renderModes(k) {
      const r = this._root, c = this._c, a = (k && k.a) || {}, cs = k && k.cs;
      const dead = !cs || /^(unavailable|unknown)$/i.test(String(cs.state));
      // boutons de mode : seulement les modes que propose le thermostat, dans l'ordre de Home Assistant
      const box = r.getElementById('cmodes');
      const modes = Array.isArray(a.hvac_modes) ? [...a.hvac_modes].sort((x, y) => (HVAC_ORDER.indexOf(x) + 1 || 99) - (HVAC_ORDER.indexOf(y) + 1 || 99)) : [];
      box.hidden = !k || c.show_hvac_modes !== true || !modes.length;
      if (!box.hidden) {
        const key = modes.join(',');
        if (box.dataset.k !== key) {
          box.dataset.k = key;
          box.innerHTML = modes.map((m) => `<button type="button" data-m="${esc(m)}"><ha-icon icon="${HVAC_ICON[m] || 'mdi:thermostat'}"></ha-icon></button>`).join('');
        }
        box.querySelectorAll('button').forEach((b) => {
          const m = b.dataset.m, on = String(cs.state) === m, lbl = this._climLabel(cs, null, m);
          b.classList.toggle('on', on); b.disabled = dead;
          b.title = lbl; b.setAttribute('aria-label', lbl); b.setAttribute('aria-pressed', String(on));
        });
      }
      // listes : ventilation (fan_modes) et préréglage (preset_modes)
      const fill = (lab, sel, attr, list, cur, show) => {
        const opts = Array.isArray(list) ? list : [];
        lab.hidden = !k || !show || !opts.length;
        if (lab.hidden) return;
        const key = opts.join(',');
        if (sel.dataset.k !== key) { sel.dataset.k = key; sel.innerHTML = opts.map((v) => `<option value="${esc(v)}">${esc(this._climLabel(cs, attr, v))}</option>`).join(''); }
        if (cur != null && opts.includes(cur)) sel.value = cur; else sel.selectedIndex = -1;
        sel.disabled = dead; sel.title = this._t(attr); sel.setAttribute('aria-label', this._t(attr));
      };
      const lfan = r.getElementById('lfan'), lpre = r.getElementById('lpre');
      fill(lfan, r.getElementById('sfan'), 'fan_mode', a.fan_modes, a.fan_mode, c.show_fan_modes === true);
      fill(lpre, r.getElementById('spre'), 'preset_mode', a.preset_modes, a.preset_mode, c.show_preset_modes === true);
      // ventilation sur la ligne du thermostat (ligne 1), préréglage seul sur la ligne des modes (ligne 2)
      r.getElementById('cfan').hidden = lfan.hidden;
      r.getElementById('csel').hidden = lpre.hidden;
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
.dlg{position:relative;background:var(--rc-dlg-bg,var(--ha-card-background,var(--card-background-color,#fff)));color:var(--primary-text-color,#212121);border-radius:18px;
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
      // carte transparente : le pop-up garde un fond opaque, sinon le graphique est illisible
      const clear = (v) => !v || /^(transparent|none)$/i.test(v) || /^(rgba|hsla)\(.*(,|\/)\s*0(\.0+)?\s*\)$/i.test(v);
      if (c.transparent || clear(cs.getPropertyValue('--ha-card-background').trim())) {
        const bg = cs.getPropertyValue('--card-background-color').trim();
        this.style.setProperty('--ha-card-background', clear(bg) ? '#fff' : bg);
      }
      // fond du pop-up réglable : history_popup_background (#hex, rgb(), rgba(), nom CSS, ou liste [r, g, b] du sélecteur de couleur) et
      // history_popup_opacity (0 à 100, 95 par défaut dès qu'une couleur est choisie). L'opacité seule s'applique à la couleur de fond pleine
      // du thème ; si elle est elle-même translucide (thème verre), un fond sombre / clair neutre prend le relais (sinon le tableau de bord reste visible).
      const rawBg = c.history_popup_background, popRaw = c.history_popup_opacity;
      let pbg = Array.isArray(rawBg) ? (rawBg.length >= 3 ? `rgb(${rawBg.slice(0, 3).map((x) => Math.round(Number(x) || 0)).join(',')})` : '') : (rawBg != null && typeof rawBg === 'object' && 'r' in rawBg ? `rgb(${rawBg.r},${rawBg.g},${rawBg.b})` : String(rawBg ?? '').trim());
      if (pbg && /^[0-9a-f]{3,8}$/i.test(pbg)) pbg = `#${pbg}`;        // « 1c1c1e » sans # accepté
      if (pbg || (popRaw != null && popRaw !== '')) {
        let base = pbg && window.CSS && window.CSS.supports('color', pbg) ? pbg : '';
        if (!base) {
          base = this.style.getPropertyValue('--card-background-color').trim();
          // couleur du thème translucide (rgba / hsla avec alpha < 1, #rrggbbaa) ou absente : fond neutre selon la couleur du texte
          const al = (base.match(/(?:,|\/)\s*([0-9.]+%?)\s*\)$/) || [])[1], hex8 = /^#[0-9a-f]{8}$/i.test(base) || /^#[0-9a-f]{4}$/i.test(base);
          const translucent = !base || hex8 || (al != null && (al.endsWith('%') ? parseFloat(al) < 100 : parseFloat(al) < 1));
          if (translucent) {
            const tx = (this.style.getPropertyValue('--primary-text-color').trim().match(/\d+/g) || []).slice(0, 3).map(Number);
            const light = tx.length === 3 ? (0.299 * tx[0] + 0.587 * tx[1] + 0.114 * tx[2]) > 140 : false;
            base = light ? '#1c1c1e' : '#ffffff';
          }
        }
        const n = Number(popRaw), op = Number.isFinite(n) && popRaw !== '' && popRaw != null ? Math.max(0, Math.min(100, n)) : 95;
        this.style.setProperty('--rc-dlg-bg', op >= 100 ? base : `color-mix(in srgb, ${base} ${op}%, transparent)`);
      }
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
        // afficheurs : défilement des valeurs (température, consigne, humidité, pression, CO₂)
        ...(/^display_/.test(String((this._c && (this._c.variant || this._c.style)) || '')) ? [ent('entity_pressure', 'sensor'), ent('entity_co2', 'sensor'), num('rotate_seconds', 0, 60, 1, 's', 0), bool('rotate_title')] : []),
        // commandes du thermostat : désactivées par défaut, proposées seulement avec un thermostat lié
        ...(this._c && this._c.entity_climate ? [{ type: 'grid', name: '', schema: ['show_hvac_modes', 'show_fan_modes', 'show_preset_modes'].map((name) => ({ name, selector: { boolean: {} }, default: false })) }] : []),
        { type: 'grid', name: '', schema: [tr('comfort_temp_min', 5, 30, Math.round(tmp.c(19))), tr('comfort_temp_max', 10, 40, Math.round(tmp.c(25))),
          num('humidity_min', 0, 100, 1, '%', 35), num('humidity_max', 0, 100, 1, '%', 65)] },
        { type: 'grid', name: '', schema: [tr('alert_temp_min', -20, 30), tr('alert_temp_max', 10, 50), num('alert_humidity_min', 0, 100, 1, '%'), num('alert_humidity_max', 0, 100, 1, '%')] },
        { type: 'grid', name: '', schema: [num('mold_humidity', 40, 100, 1, '%', 70), num('window_drop', 0, 10, 0.1, u), num('battery_low', 0, 100, 1, '%', 20)] },
        { type: 'grid', name: '', schema: [{ name: 'history_popup_background', selector: { color_rgb: {} } }, num('history_popup_opacity', 0, 100, 1, '%', 95)] },
        { type: 'grid', name: '', schema: [sel('history_days', [['1', 'h24'], ['7', 'd7'], ['30', 'd30']]), sel('history_mode', [['both', 'both'], ['temperature', 'temperature'], ['humidity', 'humidity']])] },
        { type: 'grid', name: '', schema: [sel('tap_action', [['history', 'tap_history'], ['more-info', 'tap_more_info'], ['navigate', 'tap_navigate'], ['none', 'tap_none']]),
          ...(this._c && this._c.tap_action === 'navigate' ? [{ name: 'navigation_path', selector: { text: {} } }] : [])] },
        ...((this._c && (this._c.variant || this._c.style)) === 'lcd' ? [sel('lcd_color', [['auto', 'lcd_auto'], ['green', 'lcd_green'], ['blue', 'lcd_blue'], ['amber', 'lcd_amber']])] : []),
        { type: 'grid', name: '', schema: [color('color_comfort'), color('color_cool'), color('color_warm'), color('color_humidity'), color('color_dry'), color('color_alert')] },
        window.applianceTempField,
        window.applianceLanguageField(T),
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'labels', selector: { object: {} } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_humidity'), bool('show_outdoor'), bool('show_dew_point'), bool('show_advice'), bool('show_graph'), bool('show_trend'), bool('animations'), { name: 'transparent', selector: { boolean: {} } }] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
  }
  customElements.define(TAG + '-editor', ApplianceRoomClimateCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Température et humidité d\'une pièce, animées : confort, alertes, point de rosée, conseil d\'aération, fenêtre ouverte, batterie, historique 24 h / 7 j / 30 j.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
