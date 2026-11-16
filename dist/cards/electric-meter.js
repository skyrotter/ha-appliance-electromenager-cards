/* Carte « Compteur électrique » — custom:appliance-electric-meter-card
 * Compteur à disque : disque rotatif qui tourne selon la puissance, LED d'impulsion qui clignote, totalisateur kWh
 * (5 chiffres + 1 décimale rouge). Tous les capteurs sont optionnels : puissance (W, kW, MW), index (Wh, kWh, MWh),
 * consommation du jour, coût, tarif en cours, puissance par phase (L1 / L2 / L3), puissance souscrite (kVA).
 * Sans capteur de puissance, la puissance est déduite des variations de l'index.
 * Au-dessus de subscribed_power : état « Dépassement » (bandeau d'alerte).
 * model: sagemcom_xs212 : compteur belge à port P1 (Sagemcom / Siconia XS212, photo détourée) dont l'écran LCD fait défiler les index
 * (import / export, tarifs 1 et 2, puissance, tension, courant) ; capteurs P1 (HomeWizard…) : entity_import_t1 / t2, entity_export_t1 / t2,
 * entity_export, entity_peak (pointe du mois), entity_avg, entity_voltage, entity_current, entity_battery.
 */
(() => {
  const TAG = 'appliance-electric-meter-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Electric meter",
      "idle": "No flow",
      "consuming": "Consuming",
      "overload": "Overload",
      "unavailable": "Unavailable",
      "overload_alert": "Power above the subscribed power ({n} kVA)",
      "power": "Power",
      "today": "Today",
      "index": "Index",
      "cost": "Cost",
      "tariff": "Tariff",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3",
      "import_t1": "Import T1",
      "import_t2": "Import T2",
      "export_t1": "Export T1",
      "export_t2": "Export T2",
      "export": "Export",
      "peak": "Peak (month)",
      "avg": "Average demand",
      "voltage": "Voltage",
      "current": "Current",
      "battery": "Batteries"
    },
    "cs": {
      "name": "Elektroměr",
      "idle": "Bez odběru",
      "consuming": "Odběr",
      "overload": "Přetížení",
      "unavailable": "Nedostupné",
      "overload_alert": "Výkon nad rezervovaným příkonem ({n} kVA)",
      "power": "Výkon",
      "today": "Dnes",
      "index": "Stav",
      "cost": "Cena",
      "tariff": "Tarif",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "da": {
      "name": "Elmåler",
      "idle": "Intet forbrug",
      "consuming": "Forbruger",
      "overload": "Overbelastning",
      "unavailable": "Utilgængelig",
      "overload_alert": "Effekt over den abonnerede effekt ({n} kVA)",
      "power": "Effekt",
      "today": "I dag",
      "index": "Indeks",
      "cost": "Pris",
      "tariff": "Tarif",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "de": {
      "name": "Stromzähler",
      "idle": "Kein Verbrauch",
      "consuming": "Verbrauch läuft",
      "overload": "Überlast",
      "unavailable": "Nicht verfügbar",
      "overload_alert": "Leistung über der vertraglichen Leistung ({n} kVA)",
      "power": "Leistung",
      "today": "Heute",
      "index": "Zählerstand",
      "cost": "Kosten",
      "tariff": "Tarif",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "es": {
      "name": "Contador eléctrico",
      "idle": "Sin consumo",
      "consuming": "Consumiendo",
      "overload": "Sobrecarga",
      "unavailable": "No disponible",
      "overload_alert": "Potencia por encima de la contratada ({n} kVA)",
      "power": "Potencia",
      "today": "Hoy",
      "index": "Índice",
      "cost": "Coste",
      "tariff": "Tarifa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "fr": {
      "name": "Compteur électrique",
      "idle": "Pas de consommation",
      "consuming": "Consommation en cours",
      "overload": "Dépassement",
      "unavailable": "Indisponible",
      "overload_alert": "Puissance supérieure à la puissance souscrite ({n} kVA)",
      "power": "Puissance",
      "today": "Aujourd'hui",
      "index": "Index",
      "cost": "Coût",
      "tariff": "Tarif",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3",
      "import_t1": "Import T1",
      "import_t2": "Import T2",
      "export_t1": "Export T1",
      "export_t2": "Export T2",
      "export": "Export",
      "peak": "Pointe du mois",
      "avg": "Demande moyenne",
      "voltage": "Tension",
      "current": "Courant",
      "battery": "Batteries"
    },
    "hu": {
      "name": "Villanyóra",
      "idle": "Nincs fogyasztás",
      "consuming": "Fogyaszt",
      "overload": "Túlterhelés",
      "unavailable": "Nem elérhető",
      "overload_alert": "Teljesítmény az előfizetett felett ({n} kVA)",
      "power": "Teljesítmény",
      "today": "Ma",
      "index": "Index",
      "cost": "Költség",
      "tariff": "Tarifa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3",
      "import_t1": "Import T1",
      "import_t2": "Import T2",
      "export_t1": "Export T1",
      "export_t2": "Export T2",
      "export": "Export",
      "peak": "Havi csúcs",
      "avg": "Átlagos igény",
      "voltage": "Feszültség",
      "current": "Áram",
      "battery": "Akkumulátorok"
    },
    "it": {
      "name": "Contatore elettrico",
      "idle": "Nessun consumo",
      "consuming": "In consumo",
      "overload": "Sovraccarico",
      "unavailable": "Non disponibile",
      "overload_alert": "Potenza superiore a quella impegnata ({n} kVA)",
      "power": "Potenza",
      "today": "Oggi",
      "index": "Indice",
      "cost": "Costo",
      "tariff": "Tariffa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "nb": {
      "name": "Strømmåler",
      "idle": "Ikke noe forbruk",
      "consuming": "Forbruk pågår",
      "overload": "Overbelastning",
      "unavailable": "Utilgjengelig",
      "overload_alert": "Effekt over abonnert effekt ({n} kVA)",
      "power": "Effekt",
      "today": "I dag",
      "index": "Målerstand",
      "cost": "Kostnad",
      "tariff": "Tariff",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "nl": {
      "name": "Elektriciteitsmeter",
      "idle": "Geen verbruik",
      "consuming": "Verbruik bezig",
      "overload": "Overbelasting",
      "unavailable": "Niet beschikbaar",
      "overload_alert": "Vermogen boven het gecontracteerde vermogen ({n} kVA)",
      "power": "Vermogen",
      "today": "Vandaag",
      "index": "Meterstand",
      "cost": "Kosten",
      "tariff": "Tarief",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "pl": {
      "name": "Licznik energii elektrycznej",
      "idle": "Brak przepływu",
      "consuming": "Pobór",
      "overload": "Przeciążenie",
      "unavailable": "Niedostępny",
      "overload_alert": "Moc powyżej mocy umownej ({n} kVA)",
      "power": "Moc",
      "today": "Dzisiaj",
      "index": "Indeks",
      "cost": "Koszt",
      "tariff": "Taryfa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "pt-BR": {
      "name": "Medidor de energia",
      "idle": "Sem consumo",
      "consuming": "Consumindo",
      "overload": "Sobrecarga",
      "unavailable": "Indisponível",
      "overload_alert": "Potência acima da demanda contratada ({n} kVA)",
      "power": "Potência",
      "today": "Hoje",
      "index": "Leitura",
      "cost": "Custo",
      "tariff": "Tarifa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3",
      "import_t1": "Importação T1",
      "import_t2": "Importação T2",
      "export_t1": "Exportação T1",
      "export_t2": "Exportação T2",
      "export": "Exportação",
      "peak": "Máxima (mês)",
      "avg": "Demanda média",
      "voltage": "Tensão",
      "current": "Corrente",
      "battery": "Baterias"
    },
    "pt-PT": {
      "name": "Contador elétrico",
      "idle": "Sem consumo",
      "consuming": "A consumir",
      "overload": "Sobrecarga",
      "unavailable": "Indisponível",
      "overload_alert": "Potência acima da potência contratada ({n} kVA)",
      "power": "Potência",
      "today": "Hoje",
      "index": "Índice",
      "cost": "Custo",
      "tariff": "Tarifa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3",
      "import_t1": "Importação T1",
      "import_t2": "Importação T2",
      "export_t1": "Exportação T1",
      "export_t2": "Exportação T2",
      "export": "Exportação",
      "peak": "Máximo (mês)",
      "avg": "Potência média",
      "voltage": "Tensão",
      "current": "Corrente",
      "battery": "Baterias"
    },
    "ro": {
      "name": "Contor electric",
      "idle": "Fără consum",
      "consuming": "Consum în curs",
      "overload": "Suprasarcină",
      "unavailable": "Indisponibil",
      "overload_alert": "Putere peste puterea abonată ({n} kVA)",
      "power": "Putere",
      "today": "Azi",
      "index": "Index",
      "cost": "Cost",
      "tariff": "Tarif",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "ru": {
      "name": "Электросчётчик",
      "idle": "Нет расхода",
      "consuming": "Идёт потребление",
      "overload": "Перегрузка",
      "unavailable": "Недоступно",
      "overload_alert": "Мощность выше заявленной ({n} кВА)",
      "power": "Мощность",
      "today": "Сегодня",
      "index": "Показания",
      "cost": "Стоимость",
      "tariff": "Тариф",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "sr": {
      "name": "Бројило електричне енергије",
      "idle": "Нема потрошње",
      "consuming": "Потрошња",
      "overload": "Преоптерећење",
      "unavailable": "Недоступно",
      "overload_alert": "Снага изнад одобрене снаге ({n} kVA)",
      "power": "Снага",
      "today": "Данас",
      "index": "Стање",
      "cost": "Трошак",
      "tariff": "Тарифа",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "sr-Latn": {
      "name": "Brojilo električne energije",
      "idle": "Nema potrošnje",
      "consuming": "Potrošnja",
      "overload": "Preopterećenje",
      "unavailable": "Nedostupno",
      "overload_alert": "Snaga iznad odobrene snage ({n} kVA)",
      "power": "Snaga",
      "today": "Danas",
      "index": "Stanje",
      "cost": "Trošak",
      "tariff": "Tarifa",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    },
    "uk": {
      "name": "Лічильник електроенергії",
      "idle": "Немає потоку",
      "consuming": "Споживає",
      "overload": "Перевантаження",
      "unavailable": "Недоступно",
      "overload_alert": "Потужність перевищує дозволену ({n} кВА)",
      "power": "Потужність",
      "today": "Сьогодні",
      "index": "Показання",
      "cost": "Вартість",
      "tariff": "Тариф",
      "l1": "L1",
      "l2": "L2",
      "l3": "L3"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // conversion en W (puissance) et en kWh (énergie) selon l'unité du capteur
  const PWR = { w: 1, kw: 1000, mw: 1e6, va: 1, kva: 1000 };
  const NRG = { wh: 1 / 1000, kwh: 1, mwh: 1000 };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--em-on:var(--appliance-power-color,#f5a623);--em-alert:var(--appliance-alert-color,#db4437);--spd:2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.consuming .badge{background:color-mix(in srgb,var(--em-on) 22%,transparent);color:var(--em-on)}
.overload .badge{background:color-mix(in srgb,var(--em-alert) 22%,transparent);color:var(--em-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--em-alert);font-weight:500;text-align:center}
.alert.on{display:block}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--em-alert)}
/* ---- illustration ---- */
.em-disc{transform-box:fill-box;transform-origin:50% 50%}
.consuming .em-disc,.overload .em-disc{animation:emrot var(--spd) linear infinite}
.em-led{fill:#5b1a1a;transition:fill .3s}
.consuming .em-led,.overload .em-led{fill:#ff3b30;animation:emled calc(var(--spd) * .5) steps(1) infinite}
.em-bolt{fill:#ffc107;opacity:.25;transition:opacity .4s}
.consuming .em-bolt{opacity:1;animation:emglow 1.4s ease-in-out infinite alternate}
.overload .em-bolt{fill:#e53935;opacity:1;animation:emblink 1s ease-in-out infinite}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.p1 svg{max-width:calc(150px * var(--illus-scale,1))}
.p1-lcd{font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;fill:#0f2610}
.p1-lcdbg{fill:url(#p1g)}.p1-glow{fill:#c8ff9a;opacity:0}
.consuming .p1-glow,.overload .p1-glow{animation:p1glow 3s ease-in-out infinite}
.p1-arrow{fill:#0f2610;opacity:0}.consuming .p1-arrow{opacity:.9;animation:emled 1.2s steps(1) infinite}
@keyframes p1glow{50%{opacity:.18}}
.noanim .em-disc,.noanim .em-led,.noanim .em-bolt,.noanim .p1-glow,.noanim .p1-arrow{animation:none}
@keyframes emrot{to{transform:rotate(360deg)}}
@keyframes emled{50%{fill:#5b1a1a}}
@keyframes emglow{to{opacity:.55}}
@keyframes emblink{50%{opacity:.3}}
`;

  const SVG = (label) => `<svg viewBox="0 18 120 108" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="emsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="embody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fdfdfd"/><stop offset=".6" stop-color="#dfe4ea"/><stop offset="1" stop-color="#aeb6bf"/></linearGradient>
    <radialGradient id="emdisc" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9aa4ae"/></radialGradient>
    <radialGradient id="emglass" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="60" cy="122" rx="44" ry="4.5" fill="url(#emsh)"/>
    <!-- bornes -->
    <rect x="34" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/><rect x="56" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/><rect x="78" y="112" width="8" height="8" rx="1.5" fill="#6d7680"/>
    <!-- boîtier -->
    <rect x="22" y="22" width="76" height="92" rx="10" fill="url(#embody)" stroke="#8a929b" stroke-width="1"/>
    <!-- totalisateur kWh : 5 chiffres + 1 décimale -->
    <rect x="32" y="30" width="56" height="14" rx="2.5" fill="#20252b"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${34 + i * 8.2}" y="32" width="7.4" height="10" fill="#111"/><text class="em-d" x="${(37.7 + i * 8.2).toFixed(1)}" y="40" text-anchor="middle" font-size="8" fill="#fff" font-family="monospace" font-weight="700">0</text>`).join('')}
    <rect x="75.4" y="32" width="7.4" height="10" fill="#b71c1c"/><text class="em-l" x="79.1" y="40" text-anchor="middle" font-size="8" fill="#fff" font-family="monospace" font-weight="700">0</text>
    <text x="85" y="40.5" font-size="4" fill="#fff" font-family="sans-serif">kWh</text>
    <!-- fenêtre du disque -->
    <circle cx="60" cy="72" r="22" fill="#2b3138"/><circle cx="60" cy="72" r="19" fill="url(#emdisc)"/>
    <g class="em-disc"><circle cx="60" cy="72" r="19" fill="none"/><path d="M60 72V54" stroke="#d32f2f" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="72" r="2.2" fill="#6d7680"/></g>
    <circle cx="60" cy="72" r="19" fill="url(#emglass)"/>
    <!-- éclair et LED d'impulsion -->
    <path class="em-bolt" d="M32 86l7-10h-4.5l3-9-8 11h4.5z"/>
    <circle class="em-led" cx="88" cy="94" r="3.2" stroke="#7a1313" stroke-width=".6"/>
    <text x="60" y="106" text-anchor="middle" font-size="5" fill="#6d7680" font-family="sans-serif" font-weight="700" letter-spacing=".8">1 imp/Wh</text>
  </svg>`;

  const P1_IMG = "data:image/webp;base64,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";
  const MODELS = { sagemcom_xs212: 'p1', sagemcom: 'p1', xs212: 'p1', siconia: 'p1', p1: 'p1' };
  // compteur belge (photo 276 × 420) : l'écran LCD vert est recouvert par notre propre texte, la LED d'impulsion clignote
  const SVG_P1 = (label) => `<svg viewBox="0 0 276 420" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="p1g" x1="0" x2="1"><stop offset="0" stop-color="#4f9150"/><stop offset="1" stop-color="#46893f"/></linearGradient></defs>
    <image href="${P1_IMG}" x="0" y="0" width="276" height="420"/>
    <rect class="p1-lcdbg" x="80" y="47" width="119" height="49" rx="2"/><rect class="p1-glow" x="80" y="47" width="119" height="49" rx="2"/>
    <text class="p1-lcd" id="p1l1" x="84" y="66" font-size="19">1.8.0</text>
    <text class="p1-lcd" id="p1l2" x="84" y="90" font-size="19" textLength="106" lengthAdjust="spacingAndGlyphs"></text>
    <path class="p1-arrow" d="M188 52l5 7h-10z"/>
    <circle class="em-led" cx="208" cy="55" r="4.2" stroke="#7a1313" stroke-width=".8"/>
  </svg>`;

  const TILES = [['power', 'mdi:flash', 'show_power'], ['today', 'mdi:calendar-today', 'show_today'], ['index', 'mdi:counter', 'show_index'], ['cost', 'mdi:cash', 'show_cost'],
    ['tariff', 'mdi:tag-outline', 'show_tariff'], ['l1', 'mdi:numeric-1-box-outline', 'show_phases'], ['l2', 'mdi:numeric-2-box-outline', 'show_phases'], ['l3', 'mdi:numeric-3-box-outline', 'show_phases'],
    ['import_t1', 'mdi:transmission-tower-import', 'show_tariffs'], ['import_t2', 'mdi:transmission-tower-import', 'show_tariffs'],
    ['export_t1', 'mdi:transmission-tower-export', 'show_tariffs'], ['export_t2', 'mdi:transmission-tower-export', 'show_tariffs'], ['export', 'mdi:transmission-tower-export', 'show_tariffs'],
    ['peak', 'mdi:chart-bell-curve-cumulative', 'show_peak'], ['avg', 'mdi:chart-line', 'show_peak'],
    ['voltage', 'mdi:sine-wave', 'show_electrics'], ['current', 'mdi:current-ac', 'show_electrics'], ['battery', 'mdi:home-battery-outline', 'show_battery']];
  // option d'entité de chaque tuile (par défaut entity_<clé>)
  const TILE_ENT = { power: (c) => c.entity_power || c.entity_index, l1: (c) => c.entity_power_l1, l2: (c) => c.entity_power_l2, l3: (c) => c.entity_power_l3 };

  class ApplianceElectricMeterCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {}), st = (i) => hass.states[i].attributes || {};
      const s = (i) => i.startsWith('sensor.');
      return {
        entity_power: ids.find((i) => s(i) && st(i).device_class === 'power' && /(grid|house|total|mains|maison|reseau|réseau|compteur|meter)/i.test(i)) || ids.find((i) => s(i) && st(i).device_class === 'power') || '',
        entity_index: ids.find((i) => s(i) && st(i).device_class === 'energy' && st(i).state_class === 'total_increasing') || ids.find((i) => s(i) && st(i).device_class === 'energy') || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_power: true, show_today: true, show_index: true, show_cost: true, show_tariff: true, show_phases: true, show_tariffs: true, show_peak: true, show_electrics: true, show_battery: true, power_threshold: 5, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 20000); }
    disconnectedCallback() { clearInterval(this._tick); clearInterval(this._lcdTimer); this._lcdTimer = null; }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _p1() { return !!MODELS[String((this._c && this._c.model) || '').toLowerCase().replace(/[^a-z0-9_]/g, '')]; }
    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // une valeur du LCD (index = tour de rôle) : code OBIS en haut, valeur et unité dessous
    _lcdShow() {
      const r = this._root, it = this._lcd && this._lcd[(this._lcdI || 0) % this._lcd.length];
      if (!r || !it) return;
      const l1 = r.getElementById('p1l1'), l2 = r.getElementById('p1l2');
      if (l1 && l2) { l1.textContent = it[0]; l2.textContent = `${it[1].padStart(9, '0')} ${it[2]}`.slice(-14); }
    }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    // puissance en W et énergie en kWh, quelle que soit l'unité du capteur
    _watts(id) { const v = this._num(id); return isNaN(v) ? NaN : v * (PWR[this._unit(id, 'W').toLowerCase()] ?? 1); }
    _kwh(id) { const v = this._num(id); return isNaN(v) ? NaN : v * (NRG[this._unit(id, 'kWh').toLowerCase()] ?? 1); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _pw(w) { return isNaN(w) ? ['--', 'W'] : Math.abs(w) >= 10000 ? [this._fmt(w / 1000, 2), 'kW'] : [this._fmt(w, 0), 'W']; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card${this._p1() ? ' class="p1"' : ''}>
        <div class="head"><div class="title" id="emtitle"></div><div class="badge" id="embadge"></div></div>
        ${(this._p1() ? SVG_P1 : SVG)(this._c.name || this._t('name'))}
        <div class="alert" id="emalert"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_power || this._c.entity_index));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c, k = el.dataset.k; this._more(TILE_ENT[k] ? TILE_ENT[k](c) : c['entity_' + k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _compute() {
      const c = this._c, now = Date.now();
      const idx = this._kwh(c.entity_index);
      // puissance : capteur dédié, sinon déduite de l'index (kWh écoulés depuis le dernier changement)
      let power = this._watts(c.entity_power);
      if (!c.entity_power && !isNaN(idx)) {
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = now; this._dpower = 0; }
        else if (idx !== this._lastIdx) {
          const h = Math.max(.0003, (now - this._lastAt) / 3600000);
          this._dpower = idx > this._lastIdx ? (idx - this._lastIdx) * 1000 / h : 0;
          this._lastIdx = idx; this._lastAt = now;
        } else if (now - this._lastAt > 15 * 60000) this._dpower = 0;
        power = this._dpower;
      }
      const consuming = !isNaN(power) && power > (Number(c.power_threshold) || 0);
      const sub = Number(c.subscribed_power) * 1000, overload = sub > 0 && !isNaN(power) && power > sub;
      const anyId = [c.entity_power, c.entity_index, c.entity_today, c.entity_power_l1, c.entity_power_l2, c.entity_power_l3].filter(Boolean);
      const usable = anyId.some((i) => { const s = this._st(i); return s && !/^(unavailable|unknown)$/i.test(String(s.state)); });
      const st = !usable ? 'unavailable' : overload ? 'overload' : consuming ? 'consuming' : 'idle';
      return { st, idx, power, consuming };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, idx, power } = this._compute();
      card.className = `${st}${c.animations === false ? ' noanim' : ''}${this._p1() ? ' p1' : ''}`;
      // vitesse du disque : un tour en 2 s à 1 kW, bornée (plus la puissance est forte, plus il tourne vite)
      card.style.setProperty('--spd', `${Math.max(.25, Math.min(8, 2000 / Math.max(50, power || 0))).toFixed(2)}s`);
      // totalisateur : 5 chiffres de kWh + 1 décimale
      const base = isNaN(idx) ? 0 : Math.max(0, idx), whole = Math.floor(base);
      const ent = String(whole % 100000).padStart(5, '0'), dec = String(Math.floor((base - whole) * 10));
      r.querySelectorAll('.em-d').forEach((el, i) => { el.textContent = ent[i]; });
      r.querySelectorAll('.em-l').forEach((el) => { el.textContent = dec; });

      r.getElementById('emtitle').textContent = c.name || this._t('name');
      const [pv, pu] = this._pw(power);
      const badge = r.getElementById('embadge');
      badge.textContent = st === 'consuming' || st === 'overload' ? `${pv} ${pu}` : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('emalert');
      al.textContent = st === 'overload' ? this._t('overload_alert').replace('{n}', this._fmt(Number(c.subscribed_power), 1)) : '';
      al.classList.toggle('on', !!al.textContent);

      const tariff = this._st(c.entity_tariff), ph = (id) => this._pw(this._watts(id));
      const V = {
        power: [c.entity_power || c.entity_index, pv, pu],
        today: [c.entity_today, this._fmt(this._kwh(c.entity_today), 2), 'kWh'],
        index: [c.entity_index, this._fmt(idx, 1), 'kWh'],
        cost: [c.entity_cost, this._fmt(this._num(c.entity_cost), 2), this._unit(c.entity_cost, '€')],
        tariff: [c.entity_tariff, tariff ? String(tariff.state) : '--', ''],
        l1: [c.entity_power_l1, ...ph(c.entity_power_l1)], l2: [c.entity_power_l2, ...ph(c.entity_power_l2)], l3: [c.entity_power_l3, ...ph(c.entity_power_l3)],
        // compteur P1 : index par tarif (1 = plein, 2 = réduit), import / export, pointe du mois, tension, courant, batteries
        import_t1: [c.entity_import_t1, this._fmt(this._kwh(c.entity_import_t1), 2), 'kWh'], import_t2: [c.entity_import_t2, this._fmt(this._kwh(c.entity_import_t2), 2), 'kWh'],
        export_t1: [c.entity_export_t1, this._fmt(this._kwh(c.entity_export_t1), 2), 'kWh'], export_t2: [c.entity_export_t2, this._fmt(this._kwh(c.entity_export_t2), 2), 'kWh'],
        export: [c.entity_export, this._fmt(this._kwh(c.entity_export), 2), 'kWh'],
        peak: [c.entity_peak, ...ph(c.entity_peak)], avg: [c.entity_avg, ...ph(c.entity_avg)],
        voltage: [c.entity_voltage, this._fmt(this._num(c.entity_voltage), 0), this._unit(c.entity_voltage, 'V')], current: [c.entity_current, this._fmt(this._num(c.entity_current), 2), this._unit(c.entity_current, 'A')],
        battery: [c.entity_battery, ...ph(c.entity_battery)],
      };
      // écran LCD du compteur P1 : fait défiler les valeurs disponibles (code OBIS + valeur)
      if (this._p1()) {
        const k3 = (id) => { const v = this._kwh(id); return isNaN(v) ? null : v.toFixed(3); };
        const imp = c.entity_index || null, items = [
          [imp && '1.8.0', imp && k3(imp), 'kWh'], [c.entity_import_t1 && '1.8.1', k3(c.entity_import_t1), 'kWh'], [c.entity_import_t2 && '1.8.2', k3(c.entity_import_t2), 'kWh'],
          [c.entity_export && '2.8.0', k3(c.entity_export), 'kWh'], [c.entity_export_t1 && '2.8.1', k3(c.entity_export_t1), 'kWh'], [c.entity_export_t2 && '2.8.2', k3(c.entity_export_t2), 'kWh'],
          [c.entity_power && '1.7.0', isNaN(power) ? null : (power / 1000).toFixed(3), 'kW'],
          [c.entity_voltage && '32.7', isNaN(this._num(c.entity_voltage)) ? null : this._num(c.entity_voltage).toFixed(1), 'V'],
          [c.entity_current && '31.7', isNaN(this._num(c.entity_current)) ? null : this._num(c.entity_current).toFixed(2), 'A'],
        ].filter((i) => i[0] && i[1] != null);
        this._lcd = items.length ? items : [['1.8.0', '0.000', 'kWh']];
        this._lcdShow();
        if (!this._lcdTimer) this._lcdTimer = setInterval(() => { this._lcdI = (this._lcdI || 0) + 1; this._lcdShow(); }, 4000);
      }
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'power' && st === 'overload');
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceElectricMeterCard);

  /* ---- éditeur visuel ---- */
  class ApplianceElectricMeterCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_power', 'sensor'), ent('entity_index', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']), ent('entity_tariff', ['sensor', 'select', 'input_select']),
        ent('entity_power_l1', 'sensor'), ent('entity_power_l2', 'sensor'), ent('entity_power_l3', 'sensor'),
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Disque / Disc (' + (this._hass && String(this._hass.language).startsWith('fr') ? 'défaut' : 'default') + ')' }, { value: 'sagemcom_xs212', label: 'Sagemcom XS212 (BE, P1)' }] } } },
        ...['entity_import_t1', 'entity_import_t2', 'entity_export_t1', 'entity_export_t2', 'entity_export', 'entity_peak', 'entity_avg', 'entity_voltage', 'entity_current', 'entity_battery'].map((n) => ent(n, 'sensor')),
        { type: 'grid', name: '', schema: [num('subscribed_power', 0, 100, 0.5, 0, 'kVA')] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_power'), bool('show_today'), bool('show_index'), bool('show_cost'), bool('show_tariff'), bool('show_phases'), bool('show_tariffs'), bool('show_peak'), bool('show_electrics'), bool('show_battery'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceElectricMeterCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Compteur électrique animé : disque rotatif, LED d\'impulsion, totalisateur kWh, puissance, consommation du jour, coût, tarif et phases.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
