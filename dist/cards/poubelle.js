/* Carte « Poubelle » — custom:appliance-poubelle-card
 * Poubelle animée pour les jours de collecte : se remplit au fil des jours, tremble la veille, saute le jour J, brille une fois vidée.
 * Intégrée depuis skyrotter/ha-poubelle-card (MIT), fusionnée en une seule carte autonome : localize, normalize, schedule,
 * calendars, assets, éditeur puis carte. Les traductions viennent de la section « poubelle » de src/i18n/*.json.
 */
(() => {
  const TAG = 'appliance-poubelle-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

/* Translations live in src/lang/<code>.json and are bundled into the card at build time.
 * To add a language: copy en.json to <code>.json (HA language code, e.g. de, pt-BR), translate the values,
 * and add it to LANGS below. Missing keys fall back to English. Day and month names come from Intl. */

// traductions : section « poubelle » de src/i18n/<langue>.json, remplie à la compilation (langue absente → anglais)
const LANGS = {"en":{"language_name":"English","card":{"bin":{"grey":"Grey bin","black":"Black bin","yellow":"Yellow bin","green":"Green bin","blue":"Blue bin","brown":"Brown bin","red":"Red bin","purple":"Purple bin","burgundy":"Burgundy bin","lime":"Lime green bin"},"bag":{"grey":"Grey bag","black":"Black bag","yellow":"Yellow bag","green":"Green bag","blue":"Blue bag","brown":"Brown bag","red":"Red bag","purple":"Purple bag","burgundy":"Burgundy bag","lime":"Lime green bag"},"bulky":"Bulky waste","emptied":"Emptied","emptied_txt":"Emptied today ✅","today":"Pickup","today_txt":"Pickup today 🚛","eve":"Tonight","eve_txt":"Put it out tonight! 🌙","in_days":"In {n} d","next_weekday":"Pickup on {day}","next_date":"Pickup on {date}","fill":"Fill level","unknown":"Unknown date","moved":"moved (public holiday)","warn_no_holiday_calendar":"No holiday calendar found: add the Holiday integration","warn_no_workday_calendar":"No workday calendar found: add the Workday integration"},"editor":{"labels":{"bin":"Colour","name":"Name","container":"Container","image":"Custom image (replaces the drawing)","entity":"Entity (optional)","calendar_filter":"Calendar filter (title contains)","calendar_offset":"Calendar offset (days)","days":"Pickup days","start_date":"Start date (a known pickup)","every":"Every N weeks","weeks":"Weeks","month_week":"Once a month","month_day":"Day of month (1–31)","months":"Pickup months (empty = all year)","holidays":"Public holidays","holiday_calendar":"Holiday calendar","workday_calendar":"Workday calendar","hour":"Pickup hour","interval":"Days between pickups","scale":"Size","headroom":"Headroom","compact":"Compact","show_meter":"Fill meter","show_status":"Status text","theme_background":"HA theme background","full_color":"Fully coloured bin","language":"Language"},"helpers":{"entity":"Sensor, calendar or input_datetime giving the next pickup. Leave empty to use the schedule below.","start_date":"Any date the bin was or will be collected. Pickups repeat every N weeks from it.","every":"1 = weekly, 2 = fortnightly, 4 = every four weeks. Needs a start date.","weeks":"ISO week parity. Ignored when a start date is set.","holidays":"What happens when a pickup falls on a public holiday.","holiday_calendar":"Calendar from the Holiday integration. Found automatically if left empty.","workday_calendar":"Calendar from the Workday integration, used by “next work day”. Found automatically if left empty.","hour":"Time the truck comes; after it the bin shows as emptied.","interval":"Only used with a sensor entity, to estimate the fill level."},"options":{"container":{"wheelie_bin":"Wheelie bin","bag":"Rubbish bag","bulky":"Bulky waste"},"weeks":{"all":"Every week","even":"Even weeks","odd":"Odd weeks"},"month_week":{"1":"1st of the month","2":"2nd of the month","3":"3rd of the month","4":"4th of the month","":"Every week","last":"Last of the month"},"holidays":{"none":"Ignore holidays","next_day":"Move to the next day","next_work_day":"Move to the next work day","shift_week":"Skip to the following week","shift_rest_of_week":"Rest of the week moves +1 day","cancel":"Cancelled"},"language":{"auto":"Automatic (Home Assistant language)"}}},"errors":{"bin_required":"Set “bin” ({bins})","bin_unknown":"Unknown bin “{bin}” (use {bins})","schedule_required":"Set “days” (e.g. [1, 4]), “start_date”, “month_day” or “entity”","start_date_invalid":"“start_date” must be a date such as 2026-11-04","holidays_unknown":"Unknown “holidays” value “{value}” (use {values})"}},"cs":{"language_name":"Čeština","card":{"bin":{"grey":"Šedá popelnice","black":"Černá popelnice","yellow":"Žlutá popelnice","green":"Zelená popelnice","blue":"Modrá popelnice","brown":"Hnědá popelnice","red":"Červená popelnice","purple":"Fialová popelnice","burgundy":"Vínová popelnice","lime":"Limetková popelnice"},"bag":{"grey":"Šedý pytel","black":"Černý pytel","yellow":"Žlutý pytel","green":"Zelený pytel","blue":"Modrý pytel","brown":"Hnědý pytel","red":"Červený pytel","purple":"Fialový pytel","burgundy":"Vínový pytel","lime":"Limetkový pytel"},"bulky":"Objemný odpad","emptied":"Vyvezeno","emptied_txt":"Dnes vyvezeno ✅","today":"Svoz","today_txt":"Dnes svoz 🚛","eve":"Dnes večer","eve_txt":"Vystav ji dnes večer! 🌙","in_days":"Za {n} d","next_weekday":"Svoz: {day}","next_date":"Svoz: {date}","fill":"Naplněnost","unknown":"Neznámé datum","moved":"posunuto (státní svátek)","warn_no_holiday_calendar":"Nenalezen kalendář svátků: přidej integraci Holiday","warn_no_workday_calendar":"Nenalezen kalendář pracovních dnů: přidej integraci Workday"},"editor":{"labels":{"bin":"Barva","name":"Název","container":"Nádoba","image":"Vlastní obrázek (nahradí kresbu)","entity":"Entita (volitelné)","calendar_filter":"Filtr kalendáře (název obsahuje)","calendar_offset":"Posun kalendáře (dny)","days":"Dny svozu","start_date":"Počáteční datum (známý svoz)","every":"Každých N týdnů","weeks":"Týdny","month_week":"Jednou za měsíc","month_day":"Den v měsíci (1–31)","months":"Měsíce svozu (prázdné = celý rok)","holidays":"Státní svátky","holiday_calendar":"Kalendář svátků","workday_calendar":"Kalendář pracovních dnů","hour":"Hodina svozu","interval":"Dny mezi svozy","scale":"Velikost","headroom":"Volný prostor nahoře","compact":"Kompaktní","show_meter":"Ukazatel naplnění","show_status":"Text stavu","theme_background":"Pozadí motivu HA","full_color":"Celá popelnice barevná","language":"Jazyk"},"helpers":{"entity":"Senzor, kalendář nebo input_datetime s dalším svozem. Nech prázdné pro použití plánu níže.","start_date":"Libovolné datum, kdy byla nebo bude nádoba vyvezena. Svozy se od něj opakují každých N týdnů.","every":"1 = týdně, 2 = každé dva týdny, 4 = každé čtyři týdny. Vyžaduje počáteční datum.","weeks":"Parita ISO týdne. Ignoruje se, pokud je nastaveno počáteční datum.","holidays":"Co se stane, když svoz připadne na státní svátek.","holiday_calendar":"Kalendář z integrace Holiday. Pokud je prázdné, najde se automaticky.","workday_calendar":"Kalendář z integrace Workday, používaný volbou „další pracovní den“. Pokud je prázdné, najde se automaticky.","hour":"Čas, kdy přijede popelářské auto; poté se nádoba zobrazí jako vyvezená.","interval":"Používá se jen se senzorem, k odhadu naplnění."},"options":{"container":{"wheelie_bin":"Popelnice na kolečkách","bag":"Pytel na odpadky","bulky":"Objemný odpad"},"weeks":{"all":"Každý týden","even":"Sudé týdny","odd":"Liché týdny"},"month_week":{"1":"1. v měsíci","2":"2. v měsíci","3":"3. v měsíci","4":"4. v měsíci","":"Každý týden","last":"Poslední v měsíci"},"holidays":{"none":"Ignorovat svátky","next_day":"Posunout na další den","next_work_day":"Posunout na další pracovní den","shift_week":"Přeskočit na další týden","shift_rest_of_week":"Zbytek týdne +1 den","cancel":"Zrušeno"},"language":{"auto":"Automaticky (jazyk Home Assistantu)"}}},"errors":{"bin_required":"Nastav „bin“ ({bins})","bin_unknown":"Neznámá popelnice „{bin}“ (použij {bins})","schedule_required":"Nastav „days“ (např. [1, 4]), „start_date“, „month_day“ nebo „entity“","start_date_invalid":"„start_date“ musí být datum, např. 2026-11-04","holidays_unknown":"Neznámá hodnota „holidays“ „{value}“ (použij {values})"}},"da":{"language_name":"Dansk","card":{"bin":{"grey":"Grå beholder","black":"Sort beholder","yellow":"Gul beholder","green":"Grøn beholder","blue":"Blå beholder","brown":"Brun beholder","red":"Rød beholder","purple":"Lilla beholder","burgundy":"Bordeaux beholder","lime":"Limegrøn beholder"},"bag":{"grey":"Grå sæk","black":"Sort sæk","yellow":"Gul sæk","green":"Grøn sæk","blue":"Blå sæk","brown":"Brun sæk","red":"Rød sæk","purple":"Lilla sæk","burgundy":"Bordeaux sæk","lime":"Limegrøn sæk"},"bulky":"Storskrald","emptied":"Tømt","emptied_txt":"Tømt i dag ✅","today":"Afhentning","today_txt":"Afhentning i dag 🚛","eve":"I aften","eve_txt":"Sæt den ud i aften! 🌙","in_days":"Om {n} d","next_weekday":"Afhentning {day}","next_date":"Afhentning {date}","fill":"Fyldningsgrad","unknown":"Ukendt dato","moved":"flyttet (helligdag)","warn_no_holiday_calendar":"Ingen helligdagskalender fundet: tilføj integrationen Holiday","warn_no_workday_calendar":"Ingen arbejdsdagskalender fundet: tilføj integrationen Workday"},"editor":{"labels":{"bin":"Farve","name":"Navn","container":"Beholder","image":"Eget billede (erstatter tegningen)","entity":"Entitet (valgfri)","calendar_filter":"Kalenderfilter (titel indeholder)","calendar_offset":"Kalenderforskydning (dage)","days":"Afhentningsdage","start_date":"Startdato (en kendt afhentning)","every":"Hver N. uge","weeks":"Uger","month_week":"Én gang om måneden","month_day":"Dag i måneden (1–31)","months":"Afhentningsmåneder (tom = hele året)","holidays":"Helligdage","holiday_calendar":"Helligdagskalender","workday_calendar":"Arbejdsdagskalender","hour":"Afhentningstidspunkt","interval":"Dage mellem afhentninger","scale":"Størrelse","headroom":"Frihøjde","compact":"Kompakt","show_meter":"Fyldningsmåler","show_status":"Statustekst","theme_background":"HA-temabaggrund","full_color":"Helt farvet beholder","language":"Sprog"},"helpers":{"entity":"Sensor, kalender eller input_datetime med næste afhentning. Lad stå tomt for at bruge planen nedenfor.","start_date":"En vilkårlig dato, hvor beholderen blev eller bliver tømt. Afhentningerne gentages hver N. uge herfra.","every":"1 = ugentlig, 2 = hver anden uge, 4 = hver fjerde uge. Kræver en startdato.","weeks":"ISO-ugeparitet. Ignoreres, når en startdato er angivet.","holidays":"Hvad der sker, når en afhentning falder på en helligdag.","holiday_calendar":"Kalender fra integrationen Holiday. Findes automatisk, hvis tom.","workday_calendar":"Kalender fra integrationen Workday, bruges af \"næste arbejdsdag\". Findes automatisk, hvis tom.","hour":"Tidspunktet, hvor renovationsbilen kommer; derefter vises beholderen som tømt.","interval":"Bruges kun med en sensor-entitet til at estimere fyldningsgraden."},"options":{"container":{"wheelie_bin":"Skraldespand med hjul","bag":"Affaldssæk","bulky":"Storskrald"},"weeks":{"all":"Hver uge","even":"Lige uger","odd":"Ulige uger"},"month_week":{"1":"1. i måneden","2":"2. i måneden","3":"3. i måneden","4":"4. i måneden","":"Hver uge","last":"Sidste i måneden"},"holidays":{"none":"Ignorer helligdage","next_day":"Flyt til næste dag","next_work_day":"Flyt til næste arbejdsdag","shift_week":"Spring til næste uge","shift_rest_of_week":"Resten af ugen rykker +1 dag","cancel":"Aflyst"},"language":{"auto":"Automatisk (Home Assistants sprog)"}}},"errors":{"bin_required":"Angiv \"bin\" ({bins})","bin_unknown":"Ukendt beholder \"{bin}\" (brug {bins})","schedule_required":"Angiv \"days\" (f.eks. [1, 4]), \"start_date\", \"month_day\" eller \"entity\"","start_date_invalid":"\"start_date\" skal være en dato som 2026-11-04","holidays_unknown":"Ukendt \"holidays\"-værdi \"{value}\" (brug {values})"}},"de":{"language_name":"Deutsch","card":{"bin":{"grey":"Graue Tonne","black":"Schwarze Tonne","yellow":"Gelbe Tonne","green":"Grüne Tonne","blue":"Blaue Tonne","brown":"Braune Tonne","red":"Rote Tonne","purple":"Violette Tonne","burgundy":"Bordeauxrote Tonne","lime":"Hellgrüne Tonne"},"bag":{"grey":"Grauer Sack","black":"Schwarzer Sack","yellow":"Gelber Sack","green":"Grüner Sack","blue":"Blauer Sack","brown":"Brauner Sack","red":"Roter Sack","purple":"Violetter Sack","burgundy":"Bordeauxroter Sack","lime":"Hellgrüner Sack"},"bulky":"Sperrmüll","emptied":"Geleert","emptied_txt":"Heute geleert ✅","today":"Abholung","today_txt":"Heute Abholung 🚛","eve":"Heute Abend","eve_txt":"Heute Abend rausstellen! 🌙","in_days":"In {n} T.","next_weekday":"Abholung am {day}","next_date":"Abholung am {date}","fill":"Füllstand","unknown":"Unbekanntes Datum","moved":"verschoben (Feiertag)","warn_no_holiday_calendar":"Kein Feiertagskalender gefunden: Integration „Holiday“ hinzufügen","warn_no_workday_calendar":"Kein Arbeitstagkalender gefunden: Integration „Workday“ hinzufügen"},"editor":{"labels":{"bin":"Farbe","name":"Name","container":"Behälter","image":"Eigenes Bild (ersetzt die Zeichnung)","entity":"Entität (optional)","calendar_filter":"Kalenderfilter (Titel enthält)","calendar_offset":"Kalenderversatz (Tage)","days":"Abholtage","start_date":"Startdatum (bekannte Abholung)","every":"Alle N Wochen","weeks":"Wochen","month_week":"Einmal im Monat","month_day":"Tag des Monats (1–31)","months":"Abholmonate (leer = ganzjährig)","holidays":"Feiertage","holiday_calendar":"Feiertagskalender","workday_calendar":"Arbeitstagkalender","hour":"Abholzeit","interval":"Tage zwischen Abholungen","scale":"Größe","headroom":"Kopffreiheit","compact":"Kompakt","show_meter":"Füllstandsanzeige","show_status":"Statustext","theme_background":"HA-Theme-Hintergrund","full_color":"Komplett eingefärbte Tonne","language":"Sprache"},"helpers":{"entity":"Sensor, Kalender oder input_datetime mit der nächsten Abholung. Leer lassen, um den Plan unten zu verwenden.","start_date":"Ein beliebiges Datum, an dem die Tonne geleert wurde oder wird. Ab hier wiederholt sich die Abholung alle N Wochen.","every":"1 = wöchentlich, 2 = alle zwei Wochen, 4 = alle vier Wochen. Benötigt ein Startdatum.","weeks":"ISO-Wochenparität. Wird ignoriert, wenn ein Startdatum gesetzt ist.","holidays":"Was passiert, wenn eine Abholung auf einen Feiertag fällt.","holiday_calendar":"Kalender der Integration „Holiday“. Wird automatisch gefunden, wenn leer.","workday_calendar":"Kalender der Integration „Workday“, verwendet von „nächster Arbeitstag“. Wird automatisch gefunden, wenn leer.","hour":"Uhrzeit, zu der das Müllauto kommt; danach gilt die Tonne als geleert.","interval":"Nur mit einer Sensor-Entität, zur Schätzung des Füllstands."},"options":{"container":{"wheelie_bin":"Mülltonne","bag":"Müllsack","bulky":"Sperrmüll"},"weeks":{"all":"Jede Woche","even":"Gerade Wochen","odd":"Ungerade Wochen"},"month_week":{"1":"1. im Monat","2":"2. im Monat","3":"3. im Monat","4":"4. im Monat","":"Jede Woche","last":"Letzte im Monat"},"holidays":{"none":"Feiertage ignorieren","next_day":"Auf den nächsten Tag verschieben","next_work_day":"Auf den nächsten Arbeitstag verschieben","shift_week":"In die folgende Woche überspringen","shift_rest_of_week":"Rest der Woche +1 Tag","cancel":"Entfällt"},"language":{"auto":"Automatisch (Sprache von Home Assistant)"}}},"errors":{"bin_required":"„bin“ festlegen ({bins})","bin_unknown":"Unbekannte Tonne „{bin}“ ({bins} verwenden)","schedule_required":"„days“ festlegen (z. B. [1, 4]), „start_date“, „month_day“ oder „entity“","start_date_invalid":"„start_date“ muss ein Datum wie 2026-11-04 sein","holidays_unknown":"Unbekannter „holidays“-Wert „{value}“ ({values} verwenden)"}},"es":{"language_name":"Español","card":{"bin":{"grey":"Cubo gris","black":"Cubo negro","yellow":"Cubo amarillo","green":"Cubo verde","blue":"Cubo azul","brown":"Cubo marrón","red":"Cubo rojo","purple":"Cubo morado","burgundy":"Cubo burdeos","lime":"Cubo verde lima"},"bag":{"grey":"Bolsa gris","black":"Bolsa negra","yellow":"Bolsa amarilla","green":"Bolsa verde","blue":"Bolsa azul","brown":"Bolsa marrón","red":"Bolsa roja","purple":"Bolsa morada","burgundy":"Bolsa burdeos","lime":"Bolsa verde lima"},"bulky":"Voluminosos","emptied":"Vaciado","emptied_txt":"Vaciado hoy ✅","today":"Recogida","today_txt":"Recogida hoy 🚛","eve":"Esta noche","eve_txt":"¡Sácalo esta noche! 🌙","in_days":"En {n} d","next_weekday":"Recogida el {day}","next_date":"Recogida el {date}","fill":"Nivel de llenado","unknown":"Fecha desconocida","moved":"aplazada (festivo)","warn_no_holiday_calendar":"No se encontró calendario de festivos: añade la integración Holiday","warn_no_workday_calendar":"No se encontró calendario laboral: añade la integración Workday"},"editor":{"labels":{"bin":"Color","name":"Nombre","container":"Contenedor","image":"Imagen personalizada (sustituye el dibujo)","entity":"Entidad (opcional)","calendar_filter":"Filtro de calendario (el título contiene)","calendar_offset":"Desfase del calendario (días)","days":"Días de recogida","start_date":"Fecha de inicio (una recogida conocida)","every":"Cada N semanas","weeks":"Semanas","month_week":"Una vez al mes","month_day":"Día del mes (1–31)","months":"Meses de recogida (vacío = todo el año)","holidays":"Festivos","holiday_calendar":"Calendario de festivos","workday_calendar":"Calendario laboral","hour":"Hora de recogida","interval":"Días entre recogidas","scale":"Tamaño","headroom":"Espacio superior","compact":"Compacto","show_meter":"Medidor de llenado","show_status":"Texto de estado","theme_background":"Fondo del tema de HA","full_color":"Cubo totalmente coloreado","language":"Idioma"},"helpers":{"entity":"Sensor, calendario o input_datetime con la próxima recogida. Déjalo vacío para usar la programación de abajo.","start_date":"Cualquier fecha en que se vació o se vaciará el cubo. Las recogidas se repiten cada N semanas a partir de ella.","every":"1 = semanal, 2 = quincenal, 4 = cada cuatro semanas. Requiere una fecha de inicio.","weeks":"Paridad de semana ISO. Se ignora si hay fecha de inicio.","holidays":"Qué ocurre cuando una recogida cae en festivo.","holiday_calendar":"Calendario de la integración Holiday. Se encuentra automáticamente si se deja vacío.","workday_calendar":"Calendario de la integración Workday, usado por «siguiente día laborable». Se encuentra automáticamente si se deja vacío.","hour":"Hora a la que pasa el camión; después, el cubo se muestra como vaciado.","interval":"Solo con una entidad sensor, para estimar el nivel de llenado."},"options":{"container":{"wheelie_bin":"Contenedor con ruedas","bag":"Bolsa de basura","bulky":"Voluminosos"},"weeks":{"all":"Cada semana","even":"Semanas pares","odd":"Semanas impares"},"month_week":{"1":"1.º del mes","2":"2.º del mes","3":"3.º del mes","4":"4.º del mes","":"Cada semana","last":"Último del mes"},"holidays":{"none":"Ignorar festivos","next_day":"Pasar al día siguiente","next_work_day":"Pasar al siguiente día laborable","shift_week":"Saltar a la semana siguiente","shift_rest_of_week":"El resto de la semana se retrasa 1 día","cancel":"Cancelada"},"language":{"auto":"Automático (idioma de Home Assistant)"}}},"errors":{"bin_required":"Define «bin» ({bins})","bin_unknown":"Cubo desconocido «{bin}» (usa {bins})","schedule_required":"Define «days» (p. ej. [1, 4]), «start_date», «month_day» o «entity»","start_date_invalid":"«start_date» debe ser una fecha como 2026-11-04","holidays_unknown":"Valor de «holidays» desconocido «{value}» (usa {values})"}},"fr":{"language_name":"Français","card":{"bin":{"grey":"Poubelle grise","black":"Poubelle noire","yellow":"Poubelle jaune","green":"Poubelle verte","blue":"Poubelle bleue","brown":"Poubelle marron","red":"Poubelle rouge","purple":"Poubelle violette","burgundy":"Poubelle bordeaux","lime":"Poubelle vert citron"},"bag":{"grey":"Sac gris","black":"Sac noir","yellow":"Sac jaune","green":"Sac vert","blue":"Sac bleu","brown":"Sac marron","red":"Sac rouge","purple":"Sac violet","burgundy":"Sac bordeaux","lime":"Sac vert citron"},"bulky":"Encombrants","emptied":"Vidée","emptied_txt":"Vidée aujourd'hui ✅","today":"Collecte","today_txt":"Collecte aujourd'hui 🚛","eve":"Ce soir","eve_txt":"À sortir ce soir ! 🌙","in_days":"Dans {n} j","next_weekday":"Collecte {day}","next_date":"Collecte le {date}","fill":"Remplissage","unknown":"Date inconnue","moved":"décalée (jour férié)","warn_no_holiday_calendar":"Aucun calendrier de jours fériés : ajoute l'intégration Holiday","warn_no_workday_calendar":"Aucun calendrier de jours ouvrés : ajoute l'intégration Workday"},"editor":{"labels":{"bin":"Couleur","name":"Nom","container":"Type","image":"Image perso (remplace le dessin)","entity":"Entité (optionnel)","calendar_filter":"Filtre calendrier (titre contient)","calendar_offset":"Décalage calendrier (jours)","days":"Jours de collecte","start_date":"Date de départ (une collecte connue)","every":"Toutes les N semaines","weeks":"Semaines","month_week":"Une fois par mois","month_day":"Jour fixe du mois (1–31)","months":"Mois de collecte (vide = toute l'année)","holidays":"Jours fériés","holiday_calendar":"Calendrier des jours fériés","workday_calendar":"Calendrier des jours ouvrés","hour":"Heure de passage","interval":"Jours entre 2 collectes","scale":"Taille","headroom":"Marge haute","compact":"Compact","show_meter":"Jauge","show_status":"Texte de statut","theme_background":"Fond du thème HA","full_color":"Bac entièrement coloré","language":"Langue"},"helpers":{"entity":"Capteur, calendrier ou input_datetime donnant la prochaine collecte. Laisser vide pour utiliser le planning ci-dessous.","start_date":"N'importe quelle date de collecte passée ou à venir. Les collectes se répètent toutes les N semaines à partir d'elle.","every":"1 = chaque semaine, 2 = une semaine sur deux, 4 = toutes les quatre semaines. Nécessite une date de départ.","weeks":"Parité de la semaine ISO. Ignoré si une date de départ est indiquée.","holidays":"Ce qui se passe quand une collecte tombe un jour férié.","holiday_calendar":"Calendrier de l'intégration Holiday. Trouvé automatiquement si vide.","workday_calendar":"Calendrier de l'intégration Workday, utilisé par « jour ouvré suivant ». Trouvé automatiquement si vide.","hour":"Heure de passage du camion ; ensuite la poubelle apparaît vidée.","interval":"Utilisé seulement avec une entité capteur, pour estimer le remplissage."},"options":{"container":{"wheelie_bin":"Conteneur à roulettes","bag":"Sac poubelle","bulky":"Encombrants"},"weeks":{"all":"Toutes les semaines","even":"Semaines paires","odd":"Semaines impaires"},"month_week":{"1":"1er du mois","2":"2e du mois","3":"3e du mois","4":"4e du mois","":"Chaque semaine","last":"Dernier du mois"},"holidays":{"none":"Jours fériés ignorés","next_day":"Reportée au lendemain","next_work_day":"Reportée au jour ouvré suivant","shift_week":"Reportée à la semaine suivante","shift_rest_of_week":"Décalage d'un jour jusqu'à la fin de la semaine","cancel":"Annulée"},"language":{"auto":"Automatique (langue de Home Assistant)"}}},"errors":{"bin_required":"Indique « bin » ({bins})","bin_unknown":"Poubelle « {bin} » inconnue (utilise {bins})","schedule_required":"Indique « days » (ex. [1, 4]), « start_date », « month_day » ou « entity »","start_date_invalid":"« start_date » doit être une date comme 2026-11-04","holidays_unknown":"Valeur « {value} » inconnue pour « holidays » (utilise {values})"}},"hu":{"language_name":"Magyar","card":{"bin":{"grey":"Szürke kuka","black":"Fekete kuka","yellow":"Sárga kuka","green":"Zöld kuka","blue":"Kék kuka","brown":"Barna kuka","red":"Piros kuka","purple":"Lila kuka","burgundy":"Bordó kuka","lime":"Lime zöld kuka"},"bag":{"grey":"Szürke zsák","black":"Fekete zsák","yellow":"Sárga zsák","green":"Zöld zsák","blue":"Kék zsák","brown":"Barna zsák","red":"Piros zsák","purple":"Lila zsák","burgundy":"Bordó zsák","lime":"Lime zöld zsák"},"bulky":"Lomhulladék","emptied":"Kiürítve","emptied_txt":"Ma kiürítve ✅","today":"Szállítás","today_txt":"Ma szállítás 🚛","eve":"Ma este","eve_txt":"Tedd ki ma este! 🌙","in_days":"{n} nap múlva","next_weekday":"Szállítás: {day}","next_date":"Szállítás: {date}","fill":"Telítettség","unknown":"Ismeretlen dátum","moved":"áthelyezve (munkaszüneti nap)","warn_no_holiday_calendar":"Nem található ünnepnapi naptár: add hozzá a Holiday integrációt","warn_no_workday_calendar":"Nem található munkanapi naptár: add hozzá a Workday integrációt"},"editor":{"labels":{"bin":"Szín","name":"Név","container":"Tároló","image":"Egyéni kép (lecseréli a rajzot)","entity":"Entitás (opcionális)","calendar_filter":"Naptárszűrő (a cím tartalmazza)","calendar_offset":"Naptár eltolása (nap)","days":"Szállítási napok","start_date":"Kezdő dátum (egy ismert szállítás)","every":"N hetente","weeks":"Hetek","month_week":"Havonta egyszer","month_day":"A hónap napja (1–31)","months":"Szállítási hónapok (üres = egész év)","holidays":"Ünnepnapok","holiday_calendar":"Ünnepnapi naptár","workday_calendar":"Munkanapi naptár","hour":"Szállítás ideje","interval":"Napok a szállítások között","scale":"Méret","headroom":"Fejtér","compact":"Kompakt","show_meter":"Telítettségjelző","show_status":"Állapotszöveg","theme_background":"HA-téma háttere","full_color":"Teljesen színes kuka","language":"Nyelv"},"helpers":{"entity":"Érzékelő, naptár vagy input_datetime a következő szállítással. Hagyd üresen az alábbi ütemezés használatához.","start_date":"Bármely dátum, amikor a kukát kiürítették vagy ki fogják üríteni. A szállítások innentől N hetente ismétlődnek.","every":"1 = hetente, 2 = kéthetente, 4 = négyhetente. Kezdő dátum szükséges hozzá.","weeks":"ISO-hét paritása. Figyelmen kívül marad, ha van kezdő dátum.","holidays":"Mi történjen, ha a szállítás munkaszüneti napra esik.","holiday_calendar":"A Holiday integráció naptára. Üresen hagyva automatikusan megkeresi.","workday_calendar":"A Workday integráció naptára, a „következő munkanap” használja. Üresen hagyva automatikusan megkeresi.","hour":"Az idő, amikor a szemetesautó jön; utána a kuka kiürítettként jelenik meg.","interval":"Csak érzékelő entitással használatos, a telítettség becsléséhez."},"options":{"container":{"wheelie_bin":"Görgős kuka","bag":"Szemeteszsák","bulky":"Lomhulladék"},"weeks":{"all":"Minden hét","even":"Páros hetek","odd":"Páratlan hetek"},"month_week":{"1":"A hónap 1.","2":"A hónap 2.","3":"A hónap 3.","4":"A hónap 4.","":"Minden hét","last":"A hónap utolsó"},"holidays":{"none":"Ünnepnapok figyelmen kívül hagyása","next_day":"Áthelyezés a következő napra","next_work_day":"Áthelyezés a következő munkanapra","shift_week":"Ugrás a következő hétre","shift_rest_of_week":"A hét többi része +1 nap","cancel":"Törölve"},"language":{"auto":"Automatikus (a Home Assistant nyelve)"}}},"errors":{"bin_required":"Add meg a „bin” értékét ({bins})","bin_unknown":"Ismeretlen kuka: „{bin}” (használd: {bins})","schedule_required":"Add meg a „days” (pl. [1, 4]), „start_date”, „month_day” vagy „entity” értékét","start_date_invalid":"A „start_date” dátum kell legyen, például 2026-11-04","holidays_unknown":"Ismeretlen „holidays” érték: „{value}” (használd: {values})"}},"it":{"language_name":"Italiano","card":{"bin":{"grey":"Bidone grigio","black":"Bidone nero","yellow":"Bidone giallo","green":"Bidone verde","blue":"Bidone blu","brown":"Bidone marrone","red":"Bidone rosso","purple":"Bidone viola","burgundy":"Bidone bordeaux","lime":"Bidone verde lime"},"bag":{"grey":"Sacco grigio","black":"Sacco nero","yellow":"Sacco giallo","green":"Sacco verde","blue":"Sacco blu","brown":"Sacco marrone","red":"Sacco rosso","purple":"Sacco viola","burgundy":"Sacco bordeaux","lime":"Sacco verde lime"},"bulky":"Ingombranti","emptied":"Svuotato","emptied_txt":"Svuotato oggi ✅","today":"Ritiro","today_txt":"Ritiro oggi 🚛","eve":"Stasera","eve_txt":"Da esporre stasera! 🌙","in_days":"Tra {n} g","next_weekday":"Ritiro {day}","next_date":"Ritiro il {date}","fill":"Livello di riempimento","unknown":"Data sconosciuta","moved":"spostato (giorno festivo)","warn_no_holiday_calendar":"Nessun calendario dei giorni festivi trovato: aggiungi l'integrazione Holiday","warn_no_workday_calendar":"Nessun calendario dei giorni lavorativi trovato: aggiungi l'integrazione Workday"},"editor":{"labels":{"bin":"Colore","name":"Nome","container":"Tipo","image":"Immagine personalizzata (sostituisce il disegno)","entity":"Entità (facoltativa)","calendar_filter":"Filtro calendario (il titolo contiene)","calendar_offset":"Scostamento calendario (giorni)","days":"Giorni di ritiro","start_date":"Data di inizio (un ritiro noto)","every":"Ogni N settimane","weeks":"Settimane","month_week":"Una volta al mese","month_day":"Giorno del mese (1–31)","months":"Mesi di ritiro (vuoto = tutto l'anno)","holidays":"Giorni festivi","holiday_calendar":"Calendario dei giorni festivi","workday_calendar":"Calendario dei giorni lavorativi","hour":"Ora di passaggio","interval":"Giorni tra due ritiri","scale":"Dimensione","headroom":"Margine superiore","compact":"Compatto","show_meter":"Indicatore di riempimento","show_status":"Testo di stato","theme_background":"Sfondo del tema HA","full_color":"Bidone interamente colorato","language":"Lingua"},"helpers":{"entity":"Sensore, calendario o input_datetime con il prossimo ritiro. Lascia vuoto per usare la pianificazione qui sotto.","start_date":"Una qualsiasi data in cui il bidone è stato o sarà ritirato. I ritiri si ripetono ogni N settimane a partire da essa.","every":"1 = ogni settimana, 2 = una settimana su due, 4 = ogni quattro settimane. Richiede una data di inizio.","weeks":"Parità della settimana ISO. Ignorato se è impostata una data di inizio.","holidays":"Cosa succede quando un ritiro cade in un giorno festivo.","holiday_calendar":"Calendario dell'integrazione Holiday. Se vuoto, viene trovato automaticamente.","workday_calendar":"Calendario dell'integrazione Workday, usato da «giorno lavorativo successivo». Se vuoto, viene trovato automaticamente.","hour":"Ora in cui passa il camion; dopo, il bidone appare svuotato.","interval":"Usato solo con un sensore, per stimare il livello di riempimento."},"options":{"container":{"wheelie_bin":"Bidone carrellato","bag":"Sacco dei rifiuti","bulky":"Rifiuti ingombranti"},"weeks":{"all":"Ogni settimana","even":"Settimane pari","odd":"Settimane dispari"},"month_week":{"1":"1ª settimana del mese","2":"2ª settimana del mese","3":"3ª settimana del mese","4":"4ª settimana del mese","":"Ogni settimana","last":"Ultima settimana del mese"},"holidays":{"none":"Ignora i giorni festivi","next_day":"Spostato al giorno dopo","next_work_day":"Spostato al giorno lavorativo successivo","shift_week":"Spostato alla settimana successiva","shift_rest_of_week":"Slittamento di un giorno fino a fine settimana","cancel":"Annullato"},"language":{"auto":"Automatico (lingua di Home Assistant)"}}},"errors":{"bin_required":"Imposta «bin» ({bins})","bin_unknown":"Bidone «{bin}» sconosciuto (usa {bins})","schedule_required":"Imposta «days» (es. [1, 4]), «start_date», «month_day» o «entity»","start_date_invalid":"«start_date» deve essere una data come 2026-11-04","holidays_unknown":"Valore «{value}» sconosciuto per «holidays» (usa {values})"}},"nb":{"language_name":"Norsk bokmål","card":{"bin":{"grey":"Grå beholder","black":"Svart beholder","yellow":"Gul beholder","green":"Grønn beholder","blue":"Blå beholder","brown":"Brun beholder","red":"Rød beholder","purple":"Lilla beholder","burgundy":"Burgunder beholder","lime":"Limegrønn beholder"},"bag":{"grey":"Grå sekk","black":"Svart sekk","yellow":"Gul sekk","green":"Grønn sekk","blue":"Blå sekk","brown":"Brun sekk","red":"Rød sekk","purple":"Lilla sekk","burgundy":"Burgunder sekk","lime":"Limegrønn sekk"},"bulky":"Grovavfall","emptied":"Tømt","emptied_txt":"Tømt i dag ✅","today":"Henting","today_txt":"Henting i dag 🚛","eve":"I kveld","eve_txt":"Sett den ut i kveld! 🌙","in_days":"Om {n} d","next_weekday":"Henting {day}","next_date":"Henting {date}","fill":"Fyllingsgrad","unknown":"Ukjent dato","moved":"flyttet (helligdag)","warn_no_holiday_calendar":"Ingen helligdagskalender funnet: legg til integrasjonen Holiday","warn_no_workday_calendar":"Ingen arbeidsdagskalender funnet: legg til integrasjonen Workday"},"editor":{"labels":{"bin":"Farge","name":"Navn","container":"Beholder","image":"Eget bilde (erstatter tegningen)","entity":"Entitet (valgfri)","calendar_filter":"Kalenderfilter (tittelen inneholder)","calendar_offset":"Kalenderforskyvning (dager)","days":"Hentedager","start_date":"Startdato (en kjent henting)","every":"Hver N. uke","weeks":"Uker","month_week":"Én gang i måneden","month_day":"Dag i måneden (1–31)","months":"Hentemåneder (tom = hele året)","holidays":"Helligdager","holiday_calendar":"Helligdagskalender","workday_calendar":"Arbeidsdagskalender","hour":"Hentetidspunkt","interval":"Dager mellom hentinger","scale":"Størrelse","headroom":"Takhøyde","compact":"Kompakt","show_meter":"Fyllingsmåler","show_status":"Statustekst","theme_background":"HA-temabakgrunn","full_color":"Helt farget beholder","language":"Språk"},"helpers":{"entity":"Sensor, kalender eller input_datetime med neste henting. La stå tomt for å bruke planen nedenfor.","start_date":"En vilkårlig dato da beholderen ble eller blir tømt. Hentingene gjentas hver N. uke herfra.","every":"1 = ukentlig, 2 = annenhver uke, 4 = hver fjerde uke. Krever en startdato.","weeks":"ISO-ukeparitet. Ignoreres når en startdato er satt.","holidays":"Hva som skjer når en henting faller på en helligdag.","holiday_calendar":"Kalender fra integrasjonen Holiday. Finnes automatisk hvis tom.","workday_calendar":"Kalender fra integrasjonen Workday, brukt av «neste arbeidsdag». Finnes automatisk hvis tom.","hour":"Tidspunktet renovasjonsbilen kommer; etter det vises beholderen som tømt.","interval":"Brukes bare med en sensor-entitet, for å anslå fyllingsgraden."},"options":{"container":{"wheelie_bin":"Hjulbeholder","bag":"Søppelsekk","bulky":"Grovavfall"},"weeks":{"all":"Hver uke","even":"Partall-uker","odd":"Oddetall-uker"},"month_week":{"1":"1. i måneden","2":"2. i måneden","3":"3. i måneden","4":"4. i måneden","":"Hver uke","last":"Siste i måneden"},"holidays":{"none":"Ignorer helligdager","next_day":"Flytt til neste dag","next_work_day":"Flytt til neste arbeidsdag","shift_week":"Hopp til neste uke","shift_rest_of_week":"Resten av uken flyttes +1 dag","cancel":"Avlyst"},"language":{"auto":"Automatisk (Home Assistants språk)"}}},"errors":{"bin_required":"Angi «bin» ({bins})","bin_unknown":"Ukjent beholder «{bin}» (bruk {bins})","schedule_required":"Angi «days» (f.eks. [1, 4]), «start_date», «month_day» eller «entity»","start_date_invalid":"«start_date» må være en dato som 2026-11-04","holidays_unknown":"Ukjent «holidays»-verdi «{value}» (bruk {values})"}},"nl":{"language_name":"Nederlands","card":{"bin":{"grey":"Grijze container","black":"Zwarte container","yellow":"Gele container","green":"Groene container","blue":"Blauwe container","brown":"Bruine container","red":"Rode container","purple":"Paarse container","burgundy":"Bordeauxrode container","lime":"Limoengroene container"},"bag":{"grey":"Grijze zak","black":"Zwarte zak","yellow":"Gele zak","green":"Groene zak","blue":"Blauwe zak","brown":"Bruine zak","red":"Rode zak","purple":"Paarse zak","burgundy":"Bordeauxrode zak","lime":"Limoengroene zak"},"bulky":"Grofvuil","emptied":"Geleegd","emptied_txt":"Vandaag geleegd ✅","today":"Ophaling","today_txt":"Vandaag ophaling 🚛","eve":"Vanavond","eve_txt":"Zet hem vanavond buiten! 🌙","in_days":"Over {n} d","next_weekday":"Ophaling op {day}","next_date":"Ophaling op {date}","fill":"Vulniveau","unknown":"Onbekende datum","moved":"verplaatst (feestdag)","warn_no_holiday_calendar":"Geen feestdagenkalender gevonden: voeg de integratie Holiday toe","warn_no_workday_calendar":"Geen werkdagenkalender gevonden: voeg de integratie Workday toe"},"editor":{"labels":{"bin":"Kleur","name":"Naam","container":"Houder","image":"Eigen afbeelding (vervangt de tekening)","entity":"Entiteit (optioneel)","calendar_filter":"Kalenderfilter (titel bevat)","calendar_offset":"Kalenderverschuiving (dagen)","days":"Ophaaldagen","start_date":"Startdatum (een bekende ophaling)","every":"Elke N weken","weeks":"Weken","month_week":"Eén keer per maand","month_day":"Dag van de maand (1–31)","months":"Ophaalmaanden (leeg = hele jaar)","holidays":"Feestdagen","holiday_calendar":"Feestdagenkalender","workday_calendar":"Werkdagenkalender","hour":"Ophaaltijd","interval":"Dagen tussen ophalingen","scale":"Grootte","headroom":"Ruimte boven","compact":"Compact","show_meter":"Vulmeter","show_status":"Statustekst","theme_background":"HA-themaachtergrond","full_color":"Volledig gekleurde container","language":"Taal"},"helpers":{"entity":"Sensor, kalender of input_datetime met de volgende ophaling. Laat leeg om de planning hieronder te gebruiken.","start_date":"Een willekeurige datum waarop de container is of wordt geleegd. Vanaf daar herhaalt de ophaling zich elke N weken.","every":"1 = wekelijks, 2 = tweewekelijks, 4 = elke vier weken. Vereist een startdatum.","weeks":"ISO-weekpariteit. Genegeerd als een startdatum is ingesteld.","holidays":"Wat er gebeurt als een ophaling op een feestdag valt.","holiday_calendar":"Kalender van de integratie Holiday. Wordt automatisch gevonden als leeg.","workday_calendar":"Kalender van de integratie Workday, gebruikt door \"volgende werkdag\". Wordt automatisch gevonden als leeg.","hour":"Tijd waarop de vuilniswagen komt; daarna wordt de container als geleegd getoond.","interval":"Alleen met een sensor-entiteit, om het vulniveau te schatten."},"options":{"container":{"wheelie_bin":"Kliko","bag":"Vuilniszak","bulky":"Grofvuil"},"weeks":{"all":"Elke week","even":"Even weken","odd":"Oneven weken"},"month_week":{"1":"1e van de maand","2":"2e van de maand","3":"3e van de maand","4":"4e van de maand","":"Elke week","last":"Laatste van de maand"},"holidays":{"none":"Feestdagen negeren","next_day":"Naar de volgende dag verplaatsen","next_work_day":"Naar de volgende werkdag verplaatsen","shift_week":"Naar de volgende week overslaan","shift_rest_of_week":"Rest van de week +1 dag","cancel":"Geannuleerd"},"language":{"auto":"Automatisch (taal van Home Assistant)"}}},"errors":{"bin_required":"Stel \"bin\" in ({bins})","bin_unknown":"Onbekende container \"{bin}\" (gebruik {bins})","schedule_required":"Stel \"days\" in (bijv. [1, 4]), \"start_date\", \"month_day\" of \"entity\"","start_date_invalid":"\"start_date\" moet een datum zijn zoals 2026-11-04","holidays_unknown":"Onbekende waarde \"{value}\" voor \"holidays\" (gebruik {values})"}},"pl":{"language_name":"Polski","card":{"bin":{"grey":"Szary pojemnik","black":"Czarny pojemnik","yellow":"Żółty pojemnik","green":"Zielony pojemnik","blue":"Niebieski pojemnik","brown":"Brązowy pojemnik","red":"Czerwony pojemnik","purple":"Fioletowy pojemnik","burgundy":"Bordowy pojemnik","lime":"Limonkowy pojemnik"},"bag":{"grey":"Szary worek","black":"Czarny worek","yellow":"Żółty worek","green":"Zielony worek","blue":"Niebieski worek","brown":"Brązowy worek","red":"Czerwony worek","purple":"Fioletowy worek","burgundy":"Bordowy worek","lime":"Limonkowy worek"},"bulky":"Odpady wielkogabarytowe","emptied":"Opróżniony","emptied_txt":"Opróżniony dziś ✅","today":"Odbiór","today_txt":"Odbiór dziś 🚛","eve":"Wieczorem","eve_txt":"Wystaw dziś wieczorem! 🌙","in_days":"Za {n} d","next_weekday":"Odbiór: {day}","next_date":"Odbiór: {date}","fill":"Poziom napełnienia","unknown":"Nieznana data","moved":"przesunięty (święto)","warn_no_holiday_calendar":"Nie znaleziono kalendarza świąt: dodaj integrację Holiday","warn_no_workday_calendar":"Nie znaleziono kalendarza dni roboczych: dodaj integrację Workday"},"editor":{"labels":{"bin":"Kolor","name":"Nazwa","container":"Pojemnik","image":"Własny obraz (zastępuje rysunek)","entity":"Encja (opcjonalnie)","calendar_filter":"Filtr kalendarza (tytuł zawiera)","calendar_offset":"Przesunięcie kalendarza (dni)","days":"Dni odbioru","start_date":"Data początkowa (znany odbiór)","every":"Co N tygodni","weeks":"Tygodnie","month_week":"Raz w miesiącu","month_day":"Dzień miesiąca (1–31)","months":"Miesiące odbioru (puste = cały rok)","holidays":"Święta","holiday_calendar":"Kalendarz świąt","workday_calendar":"Kalendarz dni roboczych","hour":"Godzina odbioru","interval":"Dni między odbiorami","scale":"Rozmiar","headroom":"Zapas nad rysunkiem","compact":"Kompaktowy","show_meter":"Wskaźnik napełnienia","show_status":"Tekst statusu","theme_background":"Tło motywu HA","full_color":"Cały pojemnik w kolorze","language":"Język"},"helpers":{"entity":"Czujnik, kalendarz lub input_datetime z następnym odbiorem. Zostaw puste, aby użyć harmonogramu poniżej.","start_date":"Dowolna data, w której pojemnik był lub będzie opróżniany. Odbiory powtarzają się od niej co N tygodni.","every":"1 = co tydzień, 2 = co dwa tygodnie, 4 = co cztery tygodnie. Wymaga daty początkowej.","weeks":"Parzystość tygodnia ISO. Ignorowane, gdy ustawiono datę początkową.","holidays":"Co się dzieje, gdy odbiór wypada w święto.","holiday_calendar":"Kalendarz z integracji Holiday. Znajdowany automatycznie, jeśli puste.","workday_calendar":"Kalendarz z integracji Workday, używany przez „następny dzień roboczy”. Znajdowany automatycznie, jeśli puste.","hour":"Godzina przyjazdu śmieciarki; po niej pojemnik jest pokazany jako opróżniony.","interval":"Używane tylko z encją czujnika, do oszacowania poziomu napełnienia."},"options":{"container":{"wheelie_bin":"Pojemnik na kółkach","bag":"Worek na śmieci","bulky":"Odpady wielkogabarytowe"},"weeks":{"all":"Co tydzień","even":"Tygodnie parzyste","odd":"Tygodnie nieparzyste"},"month_week":{"1":"1. w miesiącu","2":"2. w miesiącu","3":"3. w miesiącu","4":"4. w miesiącu","":"Co tydzień","last":"Ostatni w miesiącu"},"holidays":{"none":"Ignoruj święta","next_day":"Przesuń na następny dzień","next_work_day":"Przesuń na następny dzień roboczy","shift_week":"Przeskocz na następny tydzień","shift_rest_of_week":"Reszta tygodnia +1 dzień","cancel":"Odwołany"},"language":{"auto":"Automatycznie (język Home Assistant)"}}},"errors":{"bin_required":"Ustaw „bin” ({bins})","bin_unknown":"Nieznany pojemnik „{bin}” (użyj {bins})","schedule_required":"Ustaw „days” (np. [1, 4]), „start_date”, „month_day” lub „entity”","start_date_invalid":"„start_date” musi być datą, np. 2026-11-04","holidays_unknown":"Nieznana wartość „holidays”: „{value}” (użyj {values})"}},"pt-BR":{"language_name":"Português (Brasil)","card":{"bin":{"grey":"Lixeira cinza","black":"Lixeira preta","yellow":"Lixeira amarela","green":"Lixeira verde","blue":"Lixeira azul","brown":"Lixeira marrom","red":"Lixeira vermelha","purple":"Lixeira roxa","burgundy":"Lixeira bordô","lime":"Lixeira verde-limão"},"bag":{"grey":"Saco cinza","black":"Saco preto","yellow":"Saco amarelo","green":"Saco verde","blue":"Saco azul","brown":"Saco marrom","red":"Saco vermelho","purple":"Saco roxo","burgundy":"Saco bordô","lime":"Saco verde-limão"},"bulky":"Resíduos volumosos","emptied":"Esvaziado","emptied_txt":"Esvaziado hoje ✅","today":"Coleta","today_txt":"Coleta hoje 🚛","eve":"Hoje à noite","eve_txt":"Coloque para fora hoje à noite! 🌙","in_days":"Em {n} d","next_weekday":"Coleta em {day}","next_date":"Coleta em {date}","fill":"Nível de enchimento","unknown":"Data desconhecida","moved":"adiada (feriado)","warn_no_holiday_calendar":"Nenhum calendário de feriados encontrado: adicione a integração Holiday","warn_no_workday_calendar":"Nenhum calendário de dias úteis encontrado: adicione a integração Workday"},"editor":{"labels":{"bin":"Cor","name":"Nome","container":"Recipiente","image":"Imagem personalizada (substitui o desenho)","entity":"Entidade (opcional)","calendar_filter":"Filtro do calendário (o título contém)","calendar_offset":"Deslocamento do calendário (dias)","days":"Dias de coleta","start_date":"Data de início (uma coleta conhecida)","every":"A cada N semanas","weeks":"Semanas","month_week":"Uma vez por mês","month_day":"Dia do mês (1–31)","months":"Meses de coleta (vazio = o ano todo)","holidays":"Feriados","holiday_calendar":"Calendário de feriados","workday_calendar":"Calendário de dias úteis","hour":"Hora da coleta","interval":"Dias entre coletas","scale":"Tamanho","headroom":"Espaço superior","compact":"Compacto","show_meter":"Medidor de enchimento","show_status":"Texto de status","theme_background":"Fundo do tema do HA","full_color":"Lixeira totalmente colorida","language":"Idioma"},"helpers":{"entity":"Sensor, calendário ou input_datetime com a próxima coleta. Deixe vazio para usar a programação abaixo.","start_date":"Qualquer data em que a lixeira foi ou será esvaziada. As coletas se repetem a cada N semanas a partir dela.","every":"1 = semanal, 2 = quinzenal, 4 = a cada quatro semanas. Requer uma data de início.","weeks":"Paridade da semana ISO. Ignorado quando há data de início.","holidays":"O que acontece quando uma coleta cai em um feriado.","holiday_calendar":"Calendário da integração Holiday. Encontrado automaticamente se vazio.","workday_calendar":"Calendário da integração Workday, usado por «próximo dia útil». Encontrado automaticamente se vazio.","hour":"Hora em que o caminhão passa; depois dela, a lixeira aparece como esvaziada.","interval":"Usado apenas com uma entidade sensor, para estimar o nível de enchimento."},"options":{"container":{"wheelie_bin":"Lixeira com rodas","bag":"Saco de lixo","bulky":"Resíduos volumosos"},"weeks":{"all":"Toda semana","even":"Semanas pares","odd":"Semanas ímpares"},"month_week":{"1":"1ª do mês","2":"2ª do mês","3":"3ª do mês","4":"4ª do mês","":"Toda semana","last":"Última do mês"},"holidays":{"none":"Ignorar feriados","next_day":"Mover para o dia seguinte","next_work_day":"Mover para o próximo dia útil","shift_week":"Pular para a semana seguinte","shift_rest_of_week":"O resto da semana avança +1 dia","cancel":"Cancelada"},"language":{"auto":"Automático (idioma do Home Assistant)"}}},"errors":{"bin_required":"Defina «bin» ({bins})","bin_unknown":"Lixeira desconhecida «{bin}» (use {bins})","schedule_required":"Defina «days» (ex.: [1, 4]), «start_date», «month_day» ou «entity»","start_date_invalid":"«start_date» deve ser uma data como 2026-11-04","holidays_unknown":"Valor de «holidays» desconhecido «{value}» (use {values})"}},"pt-PT":{"language_name":"Português (Portugal)","card":{"bin":{"grey":"Contentor cinzento","black":"Contentor preto","yellow":"Contentor amarelo","green":"Contentor verde","blue":"Contentor azul","brown":"Contentor castanho","red":"Contentor vermelho","purple":"Contentor roxo","burgundy":"Contentor bordeaux","lime":"Contentor verde-lima"},"bag":{"grey":"Saco cinzento","black":"Saco preto","yellow":"Saco amarelo","green":"Saco verde","blue":"Saco azul","brown":"Saco castanho","red":"Saco vermelho","purple":"Saco roxo","burgundy":"Saco bordeaux","lime":"Saco verde-lima"},"bulky":"Resíduos volumosos","emptied":"Esvaziado","emptied_txt":"Esvaziado hoje ✅","today":"Recolha","today_txt":"Recolha hoje 🚛","eve":"Esta noite","eve_txt":"Coloque-o na rua esta noite! 🌙","in_days":"Em {n} d","next_weekday":"Recolha em {day}","next_date":"Recolha em {date}","fill":"Nível de enchimento","unknown":"Data desconhecida","moved":"adiada (feriado)","warn_no_holiday_calendar":"Nenhum calendário de feriados encontrado: adicione a integração Holiday","warn_no_workday_calendar":"Nenhum calendário de dias úteis encontrado: adicione a integração Workday"},"editor":{"labels":{"bin":"Cor","name":"Nome","container":"Recipiente","image":"Imagem personalizada (substitui o desenho)","entity":"Entidade (opcional)","calendar_filter":"Filtro do calendário (o título contém)","calendar_offset":"Desfasamento do calendário (dias)","days":"Dias de recolha","start_date":"Data de início (uma recolha conhecida)","every":"A cada N semanas","weeks":"Semanas","month_week":"Uma vez por mês","month_day":"Dia do mês (1–31)","months":"Meses de recolha (vazio = o ano todo)","holidays":"Feriados","holiday_calendar":"Calendário de feriados","workday_calendar":"Calendário de dias úteis","hour":"Hora da recolha","interval":"Dias entre recolhas","scale":"Tamanho","headroom":"Espaço superior","compact":"Compacto","show_meter":"Indicador de enchimento","show_status":"Texto de estado","theme_background":"Fundo do tema do HA","full_color":"Contentor totalmente colorido","language":"Idioma"},"helpers":{"entity":"Sensor, calendário ou input_datetime com a próxima recolha. Deixe vazio para usar o horário abaixo.","start_date":"Qualquer data em que o contentor foi ou será esvaziado. As recolhas repetem-se a cada N semanas a partir dela.","every":"1 = semanal, 2 = quinzenal, 4 = de quatro em quatro semanas. Requer uma data de início.","weeks":"Paridade da semana ISO. Ignorado quando há data de início.","holidays":"O que acontece quando uma recolha calha num feriado.","holiday_calendar":"Calendário da integração Holiday. Encontrado automaticamente se vazio.","workday_calendar":"Calendário da integração Workday, usado por «próximo dia útil». Encontrado automaticamente se vazio.","hour":"Hora a que o camião passa; depois dela, o contentor aparece como esvaziado.","interval":"Usado apenas com uma entidade sensor, para estimar o nível de enchimento."},"options":{"container":{"wheelie_bin":"Contentor com rodas","bag":"Saco do lixo","bulky":"Resíduos volumosos"},"weeks":{"all":"Todas as semanas","even":"Semanas pares","odd":"Semanas ímpares"},"month_week":{"1":"1.º do mês","2":"2.º do mês","3":"3.º do mês","4":"4.º do mês","":"Todas as semanas","last":"Último do mês"},"holidays":{"none":"Ignorar feriados","next_day":"Mover para o dia seguinte","next_work_day":"Mover para o próximo dia útil","shift_week":"Saltar para a semana seguinte","shift_rest_of_week":"O resto da semana avança +1 dia","cancel":"Cancelada"},"language":{"auto":"Automático (idioma do Home Assistant)"}}},"errors":{"bin_required":"Defina «bin» ({bins})","bin_unknown":"Contentor desconhecido «{bin}» (use {bins})","schedule_required":"Defina «days» (ex.: [1, 4]), «start_date», «month_day» ou «entity»","start_date_invalid":"«start_date» tem de ser uma data como 2026-11-04","holidays_unknown":"Valor de «holidays» desconhecido «{value}» (use {values})"}},"ro":{"language_name":"Română","card":{"bin":{"grey":"Container gri","black":"Container negru","yellow":"Container galben","green":"Container verde","blue":"Container albastru","brown":"Container maro","red":"Container roșu","purple":"Container violet","burgundy":"Container vișiniu","lime":"Container verde lime"},"bag":{"grey":"Sac gri","black":"Sac negru","yellow":"Sac galben","green":"Sac verde","blue":"Sac albastru","brown":"Sac maro","red":"Sac roșu","purple":"Sac violet","burgundy":"Sac vișiniu","lime":"Sac verde lime"},"bulky":"Deșeuri voluminoase","emptied":"Golit","emptied_txt":"Golit astăzi ✅","today":"Ridicare","today_txt":"Ridicare astăzi 🚛","eve":"Diseară","eve_txt":"Scoate-l diseară! 🌙","in_days":"În {n} z","next_weekday":"Ridicare {day}","next_date":"Ridicare {date}","fill":"Nivel de umplere","unknown":"Dată necunoscută","moved":"mutat (sărbătoare legală)","warn_no_holiday_calendar":"Niciun calendar de sărbători găsit: adaugă integrarea Holiday","warn_no_workday_calendar":"Niciun calendar de zile lucrătoare găsit: adaugă integrarea Workday"},"editor":{"labels":{"bin":"Culoare","name":"Nume","container":"Recipient","image":"Imagine proprie (înlocuiește desenul)","entity":"Entitate (opțional)","calendar_filter":"Filtru calendar (titlul conține)","calendar_offset":"Decalaj calendar (zile)","days":"Zilele de ridicare","start_date":"Data de început (o ridicare cunoscută)","every":"La fiecare N săptămâni","weeks":"Săptămâni","month_week":"O dată pe lună","month_day":"Ziua lunii (1–31)","months":"Lunile de ridicare (gol = tot anul)","holidays":"Sărbători legale","holiday_calendar":"Calendar de sărbători","workday_calendar":"Calendar de zile lucrătoare","hour":"Ora ridicării","interval":"Zile între ridicări","scale":"Dimensiune","headroom":"Spațiu deasupra","compact":"Compact","show_meter":"Indicator de umplere","show_status":"Text de stare","theme_background":"Fundalul temei HA","full_color":"Container colorat integral","language":"Limbă"},"helpers":{"entity":"Senzor, calendar sau input_datetime cu următoarea ridicare. Lasă gol pentru a folosi programul de mai jos.","start_date":"Orice dată la care containerul a fost sau va fi golit. Ridicările se repetă de la ea la fiecare N săptămâni.","every":"1 = săptămânal, 2 = la două săptămâni, 4 = la patru săptămâni. Necesită o dată de început.","weeks":"Paritatea săptămânii ISO. Ignorată dacă este setată o dată de început.","holidays":"Ce se întâmplă când o ridicare cade într-o sărbătoare legală.","holiday_calendar":"Calendar din integrarea Holiday. Găsit automat dacă rămâne gol.","workday_calendar":"Calendar din integrarea Workday, folosit de „următoarea zi lucrătoare”. Găsit automat dacă rămâne gol.","hour":"Ora la care vine camionul; după aceasta, containerul apare ca golit.","interval":"Folosit doar cu o entitate senzor, pentru a estima nivelul de umplere."},"options":{"container":{"wheelie_bin":"Container cu roți","bag":"Sac de gunoi","bulky":"Deșeuri voluminoase"},"weeks":{"all":"În fiecare săptămână","even":"Săptămâni pare","odd":"Săptămâni impare"},"month_week":{"1":"Prima din lună","2":"A doua din lună","3":"A treia din lună","4":"A patra din lună","":"În fiecare săptămână","last":"Ultima din lună"},"holidays":{"none":"Ignoră sărbătorile","next_day":"Mută în ziua următoare","next_work_day":"Mută în următoarea zi lucrătoare","shift_week":"Sari la săptămâna următoare","shift_rest_of_week":"Restul săptămânii se mută cu +1 zi","cancel":"Anulat"},"language":{"auto":"Automat (limba Home Assistant)"}}},"errors":{"bin_required":"Setează „bin” ({bins})","bin_unknown":"Container necunoscut „{bin}” (folosește {bins})","schedule_required":"Setează „days” (de ex. [1, 4]), „start_date”, „month_day” sau „entity”","start_date_invalid":"„start_date” trebuie să fie o dată precum 2026-11-04","holidays_unknown":"Valoare „holidays” necunoscută „{value}” (folosește {values})"}},"ru":{"language_name":"Русский","card":{"bin":{"grey":"Серый контейнер","black":"Чёрный контейнер","yellow":"Жёлтый контейнер","green":"Зелёный контейнер","blue":"Синий контейнер","brown":"Коричневый контейнер","red":"Красный контейнер","purple":"Фиолетовый контейнер","burgundy":"Бордовый контейнер","lime":"Салатовый контейнер"},"bag":{"grey":"Серый мешок","black":"Чёрный мешок","yellow":"Жёлтый мешок","green":"Зелёный мешок","blue":"Синий мешок","brown":"Коричневый мешок","red":"Красный мешок","purple":"Фиолетовый мешок","burgundy":"Бордовый мешок","lime":"Салатовый мешок"},"bulky":"Крупногабаритный мусор","emptied":"Опорожнён","emptied_txt":"Сегодня опорожнён ✅","today":"Вывоз","today_txt":"Сегодня вывоз 🚛","eve":"Вечером","eve_txt":"Выставьте сегодня вечером! 🌙","in_days":"Через {n} д","next_weekday":"Вывоз: {day}","next_date":"Вывоз: {date}","fill":"Заполненность","unknown":"Дата неизвестна","moved":"перенесён (праздничный день)","warn_no_holiday_calendar":"Календарь праздников не найден: добавьте интеграцию Holiday","warn_no_workday_calendar":"Календарь рабочих дней не найден: добавьте интеграцию Workday"},"editor":{"labels":{"bin":"Цвет","name":"Название","container":"Контейнер","image":"Своё изображение (заменяет рисунок)","entity":"Сущность (необязательно)","calendar_filter":"Фильтр календаря (название содержит)","calendar_offset":"Смещение календаря (дни)","days":"Дни вывоза","start_date":"Начальная дата (известный вывоз)","every":"Каждые N недель","weeks":"Недели","month_week":"Раз в месяц","month_day":"День месяца (1–31)","months":"Месяцы вывоза (пусто = весь год)","holidays":"Праздничные дни","holiday_calendar":"Календарь праздников","workday_calendar":"Календарь рабочих дней","hour":"Время вывоза","interval":"Дней между вывозами","scale":"Размер","headroom":"Отступ сверху","compact":"Компактный","show_meter":"Индикатор заполнения","show_status":"Текст статуса","theme_background":"Фон темы HA","full_color":"Полностью окрашенный контейнер","language":"Язык"},"helpers":{"entity":"Датчик, календарь или input_datetime со следующим вывозом. Оставьте пустым, чтобы использовать расписание ниже.","start_date":"Любая дата, когда контейнер опорожнялся или будет опорожнён. От неё вывозы повторяются каждые N недель.","every":"1 = каждую неделю, 2 = раз в две недели, 4 = раз в четыре недели. Требуется начальная дата.","weeks":"Чётность недели ISO. Игнорируется, если задана начальная дата.","holidays":"Что происходит, если вывоз выпадает на праздничный день.","holiday_calendar":"Календарь интеграции Holiday. Если пусто, находится автоматически.","workday_calendar":"Календарь интеграции Workday, используется для «следующего рабочего дня». Если пусто, находится автоматически.","hour":"Время приезда мусоровоза; после него контейнер показывается как опорожнённый.","interval":"Используется только с сущностью-датчиком для оценки заполненности."},"options":{"container":{"wheelie_bin":"Контейнер на колёсах","bag":"Мусорный мешок","bulky":"Крупногабаритный мусор"},"weeks":{"all":"Каждую неделю","even":"Чётные недели","odd":"Нечётные недели"},"month_week":{"1":"1-й в месяце","2":"2-й в месяце","3":"3-й в месяце","4":"4-й в месяце","":"Каждую неделю","last":"Последний в месяце"},"holidays":{"none":"Игнорировать праздники","next_day":"Перенести на следующий день","next_work_day":"Перенести на следующий рабочий день","shift_week":"Перенести на следующую неделю","shift_rest_of_week":"Остаток недели сдвигается на +1 день","cancel":"Отменён"},"language":{"auto":"Автоматически (язык Home Assistant)"}}},"errors":{"bin_required":"Укажите «bin» ({bins})","bin_unknown":"Неизвестный контейнер «{bin}» (используйте {bins})","schedule_required":"Укажите «days» (например, [1, 4]), «start_date», «month_day» или «entity»","start_date_invalid":"«start_date» должна быть датой, например 2026-11-04","holidays_unknown":"Неизвестное значение «holidays» «{value}» (используйте {values})"}},"sr":{"language_name":"Српски","card":{"bin":{"grey":"Сива канта","black":"Црна канта","yellow":"Жута канта","green":"Зелена канта","blue":"Плава канта","brown":"Браон канта","red":"Црвена канта","purple":"Љубичаста канта","burgundy":"Бордо канта","lime":"Светлозелена канта"},"bag":{"grey":"Сива врећа","black":"Црна врећа","yellow":"Жута врећа","green":"Зелена врећа","blue":"Плава врећа","brown":"Браон врећа","red":"Црвена врећа","purple":"Љубичаста врећа","burgundy":"Бордо врећа","lime":"Светлозелена врећа"},"bulky":"Кабасти отпад","emptied":"Испражњено","emptied_txt":"Испражњено данас ✅","today":"Одношење смећа","today_txt":"Одношење данас 🚛","eve":"Вечерас","eve_txt":"Изнети вечерас! 🌙","in_days":"За {n} д","next_weekday":"Одношење у {day}","next_date":"Одношење дана {date}","fill":"Попуњеност","unknown":"Непознат датум","moved":"померено (државни празник)","warn_no_holiday_calendar":"Није пронађен календар празника: додајте интеграцију Holiday","warn_no_workday_calendar":"Није пронађен календар радних дана: додајте интеграцију Workday"},"editor":{"labels":{"bin":"Боја","name":"Назив","container":"Врста","image":"Сопствена слика (замењује цртеж)","entity":"Ентитет (опционо)","calendar_filter":"Филтер календара (наслов садржи)","calendar_offset":"Помак календара (дани)","days":"Дани одношења","start_date":"Почетни датум (познато одношење)","every":"Сваких N недеља","weeks":"Недеље","month_week":"Једном месечно","month_day":"Дан у месецу (1–31)","months":"Месеци одношења (празно = цела година)","holidays":"Државни празници","holiday_calendar":"Календар празника","workday_calendar":"Календар радних дана","hour":"Сат одношења","interval":"Дани између одношења","scale":"Величина","headroom":"Горња маргина","compact":"Компактно","show_meter":"Мерач попуњености","show_status":"Текст статуса","theme_background":"Позадина HA теме","full_color":"Потпуно обојена канта","language":"Језик"},"helpers":{"entity":"Сензор, календар или input_datetime са следећим одношењем. Оставите празно да бисте користили распоред испод.","start_date":"Било који датум одношења, прошли или будући. Одношења се понављају сваких N недеља од тог датума.","every":"1 = сваке недеље, 2 = сваке друге недеље, 4 = сваке четврте недеље. Потребан је почетни датум.","weeks":"Парност ISO недеље. Занемарује се када је задат почетни датум.","holidays":"Шта се дешава када одношење падне на државни празник.","holiday_calendar":"Календар из интеграције Holiday. Проналази се аутоматски ако је празно.","workday_calendar":"Календар из интеграције Workday, за „следећи радни дан”. Проналази се аутоматски ако је празно.","hour":"Време доласка камиона; после тога канта се приказује као испражњена.","interval":"Користи се само са сензором, за процену попуњености."},"options":{"container":{"wheelie_bin":"Канта на точковима","bag":"Врећа за смеће","bulky":"Кабасти отпад"},"weeks":{"all":"Сваке недеље","even":"Парне недеље","odd":"Непарне недеље"},"month_week":{"1":"1. у месецу","2":"2. у месецу","3":"3. у месецу","4":"4. у месецу","":"Сваке недеље","last":"Последњи у месецу"},"holidays":{"none":"Занемари празнике","next_day":"Помери на следећи дан","next_work_day":"Помери на следећи радни дан","shift_week":"Помери на следећу недељу","shift_rest_of_week":"Остатак недеље се помера за 1 дан","cancel":"Отказано"},"language":{"auto":"Аутоматски (језик Home Assistant-а)"}}},"errors":{"bin_required":"Задајте „bin” ({bins})","bin_unknown":"Непозната канта „{bin}” (користите {bins})","schedule_required":"Задајте „days” (нпр. [1, 4]), „start_date”, „month_day” или „entity”","start_date_invalid":"„start_date” мора бити датум као 2026-11-04","holidays_unknown":"Непозната вредност „{value}” за „holidays” (користите {values})"}},"sr-Latn":{"language_name":"Srpski (latinica)","card":{"bin":{"grey":"Siva kanta","black":"Crna kanta","yellow":"Žuta kanta","green":"Zelena kanta","blue":"Plava kanta","brown":"Braon kanta","red":"Crvena kanta","purple":"Ljubičasta kanta","burgundy":"Bordo kanta","lime":"Svetlozelena kanta"},"bag":{"grey":"Siva vreća","black":"Crna vreća","yellow":"Žuta vreća","green":"Zelena vreća","blue":"Plava vreća","brown":"Braon vreća","red":"Crvena vreća","purple":"Ljubičasta vreća","burgundy":"Bordo vreća","lime":"Svetlozelena vreća"},"bulky":"Kabasti otpad","emptied":"Ispražnjeno","emptied_txt":"Ispražnjeno danas ✅","today":"Odnošenje smeća","today_txt":"Odnošenje danas 🚛","eve":"Večeras","eve_txt":"Izneti večeras! 🌙","in_days":"Za {n} d","next_weekday":"Odnošenje u {day}","next_date":"Odnošenje dana {date}","fill":"Popunjenost","unknown":"Nepoznat datum","moved":"pomereno (državni praznik)","warn_no_holiday_calendar":"Nije pronađen kalendar praznika: dodajte integraciju Holiday","warn_no_workday_calendar":"Nije pronađen kalendar radnih dana: dodajte integraciju Workday"},"editor":{"labels":{"bin":"Boja","name":"Naziv","container":"Vrsta","image":"Sopstvena slika (zamenjuje crtež)","entity":"Entitet (opciono)","calendar_filter":"Filter kalendara (naslov sadrži)","calendar_offset":"Pomak kalendara (dani)","days":"Dani odnošenja","start_date":"Početni datum (poznato odnošenje)","every":"Svakih N nedelja","weeks":"Nedelje","month_week":"Jednom mesečno","month_day":"Dan u mesecu (1–31)","months":"Meseci odnošenja (prazno = cela godina)","holidays":"Državni praznici","holiday_calendar":"Kalendar praznika","workday_calendar":"Kalendar radnih dana","hour":"Sat odnošenja","interval":"Dani između odnošenja","scale":"Veličina","headroom":"Gornja margina","compact":"Kompaktno","show_meter":"Merač popunjenosti","show_status":"Tekst statusa","theme_background":"Pozadina HA teme","full_color":"Potpuno obojena kanta","language":"Jezik"},"helpers":{"entity":"Senzor, kalendar ili input_datetime sa sledećim odnošenjem. Ostavite prazno da biste koristili raspored ispod.","start_date":"Bilo koji datum odnošenja, prošli ili budući. Odnošenja se ponavljaju svakih N nedelja od tog datuma.","every":"1 = svake nedelje, 2 = svake druge nedelje, 4 = svake četvrte nedelje. Potreban je početni datum.","weeks":"Parnost ISO nedelje. Zanemaruje se kada je zadat početni datum.","holidays":"Šta se dešava kada odnošenje padne na državni praznik.","holiday_calendar":"Kalendar iz integracije Holiday. Pronalazi se automatski ako je prazno.","workday_calendar":"Kalendar iz integracije Workday, za „sledeći radni dan”. Pronalazi se automatski ako je prazno.","hour":"Vreme dolaska kamiona; posle toga kanta se prikazuje kao ispražnjena.","interval":"Koristi se samo sa senzorom, za procenu popunjenosti."},"options":{"container":{"wheelie_bin":"Kanta na točkovima","bag":"Vreća za smeće","bulky":"Kabasti otpad"},"weeks":{"all":"Svake nedelje","even":"Parne nedelje","odd":"Neparne nedelje"},"month_week":{"1":"1. u mesecu","2":"2. u mesecu","3":"3. u mesecu","4":"4. u mesecu","":"Svake nedelje","last":"Poslednji u mesecu"},"holidays":{"none":"Zanemari praznike","next_day":"Pomeri na sledeći dan","next_work_day":"Pomeri na sledeći radni dan","shift_week":"Pomeri na sledeću nedelju","shift_rest_of_week":"Ostatak nedelje se pomera za 1 dan","cancel":"Otkazano"},"language":{"auto":"Automatski (jezik Home Assistant-a)"}}},"errors":{"bin_required":"Zadajte „bin” ({bins})","bin_unknown":"Nepoznata kanta „{bin}” (koristite {bins})","schedule_required":"Zadajte „days” (npr. [1, 4]), „start_date”, „month_day” ili „entity”","start_date_invalid":"„start_date” mora biti datum kao 2026-11-04","holidays_unknown":"Nepoznata vrednost „{value}” za „holidays” (koristite {values})"}},"uk":{"language_name":"Українська","card":{"bin":{"grey":"Сірий контейнер","black":"Чорний контейнер","yellow":"Жовтий контейнер","green":"Зелений контейнер","blue":"Синій контейнер","brown":"Коричневий контейнер","red":"Червоний контейнер","purple":"Фіолетовий контейнер","burgundy":"Бордовий контейнер","lime":"Салатовий контейнер"},"bag":{"grey":"Сірий мішок","black":"Чорний мішок","yellow":"Жовтий мішок","green":"Зелений мішок","blue":"Синій мішок","brown":"Коричневий мішок","red":"Червоний мішок","purple":"Фіолетовий мішок","burgundy":"Бордовий мішок","lime":"Салатовий мішок"},"bulky":"Великогабаритні відходи","emptied":"Спорожнено","emptied_txt":"Сьогодні спорожнено ✅","today":"Вивезення","today_txt":"Сьогодні вивезення 🚛","eve":"Ввечері","eve_txt":"Виставте сьогодні ввечері! 🌙","in_days":"Через {n} д","next_weekday":"Вивезення: {day}","next_date":"Вивезення: {date}","fill":"Заповненість","unknown":"Невідома дата","moved":"перенесено (святковий день)","warn_no_holiday_calendar":"Календар свят не знайдено: додайте інтеграцію Holiday","warn_no_workday_calendar":"Календар робочих днів не знайдено: додайте інтеграцію Workday"},"editor":{"labels":{"bin":"Колір","name":"Назва","container":"Контейнер","image":"Власне зображення (замінює малюнок)","entity":"Сутність (необов'язково)","calendar_filter":"Фільтр календаря (назва містить)","calendar_offset":"Зсув календаря (дні)","days":"Дні вивезення","start_date":"Початкова дата (відоме вивезення)","every":"Кожні N тижнів","weeks":"Тижні","month_week":"Раз на місяць","month_day":"День місяця (1–31)","months":"Місяці вивезення (порожньо = весь рік)","holidays":"Святкові дні","holiday_calendar":"Календар свят","workday_calendar":"Календар робочих днів","hour":"Час вивезення","interval":"Днів між вивезеннями","scale":"Розмір","headroom":"Відступ зверху","compact":"Компактний","show_meter":"Індикатор заповнення","show_status":"Текст стану","theme_background":"Тло теми HA","full_color":"Повністю забарвлений контейнер","language":"Мова"},"helpers":{"entity":"Датчик, календар або input_datetime з наступним вивезенням. Залиште порожнім, щоб використати розклад нижче.","start_date":"Будь-яка дата, коли контейнер спорожнювали або спорожнять. Від неї вивезення повторюються кожні N тижнів.","every":"1 = щотижня, 2 = раз на два тижні, 4 = раз на чотири тижні. Потрібна початкова дата.","weeks":"Парність тижня ISO. Ігнорується, якщо задано початкову дату.","holidays":"Що відбувається, коли вивезення припадає на святковий день.","holiday_calendar":"Календар інтеграції Holiday. Якщо порожньо, знаходиться автоматично.","workday_calendar":"Календар інтеграції Workday, використовується для «наступного робочого дня». Якщо порожньо, знаходиться автоматично.","hour":"Час приїзду сміттєвоза; після нього контейнер показується як спорожнений.","interval":"Використовується лише із сутністю-датчиком для оцінки заповненості."},"options":{"container":{"wheelie_bin":"Контейнер на колесах","bag":"Сміттєвий мішок","bulky":"Великогабаритні відходи"},"weeks":{"all":"Щотижня","even":"Парні тижні","odd":"Непарні тижні"},"month_week":{"1":"1-й у місяці","2":"2-й у місяці","3":"3-й у місяці","4":"4-й у місяці","":"Щотижня","last":"Останній у місяці"},"holidays":{"none":"Ігнорувати свята","next_day":"Перенести на наступний день","next_work_day":"Перенести на наступний робочий день","shift_week":"Перенести на наступний тиждень","shift_rest_of_week":"Решта тижня зсувається на +1 день","cancel":"Скасовано"},"language":{"auto":"Автоматично (мова Home Assistant)"}}},"errors":{"bin_required":"Укажіть «bin» ({bins})","bin_unknown":"Невідомий контейнер «{bin}» (використовуйте {bins})","schedule_required":"Укажіть «days» (наприклад, [1, 4]), «start_date», «month_day» або «entity»","start_date_invalid":"«start_date» має бути датою, наприклад 2026-11-04","holidays_unknown":"Невідоме значення «holidays» «{value}» (використовуйте {values})"}}};
const DEFAULT_LANG = 'en';

/* The HA user's language (profile setting), falling back to the browser. */
function haLanguage(hass) {
  const h = hass || document.querySelector('home-assistant')?.hass;
  return h?.locale?.language || h?.language || navigator.language || DEFAULT_LANG;
}

/* Maps a language code to one we ship: exact → case/separator-insensitive → base language → English. */
function resolveLang(code) {
  if (!code) return DEFAULT_LANG;
  if (typeof window !== 'undefined' && typeof window.applianceResolveLanguage === 'function') {
    return window.applianceResolveLanguage(LANGS, code);
  }
  const c = String(code).replace('_', '-');
  return LANGS[c] ? c : DEFAULT_LANG;
}

/* Language for a card: the card's `language` option, or the HA user's language when "auto". */
function cardLanguage(pref, hass) {
  const raw = !pref || pref === 'auto' ? haLanguage(hass) : pref;
  const lang = resolveLang(raw);
  // dates use the full HA locale (e.g. en-AU → "4 Nov") when it shares the base language
  const dateLocale = String(raw).split(/[-_]/)[0].toLowerCase() === lang.split('-')[0].toLowerCase() ? String(raw).replace('_', '-') : lang;
  return { lang, dateLocale };
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));

/* t('fr', 'card.in_days', { n: 3 }) → "Dans 3 j" */
function t(lang, path, vars) {
  const v = get(LANGS[lang], path) ?? get(LANGS[DEFAULT_LANG], path);
  if (v == null) return path;
  return typeof v === 'string' ? fill(v, vars) : v;
}

const safeLocale = l => { try { new Intl.DateTimeFormat(l); return l; } catch { return DEFAULT_LANG; } };

/* 0 = Monday … 6 = Sunday (1 Jan 2024 was a Monday) */
const weekdayName = (locale, idx, style = 'long') =>
  new Intl.DateTimeFormat(safeLocale(locale), { weekday: style }).format(new Date(2024, 0, 1 + idx));
const monthName = (locale, m, style = 'long') =>
  new Intl.DateTimeFormat(safeLocale(locale), { month: style }).format(new Date(2024, m - 1, 1));
const shortDate = (locale, d) =>
  d.toLocaleDateString(safeLocale(locale), { day: 'numeric', month: 'short' });

/* Config values are English (canonical). French and older English spellings stay accepted
 * as aliases forever, so existing dashboards keep working. */

const table = groups => {
  const out = {};
  for (const [canon, aliases] of Object.entries(groups)) for (const a of [canon, ...aliases]) out[a] = canon;
  return out;
};

const BIN_ALIASES = table({
  grey: ['gray', 'grise', 'gris'],
  black: ['noire', 'noir'],
  yellow: ['jaune'],
  green: ['verte', 'vert'],
  blue: ['bleue', 'bleu'],
  brown: ['marron', 'brune', 'brun'],
  red: ['rouge'],
  purple: ['violet', 'violette', 'mauve'],
  burgundy: ['maroon', 'bordeaux'],
  lime: ['lime_green', 'lime-green', 'citron_vert', 'vert_clair'],
});
const BINS = ['grey', 'black', 'yellow', 'green', 'blue', 'brown', 'red', 'purple', 'burgundy', 'lime'];

const CONTAINER_ALIASES = table({
  wheelie_bin: ['bac', 'bin', 'wheelie', 'conteneur'],
  bag: ['bags', 'sac', 'sacs'],
  bulky: ['bulky_waste', 'encombrants', 'encombrant'],
});
const CONTAINERS = ['wheelie_bin', 'bag', 'bulky'];

const WEEKS_ALIASES = table({
  all: ['every', 'toutes', 'toute', 'tous'],
  even: ['paires', 'paire', 'pair'],
  odd: ['impaires', 'impaire', 'impair'],
});
const WEEKS = ['all', 'even', 'odd'];

/* next_day changed meaning in 2.0: it now means the next calendar day.
   The old "next working day" behaviour is next_work_day (French report / shift keep mapping to it). */
const HOLIDAY_ALIASES = table({
  none: ['aucun', 'ignore', 'off'],
  next_day: [],
  next_work_day: ['report', 'reportee', 'reportée', 'shift', 'next_workday', 'next_working_day'],
  shift_week: ['skip_week', 'next_week'],
  shift_rest_of_week: ['decalage', 'décalage', 'week', 'semaine'],
  cancel: ['annule', 'annulée', 'annulee', 'skip'],
});
const HOLIDAY_MODES = ['none', 'next_day', 'next_work_day', 'shift_week', 'shift_rest_of_week', 'cancel'];
const HOLIDAY_NEEDS_WORKDAY = new Set(['next_work_day']);

const DAY_NAMES = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
  lundi: 0, mardi: 1, mercredi: 2, jeudi: 3, vendredi: 4, samedi: 5, dimanche: 6,
  lun: 0, mar: 1, mer: 2, jeu: 3, ven: 4, sam: 5, dim: 6,
};
const MONTH_NAMES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
  janvier: 1, fevrier: 2, février: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, aout: 8, août: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12, décembre: 12,
  fev: 2, fév: 2, avr: 4, juil: 7, déc: 12,
};

