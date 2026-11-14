/* Carte « Détecteur de fumée » — custom:appliance-smoke-detector-card
 * Détecteur fixé au plafond, deux modèles (option model) : cylinder (cylindre compact, bouton-LED carré, bande grillagée)
 * ou round (rond plat classique). Alarme : la fumée monte, la LED rouge clignote, des ondes sonores partent du détecteur.
 * CO (facultatif, entity_co : binary_sensor ou sensor en ppm) : nappe de gaz et ondes orange. Test : le bouton s'enfonce,
 * ondes bleues. Mode gaz (detector: gas, ou model: gas) : même dessin, textes « Gaz », nuage de gaz, entity_level / entity_valve /
 * entity_siren facultatifs. Pile faible / défaut : LED orange et pictogramme. Boutons « Tester » et « Couper l'alarme » facultatifs.
 */
(() => {
  const TAG = 'appliance-smoke-detector-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Smoke detector",
      "ok": "OK",
      "alarm": "Smoke!",
      "co": "Carbon monoxide",
      "test": "Test",
      "fault": "Fault",
      "low_battery": "Low battery",
      "unavailable": "Unavailable",
      "alarm_at": "Smoke detected at {t}",
      "co_ppm": "Carbon monoxide: {n} ppm, ventilate!",
      "co_detected": "Carbon monoxide detected, ventilate!",
      "co_detected_short": "Detected",
      "fault_detail": "The detector reports a fault",
      "test_button": "Test",
      "silence": "Silence alarm",
      "since": "Last change",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Battery",
      "temperature": "Temperature",
      "low": "Low",
      "model_cylinder": "Compact cylinder",
      "model_round": "Round",
      "gas_name": "Gas detector",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas detected at {t}",
      "level": "Gas level",
      "open_valve": "Open valve",
      "close_valve": "Close valve"
    },
    "cs": {
      "name": "Hlásič kouře",
      "ok": "OK",
      "alarm": "Kouř!",
      "co": "Oxid uhelnatý",
      "test": "Test",
      "fault": "Porucha",
      "low_battery": "Slabá baterie",
      "unavailable": "Nedostupné",
      "alarm_at": "Kouř zjištěn v {t}",
      "co_ppm": "Oxid uhelnatý: {n} ppm, vyvětrejte!",
      "co_detected": "Zjištěn oxid uhelnatý, vyvětrejte!",
      "co_detected_short": "Zjištěn",
      "fault_detail": "Detektor hlásí poruchu",
      "test_button": "Test",
      "silence": "Ztišit alarm",
      "since": "Poslední změna",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Baterie",
      "temperature": "Teplota",
      "low": "Slabá",
      "model_cylinder": "Kompaktní válec",
      "model_round": "Kulatý",
      "gas_name": "Detektor plynu",
      "gas_alarm": "Plyn!",
      "gas_alarm_at": "Plyn zjištěn v {t}",
      "level": "Koncentrace plynu",
      "open_valve": "Otevřít ventil",
      "close_valve": "Zavřít ventil"
    },
    "da": {
      "name": "Røgalarm",
      "ok": "OK",
      "alarm": "Røg!",
      "co": "Kulilte",
      "test": "Test",
      "fault": "Fejl",
      "low_battery": "Lavt batteri",
      "unavailable": "Utilgængelig",
      "alarm_at": "Røg registreret kl. {t}",
      "co_ppm": "Kulilte: {n} ppm, luft ud!",
      "co_detected": "Kulilte registreret, luft ud!",
      "co_detected_short": "Registreret",
      "fault_detail": "Detektoren melder fejl",
      "test_button": "Test",
      "silence": "Slå alarm fra",
      "since": "Seneste ændring",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Batteri",
      "temperature": "Temperatur",
      "low": "Lav",
      "model_cylinder": "Kompakt cylinder",
      "model_round": "Rund",
      "gas_name": "Gasalarm",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas registreret kl. {t}",
      "level": "Gasniveau",
      "open_valve": "Åbn ventil",
      "close_valve": "Luk ventil"
    },
    "de": {
      "name": "Rauchmelder",
      "ok": "OK",
      "alarm": "Rauch!",
      "co": "Kohlenmonoxid",
      "test": "Test",
      "fault": "Störung",
      "low_battery": "Batterie schwach",
      "unavailable": "Nicht verfügbar",
      "alarm_at": "Rauch erkannt um {t}",
      "co_ppm": "Kohlenmonoxid: {n} ppm, lüften!",
      "co_detected": "Kohlenmonoxid erkannt, lüften!",
      "co_detected_short": "Erkannt",
      "fault_detail": "Der Melder meldet eine Störung",
      "test_button": "Testen",
      "silence": "Alarm stumm",
      "since": "Letzte Änderung",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Batterie",
      "temperature": "Temperatur",
      "low": "Schwach",
      "model_cylinder": "Kompakter Zylinder",
      "model_round": "Rund",
      "gas_name": "Gasmelder",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas erkannt um {t}",
      "level": "Gaskonzentration",
      "open_valve": "Ventil öffnen",
      "close_valve": "Ventil schließen"
    },
    "es": {
      "name": "Detector de humo",
      "ok": "OK",
      "alarm": "¡Humo!",
      "co": "Monóxido de carbono",
      "test": "Prueba",
      "fault": "Avería",
      "low_battery": "Batería baja",
      "unavailable": "No disponible",
      "alarm_at": "Humo detectado a las {t}",
      "co_ppm": "Monóxido de carbono: {n} ppm, ¡ventila!",
      "co_detected": "Monóxido de carbono detectado, ¡ventila!",
      "co_detected_short": "Detectado",
      "fault_detail": "El detector informa de una avería",
      "test_button": "Prueba",
      "silence": "Silenciar alarma",
      "since": "Último cambio",
      "alarm_tile": "Alarma",
      "co_level": "CO",
      "battery": "Batería",
      "temperature": "Temperatura",
      "low": "Baja",
      "model_cylinder": "Cilindro compacto",
      "model_round": "Redondo",
      "gas_name": "Detector de gas",
      "gas_alarm": "¡Gas!",
      "gas_alarm_at": "Gas detectado a las {t}",
      "level": "Nivel de gas",
      "open_valve": "Abrir válvula",
      "close_valve": "Cerrar válvula"
    },
    "fr": {
      "name": "Détecteur de fumée",
      "ok": "OK",
      "alarm": "Fumée !",
      "co": "Monoxyde de carbone",
      "test": "Test",
      "fault": "Défaut",
      "low_battery": "Pile faible",
      "unavailable": "Indisponible",
      "alarm_at": "Fumée détectée à {t}",
      "co_ppm": "Monoxyde de carbone : {n} ppm, aérez !",
      "co_detected": "Monoxyde de carbone détecté, aérez !",
      "co_detected_short": "Détecté",
      "fault_detail": "Le détecteur signale un défaut",
      "test_button": "Tester",
      "silence": "Couper l'alarme",
      "since": "Dernier changement",
      "alarm_tile": "Alarme",
      "co_level": "CO",
      "battery": "Batterie",
      "temperature": "Température",
      "low": "Faible",
      "model_cylinder": "Cylindre compact",
      "model_round": "Rond",
      "gas_name": "Détecteur de gaz",
      "gas_alarm": "Gaz !",
      "gas_alarm_at": "Gaz détecté à {t}",
      "level": "Niveau de gaz",
      "open_valve": "Ouvrir la vanne",
      "close_valve": "Fermer la vanne"
    },
    "hu": {
      "name": "Füstérzékelő",
      "ok": "OK",
      "alarm": "Füst!",
      "co": "Szén-monoxid",
      "test": "Teszt",
      "fault": "Hiba",
      "low_battery": "Alacsony akkuszint",
      "unavailable": "Nem elérhető",
      "alarm_at": "Füst észlelve: {t}",
      "co_ppm": "Szén-monoxid: {n} ppm, szellőztess!",
      "co_detected": "Szén-monoxid észlelve, szellőztess!",
      "co_detected_short": "Észlelve",
      "fault_detail": "Az érzékelő hibát jelez",
      "test_button": "Teszt",
      "silence": "Riasztás némítása",
      "since": "Utolsó változás",
      "alarm_tile": "Riasztás",
      "co_level": "CO",
      "battery": "Akkumulátor",
      "temperature": "Hőmérséklet",
      "low": "Alacsony",
      "model_cylinder": "Kompakt henger",
      "model_round": "Kerek",
      "gas_name": "Gázérzékelő",
      "gas_alarm": "Gáz!",
      "gas_alarm_at": "Gáz észlelve: {t}",
      "level": "Gázszint",
      "open_valve": "Szelep nyitása",
      "close_valve": "Szelep zárása"
    },
    "it": {
      "name": "Rilevatore di fumo",
      "ok": "OK",
      "alarm": "Fumo!",
      "co": "Monossido di carbonio",
      "test": "Test",
      "fault": "Guasto",
      "low_battery": "Batteria scarica",
      "unavailable": "Non disponibile",
      "alarm_at": "Fumo rilevato alle {t}",
      "co_ppm": "Monossido di carbonio: {n} ppm, arieggiare!",
      "co_detected": "Monossido di carbonio rilevato, arieggiare!",
      "co_detected_short": "Rilevato",
      "fault_detail": "Il rilevatore segnala un guasto",
      "test_button": "Prova",
      "silence": "Silenzia allarme",
      "since": "Ultima modifica",
      "alarm_tile": "Allarme",
      "co_level": "CO",
      "battery": "Batteria",
      "temperature": "Temperatura",
      "low": "Scarica",
      "model_cylinder": "Cilindro compatto",
      "model_round": "Rotondo",
      "gas_name": "Rilevatore di gas",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas rilevato alle {t}",
      "level": "Livello di gas",
      "open_valve": "Apri valvola",
      "close_valve": "Chiudi valvola"
    },
    "nb": {
      "name": "Røykvarsler",
      "ok": "OK",
      "alarm": "Røyk!",
      "co": "Karbonmonoksid",
      "test": "Test",
      "fault": "Feil",
      "low_battery": "Lavt batteri",
      "unavailable": "Utilgjengelig",
      "alarm_at": "Røyk oppdaget kl. {t}",
      "co_ppm": "Karbonmonoksid: {n} ppm, luft ut!",
      "co_detected": "Karbonmonoksid oppdaget, luft ut!",
      "co_detected_short": "Oppdaget",
      "fault_detail": "Varsleren melder feil",
      "test_button": "Test",
      "silence": "Demp alarmen",
      "since": "Siste endring",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Batteri",
      "temperature": "Temperatur",
      "low": "Lavt",
      "model_cylinder": "Kompakt sylinder",
      "model_round": "Rund",
      "gas_name": "Gassdetektor",
      "gas_alarm": "Gass!",
      "gas_alarm_at": "Gass oppdaget kl. {t}",
      "level": "Gassnivå",
      "open_valve": "Åpne ventil",
      "close_valve": "Lukk ventil"
    },
    "nl": {
      "name": "Rookmelder",
      "ok": "OK",
      "alarm": "Rook!",
      "co": "Koolmonoxide",
      "test": "Test",
      "fault": "Storing",
      "low_battery": "Batterij bijna leeg",
      "unavailable": "Niet beschikbaar",
      "alarm_at": "Rook gedetecteerd om {t}",
      "co_ppm": "Koolmonoxide: {n} ppm, ventileer!",
      "co_detected": "Koolmonoxide gedetecteerd, ventileer!",
      "co_detected_short": "Gedetecteerd",
      "fault_detail": "De melder meldt een storing",
      "test_button": "Testen",
      "silence": "Alarm dempen",
      "since": "Laatste wijziging",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Batterij",
      "temperature": "Temperatuur",
      "low": "Laag",
      "model_cylinder": "Compacte cilinder",
      "model_round": "Rond",
      "gas_name": "Gasmelder",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas gedetecteerd om {t}",
      "level": "Gasniveau",
      "open_valve": "Klep openen",
      "close_valve": "Klep sluiten"
    },
    "pl": {
      "name": "Czujnik dymu",
      "ok": "OK",
      "alarm": "Dym!",
      "co": "Tlenek węgla",
      "test": "Test",
      "fault": "Usterka",
      "low_battery": "Niski poziom baterii",
      "unavailable": "Niedostępny",
      "alarm_at": "Dym wykryty o {t}",
      "co_ppm": "Tlenek węgla: {n} ppm, przewietrz!",
      "co_detected": "Wykryto tlenek węgla, przewietrz!",
      "co_detected_short": "Wykryto",
      "fault_detail": "Czujnik zgłasza usterkę",
      "test_button": "Test",
      "silence": "Wycisz alarm",
      "since": "Ostatnia zmiana",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Bateria",
      "temperature": "Temperatura",
      "low": "Niski",
      "model_cylinder": "Kompaktowy walec",
      "model_round": "Okrągły",
      "gas_name": "Czujnik gazu",
      "gas_alarm": "Gaz!",
      "gas_alarm_at": "Gaz wykryty o {t}",
      "level": "Poziom gazu",
      "open_valve": "Otwórz zawór",
      "close_valve": "Zamknij zawór"
    },
    "pt-BR": {
      "name": "Detector de fumaça",
      "ok": "OK",
      "alarm": "Fumaça!",
      "co": "Monóxido de carbono",
      "test": "Teste",
      "fault": "Falha",
      "low_battery": "Bateria fraca",
      "unavailable": "Indisponível",
      "alarm_at": "Fumaça detectada às {t}",
      "co_ppm": "Monóxido de carbono: {n} ppm, ventile!",
      "co_detected": "Monóxido de carbono detectado, ventile!",
      "co_detected_short": "Detectado",
      "fault_detail": "O detector indica uma falha",
      "test_button": "Teste",
      "silence": "Silenciar alarme",
      "since": "Última alteração",
      "alarm_tile": "Alarme",
      "co_level": "CO",
      "battery": "Bateria",
      "temperature": "Temperatura",
      "low": "Baixo",
      "model_cylinder": "Cilindro compacto",
      "model_round": "Redondo",
      "gas_name": "Detector de gás",
      "gas_alarm": "Gás!",
      "gas_alarm_at": "Gás detectado às {t}",
      "level": "Nível de gás",
      "open_valve": "Abrir válvula",
      "close_valve": "Fechar válvula"
    },
    "pt-PT": {
      "name": "Detetor de fumo",
      "ok": "OK",
      "alarm": "Fumo!",
      "co": "Monóxido de carbono",
      "test": "Teste",
      "fault": "Avaria",
      "low_battery": "Bateria fraca",
      "unavailable": "Indisponível",
      "alarm_at": "Fumo detetado às {t}",
      "co_ppm": "Monóxido de carbono: {n} ppm, ventile!",
      "co_detected": "Monóxido de carbono detetado, ventile!",
      "co_detected_short": "Detetado",
      "fault_detail": "O detetor indica uma avaria",
      "test_button": "Teste",
      "silence": "Silenciar alarme",
      "since": "Última alteração",
      "alarm_tile": "Alarme",
      "co_level": "CO",
      "battery": "Bateria",
      "temperature": "Temperatura",
      "low": "Baixo",
      "model_cylinder": "Cilindro compacto",
      "model_round": "Redondo",
      "gas_name": "Detetor de gás",
      "gas_alarm": "Gás!",
      "gas_alarm_at": "Gás detetado às {t}",
      "level": "Nível de gás",
      "open_valve": "Abrir válvula",
      "close_valve": "Fechar válvula"
    },
    "ro": {
      "name": "Detector de fum",
      "ok": "OK",
      "alarm": "Fum!",
      "co": "Monoxid de carbon",
      "test": "Test",
      "fault": "Defect",
      "low_battery": "Baterie slabă",
      "unavailable": "Indisponibil",
      "alarm_at": "Fum detectat la {t}",
      "co_ppm": "Monoxid de carbon: {n} ppm, aerisiți!",
      "co_detected": "Monoxid de carbon detectat, aerisiți!",
      "co_detected_short": "Detectat",
      "fault_detail": "Detectorul semnalează un defect",
      "test_button": "Testează",
      "silence": "Oprește alarma",
      "since": "Ultima modificare",
      "alarm_tile": "Alarmă",
      "co_level": "CO",
      "battery": "Baterie",
      "temperature": "Temperatură",
      "low": "Slabă",
      "model_cylinder": "Cilindru compact",
      "model_round": "Rotund",
      "gas_name": "Detector de gaz",
      "gas_alarm": "Gaz!",
      "gas_alarm_at": "Gaz detectat la {t}",
      "level": "Nivel de gaz",
      "open_valve": "Deschide robinetul",
      "close_valve": "Închide robinetul"
    },
    "ru": {
      "name": "Датчик дыма",
      "ok": "Норма",
      "alarm": "Дым!",
      "co": "Угарный газ",
      "test": "Тест",
      "fault": "Неисправность",
      "low_battery": "Батарея разряжена",
      "unavailable": "Недоступно",
      "alarm_at": "Дым обнаружен в {t}",
      "co_ppm": "Угарный газ: {n} ppm, проветрите!",
      "co_detected": "Обнаружен угарный газ, проветрите!",
      "co_detected_short": "Обнаружен",
      "fault_detail": "Датчик сообщает о неисправности",
      "test_button": "Тест",
      "silence": "Выключить сигнал",
      "since": "Последнее изменение",
      "alarm_tile": "Тревога",
      "co_level": "CO",
      "battery": "Батарея",
      "temperature": "Температура",
      "low": "Низкий",
      "model_cylinder": "Компактный цилиндр",
      "model_round": "Круглый",
      "gas_name": "Датчик газа",
      "gas_alarm": "Газ!",
      "gas_alarm_at": "Газ обнаружен в {t}",
      "level": "Уровень газа",
      "open_valve": "Открыть клапан",
      "close_valve": "Закрыть клапан"
    },
    "sr": {
      "name": "Детектор дима",
      "ok": "У реду",
      "alarm": "Дим!",
      "co": "Угљен-моноксид",
      "test": "Тест",
      "fault": "Квар",
      "low_battery": "Слаба батерија",
      "unavailable": "Недоступно",
      "alarm_at": "Дим откривен у {t}",
      "co_ppm": "Угљен-моноксид: {n} ppm, проветрите!",
      "co_detected": "Откривен угљен-моноксид, проветрите!",
      "co_detected_short": "Откривено",
      "fault_detail": "Детектор пријављује квар",
      "test_button": "Тестирај",
      "silence": "Утишај аларм",
      "since": "Последња промена",
      "alarm_tile": "Аларм",
      "co_level": "CO",
      "battery": "Батерија",
      "temperature": "Температура",
      "low": "Слаба",
      "model_cylinder": "Компактни цилиндар",
      "model_round": "Округли",
      "gas_name": "Детектор гаса",
      "gas_alarm": "Гас!",
      "gas_alarm_at": "Гас детектован у {t}",
      "level": "Ниво гаса",
      "open_valve": "Отвори вентил",
      "close_valve": "Затвори вентил"
    },
    "sr-Latn": {
      "name": "Detektor dima",
      "ok": "U redu",
      "alarm": "Dim!",
      "co": "Ugljen-monoksid",
      "test": "Test",
      "fault": "Kvar",
      "low_battery": "Slaba baterija",
      "unavailable": "Nedostupno",
      "alarm_at": "Dim otkriven u {t}",
      "co_ppm": "Ugljen-monoksid: {n} ppm, provetrite!",
      "co_detected": "Otkriven ugljen-monoksid, provetrite!",
      "co_detected_short": "Otkriveno",
      "fault_detail": "Detektor prijavljuje kvar",
      "test_button": "Testiraj",
      "silence": "Utišaj alarm",
      "since": "Poslednja promena",
      "alarm_tile": "Alarm",
      "co_level": "CO",
      "battery": "Baterija",
      "temperature": "Temperatura",
      "low": "Slaba",
      "model_cylinder": "Kompaktni cilindar",
      "model_round": "Okrugli",
      "gas_name": "Detektor gasa",
      "gas_alarm": "Gas!",
      "gas_alarm_at": "Gas detektovan u {t}",
      "level": "Nivo gasa",
      "open_valve": "Otvori ventil",
      "close_valve": "Zatvori ventil"
    }
  };

  // états reconnus : on / off des binary_sensor, et textes des capteurs (toutes langues des traductions)
  const ON_RE = /^(on|true|yes|1|detected|alarm|alarming|triggered|fire|smoke|emergency|active|gas|leak)$/i;
  const OFF_RE = /^(off|false|no|0|clear|idle|ok|normal|none|safe|not_detected|no_smoke|inactive|standby)$/i;
  const SMOKE_WORDS = ['smoke', 'alarm', 'fire', 'fumée', 'fumee', 'feu', 'rauch', 'feuer', 'fumo', 'incendio', 'røyk', 'brann', 'rook', 'brand', 'fum', 'incendiu', 'дым', 'пожар', 'dim', 'požar', 'дим', 'gas', 'gaz', 'methane', 'méthane', 'metan', 'lpg'];

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--sd-ok:var(--appliance-ok-color,#43a047);--sd-alert:var(--appliance-alert-color,#db4437);
  --sd-warn:var(--appliance-warn-color,#ffa000);--sd-cold:var(--appliance-cold-color,#2b9af9);transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ok .badge{background:color-mix(in srgb,var(--sd-ok) 20%,transparent);color:var(--sd-ok)}
.alarm .badge{background:color-mix(in srgb,var(--sd-alert) 22%,transparent);color:var(--sd-alert)}
.co .badge,.low_battery .badge,.fault .badge{background:color-mix(in srgb,var(--sd-warn) 22%,transparent);color:var(--sd-warn)}
.test .badge{background:color-mix(in srgb,var(--sd-cold) 22%,transparent);color:var(--sd-cold)}
ha-card.alarm{box-shadow:0 0 0 1px color-mix(in srgb,var(--sd-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--sd-alert) 30%,transparent)}
ha-card.co{box-shadow:0 0 0 1px color-mix(in srgb,var(--sd-warn) 60%,transparent),0 0 22px color-mix(in srgb,var(--sd-warn) 25%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--sd-alert);font-weight:500;text-align:center}
.alert.on{display:block}.co .alert,.fault .alert{color:var(--sd-warn)}
svg{display:block;width:100%;max-width:calc(200px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.red{background:color-mix(in srgb,var(--sd-alert) 25%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--sd-alert)}.tile.warn .v{color:var(--sd-warn)}
/* ---- illustration ---- */
.sd-led{fill:#2e7d32}
.ok .sd-led{animation:sdbeat 6s infinite}
.alarm .sd-led,.co .sd-led,.test .sd-led{fill:#ff1744;animation:sdfast .5s infinite}
.low_battery .sd-led,.fault .sd-led{fill:#ffa000;animation:sdbeat 3s infinite}
.unavailable .sd-led{fill:#444}
.sd-glow{opacity:0}.alarm .sd-glow,.co .sd-glow,.test .sd-glow{opacity:1;animation:sdfast .5s infinite}
.sd-wave{fill:none;stroke:#ff5252;stroke-width:2.5;opacity:0;transform-box:view-box;transform-origin:100px 54px}
.alarm .sd-wave,.test .sd-wave,.co .sd-wave{animation:sdwave 1.2s ease-out infinite}
.test .sd-wave{stroke:var(--sd-cold)}.co .sd-wave{stroke:var(--sd-warn)}
.sd-wave.w2{animation-delay:.4s}.sd-wave.w3{animation-delay:.8s}
.sd-smoke{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.alarm .sd-smoke{animation:sdsmoke 4s ease-in infinite}
.alarm .sd-smoke.s2{animation-delay:1.3s}.alarm .sd-smoke.s3{animation-delay:2.6s}
.sd-gas{opacity:0}.co .sd-gas{animation:sdgas 3s ease-in-out infinite}
.sd-gc{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.gas .sd-smoke{display:none}
.gas.alarm .sd-gc{animation:sdsmoke 4s ease-in infinite}
.gas.alarm .sd-gc.g2{animation-delay:1.3s}.gas.alarm .sd-gc.g3{animation-delay:2.6s}
.sd-co{opacity:0}.co .sd-co{opacity:1}
.sd-btn{transform-box:fill-box;transform-origin:50% 50%}.test .sd-btn{animation:sdpress 1.2s infinite}
.sd-bat,.sd-fault{opacity:0}.low_battery .sd-bat{opacity:1;animation:sdbeat 2s infinite}.fault .sd-fault{opacity:1}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important}
@keyframes sdbeat{0%,92%,100%{fill-opacity:.25}95%{fill-opacity:1}}
@keyframes sdfast{50%{opacity:.15}}
@keyframes sdwave{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes sdsmoke{0%{opacity:0;transform:translate(0,40px) scale(.6)}25%{opacity:.85}100%{opacity:0;transform:translate(0,-8px) scale(1.4)}}
@keyframes sdpress{0%,100%{transform:scale(1)}30%{transform:scale(.85)}}
@keyframes sdgas{0%,100%{opacity:0;transform:translateY(20px)}50%{opacity:.6;transform:translateY(0)}}
`;

  /* éléments communs aux deux modèles : plafond, fumée, gaz, ondes, pictogrammes pile / défaut */
  const DEFS = `<linearGradient id="sdceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4252"/><stop offset="1" stop-color="#262c38"/></linearGradient>
    <radialGradient id="sdsmk"><stop offset="0" stop-color="#9aa3ad" stop-opacity=".9"/><stop offset="1" stop-color="#9aa3ad" stop-opacity="0"/></radialGradient>
    <radialGradient id="sdgasg"><stop offset="0" stop-color="#ffb74d" stop-opacity=".7"/><stop offset="1" stop-color="#ffb74d" stop-opacity="0"/></radialGradient>
    <radialGradient id="sdglowg"><stop offset="0" stop-color="#ff1744" stop-opacity=".8"/><stop offset="1" stop-color="#ff1744" stop-opacity="0"/></radialGradient>`;
  const BACK = `<rect x="0" y="0" width="200" height="12" fill="url(#sdceil)"/>
    <ellipse class="sd-smoke" cx="72" cy="122" rx="30" ry="14" fill="url(#sdsmk)"/>
    <ellipse class="sd-smoke s2" cx="128" cy="126" rx="34" ry="15" fill="url(#sdsmk)"/>
    <ellipse class="sd-smoke s3" cx="100" cy="114" rx="26" ry="12" fill="url(#sdsmk)"/>
    <ellipse class="sd-gc" cx="72" cy="122" rx="30" ry="14" fill="url(#sdgasg)"/>
    <ellipse class="sd-gc g2" cx="128" cy="126" rx="34" ry="15" fill="url(#sdgasg)"/>
    <ellipse class="sd-gc g3" cx="100" cy="114" rx="26" ry="12" fill="url(#sdgasg)"/>
    <ellipse class="sd-gas" cx="100" cy="120" rx="64" ry="18" fill="url(#sdgasg)"/>
    ${['', ' w2', ' w3'].map((w) => `<path class="sd-wave${w}" d="M54 70 Q44 54 54 38 M146 70 Q156 54 146 38"/>`).join('')}`;
  const ICONS = `<g class="sd-bat"><rect x="146" y="80" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="168" y="83" width="3" height="6" fill="#ffa000"/><rect x="149" y="83" width="4" height="6" fill="#ffa000"/></g>
    <g class="sd-fault"><path d="M157 76 L171 100 H143 Z" fill="#ffa000"/><path d="M157 84 V92" stroke="#222" stroke-width="2.4"/><circle cx="157" cy="96" r="1.4" fill="#222"/></g>`;

  const MODELS = {
    // cylindre compact : embase évasée, bouton-LED carré, bande grillagée
    cylinder: `<defs>${DEFS}
      <linearGradient id="sdcyl" x1="0" x2="1"><stop offset="0" stop-color="#c9cfd6"/><stop offset=".35" stop-color="#ffffff"/><stop offset=".6" stop-color="#f4f6f8"/><stop offset="1" stop-color="#b9c0c8"/></linearGradient>
      <linearGradient id="sdmesh" x1="0" x2="1"><stop offset="0" stop-color="#7d858e"/><stop offset=".35" stop-color="#e3e7eb"/><stop offset=".6" stop-color="#c5cbd1"/><stop offset="1" stop-color="#6f7780"/></linearGradient>
      <pattern id="sdholes" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#000" fill-opacity=".35"/></pattern></defs>
      ${BACK}
      <path d="M58 12 H142 L136 22 H64 Z" fill="url(#sdcyl)"/><path d="M64 22 H136" stroke="#9aa3ad" stroke-width="1"/>
      <rect x="66" y="22" width="68" height="36" fill="url(#sdcyl)"/>
      <rect x="66" y="58" width="68" height="14" fill="url(#sdmesh)"/><rect x="66" y="58" width="68" height="14" fill="url(#sdholes)"/>
      <path d="M66 58 H134 M66 72 H134" stroke="#8a929b" stroke-width=".8"/>
      <rect x="66" y="72" width="68" height="22" fill="url(#sdcyl)"/>
      <ellipse cx="100" cy="94" rx="34" ry="5" fill="#dfe4e9" stroke="#b5bdc6" stroke-width=".8"/><ellipse cx="100" cy="94.5" rx="9" ry="2" fill="#c7ced6"/>
      <text class="sd-co" x="100" y="86" text-anchor="middle" font-size="8" font-weight="700" fill="#e65100" font-family="sans-serif">CO</text>
      <circle class="sd-glow" cx="100" cy="38" r="16" fill="url(#sdglowg)"/>
      <rect class="sd-btn" x="94" y="32" width="12" height="12" rx="3" fill="#e3e7eb" stroke="#c2c9d1" stroke-width=".8"/>
      <rect class="sd-led" x="96" y="34" width="8" height="8" rx="2"/>
      ${ICONS}`,
    // rond plat classique : socle, corps à fentes, bouton test et LED dessous
    round: `<defs>${DEFS}
      <linearGradient id="sdbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#cfd5dc"/></linearGradient></defs>
      ${BACK}
      <rect x="56" y="12" width="88" height="8" rx="2" fill="#e6eaef"/>
      <path d="M48 20 H152 Q152 50 140 56 H60 Q48 50 48 20 Z" fill="url(#sdbody)"/>
      <g stroke="#aab2bc" stroke-width="2.4" stroke-linecap="round"><path d="M58 30 V44 M68 30 V46 M78 30 V47 M122 30 V47 M132 30 V46 M142 30 V44"/></g>
      <text class="sd-co" x="100" y="42" text-anchor="middle" font-size="9" font-weight="700" fill="#e65100" font-family="sans-serif">CO</text>
      <ellipse cx="100" cy="56" rx="40" ry="7" fill="#e9edf2" stroke="#c4cbd3"/>
      <circle class="sd-glow" cx="124" cy="55" r="12" fill="url(#sdglowg)"/>
      <ellipse class="sd-btn" cx="100" cy="56" rx="13" ry="3.6" fill="#d7dde4" stroke="#b5bdc6"/>
      <circle class="sd-led" cx="124" cy="55" r="2.8"/>
      ${ICONS}`,
  };
  const SVG = (model, label) => `<svg viewBox="25 0 150 140" role="img" aria-label="${String(label).replace(/[&<>"]/g, '')}">${MODELS[model] || MODELS.cylinder}</svg>`;

  const TILES = [['since', 'mdi:clock-outline', 'show_since'], ['co_level', 'mdi:molecule-co', 'show_co'], ['battery', 'mdi:battery', 'show_battery'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['level', 'mdi:gauge', 'show_level']];

  class ApplianceSmokeDetectorCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const smoke = ids.find((i) => i.startsWith('binary_sensor.') && dc(i) === 'smoke') || ids.find((i) => /(smoke|fumee|fumée|rauch)/i.test(i)) || '';
      const dev = smoke.split('.')[1] || '\u0000';
      return {
        entity_smoke: smoke,
        entity_battery: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'battery' && i.includes(dev.split('_')[0])) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'cylinder', co_threshold: 50, battery_low: 20, show_status: true, show_since: true, show_co: true, show_battery: true, show_temperature: true, show_level: true, show_buttons: true, ...c };
      // mode gaz : detector: gas, ou model: gas (alias) ; le dessin reste celui du détecteur de fumée
      if (c.model === 'gas') this._c.model = 'cylinder', this._c.detector = 'gas';
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    // textes : labels (config) > variante gaz (gas_<clé>) > langue > anglais
    _t(k) {
      const L = this._c && this._c.labels;
      if (L && L[k] != null && L[k] !== '') return String(L[k]);
      const tr = T[this._lang()];
      if (this._c && this._c.detector === 'gas') { const g = tr['gas_' + k] ?? T.en['gas_' + k]; if (g != null) return g; }
      return tr[k] ?? T.en[k] ?? k;
    }
    _l(k) { return this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // vrai si l'état annonce une alarme : on / detected / texte « fumée »…
    _on(s, words = []) {
      if (!this._ok(s)) return false;
      const v = String(s.state).trim().toLowerCase();
      if (OFF_RE.test(v) || /^(no|not|pas|kein|nessun|ingen|geen|nu |нет|nema)\b/.test(v)) return false;
      return ON_RE.test(v) || words.some((w) => (w.length > 3 ? v.includes(w) : v === w)); // mots courts : égalité stricte
    }
    _time(iso) {
      const t = Date.parse(iso); if (!t) return '--';
      const d = new Date(t), loc = this._lang(), time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
      return d.toDateString() === new Date().toDateString() ? time : `${d.toLocaleDateString(loc, { day: 'numeric', month: 'short' })} ${time}`;
    }
    _call(id, pressLike) {
      if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const off = { switch: 'turn_off', siren: 'turn_off', input_boolean: 'turn_off', light: 'turn_off' };
      const [d, s] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'] }[dom]
        || (pressLike ? [dom, 'turn_on'] : off[dom] ? [dom, off[dom]] : ['homeassistant', 'turn_off']);
      this._hass.callService(d, s, { entity_id: id });
    }

    _compute() {
      const c = this._c;
      const sS = this._st(c.entity_smoke), coS = this._st(c.entity_co);
      const smoke = this._on(sS, SMOKE_WORDS);
      // CO : binary_sensor, ou capteur en ppm comparé à co_threshold
      const coPpm = this._num(coS), coNumeric = !isNaN(coPpm) && !/^binary_sensor\./.test(c.entity_co || '');
      const co = coNumeric ? coPpm >= Number(c.co_threshold) : this._on(coS, ['co', 'carbon', 'monoxy', 'gas', 'gaz']);
      const test = this._on(this._st(c.entity_test), ['test']) || /test/i.test(String(sS && sS.state));
      const fault = this._on(this._st(c.entity_fault), ['fault', 'error', 'défaut', 'tamper', 'problem']);
      // batterie : capteur en %, ou binary_sensor battery (on = faible)
      const bS = this._st(c.entity_battery), bat = this._num(bS);
      const batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const low = batBinary ? this._on(bS) : !isNaN(bat) && bat < Number(c.battery_low);
      const st = !this._ok(sS) && !this._ok(coS) ? 'unavailable' : smoke ? 'alarm' : co ? 'co' : test ? 'test' : fault ? 'fault' : low ? 'low_battery' : 'ok';
      const vS = this._st(c.entity_valve), valveClosed = this._ok(vS) && /^(off|closed|closing)$/i.test(String(vS.state));
      return { st, sS, coS, coPpm, coNumeric, bS, bat, batBinary, low, valveClosed };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="sdtitle"></div><div class="badge" id="sdbadge"></div></div>
        ${SVG(this._c.model, this._c.name || this._t('name'))}
        <div class="alert" id="sdalert"></div>
        <div class="ctl" id="sdctl"><button id="sdvalve"><ha-icon icon="mdi:valve"></ha-icon><span></span></button><button id="sdtest"><ha-icon icon="mdi:gesture-tap-button"></ha-icon><span></span></button><button class="red" id="sdmute"><ha-icon icon="mdi:volume-off"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_smoke || this._c.entity_co));
      root.getElementById('sdtest').addEventListener('click', () => this._call(this._c.entity_test_button, true));
      root.getElementById('sdmute').addEventListener('click', () => this._call(this._c.entity_silence || this._c.entity_siren, false));
      // vanne de coupure (gaz) : bascule, comme sur la carte détecteur de fuite
      root.getElementById('sdvalve').addEventListener('click', () => {
        const id = this._c.entity_valve; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        this._hass.callService(['switch', 'valve', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ since: c.entity_smoke, co_level: c.entity_co, battery: c.entity_battery, temperature: c.entity_temperature, level: c.entity_level }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, sS, coS, coPpm, coNumeric, bS, bat, batBinary, low, valveClosed } = this._compute();
      card.className = st + (c.detector === 'gas' ? ' gas' : '') + (c.animations === false ? ' noanim' : '');
      r.getElementById('sdtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('sdbadge');
      badge.textContent = this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('sdalert');
      al.textContent = st === 'alarm' ? this._t('alarm_at').replace('{t}', this._time(sS.last_changed))
        : st === 'co' ? (coNumeric ? this._t('co_ppm').replace('{n}', String(Math.round(coPpm))) : this._t('co_detected'))
          : st === 'fault' ? this._t('fault_detail') : '';
      al.classList.toggle('on', !!al.textContent);

      // « Tester » hors alarme, « Couper l'alarme » seulement pendant une alarme
      const alarming = st === 'alarm' || st === 'co';
      const bt = r.getElementById('sdtest'), bm = r.getElementById('sdmute');
      const bv = r.getElementById('sdvalve');
      bv.classList.toggle('hide', !c.entity_valve);
      bv.classList.toggle('red', alarming && !valveClosed);
      bv.querySelector('span').textContent = this._t(valveClosed ? 'open_valve' : 'close_valve');
      bt.classList.toggle('hide', !c.entity_test_button || alarming);
      bm.classList.toggle('hide', !(c.entity_silence || c.entity_siren) || !alarming);
      bt.querySelector('span').textContent = this._t('test_button');
      bm.querySelector('span').textContent = this._t('silence');
      r.getElementById('sdctl').classList.toggle('hide', c.show_buttons === false || (bt.classList.contains('hide') && bm.classList.contains('hide') && bv.classList.contains('hide')));

      const lvS = this._st(c.entity_level), tS = this._st(c.entity_temperature), tc = window.applianceTemp ? window.applianceTemp(this._hass, c) : null;
      const temp = this._num(tS), tempV = tc ? tc.conv(temp, tS) : temp;
      const V = {
        since: [c.entity_smoke, this._ok(sS) ? this._time(sS.last_changed) : '--', '', ''],
        co_level: [coNumeric || c.entity_co, coNumeric ? String(Math.round(coPpm)) : this._t(this._ok(coS) ? (st === 'co' ? 'co_detected_short' : 'ok') : 'unavailable'), coNumeric ? 'ppm' : '', st === 'co' ? 'bad' : ''],
        battery: [c.entity_battery, batBinary ? this._t(low ? 'low' : 'ok') : isNaN(bat) ? '--' : String(Math.round(bat)), batBinary ? '' : '%', low ? 'warn' : ''],
        level: [c.entity_level, isNaN(this._num(lvS)) ? '--' : (Math.round(this._num(lvS) * 10) / 10).toLocaleString(window.applianceLocale(this._c, this._hass)), (lvS && lvS.attributes && lvS.attributes.unit_of_measurement) || '', st === 'alarm' ? 'bad' : ''],
        temperature: [c.entity_temperature, isNaN(tempV) ? '--' : (Math.round(tempV * 10) / 10).toLocaleString(window.applianceLocale(this._c, this._hass)), tc ? tc.unit : '°C', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', cls === 'bad'); el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k === 'since' && st === 'alarm' ? 'alarm_tile' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSmokeDetectorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSmokeDetectorCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = T[window.applianceLang(T, null, this._hass)] || T.en;
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'cylinder', label: tr.model_cylinder }, { value: 'round', label: tr.model_round }] } } },
        { name: 'detector', selector: { select: { mode: 'dropdown', options: [{ value: 'smoke', label: tr.name }, { value: 'gas', label: tr.gas_name || T.en.gas_name }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_smoke', ['binary_sensor', 'sensor', 'input_boolean', 'switch', 'event']),
        ent('entity_co', ['binary_sensor', 'sensor']),
        { name: 'co_threshold', default: 50, selector: { number: { min: 1, max: 1000, step: 1, mode: 'box', unit_of_measurement: 'ppm' } } },
        ent('entity_test', ['binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_test_button', ['button', 'input_button', 'script', 'switch']),
        ent('entity_silence', ['button', 'input_button', 'switch', 'siren', 'script', 'input_boolean']),
        ent('entity_siren', 'siren'),
        ent('entity_level', 'sensor'),
        ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        ent('entity_fault', 'binary_sensor'),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_temperature', 'sensor'),
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_co'), bool('show_battery'), bool('show_temperature'), bool('show_level'), bool('show_buttons'), bool('animations')] },
      ].filter(Boolean);
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSmokeDetectorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Détecteur de fumée ou de gaz animé (2 modèles) : alarme, CO, test, pile faible, défaut, boutons Tester et Couper l\'alarme.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/smoke-detector.md',
  });
})();
