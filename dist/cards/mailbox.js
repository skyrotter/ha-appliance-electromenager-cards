/* Carte « Boîte aux lettres » — custom:appliance-mailbox-card
 * Boîte aux lettres vue de trois quarts. Courrier : une lettre tombe par la fente et le volet claque ;
 * colis : un carton rebondit au pied de la boîte ; porte ouverte : la porte pivote sur sa charnière.
 * Générique : fonctionne avec un capteur par type (entity_mail / entity_parcel), ou un seul capteur dont l'état
 * est un texte (« lettre », « colis », « vide »…) ou un nombre (lettres reçues). Tous les autres capteurs sont optionnels :
 * porte avant (entity_door) et porte arrière (entity_door_back, boîtes à double porte), compteur (entity_count), batterie, et une entité pour marquer le courrier comme relevé (entity_reset).
 * box_model: boks → photo détourée de la boîte à colis BOKS + calques animés (porte qui pivote, lettre dans la fente,
 * pictogramme colis qui s'allume, clavier qui passe au vert porte ouverte, voyant pile faible). Options propres :
 * entity_open (bouton « Ouvrir la porte »), entity_last_open (une ou plusieurs dates d'ouverture : la plus récente),
 * entity_battery_low (binary_sensor pile faible). Sans capteur de courrier, la BOKS s'affiche « Fermée » / « Porte ouverte ».
 */