const lower = v => String(v ?? '').trim().toLowerCase();
const isName = v => typeof v === 'string' && v.trim() !== '' && isNaN(v);
const parseDay = d => (isName(d) ? DAY_NAMES[lower(d)] : Number(d));
const parseMonth = m => (isName(m) ? MONTH_NAMES[lower(m)] : Number(m));

const normBin = v => BIN_ALIASES[lower(v)];
const normContainer = v => (v == null || v === '' ? undefined : CONTAINER_ALIASES[lower(v)]);
const normWeeks = v => (v == null || v === '' ? undefined : WEEKS_ALIASES[lower(v)]);
const normHolidays = v => (v == null || v === '' ? undefined : HOLIDAY_ALIASES[lower(v)]);

/* Returns a copy of the config with canonical English values (unknown values are left as written,
   so setConfig can report them). Used by both the card and the visual editor. */
function normalizeConfig(c) {
  const out = { ...c };
  if (out.bin != null) {
    let b = normBin(out.bin) ?? out.bin;
    if (b === 'grey' && ['noire', 'black'].includes(lower(out.tint))) b = 'black'; // v0 compatibility
    out.bin = b;
  }
  delete out.tint;
  for (const [k, fn] of [['container', normContainer], ['weeks', normWeeks], ['holidays', normHolidays]]) {
    if (out[k] == null || out[k] === '') continue;
    const v = fn(out[k]);
    if (v) out[k] = v;
  }
  if (out.container === 'wheelie_bin') delete out.container; // default
  if (out.weeks === 'all') delete out.weeks;                 // default
  if (out.holidays === 'none') delete out.holidays;          // default
  if ('region' in out) delete out.region;                    // French holiday regions: replaced by the Holiday integration
  return out;
}

