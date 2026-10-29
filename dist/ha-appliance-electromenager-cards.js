/*!
 * HA Appliance Cards
 * Lovelace cards for household appliances: washer, dryer, dishwasher,
 * water heater, oven, microwave, refrigerator, air fryer, coffee maker, TV, range hood, air conditioning,
 * heated towel rail, server rack, desktop PC, laptop, aquarium, Linky meter,
 * home battery, EV charger, robot vacuum, robot mower, pellet boiler…
 * MIT License
 */
(() => {
"use strict";
const VERSION = "1.35.1";

/* ------------------------------------------------------------------ */
/* i18n — strings live in src/i18n/<lang>.json, inlined by build.js    */
/* ------------------------------------------------------------------ */
const STRINGS = {
  "en": {
    "washer": "Washing machine",
    "dryer": "Dryer",
    "dishwasher": "Dishwasher",
    "water_heater": "Water heater",
    "oven": "Oven",
    "microwave": "Microwave",
    "air_fryer": "Air fryer",
    "coffee_maker": "Coffee maker",
    "tv": "TV",
    "range_hood": "Range hood",
    "beer_tap": "Beer tap",
    "av_receiver": "Home cinema amplifier",
    "fan": "Fan",
    "ceiling_fan": "Ceiling fan",
    "generic": "Generic appliance (custom image)",
    "towel_dryer": "Heated towel rail",
    "server_rack": "Server rack (homelab)",
    "desktop_pc": "Desktop PC",
    "laptop": "Laptop",
    "tool_charger": "Tool battery charger",
    "charging": "Charging",
    "charged": "Charged",
    "battery": "Battery",
    "f_battery_level": "Battery level sensor (%)",
    "f_standby_threshold": "Charged (maintenance) above (W)",
    "online": "Online",
    "f_max_power_rack": "Max load (W)",
    "f_power_solar": "Solar surplus power sensor (W)",
    "f_energy_solar": "Solar surplus energy sensor (kWh)",
    "solar_surplus": "Solar surplus",
    "mode_off": "Off",
    "wine_cooler": "Wine cooler",
    "f_max_temperature_wine": "Alert above (°C)",
    "f_fridge_style": "Refrigerator layout",
    "zone_top": "Upper zone",
    "zone_bottom": "Lower zone",
    "f_zone2_temperature": "Lower zone temperature sensor (dual-zone)",
    "f_max_temperature_2": "Lower zone alert above (°C)",
    "f_show_modes": "Show mode buttons",
    "f_show_power": "Show power",
    "grid": "Grid",
    "energy_grid": "Grid energy",
    "energy_solar": "Solar energy",
    "ac_split": "Air conditioner (indoor)",
    "heat_pump": "Heat pump (outdoor unit)",
    "ac_dry": "Drying",
    "ac_fan": "Fan only",
    "at_target": "At target",
    "defrost": "Defrosting",
    "f_hvac": "Mode without climate entity",
    "screen_on": "On",
    "lights": "Lights only",
    "f_light": "Light entity (optional)",
    "brewing": "Brewing",
    "keep_warm": "Keeping warm",
    "f_style": "Coffee maker type",
    "f_tv_style": "TV stand",
    "f_warm_threshold": "Keep-warm / ready above (W)",
    "fridge": "Refrigerator",
    "pellet_stove": "Pellet stove",
    "pool_pump": "Pool pump",
    "printer_3d": "3D printer",
    "chest_freezer": "Chest freezer",
    "drawer_freezer": "Upright freezer",
    "solar": "Solar panels",
    "vmc": "Extractor fan",
    "hob": "Cooktop",
    "radiator": "Electric radiator",
    "comfort": "Comfort",
    "eco": "Eco",
    "frost": "Frost protection",
    "window_open": "Window open",
    "f_mode": "Mode entity (pilot wire, select…)",
    "f_window": "Window sensor",
    "f_max_power_rad": "Radiator power (W)",
    "cooking": "Cooking",
    "residual": "Residual heat",
    "zones": "Active zones",
    "f_zone_power": "Power of one zone (W)",
    "f_zone_1": "Front-left zone (level or W)",
    "f_zone_2": "Front-right zone",
    "f_zone_3": "Back-left zone",
    "f_zone_4": "Back-right zone",
    "f_residual_minutes": "Residual heat display (min)",
    "speed1": "Low speed",
    "speed2": "High speed",
    "humid": "High humidity",
    "humidity": "Humidity",
    "f_humidity": "Humidity sensor (%)",
    "f_high_threshold": "High speed above (W)",
    "f_humidity_max": "Humidity alert above (%)",
    "producing": "Producing",
    "low": "Low production",
    "night": "Night",
    "production": "Production",
    "savings": "Savings",
    "f_sun_entity": "Sun entity",
    "f_max_power_solar": "Peak power (Wp)",
    "printing": "Printing",
    "paused": "Paused",
    "failed": "Failed",
    "progress": "Progress",
    "nozzle": "Nozzle",
    "bed": "Bed",
    "f_bed_temperature": "Bed temperature sensor",
    "f_filament_color": "Filament color (CSS)",
    "f_image": "Image URL (e.g. /local/my-device.png)",
    "f_nozzle_temperatures": "Nozzle temperature sensors (T0, T1…)",
    "filtering": "Filtering",
    "water": "Water",
    "today": "Today",
    "speed": "Speed",
    "f_runtime": "Filtration time today sensor",
    "f_speed": "Speed sensor (rpm or %)",
    "f_max_power": "Max power at full speed (W)",
    "ignition": "Igniting",
    "extinguishing": "Shutting down",
    "alarm": "Alarm",
    "pellets": "Pellets",
    "pellets_low": "Low pellets",
    "level": "Level",
    "f_power_level": "Heat level sensor (1-5)",
    "f_pellet_level": "Pellet level sensor (%)",
    "f_ignition_threshold": "Ignition above (W)",
    "f_pellet_alert": "Low pellet alert below (%)",
    "off": "Off",
    "idle": "Idle",
    "standby": "Standby",
    "running": "Running",
    "finished": "Finished",
    "heating": "Heating",
    "ready": "Ready",
    "preheating": "Preheating",
    "cooling": "Cooling",
    "door_open": "Door open",
    "unavailable": "Unavailable",
    "too_warm": "Too warm",
    "ph_wash": "Washing",
    "ph_rinse": "Rinsing",
    "ph_spin": "Spinning",
    "ph_dry": "Drying",
    "ph_cool": "Cooling down",
    "power": "Power",
    "energy": "Energy",
    "cost": "Cost",
    "remaining": "Remaining",
    "program": "Program",
    "temperature": "Temperature",
    "target": "Target",
    "fridge_temp": "Fridge",
    "freezer_temp": "Freezer",
    "ends_at": "Ends at",
    "toggle": "Turn on/off",
    "confirm_off": "Cycle running – click again to cut power",
    "f_name": "Name",
    "f_labels": "Custom tile labels (key: text)",
    "f_entity": "Status entity (switch, sensor, input_select…)",
    "f_power": "Power sensor (W)",
    "f_energy": "Energy sensor (kWh)",
    "f_cost": "Cost sensor",
    "f_remaining": "Remaining time sensor",
    "f_progress": "Progress sensor (%)",
    "f_program": "Program / phase sensor",
    "f_door": "Door sensor",
    "f_switch": "Switch to toggle (optional)",
    "f_threshold": "Running threshold (W)",
    "f_temperature": "Temperature sensor",
    "f_target_temperature": "Target temperature sensor",
    "f_freezer_temperature": "Freezer temperature sensor",
    "f_freezer_door": "Freezer door sensor",
    "f_max_temperature": "Fridge alert above (°C)",
    "f_freezer_max_temperature": "Freezer alert above (°C)",
    "f_color": "Accent color (CSS)",
    "f_animations": "Animations",
    "f_confirm_off": "Confirm before cutting power during a cycle",
    "err_need_entity": "Set at least one of `entity`, `power`, `switch` or `temperature`.",
    "of_peak": "of peak",
    "lcd_night": "NIGHT",
    "lcd_ignition": "IGNIT",
    "lcd_extinguishing": "COOL",
    "lcd_brewing": "BREW",
    "lcd_ready": "READY",
    "pouring": "Pouring",
    "playing": "Playing",
    "muted": "Muted",
    "keg": "Keg",
    "keg_low": "Keg almost empty",
    "f_keg_level": "Keg level sensor (%)",
    "f_pouring": "Pouring sensor (optional)",
    "fan_1": "Speed 1",
    "fan_2": "Speed 2",
    "fan_3": "Speed 3",
    "f_oscillating": "Oscillation",
    "f_mid_threshold": "Speed 2 above (W)",
    "ph_heat": "Heating",
    "f_heating_power": "Heating phase threshold (W)",
    "f_spin_power": "Spinning phase threshold (W)",
    "f_images": "Images by state (list: image + above / below / state)",
    "energy_day": "Today",
    "energy_week": "This week",
    "energy_month": "This month",
    "f_energy_period": "Energy shown (counter or period)",
    "flex_temp": "Flex zone",
    "f_flex_temperature": "Flex zone temperature sensor",
    "f_flex_max_temperature": "Alert flex zone above (°C)",
    "f_illustration_size": "Illustration size",
    "f_transparent": "Transparent background"
  },
  "de": {
    "washer": "Waschmaschine",
    "dryer": "Wäschetrockner",
    "dishwasher": "Geschirrspüler",
    "water_heater": "Warmwasserspeicher",
    "oven": "Backofen",
    "microwave": "Mikrowelle",
    "air_fryer": "Heißluftfritteuse",
    "coffee_maker": "Kaffeemaschine",
    "tv": "Fernseher",
    "range_hood": "Dunstabzugshaube",
    "beer_tap": "Zapfanlage",
    "av_receiver": "Heimkino-Verstärker",
    "fan": "Ventilator",
    "ceiling_fan": "Deckenventilator",
    "generic": "Generisches Gerät (eigenes Bild)",
    "towel_dryer": "Handtuchheizkörper",
    "server_rack": "Serverschrank (Homelab)",
    "desktop_pc": "Desktop-PC",
    "laptop": "Laptop",
    "tool_charger": "Werkzeug-Akkuladegerät",
    "charging": "Lädt",
    "charged": "Geladen",
    "battery": "Akku",
    "f_battery_level": "Akkustand-Sensor (%)",
    "f_standby_threshold": "Geladen (Erhaltung) über (W)",
    "online": "Online",
    "f_max_power_rack": "Maximale Last (W)",
    "f_power_solar": "Sensor Solarüberschuss-Leistung (W)",
    "f_energy_solar": "Sensor Solarüberschuss-Energie (kWh)",
    "solar_surplus": "Solarüberschuss",
    "mode_off": "Aus",
    "wine_cooler": "Weinkühlschrank",
    "f_max_temperature_wine": "Alarm über (°C)",
    "f_fridge_style": "Kühlschrank-Bauform",
    "zone_top": "Obere Zone",
    "zone_bottom": "Untere Zone",
    "f_zone2_temperature": "Temperatursensor untere Zone (Zwei-Zonen)",
    "f_max_temperature_2": "Alarm untere Zone über (°C)",
    "f_show_modes": "Modus-Tasten anzeigen",
    "f_show_power": "Leistung anzeigen",
    "grid": "Netz",
    "energy_grid": "Netzenergie",
    "energy_solar": "Solarenergie",
    "ac_split": "Klimagerät (Innengerät)",
    "heat_pump": "Wärmepumpe (Außengerät)",
    "ac_dry": "Entfeuchten",
    "ac_fan": "Nur Lüfter",
    "at_target": "Sollwert erreicht",
    "defrost": "Abtauen",
    "f_hvac": "Modus ohne Klima-Entität",
    "screen_on": "Ein",
    "lights": "Nur Beleuchtung",
    "f_light": "Licht-Entität (optional)",
    "brewing": "Brüht",
    "keep_warm": "Warmhalten",
    "f_style": "Kaffeemaschinentyp",
    "f_tv_style": "Fernseher-Fuß",
    "f_warm_threshold": "Warmhalten / bereit über (W)",
    "fridge": "Kühlschrank",
    "pellet_stove": "Pelletofen",
    "pool_pump": "Poolpumpe",
    "printer_3d": "3D-Drucker",
    "chest_freezer": "Gefriertruhe",
    "drawer_freezer": "Gefrierschrank",
    "solar": "Solarmodule",
    "vmc": "Badlüfter",
    "hob": "Kochfeld",
    "radiator": "Elektroheizkörper",
    "comfort": "Komfort",
    "eco": "Eco",
    "frost": "Frostschutz",
    "window_open": "Fenster offen",
    "f_mode": "Modus-Entität (Steuerleitung, Auswahl…)",
    "f_window": "Fenstersensor",
    "f_max_power_rad": "Heizkörperleistung (W)",
    "cooking": "Kochen",
    "residual": "Restwärme",
    "zones": "Aktive Kochzonen",
    "f_zone_power": "Leistung einer Kochzone (W)",
    "f_zone_1": "Kochzone vorne links (Stufe oder W)",
    "f_zone_2": "Kochzone vorne rechts",
    "f_zone_3": "Kochzone hinten links",
    "f_zone_4": "Kochzone hinten rechts",
    "f_residual_minutes": "Restwärmeanzeige (min)",
    "speed1": "Niedrige Stufe",
    "speed2": "Hohe Stufe",
    "humid": "Hohe Luftfeuchtigkeit",
    "humidity": "Luftfeuchtigkeit",
    "f_humidity": "Feuchtigkeitssensor (%)",
    "f_high_threshold": "Hohe Stufe über (W)",
    "f_humidity_max": "Feuchtigkeitsalarm über (%)",
    "producing": "Erzeugt",
    "low": "Geringe Erzeugung",
    "night": "Nacht",
    "production": "Erzeugung",
    "savings": "Ersparnis",
    "f_sun_entity": "Sonnen-Entität",
    "f_max_power_solar": "Spitzenleistung (Wp)",
    "printing": "Druckt",
    "paused": "Pausiert",
    "failed": "Fehlgeschlagen",
    "progress": "Fortschritt",
    "nozzle": "Düse",
    "bed": "Druckbett",
    "f_bed_temperature": "Sensor Druckbetttemperatur",
    "f_filament_color": "Filamentfarbe (CSS)",
    "f_image": "Bild-URL (z. B. /local/mein-geraet.png)",
    "f_nozzle_temperatures": "Düsentemperatursensoren (T0, T1…)",
    "filtering": "Filtert",
    "water": "Wasser",
    "today": "Heute",
    "speed": "Drehzahl",
    "f_runtime": "Sensor Filterlaufzeit heute",
    "f_speed": "Drehzahlsensor (U/min oder %)",
    "f_max_power": "Maximale Leistung bei voller Drehzahl (W)",
    "ignition": "Zündung",
    "extinguishing": "Abschaltung",
    "alarm": "Alarm",
    "pellets": "Pellets",
    "pellets_low": "Pellets niedrig",
    "level": "Stufe",
    "f_power_level": "Sensor Heizstufe (1-5)",
    "f_pellet_level": "Sensor Pelletfüllstand (%)",
    "f_ignition_threshold": "Zündung über (W)",
    "f_pellet_alert": "Pelletalarm unter (%)",
    "off": "Aus",
    "idle": "Inaktiv",
    "standby": "Standby",
    "running": "Läuft",
    "finished": "Fertig",
    "heating": "Heizt",
    "ready": "Bereit",
    "preheating": "Vorheizen",
    "cooling": "Kühlt",
    "door_open": "Tür offen",
    "unavailable": "Nicht verfügbar",
    "too_warm": "Zu warm",
    "ph_wash": "Waschen",
    "ph_rinse": "Spülen",
    "ph_spin": "Schleudern",
    "ph_dry": "Trocknen",
    "ph_cool": "Abkühlen",
    "power": "Leistung",
    "energy": "Energie",
    "cost": "Kosten",
    "remaining": "Restzeit",
    "program": "Programm",
    "temperature": "Temperatur",
    "target": "Sollwert",
    "fridge_temp": "Kühlschrank",
    "freezer_temp": "Gefrierfach",
    "ends_at": "Endet um",
    "toggle": "Ein/Aus",
    "confirm_off": "Zyklus läuft – erneut klicken zum Abschalten",
    "f_name": "Name",
    "f_labels": "Eigene Kachelbeschriftungen (Schlüssel: Text)",
    "f_entity": "Status-Entität (switch, sensor, input_select…)",
    "f_power": "Leistungssensor (W)",
    "f_energy": "Energiesensor (kWh)",
    "f_cost": "Kostensensor",
    "f_remaining": "Restzeitsensor",
    "f_progress": "Fortschrittssensor (%)",
    "f_program": "Programm-/Phasensensor",
    "f_door": "Türsensor",
    "f_switch": "Zu schaltender Schalter (optional)",
    "f_threshold": "Betriebsschwelle (W)",
    "f_temperature": "Temperatursensor",
    "f_target_temperature": "Sollwertsensor",
    "f_freezer_temperature": "Gefrierfach-Temperatursensor",
    "f_freezer_door": "Gefrierfach-Türsensor",
    "f_max_temperature": "Kühlschrankalarm über (°C)",
    "f_freezer_max_temperature": "Gefrierfachalarm über (°C)",
    "f_color": "Akzentfarbe (CSS)",
    "f_animations": "Animationen",
    "f_confirm_off": "Abschalten während eines Zyklus bestätigen",
    "err_need_entity": "Mindestens eines von `entity`, `power`, `switch` oder `temperature` angeben.",
    "of_peak": "der Spitzenleistung",
    "lcd_night": "NACHT",
    "lcd_ignition": "ZÜND",
    "lcd_extinguishing": "STOP",
    "lcd_brewing": "BRÜHT",
    "lcd_ready": "BEREIT",
    "pouring": "Zapft",
    "playing": "Wiedergabe",
    "muted": "Stumm",
    "keg": "Fass",
    "keg_low": "Fass fast leer",
    "f_keg_level": "Fassfüllstand-Sensor (%)",
    "f_pouring": "Zapf-Sensor (optional)",
    "fan_1": "Stufe 1",
    "fan_2": "Stufe 2",
    "fan_3": "Stufe 3",
    "f_oscillating": "Oszillation",
    "f_mid_threshold": "Stufe 2 ab (W)",
    "ph_heat": "Aufheizen",
    "f_heating_power": "Schwellenwert für Heizphase (W)",
    "f_spin_power": "Schwellenwert für Schleuderphase (W)",
    "f_images": "Bilder nach Zustand (Liste: image + above / below / state)",
    "energy_day": "Heute",
    "energy_week": "Diese Woche",
    "energy_month": "Dieser Monat",
    "f_energy_period": "Angezeigte Energie (Zähler oder Zeitraum)",
    "flex_temp": "Flex-Zone",
    "f_flex_temperature": "Temperatursensor Flex-Zone",
    "f_flex_max_temperature": "Alarm Flex-Zone über (°C)",
    "f_illustration_size": "Größe der Illustration",
    "f_transparent": "Transparenter Hintergrund"
  },
  "fr": {
    "washer": "Lave-linge",
    "dryer": "Sèche-linge",
    "dishwasher": "Lave-vaisselle",
    "water_heater": "Ballon d'eau chaude",
    "oven": "Four",
    "microwave": "Micro-ondes",
    "air_fryer": "Airfryer",
    "coffee_maker": "Cafetière",
    "tv": "Téléviseur",
    "range_hood": "Hotte aspirante",
    "beer_tap": "Pompe à bière",
    "av_receiver": "Ampli home cinéma",
    "fan": "Ventilateur",
    "ceiling_fan": "Ventilateur de plafond",
    "generic": "Appareil générique (image perso)",
    "towel_dryer": "Sèche-serviettes",
    "server_rack": "Baie informatique (homelab)",
    "desktop_pc": "PC fixe",
    "laptop": "PC portable",
    "tool_charger": "Chargeur de batterie d'outils",
    "charging": "En charge",
    "charged": "Chargée",
    "battery": "Batterie",
    "f_battery_level": "Capteur de niveau de batterie (%)",
    "f_standby_threshold": "Chargée (maintien) au-dessus de (W)",
    "online": "En ligne",
    "f_max_power_rack": "Charge max (W)",
    "f_power_solar": "Capteur de puissance surplus solaire (W)",
    "f_energy_solar": "Capteur d'énergie surplus solaire (kWh)",
    "solar_surplus": "Surplus solaire",
    "mode_off": "Arrêt",
    "wine_cooler": "Cave à vin",
    "f_max_temperature_wine": "Alerte au-dessus de (°C)",
    "f_fridge_style": "Type de réfrigérateur",
    "zone_top": "Zone haute",
    "zone_bottom": "Zone basse",
    "f_zone2_temperature": "Capteur de température zone basse (bi-zone)",
    "f_max_temperature_2": "Alerte zone basse au-dessus de (°C)",
    "f_show_modes": "Afficher les boutons de mode",
    "f_show_power": "Afficher la puissance",
    "grid": "Réseau",
    "energy_grid": "Énergie réseau",
    "energy_solar": "Énergie solaire",
    "ac_split": "Climatiseur (split)",
    "heat_pump": "Pompe à chaleur (ext.)",
    "ac_dry": "Déshumidification",
    "ac_fan": "Ventilation",
    "at_target": "Consigne atteinte",
    "defrost": "Dégivrage",
    "f_hvac": "Mode sans entité climate",
    "screen_on": "Allumée",
    "lights": "Éclairage",
    "f_light": "Entité d'éclairage (optionnel)",
    "brewing": "Préparation du café",
    "keep_warm": "Maintien au chaud",
    "f_style": "Type de cafetière",
    "f_tv_style": "Pied de la télé",
    "f_warm_threshold": "Maintien au chaud / prête au-dessus de (W)",
    "fridge": "Réfrigérateur",
    "pellet_stove": "Poêle à granulés",
    "pool_pump": "Pompe de piscine",
    "printer_3d": "Imprimante 3D",
    "chest_freezer": "Congélateur coffre",
    "drawer_freezer": "Congélateur à tiroirs",
    "solar": "Panneaux solaires",
    "vmc": "VMC",
    "hob": "Plaques de cuisson",
    "radiator": "Radiateur",
    "comfort": "Confort",
    "eco": "Éco",
    "frost": "Hors-gel",
    "window_open": "Fenêtre ouverte",
    "f_mode": "Entité de mode (fil pilote, liste…)",
    "f_window": "Capteur de fenêtre",
    "f_max_power_rad": "Puissance du radiateur (W)",
    "cooking": "Cuisson",
    "residual": "Chaleur résiduelle",
    "zones": "Foyers actifs",
    "f_zone_power": "Puissance d'un foyer (W)",
    "f_zone_1": "Foyer avant gauche (niveau ou W)",
    "f_zone_2": "Foyer avant droit",
    "f_zone_3": "Foyer arrière gauche",
    "f_zone_4": "Foyer arrière droit",
    "f_residual_minutes": "Affichage chaleur résiduelle (min)",
    "speed1": "Petite vitesse",
    "speed2": "Grande vitesse",
    "humid": "Humidité élevée",
    "humidity": "Humidité",
    "f_humidity": "Capteur d'humidité (%)",
    "f_high_threshold": "Grande vitesse au-dessus de (W)",
    "f_humidity_max": "Alerte humidité au-dessus de (%)",
    "producing": "Production",
    "low": "Production faible",
    "night": "Nuit",
    "production": "Production",
    "savings": "Économies",
    "f_sun_entity": "Entité soleil",
    "f_max_power_solar": "Puissance crête (Wc)",
    "printing": "Impression",
    "paused": "En pause",
    "failed": "Échec",
    "progress": "Progression",
    "nozzle": "Buse",
    "bed": "Plateau",
    "f_bed_temperature": "Capteur de température du plateau",
    "f_filament_color": "Couleur du filament (CSS)",
    "f_image": "URL de l'image (ex. /local/mon-appareil.png)",
    "f_nozzle_temperatures": "Capteurs de température des buses (T0, T1…)",
    "filtering": "Filtration",
    "water": "Eau",
    "today": "Aujourd'hui",
    "speed": "Vitesse",
    "f_runtime": "Capteur de durée de filtration du jour",
    "f_speed": "Capteur de vitesse (tr/min ou %)",
    "f_max_power": "Puissance max à pleine vitesse (W)",
    "ignition": "Allumage",
    "extinguishing": "Extinction",
    "alarm": "Alarme",
    "pellets": "Granulés",
    "pellets_low": "Granulés bas",
    "level": "Niveau",
    "f_power_level": "Capteur de puissance de chauffe (1-5)",
    "f_pellet_level": "Capteur de niveau de granulés (%)",
    "f_ignition_threshold": "Allumage au-dessus de (W)",
    "f_pellet_alert": "Alerte granulés sous (%)",
    "off": "Éteint",
    "idle": "Inactif",
    "standby": "Veille",
    "running": "En cours",
    "finished": "Terminé",
    "heating": "En chauffe",
    "ready": "Prêt",
    "preheating": "Préchauffage",
    "cooling": "Refroidit",
    "door_open": "Porte ouverte",
    "unavailable": "Indisponible",
    "too_warm": "Trop chaud",
    "ph_wash": "Lavage",
    "ph_rinse": "Rinçage",
    "ph_spin": "Essorage",
    "ph_dry": "Séchage",
    "ph_cool": "Refroidissement",
    "power": "Puissance",
    "energy": "Énergie",
    "cost": "Coût",
    "remaining": "Restant",
    "program": "Programme",
    "temperature": "Température",
    "target": "Consigne",
    "fridge_temp": "Frigo",
    "freezer_temp": "Congélateur",
    "ends_at": "Fin à",
    "toggle": "Allumer/éteindre",
    "confirm_off": "Cycle en cours – cliquer encore pour couper",
    "f_name": "Nom",
    "f_labels": "Libellés perso des tuiles (clé : texte)",
    "f_entity": "Entité d'état (switch, sensor, input_select…)",
    "f_power": "Capteur de puissance (W)",
    "f_energy": "Capteur d'énergie (kWh)",
    "f_cost": "Capteur de coût",
    "f_remaining": "Capteur de temps restant",
    "f_progress": "Capteur de progression (%)",
    "f_program": "Capteur de programme / phase",
    "f_door": "Capteur de porte",
    "f_switch": "Interrupteur à piloter (optionnel)",
    "f_threshold": "Seuil de fonctionnement (W)",
    "f_temperature": "Capteur de température",
    "f_target_temperature": "Capteur de consigne",
    "f_freezer_temperature": "Capteur température congélateur",
    "f_freezer_door": "Capteur porte congélateur",
    "f_max_temperature": "Alerte frigo au-dessus de (°C)",
    "f_freezer_max_temperature": "Alerte congélateur au-dessus de (°C)",
    "f_color": "Couleur d'accent (CSS)",
    "f_animations": "Animations",
    "f_confirm_off": "Confirmer avant de couper pendant un cycle",
    "err_need_entity": "Indique au moins `entity`, `power`, `switch` ou `temperature`.",
    "of_peak": "de la crête",
    "lcd_night": "NUIT",
    "lcd_ignition": "ALLUM",
    "lcd_extinguishing": "EXTIN",
    "lcd_brewing": "CAFE",
    "lcd_ready": "PRET",
    "pouring": "Service en cours",
    "playing": "En lecture",
    "muted": "Muet",
    "keg": "Fût",
    "keg_low": "Fût presque vide",
    "f_keg_level": "Capteur de niveau du fût (%)",
    "f_pouring": "Capteur de service (optionnel)",
    "fan_1": "Vitesse 1",
    "fan_2": "Vitesse 2",
    "fan_3": "Vitesse 3",
    "f_oscillating": "Oscillation",
    "f_mid_threshold": "Vitesse 2 au-dessus de (W)",
    "ph_heat": "Chauffe",
    "f_heating_power": "Seuil de phase de chauffe (W)",
    "f_spin_power": "Seuil de phase d'essorage (W)",
    "f_images": "Images selon l'état (liste : image + above / below / state)",
    "energy_day": "Aujourd'hui",
    "energy_week": "Cette semaine",
    "energy_month": "Ce mois",
    "f_energy_period": "Énergie affichée (compteur ou période)",
    "flex_temp": "Zone flex",
    "f_flex_temperature": "Capteur température zone flex",
    "f_flex_max_temperature": "Alerte zone flex au-dessus de (°C)",
    "f_illustration_size": "Taille de l'illustration",
    "f_transparent": "Fond transparent"
  },
  "nb": {
    "f_illustration_size": "Størrelse på illustrasjonen",
    "f_transparent": "Gjennomsiktig bakgrunn",
    "flex_temp": "Fleksisone",
    "f_flex_temperature": "Temperatursensor fleksisone",
    "f_flex_max_temperature": "Varsle fleksisone over (°C)",
    "energy_day": "I dag",
    "energy_week": "Denne uken",
    "energy_month": "Denne måneden",
    "f_energy_period": "Vist energi (teller eller periode)",
    "washer": "Vaskemaskin",
    "dryer": "Tørketrommel",
    "dishwasher": "Oppvaskmaskin",
    "water_heater": "Varmtvannsbereder",
    "oven": "Stekeovn",
    "microwave": "Mikrobølgeovn",
    "air_fryer": "Airfryer",
    "coffee_maker": "Kaffetrakter",
    "tv": "TV",
    "range_hood": "Kjøkkenvifte",
    "beer_tap": "Øltapper",
    "av_receiver": "Hjemmekino-forsterker",
    "fan": "Vifte",
    "ceiling_fan": "Takvifte",
    "generic": "Generisk apparat (eget bilde)",
    "towel_dryer": "Håndklevarmer",
    "server_rack": "Serverrack (homelab)",
    "desktop_pc": "Stasjonær PC",
    "laptop": "Bærbar PC",
    "tool_charger": "Batterilader for verktøy",
    "charging": "Lader",
    "charged": "Ladet",
    "battery": "Batteri",
    "f_battery_level": "Batterinivå-sensor (%)",
    "f_standby_threshold": "Ladet (vedlikehold) over (W)",
    "online": "Tilkoblet",
    "f_max_power_rack": "Maks last (W)",
    "f_power_solar": "Sensor for soloverskudd (W)",
    "f_energy_solar": "Energisensor for soloverskudd (kWh)",
    "solar_surplus": "Soloverskudd",
    "mode_off": "Av",
    "wine_cooler": "Vinkjøleskap",
    "f_max_temperature_wine": "Varsel over (°C)",
    "f_fridge_style": "Kjøleskapstype",
    "zone_top": "Øvre sone",
    "zone_bottom": "Nedre sone",
    "f_zone2_temperature": "Temperatursensor nedre sone (to soner)",
    "f_max_temperature_2": "Varsel nedre sone over (°C)",
    "f_show_modes": "Vis modusknapper",
    "f_show_power": "Vis effekt",
    "grid": "Strømnett",
    "energy_grid": "Energi fra nettet",
    "energy_solar": "Solenergi",
    "ac_split": "Klimaanlegg (innedel)",
    "heat_pump": "Varmepumpe (utedel)",
    "ac_dry": "Avfukting",
    "ac_fan": "Bare vifte",
    "at_target": "Ved måltemperatur",
    "defrost": "Avriming",
    "f_hvac": "Modus uten klima-entitet",
    "screen_on": "På",
    "lights": "Bare lys",
    "f_light": "Lys-entitet (valgfri)",
    "brewing": "Trakter",
    "keep_warm": "Holder varm",
    "f_style": "Type kaffetrakter",
    "f_tv_style": "TV-fot",
    "f_warm_threshold": "Holder varm / klar over (W)",
    "fridge": "Kjøleskap",
    "pellet_stove": "Pelletsovn",
    "pool_pump": "Bassengpumpe",
    "printer_3d": "3D-skriver",
    "chest_freezer": "Fryseboks",
    "drawer_freezer": "Fryseskap",
    "solar": "Solcellepaneler",
    "vmc": "Avtrekksvifte",
    "hob": "Koketopp",
    "radiator": "Panelovn",
    "comfort": "Komfort",
    "eco": "Øko",
    "frost": "Frostsikring",
    "window_open": "Vindu åpent",
    "f_mode": "Modus-entitet (styretråd, select…)",
    "f_window": "Vindussensor",
    "f_max_power_rad": "Ovnens effekt (W)",
    "cooking": "Koker",
    "residual": "Restvarme",
    "zones": "Aktive soner",
    "f_zone_power": "Effekt for én sone (W)",
    "f_zone_1": "Sone foran venstre (nivå eller W)",
    "f_zone_2": "Sone foran høyre",
    "f_zone_3": "Sone bak venstre",
    "f_zone_4": "Sone bak høyre",
    "f_residual_minutes": "Vis restvarme i (min)",
    "speed1": "Lav hastighet",
    "speed2": "Høy hastighet",
    "humid": "Høy fukt",
    "humidity": "Fuktighet",
    "f_humidity": "Fuktsensor (%)",
    "f_high_threshold": "Høy hastighet over (W)",
    "f_humidity_max": "Fuktvarsel over (%)",
    "producing": "Produserer",
    "low": "Lav produksjon",
    "night": "Natt",
    "production": "Produksjon",
    "savings": "Besparelse",
    "f_sun_entity": "Sol-entitet",
    "f_max_power_solar": "Toppeffekt (Wp)",
    "printing": "Skriver ut",
    "paused": "Pause",
    "failed": "Feilet",
    "progress": "Fremdrift",
    "nozzle": "Dyse",
    "bed": "Plate",
    "f_bed_temperature": "Sensor for platetemperatur",
    "f_filament_color": "Filamentfarge (CSS)",
    "f_image": "Bilde-URL (f.eks. /local/min-enhet.png)",
    "f_images": "Bilder etter tilstand (liste: image + above / below / state)",
    "f_nozzle_temperatures": "Dysetemperatursensorer (T0, T1…)",
    "filtering": "Filtrerer",
    "water": "Vann",
    "today": "I dag",
    "speed": "Hastighet",
    "f_runtime": "Sensor for filtreringstid i dag",
    "f_speed": "Hastighetssensor (rpm eller %)",
    "f_max_power": "Maks effekt ved full hastighet (W)",
    "ignition": "Tenner",
    "extinguishing": "Slukker",
    "alarm": "Alarm",
    "pellets": "Pellets",
    "pellets_low": "Lite pellets",
    "level": "Nivå",
    "f_power_level": "Sensor for varmenivå (1-5)",
    "f_pellet_level": "Sensor for pelletsnivå (%)",
    "f_ignition_threshold": "Tenning over (W)",
    "f_pellet_alert": "Varsel lite pellets under (%)",
    "off": "Av",
    "idle": "Inaktiv",
    "standby": "Hvilemodus",
    "running": "I gang",
    "finished": "Ferdig",
    "heating": "Varmer",
    "ready": "Klar",
    "preheating": "Forvarmer",
    "cooling": "Kjøler",
    "door_open": "Døren er åpen",
    "unavailable": "Utilgjengelig",
    "too_warm": "For varmt",
    "ph_wash": "Vasker",
    "ph_rinse": "Skyller",
    "ph_spin": "Sentrifugerer",
    "ph_dry": "Tørker",
    "ph_cool": "Kjøler ned",
    "power": "Effekt",
    "energy": "Energi",
    "cost": "Kostnad",
    "remaining": "Gjenstår",
    "program": "Program",
    "temperature": "Temperatur",
    "target": "Mål",
    "fridge_temp": "Kjøleskap",
    "freezer_temp": "Fryser",
    "ends_at": "Ferdig kl.",
    "toggle": "Slå på/av",
    "confirm_off": "Syklus pågår – trykk igjen for å bryte strømmen",
    "f_name": "Navn",
    "f_labels": "Egne flisetiketter (nøkkel: tekst)",
    "f_entity": "Status-entitet (switch, sensor, input_select…)",
    "f_power": "Effektsensor (W)",
    "f_energy": "Energisensor (kWh)",
    "f_cost": "Kostnadssensor",
    "f_remaining": "Sensor for gjenstående tid",
    "f_progress": "Fremdriftssensor (%)",
    "f_program": "Sensor for program / fase",
    "f_door": "Dørsensor",
    "f_switch": "Bryter som slås av/på (valgfri)",
    "f_threshold": "Terskel for «i gang» (W)",
    "f_temperature": "Temperatursensor",
    "f_target_temperature": "Sensor for måltemperatur",
    "f_freezer_temperature": "Temperatursensor fryser",
    "f_freezer_door": "Dørsensor fryser",
    "f_max_temperature": "Varsel kjøleskap over (°C)",
    "f_freezer_max_temperature": "Varsel fryser over (°C)",
    "f_color": "Aksentfarge (CSS)",
    "f_animations": "Animasjoner",
    "f_confirm_off": "Bekreft før strømmen brytes under en syklus",
    "err_need_entity": "Angi minst én av `entity`, `power`, `switch` eller `temperature`.",
    "of_peak": "av topp",
    "lcd_night": "NATT",
    "lcd_ignition": "TENN",
    "lcd_extinguishing": "KJØL",
    "lcd_brewing": "TRAKT",
    "lcd_ready": "KLAR",
    "pouring": "Tapper",
    "playing": "Spiller",
    "muted": "Dempet",
    "keg": "Fat",
    "keg_low": "Fatet er nesten tomt",
    "f_keg_level": "Fatnivå-sensor (%)",
    "f_pouring": "Tappesensor (valgfri)",
    "fan_1": "Hastighet 1",
    "fan_2": "Hastighet 2",
    "fan_3": "Hastighet 3",
    "f_oscillating": "Svinging",
    "f_mid_threshold": "Hastighet 2 over (W)",
    "ph_heat": "Oppvarming",
    "f_heating_power": "Effektterskel for oppvarming (W)",
    "f_spin_power": "Effektterskel for sentrifugering (W)"
  },
  "nl": {
    "washer": "Wasmachine",
    "dryer": "Droogkast",
    "dishwasher": "Vaatwasser",
    "water_heater": "Boiler",
    "oven": "Oven",
    "microwave": "Microgolfoven",
    "air_fryer": "Airfryer",
    "coffee_maker": "Koffiezetapparaat",
    "tv": "Tv",
    "range_hood": "Dampkap",
    "beer_tap": "Biertap",
    "av_receiver": "Thuisbioscoopversterker",
    "fan": "Ventilator",
    "ceiling_fan": "Plafondventilator",
    "generic": "Algemeen toestel (eigen afbeelding)",
    "towel_dryer": "Handdoekradiator",
    "server_rack": "Serverkast (homelab)",
    "desktop_pc": "Desktop-pc",
    "laptop": "Laptop",
    "tool_charger": "Acculader voor gereedschap",
    "charging": "Opladen",
    "charged": "Opgeladen",
    "battery": "Accu",
    "f_battery_level": "Accuniveausensor (%)",
    "f_standby_threshold": "Opgeladen (onderhoud) boven (W)",
    "online": "Online",
    "f_max_power_rack": "Maximale belasting (W)",
    "f_power_solar": "Vermogenssensor zonne-overschot (W)",
    "f_energy_solar": "Energiesensor zonne-overschot (kWh)",
    "solar_surplus": "Zonne-overschot",
    "mode_off": "Uit",
    "wine_cooler": "Wijnkoelkast",
    "f_max_temperature_wine": "Alarm boven (°C)",
    "f_fridge_style": "Type koelkast",
    "zone_top": "Bovenste zone",
    "zone_bottom": "Onderste zone",
    "f_zone2_temperature": "Temperatuursensor onderste zone (twee zones)",
    "f_max_temperature_2": "Alarm onderste zone boven (°C)",
    "f_show_modes": "Modusknoppen tonen",
    "f_show_power": "Vermogen tonen",
    "grid": "Net",
    "energy_grid": "Energie van het net",
    "energy_solar": "Zonne-energie",
    "ac_split": "Airco (binnenunit)",
    "heat_pump": "Warmtepomp (buitenunit)",
    "ac_dry": "Ontvochtigen",
    "ac_fan": "Enkel ventilatie",
    "at_target": "Doeltemperatuur bereikt",
    "defrost": "Ontdooien",
    "f_hvac": "Modus zonder climate-entiteit",
    "screen_on": "Aan",
    "lights": "Enkel verlichting",
    "f_light": "Lichtentiteit (optioneel)",
    "brewing": "Koffie zetten",
    "keep_warm": "Warmhouden",
    "f_style": "Type koffiezetapparaat",
    "f_tv_style": "Tv-voet",
    "f_warm_threshold": "Warmhouden / klaar boven (W)",
    "fridge": "Koelkast",
    "pellet_stove": "Pelletkachel",
    "pool_pump": "Zwembadpomp",
    "printer_3d": "3D-printer",
    "chest_freezer": "Diepvrieskist",
    "drawer_freezer": "Diepvriezer met lades",
    "solar": "Zonnepanelen",
    "vmc": "Badkamerventilator",
    "hob": "Kookplaat",
    "radiator": "Elektrische radiator",
    "comfort": "Comfort",
    "eco": "Eco",
    "frost": "Vorstbeveiliging",
    "window_open": "Raam open",
    "f_mode": "Modusentiteit (stuurdraad, select…)",
    "f_window": "Raamsensor",
    "f_max_power_rad": "Vermogen radiator (W)",
    "cooking": "Koken",
    "residual": "Restwarmte",
    "zones": "Actieve zones",
    "f_zone_power": "Vermogen van één zone (W)",
    "f_zone_1": "Zone linksvoor (stand of W)",
    "f_zone_2": "Zone rechtsvoor",
    "f_zone_3": "Zone linksachter",
    "f_zone_4": "Zone rechtsachter",
    "f_residual_minutes": "Restwarmte tonen (min)",
    "speed1": "Lage stand",
    "speed2": "Hoge stand",
    "humid": "Hoge vochtigheid",
    "humidity": "Vochtigheid",
    "f_humidity": "Vochtigheidssensor (%)",
    "f_high_threshold": "Hoge stand boven (W)",
    "f_humidity_max": "Vochtigheidsalarm boven (%)",
    "producing": "Produceert",
    "low": "Lage productie",
    "night": "Nacht",
    "production": "Productie",
    "savings": "Besparing",
    "f_sun_entity": "Zon-entiteit",
    "f_max_power_solar": "Piekvermogen (Wp)",
    "printing": "Aan het printen",
    "paused": "Gepauzeerd",
    "failed": "Mislukt",
    "progress": "Voortgang",
    "nozzle": "Spuitmond",
    "bed": "Bed",
    "f_bed_temperature": "Sensor bedtemperatuur",
    "f_filament_color": "Filamentkleur (CSS)",
    "f_image": "Afbeeldings-URL (bv. /local/mijn-toestel.png)",
    "f_nozzle_temperatures": "Sensoren spuitmondtemperatuur (T0, T1…)",
    "filtering": "Filteren",
    "water": "Water",
    "today": "Vandaag",
    "speed": "Snelheid",
    "f_runtime": "Sensor filtertijd vandaag",
    "f_speed": "Snelheidssensor (tpm of %)",
    "f_max_power": "Maximaal vermogen op volle snelheid (W)",
    "ignition": "Aansteken",
    "extinguishing": "Uitdoven",
    "alarm": "Alarm",
    "pellets": "Pellets",
    "pellets_low": "Pellets bijna op",
    "level": "Stand",
    "f_power_level": "Sensor verwarmingsstand (1-5)",
    "f_pellet_level": "Sensor pelletniveau (%)",
    "f_ignition_threshold": "Aansteken boven (W)",
    "f_pellet_alert": "Alarm pellets bijna op onder (%)",
    "off": "Uit",
    "idle": "Inactief",
    "standby": "Stand-by",
    "running": "Bezig",
    "finished": "Klaar",
    "heating": "Verwarmen",
    "ready": "Klaar voor gebruik",
    "preheating": "Voorverwarmen",
    "cooling": "Koelen",
    "door_open": "Deur open",
    "unavailable": "Niet beschikbaar",
    "too_warm": "Te warm",
    "ph_wash": "Wassen",
    "ph_rinse": "Spoelen",
    "ph_spin": "Centrifugeren",
    "ph_dry": "Drogen",
    "ph_cool": "Afkoelen",
    "power": "Vermogen",
    "energy": "Energie",
    "cost": "Kost",
    "remaining": "Resterend",
    "program": "Programma",
    "temperature": "Temperatuur",
    "target": "Doel",
    "fridge_temp": "Koelkast",
    "freezer_temp": "Diepvries",
    "ends_at": "Klaar om",
    "toggle": "Aan/uit",
    "confirm_off": "Cyclus bezig – klik nog eens om de stroom te onderbreken",
    "f_name": "Naam",
    "f_labels": "Eigen tegellabels (sleutel: tekst)",
    "f_entity": "Statusentiteit (switch, sensor, input_select…)",
    "f_power": "Vermogenssensor (W)",
    "f_energy": "Energiesensor (kWh)",
    "f_cost": "Kostsensor",
    "f_remaining": "Sensor resterende tijd",
    "f_progress": "Voortgangssensor (%)",
    "f_program": "Programma- / fasesensor",
    "f_door": "Deursensor",
    "f_switch": "Schakelaar om te bedienen (optioneel)",
    "f_threshold": "Drempel voor 'bezig' (W)",
    "f_temperature": "Temperatuursensor",
    "f_target_temperature": "Sensor doeltemperatuur",
    "f_freezer_temperature": "Temperatuursensor diepvries",
    "f_freezer_door": "Deursensor diepvries",
    "f_max_temperature": "Alarm koelkast boven (°C)",
    "f_freezer_max_temperature": "Alarm diepvries boven (°C)",
    "f_color": "Accentkleur (CSS)",
    "f_animations": "Animaties",
    "f_confirm_off": "Bevestigen voor de stroom tijdens een cyclus wordt onderbroken",
    "err_need_entity": "Stel minstens één van `entity`, `power`, `switch` of `temperature` in.",
    "of_peak": "van piek",
    "lcd_night": "NACHT",
    "lcd_ignition": "START",
    "lcd_extinguishing": "KOEL",
    "lcd_brewing": "ZET",
    "lcd_ready": "KLAAR",
    "pouring": "Tappen",
    "playing": "Speelt af",
    "muted": "Gedempt",
    "keg": "Vat",
    "keg_low": "Vat bijna leeg",
    "f_keg_level": "Sensor vatniveau (%)",
    "f_pouring": "Tapsensor (optioneel)",
    "fan_1": "Stand 1",
    "fan_2": "Stand 2",
    "fan_3": "Stand 3",
    "f_oscillating": "Zwenken",
    "f_mid_threshold": "Stand 2 boven (W)",
    "ph_heat": "Verwarmen",
    "f_heating_power": "Drempelwaarde verwarmingsfase (W)",
    "f_spin_power": "Drempelwaarde centrifugeerfase (W)",
    "f_images": "Afbeeldingen per toestand (lijst: image + above / below / state)",
    "energy_day": "Vandaag",
    "energy_week": "Deze week",
    "energy_month": "Deze maand",
    "f_energy_period": "Getoonde energie (teller of periode)",
    "flex_temp": "Flexzone",
    "f_flex_temperature": "Temperatuursensor flexzone",
    "f_flex_max_temperature": "Alarm flexzone boven (°C)",
    "f_illustration_size": "Grootte van de illustratie",
    "f_transparent": "Transparante achtergrond"
  },
  "ro": {
    "washer": "Mașină de spălat rufe",
    "dryer": "Uscător de rufe",
    "dishwasher": "Mașină de spălat vase",
    "water_heater": "Boiler",
    "oven": "Cuptor",
    "microwave": "Cuptor cu microunde",
    "air_fryer": "Friteuză cu aer cald",
    "coffee_maker": "Aparat de cafea",
    "tv": "Televizor",
    "range_hood": "Hotă",
    "beer_tap": "Dozator de bere",
    "av_receiver": "Amplificator home cinema",
    "fan": "Ventilator",
    "ceiling_fan": "Ventilator de tavan",
    "generic": "Aparat generic (imagine personalizată)",
    "towel_dryer": "Radiator port-prosop",
    "server_rack": "Rack de servere (homelab)",
    "desktop_pc": "PC desktop",
    "laptop": "Laptop",
    "tool_charger": "Încărcător baterii scule",
    "charging": "Se încarcă",
    "charged": "Încărcată",
    "battery": "Baterie",
    "f_battery_level": "Senzor nivel baterie (%)",
    "f_standby_threshold": "Încărcată (întreținere) peste (W)",
    "online": "Online",
    "f_max_power_rack": "Sarcină maximă (W)",
    "f_power_solar": "Senzor putere surplus solar (W)",
    "f_energy_solar": "Senzor energie surplus solar (kWh)",
    "solar_surplus": "Surplus solar",
    "mode_off": "Oprit",
    "wine_cooler": "Vinotecă",
    "f_max_temperature_wine": "Alertă peste (°C)",
    "f_fridge_style": "Tip frigider",
    "zone_top": "Zona de sus",
    "zone_bottom": "Zona de jos",
    "f_zone2_temperature": "Senzor temperatură zona de jos (două zone)",
    "f_max_temperature_2": "Alertă zona de jos peste (°C)",
    "f_show_modes": "Afișează butoanele de mod",
    "f_show_power": "Afișează puterea",
    "grid": "Rețea",
    "energy_grid": "Energie din rețea",
    "energy_solar": "Energie solară",
    "ac_split": "Aer condiționat (unitate interioară)",
    "heat_pump": "Pompă de căldură (unitate exterioară)",
    "ac_dry": "Dezumidificare",
    "ac_fan": "Doar ventilator",
    "at_target": "Temperatură atinsă",
    "defrost": "Dezghețare",
    "f_hvac": "Mod fără entitate climate",
    "screen_on": "Pornit",
    "lights": "Doar iluminat",
    "f_light": "Entitate lumină (opțional)",
    "brewing": "Se prepară",
    "keep_warm": "Menținere la cald",
    "f_style": "Tip de aparat de cafea",
    "f_tv_style": "Suport televizor",
    "f_warm_threshold": "Menținere la cald / gata peste (W)",
    "fridge": "Frigider",
    "pellet_stove": "Sobă pe peleți",
    "pool_pump": "Pompă de piscină",
    "printer_3d": "Imprimantă 3D",
    "chest_freezer": "Congelator orizontal",
    "drawer_freezer": "Congelator vertical",
    "solar": "Panouri solare",
    "vmc": "Ventilator de extracție",
    "hob": "Plită",
    "radiator": "Radiator electric",
    "comfort": "Confort",
    "eco": "Eco",
    "frost": "Protecție la îngheț",
    "window_open": "Fereastră deschisă",
    "f_mode": "Entitate de mod (fir pilot, select…)",
    "f_window": "Senzor de fereastră",
    "f_max_power_rad": "Puterea radiatorului (W)",
    "cooking": "Se gătește",
    "residual": "Căldură reziduală",
    "zones": "Zone active",
    "f_zone_power": "Puterea unei zone (W)",
    "f_zone_1": "Zonă față-stânga (nivel sau W)",
    "f_zone_2": "Zonă față-dreapta",
    "f_zone_3": "Zonă spate-stânga",
    "f_zone_4": "Zonă spate-dreapta",
    "f_residual_minutes": "Afișare căldură reziduală (min)",
    "speed1": "Viteză mică",
    "speed2": "Viteză mare",
    "humid": "Umiditate ridicată",
    "humidity": "Umiditate",
    "f_humidity": "Senzor de umiditate (%)",
    "f_high_threshold": "Viteză mare peste (W)",
    "f_humidity_max": "Alertă umiditate peste (%)",
    "producing": "Produce",
    "low": "Producție redusă",
    "night": "Noapte",
    "production": "Producție",
    "savings": "Economii",
    "f_sun_entity": "Entitate soare",
    "f_max_power_solar": "Putere de vârf (Wp)",
    "printing": "Se printează",
    "paused": "În pauză",
    "failed": "Eșuat",
    "progress": "Progres",
    "nozzle": "Duză",
    "bed": "Platformă",
    "f_bed_temperature": "Senzor temperatură platformă",
    "f_filament_color": "Culoare filament (CSS)",
    "f_image": "URL imagine (ex. /local/aparatul-meu.png)",
    "f_nozzle_temperatures": "Senzori temperatură duze (T0, T1…)",
    "filtering": "Filtrare",
    "water": "Apă",
    "today": "Azi",
    "speed": "Viteză",
    "f_runtime": "Senzor durată filtrare azi",
    "f_speed": "Senzor de viteză (rpm sau %)",
    "f_max_power": "Putere maximă la viteză maximă (W)",
    "ignition": "Aprindere",
    "extinguishing": "Oprire",
    "alarm": "Alarmă",
    "pellets": "Peleți",
    "pellets_low": "Peleți puțini",
    "level": "Nivel",
    "f_power_level": "Senzor nivel de încălzire (1-5)",
    "f_pellet_level": "Senzor nivel peleți (%)",
    "f_ignition_threshold": "Aprindere peste (W)",
    "f_pellet_alert": "Alertă peleți sub (%)",
    "off": "Oprit",
    "idle": "Inactiv",
    "standby": "Standby",
    "running": "Funcționează",
    "finished": "Terminat",
    "heating": "Se încălzește",
    "ready": "Gata",
    "preheating": "Preîncălzire",
    "cooling": "Se răcește",
    "door_open": "Ușă deschisă",
    "unavailable": "Indisponibil",
    "too_warm": "Prea cald",
    "ph_wash": "Spălare",
    "ph_rinse": "Clătire",
    "ph_spin": "Centrifugare",
    "ph_dry": "Uscare",
    "ph_cool": "Răcire",
    "power": "Putere",
    "energy": "Energie",
    "cost": "Cost",
    "remaining": "Rămas",
    "program": "Program",
    "temperature": "Temperatură",
    "target": "Țintă",
    "fridge_temp": "Frigider",
    "freezer_temp": "Congelator",
    "ends_at": "Se termină la",
    "toggle": "Pornește/oprește",
    "confirm_off": "Ciclu în desfășurare – apasă din nou pentru a tăia alimentarea",
    "f_name": "Nume",
    "f_labels": "Etichete proprii pentru plăci (cheie: text)",
    "f_entity": "Entitate de stare (switch, sensor, input_select…)",
    "f_power": "Senzor de putere (W)",
    "f_energy": "Senzor de energie (kWh)",
    "f_cost": "Senzor de cost",
    "f_remaining": "Senzor timp rămas",
    "f_progress": "Senzor de progres (%)",
    "f_program": "Senzor program / fază",
    "f_door": "Senzor de ușă",
    "f_switch": "Comutator de controlat (opțional)",
    "f_threshold": "Prag de funcționare (W)",
    "f_temperature": "Senzor de temperatură",
    "f_target_temperature": "Senzor temperatură țintă",
    "f_freezer_temperature": "Senzor temperatură congelator",
    "f_freezer_door": "Senzor ușă congelator",
    "f_max_temperature": "Alertă frigider peste (°C)",
    "f_freezer_max_temperature": "Alertă congelator peste (°C)",
    "f_color": "Culoare de accent (CSS)",
    "f_animations": "Animații",
    "f_confirm_off": "Confirmă înainte de a tăia alimentarea în timpul unui ciclu",
    "err_need_entity": "Setează cel puțin una dintre `entity`, `power`, `switch` sau `temperature`.",
    "of_peak": "din vârf",
    "lcd_night": "NOAPTE",
    "lcd_ignition": "APRIND",
    "lcd_extinguishing": "STING",
    "lcd_brewing": "CAFEA",
    "lcd_ready": "GATA",
    "pouring": "Se toarnă",
    "playing": "Se redă",
    "muted": "Mut",
    "keg": "Butoi",
    "keg_low": "Butoi aproape gol",
    "f_keg_level": "Senzor nivel butoi (%)",
    "f_pouring": "Senzor de turnare (opțional)",
    "fan_1": "Viteză 1",
    "fan_2": "Viteză 2",
    "fan_3": "Viteză 3",
    "f_oscillating": "Oscilație",
    "f_mid_threshold": "Viteză 2 peste (W)",
    "ph_heat": "Încălzire",
    "f_heating_power": "Prag de putere pentru încălzire (W)",
    "f_spin_power": "Prag de putere pentru centrifugare (W)",
    "f_images": "Imagini după stare (listă: image + above / below / state)",
    "energy_day": "Azi",
    "energy_week": "Săptămâna aceasta",
    "energy_month": "Luna aceasta",
    "f_energy_period": "Energie afișată (contor sau perioadă)",
    "flex_temp": "Zonă flex",
    "f_flex_temperature": "Senzor temperatură zonă flex",
    "f_flex_max_temperature": "Alertă zonă flex peste (°C)",
    "f_illustration_size": "Dimensiunea ilustrației",
    "f_transparent": "Fundal transparent"
  },
  "ru": {
    "washer": "Стиральная машина",
    "dryer": "Сушильная машина",
    "dishwasher": "Посудомоечная машина",
    "water_heater": "Водонагреватель",
    "oven": "Духовой шкаф",
    "microwave": "Микроволновая печь",
    "air_fryer": "Аэрогриль",
    "coffee_maker": "Кофемашина",
    "tv": "Телевизор",
    "range_hood": "Вытяжка",
    "beer_tap": "Пивной кран",
    "av_receiver": "Усилитель домашнего кинотеатра",
    "fan": "Вентилятор",
    "ceiling_fan": "Потолочный вентилятор",
    "generic": "Универсальный прибор (своё изображение)",
    "towel_dryer": "Полотенцесушитель",
    "server_rack": "Серверная стойка (homelab)",
    "desktop_pc": "Настольный ПК",
    "laptop": "Ноутбук",
    "tool_charger": "Зарядное устройство для инструмента",
    "charging": "Зарядка",
    "charged": "Заряжено",
    "battery": "Батарея",
    "f_battery_level": "Датчик уровня заряда (%)",
    "f_standby_threshold": "Заряжено (поддержание) выше (Вт)",
    "online": "В сети",
    "f_max_power_rack": "Макс. нагрузка (Вт)",
    "f_power_solar": "Датчик избытка солнечной энергии (Вт)",
    "f_energy_solar": "Датчик избыточной солнечной энергии (кВт·ч)",
    "solar_surplus": "Избыток солнца",
    "mode_off": "Выкл.",
    "wine_cooler": "Винный шкаф",
    "f_max_temperature_wine": "Оповещать выше (°C)",
    "f_fridge_style": "Компоновка холодильника",
    "zone_top": "Верхняя зона",
    "zone_bottom": "Нижняя зона",
    "f_zone2_temperature": "Датчик температуры нижней зоны (двухзонный)",
    "f_max_temperature_2": "Оповещать для нижней зоны выше (°C)",
    "f_show_modes": "Показывать кнопки режимов",
    "f_show_power": "Показывать мощность",
    "grid": "Сеть",
    "energy_grid": "Энергия из сети",
    "energy_solar": "Солнечная энергия",
    "ac_split": "Кондиционер (внутренний блок)",
    "heat_pump": "Тепловой насос (наружный блок)",
    "ac_dry": "Осушение",
    "ac_fan": "Только вентилятор",
    "at_target": "Достигнута цель",
    "defrost": "Разморозка",
    "f_hvac": "Режим без климатической сущности",
    "screen_on": "Вкл.",
    "lights": "Только свет",
    "f_light": "Сущность света (необязательно)",
    "brewing": "Приготовление",
    "keep_warm": "Поддержание тепла",
    "f_style": "Тип кофемашины",
    "f_tv_style": "Подставка ТВ",
    "f_warm_threshold": "Поддержание тепла / готово выше (Вт)",
    "fridge": "Холодильник",
    "pellet_stove": "Пеллетная печь",
    "pool_pump": "Насос бассейна",
    "printer_3d": "3D-принтер",
    "chest_freezer": "Морозильный ларь",
    "drawer_freezer": "Морозильный шкаф",
    "solar": "Солнечные панели",
    "vmc": "Вытяжной вентилятор",
    "hob": "Варочная панель",
    "radiator": "Электрический радиатор",
    "comfort": "Комфорт",
    "eco": "Эко",
    "frost": "Защита от заморозки",
    "window_open": "Окно открыто",
    "f_mode": "Сущность режима (pilot wire, select…)",
    "f_window": "Датчик окна",
    "f_max_power_rad": "Мощность радиатора (Вт)",
    "cooking": "Готовка",
    "residual": "Остаточное тепло",
    "zones": "Активные зоны",
    "f_zone_power": "Мощность одной зоны (Вт)",
    "f_zone_1": "Зона спереди слева (уровень или Вт)",
    "f_zone_2": "Зона спереди справа",
    "f_zone_3": "Зона сзади слева",
    "f_zone_4": "Зона сзади справа",
    "f_residual_minutes": "Показ остаточного тепла (мин)",
    "speed1": "Низкая скорость",
    "speed2": "Высокая скорость",
    "humid": "Высокая влажность",
    "humidity": "Влажность",
    "f_humidity": "Датчик влажности (%)",
    "f_high_threshold": "Высокая скорость выше (Вт)",
    "f_humidity_max": "Оповещать о влажности выше (%)",
    "producing": "Выработка",
    "low": "Низкая выработка",
    "night": "Ночь",
    "production": "Выработка",
    "savings": "Экономия",
    "f_sun_entity": "Сущность солнца",
    "f_max_power_solar": "Пиковая мощность (Вт·п)",
    "printing": "Печать",
    "paused": "Пауза",
    "failed": "Ошибка",
    "progress": "Прогресс",
    "nozzle": "Сопло",
    "bed": "Стол",
    "f_bed_temperature": "Датчик температуры стола",
    "f_filament_color": "Цвет филамента (CSS)",
    "f_image": "URL изображения (напр. /local/my-device.png)",
    "f_nozzle_temperatures": "Датчики температуры сопел (T0, T1…)",
    "filtering": "Фильтрация",
    "water": "Вода",
    "today": "Сегодня",
    "speed": "Скорость",
    "f_runtime": "Датчик времени фильтрации за сегодня",
    "f_speed": "Датчик скорости (об/мин или %)",
    "f_max_power": "Макс. мощность на полной скорости (Вт)",
    "ignition": "Розжиг",
    "extinguishing": "Выключение",
    "alarm": "Тревога",
    "pellets": "Пеллеты",
    "pellets_low": "Мало пеллет",
    "level": "Уровень",
    "f_power_level": "Датчик уровня нагрева (1-5)",
    "f_pellet_level": "Датчик уровня пеллет (%)",
    "f_ignition_threshold": "Розжиг выше (Вт)",
    "f_pellet_alert": "Оповещать о низком уровне пеллет ниже (%)",
    "off": "Выкл.",
    "idle": "Простой",
    "standby": "Ожидание",
    "running": "Работает",
    "finished": "Завершено",
    "heating": "Нагрев",
    "ready": "Готово",
    "preheating": "Предварительный нагрев",
    "cooling": "Охлаждение",
    "door_open": "Дверца открыта",
    "unavailable": "Недоступно",
    "too_warm": "Слишком тепло",
    "ph_wash": "Стирка",
    "ph_rinse": "Полоскание",
    "ph_spin": "Отжим",
    "ph_dry": "Сушка",
    "ph_cool": "Остывание",
    "power": "Мощность",
    "energy": "Энергия",
    "cost": "Стоимость",
    "remaining": "Осталось",
    "program": "Программа",
    "temperature": "Температура",
    "target": "Цель",
    "fridge_temp": "Холодильник",
    "freezer_temp": "Морозильник",
    "ends_at": "Окончание в",
    "toggle": "Вкл./выкл.",
    "confirm_off": "Цикл выполняется – нажмите ещё раз, чтобы отключить питание",
    "f_name": "Название",
    "f_labels": "Свои подписи плиток (ключ: текст)",
    "f_entity": "Сущность статуса (switch, sensor, input_select…)",
    "f_power": "Датчик мощности (Вт)",
    "f_energy": "Датчик энергии (кВт·ч)",
    "f_cost": "Датчик стоимости",
    "f_remaining": "Датчик оставшегося времени",
    "f_progress": "Датчик прогресса (%)",
    "f_program": "Датчик программы / фазы",
    "f_door": "Датчик дверцы",
    "f_switch": "Переключатель для управления (необязательно)",
    "f_threshold": "Порог работы (Вт)",
    "f_temperature": "Датчик температуры",
    "f_target_temperature": "Датчик целевой температуры",
    "f_freezer_temperature": "Датчик температуры морозильника",
    "f_freezer_door": "Датчик дверцы морозильника",
    "f_max_temperature": "Оповещать для холодильника выше (°C)",
    "f_freezer_max_temperature": "Оповещать для морозильника выше (°C)",
    "f_color": "Акцентный цвет (CSS)",
    "f_animations": "Анимации",
    "f_confirm_off": "Подтверждать перед отключением питания во время цикла",
    "err_need_entity": "Задайте хотя бы одно из `entity`, `power`, `switch` или `temperature`.",
    "of_peak": "от пика",
    "lcd_night": "НОЧЬ",
    "lcd_ignition": "РОЗЖИГ",
    "lcd_extinguishing": "ОСТЫВ",
    "lcd_brewing": "ВАРКА",
    "lcd_ready": "ГОТОВО",
    "pouring": "Налив",
    "playing": "Воспроизведение",
    "muted": "Без звука",
    "keg": "Кега",
    "keg_low": "Кега почти пуста",
    "f_keg_level": "Датчик уровня кеги (%)",
    "f_pouring": "Датчик налива (необязательно)",
    "fan_1": "Скорость 1",
    "fan_2": "Скорость 2",
    "fan_3": "Скорость 3",
    "f_oscillating": "Поворот",
    "f_mid_threshold": "Скорость 2 выше (Вт)",
    "ph_heat": "Нагрев",
    "f_heating_power": "Порог фазы нагрева (Вт)",
    "f_spin_power": "Порог фазы отжима (Вт)",
    "f_images": "Изображения по состоянию (список: image + above / below / state)",
    "energy_day": "Сегодня",
    "energy_week": "На этой неделе",
    "energy_month": "В этом месяце",
    "f_energy_period": "Отображаемая энергия (счётчик или период)",
    "flex_temp": "Флекс-зона",
    "f_flex_temperature": "Датчик температуры флекс-зоны",
    "f_flex_max_temperature": "Оповещать о флекс-зоне выше (°C)",
    "f_illustration_size": "Размер иллюстрации",
    "f_transparent": "Прозрачный фон"
  }
};
const lang = (hass) => {
  let l = ((hass && (hass.locale?.language || hass.language)) || document.documentElement.lang || "en").toLowerCase().slice(0, 2);
  if (l === "no" || l === "nn") l = "nb"; // norvégien : no / nn → nb (bokmål)
  return STRINGS[l] ? l : "en";
};
const tr = (hass, key) => STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;

/* ------------------------------------------------------------------ */
/* Realistic illustrations — viewBox 0 0 120 140, "ID" = unique prefix  */
/* ------------------------------------------------------------------ */
const DEFS = `
<linearGradient id="ID-body" x1="0" x2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d4d9df"/></linearGradient>
<linearGradient id="ID-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f5f7"/><stop offset="1" stop-color="#d9dee3"/></linearGradient>
<linearGradient id="ID-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfcfd"/><stop offset=".3" stop-color="#a3abb4"/><stop offset=".55" stop-color="#eef1f4"/><stop offset=".8" stop-color="#8d959f"/><stop offset="1" stop-color="#c9ced4"/></linearGradient>
<linearGradient id="ID-inox" x1="0" x2="1"><stop offset="0" stop-color="#b9bfc6"/><stop offset=".22" stop-color="#eceff2"/><stop offset=".5" stop-color="#c5cad0"/><stop offset=".75" stop-color="#e6e9ec"/><stop offset="1" stop-color="#a8afb7"/></linearGradient>
<radialGradient id="ID-steel" cx=".42" cy=".38" r=".8"><stop offset="0" stop-color="#eef1f3"/><stop offset=".55" stop-color="#aab2ba"/><stop offset="1" stop-color="#5f6770"/></radialGradient>
<linearGradient id="ID-gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="ID-shadow"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#101317"/></linearGradient>
<radialGradient id="ID-warm" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#ffe2a3"/><stop offset=".6" stop-color="#f3a54a" stop-opacity=".75"/><stop offset="1" stop-color="#7a3b12" stop-opacity=".2"/></radialGradient>
<pattern id="ID-holes" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.25" cy="2.25" r=".75" fill="#4f5760" opacity=".55"/></pattern>
<pattern id="ID-mesh" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".55" fill="#000" opacity=".45"/></pattern>`;

const lcd = (x, y, w, h) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="#0c1720" stroke="#8f98a2" stroke-width=".6"/>
<text class="lcd" x="${x + w / 2}" y="${y + h / 2 + 0.3}" text-anchor="middle" dominant-baseline="central" fill="#7ec8e3">OFF</text>`;

const clothes = `
<g class="clothes">
  <path d="M38 92 q8 -7 17 -2 q4 6 -3 9 q-8 3 -14 -7z" fill="#e5484d"/>
  <path d="M52 95 q9 -9 19 -3 q3 7 -6 9 q-9 2 -13 -6z" fill="#3e8ed0"/>
  <path d="M66 90 q8 -4 13 3 q-1 7 -9 6 q-6 -2 -4 -9z" fill="#f2c94c"/>
  <path d="M44 99 q10 -3 18 3 q-4 6 -12 5 q-6 -2 -6 -8z" fill="#9b6ad6"/>
  <path d="M60 101 q8 -5 15 1 q-3 6 -10 5z" fill="#3fbf7f"/>
  <path d="M41 86 q5 -4 10 0 q-2 4 -6 4z" fill="#ff8fab"/>
</g>`;

const porthole = (cx, cy, inner, tag) => `
<circle cx="${cx}" cy="${cy}" r="${inner + 9}" fill="#000" opacity=".08"/>
<circle cx="${cx}" cy="${cy}" r="${inner + 7}" fill="url(#ID-chrome)"/>
<circle cx="${cx}" cy="${cy}" r="${inner + 3}" fill="#2a2f35"/>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="url(#ID-steel)"/>
<g clip-path="url(#ID-win)">${tag}</g>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="url(#ID-gloss)"/>
<path d="M${cx - inner * 0.72} ${cy - inner * 0.42} a${inner * 0.85} ${inner * 0.85} 0 0 1 ${inner * 0.62} -${inner * 0.48}" stroke="#fff" stroke-opacity=".75" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="${inner}" fill="none" stroke="#000" stroke-opacity=".25"/>`;

const drumInside = (cx, cy, r) => `
<g class="drum">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ID-holes)"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="none" stroke="#8b939c" stroke-opacity=".5"/>
  <path d="M${cx} ${cy - r} l-3 7 h6z M${cx - r * 0.866} ${cy + r / 2} l6.5 -1 l-3 -5.5z M${cx + r * 0.866} ${cy + r / 2} l-6.5 -1 l3 -5.5z" fill="#c9cfd5" stroke="#7d858e" stroke-width=".5"/>
  ${clothes}
</g>`;

const feet = (xs, y) => xs.map((x) => `<rect x="${x}" y="${y}" width="10" height="7" rx="1.5" fill="#3a3f45"/>`).join("");

const cfStyle = (c) => ({ filtre: "filtre", filter: "filtre", drip: "filtre", dosette: "dosette", dosettes: "dosette", pod: "dosette", capsule: "dosette", capsules: "dosette", senseo: "dosette", nespresso: "dosette", expresso: "expresso", espresso: "expresso", grains: "expresso", bean: "expresso", beans: "expresso" }[String(c?.style || "filtre").toLowerCase()] || "filtre");
const SVG = {};

SVG.ac_split = () => `
<defs>${DEFS}
<radialGradient id="ID-acheat" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".45"/><stop offset=".6" stop-color="#ff7a2e" stop-opacity=".15"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-split" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#eef1f4"/><stop offset="1" stop-color="#cfd5db"/></linearGradient></defs>
<ellipse class="ac-warm" cx="60" cy="98" rx="54" ry="30" fill="url(#ID-acheat)"/>
<g class="ac-waves"><path d="M30 122q4-4 0-8t0-8"/><path d="M60 126q4-4 0-8t0-8"/><path d="M90 122q4-4 0-8t0-8"/></g>
<g class="ac-air">
  <path d="M22 84q-6 14 0 26t-2 22"/><path d="M40 84q-4 14 2 26t0 22"/><path d="M60 84q-3 14 3 26t-1 22"/>
  <path d="M80 84q-2 14 4 26t0 22"/><path d="M98 84q0 14 6 26t2 22"/>
</g>
<g class="ac-drops"><circle cx="34" cy="90" r="1.3"/><circle cx="56" cy="92" r="1.3"/><circle cx="76" cy="90" r="1.3"/><circle cx="92" cy="93" r="1.3"/></g>
<path d="M6 54q0-10 10-10h88q10 0 10 10v18q0 6-6 8h-96q-6-2-6-8z" fill="url(#ID-split)" stroke="#aab2ba" stroke-width=".7"/>
<path d="M14 48h92" stroke="#c4cbd2" stroke-width=".6"/>
<path d="M16 51h88M16 53.5h88" stroke="#d7dce1" stroke-width=".5"/>
<path d="M10 70h100" stroke="#fff" stroke-opacity=".9" stroke-width="1"/>
<rect class="ac-slot" x="12" y="73.5" width="96" height="5" rx="2.5" fill="#2a2f35"/>
<g class="ac-flap"><path d="M12 74.5h96q0 4.5-4 5h-88q-4-.5-4-5z" fill="#f2f4f6" stroke="#aab2ba" stroke-width=".5"/></g>
<rect x="84" y="58" width="22" height="9" rx="2" fill="#0c1720" opacity=".9"/>
<text class="lcd" x="95" y="64.6" text-anchor="middle">OFF</text>
<g class="ac-ico ico-cool" stroke="#4fc3f7" stroke-width=".9" stroke-linecap="round"><path d="M78 59v8M74.5 61l7 4M74.5 65l7-4"/></g>
<g class="ac-ico ico-heat"><circle cx="78" cy="63" r="2" fill="#ff8a3d"/><path d="M78 58.6v1.2M78 66.2v1.2M73.6 63h1.2M81.2 63h1.2M74.9 59.9l.8.8M80.3 65.3l.8.8M74.9 66.1l.8-.8M80.3 60.7l.8-.8" stroke="#ff8a3d" stroke-width=".8" stroke-linecap="round"/></g>
<g class="ac-ico ico-dry"><path d="M78 59q-3 4-3 5.6a3 3 0 0 0 6 0q0-1.6-3-5.6z" fill="#7fd6c0"/></g>
<g class="ac-ico ico-fan" stroke="#cfd6dd" stroke-width="1" stroke-linecap="round" fill="none"><path d="M78 63q-3-4 0-4.5M78 63q4-1 3.5 2.4M78 63q-1 4-4 2"/></g>
<circle class="led l1" cx="18" cy="64" r="1.1"/>`;

SVG.air_fryer = () => `
<defs>${DEFS}<clipPath id="ID-w1"><rect x="14" y="58" width="39" height="31" rx="3"/></clipPath><clipPath id="ID-w2"><rect x="67" y="58" width="39" height="31" rx="3"/></clipPath>
<linearGradient id="ID-cav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f45"/><stop offset="1" stop-color="#15181b"/></linearGradient>
<linearGradient id="ID-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#272c32"/><stop offset="1" stop-color="#0b0d10"/></linearGradient>
<linearGradient id="ID-fry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#e09b2d"/></linearGradient>
<radialGradient id="ID-nug" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e9a54c"/><stop offset="1" stop-color="#9c5a1e"/></radialGradient></defs>
<ellipse cx="60" cy="130" rx="56" ry="5" fill="url(#ID-shadow)"/>
<g class="af-steam"><path d="M42 23q-3-5 0-9t0-9"/><path d="M60 23q-3-5 0-9t0-9"/><path d="M78 23q-3-5 0-9t0-9"/></g>
<rect x="10" y="123" width="12" height="5" rx="1.5" fill="#15181b"/><rect x="98" y="123" width="12" height="5" rx="1.5" fill="#15181b"/>
<rect x="5" y="26" width="110" height="100" rx="9" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".8"/>
<path d="M14 27.5h92" stroke="#4a525b" stroke-width=".8" stroke-linecap="round"/>
<rect x="9" y="30" width="102" height="17" rx="4" fill="url(#ID-glass)" stroke="#3a424b" stroke-width=".5"/>
<path d="M11 32h40" stroke="#fff" stroke-opacity=".08" stroke-width="1.2" stroke-linecap="round"/>
${lcd(46, 33, 28, 11)}
<circle class="led l1" cx="41" cy="38.5" r="1.2"/>
<g fill="none" stroke="#7d8792" stroke-width=".7">
  <circle cx="17" cy="38.5" r="2.6"/><path d="M15.6 38.5h2.8"/>
  <circle cx="25" cy="38.5" r="2.6"/><path d="M23.6 38.5h2.8M25 37.1v2.8"/>
  <circle cx="33" cy="38.5" r="2.6"/><path d="M32 37.4l2 1.1l-2 1.1z"/>
  <circle cx="87" cy="38.5" r="2.6"/><path d="M86 37.4l2 1.1l-2 1.1z"/>
  <circle cx="95" cy="38.5" r="2.6"/><path d="M93.6 38.5h2.8M95 37.1v2.8"/>
  <circle cx="103" cy="38.5" r="2.6"/><path d="M103 36.8v1.6M101.5 37.6a2 2 0 1 0 3 0"/>
</g>
<rect x="9" y="52" width="49" height="69" rx="5" fill="url(#ID-inox)" stroke="#6f7780" stroke-width=".6"/>
<rect x="62" y="52" width="49" height="69" rx="5" fill="url(#ID-inox)" stroke="#6f7780" stroke-width=".6"/>
<rect x="12.5" y="56.5" width="42" height="34" rx="4" fill="#15181b"/>
<rect x="65.5" y="56.5" width="42" height="34" rx="4" fill="#15181b"/>
<rect x="14" y="58" width="39" height="31" rx="3" fill="url(#ID-cav)"/>
<rect x="67" y="58" width="39" height="31" rx="3" fill="url(#ID-cav)"/>
<g clip-path="url(#ID-w1)">
  <rect class="ilight" x="14" y="58" width="39" height="31" fill="url(#ID-warm)"/>
  <path class="af-coil" d="M16 61h3l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2h3"/>
  <g class="af-air"><path d="M17 74q7-8 16-3t16-2"/><path d="M17 68q8 5 16 0t16 1"/></g>
  <path d="M15 84h37v5h-37z" fill="url(#ID-mesh)" opacity=".9"/>
  <g class="fries">
    <rect x="18" y="80" width="15" height="3" rx="1" fill="url(#ID-fry)" transform="rotate(-14 25 81)"/>
    <rect x="27" y="78.5" width="14" height="3" rx="1" fill="url(#ID-fry)" transform="rotate(18 34 80)"/>
    <rect x="35" y="80.5" width="15" height="3" rx="1" fill="url(#ID-fry)" transform="rotate(-6 42 82)"/>
    <rect x="21" y="83" width="13" height="3" rx="1" fill="url(#ID-fry)" transform="rotate(8 27 84)"/>
    <rect x="31" y="83.5" width="15" height="3" rx="1" fill="url(#ID-fry)" transform="rotate(-20 38 85)"/>
    <rect x="24" y="76.5" width="12" height="2.8" rx="1" fill="url(#ID-fry)" transform="rotate(32 30 78)"/>
    <rect x="40" y="77.5" width="10" height="2.8" rx="1" fill="url(#ID-fry)" transform="rotate(-38 45 79)"/>
  </g>
</g>
<g clip-path="url(#ID-w2)">
  <rect class="ilight" x="67" y="58" width="39" height="31" fill="url(#ID-warm)"/>
  <path class="af-coil" d="M69 61h3l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2l1.8-2l1.8 2h3"/>
  <g class="af-air"><path d="M70 74q7-8 16-3t16-2"/><path d="M70 68q8 5 16 0t16 1"/></g>
  <path d="M68 84h37v5h-37z" fill="url(#ID-mesh)" opacity=".9"/>
  <g class="nuggets">
    <ellipse cx="75" cy="83" rx="5" ry="3.4" fill="url(#ID-nug)"/>
    <ellipse cx="85" cy="84" rx="5.4" ry="3.2" fill="url(#ID-nug)" transform="rotate(-10 85 84)"/>
    <ellipse cx="96" cy="83" rx="5" ry="3.5" fill="url(#ID-nug)" transform="rotate(12 96 83)"/>
    <ellipse cx="80" cy="79" rx="4.6" ry="3" fill="url(#ID-nug)" transform="rotate(15 80 79)"/>
    <ellipse cx="91" cy="79" rx="4.8" ry="3.1" fill="url(#ID-nug)" transform="rotate(-18 91 79)"/>
    <path d="M73 82.5q2-1 4 0M84 83.5q2-1 4 0M94 82q2-1 4 0M89 78.5q2-1 4 0" stroke="#7a3f12" stroke-width=".6" fill="none" opacity=".7"/>
  </g>
</g>
<path d="M14 72L30 58h9L14 80z" fill="#fff" opacity=".1"/>
<path d="M67 72L83 58h9L67 80z" fill="#fff" opacity=".1"/>
<rect x="14" y="58" width="39" height="31" rx="3" fill="none" stroke="#000" stroke-opacity=".35"/>
<rect x="67" y="58" width="39" height="31" rx="3" fill="none" stroke="#000" stroke-opacity=".35"/>
<rect x="17" y="96" width="33" height="19" rx="4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".5"/>
<rect x="70" y="96" width="33" height="19" rx="4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".5"/>
<path d="M20 98.5h27M73 98.5h27" stroke="#fff" stroke-opacity=".14" stroke-width="1" stroke-linecap="round"/>
<rect x="29" y="105" width="9" height="2.2" rx="1.1" fill="#59616b"/><rect x="82" y="105" width="9" height="2.2" rx="1.1" fill="#59616b"/>
<path d="M11 55l14-1M64 55l14-1" stroke="#fff" stroke-opacity=".5" stroke-width=".8" stroke-linecap="round"/>`;

SVG.av_receiver = () => `
<defs>${DEFS}
<linearGradient id="ID-avb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4048"/><stop offset=".15" stop-color="#1d2126"/><stop offset="1" stop-color="#0d0f12"/></linearGradient>
<radialGradient id="ID-ring" cx=".5" cy=".5" r=".5"><stop offset=".7" stop-color="#38d9ff" stop-opacity="0"/><stop offset=".85" stop-color="#38d9ff" stop-opacity=".9"/><stop offset="1" stop-color="#38d9ff" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="60" cy="104" rx="58" ry="4" fill="url(#ID-shadow)"/>
<g class="av-notes" fill="#9fd3f0"><path d="M30 44v-9l6-2v9"/><circle cx="29" cy="44" r="1.8"/><circle cx="35" cy="42" r="1.8"/><path d="M60 40v-8"/><circle cx="59" cy="40" r="1.8"/><path d="M60 32l4 1.5" stroke="#9fd3f0" stroke-width="1"/><path d="M88 44v-9l6-2v9"/><circle cx="87" cy="44" r="1.8"/><circle cx="93" cy="42" r="1.8"/></g>
<g class="av-waves" fill="none" stroke-linecap="round"><path d="M2 64q-4 8 0 16"/><path d="M-3 60q-6 12 0 24"/><path d="M118 64q4 8 0 16"/><path d="M123 60q6 12 0 24"/></g>
<rect x="10" y="96" width="12" height="5" rx="1.5" fill="#15181b"/><rect x="98" y="96" width="12" height="5" rx="1.5" fill="#15181b"/>
<rect x="4" y="52" width="112" height="45" rx="3.5" fill="url(#ID-avb)" stroke="#000" stroke-width=".6"/>
<path d="M6 54.5h108" stroke="#fff" stroke-opacity=".18" stroke-width="1"/>
<path d="M6 92h108" stroke="#2c3138" stroke-width=".8"/>
<circle class="av-pwr" cx="14" cy="62" r="1.4"/>
<circle cx="16" cy="78" r="6.5" fill="url(#ID-chrome)" stroke="#2a2f35" stroke-width=".6"/>
<circle cx="16" cy="78" r="4.4" fill="#2a2f35"/><path d="M16 78l0-3.6" stroke="#cfd6dd" stroke-width="1" stroke-linecap="round"/>
<rect x="30" y="58" width="52" height="14" rx="2" fill="#071016" stroke="#2c3138" stroke-width=".6"/>
<text class="lcd av-lcd" x="56" y="67.4" text-anchor="middle">OFF</text>
<g class="av-eq">
  <rect x="33" y="76" width="3.2" height="12" rx=".6"/><rect x="38" y="76" width="3.2" height="12" rx=".6"/><rect x="43" y="76" width="3.2" height="12" rx=".6"/>
  <rect x="48" y="76" width="3.2" height="12" rx=".6"/><rect x="53" y="76" width="3.2" height="12" rx=".6"/><rect x="58" y="76" width="3.2" height="12" rx=".6"/>
  <rect x="63" y="76" width="3.2" height="12" rx=".6"/><rect x="68" y="76" width="3.2" height="12" rx=".6"/><rect x="73" y="76" width="3.2" height="12" rx=".6"/>
  <rect x="78" y="76" width="3.2" height="12" rx=".6"/>
</g>
<circle class="av-ring" cx="99" cy="74" r="16" fill="url(#ID-ring)"/>
<circle cx="99" cy="74" r="12.5" fill="url(#ID-chrome)" stroke="#2a2f35" stroke-width=".7"/>
<circle cx="99" cy="74" r="10" fill="url(#ID-steel)"/>
<g class="av-knob"><circle cx="99" cy="66.5" r="1.1" fill="#2a2f35"/></g>
<path d="M92 68a10 10 0 0 1 8-4" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;

SVG.beer_tap = () => `
<defs>${DEFS}<clipPath id="ID-gl"><path d="M85 80h26l-2.4 36q-.2 2-2.2 2h-17.2q-2 0-2.2-2z"/></clipPath><clipPath id="ID-kw"><rect x="26" y="70" width="40" height="34" rx="4"/></clipPath>
<linearGradient id="ID-beer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c948"/><stop offset="1" stop-color="#d8891c"/></linearGradient>
<linearGradient id="ID-glassb" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset=".3" stop-color="#ffffff" stop-opacity=".08"/><stop offset="1" stop-color="#dfe9f2" stop-opacity=".3"/></linearGradient></defs>
<ellipse cx="60" cy="128" rx="54" ry="4.5" fill="url(#ID-shadow)"/>
<g class="bt-mist"><circle cx="16" cy="70" r="3"/><circle cx="14" cy="88" r="2.6"/><circle cx="18" cy="104" r="3.2"/></g>
<rect x="12" y="44" width="68" height="78" rx="10" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<path d="M16 48h60" stroke="#fff" stroke-opacity=".15" stroke-width="1.2" stroke-linecap="round"/>
${lcd(28, 52, 36, 11)}
<g class="bt-flake" stroke="#6fd8ff" stroke-width=".8" stroke-linecap="round"><path d="M22 54.5v6M19.4 56l5.2 3M19.4 59l5.2-3"/></g>
<rect x="24" y="68" width="44" height="38" rx="5" fill="#15181b" stroke="#3a424b" stroke-width=".6"/>
<g clip-path="url(#ID-kw)">
  <rect x="30" y="70" width="32" height="40" rx="3" fill="url(#ID-inox)"/>
  <path d="M30 78h32M30 98h32" stroke="#8f979f" stroke-width="1.2"/>
  <rect x="58" y="72" width="3" height="32" rx="1.5" fill="#2a2f35"/>
  <g class="bt-keg"><rect x="58" y="72" width="3" height="32" rx="1.5" fill="url(#ID-beer)"/></g>
</g>
<path d="M26 70L40 70L26 86z" fill="#fff" opacity=".08"/>
<rect x="76" y="114" width="40" height="7" rx="2" fill="url(#ID-chrome)" stroke="#6f7780" stroke-width=".5"/>
<rect x="79" y="114.5" width="34" height="2" fill="url(#ID-mesh)"/>
<path d="M40 44v-26q0-8 8-8h40q8 0 8 8v10" fill="none" stroke="url(#ID-chrome)" stroke-width="7" stroke-linecap="round"/>
<path d="M40 44v-26q0-8 8-8h40q8 0 8 8v10" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round"/>
<rect x="93" y="27" width="6" height="7" rx="1.5" fill="#8f979f"/>
<g class="bt-handle"><rect x="61" y="-6" width="9" height="16" rx="3" fill="#1d2126" stroke="#000" stroke-width=".5"/><rect x="63" y="-4" width="2" height="12" rx="1" fill="#fff" opacity=".2"/></g>
<rect x="60" y="8" width="11" height="4" rx="1.5" fill="url(#ID-chrome)"/>
<path class="bt-stream" d="M96 34v46"/>
<g clip-path="url(#ID-gl)">
  <g class="bt-beer"><rect x="84" y="80" width="28" height="40" fill="url(#ID-beer)"/><rect x="84" y="80" width="28" height="6" fill="#fff8e6"/></g>
  <g class="bt-bubbles" fill="#fff6c8"><circle cx="92" cy="114" r=".8"/><circle cx="99" cy="116" r=".7"/><circle cx="104" cy="113" r=".9"/><circle cx="95" cy="110" r=".6"/></g>
</g>
<path d="M85 80h26l-2.4 36q-.2 2-2.2 2h-17.2q-2 0-2.2-2z" fill="url(#ID-glassb)" stroke="#d6e2ec" stroke-opacity=".8" stroke-width=".7"/>
<path d="M88 84l1.6 28" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/>
<g class="bt-drops" fill="#cfe9ff"><circle cx="87.5" cy="92" r=".7"/><circle cx="108.5" cy="98" r=".7"/><circle cx="90" cy="104" r=".6"/></g>`;

/* Ventilateur de plafond : pales vues en perspective (disque aplati), bloc moteur, lampe, chaînettes */
SVG.ceiling_fan = () => {
  // une pale vue de dessus, de l'axe (0,0) vers l'extérieur ; le groupe est ensuite aplati en Y
  const blade = (a) => `<g transform="rotate(${a})"><path d="M8 -4L50 -10Q57 0 50 10L8 4z" fill="url(#ID-cfwood)" stroke="#5a3b1e" stroke-width=".8"/><path d="M8 -4L50 -10" stroke="#e8c48f" stroke-width="1" opacity=".7"/><rect x="5" y="-2.4" width="12" height="4.8" rx="1.2" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/></g>`;
  return `
<defs>${DEFS}
<linearGradient id="ID-cfwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8743f"/><stop offset=".5" stop-color="#c9935a"/><stop offset="1" stop-color="#8a5a2b"/></linearGradient>
<linearGradient id="ID-cfbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d959f"/><stop offset=".35" stop-color="#eef1f4"/><stop offset=".7" stop-color="#b7bec6"/><stop offset="1" stop-color="#7d858e"/></linearGradient>
<radialGradient id="ID-cfglass" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dee3"/></radialGradient>
<linearGradient id="ID-cfbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></linearGradient></defs>
<ellipse cx="60" cy="132" rx="40" ry="3.5" fill="url(#ID-shadow)" opacity=".45"/>
<!-- plafond -->
<rect x="0" y="0" width="120" height="6" fill="#000" opacity=".06"/>
<path d="M0 6h120" stroke="#9aa2ab" stroke-opacity=".5" stroke-width=".8"/>
<!-- cône de lumière -->
<path class="cf-beam" d="M50 62L22 132H98L70 62z" fill="url(#ID-cfbeam)"/>
<!-- souffle d'air vers le bas -->
<g class="cf-air" fill="none" stroke-linecap="round"><path d="M24 62q-6 14 0 28t0 28"/><path d="M42 66q-6 14 0 28t0 26"/><path d="M78 66q6 14 0 28t0 26"/><path d="M96 62q6 14 0 28t0 28"/></g>
<!-- rosace et tige -->
<path d="M50 6h20l-3 5h-14z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".5"/>
<rect x="58" y="11" width="4" height="20" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
<!-- pales : disque vu de dessus, aplati pour la perspective -->
<g transform="translate(60 44) scale(1 .3)">
  <circle class="cf-blur" r="56" fill="#c9935a"/>
  <g class="cf-blades">${[0, 90, 180, 270].map(blade).join("")}</g>
</g>
<!-- bloc moteur -->
<path d="M44 34q0-5 16-5t16 5v6q0 6-16 6t-16-6z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".6"/>
<path d="M44 38q16 6 32 0" stroke="#6f7781" stroke-width=".6" fill="none"/>
<ellipse cx="60" cy="31" rx="15" ry="2.6" fill="#fff" opacity=".35"/>
<!-- lampe -->
<path d="M52 46h16l-1 3h-14z" fill="url(#ID-cfbody)" stroke="#6f7781" stroke-width=".4"/>
<path class="cf-glass" d="M51 49h18q0 12-9 12t-9-12z" fill="url(#ID-cfglass)" stroke="#aab2ba" stroke-width=".5"/>
<path d="M54 51q1 6 4 8" stroke="#fff" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"/>
<!-- chaînettes de tirage -->
<g class="cf-chain c1"><path d="M47 44v14" stroke="#aab2ba" stroke-width=".7" stroke-dasharray="1 .6"/><circle cx="47" cy="59" r="1.3" fill="url(#ID-chrome)"/></g>
<g class="cf-chain c2"><path d="M73 44v10" stroke="#aab2ba" stroke-width=".7" stroke-dasharray="1 .6"/><circle cx="73" cy="55" r="1.3" fill="url(#ID-chrome)"/></g>`;
};

SVG.chest_freezer = () => `
<defs>${DEFS}
<linearGradient id="ID-side" x1="0" x2="1"><stop offset="0" stop-color="#cfd5db"/><stop offset="1" stop-color="#aeb6be"/></linearGradient>
<linearGradient id="ID-top" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e8ec"/></linearGradient>
<linearGradient id="ID-cav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f5"/><stop offset="1" stop-color="#f4fbff"/></linearGradient>
<linearGradient id="ID-liner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf0"/><stop offset="1" stop-color="#c9d0d6"/></linearGradient></defs>
<ellipse cx="62" cy="131" rx="54" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="12" y="126" width="9" height="5" rx="1.5" fill="#3a3f45"/><rect x="88" y="126" width="9" height="5" rx="1.5" fill="#3a3f45"/>
<path d="M100 73L112 61V117L100 129Z" fill="url(#ID-side)"/>
<path d="M103 112l6-6M103 116l6-6M103 120l6-6" stroke="#8f979f" stroke-width=".7"/>
<rect x="8" y="73" width="92" height="56" rx="2.5" fill="url(#ID-body)" stroke="#bfc6ce" stroke-width=".7"/>
<rect x="8" y="121" width="92" height="8" rx="2" fill="#e2e6ea"/>
<path d="M76 123.5h20M76 125.5h20M76 127.5h20" stroke="#aab1b9" stroke-width=".6"/>
<rect x="68" y="79" width="28" height="11" rx="2" fill="#0c1720" stroke="#8f98a2" stroke-width=".5"/>
<text class="lcd" x="84.5" y="86.8" text-anchor="middle">--°</text>
<g class="flake"><path d="M72 81.5v6M69.4 83l5.2 3M69.4 86l5.2-3" stroke-width=".8" stroke-linecap="round"/></g>
<circle class="led l1" cx="72" cy="94" r="1.2"/><circle class="led l2" cx="77" cy="94" r="1.2"/>
<g class="cavity">
  <path d="M10 73L98 73L110 61L22 61Z" fill="url(#ID-cav)"/>
  <path d="M10 73L98 73L110 61L22 61Z" fill="#fffbe6" class="clight"/>
  <path d="M22 61L110 61M60 61L50 73" stroke="#9fc3db" stroke-width=".6"/>
  <path d="M18 71l3-4h14l-3 4z" fill="#e5484d"/><path d="M33 71l3-4h12l-3 4z" fill="#3e8ed0"/>
  <path d="M28 66l2.5-3h10l-2.5 3z" fill="#f2c94c"/><path d="M42 66l2.5-3h9l-2.5 3z" fill="#ffffff" stroke="#c9d3dc" stroke-width=".4"/>
  <path d="M58 70l4-5h16l-4 5z" fill="#9fd356" opacity=".9"/><path d="M63 64l2-2.5h10l-2 2.5z" fill="#ff8f3d"/>
  <path d="M80 70l4-5h12l-4 5z" fill="#c4c9cf" stroke="#9aa3ad" stroke-width=".4"/>
</g>
<g class="cold-out"><circle cx="40" cy="58" r="2"/><circle cx="58" cy="56" r="2.4"/><circle cx="76" cy="58" r="1.8"/><circle cx="94" cy="57" r="2.1"/></g>
<g class="lid">
  <path class="lid-side" d="M100 66L112 54L112 61L100 73Z" fill="url(#ID-side)"/>
  <path class="lid-top" d="M8 66L100 66L112 54L20 54Z" fill="url(#ID-top)" stroke="#bfc6ce" stroke-width=".6"/>
  <path class="lid-under" d="M20 54L112 54L112 54L20 54Z" fill="url(#ID-liner)" stroke="#9aa3ad" stroke-width=".6"/>
  <path class="lid-front" d="M8 66L100 66L100 73L8 73Z" fill="#f1f3f5" stroke="#bfc6ce" stroke-width=".6"/>
</g>
<rect class="lid-handle" x="44" y="68.5" width="20" height="2.6" rx="1.3" fill="#7d858e"/>
<g class="mist"><circle cx="30" cy="131" r="1.1"/><circle cx="46" cy="132" r=".9"/><circle cx="64" cy="131" r="1.2"/><circle cx="80" cy="132" r=".9"/></g>`;

SVG.coffee_maker = (c) => {
    const st = cfStyle(c);
    const defs = `<defs>${DEFS}
<linearGradient id="ID-glassv" x1="0" x2="1"><stop offset="0" stop-color="#e8f1f7" stop-opacity=".35"/><stop offset=".3" stop-color="#ffffff" stop-opacity=".12"/><stop offset="1" stop-color="#c9d6e0" stop-opacity=".3"/></linearGradient>
<linearGradient id="ID-cof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4a24"/><stop offset=".15" stop-color="#4a2a14"/><stop offset="1" stop-color="#2a170b"/></linearGradient>
<linearGradient id="ID-mug" x1="0" x2="1"><stop offset="0" stop-color="#e9ecef"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd5db"/></linearGradient>
<linearGradient id="ID-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".55"/><stop offset="1" stop-color="#5fb4ea" stop-opacity=".7"/></linearGradient>`;
    const steam = (xs, y) => `<g class="cf-steam">${xs.map((x) => `<path d="M${x} ${y}q-3-5 0-9t0-9"/>`).join("")}</g>`;
    if (st === "dosette") return `${defs}<clipPath id="ID-cup"><rect x="41" y="84" width="30" height="20" rx="2"/></clipPath></defs>
<g class="cf s-dosette">
<ellipse cx="60" cy="131" rx="44" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="80" y="18" width="18" height="86" rx="6" fill="url(#ID-tank)" stroke="#7fb6d8" stroke-width=".6"/>
<g class="cf-water"><rect x="82" y="34" width="14" height="66" rx="4" fill="#4aa6e0" opacity=".45"/></g>
<path d="M44 12h34q8 0 8 8v96h-50v-96q0-8 8-8z" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<path d="M24 22q0-10 10-10h40q8 0 8 8v24q0 8-8 8h-40q-10 0-10-10z" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<path d="M28 16h44" stroke="#fff" stroke-opacity=".18" stroke-width="1.4" stroke-linecap="round"/>
<circle class="cf-led" cx="40" cy="31" r="3.4"/><circle class="cf-led" cx="54" cy="31" r="3.4"/>
<circle cx="40" cy="31" r="3.4" fill="none" stroke="#7d8792" stroke-width=".6"/><circle cx="54" cy="31" r="3.4" fill="none" stroke="#7d8792" stroke-width=".6"/>
<circle cx="70" cy="31" r="4.2" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".4"/><path d="M70 28.6v2.2M68.1 29.6a2.6 2.6 0 1 0 3.8 0" stroke="#3a424b" stroke-width=".8" fill="none" stroke-linecap="round"/>
<rect x="49" y="52" width="14" height="5" rx="2" fill="#2a2f35"/>
<path class="cf-stream" d="M56 57v28"/>
<rect x="24" y="108" width="72" height="16" rx="6" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".6"/>
<rect x="30" y="106" width="56" height="5" rx="2" fill="#2a2f35"/><rect x="30" y="106" width="56" height="5" rx="2" fill="url(#ID-mesh)"/>
<path d="M71 87q9 0 9 7t-9 7" fill="none" stroke="#dfe3e7" stroke-width="3.2"/>
<path d="M39 82h34l-2 22q-1 3-4 3h-22q-3 0-4-3z" fill="url(#ID-mug)" stroke="#aab2ba" stroke-width=".6"/>
<g clip-path="url(#ID-cup)"><rect class="cf-level" x="38" y="84" width="36" height="20" fill="url(#ID-cof)"/></g>
<ellipse cx="56" cy="82.5" rx="17" ry="1.8" fill="#9aa2ab" opacity=".5"/>
${steam([50, 60], 80)}
</g>`;
    if (st === "expresso") return `${defs}<clipPath id="ID-cup"><rect x="47" y="93" width="26" height="14" rx="2"/></clipPath></defs>
<g class="cf s-expresso">
<ellipse cx="60" cy="131" rx="54" ry="5" fill="url(#ID-shadow)"/>
<rect x="22" y="4" width="40" height="8" rx="3" fill="#2a2f35"/><rect x="26" y="2.5" width="32" height="3" rx="1.5" fill="#3d444c"/>
<g class="cf-body">
<rect x="9" y="10" width="102" height="116" rx="9" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".7"/>
<rect x="15" y="14" width="90" height="26" rx="5" fill="url(#ID-dark)"/>
${lcd(38, 20, 44, 13)}
<circle class="cf-led" cx="26" cy="27" r="3"/><circle cx="26" cy="27" r="3" fill="none" stroke="#7d8792" stroke-width=".6"/>
<circle class="cf-led" cx="94" cy="27" r="3"/><circle cx="94" cy="27" r="3" fill="none" stroke="#7d8792" stroke-width=".6"/>
<rect x="20" y="46" width="80" height="70" rx="5" fill="#15181b"/>
<path d="M22 48h76" stroke="#fff" stroke-opacity=".06" stroke-width="2"/>
<rect x="38" y="48" width="44" height="12" rx="3" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/>
<rect x="51" y="60" width="5" height="6" rx="1" fill="#8f979f"/><rect x="64" y="60" width="5" height="6" rx="1" fill="#8f979f"/>
<path class="cf-stream" d="M53.5 66v29"/><path class="cf-stream" d="M66.5 66v29"/>
<path d="M73 97q7 0 7 4.5t-7 4.5" fill="none" stroke="#dfe3e7" stroke-width="2.6"/>
<path d="M45 92h30l-1.6 14q-1 4-5 4h-17q-4 0-5-4z" fill="url(#ID-mug)" stroke="#aab2ba" stroke-width=".6"/>
<g clip-path="url(#ID-cup)"><rect class="cf-level" x="44" y="93" width="32" height="14" fill="url(#ID-cof)"/></g>
<ellipse cx="60" cy="92.5" rx="15" ry="1.6" fill="#9aa2ab" opacity=".5"/>
<ellipse cx="60" cy="112" rx="24" ry="2" fill="#000" opacity=".35"/>
<rect x="17" y="112" width="86" height="10" rx="3" fill="url(#ID-chrome)" stroke="#6f7780" stroke-width=".5"/>
<rect x="21" y="114" width="78" height="6" rx="2" fill="url(#ID-holes)"/>
<path d="M13 16v100" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>
</g>
${steam([55, 65], 90)}
</g>`;
    return `${defs}<clipPath id="ID-car"><path d="M30 70h40v30q0 6-6 6h-28q-6 0-6-6z"/></clipPath></defs>
<g class="cf s-filtre">
<ellipse cx="60" cy="131" rx="52" ry="5" fill="url(#ID-shadow)"/>
<rect x="74" y="16" width="34" height="96" rx="6" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<rect x="80" y="28" width="10" height="62" rx="4" fill="url(#ID-tank)" stroke="#7fb6d8" stroke-width=".5"/>
<g class="cf-water"><rect x="81.5" y="40" width="7" height="48" rx="3" fill="#4aa6e0" opacity=".5"/></g>
<path d="M82 34h2M82 46h2M82 58h2M82 70h2" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>
<path d="M22 30q0-10 10-10h46v26h-48q-8 0-8-8z" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<path d="M28 24h44" stroke="#fff" stroke-opacity=".18" stroke-width="1.4" stroke-linecap="round"/>
<path d="M30 46h44l-9 12h-26z" fill="#262b31" stroke="#05070a" stroke-width=".5"/>
<g class="cf-drip"><circle cx="52" cy="60" r="1.3"/><circle cx="52" cy="60" r="1.1"/><circle cx="52" cy="60" r="1.2"/></g>
<rect x="12" y="106" width="96" height="21" rx="6" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<rect class="cf-plate" x="26" y="104.5" width="48" height="3.5" rx="1.7"/>
${lcd(80, 112, 24, 9)}
<circle class="cf-led" cx="22" cy="116.5" r="3"/><circle cx="22" cy="116.5" r="3" fill="none" stroke="#7d8792" stroke-width=".6"/>
<path d="M28 76q-11 1-11 12q0 10 11 11" fill="none" stroke="#454d57" stroke-width="4" stroke-linecap="round"/>
<g clip-path="url(#ID-car)"><rect class="cf-level" x="28" y="70" width="44" height="36" fill="url(#ID-cof)"/></g>
<path d="M30 66h40v34q0 6-6 6h-28q-6 0-6-6z" fill="url(#ID-glassv)" stroke="#c4d2dd" stroke-opacity=".8" stroke-width=".8"/>
<path d="M34 72v26" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>
<rect x="28" y="61" width="44" height="7" rx="2.5" fill="#1d2126"/><rect x="47" y="59" width="10" height="3" rx="1" fill="#1d2126"/>
${steam([44, 56], 19)}
</g>`;
  };

SVG.desktop_pc = () => `
<defs>${DEFS}
<linearGradient id="ID-pcwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f2a5c"/><stop offset=".55" stop-color="#1c5fc4"/><stop offset="1" stop-color="#5ec8ff"/></linearGradient>
<linearGradient id="ID-pcdesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c3a5"/><stop offset="1" stop-color="#b79a74"/></linearGradient>
<linearGradient id="ID-pcglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#090b0e"/></linearGradient>
<clipPath id="ID-pcclip"><rect x="10" y="22" width="68" height="44" rx="1"/></clipPath></defs>
<ellipse cx="60" cy="126" rx="56" ry="3.5" fill="url(#ID-shadow)"/>
<path d="M2 110h116l-5 12h-106z" fill="url(#ID-pcdesk)"/>
<path d="M2 110h116" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
<path d="M36 104h12l2 7h-16z" fill="url(#ID-dark)"/>
<rect x="38" y="70" width="8" height="36" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>
<ellipse cx="42" cy="108" rx="16" ry="3.2" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".4"/>
<rect x="6" y="18" width="76" height="52" rx="3.5" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<rect x="10" y="22" width="68" height="44" rx="1" fill="#0a0d11"/>
<g class="pc-screen" clip-path="url(#ID-pcclip)">
  <rect x="10" y="22" width="68" height="44" fill="url(#ID-pcwall)"/>
  <circle cx="64" cy="32" r="9" fill="#bfeaff" opacity=".35"/>
  <rect x="13" y="26" width="30" height="24" rx="1.5" fill="#0d1520" stroke="#2b4a73" stroke-width=".4"/>
  <rect x="13" y="26" width="30" height="3.4" rx="1.5" fill="#22344d"/>
  <circle cx="15.2" cy="27.7" r=".7" fill="#ff5f56"/><circle cx="17.6" cy="27.7" r=".7" fill="#ffbd2e"/><circle cx="20" cy="27.7" r=".7" fill="#27c93f"/>
  <g class="pc-code"><rect x="16" y="32" width="16" height="1.6" rx=".8" fill="#6fd8ff"/><rect x="19" y="35.4" width="20" height="1.6" rx=".8" fill="#b894ff"/><rect x="19" y="38.8" width="12" height="1.6" rx=".8" fill="#ffd76a"/><rect x="16" y="42.2" width="22" height="1.6" rx=".8" fill="#6fe3a1"/><rect x="19" y="45.6" width="14" height="1.6" rx=".8" fill="#6fd8ff"/></g>
  <rect x="46" y="38" width="28" height="19" rx="1.5" fill="#f4f7fb" opacity=".92"/>
  <g class="pc-bars"><rect x="50" y="48" width="4" height="7" fill="#3b82f6"/><rect x="56" y="43" width="4" height="12" fill="#22c55e"/><rect x="62" y="45.5" width="4" height="9.5" fill="#f59e0b"/><rect x="68" y="41" width="4" height="14" fill="#ef4444"/></g>
  <rect x="10" y="61" width="68" height="5" fill="#0b1626" opacity=".85"/>
  <circle cx="14" cy="63.5" r="1.4" fill="#5ec8ff"/><rect x="19" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/><rect x="24" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/><rect x="29" y="62.6" width="3.4" height="1.8" rx=".5" fill="#8fa3bd"/>
  <path class="pc-cursor" d="M0 0l0 6l1.7 -1.6l1.2 2.7l1.1 -.5l-1.2 -2.6l2.3 0z" fill="#fff" stroke="#000" stroke-width=".4"/>
</g>
<path d="M10 22h68l-28 44h-40z" fill="url(#ID-gloss)" opacity=".35"/>
<circle class="pc-mled" cx="44" cy="68" r=".9"/>
<g class="pc-tower">
  <rect x="86" y="38" width="28" height="74" rx="3" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
  <rect x="90" y="43" width="20" height="62" rx="1.5" fill="url(#ID-pcglass)" stroke="#3b424a" stroke-width=".4"/>
  <g class="pc-rgb" fill="none" stroke-width="1.3">
    <circle cx="100" cy="53" r="7.6"/><circle cx="100" cy="72" r="7.6"/><circle cx="100" cy="91" r="7.6"/>
  </g>
  <g class="pc-fan"><circle cx="100" cy="53" r="6.5" fill="#12161a"/><path d="M100 53v-6M100 53l5.2 3M100 53l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="53" r="7.6" fill="none"/></g>
  <g class="pc-fan"><circle cx="100" cy="72" r="6.5" fill="#12161a"/><path d="M100 72v-6M100 72l5.2 3M100 72l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="72" r="7.6" fill="none"/></g>
  <g class="pc-fan"><circle cx="100" cy="91" r="6.5" fill="#12161a"/><path d="M100 91v-6M100 91l5.2 3M100 91l-5.2 3" stroke="#a9b1ba" stroke-width="2" stroke-linecap="round"/><circle cx="100" cy="91" r="7.6" fill="none"/></g>
  <circle cx="100" cy="53" r="1.4" fill="#d7dce1"/><circle cx="100" cy="72" r="1.4" fill="#d7dce1"/><circle cx="100" cy="91" r="1.4" fill="#d7dce1"/>
  <path d="M91 44h8l-8 14z" fill="#fff" opacity=".07"/>
  <rect x="104" y="40.2" width="6" height="1.8" rx=".9" fill="#2a2f35"/>
  <circle class="pc-led" cx="94" cy="41" r="1.2"/>
  <rect x="90" y="106.6" width="20" height="3" rx="1" fill="#2a2f35"/>
</g>
<rect x="10" y="114" width="62" height="7" rx="1.4" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/>
<g class="pc-keys" fill="#4b535c"><rect x="12" y="115.2" width="58" height="1.2" opacity=".9"/><rect x="12" y="117.2" width="58" height="1.2" opacity=".9"/><rect x="12" y="119.2" width="58" height="1.2" opacity=".9"/></g>
<path d="M12 116.4h58M12 118.4h58" stroke="#05070a" stroke-width=".4" stroke-dasharray="2.2 .8"/>
<ellipse cx="78" cy="117" rx="3.6" ry="3" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".4"/><path d="M78 114.2v2" stroke="#6f7780" stroke-width=".6"/>`;

SVG.dishwasher = () => `
<defs>${DEFS}<clipPath id="ID-win"><rect x="22" y="38" width="76" height="76" rx="4"/></clipPath>
<linearGradient id="ID-tub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b646d"/><stop offset="1" stop-color="#2c3238"/></linearGradient></defs>
<ellipse class="floorlight" cx="60" cy="135" rx="9" ry="2.2"/>
<ellipse cx="60" cy="133" rx="50" ry="5" fill="url(#ID-shadow)"/>
<g>
  <rect x="14" y="8" width="92" height="120" rx="6" fill="url(#ID-inox)" stroke="#9aa2ab" stroke-width=".8"/>
  <rect x="14" y="8" width="92" height="15" rx="6" fill="url(#ID-dark)"/>
  <rect x="14" y="17" width="92" height="6" fill="url(#ID-dark)"/>
  ${lcd(45, 10, 30, 11)}
  <circle class="led l1" cx="22" cy="15.5" r="1.4"/><circle class="led l2" cx="28" cy="15.5" r="1.4"/>
  <circle class="led l4" cx="34" cy="15.5" r="1.4"/>
  <rect x="82" y="12.5" width="7" height="6" rx="1.5" fill="#3b424a" stroke="#58616b" stroke-width=".5"/>
  <rect x="92" y="12.5" width="7" height="6" rx="1.5" fill="#3b424a" stroke="#58616b" stroke-width=".5"/>
  <rect x="40" y="26" width="40" height="5" rx="2.5" fill="#7c848d"/>
  <rect x="41" y="26" width="38" height="2.4" rx="1.2" fill="#2f353b" opacity=".6"/>
  <rect x="22" y="38" width="76" height="76" rx="4" fill="url(#ID-tub)"/>
  <g clip-path="url(#ID-win)">
    <g class="wash-light"><rect x="22" y="38" width="76" height="76" fill="#8fd3ff" opacity=".18"/></g>
    <path d="M26 62h68M26 66h68" stroke="#aab2ba" stroke-width="1.1"/>
    <path d="M30 62v-8M42 62v-8M54 62v-8M66 62v-8M78 62v-8M90 62v-8" stroke="#aab2ba" stroke-width=".7"/>
    <path d="M32 61l2-12h7l2 12z M47 61l2-12h7l2 12z M65 61l2-12h7l2 12z M80 61l2-12h7l2 12z" fill="#dff3ff" opacity=".7" stroke="#fff" stroke-width=".5"/>
    <path d="M26 100h68M26 104h68" stroke="#aab2ba" stroke-width="1.1"/>
    <ellipse cx="33" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
    <ellipse cx="43" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
    <ellipse cx="53" cy="88" rx="3.2" ry="13" fill="#f6f7f9" stroke="#c8ced5" stroke-width=".6"/>
    <ellipse cx="63" cy="91" rx="2.6" ry="10" fill="#e7f1fb" stroke="#c8ced5" stroke-width=".6"/>
    <ellipse cx="72" cy="91" rx="2.6" ry="10" fill="#e7f1fb" stroke="#c8ced5" stroke-width=".6"/>
    <path d="M80 99l3-14h9l3 14z" fill="#c4473a"/>
    <g class="arm arm-top"><rect x="36" y="68" width="48" height="2.6" rx="1.3" fill="#9aa3ad"/></g>
    <g class="arm arm-bot"><rect x="30" y="107" width="60" height="3" rx="1.5" fill="#9aa3ad"/></g>
    <circle cx="60" cy="69.3" r="2" fill="#7d868f"/><circle cx="60" cy="108.5" r="2.4" fill="#7d868f"/>
    <g class="jets">
      <path d="M40 106l-6-38M50 106l-2-40M70 106l2-40M80 106l6-38M45 67l-4-22M75 67l4-22"/>
    </g>
    <g class="drops">
      <circle cx="35" cy="44" r="1"/><circle cx="52" cy="46" r="1.2"/><circle cx="68" cy="43" r="1"/><circle cx="86" cy="47" r="1.1"/>
    </g>
    <g class="steam-in"><path d="M40 112q-4-10 2-18t0-16M60 112q-4-10 2-18t0-16M80 112q-4-10 2-18t0-16"/></g>
  </g>
  <rect x="22" y="38" width="76" height="76" rx="4" fill="url(#ID-gloss)"/>
  <rect x="22" y="38" width="76" height="76" rx="4" fill="none" stroke="#7e8790" stroke-width="1.2"/>
  <rect x="14" y="118" width="92" height="10" rx="2" fill="#2b3036"/>
</g>`;

SVG.drawer_freezer = () => `
<defs>${DEFS}
<linearGradient id="ID-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfeaf3"/></linearGradient></defs>
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="118" rx="3" fill="url(#ID-in)"/>
<rect class="flight" x="29" y="7" width="62" height="118" fill="#fffbe6" opacity="0"/>
<path d="M33 12h54" stroke="#b9c8d6" stroke-width="1.2"/><path d="M37 9.5h46" stroke="#cfdbe5" stroke-width="2" stroke-dasharray="2 1.5"/>
<g class="drawer d1"><rect x="31" y="16" width="58" height="24" rx="2.5" fill="#e9f5ff" opacity=".9" stroke="#9fc3db" stroke-width=".6"/>
  <rect x="35" y="23" width="12" height="13" rx="2" fill="#e5484d"/><rect x="49" y="26" width="14" height="10" rx="2" fill="#3e8ed0"/><rect x="65" y="22" width="18" height="14" rx="3" fill="#f2c94c"/>
  <rect x="31" y="16" width="58" height="5" rx="2" fill="#cfe6f5" opacity=".9"/><rect x="50" y="17.3" width="20" height="2" rx="1" fill="#9fc3db"/></g>
<g class="drawer d2 pull"><rect x="31" y="43" width="58" height="26" rx="2.5" fill="#e9f5ff" opacity=".92" stroke="#9fc3db" stroke-width=".6"/>
  <path d="M35 66l3-14h12l3 14z" fill="#9fd356"/><rect x="55" y="54" width="14" height="12" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".5"/><circle cx="77" cy="61" r="5" fill="#ff8f3d"/>
  <rect x="31" y="43" width="58" height="5" rx="2" fill="#cfe6f5" opacity=".95"/><rect x="50" y="44.3" width="20" height="2" rx="1" fill="#9fc3db"/></g>
<g class="drawer d3"><rect x="31" y="72" width="58" height="24" rx="2.5" fill="#e9f5ff" opacity=".9" stroke="#9fc3db" stroke-width=".6"/>
  <rect x="35" y="80" width="20" height="12" rx="2" fill="#c4c9cf"/><rect x="58" y="78" width="10" height="14" rx="2" fill="#e5484d" opacity=".85"/><rect x="71" y="81" width="14" height="11" rx="2" fill="#8a5a2b" opacity=".8"/>
  <rect x="31" y="72" width="58" height="5" rx="2" fill="#cfe6f5" opacity=".9"/><rect x="50" y="73.3" width="20" height="2" rx="1" fill="#9fc3db"/></g>
<g class="drawer d4"><rect x="31" y="99" width="58" height="23" rx="2.5" fill="#e9f5ff" opacity=".9" stroke="#9fc3db" stroke-width=".6"/>
  <rect x="35" y="107" width="16" height="11" rx="2" fill="#3e8ed0" opacity=".85"/><rect x="54" y="105" width="30" height="13" rx="3" fill="#f6f7f9" stroke="#c9d3dc" stroke-width=".5"/>
  <rect x="31" y="99" width="58" height="5" rx="2" fill="#cfe6f5" opacity=".9"/><rect x="50" y="100.3" width="20" height="2" rx="1" fill="#9fc3db"/></g>
<g class="drawer-mist"><circle cx="44" cy="74" r="2"/><circle cx="60" cy="76" r="2.4"/><circle cx="76" cy="74" r="1.8"/></g>
<g class="dz-door">
  <rect x="26" y="4" width="68" height="126" rx="6" fill="url(#ID-body)" stroke="#bfc6ce" stroke-width=".7"/>
  <rect x="84" y="20" width="3.4" height="46" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <rect x="35" y="12" width="28" height="12" rx="2" fill="#0c1720" stroke="#7d868f" stroke-width=".5"/>
  <text class="lcd fr-temp" x="51.5" y="20.8" text-anchor="middle">--°</text>
  <g class="flake"><path d="M39.5 15v6M36.9 16.5l5.2 3M36.9 19.5l5.2-3" stroke-width=".8" stroke-linecap="round"/></g>
  <circle class="led l1" cx="38" cy="28" r="1.2"/><circle class="led l2" cx="43" cy="28" r="1.2"/>
  <rect x="26" y="122" width="68" height="8" rx="3" fill="#e2e6ea"/><path d="M34 125h52M34 127h52" stroke="#aab1b9" stroke-width=".6"/>
  <path d="M30 8v112" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
</g>
<g class="mist"><circle cx="40" cy="132" r="1.1"/><circle cx="52" cy="133" r=".9"/><circle cx="66" cy="132" r="1.2"/><circle cx="79" cy="133" r=".9"/></g>`;

SVG.dryer = () => `
<defs>${DEFS}<clipPath id="ID-win"><circle cx="60" cy="80" r="29"/></clipPath>
<radialGradient id="ID-heat" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffb347" stop-opacity=".55"/><stop offset="1" stop-color="#ff7b2e" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="60" cy="133" rx="50" ry="5" fill="url(#ID-shadow)"/>
<g class="shake-soft">
  ${feet([20, 90], 124)}
  <rect x="14" y="8" width="92" height="120" rx="8" fill="url(#ID-body)" stroke="#bfc6ce" stroke-width=".8"/>
  <path d="M14 16a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v17H14z" fill="url(#ID-panel)"/>
  <line x1="14" y1="33" x2="106" y2="33" stroke="#bfc6ce" stroke-width=".8"/>
  <circle cx="27" cy="21" r="8.2" fill="url(#ID-chrome)" stroke="#88919a" stroke-width=".6"/>
  <circle cx="27" cy="21" r="5.8" fill="#eff2f5" stroke="#b2b9c1" stroke-width=".6"/>
  <g class="knob"><line x1="27" y1="21" x2="27" y2="16.2" stroke="#4f5964" stroke-width="1.5" stroke-linecap="round"/></g>
  ${lcd(43, 13, 30, 11)}
  <circle class="led l1" cx="49" cy="29" r="1.4"/><circle class="led l2" cx="55" cy="29" r="1.4"/>
  <circle class="led l3" cx="61" cy="29" r="1.4"/><circle class="led l4" cx="67" cy="29" r="1.4"/>
  <rect x="80" y="15" width="8" height="5" rx="1.5" fill="#e7eaee" stroke="#aeb5bd" stroke-width=".6"/>
  <rect x="91" y="15" width="8" height="5" rx="1.5" fill="#e7eaee" stroke="#aeb5bd" stroke-width=".6"/>
  <rect x="80" y="23" width="19" height="5" rx="1.5" fill="#dfe3e8" stroke="#aeb5bd" stroke-width=".6"/>
  ${porthole(60, 80, 29, `
    <rect x="20" y="40" width="80" height="80" fill="#3a4148" opacity=".25"/>
    ${drumInside(60, 80, 29)}
    <circle class="heat" cx="60" cy="80" r="29" fill="url(#ID-heat)"/>`)}
  <rect x="20" y="72" width="5" height="16" rx="2" fill="url(#ID-chrome)" stroke="#8d959f" stroke-width=".4"/>
  <rect x="95.5" y="74" width="4" height="12" rx="1.5" fill="#9aa3ad"/>
  <rect x="22" y="114" width="76" height="9" rx="2" fill="#e3e7eb" stroke="#c3c9d0" stroke-width=".6"/>
  <path d="M28 116.5h64M28 118.5h64M28 120.5h64" stroke="#b7bec6" stroke-width=".6"/>
</g>`;

SVG.fan = () => `
<defs>${DEFS}
<radialGradient id="ID-cage" cx=".5" cy=".5" r=".5"><stop offset=".82" stop-color="#cfe6f5" stop-opacity=".1"/><stop offset="1" stop-color="#cfe6f5" stop-opacity=".25"/></radialGradient>
<linearGradient id="ID-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe3f7" stop-opacity=".95"/><stop offset="1" stop-color="#6fa9cf" stop-opacity=".85"/></linearGradient></defs>
<ellipse cx="60" cy="128" rx="34" ry="4" fill="url(#ID-shadow)"/>
<g class="fn-air" fill="none" stroke-linecap="round"><path d="M22 40q-10 12 0 26"/><path d="M14 34q-14 18 0 38"/><path d="M98 40q10 12 0 26"/><path d="M106 34q14 18 0 38"/></g>
<ellipse cx="60" cy="122" rx="28" ry="6" fill="url(#ID-dark)"/>
<ellipse cx="60" cy="120" rx="27" ry="5.2" fill="#2a2f35"/>
<path d="M40 119.5q20-5 40 0" stroke="#fff" stroke-opacity=".15" stroke-width="1" fill="none"/>
<circle class="fn-led l1" cx="50" cy="121" r="1.3"/><circle class="fn-led l2" cx="56" cy="121.8" r="1.3"/><circle class="fn-led l3" cx="62" cy="121.8" r="1.3"/>
<circle cx="70" cy="121" r="1.9" fill="url(#ID-chrome)"/>
<rect x="57.5" y="80" width="5" height="40" rx="2" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".4"/>
<rect x="56.5" y="96" width="7" height="4" rx="1.5" fill="#59616b"/>
<g class="fn-head">
  <path d="M52 78h16l-2 8h-12z" fill="url(#ID-dark)"/>
  <ellipse cx="60" cy="52" rx="13" ry="11" fill="url(#ID-dark)"/>
  <circle cx="60" cy="52" r="35" fill="url(#ID-cage)" stroke="#d7dce1" stroke-width="1.6"/>
  <g class="fn-blades">
    <path d="M60 52q-6-16 2-28q12 6 2 28z" fill="url(#ID-blade)"/>
    <path d="M60 52q-6-16 2-28q12 6 2 28z" fill="url(#ID-blade)" transform="rotate(72 60 52)"/>
    <path d="M60 52q-6-16 2-28q12 6 2 28z" fill="url(#ID-blade)" transform="rotate(144 60 52)"/>
    <path d="M60 52q-6-16 2-28q12 6 2 28z" fill="url(#ID-blade)" transform="rotate(216 60 52)"/>
    <path d="M60 52q-6-16 2-28q12 6 2 28z" fill="url(#ID-blade)" transform="rotate(288 60 52)"/>
  </g>
  <circle class="fn-blur" cx="60" cy="52" r="30" fill="#bfe3f7"/>
  <g fill="none" stroke="#e6eaee" stroke-opacity=".75" stroke-width=".6">
    <circle cx="60" cy="52" r="10"/><circle cx="60" cy="52" r="18"/><circle cx="60" cy="52" r="26"/>
    <path d="M60 17v70M25 52h70M35.3 27.3l49.4 49.4M84.7 27.3l-49.4 49.4M46.6 19.7l26.8 64.6M73.4 19.7l-26.8 64.6M27.7 38.6l64.6 26.8M92.3 38.6l-64.6 26.8"/>
  </g>
  <circle cx="60" cy="52" r="6" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/>
  <circle cx="60" cy="52" r="2.2" fill="#38a3d6"/>
  <path d="M34 34a35 35 0 0 1 22-15" stroke="#fff" stroke-opacity=".6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <g class="fn-ribbon"><path d="M93 44q8 2 12 -2q-4 6 -12 6z" fill="#ff7a59"/></g>
</g>`;

/* style de réfrigérateur : congélateur en haut (défaut), en bas (tiroirs ou porte), French door, 4 portes, américain */
const fridgeStyle = (c) => ({ top: "top", haut: "top", bottom: "bottom", bas: "bottom", combi: "bottom", french: "french", french_door: "french", bottom_door: "bottom_door", "bottom-door": "bottom_door", combi_door: "bottom_door", combi_porte: "bottom_door", combi_clean: "combi_clean", "combi-clean": "combi_clean", clean: "combi_clean", modern: "combi_clean", four_door: "four_door", "4_door": "four_door", "4-door": "four_door", cross_door: "four_door", american: "american", americain: "american", side_by_side: "american", us: "american" }[String(c?.style || "top").toLowerCase()] || "top");

// contenu du compartiment frigo (bouteilles, pots, fruits, bac à légumes), dessiné dans la zone x, y, w, h
const fridgeFood = (x, y, w, h) => {
  const s1 = y + h * 0.33, s2 = y + h * 0.64, cx = x + w / 2;
  return `
<path d="M${x + 2} ${s1}h${w - 4}M${x + 2} ${s2}h${w - 4}" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="${x + 7}" y="${s1 - 14}" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="${x + 15}" y="${s1 - 10}" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="${cx - 3}" y="${s1 - 8}" width="12" height="8" rx="2" fill="#e5484d"/><rect x="${x + w - 15}" y="${s1 - 12}" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="${x + 9}" y="${s2 - 10}" width="14" height="10" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><circle cx="${cx + 4}" cy="${s2 - 5}" r="5" fill="#ff8f3d"/><circle cx="${cx + 14}" cy="${s2 - 4}" r="4" fill="#9fd356"/>
<rect x="${x + 3}" y="${s2 + 6}" width="${w - 6}" height="${y + h - s2 - 9}" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>`;
};
// tiroir de congélateur (façade inox + poignée horizontale)
const fzDrawer = (x, y, w, h, cls) => `
<g class="${cls}">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="${x + w * 0.25}" y="${y + 3.5}" width="${w * 0.5}" height="3.2" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M${x + 4} ${y + h - 2}h${w - 8}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>
</g>`;
// intérieur de congélateur à porte battante : clayettes givrées et bacs, dessiné dans la zone x, y, w, h
const fzInside = (x, y, w, h) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#ID-frost)"/>
<path d="M${x + 2} ${y + h * 0.36}h${w - 4}M${x + 2} ${y + h * 0.68}h${w - 4}" stroke="#a9cbe2" stroke-width="1"/>
<rect x="${x + 5}" y="${y + h * 0.36 - 9}" width="${w * 0.4}" height="9" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/><rect x="${x + w * 0.55}" y="${y + h * 0.36 - 7}" width="${w * 0.33}" height="7" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="${x + 5}" y="${y + h * 0.68 - 9}" width="${w * 0.5}" height="9" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>`;
// afficheur température + flocon
const fridgeLcd = (x, y) => `
<rect x="${x}" y="${y}" width="30" height="14" rx="2" fill="#0c1720" stroke="#7d868f" stroke-width=".6"/>
<g class="flake"><path d="M${x + 5.5} ${y + 4}v6M${x + 2.9} ${y + 5.5}l5.2 3M${x + 2.9} ${y + 8.5}l5.2-3" stroke="#38d9ff" stroke-width=".8" stroke-linecap="round"/></g>
<text class="lcd fr-temp" x="${x + 19.5}" y="${y + 10.8}" text-anchor="middle" fill="#38d9ff" font-size="11.5" font-weight="800">--°</text>`;
// afficheur de la zone flex (option flex_temperature)
const flexLcd = (x, y) => `
<rect x="${x}" y="${y}" width="22" height="11" rx="2" fill="#0c1720" stroke="#7d868f" stroke-width=".6"/>
<text class="lcd3" x="${x + 11}" y="${y + 8.4}" text-anchor="middle" fill="#7cf0c4" font-size="8.5" font-weight="800">--°</text>`;
const FRIDGE_DEFS = `<defs>${DEFS}
<linearGradient id="ID-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe9f2"/></linearGradient>
<linearGradient id="ID-frost" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f6ff"/><stop offset="1" stop-color="#bfe0f5"/></linearGradient></defs>`;
const fridgeMist = `<g class="mist"><circle cx="40" cy="132" r="1.1"/><circle cx="52" cy="133" r=".9"/><circle cx="66" cy="132" r="1.2"/><circle cx="79" cy="133" r=".9"/></g>`;

const FRIDGE = {
  // congélateur en haut (modèle d'origine)
  top: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="36" rx="3" fill="url(#ID-frost)"/>
<path d="M31 25h58" stroke="#a9cbe2" stroke-width="1"/>
<rect x="34" y="28" width="22" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="60" y="28" width="26" height="11" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="29" y="47" width="62" height="78" rx="3" fill="url(#ID-in)"/>
<path d="M31 72h58M31 96h58" stroke="#b9c8d6" stroke-width="1.1"/>
<rect x="36" y="58" width="6" height="14" rx="1.5" fill="#3fbf7f"/><rect x="44" y="62" width="8" height="10" rx="2" fill="#f2c94c"/>
<rect x="56" y="64" width="12" height="8" rx="2" fill="#e5484d"/><rect x="72" y="60" width="5" height="12" rx="1.5" fill="#3e8ed0"/>
<rect x="38" y="86" width="14" height="10" rx="2" fill="#ffffff" stroke="#c9d3dc" stroke-width=".6"/><circle cx="64" cy="91" r="5" fill="#ff8f3d"/><circle cx="74" cy="92" r="4" fill="#9fd356"/>
<rect x="32" y="104" width="56" height="18" rx="2" fill="#e3eef7" stroke="#b9c8d6" stroke-width=".6"/>
<rect class="flight" x="29" y="47" width="62" height="78" fill="#fffbe6" opacity="0"/>
<g class="fz-door">
  <rect x="26" y="4" width="68" height="40" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="12" width="3.4" height="24" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
</g>
<g class="fr-door">
  <rect x="26" y="46" width="68" height="84" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="52" width="3.4" height="40" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(35, 54)}
  <path d="M30 50v76" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // combiné : frigo en haut, deux tiroirs de congélation en bas
  bottom: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
<rect x="29" y="86" width="62" height="41" rx="3" fill="url(#ID-frost)"/>
<path d="M31 106h58" stroke="#a9cbe2" stroke-width="1"/>
${fzDrawer(26, 108, 68, 22, "fzd")}
${fzDrawer(26, 85, 68, 22, "fzd fzd-pull")}
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="84" y="40" width="3.4" height="38" rx="1.7" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // combiné classique : porte de frigo en haut, porte battante de congélateur en bas
  bottom_door: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
${fzInside(29, 86, 62, 41)}
<g class="fz-door">
  <rect x="26" y="84" width="68" height="46" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <path d="M30 88v38" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  // 4 portes (cross door) : deux portes battantes en haut, deux portes battantes de congélateur en bas
    // combiné moderne (sans poignées saillantes, frigo en haut, congélateur battant en bas)
  combi_clean: () => `
<ellipse cx="60" cy="134" rx="40" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="26" y="4" width="68" height="126" rx="6" fill="#9aa2ab"/>
<rect x="29" y="7" width="62" height="74" rx="3" fill="url(#ID-in)"/>
${fridgeFood(29, 7, 62, 74)}
<rect class="flight" x="29" y="7" width="62" height="74" fill="#fffbe6" opacity="0"/>
${fzInside(29, 86, 62, 41)}
<g class="fz-door">
  <rect x="26" y="84" width="68" height="46" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <path d="M30 88v38" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door">
  <rect x="26" y="4" width="68" height="79" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  ${fridgeLcd(45, 11.5)}
  <path d="M30 8v71" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>`,

  four_door: (flex) => `
<ellipse cx="60" cy="134" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="16" y="4" width="88" height="126" rx="6" fill="#9aa2ab"/>
<rect x="19" y="7" width="82" height="70" rx="3" fill="url(#ID-in)"/>
${fridgeFood(19, 7, 82, 70)}
<rect class="flight" x="19" y="7" width="82" height="70" fill="#fffbe6" opacity="0"/>
${fzInside(19, 82, 40, 45)}${fzInside(61, 82, 40, 45)}
<g class="fz-door fz-l" style="transform-origin: 16px 0">
  <rect x="16" y="80" width="43.6" height="50" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="88" width="3.2" height="30" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M20 84v42" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fz-door fz-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="80" width="43.6" height="50" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="88" width="3.2" height="30" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 84v42" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
  ${flex ? flexLcd(74, 86) : ""}
</g>
<g class="fr-door fr-l">
  <rect x="16" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(22, 12)}
  <path d="M20 8v67" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v67" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,

  // French door : deux portes battantes en haut, deux tiroirs de congélation en bas
  french: (flex) => `
<ellipse cx="60" cy="134" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="16" y="4" width="88" height="126" rx="6" fill="#9aa2ab"/>
<rect x="19" y="7" width="82" height="70" rx="3" fill="url(#ID-in)"/>
${fridgeFood(19, 7, 82, 70)}
<rect class="flight" x="19" y="7" width="82" height="70" fill="#fffbe6" opacity="0"/>
<rect x="19" y="82" width="82" height="45" rx="3" fill="url(#ID-frost)"/>
<path d="M21 106h78" stroke="#a9cbe2" stroke-width="1"/>
${fzDrawer(16, 106, 88, 24, "fzd")}
<g class="fzd fzd-pull">${fzDrawer(16, 81, 88, 23, "")}${flex ? flexLcd(76, 88) : ""}</g>
<g class="fr-door fr-l">
  <rect x="16" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(22, 12)}
  <path d="M20 8v67" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r" style="transform-origin: 104px 0">
  <rect x="60.4" y="4" width="43.6" height="75" rx="5" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.8" y="16" width="3.2" height="46" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v67" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,

  // américain side-by-side : congélateur à gauche avec distributeur glaçons / eau, frigo à droite
  american: () => `
<ellipse cx="60" cy="134" rx="54" ry="4.5" fill="url(#ID-shadow)"/>
<rect x="12" y="4" width="96" height="126" rx="6" fill="#9aa2ab"/>
<rect x="15" y="7" width="43" height="120" rx="3" fill="url(#ID-frost)"/>
<path d="M17 36h39M17 66h39M17 96h39" stroke="#a9cbe2" stroke-width="1"/>
<rect x="19" y="24" width="14" height="10" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/><rect x="36" y="27" width="17" height="7" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="20" y="54" width="32" height="10" rx="2" fill="#d9eefb" stroke="#a9cbe2" stroke-width=".6"/>
<rect x="62" y="7" width="43" height="120" rx="3" fill="url(#ID-in)"/>
${fridgeFood(62, 7, 43, 120)}
<rect class="flight" x="62" y="7" width="43" height="120" fill="#fffbe6" opacity="0"/>
<g class="fz-door fz-l">
  <rect x="12" y="4" width="47.6" height="126" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="53.4" y="30" width="3.2" height="66" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  ${fridgeLcd(19, 14)}
  <rect x="19" y="32" width="28" height="36" rx="3" fill="#161b21" stroke="#5f6770" stroke-width=".6"/>
  <rect class="ib-light" x="20.5" y="33.5" width="25" height="2" rx="1" fill="#6fd8ff"/>
  <path d="M30 36v6h6v-6" fill="#2a3139" stroke="#5f6770" stroke-width=".4"/>
  <rect x="24" y="44" width="18" height="11" rx="1.5" fill="#20262d" stroke="#3b434c" stroke-width=".5"/>
  <circle class="ib-drop" cx="33" cy="43" r=".9" fill="#9fdcff"/>
  <g class="ib-ice"><rect x="27" y="45" width="3" height="3" rx=".6" fill="#e9f6ff" opacity=".8"/><rect x="36" y="46" width="3" height="3" rx=".6" fill="#e9f6ff" opacity=".8"/></g>
  <rect x="20" y="62" width="26" height="4" rx="1" fill="#2a3139"/><path d="M22 63.2h22M22 64.8h22" stroke="#3b434c" stroke-width=".4"/>
  <path d="M16 8v118" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
</g>
<g class="fr-door fr-r">
  <rect x="60.4" y="4" width="47.6" height="126" rx="6" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".7"/>
  <rect x="63.4" y="30" width="3.2" height="66" rx="1.6" fill="url(#ID-chrome)" stroke="#6f7781" stroke-width=".4"/>
  <path d="M71 8v118" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>
</g>`,
};

SVG.fridge = (c) => `${FRIDGE_DEFS}${FRIDGE[fridgeStyle(c)](!!(c && c.flex_temperature))}${fridgeMist}`;

/* Carte générique : l'utilisateur fournit sa propre image (option `image`) */
SVG.generic = (c = {}) => {
  // `images` (liste conditionnelle) : on part de la première ; la carte choisit ensuite selon l'état
  const list = Array.isArray(c && c.images) ? c.images.filter((i) => i && i.image) : [];
  const src = String((c && c.image) || (list[0] && list[0].image) || "").trim();
  const art = src
    ? `<image class="gn-img" href="${esc(src)}" x="4" y="6" width="112" height="124" preserveAspectRatio="xMidYMid meet"/>`
    // pas d'image : pictogramme de prise pour inviter à renseigner `image`
    : `<g class="gn-img gn-empty">
  <rect x="14" y="22" width="92" height="92" rx="16" fill="none" stroke="#8d959f" stroke-width="2" stroke-dasharray="5 5"/>
  <rect x="44" y="40" width="32" height="40" rx="8" fill="#b9bfc6"/>
  <rect x="51" y="30" width="5" height="14" rx="2" fill="#8d959f"/><rect x="64" y="30" width="5" height="14" rx="2" fill="#8d959f"/>
  <path d="M60 80v14" stroke="#8d959f" stroke-width="4" stroke-linecap="round"/>
</g>`;
  return `<ellipse cx="60" cy="128" rx="34" ry="4" fill="#000" opacity=".18"/>${art}`;
};

SVG.heat_pump = () => `
<defs>${DEFS}
<linearGradient id="ID-hp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#cfd5db"/></linearGradient>
<radialGradient id="ID-grill" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3a4048"/><stop offset="1" stop-color="#1c2025"/></radialGradient></defs>
<ellipse cx="60" cy="126" rx="56" ry="4" fill="url(#ID-shadow)"/>
<g class="hp-steam"><path d="M30 30q-3-5 0-9t0-9"/><path d="M46 28q-3-5 0-9t0-9"/><path d="M62 30q-3-5 0-9t0-9"/></g>
<g class="hp-body">
<rect x="14" y="114" width="14" height="8" rx="1" fill="#59616b"/><rect x="92" y="114" width="14" height="8" rx="1" fill="#59616b"/>
<rect x="8" y="34" width="104" height="82" rx="4" fill="url(#ID-hp)" stroke="#9aa2ab" stroke-width=".7"/>
<path d="M10 37h100" stroke="#fff" stroke-width="1.2"/>
<path d="M84 40v72" stroke="#b9c0c7" stroke-width=".7"/>
<g stroke="#bfc6cd" stroke-width=".6"><path d="M88 46h20M88 50h20M88 54h20M88 58h20M88 62h20M88 66h20"/></g>
<rect x="88" y="84" width="20" height="18" rx="1.5" fill="#e3e7eb" stroke="#aab2ba" stroke-width=".5"/>
<circle cx="98" cy="93" r="1.3" fill="#9aa2ab"/>
<circle class="hp-led" cx="104" cy="75" r="1.2"/>
<circle cx="46" cy="75" r="31" fill="#d4d9de" stroke="#aab2ba" stroke-width=".6"/>
<circle cx="46" cy="75" r="28" fill="url(#ID-grill)"/>
<g class="hp-fan" fill="#8e979f"><path d="M46 75q-2-16 8-23q3 9-8 23z"/><path d="M46 75q15-6 23 3q-9 4-23-3z"/><path d="M46 75q-13 10-24 4q5-8 24-4z"/></g>
<circle cx="46" cy="75" r="4" fill="#59616b"/>
<g fill="none" stroke="#e6eaee" stroke-opacity=".8" stroke-width=".7"><circle cx="46" cy="75" r="9"/><circle cx="46" cy="75" r="15"/><circle cx="46" cy="75" r="21"/><circle cx="46" cy="75" r="27"/><path d="M46 47v56M18 75h56"/></g>
</g>
<g class="hp-out"><circle cx="46" cy="75" r="30"/><circle cx="46" cy="75" r="30"/><circle cx="46" cy="75" r="30"/></g>
<path d="M112 98h4q3 0 3 3v19" stroke="#c77b3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M112 104h2q2 0 2 2v14" stroke="#2a2f35" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;

SVG.hob = () => `
<defs>${DEFS}
<clipPath id="ID-all"><rect x="0" y="0" width="120" height="140" rx="12"/></clipPath>
<linearGradient id="ID-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2d31"/><stop offset="1" stop-color="#0d0e10"/></linearGradient>
<linearGradient id="ID-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c4a3"/><stop offset="1" stop-color="#b89a73"/></linearGradient>
<radialGradient id="ID-hot"><stop offset="0" stop-color="#ffb347"/><stop offset=".45" stop-color="#ff4a1f"/><stop offset="1" stop-color="#8a1205" stop-opacity=".25"/></radialGradient>
<linearGradient id="ID-pot" x1="0" x2="1"><stop offset="0" stop-color="#8d959e"/><stop offset=".3" stop-color="#f1f3f5"/><stop offset=".6" stop-color="#c3c9cf"/><stop offset="1" stop-color="#7d858e"/></linearGradient></defs>
<ellipse cx="60" cy="125" rx="50" ry="4" fill="url(#ID-shadow)"/>
<g transform="translate(-9 -24) scale(1.15)">
<path d="M12 122L108 122L97 60L23 60Z" fill="#8d959e"/>
<path d="M14 120L106 120L96 62L24 62Z" fill="url(#ID-glass)"/>
<g class="zone z1">
  <ellipse cx="40" cy="99" rx="18" ry="9.7" fill="none" stroke="#5a6068" stroke-width=".5"/>
  <ellipse class="zglow" cx="40" cy="99" rx="16" ry="8.5" fill="url(#ID-hot)"/>
  <g class="coil" fill="none" stroke="#ff5a1f" stroke-width=".7">
    <ellipse cx="40" cy="99" rx="13.1" ry="7.0"/><ellipse cx="40" cy="99" rx="9.3" ry="4.9"/><ellipse cx="40" cy="99" rx="5.4" ry="2.9"/></g>
  <ellipse cx="40" cy="99" rx="16" ry="8.5" fill="none" stroke="#7d848c" stroke-width=".7" stroke-dasharray="2 1.4"/>
</g><g class="zone z2">
  <ellipse cx="82" cy="99" rx="14" ry="7.7" fill="none" stroke="#5a6068" stroke-width=".5"/>
  <ellipse class="zglow" cx="82" cy="99" rx="12" ry="6.5" fill="url(#ID-hot)"/>
  <g class="coil" fill="none" stroke="#ff5a1f" stroke-width=".7">
    <ellipse cx="82" cy="99" rx="9.8" ry="5.3"/><ellipse cx="82" cy="99" rx="7.0" ry="3.8"/><ellipse cx="82" cy="99" rx="4.1" ry="2.2"/></g>
  <ellipse cx="82" cy="99" rx="12" ry="6.5" fill="none" stroke="#7d848c" stroke-width=".7" stroke-dasharray="2 1.4"/>
</g><g class="zone z3">
  <ellipse cx="44" cy="73" rx="13" ry="6.4" fill="none" stroke="#5a6068" stroke-width=".5"/>
  <ellipse class="zglow" cx="44" cy="73" rx="11" ry="5.2" fill="url(#ID-hot)"/>
  <g class="coil" fill="none" stroke="#ff5a1f" stroke-width=".7">
    <ellipse cx="44" cy="73" rx="9.0" ry="4.3"/><ellipse cx="44" cy="73" rx="6.4" ry="3.0"/><ellipse cx="44" cy="73" rx="3.7" ry="1.8"/></g>
  <ellipse cx="44" cy="73" rx="11" ry="5.2" fill="none" stroke="#7d848c" stroke-width=".7" stroke-dasharray="2 1.4"/>
</g><g class="zone z4">
  <ellipse cx="78" cy="73" rx="16" ry="7.7" fill="none" stroke="#5a6068" stroke-width=".5"/>
  <ellipse class="zglow" cx="78" cy="73" rx="14" ry="6.5" fill="url(#ID-hot)"/>
  <g class="coil" fill="none" stroke="#ff5a1f" stroke-width=".7">
    <ellipse cx="78" cy="73" rx="11.5" ry="5.3"/><ellipse cx="78" cy="73" rx="8.1" ry="3.8"/><ellipse cx="78" cy="73" rx="4.8" ry="2.2"/></g>
  <ellipse cx="78" cy="73" rx="14" ry="6.5" fill="none" stroke="#7d848c" stroke-width=".7" stroke-dasharray="2 1.4"/>
</g>
<path d="M30 63L58 63L22 118L16 118Z" fill="#fff" opacity=".05"/>
<path d="M18 109H102" stroke="#3b4047" stroke-width=".5"/>
<g class="digits">
  <text class="zd zd1" x="28" y="116.5" text-anchor="middle">0</text>
  <text class="zd zd3" x="44" y="116.5" text-anchor="middle">0</text>
  <text class="zd zd4" x="76" y="116.5" text-anchor="middle">0</text>
  <text class="zd zd2" x="92" y="116.5" text-anchor="middle">0</text>
</g>
<circle cx="60" cy="114.5" r="2.4" fill="none" stroke="#5a6068" stroke-width=".6"/><path d="M60 112.6v1.6" stroke="#5a6068" stroke-width=".6"/>
<path d="M51 114.5h3M66 114.5h3M67.5 113v3" stroke="#5a6068" stroke-width=".6"/>
<g class="pan">
  <path d="M90 66L104 52" stroke="#2b2f34" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="78" cy="71" rx="13" ry="6.2" fill="#2b2f34"/>
  <ellipse cx="78" cy="70" rx="11.5" ry="5.2" fill="#3b4047"/>
  <ellipse cx="76" cy="70" rx="5" ry="2.6" fill="#ffffff"/><ellipse cx="76.5" cy="69.8" rx="2" ry="1.2" fill="#f2b632"/>
  <g class="sizzle"><path d="M68 64l-1-3M74 62l0-3M84 62l1-3M89 65l2-2"/></g>
</g>
<g class="pot">
  <path d="M24 86l-10-2" stroke="#2b2f34" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M25 80V96Q25 101 40 101Q55 101 55 96V80Z" fill="url(#ID-pot)" stroke="#6f7781" stroke-width=".5"/>
  <ellipse cx="40" cy="96.5" rx="15" ry="4.5" fill="none" stroke="#6f7781" stroke-width=".4" opacity=".6"/>
  <g class="lid"><ellipse cx="40" cy="80" rx="15.5" ry="4.6" fill="#d7dce1" stroke="#7d858e" stroke-width=".6"/>
  <ellipse cx="40" cy="79.4" rx="11" ry="3" fill="#eef1f4"/>
  <rect x="37.5" y="75" width="5" height="3.4" rx="1.4" fill="#2b2f34"/></g>
  <g class="steam-pot"><path d="M34 72q-3-5 0-10t0-10"/><path d="M41 70q-3-5 0-10t0-10"/><path d="M48 72q-3-5 0-10t0-10"/></g>
</g></g>`;

SVG.laptop = () => `
<defs>${DEFS}
<linearGradient id="ID-lpwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a63"/><stop offset=".5" stop-color="#6b3fc9"/><stop offset="1" stop-color="#ff8fab"/></linearGradient>
<linearGradient id="ID-lpbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4e8ec"/><stop offset="1" stop-color="#bfc6cd"/></linearGradient>
<radialGradient id="ID-lpglow" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#7fdcff" stop-opacity=".55"/><stop offset="1" stop-color="#7fdcff" stop-opacity="0"/></radialGradient>
<clipPath id="ID-lpclip"><rect x="22" y="21" width="76" height="52" rx="1"/></clipPath></defs>
<ellipse cx="60" cy="116" rx="54" ry="4" fill="url(#ID-shadow)"/>
<rect x="16" y="14" width="88" height="64" rx="5" fill="url(#ID-dark)" stroke="#05070a" stroke-width=".6"/>
<rect x="22" y="21" width="76" height="52" rx="1" fill="#0a0d11"/>
<g class="lp-screen" clip-path="url(#ID-lpclip)">
  <rect x="22" y="21" width="76" height="52" fill="url(#ID-lpwall)"/>
  <rect x="22" y="21" width="76" height="5" fill="#0b1020" opacity=".6"/>
  <circle cx="26" cy="23.5" r="1" fill="#fff" opacity=".8"/><rect x="82" y="22.6" width="14" height="1.8" rx=".9" fill="#fff" opacity=".7"/>
  <rect x="27" y="30" width="20" height="14" rx="2" fill="#fff" opacity=".9"/><rect x="50" y="30" width="20" height="14" rx="2" fill="#fff" opacity=".9"/><rect x="73" y="30" width="20" height="14" rx="2" fill="#fff" opacity=".9"/>
  <circle cx="33" cy="37" r="3" fill="#ffb347"/><circle cx="56" cy="37" r="3" fill="#38d9ff"/><circle cx="79" cy="37" r="3" fill="#43c07a"/>
  <rect x="38" y="35.4" width="7" height="1.6" rx=".8" fill="#4b535c"/><rect x="61" y="35.4" width="7" height="1.6" rx=".8" fill="#4b535c"/><rect x="84" y="35.4" width="7" height="1.6" rx=".8" fill="#4b535c"/>
  <rect x="27" y="48" width="66" height="19" rx="2" fill="#0d1520" opacity=".88"/>
  <path class="lp-line" d="M30 62l8-4l7 3l8-8l8 5l8-7l8 3l8-6l6 2" fill="none" stroke="#38d9ff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 64h60" stroke="#3b4a63" stroke-width=".5"/>
  <circle class="lp-dot" cx="90" cy="53" r="1.6" fill="#fff"/>
</g>
<path d="M22 21h76l-26 52h-50z" fill="url(#ID-gloss)" opacity=".3"/>
<circle cx="60" cy="17.4" r=".9" fill="#2a2f35"/><circle class="lp-cam" cx="60" cy="17.4" r=".45"/>
<path d="M14 78h92l8 30h-108z" fill="url(#ID-lpbody)" stroke="#9aa2ab" stroke-width=".6"/>
<path d="M14 78h92" stroke="#fff" stroke-width="1" opacity=".8"/>
<path d="M6 108h108v3q0 2.5-3 2.5h-102q-3 0-3-2.5z" fill="#aab2ba" stroke="#8f98a2" stroke-width=".5"/>
<path d="M48 108h24v1.6q-12 1.6-24 0z" fill="#8f98a2"/>
<path d="M18 81h84l5 20h-94z" fill="#151a1f" opacity=".85"/>
<g class="lp-keys" fill="#cfd5db">
  <path d="M20.6 83h8l-1.2 3h-8zM30.4 83h8l-.5 3h-8zM40.2 83h8l-.2 3h-8zM50 83h8v3h-8zM59.8 83h8v3h-8zM69.6 83h8l.2 3h-8zM79.4 83h8l.5 3h-8zM89.2 83h8l1.2 3h-8z"/>
  <path d="M19.2 87.4h8.6l-1.2 3.2h-8.6zM29.4 87.4h8.6l-.6 3.2h-8.6zM39.6 87.4h8.6l-.2 3.2h-8.6zM49.8 87.4h8.6v3.2h-8.6zM60 87.4h8.6l.2 3.2h-8.6zM70.2 87.4h8.6l.6 3.2h-8.6zM80.4 87.4h8.6l1.2 3.2h-8.6zM90.6 87.4h6.4l1.4 3.2h-6.6z"/>
  <path d="M17.8 92h9.2l-1.3 3.4h-9.2zM28.6 92h9.2l-.6 3.4h-9.2zM39.4 92h9.2l-.2 3.4h-9.2zM50.2 92h9.2v3.4h-9.2zM61 92h9.2l.2 3.4h-9.2zM71.8 92h9.2l.6 3.4h-9.2zM82.6 92h9.2l1.3 3.4h-9.2z"/>
</g>
<path d="M46 97h28l1 4h-30z" fill="#aab2ba" stroke="#8f98a2" stroke-width=".4"/>
<path d="M18 81h84l5 20h-94z" fill="url(#ID-lpglow)" class="lp-glow"/>
<circle class="lp-led" cx="60" cy="111" r="1.1"/>`;

SVG.microwave = () => `
<defs>${DEFS}<clipPath id="ID-win"><rect x="13" y="42" width="66" height="62" rx="4"/></clipPath>
<linearGradient id="ID-cav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f55"/><stop offset="1" stop-color="#22262a"/></linearGradient></defs>
<ellipse cx="60" cy="117" rx="56" ry="5" fill="url(#ID-shadow)"/>
<rect x="8" y="111" width="10" height="4" rx="1" fill="#2c3136"/><rect x="102" y="111" width="10" height="4" rx="1" fill="#2c3136"/>
<rect x="5" y="34" width="110" height="78" rx="6" fill="url(#ID-inox)" stroke="#949ca5" stroke-width=".8"/>
<rect x="9" y="38" width="74" height="70" rx="5" fill="#1a1d21"/>
<rect x="13" y="42" width="66" height="62" rx="4" fill="url(#ID-cav)"/>
<g clip-path="url(#ID-win)">
  <rect class="ilight" x="13" y="42" width="66" height="62" fill="url(#ID-warm)"/>
  <ellipse cx="46" cy="94" rx="24" ry="5" fill="#c8d4dc" opacity=".85"/>
  <ellipse cx="46" cy="93.4" rx="21" ry="3.8" fill="#e7eef3" opacity=".9"/>
  <g class="bowl">
    <path d="M35 80h22q-1 11-11 12q-10-1-11-12z" fill="#f4f1ea" stroke="#c9c2b4" stroke-width=".6"/>
    <ellipse cx="46" cy="80" rx="11" ry="2.4" fill="#d9822b"/>
    <path d="M38 85h16" stroke="#3e8ed0" stroke-width="1.2"/>
  </g>
  <g class="steam-in"><path d="M42 76q-3-5 0-10t0-10M50 76q-3-5 0-10t0-10"/></g>
  <rect x="13" y="42" width="66" height="62" fill="url(#ID-mesh)"/>
</g>
<path d="M13 60L33 42h14L13 74z" fill="#fff" opacity=".1"/>
<rect x="84" y="38" width="3" height="70" rx="1.5" fill="url(#ID-chrome)"/>
${lcd(90, 42, 21, 10)}
<g fill="#d7dce1" stroke="#9aa2ab" stroke-width=".4">
  <rect x="90" y="57" width="6" height="5" rx="1.2"/><rect x="97.5" y="57" width="6" height="5" rx="1.2"/><rect x="105" y="57" width="6" height="5" rx="1.2"/>
  <rect x="90" y="64" width="6" height="5" rx="1.2"/><rect x="97.5" y="64" width="6" height="5" rx="1.2"/><rect x="105" y="64" width="6" height="5" rx="1.2"/>
  <rect x="90" y="71" width="6" height="5" rx="1.2"/><rect x="97.5" y="71" width="6" height="5" rx="1.2"/><rect x="105" y="71" width="6" height="5" rx="1.2"/>
</g>
<circle cx="100.5" cy="88" r="7" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/>
<circle cx="100.5" cy="88" r="4.6" fill="#e9ecef"/>
<g class="knob"><line x1="100.5" y1="88" x2="100.5" y2="84.2" stroke="#4f5964" stroke-width="1.3" stroke-linecap="round"/></g>
<rect class="start" x="90" y="98" width="21" height="6" rx="2"/>`;

SVG.oven = () => `
<defs>${DEFS}<clipPath id="ID-win"><rect x="22" y="56" width="76" height="56" rx="4"/></clipPath>
<linearGradient id="ID-cavity" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3330"/><stop offset="1" stop-color="#181412"/></linearGradient></defs>
<ellipse cx="60" cy="133" rx="52" ry="5" fill="url(#ID-shadow)"/>
<rect x="10" y="10" width="100" height="120" rx="5" fill="url(#ID-inox)" stroke="#949ca5" stroke-width=".8"/>
<rect x="10" y="10" width="100" height="22" rx="5" fill="url(#ID-dark)"/>
<rect x="10" y="26" width="100" height="6" fill="url(#ID-dark)"/>
<circle cx="24" cy="21" r="7" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/>
<circle cx="24" cy="21" r="4.6" fill="#2a3036"/><g class="knob"><line x1="24" y1="21" x2="24" y2="17.2" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/></g>
<circle cx="96" cy="21" r="7" fill="url(#ID-chrome)" stroke="#5c646d" stroke-width=".5"/>
<circle cx="96" cy="21" r="4.6" fill="#2a3036"/><line x1="96" y1="21" x2="99" y2="18.5" stroke="#e7eaed" stroke-width="1.3" stroke-linecap="round"/>
${lcd(43, 15, 34, 12)}
<circle class="led l1" cx="38" cy="21" r="1.3"/>
<rect x="14" y="36" width="92" height="90" rx="3" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".6"/>
<rect x="20" y="40.5" width="80" height="4.5" rx="2.25" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".5"/>
<rect x="24" y="44.5" width="3" height="4" fill="#8f979f"/><rect x="93" y="44.5" width="3" height="4" fill="#8f979f"/>
<rect x="22" y="56" width="76" height="56" rx="4" fill="url(#ID-cavity)"/>
<g clip-path="url(#ID-win)">
  <rect class="ilight" x="22" y="56" width="76" height="56" fill="url(#ID-warm)"/>
  <path class="element" d="M26 61h8l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3l3 3l3-3h8"/>
  <path d="M24 97h72M24 99.5h72" stroke="#8d8680" stroke-width=".9"/>
  <path d="M36 97l3-10h42l3 10z" fill="#b5442f"/>
  <path d="M39 87q21-8 42 0z" fill="#d06a3c"/>
  <ellipse cx="60" cy="86.5" rx="5" ry="1.4" fill="#5b2a1a"/>
  <path d="M42 90h36" stroke="#e48a5c" stroke-width=".8"/>
  <g class="haze"><path d="M44 82q-3-5 0-10t0-10M60 80q-3-5 0-10t0-10M76 82q-3-5 0-10t0-10"/></g>
</g>
<path d="M22 70L44 56h16L22 82z" fill="#fff" opacity=".08"/>
<rect x="22" y="56" width="76" height="56" rx="4" fill="none" stroke="#5d656d" stroke-width="1.2"/>
<rect x="14" y="118" width="92" height="8" rx="1.5" fill="#000" opacity=".12"/>`;

SVG.pellet_stove = () => `
<defs>${DEFS}
<clipPath id="ID-win"><rect x="34" y="46" width="52" height="50" rx="5"/></clipPath>
<linearGradient id="ID-blk" x1="0" x2="1"><stop offset="0" stop-color="#17191c"/><stop offset=".5" stop-color="#34383e"/><stop offset="1" stop-color="#141618"/></linearGradient>
<linearGradient id="ID-white" x1="0" x2="1"><stop offset="0" stop-color="#d9dde2"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#c9ced4"/></linearGradient>
<linearGradient id="ID-brick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1712"/><stop offset="1" stop-color="#0f0706"/></linearGradient>
<radialGradient id="ID-glow" cx=".5" cy=".85" r=".85"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset=".45" stop-color="#ff7a1a" stop-opacity=".55"/><stop offset="1" stop-color="#3a0d00" stop-opacity="0"/></radialGradient>
<linearGradient id="ID-fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff3b0"/><stop offset=".3" stop-color="#ffc23d"/><stop offset=".68" stop-color="#ff7a1a"/><stop offset="1" stop-color="#e5381c" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-core" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#fff0a0"/><stop offset="1" stop-color="#ffc23d" stop-opacity="0"/></linearGradient></defs>
<g transform="translate(-6.5 -4.5) scale(1.11)">
<ellipse cx="60" cy="134" rx="44" ry="4.5" fill="url(#ID-shadow)"/>
<g class="flue-smoke"><path d="M57 0q-4-5 0-10t0-10"/><path d="M63 -2q-4-5 0-10t0-10"/></g>
<rect x="53" y="3" width="14" height="11" fill="url(#ID-chrome)"/>
<rect x="51" y="1" width="18" height="4" rx="1.5" fill="url(#ID-chrome)" stroke="#7d858e" stroke-width=".4"/>
<rect x="28" y="124" width="9" height="7" rx="1.5" fill="#24272b"/><rect x="83" y="124" width="9" height="7" rx="1.5" fill="#24272b"/>
<rect x="22" y="14" width="76" height="113" rx="7" fill="url(#ID-blk)" stroke="#0b0c0e" stroke-width=".6"/>
<rect x="22" y="22" width="9.5" height="102" rx="3.5" fill="url(#ID-white)"/>
<rect x="88.5" y="22" width="9.5" height="102" rx="3.5" fill="url(#ID-white)"/>
<rect x="19" y="11" width="82" height="8" rx="3" fill="#2b2f34" stroke="#474c53" stroke-width=".6"/>
<rect x="40" y="12.4" width="40" height="5" rx="1.6" fill="#1b1d21" stroke="#555b63" stroke-width=".5"/>
<path d="M36 23.5h48M36 26h48M36 28.5h48" stroke="#0b0c0e" stroke-width="1.2"/>
${lcd(46, 31.5, 28, 9)}
<circle cx="40" cy="36" r="2" fill="#3b4148" stroke="#5a616a" stroke-width=".4"/>
<circle class="led l1" cx="80" cy="36" r="1.5"/>
<rect x="31" y="43" width="58" height="56" rx="7" fill="#0f1113" stroke="#4a5058" stroke-width=".8"/>
<rect x="34" y="46" width="52" height="50" rx="5" fill="url(#ID-brick)"/>
<g clip-path="url(#ID-win)">
  <path d="M34 56h52M34 66h52M34 76h52M46 46v10M62 46v10M78 46v10M40 56v10M56 56v10M72 56v10M48 66v10M64 66v10M80 66v10" stroke="#3d2219" stroke-width=".6" opacity=".9"/>
  <rect class="glow" x="34" y="46" width="52" height="50" fill="url(#ID-glow)"/>
  <g class="fire">
    <path class="flame f2" d="M52.5 86C46.5 81 47.5 73 50 68C51.5 73 54 73.5 54 69C57.5 74.5 58.5 82 52.5 86Z" fill="url(#ID-fl)"/>
    <path class="flame f3" d="M67.5 86C62 82 63 74 65.5 70C66.5 74.5 68.5 74.5 69.5 70C73.5 76.5 72.5 83 67.5 86Z" fill="url(#ID-fl)"/>
    <path class="flame f1" d="M60 86C51 80 52.5 69 57 62C58 68.5 61 68.5 60.5 60C67.5 67 71 78 60 86Z" fill="url(#ID-fl)"/>
    <path class="flame f5" d="M59.5 68C57.5 62 59.5 56 61.5 52C62.5 58 63.5 62.5 59.5 68Z" fill="url(#ID-fl)" opacity=".85"/>
    <path class="flame f4" d="M60 86C56 83 56 77 58.5 72.5C59.5 76 61.5 76.5 62 73C64.5 78 64.5 83 60 86Z" fill="url(#ID-core)"/>
  </g>
  <g class="smoke-in"><path d="M55 82q-3-6 0-12t0-12"/><path d="M64 82q-3-6 0-12t0-12"/></g>
  <path d="M45 92h30l-3.5-7h-23z" fill="#3a3f45" stroke="#5c636b" stroke-width=".5"/>
  <g class="pellets" fill="#8a5a2b"><rect x="50" y="83.6" width="3" height="1.4" rx=".7"/><rect x="54" y="84.2" width="3" height="1.4" rx=".7" transform="rotate(20 55.5 85)"/><rect x="58" y="83.4" width="3" height="1.4" rx=".7"/><rect x="62" y="84" width="3" height="1.4" rx=".7" transform="rotate(-15 63.5 84.7)"/><rect x="66" y="83.6" width="3" height="1.4" rx=".7"/></g>
  <g class="embers"><circle cx="51" cy="84.6" r=".9"/><circle cx="55.5" cy="85.2" r="1"/><circle cx="59.5" cy="84.4" r=".9"/><circle cx="63.5" cy="85" r="1"/><circle cx="67.5" cy="84.6" r=".9"/></g>
  <circle class="igniter" cx="60" cy="88.5" r="1.8"/>
</g>
<path d="M36 60L50 46h8L36 70z" fill="#fff" opacity=".08"/>
<rect x="34" y="46" width="52" height="50" rx="5" fill="none" stroke="#000" stroke-opacity=".5"/>
<rect x="86.3" y="60" width="2.3" height="16" rx="1.1" fill="url(#ID-chrome)"/>
<rect x="34" y="104" width="52" height="12" rx="2" fill="#18191c" stroke="#3b4047" stroke-width=".6"/>
<rect x="52" y="108.5" width="16" height="3" rx="1.5" fill="#4a5058"/>
<path d="M36 120h48M36 122.5h48" stroke="#0b0c0e" stroke-width="1"/>
<g class="warm-air"><path d="M42 30q-2-3 0-6t0-6"/><path d="M54 30q-2-3 0-6t0-6"/><path d="M66 30q-2-3 0-6t0-6"/><path d="M78 30q-2-3 0-6t0-6"/></g>
</g>`;

SVG.pool_pump = () => `
<defs>${DEFS}
<clipPath id="ID-win"><rect x="22" y="52" width="16" height="32" rx="3"/></clipPath>
<clipPath id="ID-pool"><rect x="0" y="113" width="120" height="27"/></clipPath>
<linearGradient id="ID-motor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f86d8"/><stop offset=".35" stop-color="#6fb0f0"/><stop offset=".6" stop-color="#2f6fbf"/><stop offset="1" stop-color="#174a85"/></linearGradient>
<linearGradient id="ID-grey" x1="0" x2="1"><stop offset="0" stop-color="#b9c0c7"/><stop offset=".45" stop-color="#eef1f4"/><stop offset="1" stop-color="#a3abb4"/></linearGradient>
<linearGradient id="ID-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fd0ff"/><stop offset="1" stop-color="#0a6fb8"/></linearGradient>
<linearGradient id="ID-pot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff" stop-opacity=".55"/><stop offset="1" stop-color="#1b88d0" stop-opacity=".85"/></linearGradient></defs>
<rect x="0" y="113" width="120" height="27" fill="url(#ID-water)"/>
<g clip-path="url(#ID-pool)">
  <path d="M0 117h120" stroke="#1d6fa8" stroke-width="2.2" stroke-dasharray="3 1"/>
  <g class="ripple"><path d="M-30 124q5-2 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".9"/>
  <path d="M-25 132q5-2 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".9"/></g>
  <g class="bubbles"><circle cx="108" cy="125" r="1.2"/><circle cx="104" cy="123" r=".9"/><circle cx="106" cy="128" r="1"/><circle cx="101" cy="126" r=".8"/></g>
</g>
<rect x="0" y="108" width="120" height="5.5" fill="#d8d0bf"/>
<path d="M20 108v5.5M44 108v5.5M68 108v5.5M92 108v5.5" stroke="#b7ad98" stroke-width=".6"/>
<rect x="10" y="100" width="100" height="8" fill="#c4bfb4"/><rect x="10" y="100" width="100" height="1.5" fill="#d6d2c8"/>
<g class="pipes">
  <path d="M6 126V72H18" fill="none" stroke="#9aa3ad" stroke-width="8" stroke-linejoin="round"/>
  <path d="M6 126V72H18" fill="none" stroke="#f1f3f5" stroke-width="6" stroke-linejoin="round"/>
  <path d="M52 62V26H112V126" fill="none" stroke="#9aa3ad" stroke-width="8" stroke-linejoin="round"/>
  <path d="M52 62V26H112V126" fill="none" stroke="#f1f3f5" stroke-width="6" stroke-linejoin="round"/>
  <path class="flow" d="M6 126V72H18"/>
  <path class="flow" d="M52 62V26H112V124"/>
  <rect x="2" y="90" width="8" height="5" rx="1" fill="#d5dade" stroke="#9aa3ad" stroke-width=".5"/>
  <rect x="48" y="38" width="8" height="5" rx="1" fill="#d5dade" stroke="#9aa3ad" stroke-width=".5"/>
</g>
<g class="hum">
<rect x="46" y="92" width="56" height="8" rx="1.5" fill="#3a3f45"/>
<rect x="18" y="44" width="24" height="48" rx="4" fill="url(#ID-grey)" stroke="#8f979f" stroke-width=".6"/>
<rect x="16" y="35" width="28" height="9" rx="2.5" fill="#2b3036"/>
<rect x="19" y="36.5" width="22" height="3" rx="1.5" fill="#cfe9ff" opacity=".55"/>
<rect x="22" y="52" width="16" height="32" rx="3" fill="url(#ID-pot)"/>
<g clip-path="url(#ID-win)">
  <path d="M23 58h14M23 64h14M23 70h14M23 76h14M26 52v32M30 52v32M34 52v32" stroke="#ffffff" stroke-opacity=".35" stroke-width=".5"/>
  <g class="swirl">
    <path d="M30 68m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width=".8" stroke-dasharray="4 3"/>
    <path d="M27 63q2-2 4 0q-2 1.5-4 0z" fill="#5c9a34"/><path d="M32 72q2-2 4 0q-2 1.5-4 0z" fill="#8a6a2b"/><path d="M26 74q1.5-2 3.5 0q-1.5 1.5-3.5 0z" fill="#4f8a2a"/>
  </g>
</g>
<rect x="22" y="52" width="16" height="32" rx="3" fill="none" stroke="#6f7881" stroke-width=".6"/>
<circle cx="52" cy="74" r="13" fill="url(#ID-grey)" stroke="#8f979f" stroke-width=".6"/>
<circle cx="52" cy="74" r="8" fill="none" stroke="#a7afb7" stroke-width=".7"/>
<rect x="60" y="56" width="42" height="36" rx="6" fill="url(#ID-motor)"/>
<path d="M65 58v32M69 58v32M73 58v32M77 58v32M81 58v32M85 58v32M89 58v32M93 58v32M97 58v32" stroke="#123a6a" stroke-opacity=".45" stroke-width=".9"/>
<rect x="64" y="45" width="32" height="11" rx="2" fill="#1d2126" stroke="#40464e" stroke-width=".5"/>
${lcd(66, 46.5, 24, 8)}
<circle class="led l1" cx="93" cy="50.5" r="1.3"/>
<rect x="99" y="58" width="10" height="32" rx="3" fill="url(#ID-grey)" stroke="#8f979f" stroke-width=".6"/>
<g class="fan"><path d="M104 74l-3.5-5.5M104 74l6-1M104 74l-2.5 6" stroke="#5b636c" stroke-width="2" stroke-linecap="round"/></g>
<path d="M100.5 63h7M100.5 67h7M100.5 71h7M100.5 75h7M100.5 79h7M100.5 83h7" stroke="#6f7881" stroke-width=".9"/>
<path d="M64 60q10-3 34 0" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/>
</g>`;

SVG.printer_3d = () => `
<defs>${DEFS}
<clipPath id="ID-obj"><rect class="objclip" x="40" y="66" width="40" height="38"/></clipPath>
<linearGradient id="ID-frame" x1="0" x2="1"><stop offset="0" stop-color="#2a2e33"/><stop offset=".5" stop-color="#4a5058"/><stop offset="1" stop-color="#23272b"/></linearGradient>
<linearGradient id="ID-alu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f3f5"/><stop offset=".5" stop-color="#b9c0c7"/><stop offset="1" stop-color="#8d959e"/></linearGradient>
<linearGradient id="ID-pei" x1="0" x2="1"><stop offset="0" stop-color="#3a3326"/><stop offset=".5" stop-color="#6b5a3a"/><stop offset="1" stop-color="#3a3326"/></linearGradient>
<linearGradient id="ID-fil" x1="0" x2="1"><stop offset="0" style="stop-color:var(--fil)" stop-opacity=".75"/><stop offset=".45" style="stop-color:var(--fil)"/><stop offset="1" style="stop-color:var(--fil)" stop-opacity=".7"/></linearGradient>
<pattern id="ID-layers" width="4" height="1.3" patternUnits="userSpaceOnUse"><rect width="4" height=".55" fill="#000" opacity=".18"/></pattern></defs>
<ellipse cx="60" cy="133" rx="50" ry="4.5" fill="url(#ID-shadow)"/>
<g class="spool">
  <circle cx="97" cy="20" r="11" fill="#1f2226" stroke="#3b4047" stroke-width=".6"/>
  <circle cx="97" cy="20" r="9" style="fill:var(--fil)"/>
  <circle cx="97" cy="20" r="9" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="2.6" stroke-dasharray=".8 1.2"/>
  <circle cx="97" cy="20" r="4" fill="#2b2f34" stroke="#555b63" stroke-width=".6"/>
  <circle cx="97" cy="20" r="1.6" fill="#8d959e"/>
  <path d="M93 16.5l2 2M101 16.5l-2 2M93 23.5l2-2M101 23.5l-2-2" stroke="#555b63" stroke-width=".8"/>
</g>
<rect x="94" y="32" width="6" height="10" rx="1.5" fill="url(#ID-frame)"/>
<rect x="17" y="16" width="10" height="100" rx="2.5" fill="url(#ID-frame)"/>
<rect x="15.5" y="13" width="13" height="5" rx="2" fill="#33373d"/>
<rect x="20.8" y="20" width="2.4" height="92" rx="1.2" fill="url(#ID-alu)" opacity=".85"/>
<rect x="10" y="112" width="100" height="16" rx="4" fill="url(#ID-frame)" stroke="#16181b" stroke-width=".6"/>
<rect x="12" y="113" width="96" height="1.6" rx=".8" fill="#fff" opacity=".12"/>
${lcd(78, 116, 26, 9)}
<circle class="led l1" cx="72" cy="120.5" r="1.4"/>
<rect x="32" y="108" width="56" height="4" rx="1" fill="#5d646c"/>
<g class="bedheat"><path d="M40 101q-2-3 0-6t0-6"/><path d="M54 101q-2-3 0-6t0-6"/><path d="M66 101q-2-3 0-6t0-6"/><path d="M80 101q-2-3 0-6t0-6"/></g>
<rect x="30" y="104" width="60" height="4.5" rx="1" fill="url(#ID-pei)" stroke="#1c1a15" stroke-width=".5"/>
<g clip-path="url(#ID-obj)"><g class="object">
  <path d="M49 104C47 96 45 88 48 80C50 74 52 70 52 66H68C68 70 70 74 72 80C75 88 73 96 71 104Z" fill="url(#ID-fil)"/>
  <path d="M49 104C47 96 45 88 48 80C50 74 52 70 52 66H68C68 70 70 74 72 80C75 88 73 96 71 104Z" fill="url(#ID-layers)"/>
  <path d="M53 101C52 94 51 88 53 82" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none" stroke-linecap="round"/>
</g></g>
<g class="gantry">
  <rect x="22" y="82" width="76" height="5" rx="1.5" fill="url(#ID-alu)" stroke="#7d858e" stroke-width=".4"/>
  <rect x="94" y="80" width="6" height="9" rx="1.5" fill="url(#ID-frame)"/>
  <g class="head">
    <rect x="51" y="78" width="18" height="21" rx="3" fill="#ececec" stroke="#a7afb7" stroke-width=".6"/>
    <rect x="51" y="78" width="18" height="5" rx="2" fill="#2b2f34"/>
    <circle cx="60" cy="90" r="4.2" fill="#2b2f34"/>
    <g class="hfan"><path d="M60 90l0-3.4M60 90l2.9 1.7M60 90l-2.9 1.7" stroke="#8d959e" stroke-width="1.3" stroke-linecap="round"/></g>
    <path d="M57.5 99h5l-1.6 4h-1.8z" fill="#c9a43a" stroke="#8a6d1f" stroke-width=".4"/>
    <path d="M69 81q12-4 25-30" fill="none" stroke="#e9ecef" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>
    <circle class="tip" cx="60" cy="103.4" r="1.2"/>
    <rect class="filpath" x="59.2" y="70" width="1.6" height="8" style="fill:var(--fil)"/>
  </g>
</g>`;

SVG.radiator = () => `
<defs>${DEFS}
<clipPath id="ID-fins"><path d="M12.0 27H23.4V100Q23.4 104 20.4 104H15.0Q12.0 104 12.0 100Z"/><path d="M24.8 27H36.2V100Q36.2 104 33.2 104H27.8Q24.8 104 24.8 100Z"/><path d="M37.6 27H49.0V100Q49.0 104 46.0 104H40.6Q37.6 104 37.6 100Z"/><path d="M50.4 27H61.8V100Q61.8 104 58.8 104H53.4Q50.4 104 50.4 100Z"/><path d="M63.2 27H74.6V100Q74.6 104 71.6 104H66.2Q63.2 104 63.2 100Z"/><path d="M76.0 27H87.4V100Q87.4 104 84.4 104H79.0Q76.0 104 76.0 100Z"/></clipPath>
<linearGradient id="ID-fin" x1="0" x2="1"><stop offset="0" stop-color="#e3e6e9"/><stop offset=".25" stop-color="#ffffff"/><stop offset=".85" stop-color="#f6f7f8"/><stop offset="1" stop-color="#d9dde1"/></linearGradient>
<linearGradient id="ID-side" x1="0" x2="1"><stop offset="0" stop-color="#e7eaed"/><stop offset="1" stop-color="#cdd2d7"/></linearGradient>
<linearGradient id="ID-heatglow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".15"/><stop offset="1" stop-color="#ff5a1f" stop-opacity=".9"/></linearGradient>
<linearGradient id="ID-box" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e5e8"/></linearGradient></defs>
<g class="rwaves"><path d="M22 18q-3-5 0-10t0-10"/><path d="M38 16q-3-5 0-10t0-10"/><path d="M54 18q-3-5 0-10t0-10"/><path d="M70 16q-3-5 0-10t0-10"/></g>
<g class="cold-air"><path d="M-6 50q6-3 12 0t12 0"/><path d="M-8 66q6-3 12 0t12 0"/><path d="M-6 82q6-3 12 0t12 0"/></g>
<path d="M16 30H95.4V108H16Z" fill="#000" opacity=".1" filter="blur(2px)"/>
<path d="M87.4 27L91.4 23V100L87.4 104Z" fill="url(#ID-side)" stroke="#c9ced4" stroke-width=".4"/>
<circle cx="89.4" cy="31" r="1.6" fill="#e9ecef" stroke="#aeb5bc" stroke-width=".5"/>
<path d="M12.0 27L15.5 23H26.9L23.4 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="15.0" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M24.8 27L28.3 23H39.7L36.2 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="27.8" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M37.6 27L41.1 23H52.5L49.0 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="40.6" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M50.4 27L53.9 23H65.3L61.8 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="53.4" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M63.2 27L66.7 23H78.1L74.6 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="66.2" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/><path d="M76.0 27L79.5 23H90.9L87.4 27Z" fill="#eef0f2" stroke="#cfd4d9" stroke-width=".4"/><rect x="79.0" y="24" width="8.4" height="1.6" rx=".8" fill="#c3c9cf"/>
<path d="M12.0 27H23.4V100Q23.4 104 20.4 104H15.0Q12.0 104 12.0 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M24.8 27H36.2V100Q36.2 104 33.2 104H27.8Q24.8 104 24.8 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M37.6 27H49.0V100Q49.0 104 46.0 104H40.6Q37.6 104 37.6 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M50.4 27H61.8V100Q61.8 104 58.8 104H53.4Q50.4 104 50.4 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M63.2 27H74.6V100Q74.6 104 71.6 104H66.2Q63.2 104 63.2 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/><path d="M76.0 27H87.4V100Q87.4 104 84.4 104H79.0Q76.0 104 76.0 100Z" fill="url(#ID-fin)" stroke="#d2d6da" stroke-width=".4"/>
<g clip-path="url(#ID-fins)"><rect class="rglow" x="10" y="26" width="87.4" height="80" fill="url(#ID-heatglow)"/></g>
<path d="M82.4 84h18q2 0 2 2v16q0 3-3 6l-3 10h-10q-2 0-2-2V86q0-2 2-2z" fill="url(#ID-box)" stroke="#bfc6ce" stroke-width=".6"/>
${lcd(84.8, 86.5, 15, 8)}
<g class="micon m-comfort" transform="translate(87.4 97.3) scale(.48)"><circle r="2.2"/><path d="M0-4.2v1.1M0 3.1v1.1M-4.2 0h1.1M3.1 0h1.1M-3 -3l.8.8M2.2 2.2l.8.8M-3 3l.8-.8M2.2-2.2l.8-.8" stroke-width=".9" stroke-linecap="round"/></g>
<g class="micon m-eco" transform="translate(92.4 97.3) scale(.48)"><path d="M1.6-3a3.4 3.4 0 1 0 1.8 5.6a2.8 2.8 0 0 1-1.8-5.6z"/></g>
<g class="micon m-frost" transform="translate(97.4 97.3) scale(.48)"><path d="M0-3.4v6.8M-3 -1.7l6 3.4M-3 1.7l6-3.4" stroke-width="1.1" stroke-linecap="round"/></g>
<g fill="#eef0f2" stroke="#a7aeb5" stroke-width=".4"><circle cx="86.8" cy="102.5" r="1.4"/><circle cx="91.8" cy="102.5" r="1.4"/><circle cx="96.8" cy="102.5" r="1.4"/><circle cx="89.3" cy="106.5" r="1.4"/><circle cx="94.3" cy="106.5" r="1.4"/></g>
<circle class="led l1" cx="96.8" cy="106.5" r=".8"/>`;

SVG.range_hood = () => `
<defs>${DEFS}
<linearGradient id="ID-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c9" stop-opacity=".55"/><stop offset="1" stop-color="#fff4c9" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#0d1013"/></linearGradient></defs>
<ellipse cx="60" cy="133" rx="52" ry="4" fill="url(#ID-shadow)"/>
<g class="hd-beam"><path d="M24 80l-12 40h32z" fill="url(#ID-beam)"/><path d="M96 80l-12 40h32z" fill="url(#ID-beam)"/></g>
<g class="hd-air"><path d="M38 118q-4-18 10-36"/><path d="M60 116v-34"/><path d="M82 118q4-18-10-36"/><path d="M28 112q2-16 18-30"/><path d="M92 112q-2-16-18-30"/></g>
<g class="hd-steam"><path d="M54 96q-3-5 0-9t0-9"/><path d="M60 95q-3-5 0-9t0-9"/><path d="M66 96q-3-5 0-9t0-9"/></g>
<rect x="46" y="4" width="28" height="46" fill="url(#ID-inox)" stroke="#8f979f" stroke-width=".6"/>
<path d="M48 4v46" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/>
<path d="M50 40h20M50 43h20M50 46h20" stroke="#6f7780" stroke-width=".7"/>
<path d="M16 50h88l10 20h-108z" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".6"/>
<path d="M20 52h40l-6 16h-44z" fill="#fff" opacity=".18"/>
<rect x="6" y="70" width="108" height="8" rx="1.5" fill="url(#ID-chrome)" stroke="#6f7780" stroke-width=".5"/>
<circle cx="60" cy="60" r="7.5" fill="#22272d" stroke="#6f7780" stroke-width=".6"/>
<g class="hd-fan"><path d="M60 60l0-6.2M60 60l5.4 3.1M60 60l-5.4 3.1" stroke="#a9b1ba" stroke-width="2.4" stroke-linecap="round"/></g>
<circle cx="60" cy="60" r="1.6" fill="#d7dce1"/>
<circle cx="60" cy="60" r="7.5" fill="url(#ID-holes)" opacity=".6"/>
<circle class="hd-led s1" cx="86" cy="74" r="1.4"/><circle class="hd-led s2" cx="93" cy="74" r="1.4"/><circle class="hd-led s3" cx="100" cy="74" r="1.4"/>
<circle class="hd-led lt" cx="20" cy="74" r="1.4"/>
<path d="M17 74h-3M27 74h-3" stroke="#59616b" stroke-width=".8"/>
<rect x="9" y="78" width="102" height="3" rx="1" fill="#2a2f35"/><rect x="12" y="78" width="96" height="3" fill="url(#ID-mesh)"/>
<rect class="hd-lamp" x="20" y="79.6" width="8" height="1.8" rx=".9"/><rect class="hd-lamp" x="92" y="79.6" width="8" height="1.8" rx=".9"/>
<path d="M45 98h30v16q0 4-4 4h-22q-4 0-4-4z" fill="url(#ID-inox)" stroke="#7d858e" stroke-width=".6"/>
<rect x="44" y="96" width="32" height="3" rx="1.5" fill="url(#ID-chrome)"/><rect x="57" y="93.5" width="6" height="3" rx="1.2" fill="#2a2f35"/>
<path d="M45 102h-5M75 102h5" stroke="#2a2f35" stroke-width="2.2" stroke-linecap="round"/>
<rect x="10" y="118" width="100" height="7" rx="1.5" fill="url(#ID-glass)" stroke="#05070a" stroke-width=".5"/>
<ellipse class="hd-zone" cx="60" cy="119.5" rx="17" ry="1.3"/>
<ellipse cx="88" cy="121" rx="10" ry="1.2" fill="none" stroke="#3a424b" stroke-width=".6"/>`;

SVG.server_rack = () => `
<defs>${DEFS}
<linearGradient id="ID-rkframe" x1="0" x2="1"><stop offset="0" stop-color="#2a2f35"/><stop offset=".5" stop-color="#14171b"/><stop offset="1" stop-color="#262b31"/></linearGradient>
<linearGradient id="ID-rkunit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b424a"/><stop offset=".15" stop-color="#262b31"/><stop offset="1" stop-color="#16191d"/></linearGradient>
<linearGradient id="ID-rkblue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b9cff" stop-opacity=".5"/><stop offset="1" stop-color="#3b9cff" stop-opacity="0"/></linearGradient></defs>
<ellipse cx="60" cy="135" rx="50" ry="3.5" fill="url(#ID-shadow)"/>
<rect x="16" y="4" width="88" height="126" rx="3" fill="url(#ID-rkframe)" stroke="#4a525a" stroke-width=".8"/>
<rect x="22" y="10" width="76" height="114" fill="#07090b"/>
<path d="M19 12v110M101 12v110" stroke="#556068" stroke-width=".6" stroke-dasharray="1.2 4.2"/>
<g class="rk-glow"><rect x="22" y="92" width="76" height="30" fill="url(#ID-rkblue)"/></g>
<rect x="24" y="12" width="72" height="7" rx="1" fill="url(#ID-rkunit)" stroke="#59616b" stroke-width=".4"/>
<circle class="rk-led rk-g" cx="30" cy="15.5" r="1"/><circle class="rk-led rk-r" cx="35" cy="15.5" r="1"/>
<path d="M44 14h4M50 14h4M56 14h4M62 14h4M68 14h4M74 14h4M80 14h4M86 14h4" stroke="#7d858e" stroke-width="1.4"/>
<path d="M44 17.2h46" stroke="#59616b" stroke-width=".5"/>
<rect x="24" y="30" width="72" height="1" fill="#2b3138"/>
<rect x="46" y="22" width="28" height="8" rx="1.6" fill="#d7dce1" stroke="#9aa2ab" stroke-width=".4"/>
<circle class="rk-led rk-g" cx="52" cy="26" r="1"/><circle class="rk-led rk-g" cx="57" cy="26" r="1" style="animation-delay:.4s"/><circle class="rk-led rk-b" cx="62" cy="26" r="1" style="animation-delay:.9s"/>
<rect x="24" y="32" width="72" height="14" rx="1" fill="url(#ID-rkunit)" stroke="#59616b" stroke-width=".4"/>
<rect x="26" y="33.6" width="24" height="3.2" rx=".8" fill="#e9ecef"/>
<path d="M30 40h40M30 42.4h40M30 44.8h40" stroke="#080a0d" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>
<circle class="rk-led rk-g" cx="84" cy="36.5" r="1"/><circle class="rk-led rk-g" cx="89" cy="36.5" r="1" style="animation-delay:.6s"/>
<g class="rk-fan"><circle cx="80" cy="42" r="3.2" fill="#0b0d10"/><path d="M80 42v-3M80 42l2.6 1.5M80 42l-2.6 1.5" stroke="#8d959f" stroke-width="1" stroke-linecap="round"/><circle cx="80" cy="42" r="3.2" fill="none"/></g>
<rect x="24" y="48" width="72" height="7" rx="1" fill="#dfe3e7" stroke="#9aa2ab" stroke-width=".4"/>
<path d="M27 50h3v3h-3zM32 50h3v3h-3zM37 50h3v3h-3zM42 50h3v3h-3zM47 50h3v3h-3zM52 50h3v3h-3zM57 50h3v3h-3zM62 50h3v3h-3zM67 50h3v3h-3zM72 50h3v3h-3zM77 50h3v3h-3zM82 50h3v3h-3z" fill="#2b3138"/>
<path d="M28.5 53v4M33.5 53v5M38.5 53v4M43.5 53v6M48.5 53v4" stroke="#f4f6f8" stroke-width="1.4" stroke-linecap="round"/>
<rect x="24" y="57" width="72" height="9" rx="1" fill="url(#ID-rkunit)" stroke="#59616b" stroke-width=".4"/>
<text x="29" y="63.4" font-family="Arial,sans-serif" font-size="3.6" font-weight="700" fill="#e04b3c">APC</text>
<rect x="60" y="58.4" width="30" height="6.4" rx="1.2" fill="#0c1720" stroke="#8f98a2" stroke-width=".4"/>
<text class="lcd" x="75" y="63.6" text-anchor="middle">OFF</text>
<rect x="24" y="68" width="72" height="8" rx="1" fill="url(#ID-panel)" stroke="#9aa2ab" stroke-width=".4"/>
<rect x="27" y="70" width="40" height="4" rx=".8" fill="#2b3138"/>
<circle class="rk-led rk-g" cx="30" cy="72" r=".9"/><circle class="rk-led rk-g" cx="34" cy="72" r=".9" style="animation-delay:.2s"/><circle class="rk-led rk-g" cx="38" cy="72" r=".9" style="animation-delay:.7s"/>
<circle class="rk-led rk-g" cx="42" cy="72" r=".9" style="animation-delay:.4s"/><circle class="rk-led rk-g" cx="46" cy="72" r=".9" style="animation-delay:1s"/><circle class="rk-led rk-g" cx="50" cy="72" r=".9" style="animation-delay:.1s"/>
<circle class="rk-led rk-g" cx="54" cy="72" r=".9" style="animation-delay:.8s"/><circle class="rk-led rk-g" cx="58" cy="72" r=".9" style="animation-delay:.5s"/><circle class="rk-led rk-g" cx="62" cy="72" r=".9" style="animation-delay:1.2s"/>
<path d="M72 72h20" stroke="#7d858e" stroke-width="2" stroke-linecap="round"/>
<rect x="24" y="78" width="72" height="14" rx="1" fill="url(#ID-rkunit)" stroke="#59616b" stroke-width=".4"/>
<rect x="26" y="80" width="30" height="10" rx="1" fill="#0b0d10"/>
<g class="rk-fan"><circle cx="34" cy="85" r="4" fill="#15181c"/><path d="M34 85v-3.6M34 85l3.1 1.8M34 85l-3.1 1.8" stroke="#a9b1ba" stroke-width="1.3" stroke-linecap="round"/><circle cx="34" cy="85" r="4" fill="none"/></g>
<g class="rk-fan"><circle cx="48" cy="85" r="4" fill="#15181c"/><path d="M48 85v-3.6M48 85l3.1 1.8M48 85l-3.1 1.8" stroke="#a9b1ba" stroke-width="1.3" stroke-linecap="round"/><circle cx="48" cy="85" r="4" fill="none"/></g>
<rect x="26" y="80" width="30" height="10" fill="url(#ID-mesh)" opacity=".5"/>
<circle class="rk-led rk-g" cx="84" cy="82" r="1"/><circle class="rk-led rk-b" cx="89" cy="82" r="1" style="animation-delay:.7s"/>
<path d="M62 85h14M62 88h14" stroke="#4a525a" stroke-width=".8"/>
<rect x="24" y="94" width="72" height="26" rx="1.5" fill="url(#ID-rkunit)" stroke="#59616b" stroke-width=".4"/>
<g fill="#0a0c0f" stroke="#4a525a" stroke-width=".5">
  <rect x="27" y="97" width="12" height="9" rx=".8"/><rect x="41" y="97" width="12" height="9" rx=".8"/><rect x="55" y="97" width="12" height="9" rx=".8"/><rect x="69" y="97" width="12" height="9" rx=".8"/>
  <rect x="27" y="108" width="12" height="9" rx=".8"/><rect x="41" y="108" width="12" height="9" rx=".8"/><rect x="55" y="108" width="12" height="9" rx=".8"/><rect x="69" y="108" width="12" height="9" rx=".8"/>
</g>
<g class="rk-hdd">
  <rect class="rk-led rk-b" x="29" y="103.6" width="8" height="1.4"/><rect class="rk-led rk-b" x="43" y="103.6" width="8" height="1.4" style="animation-delay:.5s"/>
  <rect class="rk-led rk-b" x="57" y="103.6" width="8" height="1.4" style="animation-delay:1.1s"/><rect class="rk-led rk-b" x="71" y="103.6" width="8" height="1.4" style="animation-delay:.3s"/>
  <rect class="rk-led rk-b" x="29" y="114.6" width="8" height="1.4" style="animation-delay:.9s"/><rect class="rk-led rk-b" x="43" y="114.6" width="8" height="1.4" style="animation-delay:.2s"/>
  <rect class="rk-led rk-b" x="57" y="114.6" width="8" height="1.4" style="animation-delay:.7s"/><rect class="rk-led rk-b" x="71" y="114.6" width="8" height="1.4" style="animation-delay:1.3s"/>
</g>
<rect x="85" y="97" width="9" height="20" rx="1" fill="#15181c" stroke="#4a525a" stroke-width=".4"/>
<circle class="rk-led rk-g" cx="89.5" cy="102" r="1"/><circle class="rk-led rk-b" cx="89.5" cy="107" r="1" style="animation-delay:.6s"/>
<g class="rk-cables" fill="none" stroke-linecap="round">
  <path d="M27 54q-9 2 -6 10t6 10" stroke="#2dd4bf" stroke-width="1.3"/><path d="M29 54q-12 4 -8 14t8 8" stroke="#f5d90a" stroke-width="1.3"/>
  <path d="M93 54q9 2 6 10t-6 10" stroke="#2dd4bf" stroke-width="1.3"/>
</g>
<g class="rk-flow" fill="none" stroke-linecap="round" stroke-width="1.6">
  <path d="M27 54q-9 2 -6 10t6 10"/><path d="M29 54q-12 4 -8 14t8 8"/><path d="M93 54q9 2 6 10t-6 10"/>
</g>
<rect x="22" y="121" width="76" height="3" fill="#1c2024"/>
<path d="M18 130v4M102 130v4" stroke="#14171b" stroke-width="4" stroke-linecap="round"/>
<path d="M20 6h80" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>`;

SVG.solar = () => `
<defs>${DEFS}
<clipPath id="ID-pan"><path d="M7.1 93.1L40.4 93.1L53.9 50.9L20.6 50.9Z M42.1 93.1L75.4 93.1L88.9 50.9L55.6 50.9Z"/></clipPath>
<linearGradient id="ID-cell" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#132a52"/><stop offset=".55" stop-color="#1f4683"/><stop offset="1" stop-color="#3a6fb8"/></linearGradient>
<linearGradient id="ID-rail" x1="0" x2="1"><stop offset="0" stop-color="#8d959e"/><stop offset=".5" stop-color="#e3e7eb"/><stop offset="1" stop-color="#7d858e"/></linearGradient>
<linearGradient id="ID-sweep" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="ID-sunglow"><stop offset="0" stop-color="#fff6c2" stop-opacity=".9"/><stop offset=".5" stop-color="#ffd23f" stop-opacity=".35"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient></defs>
<g class="sunwrap">
    <circle cx="98" cy="20" r="22" fill="url(#ID-sunglow)"/>
    <g class="rays"><path d="M98 4v5M98 31v5M82 20h5M109 20h5M86.7 8.7l3.5 3.5M105.8 27.8l3.5 3.5M86.7 31.3l3.5-3.5M105.8 12.2l3.5-3.5" stroke="#ffc51a" stroke-width="2.2" stroke-linecap="round"/></g>
    <circle cx="98" cy="20" r="8" fill="#ffd23f" stroke="#ffb400" stroke-width="1"/>
  </g>
<ellipse cx="46" cy="113" rx="40" ry="3.5" fill="url(#ID-shadow)"/>
<!-- rear legs and braces (behind the panels) -->
<rect x="24" y="52" width="3" height="58" fill="url(#ID-rail)"/>
<rect x="84" y="52" width="3" height="58" fill="url(#ID-rail)"/>
<path d="M26 104L84 78M26 80L84 104" stroke="#9aa3ad" stroke-width="1.2"/>
<path d="M26 92L12 104M86 92L72 104" stroke="#9aa3ad" stroke-width="1.2"/>
<!-- front legs -->
<rect x="9" y="92" width="2.6" height="18" fill="url(#ID-rail)"/>
<rect x="69" y="92" width="2.6" height="18" fill="url(#ID-rail)"/>
<!-- concrete blocks -->
<rect x="5.5" y="108" width="10" height="5" rx="1" fill="#b8b4ac" stroke="#8f8a80" stroke-width=".5"/>
<rect x="65.5" y="108" width="10" height="5" rx="1" fill="#b8b4ac" stroke="#8f8a80" stroke-width=".5"/>
<rect x="20.5" y="108" width="10" height="5" rx="1" fill="#b8b4ac" stroke="#8f8a80" stroke-width=".5"/>
<rect x="80.5" y="108" width="10" height="5" rx="1" fill="#b8b4ac" stroke="#8f8a80" stroke-width=".5"/>
<!-- panels -->
<path d="M6.0 94.0L76.0 94.0L90.0 50.0L20.0 50.0Z" fill="#c9d1da" stroke="#8d959e" stroke-width=".8" stroke-linejoin="round"/>
<path d="M7.1 93.1L40.4 93.1L53.9 50.9L20.6 50.9Z M42.1 93.1L75.4 93.1L88.9 50.9L55.6 50.9Z" fill="url(#ID-cell)" stroke="#dfe5ea" stroke-width="1" stroke-linejoin="round"/>
<path d="M9.4 86.1L42.7 86.1M11.6 79.0L44.9 79.0M13.8 72.0L47.2 72.0M16.1 65.0L49.4 65.0M18.3 57.9L51.6 57.9M15.4 93.1L28.9 50.9M23.8 93.1L37.2 50.9M32.1 93.1L45.5 50.9M44.4 86.1L77.7 86.1M46.6 79.0L79.9 79.0M48.8 72.0L82.2 72.0M51.1 65.0L84.4 65.0M53.3 57.9L86.6 57.9M50.5 93.1L63.9 50.9M58.8 93.1L72.2 50.9M67.1 93.1L80.5 50.9" stroke="#6f97d4" stroke-width=".35" opacity=".85"/>
<g clip-path="url(#ID-pan)"><rect class="sweep" x="-20" y="44" width="24" height="54" fill="url(#ID-sweep)" transform="skewX(-18)"/></g>
<path class="panglow" d="M7.1 93.1L40.4 93.1L53.9 50.9L20.6 50.9Z M42.1 93.1L75.4 93.1L88.9 50.9L55.6 50.9Z" fill="#ffe28a"/>
<path class="panshade" d="M7.1 93.1L40.4 93.1L53.9 50.9L20.6 50.9Z M42.1 93.1L75.4 93.1L88.9 50.9L55.6 50.9Z" fill="#0b1630"/>
<!-- cable to inverter -->
<path d="M70 92V106H101V98" fill="none" stroke="#2b2f34" stroke-width="1.6" stroke-linejoin="round"/>
<path class="sflow" d="M70 92V106H101V98"/>
<!-- inverter on its post -->
<rect x="100" y="94" width="3" height="16" fill="url(#ID-rail)"/>
<rect x="97" y="108" width="9" height="5" rx="1" fill="#b8b4ac" stroke="#8f8a80" stroke-width=".5"/>
<rect x="91" y="64" width="22" height="32" rx="2.5" fill="#e7eaee" stroke="#9aa3ad" stroke-width=".6"/>
<rect x="91" y="64" width="22" height="4.5" rx="2" fill="#cfd5db"/>
<path d="M94 88h16M94 90.5h16M94 93h16" stroke="#b3bac2" stroke-width=".6"/>
${lcd(93, 71, 18, 8)}
<circle class="led l1" cx="96" cy="83" r="1.3"/>
<path d="M104 80l-2 4h3l-2 4" stroke="#ffb400" stroke-width=".9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

/* Chargeur de batterie d'outils (perceuse, visseuse…) : batterie posée sur son socle, vue de 3/4 */
SVG.tool_charger = () => {
  // repère de la batterie : P0 = coin avant-gauche du dessus, a = arête avant, b = profondeur, H = hauteur
  const P = [22, 50], A = [46, 12], B = [30, -13], H = 30;
  const pt = (u, v, h = 0) => `${(P[0] + A[0] * u + B[0] * v).toFixed(1)} ${(P[1] + A[1] * u + B[1] * v + h).toFixed(1)}`;
  // nervures du dessus (grille comme sur la photo)
  const ribs = [0.18, 0.34, 0.5, 0.66, 0.82].map((v) => `M${pt(0.08, v)}L${pt(0.92, v)}`).join("")
    + [0.25, 0.5, 0.75].map((u) => `M${pt(u, 0.1)}L${pt(u, 0.9)}`).join("");
  // jauge 4 LED sur la face avant de la batterie
  const gauge = [0, 1, 2, 3].map((i) => {
    const u = 0.52 + i * 0.1;
    return `<path class="tc-g tc-g${i + 1}" d="M${pt(u, 0, 5)}L${pt(u + 0.07, 0, 5)}L${pt(u + 0.07, 0, 7.6)}L${pt(u, 0, 7.6)}z"/>`;
  }).join("");
  const skew = (Math.atan2(A[1], A[0]) * 180 / Math.PI).toFixed(1);
  return `
<defs>${DEFS}
<linearGradient id="ID-tcfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#30363d"/><stop offset="1" stop-color="#15191d"/></linearGradient>
<linearGradient id="ID-tcside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22272c"/><stop offset="1" stop-color="#0d1013"/></linearGradient>
<linearGradient id="ID-tctop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4148"/><stop offset="1" stop-color="#1c2126"/></linearGradient>
<radialGradient id="ID-tcglow"><stop offset="0" stop-color="#43e08a" stop-opacity=".55"/><stop offset="1" stop-color="#43e08a" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="62" cy="124" rx="54" ry="5" fill="url(#ID-shadow)"/>
<!-- câble d'alimentation enroulé à gauche -->
<path class="tc-cable" d="M14 96 C4 95, 2 84, 9 80 C16 76, 22 84, 15 89 C8 94, 3 104, 9 110 C14 115, 6 120, 2 118" fill="none" stroke="#14171a" stroke-width="2.6" stroke-linecap="round"/>
<path class="tc-flow" d="M2 118 C6 120, 14 115, 9 110 C3 104, 8 94, 15 89 C22 84, 16 76, 9 80 C2 84, 4 95, 14 96" fill="none" stroke="#43e08a" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="3 9"/>
<!-- socle du chargeur -->
<path d="M10 88 L76 105 L76 122 L10 105 Z" fill="url(#ID-tcfront)" stroke="#05070a" stroke-width=".5"/>
<path d="M76 105 L114 88 L114 104 L76 122 Z" fill="url(#ID-tcside)" stroke="#05070a" stroke-width=".5"/>
<path d="M10 88 L48 72 L114 88 L76 105 Z" fill="url(#ID-tctop)" stroke="#05070a" stroke-width=".5"/>
<path d="M10 88 L76 105 L114 88" fill="none" stroke="#5b636c" stroke-width=".6" opacity=".7"/>
<g stroke="#05070a" stroke-width="1.1" stroke-linecap="round">${[0, 1, 2, 3, 4, 5].map((i) => { const x = 88 + i * 4, y = 101 - i * 1.8; return `<path d="M${x} ${y}v9"/>`; }).join("")}</g>
<!-- voyants du chargeur : défaut + charge -->
<path d="M15.5 95.2l1.6 -2.8l1.6 2.8z" fill="none" stroke="#8b939c" stroke-width=".45"/>
<circle class="tc-err" cx="17.1" cy="98.6" r="1.05"/>
<rect x="15.6" y="101.4" width="3" height="1.7" rx=".3" fill="none" stroke="#8b939c" stroke-width=".45"/>
<circle class="tc-led" cx="17.1" cy="105.4" r="1.15"/>
<ellipse class="tc-glow" cx="62" cy="86" rx="44" ry="12" fill="url(#ID-tcglow)"/>
<!-- batterie posée sur le socle -->
<path d="M${pt(0, 0)}L${pt(1, 0)}L${pt(1, 0, H)}L${pt(0, 0, H)}Z" fill="url(#ID-tcfront)" stroke="#05070a" stroke-width=".5"/>
<path d="M${pt(1, 0)}L${pt(1, 1)}L${pt(1, 1, H - 2)}L${pt(1, 0, H)}Z" fill="url(#ID-tcside)" stroke="#05070a" stroke-width=".5"/>
<path d="M${pt(0, 0)}L${pt(0, 1)}L${pt(1, 1)}L${pt(1, 0)}Z" fill="url(#ID-tctop)" stroke="#05070a" stroke-width=".5"/>
<path d="${ribs}" stroke="#0b0d10" stroke-width="2.2" stroke-linecap="round"/>
<path d="${ribs}" stroke="#4a525a" stroke-width=".5" stroke-linecap="round" transform="translate(-.5 -.6)"/>
<path d="M${pt(0, 0, H - 6)}L${pt(1, 0, H - 6)}" stroke="#05070a" stroke-width=".8"/>
<path d="M${pt(0, 0)}L${pt(1, 0)}L${pt(1, 1)}" fill="none" stroke="#6a737c" stroke-width=".6" opacity=".7"/>
<!-- plaque générique 18 V -->
<g transform="translate(${pt(0.1, 0, 12).replace(" ", " ")}) skewY(${skew})">
  <rect x="0" y="0" width="18" height="7" rx="3.5" fill="#e9ecef"/>
  <rect x="0" y="0" width="7" height="7" rx="3.5" fill="#d63a2f"/>
  <path d="M4.2 1.2l-1.8 2.8h1.4l-.8 2l2.2 -3h-1.4z" fill="#fff"/>
  <text x="12.5" y="5.4" text-anchor="middle" font-size="4.6" font-weight="700" fill="#1b1f24" font-family="Arial, sans-serif">18V</text>
</g>
<g class="tc-gauge">${gauge}</g>
<path class="tc-bolt" d="M${pt(0.86, 0, 14)}l-2.6 4.6h2.2l-1.4 4.2l4 -5.6h-2.3l1.6 -3.2z"/>`;
};

SVG.towel_dryer = () => `
<defs>${DEFS}
<linearGradient id="ID-tdglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb877"/><stop offset="1" stop-color="#ff6a1f"/></linearGradient>
<linearGradient id="ID-tdtowel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f9fb3"/><stop offset=".5" stop-color="#58c3d4"/><stop offset="1" stop-color="#2a8ea1"/></linearGradient>
<linearGradient id="ID-tdwall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a828b" stop-opacity=".16"/><stop offset="1" stop-color="#7a828b" stop-opacity="0"/></linearGradient></defs>
<rect x="14" y="10" width="92" height="116" rx="6" fill="url(#ID-tdwall)"/>
<g class="td-heat"><path d="M44 112q-4-20 2-44t-2-44"/><path d="M60 112q4-20-2-44t2-44"/><path d="M76 112q-4-20 2-44t-2-44"/></g>
<rect x="22" y="16" width="9" height="106" rx="4.5" fill="#000" opacity=".12"/>
<rect x="89" y="16" width="9" height="106" rx="4.5" fill="#000" opacity=".12"/>
<path d="M44 55h32v22h-32z" fill="#237a8b"/>
<g class="td-bars">
  <rect x="29" y="22" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
  <rect x="29" y="38" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
  <rect x="29" y="54" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
  <rect x="29" y="70" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
  <rect x="29" y="86" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
  <rect x="29" y="102" width="62" height="5" rx="2.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".5"/>
</g>
<g class="td-glow" fill="url(#ID-tdglow)">
  <rect x="29" y="22" width="62" height="5" rx="2.5"/><rect x="29" y="38" width="62" height="5" rx="2.5"/><rect x="29" y="54" width="62" height="5" rx="2.5"/>
  <rect x="29" y="70" width="62" height="5" rx="2.5"/><rect x="29" y="86" width="62" height="5" rx="2.5"/><rect x="29" y="102" width="62" height="5" rx="2.5"/>
  <rect x="20" y="14" width="9" height="106" rx="4.5"/><rect x="91" y="14" width="9" height="106" rx="4.5"/>
</g>
<path d="M29 23.2h62M29 39.2h62M29 55.2h62M29 71.2h62M29 87.2h62M29 103.2h62" stroke="#fff" stroke-opacity=".85" stroke-width="1"/>
<rect x="20" y="14" width="9" height="106" rx="4.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".6"/>
<rect x="91" y="14" width="9" height="106" rx="4.5" fill="url(#ID-body)" stroke="#aeb6be" stroke-width=".6"/>
<path d="M22.5 18v98M93.5 18v98" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".9"/>
<g class="td-glow td-glow2" fill="url(#ID-tdglow)"><rect x="20" y="14" width="9" height="106" rx="4.5"/><rect x="91" y="14" width="9" height="106" rx="4.5"/></g>
<g class="td-towel">
  <path d="M42 56h36v30q-3 3-6 0q-3 3-6 0q-3 3-6 0q-3 3-6 0q-3 3-6 0q-3 3-3 0z" fill="url(#ID-tdtowel)"/>
  <path d="M42 80h36v3h-36z" fill="#e8f7fa" opacity=".9"/>
  <path d="M42 56h36v3h-36z" fill="#1f7384" opacity=".5"/>
  <path d="M50 59v20M60 59v20M70 59v20" stroke="#1f7384" stroke-opacity=".25" stroke-width="1"/>
</g>
<g class="td-towel td-towel2">
  <path d="M63 88h20v12q-3 2-5 0q-3 2-5 0q-3 2-5 0q-3 2-5 0z" fill="#f2a6b8"/>
  <path d="M63 96h20v2h-20z" fill="#fff" opacity=".7"/>
</g>
<g class="td-steam"><path d="M48 52q-3-4 0-8t0-8"/><path d="M60 50q-3-4 0-8t0-8"/><path d="M72 52q-3-4 0-8t0-8"/></g>
<rect x="18" y="120" width="13" height="5" rx="1.5" fill="#3a3f45"/><rect x="89" y="120" width="13" height="5" rx="1.5" fill="#3a3f45"/>
<rect x="70" y="108" width="36" height="14" rx="3" fill="url(#ID-dark)" stroke="#8f98a2" stroke-width=".6"/>
${lcd(74, 110, 22, 10)}
<circle class="td-led" cx="101" cy="115" r="1.4"/>
<ellipse cx="60" cy="132" rx="46" ry="3" fill="url(#ID-shadow)"/>`;

/* style de télé : murale (défaut, rien autour), sur pied central, sur deux pieds */
const tvStyle = (c) => ({ wall: "wall", mural: "wall", stand: "stand", pied: "stand", base: "stand", feet: "feet", pieds: "feet", legs: "feet" }[String(c?.style || "wall").toLowerCase()] || "wall");
const TV_STAND = {
  wall: "",
  // pied central trapézoïdal
  stand: `
<ellipse cx="60" cy="113.5" rx="30" ry="2.6" fill="url(#ID-shadow)"/>
<rect x="53" y="102" width="14" height="7" fill="#15181d"/>
<path d="M40 113l5-5h30l5 5z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>
<path d="M45 108h30" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>`,
  // deux pieds inclinés aux extrémités
  feet: `
<ellipse cx="60" cy="108.5" rx="46" ry="2.4" fill="url(#ID-shadow)"/>
<path d="M13 102l-5 5.6q-.8 1 .5 1h10.5q1.5 0 2-1l3.5-5.6z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>
<path d="M107 102l5 5.6q.8 1-.5 1h-10.5q-1.5 0-2-1l-3.5-5.6z" fill="#0b0d10" stroke="#2c3138" stroke-width=".5"/>`,
};

SVG.tv = (c) => `
<defs>${DEFS}<clipPath id="ID-scr"><rect x="4" y="38" width="112" height="63" rx="1"/></clipPath>
<linearGradient id="ID-off" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2027"/><stop offset=".6" stop-color="#0a0c0f"/><stop offset="1" stop-color="#14181d"/></linearGradient>
<linearGradient id="ID-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f5a73"/><stop offset=".55" stop-color="#3b2a7a"/><stop offset="1" stop-color="#0f1420"/></linearGradient>
<linearGradient id="ID-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f1420" stop-opacity=".95"/><stop offset=".6" stop-color="#0f1420" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38e1ff"/><stop offset="1" stop-color="#8a5cff"/></linearGradient></defs>
${TV_STAND[tvStyle(c)]}
<rect x="2.5" y="36.5" width="115" height="66" rx="2" fill="#0b0d10" stroke="#2c3138" stroke-width=".7"/>
<rect x="4" y="38" width="112" height="63" rx="1" fill="url(#ID-off)"/>
<g clip-path="url(#ID-scr)">
  <g class="tv-content">
    <rect x="4" y="38" width="112" height="63" fill="#0f1420"/>
    <rect x="4" y="38" width="112" height="33" fill="url(#ID-hero)"/>
    <circle cx="92" cy="50" r="9" fill="#ffb35c" opacity=".85"/>
    <path d="M60 71l14-12l9 6l12-10l21 16z" fill="#1d1640" opacity=".9"/>
    <rect x="4" y="38" width="112" height="33" fill="url(#ID-fade)"/>
    <rect x="9" y="51" width="30" height="3.2" rx="1" fill="#fff"/>
    <rect x="9" y="56" width="22" height="1.6" rx=".8" fill="#9aa3b8"/>
    <rect x="9" y="61" width="11" height="4" rx="1" fill="#fff"/><path d="M12 61.9l2.4 1.1l-2.4 1.1z" fill="#0f1420"/>
    <rect x="22" y="61" width="11" height="4" rx="1" fill="#59616b"/>
    <rect x="9" y="74" width="16" height="1.6" rx=".8" fill="#c9d0db"/>
    <g class="tv-row">
      <rect x="9" y="77.5" width="17" height="11" rx="1.2" fill="#e85d75"/><rect x="28" y="77.5" width="17" height="11" rx="1.2" fill="#3fb6a8"/>
      <rect x="47" y="77.5" width="17" height="11" rx="1.2" fill="#f2b84b"/><rect x="66" y="77.5" width="17" height="11" rx="1.2" fill="#5b7cfa"/>
      <rect x="85" y="77.5" width="17" height="11" rx="1.2" fill="#a55cd6"/><rect x="104" y="77.5" width="17" height="11" rx="1.2" fill="#4fb36b"/>
      <rect x="123" y="77.5" width="17" height="11" rx="1.2" fill="#e8834a"/><rect x="142" y="77.5" width="17" height="11" rx="1.2" fill="#3a8fd6"/>
      <path d="M12 86h8M31 86h10M50 86h7M69 86h9M88 86h10M107 86h8M126 86h9M145 86h8" stroke="#fff" stroke-opacity=".75" stroke-width="1" stroke-linecap="round"/>
    </g>
    <rect class="tv-sel" x="8.4" y="76.9" width="18.2" height="12.2" rx="1.6" fill="none" stroke="#fff" stroke-width=".9"/>
    <rect x="9" y="91.5" width="12" height="1.6" rx=".8" fill="#c9d0db"/>
    <g class="tv-row2">
      <rect x="9" y="95" width="24" height="9" rx="1.2" fill="#2f6f8f"/><rect x="35" y="95" width="24" height="9" rx="1.2" fill="#8f3f5f"/>
      <rect x="61" y="95" width="24" height="9" rx="1.2" fill="#6f6f2f"/><rect x="87" y="95" width="24" height="9" rx="1.2" fill="#3f4f8f"/>
      <rect x="113" y="95" width="24" height="9" rx="1.2" fill="#2f8f5f"/>
    </g>
  </g>
  <g class="tv-intro">
    <rect x="4" y="38" width="112" height="63" fill="#05070c"/>
    <g class="tv-streaks" stroke-linecap="round" fill="none">
      <path d="M4 44L60 69.5" stroke="#38e1ff"/><path d="M116 44L60 69.5" stroke="#8a5cff"/>
      <path d="M4 95L60 69.5" stroke="#8a5cff"/><path d="M116 95L60 69.5" stroke="#38e1ff"/>
      <path d="M60 38v31.5" stroke="#5fd0ff"/><path d="M60 101v-31.5" stroke="#a07cff"/>
    </g>
    <g class="tv-logo">
      <circle cx="60" cy="69.5" r="11" fill="none" stroke="url(#ID-logo)" stroke-width="2.2"/>
      <path d="M56.5 63.5q0-1.6 1.4-.8l8.6 5.4q1.3.8 0 1.6l-8.6 5.4q-1.4.8-1.4-.8z" fill="url(#ID-logo)"/>
    </g>
  </g>
  <rect class="tv-flash" x="4" y="38" width="112" height="63" fill="#eef6ff"/>
</g>
<path d="M4 38L46 38L4 78z" fill="#fff" opacity=".06"/>
<path class="tv-gloss" d="M4 38L78 38L30 101H4z" fill="url(#ID-gloss)"/>
<rect x="4" y="38" width="112" height="63" rx="1" fill="none" stroke="#000" stroke-opacity=".5"/>
<circle class="tv-led" cx="60" cy="101.8" r=".7"/>`;

SVG.vmc = () => `
<defs>${DEFS}
<clipPath id="ID-all"><rect x="0" y="0" width="120" height="140" rx="12"/></clipPath>
<clipPath id="ID-hole"><circle cx="60" cy="70" r="25"/></clipPath>
<linearGradient id="ID-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7e7a75"/><stop offset=".5" stop-color="#94908a"/><stop offset="1" stop-color="#6f6b66"/></linearGradient>
<linearGradient id="ID-tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f2ee"/><stop offset="1" stop-color="#e3e0da"/></linearGradient>
<linearGradient id="ID-face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f5f7"/><stop offset="1" stop-color="#d9dee3"/></linearGradient>
<radialGradient id="ID-recess" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e9edf0"/><stop offset=".75" stop-color="#c3cad1"/><stop offset="1" stop-color="#8f979f"/></radialGradient></defs>
<g clip-path="url(#ID-all)">
  <rect x="0" y="0" width="120" height="60" fill="url(#ID-stone)"/>
  <circle cx="28.3" cy="6.0" r="0.54" fill="#8a8580" opacity=".55"/><circle cx="10.8" cy="1.1" r="0.63" fill="#9c978f" opacity=".55"/><circle cx="96.1" cy="44.4" r="0.43" fill="#9c978f" opacity=".55"/><circle cx="33.2" cy="10.0" r="0.36" fill="#8a8580" opacity=".55"/><circle cx="113.2" cy="1.5" r="0.68" fill="#9c978f" opacity=".55"/><circle cx="96.1" cy="11.2" r="0.49" fill="#9c978f" opacity=".55"/><circle cx="10.4" cy="35.1" r="0.70" fill="#8a8580" opacity=".55"/><circle cx="21.3" cy="27.5" r="0.35" fill="#9c978f" opacity=".55"/><circle cx="0.9" cy="16.9" r="0.72" fill="#9c978f" opacity=".55"/><circle cx="101.8" cy="29.5" r="0.55" fill="#9c978f" opacity=".55"/><circle cx="51.7" cy="9.4" r="0.48" fill="#6b6763" opacity=".55"/><circle cx="9.7" cy="26.8" r="0.90" fill="#57534f" opacity=".55"/><circle cx="84.1" cy="8.4" r="0.70" fill="#6b6763" opacity=".55"/><circle cx="49.5" cy="11.8" r="0.68" fill="#9c978f" opacity=".55"/><circle cx="22.0" cy="25.3" r="0.65" fill="#8a8580" opacity=".55"/><circle cx="108.5" cy="5.9" r="0.34" fill="#8a8580" opacity=".55"/><circle cx="33.3" cy="33.8" r="0.82" fill="#6b6763" opacity=".55"/><circle cx="39.7" cy="10.3" r="0.58" fill="#6b6763" opacity=".55"/><circle cx="42.9" cy="4.8" r="0.88" fill="#9c978f" opacity=".55"/><circle cx="88.2" cy="55.7" r="0.31" fill="#9c978f" opacity=".55"/><circle cx="38.6" cy="8.9" r="0.69" fill="#6b6763" opacity=".55"/><circle cx="35.2" cy="11.1" r="0.57" fill="#8a8580" opacity=".55"/><circle cx="30.0" cy="34.7" r="0.40" fill="#6b6763" opacity=".55"/><circle cx="43.6" cy="26.4" r="0.52" fill="#9c978f" opacity=".55"/><circle cx="119.7" cy="33.1" r="0.56" fill="#8a8580" opacity=".55"/><circle cx="50.9" cy="12.1" r="0.34" fill="#6b6763" opacity=".55"/><circle cx="88.5" cy="34.5" r="0.88" fill="#6b6763" opacity=".55"/><circle cx="65.5" cy="33.8" r="0.49" fill="#6b6763" opacity=".55"/><circle cx="14.7" cy="30.7" r="0.76" fill="#57534f" opacity=".55"/><circle cx="78.2" cy="11.6" r="0.42" fill="#57534f" opacity=".55"/><circle cx="49.3" cy="2.1" r="0.55" fill="#8a8580" opacity=".55"/><circle cx="77.7" cy="24.8" r="0.43" fill="#8a8580" opacity=".55"/><circle cx="3.8" cy="14.8" r="0.45" fill="#8a8580" opacity=".55"/><circle cx="92.7" cy="24.2" r="0.46" fill="#9c978f" opacity=".55"/><circle cx="6.2" cy="53.8" r="0.64" fill="#57534f" opacity=".55"/><circle cx="115.5" cy="37.9" r="0.82" fill="#6b6763" opacity=".55"/><circle cx="59.3" cy="5.4" r="0.43" fill="#8a8580" opacity=".55"/><circle cx="40.4" cy="38.1" r="0.78" fill="#9c978f" opacity=".55"/><circle cx="97.8" cy="30.6" r="0.69" fill="#9c978f" opacity=".55"/><circle cx="40.6" cy="22.7" r="0.60" fill="#9c978f" opacity=".55"/><circle cx="115.4" cy="38.8" r="0.33" fill="#8a8580" opacity=".55"/><circle cx="92.0" cy="15.6" r="0.81" fill="#8a8580" opacity=".55"/><circle cx="82.5" cy="26.9" r="0.58" fill="#57534f" opacity=".55"/><circle cx="111.3" cy="12.7" r="0.30" fill="#8a8580" opacity=".55"/><circle cx="1.6" cy="50.8" r="0.37" fill="#57534f" opacity=".55"/><circle cx="105.3" cy="31.9" r="0.83" fill="#8a8580" opacity=".55"/><circle cx="19.4" cy="35.3" r="0.79" fill="#57534f" opacity=".55"/><circle cx="109.8" cy="25.5" r="0.35" fill="#6b6763" opacity=".55"/><circle cx="58.7" cy="50.2" r="0.66" fill="#8a8580" opacity=".55"/><circle cx="5.0" cy="4.6" r="0.83" fill="#6b6763" opacity=".55"/><circle cx="35.6" cy="20.1" r="0.34" fill="#57534f" opacity=".55"/><circle cx="45.7" cy="45.7" r="0.49" fill="#8a8580" opacity=".55"/><circle cx="91.0" cy="49.6" r="0.54" fill="#6b6763" opacity=".55"/><circle cx="13.7" cy="36.0" r="0.83" fill="#57534f" opacity=".55"/><circle cx="49.9" cy="41.3" r="0.57" fill="#8a8580" opacity=".55"/><circle cx="76.4" cy="53.9" r="0.59" fill="#6b6763" opacity=".55"/><circle cx="95.8" cy="9.7" r="0.82" fill="#8a8580" opacity=".55"/><circle cx="84.8" cy="18.9" r="0.82" fill="#9c978f" opacity=".55"/><circle cx="65.0" cy="52.4" r="0.73" fill="#6b6763" opacity=".55"/><circle cx="77.8" cy="7.0" r="0.37" fill="#57534f" opacity=".55"/><circle cx="63.2" cy="30.2" r="0.55" fill="#9c978f" opacity=".55"/><circle cx="42.8" cy="44.5" r="0.89" fill="#6b6763" opacity=".55"/><circle cx="81.2" cy="35.4" r="0.49" fill="#57534f" opacity=".55"/><circle cx="93.9" cy="33.0" r="0.86" fill="#57534f" opacity=".55"/><circle cx="73.6" cy="25.6" r="0.38" fill="#9c978f" opacity=".55"/><circle cx="118.3" cy="19.7" r="0.56" fill="#8a8580" opacity=".55"/><circle cx="81.0" cy="36.1" r="0.47" fill="#9c978f" opacity=".55"/><circle cx="23.7" cy="46.0" r="0.70" fill="#6b6763" opacity=".55"/><circle cx="9.2" cy="37.4" r="0.84" fill="#9c978f" opacity=".55"/><circle cx="78.5" cy="18.9" r="0.48" fill="#6b6763" opacity=".55"/><circle cx="72.5" cy="30.4" r="0.75" fill="#6b6763" opacity=".55"/><circle cx="96.1" cy="46.8" r="0.87" fill="#8a8580" opacity=".55"/><circle cx="21.9" cy="57.2" r="0.70" fill="#6b6763" opacity=".55"/><circle cx="91.2" cy="56.2" r="0.37" fill="#57534f" opacity=".55"/><circle cx="81.0" cy="43.2" r="0.67" fill="#9c978f" opacity=".55"/><circle cx="102.3" cy="39.9" r="0.83" fill="#8a8580" opacity=".55"/><circle cx="107.6" cy="40.8" r="0.49" fill="#8a8580" opacity=".55"/><circle cx="89.5" cy="31.2" r="0.62" fill="#57534f" opacity=".55"/><circle cx="107.9" cy="23.2" r="0.54" fill="#9c978f" opacity=".55"/><circle cx="34.1" cy="23.9" r="0.31" fill="#8a8580" opacity=".55"/><circle cx="107.7" cy="26.6" r="0.64" fill="#9c978f" opacity=".55"/><circle cx="48.5" cy="22.5" r="0.32" fill="#6b6763" opacity=".55"/><circle cx="55.0" cy="56.0" r="0.68" fill="#9c978f" opacity=".55"/><circle cx="72.5" cy="18.1" r="0.35" fill="#9c978f" opacity=".55"/><circle cx="58.0" cy="37.1" r="0.59" fill="#6b6763" opacity=".55"/><circle cx="17.8" cy="13.8" r="0.48" fill="#6b6763" opacity=".55"/><circle cx="19.6" cy="45.8" r="0.71" fill="#9c978f" opacity=".55"/><circle cx="2.2" cy="14.2" r="0.75" fill="#8a8580" opacity=".55"/><circle cx="3.8" cy="18.4" r="0.37" fill="#6b6763" opacity=".55"/><circle cx="105.4" cy="37.3" r="0.67" fill="#8a8580" opacity=".55"/><circle cx="87.8" cy="38.0" r="0.87" fill="#6b6763" opacity=".55"/><circle cx="67.2" cy="40.2" r="0.73" fill="#8a8580" opacity=".55"/><circle cx="60.3" cy="8.9" r="0.81" fill="#57534f" opacity=".55"/><circle cx="60.9" cy="21.8" r="0.40" fill="#9c978f" opacity=".55"/><circle cx="61.8" cy="31.2" r="0.48" fill="#57534f" opacity=".55"/><circle cx="39.4" cy="22.4" r="0.55" fill="#6b6763" opacity=".55"/><circle cx="33.4" cy="39.2" r="0.48" fill="#8a8580" opacity=".55"/><circle cx="10.3" cy="6.7" r="0.67" fill="#6b6763" opacity=".55"/><circle cx="27.8" cy="32.1" r="0.59" fill="#8a8580" opacity=".55"/><circle cx="106.3" cy="26.2" r="0.74" fill="#57534f" opacity=".55"/><circle cx="40.3" cy="10.0" r="0.62" fill="#8a8580" opacity=".55"/><circle cx="12.9" cy="35.9" r="0.85" fill="#9c978f" opacity=".55"/><circle cx="111.7" cy="48.2" r="0.55" fill="#6b6763" opacity=".55"/><circle cx="98.5" cy="12.3" r="0.65" fill="#9c978f" opacity=".55"/><circle cx="94.1" cy="27.7" r="0.80" fill="#6b6763" opacity=".55"/><circle cx="107.0" cy="51.8" r="0.83" fill="#6b6763" opacity=".55"/><circle cx="72.6" cy="30.6" r="0.89" fill="#9c978f" opacity=".55"/><circle cx="111.4" cy="10.3" r="0.33" fill="#8a8580" opacity=".55"/><circle cx="4.7" cy="39.2" r="0.50" fill="#8a8580" opacity=".55"/><circle cx="83.6" cy="6.8" r="0.89" fill="#6b6763" opacity=".55"/><circle cx="8.6" cy="13.1" r="0.46" fill="#6b6763" opacity=".55"/><circle cx="106.9" cy="56.5" r="0.31" fill="#8a8580" opacity=".55"/><circle cx="25.6" cy="14.5" r="0.74" fill="#9c978f" opacity=".55"/><circle cx="97.9" cy="17.3" r="0.53" fill="#57534f" opacity=".55"/><circle cx="4.1" cy="23.9" r="0.88" fill="#9c978f" opacity=".55"/><circle cx="67.2" cy="16.4" r="0.42" fill="#57534f" opacity=".55"/><circle cx="38.6" cy="12.5" r="0.59" fill="#57534f" opacity=".55"/><circle cx="111.8" cy="16.0" r="0.75" fill="#57534f" opacity=".55"/><circle cx="114.0" cy="53.8" r="0.55" fill="#8a8580" opacity=".55"/><circle cx="30.7" cy="29.6" r="0.32" fill="#9c978f" opacity=".55"/><circle cx="73.1" cy="39.2" r="0.68" fill="#9c978f" opacity=".55"/><circle cx="10.4" cy="57.2" r="0.40" fill="#6b6763" opacity=".55"/><circle cx="84.1" cy="54.2" r="0.45" fill="#8a8580" opacity=".55"/><circle cx="106.9" cy="29.0" r="0.37" fill="#9c978f" opacity=".55"/><circle cx="1.0" cy="33.1" r="0.42" fill="#6b6763" opacity=".55"/><circle cx="29.3" cy="48.9" r="0.37" fill="#9c978f" opacity=".55"/><circle cx="35.6" cy="32.9" r="0.70" fill="#6b6763" opacity=".55"/><circle cx="79.4" cy="57.6" r="0.84" fill="#6b6763" opacity=".55"/><circle cx="90.7" cy="46.5" r="0.71" fill="#9c978f" opacity=".55"/><circle cx="4.2" cy="18.8" r="0.50" fill="#9c978f" opacity=".55"/><circle cx="118.4" cy="9.4" r="0.75" fill="#6b6763" opacity=".55"/><circle cx="114.7" cy="55.2" r="0.71" fill="#6b6763" opacity=".55"/><circle cx="80.8" cy="15.2" r="0.85" fill="#57534f" opacity=".55"/><circle cx="12.5" cy="11.6" r="0.38" fill="#57534f" opacity=".55"/><circle cx="72.2" cy="28.8" r="0.49" fill="#57534f" opacity=".55"/><circle cx="89.2" cy="48.6" r="0.76" fill="#6b6763" opacity=".55"/><circle cx="21.7" cy="20.8" r="0.48" fill="#9c978f" opacity=".55"/><circle cx="68.9" cy="11.3" r="0.67" fill="#9c978f" opacity=".55"/><circle cx="46.0" cy="31.1" r="0.37" fill="#8a8580" opacity=".55"/><circle cx="22.9" cy="20.2" r="0.89" fill="#8a8580" opacity=".55"/><circle cx="2.5" cy="6.8" r="0.48" fill="#9c978f" opacity=".55"/><circle cx="112.6" cy="28.8" r="0.32" fill="#9c978f" opacity=".55"/><circle cx="96.0" cy="46.5" r="0.40" fill="#57534f" opacity=".55"/><circle cx="74.1" cy="20.3" r="0.30" fill="#8a8580" opacity=".55"/><circle cx="53.7" cy="43.1" r="0.85" fill="#57534f" opacity=".55"/><circle cx="25.4" cy="19.2" r="0.66" fill="#6b6763" opacity=".55"/><circle cx="107.4" cy="27.9" r="0.88" fill="#6b6763" opacity=".55"/><circle cx="21.7" cy="35.7" r="0.66" fill="#6b6763" opacity=".55"/><circle cx="87.0" cy="1.3" r="0.56" fill="#8a8580" opacity=".55"/><circle cx="74.6" cy="7.8" r="0.66" fill="#8a8580" opacity=".55"/><circle cx="52.2" cy="18.2" r="0.68" fill="#8a8580" opacity=".55"/><circle cx="87.6" cy="53.8" r="0.80" fill="#9c978f" opacity=".55"/><circle cx="31.0" cy="19.4" r="0.62" fill="#8a8580" opacity=".55"/><circle cx="43.9" cy="50.0" r="0.42" fill="#57534f" opacity=".55"/><circle cx="99.4" cy="4.3" r="0.68" fill="#8a8580" opacity=".55"/><circle cx="118.5" cy="8.3" r="0.73" fill="#6b6763" opacity=".55"/><circle cx="64.6" cy="20.1" r="0.86" fill="#6b6763" opacity=".55"/><circle cx="94.2" cy="35.1" r="0.63" fill="#9c978f" opacity=".55"/><circle cx="75.0" cy="17.1" r="0.83" fill="#9c978f" opacity=".55"/><circle cx="25.1" cy="27.4" r="0.47" fill="#6b6763" opacity=".55"/>
  <rect x="0" y="58" width="120" height="4" fill="#c9c5be"/><rect x="0" y="58" width="120" height="1" fill="#e9e6e0"/>
  <rect x="0" y="62" width="120" height="78" fill="url(#ID-tile)"/>
  <g stroke="#d6d2ca" stroke-width=".35" opacity=".8"><path d="M0 64H120" /><path d="M0 67H120" /><path d="M0 70H120" /><path d="M0 73H120" /><path d="M0 76H120" /><path d="M0 79H120" /><path d="M0 82H120" /><path d="M0 85H120" /><path d="M0 88H120" /><path d="M0 91H120" /><path d="M0 94H120" /><path d="M0 97H120" /><path d="M0 100H120" /><path d="M0 103H120" /><path d="M0 106H120" /><path d="M0 109H120" /><path d="M0 112H120" /><path d="M0 115H120" /><path d="M0 118H120" /><path d="M0 121H120" /><path d="M0 124H120" /><path d="M0 127H120" /><path d="M0 130H120" /><path d="M0 133H120" /><path d="M0 136H120" /><path d="M0 139H120" /></g>
  <g class="condensation"><path d="M10 80q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/><path d="M14 96q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/><path d="M106 84q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/><path d="M110 104q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/><path d="M8 118q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/><path d="M104 122q1.2 2 0 3.4q-1.2-1.4 0-3.4z"/></g>
  <g class="steam"><path d="M14 136q-4-8 2-14t0-14"/><path d="M28 140q-4-8 2-14t0-14"/><path d="M98 138q-4-8 2-14t0-14"/></g>
</g>
<path d="M22 31C42 21 78 35 100 25V117H22Z" fill="#000" opacity=".16" transform="translate(3 4)"/>
<path d="M19 29C40 19 78 33 101 23V116Q101 120 97 120H23Q19 120 19 116Z" fill="#d3d8dd"/>
<path d="M18 27C39 17 77 31 99 21V114Q99 118 95 118H22Q18 118 18 114Z" fill="url(#ID-face)" stroke="#c9ced4" stroke-width=".6"/>
<path d="M21 28C40 19 76 32 97 23" fill="none" stroke="#ffffff" stroke-width="1.6" opacity=".9"/>
<circle cx="60" cy="70" r="28" fill="#e2e6ea" stroke="#c4cad0" stroke-width=".8"/>
<circle cx="60" cy="70" r="25" fill="url(#ID-recess)"/>
<g clip-path="url(#ID-hole)">
  <circle cx="60" cy="70" r="25" fill="#3d4349" opacity=".55"/>
  <g class="fanv" fill="#f4f6f8" stroke="#c4cad0" stroke-width=".4"><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(0 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(30 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(60 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(90 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(120 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(150 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(180 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(210 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(240 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(270 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(300 60 70)"/><path d="M60 70C60 61 65 50 75 45C73 55 69 63 60 70Z" transform="rotate(330 60 70)"/></g>
  <circle cx="60" cy="70" r="7" fill="#ffffff" stroke="#c4cad0" stroke-width=".6"/>
  <g class="slats" fill="none" stroke-linecap="round">
    <g stroke="#9aa3ad" stroke-width="2" transform="translate(0 .7)" opacity=".5"><path d="M30 47.5Q60 45.9 90 47.5" /><path d="M30 52.9Q60 51.3 90 52.9" /><path d="M30 58.3Q60 56.7 90 58.3" /><path d="M30 63.7Q60 62.1 90 63.7" /><path d="M30 69.1Q60 67.5 90 69.1" /><path d="M30 74.5Q60 72.9 90 74.5" /><path d="M30 79.9Q60 78.3 90 79.9" /><path d="M30 85.3Q60 83.7 90 85.3" /><path d="M30 90.7Q60 89.1 90 90.7" /></g>
    <g stroke="#ffffff" stroke-width="1.7"><path d="M30 47.5Q60 45.9 90 47.5" /><path d="M30 52.9Q60 51.3 90 52.9" /><path d="M30 58.3Q60 56.7 90 58.3" /><path d="M30 63.7Q60 62.1 90 63.7" /><path d="M30 69.1Q60 67.5 90 69.1" /><path d="M30 74.5Q60 72.9 90 74.5" /><path d="M30 79.9Q60 78.3 90 79.9" /><path d="M30 85.3Q60 83.7 90 85.3" /><path d="M30 90.7Q60 89.1 90 90.7" /></g>
  </g>
</g>
<circle cx="60" cy="70" r="25" fill="none" stroke="#b5bcc3" stroke-width="1"/>
<g class="intake"><path d="M20 98q8-6 14-4"/><path d="M98 100q-8-6-14-3"/><path d="M28 40q8 2 12 8"/><path d="M94 42q-8 2-12 8"/><path d="M60 112q-2-6 0-12"/></g>`;

SVG.washer = () => `
<defs>${DEFS}<clipPath id="ID-win"><circle cx="60" cy="80" r="28"/></clipPath></defs>
<ellipse cx="60" cy="133" rx="50" ry="5" fill="url(#ID-shadow)"/>
<g class="shake">
  ${feet([20, 90], 124)}
  <rect x="14" y="8" width="92" height="120" rx="8" fill="url(#ID-body)" stroke="#bfc6ce" stroke-width=".8"/>
  <path d="M14 16a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v17H14z" fill="url(#ID-panel)"/>
  <line x1="14" y1="33" x2="106" y2="33" stroke="#bfc6ce" stroke-width=".8"/>
  <rect x="19" y="13" width="25" height="15" rx="2" fill="#f8f9fb" stroke="#b9c0c8" stroke-width=".7"/>
  <rect x="24" y="22.5" width="15" height="2.2" rx="1.1" fill="#a6aeb7"/>
  ${lcd(49, 13, 30, 11)}
  <circle class="led l1" cx="55" cy="29" r="1.4"/><circle class="led l2" cx="61" cy="29" r="1.4"/>
  <circle class="led l3" cx="67" cy="29" r="1.4"/><circle class="led l4" cx="73" cy="29" r="1.4"/>
  <circle cx="93" cy="21" r="8.2" fill="url(#ID-chrome)" stroke="#88919a" stroke-width=".6"/>
  <circle cx="93" cy="21" r="5.8" fill="#eff2f5" stroke="#b2b9c1" stroke-width=".6"/>
  <g class="knob"><line x1="93" y1="21" x2="93" y2="16.2" stroke="#4f5964" stroke-width="1.5" stroke-linecap="round"/></g>
  ${porthole(60, 80, 28, `
    ${drumInside(60, 80, 28)}
    <g class="water"><path class="wave" d="M10 88q10-4 20 0t20 0t20 0t20 0t20 0t20 0v30H10z"/></g>
    <g class="foam">
      <circle cx="44" cy="90" r="2.2"/><circle cx="52" cy="92" r="1.6"/><circle cx="61" cy="89" r="2.6"/>
      <circle cx="70" cy="91" r="1.8"/><circle cx="77" cy="88" r="1.4"/><circle cx="56" cy="95" r="1.2"/>
    </g>`)}
  <rect x="20" y="72" width="5" height="16" rx="2" fill="url(#ID-chrome)" stroke="#8d959f" stroke-width=".4"/>
  <rect x="95.5" y="74" width="4" height="12" rx="1.5" fill="#9aa3ad"/>
  <rect x="22" y="117" width="76" height="6" rx="2" fill="#000" opacity=".05"/>
</g>`;

SVG.water_heater = () => `
<defs>${DEFS}
<linearGradient id="ID-cyl" x1="0" x2="1"><stop offset="0" stop-color="#c3c9cf"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".6" stop-color="#eef0f2"/><stop offset="1" stop-color="#aeb5bc"/></linearGradient>
<linearGradient id="ID-copper" x1="0" x2="1"><stop offset="0" stop-color="#a0603a"/><stop offset=".45" stop-color="#e2a477"/><stop offset="1" stop-color="#8a4f2e"/></linearGradient>
<linearGradient id="ID-arc" x1="0" x2="1"><stop offset="0" stop-color="#3e8ed0"/><stop offset=".5" stop-color="#f2c94c"/><stop offset="1" stop-color="#e5484d"/></linearGradient></defs>
<g class="hw-waves">
  <path d="M46 12q-3-4 0-8t0-8"/><path d="M60 10q-3-4 0-8t0-8"/><path d="M74 12q-3-4 0-8t0-8"/>
</g>
<ellipse cx="60" cy="133" rx="34" ry="4" fill="url(#ID-shadow)"/>
<rect x="49" y="114" width="6" height="18" fill="url(#ID-copper)"/>
<rect x="65" y="114" width="6" height="18" fill="url(#ID-copper)"/>
<rect x="48" y="122" width="8" height="3" rx="1" fill="#3e8ed0"/>
<rect x="64" y="122" width="8" height="3" rx="1" fill="#e5484d"/>
<rect x="40" y="117" width="9" height="5" rx="1.2" fill="#c9a43a" stroke="#8a6d1f" stroke-width=".4"/>
<path d="M30 26q0-14 30-14t30 14v80q0 12-30 12t-30-12z" fill="url(#ID-cyl)" stroke="#a7aeb5" stroke-width=".8"/>
<path d="M30 26q0 9 30 9t30-9" fill="none" stroke="#b7bec5" stroke-width=".8"/>
<path d="M30 104q0 9 30 9t30-9" fill="none" stroke="#b7bec5" stroke-width=".8"/>
<rect x="38" y="58" width="44" height="40" rx="5" fill="#f4f6f8" stroke="#b5bcc3" stroke-width=".7"/>
<circle cx="60" cy="76" r="13" fill="url(#ID-chrome)"/>
<circle cx="60" cy="76" r="11" fill="#fcfcfd"/>
<path d="M51.5 84.5a12 12 0 1 1 17 0" fill="none" stroke="url(#ID-arc)" stroke-width="2.2" stroke-linecap="round" transform="rotate(0 60 76)"/>
<path d="M60 67.4v2M52.6 70.6l1.4 1.4M67.4 70.6l-1.4 1.4M50 76h2M68 76h2" stroke="#7d868f" stroke-width=".7"/>
<g class="needle"><path d="M60 76l-1.1 0l1.1-8.5l1.1 8.5z" fill="#c62828"/></g>
<circle cx="60" cy="76" r="1.6" fill="#3a4148"/>
<text class="gauge-txt" x="60" y="85" text-anchor="middle">--°</text>
<circle class="hw-led" cx="76" cy="92" r="1.8"/>
<rect x="43" y="90.5" width="16" height="3" rx="1.2" fill="#d5dade"/>
<path d="M36 40q4-6 6-1" stroke="#fff" stroke-opacity=".9" stroke-width="2" fill="none" stroke-linecap="round"/>
<rect x="34" y="34" width="5" height="70" rx="2.5" fill="#fff" opacity=".35"/>`;

/* cave à vin ; avec zone2_temperature : bi-zone (rouges en haut, blancs en bas), deux afficheurs */
SVG.wine_cooler = (c) => {
  const dual = !!(c && c.zone2_temperature);
  return `
<defs>${DEFS}
<linearGradient id="ID-wnlight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c9" stop-opacity=".85"/><stop offset=".55" stop-color="#ffd98a" stop-opacity=".25"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>
<linearGradient id="ID-wncab" x1="0" x2="1"><stop offset="0" stop-color="#2b3036"/><stop offset=".5" stop-color="#14171b"/><stop offset="1" stop-color="#262b31"/></linearGradient>
<linearGradient id="ID-wnwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a26b"/><stop offset="1" stop-color="#8a6a3f"/></linearGradient>
<clipPath id="ID-wnclip"><rect x="30" y="32" width="60" height="86"/></clipPath></defs>
<ellipse cx="60" cy="133" rx="46" ry="3.5" fill="url(#ID-shadow)"/>
<rect x="22" y="6" width="76" height="122" rx="4" fill="url(#ID-wncab)" stroke="#05070a" stroke-width=".8"/>
<rect x="26" y="9" width="68" height="17" rx="2" fill="#0d1013"/>
<circle class="wn-led" cx="34" cy="17.5" r="1.6"/>
<path d="M42 15h10M42 18h10M42 21h10" stroke="#3b424a" stroke-width=".8" stroke-linecap="round"/>
${dual ? `
<rect x="58" y="12" width="16" height="11" rx="1.6" fill="#0c1720" stroke="#59616b" stroke-width=".5"/>
<text class="lcd" x="66" y="20.4" text-anchor="middle">OFF</text>
<rect x="76" y="12" width="16" height="11" rx="1.6" fill="#0c1720" stroke="#59616b" stroke-width=".5"/>
<text class="lcd lcd2" x="84" y="20.4" text-anchor="middle">--</text>
<circle cx="66" cy="10.2" r=".9" fill="#c0392b"/><circle cx="84" cy="10.2" r=".9" fill="#f2d16b"/>` : `
<rect x="64" y="12" width="26" height="11" rx="1.6" fill="#0c1720" stroke="#59616b" stroke-width=".5"/>
<text class="lcd" x="77" y="20.4" text-anchor="middle">OFF</text>`}
<rect x="28" y="30" width="64" height="92" fill="#07090b"/>
<g class="wn-inside" clip-path="url(#ID-wnclip)">
  <rect x="30" y="32" width="60" height="86" fill="#14181d"/>
  <rect class="wn-light" x="30" y="32" width="60" height="86" fill="url(#ID-wnlight)"/>
  <rect x="31" y="33" width="58" height="2" fill="#fff6dc" class="wn-strip"/>
  <g class="wn-bottles">
    <g>
      <circle cx="37" cy="44" r="5" fill="#5b1226"/><circle cx="48.6" cy="44" r="5" fill="#1f4d2e"/><circle cx="60.2" cy="44" r="5" fill="#5b1226"/><circle cx="71.8" cy="44" r="5" fill="#b0852f"/><circle cx="83.4" cy="44" r="5" fill="#1f4d2e"/>
      <circle cx="37" cy="44" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="48.6" cy="44" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="60.2" cy="44" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="71.8" cy="44" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/>
      <path d="M33.6 41.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M56.8 41.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/>
    </g>
    <rect x="30" y="49.5" width="60" height="3" fill="url(#ID-wnwood)"/>
    <g>
      <circle cx="37" cy="70" r="5" fill="#d48a8a"/><circle cx="48.6" cy="70" r="5" fill="#5b1226"/><circle cx="60.2" cy="70" r="5" fill="#b0852f"/><circle cx="71.8" cy="70" r="5" fill="#1f4d2e"/><circle cx="83.4" cy="70" r="5" fill="#5b1226"/>
      <circle cx="37" cy="70" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="48.6" cy="70" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="60.2" cy="70" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="71.8" cy="70" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/>
      <path d="M33.6 67.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M45.1 67.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/>
    </g>
    <rect x="30" y="75.5" width="60" height="3" fill="url(#ID-wnwood)"/>
    <g>
      <circle cx="37" cy="96" r="5" fill="#1f4d2e"/><circle cx="48.6" cy="96" r="5" fill="#b0852f"/><circle cx="60.2" cy="96" r="5" fill="#5b1226"/><circle cx="71.8" cy="96" r="5" fill="#d48a8a"/><circle cx="83.4" cy="96" r="5" fill="#1f4d2e"/>
      <circle cx="37" cy="96" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="48.6" cy="96" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="60.2" cy="96" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/><circle cx="71.8" cy="96" r="2.4" fill="none" stroke="#fff" stroke-opacity=".22"/>
      <path d="M33.6 93.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M68.4 93.6a4.6 4.6 0 0 1 4-2" stroke="#fff" stroke-opacity=".5" stroke-width="1" fill="none" stroke-linecap="round"/>
    </g>
    <rect x="30" y="101.5" width="60" height="3" fill="url(#ID-wnwood)"/>
    <rect x="30" y="112" width="60" height="3" fill="url(#ID-wnwood)"/>
  </g>
  ${dual ? `<rect class="wn-cold" x="30" y="78.5" width="60" height="40" fill="#9fdcff"/>
  <rect x="30" y="76" width="60" height="3.4" fill="#0a0c0f"/><rect x="30" y="76" width="60" height="1" fill="#3b424a"/>` : ""}
  <g class="wn-air" fill="none" stroke-linecap="round"><path d="M44 116q-5-14 0-28t-3-30"/><path d="M60 116q5-14 0-28t3-30"/><path d="M76 116q-5-14 0-28t-3-30"/></g>
</g>
<g class="wn-door">
  <rect x="26" y="28" width="68" height="96" rx="2" fill="none" stroke="#0a0c0f" stroke-width="3"/>
  <rect x="29" y="31" width="62" height="90" fill="#0d1b2a" opacity=".3"/>
  <g class="wn-drops"><circle cx="40" cy="48" r="1.1"/><circle cx="64" cy="58" r="1.1"/><circle cx="80" cy="46" r="1.1"/><circle cx="52" cy="88" r="1.1"/><circle cx="76" cy="100" r="1.1"/></g>
  <path d="M29 31h62l-26 90h-36z" fill="url(#ID-gloss)" opacity=".45"/>
  <rect x="89" y="50" width="3.6" height="46" rx="1.8" fill="url(#ID-chrome)" stroke="#6f7780" stroke-width=".4"/>
</g>
<path d="M28 124h64" stroke="#3b424a" stroke-width="1"/>
<rect x="30" y="127" width="10" height="5" rx="1.5" fill="#3a3f45"/><rect x="80" y="127" width="10" height="5" rx="1.5" fill="#3a3f45"/>`;
};

/* ------------------------------------------------------------------ */
/* Appliance definitions                                               */
/* ------------------------------------------------------------------ */
const CYCLE_FIELDS = ["entity", "power", "energy", "cost", "remaining", "progress", "program", "door", "switch"];
const DEF = {
  washer: { accent: "active", threshold: 10, heating_power: 1000, spin_power: 200, fields: CYCLE_FIELDS,
    keys: ["lave_linge", "lavelinge", "washing_machine", "washer", "machine_a_laver"] },
  dryer: { accent: "active", threshold: 10, fields: CYCLE_FIELDS,
    keys: ["seche_linge", "sechelinge", "tumble_dryer", "dryer"] },
  dishwasher: { accent: "active", threshold: 10, heating_power: 1000, fields: CYCLE_FIELDS,
    keys: ["lave_vaisselle", "lavevaisselle", "dishwasher"] },
  water_heater: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "power_solar", "energy", "energy_solar", "cost", "temperature", "target_temperature", "switch"],
    keys: ["ballon_eau_chaude", "ballon", "chauffe_eau", "water_heater", "boiler", "cumulus"] },
  oven: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "temperature", "target_temperature", "remaining", "program", "door", "switch"],
    keys: ["four", "oven"] },
  microwave: { accent: "active", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "remaining", "program", "door", "switch"],
    keys: ["micro_onde", "micro_ondes", "microondes", "microwave"] },
  air_fryer: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "remaining", "program", "temperature", "switch"],
    keys: ["air_fryer", "airfryer", "air_frier", "friteuse", "fryer", "cosori", "ninja_foodi", "dual_zone"] },
  ac_split: { accent: "cold", threshold: 60,
    fields: ["entity", "power", "energy", "cost", "temperature", "target_temperature", "switch"],
    keys: ["clim", "climatisation", "climatiseur", "split", "air_conditioner", "aircon", "daikin", "mitsubishi", "atlantic", "toshiba"] },
  heat_pump: { accent: "heat", threshold: 60,
    fields: ["entity", "power", "energy", "cost", "temperature", "switch"],
    keys: ["pac", "pompe_a_chaleur", "heat_pump", "heatpump", "unite_ext", "groupe_ext", "outdoor_unit"] },
  fan: { accent: "cold", threshold: 5,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["ventilateur", "ventilo", "fan", "brasseur", "dyson"] },
  tool_charger: { accent: "active", threshold: 10,
    fields: ["entity", "power", "energy", "cost", "battery_level", "switch"],
    keys: ["chargeur", "charger", "batterie_outil", "outil", "perceuse", "visseuse", "tool_battery", "power_tool", "makita", "dewalt", "ryobi", "milwaukee", "einhell", "parkside"] },
  ceiling_fan: { accent: "cold", threshold: 5,
    fields: ["entity", "power", "energy", "cost", "light", "switch"],
    keys: ["ventilateur_plafond", "ventilo_plafond", "plafond", "ceiling_fan", "ceiling", "brasseur_d_air"] },
  generic: { accent: "active", threshold: 5,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: [] },
  beer_tap: { accent: "cold", threshold: 30,
    fields: ["entity", "power", "energy", "cost", "temperature", "keg_level", "pouring", "switch"],
    keys: ["biere", "beer", "tireuse", "perfectdraft", "beertender", "pompe_a_biere", "kegerator", "draft"] },
  av_receiver: { accent: "active", threshold: 40,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["ampli", "amplificateur", "home_cinema", "homecinema", "avr", "receiver", "denon", "yamaha", "onkyo", "marantz", "pioneer"] },
  tv: { accent: "active", threshold: 25,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["tv", "tele", "television", "televiseur", "bravia", "webos", "android_tv", "tizen", "salon_tv"] },
  range_hood: { accent: "active", threshold: 40,
    fields: ["entity", "power", "energy", "cost", "speed", "light", "switch"],
    keys: ["hotte", "range_hood", "cooker_hood", "hood", "aspirante"] },
  towel_dryer: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "temperature", "target_temperature", "mode", "switch"],
    keys: ["seche_serviette", "serviette", "towel", "porte_serviette", "towel_rail", "towel_dryer"] },
  server_rack: { accent: "active", threshold: 30,
    fields: ["entity", "power", "energy", "cost", "temperature", "switch"],
    keys: ["baie", "rack", "homelab", "home_lab", "serveur", "server", "proxmox", "unraid", "nas"] },
  desktop_pc: { accent: "active", threshold: 40,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["pc_fixe", "pcfixe", "desktop", "ordinateur", "gaming", "workstation", "pc_bureau"] },
  laptop: { accent: "active", threshold: 15,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["pc_portable", "portable", "laptop", "macbook", "notebook", "thinkpad", "chromebook"] },
  coffee_maker: { accent: "heat", threshold: 300,
    fields: ["entity", "power", "energy", "cost", "switch"],
    keys: ["cafetiere", "coffee", "senseo", "nespresso", "dolce_gusto", "tassimo", "expresso", "espresso", "cafe"] },
  wine_cooler: { accent: "cold", threshold: 15,
    fields: ["entity", "power", "energy", "cost", "temperature", "zone2_temperature", "door", "switch"],
    keys: ["cave_a_vin", "cave", "vin", "wine", "cellar", "wine_cooler", "wine_fridge", "vinotheque"] },
  fridge: { accent: "cold", threshold: 20,
    fields: ["entity", "power", "energy", "cost", "temperature", "freezer_temperature", "flex_temperature", "door", "freezer_door", "switch"],
    keys: ["refrigerateur", "frigo", "fridge", "refrigerator", "frigidaire"] },
  pellet_stove: { accent: "heat", threshold: 20,
    fields: ["entity", "power", "energy", "cost", "temperature", "target_temperature", "power_level", "pellet_level", "switch"],
    keys: ["poele", "pellet", "granule", "stove"] },
  pool_pump: { accent: "active", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "temperature", "runtime", "speed", "switch"],
    keys: ["piscine", "pool", "filtration", "pompe"] },
  chest_freezer: { accent: "cold", threshold: 20,
    fields: ["entity", "power", "energy", "cost", "temperature", "door", "switch"],
    keys: ["congelateur_coffre", "coffre", "chest", "bahut"] },
  drawer_freezer: { accent: "cold", threshold: 20,
    fields: ["entity", "power", "energy", "cost", "temperature", "door", "switch"],
    keys: ["congelateur", "freezer", "tiroir"] },
  solar: { accent: "heat", threshold: 10,
    fields: ["power", "energy", "cost", "entity"],
    keys: ["solaire", "solar", "pv", "photovolta", "onduleur", "inverter"] },
  vmc: { accent: "active", threshold: 5,
    fields: ["entity", "power", "energy", "cost", "speed", "humidity", "switch"],
    keys: ["vmc", "ventilation", "extracteur", "mvhr", "hrv"] },
  hob: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "zone_1", "zone_2", "zone_3", "zone_4"],
    keys: ["plaque", "cuisson", "induction", "vitro", "hob", "cooktop", "table_de_cuisson"] },
  radiator: { accent: "heat", threshold: 50,
    fields: ["entity", "power", "energy", "cost", "temperature", "target_temperature", "mode", "window", "switch"],
    keys: ["radiateur", "radiator", "chauffage", "heater", "convecteur"] },
  printer_3d: { accent: "active", threshold: 40,
    fields: ["entity", "power", "energy", "cost", "progress", "remaining", "program", "temperature", "bed_temperature", "switch"],
    keys: ["imprimante", "printer", "3d", "bambu", "prusa", "octoprint", "klipper", "moonraker"] },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const BAD = ["unavailable", "unknown", "none", ""];
const OFF_STATES = ["off", "idle", "inactive", "false", "standby", "stopped", "stop", "ready", "arret", "arrêt", "veille", "inactif", "pause", "paused", "0"];
const DONE_STATES = ["finished", "finish", "done", "end", "ended", "complete", "completed", "termine", "terminé", "fin", "cycle_finished"];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (st) => {
  if (!st || BAD.includes(String(st.state).toLowerCase())) return null;
  const n = parseFloat(st.state);
  return Number.isFinite(n) ? n : null;
};
const domainOf = (id) => (id || "").split(".")[0];
// modes radiateur / sèche-serviettes : confort, éco, hors-gel, arrêt
const MODE_RX = { comfort: /confort|comfort/, eco: /eco|nuit|night|sleep|economy|reduit|réduit/, frost: /hors|frost|gel|away|absent/, off: /^(off|arret|arrêt|stop)$/ };
const MODE_ORDER = ["comfort", "eco", "frost", "off"];
const MODE_ICON = { comfort: "mdi:fire", eco: "mdi:leaf", frost: "mdi:snowflake", off: "mdi:power" };
const modeOptions = (st) => {
  if (!st) return [];
  const d = domainOf(st.entity_id);
  if (d === "select" || d === "input_select") return st.attributes.options || [];
  if (d === "climate") return [...(st.attributes.preset_modes || []), ...(st.attributes.hvac_modes || [])];
  return [];
};
const pickMode = (opts, key) => opts.find((o) => MODE_RX[key].test(String(o).toLowerCase()));
function modeOf(m, main, c) {
  const isClimate = main && domainOf(c.entity) === "climate";
  const raw = isClimate && main.state === "off" ? "off"
    : String(m.mode && !BAD.includes(String(m.mode.state).toLowerCase()) ? m.mode.state
      : isClimate ? (main.attributes.preset_mode || main.state) : "").toLowerCase();
  return /hors|frost|gel|away|absent/.test(raw) ? "frost"
    : /eco|nuit|night|sleep|economy|reduit|réduit/.test(raw) ? "eco"
    : /^(off|arret|arrêt|stop)$/.test(raw) ? "off"
    : raw ? "comfort" : null;
}
const loc = (hass) => hass?.locale?.language || hass?.language || undefined;

function fmtNum(hass, n, digits, minDigits = 0) {
  try {
    return new Intl.NumberFormat(loc(hass), { maximumFractionDigits: digits, minimumFractionDigits: minDigits }).format(n);
  } catch (e) { return n.toFixed(digits); }
}
const powerW = (st) => { const v = num(st); if (v === null) return null; return st.attributes.unit_of_measurement === "kW" ? v * 1000 : v; };
function fmtPower(hass, st) {
  const w = powerW(st); if (w === null) return null;
  return w >= 1000 ? `${fmtNum(hass, w / 1000, 2)} kW` : `${fmtNum(hass, w, w < 10 ? 1 : 0)} W`;
}
function fmtUnit(hass, st, digits, minDigits = 0) {
  const v = num(st); if (v === null) return null;
  const u = st.attributes.unit_of_measurement;
  return u ? `${fmtNum(hass, v, digits, minDigits)} ${u}` : fmtNum(hass, v, digits, minDigits);
}
// Énergie en kWh (Wh et MWh convertis), sans décimale au-delà de 1000 kWh ; autres unités inchangées
function fmtEnergy(hass, st) {
  const v = num(st); if (v === null) return null;
  const u = st.attributes.unit_of_measurement;
  const f = { Wh: 1e-3, kWh: 1, MWh: 1e3, GWh: 1e6 }[u];
  if (f === undefined) return fmtUnit(hass, st, 2);
  const k = v * f;
  return `${fmtNum(hass, k, Math.abs(k) >= 1000 ? 0 : 2)} kWh`;
}
function parseRemaining(st) {
  if (!st) return null;
  const v = String(st.state);
  if (BAD.includes(v.toLowerCase())) return null;
  const a = st.attributes || {};
  if (a.device_class === "timestamp" || /^\d{4}-\d\d-\d\dT/.test(v)) {
    const d = (new Date(v).getTime() - Date.now()) / 60000;
    return Number.isFinite(d) ? Math.max(0, d) : null;
  }
  const m = v.match(/^(\d+):(\d{2})(?::(\d{2}))?$/);
  if (m) return (+m[1]) * 60 + (+m[2]) + (m[3] ? +m[3] / 60 : 0);
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return null;
  const u = String(a.unit_of_measurement || "min").toLowerCase();
  if (u === "h") return n * 60;
  if (u === "s") return n / 60;
  if (u === "d") return n * 1440;
  return n;
}
function fmtDuration(min) {
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${String(r).padStart(2, "0")}` : `${h} h`;
}
// H:MM like a real washer/oven display; M:SS for short countdowns (microwave)
const lcdDuration = (min, short = false) => {
  if (short) { const s = Math.round(min * 60); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
  const m = Math.ceil(min - 1e-9); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};
function fmtClock(hass, date) {
  try { return date.toLocaleTimeString(loc(hass), { hour: "2-digit", minute: "2-digit" }); }
  catch (e) { return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`; }
}
function stateText(hass, st) {
  if (!st) return "";
  try { if (hass.formatEntityState) return hass.formatEntityState(st); } catch (e) { /* ignore */ }
  return st.state;
}
const isOn = (st) => !!st && String(st.state).toLowerCase() === "on";

/* ------------------------------------------------------------------ */
/* Base card                                                           */
/* ------------------------------------------------------------------ */
let SEQ = 0;

class ApplianceCardBase extends HTMLElement {
  static get kind() { return "washer"; }
  static getConfigForm() { return buildForm(this.kind); }
  static getStubConfig(hass) { return stubFor(this.kind, hass); }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    if (window.applianceSize) window.applianceSize(this, config);
    if (!["entity", "power", "power_solar", "switch", "temperature", "zone_1"].some((f) => config[f])) {
      throw new Error(tr(undefined, "err_need_entity"));
    }
    this._config = { ...config };
    this._kind = this.constructor.kind;
    this._def = DEF[this._kind];
    this._lastKey = null;
    this._build();
    if (this._hass) this._update(true);
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config) this._update(false);
  }

  connectedCallback() {
    // keep LCD clock / countdown fresh even when no entity changes
    this._tick = setInterval(() => { if (this._hass && this._config) this._update(false); }, 20000);
  }
  disconnectedCallback() { clearInterval(this._tick); }

  getCardSize() { return 4; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

  // liste des capteurs de buse (imprimante multi-buses) ; une simple chaîne est acceptée
  _nozzles() {
    const n = this._config.nozzle_temperatures;
    return (Array.isArray(n) ? n : n ? [n] : []).filter((i) => typeof i === "string" && i);
  }

  _ids() {
    const c = this._config;
    return ["entity", "power", "power_solar", "energy_solar", "energy", "cost", "remaining", "progress", "program", "door", "switch",
      "power_level", "pellet_level", "runtime", "speed", "bed_temperature", "humidity", "light", "keg_level", "pouring", "battery_level", "zone2_temperature", "zone_1", "zone_2", "zone_3", "zone_4", "mode", "window", "temperature", "target_temperature", "freezer_temperature", "flex_temperature", "freezer_door"].map((k) => c[k]).filter(Boolean).concat(this._nozzles())
      .concat(Array.isArray(c.images) ? c.images.map((i) => i && typeof i.entity === "string" && i.entity).filter(Boolean) : []);
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const id = `ac${++SEQ}`;
    const svg = SVG[this._kind](this._config).replace(/ID-/g, `${id}-`);
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card>
        <div class="wrap" id="wrap">
          <div class="top">
            <div class="illus"><svg viewBox="0 0 120 140" aria-hidden="true">${svg}</svg></div>
            <div class="right-col" id="right-col">
              <div class="head">
                <div class="info" id="info"></div>
                <div class="actions" id="actions"></div>
              </div>
              <div class="stats" id="stats"></div>
            </div>
          </div>
          <div class="modes" id="modes"></div>
          <div class="bar" id="bar"><div class="bar-fill" id="barfill"></div></div>
        </div>
      </ha-card>`;
    this.shadowRoot.querySelector("ha-card").addEventListener("click", (ev) => {
      const path = ev.composedPath();
      if (path.some((n) => n.classList && (n.classList.contains("toggle") || n.classList.contains("mode-btn")))) return;
      const tile = path.find((n) => n.dataset && n.dataset.entity);
      const c = this._config;
      const eid = tile ? tile.dataset.entity : (c.entity || c.power || c.switch || c.temperature);
      if (eid) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: eid }, bubbles: true, composed: true }));
    });
    if (this._config.color) this.style.setProperty("--ac-accent", this._config.color);
  }

  // energy_period (day / week / month) : consommation de la période d'après les statistiques de Home Assistant
  // (même calcul que le tableau de bord Énergie), relue au plus toutes les 5 min ou quand le compteur bouge
  _fetchPeriod() {
    const c = this._config, hass = this._hass, per = c.energy_period;
    if (!["day", "week", "month"].includes(per) || !c.energy || !hass || typeof hass.callWS !== "function") return;
    const st = hass.states[c.energy], sig = `${per}|${c.energy}|${st ? st.state : ""}`, now = Date.now();
    if (this._perBusy || (sig === this._perSig && now - (this._perAt || 0) < 300000) || (this._perAt && now - this._perAt < 60000)) return;
    this._perBusy = true; this._perSig = sig; this._perAt = now;
    hass.callWS({ type: "recorder/statistic_during_period", statistic_id: c.energy, calendar: { period: per }, types: ["change"], units: { energy: "kWh" } })
      .then((r) => { this._perKwh = r && Number.isFinite(r.change) ? r.change : null; })
      .catch(() => { this._perKwh = null; })
      .finally(() => { this._perBusy = false; if (this._hass) this._render(this._compute()); });
  }

  _update(force) {
    const hass = this._hass;
    this._fetchPeriod();
    const key = this._ids().map((i) => {
      const s = hass.states[i];
      return s ? `${s.state}|${s.attributes.temperature ?? ""}|${s.attributes.current_temperature ?? ""}` : "x";
    }).join(";") + "|" + lang(hass) + "|" + Math.floor(Date.now() / 30000);
    if (!force && key === this._lastKey) return;
    this._lastKey = key;
    this._render(this._compute());
  }

  /* ---------------- state model ---------------- */
  _compute() {
    const hass = this._hass, c = this._config, d = this._def, kind = this._kind;
    const S = (i) => (i ? hass.states[i] : undefined);
    const main = S(c.entity), pw = S(c.power), pwS = S(c.power_solar), sw = S(c.switch);
    const threshold = c.threshold ?? d.threshold;
    // deux sources de puissance possibles (ex. contacteur réseau + routeur solaire) : on additionne
    const wGrid = powerW(pw), wSolar = powerW(pwS);
    const watts = wGrid === null && wSolar === null ? null : (wGrid || 0) + (wSolar || 0);
    const m = {
      main, pw, pwS, wGrid, wSolar, sw, watts, threshold,
      energy: S(c.energy), energyS: S(c.energy_solar), cost: S(c.cost), remaining: parseRemaining(S(c.remaining)),
      progress: num(S(c.progress)), program: S(c.program), door: S(c.door),
      temp: S(c.temperature), target: S(c.target_temperature),
      ftemp: S(c.freezer_temperature), fdoor: S(c.freezer_door), flex: S(c.flex_temperature),
      level: num(S(c.power_level)), pellets: num(S(c.pellet_level)),
      runtime: parseRemaining(S(c.runtime)), speed: S(c.speed), bedTemp: num(S(c.bed_temperature)), humidity: num(S(c.humidity)), mode: S(c.mode), window: S(c.window), light: S(c.light), keg: num(S(c.keg_level)), pouring: S(c.pouring), batt: num(S(c.battery_level)), zone2: num(S(c.zone2_temperature)), zone2Ent: S(c.zone2_temperature),
      status: "idle", phase: null, alerts: [],
    };
    if (main && ["water_heater", "climate"].includes(domainOf(c.entity))) {
      if (!m.temp && main.attributes.current_temperature != null) m.tempVal = main.attributes.current_temperature;
      if (!m.target && main.attributes.temperature != null) m.targetVal = main.attributes.temperature;
    }
    // une entité climate / water_heater dans temperature ou target_temperature : son état est un mode (« off », « heat »),
    // les valeurs sont dans current_temperature et temperature
    const tOf = (st, key) => (st && ["climate", "water_heater"].includes(domainOf(st.entity_id))
      ? (st.attributes[key] != null && Number.isFinite(Number(st.attributes[key])) ? Number(st.attributes[key]) : null) : num(st));
    if (m.tempVal == null) m.tempVal = tOf(m.temp, "current_temperature");
    if (m.targetVal == null) m.targetVal = tOf(m.target, "temperature");
    m.tempUnit = m.temp?.attributes.unit_of_measurement || hass.config?.unit_system?.temperature || "°C";
    m.nozzles = kind === "printer_3d" ? this._nozzles() : [];
    if (m.nozzles.length) {
      const t = m.nozzles.map((i) => num(S(i))).filter((v) => v != null);
      if (t.length) m.tempVal = Math.max(...t);
    }

    const ref = main || sw;
    const mainIds = ["entity", "power", "power_solar", "switch", "temperature", "zone_1", "zone_2", "zone_3", "zone_4"].map((k) => c[k]).filter(Boolean);
    const usable = mainIds.some((i) => hass.states[i] && !BAD.includes(String(hass.states[i].state).toLowerCase()));
    if (!usable) { m.status = "unavailable"; return m; }
    let base = null;
    if (ref) {
      const s = String(ref.state).toLowerCase();
      const dom = domainOf(main ? c.entity : c.switch);
      if (BAD.includes(s)) base = null;
      else if (DONE_STATES.includes(s)) base = "finished";
      else if (OFF_STATES.includes(s)) {
        base = ["standby", "veille"].includes(s) ? "standby"
          : ["idle", "inactive", "inactif", "ready", "stopped", "stop", "pause", "paused"].includes(s) ? "idle"
          : ["input_boolean", "binary_sensor"].includes(dom) ? "idle" : "off";
      }
      // a plug/switch being "on" only means powered: let the power sensor decide
      else if (["switch", "light", "water_heater", "climate", "fan"].includes(dom)) base = "on";
      // input_boolean / binary_sensor "on", or a descriptive sensor state, means running
      else base = "running";
    }
    /* un état explicite (binary_sensor / input_boolean) prime sur la puissance : la prise peut être coupée alors que l'appareil tourne */
    const explicitState = !!main && ["input_boolean", "binary_sensor"].includes(domainOf(c.entity)) && !BAD.includes(String(main.state).toLowerCase());
    if (base === null && !pw && !pwS && ref) base = "unavailable";
    const powered = watts !== null && watts > threshold;
    if (base === "on" || base === null) {
      if (watts !== null) base = powered ? "running" : (base === "on" ? "standby" : "idle");
      else base = base === "on" ? "running" : "idle";
    }
    if (base === "finished" && powered) base = "running";
    if (sw && String(sw.state).toLowerCase() === "off" && base !== "unavailable") base = "off";

    m.solarHeat = kind === "water_heater" && wSolar !== null && wSolar > threshold;
    if (kind === "water_heater") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (powered || (watts === null && base === "running")) m.status = "heating";
      else m.status = "ready";
    } else if (kind === "oven") {
      if (["off", "idle", "standby", "unavailable", "finished"].includes(base)) m.status = base === "standby" ? "off" : base;
      else if (m.tempVal != null && m.targetVal != null && m.tempVal < m.targetVal - 5) m.status = "preheating";
      else m.status = "heating";
    } else if (kind === "pellet_stove") {
      const raw = main ? `${main.state} ${main.attributes.hvac_action || ""} ${main.attributes.status || ""}`.toLowerCase() : "";
      const ign = c.ignition_threshold ?? 250;
      const byPower = () => (watts > ign ? "ignition" : powered ? "heating" : "standby");
      if (/alarm|alarme|error|erreur|d[eé]faut|fault|bloqu|block/.test(raw)) m.status = "alarm";
      else if (/allum|ignit|d[eé]marr|start|pr[eé]chauf|preheat|charg/.test(raw)) m.status = "ignition";
      else if (/extin|shut.?down|cool|refroid|clean|nettoy/.test(raw)) m.status = "extinguishing";
      else if (base === "off" || base === "unavailable") m.status = base;
      else if (main && ["climate", "water_heater"].includes(domainOf(c.entity))) {
        const act = String(main.attributes.hvac_action || "").toLowerCase();
        m.status = act === "off" ? "off" : act === "heating" ? (watts !== null ? (watts > ign ? "ignition" : "heating") : "heating")
          : act ? "standby" : (watts !== null ? byPower() : "heating");
      }
      else if (/eco|veille|standby|attente|wait/.test(raw)) m.status = "standby";
      else if (watts !== null) m.status = base === "idle" && !powered ? "off" : byPower();
      else m.status = base === "running" ? "heating" : base === "standby" ? "standby" : "off";
      if (m.pellets != null && m.pellets < (c.pellet_alert ?? 15)) m.alerts.push("pellets_low");
    } else if (kind === "pool_pump") {
      m.status = base === "running" ? "filtering" : base;
    } else if (kind === "printer_3d") {
      const raw = main ? `${main.state}`.toLowerCase() : "";
      if (/fail|error|erreur|[eé]chec/.test(raw)) m.status = "failed";
      else if (/paus/.test(raw)) m.status = "paused";
      else if (/finish|done|complete|termin|fini/.test(raw)) m.status = "finished";
      else if (/prepar|heat|chauff|preheat|calibr|level|homing|init/.test(raw)) m.status = "heating";
      else if (/print|running|impression|en cours|busy|slicing/.test(raw)) m.status = "printing";
      else if (/offline|hors ligne/.test(raw)) m.status = "off";
      else if (/idle|ready|pr[eê]t|operational|standby/.test(raw)) m.status = powered ? "printing" : "ready";
      else if (base === "running") m.status = "printing";
      else if (base === "standby" || base === "idle") m.status = main || sw ? "ready" : "off";
      else m.status = base;
    } else if (kind === "radiator") {
      const isClimate = main && domainOf(c.entity) === "climate";
      const act = isClimate ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      m.radMode = modeOf(m, main, c);
      if (base === "unavailable") m.status = "unavailable";
      else if (m.radMode === "off" || base === "off" || act === "off" || (isClimate && main.state === "off")) m.status = "off";
      else if (act === "heating" || (watts != null && powered) || (watts == null && !isClimate && base === "running")) m.status = "heating";
      else m.status = "standby";
      m.heat = m.status !== "heating" ? 0 : watts != null ? Math.max(0.3, Math.min(1, watts / (c.max_power || 1500))) : 0.8;
      if (isOn(m.window)) m.alerts.push("window_open");
    } else if (kind === "hob") {
      const zp = c.zone_power || 1500;
      const lvlOf = (st) => {
        if (!st || BAD.includes(String(st.state).toLowerCase())) return null;
        const t = String(st.state).toLowerCase(), n = parseFloat(t), u = String(st.attributes.unit_of_measurement || "");
        if (/boost|^p$|power/.test(t)) return 9;
        if (["off", "arret", "arrêt", "0"].includes(t)) return 0;
        if (!Number.isFinite(n)) return t === "on" ? 5 : 0;
        if (u === "W") return Math.max(0, Math.min(9, Math.round(n / zp * 9)));
        if (u === "kW") return Math.max(0, Math.min(9, Math.round(n * 1000 / zp * 9)));
        if (u === "%") return Math.max(0, Math.min(9, Math.round(n / 100 * 9)));
        return Math.max(0, Math.min(9, Math.round(n)));
      };
      let zl = [1, 2, 3, 4].map((i) => lvlOf(S(c[`zone_${i}`])));
      if (zl.every((v) => v == null)) {
        // no per-zone data: spread the total power over zones (front-left, back-right, front-right, back-left)
        zl = [0, 0, 0, 0];
        if (base !== "off" && base !== "unavailable" && watts != null && watts > threshold) {
          const n = Math.max(1, Math.min(4, Math.ceil(watts / (zp * 1.4))));
          const per = watts / n;
          const lv = Math.max(1, Math.min(9, Math.round(per / zp * 9)));
          [0, 3, 1, 2].slice(0, n).forEach((z) => { zl[z] = lv; });
        } else if (watts == null && base === "running") {
          // pas de capteur de puissance : l'état de `entity` (binary_sensor, sensor d'état "run"…) suffit pour « en marche »
          zl[0] = 5;
        }
      } else zl = zl.map((v) => v ?? 0);
      const now = Date.now(), keep = (c.residual_minutes ?? 10) * 60000;
      this._hot = this._hot || [0, 0, 0, 0];
      zl.forEach((v, i) => { if (v > 0) this._hot[i] = now; });
      m.zones = zl;
      m.residualZones = zl.map((v, i) => v === 0 && this._hot[i] && now - this._hot[i] < keep);
      m.activeZones = zl.filter((v) => v > 0).length;
      if (base === "unavailable") m.status = "unavailable";
      else if (m.activeZones > 0) m.status = "cooking";
      else if (m.residualZones.some(Boolean)) m.status = "residual";
      else m.status = "off";
    } else if (kind === "vmc") {
      const sp = m.speed ? String(m.speed.state).toLowerCase() : "";
      const spn = num(m.speed);
      const hi = c.high_threshold ?? 35;
      if (base === "off" || base === "unavailable") m.status = base;
      else if (m.speed && !BAD.includes(sp) && /boost|grande|high|max|rapide|fast|gv/.test(sp)) m.status = "speed2";
      else if (m.speed && !BAD.includes(sp) && /petite|low|eco|lente|slow|min|pv|auto|normal/.test(sp)) m.status = "speed1";
      else if (spn != null && spn > 0) m.status = (String(m.speed.attributes.unit_of_measurement || "") === "%" ? spn > 60 : spn >= 2) ? "speed2" : "speed1";
      else if (spn === 0) m.status = "off";
      else if (watts != null) m.status = watts > hi ? "speed2" : powered ? "speed1" : (base === "standby" ? "standby" : "off");
      else m.status = base === "running" ? "speed1" : base;
      if (m.humidity != null && m.humidity > (c.humidity_max ?? 70)) m.alerts.push("humid");
    } else if (kind === "solar") {
      const sunSt = hass.states[c.sun_entity || "sun.sun"];
      const hr = new Date().getHours();
      const night = sunSt ? sunSt.state === "below_horizon" : (hr >= 21 || hr < 6);
      m.frac = watts != null ? Math.max(0, Math.min(1, watts / (c.max_power || 3000))) : 0;
      if (base === "unavailable") m.status = "unavailable";
      else if (watts != null && watts > threshold) m.status = m.frac < 0.15 ? "low" : "producing";
      else m.status = night ? "night" : "idle";
    } else if (kind === "chest_freezer" || kind === "drawer_freezer") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered ? "cooling" : "standby";
      if (m.tempVal != null && m.tempVal > (c.freezer_max_temperature ?? c.max_temperature ?? -12)) m.alerts.push("too_warm");
    } else if (kind === "ac_split" || kind === "heat_pump") {
      const isClim = main && domainOf(c.entity) === "climate";
      const mode = isClim ? String(main.state).toLowerCase() : null;
      const act = isClim ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      const hint = String(c.hvac || "auto").toLowerCase(), mon = new Date().getMonth();
      const guess = hint === "cool" || hint === "clim" ? "cooling" : hint === "heat" || hint === "chauffage" ? "heating" : (mon >= 4 && mon <= 8 ? "cooling" : "heating");
      const fromMode = (md) => ({ cool: "cooling", heat: "heating", dry: "ac_dry", fan_only: "ac_fan" }[md]);
      if (isClim && BAD.includes(mode)) m.status = "unavailable";
      else if (mode === "off" || (!isClim && ["off", "unavailable"].includes(base))) m.status = mode === "off" ? "off" : base;
      else if (act && act !== "off") m.status = ({ cooling: "cooling", heating: "heating", preheating: "heating", drying: "ac_dry", fan: "ac_fan", idle: "at_target", defrosting: "defrost" }[act]) || fromMode(mode) || guess;
      else if (mode) m.status = (watts !== null && !powered && !["fan_only", "dry"].includes(mode)) ? "at_target" : (fromMode(mode) || guess);
      else if (watts !== null) m.status = powered ? guess : "off";
      else m.status = base === "running" || base === "on" ? guess : "off";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      m.acMode = mode && mode !== "off" ? mode : null;
      m.accent = m.status === "heating" ? "heat" : "cold";
    } else if (kind === "fan" || kind === "ceiling_fan") {
      const isFan = main && domainOf(c.entity) === "fan", fs = isFan ? String(main.state).toLowerCase() : "";
      let lvl = 0, st = null;
      if (isFan && !BAD.includes(fs)) {
        if (fs === "on") { const p = Number(main.attributes.percentage); lvl = Number.isFinite(p) && p > 0 ? (p <= 34 ? 1 : p <= 67 ? 2 : 3) : 2; m.pct = Number.isFinite(p) ? p : null; }
      } else if (["off", "unavailable"].includes(base)) st = base;
      else if (watts !== null) {
        lvl = watts > (c.high_threshold ?? 40) ? 3 : watts > (c.mid_threshold ?? 30) ? 2 : powered ? 1 : 0;
        if (!lvl) st = watts >= (c.standby_threshold ?? 0.3) ? "standby" : "off";
      } else lvl = ["running", "on"].includes(base) ? 2 : 0;
      m.status = st || (lvl ? `fan_${lvl}` : "off");
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (kind === "fan") m.osc = isFan && main.attributes.oscillating != null ? !!main.attributes.oscillating : c.oscillating !== false;
      else {
        // ventilateur de plafond : lampe intégrée (entité `light`), « lumière seule » si les pales sont à l'arrêt
        m.lights = isOn(m.light);
        if (m.lights && m.status === "off" && base !== "unavailable") m.status = "lights";
      }
    } else if (kind === "beer_tap") {
      if (["off", "unavailable"].includes(base)) m.status = base;
      else if (isOn(m.pouring)) m.status = "pouring";
      else if (watts !== null) m.status = watts > threshold ? "cooling" : watts >= (c.standby_threshold ?? 0.3) ? "ready" : "off";
      else m.status = base === "running" ? "cooling" : "ready";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (m.keg != null && m.keg <= (c.keg_alert ?? 10) && m.status !== "off") m.alerts.push("keg_low");
    } else if (kind === "av_receiver") {
      const isMp = main && domainOf(c.entity) === "media_player", ms = isMp ? String(main.state).toLowerCase() : "";
      const a = isMp ? (main.attributes || {}) : {};
      if (isMp && !BAD.includes(ms)) m.status = ["on", "playing", "idle", "buffering"].includes(ms) ? "playing" : ms === "paused" ? "paused" : ms === "standby" ? "standby" : "off";
      else if (["off", "unavailable"].includes(base)) m.status = base;
      else if (watts !== null) m.status = watts > threshold ? "playing" : watts >= (c.standby_threshold ?? 0.2) ? "standby" : "off";
      else m.status = base === "running" ? "playing" : "standby";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
      if (m.status === "playing" && a.is_volume_muted) m.status = "muted";
      m.vol = a.volume_level != null ? Number(a.volume_level) : null;
      m.source = a.source || null;
      const maxP = c.max_power ?? 250;
      m.amp = m.vol != null ? m.vol : (watts !== null ? Math.max(.25, Math.min(1, watts / maxP)) : .6);
    } else if (kind === "tv") {
      const dom = main ? domainOf(c.entity) : null, ms = main ? String(main.state).toLowerCase() : "";
      if (dom === "media_player" && !BAD.includes(ms)) {
        m.status = ["on", "playing", "paused", "idle", "buffering"].includes(ms) ? "screen_on" : ms === "standby" ? "standby" : "off";
        if (watts !== null && m.status !== "screen_on" && watts > threshold) m.status = "screen_on";
      } else if (["off", "unavailable"].includes(base)) m.status = base;
      else if (watts !== null) m.status = watts > threshold ? "screen_on" : watts >= (c.standby_threshold ?? 0.2) ? "standby" : "off";
      else m.status = base === "running" ? "screen_on" : "standby";
      if (sw && String(sw.state).toLowerCase() === "off") m.status = "off";
    } else if (kind === "range_hood") {
      const sp = m.speed ? String(m.speed.state).toLowerCase() : "", spn = num(m.speed);
      const hi = c.high_threshold ?? 130, lightT = c.light_threshold ?? 3;
      if (base === "off" || base === "unavailable") m.status = base;
      else if (m.speed && !BAD.includes(sp) && /boost|grande|high|max|rapide|fast|3|intensi/.test(sp)) m.status = "speed2";
      else if (m.speed && !BAD.includes(sp) && /petite|low|eco|lente|slow|min|1|2|moyen|medium/.test(sp)) m.status = "speed1";
      else if (spn === 0) m.status = "off";
      else if (watts !== null) m.status = watts > hi ? "speed2" : powered ? "speed1" : watts > lightT ? "lights" : "off";
      else m.status = base === "running" ? "speed1" : base === "standby" ? "off" : base;
      m.lights = m.light ? isOn(m.light) : (m.status === "lights" || ((m.status === "speed1" || m.status === "speed2") && c.light === undefined && watts !== null && watts > threshold));
    } else if (kind === "towel_dryer") {
      // entité climate : hvac_action fait foi (heating / idle / off), hvac_mode seulement en repli
      const isClimate = main && domainOf(c.entity) === "climate";
      const act = isClimate ? String(main.attributes.hvac_action || "").toLowerCase() : "";
      m.radMode = modeOf(m, main, c);
      if (base === "off" || base === "unavailable") m.status = base;
      else if (m.radMode === "off" || act === "off" || (isClimate && main.state === "off")) m.status = "off";
      else if (act === "heating" || powered || (watts === null && !act && base === "running" && !m.mode)) m.status = "heating";
      else m.status = act || base === "standby" || isOn(sw) || m.radMode ? "at_target" : "off";
    } else if (kind === "server_rack") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = powered ? "online" : watts > 0.5 ? "standby" : "off";
      else m.status = base === "running" ? "online" : base === "standby" ? "standby" : "off";
      m.load = watts !== null ? Math.max(0, Math.min(1, watts / (c.max_power || 300))) : 0.4;
    } else if (kind === "desktop_pc" || kind === "laptop") {
      if (base === "off" || base === "unavailable") m.status = base;
      else if (explicitState) m.status = base === "running" ? "screen_on" : powered ? "standby" : "off";
      else if (watts !== null) m.status = powered ? "screen_on" : watts >= (c.standby_threshold ?? 0.5) ? "standby" : "off";
      else m.status = base === "running" ? "screen_on" : "standby";
    } else if (kind === "tool_charger") {
      // > seuil : en charge ; petite conso résiduelle : batterie chargée (maintien) ; sinon socle vide / veille
      const full = m.batt != null && m.batt >= (c.full_level ?? 100);
      if (base === "off" || base === "unavailable") m.status = base;
      else if (watts !== null) m.status = powered && !full ? "charging" : full || watts >= (c.standby_threshold ?? 1) ? "charged" : "standby";
      else m.status = base === "running" && !full ? "charging" : full ? "charged" : "standby";
    } else if (kind === "coffee_maker") {
      const warmT = c.warm_threshold ?? 5;
      if (["off", "unavailable"].includes(base)) m.status = base;
      else if (base === "finished") m.status = "ready";
      else if (watts !== null) m.status = watts > threshold ? "brewing" : watts > warmT ? (cfStyle(c) === "filtre" ? "keep_warm" : "ready") : "idle";
      else m.status = base === "running" ? "brewing" : "idle";
    } else if (kind === "air_fryer") {
      m.status = base === "running" ? "cooking" : base === "standby" ? "idle" : base;
    } else if (kind === "wine_cooler") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered || (watts === null && base === "running") ? "cooling" : "standby";
      if (m.tempVal != null && m.tempVal > (c.max_temperature ?? 18)) m.alerts.push("too_warm");
      // bi-zone : seuil propre à la zone basse (vins blancs), sinon le même
      if (m.zone2 != null && m.zone2 > (c.max_temperature_2 ?? c.max_temperature ?? 18)) m.alerts.push("too_warm");
    } else if (kind === "fridge") {
      if (base === "off" || base === "unavailable") m.status = base;
      else m.status = powered ? "cooling" : "standby";
      const maxF = c.max_temperature ?? 8, maxZ = c.freezer_max_temperature ?? -12;
      if (m.tempVal != null && m.tempVal > maxF) m.alerts.push("too_warm");
      if (num(m.ftemp) != null && num(m.ftemp) > maxZ) m.alerts.push("too_warm");
      // zone flex (3e compartiment à température réglable) : alerte seulement si un seuil est donné
      m.flexVal = m.flex && ["climate", "water_heater"].includes(domainOf(m.flex.entity_id)) ? num({ state: m.flex.attributes.current_temperature }) : num(m.flex);
      if (m.flexVal != null && c.flex_max_temperature != null && m.flexVal > c.flex_max_temperature) m.alerts.push("too_warm");
    } else {
      m.status = base;
    }

    // For dishwashers on smart plugs: track recent cycle activity to detect the low-power drying phase
    if (kind === "dishwasher") {
      if (watts !== null && watts > threshold) {
        this._dwLastActive = Date.now();
      }
      const dryingTimeout = 20 * 60 * 1000; // 20 minutes
      const recentlyActive = this._dwLastActive && (Date.now() - this._dwLastActive < dryingTimeout);
      if (base === "running" && watts !== null && watts <= threshold) {
        m.status = "running";
        m.phase = "dry";
      } else if (base !== "running" && !explicitState && recentlyActive && (watts === null || watts <= threshold)) {
        m.status = "running";
        m.phase = "dry";
      }
    }

    // phase detection (washer / dryer / dishwasher) from status or program text, with smart-plug power inference fallback
    if (m.status === "running" && ["washer", "dryer", "dishwasher"].includes(kind)) {
      const txt = `${main ? main.state : ""} ${m.program ? m.program.state : ""}`.toLowerCase();
      if (/rin[cç]|rinse/.test(txt)) m.phase = "rinse";
      else if (/essor|spin|centrif|essorage/.test(txt)) m.phase = "spin";
      else if (/refroid|cool|anti.?froiss|wrinkle/.test(txt)) m.phase = "cool";
      // en début de mot : les clés Home Connect « laundry_care_washer_program_… » contiennent « dry »
      else if (/(^|[^a-zà-ÿ])(s[eé]ch|dry)/.test(txt)) m.phase = "dry";
      else if (/(^|[^a-zà-ÿ])(heat|chauff)/.test(txt)) m.phase = "heat";
      else if (kind === "dryer") {
        m.phase = "dry";
      } else if (watts !== null && ["washer", "dishwasher"].includes(kind)) {
        // Fallback: infer phase from power draw on smart plugs when text entity gives no phase
        const heatThreshold = c.heating_power ?? this._def.heating_power ?? 1000;
        const spinThreshold = c.spin_power ?? this._def.spin_power ?? 200;
        if (heatThreshold > 0 && watts >= heatThreshold) {
          m.phase = "heat";
        } else if (kind === "washer" && spinThreshold > 0 && watts >= spinThreshold) {
          m.phase = "spin";
        } else if (!m.phase) {
          m.phase = "wash";
        }
      } else if (!m.phase) {
        m.phase = "wash";
      }
    }
    if (isOn(m.door) || isOn(m.fdoor)) m.alerts.unshift("door_open");
    m.alerts = [...new Set(m.alerts)];
    return m;
  }

  async _setMode(key) {
    const hass = this._hass, c = this._config;
    const id = c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
    const st = id && hass.states[id];
    if (!st) return;
    const dom = domainOf(id), opts = modeOptions(st);
    const opt = pickMode(opts, key);
    if (!opt) return;
    if (dom === "select" || dom === "input_select") {
      hass.callService(dom, "select_option", { entity_id: id, option: opt });
    } else if (dom === "climate") {
      const hv = st.attributes.hvac_modes || [];
      if (key === "off") { hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: hv.find((x) => x === "off") || "off" }); return; }
      if (st.state === "off") {
        const on = hv.find((x) => ["heat", "heat_cool", "auto"].includes(x));
        if (on) await hass.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: on });
      }
      if ((st.attributes.preset_modes || []).includes(opt)) hass.callService("climate", "set_preset_mode", { entity_id: id, preset_mode: opt });
    }
  }

  /* ---------------- rendering ---------------- */
  _lcdText(m) {
    const hass = this._hass, kind = this._kind;
    const active = ["running", "heating", "preheating", "cooling", "ignition", "filtering", "printing", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging"].includes(m.status);
    if (m.status === "unavailable") return "- - -";
    if (["fridge", "wine_cooler", "chest_freezer", "drawer_freezer"].includes(kind)) return m.tempVal != null ? `${fmtNum(hass, m.tempVal, 0)}°` : "--°";
    if (kind === "towel_dryer") {
      if (m.status === "off") return "OFF";
      if (m.radMode === "frost") return "H-G";
      const v = m.targetVal ?? m.tempVal;
      return v != null ? `${Math.round(v)}°` : "ON";
    }
    if (kind === "server_rack") {
      if (m.status === "off") return "OFF";
      if (m.status === "standby") return "STBY";
      return m.watts != null ? `${Math.round(m.watts)}W` : "ON";
    }
    if (kind === "radiator") {
      if (m.status === "off") return "OFF";
      if (m.radMode === "frost") return "H-G";
      const v = m.targetVal ?? m.tempVal;
      return v != null ? `${Math.round(v)}°` : "ON";
    }
    if (kind === "solar") {
      if (m.status === "night") return tr(hass, "lcd_night");
      if (m.watts == null) return "--";
      return m.watts >= 1000 ? `${(m.watts / 1000).toFixed(m.watts >= 10000 ? 0 : 1)}kW` : `${Math.round(m.watts)}W`;
    }
    if (kind === "printer_3d") {
      if (m.status === "printing") return m.progress != null ? `${Math.round(m.progress)}%` : m.remaining ? lcdDuration(m.remaining) : "PRINT";
      if (m.status === "heating") return m.tempVal != null ? `${Math.round(m.tempVal)}°` : "HEAT";
      if (m.status === "paused") return "PAUSE";
      if (m.status === "finished") return "DONE";
      if (m.status === "failed") return "ERROR";
      if (m.status === "ready") return "READY";
      return "OFF";
    }
    if (kind === "pool_pump") {
      if (m.status === "filtering") {
        const sp = num(m.speed), u = String(m.speed?.attributes.unit_of_measurement || "").toLowerCase();
        if (sp != null && u !== "%") return `${Math.round(sp)}`;
        if (sp != null) return `${Math.round(sp)}%`;
        return m.watts != null ? `${Math.round(m.watts)}W` : "ON";
      }
      return m.status === "standby" ? "STBY" : "OFF";
    }
    if (kind === "pellet_stove") {
      if (m.status === "ignition") return tr(hass, "lcd_ignition");
      if (m.status === "extinguishing") return tr(hass, "lcd_extinguishing");
      if (m.status === "alarm") return "ALARM";
      if (m.status === "standby") return "ECO";
      if (m.status === "heating") return m.tempVal != null ? `${Math.round(m.tempVal)}°` : m.level != null ? `P${Math.round(m.level)}` : "ON";
      return fmtClock(hass, new Date());
    }
    if (kind === "oven") {
      if (active && m.tempVal != null) return `${Math.round(m.tempVal)}°`;
      if (active) return m.remaining ? lcdDuration(m.remaining) : "ON";
      return fmtClock(hass, new Date());
    }
    if (kind === "beer_tap") {
      if (m.status === "off" || m.status === "unavailable") return "";
      return m.tempVal != null ? `${fmtNum(hass, m.tempVal, 1)}°` : m.status === "cooling" ? "COLD" : "READY";
    }
    if (kind === "av_receiver") {
      if (["off", "unavailable", "standby"].includes(m.status)) return "";
      if (m.status === "muted") return "MUTE";
      if (m.status === "paused") return "PAUSE";
      if (m.source) return String(m.source).toUpperCase().slice(0, 9);
      return m.vol != null ? `VOL ${Math.round(m.vol * 100)}` : "ON";
    }
    if (kind === "ac_split") {
      if (m.status === "off" || m.status === "unavailable") return "";
      return m.targetVal != null ? `${Math.round(m.targetVal)}°` : m.tempVal != null ? `${Math.round(m.tempVal)}°` : "ON";
    }
    if (kind === "coffee_maker") {
      if (m.status === "brewing") return tr(hass, "lcd_brewing");
      if (m.status === "ready") return tr(hass, "lcd_ready");
      if (m.status === "off") return "OFF";
      return fmtClock(hass, new Date());
    }
    if (kind === "air_fryer") {
      if (m.status === "finished") return "End";
      if (active && m.remaining != null && m.remaining > 0) return lcdDuration(m.remaining, m.remaining < 60);
      if (active && m.tempVal != null) return `${Math.round(m.tempVal)}°`;
      return active ? "ON" : "OFF";
    }
    if (kind === "microwave") {
      if (m.status === "finished") return "End";
      if (active) return m.remaining != null ? lcdDuration(m.remaining, m.remaining < 60) : "ON";
      return fmtClock(hass, new Date());
    }
    if (m.status === "finished") return "END";
    if (!active) return "OFF";
    if (m.remaining != null && m.remaining > 0) return lcdDuration(m.remaining);
    return { wash: "WASH", rinse: "RINSE", spin: "SPIN", dry: "DRY", cool: "COOL", heat: "HEAT" }[m.phase] || "RUN";
  }

  _render(m) {
    const hass = this._hass, c = this._config, kind = this._kind;
    const $ = (i) => this.shadowRoot.getElementById(i);
    const active = ["running", "heating", "preheating", "cooling", "ignition", "filtering", "printing", "producing", "low", "speed1", "speed2", "cooking", "brewing", "keep_warm", "screen_on", "online", "ac_dry", "ac_fan", "defrost", "pouring", "playing", "muted", "fan_1", "fan_2", "fan_3", "charging"].includes(m.status);
    $("wrap").className = [
      "wrap", c.layout === "split" ? "layout-split" : "", `k-${kind}`, `st-${m.status}`, `accent-${m.accent || this._def.accent}`,
      active ? "active" : "", m.phase ? `ph-${m.phase}` : "",
      m.alerts.length ? "alert" : "", isOn(m.door) ? "door-open" : "", isOn(m.fdoor) ? "fz-open" : "",
      m.alerts.includes("too_warm") ? "warm" : "", m.alerts.includes("humid") ? "humid" : "", c.animations === false ? "no-anim" : "", m.lights ? "lights-on" : "", m.solarHeat ? "solar-heat" : "", m.acMode ? `mode-${m.acMode}` : "", m.osc ? "osc" : "",
    ].filter(Boolean).join(" ");

    // illustration dynamic parts
    if (kind === "av_receiver") $("wrap").style.setProperty("--amp", (m.amp ?? .6).toFixed(2));
    if (kind === "beer_tap") $("wrap").style.setProperty("--keg", ((m.keg ?? 70) / 100).toFixed(2));
    if (kind === "tool_charger") {
      // jauge 4 LED : niveau réel si capteur, sinon remplissage en boucle pendant la charge
      const st = m.status, lv = m.batt != null ? Math.max(0, Math.min(100, m.batt)) : null;
      const lit = st === "charged" ? 4 : st === "charging" && lv != null ? Math.min(4, Math.floor(lv / 25)) : 0;
      $("wrap").classList.toggle("seq", st === "charging" && lv == null);
      this.shadowRoot.querySelectorAll(".tc-g").forEach((g, i) => {
        g.classList.toggle("on", i < lit);
        g.classList.toggle("next", st === "charging" && lv != null && i === lit);
      });
    }
    if (kind === "tv") {
      const prev = this._tvPrev, on = m.status === "screen_on";
      const scr = this.shadowRoot.querySelector(".tv-flash");
      if (prev !== undefined && scr && (prev === "screen_on") !== on) {
        const g = this.shadowRoot.querySelector("svg");
        g.classList.remove("tv-boot", "tv-shut"); void g.getBoundingClientRect(); g.classList.add(on ? "tv-boot" : "tv-shut");
        clearTimeout(this._tvT); this._tvT = setTimeout(() => g.classList.remove("tv-boot", "tv-shut"), 3400);
      }
      this._tvPrev = m.status;
    }
    const sr = this.shadowRoot;
    const lcdEl = sr.querySelector(".lcd");
    if (lcdEl) lcdEl.textContent = this._lcdText(m);
    const lcd3 = sr.querySelector(".lcd3");
    if (lcd3) lcd3.textContent = m.status === "unavailable" || m.flexVal == null ? "--°" : `${fmtNum(hass, m.flexVal, 0)}°`;
    const lcd2 = sr.querySelector(".lcd2");
    if (lcd2) lcd2.textContent = m.status === "unavailable" ? "--" : m.zone2 != null ? `${fmtNum(hass, m.zone2, 0)}°` : "--°";
    if (kind === "generic" && Array.isArray(c.images)) {
      // image conditionnelle : la dernière entrée dont toutes les conditions sont vraies (une entrée sans condition vaut toujours)
      const main = hass.states[c.entity];
      let src = c.image || "";
      for (const it of c.images) {
        if (!it || !it.image) continue;
        const st = it.entity ? hass.states[it.entity] : null;
        const val = it.entity ? num(st) : m.pw ? powerW(m.pw) : num(main);
        const raw = String((it.entity ? st : main)?.state ?? "").toLowerCase();
        const okAbove = it.above == null || (val != null && val > Number(it.above));
        const okBelow = it.below == null || (val != null && val < Number(it.below));
        const okState = it.state == null || [].concat(it.state).some((v) => String(v).toLowerCase() === raw);
        if (okAbove && okBelow && okState) src = it.image;
      }
      const img = sr.querySelector(".gn-img");
      if (img && img.tagName.toLowerCase() === "image" && img.getAttribute("href") !== String(src).trim()) img.setAttribute("href", String(src).trim());
    }
    if (kind === "server_rack") $("wrap").style.setProperty("--load", (m.load ?? 0.4).toFixed(2));
    if (kind === "solar") $("wrap").style.setProperty("--sun", (m.frac || 0).toFixed(2));
    if (kind === "radiator" || kind === "towel_dryer") {
      $("wrap").style.setProperty("--heat", (m.heat || 0).toFixed(2));
      ["comfort", "eco", "frost"].forEach((k) => $("wrap").classList.toggle(`mode-${k}`, m.radMode === k || (k === "comfort" && !m.radMode && m.status !== "off")));
      if (kind === "radiator") $("wrap").classList.toggle("win-open", isOn(m.window));
    }
    if (kind === "hob" && m.zones) {
      m.zones.forEach((v, i) => {
        const z = sr.querySelector(`.z${i + 1}`), d = sr.querySelector(`.zd${i + 1}`);
        const res = m.residualZones[i];
        z.style.setProperty("--lvl", v > 0 ? (0.25 + v * 0.083).toFixed(2) : res ? "0.12" : "0");
        z.classList.toggle("on", v > 0); z.classList.toggle("res", !!res);
        d.textContent = v > 0 ? String(v) : res ? "H" : "0";
        d.classList.toggle("on", v > 0 || !!res);
      });
      $("wrap").classList.toggle("pot-on", m.zones[0] > 0);
      $("wrap").classList.toggle("pot-boil", m.zones[0] >= 7);
      $("wrap").classList.toggle("pan-on", m.zones[3] > 0);
    }
    if (kind === "printer_3d") {
      const H = 38;
      let frac = m.progress != null ? Math.max(0, Math.min(1, m.progress / 100)) : null;
      if (m.status === "finished") frac = 1;
      if (m.progress == null && m.status !== "printing" && m.status !== "finished") frac = 0;
      const wrap = $("wrap");
      wrap.classList.toggle("indeterminate", frac == null);
      const h = (frac ?? 0) * H;
      wrap.style.setProperty("--h", h.toFixed(2));
      const clip = sr.querySelector(".objclip");
      clip.setAttribute("y", (104 - h).toFixed(2)); clip.setAttribute("height", h.toFixed(2));
      wrap.style.setProperty("--fil", c.filament_color || "#ff8a1f");
    }
    if (kind === "pool_pump") {
      const sp = num(m.speed), u = String(m.speed?.attributes.unit_of_measurement || "").toLowerCase();
      let spd = 1;
      if (sp != null) spd = u === "%" ? 0.3 + sp / 100 : sp / 2800;
      else if (m.watts != null && c.max_power) spd = m.watts / c.max_power;
      spd = Math.max(0.3, Math.min(1.6, spd));
      $("wrap").style.setProperty("--spd", spd.toFixed(2));
    }
    if (kind === "pellet_stove") {
      const fs = m.level != null ? Math.max(0.55, Math.min(1.2, 0.55 + 0.13 * m.level)) : 1;
      sr.querySelector(".fire").style.setProperty("--fs", fs.toFixed(2));
    }
    if (kind === "water_heater") {
      const t = m.tempVal;
      const ang = t == null ? -135 : -135 + Math.max(0, Math.min(1, (t - 10) / 70)) * 270;
      sr.querySelector(".needle").setAttribute("transform", `rotate(${ang.toFixed(1)} 60 76)`);
      sr.querySelector(".gauge-txt").textContent = t == null ? "--°" : `${Math.round(t)}°`;
    }

    // name + status
    const name = c.name || tr(hass, kind);
    let statusTxt = m.phase ? tr(hass, `ph_${m.phase}`) : tr(hass, m.status);
    if (m.main && ["sensor", "input_select", "select"].includes(domainOf(c.entity)) &&
        active && !["fridge", "water_heater", "printer_3d", "pool_pump"].includes(kind)) {
      const raw = String(m.main.state).toLowerCase();
      if (![...OFF_STATES, ...DONE_STATES, "on", "running", "run"].includes(raw)) statusTxt = stateText(hass, m.main);
    }
    if ((kind === "radiator" || kind === "towel_dryer") && m.radMode && m.radMode !== "off" && m.status !== "off" && m.status !== "unavailable") statusTxt += ` · ${tr(hass, m.radMode)}`;
    if ((kind === "fan" || kind === "ceiling_fan") && m.pct != null && /^fan_/.test(m.status)) statusTxt += ` · ${Math.round(m.pct)} %`;
    if (kind === "av_receiver" && m.vol != null && ["playing", "paused"].includes(m.status)) statusTxt += ` · Vol ${Math.round(m.vol * 100)} %`;
    if (kind === "av_receiver" && m.source && ["playing", "paused", "muted"].includes(m.status)) statusTxt += ` · ${m.source}`;
    if (kind === "tv" && m.status === "screen_on" && m.main && domainOf(c.entity) === "media_player") {
      const a = m.main.attributes || {}, what = a.app_name || a.media_title || a.source;
      if (what) statusTxt += ` · ${what}`;
    }
    if (m.solarHeat && active) statusTxt += ` · ${tr(hass, "solar_surplus")}`;
    const prog = m.program && active && !BAD.includes(String(m.program.state).toLowerCase()) ? stateText(hass, m.program) : "";
    let sub = "";
    if (active && m.remaining != null && m.remaining > 0) {
      sub = `${tr(hass, "ends_at")} ${fmtClock(hass, new Date(Date.now() + m.remaining * 60000))}`;
    }
    const alertTxt = m.alerts.map((a) => tr(hass, a)).join(" · ");
    let frPill = "";
    if (kind === "fridge" && m.tempVal != null) {
      let tCol = "color: #4caf50; border-color: rgba(76, 175, 80, 0.45); background: rgba(76, 175, 80, 0.15); box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);";
      if (m.tempVal >= 10) {
        tCol = "color: #ff5252; border-color: rgba(244, 67, 54, 0.5); background: rgba(244, 67, 54, 0.18); box-shadow: 0 0 8px rgba(244, 67, 54, 0.3);";
      } else if (m.tempVal >= 8) {
        tCol = "color: #ff9800; border-color: rgba(255, 152, 0, 0.5); background: rgba(255, 152, 0, 0.18); box-shadow: 0 0 8px rgba(255, 152, 0, 0.25);";
      } else if (m.tempVal >= 6) {
        tCol = "color: #ffeb3b; border-color: rgba(255, 235, 59, 0.45); background: rgba(255, 235, 59, 0.15); box-shadow: 0 0 8px rgba(255, 235, 59, 0.2);";
      }
      frPill = `<span class="fr-pill" style="${tCol}"><ha-icon icon="mdi:thermometer" style="color: inherit;"></ha-icon>${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}</span>`;
    }
    if (c.layout === "split") {
      $("info").innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:4px;">
          <div class="name">${esc(name)}</div>
          ${frPill}
        </div>
        <div class="status"><span class="dot"></span><span>${esc(statusTxt)}${prog && prog !== statusTxt ? ` · ${esc(prog)}` : ""}</span></div>
        ${alertTxt ? `<div class="alert-line"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(alertTxt)}</div>` : ""}
        ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}`;
    } else {
      $("info").innerHTML = `
        <div class="name">${esc(name)}</div>
        <div class="status"><span class="dot"></span><span>${esc(statusTxt)}${prog && prog !== statusTxt ? ` · ${esc(prog)}` : ""}</span>${frPill}</div>
        ${alertTxt ? `<div class="alert-line"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(alertTxt)}</div>` : ""}
        ${sub ? `<div class="sub">${esc(sub)}</div>` : ""}`;
    }

    if (c.switch && c.show_toggle !== false) {
      const on = isOn(m.sw);
      // safety: cutting a washer/dryer/dishwasher mid-cycle needs a second click
      const freezer = ["chest_freezer", "drawer_freezer"].includes(kind);
      const guarded = c.confirm_off !== false && on && (freezer || ((active || ["extinguishing", "paused"].includes(m.status)) && ["washer", "dryer", "dishwasher", "pellet_stove", "printer_3d"].includes(kind)));
      const arming = guarded && this._confirmUntil && Date.now() < this._confirmUntil;
      const label = arming ? tr(hass, "confirm_off") : tr(hass, "toggle");
      $("actions").innerHTML = `<button class="toggle ${on ? "on" : ""} ${arming ? "confirm" : ""}" title="${esc(label)}" aria-label="${esc(label)}" aria-pressed="${on}"><ha-icon icon="${arming ? "mdi:alert" : "mdi:power"}"></ha-icon></button>${arming ? `<div class="confirm-tip">${esc(label)}</div>` : ""}`;
      $("actions").querySelector("button").onclick = (ev) => {
        ev.stopPropagation();
        if (guarded && !(this._confirmUntil && Date.now() < this._confirmUntil)) {
          this._confirmUntil = Date.now() + 4000;
          this._render(this._compute());
          clearTimeout(this._confirmTimer);
          this._confirmTimer = setTimeout(() => { this._confirmUntil = 0; if (this._hass) this._render(this._compute()); }, 4100);
          return;
        }
        this._confirmUntil = 0;
        clearTimeout(this._confirmTimer);
        const dom = domainOf(c.switch);
        hass.callService(["switch", "input_boolean", "light", "fan"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: c.switch });
      };
    } else $("actions").innerHTML = "";

    // progress bar
    let pct = null;
    if (active && m.progress != null) pct = m.progress;
    else if (kind === "tool_charger" && m.status === "charging" && m.batt != null) pct = m.batt;
    else if ((kind === "oven" && m.status === "preheating") || (kind === "water_heater" && m.status !== "off")) {
      if (m.tempVal != null && m.targetVal) {
        const floor = kind === "water_heater" ? 10 : 20;
        pct = ((m.tempVal - floor) / (m.targetVal - floor)) * 100;
      }
    }
    if (pct != null && Number.isFinite(pct)) {
      $("bar").style.display = "";
      $("barfill").style.width = `${Math.max(0, Math.min(100, pct))}%`;
    } else $("bar").style.display = "none";

    // boutons de mode (confort / éco / hors-gel / arrêt)
    const modesEl = $("modes");
    const mEnt = c.mode || (domainOf(c.entity) === "climate" ? c.entity : null);
    if ((kind === "radiator" || kind === "towel_dryer") && mEnt && c.show_modes !== false && hass.states[mEnt]) {
      const opts = modeOptions(hass.states[mEnt]);
      const cur = m.radMode ?? (m.status !== "off" ? "comfort" : "off");
      modesEl.innerHTML = MODE_ORDER.filter((k) => pickMode(opts, k)).map((k) =>
        `<button class="mode-btn ${cur === k ? "on" : ""}" data-mode="${k}" aria-pressed="${cur === k}"><ha-icon icon="${MODE_ICON[k]}"></ha-icon>${esc(tr(hass, k === "off" ? "mode_off" : k))}</button>`).join("");
      modesEl.querySelectorAll("button").forEach((b) => { b.onclick = (ev) => { ev.stopPropagation(); this._setMode(b.dataset.mode); }; });
    } else modesEl.innerHTML = "";

    // stats
    const tiles = [];
    // libellé perso (option labels) sinon traduction
    const lb = (k) => (c.labels && c.labels[k] != null && c.labels[k] !== "" ? String(c.labels[k]) : tr(hass, k));
    const tile = (icon, value, label, entity, cls = "") => {
      if (value == null) return;
      tiles.push(`<div class="tile ${cls}" ${entity ? `data-entity="${esc(entity)}"` : ""}>
        <span class="val">${esc(value)}</span><span class="lbl"><ha-icon icon="${icon}"></ha-icon>${esc(label)}</span></div>`);
    };
    const tEntity = c.temperature || (["water_heater", "climate"].includes(domainOf(c.entity)) ? c.entity : null);
    if (kind === "chest_freezer" || kind === "drawer_freezer") {
      if (m.tempVal != null) tile("mdi:snowflake-thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity,
        m.alerts.includes("too_warm") ? "warn" : "");
    } else if (kind === "beer_tap") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.keg != null) tile("mdi:keg", `${fmtNum(hass, m.keg, 0)} %`, lb("keg"), c.keg_level, m.alerts.includes("keg_low") ? "warn" : "");
    } else if (kind === "tool_charger") {
      if (m.batt != null) tile(m.status === "charging" ? "mdi:battery-charging" : "mdi:battery", `${fmtNum(hass, m.batt, 0)} %`, lb("battery"), c.battery_level);
    } else if (kind === "wine_cooler") {
      const dual = !!c.zone2_temperature, max1 = c.max_temperature ?? 18, max2 = c.max_temperature_2 ?? max1;
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb(dual ? "zone_top" : "temperature"), tEntity, m.tempVal > max1 ? "warn" : "");
      if (dual && m.zone2 != null) tile("mdi:thermometer-low", `${fmtNum(hass, m.zone2, 1)} ${m.zone2Ent?.attributes.unit_of_measurement || m.tempUnit}`, lb("zone_bottom"), c.zone2_temperature, m.zone2 > max2 ? "warn" : "");
    } else if (kind === "fridge") {
      if ((!c.energy || c.layout !== "split") && m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("fridge_temp"), tEntity,
        m.tempVal > (c.max_temperature ?? 8) ? "warn" : "");
      if (m.ftemp) tile("mdi:snowflake", fmtUnit(hass, m.ftemp, 1), lb("freezer_temp"), c.freezer_temperature,
        num(m.ftemp) > (c.freezer_max_temperature ?? -12) ? "warn" : "");
      if (m.flexVal != null) tile("mdi:thermometer-lines", `${fmtNum(hass, m.flexVal, 1)} ${m.flex.attributes.unit_of_measurement || m.tempUnit}`, lb("flex_temp"), c.flex_temperature,
        c.flex_max_temperature != null && m.flexVal > c.flex_max_temperature ? "warn" : "");
    } else if (kind === "radiator") {
      const te = c.temperature || (domainOf(c.entity) === "climate" ? c.entity : null);
      if (m.tempVal != null) tile("mdi:home-thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), te);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1)} ${m.tempUnit}`, lb("target"), c.target_temperature || te);
    } else if (kind === "hob") {
      /* no extra tile */
    } else if (kind === "vmc") {
      if (m.humidity != null) tile("mdi:water-percent", `${fmtNum(hass, m.humidity, 0)} %`, lb("humidity"), c.humidity, m.alerts.includes("humid") ? "warn" : "");
    } else if (kind === "printer_3d") {
      if (m.progress != null) tile("mdi:progress-check", `${fmtNum(hass, m.progress, 0)} %`, lb("progress"), c.progress);
      if (m.nozzles && m.nozzles.length) {
        // une puce par buse : T0, T1, T2…
        m.nozzles.forEach((id, i) => {
          const v = num(hass.states[id]);
          tile("mdi:printer-3d-nozzle-heat", v != null ? `${fmtNum(hass, v, 0)} ${m.tempUnit}` : "—", `T${i}`, id);
        });
      } else if (m.tempVal != null) tile("mdi:printer-3d-nozzle-heat", `${fmtNum(hass, m.tempVal, 0)} ${m.tempUnit}`, lb("nozzle"), tEntity);
      if (m.bedTemp != null) tile("mdi:heat-wave", `${fmtNum(hass, m.bedTemp, 0)} ${m.tempUnit}`, lb("bed"), c.bed_temperature);
    } else if (kind === "pool_pump") {
      if (m.tempVal != null) tile("mdi:thermometer-water", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("water"), tEntity);
      if (m.runtime != null) tile("mdi:timer-outline", fmtDuration(m.runtime), lb("today"), c.runtime);
      if (num(m.speed) != null) tile("mdi:speedometer", fmtUnit(hass, m.speed, 0), lb("speed"), c.speed);
    } else if (kind === "pellet_stove") {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 1)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 1)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
      if (m.level != null) tile("mdi:fire", `P${fmtNum(hass, m.level, 0)}`, lb("level"), c.power_level);
      if (m.pellets != null) tile("mdi:grain", `${fmtNum(hass, m.pellets, 0)} %`, lb("pellets"), c.pellet_level, m.alerts.includes("pellets_low") ? "warn" : "");
    } else if (["water_heater", "oven", "air_fryer", "ac_split", "heat_pump", "towel_dryer", "server_rack"].includes(kind)) {
      if (m.tempVal != null) tile("mdi:thermometer", `${fmtNum(hass, m.tempVal, 0)} ${m.tempUnit}`, lb("temperature"), tEntity);
      if (m.targetVal != null) tile("mdi:target", `${fmtNum(hass, m.targetVal, 0)} ${m.tempUnit}`, lb("target"), c.target_temperature || tEntity);
    }
    if (m.remaining != null && m.remaining > 0 && active && kind !== "water_heater") tile("mdi:timer-sand", fmtDuration(m.remaining), lb("remaining"), c.remaining);
    const solar = kind === "solar";
    const dual = kind === "water_heater" && (m.pwS || m.energyS);
    if (m.pw && c.show_power !== false) tile(solar ? "mdi:solar-power" : "mdi:flash", fmtPower(hass, m.pw) ?? "—", lb(solar ? "production" : dual ? "grid" : "power"), c.power);
    if (m.pwS) tile("mdi:solar-power", fmtPower(hass, m.pwS) ?? "—", lb("solar_surplus"), c.power_solar);
    const per = ["day", "week", "month"].includes(c.energy_period) && this._perKwh != null ? c.energy_period : null;
    if (m.energy && per && !dual && !solar) {
      tile("mdi:calendar-today", `${fmtNum(hass, this._perKwh, 2)} kWh`, c.labels && c.labels.energy ? lb("energy") : tr(hass, `energy_${per}`), c.energy);
    } else if (m.energy) {
      const eVal = fmtEnergy(hass, m.energy) ?? "—";
      const yp = m.energy.attributes && m.energy.attributes.last_period;
      if (yp !== undefined && yp !== null && !isNaN(parseFloat(yp))) {
        const ydayStr = parseFloat(yp).toFixed(1);
        tile("mdi:history", eVal, `Yday ${ydayStr} kWh`, c.energy);
      } else {
        tile("mdi:lightning-bolt-circle", eVal, lb(solar ? "today" : dual ? "energy_grid" : "energy"), c.energy);
      }
    }
    if (m.energyS) tile("mdi:solar-power-variant", fmtEnergy(hass, m.energyS) ?? "—", lb("energy_solar"), c.energy_solar);
    if (m.cost) tile(solar ? "mdi:piggy-bank-outline" : "mdi:cash", fmtUnit(hass, m.cost, 2, 2) ?? "—", lb(solar ? "savings" : "cost"), c.cost);
    if (solar && m.status !== "night" && m.frac != null && m.pw && !BAD.includes(String(m.pw.state).toLowerCase())) tile("mdi:white-balance-sunny", `${Math.round(m.frac * 100)} %`, lb("of_peak"), c.power);
    $("stats").innerHTML = tiles.join("");
    $("stats").style.display = tiles.length ? "" : "none";
  }
}

/* ------------------------------------------------------------------ */
/* Visual editor schema                                                */
/* ------------------------------------------------------------------ */
const SEL = {
  entity: { entity: {} },
  power: { entity: { domain: "sensor", device_class: "power" } },
  energy: { entity: { domain: "sensor", device_class: "energy" } },
  power_solar: { entity: { domain: "sensor", device_class: "power" } },
  energy_solar: { entity: { domain: "sensor", device_class: "energy" } },
  cost: { entity: { domain: ["sensor", "input_number"] } },
  remaining: { entity: { domain: "sensor" } },
  progress: { entity: { domain: "sensor" } },
  program: { entity: { domain: ["sensor", "select", "input_select"] } },
  door: { entity: { domain: "binary_sensor" } },
  freezer_door: { entity: { domain: "binary_sensor" } },
  switch: { entity: { domain: ["switch", "input_boolean", "light"] } },
  // climate / water_heater acceptés : la carte lit alors current_temperature / temperature (pas l'état, qui est un mode)
  temperature: { entity: { filter: [{ domain: ["sensor", "input_number"], device_class: "temperature" }, { domain: ["climate", "water_heater"] }] } },
  target_temperature: { entity: { domain: ["sensor", "input_number", "number", "climate", "water_heater"] } },
  freezer_temperature: { entity: { domain: "sensor", device_class: "temperature" } },
  flex_temperature: { entity: { domain: ["sensor", "climate"] } },
  power_level: { entity: { domain: ["sensor", "number", "input_number", "select", "input_select"] } },
  pellet_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  runtime: { entity: { domain: ["sensor"] } },
  light: { entity: { domain: ["light", "switch", "binary_sensor", "input_boolean"] } },
  zone2_temperature: { entity: { domain: ["sensor", "input_number"], device_class: "temperature" } },
  battery_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  keg_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  pouring: { entity: { domain: ["binary_sensor", "input_boolean", "switch"] } },
  bed_temperature: { entity: { domain: ["sensor"], device_class: "temperature" } },
  humidity: { entity: { domain: ["sensor"], device_class: "humidity" } },
  mode: { entity: { domain: ["select", "input_select", "sensor", "climate"] } },
  window: { entity: { domain: "binary_sensor" } },
  zone_1: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_2: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_3: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_4: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  speed: { entity: { domain: ["sensor", "number", "input_number", "select"] } },
};
function buildForm(kind) {
  const d = DEF[kind];
  return {
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "labels", selector: { object: {} } },
      ...d.fields.map((f) => ({ name: f, selector: SEL[f] })),
      {
        type: "expandable", name: "", title: "Options", flatten: true, schema: [
          { name: "threshold", selector: { number: { min: 0, max: 3000, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ...(["washer", "dishwasher"].includes(kind) ? [
            { name: "heating_power", selector: { number: { min: 100, max: 4000, step: 50, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "washer" ? [
            { name: "spin_power", selector: { number: { min: 50, max: 2000, step: 25, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(["chest_freezer", "drawer_freezer"].includes(kind) ? [
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 0, step: 0.5, mode: "box" } } },
          ] : []),
          ...(kind === "wine_cooler" ? [
            { name: "max_temperature", selector: { number: { min: 5, max: 25, step: 0.5, mode: "box" } } },
            { name: "max_temperature_2", selector: { number: { min: 3, max: 25, step: 0.5, mode: "box" } } },
          ] : []),
          ...(kind === "fridge" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "top", label: "Congélateur en haut / Top freezer" }, { value: "bottom", label: "Congélateur en bas / Bottom freezer" },
              { value: "bottom_door", label: "Combiné, porte en bas / Bottom freezer door" },
              { value: "french", label: "French door" }, { value: "four_door", label: "4 portes / 4-door" }, { value: "american", label: "Américain / Side-by-side" }] } } },
            { name: "max_temperature", selector: { number: { min: 0, max: 15, step: 0.5, mode: "box" } } },
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 0, step: 0.5, mode: "box" } } },
            { name: "flex_max_temperature", selector: { number: { min: -30, max: 15, step: 0.5, mode: "box" } } },
          ] : []),
          ...(d.fields.includes("energy") ? [{ name: "energy_period", selector: { select: { mode: "dropdown", options: [
            { value: "", label: tr(null, "energy") }, ...["day", "week", "month"].map((value) => ({ value, label: tr(null, `energy_${value}`) }))] } } }] : []),
          { name: "illustration_size", selector: { number: { min: 30, max: 300, step: 5, mode: "slider", unit_of_measurement: "%" } } },
          { name: "transparent", selector: { boolean: {} } },
          { name: "animations", selector: { boolean: {} }, default: true },
          ...(kind === "generic" ? [{ name: "image", selector: { text: {} } }, { name: "images", selector: { object: {} } }] : []),
          ...(kind === "printer_3d" ? [
            { name: "nozzle_temperatures", selector: { entity: { multiple: true, domain: "sensor" } } },
            { name: "filament_color", selector: { text: {} } },
          ] : []),
          ...(["ac_split", "heat_pump"].includes(kind) ? [
            { name: "hvac", selector: { select: { mode: "dropdown", options: [
              { value: "auto", label: "Auto (saison) / Auto (season)" }, { value: "cool", label: "Climatisation / Cooling" }, { value: "heat", label: "Chauffage / Heating" }] } } },
          ] : []),
          ...(kind === "ceiling_fan" ? [
            { name: "mid_threshold", selector: { number: { min: 5, max: 200, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "fan" ? [
            { name: "oscillating", selector: { boolean: {} }, default: true },
            { name: "mid_threshold", selector: { number: { min: 5, max: 200, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "tool_charger" ? [
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "av_receiver" ? [
            { name: "max_power", selector: { number: { min: 50, max: 2000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "tv" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "wall", label: "Murale / Wall-mounted" }, { value: "stand", label: "Pied central / Center stand" }, { value: "feet", label: "Deux pieds / Two feet" }] } } },
          ] : []),
          ...(kind === "range_hood" ? [
            { name: "high_threshold", selector: { number: { min: 40, max: 600, step: 5, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "coffee_maker" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "filtre", label: "Filtre / Drip" }, { value: "dosette", label: "Dosettes / Pods" }, { value: "expresso", label: "Expresso / Bean-to-cup" }] } } },
            { name: "warm_threshold", selector: { number: { min: 0, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          { name: "show_power", selector: { boolean: {} }, default: true },
          ...(["radiator", "towel_dryer"].includes(kind) ? [{ name: "show_modes", selector: { boolean: {} }, default: true }] : []),
          ...(kind === "server_rack" ? [
            { name: "max_power", selector: { number: { min: 50, max: 3000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "radiator" ? [
            { name: "max_power", selector: { number: { min: 100, max: 5000, step: 50, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "hob" ? [
            { name: "zone_power", selector: { number: { min: 500, max: 4000, step: 50, mode: "box", unit_of_measurement: "W" } } },
            { name: "residual_minutes", selector: { number: { min: 0, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ] : []),
          ...(kind === "vmc" ? [
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "humidity_max", selector: { number: { min: 40, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "solar" ? [
            { name: "max_power", selector: { number: { min: 100, max: 50000, step: 50, mode: "box", unit_of_measurement: "Wc" } } },
            { name: "sun_entity", selector: { entity: { domain: "sun" } } },
          ] : []),
          ...(kind === "pool_pump" ? [
            { name: "max_power", selector: { number: { min: 100, max: 3000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "pellet_stove" ? [
            { name: "ignition_threshold", selector: { number: { min: 50, max: 1000, step: 10, mode: "box", unit_of_measurement: "W" } } },
            { name: "pellet_alert", selector: { number: { min: 0, max: 50, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(["washer", "dryer", "dishwasher", "pellet_stove", "printer_3d", "chest_freezer", "drawer_freezer"].includes(kind) ? [{ name: "confirm_off", selector: { boolean: {} }, default: true }] : []),
          { name: "color", selector: { text: {} } },
        ],
      },
    ],
    computeLabel: (s) => (s.name ? tr(null, kind === "solar" && s.name === "max_power" ? "f_max_power_solar" : kind === "wine_cooler" && s.name === "max_temperature" ? "f_max_temperature_wine" : kind === "fridge" && s.name === "style" ? "f_fridge_style" : kind === "tv" && s.name === "style" ? "f_tv_style" : kind === "server_rack" && s.name === "max_power" ? "f_max_power_rack" : kind === "radiator" && s.name === "max_power" ? "f_max_power_rad" : `f_${s.name}`) : undefined),
  };
}

/* ------------------------------------------------------------------ */
/* Stub config: auto-detect entities by name                           */
/* ------------------------------------------------------------------ */
function stubFor(kind, hass) {
  const keys = DEF[kind].keys;
  const ids = Object.keys(hass?.states || {});
  const match = (i) => keys.some((k) => i.split(".")[1].includes(k));
  const pick = (pred) => ids.find((i) => match(i) && pred(i, hass.states[i]));
  const dc = (st) => st.attributes.device_class;
  const cfg = {};
  const power = pick((i, st) => i.startsWith("sensor.") && dc(st) === "power");
  const energy = pick((i, st) => i.startsWith("sensor.") && dc(st) === "energy" && /(daily|jour|today|day)/.test(i))
    || pick((i, st) => i.startsWith("sensor.") && dc(st) === "energy");
  const cost = pick((i) => i.startsWith("sensor.") && /(cout|cost|prix)/.test(i) && /(jour|daily|today|day)/.test(i))
    || pick((i, st) => i.startsWith("sensor.") && dc(st) === "monetary");
  const sw = pick((i) => i.startsWith("switch.") && !/(child_lock|lock|led|indicator)/.test(i));
  const wh = kind === "water_heater" ? pick((i) => i.startsWith("water_heater.")) : kind === "tv" || kind === "av_receiver" ? pick((i) => i.startsWith("media_player.")) : ["fan", "ceiling_fan"].includes(kind) ? pick((i) => i.startsWith("fan.")) : ["ac_split", "heat_pump"].includes(kind) ? pick((i) => i.startsWith("climate.")) : null;
  const temp = pick((i, st) => i.startsWith("sensor.") && dc(st) === "temperature");
  const flag = ["washer", "dryer", "dishwasher", "microwave"].includes(kind)
    ? pick((i) => /^(input_boolean|binary_sensor)\./.test(i) && /(running|en_cours|marche|cycle)/.test(i)) : null;
  if (wh) cfg.entity = wh;
  if (flag) cfg.entity = flag;
  if (power) cfg.power = power;
  if (energy) cfg.energy = energy;
  if (cost) cfg.cost = cost;
  if (sw && ["water_heater", "oven", "microwave", "pool_pump", "air_fryer", "coffee_maker", "tv", "range_hood", "ac_split", "heat_pump", "towel_dryer", "server_rack", "desktop_pc", "laptop", "wine_cooler", "beer_tap", "av_receiver", "fan", "tool_charger", "ceiling_fan"].includes(kind)) cfg.switch = sw;
  else if (sw && !cfg.entity) cfg.entity = sw;
  const clim = kind === "radiator" ? pick((i) => i.startsWith("climate.")) : null;
  if (clim) cfg.entity = clim;
  if (temp && ["fridge", "water_heater", "oven", "air_fryer", "beer_tap", "pellet_stove", "pool_pump", "printer_3d", "chest_freezer", "drawer_freezer", "radiator", "towel_dryer", "server_rack", "wine_cooler"].includes(kind)) cfg.temperature = temp;
  const batt = kind === "tool_charger" ? pick((i, st) => i.startsWith("sensor.") && dc(st) === "battery") : null;
  if (batt) cfg.battery_level = batt;
  if (!cfg.entity && !cfg.power && !cfg.switch && !cfg.temperature) cfg.power = "sensor.example_power";
  return cfg;
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const STYLE = `
:host {
  --ac-active: var(--appliance-active-color, var(--state-active-color, var(--primary-color)));
  --ac-heat: var(--appliance-heat-color, var(--state-climate-heat-color, #ff8a3d));
  --ac-cold: var(--appliance-cold-color, var(--state-climate-cool-color, #2b9af9));
  --ac-alert: var(--appliance-alert-color, var(--error-color, #db4437));
  --ac-ok: var(--appliance-ok-color, var(--success-color, #43a047));
  --ac-lcd: #38d9ff;
  display: block; height: 100%;
}
/* carte plus haute que son contenu (grille en sections) : contenu centré verticalement ; « safe » garde le haut visible si ça déborde */
ha-card { display: flex; flex-direction: column; justify-content: safe center; height: 100%; cursor: pointer; overflow: hidden; container-type: inline-size; }
.wrap { padding: 14px; display: flex; flex-direction: column; gap: 12px; --c: var(--ac-accent, var(--ac-active)); }
.wrap.accent-heat { --c: var(--ac-accent, var(--ac-heat)); }
.wrap.accent-cold { --c: var(--ac-accent, var(--ac-cold)); }
.top {
  display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "illus head" "illus stats";
  column-gap: 14px; row-gap: 10px; align-items: start; min-width: 0;
}
.illus { grid-area: illus; } .head { grid-area: head; } .stats { grid-area: stats; }
.illus {
  width: calc(var(--appliance-illustration-size, 116px) * var(--illus-scale, 1)); flex: none; aspect-ratio: 120 / 140; border-radius: 16px; padding: 4px; box-sizing: content-box;
  background: radial-gradient(circle at 50% 40%, rgba(127,127,127,.10), rgba(127,127,127,.03) 70%);
}
.st-unavailable .illus { opacity: .5; filter: grayscale(1); }
svg { width: 100%; height: 100%; display: block; overflow: visible; }
.head { display: flex; gap: 8px; align-items: flex-start; min-width: 0; }
.info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.name { font-size: 16px; font-weight: 600; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--secondary-text-color); min-width: 0; }
.status span:last-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--disabled-text-color, #9e9e9e); }
.active .dot { background: var(--c); box-shadow: 0 0 0 3px rgba(127,127,127,.2); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 25%, transparent); }
.ph-heat .dot { background: var(--ac-heat, #ff8a3d); }
.active .status { color: var(--primary-text-color); }
.st-finished .dot { background: var(--ac-ok); }
.alert-line { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: var(--ac-alert); }
.alert-line ha-icon { --mdc-icon-size: 16px; }
.sub { font-size: 12px; color: var(--secondary-text-color); }
.actions:empty { display: none; }
.toggle {
  width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; display: grid; place-items: center; flex: none;
  color: var(--secondary-text-color); background: rgba(127,127,127,.14); transition: background .2s, color .2s;
}
.toggle.on { color: var(--text-primary-color, #fff); background: var(--c); }
.toggle.confirm { color: #fff; background: var(--ac-alert); animation: ac-pulse 1s ease-in-out infinite; }
.actions { position: relative; }
.confirm-tip {
  position: absolute; right: 0; top: 44px; z-index: 2; width: 170px; padding: 6px 8px; border-radius: 8px;
  font-size: 11.5px; line-height: 1.3; color: #fff; background: var(--ac-alert); box-shadow: 0 4px 14px rgba(0,0,0,.3);
}
.toggle:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
.toggle ha-icon { --mdc-icon-size: 20px; }
.bar { height: 6px; border-radius: 3px; overflow: hidden; background: rgba(127,127,127,.18); }
.bar-fill { height: 100%; width: 0; border-radius: 3px; background: var(--c); transition: width .6s ease; }
.stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.tile { display: flex; flex-direction: column; padding: 6px 9px; border-radius: 10px; min-width: 0; background: rgba(127,127,127,.09); }
.tile:hover { background: rgba(127,127,127,.16); }
.val { font-size: 14px; font-weight: 600; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lbl { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lbl ha-icon { --mdc-icon-size: 13px; flex: none; }
.tile.warn .val, .tile.warn .lbl { color: var(--ac-alert); }
@container (max-width: 400px) {
  .top { grid-template-areas: "illus head" "stats stats"; }
  .illus { width: calc(var(--appliance-illustration-size-small, 84px) * var(--illus-scale, 1)); }
  .stats { grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)); }
}
/* carte très étroite (ex. 3 cartes côte à côte) : illustration au-dessus, titre et statut centrés et sur plusieurs lignes */
@container (max-width: 230px) {
  .top { grid-template-columns: minmax(0, 1fr); grid-template-areas: "illus" "head" "stats"; justify-items: center; }
  .head { flex-direction: column; align-items: center; text-align: center; width: 100%; }
  .info { align-items: center; width: 100%; }
  .name { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; }
  .status { justify-content: center; flex-wrap: wrap; }
  .status span:last-child { white-space: normal; overflow: visible; text-overflow: clip; }
  /* les tuiles gardent toute la largeur (justify-items: center les réduisait à leur contenu) */
  .stats { justify-self: stretch; width: 100%; }
}
/* même disposition empilée, plus tôt, quand illustration_size agrandit le dessin (attribut posé par applianceSize) */
@container (max-width: 320px) {
  :host([illus-big]) .top { grid-template-columns: minmax(0, 1fr); grid-template-areas: "illus" "head" "stats"; justify-items: center; }
  :host([illus-big]) .head { flex-direction: column; align-items: center; text-align: center; width: 100%; }
  :host([illus-big]) .info { align-items: center; width: 100%; }
  :host([illus-big]) .name { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; }
  :host([illus-big]) .status { justify-content: center; flex-wrap: wrap; }
  :host([illus-big]) .status span:last-child { white-space: normal; overflow: visible; text-overflow: clip; }
  :host([illus-big]) .stats { justify-self: stretch; width: 100%; }
}

/* Icon colors for power, yesterday energy, today energy and temperature */
.lbl ha-icon[icon="mdi:flash"] {
  color: #ffb74d !important;
}
.lbl ha-icon[icon="mdi:history"] {
  color: #64b5f6 !important;
}
.lbl ha-icon[icon="mdi:lightning-bolt-circle"] {
  color: #00e676 !important;
}
.lbl ha-icon[icon="mdi:thermometer"] {
  color: #00e5ff !important;
}

.fr-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 6px;
  padding: 1.5px 7px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 11px;
  background: rgba(0, 229, 255, 0.12);
  color: #00e5ff;
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);
}
.fr-pill ha-icon { --mdc-icon-size: 12px; color: #00e5ff; }
.fr-pill.warn {
  background: rgba(244, 67, 54, 0.15);
  color: #ff5252;
  border-color: rgba(244, 67, 54, 0.4);
  box-shadow: 0 0 8px rgba(244, 67, 54, 0.25);
}
.fr-pill.warn ha-icon { color: #ff5252; }

.right-col { display: contents; }

/* Split Layout: Full height appliance on left, compact stacked telemetry on right */
.wrap.layout-split {
  padding: 8px 9px 8px 8px;
}
.wrap.layout-split .top {
  display: grid !important;
  grid-template-columns: 74px minmax(0, 1fr) !important;
  grid-template-areas: "illus right" !important;
  column-gap: 8px !important;
  row-gap: 0 !important;
  align-items: stretch !important;
}
.wrap.layout-split .illus {
  grid-area: illus !important;
  width: 78px !important;
  height: 100% !important;
  min-height: 126px !important;
  max-height: 136px !important;
  padding: 0px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.32) 75%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.4) !important;
}
.wrap.layout-split .illus svg {
  width: 100% !important;
  height: 100% !important;
  max-height: 132px !important;
  transform: scale(1.18);
  transform-origin: center center;
  transition: transform .3s ease;
}
.wrap.layout-split.k-fridge .illus svg {
  transform: scale(1.30);
  transform-origin: center center;
}
.wrap.layout-split.k-dishwasher .illus svg {
  transform: scale(1.22);
  transform-origin: center center;
}
.wrap.layout-split.k-washer .illus svg, .wrap.layout-split.k-dryer .illus svg {
  transform: scale(1.18);
  transform-origin: center center;
}
.wrap.layout-split .right-col {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 4px !important;
  min-width: 0 !important;
}
.wrap.layout-split .head {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
  min-width: 0 !important;
}
.wrap.layout-split .name {
  font-size: 13.5px !important;
  font-weight: 800 !important;
  line-height: 1.15 !important;
}
.wrap.layout-split .status {
  font-size: 10.5px !important;
  gap: 3px !important;
  flex-wrap: wrap !important;
}
.wrap.layout-split .fr-pill {
  padding: 0.5px 4px !important;
  font-size: 9px !important;
  margin-left: 0 !important;
  margin-top: 2px !important;
}
.wrap.layout-split .stats {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  width: 100% !important;
}
.wrap.layout-split .tile {
  padding: 4px 6px !important;
  border-radius: 8px !important;
}
.wrap.layout-split .val {
  font-size: 11.5px !important;
  font-weight: 700 !important;
  line-height: 1.1 !important;
}
.wrap.layout-split .lbl {
  font-size: 8px !important;
  gap: 2.5px !important;
  line-height: 1 !important;
  margin-top: 1.5px !important;
}

﻿/* ---------- illustration: shared ---------- */
.lcd { font: 700 8.5px ui-monospace, "Courier New", monospace; letter-spacing: .25px; fill: #7ec8e3 !important; font-weight: 700; dominant-baseline: central; transition: fill .3s; }
.active .lcd { fill: var(--ac-lcd, #38d9ff) !important; }
.st-finished .lcd { fill: #3ddc84 !important; }
.k-oven .lcd, .k-microwave .lcd { fill: #6fd8ff !important; }
.k-fridge .lcd { font-size: 11.5px !important; font-weight: 800 !important; fill: var(--ac-lcd, #38d9ff) !important; opacity: 1 !important; }
.warm .fr-temp { fill: var(--ac-alert, #ff3b30) !important; }
.led { fill: #5a636d; transition: fill .3s; }
.ph-wash .l1, .ph-heat .l1, .ph-dry .l1, .k-dishwasher.active .l1, .k-oven.active .l1,
.ph-rinse .l2, .ph-cool .l2, .ph-spin .l3 { fill: var(--ac-lcd); }
.st-finished .l4 { fill: #3ddc84; }
.knob, .drum, .clothes, .bowl, .arm, .needle, .fz-door, .fr-door, .flake { transform-box: view-box; }
.knob { transition: transform .6s; }
.k-washer .knob, .k-dryer .knob { transform-origin: 93px 21px; }
.k-dryer .knob { transform-origin: 27px 21px; }
.k-oven .knob { transform-origin: 24px 21px; }
.k-microwave .knob { transform-origin: 100.5px 88px; }
.active .knob { transform: rotate(120deg); }
.ph-rinse .knob { transform: rotate(170deg); }
.ph-spin .knob { transform: rotate(220deg); }

/* ---------- washer / dryer ---------- */
.drum { transform-origin: 60px 80px; }
.water { opacity: 0; transition: opacity .8s; }
.water path { fill: #3f9fe0; opacity: .5; }
.ph-rinse .water path { fill: #8fd4ff; opacity: .45; }
.ph-wash .water, .ph-rinse .water, .ph-heat .water { opacity: 1; }
.wave { animation: ac-wave 2.4s linear infinite; animation-play-state: paused; }
.ph-wash .wave, .ph-rinse .wave, .ph-heat .wave { animation-play-state: running; }
.ph-rinse .wave { animation-duration: 3.2s; }
.foam circle { fill: #fff; opacity: 0; }
.ph-wash .foam circle, .ph-heat .foam circle { animation: ac-bubble 2.6s ease-in infinite; }
.ph-wash .foam circle:nth-child(2), .ph-heat .foam circle:nth-child(2) { animation-delay: .5s; } .ph-wash .foam circle:nth-child(3), .ph-heat .foam circle:nth-child(3) { animation-delay: 1s; }
.ph-wash .foam circle:nth-child(4), .ph-heat .foam circle:nth-child(4) { animation-delay: 1.5s; } .ph-wash .foam circle:nth-child(5), .ph-heat .foam circle:nth-child(5) { animation-delay: .8s; }
.ph-wash .foam circle:nth-child(6), .ph-heat .foam circle:nth-child(6) { animation-delay: 1.9s; }
.ph-wash .drum, .ph-heat .drum { animation: ac-tumble 3.4s ease-in-out infinite; }
.ph-rinse .drum { animation: ac-tumble 4.6s ease-in-out infinite; }
.ph-spin .drum { animation: ac-rot .32s linear infinite; }
.ph-spin .clothes { opacity: .85; }
.ph-spin .shake { animation: ac-shake .14s linear infinite; }
.k-dryer.ph-dry .drum, .k-dryer.ph-cool .drum { animation: ac-rot 2.8s linear infinite; }
.k-dryer.ph-dry .shake-soft { animation: ac-shake-soft .5s linear infinite; }
.heat { opacity: 0; transition: opacity .8s; }
.k-dryer.ph-dry .heat { opacity: 1; animation: ac-glow 2.2s ease-in-out infinite; }

/* ---------- dishwasher ---------- */
.floorlight { fill: #ff3b30; opacity: 0; transition: opacity .6s; filter: blur(1.5px); }
.k-dishwasher.active .floorlight { opacity: .85; }
.wash-light { opacity: 0; transition: opacity .6s; }
.k-dishwasher.active .wash-light { opacity: 1; }
.arm { transform-origin: 60px 0; transform-box: fill-box; }
.k-dishwasher.ph-heat .wash-light rect { fill: #ff5722; opacity: .28; }
.k-dishwasher.ph-heat .steam-in path { animation: ac-steam 2s ease-out infinite; }
.k-dishwasher.ph-wash .arm, .k-dishwasher.ph-rinse .arm, .k-dishwasher.ph-heat .arm { animation: ac-arm 1.2s linear infinite; }
.k-dishwasher .arm-top { animation-delay: -.4s !important; }
.jets path { stroke: #bfe8ff; stroke-width: 1; stroke-dasharray: 2 4; opacity: 0; fill: none; }
.k-dishwasher.ph-wash .jets path, .k-dishwasher.ph-rinse .jets path, .k-dishwasher.ph-heat .jets path { opacity: .85; animation: ac-jet .5s linear infinite; }
.drops circle { fill: #bfe8ff; opacity: 0; }
.k-dishwasher.ph-wash .drops circle, .k-dishwasher.ph-rinse .drops circle, .k-dishwasher.ph-heat .drops circle { animation: ac-fall 1.1s ease-in infinite; }
.drops circle:nth-child(2) { animation-delay: .3s !important; } .drops circle:nth-child(3) { animation-delay: .6s !important; }
.drops circle:nth-child(4) { animation-delay: .85s !important; }
.steam-in path { fill: none; stroke: #fff; stroke-width: 2.4; stroke-linecap: round; opacity: 0; }
.k-dishwasher.ph-dry .steam-in path, .k-microwave.active .steam-in path { animation: ac-steam 2.6s ease-out infinite; }
.steam-in path:nth-child(2) { animation-delay: .8s !important; } .steam-in path:nth-child(3) { animation-delay: 1.6s !important; }

/* ---------- water heater ---------- */
.needle { transition: transform 1s ease; }
.gauge-txt { font: 700 5px system-ui, sans-serif; fill: #4b545e; }
.hw-led { fill: #9aa2ab; transition: fill .3s; }
.k-water_heater.st-ready .hw-led { fill: #3ddc84; }
.k-water_heater.st-heating .hw-led { fill: #ff8a3d; animation: ac-pulse 1.4s ease-in-out infinite; }
.hw-waves path { fill: none; stroke: var(--ac-heat); stroke-width: 2; stroke-linecap: round; opacity: 0; }
.k-water_heater.st-heating .hw-waves path { animation: ac-steam 2s ease-out infinite; }
.hw-waves path:nth-child(2) { animation-delay: .6s !important; } .hw-waves path:nth-child(3) { animation-delay: 1.2s !important; }

/* ---------- oven / microwave ---------- */
.ilight { opacity: 0; transition: opacity .8s; }
.active .ilight { opacity: .95; }
.element { fill: none; stroke: #5b3d33; stroke-width: 1.6; stroke-linejoin: round; transition: stroke .6s; }
.k-oven.active .element { stroke: #ff5a1f; filter: drop-shadow(0 0 2px #ff7a2e); animation: ac-pulse 1.8s ease-in-out infinite; }
.haze path { fill: none; stroke: #ffd9a8; stroke-width: 1.2; stroke-linecap: round; opacity: 0; }
.k-oven.active .haze path { animation: ac-steam 2.4s ease-out infinite; }
.haze path:nth-child(1) { animation-delay: .4s !important; }
.bowl { transform-origin: 46px 86px; }
.k-microwave.active .bowl { animation: ac-turn 5s linear infinite; }
.start { fill: #c9ced4; stroke: #8f979f; stroke-width: .4; transition: fill .3s; }
.k-microwave.active .start { fill: #3ddc84; }

/* ---------- radiator ---------- */
.k-radiator { --heat: 0; }
.rglow { opacity: 0; transition: opacity 1.2s; }
.k-radiator.st-heating .rglow { opacity: calc(var(--heat) * .55); animation: ac-hob 3s ease-in-out infinite; --lvl: calc(var(--heat) * .55); }
.rwaves path { fill: none; stroke: var(--ac-heat); stroke-width: 1.8; stroke-linecap: round; opacity: 0; }
.k-radiator.st-heating .rwaves path { animation: ac-steam calc(2.6s - var(--heat) * 1.2s) ease-out infinite; }
.rwaves path:nth-child(2) { animation-delay: .5s !important; } .rwaves path:nth-child(3) { animation-delay: 1s !important; } .rwaves path:nth-child(4) { animation-delay: 1.5s !important; }
.micon { fill: #c3c9cf; stroke: #c3c9cf; transition: fill .4s, stroke .4s; }
.micon.m-comfort circle { stroke: none; }
.mode-comfort .m-comfort { fill: #ffb400; stroke: #ffb400; }
.mode-eco .m-eco { fill: #5b7bd5; stroke: #5b7bd5; }
.mode-frost .m-frost { fill: #2b9af9; stroke: #2b9af9; }
.k-radiator .lcd { fill: #ff9a4a; }
.k-radiator.st-off .lcd, .k-radiator.mode-frost .lcd { fill: #6fd8ff; }
.k-radiator.st-heating .l1 { fill: #ff8a3d; } .k-radiator.st-standby .l1 { fill: #3ddc84; }
.cold-air path { fill: none; stroke: #6fbfff; stroke-width: 1.8; stroke-linecap: round; opacity: 0; }
.win-open .cold-air path { animation: ac-wind 1.8s ease-in-out infinite; }
.cold-air path:nth-child(2) { animation-delay: -.6s !important; } .cold-air path:nth-child(3) { animation-delay: -1.2s !important; }
@keyframes ac-wind { 0% { opacity: 0; transform: translateX(-6px); } 40% { opacity: .9; } 100% { opacity: 0; transform: translateX(14px); } }

/* ---------- cooktop ---------- */
.zone { --lvl: 0; }
.k-hob.st-residual .dot { background: var(--ac-heat); opacity: .6; }
.zglow { opacity: var(--lvl); transition: opacity .8s; }
.zone.on .zglow { animation: ac-hob 2.2s ease-in-out infinite; }
.coil { opacity: 0; transition: opacity .8s; }
.zone.on .coil { opacity: calc(var(--lvl) * .9); }
.zone.res .coil { opacity: .12; }
.zd { font: 700 5.5px "Courier New", ui-monospace, monospace; fill: #4a1d14; }
.zd.on { fill: #ff4a1f; filter: drop-shadow(0 0 1px #ff5a1f); }
.steam-pot path { fill: none; stroke: #ffffff; stroke-width: 2.2; stroke-linecap: round; opacity: 0; }
.pot-on .steam-pot path { animation: ac-steam 2.6s ease-out infinite; }
.pot-boil .steam-pot path { animation-duration: 1.4s; }
.steam-pot path:nth-child(2) { animation-delay: .8s !important; } .steam-pot path:nth-child(3) { animation-delay: 1.6s !important; }
.lid { transform-box: view-box; transform-origin: 40px 80px; }
.pot-boil .lid { animation: ac-lid .35s steps(2) infinite; }
.sizzle path { fill: none; stroke: #f2c94c; stroke-width: .8; stroke-linecap: round; opacity: 0; }
.pan-on .sizzle path { animation: ac-pulse .5s steps(2) infinite; }
.sizzle path:nth-child(2n) { animation-delay: -.25s !important; }
@keyframes ac-hob { 0%, 100% { opacity: var(--lvl); } 50% { opacity: calc(var(--lvl) * .78); } }
@keyframes ac-lid { 0% { transform: translateY(0) rotate(0); } 100% { transform: translateY(-.8px) rotate(-1.5deg); } }

/* ---------- VMC (bathroom extractor fan) ---------- */
.k-vmc .illus { padding: 0; overflow: hidden; }
.fanv { transform-box: view-box; transform-origin: 60px 70px; }
.k-vmc.st-speed1 .fanv { animation: ac-rot 1.1s linear infinite; }
.k-vmc.st-speed2 .fanv { animation: ac-rot .28s linear infinite; }
.intake path { fill: none; stroke: #8fb6d8; stroke-width: 1.5; stroke-linecap: round; opacity: 0; transform-box: view-box; transform-origin: 60px 70px; }
.k-vmc.st-speed1 .intake path { animation: ac-suck 2.4s ease-in infinite; }
.k-vmc.st-speed2 .intake path { animation: ac-suck 1s ease-in infinite; }
.intake path:nth-child(2) { animation-delay: -.5s !important; } .intake path:nth-child(3) { animation-delay: -1s !important; }
.intake path:nth-child(4) { animation-delay: -1.5s !important; } .intake path:nth-child(5) { animation-delay: -2s !important; }
.k-vmc.st-speed2 .intake path:nth-child(n) { animation-delay: calc(var(--i, 0) * -.2s); }
.steam path { fill: none; stroke: #ffffff; stroke-width: 3; stroke-linecap: round; opacity: 0; }
.humid .steam path { animation: ac-steam 2.8s ease-out infinite; }
.steam path:nth-child(2) { animation-delay: .9s !important; } .steam path:nth-child(3) { animation-delay: 1.8s !important; }
.condensation path { fill: #9fd6ff; opacity: 0; transition: opacity 1s; }
.humid .condensation path { opacity: .9; animation: ac-drip 3s ease-in infinite; }
.condensation path:nth-child(2n) { animation-delay: -1.4s !important; } .condensation path:nth-child(3n) { animation-delay: -2.1s !important; }
@keyframes ac-suck { 0% { opacity: 0; transform: scale(1.25); } 30% { opacity: .85; } 100% { opacity: 0; transform: scale(.45); } }
@keyframes ac-drip { 0%, 60% { transform: translateY(0); } 100% { transform: translateY(5px); opacity: .2; } }

/* ---------- solar ---------- */
.k-solar { --sun: 0; }
.sunwrap { transform-box: view-box; transform-origin: 98px 20px; transform: scale(calc(.7 + var(--sun) * .45)); transition: transform 1s, opacity 1s, filter 1s; }
.k-solar:not(.st-producing):not(.st-low) .sunwrap { filter: grayscale(1) brightness(.85); opacity: .45; transform: scale(.75); }
.k-solar:not(.st-producing):not(.st-low) .sunwrap > circle:first-child { opacity: 0; }
.rays { transform-box: view-box; transform-origin: 98px 20px; }
.k-solar.st-producing .rays { animation: ac-rot 18s linear infinite; }
.k-solar.st-low .rays { animation: ac-rot 40s linear infinite; }
.panshade { opacity: 0; transition: opacity 1s; }
.k-solar:not(.st-producing):not(.st-low) .panshade { opacity: .35; }
.sweep { transform-box: view-box; opacity: 0; }
.k-solar.st-producing .sweep { opacity: 1; animation: ac-sweep 3.2s ease-in-out infinite; }
.panglow { opacity: 0; transition: opacity 1s; }
.k-solar.st-producing .panglow { opacity: calc(var(--sun) * .22); }
.sflow { fill: none; stroke: #ffd23f; stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 2 3; opacity: 0; }
.k-solar.st-producing .sflow, .k-solar.st-low .sflow { opacity: 1; animation: ac-flow calc(1.4s / (var(--sun) + .35)) linear infinite; }
.k-solar.st-producing .l1, .k-solar.st-low .l1 { fill: #3ddc84; }
.k-solar .lcd { font-size: 5.4px; }
.k-solar:not(.st-producing):not(.st-low) .lcd { fill: #24404f; }
@keyframes ac-sweep { 0% { transform: skewX(-18deg) translateX(0); } 60%, 100% { transform: skewX(-18deg) translateX(130px); } }

/* ---------- freezers ---------- */
.k-chest_freezer .flake, .k-drawer_freezer .flake { transform-box: view-box; }
.k-chest_freezer .flake { transform-origin: 72px 84.5px; }
.k-drawer_freezer .flake { transform-origin: 39.5px 18px; }
.k-chest_freezer .lcd, .k-drawer_freezer .lcd { fill: #6fd8ff; }
.warm.k-chest_freezer .lcd, .warm.k-drawer_freezer .lcd { fill: var(--ac-alert); }
.k-chest_freezer.st-cooling .l1, .k-drawer_freezer.st-cooling .l1 { fill: #3ddc84; }
.warm.k-chest_freezer .l2, .warm.k-drawer_freezer .l2 { fill: var(--ac-alert); }
.lid path { transition: d .9s cubic-bezier(.3,.7,.3,1), fill .4s; }
.lid-top { d: path("M8 66L100 66L112 54L20 54Z"); }
.lid-front { d: path("M8 66L100 66L100 73L8 73Z"); }
.lid-side { d: path("M100 66L112 54L112 61L100 73Z"); }
.lid-under { d: path("M20 54L112 54L112 54L20 54Z"); opacity: 0; transition: d .9s cubic-bezier(.3,.7,.3,1), opacity .3s; }
.door-open .lid-top { d: path("M22 61L110 61L110 61L22 61Z"); }
.door-open .lid-front { d: path("M16 6L108 6L108 1L16 1Z"); }
.door-open .lid-side { d: path("M110 61L108 6L114 3L116 58Z"); }
.door-open .lid-under { d: path("M22 61L110 61L108 6L16 6Z"); opacity: 1; }
.lid-handle { transition: opacity .3s; }
.door-open .lid-handle { opacity: 0; }
.cavity { opacity: 0; transition: opacity .5s .2s; }
.door-open .cavity { opacity: 1; }
.clight { opacity: 0; }
.door-open .clight { opacity: .3; }
.cold-out circle, .drawer-mist circle { fill: #dff3ff; opacity: 0; }
.door-open .cold-out circle, .door-open .drawer-mist circle { animation: ac-steam 2.6s ease-out infinite; }
.cold-out circle:nth-child(2), .drawer-mist circle:nth-child(2) { animation-delay: .7s !important; }
.cold-out circle:nth-child(3), .drawer-mist circle:nth-child(3) { animation-delay: 1.4s !important; }
.cold-out circle:nth-child(4) { animation-delay: 2s !important; }
.dz-door { transform-box: view-box; transform-origin: 26px 0; transition: transform .6s cubic-bezier(.3,.7,.3,1); }
.door-open .dz-door { transform: scaleX(.16) skewY(-6deg); }
.drawer { transform-box: view-box; transform-origin: 60px 56px; transition: transform .6s ease; }
.door-open .pull { transform: translateY(3px) scale(1.09); transition-delay: .35s; filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }

/* ---------- 3D printer ---------- */
.k-printer_3d { --fil: #ff8a1f; --h: 0; }
.k-printer_3d .gantry { transform-box: view-box; transform: translateY(calc(var(--h) * -1px)); transition: transform .8s ease; }
.k-printer_3d .head { transform-box: view-box; }
.k-printer_3d.st-printing .head { animation: ac-printx 1.1s ease-in-out infinite alternate; }
.k-printer_3d.st-printing .hfan, .k-printer_3d.st-heating .hfan { transform-box: view-box; transform-origin: 60px 90px; animation: ac-rot .25s linear infinite; }
.spool { transform-box: view-box; transform-origin: 97px 20px; }
.k-printer_3d.st-printing .spool { animation: ac-rot 9s linear infinite; }
.tip { fill: #8a6d1f; transition: fill .4s; }
.k-printer_3d.st-printing .tip { fill: #ffd27a; filter: drop-shadow(0 0 1.5px #ffb347); }
.k-printer_3d.st-heating .tip { fill: #ff4a1f; filter: drop-shadow(0 0 2px #ff5a1f); animation: ac-pulse 1s ease-in-out infinite; }
.bedheat path { fill: none; stroke: var(--ac-heat); stroke-width: 1.4; stroke-linecap: round; opacity: 0; }
.k-printer_3d.st-heating .bedheat path { animation: ac-steam 1.8s ease-out infinite; }
.bedheat path:nth-child(2) { animation-delay: .45s !important; } .bedheat path:nth-child(3) { animation-delay: .9s !important; } .bedheat path:nth-child(4) { animation-delay: 1.35s !important; }
.k-printer_3d.indeterminate.st-printing .gantry { transition: none; animation: ac-zrise 14s linear infinite; }
.k-printer_3d.indeterminate.st-printing .object { transform-box: view-box; transform-origin: 60px 104px; animation: ac-grow 14s linear infinite; }
.k-printer_3d.indeterminate.st-printing .objclip { transform: none; }
.k-printer_3d.indeterminate .objclip { y: 66px; height: 38px; }
.k-printer_3d.st-paused .lcd { animation: ac-pulse 1s steps(2) infinite; }
.k-printer_3d.st-failed .lcd { fill: var(--ac-alert); }
.k-printer_3d.st-printing .l1 { fill: #3ddc84; } .k-printer_3d.st-heating .l1 { fill: #ff8a3d; } .k-printer_3d.st-failed .l1 { fill: var(--ac-alert); }
.k-printer_3d.st-failed .dot { background: var(--ac-alert); }
@keyframes ac-printx { from { transform: translateX(-11px); } to { transform: translateX(11px); } }
@keyframes ac-zrise { from { transform: translateY(0); } to { transform: translateY(-38px); } }
@keyframes ac-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }

/* ---------- pool pump ---------- */
.k-pool_pump { --spd: 1; }
.flow { fill: none; stroke: #36b4f5; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 3 5; opacity: 0; transition: opacity .6s; }
.k-pool_pump.st-filtering .flow { opacity: .95; animation: ac-flow calc(.7s / var(--spd)) linear infinite; }
.fan { transform-box: view-box; transform-origin: 104px 74px; }
.k-pool_pump.st-filtering .fan { animation: ac-rot calc(.22s / var(--spd)) linear infinite; }
.swirl { transform-box: view-box; transform-origin: 30px 68px; }
.k-pool_pump.st-filtering .swirl { animation: ac-rot calc(2.4s / var(--spd)) linear infinite; }
.ripple { animation: ac-ripple 6s linear infinite; }
.k-pool_pump.st-filtering .ripple { animation-duration: 3s; }
.bubbles circle { fill: #fff; opacity: 0; }
.k-pool_pump.st-filtering .bubbles circle { animation: ac-jetbub calc(1.4s / var(--spd)) ease-out infinite; }
.bubbles circle:nth-child(2) { animation-delay: -.35s !important; } .bubbles circle:nth-child(3) { animation-delay: -.7s !important; } .bubbles circle:nth-child(4) { animation-delay: -1.05s !important; }
.k-pool_pump.st-filtering .hum { animation: ac-shake-soft .18s linear infinite; }
.k-pool_pump.st-filtering .l1 { fill: #3ddc84; }
.k-pool_pump .lcd { font-size: 6.4px; }
@keyframes ac-flow { to { stroke-dashoffset: -16; } }
@keyframes ac-ripple { from { transform: translateX(0); } to { transform: translateX(20px); } }
@keyframes ac-jetbub { 0% { opacity: 0; transform: translate(0, 0); } 25% { opacity: .9; } 100% { opacity: 0; transform: translate(-14px, -6px); } }

/* ---------- pellet stove ---------- */
.k-pellet_stove .fire { transform-box: view-box; transform-origin: 60px 87px; transform: scale(var(--fs, 1)); opacity: 0; transition: opacity .8s, transform 1s ease; }
.k-pellet_stove.st-heating .fire { opacity: 1; }
.k-pellet_stove.st-ignition .fire { opacity: .9; transform: scale(.32); }
.flame { transform-box: fill-box; transform-origin: 50% 100%; }
.k-pellet_stove.st-heating .flame, .k-pellet_stove.st-ignition .flame { animation: ac-flick .8s ease-in-out infinite alternate; }
.flame.f2 { animation-duration: .62s !important; } .flame.f3 { animation-duration: .71s !important; animation-delay: -.3s !important; }
.flame.f4 { animation-duration: .5s !important; } .flame.f5 { animation-duration: 1.1s !important; animation-delay: -.5s !important; }
.k-pellet_stove .glow { opacity: 0; transition: opacity 1s; }
.k-pellet_stove.st-heating .glow { opacity: 1; animation: ac-glow 1.6s ease-in-out infinite; }
.k-pellet_stove.st-ignition .glow { opacity: .35; }
.k-pellet_stove.st-extinguishing .glow { opacity: .2; }
.embers circle { fill: #ff8a2a; opacity: 0; }
.k-pellet_stove.st-heating .embers circle, .k-pellet_stove.st-ignition .embers circle { opacity: 1; animation: ac-pulse 1.3s ease-in-out infinite; }
.k-pellet_stove.st-extinguishing .embers circle { opacity: .7; fill: #d2511a; animation: ac-pulse 3s ease-in-out infinite; }
.embers circle:nth-child(2) { animation-delay: -.4s !important; } .embers circle:nth-child(4) { animation-delay: -.8s !important; }
.igniter { fill: #5a2a20; }
.k-pellet_stove.st-ignition .igniter { fill: #ff3b1a; filter: drop-shadow(0 0 2px #ff5a1f); animation: ac-pulse .9s ease-in-out infinite; }
.smoke-in path, .flue-smoke path { fill: none; stroke: #c9ced4; stroke-width: 2.2; stroke-linecap: round; opacity: 0; }
.k-pellet_stove.st-ignition .smoke-in path, .k-pellet_stove.st-extinguishing .smoke-in path { animation: ac-steam 2.4s ease-out infinite; }
.k-pellet_stove.st-ignition .flue-smoke path { animation: ac-steam 2.2s ease-out infinite; }
.smoke-in path:nth-child(2), .flue-smoke path:nth-child(2) { animation-delay: 1.1s !important; }
.warm-air path { fill: none; stroke: var(--ac-heat); stroke-width: 1.6; stroke-linecap: round; opacity: 0; }
.k-pellet_stove.st-heating .warm-air path { animation: ac-steam 2s ease-out infinite; }
.warm-air path:nth-child(2) { animation-delay: .5s !important; } .warm-air path:nth-child(3) { animation-delay: 1s !important; } .warm-air path:nth-child(4) { animation-delay: 1.5s !important; }
.k-pellet_stove .lcd { fill: #ff9a4a; }
.k-pellet_stove.st-off .lcd, .k-pellet_stove.st-standby .lcd { fill: #6fd8ff; }
.k-pellet_stove.st-alarm .dot { background: var(--ac-alert); }
.k-pellet_stove.st-alarm .status { color: var(--ac-alert); font-weight: 600; }
.k-pellet_stove.st-alarm .lcd { fill: var(--ac-alert); animation: ac-pulse .8s steps(2) infinite; }
.k-pellet_stove.st-heating .l1, .k-pellet_stove.st-ignition .l1 { fill: #ff8a3d; }
@keyframes ac-flick { 0% { transform: scale(1, 1) skewX(0deg); } 35% { transform: scale(.94, 1.08) skewX(3deg); } 70% { transform: scale(1.04, .93) skewX(-2deg); } 100% { transform: scale(.97, 1.04) skewX(1.5deg); } }

/* ---------- fridge ---------- */
.fz-door, .fr-door { transform-origin: 26px 0; transition: transform .6s cubic-bezier(.3,.7,.3,1); }
.door-open .fr-door { transform: scaleX(.16) skewY(-6deg); }
.fz-open .fz-door { transform: scaleX(.16) skewY(-6deg); }
/* variantes : French door / américain (porte droite pivotant à droite), tiroirs de congélation */
.k-fridge .fr-l { transform-origin: 16px 0; }
.k-fridge .fz-l { transform-origin: 12px 0; }
.k-fridge .fr-r { transform-origin: 108px 0; }
.door-open .fr-r { transform: scaleX(.16) skewY(6deg); }
.fz-open .fz-r { transform: scaleX(.16) skewY(6deg); }
.fzd { transform-box: view-box; transform-origin: 60px 96px; transition: transform .6s ease, filter .6s; }
.fz-open .fzd-pull { transform: translateY(5px) scale(1.06); filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }
/* distributeur glaçons / eau du modèle américain */
.ib-light { opacity: .15; transition: opacity .6s; }
.k-fridge.st-cooling .ib-light { opacity: .9; animation: ac-pulse 3s ease-in-out infinite; }
.ib-drop { opacity: 0; }
.k-fridge.st-cooling .ib-drop { animation: ac-fall 2.6s ease-in infinite; }
.flight { transition: opacity .4s; } .door-open .flight { opacity: .35; }
.flake { stroke: var(--ac-cold); transform-origin: 39.5px 60px; }
.k-fridge.st-cooling .flake, .k-chest_freezer.st-cooling .flake, .k-drawer_freezer.st-cooling .flake { animation: ac-pulse 2.4s ease-in-out infinite; }
.mist circle { fill: #9fd6ff; opacity: 0; }
.k-fridge.st-cooling .mist circle, .k-chest_freezer.st-cooling .mist circle, .k-drawer_freezer.st-cooling .mist circle { animation: ac-mist 3s ease-out infinite; }
.mist circle:nth-child(2) { animation-delay: .7s !important; } .mist circle:nth-child(3) { animation-delay: 1.4s !important; }
.mist circle:nth-child(4) { animation-delay: 2.1s !important; }

@keyframes ac-rot { to { transform: rotate(360deg); } }
@keyframes ac-tumble { 0% { transform: rotate(0); } 42% { transform: rotate(250deg); } 50% { transform: rotate(250deg); } 92% { transform: rotate(0); } 100% { transform: rotate(0); } }
@keyframes ac-wave { from { transform: translateX(0); } to { transform: translateX(-40px); } }
@keyframes ac-bubble { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-10px); } }
@keyframes ac-shake { 0%,100% { transform: translate(0,0); } 25% { transform: translate(.6px,-.3px); } 50% { transform: translate(-.5px,.3px); } 75% { transform: translate(.4px,.4px); } }
@keyframes ac-shake-soft { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-.3px); } }
@keyframes ac-glow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
@keyframes ac-arm { 0% { transform: scaleX(1); } 25% { transform: scaleX(.08); } 50% { transform: scaleX(1); } 75% { transform: scaleX(.08); } 100% { transform: scaleX(1); } }
@keyframes ac-jet { to { stroke-dashoffset: -12; } }
@keyframes ac-fall { 0% { opacity: 0; transform: translateY(0); } 25% { opacity: .9; } 100% { opacity: 0; transform: translateY(16px); } }
@keyframes ac-steam { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: .55; } 100% { opacity: 0; transform: translateY(-8px); } }
@keyframes ac-pulse { 0%,100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes ac-turn { 0% { transform: translateX(0) scaleX(1); } 25% { transform: translateX(7px) scaleX(.86); } 50% { transform: translateX(0) scaleX(1); } 75% { transform: translateX(-7px) scaleX(.86); } 100% { transform: translateX(0) scaleX(1); } }
@keyframes ac-mist { 0% { opacity: 0; transform: translate(0,0); } 30% { opacity: .8; } 100% { opacity: 0; transform: translate(4px,3px); } }

/* ---------- air fryer ---------- */
.k-air_fryer .lcd { fill: #3b2c22; }
.k-air_fryer.active .lcd { fill: #ff9a4a; }
.k-air_fryer.st-finished .lcd { fill: #3ddc84; }
.k-air_fryer.active .l1 { fill: #ff9a4a; animation: ac-pulse 1.6s ease-in-out infinite; }
.af-coil { fill: none; stroke: #4a3a33; stroke-width: 1.1; stroke-linejoin: round; transition: stroke .6s; }
.k-air_fryer.active .af-coil { stroke: #ff5a1f; filter: drop-shadow(0 0 1.5px #ff7a2e); animation: ac-pulse 1.6s ease-in-out infinite; }
.af-air path { fill: none; stroke: #ffe2b8; stroke-width: 1; stroke-linecap: round; stroke-dasharray: 3 5; opacity: 0; transition: opacity .6s; }
.k-air_fryer.active .af-air path { opacity: .75; animation: ac-flow .7s linear infinite; }
.k-air_fryer.active .af-air path:nth-child(2) { animation-duration: .9s; animation-direction: reverse; }
.fries, .nuggets { transform-box: fill-box; transform-origin: 50% 100%; transition: filter 1s; }
.k-air_fryer.active .fries { animation: af-toss 1.3s ease-in-out infinite; }
.k-air_fryer.active .nuggets { animation: af-toss 1.3s ease-in-out infinite; animation-delay: -.65s; }
.k-air_fryer.st-finished .fries, .k-air_fryer.st-finished .nuggets { filter: saturate(1.25) brightness(.88); }
.af-steam path { fill: none; stroke: #cfd6dd; stroke-width: 2; stroke-linecap: round; opacity: 0; }
.k-air_fryer.active .af-steam path { animation: ac-steam 2.4s ease-out infinite; }
.af-steam path:nth-child(2) { animation-delay: .8s !important; } .af-steam path:nth-child(3) { animation-delay: 1.6s !important; }
@keyframes af-toss { 0%, 100% { transform: translateY(0) rotate(0); } 30% { transform: translateY(-2.2px) rotate(-2deg); } 60% { transform: translateY(-.6px) rotate(1.5deg); } }

/* ---------- coffee maker ---------- */
.cf-level { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease; }
.s-filtre { --cf-fill: 40s; } .s-dosette { --cf-fill: 16s; } .s-expresso { --cf-fill: 14s; }
.k-coffee_maker.st-keep_warm .cf-level { transform: scaleY(.8); }
.k-coffee_maker.st-brewing .cf-level { animation: cf-fill var(--cf-fill) cubic-bezier(.2,.6,.4,1) forwards; }
.cf-water { transform-box: fill-box; transform-origin: 50% 100%; }
.k-coffee_maker.st-brewing .cf-water { animation: cf-drain var(--cf-fill) linear forwards; }
.k-coffee_maker.st-keep_warm .cf-water { transform: scaleY(.3); }
.cf-stream { fill: none; stroke: #5a3417; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 4 2; opacity: 0; transition: opacity .4s; }
.k-coffee_maker.st-brewing .cf-stream { opacity: .95; animation: cf-flow .45s linear infinite; }
.cf-drip circle { fill: #4a2a14; opacity: 0; }
.k-coffee_maker.st-brewing .cf-drip circle { animation: cf-drop 1.1s ease-in infinite; }
.cf-drip circle:nth-child(2) { animation-delay: .37s !important; } .cf-drip circle:nth-child(3) { animation-delay: .74s !important; }
.cf-plate { fill: #3a3232; transition: fill .6s; }
.k-coffee_maker.st-brewing .cf-plate, .k-coffee_maker.st-keep_warm .cf-plate { fill: #ff5a1f; filter: drop-shadow(0 0 2px #ff7a2e); animation: ac-pulse 1.8s ease-in-out infinite; }
.cf-led { fill: #3a424b; transition: fill .3s; }
.k-coffee_maker.st-ready .cf-led { fill: #3ddc84; }
.k-coffee_maker.st-keep_warm .cf-led { fill: #ff8a3d; }
.k-coffee_maker.st-brewing .cf-led { fill: #38d9ff; animation: ac-pulse 1s ease-in-out infinite; }
.k-coffee_maker.st-ready .lcd { fill: #3ddc84; }
.cf-steam path { fill: none; stroke: #cfd6dd; stroke-width: 2; stroke-linecap: round; opacity: 0; }
.k-coffee_maker.st-brewing .cf-steam path, .k-coffee_maker.st-keep_warm .s-filtre .cf-steam path { animation: ac-steam 2.4s ease-out infinite; }
.cf-steam path:nth-child(2) { animation-delay: 1.1s !important; }
.k-coffee_maker.st-brewing .s-expresso .cf-body { animation: ac-shake-soft .45s linear infinite; }
@keyframes cf-fill { from { transform: scaleY(0); } to { transform: scaleY(.85); } }
@keyframes cf-drain { from { transform: scaleY(1); } to { transform: scaleY(.3); } }
@keyframes cf-flow { to { stroke-dashoffset: -12; } }
@keyframes cf-drop { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: .95; } 100% { opacity: .9; transform: translateY(26px); } }

/* ---------- TV (wall-mounted) ---------- */
.k-tv svg { overflow: visible; }
.tv-content { opacity: 0; transition: opacity .5s; }
.k-tv.st-screen_on .tv-content { opacity: 1; }
.tv-row { animation: tv-row 12s ease-in-out infinite; animation-play-state: paused; }
.tv-row2 { animation: tv-row2 16s ease-in-out infinite; animation-play-state: paused; }
.tv-sel { animation: tv-sel 12s ease-in-out infinite; animation-play-state: paused; }
.k-tv.st-screen_on .tv-row, .k-tv.st-screen_on .tv-row2, .k-tv.st-screen_on .tv-sel { animation-play-state: running; }
.tv-intro { opacity: 0; transform-box: view-box; transform-origin: 60px 69.5px; pointer-events: none; }
.tv-boot .tv-intro { animation: tv-intro 3.2s both; }
.tv-streaks path { stroke-width: 1.4; stroke-dasharray: 70; stroke-dashoffset: 70; }
.tv-boot .tv-streaks path { animation: tv-streak 3.2s ease-out both; }
.tv-logo { transform-box: fill-box; transform-origin: center; opacity: 0; }
.tv-boot .tv-logo { animation: tv-logo 3.2s cubic-bezier(.3,1.4,.5,1) both; }
.tv-boot .tv-content { animation: tv-reveal 3.2s both; }
.tv-flash { opacity: 0; transform-box: view-box; transform-origin: 60px 69.5px; }
.tv-shut .tv-flash { animation: tv-shut .9s ease-in both; }
.tv-gloss { transition: opacity .5s; }
.k-tv.st-screen_on .tv-gloss { opacity: .35; }
.tv-led { fill: #3a2222; transition: fill .4s; }
.k-tv.st-standby .tv-led { fill: #ff3b30; filter: drop-shadow(0 0 1.2px #ff3b30); }
.k-tv.st-screen_on .tv-led { fill: #ffffff; opacity: .45; }
@keyframes tv-row { 0%, 20% { transform: translateX(0); } 30%, 55% { transform: translateX(-19px); } 65%, 90% { transform: translateX(-38px); } 100% { transform: translateX(0); } }
@keyframes tv-row2 { 0%, 40% { transform: translateX(0); } 55%, 90% { transform: translateX(-26px); } 100% { transform: translateX(0); } }
@keyframes tv-sel { 0%, 8% { transform: translateX(0); } 12%, 20% { transform: translateX(19px); } 24%, 90% { transform: translateX(38px); } 95%, 100% { transform: translateX(0); } }
@keyframes tv-intro { 0% { opacity: 1; transform: scale(.02, .015); filter: brightness(4); } 10% { opacity: 1; transform: scale(1, .015); filter: brightness(4); } 22% { opacity: 1; transform: none; filter: none; } 84% { opacity: 1; } 100% { opacity: 0; } }
@keyframes tv-streak { 0%, 18% { stroke-dashoffset: 70; opacity: 1; } 42% { stroke-dashoffset: 0; opacity: 1; } 55%, 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes tv-logo { 0%, 36% { opacity: 0; transform: scale(.3); } 50% { opacity: 1; transform: scale(1.12); } 58% { transform: scale(1); } 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
@keyframes tv-reveal { 0%, 84% { opacity: 0; } 100% { opacity: 1; } }
@keyframes tv-shut { 0% { opacity: .85; transform: scale(1, 1); } 45% { opacity: 1; transform: scale(1, .015); } 75% { opacity: 1; transform: scale(.03, .015); } 100% { opacity: 0; transform: scale(0, 0); } }

/* ---------- range hood ---------- */
.hd-fan { transform-box: view-box; transform-origin: 60px 60px; }
.k-range_hood.st-speed1 .hd-fan { animation: ac-rot .9s linear infinite; }
.k-range_hood.st-speed2 .hd-fan { animation: ac-rot .28s linear infinite; }
.hd-air path { fill: none; stroke: #cfe6ff; stroke-width: 1.3; stroke-linecap: round; stroke-dasharray: 3 5; opacity: 0; transition: opacity .6s; }
.k-range_hood.st-speed1 .hd-air path { opacity: .55; animation: hd-up 1.4s linear infinite; }
.k-range_hood.st-speed2 .hd-air path { opacity: .8; animation: hd-up .6s linear infinite; }
.hd-steam path { transform-box: fill-box; transform-origin: 50% 100%; fill: none; stroke: #e3e8ed; stroke-width: 2.2; stroke-linecap: round; opacity: 0; }
.k-range_hood.st-speed1 .hd-steam path, .k-range_hood.st-speed2 .hd-steam path { animation: hd-suck 2s ease-in infinite; }
.k-range_hood.st-speed2 .hd-steam path { animation-duration: 1.2s; }
.hd-steam path:nth-child(2) { animation-delay: .5s !important; } .hd-steam path:nth-child(3) { animation-delay: 1s !important; }
.hd-led { fill: #59616b; transition: fill .3s; }
.k-range_hood.st-speed1 .s1, .k-range_hood.st-speed2 .s1, .k-range_hood.st-speed2 .s2, .k-range_hood.st-speed2 .s3 { fill: #38d9ff; }
.k-range_hood.lights-on .lt { fill: #ffd76a; }
.hd-lamp { fill: #6b737c; transition: fill .4s; }
.k-range_hood.lights-on .hd-lamp { fill: #fff6d5; filter: drop-shadow(0 0 2px #ffe9a0); }
.hd-beam { opacity: 0; transition: opacity .6s; }
.k-range_hood.lights-on .hd-beam { opacity: 1; }
.hd-zone { fill: none; stroke: #ff5a1f; stroke-width: 1; opacity: 0; transition: opacity .6s; }
.k-range_hood.st-speed1 .hd-zone, .k-range_hood.st-speed2 .hd-zone { opacity: .85; filter: drop-shadow(0 0 1.5px #ff7a2e); }
@keyframes hd-up { to { stroke-dashoffset: -16; } }
@keyframes hd-suck { 0% { opacity: 0; transform: translateY(2px) scaleX(1); } 30% { opacity: .7; } 100% { opacity: 0; transform: translateY(-14px) scaleX(.5); } }

/* ---------- air conditioning: indoor split ---------- */
.k-ac_split { --acc: #9aa3ad; }
.k-ac_split.st-cooling { --acc: #4fc3f7; } .k-ac_split.st-heating { --acc: #ff8a3d; }
.k-ac_split.st-ac_dry { --acc: #7fd6c0; } .k-ac_split.st-ac_fan { --acc: #cfd6dd; } .k-ac_split.st-at_target { --acc: #9fd3f0; }
.ac-flap { transform-box: view-box; transform-origin: 60px 74px; transition: transform .9s cubic-bezier(.3,1.3,.5,1); }
.ac-slot { opacity: 0; transition: opacity .6s; }
.k-ac_split:not(.st-off):not(.st-unavailable) .ac-flap { transform: translateY(4.5px) scaleY(.75); }
.k-ac_split:not(.st-off):not(.st-unavailable) .ac-slot { opacity: 1; }
.k-ac_split.st-cooling .ac-flap, .k-ac_split.st-heating .ac-flap { animation: ac-swing 6s ease-in-out infinite; }
.ac-air path { fill: none; stroke: var(--acc); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 5 7; opacity: 0; transition: opacity .8s; }
.k-ac_split.st-cooling .ac-air path, .k-ac_split.st-heating .ac-air path, .k-ac_split.st-ac_fan .ac-air path { opacity: .75; animation: ac-blow 1s linear infinite; }
.k-ac_split.st-ac_dry .ac-air path, .k-ac_split.st-at_target .ac-air path { opacity: .35; animation: ac-blow 2.4s linear infinite; }
.ac-air path:nth-child(2) { animation-delay: -.3s !important; } .ac-air path:nth-child(3) { animation-delay: -.6s !important; } .ac-air path:nth-child(4) { animation-delay: -.15s !important; } .ac-air path:nth-child(5) { animation-delay: -.45s !important; }
.ac-drops circle { fill: #7fd6c0; opacity: 0; }
.k-ac_split.st-ac_dry .ac-drops circle { animation: ac-fall 1.6s ease-in infinite; }
.ac-drops circle:nth-child(2) { animation-delay: .4s !important; } .ac-drops circle:nth-child(3) { animation-delay: .8s !important; } .ac-drops circle:nth-child(4) { animation-delay: 1.2s !important; }
.ac-ico { opacity: 0; transition: opacity .4s; }
.k-ac_split.st-cooling .ico-cool, .k-ac_split.mode-cool .ico-cool, .k-ac_split.st-heating .ico-heat, .k-ac_split.mode-heat .ico-heat,
.k-ac_split.st-ac_dry .ico-dry, .k-ac_split.st-ac_fan .ico-fan { opacity: 1; }
.k-ac_split.st-off .ac-ico, .k-ac_split.st-unavailable .ac-ico { opacity: 0 !important; }
.k-ac_split .lcd { fill: transparent; }
.k-ac_split:not(.st-off):not(.st-unavailable) .lcd { fill: var(--acc); }
.k-ac_split:not(.st-off):not(.st-unavailable) .l1 { fill: #3ddc84; }
.ac-warm { opacity: 0; transition: opacity 1.2s; }
.k-ac_split.st-heating .ac-warm { opacity: 1; animation: ac-glow 3s ease-in-out infinite; }
.ac-waves path { fill: none; stroke: #ffb37a; stroke-width: 1.6; stroke-linecap: round; opacity: 0; }
.k-ac_split.st-heating .ac-waves path { animation: ac-steam 2.6s ease-out infinite; }
.ac-waves path:nth-child(2) { animation-delay: .8s !important; } .ac-waves path:nth-child(3) { animation-delay: 1.6s !important; }
.k-heat_pump.st-heating .hp-fins { stroke: #cfe9ff; }
@keyframes ac-blow { to { stroke-dashoffset: -24; } }
@keyframes ac-swing { 0%, 100% { transform: translateY(4.5px) scaleY(.75); } 50% { transform: translateY(5.5px) scaleY(.55); } }

/* ---------- air conditioning: outdoor heat pump ---------- */
.hp-fan { transform-box: view-box; transform-origin: 46px 75px; }
.k-heat_pump.st-cooling .hp-fan, .k-heat_pump.st-heating .hp-fan, .k-heat_pump.st-ac_dry .hp-fan { animation: ac-rot .45s linear infinite; }
.k-heat_pump.st-ac_fan .hp-fan, .k-heat_pump.st-at_target .hp-fan { animation: ac-rot 2.5s linear infinite; }
.hp-out circle { fill: none; stroke-width: 2.2; opacity: 0; transform-box: view-box; transform-origin: 46px 75px; }
.k-heat_pump.st-cooling .hp-out circle { stroke: #ff8a3d; animation: hp-wave 1.8s ease-out infinite; }
.k-heat_pump.st-heating .hp-out circle, .k-heat_pump.st-ac_dry .hp-out circle { stroke: #4fc3f7; animation: hp-wave 1.8s ease-out infinite; }
.hp-out circle:nth-child(2) { animation-delay: .6s !important; } .hp-out circle:nth-child(3) { animation-delay: 1.2s !important; }
.hp-steam path { fill: none; stroke: #e3e8ed; stroke-width: 2.2; stroke-linecap: round; opacity: 0; }
.k-heat_pump.st-defrost .hp-steam path { animation: ac-steam 2s ease-out infinite; }
.hp-steam path:nth-child(2) { animation-delay: .6s !important; } .hp-steam path:nth-child(3) { animation-delay: 1.2s !important; }
.k-heat_pump.st-cooling .hp-body, .k-heat_pump.st-heating .hp-body { animation: ac-shake-soft .25s linear infinite; }
.hp-led { fill: #9aa2ab; transition: fill .3s; }
.k-heat_pump.st-cooling .hp-led, .k-heat_pump.st-heating .hp-led, .k-heat_pump.st-ac_dry .hp-led, .k-heat_pump.st-defrost .hp-led { fill: #3ddc84; }
.k-heat_pump.st-at_target .hp-led, .k-heat_pump.st-ac_fan .hp-led { fill: #ffd76a; }
@keyframes hp-wave { 0% { opacity: .8; transform: scale(1); } 100% { opacity: 0; transform: scale(1.55); } }

/* ---------- towel dryer ---------- */
.td-glow { opacity: 0; transition: opacity .8s; }
.td-glow2 { mix-blend-mode: multiply; }
.k-towel_dryer.st-heating .td-glow { opacity: .85; animation: ac-glow 2.6s ease-in-out infinite; }
.k-towel_dryer.st-at_target .td-glow { opacity: .22; }
.td-heat path { fill: none; stroke: #ff9a52; stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 2 7; opacity: 0; transition: opacity .6s; }
.k-towel_dryer.st-heating .td-heat path { opacity: .6; animation: hd-up 1.8s linear infinite; }
.td-heat path:nth-child(2) { animation-duration: 1.4s !important; } .td-heat path:nth-child(3) { animation-duration: 2.2s !important; }
.td-towel { transform-box: fill-box; transform-origin: 50% 0; }
.k-towel_dryer.st-heating .td-towel { animation: td-sway 3.2s ease-in-out infinite; }
.k-towel_dryer.st-heating .td-towel2 { animation-duration: 2.6s; animation-delay: .4s; }
.td-steam path { transform-box: fill-box; transform-origin: 50% 100%; fill: none; stroke: #e3e8ed; stroke-width: 2; stroke-linecap: round; opacity: 0; }
.k-towel_dryer.st-heating .td-steam path { animation: hd-suck 2.6s ease-out infinite; }
.td-steam path:nth-child(2) { animation-delay: .8s !important; } .td-steam path:nth-child(3) { animation-delay: 1.6s !important; }
.td-led { fill: #5a636d; transition: fill .3s; }
.k-towel_dryer.st-heating .td-led { fill: #ff7a2e; filter: drop-shadow(0 0 1.5px #ff7a2e); }
.k-towel_dryer.st-at_target .td-led { fill: #43c07a; }
.k-towel_dryer .lcd { fill: #6fd8ff; }
.k-towel_dryer.st-off .lcd { fill: #24404f; }
@keyframes td-sway { 0%, 100% { transform: skewX(0deg); } 50% { transform: skewX(1.6deg); } }

/* ---------- server rack (homelab) ---------- */
.rk-led { fill: #2d3640; transition: fill .4s; }
.rk-fan { transform-box: fill-box; transform-origin: 50% 50%; }
.k-server_rack.st-online .rk-fan { animation: ac-rot calc(.9s - var(--load, .4) * .6s) linear infinite; }
.k-server_rack.st-online .rk-g { fill: #34d27a; animation: rk-blink calc(1.8s - var(--load, .4) * 1.3s) steps(1, end) infinite; }
.k-server_rack.st-online .rk-b { fill: #3b9cff; filter: drop-shadow(0 0 1.2px #3b9cff); animation: rk-blink calc(1.3s - var(--load, .4) * .9s) steps(1, end) infinite; }
.k-server_rack.st-online .rk-r { fill: #ffb020; }
.k-server_rack.st-standby .rk-g { fill: #34d27a; opacity: .6; }
.k-server_rack.st-standby .rk-r { fill: #ffb020; }
.rk-glow { opacity: 0; transition: opacity .8s; }
.k-server_rack.st-online .rk-glow { opacity: 1; animation: ac-glow 3s ease-in-out infinite; }
.rk-flow path { stroke: #fff; stroke-dasharray: 1.4 9; opacity: 0; transition: opacity .6s; }
.k-server_rack.st-online .rk-flow path { opacity: .85; animation: ac-flow calc(1.8s - var(--load, .4) * 1.2s) linear infinite; }
.k-server_rack:not(.st-online) .rk-cables { opacity: .55; }
.k-server_rack .lcd { font-size: 5.6px; fill: #24404f; }
.k-server_rack.active .lcd { fill: var(--ac-lcd); }
@keyframes rk-blink { 0% { opacity: 1; } 20% { opacity: .25; } 35% { opacity: 1; } 62% { opacity: .35; } 78% { opacity: 1; } 100% { opacity: 1; } }

/* ---------- desktop PC ---------- */
.pc-screen, .lp-screen { opacity: 0; transition: opacity .5s; }
.k-desktop_pc.st-screen_on .pc-screen, .k-laptop.st-screen_on .lp-screen { opacity: 1; }
.pc-fan { transform-box: fill-box; transform-origin: 50% 50%; }
.k-desktop_pc.st-screen_on .pc-fan { animation: ac-rot .7s linear infinite; }
.pc-rgb circle { stroke: #1d242b; transition: stroke .5s; }
.k-desktop_pc.st-screen_on .pc-rgb circle { animation: pc-rgb 4s linear infinite; filter: drop-shadow(0 0 1.6px currentColor); }
.pc-rgb circle:nth-child(2) { animation-delay: -1.3s !important; } .pc-rgb circle:nth-child(3) { animation-delay: -2.6s !important; }
.pc-led { fill: #5a636d; transition: fill .3s; }
.k-desktop_pc.st-screen_on .pc-led { fill: #38d9ff; filter: drop-shadow(0 0 1.4px #38d9ff); }
.k-desktop_pc.st-standby .pc-led { fill: #ffb020; animation: ac-pulse 2.4s ease-in-out infinite; }
.pc-mled { fill: #3a424b; } .k-desktop_pc.st-screen_on .pc-mled { fill: #43c07a; } .k-desktop_pc.st-standby .pc-mled { fill: #ffb020; }
.pc-code rect { transform-box: fill-box; transform-origin: 0 50%; }
.k-desktop_pc.st-screen_on .pc-code rect { animation: pc-type 4.4s ease-in-out infinite; }
.pc-code rect:nth-child(2) { animation-delay: .5s !important; } .pc-code rect:nth-child(3) { animation-delay: 1s !important; }
.pc-code rect:nth-child(4) { animation-delay: 1.5s !important; } .pc-code rect:nth-child(5) { animation-delay: 2s !important; }
.pc-bars rect { transform-box: fill-box; transform-origin: 50% 100%; }
.k-desktop_pc.st-screen_on .pc-bars rect { animation: pc-bar 3.2s ease-in-out infinite alternate; }
.pc-bars rect:nth-child(2) { animation-delay: .4s !important; } .pc-bars rect:nth-child(3) { animation-delay: .8s !important; } .pc-bars rect:nth-child(4) { animation-delay: 1.2s !important; }
.pc-cursor { transform: translate(20px, 30px); }
.k-desktop_pc.st-screen_on .pc-cursor { animation: pc-mouse 6s ease-in-out infinite; }
.k-desktop_pc.st-screen_on .pc-keys rect { fill: #38d9ff; opacity: .5; animation: ac-glow 2.4s ease-in-out infinite; }
@keyframes pc-rgb { 0% { stroke: #ff3b6b; color: #ff3b6b; } 33% { stroke: #3bff9a; color: #3bff9a; } 66% { stroke: #3b9cff; color: #3b9cff; } 100% { stroke: #ff3b6b; color: #ff3b6b; } }
@keyframes pc-type { 0% { transform: scaleX(.1); } 30%, 80% { transform: scaleX(1); } 100% { transform: scaleX(.1); } }
@keyframes pc-bar { from { transform: scaleY(.35); } to { transform: scaleY(1); } }
@keyframes pc-mouse { 0%, 100% { transform: translate(20px, 30px); } 30% { transform: translate(52px, 34px); } 55% { transform: translate(60px, 48px); } 80% { transform: translate(28px, 42px); } }

/* ---------- laptop ---------- */
.lp-line { stroke-dasharray: 130; stroke-dashoffset: 130; }
.k-laptop.st-screen_on .lp-line { animation: lp-draw 5s ease-in-out infinite; }
.lp-dot { opacity: 0; }
.k-laptop.st-screen_on .lp-dot { animation: ac-pulse 1.2s ease-in-out infinite; opacity: 1; }
.lp-glow { opacity: 0; transition: opacity .6s; }
.k-laptop.st-screen_on .lp-glow { opacity: 1; }
.lp-keys { transition: fill .5s; }
.k-laptop.st-screen_on .lp-keys { fill: #bfe9ff; }
.lp-cam { fill: #3a424b; } .k-laptop.st-screen_on .lp-cam { fill: #43e08a; }
.lp-led { fill: #5a636d; transition: fill .3s; }
.k-laptop.st-screen_on .lp-led { fill: #43e08a; filter: drop-shadow(0 0 1.2px #43e08a); }
.k-laptop.st-standby .lp-led { fill: #ffb020; animation: ac-pulse 2.4s ease-in-out infinite; }
@keyframes lp-draw { 0% { stroke-dashoffset: 130; } 55%, 85% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -130; } }
.modes:empty { display: none; }
.modes { display: grid; grid-template-columns: repeat(auto-fit, minmax(78px, 1fr)); gap: 6px; }
.mode-btn { white-space: nowrap; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 7px 6px; border-radius: 10px; font: inherit; font-size: 12.5px; color: var(--secondary-text-color); background: rgba(127,127,127,.12); transition: background .2s, color .2s; }
.mode-btn:hover { background: rgba(127,127,127,.22); }
.mode-btn ha-icon { --mdc-icon-size: 16px; }
.mode-btn.on { color: #fff; background: var(--mc, var(--c)); }
.mode-btn[data-mode="comfort"] { --mc: #f5a300; } .mode-btn[data-mode="eco"] { --mc: #5b7bd5; } .mode-btn[data-mode="frost"] { --mc: #2b9af9; } .mode-btn[data-mode="off"] { --mc: #6b737c; }
.mode-btn:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
.k-towel_dryer.mode-eco.st-heating .td-glow { opacity: .55; } .k-towel_dryer.mode-frost.st-heating .td-glow { opacity: .3; }
.k-towel_dryer.mode-frost .lcd { fill: #6fd8ff; }
.wrap.solar-heat { --c: var(--ac-accent, #f5b301); }

/* ---------- wine cooler ---------- */
.wn-led { fill: #5a636d; transition: fill .3s; }
.k-wine_cooler.st-cooling .wn-led { fill: #38d9ff; filter: drop-shadow(0 0 1.4px #38d9ff); animation: ac-pulse 2.4s ease-in-out infinite; }
.k-wine_cooler.st-standby .wn-led { fill: #43c07a; }
.wn-light, .wn-strip { opacity: 0; transition: opacity .8s; }
.k-wine_cooler.st-cooling .wn-light, .k-wine_cooler.st-standby .wn-light { opacity: .8; }
.k-wine_cooler.st-cooling .wn-strip, .k-wine_cooler.st-standby .wn-strip { opacity: 1; }
.wn-bottles { transition: opacity .8s; opacity: .55; }
.k-wine_cooler.st-cooling .wn-bottles, .k-wine_cooler.st-standby .wn-bottles { opacity: 1; }
.wn-air path { stroke: #9fdcff; stroke-width: 1.4; stroke-dasharray: 3 6; opacity: 0; transition: opacity .6s; }
.k-wine_cooler.st-cooling .wn-air path { opacity: .6; animation: hd-up 2s linear infinite; }
.wn-air path:nth-child(2) { animation-duration: 1.5s !important; } .wn-air path:nth-child(3) { animation-duration: 2.4s !important; }
.wn-drops circle { fill: #cfeeff; opacity: 0; }
.k-wine_cooler.st-cooling .wn-drops circle { animation: ac-fall 4s ease-in infinite; }
.wn-drops circle:nth-child(2) { animation-delay: 1.1s !important; } .wn-drops circle:nth-child(3) { animation-delay: 2.2s !important; }
.wn-drops circle:nth-child(4) { animation-delay: .6s !important; } .wn-drops circle:nth-child(5) { animation-delay: 1.8s !important; }
.wn-door { transform-box: view-box; transform-origin: 26px 76px; transition: transform .6s cubic-bezier(.3,.7,.3,1); }
.door-open .wn-door { transform: scaleX(.2) skewY(-5deg); }
.k-wine_cooler .lcd { fill: #6fd8ff; }
/* bi-zone : zone basse (blancs) plus froide, voile bleuté */
.wn-cold { opacity: 0; transition: opacity .8s; }
.k-wine_cooler.st-standby .wn-cold { opacity: .07; }
.k-wine_cooler.st-cooling .wn-cold { opacity: .14; animation: wn-chill 4s ease-in-out infinite; }
@keyframes wn-chill { 0%, 100% { opacity: .08; } 50% { opacity: .18; } }
.k-wine_cooler.st-off .lcd { fill: #24404f; }
.k-wine_cooler.warm .lcd { fill: var(--ac-alert); }
.no-anim *, .no-anim { animation: none !important; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }

/* ---------- beer tap ---------- */
.k-beer_tap svg { overflow: visible; }
.k-beer_tap .lcd { fill: #24404f; }
.k-beer_tap:not(.st-off):not(.st-unavailable) .lcd { fill: #6fd8ff; }
.bt-flake { opacity: .25; transition: opacity .4s; }
.k-beer_tap.st-cooling .bt-flake { opacity: 1; animation: ac-pulse 1.8s ease-in-out infinite; }
.k-beer_tap.st-ready .bt-flake, .k-beer_tap.st-pouring .bt-flake { opacity: .8; }
.bt-mist circle { fill: #bfe6ff; opacity: 0; }
.k-beer_tap.st-cooling .bt-mist circle { animation: ac-mist 3s ease-out infinite; }
.bt-mist circle:nth-child(2) { animation-delay: 1s !important; } .bt-mist circle:nth-child(3) { animation-delay: 2s !important; }
.bt-keg { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(var(--keg, .7)); transition: transform 1s; }
.bt-handle { transform-box: view-box; transform-origin: 65.5px 10px; transition: transform .5s cubic-bezier(.3,1.4,.5,1); }
.k-beer_tap.st-pouring .bt-handle { transform: rotate(32deg); }
.bt-stream { fill: none; stroke: #f0b23a; stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 5 2; opacity: 0; transition: opacity .3s; }
.k-beer_tap.st-pouring .bt-stream { opacity: .95; animation: cf-flow .35s linear infinite; }
.bt-beer { transform-box: view-box; transform-origin: 98px 118px; transform: scaleY(0); transition: transform 1s ease; }
.k-beer_tap.st-ready .bt-beer, .k-beer_tap.st-cooling .bt-beer { transform: scaleY(.95); }
.k-beer_tap.st-pouring .bt-beer { animation: bt-fill 6s cubic-bezier(.2,.6,.4,1) forwards; }
.bt-bubbles circle { opacity: 0; }
.k-beer_tap:not(.st-off) .bt-bubbles circle { animation: bt-bub 2.2s ease-in infinite; }
.bt-bubbles circle:nth-child(2) { animation-delay: .6s !important; } .bt-bubbles circle:nth-child(3) { animation-delay: 1.1s !important; } .bt-bubbles circle:nth-child(4) { animation-delay: 1.6s !important; }
.bt-drops circle { opacity: 0; transition: opacity 1s; }
.k-beer_tap.st-cooling .bt-drops circle, .k-beer_tap.st-ready .bt-drops circle { opacity: .9; animation: ac-drip 4s ease-in infinite; }
.k-beer_tap.st-off .bt-beer { transform: scaleY(0); }
@keyframes bt-fill { from { transform: scaleY(0); } to { transform: scaleY(.95); } }
@keyframes bt-bub { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: .9; } 100% { opacity: 0; transform: translateY(-26px); } }

/* ---------- AV receiver ---------- */
.k-av_receiver svg { overflow: visible; }
.k-av_receiver .lcd { fill: #24404f; }
.k-av_receiver.st-playing .lcd, .k-av_receiver.st-paused .lcd { fill: #38d9ff; }
.k-av_receiver.st-muted .lcd { fill: #ff8a3d; }
.av-pwr { fill: #3a2222; transition: fill .3s; }
.k-av_receiver.st-standby .av-pwr { fill: #ff3b30; }
.k-av_receiver.st-playing .av-pwr, .k-av_receiver.st-muted .av-pwr, .k-av_receiver.st-paused .av-pwr { fill: #38d9ff; }
.av-eq rect { fill: #38d9ff; opacity: .12; transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(.15); transition: opacity .4s; }
.k-av_receiver.st-playing .av-eq rect { opacity: .9; animation: av-eq .9s ease-in-out infinite alternate; }
.k-av_receiver.st-paused .av-eq rect, .k-av_receiver.st-muted .av-eq rect { opacity: .5; }
.av-eq rect:nth-child(2) { animation-duration: .6s !important; } .av-eq rect:nth-child(3) { animation-duration: .75s !important; } .av-eq rect:nth-child(4) { animation-duration: .5s !important; }
.av-eq rect:nth-child(5) { animation-duration: .85s !important; } .av-eq rect:nth-child(6) { animation-duration: .55s !important; } .av-eq rect:nth-child(7) { animation-duration: .7s !important; }
.av-eq rect:nth-child(8) { animation-duration: .45s !important; } .av-eq rect:nth-child(9) { animation-duration: .8s !important; } .av-eq rect:nth-child(10) { animation-duration: .65s !important; }
.av-ring { opacity: 0; transition: opacity .6s; }
.k-av_receiver.st-playing .av-ring { opacity: calc(.4 + var(--amp, .6) * .6); animation: ac-glow 2.4s ease-in-out infinite; }
.k-av_receiver.st-muted .av-ring, .k-av_receiver.st-paused .av-ring { opacity: .35; }
.av-knob { transform-box: view-box; transform-origin: 99px 74px; transform: rotate(calc(-135deg + var(--amp, .6) * 270deg)); transition: transform .8s ease; }
.k-av_receiver.st-off .av-knob, .k-av_receiver.st-standby .av-knob { transform: rotate(-135deg); }
.av-waves path { stroke: #38d9ff; stroke-width: 1.6; opacity: 0; }
.k-av_receiver.st-playing .av-waves path { animation: av-wave calc(1.6s - var(--amp, .6) * .8s) ease-out infinite; }
.av-waves path:nth-child(2), .av-waves path:nth-child(4) { animation-delay: .4s !important; }
.av-notes { opacity: 0; }
.k-av_receiver.st-playing .av-notes { animation: av-notes 3.2s ease-in-out infinite; }
@keyframes av-eq { from { transform: scaleY(.15); } to { transform: scaleY(calc(.3 + var(--amp, .6) * .7)); } }
@keyframes av-wave { 0% { opacity: 0; } 30% { opacity: .85; } 100% { opacity: 0; } }
@keyframes av-notes { 0% { opacity: 0; transform: translateY(6px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-10px); } }

/* ---------- fan ---------- */
.k-fan svg { overflow: visible; }
.k-fan { --fspd: 1s; }
.k-fan.st-fan_1 { --fspd: .55s; } .k-fan.st-fan_2 { --fspd: .28s; } .k-fan.st-fan_3 { --fspd: .16s; }
.fn-blades { transform-box: view-box; transform-origin: 60px 52px; }
.k-fan.st-fan_1 .fn-blades, .k-fan.st-fan_2 .fn-blades, .k-fan.st-fan_3 .fn-blades { animation: ac-rot var(--fspd) linear infinite; }
.fn-blur { opacity: 0; transition: opacity .6s; }
.k-fan.st-fan_2 .fn-blur { opacity: .12; } .k-fan.st-fan_3 .fn-blur { opacity: .2; }
.fn-head { transform-box: view-box; transform-origin: 60px 80px; }
.k-fan.osc.st-fan_1 .fn-head, .k-fan.osc.st-fan_2 .fn-head, .k-fan.osc.st-fan_3 .fn-head { animation: fn-osc 7s ease-in-out infinite; }
.fn-air path { stroke: #bfe3f7; stroke-width: 1.8; opacity: 0; stroke-dasharray: 4 6; }
.k-fan.st-fan_1 .fn-air path { opacity: .45; animation: ac-blow 1.4s linear infinite; }
.k-fan.st-fan_2 .fn-air path, .k-fan.st-fan_3 .fn-air path { opacity: .8; animation: ac-blow .7s linear infinite; }
.fn-air path:nth-child(2), .fn-air path:nth-child(4) { animation-delay: -.3s !important; }
.fn-ribbon { transform-box: view-box; transform-origin: 93px 45px; }
.k-fan.st-fan_1 .fn-ribbon { animation: fn-flap .5s ease-in-out infinite alternate; }
.k-fan.st-fan_2 .fn-ribbon, .k-fan.st-fan_3 .fn-ribbon { animation: fn-flap .18s ease-in-out infinite alternate; }
.fn-led { fill: #3a424b; transition: fill .3s; }
.k-fan.st-fan_1 .l1, .k-fan.st-fan_2 .l1, .k-fan.st-fan_2 .l2, .k-fan.st-fan_3 .fn-led { fill: #38d9ff; }
.k-fan.st-standby .l1 { fill: #ff8a3d; }
@keyframes fn-osc { 0%, 100% { transform: scaleX(1) translateX(0); } 25% { transform: scaleX(.82) translateX(-4px); } 50% { transform: scaleX(1) translateX(0); } 75% { transform: scaleX(.82) translateX(4px); } }
@keyframes fn-flap { from { transform: rotate(-12deg) scaleY(.8); } to { transform: rotate(14deg) scaleY(1.1); } }

/* ---------- generic (image perso) ---------- */
.k-generic svg { overflow: visible; }
.gn-img { transition: opacity .4s, filter .4s; }
.k-generic.st-off .gn-img, .k-generic.st-unavailable .gn-img { opacity: .45; filter: grayscale(1); }
.k-generic.st-idle .gn-img, .k-generic.st-standby .gn-img { opacity: .75; filter: grayscale(.5); }
.k-generic.active .gn-img { filter: drop-shadow(0 0 4px var(--c)); animation: gn-glow 2.6s ease-in-out infinite; }
@keyframes gn-glow { 0%, 100% { filter: drop-shadow(0 0 3px var(--c)); } 50% { filter: drop-shadow(0 0 8px var(--c)); } }
.k-generic .gn-empty { opacity: .6; }

/* ---------- tool battery charger ---------- */
.k-tool_charger svg { overflow: visible; }
/* voyants du socle */
.tc-led, .tc-err { fill: #3a424b; transition: fill .3s; }
.k-tool_charger.st-charging .tc-led { fill: #43e08a; filter: drop-shadow(0 0 1.4px #43e08a); animation: tc-blink 1.2s ease-in-out infinite; }
.k-tool_charger.st-charged .tc-led { fill: #43e08a; filter: drop-shadow(0 0 1.4px #43e08a); }
.k-tool_charger.st-standby .tc-led { fill: #2f7a50; }
.k-tool_charger.alert .tc-err { fill: var(--ac-alert, #e5484d); filter: drop-shadow(0 0 1.2px #e5484d); }
/* jauge 4 LED de la batterie : allumées selon le capteur de niveau, sinon remplissage en boucle */
.tc-g { fill: #2a3036; transition: fill .4s; }
.tc-g.on { fill: #43e08a; filter: drop-shadow(0 0 .8px #43e08a); }
.tc-g.next { animation: tc-g-blink 1.2s ease-in-out infinite; }
.k-tool_charger.seq .tc-g1 { animation: tc-g1 4s linear infinite; } .k-tool_charger.seq .tc-g2 { animation: tc-g2 4s linear infinite; }
.k-tool_charger.seq .tc-g3 { animation: tc-g3 4s linear infinite; } .k-tool_charger.seq .tc-g4 { animation: tc-g4 4s linear infinite; }
/* éclair et halo pendant la charge */
.tc-bolt { fill: #43e08a; opacity: 0; transition: opacity .4s; }
.k-tool_charger.st-charging .tc-bolt { opacity: 1; animation: ac-pulse 1.6s ease-in-out infinite; }
.tc-glow { opacity: 0; transition: opacity .8s; }
.k-tool_charger.st-charging .tc-glow { opacity: .9; animation: tc-breathe 2.4s ease-in-out infinite; }
.k-tool_charger.st-charged .tc-glow { opacity: .35; }
/* énergie qui circule dans le câble */
.tc-flow { opacity: 0; transition: opacity .5s; }
.k-tool_charger.st-charging .tc-flow { opacity: .85; animation: tc-flow 1.1s linear infinite; }
@keyframes tc-flow { to { stroke-dashoffset: -12; } }
@keyframes tc-blink { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
@keyframes tc-breathe { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
@keyframes tc-g-blink { 0%, 100% { fill: #2a3036; } 50% { fill: #43e08a; } }
/* chaque LED s'allume à son tour, puis toutes s'éteignent ensemble : 0 → 4 barres */
@keyframes tc-g1 { 0%, 8% { fill: #2a3036; } 12%, 88% { fill: #43e08a; } 92%, 100% { fill: #2a3036; } }
@keyframes tc-g2 { 0%, 28% { fill: #2a3036; } 32%, 88% { fill: #43e08a; } 92%, 100% { fill: #2a3036; } }
@keyframes tc-g3 { 0%, 48% { fill: #2a3036; } 52%, 88% { fill: #43e08a; } 92%, 100% { fill: #2a3036; } }
@keyframes tc-g4 { 0%, 68% { fill: #2a3036; } 72%, 88% { fill: #43e08a; } 92%, 100% { fill: #2a3036; } }

/* ---------- ceiling fan ---------- */
.k-ceiling_fan svg { overflow: visible; }
.k-ceiling_fan { --cspd: 1s; }
.k-ceiling_fan.st-fan_1 { --cspd: 1.1s; } .k-ceiling_fan.st-fan_2 { --cspd: .55s; } .k-ceiling_fan.st-fan_3 { --cspd: .3s; }
/* les pales tournent dans le disque aplati : centre de leur boîte = l'axe */
.cf-blades { transform-box: fill-box; transform-origin: center; }
.k-ceiling_fan.st-fan_1 .cf-blades, .k-ceiling_fan.st-fan_2 .cf-blades, .k-ceiling_fan.st-fan_3 .cf-blades { animation: ac-rot var(--cspd) linear infinite; }
.cf-blur { opacity: 0; transition: opacity .6s; }
.k-ceiling_fan.st-fan_2 .cf-blur { opacity: .06; } .k-ceiling_fan.st-fan_3 .cf-blur { opacity: .11; }
/* air brassé vers le bas */
.cf-air path { stroke: #bfe3f7; stroke-width: 1.6; opacity: 0; stroke-dasharray: 4 7; }
.k-ceiling_fan.st-fan_1 .cf-air path { opacity: .4; animation: cf-down 1.6s linear infinite; }
.k-ceiling_fan.st-fan_2 .cf-air path, .k-ceiling_fan.st-fan_3 .cf-air path { opacity: .75; animation: cf-down .8s linear infinite; }
.cf-air path:nth-child(2), .cf-air path:nth-child(4) { animation-delay: -.4s !important; }
/* chaînettes qui se balancent */
.cf-chain { transform-box: view-box; }
.cf-chain.c1 { transform-origin: 47px 44px; } .cf-chain.c2 { transform-origin: 73px 44px; }
.k-ceiling_fan.st-fan_1 .cf-chain { animation: cf-sway 2.4s ease-in-out infinite; }
.k-ceiling_fan.st-fan_2 .cf-chain, .k-ceiling_fan.st-fan_3 .cf-chain { animation: cf-sway 1.2s ease-in-out infinite; }
.cf-chain.c2 { animation-delay: -.6s !important; }
/* lampe */
.cf-glass { transition: fill .4s, filter .4s; }
.k-ceiling_fan.lights-on .cf-glass { fill: #fff6d5; filter: drop-shadow(0 0 3px #ffe9a0); }
.cf-beam { opacity: 0; transition: opacity .6s; }
.k-ceiling_fan.lights-on .cf-beam { opacity: 1; }
@keyframes cf-down { to { stroke-dashoffset: -22; } }
@keyframes cf-sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }

/* Global LCD & Screen Overrides: Maximum legibility on dark bezels across all cards */
.wrap svg text.lcd, svg text.lcd, .lcd {
  font-size: 8.5px !important;
  letter-spacing: .25px !important;
  fill: #7ec8e3 !important;
  font-weight: 700 !important;
  dominant-baseline: central;
  opacity: 0.95 !important;
}
.wrap.active svg text.lcd, .wrap.active .lcd {
  fill: var(--ac-lcd, #38d9ff) !important;
  opacity: 1 !important;
}
.wrap.k-fridge svg text.lcd, .wrap.k-fridge .lcd {
  font-size: 11.5px !important;
  font-weight: 800 !important;
  fill: var(--ac-lcd, #38d9ff) !important;
  opacity: 1 !important;
}
.wrap.warm .fr-temp {
  fill: var(--ac-alert, #ff3b30) !important;
}
`;

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */
window.customCards = window.customCards || [];
for (const kind of Object.keys(DEF)) {
  const tag = `appliance-${kind.replace("_", "-")}-card`;
  if (customElements.get(tag)) continue;
  customElements.define(tag, class extends ApplianceCardBase { static get kind() { return kind; } });
  window.customCards.push({
    type: tag,
    name: `Appliance – ${STRINGS.en[kind]} / ${STRINGS.fr[kind]}`,
    description: `${STRINGS.en[kind]} card with realistic animated illustration, live status, power, energy and cost.`,
    preview: true,
    documentationURL: "https://github.com/skyrotter/ha-appliance-electromenager-cards",
  });
}
console.info(`%c HA-APPLIANCE-CARDS %c v${VERSION} `,
  "color:#fff;background:#03a9f4;font-weight:700;border-radius:3px 0 0 3px",
  "color:#03a9f4;background:#fff;font-weight:700;border-radius:0 3px 3px 0");
})();

/* Libellés de l'éditeur visuel des cartes autonomes (Pompe, Onduleur, Plancher chauffant, Sauna…).
 * window.applianceEditorLabel(nom, hass) → libellé traduit dans la langue de Home Assistant,
 * à défaut un libellé lisible tiré du nom de l'option (entity_floor_temp → « Floor temp »).
 */
(() => {
  if (window.applianceEditorLabel) return;
  const L = {
    "en": {
      "animations": "Animations",
      "battery_low": "Low battery (%)",
      "buffer_tank": "Buffer tank",
      "capacity_kwh": "Capacity (kWh)",
      "car_color": "Car colour",
      "compressor_threshold": "Compressor threshold (W)",
      "entity": "Main entity",
      "entity_active_power": "Active power",
      "entity_area": "Cleaned area",
      "entity_battery": "Battery",
      "entity_blade": "Blade",
      "entity_brush": "Brush",
      "entity_buffer_temp": "Buffer tank temperature",
      "entity_car_soc": "Car battery level",
      "entity_charge": "Battery charge",
      "entity_compressor": "Compressor",
      "entity_control": "Control (button / switch)",
      "entity_cop": "COP",
      "entity_cost": "Cost",
      "entity_energy": "Energy",
      "entity_fault": "Fault sensor",
      "entity_filter": "Filter",
      "entity_flame": "Flame",
      "entity_float": "High-level float",
      "entity_floor_temp": "Floor temperature",
      "entity_flow": "Flow (L/min, m³/h…)",
      "entity_flow_rate": "Flow rate",
      "entity_flow_temp": "Flow temperature",
      "entity_flue_temp": "Flue gas temperature",
      "entity_fuel_level": "Fuel level",
      "entity_fuel_used": "Fuel used",
      "entity_gas": "Gas consumption",
      "entity_hc": "Off-peak index",
      "entity_heat_energy": "Heat energy",
      "entity_heat_power": "Heat output",
      "entity_hp": "Peak-hours index",
      "entity_humidity": "Humidity",
      "entity_injection": "Injection index",
      "entity_input_voltage": "Input voltage",
      "entity_level": "Level (%)",
      "entity_light": "Light",
      "entity_load": "Load",
      "entity_mode": "Mode",
      "entity_modulation": "Modulation",
      "entity_next_start": "Next start",
      "entity_output_voltage": "Output voltage",
      "entity_pellet_level": "Pellet level",
      "entity_ph": "PH",
      "entity_power": "Power",
      "entity_power_injection": "Injection power",
      "entity_power_l1": "Power L1",
      "entity_power_l2": "Power L2",
      "entity_power_l3": "Power L3",
      "entity_pressure": "Pressure",
      "entity_rain": "Rain sensor",
      "entity_return_temp": "Return temperature",
      "entity_runtime": "Runtime",
      "entity_scop": "SCOP",
      "entity_session_energy": "Session energy",
      "entity_soc": "State of charge",
      "entity_source_in_temp": "Source inlet temperature",
      "entity_source_out_temp": "Source outlet temperature",
      "entity_source_pump": "Source pump",
      "entity_starts": "Number of starts",
      "entity_status": "Status sensor",
      "entity_switch": "Smart plug / switch",
      "entity_target_temp": "Target temperature",
      "entity_tariff": "Current tariff",
      "entity_temp": "Temperature",
      "entity_temperature": "Temperature",
      "entity_time": "Remaining time",
      "entity_water_level": "Water level",
      "entity_water_temp": "Water temperature",
      "filter_alert": "Filter alert (%)",
      "filter_threshold": "Filter alert threshold",
      "floor_max": "Max floor temperature (°C)",
      "flow_temp_max": "Max flow temperature (°C)",
      "fluid_color": "Fluid colour",
      "fuel_alert": "Fuel alert (%)",
      "hc_ranges": "Off-peak hours (e.g. 22:00-06:00)",
      "heat_threshold": "Heating threshold (W)",
      "heater_threshold": "Heater threshold (W)",
      "heating_delay": "Heating delay",
      "heating_type": "Heating type (water / electric)",
      "ignition_threshold": "Ignition threshold (W)",
      "indexes": "Meter indexes",
      "invert": "Invert state",
      "invert_position": "Invert position (open ↔ closed)",
      "invert_power": "Invert power sign",
      "jets_threshold": "Jets threshold (W)",
      "language": "Language",
      "layout": "Layout",
      "leaves": "Number of leaves",
      "level_max": "High level alert (%)",
      "level_min": "Low level alert (%)",
      "load_max": "Overload above (%)",
      "low_threshold": "Low threshold",
      "mains_min": "Mains lost below (V)",
      "max_flow": "Maximum flow (L/min)",
      "max_power": "Maximum power (W)",
      "max_pressure": "Gauge scale (bar)",
      "moving_threshold": "Motor moving threshold (W)",
      "name": "Name",
      "off_threshold": "Off threshold (W)",
      "pellet_alert": "Pellet alert (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Phase gauge",
      "power_max": "Maximum power",
      "pressure_max": "Overpressure alert (bar)",
      "price_per_kwh": "Price per kWh",
      "price_per_liter": "Price per litre",
      "price_per_unit": "Price per unit",
      "ready_margin": "Ready margin (°C)",
      "run_threshold": "Running threshold (W)",
      "show_area": "Show area",
      "show_battery": "Show battery",
      "show_blade": "Show blade",
      "show_buttons": "Show buttons",
      "show_charge": "Show battery charge",
      "show_consumables": "Show consumables",
      "show_controls": "Show buttons",
      "show_cost": "Show cost",
      "show_duration": "Show duration",
      "show_energy": "Show energy",
      "show_fan": "Show fan speed",
      "show_filter": "Show filter",
      "show_floor": "Show floor temperature",
      "show_flow": "Show flow",
      "show_fuel": "Show fuel",
      "show_fuel_used": "Show fuel used",
      "show_gas": "Show gas",
      "show_gauge": "Show gauge",
      "show_humidity": "Show humidity",
      "show_index": "Show index",
      "show_injection": "Show injection",
      "show_level": "Show level",
      "show_load": "Show load",
      "show_mode": "Show mode",
      "show_modulation": "Show modulation",
      "show_next": "Show next start",
      "show_pellets": "Show pellets",
      "show_ph": "Show pH",
      "show_phases": "Show phases",
      "show_position": "Show position",
      "show_power": "Show power",
      "show_pressure": "Show pressure",
      "show_runtime": "Show runtime",
      "show_since": "Show last change",
      "show_soc": "Show state of charge",
      "show_starts": "Show starts",
      "show_status": "Show status",
      "show_status_tile": "Show status tile",
      "show_tariff": "Show tariff",
      "show_temp": "Show temperature",
      "show_temperature": "Show temperature",
      "show_temps": "Show temperatures",
      "show_time": "Show time",
      "show_voltage": "Show voltages",
      "show_water": "Show water temperature",
      "show_water_level": "Show water level",
      "show_water_temp": "Show water temperature",
      "small": "Compact",
      "source_threshold": "Source pump threshold (W)",
      "status_position": "Status position",
      "subscribed_power": "Subscribed power (kVA)",
      "target_temp": "Target temperature",
      "temp_max": "Maximum temperature",
      "temp_min": "Minimum temperature",
      "temp_scale": "Thermometer scale",
      "threshold": "Power threshold (W)",
      "travel_time": "Travel time (s)",
      "water_level_full": "Full pool water level",
      "water_level_min": "Minimum water level",
      "water_max": "Max water temperature (°C)",
      "color": "Light colour",
      "follow_light_color": "Follow the bulb colour",
      "color_cycle": "Colour cycle",
      "multicolor": "Multicolour lights",
      "show_brightness": "Show brightness",
      "labels": "Custom tile labels (key: text)",
      "sun_entity": "Sun entity (day / night)",
      "shutter_color": "Shutter colour",
      "show_slider": "Show sliders",
      "show_tilt": "Show tilt",
      "image": "Your own image (URL)",
      "illustration_size": "Illustration size",
      "transparent": "Transparent background"
    },
    "de": {
      "animations": "Animationen",
      "battery_low": "Akku schwach (%)",
      "buffer_tank": "Pufferspeicher",
      "capacity_kwh": "Kapazität (kWh)",
      "car_color": "Fahrzeugfarbe",
      "compressor_threshold": "Verdichterschwelle (W)",
      "entity": "Hauptentität",
      "entity_active_power": "Wirkleistung",
      "entity_area": "Gereinigte Fläche",
      "entity_battery": "Akku",
      "entity_blade": "Messer",
      "entity_brush": "Bürste",
      "entity_buffer_temp": "Pufferspeichertemperatur",
      "entity_car_soc": "Fahrzeugakku",
      "entity_charge": "Akkuladung",
      "entity_compressor": "Verdichter",
      "entity_control": "Steuerung (Taste / Schalter)",
      "entity_cop": "COP",
      "entity_cost": "Kosten",
      "entity_energy": "Energie",
      "entity_fault": "Störungssensor",
      "entity_filter": "Filter",
      "entity_flame": "Flamme",
      "entity_float": "Hochwasserschwimmer",
      "entity_floor_temp": "Bodentemperatur",
      "entity_flow": "Durchfluss (L/min, m³/h…)",
      "entity_flow_rate": "Durchfluss",
      "entity_flow_temp": "Vorlauftemperatur",
      "entity_flue_temp": "Abgastemperatur",
      "entity_fuel_level": "Kraftstoffstand",
      "entity_fuel_used": "Kraftstoffverbrauch",
      "entity_gas": "Gasverbrauch",
      "entity_hc": "Zählerstand Niedertarif",
      "entity_heat_energy": "Wärmeenergie",
      "entity_heat_power": "Heizleistung",
      "entity_hp": "Zählerstand Hochtarif",
      "entity_humidity": "Luftfeuchtigkeit",
      "entity_injection": "Einspeisezähler",
      "entity_input_voltage": "Eingangsspannung",
      "entity_level": "Füllstand (%)",
      "entity_light": "Licht",
      "entity_load": "Last",
      "entity_mode": "Modus",
      "entity_modulation": "Modulation",
      "entity_next_start": "Nächster Start",
      "entity_output_voltage": "Ausgangsspannung",
      "entity_pellet_level": "Pelletstand",
      "entity_ph": "PH",
      "entity_power": "Leistung",
      "entity_power_injection": "Einspeiseleistung",
      "entity_power_l1": "Leistung L1",
      "entity_power_l2": "Leistung L2",
      "entity_power_l3": "Leistung L3",
      "entity_pressure": "Druck",
      "entity_rain": "Regensensor",
      "entity_return_temp": "Rücklauftemperatur",
      "entity_runtime": "Laufzeit",
      "entity_scop": "SCOP",
      "entity_session_energy": "Energie der Sitzung",
      "entity_soc": "Ladezustand",
      "entity_source_in_temp": "Quelleneintrittstemperatur",
      "entity_source_out_temp": "Quellenaustrittstemperatur",
      "entity_source_pump": "Quellenpumpe",
      "entity_starts": "Anzahl der Starts",
      "entity_status": "Statussensor",
      "entity_switch": "Steckdose / Schalter",
      "entity_target_temp": "Solltemperatur",
      "entity_tariff": "Aktueller Tarif",
      "entity_temp": "Temperatur",
      "entity_temperature": "Temperatur",
      "entity_time": "Restzeit",
      "entity_water_level": "Wasserstand",
      "entity_water_temp": "Wassertemperatur",
      "filter_alert": "Filterwarnung (%)",
      "filter_threshold": "Filterwarnschwelle",
      "floor_max": "Max. Bodentemperatur (°C)",
      "flow_temp_max": "Max. Vorlauftemperatur (°C)",
      "fluid_color": "Farbe der Flüssigkeit",
      "fuel_alert": "Kraftstoffwarnung (%)",
      "hc_ranges": "Niedertarifzeiten (z. B. 22:00-06:00)",
      "heat_threshold": "Heizschwelle (W)",
      "heater_threshold": "Ofenschwelle (W)",
      "heating_delay": "Aufheizverzögerung",
      "heating_type": "Heizungsart (Wasser / elektrisch)",
      "ignition_threshold": "Zündschwelle (W)",
      "indexes": "Zählerstände",
      "invert": "Zustand umkehren",
      "invert_position": "Position umkehren (offen ↔ geschlossen)",
      "invert_power": "Leistungsvorzeichen umkehren",
      "jets_threshold": "Düsenschwelle (W)",
      "language": "Sprache",
      "layout": "Layout",
      "leaves": "Anzahl der Flügel",
      "level_max": "Warnung hoher Füllstand (%)",
      "level_min": "Warnung niedriger Füllstand (%)",
      "load_max": "Überlast über (%)",
      "low_threshold": "Untere Schwelle",
      "mains_min": "Netzausfall unter (V)",
      "max_flow": "Maximaler Durchfluss (L/min)",
      "max_power": "Maximale Leistung (W)",
      "max_pressure": "Manometerskala (bar)",
      "moving_threshold": "Schwelle Motor in Bewegung (W)",
      "name": "Name",
      "off_threshold": "Ausschaltschwelle (W)",
      "pellet_alert": "Pelletwarnung (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Phasenanzeige",
      "power_max": "Maximale Leistung",
      "pressure_max": "Überdruckwarnung (bar)",
      "price_per_kwh": "Preis pro kWh",
      "price_per_liter": "Preis pro Liter",
      "price_per_unit": "Preis pro Einheit",
      "ready_margin": "Bereit-Toleranz (°C)",
      "run_threshold": "Betriebsschwelle (W)",
      "show_area": "Fläche anzeigen",
      "show_battery": "Akku anzeigen",
      "show_blade": "Messer anzeigen",
      "show_buttons": "Tasten anzeigen",
      "show_charge": "Akkuladung anzeigen",
      "show_consumables": "Verbrauchsmaterial anzeigen",
      "show_controls": "Tasten anzeigen",
      "show_cost": "Kosten anzeigen",
      "show_duration": "Dauer anzeigen",
      "show_energy": "Energie anzeigen",
      "show_fan": "Saugstufe anzeigen",
      "show_filter": "Filter anzeigen",
      "show_floor": "Bodentemperatur anzeigen",
      "show_flow": "Durchfluss anzeigen",
      "show_fuel": "Kraftstoff anzeigen",
      "show_fuel_used": "Kraftstoffverbrauch anzeigen",
      "show_gas": "Gas anzeigen",
      "show_gauge": "Anzeige anzeigen",
      "show_humidity": "Luftfeuchtigkeit anzeigen",
      "show_index": "Zählerstand anzeigen",
      "show_injection": "Einspeisung anzeigen",
      "show_level": "Füllstand anzeigen",
      "show_load": "Last anzeigen",
      "show_mode": "Modus anzeigen",
      "show_modulation": "Modulation anzeigen",
      "show_next": "Nächsten Start anzeigen",
      "show_pellets": "Pellets anzeigen",
      "show_ph": "PH anzeigen",
      "show_phases": "Phasen anzeigen",
      "show_position": "Position anzeigen",
      "show_power": "Leistung anzeigen",
      "show_pressure": "Druck anzeigen",
      "show_runtime": "Laufzeit anzeigen",
      "show_since": "Letzte Änderung anzeigen",
      "show_soc": "Ladezustand anzeigen",
      "show_starts": "Starts anzeigen",
      "show_status": "Status anzeigen",
      "show_status_tile": "Statuskachel anzeigen",
      "show_tariff": "Tarif anzeigen",
      "show_temp": "Temperatur anzeigen",
      "show_temperature": "Temperatur anzeigen",
      "show_temps": "Temperaturen anzeigen",
      "show_time": "Zeit anzeigen",
      "show_voltage": "Spannungen anzeigen",
      "show_water": "Wassertemperatur anzeigen",
      "show_water_level": "Wasserstand anzeigen",
      "show_water_temp": "Wassertemperatur anzeigen",
      "small": "Kompakt",
      "source_threshold": "Schwelle Quellenpumpe (W)",
      "status_position": "Position des Status",
      "subscribed_power": "Vertragsleistung (kVA)",
      "target_temp": "Solltemperatur",
      "temp_max": "Maximaltemperatur",
      "temp_min": "Minimaltemperatur",
      "temp_scale": "Thermometerskala",
      "threshold": "Leistungsschwelle (W)",
      "travel_time": "Laufzeit des Motors (s)",
      "water_level_full": "Wasserstand „voll“",
      "water_level_min": "Minimaler Wasserstand",
      "water_max": "Max. Wassertemperatur (°C)",
      "color": "Lichtfarbe",
      "follow_light_color": "Farbe der Lampe übernehmen",
      "color_cycle": "Farbwechsel",
      "multicolor": "Bunte Lichterkette",
      "show_brightness": "Helligkeit anzeigen",
      "labels": "Eigene Kachelbeschriftungen (Schlüssel: Text)",
      "sun_entity": "Sonnen-Entität (Tag / Nacht)",
      "shutter_color": "Farbe des Ladens",
      "show_slider": "Schieberegler anzeigen",
      "show_tilt": "Neigung anzeigen",
      "image": "Eigenes Bild (URL)",
      "illustration_size": "Größe der Illustration",
      "transparent": "Transparenter Hintergrund"
    },
    "fr": {
      "animations": "Animations",
      "battery_low": "Batterie faible (%)",
      "buffer_tank": "Ballon tampon",
      "capacity_kwh": "Capacité (kWh)",
      "car_color": "Couleur de la voiture",
      "compressor_threshold": "Seuil du compresseur (W)",
      "entity": "Entité principale",
      "entity_active_power": "Puissance active",
      "entity_area": "Surface nettoyée",
      "entity_battery": "Batterie",
      "entity_blade": "Lame",
      "entity_brush": "Brosse",
      "entity_buffer_temp": "Température du ballon tampon",
      "entity_car_soc": "Batterie de la voiture",
      "entity_charge": "Charge de la batterie",
      "entity_compressor": "Compresseur",
      "entity_control": "Commande (bouton / interrupteur)",
      "entity_cop": "COP",
      "entity_cost": "Coût",
      "entity_energy": "Énergie",
      "entity_fault": "Capteur de défaut",
      "entity_filter": "Filtre",
      "entity_flame": "Flamme",
      "entity_float": "Flotteur de niveau haut",
      "entity_floor_temp": "Température du sol",
      "entity_flow": "Débit (L/min, m³/h…)",
      "entity_flow_rate": "Débit",
      "entity_flow_temp": "Température de départ",
      "entity_flue_temp": "Température des fumées",
      "entity_fuel_level": "Niveau de carburant",
      "entity_fuel_used": "Carburant consommé",
      "entity_gas": "Consommation de gaz",
      "entity_hc": "Index heures creuses",
      "entity_heat_energy": "Énergie thermique",
      "entity_heat_power": "Puissance thermique",
      "entity_hp": "Index heures pleines",
      "entity_humidity": "Humidité",
      "entity_injection": "Index d'injection",
      "entity_input_voltage": "Tension d'entrée",
      "entity_level": "Niveau (%)",
      "entity_light": "Éclairage",
      "entity_load": "Charge connectée",
      "entity_mode": "Mode",
      "entity_modulation": "Modulation",
      "entity_next_start": "Prochain départ",
      "entity_output_voltage": "Tension de sortie",
      "entity_pellet_level": "Niveau de granulés",
      "entity_ph": "PH",
      "entity_power": "Puissance",
      "entity_power_injection": "Puissance injectée",
      "entity_power_l1": "Puissance L1",
      "entity_power_l2": "Puissance L2",
      "entity_power_l3": "Puissance L3",
      "entity_pressure": "Pression",
      "entity_rain": "Capteur de pluie",
      "entity_return_temp": "Température de retour",
      "entity_runtime": "Durée de fonctionnement",
      "entity_scop": "SCOP",
      "entity_session_energy": "Énergie de la session",
      "entity_soc": "Niveau de charge",
      "entity_source_in_temp": "Température d'entrée source",
      "entity_source_out_temp": "Température de sortie source",
      "entity_source_pump": "Pompe de captage",
      "entity_starts": "Nombre de démarrages",
      "entity_status": "Capteur d'état",
      "entity_switch": "Prise / interrupteur",
      "entity_target_temp": "Température de consigne",
      "entity_tariff": "Tarif en cours",
      "entity_temp": "Température",
      "entity_temperature": "Température",
      "entity_time": "Temps restant",
      "entity_water_level": "Niveau d'eau",
      "entity_water_temp": "Température de l'eau",
      "filter_alert": "Alerte filtre (%)",
      "filter_threshold": "Seuil d'alerte filtre",
      "floor_max": "Température max du sol (°C)",
      "flow_temp_max": "Température max de départ (°C)",
      "fluid_color": "Couleur du fluide",
      "fuel_alert": "Alerte carburant (%)",
      "hc_ranges": "Heures creuses (ex. 22:00-06:00)",
      "heat_threshold": "Seuil de chauffe (W)",
      "heater_threshold": "Seuil du poêle (W)",
      "heating_delay": "Délai de chauffe",
      "heating_type": "Type de chauffage (eau / électrique)",
      "ignition_threshold": "Seuil d'allumage (W)",
      "indexes": "Index du compteur",
      "invert": "Inverser l'état",
      "invert_position": "Inverser la position (ouvert ↔ fermé)",
      "invert_power": "Inverser le signe de la puissance",
      "jets_threshold": "Seuil des jets (W)",
      "language": "Langue",
      "layout": "Disposition",
      "leaves": "Nombre de vantaux",
      "level_max": "Alerte niveau haut (%)",
      "level_min": "Alerte niveau bas (%)",
      "load_max": "Surcharge au-dessus de (%)",
      "low_threshold": "Seuil bas",
      "mains_min": "Coupure secteur en dessous de (V)",
      "max_flow": "Débit maximal (L/min)",
      "max_power": "Puissance maximale (W)",
      "max_pressure": "Échelle du manomètre (bar)",
      "moving_threshold": "Seuil moteur en mouvement (W)",
      "name": "Nom",
      "off_threshold": "Seuil d'arrêt (W)",
      "pellet_alert": "Alerte granulés (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Jauge par phase",
      "power_max": "Puissance maximale",
      "pressure_max": "Alerte surpression (bar)",
      "price_per_kwh": "Prix du kWh",
      "price_per_liter": "Prix du litre",
      "price_per_unit": "Prix par unité",
      "ready_margin": "Marge « prêt » (°C)",
      "run_threshold": "Seuil de marche (W)",
      "show_area": "Afficher la surface",
      "show_battery": "Afficher la batterie",
      "show_blade": "Afficher la lame",
      "show_buttons": "Afficher les boutons",
      "show_charge": "Afficher la charge de la batterie",
      "show_consumables": "Afficher les consommables",
      "show_controls": "Afficher les boutons",
      "show_cost": "Afficher le coût",
      "show_duration": "Afficher la durée",
      "show_energy": "Afficher l'énergie",
      "show_fan": "Afficher la puissance d'aspiration",
      "show_filter": "Afficher le filtre",
      "show_floor": "Afficher la température du sol",
      "show_flow": "Afficher le débit",
      "show_fuel": "Afficher le carburant",
      "show_fuel_used": "Afficher le carburant consommé",
      "show_gas": "Afficher le gaz",
      "show_gauge": "Afficher la jauge",
      "show_humidity": "Afficher l'humidité",
      "show_index": "Afficher l'index",
      "show_injection": "Afficher l'injection",
      "show_level": "Afficher le niveau",
      "show_load": "Afficher la charge connectée",
      "show_mode": "Afficher le mode",
      "show_modulation": "Afficher la modulation",
      "show_next": "Afficher le prochain départ",
      "show_pellets": "Afficher les granulés",
      "show_ph": "Afficher le pH",
      "show_phases": "Afficher les phases",
      "show_position": "Afficher la position",
      "show_power": "Afficher la puissance",
      "show_pressure": "Afficher la pression",
      "show_runtime": "Afficher la durée de fonctionnement",
      "show_since": "Afficher le dernier changement",
      "show_soc": "Afficher le niveau de charge",
      "show_starts": "Afficher les démarrages",
      "show_status": "Afficher l'état",
      "show_status_tile": "Afficher la tuile d'état",
      "show_tariff": "Afficher le tarif",
      "show_temp": "Afficher la température",
      "show_temperature": "Afficher la température",
      "show_temps": "Afficher les températures",
      "show_time": "Afficher le temps",
      "show_voltage": "Afficher les tensions",
      "show_water": "Afficher la température de l'eau",
      "show_water_level": "Afficher le niveau d'eau",
      "show_water_temp": "Afficher la température de l'eau",
      "small": "Compact",
      "source_threshold": "Seuil de la pompe de captage (W)",
      "status_position": "Position de l'état",
      "subscribed_power": "Puissance souscrite (kVA)",
      "target_temp": "Température de consigne",
      "temp_max": "Température maximale",
      "temp_min": "Température minimale",
      "temp_scale": "Échelle du thermomètre",
      "threshold": "Seuil de puissance (W)",
      "travel_time": "Temps de course (s)",
      "water_level_full": "Niveau d'eau « plein »",
      "water_level_min": "Niveau d'eau minimal",
      "water_max": "Température max de l'eau (°C)",
      "color": "Couleur de la lumière",
      "follow_light_color": "Suivre la couleur de l'ampoule",
      "color_cycle": "Défilement des couleurs",
      "multicolor": "Guirlande multicolore",
      "show_brightness": "Afficher la luminosité",
      "labels": "Libellés perso des tuiles (clé : texte)",
      "sun_entity": "Entité soleil (jour / nuit)",
      "shutter_color": "Couleur du volet",
      "show_slider": "Afficher les curseurs",
      "show_tilt": "Afficher l'inclinaison",
      "image": "Image perso (URL)",
      "illustration_size": "Taille de l'illustration",
      "transparent": "Fond transparent"
    },
    "nb": {
      "illustration_size": "Størrelse på illustrasjonen",
      "transparent": "Gjennomsiktig bakgrunn",
      "image": "Eget bilde (URL)",
      "sun_entity": "Sol-entitet (dag / natt)",
      "shutter_color": "Farge på skodden",
      "show_slider": "Vis glidebrytere",
      "show_tilt": "Vis vinkel",
      "labels": "Egne flisetiketter (nøkkel: tekst)",
      "animations": "Animasjoner",
      "battery_low": "Lavt batteri (%)",
      "buffer_tank": "Akkumulatortank",
      "capacity_kwh": "Kapasitet (kWh)",
      "car_color": "Bilfarge",
      "compressor_threshold": "Kompressorterskel (W)",
      "entity": "Hovedentitet",
      "entity_active_power": "Aktiv effekt",
      "entity_area": "Rengjort areal",
      "entity_battery": "Batteri",
      "entity_blade": "Kniv",
      "entity_brush": "Børste",
      "entity_buffer_temp": "Akkumulatortanktemperatur",
      "entity_car_soc": "Bilens batteri",
      "entity_charge": "Batterinivå",
      "entity_compressor": "Kompressor",
      "entity_control": "Styring (knapp / bryter)",
      "entity_cop": "COP",
      "entity_cost": "Kostnad",
      "entity_energy": "Energi",
      "entity_fault": "Feilsensor",
      "entity_filter": "Filter",
      "entity_flame": "Flamme",
      "entity_float": "Høynivåflottør",
      "entity_floor_temp": "Gulvtemperatur",
      "entity_flow": "Gjennomstrømning (L/min, m³/h…)",
      "entity_flow_rate": "Gjennomstrømning",
      "entity_flow_temp": "Turtemperatur",
      "entity_flue_temp": "Røykgasstemperatur",
      "entity_fuel_level": "Drivstoffnivå",
      "entity_fuel_used": "Brukt drivstoff",
      "entity_gas": "Gassforbruk",
      "entity_hc": "Indeks lavlast",
      "entity_heat_energy": "Varmeenergi",
      "entity_heat_power": "Varmeeffekt",
      "entity_hp": "Indeks høylast",
      "entity_humidity": "Fuktighet",
      "entity_injection": "Innmatingsindeks",
      "entity_input_voltage": "Inngangsspenning",
      "entity_level": "Nivå (%)",
      "entity_light": "Lys",
      "entity_load": "Belastning",
      "entity_mode": "Modus",
      "entity_modulation": "Modulering",
      "entity_next_start": "Neste start",
      "entity_output_voltage": "Utgangsspenning",
      "entity_pellet_level": "Pelletsnivå",
      "entity_ph": "PH",
      "entity_power": "Effekt",
      "entity_power_injection": "Innmatet effekt",
      "entity_power_l1": "Effekt L1",
      "entity_power_l2": "Effekt L2",
      "entity_power_l3": "Effekt L3",
      "entity_pressure": "Trykk",
      "entity_rain": "Regnsensor",
      "entity_return_temp": "Returtemperatur",
      "entity_runtime": "Driftstid",
      "entity_scop": "SCOP",
      "entity_session_energy": "Øktens energi",
      "entity_soc": "Ladenivå",
      "entity_source_in_temp": "Kilde inn-temperatur",
      "entity_source_out_temp": "Kilde ut-temperatur",
      "entity_source_pump": "Kildepumpe",
      "entity_starts": "Antall starter",
      "entity_status": "Statussensor",
      "entity_switch": "Stikkontakt / bryter",
      "entity_target_temp": "Måltemperatur",
      "entity_tariff": "Gjeldende tariff",
      "entity_temp": "Temperatur",
      "entity_temperature": "Temperatur",
      "entity_time": "Gjenstående tid",
      "entity_water_level": "Vannstand",
      "entity_water_temp": "Vanntemperatur",
      "filter_alert": "Filtervarsel (%)",
      "filter_threshold": "Filtervarslingsterskel",
      "floor_max": "Maks gulvtemperatur (°C)",
      "flow_temp_max": "Maks turtemperatur (°C)",
      "fluid_color": "Væskefarge",
      "fuel_alert": "Drivstoffvarsel (%)",
      "hc_ranges": "Lavlasttimer (f.eks. 22:00-06:00)",
      "heat_threshold": "Varmeterskel (W)",
      "heater_threshold": "Ovnsterskel (W)",
      "heating_delay": "Oppvarmingsforsinkelse",
      "heating_type": "Varmetype (vann / elektrisk)",
      "ignition_threshold": "Tenningsterskel (W)",
      "indexes": "Målerindekser",
      "invert": "Inverter tilstand",
      "invert_position": "Inverter posisjon (åpen ↔ lukket)",
      "invert_power": "Inverter effektfortegn",
      "jets_threshold": "Dyseterskel (W)",
      "language": "Språk",
      "layout": "Oppsett",
      "leaves": "Antall fløyer",
      "level_max": "Varsel høyt nivå (%)",
      "level_min": "Varsel lavt nivå (%)",
      "load_max": "Overbelastning over (%)",
      "low_threshold": "Lav terskel",
      "mains_min": "Strømbrudd under (V)",
      "max_flow": "Maks gjennomstrømning (L/min)",
      "max_power": "Maks effekt (W)",
      "max_pressure": "Manometerskala (bar)",
      "moving_threshold": "Terskel motor i bevegelse (W)",
      "name": "Navn",
      "off_threshold": "Av-terskel (W)",
      "pellet_alert": "Pelletsvarsel (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Fasemåler",
      "power_max": "Maks effekt",
      "pressure_max": "Overtrykksvarsel (bar)",
      "price_per_kwh": "Pris per kWh",
      "price_per_liter": "Pris per liter",
      "price_per_unit": "Pris per enhet",
      "ready_margin": "Klar-margin (°C)",
      "run_threshold": "Driftsterskel (W)",
      "show_area": "Vis areal",
      "show_battery": "Vis batteri",
      "show_blade": "Vis kniv",
      "show_buttons": "Vis knapper",
      "show_charge": "Vis batterinivå",
      "show_consumables": "Vis forbruksdeler",
      "show_controls": "Vis knapper",
      "show_cost": "Vis kostnad",
      "show_duration": "Vis varighet",
      "show_energy": "Vis energi",
      "show_fan": "Vis sugeeffekt",
      "show_filter": "Vis filter",
      "show_floor": "Vis gulvtemperatur",
      "show_flow": "Vis gjennomstrømning",
      "show_fuel": "Vis drivstoff",
      "show_fuel_used": "Vis brukt drivstoff",
      "show_gas": "Vis gass",
      "show_gauge": "Vis måler",
      "show_humidity": "Vis fuktighet",
      "show_index": "Vis indeks",
      "show_injection": "Vis innmating",
      "show_level": "Vis nivå",
      "show_load": "Vis belastning",
      "show_mode": "Vis modus",
      "show_modulation": "Vis modulering",
      "show_next": "Vis neste start",
      "show_pellets": "Vis pellets",
      "show_ph": "Vis pH",
      "show_phases": "Vis faser",
      "show_position": "Vis posisjon",
      "show_power": "Vis effekt",
      "show_pressure": "Vis trykk",
      "show_runtime": "Vis driftstid",
      "show_since": "Vis siste endring",
      "show_soc": "Vis ladenivå",
      "show_starts": "Vis starter",
      "show_status": "Vis status",
      "show_status_tile": "Vis statusflis",
      "show_tariff": "Vis tariff",
      "show_temp": "Vis temperatur",
      "show_temperature": "Vis temperatur",
      "show_temps": "Vis temperaturer",
      "show_time": "Vis tid",
      "show_voltage": "Vis spenninger",
      "show_water": "Vis vanntemperatur",
      "show_water_level": "Vis vannstand",
      "show_water_temp": "Vis vanntemperatur",
      "small": "Kompakt",
      "source_threshold": "Terskel kildepumpe (W)",
      "status_position": "Statusplassering",
      "subscribed_power": "Abonnert effekt (kVA)",
      "target_temp": "Måltemperatur",
      "temp_max": "Maks temperatur",
      "temp_min": "Min temperatur",
      "temp_scale": "Termometerskala",
      "threshold": "Effektterskel (W)",
      "travel_time": "Gangtid (s)",
      "water_level_full": "Vannstand «full»",
      "water_level_min": "Minimum vannstand",
      "water_max": "Maks vanntemperatur (°C)",
      "color": "Lysfarge",
      "follow_light_color": "Følg pærens farge",
      "color_cycle": "Fargesyklus",
      "multicolor": "Flerfarget lysslynge",
      "show_brightness": "Vis lysstyrke"
    },
    "nl": {
      "animations": "Animaties",
      "battery_low": "Batterij bijna leeg (%)",
      "buffer_tank": "Buffervat",
      "capacity_kwh": "Capaciteit (kWh)",
      "car_color": "Kleur van de auto",
      "compressor_threshold": "Compressordrempel (W)",
      "entity": "Hoofdentiteit",
      "entity_active_power": "Actief vermogen",
      "entity_area": "Gereinigd oppervlak",
      "entity_battery": "Batterij",
      "entity_blade": "Mes",
      "entity_brush": "Borstel",
      "entity_buffer_temp": "Buffervattemperatuur",
      "entity_car_soc": "Accu van de auto",
      "entity_charge": "Batterijlading",
      "entity_compressor": "Compressor",
      "entity_control": "Bediening (knop / schakelaar)",
      "entity_cop": "COP",
      "entity_cost": "Kosten",
      "entity_energy": "Energie",
      "entity_fault": "Storingssensor",
      "entity_filter": "Filter",
      "entity_flame": "Vlam",
      "entity_float": "Hoogniveau-vlotter",
      "entity_floor_temp": "Vloertemperatuur",
      "entity_flow": "Debiet (L/min, m³/h…)",
      "entity_flow_rate": "Debiet",
      "entity_flow_temp": "Aanvoertemperatuur",
      "entity_flue_temp": "Rookgastemperatuur",
      "entity_fuel_level": "Brandstofniveau",
      "entity_fuel_used": "Verbruikte brandstof",
      "entity_gas": "Gasverbruik",
      "entity_hc": "Index daluren",
      "entity_heat_energy": "Warmte-energie",
      "entity_heat_power": "Warmtevermogen",
      "entity_hp": "Index piekuren",
      "entity_humidity": "Vochtigheid",
      "entity_injection": "Teruglevering-index",
      "entity_input_voltage": "Ingangsspanning",
      "entity_level": "Niveau (%)",
      "entity_light": "Verlichting",
      "entity_load": "Belasting",
      "entity_mode": "Modus",
      "entity_modulation": "Modulatie",
      "entity_next_start": "Volgende start",
      "entity_output_voltage": "Uitgangsspanning",
      "entity_pellet_level": "Pelletniveau",
      "entity_ph": "PH",
      "entity_power": "Vermogen",
      "entity_power_injection": "Teruggeleverd vermogen",
      "entity_power_l1": "Vermogen L1",
      "entity_power_l2": "Vermogen L2",
      "entity_power_l3": "Vermogen L3",
      "entity_pressure": "Druk",
      "entity_rain": "Regensensor",
      "entity_return_temp": "Retourtemperatuur",
      "entity_runtime": "Looptijd",
      "entity_scop": "SCOP",
      "entity_session_energy": "Sessie-energie",
      "entity_soc": "Laadtoestand",
      "entity_source_in_temp": "Bron ingangstemperatuur",
      "entity_source_out_temp": "Bron uitgangstemperatuur",
      "entity_source_pump": "Bronpomp",
      "entity_starts": "Aantal starts",
      "entity_status": "Statussensor",
      "entity_switch": "Stekker / schakelaar",
      "entity_target_temp": "Doeltemperatuur",
      "entity_tariff": "Huidig tarief",
      "entity_temp": "Temperatuur",
      "entity_temperature": "Temperatuur",
      "entity_time": "Resterende tijd",
      "entity_water_level": "Waterniveau",
      "entity_water_temp": "Watertemperatuur",
      "filter_alert": "Filterwaarschuwing (%)",
      "filter_threshold": "Filterwaarschuwingsdrempel",
      "floor_max": "Max. vloertemperatuur (°C)",
      "flow_temp_max": "Max. aanvoertemperatuur (°C)",
      "fluid_color": "Kleur van de vloeistof",
      "fuel_alert": "Brandstofwaarschuwing (%)",
      "hc_ranges": "Daluren (bv. 22:00-06:00)",
      "heat_threshold": "Verwarmingsdrempel (W)",
      "heater_threshold": "Kacheldrempel (W)",
      "heating_delay": "Opwarmvertraging",
      "heating_type": "Type verwarming (water / elektrisch)",
      "ignition_threshold": "Ontstekingsdrempel (W)",
      "indexes": "Meterstanden",
      "invert": "Status omkeren",
      "invert_position": "Positie omkeren (open ↔ dicht)",
      "invert_power": "Teken van vermogen omkeren",
      "jets_threshold": "Jetsdrempel (W)",
      "language": "Taal",
      "layout": "Indeling",
      "leaves": "Aantal vleugels",
      "level_max": "Waarschuwing hoog niveau (%)",
      "level_min": "Waarschuwing laag niveau (%)",
      "load_max": "Overbelasting boven (%)",
      "low_threshold": "Lage drempel",
      "mains_min": "Netuitval onder (V)",
      "max_flow": "Maximaal debiet (L/min)",
      "max_power": "Maximaal vermogen (W)",
      "max_pressure": "Schaal manometer (bar)",
      "moving_threshold": "Drempel motor in beweging (W)",
      "name": "Naam",
      "off_threshold": "Uitdrempel (W)",
      "pellet_alert": "Pelletwaarschuwing (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Fasemeter",
      "power_max": "Maximaal vermogen",
      "pressure_max": "Overdrukwaarschuwing (bar)",
      "price_per_kwh": "Prijs per kWh",
      "price_per_liter": "Prijs per liter",
      "price_per_unit": "Prijs per eenheid",
      "ready_margin": "Klaar-marge (°C)",
      "run_threshold": "Drempel in bedrijf (W)",
      "show_area": "Oppervlak tonen",
      "show_battery": "Batterij tonen",
      "show_blade": "Mes tonen",
      "show_buttons": "Knoppen tonen",
      "show_charge": "Batterijlading tonen",
      "show_consumables": "Verbruiksartikelen tonen",
      "show_controls": "Knoppen tonen",
      "show_cost": "Kosten tonen",
      "show_duration": "Duur tonen",
      "show_energy": "Energie tonen",
      "show_fan": "Zuigkracht tonen",
      "show_filter": "Filter tonen",
      "show_floor": "Vloertemperatuur tonen",
      "show_flow": "Debiet tonen",
      "show_fuel": "Brandstof tonen",
      "show_fuel_used": "Verbruikte brandstof tonen",
      "show_gas": "Gas tonen",
      "show_gauge": "Meter tonen",
      "show_humidity": "Vochtigheid tonen",
      "show_index": "Meterstand tonen",
      "show_injection": "Teruglevering tonen",
      "show_level": "Niveau tonen",
      "show_load": "Belasting tonen",
      "show_mode": "Modus tonen",
      "show_modulation": "Modulatie tonen",
      "show_next": "Volgende start tonen",
      "show_pellets": "Pellets tonen",
      "show_ph": "PH tonen",
      "show_phases": "Fasen tonen",
      "show_position": "Positie tonen",
      "show_power": "Vermogen tonen",
      "show_pressure": "Druk tonen",
      "show_runtime": "Looptijd tonen",
      "show_since": "Laatste wijziging tonen",
      "show_soc": "Laadtoestand tonen",
      "show_starts": "Starts tonen",
      "show_status": "Status tonen",
      "show_status_tile": "Statustegel tonen",
      "show_tariff": "Tarief tonen",
      "show_temp": "Temperatuur tonen",
      "show_temperature": "Temperatuur tonen",
      "show_temps": "Temperaturen tonen",
      "show_time": "Tijd tonen",
      "show_voltage": "Spanningen tonen",
      "show_water": "Watertemperatuur tonen",
      "show_water_level": "Waterniveau tonen",
      "show_water_temp": "Watertemperatuur tonen",
      "small": "Compact",
      "source_threshold": "Drempel bronpomp (W)",
      "status_position": "Positie van de status",
      "subscribed_power": "Gecontracteerd vermogen (kVA)",
      "target_temp": "Doeltemperatuur",
      "temp_max": "Maximale temperatuur",
      "temp_min": "Minimale temperatuur",
      "temp_scale": "Schaal thermometer",
      "threshold": "Vermogensdrempel (W)",
      "travel_time": "Looptijd motor (s)",
      "water_level_full": "Waterniveau „vol“",
      "water_level_min": "Minimaal waterniveau",
      "water_max": "Max. watertemperatuur (°C)",
      "color": "Lichtkleur",
      "follow_light_color": "Kleur van de lamp volgen",
      "color_cycle": "Kleurenwissel",
      "multicolor": "Veelkleurige lichtjes",
      "show_brightness": "Helderheid tonen",
      "labels": "Eigen tegellabels (sleutel: tekst)",
      "sun_entity": "Zon-entiteit (dag / nacht)",
      "shutter_color": "Kleur van het luik",
      "show_slider": "Schuifregelaars tonen",
      "show_tilt": "Kanteling tonen",
      "image": "Eigen afbeelding (URL)",
      "illustration_size": "Grootte van de illustratie",
      "transparent": "Transparante achtergrond"
    },
    "ro": {
      "animations": "Animații",
      "battery_low": "Baterie descărcată (%)",
      "buffer_tank": "Rezervor tampon",
      "capacity_kwh": "Capacitate (kWh)",
      "car_color": "Culoarea mașinii",
      "compressor_threshold": "Prag compresor (W)",
      "entity": "Entitate principală",
      "entity_active_power": "Putere activă",
      "entity_area": "Suprafață curățată",
      "entity_battery": "Baterie",
      "entity_blade": "Lamă",
      "entity_brush": "Perie",
      "entity_buffer_temp": "Temperatura rezervorului tampon",
      "entity_car_soc": "Bateria mașinii",
      "entity_charge": "Încărcare baterie",
      "entity_compressor": "Compresor",
      "entity_control": "Comandă (buton / comutator)",
      "entity_cop": "COP",
      "entity_cost": "Cost",
      "entity_energy": "Energie",
      "entity_fault": "Senzor de defect",
      "entity_filter": "Filtru",
      "entity_flame": "Flacără",
      "entity_float": "Plutitor nivel ridicat",
      "entity_floor_temp": "Temperatura pardoselii",
      "entity_flow": "Debit (L/min, m³/h…)",
      "entity_flow_rate": "Debit",
      "entity_flow_temp": "Temperatură tur",
      "entity_flue_temp": "Temperatura gazelor arse",
      "entity_fuel_level": "Nivel combustibil",
      "entity_fuel_used": "Combustibil consumat",
      "entity_gas": "Consum de gaz",
      "entity_hc": "Index ore de gol",
      "entity_heat_energy": "Energie termică",
      "entity_heat_power": "Putere termică",
      "entity_hp": "Index ore de vârf",
      "entity_humidity": "Umiditate",
      "entity_injection": "Index injecție",
      "entity_input_voltage": "Tensiune de intrare",
      "entity_level": "Nivel (%)",
      "entity_light": "Lumină",
      "entity_load": "Sarcină",
      "entity_mode": "Mod",
      "entity_modulation": "Modulare",
      "entity_next_start": "Următoarea pornire",
      "entity_output_voltage": "Tensiune de ieșire",
      "entity_pellet_level": "Nivel peleți",
      "entity_ph": "PH",
      "entity_power": "Putere",
      "entity_power_injection": "Putere injectată",
      "entity_power_l1": "Putere L1",
      "entity_power_l2": "Putere L2",
      "entity_power_l3": "Putere L3",
      "entity_pressure": "Presiune",
      "entity_rain": "Senzor de ploaie",
      "entity_return_temp": "Temperatură retur",
      "entity_runtime": "Timp de funcționare",
      "entity_scop": "SCOP",
      "entity_session_energy": "Energia sesiunii",
      "entity_soc": "Nivel de încărcare",
      "entity_source_in_temp": "Temperatură intrare sursă",
      "entity_source_out_temp": "Temperatură ieșire sursă",
      "entity_source_pump": "Pompă sursă",
      "entity_starts": "Număr de porniri",
      "entity_status": "Senzor de stare",
      "entity_switch": "Priză / comutator",
      "entity_target_temp": "Temperatură țintă",
      "entity_tariff": "Tarif curent",
      "entity_temp": "Temperatură",
      "entity_temperature": "Temperatură",
      "entity_time": "Timp rămas",
      "entity_water_level": "Nivelul apei",
      "entity_water_temp": "Temperatura apei",
      "filter_alert": "Alertă filtru (%)",
      "filter_threshold": "Prag alertă filtru",
      "floor_max": "Temperatură max pardoseală (°C)",
      "flow_temp_max": "Temperatură max tur (°C)",
      "fluid_color": "Culoarea fluidului",
      "fuel_alert": "Alertă combustibil (%)",
      "hc_ranges": "Ore de gol (ex. 22:00-06:00)",
      "heat_threshold": "Prag de încălzire (W)",
      "heater_threshold": "Prag sobă (W)",
      "heating_delay": "Întârziere încălzire",
      "heating_type": "Tip încălzire (apă / electric)",
      "ignition_threshold": "Prag de aprindere (W)",
      "indexes": "Indexuri contor",
      "invert": "Inversează starea",
      "invert_position": "Inversează poziția (deschis ↔ închis)",
      "invert_power": "Inversează semnul puterii",
      "jets_threshold": "Prag jeturi (W)",
      "language": "Limbă",
      "layout": "Aspect",
      "leaves": "Număr de canate",
      "level_max": "Alertă nivel ridicat (%)",
      "level_min": "Alertă nivel scăzut (%)",
      "load_max": "Suprasarcină peste (%)",
      "low_threshold": "Prag scăzut",
      "mains_min": "Pană de rețea sub (V)",
      "max_flow": "Debit maxim (L/min)",
      "max_power": "Putere maximă (W)",
      "max_pressure": "Scala manometrului (bar)",
      "moving_threshold": "Prag motor în mișcare (W)",
      "name": "Nume",
      "off_threshold": "Prag de oprire (W)",
      "pellet_alert": "Alertă peleți (%)",
      "ph_max": "PH max",
      "ph_min": "PH min",
      "phase_gauge": "Indicator pe fază",
      "power_max": "Putere maximă",
      "pressure_max": "Alertă suprapresiune (bar)",
      "price_per_kwh": "Preț pe kWh",
      "price_per_liter": "Preț pe litru",
      "price_per_unit": "Preț pe unitate",
      "ready_margin": "Marjă „gata” (°C)",
      "run_threshold": "Prag de funcționare (W)",
      "show_area": "Afișează suprafața",
      "show_battery": "Afișează bateria",
      "show_blade": "Afișează lama",
      "show_buttons": "Afișează butoanele",
      "show_charge": "Afișează încărcarea bateriei",
      "show_consumables": "Afișează consumabilele",
      "show_controls": "Afișează butoanele",
      "show_cost": "Afișează costul",
      "show_duration": "Afișează durata",
      "show_energy": "Afișează energia",
      "show_fan": "Afișează puterea de aspirare",
      "show_filter": "Afișează filtrul",
      "show_floor": "Afișează temperatura pardoselii",
      "show_flow": "Afișează debitul",
      "show_fuel": "Afișează combustibilul",
      "show_fuel_used": "Afișează combustibilul consumat",
      "show_gas": "Afișează gazul",
      "show_gauge": "Afișează indicatorul",
      "show_humidity": "Afișează umiditatea",
      "show_index": "Afișează indexul",
      "show_injection": "Afișează injecția",
      "show_level": "Afișează nivelul",
      "show_load": "Afișează sarcina",
      "show_mode": "Afișează modul",
      "show_modulation": "Afișează modularea",
      "show_next": "Afișează următoarea pornire",
      "show_pellets": "Afișează peleții",
      "show_ph": "Afișează pH-ul",
      "show_phases": "Afișează fazele",
      "show_position": "Afișează poziția",
      "show_power": "Afișează puterea",
      "show_pressure": "Afișează presiunea",
      "show_runtime": "Afișează timpul de funcționare",
      "show_since": "Afișează ultima schimbare",
      "show_soc": "Afișează nivelul de încărcare",
      "show_starts": "Afișează pornirile",
      "show_status": "Afișează starea",
      "show_status_tile": "Afișează caseta de stare",
      "show_tariff": "Afișează tariful",
      "show_temp": "Afișează temperatura",
      "show_temperature": "Afișează temperatura",
      "show_temps": "Afișează temperaturile",
      "show_time": "Afișează timpul",
      "show_voltage": "Afișează tensiunile",
      "show_water": "Afișează temperatura apei",
      "show_water_level": "Afișează nivelul apei",
      "show_water_temp": "Afișează temperatura apei",
      "small": "Compact",
      "source_threshold": "Prag pompă sursă (W)",
      "status_position": "Poziția stării",
      "subscribed_power": "Putere contractată (kVA)",
      "target_temp": "Temperatură țintă",
      "temp_max": "Temperatură maximă",
      "temp_min": "Temperatură minimă",
      "temp_scale": "Scala termometrului",
      "threshold": "Prag de putere (W)",
      "travel_time": "Timp de cursă (s)",
      "water_level_full": "Nivel apă „plin”",
      "water_level_min": "Nivel minim al apei",
      "water_max": "Temperatură max apă (°C)",
      "color": "Culoarea luminii",
      "follow_light_color": "Urmează culoarea becului",
      "color_cycle": "Ciclu de culori",
      "multicolor": "Instalație multicoloră",
      "show_brightness": "Afișează luminozitatea",
      "labels": "Etichete proprii pentru plăci (cheie: text)",
      "sun_entity": "Entitate soare (zi / noapte)",
      "shutter_color": "Culoarea obloanelor",
      "show_slider": "Afișează cursoarele",
      "show_tilt": "Afișează înclinarea",
      "image": "Imagine proprie (URL)",
      "illustration_size": "Dimensiunea ilustrației",
      "transparent": "Fundal transparent"
    },
    "ru": {
      "animations": "Анимации",
      "battery_low": "Низкий заряд (%)",
      "buffer_tank": "Буферный бак",
      "capacity_kwh": "Ёмкость (кВт·ч)",
      "car_color": "Цвет автомобиля",
      "compressor_threshold": "Порог компрессора (Вт)",
      "entity": "Основная сущность",
      "entity_active_power": "Активная мощность",
      "entity_area": "Убранная площадь",
      "entity_battery": "Батарея",
      "entity_blade": "Нож",
      "entity_brush": "Щётка",
      "entity_buffer_temp": "Температура буферного бака",
      "entity_car_soc": "Заряд батареи автомобиля",
      "entity_charge": "Заряд батареи",
      "entity_compressor": "Компрессор",
      "entity_control": "Управление (кнопка / выключатель)",
      "entity_cop": "COP",
      "entity_cost": "Стоимость",
      "entity_energy": "Энергия",
      "entity_fault": "Датчик неисправности",
      "entity_filter": "Фильтр",
      "entity_flame": "Пламя",
      "entity_float": "Поплавок высокого уровня",
      "entity_floor_temp": "Температура пола",
      "entity_flow": "Поток (л/мин, м³/ч…)",
      "entity_flow_rate": "Расход",
      "entity_flow_temp": "Температура подачи",
      "entity_flue_temp": "Температура дымовых газов",
      "entity_fuel_level": "Уровень топлива",
      "entity_fuel_used": "Израсходовано топлива",
      "entity_gas": "Расход газа",
      "entity_hc": "Индекс внепиковых часов",
      "entity_heat_energy": "Тепловая энергия",
      "entity_heat_power": "Тепловая мощность",
      "entity_hp": "Индекс пиковых часов",
      "entity_humidity": "Влажность",
      "entity_injection": "Индекс экспорта",
      "entity_input_voltage": "Входное напряжение",
      "entity_level": "Уровень (%)",
      "entity_light": "Свет",
      "entity_load": "Нагрузка",
      "entity_mode": "Режим",
      "entity_modulation": "Модуляция",
      "entity_next_start": "Следующий запуск",
      "entity_output_voltage": "Выходное напряжение",
      "entity_pellet_level": "Уровень пеллет",
      "entity_ph": "pH",
      "entity_power": "Мощность",
      "entity_power_injection": "Мощность экспорта",
      "entity_power_l1": "Мощность L1",
      "entity_power_l2": "Мощность L2",
      "entity_power_l3": "Мощность L3",
      "entity_pressure": "Давление",
      "entity_rain": "Датчик дождя",
      "entity_return_temp": "Температура обратки",
      "entity_runtime": "Наработка",
      "entity_scop": "SCOP",
      "entity_session_energy": "Энергия сессии",
      "entity_soc": "Уровень заряда",
      "entity_source_in_temp": "Температура источника на входе",
      "entity_source_out_temp": "Температура источника на выходе",
      "entity_source_pump": "Насос источника",
      "entity_starts": "Число пусков",
      "entity_status": "Датчик статуса",
      "entity_switch": "Умная розетка / выключатель",
      "entity_target_temp": "Целевая температура",
      "entity_tariff": "Текущий тариф",
      "entity_temp": "Температура",
      "entity_temperature": "Температура",
      "entity_time": "Оставшееся время",
      "entity_water_level": "Уровень воды",
      "entity_water_temp": "Температура воды",
      "filter_alert": "Оповещение о фильтре (%)",
      "filter_threshold": "Порог оповещения о фильтре",
      "floor_max": "Макс. температура пола (°C)",
      "flow_temp_max": "Макс. температура подачи (°C)",
      "fluid_color": "Цвет жидкости",
      "fuel_alert": "Оповещение о топливе (%)",
      "hc_ranges": "Внепиковые часы (напр. 22:00-06:00)",
      "heat_threshold": "Порог нагрева (Вт)",
      "heater_threshold": "Порог нагревателя (Вт)",
      "heating_delay": "Задержка нагрева",
      "heating_type": "Тип нагрева (водяной / электрический)",
      "ignition_threshold": "Порог розжига (Вт)",
      "indexes": "Индексы счётчика",
      "invert": "Инвертировать состояние",
      "invert_position": "Инвертировать положение (открыто ↔ закрыто)",
      "invert_power": "Инвертировать знак мощности",
      "jets_threshold": "Порог форсунок (Вт)",
      "language": "Язык",
      "layout": "Компоновка",
      "leaves": "Число створок",
      "level_max": "Оповещение о высоком уровне (%)",
      "level_min": "Оповещение о низком уровне (%)",
      "load_max": "Перегрузка выше (%)",
      "low_threshold": "Нижний порог",
      "mains_min": "Потеря сети ниже (В)",
      "max_flow": "Максимальный поток (л/мин)",
      "max_power": "Максимальная мощность (Вт)",
      "max_pressure": "Шкала манометра (бар)",
      "moving_threshold": "Порог движения мотора (Вт)",
      "name": "Название",
      "off_threshold": "Порог выключения (Вт)",
      "pellet_alert": "Оповещение о пеллетах (%)",
      "ph_max": "pH макс.",
      "ph_min": "pH мин.",
      "phase_gauge": "Шкала фаз",
      "power_max": "Максимальная мощность",
      "pressure_max": "Оповещение об избыточном давлении (бар)",
      "price_per_kwh": "Цена за кВт·ч",
      "price_per_liter": "Цена за литр",
      "price_per_unit": "Цена за единицу",
      "ready_margin": "Допуск готовности (°C)",
      "run_threshold": "Порог работы (Вт)",
      "show_area": "Показывать площадь",
      "show_battery": "Показывать батарею",
      "show_blade": "Показывать нож",
      "show_buttons": "Показывать кнопки",
      "show_charge": "Показывать заряд батареи",
      "show_consumables": "Показывать расходники",
      "show_controls": "Показывать кнопки",
      "show_cost": "Показывать стоимость",
      "show_duration": "Показывать длительность",
      "show_energy": "Показывать энергию",
      "show_fan": "Показывать мощность всасывания",
      "show_filter": "Показывать фильтр",
      "show_floor": "Показывать температуру пола",
      "show_flow": "Показывать поток",
      "show_fuel": "Показывать топливо",
      "show_fuel_used": "Показывать расход топлива",
      "show_gas": "Показывать газ",
      "show_gauge": "Показывать шкалу",
      "show_humidity": "Показывать влажность",
      "show_index": "Показывать индекс",
      "show_injection": "Показывать экспорт",
      "show_level": "Показывать уровень",
      "show_load": "Показывать нагрузку",
      "show_mode": "Показывать режим",
      "show_modulation": "Показывать модуляцию",
      "show_next": "Показывать следующий запуск",
      "show_pellets": "Показывать пеллеты",
      "show_ph": "Показывать pH",
      "show_phases": "Показывать фазы",
      "show_position": "Показывать позицию",
      "show_power": "Показывать мощность",
      "show_pressure": "Показывать давление",
      "show_runtime": "Показывать наработку",
      "show_since": "Показывать последнее изменение",
      "show_soc": "Показывать уровень заряда",
      "show_starts": "Показывать пуски",
      "show_status": "Показывать статус",
      "show_status_tile": "Показывать плитку статуса",
      "show_tariff": "Показывать тариф",
      "show_temp": "Показывать температуру",
      "show_temperature": "Показывать температуру",
      "show_temps": "Показывать температуры",
      "show_time": "Показывать время",
      "show_voltage": "Показывать напряжения",
      "show_water": "Показывать температуру воды",
      "show_water_level": "Показывать уровень воды",
      "show_water_temp": "Показывать температуру воды",
      "small": "Компактный",
      "source_threshold": "Порог насоса источника (Вт)",
      "status_position": "Положение статуса",
      "subscribed_power": "Подписанная мощность (кВА)",
      "target_temp": "Целевая температура",
      "temp_max": "Максимальная температура",
      "temp_min": "Минимальная температура",
      "temp_scale": "Шкала термометра",
      "threshold": "Порог мощности (Вт)",
      "travel_time": "Время хода (с)",
      "water_level_full": "Уровень воды в полном бассейне",
      "water_level_min": "Минимальный уровень воды",
      "water_max": "Макс. температура воды (°C)",
      "color": "Цвет света",
      "follow_light_color": "Следовать цвету лампы",
      "color_cycle": "Смена цветов",
      "multicolor": "Разноцветная гирлянда",
      "show_brightness": "Показывать яркость",
      "labels": "Свои подписи плиток (ключ: текст)",
      "sun_entity": "Сущность солнца (день / ночь)",
      "shutter_color": "Цвет ставней",
      "show_slider": "Показывать ползунки",
      "show_tilt": "Показывать наклон",
      "image": "Своё изображение (URL)",
      "illustration_size": "Размер иллюстрации",
      "transparent": "Прозрачный фон"
    }
  };
  const lang = (hass) => {
    const h = hass || document.querySelector('home-assistant')?.hass;
    let l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
    if (l === 'no' || l === 'nn') l = 'nb'; // norvégien : no / nn → nb (bokmål)
    return L[l] ? l : 'en';
  };
  const human = (n) => { const t = String(n).replace(/^entity_/, '').replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
  // illustration_size (en %, 30 à 300) : échelle du dessin, lue par chaque carte via --illus-scale
  window.applianceSize = (el, cfg) => {
    const n = Number(cfg && cfg.illustration_size);
    if (n > 0) el.style.setProperty('--illus-scale', String(Math.max(0.3, Math.min(3, n / 100))));
    else el.style.removeProperty('--illus-scale');
    // dessin agrandi : la carte passe en disposition empilée plus tôt (voir card.css), sinon le titre est tronqué
    el.toggleAttribute('illus-big', n > 100);
    // transparent : la carte laisse voir le fond du tableau de bord (variables de ha-card, héritées dans le shadow DOM)
    const T = { '--ha-card-background': 'transparent', '--ha-card-box-shadow': 'none', '--ha-card-border-width': '0' };
    for (const [k, v] of Object.entries(T)) { if (cfg && cfg.transparent) el.style.setProperty(k, v); else el.style.removeProperty(k); }
  };
  window.applianceEditorLabel = (name, hass) => (name ? (L[lang(hass)] || L.en)[name] ?? L.en[name] ?? human(name) : '');
})();

/* ================================================================== */
/* appliance-aquarium-card.js                                       */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-aquarium-card — carte Lovelace aquarium animé (puissance, kWh, température, coût)
 * type: custom:appliance-aquarium-card
 */
const I18N_AQUARIUM = {
  "en": {
    "power": "Power",
    "energy": "Energy",
    "temp": "Water",
    "cost": "Cost",
    "name": "Aquarium",
    "alert": "Temperature out of range",
    "unavailable": "Unavailable"
  },
  "de": {
    "power": "Leistung",
    "energy": "Energie",
    "temp": "Wasser",
    "cost": "Kosten",
    "name": "Aquarium",
    "alert": "Temperatur außerhalb des Bereichs",
    "unavailable": "Nicht verfügbar"
  },
  "fr": {
    "power": "Puissance",
    "energy": "Énergie",
    "temp": "Eau",
    "cost": "Coût",
    "name": "Aquarium",
    "alert": "Température hors plage",
    "unavailable": "Indisponible"
  },
  "nb": {
    "power": "Effekt",
    "energy": "Energi",
    "temp": "Vann",
    "cost": "Kostnad",
    "name": "Akvarium",
    "alert": "Temperatur utenfor område",
    "unavailable": "Utilgjengelig"
  },
  "nl": {
    "power": "Vermogen",
    "energy": "Energie",
    "temp": "Water",
    "cost": "Kost",
    "name": "Aquarium",
    "alert": "Temperatuur buiten bereik",
    "unavailable": "Niet beschikbaar"
  },
  "ro": {
    "power": "Putere",
    "energy": "Energie",
    "temp": "Apă",
    "cost": "Cost",
    "name": "Acvariu",
    "alert": "Temperatură în afara intervalului",
    "unavailable": "Indisponibil"
  },
  "ru": {
    "power": "Мощность",
    "energy": "Энергия",
    "temp": "Вода",
    "cost": "Стоимость",
    "name": "Аквариум",
    "alert": "Температура вне диапазона",
    "unavailable": "Недоступно"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class ApplianceAquariumCard extends HTMLElement {
  static getStubConfig() {
    return { entity_power: '', entity_energy: '', entity_temperature: '', entity_light: '', temp_min: 24, temp_max: 27, price_per_kwh: 0.2 };
  }

  // Éditeur visuel HA
  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_light', selector: { entity: { domain: ['light', 'switch', 'input_boolean'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          { name: 'temp_min', selector: { number: { min: 0, max: 40, step: 0.5, mode: 'box' } } },
          { name: 'temp_max', selector: { number: { min: 0, max: 40, step: 0.5, mode: 'box' } } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_temperature', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_AQUARIUM) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = {
      show_power: true, show_energy: true, show_temperature: true, show_cost: true,
      temp_min: 24, temp_max: 27, price_per_kwh: 0.2, max_power: 200,
      ...config,
    };
    this._built = false;
    this._build();
  }

  set hass(hass) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(hass));
    if (l && l !== this._lng) { this._lng = l; this._hass = hass; this._built = false; this._build(); }
   
    this._hass = hass;
    this._update();
  }

  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

  _t(k) { return (I18N_AQUARIUM[this._config.language || lang(this._hass)] || I18N_AQUARIUM.en)[k] ?? I18N_AQUARIUM.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    const c = this._config;
    // Poisson tourné vers la droite (tête à x=34), flip automatique au retour
    const fish = (top, dur, delay, body, fin, scale, stripes) => `
      <g class="fish" style="--top:${top}px;--dur:${dur}s;--delay:${delay}s;--s:${scale}">
        <g style="transform:scale(${scale})">
          <path class="tail" d="M2 0 L-12 -9 L-9 0 L-12 9 Z" fill="${fin}"/>
          <path d="M0 0 C8 -10 26 -10 34 0 C26 10 8 10 0 0 Z" fill="${body}"/>
          <path d="M14 -8 L22 -14 L26 -7 Z" fill="${fin}"/>
          ${stripes ? '<path d="M10 -8 L12 8 M18 -9 L20 9 M26 -6 L27 6" stroke="#111" stroke-width="2.4" fill="none"/>' : ''}
          <circle cx="28" cy="-2" r="2" fill="#fff"/><circle cx="28.6" cy="-2" r="1" fill="#111"/>
        </g>
      </g>`;
    const bubbles = Array.from({ length: 10 }, (_, i) =>
      `<circle class="bubble" cx="${262 + (i % 4) * 5}" cy="140" r="${1.5 + (i % 3)}" style="--d:${3 + (i % 4)}s;--dl:${(i * 0.6) % 3}s"/>`).join('');
    const blade = (x, h, w, col, d, pd) => `<path class="plant" d="M${x} 146 q ${-w} ${-h / 3} 0 ${-h / 2} q ${w} ${-h / 3} 0 ${-h / 2}" stroke="${col}" style="--pd:${pd}s;transform-origin:${x}px 146px;stroke-width:${d}"/>`;
    const plants = [
      blade(30, 95, 8, '#3fbf4a', 6, 4), blade(42, 110, -9, '#58d65a', 5, 5), blade(54, 80, 7, '#35a842', 5, 6),
      blade(78, 100, 9, '#6be06a', 4, 5), blade(90, 85, -7, '#3fbf4a', 4, 4), blade(100, 70, 6, '#7ae27a', 4, 6),
      blade(195, 105, 8, '#4cc94c', 8, 4), blade(210, 85, -9, '#37ae3f', 7, 5), blade(280, 95, 7, '#4cc94c', 5, 5),
    ].join('');
    const feathers = [[135, 105], [148, 120], [160, 95], [170, 110]].map(([x, h], i) =>
      `<path class="plant" d="M${x} 146 C ${x - 10} ${146 - h / 2}, ${x + 10} ${146 - h / 1.5}, ${x} ${146 - h}" stroke="#c0789a" style="--pd:${5 + i}s;transform-origin:${x}px 146px;stroke-width:12;opacity:.85"/>`).join('');
    const urchin = Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return `<line x1="232" y1="136" x2="${232 + Math.cos(a) * 13}" y2="${136 + Math.sin(a) * 11}"/>`; }).join('');
    const speckles = Array.from({ length: 40 }, (_, i) => `<circle cx="${14 + (i * 37) % 292}" cy="${150 + (i * 13) % 12}" r="1" fill="#6f86d6" opacity=".6"/>`).join('');

    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; font-size:1.05em; margin:0 4px 8px; display:flex; justify-content:space-between; align-items:center; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .alert .badge { display:inline-block; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; border-radius:10px; transform:scale(0.8); transform-origin:top center; }
      .tint { fill:var(--water, #2a8fd6); opacity:.45; transition:fill 1.5s; }
      .night-overlay { fill:#050b24; opacity:0; transition:opacity 1.2s; }
      .night .night-overlay { opacity:.6; }
      .lamp-glow { fill:#bfe6ff; opacity:0; transition:opacity 1s; }
      .lit .lamp-glow { opacity:.22; } .lit .lamp-led { fill:#e8f6ff; } .lamp-led { fill:#444; }
      .plant { fill:none; stroke-linecap:round; animation:sway var(--pd) ease-in-out infinite alternate; }
      .bubble { fill:rgba(255,255,255,.35); stroke:rgba(255,255,255,.85); stroke-width:.6;
        animation:rise calc(var(--d) / var(--speed,1)) linear infinite; animation-delay:var(--dl); }
      .fish { animation:swim var(--dur) linear infinite; animation-delay:var(--delay); }
      .tail { transform-origin:2px 0; animation:wag calc(.5s / var(--speed,1)) ease-in-out infinite alternate; }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(70px,1fr)); gap:8px; margin-top:10px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      .alert .stat.t .v { color:#e53935; animation:blink 1s infinite; }
      @keyframes rise { from { transform:translateY(0); opacity:.9 } to { transform:translateY(-105px); opacity:0 } }
      @keyframes sway { from { transform:rotate(-4deg) } to { transform:rotate(4deg) } }
      /* aller vers la droite, demi-tour, retour vers la gauche */
      @keyframes swim {
        0% { transform:translate(0px,var(--top)) scaleX(1) } 49.9% { transform:translate(290px,var(--top)) scaleX(1) }
        50% { transform:translate(290px,var(--top)) scaleX(-1) } 99.9% { transform:translate(0px,var(--top)) scaleX(-1) }
        100% { transform:translate(0px,var(--top)) scaleX(1) } }
      @keyframes wag { from { transform:scaleY(.7) } to { transform:scaleY(1.2) } }
      @keyframes blink { 50% { opacity:.35 } }
    </style>
    <ha-card>
      <div class="title"><span id="name">${esc(c.name || this._t('name'))}</span><span class="badge" id="badge">${this._t('alert')}</span></div>
      <svg viewBox="0 0 320 200" id="tank">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d8cf0"/><stop offset="1" stop-color="#0b4fb8"/></linearGradient>
          <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98534"/><stop offset="1" stop-color="#b8661e"/></linearGradient>
          <clipPath id="glass"><rect x="10" y="24" width="300" height="140"/></clipPath>
        </defs>
        <rect width="320" height="200" fill="#efe6dc"/>
        <rect x="4" y="170" width="312" height="30" fill="url(#wood)"/><line x1="160" y1="172" x2="160" y2="200" stroke="#8a4a14" stroke-width="1.5"/>
        <rect x="10" y="24" width="300" height="140" fill="url(#bg)"/>
        <g clip-path="url(#glass)">
          <rect class="tint" x="10" y="24" width="300" height="140"/>
          <rect x="10" y="24" width="300" height="5" fill="rgba(255,255,255,.35)"/>
          <rect x="108" y="28" width="9" height="115" fill="#10244a" opacity=".85"/>
          ${plants}${feathers}
          <g stroke="#c62828" stroke-width="1.6" stroke-linecap="round">${urchin}</g><circle cx="232" cy="136" r="5" fill="#b71c1c"/>
          <polygon points="95,146 112,120 140,112 160,128 165,146" fill="#555a60"/><polygon points="112,120 140,112 130,128" fill="#6b7076"/>
          <polygon points="180,146 190,124 215,118 228,146" fill="#4a4e54"/><polygon points="270,146 280,128 300,126 306,146" fill="#5a5f66"/>
          <polygon points="45,150 55,140 80,138 90,150" fill="#6a6f76"/>
          <ellipse cx="82" cy="130" rx="9" ry="7" fill="#e8e8e8"/><ellipse cx="128" cy="144" rx="8" ry="5" fill="#dcdcdc"/>
          <circle cx="205" cy="146" r="6" fill="#4caf50"/><circle cx="222" cy="148" r="5" fill="#5cc45c"/><circle cx="244" cy="147" r="6" fill="#4caf50"/><circle cx="258" cy="148" r="5" fill="#5cc45c"/>
          <rect x="10" y="148" width="300" height="16" fill="#12245e"/>${speckles}
          <g>${bubbles}</g>
          ${fish(40, 16, 0, '#ff9a2e', '#ff7a00', 1, false)}
          ${fish(65, 22, -9, '#ffb62e', '#ff9a00', 0.9, false)}
          ${fish(85, 19, -4, '#d8dce6', '#555', 1.05, true)}
          ${fish(105, 25, -14, '#e8c86a', '#c9a227', 0.8, true)}
          ${fish(55, 28, -20, '#ff4d4d', '#d32f2f', 0.7, false)}
          ${fish(120, 21, -6, '#ffc233', '#ff9a00', 0.95, false)}
          <rect class="night-overlay" x="10" y="24" width="300" height="140"/>
          <polygon class="lamp-glow" points="70,24 250,24 305,164 15,164"/>
        </g>
        <rect x="6" y="14" width="308" height="11" fill="#111"/><rect x="6" y="162" width="308" height="8" fill="#111"/>
        <rect x="8" y="24" width="3" height="140" fill="rgba(180,220,255,.5)"/><rect x="309" y="24" width="3" height="140" fill="rgba(180,220,255,.5)"/>
        <rect x="75" y="2" width="170" height="12" rx="3" fill="#1c1c1c"/><rect class="lamp-led" x="82" y="9" width="156" height="3" rx="1.5"/>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || s.state === 'unavailable' || s.state === 'unknown') return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, root = this.shadowRoot;
    const power = this._num(c.entity_power), energy = this._num(c.entity_energy), temp = this._num(c.entity_temperature);
    let cost = this._num(c.entity_cost);
    if (cost === null && energy !== null && c.price_per_kwh) cost = energy * c.price_per_kwh;

    // Vitesse des bulles/queues liée à la puissance (0.5× à 3×)
    const ratio = power === null ? 0 : Math.min(power / (c.max_power || 200), 1);
    root.querySelector('svg').style.setProperty('--speed', (0.5 + ratio * 2.5).toFixed(2));

    // Couleur de l'eau selon la température : froid=bleu, idéal=turquoise, chaud=orange/rouge
    let water = '#2a8fd6', alert = false;
    if (temp !== null) {
      if (temp < c.temp_min) { water = '#1e5fb5'; alert = true; }
      else if (temp > c.temp_max) { water = temp > c.temp_max + 3 ? '#d64a2a' : '#d6962a'; alert = true; }
      else water = '#2ab5c4';
    }
    root.querySelector('svg').style.setProperty('--water', water);
    root.querySelector('ha-card').classList.toggle('alert', alert);

    // Éclairage jour/nuit
    const lightState = c.entity_light && this._hass.states[c.entity_light];
    const lit = lightState ? lightState.state === 'on' : true;
    const tank = root.getElementById('tank');
    tank.classList.toggle('lit', lit);
    tank.classList.toggle('night', !lit);

    const fmt = (v, d, u) => v === null ? '—' : `${v.toFixed(d)} ${u}`;
    const items = [];
    if (c.show_power) items.push(['p', this._l('power'), fmt(power, 0, 'W')]);
    if (c.show_energy) items.push(['e', this._l('energy'), fmt(energy, 2, 'kWh')]);
    if (c.show_temperature) items.push(['t', this._l('temp'), fmt(temp, 1, '°C')]);
    if (c.show_cost) items.push(['c', this._l('cost'), fmt(cost, 2, '€')]);
    root.getElementById('stats').innerHTML = items.map(([k, l, v]) =>
      `<div class="stat ${k}"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}

define('appliance-aquarium-card', ApplianceAquariumCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-aquarium-card', name: 'Appliance – Aquarium', description: 'Aquarium animé : puissance, kWh, température, coût', preview: false });
})();

/* ================================================================== */
/* appliance-linky-card.js                                          */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-linky-card — compteur Linky animé (écran LCD, jauge vs puissance souscrite, index HP/HC)
 * type: custom:appliance-linky-card
 */
const I18N_LINKY = {
  "en": {
    "power": "POWER",
    "hp": "PEAK INDEX",
    "hc": "OFF-PEAK INDEX",
    "tariff": "PERIOD",
    "cost": "COST TODAY",
    "subscribed": "Subscribed",
    "name": "Linky",
    "conso": "usage",
    "alert": "Overload",
    "active": "ACTIVE POWER",
    "active_short": "Active",
    "per_phase": "per phase",
    "peak": "PEAK HOURS",
    "offpeak": "OFF-PEAK HOURS",
    "injection": "EXPORT INDEX",
    "injection_power": "EXPORT",
    "prod": "export"
  },
  "de": {
    "power": "LEISTUNG",
    "hp": "ZÄHLER HT",
    "hc": "ZÄHLER NT",
    "tariff": "TARIFZEIT",
    "cost": "KOSTEN HEUTE",
    "subscribed": "Vertragsleistung",
    "name": "Linky",
    "conso": "Verbrauch",
    "alert": "Überlast",
    "active": "WIRKLEISTUNG",
    "active_short": "Wirkleistung",
    "per_phase": "pro Phase",
    "peak": "HOCHTARIF",
    "offpeak": "NIEDERTARIF",
    "injection": "ZÄHLER EINSPEISUNG",
    "injection_power": "EINSPEISUNG",
    "prod": "Einsp."
  },
  "fr": {
    "power": "PUISSANCE",
    "hp": "INDEX HP",
    "hc": "INDEX HC",
    "tariff": "PÉRIODE",
    "cost": "COÛT JOUR",
    "subscribed": "Souscrite",
    "name": "Linky",
    "conso": "conso",
    "alert": "Dépassement",
    "active": "PUISS. ACTIVE",
    "active_short": "Active",
    "per_phase": "par phase",
    "peak": "HEURES PLEINES",
    "offpeak": "HEURES CREUSES",
    "injection": "INDEX INJECTION",
    "injection_power": "INJECTION",
    "prod": "prod"
  },
  "nb": {
    "power": "EFFEKT",
    "hp": "INDEKS TOPPTID",
    "hc": "INDEKS LAVTID",
    "tariff": "PERIODE",
    "cost": "KOSTNAD I DAG",
    "subscribed": "Abonnert",
    "name": "Linky",
    "conso": "forbruk",
    "alert": "Overbelastning",
    "active": "AKTIV EFFEKT",
    "active_short": "Aktiv",
    "per_phase": "per fase",
    "peak": "TOPPTID",
    "offpeak": "LAVTID",
    "injection": "INDEKS INNMATING",
    "injection_power": "INNMATING",
    "prod": "innm."
  },
  "nl": {
    "power": "VERMOGEN",
    "hp": "INDEX DAG",
    "hc": "INDEX NACHT",
    "tariff": "PERIODE",
    "cost": "KOST VANDAAG",
    "subscribed": "Contract",
    "name": "Linky",
    "conso": "verbruik",
    "alert": "Overbelasting",
    "active": "ACTIEF VERMOGEN",
    "active_short": "Actief",
    "per_phase": "per fase",
    "peak": "DAGTARIEF",
    "offpeak": "NACHTTARIEF",
    "injection": "INDEX INJECTIE",
    "injection_power": "INJECTIE",
    "prod": "injectie"
  },
  "ro": {
    "power": "PUTERE",
    "hp": "INDEX PLINE",
    "hc": "INDEX REDUSE",
    "tariff": "PERIOADĂ",
    "cost": "COST AZI",
    "subscribed": "Contractată",
    "name": "Linky",
    "conso": "consum",
    "alert": "Suprasarcină",
    "active": "PUTERE ACTIVĂ",
    "active_short": "Activă",
    "per_phase": "pe fază",
    "peak": "ORE PLINE",
    "offpeak": "ORE REDUSE",
    "injection": "INDEX EXPORT",
    "injection_power": "EXPORT",
    "prod": "export"
  },
  "ru": {
    "power": "МОЩНОСТЬ",
    "hp": "ИНДЕКС ПИК",
    "hc": "ИНДЕКС ВНЕПИК",
    "tariff": "ПЕРИОД",
    "cost": "СТОИМОСТЬ ЗА СЕГОДНЯ",
    "subscribed": "Подписка",
    "name": "Linky",
    "conso": "потребление",
    "alert": "Перегрузка",
    "active": "АКТИВНАЯ МОЩНОСТЬ",
    "active_short": "Активная",
    "per_phase": "по фазам",
    "peak": "ПИКОВЫЕ ЧАСЫ",
    "offpeak": "ВНЕПИКОВЫЕ ЧАСЫ",
    "injection": "ИНДЕКС ЭКСПОРТА",
    "injection_power": "ЭКСПОРТ",
    "prod": "экспорт"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
// Aiguilles L1 / L2 / L3 (mode « needles ») : couleurs distinctes du vert / orange / rouge de la jauge
const PHASE_COLORS = ['#1e88e5', '#8e24aa', '#00897b'];

class ApplianceLinkyCard extends HTMLElement {
  static getStubConfig() {
    return { entity_power: '', entity_hp: '', entity_hc: '', subscribed_power: 9, hc_ranges: '01:00-07:00,12:30-14:30' };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_active_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { type: 'grid', name: '', schema: [
          { name: 'entity_power_l1', selector: { entity: { domain: 'sensor' } } },
          { name: 'entity_power_l2', selector: { entity: { domain: 'sensor' } } },
          { name: 'entity_power_l3', selector: { entity: { domain: 'sensor' } } },
        ] },
        { name: 'phase_gauge', selector: { select: { mode: 'dropdown', options: ['needles', 'cycle', 'max'] } }, default: 'needles' },
        { name: 'entity_hp', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_hc', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        // Plusieurs index de soutirage (Tempo : 6, semaine/week-end : 4…) : [{ entity, name }], remplace HP/HC
        { name: 'indexes', selector: { object: {} } },
        { name: 'entity_injection', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_power_injection', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_tariff', selector: { entity: { domain: ['sensor', 'select'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'subscribed_power', selector: { number: { min: 3, max: 36, step: 1, mode: 'box', unit_of_measurement: 'kVA' } } },
        { name: 'hc_ranges', selector: { text: {} } },
        { type: 'grid', name: '', schema: [
          { name: 'show_gauge', selector: { boolean: {} }, default: true },
          { name: 'show_phases', selector: { boolean: {} }, default: true },
          { name: 'show_index', selector: { boolean: {} }, default: true },
          { name: 'show_injection', selector: { boolean: {} }, default: true },
          { name: 'show_tariff', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_LINKY) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = {
      show_gauge: true, show_phases: true, show_index: true, show_injection: true, show_tariff: true, show_cost: true,
      phase_gauge: 'needles', subscribed_power: 9, hc_ranges: '', ...config,
    };
    this._built = false;
    this._build();
  }

  set hass(hass) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(hass));
    if (l && l !== this._lng) { this._lng = l; this._hass = hass; this._built = false; this._build(); }
    this._hass = hass; this._update(); }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_LINKY[this._config.language || lang(this._hass)] || I18N_LINKY.en)[k] ?? I18N_LINKY.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  connectedCallback() {
    // Défilement des pages de l'écran LCD toutes les 3 s (et des phases, en mode jauge « cycle »)
    this._timer = setInterval(() => {
      this._page = (this._page || 0) + 1; this._renderLcd();
      this._cycle = (this._cycle || 0) + 1;
      if (this._tri && this._config.phase_gauge === 'cycle') this._update();
      const b = this.shadowRoot && this.shadowRoot.getElementById('b2');
      if (b) { b.classList.add('press'); setTimeout(() => b.classList.remove('press'), 250); }
    }, 3000);
  }
  disconnectedCallback() { clearInterval(this._timer); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const ticks = Array.from({ length: 21 }, (_, i) => {
      const a = (-180 + i * 9) * Math.PI / 180, r1 = 78, r2 = i % 5 === 0 ? 68 : 72;
      return `<line x1="${100 + r1 * Math.cos(a)}" y1="${100 + r1 * Math.sin(a)}" x2="${100 + r2 * Math.cos(a)}" y2="${100 + r2 * Math.sin(a)}" stroke="#8a99a8" stroke-width="1.5"/>`;
    }).join('');
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; }
      .title { font-weight:600; margin:0 4px 10px; }
      .wrap { display:flex; gap:14px; align-items:center; flex-wrap:wrap; justify-content:center; }
      /* Boîtier : coque vert anis, cadre blanc, écran LCD vert sombre, 2 boutons, croix en bas */
      /* illustration_size : le compteur (HTML) est agrandi d'un bloc avec zoom */
      .box { zoom:var(--illus-scale,1); width:150px; background:linear-gradient(160deg,#d4ea35,#b5d11c); border-radius:10px; padding:16px 14px 14px;
        box-shadow:0 3px 10px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.35); position:relative; }
      .eye { width:8px; height:8px; background:#1d2a05; border-radius:2px; margin:-6px auto 8px; }
      .bezel { background:linear-gradient(#f7f7f7,#dcdcdc); border-radius:12px; padding:10px 9px 8px; box-shadow:inset 0 0 0 1px #c9c9c9; }
      .lcd { background:#1f4d2a; border-radius:3px; padding:8px 6px; min-height:66px; text-align:center; position:relative; overflow:hidden;
        box-shadow:inset 0 0 8px rgba(0,0,0,.7); font-family:'Courier New',monospace; color:#b9f08a; display:flex; flex-direction:column; justify-content:center; }
      .lcd::after { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 1px,transparent 1px 3px); pointer-events:none; }
      .lcd .lab { font-size:.58em; letter-spacing:.08em; opacity:.85; }
      .lcd .val { font-size:1.25em; font-weight:700; text-shadow:0 0 6px rgba(185,240,138,.6); animation:fadein .5s; }
      .btns { display:flex; gap:6px; margin-top:8px; justify-content:center; }
      .btn { width:44px; height:12px; border-radius:3px; background:linear-gradient(#fff,#d2d2d2); border:1px solid #b0b0b0; cursor:pointer; padding:0; transition:transform .1s; }
      .btn:active, .btn.press { transform:translateY(1px); background:#c8c8c8; }
      .plus { text-align:center; font-size:20px; line-height:1; color:#3b4a08; margin-top:12px; font-weight:300; }
      .leds { display:flex; justify-content:center; gap:14px; margin-top:8px; font-size:.55em; letter-spacing:.06em; color:#3b4a08; }
      .led { width:9px; height:9px; border-radius:50%; background:#5a2a2a; margin:0 auto 2px; }
      .led.conso { background:#ff3b30; box-shadow:0 0 8px #ff3b30; animation:pulse var(--pulse,2s) infinite; }
      .led.hc { background:#ffb300; box-shadow:0 0 8px #ffb300; } .led.hp { background:#f4511e; box-shadow:0 0 8px #f4511e; }
      .led.prod { background:#2a4a2a; } .led.prod.on { background:#43a047; box-shadow:0 0 8px #43a047; }
      .gauge { flex:1; min-width:calc(170px * min(var(--illus-scale,1),1)); max-width:calc(260px * var(--illus-scale,1)); }
      .gauge svg { width:100%; display:block; transform:scale(0.8); transform-origin:top center; }
      .arc-bg { fill:none; stroke:rgba(127,127,127,.25); stroke-width:12; stroke-linecap:round; }
      .arc { fill:none; stroke:var(--gc,#43a047); stroke-width:12; stroke-linecap:round; transition:stroke-dashoffset 1s ease, stroke .6s; }
      .needle { transform-origin:100px 100px; transition:transform 1s cubic-bezier(.3,1.4,.5,1); stroke:var(--primary-text-color,#223); stroke-width:3; stroke-linecap:round; }
      .gtxt { text-anchor:middle; font-size:15px; font-weight:700; fill:var(--primary-text-color,#223); }
      .gsub { text-align:center; font-size:.7em; opacity:.65; }
      .gact { text-align:center; font-size:.8em; font-weight:600; margin-top:2px; }
      /* Triphasé : une barre par phase, pleine à 1/3 de la puissance souscrite */
      .phases { margin-top:6px; display:grid; grid-template-columns:auto 1fr auto; gap:3px 6px; align-items:center; font-size:.7em; }
      .phases .bar { height:6px; border-radius:3px; background:rgba(127,127,127,.25); overflow:hidden; }
      .phases .bar i { display:block; height:100%; width:0; border-radius:3px; background:#43a047; transition:width 1s ease, background .6s; }
      .phases .pv { text-align:right; font-variant-numeric:tabular-nums; opacity:.8; }
      .phases .cur { font-weight:700; }
      .needle.pn { stroke-width:2.5; }
      .over .arc { animation:pulse .6s infinite; }
      .badge { text-align:center; font-size:.8em; font-weight:700; margin-top:4px; color:#e53935; display:none; }
      .over .badge { display:block; animation:pulse .6s infinite; }
      @keyframes pulse { 50% { opacity:.25 } }
      @keyframes fadein { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:none } }
    </style>
    <ha-card id="meter">
      <div class="title" id="name">${esc(this._config.name || this._t('name'))}</div>
      <div class="wrap">
        <div class="box">
          <div class="eye"></div>
          <div class="bezel">
            <div class="lcd"><div class="lab" id="lab"></div><div class="val" id="val"></div></div>
            <div class="btns"><button class="btn" id="b1" aria-label="-"></button><button class="btn" id="b2" aria-label="+"></button></div>
          </div>
          <div class="plus">+</div>
          <div class="leds"><div><div class="led conso" id="ledc"></div>${this._t('conso')}</div><div><div class="led hp" id="ledt"></div><span id="ledtl">HP</span></div><div id="ledpw" style="display:none"><div class="led prod" id="ledp"></div>${this._t('prod')}</div></div>
        </div>
        <div class="gauge" id="gaugebox">
          <svg viewBox="0 0 200 120">
            <path class="arc-bg" d="M20 100 A80 80 0 0 1 180 100"/>
            <path class="arc" id="arc" d="M20 100 A80 80 0 0 1 180 100" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
            ${ticks}
            <line class="needle" id="needle" x1="100" y1="100" x2="100" y2="32" style="transform:rotate(-90deg)"/>
            ${PHASE_COLORS.map((col, i) => `<line class="needle pn" id="n${i + 1}" x1="100" y1="100" x2="100" y2="${32 + i * 8}" style="stroke:${col};transform:rotate(-90deg);display:none"/>`).join('')}
            <circle cx="100" cy="100" r="6" fill="var(--primary-text-color,#223)"/>
            <text class="gtxt" x="100" y="118" id="gtxt"></text>
          </svg>
          <div class="gsub" id="gsub"></div>
          <div class="gact" id="gact"></div>
          <div class="phases" id="phases">${[1, 2, 3].map((i) =>
            `<span id="phl${i}">L${i}</span><div class="bar"><i id="ph${i}"></i></div><span class="pv" id="phv${i}"></span>`).join('')}</div>
          <div class="badge">${this._t('alert')}</div>
        </div>
      </div>
    </ha-card>`;
    const flip = (d) => () => { this._page = (this._page || 0) + d; this._renderLcd(); };
    this.shadowRoot.getElementById('b1').onclick = flip(-1);
    this.shadowRoot.getElementById('b2').onclick = flip(1);
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state);
    return Number.isFinite(n) ? n : null;
  }

  // Puissance en W ou VA (kW / kVA convertis), avec l'unité du capteur
  _power(id) {
    const v = this._num(id);
    if (v === null) return null;
    const u = this._hass.states[id].attributes.unit_of_measurement || 'W';
    return { v: /^k/i.test(u) ? v * 1000 : v, unit: /va/i.test(u) ? 'VA' : 'W' };
  }

  // Index en kWh (Wh / MWh convertis) : les modules TIC remontent souvent les index en Wh
  _kwh(id) {
    const v = this._num(id);
    if (v === null) return null;
    const u = this._hass.states[id].attributes.unit_of_measurement || 'kWh';
    return /^wh$/i.test(u) ? v / 1000 : /^mwh$/i.test(u) ? v * 1000 : v;
  }

  // Index de soutirage : liste « indexes » ([{ entity, name }] ou identifiants seuls), sinon HP / HC
  _indexes() {
    const c = this._config;
    if (Array.isArray(c.indexes) && c.indexes.length) {
      return c.indexes.map((it) => {
        const id = typeof it === 'string' ? it : it && it.entity, st = id && this._hass.states[id];
        const name = (it && it.name) || (st && st.attributes.friendly_name) || id || '';
        return [String(name).toUpperCase(), this._kwh(id)];
      });
    }
    return [[this._l('hp'), this._kwh(c.entity_hp)], [this._l('hc'), this._kwh(c.entity_hc)]];
  }

  // Heures creuses : entité tarif si fournie, sinon plages "HH:MM-HH:MM,..."
  _isHC() {
    const c = this._config;
    if (c.entity_tariff && this._hass.states[c.entity_tariff]) {
      return /hc|creuse|off|low/i.test(this._hass.states[c.entity_tariff].state);
    }
    const now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    return String(c.hc_ranges).split(',').some((r) => {
      const [a, b] = r.trim().split('-'); if (!a || !b) return false;
      const f = (x) => { const [h, mi] = x.split(':').map(Number); return h * 60 + (mi || 0); };
      const s = f(a), e = f(b);
      return s <= e ? m >= s && m < e : m >= s || m < e;
    });
  }

  _renderLcd() {
    if (!this._built || !this._data) return;
    const d = this._data, c = this._config, pages = [];
    pages.push([this._l('power'), d.power === null ? '—' : `${Math.round(d.power)} ${d.unit}`]);
    if (c.entity_active_power) pages.push([this._l('active'), d.active === null ? '—' : `${Math.round(d.active.v)} ${d.active.unit}`]);
    const kwh = (v) => (v === null ? '—' : `${Math.round(v)} kWh`);
    if (c.show_index) d.indexes.forEach(([lab, v]) => pages.push([lab, kwh(v)]));
    if (c.show_injection) {
      if (c.entity_power_injection) pages.push([this._l('injection_power'), d.injPower === null ? '—' : `${Math.round(d.injPower.v)} ${d.injPower.unit}`]);
      if (c.entity_injection) pages.push([this._l('injection'), kwh(d.injection)]);
    }
    if (c.show_tariff) pages.push([this._l('tariff'), this._t(d.hcNow ? 'offpeak' : 'peak')]);
    if (c.show_cost && d.cost !== null) pages.push([this._l('cost'), `${d.cost.toFixed(2)} €`]);
    const p = pages[(this._page || 0) % pages.length];
    const lab = this.shadowRoot.getElementById('lab'), val = this.shadowRoot.getElementById('val');
    lab.textContent = p[0];
    // On ne relance le fondu que si la page affichée change (pas à chaque mise à jour d'état)
    const key = p[0];
    val.textContent = p[1];
    if (this._lastKey !== key) { this._lastKey = key; val.style.animation = 'none'; void val.offsetWidth; val.style.animation = ''; }
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, root = this.shadowRoot;
    const pState = c.entity_power && this._hass.states[c.entity_power];
    let unit = (pState && pState.attributes.unit_of_measurement) || 'W';
    let power = this._num(c.entity_power);
    const indexes = this._indexes();
    const hcNow = this._isHC();
    let cost = this._num(c.entity_cost);
    const active = this._power(c.entity_active_power);
    const injPower = this._power(c.entity_power_injection), injection = this._kwh(c.entity_injection);

    // Jauge : puissance (W ou VA, kW ou kVA) / puissance souscrite (kVA × 1000).
    // Le Linky donne la puissance apparente en VA : on garde l'unité du capteur.
    // En triphasé, il coupe phase par phase à 1/3 de la souscription. Selon phase_gauge :
    // « needles » une aiguille par phase, « cycle » L1 → L2 → L3 toutes les 3 s,
    // « max » la phase la plus chargée. L'alerte suit toujours la phase la plus chargée.
    const max = c.subscribed_power * 1000, phaseMax = max / 3;
    const phases = [c.entity_power_l1, c.entity_power_l2, c.entity_power_l3].map((id) => this._power(id));
    const tri = phases.some(Boolean), mode = ['cycle', 'max'].includes(c.phase_gauge) ? c.phase_gauge : 'needles';
    const pr = (p) => (p ? Math.min(p.v / phaseMax, 1) : 0);
    this._tri = tri;
    let ratio, alertRatio, gtxt, shown = -1;
    if (tri) {
      const worst = phases.reduce((w, p, i) => (p && (w < 0 || p.v > phases[w].v) ? i : w), -1);
      const avail = phases.map((p, i) => (p ? i : -1)).filter((i) => i >= 0);
      shown = mode === 'cycle' ? avail[(this._cycle || 0) % avail.length] : worst;
      ratio = pr(phases[shown]); alertRatio = pr(phases[worst]);
      gtxt = `L${shown + 1} · ${Math.round(phases[shown].v)} ${phases[shown].unit}`;
      if (power === null) { power = phases.reduce((s, p) => s + (p ? p.v : 0), 0); unit = phases[worst].unit; }
    } else {
      const gaugeUnit = /va/i.test(unit) ? 'VA' : 'W';
      const base = power === null ? 0 : (/^k/i.test(unit) ? power * 1000 : power);
      ratio = alertRatio = Math.min(base / max, 1);
      gtxt = power === null ? '—' : `${Math.round(base)} ${gaugeUnit}`;
    }
    this._data = { power, unit, active, indexes, hcNow, cost, injPower, injection };
    const colorOf = (r) => (r > 0.9 ? '#e53935' : r > 0.65 ? '#fb8c00' : '#43a047');
    const needles = tri && mode === 'needles';
    root.getElementById('arc').style.strokeDashoffset = 251.3 * (1 - ratio);
    root.getElementById('needle').style.transform = `rotate(${-90 + ratio * 180}deg)`;
    root.getElementById('needle').style.display = needles ? 'none' : '';
    phases.forEach((p, i) => {
      const n = root.getElementById(`n${i + 1}`);
      n.style.display = needles && p ? '' : 'none';
      n.style.transform = `rotate(${-90 + pr(p) * 180}deg)`;
      const lab = root.getElementById(`phl${i + 1}`);
      lab.style.color = needles ? PHASE_COLORS[i] : '';
      lab.classList.toggle('cur', tri && mode === 'cycle' && i === shown);
    });
    root.getElementById('gaugebox').style.setProperty('--gc', colorOf(ratio));
    root.getElementById('gtxt').textContent = gtxt;
    root.getElementById('gsub').textContent = `${this._t('subscribed')} : ${c.subscribed_power} kVA`
      + (tri ? ` · ${+(c.subscribed_power / 3).toFixed(1)} kVA ${this._t('per_phase')}` : '');
    const gact = root.getElementById('gact');
    gact.textContent = active ? `${this._t('active_short')} : ${Math.round(active.v)} ${active.unit}` : '';
    gact.style.display = active ? '' : 'none';
    root.getElementById('phases').style.display = tri && c.show_phases ? '' : 'none';
    phases.forEach((p, i) => {
      const r = p ? Math.min(p.v / phaseMax, 1) : 0, bar = root.getElementById(`ph${i + 1}`);
      bar.style.width = `${(r * 100).toFixed(1)}%`;
      bar.style.background = colorOf(r);
      root.getElementById(`phv${i + 1}`).textContent = p ? `${Math.round(p.v)} ${p.unit}` : '—';
    });
    root.getElementById('gaugebox').style.display = c.show_gauge ? '' : 'none';
    root.getElementById('meter').classList.toggle('over', alertRatio > 0.95);

    // LED conso : clignote plus vite quand la puissance monte (2 s → 0.25 s)
    root.getElementById('ledc').style.setProperty('--pulse', `${(2 - alertRatio * 1.75).toFixed(2)}s`);
    const ledt = root.getElementById('ledt');
    ledt.className = `led ${hcNow ? 'hc' : 'hp'}`;
    root.getElementById('ledtl').textContent = hcNow ? 'HC' : 'HP';
    // LED prod : allumée quand le compteur voit de l'énergie partir vers le réseau
    root.getElementById('ledpw').style.display = c.entity_power_injection && c.show_injection ? '' : 'none';
    root.getElementById('ledp').classList.toggle('on', !!injPower && injPower.v > 0);
    this._renderLcd();
  }
}

define('appliance-linky-card', ApplianceLinkyCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-linky-card', name: 'Appliance – Linky', description: 'Compteur Linky animé : LCD, jauge, index HP/HC', preview: false });
})();

/* ================================================================== */
/* appliance-battery-card.js                                        */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-battery-card — batterie de stockage solaire animée (niveau liquide, flux charge/décharge)
 * type: custom:appliance-battery-card
 */
const I18N_BAT = {
  "en": {
    "name": "Solar battery",
    "soc": "Charge",
    "power": "Power",
    "energy": "Energy",
    "temp": "Temperature",
    "charging": "Charging",
    "discharging": "Discharging",
    "idle": "Idle",
    "full": "Full in",
    "empty": "Empty in",
    "low": "Low battery"
  },
  "de": {
    "name": "Solarbatterie",
    "soc": "Ladestand",
    "power": "Leistung",
    "energy": "Energie",
    "temp": "Temperatur",
    "charging": "Lädt",
    "discharging": "Entlädt",
    "idle": "Ruhe",
    "full": "Voll in",
    "empty": "Leer in",
    "low": "Batterie schwach"
  },
  "fr": {
    "name": "Batterie solaire",
    "soc": "Charge",
    "power": "Puissance",
    "energy": "Énergie",
    "temp": "Température",
    "charging": "En charge",
    "discharging": "En décharge",
    "idle": "Repos",
    "full": "Plein dans",
    "empty": "Vide dans",
    "low": "Batterie faible"
  },
  "nb": {
    "name": "Solbatteri",
    "soc": "Ladning",
    "power": "Effekt",
    "energy": "Energi",
    "temp": "Temperatur",
    "charging": "Lader",
    "discharging": "Utlader",
    "idle": "Inaktiv",
    "full": "Full om",
    "empty": "Tom om",
    "low": "Lavt batteri"
  },
  "nl": {
    "name": "Thuisbatterij",
    "soc": "Lading",
    "power": "Vermogen",
    "energy": "Energie",
    "temp": "Temperatuur",
    "charging": "Laden",
    "discharging": "Ontladen",
    "idle": "Inactief",
    "full": "Vol over",
    "empty": "Leeg over",
    "low": "Batterij bijna leeg"
  },
  "ro": {
    "name": "Baterie solară",
    "soc": "Încărcare",
    "power": "Putere",
    "energy": "Energie",
    "temp": "Temperatură",
    "charging": "Se încarcă",
    "discharging": "Se descarcă",
    "idle": "Repaus",
    "full": "Plină în",
    "empty": "Goală în",
    "low": "Baterie slabă"
  },
  "ru": {
    "name": "Солнечная батарея",
    "soc": "Заряд",
    "power": "Мощность",
    "energy": "Энергия",
    "temp": "Температура",
    "charging": "Зарядка",
    "discharging": "Разрядка",
    "idle": "Простой",
    "full": "Полный заряд через",
    "empty": "Разрядка через",
    "low": "Низкий заряд"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class ApplianceBatteryCard extends HTMLElement {
  static getStubConfig() { return { entity_soc: '', entity_power: '', entity_energy: '', entity_temperature: '', capacity_kwh: 10, max_power: 5000 }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_soc', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'invert_power', selector: { boolean: {} } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { type: 'grid', name: '', schema: [
          { name: 'capacity_kwh', selector: { number: { min: 1, max: 100, step: 0.1, mode: 'box', unit_of_measurement: 'kWh' } } },
          { name: 'max_power', selector: { number: { min: 500, max: 20000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'low_threshold', selector: { number: { min: 0, max: 50, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_temperature', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
        ] },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'split'] } } },
        { name: 'status_position', selector: { select: { mode: 'dropdown', options: ['auto', 'inside', 'below'] } } },
        { name: 'language', selector: { select: { options: Object.keys(I18N_BAT) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    // Convention : puissance > 0 = charge (inverser avec invert_power si ton capteur est l'inverse)
    this._config = { show_power: true, show_energy: true, show_temperature: true, show_time: true,
      capacity_kwh: 10, max_power: 5000, low_threshold: 15, invert_power: false, status_position: 'auto', layout: 'default', ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    this._hass = h;
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config.language || lang(h);
    if (l !== this._lng) { this._lng = l; this._built = false; this._build(); }
    this._update();
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_BAT[this._config.language || lang(this._hass)] || I18N_BAT.en)[k] ?? I18N_BAT.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    // 3 modules façon photo : corps blanc nervuré, couvercle noir, étiquette, câbles orange
    const X = [24, 112, 200], TOP = 40, LID = 22, BODY = 98, W = 80, D = 14;
    const mod = (x0, i) => {
      const ribs = Array.from({ length: 9 }, (_, k) => `<line x1="${x0 + 44 + k * 4}" y1="${TOP + LID + 4}" x2="${x0 + 44 + k * 4}" y2="${TOP + LID + BODY - 4}" stroke="#d9dde1" stroke-width="1"/>`).join('');
      return `
      <g class="mod">
        <polygon points="${x0 + W},${TOP + LID} ${x0 + W + D},${TOP + LID - D} ${x0 + W + D},${TOP + LID + BODY - D} ${x0 + W},${TOP + LID + BODY}" fill="#c9ced3"/>
        <polygon points="${x0 + W},${TOP} ${x0 + W + D},${TOP - D} ${x0 + W + D},${TOP + LID - D} ${x0 + W},${TOP + LID}" fill="#0d0d0d"/>
        <polygon points="${x0},${TOP} ${x0 + D},${TOP - D} ${x0 + W + D},${TOP - D} ${x0 + W},${TOP}" fill="#2a2a2a"/>
        <polygon points="${x0 + 36},${TOP - 4} ${x0 + 42},${TOP - 10} ${x0 + 72},${TOP - 10} ${x0 + 66},${TOP - 4}" fill="#f2f2f2"/>
        <rect x="${x0}" y="${TOP}" width="${W}" height="${LID}" rx="3" fill="#161616"/>
        <rect x="${x0 + 8}" y="${TOP + 7}" width="20" height="6" rx="3" fill="#000"/>
        <circle class="led" cx="${x0 + W - 10}" cy="${TOP + 11}" r="3" style="animation-delay:${i * 0.3}s"/>
        <rect x="${x0}" y="${TOP + LID}" width="${W}" height="${BODY}" fill="url(#body)"/>
        ${ribs}
        <g clip-path="url(#c${i})">
          <rect class="liquid" id="liq${i}" x="${x0}" y="${TOP + LID + BODY}" width="${W}" height="0"/>
          <path class="wave" id="wave${i}" d="M${x0 - 20} 0 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 v 10 h-120z" style="animation-delay:${-i * 0.7}s"/>
        </g>
        <circle cx="${x0 + 6}" cy="${TOP + LID + BODY - 6}" r="2" fill="#9aa3ad"/>
      </g>`;
    };
    const clips = X.map((x, i) => `<clipPath id="c${i}"><rect x="${x}" y="${TOP + LID}" width="${W}" height="${BODY}"/></clipPath>`).join('');
    // Câbles orange entre bornes (dessus des couvercles) + câble de sortie
    const cab = (x1, x2) => `M${x1} ${TOP - 6} C ${x1} ${TOP - 30}, ${x2} ${TOP - 30}, ${x2} ${TOP - 6}`;
    const cables = [cab(46, 128), cab(134, 216), `M${X[2] + W + 8} ${TOP - 6} C ${X[2] + W + 30} ${TOP - 20}, ${X[2] + W + 26} ${TOP + 60}, ${X[2] + W + 22} ${TOP + 110}`];
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; container-type:inline-size; }
      .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .low .badge { display:inline-block; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; transform:scale(0.8); transform-origin:top center; }
      .liquid { fill:var(--lc,#43a047); opacity:.35; transition:y 1.2s ease, height 1.2s ease, fill .8s; }
      .wave { fill:var(--lc,#43a047); opacity:.45; animation:wave 2.6s ease-in-out infinite alternate; transition:fill .8s; }
      .led { fill:var(--lc,#43a047); animation:blink var(--bl,2s) infinite; filter:drop-shadow(0 0 3px var(--lc,#43a047)); }
      .cable { fill:none; stroke:#ff7a1a; stroke-width:5; stroke-linecap:round; }
      .cable-b { fill:none; stroke:#111; stroke-width:8; stroke-linecap:round; }
      .flow { fill:none; stroke-width:2.5; stroke-linecap:round; stroke-dasharray:2 9; opacity:0; }
      .charging .flow { stroke:#fff6a0; opacity:1; animation:dash var(--fs,1s) linear infinite reverse; }
      .discharging .flow { stroke:#b3f5ff; opacity:1; animation:dash var(--fs,1s) linear infinite; }
      .soc { fill:#1d2733; font:800 26px system-ui,sans-serif; text-anchor:middle; }
      .state { fill:#4b5563; font:700 7.5px system-ui,sans-serif; text-anchor:middle; letter-spacing:.12em; }
      .status-line { display:none; text-align:center; font-weight:700; font-size:max(11px, .75em); letter-spacing:.08em; text-transform:uppercase; color:var(--secondary-text-color); margin:2px 0 4px; }
      .sp-below .status-line { display:block; } .sp-below #state { display:none; }
      @container (max-width:260px) { .sp-auto .status-line { display:block; } .sp-auto #state { display:none; } }
      .layout-split { display:grid; grid-template-columns:minmax(0, .8fr) minmax(0, 1.2fr); grid-template-rows:auto auto 1fr; column-gap:8px; align-content:center; }
      .layout-split svg { grid-column:1; grid-row:1 / 4; align-self:center; transform:none; }
      .layout-split .title { grid-column:2; grid-row:1; flex-wrap:wrap; gap:4px; margin:0 0 2px; font-size:.95em; }
      .layout-split .title span { min-width:0; overflow-wrap:anywhere; }
      .layout-split .status-line { grid-column:2; grid-row:2; display:block; text-align:left; margin:0 0 4px; }
      .layout-split #state { display:none; }
      .layout-split .stats { grid-column:2; grid-row:3; grid-template-columns:minmax(0, 1fr); min-width:0; align-self:start; gap:4px; margin-top:0; }
      .layout-split .stat { padding:4px 6px; text-align:left; }
      .layout-split .stat { min-width:0; overflow-wrap:anywhere; }
      .layout-split .stat .v { font-size:.95em; }
      .bolt { fill:#ffb300; opacity:0; } .charging .bolt { opacity:1; animation:blink 1.2s infinite; }
      .arrow { fill:#00acc1; opacity:0; } .discharging .arrow { opacity:1; animation:blink 1.2s infinite; }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } } @keyframes blink { 50% { opacity:.35; } }
      @keyframes wave { from { transform:translate(-12px, var(--wy,0px)); } to { transform:translate(8px, var(--wy,0px)); } }
    </style>
    <ha-card id="card" class="sp-${['inside', 'below'].includes(this._config.status_position) ? this._config.status_position : 'auto'}${this._config.layout === 'split' ? ' layout-split' : ''}">
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge">${this._t('low')}</span></div>
      <svg viewBox="0 -6 320 176" id="svg">
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7f8f9"/><stop offset="1" stop-color="#e3e6e9"/></linearGradient>
          ${clips}
        </defs>
        ${[2, 1, 0].map((i) => mod(X[i], i)).join('')}
        ${cables.map((d) => `<path class="cable-b" d="${d}"/><path class="cable" d="${d}"/><path class="flow" d="${d}"/>`).join('')}
        <text class="state" id="state" x="${X[1] + W / 2}" y="${TOP + LID + 20}"></text>
        <text class="soc" id="soc" x="${X[1] + W / 2}" y="${TOP + LID + 52}"></text>
        <path class="bolt" d="M${X[1] + 44} ${TOP + LID + 60} l-9 13 h6 l-3 11 l9 -13 h-6 z"/>
        <path class="arrow" d="M${X[1] + 40} ${TOP + LID + 84} l-7 -9 h4 v-9 h6 v9 h4 z"/>
      </svg>
      <div class="status-line" id="statusline"></div>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const soc = this._num(c.entity_soc), energy = this._num(c.entity_energy), temp = this._num(c.entity_temperature);
    let p = this._num(c.entity_power); if (p !== null && c.invert_power) p = -p;
    const pct = soc === null ? 0 : Math.max(0, Math.min(100, soc));
    // Remplissage des 3 modules (corps : y 62 → 160)
    const h = 98 * pct / 100;
    [0, 1, 2].forEach((i) => {
      const liq = r.getElementById(`liq${i}`); liq.setAttribute('y', 160 - h); liq.setAttribute('height', h);
      r.getElementById(`wave${i}`).style.setProperty('--wy', `${160 - h - 5}px`);
    });
    r.getElementById('soc').textContent = soc === null ? '—' : `${Math.round(pct)}%`;
    const color = pct <= c.low_threshold ? '#e53935' : pct <= 40 ? '#fb8c00' : '#43a047';
    const svg = r.getElementById('svg'); svg.style.setProperty('--lc', color);
    const mode = p === null || Math.abs(p) < 10 ? 'idle' : p > 0 ? 'charging' : 'discharging';
    svg.classList.remove('charging', 'discharging', 'idle'); svg.classList.add(mode);
    r.getElementById('state').textContent = r.getElementById('statusline').textContent = this._t(mode).toUpperCase();
    const ratio = Math.min(Math.abs(p || 0) / c.max_power, 1);
    svg.style.setProperty('--fs', `${(1.4 - ratio * 1.1).toFixed(2)}s`);
    svg.style.setProperty('--bl', mode === 'idle' ? '3s' : '1s');
    r.getElementById('card').classList.toggle('low', soc !== null && pct <= c.low_threshold);

    // Temps restant avant plein / vide
    let time = null;
    if (c.show_time && p !== null && Math.abs(p) >= 10 && c.capacity_kwh) {
      const kwh = p > 0 ? c.capacity_kwh * (100 - pct) / 100 : c.capacity_kwh * pct / 100;
      const hrs = kwh * 1000 / Math.abs(p);
      time = `${p > 0 ? this._t('full') : this._t('empty')} ${Math.floor(hrs)}h${String(Math.round((hrs % 1) * 60)).padStart(2, '0')}`;
    }
    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), f(p === null ? null : Math.abs(p), 0, 'W')]);
    if (c.show_energy) it.push([this._l('energy'), f(energy !== null ? energy : (soc === null ? null : c.capacity_kwh * pct / 100), 1, 'kWh')]);
    if (c.show_temperature) it.push([this._l('temp'), f(temp, 0, '°C')]);
    if (time) it.push(['⏱', time]);
    r.getElementById('stats').innerHTML = it.map(([l, v]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
define('appliance-battery-card', ApplianceBatteryCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-battery-card', name: 'Appliance – Solar battery / Batterie solaire', description: 'Batterie de stockage solaire animée', preview: false });
})();

/* ================================================================== */
/* appliance-ev-charger-card.js                                     */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-ev-charger-card — wallbox murale + voiture branchée, animée
 * type: custom:appliance-ev-charger-card
 */
const I18N_EV = {
  "en": {
    "name": "EV charger",
    "power": "Power",
    "energy": "Session",
    "soc": "Battery",
    "status": "Status",
    "duration": "Duration",
    "cost": "Cost",
    "charging": "Charging",
    "plugged": "Plugged in",
    "done": "Complete",
    "disconnected": "Unplugged"
  },
  "de": {
    "name": "Wallbox",
    "power": "Leistung",
    "energy": "Ladevorgang",
    "soc": "Akku",
    "status": "Status",
    "duration": "Dauer",
    "cost": "Kosten",
    "charging": "Lädt",
    "plugged": "Eingesteckt",
    "done": "Fertig",
    "disconnected": "Nicht verbunden"
  },
  "fr": {
    "name": "Borne de recharge",
    "power": "Puissance",
    "energy": "Session",
    "soc": "Batterie",
    "status": "Statut",
    "duration": "Durée",
    "cost": "Coût",
    "charging": "En charge",
    "plugged": "Branchée",
    "done": "Terminée",
    "disconnected": "Débranchée"
  },
  "nb": {
    "name": "Elbillader",
    "power": "Effekt",
    "energy": "Økt",
    "soc": "Batteri",
    "status": "Status",
    "duration": "Varighet",
    "cost": "Kostnad",
    "charging": "Lader",
    "plugged": "Tilkoblet",
    "done": "Ferdig",
    "disconnected": "Frakoblet"
  },
  "nl": {
    "name": "Laadpaal",
    "power": "Vermogen",
    "energy": "Sessie",
    "soc": "Batterij",
    "status": "Status",
    "duration": "Duur",
    "cost": "Kost",
    "charging": "Laden",
    "plugged": "Aangesloten",
    "done": "Volgeladen",
    "disconnected": "Niet aangesloten"
  },
  "ro": {
    "name": "Stație de încărcare",
    "power": "Putere",
    "energy": "Sesiune",
    "soc": "Baterie",
    "status": "Stare",
    "duration": "Durată",
    "cost": "Cost",
    "charging": "Se încarcă",
    "plugged": "Conectat",
    "done": "Finalizat",
    "disconnected": "Deconectat"
  },
  "ru": {
    "name": "Зарядка электромобиля",
    "power": "Мощность",
    "energy": "Сессия",
    "soc": "Батарея",
    "status": "Статус",
    "duration": "Длительность",
    "cost": "Стоимость",
    "charging": "Зарядка",
    "plugged": "Подключено",
    "done": "Завершено",
    "disconnected": "Отключено"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class ApplianceEvChargerCard extends HTMLElement {
  static getStubConfig() { return { entity_power: '', entity_session_energy: '', entity_car_soc: '', entity_status: '', max_power: 7400, price_per_kwh: 0.2 }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_session_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_car_soc', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_status', selector: { entity: { domain: ['sensor', 'binary_sensor', 'select'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'max_power', selector: { number: { min: 1000, max: 22000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
          { name: 'car_color', selector: { text: {} } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_soc', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_duration', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_EV) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = { show_power: true, show_energy: true, show_soc: true, show_status: true, show_duration: true, show_cost: true,
      max_power: 7400, price_per_kwh: 0.2, car_color: '#3d6fb6', ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    this._hass = h;
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config.language || lang(h);
    if (l !== this._lng) { this._lng = l; this._built = false; this._build(); }
    this._update();
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  connectedCallback() { this._timer = setInterval(() => this._update(), 30000); } // rafraîchit la durée
  disconnectedCallback() { clearInterval(this._timer); }
  _t(k) { return (I18N_EV[this._config.language || lang(this._hass)] || I18N_EV.en)[k] ?? I18N_EV.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const car = esc(this._config.car_color);
    const cable = 'M44 112 C 44 168, 112 170, 134 118';
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; margin:0 4px 4px; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
      .ledbar { fill:var(--st,#9e9e9e); filter:drop-shadow(0 0 4px var(--st,#9e9e9e)); transition:fill .6s; }
      .charging .ledbar { animation:breathe var(--sp,2s) ease-in-out infinite; }
      .scr { fill:#0c1a24; } .scrtxt { fill:#7fe0ff; font:700 8px 'Courier New',monospace; text-anchor:middle; }
      .cable { fill:none; stroke:#1b1b1b; stroke-width:6; stroke-linecap:round; }
      .flow { fill:none; stroke:#7cff9b; stroke-width:2.6; stroke-linecap:round; stroke-dasharray:2 9; opacity:0; }
      .charging .flow { opacity:1; animation:dash var(--sp,1s) linear infinite; }
      .plugged-cable { transition:opacity .6s; } .disconnected .plugged-cable { opacity:0; }
      .hang { opacity:0; transition:opacity .6s; } .disconnected .hang { opacity:1; }
      .spark { fill:#fff59d; opacity:0; } .charging .spark { animation:spark 1.2s ease-in-out infinite; }
      .gfill { fill:var(--gc,#43a047); transition:width 1.2s ease, fill .6s; }
      .charging .gfill { animation:breathe 2s ease-in-out infinite; }
      .gtxt { fill:#fff; font:800 10px system-ui,sans-serif; text-anchor:middle; text-shadow:0 1px 2px rgba(0,0,0,.6); }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } }
      @keyframes breathe { 50% { opacity:.45; } }
      @keyframes spark { 0%,100% { opacity:0; transform:scale(.6); } 50% { opacity:1; transform:scale(1.1); } }
    </style>
    <ha-card>
      <div class="title">${esc(this._config.name || this._t('name'))}</div>
      <svg viewBox="0 0 340 172" id="svg">
        <defs>
          <linearGradient id="wb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#40454d"/><stop offset="1" stop-color="#16191d"/></linearGradient>
          <linearGradient id="carb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${car}"/><stop offset="1" stop-color="${car}" stop-opacity=".75"/></linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc3dc"/><stop offset="1" stop-color="#2d4456"/></linearGradient>
        </defs>

        <!-- Wallbox -->
        <rect x="12" y="6" width="64" height="106" rx="14" fill="url(#wb)"/>
        <rect x="18" y="12" width="52" height="94" rx="10" fill="#2c3036" stroke="rgba(255,255,255,.08)"/>
        <rect class="ledbar" x="41" y="22" width="6" height="44" rx="3"/>
        <rect class="scr" x="25" y="76" width="38" height="16" rx="3"/>
        <text class="scrtxt" x="44" y="87" id="scr"></text>
        <rect x="36" y="104" width="16" height="10" rx="3" fill="#111"/>
        <!-- Câble rangé (débranché) -->
        <path class="hang cable" d="M44 112 C 44 150, 92 150, 84 110"/>
        <rect class="hang" x="78" y="96" width="12" height="16" rx="3" fill="#2a2a2a"/>

        <!-- Voiture de profil (avant à droite) -->
        <ellipse cx="228" cy="160" rx="108" ry="5" fill="rgba(0,0,0,.18)"/>
        <path d="M122 142 L122 120 Q124 108 142 104 L180 99 Q200 78 236 75 L272 75 Q300 77 318 98 L328 102 Q338 106 338 122 L338 142 Z" fill="url(#carb)"/>
        <path d="M188 99 Q206 82 236 80 L250 80 L250 99 Z" fill="url(#glass)"/>
        <path d="M256 80 L272 80 Q294 82 308 99 L256 99 Z" fill="url(#glass)"/>
        <rect x="251" y="80" width="4" height="20" fill="${car}"/>
        <path d="M200 104 V138 M256 104 V138" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
        <rect x="236" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/><rect x="292" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/>
        <path d="M330 106 l6 2 v6 l-7 -1 z" fill="#fff6c2"/><rect x="122" y="108" width="5" height="8" rx="1" fill="#e53935"/>
        <rect x="122" y="132" width="216" height="6" fill="rgba(0,0,0,.25)"/>
        ${[160, 300].map((x) => `<g><circle cx="${x}" cy="142" r="17" fill="#141414"/><circle cx="${x}" cy="142" r="9" fill="#9aa3ad"/><circle cx="${x}" cy="142" r="3" fill="#555"/></g>`).join('')}
        <!-- Trappe de recharge -->
        <rect x="130" y="112" width="10" height="10" rx="2" fill="#1d1d1d"/>
        <!-- Jauge batterie voiture sur la portière -->
        <g id="gauge">
          <rect x="205" y="110" width="80" height="20" rx="5" fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
          <rect x="285" y="116" width="4" height="8" rx="1.5" fill="rgba(255,255,255,.85)"/>
          <rect class="gfill" id="gfill" x="208" y="113" width="0" height="14" rx="3"/>
          <text class="gtxt" x="245" y="124" id="gtxt"></text>
        </g>

        <!-- Câble branché + flux -->
        <g class="plugged-cable">
          <path class="cable" d="${cable}"/>
          <path class="flow" d="${cable}"/>
          <rect x="128" y="111" width="12" height="12" rx="3" fill="#2a2a2a"/>
          <g transform="translate(134 117)"><path class="spark" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" style="transform-box:fill-box;transform-origin:center"/></g>
        </g>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  // Statut : depuis l'entité si fournie (mots-clés FR/EN), sinon déduit de la puissance
  _status(watts) {
    const c = this._config, s = c.entity_status && this._hass.states[c.entity_status];
    if (s) {
      const v = String(s.state).toLowerCase();
      if (/charg(ing|e)\b|en charge|charging/.test(v) && !/dis|termin|complete/.test(v)) return 'charging';
      if (/complete|finish|termin|full|plein|done/.test(v)) return 'done';
      if (/connect|plug|branch|on|wait|attente|ready|prêt/.test(v) && !/disconnect|déconnect|débranch|unplug/.test(v)) return watts > 50 ? 'charging' : 'plugged';
      return 'disconnected';
    }
    return watts > 50 ? 'charging' : 'plugged';
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const ps = c.entity_power && this._hass.states[c.entity_power];
    let w = this._num(c.entity_power);
    if (w !== null && ps && /kw/i.test(ps.attributes.unit_of_measurement || '')) w *= 1000;
    const energy = this._num(c.entity_session_energy), soc = this._num(c.entity_car_soc);
    let cost = this._num(c.entity_cost);
    if (cost === null && energy !== null && c.price_per_kwh) cost = energy * c.price_per_kwh;
    const st = this._status(w || 0);

    const svg = r.getElementById('svg');
    svg.classList.remove('charging', 'plugged', 'done', 'disconnected'); svg.classList.add(st);
    const colors = { charging: '#43ff64', plugged: '#3fa9ff', done: '#43a047', disconnected: '#d0d0d0' };
    svg.style.setProperty('--st', colors[st]);
    const ratio = Math.min((w || 0) / c.max_power, 1);
    svg.style.setProperty('--sp', `${(1.6 - ratio * 1.2).toFixed(2)}s`);
    r.getElementById('scr').textContent = st === 'charging' ? `${((w || 0) / 1000).toFixed(1)} kW` : this._t(st).toUpperCase().slice(0, 9);

    // Jauge voiture
    const pct = soc === null ? 0 : Math.max(0, Math.min(100, soc));
    r.getElementById('gfill').setAttribute('width', (74 * pct / 100).toFixed(1));
    r.getElementById('gauge').style.display = soc === null ? 'none' : '';
    svg.style.setProperty('--gc', pct < 20 ? '#e53935' : pct < 50 ? '#fb8c00' : '#43a047');
    r.getElementById('gtxt').textContent = soc === null ? '' : `${Math.round(pct)}%`;

    // Durée depuis le dernier changement d'état (statut, sinon puissance)
    let dur = null;
    const ref = (c.entity_status && this._hass.states[c.entity_status]) || ps;
    if (st === 'charging' && ref && ref.last_changed) {
      const m = Math.max(0, Math.round((Date.now() - new Date(ref.last_changed).getTime()) / 60000));
      dur = `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
    }

    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), w === null ? '—' : w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`]);
    if (c.show_energy) it.push([this._l('energy'), f(energy, 1, 'kWh')]);
    if (c.show_soc && soc !== null) it.push([this._l('soc'), f(soc, 0, '%')]);
    if (c.show_status) it.push([this._l('status'), this._t(st)]);
    if (c.show_duration) it.push([this._l('duration'), dur || '—']);
    if (c.show_cost) it.push([this._l('cost'), f(cost, 2, '€')]);
    // 5-6 valeurs → 2 lignes équilibrées
    r.getElementById('stats').style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    r.getElementById('stats').innerHTML = it.map(([l, v]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
define('appliance-ev-charger-card', ApplianceEvChargerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-ev-charger-card', name: 'Appliance – EV charger / Borne de recharge', description: 'Wallbox murale animée avec voiture branchée', preview: false });
})();

/* ================================================================== */
/* appliance-robot-vacuum-card.js                                   */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-robot-vacuum-card — robot aspirateur + station de vidage, animé, avec commandes
 * type: custom:appliance-robot-vacuum-card
 */
const I18N_VAC = {
  "en": {
    "name": "Robot vacuum",
    "battery": "Battery",
    "area": "Area",
    "time": "Time",
    "fan": "Suction",
    "status": "Status",
    "filter": "Filter",
    "brush": "Brush",
    "start": "Start",
    "pause": "Pause",
    "dock": "Dock",
    "cleaning": "Cleaning",
    "docked": "Docked",
    "charging": "Charging",
    "returning": "Returning",
    "paused": "Paused",
    "idle": "Idle",
    "error": "Error",
    "emptying": "Emptying"
  },
  "de": {
    "name": "Saugroboter",
    "battery": "Akku",
    "area": "Fläche",
    "time": "Dauer",
    "fan": "Saugleistung",
    "status": "Status",
    "filter": "Filter",
    "brush": "Bürste",
    "start": "Start",
    "pause": "Pause",
    "dock": "Station",
    "cleaning": "Reinigt",
    "docked": "In der Station",
    "charging": "Lädt",
    "returning": "Kehrt zurück",
    "paused": "Pausiert",
    "idle": "Inaktiv",
    "error": "Fehler",
    "emptying": "Entleert"
  },
  "fr": {
    "name": "Robot aspirateur",
    "battery": "Batterie",
    "area": "Surface",
    "time": "Durée",
    "fan": "Aspiration",
    "status": "Statut",
    "filter": "Filtre",
    "brush": "Brosse",
    "start": "Démarrer",
    "pause": "Pause",
    "dock": "Base",
    "cleaning": "Nettoyage",
    "docked": "À la base",
    "charging": "En charge",
    "returning": "Retour base",
    "paused": "En pause",
    "idle": "Inactif",
    "error": "Erreur",
    "emptying": "Vidage"
  },
  "nb": {
    "name": "Robotstøvsuger",
    "battery": "Batteri",
    "area": "Areal",
    "time": "Tid",
    "fan": "Sugeeffekt",
    "status": "Status",
    "filter": "Filter",
    "brush": "Børste",
    "start": "Start",
    "pause": "Pause",
    "dock": "Til lader",
    "cleaning": "Rengjør",
    "docked": "I laderen",
    "charging": "Lader",
    "returning": "På vei hjem",
    "paused": "Pause",
    "idle": "Inaktiv",
    "error": "Feil",
    "emptying": "Tømmer"
  },
  "nl": {
    "name": "Robotstofzuiger",
    "battery": "Batterij",
    "area": "Oppervlakte",
    "time": "Tijd",
    "fan": "Zuigkracht",
    "status": "Status",
    "filter": "Filter",
    "brush": "Borstel",
    "start": "Start",
    "pause": "Pauze",
    "dock": "Naar basis",
    "cleaning": "Aan het poetsen",
    "docked": "In basis",
    "charging": "Laden",
    "returning": "Keert terug",
    "paused": "Gepauzeerd",
    "idle": "Inactief",
    "error": "Fout",
    "emptying": "Aan het legen"
  },
  "ro": {
    "name": "Robot aspirator",
    "battery": "Baterie",
    "area": "Suprafață",
    "time": "Timp",
    "fan": "Aspirare",
    "status": "Stare",
    "filter": "Filtru",
    "brush": "Perie",
    "start": "Start",
    "pause": "Pauză",
    "dock": "Bază",
    "cleaning": "Curățare",
    "docked": "La bază",
    "charging": "Se încarcă",
    "returning": "Revine la bază",
    "paused": "În pauză",
    "idle": "Inactiv",
    "error": "Eroare",
    "emptying": "Golire"
  },
  "ru": {
    "name": "Робот-пылесос",
    "battery": "Батарея",
    "area": "Площадь",
    "time": "Время",
    "fan": "Всасывание",
    "status": "Статус",
    "filter": "Фильтр",
    "brush": "Щётка",
    "start": "Старт",
    "pause": "Пауза",
    "dock": "На базу",
    "cleaning": "Уборка",
    "docked": "На базе",
    "charging": "Зарядка",
    "returning": "Возврат",
    "paused": "Пауза",
    "idle": "Простой",
    "error": "Ошибка",
    "emptying": "Очистка"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
const ICONS_VAC = {
  start: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
  dock: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/>',
};

// Logique commune (états, services, stats) — le dessin est dans la carte « seule » ci-dessous
class ApplianceRobotVacuumCard extends HTMLElement {
  static getStubConfig() { return { entity: '' }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: 'vacuum' } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_battery', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_area', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_time', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_status', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_filter', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_brush', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_battery', selector: { boolean: {} }, default: true },
          { name: 'show_area', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_fan', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_consumables', selector: { boolean: {} }, default: true },
          { name: 'show_buttons', selector: { boolean: {} }, default: true },
        ] },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'compact'] } } },
        { name: 'image', selector: { text: {} } },
        { name: 'language', selector: { select: { options: Object.keys(I18N_VAC) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    if (!config.entity) throw new Error('entity (vacuum.xxx) requise');
    this._config = { show_battery: true, show_area: true, show_time: true, show_fan: true, show_status: true,
      show_consumables: true, show_buttons: true, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return this._config && this._config.layout === 'compact' ? 3 : 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_VAC[this._config.language || lang(this._hass)] || I18N_VAC.en)[k] ?? I18N_VAC.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _call(action) {
    if (!this._hass) return;
    const svc = { start: 'start', pause: 'pause', dock: 'return_to_base' }[action];
    this._hass.callService('vacuum', svc, { entity_id: this._config.entity });
  }

  _st(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) {
    const s = this._st(id); if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot, e = this._st(c.entity);
    if (!e) return;
    const a = e.attributes || {};
    const status = String((this._st(c.entity_status) || {}).state || a.status || '').toLowerCase();
    let st = ['cleaning', 'docked', 'returning', 'paused', 'idle', 'error'].includes(e.state) ? e.state : 'idle';
    if (st === 'docked' && /charg/.test(status)) st = 'charging';
    const emptying = /empt|vidage|evacu|self.?clean/.test(status);

    const svg = r.getElementById('svg');
    const prev = this._lastSt;
    svg.setAttribute('class', `${st}${emptying ? ' emptying' : ''}${st === 'charging' ? ' docked' : ''}`);
    r.getElementById('card').classList.toggle('error', st === 'error');
    r.getElementById('err').textContent = st === 'error' ? (a.error || this._t('error')) : '';
    this._lastSt = st;

    // Boutons : met en évidence l'action correspondant à l'état
    const active = { cleaning: 'start', paused: 'pause', returning: 'dock', docked: 'dock', charging: 'dock' }[st];
    r.querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', b.dataset.a === active));
    r.getElementById('btns').style.display = c.show_buttons ? '' : 'none';

    const batt = this._num(c.entity_battery) ?? (a.battery_level ?? null);
    const area = this._num(c.entity_area), time = this._num(c.entity_time);
    const it = [], compact = c.layout === 'compact';
    if (compact) {
      r.getElementById('card').dataset.st = st;
      r.getElementById('cst').textContent = this._t(emptying ? 'emptying' : st);
    }
    if (c.show_battery) it.push([this._l('battery'), batt === null ? '—' : `${Math.round(batt)} %`]);
    if (c.show_status && !compact) it.push([this._l('status'), this._t(emptying ? 'emptying' : st)]);
    if (c.show_area) it.push([this._l('area'), area === null ? '—' : `${Math.round(area)} m²`]);
    if (c.show_time) it.push([this._l('time'), time === null ? '—' : `${Math.round(time)} min`]);
    if (c.show_fan && a.fan_speed) it.push([this._l('fan'), String(a.fan_speed)]);
    if (c.show_consumables) {
      const fl = this._num(c.entity_filter), br = this._num(c.entity_brush);
      if (fl !== null) it.push([this._l('filter'), `${Math.round(fl)} %`]);
      if (br !== null) it.push([this._l('brush'), `${Math.round(br)} %`]);
    }
    const stats = r.getElementById('stats');
    if (compact) { stats.innerHTML = it.map(([l, v]) => `<div class="tile"><span class="val">${esc(v)}</span><span class="lbl">${esc(l)}</span></div>`).join(''); return; }
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
window.customCards = window.customCards || [];

/* ───────────────────────────────────────────────────────────────
 * Variante « robot seul » : pas de fond, pas de station, animation sur place
 * type: custom:appliance-robot-vacuum-solo-card  (mêmes options que la carte complète)
 * ─────────────────────────────────────────────────────────────── */
const COMMON_CSS_VAC = `
  :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
  ha-card { padding:12px; overflow:hidden; }
  .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; }
  .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
  .error .badge { display:inline-block; }
  svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
  .btns { display:flex; gap:8px; margin-top:8px; }
  .btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:none; cursor:pointer; border-radius:999px; padding:8px 6px;
    background:var(--secondary-background-color, rgba(127,127,127,.15)); color:var(--primary-text-color,#222); font:600 .85em system-ui,sans-serif; transition:transform .1s, background .2s; }
  .btn:active { transform:scale(.95); } .btn svg { width:18px; height:18px; fill:currentColor; }
  .btn.on { background:var(--primary-color,#03a9f4); color:#fff; }
  .stats { display:grid; gap:8px; margin-top:8px; }
  .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
  .stat .v { font-weight:700; font-size:1.02em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
  @keyframes blink { 50% { opacity:.3 } } @keyframes breathe { 50% { opacity:.4 } }
  /* format compact : vignette à gauche, nom + état, tuiles, boutons dessous */
  .compact { padding:14px; }
  .compact .top { display:grid; grid-template-columns:auto minmax(0,1fr); grid-template-areas:"illus head" "illus stats"; column-gap:14px; row-gap:10px; align-items:start; }
  .compact .illus { grid-area:illus; width:var(--appliance-illustration-size,116px); aspect-ratio:120/140; border-radius:16px; padding:4px; box-sizing:content-box;
    display:flex; align-items:center; background:radial-gradient(circle at 50% 40%, rgba(127,127,127,.10), rgba(127,127,127,.03) 70%); }
  .compact .illus svg { width:100%; height:auto; }
  .compact .head { grid-area:head; display:flex; flex-direction:column; gap:3px; min-width:0; }
  .compact .name { font-size:16px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .status { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--secondary-text-color); }
  .compact .dot { width:8px; height:8px; border-radius:50%; flex:none; background:var(--disabled-text-color,#9e9e9e); }
  .compact[data-st=cleaning] .dot, .compact[data-st=mowing] .dot { background:var(--appliance-ok-color,#43a047); box-shadow:0 0 0 3px rgba(67,160,71,.25); }
  .compact[data-st=cleaning] .status, .compact[data-st=mowing] .status { color:var(--primary-text-color); }
  .compact[data-st=returning] .dot { background:#3fa9ff; } .compact[data-st=paused] .dot { background:#ffb300; } .compact[data-st=error] .dot { background:#e53935; }
  .compact .badge { align-self:flex-start; }
  .compact .stats { grid-area:stats; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; margin-top:0; }
  .compact .tile { display:flex; flex-direction:column; padding:6px 9px; border-radius:10px; min-width:0; background:rgba(127,127,127,.09); }
  .compact .val { font-size:14px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .lbl { font-size:11px; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .btns { margin-top:10px; } .compact .btn { border-radius:10px; }
  /* image perso (option image) : atténuée à l'arrêt, nette en marche */
  .uimg { transition:opacity .4s, filter .4s; opacity:.8; }
  .cleaning .uimg, .mowing .uimg, .returning .uimg { opacity:1; }
  .error .uimg { filter:drop-shadow(0 0 4px #e53935); }`;

class ApplianceRobotVacuumSoloCard extends ApplianceRobotVacuumCard {
  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const brush = (x) => `<g transform="translate(${x} 113)"><g class="brush">
      ${[0, 120, 240].map((a) => `<line x1="0" y1="0" x2="17" y2="0" transform="rotate(${a}) scale(1 .35)" stroke="#6b7178" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
      <circle r="3" fill="#30343a"/></g></g>`;
    const dust = Array.from({ length: 12 }, (_, i) =>
      `<circle class="dust" cx="${70 + (i * 37) % 100}" cy="${132 + (i % 3) * 3}" r="${1.2 + (i % 3) * .5}" style="animation-delay:${(i * .17) % 1.4}s"/>`).join('');
    const compact = this._config.layout === 'compact', img = String(this._config.image || '').trim();
    // option image : la photo de l'utilisateur remplace le dessin (mêmes classes d'état pour l'atténuer à l'arrêt)
    const art = img ? `<svg viewBox="${compact ? '0 0 120 140' : '0 0 240 142'}" id="svg"><image class="uimg" href="${esc(img)}" width="${compact ? 120 : 240}" height="${compact ? 140 : 142}" preserveAspectRatio="xMidYMid meet"/></svg>` : `
      <svg viewBox="${compact ? '28 4 196 136' : '0 0 240 142'}" id="svg">
        <defs>
          <linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3d8dd"/></linearGradient>
          <linearGradient id="side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9bfc5"/><stop offset="1" stop-color="#868d94"/></linearGradient>
        </defs>
        ${dust}
        <g class="bot">
          <ellipse cx="120" cy="122" rx="96" ry="11" fill="rgba(0,0,0,.25)"/>
          ${brush(64)}${brush(176)}
          <path d="M30 78 V96 Q30 120 120 120 Q210 120 210 96 V78 Z" fill="url(#side)"/>
          <path d="M34 92 Q40 116 120 117 Q200 116 206 92 V100 Q200 121 120 121 Q40 121 34 100 Z" fill="#2b2f35"/>
          <ellipse cx="120" cy="78" rx="90" ry="30" fill="url(#top)"/>
          <ellipse class="track" cx="120" cy="80" rx="74" ry="23"/>
          <ellipse class="ring" id="ring" cx="120" cy="80" rx="74" ry="23" pathLength="100" stroke-dasharray="0 100" transform="rotate(180 120 80)"/>
          <circle cx="104" cy="94" r="3.5" fill="#cfd4d9" stroke="#b5bbc1"/><circle cx="136" cy="94" r="3.5" fill="#cfd4d9" stroke="#b5bbc1"/>
          <rect x="102" y="54" width="36" height="18" rx="9" fill="#2b2f35"/>
          <ellipse cx="120" cy="55" rx="18" ry="5.5" fill="#4a4f56"/>
          <rect x="108" y="62" width="24" height="4" rx="2" fill="#111"/>
          <rect class="scan" x="108" y="62" width="6" height="4" rx="2"/>
        </g>
        <path class="ico bolt" d="M206 8 l-10 16 h7 l-3 13 l11 -17 h-7 z" fill="#ffd43b"/>
        <path class="ico home" d="M206 10 l-12 11 h4 v10 h6 v-7 h4 v7 h6 v-10 h4 z" fill="#3fa9ff"/>
        <path class="ico pz" d="M198 12 h5 v18 h-5z M208 12 h5 v18 h-5z" fill="#ffb300"/>
      </svg>`;
    const btns = `<div class="btns" id="btns">${['start', 'pause', 'dock'].map((a) => `<button class="btn" data-a="${a}"><svg viewBox="0 0 24 24">${ICONS_VAC[a]}</svg>${this._t(a)}</button>`).join('')}</div>`;
    this.shadowRoot.innerHTML = `
    <style>${COMMON_CSS_VAC}
      .bot { transform-origin:120px 100px; }
      .cleaning .bot { animation:wiggle 2.4s ease-in-out infinite; }
      .returning .bot { animation:wiggle 1.6s ease-in-out infinite; }
      .error .bot { animation:shake .4s ease-in-out infinite; }
      .brush { transform:rotate(0); } .cleaning .brush { animation:spin .3s linear infinite; } .returning .brush { animation:spin 1s linear infinite; }
      .dust { fill:#9a9a9a; opacity:0; } .cleaning .dust { animation:suck 1.4s ease-in infinite; }
      .scan { fill:#7fe0ff; opacity:.0; } .cleaning .scan, .returning .scan { opacity:.9; animation:scan 1.2s linear infinite; }
      .track { fill:none; stroke:rgba(0,0,0,.12); stroke-width:3.5; }
      .ring { fill:none; stroke:var(--rc,#43a047); stroke-width:3.5; stroke-linecap:round; transition:stroke-dasharray 1s ease, stroke .6s;
        filter:drop-shadow(0 0 3px var(--rc,#43a047)); }
      .charging .ring, .docked .ring { animation:breathe 2.4s ease-in-out infinite; }
      .paused .ring { stroke:#ffb300; animation:blink 1s infinite; } .error .ring { stroke:#ff3b30; animation:blink .5s infinite; }
      .ico { opacity:0; transition:opacity .4s; }
      .charging .bolt, .docked .bolt { opacity:1; animation:breathe 1.6s ease-in-out infinite; }
      .returning .home { opacity:1; animation:hop 1s ease-in-out infinite; }
      .paused .pz { opacity:1; }
      @keyframes wiggle { 0%,100% { transform:translateX(0) rotate(0) } 25% { transform:translateX(-6px) rotate(-1.5deg) } 75% { transform:translateX(6px) rotate(1.5deg) } }
      @keyframes shake { 0%,100% { transform:rotate(0) } 25% { transform:rotate(-2deg) } 75% { transform:rotate(2deg) } }
      @keyframes spin { to { transform:rotate(360deg) } }
      @keyframes suck { 0% { opacity:0; transform:translateY(0) } 30% { opacity:.9 } 100% { opacity:0; transform:translateY(-20px) scale(.4) } }
      @keyframes scan { from { transform:translateX(0) } to { transform:translateX(18px) } }
      @keyframes hop { 50% { transform:translateY(-4px) } }
    </style>
    <ha-card id="card"${compact ? ' class="compact"' : ''}>${compact ? `
      <div class="top"><div class="illus">${art}</div>
        <div class="head"><div class="name">${esc(this._config.name || this._t('name'))}</div>
          <div class="status"><span class="dot"></span><span id="cst"></span></div><span class="badge" id="err"></span></div>
        <div class="stats" id="stats"></div></div>${btns}` : `
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge" id="err"></span></div>
      ${art}${btns}
      <div class="stats" id="stats"></div>`}
    </ha-card>`;
    this.shadowRoot.querySelectorAll('.btn').forEach((b) => { b.onclick = () => this._call(b.dataset.a); });
    this._built = true;
  }

  _update() {
    super._update();
    if (!this._built || !this._hass) return;
    const e = this._st(this._config.entity); if (!e) return;
    // Anneau lumineux = niveau de batterie
    const b = this._num(this._config.entity_battery) ?? (e.attributes.battery_level ?? null);
    const pct = b === null ? 100 : Math.max(0, Math.min(100, b));
    const ring = this.shadowRoot.getElementById('ring');
    if (!ring) return; // image perso : pas d'anneau de batterie
    ring.setAttribute('stroke-dasharray', `${pct} 100`);
    this.shadowRoot.getElementById('svg').style.setProperty('--rc', pct < 20 ? '#e53935' : pct < 50 ? '#fb8c00' : '#43a047');
  }
}
define('appliance-robot-vacuum-solo-card', ApplianceRobotVacuumSoloCard);
window.customCards.push({ type: 'appliance-robot-vacuum-solo-card', name: 'Appliance – Robot vacuum (solo) / Robot aspirateur (seul)', description: 'Robot aspirateur seul (sans fond ni station), animé, avec commandes', preview: false });
})();

/* ================================================================== */
/* appliance-robot-mower-card.js                                    */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-robot-mower-card — robot tondeuse + station sur bande de pelouse, animé, avec commandes
 * type: custom:appliance-robot-mower-card
 * Compatible lawn_mower.* (recommandé) et vacuum.* (certaines intégrations de tondeuses)
 */
const I18N_MOW = {
  "en": {
    "name": "Robot mower",
    "battery": "Battery",
    "area": "Area",
    "time": "Mowing",
    "next": "Next start",
    "status": "Status",
    "blade": "Blade",
    "rain": "Rain",
    "start": "Mow",
    "pause": "Pause",
    "dock": "Dock",
    "mowing": "Mowing",
    "docked": "Docked",
    "charging": "Charging",
    "returning": "Returning",
    "paused": "Paused",
    "idle": "Idle",
    "error": "Error"
  },
  "de": {
    "name": "Mähroboter",
    "battery": "Akku",
    "area": "Fläche",
    "time": "Mähzeit",
    "next": "Nächster Start",
    "status": "Status",
    "blade": "Messer",
    "rain": "Regen",
    "start": "Mähen",
    "pause": "Pause",
    "dock": "Station",
    "mowing": "Mäht",
    "docked": "In der Station",
    "charging": "Lädt",
    "returning": "Kehrt zurück",
    "paused": "Pausiert",
    "idle": "Inaktiv",
    "error": "Fehler"
  },
  "fr": {
    "name": "Robot tondeuse",
    "battery": "Batterie",
    "area": "Surface",
    "time": "Tonte",
    "next": "Prochain départ",
    "status": "Statut",
    "blade": "Lame",
    "rain": "Pluie",
    "start": "Tondre",
    "pause": "Pause",
    "dock": "Base",
    "mowing": "Tonte",
    "docked": "À la base",
    "charging": "En charge",
    "returning": "Retour base",
    "paused": "En pause",
    "idle": "Inactif",
    "error": "Erreur"
  },
  "nb": {
    "name": "Robotgressklipper",
    "battery": "Batteri",
    "area": "Areal",
    "time": "Klipping",
    "next": "Neste start",
    "status": "Status",
    "blade": "Kniver",
    "rain": "Regn",
    "start": "Klipp",
    "pause": "Pause",
    "dock": "Til lader",
    "mowing": "Klipper",
    "docked": "I laderen",
    "charging": "Lader",
    "returning": "På vei hjem",
    "paused": "Pause",
    "idle": "Inaktiv",
    "error": "Feil"
  },
  "nl": {
    "name": "Robotmaaier",
    "battery": "Batterij",
    "area": "Oppervlakte",
    "time": "Maaitijd",
    "next": "Volgende start",
    "status": "Status",
    "blade": "Mes",
    "rain": "Regen",
    "start": "Maaien",
    "pause": "Pauze",
    "dock": "Naar basis",
    "mowing": "Aan het maaien",
    "docked": "In basis",
    "charging": "Laden",
    "returning": "Keert terug",
    "paused": "Gepauzeerd",
    "idle": "Inactief",
    "error": "Fout"
  },
  "ro": {
    "name": "Robot de tuns iarba",
    "battery": "Baterie",
    "area": "Suprafață",
    "time": "Cosire",
    "next": "Următoarea pornire",
    "status": "Stare",
    "blade": "Lamă",
    "rain": "Ploaie",
    "start": "Cosește",
    "pause": "Pauză",
    "dock": "Bază",
    "mowing": "Cosește",
    "docked": "La bază",
    "charging": "Se încarcă",
    "returning": "Revine la bază",
    "paused": "În pauză",
    "idle": "Inactiv",
    "error": "Eroare"
  },
  "ru": {
    "name": "Робот-газонокосилка",
    "battery": "Батарея",
    "area": "Площадь",
    "time": "Стрижка",
    "next": "Следующий запуск",
    "status": "Статус",
    "blade": "Нож",
    "rain": "Дождь",
    "start": "Косить",
    "pause": "Пауза",
    "dock": "На базу",
    "mowing": "Стрижка",
    "docked": "На базе",
    "charging": "Зарядка",
    "returning": "Возврат",
    "paused": "Пауза",
    "idle": "Простой",
    "error": "Ошибка"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };
const ICONS_MOW = {
  start: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
  dock: '<path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/>',
};

// Logique commune (états, services, stats) — le dessin est dans la carte « seule » ci-dessous
class ApplianceRobotMowerCard extends HTMLElement {
  static getStubConfig() { return { entity: '' }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: { domain: ['lawn_mower', 'vacuum'] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_battery', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_area', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_time', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_next_start', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_blade', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_rain', selector: { entity: { domain: ['binary_sensor', 'sensor'] } } },
        { name: 'entity_status', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_battery', selector: { boolean: {} }, default: true },
          { name: 'show_area', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_next', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_blade', selector: { boolean: {} }, default: true },
          { name: 'show_buttons', selector: { boolean: {} }, default: true },
        ] },
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'compact'] } } },
        { name: 'image', selector: { text: {} } },
        { name: 'language', selector: { select: { options: Object.keys(I18N_MOW) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    if (!config.entity) throw new Error('entity (lawn_mower.xxx) requise');
    this._config = { show_battery: true, show_area: true, show_time: true, show_next: true, show_status: true,
      show_blade: true, show_buttons: true, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return this._config && this._config.layout === 'compact' ? 3 : 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_MOW[this._config.language || lang(this._hass)] || I18N_MOW.en)[k] ?? I18N_MOW.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _call(action) {
    if (!this._hass) return;
    const domain = this._config.entity.split('.')[0];
    const map = domain === 'vacuum'
      ? { start: 'start', pause: 'pause', dock: 'return_to_base' }
      : { start: 'start_mowing', pause: 'pause', dock: 'dock' };
    this._hass.callService(domain, map[action], { entity_id: this._config.entity });
  }

  _st(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) {
    const s = this._st(id); if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot, e = this._st(c.entity);
    if (!e) return;
    const a = e.attributes || {};
    const status = String((this._st(c.entity_status) || {}).state || a.status || '').toLowerCase();
    let st = e.state === 'cleaning' ? 'mowing' : e.state;
    if (!['mowing', 'docked', 'returning', 'paused', 'idle', 'error'].includes(st)) st = 'idle';
    if (st === 'docked' && /charg/.test(status)) st = 'charging';
    const rainS = this._st(c.entity_rain);
    const raining = !!rainS && (rainS.state === 'on' || /rain|pluie|wet/i.test(rainS.state));

    r.getElementById('svg').setAttribute('class', `${st}${st === 'charging' ? ' docked' : ''}${raining ? ' raining' : ''}`);
    r.getElementById('card').classList.toggle('error', st === 'error');
    r.getElementById('err').textContent = st === 'error' ? (a.error || this._t('error')) : '';

    const active = { mowing: 'start', paused: 'pause', returning: 'dock', docked: 'dock', charging: 'dock' }[st];
    r.querySelectorAll('.btn').forEach((b) => b.classList.toggle('on', b.dataset.a === active));
    r.getElementById('btns').style.display = c.show_buttons ? '' : 'none';

    const batt = this._num(c.entity_battery) ?? (a.battery_level ?? null);
    const area = this._num(c.entity_area), time = this._num(c.entity_time), blade = this._num(c.entity_blade);
    // Prochain départ : timestamp → "ven. 14:30", sinon texte brut
    let next = null; const ns = this._st(c.entity_next_start);
    if (ns && !['unavailable', 'unknown'].includes(ns.state)) {
      const d = new Date(ns.state);
      next = isNaN(d) ? ns.state : d.toLocaleString(c.language === 'en' ? 'en-GB' : 'fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    const it = [], compact = c.layout === 'compact';
    const stTxt = raining && st !== 'mowing' ? `${this._t(st)} · ${this._t('rain')}` : this._t(st);
    if (compact) { r.getElementById('card').dataset.st = st; r.getElementById('cst').textContent = stTxt; }
    if (c.show_battery) it.push([this._l('battery'), batt === null ? '—' : `${Math.round(batt)} %`]);
    if (c.show_status && !compact) it.push([this._l('status'), stTxt]);
    if (c.show_area && area !== null) it.push([this._l('area'), `${Math.round(area)} m²`]);
    if (c.show_time && time !== null) it.push([this._l('time'), time >= 60 ? `${Math.floor(time / 60)}h${String(Math.round(time % 60)).padStart(2, '0')}` : `${Math.round(time)} min`]);
    if (c.show_next && next) it.push([this._l('next'), next]);
    if (c.show_blade && blade !== null) it.push([this._l('blade'), `${Math.round(blade)} %`]);
    const stats = r.getElementById('stats');
    if (compact) { stats.innerHTML = it.map(([l, v]) => `<div class="tile"><span class="val">${esc(v)}</span><span class="lbl">${esc(l)}</span></div>`).join(''); return; }
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
window.customCards = window.customCards || [];

/* ───────────────────────────────────────────────────────────────
 * Variante « tondeuse seule » : pas de fond, pas de station, pas de pelouse
 * type: custom:appliance-robot-mower-solo-card  (mêmes options que la carte complète)
 * ─────────────────────────────────────────────────────────────── */
class ApplianceRobotMowerSoloCard extends ApplianceRobotMowerCard {
  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const wheel = (x, y, rr) => `<g transform="translate(${x} ${y})"><circle r="${rr}" fill="#1b1b1b"/>
      <g class="spin">${[0, 45, 90, 135].map((a) => `<rect x="${-rr}" y="-.7" width="${rr * 2}" height="1.4" fill="#2e2e2e" transform="rotate(${a})"/>`).join('')}
      <circle r="${rr * .55}" fill="#8d959c"/><path d="M${-rr * .55} 0 H${rr * .55} M0 ${-rr * .55} V${rr * .55}" stroke="#4a4f55" stroke-width="1.2"/></g></g>`;
    const clips = Array.from({ length: 10 }, (_, i) =>
      `<path class="clip" d="M${36 + (i % 4) * 2} ${-3 - (i % 3) * 2} l2 -3" stroke="${i % 2 ? '#6cc457' : '#3f9d35'}" style="animation-delay:${i * .11}s"/>`).join('');
    const rain = Array.from({ length: 18 }, (_, i) =>
      `<line class="drop" x1="${14 + (i * 13) % 212}" y1="${-10 - (i * 9) % 30}" x2="${12 + (i * 13) % 212}" y2="${-2 - (i * 9) % 30}" style="animation-delay:${(i * .13) % 1}s"/>`).join('');
    const compact = this._config.layout === 'compact', img = String(this._config.image || '').trim();
    // option image : la photo de l'utilisateur remplace le dessin (mêmes classes d'état pour l'atténuer à l'arrêt)
    const art = img ? `<svg viewBox="${compact ? '0 0 120 140' : '0 0 240 132'}" id="svg"><image class="uimg" href="${esc(img)}" width="${compact ? 120 : 240}" height="${compact ? 140 : 132}" preserveAspectRatio="xMidYMid meet"/></svg>` : `
      <svg viewBox="${compact ? '30 0 196 132' : '0 0 240 132'}" id="svg">
        <defs><linearGradient id="shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f7f8"/><stop offset="1" stop-color="#b8bec4"/></linearGradient></defs>
        <g class="rain">${rain}</g>
        <g transform="translate(112 120) scale(2.05)">
          <ellipse cx="2" cy="1" rx="40" ry="3" fill="rgba(0,0,0,.25)"/>
          <g>${[[42, -14], [46, -8], [40, -20]].map(([x, y], i) => `<line class="speed" x1="${x}" y1="${y}" x2="${x + 8}" y2="${y}" style="animation-delay:${i * .2}s"/>`).join('')}</g>
          ${clips}
          <g class="body">
            <ellipse class="blade" cx="0" cy="-4" rx="14" ry="1.2"/>
            <path d="M-34 -6 Q-36 -22 -16 -27 L16 -28 Q34 -27 37 -12 L37 -6 Z" fill="url(#shell)"/>
            <path d="M-30 -18 Q-26 -26 -12 -27 L14 -28 Q28 -27 32 -18 Z" fill="#8bc34a"/>
            <path d="M-30 -18 H32" stroke="rgba(0,0,0,.12)" stroke-width=".6"/>
            <rect x="-36" y="-10" width="10" height="5" rx="2" fill="#30343a"/>
            <rect x="-6" y="-31" width="16" height="4" rx="2" fill="#30343a"/><circle cx="12" cy="-29" r="1.6" fill="#e53935"/>
            <path d="M8 -31 V-42" stroke="#30343a" stroke-width="1.6"/><circle cx="8" cy="-43" r="2.4" fill="#30343a"/>
            <circle class="led" cx="-14" cy="-23" r="1.8"/>
          </g>
          ${wheel(22, -9, 10)}${wheel(-24, -5, 5.5)}
        </g>
        <path class="ico bolt" d="M214 6 l-10 16 h7 l-3 13 l11 -17 h-7 z" fill="#ffd43b"/>
        <path class="ico home" d="M214 8 l-12 11 h4 v10 h6 v-7 h4 v7 h6 v-10 h4 z" fill="#3fa9ff"/>
        <path class="ico pz" d="M206 10 h5 v18 h-5z M216 10 h5 v18 h-5z" fill="#ffb300"/>
      </svg>`;
    const btns = `<div class="btns" id="btns">${['start', 'pause', 'dock'].map((a) => `<button class="btn" data-a="${a}"><svg viewBox="0 0 24 24">${ICONS_MOW[a]}</svg>${this._t(a)}</button>`).join('')}</div>`;
    this.shadowRoot.innerHTML = `
    <style>${COMMON_CSS_MOW}
      .body { animation:none; } .mowing .body { animation:bounce .35s ease-in-out infinite alternate; }
      .error .body { animation:shake .4s ease-in-out infinite; transform-origin:0 -10px; }
      .spin { transform:rotate(0); } .mowing .spin, .returning .spin { animation:spin .6s linear infinite; }
      .blade { fill:none; stroke:#9aa1a8; stroke-width:.8; stroke-dasharray:2 2; opacity:.35; }
      .mowing .blade { opacity:.9; animation:bladespin .12s linear infinite; }
      .clip { fill:none; stroke-width:1.4; stroke-linecap:round; opacity:0; transform-box:fill-box; transform-origin:center; } .mowing .clip { animation:fly .8s ease-out infinite; }
      .speed { stroke:var(--primary-text-color,#888); stroke-width:1; stroke-linecap:round; opacity:0; }
      .mowing .speed, .returning .speed { animation:streak .7s linear infinite; }
      .led { fill:#9e9e9e; } .mowing .led { fill:#43ff64; animation:blink 1.4s infinite; }
      .docked .led, .charging .led { fill:#43ff64; animation:breathe 2.4s ease-in-out infinite; }
      .returning .led { fill:#3fa9ff; } .paused .led { fill:#ffb300; animation:blink 1s infinite; } .error .led { fill:#ff3b30; animation:blink .5s infinite; }
      .rain { display:none; } .raining .rain { display:inline; }
      .drop { stroke:#7fb8ff; stroke-width:1.4; stroke-linecap:round; animation:fall 1s linear infinite; }
      .ico { opacity:0; transition:opacity .4s; }
      .charging .bolt, .docked .bolt { opacity:1; animation:breathe 1.6s ease-in-out infinite; }
      .returning .home { opacity:1; animation:hop 1s ease-in-out infinite; } .paused .pz { opacity:1; }
      @keyframes bounce { to { transform:translateY(-.6px) } }
      @keyframes shake { 0%,100% { transform:rotate(0) } 25% { transform:rotate(-2deg) } 75% { transform:rotate(2deg) } }
      @keyframes spin { to { transform:rotate(-360deg) } }
      @keyframes bladespin { to { stroke-dashoffset:6 } }
      @keyframes fly { 0% { opacity:0; transform:translate(0,0) } 25% { opacity:1 } 100% { opacity:0; transform:translate(14px,-10px) rotate(160deg) } }
      @keyframes streak { 0% { opacity:0; transform:translateX(0) } 30% { opacity:.5 } 100% { opacity:0; transform:translateX(14px) } }
      @keyframes fall { from { transform:translateY(0) } to { transform:translateY(140px) } }
      @keyframes hop { 50% { transform:translateY(-4px) } }
    </style>
    <ha-card id="card"${compact ? ' class="compact"' : ''}>${compact ? `
      <div class="top"><div class="illus">${art}</div>
        <div class="head"><div class="name">${esc(this._config.name || this._t('name'))}</div>
          <div class="status"><span class="dot"></span><span id="cst"></span></div><span class="badge" id="err"></span></div>
        <div class="stats" id="stats"></div></div>${btns}` : `
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge" id="err"></span></div>
      ${art}${btns}
      <div class="stats" id="stats"></div>`}
    </ha-card>`;
    this.shadowRoot.querySelectorAll('.btn').forEach((b) => { b.onclick = () => this._call(b.dataset.a); });
    this._built = true;
  }
}
const COMMON_CSS_MOW = `
  :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
  ha-card { padding:12px; overflow:hidden; }
  .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; }
  .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
  .error .badge { display:inline-block; }
  svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
  .btns { display:flex; gap:8px; margin-top:8px; }
  .btn { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; border:none; cursor:pointer; border-radius:999px; padding:8px 6px;
    background:var(--secondary-background-color, rgba(127,127,127,.15)); color:var(--primary-text-color,#222); font:600 .85em system-ui,sans-serif; transition:transform .1s, background .2s; }
  .btn:active { transform:scale(.95); } .btn svg { width:18px; height:18px; fill:currentColor; }
  .btn.on { background:var(--primary-color,#43a047); color:#fff; }
  .stats { display:grid; gap:8px; margin-top:8px; }
  .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
  .stat .v { font-weight:700; font-size:1.02em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
  @keyframes blink { 50% { opacity:.3 } } @keyframes breathe { 50% { opacity:.4 } }
  /* format compact : vignette à gauche, nom + état, tuiles, boutons dessous */
  .compact { padding:14px; }
  .compact .top { display:grid; grid-template-columns:auto minmax(0,1fr); grid-template-areas:"illus head" "illus stats"; column-gap:14px; row-gap:10px; align-items:start; }
  .compact .illus { grid-area:illus; width:var(--appliance-illustration-size,116px); aspect-ratio:120/140; border-radius:16px; padding:4px; box-sizing:content-box;
    display:flex; align-items:center; background:radial-gradient(circle at 50% 40%, rgba(127,127,127,.10), rgba(127,127,127,.03) 70%); }
  .compact .illus svg { width:100%; height:auto; }
  .compact .head { grid-area:head; display:flex; flex-direction:column; gap:3px; min-width:0; }
  .compact .name { font-size:16px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .status { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--secondary-text-color); }
  .compact .dot { width:8px; height:8px; border-radius:50%; flex:none; background:var(--disabled-text-color,#9e9e9e); }
  .compact[data-st=cleaning] .dot, .compact[data-st=mowing] .dot { background:var(--appliance-ok-color,#43a047); box-shadow:0 0 0 3px rgba(67,160,71,.25); }
  .compact[data-st=cleaning] .status, .compact[data-st=mowing] .status { color:var(--primary-text-color); }
  .compact[data-st=returning] .dot { background:#3fa9ff; } .compact[data-st=paused] .dot { background:#ffb300; } .compact[data-st=error] .dot { background:#e53935; }
  .compact .badge { align-self:flex-start; }
  .compact .stats { grid-area:stats; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; margin-top:0; }
  .compact .tile { display:flex; flex-direction:column; padding:6px 9px; border-radius:10px; min-width:0; background:rgba(127,127,127,.09); }
  .compact .val { font-size:14px; font-weight:600; color:var(--primary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .lbl { font-size:11px; color:var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .compact .btns { margin-top:10px; } .compact .btn { border-radius:10px; }
  /* image perso (option image) : atténuée à l'arrêt, nette en marche */
  .uimg { transition:opacity .4s, filter .4s; opacity:.8; }
  .cleaning .uimg, .mowing .uimg, .returning .uimg { opacity:1; }
  .error .uimg { filter:drop-shadow(0 0 4px #e53935); }`;
define('appliance-robot-mower-solo-card', ApplianceRobotMowerSoloCard);
window.customCards.push({ type: 'appliance-robot-mower-solo-card', name: 'Appliance – Robot mower (solo) / Robot tondeuse (seul)', description: 'Robot tondeuse seule (sans fond ni station), animée, avec commandes', preview: false });
})();

/* ================================================================== */
/* appliance-pellet-boiler-card.js                                  */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-pellet-boiler-card — chaudière à granulés + trémie + vis sans fin, sans fond, animée
 * type: custom:appliance-pellet-boiler-card
 */
const I18N_PB = {
  "en": {
    "name": "Pellet boiler",
    "power": "Power",
    "energy": "Energy",
    "cost": "Cost",
    "flow": "Flow",
    "ret": "Return",
    "pellets": "Pellets",
    "status": "Status",
    "off": "Off",
    "ignition": "Igniting",
    "heating": "Heating",
    "extinguishing": "Shutting down",
    "alarm": "Alarm",
    "low": "Low pellets"
  },
  "de": {
    "name": "Pelletkessel",
    "power": "Leistung",
    "energy": "Energie",
    "cost": "Kosten",
    "flow": "Vorlauf",
    "ret": "Rücklauf",
    "pellets": "Pellets",
    "status": "Status",
    "off": "Aus",
    "ignition": "Zündung",
    "heating": "Heizt",
    "extinguishing": "Abschaltung",
    "alarm": "Alarm",
    "low": "Pellets niedrig"
  },
  "fr": {
    "name": "Chaudière à granulés",
    "power": "Puissance",
    "energy": "Énergie",
    "cost": "Coût",
    "flow": "Départ",
    "ret": "Retour",
    "pellets": "Granulés",
    "status": "Statut",
    "off": "Arrêt",
    "ignition": "Allumage",
    "heating": "Chauffe",
    "extinguishing": "Extinction",
    "alarm": "Alarme",
    "low": "Granulés bas"
  },
  "nb": {
    "name": "Pelletskjel",
    "power": "Effekt",
    "energy": "Energi",
    "cost": "Kostnad",
    "flow": "Tur",
    "ret": "Retur",
    "pellets": "Pellets",
    "status": "Status",
    "off": "Av",
    "ignition": "Tenner",
    "heating": "Varmer",
    "extinguishing": "Slukker",
    "alarm": "Alarm",
    "low": "Lite pellets"
  },
  "nl": {
    "name": "Pelletketel",
    "power": "Vermogen",
    "energy": "Energie",
    "cost": "Kost",
    "flow": "Aanvoer",
    "ret": "Retour",
    "pellets": "Pellets",
    "status": "Status",
    "off": "Uit",
    "ignition": "Aansteken",
    "heating": "Verwarmen",
    "extinguishing": "Uitdoven",
    "alarm": "Alarm",
    "low": "Pellets bijna op"
  },
  "ro": {
    "name": "Cazan pe peleți",
    "power": "Putere",
    "energy": "Energie",
    "cost": "Cost",
    "flow": "Tur",
    "ret": "Retur",
    "pellets": "Peleți",
    "status": "Stare",
    "off": "Oprit",
    "ignition": "Aprindere",
    "heating": "Încălzire",
    "extinguishing": "Oprire",
    "alarm": "Alarmă",
    "low": "Peleți puțini"
  },
  "ru": {
    "name": "Пеллетный котёл",
    "power": "Мощность",
    "energy": "Энергия",
    "cost": "Стоимость",
    "flow": "Подача",
    "ret": "Обратка",
    "pellets": "Пеллеты",
    "status": "Статус",
    "off": "Выкл.",
    "ignition": "Розжиг",
    "heating": "Нагрев",
    "extinguishing": "Выключение",
    "alarm": "Тревога",
    "low": "Мало пеллет"
  }
};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h) => { const l = ((h && (h.locale?.language || h.language)) || document.documentElement.lang || 'en').toLowerCase().slice(0, 2); return l === 'no' || l === 'nn' ? 'nb' : l; };

class AppliancePelletBoilerCard extends HTMLElement {
  static getStubConfig() { return { entity_power: '', entity_flow_temp: '', entity_return_temp: '', entity_pellet_level: '' }; }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'entity_status', selector: { entity: { domain: ['sensor', 'select', 'climate', 'switch', 'binary_sensor'] } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_flow_temp', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_return_temp', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        { name: 'entity_pellet_level', selector: { entity: { domain: 'sensor' } } },
        { type: 'grid', name: '', schema: [
          { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
          { name: 'threshold', selector: { number: { min: 0, max: 500, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'ignition_threshold', selector: { number: { min: 50, max: 2000, step: 10, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'pellet_alert', selector: { number: { min: 0, max: 50, step: 1, mode: 'box', unit_of_measurement: '%' } } },
          { name: 'flow_temp_max', selector: { number: { min: 40, max: 95, step: 1, mode: 'box', unit_of_measurement: '°C' } } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'show_temps', selector: { boolean: {} }, default: true },
          { name: 'show_pellets', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(I18N_PB) } } },
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = { show_power: true, show_energy: true, show_cost: true, show_temps: true, show_pellets: true, show_status: true,
      price_per_kwh: 0, threshold: 30, ignition_threshold: 300, pellet_alert: 15, flow_temp_max: 80, ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = this._config && (this._config.language || lang(h));
    if (l && l !== this._lng) { this._lng = l; this._hass = h; this._built = false; this._build(); }
    this._hass = h; this._update(); }
  getCardSize() { return 6; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  _t(k) { return (I18N_PB[this._config.language || lang(this._hass)] || I18N_PB.en)[k] ?? I18N_PB.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    // Granulés : petits bâtonnets en rangées (dans l'ouverture de la trémie et le hublot de niveau)
    const pellets = (x0, y0, w, h, n) => Array.from({ length: n }, (_, i) => {
      const x = x0 + ((i * 37) % 100) / 100 * w, y = y0 + ((i * 53) % 100) / 100 * h, a = (i * 47) % 180;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="3.2" height="1.6" rx=".8" transform="rotate(${a} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 3 ? '#c9a066' : '#b38a50'}"/>`;
    }).join('');
    const tube = 'M76 172 L136 112';
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; gap:6px; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .alarm .badge.al, .low .badge.lo { display:inline-block; } .badge.lo { background:#fb8c00; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
      /* Flamme dans le hublot */
      .flame { transform-box:fill-box; transform-origin:50% 100%; opacity:0; transition:opacity .8s; }
      .ignition .flame.small, .heating .flame, .extinguishing .flame.small { opacity:1; animation:flick .35s ease-in-out infinite alternate; }
      .extinguishing .flame.small { animation-duration:.7s; opacity:.6; }
      .flame.f2 { animation-delay:.12s !important; } .flame.f3 { animation-delay:.23s !important; }
      .glow { fill:#ff8a2a; opacity:0; transition:opacity .8s; } .heating .glow { opacity:.55; animation:breathe 1.6s ease-in-out infinite; }
      .ignition .glow { opacity:.25; }
      .igniter { stroke:#555; stroke-width:2; } .ignition .igniter { stroke:#ff3b1f; filter:drop-shadow(0 0 3px #ff3b1f); animation:breathe .8s infinite; }
      /* Vis sans fin + granulés qui montent */
      .screw { fill:none; stroke:#7b828a; stroke-width:6; stroke-dasharray:3 4; }
      .feed { fill:none; stroke:#c9a066; stroke-width:3.4; stroke-linecap:round; stroke-dasharray:.1 9; opacity:0; }
      .ignition .screw, .heating .screw { animation:dash var(--fs,1.2s) linear infinite; }
      .ignition .feed, .heating .feed { opacity:1; animation:dash2 var(--fs,1.2s) linear infinite; }
      .pile { transition:transform 1.2s ease; } .heating .pilej, .ignition .pilej { animation:jig .9s ease-in-out infinite alternate; }
      .lvl { transition:y 1.2s ease, height 1.2s ease; }
      .low .hopper-front { animation:warn 1s infinite; }
      /* Tuyaux départ / retour */
      .pipe { fill:none; stroke-width:6; stroke-linecap:round; transition:stroke 1.2s; }
      .flow { fill:none; stroke:rgba(255,255,255,.75); stroke-width:2; stroke-linecap:round; stroke-dasharray:.1 8; opacity:0; }
      .heating .flow { opacity:1; animation:dash2 1s linear infinite; } .heating .flow.ret { animation-direction:reverse; }
      .heat path { fill:none; stroke:#ffb36b; stroke-width:1.6; stroke-linecap:round; opacity:0; }
      .heating .heat path { animation:rise 2.4s ease-in infinite; } .heat path:nth-child(2) { animation-delay:.8s !important; } .heat path:nth-child(3) { animation-delay:1.6s !important; }
      /* Écran */
      .scr { fill:#0d1a24; } .alarm .scr { fill:#4a0d0d; animation:blink .6s infinite; }
      .scrtxt { fill:#7fe0ff; font:700 7px 'Courier New',monospace; text-anchor:middle; } .scrlab { fill:#7fe0ff; font:5px 'Courier New',monospace; text-anchor:middle; opacity:.8; }
      .off .scrtxt, .off .scrlab { fill:#4f7d8f; }
      .led { fill:#6b6b6b; } .heating .led { fill:#43ff64; } .ignition .led { fill:#ffb300; animation:blink .8s infinite; }
      .extinguishing .led { fill:#3fa9ff; animation:blink 1.2s infinite; } .alarm .led { fill:#ff3b30; animation:blink .4s infinite; }
      .stats { display:grid; gap:8px; margin-top:6px; }
      .stat { text-align:center; background:var(--secondary-background-color, rgba(127,127,127,.12)); border-radius:10px; padding:6px 4px; }
      .stat .v { font-weight:700; font-size:1.02em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes flick { from { transform:scaleY(.82) scaleX(1.05) } to { transform:scaleY(1.12) scaleX(.94) } }
      @keyframes dash { to { stroke-dashoffset:-14 } } @keyframes dash2 { to { stroke-dashoffset:-18 } }
      @keyframes jig { to { transform:translateY(.8px) } }
      @keyframes rise { 0% { opacity:0; transform:translateY(0) } 30% { opacity:.7 } 100% { opacity:0; transform:translateY(-22px) } }
      @keyframes warn { 50% { fill:#a86a2a } }
      @keyframes blink { 50% { opacity:.35 } } @keyframes breathe { 50% { opacity:.3 } }
    </style>
    <ha-card id="card">
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span><span class="badge lo">${this._t('low')}</span> <span class="badge al">${this._t('alarm')}</span></span></div>
      <svg viewBox="0 0 280 214" id="svg">
        <defs>
          <linearGradient id="pbf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9ebed"/><stop offset="1" stop-color="#cfd3d7"/></linearGradient>
          <linearGradient id="pbs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b3b8bd"/><stop offset="1" stop-color="#9aa0a6"/></linearGradient>
          <linearGradient id="hop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6a7076"/><stop offset="1" stop-color="#4c5157"/></linearGradient>
          <clipPath id="open"><polygon points="20,66 36,55 104,51 96,63"/></clipPath>
          <clipPath id="sight"><rect x="40" y="74" width="9" height="44" rx="2"/></clipPath>
          <radialGradient id="fire" cx="50%" cy="70%" r="60%"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f"/></radialGradient>
        </defs>
        <ellipse cx="160" cy="206" rx="118" ry="6" fill="rgba(0,0,0,.22)"/>

        <!-- Tuyaux cuivre départ (gauche) / retour (droite) -->
        <path class="pipe" id="pdep" d="M156 32 V6 H186"/>
        <path class="flow dep" d="M156 32 V6 H186"/>
        <path class="pipe" id="pret" d="M172 32 V14 H186"/>
        <path class="flow ret" d="M172 32 V14 H186"/>
        <text class="scrlab" x="200" y="8" style="fill:var(--primary-text-color,#ddd);text-anchor:start;font-size:6px" id="tdep"></text>
        <text class="scrlab" x="200" y="17" style="fill:var(--primary-text-color,#ddd);text-anchor:start;font-size:6px" id="tret"></text>
        <g class="heat"><path d="M222 28 q3 -5 0 -10 q-3 -5 0 -10"/><path d="M236 28 q3 -5 0 -10 q-3 -5 0 -10"/><path d="M250 28 q3 -5 0 -10 q-3 -5 0 -10"/></g>

        <!-- Chaudière -->
        <polygon points="132,40 146,30 266,30 252,40" fill="#6d7379"/>
        <polygon points="252,40 266,30 266,190 252,200" fill="url(#pbs)"/>
        <rect x="132" y="40" width="120" height="160" fill="url(#pbf)"/>
        <rect x="132" y="40" width="120" height="12" fill="#50565c"/>
        <line x1="132" y1="120" x2="252" y2="120" stroke="#aeb3b8" stroke-width="1.2"/>
        <rect x="244" y="74" width="3" height="16" rx="1.5" fill="#9aa0a6"/><rect x="244" y="150" width="3" height="16" rx="1.5" fill="#9aa0a6"/>
        <rect x="138" y="198" width="10" height="5" fill="#2e3237"/><rect x="236" y="198" width="10" height="5" fill="#2e3237"/>
        <!-- Écran tactile -->
        <rect x="208" y="55" width="36" height="24" rx="3" fill="#2b2f35"/>
        <rect class="scr" x="211" y="58" width="30" height="18" rx="2"/>
        <text class="scrlab" x="226" y="65" id="lab"></text><text class="scrtxt" x="226" y="73" id="val"></text>
        <circle class="led" cx="214" cy="82" r="1.6"/>
        <!-- Hublot de combustion -->
        <circle cx="192" cy="160" r="15" fill="#2b2f35"/>
        <circle cx="192" cy="160" r="11.5" fill="#120a06"/>
        <circle class="glow" cx="192" cy="161" r="11"/>
        <line class="igniter" x1="183" y1="168" x2="201" y2="168"/>
        <g>
          <path class="flame" d="M186 168 Q184 160 189 154 Q189 160 192 160 Q190 152 195 147 Q196 157 199 160 Q201 164 198 168 Z" fill="url(#fire)"/>
          <path class="flame small f2" d="M188 168 Q187 163 191 159 Q192 163 194 163 Q195 160 196 158 Q199 164 196 168 Z" fill="#ffcf4a"/>
          <path class="flame small f3" d="M190 168 Q190 165 192 163 Q194 165 194 168 Z" fill="#fff3b0"/>
        </g>
        <circle cx="192" cy="160" r="11.5" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1"/>

        <!-- Vis sans fin (tube incliné) -->
        <path d="${tube}" stroke="#3f444a" stroke-width="13" stroke-linecap="round" fill="none"/>
        <path class="screw" d="${tube}"/>
        <path class="feed" d="${tube}"/>
        <rect x="128" y="104" width="10" height="16" rx="2" fill="#3f444a"/>
        <!-- Pied + boîtier moteur -->
        <rect x="62" y="126" width="12" height="40" fill="#4c5157"/>
        <rect x="56" y="160" width="30" height="42" rx="3" fill="#3a3f45"/>
        <rect x="60" y="196" width="22" height="6" fill="#2e3237"/>

        <!-- Trémie -->
        <polygon class="hopper-front" points="20,66 96,63 82,126 50,128" fill="url(#hop)"/>
        <polygon points="96,63 104,51 90,116 82,126" fill="#3f444a"/>
        <polygon points="20,66 36,55 104,51 96,63" fill="#1e2125"/>
        <g clip-path="url(#open)"><g class="pile" id="pile"><g class="pilej">${pellets(18, 50, 90, 16, 120)}</g></g></g>
        <polygon points="20,66 36,55 104,51 96,63" fill="none" stroke="#7b828a" stroke-width="1.2"/>
        <!-- Hublot de niveau -->
        <rect x="40" y="74" width="9" height="44" rx="2" fill="#1e2125"/>
        <g clip-path="url(#sight)"><rect class="lvl" id="lvl" x="40" y="118" width="9" height="0" fill="#c9a066"/>${pellets(40, 74, 9, 44, 30).replace(/fill="#c9a066"|fill="#b38a50"/g, 'fill="rgba(0,0,0,.28)"')}</g>
        <rect x="40" y="74" width="9" height="44" rx="2" fill="none" stroke="#8a9096" stroke-width="1"/>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    this._built = true;
  }

  _st(id) { return id && this._hass && this._hass.states[id]; }
  _num(id) {
    const s = this._st(id); if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  // Statut : entité (mots-clés FR/EN) sinon déduit de la puissance
  _state(w) {
    const c = this._config, s = this._st(c.entity_status);
    if (s) {
      const v = String(s.state).toLowerCase();
      if (/alarm|alarme|error|erreur|d[ée]faut|fault/.test(v)) return 'alarm';
      if (/allum|ignit|start|d[ée]marr|pr[ée]chauf/.test(v)) return 'ignition';
      if (/extinc|shut|refroid|cool|stopping|nettoy|clean/.test(v)) return 'extinguishing';
      if (/chauff|heat|run|marche|modul|burn|^on$/.test(v)) return w !== null && w > c.ignition_threshold ? 'ignition' : 'heating';
      if (/off|arr[êe]t|standby|veille|idle/.test(v)) return 'off';
    }
    if (w === null) return 'off';
    if (w > c.ignition_threshold) return 'ignition';
    if (w > c.threshold) return 'heating';
    return 'off';
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const w = this._num(c.entity_power), e = this._num(c.entity_energy);
    const dep = this._num(c.entity_flow_temp), ret = this._num(c.entity_return_temp), lvl = this._num(c.entity_pellet_level);
    let cost = this._num(c.entity_cost); if (cost === null && e !== null && c.price_per_kwh) cost = e * c.price_per_kwh;
    const st = this._state(w);
    const low = lvl !== null && lvl <= c.pellet_alert;
    r.getElementById('svg').setAttribute('class', st);
    const card = r.getElementById('card'); card.classList.toggle('alarm', st === 'alarm'); card.classList.toggle('low', low);
    r.getElementById('svg').classList.toggle('low', low);

    // Vitesse de la vis selon la puissance (si connue)
    r.getElementById('svg').style.setProperty('--fs', `${st === 'ignition' ? 0.8 : 1.4}s`);

    // Tuyaux : cuivre froid → rouge chaud (départ), cuivre → orange (retour)
    const mix = (t) => { const k = t === null ? 0 : Math.max(0, Math.min(1, (t - 25) / (c.flow_temp_max - 25)));
      const a = [184, 115, 51], b = [229, 57, 53]; return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`; };
    r.getElementById('pdep').style.stroke = mix(dep);
    r.getElementById('pret').style.stroke = mix(ret === null ? null : ret - 10);
    r.getElementById('tdep').textContent = dep === null ? '' : `▲ ${Math.round(dep)}°`;
    r.getElementById('tret').textContent = ret === null ? '' : `▼ ${Math.round(ret)}°`;

    // Niveau de granulés : hublot + tas dans la trémie
    const p = lvl === null ? 70 : Math.max(0, Math.min(100, lvl));
    const lv = r.getElementById('lvl'); lv.setAttribute('y', 118 - 44 * p / 100); lv.setAttribute('height', 44 * p / 100);
    lv.setAttribute('fill', low ? '#e0782e' : '#c9a066');
    r.getElementById('pile').style.transform = `translateY(${((100 - p) / 100 * 14).toFixed(1)}px)`;
    r.getElementById('pile').style.opacity = p < 8 ? 0.2 : 1;

    // Écran
    const lab = r.getElementById('lab'), val = r.getElementById('val');
    if (st === 'heating') { lab.textContent = this._t('flow').toUpperCase(); val.textContent = dep === null ? 'ON' : `${Math.round(dep)}°C`; }
    else if (st === 'off') { lab.textContent = this._t('off').toUpperCase(); val.textContent = dep === null ? '--' : `${Math.round(dep)}°C`; }
    else { lab.textContent = ''; val.textContent = this._t(st).toUpperCase().slice(0, 9); }

    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_status) it.push([this._l('status'), this._t(st)]);
    if (c.show_power) it.push([this._l('power'), w === null ? '—' : w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`]);
    if (c.show_temps) { it.push([this._l('flow'), f(dep, 0, '°C')]); it.push([this._l('ret'), f(ret, 0, '°C')]); }
    if (c.show_pellets) it.push([this._l('pellets'), f(lvl, 0, '%')]);
    if (c.show_energy) it.push([this._l('energy'), f(e, 1, 'kWh')]);
    if (c.show_cost && cost !== null) it.push([this._l('cost'), f(cost, 2, '€')]);
    const stats = r.getElementById('stats');
    stats.style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    stats.innerHTML = it.map(([l, v]) => `<div class="stat"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
  }
}
define('appliance-pellet-boiler-card', AppliancePelletBoilerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-pellet-boiler-card', name: 'Appliance – Pellet boiler / Chaudière à granulés', description: 'Chaudière à granulés animée (trémie, vis sans fin, flamme, départ/retour)', preview: false });
})();

/* Carte « Chaudière à gaz » — custom:appliance-gas-boiler-card
 * Chaudière murale gaz : flamme bleue sur rampe de brûleur, circuit départ/retour qui
 * change de couleur avec la température, arrivée gaz, ECS, manomètre, fumées.
 */
(() => {
  const TAG = 'appliance-gas-boiler-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Gas boiler",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "alarm": "Fault",
      "power": "Electric",
      "energy": "Elec. energy",
      "gas": "Gas",
      "cost": "Cost",
      "flow": "Flow",
      "ret": "Return",
      "pressure": "Pressure",
      "mod": "Modulation",
      "delta": "ΔT",
      "lowp": "Low pressure",
      "highp": "High pressure",
      "hotf": "Flow too hot"
    },
    "de": {
      "name": "Gastherme",
      "off": "Aus",
      "standby": "Standby",
      "heating": "Heizen",
      "dhw": "Warmwasser",
      "alarm": "Störung",
      "power": "Elektrisch",
      "energy": "Elektr. Energie",
      "gas": "Gas",
      "cost": "Kosten",
      "flow": "Vorlauf",
      "ret": "Rücklauf",
      "pressure": "Druck",
      "mod": "Modulation",
      "delta": "ΔT",
      "lowp": "Druck zu niedrig",
      "highp": "Druck zu hoch",
      "hotf": "Vorlauf zu heiß"
    },
    "fr": {
      "name": "Chaudière gaz",
      "off": "Éteinte",
      "standby": "Veille",
      "heating": "Chauffage",
      "dhw": "Eau chaude",
      "alarm": "Défaut",
      "power": "Électrique",
      "energy": "Énergie élec.",
      "gas": "Gaz",
      "cost": "Coût",
      "flow": "Départ",
      "ret": "Retour",
      "pressure": "Pression",
      "mod": "Modulation",
      "delta": "ΔT",
      "lowp": "Pression basse",
      "highp": "Pression haute",
      "hotf": "Départ trop chaud"
    },
    "nb": {
      "name": "Gasskjel",
      "off": "Av",
      "standby": "Hvilemodus",
      "heating": "Varmer",
      "dhw": "Varmtvann",
      "alarm": "Feil",
      "power": "Elektrisk",
      "energy": "Elektr. energi",
      "gas": "Gass",
      "cost": "Kostnad",
      "flow": "Tur",
      "ret": "Retur",
      "pressure": "Trykk",
      "mod": "Modulering",
      "delta": "ΔT",
      "lowp": "Lavt trykk",
      "highp": "Høyt trykk",
      "hotf": "For varm tur"
    },
    "nl": {
      "name": "Gasketel",
      "off": "Uit",
      "standby": "Stand-by",
      "heating": "Verwarmen",
      "dhw": "Warm water",
      "alarm": "Storing",
      "power": "Elektrisch",
      "energy": "Elek. energie",
      "gas": "Gas",
      "cost": "Kost",
      "flow": "Aanvoer",
      "ret": "Retour",
      "pressure": "Druk",
      "mod": "Modulatie",
      "delta": "ΔT",
      "lowp": "Lage druk",
      "highp": "Hoge druk",
      "hotf": "Aanvoer te heet"
    },
    "ro": {
      "name": "Centrală pe gaz",
      "off": "Oprită",
      "standby": "Standby",
      "heating": "Încălzire",
      "dhw": "Apă caldă",
      "alarm": "Defecțiune",
      "power": "Electric",
      "energy": "Energie el.",
      "gas": "Gaz",
      "cost": "Cost",
      "flow": "Tur",
      "ret": "Retur",
      "pressure": "Presiune",
      "mod": "Modulare",
      "delta": "ΔT",
      "lowp": "Presiune scăzută",
      "highp": "Presiune ridicată",
      "hotf": "Tur prea cald"
    },
    "ru": {
      "name": "Газовый котёл",
      "off": "Выкл.",
      "standby": "Ожидание",
      "heating": "Нагрев",
      "dhw": "Горячая вода",
      "alarm": "Неисправность",
      "power": "Электричество",
      "energy": "Эл. энергия",
      "gas": "Газ",
      "cost": "Стоимость",
      "flow": "Подача",
      "ret": "Обратка",
      "pressure": "Давление",
      "mod": "Модуляция",
      "delta": "ΔT",
      "lowp": "Низкое давление",
      "highp": "Высокое давление",
      "hotf": "Подача слишком горячая"
    }
  };
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
svg{display:block;width:100%;max-width:calc(170px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
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

  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['gas', 'mdi:fire', 'show_gas'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps'],
    ['pressure', 'mdi:gauge', 'show_pressure'],
    ['mod', 'mdi:percent-circle', 'show_modulation'],
  ];

  class ApplianceGasBoilerCard extends HTMLElement {
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
        pressure_min: 1, pressure_max: 2.5, flow_temp_max: 80, ...c };
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${SVG}
        <div class="alert" id="alert"></div>
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // flammes bleues sur la rampe : 11 becs
      const fl = root.getElementById('flames'); const ports = root.getElementById('ports');
      let f = '', p = '';
      for (let i = 0; i < 11; i++) {
        const x = 72 + i * 9.6;
        f += `<path class="flame" d="M${x} 130 C${x - 4} 124 ${x - 3.5} 117 ${x} 108 C${x + 3.5} 117 ${x + 4} 124 ${x} 130Z" fill="url(#fl)"/>`;
        p += `<rect x="${x - 2}" y="132" width="4" height="3" rx="1"/>`;
      }
      fl.innerHTML = f; ports.innerHTML = p;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      let txt = '';
      if (stObj) {
        txt = String(stObj.state).toLowerCase();
        const a = stObj.attributes || {};
        if (a.hvac_action) txt += ' ' + String(a.hvac_action).toLowerCase();
      }
      const flameEnt = this._st(c.entity_flame);
      const flame = flameEnt ? flameEnt.state === 'on' : null;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
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

    _render() {
      if (!this._built) this._build();
      const c = this._c, h = this._hass, card = this._card, r = this._root;
      const { st, burning, pump, pw } = this._compute();
      const flow = this._num(c.entity_flow_temp), ret = this._num(c.entity_return_temp);
      const press = this._num(c.entity_pressure);
      let mod = this._num(c.entity_modulation); mod = isNaN(mod) ? 1 : Math.max(0, Math.min(100, mod)) / 100;
      card.className = `${st} ${burning ? 'burning' : ''} ${pump ? 'pump' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--mod', mod);
      const tc = (t, d) => isNaN(t) ? d : `color-mix(in srgb, #e5392b ${Math.round(Math.max(0, Math.min(1, (t - 25) / 50)) * 100)}%, #3b8fe8)`;
      card.style.setProperty('--gb-flowc', tc(flow, '#e5533d'));
      card.style.setProperty('--gb-retc', tc(ret, '#3b8fe8'));

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const dsp = !isNaN(flow) && st !== 'off' ? `${Math.round(flow)}°` : (st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : st === 'dhw' ? 'ECS' : st === 'heating' ? 'CH' : '--');
      r.getElementById('dsp').textContent = dsp;

      // manomètre : 0–4 bar sur 180°, zone verte = pressure_min..pressure_max
      const ang = (p) => -90 + Math.max(0, Math.min(4, p)) / 4 * 180;
      r.getElementById('needle').style.transform = `rotate(${isNaN(press) ? -90 : ang(press)}deg)`;
      const pt = (p) => { const a = (ang(p) - 90) * Math.PI / 180; return [172 + 13 * Math.cos(a), 66 + 13 * Math.sin(a)]; };
      const [x1, y1] = pt(c.pressure_min), [x2, y2] = pt(c.pressure_max);
      r.getElementById('okarc').setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A13 13 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);

      // alertes
      let al = '';
      if (!isNaN(press) && press < c.pressure_min) al = `${this._t('lowp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(press) && press > c.pressure_max) al = `${this._t('highp')} (${this._fmt(press, 1)} bar)`;
      else if (!isNaN(flow) && flow > c.flow_temp_max) al = this._t('hotf');
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
        flow: [c.entity_flow_temp, this._fmt(flow, 1), '°C'],
        ret: [c.entity_return_temp, this._fmt(ret, 1), '°C'],
        pressure: [c.entity_pressure, this._fmt(press, 2), 'bar'],
        mod: [c.entity_modulation, this._fmt(mod * 100, 0), '%'],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = k === 'cost' ? c.entity_cost : c['entity_' + (k === 'ret' ? 'return_temp' : k === 'flow' ? 'flow_temp' : k === 'mod' ? 'modulation' : k)]; if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceGasBoilerCard);

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
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_status'), ent('entity_flame', 'binary_sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_gas', 'sensor'), ent('entity_cost', 'sensor'), { name: 'price_per_unit', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_pressure', 'sensor'), ent('entity_modulation', 'sensor'),
        { type: 'grid', name: '', schema: [
          { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
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
  customElements.define(TAG + '-editor', ApplianceGasBoilerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Chaudière gaz / Gas boiler',
    description: 'Chaudière gaz animée : flamme, départ/retour, ECS, pression, conso élec et gaz.', preview: true,
  });
})();

/* Carte « PAC eau/eau » — custom:appliance-water-heat-pump-card
 * Pompe à chaleur eau/eau ou sol/eau (géothermie, nappe) : compresseur qui vibre entre
 * l'évaporateur (boucle de captage, à gauche) et le condenseur (boucle de chauffage, à droite),
 * départ/retour qui changent de couleur avec la température, COP instantané.
 */
(() => {
  const TAG = 'appliance-water-heat-pump-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Water heat pump",
      "off": "Off",
      "standby": "Standby",
      "heating": "Heating",
      "dhw": "Hot water",
      "cooling": "Cooling",
      "alarm": "Fault",
      "power": "Electric",
      "heat": "Heat output",
      "cop": "COP",
      "flow": "Flow",
      "ret": "Return",
      "delta": "ΔT",
      "src_in": "Source in",
      "src_out": "Source out",
      "rate": "Flow rate",
      "energy": "Elec. energy",
      "heat_energy": "Heat energy",
      "scop": "SCOP",
      "buffer": "Buffer tank"
    },
    "de": {
      "name": "Wasser/Wasser-Wärmepumpe",
      "off": "Aus",
      "standby": "Standby",
      "heating": "Heizen",
      "dhw": "Warmwasser",
      "cooling": "Kühlen",
      "alarm": "Störung",
      "power": "Elektrisch",
      "heat": "Wärmeleistung",
      "cop": "COP",
      "flow": "Vorlauf",
      "ret": "Rücklauf",
      "delta": "ΔT",
      "src_in": "Quelle ein",
      "src_out": "Quelle aus",
      "rate": "Durchfluss",
      "energy": "Elektr. Energie",
      "heat_energy": "Wärmeenergie",
      "scop": "SCOP",
      "buffer": "Pufferspeicher"
    },
    "fr": {
      "name": "PAC eau/eau",
      "off": "Arrêt",
      "standby": "Veille",
      "heating": "Chauffage",
      "dhw": "Eau chaude",
      "cooling": "Rafraîchissement",
      "alarm": "Défaut",
      "power": "Électrique",
      "heat": "Thermique",
      "cop": "COP",
      "flow": "Départ",
      "ret": "Retour",
      "delta": "ΔT",
      "src_in": "Captage entrée",
      "src_out": "Captage sortie",
      "rate": "Débit",
      "energy": "Énergie élec.",
      "heat_energy": "Énergie chaleur",
      "scop": "SCOP",
      "buffer": "Ballon tampon"
    },
    "nb": {
      "name": "Vann-til-vann-varmepumpe",
      "off": "Av",
      "standby": "Hvilemodus",
      "heating": "Varmer",
      "dhw": "Varmtvann",
      "cooling": "Kjøler",
      "alarm": "Feil",
      "power": "Elektrisk",
      "heat": "Varmeeffekt",
      "cop": "COP",
      "flow": "Tur",
      "ret": "Retur",
      "delta": "ΔT",
      "src_in": "Kilde inn",
      "src_out": "Kilde ut",
      "rate": "Gjennomstrømning",
      "energy": "Elektr. energi",
      "heat_energy": "Varmeenergi",
      "scop": "SCOP",
      "buffer": "Buffertank"
    },
    "nl": {
      "name": "Water-waterwarmtepomp",
      "off": "Uit",
      "standby": "Stand-by",
      "heating": "Verwarmen",
      "dhw": "Warm water",
      "cooling": "Koelen",
      "alarm": "Storing",
      "power": "Elektrisch",
      "heat": "Warmteafgifte",
      "cop": "COP",
      "flow": "Aanvoer",
      "ret": "Retour",
      "delta": "ΔT",
      "src_in": "Bron in",
      "src_out": "Bron uit",
      "rate": "Debiet",
      "energy": "Elek. energie",
      "heat_energy": "Warmte-energie",
      "scop": "SCOP",
      "buffer": "Buffervat"
    },
    "ro": {
      "name": "Pompă de căldură apă-apă",
      "off": "Oprită",
      "standby": "Standby",
      "heating": "Încălzire",
      "dhw": "Apă caldă",
      "cooling": "Răcire",
      "alarm": "Defecțiune",
      "power": "Electric",
      "heat": "Putere termică",
      "cop": "COP",
      "flow": "Tur",
      "ret": "Retur",
      "delta": "ΔT",
      "src_in": "Intrare sursă",
      "src_out": "Ieșire sursă",
      "rate": "Debit",
      "energy": "Energie el.",
      "heat_energy": "Energie termică",
      "scop": "SCOP",
      "buffer": "Rezervor tampon"
    },
    "ru": {
      "name": "Тепловой насос для воды",
      "off": "Выкл.",
      "standby": "Ожидание",
      "heating": "Нагрев",
      "dhw": "Горячая вода",
      "cooling": "Охлаждение",
      "alarm": "Неисправность",
      "power": "Электричество",
      "heat": "Тепловая мощность",
      "cop": "COP",
      "flow": "Подача",
      "ret": "Обратка",
      "delta": "ΔT",
      "src_in": "Источник вход",
      "src_out": "Источник выход",
      "rate": "Расход",
      "energy": "Эл. энергия",
      "heat_energy": "Тепловая энергия",
      "scop": "SCOP",
      "buffer": "Буферный бак"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--wp-heat:var(--appliance-heat-color,#ff8a3d);--wp-cold:var(--appliance-cold-color,#2b9af9);
  --wp-alert:var(--appliance-alert-color,#db4437)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--wp-heat) 22%,transparent);color:var(--wp-heat)}
.dhw .badge,.cooling .badge{background:color-mix(in srgb,var(--wp-cold) 22%,transparent);color:var(--wp-cold)}
.alarm .badge{background:color-mix(in srgb,var(--wp-alert) 22%,transparent);color:var(--wp-alert)}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- illustration ---- */
.comp{transform-box:fill-box;transform-origin:50% 100%}
.run .comp{animation:vib .11s linear infinite alternate}
@keyframes vib{0%{transform:translate(-.5px,0)}100%{transform:translate(.5px,-.4px)}}
.dash{stroke-dasharray:3 8;opacity:0}
.src .dash.src,.run .dash.ref,.circ .dash.ch,.chg .dash.chg{opacity:.9;animation:flow 1s linear infinite}
.run .dash.ref{opacity:.55;animation-duration:1.6s}
@keyframes flow{to{stroke-dashoffset:-11}}
.rad{fill:#e9edf1;transition:fill .8s}
.heating .rad{fill:color-mix(in srgb,var(--wp-flowc,#e5533d) 35%,#f4f6f8)}
.cooling .rad{fill:color-mix(in srgb,#3b8fe8 22%,#f4f6f8)}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.dhw .led{fill:#3fa3ff}.cooling .led{fill:#4dd0e1}.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:blink .8s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 13px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.off .body-shade{opacity:.55}
.buf{display:none}.buffer .buf{display:inline}.buffer .direct{display:none}
.noanim *{animation:none!important}
`;

  const SVG = `
<svg viewBox="0 0 290 204" role="img" aria-label="water heat pump">
 <defs>
  <linearGradient id="wp-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe6"/></linearGradient>
  <linearGradient id="wp-comp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b6570"/><stop offset=".45" stop-color="#3a434d"/><stop offset="1" stop-color="#22292f"/></linearGradient>
  <linearGradient id="wp-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--wp-tankc,#e5533d)"/><stop offset="1" style="stop-color:var(--wp-retc,#3b8fe8)"/></linearGradient>
  <linearGradient id="wp-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a1856a"/><stop offset="1" stop-color="#6f5641"/></linearGradient>
 </defs>
 <!-- sol et sonde de captage -->
 <rect x="0" y="158" width="66" height="46" rx="3" fill="url(#wp-soil)" opacity=".85"/>
 <path d="M0 158 H66" stroke="#6aa84f" stroke-width="3"/>
 <!-- radiateur -->
 <g transform="translate(40 0)">
 <rect x="184" y="14" width="52" height="50" rx="5" fill="#000" opacity=".1" transform="translate(1.5 2)"/>
 <g class="rad" stroke="#aab3bd" stroke-width="1">
  <rect x="184" y="14" width="52" height="8" rx="3"/><rect x="184" y="56" width="52" height="8" rx="3"/>
  <rect x="187" y="18" width="7" height="42" rx="3"/><rect x="198" y="18" width="7" height="42" rx="3"/>
  <rect x="209" y="18" width="7" height="42" rx="3"/><rect x="220" y="18" width="7" height="42" rx="3"/>
 </g>
 </g>
 <!-- caisson -->
 <rect x="76" y="26" width="96" height="128" rx="9" fill="#000" opacity=".12" transform="translate(2 3)"/>
 <rect class="body-shade" x="72" y="24" width="96" height="128" rx="9" fill="url(#wp-body)" stroke="#aeb6c0" stroke-width="1.2"/>
 <rect x="82" y="31" width="58" height="21" rx="4" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" id="dsp" x="111" y="46">--</text>
 <circle class="led" cx="152" cy="37" r="3.2"/>
 <circle cx="152" cy="47" r="3.6" fill="#c8cfd7" stroke="#9aa3ad"/>
 <rect x="80" y="58" width="80" height="88" rx="6" fill="#18212c" stroke="#2a3340" stroke-width="1.4"/>
 <!-- boucles d'eau : captage (gauche) et chauffage (droite), jusqu'aux échangeurs -->
 <g fill="none" stroke-width="6" stroke-linecap="round">
  <path d="M92 80 H30 V188" stroke="#4aa3df"/>
  <path d="M30 188 Q38 199 46 188" stroke="#3d8fd0"/>
  <path d="M46 188 V104 H92" stroke="#2b6cb0"/>
 </g>
 <g class="direct" fill="none" stroke-width="6" stroke-linecap="round">
  <path d="M148 80 H236 V64" style="stroke:var(--wp-flowc,#e5533d)"/>
  <path d="M264 64 V104 H148" style="stroke:var(--wp-retc,#3b8fe8)"/>
 </g>
 <!-- ballon tampon : boucle de charge (PAC ↔ ballon) et boucle de distribution (ballon ↔ émetteurs) -->
 <g class="buf">
  <g fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
   <path d="M148 80 H204 V128 H232" style="stroke:var(--wp-flowc,#e5533d)"/>
   <path d="M232 186 H190 V104 H148" style="stroke:var(--wp-retc,#3b8fe8)"/>
   <path d="M251 118 V84 H236 V64" style="stroke:var(--wp-tankc,#e5533d)"/>
   <path d="M264 64 V96 H280 V180 H270" style="stroke:var(--wp-retc,#3b8fe8)"/>
  </g>
  <rect x="234" y="120" width="38" height="78" rx="12" fill="#000" opacity=".12"/>
  <rect x="232" y="118" width="38" height="78" rx="12" fill="url(#wp-tank)" stroke="#8f99a4" stroke-width="1.2"/>
  <rect x="237" y="124" width="6" height="66" rx="3" fill="#fff" opacity=".28"/>
 </g>
 <!-- évaporateur (captage) et condenseur (chauffage) : échangeurs à plaques -->
 <g fill="#5fa8e8" stroke="#2f6ea8" stroke-width=".5">
  <rect x="86" y="70" width="2.6" height="42" rx=".8"/><rect x="89.6" y="70" width="2.6" height="42" rx=".8"/><rect x="93.2" y="70" width="2.6" height="42" rx=".8"/>
  <rect x="96.8" y="70" width="2.6" height="42" rx=".8"/><rect x="100.4" y="70" width="2.6" height="42" rx=".8"/>
 </g>
 <g fill="#f0883e" stroke="#a8541c" stroke-width=".5">
  <rect x="137" y="70" width="2.6" height="42" rx=".8"/><rect x="140.6" y="70" width="2.6" height="42" rx=".8"/><rect x="144.2" y="70" width="2.6" height="42" rx=".8"/>
  <rect x="147.8" y="70" width="2.6" height="42" rx=".8"/><rect x="151.4" y="70" width="2.6" height="42" rx=".8"/>
 </g>
 <!-- circuit frigorifique : aspiration, refoulement, détendeur -->
 <g fill="none" stroke="#c98a55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M94 70 V64 H114 V92"/><path d="M126 92 V64 H146 V70"/><path d="M146 112 V136 H94 V112"/>
 </g>
 <circle cx="120" cy="136" r="3" fill="#8c95a0" stroke="#5c6570"/>
 <g stroke="#fff" stroke-width="1.2" stroke-linecap="round" fill="none">
  <path class="dash ref" d="M94 70 V64 H114 V92"/><path class="dash ref" d="M126 92 V64 H146 V70"/><path class="dash ref" d="M146 112 V136 H94 V112"/>
 </g>
 <!-- compresseur -->
 <g class="comp">
  <rect x="107" y="88" width="26" height="40" rx="11" fill="url(#wp-comp)" stroke="#1b2127"/>
  <ellipse cx="120" cy="92" rx="11" ry="4" fill="#6b7580" opacity=".55"/>
  <rect x="103" y="127" width="34" height="6" rx="2" fill="#4a535e"/>
 </g>
 <!-- circulation de l'eau -->
 <g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none">
  <path class="dash src" d="M30 188 V80 H72"/><path class="dash src" d="M72 104 H46 V188"/>
  <g class="direct"><path class="dash ch" d="M172 80 H236 V64"/><path class="dash ch" d="M264 64 V104 H172"/></g>
  <g class="buf"><path class="dash chg" d="M168 80 H204 V128 H232"/><path class="dash chg" d="M232 186 H190 V104 H168"/>
   <path class="dash ch" d="M251 118 V84 H236 V64"/><path class="dash ch" d="M264 64 V96 H280 V180 H270"/></g>
 </g>
</svg>`;

  const TILES = [
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
    ['heat', 'mdi:heat-wave', 'show_heat', 'entity_heat_power'],
    ['cop', 'mdi:speedometer', 'show_cop', 'entity_cop'],
    ['flow', 'mdi:thermometer-chevron-up', 'show_temps', 'entity_flow_temp'],
    ['ret', 'mdi:thermometer-chevron-down', 'show_temps', 'entity_return_temp'],
    ['delta', 'mdi:delta', 'show_temps', 'entity_flow_temp'],
    ['buffer', 'mdi:storage-tank', 'show_temps', 'entity_buffer_temp'],
    ['src_in', 'mdi:thermometer-water', 'show_source', 'entity_source_in_temp'],
    ['src_out', 'mdi:thermometer-low', 'show_source', 'entity_source_out_temp'],
    ['rate', 'mdi:pump', 'show_flow_rate', 'entity_flow_rate'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy', 'entity_energy'],
    ['heat_energy', 'mdi:fire-circle', 'show_energy', 'entity_heat_energy'],
    ['scop', 'mdi:chart-line', 'show_scop', 'entity_scop'],
  ];
  const SHOW = ['show_status', 'show_power', 'show_heat', 'show_cop', 'show_temps', 'show_source', 'show_flow_rate', 'show_energy', 'show_scop', 'animations'];

  class ApplianceWaterHeatPumpCard extends HTMLElement {
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/pac|heat_?pump|pompe_a_chaleur|geotherm/i, 'climate'),
        entity_power: f(/(pac|heat_?pump|pompe_a_chaleur|geotherm).*(power|puissance)/i, 'sensor'),
        entity_heat_power: f(/(chaleur|heat_meter|thermi|multical|kamstrup).*(power|puissance)/i, 'sensor'),
      };
    }
    static getConfigForm() {
      const ent = (name, domain, extra = {}) => ({ name, selector: { entity: { domain, ...extra } } });
      const RELAY = ['binary_sensor', 'switch', 'input_boolean', 'sensor'];
      return {
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'labels', selector: { object: {} } },
          { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
          { name: 'transparent', selector: { boolean: {} } },
          ent('entity_status', ['climate', 'sensor', 'select', 'input_select', 'water_heater']),
          { type: 'grid', name: '', schema: [ent('entity_power', 'sensor'), ent('entity_heat_power', 'sensor'), ent('entity_cop', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_flow_temp', 'sensor'), ent('entity_return_temp', 'sensor'), ent('entity_flow_rate', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_source_in_temp', 'sensor'), ent('entity_source_out_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [{ name: 'buffer_tank', selector: { boolean: {} } }, ent('entity_buffer_temp', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_energy', 'sensor'), ent('entity_heat_energy', 'sensor'), ent('entity_scop', 'sensor')] },
          { type: 'grid', name: '', schema: [ent('entity_compressor', RELAY), ent('entity_source_pump', RELAY)] },
          { type: 'grid', name: '', schema: [
            { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'source_threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'compressor_threshold', selector: { number: { min: 0, max: 5000, step: 5, mode: 'box', unit_of_measurement: 'W' } } },
            { name: 'heating_delay', selector: { number: { min: 0, max: 600, step: 1, mode: 'box', unit_of_measurement: 's' } } },
          ] },
          { type: 'grid', name: '', schema: SHOW.map((name) => ({ name, selector: { boolean: {} }, default: true })) },
          { name: 'language', selector: { select: { options: Object.keys(T) } } },
        ],
        computeLabel: (s) => window.applianceEditorLabel(s.name),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { ...Object.fromEntries(SHOW.map((k) => [k, true])), threshold: 100, off_threshold: 0.5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    disconnectedCallback() { clearTimeout(this._dt); this._dt = null; }
    // Chauffage seulement si la puissance reste au-dessus du seuil pendant heating_delay secondes
    // (ex. pompes de puits et du primaire qui tournent ~20 s par jour pendant la veille).
    _sustained(above) {
      const d = (+this._c.heating_delay || 0) * 1000;
      if (!above) { this._since = null; clearTimeout(this._dt); this._dt = null; return false; }
      if (!d) return true;
      const now = Date.now();
      if (this._since == null) this._since = Math.min(now, Date.parse((this._st(this._c.entity_power) || {}).last_changed) || now);
      const left = this._since + d - now;
      if (left <= 0) return true;
      if (!this._dt) this._dt = setTimeout(() => { this._dt = null; if (this._hass) this._render(); }, left + 50);
      return false;
    }
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
      return u === 'kw' ? v * 1000 : u === 'mw' ? v * 1e6 : v;
    }
    // relais (binary_sensor, switch…) : on / off ; capteur numérique : marche au-dessus de 0
    _on(id) {
      const s = this._st(id); if (!s) return false;
      const v = this._num(id);
      return isNaN(v) ? /^(on|true|running|marche|heat|cool)/i.test(String(s.state)) : v > 0;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'en' ? 'en-US' : this._lang(), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _kw(w) { return isNaN(w) ? ['--', ''] : w >= 1000 ? [this._fmt(w / 1000, 2), 'kW'] : [this._fmt(w, 0), 'W']; }
    // Compteurs d'énergie toujours en kWh (Wh et MWh convertis), sans décimale au-delà de 1000 kWh
    _kwh(id) {
      const v = this._num(id), u = String(this._unit(id, 'kWh'));
      const k = isNaN(v) ? NaN : /^wh$/i.test(u) ? v / 1000 : /^mwh$/i.test(u) ? v * 1000 : /^gwh$/i.test(u) ? v * 1e6 : v;
      return [this._fmt(k, Math.abs(k) >= 1000 ? 0 : 1), 'kWh'];
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="title"></div><div class="badge" id="badge"></div></div>
        ${SVG}
        <div class="tiles" id="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // État : entité climate / texte si fournie, sinon puissance électrique (compresseur au-dessus du seuil)
    _compute() {
      const c = this._c, pw = this._watts(c.entity_power), heat = this._watts(c.entity_heat_power);
      const s = this._st(c.entity_status);
      const state = s ? String(s.state).toLowerCase() : '';
      const action = s ? String((s.attributes || {}).hvac_action || '').toLowerCase() : '';
      const txt = `${state} ${action}`, key = action || state;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (s && /^(unavailable|unknown|off|arr[eê]t|eteint|éteint)$/.test(state)) st = 'off';
      else if (/idle|standby|veille|attente/.test(action)) st = 'standby';
      else if (/dhw|ecs|hot.?water|eau.?chaude|sanitaire/.test(txt) || (s && String(c.entity_status).startsWith('water_heater.'))) st = 'dhw';
      else if (/cool|rafra|froid/.test(key) && key !== 'heat_cool') st = 'cooling';
      else if (/heat|chauff|compress|running|marche|^on/.test(key)) st = 'heating';
      else if (s) st = 'standby';
      else if (!isNaN(pw)) st = this._sustained(pw > c.threshold) ? 'heating' : pw > c.off_threshold ? 'standby' : 'off';
      else if (!isNaN(heat)) st = heat > 0 ? 'heating' : 'standby';
      else st = 'standby';
      const active = st === 'heating' || st === 'dhw' || st === 'cooling';
      // Trois animations séparées, par paliers de puissance ou par entité (relais) :
      // - circuit de chauffage au-dessus de threshold (une PAC tout-ou-rien chauffe souvent
      //   avec le seul circulateur, ~40 W, compresseur à l'arrêt) ;
      // - captage (pompes de puits / primaire) au-dessus de source_threshold : elles démarrent
      //   avant le compresseur et s'arrêtent après ; sans réglage, captage = compresseur ;
      // - compresseur et circuit frigorifique au-dessus de compressor_threshold (sinon threshold).
      const pump = active && (isNaN(pw) || pw > c.threshold);
      const run = c.entity_compressor ? this._on(c.entity_compressor) : active && (isNaN(pw) || pw > (c.compressor_threshold ?? c.threshold));
      const src = c.entity_source_pump ? this._on(c.entity_source_pump)
        : c.source_threshold != null && !isNaN(pw) ? pw > c.source_threshold || run : run;
      const rate = this._num(c.entity_flow_rate);
      // ballon tampon : la PAC charge le ballon (compresseur, ou débit côté PAC s'il est mesuré)
      // et le circulateur distribue l'eau du ballon vers les émetteurs, compresseur arrêté ou non
      if (c.buffer_tank) {
        const chg = c.entity_flow_rate ? rate > 0 : run;
        return { st, run, src, chg, circ: pump, pw, heat, rate };
      }
      const circ = c.entity_flow_rate ? rate > 0 : pump || heat > 0;
      return { st, run, src, chg: false, circ, pw, heat, rate };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, run, src, chg, circ, pw, heat, rate } = this._compute();
      const flow = this._num(c.entity_flow_temp), ret = this._num(c.entity_return_temp);
      card.className = `${st} ${run ? 'run' : ''} ${src ? 'src' : ''} ${chg ? 'chg' : ''} ${circ ? 'circ' : ''} ${c.buffer_tank ? 'buffer' : ''} ${c.animations === false ? 'noanim' : ''}`;
      // départ / retour : bleu à 20 °C, rouge à 55 °C (températures de PAC, plus basses qu'une chaudière)
      const tc = (t, d) => isNaN(t) ? d : `color-mix(in srgb, #e5392b ${Math.round(Math.max(0, Math.min(1, (t - 20) / 35)) * 100)}%, #3b8fe8)`;
      card.style.setProperty('--wp-flowc', tc(flow, '#e5533d'));
      card.style.setProperty('--wp-retc', tc(ret, '#3b8fe8'));
      const buf = this._num(c.entity_buffer_temp);
      card.style.setProperty('--wp-tankc', tc(isNaN(buf) ? flow : buf, '#e5533d'));

      r.getElementById('title').textContent = c.name || this._t('name');
      const badge = r.getElementById('badge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('dsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : isNaN(flow) ? '--' : `${Math.round(flow)}°`;

      // COP : capteur si fourni, sinon puissance thermique / puissance électrique quand le compresseur tourne
      let cop = this._num(c.entity_cop);
      if (!c.entity_cop && run && heat > 0 && pw > 0) cop = heat / pw;
      const hasCop = c.entity_cop || (c.entity_heat_power && c.entity_power);
      const V = {
        power: [c.entity_power, ...this._kw(pw)],
        heat: [c.entity_heat_power, ...this._kw(heat)],
        cop: [hasCop, this._fmt(cop, 1), ''],
        flow: [c.entity_flow_temp, this._fmt(flow, 1), '°C'],
        ret: [c.entity_return_temp, this._fmt(ret, 1), '°C'],
        delta: [c.entity_flow_temp && c.entity_return_temp, this._fmt(flow - ret, 1), 'K'],
        buffer: [c.entity_buffer_temp, this._fmt(buf, 1), '°C'],
        src_in: [c.entity_source_in_temp, this._fmt(this._num(c.entity_source_in_temp), 1), '°C'],
        src_out: [c.entity_source_out_temp, this._fmt(this._num(c.entity_source_out_temp), 1), '°C'],
        rate: [c.entity_flow_rate, this._fmt(rate, 2), this._unit(c.entity_flow_rate, 'l/h')],
        energy: [c.entity_energy, ...this._kwh(c.entity_energy)],
        heat_energy: [c.entity_heat_energy, ...this._kwh(c.entity_heat_energy)],
        scop: [c.entity_scop, this._fmt(this._num(c.entity_scop), 2), ''],
      };
      TILES.forEach(([k, , opt, more]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [shown, val, unit] = V[k];
        el.classList.toggle('hide', !shown || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        const id = k === 'cop' && !c.entity_cop ? c.entity_heat_power : c[more];
        el.onclick = () => { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceWaterHeatPumpCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – PAC eau/eau / Water heat pump',
    description: 'Pompe à chaleur eau/eau ou géothermique animée : compresseur, captage, départ/retour, COP.', preview: true,
  });
})();

/* Carte « Chauffage diesel » — custom:appliance-diesel-heater-card
 * Poêle à gazole en volume : plateau fonte en perspective, conduit inox, chambre de combustion
 * (couronne bleue du brûleur à mèche + flammes en trois couches), hublot de niveau de gazole.
 * États : off, standby, ignition, heating, cooldown (purge du souffleur), alarm.
 */
(() => {
  const TAG = 'appliance-diesel-heater-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Diesel heater",
      "off": "Off",
      "standby": "Standby",
      "ignition": "Igniting",
      "heating": "Heating",
      "cooldown": "Blower purge",
      "alarm": "Fault",
      "power": "Electric",
      "energy": "Elec. energy",
      "fuel": "Diesel",
      "used": "Used",
      "cost": "Cost",
      "temp": "Room",
      "flue": "Flue",
      "lowfuel": "Low diesel",
      "hotflue": "Flue too hot"
    },
    "de": {
      "name": "Dieselheizung",
      "off": "Aus",
      "standby": "Bereitschaft",
      "ignition": "Zündung",
      "heating": "Heizt",
      "cooldown": "Gebläse-Nachlauf",
      "alarm": "Störung",
      "power": "Elektrisch",
      "energy": "Elektr. Energie",
      "fuel": "Diesel",
      "used": "Verbraucht",
      "cost": "Kosten",
      "temp": "Raum",
      "flue": "Abgas",
      "lowfuel": "Diesel niedrig",
      "hotflue": "Abgas zu heiß"
    },
    "fr": {
      "name": "Chauffage diesel",
      "off": "Arrêt",
      "standby": "Veille",
      "ignition": "Allumage",
      "heating": "Chauffe",
      "cooldown": "Purge souffleur",
      "alarm": "Défaut",
      "power": "Électrique",
      "energy": "Énergie élec.",
      "fuel": "Gazole",
      "used": "Consommé",
      "cost": "Coût",
      "temp": "Pièce",
      "flue": "Fumées",
      "lowfuel": "Gazole bas",
      "hotflue": "Fumées trop chaudes"
    },
    "nb": {
      "name": "Dieselvarmer",
      "off": "Av",
      "standby": "Hvilemodus",
      "ignition": "Tenning",
      "heating": "Varmer",
      "cooldown": "Viftespyling",
      "alarm": "Feil",
      "power": "Elektrisk",
      "energy": "Elektr. energi",
      "fuel": "Diesel",
      "used": "Brukt",
      "cost": "Kostnad",
      "temp": "Rom",
      "flue": "Avgass",
      "lowfuel": "Lite diesel",
      "hotflue": "For varm avgass"
    },
    "nl": {
      "name": "Dieselkachel",
      "off": "Uit",
      "standby": "Stand-by",
      "ignition": "Ontsteking",
      "heating": "Verwarmt",
      "cooldown": "Ventilatorspoeling",
      "alarm": "Storing",
      "power": "Elektrisch",
      "energy": "Elek. energie",
      "fuel": "Diesel",
      "used": "Verbruikt",
      "cost": "Kosten",
      "temp": "Ruimte",
      "flue": "Rookgas",
      "lowfuel": "Diesel bijna op",
      "hotflue": "Rookgas te heet"
    },
    "ro": {
      "name": "Sobă pe motorină",
      "off": "Oprit",
      "standby": "Standby",
      "ignition": "Aprindere",
      "heating": "Încălzește",
      "cooldown": "Purjare ventilator",
      "alarm": "Defecțiune",
      "power": "Electric",
      "energy": "Energie el.",
      "fuel": "Motorină",
      "used": "Consumat",
      "cost": "Cost",
      "temp": "Cameră",
      "flue": "Gaze arse",
      "lowfuel": "Motorină puțină",
      "hotflue": "Gaze arse prea fierbinți"
    },
    "ru": {
      "name": "Дизельный обогреватель",
      "off": "Выкл.",
      "standby": "Ожидание",
      "ignition": "Розжиг",
      "heating": "Нагрев",
      "cooldown": "Продувка",
      "alarm": "Неисправность",
      "power": "Электричество",
      "energy": "Эл. энергия",
      "fuel": "Дизель",
      "used": "Израсходовано",
      "cost": "Стоимость",
      "temp": "Помещение",
      "flue": "Дымоход",
      "lowfuel": "Мало дизеля",
      "hotflue": "Дымоход слишком горячий"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--dh-heat:var(--appliance-heat-color,#ff8a3d);--dh-cold:var(--appliance-cold-color,#2b9af9);
  --dh-alert:var(--appliance-alert-color,#db4437);--dh-ok:var(--appliance-ok-color,#43a047);--mod:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge,.ignition .badge{background:color-mix(in srgb,var(--dh-heat) 22%,transparent);color:var(--dh-heat)}
.cooldown .badge{background:color-mix(in srgb,var(--dh-cold) 22%,transparent);color:var(--dh-cold)}
.alarm .badge{background:color-mix(in srgb,var(--dh-alert) 22%,transparent);color:var(--dh-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--dh-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(190px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--dh-alert)}

/* ---- illustration ---- */
/* flammes : le groupe prend l'échelle de l'état, chaque couche vacille à son rythme */
.flames{opacity:0;transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.1);transition:opacity .5s,transform .5s}
.ignition .flames{opacity:.9;transform:scaleY(.38)}
.heating .flames{opacity:1;transform:scaleY(calc(.6 + .4*var(--mod)))}
.fl{transform-box:fill-box;transform-origin:50% 100%}
.ignition .fl,.heating .fl{animation:dhflick .5s ease-in-out infinite alternate}
.ignition .fl.f2,.heating .fl.f2{animation-duration:.36s;animation-delay:-.12s}
.ignition .fl.f3,.heating .fl.f3{animation-duration:.27s;animation-delay:-.2s}
@keyframes dhflick{0%{transform:scale(1,1)}100%{transform:scale(.9,.86) translate(1px,0)}}
.crown{opacity:0;transition:opacity .5s}
.ignition .crown{opacity:.55}
.heating .crown{opacity:1}
.crown .cf{transform-box:fill-box;transform-origin:50% 100%}
.ignition .cf,.heating .cf{animation:dhcrown .32s ease-in-out infinite alternate}
.crown .cf:nth-child(odd){animation-duration:.24s;animation-delay:-.1s}
@keyframes dhcrown{0%{transform:scaleY(1)}100%{transform:scaleY(.72)}}
.glow{opacity:0;transition:opacity .6s}
.ignition .glow{opacity:.3}
.heating .glow{opacity:calc(.4 + .45*var(--mod));animation:dhpulse 1.6s ease-in-out infinite alternate}
@keyframes dhpulse{to{opacity:calc(.25 + .3*var(--mod))}}
.embers{opacity:0}
.cooldown .embers{animation:dhember 4s ease-in-out infinite alternate}
@keyframes dhember{0%{opacity:.7}100%{opacity:.15}}
.plug{opacity:0}
.ignition .plug{animation:dhplug .6s ease-in-out infinite alternate}
@keyframes dhplug{0%{opacity:.45}100%{opacity:1}}
.puff{opacity:0;transform-box:fill-box;transform-origin:center}
.heating .puff,.ignition .puff,.cooldown .puff{animation:dhrise 3.4s ease-out infinite}
.puff:nth-child(2){animation-delay:-1.1s!important}.puff:nth-child(3){animation-delay:-2.2s!important}
.cooldown .puff{fill:#f4f7fa}
@keyframes dhrise{0%{opacity:0;transform:translate(0,8px) scale(.5)}20%{opacity:.6}100%{opacity:0;transform:translate(9px,-34px) scale(1.9)}}
.wave{fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round;opacity:0}
.heating .wave{animation:dhwave 2.4s ease-out infinite}
.wave:nth-child(2){animation-delay:-.8s!important}.wave:nth-child(3){animation-delay:-1.6s!important}
@keyframes dhwave{0%{opacity:0;transform:translateY(4px)}30%{opacity:.5}100%{opacity:0;transform:translateY(-16px)}}
.blades{transform-box:fill-box;transform-origin:50% 50%}
.ignition .blades{animation:dhspin .7s linear infinite}
.heating .blades{animation:dhspin .45s linear infinite}
.cooldown .blades{animation:dhspin .22s linear infinite}
@keyframes dhspin{to{transform:rotate(360deg)}}
.purge{fill:none;stroke:#bfe3ff;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:6 9;opacity:0}
.cooldown .purge{opacity:.85;animation:dhpurge .6s linear infinite}
@keyframes dhpurge{to{stroke-dashoffset:-15}}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.ignition .led{fill:#ffd24a;animation:dhblink .7s steps(2) infinite}.cooldown .led{fill:#3fa3ff;animation:dhblink 1.2s steps(2) infinite}
.standby .led{fill:#43a047}.alarm .led{fill:#db4437;animation:dhblink .8s steps(2) infinite}
@keyframes dhblink{50%{opacity:.15}}
.dsp{fill:#7fe3ff;font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}.ignition .dsp{fill:#ffd24a}
.fuelfill{fill:url(#dhfuelg)}
.low .fuelfill{fill:var(--dh-alert)}
.off .body-shade{opacity:.8}
.noanim *{animation:none!important}
.noanim .fl,.noanim .cf{transform:none}
`;

  const SVG = (label) => `
<svg viewBox="0 0 240 226" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="dhsteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8c96a1"/><stop offset=".3" stop-color="#eef2f6"/><stop offset=".55" stop-color="#b4bdc7"/><stop offset="1" stop-color="#707a86"/></linearGradient>
  <linearGradient id="dhbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c333b"/><stop offset=".22" stop-color="#4a535d"/><stop offset=".5" stop-color="#39424b"/><stop offset="1" stop-color="#1f252b"/></linearGradient>
  <linearGradient id="dhtop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c7682"/><stop offset="1" stop-color="#3a424b"/></linearGradient>
  <linearGradient id="dhside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#171c21"/><stop offset="1" stop-color="#2a3138"/></linearGradient>
  <linearGradient id="dhfo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a1f"/><stop offset=".6" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ffc766"/></linearGradient>
  <linearGradient id="dhfm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff9d28"/><stop offset=".7" stop-color="#ffd24a"/><stop offset="1" stop-color="#fff0a0"/></linearGradient>
  <linearGradient id="dhfi" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff2b5"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <linearGradient id="dhfb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1239ff"/><stop offset=".55" stop-color="#3fa3ff"/><stop offset="1" stop-color="#c9f2ff"/></linearGradient>
  <radialGradient id="dhgl" cx=".5" cy="1" r=".95"><stop offset="0" stop-color="#ffb04a" stop-opacity=".9"/><stop offset=".55" stop-color="#ff6a1f" stop-opacity=".3"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
  <radialGradient id="dhem" cx=".5" cy="1" r=".8"><stop offset="0" stop-color="#ff4a1a" stop-opacity=".85"/><stop offset="1" stop-color="#ff4a1a" stop-opacity="0"/></radialGradient>
  <linearGradient id="dhfuelg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8a317"/><stop offset=".5" stop-color="#ffd25a"/><stop offset="1" stop-color="#c88a0c"/></linearGradient>
 </defs>
 <!-- ombre au sol -->
 <ellipse cx="120" cy="214" rx="92" ry="8" fill="#000" opacity=".18"/>
 <!-- conduit inox -->
 <rect x="110" y="14" width="20" height="56" fill="url(#dhsteel)"/>
 <rect x="107" y="40" width="26" height="5" rx="2" fill="url(#dhsteel)" stroke="#8a949f" stroke-width=".6"/>
 <rect x="107" y="22" width="26" height="4" rx="2" fill="url(#dhsteel)" stroke="#8a949f" stroke-width=".6"/>
 <ellipse cx="120" cy="14" rx="10" ry="3" fill="#2a3138"/>
 <g fill="#e8eef4"><circle class="puff" cx="120" cy="10" r="5"/><circle class="puff" cx="118" cy="10" r="4"/><circle class="puff" cx="123" cy="10" r="4.5"/></g>
 <!-- ondes de chaleur au-dessus du plateau -->
 <g><path class="wave" d="M70 56 q6 -5 12 0 t12 0"/><path class="wave" d="M146 56 q6 -5 12 0 t12 0"/><path class="wave" d="M96 60 q6 -5 12 0 t12 0"/></g>
 <!-- corps : plateau en fonte en perspective, face avant, flanc -->
 <path class="body-shade" d="M42 84 L198 84 L198 200 L42 200Z" fill="url(#dhbody)"/>
 <path class="body-shade" d="M198 84 L214 72 L214 190 L198 200Z" fill="url(#dhside)"/>
 <path class="body-shade" d="M64 60 L176 60 L214 72 L198 84 L42 84 L26 72Z" fill="url(#dhtop)" stroke="#232a31" stroke-width="1.2" stroke-linejoin="round"/>
 <path d="M64 60 L176 60 L214 72" fill="none" stroke="#9aa4b0" stroke-width=".8" opacity=".6"/>
 <ellipse cx="120" cy="68" rx="30" ry="6.5" fill="#2a3138" stroke="#8a949f" stroke-width="1.2"/>
 <ellipse cx="120" cy="67" rx="21" ry="4" fill="#12161a"/>
 <!-- bandeau de commande -->
 <rect x="52" y="90" width="42" height="14" rx="3" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="73" y="100.5" id="dhdsp">--</text>
 <circle class="led" cx="106" cy="97" r="3.2"/>
 <circle cx="124" cy="97" r="5" fill="#8a949f" stroke="#c4ccd5"/><line x1="124" y1="97" x2="127" y2="93.5" stroke="#1d2329" stroke-width="1.6" stroke-linecap="round"/>
 <!-- souffleur -->
 <circle cx="178" cy="97" r="8.5" fill="#12161a" stroke="#6c7682"/>
 <g class="blades"><path d="M178 97 L178 90.5 Q182 92 180.5 96Z M178 97 L184.5 97 Q183 101 179.5 99Z M178 97 L178 103.5 Q174 102 175.5 98Z M178 97 L171.5 97 Q173 93 176.5 95Z" fill="#9aa4b0"/></g>
 <circle cx="178" cy="97" r="1.6" fill="#2a3138"/>
 <!-- chambre de combustion : hublot -->
 <rect x="50" y="112" width="102" height="62" rx="7" fill="#1b2026" stroke="#5b6672" stroke-width="2"/>
 <rect x="55" y="117" width="92" height="52" rx="4" fill="#0f1217"/>
 <rect class="glow" x="55" y="117" width="92" height="52" rx="4" fill="url(#dhgl)"/>
 <rect class="embers" x="55" y="117" width="92" height="52" rx="4" fill="url(#dhem)"/>
 <!-- brûleur à mèche : cuve, trous de la mèche, bougie de préchauffage -->
 <path d="M70 169 L72 160 Q101 154 130 160 L132 169Z" fill="#59636e" stroke="#3a424b"/>
 <ellipse cx="101" cy="160" rx="29" ry="5" fill="#2a3138" stroke="#7b8590" stroke-width=".8"/>
 <g fill="#12161a" id="dhholes"></g>
 <circle class="plug" cx="125" cy="158" r="3" fill="#ff7a2a"/>
 <!-- couronne bleue (mèche) puis flammes en trois couches -->
 <g class="crown" id="dhcrown"></g>
 <g class="flames" id="dhflames">
  <path class="fl f1" d="M101 160 C74 160 76 142 90 134 C88 144 94 141 101 122 C108 141 114 144 112 134 C126 142 128 160 101 160Z" fill="url(#dhfo)"/>
  <path class="fl f2" d="M101 158 C85 158 87 146 95 140 C94 148 98 146 101 130 C104 146 108 148 107 140 C115 146 117 158 101 158Z" fill="url(#dhfm)"/>
  <path class="fl f3" d="M101 156 C93 156 94 149 98 146 C98 150 100 148 101 140 C102 148 104 150 104 146 C108 149 109 156 101 156Z" fill="url(#dhfi)"/>
 </g>
 <path d="M55 119 L86 119 L55 146Z" fill="#fff" opacity=".07"/>
 <!-- hublot de niveau de gazole -->
 <rect x="160" y="112" width="20" height="62" rx="6" fill="#1b2026" stroke="#5b6672" stroke-width="1.6"/>
 <rect x="165" y="117" width="10" height="52" rx="3" fill="#0f1217"/>
 <rect class="fuelfill" id="dhfuel" x="165" y="143" width="10" height="26" rx="3"/>
 <g stroke="#c4ccd5" stroke-width=".9" opacity=".75"><path d="M163 130 h4 M163 143 h4 M163 156 h4"/></g>
 <path d="M166 119 v48" stroke="#fff" stroke-width="1.2" opacity=".18"/>
 <!-- air de purge -->
 <g><path class="purge" d="M186 106 q8 4 4 12"/><path class="purge" d="M188 114 q8 6 2 16" style="animation-delay:-.2s"/></g>
 <!-- grille basse + pieds -->
 <g stroke="#12161a" stroke-width="2" stroke-linecap="round" opacity=".8"><path d="M58 184 H146 M58 190 H146"/></g>
 <rect x="52" y="200" width="14" height="9" rx="2" fill="#1b2026"/><rect x="176" y="200" width="14" height="9" rx="2" fill="#1b2026"/>
</svg>`;

  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['fuel', 'mdi:gas-station', 'show_fuel'],
    ['used', 'mdi:water', 'show_fuel_used'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['temp', 'mdi:thermometer', 'show_temps'],
    ['flue', 'mdi:chimney', 'show_temps'],
  ];

  class ApplianceDieselHeaterCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/diesel|gazole|fioul|mazout|poele|stove|heater/i, 'climate') || f(/(diesel|gazole|fioul|mazout|poele|stove|heater).*(status|etat|state)/i, 'sensor'),
        entity_power: f(/(diesel|gazole|fioul|mazout|poele|stove|heater).*(power|puissance)/i, 'sensor'),
        entity_fuel_level: f(/(diesel|gazole|fioul|mazout|fuel).*(level|niveau)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_fuel: true, show_fuel_used: true, show_cost: true, show_temps: true,
        show_status: true, threshold: 15, ignition_threshold: 60, off_threshold: 0.5, fuel_alert: 15, flue_temp_max: 300, ...c };
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="dhtitle">${esc(c.name || this._t('name'))}</div><div class="badge" id="dhbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="dhalert"></div>
        <div class="tiles" id="dhtiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // couronne bleue : petites flammes en cercle autour de la mèche (ellipse vue en perspective)
      let cr = '', ho = '';
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2, x = 101 + 24 * Math.cos(a), y = 158.5 + 3.6 * Math.sin(a);
        cr += `<path class="cf" d="M${(x - 2).toFixed(1)} ${y.toFixed(1)} C${(x - 2.4).toFixed(1)} ${(y - 4).toFixed(1)} ${(x - 1).toFixed(1)} ${(y - 7).toFixed(1)} ${x.toFixed(1)} ${(y - 9).toFixed(1)} C${(x + 1).toFixed(1)} ${(y - 7).toFixed(1)} ${(x + 2.4).toFixed(1)} ${(y - 4).toFixed(1)} ${(x + 2).toFixed(1)} ${y.toFixed(1)}Z" fill="url(#dhfb)"/>`;
      }
      for (let i = 0; i < 9; i++) ho += `<circle cx="${(77 + i * 6).toFixed(0)}" cy="164.5" r="1.1"/>`;
      root.getElementById('dhcrown').innerHTML = cr;
      root.getElementById('dhholes').innerHTML = ho;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      let txt = '';
      if (stObj) {
        const a = stObj.attributes || {};
        // climate : hvac_action décrit l'état réel, l'état « heat » n'est que le mode demandé
        txt = a.hvac_action ? String(a.hvac_action).toLowerCase() + (/^off$/i.test(String(stObj.state)) ? ' off' : '') : String(stObj.state).toLowerCase();
      }
      const flameEnt = this._st(c.entity_flame);
      const flame = flameEnt ? flameEnt.state === 'on' : null;
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou|lockout/.test(txt)) st = 'alarm';
      else if (/cool|purge|refroid|extingu|shut|arr[eê]t en cours|stopping|post.?run/.test(txt)) st = 'cooldown';
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt) && flame !== true) st = 'off';
      else if (/ignit|allum|start|glow|pr[eé]chauff|prehe/.test(txt)) st = 'ignition';
      else if (/heat|chauff|burn|brûl|brul|running|^on/.test(txt) || flame === true) st = 'heating';
      else if (txt) st = 'standby';
      else if (flame === false) st = 'standby';
      else if (!isNaN(pw)) st = pw > c.ignition_threshold ? 'ignition' : (pw > c.threshold ? 'heating' : (pw > c.off_threshold ? 'standby' : 'off'));
      else st = 'standby';
      if (flame === false && st === 'heating' && /standby|idle|veille/.test(txt)) st = 'standby';
      return { st, pw };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, pw } = this._compute();
      const temp = this._num(c.entity_temp), flue = this._num(c.entity_flue_temp);
      let fuel = this._num(c.entity_fuel_level);
      const low = !isNaN(fuel) && fuel < Number(c.fuel_alert);
      let mod = this._num(c.entity_modulation); mod = isNaN(mod) ? 1 : Math.max(0, Math.min(100, mod)) / 100;
      card.className = `${st} ${low ? 'low' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--mod', mod);

      r.getElementById('dhtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('dhbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const dsp = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : st === 'ignition' ? 'IGN' : st === 'cooldown' ? 'PURG' : (!isNaN(temp) ? `${Math.round(temp)}°` : '--');
      r.getElementById('dhdsp').textContent = dsp;

      // hublot de niveau : 52 px de haut, de y=117 (plein) à y=169 (vide)
      const lvl = isNaN(fuel) ? 0.5 : Math.max(0, Math.min(100, fuel)) / 100, h = Math.max(2, 52 * lvl);
      const fe = r.getElementById('dhfuel'); fe.setAttribute('y', (169 - h).toFixed(1)); fe.setAttribute('height', h.toFixed(1));

      // alertes
      let al = '';
      if (low) al = `${this._t('lowfuel')} (${this._fmt(fuel, 0)} %)`;
      else if (!isNaN(flue) && flue > c.flue_temp_max) al = this._t('hotflue');
      const ae = r.getElementById('dhalert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy), used = this._num(c.entity_fuel_used);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_liter && !isNaN(used)) { cost = used * Number(c.price_per_liter); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        fuel: [c.entity_fuel_level, this._fmt(fuel, 0), '%'],
        used: [c.entity_fuel_used, this._fmt(used, 1), this._unit(c.entity_fuel_used, 'L')],
        cost: [c.entity_cost || (c.price_per_liter && c.entity_fuel_used), this._fmt(cost, 2), costU],
        temp: [c.entity_temp, this._fmt(temp, 1), '°C'],
        flue: [c.entity_flue_temp, this._fmt(flue, 0), '°C'],
      };
      const ENT = { power: c.entity_power, energy: c.entity_energy, fuel: c.entity_fuel_level, used: c.entity_fuel_used, cost: c.entity_cost, temp: c.entity_temp, flue: c.entity_flue_temp };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.classList.toggle('bad', (k === 'fuel' && low) || (k === 'flue' && !isNaN(flue) && flue > c.flue_temp_max));
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = ENT[k]; if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceDieselHeaterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceDieselHeaterCardEditor extends HTMLElement {
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
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_status'), ent('entity_flame', 'binary_sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        ent('entity_fuel_level', 'sensor'), ent('entity_fuel_used', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_liter', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_flue_temp', 'sensor'), ent('entity_modulation', 'sensor'),
        { type: 'grid', name: '', schema: [
          { name: 'threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'ignition_threshold', selector: { number: { min: 0, max: 2000, step: 1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'off_threshold', selector: { number: { min: 0, max: 500, step: 0.1, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'fuel_alert', selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_fuel', selector: { boolean: {} }, default: true },
          { name: 'show_fuel_used', selector: { boolean: {} }, default: true }, { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'show_temps', selector: { boolean: {} }, default: true }, { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceDieselHeaterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Chauffage diesel / Diesel heater',
    description: 'Poêle à gazole animé : couronne bleue et flammes, allumage, purge du souffleur, niveau de gazole, conso élec.', preview: true,
  });
})();

/* Carte « Jacuzzi » — custom:appliance-jacuzzi-card
 * Spa vu en plongée : épaisseur d'acrylique au rebord, eau en dégradé de profondeur, banquette
 * immergée, buses chromées, appuie-têtes, bec de cascade, trappe du spa pack.
 * États : off, standby, filtering, heating, jets, alarm. Bulles et jets qui s'accélèrent avec la
 * puissance, vapeur en chauffe, éclairage LED, alertes pH et température.
 */
(() => {
  const TAG = 'appliance-jacuzzi-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Hot tub",
      "off": "Off",
      "standby": "Standby",
      "filtering": "Filtering",
      "heating": "Heating",
      "jets": "Jets",
      "alarm": "Fault",
      "power": "Electric",
      "energy": "Elec. energy",
      "temp": "Water",
      "target": "Target",
      "ph": "pH",
      "cost": "Cost",
      "lowph": "pH too low",
      "highph": "pH too high",
      "hot": "Water too hot"
    },
    "de": {
      "name": "Whirlpool",
      "off": "Aus",
      "standby": "Bereitschaft",
      "filtering": "Filterung",
      "heating": "Heizt",
      "jets": "Düsen",
      "alarm": "Störung",
      "power": "Elektrisch",
      "energy": "Elektr. Energie",
      "temp": "Wasser",
      "target": "Soll",
      "ph": "pH",
      "cost": "Kosten",
      "lowph": "pH zu niedrig",
      "highph": "pH zu hoch",
      "hot": "Wasser zu heiß"
    },
    "fr": {
      "name": "Jacuzzi",
      "off": "Arrêt",
      "standby": "Veille",
      "filtering": "Filtration",
      "heating": "Chauffe",
      "jets": "Jets",
      "alarm": "Défaut",
      "power": "Électrique",
      "energy": "Énergie élec.",
      "temp": "Eau",
      "target": "Consigne",
      "ph": "pH",
      "cost": "Coût",
      "lowph": "pH trop bas",
      "highph": "pH trop élevé",
      "hot": "Eau trop chaude"
    },
    "nb": {
      "name": "Boblebad",
      "off": "Av",
      "standby": "Hvilemodus",
      "filtering": "Filtrerer",
      "heating": "Varmer",
      "jets": "Dyser",
      "alarm": "Feil",
      "power": "Elektrisk",
      "energy": "Elektr. energi",
      "temp": "Vann",
      "target": "Mål",
      "ph": "pH",
      "cost": "Kostnad",
      "lowph": "For lav pH",
      "highph": "For høy pH",
      "hot": "For varmt vann"
    },
    "nl": {
      "name": "Jacuzzi",
      "off": "Uit",
      "standby": "Stand-by",
      "filtering": "Filteren",
      "heating": "Verwarmt",
      "jets": "Jets",
      "alarm": "Storing",
      "power": "Elektrisch",
      "energy": "Elek. energie",
      "temp": "Water",
      "target": "Streef",
      "ph": "pH",
      "cost": "Kosten",
      "lowph": "pH te laag",
      "highph": "pH te hoog",
      "hot": "Water te heet"
    },
    "ro": {
      "name": "Jacuzzi",
      "off": "Oprit",
      "standby": "Standby",
      "filtering": "Filtrare",
      "heating": "Încălzește",
      "jets": "Jeturi",
      "alarm": "Defecțiune",
      "power": "Electric",
      "energy": "Energie el.",
      "temp": "Apă",
      "target": "Țintă",
      "ph": "pH",
      "cost": "Cost",
      "lowph": "pH prea scăzut",
      "highph": "pH prea ridicat",
      "hot": "Apă prea fierbinte"
    },
    "ru": {
      "name": "Джакузи",
      "off": "Выкл.",
      "standby": "Ожидание",
      "filtering": "Фильтрация",
      "heating": "Нагрев",
      "jets": "Форсунки",
      "alarm": "Неисправность",
      "power": "Электричество",
      "energy": "Эл. энергия",
      "temp": "Вода",
      "target": "Цель",
      "ph": "pH",
      "cost": "Стоимость",
      "lowph": "pH слишком низкий",
      "highph": "pH слишком высокий",
      "hot": "Вода слишком горячая"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--jz-heat:var(--appliance-heat-color,#ff8a3d);--jz-cold:var(--appliance-cold-color,#2b9af9);
  --jz-alert:var(--appliance-alert-color,#db4437);--jz-ok:var(--appliance-ok-color,#43a047);--spd:1;--jz-led:#7a5cff}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--jz-heat) 22%,transparent);color:var(--jz-heat)}
.filtering .badge,.jets .badge{background:color-mix(in srgb,var(--jz-cold) 22%,transparent);color:var(--jz-cold)}
.alarm .badge{background:color-mix(in srgb,var(--jz-alert) 22%,transparent);color:var(--jz-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--jz-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--jz-alert)}

/* ---- illustration ---- */
/* --spd : vitesse relative des animations, liée à la puissance (1 = normal) */
.bub{opacity:0;transform-box:fill-box;transform-origin:center}
.jets .bub{animation:jzbub calc(1.5s / var(--spd)) ease-out infinite}
.heating .bub:nth-child(3n),.filtering .bub:nth-child(5n){animation:jzbub calc(2.6s / var(--spd)) ease-out infinite}
@keyframes jzbub{0%{opacity:0;transform:scale(.3)}25%{opacity:.85}100%{opacity:0;transform:scale(1.5)}}
.js{stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:3 6;opacity:0}
.jets .js{opacity:.85;animation:jzjet calc(.9s / var(--spd)) linear infinite}
@keyframes jzjet{to{stroke-dashoffset:-9}}
.fall{stroke:#e6fbff;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:4 5;opacity:0}
.filtering .fall,.heating .fall,.jets .fall{opacity:.9;animation:jzfall calc(.7s / var(--spd)) linear infinite}
.fallbody{opacity:0;transition:opacity .5s}
.filtering .fallbody,.heating .fallbody,.jets .fallbody{opacity:.45}
@keyframes jzfall{to{stroke-dashoffset:-9}}
.rip{fill:none;stroke:#fff;stroke-width:1;opacity:0;transform-box:fill-box;transform-origin:center}
.filtering .rip,.heating .rip,.jets .rip{animation:jzrip calc(1.8s / var(--spd)) ease-out infinite}
.rip:nth-child(2){animation-delay:-.9s!important}
@keyframes jzrip{0%{opacity:.7;transform:scale(.4)}100%{opacity:0;transform:scale(1.6)}}
.steam{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center}
.heating .steam{animation:jzsteam 3.6s ease-out infinite}
.steam:nth-child(2){animation-delay:-.9s!important}.steam:nth-child(3){animation-delay:-1.8s!important}.steam:nth-child(4){animation-delay:-2.7s!important}
@keyframes jzsteam{0%{opacity:0;transform:translate(0,6px) scale(.5)}25%{opacity:.5}100%{opacity:0;transform:translate(6px,-34px) scale(2)}}
.leds{opacity:0;transition:opacity .6s;mix-blend-mode:screen}
.lit .leds{opacity:.85;animation:jzhue 12s linear infinite}
@keyframes jzhue{to{filter:hue-rotate(360deg)}}
.lit.fixed .leds{animation:none}
.shellglow{fill:none;stroke:var(--jz-alert);stroke-width:2.5;opacity:0}
.alarm .shellglow{animation:jzalarm .9s steps(2) infinite}
@keyframes jzalarm{50%{opacity:.9}}
.led{fill:#6b7480}
.heating .led{fill:#ff8a3d}.filtering .led{fill:#3fa3ff}.jets .led{fill:#8ee0ff;animation:jzblink 1s steps(2) infinite}.standby .led{fill:#43a047}
.alarm .led{fill:#db4437;animation:jzblink .8s steps(2) infinite}
@keyframes jzblink{50%{opacity:.2}}
.packled{fill:#44505c}
.heating .packled{fill:#ff8a3d}.filtering .packled,.jets .packled{fill:#3fa3ff}.alarm .packled{fill:#db4437}
.dsp{fill:#7fe3ff;font:700 9px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.alarm .dsp{fill:#ffb74d}.off .dsp{fill:#3b4a5c}
.off .water{filter:saturate(.55) brightness(.9)}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 240 200" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="jzwater" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#0a4d7a"/><stop offset=".5" stop-color="#1b86b3"/><stop offset="1" stop-color="#58d2e6"/></radialGradient>
  <linearGradient id="jzshell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd9e0"/></linearGradient>
  <linearGradient id="jzwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc7da"/><stop offset="1" stop-color="#3f9db8"/></linearGradient>
  <linearGradient id="jzcab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b4636"/><stop offset=".5" stop-color="#7a604a"/><stop offset="1" stop-color="#4f3c2e"/></linearGradient>
  <radialGradient id="jzchrome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bfc8d0"/><stop offset="1" stop-color="#6c7782"/></radialGradient>
  <linearGradient id="jzblade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fa"/><stop offset=".5" stop-color="#aeb8c2"/><stop offset="1" stop-color="#e2e8ee"/></linearGradient>
  <radialGradient id="jzled" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="var(--jz-led)" stop-opacity=".95"/><stop offset=".6" stop-color="var(--jz-led)" stop-opacity=".35"/><stop offset="1" stop-color="var(--jz-led)" stop-opacity="0"/></radialGradient>
  <clipPath id="jzclip"><rect x="28" y="30" width="184" height="112" rx="22"/></clipPath>
 </defs>
 <!-- ombre au sol + caisson (jupe) avec trappe du spa pack -->
 <ellipse cx="120" cy="193" rx="106" ry="6" fill="#000" opacity=".16"/>
 <rect x="16" y="120" width="208" height="74" rx="18" fill="url(#jzcab)"/>
 <g stroke="#3d2e22" stroke-width="1" opacity=".55"><path d="M40 176 V192 M70 176 V192 M170 176 V192 M200 176 V192"/></g>
 <rect x="86" y="175" width="68" height="17" rx="3" fill="#6a5340" stroke="#2f241a" stroke-width="1"/>
 <g stroke="#2f241a" stroke-width="1.2" stroke-linecap="round" opacity=".8"><path d="M92 180 H122 M92 184 H122 M92 188 H122"/></g>
 <rect x="130" y="180" width="18" height="7" rx="2" fill="url(#jzchrome)" stroke="#555e68" stroke-width=".6"/>
 <circle class="packled" cx="127" cy="183.5" r="1.8"/>
 <!-- coque acrylique : épaisseur au rebord, face supérieure, ouverture -->
 <rect x="10" y="22" width="220" height="150" rx="36" fill="#aebbc5"/>
 <rect x="10" y="14" width="220" height="150" rx="36" fill="url(#jzshell)" stroke="#9aa9b4" stroke-width="1"/>
 <rect x="14" y="17" width="212" height="144" rx="33" fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"/>
 <rect class="shellglow" x="10" y="14" width="220" height="150" rx="36"/>
 <rect x="24" y="26" width="192" height="120" rx="26" fill="url(#jzwall)" stroke="#6f8a97" stroke-width="2"/>
 <rect x="26" y="28" width="188" height="116" rx="24" fill="none" stroke="#2a6a82" stroke-width="2" opacity=".55"/>
 <!-- eau -->
 <g class="water">
  <rect x="28" y="30" width="184" height="112" rx="22" fill="url(#jzwater)"/>
  <!-- banquette immergée : eau moins profonde -->
  <path d="M34 36 H202 V62 H62 V136 H34 Z" fill="#7fe0ee" opacity=".42" stroke="#b8f3fa" stroke-width="1" stroke-linejoin="round"/>
  <path d="M34 36 H202 V62 H62 V136 H34 Z" fill="none" stroke="#0a4d7a" stroke-width="2" opacity=".25" stroke-linejoin="round" transform="translate(1.5 1.5)"/>
  <!-- éclairage LED sous l'eau -->
  <g class="leds" clip-path="url(#jzclip)"><ellipse cx="120" cy="86" rx="92" ry="58" fill="url(#jzled)"/><ellipse cx="46" cy="50" rx="22" ry="18" fill="url(#jzled)"/><ellipse cx="196" cy="128" rx="22" ry="16" fill="url(#jzled)"/></g>
  <!-- bulles + jets (générés) -->
  <g id="jzbubbles"></g>
  <g id="jzstreams" fill="none"></g>
  <!-- reflet -->
  <path d="M36 40 Q100 34 150 42" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".22"/>
 </g>
 <!-- buses chromées -->
 <g id="jzjets"></g>
 <!-- appuie-têtes -->
 <g fill="#3a444e" stroke="#1d242b" stroke-width=".8">
  <rect x="48" y="19" width="28" height="13" rx="6.5"/><rect x="88" y="19" width="28" height="13" rx="6.5"/><rect x="128" y="19" width="28" height="13" rx="6.5"/>
  <rect x="15" y="74" width="13" height="28" rx="6.5"/>
 </g>
 <g fill="#fff" opacity=".22"><rect x="52" y="21" width="20" height="3" rx="1.5"/><rect x="92" y="21" width="20" height="3" rx="1.5"/><rect x="132" y="21" width="20" height="3" rx="1.5"/><rect x="17" y="78" width="3" height="20" rx="1.5"/></g>
 <!-- bec de cascade -->
 <rect class="fallbody" x="176" y="32" width="22" height="22" fill="#e6fbff"/>
 <g><line class="fall" x1="180" y1="32" x2="180" y2="54"/><line class="fall" x1="187" y1="32" x2="187" y2="54" style="animation-delay:-.25s"/><line class="fall" x1="194" y1="32" x2="194" y2="54" style="animation-delay:-.45s"/></g>
 <g><ellipse class="rip" cx="187" cy="56" rx="14" ry="4"/><ellipse class="rip" cx="187" cy="56" rx="14" ry="4"/></g>
 <rect x="170" y="21" width="34" height="11" rx="4" fill="url(#jzblade)" stroke="#7f8b97" stroke-width=".8"/>
 <rect x="174" y="29" width="26" height="4" rx="2" fill="url(#jzchrome)"/>
 <!-- vapeur en chauffe -->
 <g><ellipse class="steam" cx="86" cy="88" rx="12" ry="7"/><ellipse class="steam" cx="132" cy="104" rx="14" ry="8"/><ellipse class="steam" cx="170" cy="84" rx="11" ry="6"/><ellipse class="steam" cx="108" cy="72" rx="10" ry="6"/></g>
 <!-- panneau de commande sur le rebord -->
 <rect x="150" y="148" width="62" height="13" rx="4" fill="#0e1b2c" stroke="#27394f"/>
 <text class="dsp" x="181" y="158" id="jzdsp">--</text>
 <circle class="led" cx="141" cy="154.5" r="3"/>
</svg>`;

  // buses : [x, y] — dossier de la banquette (haut), côté gauche, fond du bassin
  const JETS = [[66, 43], [96, 43], [126, 43], [156, 43], [44, 92], [44, 118], [100, 133], [130, 133], [160, 133], [190, 133], [199, 86], [199, 110]];
  const TILES = [
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['temp', 'mdi:thermometer-water', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['ph', 'mdi:ph', 'show_ph'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceJacuzziCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_status: f(/jacuzzi|spa|hot.?tub/i, 'climate') || f(/(jacuzzi|spa|hot.?tub).*(status|etat|state|mode)/i, 'sensor'),
        entity_power: f(/(jacuzzi|spa|hot.?tub).*(power|puissance)/i, 'sensor'),
        entity_temp: f(/(jacuzzi|spa|hot.?tub).*(temp)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_power: true, show_energy: true, show_temp: true, show_ph: true, show_cost: true, show_status: true,
        filter_threshold: 30, jets_threshold: 700, heater_threshold: 1800, power_max: 2500, off_threshold: 0.5,
        ph_min: 7, ph_max: 7.8, temp_max: 40, ...c };
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
    // consigne : attribut temperature d'une entité climate / water_heater, sinon valeur numérique de l'état
    _tgt(id) {
      const s = this._st(id);
      if (s && /^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return s.attributes && s.attributes.temperature != null && isFinite(t) ? t : NaN; }
      return this._num(id);
    }
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap">
        <div class="head"><div class="title" id="jztitle">${esc(c.name || this._t('name'))}</div><div class="badge" id="jzbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="jzalert"></div>
        <div class="tiles" id="jztiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </div></ha-card>`;
      // buses chromées et jets d'eau qui partent vers le centre du bassin
      let jt = '', js = '';
      JETS.forEach(([x, y], i) => {
        const dx = 120 - x, dy = 88 - y, n = Math.hypot(dx, dy) || 1, ex = x + dx / n * 17, ey = y + dy / n * 17;
        jt += `<circle cx="${x}" cy="${y}" r="3.6" fill="url(#jzchrome)" stroke="#4d5762" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="1.1" fill="#2a3138"/>`;
        js += `<line class="js" x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" style="animation-delay:${(-i * 0.13).toFixed(2)}s"/>`;
      });
      // bulles : positions déterministes pour ne pas changer d'un rendu à l'autre
      let bb = '';
      for (let i = 0; i < 24; i++) {
        const x = 40 + ((i * 53) % 150), y = 40 + ((i * 37) % 95), r = 1.6 + (i % 4) * 0.7;
        bb += `<circle class="bub" cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#fff" style="animation-delay:${(-(i % 8) * 0.19).toFixed(2)}s"/>`;
      }
      root.getElementById('jzjets').innerHTML = jt;
      root.getElementById('jzstreams').innerHTML = js;
      root.getElementById('jzbubbles').innerHTML = bb;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c;
      const pw = this._watts(c.entity_power);
      const stObj = this._st(c.entity_status);
      let txt = '';
      if (stObj) {
        const a = stObj.attributes || {};
        // climate : hvac_action décrit l'état réel, l'état « heat » n'est que le mode demandé
        txt = a.hvac_action ? String(a.hvac_action).toLowerCase() + (/^off$/i.test(String(stObj.state)) ? ' off' : '') : String(stObj.state).toLowerCase();
      }
      let st;
      if (/alarm|alarme|error|erreur|fault|défaut|defaut|lock|verrou/.test(txt)) st = 'alarm';
      else if (/unavailable|unknown|^off| off$|arr[eê]t|eteint|éteint/.test(txt)) st = 'off';
      else if (/jet|massage|bubbl|bulle|turbo|blower|souffl/.test(txt)) st = 'jets';
      else if (/heat|chauff/.test(txt)) st = 'heating';
      else if (/filt|circul|clean|ozon|sanit|pump|pompe/.test(txt)) st = 'filtering';
      else if (txt) st = 'standby';
      else if (!isNaN(pw)) {
        st = pw > c.heater_threshold ? 'heating' : pw > c.jets_threshold ? 'jets' : pw > c.filter_threshold ? 'filtering' : (pw > c.off_threshold ? 'standby' : 'off');
      } else st = 'standby';
      return { st, pw };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, card = this._card, r = this._root;
      const { st, pw } = this._compute();
      const temp = this._num(c.entity_temp), target = this._tgt(c.entity_target_temp), ph = this._num(c.entity_ph);
      // vitesse des animations : suit la puissance (0.7 à 2.3), 1.4 si on ne la connaît pas en mode jets
      const spd = !isNaN(pw) ? 0.7 + 1.6 * Math.max(0, Math.min(1, pw / Number(c.power_max || 2500))) : (st === 'jets' ? 1.4 : 1);
      // éclairage : entité allumée ; la couleur vient de rgb_color si la lumière la fournit
      const lightEnt = this._st(c.entity_light), lit = !!lightEnt && lightEnt.state === 'on';
      const rgb = lit && lightEnt.attributes && Array.isArray(lightEnt.attributes.rgb_color) ? lightEnt.attributes.rgb_color.slice(0, 3).map((n) => Math.max(0, Math.min(255, Math.round(Number(n)) || 0))) : null;
      card.className = `${st} ${lit ? 'lit' : ''} ${rgb ? 'fixed' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--spd', spd.toFixed(2));
      if (rgb) card.style.setProperty('--jz-led', `rgb(${rgb.join(',')})`); else card.style.removeProperty('--jz-led');

      r.getElementById('jztitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('jzbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('jzdsp').textContent = st === 'off' ? 'OFF' : st === 'alarm' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 1)}°` : '--';

      // alertes : pH hors plage, eau trop chaude
      const phBad = !isNaN(ph) && (ph < Number(c.ph_min) || ph > Number(c.ph_max)), hot = !isNaN(temp) && temp > Number(c.temp_max);
      let al = '';
      if (!isNaN(ph) && ph < Number(c.ph_min)) al = `${this._t('lowph')} (${this._fmt(ph, 1)})`;
      else if (!isNaN(ph) && ph > Number(c.ph_max)) al = `${this._t('highph')} (${this._fmt(ph, 1)})`;
      else if (hot) al = `${this._t('hot')} (${this._fmt(temp, 1)} °C)`;
      const ae = r.getElementById('jzalert'); ae.textContent = al; ae.classList.toggle('on', !!al);

      // tuiles
      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        temp: [c.entity_temp, this._fmt(temp, 1), '°C'],
        target: [c.entity_target_temp, this._fmt(target, 1), '°C'],
        ph: [c.entity_ph, this._fmt(ph, 1), ''],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      const ENT = { power: c.entity_power, energy: c.entity_energy, temp: c.entity_temp, target: c.entity_target_temp, ph: c.entity_ph, cost: c.entity_cost };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [ent, val, unit] = V[k];
        el.classList.toggle('hide', !ent || c[opt] === false);
        el.classList.toggle('bad', (k === 'ph' && phBad) || (k === 'temp' && hot));
        el.querySelector('.lbl').textContent = this._l(k);
        // valeur + unité en texte (l'unité vient de l'entité ou de la config)
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        el.onclick = () => { const id = ENT[k] || (k === 'cost' ? c.entity_energy : ''); if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); };
      });
    }
  }
  customElements.define(TAG, ApplianceJacuzziCard);

  /* ---- éditeur visuel ---- */
  class ApplianceJacuzziCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_status'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_ph', 'sensor'), ent('entity_light'),
        { type: 'grid', name: '', schema: [
          num('filter_threshold', 0, 2000, 1, 'W'), num('jets_threshold', 0, 5000, 1, 'W'),
          num('heater_threshold', 0, 10000, 1, 'W'), num('power_max', 100, 10000, 10, 'W'),
          num('off_threshold', 0, 500, 0.1, 'W'), num('temp_max', 20, 60, 0.5, '°C'),
          num('ph_min', 0, 14, 0.1), num('ph_max', 0, 14, 0.1),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          { name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true }, { name: 'show_temp', selector: { boolean: {} }, default: true },
          { name: 'show_ph', selector: { boolean: {} }, default: true }, { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'animations', selector: { boolean: {} }, default: true },
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceJacuzziCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Jacuzzi / Hot tub',
    description: 'Spa animé vu du dessus : jets, bulles, vapeur, cascade, éclairage LED, température et alertes pH.', preview: true,
  });
})();

/* Cartes « Accès » — barrière levante, portail coulissant, portail battant, porte de garage
 * custom:appliance-barrier-card, appliance-sliding-gate-card, appliance-swing-gate-card,
 * appliance-garage-door-card. Une entité cover (ou binary_sensor / switch / input_boolean / sensor
 * texte) donne l'état ; current_position pilote l'illustration quand elle existe.
 * La position est une propriété CSS enregistrée (--acc-p, 0 fermé → 100 ouvert) : sa transition
 * dure le temps de course réel du moteur, et lisse les mises à jour de current_position.
 * États : open, closed, opening, closing, partial, unavailable. Gyrophare pendant le mouvement,
 * boutons ouvrir / stop / fermer (ou impulsion), puissance, énergie et coût du moteur.
 */
(() => {
  if (customElements.get('appliance-barrier-card')) return;

  const T = {
    "en": {
      "barrier": "Barrier",
      "sliding_gate": "Sliding gate",
      "swing_gate": "Swing gate",
      "garage_door": "Garage door",
      "open": "Open",
      "closed": "Closed",
      "opening": "Opening",
      "closing": "Closing",
      "partial": "Partly open",
      "unavailable": "Unavailable",
      "position": "Position",
      "power": "Motor",
      "energy": "Energy",
      "cost": "Cost",
      "since": "Last change",
      "btn_open": "Open",
      "btn_stop": "Stop",
      "btn_close": "Close",
      "btn_command": "Command"
    },
    "de": {
      "barrier": "Schranke",
      "sliding_gate": "Schiebetor",
      "swing_gate": "Flügeltor",
      "garage_door": "Garagentor",
      "open": "Offen",
      "closed": "Geschlossen",
      "opening": "Öffnet",
      "closing": "Schließt",
      "partial": "Teilweise offen",
      "unavailable": "Nicht verfügbar",
      "position": "Position",
      "power": "Motor",
      "energy": "Energie",
      "cost": "Kosten",
      "since": "Letzte Änderung",
      "btn_open": "Öffnen",
      "btn_stop": "Stopp",
      "btn_close": "Schließen",
      "btn_command": "Befehl"
    },
    "fr": {
      "barrier": "Barrière",
      "sliding_gate": "Portail coulissant",
      "swing_gate": "Portail battant",
      "garage_door": "Porte de garage",
      "open": "Ouvert",
      "closed": "Fermé",
      "opening": "Ouverture",
      "closing": "Fermeture",
      "partial": "Entrouvert",
      "unavailable": "Indisponible",
      "position": "Position",
      "power": "Moteur",
      "energy": "Énergie",
      "cost": "Coût",
      "since": "Dernier mouvement",
      "btn_open": "Ouvrir",
      "btn_stop": "Stop",
      "btn_close": "Fermer",
      "btn_command": "Commande"
    },
    "nb": {
      "barrier": "Bom",
      "sliding_gate": "Skyveport",
      "swing_gate": "Slagport",
      "garage_door": "Garasjeport",
      "open": "Åpen",
      "closed": "Lukket",
      "opening": "Åpner",
      "closing": "Lukker",
      "partial": "Delvis åpen",
      "unavailable": "Utilgjengelig",
      "position": "Posisjon",
      "power": "Motor",
      "energy": "Energi",
      "cost": "Kostnad",
      "since": "Sist endret",
      "btn_open": "Åpne",
      "btn_stop": "Stopp",
      "btn_close": "Lukk",
      "btn_command": "Kommando"
    },
    "nl": {
      "barrier": "Slagboom",
      "sliding_gate": "Schuifpoort",
      "swing_gate": "Draaipoort",
      "garage_door": "Garagedeur",
      "open": "Open",
      "closed": "Gesloten",
      "opening": "Gaat open",
      "closing": "Gaat dicht",
      "partial": "Half open",
      "unavailable": "Niet beschikbaar",
      "position": "Positie",
      "power": "Motor",
      "energy": "Energie",
      "cost": "Kosten",
      "since": "Laatste wijziging",
      "btn_open": "Openen",
      "btn_stop": "Stop",
      "btn_close": "Sluiten",
      "btn_command": "Bediening"
    },
    "ro": {
      "barrier": "Barieră",
      "sliding_gate": "Poartă culisantă",
      "swing_gate": "Poartă batantă",
      "garage_door": "Ușă de garaj",
      "open": "Deschis",
      "closed": "Închis",
      "opening": "Se deschide",
      "closing": "Se închide",
      "partial": "Parțial deschis",
      "unavailable": "Indisponibil",
      "position": "Poziție",
      "power": "Motor",
      "energy": "Energie",
      "cost": "Cost",
      "since": "Ultima schimbare",
      "btn_open": "Deschide",
      "btn_stop": "Stop",
      "btn_close": "Închide",
      "btn_command": "Comandă"
    },
    "ru": {
      "barrier": "Шлагбаум",
      "sliding_gate": "Сдвижные ворота",
      "swing_gate": "Распашные ворота",
      "garage_door": "Гаражные ворота",
      "open": "Открыто",
      "closed": "Закрыто",
      "opening": "Открывание",
      "closing": "Закрывание",
      "partial": "Частично открыто",
      "unavailable": "Недоступно",
      "position": "Позиция",
      "power": "Мотор",
      "energy": "Энергия",
      "cost": "Стоимость",
      "since": "Последнее изменение",
      "btn_open": "Открыть",
      "btn_stop": "Стоп",
      "btn_close": "Закрыть",
      "btn_command": "Команда"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // --acc-p animable seulement si enregistrée comme <number> ; sinon repli sur une transition de transform
  let typed = false;
  try { CSS.registerProperty({ name: '--acc-p', syntax: '<number>', inherits: true, initialValue: '0' }); typed = true; }
  catch (e) { typed = !!e && e.name === 'InvalidModificationError'; } // déjà enregistrée par une autre copie

  const CSS_TXT = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--acc-move:var(--appliance-heat-color,#ff8a3d);--acc-ok:var(--appliance-ok-color,#43a047);
  --acc-cold:var(--appliance-cold-color,#2b9af9);--acc-beacon:#ffa31a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.open .badge{background:color-mix(in srgb,var(--acc-ok) 22%,transparent);color:var(--acc-ok)}
.opening .badge,.closing .badge{background:color-mix(in srgb,var(--acc-move) 22%,transparent);color:var(--acc-move)}
.partial .badge{background:color-mix(in srgb,var(--acc-cold) 22%,transparent);color:var(--acc-cold)}
.scene{position:relative;width:100%;max-width:calc(260px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:4px auto 0;cursor:pointer;
  --acc-p:0;transition:--acc-p var(--acc-t,0s) linear}
.scene>svg,.scene>.leaf{position:absolute}
.scene>svg{inset:0;width:100%;height:100%;overflow:visible}
.notyped .mv{transition:transform var(--acc-t,0s) linear}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.hide{display:none}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

/* ---- éléments communs ---- */
/* gyrophare orange : clignote pendant le mouvement */
.lamp{fill:#8a6a3a}
.halo{opacity:0;transform-box:fill-box;transform-origin:center}
.moving .lamp{fill:var(--acc-beacon);animation:accblink .7s steps(2) infinite}
.moving .halo{animation:accflash .7s ease-out infinite}
@keyframes accblink{50%{fill:#8a6a3a}}
@keyframes accflash{0%{opacity:.85;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
.led{fill:#5b6570}
.closed .led{fill:#db4437}.open .led,.partial .led{fill:#43a047}.moving .led{fill:var(--acc-beacon);animation:accblinkled .5s steps(2) infinite}
@keyframes accblinkled{50%{opacity:.25}}
.unavailable .scene{filter:grayscale(.7) opacity(.7)}
/* roues du portail coulissant */
.wheel{transform-box:fill-box;transform-origin:center}
.opening .wheel{animation:accspin .9s linear infinite}.closing .wheel{animation:accspin .9s linear infinite reverse}
@keyframes accspin{to{transform:rotate(360deg)}}

/* ---- barrière : le bras pivote de 0 à 90° ---- */
.arm{transform-box:view-box;transform-origin:49px 150px;transform:rotate(calc(var(--acc-p) * -0.9deg))}
.armled{fill:#ff4b3e}
.open .armled,.partial .armled{fill:#58e06a}
.moving .armled{fill:var(--acc-beacon);animation:accblinkled .5s steps(2) infinite}
/* ---- portail coulissant : le vantail glisse derrière le pilier ---- */
.slide{transform:translateX(calc(var(--acc-p) * 1.06px))}
/* ---- portail battant : vantaux en 3D, pivot sur les piliers, ouverture vers l'intérieur ---- */
.leaf{top:33.5%;height:52%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.swing{perspective:520px;perspective-origin:50% 35%}
.leaf.l{transform-origin:0 50%;transform:rotateY(calc(var(--acc-p) * 0.82deg))}
.leaf.r{transform-origin:100% 50%;transform:rotateY(calc(var(--acc-p) * -0.82deg))}
.leaf .shade{opacity:calc(var(--acc-p) * .005)}
/* ---- porte de garage : les sections remontent sous le linteau ---- */
.door{transform:translateY(calc(var(--acc-p) * -1.02px))}
.bulb{opacity:0;transition:opacity .6s}
.open .bulb,.partial .bulb,.opening .bulb,.closing .bulb{opacity:1}
.noanim *{animation:none!important}
`;

  const GROUND = (w, y) => `<ellipse cx="${w / 2}" cy="${y + 6}" rx="${w / 2 - 8}" ry="5" fill="#000" opacity=".16"/>`;
  const BEACON = (x, y) => `
 <circle class="halo" cx="${x}" cy="${y - 3}" r="11" fill="#ffb84d"/>
 <rect x="${x - 6}" y="${y + 1}" width="12" height="4" rx="1" fill="#30363d"/>
 <path class="lamp" d="M${x - 5} ${y + 1} V${y - 3} A5 5 0 0 1 ${x + 5} ${y - 3} V${y + 1} Z"/>
 <path d="M${x - 2.5} ${y - 4} A2.5 2.5 0 0 1 ${x} ${y - 6.5}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".55"/>`;
  const DEFS = `
  <linearGradient id="accstone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".6" stop-color="#dfe4e8"/><stop offset="1" stop-color="#b9c1c9"/></linearGradient>
  <linearGradient id="accmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6670"/><stop offset="1" stop-color="#2d333a"/></linearGradient>
  <linearGradient id="accroad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5059"/><stop offset="1" stop-color="#363b42"/></linearGradient>
  <radialGradient id="accchrome" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#bfc8d0"/><stop offset="1" stop-color="#6c7782"/></radialGradient>`;
  const PILLAR = (x, w, top, bot) => `
 <rect x="${x}" y="${top}" width="${w}" height="${bot - top}" fill="url(#accstone)" stroke="#9aa5ae" stroke-width=".8"/>
 <rect x="${x - 3}" y="${top - 6}" width="${w + 6}" height="7" rx="1.5" fill="#cfd6dc" stroke="#9aa5ae" stroke-width=".8"/>
 <rect x="${x - 2}" y="${bot - 6}" width="${w + 4}" height="6" fill="#c3cad0"/>`;

  // barrière levante : armoire à gauche, bras rayé rouge et blanc, fourche d'appui à droite
  const SVG_BARRIER = () => `
<svg viewBox="0 0 260 200" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="acccab" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffd54a"/><stop offset=".55" stop-color="#f2b705"/><stop offset="1" stop-color="#c98f00"/></linearGradient>
 </defs>
 ${GROUND(260, 186)}
 <rect x="0" y="176" width="260" height="14" rx="3" fill="url(#accroad)"/>
 <path d="M10 183 H250" stroke="#f5f5f5" stroke-width="1.6" stroke-dasharray="14 10" opacity=".7"/>
 <!-- fourche d'appui -->
 <rect x="203" y="152" width="7" height="26" fill="url(#accmetal)"/>
 <path d="M200 142 V155 H213 V142" fill="none" stroke="#3a4148" stroke-width="3" stroke-linejoin="round"/>
 <rect x="199" y="175" width="15" height="4" rx="1" fill="#2d333a"/>
 <!-- bras (pivote autour du moyeu) -->
 <g class="arm mv">
  <rect x="44" y="145" width="160" height="10" rx="5" fill="#fafafa" stroke="#aab2ba" stroke-width=".8"/>
  <g fill="#d8322b"><rect x="66" y="145" width="14" height="10"/><rect x="94" y="145" width="14" height="10"/><rect x="122" y="145" width="14" height="10"/><rect x="150" y="145" width="14" height="10"/><path d="M178 145 H192 V155 H178 Z"/></g>
  <g class="armled"><circle cx="73" cy="150" r="1.4"/><circle cx="115" cy="150" r="1.4"/><circle cx="157" cy="150" r="1.4"/><circle cx="198" cy="150" r="1.4"/></g>
  <path d="M50 147 H200" stroke="#fff" stroke-width="1.2" opacity=".6"/>
 </g>
 <!-- armoire -->
 <rect x="30" y="124" width="38" height="54" rx="3" fill="url(#acccab)" stroke="#9c7200" stroke-width=".8"/>
 <rect x="26" y="118" width="46" height="8" rx="2" fill="#3a4148"/>
 <rect x="35" y="160" width="28" height="14" rx="2" fill="none" stroke="#9c7200" stroke-width=".8" opacity=".7"/>
 <circle cx="58" cy="167" r="1.5" fill="#5a4400"/>
 <rect x="26" y="176" width="46" height="5" rx="1" fill="#2d333a"/>
 <circle cx="49" cy="150" r="8.5" fill="url(#accchrome)" stroke="#555e68" stroke-width=".8"/>
 <circle cx="49" cy="150" r="2.4" fill="#3a4148"/>
 <circle class="led" cx="38" cy="131" r="2"/>
 ${BEACON(49, 112)}
</svg>`;

  // portail coulissant : vantail à barreaux sur rail, devant un muret, moteur au sol
  const SVG_SLIDING = () => {
    let bars = '';
    for (let x = 42; x <= 140; x += 7) bars += `<rect x="${x}" y="70" width="3" height="72" rx="1"/>`;
    let spikes = '';
    for (let x = 43.5; x <= 141.5; x += 7) spikes += `<path d="M${x - 2.4} 70 L${x} 64 L${x + 2.4} 70 Z"/>`;
    const wheel = (cx) => `<g class="wheel"><circle cx="${cx}" cy="145" r="4.5" fill="#2d333a"/><path d="M${cx - 3} 145 H${cx + 3} M${cx} 142 V148" stroke="#9aa3ab" stroke-width="1"/></g>`;
    return `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="accwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3dccf"/><stop offset="1" stop-color="#c9c0b0"/></linearGradient>
 </defs>
 ${GROUND(260, 150)}
 <rect x="0" y="148" width="260" height="12" rx="2" fill="url(#accroad)"/>
 <path d="M20 149 H252" stroke="#a9b1b8" stroke-width="2"/>
 <!-- muret le long duquel le vantail glisse -->
 <rect x="160" y="104" width="94" height="44" fill="url(#accwall)" stroke="#a89f8f" stroke-width=".8"/>
 <rect x="157" y="99" width="100" height="6" rx="1.5" fill="#d7d0c3" stroke="#a89f8f" stroke-width=".8"/>
 <g stroke="#b3a996" stroke-width=".7" opacity=".7"><path d="M160 118 H254 M160 133 H254 M190 104 V118 M226 104 V118 M174 118 V133 M210 118 V133 M244 118 V133 M190 133 V148 M226 133 V148"/></g>
 <!-- vantail -->
 <g class="slide mv">
  <g fill="#2f353c">${bars}${spikes}</g>
  <rect x="36" y="68" width="110" height="5" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="104" width="110" height="4" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="138" width="110" height="5" rx="1.5" fill="#3a4148"/>
  <rect x="36" y="68" width="4" height="75" fill="#3a4148"/><rect x="142" y="68" width="4" height="75" fill="#3a4148"/>
  <path d="M38 70 H144" stroke="#fff" stroke-width=".8" opacity=".25"/>
  ${wheel(52)}${wheel(130)}
 </g>
 <!-- moteur -->
 <rect x="168" y="130" width="24" height="18" rx="3" fill="url(#accmetal)"/>
 <rect x="171" y="133" width="18" height="3" rx="1" fill="#8b949c" opacity=".6"/>
 <circle class="led" cx="186" cy="141" r="1.8"/>
 <!-- piliers -->
 ${PILLAR(146, 16, 56, 150)}
 ${PILLAR(16, 18, 56, 150)}
 <rect x="20" y="90" width="9" height="14" rx="1.5" fill="#2d333a"/><circle cx="24.5" cy="95" r="1.6" fill="#7fe3ff"/><rect x="22" y="99" width="5" height="2.5" rx=".8" fill="#8b949c"/>
 ${BEACON(25, 44)}
</svg>`;
  };

  // portail battant : décor (allée, haie) / deux vantaux HTML en 3D / piliers devant
  const SVG_SWING_BACK = () => `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}</defs>
 ${GROUND(260, 150)}
 <path d="M0 94 H260 V150 H0 Z" fill="#5f8f4e" opacity=".55"/>
 <path d="M0 86 Q40 78 80 86 T160 84 T260 86 V98 H0 Z" fill="#3f6b38" opacity=".8"/>
 <path d="M100 96 H160 L232 150 H28 Z" fill="#9aa1a8" opacity=".85"/>
 <g stroke="#7f878f" stroke-width=".7" opacity=".7"><path d="M90 104 H170 M78 114 H182 M62 126 H198 M44 139 H216"/></g>
 <rect x="0" y="148" width="260" height="12" rx="2" fill="url(#accroad)"/>
</svg>`;
  // un vantail : viewBox w×88, barreaux sous une crête courbe qui monte vers le milieu
  const LEAF = (w, mirror) => {
    const top = (x) => { const u = mirror ? 1 - x / w : x / w; return 16 - 11 * u * u; };
    let bars = '', spikes = '';
    for (let x = 7; x <= w - 6; x += 7) {
      const y = top(x);
      bars += `<rect x="${x - 1.5}" y="${y.toFixed(1)}" width="3" height="${(82 - y).toFixed(1)}" rx="1"/>`;
      spikes += `<circle cx="${x}" cy="${(y - 2).toFixed(1)}" r="2.2"/>`;
    }
    let rail = `M0 ${top(0).toFixed(1)}`;
    for (let x = 4; x <= w; x += 4) rail += ` L${x} ${top(x).toFixed(1)}`;
    const lockX = mirror ? 3 : w - 11;
    return `<svg viewBox="0 0 ${w} 88" preserveAspectRatio="none">
  <g fill="#2f353c">${bars}${spikes}</g>
  <path d="${rail}" fill="none" stroke="#3a4148" stroke-width="5" stroke-linejoin="round"/>
  <rect x="0" y="44" width="${w}" height="4" rx="1.5" fill="#3a4148"/>
  <rect x="0" y="78" width="${w}" height="6" rx="1.5" fill="#3a4148"/>
  <rect x="0" y="${top(0) - 2}" width="4" height="${86 - top(0)}" fill="#3a4148"/><rect x="${w - 4}" y="${top(w) - 2}" width="4" height="${86 - top(w)}" fill="#3a4148"/>
  <rect x="${lockX}" y="50" width="8" height="12" rx="1.5" fill="#1f2429" stroke="#555e68" stroke-width=".6"/><rect x="${lockX + 2.5}" y="54" width="3" height="1.6" fill="url(#accchrome)"/>
  <rect class="shade" x="0" y="0" width="${w}" height="88" fill="#000"/>
 </svg>`;
  };
  const SVG_SWING_FRONT = () => `
<svg viewBox="0 0 260 170" aria-hidden="true" style="pointer-events:none">
 <defs>${DEFS}</defs>
 ${PILLAR(14, 22, 48, 150)}
 ${PILLAR(224, 22, 48, 150)}
 <g fill="#3a4148"><rect x="35" y="66" width="4" height="7" rx="1"/><rect x="35" y="124" width="4" height="7" rx="1"/><rect x="221" y="66" width="4" height="7" rx="1"/><rect x="221" y="124" width="4" height="7" rx="1"/></g>
 <rect x="19" y="88" width="11" height="16" rx="1.5" fill="#2d333a"/><circle cx="24.5" cy="93" r="1.8" fill="#7fe3ff"/><rect x="21.5" y="98" width="6" height="2.5" rx=".8" fill="#8b949c"/>
 <circle class="led" cx="235" cy="96" r="1.8"/>
 ${BEACON(235, 36)}
</svg>`;

  // porte de garage sectionnelle : façade, intérieur avec voiture et plafonnier, sections qui remontent
  const SVG_GARAGE = () => {
    let panels = '';
    for (let i = 0; i < 4; i++) {
      const y = 46 + i * 26;
      panels += `<rect x="42" y="${y}" width="176" height="26" fill="url(#accpanel)" stroke="#9aa5ae" stroke-width=".8"/>
   <path d="M44 ${y + 9} H216 M44 ${y + 17} H216" stroke="#b7c0c8" stroke-width=".8"/>
   <path d="M44 ${y + 1.5} H216" stroke="#fff" stroke-width=".8" opacity=".7"/>`;
    }
    let wins = '';
    for (let i = 0; i < 5; i++) wins += `<rect x="${56 + i * 31}" y="50" width="24" height="10" rx="1.5" fill="#2b3640" stroke="#8d969e" stroke-width=".8"/><path d="M${58 + i * 31} 52 L${64 + i * 31} 52" stroke="#9fd3ff" stroke-width="1" opacity=".55"/>`;
    return `
<svg viewBox="0 0 260 170" aria-hidden="true">
 <defs>${DEFS}
  <linearGradient id="accpanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f4f6"/><stop offset="1" stop-color="#cdd4da"/></linearGradient>
  <linearGradient id="accfacade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ddd5"/><stop offset="1" stop-color="#cfc8bd"/></linearGradient>
  <linearGradient id="accinside" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f25"/><stop offset="1" stop-color="#2b3138"/></linearGradient>
  <radialGradient id="acclight" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".75"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
  <clipPath id="accgap"><rect x="42" y="46" width="176" height="104"/></clipPath>
 </defs>
 ${GROUND(260, 152)}
 <rect x="8" y="22" width="244" height="130" fill="url(#accfacade)" stroke="#b3ab9e" stroke-width=".8"/>
 <rect x="2" y="14" width="256" height="10" rx="2" fill="#4a5058"/>
 <rect x="0" y="150" width="260" height="12" rx="2" fill="url(#accroad)"/>
 <!-- intérieur visible quand la porte remonte -->
 <rect x="42" y="46" width="176" height="104" fill="url(#accinside)"/>
 <g class="bulb"><path d="M130 50 L60 150 H200 Z" fill="url(#acclight)"/><circle cx="130" cy="50" r="3" fill="#fff6d0"/></g>
 <g>
  <path d="M84 146 V112 Q86 98 100 96 H160 Q174 98 176 112 V146 Z" fill="#2f6db5"/>
  <path d="M96 99 Q100 88 110 86 H150 Q160 88 164 99 Z" fill="#1d4a80"/>
  <path d="M100 98 Q104 90 112 89 H148 Q156 90 160 98 Z" fill="#9cc6ea" opacity=".55"/>
  <rect x="88" y="114" width="16" height="6" rx="2" fill="#e53935"/><rect x="156" y="114" width="16" height="6" rx="2" fill="#e53935"/>
  <rect x="116" y="124" width="28" height="8" rx="1" fill="#f2f2f2"/>
  <rect x="84" y="136" width="92" height="8" rx="2" fill="#1f3f66"/>
  <rect x="88" y="142" width="14" height="8" rx="2" fill="#15191d"/><rect x="158" y="142" width="14" height="8" rx="2" fill="#15191d"/>
 </g>
 <!-- porte -->
 <g clip-path="url(#accgap)"><g class="door mv">
  ${panels}${wins}
  <rect x="122" y="136" width="16" height="3" rx="1.5" fill="url(#accchrome)"/>
  <rect x="42" y="146" width="176" height="4" fill="#2d333a"/>
 </g></g>
 <!-- encadrement et linteau -->
 <rect x="38" y="42" width="184" height="108" fill="none" stroke="#9aa1a8" stroke-width="5"/>
 <rect x="34" y="38" width="192" height="6" rx="1" fill="#8d949b"/>
 <!-- applique et voyant -->
 <rect x="230" y="60" width="10" height="16" rx="2" fill="#2d333a"/><circle class="led" cx="235" cy="70" r="2"/>
 ${BEACON(235, 54)}
</svg>`;
  };

  const KINDS = {
    barrier: { travel: 4, vb: [260, 200], re: /barri|boom|schranke|slagboom/i, ico: ['mdi:boom-gate-up-outline', 'mdi:boom-gate-outline'], svg: SVG_BARRIER },
    sliding_gate: { travel: 15, vb: [260, 170], re: /portail|gate|tor\b|poort/i, ico: ['mdi:gate-open', 'mdi:gate'], svg: SVG_SLIDING },
    swing_gate: { travel: 14, vb: [260, 170], re: /portail|gate|tor\b|poort/i, ico: ['mdi:gate-open', 'mdi:gate'], svg: null },
    garage_door: { travel: 14, vb: [260, 170], re: /garage/i, ico: ['mdi:garage-open-variant', 'mdi:garage-variant'], svg: SVG_GARAGE },
  };
  const TILES = [
    ['position', 'mdi:arrow-expand-horizontal', 'show_position'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
    ['since', 'mdi:history', 'show_since'],
  ];

  class ApplianceAccessCard extends HTMLElement {
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_position: true, show_power: true, show_energy: true, show_cost: true, show_since: true,
        travel_time: KINDS[this.kind].travel, moving_threshold: 15, invert: false, leaves: 2, ...c };
      this._built = false; this._pos = null;
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _scene() {
      const K = KINDS[this.kind], [w, h] = K.vb;
      if (this.kind !== 'swing_gate') return `<div class="scene" style="aspect-ratio:${w}/${h}">${K.svg()}</div>`;
      // vantaux entre les piliers (x 36 → 224) : un seul vantail pleine largeur ou deux demi-vantaux
      const one = Number(this._c.leaves) === 1, lw = one ? 188 : 94;
      return `<div class="scene swing" style="aspect-ratio:${w}/${h}">${SVG_SWING_BACK()}
        <div class="leaf l mv" style="left:${(36 / w * 100).toFixed(3)}%;width:${(lw / w * 100).toFixed(3)}%">${LEAF(lw, false)}</div>
        ${one ? '' : `<div class="leaf r mv" style="left:${(130 / w * 100).toFixed(3)}%;width:${(lw / w * 100).toFixed(3)}%">${LEAF(lw, true)}</div>`}
        ${SVG_SWING_FRONT()}</div>`;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const K = KINDS[this.kind];
      root.innerHTML = `<style>${CSS_TXT}</style><ha-card class="${typed ? '' : 'notyped'}">
        <div class="head"><div class="title" id="acctitle"></div><div class="badge" id="accbadge"></div></div>
        ${this._scene()}
        <div class="ctl" id="accctl">
          <button data-a="open"><ha-icon icon="${esc(K.ico[0])}"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="${esc(K.ico[1])}"></ha-icon><span></span></button>
          <button data-a="command"><ha-icon icon="mdi:gesture-tap-button"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('.scene').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); this._action(b.dataset.a); }));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k, cc = this._c;
        this._more({ power: cc.entity_power, energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k] || cc.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._sceneEl = root.querySelector('.scene'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h) return;
      if (a === 'command') {
        const id = c.entity_control || c.entity, d = id.split('.')[0];
        if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
        else if (d === 'script') h.callService('script', 'turn_on', { entity_id: id });
        else h.callService('homeassistant', 'toggle', { entity_id: id });
        return;
      }
      h.callService('cover', `${a}_cover`, { entity_id: c.entity });
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      let st = 'unavailable', pos = NaN;
      if (s && !/^(unavailable|unknown)$/i.test(String(s.state))) {
        const d = c.entity.split('.')[0], v = String(s.state).toLowerCase(), a = s.attributes || {};
        if (d === 'cover') {
          st = ['open', 'closed', 'opening', 'closing'].includes(v) ? v : 'closed';
          const p = Number(a.current_position);
          if (a.current_position != null && isFinite(p)) pos = Math.max(0, Math.min(100, p));
        } else if (/clos(ing)|fermeture|schlie(ß|ss)t|sluit|lukker|închide/.test(v)) st = 'closing';
        else if (/opening|ouverture|öffnet|gaat open|åpner|deschide/.test(v)) st = 'opening';
        else {
          const on = /^(on|open|opened|ouvert|ouverte|offen|true|1|unlocked)$/.test(v);
          st = on !== !!c.invert ? 'open' : 'closed';
        }
      }
      const known = !isNaN(pos); // position réelle fournie par la cover
      if (!known) pos = st === 'open' || st === 'opening' ? 100 : 0;
      else if (st === 'open' && pos > 0 && pos < 100) st = 'partial';
      const pw = this._watts(c.entity_power);
      const moving = st === 'opening' || st === 'closing' || (!isNaN(pw) && pw > Number(c.moving_threshold));
      return { st, pos, known, pw, moving, s };
    }

    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      // moins de 45 s : « maintenant » (numeric auto) ; style short car narrow donne « -1 s » en français
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto', style: 'short' }).format(n ? -Math.floor(n) : 0, u); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, K = KINDS[this.kind];
      const { st, pos, known, pw, moving, s } = this._compute();
      this._card.className = `${typed ? '' : 'notyped'} ${st} ${moving ? 'moving' : ''} ${c.animations === false ? 'noanim' : ''}`;

      // course : la transition dure le temps que met le moteur à parcourir l'écart
      if (pos !== this._pos) {
        const dur = this._pos == null || c.animations === false ? 0 : Math.abs(pos - this._pos) / 100 * Math.max(0, Number(c.travel_time) || 0);
        this._sceneEl.style.setProperty('--acc-t', `${dur.toFixed(2)}s`);
        this._sceneEl.style.setProperty('--acc-p', String(pos));
        this._pos = pos;
      }

      const name = c.name || this._t(this.kind);
      r.getElementById('acctitle').textContent = name;
      this._sceneEl.setAttribute('role', 'img'); this._sceneEl.setAttribute('aria-label', `${name} – ${this._t(st)}`);
      const badge = r.getElementById('accbadge');
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      // commandes : ouvrir / stop / fermer pour une cover, sinon un bouton d'impulsion
      const d = (c.entity || '').split('.')[0], isCover = d === 'cover' && !c.entity_control;
      const canCmd = !!c.entity_control || ['switch', 'input_boolean', 'button', 'input_button', 'script'].includes(d);
      const sf = s && s.attributes && Number(s.attributes.supported_features);
      const ctl = r.getElementById('accctl');
      ctl.classList.toggle('hide', c.show_controls === false || (!isCover && !canCmd));
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'command' ? isCover : !isCover || (a === 'stop' && isFinite(sf) && sf > 0 && !(sf & 8)));
        b.disabled = st === 'unavailable' || (a === 'open' && (st === 'open' || st === 'opening')) || (a === 'close' && (st === 'closed' || st === 'closing'));
      });
      if (K.ico) ctl.querySelector('[data-a="command"] ha-icon').setAttribute('icon', st === 'closed' ? K.ico[0] : K.ico[1]);

      // tuiles : position, consommation du moteur, coût, dernier mouvement
      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        position: [known && st !== 'unavailable', this._fmt(pos, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceAccessCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_control'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          num('travel_time', 0, 120, 0.5, 's'), num('moving_threshold', 0, 2000, 1, 'W'),
          ...(this.kind === 'swing_gate' ? [{ name: 'leaves', selector: { select: { options: [{ value: 1, label: '1' }, { value: 2, label: '2' }] } } }] : []),
          { name: 'invert', selector: { boolean: {} } },
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_position'), bool('show_power'),
          bool('show_energy'), bool('show_cost'), bool('show_since'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }

  window.customCards = window.customCards || [];
  const DESC = {
    barrier: 'Barrière levante animée : le bras se lève et s\'abaisse, gyrophare, position, consommation du moteur.',
    sliding_gate: 'Portail coulissant animé : le vantail glisse sur son rail, gyrophare, position, consommation du moteur.',
    swing_gate: 'Portail battant animé en 3D : les vantaux pivotent vers l\'intérieur, gyrophare, consommation du moteur.',
    garage_door: 'Porte de garage sectionnelle animée : la porte remonte et dévoile le garage éclairé, consommation du moteur.',
  };
  for (const kind of Object.keys(KINDS)) {
    const tag = `appliance-${kind.replace('_', '-')}-card`;
    const K = KINDS[kind];
    customElements.define(tag, class extends ApplianceAccessCard {
      get kind() { return kind; }
      static getConfigElement() { return document.createElement(tag + '-editor'); }
      static getStubConfig(hass) {
        const ids = Object.keys((hass && hass.states) || {});
        const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
        const src = K.re.source;
        return {
          entity: f(K.re, 'cover') || f(K.re, 'binary_sensor'),
          entity_power: f(new RegExp(`(${src}).*(power|puissance)`, 'i'), 'sensor'),
          entity_energy: f(new RegExp(`(${src}).*(energy|energie|énergie)`, 'i'), 'sensor'),
        };
      }
    });
    customElements.define(tag + '-editor', class extends ApplianceAccessCardEditor { get kind() { return kind; } });
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, description: DESC[kind], preview: true,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();

/* Carte « Sauna » — custom:appliance-sauna-card
 * Cabine en lames de bois vue de face : porte vitrée teintée, poêle et pierres visibles à travers
 * la vitre, banquette, plafonnier, conduit de ventilation sur le toit, thermomètre et panneau.
 * États : off, heating, ready, cooling, fault. La lueur du poêle suit la température
 * (--heat, 0 → 1 de 25 °C à la consigne), ondes de chaleur en chauffe, vapeur au conduit,
 * thermomètre animé, boutons marche/arrêt et consigne ± pour une entité climate.
 */
(() => {
  const TAG = 'appliance-sauna-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Sauna",
      "off": "Off",
      "heating": "Heating",
      "ready": "Ready",
      "cooling": "Cooling down",
      "fault": "Fault",
      "temp": "Cabin",
      "target": "Target",
      "humidity": "Humidity",
      "power": "Heater",
      "energy": "Energy",
      "cost": "Cost",
      "turn_on": "Turn on",
      "turn_off": "Turn off",
      "overheat": "Too hot"
    },
    "de": {
      "name": "Sauna",
      "off": "Aus",
      "heating": "Heizt auf",
      "ready": "Bereit",
      "cooling": "Kühlt ab",
      "fault": "Störung",
      "temp": "Kabine",
      "target": "Soll",
      "humidity": "Feuchte",
      "power": "Ofen",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Einschalten",
      "turn_off": "Ausschalten",
      "overheat": "Zu heiß"
    },
    "fr": {
      "name": "Sauna",
      "off": "Arrêt",
      "heating": "Chauffe",
      "ready": "Prêt",
      "cooling": "Refroidissement",
      "fault": "Défaut",
      "temp": "Cabine",
      "target": "Consigne",
      "humidity": "Humidité",
      "power": "Poêle",
      "energy": "Énergie",
      "cost": "Coût",
      "turn_on": "Allumer",
      "turn_off": "Éteindre",
      "overheat": "Trop chaud"
    },
    "nb": {
      "name": "Badstue",
      "off": "Av",
      "heating": "Varmer opp",
      "ready": "Klar",
      "cooling": "Kjøler ned",
      "fault": "Feil",
      "temp": "Rom",
      "target": "Mål",
      "humidity": "Fuktighet",
      "power": "Ovn",
      "energy": "Energi",
      "cost": "Kostnad",
      "turn_on": "Slå på",
      "turn_off": "Slå av",
      "overheat": "For varmt"
    },
    "nl": {
      "name": "Sauna",
      "off": "Uit",
      "heating": "Opwarmen",
      "ready": "Klaar",
      "cooling": "Afkoelen",
      "fault": "Storing",
      "temp": "Cabine",
      "target": "Doel",
      "humidity": "Vochtigheid",
      "power": "Kachel",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Aanzetten",
      "turn_off": "Uitzetten",
      "overheat": "Te heet"
    },
    "ro": {
      "name": "Saună",
      "off": "Oprit",
      "heating": "Se încălzește",
      "ready": "Gata",
      "cooling": "Se răcește",
      "fault": "Defect",
      "temp": "Cabină",
      "target": "Țintă",
      "humidity": "Umiditate",
      "power": "Sobă",
      "energy": "Energie",
      "cost": "Cost",
      "turn_on": "Pornește",
      "turn_off": "Oprește",
      "overheat": "Prea cald"
    },
    "ru": {
      "name": "Сауна",
      "off": "Выкл.",
      "heating": "Нагрев",
      "ready": "Готово",
      "cooling": "Остывание",
      "fault": "Неисправность",
      "temp": "Кабина",
      "target": "Цель",
      "humidity": "Влажность",
      "power": "Нагреватель",
      "energy": "Энергия",
      "cost": "Стоимость",
      "turn_on": "Включить",
      "turn_off": "Выключить",
      "overheat": "Слишком горячо"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sn-heat-c:var(--appliance-heat-color,#ff8a3d);--sn-ok:var(--appliance-ok-color,#43a047);
  --sn-cold:var(--appliance-cold-color,#2b9af9);--sn-alert:var(--appliance-alert-color,#db4437);--heat:0;--tf:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--sn-heat-c) 22%,transparent);color:var(--sn-heat-c)}
.ready .badge{background:color-mix(in srgb,var(--sn-ok) 22%,transparent);color:var(--sn-ok)}
.cooling .badge{background:color-mix(in srgb,var(--sn-cold) 22%,transparent);color:var(--sn-cold)}
.fault .badge{background:color-mix(in srgb,var(--sn-alert) 22%,transparent);color:var(--sn-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--sn-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(250px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:120px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.sm{flex:0 0 40px}
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
.tile.bad .v{color:var(--sn-alert)}

/* ---- illustration ---- */
/* lueur du poêle et de la cabine : proportionnelle à --heat */
.glow{opacity:calc(var(--heat) * .9);transition:opacity 1.5s}
.stones{fill:#5e5a57;transition:fill 1.5s}
.heating .stones,.ready .stones{fill:#7a4a3a}
.ember{opacity:0;transform-box:fill-box;transform-origin:center}
.heating .ember,.ready .ember{opacity:calc(.35 + var(--heat) * .65);animation:snember 1.6s ease-in-out infinite alternate}
.ember:nth-child(2n){animation-delay:-.7s!important}.ember:nth-child(3n){animation-delay:-1.1s!important}
@keyframes snember{to{opacity:.25}}
/* ondes de chaleur au-dessus des pierres */
.wave{fill:none;stroke:#ffd9a0;stroke-width:1.4;stroke-linecap:round;opacity:0}
.heating .wave,.ready .wave{animation:snwave 2.4s ease-in infinite}
.wave:nth-child(2){animation-delay:-.8s!important}.wave:nth-child(3){animation-delay:-1.6s!important}
@keyframes snwave{0%{opacity:0;transform:translateY(0)}30%{opacity:.75}100%{opacity:0;transform:translateY(-34px)}}
/* vapeur au conduit du toit */
.steam{fill:#fff;opacity:0;transform-box:fill-box;transform-origin:center}
.heating .steam,.ready .steam{animation:snsteam 3.2s ease-out infinite}
.cooling .steam{animation:snsteam 5s ease-out infinite}
.steam:nth-child(2){animation-delay:-.8s!important}.steam:nth-child(3){animation-delay:-1.6s!important}.steam:nth-child(4){animation-delay:-2.4s!important}
@keyframes snsteam{0%{opacity:0;transform:translate(0,4px) scale(.4)}25%{opacity:.55}100%{opacity:0;transform:translate(10px,-34px) scale(2)}}
.cooling .steam{fill:#cfd8e0}
.lightbulb{opacity:0;transition:opacity .6s}
.heating .lightbulb,.ready .lightbulb{opacity:1}
.therm{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--tf));transition:transform 1.2s ease-out}
.led{fill:#5b6570}
.heating .led{fill:#ff8a3d;animation:snblink 1.2s steps(2) infinite}.ready .led{fill:#43a047}.cooling .led{fill:#3fa3ff}.fault .led{fill:#db4437;animation:snblink .6s steps(2) infinite}
@keyframes snblink{50%{opacity:.25}}
.dsp{fill:#ff9f43;font:700 9px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.off .dsp{fill:#5a6470}.fault .dsp{fill:#ff5a4e}
.off .glass{filter:brightness(.8)}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 260 190" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="snwood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8743b"/><stop offset=".5" stop-color="#d39457"/><stop offset="1" stop-color="#a9672f"/></linearGradient>
  <linearGradient id="snglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2420"/><stop offset="1" stop-color="#14110f"/></linearGradient>
  <radialGradient id="snglow" cx=".5" cy=".85" r=".8"><stop offset="0" stop-color="#ff9a3c" stop-opacity=".95"/><stop offset=".55" stop-color="#ff6a1f" stop-opacity=".4"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
  <linearGradient id="snroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d959c"/><stop offset="1" stop-color="#5d656c"/></linearGradient>
  <linearGradient id="snstove" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3f45"/><stop offset=".5" stop-color="#5b626a"/><stop offset="1" stop-color="#2c3136"/></linearGradient>
  <clipPath id="sndoor"><rect x="98" y="52" width="58" height="114" rx="3"/></clipPath>
 </defs>
 <ellipse cx="130" cy="180" rx="104" ry="6" fill="#000" opacity=".18"/>
 <!-- vapeur au conduit -->
 <g><ellipse class="steam" cx="196" cy="10" rx="7" ry="5"/><ellipse class="steam" cx="200" cy="8" rx="6" ry="4"/><ellipse class="steam" cx="193" cy="12" rx="8" ry="5"/><ellipse class="steam" cx="198" cy="9" rx="6" ry="4"/></g>
 <rect x="190" y="12" width="12" height="16" rx="1.5" fill="#6d757c"/><rect x="187" y="10" width="18" height="4" rx="1" fill="#4a5158"/>
 <!-- cabine en lames verticales -->
 <rect x="44" y="30" width="172" height="144" fill="url(#snwood)"/>
 <g stroke="#8a5528" stroke-width="1" opacity=".6"><path id="snslats"/></g>
 <rect x="44" y="30" width="172" height="144" fill="none" stroke="#7a4a22" stroke-width="1"/>
 <!-- toit en débord -->
 <rect x="34" y="22" width="192" height="10" rx="2" fill="url(#snroof)"/>
 <path d="M36 23 H224" stroke="#fff" stroke-width="1" opacity=".35"/>
 <!-- socle -->
 <rect x="38" y="172" width="184" height="7" rx="2" fill="#a7afb6"/>
 <!-- applique au-dessus de la porte -->
 <rect x="119" y="36" width="16" height="6" rx="2" fill="#3a3f45"/>
 <ellipse class="lightbulb" cx="127" cy="44" rx="16" ry="6" fill="#ffd27a" opacity=".6"/>
 <!-- porte vitrée : intérieur visible -->
 <rect x="94" y="48" width="66" height="122" rx="4" fill="#3a3f45"/>
 <g clip-path="url(#sndoor)" class="glass">
  <rect x="98" y="52" width="58" height="114" fill="url(#snglass)"/>
  <rect class="glow" x="80" y="52" width="94" height="114" fill="url(#snglow)"/>
  <!-- banquettes -->
  <rect x="98" y="96" width="58" height="6" fill="#6b4524" opacity=".85"/><rect x="98" y="122" width="58" height="6" fill="#6b4524" opacity=".85"/>
  <!-- poêle et pierres -->
  <rect x="112" y="138" width="30" height="28" rx="2" fill="url(#snstove)"/>
  <g class="stones"><circle cx="117" cy="137" r="5"/><circle cx="126" cy="135" r="6"/><circle cx="136" cy="137" r="5"/><circle cx="121" cy="131" r="4"/><circle cx="132" cy="131" r="4.5"/></g>
  <g fill="#ff7a2a"><circle class="ember" cx="119" cy="136" r="1.6"/><circle class="ember" cx="127" cy="133" r="1.8"/><circle class="ember" cx="134" cy="136" r="1.5"/><circle class="ember" cx="124" cy="139" r="1.3"/><circle class="ember" cx="131" cy="131" r="1.4"/></g>
  <g><path class="wave" d="M118 126 q3 -4 0 -8 t0 -8"/><path class="wave" d="M127 124 q3 -4 0 -8 t0 -8"/><path class="wave" d="M136 126 q3 -4 0 -8 t0 -8"/></g>
  <path d="M102 56 L118 56 L104 120 Z" fill="#fff" opacity=".07"/>
 </g>
 <rect x="98" y="52" width="58" height="114" rx="3" fill="none" stroke="#1d2125" stroke-width="1.5"/>
 <rect x="148" y="94" width="4" height="30" rx="2" fill="#c9a06a" stroke="#7a4a22" stroke-width=".6"/>
 <!-- thermomètre -->
 <rect x="62" y="62" width="14" height="86" rx="7" fill="#f3efe8" stroke="#7a4a22" stroke-width=".8"/>
 <rect x="67" y="68" width="4" height="70" rx="2" fill="#d9d2c6"/>
 <rect class="therm" x="67" y="68" width="4" height="70" rx="2" fill="#e53935"/>
 <circle cx="69" cy="141" r="4.5" fill="#e53935"/>
 <g stroke="#7a4a22" stroke-width=".7"><path d="M72 76 H75 M72 90 H75 M72 104 H75 M72 118 H75 M72 132 H75"/></g>
 <!-- panneau de commande -->
 <rect x="172" y="84" width="30" height="34" rx="4" fill="#1b1e22" stroke="#3a3f45"/>
 <rect x="176" y="89" width="22" height="13" rx="2" fill="#0d0f11"/>
 <text class="dsp" x="187" y="99" id="sndsp">--</text>
 <circle class="led" cx="181" cy="110" r="2.2"/><circle cx="193" cy="110" r="2.6" fill="#3a3f45" stroke="#6d757c" stroke-width=".6"/>
</svg>`;

  const TILES = [
    ['temp', 'mdi:thermometer', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['humidity', 'mdi:water-percent', 'show_humidity'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceSaunaCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity: f(/sauna/i, 'climate') || f(/sauna/i, 'switch'),
        entity_power: f(/sauna.*(power|puissance)/i, 'sensor'),
        entity_temp: f(/sauna.*temp/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_temp: true, show_humidity: true, show_power: true, show_energy: true, show_cost: true,
        target_temp: 80, ready_margin: 3, heater_threshold: 300, off_threshold: 5, temp_max: 110, temp_scale: 120, ...c };
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
    // consigne : attribut temperature d'une entité climate / water_heater, sinon valeur numérique de l'état
    _tgt(id) {
      const s = this._st(id);
      if (s && /^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return s.attributes && s.attributes.temperature != null && isFinite(t) ? t : NaN; }
      return this._num(id);
    }
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sntitle"></div><div class="badge" id="snbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="snalert"></div>
        <div class="ctl" id="snctl">
          <button class="sm" data-a="down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button class="sm" data-a="up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      // lames de bois verticales de part et d'autre de la porte
      let d = '';
      for (let x = 54; x < 216; x += 10) if (x < 94 || x > 160) d += `M${x} 32 V172 `;
      root.getElementById('snslats').setAttribute('d', d);
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity || this._c.entity_temp));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ temp: cc.entity_temp || cc.entity, target: cc.entity_target_temp || cc.entity, humidity: cc.entity_humidity, power: cc.entity_power,
          energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass, s = this._st(c.entity); if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'power') {
        if (d === 'climate') h.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: s && s.state !== 'off' ? 'off' : 'heat' });
        else h.callService('homeassistant', 'toggle', { entity_id: c.entity });
      } else if (d === 'climate' && s) {
        const a2 = s.attributes || {}, step = Number(a2.target_temp_step) || 1, cur = Number(a2.temperature);
        if (!isFinite(cur)) return;
        const lim = (v) => Math.max(Number(a2.min_temp) || -Infinity, Math.min(Number(a2.max_temp) || Infinity, v));
        h.callService('climate', 'set_temperature', { entity_id: c.entity, temperature: lim(cur + (a === 'up' ? step : -step)) });
      }
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), a = (s && s.attributes) || {};
      const pw = this._watts(c.entity_power);
      let temp = this._num(c.entity_temp);
      if (isNaN(temp) && isFinite(Number(a.current_temperature))) temp = Number(a.current_temperature);
      let target = this._tgt(c.entity_target_temp);
      if (isNaN(target) && isFinite(Number(a.temperature))) target = Number(a.temperature);
      if (isNaN(target)) target = Number(c.target_temp);
      const txt = s ? String(s.state).toLowerCase() : '';
      let on;
      if (/error|erreur|fault|défaut|defaut|alarm/.test(txt)) return { st: 'fault', pw, temp, target };
      if (s && !/^(unavailable|unknown)$/.test(txt)) on = !/^(off|false|0|arr[eê]t|éteint|eteint)$/.test(txt);
      else on = !isNaN(pw) && pw > Number(c.off_threshold);
      let st;
      if (!on) st = !isNaN(temp) && temp > 40 ? 'cooling' : 'off';
      else if (!isNaN(temp)) st = temp >= target - Number(c.ready_margin) ? 'ready' : 'heating';
      else if (a.hvac_action) st = /heat/.test(String(a.hvac_action)) ? 'heating' : 'ready';
      else st = !isNaN(pw) && pw < Number(c.heater_threshold) ? 'ready' : 'heating';
      return { st, pw, temp, target };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, temp, target } = this._compute();
      const clamp = (v) => Math.max(0, Math.min(1, v));
      const heat = !isNaN(temp) ? clamp((temp - 25) / Math.max(1, target - 25)) : ({ heating: 0.6, ready: 1, cooling: 0.3 }[st] || 0);
      card.className = `${st} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--heat', (st === 'off' || st === 'fault' ? 0 : heat).toFixed(3));
      card.style.setProperty('--tf', (isNaN(temp) ? 0 : clamp(temp / Number(c.temp_scale || 120))).toFixed(3));

      r.getElementById('sntitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('snbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('sndsp').textContent = st === 'off' ? 'OFF' : st === 'fault' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 0)}°` : 'ON';
      const hot = !isNaN(temp) && temp > Number(c.temp_max);
      const al = r.getElementById('snalert'); al.textContent = hot ? `${this._t('overheat')} (${this._fmt(temp, 0)} °C)` : ''; al.classList.toggle('on', hot);

      // commandes : marche/arrêt, et consigne ± seulement pour une entité climate
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('snctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['climate', 'switch', 'input_boolean'].includes(d));
      const isOn = st === 'heating' || st === 'ready';
      ctl.querySelector('[data-a="power"] span').textContent = this._t(isOn ? 'turn_off' : 'turn_on');
      ctl.querySelectorAll('.sm').forEach((b) => b.classList.toggle('hide', d !== 'climate'));

      const energy = this._num(c.entity_energy), hum = this._num(c.entity_humidity);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        temp: [!isNaN(temp), this._fmt(temp, 0), '°C'],
        target: [!isNaN(target), this._fmt(target, 0), '°C'],
        humidity: [c.entity_humidity, this._fmt(hum, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'temp' && hot);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSaunaCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSaunaCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, unit) => ({ name, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_humidity', 'sensor'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { type: 'grid', name: '', schema: [
          num('target_temp', 40, 120, 1, '°C'), num('ready_margin', 0, 20, 0.5, '°C'),
          num('heater_threshold', 0, 15000, 10, 'W'), num('off_threshold', 0, 500, 0.5, 'W'),
          num('temp_max', 60, 140, 1, '°C'), num('temp_scale', 60, 150, 1, '°C'),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_temp'), bool('show_humidity'),
          bool('show_power'), bool('show_energy'), bool('show_cost'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSaunaCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Sauna',
    description: 'Cabine de sauna animée : lueur du poêle selon la température, ondes de chaleur, vapeur, thermomètre, consommation.', preview: true,
  });
})();

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

  const T = {
    "en": {
      "water_pump": "Water pump",
      "industrial_pump": "Industrial pump",
      "off": "Off",
      "running": "Running",
      "warning": "Warning",
      "fault": "Fault",
      "unavailable": "Unavailable",
      "flow": "Flow",
      "pressure": "Pressure",
      "power": "Power",
      "temp": "Motor",
      "level": "Tank",
      "runtime": "Runtime",
      "energy": "Energy",
      "cost": "Cost",
      "turn_on": "Turn on",
      "turn_off": "Turn off",
      "no_flow": "No flow: running dry?",
      "overpressure": "Overpressure",
      "overheat": "Motor too hot",
      "low_level": "Low level",
      "sump_pump": "Sump pump",
      "alarm": "High level",
      "high_level": "High water level",
      "pit": "Pit",
      "starts": "Starts"
    },
    "de": {
      "water_pump": "Wasserpumpe",
      "industrial_pump": "Industriepumpe",
      "off": "Aus",
      "running": "Läuft",
      "warning": "Warnung",
      "fault": "Störung",
      "unavailable": "Nicht verfügbar",
      "flow": "Durchfluss",
      "pressure": "Druck",
      "power": "Leistung",
      "temp": "Motor",
      "level": "Behälter",
      "runtime": "Laufzeit",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Einschalten",
      "turn_off": "Ausschalten",
      "no_flow": "Kein Durchfluss: Trockenlauf?",
      "overpressure": "Überdruck",
      "overheat": "Motor zu heiß",
      "low_level": "Niedriger Füllstand",
      "sump_pump": "Hebeanlage",
      "alarm": "Hochwasser",
      "high_level": "Wasserstand zu hoch",
      "pit": "Schacht",
      "starts": "Starts"
    },
    "fr": {
      "water_pump": "Pompe à eau",
      "industrial_pump": "Pompe industrielle",
      "off": "Arrêt",
      "running": "En marche",
      "warning": "Alerte",
      "fault": "Défaut",
      "unavailable": "Indisponible",
      "flow": "Débit",
      "pressure": "Pression",
      "power": "Puissance",
      "temp": "Moteur",
      "level": "Réservoir",
      "runtime": "Fonctionnement",
      "energy": "Énergie",
      "cost": "Coût",
      "turn_on": "Démarrer",
      "turn_off": "Arrêter",
      "no_flow": "Pas de débit : marche à sec ?",
      "overpressure": "Surpression",
      "overheat": "Moteur trop chaud",
      "low_level": "Niveau bas",
      "sump_pump": "Pompe de relevage",
      "alarm": "Niveau haut",
      "high_level": "Niveau d'eau trop haut",
      "pit": "Fosse",
      "starts": "Démarrages"
    },
    "nb": {
      "water_pump": "Vannpumpe",
      "industrial_pump": "Industripumpe",
      "off": "Av",
      "running": "Går",
      "warning": "Advarsel",
      "fault": "Feil",
      "unavailable": "Utilgjengelig",
      "flow": "Gjennomstrømning",
      "pressure": "Trykk",
      "power": "Effekt",
      "temp": "Motor",
      "level": "Tank",
      "runtime": "Driftstid",
      "energy": "Energi",
      "cost": "Kostnad",
      "turn_on": "Slå på",
      "turn_off": "Slå av",
      "no_flow": "Ingen gjennomstrømning: tørrkjøring?",
      "overpressure": "Overtrykk",
      "overheat": "Motoren er for varm",
      "low_level": "Lavt nivå",
      "sump_pump": "Lensepumpe",
      "alarm": "Høyt nivå",
      "high_level": "For høyt vannivå",
      "pit": "Kum",
      "starts": "Starter"
    },
    "nl": {
      "water_pump": "Waterpomp",
      "industrial_pump": "Industriële pomp",
      "off": "Uit",
      "running": "Draait",
      "warning": "Waarschuwing",
      "fault": "Storing",
      "unavailable": "Niet beschikbaar",
      "flow": "Debiet",
      "pressure": "Druk",
      "power": "Vermogen",
      "temp": "Motor",
      "level": "Tank",
      "runtime": "Looptijd",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Aanzetten",
      "turn_off": "Uitzetten",
      "no_flow": "Geen debiet: drooglopen?",
      "overpressure": "Overdruk",
      "overheat": "Motor te heet",
      "low_level": "Laag niveau",
      "sump_pump": "Dompelpomp",
      "alarm": "Hoog niveau",
      "high_level": "Waterniveau te hoog",
      "pit": "Put",
      "starts": "Starts"
    },
    "ro": {
      "water_pump": "Pompă de apă",
      "industrial_pump": "Pompă industrială",
      "off": "Oprită",
      "running": "Pornită",
      "warning": "Avertizare",
      "fault": "Defect",
      "unavailable": "Indisponibil",
      "flow": "Debit",
      "pressure": "Presiune",
      "power": "Putere",
      "temp": "Motor",
      "level": "Rezervor",
      "runtime": "Funcționare",
      "energy": "Energie",
      "cost": "Cost",
      "turn_on": "Pornește",
      "turn_off": "Oprește",
      "no_flow": "Fără debit: funcționare în gol?",
      "overpressure": "Suprapresiune",
      "overheat": "Motor prea fierbinte",
      "low_level": "Nivel scăzut",
      "sump_pump": "Pompă de drenaj",
      "alarm": "Nivel ridicat",
      "high_level": "Nivel prea ridicat al apei",
      "pit": "Bazin",
      "starts": "Porniri"
    },
    "ru": {
      "water_pump": "Водяной насос",
      "industrial_pump": "Промышленный насос",
      "off": "Выкл.",
      "running": "Работает",
      "warning": "Предупреждение",
      "fault": "Неисправность",
      "unavailable": "Недоступно",
      "flow": "Поток",
      "pressure": "Давление",
      "power": "Мощность",
      "temp": "Двигатель",
      "level": "Резервуар",
      "runtime": "Наработка",
      "energy": "Энергия",
      "cost": "Стоимость",
      "turn_on": "Включить",
      "turn_off": "Выключить",
      "no_flow": "Нет потока: работа на сухую?",
      "overpressure": "Избыточное давление",
      "overheat": "Двигатель перегрет",
      "low_level": "Низкий уровень",
      "sump_pump": "Дренажный насос",
      "alarm": "Высокий уровень",
      "high_level": "Высокий уровень воды",
      "pit": "Приямок",
      "starts": "Пуски"
    }
  };
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
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_flow: true, show_pressure: true, show_power: true, show_temp: true, show_level: true,
        show_runtime: true, show_starts: true, show_energy: true, show_cost: true, no_flow_threshold: 0.5, ...KINDS[this.kind].d, ...c };
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
      const temp = this._num(c.entity_temp), level = this._num(c.entity_level);
      const txt = s ? String(s.state).toLowerCase() : '';
      const fault = this._st(c.entity_fault);
      const v = { pw, flow, pres, temp, level, alerts: [] };
      if ((fault && fault.state === 'on') || /error|erreur|fault|défaut|defaut|alarm|trip/.test(txt)) return { ...v, st: 'fault' };
      let on;
      if (s && !/^(unavailable|unknown)$/.test(txt)) on = !/^(off|false|0|arr[eê]t|éteint|eteint|idle|stopped)$/.test(txt);
      else if (!isNaN(pw)) on = pw > Number(c.run_threshold);
      else if (!isNaN(flow)) on = flow > Number(c.no_flow_threshold);
      else return { ...v, st: c.entity || c.entity_power ? 'unavailable' : 'off' };
      // alertes : marche à sec (pas de débit), surpression, moteur trop chaud, niveau bas
      if (on && !isNaN(flow) && flow < Number(c.no_flow_threshold)) v.alerts.push('no_flow');
      if (!isNaN(pres) && pres > Number(c.pressure_max)) v.alerts.push('overpressure');
      if (!isNaN(temp) && temp > Number(c.temp_max)) v.alerts.push('overheat');
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
      const { st, pw, flow, pres, temp, level, alerts } = this._compute();
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
        temp: [c.entity_temp, this._fmt(temp, 0), this._unit(c.entity_temp, '°C')],
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
          num('max_pressure', 1, 100, 0.5, 'bar'), num('pressure_max', 0, 100, 0.1, 'bar'), num('temp_max', 20, 150, 1, '°C'), KINDS[this.kind].sump ? num('level_max', 0, 100, 1, '%') : num('level_min', 0, 100, 1, '%'),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
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

/* Carte « Robot de piscine » — custom:appliance-pool-robot-card
 * Bassin vu en coupe : margelle, carrelage, eau avec vagues en surface et reflets au fond.
 * Le robot (coque, chenilles, brosse avant, câble flottant) fait des allers-retours sur le fond
 * en nettoyant : chenilles et brosse tournent, débris aspirés, bulles. Le niveau d'eau suit
 * entity_water_level (repère « min » sur la paroi), la jauge du filtre sur la coque suit
 * entity_filter (saturation, 0 → 100 %).
 * États : cleaning, paused, returning, idle, error, unavailable. Entité vacuum (Démarrer / Pause /
 * Remonter), switch / input_boolean (Marche / Arrêt) ou sensor texte. Les deux se combinent :
 * entity_switch = prise connectée qui alimente le robot (bouton Marche / Arrêt en plus).
 */
(() => {
  const TAG = 'appliance-pool-robot-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Pool robot",
      "cleaning": "Cleaning",
      "paused": "Paused",
      "returning": "Coming up",
      "idle": "Idle",
      "error": "Error",
      "unavailable": "Unavailable",
      "start": "Start",
      "pause": "Pause",
      "dock": "Bring up",
      "turn_on": "Turn on",
      "turn_off": "Turn off",
      "status": "Status",
      "filter": "Filter",
      "water_level": "Water level",
      "water_temp": "Water",
      "time": "Remaining",
      "battery": "Battery",
      "mode": "Mode",
      "power": "Power",
      "energy": "Energy",
      "filter_full": "Filter needs cleaning",
      "low_water": "Low water level"
    },
    "de": {
      "name": "Poolroboter",
      "cleaning": "Reinigt",
      "paused": "Pausiert",
      "returning": "Kommt hoch",
      "idle": "Bereit",
      "error": "Fehler",
      "unavailable": "Nicht verfügbar",
      "start": "Start",
      "pause": "Pause",
      "dock": "Hochholen",
      "turn_on": "Einschalten",
      "turn_off": "Ausschalten",
      "status": "Status",
      "filter": "Filter",
      "water_level": "Wasserstand",
      "water_temp": "Wasser",
      "time": "Restzeit",
      "battery": "Akku",
      "mode": "Modus",
      "power": "Leistung",
      "energy": "Energie",
      "filter_full": "Filter reinigen",
      "low_water": "Niedriger Wasserstand"
    },
    "fr": {
      "name": "Robot de piscine",
      "cleaning": "Nettoyage",
      "paused": "En pause",
      "returning": "Remontée",
      "idle": "Au repos",
      "error": "Erreur",
      "unavailable": "Indisponible",
      "start": "Démarrer",
      "pause": "Pause",
      "dock": "Remonter",
      "turn_on": "Démarrer",
      "turn_off": "Arrêter",
      "status": "État",
      "filter": "Filtre",
      "water_level": "Niveau d'eau",
      "water_temp": "Eau",
      "time": "Restant",
      "battery": "Batterie",
      "mode": "Mode",
      "power": "Puissance",
      "energy": "Énergie",
      "filter_full": "Filtre à nettoyer",
      "low_water": "Niveau d'eau bas"
    },
    "nb": {
      "name": "Bassengrobot",
      "cleaning": "Rengjør",
      "paused": "Pause",
      "returning": "Kommer opp",
      "idle": "Inaktiv",
      "error": "Feil",
      "unavailable": "Utilgjengelig",
      "start": "Start",
      "pause": "Pause",
      "dock": "Hent opp",
      "turn_on": "Slå på",
      "turn_off": "Slå av",
      "status": "Status",
      "filter": "Filter",
      "water_level": "Vannstand",
      "water_temp": "Vann",
      "time": "Gjenstår",
      "battery": "Batteri",
      "mode": "Modus",
      "power": "Effekt",
      "energy": "Energi",
      "filter_full": "Filteret må rengjøres",
      "low_water": "Lav vannstand"
    },
    "nl": {
      "name": "Zwembadrobot",
      "cleaning": "Reinigen",
      "paused": "Gepauzeerd",
      "returning": "Komt boven",
      "idle": "Inactief",
      "error": "Fout",
      "unavailable": "Niet beschikbaar",
      "start": "Start",
      "pause": "Pauze",
      "dock": "Naar boven",
      "turn_on": "Aanzetten",
      "turn_off": "Uitzetten",
      "status": "Status",
      "filter": "Filter",
      "water_level": "Waterniveau",
      "water_temp": "Water",
      "time": "Resterend",
      "battery": "Batterij",
      "mode": "Modus",
      "power": "Vermogen",
      "energy": "Energie",
      "filter_full": "Filter reinigen",
      "low_water": "Laag waterniveau"
    },
    "ro": {
      "name": "Robot de piscină",
      "cleaning": "Curățare",
      "paused": "În pauză",
      "returning": "Urcă",
      "idle": "Inactiv",
      "error": "Eroare",
      "unavailable": "Indisponibil",
      "start": "Pornește",
      "pause": "Pauză",
      "dock": "Ridică",
      "turn_on": "Pornește",
      "turn_off": "Oprește",
      "status": "Stare",
      "filter": "Filtru",
      "water_level": "Nivel apă",
      "water_temp": "Apă",
      "time": "Rămas",
      "battery": "Baterie",
      "mode": "Mod",
      "power": "Putere",
      "energy": "Energie",
      "filter_full": "Filtrul trebuie curățat",
      "low_water": "Nivel scăzut al apei"
    },
    "ru": {
      "name": "Робот для бассейна",
      "cleaning": "Уборка",
      "paused": "Пауза",
      "returning": "Всплытие",
      "idle": "Простой",
      "error": "Ошибка",
      "unavailable": "Недоступно",
      "start": "Старт",
      "pause": "Пауза",
      "dock": "Поднять",
      "turn_on": "Включить",
      "turn_off": "Выключить",
      "status": "Статус",
      "filter": "Фильтр",
      "water_level": "Уровень воды",
      "water_temp": "Вода",
      "time": "Осталось",
      "battery": "Батарея",
      "mode": "Режим",
      "power": "Мощность",
      "energy": "Энергия",
      "filter_full": "Фильтр требует очистки",
      "low_water": "Низкий уровень воды"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--pr-ok:var(--appliance-ok-color,#43a047);--pr-cold:var(--appliance-cold-color,#2b9af9);
  --pr-warn:#ffa31a;--pr-alert:var(--appliance-alert-color,#db4437);--wl:.85;--dirt:0;--pr-water:#2fa6d9}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.cleaning .badge{background:color-mix(in srgb,var(--pr-ok) 22%,transparent);color:var(--pr-ok)}
.returning .badge,.paused .badge{background:color-mix(in srgb,var(--pr-cold) 22%,transparent);color:var(--pr-cold)}
.error .badge{background:color-mix(in srgb,var(--pr-alert) 22%,transparent);color:var(--pr-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pr-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(280px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:120px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.on{background:var(--primary-color,#03a9f4);color:#fff}
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
.tile.bad .v{color:var(--pr-alert)}

/* ---- eau : la surface descend avec le niveau, vagues permanentes ---- */
.water{transform:translateY(calc((1 - var(--wl)) * 60px));transition:transform 1.2s ease-out}
.wave{animation:prwave 5s linear infinite}.wave.b{animation-duration:3.4s;animation-direction:reverse}
@keyframes prwave{to{transform:translateX(-32px)}}
.caus{fill:none;stroke:#fff;stroke-width:1.2;stroke-linecap:round;opacity:.15;animation:prcaus 3s ease-in-out infinite alternate}
.caus:nth-of-type(2n){animation-delay:-1.5s}
@keyframes prcaus{to{opacity:.4}}
/* ---- robot : allers-retours sur le fond, demi-tour à chaque paroi ---- */
.drive{transform:translateX(0)}
.flip{transform-box:view-box;transform-origin:72px 150px}
.cleaning .drive{animation:prdrive 14s ease-in-out infinite}
.cleaning .flip{animation:prflip 14s linear infinite}
.returning .drive{animation:prdrive 22s ease-in-out infinite}
.returning .flip{animation:prflip 22s linear infinite}
@keyframes prdrive{0%,4%{transform:translateX(0)}46%,54%{transform:translateX(136px)}96%,100%{transform:translateX(0)}}
@keyframes prflip{0%,49.9%{transform:scaleX(1)}50%,99.9%{transform:scaleX(-1)}}
.error .bot{transform-box:view-box;transform-origin:72px 160px;animation:prshake .35s ease-in-out infinite}
@keyframes prshake{25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
.tread{fill:none;stroke:#5a636b;stroke-width:3;stroke-dasharray:3 3}
.cleaning .tread,.returning .tread{animation:prtread .3s linear infinite}
@keyframes prtread{to{stroke-dashoffset:-6}}
.brush{transform:rotate(0)}
.cleaning .brush{animation:prspin .35s linear infinite}
@keyframes prspin{to{transform:rotate(-360deg)}}
.bub{fill:#fff;opacity:0}
.cleaning .bub{animation:prbub 2.2s ease-in infinite}
.bub:nth-of-type(2){animation-delay:-.7s!important}.bub:nth-of-type(3){animation-delay:-1.4s!important}.bub:nth-of-type(4){animation-delay:-1.9s!important}
@keyframes prbub{0%{opacity:0;transform:translateY(0)}15%{opacity:.8}100%{opacity:0;transform:translateY(-70px)}}
.deb{opacity:0}
.cleaning .deb{animation:prdeb 1.1s ease-in infinite}
.deb:nth-of-type(2){animation-delay:-.4s!important}.deb:nth-of-type(3){animation-delay:-.8s!important}
@keyframes prdeb{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(-14px,-2px) scale(.4)}}
/* jauge du filtre sur la coque : se remplit avec --dirt, vire à l'orange puis au rouge */
.dirt{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--dirt));transition:transform 1s,fill .6s;fill:#8d6e4a}
.full .dirt{fill:var(--pr-alert)}
.led{fill:#59636c}
.cleaning .led{fill:#3ddc5a;animation:prblink 1.6s ease-in-out infinite}
.returning .led,.paused .led{fill:#3fa3ff}
.error .led{fill:#ff3b30;animation:prblink .5s steps(2) infinite}
@keyframes prblink{50%{opacity:.3}}
.mark{fill:var(--pr-alert);font:600 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.low .mark{animation:prblink 1s steps(2) infinite}
.noanim *{animation:none!important}
`;

  const SVG = (label) => {
    const wave = (y, h) => `M-10 ${y} q8 -3.5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 V${y + h} H-10 Z`;
    const tiles = Array.from({ length: 16 }, (_, i) => `M${30 + i * 15} 162 V170`).join(' ') + ' ' + Array.from({ length: 8 }, (_, i) => `M8 ${42 + i * 15} H18 M262 ${42 + i * 15} H272`).join(' ');
    return `
<svg viewBox="0 0 280 184" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="prw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pr-water)" stop-opacity=".55"/><stop offset="1" stop-color="#0c5f8a" stop-opacity=".9"/></linearGradient>
  <linearGradient id="prshell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#dfe5ea"/><stop offset="1" stop-color="#b6c0c8"/></linearGradient>
  <clipPath id="prpool"><rect x="18" y="30" width="244" height="132"/></clipPath>
 </defs>
 <ellipse cx="140" cy="178" rx="136" ry="4" fill="#000" opacity=".15"/>
 <!-- bassin : parois et fond carrelés, margelle -->
 <rect x="8" y="30" width="264" height="140" rx="3" fill="#dfe8ee"/>
 <rect x="18" y="30" width="244" height="132" fill="#eaf4f8"/>
 <path d="${tiles}" stroke="#b9cbd6" stroke-width="1"/>
 <rect x="2" y="24" width="276" height="8" rx="2" fill="#c8cdd1"/>
 <g clip-path="url(#prpool)">
  <g class="water">
   <path class="wave b" d="${wave(46, 130)}" fill="url(#prw)" opacity=".55"/>
   <path class="wave" d="${wave(48, 130)}" fill="url(#prw)"/>
  </g>
  <path class="caus" d="M40 150 q10 -4 20 0 t20 0"/><path class="caus" d="M110 154 q10 -4 20 0 t20 0"/><path class="caus" d="M180 150 q10 -4 20 0 t20 0"/>
 </g>
 <!-- repère de niveau minimum sur la paroi droite -->
 <path id="prmin" d="M250 0 H262" stroke="var(--pr-alert)" stroke-width="1.2" stroke-dasharray="2 1.5"/>
 <text class="mark" id="prmint" x="248" y="0" text-anchor="end">min</text>
 <!-- robot -->
 <g class="drive"><g class="flip"><g class="bot">
  <!-- câble flottant vers la surface -->
  <path d="M72 126 C70 104 96 96 92 74 S104 50 110 40" fill="none" stroke="#2a3138" stroke-width="1.6" stroke-linecap="round"/>
  <!-- bulles -->
  <circle class="bub" cx="64" cy="124" r="1.8"/><circle class="bub" cx="78" cy="122" r="1.4"/><circle class="bub" cx="70" cy="126" r="2.2"/><circle class="bub" cx="84" cy="125" r="1.2"/>
  <!-- débris aspirés devant la brosse -->
  <g fill="#7a5b3a"><rect class="deb" x="112" y="156" width="3" height="2" rx="1"/><circle class="deb" cx="118" cy="157" r="1.3"/><rect class="deb" x="122" y="155.5" width="2.5" height="2.5" rx=".8"/></g>
  <!-- chenilles -->
  <rect x="38" y="146" width="68" height="15" rx="7.5" fill="#2a3138"/>
  <rect class="tread" x="39.5" y="147.5" width="65" height="12" rx="6"/>
  <circle cx="46" cy="153.5" r="4" fill="#4a535b"/><circle cx="98" cy="153.5" r="4" fill="#4a535b"/>
  <!-- coque -->
  <path d="M36 148 V136 Q36 122 52 120 H92 Q108 122 108 136 V148 Z" fill="url(#prshell)" stroke="#9aa6b0"/>
  <rect x="36" y="140" width="72" height="5" fill="#1e7fd0"/>
  <!-- poignée -->
  <path d="M52 120 V112 Q52 106 58 106 H86 Q92 106 92 112 V120" fill="none" stroke="#9aa6b0" stroke-width="4" stroke-linecap="round"/>
  <!-- jauge du filtre (saleté) -->
  <rect x="45" y="125" width="9" height="13" rx="2" fill="#f4f7f9" stroke="#9aa6b0" stroke-width=".8"/>
  <rect class="dirt" x="46.5" y="126.5" width="6" height="10" rx="1"/>
  <circle class="led" cx="98" cy="128" r="2.3"/>
  <!-- brosse avant -->
  <g transform="translate(108 152)"><g class="brush"><circle r="7" fill="#1e7fd0"/>
   <path d="M-7 0 H7 M0 -7 V7 M-5 -5 L5 5 M-5 5 L5 -5" stroke="#bfe3ff" stroke-width="1.4"/><circle r="2" fill="#0f3e66"/></g></g>
 </g></g></g>
</svg>`;
  };

  const TILES = [
    ['status', 'mdi:robot-vacuum', 'show_status_tile'],
    ['filter', 'mdi:filter-variant', 'show_filter'],
    ['water_level', 'mdi:waves', 'show_water_level'],
    ['water_temp', 'mdi:pool-thermometer', 'show_water_temp'],
    ['time', 'mdi:timer-sand', 'show_time'],
    ['battery', 'mdi:battery', 'show_battery'],
    ['mode', 'mdi:format-list-bulleted', 'show_mode'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
  ];

  class AppliancePoolRobotCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const re = /pool.?robot|robot.?piscine|dolphin|zodiac|piscine|pool/i;
      const f = (r, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && r.test(i)) || '';
      return {
        entity: f(re, 'vacuum') || f(re, 'switch'),
        entity_switch: f(re, 'vacuum') ? f(re, 'switch') : '',
        entity_filter: f(/(pool|piscine|robot|dolphin).*filt/i, 'sensor'),
        entity_water_temp: f(/(pool|piscine).*(temp)/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_status_tile: true, show_filter: true, show_water_level: true, show_water_temp: true,
        show_time: true, show_battery: true, show_mode: true, show_power: true, show_energy: true,
        filter_alert: 80, water_level_full: 100, water_level_min: 70, run_threshold: 30, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // durée restante en minutes, quelle que soit l'unité du capteur (s, min, h)
    _minutes(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 'min').toLowerCase();
      return u === 's' ? v / 60 : u === 'h' ? v * 60 : v;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="prtitle"></div><div class="badge" id="prbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="pralert"></div>
        <div class="ctl" id="prctl">
          <button data-a="start"><ha-icon icon="mdi:play"></ha-icon><span></span></button>
          <button data-a="pause"><ha-icon icon="mdi:pause"></ha-icon><span></span></button>
          <button data-a="dock"><ha-icon icon="mdi:arrow-collapse-up"></ha-icon><span></span></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ status: cc.entity_status || cc.entity, filter: cc.entity_filter, water_level: cc.entity_water_level, water_temp: cc.entity_water_temp,
          time: cc.entity_time, battery: cc.entity_battery || cc.entity, mode: cc.entity_mode, power: cc.entity_power, energy: cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h || !(c.entity || c.entity_switch)) return;
      if (a === 'power') { h.callService('homeassistant', 'toggle', { entity_id: this._plug() }); return; }
      if (!c.entity) return;
      h.callService('vacuum', { start: 'start', pause: 'pause', dock: 'return_to_base' }[a], { entity_id: c.entity });
    }

    // prise qui alimente le robot : entity_switch, sinon l'entité principale si c'est un switch
    _plug() {
      const c = this._c;
      if (c.entity_switch) return c.entity_switch;
      return ['switch', 'input_boolean'].includes((c.entity || '').split('.')[0]) ? c.entity : '';
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const pw = this._watts(c.entity_power);
      // prise coupée = robot hors tension, même si l'entité vacuum est devenue indisponible
      const plug = c.entity_switch && this._st(c.entity_switch);
      if (plug && plug.state === 'off') return 'idle';
      if (!s && plug && plug.state === 'on') return !isNaN(pw) && pw <= Number(c.run_threshold) ? 'idle' : 'cleaning';
      const txt = String((this._st(c.entity_status) || {}).state || (s && s.state) || '').toLowerCase();
      if (!s && isNaN(pw)) return 'unavailable';
      if (s && /^(unavailable|unknown)$/.test(s.state) && isNaN(pw)) return 'unavailable';
      if (/error|erreur|fault|défaut|defaut|stuck|bloqu/.test(txt)) return 'error';
      if (/pause/.test(txt)) return 'paused';
      if (/return|retour|remont|waterline|ligne|pickup/.test(txt)) return 'returning';
      if (/clean|nettoy|running|^on$|marche|working/.test(txt)) return 'cleaning';
      if (/^(off|idle|docked|stopped|finished|done|ready|arr[eê]t|termin)/.test(txt)) return 'idle';
      return !isNaN(pw) && pw > Number(c.run_threshold) ? 'cleaning' : 'idle';
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const st = this._compute(), clamp = (x) => Math.max(0, Math.min(1, x));
      const s = this._st(c.entity), attr = (s && s.attributes) || {};
      const filter = this._num(c.entity_filter), lvl = this._num(c.entity_water_level), temp = this._num(c.entity_water_temp);
      const time = this._minutes(c.entity_time), pw = this._watts(c.entity_power), energy = this._num(c.entity_energy);
      let batt = this._num(c.entity_battery); if (isNaN(batt) && isFinite(Number(attr.battery_level))) batt = Number(attr.battery_level);
      const full = Number(c.water_level_full) || 100;
      const filterFull = !isNaN(filter) && filter >= Number(c.filter_alert);
      const low = !isNaN(lvl) && lvl < Number(c.water_level_min);

      card.className = `${st}${filterFull ? ' full' : ''}${low ? ' low' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--wl', (isNaN(lvl) ? 0.85 : clamp(lvl / full)).toFixed(3));
      card.style.setProperty('--dirt', (isNaN(filter) ? 0 : clamp(filter / 100)).toFixed(3));
      // repère « min » : surface d'eau quand le niveau vaut water_level_min (même formule que .water)
      const ymin = 48 + (1 - clamp(Number(c.water_level_min) / full)) * 60;
      r.getElementById('prmin').setAttribute('d', `M250 ${ymin.toFixed(1)} H262`);
      r.getElementById('prmint').setAttribute('y', (ymin + 2.5).toFixed(1));
      r.getElementById('prmin').style.display = r.getElementById('prmint').style.display = c.entity_water_level ? '' : 'none';

      r.getElementById('prtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('prbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const alerts = [];
      if (st === 'error') alerts.push(attr.error ? String(attr.error) : this._t('error'));
      if (filterFull) alerts.push(this._t('filter_full'));
      if (low) alerts.push(this._t('low_water'));
      const al = r.getElementById('pralert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);

      // commandes : vacuum = Démarrer / Pause / Remonter, prise (switch) = Marche / Arrêt, les deux si entity_switch
      const d = (c.entity || '').split('.')[0], vac = d === 'vacuum', plugId = this._plug();
      const plugOn = plugId && (this._st(plugId) || {}).state === 'on';
      const ctl = r.getElementById('prctl');
      ctl.classList.toggle('hide', c.show_controls === false || (!vac && !plugId));
      const active = { cleaning: 'start', paused: 'pause', returning: 'dock' }[st];
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.classList.toggle('hide', a === 'power' ? !plugId : !vac);
        b.classList.toggle('on', a === 'power' ? !!(plugOn && vac) : vac && a === active);
        b.querySelector('span').textContent = this._t(a === 'power' ? (plugOn ? 'turn_off' : 'turn_on') : a);
      });

      const mode = this._st(c.entity_mode);
      const V = {
        status: [true, this._t(st), ''],
        filter: [c.entity_filter, this._fmt(filter, 0), this._unit(c.entity_filter, '%')],
        water_level: [c.entity_water_level, this._fmt(lvl, 0), this._unit(c.entity_water_level, '%')],
        water_temp: [c.entity_water_temp, this._fmt(temp, 1), this._unit(c.entity_water_temp, '°C')],
        time: [c.entity_time, isNaN(time) ? '--' : time >= 60 ? `${Math.floor(time / 60)} h ${String(Math.round(time % 60)).padStart(2, '0')}` : this._fmt(time, 0), isNaN(time) || time >= 60 ? '' : 'min'],
        battery: [c.entity_battery || isFinite(Number(attr.battery_level)), this._fmt(batt, 0), '%'],
        mode: [c.entity_mode, mode ? String(mode.state) : '--', ''],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), 'W'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
      };
      const bad = { filter: filterFull, water_level: low };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, AppliancePoolRobotCard);

  /* ---- éditeur visuel ---- */
  class AppliancePoolRobotCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box' } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_switch'), ent('entity_status', 'sensor'), ent('entity_filter', 'sensor'), ent('entity_water_level', 'sensor'),
        ent('entity_water_temp', 'sensor'), ent('entity_time', 'sensor'), ent('entity_battery', 'sensor'), ent('entity_mode'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { type: 'grid', name: '', schema: [
          num('filter_alert', 0, 100, 1, 80), num('water_level_min', 0, 1000, 1, 70), num('water_level_full', 1, 1000, 1, 100), num('run_threshold', 0, 2000, 1, 30),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_status_tile'), bool('show_filter'), bool('show_water_level'), bool('show_water_temp'),
          bool('show_time'), bool('show_battery'), bool('show_mode'), bool('show_power'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', AppliancePoolRobotCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Pool robot / Robot de piscine',
    description: 'Robot nettoyeur de piscine animé : allers-retours sur le fond, brosse, bulles, jauge du filtre, niveau d\'eau, commandes.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();

/* Carte « Onduleur » — custom:appliance-ups-card
 * Prise murale → onduleur tour → box et NAS protégés. Le courant circule dans les câbles ;
 * sur batterie, le secteur s'éteint (éclair barré), l'écran passe à l'orange, l'onduleur bipe
 * et le courant part de la batterie. La batterie visible sur le flanc suit la charge (--bat),
 * la barre de LED suit la charge connectée (--load).
 * États : online, charging, on_battery, low_battery, offline, unavailable. Lit le statut de
 * l'intégration NUT (codes « OL », « OB », « LB », « CHRG », « RB », « OVER » ou texte « Online »,
 * « On Battery »…), un binary_sensor (on = secteur présent) ou, à défaut, la tension d'entrée.
 */
(() => {
  const TAG = 'appliance-ups-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "UPS",
      "online": "On mains",
      "charging": "Charging",
      "on_battery": "On battery",
      "low_battery": "Low battery",
      "offline": "Off",
      "unavailable": "Unavailable",
      "charge": "Battery",
      "runtime": "Runtime",
      "load": "Load",
      "power": "Power",
      "input": "Input",
      "output": "Output",
      "energy": "Energy",
      "overload": "Overload",
      "replace_battery": "Replace the battery"
    },
    "de": {
      "name": "USV",
      "online": "Netzbetrieb",
      "charging": "Lädt",
      "on_battery": "Batteriebetrieb",
      "low_battery": "Batterie schwach",
      "offline": "Aus",
      "unavailable": "Nicht verfügbar",
      "charge": "Batterie",
      "runtime": "Laufzeit",
      "load": "Last",
      "power": "Leistung",
      "input": "Eingang",
      "output": "Ausgang",
      "energy": "Energie",
      "overload": "Überlast",
      "replace_battery": "Batterie ersetzen"
    },
    "fr": {
      "name": "Onduleur",
      "online": "Sur secteur",
      "charging": "En charge",
      "on_battery": "Sur batterie",
      "low_battery": "Batterie faible",
      "offline": "Éteint",
      "unavailable": "Indisponible",
      "charge": "Batterie",
      "runtime": "Autonomie",
      "load": "Charge",
      "power": "Puissance",
      "input": "Entrée",
      "output": "Sortie",
      "energy": "Énergie",
      "overload": "Surcharge",
      "replace_battery": "Batterie à remplacer"
    },
    "nb": {
      "name": "UPS",
      "online": "På strømnett",
      "charging": "Lader",
      "on_battery": "På batteri",
      "low_battery": "Lavt batteri",
      "offline": "Av",
      "unavailable": "Utilgjengelig",
      "charge": "Batteri",
      "runtime": "Driftstid",
      "load": "Belastning",
      "power": "Effekt",
      "input": "Inngang",
      "output": "Utgang",
      "energy": "Energi",
      "overload": "Overbelastning",
      "replace_battery": "Bytt batteriet"
    },
    "nl": {
      "name": "UPS",
      "online": "Op net",
      "charging": "Laden",
      "on_battery": "Op batterij",
      "low_battery": "Batterij bijna leeg",
      "offline": "Uit",
      "unavailable": "Niet beschikbaar",
      "charge": "Batterij",
      "runtime": "Looptijd",
      "load": "Belasting",
      "power": "Vermogen",
      "input": "Ingang",
      "output": "Uitgang",
      "energy": "Energie",
      "overload": "Overbelasting",
      "replace_battery": "Vervang de batterij"
    },
    "ro": {
      "name": "UPS",
      "online": "Pe rețea",
      "charging": "Se încarcă",
      "on_battery": "Pe baterie",
      "low_battery": "Baterie descărcată",
      "offline": "Oprit",
      "unavailable": "Indisponibil",
      "charge": "Baterie",
      "runtime": "Autonomie",
      "load": "Sarcină",
      "power": "Putere",
      "input": "Intrare",
      "output": "Ieșire",
      "energy": "Energie",
      "overload": "Suprasarcină",
      "replace_battery": "Înlocuiți bateria"
    },
    "ru": {
      "name": "ИБП",
      "online": "От сети",
      "charging": "Зарядка",
      "on_battery": "От батареи",
      "low_battery": "Низкий заряд",
      "offline": "Выкл.",
      "unavailable": "Недоступно",
      "charge": "Батарея",
      "runtime": "Автономия",
      "load": "Нагрузка",
      "power": "Мощность",
      "input": "Вход",
      "output": "Выход",
      "energy": "Энергия",
      "overload": "Перегрузка",
      "replace_battery": "Замените батарею"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--up-ok:var(--appliance-ok-color,#43a047);--up-warn:#ffa31a;
  --up-alert:var(--appliance-alert-color,#db4437);--up-cold:var(--appliance-cold-color,#2b9af9);--bat:1;--load:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--up-ok) 22%,transparent);color:var(--up-ok)}
.charging .badge{background:color-mix(in srgb,var(--up-cold) 22%,transparent);color:var(--up-cold)}
.on_battery .badge{background:color-mix(in srgb,var(--up-warn) 22%,transparent);color:var(--up-warn)}
.low_battery .badge,.offline .badge{background:color-mix(in srgb,var(--up-alert) 22%,transparent);color:var(--up-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--up-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile.bad .v{color:var(--up-alert)}

/* ---- illustration ---- */
/* courant dans les câbles : depuis le secteur en temps normal, depuis la batterie en coupure */
.cable{fill:none;stroke:#3a4148;stroke-width:4;stroke-linecap:round}
.amp{fill:none;stroke:#ffd43b;stroke-width:2;stroke-linecap:round;stroke-dasharray:4 8;opacity:0;transition:opacity .4s}
.online .amp,.charging .amp{opacity:1;animation:upflow .7s linear infinite}
.on_battery .amp.out,.low_battery .amp.out{opacity:1;stroke:#ff9f1a;animation:upflow 1s linear infinite}
@keyframes upflow{to{stroke-dashoffset:-24}}
.mains{transition:opacity .4s}
.on_battery .mains,.low_battery .mains,.offline .mains{opacity:.35}
.cut{opacity:0;transition:opacity .3s}
.on_battery .cut,.low_battery .cut,.offline .cut{opacity:1}
/* batterie visible sur le flanc */
.batf{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(var(--bat));transition:transform 1.2s,fill .5s;fill:#43a047}
.lowbat .batf{fill:#e53935}.midbat .batf{fill:#fb8c00}
.charging .batf{animation:upchg 1.6s ease-in-out infinite}
@keyframes upchg{50%{opacity:.55}}
/* écran : vert sur secteur, orange sur batterie, rouge batterie faible */
.lcdbg{fill:#14301c;transition:fill .4s}
.on_battery .lcdbg{fill:#3d2a08}.low_battery .lcdbg{fill:#3d0f0c}.offline .lcdbg{fill:#111}
.lcd{fill:#7dff9a;font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.lcds{fill:#7dff9a;font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;opacity:.85}
.on_battery .lcd,.on_battery .lcds{fill:#ffb84d}.low_battery .lcd,.low_battery .lcds{fill:#ff6b5e}.offline .lcd,.offline .lcds{fill:#4a4f56}
.low_battery .lcd{animation:upblink .6s steps(2) infinite}
/* barre de charge connectée : 5 LED allumées selon --load */
.ld{fill:#2b3036}
.ld.on{fill:#43a047}.ld.on.hi{fill:#fb8c00}.ld.on.max{fill:#e53935}
.pwr{fill:#3a4148}
.online .pwr,.charging .pwr{fill:#3ddc5a;filter:drop-shadow(0 0 3px #3ddc5a)}
.on_battery .pwr{fill:#ffb31a;filter:drop-shadow(0 0 3px #ffb31a);animation:upblink 1s steps(2) infinite}
.low_battery .pwr{fill:#ff3b30;animation:upblink .5s steps(2) infinite}
/* bips de l'alarme sur batterie */
.beep{fill:none;stroke:#ffb31a;stroke-width:1.6;stroke-linecap:round;opacity:0}
.on_battery .beep,.low_battery .beep{animation:upbeep 1.2s ease-out infinite}
.low_battery .beep{stroke:#ff3b30;animation-duration:.6s}
.beep:nth-of-type(2){animation-delay:.2s!important}
@keyframes upbeep{0%{opacity:0;transform:translateX(0)}20%{opacity:1}100%{opacity:0;transform:translateX(5px)}}
.dev{transition:opacity .4s}
.offline .dev{opacity:.4}
.devled{fill:#3ddc5a;animation:upblink 1.4s steps(2) infinite}
.devled:nth-of-type(2n){animation-delay:-.5s}
.offline .devled{fill:#4a4f56;animation:none}
@keyframes upblink{50%{opacity:.3}}
.noanim *{animation:none!important}
`;

  const SVG = (label) => `
<svg viewBox="0 0 270 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="upbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2f35"/><stop offset=".5" stop-color="#3c434a"/><stop offset="1" stop-color="#23282d"/></linearGradient>
  <linearGradient id="upside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1f23"/><stop offset="1" stop-color="#2a2f35"/></linearGradient>
 </defs>
 <ellipse cx="135" cy="160" rx="128" ry="5" fill="#000" opacity=".18"/>
 <!-- prise murale -->
 <g class="mains">
  <rect x="8" y="70" width="34" height="40" rx="5" fill="#eef1f4" stroke="#b9c1c8"/>
  <circle cx="25" cy="90" r="11" fill="#dfe4e8" stroke="#b9c1c8"/><circle cx="21" cy="90" r="1.8" fill="#5b636b"/><circle cx="29" cy="90" r="1.8" fill="#5b636b"/>
  <path d="M25 52 l-6 10 h5 l-3 8 l9 -12 h-5 l3 -6 z" fill="#ffd43b"/>
 </g>
 <g class="cut"><path d="M25 52 l-6 10 h5 l-3 8 l9 -12 h-5 l3 -6 z" fill="#8a9097"/><path d="M15 54 L36 70" stroke="#e53935" stroke-width="2.6" stroke-linecap="round"/></g>
 <!-- câble secteur → onduleur -->
 <path class="cable" d="M25 101 V140 Q25 148 33 148 H82 Q90 148 90 140 V132"/>
 <path class="amp" d="M25 101 V140 Q25 148 33 148 H82 Q90 148 90 140 V132"/>
 <!-- onduleur tour -->
 <path d="M126 30 L144 22 V142 L126 150 Z" fill="url(#upside)"/>
 <rect x="76" y="30" width="50" height="120" rx="5" fill="url(#upbody)" stroke="#16191c"/>
 <path d="M76 36 Q76 30 82 30 L100 22 H138 Q144 22 144 22 L126 30 Z" fill="#4a5158"/>
 <!-- batterie visible par la grille du flanc -->
 <rect x="130" y="50" width="10" height="64" rx="2" fill="#16191c" transform="skewY(-24) translate(0 58)"/>
 <g transform="skewY(-24) translate(0 58)"><rect x="131.5" y="52" width="7" height="60" rx="1.5" fill="#262b30"/><rect class="batf" x="131.5" y="52" width="7" height="60" rx="1.5"/></g>
 <rect x="84" y="42" width="34" height="26" rx="3" class="lcdbg" stroke="#0d0f11"/>
 <text class="lcd" id="uplcd" x="101" y="56">--</text>
 <text class="lcds" id="uplcds" x="101" y="64">UPS</text>
 <g id="upleds"><rect class="ld" x="86" y="76" width="5" height="4" rx="1"/><rect class="ld" x="92.5" y="76" width="5" height="4" rx="1"/><rect class="ld" x="99" y="76" width="5" height="4" rx="1"/><rect class="ld" x="105.5" y="76" width="5" height="4" rx="1"/><rect class="ld" x="112" y="76" width="5" height="4" rx="1"/></g>
 <circle cx="101" cy="98" r="8" fill="#1b1f23" stroke="#4a5158"/>
 <path d="M101 93 V98 M97.5 95 A5 5 0 1 0 104.5 95" fill="none" stroke="#8a9097" stroke-width="1.4" stroke-linecap="round"/>
 <circle class="pwr" cx="101" cy="112" r="2.4"/>
 <g stroke="#1b1f23" stroke-width="1.2"><path d="M84 122 H118 M84 127 H118 M84 132 H118 M84 137 H118"/></g>
 <path class="beep" d="M150 48 q5 6 0 12"/><path class="beep" d="M155 44 q7 10 0 20"/>
 <!-- câble onduleur → appareils protégés -->
 <path class="cable" d="M112 132 V140 Q112 148 120 148 H200 Q208 148 208 140 V128"/>
 <path class="amp out" d="M112 132 V140 Q112 148 120 148 H200 Q208 148 208 140 V128"/>
 <path class="cable" d="M208 140 Q208 148 216 148 H238 Q246 148 246 140 V86"/>
 <path class="amp out" d="M208 140 Q208 148 216 148 H238 Q246 148 246 140 V86"/>
 <!-- box internet -->
 <g class="dev">
  <rect x="180" y="106" width="56" height="22" rx="4" fill="#eef1f4" stroke="#b9c1c8"/>
  <path d="M190 106 V94 M226 106 V94" stroke="#b9c1c8" stroke-width="2" stroke-linecap="round"/>
  <circle class="devled" cx="190" cy="117" r="1.6"/><circle class="devled" cx="196" cy="117" r="1.6"/><circle class="devled" cx="202" cy="117" r="1.6"/>
 </g>
 <!-- NAS -->
 <g class="dev">
  <rect x="226" y="36" width="38" height="50" rx="4" fill="#2a2f35" stroke="#16191c"/>
  <rect x="231" y="42" width="28" height="9" rx="1.5" fill="#3c434a"/><rect x="231" y="54" width="28" height="9" rx="1.5" fill="#3c434a"/><rect x="231" y="66" width="28" height="9" rx="1.5" fill="#3c434a"/>
  <circle class="devled" cx="255" cy="46.5" r="1.4"/><circle class="devled" cx="255" cy="58.5" r="1.4"/><circle class="devled" cx="255" cy="70.5" r="1.4"/>
 </g>
</svg>`;

  const TILES = [
    ['charge', 'mdi:battery-high', 'show_charge'],
    ['runtime', 'mdi:timer-sand', 'show_runtime'],
    ['load', 'mdi:gauge', 'show_load'],
    ['power', 'mdi:flash', 'show_power'],
    ['input', 'mdi:power-plug', 'show_voltage'],
    ['output', 'mdi:power-socket-eu', 'show_voltage'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
  ];

  class ApplianceUpsCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity: f(/(ups|onduleur).*status_data/i, 'sensor') || f(/(ups|onduleur).*status/i, 'sensor'),
        entity_charge: f(/(ups|onduleur).*(battery_charge|batterie)/i, 'sensor'),
        entity_runtime: f(/(ups|onduleur).*runtime/i, 'sensor'),
        entity_load: f(/(ups|onduleur).*load/i, 'sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_charge: true, show_runtime: true, show_load: true, show_power: true, show_voltage: true, show_energy: true,
        battery_low: 20, load_max: 90, mains_min: 100, ...c };
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // autonomie en minutes : NUT la donne en secondes
    _minutes(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 's').toLowerCase();
      return u === 'min' ? v : u === 'h' ? v * 60 : v / 60;
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="uptitle"></div><div class="badge" id="upbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="upalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity || this._c.entity_charge));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ charge: cc.entity_charge, runtime: cc.entity_runtime, load: cc.entity_load, power: cc.entity_power,
          input: cc.entity_input_voltage, output: cc.entity_output_voltage, energy: cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const charge = this._num(c.entity_charge), load = this._num(c.entity_load), vin = this._num(c.entity_input_voltage);
      const raw = s ? String(s.state) : '', up = raw.toUpperCase(), alerts = [];
      // codes NUT (OL, OB, LB, CHRG, RB, OVER…) et libellés en clair
      if (/\bRB\b|REPLACE/.test(up)) alerts.push('replace_battery');
      if (/\bOVER\b|OVERLOAD/.test(up) || (!isNaN(load) && load > Number(c.load_max))) alerts.push('overload');
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && s.entity_id.startsWith('binary_sensor.')) st = raw === 'on' ? 'online' : 'on_battery';
      else if (s && /\bOFF\b|OFFLINE|\bFSD\b/.test(up)) st = 'offline';
      else if (s && /\bOB\b|ON ?BATT|DISCHRG|DISCHARG|SUR BATTERIE/.test(up)) st = 'on_battery';
      else if (s && /\bLB\b|LOW ?BATT/.test(up)) st = 'on_battery';
      else if (s && /\bOL\b|ONLINE|SECTEUR|\bCHRG\b|CHARGING/.test(up)) st = 'online';
      else if (!isNaN(vin)) st = vin < Number(c.mains_min) ? 'on_battery' : 'online';
      else if (!s && !isNaN(charge)) st = 'online';
      else st = s ? 'online' : 'unavailable';
      const low = /\bLB\b|LOW ?BATT/.test(up) || (!isNaN(charge) && charge < Number(c.battery_low));
      if (st === 'on_battery' && low) st = 'low_battery';
      if (st === 'online' && /\bCHRG\b|CHARGING/.test(up)) st = 'charging';
      if (st === 'low_battery') alerts.unshift('low_battery');
      return { st, charge, load, vin, alerts };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, charge, load, vin, alerts } = this._compute();
      const clamp = (x) => Math.max(0, Math.min(1, x));
      const bat = isNaN(charge) ? 1 : clamp(charge / 100);
      card.className = `${st} ${bat < 0.2 ? 'lowbat' : bat < 0.5 ? 'midbat' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--bat', bat.toFixed(3));
      // barre de LED : une LED par tranche de 20 % de charge connectée
      const n = isNaN(load) ? 0 : Math.ceil(clamp(load / 100) * 5);
      r.querySelectorAll('.ld').forEach((el, i) => el.setAttribute('class', `ld${i < n ? ' on' : ''}${i >= 3 ? ' hi' : ''}${i >= 4 ? ' max' : ''}`));

      const rt = this._minutes(c.entity_runtime);
      const fmtRt = (m) => isNaN(m) ? '--' : m >= 60 ? `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, '0')}` : `${Math.round(m)} min`;
      r.getElementById('uplcd').textContent = st === 'offline' || st === 'unavailable' ? '- - -' : isNaN(charge) ? (st === 'online' ? 'AC' : 'BATT') : `${Math.round(charge)}%`;
      r.getElementById('uplcds').textContent = st === 'on_battery' || st === 'low_battery' ? (isNaN(rt) ? 'BATT' : fmtRt(rt)) : st === 'charging' ? 'CHARGE' : isNaN(vin) ? 'UPS' : `${Math.round(vin)} V`;

      r.getElementById('uptitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('upbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('upalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      const pw = this._watts(c.entity_power), vout = this._num(c.entity_output_voltage), energy = this._num(c.entity_energy);
      const V = {
        charge: [c.entity_charge, this._fmt(charge, 0), '%'],
        runtime: [c.entity_runtime, fmtRt(rt), ''],
        load: [c.entity_load, this._fmt(load, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), 'W'],
        input: [c.entity_input_voltage, this._fmt(vin, 0), 'V'],
        output: [c.entity_output_voltage, this._fmt(vout, 0), 'V'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
      };
      const bad = { charge: alerts.includes('low_battery'), load: alerts.includes('overload'), input: st === 'on_battery' || st === 'low_battery' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceUpsCard);

  /* ---- éditeur visuel ---- */
  class ApplianceUpsCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_charge', 'sensor'), ent('entity_runtime', 'sensor'), ent('entity_load', 'sensor'), ent('entity_power', 'sensor'),
        ent('entity_input_voltage', 'sensor'), ent('entity_output_voltage', 'sensor'), ent('entity_energy', 'sensor'),
        { type: 'grid', name: '', schema: [num('battery_low', 0, 100, 1, 20, '%'), num('load_max', 10, 100, 1, 90, '%'), num('mains_min', 0, 250, 1, 100, 'V')] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_charge'), bool('show_runtime'), bool('show_load'), bool('show_power'), bool('show_voltage'), bool('show_energy'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceUpsCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – UPS / Onduleur',
    description: 'Onduleur animé : courant du secteur ou de la batterie, coupure de courant, bips, charge batterie, autonomie et charge connectée (NUT).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();

/* Carte « Plancher chauffant » — custom:appliance-underfloor-heating-card
 * Pièce vue en coupe : dalle en perspective dont le carrelage est retiré à gauche pour montrer
 * le circuit en serpentin, collecteur départ / retour au mur (hydraulique) ou câble chauffant
 * (heating_type: electric), thermostat mural. En chauffe, l'eau ou le courant circule, la dalle
 * rougeoit (--heat) et des ondes de chaleur montent du sol.
 * États : off, heating, idle (allumé, consigne atteinte), fault. Entité climate (consigne ± et
 * marche / arrêt), switch / input_boolean / binary_sensor (vanne, circulateur) ou puissance seule.
 */
(() => {
  const TAG = 'appliance-underfloor-heating-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Underfloor heating",
      "off": "Off",
      "heating": "Heating",
      "idle": "Idle",
      "fault": "Fault",
      "temp": "Room",
      "target": "Target",
      "floor": "Floor",
      "water": "Flow",
      "power": "Power",
      "energy": "Energy",
      "cost": "Cost",
      "turn_on": "Turn on",
      "turn_off": "Turn off",
      "floor_hot": "Floor too hot",
      "water_hot": "Water too hot"
    },
    "de": {
      "name": "Fußbodenheizung",
      "off": "Aus",
      "heating": "Heizt",
      "idle": "Bereit",
      "fault": "Störung",
      "temp": "Raum",
      "target": "Soll",
      "floor": "Boden",
      "water": "Vorlauf",
      "power": "Leistung",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Einschalten",
      "turn_off": "Ausschalten",
      "floor_hot": "Boden zu heiß",
      "water_hot": "Wasser zu heiß"
    },
    "fr": {
      "name": "Plancher chauffant",
      "off": "Arrêt",
      "heating": "Chauffe",
      "idle": "En veille",
      "fault": "Défaut",
      "temp": "Pièce",
      "target": "Consigne",
      "floor": "Sol",
      "water": "Départ",
      "power": "Puissance",
      "energy": "Énergie",
      "cost": "Coût",
      "turn_on": "Allumer",
      "turn_off": "Éteindre",
      "floor_hot": "Sol trop chaud",
      "water_hot": "Eau trop chaude"
    },
    "nb": {
      "name": "Gulvvarme",
      "off": "Av",
      "heating": "Varmer",
      "idle": "Inaktiv",
      "fault": "Feil",
      "temp": "Rom",
      "target": "Mål",
      "floor": "Gulv",
      "water": "Tur",
      "power": "Effekt",
      "energy": "Energi",
      "cost": "Kostnad",
      "turn_on": "Slå på",
      "turn_off": "Slå av",
      "floor_hot": "Gulvet er for varmt",
      "water_hot": "Vannet er for varmt"
    },
    "nl": {
      "name": "Vloerverwarming",
      "off": "Uit",
      "heating": "Verwarmt",
      "idle": "Stand-by",
      "fault": "Storing",
      "temp": "Kamer",
      "target": "Doel",
      "floor": "Vloer",
      "water": "Aanvoer",
      "power": "Vermogen",
      "energy": "Energie",
      "cost": "Kosten",
      "turn_on": "Aanzetten",
      "turn_off": "Uitzetten",
      "floor_hot": "Vloer te heet",
      "water_hot": "Water te heet"
    },
    "ro": {
      "name": "Încălzire în pardoseală",
      "off": "Oprit",
      "heating": "Încălzește",
      "idle": "În așteptare",
      "fault": "Defect",
      "temp": "Cameră",
      "target": "Țintă",
      "floor": "Pardoseală",
      "water": "Tur",
      "power": "Putere",
      "energy": "Energie",
      "cost": "Cost",
      "turn_on": "Pornește",
      "turn_off": "Oprește",
      "floor_hot": "Pardoseala prea caldă",
      "water_hot": "Apa prea caldă"
    },
    "ru": {
      "name": "Тёплый пол",
      "off": "Выкл.",
      "heating": "Нагрев",
      "idle": "Простой",
      "fault": "Неисправность",
      "temp": "Комната",
      "target": "Цель",
      "floor": "Пол",
      "water": "Подача",
      "power": "Мощность",
      "energy": "Энергия",
      "cost": "Стоимость",
      "turn_on": "Включить",
      "turn_off": "Выключить",
      "floor_hot": "Пол слишком горячий",
      "water_hot": "Вода слишком горячая"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--uf-heat-c:var(--appliance-heat-color,#ff8a3d);--uf-ok:var(--appliance-ok-color,#43a047);
  --uf-alert:var(--appliance-alert-color,#db4437);--heat:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.heating .badge{background:color-mix(in srgb,var(--uf-heat-c) 22%,transparent);color:var(--uf-heat-c)}
.idle .badge{background:color-mix(in srgb,var(--uf-ok) 22%,transparent);color:var(--uf-ok)}
.fault .badge{background:color-mix(in srgb,var(--uf-alert) 22%,transparent);color:var(--uf-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--uf-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(270px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:120px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button.sm{flex:0 0 40px}
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
.tile.bad .v{color:var(--uf-alert)}

/* ---- illustration ---- */
/* circuit : gris à l'arrêt, rouge (eau chaude) ou orange (câble) en chauffe */
.pipe{fill:none;stroke:#8d969e;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;transition:stroke .8s}
.heating .pipe{stroke:#d9483b}.idle .pipe{stroke:#c47a6e}
.elec .pipe{stroke-width:2.6}.elec.heating .pipe{stroke:#ff8a1f;filter:drop-shadow(0 0 2px #ffb15c)}
.flow{fill:none;stroke:#ffd0c4;stroke-width:2;stroke-linecap:round;stroke-dasharray:4 10;opacity:0}
.heating .flow{opacity:.9;animation:ufflow 1.2s linear infinite}
.elec .flow{stroke:#fff3c4;stroke-width:1.2;stroke-dasharray:2 8}
@keyframes ufflow{to{stroke-dashoffset:-28}}
.glow{opacity:calc(var(--heat) * .75);transition:opacity 1.5s}
.wave{fill:none;stroke:var(--uf-heat-c);stroke-width:1.6;stroke-linecap:round;opacity:0}
.heating .wave{animation:ufwave 3s ease-in infinite}
.idle .wave{animation:ufwave 5s ease-in infinite;stroke-opacity:.5}
.wave:nth-of-type(2){animation-delay:-.6s!important}.wave:nth-of-type(3){animation-delay:-1.2s!important}.wave:nth-of-type(4){animation-delay:-1.8s!important}.wave:nth-of-type(5){animation-delay:-2.4s!important}
@keyframes ufwave{0%{opacity:0;transform:translateY(6px)}30%{opacity:.8}100%{opacity:0;transform:translateY(-40px)}}
.hyd{display:inline}.elec .hyd{display:none}
.cab{display:none}.elec .cab{display:inline}
.dsp{fill:#ff9f43;font:700 8px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.off .dsp{fill:#5a6470}.fault .dsp{fill:#ff5a4e}.idle .dsp{fill:#7dff9a}
.led{fill:#5b6570}
.heating .led{fill:#ff8a3d;animation:ufblink 1.2s steps(2) infinite}.idle .led{fill:#43a047}.fault .led{fill:#db4437;animation:ufblink .6s steps(2) infinite}
@keyframes ufblink{50%{opacity:.25}}
.noanim *{animation:none!important}
`;

  // serpentin en vue de dessus (0 → 220 × 0 → 80), projeté en perspective par la matrice du groupe
  const COIL = 'M-8 8 H200 Q210 8 210 18 Q210 28 200 28 H20 Q10 28 10 38 Q10 48 20 48 H200 Q210 48 210 58 Q210 68 200 68 H-8';
  const SVG = (label) => `
<svg viewBox="0 0 270 170" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="ufwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset="1" stop-color="#d9dfe4"/></linearGradient>
  <linearGradient id="ufglow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a3d" stop-opacity=".1"/><stop offset="1" stop-color="#ff5a2a" stop-opacity=".75"/></linearGradient>
  <pattern id="uftile" width="27.5" height="20" patternUnits="userSpaceOnUse"><rect width="27.5" height="20" fill="#e9e2d6"/><path d="M0 0 H27.5 M0 0 V20" stroke="#c7bca9" stroke-width="1.4"/></pattern>
  <clipPath id="ufslab"><rect x="0" y="0" width="220" height="80"/></clipPath>
 </defs>
 <ellipse cx="135" cy="164" rx="128" ry="4" fill="#000" opacity=".15"/>
 <!-- mur du fond, fenêtre, thermostat -->
 <path d="M40 18 H262 V118 H40 Z" fill="url(#ufwall)" stroke="#c3cad1"/>
 <rect x="96" y="32" width="58" height="50" rx="2" fill="#bfe0f5" stroke="#9fb3c3" stroke-width="2"/>
 <path d="M125 32 V82 M96 57 H154" stroke="#9fb3c3" stroke-width="2"/>
 <rect x="206" y="44" width="30" height="36" rx="4" fill="#f9fafb" stroke="#b9c1c8"/>
 <rect x="210" y="49" width="22" height="13" rx="2" fill="#1b1e22"/>
 <text class="dsp" id="ufdsp" x="221" y="58.5">--</text>
 <circle class="led" cx="221" cy="71" r="2.2"/>
 <!-- ondes de chaleur qui montent du sol -->
 <g><path class="wave" d="M70 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M110 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M150 112 q4 -5 0 -10 t0 -10"/>
  <path class="wave" d="M190 112 q4 -5 0 -10 t0 -10"/><path class="wave" d="M230 112 q4 -5 0 -10 t0 -10"/></g>
 <!-- dalle en perspective : chape et serpentin, carrelage posé à droite -->
 <g transform="matrix(1 0 -.4 .5 40 118)">
  <rect x="0" y="0" width="220" height="80" fill="#cdc6ba"/>
  <g clip-path="url(#ufslab)">
   <path class="pipe" d="${COIL}"/>
   <path class="flow" d="${COIL}"/>
  </g>
  <path d="M120 0 L100 80 H220 V0 Z" fill="url(#uftile)"/>
  <path d="M120 0 L100 80" stroke="#a89c86" stroke-width="2"/>
  <rect class="glow" x="0" y="0" width="220" height="80" fill="url(#ufglow)"/>
 </g>
 <!-- épaisseur de la dalle -->
 <path d="M8 158 H228 L232 158 V164 H8 Z" fill="#9c9486"/>
 <path d="M228 158 L260 118 V124 L232 164 Z" fill="#8a8274"/>
 <!-- collecteur départ / retour (hydraulique) -->
 <g class="hyd">
  <rect x="6" y="64" width="30" height="48" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <rect x="10" y="74" width="22" height="4" rx="2" fill="#d9483b"/><rect x="10" y="94" width="22" height="4" rx="2" fill="#2b7fd9"/>
  <g fill="#5b636b"><circle cx="15" cy="76" r="2.4"/><circle cx="27" cy="76" r="2.4"/><circle cx="15" cy="96" r="2.4"/><circle cx="27" cy="96" r="2.4"/></g>
  <path d="M15 112 V122 M27 112 V128" stroke="#8d969e" stroke-width="3"/>
 </g>
 <!-- boîtier du câble chauffant (électrique) -->
 <g class="cab">
  <rect x="10" y="84" width="22" height="26" rx="3" fill="#f4f6f8" stroke="#b9c1c8"/>
  <path d="M21 90 l-4 7 h4 l-2 6 l6 -9 h-4 l2 -4 z" fill="#ff8a1f"/>
  <path d="M21 110 V124" stroke="#ff8a1f" stroke-width="2"/>
 </g>
</svg>`;

  const TILES = [
    ['temp', 'mdi:home-thermometer', 'show_temp'],
    ['target', 'mdi:thermometer-check', 'show_temp'],
    ['floor', 'mdi:heating-coil', 'show_floor'],
    ['water', 'mdi:coolant-temperature', 'show_water'],
    ['power', 'mdi:flash', 'show_power'],
    ['energy', 'mdi:lightning-bolt-circle', 'show_energy'],
    ['cost', 'mdi:cash', 'show_cost'],
  ];

  class ApplianceUnderfloorHeatingCard extends HTMLElement {
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const re = /plancher|underfloor|floor_heat|fussboden|vloerverwarming/i;
      const f = (r, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && r.test(i)) || '';
      return { entity: f(re, 'climate') || f(re, 'switch'), entity_floor_temp: f(/(plancher|floor|sol).*temp/i, 'sensor') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_temp: true, show_floor: true, show_water: true, show_power: true, show_energy: true, show_cost: true,
        heating_type: 'water', floor_max: 29, water_max: 45, heat_threshold: 20, ...c };
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
    // consigne : attribut temperature d'une entité climate / water_heater, sinon valeur numérique de l'état
    _tgt(id) {
      const s = this._st(id);
      if (s && /^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.temperature); return s.attributes && s.attributes.temperature != null && isFinite(t) ? t : NaN; }
      return this._num(id);
    }
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
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="uftitle"></div><div class="badge" id="ufbadge"></div></div>
        ${SVG(c.name || this._t('name'))}
        <div class="alert" id="ufalert"></div>
        <div class="ctl" id="ufctl">
          <button class="sm" data-a="down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <button data-a="power"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button class="sm" data-a="up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('svg').addEventListener('click', () => this._more(this._c.entity || this._c.entity_floor_temp));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const cc = this._c, k = el.dataset.k;
        this._more({ temp: cc.entity_temp || cc.entity, target: cc.entity_target_temp || cc.entity, floor: cc.entity_floor_temp, water: cc.entity_water_temp,
          power: cc.entity_power, energy: cc.entity_energy, cost: cc.entity_cost || cc.entity_energy }[k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass, s = this._st(c.entity); if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'power') {
        if (d === 'climate') h.callService('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: s && s.state !== 'off' ? 'off' : 'heat' });
        else h.callService('homeassistant', 'toggle', { entity_id: c.entity });
      } else if (d === 'climate' && s) {
        const a2 = s.attributes || {}, step = Number(a2.target_temp_step) || 0.5, cur = Number(a2.temperature);
        if (!isFinite(cur)) return;
        const lim = (v) => Math.max(Number(a2.min_temp) || -Infinity, Math.min(Number(a2.max_temp) || Infinity, v));
        h.callService('climate', 'set_temperature', { entity_id: c.entity, temperature: lim(cur + (a === 'up' ? step : -step)) });
      }
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), a = (s && s.attributes) || {};
      const pw = this._watts(c.entity_power);
      let temp = this._num(c.entity_temp);
      if (isNaN(temp) && isFinite(Number(a.current_temperature))) temp = Number(a.current_temperature);
      let target = this._tgt(c.entity_target_temp);
      if (isNaN(target) && isFinite(Number(a.temperature))) target = Number(a.temperature);
      const floor = this._num(c.entity_floor_temp), water = this._num(c.entity_water_temp);
      const v = { pw, temp, target, floor, water };
      const txt = s ? String(s.state).toLowerCase() : '';
      if (/error|erreur|fault|défaut|defaut|alarm/.test(txt)) return { ...v, st: 'fault' };
      if (s && !/^(unavailable|unknown)$/.test(txt)) {
        if (/^(off|false|0|arr[eê]t|éteint|eteint)$/.test(txt)) return { ...v, st: 'off' };
        if (s.entity_id.startsWith('climate.')) {
          // hvac_action fait foi, sinon on compare la pièce à la consigne
          if (a.hvac_action) return { ...v, st: /heat/.test(String(a.hvac_action)) ? 'heating' : /off/.test(String(a.hvac_action)) ? 'off' : 'idle' };
          if (!isNaN(pw)) return { ...v, st: pw > Number(c.heat_threshold) ? 'heating' : 'idle' };
          return { ...v, st: !isNaN(temp) && !isNaN(target) && temp >= target - 0.2 ? 'idle' : 'heating' };
        }
        if (!isNaN(pw)) return { ...v, st: pw > Number(c.heat_threshold) ? 'heating' : 'idle' };
        return { ...v, st: 'heating' };
      }
      return { ...v, st: !isNaN(pw) && pw > Number(c.heat_threshold) ? 'heating' : 'off' };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pw, temp, target, floor, water } = this._compute();
      const clamp = (x) => Math.max(0, Math.min(1, x));
      // lueur de la dalle : température du sol si connue (20 °C → floor_max), sinon selon l'état
      const heat = !isNaN(floor) ? clamp((floor - 20) / Math.max(1, Number(c.floor_max) - 20)) : ({ heating: 0.8, idle: 0.3 }[st] || 0);
      const elec = String(c.heating_type).toLowerCase() === 'electric';
      card.className = `${st}${elec ? ' elec' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--heat', (st === 'off' || st === 'fault' ? 0 : heat).toFixed(3));

      r.getElementById('uftitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('ufbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('ufdsp').textContent = st === 'off' ? 'OFF' : st === 'fault' ? 'Err' : !isNaN(temp) ? `${this._fmt(temp, 1)}°` : 'ON';
      const alerts = [];
      if (!isNaN(floor) && floor > Number(c.floor_max)) alerts.push(this._t('floor_hot'));
      if (!isNaN(water) && water > Number(c.water_max)) alerts.push(this._t('water_hot'));
      const al = r.getElementById('ufalert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);

      // commandes : marche/arrêt, et consigne ± seulement pour une entité climate
      const d = (c.entity || '').split('.')[0];
      const ctl = r.getElementById('ufctl');
      ctl.classList.toggle('hide', c.show_controls === false || !['climate', 'switch', 'input_boolean'].includes(d));
      ctl.querySelector('[data-a="power"] span').textContent = this._t(st === 'off' ? 'turn_on' : 'turn_off');
      ctl.querySelectorAll('.sm').forEach((b) => b.classList.toggle('hide', d !== 'climate'));

      const energy = this._num(c.entity_energy);
      let cost = this._num(c.entity_cost), costU = this._unit(c.entity_cost, c.currency || '€');
      if (isNaN(cost) && c.price_per_kwh && !isNaN(energy)) { cost = energy * Number(c.price_per_kwh); costU = c.currency || '€'; }
      const V = {
        temp: [!isNaN(temp), this._fmt(temp, 1), '°C'],
        target: [!isNaN(target), this._fmt(target, 1), '°C'],
        floor: [c.entity_floor_temp, this._fmt(floor, 1), '°C'],
        water: [c.entity_water_temp, this._fmt(water, 0), '°C'],
        power: [c.entity_power, isNaN(pw) ? '--' : (pw >= 1000 ? this._fmt(pw / 1000, 2) : this._fmt(pw, 0)), isNaN(pw) ? '' : (pw >= 1000 ? 'kW' : 'W')],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh')],
        cost: [c.entity_cost || (c.price_per_kwh && c.entity_energy), this._fmt(cost, 2), costU],
      };
      const bad = { floor: !isNaN(floor) && floor > Number(c.floor_max), water: !isNaN(water) && water > Number(c.water_max) };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceUnderfloorHeatingCard);

  /* ---- éditeur visuel ---- */
  class ApplianceUnderfloorHeatingCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_temp', ['sensor', 'climate', 'water_heater']), ent('entity_target_temp'), ent('entity_floor_temp', 'sensor'), ent('entity_water_temp', 'sensor'),
        ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_cost', 'sensor'),
        { name: 'price_per_kwh', selector: { number: { min: 0, step: 0.0001, mode: 'box' } } },
        { name: 'heating_type', selector: { select: { options: ['water', 'electric'] } } },
        { type: 'grid', name: '', schema: [num('floor_max', 20, 40, 0.5, 29, '°C'), num('water_max', 25, 70, 1, 45, '°C'), num('heat_threshold', 0, 5000, 1, 20, 'W')] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_temp'), bool('show_floor'), bool('show_water'),
          bool('show_power'), bool('show_energy'), bool('show_cost'), bool('animations'),
        ] },
      ];
      // ici, la température de l'eau est celle du départ du circuit
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'entity_water_temp' ? 'entity_flow_temp' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceUnderfloorHeatingCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: 'Appliance – Underfloor heating / Plancher chauffant',
    description: 'Plancher chauffant animé (hydraulique ou électrique) : serpentin, collecteur, sol qui rougeoit, ondes de chaleur, thermostat.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();

/* Cartes « Lumières » — dix luminaires animés qui partagent ce fichier
 * custom:appliance-light-bulb-card, -color-bulb-, -filament-bulb-, -pendant-light-, -pendant-cluster-,
 * -desk-lamp-, -floor-lamp-, -chandelier-, -garden-spotlight-, -christmas-tree-card.
 * La couleur de la lumière (--lc) vient de l'ampoule dans Home Assistant (rgb_color, sinon température
 * de blanc en kelvins) ou de l'option `color` ; l'intensité de la lueur (--b) suit la luminosité.
 * Entité light (Allumer / Éteindre, et Couleur pour l'ampoule couleur), switch ou input_boolean.
 */
(() => {
  if (customElements.get('appliance-light-bulb-card')) return;

  const T = {
    "en": {
      "light_bulb": "Bulb",
      "color_bulb": "Colour bulb",
      "filament_bulb": "Filament bulb",
      "pendant_light": "Pendant light",
      "pendant_cluster": "Pendant cluster",
      "desk_lamp": "Desk lamp",
      "floor_lamp": "Floor lamp",
      "chandelier": "Chandelier",
      "garden_spotlight": "Garden spotlight",
      "christmas_tree": "Christmas tree",
      "on": "On",
      "off": "Off",
      "unavailable": "Unavailable",
      "turn_on": "On",
      "turn_off": "Off",
      "color": "Colour",
      "brightness": "Brightness",
      "power": "Power",
      "energy": "Energy"
    },
    "de": {
      "light_bulb": "Glühbirne",
      "color_bulb": "Farbige Glühbirne",
      "filament_bulb": "Filament-Glühbirne",
      "pendant_light": "Pendelleuchte",
      "pendant_cluster": "Pendelleuchten-Gruppe",
      "desk_lamp": "Schreibtischlampe",
      "floor_lamp": "Stehlampe",
      "chandelier": "Kronleuchter",
      "garden_spotlight": "Gartenstrahler",
      "christmas_tree": "Weihnachtsbaum",
      "on": "An",
      "off": "Aus",
      "unavailable": "Nicht verfügbar",
      "turn_on": "Ein",
      "turn_off": "Aus",
      "color": "Farbe",
      "brightness": "Helligkeit",
      "power": "Leistung",
      "energy": "Energie"
    },
    "fr": {
      "light_bulb": "Ampoule",
      "color_bulb": "Ampoule couleur",
      "filament_bulb": "Ampoule à filament",
      "pendant_light": "Suspension",
      "pendant_cluster": "Suspensions en grappe",
      "desk_lamp": "Lampe de bureau",
      "floor_lamp": "Lampadaire",
      "chandelier": "Lustre",
      "garden_spotlight": "Spot de jardin",
      "christmas_tree": "Sapin de Noël",
      "on": "Allumée",
      "off": "Éteinte",
      "unavailable": "Indisponible",
      "turn_on": "Allumer",
      "turn_off": "Éteindre",
      "color": "Couleur",
      "brightness": "Luminosité",
      "power": "Puissance",
      "energy": "Énergie"
    },
    "nb": {
      "light_bulb": "Lyspære",
      "color_bulb": "Fargepære",
      "filament_bulb": "Glødetrådpære",
      "pendant_light": "Taklampe",
      "pendant_cluster": "Taklampeklynge",
      "desk_lamp": "Skrivebordslampe",
      "floor_lamp": "Gulvlampe",
      "chandelier": "Lysekrone",
      "garden_spotlight": "Hagespot",
      "christmas_tree": "Juletre",
      "on": "På",
      "off": "Av",
      "unavailable": "Utilgjengelig",
      "turn_on": "På",
      "turn_off": "Av",
      "color": "Farge",
      "brightness": "Lysstyrke",
      "power": "Effekt",
      "energy": "Energi"
    },
    "nl": {
      "light_bulb": "Lamp",
      "color_bulb": "Kleurenlamp",
      "filament_bulb": "Filamentlamp",
      "pendant_light": "Hanglamp",
      "pendant_cluster": "Hanglampen-cluster",
      "desk_lamp": "Bureaulamp",
      "floor_lamp": "Staande lamp",
      "chandelier": "Kroonluchter",
      "garden_spotlight": "Tuinspot",
      "christmas_tree": "Kerstboom",
      "on": "Aan",
      "off": "Uit",
      "unavailable": "Niet beschikbaar",
      "turn_on": "Aan",
      "turn_off": "Uit",
      "color": "Kleur",
      "brightness": "Helderheid",
      "power": "Vermogen",
      "energy": "Energie"
    },
    "ro": {
      "light_bulb": "Bec",
      "color_bulb": "Bec color",
      "filament_bulb": "Bec cu filament",
      "pendant_light": "Lustră suspendată",
      "pendant_cluster": "Grup de lustre suspendate",
      "desk_lamp": "Lampă de birou",
      "floor_lamp": "Lampadar",
      "chandelier": "Candelabru",
      "garden_spotlight": "Spot de grădină",
      "christmas_tree": "Brad de Crăciun",
      "on": "Aprins",
      "off": "Stins",
      "unavailable": "Indisponibil",
      "turn_on": "Aprinde",
      "turn_off": "Stinge",
      "color": "Culoare",
      "brightness": "Luminozitate",
      "power": "Putere",
      "energy": "Energie"
    },
    "ru": {
      "light_bulb": "Лампа",
      "color_bulb": "Цветная лампа",
      "filament_bulb": "Филаментная лампа",
      "pendant_light": "Подвесной светильник",
      "pendant_cluster": "Группа подвесов",
      "desk_lamp": "Настольная лампа",
      "floor_lamp": "Торшер",
      "chandelier": "Люстра",
      "garden_spotlight": "Садовый прожектор",
      "christmas_tree": "Ёлка",
      "on": "Вкл.",
      "off": "Выкл.",
      "unavailable": "Недоступно",
      "turn_on": "Вкл.",
      "turn_off": "Выкл.",
      "color": "Цвет",
      "brightness": "Яркость",
      "power": "Мощность",
      "energy": "Энергия"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--lc:#ffb347;--b:1;--lt-ok:#f5c45e}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.on .badge{background:color-mix(in srgb,var(--lc) 26%,transparent);color:color-mix(in srgb,var(--lc) 75%,var(--primary-text-color))}
.stage{position:relative;margin:4px auto 0;max-width:calc(240px * var(--illus-scale,1));border-radius:14px;background:radial-gradient(ellipse at 50% 55%,#1d232b,#12161b 75%);overflow:hidden;cursor:pointer}
svg{display:block;width:100%;height:auto;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:8px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif);transition:background .3s,color .3s}
.ctl button.sel{background:var(--lt-ok);color:#2a2112}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(76px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}

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
  };
  // couleurs proposées par le bouton « Couleur » de l'ampoule couleur
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
  // couleur de l'option : [r, g, b] (sélecteur de l'éditeur) ou texte CSS (#ffaa00, orange…)
  const cfgColor = (v) => (Array.isArray(v) && v.length === 3 ? `rgb(${v.map((x) => Math.round(Number(x) || 0)).join(',')})` :
    typeof v === 'string' && /^[#a-z0-9(),.\s%]+$/i.test(v.trim()) ? v.trim() : '');

  class ApplianceLightCard extends HTMLElement {
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_brightness: true, show_power: true, show_energy: true, follow_light_color: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const color = this.kind === 'color_bulb';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lttitle"></div><div class="badge" id="ltbadge"></div></div>
        <div class="stage"><svg viewBox="0 0 200 180" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${SVGS[this.kind]()}</svg></div>
        <div class="ctl" id="ltctl">
          <button data-a="on"><ha-icon icon="mdi:lightbulb-on"></ha-icon><span></span></button>
          ${color ? '<button data-a="color"><ha-icon icon="mdi:palette"></ha-icon><span></span></button>' : ''}
          <button data-a="off"><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${[['brightness', 'mdi:brightness-6'], ['power', 'mdi:flash'], ['energy', 'mdi:lightning-bolt-circle']].map(([k, ic]) =>
          `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('.stage').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more(k === 'brightness' ? this._c.entity : this._c[`entity_${k}`]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c, h = this._hass; if (!h || !c.entity) return;
      const d = c.entity.split('.')[0];
      if (a === 'color') {
        // couleur suivante de la liste (presets en configuration, sinon une palette de six teintes)
        const list = Array.isArray(c.presets) && c.presets.length ? c.presets : PRESETS;
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
        if (Array.isArray(a.rgb_color)) col = `rgb(${a.rgb_color.join(',')})`;
        else if (isFinite(Number(a.color_temp_kelvin))) col = kelvin(Number(a.color_temp_kelvin));
        else if (isFinite(Number(a.color_temp))) col = kelvin(1e6 / Number(a.color_temp));
      }
      col = col || cfgColor(c.color) || K.color;
      const bri = isFinite(Number(a.brightness)) ? Math.max(0.15, Number(a.brightness) / 255) : 1;
      const cycle = this.kind === 'color_bulb' && st === 'on' && (c.color_cycle === true || /loop|rainbow|cycle|colou?r/i.test(String(a.effect || '')));
      card.className = `${st}${cycle ? ' cycle' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--lc', col);
      card.style.setProperty('--b', (st === 'on' ? bri : 0).toFixed(3));
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
        b.querySelector('span').textContent = this._t(k === 'on' ? 'turn_on' : k === 'off' ? 'turn_off' : 'color');
        b.classList.toggle('sel', k === 'on' ? st === 'on' && !cycle : k === 'off' ? st !== 'on' : cycle);
        if (k === 'color') b.classList.toggle('hide', d !== 'light');
      });

      const energy = this._num(c.entity_energy);
      const V = {
        brightness: [st === 'on' && isFinite(Number(a.brightness)), Math.round(bri * 100), '%', 'show_brightness'],
        power: [c.entity_power, this._fmt(pw, pw < 10 ? 1 : 0), this._unit(c.entity_power, 'W'), 'show_power'],
        energy: [c.entity_energy, this._fmt(energy, 2), this._unit(c.entity_energy, 'kWh'), 'show_energy'],
      };
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
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'),
        { name: 'color', selector: { color_rgb: {} } },
        { type: 'grid', name: '', schema: [
          bool('follow_light_color'),
          ...(this.kind === 'color_bulb' ? [bool('color_cycle', false)] : []),
          ...(this.kind === 'christmas_tree' ? [bool('multicolor')] : []),
        ] },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_brightness'), bool('show_power'), bool('show_energy'), bool('animations'),
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
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, preview: true,
      description: `${T.fr[kind]} animé(e) : la lumière suit l'état, la luminosité et la couleur de l'ampoule.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();

/* Cartes « Volets » — volet roulant, store vénitien, volets battants
 * custom:appliance-roller-shutter-card, appliance-venetian-blind-card, appliance-swing-shutter-card.
 * Une entité cover donne l'état (open, closed, opening, closing) ; current_position (0 fermé → 100 ouvert)
 * et current_tilt_position (store vénitien) pilotent le dessin par des variables CSS (--p, --t) dont
 * les transformations sont animées. La vue extérieure passe en nuit quand sun.sun est sous l'horizon.
 * Boutons ouvrir / stop / fermer, curseurs de position et d'inclinaison, puissance du moteur.
 */
(() => {
  if (customElements.get('appliance-roller-shutter-card')) return;

  const T = {
    "en": {
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
      "position": "Position",
      "tilt": "Tilt",
      "power": "Motor",
      "since": "Last change"
    },
    "de": {
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
      "since": "Letzte Änderung"
    },
    "fr": {
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
      "position": "Position",
      "tilt": "Inclinaison",
      "power": "Moteur",
      "since": "Depuis"
    },
    "nb": {
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
      "since": "Sist endret"
    },
    "nl": {
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
      "since": "Laatste wijziging"
    },
    "ro": {
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
      "since": "Ultima schimbare"
    },
    "ru": {
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
      "since": "Последнее изменение"
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
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}
.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 0;max-width:110px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 4px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.rng{display:flex;align-items:center;gap:8px;margin:8px 2px 0;font-size:10px;color:var(--secondary-text-color)}
.rng.hide{display:none}
.rng span{min-width:56px}
.rng input{flex:1;accent-color:var(--sh-cold);margin:0;cursor:pointer}
.rng.tl input{accent-color:#c9a96b}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
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

/* ---- store vénitien : les lamelles se tassent en haut, s'inclinent (--t, 100 = à plat) ---- */
.lift{transform-box:view-box;transform-origin:100px 42px;transform:scaleY(calc(1 - var(--p) * .0092))}
.rail{transform:translateY(calc(var(--p) * -.94px))}
.sl{transform-box:fill-box;transform-origin:center;transform:scaleY(calc(1 - var(--t) * .0085));transition:transform 1.2s ease-in-out}
.vb .beam{opacity:calc(max(var(--p), var(--t) * .7) * .0022)}
.isnight .vb .beam{opacity:0}

/* ---- volets battants : deux vantaux en 3D, pivot sur les gonds ---- */
.sw{perspective:520px;perspective-origin:50% 45%}
.leaf{position:absolute;top:22.1%;height:60.5%;width:20%;transform-style:preserve-3d}
.leaf svg{display:block;width:100%;height:100%;overflow:visible}
.leaf.l{left:30%;transform-origin:0 50%;transform:rotateY(calc(var(--p) * 1.72deg))}
.leaf.r{left:50%;transform-origin:100% 50%;transform:rotateY(calc(var(--p) * -1.72deg))}
.leaf .sh{opacity:calc(var(--p) * .004);transition:opacity var(--sh-d)}
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
  </defs>`;
  const ARROW = (x, y) => `<g class="arrow" transform="translate(${x} ${y})"><circle r="9" fill="#ff8a3d"/>
    <path class="up" d="M-4 2 L0 -3 L4 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="dn" d="M-4 -2 L0 3 L4 -2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;

  const X0 = 34, X1 = 166, Y0 = 36, Y1 = 146, W = X1 - X0, H = Y1 - Y0;
  const SVGS = {
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
      for (let y = Y0 + 8; y < Y1 - 4; y += 7) sl += `<g class="sl"><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="var(--sc)"/><rect x="${X0 + 2}" y="${y - 3}" width="${W - 4}" height="6" rx=".6" fill="url(#shrelief)"/></g>`;
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

  // couleur du tablier / des lamelles / des vantaux par défaut, et motifs de nom pour l'éditeur
  const KINDS = {
    roller_shutter: { color: '#d5dbe1', re: /volet|shutter|roll|rollo|store/i, icon: 'mdi:window-shutter' },
    venetian_blind: { color: '#ece2cf', re: /venitien|vénitien|venetian|blind|jalousie|lamel|store/i, icon: 'mdi:blinds-horizontal' },
    swing_shutter: { color: '#4f7d5c', re: /volet|shutter|battant|persienne|swing/i, icon: 'mdi:window-shutter-open' },
  };
  const TILES = [['position', 'mdi:arrow-expand-vertical', 'show_position'], ['tilt', 'mdi:rotate-3d-variant', 'show_tilt'],
    ['power', 'mdi:flash', 'show_power'], ['since', 'mdi:history', 'show_since']];

  class ApplianceShutterCard extends HTMLElement {
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_slider: true, show_position: true, show_tilt: true, show_power: true, show_since: true,
        sun_entity: 'sun.sun', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en').slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      // climate / water_heater : l'état est un mode, la température actuelle est dans current_temperature
      if (/^(climate|water_heater)\./.test(s.entity_id)) { const t = Number(s.attributes && s.attributes.current_temperature); return s.attributes && s.attributes.current_temperature != null && isFinite(t) ? t : NaN; }
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _watts(id) { const v = this._num(id); return /^kw$/i.test(this._unit(id, 'W')) ? v * 1000 : v; }
    _unit(id, d) { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._lang() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
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
      const swing = this.kind === 'swing_shutter';
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        <div class="scene${swing ? ' sw' : ''}"><svg viewBox="0 0 200 172" role="img" aria-label="${esc(this._c.name || this._t(this.kind))}">${DEFS}${SVGS[this.kind]()}</svg>
          ${swing ? `<div class="leaf l mv">${LEAF(false)}</div><div class="leaf r mv">${LEAF(true)}</div>` : ''}</div>
        <div class="rng ps" id="shpos"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="rng tl" id="shtilt"><span></span><input type="range" min="0" max="100" step="1"></div>
        <div class="ctl" id="shctl">
          <button data-a="open"><ha-icon icon="mdi:arrow-up"></ha-icon><span></span></button>
          <button data-a="stop"><ha-icon icon="mdi:stop"></ha-icon><span></span></button>
          <button data-a="close"><ha-icon icon="mdi:arrow-down"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      root.querySelector('.scene').addEventListener('click', () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => {
        if (this._hass && this._c.entity) this._hass.callService('cover', `${b.dataset.a}_cover`, { entity_id: this._c.entity });
      }));
      root.querySelector('#shpos input').addEventListener('change', (e) => {
        if (this._hass) this._hass.callService('cover', 'set_cover_position', { entity_id: this._c.entity, position: this._c.invert ? 100 - Number(e.target.value) : Number(e.target.value) });
      });
      root.querySelector('#shtilt input').addEventListener('change', (e) => {
        if (this._hass) this._hass.callService('cover', 'set_cover_tilt_position', { entity_id: this._c.entity, tilt_position: Number(e.target.value) });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k; this._more(k === 'power' ? this._c.entity_power : this._c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._pos = null;
    }

    _compute() {
      const c = this._c, s = this._st(c.entity);
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
      return { st, pos, known, tilt, s };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, pos, known, tilt, s } = this._compute();
      const sun = this._st(c.sun_entity), night = !!sun && sun.state === 'below_horizon';
      card.className = `${st}${night ? ' isnight' : ''}${c.animations === false ? ' noanim' : ''}`;

      // course : durée proportionnelle à l'écart si travel_time est donné, sinon 1,2 s
      if (pos !== this._pos) {
        const tt = Number(c.travel_time);
        const dur = this._pos == null ? 0 : tt > 0 ? Math.abs(pos - this._pos) / 100 * tt : 1.2;
        card.style.setProperty('--sh-d', `${dur.toFixed(2)}s`);
        // avec un temps de course, la cover envoie sa position par paliers : mouvement linéaire pour enchaîner sans à-coups
        card.style.setProperty('--sh-e', tt > 0 ? 'linear' : 'ease-in-out');
        this._pos = pos;
      }
      card.style.setProperty('--p', String(pos));
      card.style.setProperty('--t', String(isNaN(tilt) ? (st === 'closed' ? 0 : 100) : tilt));
      card.style.setProperty('--sc', /^[#a-z0-9(),.\s%]+$/i.test(String(c.color || '').trim()) ? String(c.color).trim() : KINDS[this.kind].color);

      const name = c.name || this._t(this.kind);
      r.getElementById('shtitle').textContent = name;
      const badge = r.getElementById('shbadge');
      const moving = st === 'opening' || st === 'closing';
      badge.textContent = st === 'partial' ? `${this._t('partial')} ${Math.round(pos)} %` : moving && known ? `${this._t(st)}… ${Math.round(pos)} %` : this._t(st);
      badge.style.display = c.show_status === false || st === 'unknown' ? 'none' : '';

      // commandes et curseurs selon ce que la cover sait faire (supported_features)
      const isCover = (c.entity || '').startsWith('cover.');
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const has = (bit) => !isFinite(sf) || sf <= 0 || !!(sf & bit);
      const ctl = r.getElementById('shctl');
      ctl.classList.toggle('hide', c.show_controls === false || !isCover);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'stop' && !has(8));
        b.disabled = st === 'unavailable' || (a === 'open' && (st === 'open' || st === 'opening')) || (a === 'close' && (st === 'closed' || st === 'closing'));
      });
      const rng = (id, show, label, val) => {
        const el = r.getElementById(id), inp = el.querySelector('input');
        el.classList.toggle('hide', !show);
        el.querySelector('span').textContent = label;
        if (this._root.activeElement !== inp) inp.value = String(Math.round(val));
      };
      rng('shpos', isCover && known && has(4) && c.show_slider !== false && st !== 'unavailable', this._l('position'), pos);
      rng('shtilt', isCover && this.kind === 'venetian_blind' && !isNaN(tilt) && has(128) && c.show_slider !== false && st !== 'unavailable', this._l('tilt'), tilt);

      const pw = this._watts(c.entity_power);
      const V = {
        position: [known && st !== 'unavailable', this._fmt(pos, 0), '%'],
        tilt: [this.kind === 'venetian_blind' && !isNaN(tilt), this._fmt(tilt, 0), '%'],
        power: [c.entity_power, isNaN(pw) ? '--' : this._fmt(pw, 0), isNaN(pw) ? '' : 'W'],
        since: [s, this._since(s), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
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
        ent('entity', 'cover'), ent('entity_power', 'sensor'), ent('sun_entity', 'sun'),
        { type: 'grid', name: '', schema: [
          { name: 'color', selector: { text: {} } },
          { name: 'travel_time', selector: { number: { min: 0, max: 120, step: 1, mode: 'box', unit_of_measurement: 's' } } },
        ] },
        bool('invert', false),
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('show_controls'), bool('show_slider'), bool('show_position'),
          ...(this.kind === 'venetian_blind' ? [bool('show_tilt')] : []), bool('show_power'), bool('show_since'), bool('animations'),
        ] },
      ];
      // « color » a le libellé « couleur de la lumière » pour les lampes : ici, couleur du volet
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'color' ? 'shutter_color' : s.name === 'invert' ? 'invert_position' : s.name, this._hass);
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
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[kind]} / ${T.fr[kind]}`, preview: true,
      description: `${T.fr[kind]} animé : position, inclinaison, mouvement et vue jour / nuit.`,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards' });
  }
})();
