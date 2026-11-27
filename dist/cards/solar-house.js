/* Carte « Maison solaire » — custom:appliance-solar-house-card
 * Schéma animé d'une installation photovoltaïque : panneaux sur la toiture, tableau électrique (onduleur) dans la maison, batterie de
 * stockage, réseau électrique (poteaux), et en option borne de recharge et chauffe-eau (routeur solaire).
 * Des points lumineux circulent le long des câbles dans le sens réel de l'énergie, plus vite quand la puissance est forte :
 *   panneaux → maison, maison → batterie (charge) ou batterie → maison (décharge), maison → réseau (injection) ou réseau → maison
 *   (soutirage), maison → borne, maison → chauffe-eau. Chaque élément affiche sa puissance en temps réel (légendes dynamiques).
 * Entités (toutes facultatives sauf la production) : production solaire (W ou kW), consommation de la maison (sinon calculée),
 * puissance de la batterie (+ = charge) et niveau (%), réseau (+ = soutirage, − = injection, ou deux capteurs séparés), borne, ballon.
 * Mise à jour automatique à chaque changement d'état des entités (pas d'interrogation périodique).
 */
(() => {
  const TAG = 'appliance-solar-house-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"f_battery_count":"Number of batteries (1-3)","f_entity_battery_2_power":"Battery 2: power","f_entity_battery_2_soc":"Battery 2: charge level (%)","f_entity_battery_3_power":"Battery 3: power","f_entity_battery_3_soc":"Battery 3: charge level (%)","car":"Car","f_entity_car_soc":"Car battery level (%)","name":"Solar house","production":"Production","consumption":"Consumption","battery":"Battery","grid":"Grid","import":"Grid import","export":"Export","ev":"EV charger","water_heater":"Water heater","autonomous":"Self-powered","injecting":"Exporting","drawing":"Drawing from grid","idle":"Idle","charging":"Charging","discharging":"Discharging","f_entity_solar":"Solar production (W)","f_entity_home":"House consumption (W, else computed)","f_entity_battery_power":"Battery power (W, + = charging)","f_entity_battery_soc":"Battery level (%)","f_entity_grid":"Grid power (W, + = import, − = export)","f_entity_grid_import":"Grid import (W, if separate)","f_entity_grid_export":"Grid export (W, if separate)","f_entity_ev":"EV charger (W)","f_entity_water_heater":"Water heater (W)","f_battery_invert":"Invert the battery sign","f_grid_invert":"Invert the grid sign","f_show_negative":"Show negative values with their sign","f_max_power":"Animation full speed at (W)","f_show_tiles":"Show tiles","f_show_status":"Show status"},"cs":{"f_battery_count":"Počet baterií (1-3)","f_entity_battery_2_power":"Baterie 2: výkon","f_entity_battery_2_soc":"Baterie 2: úroveň nabití (%)","f_entity_battery_3_power":"Baterie 3: výkon","f_entity_battery_3_soc":"Baterie 3: úroveň nabití (%)","car":"Auto","f_entity_car_soc":"Stav baterie auta (%)","name":"Solární dům","production":"Výroba","consumption":"Spotřeba","battery":"Baterie","grid":"Síť","import":"Odběr ze sítě","export":"Přetok","ev":"Nabíječka EV","water_heater":"Ohřívač vody","autonomous":"Vlastní spotřeba","injecting":"Přetok do sítě","drawing":"Odběr ze sítě","idle":"Klid","charging":"Nabíjení","discharging":"Vybíjení","f_entity_solar":"Solární výroba (W)","f_entity_home":"Spotřeba domu (W, jinak vypočtená)","f_entity_battery_power":"Výkon baterie (W, + = nabíjení)","f_entity_battery_soc":"Stav baterie (%)","f_entity_grid":"Výkon sítě (W, + = odběr, − = přetok)","f_entity_grid_import":"Odběr ze sítě (W, pokud zvlášť)","f_entity_grid_export":"Přetok do sítě (W, pokud zvlášť)","f_entity_ev":"Nabíječka EV (W)","f_entity_water_heater":"Ohřívač vody (W)","f_battery_invert":"Obrátit znaménko baterie","f_grid_invert":"Obrátit znaménko sítě","f_max_power":"Plná rychlost animace při (W)","f_show_tiles":"Zobrazit dlaždice","f_show_status":"Zobrazit stav"},"da":{"f_battery_count":"Antal batterier (1-3)","f_entity_battery_2_power":"Batteri 2: effekt","f_entity_battery_2_soc":"Batteri 2: ladeniveau (%)","f_entity_battery_3_power":"Batteri 3: effekt","f_entity_battery_3_soc":"Batteri 3: ladeniveau (%)","car":"Bil","f_entity_car_soc":"Bilens batteriniveau (%)","name":"Solhus","production":"Produktion","consumption":"Forbrug","battery":"Batteri","grid":"Net","import":"Køb fra nettet","export":"Eksport","ev":"Ladestander","water_heater":"Varmtvandsbeholder","autonomous":"Selvforsynende","injecting":"Eksporterer","drawing":"Køber fra nettet","idle":"Hvile","charging":"Lader","discharging":"Aflader","f_entity_solar":"Solproduktion (W)","f_entity_home":"Husets forbrug (W, ellers beregnet)","f_entity_battery_power":"Batterieffekt (W, + = opladning)","f_entity_battery_soc":"Batteriniveau (%)","f_entity_grid":"Neteffekt (W, + = køb, − = eksport)","f_entity_grid_import":"Køb fra nettet (W, hvis separat)","f_entity_grid_export":"Eksport til nettet (W, hvis separat)","f_entity_ev":"Ladestander (W)","f_entity_water_heater":"Varmtvandsbeholder (W)","f_battery_invert":"Vend batteriets fortegn","f_grid_invert":"Vend nettets fortegn","f_max_power":"Fuld animationshastighed ved (W)","f_show_tiles":"Vis felter","f_show_status":"Vis status"},"de":{"f_battery_count":"Anzahl Batterien (1-3)","f_entity_battery_2_power":"Batterie 2: Leistung","f_entity_battery_2_soc":"Batterie 2: Ladestand (%)","f_entity_battery_3_power":"Batterie 3: Leistung","f_entity_battery_3_soc":"Batterie 3: Ladestand (%)","car":"Auto","f_entity_car_soc":"Batteriestand des Autos (%)","name":"Solarhaus","production":"Erzeugung","consumption":"Verbrauch","battery":"Batterie","grid":"Netz","import":"Netzbezug","export":"Einspeisung","ev":"Wallbox","water_heater":"Warmwasserspeicher","autonomous":"Eigenversorgung","injecting":"Einspeisung","drawing":"Netzbezug","idle":"Ruhe","charging":"Laden","discharging":"Entladen","f_entity_solar":"Solarerzeugung (W)","f_entity_home":"Hausverbrauch (W, sonst berechnet)","f_entity_battery_power":"Batterieleistung (W, + = Laden)","f_entity_battery_soc":"Batteriestand (%)","f_entity_grid":"Netzleistung (W, + = Bezug, − = Einspeisung)","f_entity_grid_import":"Netzbezug (W, falls getrennt)","f_entity_grid_export":"Einspeisung (W, falls getrennt)","f_entity_ev":"Wallbox (W)","f_entity_water_heater":"Warmwasserspeicher (W)","f_battery_invert":"Vorzeichen der Batterie umkehren","f_grid_invert":"Vorzeichen des Netzes umkehren","f_max_power":"Volle Animationsgeschwindigkeit bei (W)","f_show_tiles":"Kacheln anzeigen","f_show_status":"Status anzeigen"},"es":{"f_battery_count":"Número de baterías (1-3)","f_entity_battery_2_power":"Batería 2: potencia","f_entity_battery_2_soc":"Batería 2: nivel de carga (%)","f_entity_battery_3_power":"Batería 3: potencia","f_entity_battery_3_soc":"Batería 3: nivel de carga (%)","car":"Coche","f_entity_car_soc":"Nivel de la batería del coche (%)","name":"Casa solar","production":"Producción","consumption":"Consumo","battery":"Batería","grid":"Red","import":"Consumo de red","export":"Inyección","ev":"Cargador VE","water_heater":"Termo","autonomous":"Autoconsumo","injecting":"Inyectando","drawing":"Consumiendo de la red","idle":"Reposo","charging":"Cargando","discharging":"Descargando","f_entity_solar":"Producción solar (W)","f_entity_home":"Consumo de la casa (W, si no se calcula)","f_entity_battery_power":"Potencia de la batería (W, + = carga)","f_entity_battery_soc":"Nivel de la batería (%)","f_entity_grid":"Potencia de red (W, + = consumo, − = inyección)","f_entity_grid_import":"Consumo de red (W, si separado)","f_entity_grid_export":"Inyección a red (W, si separada)","f_entity_ev":"Cargador VE (W)","f_entity_water_heater":"Termo (W)","f_battery_invert":"Invertir el signo de la batería","f_grid_invert":"Invertir el signo de la red","f_max_power":"Animación a velocidad máxima con (W)","f_show_tiles":"Mostrar mosaicos","f_show_status":"Mostrar estado"},"fr":{"f_battery_count":"Nombre de batteries (1 à 3)","f_entity_battery_2_power":"Batterie 2 : puissance","f_entity_battery_2_soc":"Batterie 2 : niveau de charge (%)","f_entity_battery_3_power":"Batterie 3 : puissance","f_entity_battery_3_soc":"Batterie 3 : niveau de charge (%)","car":"Voiture","f_entity_car_soc":"Niveau de la batterie de la voiture (%)","name":"Maison solaire","production":"Production","consumption":"Consommation","battery":"Batterie","grid":"Réseau","import":"Soutirage","export":"Injection","ev":"Borne de recharge","water_heater":"Chauffe-eau","autonomous":"Autoconsommation","injecting":"Injection","drawing":"Soutirage réseau","idle":"Repos","charging":"Charge","discharging":"Décharge","f_entity_solar":"Production solaire (W)","f_entity_home":"Consommation de la maison (W, sinon calculée)","f_entity_battery_power":"Puissance de la batterie (W, + = charge)","f_entity_battery_soc":"Niveau de la batterie (%)","f_entity_grid":"Puissance réseau (W, + = soutirage, − = injection)","f_entity_grid_import":"Soutirage réseau (W, si séparé)","f_entity_grid_export":"Injection réseau (W, si séparée)","f_entity_ev":"Borne de recharge (W)","f_entity_water_heater":"Chauffe-eau (W)","f_battery_invert":"Inverser le signe de la batterie","f_grid_invert":"Inverser le signe du réseau","f_show_negative":"Afficher les valeurs négatives avec leur signe","f_max_power":"Animation à pleine vitesse à (W)","f_show_tiles":"Afficher les tuiles","f_show_status":"Afficher l'état"},"hu":{"f_battery_count":"Akkumulátorok száma (1-3)","f_entity_battery_2_power":"2. akkumulátor: teljesítmény","f_entity_battery_2_soc":"2. akkumulátor: töltöttség (%)","f_entity_battery_3_power":"3. akkumulátor: teljesítmény","f_entity_battery_3_soc":"3. akkumulátor: töltöttség (%)","car":"Autó","f_entity_car_soc":"Az autó akkumulátorszintje (%)","name":"Napelemes ház","production":"Termelés","consumption":"Fogyasztás","battery":"Akkumulátor","grid":"Hálózat","import":"Hálózati vételezés","export":"Betáplálás","ev":"Töltőállomás","water_heater":"Vízmelegítő","autonomous":"Önellátó","injecting":"Betáplál","drawing":"Hálózatról vételez","idle":"Nyugalom","charging":"Töltés","discharging":"Kisütés","f_entity_solar":"Napelemes termelés (W)","f_entity_home":"Ház fogyasztása (W, különben számított)","f_entity_battery_power":"Akkumulátor teljesítmény (W, + = töltés)","f_entity_battery_soc":"Akkumulátor szint (%)","f_entity_grid":"Hálózati teljesítmény (W, + = vételezés, − = betáplálás)","f_entity_grid_import":"Hálózati vételezés (W, ha külön)","f_entity_grid_export":"Betáplálás (W, ha külön)","f_entity_ev":"Töltőállomás (W)","f_entity_water_heater":"Vízmelegítő (W)","f_battery_invert":"Akkumulátor előjelének megfordítása","f_grid_invert":"Hálózat előjelének megfordítása","f_max_power":"Teljes animációsebesség ennél (W)","f_show_tiles":"Csempék megjelenítése","f_show_status":"Állapot megjelenítése"},"it":{"f_battery_count":"Numero di batterie (1-3)","f_entity_battery_2_power":"Batteria 2: potenza","f_entity_battery_2_soc":"Batteria 2: livello di carica (%)","f_entity_battery_3_power":"Batteria 3: potenza","f_entity_battery_3_soc":"Batteria 3: livello di carica (%)","car":"Auto","f_entity_car_soc":"Livello batteria dell'auto (%)","name":"Casa solare","production":"Produzione","consumption":"Consumo","battery":"Batteria","grid":"Rete","import":"Prelievo","export":"Immissione","ev":"Wallbox","water_heater":"Scaldabagno","autonomous":"Autoconsumo","injecting":"Immissione","drawing":"Prelievo dalla rete","idle":"Riposo","charging":"In carica","discharging":"In scarica","f_entity_solar":"Produzione solare (W)","f_entity_home":"Consumo della casa (W, altrimenti calcolato)","f_entity_battery_power":"Potenza batteria (W, + = carica)","f_entity_battery_soc":"Livello batteria (%)","f_entity_grid":"Potenza di rete (W, + = prelievo, − = immissione)","f_entity_grid_import":"Prelievo di rete (W, se separato)","f_entity_grid_export":"Immissione in rete (W, se separata)","f_entity_ev":"Wallbox (W)","f_entity_water_heater":"Scaldabagno (W)","f_battery_invert":"Inverti il segno della batteria","f_grid_invert":"Inverti il segno della rete","f_max_power":"Animazione a piena velocità a (W)","f_show_tiles":"Mostra riquadri","f_show_status":"Mostra stato"},"nb":{"f_battery_count":"Antall batterier (1-3)","f_entity_battery_2_power":"Batteri 2: effekt","f_entity_battery_2_soc":"Batteri 2: ladenivå (%)","f_entity_battery_3_power":"Batteri 3: effekt","f_entity_battery_3_soc":"Batteri 3: ladenivå (%)","car":"Bil","f_entity_car_soc":"Bilens batterinivå (%)","name":"Solhus","production":"Produksjon","consumption":"Forbruk","battery":"Batteri","grid":"Nett","import":"Kjøp fra nettet","export":"Eksport","ev":"Ladestasjon","water_heater":"Varmtvannsbereder","autonomous":"Selvforsynt","injecting":"Eksporterer","drawing":"Kjøper fra nettet","idle":"Hvile","charging":"Lader","discharging":"Utlader","f_entity_solar":"Solproduksjon (W)","f_entity_home":"Husets forbruk (W, ellers beregnet)","f_entity_battery_power":"Batterieffekt (W, + = lading)","f_entity_battery_soc":"Batterinivå (%)","f_entity_grid":"Netteffekt (W, + = kjøp, − = eksport)","f_entity_grid_import":"Kjøp fra nettet (W, hvis separat)","f_entity_grid_export":"Eksport til nettet (W, hvis separat)","f_entity_ev":"Ladestasjon (W)","f_entity_water_heater":"Varmtvannsbereder (W)","f_battery_invert":"Snu batteriets fortegn","f_grid_invert":"Snu nettets fortegn","f_max_power":"Full animasjonshastighet ved (W)","f_show_tiles":"Vis ruter","f_show_status":"Vis status"},"nl":{"f_battery_count":"Aantal accu's (1-3)","f_entity_battery_2_power":"Accu 2: vermogen","f_entity_battery_2_soc":"Accu 2: laadniveau (%)","f_entity_battery_3_power":"Accu 3: vermogen","f_entity_battery_3_soc":"Accu 3: laadniveau (%)","car":"Auto","f_entity_car_soc":"Batterijniveau van de auto (%)","name":"Zonnehuis","production":"Opwekking","consumption":"Verbruik","battery":"Batterij","grid":"Net","import":"Netafname","export":"Teruglevering","ev":"Laadpaal","water_heater":"Boiler","autonomous":"Zelfvoorzienend","injecting":"Terugleveren","drawing":"Afname van het net","idle":"Rust","charging":"Laden","discharging":"Ontladen","f_entity_solar":"Zonne-opwekking (W)","f_entity_home":"Huisverbruik (W, anders berekend)","f_entity_battery_power":"Batterijvermogen (W, + = laden)","f_entity_battery_soc":"Batterijniveau (%)","f_entity_grid":"Netvermogen (W, + = afname, − = teruglevering)","f_entity_grid_import":"Netafname (W, indien apart)","f_entity_grid_export":"Teruglevering (W, indien apart)","f_entity_ev":"Laadpaal (W)","f_entity_water_heater":"Boiler (W)","f_battery_invert":"Teken van de batterij omkeren","f_grid_invert":"Teken van het net omkeren","f_max_power":"Volle animatiesnelheid bij (W)","f_show_tiles":"Tegels tonen","f_show_status":"Status tonen"},"pl":{"f_battery_count":"Liczba akumulatorów (1-3)","f_entity_battery_2_power":"Akumulator 2: moc","f_entity_battery_2_soc":"Akumulator 2: poziom naładowania (%)","f_entity_battery_3_power":"Akumulator 3: moc","f_entity_battery_3_soc":"Akumulator 3: poziom naładowania (%)","car":"Samochód","f_entity_car_soc":"Poziom baterii samochodu (%)","name":"Dom solarny","production":"Produkcja","consumption":"Zużycie","battery":"Bateria","grid":"Sieć","import":"Pobór z sieci","export":"Oddawanie","ev":"Ładowarka EV","water_heater":"Podgrzewacz wody","autonomous":"Autokonsumpcja","injecting":"Oddawanie do sieci","drawing":"Pobór z sieci","idle":"Spoczynek","charging":"Ładowanie","discharging":"Rozładowanie","f_entity_solar":"Produkcja solarna (W)","f_entity_home":"Zużycie domu (W, inaczej obliczane)","f_entity_battery_power":"Moc baterii (W, + = ładowanie)","f_entity_battery_soc":"Poziom baterii (%)","f_entity_grid":"Moc sieci (W, + = pobór, − = oddawanie)","f_entity_grid_import":"Pobór z sieci (W, jeśli osobno)","f_entity_grid_export":"Oddawanie do sieci (W, jeśli osobno)","f_entity_ev":"Ładowarka EV (W)","f_entity_water_heater":"Podgrzewacz wody (W)","f_battery_invert":"Odwróć znak baterii","f_grid_invert":"Odwróć znak sieci","f_max_power":"Pełna prędkość animacji przy (W)","f_show_tiles":"Pokaż kafelki","f_show_status":"Pokaż stan"},"pt-BR":{"f_battery_count":"Número de baterias (1-3)","f_entity_battery_2_power":"Bateria 2: potência","f_entity_battery_2_soc":"Bateria 2: nível de carga (%)","f_entity_battery_3_power":"Bateria 3: potência","f_entity_battery_3_soc":"Bateria 3: nível de carga (%)","car":"Carro","f_entity_car_soc":"Nível da bateria do carro (%)","name":"Casa solar","production":"Produção","consumption":"Consumo","battery":"Bateria","grid":"Rede","import":"Consumo da rede","export":"Injeção","ev":"Carregador VE","water_heater":"Aquecedor de água","autonomous":"Autoconsumo","injecting":"Injetando","drawing":"Consumindo da rede","idle":"Repouso","charging":"Carregando","discharging":"Descarregando","f_entity_solar":"Produção solar (W)","f_entity_home":"Consumo da casa (W, senão calculado)","f_entity_battery_power":"Potência da bateria (W, + = carga)","f_entity_battery_soc":"Nível da bateria (%)","f_entity_grid":"Potência da rede (W, + = consumo, − = injeção)","f_entity_grid_import":"Consumo da rede (W, se separado)","f_entity_grid_export":"Injeção na rede (W, se separada)","f_entity_ev":"Carregador VE (W)","f_entity_water_heater":"Aquecedor de água (W)","f_battery_invert":"Inverter o sinal da bateria","f_grid_invert":"Inverter o sinal da rede","f_show_negative":"Mostrar os valores negativos com o respectivo sinal","f_max_power":"Animação em velocidade máxima com (W)","f_show_tiles":"Mostrar blocos","f_show_status":"Mostrar estado"},"pt-PT":{"f_battery_count":"Número de baterias (1-3)","f_entity_battery_2_power":"Bateria 2: potência","f_entity_battery_2_soc":"Bateria 2: nível de carga (%)","f_entity_battery_3_power":"Bateria 3: potência","f_entity_battery_3_soc":"Bateria 3: nível de carga (%)","car":"Carro","f_entity_car_soc":"Nível da bateria do carro (%)","name":"Casa solar","production":"Produção","consumption":"Consumo","battery":"Bateria","grid":"Rede","import":"Consumo da rede","export":"Injeção","ev":"Carregador VE","water_heater":"Termoacumulador","autonomous":"Autoconsumo","injecting":"A injetar","drawing":"A consumir da rede","idle":"Repouso","charging":"A carregar","discharging":"A descarregar","f_entity_solar":"Produção solar (W)","f_entity_home":"Consumo da casa (W, senão calculado)","f_entity_battery_power":"Potência da bateria (W, + = carga)","f_entity_battery_soc":"Nível da bateria (%)","f_entity_grid":"Potência da rede (W, + = consumo, − = injeção)","f_entity_grid_import":"Consumo da rede (W, se separado)","f_entity_grid_export":"Injeção na rede (W, se separada)","f_entity_ev":"Carregador VE (W)","f_entity_water_heater":"Termoacumulador (W)","f_battery_invert":"Inverter o sinal da bateria","f_grid_invert":"Inverter o sinal da rede","f_show_negative":"Mostrar os valores negativos com o respetivo sinal","f_max_power":"Animação à velocidade máxima com (W)","f_show_tiles":"Mostrar blocos","f_show_status":"Mostrar estado"},"ro":{"f_battery_count":"Număr de baterii (1-3)","f_entity_battery_2_power":"Bateria 2: putere","f_entity_battery_2_soc":"Bateria 2: nivel de încărcare (%)","f_entity_battery_3_power":"Bateria 3: putere","f_entity_battery_3_soc":"Bateria 3: nivel de încărcare (%)","car":"Mașină","f_entity_car_soc":"Nivelul bateriei mașinii (%)","name":"Casă solară","production":"Producție","consumption":"Consum","battery":"Baterie","grid":"Rețea","import":"Consum din rețea","export":"Injecție","ev":"Stație de încărcare","water_heater":"Boiler","autonomous":"Autoconsum","injecting":"Injectează","drawing":"Consumă din rețea","idle":"Repaus","charging":"Se încarcă","discharging":"Se descarcă","f_entity_solar":"Producție solară (W)","f_entity_home":"Consumul casei (W, altfel calculat)","f_entity_battery_power":"Putere baterie (W, + = încărcare)","f_entity_battery_soc":"Nivel baterie (%)","f_entity_grid":"Putere rețea (W, + = consum, − = injecție)","f_entity_grid_import":"Consum din rețea (W, dacă separat)","f_entity_grid_export":"Injecție în rețea (W, dacă separat)","f_entity_ev":"Stație de încărcare (W)","f_entity_water_heater":"Boiler (W)","f_battery_invert":"Inversează semnul bateriei","f_grid_invert":"Inversează semnul rețelei","f_max_power":"Animație la viteză maximă la (W)","f_show_tiles":"Afișează plăcile","f_show_status":"Afișează starea"},"ru":{"f_battery_count":"Количество аккумуляторов (1-3)","f_entity_battery_2_power":"Аккумулятор 2: мощность","f_entity_battery_2_soc":"Аккумулятор 2: уровень заряда (%)","f_entity_battery_3_power":"Аккумулятор 3: мощность","f_entity_battery_3_soc":"Аккумулятор 3: уровень заряда (%)","car":"Автомобиль","f_entity_car_soc":"Уровень заряда автомобиля (%)","name":"Солнечный дом","production":"Генерация","consumption":"Потребление","battery":"Батарея","grid":"Сеть","import":"Потребление из сети","export":"Отдача","ev":"Зарядная станция","water_heater":"Водонагреватель","autonomous":"Самообеспечение","injecting":"Отдача в сеть","drawing":"Потребление из сети","idle":"Покой","charging":"Зарядка","discharging":"Разрядка","f_entity_solar":"Солнечная генерация (Вт)","f_entity_home":"Потребление дома (Вт, иначе вычисляется)","f_entity_battery_power":"Мощность батареи (Вт, + = заряд)","f_entity_battery_soc":"Уровень батареи (%)","f_entity_grid":"Мощность сети (Вт, + = потребление, − = отдача)","f_entity_grid_import":"Потребление из сети (Вт, если отдельно)","f_entity_grid_export":"Отдача в сеть (Вт, если отдельно)","f_entity_ev":"Зарядная станция (Вт)","f_entity_water_heater":"Водонагреватель (Вт)","f_battery_invert":"Инвертировать знак батареи","f_grid_invert":"Инвертировать знак сети","f_max_power":"Полная скорость анимации при (Вт)","f_show_tiles":"Показывать плитки","f_show_status":"Показывать состояние"},"sr":{"f_battery_count":"Број батерија (1-3)","f_entity_battery_2_power":"Батерија 2: снага","f_entity_battery_2_soc":"Батерија 2: ниво напуњености (%)","f_entity_battery_3_power":"Батерија 3: снага","f_entity_battery_3_soc":"Батерија 3: ниво напуњености (%)","car":"Аутомобил","f_entity_car_soc":"Ниво батерије аутомобила (%)","name":"Соларна кућа","production":"Производња","consumption":"Потрошња","battery":"Батерија","grid":"Мрежа","import":"Преузимање из мреже","export":"Предаја","ev":"Пуњач за ЕВ","water_heater":"Бојлер","autonomous":"Самоснабдевање","injecting":"Предаје у мрежу","drawing":"Преузима из мреже","idle":"Мировање","charging":"Пуњење","discharging":"Пражњење","f_entity_solar":"Соларна производња (W)","f_entity_home":"Потрошња куће (W, иначе израчуната)","f_entity_battery_power":"Снага батерије (W, + = пуњење)","f_entity_battery_soc":"Ниво батерије (%)","f_entity_grid":"Снага мреже (W, + = преузимање, − = предаја)","f_entity_grid_import":"Преузимање из мреже (W, ако је одвојено)","f_entity_grid_export":"Предаја у мрежу (W, ако је одвојено)","f_entity_ev":"Пуњач за ЕВ (W)","f_entity_water_heater":"Бојлер (W)","f_battery_invert":"Обрни знак батерије","f_grid_invert":"Обрни знак мреже","f_max_power":"Пуна брзина анимације при (W)","f_show_tiles":"Прикажи плочице","f_show_status":"Прикажи стање"},"sr-Latn":{"f_battery_count":"Broj baterija (1-3)","f_entity_battery_2_power":"Baterija 2: snaga","f_entity_battery_2_soc":"Baterija 2: nivo napunjenosti (%)","f_entity_battery_3_power":"Baterija 3: snaga","f_entity_battery_3_soc":"Baterija 3: nivo napunjenosti (%)","car":"Automobil","f_entity_car_soc":"Nivo baterije automobila (%)","name":"Solarna kuća","production":"Proizvodnja","consumption":"Potrošnja","battery":"Baterija","grid":"Mreža","import":"Preuzimanje iz mreže","export":"Predaja","ev":"Punjač za EV","water_heater":"Bojler","autonomous":"Samosnabdevanje","injecting":"Predaje u mrežu","drawing":"Preuzima iz mreže","idle":"Mirovanje","charging":"Punjenje","discharging":"Pražnjenje","f_entity_solar":"Solarna proizvodnja (W)","f_entity_home":"Potrošnja kuće (W, inače izračunata)","f_entity_battery_power":"Snaga baterije (W, + = punjenje)","f_entity_battery_soc":"Nivo baterije (%)","f_entity_grid":"Snaga mreže (W, + = preuzimanje, − = predaja)","f_entity_grid_import":"Preuzimanje iz mreže (W, ako je odvojeno)","f_entity_grid_export":"Predaja u mrežu (W, ako je odvojeno)","f_entity_ev":"Punjač za EV (W)","f_entity_water_heater":"Bojler (W)","f_battery_invert":"Obrni znak baterije","f_grid_invert":"Obrni znak mreže","f_max_power":"Puna brzina animacije pri (W)","f_show_tiles":"Prikaži pločice","f_show_status":"Prikaži stanje"},"uk":{"f_battery_count":"Кількість акумуляторів (1-3)","f_entity_battery_2_power":"Акумулятор 2: потужність","f_entity_battery_2_soc":"Акумулятор 2: рівень заряду (%)","f_entity_battery_3_power":"Акумулятор 3: потужність","f_entity_battery_3_soc":"Акумулятор 3: рівень заряду (%)","car":"Автомобіль","f_entity_car_soc":"Рівень заряду автомобіля (%)","name":"Сонячний дім","production":"Генерація","consumption":"Споживання","battery":"Батарея","grid":"Мережа","import":"Споживання з мережі","export":"Віддача","ev":"Зарядна станція","water_heater":"Водонагрівач","autonomous":"Самозабезпечення","injecting":"Віддача в мережу","drawing":"Споживання з мережі","idle":"Спокій","charging":"Заряджання","discharging":"Розряджання","f_entity_solar":"Сонячна генерація (Вт)","f_entity_home":"Споживання дому (Вт, інакше обчислюється)","f_entity_battery_power":"Потужність батареї (Вт, + = заряд)","f_entity_battery_soc":"Рівень батареї (%)","f_entity_grid":"Потужність мережі (Вт, + = споживання, − = віддача)","f_entity_grid_import":"Споживання з мережі (Вт, якщо окремо)","f_entity_grid_export":"Віддача в мережу (Вт, якщо окремо)","f_entity_ev":"Зарядна станція (Вт)","f_entity_water_heater":"Водонагрівач (Вт)","f_battery_invert":"Інвертувати знак батареї","f_grid_invert":"Інвертувати знак мережі","f_max_power":"Повна швидкість анімації при (Вт)","f_show_tiles":"Показувати плитки","f_show_status":"Показувати стан"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // couleurs des flux selon leur source : soleil (jaune), batterie (vert), réseau (violet)
  const COL = { solar: '#ffb300', battery: '#2fbf71', grid: '#8c6cf0', idle: '#c3cad3' };
  const THR = 10; // en dessous de 10 W, un flux est considéré comme nul

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.autonomous .badge{background:color-mix(in srgb,#2fbf71 22%,transparent);color:#2fbf71}
.injecting .badge{background:color-mix(in srgb,#ffb300 24%,transparent);color:#e0a000}
.drawing .badge{background:color-mix(in srgb,#8c6cf0 22%,transparent);color:#8c6cf0}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:auto;margin:6px auto 0;border-radius:12px;cursor:pointer}
/* ciel : clair le jour, bleu nuit la nuit */
.sky{transition:fill 1s}.night .sky{fill:#1b2440}
.sun{transition:opacity 1s}.night .sun{opacity:0}.moon{opacity:0;transition:opacity 1s}.night .moon{opacity:1}
.stars{opacity:0}.night .stars{opacity:.8}
.ray{transform-box:fill-box;transform-origin:center;animation:shspin 24s linear infinite}
.night .win{fill:#ffd36b}
/* câbles : gris au repos, couleur de la source quand l'énergie circule */
.cable{fill:none;stroke:#c3cad3;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:stroke .4s}
.cable.on{stroke-width:3.4}
.dot{filter:drop-shadow(0 0 3px currentColor)}
/* panneaux : reflet qui balaie quand ça produit */
.glint{opacity:0}.producing .glint{opacity:.55;animation:shglint 3.2s ease-in-out infinite}
.cell{transition:fill .6s}
/* batterie : niveau, voyant */
.blevel{transition:height .8s,y .8s,fill .4s}
/* étiquettes (légendes dynamiques) */
.pill rect{fill:#fff;stroke:rgba(0,0,0,.08)}.pill text{font:600 10px system-ui,-apple-system,Roboto,sans-serif;fill:#26313d}
.pill .k{font-weight:500;fill:#6b7784}
.night .pill rect{fill:#2a3350;stroke:rgba(255,255,255,.12)}.night .pill text{fill:#f1f4f8}.night .pill .k{fill:#aab4c2}
.pill.off{opacity:.55}
.lamp{opacity:0;transition:opacity .4s}.home-on .lamp{opacity:1}
.heat{opacity:0;transition:opacity .4s}.wh-on .heat{opacity:1;animation:shpulse 1.6s ease-in-out infinite}
.evled{fill:#9aa3ad}.ev-on .evled{fill:#38a8ff;filter:drop-shadow(0 0 3px #38a8ff);animation:shpulse 1.4s ease-in-out infinite}
.hide{display:none}
/* tuiles */
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .s{font-size:10px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile.hide,.tiles.hide{display:none}
.noanim *{animation:none!important}
@keyframes shspin{to{transform:rotate(360deg)}}
@keyframes shpulse{50%{opacity:.45}}
@keyframes shglint{0%{transform:translateX(-60px)}60%,100%{transform:translateX(120px)}}
`;

  // panneaux solaires sur le pan de toit (trapèze vu de face) : grille de 2 × 5 modules par interpolation bilinéaire
  const ROOF = { tl: [158, 64], tr: [272, 64], bl: [120, 116], br: [310, 116] };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const at = (u, v) => lerp(lerp(ROOF.tl, ROOF.tr, u), lerp(ROOF.bl, ROOF.br, u), v);
  const PANELS = (() => {
    const cols = 5, rows = 2, mu = .08, mv = .12, gu = .02, gv = .06, out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u0 = mu + c * ((1 - 2 * mu + gu) / cols), u1 = u0 + (1 - 2 * mu + gu) / cols - gu;
      const v0 = mv + r * ((1 - 2 * mv + gv) / rows), v1 = v0 + (1 - 2 * mv + gv) / rows - gv;
      const p = [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)];
      // lignes des cellules (3 horizontales, 2 verticales) pour l'aspect « module »
      const lines = [];
      for (let k = 1; k < 3; k++) { const a = at(u0 + (u1 - u0) * k / 3, v0), b = at(u0 + (u1 - u0) * k / 3, v1); lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`); }
      for (let k = 1; k < 4; k++) { const a = at(u0, v0 + (v1 - v0) * k / 4), b = at(u1, v0 + (v1 - v0) * k / 4); lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`); }
      out.push(`<path class="cell" d="M${p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z" fill="url(#shpv)" stroke="#9fb4c8" stroke-width=".8"/><path d="${lines.join('')}" stroke="#5d7a96" stroke-width=".35" opacity=".8"/>`);
    }
    return out.join('');
  })();

  // tracés des câbles (le sens « avant » va du premier au dernier point)
  const PATHS = {
    solar: 'M215 110 V134',                    // panneaux → tableau
    home: 'M204 146 H182',                     // tableau → pièce de vie (fenêtre gauche)
    battery: 'M204 154 H186 V200 H74',         // tableau → batterie (le long du sol)
    grid: 'M226 158 V184 H302 V132 L372 70',   // tableau → réseau (poteau)
    ev: 'M222 158 V198 H332',                  // tableau → borne
    water: 'M226 146 H254',                    // tableau → chauffe-eau (fenêtre droite)
  };

  // une à trois batteries côte à côte (zone x = 6 à 74) ; chaque batterie a son niveau, son éclair de charge et, si plusieurs, son pourcentage
  const BATTS = (n) => {
    const span = 68, gap = n > 1 ? 4 : 0, w = n === 1 ? 34 : (span - gap * (n - 1)) / n, x0 = n === 1 ? 40 : 6, out = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (w + gap), pad = n === 1 ? 6 : 4, iw = w - 2 * pad, cx = x + w / 2;
      out.push(`<g><rect x="${x.toFixed(1)}" y="146" width="${w.toFixed(1)}" height="62" rx="5" fill="url(#shbatt)" stroke="#aab4bf"/>
    <rect x="${(x + pad).toFixed(1)}" y="156" width="${iw.toFixed(1)}" height="44" rx="3" fill="#dfe5ea"/><rect class="blevel" data-i="${i}" x="${(x + pad).toFixed(1)}" y="200" width="${iw.toFixed(1)}" height="0" rx="3" fill="#2fbf71"/>
    <rect x="${(cx - 5).toFixed(1)}" y="150" width="10" height="2.4" rx="1.2" fill="#9aa3ad"/>
    <path class="bbolt" data-i="${i}" d="M0 0l-5 9h4l-2 7 6-10h-4z" transform="translate(${(cx).toFixed(1)} 166)" fill="#fff" opacity=".9"/>
    ${n > 1 ? `<text class="bsoc" data-i="${i}" x="${cx.toFixed(1)}" y="190" text-anchor="middle" font-size="8" font-weight="700" fill="#4b5560"></text>` : ''}</g>`);
    }
    return out.join('');
  };

  const SCENE = () => `<svg viewBox="0 0 400 226" role="img">
  <defs>
    <linearGradient id="shsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8ff"/><stop offset="1" stop-color="#f2f8ff"/></linearGradient>
    <linearGradient id="shpv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b4a73"/><stop offset=".55" stop-color="#1c3252"/><stop offset="1" stop-color="#2f5687"/></linearGradient>
    <linearGradient id="shroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b65a3c"/><stop offset="1" stop-color="#8f4027"/></linearGradient>
    <linearGradient id="shwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf6ee"/><stop offset="1" stop-color="#efe6d8"/></linearGradient>
    <linearGradient id="shbatt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe5"/></linearGradient>
    <linearGradient id="shglint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="shroofclip"><path d="M${ROOF.tl.join(' ')}L${ROOF.tr.join(' ')}L${ROOF.br.join(' ')}L${ROOF.bl.join(' ')}Z"/></clipPath>
  </defs>
  <rect class="sky" width="400" height="226" fill="url(#shsky)"/>
  <g class="stars" fill="#fff">${[[30, 20], [70, 46], [110, 18], [300, 24], [340, 48], [250, 14], [180, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>
  <g class="sun"><g class="ray" stroke="#ffc533" stroke-width="2.2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="44" y1="14" x2="44" y2="19" transform="rotate(${a} 44 36)"/>`).join('')}</g><circle cx="44" cy="36" r="12" fill="#ffc533"/></g>
  <path class="moon" d="M50 24a13 13 0 1 0 8 22a11 11 0 1 1 -8 -22z" fill="#f4e7b5"/>
  <!-- sol -->
  <rect y="208" width="400" height="18" fill="#cfe3b4"/><rect y="208" width="400" height="3" fill="#b5d095"/>
  <!-- maison : murs, toit, panneaux -->
  <rect x="120" y="116" width="190" height="94" fill="url(#shwall)" stroke="#d9ccb8"/>
  <path d="M104 118 L158 62 L272 62 L326 118 Z" fill="url(#shroof)"/><path d="M104 118 L326 118" stroke="#7b3720" stroke-width="3" stroke-linecap="round"/>
  ${PANELS}
  <g clip-path="url(#shroofclip)"><rect class="glint" x="120" y="60" width="40" height="60" fill="url(#shglint)" transform="skewX(-20)"/></g>
  <!-- fenêtre gauche (pièce de vie, lampe) et fenêtre droite (chauffe-eau) -->
  <rect class="win" x="136" y="140" width="46" height="32" rx="2" fill="#dbe9f5" stroke="#b8c7d4"/><path d="M159 140v32M136 156h46" stroke="#b8c7d4"/>
  <g class="lamp"><path d="M159 141v5" stroke="#6b7784"/><path d="M153 146h12l-3 5h-6z" fill="#ffcf5a"/><circle cx="159" cy="154" r="9" fill="#ffd36b" opacity=".35"/></g>
  <rect class="win" x="254" y="140" width="40" height="32" rx="2" fill="#dbe9f5" stroke="#b8c7d4"/>
  <g class="whg"><rect x="266" y="142" width="16" height="28" rx="7" fill="#f7f9fb" stroke="#aab4bf"/><circle cx="274" cy="153" r="3.2" fill="none" stroke="#7b8794" stroke-width=".9"/>
    <rect class="heat" x="268" y="161" width="12" height="6" rx="3" fill="#ff7043"/></g>
  <!-- porte -->
  <rect x="190" y="172" width="22" height="38" rx="2" fill="#a8744f"/><circle cx="207" cy="191" r="1.3" fill="#f1d9a6"/>
  <!-- tableau électrique / onduleur -->
  <rect x="204" y="134" width="22" height="24" rx="3" fill="#ffffff" stroke="#9aa3ad"/><path d="M209 141h12M209 146h12M209 151h7" stroke="#c3cad3" stroke-width="1.6" stroke-linecap="round"/><circle cx="221" cy="151" r="1.5" fill="#2fbf71"/>
  <!-- compteur (Linky) sur le mur droit -->
  <rect x="296" y="166" width="12" height="16" rx="2" fill="#e8f3d8" stroke="#9ab27a"/><rect x="298.5" y="169" width="7" height="4" rx="1" fill="#2c3a22"/>
  <!-- batterie(s) de stockage : dessinées dynamiquement (battery_count) -->
  <g class="batt" id="battg"></g>
  <!-- borne de recharge -->
  <g class="evg"><rect x="330" y="164" width="16" height="44" rx="3" fill="#3a4047"/><rect x="332" y="168" width="12" height="20" rx="2" fill="#f2f4f6"/><rect class="evled" x="335.5" y="171" width="5" height="10" rx="2"/>
    <path d="M346 186c8 2 8 12 0 14" fill="none" stroke="#2b3036" stroke-width="2"/></g>
  <!-- poteau électrique (réseau) -->
  <g class="pole"><rect x="369" y="60" width="6" height="150" fill="#8d6e55"/><rect x="352" y="64" width="40" height="5" rx="1.5" fill="#7a5d47"/>
    ${[356, 372, 388].map((x) => `<rect x="${x - 2}" y="58" width="4" height="7" rx="1.5" fill="#cfd8e3"/>`).join('')}
    <path d="M388 60 Q396 66 404 62M356 60 Q348 66 340 64" stroke="#55606b" stroke-width=".8" fill="none"/></g>
  <!-- câbles et flux -->
  ${Object.entries(PATHS).map(([k, d]) => `<path id="fp-${k}" class="cable c-${k}" d="${d}"/>`).join('')}
  <g id="dots"></g>
  <!-- légendes dynamiques -->
  ${[['solar', 215, 44], ['battery', 57, 132], ['grid', 344, 44]].map(([k, x, y]) =>
    `<g class="pill p-${k}" transform="translate(${x} ${y})"><rect x="-27" y="-9" width="54" height="16" rx="8"/><text class="k" x="0" y="-12" text-anchor="middle" font-size="8"></text><text class="v" x="0" y="2.5" text-anchor="middle"></text></g>`).join('')}
  ${[['home', 159, 128, 'M2 7l5-4.5 5 4.5v5H8.5V9h-3v3H2z'], ['water', 274, 128, 'M7 1.5C4.4 4.8 3 6.8 3 8.5a4 4 0 0 0 8 0c0-1.7-1.4-3.7-4-7z'], ['ev', 338, 217, 'M8 1L3.5 7.5h3l-1 4.5L10 5.5H7z']].map(([k, x, y, ic]) =>
    `<g class="pill p-${k}" transform="translate(${x} ${y})"><rect x="-27" y="-8" width="54" height="15" rx="7.5"/><path d="${ic}" fill="#ffb300" transform="translate(-24 -6.5)"/><text class="k" x="0" y="0" font-size="0"></text><text class="v" x="5" y="3" text-anchor="middle"></text></g>`).join('')}
</svg>`;

  const TILES = [['production', 'mdi:solar-power-variant'], ['consumption', 'mdi:home-lightning-bolt-outline'], ['battery', 'mdi:home-battery-outline'], ['grid', 'mdi:transmission-tower'], ['ev', 'mdi:ev-station'], ['water', 'mdi:water-boiler']];

  class ApplianceSolarHouseCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const S = (hass && hass.states) || {}, ids = Object.keys(S), pw = (i) => i.startsWith('sensor.') && (S[i].attributes || {}).device_class === 'power';
      return { entity_solar: ids.find((i) => pw(i) && /(solar|pv|photo|production|onduleur|inverter)/i.test(i)) || '',
        entity_grid: ids.find((i) => pw(i) && /(grid|reseau|linky|net)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { max_power: 6000, show_tiles: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // puissance d'une entité en W (kW et MW convertis), NaN si absente ou indisponible
    _w(id) {
      const s = id && this._hass.states[id];
      if (!s || /^(unavailable|unknown|none|)$/i.test(String(s.state))) return NaN;
      const v = parseFloat(String(s.state).replace(',', '.')); if (!isFinite(v)) return NaN;
      const u = String((s.attributes && s.attributes.unit_of_measurement) || 'W').trim();
      return v * ({ kW: 1000, MW: 1e6, mW: 1e-3 }[u] || 1);
    }
    _fmt(w) {
      if (!isFinite(w)) return '--';
      const loc = window.applianceLocale(this._c, this._hass), a = Math.abs(w);
      return a >= 1000 ? `${(w / 1000).toLocaleString(loc, { maximumFractionDigits: a >= 10000 ? 1 : 2, minimumFractionDigits: 1 })} kW` : `${Math.round(w).toLocaleString(loc)} W`;
    }

    // bilan des puissances (W) ; les entités manquantes valent 0, la consommation est calculée si elle n'est pas fournie
    _compute() {
      const c = this._c, z = (v) => (isFinite(v) ? v : 0);
      const sol = Math.max(0, z(this._w(c.entity_solar)));
      let batt = this._w(c.entity_battery_power); if (isFinite(batt) && c.battery_invert) batt = -batt;
      let grid = this._w(c.entity_grid); if (isFinite(grid) && c.grid_invert) grid = -grid;
      if (!isFinite(grid) && (c.entity_grid_import || c.entity_grid_export)) grid = z(this._w(c.entity_grid_import)) - z(this._w(c.entity_grid_export));
      const ev = Math.max(0, z(this._w(c.entity_ev))), wh = Math.max(0, z(this._w(c.entity_water_heater)));
      let home = this._w(c.entity_home);
      // une consommation ne peut pas être négative (pince ampèremétrique qui oscille autour de 0…) : négatif = 0, sauf show_negative: true (valeur affichée avec son signe)
      if (isFinite(home) && !c.show_negative) home = Math.max(0, home);
      // consommation calculée : production + soutirage + décharge − injection − charge − borne − ballon
      if (!isFinite(home)) home = Math.max(0, sol + z(grid) - z(batt) - ev - wh);
      // plusieurs batteries (battery_count, 1 à 3) : soit chacune a ses entités (entity_battery_2_power / _soc…), la puissance totale est alors la somme
      // et le niveau la moyenne ; soit elles reflètent toutes les entités uniques (capteurs combinés)
      const MAXB = 3, inv = (x) => (isFinite(x) && c.battery_invert ? -x : x), socOf = (id) => { const st = id && this._hass.states[id]; const x = st ? parseFloat(st.state) : NaN; return x; };
      const idx = [2, 3].filter((i) => c[`entity_battery_${i}_power`] || c[`entity_battery_${i}_soc`]);
      const own = idx.length > 0, nb = Math.max(1, Math.min(MAXB, Math.round(Number(c.battery_count)) || 1, MAXB));
      const count = own ? Math.max(nb, ...idx) : nb;
      const bats = [];
      for (let i = 1; i <= count; i++) {
        const pid = i === 1 ? c.entity_battery_power : c[`entity_battery_${i}_power`], sid = i === 1 ? c.entity_battery_soc : c[`entity_battery_${i}_soc`];
        const w = own ? inv(this._w(pid)) : batt, sc = own ? socOf(sid) : socOf(c.entity_battery_soc);
        bats.push({ w, soc: sc });
      }
      if (own) { const ws = bats.map((x) => x.w).filter(isFinite); if (ws.length) batt = ws.reduce((x, y) => x + y, 0); }
      const socs = bats.map((x) => x.soc).filter(isFinite);
      const soc = socs.length ? socs.reduce((x, y) => x + y, 0) / socs.length : NaN;
      const carS = c.entity_car_soc && this._hass.states[c.entity_car_soc], car = carS ? parseFloat(carS.state) : NaN;
      const sun = this._hass.states['sun.sun'];
      const night = sun ? sun.state === 'below_horizon' : sol < THR;
      return { sol, batt, grid, ev, wh, home, soc, car, night, bats, hasBatt: !!(c.entity_battery_power || c.entity_battery_soc || bats.some((x) => isFinite(x.w) || isFinite(x.soc))), hasGrid: isFinite(grid), hasEv: !!(c.entity_ev || c.entity_car_soc), hasWh: !!c.entity_water_heater };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        ${SCENE()}
        <div class="tiles" id="shtiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div><div class="s"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_solar));
      const ENT = { production: 'entity_solar', consumption: 'entity_home', battery: 'entity_battery_soc', grid: 'entity_grid', ev: 'entity_ev', water: 'entity_water_heater' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c, k = el.dataset.k;
        this._more(c[ENT[k]] || (k === 'battery' && c.entity_battery_power) || (k === 'grid' && (c.entity_grid_import || c.entity_grid_export)) || c.entity_solar);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._sig = ''; this._nB = null; this._built = true;
    }

    // points lumineux : 3 par flux actif, sens et vitesse selon la puissance ; reconstruits seulement quand un flux change
    _flows(F) {
      const max = Number(this._c.max_power) > 0 ? Number(this._c.max_power) : 6000;
      const dur = (w) => Math.max(.7, 3.4 - 2.7 * Math.min(1, Math.abs(w) / max));
      const sig = JSON.stringify(F.map((f) => [f.k, f.rev, f.col, Math.round(dur(f.w) * 10)]));
      const r = this._root;
      Object.keys(PATHS).forEach((k) => { const f = F.find((x) => x.k === k), p = r.querySelector(`.c-${k}`); p.classList.toggle('on', !!f); p.style.stroke = f ? f.col : ''; });
      if (sig === this._sig) return;
      this._sig = sig;
      r.getElementById('dots').innerHTML = F.map((f) => {
        const d = dur(f.w).toFixed(2);
        return [0, 1, 2].map((i) => `<circle class="dot" r="3.2" fill="${f.col}" style="color:${f.col}"><animateMotion dur="${d}s" repeatCount="indefinite" begin="${(-i * d / 3).toFixed(2)}s" keyPoints="${f.rev ? '1;0' : '0;1'}" keyTimes="0;1" calcMode="linear"><mpath href="#fp-${f.k}"/></animateMotion></circle>`).join('');
      }).join('');
    }

    _pill(k, label, value, on, show = true) {
      const g = this._root.querySelector(`.p-${k}`); if (!g) return;
      g.classList.toggle('hide', !show); g.classList.toggle('off', !on);
      g.querySelector('.k').textContent = label; g.querySelector('.v').textContent = value;
      const ico = !!g.querySelector('path'), w = Math.max(ico ? 50 : 54, value.length * 6.2 + (ico ? 24 : 14)); const rc = g.querySelector('rect'); rc.setAttribute('width', w); rc.setAttribute('x', -w / 2);
      g.querySelector('.k').style.display = ico ? 'none' : ''; // pastilles à icône (maison, ballon, borne) : pas de libellé au-dessus
      if (ico) { g.querySelector('path').setAttribute('transform', `translate(${(-w / 2 + 4).toFixed(1)} -6.5)`); g.querySelector('.v').setAttribute('x', '6'); }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, v = this._compute();
      const exp = v.hasGrid && v.grid < -THR, imp = v.hasGrid && v.grid > THR, chg = v.hasBatt && v.batt > THR, dis = v.hasBatt && v.batt < -THR;
      const st = exp ? 'injecting' : imp ? 'drawing' : v.sol > THR ? 'autonomous' : 'idle';
      card.className = `${st}${v.night ? ' night' : ''}${v.sol > THR ? ' producing' : ''}${v.home > THR ? ' home-on' : ''}${v.ev > THR ? ' ev-on' : ''}${v.wh > THR ? ' wh-on' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('shtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('shbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      // éléments facultatifs masqués si l'entité n'est pas configurée
      r.querySelector('.batt').classList.toggle('hide', !v.hasBatt); r.querySelector('.c-battery').classList.toggle('hide', !v.hasBatt);
      r.querySelector('.evg').classList.toggle('hide', !v.hasEv); r.querySelector('.c-ev').classList.toggle('hide', !v.hasEv);
      r.querySelector('.whg').classList.toggle('hide', !v.hasWh); r.querySelector('.c-water').classList.toggle('hide', !v.hasWh);
      // niveau de la batterie (vert, orange sous 30 %, rouge sous 15 %)
      const nB = v.bats.length, many = nB > 1;
      if (this._nB !== nB) { this._nB = nB; r.getElementById('battg').innerHTML = BATTS(nB); r.querySelector('.p-battery').setAttribute('transform', `translate(${nB === 1 ? 57 : 40} 132)`); }
      v.bats.forEach((b, i) => {
        const soc = isFinite(b.soc) ? Math.max(0, Math.min(100, b.soc)) : 50, lv = r.querySelector(`.blevel[data-i="${i}"]`), hh = 44 * soc / 100;
        lv.setAttribute('y', (200 - hh).toFixed(1)); lv.setAttribute('height', hh.toFixed(1)); lv.setAttribute('fill', soc < 15 ? '#ef5350' : soc < 30 ? '#ffa726' : '#2fbf71');
        r.querySelector(`.bbolt[data-i="${i}"]`).style.opacity = isFinite(b.w) && b.w > THR ? '.95' : '0';
        const tx = r.querySelector(`.bsoc[data-i="${i}"]`); if (tx) tx.textContent = isFinite(b.soc) ? `${Math.round(b.soc)}` : '';
      });
      // source dominante des consommateurs : soleil, sinon batterie, sinon réseau
      const src = v.sol > THR ? COL.solar : dis ? COL.battery : imp ? COL.grid : COL.solar;
      const F = [];
      if (v.sol > THR) F.push({ k: 'solar', w: v.sol, col: COL.solar });
      if (v.home > THR) F.push({ k: 'home', w: v.home, col: src });
      if (chg) F.push({ k: 'battery', w: v.batt, col: v.sol > THR ? COL.solar : COL.grid });
      if (dis) F.push({ k: 'battery', w: v.batt, col: COL.battery, rev: true });
      if (exp) F.push({ k: 'grid', w: v.grid, col: v.sol > THR ? COL.solar : COL.battery });
      if (imp) F.push({ k: 'grid', w: v.grid, col: COL.grid, rev: true });
      if (v.ev > THR) F.push({ k: 'ev', w: v.ev, col: src });
      if (v.wh > THR) F.push({ k: 'water', w: v.wh, col: src });
      this._flows(F);
      // légendes dynamiques
      this._pill('solar', this._l('production'), this._fmt(v.sol), v.sol > THR);
      this._pill('home', this._l('consumption'), this._fmt(v.home), v.home > THR);
      this._pill('battery', isFinite(v.soc) ? `${this._l('battery')} ${Math.round(v.soc)} %` : this._l('battery'), isFinite(v.batt) ? `${chg ? '+' : dis ? '−' : ''}${this._fmt(Math.abs(v.batt))}` : '--', chg || dis, v.hasBatt);
      // réseau : valeur sans signe (le libellé donne le sens), ou avec son signe (+ import, − export) si show_negative: true
      const gv = this._c.show_negative ? v.grid : Math.abs(v.grid);
      this._pill('grid', exp ? this._l('export') : imp ? this._l('import') : this._l('grid'), v.hasGrid ? this._fmt(gv) : '--', exp || imp, v.hasGrid);
      this._pill('ev', this._l('ev'), `${isFinite(v.car) ? `${Math.round(v.car)} % · ` : ''}${this._fmt(v.ev)}`, v.ev > THR || isFinite(v.car), v.hasEv);
      const evTxt = r.querySelector('.p-ev .v'); if (evTxt) evTxt.style.fill = isFinite(v.car) && v.car < 20 ? (v.car < 10 ? '#e53935' : '#ef8a00') : '';
      this._pill('water', this._l('water_heater'), this._fmt(v.wh), v.wh > THR, v.hasWh);
      // tuiles
      const tiles = r.getElementById('shtiles'); tiles.classList.toggle('hide', c.show_tiles === false);
      const set = (k, show, val, sub) => { const el = r.querySelector(`.tile[data-k="${k}"]`); el.classList.toggle('hide', !show); el.querySelector('.lbl').textContent = this._l(k === 'water' ? 'water_heater' : k); el.querySelector('.v').textContent = val; el.querySelector('.s').textContent = sub || ''; };
      set('production', true, this._fmt(v.sol));
      set('consumption', true, this._fmt(v.home));
      set('battery', v.hasBatt, isFinite(v.soc) ? `${Math.round(v.soc)} %` : this._fmt(v.batt), chg ? `${this._t('charging')} ${this._fmt(v.batt)}` : dis ? `${this._t('discharging')} ${this._fmt(-v.batt)}` : '');
      set('grid', v.hasGrid, this._fmt(gv), exp ? this._t('export') : imp ? this._t('import') : '');
      set('ev', v.hasEv, this._fmt(v.ev), isFinite(v.car) ? `${this._t('car')} ${Math.round(v.car)} %` : '');
      const evSub = r.querySelector('.tile[data-k="ev"] .s'); if (evSub) evSub.style.color = isFinite(v.car) && v.car < 20 ? (v.car < 10 ? '#e53935' : '#ef8a00') : ''; set('water', v.hasWh, this._fmt(v.wh));
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceSolarHouseCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSolarHouseCardEditor extends HTMLElement {
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
      const pw = (name) => ({ name, selector: { entity: { domain: 'sensor', device_class: 'power' } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        pw('entity_solar'), pw('entity_home'),
        pw('entity_battery_power'), { name: 'entity_battery_soc', selector: { entity: { domain: 'sensor' } } },
        { name: 'battery_count', default: 1, selector: { number: { min: 1, max: 3, step: 1, mode: 'box' } } },
        pw('entity_battery_2_power'), { name: 'entity_battery_2_soc', selector: { entity: { domain: 'sensor' } } },
        pw('entity_battery_3_power'), { name: 'entity_battery_3_soc', selector: { entity: { domain: 'sensor' } } },
        pw('entity_grid'), pw('entity_grid_import'), pw('entity_grid_export'),
        pw('entity_ev'), { name: 'entity_car_soc', selector: { entity: { domain: 'sensor' } } }, pw('entity_water_heater'),
        { type: 'grid', name: '', schema: [bool('battery_invert', false), bool('grid_invert', false), bool('show_negative', false),
          { name: 'max_power', default: 6000, selector: { number: { min: 500, max: 50000, step: 100, mode: 'box', unit_of_measurement: 'W' } } }] },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_tiles'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceSolarHouseCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Schéma animé d\'une maison solaire : panneaux sur le toit, batterie, réseau (poteaux), borne et chauffe-eau, avec des points lumineux qui suivent le sens et la puissance de l\'énergie.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/solar-house.md',
  });
})();
