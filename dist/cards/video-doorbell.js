/* Carte « Sonnette vidéo » — custom:appliance-video-doorbell-card
 * Умный видеодомофон / дверной звонок: последнее нажатие, движение/посетитель/посылка, заряд батареи,
 * Wi-Fi сигнал, управление звонком/замком/подсветкой и живой снимок с камеры (или анимированная сцена крыльца).
 */
(() => {
  const TAG = 'appliance-video-doorbell-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Video doorbell","idle":"Ready","ringing":"Ringing","person":"Visitor","package":"Package","motion":"Motion","unavailable":"Unavailable","last_ring":"Last ring","battery":"Battery","signal":"Wi-Fi","chime":"Chime","lock":"Lock","detected":"Detected","clear":"Clear","low":"Low","ok":"OK","on":"On","off":"Off","locked":"Locked","unlocked":"Unlocked","btn_unlock":"Unlock","btn_lock":"Lock","btn_light":"Light","confirm_unlock":"Unlock the door?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"cs":{"name":"Videozvonek","idle":"Připraven","ringing":"Zvoní","person":"Návštěva","package":"Balíček","motion":"Pohyb","unavailable":"Nedostupné","last_ring":"Poslední zazvonění","battery":"Baterie","signal":"Wi-Fi","chime":"Gong","lock":"Zámek","detected":"Detekováno","clear":"Klid","low":"Slabá","ok":"OK","on":"Zap.","off":"Vyp.","locked":"Zamčeno","unlocked":"Odemčeno","btn_unlock":"Odemknout","btn_lock":"Zamknout","btn_light":"Světlo","confirm_unlock":"Odemknout dveře?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"da":{"name":"Videodørklokke","idle":"Klar","ringing":"Ringer","person":"Gæst","package":"Pakke","motion":"Bevægelse","unavailable":"Utilgængelig","last_ring":"Sidste ring","battery":"Batteri","signal":"Wi-Fi","chime":"Klokke","lock":"Lås","detected":"Registreret","clear":"Klar","low":"Lav","ok":"OK","on":"Til","off":"Fra","locked":"Låst","unlocked":"Ulåst","btn_unlock":"Lås op","btn_lock":"Lås","btn_light":"Lys","confirm_unlock":"Lås døren op?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"de":{"name":"Videotürklingel","idle":"Bereit","ringing":"Klingelt","person":"Besucher","package":"Paket","motion":"Bewegung","unavailable":"Nicht verfügbar","last_ring":"Letztes Klingeln","battery":"Batterie","signal":"WLAN","chime":"Gong","lock":"Schloss","detected":"Erkannt","clear":"Klar","low":"Niedrig","ok":"OK","on":"Ein","off":"Aus","locked":"Verriegelt","unlocked":"Entriegelt","btn_unlock":"Öffnen","btn_lock":"Sperren","btn_light":"Licht","confirm_unlock":"Tür entriegeln?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"es":{"name":"Videoportero","idle":"Listo","ringing":"Llamando","person":"Visitante","package":"Paquete","motion":"Movimiento","unavailable":"No disponible","last_ring":"Última llamada","battery":"Batería","signal":"Wi-Fi","chime":"Timbre","lock":"Cerradura","detected":"Detectado","clear":"Despejado","low":"Baja","ok":"OK","on":"Activado","off":"Desactivado","locked":"Cerrada","unlocked":"Abierta","btn_unlock":"Abrir","btn_lock":"Cerrar","btn_light":"Luz","confirm_unlock":"¿Abrir la puerta?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"fr":{"name":"Sonnette vidéo","idle":"Prête","ringing":"Sonnerie","person":"Visiteur","package":"Colis","motion":"Mouvement","unavailable":"Indisponible","last_ring":"Dernier appel","battery":"Batterie","signal":"Wi-Fi","chime":"Carillon","lock":"Serrure","detected":"Détecté","clear":"Rien","low":"Faible","ok":"OK","on":"Activé","off":"Désactivé","locked":"Verrouillée","unlocked":"Déverrouillée","btn_unlock":"Ouvrir","btn_lock":"Verrouiller","btn_light":"Lumière","confirm_unlock":"Déverrouiller la porte ?","f_entity_camera":"Entité caméra","f_entity_image":"Entité image (capture)","f_image":"URL d’image personnalisée","f_entity_ring":"Entité bouton / sonnerie","f_entity_last_ring":"Horodatage du dernier appel","f_entity_motion":"Capteur de mouvement","f_entity_person":"Détection de personne","f_entity_package":"Détection de colis","f_entity_battery":"Capteur de batterie","f_entity_charging":"Capteur de charge / alimentation","f_entity_signal":"Signal Wi-Fi","f_entity_chime":"Interrupteur carillon","f_entity_lock":"Serrure / gâche","f_entity_light":"Éclairage / projecteur","f_entity_night":"Vision nocturne / IR","f_ring_duration":"Durée de l’alerte sonnerie (s)","f_battery_low":"Alerte batterie faible sous (%)","f_confirm_unlock":"Confirmer avant de déverrouiller","f_show_snapshot":"Afficher la capture caméra","f_show_last_ring":"Tuile dernier appel","f_show_motion":"Tuile mouvement","f_show_person":"Tuile visiteur","f_show_package":"Tuile colis","f_show_battery":"Tuile batterie","f_show_signal":"Tuile Wi-Fi","f_show_chime":"Tuile carillon","f_show_lock":"Tuile serrure"},"hu":{"name":"Videós kapucsengő","idle":"Kész","ringing":"Csönget","person":"Látogató","package":"Csomag","motion":"Mozgás","unavailable":"Nem elérhető","last_ring":"Utolsó csöngetés","battery":"Akkumulátor","signal":"Wi-Fi","chime":"Csengő","lock":"Zár","detected":"Észlelve","clear":"Tiszta","low":"Alacsony","ok":"OK","on":"Be","off":"Ki","locked":"Zárva","unlocked":"Nyitva","btn_unlock":"Nyitás","btn_lock":"Zárás","btn_light":"Fény","confirm_unlock":"Kinyitja az ajtózárat?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"it":{"name":"Videocitofono","idle":"Pronto","ringing":"Sta suonando","person":"Visitatore","package":"Pacco","motion":"Movimento","unavailable":"Non disponibile","last_ring":"Ultimo squillo","battery":"Batteria","signal":"Wi-Fi","chime":"Suoneria","lock":"Serratura","detected":"Rilevato","clear":"Libero","low":"Bassa","ok":"OK","on":"Attivo","off":"Spento","locked":"Chiusa","unlocked":"Aperta","btn_unlock":"Apri","btn_lock":"Blocca","btn_light":"Luce","confirm_unlock":"Sbloccare la porta?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"nb":{"name":"Videoringeklokke","idle":"Klar","ringing":"Ringer","person":"Besøkende","package":"Pakke","motion":"Bevegelse","unavailable":"Utilgjengelig","last_ring":"Siste ring","battery":"Batteri","signal":"Wi-Fi","chime":"Ringeklokke","lock":"Lås","detected":"Oppdaget","clear":"Stille","low":"Lavt","ok":"OK","on":"På","off":"Av","locked":"Låst","unlocked":"Ulåst","btn_unlock":"Lås opp","btn_lock":"Lås","btn_light":"Lys","confirm_unlock":"Låse opp døren?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"nl":{"name":"Videodeurbel","idle":"Gereed","ringing":"Gaat over","person":"Bezoeker","package":"Pakket","motion":"Beweging","unavailable":"Niet beschikbaar","last_ring":"Laatste bel","battery":"Batterij","signal":"Wi-Fi","chime":"Deurbel","lock":"Slot","detected":"Gedetecteerd","clear":"Vrij","low":"Laag","ok":"OK","on":"Aan","off":"Uit","locked":"Vergrendeld","unlocked":"Ontgrendeld","btn_unlock":"Openen","btn_lock":"Sluiten","btn_light":"Licht","confirm_unlock":"Deur ontgrendelen?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"pl":{"name":"Wideodomofon","idle":"Gotowy","ringing":"Dzwoni","person":"Gość","package":"Paczka","motion":"Ruch","unavailable":"Niedostępny","last_ring":"Ostatni dzwonek","battery":"Bateria","signal":"Wi-Fi","chime":"Gong","lock":"Zamek","detected":"Wykryto","clear":"Brak","low":"Niski","ok":"OK","on":"Wł.","off":"Wył.","locked":"Zamknięty","unlocked":"Otwarty","btn_unlock":"Otwórz","btn_lock":"Zamknij","btn_light":"Światło","confirm_unlock":"Otworzyć zamek drzwi?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"pt-BR":{"name":"Campainha com vídeo","idle":"Pronta","ringing":"Tocando","person":"Visitante","package":"Pacote","motion":"Movimento","unavailable":"Indisponível","last_ring":"Último toque","battery":"Bateria","signal":"Wi-Fi","chime":"Campainha","lock":"Fechadura","detected":"Detectado","clear":"Livre","low":"Fraca","ok":"OK","on":"Ligada","off":"Desligada","locked":"Trancada","unlocked":"Destrancada","btn_unlock":"Destrancar","btn_lock":"Trancar","btn_light":"Luz","confirm_unlock":"Destrancar a porta?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"pt-PT":{"name":"Videoporteiro","idle":"Pronto","ringing":"A tocar","person":"Visitante","package":"Encomenda","motion":"Movimento","unavailable":"Indisponível","last_ring":"Último toque","battery":"Bateria","signal":"Wi-Fi","chime":"Campainha","lock":"Fechadura","detected":"Detetado","clear":"Livre","low":"Fraca","ok":"OK","on":"Ligado","off":"Desligado","locked":"Trancada","unlocked":"Destrancada","btn_unlock":"Abrir","btn_lock":"Trancar","btn_light":"Luz","confirm_unlock":"Destrancar a porta?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"ro":{"name":"Sonerie video","idle":"Pregătit","ringing":"Sună","person":"Vizitator","package":"Colet","motion":"Mișcare","unavailable":"Indisponibil","last_ring":"Ultimul apel","battery":"Baterie","signal":"Wi-Fi","chime":"Sonerie","lock":"Încuietoare","detected":"Detectat","clear":"Liber","low":"Scăzută","ok":"OK","on":"Pornit","off":"Oprit","locked":"Încuiată","unlocked":"Descuiată","btn_unlock":"Descuie","btn_lock":"Încuie","btn_light":"Lumină","confirm_unlock":"Descuiați ușa?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"ru":{"name":"Видеодомофон","idle":"Ожидание","ringing":"Звонок","person":"Посетитель","package":"Посылка","motion":"Движение","unavailable":"Недоступен","last_ring":"Посл. вызов","battery":"Батарея","signal":"Wi-Fi","chime":"Звонок дома","lock":"Замок","detected":"Есть","clear":"Чисто","low":"Низкий","ok":"ОК","on":"Вкл.","off":"Выкл.","locked":"Закрыт","unlocked":"Открыт","btn_unlock":"Открыть","btn_lock":"Закрыть","btn_light":"Подсветка","confirm_unlock":"Открыть замок двери?","f_entity_camera":"Камера (camera.*)","f_entity_image":"Сущность снимка (image.*)","f_image":"Своя ссылка на снимок","f_entity_ring":"Кнопка / событие вызова","f_entity_last_ring":"Время последнего вызова","f_entity_motion":"Датчик движения","f_entity_person":"Распознавание человека","f_entity_package":"Распознавание посылки","f_entity_battery":"Уровень батареи","f_entity_charging":"Зарядка / внешнее питание","f_entity_signal":"Сигнал Wi-Fi","f_entity_chime":"Домашний звонок (переключатель)","f_entity_lock":"Замок / защёлка двери","f_entity_light":"Подсветка крыльца","f_entity_night":"Ночной режим / ИК","f_ring_duration":"Длительность индикации вызова (с)","f_battery_low":"Предупреждение о разряде ниже (%)","f_confirm_unlock":"Подтверждать открытие замка","f_show_snapshot":"Показывать окно снимка камеры","f_show_last_ring":"Плитка последнего вызова","f_show_motion":"Плитка движения","f_show_person":"Плитка посетителя","f_show_package":"Плитка посылки","f_show_battery":"Плитка батареи","f_show_signal":"Плитка Wi-Fi","f_show_chime":"Плитка звонка","f_show_lock":"Плитка замка"},"sr":{"name":"Видео-интерфон","idle":"Спремно","ringing":"Звони","person":"Посетилац","package":"Пакет","motion":"Покрет","unavailable":"Недоступно","last_ring":"Последњи позив","battery":"Батерија","signal":"Wi-Fi","chime":"Звоно","lock":"Брава","detected":"Откривено","clear":"Мирно","low":"Ниско","ok":"ОК","on":"Укљ.","off":"Искљ.","locked":"Закључано","unlocked":"Откључано","btn_unlock":"Откључај","btn_lock":"Закључај","btn_light":"Светло","confirm_unlock":"Откључати врата?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"sr-Latn":{"name":"Video-interfon","idle":"Spremno","ringing":"Zvoni","person":"Posetilac","package":"Paket","motion":"Pokret","unavailable":"Nedostupno","last_ring":"Poslednji poziv","battery":"Baterija","signal":"Wi-Fi","chime":"Zvono","lock":"Brava","detected":"Otkriveno","clear":"Mirno","low":"Nisko","ok":"OK","on":"Uklj.","off":"Isklj.","locked":"Zaključano","unlocked":"Otključano","btn_unlock":"Otključaj","btn_lock":"Zaključaj","btn_light":"Svetlo","confirm_unlock":"Otključati vrata?","f_entity_camera":"Camera entity","f_entity_image":"Snapshot image entity","f_image":"Custom snapshot URL","f_entity_ring":"Doorbell ring / button entity","f_entity_last_ring":"Last ring timestamp sensor","f_entity_motion":"Motion sensor","f_entity_person":"Person detection sensor","f_entity_package":"Package detection sensor","f_entity_battery":"Battery sensor","f_entity_charging":"Charging / external power sensor","f_entity_signal":"Wi-Fi signal sensor","f_entity_chime":"Indoor chime switch","f_entity_lock":"Door lock / strike entity","f_entity_light":"Porch light / floodlight","f_entity_night":"Night vision / IR sensor","f_ring_duration":"Ring alert duration (s)","f_battery_low":"Low battery alert below (%)","f_confirm_unlock":"Confirm before unlocking","f_show_snapshot":"Show camera snapshot","f_show_last_ring":"Last ring tile","f_show_motion":"Motion tile","f_show_person":"Visitor tile","f_show_package":"Package tile","f_show_battery":"Battery tile","f_show_signal":"Wi-Fi tile","f_show_chime":"Chime tile","f_show_lock":"Lock tile"},"uk":{"name":"Відеодомофон","idle":"Очікування","ringing":"Дзвінок","person":"Відвідувач","package":"Посилка","motion":"Рух","unavailable":"Недоступний","last_ring":"Ост. виклик","battery":"Батарея","signal":"Wi-Fi","chime":"Дзвінок вдома","lock":"Замок","detected":"Виявлено","clear":"Чисто","low":"Низький","ok":"ОК","on":"Увімк.","off":"Вимк.","locked":"Замкнено","unlocked":"Відчинено","btn_unlock":"Відчинити","btn_lock":"Замкнути","btn_light":"Підсвітка","confirm_unlock":"Відчинити замок дверей?","f_entity_camera":"Камера (camera.*)","f_entity_image":"Сутність знімка (image.*)","f_image":"Власне посилання на знімок","f_entity_ring":"Кнопка / подія виклику","f_entity_last_ring":"Час останнього виклику","f_entity_motion":"Датчик руху","f_entity_person":"Розпізнавання людини","f_entity_package":"Розпізнавання посилки","f_entity_battery":"Рівень батареї","f_entity_charging":"Заряджання / зовнішнє живлення","f_entity_signal":"Сигнал Wi-Fi","f_entity_chime":"Домашній дзвінок","f_entity_lock":"Замок дверей","f_entity_light":"Підсвітка ґанку","f_entity_night":"Нічний режим / ІЧ","f_ring_duration":"Тривалість індикації виклику (с)","f_battery_low":"Сповіщення розряду нижче (%)","f_confirm_unlock":"Підтверджувати відмикання","f_show_snapshot":"Показувати вікно знімка камери","f_show_last_ring":"Плитка останнього виклику","f_show_motion":"Плитка руху","f_show_person":"Плитка відвідувача","f_show_package":"Плитка посилки","f_show_battery":"Плитка батареї","f_show_signal":"Плитка Wi-Fi","f_show_chime":"Плитка дзвінка","f_show_lock":"Плитка замка"}};
  const esc = window.applianceEsc || ((s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));

  const CSS = `
:host{display:block;height:100%}
ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --db-ok:var(--appliance-ok-color,#43a047);--db-ring:#29b6f6;--db-warn:var(--appliance-warn-color,#ffa000);--db-alert:var(--appliance-alert-color,#db4437);--db-c:var(--db-ok)}
ha-card.ringing{--db-c:var(--db-ring);box-shadow:0 0 0 1.5px color-mix(in srgb,var(--db-ring) 70%,transparent),0 0 22px color-mix(in srgb,var(--db-ring) 32%,transparent)}
ha-card.person{--db-c:#ff5252;box-shadow:0 0 0 1px color-mix(in srgb,#ff5252 60%,transparent),0 0 16px color-mix(in srgb,#ff5252 24%,transparent)}
ha-card.package{--db-c:#ab47bc;box-shadow:0 0 0 1px color-mix(in srgb,#ab47bc 60%,transparent),0 0 16px color-mix(in srgb,#ab47bc 24%,transparent)}
ha-card.motion{--db-c:var(--db-warn);box-shadow:0 0 0 1px color-mix(in srgb,var(--db-warn) 60%,transparent),0 0 16px color-mix(in srgb,var(--db-warn) 24%,transparent)}
ha-card.unavailable{--db-c:#8a929a}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:color-mix(in srgb,var(--db-c) 20%,transparent);color:var(--db-c);white-space:nowrap}
.stage{display:flex;align-items:stretch;gap:8px;margin-top:6px;cursor:pointer}
.unit{flex:0 0 calc(84px * var(--illus-scale,1));width:calc(84px * var(--illus-scale,1));display:flex;align-items:center;justify-content:center}
.unit svg{display:block;width:100%;height:auto;overflow:visible}
.unit.alone{margin:0 auto;flex:0 0 calc(108px * var(--illus-scale,1));width:calc(108px * var(--illus-scale,1))}
.viewport{position:relative;flex:1 1 140px;min-width:0;min-height:112px;border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 45%,#242c38,#12171f 80%);display:flex;align-items:center;justify-content:center}
.viewport img,.viewport svg.scene{display:block;width:100%;height:100%;max-height:calc(146px * var(--illus-scale,1));object-fit:cover}
.viewport.hide{display:none}
.vf{position:absolute;inset:6px;pointer-events:none;border-radius:6px;--c:rgba(255,255,255,.45);
  background:linear-gradient(var(--c),var(--c)) 0 0/12px 2px,linear-gradient(var(--c),var(--c)) 0 0/2px 12px,
  linear-gradient(var(--c),var(--c)) 100% 0/12px 2px,linear-gradient(var(--c),var(--c)) 100% 0/2px 12px,
  linear-gradient(var(--c),var(--c)) 0 100%/12px 2px,linear-gradient(var(--c),var(--c)) 0 100%/2px 12px,
  linear-gradient(var(--c),var(--c)) 100% 100%/12px 2px,linear-gradient(var(--c),var(--c)) 100% 100%/2px 12px;background-repeat:no-repeat}
.ringing .vf,.person .vf,.motion .vf,.package .vf{--c:var(--db-c)}
.live{position:absolute;left:10px;top:9px;display:flex;align-items:center;gap:4px;padding:2px 6px;border-radius:8px;background:rgba(0,0,0,.55);color:#fff;font:700 9px/1 sans-serif;letter-spacing:.4px}
.live i{width:6px;height:6px;border-radius:50%;background:#43a047;animation:dbblink 1.8s ease-in-out infinite}
.ringing .live i{background:var(--db-ring);animation:dbblink .5s steps(2) infinite}
.unavailable .live{display:none}
.det{position:absolute;left:8px;bottom:8px;display:none;align-items:center;gap:4px;padding:3px 7px;border-radius:10px;background:color-mix(in srgb,var(--db-c) 88%,#000);color:#fff;font:600 10.5px/13px sans-serif}
.det ha-icon{--mdc-icon-size:14px}
.ringing .det,.person .det,.package .det,.motion .det{display:flex}
.lastov{position:absolute;right:8px;bottom:8px;padding:2px 6px;border-radius:8px;background:rgba(0,0,0,.55);color:#e4ebf5;font:500 10px/13px sans-serif;max-width:56%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lastov:empty{display:none}
/* doorbell unit SVG animations */
.btn-ring{fill:none;stroke:var(--db-c);stroke-width:2.8;filter:drop-shadow(0 0 4px var(--db-c));transition:stroke .3s}
.idle .btn-ring{animation:dbreathe 3s ease-in-out infinite}
.ringing .btn-ring{stroke-width:3.6;animation:dbping .7s ease-in-out infinite alternate}
.rwave{fill:none;stroke:var(--db-ring);stroke-width:2;opacity:0}
.ringing .rwave{animation:dbwave 1.5s ease-out infinite}
.rwave.w2{animation-delay:.75s!important}
.bell-ico{transform-origin:55px 128px}
.ringing .bell-ico{animation:dbshake .35s ease-in-out infinite}
.ir-led{fill:#ff3b30;opacity:0;transition:opacity .3s}.night .ir-led{opacity:.85}
.cam-led{fill:#43a047}.ringing .cam-led{fill:var(--db-ring)}.person .cam-led{fill:#ff5252}.motion .cam-led{fill:var(--db-warn)}
.bat-warn{opacity:0}.lowbat .bat-warn{opacity:1;animation:dbblink 1.2s infinite}
.visitor,.parcel,.rad-wave{opacity:0;transition:opacity .3s}
.ringing .visitor,.person .visitor{opacity:1}
.package .parcel{opacity:1}
.motion .rad-wave{opacity:.8;animation:dbwave 1.8s ease-out infinite}
.night .scene-sky{fill:#0e172a}.night .scene-moon{opacity:1}.scene-moon{opacity:0}
.unavailable svg{filter:grayscale(.8) opacity(.55)}
.noanim *{animation:none!important;transition:none!important}
.ctrls{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.ctrls.hide{display:none}
.ctrls button{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 11.5px/15px var(--paper-font-body1_-_font-family,inherit)}
.ctrls button.on{background:color-mix(in srgb,var(--db-c) 24%,var(--secondary-background-color));color:var(--db-c)}
.ctrls button ha-icon{--mdc-icon-size:15px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile.extra{flex-direction:column-reverse}:host([tile-order="name"]) .tile.extra{flex-direction:column}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.on .v,.tile.on .l{color:var(--db-c)}.tile.warn .v{color:var(--db-warn)}.tile.bad .v,.tile.bad .l{color:var(--db-alert)}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .stage{margin-top:4px;gap:6px}.compact .viewport{min-height:82px}.compact .tiles{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
@keyframes dbblink{50%{opacity:.2}}
@keyframes dbreathe{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes dbping{from{opacity:.6;transform:scale(.97)}to{opacity:1;transform:scale(1.04)}}
@keyframes dbwave{0%{opacity:.8;transform:scale(.75)}100%{opacity:0;transform:scale(1.85)}}
@keyframes dbshake{0%,100%{transform:rotate(0)}25%{transform:rotate(-14deg)}75%{transform:rotate(14deg)}}
`;

  const UNIT_SVG = (label) => `<svg viewBox="0 0 110 180" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="dbbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#353d49"/><stop offset=".6" stop-color="#21262e"/><stop offset="1" stop-color="#14181e"/></linearGradient>
    <radialGradient id="dblens" cx=".38" cy=".35"><stop offset="0" stop-color="#5d7b9e"/><stop offset=".45" stop-color="#162130"/><stop offset="1" stop-color="#05070a"/></radialGradient>
    <radialGradient id="dbsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="55" cy="173" rx="34" ry="5" fill="url(#dbsh)"/>
    <rect x="20" y="8" width="70" height="160" rx="18" fill="url(#dbbody)" stroke="#535d6b" stroke-width="1.4"/>
    <rect x="24" y="12" width="62" height="152" rx="15" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
    <!-- объектив камеры -->
    <circle cx="55" cy="48" r="22" fill="#0d1015" stroke="#454e59" stroke-width="1.5"/>
    <circle cx="55" cy="48" r="14" fill="url(#dblens)"/>
    <circle cx="50" cy="43" r="3.2" fill="#fff" opacity=".32"/>
    <circle class="cam-led" cx="55" cy="21" r="2.2"/>
    <!-- ИК-диоды ночной подсветки -->
    <circle class="ir-led" cx="37" cy="40" r="1.6"/><circle class="ir-led" cx="73" cy="40" r="1.6"/>
    <circle class="ir-led" cx="37" cy="56" r="1.6"/><circle class="ir-led" cx="73" cy="56" r="1.6"/>
    <!-- решётка динамика -->
    <g fill="#12161c"><circle cx="43" cy="84" r="1.4"/><circle cx="49" cy="84" r="1.4"/><circle cx="55" cy="84" r="1.4"/><circle cx="61" cy="84" r="1.4"/><circle cx="67" cy="84" r="1.4"/>
      <circle cx="46" cy="90" r="1.4"/><circle cx="52" cy="90" r="1.4"/><circle cx="58" cy="90" r="1.4"/><circle cx="64" cy="90" r="1.4"/></g>
    <!-- кнопка вызова и световое кольцо -->
    <circle class="rwave" cx="55" cy="128" r="20" style="transform-origin:55px 128px"/>
    <circle class="rwave w2" cx="55" cy="128" r="20" style="transform-origin:55px 128px"/>
    <circle cx="55" cy="128" r="17" fill="#181d24"/>
    <circle class="btn-ring" cx="55" cy="128" r="16.5" style="transform-origin:55px 128px"/>
    <path class="bell-ico" d="M55 119 c-3.2 0-5.5 2.4-5.5 5.6 v3.8 l-1.5 1.8 h14 l-1.5-1.8 v-3.8 c0-3.2-2.3-5.6-5.5-5.6 z M53.3 132 a1.8 1.8 0 0 0 3.4 0" fill="#dbe5f0"/>
    <!-- индикатор низкого заряда -->
    <g class="bat-warn" transform="translate(69 12)"><rect x="0" y="0" width="14" height="8" rx="1.5" fill="none" stroke="#db4437" stroke-width="1.4"/><rect x="14" y="2" width="2" height="4" fill="#db4437"/><rect x="2" y="2" width="3" height="4" fill="#db4437"/></g>
  </svg>`;

  const SCENE_SVG = `<svg class="scene" viewBox="0 0 220 136" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect class="scene-sky" width="220" height="136" fill="#1f3147"/>
    <circle class="scene-moon" cx="186" cy="24" r="10" fill="#dce6ff"/>
    <path d="M0 96 L220 96 L220 136 L0 136 Z" fill="#2c333d"/>
    <path d="M26 96 L48 136 L172 136 L194 96 Z" fill="#3a4350"/>
    <rect x="64" y="18" width="92" height="78" fill="#1d242e" stroke="#455160" stroke-width="1.5"/>
    <circle class="rad-wave" cx="110" cy="70" r="24" fill="none" stroke="#ffa000" stroke-width="2" style="transform-origin:110px 70px"/>
    <g class="visitor">
      <circle cx="110" cy="52" r="12" fill="#e0e7ef"/>
      <path d="M88 96 C88 74 132 74 132 96 Z" fill="#b0bec5"/>
    </g>
    <g class="parcel" transform="translate(132 94)">
      <rect x="0" y="0" width="28" height="22" rx="2" fill="#c79563" stroke="#8c6239" stroke-width="1.2"/>
      <path d="M11 0 v22 M0 8 h28" stroke="#8c6239" stroke-width="1.2"/>
      <rect x="18" y="11" width="7" height="5" fill="#fff" opacity=".8"/>
    </g>
  </svg>`;

  const TILES = [
    ['last_ring', 'mdi:bell-ring-outline', 'entity_last_ring', 'show_last_ring'],
    ['motion', 'mdi:motion-sensor', 'entity_motion', 'show_motion'],
    ['person', 'mdi:account-outline', 'entity_person', 'show_person'],
    ['package', 'mdi:package-variant-closed', 'entity_package', 'show_package'],
    ['battery', 'mdi:battery', 'entity_battery', 'show_battery'],
    ['signal', 'mdi:wifi', 'entity_signal', 'show_signal'],
    ['chime', 'mdi:bell-outline', 'entity_chime', 'show_chime'],
    ['lock', 'mdi:lock', 'entity_lock', 'show_lock'],
  ];

  const ON_RE = /^(on|true|yes|1|detected|active|ringing|pressed|motion|person|open|home|night|nuit)$/i;
  const Base = window.ApplianceStandaloneBase || HTMLElement;

  class ApplianceVideoDoorbellCard extends Base {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const find = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        entity_camera: find(/(doorbell|sonnette|intercom|ring|front_door)/i, 'camera') || ids.find((i) => i.startsWith('camera.')) || '',
        entity_ring: find(/(doorbell|ding|ring|button|sonnette|звонок)/i, 'binary_sensor') || find(/(doorbell|ding|ring)/i, 'event'),
        entity_motion: find(/(doorbell|front|porch).*motion/i, 'binary_sensor'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = {
        ring_duration: 30, battery_low: 20, confirm_unlock: true,
        show_status: true, show_snapshot: true, show_controls: true, ...Object.fromEntries(TILES.map(([, , , o]) => [o, true])), ...c,
      };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c, 15000); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return (T[this._lang(T)] || {})[k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._loc(), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _on(id) { const s = this._st(id); return this._ok(s) && ON_RE.test(String(s.state).trim()); }

    _ringTimestamp() {
      const c = this._c, lr = this._st(c.entity_last_ring), rg = this._st(c.entity_ring);
      if (this._ok(lr)) {
        const ts = Date.parse(String(lr.state));
        if (isFinite(ts)) return ts;
        if (lr.last_changed && isFinite(Date.parse(lr.last_changed))) return Date.parse(lr.last_changed);
      }
      if (this._ok(rg)) {
        const ts = Date.parse(String(rg.state));
        if (isFinite(ts)) return ts;
        if (this._on(c.entity_ring) && rg.last_changed) return Date.parse(rg.last_changed);
        if (/^event\./.test(c.entity_ring || '') && rg.last_changed) return Date.parse(rg.last_changed);
      }
      return NaN;
    }

    _fmtAgo(ts) {
      if (!isFinite(ts)) {
        const lr = this._st(this._c.entity_last_ring);
        return this._ok(lr) ? String(lr.state) : '--';
      }
      const sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
      if (sec < 60) return window.applianceClock(this._hass, new Date(ts), this._loc(true));
      const min = Math.floor(sec / 60);
      if (min < 60) return `${min} min`;
      const h = Math.floor(min / 60);
      if (h < 24) return `${h} h`;
      return new Date(ts).toLocaleDateString(this._loc(true), { day: 'numeric', month: 'short' });
    }

    _snapUrl() {
      const c = this._c;
      if (c.image && String(c.image).trim()) return String(c.image).trim();
      for (const id of [c.entity_image, c.entity_camera]) {
        const s = this._st(id);
        const pic = s && s.attributes && (s.attributes.entity_picture || s.attributes.entity_picture_local);
        if (pic && /^(https?:\/\/|\/|data:)/i.test(pic)) {
          return /^https?:|^data:/i.test(pic) ? pic : (this._hass && typeof this._hass.hassUrl === 'function' ? this._hass.hassUrl(pic) : pic);
        }
      }
      return '';
    }

    _build() {
      const root = this._ensureRoot();
      const label = esc(this._c.name || this._t('name'));
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="dbtitle"></div><div class="badge" id="dbbadge"></div></div>
        <div class="stage" id="dbstage">
          <div class="unit" id="dbunit">${UNIT_SVG(label)}</div>
          <div class="viewport" id="dbvp">
            <img id="dbimg" alt="${label}" style="display:none">
            <div id="dbscene">${SCENE_SVG}</div>
            <div class="vf"></div>
            <div class="live"><i></i><span id="dblive">LIVE</span></div>
            <div class="det"><ha-icon id="dbdi" icon="mdi:bell-ring"></ha-icon><span id="dbdt"></span></div>
            <div class="lastov" id="dblastov"></div>
          </div>
        </div>
        <div class="ctrls" id="dbctrls"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.getElementById('dbstage'), () => this._more(this._c.entity_camera || this._c.entity_ring || this._c.entity_person || this._c.entity_motion || this._c.entity_image));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const k = el.dataset.k, def = TILES.find((t) => t[0] === k);
        const id = (k === 'last_ring' ? (this._c.entity_last_ring || this._c.entity_ring) : def && this._c[def[2]]);
        this._more(id);
      }));
      root.getElementById('dbctrls').addEventListener('click', (e) => {
        const b = e.target.closest('button'); if (!b) return;
        e.stopPropagation();
        this._cmd(b.dataset.k);
      });
      this._card = root.querySelector('ha-card'); this._built = true;
    }

    _cmd(k) {
      const c = this._c, h = this._hass; if (!h) return;
      if (k === 'lock' && c.entity_lock) {
        const id = c.entity_lock, d = id.split('.')[0], st = this._st(id);
        const isLocked = d === 'lock' && st && String(st.state).toLowerCase() === 'locked';
        const run = () => {
          if (d === 'lock') h.callService('lock', isLocked ? 'unlock' : 'lock', { entity_id: id });
          else if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: id });
          else if (d === 'script') h.callService('script', 'turn_on', { entity_id: id });
          else h.callService(['switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: id });
        };
        if (c.confirm_unlock !== false && (d !== 'lock' || isLocked) && window.applianceConfirm) {
          window.applianceConfirm(this, { action: 'toggle', confirmation: { text: this._t('confirm_unlock') } }, run);
        } else run();
      } else if (k === 'chime' && c.entity_chime) {
        const d = c.entity_chime.split('.')[0];
        h.callService(['switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity_chime });
      } else if (k === 'light' && c.entity_light) {
        const d = c.entity_light.split('.')[0];
        h.callService(['light', 'switch', 'input_boolean'].includes(d) ? d : 'homeassistant', 'toggle', { entity_id: c.entity_light });
      }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const ids = ['entity_camera', 'entity_image', 'entity_ring', 'entity_last_ring', 'entity_motion', 'entity_person', 'entity_package', 'entity_battery', 'entity_chime', 'entity_lock'].map((k) => c[k]).filter(Boolean);
      const online = !ids.length || ids.some((i) => this._ok(this._st(i)));
      const ringTs = this._ringTimestamp();
      const recentRing = isFinite(ringTs) && (Date.now() - ringTs) < Number(c.ring_duration ?? 30) * 1000;
      const ringing = online && (this._on(c.entity_ring) || recentRing);
      const person = online && this._on(c.entity_person);
      const pkg = online && this._on(c.entity_package);
      const motion = online && this._on(c.entity_motion);
      const nightS = this._st(c.entity_night), night = this._ok(nightS) && /^(on|night|nuit|true|ir|dark)$/i.test(String(nightS.state).trim());
      const st = !online ? 'unavailable' : ringing ? 'ringing' : person ? 'person' : pkg ? 'package' : motion ? 'motion' : 'idle';

      const bS = this._st(c.entity_battery), bBin = !!bS && /^binary_sensor\./.test(c.entity_battery), bat = !bBin ? this._num(c.entity_battery) : NaN;
      const lowBat = bBin ? this._on(c.entity_battery) : isFinite(bat) && bat < Number(c.battery_low);
      card.className = `${st}${night ? ' night' : ''}${lowBat ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;

      r.getElementById('dbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('dbbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      const showVp = c.show_snapshot !== false;
      r.getElementById('dbvp').classList.toggle('hide', !showVp);
      r.getElementById('dbunit').classList.toggle('alone', !showVp);
      const url = showVp ? this._snapUrl() : '';
      const img = r.getElementById('dbimg'), sc = r.getElementById('dbscene');
      if (url) { if (img.getAttribute('src') !== url) img.setAttribute('src', url); img.style.display = ''; sc.style.display = 'none'; }
      else { img.style.display = 'none'; sc.style.display = ''; }

      r.getElementById('dblive').textContent = ringing ? 'RING' : 'LIVE';
      const detIco = { ringing: 'mdi:bell-ring', person: 'mdi:walk', package: 'mdi:package-variant-closed', motion: 'mdi:motion-sensor' }[st];
      if (detIco) { r.getElementById('dbdi').setAttribute('icon', detIco); r.getElementById('dbdt').textContent = this._t(st); }
      const ago = this._fmtAgo(ringTs);
      r.getElementById('dblastov').textContent = ago !== '--' ? `${this._t('last_ring')}: ${ago}` : '';

      const lockS = this._st(c.entity_lock), chimeS = this._st(c.entity_chime), lightS = this._st(c.entity_light);
      const locked = lockS && String(lockS.state).toLowerCase() === 'locked';
      const chimeOn = this._on(c.entity_chime), lightOn = this._on(c.entity_light);
      const ctr = r.getElementById('dbctrls');
      const btns = [
        c.entity_lock ? ['lock', locked ? 'mdi:lock-open-outline' : 'mdi:lock', this._t(locked ? 'btn_unlock' : 'btn_lock'), !locked] : null,
        c.entity_chime && /^(switch|input_boolean)\./.test(c.entity_chime) ? ['chime', chimeOn ? 'mdi:bell-ring-outline' : 'mdi:bell-off-outline', this._l('chime'), chimeOn] : null,
        c.entity_light ? ['light', lightOn ? 'mdi:flashlight' : 'mdi:flashlight-off', this._t('btn_light'), lightOn] : null,
      ].filter(Boolean);
      ctr.classList.toggle('hide', !btns.length || c.show_controls === false);
      const sig = btns.map((b) => b.join('|')).join(';');
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, ic, lbl, on]) => `<button class="${on ? 'on' : ''}" data-k="${k}" title="${esc(lbl)}" aria-label="${esc(lbl)}"><ha-icon icon="${ic}"></ha-icon><span>${esc(lbl)}</span></button>`).join('');
      }

      const sigN = this._num(c.entity_signal), sigU = this._unit(c.entity_signal, isFinite(sigN) && sigN < 0 ? 'dBm' : '%');
      const dv = (k, id) => [id, this._ok(this._st(id)) ? this._t(this._on(id) ? 'detected' : 'clear') : '--', '', this._on(id) ? 'on' : ''];
      const V = {
        last_ring: [c.entity_last_ring || c.entity_ring, ago, '', ringing ? 'on' : ''],
        motion: dv('motion', c.entity_motion),
        person: dv('person', c.entity_person),
        package: dv('package', c.entity_package),
        battery: [c.entity_battery, isFinite(bat) ? this._fmt(bat, 0) : this._ok(bS) ? this._t(lowBat ? 'low' : 'ok') : '--', isFinite(bat) ? '%' : '', lowBat ? 'bad' : ''],
        signal: [c.entity_signal, this._fmt(sigN, 0), isFinite(sigN) ? sigU : '', ''],
        chime: [c.entity_chime, this._ok(chimeS) ? (/^(switch|input_boolean)$/.test(c.entity_chime.split('.')[0]) ? this._t(chimeOn ? 'on' : 'off') : String(chimeS.state)) : '--', '', chimeOn ? 'on' : ''],
        lock: [c.entity_lock, this._ok(lockS) ? this._t(locked ? 'locked' : 'unlocked') : '--', '', locked ? '' : 'warn'],
      };
      TILES.forEach(([k, defIc, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit, cls] = V[k];
        el.className = `tile${!show || c[opt] === false ? ' hide' : ''}${cls ? ' ' + cls : ''}`;
        const baseIc = k === 'battery' ? (this._on(c.entity_charging) ? 'mdi:battery-charging' : lowBat ? 'mdi:battery-alert' : 'mdi:battery')
          : k === 'lock' ? (locked ? 'mdi:lock' : 'mdi:lock-open-outline')
          : k === 'chime' ? (chimeOn ? 'mdi:bell-outline' : 'mdi:bell-off-outline') : defIc;
        const ic = window.applianceIcon ? window.applianceIcon(c, k, baseIc) : baseIc;
        const ico = el.querySelector('.l ha-icon'); if (ico && ico.getAttribute('icon') !== ic) ico.setAttribute('icon', ic);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
      if (window.applianceExtraTiles) window.applianceExtraTiles(this, r.querySelector('.tiles'), c.extra_tiles, this._hass, c);
    }
  }

  /* ---- éditeur visuel ---- */
  class ApplianceVideoDoorbellCardEditor extends HTMLElement {
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
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'icons', selector: { object: {} } },
        ent('entity_camera', ['camera']),
        ent('entity_image', ['image']),
        { name: 'image', selector: { text: {} } },
        ent('entity_ring', ['binary_sensor', 'event', 'sensor', 'input_boolean']),
        ent('entity_last_ring', ['sensor', 'event', 'input_datetime']),
        ent('entity_motion', ['binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_person', ['binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_package', ['binary_sensor', 'sensor', 'input_boolean']),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        ent('entity_charging', ['binary_sensor', 'sensor']),
        ent('entity_signal', ['sensor']),
        ent('entity_chime', ['switch', 'input_boolean', 'select', 'sensor']),
        ent('entity_lock', ['lock', 'switch', 'button', 'input_button', 'script']),
        ent('entity_light', ['light', 'switch', 'input_boolean']),
        ent('entity_night', ['binary_sensor', 'switch', 'sensor']),
        { name: 'extra_tiles', selector: { object: {} } },
        { type: 'grid', name: '', schema: [num('ring_duration', 5, 300, 5, 30, 's'), num('battery_low', 1, 50, 1, 20, '%')] },
        { name: 'confirm_unlock', selector: { boolean: {} }, default: true },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_snapshot'), bool('show_controls'), ...TILES.map(([, , , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => {
        const l = window.applianceLang(T, this._c, this._hass);
        return T[l]?.[`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass);
      };
    }
  }
  if (!(window.__acHasReal||customElements.get.bind(customElements))(TAG + '-editor')) (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceVideoDoorbellCardEditor);

  window.applianceDefine(TAG, ApplianceVideoDoorbellCard, {
    name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Видеодомофон / умный дверной звонок: звонок, посетитель, посылка, движение, батарея, снимок с камеры и замок.',
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/video-doorbell.md',
  });
})();