/* Pure scheduling logic (no DOM, no hass) so it can be unit-tested with node --test. */
const DAY_MS = 86400000;
const midnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + (Number(n) || 0)); return x; };
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/* whole days between two dates, safe across DST changes */
const daysBetween = (a, b) => Math.round((midnight(b) - midnight(a)) / DAY_MS);
/* 0 = Monday … 6 = Sunday */
const weekdayIdx = d => (d.getDay() + 6) % 7;
const mondayOf = d => addDays(midnight(d), -weekdayIdx(d));
/* ISO 8601 week number (used by weeks: even / odd) */
const isoWeek = d => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / DAY_MS + 1) / 7);
};
/* "2026-11-04" → local midnight (never UTC); anything else → Date or null */
const parseDate = v => {
  if (v == null || v === '') return null;
  if (v instanceof Date) return isNaN(v) ? null : midnight(v);
  const s = String(v).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + 'T00:00:00') : new Date(s);
  return isNaN(d) ? null : midnight(d);
};

/* Turns a (normalised) card config into the rule used by computeFixed. */
function buildRule(c) {
  const mday = c.month_day != null && c.month_day !== ''
    ? [].concat(c.month_day).map(Number).filter(x => x >= 1 && x <= 31) : [];
  const startDate = parseDate(c.start_date);
  let days = [].concat(c.days ?? []).map(parseDay).filter(d => d >= 0 && d <= 6);
  if (!days.length && startDate && !mday.length) days = [weekdayIdx(startDate)];
  const months = [].concat(c.months ?? []).map(parseMonth).filter(m => m >= 1 && m <= 12);
  const monthWeeks = (Array.isArray(c.month_week) ? c.month_week : String(c.month_week ?? '').split(/[\s,;]+/))
    .map(x => String(x).trim().toLowerCase())
    .map(x => (['last', 'dernier', 'derniere', 'dernière', '-1'].includes(x) ? -1 : (Number(x) >= 1 && Number(x) <= 5 ? Number(x) : 0)))
    .filter(Boolean);
  const w = normWeeks(c.weeks);
  return {
    days, mday, months, monthWeeks, startDate,
    every: Math.max(1, Math.round(Number(c.every) || 1)),
    weeks: w === 'even' ? 0 : w === 'odd' ? 1 : null,
    holidays: normHolidays(c.holidays) || 'none',
    hour: Number(c.hour ?? 9),
  };
}

