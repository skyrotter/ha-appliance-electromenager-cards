/* Carte « Serrure connectée » — custom:appliance-smart-lock-card
 * Serrure motorisée posée sur le cylindre, côté intérieur de la porte. Trois modèles (option model) :
 * nuki_3_pro, nuki_pro_5 (5e génération) ou yale_linus, photos détourées, sur un halo de la couleur de l'état.
 * Entité lock : verrouillée / déverrouillée / ouverte (pêne tiré) / en cours / bloquée. Les reflets du bouton tournent,
 * l'anneau LED prend la couleur de l'état, des ondes partent du bouton à l'ouverture, l'anse du cadenas se lève ;
 * blocage : la serrure tremble.
 * Boutons Verrouiller / Déverrouiller / Ouvrir (2e clic de confirmation) et, facultatifs, boutons Lock 'n' Go.
 * Tuiles : batterie (%, en charge, critique), capteur de porte, dernier changement.
 */
(() => {
  const TAG = 'appliance-smart-lock-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Smart lock","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5th gen.)","model_yale_linus":"Yale Linus (photo)","locked":"Locked","unlocked":"Unlocked","locking":"Locking","unlocking":"Unlocking","open":"Unlatched","opening":"Unlatching","jammed":"Jammed","unknown":"Unknown","unavailable":"Unavailable","door_open":"Door open","door_closed":"Closed","door_opened":"Open","jammed_detail":"The motor is blocked: check the door and the key","battery_critical":"Battery critical: replace or charge it","btn_lock":"Lock","btn_unlock":"Unlock","btn_open":"Unlatch","btn_confirm":"Confirm?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + unlatch","battery":"Battery","charging":"Charging","critical":"Critical","ok":"OK","door":"Door","since":"Since"},"cs":{"name":"Chytrý zámek","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Zamčeno","unlocked":"Odemčeno","locking":"Zamyká se","unlocking":"Odemyká se","open":"Otevřeno","opening":"Otevírá se","jammed":"Zaseknutý","unknown":"Neznámý","unavailable":"Nedostupné","door_open":"Otevřené dveře","door_closed":"Zavřeno","door_opened":"Otevřeno","jammed_detail":"Motor je zablokovaný: zkontrolujte dveře a klíč","battery_critical":"Kritická baterie: vyměňte ji nebo nabijte","btn_lock":"Zamknout","btn_unlock":"Odemknout","btn_open":"Otevřít","btn_confirm":"Potvrdit?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + otevřít","battery":"Baterie","charging":"Nabíjí se","critical":"Kritická","ok":"OK","door":"Dveře","since":"Od"},"da":{"name":"Smart lås","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Låst","unlocked":"Ulåst","locking":"Låser","unlocking":"Låser op","open":"Falden åben","opening":"Åbner falden","jammed":"Blokeret","unknown":"Ukendt","unavailable":"Utilgængelig","door_open":"Dør åben","door_closed":"Lukket","door_opened":"Åben","jammed_detail":"Motoren er blokeret: tjek døren og nøglen","battery_critical":"Batteriet er kritisk lavt: skift eller oplad det","btn_lock":"Lås","btn_unlock":"Lås op","btn_open":"Åbn fallen","btn_confirm":"Bekræft?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + åbn fallen","battery":"Batteri","charging":"Oplader","critical":"Kritisk","ok":"OK","door":"Dør","since":"Siden"},"de":{"name":"Smartes Schloss","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. Gen.)","locked":"Verriegelt","unlocked":"Entriegelt","locking":"Verriegelt…","unlocking":"Entriegelt…","open":"Geöffnet","opening":"Öffnet","jammed":"Blockiert","unknown":"Unbekannt","unavailable":"Nicht verfügbar","door_open":"Tür offen","door_closed":"Geschlossen","door_opened":"Offen","jammed_detail":"Motor blockiert: Tür und Schlüssel prüfen","battery_critical":"Batterie kritisch: ersetzen oder laden","btn_lock":"Verriegeln","btn_unlock":"Entriegeln","btn_open":"Öffnen","btn_confirm":"Bestätigen?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + öffnen","battery":"Batterie","charging":"Lädt","critical":"Kritisch","ok":"OK","door":"Tür","since":"Seit"},"es":{"name":"Cerradura inteligente","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5.ª gen.)","locked":"Cerrada con llave","unlocked":"Abierta con llave","locking":"Cerrando con llave","unlocking":"Abriendo con llave","open":"Pestillo abierto","opening":"Abriendo pestillo","jammed":"Atascada","unknown":"Desconocido","unavailable":"No disponible","door_open":"Puerta abierta","door_closed":"Cerrada","door_opened":"Abierta","jammed_detail":"El motor está bloqueado: revisa la puerta y la llave","battery_critical":"Batería crítica: cámbiala o cárgala","btn_lock":"Cerrar","btn_unlock":"Abrir","btn_open":"Abrir pestillo","btn_confirm":"¿Confirmar?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + abrir pestillo","battery":"Batería","charging":"Cargando","critical":"Crítica","ok":"OK","door":"Puerta","since":"Desde"},"fr":{"name":"Serrure connectée","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5e gén.)","model_yale_linus":"Yale Linus (photo)","locked":"Verrouillée","unlocked":"Déverrouillée","locking":"Verrouillage","unlocking":"Déverrouillage","open":"Ouverte","opening":"Ouverture","jammed":"Bloquée","unknown":"Inconnu","unavailable":"Indisponible","door_open":"Porte ouverte","door_closed":"Fermée","door_opened":"Ouverte","jammed_detail":"Le moteur est bloqué : vérifiez la porte et la clé","battery_critical":"Batterie critique : remplacez-la ou rechargez-la","btn_lock":"Verrouiller","btn_unlock":"Déverrouiller","btn_open":"Ouvrir","btn_confirm":"Confirmer ?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + ouvrir","battery":"Batterie","charging":"En charge","critical":"Critique","ok":"OK","door":"Porte","since":"Depuis"},"hu":{"name":"Okoszár","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Zárva","unlocked":"Nyitva","locking":"Zárás","unlocking":"Nyitás","open":"Kilincs nyitva","opening":"Kilincs nyitás","jammed":"Beszorult","unknown":"Ismeretlen","unavailable":"Nem elérhető","door_open":"Ajtó nyitva","door_closed":"Zárva","door_opened":"Nyitva","jammed_detail":"A motor blokkolva: ellenőrizd az ajtót és a kulcsot","battery_critical":"Akkumulátor kritikus: cseréld vagy töltsd","btn_lock":"Bezárás","btn_unlock":"Nyitás","btn_open":"Kilincs","btn_confirm":"Megerősíted?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + kilincs","battery":"Akkumulátor","charging":"Töltés","critical":"Kritikus","ok":"OK","door":"Ajtó","since":"Óta"},"it":{"name":"Serratura smart","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5ª gen.)","locked":"Bloccata","unlocked":"Sbloccata","locking":"Blocco","unlocking":"Sblocco","open":"Aperta","opening":"Apertura","jammed":"Inceppata","unknown":"Sconosciuto","unavailable":"Non disponibile","door_open":"Porta aperta","door_closed":"Chiusa","door_opened":"Aperta","jammed_detail":"Motore bloccato: controlla la porta e la chiave","battery_critical":"Batteria critica: sostituirla o ricaricarla","btn_lock":"Blocca","btn_unlock":"Sblocca","btn_open":"Apri","btn_confirm":"Confermare?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + apri","battery":"Batteria","charging":"In carica","critical":"Critica","ok":"OK","door":"Porta","since":"Da"},"nb":{"name":"Smartlås","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Låst","unlocked":"Ulåst","locking":"Låser","unlocking":"Låser opp","open":"Åpnet","opening":"Åpner","jammed":"Fastkjørt","unknown":"Ukjent","unavailable":"Utilgjengelig","door_open":"Dør åpen","door_closed":"Lukket","door_opened":"Åpen","jammed_detail":"Motoren er blokkert: sjekk døren og nøkkelen","battery_critical":"Kritisk batteri: bytt eller lad","btn_lock":"Lås","btn_unlock":"Lås opp","btn_open":"Åpne","btn_confirm":"Bekreft?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + åpne","battery":"Batteri","charging":"Lader","critical":"Kritisk","ok":"OK","door":"Dør","since":"Siden"},"nl":{"name":"Slim slot","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5e gen.)","locked":"Vergrendeld","unlocked":"Ontgrendeld","locking":"Vergrendelen","unlocking":"Ontgrendelen","open":"Geopend","opening":"Openen","jammed":"Geblokkeerd","unknown":"Onbekend","unavailable":"Niet beschikbaar","door_open":"Deur open","door_closed":"Gesloten","door_opened":"Open","jammed_detail":"Motor geblokkeerd: controleer de deur en de sleutel","battery_critical":"Batterij kritiek: vervangen of opladen","btn_lock":"Vergrendelen","btn_unlock":"Ontgrendelen","btn_open":"Openen","btn_confirm":"Bevestigen?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + openen","battery":"Batterij","charging":"Laadt","critical":"Kritiek","ok":"OK","door":"Deur","since":"Sinds"},"pl":{"name":"Inteligentny zamek","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Zamknięty","unlocked":"Odblokowany","locking":"Zamykanie","unlocking":"Odblokowywanie","open":"Otwarto zamek","opening":"Otwieranie zamka","jammed":"Zablokowany","unknown":"Nieznany","unavailable":"Niedostępny","door_open":"Drzwi otwarte","door_closed":"Zamknięta","door_opened":"Otwarta","jammed_detail":"Silnik jest zablokowany: sprawdź drzwi i klucz","battery_critical":"Bateria krytyczna: wymień lub naładuj","btn_lock":"Zamknij","btn_unlock":"Odblokuj","btn_open":"Otwórz zamek","btn_confirm":"Potwierdzić?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + otwarcie zamka","battery":"Bateria","charging":"Ładowanie","critical":"Krytyczna","ok":"OK","door":"Drzwi","since":"Od"},"pt-BR":{"name":"Fechadura inteligente","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5ª geração)","model_yale_linus":"Yale Linus (foto)","locked":"Trancada","unlocked":"Destrancada","locking":"Trancando","unlocking":"Destrancando","open":"Trinco aberto","opening":"Abrindo o trinco","jammed":"Travada","unknown":"Desconhecido","unavailable":"Indisponível","door_open":"Porta aberta","door_closed":"Fechada","door_opened":"Aberta","jammed_detail":"O motor está bloqueado: verifique a porta e a chave","battery_critical":"Bateria em nível crítico: substitua-a ou carregue-a","btn_lock":"Trancar","btn_unlock":"Destrancar","btn_open":"Abrir trinco","btn_confirm":"Confirmar?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + abrir trinco","battery":"Bateria","charging":"Carregando","critical":"Crítico","ok":"OK","door":"Porta","since":"Desde"},"pt-PT":{"name":"Fechadura inteligente","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5.ª geração)","model_yale_linus":"Yale Linus (foto)","locked":"Trancada","unlocked":"Destrancada","locking":"A trancar","unlocking":"A destrancar","open":"Trinco aberto","opening":"A abrir o trinco","jammed":"Encravada","unknown":"Desconhecido","unavailable":"Indisponível","door_open":"Porta aberta","door_closed":"Fechada","door_opened":"Aberta","jammed_detail":"O motor está bloqueado: verifique a porta e a chave","battery_critical":"Bateria em nível crítico: substitua-a ou carregue-a","btn_lock":"Trancar","btn_unlock":"Destrancar","btn_open":"Abrir trinco","btn_confirm":"Confirmar?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + abrir trinco","battery":"Bateria","charging":"A carregar","critical":"Crítico","ok":"OK","door":"Porta","since":"Desde"},"ro":{"name":"Încuietoare inteligentă","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (gen. 5)","locked":"Încuiată","unlocked":"Descuiată","locking":"Se încuie","unlocking":"Se descuie","open":"Deschisă","opening":"Se deschide","jammed":"Blocată","unknown":"Necunoscut","unavailable":"Indisponibil","door_open":"Ușă deschisă","door_closed":"Închisă","door_opened":"Deschisă","jammed_detail":"Motor blocat: verificați ușa și cheia","battery_critical":"Baterie critică: înlocuiți-o sau încărcați-o","btn_lock":"Încuie","btn_unlock":"Descuie","btn_open":"Deschide","btn_confirm":"Confirmați?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + deschide","battery":"Baterie","charging":"Se încarcă","critical":"Critică","ok":"OK","door":"Ușă","since":"De la"},"ru":{"name":"Умный замок","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5-е пок.)","locked":"Заперт","unlocked":"Открыт","locking":"Запирается","unlocking":"Открывается","open":"Открыта","opening":"Открывается","jammed":"Заклинило","unknown":"Неизвестно","unavailable":"Недоступно","door_open":"Дверь открыта","door_closed":"Закрыта","door_opened":"Открыта","jammed_detail":"Мотор заблокирован: проверьте дверь и ключ","battery_critical":"Батарея разряжена: замените или зарядите","btn_lock":"Запереть","btn_unlock":"Открыть","btn_open":"Открыть дверь","btn_confirm":"Подтвердить?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + открыть","battery":"Батарея","charging":"Заряжается","critical":"Критично","ok":"OK","door":"Дверь","since":"С"},"sr":{"name":"Паметна брава","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. ген.)","locked":"Закључана","unlocked":"Откључана","locking":"Закључавање","unlocking":"Откључавање","open":"Отворена","opening":"Отварање","jammed":"Заглављена","unknown":"Непознато","unavailable":"Недоступно","door_open":"Врата отворена","door_closed":"Затворена","door_opened":"Отворена","jammed_detail":"Мотор је блокиран: проверите врата и кључ","battery_critical":"Батерија критична: замените или напуните","btn_lock":"Закључај","btn_unlock":"Откључај","btn_open":"Отвори","btn_confirm":"Потврди?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + отвори","battery":"Батерија","charging":"Пуни се","critical":"Критично","ok":"OK","door":"Врата","since":"Од"},"sr-Latn":{"name":"Pametna brava","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5. gen.)","locked":"Zaključana","unlocked":"Otključana","locking":"Zaključavanje","unlocking":"Otključavanje","open":"Otvorena","opening":"Otvaranje","jammed":"Zaglavljena","unknown":"Nepoznato","unavailable":"Nedostupno","door_open":"Vrata otvorena","door_closed":"Zatvorena","door_opened":"Otvorena","jammed_detail":"Motor je blokiran: proverite vrata i ključ","battery_critical":"Baterija kritična: zamenite ili napunite","btn_lock":"Zaključaj","btn_unlock":"Otključaj","btn_open":"Otvori","btn_confirm":"Potvrdi?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + otvori","battery":"Baterija","charging":"Puni se","critical":"Kritično","ok":"OK","door":"Vrata","since":"Od"},"uk":{"name":"Розумний замок","model_nuki_3_pro":"Nuki Smart Lock 3.0 Pro","model_nuki_pro_5":"Nuki Smart Lock Pro (5-те покоління)","locked":"Зачинено на ключ","unlocked":"Відімкнено","locking":"Замикається","unlocking":"Відмикається","open":"Засув відкрито","opening":"Засув відкривається","jammed":"Заклинило","unknown":"Невідомо","unavailable":"Недоступно","door_open":"Двері відчинені","door_closed":"Зачинені","door_opened":"Відчинені","jammed_detail":"Двигун заблоковано: перевірте двері та ключ","battery_critical":"Критичний заряд: замініть або зарядіть батарею","btn_lock":"Замкнути","btn_unlock":"Відімкнути","btn_open":"Відкрити засув","btn_confirm":"Підтвердити?","btn_lock_n_go":"Lock 'n' Go","btn_lock_n_go_unlatch":"Lock 'n' Go + відкрити засув","battery":"Батарея","charging":"Заряджається","critical":"Критично","ok":"ОК","door":"Двері","since":"З"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{position:relative;display:block;padding:10px 12px 12px;overflow:hidden;--sl-ok:var(--appliance-ok-color,#43a047);--sl-alert:var(--appliance-alert-color,#db4437);
  --sl-warn:var(--appliance-warn-color,#ffa000);--sl-cold:var(--appliance-cold-color,#2b9af9);--sl-c:#9aa3ad}
/* repère couleur (option color) : barre sur le bord gauche + point devant le titre, pour distinguer plusieurs serrures */
.idbar{display:none;position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--sl-id)}
.iddot{display:none;flex:none;width:9px;height:9px;border-radius:50%;background:var(--sl-id);margin-right:6px}
ha-card.hasid .idbar{display:block}ha-card.hasid .iddot{display:inline-block}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.locked{--sl-c:var(--sl-ok)}
ha-card.unlocked{--sl-c:var(--sl-warn)}
ha-card.open,ha-card.opening{--sl-c:var(--sl-cold)}
ha-card.locking{--sl-c:var(--sl-ok)}
ha-card.unlocking{--sl-c:var(--sl-warn)}
ha-card.jammed{--sl-c:var(--sl-alert)}
.locked .badge,.unlocked .badge,.open .badge,.opening .badge,.locking .badge,.unlocking .badge,.jammed .badge{background:color-mix(in srgb,var(--sl-c) 22%,transparent);color:var(--sl-c)}
ha-card.jammed{box-shadow:0 0 0 1px color-mix(in srgb,var(--sl-c) 60%,transparent),0 0 22px color-mix(in srgb,var(--sl-c) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--sl-c);font-weight:500;text-align:center}
.alert.on{display:block}.alert.warn{color:var(--sl-warn)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 74px;max-width:130px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--sl-c) 28%,var(--secondary-background-color))}
.ctl button.confirm{background:color-mix(in srgb,var(--sl-cold) 35%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--sl-alert)}.tile.warn .v{color:var(--sl-warn)}
/* ---- illustration ---- */
/* reflet du bouton : tourne avec l'état (verrouillé 0, déverrouillé 2 tours, ouvert 2,5 tours), en continu pendant le mouvement */
.sl-sheen{transition:transform 1.6s cubic-bezier(.45,0,.25,1);transform:rotate(var(--sl-turn,0deg))}
.unlocked{--sl-turn:-720deg}.open{--sl-turn:-900deg}
.locking .sl-spin,.unlocking .sl-spin,.opening .sl-spin{animation:slturn 1.1s linear infinite}
.unlocking .sl-spin,.opening .sl-spin{animation-direction:reverse}
/* anneau LED : couleur de l'état, pulsation verrouillée, segments qui tournent en mouvement, clignote si bloquée */
.sl-ring{fill:none;stroke:var(--sl-c);stroke-width:2.4;filter:drop-shadow(0 0 2.5px var(--sl-c));transition:stroke .4s}
.sl-halo{fill:none;stroke:var(--sl-c);stroke-width:7;opacity:.18;transition:stroke .4s}
.locked .sl-ring,.locked .sl-halo{animation:slbeat 4s ease-in-out infinite}
.locking .sl-ring,.unlocking .sl-ring,.opening .sl-ring{stroke-dasharray:10 7;animation:slspin .9s linear infinite}
.unlocking .sl-ring,.opening .sl-ring{animation-direction:reverse}
.jammed .sl-ring,.jammed .sl-halo{animation:slblink .5s infinite}
.unavailable .sl-ring,.unknown .sl-ring{stroke:#5d646b;filter:none}.unavailable .sl-halo,.unknown .sl-halo{opacity:0}
/* flèches de rotation autour du bouton pendant le mouvement */
.sl-arrows{opacity:0;transition:opacity .3s}.locking .sl-arrows,.unlocking .sl-arrows,.opening .sl-arrows{opacity:1}
.sl-arrows path{fill:none;stroke:var(--sl-c);stroke-width:2;stroke-linecap:round}
.unlocking .sl-arrows,.opening .sl-arrows{transform:scaleX(-1)}
/* halo de la couleur de l'état derrière la serrure (respire quand verrouillée), ombre portée */
.sl-aura{opacity:.55;transition:opacity .6s}.locked .sl-aura{animation:slaura 4s ease-in-out infinite}
.unavailable .sl-aura,.unknown .sl-aura{opacity:0}
.sl-auras{stop-color:var(--sl-c);transition:stop-color .4s}
/* ouverture (pêne tiré) : ondes qui partent du bouton */
.sl-wave{fill:none;stroke:var(--sl-c);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.open .sl-wave,.opening .sl-wave{animation:slwave 1.8s ease-out infinite}.sl-wave.w2{animation-delay:.6s}.sl-wave.w3{animation-delay:1.2s}
/* porte ouverte (capteur) : petite porte entrouverte à côté du cadenas */
.sl-doorpic{opacity:0;transition:opacity .5s}.door .sl-doorpic{opacity:1}
/* cadenas : l'anse se lève et pivote au déverrouillage */
.sl-shackle{transform-box:view-box;transform-origin:28px 22px;transition:transform .8s cubic-bezier(.45,0,.25,1)}
.unlocked .sl-shackle,.open .sl-shackle,.opening .sl-shackle{transform:translateY(-3px) rotate(-28deg)}
.unlocking .sl-shackle,.locking .sl-shackle{transform:translateY(-2px)}
.sl-pad{fill:var(--sl-c);transition:fill .4s}.sl-padbg{fill:color-mix(in srgb,var(--sl-c) 18%,#fff);transition:fill .4s}
/* blocage : la serrure tremble ; pile faible / critique : pictogramme qui clignote */
.jammed .sl-dev{animation:slshake .35s ease-in-out 3,slshake .35s ease-in-out 4s infinite}
.sl-warn,.sl-bat{opacity:0}.jammed .sl-warn{opacity:1;animation:slblink 1s infinite}
.lowbat .sl-bat{opacity:1;animation:slblink 1.6s infinite}.critbat .sl-bat path{fill:var(--sl-alert)}
.sl-dev{transform-box:view-box;transform-origin:120px 100px}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes slbeat{0%,100%{stroke-opacity:.45}50%{stroke-opacity:1}}
@keyframes slspin{to{stroke-dashoffset:-34}}
@keyframes slturn{to{transform:rotate(-360deg)}}
@keyframes slblink{50%{opacity:.15}}
@keyframes slaura{50%{opacity:.85}}
@keyframes slwave{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.9)}}
@keyframes slshake{0%,100%{transform:rotate(0)}25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}}
`;

  // Photos détourées (coordonnées en pixels de la photo) et dessins ; chaque modèle donne la place de l'anneau LED
  // et du disque tournant (cx, cy, rx, ry) dans la scène 240 × 180.
  const PRO3 = window.__acImg("smart-lock",0);
  const YALE = window.__acImg("smart-lock",1);
  const PRO5 = window.__acImg("smart-lock",2);
  const MODELS = {
    // Nuki Smart Lock 3.0 Pro : photo détourée, 192 × 300, posée à (72, 16) sur 96 × 150
    nuki_3_pro: {
      ring: [102.6, 51.5, 17.3, 17.7], disc: [103.5, 50.1, 30.3, 30.8], shadow: 120,
      art: `<image href="${PRO3}" x="72" y="16" width="96.1" height="150"/>`,
    },
    // Nuki Smart Lock Pro (5e génération) : photo détourée, 205 × 159, posée à (40, 24) à l'échelle 0,78
    nuki_pro_5: {
      ring: [92.8, 86.1, 26.8, 28.6], disc: [95.4, 86, 53.1, 59.3],
      art: `<image href="${PRO5}" x="40" y="24" width="160" height="124.1"/>`,
    },
    // Yale Linus : photo détourée, 188 × 409, posée à (86, 16) sur 69 × 150. Le disque du haut porte le levier (reflets, flèches de rotation),
    // l'anneau LED et les ondes partent du cercle du bas (logo Yale)
    yale_linus: {
      ring: [127.4, 134.1, 20.9, 21.3], disc: [127.1, 45.3, 21.3, 23.8], shadow: 120,
      art: `<image href="${YALE}" x="86" y="16" width="69" height="150"/>`,
    },
  };
  // décor commun : halo de l'état, ombre, ondes d'ouverture, cadenas, pictogrammes (porte, blocage, pile)
  const DEFS = `<radialGradient id="slaurag"><stop offset="0" class="sl-auras" stop-opacity=".55"/><stop offset=".6" class="sl-auras" stop-opacity=".12"/><stop offset="1" class="sl-auras" stop-opacity="0"/></radialGradient>
    <radialGradient id="slglint" cx="0" cy="0" r="80" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".7" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  const SVG = (model0, label) => {
    // modèle limité aux modèles connus (sinon défaut) et identifiant réduit à [a-z0-9_-] : il sert dans les id / url(#…) du SVG
    const model = Object.prototype.hasOwnProperty.call(MODELS, model0) ? String(model0).toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'nuki_3_pro';
    const M = MODELS[model] || MODELS.nuki_3_pro, [rx0, ry0, rrx, rry] = M.ring, [dx, dy, drx, dry] = M.disc;
    // reflets du disque : secteurs clairs dessinés autour de (0, 0), étirés en ellipse, qui tournent
    const wedges = [0, 180].map((a) => `<path d="M0 0 L${Math.cos((a - 22) * Math.PI / 180) * 80} ${Math.sin((a - 22) * Math.PI / 180) * 80} A80 80 0 0 1 ${Math.cos((a + 22) * Math.PI / 180) * 80} ${Math.sin((a + 22) * Math.PI / 180) * 80}Z" fill="url(#slglint)"/>`).join('');
    return `<svg viewBox="0 0 240 180" role="img" aria-label="${esc(label)}"><defs>${DEFS}
      <clipPath id="sldisc-${model}"><ellipse cx="${dx}" cy="${dy}" rx="${drx}" ry="${dry}"/></clipPath>
      <clipPath id="slbtnc-${model}"><ellipse cx="${rx0}" cy="${ry0}" rx="${rrx - 1.5}" ry="${rry - 1.5}"/></clipPath></defs>
      <ellipse class="sl-aura" cx="${dx}" cy="${dy + 6}" rx="${drx + 46}" ry="${dry + 34}" fill="url(#slaurag)"/>
      <ellipse cx="${M.shadow || dx + 6}" cy="170" rx="${Math.max(drx + 8, 46)}" ry="5" fill="#000" fill-opacity=".16"/>
      ${['', ' w2', ' w3'].map((w) => `<ellipse class="sl-wave${w}" cx="${rx0}" cy="${ry0}" rx="${rrx + 4}" ry="${rry + 4}"/>`).join('')}
      <g class="sl-dev">${M.art}
          <g clip-path="url(#sldisc-${model})"><g transform="translate(${dx} ${dy}) scale(${(drx / dry).toFixed(3)} 1)"><g class="sl-spin"><g class="sl-sheen">${wedges}</g></g></g></g>
          <g clip-path="url(#slbtnc-${model})"><g transform="translate(${rx0} ${ry0}) scale(${(rrx / rry).toFixed(3)} 1)"><g class="sl-spin"><g class="sl-sheen">${wedges.replace(/80/g, '40')}</g></g></g></g>
          <ellipse class="sl-halo" cx="${rx0}" cy="${ry0}" rx="${rrx}" ry="${rry}"/>
          <ellipse class="sl-ring" cx="${rx0}" cy="${ry0}" rx="${rrx}" ry="${rry}"/>
          <g class="sl-arrows" style="transform-box:view-box;transform-origin:${dx}px ${dy}px">
            <path d="M${dx - drx - 6} ${dy - 10} A${drx + 6} ${dry + 6} 0 0 1 ${dx - 10} ${dy - dry - 6}"/><path d="M${dx - 16} ${dy - dry - 10} L${dx - 10} ${dy - dry - 6} L${dx - 16} ${dy - dry - 1}"/>
          </g>
        </g>
      <g class="sl-doorpic" transform="translate(50 15)"><rect x="0" y="0" width="13" height="20" rx="1.5" fill="none" stroke="var(--sl-c)" stroke-width="1.8"/><path d="M0 0 L9 3 V23 L0 20Z" fill="var(--sl-c)"/></g>
      <g class="sl-padg"><circle class="sl-padbg" cx="28" cy="28" r="15"/>
        <path class="sl-shackle" d="M22 26 V21 A6 6 0 0 1 34 21 V26" fill="none" stroke="var(--sl-c)" stroke-width="2.6" stroke-linecap="round"/>
        <rect class="sl-pad" x="19.5" y="25" width="17" height="12" rx="2.5"/><circle cx="28" cy="30.5" r="1.8" fill="#fff"/></g>
      <g class="sl-warn"><path d="M212 18 L226 42 H198 Z" fill="#db4437"/><path d="M212 26 V34" stroke="#fff" stroke-width="2.4"/><circle cx="212" cy="38" r="1.4" fill="#fff"/></g>
      <g class="sl-bat"><rect x="14" y="152" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="36" y="155" width="3" height="6" fill="#ffa000"/><path d="M17 155 h4 v6 h-4z" fill="#ffa000"/></g>
    </svg>`;
  };

  const TILES = [['battery', 'mdi:battery', 'show_battery'], ['door', 'mdi:door', 'show_door'], ['since', 'mdi:clock-outline', 'show_since']];
  const STATES = ['locked', 'unlocked', 'locking', 'unlocking', 'open', 'opening', 'jammed'];

  class ApplianceSmartLockCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), dc = (i) => (hass.states[i].attributes || {}).device_class;
      const lock = ids.find((i) => i.startsWith('lock.') && /nuki|serrure|lock|porte|door/i.test(i)) || ids.find((i) => i.startsWith('lock.')) || '';
      const dev = lock.split('.')[1] || '\u0000';
      return {
        entity: lock,
        entity_battery: ids.find((i) => i.startsWith('sensor.') && dc(i) === 'battery' && i.includes(dev)) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { model: 'nuki_3_pro', battery_low: 20, confirm_open: true, show_status: true, show_buttons: true, show_battery: true, show_door: true, show_since: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(s) { return this._ok(s) && /^(on|true|open|opened|1|yes|low|charging)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(s) {
      const t = s && Date.parse(s.last_changed); if (!t) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }
    // bouton : entité button / script, sinon service lock
    _press(id) {
      if (!this._hass || !id) return;
      const d = id.split('.')[0];
      const [dom, svc] = { button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'] }[d] || ['homeassistant', 'turn_on'];
      this._hass.callService(dom, svc, { entity_id: id });
    }
    _lock(svc) { if (this._hass && this._c.entity) this._hass.callService('lock', svc, { entity_id: this._c.entity }); }

    _compute() {
      const c = this._c, s = this._st(c.entity);
      const raw = s ? String(s.state).toLowerCase() : 'unavailable';
      const st = STATES.includes(raw) ? raw : raw === 'unknown' ? 'unknown' : this._ok(s) ? 'unknown' : 'unavailable';
      // batterie : % (sensor), ou binary_sensor « critique » ; en charge : binary_sensor
      const bS = this._st(c.entity_battery), bat = this._num(bS), batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const crit = this._on(this._st(c.entity_battery_critical)) || (batBinary && this._on(bS));
      const low = crit || (!isNaN(bat) && bat < Number(c.battery_low));
      const charging = this._on(this._st(c.entity_battery_charging));
      const dS = this._st(c.entity_door), door = this._on(dS);
      return { st, s, bS, bat, batBinary, crit, low, charging, dS, door };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card><div class="idbar"></div>
        <div class="head"><div class="title"><span class="iddot"></span><span id="sltitle"></span></div><div class="badge" id="slbadge"></div></div>
        ${SVG(this._c.model, this._c.name || this._t('name'))}
        <div class="alert" id="slalert"></div>
        <div class="ctl" id="slctl">
          <button data-a="lock"><ha-icon icon="mdi:lock"></ha-icon><span></span></button>
          <button data-a="unlock"><ha-icon icon="mdi:lock-open-variant"></ha-icon><span></span></button>
          <button data-a="open"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button>
        </div>
        <div class="ctl" id="slgo">
          <button data-a="lock_n_go"><ha-icon icon="mdi:lock-clock"></ha-icon><span></span></button>
          <button data-a="lock_n_go_unlatch"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button>
        </div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity));
      root.querySelectorAll('.ctl button').forEach((b) => b.addEventListener('click', () => this._action(b.dataset.a)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ battery: c.entity_battery || c.entity_battery_critical, door: c.entity_door, since: c.entity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _action(a) {
      const c = this._c;
      if (a === 'lock') return this._lock('lock');
      if (a === 'unlock') return this._lock('unlock');
      if (a === 'lock_n_go') return this._press(c.entity_lock_n_go);
      if (a === 'lock_n_go_unlatch') return this._press(c.entity_lock_n_go_unlatch);
      if (a === 'open') {
        // ouvrir = tirer le pêne : 2e clic dans les 4 s (confirm_open: false pour un seul clic)
        if (c.confirm_open !== false && !(this._confirmUntil && Date.now() < this._confirmUntil)) {
          this._confirmUntil = Date.now() + 4000;
          clearTimeout(this._confirmTimer);
          this._confirmTimer = setTimeout(() => { this._confirmUntil = 0; this._render(); }, 4000);
          this._render();
          return;
        }
        this._confirmUntil = 0; clearTimeout(this._confirmTimer);
        if (c.entity_unlatch) this._press(c.entity_unlatch); else this._lock('open');
        this._render();
      }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, s, bS, bat, batBinary, crit, low, charging, dS, door } = this._compute();
      // color : [r,g,b] (éditeur) ou texte CSS (#hex, rgb(), nom)
      const col = Array.isArray(c.color) && c.color.length >= 3 ? `rgb(${c.color.slice(0, 3).map((x) => Math.round(Number(x) || 0)).join(',')})`
        : typeof c.color === 'string' && /^[#a-z0-9(),.%\s-]+$/i.test(c.color.trim()) ? c.color.trim() : '';
      if (col) card.style.setProperty('--sl-id', col); else card.style.removeProperty('--sl-id');
      // color_<état> : couleur du halo, de l'anneau LED et du badge pour cet état (même format que color) ; prend le pas sur le thème
      const stCol = (v) => (Array.isArray(v) && v.length >= 3 ? `rgb(${v.slice(0, 3).map((x) => Math.round(Number(x) || 0)).join(',')})`
        : typeof v === 'string' && /^[#a-z0-9(),.%\s-]+$/i.test(v.trim()) ? v.trim() : '');
      const sc = stCol(c['color_' + st]);
      if (sc) card.style.setProperty('--sl-c', sc); else card.style.removeProperty('--sl-c');
      card.className = `${col ? 'hasid ' : ''}${st}${door ? ' door' : ''}${low ? ' lowbat' : ''}${crit ? ' critbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('sltitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('slbadge');
      badge.textContent = this._t(st) + (door ? ` · ${this._t('door_open')}` : '');
      badge.style.display = c.show_status === false ? 'none' : '';

      const al = r.getElementById('slalert');
      al.textContent = st === 'jammed' ? this._t('jammed_detail') : crit ? this._t('battery_critical') : '';
      al.classList.toggle('on', !!al.textContent);
      al.classList.toggle('warn', st !== 'jammed');

      // commandes : Ouvrir seulement si la serrure sait tirer le pêne (LockEntityFeature.OPEN = 1) ou avec un bouton dédié
      const sf = Number(s && s.attributes && s.attributes.supported_features);
      const canOpen = !!c.entity_unlatch || (isFinite(sf) && (sf & 1) === 1);
      const busy = /ing$/.test(st), dead = st === 'unavailable';
      const confirm = this._confirmUntil && Date.now() < this._confirmUntil;
      const ctl = r.getElementById('slctl');
      ctl.classList.toggle('hide', c.show_buttons === false || !c.entity);
      ctl.querySelectorAll('button').forEach((b) => {
        const a = b.dataset.a;
        b.querySelector('span').textContent = a === 'open' && confirm ? this._t('btn_confirm') : this._t(`btn_${a}`);
        b.classList.toggle('hide', a === 'open' && !canOpen);
        b.classList.toggle('on', (a === 'lock' && st === 'locked') || (a === 'unlock' && st === 'unlocked') || (a === 'open' && st === 'open'));
        b.classList.toggle('confirm', a === 'open' && !!confirm);
        b.disabled = dead || busy || (a === 'lock' && st === 'locked') || (a === 'unlock' && st === 'unlocked');
      });
      const go = r.getElementById('slgo');
      go.querySelectorAll('button').forEach((b) => {
        b.querySelector('span').textContent = this._t(`btn_${b.dataset.a}`);
        b.classList.toggle('hide', !c[`entity_${b.dataset.a}`]);
        b.disabled = dead || busy;
      });
      go.classList.toggle('hide', c.show_buttons === false || (!c.entity_lock_n_go && !c.entity_lock_n_go_unlatch));

      const batIcon = charging ? 'mdi:battery-charging' : low ? 'mdi:battery-alert' : 'mdi:battery';
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', batIcon);
      const V = {
        battery: [c.entity_battery || c.entity_battery_critical, !isNaN(bat) && !batBinary ? String(Math.round(bat)) : this._t(crit ? 'critical' : 'ok'),
          !isNaN(bat) && !batBinary ? '%' : '', crit ? 'bad' : low ? 'warn' : ''],
        door: [c.entity_door, this._ok(dS) ? this._t(door ? 'door_opened' : 'door_closed') : '--', '', door ? 'warn' : ''],
        since: [s, this._since(s), '', ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', cls === 'bad'); el.classList.toggle('warn', cls === 'warn');
        el.querySelector('.lbl').textContent = this._l(k === 'battery' && charging ? 'charging' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceSmartLockCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSmartLockCardEditor extends HTMLElement {
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
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: 'nuki_3_pro', label: tr.model_nuki_3_pro }, { value: 'nuki_pro_5', label: tr.model_nuki_pro_5 }, { value: 'yale_linus', label: tr.model_yale_linus }] } } },
        { name: 'color', selector: { color_rgb: {} } },
        { name: 'color_locked', selector: { color_rgb: {} } },
        { name: 'color_unlocked', selector: { color_rgb: {} } },
        { name: 'color_jammed', selector: { color_rgb: {} } },
        { name: 'color_locking', selector: { color_rgb: {} } },
        { name: 'color_unlocking', selector: { color_rgb: {} } },
        { name: 'color_open', selector: { color_rgb: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', 'lock'),
        ent('entity_unlatch', ['button', 'input_button', 'script']),
        ent('entity_lock_n_go', ['button', 'input_button', 'script']),
        ent('entity_lock_n_go_unlatch', ['button', 'input_button', 'script']),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        ent('entity_battery_charging', 'binary_sensor'),
        ent('entity_battery_critical', 'binary_sensor'),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ent('entity_door', ['binary_sensor', 'sensor']),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('confirm_open'), bool('show_status'), bool('show_buttons'), bool('show_battery'), bool('show_door'), bool('show_since'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'lock_model' : s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSmartLockCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Serrure connectée animée (Nuki 3.0 Pro, Nuki Pro 5e gén.) : verrouiller, déverrouiller, ouvrir, Lock \'n\' Go, batterie, porte.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/smart-lock.md',
  });
})();
