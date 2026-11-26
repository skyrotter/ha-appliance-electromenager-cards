/* Carte « Compteur de gaz » — custom:appliance-gas-meter-card
 * Compteur à soufflet jaune : totalisateur (5 chiffres + 3 décimales rouges), flamme animée selon le débit,
 * roue de contrôle qui tourne. Tous les capteurs sont optionnels : index (m³, kWh, ft³… affiché dans l'unité
 * du capteur, sans conversion), débit, consommation du jour, coût, détecteur(s) de gaz / fuite, vanne d'arrêt.
 * Sans capteur de débit, le débit est déduit des variations de l'index (unité de l'index par heure).
 * entity_leak accepte une entité OU une liste : le bandeau nomme les détecteurs déclenchés.
 */
(() => {
  const TAG = 'appliance-gas-meter-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Gas meter",
      "idle": "No flow",
      "flowing": "Gas flowing",
      "leak": "Gas leak",
      "valve_closed": "Valve closed",
      "unavailable": "Unavailable",
      "leak_detected": "Gas detected by the sensor",
      "leak_detected_by": "Gas detected by: {n}",
      "open_valve": "Open valve",
      "close_valve": "Close valve",
      "flow": "Flow",
      "today": "Today",
      "index": "Index",
      "cost": "Cost",
      "variant_classic": "Classic (yellow bellows meter)",
      "variant_modern": "Modern (grey meter, yellow pipe)",
      "variant_belgian": "Belgian (communicating G4 meter, photo)"
    },
    "cs": {
      "name": "Plynoměr",
      "idle": "Bez průtoku",
      "flowing": "Plyn proudí",
      "leak": "Únik plynu",
      "valve_closed": "Ventil zavřen",
      "unavailable": "Nedostupné",
      "leak_detected": "Plyn zjištěn senzorem",
      "leak_detected_by": "Plyn zjištěn: {n}",
      "open_valve": "Otevřít ventil",
      "close_valve": "Zavřít ventil",
      "flow": "Průtok",
      "today": "Dnes",
      "index": "Stav",
      "cost": "Cena"
    },
    "da": {
      "name": "Gasmåler",
      "idle": "Intet flow",
      "flowing": "Gas strømmer",
      "leak": "Gaslækage",
      "valve_closed": "Ventil lukket",
      "unavailable": "Utilgængelig",
      "leak_detected": "Gas registreret af sensoren",
      "leak_detected_by": "Gas registreret af: {n}",
      "open_valve": "Åbn ventil",
      "close_valve": "Luk ventil",
      "flow": "Flow",
      "today": "I dag",
      "index": "Indeks",
      "cost": "Pris",
      "variant_classic": "Klassisk (gul bælgmåler)",
      "variant_modern": "Moderne (grå måler, gult rør)"
    },
    "de": {
      "name": "Gaszähler",
      "idle": "Kein Verbrauch",
      "flowing": "Gas fließt",
      "leak": "Gasleck",
      "valve_closed": "Ventil geschlossen",
      "unavailable": "Nicht verfügbar",
      "leak_detected": "Gas vom Sensor erkannt",
      "leak_detected_by": "Gas erkannt durch: {n}",
      "open_valve": "Ventil öffnen",
      "close_valve": "Ventil schließen",
      "flow": "Durchfluss",
      "today": "Heute",
      "index": "Zählerstand",
      "cost": "Kosten",
      "variant_classic": "Klassisch (gelber Balgengaszähler)",
      "variant_modern": "Modern (grauer Zähler, gelbes Rohr)"
    },
    "es": {
      "name": "Contador de gas",
      "idle": "Sin caudal",
      "flowing": "Gas circulando",
      "leak": "Fuga de gas",
      "valve_closed": "Válvula cerrada",
      "unavailable": "No disponible",
      "leak_detected": "Gas detectado por el sensor",
      "leak_detected_by": "Gas detectado por: {n}",
      "open_valve": "Abrir válvula",
      "close_valve": "Cerrar válvula",
      "flow": "Caudal",
      "today": "Hoy",
      "index": "Índice",
      "cost": "Coste",
      "variant_classic": "Clásico (contador de fuelle amarillo)",
      "variant_modern": "Moderno (contador gris, tubo amarillo)",
      "variant_belgian": "Belga (contador comunicante G4, foto)"
    },
    "fr": {
      "name": "Compteur de gaz",
      "idle": "Pas de consommation",
      "flowing": "Gaz en consommation",
      "leak": "Fuite de gaz",
      "valve_closed": "Vanne fermée",
      "unavailable": "Indisponible",
      "leak_detected": "Gaz détecté par le capteur",
      "leak_detected_by": "Gaz détecté par : {n}",
      "open_valve": "Ouvrir la vanne",
      "close_valve": "Fermer la vanne",
      "flow": "Débit",
      "today": "Aujourd'hui",
      "index": "Index",
      "cost": "Coût",
      "variant_classic": "Classique (compteur à soufflet jaune)",
      "variant_modern": "Moderne (compteur gris, tuyau jaune)",
      "variant_belgian": "Belge (compteur communicant G4, photo)"
    },
    "hu": {
      "name": "Gázóra",
      "idle": "Nincs áramlás",
      "flowing": "Gáz áramlik",
      "leak": "Gázszivárgás",
      "valve_closed": "Szelep zárva",
      "unavailable": "Nem elérhető",
      "leak_detected": "Gázt észlelt a szenzor",
      "leak_detected_by": "Gáz észlelve: {n}",
      "open_valve": "Szelep nyitása",
      "close_valve": "Szelep zárása",
      "flow": "Áramlás",
      "today": "Ma",
      "index": "Index",
      "cost": "Költség",
      "variant_classic": "Klasszikus (sárga membrános óra)",
      "variant_modern": "Modern (szürke óra, sárga cső)"
    },
    "it": {
      "name": "Contatore del gas",
      "idle": "Nessun consumo",
      "flowing": "Gas in consumo",
      "leak": "Perdita di gas",
      "valve_closed": "Valvola chiusa",
      "unavailable": "Non disponibile",
      "leak_detected": "Gas rilevato dal sensore",
      "leak_detected_by": "Gas rilevato da: {n}",
      "open_valve": "Apri la valvola",
      "close_valve": "Chiudi la valvola",
      "flow": "Portata",
      "today": "Oggi",
      "index": "Indice",
      "cost": "Costo",
      "variant_classic": "Classico (contatore a soffietto giallo)",
      "variant_modern": "Moderno (contatore grigio, tubo giallo)"
    },
    "nb": {
      "name": "Gassmåler",
      "idle": "Ikke noe forbruk",
      "flowing": "Gass strømmer",
      "leak": "Gasslekkasje",
      "valve_closed": "Ventil stengt",
      "unavailable": "Utilgjengelig",
      "leak_detected": "Gass oppdaget av sensoren",
      "leak_detected_by": "Gass oppdaget av: {n}",
      "open_valve": "Åpne ventil",
      "close_valve": "Steng ventil",
      "flow": "Strømning",
      "today": "I dag",
      "index": "Målerstand",
      "cost": "Kostnad"
    },
    "nl": {
      "name": "Gasmeter",
      "idle": "Geen verbruik",
      "flowing": "Gas stroomt",
      "leak": "Gaslek",
      "valve_closed": "Kraan dicht",
      "unavailable": "Niet beschikbaar",
      "leak_detected": "Gas gedetecteerd door de sensor",
      "leak_detected_by": "Gas gedetecteerd door: {n}",
      "open_valve": "Kraan openen",
      "close_valve": "Kraan sluiten",
      "flow": "Debiet",
      "today": "Vandaag",
      "index": "Meterstand",
      "cost": "Kosten",
      "variant_classic": "Klassiek (gele balggasmeter)",
      "variant_modern": "Modern (grijze meter, gele leiding)"
    },
    "pl": {
      "name": "Gazomierz",
      "idle": "Brak przepływu",
      "flowing": "Gaz płynie",
      "leak": "Wyciek gazu",
      "valve_closed": "Zawór zamknięty",
      "unavailable": "Niedostępny",
      "leak_detected": "Czujnik wykrył gaz",
      "leak_detected_by": "Gaz wykryty przez: {n}",
      "open_valve": "Otwórz zawór",
      "close_valve": "Zamknij zawór",
      "flow": "Zasilanie",
      "today": "Dzisiaj",
      "index": "Indeks",
      "cost": "Koszt",
      "variant_classic": "Klasyczny (żółty gazomierz miechowy)",
      "variant_modern": "Nowoczesny (szary gazomierz, żółta rura)"
    },
    "pt-BR": {
      "name": "Medidor de gás",
      "idle": "Sem vazão",
      "flowing": "Gás circulando",
      "leak": "Vazamento de gás",
      "valve_closed": "Válvula fechada",
      "unavailable": "Indisponível",
      "leak_detected": "Gás detectado pelo sensor",
      "leak_detected_by": "Gás detectado por: {n}",
      "open_valve": "Abrir válvula",
      "close_valve": "Fechar válvula",
      "flow": "Vazão",
      "today": "Hoje",
      "index": "Leitura",
      "cost": "Custo",
      "variant_classic": "Clássico (medidor de fole amarelo)",
      "variant_modern": "Moderno (medidor cinza, tubo amarelo)",
      "variant_belgian": "Belga (medidor comunicante G4, foto)"
    },
    "pt-PT": {
      "name": "Contador de gás",
      "idle": "Sem caudal",
      "flowing": "Gás a circular",
      "leak": "Fuga de gás",
      "valve_closed": "Válvula fechada",
      "unavailable": "Indisponível",
      "leak_detected": "Gás detetado pelo sensor",
      "leak_detected_by": "Gás detetado por: {n}",
      "open_valve": "Abrir válvula",
      "close_valve": "Fechar válvula",
      "flow": "Caudal",
      "today": "Hoje",
      "index": "Índice",
      "cost": "Custo",
      "variant_classic": "Clássico (contador de fole amarelo)",
      "variant_modern": "Moderno (contador cinzento, tubo amarelo)",
      "variant_belgian": "Belga (contador comunicante G4, fotografia)"
    },
    "ro": {
      "name": "Contor de gaz",
      "idle": "Fără consum",
      "flowing": "Gaz în consum",
      "leak": "Scurgere de gaz",
      "valve_closed": "Robinet închis",
      "unavailable": "Indisponibil",
      "leak_detected": "Gaz detectat de senzor",
      "leak_detected_by": "Gaz detectat de: {n}",
      "open_valve": "Deschide robinetul",
      "close_valve": "Închide robinetul",
      "flow": "Debit",
      "today": "Azi",
      "index": "Index",
      "cost": "Cost"
    },
    "ru": {
      "name": "Счётчик газа",
      "idle": "Нет расхода",
      "flowing": "Газ идёт",
      "leak": "Утечка газа",
      "valve_closed": "Кран закрыт",
      "unavailable": "Недоступно",
      "leak_detected": "Датчик обнаружил газ",
      "leak_detected_by": "Газ обнаружен датчиком: {n}",
      "open_valve": "Открыть кран",
      "close_valve": "Закрыть кран",
      "flow": "Расход",
      "today": "Сегодня",
      "index": "Показания",
      "cost": "Стоимость",
      "variant_classic": "Классический (жёлтый мембранный счётчик)",
      "variant_modern": "Современный (серый счётчик, жёлтая труба)",
      "variant_belgian": "Бельгийский (умный счётчик G4, фото)"
    },
    "sr": {
      "name": "Гасомер",
      "idle": "Нема протока",
      "flowing": "Проток гаса",
      "leak": "Цурење гаса",
      "valve_closed": "Вентил затворен",
      "unavailable": "Недоступно",
      "leak_detected": "Сензор је детектовао гас",
      "leak_detected_by": "Гас детектовао: {n}",
      "open_valve": "Отвори вентил",
      "close_valve": "Затвори вентил",
      "flow": "Проток",
      "today": "Данас",
      "index": "Стање",
      "cost": "Трошак",
      "variant_classic": "Класични (жути мембрански гасомер)",
      "variant_modern": "Модерни (сиви гасомер, жута цев)"
    },
    "sr-Latn": {
      "name": "Gasomer",
      "idle": "Nema protoka",
      "flowing": "Protok gasa",
      "leak": "Curenje gasa",
      "valve_closed": "Ventil zatvoren",
      "unavailable": "Nedostupno",
      "leak_detected": "Senzor je detektovao gas",
      "leak_detected_by": "Gas detektovao: {n}",
      "open_valve": "Otvori ventil",
      "close_valve": "Zatvori ventil",
      "flow": "Protok",
      "today": "Danas",
      "index": "Stanje",
      "cost": "Trošak",
      "variant_classic": "Klasični (žuti membranski gasomer)",
      "variant_modern": "Moderni (sivi gasomer, žuta cev)"
    },
    "uk": {
      "name": "Лічильник газу",
      "idle": "Немає потоку",
      "flowing": "Газ тече",
      "leak": "Витік газу",
      "valve_closed": "Кран зачинено",
      "unavailable": "Недоступно",
      "leak_detected": "Датчик виявив газ",
      "leak_detected_by": "Газ виявлено: {n}",
      "open_valve": "Відкрити кран",
      "close_valve": "Закрити кран",
      "flow": "Витрата",
      "today": "Сьогодні",
      "index": "Показання",
      "cost": "Вартість",
      "variant_classic": "Класичний (жовтий мембранний лічильник)",
      "variant_modern": "Сучасний (сірий лічильник, жовта труба)",
      "variant_belgian": "Бельгійський (комунікаційний лічильник G4, фото)"
    }
  };
  const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []); // entity_leak : string ou array → array
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--gm-ok:var(--appliance-ok-color,#43a047);--gm-gas:var(--appliance-gas-color,#f5a623);
  --gm-alert:var(--appliance-alert-color,#db4437);--spd:1s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.flowing .badge{background:color-mix(in srgb,var(--gm-gas) 22%,transparent);color:var(--gm-gas)}
.leak .badge{background:color-mix(in srgb,var(--gm-alert) 22%,transparent);color:var(--gm-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--gm-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer}
.ctl{display:flex;justify-content:center;margin-top:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button.closed{background:color-mix(in srgb,var(--gm-alert) 20%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
/* illustration_position: left | right : dessin sur un côté, tuiles de l'autre côté en 2 colonnes (attribut illus-pos posé par applianceSize) */
:host([illus-pos]) ha-card{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:8px;row-gap:0;align-items:start}
:host([illus-pos]) .head{grid-column:1/-1;grid-row:1}
:host([illus-pos]) svg{grid-row:2;align-self:start;justify-self:center;margin:6px 0 0;width:100%}
:host([illus-pos="left"]) svg{grid-column:1}:host([illus-pos="right"]) svg{grid-column:2}
:host([illus-pos]) .tiles{grid-row:2;margin-top:6px;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}
:host([illus-pos="left"]) .tiles{grid-column:2}:host([illus-pos="right"]) .tiles{grid-column:1}
:host([illus-pos]) .alert{grid-column:1/-1;grid-row:3;margin-top:6px}
:host([illus-pos]) .ctl{grid-column:1/-1;grid-row:4}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--gm-alert)}
/* ---- illustration ---- */
.gm-wheel{transform-box:fill-box;transform-origin:50% 50%}
.flowing .gm-wheel,.moving .gm-wheel{animation:gmrot var(--spd) linear infinite}
.gm-flame{transform-box:fill-box;transform-origin:50% 100%;opacity:.25;transition:opacity .4s}
.flowing .gm-flame,.moving .gm-flame{opacity:1;animation:gmflame calc(var(--spd) * .6) ease-in-out infinite alternate}
.gm-alert{opacity:0}.leak .gm-alert{opacity:1;animation:gmblink 1s ease-in-out infinite}
.gm-valve{fill:#2b9af9;transition:transform .4s,fill .3s;transform-box:fill-box;transform-origin:50% 100%}
.valve_closed .gm-valve{fill:#db4437;transform:rotate(90deg)}
.gm-chev{fill:#887f17;transition:opacity .3s}
.flowing .gm-chev,.moving .gm-chev{animation:gmchev calc(var(--spd) * 1.5) ease-in-out infinite}
.gm-pv{fill:#db4437;opacity:0;transition:opacity .3s}.valve_closed .gm-pv{opacity:.75}
.leak .gm-lcd{fill:#ffb4ab}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .gm-wheel,.noanim .gm-flame,.noanim .gm-alert,.noanim .gm-chev{animation:none}
@keyframes gmrot{to{transform:rotate(360deg)}}
@keyframes gmflame{from{transform:scale(.85,.9)}to{transform:scale(1.05,1.1)}}
@keyframes gmblink{50%{opacity:.3}}
@keyframes gmchev{0%,100%{opacity:.25}50%{opacity:1}}
`;

  const SVG = (label) => `<svg viewBox="0 22 120 104" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="gmsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="gmbody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffd54f"/><stop offset=".55" stop-color="#f2b705"/><stop offset="1" stop-color="#b78400"/></linearGradient>
    <linearGradient id="gmpipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#b6bec6"/><stop offset="1" stop-color="#7f8891"/></linearGradient>
    <radialGradient id="gmglass" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="120" rx="48" ry="5" fill="url(#gmsh)"/>
    <!-- tuyaux d'arrivée (gauche) et de départ (droite) -->
    <rect x="8" y="30" width="10" height="32" fill="url(#gmpipe)"/><rect x="102" y="30" width="10" height="32" fill="url(#gmpipe)"/>
    <rect x="5" y="26" width="16" height="6" rx="2" fill="#8d959e"/><rect x="99" y="26" width="16" height="6" rx="2" fill="#8d959e"/>
    <!-- vanne d'arrêt sur le tuyau d'arrivée -->
    <rect x="10.5" y="44" width="5" height="8" rx="1" fill="#8d959e"/><rect class="gm-valve" x="3" y="40" width="20" height="5" rx="2.5"/>
    <!-- corps du compteur -->
    <rect x="16" y="56" width="88" height="62" rx="9" fill="url(#gmbody)" stroke="#7a5a00" stroke-width="1"/>
    <rect x="22" y="62" width="76" height="22" rx="4" fill="#f4f7fb" stroke="#7a5a00" stroke-width=".6"/>
    <text x="28" y="70" font-size="4.4" fill="#7a5a00" font-family="sans-serif" font-weight="700">GAZ</text>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${28 + i * 8.4}" y="72" width="7.4" height="9" fill="#111"/><text class="gm-d" x="${(31.7 + i * 8.4).toFixed(1)}" y="79.2" text-anchor="middle" font-size="7.6" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    ${[0, 1, 2].map((i) => `<rect x="${71 + i * 7.6}" y="72" width="6.8" height="9" fill="#b71c1c"/><text class="gm-l" x="${(74.4 + i * 7.6).toFixed(1)}" y="79.2" text-anchor="middle" font-size="7.2" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <!-- roue de contrôle -->
    <circle cx="32" cy="101" r="9" fill="#fff" stroke="#7a5a00" stroke-width=".8"/>
    <g class="gm-wheel"><path d="M32 101v-7.5" stroke="#b71c1c" stroke-width="1.6" stroke-linecap="round"/><circle cx="32" cy="101" r="1.6" fill="#7a5a00"/></g>
    <!-- flamme -->
    <g class="gm-flame"><path d="M78 112c-9-6-11-13-6-22 1 4 3 5 5 6-1-6 1-11 6-15 0 6 3 8 5 12 3 6 1 14-10 19z" fill="#ff7a00"/><path d="M79 112c-5-3-6-8-3-13 1 2 2 3 3 3 0-3 1-5 3-7 0 3 2 5 3 7 1 5-2 8-6 10z" fill="#ffd54f"/></g>
    <rect x="22" y="62" width="76" height="56" rx="4" fill="url(#gmglass)" opacity=".5"/>
    <g class="gm-alert"><circle cx="100" cy="46" r="9" fill="#e53935"/><path d="M100 40v7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="100" cy="51" r="1.3" fill="#fff"/></g>
  </svg>`;

  // variante « modern » : dessin de Ppatou (#267). Chevrons animés selon le débit, roue qui tourne, voile rouge sur le tuyau si la vanne est fermée
  const chev = (x, y, i) => `<polygon class="gm-chev" style="animation-delay:calc(var(--spd) * ${(i * 0.25).toFixed(2)})" points="${[[163, 12], [0, 82], [0, 52], [129, -2], [0, -55], [0, -85], [163, -16]].map(([dx, dy]) => `${x + dx},${y + dy}`).join(' ')}"/>`;
  const SVG_MODERN = (label) => `<svg viewBox="250 400 3000 2860" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="gmm0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 .916467 0 84)" cx="1756" cy="1002" r="229"><stop offset="0" stop-color="#fefefe"/><stop offset="1" stop-color="#ebd600"/></radialGradient>
    <radialGradient id="gmm1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 .916464 0 84)" cx="858" cy="1002" r="229"><stop offset="0" stop-color="#fefefe"/><stop offset="1" stop-color="#ebd600"/></radialGradient>
    <radialGradient id="gmm2" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1 0 0 .916464 0 84)" cx="2651" cy="1002" r="229"><stop offset="0" stop-color="#fefefe"/><stop offset="1" stop-color="#ebd600"/></radialGradient>
    <radialGradient id="gmmsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="1760" cy="3190" rx="1100" ry="70" fill="url(#gmmsh)"/>
    <polygon fill="gray" points="2231,1731 1359,1722 1312,1792 959,1792 711,1904 711,2879 825,3108 2676,3108 2803,2885 2812,1841 2723,1840 2701,1797 2281,1797"/>
    <path fill="#ccc" d="M1026 1893l1483 0c144,402 133,803 0,1188l-1483 0c-167,-413 -163,-795 0,-1188z"/>
    <rect fill="#4d4d4d" x="1004" y="2032" width="1490" height="383" rx="89" ry="48"/>
    <text class="gm-lcd" x="1749" y="2316" text-anchor="middle" fill="#fff" font-size="256" font-family="Arial,Helvetica,sans-serif"></text>
    <rect fill="#d3d2d8" x="1639" y="1393" width="306" height="219" rx="25"/><rect fill="#7f7e75" x="1396" y="1393" width="241" height="219" rx="20" ry="25"/>
    <rect fill="#5d5956" x="1949" y="1393" width="175" height="219" rx="14" ry="25"/><rect fill="#a5a6a1" x="1450" y="1617" width="621" height="102" rx="8" ry="18"/>
    <rect fill="#bcbcbe" x="1375" y="1338" width="770" height="56" rx="10"/>
    <rect fill="url(#gmm0)" x="1400" y="675" width="712" height="652" rx="73"/>
    <rect fill="url(#gmm1)" x="317" y="838" width="1082" height="326" rx="111" ry="36"/><rect fill="url(#gmm2)" x="2110" y="838" width="1082" height="326" rx="111" ry="36"/>
    <rect class="gm-pv" x="317" y="838" width="1082" height="326" rx="111" ry="36"/>
    ${[452, 791, 1131].map((x, i) => chev(x, 1000, i)).join('')}${[2247, 2586, 2925].map((x, i) => chev(x, 1000, i + 3)).join('')}
    <circle fill="#fff" stroke="gray" stroke-width="29" cx="1704" cy="2727" r="218"/>
    <g class="gm-wheel"><path fill="red" d="M1705 2729l-189 -109c39,-67 111,-109 189,-109l0 218z"/><path fill="red" d="M1704 2728l189 108c-39,68 -110,110 -188,110l-1 -218z"/></g>
    <g class="gm-alert"><circle cx="2960" cy="560" r="170" fill="#e53935"/><path d="M2960 450v130" stroke="#fff" stroke-width="40" stroke-linecap="round"/><circle cx="2960" cy="650" r="24" fill="#fff"/></g>
  </svg>`;

  // variante « belgian » : compteur communicant G4 belge (photo détourée, #559), tuyau jaune à chevrons animés, roue de contrôle qui tourne, LCD recouvert par l'index
  const BELGIAN_IMG = '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';
  const bch = (x, y, i) => `<polygon class="gm-chev" style="animation-delay:calc(var(--spd) * ${(i * 0.25).toFixed(2)})" points="${[[0, -6], [14, 0], [0, 6], [0, 3], [9, 0], [0, -3]].map(([dx, dy]) => `${x + dx},${y + dy}`).join(' ')}"/>`;
  const SVG_BELGIAN = (label) => `<svg viewBox="0 0 224 222" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="gmb0" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fefefe"/><stop offset="1" stop-color="#ebd600"/></radialGradient>
    <radialGradient id="gmbsh"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="112" cy="220" rx="76" ry="3" fill="url(#gmbsh)"/>
    <image href="data:image/webp;base64,${BELGIAN_IMG}" x="38" y="49" width="148" height="173"/>
    <rect fill="url(#gmb0)" x="1" y="14" width="83" height="25" rx="4"/><rect fill="url(#gmb0)" x="140" y="14" width="83" height="25" rx="4"/><rect fill="url(#gmb0)" x="85" y="1" width="54" height="49" rx="4"/>
    <rect class="gm-pv" x="1" y="14" width="83" height="25" rx="4"/>
    ${[12, 40, 68].map((x, i) => bch(x, 26, i)).join('')}${[147, 175, 203].map((x, i) => bch(x, 26, i + 3)).join('')}
    <rect x="85" y="86" width="47" height="21" rx="2.5" fill="#3b3b3b"/>
    <text class="gm-lcd" data-w="42" data-max="9" x="108.5" y="100" text-anchor="middle" fill="#fff" font-size="8" font-family="Arial,Helvetica,sans-serif"></text>
    <circle cx="111" cy="117" r="7.5" fill="#fff" stroke="#8a8a8a" stroke-width="1.3"/>
    <g class="gm-wheel"><path d="M111 117V109.5A7.5 7.5 0 0 1 118.5 117Z" fill="#e53935"/><path d="M111 117V124.5A7.5 7.5 0 0 1 103.5 117Z" fill="#e53935"/></g>
    <g class="gm-alert"><circle cx="208" cy="62" r="10" fill="#e53935"/><path d="M208 56v7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="208" cy="67" r="1.4" fill="#fff"/></g>
  </svg>`;

  const TILES = [['flow', 'mdi:fire', 'show_flow'], ['today', 'mdi:calendar-today', 'show_today'], ['index', 'mdi:counter', 'show_index'], ['cost', 'mdi:cash', 'show_cost']];

  class ApplianceGasMeterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), st = (i) => hass.states[i].attributes || {};
      return {
        entity_index: ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'gas' && st(i).state_class === 'total_increasing') || ids.find((i) => i.startsWith('sensor.') && st(i).device_class === 'gas') || '',
        entity_leak: ids.find((i) => i.startsWith('binary_sensor.') && st(i).device_class === 'gas') || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_flow: true, show_today: true, show_index: true, show_cost: true, flow_threshold: 0.01, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 20000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="gmtitle"></div><div class="badge" id="gmbadge"></div></div>
        ${(this._c.variant === 'belgian' ? SVG_BELGIAN : this._c.variant === 'modern' ? SVG_MODERN : SVG)(this._c.name || this._t('name'))}
        <div class="alert" id="gmalert"></div>
        <div class="ctl" id="gmctl"><button><ha-icon icon="mdi:valve"></ha-icon><span></span></button></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_index || this._c.entity_flow));
      root.querySelector('#gmctl button').addEventListener('click', () => {
        const id = this._c.entity_valve; if (!this._hass || !id) return;
        const dom = id.split('.')[0];
        const run = () => this._hass.callService(['switch', 'valve', 'input_boolean'].includes(dom) ? dom : 'homeassistant', 'toggle', { entity_id: id });
        // confirmation avant d'ouvrir / fermer la vanne de gaz (désactivable : confirm_actions: false)
        if (this._c.confirm_actions !== false && window.applianceConfirm) window.applianceConfirm(this, { action: 'toggle', confirmation: true }, run); else run();
      });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ flow: c.entity_flow || c.entity_index, today: c.entity_today, index: c.entity_index, cost: c.entity_cost }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, now = Date.now();
      const idx = this._num(c.entity_index);
      // débit : capteur dédié, sinon déduit de l'index (unité de l'index par heure)
      let flow = this._num(c.entity_flow);
      if (!c.entity_flow && !isNaN(idx)) {
        // horodatage = last_changed de l'index (pas l'heure où la carte l'a vu) : pas de pic au chargement de la page
        const is = this._st(c.entity_index), at = (is && Date.parse(is.last_changed)) || now;
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = at; this._dflow = 0; }
        else if (idx !== this._lastIdx) {
          const h = Math.max(.001, (at - this._lastAt) / 3600000);
          this._dflow = idx > this._lastIdx ? (idx - this._lastIdx) / h : 0;
          this._lastIdx = idx; this._lastAt = at;
        } else if (now - this._lastAt > 10 * 60000) this._dflow = 0;
        flow = this._dflow;
      }
      const moving = !isNaN(flow) && flow > (Number(c.flow_threshold) || 0);
      // détecteurs de gaz : un ou plusieurs ; « fuite » dès qu'au moins un est déclenché
      const leakIds = asList(c.entity_leak), leakS = leakIds.some((i) => this._st(i));
      const wet = leakIds.filter((i) => { const s = this._st(i); return !!s && /^(on|wet|leak|detected|gas|true)$/i.test(String(s.state)); });
      const valveS = this._st(c.entity_valve), valveClosed = !!valveS && /^(off|closed|closing)$/i.test(String(valveS.state));
      const anyId = [c.entity_index, c.entity_flow, c.entity_today].filter(Boolean);
      const usable = anyId.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      const st = !usable && !leakS ? 'unavailable' : wet.length ? 'leak' : valveClosed ? 'valve_closed' : moving ? 'flowing' : 'idle';
      return { st, idx, flow, moving, wet, valveS, valveClosed };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, idx, flow, moving, wet, valveS, valveClosed } = this._compute();
      card.className = `${st}${moving ? ' moving' : ''}${c.animations === false ? ' noanim' : ''}`;
      // vitesse de la roue et de la flamme : plus le débit est fort, plus elles vont vite (bornée)
      // le débit est ramené en unité d'index par heure (L/min → m³/h : ×60 ÷1000), sinon la roue s'emballe avec des L/min
      const fu0 = this._unit(c.entity_flow, ''), perH = /\/\s*min/i.test(fu0) ? 60 : /\/\s*s$/i.test(fu0) ? 3600 : 1, inM3 = /^(l|litres?|liters?)\s*\//i.test(fu0) ? 1e-3 : 1;
      card.style.setProperty('--spd', `${Math.max(.3, Math.min(4, 1.2 / Math.max(.05, (flow || 0) * perH * inM3))).toFixed(2)}s`);
      // totalisateur : 5 chiffres entiers et 3 décimales
      // chiffres tirés d'un entier arrondi (en millièmes) : pas d'erreur de virgule flottante (873.29 ≠ 873.289)
      const base = isNaN(idx) ? 0 : Math.max(0, idx), milli = Math.round(base * 1000), whole = Math.floor(milli / 1000);
      const ent = String(whole % 100000).padStart(5, '0'), dec = String(milli % 1000).padStart(3, '0');
      const lcd = r.querySelector('.gm-lcd');
      if (lcd) { // variante moderne : « 123,456 m³ », police réduite si le texte est long
        const txt = `${base.toLocaleString(window.applianceLocale(c, this._hass), { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: false })} ${this._unit(c.entity_index, 'm³')}`.trim();
        lcd.textContent = txt; lcd.setAttribute('font-size', String(Math.round(Math.min(Number(lcd.dataset.max) || 256, (Number(lcd.dataset.w) || 1400) / (txt.length * 0.56)))));
      }
      r.querySelectorAll('.gm-d').forEach((el, i) => { el.textContent = ent[i]; });
      r.querySelectorAll('.gm-l').forEach((el, i) => { el.textContent = dec[i]; });

      const iu = this._unit(c.entity_index, 'm³'), fu = this._unit(c.entity_flow, `${iu}/h`);
      r.getElementById('gmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('gmbadge');
      badge.textContent = st === 'flowing' ? `${this._fmt(flow, 2)} ${fu}` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('gmalert');
      const names = wet.map((i) => this._st(i)?.attributes?.friendly_name || i).join(', ');
      al.textContent = wet.length ? (names ? this._t('leak_detected_by').replace('{n}', names) : this._t('leak_detected')) : '';
      al.classList.toggle('on', !!al.textContent);

      const ctl = r.getElementById('gmctl'), btn = ctl.querySelector('button');
      ctl.classList.toggle('hide', !c.entity_valve);
      btn.classList.toggle('closed', valveClosed);
      btn.querySelector('span').textContent = this._t(valveClosed ? 'open_valve' : 'close_valve');
      btn.disabled = !valveS;

      const V = {
        flow: [c.entity_flow || c.entity_index, isNaN(flow) ? '--' : this._fmt(flow, 2), fu],
        today: [c.entity_today, this._fmt(this._num(c.entity_today), 2), this._unit(c.entity_today, iu)],
        index: [c.entity_index, this._fmt(idx, 3), iu],
        cost: [c.entity_cost, this._fmt(this._num(c.entity_cost), 2), this._unit(c.entity_cost, '€')],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'flow' && st === 'leak');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceGasMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceGasMeterCardEditor extends HTMLElement {
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
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = { ...T.en, ...T[window.applianceLang(T, null, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass;
      this._form.data = { ...this._c, entity_leak: asList(this._c && this._c.entity_leak) }; // le form attend un array
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'variant', selector: { select: { mode: 'dropdown', options: [{ value: 'classic', label: tr.variant_classic }, { value: 'modern', label: tr.variant_modern }, { value: 'belgian', label: tr.variant_belgian }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        { name: 'illustration_position', selector: { select: { mode: 'dropdown', options: ['center', 'left', 'right'].map((value) => ({ value, label: window.applianceEditorLabel('illus_pos_' + value, this._hass) })) } } },
        ...window.applianceTileFields(this._hass),
        ent('entity_index', 'sensor'), ent('entity_flow', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']),
        ent('entity_leak', ['binary_sensor', 'input_boolean'], { multiple: true }), ent('entity_valve', ['valve', 'switch', 'input_boolean']),
        { type: 'grid', name: '', schema: [num('flow_threshold', 0, 5, 0.01, 0.01)] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_flow'), bool('show_today'), bool('show_index'), bool('show_cost'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceGasMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Compteur de gaz animé : totalisateur, débit, consommation du jour, coût, détecteur(s) de gaz et vanne d'arrêt.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