/* Is a collection planned on day d (before any holiday adjustment)? */
function planned(rule, d) {
  if (rule.months.length && !rule.months.includes(d.getMonth() + 1)) return false;
  if (rule.mday.length) {
    const lastDom = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return rule.mday.some(x => d.getDate() === Math.min(x, lastDom));
  }
  if (!rule.days.includes(weekdayIdx(d))) return false;
  if (rule.monthWeeks.length) {
    const isLast = addDays(d, 7).getMonth() !== d.getMonth();
    return rule.monthWeeks.some(w => (w === -1 ? isLast : Math.ceil(d.getDate() / 7) === w));
  }
  if (rule.startDate) {
    // whole weeks between the anchor's week and d's week (Monday-based), every N weeks
    const wk = Math.round(daysBetween(mondayOf(rule.startDate), mondayOf(d)) / 7);
    return ((wk % rule.every) + rule.every) % rule.every === 0;
  }
  return rule.weeks === null || isoWeek(d) % 2 === rule.weeks;
}

/* Actual date of a collection planned on d, or null if cancelled.
   ctx.isHoliday(d) → bool; ctx.isWorkday(d) → bool, or null when no Workday calendar is available. */
function effective(rule, d, ctx) {
  const hol = x => !!ctx.isHoliday(x);
  switch (rule.holidays) {
    case 'next_day':
      return hol(d) ? addDays(d, 1) : d;
    case 'next_work_day': {
      if (!hol(d)) return d;
      for (let x = addDays(d, 1), i = 0; i < 14; i++, x = addDays(x, 1)) {
        const wd = ctx.isWorkday(x);
        // without a Workday calendar: skip holidays and Sundays (pre-2.0 behaviour)
        if (wd === null ? (!hol(x) && x.getDay() !== 0) : (wd && !hol(x))) return x;
      }
      return addDays(d, 1);
    }
    case 'shift_week': {
      let x = d;
      for (let i = 0; i < 5 && hol(x); i++) x = addDays(x, 7);
      return x;
    }
    case 'shift_rest_of_week': {
      // a holiday earlier in the same week (or on the day) pushes this collection back one day
      for (let x = mondayOf(d); x <= d; x = addDays(x, 1)) if (x.getDay() !== 0 && hol(x)) return addDays(d, 1);
      return d;
    }
    case 'cancel':
      return hol(d) ? null : d;
    default:
      return d;
  }
}

