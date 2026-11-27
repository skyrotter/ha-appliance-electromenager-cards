/* Carte « Home cinéma PC (HTPC) » — custom:appliance-htpc-card
 * Lecteur multimédia (Kodi, Plex, tout media_player) sur la photo détourée d'un boîtier HTPC SilverStone : les voyants de la façade suivent
 * l'état (bleu allumé, vert lecture, orange pause / veille), l'écran du boîtier affiche le titre en cours (qui défile s'il est long) et le temps,
 * la molette s'illumine en lecture. En dessous : affiche du film, titre, barre de lecture cliquable, précédent / lecture-pause / suivant /
 * aléatoire, marche-arrêt, volume, source. Les boutons ne s'affichent que si le lecteur les gère (supported_features).
 * Puissance d'une prise connectée sur le PC en option (entity_power).
 */
(() => {
  const TAG = 'appliance-htpc-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"f_switch":"PC power plug (switch)","confirm_off":"Switch off the plug while the PC is on?","f_poster_position":"Poster position","poster_center":"Centered (default)","poster_left":"Left","poster_right":"Right","name":"Home theater PC","off":"Off","standby":"Standby","idle":"Idle","on":"On","playing":"Playing","paused":"Paused","unavailable":"Unavailable","power":"Power","btn_power":"Power","btn_prev":"Previous","btn_next":"Next","btn_play":"Play / pause","btn_shuffle":"Shuffle","btn_mute":"Mute","f_entity":"Media player (Kodi…)","f_entity_power":"PC power sensor (smart plug)","f_show_poster":"Show the poster","f_show_seek":"Show the progress bar","f_show_volume":"Show the volume","f_show_source":"Show the source list"},"cs":{"f_switch":"Zásuvka PC (spínač)","confirm_off":"Vypnout zásuvku, když je PC zapnutý?","f_poster_position":"Poloha plakátu","poster_center":"Na střed (výchozí)","poster_left":"Vlevo","poster_right":"Vpravo","name":"Počítač domácího kina (HTPC)","off":"Vypnuto","standby":"Pohotovost","idle":"Nečinný","on":"Zapnuto","playing":"Přehrává","paused":"Pozastaveno","unavailable":"Nedostupné","power":"Výkon","btn_power":"Zapnout / vypnout","btn_prev":"Předchozí","btn_next":"Další","btn_play":"Přehrát / pauza","btn_shuffle":"Náhodně","btn_mute":"Ztlumit","f_entity":"Multimediální přehrávač (Kodi…)","f_entity_power":"Senzor výkonu počítače (chytrá zásuvka)","f_show_poster":"Zobrazit plakát","f_show_seek":"Zobrazit ukazatel průběhu","f_show_volume":"Zobrazit hlasitost","f_show_source":"Zobrazit seznam zdrojů"},"da":{"f_switch":"PC'ens stikkontakt (kontakt)","confirm_off":"Slå stikkontakten fra, mens pc'en er tændt?","f_poster_position":"Plakatens placering","poster_center":"Centreret (standard)","poster_left":"Venstre","poster_right":"Højre","name":"Hjemmebiograf-pc (HTPC)","off":"Slukket","standby":"Standby","idle":"Inaktiv","on":"Tændt","playing":"Afspiller","paused":"På pause","unavailable":"Utilgængelig","power":"Effekt","btn_power":"Tænd / sluk","btn_prev":"Forrige","btn_next":"Næste","btn_play":"Afspil / pause","btn_shuffle":"Tilfældig","btn_mute":"Slå lyden fra","f_entity":"Medieafspiller (Kodi…)","f_entity_power":"Effektsensor på pc'en (smart stik)","f_show_poster":"Vis plakaten","f_show_seek":"Vis statuslinjen","f_show_volume":"Vis lydstyrken","f_show_source":"Vis kildelisten"},"de":{"f_switch":"PC-Steckdose (Schalter)","confirm_off":"Steckdose ausschalten, obwohl der PC läuft?","f_poster_position":"Position des Covers","poster_center":"Zentriert (Standard)","poster_left":"Links","poster_right":"Rechts","name":"Heimkino-PC (HTPC)","off":"Aus","standby":"Standby","idle":"Leerlauf","on":"An","playing":"Wiedergabe","paused":"Pausiert","unavailable":"Nicht verfügbar","power":"Leistung","btn_power":"Ein / Aus","btn_prev":"Zurück","btn_next":"Weiter","btn_play":"Wiedergabe / Pause","btn_shuffle":"Zufall","btn_mute":"Stumm","f_entity":"Mediaplayer (Kodi…)","f_entity_power":"Leistungssensor des PCs (Zwischenstecker)","f_show_poster":"das Cover anzeigen","f_show_seek":"die Fortschrittsleiste anzeigen","f_show_volume":"die Lautstärke anzeigen","f_show_source":"die Quellenliste anzeigen"},"es":{"f_switch":"Enchufe del PC (interruptor)","confirm_off":"¿Apagar el enchufe mientras el PC está encendido?","f_poster_position":"Posición de la carátula","poster_center":"Centrada (por defecto)","poster_left":"Izquierda","poster_right":"Derecha","name":"PC de cine en casa (HTPC)","off":"Apagado","standby":"En espera","idle":"Inactivo","on":"Encendido","playing":"Reproduciendo","paused":"En pausa","unavailable":"No disponible","power":"Potencia","btn_power":"Encendido / apagado","btn_prev":"Anterior","btn_next":"Siguiente","btn_play":"Reproducir / pausa","btn_shuffle":"Aleatorio","btn_mute":"Silenciar","f_entity":"Reproductor multimedia (Kodi…)","f_entity_power":"Sensor de potencia del PC (enchufe inteligente)","f_show_poster":"Mostrar la carátula","f_show_seek":"Mostrar la barra de progreso","f_show_volume":"Mostrar el volumen","f_show_source":"Mostrar la lista de fuentes"},"fr":{"f_switch":"Prise du PC (interrupteur)","confirm_off":"Couper la prise alors que le PC est allumé ?","f_poster_position":"Position de l'affiche","poster_center":"Centrée (défaut)","poster_left":"À gauche","poster_right":"À droite","name":"Home cinéma PC (HTPC)","off":"Éteint","standby":"Veille","idle":"Inactif","on":"Allumé","playing":"Lecture","paused":"En pause","unavailable":"Indisponible","power":"Puissance","btn_power":"Marche / arrêt","btn_prev":"Précédent","btn_next":"Suivant","btn_play":"Lecture / pause","btn_shuffle":"Aléatoire","btn_mute":"Muet","f_entity":"Lecteur multimédia (Kodi…)","f_entity_power":"Capteur de puissance du PC (prise connectée)","f_show_poster":"Afficher l'affiche","f_show_seek":"Afficher la barre de lecture","f_show_volume":"Afficher le volume","f_show_source":"Afficher la liste des sources"},"hu":{"f_switch":"A PC dugalja (kapcsoló)","confirm_off":"Kikapcsolja a dugaljat, miközben a PC be van kapcsolva?","f_poster_position":"A plakát helye","poster_center":"Középen (alapértelmezett)","poster_left":"Balra","poster_right":"Jobbra","name":"Házimozi PC (HTPC)","off":"Ki","standby":"Készenlét","idle":"Tétlen","on":"Be","playing":"Lejátszás","paused":"Szünet","unavailable":"Nem elérhető","power":"Teljesítmény","btn_power":"Be / ki","btn_prev":"Előző","btn_next":"Következő","btn_play":"Lejátszás / szünet","btn_shuffle":"Véletlen","btn_mute":"Némítás","f_entity":"Médialejátszó (Kodi…)","f_entity_power":"A PC teljesítményérzékelője (okoskonnektor)","f_show_poster":"a plakátot megjelenítése","f_show_seek":"a folyamatjelzőt megjelenítése","f_show_volume":"a hangerőt megjelenítése","f_show_source":"a forráslistát megjelenítése"},"it":{"f_switch":"Presa del PC (interruttore)","confirm_off":"Spegnere la presa mentre il PC è acceso?","f_poster_position":"Posizione della locandina","poster_center":"Centrata (predefinito)","poster_left":"Sinistra","poster_right":"Destra","name":"PC home theater (HTPC)","off":"Spento","standby":"Standby","idle":"Inattivo","on":"Acceso","playing":"In riproduzione","paused":"In pausa","unavailable":"Non disponibile","power":"Potenza","btn_power":"Accensione / spegnimento","btn_prev":"Precedente","btn_next":"Successivo","btn_play":"Riproduci / pausa","btn_shuffle":"Casuale","btn_mute":"Muto","f_entity":"Lettore multimediale (Kodi…)","f_entity_power":"Sensore di potenza del PC (presa smart)","f_show_poster":"Mostra la locandina","f_show_seek":"Mostra la barra di avanzamento","f_show_volume":"Mostra il volume","f_show_source":"Mostra l'elenco delle sorgenti"},"nb":{"f_switch":"PC-ens stikkontakt (bryter)","confirm_off":"Slå av stikkontakten mens PC-en er på?","f_poster_position":"Plakatens plassering","poster_center":"Sentrert (standard)","poster_left":"Venstre","poster_right":"Høyre","name":"Hjemmekino-PC (HTPC)","off":"Av","standby":"Standby","idle":"Inaktiv","on":"På","playing":"Spiller av","paused":"Pauset","unavailable":"Utilgjengelig","power":"Effekt","btn_power":"På / av","btn_prev":"Forrige","btn_next":"Neste","btn_play":"Spill av / pause","btn_shuffle":"Tilfeldig","btn_mute":"Demp","f_entity":"Mediespiller (Kodi…)","f_entity_power":"Effektsensor på PC-en (smartplugg)","f_show_poster":"Vis plakaten","f_show_seek":"Vis fremdriftslinjen","f_show_volume":"Vis volumet","f_show_source":"Vis kildelisten"},"nl":{"f_switch":"Stekker van de pc (schakelaar)","confirm_off":"Stekker uitschakelen terwijl de pc aan staat?","f_poster_position":"Positie van de poster","poster_center":"Gecentreerd (standaard)","poster_left":"Links","poster_right":"Rechts","name":"Thuisbioscoop-pc (HTPC)","off":"Uit","standby":"Stand-by","idle":"Inactief","on":"Aan","playing":"Speelt af","paused":"Gepauzeerd","unavailable":"Niet beschikbaar","power":"Vermogen","btn_power":"Aan / uit","btn_prev":"Vorige","btn_next":"Volgende","btn_play":"Afspelen / pauze","btn_shuffle":"Willekeurig","btn_mute":"Dempen","f_entity":"Mediaspeler (Kodi…)","f_entity_power":"Vermogenssensor van de pc (slimme stekker)","f_show_poster":"de poster tonen","f_show_seek":"de voortgangsbalk tonen","f_show_volume":"het volume tonen","f_show_source":"de bronnenlijst tonen"},"pl":{"f_switch":"Gniazdko komputera (przełącznik)","confirm_off":"Wyłączyć gniazdko, gdy komputer jest włączony?","f_poster_position":"Pozycja plakatu","poster_center":"Wyśrodkowany (domyślnie)","poster_left":"Lewo","poster_right":"Prawo","name":"Komputer kina domowego (HTPC)","off":"Wyłączony","standby":"Czuwanie","idle":"Bezczynny","on":"Włączony","playing":"Odtwarzanie","paused":"Wstrzymano","unavailable":"Niedostępny","power":"Moc","btn_power":"Włącz / wyłącz","btn_prev":"Poprzedni","btn_next":"Następny","btn_play":"Odtwarzaj / pauza","btn_shuffle":"Losowo","btn_mute":"Wycisz","f_entity":"Odtwarzacz multimediów (Kodi…)","f_entity_power":"Czujnik mocy komputera (inteligentne gniazdko)","f_show_poster":"Pokaż plakat","f_show_seek":"Pokaż pasek postępu","f_show_volume":"Pokaż głośność","f_show_source":"Pokaż listę źródeł"},"pt-BR":{"f_switch":"Tomada do PC (interruptor)","confirm_off":"Desligar a tomada com o PC ligado?","f_poster_position":"Posição do pôster","poster_center":"Centralizado (padrão)","poster_left":"Esquerda","poster_right":"Direita","name":"PC home theater (HTPC)","off":"Desligado","standby":"Em espera","idle":"Inativo","on":"Ligado","playing":"Reproduzindo","paused":"Pausado","unavailable":"Indisponível","power":"Potência","btn_power":"Ligar / desligar","btn_prev":"Anterior","btn_next":"Próximo","btn_play":"Reproduzir / pausar","btn_shuffle":"Aleatório","btn_mute":"Silenciar","f_entity":"Reprodutor de mídia (Kodi…)","f_entity_power":"Sensor de potência do PC (tomada inteligente)","f_show_poster":"Mostrar o pôster","f_show_seek":"Mostrar a barra de progresso","f_show_volume":"Mostrar o volume","f_show_source":"Mostrar a lista de fontes"},"pt-PT":{"f_switch":"Tomada do PC (interruptor)","confirm_off":"Desligar a tomada com o PC ligado?","f_poster_position":"Posição do cartaz","poster_center":"Centrado (predefinição)","poster_left":"Esquerda","poster_right":"Direita","name":"PC home cinema (HTPC)","off":"Desligado","standby":"Em espera","idle":"Inativo","on":"Ligado","playing":"A reproduzir","paused":"Em pausa","unavailable":"Indisponível","power":"Potência","btn_power":"Ligar / desligar","btn_prev":"Anterior","btn_next":"Seguinte","btn_play":"Reproduzir / pausa","btn_shuffle":"Aleatório","btn_mute":"Silenciar","f_entity":"Leitor multimédia (Kodi…)","f_entity_power":"Sensor de potência do PC (tomada inteligente)","f_show_poster":"Mostrar o cartaz","f_show_seek":"Mostrar a barra de progresso","f_show_volume":"Mostrar o volume","f_show_source":"Mostrar a lista de fontes"},"ro":{"f_switch":"Priza PC-ului (comutator)","confirm_off":"Opriți priza cât timp PC-ul este pornit?","f_poster_position":"Poziția afișului","poster_center":"Centrat (implicit)","poster_left":"Stânga","poster_right":"Dreapta","name":"PC home cinema (HTPC)","off":"Oprit","standby":"Standby","idle":"Inactiv","on":"Pornit","playing":"Redare","paused":"Pauză","unavailable":"Indisponibil","power":"Putere","btn_power":"Pornit / oprit","btn_prev":"Anterior","btn_next":"Următorul","btn_play":"Redare / pauză","btn_shuffle":"Aleatoriu","btn_mute":"Fără sunet","f_entity":"Player media (Kodi…)","f_entity_power":"Senzor de putere al PC-ului (priză inteligentă)","f_show_poster":"Afișează afișul","f_show_seek":"Afișează bara de progres","f_show_volume":"Afișează volumul","f_show_source":"Afișează lista surselor"},"ru":{"f_switch":"Розетка ПК (выключатель)","confirm_off":"Отключить розетку, пока компьютер включён?","f_poster_position":"Положение постера","poster_center":"По центру (по умолчанию)","poster_left":"Слева","poster_right":"Справа","name":"Домашний кинотеатр на ПК (HTPC)","off":"Выключен","standby":"Ожидание","idle":"Простой","on":"Включён","playing":"Воспроизведение","paused":"Пауза","unavailable":"Недоступно","power":"Мощность","btn_power":"Вкл. / выкл.","btn_prev":"Предыдущий","btn_next":"Следующий","btn_play":"Воспроизведение / пауза","btn_shuffle":"Случайно","btn_mute":"Без звука","f_entity":"Медиаплеер (Kodi…)","f_entity_power":"Датчик мощности ПК (умная розетка)","f_show_poster":"Показывать постер","f_show_seek":"Показывать полосу прогресса","f_show_volume":"Показывать громкость","f_show_source":"Показывать список источников"},"sr":{"f_switch":"Утичница рачунара (прекидач)","confirm_off":"Искључити утичницу док је рачунар укључен?","f_poster_position":"Положај постера","poster_center":"Центрирано (подразумевано)","poster_left":"Лево","poster_right":"Десно","name":"Кућни биоскоп рачунар (HTPC)","off":"Искључен","standby":"Мировање","idle":"Неактиван","on":"Укључен","playing":"Репродукција","paused":"Паузирано","unavailable":"Недоступно","power":"Снага","btn_power":"Укљ. / искљ.","btn_prev":"Претходни","btn_next":"Следећи","btn_play":"Пусти / паузирај","btn_shuffle":"Насумично","btn_mute":"Искључи звук","f_entity":"Медија плејер (Kodi…)","f_entity_power":"Сензор снаге рачунара (паметна утичница)","f_show_poster":"Прикажи постер","f_show_seek":"Прикажи траку напретка","f_show_volume":"Прикажи јачину звука","f_show_source":"Прикажи листу извора"},"sr-Latn":{"f_switch":"Utičnica računara (prekidač)","confirm_off":"Isključiti utičnicu dok je računar uključen?","f_poster_position":"Položaj postera","poster_center":"Centrirano (podrazumevano)","poster_left":"Levo","poster_right":"Desno","name":"Kućni bioskop računar (HTPC)","off":"Isključen","standby":"Mirovanje","idle":"Neaktivan","on":"Uključen","playing":"Reprodukcija","paused":"Pauzirano","unavailable":"Nedostupno","power":"Snaga","btn_power":"Uklj. / isklj.","btn_prev":"Prethodni","btn_next":"Sledeći","btn_play":"Pusti / pauziraj","btn_shuffle":"Nasumično","btn_mute":"Isključi zvuk","f_entity":"Medija plejer (Kodi…)","f_entity_power":"Senzor snage računara (pametna utičnica)","f_show_poster":"Prikaži poster","f_show_seek":"Prikaži traku napretka","f_show_volume":"Prikaži jačinu zvuka","f_show_source":"Prikaži listu izvora"},"uk":{"f_switch":"Розетка ПК (вимикач)","confirm_off":"Вимкнути розетку, поки комп'ютер увімкнено?","f_poster_position":"Положення постера","poster_center":"По центру (за замовчуванням)","poster_left":"Ліворуч","poster_right":"Праворуч","name":"Домашній кінотеатр на ПК (HTPC)","off":"Вимкнено","standby":"Очікування","idle":"Простій","on":"Увімкнено","playing":"Відтворення","paused":"Пауза","unavailable":"Недоступно","power":"Потужність","btn_power":"Увімк. / вимк.","btn_prev":"Попередній","btn_next":"Наступний","btn_play":"Відтворення / пауза","btn_shuffle":"Випадково","btn_mute":"Без звуку","f_entity":"Медіаплеєр (Kodi…)","f_entity_power":"Датчик потужності ПК (розумна розетка)","f_show_poster":"Показувати постер","f_show_seek":"Показувати смугу прогресу","f_show_volume":"Показувати гучність","f_show_source":"Показувати список джерел"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée du boîtier (527 × 197)
  const IMG = window.__acImg("htpc",0);
  // fonctions gérées par un media_player (supported_features)
  const F = { PAUSE: 1, SEEK: 2, VOLUME_SET: 4, VOLUME_MUTE: 8, PREV: 16, NEXT: 32, TURN_ON: 128, TURN_OFF: 256, SELECT_SOURCE: 2048, PLAY: 16384, SHUFFLE: 32768 };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--ht-on:#3ba7ff;--ht-play:#3ddc84;--ht-warn:#ffb300}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.playing .badge{background:color-mix(in srgb,var(--ht-play) 22%,transparent);color:var(--ht-play)}
.paused .badge,.standby .badge{background:color-mix(in srgb,var(--ht-warn) 24%,transparent);color:var(--ht-warn)}
.on .badge,.idle .badge{background:color-mix(in srgb,var(--ht-on) 22%,transparent);color:var(--ht-on)}
svg{display:block;width:calc(100% * var(--illus-scale,1));max-width:100%;height:auto;margin:6px auto 4px;cursor:pointer;overflow:visible}
.scr{font-family:"Courier New",ui-monospace,monospace;font-weight:700;fill:#9aeaff;filter:drop-shadow(0 0 2px rgba(120,225,255,.7))}
.led{transition:fill .3s}
.marq{animation:htmarq var(--d,10s) linear infinite}
.ring{fill:none;stroke-width:1.6}.pulse{animation:htpulse 2.2s ease-in-out infinite}
.now{display:none;align-items:center;justify-content:center;gap:10px;margin-top:6px}.now.show{display:flex}
.now.left{justify-content:flex-start}.now.right{justify-content:flex-start;flex-direction:row-reverse}.now.right .tx{text-align:right}
.now .tx{max-width:calc(100% - 76px)}
.now img{width:64px;height:64px;object-fit:cover;border-radius:8px;flex:none;background:rgba(127,127,127,.15)}
.now .tx{min-width:0}.now .t{font-size:14px;font-weight:600;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.now .s{font-size:12px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.seek{display:none;margin-top:8px}.seek.show{display:block}
.seek input,.vol input{width:100%;margin:0;height:20px;accent-color:var(--primary-color,#03a9f4);cursor:pointer}
.seek .tm{display:flex;justify-content:space-between;font-size:11px;color:var(--secondary-text-color);margin-top:-2px}
.ctl{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap}
.ctl button{display:flex;align-items:center;justify-content:center;border:0;cursor:pointer;width:42px;height:42px;border-radius:50%;background:var(--secondary-background-color);color:var(--primary-text-color)}
.ctl button.big{width:52px;height:52px;background:color-mix(in srgb,var(--primary-color,#03a9f4) 22%,transparent)}
.ctl button.on{color:var(--primary-color,#03a9f4)}.ctl button.hide,.vol.hide,.src.hide,.tiles.hide{display:none}
.ctl button:disabled{opacity:.4;cursor:default}.ctl button ha-icon{--mdc-icon-size:22px}
.vol{display:flex;align-items:center;gap:6px;margin-top:6px}.vol button{border:0;background:none;cursor:pointer;color:var(--secondary-text-color);padding:0;display:flex}
.src{margin-top:6px}.src select{width:100%;box-sizing:border-box;padding:8px;border-radius:10px;border:0;background:var(--secondary-background-color);color:var(--primary-text-color);font:inherit}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color)}
.tile .l ha-icon{--mdc-icon-size:13px}.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px}.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.unavailable svg{filter:grayscale(.85) opacity(.6)}
.noanim *{animation:none!important}
@keyframes htmarq{from{transform:translateX(0)}to{transform:translateX(calc(-1 * var(--w,200px) - 140px))}}
@keyframes htpulse{50%{opacity:.35}}
`;

  const hms = (s) => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return `${h ? h + ':' + String(m).padStart(2, '0') : m}:${String(x).padStart(2, '0')}`; };

  class ApplianceHtpcCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^media_player\./.test(i) && /(kodi|htpc|cine|cinema|salon)/i.test(i)) || ids.find((i) => /^media_player\./.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { poster_position: 'center', show_poster: true, show_seek: true, show_volume: true, show_source: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._timer = setInterval(() => { if (this._built && this._hass && this._playing) this._tick(); }, 1000); }
    disconnectedCallback() { clearInterval(this._timer); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st() { return this._c.entity && this._hass.states[this._c.entity]; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _svc(s, d = {}) { this._hass.callService('media_player', s, { entity_id: this._c.entity, ...d }); }

    // bouton marche / arrêt : avec `switch` (prise du PC), il pilote la prise (même quand Kodi est indisponible, PC coupé) ;
    // couper la prise alors que le PC est allumé demande confirmation ; sans `switch`, il pilote le lecteur multimédia
    _power(s) {
      const c = this._c, sw = c.switch && this._hass.states[c.switch];
      if (!sw) { this._svc(s === 'off' || s === 'standby' ? 'turn_on' : 'turn_off'); return; }
      const dom = c.switch.split('.')[0], on = String(sw.state).toLowerCase() === 'on', pcOn = !/^(off|standby|unavailable|unknown)$/.test(s);
      const run = () => this._hass.callService(['switch', 'input_boolean', 'light'].includes(dom) ? dom : 'homeassistant', on ? 'turn_off' : 'turn_on', { entity_id: c.switch });
      if (on && pcOn && window.applianceConfirm) window.applianceConfirm(this, { action: 'toggle', confirmation: { text: this._t('confirm_off') } }, run); else run();
    }

    // état affichable : unavailable, off, standby, idle, on, playing, paused
    _state(st) {
      const s = st ? String(st.state).toLowerCase() : 'unavailable';
      return /^(playing|paused|idle|standby|off|on|unavailable)$/.test(s) ? s : s === 'buffering' ? 'playing' : s === 'unknown' ? 'unavailable' : 'on';
    }
    // position de lecture en secondes, avancée depuis la dernière mise à jour quand ça joue
    _pos(a, state) {
      let p = Number(a.media_position);
      if (!isFinite(p)) return NaN;
      if (state === 'playing' && a.media_position_updated_at) p += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
      const d = Number(a.media_duration);
      return isFinite(d) && d > 0 ? Math.min(p, d) : p;
    }
    _titles(a) {
      const t = a.media_title || a.media_series_title || '';
      const sub = [a.media_series_title && a.media_title ? a.media_series_title : '', a.media_season != null && a.media_episode != null ? `S${String(a.media_season).padStart(2, '0')}E${String(a.media_episode).padStart(2, '0')}` : '', a.media_artist || '', a.media_album_name || ''].filter(Boolean).join(' · ');
      return { t: String(t), sub };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="httitle"></div><div class="badge" id="htbadge"></div></div>
        <svg viewBox="0 0 527 197" role="img" aria-label="${esc(this._c.name || this._t('name'))}"><defs><clipPath id="htclip"><rect x="194" y="84" width="132" height="42"/></clipPath></defs>
          <ellipse cx="263" cy="193" rx="240" ry="6" fill="#000" opacity=".28"/>
          <image href="${IMG}" width="527" height="197"/><g id="htov"></g></svg>
        <div class="now" id="htnow"><img id="htpic" alt=""><div class="tx"><div class="t" id="htt"></div><div class="s" id="hts"></div></div></div>
        <div class="seek" id="htseek"><input type="range" id="htsk" min="0" max="1000" value="0"><div class="tm"><span id="htp">0:00</span><span id="htd">0:00</span></div></div>
        <div class="ctl" id="htctl">
          <button data-a="power" title=""><ha-icon icon="mdi:power"></ha-icon></button><button data-a="prev"><ha-icon icon="mdi:skip-previous"></ha-icon></button>
          <button data-a="play" class="big"><ha-icon icon="mdi:play"></ha-icon></button><button data-a="next"><ha-icon icon="mdi:skip-next"></ha-icon></button><button data-a="shuffle"><ha-icon icon="mdi:shuffle-variant"></ha-icon></button></div>
        <div class="vol" id="htvol"><button data-a="mute"><ha-icon icon="mdi:volume-high"></ha-icon></button><input type="range" id="htv" min="0" max="100" value="0"></div>
        <div class="src" id="htsrc"><select id="htsel"></select></div>
        <div class="tiles hide" id="httiles"></div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      const $ = (id) => root.getElementById(id);
      root.querySelectorAll('#htctl button,#htvol button').forEach((b) => b.addEventListener('click', () => {
        const st = this._st(), a = (st && st.attributes) || {}, s = this._state(st), k = b.dataset.a;
        if (k === 'power') this._power(s);
        else if (k === 'prev') this._svc('media_previous_track');
        else if (k === 'next') this._svc('media_next_track');
        else if (k === 'play') this._svc('media_play_pause');
        else if (k === 'shuffle') this._svc('shuffle_set', { shuffle: !a.shuffle });
        else if (k === 'mute') this._svc('volume_mute', { is_volume_muted: !a.is_volume_muted });
      }));
      const sk = $('htsk'); sk.addEventListener('input', () => { this._seeking = true; });
      sk.addEventListener('change', () => { const st = this._st(), d = Number(st && st.attributes.media_duration); if (isFinite(d) && d > 0) this._svc('media_seek', { seek_position: Math.round((sk.value / 1000) * d) }); this._seeking = false; });
      $('htv').addEventListener('change', (e) => this._svc('volume_set', { volume_level: Number(e.target.value) / 100 }));
      $('htsel').addEventListener('change', (e) => this._svc('select_source', { source: e.target.value }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // écran du boîtier + voyants (redessinés chaque seconde en lecture, pour le temps)
    _overlay(state, a) {
      const on = !/^(off|unavailable)$/.test(state), play = state === 'playing', pause = state === 'paused', stand = state === 'standby';
      const led = (x, col, glow) => `<circle class="led" cx="${x}" cy="151" r="3" fill="${col}" ${glow ? `style="filter:drop-shadow(0 0 4px ${col})"` : ''}/>`;
      const l1 = on && !stand ? '#3ba7ff' : stand ? '#ffb300' : '#2a2d31', l2 = play ? '#3ddc84' : pause ? '#ffb300' : '#2a2d31';
      let scr = '';
      if (on && !stand) {
        const { t } = this._titles(a), p = this._pos(a, state), d = Number(a.media_duration);
        const line1 = play || pause ? (t || '...').toUpperCase() : 'READY';
        const w = line1.length * 8.4, tm = play || pause ? `${isFinite(p) ? hms(p) : ''}${isFinite(d) && d > 0 ? ' / ' + hms(d) : ''}` : '';
        scr = `<g class="scr" clip-path="url(#htclip)">
          ${w > 126 ? `<text class="marq" x="326" y="102" font-size="14" style="--w:${Math.round(w)}px;--d:${Math.max(8, Math.round(w / 22))}s">${esc(line1)}</text>` : `<text x="260" y="102" font-size="14" text-anchor="middle">${esc(line1)}</text>`}
          <text x="198" y="120" font-size="10" opacity=".9">${play ? '▶' : pause ? '❚❚' : ''}</text><text x="322" y="120" font-size="10" text-anchor="end">${esc(tm)}</text></g>`;
      }
      return `${led(50, l1, on)}${led(75, l2, play || pause)}${led(98, '#2a2d31', false)}
        ${on && !stand ? '<circle class="ring" cx="74" cy="125" r="11.5" stroke="#3ba7ff" opacity=".8"/>' : ''}
        ${play ? '<circle class="ring pulse" cx="430" cy="81" r="29" stroke="#3ba7ff" opacity=".7"/>' : ''}${scr}`;
    }

    _tick() {
      const st = this._st(); if (!st) return;
      const a = st.attributes || {}, state = this._state(st), r = this._root;
      r.getElementById('htov').innerHTML = this._overlay(state, a);
      const d = Number(a.media_duration), p = this._pos(a, state);
      if (!this._seeking && isFinite(d) && d > 0 && isFinite(p)) { r.getElementById('htsk').value = String(Math.round((p / d) * 1000)); r.getElementById('htp').textContent = hms(p); }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, hass = this._hass, st = this._st();
      const a = (st && st.attributes) || {}, state = this._state(st), $ = (id) => r.getElementById(id);
      this._playing = state === 'playing';
      card.className = `${state}${c.animations === false ? ' noanim' : ''}`;
      $('httitle').textContent = c.name || (a.friendly_name || this._t('name'));
      const badge = $('htbadge'); badge.textContent = this._t(state); badge.style.display = c.show_status === false ? 'none' : '';
      const sf = a.supported_features == null ? 0x7fffffff : Number(a.supported_features), has = (f) => (sf & f) !== 0, active = state === 'playing' || state === 'paused';
      // affiche, titre, sous-titre
      const { t, sub } = this._titles(a), pic = a.entity_picture_local || a.entity_picture;
      const now = $('htnow'); now.classList.toggle('show', active && (c.show_poster !== false || !!t));
      now.classList.toggle('left', c.poster_position === 'left'); now.classList.toggle('right', c.poster_position === 'right');
      const img = $('htpic'); img.style.display = c.show_poster !== false && pic ? '' : 'none';
      if (pic) { const u = String(pic).startsWith('/') && hass.hassUrl ? hass.hassUrl(pic) : pic; if (img.dataset.u !== u) { img.dataset.u = u; img.src = u; } }
      $('htt').textContent = t; $('hts').textContent = sub;
      // barre de lecture
      const d = Number(a.media_duration), seek = $('htseek'); seek.classList.toggle('show', c.show_seek !== false && active && isFinite(d) && d > 0);
      $('htd').textContent = isFinite(d) && d > 0 ? hms(d) : ''; $('htsk').disabled = !has(F.SEEK);
      // boutons
      const b = (k) => r.querySelector(`#htctl button[data-a="${k}"]`), pw = b('power'), off = state === 'off' || state === 'standby';
      const swSt = c.switch && hass.states[c.switch], hasSw = !!swSt && !/^(unavailable|unknown)$/i.test(String(swSt.state));
      pw.classList.toggle('hide', !hasSw && !(has(F.TURN_ON) || has(F.TURN_OFF))); pw.classList.toggle('on', hasSw ? String(swSt.state).toLowerCase() === 'on' : !off && state !== 'unavailable'); pw.title = this._t('btn_power');
      b('prev').classList.toggle('hide', !has(F.PREV)); b('next').classList.toggle('hide', !has(F.NEXT)); b('prev').title = this._t('btn_prev'); b('next').title = this._t('btn_next');
      const pl = b('play'); pl.classList.toggle('hide', !(has(F.PAUSE) || has(F.PLAY))); pl.title = this._t('btn_play'); pl.querySelector('ha-icon').setAttribute('icon', state === 'playing' ? 'mdi:pause' : 'mdi:play');
      const sh = b('shuffle'); sh.classList.toggle('hide', !has(F.SHUFFLE) || !active); sh.classList.toggle('on', !!a.shuffle); sh.title = this._t('btn_shuffle');
      r.querySelectorAll('#htctl button').forEach((x) => { x.disabled = state === 'unavailable' && !(hasSw && x.dataset.a === 'power'); });
      // volume, source
      const vol = $('htvol'); vol.classList.toggle('hide', c.show_volume === false || !has(F.VOLUME_SET) || off);
      if (a.volume_level != null) $('htv').value = String(Math.round(Number(a.volume_level) * 100));
      const mu = vol.querySelector('button ha-icon'); mu.setAttribute('icon', a.is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high'); vol.querySelector('button').title = this._t('btn_mute');
      const src = $('htsrc'), list = Array.isArray(a.source_list) ? a.source_list : [];
      src.classList.toggle('hide', c.show_source === false || !has(F.SELECT_SOURCE) || !list.length || off);
      const sel = $('htsel'), key = list.join('|'); if (sel.dataset.k !== key) { sel.dataset.k = key; sel.innerHTML = list.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join(''); } if (a.source) sel.value = a.source;
      // tuile de puissance (prise connectée sur le PC)
      const tiles = $('httiles'), pwId = c.entity_power, ps = pwId && hass.states[pwId], ok = ps && !/^(unavailable|unknown)$/i.test(String(ps.state));
      tiles.classList.toggle('hide', !ok);
      if (ok) { const n = parseFloat(String(ps.state).replace(',', '.')); tiles.innerHTML = `<div class="tile" data-e="${esc(pwId)}"><div class="l"><ha-icon icon="mdi:flash"></ha-icon><span>${esc(this._t('power'))}</span></div><div class="v">${isFinite(n) ? n.toLocaleString(window.applianceLocale(c, hass), { maximumFractionDigits: n < 10 ? 1 : 0 }) : esc(ps.state)}<small>${esc((ps.attributes && ps.attributes.unit_of_measurement) || 'W')}</small></div></div>`; tiles.querySelector('.tile').onclick = () => this._more(pwId); }
      this._tick();
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceHtpcCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHtpcCardEditor extends HTMLElement {
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
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', selector: { entity: { domain: 'media_player' } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor' } } },
        { name: 'switch', selector: { entity: { domain: ['switch', 'input_boolean', 'light'] } } },
        { name: 'poster_position', selector: { select: { mode: 'dropdown', options: ['center', 'left', 'right'].map((value) => ({ value, label: tr[`poster_${value}`] || value })) } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_poster'), bool('show_seek'), bool('show_volume'), bool('show_source'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceHtpcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Home cinéma PC (Kodi…) sur la photo d\'un boîtier HTPC : voyants et écran du boîtier qui suivent la lecture, affiche, barre de lecture, commandes, volume et source.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/htpc.md',
  });
})();
