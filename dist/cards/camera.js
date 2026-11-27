/* Cartes « Caméra » et « NVR » — custom:appliance-camera-card, custom:appliance-nvr-card
 * Caméra : photo détourée (modèles dome / bullet / turret, ou votre propre image), cadre de visée avec point REC,
 * détections (mouvement, personne, animal, véhicule) qui allument un halo et des ondes de la couleur du type détecté,
 * mode nuit (scène bleutée, lune), mémoire libre de la carte SD ; un clic sur la caméra ouvre le flux vidéo (fiche de l'entité camera).
 * NVR : photo détourée de l'enregistreur, voyants PWR / HDD qui s'animent, mémoire et disque libres, puissance, énergie, uptime, CPU.
 */
(() => {
  if ((window.__acHasReal||customElements.get.bind(customElements))('appliance-camera-card')) return;

  const T = {"en":{"name_camera":"Camera","name_nvr":"NVR recorder","idle":"Monitoring","offline":"Offline","motion":"Motion","person":"Person","animal":"Animal","vehicle":"Vehicle","detected":"Detected","clear":"None","sd":"SD card","night":"Night","day":"Day","running":"Recording","busy":"High load","disk_low":"Disk almost full","off":"Off","unavailable":"Unavailable","memory":"Memory free","disk":"Disk free","power":"Power","energy":"Energy","uptime":"Uptime","cpu":"CPU","d":"d","h":"h","f_model":"Camera model","f_entity_camera":"Camera (video on click)","f_entity_motion":"Motion detected","f_entity_person":"Person detected","f_entity_animal":"Animal detected","f_entity_vehicle":"Vehicle detected","f_entity_sd":"SD card free space","f_entity_night":"Night / day switch","f_sd_low":"Low SD space threshold (%)","f_show_motion":"Motion tile","f_show_person":"Person tile","f_show_animal":"Animal tile","f_show_vehicle":"Vehicle tile","f_show_sd":"SD card tile","f_show_night":"Night / day tile","f_entity_memory_free":"Memory free (%)","f_entity_disk_free":"Disk space free (%)","f_disk_low":"Disk almost full below (%)","f_cpu_high":"High CPU load from (%)","video_loss":"Video lost","blinded":"Camera blinded","disk_problem":"Disk problem","rec_on":"Recording","rec_off":"Stopped","recording":"Recording","bitrate":"Bitrate","channels":"Channels online","rec_channels":"Recording","disk_used":"Disk used","archive":"Archive","f_nvr_model":"NVR model","f_entity_recording":"Recording (REC)","f_entity_connected":"Connected","f_entity_video_loss":"Video loss","f_entity_blinded":"Camera blinded","f_entity_bitrate":"Bitrate","f_entity_channels_online":"Channels online","f_entity_recording_channels":"Channels recording","f_entity_disk_used":"Disk used","f_entity_archive_start":"Archive start (date)","f_entity_archive_end":"Archive end (date)","f_entity_disk_problem":"Disk problem","f_show_recording":"Recording tile","f_show_bitrate":"Bitrate tile","f_show_channels":"Channels online tile","f_show_rec_channels":"Recording channels tile","f_show_disk_used":"Disk used tile","f_show_archive":"Archive tile"},"es":{"name_camera":"Cámara","name_nvr":"Grabador NVR","idle":"Vigilando","offline":"Desconectada","motion":"Movimiento","person":"Persona","animal":"Animal","vehicle":"Vehículo","detected":"Detectado","clear":"Nada","sd":"Tarjeta SD","night":"Noche","day":"Día","running":"Grabando","busy":"Carga alta","disk_low":"Disco casi lleno","off":"Apagada","unavailable":"No disponible","memory":"Memoria libre","disk":"Disco libre","power":"Potencia","energy":"Energía","uptime":"Tiempo en marcha","cpu":"CPU","d":"d","h":"h","f_model":"Modelo de cámara","f_entity_camera":"Cámara (vídeo al pulsar)","f_entity_motion":"Movimiento detectado","f_entity_person":"Persona detectada","f_entity_animal":"Animal detectado","f_entity_vehicle":"Vehículo detectado","f_entity_sd":"Espacio libre de la tarjeta SD","f_entity_night":"Interruptor noche / día","f_sd_low":"Umbral de poco espacio en la SD (%)","f_show_motion":"Mostrar el movimiento","f_show_person":"Mostrar las personas","f_show_animal":"Mostrar los animales","f_show_vehicle":"Mostrar los vehículos","f_show_sd":"Mostrar la tarjeta SD","f_show_night":"Mostrar noche / día","f_entity_memory_free":"Memoria libre (%)","f_entity_disk_free":"Espacio libre en disco (%)","f_disk_low":"Disco casi lleno por debajo de (%)","f_cpu_high":"Carga de CPU alta a partir de (%)","video_loss":"Pérdida de vídeo","blinded":"Cámara tapada","disk_problem":"Problema de disco","rec_on":"Grabando","rec_off":"Detenida","recording":"Grabación","bitrate":"Tasa de bits","channels":"Canales en línea","rec_channels":"Grabando","disk_used":"Disco usado","archive":"Archivo","f_nvr_model":"Modelo de NVR","f_entity_recording":"Grabación (REC)","f_entity_connected":"Conectado","f_entity_video_loss":"Pérdida de vídeo","f_entity_blinded":"Cámara tapada","f_entity_bitrate":"Tasa de bits","f_entity_channels_online":"Canales en línea","f_entity_recording_channels":"Canales grabando","f_entity_disk_used":"Disco usado","f_entity_archive_start":"Inicio del archivo (fecha)","f_entity_archive_end":"Fin del archivo (fecha)","f_entity_disk_problem":"Problema de disco","f_show_recording":"Mostrar la grabación","f_show_bitrate":"Mostrar la tasa de bits","f_show_channels":"Mostrar los canales en línea","f_show_rec_channels":"Mostrar los canales grabando","f_show_disk_used":"Mostrar el disco usado","f_show_archive":"Mostrar el archivo"},"fr":{"name_camera":"Caméra","name_nvr":"Enregistreur NVR","idle":"Surveillance","offline":"Hors ligne","motion":"Mouvement","person":"Personne","animal":"Animal","vehicle":"Véhicule","detected":"Détecté","clear":"Aucun","sd":"Carte SD","night":"Nuit","day":"Jour","running":"Enregistrement","busy":"Charge élevée","disk_low":"Disque presque plein","off":"Éteint","unavailable":"Indisponible","memory":"Mémoire libre","disk":"Disque libre","power":"Puissance","energy":"Énergie","uptime":"Uptime","cpu":"CPU","d":"j","h":"h","f_model":"Modèle de caméra","f_entity_camera":"Caméra (vidéo au clic)","f_entity_motion":"Mouvement détecté","f_entity_person":"Personne détectée","f_entity_animal":"Animal détecté","f_entity_vehicle":"Véhicule détecté","f_entity_sd":"Espace libre carte SD","f_entity_night":"Interrupteur nuit / jour","f_sd_low":"Seuil carte SD presque pleine (%)","f_show_motion":"Tuile mouvement","f_show_person":"Tuile personne","f_show_animal":"Tuile animal","f_show_vehicle":"Tuile véhicule","f_show_sd":"Tuile carte SD","f_show_night":"Tuile nuit / jour","f_entity_memory_free":"Mémoire libre (%)","f_entity_disk_free":"Espace disque libre (%)","f_disk_low":"Disque presque plein sous (%)","f_cpu_high":"Charge CPU élevée dès (%)","video_loss":"Vidéo perdue","blinded":"Caméra masquée","disk_problem":"Problème de disque","rec_on":"Enregistre","rec_off":"Arrêté","recording":"Enregistrement","bitrate":"Débit","channels":"Canaux en ligne","rec_channels":"En enreg.","disk_used":"Disque utilisé","archive":"Archive","f_nvr_model":"Modèle de l'enregistreur","f_entity_recording":"Enregistrement (REC)","f_entity_connected":"Connecté","f_entity_video_loss":"Perte de vidéo","f_entity_blinded":"Caméra masquée","f_entity_bitrate":"Débit","f_entity_channels_online":"Canaux en ligne","f_entity_recording_channels":"Canaux en enregistrement","f_entity_disk_used":"Disque utilisé","f_entity_archive_start":"Début de l'archive (date)","f_entity_archive_end":"Fin de l'archive (date)","f_entity_disk_problem":"Problème de disque","f_show_recording":"Tuile enregistrement","f_show_bitrate":"Tuile débit","f_show_channels":"Tuile canaux en ligne","f_show_rec_channels":"Tuile canaux en enregistrement","f_show_disk_used":"Tuile disque utilisé","f_show_archive":"Tuile archive"},"pt-BR":{"name_camera":"Câmera","name_nvr":"Gravador NVR","idle":"Monitorando","offline":"Offline","motion":"Movimento","person":"Pessoa","animal":"Animal","vehicle":"Veículo","detected":"Detectado","clear":"Nenhum","sd":"Cartão SD","night":"Noite","day":"Dia","running":"Gravando","busy":"Carga elevada","disk_low":"Disco quase cheio","off":"Desligado","unavailable":"Indisponível","memory":"Memória livre","disk":"Espaço livre no disco","power":"Potência","energy":"Energia","uptime":"Tempo de atividade","cpu":"CPU","d":"d","h":"h","f_model":"Modelo da câmera","f_entity_camera":"Câmera (vídeo ao clicar)","f_entity_motion":"Movimento detectado","f_entity_person":"Pessoa detectada","f_entity_animal":"Animal detectado","f_entity_vehicle":"Veículo detectado","f_entity_sd":"Espaço livre no cartão SD","f_entity_night":"Interruptor de noite / dia","f_sd_low":"Limiar de pouco espaço no cartão SD (%)","f_show_motion":"Bloco de movimento","f_show_person":"Bloco de pessoa","f_show_animal":"Bloco de animal","f_show_vehicle":"Bloco de veículo","f_show_sd":"Bloco do cartão SD","f_show_night":"Bloco de noite / dia","f_entity_memory_free":"Memória livre (%)","f_entity_disk_free":"Espaço livre no disco (%)","f_disk_low":"Disco quase cheio abaixo de (%)","f_cpu_high":"Carga elevada da CPU a partir de (%)","video_loss":"Vídeo perdido","blinded":"Câmera coberta","disk_problem":"Problema no disco","rec_on":"Gravando","rec_off":"Parado","recording":"Gravação","bitrate":"Taxa de bits","channels":"Canais online","rec_channels":"Gravando","disk_used":"Disco usado","archive":"Arquivo","f_nvr_model":"Modelo do gravador","f_entity_recording":"Gravação (REC)","f_entity_connected":"Conectado","f_entity_video_loss":"Perda de vídeo","f_entity_blinded":"Câmera coberta","f_entity_bitrate":"Taxa de bits","f_entity_channels_online":"Canais online","f_entity_recording_channels":"Canais gravando","f_entity_disk_used":"Disco usado","f_entity_archive_start":"Início do arquivo (data)","f_entity_archive_end":"Fim do arquivo (data)","f_entity_disk_problem":"Problema no disco","f_show_recording":"Bloco de gravação","f_show_bitrate":"Bloco de taxa de bits","f_show_channels":"Bloco de canais online","f_show_rec_channels":"Bloco de canais gravando","f_show_disk_used":"Bloco de disco usado","f_show_archive":"Bloco de arquivo"},"pt-PT":{"name_camera":"Câmara","name_nvr":"Gravador NVR","idle":"A monitorizar","offline":"Offline","motion":"Movimento","person":"Pessoa","animal":"Animal","vehicle":"Veículo","detected":"Detetado","clear":"Nenhum","sd":"Cartão SD","night":"Noite","day":"Dia","running":"A gravar","busy":"Carga elevada","disk_low":"Disco quase cheio","off":"Desligado","unavailable":"Indisponível","memory":"Memória livre","disk":"Espaço livre no disco","power":"Potência","energy":"Energia","uptime":"Tempo de atividade","cpu":"CPU","d":"d","h":"h","f_model":"Modelo da câmara","f_entity_camera":"Câmara (vídeo ao clicar)","f_entity_motion":"Movimento detetado","f_entity_person":"Pessoa detetada","f_entity_animal":"Animal detetado","f_entity_vehicle":"Veículo detetado","f_entity_sd":"Espaço livre no cartão SD","f_entity_night":"Interruptor de noite / dia","f_sd_low":"Limiar de pouco espaço no cartão SD (%)","f_show_motion":"Bloco de movimento","f_show_person":"Bloco de pessoa","f_show_animal":"Bloco de animal","f_show_vehicle":"Bloco de veículo","f_show_sd":"Bloco do cartão SD","f_show_night":"Bloco de noite / dia","f_entity_memory_free":"Memória livre (%)","f_entity_disk_free":"Espaço livre no disco (%)","f_disk_low":"Disco quase cheio abaixo de (%)","f_cpu_high":"Carga elevada da CPU a partir de (%)","video_loss":"Vídeo perdido","blinded":"Câmara tapada","disk_problem":"Problema no disco","rec_on":"A gravar","rec_off":"Parado","recording":"Gravação","bitrate":"Débito","channels":"Canais online","rec_channels":"A gravar","disk_used":"Disco usado","archive":"Arquivo","f_nvr_model":"Modelo do gravador","f_entity_recording":"Gravação (REC)","f_entity_connected":"Ligado","f_entity_video_loss":"Perda de vídeo","f_entity_blinded":"Câmara tapada","f_entity_bitrate":"Débito","f_entity_channels_online":"Canais online","f_entity_recording_channels":"Canais a gravar","f_entity_disk_used":"Disco usado","f_entity_archive_start":"Início do arquivo (data)","f_entity_archive_end":"Fim do arquivo (data)","f_entity_disk_problem":"Problema no disco","f_show_recording":"Mosaico de gravação","f_show_bitrate":"Mosaico de débito","f_show_channels":"Mosaico de canais online","f_show_rec_channels":"Mosaico de canais a gravar","f_show_disk_used":"Mosaico de disco usado","f_show_archive":"Mosaico de arquivo"},"ru":{"name_camera":"Камера","name_nvr":"Видеорегистратор NVR","idle":"Наблюдение","offline":"Не в сети","motion":"Движение","person":"Человек","animal":"Животное","vehicle":"Транспорт","detected":"Обнаружено","clear":"Нет","sd":"SD-карта","night":"Ночь","day":"День","running":"Запись","busy":"Высокая нагрузка","disk_low":"Диск почти полон","off":"Выключена","unavailable":"Недоступно","memory":"Свободно ОЗУ","disk":"Свободно на диске","power":"Мощность","energy":"Энергия","uptime":"Время работы","cpu":"ЦП","d":"д","h":"ч","f_model":"Модель камеры","f_entity_camera":"Камера (видео при нажатии)","f_entity_motion":"Обнаружено движение","f_entity_person":"Обнаружен человек","f_entity_animal":"Обнаружено животное","f_entity_vehicle":"Обнаружен транспорт","f_entity_sd":"Свободное место на SD-карте","f_entity_night":"Переключатель ночь / день","f_sd_low":"Порог малого места на SD (%)","f_show_motion":"Плитка движения","f_show_person":"Плитка человека","f_show_animal":"Плитка животного","f_show_vehicle":"Плитка транспорта","f_show_sd":"Плитка SD-карты","f_show_night":"Плитка ночь / день","f_entity_memory_free":"Свободно ОЗУ (%)","f_entity_disk_free":"Свободно на диске (%)","f_disk_low":"Диск почти полон ниже (%)","f_cpu_high":"Высокая нагрузка ЦП от (%)","video_loss":"Потеря видеосигнала","blinded":"Камера закрыта","disk_problem":"Проблема с диском","rec_on":"Запись","rec_off":"Остановлено","recording":"Запись","bitrate":"Битрейт","channels":"Каналы в сети","rec_channels":"Ведётся запись","disk_used":"Занято на диске","archive":"Архив","f_nvr_model":"Модель NVR","f_entity_recording":"Запись (REC)","f_entity_connected":"Подключено","f_entity_video_loss":"Потеря видеосигнала","f_entity_blinded":"Камера закрыта","f_entity_bitrate":"Битрейт","f_entity_channels_online":"Каналов в сети","f_entity_recording_channels":"Каналов на записи","f_entity_disk_used":"Занято на диске","f_entity_archive_start":"Начало архива (дата)","f_entity_archive_end":"Конец архива (дата)","f_entity_disk_problem":"Проблема с диском","f_show_recording":"Плитка записи","f_show_bitrate":"Плитка битрейта","f_show_channels":"Плитка каналов в сети","f_show_rec_channels":"Плитка записываемых каналов","f_show_disk_used":"Плитка занятого диска","f_show_archive":"Плитка архива"},"uk":{"name_camera":"Камера","name_nvr":"Відеореєстратор NVR","idle":"Спостереження","offline":"Не в мережі","motion":"Рух","person":"Людина","animal":"Тварина","vehicle":"Транспорт","detected":"Виявлено","clear":"Немає","sd":"SD-картка","night":"Ніч","day":"День","running":"Запис","busy":"Велике навантаження","disk_low":"Диск майже повний","off":"Вимк.","unavailable":"Недоступно","memory":"Вільна пам'ять","disk":"Вільне місце на диску","power":"Потужність","energy":"Енергія","uptime":"Час роботи","cpu":"ЦП","d":"д","h":"год","f_model":"Модель камери","f_entity_camera":"Камера (відео при натисканні)","f_entity_motion":"Виявлено рух","f_entity_person":"Виявлено людину","f_entity_animal":"Виявлено тварину","f_entity_vehicle":"Виявлено транспорт","f_entity_sd":"Вільне місце на SD-картці","f_entity_night":"Перемикач ніч / день","f_sd_low":"Поріг малого місця на SD (%)","f_show_motion":"Плитка руху","f_show_person":"Плитка людини","f_show_animal":"Плитка тварини","f_show_vehicle":"Плитка транспорту","f_show_sd":"Плитка SD-картки","f_show_night":"Плитка ніч / день","f_entity_memory_free":"Вільна пам'ять (%)","f_entity_disk_free":"Вільне місце на диску (%)","f_disk_low":"Диск майже повний нижче (%)","f_cpu_high":"Велике навантаження ЦП від (%)","video_loss":"Втрата відео","blinded":"Камеру засліплено","disk_problem":"Проблема з диском","rec_on":"Запис","rec_off":"Зупинено","recording":"Запис","bitrate":"Бітрейт","channels":"Канали онлайн","rec_channels":"Запис","disk_used":"Зайнято на диску","archive":"Архів","f_nvr_model":"Модель відеореєстратора NVR","f_entity_recording":"Запис (REC)","f_entity_connected":"Підключено","f_entity_video_loss":"Втрата відео","f_entity_blinded":"Камеру засліплено","f_entity_bitrate":"Бітрейт","f_entity_channels_online":"Канали онлайн","f_entity_recording_channels":"Канали, що записують","f_entity_disk_used":"Зайнято на диску","f_entity_archive_start":"Початок архіву (дата)","f_entity_archive_end":"Кінець архіву (дата)","f_entity_disk_problem":"Проблема з диском","f_show_recording":"Плитка запису","f_show_bitrate":"Плитка бітрейту","f_show_channels":"Плитка каналів онлайн","f_show_rec_channels":"Плитка каналів, що записують","f_show_disk_used":"Плитка зайнятого місця на диску","f_show_archive":"Плитка архіву"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  // photos détourées (webp transparent) intégrées au fichier
  const IMG = {"xiongmai": {"w": 560, "h": 205, "uri": window.__acImg("camera",0)}, "nvr": {"w": 560, "h": 148, "uri": window.__acImg("camera",1)}, "dome": {"w": 240, "h": 204, "uri": window.__acImg("camera",2)}, "bullet": {"w": 260, "h": 149, "uri": window.__acImg("camera",3)}, "turret": {"w": 240, "h": 210, "uri": window.__acImg("camera",4)}};
  // voyants du NVR (PWR vert, HDD rouge), en % de la photo
  // Xiongmai : trois voyants Power / Alarm / Rec sous la façade (« x » = petits voyants ronds, allumés selon l'état)
  const LEDS = { nvr: [['pwr', 82.75, 25.7, ''], ['hdd', 89.96, 25.6, '']], xiongmai: [['pwr', 68.78, 76.12, ' x'], ['alarm', 72.57, 76.12, ' x'], ['rec', 76.38, 76.12, ' x']] };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--cm-ok:var(--appliance-ok-color,#43a047);--cm-alert:var(--appliance-alert-color,#db4437);--cm-warn:var(--appliance-warn-color,#ffa000);--dc:#ffa000;transition:box-shadow .5s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.idle .badge,.running .badge{background:color-mix(in srgb,var(--cm-ok) 20%,transparent);color:var(--cm-ok)}
.video_loss .badge,.blinded .badge,.disk_problem .badge{background:color-mix(in srgb,var(--cm-alert) 22%,transparent);color:var(--cm-alert)}
.motion .badge,.person .badge,.animal .badge,.vehicle .badge,.busy .badge,.disk_low .badge{background:color-mix(in srgb,var(--dc) 24%,transparent);color:var(--dc)}
ha-card.video_loss,ha-card.blinded,ha-card.disk_problem{box-shadow:0 0 0 1px color-mix(in srgb,var(--cm-alert) 60%,transparent),0 0 18px color-mix(in srgb,var(--cm-alert) 25%,transparent)}
ha-card.motion,ha-card.person,ha-card.animal,ha-card.vehicle,ha-card.disk_low{box-shadow:0 0 0 1px color-mix(in srgb,var(--dc) 60%,transparent),0 0 18px color-mix(in srgb,var(--dc) 25%,transparent)}
.stage{position:relative;margin:4px auto 0;max-width:calc(260px * var(--illus-scale,1));min-height:calc(150px * var(--illus-scale,1));padding:16px 0;box-sizing:border-box;border-radius:14px;background:radial-gradient(ellipse at 50% 55%,#252c36,#14181e 78%);overflow:hidden;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .6s}
.nvr .stage{max-width:calc(380px * var(--illus-scale,1));min-height:calc(100px * var(--illus-scale,1));padding:12px 0}
.night .stage{background:radial-gradient(ellipse at 50% 55%,#1d2a52,#0a0f24 78%)}
.ph{position:relative;display:flex;max-width:76%}.nvr .ph{max-width:88%}
.stage img{display:block;max-width:100%;max-height:calc(118px * var(--illus-scale,1));object-fit:contain;transition:filter .6s;filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}
.nvr .stage img{max-height:96px}
.night .stage img{filter:brightness(.78) saturate(.8) drop-shadow(0 6px 8px rgba(0,0,0,.45))}
.off .stage img,.unavailable .stage img{filter:grayscale(1) brightness(.6)}
.glow{position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle,var(--dc) 0%,transparent 68%);opacity:0;filter:blur(18px);transition:opacity .5s;pointer-events:none}
.motion .glow,.person .glow,.animal .glow,.vehicle .glow{opacity:.55;animation:cmglow 1.6s ease-in-out infinite alternate}
@keyframes cmglow{from{opacity:.25}to{opacity:.65}}
.wave{position:absolute;left:50%;top:50%;width:46%;aspect-ratio:1;margin:-23% 0 0 -23%;border-radius:50%;border:2px solid var(--dc);opacity:0;pointer-events:none}
.motion .wave,.person .wave,.animal .wave,.vehicle .wave{animation:cmwave 2.4s ease-out infinite}.wave.w2{animation-delay:1.2s!important}
@keyframes cmwave{0%{opacity:.8;transform:scale(.6)}100%{opacity:0;transform:scale(2.1)}}
/* cadre de visée : coins + point REC */
.vf{position:absolute;inset:8px;pointer-events:none;border-radius:8px;--c:rgba(255,255,255,.55);
  background:linear-gradient(var(--c),var(--c)) 0 0/14px 2px,linear-gradient(var(--c),var(--c)) 0 0/2px 14px,linear-gradient(var(--c),var(--c)) 100% 0/14px 2px,linear-gradient(var(--c),var(--c)) 100% 0/2px 14px,
  linear-gradient(var(--c),var(--c)) 0 100%/14px 2px,linear-gradient(var(--c),var(--c)) 0 100%/2px 14px,linear-gradient(var(--c),var(--c)) 100% 100%/14px 2px,linear-gradient(var(--c),var(--c)) 100% 100%/2px 14px;background-repeat:no-repeat}
.motion .vf,.person .vf,.animal .vf,.vehicle .vf{--c:var(--dc);animation:cmfast 1s steps(2) infinite}
.nvr .vf{display:none}
.rec,.det,.moon{z-index:2}
.rec{position:absolute;left:14px;top:12px;display:flex;align-items:center;gap:4px;font:700 9px/1 sans-serif;color:#fff;letter-spacing:.5px;opacity:.9;pointer-events:none}
.rec i{width:7px;height:7px;border-radius:50%;background:#e53935;animation:cmblink 1.6s ease-in-out infinite}
.offline .rec,.off .rec,.unavailable .rec,.norec .rec{display:none}.nvr .rec{display:none}
@keyframes cmblink{50%{opacity:.2}}
@keyframes cmfast{50%{opacity:.45}}
.det{position:absolute;left:10px;bottom:10px;display:none;align-items:center;gap:4px;padding:3px 8px 3px 6px;border-radius:12px;background:color-mix(in srgb,var(--dc) 85%,#000);color:#fff;font:600 11px/14px sans-serif;pointer-events:none}
.det ha-icon{--mdc-icon-size:15px}
.motion .det,.person .det,.animal .det,.vehicle .det{display:flex}
.nvr .det{display:none!important}
.moon{position:absolute;right:12px;top:10px;display:none;color:#cfd8ff;pointer-events:none}.moon ha-icon{--mdc-icon-size:18px}
.night .moon{display:flex}
/* NVR : voyants */
.led{position:absolute;width:2.3%;height:2.5%;border-radius:2px;transform:translate(-50%,-50%);pointer-events:none;opacity:0}
.nvr .led{opacity:1}
.led.pwr{background:#4cff7a;box-shadow:0 0 5px 1px #4cff7a}
.led.hdd{background:#ff4b4b;box-shadow:0 0 5px 1px #ff4b4b;animation:cmhdd var(--hz,1.4s) steps(1) infinite}
.running .led.pwr,.busy .led.pwr,.disk_low .led.pwr{animation:cmbeat 3s ease-in-out infinite}
.off .led,.unavailable .led{opacity:0!important}
/* NVR Xiongmai : petits voyants Power (vert) / Alarm (orange) / Rec (rouge) posés sur la photo */
.led.x{width:1.15%;height:auto;aspect-ratio:1;border-radius:50%}
.nvr .led.x{opacity:0}.nvr .led.pwr.x{opacity:1}
.led.alarm{background:#ffb02e;box-shadow:0 0 6px 2px #ffb02e}.led.rec{background:#ff4b4b;box-shadow:0 0 6px 2px #ff4b4b}
.nvr.alm .led.alarm.x{opacity:1;animation:cmfast .8s steps(2) infinite}
.nvr.rec-on .led.rec.x{opacity:1;animation:cmblink 1.6s ease-in-out infinite}
.disk_low .led.hdd,.disk_problem .led.hdd{animation:cmfast .5s steps(2) infinite}
@keyframes cmhdd{0%,100%{opacity:.15}20%{opacity:1}35%{opacity:.2}55%{opacity:1}70%{opacity:.1}}
@keyframes cmbeat{50%{opacity:.5}}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(86px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.on .v,.tile.on .l{color:var(--tc,var(--dc))}.tile.bad .v{color:var(--cm-alert)}.tile.warn .v{color:var(--cm-warn)}
.noanim *{animation:none!important}
/* compact : petits emplacements fixes */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .stage{flex:1 1 auto;min-height:0;max-width:none;margin-top:3px;border-radius:10px}.compact .stage img{max-height:90%}
.compact .tiles{flex:none;gap:3px;margin-top:3px;grid-template-columns:repeat(auto-fit,minmax(60px,1fr))}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  const COLORS = { motion: '#ffa000', person: '#ff5252', animal: '#b36bff', vehicle: '#42a5f5' };
  const ICONS = { motion: 'mdi:motion-sensor', person: 'mdi:walk', animal: 'mdi:paw', vehicle: 'mdi:car' };
  const ON_RE = /^(on|true|yes|1|detected|active|motion|open|home|night|nuit)$/i;

  // socle commun : lecture des entités, tuiles, actions de l'illustration
  class Base extends HTMLElement {
    get _config() { return this._c; }
    getCardSize() { return 4; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { ...this.constructor.DEFAULTS, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); return this._ok(s) ? window.applianceNum(s) : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d || '').trim(); }
    _on(id) { const s = this._st(id); return this._ok(s) && ON_RE.test(String(s.state).trim()); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { window.applianceMore(this, id); }
    _img() {
      const c = this._c, custom = String(c.image || '').trim();
      if (custom) return { uri: custom, custom: true };
      return IMG[this.constructor.IMGKEY(c)] || IMG[this.constructor.DEFAULTS.model || 'nvr'];
    }
    _build() {
      const c = this._c, root = this.shadowRoot || this.attachShadow({ mode: 'open' }), im = this._img();
      const label = esc(c.name || this._t(this.constructor.NAME));
      // les LED ne sont posées que sur la photo du NVR (leurs coordonnées sont celles de cette photo)
      const leds = this.constructor.HASLEDS && !im.custom ? (LEDS[this.constructor.IMGKEY(c)] || []).map(([k, x, y, x2]) => `<i class="led ${k}${x2}" style="left:${x}%;top:${y}%"></i>`).join('') : '';
      root.innerHTML = `<style>${CSS}</style><ha-card class="${this.constructor.CLS}">
        <div class="head"><div class="title" id="cmtitle"></div><div class="badge" id="cmbadge"></div></div>
        <div class="stage"><div class="glow"></div><div class="wave"></div><div class="wave w2"></div>
          <div class="ph"><img src="${esc(im.uri)}" alt="${label}">${leds}</div>
          <div class="vf"></div><div class="rec"><i></i>REC</div><div class="moon"><ha-icon icon="mdi:weather-night"></ha-icon></div>
          <div class="det"><ha-icon icon="mdi:motion-sensor" id="cmdi"></ha-icon><span id="cmdt"></span></div></div>
        <div class="tiles">${this.constructor.TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      const stage = root.querySelector('.stage');
      window.applianceBindIllus(this, stage, () => this._more(this._main()));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._tileClick(el.dataset.k)));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }
    _fillTiles(V, extraCls) {
      const c = this._c;
      this._root.querySelectorAll('.tile').forEach((el) => {
        const k = el.dataset.k, [id, val, unit, cls, opt] = V[k];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.className = `tile${!id || c[opt] === false ? ' hide' : ''}${cls ? ' ' + cls : ''}`;
        el.style.setProperty('--tc', COLORS[k] || 'var(--dc)');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }

  /* ---------------- Caméra ---------------- */
  class ApplianceCameraCard extends Base {
    static get DEFAULTS() { return { model: 'dome', show_status: true }; }
    static get NAME() { return 'name_camera'; }
    static get CLS() { return 'cam'; }
    static IMGKEY(c) { return ['dome', 'bullet', 'turret'].includes(c.model) ? c.model : 'dome'; }
    static get TILES() { return [['motion', 'mdi:motion-sensor'], ['person', 'mdi:walk'], ['animal', 'mdi:paw'], ['vehicle', 'mdi:car'], ['recording', 'mdi:record-rec'], ['bitrate', 'mdi:chart-line'], ['sd', 'mdi:sd'], ['night', 'mdi:theme-light-dark']]; }
    static getConfigElement() { return document.createElement('appliance-camera-card-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_camera: ids.find((i) => i.startsWith('camera.')) || '' };
    }
    _main() { const c = this._c; return c.entity_camera || c.entity_person || c.entity_motion || c.entity_animal || c.entity_vehicle || ''; }
    _tileClick(k) {
      const c = this._c, id = { motion: c.entity_motion, person: c.entity_person, animal: c.entity_animal, vehicle: c.entity_vehicle, recording: c.entity_recording, bitrate: c.entity_bitrate, sd: c.entity_sd, night: c.entity_night }[k];
      // interrupteur jour / nuit : un clic bascule (switch / input_boolean), sinon fiche de l'entité
      if (k === 'night' && id && /^(switch|input_boolean)\./.test(id) && this._hass) { this._hass.callService('homeassistant', 'toggle', { entity_id: id }); return; }
      this._more(id);
    }
    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const cam = this._st(c.entity_camera), ids = ['entity_camera', 'entity_motion', 'entity_person', 'entity_animal', 'entity_vehicle'].map((k) => c[k]).filter(Boolean);
      let online = !ids.length || ids.some((i) => this._ok(this._st(i)));
      // « connecté » : binary_sensor de l'enregistreur / de l'intégration (off = hors ligne)
      const conn = c.entity_connected ? this._st(c.entity_connected) : null;
      if (conn && this._ok(conn) && !this._on(c.entity_connected)) online = false;
      const vloss = this._on(c.entity_video_loss), blind = this._on(c.entity_blinded);
      // détection : priorité personne > animal > véhicule > mouvement
      const det = this._on(c.entity_person) ? 'person' : this._on(c.entity_animal) ? 'animal' : this._on(c.entity_vehicle) ? 'vehicle' : this._on(c.entity_motion) ? 'motion' : '';
      const nightS = this._st(c.entity_night), night = this._ok(nightS) && /^(on|night|nuit|true|ir|nachts?)$/i.test(String(nightS.state).trim());
      const st = !online ? 'offline' : vloss ? 'video_loss' : blind ? 'blinded' : det || 'idle';
      const recOn = c.entity_recording ? this._on(c.entity_recording) : true;
      card.className = `cam ${st}${recOn ? '' : ' norec'}${night ? ' night' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--dc', COLORS[det] || '#ffa000');
      r.getElementById('cmtitle').textContent = c.name || this._t('name_camera');
      const badge = r.getElementById('cmbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      if (det) { r.getElementById('cmdi').setAttribute('icon', ICONS[det]); r.getElementById('cmdt').textContent = this._t(det); }
      const dv = (k, id) => [id, this._ok(this._st(id)) ? (this._on(id) ? this._t('detected') : this._t('clear')) : '--', '', this._on(id) ? 'on' : '', `show_${k}`];
      const sdn = this._num(c.entity_sd);
      this._fillTiles({
        motion: dv('motion', c.entity_motion), person: dv('person', c.entity_person), animal: dv('animal', c.entity_animal), vehicle: dv('vehicle', c.entity_vehicle),
        recording: [c.entity_recording, this._ok(this._st(c.entity_recording)) ? this._t(recOn ? 'rec_on' : 'rec_off') : '--', '', recOn ? 'on' : '', 'show_recording'],
        bitrate: [c.entity_bitrate, this._fmt(this._num(c.entity_bitrate), 0), this._unit(c.entity_bitrate, 'kbps'), '', 'show_bitrate'],
        sd: [c.entity_sd, this._fmt(sdn, sdn < 10 ? 1 : 0), this._unit(c.entity_sd, '%'), !isNaN(sdn) && this._unit(c.entity_sd, '%') === '%' && sdn < Number(c.sd_low ?? 10) ? 'bad' : '', 'show_sd'],
        night: [c.entity_night, this._ok(nightS) ? this._t(night ? 'night' : 'day') : '--', '', night ? 'warn' : '', 'show_night'],
      });
    }
  }

  /* ---------------- NVR ---------------- */
  class ApplianceNvrCard extends Base {
    static get DEFAULTS() { return { disk_low: 10, cpu_high: 85, show_status: true }; }
    static get NAME() { return 'name_nvr'; }
    static get CLS() { return 'nvr'; }
    static get HASLEDS() { return true; }
    static IMGKEY(c) { return c && c.model === 'xiongmai' ? 'xiongmai' : 'nvr'; }
    static get TILES() { return [['channels', 'mdi:cctv'], ['rec_channels', 'mdi:record-rec'], ['bitrate', 'mdi:chart-line'], ['memory', 'mdi:memory'], ['disk', 'mdi:harddisk'], ['disk_used', 'mdi:harddisk-plus'], ['archive', 'mdi:archive-clock-outline'], ['power', 'mdi:flash'], ['energy', 'mdi:lightning-bolt-circle'], ['uptime', 'mdi:timer-outline'], ['cpu', 'mdi:cpu-64-bit']]; }
    static getConfigElement() { return document.createElement('appliance-nvr-card-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /(nvr|reolink)/i.test(i) && /^(binary_sensor|sensor|switch)\./.test(i)) || '' };
    }
    _main() { const c = this._c; return c.entity || c.entity_cpu || c.entity_power || ''; }
    _tileClick(k) { const c = this._c; this._more({ channels: c.entity_channels_online, rec_channels: c.entity_recording_channels, bitrate: c.entity_bitrate, memory: c.entity_memory_free, disk: c.entity_disk_free, disk_used: c.entity_disk_used, archive: c.entity_archive_start || c.entity_archive_end, power: c.entity_power, energy: c.entity_energy, uptime: c.entity_uptime, cpu: c.entity_cpu }[k]); }
    // uptime : durée (s / min / h / j) ou horodatage du dernier démarrage → « 3 j 4 h »
    _uptime(id) {
      const s = this._st(id); if (!this._ok(s)) return '--';
      let sec = NaN; const n = parseFloat(String(s.state).replace(',', '.'));
      const u = this._unit(id, '').toLowerCase();
      if (isFinite(n) && !/^\d{4}-\d{2}-\d{2}/.test(String(s.state))) sec = n * ({ s: 1, min: 60, h: 3600, d: 86400 }[u] || 1);
      else { const t = Date.parse(s.state); if (t) sec = (Date.now() - t) / 1000; }
      if (!isFinite(sec) || sec < 0) return String(s.state);
      const d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
      return d ? `${d} ${this._t('d')} ${h} ${this._t('h')}` : h ? `${h} ${this._t('h')} ${m} min` : `${m} min`;
    }
    // durée de l'archive en jours : de entity_archive_start à entity_archive_end (ou à maintenant)
    _archive() {
      const c = this._c, a = Date.parse((this._st(c.entity_archive_start) || {}).state), b = c.entity_archive_end ? Date.parse((this._st(c.entity_archive_end) || {}).state) : Date.now();
      return isFinite(a) && isFinite(b) && b >= a ? `${Math.round((b - a) / 86400000)} ${this._t('d')}` : '--';
    }
    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const e = this._st(c.entity), cpu = this._num(c.entity_cpu), disk = this._num(c.entity_disk_free), mem = this._num(c.entity_memory_free);
      const pw = window.applianceWatts ? window.applianceWatts(this._st(c.entity_power)) : this._num(c.entity_power);
      const known = [c.entity, c.entity_cpu, c.entity_power, c.entity_disk_free, c.entity_memory_free, c.entity_uptime, c.entity_channels_online, c.entity_recording, c.entity_disk_used].some((i) => i && this._ok(this._st(i)));
      const lowDisk = !isNaN(disk) && disk <= Number(c.disk_low), busy = !isNaN(cpu) && cpu >= Number(c.cpu_high);
      const off = e && /^(off|false|0)$/i.test(String(e.state).trim());
      const problem = this._on(c.entity_disk_problem), motion = this._on(c.entity_motion);
      const st = !known ? 'unavailable' : off ? 'off' : problem ? 'disk_problem' : lowDisk ? 'disk_low' : motion ? 'motion' : busy ? 'busy' : 'running';
      // voyants Xiongmai : Alarm sur mouvement / problème de disque, Rec sur l'état d'enregistrement (allumé tant que le NVR tourne si non renseigné)
      const alm = motion || problem, recOn = c.entity_recording ? this._on(c.entity_recording) : !['off', 'unavailable'].includes(st);
      card.className = `nvr ${st}${alm ? ' alm' : ''}${recOn ? ' rec-on' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--dc', st === 'disk_low' || st === 'disk_problem' ? '#db4437' : '#ffa000');
      // le voyant HDD clignote plus vite quand le processeur travaille
      card.style.setProperty('--hz', `${(isNaN(cpu) ? 1.4 : Math.max(.5, 1.6 - cpu / 100)).toFixed(2)}s`);
      r.getElementById('cmtitle').textContent = c.name || this._t('name_nvr');
      const badge = r.getElementById('cmbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const pct = (id, v, low) => [id, this._fmt(v, 0), this._unit(id, '%'), !isNaN(v) && low ? 'bad' : ''];
      const cnt = (id, opt) => [id, this._fmt(this._num(id), 0), '', '', opt];
      const du = this._num(c.entity_disk_used);
      this._fillTiles({
        channels: cnt(c.entity_channels_online, 'show_channels'),
        rec_channels: cnt(c.entity_recording_channels, 'show_rec_channels'),
        bitrate: [c.entity_bitrate, this._fmt(this._num(c.entity_bitrate), 0), this._unit(c.entity_bitrate, 'kbps'), '', 'show_bitrate'],
        disk_used: [c.entity_disk_used, this._fmt(du, du < 10 ? 1 : 0), this._unit(c.entity_disk_used, '%'), '', 'show_disk_used'],
        archive: [c.entity_archive_start || c.entity_archive_end, this._archive(), '', '', 'show_archive'],
        memory: [...pct(c.entity_memory_free, mem, mem <= 10), 'show_memory'],
        disk: [...pct(c.entity_disk_free, disk, lowDisk), 'show_disk'],
        power: [c.entity_power, this._fmt(pw, pw < 10 ? 1 : 0), 'W', '', 'show_power'],
        energy: [c.entity_energy, this._fmt(this._num(c.entity_energy), 2), this._unit(c.entity_energy, 'kWh'), '', 'show_energy'],
        uptime: [c.entity_uptime, this._uptime(c.entity_uptime), '', '', 'show_uptime'],
        cpu: [...pct(c.entity_cpu, cpu, busy), 'show_cpu'],
      });
    }
  }

  /* ---------------- éditeurs ---------------- */
  class EditorBase extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        ...this.top(),
        { name: 'image', selector: { text: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...this.entities(),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [{ name: 'show_status', selector: { boolean: {} }, default: true }, { name: 'compact', selector: { boolean: {} }, default: false }, { name: 'animations', selector: { boolean: {} }, default: true }, ...this.flags().map((name) => ({ name, selector: { boolean: {} }, default: true }))] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass), k = this.labelKey ? this.labelKey(s.name) : s.name; return T[l][`f_${k}`] ?? T.en[`f_${k}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
  class ApplianceCameraCardEditor extends EditorBase {
    top() { return [{ name: 'model', default: 'dome', selector: { select: { mode: 'dropdown', options: [{ value: 'dome', label: 'Dome' }, { value: 'bullet', label: 'Bullet' }, { value: 'turret', label: 'Turret' }] } } }]; }
    entities() { return [ent('entity_camera', ['camera']), ent('entity_motion', ['binary_sensor', 'sensor', 'switch']), ent('entity_person', ['binary_sensor', 'sensor', 'switch']), ent('entity_animal', ['binary_sensor', 'sensor', 'switch']), ent('entity_vehicle', ['binary_sensor', 'sensor', 'switch']), ent('entity_recording', ['binary_sensor', 'sensor', 'switch']), ent('entity_connected', ['binary_sensor']), ent('entity_video_loss', ['binary_sensor']), ent('entity_blinded', ['binary_sensor']), ent('entity_bitrate', 'sensor'), ent('entity_sd', 'sensor'), ent('entity_night', ['switch', 'input_boolean', 'binary_sensor', 'select', 'sensor']), { name: 'sd_low', default: 10, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }]; }
    flags() { return ['show_motion', 'show_person', 'show_animal', 'show_vehicle', 'show_recording', 'show_bitrate', 'show_sd', 'show_night']; }
  }
  class ApplianceNvrCardEditor extends EditorBase {
    labelKey(n) { return n === 'model' ? 'nvr_model' : n; }
    top() { return [{ name: 'model', default: 'default', selector: { select: { mode: 'dropdown', options: [{ value: 'default', label: 'NVR' }, { value: 'xiongmai', label: 'Xiongmai (NBD8008R-PL)' }] } } }]; }
    entities() { return [ent('entity', ['binary_sensor', 'switch', 'sensor', 'input_boolean']), ent('entity_recording', ['binary_sensor', 'sensor', 'switch']), ent('entity_motion', ['binary_sensor', 'sensor', 'switch']), ent('entity_disk_problem', ['binary_sensor']), ent('entity_channels_online', 'sensor'), ent('entity_recording_channels', 'sensor'), ent('entity_bitrate', 'sensor'), ent('entity_disk_used', 'sensor'), ent('entity_archive_start', 'sensor'), ent('entity_archive_end', 'sensor'), ent('entity_memory_free', 'sensor'), ent('entity_disk_free', 'sensor'), ent('entity_power', 'sensor'), ent('entity_energy', 'sensor'), ent('entity_uptime', 'sensor'), ent('entity_cpu', 'sensor'),
      { name: 'disk_low', default: 10, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }, { name: 'cpu_high', default: 85, selector: { number: { min: 0, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } }]; }
    flags() { return ['show_channels', 'show_rec_channels', 'show_bitrate', 'show_memory', 'show_disk', 'show_disk_used', 'show_archive', 'show_power', 'show_energy', 'show_uptime', 'show_cpu']; }
  }

  const defs = [['appliance-camera-card', ApplianceCameraCard, ApplianceCameraCardEditor, 'name_camera', 'Caméra de surveillance : détections (mouvement, personne, animal, véhicule), mode nuit, carte SD ; un clic ouvre la vidéo.'],
    ['appliance-nvr-card', ApplianceNvrCard, ApplianceNvrCardEditor, 'name_nvr', 'Enregistreur vidéo NVR : voyants animés, mémoire, disque, puissance, énergie, uptime, CPU.']];
  window.customCards = window.customCards || [];
  for (const [tag, Card, Editor, key, desc] of defs) {
    (window.__acDefine||customElements.define.bind(customElements))(tag, Card);
    (window.__acDefine||customElements.define.bind(customElements))(tag + '-editor', Editor);
    window.customCards.push({ type: tag, name: `Appliance – ${T.en[key]} / ${T.fr[key]}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l][key]])), description: desc, preview: true,
      documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/camera.md' });
  }
})();