/* Collections around today: [{ k: days from today, moved: bool }], sorted, de-duplicated. */
function collections(rule, now, ctx, range) {
  const today = midnight(now);
  // fenêtre : au moins un intervalle complet (every semaines) de part et d'autre, plus une marge pour les reports de jours fériés
  const K = range ?? (rule.months.length ? 370 : Math.max(75, rule.every * 7 + 42));
  const seen = new Map();
  for (let k = -K; k <= K; k++) {
    const d = addDays(today, k);
    if (!planned(rule, d)) continue;
    const e = effective(rule, d, ctx);
    if (!e) continue;
    const ek = daysBetween(today, e), moved = dayKey(e) !== dayKey(d);
    // a moved collection landing on a regular one counts once, as regular
    const prev = seen.get(ek);
    seen.set(ek, { k: ek, moved: prev ? prev.moved && moved : moved });
  }
  return [...seen.values()].toSorted((a, b) => a.k - b.k);
}

/* Card state from a fixed schedule: { state: ''|'eve'|'today'|'emptied'|'unknown', n, fill, moved } */
function computeFixed(rule, now, ctx) {
  const h = now.getHours() + now.getMinutes() / 60, H = rule.hour;
  const list = collections(rule, now, ctx);
  const next = list.find(x => x.k > 0 || (x.k === 0 && h < H));
  const last = list.findLast(x => x.k < 0 || (x.k === 0 && h >= H));
  if (!next || !last) return { state: 'unknown', n: null, fill: 0 };
  const n = next.k, l = -last.k, moved = next.moved;
  const fill = (l + n) ? l / (l + n) : 0;
  if (l === 0) return { state: 'emptied', n, fill: 0 };
  if (n === 0) return { state: 'today', n, fill: 1, moved };
  return { state: n === 1 ? 'eve' : '', n, fill, moved };
}