(() => {
  const TAG = 'appliance-mailbox-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Mailbox","empty":"Empty","mail":"Mail","parcel":"Parcel","both":"Mail + parcel","open":"Door open","door_front":"Front","door_back":"Rear","battery_back":"Rear battery","presence":"Presence","detected":"Detected","none":"None","open_front":"Front door open","open_back":"Rear door open","open_both":"Doors open","closed":"Closed","open_short":"Open","unavailable":"Unavailable","collect":"Mark as collected","last":"Delivered","count":"Letters","battery":"Battery","color_anthracite":"Anthracite","color_black":"Black","color_grey":"Grey","color_white":"White","color_green":"Green","color_red":"Red","color_blue":"Blue","color_yellow":"Yellow","color_brown":"Brown","open_door":"Open the door","last_open":"Last opened","model_standard":"Standard mailbox","model_boks":"BOKS (parcel box)"},"cs":{"name":"Poštovní schránka","empty":"Prázdná","mail":"Pošta","parcel":"Balík","both":"Pošta + balík","open":"Otevřená dvířka","door_front":"Přední","door_back":"Zadní","open_front":"Otevřená přední dvířka","open_back":"Otevřená zadní dvířka","open_both":"Otevřená dvířka","closed":"Zavřeno","open_short":"Otevřeno","unavailable":"Nedostupné","collect":"Označit jako vybráno","last":"Doručeno","count":"Dopisy","battery":"Baterie","color_anthracite":"Antracitová","color_black":"Černá","color_grey":"Šedá","color_white":"Bílá","color_green":"Zelená","color_red":"Červená","color_blue":"Modrá","color_yellow":"Žlutá","color_brown":"Hnědá","open_door":"Otevřít dvířka","last_open":"Naposledy otevřeno","model_standard":"Standardní schránka","model_boks":"BOKS (box na balíky)"},"da":{"name":"Postkasse","empty":"Tom","mail":"Post","parcel":"Pakke","both":"Post + pakke","open":"Låge åben","door_front":"Forside","door_back":"Bagside","open_front":"Forreste låge åben","open_back":"Bagerste låge åben","open_both":"Låger åbne","closed":"Lukket","open_short":"Åben","unavailable":"Utilgængelig","collect":"Marker som tømt","last":"Leveret","count":"Breve","battery":"Batteri","color_anthracite":"Antracit","color_black":"Sort","color_grey":"Grå","color_white":"Hvid","color_green":"Grøn","color_red":"Rød","color_blue":"Blå","color_yellow":"Gul","color_brown":"Brun","open_door":"Åbn lågen","last_open":"Senest åbnet","model_standard":"Almindelig postkasse","model_boks":"BOKS (pakkeboks)"},"de":{"name":"Briefkasten","empty":"Leer","mail":"Post","parcel":"Paket","both":"Post + Paket","open":"Tür offen","door_front":"Vorne","door_back":"Hinten","open_front":"Vordere Tür offen","open_back":"Hintere Tür offen","open_both":"Türen offen","closed":"Geschlossen","open_short":"Offen","unavailable":"Nicht verfügbar","collect":"Als geleert markieren","last":"Zugestellt","count":"Briefe","battery":"Batterie","color_anthracite":"Anthrazit","color_black":"Schwarz","color_grey":"Grau","color_white":"Weiß","color_green":"Grün","color_red":"Rot","color_blue":"Blau","color_yellow":"Gelb","color_brown":"Braun","open_door":"Tür öffnen","last_open":"Zuletzt geöffnet","model_standard":"Normaler Briefkasten","model_boks":"BOKS (Paketbox)"},"es":{"name":"Buzón","empty":"Vacío","mail":"Correo","parcel":"Paquete","both":"Correo + paquete","open":"Puerta abierta","door_front":"Delantera","door_back":"Trasera","battery_back":"Batería trasera","presence":"Presencia","detected":"Detectada","none":"Ninguna","open_front":"Puerta delantera abierta","open_back":"Puerta trasera abierta","open_both":"Puertas abiertas","closed":"Cerrado","open_short":"Abierto","unavailable":"No disponible","collect":"Marcar como recogido","last":"Entregado","count":"Cartas","battery":"Batería","color_anthracite":"Antracita","color_black":"Negro","color_grey":"Gris","color_white":"Blanco","color_green":"Verde","color_red":"Rojo","color_blue":"Azul","color_yellow":"Amarillo","color_brown":"Marrón","open_door":"Abrir la puerta","last_open":"Última apertura","model_standard":"Buzón estándar","model_boks":"BOKS (buzón de paquetes)"},"fr":{"name":"Boîte aux lettres","empty":"Vide","mail":"Courrier","parcel":"Colis","both":"Courrier + colis","open":"Porte ouverte","door_front":"Avant","door_back":"Arrière","battery_back":"Batterie arrière","presence":"Présence","detected":"Détectée","none":"Aucune","open_front":"Porte avant ouverte","open_back":"Porte arrière ouverte","open_both":"Portes ouvertes","closed":"Fermée","open_short":"Ouverte","unavailable":"Indisponible","collect":"Courrier relevé","last":"Dépôt","count":"Lettres","battery":"Batterie","color_anthracite":"Anthracite","color_black":"Noir","color_grey":"Gris","color_white":"Blanc","color_green":"Vert","color_red":"Rouge","color_blue":"Bleu","color_yellow":"Jaune","color_brown":"Marron","open_door":"Ouvrir la porte","last_open":"Dernière ouverture","model_standard":"Boîte aux lettres classique","model_boks":"BOKS (boîte à colis)"},"hu":{"name":"Postaláda","empty":"Üres","mail":"Levél","parcel":"Csomag","both":"Levél + csomag","open":"Ajtó nyitva","door_front":"Elöl","door_back":"Hátul","open_front":"Első ajtó nyitva","open_back":"Hátsó ajtó nyitva","open_both":"Ajtók nyitva","closed":"Zárva","open_short":"Nyitva","unavailable":"Nem elérhető","collect":"Átvettként jelöl","last":"Kézbesítve","count":"Levelek","battery":"Akkumulátor","color_anthracite":"Antracit","color_black":"Fekete","color_grey":"Szürke","color_white":"Fehér","color_green":"Zöld","color_red":"Piros","color_blue":"Kék","color_yellow":"Sárga","color_brown":"Barna","open_door":"Ajtó nyitása","last_open":"Utoljára nyitva","model_standard":"Standard postaláda","model_boks":"BOKS (csomagbox)"},"it":{"name":"Cassetta postale","empty":"Vuota","mail":"Posta","parcel":"Pacco","both":"Posta + pacco","open":"Sportello aperto","door_front":"Anteriore","door_back":"Posteriore","open_front":"Sportello anteriore aperto","open_back":"Sportello posteriore aperto","open_both":"Sportelli aperti","closed":"Chiuso","open_short":"Aperta","unavailable":"Non disponibile","collect":"Segna come ritirata","last":"Consegna","count":"Lettere","battery":"Batteria","color_anthracite":"Antracite","color_black":"Nero","color_grey":"Grigio","color_white":"Bianco","color_green":"Verde","color_red":"Rosso","color_blue":"Blu","color_yellow":"Giallo","color_brown":"Marrone","open_door":"Apri la porta","last_open":"Ultima apertura","model_standard":"Cassetta classica","model_boks":"BOKS (cassetta pacchi)"},"nb":{"name":"Postkasse","empty":"Tom","mail":"Post","parcel":"Pakke","both":"Post + pakke","open":"Luken er åpen","door_front":"Foran","door_back":"Bak","open_front":"Fremre luke åpen","open_back":"Bakre luke åpen","open_both":"Lukene er åpne","closed":"Lukket","open_short":"Åpen","unavailable":"Utilgjengelig","collect":"Merk som tømt","last":"Levert","count":"Brev","battery":"Batteri","color_anthracite":"Antrasitt","color_black":"Svart","color_grey":"Grå","color_white":"Hvit","color_green":"Grønn","color_red":"Rød","color_blue":"Blå","color_yellow":"Gul","color_brown":"Brun","open_door":"Åpne døren","last_open":"Sist åpnet","model_standard":"Vanlig postkasse","model_boks":"BOKS (pakkeboks)"},"nl":{"name":"Brievenbus","empty":"Leeg","mail":"Post","parcel":"Pakket","both":"Post + pakket","open":"Klep open","door_front":"Voor","door_back":"Achter","open_front":"Voorklep open","open_back":"Achterklep open","open_both":"Kleppen open","closed":"Gesloten","open_short":"Open","unavailable":"Niet beschikbaar","collect":"Markeren als geleegd","last":"Bezorgd","count":"Brieven","battery":"Batterij","color_anthracite":"Antraciet","color_black":"Zwart","color_grey":"Grijs","color_white":"Wit","color_green":"Groen","color_red":"Rood","color_blue":"Blauw","color_yellow":"Geel","color_brown":"Bruin","open_door":"Deur openen","last_open":"Laatst geopend","model_standard":"Gewone brievenbus","model_boks":"BOKS (pakketbox)"},"pl":{"name":"Skrzynka pocztowa","empty":"Pusty","mail":"Poczta","parcel":"Paczka","both":"Poczta + paczka","open":"Drzwi otwarte","door_front":"Przód","door_back":"Tył","open_front":"Przednie drzwiczki otwarte","open_back":"Tylne drzwiczki otwarte","open_both":"Drzwiczki otwarte","closed":"Zamknięta","open_short":"Otwarta","unavailable":"Niedostępny","collect":"Oznacz jako odebrane","last":"Dostarczono","count":"Listy","battery":"Bateria","color_anthracite":"Antracyt","color_black":"Czarny","color_grey":"Szary","color_white":"Biały","color_green":"Zielony","color_red":"Czerwony","color_blue":"Niebieski","color_yellow":"Żółty","color_brown":"Brązowy","open_door":"Otwórz drzwi","last_open":"Ostatnio otwarto","model_standard":"Standardowa skrzynka pocztowa","model_boks":"BOKS (skrzynka na paczki)"},"pt-BR":{"name":"Caixa de correio","empty":"Vazia","mail":"Correio","parcel":"Encomenda","both":"Correio + encomenda","open":"Porta aberta","door_front":"Frente","door_back":"Traseira","battery_back":"Bateria traseira","presence":"Presença","detected":"Detectada","none":"Nenhuma","open_front":"Porta frontal aberta","open_back":"Porta traseira aberta","open_both":"Portas abertas","closed":"Fechada","open_short":"Aberta","unavailable":"Indisponível","collect":"Marcar como retirado","last":"Entregue","count":"Cartas","battery":"Bateria","color_anthracite":"Antracito","color_black":"Preto","color_grey":"Cinza","color_white":"Branco","color_green":"Verde","color_red":"Vermelho","color_blue":"Azul","color_yellow":"Amarelo","color_brown":"Marrom","open_door":"Abrir a porta","last_open":"Última abertura","model_standard":"Caixa de correio padrão","model_boks":"BOKS (caixa de encomendas)"},"pt-PT":{"name":"Caixa de correio","empty":"Vazia","mail":"Correio","parcel":"Encomenda","both":"Correio + encomenda","open":"Porta aberta","door_front":"Frente","door_back":"Traseira","battery_back":"Bateria traseira","presence":"Presença","detected":"Detetada","none":"Nenhuma","open_front":"Porta frontal aberta","open_back":"Porta traseira aberta","open_both":"Portas abertas","closed":"Fechada","open_short":"Aberta","unavailable":"Indisponível","collect":"Marcar como recolhido","last":"Entregue","count":"Cartas","battery":"Bateria","color_anthracite":"Antracite","color_black":"Preto","color_grey":"Cinzento","color_white":"Branco","color_green":"Verde","color_red":"Vermelho","color_blue":"Azul","color_yellow":"Amarelo","color_brown":"Castanho","open_door":"Abrir a porta","last_open":"Última abertura","model_standard":"Caixa de correio padrão","model_boks":"BOKS (caixa de encomendas)"},"ro":{"name":"Cutie poștală","empty":"Goală","mail":"Corespondență","parcel":"Colet","both":"Corespondență + colet","open":"Ușă deschisă","door_front":"Față","door_back":"Spate","open_front":"Ușa din față deschisă","open_back":"Ușa din spate deschisă","open_both":"Uși deschise","closed":"Închis","open_short":"Deschisă","unavailable":"Indisponibil","collect":"Marchează ca ridicată","last":"Livrat","count":"Scrisori","battery":"Baterie","color_anthracite":"Antracit","color_black":"Negru","color_grey":"Gri","color_white":"Alb","color_green":"Verde","color_red":"Roșu","color_blue":"Albastru","color_yellow":"Galben","color_brown":"Maro","open_door":"Deschide ușa","last_open":"Ultima deschidere","model_standard":"Cutie poștală clasică","model_boks":"BOKS (cutie pentru colete)"},"ru":{"name":"Почтовый ящик","empty":"Пусто","mail":"Письма","parcel":"Посылка","both":"Письма + посылка","open":"Дверца открыта","door_front":"Передняя","door_back":"Задняя","battery_back":"Батарея задней дверцы","presence":"Присутствие","detected":"Обнаружено","none":"Нет","open_front":"Передняя дверца открыта","open_back":"Задняя дверца открыта","open_both":"Дверцы открыты","closed":"Закрыта","open_short":"Открыта","unavailable":"Недоступно","collect":"Отметить как забранную","last":"Доставлено","count":"Письма","battery":"Батарея","color_anthracite":"Антрацит","color_black":"Чёрный","color_grey":"Серый","color_white":"Белый","color_green":"Зелёный","color_red":"Красный","color_blue":"Синий","color_yellow":"Жёлтый","color_brown":"Коричневый","open_door":"Открыть дверцу","last_open":"Последнее открытие","model_standard":"Обычный почтовый ящик","model_boks":"BOKS (ящик для посылок)"},"sr":{"name":"Поштанско сандуче","empty":"Празно","mail":"Пошта","parcel":"Пакет","both":"Пошта + пакет","open":"Врата отворена","door_front":"Предња","door_back":"Задња","open_front":"Предња врата отворена","open_back":"Задња врата отворена","open_both":"Врата отворена","closed":"Затворено","open_short":"Отворено","unavailable":"Недоступно","collect":"Означи као преузето","last":"Достављено","count":"Писма","battery":"Батерија","color_anthracite":"Антрацит","color_black":"Црна","color_grey":"Сива","color_white":"Бела","color_green":"Зелена","color_red":"Црвена","color_blue":"Плава","color_yellow":"Жута","color_brown":"Браон","open_door":"Отвори врата","last_open":"Последње отварање","model_standard":"Обично поштанско сандуче","model_boks":"BOKS (кутија за пакете)"},"sr-Latn":{"name":"Poštansko sanduče","empty":"Prazno","mail":"Pošta","parcel":"Paket","both":"Pošta + paket","open":"Vrata otvorena","door_front":"Prednja","door_back":"Zadnja","open_front":"Prednja vrata otvorena","open_back":"Zadnja vrata otvorena","open_both":"Vrata otvorena","closed":"Zatvoreno","open_short":"Otvoreno","unavailable":"Nedostupno","collect":"Označi kao preuzeto","last":"Dostavljeno","count":"Pisma","battery":"Baterija","color_anthracite":"Antracit","color_black":"Crna","color_grey":"Siva","color_white":"Bela","color_green":"Zelena","color_red":"Crvena","color_blue":"Plava","color_yellow":"Žuta","color_brown":"Braon","open_door":"Otvori vrata","last_open":"Poslednje otvaranje","model_standard":"Obično poštansko sanduče","model_boks":"BOKS (kutija za pakete)"},"uk":{"name":"Поштова скринька","empty":"Порожня","mail":"Лист","parcel":"Посилка","both":"Лист + посилка","open":"Дверцята відчинені","door_front":"Передні","door_back":"Задні","battery_back":"Батарея задніх дверцят","presence":"Присутність","detected":"Виявлено","none":"Немає","open_front":"Передні дверцята відчинені","open_back":"Задні дверцята відчинені","open_both":"Дверцята відчинені","closed":"Зачинено","open_short":"Відчинено","unavailable":"Недоступно","collect":"Позначити як забране","last":"Доставлено","count":"Листи","battery":"Батарея","color_anthracite":"Антрацит","color_black":"Чорний","color_grey":"Сірий","color_white":"Білий","color_green":"Зелений","color_red":"Червоний","color_blue":"Синій","color_yellow":"Жовтий","color_brown":"Коричневий","open_door":"Відчинити дверцята","last_open":"Востаннє відчинено","model_standard":"Стандартна поштова скринька","model_boks":"BOKS (скринька для посилок)"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // états texte reconnus par défaut (toutes langues des traductions), complétés par mail_states / parcel_states
  const MAIL_WORDS = ['mail', 'letter', 'letters', 'post', 'lettre', 'lettres', 'courrier', 'brief', 'briefe', 'posta', 'lettera', 'lettere', 'brev', 'scrisoare', 'scrisori', 'письмо', 'почта', 'pismo', 'писмо', 'pošta', 'пошта'];
  const PARCEL_WORDS = ['parcel', 'package', 'packet', 'colis', 'paket', 'pacco', 'pakke', 'pakket', 'pakketje', 'colet', 'посылка', 'посылки', 'пакет'];
  const BOTH_WORDS = ['both', 'mail_and_parcel', 'les deux', 'courrier et colis', 'lettre et colis'];
  const EMPTY_WORDS = ['off', 'false', 'empty', 'no', 'none', 'closed', 'clear', 'vide', 'aucun', 'leer', 'vuoto', 'tom', 'leeg', 'gol', 'пусто', 'prazno', 'празно', '0'];
  const ON_RE = /^(on|true|yes|open|detected|full|plein|pleine|1)$/i;

  // couleurs de la boîte : [ombre, face, clair]
  const COLORS = {
    anthracite: ['#1d2127', '#30353d', '#474e59'], black: ['#0c0d10', '#1c1e22', '#2e3137'],
    grey: ['#5b6169', '#8a9099', '#aeb4bc'], white: ['#9aa1ab', '#d9dde3', '#f4f6f8'],
    green: ['#1f3a2a', '#2f5a3f', '#46805b'], red: ['#4a1515', '#7a2222', '#a63434'],
    blue: ['#16294a', '#24427a', '#3a5ea3'], yellow: ['#8a6a0c', '#d6a516', '#f1c63c'], brown: ['#3b2618', '#5e3d26', '#7f5638'],
  };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--mb-mail:var(--appliance-cold-color,#2b9af9);--mb-parcel:var(--appliance-warm-color,#ff9800);
  --mb-alert:var(--appliance-alert-color,#db4437);--mb-ok:var(--appliance-ok-color,#43a047)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.empty .badge{background:color-mix(in srgb,var(--mb-ok) 20%,transparent);color:var(--mb-ok)}
.mail .badge{background:color-mix(in srgb,var(--mb-mail) 22%,transparent);color:var(--mb-mail)}
.parcel .badge,.both .badge{background:color-mix(in srgb,var(--mb-parcel) 22%,transparent);color:var(--mb-parcel)}
.door_open .badge{background:color-mix(in srgb,var(--mb-alert) 22%,transparent);color:var(--mb-alert)}
.scene{position:relative;width:100%;max-width:calc(200px * var(--illus-scale,1));margin:2px auto 0;cursor:pointer}
svg{display:block;width:100%;height:auto;overflow:visible}
.count{position:absolute;top:0;right:12%;min-width:24px;height:24px;padding:0 6px;box-sizing:border-box;border-radius:12px;background:var(--mb-mail);color:#fff;
  font:700 12px/24px var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-align:center;box-shadow:0 2px 8px color-mix(in srgb,var(--mb-mail) 60%,transparent);
  transform:scale(0);transition:transform .4s cubic-bezier(.3,1.6,.5,1)}
.count.on{transform:scale(1)}
.ctl{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:disabled{opacity:.5;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tiles.hide,.tile.hide{display:none}.tile.bad .v{color:var(--mb-alert)}
/* ---- illustration ---- */
.mb-c0{fill:var(--mb-c0)}.mb-c1{fill:var(--mb-c1)}.mb-c2{fill:var(--mb-c2)}
.mb-door{transform-box:view-box;transform-origin:18px 105px;transition:transform .7s cubic-bezier(.3,1.3,.5,1)}
.mb-flap{transform-box:view-box;transform-origin:90px 46px}
.mb-letter,.mb-pile,.mb-parcel{opacity:0;transition:opacity .3s}
/* courrier : la lettre tombe par la fente, le volet claque, la pile se voit porte ouverte */
.mail .mb-letter,.both .mb-letter{animation:mbdrop 3.2s ease-in infinite}
.mail .mb-flap,.both .mb-flap{animation:mbflap 3.2s ease-in-out infinite}
.mail .mb-pile,.both .mb-pile{opacity:1}
/* colis : carton au pied de la boîte, petit rebond */
.parcel .mb-parcel,.both .mb-parcel{opacity:1}
.parcel .mb-pk,.both .mb-pk{transform-box:fill-box;transform-origin:50% 100%;animation:mbland 2.6s cubic-bezier(.3,1.4,.5,1) infinite}
/* porte ouverte (s'ajoute aux autres états) */
.opened .mb-door{transform:perspective(500px) rotateY(-72deg)}
.opened .mb-letter{animation:none;opacity:0}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .mb-letter,.noanim .mb-flap,.noanim .mb-pk{animation:none}
/* ---- BOKS (photo) : coordonnées en pixels de la photo détourée (595 × 863) ---- */
.bk-door{transform-box:view-box;transform-origin:25px 430px;transition:transform .7s cubic-bezier(.3,1.3,.5,1)}
.opened .bk-door{transform:perspective(1500px) rotateY(-70deg)}
.bk-letter,.bk-glow,.bk-keys,.bk-bat,.bk-in{opacity:0;transition:opacity .3s}
.mail .bk-letter,.both .bk-letter{animation:bkdrop 3.2s ease-in infinite}
.parcel .bk-glow,.both .bk-glow{animation:bkglow 2s ease-in-out infinite}
.opened .bk-keys{opacity:1;animation:bkkeys 1.2s ease-in-out infinite alternate}
.opened .bk-letter{animation:none;opacity:0}
.opened.parcel .bk-in,.opened.both .bk-in{opacity:1}
.batlow .bk-bat{animation:bkblink 1.2s ease-in-out infinite}
.noanim .bk-letter,.noanim .bk-glow,.noanim .bk-keys,.noanim .bk-bat{animation:none}
.noanim.parcel .bk-glow,.noanim.both .bk-glow,.noanim.batlow .bk-bat{opacity:1}
@keyframes bkdrop{0%{transform:translateY(-150px);opacity:0}15%{transform:translateY(-110px);opacity:1}55%{transform:translateY(40px);opacity:1}60%,100%{transform:translateY(40px);opacity:0}}
@keyframes bkglow{0%,100%{opacity:.25}50%{opacity:.9}}
@keyframes bkkeys{from{opacity:.45}to{opacity:.95}}
@keyframes bkblink{0%,100%{opacity:0}50%{opacity:1}}
@keyframes mbdrop{0%{transform:translateY(-30px);opacity:0}15%{transform:translateY(-14px);opacity:1}45%{transform:translateY(40px);opacity:1}50%,100%{transform:translateY(40px);opacity:0}}
@keyframes mbflap{0%,30%{transform:scaleY(1)}38%{transform:scaleY(-.25)}48%{transform:scaleY(1.08)}56%,100%{transform:scaleY(1)}}
@keyframes mbland{0%,60%,100%{transform:translateY(0) scale(1,1)}70%{transform:translateY(-10px) scale(.97,1.04)}80%{transform:translateY(0) scale(1.05,.94)}88%{transform:scale(1,1)}}
`;

  /* boîte en vue 3/4 : côté, dessus, intérieur, porte (charnière à gauche), lettre, colis — cadre 200 × 190 */
  const SVG = (label) => `<svg viewBox="0 0 200 190" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="mbsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="mbfront" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--mb-c2)"/><stop offset="1" style="stop-color:var(--mb-c1)"/></linearGradient>
    <linearGradient id="mbside" x1="0" x2="1"><stop offset="0" style="stop-color:var(--mb-c1)"/><stop offset="1" style="stop-color:var(--mb-c0)"/></linearGradient></defs>
    <ellipse cx="96" cy="182" rx="80" ry="7" fill="url(#mbsh)"/>
    <path d="M18 34 L52 14 L52 150 L18 176 Z" fill="url(#mbside)"/>
    <path class="mb-c2" d="M18 34 L52 14 L184 14 L160 34 Z" opacity=".9"/>
    <path class="mb-c0" d="M160 34 L184 14 L184 150 L160 176 Z" opacity=".55"/>
    <rect x="22" y="38" width="134" height="134" fill="#0d1018"/>
    <g class="mb-pile"><rect x="104" y="150" width="44" height="6" rx="1" fill="#f2f4f8"/><rect x="100" y="156" width="48" height="6" rx="1" fill="#dfe4ee"/><rect x="106" y="162" width="40" height="6" rx="1" fill="#e9d9b8"/></g>
    <g class="mb-letter"><rect x="64" y="0" width="52" height="34" rx="2" fill="#f5f7fb"/><path d="M64 0 L90 20 L116 0" fill="none" stroke="#c3c9d6" stroke-width="2"/></g>
    <g class="mb-door">
      <rect x="18" y="34" width="142" height="142" rx="3" fill="url(#mbfront)"/>
      <rect x="18" y="34" width="142" height="142" rx="3" fill="none" stroke="#fff" stroke-opacity=".08"/>
      <path class="mb-flap mb-c2" d="M32 46 H148 V70 Q120 64 90 72 Q60 64 32 70 Z" stroke="#000" stroke-opacity=".35"/>
      <circle cx="34" cy="90" r="5" fill="#b9bec8"/><rect x="33" y="87" width="2" height="6" fill="#444"/>
      <rect x="112" y="82" width="34" height="14" rx="2" fill="#e8ebf0"/><rect x="117" y="87" width="24" height="3" rx="1" fill="#99a"/>
    </g>
    <g class="mb-parcel"><g class="mb-pk">
      <path d="M118 132 L132 122 L192 122 L178 132 Z" fill="#dcae74"/>
      <path d="M178 132 L192 122 L192 170 L178 180 Z" fill="#a8763f"/>
      <rect x="118" y="132" width="60" height="48" rx="2" fill="#c9965b"/>
      <rect x="143" y="132" width="10" height="48" fill="#e3c08f"/><path d="M143 132 L157 122 L167 122 L153 132 Z" fill="#efd3a8"/>
      <rect x="124" y="160" width="16" height="10" rx="1" fill="#f4f6f8" opacity=".85"/>
    </g></g>
  </svg>`;

  /* BOKS : photo détourée (issue #206) ; la porte est la même photo découpée par bk-clip, qui pivote sur sa charnière */
  const BOKS_IMG = window.__acImg("mailbox",0);
  const BOKS_DOOR = 'M25 38 L300 35 L300 255 C300 300 350 300 350 350 L350 832 L28 822 Z';
  const SVG_BOKS = (label) => `<svg viewBox="-10 -150 615 1013" role="img" aria-label="${esc(label)}"><defs>
    <clipPath id="bkclip"><path d="${BOKS_DOOR}"/></clipPath>
    <clipPath id="bkslot"><rect x="0" y="-150" width="595" height="238"/></clipPath>
    <radialGradient id="bkglowg"><stop offset="0" stop-color="#ff9800" stop-opacity=".9"/><stop offset="1" stop-color="#ff9800" stop-opacity="0"/></radialGradient>
    <radialGradient id="bksh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="300" cy="850" rx="300" ry="22" fill="url(#bksh)"/>
    <image href="${BOKS_IMG}" x="0" y="0" width="595" height="863"/>
    <!-- intérieur, visible porte ouverte ; colis posé au fond -->
    <path d="${BOKS_DOOR}" fill="#11151b"/>
    <path d="M25 38 L300 35 L300 255 C300 300 350 300 350 350 L350 832 L320 800 L320 360 C320 320 280 300 280 260 L280 70 L55 72 L55 800 L28 822 Z" fill="#1d232b"/>
    <g class="bk-in"><path d="M140 700 L170 676 L300 676 L270 700 Z" fill="#dcae74"/><path d="M270 700 L300 676 L300 776 L270 800 Z" fill="#a8763f"/>
      <rect x="140" y="700" width="130" height="100" rx="3" fill="#c9965b"/><rect x="198" y="700" width="16" height="100" fill="#e3c08f"/></g>
    <!-- lettre qui tombe dans la fente (masquée sous le bord de la fente) -->
    <g clip-path="url(#bkslot)"><g class="bk-letter"><rect x="95" y="-10" width="140" height="90" rx="4" fill="#f5f7fb" stroke="#c3c9d6" stroke-width="2"/><path d="M95 -10 L165 40 L235 -10" fill="none" stroke="#c3c9d6" stroke-width="4"/></g></g>
    <g class="bk-door">
      <image href="${BOKS_IMG}" x="0" y="0" width="595" height="863" clip-path="url(#bkclip)"/>
      <!-- pictogramme colis qui s'allume quand un colis est annoncé -->
      <circle class="bk-glow" cx="160" cy="200" r="85" fill="url(#bkglowg)" style="mix-blend-mode:screen"/>
    </g>
    <!-- clavier : rétroéclairage vert porte ouverte -->
    <rect class="bk-keys" x="321" y="104" width="37" height="142" rx="4" fill="#4caf50" style="mix-blend-mode:screen"/>
    <!-- voyant pile faible sous le clavier -->
    <g class="bk-bat"><rect x="326" y="255" width="26" height="14" rx="2" fill="#e53935"/><rect x="352" y="259" width="3" height="6" fill="#e53935"/><rect x="329" y="258" width="5" height="8" fill="#fff"/></g>
  </svg>`;

  const TILES = [['last', 'mdi:clock-outline', 'show_since'], ['count', 'mdi:email-multiple-outline', 'show_count'], ['battery', 'mdi:battery', 'show_battery'], ['battery_back', 'mdi:battery', 'show_battery_back'],
    ['door_front', 'mdi:door', 'show_doors'], ['door_back', 'mdi:door', 'show_doors'], ['last_open', 'mdi:door-open', 'show_last_open'], ['presence', 'mdi:motion-sensor', 'show_presence']]; // les 4 premières : 1re ligne, portes et dernière ouverture : 2e ligne

  class ApplianceMailboxCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const box = (i) => /(mail|letter|lettre|courrier|boite|boîte|postbox|letterbox|briefkasten|cassetta|postkasse|brievenbus)/i.test(i);
      return {
        entity_mail: ids.find((i) => box(i) && /^(binary_sensor|input_boolean|sensor)\./.test(i) && !/(colis|parcel|package|paket|door|porte|battery|batterie)/i.test(i)) || '',
        entity_parcel: ids.find((i) => /(colis|parcel|package|paket|pacco)/i.test(i) && /^(binary_sensor|input_boolean|sensor)\./.test(i)) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_since: true, show_count: true, show_battery: true, show_battery_back: true, show_presence: true, show_buttons: true, show_doors: true, show_last_open: true, box_color: 'anthracite', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _list(v) { return (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((s) => String(s).trim().toLowerCase()).filter(Boolean); }

    /* lit l'état d'une entité : { mail, parcel, n } (n = nombre si l'état est numérique)
     * kind = 'mail' ou 'parcel' : ce qu'un simple « on » ou un nombre > 0 veut dire pour cette entité */
    _read(id, kind) {
      const s = this._st(id); if (!this._ok(s)) return null;
      const raw = String(s.state).trim(), v = raw.toLowerCase(), c = this._c;
      const has = (words) => words.some((w) => v === w || (w.length > 3 && v.includes(w)));
      const n = parseFloat(raw.replace(',', '.'));
      if (isFinite(n) && /^-?[\d.,]+$/.test(raw)) return { mail: kind === 'mail' && n > 0, parcel: kind === 'parcel' && n > 0, n };
      if (EMPTY_WORDS.includes(v)) return { mail: false, parcel: false, n: NaN };
      if (has(BOTH_WORDS)) return { mail: true, parcel: true, n: NaN };
      // un texte peut annoncer les deux (« courrier et colis ») : chaque type est cherché séparément
      const isM = has([...MAIL_WORDS, ...this._list(c.mail_states)]), isP = has([...PARCEL_WORDS, ...this._list(c.parcel_states)]);
      if (isM || isP) return { mail: isM, parcel: isP, n: NaN };
      const on = ON_RE.test(v);
      return { mail: on && kind === 'mail', parcel: on && kind === 'parcel', n: NaN };
    }

    _compute() {
      const c = this._c;
      const m = this._read(c.entity_mail, 'mail'), p = this._read(c.entity_parcel, 'parcel');
      const mail = !!(m && m.mail || p && p.mail), parcel = !!(m && m.parcel || p && p.parcel);
      // porte avant (entity_door) et porte arrière (entity_door_back, double porte) : « ouverte » = on / open / unlocked…
      const isOpen = (id) => { const d = this._st(id); return this._ok(d) && (ON_RE.test(String(d.state)) || String(d.state).toLowerCase() === 'unlocked'); };
      const opened = isOpen(c.entity_door), openedBack = isOpen(c.entity_door_back);
      // nombre de lettres : entity_count, sinon l'état numérique de entity_mail
      const cs = this._st(c.entity_count);
      let count = this._ok(cs) ? parseFloat(String(cs.state).replace(',', '.')) : m ? m.n : NaN;
      if (!isFinite(count)) count = NaN;
      const boks = this._boks(), noSensor = boks && !c.entity_mail && !c.entity_parcel;
      // BOKS sans capteur de courrier : la porte suffit à rendre la carte utilisable
      const usable = [c.entity_mail, c.entity_parcel, ...(noSensor ? [c.entity_door] : [])].some((i) => this._ok(this._st(i)));
      const st = !usable ? 'unavailable' : noSensor ? 'shut' : mail && parcel ? 'both' : parcel ? 'parcel' : mail ? 'mail' : 'empty';
      // dernier dépôt : changement le plus récent des entités qui annoncent du courrier
      const full = [[c.entity_mail, m], [c.entity_parcel, p]].filter(([, r]) => r && (r.mail || r.parcel)).map(([i]) => this._st(i));
      const last = full.reduce((a, s) => Math.max(a, Date.parse(s.last_changed) || 0), 0);
      // dernière ouverture : la plus récente des dates (sensor timestamp) de entity_last_open, une ou plusieurs
      const lastOpen = this._ids(c.entity_last_open).map((i) => this._st(i)).filter((x) => this._ok(x)).reduce((a, x) => Math.max(a, Date.parse(x.state) || 0), 0);
      const bl = this._st(c.entity_battery_low), batLow = this._ok(bl) && ON_RE.test(String(bl.state));
      const bbl = this._st(c.entity_battery_back_low), batBackLow = this._ok(bbl) && ON_RE.test(String(bbl.state)); // pile faible du capteur de la porte arrière
      return { st, mail, parcel, opened, openedBack, count, last, lastOpen, batLow, batBackLow };
    }

    _boks() { return String(this._c.box_model || '').toLowerCase() === 'boks'; }
    _ids(v) { return (Array.isArray(v) ? v : v ? String(v).split(',') : []).map((x) => String(x).trim()).filter(Boolean); }
    // « Ouvrir la porte » : l'action dépend du domaine de entity_open
    _openDoor() {
      const id = this._c.entity_open; if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const call = { button: ['button', 'press'], input_button: ['input_button', 'press'], lock: ['lock', 'unlock'], script: ['script', 'turn_on'],
        switch: ['switch', 'turn_on'], input_boolean: ['input_boolean', 'turn_on'], automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'] }[dom] || ['homeassistant', 'turn_on'];
      const run = () => this._hass.callService(call[0], call[1], { entity_id: id });
      // déverrouillage d'une serrure (action sensible) : confirmation « Annuler / OK », sauf confirm_actions: false
      if (dom === 'lock' && this._c.confirm_actions !== false) window.applianceConfirm(this, { action: 'toggle', confirmation: true }, run); else run();
    }

    _doorTxt(id, open) { return !this._ok(this._st(id)) ? '--' : open ? this._t('open_short') : this._t('closed'); }

    _when(t) {
      if (!t) return '--';
      const d = new Date(t), now = new Date(), loc = this._lang();
      const time = window.applianceClock(this._hass, d, loc);
      if (d.toDateString() === now.toDateString()) return time;
      return `${d.toLocaleDateString(loc, { day: 'numeric', month: 'short' })} ${time}`;
    }

    // « relevé » : l'action dépend du domaine de entity_reset
    _collect() {
      const id = this._c.entity_reset; if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const call = { button: ['button', 'press'], input_button: ['input_button', 'press'], counter: ['counter', 'reset'], script: ['script', 'turn_on'],
        automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'], input_boolean: ['input_boolean', 'turn_off'], switch: ['switch', 'turn_off'],
        input_number: ['input_number', 'set_value'], input_select: ['input_select', 'select_first'] }[dom] || ['homeassistant', 'turn_off'];
      this._hass.callService(call[0], call[1], dom === 'input_number' ? { entity_id: id, value: 0 } : { entity_id: id });
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mbtitle"></div><div class="badge" id="mbbadge"></div></div>
        <div class="scene">${(this._boks() ? SVG_BOKS : SVG)(this._c.name || this._t('name'))}<div class="count" id="mbcount"></div></div>
        <div class="ctl" id="mbctl"><button id="mbcollect"><ha-icon icon="mdi:email-check-outline"></ha-icon><span></span></button><button id="mbopen"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button></div>
        ${[TILES.slice(0, 4), TILES.slice(4)].map((row, i) => `<div class="tiles" id="mbrow${i}">${row.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${window.applianceIcon(this._c, k, ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>`).join('')}
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('.scene'), () => this._more(this._c.entity_mail || this._c.entity_parcel || this._c.entity_door));
      root.querySelector('#mbcollect').addEventListener('click', () => this._collect());
      root.querySelector('#mbopen').addEventListener('click', () => this._openDoor());
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ last: c.entity_mail || c.entity_parcel, count: c.entity_count || c.entity_mail, battery: c.entity_battery, battery_back: c.entity_battery_back, door_front: c.entity_door, door_back: c.entity_door_back, last_open: this._ids(c.entity_last_open)[0], presence: c.entity_presence }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, opened, openedBack, count, last, lastOpen, batLow, batBackLow } = this._compute();
      card.className = `${st}${opened ? ' opened' : ''}${opened || openedBack ? ' door_open' : ''}${batLow || batBackLow ? ' batlow' : ''}${c.animations === false ? ' noanim' : ''}`;
      // couleur : nom connu ou #hex (nuances dérivées par color-mix)
      const col = COLORS[String(c.box_color || '').toLowerCase()];
      const hex = !col && /^#[0-9a-f]{3,8}$/i.test(String(c.box_color)) ? c.box_color : null;
      const [c0, c1, c2] = col || (hex ? [`color-mix(in srgb,${hex} 55%,#000)`, hex, `color-mix(in srgb,${hex} 70%,#fff)`] : COLORS.anthracite);
      card.style.setProperty('--mb-c0', c0); card.style.setProperty('--mb-c1', c1); card.style.setProperty('--mb-c2', c2);

      r.getElementById('mbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('mbbadge');
      // avec une 2e porte, le badge dit laquelle est ouverte
      const dbl = !!c.entity_door_back;
      badge.textContent = opened && openedBack ? this._t('open_both') : opened ? this._t(dbl ? 'open_front' : 'open') : openedBack ? this._t('open_back') : this._t(st === 'shut' ? 'closed' : st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const cnt = r.getElementById('mbcount'), showN = !isNaN(count) && count > 0;
      cnt.textContent = showN ? String(Math.round(count)) : '';
      cnt.classList.toggle('on', showN && (st === 'mail' || st === 'both' || !c.entity_mail));

      const ctl = r.getElementById('mbctl'), btn = r.getElementById('mbcollect'), ob = r.getElementById('mbopen');
      ctl.classList.toggle('hide', !(c.entity_reset || c.entity_open) || c.show_buttons === false);
      btn.classList.toggle('hide', !c.entity_reset);
      btn.querySelector('span').textContent = this._t('collect');
      btn.disabled = !this._st(c.entity_reset) || st === 'empty';
      ob.classList.toggle('hide', !c.entity_open);
      ob.querySelector('span').textContent = this._t('open_door');
      // un bouton vaut « unknown » tant qu'il n'a jamais été pressé : seul « unavailable » (ou une entité absente) le grise
      const os = this._st(c.entity_open); ob.disabled = !os || /^unavailable$/i.test(String(os.state));

      const bat = this._st(c.entity_battery), batV = this._ok(bat) ? parseFloat(bat.state) : NaN;
      const bat2 = this._st(c.entity_battery_back), batBackV = this._ok(bat2) ? parseFloat(bat2.state) : NaN;
      const V = {
        last: [c.entity_mail || c.entity_parcel, st === 'empty' || st === 'unavailable' ? '--' : this._when(last), ''],
        count: [c.entity_count, isNaN(count) ? '--' : String(Math.round(count)), ''],
        battery: [c.entity_battery, isNaN(batV) ? '--' : String(Math.round(batV)), '%'],
        battery_back: [c.entity_battery_back, isNaN(batBackV) ? '--' : String(Math.round(batBackV)), '%'],
        // tuiles des portes : seulement si une porte arrière est configurée
        door_front: [dbl && c.entity_door, this._doorTxt(c.entity_door, opened), ''],
        door_back: [c.entity_door_back, this._doorTxt(c.entity_door_back, openedBack), ''],
        last_open: [this._ids(c.entity_last_open)[0], this._when(lastOpen), ''],
        // capteur de présence / mouvement : « Détectée » tant qu'il est actif, « Aucune » sinon
        presence: [c.entity_presence, !this._ok(this._st(c.entity_presence)) ? '--' : ON_RE.test(String(this._st(c.entity_presence).state)) ? this._t('detected') : this._t('none'), ''],
      };
      TILES.forEach(([k, defIcon, opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'battery' && (batV < 20 || batLow) || k === 'battery_back' && (batBackV < 20 || batBackLow) || k === 'door_front' && opened || k === 'door_back' && openedBack);
        el.querySelector('.lbl').textContent = this._l(k);
        // icône perso (option `icons`), sinon celle par défaut ; les portes gardent leur icône selon l'état
        el.querySelector('ha-icon').setAttribute('icon', window.applianceIcon(c, k, defIcon));
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        // icône des portes selon l'état : porte ouverte / porte fermée
        // (sauf si l'utilisateur a choisi son icône dans `icons`)
        if ((k === 'door_front' || k === 'door_back') && window.applianceIcon(c, k, '') === '') {
          const o = k === 'door_front' ? opened : openedBack;
          el.querySelector('ha-icon').setAttribute('icon', !this._ok(this._st(show)) ? 'mdi:door' : o ? 'mdi:door-open' : 'mdi:door-closed');
        }
      });
      // 2 lignes : dépôt / lettres / batterie, puis porte avant / porte arrière / dernière ouverture ; une ligne vide est masquée
      [0, 1].forEach((i) => { const row = r.getElementById('mbrow' + i); row.classList.toggle('hide', !row.querySelector('.tile:not(.hide)')); });
    }
  }
  customElements.define(TAG, ApplianceMailboxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMailboxCardEditor extends HTMLElement {
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
      const ent = (name, domain, extra) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(extra || {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass;
      // entity_last_open : une entité ou une liste ; le sélecteur multiple attend un array
      const lo = this._c && this._c.entity_last_open;
      this._form.data = { ...this._c, entity_last_open: Array.isArray(lo) ? lo : lo ? String(lo).split(',').map((x) => x.trim()).filter(Boolean) : [] };
      const boks = String(this._c && this._c.box_model || '').toLowerCase() === 'boks';
      this._form.schema = [
        { name: 'box_model', selector: { select: { mode: 'dropdown', options: [{ value: 'standard', label: tr.model_standard || 'Standard' }, { value: 'boks', label: tr.model_boks || 'BOKS' }] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'icons', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_mail', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number', 'input_select', 'input_text', 'event']),
        ent('entity_parcel', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number']),
        ent('entity_door', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_door_back', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_count', ['sensor', 'counter', 'input_number']),
        ent('entity_reset', ['button', 'input_button', 'input_boolean', 'switch', 'counter', 'script', 'automation', 'scene', 'input_number']),
        ent('entity_battery', 'sensor'),
        ent('entity_battery_low', ['binary_sensor', 'input_boolean']),
        ent('entity_presence', ['binary_sensor', 'input_boolean']),
        ent('entity_battery_back', 'sensor'),
        ent('entity_battery_back_low', ['binary_sensor', 'input_boolean']),
        ent('entity_open', ['button', 'input_button', 'lock', 'script', 'switch', 'input_boolean']),
        ent('entity_last_open', 'sensor', { multiple: true }),
        { type: 'grid', name: '', schema: [{ name: 'mail_states', selector: { text: {} } }, { name: 'parcel_states', selector: { text: {} } }] },
        ...(boks ? [] : [{ name: 'box_color', selector: { select: { mode: 'dropdown', custom_value: true, options: Object.keys(COLORS).map((value) => ({ value, label: tr['color_' + value] || value })) } } }]),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_count'), bool('show_battery'), bool('show_battery_back'), bool('show_presence'), bool('show_buttons'), bool('show_doors'), bool('show_last_open'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMailboxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Boîte aux lettres animée : courrier, colis, porte ouverte, compteur, dernier dépôt et bouton « relevé ».', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/mailbox.md',
  });
})();
