/* Carte « Litière automatique » — custom:appliance-litter-box-card
 * Litière connectée à tambour (PETKIT Pura Max…) : photo détourée, animations dessinées par-dessus. Tambour qui tourne dans la fenêtre pendant le nettoyage,
 * chat dans l'entrée quand la litière est occupée, voyant de l'écran (libre / nettoyage / pause / erreur), alertes (bac à déchets plein, manque de litière,
 * désodorisant N50 bientôt à changer, liquide du spray faible), tuiles (litière, bac, N50, utilisations, spray, dernier passage) et boutons d'action :
 * nettoyer, pause / reprendre, désodoriser, niveler, vider la litière, maintenance, reset N50. Vider et reset N50 demandent une confirmation.
 * Toutes les entités sont facultatives. États : idle, cleaning, paused, maintenance, emptying, leveling, deodorizing, occupied, error, unavailable.
 */
(() => {
  const TAG = 'appliance-litter-box-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"resetting":"Recalibrating","btn_light":"Light","f_entity_light":"Inner light (light / switch)","spray_liquid":"Spray liquid","spray_batt":"Spray battery","f_entity_spray_battery":"Spray battery level (%)","f_n50_max_days":"N50 full life (days)","f_rings":"Rings chart instead of the % tiles","name":"Automatic litter box","idle":"Ready","cleaning":"Cleaning","paused":"Paused","maintenance":"Maintenance","emptying":"Emptying","leveling":"Levelling","deodorizing":"Deodorising","occupied":"Occupied","error":"Error","unavailable":"Unavailable","waste_full":"Waste bin full","no_litter":"Litter missing","odor_low":"Odour eliminator to replace","spray_low":"Spray liquid low","full":"Full","ok":"OK","days":"d","litter":"Litter","waste":"Waste bin","odor":"N50 odour","uses":"Uses","spray":"Spray","lastcat":"Last cat","btn_clean":"Clean","btn_pause":"Pause","btn_resume":"Resume","btn_deodorize":"Deodorise","btn_level":"Level","btn_empty":"Empty litter","btn_maint":"Maintenance","btn_maint_exit":"End maintenance","btn_reset":"Reset N50","confirm_empty":"Empty all the litter? This starts the emptying cycle.","confirm_reset":"Reset the N50 odour eliminator counter?","f_entity_status":"Status (sensor)","f_entity_occupied":"Cat inside (binary sensor)","f_entity_error":"Error (sensor)","f_entity_waste_full":"Waste bin full (binary sensor)","f_entity_no_litter":"Litter missing (binary sensor)","f_entity_litter_level":"Litter level (%)","f_entity_litter_weight":"Litter weight","f_entity_odor_days":"N50 days left","f_entity_times_used":"Times used","f_entity_spray_liquid":"Spray liquid level (%)","f_entity_last_cat":"Last cat (sensor)","f_entity_last_event":"Last event (sensor)","f_button_clean":"Button: clean","f_button_pause":"Button: pause","f_button_continue":"Button: resume","f_button_deodorize":"Button: deodorise","f_button_level":"Button: level the litter","f_button_empty":"Button: empty the litter","f_button_maintenance":"Button: start maintenance","f_button_maintenance_exit":"Button: end maintenance","f_button_reset_n50":"Button: reset N50","f_odor_low":"Odour eliminator alert below (days)","f_spray_low":"Spray alert below (%)","f_confirm_dangerous":"Confirm before emptying / resetting N50","f_show_buttons":"action buttons","f_show_litter":"litter tile","f_show_waste":"waste bin tile","f_show_odor":"N50 tile","f_show_uses":"uses tile","f_show_spray":"spray tile","f_show_lastcat":"last cat tile"},"cs":{"resetting":"Rekalibrace","btn_light":"Světlo","spray_liquid":"Kapalina ve spreji","spray_batt":"Baterie spreje","name":"Automatické kočičí WC","idle":"Volné","cleaning":"Čištění","paused":"Pauza","maintenance":"Údržba","emptying":"Vyprazdňování","leveling":"Vyrovnávání","deodorizing":"Zbavování pachů","occupied":"Obsazeno","error":"Chyba","unavailable":"Nedostupné","waste_full":"Zásobník odpadu plný","no_litter":"Chybí podestýlka","odor_low":"Výměna odstraňovače pachů N50","spray_low":"Nízká hladina kapaliny ve spreji","full":"Plný","ok":"OK","days":"d","litter":"Podestýlka","waste":"Zásobník odpadu","odor":"Pach N50","uses":"Použití","spray":"Sprej","lastcat":"Poslední kočka","btn_clean":"Vyčistit","btn_pause":"Pauza","btn_resume":"Pokračovat","btn_deodorize":"Zbavit pachů","btn_level":"Vyrovnat","btn_empty":"Vyprázdnit podestýlku","btn_maint":"Údržba","btn_maint_exit":"Konec údržby","btn_reset":"Reset N50","confirm_empty":"Vyprázdnit veškerou podestýlku? Spustí se vyprazdňovací cyklus.","confirm_reset":"Vynulovat počítadlo odstraňovače pachů N50?"},"da":{"resetting":"Genkalibrerer","btn_light":"Lys","spray_liquid":"Sprayvæske","spray_batt":"Spraybatteri","name":"Automatisk kattebakke","idle":"Fri","cleaning":"Rengøring","paused":"Pause","maintenance":"Vedligeholdelse","emptying":"Tømning","leveling":"Udjævning","deodorizing":"Lugtfjernelse","occupied":"Optaget","error":"Fejl","unavailable":"Utilgængelig","waste_full":"Affaldsbeholder fuld","no_litter":"Mangler strøelse","odor_low":"N50-lugtfjerner skal skiftes","spray_low":"Sprayvæske lav","full":"Fuld","ok":"OK","days":"d","litter":"Strøelse","waste":"Affaldsbeholder","odor":"N50-lugt","uses":"Brug","spray":"Spray","lastcat":"Sidste kat","btn_clean":"Rengør","btn_pause":"Pause","btn_resume":"Genoptag","btn_deodorize":"Fjern lugt","btn_level":"Udjævn","btn_empty":"Tøm strøelse","btn_maint":"Vedligeholdelse","btn_maint_exit":"Afslut vedligeholdelse","btn_reset":"Nulstil N50","confirm_empty":"Tøm al strøelse? Tømningscyklussen starter.","confirm_reset":"Nulstil tælleren for N50-lugtfjerneren?"},"de":{"resetting":"Neukalibrierung","btn_light":"Licht","spray_liquid":"Sprühflüssigkeit","spray_batt":"Spray-Batterie","name":"Automatische Katzentoilette","idle":"Frei","cleaning":"Reinigung","paused":"Pause","maintenance":"Wartung","emptying":"Entleeren","leveling":"Einebnen","deodorizing":"Desodorieren","occupied":"Besetzt","error":"Fehler","unavailable":"Nicht verfügbar","waste_full":"Abfallbehälter voll","no_litter":"Streu fehlt","odor_low":"N50-Geruchsentferner wechseln","spray_low":"Sprühflüssigkeit niedrig","full":"Voll","ok":"OK","days":"T","litter":"Streu","waste":"Abfallbehälter","odor":"N50-Geruch","uses":"Nutzungen","spray":"Spray","lastcat":"Letzte Katze","btn_clean":"Reinigen","btn_pause":"Pause","btn_resume":"Fortsetzen","btn_deodorize":"Desodorieren","btn_level":"Einebnen","btn_empty":"Streu leeren","btn_maint":"Wartung","btn_maint_exit":"Wartung beenden","btn_reset":"N50 zurücksetzen","confirm_empty":"Die gesamte Streu entleeren? Der Entleerungszyklus startet.","confirm_reset":"Zähler des N50-Geruchsentferners zurücksetzen?"},"es":{"resetting":"Recalibrando","btn_light":"Luz","f_entity_light":"Luz interior (light / switch)","spray_liquid":"Líquido del spray","spray_batt":"Batería del spray","f_entity_spray_battery":"Nivel de batería del spray (%)","f_n50_max_days":"Vida útil total del N50 (días)","f_rings":"Gráfico de anillos en lugar de los mosaicos de %","name":"Arenero automático","idle":"Libre","cleaning":"Limpieza","paused":"Pausa","maintenance":"Mantenimiento","emptying":"Vaciado","leveling":"Nivelado","deodorizing":"Desodorización","occupied":"Ocupado","error":"Error","unavailable":"No disponible","waste_full":"Cubo de residuos lleno","no_litter":"Falta arena","odor_low":"Eliminador de olores N50 por cambiar","spray_low":"Líquido del spray bajo","full":"Lleno","ok":"OK","days":"d","litter":"Arena","waste":"Cubo de residuos","odor":"N50 olores","uses":"Usos","spray":"Spray","lastcat":"Último gato","btn_clean":"Limpiar","btn_pause":"Pausa","btn_resume":"Reanudar","btn_deodorize":"Desodorizar","btn_level":"Nivelar","btn_empty":"Vaciar arena","btn_maint":"Mantenimiento","btn_maint_exit":"Fin mantenimiento","btn_reset":"Reiniciar N50","confirm_empty":"¿Vaciar toda la arena? Se inicia el ciclo de vaciado.","confirm_reset":"¿Reiniciar el contador del eliminador de olores N50?","f_entity_status":"Estado (sensor)","f_entity_occupied":"Gato dentro (sensor binario)","f_entity_error":"Error (sensor)","f_entity_waste_full":"Cubo de residuos lleno (sensor binario)","f_entity_no_litter":"Falta arena (sensor binario)","f_entity_litter_level":"Nivel de arena (%)","f_entity_litter_weight":"Peso de la arena","f_entity_odor_days":"Días restantes del N50","f_entity_times_used":"Número de usos","f_entity_spray_liquid":"Nivel de líquido del spray (%)","f_entity_last_cat":"Último gato (sensor)","f_entity_last_event":"Último evento (sensor)","f_button_clean":"Botón: limpiar","f_button_pause":"Botón: pausa","f_button_continue":"Botón: reanudar","f_button_deodorize":"Botón: desodorizar","f_button_level":"Botón: nivelar la arena","f_button_empty":"Botón: vaciar la arena","f_button_maintenance":"Botón: iniciar el mantenimiento","f_button_maintenance_exit":"Botón: terminar el mantenimiento","f_button_reset_n50":"Botón: reiniciar N50","f_odor_low":"Alerta del eliminador de olores por debajo de (días)","f_spray_low":"Alerta del spray por debajo de (%)","f_confirm_dangerous":"Confirmar antes de vaciar / reiniciar N50","f_show_buttons":"botones de acción","f_show_litter":"mosaico arena","f_show_waste":"mosaico cubo de residuos","f_show_odor":"mosaico N50","f_show_uses":"mosaico usos","f_show_spray":"mosaico spray","f_show_lastcat":"mosaico último gato"},"fr":{"resetting":"Recalibrage","btn_light":"Lumière","f_entity_light":"Lumière intégrée (light / switch)","spray_liquid":"Liquide désodorisant","spray_batt":"Batt. désodorisant","f_entity_spray_battery":"Batterie du spray (%)","f_n50_max_days":"Durée de vie du N50 (jours)","f_rings":"Graphique en anneaux à la place des tuiles %","name":"Litière automatique","idle":"Libre","cleaning":"Nettoyage","paused":"Pause","maintenance":"Maintenance","emptying":"Vidage","leveling":"Nivellement","deodorizing":"Désodorisation","occupied":"Occupée","error":"Erreur","unavailable":"Indisponible","waste_full":"Bac à déchets plein","no_litter":"Manque de litière","odor_low":"Désodorisant N50 à changer","spray_low":"Liquide du spray faible","full":"Plein","ok":"OK","days":"j","litter":"Litière","waste":"Bac à déchets","odor":"Galet N50","uses":"Utilisations","spray":"Spray","lastcat":"Dernier passage","btn_clean":"Nettoyer","btn_pause":"Pause","btn_resume":"Reprendre","btn_deodorize":"Désodoriser","btn_level":"Aplanir","btn_empty":"Vider la litière","btn_maint":"Maintenance","btn_maint_exit":"Fin maintenance","btn_reset":"Reset N50","confirm_empty":"Vider toute la litière ? Cela lance le cycle de vidage.","confirm_reset":"Réinitialiser le compteur du désodorisant N50 ?","f_entity_status":"État (capteur)","f_entity_occupied":"Chat à l'intérieur (capteur binaire)","f_entity_error":"Erreur (capteur)","f_entity_waste_full":"Bac à déchets plein (capteur binaire)","f_entity_no_litter":"Manque de litière (capteur binaire)","f_entity_litter_level":"Niveau de litière (%)","f_entity_litter_weight":"Poids de la litière","f_entity_odor_days":"Jours restants N50","f_entity_times_used":"Nombre d'utilisations","f_entity_spray_liquid":"Niveau du liquide du spray (%)","f_entity_last_cat":"Dernier chat (capteur)","f_entity_last_event":"Dernier événement (capteur)","f_button_clean":"Bouton : nettoyer","f_button_pause":"Bouton : pause","f_button_continue":"Bouton : reprendre","f_button_deodorize":"Bouton : désodoriser","f_button_level":"Bouton : aplanir la litière","f_button_empty":"Bouton : vider la litière","f_button_maintenance":"Bouton : début de maintenance","f_button_maintenance_exit":"Bouton : fin de maintenance","f_button_reset_n50":"Bouton : reset N50","f_odor_low":"Alerte désodorisant sous (jours)","f_spray_low":"Alerte spray sous (%)","f_confirm_dangerous":"Confirmer avant de vider / reset N50","f_show_buttons":"boutons d'action","f_show_litter":"tuile litière","f_show_waste":"tuile bac à déchets","f_show_odor":"tuile N50","f_show_uses":"tuile utilisations","f_show_spray":"tuile spray","f_show_lastcat":"tuile dernier passage"},"hu":{"resetting":"Újrakalibrálás","btn_light":"Fény","spray_liquid":"Spray folyadék","spray_batt":"Spray akkumulátor","name":"Automata macskaalom","idle":"Szabad","cleaning":"Tisztítás","paused":"Szünet","maintenance":"Karbantartás","emptying":"Ürítés","leveling":"Egyengetés","deodorizing":"Szagtalanítás","occupied":"Foglalt","error":"Hiba","unavailable":"Nem elérhető","waste_full":"Hulladéktartály tele","no_litter":"Hiányzó alom","odor_low":"N50 szagsemlegesítő cserélendő","spray_low":"Alacsony spray folyadékszint","full":"Tele","ok":"OK","days":"n","litter":"Alom","waste":"Hulladéktartály","odor":"N50 szag","uses":"Használat","spray":"Spray","lastcat":"Utolsó macska","btn_clean":"Tisztítás","btn_pause":"Szünet","btn_resume":"Folytatás","btn_deodorize":"Szagtalanítás","btn_level":"Egyengetés","btn_empty":"Alom ürítése","btn_maint":"Karbantartás","btn_maint_exit":"Karbantartás vége","btn_reset":"N50 nullázása","confirm_empty":"Kiüríti az összes almot? Elindul az ürítési ciklus.","confirm_reset":"Nullázza az N50 szagsemlegesítő számlálóját?"},"it":{"resetting":"Ricalibrazione","btn_light":"Luce","spray_liquid":"Liquido spray","spray_batt":"Batteria spray","name":"Lettiera automatica","idle":"Libera","cleaning":"Pulizia","paused":"Pausa","maintenance":"Manutenzione","emptying":"Svuotamento","leveling":"Livellamento","deodorizing":"Deodorazione","occupied":"Occupata","error":"Errore","unavailable":"Non disponibile","waste_full":"Contenitore rifiuti pieno","no_litter":"Lettiera mancante","odor_low":"Eliminatore di odori N50 da cambiare","spray_low":"Liquido spray basso","full":"Pieno","ok":"OK","days":"g","litter":"Lettiera","waste":"Contenitore rifiuti","odor":"N50 odori","uses":"Utilizzi","spray":"Spray","lastcat":"Ultimo gatto","btn_clean":"Pulisci","btn_pause":"Pausa","btn_resume":"Riprendi","btn_deodorize":"Deodora","btn_level":"Livella","btn_empty":"Svuota lettiera","btn_maint":"Manutenzione","btn_maint_exit":"Fine manutenzione","btn_reset":"Reset N50","confirm_empty":"Svuotare tutta la lettiera? Parte il ciclo di svuotamento.","confirm_reset":"Azzerare il contatore dell'eliminatore di odori N50?"},"nb":{"resetting":"Rekalibrerer","btn_light":"Lys","spray_liquid":"Sprayvæske","spray_batt":"Spraybatteri","name":"Automatisk kattedo","idle":"Ledig","cleaning":"Rengjøring","paused":"Pause","maintenance":"Vedlikehold","emptying":"Tømming","leveling":"Utjevning","deodorizing":"Luktfjerning","occupied":"Opptatt","error":"Feil","unavailable":"Utilgjengelig","waste_full":"Avfallsbeholder full","no_litter":"Mangler strø","odor_low":"N50-luktfjerner må byttes","spray_low":"Sprayvæske lav","full":"Full","ok":"OK","days":"d","litter":"Strø","waste":"Avfallsbeholder","odor":"N50-lukt","uses":"Bruk","spray":"Spray","lastcat":"Siste katt","btn_clean":"Rengjør","btn_pause":"Pause","btn_resume":"Fortsett","btn_deodorize":"Fjern lukt","btn_level":"Jevn ut","btn_empty":"Tøm strø","btn_maint":"Vedlikehold","btn_maint_exit":"Avslutt vedlikehold","btn_reset":"Nullstill N50","confirm_empty":"Tømme alt strø? Tømmesyklusen starter.","confirm_reset":"Nullstille telleren for N50-luktfjerneren?"},"nl":{"resetting":"Herkalibreren","btn_light":"Licht","spray_liquid":"Sprayvloeistof","spray_batt":"Spraybatterij","name":"Automatische kattenbak","idle":"Vrij","cleaning":"Reiniging","paused":"Pauze","maintenance":"Onderhoud","emptying":"Legen","leveling":"Egaliseren","deodorizing":"Geurverwijdering","occupied":"Bezet","error":"Fout","unavailable":"Niet beschikbaar","waste_full":"Afvalbak vol","no_litter":"Grit ontbreekt","odor_low":"N50-geurverwijderaar vervangen","spray_low":"Sprayvloeistof laag","full":"Vol","ok":"OK","days":"d","litter":"Grit","waste":"Afvalbak","odor":"N50-geur","uses":"Gebruiken","spray":"Spray","lastcat":"Laatste kat","btn_clean":"Reinigen","btn_pause":"Pauze","btn_resume":"Hervatten","btn_deodorize":"Geur verwijderen","btn_level":"Egaliseren","btn_empty":"Grit legen","btn_maint":"Onderhoud","btn_maint_exit":"Einde onderhoud","btn_reset":"N50 resetten","confirm_empty":"Alle grit legen? De legencyclus start.","confirm_reset":"Teller van de N50-geurverwijderaar resetten?"},"pl":{"resetting":"Rekalibracja","btn_light":"Światło","spray_liquid":"Płyn w sprayu","spray_batt":"Bateria sprayu","name":"Automatyczna kuweta","idle":"Wolna","cleaning":"Czyszczenie","paused":"Pauza","maintenance":"Konserwacja","emptying":"Opróżnianie","leveling":"Wyrównywanie","deodorizing":"Neutralizacja zapachów","occupied":"Zajęta","error":"Błąd","unavailable":"Niedostępne","waste_full":"Pojemnik na odpady pełny","no_litter":"Brak żwirku","odor_low":"Wymiana neutralizatora zapachów N50","spray_low":"Niski poziom płynu w sprayu","full":"Pełny","ok":"OK","days":"d","litter":"Żwirek","waste":"Pojemnik na odpady","odor":"Zapach N50","uses":"Użycia","spray":"Spray","lastcat":"Ostatni kot","btn_clean":"Czyść","btn_pause":"Pauza","btn_resume":"Wznów","btn_deodorize":"Odświeżaj","btn_level":"Wyrównaj","btn_empty":"Opróżnij żwirek","btn_maint":"Konserwacja","btn_maint_exit":"Koniec konserwacji","btn_reset":"Zeruj N50","confirm_empty":"Opróżnić cały żwirek? Rozpocznie się cykl opróżniania.","confirm_reset":"Wyzerować licznik neutralizatora zapachów N50?"},"pt-BR":{"resetting":"Recalibrando","btn_light":"Luz","f_entity_light":"Luz interior (light / switch)","spray_liquid":"Líquido do spray","spray_batt":"Bateria do spray","f_entity_spray_battery":"Nível da bateria do spray (%)","f_n50_max_days":"Vida útil total do N50 (dias)","f_rings":"Gráfico de anéis em vez dos blocos de %","name":"Caixa de areia automática","idle":"Livre","cleaning":"Limpeza","paused":"Pausa","maintenance":"Manutenção","emptying":"Esvaziamento","leveling":"Nivelamento","deodorizing":"Desodorização","occupied":"Ocupada","error":"Erro","unavailable":"Indisponível","waste_full":"Compartimento de resíduos cheio","no_litter":"Falta areia","odor_low":"Eliminador de odores N50 a trocar","spray_low":"Líquido do spray baixo","full":"Cheio","ok":"OK","days":"d","litter":"Areia","waste":"Compartimento de resíduos","odor":"N50 odores","uses":"Usos","spray":"Spray","lastcat":"Último gato","btn_clean":"Limpar","btn_pause":"Pausar","btn_resume":"Retomar","btn_deodorize":"Desodorizar","btn_level":"Nivelar","btn_empty":"Esvaziar areia","btn_maint":"Manutenção","btn_maint_exit":"Fim da manutenção","btn_reset":"Reiniciar N50","confirm_empty":"Esvaziar toda a areia? O ciclo de esvaziamento será iniciado.","confirm_reset":"Reiniciar o contador do eliminador de odores N50?","f_entity_status":"Estado (sensor)","f_entity_occupied":"Gato no interior (sensor binário)","f_entity_error":"Erro (sensor)","f_entity_waste_full":"Compartimento de resíduos cheio (sensor binário)","f_entity_no_litter":"Falta areia (sensor binário)","f_entity_litter_level":"Nível da areia (%)","f_entity_litter_weight":"Peso da areia","f_entity_odor_days":"Dias restantes do N50","f_entity_times_used":"Número de usos","f_entity_spray_liquid":"Nível do líquido do spray (%)","f_entity_last_cat":"Último gato (sensor)","f_entity_last_event":"Último evento (sensor)","f_button_clean":"Botão: limpar","f_button_pause":"Botão: pausar","f_button_continue":"Botão: retomar","f_button_deodorize":"Botão: desodorizar","f_button_level":"Botão: nivelar a areia","f_button_empty":"Botão: esvaziar a areia","f_button_maintenance":"Botão: iniciar a manutenção","f_button_maintenance_exit":"Botão: terminar a manutenção","f_button_reset_n50":"Botão: reiniciar N50","f_odor_low":"Alerta do eliminador de odores abaixo de (dias)","f_spray_low":"Alerta do spray abaixo de (%)","f_confirm_dangerous":"Confirmar antes de esvaziar / reiniciar N50","f_show_buttons":"botões de ação","f_show_litter":"bloco areia","f_show_waste":"bloco compartimento de resíduos","f_show_odor":"bloco N50","f_show_uses":"bloco usos","f_show_spray":"bloco spray","f_show_lastcat":"bloco último gato"},"pt-PT":{"resetting":"A recalibrar","btn_light":"Luz","f_entity_light":"Luz interior (light / switch)","spray_liquid":"Líquido do spray","spray_batt":"Bateria do spray","f_entity_spray_battery":"Nível da bateria do spray (%)","f_n50_max_days":"Vida útil total do N50 (dias)","f_rings":"Gráfico de anéis em vez dos blocos de %","name":"Caixa de areia automática","idle":"Livre","cleaning":"Limpeza","paused":"Pausa","maintenance":"Manutenção","emptying":"Esvaziamento","leveling":"Nivelamento","deodorizing":"Desodorização","occupied":"Ocupada","error":"Erro","unavailable":"Indisponível","waste_full":"Compartimento de resíduos cheio","no_litter":"Falta areia","odor_low":"Eliminador de odores N50 a substituir","spray_low":"Líquido do spray baixo","full":"Cheio","ok":"OK","days":"d","litter":"Areia","waste":"Compartimento de resíduos","odor":"N50 odores","uses":"Utilizações","spray":"Spray","lastcat":"Último gato","btn_clean":"Limpar","btn_pause":"Pausa","btn_resume":"Retomar","btn_deodorize":"Desodorizar","btn_level":"Nivelar","btn_empty":"Esvaziar areia","btn_maint":"Manutenção","btn_maint_exit":"Fim da manutenção","btn_reset":"Repor N50","confirm_empty":"Esvaziar toda a areia? O ciclo de esvaziamento vai arrancar.","confirm_reset":"Repor o contador do eliminador de odores N50?","f_entity_status":"Estado (sensor)","f_entity_occupied":"Gato no interior (sensor binário)","f_entity_error":"Erro (sensor)","f_entity_waste_full":"Compartimento de resíduos cheio (sensor binário)","f_entity_no_litter":"Falta areia (sensor binário)","f_entity_litter_level":"Nível da areia (%)","f_entity_litter_weight":"Peso da areia","f_entity_odor_days":"Dias restantes do N50","f_entity_times_used":"Número de utilizações","f_entity_spray_liquid":"Nível do líquido do spray (%)","f_entity_last_cat":"Último gato (sensor)","f_entity_last_event":"Último evento (sensor)","f_button_clean":"Botão: limpar","f_button_pause":"Botão: pausa","f_button_continue":"Botão: retomar","f_button_deodorize":"Botão: desodorizar","f_button_level":"Botão: nivelar a areia","f_button_empty":"Botão: esvaziar a areia","f_button_maintenance":"Botão: iniciar a manutenção","f_button_maintenance_exit":"Botão: terminar a manutenção","f_button_reset_n50":"Botão: repor N50","f_odor_low":"Alerta do eliminador de odores abaixo de (dias)","f_spray_low":"Alerta do spray abaixo de (%)","f_confirm_dangerous":"Confirmar antes de esvaziar / repor N50","f_show_buttons":"botões de ação","f_show_litter":"bloco areia","f_show_waste":"bloco compartimento de resíduos","f_show_odor":"bloco N50","f_show_uses":"bloco utilizações","f_show_spray":"bloco spray","f_show_lastcat":"bloco último gato"},"ro":{"resetting":"Recalibrare","btn_light":"Lumină","spray_liquid":"Lichid spray","spray_batt":"Baterie spray","name":"Litieră automată","idle":"Liberă","cleaning":"Curățare","paused":"Pauză","maintenance":"Mentenanță","emptying":"Golire","leveling":"Nivelare","deodorizing":"Dezodorizare","occupied":"Ocupată","error":"Eroare","unavailable":"Indisponibil","waste_full":"Recipient deșeuri plin","no_litter":"Lipsă așternut","odor_low":"Eliminator de mirosuri N50 de schimbat","spray_low":"Lichid spray scăzut","full":"Plin","ok":"OK","days":"z","litter":"Așternut","waste":"Recipient deșeuri","odor":"Miros N50","uses":"Utilizări","spray":"Spray","lastcat":"Ultima pisică","btn_clean":"Curăță","btn_pause":"Pauză","btn_resume":"Reia","btn_deodorize":"Dezodorizează","btn_level":"Nivelează","btn_empty":"Golește așternutul","btn_maint":"Mentenanță","btn_maint_exit":"Sfârșit mentenanță","btn_reset":"Resetare N50","confirm_empty":"Goliți tot așternutul? Pornește ciclul de golire.","confirm_reset":"Resetați contorul eliminatorului de mirosuri N50?"},"ru":{"resetting":"Калибровка","btn_light":"Свет","f_entity_light":"Подсветка внутри (light / switch)","spray_liquid":"Жидкость спрея","spray_batt":"Батарея спрея","f_entity_spray_battery":"Заряд батареи освежителя (%)","f_n50_max_days":"Полный срок службы N50 (дней)","f_rings":"Кольцевые диаграммы вместо плиток в %","name":"Автоматический лоток","idle":"Свободен","cleaning":"Очистка","paused":"Пауза","maintenance":"Обслуживание","emptying":"Опустошение","leveling":"Выравнивание","deodorizing":"Дезодорация","occupied":"Занят","error":"Ошибка","unavailable":"Недоступно","waste_full":"Контейнер для отходов полон","no_litter":"Нет наполнителя","odor_low":"Замена нейтрализатора запаха N50","spray_low":"Мало жидкости в спрее","full":"Полон","ok":"ОК","days":"д","litter":"Наполнитель","waste":"Контейнер для отходов","odor":"Запах N50","uses":"Использований","spray":"Спрей","lastcat":"Последний кот","btn_clean":"Очистить","btn_pause":"Пауза","btn_resume":"Продолжить","btn_deodorize":"Дезодорировать","btn_level":"Выровнять","btn_empty":"Опустошить наполнитель","btn_maint":"Обслуживание","btn_maint_exit":"Завершить обслуживание","btn_reset":"Сброс N50","confirm_empty":"Опустошить весь наполнитель? Начнётся цикл опустошения.","confirm_reset":"Сбросить счётчик нейтрализатора запаха N50?","f_entity_status":"Статус (сенсор)","f_entity_occupied":"Кот внутри (бинарный сенсор)","f_entity_error":"Ошибка (сенсор)","f_entity_waste_full":"Контейнер отходов заполнен (бинарный сенсор)","f_entity_no_litter":"Нет наполнителя (бинарный сенсор)","f_entity_litter_level":"Уровень наполнителя (%)","f_entity_litter_weight":"Вес наполнителя","f_entity_odor_days":"Осталось дней N50","f_entity_times_used":"Количество посещений","f_entity_spray_liquid":"Уровень жидкости освежителя (%)","f_entity_last_cat":"Последний питомец (сенсор)","f_entity_last_event":"Последнее событие (сенсор)","f_button_clean":"Кнопка: очистить","f_button_pause":"Кнопка: пауза","f_button_continue":"Кнопка: продолжить","f_button_deodorize":"Кнопка: освежить","f_button_level":"Кнопка: разровнять наполнитель","f_button_empty":"Кнопка: высыпать наполнитель","f_button_maintenance":"Кнопка: начать обслуживание","f_button_maintenance_exit":"Кнопка: завершить обслуживание","f_button_reset_n50":"Кнопка: сброс N50","f_odor_low":"Оповещение о поглотителе запаха ниже (дней)","f_spray_low":"Оповещение об освежителе ниже (%)","f_confirm_dangerous":"Подтверждение перед очисткой лотка / сбросом N50","f_show_buttons":"кнопки действий","f_show_litter":"плитка наполнителя","f_show_waste":"плитка контейнера отходов","f_show_odor":"плитка N50","f_show_uses":"плитка посещений","f_show_spray":"плитка освежителя","f_show_lastcat":"плитка последнего питомца"},"sr":{"resetting":"Рекалибрација","btn_light":"Светло","spray_liquid":"Течност спреја","spray_batt":"Батерија спреја","name":"Аутоматски тоалет за мачке","idle":"Слободан","cleaning":"Чишћење","paused":"Пауза","maintenance":"Одржавање","emptying":"Пражњење","leveling":"Равнање","deodorizing":"Дезодорисање","occupied":"Заузет","error":"Грешка","unavailable":"Недоступно","waste_full":"Посуда за отпад пуна","no_litter":"Нема постељине","odor_low":"Заменити N50 неутрализатор мириса","spray_low":"Мало течности у спреју","full":"Пун","ok":"У реду","days":"д","litter":"Постељина","waste":"Посуда за отпад","odor":"N50 мирис","uses":"Употреба","spray":"Спреј","lastcat":"Последња мачка","btn_clean":"Очисти","btn_pause":"Пауза","btn_resume":"Настави","btn_deodorize":"Дезодориши","btn_level":"Поравнај","btn_empty":"Испразни постељину","btn_maint":"Одржавање","btn_maint_exit":"Крај одржавања","btn_reset":"Ресетуј N50","confirm_empty":"Испразнити сву постељину? Почиње циклус пражњења.","confirm_reset":"Ресетовати бројач N50 неутрализатора мириса?"},"sr-Latn":{"resetting":"Rekalibracija","btn_light":"Svetlo","spray_liquid":"Tečnost spreja","spray_batt":"Baterija spreja","name":"Automatski toalet za mačke","idle":"Slobodan","cleaning":"Čišćenje","paused":"Pauza","maintenance":"Održavanje","emptying":"Pražnjenje","leveling":"Ravnanje","deodorizing":"Dezodorisanje","occupied":"Zauzet","error":"Greška","unavailable":"Nedostupno","waste_full":"Posuda za otpad puna","no_litter":"Nema posteljine","odor_low":"Zameniti N50 neutralizator mirisa","spray_low":"Malo tečnosti u spreju","full":"Pun","ok":"U redu","days":"d","litter":"Posteljina","waste":"Posuda za otpad","odor":"N50 miris","uses":"Upotreba","spray":"Sprej","lastcat":"Poslednja mačka","btn_clean":"Očisti","btn_pause":"Pauza","btn_resume":"Nastavi","btn_deodorize":"Dezodoriši","btn_level":"Poravnaj","btn_empty":"Isprazni posteljinu","btn_maint":"Održavanje","btn_maint_exit":"Kraj održavanja","btn_reset":"Resetuj N50","confirm_empty":"Isprazniti svu posteljinu? Počinje ciklus pražnjenja.","confirm_reset":"Resetovati brojač N50 neutralizatora mirisa?"},"uk":{"resetting":"Калібрування","btn_light":"Світло","f_entity_light":"Внутрішнє світло (light / switch)","spray_liquid":"Рідина спрея","spray_batt":"Батарея спрея","f_entity_spray_battery":"Рівень батареї спрея (%)","f_n50_max_days":"Повний термін служби N50 (дні)","f_rings":"Кільцева діаграма замість плиток з %","name":"Автоматичний лоток","idle":"Вільний","cleaning":"Очищення","paused":"Пауза","maintenance":"Обслуговування","emptying":"Спорожнення","leveling":"Вирівнювання","deodorizing":"Дезодорація","occupied":"Зайнятий","error":"Помилка","unavailable":"Недоступно","waste_full":"Контейнер для відходів повний","no_litter":"Немає наповнювача","odor_low":"Заміна нейтралізатора запаху N50","spray_low":"Мало рідини в спреї","full":"Повний","ok":"ОК","days":"д","litter":"Наповнювач","waste":"Контейнер для відходів","odor":"Запах N50","uses":"Використань","spray":"Спрей","lastcat":"Останній кіт","btn_clean":"Очистити","btn_pause":"Пауза","btn_resume":"Продовжити","btn_deodorize":"Дезодорувати","btn_level":"Вирівняти","btn_empty":"Спорожнити наповнювач","btn_maint":"Обслуговування","btn_maint_exit":"Завершити обслуговування","btn_reset":"Скидання N50","confirm_empty":"Спорожнити весь наповнювач? Почнеться цикл спорожнення.","confirm_reset":"Скинути лічильник нейтралізатора запаху N50?","f_entity_status":"Стан (датчик)","f_entity_occupied":"Кіт усередині (бінарний датчик)","f_entity_error":"Помилка (датчик)","f_entity_waste_full":"Контейнер для відходів повний (бінарний датчик)","f_entity_no_litter":"Немає наповнювача (бінарний датчик)","f_entity_litter_level":"Рівень наповнювача (%)","f_entity_litter_weight":"Вага наповнювача","f_entity_odor_days":"Залишилось днів N50","f_entity_times_used":"Кількість використань","f_entity_spray_liquid":"Рівень рідини спрея (%)","f_entity_last_cat":"Останній кіт (датчик)","f_entity_last_event":"Остання подія (датчик)","f_button_clean":"Кнопка: очистити","f_button_pause":"Кнопка: пауза","f_button_continue":"Кнопка: продовжити","f_button_deodorize":"Кнопка: дезодорувати","f_button_level":"Кнопка: вирівняти наповнювач","f_button_empty":"Кнопка: спорожнити наповнювач","f_button_maintenance":"Кнопка: почати обслуговування","f_button_maintenance_exit":"Кнопка: завершити обслуговування","f_button_reset_n50":"Кнопка: скинути N50","f_odor_low":"Сповіщення нейтралізатора запаху нижче (днів)","f_spray_low":"Сповіщення спрея нижче (%)","f_confirm_dangerous":"Підтверджувати перед спорожненням / скиданням N50","f_show_buttons":"кнопки дій","f_show_litter":"плитка наповнювача","f_show_waste":"плитка контейнера для відходів","f_show_odor":"плитка N50","f_show_uses":"плитка використань","f_show_spray":"плитка спрея","f_show_lastcat":"плитка останнього кота"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée (700 × 603, WebP transparent) ; le repère du dessin est celui de la photo d'origine (870 × 749)
  const IMG = window.__acImg("litter-box",0);
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
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceLitterBoxCard);

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
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceLitterBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Litière automatique connectée (PETKIT Pura Max…) en photo : tambour animé, chat dans l\'entrée, alertes, tuiles et boutons d\'action avec confirmation.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/litter-box.md',
  });
})();