/* Expands calendar.get_events events into a Set of local "YYYY-MM-DD" keys (all-day end is exclusive). */
function eventDays(events) {
  const set = new Set();
  for (const ev of events || []) {
    const s = String(ev.start?.date || ev.start?.dateTime || ev.start || '');
    const e = String(ev.end?.date || ev.end?.dateTime || ev.end || '');
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(s);
    const a = parseDate(s);
    if (!a) continue;
    let b = parseDate(e);
    if (!b || b <= a) b = addDays(a, 1);
    else if (!allDay && (new Date(e) - b) > 0) b = addDays(b, 1); // timed event ending mid-day covers that day
    for (let x = a, i = 0; x < b && i < 400; x = addDays(x, 1), i++) set.add(dayKey(x));
  }
  return set;
}

/* Holiday / Workday calendars: one fetch per calendar per day, shared by every card on the page. */
const cache = new Map(); // `${entity}|${day}` → Promise<Set|null>

/* First calendar entity created by an integration ('holiday' or 'workday'), from the entity registry. */
function findCalendar(hass, platform) {
  const reg = hass?.entities || {};
  return Object.keys(reg).filter(id => id.startsWith('calendar.') && reg[id]?.platform === platform && hass.states?.[id]).sort()[0] || null;
}

/* Set of 'YYYY-MM-DD' days with an event, from about a year back to a year and a bit ahead
   (enough for seasonal schedules and holiday shifts). null if the calendar can't be read. */
function calendarDays(hass, entityId) {
  if (!hass?.callWS || !entityId) return Promise.resolve(null);
  const today = midnight(new Date()), key = `${entityId}|${dayKey(today)}`;
  if (cache.has(key)) return cache.get(key);
  for (const k of cache.keys()) if (k.startsWith(entityId + '|')) cache.delete(k); // yesterday's copy
  const p = hass.callWS({
    type: 'call_service', domain: 'calendar', service: 'get_events', return_response: true,
    target: { entity_id: entityId },
    service_data: { start_date_time: addDays(today, -380).toISOString(), end_date_time: addDays(today, 420).toISOString() },
  }).then(r => eventDays(r?.response?.[entityId]?.events), () => {
    setTimeout(() => cache.delete(key), 10 * 60000); // retry in 10 min
    return null;
  });
  cache.set(key, p);
  return p;
}

/* Artwork: bin images, bag / bulky-waste SVGs, overflowing contents, effects.
 * Originally from skyrotter/ha-poubelle-card (MIT). */
const PB_IMG = {
  grey: { lid: window.__acImg("poubelle",0), body: window.__acImg("poubelle",1) },
  yellow: { lid: window.__acImg("poubelle",2), body: window.__acImg("poubelle",3) },
};

/* Couleurs de poubelle : image de base + filtres CSS */
const PB_BINS = {
  grey:  { img: 'grey', color: '#9ea6b8', content: 'rubbish' },
  black:  { img: 'grey', color: '#7c8496', content: 'rubbish',
            body: 'brightness(.42) contrast(1.15)', lid: 'brightness(.42) contrast(1.15)' },
  yellow:  { img: 'yellow', color: '#ffc107', content: 'recycling', paint: '#f5b400' },
  green:  { img: 'yellow', color: '#4caf50', content: 'glass', paint: '#2f9e44', lid: 'hue-rotate(68deg) saturate(.85) brightness(.8)' },
  blue:  { img: 'yellow', color: '#42a5f5', content: 'paper', paint: '#1e6fd9', lid: 'hue-rotate(165deg) saturate(1.1) brightness(.85)' },
  brown: { img: 'yellow', color: '#a1887f', content: 'organics', paint: '#8a5a2b', lid: 'hue-rotate(-14deg) saturate(.75) brightness(.5)' },
  red:  { img: 'yellow', color: '#ef5350', content: 'rubbish', paint: '#d32f2f', lid: 'hue-rotate(-62deg) saturate(2.6) brightness(.72)' },
  purple: { img: 'yellow', color: '#ab47bc', content: 'glass', paint: '#7b2fa8', lid: 'hue-rotate(-140deg) saturate(1.2) brightness(.7)' },
  burgundy: { img: 'yellow', color: '#b0415a', content: 'organics', paint: '#7a1f35', paintBody: 'brightness(.55)', lid: 'hue-rotate(-75deg) saturate(1.5) brightness(.45)' },
  lime: { img: 'yellow', color: '#9ccc3c', content: 'organics', paint: '#8cc63f', lid: 'hue-rotate(40deg) saturate(1.1) brightness(1)' },
};
/* proportions des images de corps (largeur / hauteur), pour caler la peinture de full_color */
const PB_BODY_RATIO = { grey: '190/295', yellow: '190/291' };
/* la roue (en bas à droite de l'image) garde son noir : on la retire de la zone peinte */
const PB_WHEEL_HOLE = 'radial-gradient(ellipse 10% 15% at 89% 82%, transparent 96%, #000 100%)';

/* ---- sac poubelle (communes sans conteneurs) : couleur, et translucide ou non ---- */
const PB_BAG_COLORS = {
  grey: ['#5b6270', 1], black: ['#1f2328', 1], yellow: ['#f5c518', .7], green: ['#2f9e44', .9],
  blue: ['#2f6fd6', .85], brown: ['#7a4a26', 1], red: ['#d32f2f', .92],
  purple: ['#7b2fa8', .9], burgundy: ['#7a1f35', 1], lime: ['#8cc63f', .85],
};
/* sac noué vu de face, dans le même cadre 150 × 253 que la poubelle ; le contenu se devine dans un sac translucide */
const pbBagSvg = (col, op, content) => `<svg class="bagsvg" viewBox="0 0 150 253" aria-hidden="true">
 <defs><clipPath id="pbbag"><path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z"/></clipPath>
  <linearGradient id="pbbagsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
 <g class="bagg">
  ${op < 1 ? `<g clip-path="url(#pbbag)"><g transform="translate(10 120) scale(1 1.6)">${content}</g></g>` : ''}
  <path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z" fill="${col}" fill-opacity="${op}"/>
  <path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z" fill="url(#pbbagsh)" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>
  <g fill="none" stroke-linecap="round">
   <path d="M44 120 C36 150 34 190 40 236" stroke="#fff" stroke-opacity=".22" stroke-width="5"/>
   <path d="M108 112 C118 130 122 150 120 170" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
   <path d="M62 100 C70 130 66 170 74 206 M98 104 C92 140 104 176 96 222 M30 196 C52 204 78 200 104 214" stroke="#000" stroke-opacity=".22" stroke-width="2"/>
  </g>
  <!-- col froncé et nœud -->
  <path d="M58 90 C64 82 68 76 70 70 L80 70 C82 76 86 82 92 90 Z" fill="${col}"/>
  <path d="M62 86 L70 72 M75 88 V71 M88 86 L80 72" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>
  <ellipse cx="75" cy="69" rx="9" ry="6" fill="${col}"/>
  <path d="M70 66 C56 58 50 48 58 44 C66 41 72 54 74 64 Z" fill="${col}"/><path d="M80 66 C94 58 100 48 92 44 C84 41 78 54 76 64 Z" fill="${col}"/>
  <path d="M70 66 C56 58 50 48 58 44 C66 41 72 54 74 64 Z M80 66 C94 58 100 48 92 44 C84 41 78 54 76 64 Z" fill="#000" fill-opacity=".18"/>
 </g></svg>`;

/* ---- encombrants : tas d'objets (frigo, matelas, télé, pneu, carton, chaise, planche), même cadre 150 × 253 ---- */
const PB_BULKY_SVG = `<svg class="bulkysvg" viewBox="0 0 150 253" aria-hidden="true">
 <defs><linearGradient id="pbfr" x1="0" x2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#c3cad1"/></linearGradient>
  <linearGradient id="pbmat" x1="0" x2="1"><stop offset="0" stop-color="#9fb8d6"/><stop offset="1" stop-color="#6f8fb6"/></linearGradient></defs>
 <g class="bulkyg"><g transform="translate(75 252) scale(1.32) translate(-80 -252)">
  <!-- matelas appuyé à gauche -->
  <g transform="rotate(-14 30 250)"><rect x="8" y="118" width="40" height="134" rx="8" fill="url(#pbmat)"/>
   <path d="M14 140h28M14 166h28M14 192h28M14 218h28" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="3 4"/></g>
  <!-- vieux frigo -->
  <rect x="58" y="96" width="52" height="154" rx="5" fill="url(#pbfr)" stroke="#8d969f" stroke-width="1.2"/>
  <path d="M58 146h52" stroke="#8d969f" stroke-width="1.6"/>
  <rect x="62" y="104" width="4" height="30" rx="2" fill="#9aa3ac"/><rect x="62" y="154" width="4" height="40" rx="2" fill="#9aa3ac"/>
  <path d="M90 108l12 14M84 170l18 26" stroke="#c8ced4" stroke-width="2" stroke-linecap="round"/>
  <!-- chaise renversée sur le frigo -->
  <g transform="rotate(158 98 86)" fill="none" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"><path d="M80 70h34M84 70v30M110 70v30M80 70v-26M80 50h22"/></g>
  <!-- planche -->
  <rect x="96" y="196" width="56" height="9" rx="2" fill="#c08a4e" transform="rotate(-28 120 200)"/>
  <!-- carton -->
  <g transform="rotate(6 128 232)"><rect x="110" y="212" width="38" height="38" rx="2" fill="#c49a62"/><path d="M110 222h38M129 212v10" stroke="#8d6538" stroke-width="2"/></g>
  <!-- pneu -->
  <ellipse cx="34" cy="238" rx="27" ry="13" fill="#24272b"/><ellipse cx="34" cy="236" rx="13" ry="5.5" fill="#4a4f56"/>
  <path d="M10 236q24 -10 48 0" stroke="#3b3f45" stroke-width="2" fill="none"/>
  <!-- vieille télé, écran fendu -->
  <g transform="rotate(-6 62 222)"><rect x="34" y="194" width="56" height="44" rx="5" fill="#7a5a3a" stroke="#4e3a26" stroke-width="1.2"/>
   <rect x="39" y="199" width="36" height="34" rx="4" fill="#5f8f86"/><path d="M50 202l6 12l-8 8l10 9M62 214l10 -6" stroke="#e9f3f1" stroke-width="1.3" fill="none"/>
   <circle cx="83" cy="206" r="3" fill="#2b2f33"/><circle cx="83" cy="216" r="3" fill="#2b2f33"/></g>
 </g></g></svg>`;

