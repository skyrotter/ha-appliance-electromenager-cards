/* Carte « NAS » — custom:appliance-nas-card (photos détourées : Synology DS423+ / DS925+, TerraMaster F4-423 / F4-425, UGREEN DXP4800 Plus / iDX6011 Pro, QNAP TS-251+ / TS-253, Synology DS224+ / DS1525+, Asustor 2 / 4 / 6 baies)
 * Intégrations Synology DSM, TerraMaster TNAS et Unraid (UGREEN) : un ou plusieurs volumes, 4 ou 6 disques (état ou capteur « problème » + température),
 * 2 SSD NVMe facultatifs, CPU, RAM, température, débits,
 * sécurité, mise à jour DSM. Animations : LED des disques qui clignotent selon l'activité, faisceau
 * de lecture qui balaie les baies, paquets qui volent vers l'anneau du volume (écriture) ou en
 * repartent (lecture), baie en défaut qui pulse en rouge, LED STATUS orange qui clignote en alerte,
 * bouton bleu qui respire, chaleur au-dessus du boîtier en surchauffe.
 * États : off, idle, running, busy, warning, unavailable.
 */
(() => {
  const TAG = 'appliance-nas-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"model_generic_1":"Generic NAS (1 bay)","model_generic_2":"Generic NAS (2 bays)","model_generic_4":"Generic NAS (4 bays)","model_generic_5":"Generic NAS (5 bays)","model_generic_6":"Generic NAS (6 bays)","model_generic_8":"Generic NAS (8 bays)","name":"NAS","off":"Off","idle":"Idle","running":"Running","busy":"Active","warning":"Warning","unavailable":"Unavailable","volume":"Volume","free":"Free space","go":"GB","to":"TB","uptime":"Uptime","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperature","disks":"Disks","disk":"Disk","down":"Download","up":"Upload","power":"Power","volume_alert":"Volume degraded","drive_alert":"Disk {n}: problem","hot":"Overheating","volume_full":"Volume almost full","security":"Security warning","update":"⬆ DSM update available","model_synology_ds423":"Synology DS423+ (4 bays)","model_synology_ds925":"Synology DS925+ (4 bays)","model_terramaster_f4_423":"TerraMaster F4-423 (4 bays)","model_terramaster_f4_425":"TerraMaster F4-425 (4 bays)","model_terramaster_f6_424":"TerraMaster F6-424 (6 bays)","model_qnap_ts251":"QNAP TS-251+ (2 bays)","model_qnap_ts253":"QNAP TS-253 (2 bays)","model_asustor_2bay":"Asustor NAS (2 bays)","model_asustor_4bay":"Asustor NAS (4 bays)","model_asustor_6bay":"Asustor NAS (6 bays)","model_synology_ds1525":"Synology DS1525+ (5 bays)","model_synology_ds224":"Synology DS224+ (2 bays)","model_synology_ds1812":"Synology DS1812+ (8 bays)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 bays)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 bays)","parity_alert":"Parity invalid","flash_alert":"USB flash: problem","nvme_alert":"SSD {n}: problem"},"cs":{"name":"NAS","off":"Vypnuto","idle":"Nečinný","running":"Běží","busy":"Aktivní","warning":"Varování","unavailable":"Nedostupné","volume":"Svazek","free":"Volné místo","uptime":"Doba běhu","d":"d","cpu":"CPU","ram":"RAM","temp":"Teplota","disks":"Disky","disk":"Disk","down":"Stahování","up":"Odesílání","power":"Výkon","volume_alert":"Svazek je degradovaný","drive_alert":"Disk {n}: problém","hot":"Přehřívání","volume_full":"Svazek téměř plný","security":"Varování zabezpečení","update":"⬆ K dispozici aktualizace DSM"},"da":{"name":"NAS","off":"Slukket","idle":"Inaktiv","running":"Kører","busy":"Aktiv","warning":"Advarsel","unavailable":"Utilgængelig","volume":"Volumen","free":"Ledig plads","go":"GB","to":"TB","uptime":"Oppetid","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatur","disks":"Diske","disk":"Disk","down":"Download","up":"Upload","power":"Effekt","volume_alert":"Volumen degraderet","drive_alert":"Disk {n}: problem","hot":"Overophedning","volume_full":"Volumen næsten fuld","security":"Sikkerhedsadvarsel","update":"⬆ DSM-opdatering tilgængelig","model_synology_ds423":"Synology DS423+ (4 båse)","model_synology_ds925":"Synology DS925+ (4 båse)","model_terramaster_f4_423":"TerraMaster F4-423 (4 båse)","model_terramaster_f4_425":"TerraMaster F4-425 (4 båse)","model_terramaster_f6_424":"TerraMaster F6-424 (6 båse)","model_qnap_ts251":"QNAP TS-251+ (2 båse)","model_qnap_ts253":"QNAP TS-253 (2 båse)","model_synology_ds224":"Synology DS224+ (2 båse)","model_synology_ds1812":"Synology DS1812+ (8 båse)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 båse)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 båse)","parity_alert":"Paritet ugyldig","flash_alert":"USB-flash: problem","nvme_alert":"SSD {n}: problem"},"de":{"name":"NAS","off":"Aus","idle":"Leerlauf","running":"Läuft","busy":"Sehr aktiv","warning":"Warnung","unavailable":"Nicht verfügbar","volume":"Volume","free":"Freier Speicher","uptime":"Laufzeit","d":"T","cpu":"CPU","ram":"RAM","temp":"Temperatur","disks":"Festplatten","disk":"Festplatte","down":"Download","up":"Upload","power":"Leistung","volume_alert":"Volume beeinträchtigt","drive_alert":"Festplatte {n}: Problem","hot":"Überhitzung","volume_full":"Volume fast voll","security":"Sicherheitswarnung","update":"⬆ DSM-Update verfügbar","go":"GB","to":"TB","model_synology_ds423":"Synology DS423+ (4 Schächte)","model_synology_ds925":"Synology DS925+ (4 Schächte)","model_terramaster_f4_423":"TerraMaster F4-423 (4 Schächte)","model_terramaster_f4_425":"TerraMaster F4-425 (4 Schächte)","model_terramaster_f6_424":"TerraMaster F6-424 (6 Schächte)","model_qnap_ts251":"QNAP TS-251+ (2 Schächte)","model_qnap_ts253":"QNAP TS-253 (2 Schächte)","model_synology_ds224":"Synology DS224+ (2 Schächte)","model_synology_ds1812":"Synology DS1812+ (8 Schächte)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 Schächte)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 Schächte)","parity_alert":"Parität ungültig","flash_alert":"USB-Stick: Problem","nvme_alert":"SSD {n}: Problem"},"es":{"model_generic_1":"NAS genérico (1 bahía)","model_generic_2":"NAS genérico (2 bahías)","model_generic_4":"NAS genérico (4 bahías)","model_generic_5":"NAS genérico (5 bahías)","model_generic_6":"NAS genérico (6 bahías)","model_generic_8":"NAS genérico (8 bahías)","name":"NAS","off":"Apagado","idle":"Inactivo","running":"En marcha","busy":"Activo","warning":"Aviso","unavailable":"No disponible","volume":"Volumen","free":"Espacio libre","go":"GB","to":"TB","uptime":"Tiempo en marcha","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Discos","disk":"Disco","down":"Descarga","up":"Subida","power":"Potencia","volume_alert":"Volumen degradado","drive_alert":"Disco {n}: problema","hot":"Sobrecalentamiento","volume_full":"Volumen casi lleno","security":"Aviso de seguridad","update":"⬆ Actualización de DSM disponible","model_synology_ds423":"Synology DS423+ (4 bahías)","model_synology_ds925":"Synology DS925+ (4 bahías)","model_terramaster_f4_423":"TerraMaster F4-423 (4 bahías)","model_terramaster_f4_425":"TerraMaster F4-425 (4 bahías)","model_terramaster_f6_424":"TerraMaster F6-424 (6 bahías)","model_qnap_ts251":"QNAP TS-251+ (2 bahías)","model_qnap_ts253":"QNAP TS-253 (2 bahías)","model_asustor_2bay":"NAS Asustor (2 bahías)","model_asustor_4bay":"NAS Asustor (4 bahías)","model_asustor_6bay":"NAS Asustor (6 bahías)","model_synology_ds1525":"Synology DS1525+ (5 bahías)","model_synology_ds224":"Synology DS224+ (2 bahías)","model_synology_ds1812":"Synology DS1812+ (8 bahías)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 bahías)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 bahías)","parity_alert":"Paridad no válida","flash_alert":"USB flash: problema","nvme_alert":"SSD {n}: problema"},"fr":{"model_generic_1":"NAS générique (1 baie)","model_generic_2":"NAS générique (2 baies)","model_generic_4":"NAS générique (4 baies)","model_generic_5":"NAS générique (5 baies)","model_generic_6":"NAS générique (6 baies)","model_generic_8":"NAS générique (8 baies)","name":"NAS","off":"Éteint","idle":"Au repos","running":"En marche","busy":"Très actif","warning":"Alerte","unavailable":"Indisponible","volume":"Volume","free":"Espace libre","go":"Go","to":"To","uptime":"Allumé depuis","d":"j","cpu":"CPU","ram":"RAM","temp":"Température","disks":"Disques","disk":"Disque","down":"Réception","up":"Envoi","power":"Puissance","volume_alert":"Volume dégradé","drive_alert":"Disque {n} : problème","hot":"Surchauffe","volume_full":"Volume presque plein","security":"Alerte de sécurité","update":"⬆ Mise à jour DSM disponible","model_synology_ds423":"Synology DS423+ (4 baies)","model_synology_ds925":"Synology DS925+ (4 baies)","model_terramaster_f4_423":"TerraMaster F4-423 (4 baies)","model_terramaster_f4_425":"TerraMaster F4-425 (4 baies)","model_terramaster_f6_424":"TerraMaster F6-424 (6 baies)","model_qnap_ts251":"QNAP TS-251+ (2 baies)","model_qnap_ts253":"QNAP TS-253 (2 baies)","model_asustor_2bay":"NAS Asustor (2 baies)","model_asustor_4bay":"NAS Asustor (4 baies)","model_asustor_6bay":"NAS Asustor (6 baies)","model_synology_ds1525":"Synology DS1525+ (5 baies)","model_synology_ds224":"Synology DS224+ (2 baies)","model_synology_ds1812":"Synology DS1812+ (8 baies)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 baies)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 baies)","parity_alert":"Parité invalide","flash_alert":"Clé USB flash : problème","nvme_alert":"SSD {n} : problème"},"hu":{"name":"NAS","off":"Ki","idle":"Tétlen","running":"Fut","busy":"Aktív","warning":"Figyelmeztetés","unavailable":"Nem elérhető","volume":"Kötet","free":"Szabad hely","go":"GB","to":"TB","uptime":"Üzemidő","d":"n","cpu":"CPU","ram":"RAM","temp":"Hőmérséklet","disks":"Lemezek","disk":"Lemez","down":"Letöltés","up":"Feltöltés","power":"Teljesítmény","volume_alert":"Kötet sérült","drive_alert":"Lemez {n}: probléma","hot":"Túlmelegedés","volume_full":"Kötet majdnem tele","security":"Biztonsági figyelmeztetés","update":"⬆ DSM frissítés elérhető","model_synology_ds423":"Synology DS423+ (4 rekesz)","model_synology_ds925":"Synology DS925+ (4 rekesz)","model_terramaster_f4_423":"TerraMaster F4-423 (4 rekesz)","model_terramaster_f4_425":"TerraMaster F4-425 (4 rekesz)","model_terramaster_f6_424":"TerraMaster F6-424 (6 rekesz)","model_qnap_ts251":"QNAP TS-251+ (2 rekesz)","model_qnap_ts253":"QNAP TS-253 (2 rekesz)","model_synology_ds224":"Synology DS224+ (2 rekesz)","model_synology_ds1812":"Synology DS1812+ (8 rekesz)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 rekesz)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 rekesz)","parity_alert":"Paritás érvénytelen","flash_alert":"USB flash: probléma","nvme_alert":"SSD {n}: probléma"},"it":{"name":"NAS","off":"Spento","idle":"Inattivo","running":"In funzione","busy":"Molto attivo","warning":"Avviso","unavailable":"Non disponibile","volume":"Volume","free":"Spazio libero","uptime":"Uptime","d":"g","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Dischi","disk":"Disco","down":"Download","up":"Upload","power":"Potenza","volume_alert":"Volume degradato","drive_alert":"Disco {n}: problema","hot":"Surriscaldamento","volume_full":"Volume quasi pieno","security":"Avviso di sicurezza","update":"⬆ Aggiornamento DSM disponibile"},"nb":{"name":"NAS","off":"Av","idle":"Inaktiv","running":"Kjører","busy":"Svært aktiv","warning":"Varsel","unavailable":"Utilgjengelig","volume":"Volum","free":"Ledig plass","uptime":"Oppetid","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatur","disks":"Disker","disk":"Disk","down":"Ned","up":"Opp","power":"Effekt","volume_alert":"Volumet er degradert","drive_alert":"Disk {n}: problem","hot":"Overoppheting","volume_full":"Volumet er nesten fullt","security":"Sikkerhetsvarsel","update":"⬆ DSM-oppdatering tilgjengelig"},"nl":{"name":"NAS","off":"Uit","idle":"Inactief","running":"Actief","busy":"Zeer actief","warning":"Waarschuwing","unavailable":"Niet beschikbaar","volume":"Volume","free":"Vrije ruimte","uptime":"Uptime","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatuur","disks":"Schijven","disk":"Schijf","down":"Download","up":"Upload","power":"Vermogen","volume_alert":"Volume gedegradeerd","drive_alert":"Schijf {n}: probleem","hot":"Oververhitting","volume_full":"Volume bijna vol","security":"Beveiligingswaarschuwing","update":"⬆ DSM-update beschikbaar"},"pl":{"name":"NAS","off":"Wył.","idle":"Bezczynny","running":"Pracuje","busy":"Czynna","warning":"Ostrzeżenie","unavailable":"Niedostępny","volume":"Głośność","free":"Wolne miejsce","uptime":"Czas działania","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Dyski","disk":"Dysk","down":"Pobieranie","up":"Wysyłanie","power":"Moc","volume_alert":"Wolumin uszkodzony","drive_alert":"Dysk {n}: problem","hot":"Przegrzanie","volume_full":"Wolumin prawie pełny","security":"Ostrzeżenie bezpieczeństwa","update":"⬆ Dostępna aktualizacja DSM","model_synology_ds423":"Synology DS423+ (4 zatoki)","model_synology_ds925":"Synology DS925+ (4 zatoki)","model_terramaster_f4_423":"TerraMaster F4-423 (4 zatoki)","model_terramaster_f4_425":"TerraMaster F4-425 (4 zatoki)","model_terramaster_f6_424":"TerraMaster F6-424 (6 zatoki)","model_qnap_ts251":"QNAP TS-251+ (2 zatoki)","model_qnap_ts253":"QNAP TS-253 (2 zatoki)","model_synology_ds224":"Synology DS224+ (2 zatoki)","model_synology_ds1812":"Synology DS1812+ (8 zatoki)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 zatoki)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 zatok)","parity_alert":"Parzystość niepoprawna","flash_alert":"Pendrive flash: problem","nvme_alert":"SSD {n}: problem"},"pt-BR":{"model_generic_1":"NAS genérico (1 baia)","model_generic_2":"NAS genérico (2 baias)","model_generic_4":"NAS genérico (4 baias)","model_generic_5":"NAS genérico (5 baias)","model_generic_6":"NAS genérico (6 baias)","model_generic_8":"NAS genérico (8 baias)","name":"NAS","off":"Desligado","idle":"Inativo","running":"Em funcionamento","busy":"Ativo","warning":"Aviso","unavailable":"Indisponível","volume":"Volume","free":"Espaço livre","go":"GB","to":"TB","uptime":"Tempo de atividade","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Discos","disk":"Disco","down":"Download","up":"Upload","power":"Potência","volume_alert":"Volume degradado","drive_alert":"Disco {n}: problema","hot":"Superaquecimento","volume_full":"Volume quase cheio","security":"Aviso de segurança","update":"⬆ Atualização do DSM disponível","model_synology_ds423":"Synology DS423+ (4 baias)","model_synology_ds925":"Synology DS925+ (4 baias)","model_terramaster_f4_423":"TerraMaster F4-423 (4 baias)","model_terramaster_f4_425":"TerraMaster F4-425 (4 baias)","model_terramaster_f6_424":"TerraMaster F6-424 (6 baias)","model_qnap_ts251":"QNAP TS-251+ (2 baias)","model_qnap_ts253":"QNAP TS-253 (2 baias)","model_synology_ds224":"Synology DS224+ (2 baias)","model_synology_ds1812":"Synology DS1812+ (8 baias)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 baias)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 baias)","parity_alert":"Paridade inválida","flash_alert":"Pendrive: problema","nvme_alert":"SSD {n}: problema","model_asustor_2bay":"NAS Asustor (2 baias)","model_asustor_4bay":"NAS Asustor (4 baias)","model_asustor_6bay":"NAS Asustor (6 baias)","model_synology_ds1525":"Synology DS1525+ (5 baias)"},"pt-PT":{"model_generic_1":"NAS genérico (1 baia)","model_generic_2":"NAS genérico (2 baias)","model_generic_4":"NAS genérico (4 baias)","model_generic_5":"NAS genérico (5 baias)","model_generic_6":"NAS genérico (6 baias)","model_generic_8":"NAS genérico (8 baias)","name":"NAS","off":"Desligado","idle":"Inativo","running":"Em funcionamento","busy":"Ativo","warning":"Aviso","unavailable":"Indisponível","volume":"Volume","free":"Espaço livre","go":"GB","to":"TB","uptime":"Tempo de atividade","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Discos","disk":"Disco","down":"Receção","up":"Envio","power":"Potência","volume_alert":"Volume degradado","drive_alert":"Disco {n}: problema","hot":"Sobreaquecimento","volume_full":"Volume quase cheio","security":"Aviso de segurança","update":"⬆ Atualização do DSM disponível","model_synology_ds423":"Synology DS423+ (4 baias)","model_synology_ds925":"Synology DS925+ (4 baias)","model_terramaster_f4_423":"TerraMaster F4-423 (4 baias)","model_terramaster_f4_425":"TerraMaster F4-425 (4 baias)","model_terramaster_f6_424":"TerraMaster F6-424 (6 baias)","model_qnap_ts251":"QNAP TS-251+ (2 baias)","model_qnap_ts253":"QNAP TS-253 (2 baias)","model_synology_ds224":"Synology DS224+ (2 baias)","model_synology_ds1812":"Synology DS1812+ (8 baias)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 baias)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 baias)","parity_alert":"Paridade inválida","flash_alert":"Pen USB: problema","nvme_alert":"SSD {n}: problema","model_asustor_2bay":"NAS Asustor (2 baias)","model_asustor_4bay":"NAS Asustor (4 baias)","model_asustor_6bay":"NAS Asustor (6 baias)","model_synology_ds1525":"Synology DS1525+ (5 baias)"},"ro":{"name":"NAS","off":"Oprit","idle":"Inactiv","running":"Pornit","busy":"Foarte activ","warning":"Avertizare","unavailable":"Indisponibil","volume":"Volum","free":"Spațiu liber","uptime":"Timp pornit","d":"z","cpu":"CPU","ram":"RAM","temp":"Temperatură","disks":"Discuri","disk":"Disc","down":"Descărcare","up":"Încărcare","power":"Putere","volume_alert":"Volum degradat","drive_alert":"Disc {n}: problemă","hot":"Supraîncălzire","volume_full":"Volum aproape plin","security":"Avertizare de securitate","update":"⬆ Actualizare DSM disponibilă"},"ru":{"model_generic_1":"Обычный NAS (1 отсек)","model_generic_2":"Обычный NAS (2 отсека)","model_generic_4":"Обычный NAS (4 отсека)","model_generic_5":"Обычный NAS (5 отсеков)","model_generic_6":"Обычный NAS (6 отсеков)","model_generic_8":"Обычный NAS (8 отсеков)","name":"NAS","off":"Выключен","idle":"Простой","running":"Работает","busy":"Активен","warning":"Предупреждение","unavailable":"Недоступно","volume":"Том","free":"Свободно","go":"ГБ","to":"ТБ","uptime":"Аптайм","d":"д","cpu":"ЦП","ram":"ОЗУ","temp":"Температура","disks":"Диски","disk":"Диск","down":"Загрузка","up":"Отдача","power":"Мощность","volume_alert":"Том деградирован","drive_alert":"Диск {n}: проблема","hot":"Перегрев","volume_full":"Том почти заполнен","security":"Предупреждение безопасности","update":"⬆ Доступно обновление DSM","model_synology_ds423":"Synology DS423+ (4 отсека)","model_synology_ds925":"Synology DS925+ (4 отсека)","model_terramaster_f4_423":"TerraMaster F4-423 (4 отсека)","model_terramaster_f4_425":"TerraMaster F4-425 (4 отсека)","model_terramaster_f6_424":"TerraMaster F6-424 (6 отсеков)","model_qnap_ts251":"QNAP TS-251+ (2 отсека)","model_qnap_ts253":"QNAP TS-253 (2 отсека)","model_asustor_2bay":"Asustor NAS (2 отсека)","model_asustor_4bay":"Asustor NAS (4 отсека)","model_asustor_6bay":"Asustor NAS (6 отсеков)","model_synology_ds1525":"Synology DS1525+ (5 отсеков)","model_synology_ds224":"Synology DS224+ (2 отсека)","model_synology_ds1812":"Synology DS1812+ (8 отсеков)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 отсека)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 отсеков)","parity_alert":"Ошибка чётности","flash_alert":"USB-флешка: проблема","nvme_alert":"SSD {n}: проблема"},"sr":{"name":"NAS","off":"Искључено","idle":"У мировању","running":"У раду","busy":"Активан","warning":"Упозорење","unavailable":"Недоступно","volume":"Волумен","free":"Слободан простор","go":"GB","to":"TB","uptime":"Време рада","d":"д","cpu":"CPU","ram":"RAM","temp":"Температура","disks":"Дискови","disk":"Диск","down":"Преузимање","up":"Слање","power":"Снага","volume_alert":"Волумен је деградиран","drive_alert":"Диск {n}: проблем","hot":"Прегревање","volume_full":"Волумен је скоро пун","security":"Безбедносно упозорење","update":"⬆ Доступно ажурирање за DSM","model_synology_ds423":"Synology DS423+ (4 лежишта)","model_synology_ds925":"Synology DS925+ (4 лежишта)","model_terramaster_f4_423":"TerraMaster F4-423 (4 лежишта)","model_terramaster_f4_425":"TerraMaster F4-425 (4 лежишта)","model_terramaster_f6_424":"TerraMaster F6-424 (6 лежишта)","model_qnap_ts251":"QNAP TS-251+ (2 лежишта)","model_qnap_ts253":"QNAP TS-253 (2 лежишта)","model_synology_ds224":"Synology DS224+ (2 лежишта)","model_synology_ds1812":"Synology DS1812+ (8 лежишта)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 лежишта)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 лежишта)","parity_alert":"Паритет није исправан","flash_alert":"USB флеш: проблем","nvme_alert":"SSD {n}: проблем"},"sr-Latn":{"name":"NAS","off":"Isključeno","idle":"U mirovanju","running":"U radu","busy":"Aktivan","warning":"Upozorenje","unavailable":"Nedostupno","volume":"Volumen","free":"Slobodan prostor","go":"GB","to":"TB","uptime":"Vreme rada","d":"d","cpu":"CPU","ram":"RAM","temp":"Temperatura","disks":"Diskovi","disk":"Disk","down":"Preuzimanje","up":"Slanje","power":"Snaga","volume_alert":"Volumen je degradiran","drive_alert":"Disk {n}: problem","hot":"Pregrevanje","volume_full":"Volumen je skoro pun","security":"Bezbednosno upozorenje","update":"⬆ Dostupno ažuriranje za DSM","model_synology_ds423":"Synology DS423+ (4 ležišta)","model_synology_ds925":"Synology DS925+ (4 ležišta)","model_terramaster_f4_423":"TerraMaster F4-423 (4 ležišta)","model_terramaster_f4_425":"TerraMaster F4-425 (4 ležišta)","model_terramaster_f6_424":"TerraMaster F6-424 (6 ležišta)","model_qnap_ts251":"QNAP TS-251+ (2 ležišta)","model_qnap_ts253":"QNAP TS-253 (2 ležišta)","model_synology_ds224":"Synology DS224+ (2 ležišta)","model_synology_ds1812":"Synology DS1812+ (8 ležišta)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 ležišta)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 ležišta)","parity_alert":"Paritet nije ispravan","flash_alert":"USB fleš: problem","nvme_alert":"SSD {n}: problem"},"uk":{"model_generic_1":"Універсальний NAS (1 відсік)","model_generic_2":"Універсальний NAS (2 відсіків)","model_generic_4":"Універсальний NAS (4 відсіків)","model_generic_5":"Універсальний NAS (5 відсіків)","model_generic_6":"Універсальний NAS (6 відсіків)","model_generic_8":"Універсальний NAS (8 відсіків)","name":"NAS","off":"Вимк.","idle":"Очікування","running":"Працює","busy":"Активний","warning":"Попередження","unavailable":"Недоступно","volume":"Том","free":"Вільне місце","go":"ГБ","to":"ТБ","uptime":"Час роботи","d":"д","cpu":"ЦП","ram":"ОЗП","temp":"Температура","disks":"Диски","disk":"Диск","down":"Завантаження","up":"Вивантаження","power":"Потужність","volume_alert":"Том деградовано","drive_alert":"Диск {n}: проблема","hot":"Перегрів","volume_full":"Том майже повний","security":"Попередження безпеки","update":"⬆ Доступне оновлення DSM","model_synology_ds423":"Synology DS423+ (4 відсіки)","model_synology_ds925":"Synology DS925+ (4 відсіки)","model_terramaster_f4_423":"TerraMaster F4-423 (4 відсіки)","model_terramaster_f4_425":"TerraMaster F4-425 (4 відсіки)","model_terramaster_f6_424":"TerraMaster F6-424 (6 відсіків)","model_qnap_ts251":"QNAP TS-251+ (2 відсіки)","model_qnap_ts253":"QNAP TS-253 (2 відсіки)","model_asustor_2bay":"NAS Asustor (2 відсіки)","model_asustor_4bay":"NAS Asustor (4 відсіки)","model_asustor_6bay":"NAS Asustor (6 відсіків)","model_synology_ds1525":"Synology DS1525+ (5 відсіків)","model_synology_ds224":"Synology DS224+ (2 відсіки)","model_synology_ds1812":"Synology DS1812+ (8 відсіки)","model_ugreen_dxp4800_plus":"UGREEN DXP4800 Plus (4 відсіки)","model_ugreen_idx6011_pro":"UGREEN iDX6011 Pro (6 відсіків)","parity_alert":"Парність недійсна","flash_alert":"USB-флешка: проблема","nvme_alert":"SSD {n}: проблема"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = window.__acImg("nas",0);
  const BAD = /crash|fail|degrad|warn|attention|critical|abnormal|danger|broken|error/i; // états DSM d'un disque / volume en défaut
  const EMPTY = /not_?use|not_?insert|none|empty|absent/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --ns-ok:var(--appliance-ok-color,#43a047);--ns-warn:#ffa31a;--ns-alert:var(--appliance-alert-color,#db4437);--ns-blue:#2f9bff;
  --vol:0;--act:0;--blink:1s;--net-d:0;--net-u:0;--tmp:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--ns-ok) 22%,transparent);color:var(--ns-ok)}
