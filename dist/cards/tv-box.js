/* Carte « Box TV » — custom:appliance-tv-box-card
 * Photos détourées : Apple TV 4K (model: apple_tv_4k), Freebox Player Pop (model: freebox_pop), Xiaomi TV Box S (xiaomi_tv_box_s),
 * NVIDIA Shield TV Pro (shield_tv_pro), Google TV Streamer (google_tv_streamer), Google TV (google_tv), Chromecast 3e gén. (chromecast).
 * Entité media_player (Android TV Remote, Cast, Freebox…),
 * remote facultatif pour l'allumage.
 * Animations : écran flottant avec pochette en fondu « Ken Burns », ambilight à la couleur de la
 * pochette, aurore animée sur l'accueil, égaliseur et barre de progression en lecture, pause qui
 * pulse, chargement qui tourne, ondes émises par la box, LED de la box (bande verte de la Shield,
 * LED blanche de la Xiaomi, halo du Player Pop), affichage du volume à l'écran quand il change.
 * États : off, standby, idle, on, playing, paused, buffering, unavailable.
 */
(() => {
  const TAG = 'appliance-tv-box-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"TV box","off":"Off","standby":"Standby","idle":"Idle","on":"On","playing":"Playing","paused":"Paused","buffering":"Loading","unavailable":"Unavailable","app":"App","volume":"Volume","power":"Power","muted":"Muted","play":"Play","pause":"Pause","previous":"Previous","source":"Next source","next":"Next","vol_down":"Volume down","vol_up":"Volume up","mute":"Mute","home":"Home"},"cs":{"name":"TV box","off":"Vypnuto","standby":"Pohotovost","idle":"Nečinný","on":"Zapnuto","playing":"Přehrává","paused":"Pozastaveno","buffering":"Načítání","unavailable":"Nedostupné","app":"Aplikace","volume":"Hlasitost","power":"Napájení","muted":"Ztlumeno","play":"Přehrát","pause":"Pauza","previous":"Předchozí","next":"Další","vol_down":"Zeslabit","vol_up":"Zesílit","mute":"Ztlumit","home":"Domů"},"da":{"name":"TV-boks","off":"Slukket","standby":"Standby","idle":"Inaktiv","on":"Tændt","playing":"Afspiller","paused":"På pause","buffering":"Indlæser","unavailable":"Utilgængelig","app":"App","volume":"Lydstyrke","power":"Tænd/sluk","muted":"Lyd slået fra","play":"Afspil","pause":"Pause","previous":"Forrige","next":"Næste","vol_down":"Skru ned","vol_up":"Skru op","mute":"Slå lyd fra","home":"Hjem"},"de":{"name":"TV-Box","off":"Aus","standby":"Standby","idle":"Leerlauf","on":"An","playing":"Wiedergabe","paused":"Pausiert","buffering":"Lädt","unavailable":"Nicht verfügbar","app":"App","volume":"Lautstärke","power":"Leistung","muted":"Stumm","play":"Wiedergabe","pause":"Pause","previous":"Zurück","next":"Weiter","vol_down":"Leiser","vol_up":"Lauter","mute":"Stumm","home":"Startseite","source":"Nächste Quelle"},"es":{"name":"Dispositivo de TV","off":"Apagado","standby":"En espera","idle":"Inactivo","on":"Encendido","playing":"Reproduciendo","paused":"En pausa","buffering":"Cargando","unavailable":"No disponible","app":"Aplicación","volume":"Volumen","power":"Potencia","muted":"Silenciado","play":"Reproducir","pause":"Pausa","previous":"Anterior","source":"Fuente siguiente","next":"Siguiente","vol_down":"Bajar volumen","vol_up":"Subir volumen","mute":"Silenciar","home":"Inicio"},"fr":{"name":"Box TV","off":"Éteint","standby":"En veille","idle":"Au repos","on":"Allumée","playing":"Lecture","paused":"En pause","buffering":"Chargement","unavailable":"Indisponible","app":"Appli","volume":"Volume","power":"Puissance","muted":"Muet","play":"Lecture","pause":"Pause","previous":"Précédent","source":"Source suivante","next":"Suivant","vol_down":"Volume −","vol_up":"Volume +","mute":"Muet","home":"Accueil"},"hu":{"name":"TV box","off":"Ki","standby":"Készenlét","idle":"Tétlen","on":"Be","playing":"Lejátszás","paused":"Szüneteltetve","buffering":"Betöltés","unavailable":"Nem elérhető","app":"Alkalmazás","volume":"Hangerő","power":"Teljesítmény","muted":"Némítva","play":"Lejátszás","pause":"Szünet","previous":"Előző","next":"Következő","vol_down":"Hangerő le","vol_up":"Hangerő fel","mute":"Némítás","home":"Kezdőlap"},"it":{"name":"TV box","off":"Spento","standby":"Standby","idle":"Inattivo","on":"Accesa","playing":"In riproduzione","paused":"In pausa","buffering":"Caricamento","unavailable":"Non disponibile","app":"App","volume":"Volume","power":"Potenza","muted":"Muto","play":"Riproduci","pause":"Pausa","previous":"Precedente","next":"Successivo","vol_down":"Volume −","vol_up":"Volume +","mute":"Muto","home":"Home"},"nb":{"name":"TV-boks","off":"Av","standby":"Hvilemodus","idle":"Inaktiv","on":"På","playing":"Spiller","paused":"Pause","buffering":"Laster","unavailable":"Utilgjengelig","app":"App","volume":"Volum","power":"Effekt","muted":"Dempet","play":"Spill","pause":"Pause","previous":"Forrige","next":"Neste","vol_down":"Volum ned","vol_up":"Volum opp","mute":"Demp","home":"Hjem"},"nl":{"name":"Tv-box","off":"Uit","standby":"Stand-by","idle":"Inactief","on":"Aan","playing":"Speelt af","paused":"Gepauzeerd","buffering":"Laden","unavailable":"Niet beschikbaar","app":"App","volume":"Volume","power":"Vermogen","muted":"Gedempt","play":"Afspelen","pause":"Pauze","previous":"Vorige","next":"Volgende","vol_down":"Zachter","vol_up":"Harder","mute":"Dempen","home":"Start"},"pl":{"name":"Dekoder TV","off":"Wył.","standby":"Czuwanie","idle":"Bezczynny","on":"Wł.","playing":"Odtwarzanie","paused":"Wstrzymano","buffering":"Ładowanie","unavailable":"Niedostępny","app":"Aplikacja","volume":"Głośność","power":"Moc","muted":"Wyciszono","play":"Odtwarzaj","pause":"Pauza","previous":"Poprzedni","next":"Następny","vol_down":"Ciszej","vol_up":"Głośniej","mute":"Wycisz","home":"Ekran główny"},"pt-BR":{"name":"Box de TV","off":"Desligado","standby":"Em espera","idle":"Inativo","on":"Ligado","playing":"Em reprodução","paused":"Em pausa","buffering":"Carregando","unavailable":"Indisponível","app":"Aplicativo","volume":"Volume","power":"Potência","muted":"Sem som","play":"Reproduzir","pause":"Pausa","previous":"Anterior","source":"Fonte seguinte","next":"Seguinte","vol_down":"Diminuir volume","vol_up":"Aumentar volume","mute":"Silenciar","home":"Início"},"pt-PT":{"name":"Box de TV","off":"Desligado","standby":"Em espera","idle":"Inativo","on":"Ligado","playing":"Em reprodução","paused":"Em pausa","buffering":"A carregar","unavailable":"Indisponível","app":"Aplicação","volume":"Volume","power":"Potência","muted":"Sem som","play":"Reproduzir","pause":"Pausa","previous":"Anterior","source":"Fonte seguinte","next":"Seguinte","vol_down":"Diminuir volume","vol_up":"Aumentar volume","mute":"Silenciar","home":"Início"},"ro":{"name":"TV box","off":"Oprit","standby":"Standby","idle":"Inactiv","on":"Pornit","playing":"Redare","paused":"Pauză","buffering":"Se încarcă","unavailable":"Indisponibil","app":"Aplicație","volume":"Volum","power":"Putere","muted":"Fără sunet","play":"Redă","pause":"Pauză","previous":"Anterior","next":"Următor","vol_down":"Volum −","vol_up":"Volum +","mute":"Fără sunet","home":"Acasă"},"ru":{"name":"ТВ-приставка","off":"Выключен","standby":"Ожидание","idle":"Простой","on":"Включена","playing":"Воспроизведение","paused":"Пауза","buffering":"Загрузка","unavailable":"Недоступно","app":"Приложение","volume":"Громкость","power":"Мощность","muted":"Без звука","play":"Воспроизвести","pause":"Пауза","previous":"Назад","source":"Следующий источник","next":"Далее","vol_down":"Тише","vol_up":"Громче","mute":"Без звука","home":"Домой"},"sr":{"name":"ТВ бокс","off":"Искључено","standby":"Приправност","idle":"Мировање","on":"Укључено","playing":"Репродукција","paused":"Паузирано","buffering":"Учитавање","unavailable":"Недоступно","app":"Апликација","volume":"Јачина звука","power":"Снага","muted":"Без звука","play":"Пусти","pause":"Паузирај","previous":"Претходно","source":"Следећи извор","next":"Следеће","vol_down":"Смањи звук","vol_up":"Појачај звук","mute":"Искључи звук","home":"Почетна"},"sr-Latn":{"name":"TV boks","off":"Isključeno","standby":"Pripravnost","idle":"Mirovanje","on":"Uključeno","playing":"Reprodukcija","paused":"Pauzirano","buffering":"Učitavanje","unavailable":"Nedostupno","app":"Aplikacija","volume":"Jačina zvuka","power":"Snaga","muted":"Bez zvuka","play":"Pusti","pause":"Pauziraj","previous":"Prethodno","source":"Sledeći izvor","next":"Sledeće","vol_down":"Smanji zvuk","vol_up":"Pojačaj zvuk","mute":"Isključi zvuk","home":"Početna"},"uk":{"name":"ТВ-приставка","off":"Вимк.","standby":"Режим очікування","idle":"Очікування","on":"Увімк.","playing":"Відтворюється","paused":"На паузі","buffering":"Завантаження","unavailable":"Недоступно","app":"Застосунок","volume":"Гучність","power":"Живлення","muted":"Звук вимкнено","play":"Відтворити","pause":"Пауза","previous":"Назад","source":"Наступне джерело","next":"Далі","vol_down":"Тихіше","vol_up":"Гучніше","mute":"Вимкнути звук","home":"Головна"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Chaque modèle : photo, position dans le dessin (x, y, w, h), couleur d'accent, point d'émission des ondes,
     et calque lumineux propre (LED). Coordonnées = px photo × échelle + décalage. */
  const MODELS = {
    shield_tv_pro: {
      label: 'NVIDIA Shield TV Pro', img: window.__acImg("tv-box",0), box: [204, 22, 86.3, 150], accent: '#76b900', wave: [214, 70],
      // bande verte de la photo : coin haut → nœud → bas, et petite branche à droite
      led: `<path class="ledoff" d="M224.6 32.3 L260.3 58.6 L236.1 122.7 M260.3 58.6 L268.9 63.1"/>
            <path class="ledon" d="M224.6 32.3 L260.3 58.6 L236.1 122.7 M260.3 58.6 L268.9 63.1"/>
            <path class="ledrun" pathLength="100" d="M224.6 32.3 L260.3 58.6 L236.1 122.7"/>`,
    },
    xiaomi_tv_box_s: {
      label: 'Xiaomi TV Box S', img: window.__acImg("tv-box",1), box: [196, 76, 96, 96], accent: '#ff6900', wave: [204, 104],
      led: `<rect class="ledoff" x="240.6" y="165.6" width="7" height="2.4" rx="1.2"/><rect class="ledon dot" x="240.6" y="165.6" width="7" height="2.4" rx="1.2"/>`,
    },
    freebox_pop: {
      label: 'Freebox Player Pop', img: window.__acImg("tv-box",2), box: [186, 84, 112, 84.7], accent: '#e2001a', wave: [196, 112],
      // halo lumineux sous le galet (le Player Pop n'a pas de LED en façade)
      led: `<ellipse class="halo" cx="242" cy="166" rx="62" ry="9" fill="url(#tv-halo)"/>`,
    },
    // apple_tv_4k : Apple TV 4K (boîtier noir laqué), photo détourée ; halo blanc sous le boîtier comme voyant d'état (pas de LED en façade)
    apple_tv_4k: {
      label: 'Apple TV 4K', img: window.__acImg("tv-box",3), box: [186, 87.2, 108, 80.8], accent: '#c7ccd1', wave: [196, 127.6],
      led: `<ellipse class="halo" cx="240" cy="166" rx="56" ry="8" fill="url(#tv-halo)"/>`,
    },
    google_tv_streamer: {
      label: 'Google TV Streamer', img: window.__acImg("tv-box",4), box: [186, 104, 108, 68], accent: '#4285f4', wave: [240, 114],
      led: '',
    },
    // fire_tv_stick_gen1 : Fire TV Stick 1re génération + télécommande simple (photo détourée) ; halo orange sous l'ensemble comme voyant d'état
    fire_tv_stick_gen1: {
      label: 'Amazon Fire TV Stick (1st gen.)', img: window.__acImg("tv-box",5), box: [186, 112, 108, 51.4], accent: '#ff9900', wave: [240, 118],
      led: `<ellipse class="halo" cx="240" cy="165" rx="58" ry="7" fill="url(#tv-halo)"/>`,
    },
    // fire_tv_stick : Fire TV Stick 4K / 4K Max + télécommande Alexa (photo détourée) ; le voyant bleu de la télécommande suit l'état
    fire_tv_stick: {
      label: 'Amazon Fire TV Stick 4K', img: window.__acImg("tv-box",6), box: [206, 22, 69.9, 150], accent: '#00a8e1', wave: [214, 70],
      led: `<circle class="ledoff" cx="267.5" cy="28.9" r="1.5"/><circle class="ledon dot" cx="267.5" cy="28.9" r="1.5"/>`,
    },
    // orange_tv : décodeur Orange TV 4K (KaonMedia), photo détourée ; voyant vert à l'angle avant gauche
    orange_tv: {
      label: 'Orange TV 4K (decodificador)', img: window.__acImg("tv-box",7), box: [186, 118, 108, 50.4], accent: '#ff7900', wave: [240, 124],
      led: `<circle class="ledoff" cx="189.6" cy="143.4" r="1.4"/><circle class="ledon dot" cx="189.6" cy="143.4" r="1.4"/>`,
    },
    // chromecast : Google Chromecast 3e génération (galet noir + câble HDMI), photo détourée ; ondes émises depuis le galet
    chromecast: {
      label: 'Google Chromecast', img: window.__acImg("tv-box",8), box: [194, 94, 94, 76], accent: '#4285f4', wave: [203, 112],
      led: '',
    },
    google_tv: {
      label: 'Google TV', img: window.__acImg("tv-box",9), box: [186, 104, 108, 68], accent: '#4285f4', wave: [240, 114],
      led: '',
    },
  };
  const BTN_KEYS = ['power', 'home', 'prev', 'play_pause', 'next', 'source', 'vol_down', 'mute', 'vol_up'];
  const ALIAS = { firetvstickgen1: 'fire_tv_stick_gen1', firetvgen1: 'fire_tv_stick_gen1', firetv: 'fire_tv_stick', firetvstick: 'fire_tv_stick', amazonfiretv: 'fire_tv_stick', orange: 'orange_tv', orangetv: 'orange_tv', kaon: 'orange_tv', shield: 'shield_tv_pro', appletv: 'apple_tv_4k', appletv4k: 'apple_tv_4k', apple: 'apple_tv_4k', shieldtvpro: 'shield_tv_pro', xiaomi: 'xiaomi_tv_box_s', xiaomitvboxs: 'xiaomi_tv_box_s', mibox: 'xiaomi_tv_box_s', freebox: 'freebox_pop', freeboxpop: 'freebox_pop', playerpop: 'freebox_pop', googletv: 'google_tv', chromecastgoogletv: 'google_tv', chromecast3: 'chromecast', chromecastgen3: 'chromecast', googletvstreamer: 'google_tv_streamer', tvstreamer: 'google_tv_streamer' };
  const modelKey = (m) => { const k = String(m || '').toLowerCase(); if (MODELS[k]) return k; const n = k.replace(/[^a-z0-9]/g, ''); return ALIAS[n] || 'shield_tv_pro'; };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --tv-ok:var(--appliance-ok-color,#43a047);--tv-alert:var(--appliance-alert-color,#db4437);--acc:#76b900;--amb:#3d7bff;--prog:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.playing .badge,.buffering .badge{background:color-mix(in srgb,var(--acc) 24%,transparent);color:var(--acc)}
.on .badge,.idle .badge,.paused .badge{background:color-mix(in srgb,var(--tv-ok) 20%,transparent);color:var(--tv-ok)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{width:34px;height:34px;border-radius:50%;border:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:19px;padding:0}
.ctrls button:hover{transform:scale(1.08)}.ctrls button:active{transform:scale(.92)}
.ctrls button.on{background:var(--acc);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--acc) 60%,transparent)}
.ctrls button.main{width:40px;height:40px;--mdc-icon-size:22px}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- écran flottant ---- */
.amb{opacity:0;transition:opacity 1s,fill 1.2s}
.amb rect{fill:var(--amb);transition:fill 1.2s}
.on .amb,.idle .amb{opacity:.35}
.playing .amb{opacity:.75;animation:tvamb 4s ease-in-out infinite}
.paused .amb,.buffering .amb{opacity:.3}
@keyframes tvamb{50%{opacity:.45}}
.scr{fill:#05070a;stroke:#2a2f36;stroke-width:1.4}
.aur{opacity:0;transition:opacity .8s}
.on .aur,.idle .aur,.buffering .aur,.noart .aur{opacity:1}
.off .aur,.standby .aur,.unavailable .aur{opacity:0!important}
.aur ellipse{transform-box:fill-box;transform-origin:50% 50%}
.aur .a1{fill:var(--acc);opacity:.55;animation:tvau1 9s ease-in-out infinite}
.aur .a2{fill:#3d7bff;opacity:.5;animation:tvau2 11s ease-in-out infinite}
.aur .a3{fill:#b14dff;opacity:.4;animation:tvau3 13s ease-in-out infinite}
@keyframes tvau1{50%{transform:translate(60px,18px) scale(1.3)}}
@keyframes tvau2{50%{transform:translate(-50px,-14px) scale(1.4)}}
@keyframes tvau3{50%{transform:translate(30px,-20px) scale(.8)}}
.art{opacity:0;transition:opacity .9s;transform-box:fill-box;transform-origin:50% 50%}
.hasart.playing .art,.hasart.paused .art,.hasart.buffering .art{opacity:1}
.hasart.playing .art{animation:tvkb 18s ease-in-out infinite alternate}
.paused .art{filter:brightness(.5) saturate(.6)}
@keyframes tvkb{from{transform:scale(1) translate(0,0)}to{transform:scale(1.14) translate(-6px,-3px)}}
.shade{opacity:0;transition:opacity .6s}
.playing .shade,.paused .shade,.buffering .shade,.on .shade,.idle .shade{opacity:1}
.app{fill:#fff;font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);letter-spacing:.08em;opacity:0;transition:opacity .5s}
.mt{fill:#fff;font:700 9.5px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);opacity:0;transition:opacity .5s}
.ma{fill:#cfd6de;font:500 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);opacity:0;transition:opacity .5s}
.playing .app,.paused .app,.buffering .app,.on .app,.idle .app,.playing .mt,.paused .mt,.playing .ma,.paused .ma,.on .mt,.idle .mt{opacity:1}
.pbar{fill:rgba(255,255,255,.22)}.pfill{fill:var(--acc);transform-box:fill-box;transform-origin:0 50%;transform:scaleX(var(--prog));transition:transform 1s linear}
.prog{opacity:0}.hasdur.playing .prog,.hasdur.paused .prog{opacity:1}
.eq rect{fill:var(--acc);transform-box:fill-box;transform-origin:50% 100%;opacity:0}
.playing .eq rect{opacity:.95;animation:tveq .9s ease-in-out infinite}
.eq rect:nth-child(2){animation-delay:-.3s!important;animation-duration:.7s!important}.eq rect:nth-child(3){animation-delay:-.55s!important;animation-duration:1.1s!important}
.eq rect:nth-child(4){animation-delay:-.15s!important;animation-duration:.8s!important}
@keyframes tveq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.pz{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.paused .pz{opacity:.9;animation:tvpz 1.6s ease-in-out infinite}
@keyframes tvpz{50%{transform:scale(1.12);opacity:.55}}
.spin{fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:22 60;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.buffering .spin{opacity:.9;animation:tvspin .9s linear infinite}
@keyframes tvspin{to{transform:rotate(360deg)}}
.glass{pointer-events:none}
.sby{fill:#ff2d2d;opacity:0}
.off .sby,.standby .sby{opacity:.9;animation:tvsby 3s ease-in-out infinite}
@keyframes tvsby{50%{opacity:.35}}
.osd{opacity:0;transition:opacity .35s}
.osd.show{opacity:1}
.osd .ob{fill:rgba(0,0,0,.55)}.osd .of{fill:#fff;transform-box:fill-box;transform-origin:0 50%;transition:transform .3s}
.osdt{fill:#fff;font:700 7px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif)}

/* ---- box ---- */
.photo{transition:filter .6s}
.off .photo,.unavailable .photo{filter:brightness(.72) saturate(.7)}
.shadow{opacity:.5}
.waves path{fill:none;stroke:var(--acc);stroke-width:1.6;stroke-linecap:round;opacity:0}
.playing .waves path{animation:tvwave 1.8s ease-out infinite}
.waves path:nth-child(2){animation-delay:.3s!important}.waves path:nth-child(3){animation-delay:.6s!important}
@keyframes tvwave{0%{opacity:0;transform:translateX(4px)}25%{opacity:.9}100%{opacity:0;transform:translateX(-10px)}}
.ledoff{fill:#141618;stroke:#141618;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.ledon{fill:none;stroke:var(--acc);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;opacity:0;filter:drop-shadow(0 0 2.5px var(--acc));transition:opacity .6s}
.ledon.dot{fill:#fff;stroke:none;filter:drop-shadow(0 0 3px #fff)}
.on .ledon,.idle .ledon,.paused .ledon,.buffering .ledon{opacity:.85}
.playing .ledon{opacity:1}
.standby .ledon{opacity:.6;animation:tvbr 4s ease-in-out infinite}
@keyframes tvbr{50%{opacity:.08}}
.ledrun{fill:none;stroke:#eaffc0;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:8 92;opacity:0;filter:drop-shadow(0 0 3px #b6ff3b)}
.playing .ledrun{opacity:1;animation:tvrun 2.4s linear infinite}
@keyframes tvrun{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.halo{opacity:0;transition:opacity .8s}
.on .halo,.idle .halo,.paused .halo,.buffering .halo{opacity:.55}
.playing .halo{opacity:.9;animation:tvhalo 3s ease-in-out infinite}
.standby .halo{opacity:.25}
@keyframes tvhalo{50%{opacity:.5}}
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
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{width:21px;height:21px;--mdc-icon-size:13px}
.compact .ctrls button.main{width:24px;height:24px;--mdc-icon-size:15px}
`;

  // icônes de lecture dessinées (pause, logo par défaut)
  const SVG = (label, m) => {
    const [bx, by, bw, bh] = m.box, [wx, wy] = m.wave;
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <filter id="tv-blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="tv-blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
  <clipPath id="tv-scr"><rect x="10" y="10" width="176" height="99" rx="6"/></clipPath>
  <linearGradient id="tv-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></linearGradient>
  <linearGradient id="tv-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".38" stop-color="#fff" stop-opacity=".03"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="tv-halo"><stop offset="0" style="stop-color:var(--acc)" stop-opacity=".9"/><stop offset="1" style="stop-color:var(--acc)" stop-opacity="0"/></radialGradient>
  <radialGradient id="tv-shadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 </defs>
 <!-- ambilight -->
 <g class="amb" filter="url(#tv-blur)"><rect x="4" y="4" width="188" height="111" rx="10"/></g>
 <rect class="scr" x="10" y="10" width="176" height="99" rx="6"/>
 <g clip-path="url(#tv-scr)">
  <g class="aur" filter="url(#tv-blur2)"><ellipse class="a1" cx="50" cy="40" rx="50" ry="26"/><ellipse class="a2" cx="140" cy="80" rx="55" ry="28"/><ellipse class="a3" cx="100" cy="30" rx="40" ry="22"/></g>
  <image class="art" id="tvart" x="10" y="10" width="176" height="99" preserveAspectRatio="xMidYMid slice"/>
  <rect class="shade" x="10" y="10" width="176" height="99" fill="url(#tv-shade)"/>
  <text class="app" id="tvapp" x="18" y="22"></text>
  <text class="mt" id="tvmt" x="18" y="88"></text>
  <text class="ma" id="tvma" x="18" y="98"></text>
  <g class="eq"><rect x="164" y="80" width="3" height="12" rx="1"/><rect x="169" y="80" width="3" height="12" rx="1"/><rect x="174" y="80" width="3" height="12" rx="1"/><rect x="179" y="80" width="3" height="12" rx="1"/></g>
  <g class="prog"><rect class="pbar" x="18" y="103" width="160" height="2" rx="1"/><rect class="pfill" x="18" y="103" width="160" height="2" rx="1"/></g>
  <g class="pz"><circle cx="98" cy="56" r="14" fill="rgba(0,0,0,.45)"/><rect x="92.5" y="49" width="4" height="14" rx="1.2" fill="#fff"/><rect x="99.5" y="49" width="4" height="14" rx="1.2" fill="#fff"/></g>
  <circle class="spin" cx="98" cy="56" r="10"/>
  <g class="osd" id="tvosd"><rect class="ob" x="58" y="44" width="80" height="22" rx="6"/><text class="osdt" id="tvosdt" x="66" y="53">VOL</text>
   <rect x="66" y="57" width="64" height="3" rx="1.5" fill="rgba(255,255,255,.25)"/><rect class="of" id="tvosdf" x="66" y="57" width="64" height="3" rx="1.5"/></g>
  <rect class="glass" x="10" y="10" width="176" height="99" fill="url(#tv-glass)"/>
 </g>
 <circle class="sby" cx="98" cy="113.5" r="1.3"/>
 <path d="M84 109.5 h28 l3 5 h-34 z" fill="#23272d"/>
 <!-- box -->
 <ellipse class="shadow" cx="${bx + bw / 2}" cy="${by + bh - 1}" rx="${bw * 0.48}" ry="5" fill="url(#tv-shadow)"/>
 <g class="waves"><path d="M${wx} ${wy - 6} q-5 6 0 12"/><path d="M${wx - 5} ${wy - 10} q-8 10 0 20"/><path d="M${wx - 10} ${wy - 14} q-11 14 0 28"/></g>
 <image class="photo" href="${m.img}" x="${bx}" y="${by}" width="${bw}" height="${bh}"/>
 ${m.led}
</svg>`;
  };

  class ApplianceTvBoxCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const mp = ids.filter((i) => i.startsWith('media_player.'));
      const pick = mp.find((i) => /shield|freebox|player|xiaomi|mibox|tv_box|android|apple_?tv/i.test(i)) || mp[0] || '';
      const model = /apple_?tv/i.test(pick) ? 'apple_tv_4k' : /freebox|player_pop|free/i.test(pick) ? 'freebox_pop' : /xiaomi|mibox|mi_box/i.test(pick) ? 'xiaomi_tv_box_s' : 'shield_tv_pro';
      const base = pick.split('.')[1] || '';
      const remote = ids.find((i) => i === `remote.${base}`) || '';
      return { entity: pick, model, ...(remote ? { entity_remote: remote } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_artwork: true, show_app: true, show_volume: true, show_power: true, volume_step: 0.05, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { if (!this._tick) this._tick = setInterval(() => this._progress(), 1000); }
    disconnectedCallback() { clearInterval(this._tick); this._tick = null; clearTimeout(this._osdT); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      this._model = m;
      this._ambUrl = ''; // nouvelle ha-card : la couleur d'ambiance (--amb) de l'affiche doit être recalculée
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="tvtitle"></div><div class="badge" id="tvbadge"></div></div>
        ${SVG(this._c.name || m.label, m)}
        <div class="ctrls" id="tvctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="app"><div class="l"><ha-icon icon="mdi:apps"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="volume"><div class="l"><ha-icon icon="mdi:volume-high"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="power"><div class="l"><ha-icon icon="mdi:flash"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      this._card.style.setProperty('--acc', m.accent);
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(el.dataset.k === 'power' ? this._c.entity_power : this._c.entity)));
      root.getElementById('tvctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      const art = root.getElementById('tvart');
      art.addEventListener('load', () => this._card.classList.add('artok'));
      this._root = root; this._built = true; this._lastVol = undefined; this._lastPic = undefined;
    }

    _state() {
      const s = this._st(this._c.entity);
      if (!s) return 'unavailable';
      const raw = String(s.state).toLowerCase();
      if (raw === 'unknown') return 'unavailable';
      return ['off', 'standby', 'idle', 'on', 'playing', 'paused', 'buffering', 'unavailable'].includes(raw) ? raw : 'on';
    }

    // couleur moyenne de la pochette (ambilight) ; reste sur l'accent si l'image n'est pas lisible
    _ambient(url) {
      if (!url) { this._card.style.setProperty('--amb', this._model.accent); return; }
      if (this._ambUrl === url) return;
      this._ambUrl = url;
      try {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const cv = document.createElement('canvas'); cv.width = cv.height = 8;
            const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, 8, 8);
            const d = cx.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0, n = 0;
            for (let i = 0; i < d.length; i += 4) { const w = Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) + 20; r += d[i] * w; g += d[i + 1] * w; b += d[i + 2] * w; n += w; }
            if (n && this._ambUrl === url) this._card.style.setProperty('--amb', `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`);
          } catch (e) { this._card.style.setProperty('--amb', this._model.accent); }
        };
        img.onerror = () => this._card.style.setProperty('--amb', this._model.accent);
        img.src = url;
      } catch (e) { this._card.style.setProperty('--amb', this._model.accent); }
    }

    // position de lecture estimée : media_position + temps écoulé depuis media_position_updated_at
    _progress() {
      if (!this._built || !this._hass) return;
      const s = this._st(this._c.entity); if (!s) return;
      const a = s.attributes || {}, dur = Number(a.media_duration), pos = Number(a.media_position);
      if (!(dur > 0) || !isFinite(pos)) { this._card.classList.remove('hasdur'); return; }
      let p = pos;
      if (String(s.state) === 'playing' && a.media_position_updated_at) p += (Date.now() - Date.parse(a.media_position_updated_at)) / 1000;
      this._card.classList.add('hasdur');
      this._card.style.setProperty('--prog', Math.max(0, Math.min(1, p / dur)).toFixed(4));
    }

    _osd(vol, muted) {
      const r = this._root, el = r.getElementById('tvosd');
      r.getElementById('tvosdt').textContent = muted ? this._t('muted').toUpperCase() : `VOL ${Math.round(vol * 100)}`;
      r.getElementById('tvosdf').style.transform = `scaleX(${muted ? 0 : vol})`;
      el.classList.add('show'); clearTimeout(this._osdT);
      this._osdT = setTimeout(() => el.classList.remove('show'), 1800);
    }

    _cmd(k) {
      const hass = this._hass, c = this._c, id = c.entity, s = this._st(id); if (!s) return;
      const a = s.attributes || {}, sf = Number(a.supported_features), step = Number(c.volume_step) || 0.05;
      const call = (svc, data = {}) => hass.callService('media_player', svc, { entity_id: id, ...data });
      const off = ['off', 'standby', 'unavailable'].includes(String(s.state).toLowerCase());
      if (k === 'power') {
        // Android TV Remote : l'allumage passe mieux par l'entité remote
        if (c.entity_remote && this._st(c.entity_remote)) hass.callService('remote', off ? 'turn_on' : 'turn_off', { entity_id: c.entity_remote });
        else call(off ? 'turn_on' : 'turn_off');
      } else if (k === 'play_pause') call('media_play_pause');
      else if (k === 'prev') call('media_previous_track');
      else if (k === 'next') call('media_next_track');
      else if (k === 'source') {
        // source suivante dans source_list (HDMI 1 → HDMI 2 → …) ; select_source doit être géré par l'intégration
        const list = Array.isArray(a.source_list) ? a.source_list : [];
        if (list.length) call('select_source', { source: list[(list.indexOf(a.source) + 1) % list.length] });
      }
      else if (k === 'mute') call('volume_mute', { is_volume_muted: !a.is_volume_muted });
      else if (k === 'home' && c.entity_remote) hass.callService('remote', 'send_command', { entity_id: c.entity_remote, command: 'HOME' });
      else if (k === 'vol_up' || k === 'vol_down') {
        const v = Number(a.volume_level), up = k === 'vol_up';
        if (a.volume_level != null && isFinite(v) && (!isFinite(sf) || (sf & 4))) call('volume_set', { volume_level: Math.round(Math.max(0, Math.min(1, v + (up ? step : -step))) * 100) / 100 });
        else call(up ? 'volume_up' : 'volume_down');
      }
    }

    _render() {
      if (!this._built || this._model !== MODELS[modelKey(this._c.model)]) this._build();
      const c = this._c, r = this._root, card = this._card, s = this._st(c.entity), a = (s && s.attributes) || {};
      const st = this._state(), m = this._model;
      const live = !['off', 'standby', 'unavailable'].includes(st);
      const pic = c.show_artwork !== false && live ? a.entity_picture_local || a.entity_picture || '' : '';
      const art = r.getElementById('tvart');
      if (pic !== this._lastPic) { this._lastPic = pic; card.classList.remove('artok'); if (pic) art.setAttribute('href', pic); else art.removeAttribute('href'); this._ambient(pic); }
      card.className = `${st}${pic ? ' hasart' : ' noart'}${card.classList.contains('artok') ? ' artok' : ''}${card.classList.contains('hasdur') ? ' hasdur' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      if (!pic) card.style.setProperty('--amb', m.accent);

      const app = a.app_name || a.source || '';
      const title = a.media_title || (live ? app || m.label : '');
      const sub = [a.media_series_title, a.media_artist, a.media_album_name].filter(Boolean).join(' · ');
      const cut = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);
      r.getElementById('tvapp').textContent = c.show_app === false ? '' : cut(String(app).toUpperCase(), 30);
      r.getElementById('tvmt').textContent = cut(String(title), 30);
      r.getElementById('tvma').textContent = cut(String(sub), 42);
      this._progress();

      // affichage du volume à l'écran quand il change (pas au premier rendu)
      const vol = Number(a.volume_level), muted = !!a.is_volume_muted, key = `${vol}|${muted}`;
      if (this._lastVol !== undefined && this._lastVol !== key && live && isFinite(vol)) this._osd(vol, muted);
      this._lastVol = key;

      r.getElementById('tvtitle').textContent = c.name || m.label;
      const badge = r.getElementById('tvbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      // télécommande (selon les fonctions annoncées : PAUSE 1, VOLUME_SET 4, MUTE 8, PREVIOUS 16, NEXT 32, TURN_ON 128, TURN_OFF 256, VOLUME_STEP 1024, PLAY 16384)
      const ctr = r.getElementById('tvctrls');
      ctr.classList.toggle('hide', c.show_controls === false || !s);
      const sf = Number(a.supported_features), has = (bit) => !isFinite(sf) || (sf & bit) !== 0;
      const play = st === 'playing', volOk = has(4) || has(1024);
      const btns = [
        ['power', 'mdi:power', 'power', live, has(128) || has(256) || !!c.entity_remote],
        ['home', 'mdi:home', 'home', null, !!c.entity_remote],
        ['prev', 'mdi:skip-previous', 'previous', null, has(16)],
        ['play_pause', play ? 'mdi:pause' : 'mdi:play', play ? 'pause' : 'play', null, has(1) || has(16384), 'main'],
        ['next', 'mdi:skip-next', 'next', null, has(32)],
        ['source', 'mdi:import', 'source', null, Array.isArray(a.source_list) && a.source_list.length > 1 && has(2048)],
        ['vol_down', 'mdi:volume-minus', 'vol_down', null, volOk],
        ['mute', muted ? 'mdi:volume-off' : 'mdi:volume-high', 'mute', muted, has(8)],
        ['vol_up', 'mdi:volume-plus', 'vol_up', null, volOk],
      ].filter((b) => b[4] && c[`show_btn_${b[0]}`] !== false); // case décochée dans l'éditeur : bouton masqué
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on, , cls]) => {
          const dis = st === 'unavailable' || (!live && k !== 'power');
          return `<button class="${cls || ''}${on ? ' on' : ''}" data-k="${k}" title="${esc(this._t(lbl))}" aria-label="${esc(this._t(lbl))}"${dis ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon></button>`;
        }).join('');
      }

      const pw = this._num(c.entity_power), pu = (this._st(c.entity_power)?.attributes || {}).unit_of_measurement || 'W';
      const V = {
        app: [!!s && !!app && c.show_app !== false, cut(String(app), 22), ''],
        volume: [!!s && a.volume_level != null && c.show_volume !== false, muted ? '🔇' : this._fmt(vol * 100, 0), muted ? '' : '%'],
        power: [!!c.entity_power && c.show_power !== false, this._fmt(pw, pw < 10 ? 1 : 0), pu],
      };
      Object.entries(V).forEach(([k, [show, val, unit]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit;
        el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  customElements.define(TAG, ApplianceTvBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceTvBoxCardEditor extends HTMLElement {
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
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: m.label })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', 'media_player'), ent('entity_remote', 'remote'), ent('entity_power', 'sensor'),
        { name: 'volume_step', default: 0.05, selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: 'box' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_artwork'), bool('show_app'), bool('show_volume'), bool('show_power'), bool('animations')] },
        // boutons de la télécommande, un par un
        { type: 'grid', name: '', schema: BTN_KEYS.map((k) => bool(`show_btn_${k}`)) },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'tv_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceTvBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Box TV en photo (Freebox Player Pop, Xiaomi TV Box S, NVIDIA Shield TV Pro) : écran flottant avec pochette et ambilight, égaliseur, LED de la box, télécommande (media_player).', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