/* ---- contenu qui dépasse quand c'est plein ---- */
const PB_CONTENT = {
  rubbish: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <ellipse cx="34" cy="48" rx="30" ry="24" fill="#3a3f4b"/><path d="M28 24 l6 -12 l6 12z" fill="#3a3f4b"/><path d="M22 36 q10 -8 24 0" stroke="#6b7385" stroke-width="3" fill="none"/>
 <ellipse cx="88" cy="44" rx="32" ry="27" fill="#454b59"/><path d="M82 17 l7 -13 l7 13z" fill="#454b59"/><path d="M72 32 q15 -9 30 0" stroke="#727b8f" stroke-width="3" fill="none"/>
 <ellipse cx="60" cy="58" rx="24" ry="15" fill="#525a6b"/><path d="M40 20 q4 -14 12 -4" stroke="#e8c547" stroke-width="4" fill="none" stroke-linecap="round"/>
 <circle cx="112" cy="28" r="5" fill="#6b4f2c"/></svg>`,
  recycling: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="6" y="20" width="44" height="46" rx="3" fill="#b98a53" transform="rotate(-8 28 43)"/><path d="M8 26 l40 -6" stroke="#8d6538" stroke-width="3" transform="rotate(-8 28 43)"/>
 <rect x="54" y="8" width="16" height="56" rx="7" fill="#5aa9e6" opacity=".9"/><rect x="58" y="2" width="8" height="8" rx="2" fill="#2a6fb0"/><rect x="54" y="30" width="16" height="10" fill="#e6f2ff" opacity=".8"/>
 <rect x="78" y="24" width="18" height="40" rx="4" fill="#d9dde3" transform="rotate(12 87 44)"/><rect x="78" y="34" width="18" height="12" fill="#e53935" transform="rotate(12 87 44)"/>
 <rect x="98" y="16" width="28" height="48" rx="2" fill="#f1ede4" transform="rotate(10 112 40)"/><path d="M103 26h18M103 32h18M103 38h12" stroke="#9b978d" stroke-width="2" transform="rotate(10 112 40)"/></svg>`,
  glass: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="14" y="14" width="18" height="52" rx="7" fill="#2e7d32" opacity=".9" transform="rotate(-10 23 40)"/><rect x="19" y="4" width="8" height="12" rx="2" fill="#1b5e20" transform="rotate(-10 23 40)"/>
 <rect x="44" y="22" width="22" height="44" rx="8" fill="#a5d6a7" opacity=".8"/><rect x="50" y="12" width="10" height="12" rx="2" fill="#81c784"/>
 <rect x="76" y="10" width="17" height="56" rx="7" fill="#6d4c41" opacity=".9" transform="rotate(8 84 38)"/><rect x="80" y="0" width="8" height="12" rx="2" fill="#4e342e" transform="rotate(8 84 38)"/>
 <rect x="100" y="28" width="22" height="38" rx="5" fill="#e0f2f1" opacity=".75"/><rect x="102" y="22" width="18" height="8" rx="2" fill="#b0bec5"/></svg>`,
  paper: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="8" y="22" width="46" height="44" rx="3" fill="#c49a62" transform="rotate(-10 31 44)"/><path d="M10 28 l42 -6" stroke="#8d6538" stroke-width="3" transform="rotate(-10 31 44)"/>
 <rect x="50" y="12" width="34" height="50" rx="2" fill="#f5f2ea" transform="rotate(6 67 37)"/><path d="M56 22h22M56 29h22M56 36h22M56 43h14" stroke="#9b978d" stroke-width="2" transform="rotate(6 67 37)"/>
 <rect x="86" y="18" width="36" height="46" rx="2" fill="#dfe7f2" transform="rotate(14 104 41)"/><rect x="90" y="24" width="28" height="12" fill="#90a4ae" transform="rotate(14 104 41)"/></svg>`,
  organics: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <ellipse cx="30" cy="50" rx="26" ry="20" fill="#6d8b3a"/><path d="M18 34 q12 -22 26 -4" fill="#8bc34a"/>
 <ellipse cx="72" cy="46" rx="24" ry="22" fill="#7a5a3a"/><circle cx="64" cy="36" r="9" fill="#e53935"/><path d="M64 27 q3 -6 7 -5" stroke="#4e342e" stroke-width="2.5" fill="none"/>
 <path d="M90 60 q10 -40 34 -46 q-6 30 -34 46z" fill="#9ccc65"/><path d="M92 58 q14 -22 30 -40" stroke="#558b2f" stroke-width="2" fill="none"/>
 <circle cx="44" cy="22" r="6" fill="#ffb74d"/></svg>`,
};

const PB_FX_FLY = `<span class="fly f1"></span><span class="fly f2"></span><span class="fly f3"></span>`;
const PB_FX_STINK = [1, 2, 3].map(i => `<span class="stink s${i}"><svg viewBox="0 0 14 40"><path d="M7 38 C0 30 14 24 7 16 C0 8 14 4 7 0" stroke="rgba(160,200,120,.75)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg></span>`).join('');
const PB_FX_SPARK = [1, 2, 3].map(i => `<svg class="spark sp${i}" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#b8f5bb"/></svg>`).join('');

/* Visual editor: ha-form with labels in the HA user's language, fields shown only when they apply,
 * and legacy (French) values shown as their English equivalents. */
/* ha-form is only registered once HA has loaded one of its own editors */
let formReady;
const ensureForm = () => formReady ??= (async () => {
  if ((window.__acHasReal||customElements.get.bind(customElements))('ha-form')) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const el = await helpers?.createCardElement({ type: 'entities', entities: [] });
    await el?.constructor?.getConfigElement?.();
  } catch (e) { /* ignore: falls back to whenDefined */ }
  await customElements.whenDefined('ha-form');
})();

/* valeur CSS de la config (couleur, filtre) insérée dans <style> : refusée si elle peut sortir de la déclaration */
const cssSafe = v => { const s = String(v ?? '').trim(); return /[<>{};"'\\]/.test(s) ? '' : s; };

const isEmpty = v => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);

class PoubelleCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = normalizeConfig(config || {});
    this._render();
  }

  set hass(h) {
    this._hass = h;
    if (this._form) this._form.hass = h;
    else this._render();
  }

  _schema(lang, loc) {
    const c = this._config, opt = (group, values) => values.map(v => ({ value: v, label: t(lang, `editor.options.${group}.${v}`) }));
    const sel = options => ({ select: { mode: 'dropdown', options } });
    const entity = String(c.entity || ''), mode = c.holidays || 'none';
    const s = [
      { name: 'bin', required: true, selector: sel(BINS.map(b => ({ value: b, label: t(lang, `card.bin.${b}`) }))) },
      { name: 'name', selector: { text: {} } },
      { name: 'container', selector: sel(opt('container', CONTAINERS)) },
      { name: 'image', selector: { text: {} } },
      { name: 'entity', selector: { entity: { filter: { domain: ['sensor', 'calendar', 'input_datetime'] } } } },
    ];
    if (entity.startsWith('calendar.')) s.push(
      { name: 'calendar_filter', selector: { text: {} } },
      { name: 'calendar_offset', selector: { number: { min: -7, max: 7, mode: 'box' } } });
    if (!entity) {
      s.push(
        { name: 'days', selector: { select: { multiple: true, options: [0, 1, 2, 3, 4, 5, 6].map(i => ({ value: String(i), label: weekdayName(loc, i) })) } } },
        { name: 'start_date', selector: { date: {} } });
      if (c.start_date) s.push({ name: 'every', selector: { number: { min: 1, max: 12, mode: 'box' } } });
      else s.push({ name: 'weeks', selector: sel(opt('weeks', WEEKS)) });
      s.push(
        { name: 'month_week', selector: sel(['', '1', '2', '3', '4', 'last'].map(v => ({ value: v, label: t(lang, `editor.options.month_week.${v}`) }))) },
        { name: 'month_day', selector: { number: { min: 1, max: 31, mode: 'box' } } },
        { name: 'months', selector: { select: { multiple: true, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monthName(loc, i + 1) })) } } },
        { name: 'holidays', selector: sel(opt('holidays', HOLIDAY_MODES)) });
      if (mode !== 'none') s.push({ name: 'holiday_calendar', selector: { entity: { filter: { domain: 'calendar', integration: 'holiday' } } } });
      if (mode === 'next_work_day') s.push({ name: 'workday_calendar', selector: { entity: { filter: { domain: 'calendar', integration: 'workday' } } } });
    }
    s.push(
      { type: 'grid', name: '', schema: [
        { name: 'hour', selector: { number: { min: 0, max: 23.5, step: 0.5, mode: 'box' } } },
        ...(entity && !entity.startsWith('calendar.') ? [{ name: 'interval', selector: { number: { min: 1, max: 60, mode: 'box' } } }] : []),
        { name: 'scale', selector: { number: { min: 0.3, max: 1.2, step: 0.01, mode: 'slider' } } },
        { name: 'headroom', selector: { number: { min: 0, max: 70, mode: 'box' } } },
      ] },
      { type: 'grid', name: '', schema: ['compact', 'show_meter', 'show_status', 'theme_background', 'full_color'].map(n => ({ name: n, selector: { boolean: {} } })) },
      { name: 'language', selector: sel([{ value: 'auto', label: t(lang, 'editor.options.language.auto') },
        ...Object.entries(LANGS).map(([k, v]) => ({ value: k, label: v.language_name }))]) },
    );
    return s;
  }

  async _render() {
    if (!this._hass || !this._config) return;
    await ensureForm();
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', e => this._changed(e));
      this.appendChild(this._form);
    }
    const { lang, dateLocale } = cardLanguage('auto', this._hass); // the editor follows the HA user's language
    const c = this._config;
    this._form.hass = this._hass;
    this._form.data = {
      show_meter: true, show_status: true, ...c,
      container: c.container || 'wheelie_bin', weeks: c.weeks || 'all', holidays: c.holidays || 'none', language: c.language || 'auto',
      month_week: c.month_week == null ? '' : String(c.month_week),
      days: [].concat(c.days ?? []).map(parseDay).filter(d => d >= 0 && d <= 6).map(String),
      months: [].concat(c.months ?? []).map(parseMonth).filter(m => m >= 1 && m <= 12).map(String),
    };
    this._form.schema = this._schema(lang, dateLocale);
    this._form.computeLabel = s => t(lang, `editor.labels.${s.name}`);
    this._form.computeHelper = s => { const h = t(lang, `editor.helpers.${s.name}`); return h.startsWith('editor.') ? undefined : h; };
  }

  _changed(ev) {
    ev.stopPropagation();
    const v = { ...ev.detail.value };
    if (Array.isArray(v.days)) v.days = v.days.map(Number);
    if (Array.isArray(v.months)) v.months = v.months.map(Number);
    if (v.language === 'auto') delete v.language;
    if (v.show_meter === true) delete v.show_meter;
    if (v.show_status === true) delete v.show_status;
    if (!v.start_date) delete v.every;
    if (!v.holidays || v.holidays === 'none') { delete v.holiday_calendar; delete v.workday_calendar; }
    if (v.holidays !== 'next_work_day') delete v.workday_calendar;
    for (const k of Object.keys(v)) if (isEmpty(v[k])) delete v[k];
    const config = normalizeConfig(v);
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
    this._render();
  }
}

customElements.define(`${TAG}-editor`, PoubelleCardEditor);

/*!
 * poubelle-card — animated Lovelace card for bin collection days
 * https://github.com/skyrotter/ha-poubelle-card — MIT License
 */
// Set by the release workflow from the release tag (v2.1.0 -> '2.1.0'); don't edit by hand.
const CONTENT_ALIASES = { ordures: 'rubbish', recyclables: 'recycling', verre: 'glass', papier: 'paper', biodechets: 'organics' };
/* internal state → CSS class (French class names kept so existing card-mod styles still apply) */
const STATE_CLASS = { eve: 'veille', today: 'jour', emptied: 'videe', unknown: '', '': '' };

class PoubelleCard extends HTMLElement {
  static getStubConfig() { return { bin: 'yellow', days: [1], hour: 9 }; }
  static getConfigElement() { return document.createElement(`${TAG}-editor`); }

  setConfig(raw) {
    const err = (key, vars) => new Error(`${TAG}: ` + t(resolveLang(raw?.language && raw.language !== 'auto' ? raw.language : haLanguage(this._hass)), `errors.${key}`, vars));
    if (!raw) throw err('bin_required', { bins: BINS.join(', ') });
    let c = normalizeConfig(raw);
    // bulky waste: no bin colour needed, grey meter by default
    if (!c.bin && c.container === 'bulky') c = { ...c, bin: 'grey' };
    if (!c.bin) throw err('bin_required', { bins: BINS.join(', ') });
    if (!PB_BINS[c.bin]) throw err('bin_unknown', { bin: raw.bin, bins: BINS.join(', ') });
    if (c.holidays && !HOLIDAY_MODES.includes(c.holidays)) throw err('holidays_unknown', { value: raw.holidays, values: HOLIDAY_MODES.join(', ') });
    if (c.start_date != null && c.start_date !== '' && !parseDate(c.start_date)) throw err('start_date_invalid');
    const rule = buildRule(c);
    if (!c.entity && !rule.mday.length && !rule.days.length) throw err('schedule_required');
    this._rule = rule;
    this._bin = c.bin;
    this._bag = c.container === 'bag';
    this._bulky = c.container === 'bulky';
    this._c = Object.assign({ hour: 9, interval: 7, scale: 0.62, headroom: 70, language: 'auto' }, c);
    this._cal = null; this._calAt = 0; this._calKey = null;
    this._hol = null; this._work = null; this._holKey = null;
    this._build();
    this._loadCal(true);
    this._loadHolidays();
  }

  set hass(h) {
    const old = this._hass;
    this._hass = h;
    const e = this._c && this._c.entity;
    if (e && (!old || old.states[e] !== h.states[e])) this._loadCal(true);
    if (!old || old.entities !== h.entities) this._loadHolidays();
    if (!old || (e && old.states[e] !== h.states[e]) || (old.locale?.language !== h.locale?.language)) this._render();
  }

  /* calendar.* entity: HA's state only shows the next event (any title), so read the events of the
     past and next 60 days (calendar.get_events) to filter by title and base the fill on the real last pickup. */
  async _loadCal(force) {
    const c = this._c, e = c && c.entity, h = this._hass;
    if (!h || !e || !e.startsWith('calendar.') || !h.callWS) return;
    const key = `${e}|${[].concat(c.calendar_filter ?? []).join('|')}|${c.calendar_offset ?? 0}`;
    if (!force && this._calKey === key && Date.now() - this._calAt < 30 * 60000) return;
    this._calKey = key; this._calAt = Date.now();
    const start = midnight(new Date()); start.setDate(start.getDate() - 60);
    const end = new Date(start); end.setDate(end.getDate() + 121);
    try {
      const r = await h.callWS({ type: 'call_service', domain: 'calendar', service: 'get_events', target: { entity_id: e },
        service_data: { start_date_time: start.toISOString(), end_date_time: end.toISOString() }, return_response: true });
      const words = [].concat(c.calendar_filter ?? []).map(w => String(w).trim().toLowerCase()).filter(Boolean);
      const evs = (r?.response?.[e]?.events || []).filter(ev => !words.length
        || words.some(w => String(ev.summary || '').toLowerCase().includes(w)));
      // all-day event: "2026-11-03" must stay a local date (otherwise UTC shifts it)
      this._cal = evs.map(ev => addDays(parseDate(String(ev.start?.date || ev.start?.dateTime || ev.start || '')) || new Date(NaN), c.calendar_offset))
        .filter(d => !isNaN(d));
    } catch (err) { this._cal = null; } // service unavailable: fall back to the entity's start_time
    this._render();
  }

  /* Holiday and Workday calendars (configured, or found automatically from the entity registry). */
  _calendars() {
    const c = this._c, h = this._hass, mode = this._rule?.holidays || 'none';
    if (!h || c.entity || mode === 'none') return { holiday: null, workday: null };
    return {
      holiday: c.holiday_calendar || findCalendar(h, 'holiday'),
      workday: HOLIDAY_NEEDS_WORKDAY.has(mode) ? (c.workday_calendar || findCalendar(h, 'workday')) : null,
    };
  }

  async _loadHolidays() {
    const h = this._hass; if (!h || !this._c) return;
    const { holiday, workday } = this._calendars();
    const key = `${holiday}|${workday}|${dayKey(new Date())}`;
    if (key === this._holKey) return;
    this._holKey = key;
    const [hol, work] = await Promise.all([calendarDays(h, holiday), calendarDays(h, workday)]);
    if (key !== this._holKey) return; // config changed meanwhile
    // échec de lecture (null alors qu'un calendrier est configuré) : on oublie la clé pour réessayer au prochain tour
    // (calendarDays garde l'échec en cache 10 min, puis relance vraiment la lecture)
    if ((holiday && !hol) || (workday && !work)) this._holKey = null;
    this._hol = hol; this._work = work;
    this._render();
  }

  getCardSize() { return 4; }
  getGridOptions() { return { columns: 6, rows: 'auto', min_columns: 3 }; }
  connectedCallback() {
    clearInterval(this._t);
    this._t = setInterval(() => { this._loadCal(); this._loadHolidays(); this._render(); }, 60000);
    this._render();
  }
  disconnectedCallback() { clearInterval(this._t); }

  _lang() { return cardLanguage(this._c?.language, this._hass); }