.busy .badge{background:color-mix(in srgb,var(--ns-blue) 22%,transparent);color:var(--ns-blue)}
.warning .badge{background:color-mix(in srgb,var(--ns-alert) 22%,transparent);color:var(--ns-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--ns-alert);font-weight:500;text-align:center}
.alert.on{display:block}
.info{display:none;margin-top:2px;font-size:11px;color:var(--ns-blue);font-weight:500;text-align:center;cursor:pointer}
.info.on{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--ns-alert)}

/* ---- illustration ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:grayscale(.5) brightness(.6)}
.aura{opacity:0;transition:opacity .8s}
.idle .aura,.running .aura,.busy .aura{opacity:calc(.2 + var(--act) * .6)}
.warning .aura{opacity:.85;animation:nsaura 1.6s ease-in-out infinite}
.warning .aura stop{stop-color:#ff3b30}
@keyframes nsaura{50%{opacity:.3}}
/* LED : on masque les LED vertes de la photo puis on les rallume selon l'état */
.ledmask{fill:#17191c}
.led{opacity:0;fill:var(--ledc,#3ddc5a);filter:drop-shadow(0 0 1.6px var(--ledc,#3ddc5a))}
.on .led{opacity:1}
.on .led.dk{animation:nsblink var(--blink) steps(2) infinite;animation-delay:var(--dl,0s)}
.idle .led.dk{animation:none}
.led.bad{fill:#ff9800;filter:drop-shadow(0 0 2px #ff9800);animation:nsblink .7s steps(2) infinite!important}
.led.empty{opacity:0!important}
.warning .led.st{fill:#ff9800;filter:drop-shadow(0 0 2px #ff9800);animation:nsblink 1s steps(2) infinite}
@keyframes nsblink{50%{opacity:.15}}
.pwr{fill:none;stroke:var(--ns-blue);stroke-width:1.3;opacity:0;filter:drop-shadow(0 0 2.5px var(--ns-blue))}
.on .pwr{opacity:1;animation:nsbreath 3.2s ease-in-out infinite}
@keyframes nsbreath{50%{opacity:.35}}
/* faisceau de lecture qui balaie les baies */
.beam{opacity:0}
.busy .beam,.running .beam{opacity:calc(.25 + var(--act) * .75);animation:nsbeam calc(3.4s - var(--act) * 1.8s) ease-in-out infinite}
@keyframes nsbeam{0%{transform:translateX(0)}50%{transform:translateX(var(--bw,100px))}100%{transform:translateX(0)}}
.bay{fill:#ff3b30;opacity:0}
.bay.bad{animation:nsbay 1.2s ease-in-out infinite}
@keyframes nsbay{50%{opacity:.38}}
.bayhit{fill:transparent}
/* chaleur au-dessus du boîtier */
.heat path{fill:none;stroke:#ff6e40;stroke-width:1.5;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.hot .heat path{animation:nsheat 2s ease-in infinite}
.heat path:nth-child(2){animation-delay:-.65s}.heat path:nth-child(3){animation-delay:-1.3s}
@keyframes nsheat{0%{opacity:0;transform:translateY(6px) scaleY(.6)}35%{opacity:.85}100%{opacity:0;transform:translateY(-14px) scaleY(1.1)}}
/* flux de données : vers l'anneau (téléversement) et depuis l'anneau (téléchargement) */
.flow{fill:none;stroke-width:2.4;stroke-linecap:round;opacity:0}
.flow.d{stroke:#4fc3ff;stroke-dasharray:.1 11}.flow.u{stroke:#5df28a;stroke-dasharray:.1 14}
.on .flow.d{opacity:calc(var(--net-d) * 1);animation:nsfd var(--sd,1.6s) linear infinite}
.on .flow.u{opacity:calc(var(--net-u) * 1);animation:nsfu var(--su,1.6s) linear infinite}
@keyframes nsfd{to{stroke-dashoffset:-22}}@keyframes nsfu{to{stroke-dashoffset:28}}
/* anneau du volume */
.ring-bg{fill:none;stroke:color-mix(in srgb,var(--primary-text-color) 12%,transparent);stroke-width:6}
.ring{fill:none;stroke:url(#ns-ring);stroke-width:6;stroke-linecap:round;stroke-dasharray:0 100;transition:stroke-dasharray 1.2s cubic-bezier(.3,1.3,.5,1);transform:rotate(-90deg);transform-origin:262px 60px}
.ring.full{stroke:#ff3b30}
.ring-glow{fill:none;stroke:#7c4dff;stroke-width:1;opacity:0;transform-origin:262px 60px}
.on .ring-glow{animation:nsspin 6s linear infinite;opacity:.6}
@keyframes nsspin{to{transform:rotate(360deg)}}
.rv{fill:var(--primary-text-color);font:700 11px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.rl{fill:var(--secondary-text-color);font:600 6px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle;letter-spacing:.06em}
/* mini barres réseau et température */
.mb{fill:color-mix(in srgb,var(--primary-text-color) 10%,transparent)}
.mf{transform-box:fill-box;transform-origin:0 50%;transition:transform 1s cubic-bezier(.3,1.3,.5,1)}
.mf.d{fill:#4fc3ff;transform:scaleX(var(--net-d))}.mf.u{fill:#5df28a;transform:scaleX(var(--net-u))}.mf.t{fill:url(#ns-temp);transform:scaleX(var(--tmp))}
.hot .mf.t{animation:nsblink .8s steps(2) infinite}
.mi{fill:var(--secondary-text-color);font:600 6.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.off .hud,.unavailable .hud{opacity:.4}
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

  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  // Modèles : photo + géométrie dans la scène 300 × 180 (baies, LED à masquer puis rallumer, bouton), couleur des LED
  const MODELS = {
    synology_ds423: { img: IMG, x: 12, y: 22, w: 200, h: 149.5, bays: [[32.5, 21.5], [58, 22], [83.5, 22], [109, 24]], by: 47, bh: 94,
      leds: [70, 79, 88, 97.5].map((y) => ({ x: 164.5, y, m: '#17191c' })), st: { x: 164.5, y: 61, m: '#17191c' }, link: null, pwr: [157, 150.5, 5.6], col: '#3ddc5a' },
    // synology_ds925
    synology_ds925: { img: window.__acImg("nas",1), x: 33.9, y: 22, w: 156.3, h: 149.5, bays: [[57.9, 22.1], [82.3, 21.5], [106.6, 21.5], [130.7, 21.5]], by: 44.4, bh: 99.4,
      leds: [{x: 185.1, y: 66.3, m: "#363838"}, {x: 185.1, y: 76.0, m: "#363636"}, {x: 185.1, y: 85.8, m: "#353636"}, {x: 185.1, y: 95.2, m: "#343637"}], st: {x: 185.1, y: 56.8, m: "#393b3a"}, link: null, pwr: [176.8, 145.7, 5.7], col: '#3ddc5a' },
    // terramaster_f4_423
    terramaster_f4_423: { img: window.__acImg("nas",2), x: 33.4, y: 22, w: 157.1, h: 149.5, bays: [[70.6, 22.5], [96.5, 22.0], [122.4, 22.0], [148.0, 22.2]], by: 42.6, bh: 110.9,
      leds: [{x: 44.2, y: 112.4, m: "#bebdc0"}, {x: 44.2, y: 120.3, m: "#bbbbbd"}, {x: 44.2, y: 128.1, m: "#b9b9bc"}, {x: 44.2, y: 136.0, m: "#b8b8ba"}], st: {x: 44.4, y: 96.3, m: "#c6c6c7"}, link: {x: 44.2, y: 104.2, m: "#c2c0c3"}, pwr: [49.8, 148.4, 6.8], col: '#3aa0ff' },
    // terramaster_f4_425
    terramaster_f4_425: { img: window.__acImg("nas",3), x: 33.5, y: 22, w: 157.1, h: 149.5, bays: [[73.6, 23.0], [99.7, 23.0], [125.7, 23.0], [151.8, 23.0]], by: 43.0, bh: 110.5,
      leds: [{x: 45.0, y: 105.6, m: "#313133"}, {x: 45.0, y: 113.7, m: "#302f31"}, {x: 45.0, y: 121.9, m: "#2f2f30"}, {x: 45.0, y: 130.0, m: "#2f2e31"}], st: {x: 45.0, y: 89.2, m: "#323234"}, link: {x: 45.0, y: 97.4, m: "#323234"}, pwr: [51.1, 144.0, 6.7], col: '#3aa0ff' },
    // ugreen_dxp4800_plus : photo officielle détourée (4 baies), LED blanches
    ugreen_dxp4800_plus: { img: window.__acImg("nas",4), x: 12, y: 22, w: 200, h: 147.1, bays: [[20.7, 20.9], [43.7, 21.1], [67.2, 21.6], [91.1, 21.6]], by: 45.4, bh: 84.1,
      leds: [{x: 44.2, y: 147.3, m: "#6c6e74"}, {x: 48.1, y: 147.7, m: "#6c6d73"}, {x: 52.0, y: 148.2, m: "#6a6c71"}, {x: 55.9, y: 148.4, m: "#6e7075"}], st: {x: 28.8, y: 146.1, m: "#75767c"}, link: {x: 40.3, y: 147.1, m: "#6c6e74"}, pwr: [28.8, 146.1, 5.2], col: '#f2f6ff' },
    // ugreen_idx6011_pro : photo détourée (6 baies), LED blanches
    ugreen_idx6011_pro: { img: window.__acImg("nas",5), x: 12, y: 22, w: 200, h: 112.2, bays: [[45.3, 18.8], [66.9, 19.1], [88.9, 19.0], [110.7, 19.0], [132.5, 19.0], [154.4, 19.0]], by: 39.6, bh: 64.8,
      leds: [{x: 70.0, y: 125.5, m: "#545b63"}, {x: 76.2, y: 125.5, m: "#545a65"}, {x: 82.3, y: 125.5, m: "#505862"}, {x: 88.5, y: 125.7, m: "#505963"}, {x: 94.8, y: 125.7, m: "#4f5661"}, {x: 100.9, y: 125.7, m: "#4f5762"}], st: {x: 47.5, y: 125.5, m: "#4b5861"}, link: {x: 57.5, y: 125.5, m: "#505761"}, pwr: [47.5, 125.5, 4.8], col: '#f2f6ff' },
    // terramaster_f6_424 : photo détourée (6 baies), LED vertes
    terramaster_f6_424: { img: window.__acImg("nas",6), x: 12, y: 22, w: 200, h: 135.4, bays: [[28.7, 21.9], [53.2, 21.9], [78.0, 21.9], [102.8, 21.9], [127.6, 21.9], [152.3, 22.2]], by: 49.1, bh: 92.2,
      leds: [{x: 199.0, y: 100.4, m: "#2c2c2c"}, {x: 199.0, y: 106.1, m: "#292927"}, {x: 199.0, y: 112.5, m: "#31312f"}, {x: 199.0, y: 118.8, m: "#242422"}, {x: 199.0, y: 124.6, m: "#2a2a28"}, {x: 199.0, y: 130.4, m: "#22231e"}], st: {x: 199.0, y: 140.2, m: "#242426"}, link: null, pwr: [199.0, 140.2, 4.6], col: '#3ddc5a' },
    // qnap_ts251 : QNAP TS-251+ : photo détourée (2 baies), LED verte, sans la télécommande
    qnap_ts251: { img: window.__acImg("nas",7), x: 67.5, y: 22, w: 89.0, h: 149.5, bays: [[95.0, 22.2], [120.4, 22.5]], by: 61.7, bh: 95.9,
      leds: [{x: 81.1, y: 65.7, m: "#7a7882"}, {x: 81.1, y: 73.6, m: "#797781"}], st: {x: 81.1, y: 42.9, m: "#7f7c86"}, link: {x: 81.4, y: 50.5, m: "#8a8891"}, pwr: [80.7, 118.2, 5.6], col: '#3ddc5a' },
    // qnap_ts253 : QNAP TS-253 : photo détourée (2 baies), LED vertes
    qnap_ts253: { img: window.__acImg("nas",8), x: 67.2, y: 22, w: 89.6, h: 149.5, bays: [[94.3, 22.9], [120.0, 22.7]], by: 57.9, bh: 97.8,
      leds: [{x: 80.8, y: 62.5, m: "#646465"}, {x: 80.8, y: 70.5, m: "#646465"}], st: {x: 80.7, y: 38.7, m: "#646465"}, link: {x: 80.8, y: 46.7, m: "#646465"}, pwr: [81.1, 116.0, 5.5], col: '#3ddc5a' },
    // synology_ds1812 : photo détourée (8 baies, vue de face), voyants jaune-vert de la photo effacés puis redessinés
    synology_ds1812: { img: window.__acImg("nas",9), x: 12, y: 42, w: 200, h: 93.9, bays: [[40.1, 15.5], [58.5, 15.5], [76.6, 15.5], [95.0, 15.5], [113.0, 15.9], [131.5, 15.5], [149.9, 15.5], [168.0, 15.9]], by: 62.1, bh: 63.3,
      leds: [{x: 47.6, y: 64.4, m: "#353532"}, {x: 66.1, y: 64.4, m: "#353432"}, {x: 84.5, y: 64.4, m: "#343432"}, {x: 103.0, y: 64.4, m: "#353534"}, {x: 121.4, y: 64.4, m: "#343433"}, {x: 139.5, y: 64.4, m: "#333331"}, {x: 157.9, y: 64.4, m: "#323230"}, {x: 176.4, y: 64.4, m: "#303030"}], st: {x: 73.0, y: 53.9, m: "#484849"}, link: {x: 133.0, y: 53.9, m: "#464747"}, pwr: [111.4, 53.9, 4.2], col: '#b6e51d', lr: 2.1 },
    // synology_ds224 : photo détourée (2 baies, vue 3/4), LED vertes
    synology_ds224: { img: window.__acImg("nas",10), x: 41.1, y: 22, w: 141.7, h: 149.5, bays: [[49.9, 33.0], [84.8, 33.0]], by: 28.8, bh: 127.2,
      leds: [{x: 128.4, y: 69.0, m: "#424245"}, {x: 128.5, y: 80.2, m: "#464849"}], st: {x: 128.5, y: 39.4, m: "#545356"}, link: {x: 128.0, y: 49.3, m: "#4b4a4a"}, pwr: [125.6, 141.4, 6.8], col: '#9be04a' },
    // synology_ds1525 : Synology DS1525+ : photo détourée (5 baies, vue 3/4), voyants STATUS et DISK 1 à 5 verts
    synology_ds1525: { img: window.__acImg("nas",11), x: 12, y: 32, w: 200, h: 128.7, bays: [[31.3, 18.7], [52.7, 18.0], [73.3, 19.3], [95.3, 19.3], [117.3, 19.3]], by: 50.0, bh: 86.7,
      leds: [{x: 170.7, y: 62.0, m: "#2d2d2d"}, {x: 170.7, y: 70.0, m: "#2d2d2d"}, {x: 170.7, y: 78.0, m: "#2e2e2e"}, {x: 170.7, y: 85.3, m: "#303030"}, {x: 170.7, y: 93.3, m: "#2d2d2d"}], st: {x: 170.7, y: 54.0, m: "#2c2c2c"}, link: null, pwr: [160.0, 142.0, 4.0], col: '#b6e51d' },
    // asustor_6bay : NAS Asustor (6 bays), photo détourée, LED vertes des disques ; voyants bleus de la façade
    asustor_6bay: { img: window.__acImg("nas",12), x: 14, y: 22, w: 200.0, h: 144.4, bays: [[93.9, 19.8], [114.8, 18.7], [134.7, 17.1], [152.3, 17.1], [169.9, 17.1], [188.1, 16.0]], by: 71.6, bh: 83.7,
      leds: [{x: 99.4, y: 74.3, m: "#7f7f7f"}, {x: 120.3, y: 74.3, m: "#5c5c5c"}, {x: 139.6, y: 74.3, m: "#555b59"}, {x: 158.4, y: 74.3, m: "#595959"}, {x: 176.5, y: 74.3, m: "#0e0e0e"}, {x: 193.6, y: 74.3, m: "#232323"}], st: {x: 63.6, y: 123.9, m: "#475175"}, link: {x: 63.6, y: 130.0, m: "#7887ae"}, pwr: [70.7, 41.8, 2.8], col: '#3ddc5a' },
    // asustor_4bay : NAS Asustor (4 bays), photo détourée, LED vertes des disques ; voyants bleus de la façade
    asustor_4bay: { img: window.__acImg("nas",13), x: 30, y: 22, w: 163.0, h: 149.5, bays: [[113.4, 17.4], [133.4, 17.4], [152.6, 15.6], [169.9, 15.6]], by: 71.1, bh: 83.0,
      leds: [{x: 120.0, y: 74.6, m: "#5c605f"}, {x: 139.5, y: 74.6, m: "#2e2e2e"}, {x: 158.6, y: 74.6, m: "#646d6a"}, {x: 175.6, y: 74.6, m: "#6b6b6b"}], st: {x: 81.3, y: 123.7, m: "#bfcbf3"}, link: {x: 81.3, y: 128.9, m: "#cbd3f8"}, pwr: [90.8, 41.6, 2.6], col: '#3ddc5a' },
    // asustor_2bay : NAS Asustor (2 bays), photo détourée, LED vertes des disques ; voyants bleus de la façade
    asustor_2bay: { img: window.__acImg("nas",14), x: 45, y: 22, w: 127.7, h: 149.5, bays: [[120.0, 21.4], [142.6, 21.4]], by: 57.7, bh: 97.2,
      leds: [{x: 127.4, y: 63.8, m: "#69796c"}, {x: 150.9, y: 63.8, m: "#838f8b"}], st: {x: 87.7, y: 120.1, m: "#7494cd"}, link: {x: 87.7, y: 126.2, m: "#7f94c3"}, pwr: [95.1, 39.4, 2.6], col: '#3ddc5a' },
  };
  // NAS générique de 1, 2, 4, 5, 6 ou 8 baies : dessiné en SVG (pas de photo), mêmes calques animés que les modèles photo.
  // Le dessin occupe toute la scène 300 × 180 : ses coordonnées sont celles de la scène (baies côte à côte, LED des disques sous chaque baie).
  const genericNas = (n) => {
    const W = { 1: 66, 2: 100, 4: 152, 5: 178, 6: 196, 8: 200 }[n], x0 = 112 - W / 2, m = n === 8 ? 7 : 9, g = n === 8 ? 2 : 3, by = 44, bh = 84, ly = 142;
    const bw = (W - 2 * m - g * (n - 1)) / n, bays = Array.from({ length: n }, (_, i) => [+(x0 + m + i * (bw + g)).toFixed(1), +bw.toFixed(1)]);
    const px = (v) => +v.toFixed(1), leds = bays.map(([x, w]) => ({ x: px(x + w / 2), y: ly, m: '#202328' }));
    const st = { x: px(x0 + 13), y: 36, m: '#202328' }, pwr = [px(x0 + W - 13), ly, 5];
    const tray = bays.map(([x, w]) => `<rect x="${x}" y="${by}" width="${w}" height="${bh}" rx="2" fill="#14161a" stroke="#383d45" stroke-width=".8"/>`
      + Array.from({ length: 6 }, (_, k) => `<rect x="${px(x + 3)}" y="${by + 5 + k * 3.2}" width="${px(w - 6)}" height="1.1" rx=".5" fill="#23272d"/>`).join('')
      + `<rect x="${px(x + w * 0.2)}" y="${by + bh - 11}" width="${px(w * 0.6)}" height="4" rx="2" fill="#3b4048"/>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" width="300" height="180">
<rect x="${px(x0)}" y="28" width="${W}" height="132" rx="8" fill="#202328" stroke="#4a5059" stroke-width="1.2"/>
<rect x="${px(x0 + 2)}" y="29" width="${W - 4}" height="5" rx="2.5" fill="#2f343b"/>${tray}
<circle cx="${pwr[0]}" cy="${pwr[1]}" r="6.4" fill="#15171a" stroke="#4a5059" stroke-width="1"/></svg>`;
    return { img: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg), x: 0, y: 0, w: 300, h: 180, bays, by, bh, leds, st, link: null, pwr, col: '#3ddc5a' };
  };
  [1, 2, 4, 5, 6, 8].forEach((n) => { MODELS[`generic_${n}`] = genericNas(n); });
  const modelOf = (c) => MODELS[c && c.model] || MODELS.synology_ds423;
  const SVG = (label, M) => `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}" style="--ledc:${M.col}">
 <defs>
  <radialGradient id="ns-aura"><stop offset="0" stop-color="#2f9bff" stop-opacity=".5"/><stop offset="1" stop-color="#2f9bff" stop-opacity="0"/></radialGradient>
  <radialGradient id="ns-shadow"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="ns-beam" x1="0" x2="1"><stop offset="0" stop-color="#8fd3ff" stop-opacity="0"/><stop offset=".5" stop-color="#8fd3ff" stop-opacity=".45"/><stop offset="1" stop-color="#8fd3ff" stop-opacity="0"/></linearGradient>
  <linearGradient id="ns-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00e5ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient>
  <linearGradient id="ns-temp" x1="0" x2="1"><stop offset="0" stop-color="#4fc3ff"/><stop offset=".6" stop-color="#ffc400"/><stop offset="1" stop-color="#ff3b30"/></linearGradient>
  <clipPath id="ns-bays">${M.bays.map(([x, w]) => `<rect x="${x}" y="${M.by}" width="${w}" height="${M.bh}" rx="1.5"/>`).join('')}</clipPath>
 </defs>
 <ellipse class="aura" cx="112" cy="96" rx="112" ry="78" fill="url(#ns-aura)"/>
 <ellipse cx="112" cy="171" rx="100" ry="6" fill="url(#ns-shadow)"/>
 <g class="heat"><path d="M70 22 q-4 -6 0 -12 t0 -12"/><path d="M110 20 q-4 -6 0 -12 t0 -12"/><path d="M150 20 q-4 -6 0 -12 t0 -12"/></g>
 <path class="flow d" d="M236 60 C 210 20 170 10 140 28"/>
 <path class="flow u" d="M140 28 C 170 10 210 20 236 60"/>
 <image class="photo" href="${M.img}" x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}"/>
 ${M.bays.map(([x, w], i) => `<rect class="bay" data-i="${i}" x="${x}" y="${M.by}" width="${w}" height="${M.bh}" rx="1.5"/>`).join('')}
 <g clip-path="url(#ns-bays)"><rect class="beam" x="${M.bays[0][0] - 13}" y="${M.by - 2}" width="26" height="${M.bh + 6}" fill="url(#ns-beam)" style="--bw:${(M.bays[M.bays.length - 1][0] + M.bays[M.bays.length - 1][1] - M.bays[0][0]).toFixed(1)}px"/></g>
 <g>${[M.st, ...(M.link ? [M.link] : []), ...M.leds].map((l) => `<circle class="ledmask" cx="${l.x}" cy="${l.y}" r="1.9" style="fill:${l.m}"/>`).join('')}</g>
 <circle class="led st" cx="${M.st.x}" cy="${M.st.y}" r="${M.lr || 1.3}"/>
 ${M.link ? `<circle class="led lk" cx="${M.link.x}" cy="${M.link.y}" r="${M.lr || 1.3}"/>` : ''}
 ${M.leds.map((l, i) => `<circle class="led dk" data-i="${i}" cx="${l.x}" cy="${l.y}" r="${M.lr || 1.3}" style="--dl:-${(i * 0.37).toFixed(2)}s"/>`).join('')}
 <circle class="pwr" cx="${M.pwr[0]}" cy="${M.pwr[1]}" r="${M.pwr[2]}"/>
 ${M.bays.map(([x, w], i) => `<rect class="bayhit" data-i="${i}" x="${x}" y="${M.by}" width="${w}" height="${M.bh}"><title></title></rect>`).join('')}
 <!-- volume et barres -->
 <g class="hud">
  <circle class="ring-bg" cx="262" cy="60" r="26"/>
  <circle class="ring" cx="262" cy="60" r="26" pathLength="100"/>
  <circle class="ring-glow" cx="262" cy="60" r="32" stroke-dasharray="6 14"/>
  <text class="rv" id="ns-vol" x="262" y="62">--</text>
  <text class="rl" id="ns-voll" x="262" y="71">VOLUME</text>
  <text class="mi" x="226" y="112">↓</text><rect class="mb" x="234" y="107" width="62" height="5" rx="2.5"/><rect class="mf d" x="234" y="107" width="62" height="5" rx="2.5"/>
  <text class="mi" x="226" y="127">↑</text><rect class="mb" x="234" y="122" width="62" height="5" rx="2.5"/><rect class="mf u" x="234" y="122" width="62" height="5" rx="2.5"/>
  <text class="mi" x="225" y="142">°</text><rect class="mb" x="234" y="137" width="62" height="5" rx="2.5"/><rect class="mf t" x="234" y="137" width="62" height="5" rx="2.5"/>
 </g>
</svg>`;

  const TILES = [
    ['volume', 'mdi:database', 'show_volume', 'entity_volume_used'],
    ['free', 'mdi:database-outline', 'show_free', 'entity_volume_free'],
    ['cpu', 'mdi:cpu-64-bit', 'show_cpu', 'entity_cpu'],
    ['ram', 'mdi:memory', 'show_ram', 'entity_ram'],
    ['temp', 'mdi:thermometer', 'show_temp', 'entity_temp'],
    ['disks', 'mdi:harddisk', 'show_disks', '_disks'],
    ['down', 'mdi:download-network', 'show_down', 'entity_net_down'],
    ['up', 'mdi:upload-network', 'show_up', 'entity_net_up'],
    ['uptime', 'mdi:timer-outline', 'show_uptime', 'entity_uptime'],
    ['power', 'mdi:flash', 'show_power', 'entity_power'],
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
  const toMbit = (v, unit) => {
    if (isNaN(v)) return NaN;
    const u = String(unit || '').replace(/\s/g, '');
    const m = u.match(/^([kKMGT]?)(i?)(B|b|bit|byte|bps|Bps)/);
    if (!m) return v;
    const mul = { '': 1, k: 1e3, K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[1]] * (m[2] ? 1.024 : 1);
    return (v * mul * (/^(B|byte|Bps)$/.test(m[3]) ? 8 : 1)) / 1e6;
  };

  class ApplianceNasCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      const o = {
        entity_volume: f(/volume_1_status|volume_1_etat/i, 'sensor'),
        entity_volume_used: f(/volume_1_volume_used|volume_1_.*used.*percent|volume_usage$|volume_1_utilisation$/i, 'sensor'),
        entity_cpu: f(/cpu_utili[sz]ation_total|cpu_load_total|cpu_usage$|utilisation_cpu$/i, 'sensor'),
        entity_ram: f(/memory_usage_real|memory_usage|utilisation_memoire$/i, 'sensor'),
        entity_temp: f(/(ds\d|nas|synology|diskstation).*_temperature$|(system|cpu)_temperature$|temperature_(cpu|systeme)$/i, 'sensor'),
        entity_net_down: f(/download_throughput|eth0_debit_en_reception/i, 'sensor'),
        entity_net_up: f(/upload_throughput|eth0_debit_en_emission/i, 'sensor'),
      };
      for (let i = 1; i <= 4; i++) {
        o[`entity_drive_${i}`] = f(new RegExp(`(drive|disk)_${i}_status`, 'i'), 'sensor') || f(new RegExp(`hdd_${i}_problem`, 'i'), 'binary_sensor') || f(new RegExp(`disk${i - 1}_probleme`, 'i'), 'binary_sensor');
        o[`entity_drive_${i}_temp`] = f(new RegExp(`(drive|disk)_${i}_temperature|hdd_${i}_temperature|disk${i - 1}_temperature`, 'i'), 'sensor');
      }
      for (let i = 1; i <= 2; i++) {
        o[`entity_nvme_${i}`] = f(new RegExp(`nvme_${i}_problem`, 'i'), 'binary_sensor');
        o[`entity_nvme_${i}_temp`] = f(new RegExp(`nvme_${i}_temperature`, 'i'), 'sensor');
      }
      return Object.fromEntries(Object.entries(o).filter(([, v]) => v));
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'synology_ds423', show_status: true, show_volume: true, show_cpu: true, show_ram: true, show_temp: true, show_disks: true, show_network: true, show_power: true,
        cpu_busy: 60, volume_max: 85, ...c };
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
    // temps écoulé depuis le démarrage : capteur horodaté (« Last boot ») ou durée (s, min, h, d) ; même logique que la carte mini PC
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
    // espace libre : somme des volumes, chaque capteur dans son unité (o / B, ko, Mo, Go, To, Kio...), affichée en Go ou To
    _freeBytes(ids) {
      const f = { '': 1, b: 1, o: 1, kb: 1e3, ko: 1e3, mb: 1e6, mo: 1e6, gb: 1e9, go: 1e9, tb: 1e12, to: 1e12, pb: 1e15, po: 1e15,
        kib: 1024, mib: 1024 ** 2, gib: 1024 ** 3, tib: 1024 ** 4, kio: 1024, mio: 1024 ** 2, gio: 1024 ** 3, tio: 1024 ** 4 };
      let tot = 0, n = 0;
      ids.forEach((id) => { const v = this._num(id); if (isNaN(v)) return; const k = f[this._unit(id, 'GB').toLowerCase().replace(/\s/g, '')]; if (k) { tot += v * k; n++; } });
      return n ? tot : NaN;
    }
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

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="nstitle"></div><div class="badge" id="nsbadge"></div></div>
        ${SVG(this._c.name || this._t('name'), modelOf(this._c))}
        <div class="alert" id="nsalert"></div><div class="info" id="nsinfo"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${esc(k)}"><div class="l"><ha-icon icon="${esc(ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      const svg = root.querySelector('svg');
      // clic sur une baie : fiche du disque ; ailleurs : action de l'illustration
      svg.addEventListener('click', (e) => {
        const b = e.target.closest && e.target.closest('.bayhit'); if (!b) return;
        const id = this._c[`entity_drive_${+b.dataset.i + 1}`]; if (id) { e.stopImmediatePropagation(); this._more(id); }
      }, true);
      window.applianceBindIllus(this, svg, () => this._more(this._c.entity || asList(this._c.entity_volume)[0] || asList(this._c.entity_volume_used)[0] || this._c.entity_cpu));
      root.getElementById('nsinfo').addEventListener('click', () => this._more(this._c.entity_update));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const t = TILES.find((x) => x[0] === el.dataset.k);
        this._more(t[3] === '_disks' ? this._drives().map((d) => d.id).find(Boolean) : asList(this._c[t[3]])[0]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // 4 baies (entity_drive_N) puis 2 SSD NVMe facultatifs (entity_nvme_N) : état texte (DSM) ou binary_sensor « problème » (TerraMaster)
    _drives() {
      const c = this._c;
      return [...Array(modelOf(c).bays.length).keys()].map((n) => ['drive', n + 1]).concat([['nvme', 1], ['nvme', 2]]).map(([kind, i]) => {
        const key = kind === 'drive' ? `entity_drive_${i}` : `entity_nvme_${i}`;
        const id = c[key], s = this._st(id), raw = s ? String(s.state) : '';
        const tp = this._temp(c[`${key}_temp`]);
        const isBin = !!id && /^binary_sensor\./.test(id);
        const empty = !!s && !isBin && EMPTY.test(raw);
        const fault = isBin ? /^(on|true|problem)$/i.test(raw) : BAD.test(raw);
        const bad = !!s && !empty && (fault || (!isNaN(tp.v) && tp.v >= this._tlim('disk_temp_max', 50)));
        return { i, nvme: kind === 'nvme', id, raw, tp, empty, bad, known: !!s };
      });
    }

    _compute() {
      const c = this._c, s = this._st(c.entity), raw = s ? String(s.state).toLowerCase() : '';
      const cpu = this._num(c.entity_cpu), ram = this._num(c.entity_ram);
      // plusieurs volumes : l'anneau et l'alerte suivent le plus rempli
      const vols = asList(c.entity_volume_used).map((id) => this._num(id)).filter((v) => !isNaN(v)), vol = vols.length ? Math.max(...vols) : NaN;
      const tp = this._temp(c.entity_temp), pw = this._watts(c.entity_power);
      const dn = toMbit(this._num(c.entity_net_down), this._unit(c.entity_net_down, 'kB/s')), up = toMbit(this._num(c.entity_net_up), this._unit(c.entity_net_up, 'kB/s'));
      const drives = this._drives();
      let st;
      if (s && /^(unavailable|unknown)$/.test(raw)) st = 'unavailable';
      else if (s && /^(off|not_home|offline|down|false)$/.test(raw)) st = 'off';
      else if (!s && c.entity_cpu && isNaN(cpu) && isNaN(vol)) st = 'unavailable';
      else st = 'running';
      const alerts = [];
      if (st === 'running') {
        if (asList(c.entity_volume).some((id) => { const vs = this._st(id); return vs && BAD.test(String(vs.state)); })) alerts.push(this._t('volume_alert'));
        drives.filter((d) => d.bad).forEach((d) => alerts.push(this._t(d.nvme ? 'nvme_alert' : 'drive_alert').replace('{n}', d.i)));
        if (!isNaN(tp.v) && tp.v >= this._tlim('temp_max', 60)) alerts.push(this._t('hot'));
        if (!isNaN(vol) && vol >= Number(c.volume_max)) alerts.push(this._t('volume_full'));
        // Unraid : parité (binary_sensor « valide » : off = invalide) et clé USB flash (binary_sensor « problème »), cochables dans l'éditeur
        const par = this._st(c.entity_parity), fl = this._st(c.entity_flash);
        if (c.show_parity !== false && par && /^(off|false|invalid|problem|failed)$/i.test(String(par.state))) alerts.push(this._t('parity_alert'));
        if (c.show_flash !== false && fl && (fl.state === 'on' || BAD.test(String(fl.state)))) alerts.push(this._t('flash_alert'));
        const sec = this._st(c.entity_security);
        if (sec && (sec.state === 'on' || BAD.test(String(sec.state)) || /outofdate|risk/i.test(String(sec.state)))) alerts.push(this._t('security'));
      }
      const lvl = (m) => (isNaN(m) || m <= 0.001 ? 0 : Math.max(0, Math.min(1, (Math.log10(m) + 3) / 6)));
      const nd = lvl(dn), nu = lvl(up);
      const act = Math.max(isNaN(cpu) ? 0 : cpu / 100, nd, nu);
      if (st === 'running') {
        if (alerts.length) st = 'warning';
        else if ((!isNaN(cpu) && cpu >= Number(c.cpu_busy)) || Math.max(nd, nu) > 0.7) st = 'busy';
        else if (act < 0.2) st = 'idle';
      }
      const hot = !isNaN(tp.v) && tp.v >= this._tlim('temp_max', 60);
      return { st, cpu, ram, vol, tp, pw, nd, nu, act, drives, alerts, hot };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, cpu, ram, vol, tp, pw, nd, nu, act, drives, alerts, hot } = this._compute();
      const on = st !== 'off' && st !== 'unavailable';
      const clamp = (x) => Math.max(0, Math.min(1, isNaN(x) ? 0 : x));
      card.className = `${st}${on ? ' on' : ''}${hot && on ? ' hot' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const set = (k, v) => card.style.setProperty(k, v);
      set('--vol', clamp(vol / 100).toFixed(3)); set('--act', on ? act.toFixed(2) : 0);
      set('--blink', `${(1.1 - act * 0.9).toFixed(2)}s`);
      set('--net-d', on ? nd.toFixed(2) : 0); set('--net-u', on ? nu.toFixed(2) : 0);
      set('--sd', `${(2.2 - nd * 1.8).toFixed(2)}s`); set('--su', `${(2.2 - nu * 1.8).toFixed(2)}s`);
      // barre de température : 20 °C → vide, temp_max → pleine (échelle dans l'unité d'affichage)
      const tmax = this._tlim('temp_max', 60), tmin = tp.unit === '°F' ? 68 : 20;
      set('--tmp', clamp((tp.v - tmin) / (tmax - tmin)).toFixed(3));
      const ring = r.querySelector('.ring');
      ring.classList.toggle('full', !isNaN(vol) && vol >= Number(c.volume_max));
      ring.style.strokeDasharray = `${(clamp(vol / 100) * 100).toFixed(1)} 100`;
      r.getElementById('ns-vol').textContent = isNaN(vol) ? '--' : `${Math.round(vol)}%`;
      r.getElementById('ns-voll').textContent = this._l('volume').toUpperCase();
      drives.filter((d) => !d.nvme).forEach((d) => {
        const led = r.querySelector(`.led.dk[data-i="${d.i - 1}"]`);
        led.classList.toggle('bad', on && d.bad); led.classList.toggle('empty', d.empty);
        r.querySelector(`.bay[data-i="${d.i - 1}"]`).classList.toggle('bad', on && d.bad);
        const tip = r.querySelector(`.bayhit[data-i="${d.i - 1}"] title`);
        tip.textContent = `${this._t('disk')} ${d.i}${d.known ? ` · ${d.raw}` : ''}${isNaN(d.tp.v) ? '' : ` · ${this._fmt(d.tp.v, 0)} ${d.tp.unit}`}`;
      });

      r.getElementById('nstitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('nsbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('nsalert'); al.textContent = alerts.join(' · '); al.classList.toggle('on', alerts.length > 0);
      const upd = this._st(c.entity_update);
      const info = r.getElementById('nsinfo'); info.textContent = this._t('update'); info.classList.toggle('on', !!upd && upd.state === 'on');

      const freeB = this._freeBytes(asList(c.entity_volume_free));
      const fmtNet = (id) => fmtRate(this._num(id), this._unit(id, ''), window.applianceLocale(this._c, this._hass));
      const known = drives.filter((d) => d.known && !d.empty), ok = known.filter((d) => !d.bad).length;
      const temps = drives.map((d) => d.tp.v).filter((v) => !isNaN(v));
      const V = {
        volume: [this._fmt(vol, 0), '%'], cpu: [this._fmt(cpu, 0), '%'], ram: [this._fmt(ram, 0), '%'], temp: [this._fmt(tp.v, 0), tp.unit],
        disks: known.length ? [`${ok}/${known.length}`, temps.length ? `${this._fmt(Math.max(...temps), 0)}${tp.unit}` : ''] : ['--', ''],
        free: isNaN(freeB) ? ['--', ''] : freeB >= 1e12 ? [this._fmt(freeB / 1e12, 1), this._t('to')] : [this._fmt(freeB / 1e9, freeB >= 1e11 ? 0 : 1), this._t('go')],
        uptime: [this._dur(this._uptimeSec(c.entity_uptime)), ''],
        down: fmtNet(c.entity_net_down), up: fmtNet(c.entity_net_up), power: [this._fmt(pw, 0), 'W'],
      };
      const bad = { volume: !isNaN(vol) && vol >= Number(c.volume_max), temp: hot, disks: ok < known.length };
      TILES.forEach(([k, , opt, ent]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [val, unit] = V[k];
        const has = ent === '_disks' ? known.length > 0 : asList(c[ent]).length > 0;
        el.classList.toggle('hide', !has || c[opt] === false || (c.show_network === false && (k === 'down' || k === 'up')));
        el.classList.toggle('bad', !!bad[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceNasCard);

  /* ---- éditeur visuel ---- */
  class ApplianceNasCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          const nb = modelOf(this._c).bays.length; this._c = e.detail.value;
          if (modelOf(this._c).bays.length !== nb) this._draw(); // 4 ou 6 baies : le formulaire change
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const ent = (name, domain, multiple) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(multiple ? { multiple: true } : {}) } } });
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
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.keys(MODELS).map((value) => ({ value, label: tr[`model_${value}`] || value })) } } },
        ent('entity'), ent('entity_volume', 'sensor', true), ent('entity_volume_used', 'sensor', true), ent('entity_volume_free', 'sensor', true), ent('entity_cpu', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_temp', 'sensor'),
        ent('entity_net_down', 'sensor'), ent('entity_net_up', 'sensor'), ent('entity_uptime', 'sensor'),
        { type: 'grid', name: '', schema: [...Array(modelOf(this._c).bays.length).keys()].map((n) => n + 1).flatMap((i) => [ent(`entity_drive_${i}`, ['sensor', 'binary_sensor']), ent(`entity_drive_${i}_temp`, 'sensor')]) },
        { type: 'grid', name: '', schema: [1, 2].flatMap((i) => [ent(`entity_nvme_${i}`, ['sensor', 'binary_sensor']), ent(`entity_nvme_${i}_temp`, 'sensor')]) },
        ent('entity_parity', 'binary_sensor'), ent('entity_flash', 'binary_sensor'),
        ent('entity_security', 'binary_sensor'), ent('entity_update', 'update'), ent('entity_power', 'sensor'),
        { type: 'grid', name: '', schema: [num('cpu_busy', 10, 100, 1, 60, '%'), num('volume_max', 10, 100, 1, 85, '%'), tnum('temp_max', 30, 100, 1, 60), tnum('disk_temp_max', 30, 80, 1, 50)] },
        window.applianceTempField,
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [
          bool('show_status'), bool('compact', false), bool('show_volume'), bool('show_free'), bool('show_cpu'), bool('show_ram'), bool('show_temp'), bool('show_disks'), bool('show_down'), bool('show_up'), bool('show_uptime'), bool('show_power'), bool('show_parity'), bool('show_flash'), bool('animations'),
        ] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'nas_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceNasCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'NAS en photo (Synology DS423+ / DS925+, TerraMaster F4-423 / F4-425) : LED des 4 disques selon l\'activité, faisceau sur les baies, disque ou SSD en défaut, anneau du volume (un ou plusieurs volumes), flux réseau (Synology DSM, TerraMaster TNAS).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
