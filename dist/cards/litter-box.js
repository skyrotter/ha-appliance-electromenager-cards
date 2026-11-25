/* Carte « Litière automatique » — custom:appliance-litter-box-card
 * Litière connectée à tambour (PETKIT Pura Max…) : photo détourée, animations dessinées par-dessus. Tambour qui tourne dans la fenêtre pendant le nettoyage,
 * chat dans l'entrée quand la litière est occupée, voyant de l'écran (libre / nettoyage / pause / erreur), alertes (bac à déchets plein, manque de litière,
 * désodorisant N50 bientôt à changer, liquide du spray faible), tuiles (litière, bac, N50, utilisations, spray, dernier passage) et boutons d'action :
 * nettoyer, pause / reprendre, désodoriser, niveler, vider la litière, maintenance, reset N50. Vider et reset N50 demandent une confirmation.
 * Toutes les entités sont facultatives. États : idle, cleaning, paused, maintenance, emptying, leveling, deodorizing, occupied, error, unavailable.
 */
(() => {
  const TAG = 'appliance-litter-box-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "resetting": "Recalibrating",
      "btn_light": "Light",
      "f_entity_light": "Inner light (light / switch)",
      "spray_liquid": "Spray liquid",
      "spray_batt": "Spray battery",
      "f_entity_spray_battery": "Spray battery level (%)",
      "f_n50_max_days": "N50 full life (days)",
      "f_rings": "Rings chart instead of the % tiles",
      "name": "Automatic litter box",
      "idle": "Ready",
      "cleaning": "Cleaning",
      "paused": "Paused",
      "maintenance": "Maintenance",
      "emptying": "Emptying",
      "leveling": "Levelling",
      "deodorizing": "Deodorising",
      "occupied": "Occupied",
      "error": "Error",
      "unavailable": "Unavailable",
      "waste_full": "Waste bin full",
      "no_litter": "Litter missing",
      "odor_low": "Odour eliminator to replace",
      "spray_low": "Spray liquid low",
      "full": "Full",
      "ok": "OK",
      "days": "d",
      "litter": "Litter",
      "waste": "Waste bin",
      "odor": "N50 odour",
      "uses": "Uses",
      "spray": "Spray",
      "lastcat": "Last cat",
      "btn_clean": "Clean",
      "btn_pause": "Pause",
      "btn_resume": "Resume",
      "btn_deodorize": "Deodorise",
      "btn_level": "Level",
      "btn_empty": "Empty litter",
      "btn_maint": "Maintenance",
      "btn_maint_exit": "End maintenance",
      "btn_reset": "Reset N50",
      "confirm_empty": "Empty all the litter? This starts the emptying cycle.",
      "confirm_reset": "Reset the N50 odour eliminator counter?",
      "f_entity_status": "Status (sensor)",
      "f_entity_occupied": "Cat inside (binary sensor)",
      "f_entity_error": "Error (sensor)",
      "f_entity_waste_full": "Waste bin full (binary sensor)",
      "f_entity_no_litter": "Litter missing (binary sensor)",
      "f_entity_litter_level": "Litter level (%)",
      "f_entity_litter_weight": "Litter weight",
      "f_entity_odor_days": "N50 days left",
      "f_entity_times_used": "Times used",
      "f_entity_spray_liquid": "Spray liquid level (%)",
      "f_entity_last_cat": "Last cat (sensor)",
      "f_entity_last_event": "Last event (sensor)",
      "f_button_clean": "Button: clean",
      "f_button_pause": "Button: pause",
      "f_button_continue": "Button: resume",
      "f_button_deodorize": "Button: deodorise",
      "f_button_level": "Button: level the litter",
      "f_button_empty": "Button: empty the litter",
      "f_button_maintenance": "Button: start maintenance",
      "f_button_maintenance_exit": "Button: end maintenance",
      "f_button_reset_n50": "Button: reset N50",
      "f_odor_low": "Odour eliminator alert below (days)",
      "f_spray_low": "Spray alert below (%)",
      "f_confirm_dangerous": "Confirm before emptying / resetting N50",
      "f_show_buttons": "action buttons",
      "f_show_litter": "litter tile",
      "f_show_waste": "waste bin tile",
      "f_show_odor": "N50 tile",
      "f_show_uses": "uses tile",
      "f_show_spray": "spray tile",
      "f_show_lastcat": "last cat tile"
    },
    "cs": {
      "resetting": "Rekalibrace",
      "btn_light": "Světlo",
      "spray_liquid": "Kapalina ve spreji",
      "spray_batt": "Baterie spreje",
      "name": "Automatické kočičí WC",
      "idle": "Volné",
      "cleaning": "Čištění",
      "paused": "Pauza",
      "maintenance": "Údržba",
      "emptying": "Vyprazdňování",
      "leveling": "Vyrovnávání",
      "deodorizing": "Zbavování pachů",
      "occupied": "Obsazeno",
      "error": "Chyba",
      "unavailable": "Nedostupné",
      "waste_full": "Zásobník odpadu plný",
      "no_litter": "Chybí podestýlka",
      "odor_low": "Výměna odstraňovače pachů N50",
      "spray_low": "Nízká hladina kapaliny ve spreji",
      "full": "Plný",
      "ok": "OK",
      "days": "d",
      "litter": "Podestýlka",
      "waste": "Zásobník odpadu",
      "odor": "Pach N50",
      "uses": "Použití",
      "spray": "Sprej",
      "lastcat": "Poslední kočka",
      "btn_clean": "Vyčistit",
      "btn_pause": "Pauza",
      "btn_resume": "Pokračovat",
      "btn_deodorize": "Zbavit pachů",
      "btn_level": "Vyrovnat",
      "btn_empty": "Vyprázdnit podestýlku",
      "btn_maint": "Údržba",
      "btn_maint_exit": "Konec údržby",
      "btn_reset": "Reset N50",
      "confirm_empty": "Vyprázdnit veškerou podestýlku? Spustí se vyprazdňovací cyklus.",
      "confirm_reset": "Vynulovat počítadlo odstraňovače pachů N50?"
    },
    "da": {
      "resetting": "Genkalibrerer",
      "btn_light": "Lys",
      "spray_liquid": "Sprayvæske",
      "spray_batt": "Spraybatteri",
      "name": "Automatisk kattebakke",
      "idle": "Fri",
      "cleaning": "Rengøring",
      "paused": "Pause",
      "maintenance": "Vedligeholdelse",
      "emptying": "Tømning",
      "leveling": "Udjævning",
      "deodorizing": "Lugtfjernelse",
      "occupied": "Optaget",
      "error": "Fejl",
      "unavailable": "Utilgængelig",
      "waste_full": "Affaldsbeholder fuld",
      "no_litter": "Mangler strøelse",
      "odor_low": "N50-lugtfjerner skal skiftes",
      "spray_low": "Sprayvæske lav",
      "full": "Fuld",
      "ok": "OK",
      "days": "d",
      "litter": "Strøelse",
      "waste": "Affaldsbeholder",
      "odor": "N50-lugt",
      "uses": "Brug",
      "spray": "Spray",
      "lastcat": "Sidste kat",
      "btn_clean": "Rengør",
      "btn_pause": "Pause",
      "btn_resume": "Genoptag",
      "btn_deodorize": "Fjern lugt",
      "btn_level": "Udjævn",
      "btn_empty": "Tøm strøelse",
      "btn_maint": "Vedligeholdelse",
      "btn_maint_exit": "Afslut vedligeholdelse",
      "btn_reset": "Nulstil N50",
      "confirm_empty": "Tøm al strøelse? Tømningscyklussen starter.",
      "confirm_reset": "Nulstil tælleren for N50-lugtfjerneren?"
    },
    "de": {
      "resetting": "Neukalibrierung",
      "btn_light": "Licht",
      "spray_liquid": "Sprühflüssigkeit",
      "spray_batt": "Spray-Batterie",
      "name": "Automatische Katzentoilette",
      "idle": "Frei",
      "cleaning": "Reinigung",
      "paused": "Pause",
      "maintenance": "Wartung",
      "emptying": "Entleeren",
      "leveling": "Einebnen",
      "deodorizing": "Desodorieren",
      "occupied": "Besetzt",
      "error": "Fehler",
      "unavailable": "Nicht verfügbar",
      "waste_full": "Abfallbehälter voll",
      "no_litter": "Streu fehlt",
      "odor_low": "N50-Geruchsentferner wechseln",
      "spray_low": "Sprühflüssigkeit niedrig",
      "full": "Voll",
      "ok": "OK",
      "days": "T",
      "litter": "Streu",
      "waste": "Abfallbehälter",
      "odor": "N50-Geruch",
      "uses": "Nutzungen",
      "spray": "Spray",
      "lastcat": "Letzte Katze",
      "btn_clean": "Reinigen",
      "btn_pause": "Pause",
      "btn_resume": "Fortsetzen",
      "btn_deodorize": "Desodorieren",
      "btn_level": "Einebnen",
      "btn_empty": "Streu leeren",
      "btn_maint": "Wartung",
      "btn_maint_exit": "Wartung beenden",
      "btn_reset": "N50 zurücksetzen",
      "confirm_empty": "Die gesamte Streu entleeren? Der Entleerungszyklus startet.",
      "confirm_reset": "Zähler des N50-Geruchsentferners zurücksetzen?"
    },
    "es": {
      "resetting": "Recalibrando",
      "btn_light": "Luz",
      "f_entity_light": "Luz interior (light / switch)",
      "spray_liquid": "Líquido del spray",
      "spray_batt": "Batería del spray",
      "f_entity_spray_battery": "Nivel de batería del spray (%)",
      "f_n50_max_days": "Vida útil total del N50 (días)",
      "f_rings": "Gráfico de anillos en lugar de los mosaicos de %",
      "name": "Arenero automático",
      "idle": "Libre",
      "cleaning": "Limpieza",
      "paused": "Pausa",
      "maintenance": "Mantenimiento",
      "emptying": "Vaciado",
      "leveling": "Nivelado",
      "deodorizing": "Desodorización",
      "occupied": "Ocupado",
      "error": "Error",
      "unavailable": "No disponible",
      "waste_full": "Cubo de residuos lleno",
      "no_litter": "Falta arena",
      "odor_low": "Eliminador de olores N50 por cambiar",
      "spray_low": "Líquido del spray bajo",
      "full": "Lleno",
      "ok": "OK",
      "days": "d",
      "litter": "Arena",
      "waste": "Cubo de residuos",
      "odor": "N50 olores",
      "uses": "Usos",
      "spray": "Spray",
      "lastcat": "Último gato",
      "btn_clean": "Limpiar",
      "btn_pause": "Pausa",
      "btn_resume": "Reanudar",
      "btn_deodorize": "Desodorizar",
      "btn_level": "Nivelar",
      "btn_empty": "Vaciar arena",
      "btn_maint": "Mantenimiento",
      "btn_maint_exit": "Fin mantenimiento",
      "btn_reset": "Reiniciar N50",
      "confirm_empty": "¿Vaciar toda la arena? Se inicia el ciclo de vaciado.",
      "confirm_reset": "¿Reiniciar el contador del eliminador de olores N50?",
      "f_entity_status": "Estado (sensor)",
      "f_entity_occupied": "Gato dentro (sensor binario)",
      "f_entity_error": "Error (sensor)",
      "f_entity_waste_full": "Cubo de residuos lleno (sensor binario)",
      "f_entity_no_litter": "Falta arena (sensor binario)",
      "f_entity_litter_level": "Nivel de arena (%)",
      "f_entity_litter_weight": "Peso de la arena",
      "f_entity_odor_days": "Días restantes del N50",
      "f_entity_times_used": "Número de usos",
      "f_entity_spray_liquid": "Nivel de líquido del spray (%)",
      "f_entity_last_cat": "Último gato (sensor)",
      "f_entity_last_event": "Último evento (sensor)",
      "f_button_clean": "Botón: limpiar",
      "f_button_pause": "Botón: pausa",
      "f_button_continue": "Botón: reanudar",
      "f_button_deodorize": "Botón: desodorizar",
      "f_button_level": "Botón: nivelar la arena",
      "f_button_empty": "Botón: vaciar la arena",
      "f_button_maintenance": "Botón: iniciar el mantenimiento",
      "f_button_maintenance_exit": "Botón: terminar el mantenimiento",
      "f_button_reset_n50": "Botón: reiniciar N50",
      "f_odor_low": "Alerta del eliminador de olores por debajo de (días)",
      "f_spray_low": "Alerta del spray por debajo de (%)",
      "f_confirm_dangerous": "Confirmar antes de vaciar / reiniciar N50",
      "f_show_buttons": "botones de acción",
      "f_show_litter": "mosaico arena",
      "f_show_waste": "mosaico cubo de residuos",
      "f_show_odor": "mosaico N50",
      "f_show_uses": "mosaico usos",
      "f_show_spray": "mosaico spray",
      "f_show_lastcat": "mosaico último gato"
    },
    "fr": {
      "resetting": "Recalibrage",
      "btn_light": "Lumière",
      "f_entity_light": "Lumière intégrée (light / switch)",
      "spray_liquid": "Liquide désodorisant",
      "spray_batt": "Batt. désodorisant",
      "f_entity_spray_battery": "Batterie du spray (%)",
      "f_n50_max_days": "Durée de vie du N50 (jours)",
      "f_rings": "Graphique en anneaux à la place des tuiles %",
      "name": "Litière automatique",
      "idle": "Libre",
      "cleaning": "Nettoyage",
      "paused": "Pause",
      "maintenance": "Maintenance",
      "emptying": "Vidage",
      "leveling": "Nivellement",
      "deodorizing": "Désodorisation",
      "occupied": "Occupée",
      "error": "Erreur",
      "unavailable": "Indisponible",
      "waste_full": "Bac à déchets plein",
      "no_litter": "Manque de litière",
      "odor_low": "Désodorisant N50 à changer",
      "spray_low": "Liquide du spray faible",
      "full": "Plein",
      "ok": "OK",
      "days": "j",
      "litter": "Litière",
      "waste": "Bac à déchets",
      "odor": "Galet N50",
      "uses": "Utilisations",
      "spray": "Spray",
      "lastcat": "Dernier passage",
      "btn_clean": "Nettoyer",
      "btn_pause": "Pause",
      "btn_resume": "Reprendre",
      "btn_deodorize": "Désodoriser",
      "btn_level": "Aplanir",
      "btn_empty": "Vider la litière",
      "btn_maint": "Maintenance",
      "btn_maint_exit": "Fin maintenance",
      "btn_reset": "Reset N50",
      "confirm_empty": "Vider toute la litière ? Cela lance le cycle de vidage.",
      "confirm_reset": "Réinitialiser le compteur du désodorisant N50 ?",
      "f_entity_status": "État (capteur)",
      "f_entity_occupied": "Chat à l'intérieur (capteur binaire)",
      "f_entity_error": "Erreur (capteur)",
      "f_entity_waste_full": "Bac à déchets plein (capteur binaire)",
      "f_entity_no_litter": "Manque de litière (capteur binaire)",
      "f_entity_litter_level": "Niveau de litière (%)",
      "f_entity_litter_weight": "Poids de la litière",
      "f_entity_odor_days": "Jours restants N50",
      "f_entity_times_used": "Nombre d'utilisations",
      "f_entity_spray_liquid": "Niveau du liquide du spray (%)",
      "f_entity_last_cat": "Dernier chat (capteur)",
      "f_entity_last_event": "Dernier événement (capteur)",
      "f_button_clean": "Bouton : nettoyer",
      "f_button_pause": "Bouton : pause",
      "f_button_continue": "Bouton : reprendre",
      "f_button_deodorize": "Bouton : désodoriser",
      "f_button_level": "Bouton : aplanir la litière",
      "f_button_empty": "Bouton : vider la litière",
      "f_button_maintenance": "Bouton : début de maintenance",
      "f_button_maintenance_exit": "Bouton : fin de maintenance",
      "f_button_reset_n50": "Bouton : reset N50",
      "f_odor_low": "Alerte désodorisant sous (jours)",
      "f_spray_low": "Alerte spray sous (%)",
      "f_confirm_dangerous": "Confirmer avant de vider / reset N50",
      "f_show_buttons": "boutons d'action",
      "f_show_litter": "tuile litière",
      "f_show_waste": "tuile bac à déchets",
      "f_show_odor": "tuile N50",
      "f_show_uses": "tuile utilisations",
      "f_show_spray": "tuile spray",
      "f_show_lastcat": "tuile dernier passage"
    },
    "hu": {
      "resetting": "Újrakalibrálás",
      "btn_light": "Fény",
      "spray_liquid": "Spray folyadék",
      "spray_batt": "Spray akkumulátor",
      "name": "Automata macskaalom",
      "idle": "Szabad",
      "cleaning": "Tisztítás",
      "paused": "Szünet",
      "maintenance": "Karbantartás",
      "emptying": "Ürítés",
      "leveling": "Egyengetés",
      "deodorizing": "Szagtalanítás",
      "occupied": "Foglalt",
      "error": "Hiba",
      "unavailable": "Nem elérhető",
      "waste_full": "Hulladéktartály tele",
      "no_litter": "Hiányzó alom",
      "odor_low": "N50 szagsemlegesítő cserélendő",
      "spray_low": "Alacsony spray folyadékszint",
      "full": "Tele",
      "ok": "OK",
      "days": "n",
      "litter": "Alom",
      "waste": "Hulladéktartály",
      "odor": "N50 szag",
      "uses": "Használat",
      "spray": "Spray",
      "lastcat": "Utolsó macska",
      "btn_clean": "Tisztítás",
      "btn_pause": "Szünet",
      "btn_resume": "Folytatás",
      "btn_deodorize": "Szagtalanítás",
      "btn_level": "Egyengetés",
      "btn_empty": "Alom ürítése",
      "btn_maint": "Karbantartás",
      "btn_maint_exit": "Karbantartás vége",
      "btn_reset": "N50 nullázása",
      "confirm_empty": "Kiüríti az összes almot? Elindul az ürítési ciklus.",
      "confirm_reset": "Nullázza az N50 szagsemlegesítő számlálóját?"
    },
    "it": {
      "resetting": "Ricalibrazione",
      "btn_light": "Luce",
      "spray_liquid": "Liquido spray",
      "spray_batt": "Batteria spray",
      "name": "Lettiera automatica",
      "idle": "Libera",
      "cleaning": "Pulizia",
      "paused": "Pausa",
      "maintenance": "Manutenzione",
      "emptying": "Svuotamento",
      "leveling": "Livellamento",
      "deodorizing": "Deodorazione",
      "occupied": "Occupata",
      "error": "Errore",
      "unavailable": "Non disponibile",
      "waste_full": "Contenitore rifiuti pieno",
      "no_litter": "Lettiera mancante",
      "odor_low": "Eliminatore di odori N50 da cambiare",
      "spray_low": "Liquido spray basso",
      "full": "Pieno",
      "ok": "OK",
      "days": "g",
      "litter": "Lettiera",
      "waste": "Contenitore rifiuti",
      "odor": "N50 odori",
      "uses": "Utilizzi",
      "spray": "Spray",
      "lastcat": "Ultimo gatto",
      "btn_clean": "Pulisci",
      "btn_pause": "Pausa",
      "btn_resume": "Riprendi",
      "btn_deodorize": "Deodora",
      "btn_level": "Livella",
      "btn_empty": "Svuota lettiera",
      "btn_maint": "Manutenzione",
      "btn_maint_exit": "Fine manutenzione",
      "btn_reset": "Reset N50",
      "confirm_empty": "Svuotare tutta la lettiera? Parte il ciclo di svuotamento.",
      "confirm_reset": "Azzerare il contatore dell'eliminatore di odori N50?"
    },
    "nb": {
      "resetting": "Rekalibrerer",
      "btn_light": "Lys",
      "spray_liquid": "Sprayvæske",
      "spray_batt": "Spraybatteri",
      "name": "Automatisk kattedo",
      "idle": "Ledig",
      "cleaning": "Rengjøring",
      "paused": "Pause",
      "maintenance": "Vedlikehold",
      "emptying": "Tømming",
      "leveling": "Utjevning",
      "deodorizing": "Luktfjerning",
      "occupied": "Opptatt",
      "error": "Feil",
      "unavailable": "Utilgjengelig",
      "waste_full": "Avfallsbeholder full",
      "no_litter": "Mangler strø",
      "odor_low": "N50-luktfjerner må byttes",
      "spray_low": "Sprayvæske lav",
      "full": "Full",
      "ok": "OK",
      "days": "d",
      "litter": "Strø",
      "waste": "Avfallsbeholder",
      "odor": "N50-lukt",
      "uses": "Bruk",
      "spray": "Spray",
      "lastcat": "Siste katt",
      "btn_clean": "Rengjør",
      "btn_pause": "Pause",
      "btn_resume": "Fortsett",
      "btn_deodorize": "Fjern lukt",
      "btn_level": "Jevn ut",
      "btn_empty": "Tøm strø",
      "btn_maint": "Vedlikehold",
      "btn_maint_exit": "Avslutt vedlikehold",
      "btn_reset": "Nullstill N50",
      "confirm_empty": "Tømme alt strø? Tømmesyklusen starter.",
      "confirm_reset": "Nullstille telleren for N50-luktfjerneren?"
    },
    "nl": {
      "resetting": "Herkalibreren",
      "btn_light": "Licht",
      "spray_liquid": "Sprayvloeistof",
      "spray_batt": "Spraybatterij",
      "name": "Automatische kattenbak",
      "idle": "Vrij",
      "cleaning": "Reiniging",
      "paused": "Pauze",
      "maintenance": "Onderhoud",
      "emptying": "Legen",
      "leveling": "Egaliseren",
      "deodorizing": "Geurverwijdering",
      "occupied": "Bezet",
      "error": "Fout",
      "unavailable": "Niet beschikbaar",
      "waste_full": "Afvalbak vol",
      "no_litter": "Grit ontbreekt",
      "odor_low": "N50-geurverwijderaar vervangen",
      "spray_low": "Sprayvloeistof laag",
      "full": "Vol",
      "ok": "OK",
      "days": "d",
      "litter": "Grit",
      "waste": "Afvalbak",
      "odor": "N50-geur",
      "uses": "Gebruiken",
      "spray": "Spray",
      "lastcat": "Laatste kat",
      "btn_clean": "Reinigen",
      "btn_pause": "Pauze",
      "btn_resume": "Hervatten",
      "btn_deodorize": "Geur verwijderen",
      "btn_level": "Egaliseren",
      "btn_empty": "Grit legen",
      "btn_maint": "Onderhoud",
      "btn_maint_exit": "Einde onderhoud",
      "btn_reset": "N50 resetten",
      "confirm_empty": "Alle grit legen? De legencyclus start.",
      "confirm_reset": "Teller van de N50-geurverwijderaar resetten?"
    },
    "pl": {
      "resetting": "Rekalibracja",
      "btn_light": "Światło",
      "spray_liquid": "Płyn w sprayu",
      "spray_batt": "Bateria sprayu",
      "name": "Automatyczna kuweta",
      "idle": "Wolna",
      "cleaning": "Czyszczenie",
      "paused": "Pauza",
      "maintenance": "Konserwacja",
      "emptying": "Opróżnianie",
      "leveling": "Wyrównywanie",
      "deodorizing": "Neutralizacja zapachów",
      "occupied": "Zajęta",
      "error": "Błąd",
      "unavailable": "Niedostępne",
      "waste_full": "Pojemnik na odpady pełny",
      "no_litter": "Brak żwirku",
      "odor_low": "Wymiana neutralizatora zapachów N50",
      "spray_low": "Niski poziom płynu w sprayu",
      "full": "Pełny",
      "ok": "OK",
      "days": "d",
      "litter": "Żwirek",
      "waste": "Pojemnik na odpady",
      "odor": "Zapach N50",
      "uses": "Użycia",
      "spray": "Spray",
      "lastcat": "Ostatni kot",
      "btn_clean": "Czyść",
      "btn_pause": "Pauza",
      "btn_resume": "Wznów",
      "btn_deodorize": "Odświeżaj",
      "btn_level": "Wyrównaj",
      "btn_empty": "Opróżnij żwirek",
      "btn_maint": "Konserwacja",
      "btn_maint_exit": "Koniec konserwacji",
      "btn_reset": "Zeruj N50",
      "confirm_empty": "Opróżnić cały żwirek? Rozpocznie się cykl opróżniania.",
      "confirm_reset": "Wyzerować licznik neutralizatora zapachów N50?"
    },
    "pt-BR": {
      "resetting": "Recalibrando",
      "btn_light": "Luz",
      "f_entity_light": "Luz interior (light / switch)",
      "spray_liquid": "Líquido do spray",
      "spray_batt": "Bateria do spray",
      "f_entity_spray_battery": "Nível da bateria do spray (%)",
      "f_n50_max_days": "Vida útil total do N50 (dias)",
      "f_rings": "Gráfico de anéis em vez dos blocos de %",
      "name": "Caixa de areia automática",
      "idle": "Livre",
      "cleaning": "Limpeza",
      "paused": "Pausa",
      "maintenance": "Manutenção",
      "emptying": "Esvaziamento",
      "leveling": "Nivelamento",
      "deodorizing": "Desodorização",
      "occupied": "Ocupada",
      "error": "Erro",
      "unavailable": "Indisponível",
      "waste_full": "Compartimento de resíduos cheio",
      "no_litter": "Falta areia",
      "odor_low": "Eliminador de odores N50 a trocar",
      "spray_low": "Líquido do spray baixo",
      "full": "Cheio",
      "ok": "OK",
      "days": "d",
      "litter": "Areia",
      "waste": "Compartimento de resíduos",
      "odor": "N50 odores",
      "uses": "Usos",
      "spray": "Spray",
      "lastcat": "Último gato",
      "btn_clean": "Limpar",
      "btn_pause": "Pausar",
      "btn_resume": "Retomar",
      "btn_deodorize": "Desodorizar",
      "btn_level": "Nivelar",
      "btn_empty": "Esvaziar areia",
      "btn_maint": "Manutenção",
      "btn_maint_exit": "Fim da manutenção",
      "btn_reset": "Reiniciar N50",
      "confirm_empty": "Esvaziar toda a areia? O ciclo de esvaziamento será iniciado.",
      "confirm_reset": "Reiniciar o contador do eliminador de odores N50?",
      "f_entity_status": "Estado (sensor)",
      "f_entity_occupied": "Gato no interior (sensor binário)",
      "f_entity_error": "Erro (sensor)",
      "f_entity_waste_full": "Compartimento de resíduos cheio (sensor binário)",
      "f_entity_no_litter": "Falta areia (sensor binário)",
      "f_entity_litter_level": "Nível da areia (%)",
      "f_entity_litter_weight": "Peso da areia",
      "f_entity_odor_days": "Dias restantes do N50",
      "f_entity_times_used": "Número de usos",
      "f_entity_spray_liquid": "Nível do líquido do spray (%)",
      "f_entity_last_cat": "Último gato (sensor)",
      "f_entity_last_event": "Último evento (sensor)",
      "f_button_clean": "Botão: limpar",
      "f_button_pause": "Botão: pausar",
      "f_button_continue": "Botão: retomar",
      "f_button_deodorize": "Botão: desodorizar",
      "f_button_level": "Botão: nivelar a areia",
      "f_button_empty": "Botão: esvaziar a areia",
      "f_button_maintenance": "Botão: iniciar a manutenção",
      "f_button_maintenance_exit": "Botão: terminar a manutenção",
      "f_button_reset_n50": "Botão: reiniciar N50",
      "f_odor_low": "Alerta do eliminador de odores abaixo de (dias)",
      "f_spray_low": "Alerta do spray abaixo de (%)",
      "f_confirm_dangerous": "Confirmar antes de esvaziar / reiniciar N50",
      "f_show_buttons": "botões de ação",
      "f_show_litter": "bloco areia",
      "f_show_waste": "bloco compartimento de resíduos",
      "f_show_odor": "bloco N50",
      "f_show_uses": "bloco usos",
      "f_show_spray": "bloco spray",
      "f_show_lastcat": "bloco último gato"
    },
    "pt-PT": {
      "resetting": "A recalibrar",
      "btn_light": "Luz",
      "f_entity_light": "Luz interior (light / switch)",
      "spray_liquid": "Líquido do spray",
      "spray_batt": "Bateria do spray",
      "f_entity_spray_battery": "Nível da bateria do spray (%)",
      "f_n50_max_days": "Vida útil total do N50 (dias)",
      "f_rings": "Gráfico de anéis em vez dos blocos de %",
      "name": "Caixa de areia automática",
      "idle": "Livre",
      "cleaning": "Limpeza",
      "paused": "Pausa",
      "maintenance": "Manutenção",
      "emptying": "Esvaziamento",
      "leveling": "Nivelamento",
      "deodorizing": "Desodorização",
      "occupied": "Ocupada",
      "error": "Erro",
      "unavailable": "Indisponível",
      "waste_full": "Compartimento de resíduos cheio",
      "no_litter": "Falta areia",
      "odor_low": "Eliminador de odores N50 a substituir",
      "spray_low": "Líquido do spray baixo",
      "full": "Cheio",
      "ok": "OK",
      "days": "d",
      "litter": "Areia",
      "waste": "Compartimento de resíduos",
      "odor": "N50 odores",
      "uses": "Utilizações",
      "spray": "Spray",
      "lastcat": "Último gato",
      "btn_clean": "Limpar",
      "btn_pause": "Pausa",
      "btn_resume": "Retomar",
      "btn_deodorize": "Desodorizar",
      "btn_level": "Nivelar",
      "btn_empty": "Esvaziar areia",
      "btn_maint": "Manutenção",
      "btn_maint_exit": "Fim da manutenção",
      "btn_reset": "Repor N50",
      "confirm_empty": "Esvaziar toda a areia? O ciclo de esvaziamento vai arrancar.",
      "confirm_reset": "Repor o contador do eliminador de odores N50?",
      "f_entity_status": "Estado (sensor)",
      "f_entity_occupied": "Gato no interior (sensor binário)",
      "f_entity_error": "Erro (sensor)",
      "f_entity_waste_full": "Compartimento de resíduos cheio (sensor binário)",
      "f_entity_no_litter": "Falta areia (sensor binário)",
      "f_entity_litter_level": "Nível da areia (%)",
      "f_entity_litter_weight": "Peso da areia",
      "f_entity_odor_days": "Dias restantes do N50",
      "f_entity_times_used": "Número de utilizações",
      "f_entity_spray_liquid": "Nível do líquido do spray (%)",
      "f_entity_last_cat": "Último gato (sensor)",
      "f_entity_last_event": "Último evento (sensor)",
      "f_button_clean": "Botão: limpar",
      "f_button_pause": "Botão: pausa",
      "f_button_continue": "Botão: retomar",
      "f_button_deodorize": "Botão: desodorizar",
      "f_button_level": "Botão: nivelar a areia",
      "f_button_empty": "Botão: esvaziar a areia",
      "f_button_maintenance": "Botão: iniciar a manutenção",
      "f_button_maintenance_exit": "Botão: terminar a manutenção",
      "f_button_reset_n50": "Botão: repor N50",
      "f_odor_low": "Alerta do eliminador de odores abaixo de (dias)",
      "f_spray_low": "Alerta do spray abaixo de (%)",
      "f_confirm_dangerous": "Confirmar antes de esvaziar / repor N50",
      "f_show_buttons": "botões de ação",
      "f_show_litter": "bloco areia",
      "f_show_waste": "bloco compartimento de resíduos",
      "f_show_odor": "bloco N50",
      "f_show_uses": "bloco utilizações",
      "f_show_spray": "bloco spray",
      "f_show_lastcat": "bloco último gato"
    },
    "ro": {
      "resetting": "Recalibrare",
      "btn_light": "Lumină",
      "spray_liquid": "Lichid spray",
      "spray_batt": "Baterie spray",
      "name": "Litieră automată",
      "idle": "Liberă",
      "cleaning": "Curățare",
      "paused": "Pauză",
      "maintenance": "Mentenanță",
      "emptying": "Golire",
      "leveling": "Nivelare",
      "deodorizing": "Dezodorizare",
      "occupied": "Ocupată",
      "error": "Eroare",
      "unavailable": "Indisponibil",
      "waste_full": "Recipient deșeuri plin",
      "no_litter": "Lipsă așternut",
      "odor_low": "Eliminator de mirosuri N50 de schimbat",
      "spray_low": "Lichid spray scăzut",
      "full": "Plin",
      "ok": "OK",
      "days": "z",
      "litter": "Așternut",
      "waste": "Recipient deșeuri",
      "odor": "Miros N50",
      "uses": "Utilizări",
      "spray": "Spray",
      "lastcat": "Ultima pisică",
      "btn_clean": "Curăță",
      "btn_pause": "Pauză",
      "btn_resume": "Reia",
      "btn_deodorize": "Dezodorizează",
      "btn_level": "Nivelează",
      "btn_empty": "Golește așternutul",
      "btn_maint": "Mentenanță",
      "btn_maint_exit": "Sfârșit mentenanță",
      "btn_reset": "Resetare N50",
      "confirm_empty": "Goliți tot așternutul? Pornește ciclul de golire.",
      "confirm_reset": "Resetați contorul eliminatorului de mirosuri N50?"
    },
    "ru": {
      "resetting": "Калибровка",
      "btn_light": "Свет",
      "spray_liquid": "Жидкость спрея",
      "spray_batt": "Батарея спрея",
      "name": "Автоматический лоток",
      "idle": "Свободен",
      "cleaning": "Очистка",
      "paused": "Пауза",
      "maintenance": "Обслуживание",
      "emptying": "Опустошение",
      "leveling": "Выравнивание",
      "deodorizing": "Дезодорация",
      "occupied": "Занят",
      "error": "Ошибка",
      "unavailable": "Недоступно",
      "waste_full": "Контейнер для отходов полон",
      "no_litter": "Нет наполнителя",
      "odor_low": "Замена нейтрализатора запаха N50",
      "spray_low": "Мало жидкости в спрее",
      "full": "Полон",
      "ok": "ОК",
      "days": "д",
      "litter": "Наполнитель",
      "waste": "Контейнер для отходов",
      "odor": "Запах N50",
      "uses": "Использований",
      "spray": "Спрей",
      "lastcat": "Последний кот",
      "btn_clean": "Очистить",
      "btn_pause": "Пауза",
      "btn_resume": "Продолжить",
      "btn_deodorize": "Дезодорировать",
      "btn_level": "Выровнять",
      "btn_empty": "Опустошить наполнитель",
      "btn_maint": "Обслуживание",
      "btn_maint_exit": "Завершить обслуживание",
      "btn_reset": "Сброс N50",
      "confirm_empty": "Опустошить весь наполнитель? Начнётся цикл опустошения.",
      "confirm_reset": "Сбросить счётчик нейтрализатора запаха N50?"
    },
    "sr": {
      "resetting": "Рекалибрација",
      "btn_light": "Светло",
      "spray_liquid": "Течност спреја",
      "spray_batt": "Батерија спреја",
      "name": "Аутоматски тоалет за мачке",
      "idle": "Слободан",
      "cleaning": "Чишћење",
      "paused": "Пауза",
      "maintenance": "Одржавање",
      "emptying": "Пражњење",
      "leveling": "Равнање",
      "deodorizing": "Дезодорисање",
      "occupied": "Заузет",
      "error": "Грешка",
      "unavailable": "Недоступно",
      "waste_full": "Посуда за отпад пуна",
      "no_litter": "Нема постељине",
      "odor_low": "Заменити N50 неутрализатор мириса",
      "spray_low": "Мало течности у спреју",
      "full": "Пун",
      "ok": "У реду",
      "days": "д",
      "litter": "Постељина",
      "waste": "Посуда за отпад",
      "odor": "N50 мирис",
      "uses": "Употреба",
      "spray": "Спреј",
      "lastcat": "Последња мачка",
      "btn_clean": "Очисти",
      "btn_pause": "Пауза",
      "btn_resume": "Настави",
      "btn_deodorize": "Дезодориши",
      "btn_level": "Поравнај",
      "btn_empty": "Испразни постељину",
      "btn_maint": "Одржавање",
      "btn_maint_exit": "Крај одржавања",
      "btn_reset": "Ресетуј N50",
      "confirm_empty": "Испразнити сву постељину? Почиње циклус пражњења.",
      "confirm_reset": "Ресетовати бројач N50 неутрализатора мириса?"
    },
    "sr-Latn": {
      "resetting": "Rekalibracija",
      "btn_light": "Svetlo",
      "spray_liquid": "Tečnost spreja",
      "spray_batt": "Baterija spreja",
      "name": "Automatski toalet za mačke",
      "idle": "Slobodan",
      "cleaning": "Čišćenje",
      "paused": "Pauza",
      "maintenance": "Održavanje",
      "emptying": "Pražnjenje",
      "leveling": "Ravnanje",
      "deodorizing": "Dezodorisanje",
      "occupied": "Zauzet",
      "error": "Greška",
      "unavailable": "Nedostupno",
      "waste_full": "Posuda za otpad puna",
      "no_litter": "Nema posteljine",
      "odor_low": "Zameniti N50 neutralizator mirisa",
      "spray_low": "Malo tečnosti u spreju",
      "full": "Pun",
      "ok": "U redu",
      "days": "d",
      "litter": "Posteljina",
      "waste": "Posuda za otpad",
      "odor": "N50 miris",
      "uses": "Upotreba",
      "spray": "Sprej",
      "lastcat": "Poslednja mačka",
      "btn_clean": "Očisti",
      "btn_pause": "Pauza",
      "btn_resume": "Nastavi",
      "btn_deodorize": "Dezodoriši",
      "btn_level": "Poravnaj",
      "btn_empty": "Isprazni posteljinu",
      "btn_maint": "Održavanje",
      "btn_maint_exit": "Kraj održavanja",
      "btn_reset": "Resetuj N50",
      "confirm_empty": "Isprazniti svu posteljinu? Počinje ciklus pražnjenja.",
      "confirm_reset": "Resetovati brojač N50 neutralizatora mirisa?"
    },
    "uk": {
      "resetting": "Калібрування",
      "btn_light": "Світло",
      "f_entity_light": "Внутрішнє світло (light / switch)",
      "spray_liquid": "Рідина спрея",
      "spray_batt": "Батарея спрея",
      "f_entity_spray_battery": "Рівень батареї спрея (%)",
      "f_n50_max_days": "Повний термін служби N50 (дні)",
      "f_rings": "Кільцева діаграма замість плиток з %",
      "name": "Автоматичний лоток",
      "idle": "Вільний",
      "cleaning": "Очищення",
      "paused": "Пауза",
      "maintenance": "Обслуговування",
      "emptying": "Спорожнення",
      "leveling": "Вирівнювання",
      "deodorizing": "Дезодорація",
      "occupied": "Зайнятий",
      "error": "Помилка",
      "unavailable": "Недоступно",
      "waste_full": "Контейнер для відходів повний",
      "no_litter": "Немає наповнювача",
      "odor_low": "Заміна нейтралізатора запаху N50",
      "spray_low": "Мало рідини в спреї",
      "full": "Повний",
      "ok": "ОК",
      "days": "д",
      "litter": "Наповнювач",
      "waste": "Контейнер для відходів",
      "odor": "Запах N50",
      "uses": "Використань",
      "spray": "Спрей",
      "lastcat": "Останній кіт",
      "btn_clean": "Очистити",
      "btn_pause": "Пауза",
      "btn_resume": "Продовжити",
      "btn_deodorize": "Дезодорувати",
      "btn_level": "Вирівняти",
      "btn_empty": "Спорожнити наповнювач",
      "btn_maint": "Обслуговування",
      "btn_maint_exit": "Завершити обслуговування",
      "btn_reset": "Скидання N50",
      "confirm_empty": "Спорожнити весь наповнювач? Почнеться цикл спорожнення.",
      "confirm_reset": "Скинути лічильник нейтралізатора запаху N50?",
      "f_entity_status": "Стан (датчик)",
      "f_entity_occupied": "Кіт усередині (бінарний датчик)",
      "f_entity_error": "Помилка (датчик)",
      "f_entity_waste_full": "Контейнер для відходів повний (бінарний датчик)",
      "f_entity_no_litter": "Немає наповнювача (бінарний датчик)",
      "f_entity_litter_level": "Рівень наповнювача (%)",
      "f_entity_litter_weight": "Вага наповнювача",
      "f_entity_odor_days": "Залишилось днів N50",
      "f_entity_times_used": "Кількість використань",
      "f_entity_spray_liquid": "Рівень рідини спрея (%)",
      "f_entity_last_cat": "Останній кіт (датчик)",
      "f_entity_last_event": "Остання подія (датчик)",
      "f_button_clean": "Кнопка: очистити",
      "f_button_pause": "Кнопка: пауза",
      "f_button_continue": "Кнопка: продовжити",
      "f_button_deodorize": "Кнопка: дезодорувати",
      "f_button_level": "Кнопка: вирівняти наповнювач",
      "f_button_empty": "Кнопка: спорожнити наповнювач",
      "f_button_maintenance": "Кнопка: почати обслуговування",
      "f_button_maintenance_exit": "Кнопка: завершити обслуговування",
      "f_button_reset_n50": "Кнопка: скинути N50",
      "f_odor_low": "Сповіщення нейтралізатора запаху нижче (днів)",
      "f_spray_low": "Сповіщення спрея нижче (%)",
      "f_confirm_dangerous": "Підтверджувати перед спорожненням / скиданням N50",
      "f_show_buttons": "кнопки дій",
      "f_show_litter": "плитка наповнювача",
      "f_show_waste": "плитка контейнера для відходів",
      "f_show_odor": "плитка N50",
      "f_show_uses": "плитка використань",
      "f_show_spray": "плитка спрея",
      "f_show_lastcat": "плитка останнього кота"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée (700 × 603, WebP transparent) ; le repère du dessin est celui de la photo d'origine (870 × 749)
  const IMG = 'data:image/webp;base64,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';
  const W = 870, H = 749;
  // fenêtre d'entrée (zone sombre) et tambour (hublot rond sur le côté gauche)
  const WIN = '364,135 540,134 572,172 600,252 608,350 599,430 577,461 545,478 390,478 371,461 357,430 350,350 344,250 344,172';
  const BTN = { unavailable: /^(unavailable|unknown)$/i };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --lb-ok:var(--appliance-ok-color,#2fd27a);--lb-warn:var(--appliance-warn-color,#ffb300);--lb-alert:var(--appliance-alert-color,#ff4d3d);--lb-act:#4db2ff}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge{background:color-mix(in srgb,var(--lb-ok) 22%,transparent);color:var(--lb-ok)}
.cleaning .badge,.resetting .badge,.emptying .badge,.leveling .badge,.deodorizing .badge,.maintenance .badge{background:color-mix(in srgb,var(--lb-act) 24%,transparent);color:var(--lb-act)}
.paused .badge,.occupied .badge{background:color-mix(in srgb,var(--lb-warn) 26%,transparent);color:var(--lb-warn)}
.error .badge{background:color-mix(in srgb,var(--lb-alert) 22%,transparent);color:var(--lb-alert)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:auto;margin:2px auto 0;overflow:visible;cursor:pointer}
.alerts{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:4px}
.alerts span{font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;background:color-mix(in srgb,var(--lb-warn) 24%,transparent);color:var(--lb-warn)}
.alerts span.bad{background:color-mix(in srgb,var(--lb-alert) 22%,transparent);color:var(--lb-alert)}
.alerts:empty{display:none}
.rings{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:6px;padding:8px 10px;border-radius:12px;background:var(--ac-tile-bg,rgba(127,127,127,.09))}
.rings.hide{display:none}.rings svg.donut{width:104px;max-width:34%;height:auto;margin:0;flex:none;cursor:default;overflow:visible}
.rings .trk{fill:none;stroke:var(--primary-text-color);stroke-opacity:.14;stroke-width:7}.rings .arc{fill:none;stroke-width:7;stroke-linecap:round;transition:stroke-dasharray .9s ease}
.rings .lg{display:grid;gap:5px;min-width:0;flex:1 1 auto}.rings .lg>div{display:flex;align-items:center;gap:6px;font-size:12px;line-height:16px;color:var(--secondary-text-color);min-width:0;cursor:pointer}
.rings .lg i{width:9px;height:9px;border-radius:50%;flex:none}.rings .lg span{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rings .lg b{color:var(--primary-text-color);font-weight:600;white-space:nowrap}.rings .lg b.warn{color:var(--lb-warn)}.rings .lg b.bad{color:var(--lb-alert)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--lb-warn)}.tile.bad .v{color:var(--lb-alert)}
.btns{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-top:8px}
.btns.hide{display:none}
.btns button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:7px 4px;border:0;border-radius:12px;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.15));font:500 11px/14px var(--paper-font-body1_-_font-family,Roboto,sans-serif);transition:transform .15s,background .3s;--mdc-icon-size:22px}
.btns button:hover{transform:translateY(-1px)}.btns button:active{transform:scale(.95)}
.btns button.danger ha-icon{color:var(--lb-alert)}.btns button.hide{display:none}.btns button:disabled{opacity:.4;cursor:default}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
/* ---- animations de l'illustration ---- */
.drum,.cat,.pausemark,.wrench,.eye{opacity:0;transition:opacity .4s}
.cleaning .drum,.emptying .drum,.leveling .drum,.deodorizing .drum{opacity:1}
.occupied .cat{opacity:1}.paused .pausemark{opacity:1}.maintenance .wrench{opacity:1}
.ring{fill:none;stroke:#9fd6ff;stroke-width:6;stroke-linecap:round;opacity:.8;transform-origin:476px 306px}
.cleaning .ring,.emptying .ring,.leveling .ring{animation:lbspin 2.6s linear infinite}
.cleaning .ring.r2,.emptying .ring.r2,.leveling .ring.r2{animation-duration:4s;animation-direction:reverse}
.hatch{fill:none;stroke:#8aa2b3;stroke-width:6;stroke-linecap:round;stroke-dasharray:16 22;opacity:0;transition:opacity .4s}
.cleaning .hatch,.emptying .hatch,.leveling .hatch,.maintenance .hatch,.resetting .hatch{opacity:.9;animation:lbdash 1.4s linear infinite}
.maintenance .hatch,.resetting .hatch{animation-duration:3s}
.resetting .led{animation:lbblink 1.4s ease-in-out infinite}
.grain{fill:#cdb48c;opacity:0}
.cleaning .grain,.leveling .grain{animation:lbfall 1.6s ease-in infinite}
.cleaning .grain:nth-of-type(2n){animation-delay:.5s}.cleaning .grain:nth-of-type(3n){animation-delay:1s}
.spray{fill:none;stroke:#9be3c0;stroke-width:4;stroke-linecap:round;opacity:0}
.deodorizing .spray{animation:lbspray 1.4s ease-out infinite}
.lamp{opacity:0;transition:opacity .5s;mix-blend-mode:screen}.lit .lamp{opacity:1}
.btns button.on{background:color-mix(in srgb,var(--lb-warn) 30%,var(--secondary-background-color));color:var(--primary-text-color)}.btns button.on ha-icon{color:var(--lb-warn)}
.led{transition:fill .4s}.error .led{animation:lbblink 1s ease-in-out infinite}
.eye{fill:#ffe27a}.occupied .eye{opacity:1;animation:lbblinkeye 4s ease-in-out infinite}
.noanim *{animation:none!important;transition:none!important}
@keyframes lbspin{to{transform:rotate(360deg)}}
@keyframes lbdash{to{stroke-dashoffset:-76}}
@keyframes lbfall{0%{opacity:0;transform:translateY(-30px)}15%{opacity:.9}100%{opacity:0;transform:translateY(120px)}}
@keyframes lbspray{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(1.5)}}
@keyframes lbblink{50%{opacity:.35}}
@keyframes lbblinkeye{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
`;

  const ENT = {
    status: 'entity_status', occupied: 'entity_occupied', error: 'entity_error', waste: 'entity_waste_full', nolitter: 'entity_no_litter',
    level: 'entity_litter_level', spraybatt: 'entity_spray_battery', weight: 'entity_litter_weight', odor: 'entity_odor_days', uses: 'entity_times_used', spray: 'entity_spray_liquid', cat: 'entity_last_cat', event: 'entity_last_event',
  };
  const TILES = [['litter', 'mdi:cat', 'level'], ['waste', 'mdi:delete-variant', 'waste'], ['odor', 'mdi:air-filter', 'odor'], ['uses', 'mdi:counter', 'uses'], ['spray', 'mdi:spray-bottle', 'spray'], ['lastcat', 'mdi:paw', 'cat']];
  // boutons d'action : [clé, icône, option de l'entité, dangereux]
  const BUTTONS = [['clean', 'mdi:broom', 'button_clean', false], ['pause', 'mdi:pause-circle-outline', 'button_pause', false], ['resume', 'mdi:play-circle-outline', 'button_continue', false],
    ['deodorize', 'mdi:spray', 'button_deodorize', false], ['level', 'mdi:equal-box', 'button_level', false], ['empty', 'mdi:delete-sweep', 'button_empty', true],
    ['light', 'mdi:lightbulb-outline', 'entity_light', false], ['maint', 'mdi:wrench', 'button_maintenance', false], ['maint_exit', 'mdi:wrench-check', 'button_maintenance_exit', false], ['reset', 'mdi:restore', 'button_reset_n50', true]];

  const STATUS = [[/error|fault|err\b|erreur|problem/i, 'error'], [/reset|calibr|recalib/i, 'resetting'], [/pause/i, 'paused'], [/maint/i, 'maintenance'], [/empty|dump|vid/i, 'emptying'], [/level|nivel/i, 'leveling'],
    [/deodor|odor|d[ée]sodor/i, 'deodorizing'], [/clean|work|run|nettoy|cycle/i, 'cleaning'], [/idle|ready|libre|standby|stand-by|free|wait/i, 'idle']];

  // décor de l'illustration : tambour, chat, voyant, pause, clé
  const OVERLAY = () => `
    <defs><clipPath id="lbwin"><polygon points="${WIN}"/></clipPath><radialGradient id="lblamp" cx=".5" cy=".18" r=".85"><stop offset="0" stop-color="#fff6d6" stop-opacity=".7"/><stop offset=".55" stop-color="#ffd98a" stop-opacity=".4"/><stop offset="1" stop-color="#ffc861" stop-opacity=".18"/></radialGradient></defs>
    <g class="drum" clip-path="url(#lbwin)">
      <circle class="ring" cx="476" cy="306" r="190" stroke-dasharray="120 70"/><circle class="ring r2" cx="476" cy="306" r="130" stroke-dasharray="70 60"/>
      ${[400, 440, 480, 520, 560, 590].map((x, i) => `<circle class="grain" cx="${x}" cy="${150 + (i % 3) * 18}" r="${4 + (i % 2)}"/>`).join('')}
      <g class="spray-g">${[0, 1, 2].map((i) => `<path class="spray" d="M${430 + i * 45} 330q10-30 0-60" style="transform-origin:${450 + i * 45}px 330px;animation-delay:${i * .25}s"/>`).join('')}</g>
    </g>
    <g class="lamp" clip-path="url(#lbwin)"><rect x="340" y="125" width="272" height="360" fill="url(#lblamp)"/></g>
    <ellipse class="hatch" cx="68" cy="352" rx="38" ry="112"/>
    <g class="cat" clip-path="url(#lbwin)"><g transform="translate(476 480) scale(1.5) translate(-476 -480)">
      <path d="M478 480C430 480 418 420 434 372c10-34 74-34 84 0 16 48 4 108-40 108Z" fill="#c4ab82"/><path d="M520 450c42 0 52-52 22-68" fill="none" stroke="#c4ab82" stroke-width="13" stroke-linecap="round"/>
      <path d="M452 400q8 12 0 26M470 394q8 14 0 32M490 394q-8 14 0 32M508 400q-8 12 0 26" fill="none" stroke="#8d7550" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="478" cy="318" rx="38" ry="31" fill="#c4ab82"/><path d="M446 302l4-42 24 26ZM510 302l-4-42-24 26Z" fill="#c4ab82"/><path d="M452 296l2-22 12 13ZM504 296l-2-22-12 13Z" fill="#e0a8a0"/>
      <ellipse class="eye" cx="464" cy="316" rx="5" ry="6" style="transform-origin:464px 316px"/><ellipse class="eye" cx="492" cy="316" rx="5" ry="6" style="transform-origin:492px 316px"/>
      <path d="M478 328l-4 5h8z" fill="#e0a8a0"/>
    </g></g>
    <g class="pausemark" fill="#fff" opacity="0"><rect x="448" y="270" width="22" height="70" rx="6" opacity=".9"/><rect x="486" y="270" width="22" height="70" rx="6" opacity=".9"/></g>
    <g class="wrench"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="#fff" opacity=".9" transform="translate(382 200) scale(4.2)"/></g>
    <circle class="led" id="lbled" cx="789" cy="397" r="11" fill="#2fd27a"/>`;

  class ApplianceLitterBoxCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), f = (re, dom) => ids.find((i) => i.startsWith(dom + '.') && re.test(i)) || '';
      return { entity_status: f(/(litiere|litter|petkit|pura)[^.]*(statu|state|etat)/i, 'sensor'), entity_occupied: f(/(toilet_occupied|occup|cat_in|animal)/i, 'binary_sensor'),
        button_clean: f(/(nettoy|clean)/i, 'button') };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_buttons: true, ...Object.fromEntries(TILES.map(([k]) => [`show_${k}`, true])), ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 7; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !BTN.unavailable.test(String(s.state)); }
    _raw(id) { const s = this._st(id); return this._ok(s) ? String(s.state) : ''; }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _on(id) { return /^(on|true|home|detected|occupied|full|problem)$/i.test(this._raw(id)); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    // état : unavailable, error, occupied (un chat dans la litière), puis l'état de la machine (nettoyage, pause, maintenance…), sinon idle
    _compute() {
      const c = this._c, raw = this._raw(c.entity_status), errRaw = this._raw(c.entity_error);
      const known = Object.values(ENT).some((o) => c[o] && this._ok(this._st(c[o])));
      const errBad = !!errRaw && !/^(no error|none|ok|off|false|0|normal|aucune|no_error)$/i.test(errRaw);
      let st = 'idle';
      const hit = STATUS.find(([re]) => re.test(raw)); if (hit) st = hit[1];
      if (errBad || this._on(c.entity_error)) st = 'error';
      else if (this._on(c.entity_occupied)) st = 'occupied';
      if (!known || (c.entity_status && this._st(c.entity_status) && !this._ok(this._st(c.entity_status)) && !this._on(c.entity_occupied))) st = known ? st : 'unavailable';
      const level = this._num(c.entity_litter_level), odor = this._num(c.entity_odor_days), spray = this._num(c.entity_spray_liquid);
      const alerts = [];
      if (st === 'error' && errBad) alerts.push(['bad', null, errRaw]);
      if (this._on(c.entity_waste_full)) alerts.push(['bad', 'waste_full']);
      if (this._on(c.entity_no_litter) || (isFinite(level) && level <= Number(c.litter_low ?? 0) && c.entity_litter_level && Number(c.litter_low) > 0)) alerts.push(['bad', 'no_litter']);
      if (isFinite(odor) && odor >= 0 && odor <= Number(c.odor_low ?? 3)) alerts.push(['', 'odor_low']);
      if (isFinite(spray) && spray <= Number(c.spray_low ?? 15)) alerts.push(['', 'spray_low']);
      return { st, raw, errRaw, level, odor, spray, alerts, known };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="lbtitle"></div><div class="badge" id="lbbadge"></div></div>
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(this._c.name || this._t('name'))}"><ellipse cx="${W / 2 + 20}" cy="${H - 8}" rx="${W * 0.38}" ry="14" fill="#000" opacity=".22"/>
          <image href="${IMG}" x="0" y="0" width="870" height="749"/>${OVERLAY()}</svg>
        <div class="alerts" id="lbalerts"></div>
        <div class="rings hide" id="lbrings"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        <div class="btns" id="lbbtns">${BUTTONS.map(([k, ic, , danger]) => `<button class="hide${danger ? ' danger' : ''}" data-b="${k}"><ha-icon icon="${ic}"></ha-icon><span></span></button>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_status || this._c.entity_occupied));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => { const t = TILES.find(([k]) => k === el.dataset.k); this._more(t && this._c[ENT[t[2]]]); }));
      root.querySelectorAll('.btns button').forEach((b) => b.addEventListener('click', () => this._press(b.dataset.b)));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // appui sur un bouton : press (button / input_button), turn_on (script / switch) ; Vider et Reset N50 demandent une confirmation
    _press(k) {
      const def = BUTTONS.find(([key]) => key === k), id = def && this._c[def[2]];
      if (!id) return;
      const dom = id.split('.')[0];
      if (k === 'light') { this._hass.callService(['light', 'switch', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id }); return; }
      const run = () => this._hass.callService(dom === 'button' || dom === 'input_button' ? dom : dom === 'script' || dom === 'switch' ? dom : 'button', dom === 'button' || dom === 'input_button' ? 'press' : 'turn_on', { entity_id: id });
      if (def[3] && this._c.confirm_dangerous !== false && window.applianceConfirm) window.applianceConfirm(this, { action: 'toggle', confirmation: { text: this._t(k === 'empty' ? 'confirm_empty' : 'confirm_reset') } }, run); else run();
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, v = this._compute();
      const lightOn = this._on(c.entity_light);
      card.className = `${v.st}${lightOn ? ' lit' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('lbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('lbbadge'); badge.textContent = this._t(v.st); badge.style.display = c.show_status === false ? 'none' : '';
      // voyant de l'écran : vert libre, bleu en action, orange pause / occupé, rouge erreur
      r.getElementById('lbled').setAttribute('fill', { idle: '#2fd27a', error: '#ff4d3d', paused: '#ffb300', occupied: '#ffb300', unavailable: '#6b7076' }[v.st] || '#4db2ff');
      r.getElementById('lbalerts').innerHTML = v.alerts.map(([cl, k, txt]) => `<span class="${cl}">${esc(txt || this._l(k))}</span>`).join('');
      const val = {
        level: isFinite(v.level) ? [this._fmt(v.level), '%'] : null, waste: c.entity_waste_full ? [this._on(c.entity_waste_full) ? this._l('full') : this._l('ok'), ''] : null,
        odor: isFinite(v.odor) && v.odor >= 0 ? [this._fmt(v.odor), this._l('days')] : null, uses: isFinite(this._num(c.entity_times_used)) ? [this._fmt(this._num(c.entity_times_used)), ''] : null,
        spray: isFinite(v.spray) ? [this._fmt(v.spray), '%'] : null, cat: this._raw(c.entity_last_cat) ? [this._raw(c.entity_last_cat), ''] : null,
      };
      // graphique en anneaux concentriques (N50, liquide et batterie du spray, litière) à la place des tuiles en pourcentage (option rings, active par défaut)
      const maxDays = Number(c.n50_max_days) > 0 ? Number(c.n50_max_days) : 30, battV = this._num(c.entity_spray_battery);
      const R = [['odor', '#a56cd6', isFinite(v.odor) && v.odor >= 0 ? Math.min(100, v.odor / maxDays * 100) : NaN, c.entity_odor_days, isFinite(v.odor) ? `${this._fmt(v.odor)} ${this._l('days')}` : ''],
        ['spray_liquid', '#3da5f4', v.spray, c.entity_spray_liquid, ''], ['spray_batt', '#2fbf71', battV, c.entity_spray_battery, ''], ['litter', '#f0a030', v.level, c.entity_litter_level, '']]
        .filter((x) => isFinite(x[2]));
      const rings = c.rings !== false && R.length > 0, rg = r.getElementById('lbrings');
      rg.classList.toggle('hide', !rings);
      if (rings) {
        const arcs = R.map(([, col, pc], i) => { const rad = 52 - i * 11, cf = 2 * Math.PI * rad, len = Math.max(0, Math.min(100, pc)) / 100 * cf;
          return `<circle class="trk" cx="60" cy="60" r="${rad}"/><circle class="arc" cx="60" cy="60" r="${rad}" stroke="${col}" stroke-dasharray="${len.toFixed(1)} ${cf.toFixed(1)}" transform="rotate(-90 60 60)"/>`; }).join('');
        const uses = this._num(c.entity_times_used);
        rg.innerHTML = `<svg class="donut" viewBox="0 0 120 120">${arcs}${isFinite(uses) ? `<text x="60" y="66" text-anchor="middle" font-size="20" font-weight="700" fill="var(--primary-text-color)">${esc(this._fmt(uses))}</text>` : ''}</svg>
          <div class="lg">${R.map(([k, col, pc, id, txt]) => { const warn = (k === 'odor' && isFinite(v.odor) && v.odor <= Number(c.odor_low ?? 3)) || ((k === 'spray_liquid' || k === 'spray_batt') && pc <= Number(c.spray_low ?? 15));
            return `<div data-e="${esc(id)}"><i style="background:${col}"></i><span>${esc(this._l(k))}</span><b class="${warn ? 'warn' : ''}">${txt || `${this._fmt(pc)} %`}</b></div>`; }).join('')}</div>`;
        rg.querySelectorAll('[data-e]').forEach((el) => { el.onclick = () => this._more(el.dataset.e); });
      }
      TILES.forEach(([k, , src]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), d = val[src];
        el.classList.toggle('hide', !d || c[`show_${k}`] === false || (rings && ['litter', 'odor', 'spray'].includes(k)));
        el.classList.toggle('bad', (k === 'waste' && this._on(c.entity_waste_full)) || (k === 'litter' && this._on(c.entity_no_litter)));
        el.classList.toggle('warn', (k === 'odor' && isFinite(v.odor) && v.odor <= Number(c.odor_low ?? 3)) || (k === 'spray' && isFinite(v.spray) && v.spray <= Number(c.spray_low ?? 15)));
        el.querySelector('.lbl').textContent = this._l(k);
        if (d) { const small = document.createElement('small'); small.textContent = d[1]; el.querySelector('.v').replaceChildren(d[0], small); }
      });
      // boutons : seulement ceux dont l'entité est renseignée ; pause ou reprendre selon l'état, maintenance ou sortie de maintenance
      const cleaning = ['cleaning', 'emptying', 'leveling', 'deodorizing'].includes(v.st), paused = v.st === 'paused', maint = v.st === 'maintenance';
      let any = false;
      BUTTONS.forEach(([k, , opt]) => {
        const b = r.querySelector(`.btns button[data-b="${k}"]`);
        let show = !!c[opt] && c.show_buttons !== false;
        if (k === 'pause') show = show && !paused; if (k === 'resume') show = show && (paused || !c.button_pause);
        if (k === 'maint') show = show && !maint; if (k === 'maint_exit') show = show && maint;
        b.classList.toggle('hide', !show); b.classList.toggle('on', k === 'light' && lightOn); b.querySelector('span').textContent = this._l(`btn_${k}`); // nettoyer / vider : désactivés quand un chat est dedans ou qu'un cycle tourne déjà
        b.disabled = v.st === 'unavailable' || ((k === 'clean' || k === 'empty') && (v.st === 'occupied' || cleaning)); any = any || show;
      });
      r.getElementById('lbbtns').classList.toggle('hide', !any);
    }
  }
  customElements.define(TAG, ApplianceLitterBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceLitterBoxCardEditor extends HTMLElement {
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
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      const btn = ['button', 'input_button', 'script'];
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_status', ['sensor', 'select']), ent('entity_occupied', ['binary_sensor', 'sensor']), ent('entity_error', ['sensor', 'binary_sensor']),
        ent('entity_waste_full', ['binary_sensor']), ent('entity_no_litter', ['binary_sensor']),
        ent('entity_litter_level', 'sensor'), ent('entity_litter_weight', 'sensor'), ent('entity_odor_days', 'sensor'), ent('entity_times_used', 'sensor'),
        ent('entity_spray_liquid', 'sensor'), ent('entity_spray_battery', 'sensor'), ent('entity_last_cat', 'sensor'), ent('entity_last_event', 'sensor'),
        ent('entity_light', ['light', 'switch']), ent('button_clean', btn), ent('button_pause', btn), ent('button_continue', btn), ent('button_deodorize', btn), ent('button_level', btn),
        ent('button_empty', btn), ent('button_maintenance', btn), ent('button_maintenance_exit', btn), ent('button_reset_n50', btn),
        { type: 'grid', name: '', schema: [num('odor_low', 3, 0, 30, 1, 'd'), num('spray_low', 15, 0, 100, 1, '%'), num('n50_max_days', 30, 1, 120, 1, 'd')] },
        bool('rings'),
        bool('confirm_dangerous'),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_buttons'), ...TILES.map(([k]) => bool(`show_${k}`)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceLitterBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Litière automatique connectée (PETKIT Pura Max…) en photo : tambour animé, chat dans l\'entrée, alertes, tuiles et boutons d\'action avec confirmation.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/litter-box.md',
  });
})();