  _build() {
    const c = this._c, s = Number(c.scale), hr = Number(c.headroom ?? 70), B = PB_BINS[this._bin];
    const color = cssSafe(c.color) || B.color;
    const content = PB_CONTENT[CONTENT_ALIASES[c.content] || c.content] || PB_CONTENT[B.content];
    // full_color : tout le bac prend la couleur (et pas seulement le couvercle). Une couche de la couleur,
    // découpée à la forme du corps, colorise le gris en gardant ses ombres et ses reflets (mix-blend-mode: color).
    const img = String(c.image || '').trim();
    const paint = c.full_color && !this._bag && !this._bulky && !img ? (cssSafe(c.body_color) || B.paint || '') : '';
    // dark colours (burgundy) darken the grey body under the paint, which only sets hue and saturation
    const bodyF = cssSafe(c.body_filter) || (paint && !cssSafe(c.body_color) && B.paintBody) || B.body || '', lidF = cssSafe(c.lid_filter) || B.lid || '';
    const [bagCol, bagOp] = PB_BAG_COLORS[this._bin];
    const bodyImg = PB_IMG[B.img].body;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
    :host{display:block}
    ha-card{background:var(--poubelle-card-background,linear-gradient(170deg,rgba(30,36,56,.75),rgba(20,24,38,.7)));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--poubelle-card-border-color,rgba(255,255,255,.08));border-radius:var(--ha-card-border-radius,22px);padding:12px 12px 14px;display:grid;gap:8px;justify-items:center;overflow:hidden;transition:box-shadow .6s,border-color .6s;animation:fadeUp .6s ease both;color:var(--poubelle-card-text-color,#eef1f8)}
    ${c.theme_background ? 'ha-card{background:var(--ha-card-background,var(--card-background-color));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color));color:var(--primary-text-color)}'
      // fond du thème (souvent clair) : textes des badges mélangés à la couleur de texte du thème, lisibles en clair comme en sombre
      // (préfixe ha-card : passe devant les règles .pill plus bas)
      + 'ha-card .pill{color:var(--poubelle-card-secondary-color,var(--secondary-text-color))}'
      + 'ha-card .pill.veille{color:color-mix(in srgb,#ff5a4e 65%,var(--primary-text-color))}ha-card .pill.jour{color:color-mix(in srgb,#3d7bff 65%,var(--primary-text-color))}ha-card .pill.videe{color:color-mix(in srgb,#3a9b3e 65%,var(--primary-text-color))}' : ''}
    ha-card.clickable{cursor:pointer}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    .card.veille{border-color:rgba(255,90,78,.55);box-shadow:0 0 0 1px rgba(255,90,78,.25),0 10px 34px rgba(255,90,78,.18)}
    .card.videe{border-color:rgba(76,175,80,.5);box-shadow:0 10px 34px rgba(76,175,80,.16)}
    .head{width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px}
    .name{font-weight:700;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .pill{font-weight:600;font-size:11px;padding:4px 8px;border-radius:999px;background:rgba(127,127,127,.14);color:var(--poubelle-card-secondary-color,#9aa3b8);white-space:nowrap}
    .pill.veille{background:rgba(255,90,78,.18);color:#ffb3ad}.pill.jour{background:rgba(111,168,255,.18);color:#bcd4ff}.pill.videe{background:rgba(76,175,80,.18);color:#a8e0aa}
    .scaler{width:${150 * s}px;height:${(253 + hr) * s}px;position:relative}
    .stage-wrap{position:absolute;left:0;top:${-(70 - hr) * s}px;transform:scale(${s});transform-origin:0 0;width:150px;height:${253 + 70}px}
    /* ---- la poubelle ---- */
    .stage{position:relative;width:150px;height:253px;margin-top:70px}
    .bin{position:absolute;inset:0;transform-origin:50% 100%}
    .body{position:absolute;left:0;bottom:0;width:150px;z-index:2;filter:${bodyF} drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    /* .lift éclaircit les gris moyens (overlay blanc : le noir des roues reste noir), puis .paint les colore */
    .lift,.paint{position:absolute;left:0;bottom:0;width:150px;aspect-ratio:${PB_BODY_RATIO[B.img]};z-index:2;pointer-events:none;
      -webkit-mask:url("${bodyImg}") center/100% 100% no-repeat,${PB_WHEEL_HOLE};-webkit-mask-composite:source-in;
      mask:url("${bodyImg}") center/100% 100% no-repeat,${PB_WHEEL_HOLE};mask-composite:intersect;${paint ? '' : 'display:none'}}
    .lift{background:#fff;mix-blend-mode:overlay;opacity:.75}
    .paint{background:${paint || 'transparent'};mix-blend-mode:color}
    .trash{position:absolute;left:12px;right:12px;top:-44px;height:80px;z-index:1;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .lid{position:absolute;left:0;top:${B.img === 'yellow' ? 3 : 0}px;width:150px;z-index:3;transform-origin:92% 100%;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1);${lidF ? `filter:${lidF};` : ''}}
    .bagsvg{position:absolute;left:0;bottom:0;width:150px;height:253px;z-index:2;overflow:visible;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .bagg{transform-origin:75px 250px;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .bagmode .fx{top:40px}
    .bulkysvg{position:absolute;left:0;bottom:0;width:150px;height:253px;z-index:2;overflow:visible;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .bulkyg{transform-origin:75px 252px;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .custom{position:absolute;left:0;bottom:0;width:150px;height:253px;object-fit:contain;object-position:50% 100%;z-index:2;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .shadow{position:absolute;left:10px;right:10px;bottom:-8px;height:14px;border-radius:50%;background:rgba(0,0,0,.45);filter:blur(6px);z-index:0}
    .card.veille .bin{animation:shake 1.8s ease-in-out infinite}
    .card.jour .bin{animation:hop 1.1s ease-in-out infinite}
    .card.plein .trash{animation:wobble 2.6s ease-in-out infinite}
    @keyframes shake{0%,55%,100%{transform:rotate(0)}60%{transform:rotate(-4deg)}66%{transform:rotate(3.5deg)}72%{transform:rotate(-3deg)}78%{transform:rotate(2deg)}84%{transform:rotate(-1deg)}}
    @keyframes hop{0%,100%{transform:translateY(0)}45%{transform:translateY(-8px)}}
    @keyframes wobble{0%,100%{rotate:0deg}50%{rotate:-1.5deg}}
    /* mouches + odeurs quand c'est plein */
    .fx{position:absolute;inset:-95px -20px auto -20px;height:110px;z-index:4;pointer-events:none;opacity:0;transition:opacity .6s}
    .card.plein .fx{opacity:1}
    .fly{position:absolute;width:5px;height:5px;border-radius:50%;background:#0b0b0b;box-shadow:0 0 0 1px rgba(255,255,255,.25)}
    .fly::before,.fly::after{content:"";position:absolute;top:-3px;width:5px;height:4px;border-radius:50%;background:rgba(220,235,255,.55)}
    .fly::before{left:-3px}.fly::after{right:-3px}
    .f1{animation:orbit1 3.2s linear infinite}.f2{animation:orbit2 2.6s linear infinite}.f3{animation:orbit1 4.1s linear infinite reverse}
    @keyframes orbit1{0%{transform:translate(40px,60px)}25%{transform:translate(110px,30px)}50%{transform:translate(160px,70px)}75%{transform:translate(90px,95px)}100%{transform:translate(40px,60px)}}
    @keyframes orbit2{0%{transform:translate(150px,40px)}33%{transform:translate(70px,20px)}66%{transform:translate(120px,90px)}100%{transform:translate(150px,40px)}}
    .stink{position:absolute;bottom:18px;width:14px;height:40px;opacity:0;animation:rise 2.8s ease-in infinite}
    .stink svg{width:100%;height:100%}
    .s1{left:60px}.s2{left:100px;animation-delay:1s}.s3{left:135px;animation-delay:1.8s}
    @keyframes rise{0%{transform:translateY(20px);opacity:0}30%{opacity:.8}100%{transform:translateY(-30px);opacity:0}}
    /* étincelles quand c'est vidé */
    .spark{position:absolute;z-index:4;width:14px;height:14px;opacity:0;pointer-events:none}
    .card.videe .spark{animation:twinkle 2.4s ease-in-out infinite}
    .sp1{left:6px;top:40px}.sp2{right:8px;top:70px;animation-delay:.8s!important}.sp3{left:40px;top:4px;animation-delay:1.5s!important}
    @keyframes twinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}40%{opacity:1;transform:scale(1) rotate(45deg)}}
    .status{font-size:13px;font-weight:600;text-align:center;min-height:1.3em}
    .warn{font-size:11px;text-align:center;color:var(--warning-color,#ffa600)}.warn[hidden]{display:none}
    .meter{width:100%;display:grid;gap:4px}
    .meter-top{display:flex;justify-content:space-between;color:var(--poubelle-card-secondary-color,#9aa3b8);font-size:11px;font-variant-numeric:tabular-nums}
    .bar{height:6px;border-radius:99px;background:rgba(127,127,127,.14);overflow:hidden}
    .bar i{display:block;height:100%;border-radius:99px;transition:width 1.1s ease;background:${color}}
    ${c.show_meter === false ? '.meter{display:none}' : ''}
    ${c.show_status === false ? '.status{display:none}' : ''}
    ${c.compact ? 'ha-card{padding:8px 10px 10px;gap:4px}.status{font-size:12px}' : ''}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    </style>
    <ha-card class="card${c.entity ? ' clickable' : ''}"><div class="head"><span class="name"></span><span class="pill"></span></div>
     <div class="scaler"><div class="stage-wrap"><div class="stage${this._bag || this._bulky || img ? ' bagmode' : ''}">
      <div class="fx">${PB_FX_FLY}${PB_FX_STINK}</div>${PB_FX_SPARK}<div class="shadow"></div>
      <div class="bin">${img ? `<img class="custom" src="${img.replace(/["<>]/g, '')}" alt="">` : this._bulky ? PB_BULKY_SVG : this._bag ? pbBagSvg(bagCol, bagOp, content) : `<div class="trash">${content}</div>
       <img class="body" src="${bodyImg}" alt=""><div class="lift"></div><div class="paint"></div><img class="lid" src="${PB_IMG[B.img].lid}" alt="">`}</div>
     </div></div></div>
     <div class="status"></div><div class="warn" hidden></div>
     <div class="meter"><div class="meter-top"><span class="ml"></span><span class="pct"></span></div><div class="bar"><i></i></div></div>
    </ha-card>`;
    this.shadowRoot.querySelector('ha-card').addEventListener('click', () => {
      if (!this._c.entity) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: this._c.entity } }));
    });
    this._render();
  }

  /* Next pickup date read from an entity (null if unknown) */
  _entityDate() {
    const st = this._hass?.states?.[this._c.entity];
    if (!st) return null;
    const a = st.attributes || {}, s = st.state;
    const today = midnight(new Date());
    const fromDays = n => addDays(today, Number(n));
    // nombre de jours : null, '', 'unknown' ou 'unavailable' ne valent pas 0 (« aujourd'hui »)
    const isNum = v => v != null && typeof v !== 'boolean' && String(v).trim() !== '' && isFinite(Number(v));
    if (isNum(a.daysTo)) return fromDays(a.daysTo);                                      // Waste Collection Schedule
    if (st.entity_id.startsWith('calendar.')) return a.start_time ? addDays(new Date(String(a.start_time).replace(' ', 'T')), this._c.calendar_offset) : null;
    if (st.entity_id.startsWith('input_datetime.') && a.year) return new Date(a.year, a.month - 1, a.day);
    if (s === 'unknown' || s === 'unavailable' || s === '' || s == null) return null;
    if (isNum(s)) return fromDays(s);                                                    // number of days
    const lower = String(s).toLowerCase();
    if (['today', "aujourd'hui", 'aujourdhui'].includes(lower)) return today;
    if (['tomorrow', 'demain'].includes(lower)) return fromDays(1);
    for (const k of ['nextDate', 'next_date', 'next_collection', 'date']) { const d = a[k] != null ? parseDate(a[k]) : null; if (d) return d; }   // date attributes
    const txt = String(s).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return parseDate(txt);                           // ISO date / timestamp
    // texte libre (Waste Collection Schedule : « on Thu, 03.12.2026 », « dans 3 jours »…) : jour.mois.année (ou /, -), année sur 2 chiffres acceptée
    // date ISO dans le texte (« Restmüll on 2026-11-04 ») d'abord : sinon jour.mois.année lirait 26-11-04
    const iso = txt.match(/(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/);
    if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    const dmy = txt.match(/(?<!\d)(\d{1,2})[./-](\d{1,2})[./-](\d{4}|\d{2})(?!\d)/);
    if (dmy) {
      const y = Number(dmy[3]) < 100 ? 2000 + Number(dmy[3]) : Number(dmy[3]), m = Number(dmy[2]), dd = Number(dmy[1]);
      const dt = new Date(y, m - 1, dd);
      if (m >= 1 && m <= 12 && dt.getMonth() === m - 1) return dt;
    }
    const inDays = lower.match(/(?:\bin\b|\bdans\b|\ben\b|\bover\b|\bza\b)\s+(\d+)\s*(?:day|jour|tag|dag|d[ií]a|giorn)/);
    if (inDays) return fromDays(inDays[1]);
    if (['heute', 'hoy', 'oggi', 'vandaag'].includes(lower)) return today;
    if (['morgen', 'mañana', 'domani'].includes(lower)) return fromDays(1);
    return parseDate(s);                                                                 // date / timestamp
  }

  /* Card state: { state: ''|'eve'|'today'|'emptied'|'unknown', n, fill, moved } */
  _compute() {
    const c = this._c, now = new Date();
    const h = now.getHours() + now.getMinutes() / 60, H = Number(c.hour);
    if (c.entity && this._cal) {
      // calendar: real next and last pickups, as with a fixed schedule
      const ks = this._cal.map(d => daysBetween(now, d));
      const next = ks.filter(k => k > 0 || (k === 0 && h < H)).sort((a, b) => a - b)[0];
      const last = ks.filter(k => k < 0 || (k === 0 && h >= H)).sort((a, b) => b - a)[0];
      if (next === undefined) return { state: last === 0 ? 'emptied' : 'unknown', n: null, fill: 0 };
      const n = next;
      if (n === 0) return { state: 'today', n, fill: 1 };
      // no earlier pickup in the calendar: estimate the fill from interval
      if (last === undefined) return { state: n === 1 ? 'eve' : '', n, fill: Math.max(0, 1 - n / Math.max(1, Number(c.interval) || 7)) };
      if (last === 0) return { state: 'emptied', n, fill: 0 };
      return { state: n === 1 ? 'eve' : '', n, fill: Math.min(1, Math.max(0, -last / (n - last))) };
    }
    if (c.entity) {
      const d = this._entityDate();
      if (!d) return { state: 'unknown', n: null, fill: 0 };
      const n = daysBetween(now, d);
      const I = Math.max(1, Number(c.interval) || 7);
      if (n < 0) return { state: 'unknown', n: null, fill: 0 };
      if (n === 0) return h < H ? { state: 'today', n, fill: 1 } : { state: 'emptied', n, fill: 0 };
      // far-off pickup (n >= interval): empty bin but date shown, not "emptied today"
      return { state: n === 1 ? 'eve' : '', n, fill: Math.min(1, Math.max(0, 1 - n / I)) };
    }
    const extra = new Set([].concat(c.holiday_dates ?? []).map(v => { const d = parseDate(v); return d ? dayKey(d) : String(v); }));
    const hol = this._hol, work = this._work;
    return computeFixed(this._rule, now, {
      isHoliday: d => extra.has(dayKey(d)) || !!hol?.has(dayKey(d)),
      isWorkday: d => (work ? work.has(dayKey(d)) : null),
    });
  }

  /* Warning shown when the holiday mode needs a calendar that doesn't exist */
  _warning(lang) {
    const mode = this._rule?.holidays || 'none';
    if (this._c.entity || mode === 'none' || !this._hass?.entities) return '';
    const { holiday, workday } = this._calendars();
    if (!holiday && !(this._c.holiday_dates || []).length) return t(lang, 'card.warn_no_holiday_calendar');
    if (HOLIDAY_NEEDS_WORKDAY.has(mode) && !workday) return t(lang, 'card.warn_no_workday_calendar');
    return '';
  }

  _render() {
    const r = this.shadowRoot; if (!r || !this._c) return;
    const q = x => r.querySelector(x), { lang, dateLocale } = this._lang(), now = new Date();
    const { state, n, fill, moved } = this._compute();
    let pill, text;
    if (state === 'unknown') { pill = '—'; text = t(lang, 'card.unknown'); }
    else if (state === 'emptied') { pill = t(lang, 'card.emptied'); text = t(lang, 'card.emptied_txt'); }
    else if (state === 'today') { pill = t(lang, 'card.today'); text = t(lang, 'card.today_txt'); }
    else if (state === 'eve') { pill = t(lang, 'card.eve'); text = t(lang, 'card.eve_txt'); }
    else {
      const d = addDays(midnight(now), n);
      pill = t(lang, 'card.in_days', { n });
      text = n < 7 ? t(lang, 'card.next_weekday', { day: weekdayName(dateLocale, weekdayIdx(d)) })
        : t(lang, 'card.next_date', { date: shortDate(dateLocale, d) });
    }
    const cls = STATE_CLASS[state] ?? '';
    q('ha-card').className = 'card ' + cls + (fill >= 0.6 && state !== 'emptied' ? ' plein' : '') + (this._c.entity ? ' clickable' : '');
    q('.name').textContent = this._c.name || (this._bulky ? t(lang, 'card.bulky') : t(lang, `card.${this._bag ? 'bag' : 'bin'}.${this._bin}`));
    const p = q('.pill'); p.className = 'pill ' + cls; p.textContent = pill;
    q('.status').textContent = moved && state !== 'emptied' ? `${text} · ${t(lang, 'card.moved')}` : text;
    const w = this._warning(lang), we = q('.warn'); we.textContent = w; we.hidden = !w;
    q('.ml').textContent = t(lang, 'card.fill');
    const f = state === 'emptied' ? 0 : (state === 'today' ? 1 : fill), pct = Math.round(f * 100);
    q('.pct').textContent = pct + ' %'; q('.bar i').style.width = pct + '%';
    const peek = f * 72;
    if (String(this._c.image || '').trim()) return; // custom image: no animation of the drawing
    if (this._bulky) {
      // the pile grows with the fill level: a few items at first, a big heap the day before pickup
      q('.bulkyg').style.transform = `scale(${(0.72 + 0.28 * f).toFixed(3)})`;
      return;
    }
    if (this._bag) {
      // the bag inflates with the fill level: flat and crumpled when empty, round when full
      q('.bagg').style.transform = `scale(${(0.82 + 0.18 * f).toFixed(3)}, ${(0.38 + 0.62 * f).toFixed(3)})`;
      return;
    }
    q('.trash').style.transform = `translateY(${86 - peek}px)`;
    q('.lid').style.transform = f > 0.25 ? `translateY(${-peek * 0.85}px) rotate(${-f * 26}deg)` : 'none';
  }
}

customElements.define(TAG, PoubelleCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === TAG))
  window.customCards.push({ type: TAG, name: 'Appliance – Poubelle / Bin collection',
    names: { en: 'Bin collection', fr: 'Poubelle', ru: 'Вывоз мусора', de: 'Müllabfuhr', es: 'Recogida de basura', it: 'Raccolta rifiuti', nl: 'Afvalophaling', 'pt-PT': 'Recolha de lixo', 'pt-BR': 'Coleta de lixo' },
    preview: true,
    description: 'Animated bin that fills up and empties with your collection days',
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/poubelle.md' });

})();
