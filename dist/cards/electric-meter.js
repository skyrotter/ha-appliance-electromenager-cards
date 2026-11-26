/* Carte « Compteur électrique » — custom:appliance-electric-meter-card
 * Compteur à disque : disque rotatif qui tourne selon la puissance, LED d'impulsion qui clignote, totalisateur kWh
 * (5 chiffres + 1 décimale rouge). Tous les capteurs sont optionnels : puissance (W, kW, MW), index (Wh, kWh, MWh),
 * consommation du jour, coût, tarif en cours, puissance par phase (L1 / L2 / L3), puissance souscrite (kVA).
 * Sans capteur de puissance, la puissance est déduite des variations de l'index.
 * Au-dessus de subscribed_power : état « Dépassement » (bandeau d'alerte).
 * model: landis_gyr_e360_3p : compteur belge Landis+Gyr E360-3P (triphasé, port P1), même principe (photo détourée, LCD, indicateurs P- / P+, tarif actif).
 * model: sagemcom_xs212 : compteur belge à port P1 (Sagemcom / Siconia XS212, photo détourée) dont l'écran LCD fait défiler les index
 * (import / export, tarifs 1 et 2, puissance, tension, courant) ; capteurs P1 (HomeWizard…) : entity_import_t1 / t2, entity_export_t1 / t2,
 * entity_export, entity_peak (pointe du mois), entity_avg, entity_voltage, entity_current, entity_battery.
 */
(() => {
  const TAG = 'appliance-electric-meter-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Electric meter","idle":"No flow","consuming":"Consuming","overload":"Overload","unavailable":"Unavailable","overload_alert":"Power above the subscribed power ({n} kVA)","power":"Power","today":"Today","index":"Index","cost":"Cost","tariff":"Tariff","l1":"L1","l2":"L2","l3":"L3","import_t1":"Import T1","import_t2":"Import T2","export_t1":"Export T1","export_t2":"Export T2","export":"Export","peak":"Peak (month)","avg":"Average demand","voltage":"Voltage","current":"Current","battery":"Batteries"},"cs":{"name":"Elektroměr","idle":"Bez odběru","consuming":"Odběr","overload":"Přetížení","unavailable":"Nedostupné","overload_alert":"Výkon nad rezervovaným příkonem ({n} kVA)","power":"Výkon","today":"Dnes","index":"Stav","cost":"Cena","tariff":"Tarif","l1":"L1","l2":"L2","l3":"L3"},"da":{"name":"Elmåler","idle":"Intet forbrug","consuming":"Forbruger","overload":"Overbelastning","unavailable":"Utilgængelig","overload_alert":"Effekt over den abonnerede effekt ({n} kVA)","power":"Effekt","today":"I dag","index":"Indeks","cost":"Pris","tariff":"Tarif","l1":"L1","l2":"L2","l3":"L3"},"de":{"name":"Stromzähler","idle":"Kein Verbrauch","consuming":"Verbrauch läuft","overload":"Überlast","unavailable":"Nicht verfügbar","overload_alert":"Leistung über der vertraglichen Leistung ({n} kVA)","power":"Leistung","today":"Heute","index":"Zählerstand","cost":"Kosten","tariff":"Tarif","l1":"L1","l2":"L2","l3":"L3"},"es":{"name":"Contador eléctrico","idle":"Sin consumo","consuming":"Consumiendo","overload":"Sobrecarga","unavailable":"No disponible","overload_alert":"Potencia por encima de la contratada ({n} kVA)","power":"Potencia","today":"Hoy","index":"Índice","cost":"Coste","tariff":"Tarifa","l1":"L1","l2":"L2","l3":"L3","import_t1":"Consumo T1","import_t2":"Consumo T2","export_t1":"Vertido T1","export_t2":"Vertido T2","export":"Vertido","peak":"Pico (mes)","avg":"Demanda media","voltage":"Tensión","current":"Corriente","battery":"Baterías"},"fr":{"name":"Compteur électrique","idle":"Pas de consommation","consuming":"Consommation en cours","overload":"Dépassement","unavailable":"Indisponible","overload_alert":"Puissance supérieure à la puissance souscrite ({n} kVA)","power":"Puissance","today":"Aujourd'hui","index":"Index","cost":"Coût","tariff":"Tarif","l1":"L1","l2":"L2","l3":"L3","import_t1":"Import T1","import_t2":"Import T2","export_t1":"Export T1","export_t2":"Export T2","export":"Export","peak":"Pointe du mois","avg":"Demande moyenne","voltage":"Tension","current":"Courant","battery":"Batteries"},"hu":{"name":"Villanyóra","idle":"Nincs fogyasztás","consuming":"Fogyaszt","overload":"Túlterhelés","unavailable":"Nem elérhető","overload_alert":"Teljesítmény az előfizetett felett ({n} kVA)","power":"Teljesítmény","today":"Ma","index":"Index","cost":"Költség","tariff":"Tarifa","l1":"L1","l2":"L2","l3":"L3","import_t1":"Import T1","import_t2":"Import T2","export_t1":"Export T1","export_t2":"Export T2","export":"Export","peak":"Havi csúcs","avg":"Átlagos igény","voltage":"Feszültség","current":"Áram","battery":"Akkumulátorok"},"it":{"name":"Contatore elettrico","idle":"Nessun consumo","consuming":"In consumo","overload":"Sovraccarico","unavailable":"Non disponibile","overload_alert":"Potenza superiore a quella impegnata ({n} kVA)","power":"Potenza","today":"Oggi","index":"Indice","cost":"Costo","tariff":"Tariffa","l1":"L1","l2":"L2","l3":"L3"},"nb":{"name":"Strømmåler","idle":"Ikke noe forbruk","consuming":"Forbruk pågår","overload":"Overbelastning","unavailable":"Utilgjengelig","overload_alert":"Effekt over abonnert effekt ({n} kVA)","power":"Effekt","today":"I dag","index":"Målerstand","cost":"Kostnad","tariff":"Tariff","l1":"L1","l2":"L2","l3":"L3"},"nl":{"name":"Elektriciteitsmeter","idle":"Geen verbruik","consuming":"Verbruik bezig","overload":"Overbelasting","unavailable":"Niet beschikbaar","overload_alert":"Vermogen boven het gecontracteerde vermogen ({n} kVA)","power":"Vermogen","today":"Vandaag","index":"Meterstand","cost":"Kosten","tariff":"Tarief","l1":"L1","l2":"L2","l3":"L3"},"pl":{"name":"Licznik energii elektrycznej","idle":"Brak przepływu","consuming":"Pobór","overload":"Przeciążenie","unavailable":"Niedostępny","overload_alert":"Moc powyżej mocy umownej ({n} kVA)","power":"Moc","today":"Dzisiaj","index":"Indeks","cost":"Koszt","tariff":"Taryfa","l1":"L1","l2":"L2","l3":"L3"},"pt-BR":{"name":"Medidor de energia","idle":"Sem consumo","consuming":"Consumindo","overload":"Sobrecarga","unavailable":"Indisponível","overload_alert":"Potência acima da demanda contratada ({n} kVA)","power":"Potência","today":"Hoje","index":"Leitura","cost":"Custo","tariff":"Tarifa","l1":"L1","l2":"L2","l3":"L3","import_t1":"Importação T1","import_t2":"Importação T2","export_t1":"Exportação T1","export_t2":"Exportação T2","export":"Exportação","peak":"Máxima (mês)","avg":"Demanda média","voltage":"Tensão","current":"Corrente","battery":"Baterias"},"pt-PT":{"name":"Contador elétrico","idle":"Sem consumo","consuming":"A consumir","overload":"Sobrecarga","unavailable":"Indisponível","overload_alert":"Potência acima da potência contratada ({n} kVA)","power":"Potência","today":"Hoje","index":"Índice","cost":"Custo","tariff":"Tarifa","l1":"L1","l2":"L2","l3":"L3","import_t1":"Importação T1","import_t2":"Importação T2","export_t1":"Exportação T1","export_t2":"Exportação T2","export":"Exportação","peak":"Máximo (mês)","avg":"Potência média","voltage":"Tensão","current":"Corrente","battery":"Baterias"},"ro":{"name":"Contor electric","idle":"Fără consum","consuming":"Consum în curs","overload":"Suprasarcină","unavailable":"Indisponibil","overload_alert":"Putere peste puterea abonată ({n} kVA)","power":"Putere","today":"Azi","index":"Index","cost":"Cost","tariff":"Tarif","l1":"L1","l2":"L2","l3":"L3"},"ru":{"name":"Электросчётчик","idle":"Нет расхода","consuming":"Идёт потребление","overload":"Перегрузка","unavailable":"Недоступно","overload_alert":"Мощность выше заявленной ({n} кВА)","power":"Мощность","today":"Сегодня","index":"Показания","cost":"Стоимость","tariff":"Тариф","l1":"L1","l2":"L2","l3":"L3","import_t1":"Потребление Т1","import_t2":"Потребление Т2","export_t1":"Отдача Т1","export_t2":"Отдача Т2","export":"Отдача","peak":"Пик (месяц)","avg":"Средняя мощность","voltage":"Напряжение","current":"Сила тока","battery":"Батареи"},"sr":{"name":"Бројило електричне енергије","idle":"Нема потрошње","consuming":"Потрошња","overload":"Преоптерећење","unavailable":"Недоступно","overload_alert":"Снага изнад одобрене снаге ({n} kVA)","power":"Снага","today":"Данас","index":"Стање","cost":"Трошак","tariff":"Тарифа","l1":"L1","l2":"L2","l3":"L3"},"sr-Latn":{"name":"Brojilo električne energije","idle":"Nema potrošnje","consuming":"Potrošnja","overload":"Preopterećenje","unavailable":"Nedostupno","overload_alert":"Snaga iznad odobrene snage ({n} kVA)","power":"Snaga","today":"Danas","index":"Stanje","cost":"Trošak","tariff":"Tarifa","l1":"L1","l2":"L2","l3":"L3"},"uk":{"name":"Лічильник електроенергії","idle":"Немає потоку","consuming":"Споживає","overload":"Перевантаження","unavailable":"Недоступно","overload_alert":"Потужність перевищує дозволену ({n} кВА)","power":"Потужність","today":"Сьогодні","index":"Показання","cost":"Вартість","tariff":"Тариф","l1":"L1","l2":"L2","l3":"L3","import_t1":"Імпорт Т1","import_t2":"Імпорт Т2","export_t1":"Експорт Т1","export_t2":"Експорт Т2","export":"Експорт","peak":"Пік (місяць)","avg":"Середня потужність","voltage":"Напруга","current":"Струм","battery":"Батареї"}};
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
/* illustration_position: left | right : dessin sur un côté, toutes les tuiles de l'autre côté en 2 colonnes serrées (cartes à nombreuses tuiles : tarifs, tension…) */
:host([illus-pos]) ha-card{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:8px;row-gap:0;align-items:start}
:host([illus-pos]) .head{grid-column:1/-1;grid-row:1}
:host([illus-pos]) svg{grid-row:2;align-self:start;justify-self:center;margin:6px 0 0;width:100%}
:host([illus-pos="left"]) svg{grid-column:1}:host([illus-pos="right"]) svg{grid-column:2}
:host([illus-pos]) .tiles{grid-row:2;margin-top:6px;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}
:host([illus-pos="left"]) .tiles{grid-column:2}:host([illus-pos="right"]) .tiles{grid-column:1}
:host([illus-pos]) .alert{grid-column:1/-1;grid-row:3;margin-top:6px}
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
.p1-seg{fill:#0f2610;opacity:.1;transition:opacity .3s}.p1-seg.on{opacity:.95}
.p1-hl{fill:rgba(140,224,90,.3);stroke:#39a826;stroke-width:.7;opacity:0;transition:opacity .4s}.p1-hl.on{opacity:1}
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

  const P1_IMG = window.__acImg("electric-meter",0);
  const MODELS = { sagemcom_xs212: 'p1', sagemcom: 'p1', xs212: 'p1', siconia: 'p1', p1: 'p1',
    landis_gyr_e360_3p: 'e360', landis_gyr_e360: 'e360', landisgyre3603p: 'e360', landisgyre360: 'e360', e360_3p: 'e360', e3603p: 'e360', e360: 'e360', landisgyr: 'e360', landis: 'e360' };
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

  // compteur belge Landis+Gyr E360-3P (photo 276 × 391, #559) : l'écran LCD est recouvert par notre texte (même défilement que le XS212),
  // indicateurs P- / P+ (export / import) et L1 L2 L3 allumés selon le flux, tarif actif (1.8.1 / 1.8.2 import, 2.8.1 / 2.8.2 export) encadré
  const E360_IMG = window.__acImg("electric-meter",1);
  const SVG_E360 = (label) => `<svg viewBox="0 0 276 390.6" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="p1g" x1="0" x2="1"><stop offset="0" stop-color="#4f9150"/><stop offset="1" stop-color="#46893f"/></linearGradient></defs>
    <image href="${E360_IMG}" x="0" y="0" width="276" height="390.6"/>
    <rect class="p1-hl" id="hl181" x="123.4" y="15.4" width="22.0" height="7.0" rx="1.2"/><rect class="p1-hl" id="hl182" x="123.4" y="21.7" width="22.0" height="7.0" rx="1.2"/><rect class="p1-hl" id="hl281" x="149.6" y="15.4" width="22.8" height="7.0" rx="1.2"/><rect class="p1-hl" id="hl282" x="149.6" y="21.7" width="22.8" height="7.0" rx="1.2"/>
    <rect class="p1-lcdbg" x="90.3" y="46.8" width="99.2" height="41.3" rx="1.5"/><rect class="p1-glow" x="90.3" y="46.8" width="99.2" height="41.3" rx="1.5"/>
    <text class="p1-lcd" id="p1l1" x="94.3" y="61.8" font-size="12">1.8.0</text>
    <text class="p1-lcd" id="p1l2" x="94.3" y="77.8" font-size="15" textLength="77.2" lengthAdjust="spacingAndGlyphs"></text>
    <circle class="p1-seg" id="segL1" cx="100.8" cy="83.9" r="1.3"/><circle class="p1-seg" id="segL2" cx="106.6" cy="83.9" r="1.3"/><circle class="p1-seg" id="segL3" cx="112.9" cy="83.9" r="1.3"/><path class="p1-seg" id="segPm" d="M116.60000000000001 82.2h4.2l-2.1 3.4z"/><path class="p1-seg" id="segPp" d="M123.5 85.60000000000001h4.2l-2.1 -3.4z"/><circle class="p1-seg" id="segDay" cx="185.4" cy="52.0" r="1.9"/><path class="p1-seg" id="segNight" d="M179.9 50.0a2.3 2.3 0 1 0 2.2 3.8a1.8 1.8 0 1 1 -2.2 -3.8z"/>
    <circle class="em-led" cx="226.7" cy="63.9" r="2.6" stroke="#7a1313" stroke-width=".5"/>
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

    _pm() { return MODELS[String((this._c && this._c.model) || '').toLowerCase().replace(/[^a-z0-9_]/g, '')] || ''; }
    _p1() { return !!this._pm(); }
    // Landis+Gyr E360-3P : P+ (import) / P- (export), L1 L2 L3, jour / nuit et tarif actif (1.8.1 / 1.8.2, 2.8.1 / 2.8.2) selon les capteurs
    _e360(power) {
      const r = this._root, c = this._c; if (!r) return;
      const thr = Number(c.power_threshold) || 0, imp = !isNaN(power) && power > thr, exp = !isNaN(power) && power < -thr;
      const ts = this._st(c.entity_tariff), tv = ts ? String(ts.state).toLowerCase() : '';
      const night = /night|nuit|nacht|low|off.?peak|creux|^2$|t2|tarif ?2|bas/.test(tv), day = !night && /day|jour|dag|high|peak|plein|^1$|t1|tarif ?1|normal|haut/.test(tv);
      const on = (id, v) => { const el = r.getElementById(id); if (el) el.classList.toggle('on', !!v); };
      on('segPp', imp); on('segPm', exp); on('segDay', day); on('segNight', night);
      const ph = ['l1', 'l2', 'l3'].map((k) => c['entity_power_' + k]);
      ph.forEach((id, i) => on(`segL${i + 1}`, id ? Math.abs(this._watts(id)) > thr : imp || exp));
      const tar = night ? 2 : day ? 1 : 0, grp = exp ? 2 : 1;
      [1, 2].forEach((g) => [1, 2].forEach((t) => on(`hl${g}8${t}`, tar === t && grp === g)));
    }
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
        ${(this._pm() === 'e360' ? SVG_E360 : this._p1() ? SVG_P1 : SVG)(this._c.name || this._t('name'))}
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
        // horodatage = last_changed de l'index (pas l'heure où la carte l'a vu) : pas de pic au chargement de la page
        const is = this._st(c.entity_index), at = (is && Date.parse(is.last_changed)) || now;
        if (this._lastIdx == null) { this._lastIdx = idx; this._lastAt = at; this._dpower = 0; }
        else if (idx !== this._lastIdx) {
          const h = Math.max(.0003, (at - this._lastAt) / 3600000);
          this._dpower = idx > this._lastIdx ? (idx - this._lastIdx) * 1000 / h : 0;
          this._lastIdx = idx; this._lastAt = at;
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
      // chiffres tirés d'un entier arrondi (en dixièmes) : pas d'erreur de virgule flottante (12345.3 ≠ …5.2)
      const tenths = isNaN(idx) ? 0 : Math.round(Math.max(0, idx) * 10), whole = Math.floor(tenths / 10);
      const ent = String(whole % 100000).padStart(5, '0'), dec = String(tenths % 10);
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
          // tension / courant par phase (codes OBIS 32.7 / 52.7 / 72.7 et 31.7 / 51.7 / 71.7) ; phase absente (réseau sans neutre) = écran ignoré
          ...[['l1', '32.7', '31.7'], ['l2', '52.7', '51.7'], ['l3', '72.7', '71.7']].flatMap(([p, ov, oc]) => [
            [c['entity_voltage_' + p] && ov, isNaN(this._num(c['entity_voltage_' + p])) ? null : this._num(c['entity_voltage_' + p]).toFixed(1), 'V'],
            [c['entity_current_' + p] && oc, isNaN(this._num(c['entity_current_' + p])) ? null : this._num(c['entity_current_' + p]).toFixed(2), 'A']]),
        ].filter((i) => i[0] && i[1] != null);
        this._lcd = items.length ? items : [['1.8.0', '0.000', 'kWh']];
        this._lcdShow();
        if (!this._lcdTimer) this._lcdTimer = setInterval(() => { this._lcdI = (this._lcdI || 0) + 1; this._lcdShow(); }, 4000);
        if (this._pm() === 'e360') this._e360(power);
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
        { name: 'illustration_position', selector: { select: { mode: 'dropdown', options: ['center', 'left', 'right'].map((value) => ({ value, label: window.applianceEditorLabel('illus_pos_' + value, this._hass) })) } } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_power', 'sensor'), ent('entity_index', 'sensor'), ent('entity_today', 'sensor'), ent('entity_cost', ['sensor', 'input_number']), ent('entity_tariff', ['sensor', 'select', 'input_select']),
        ent('entity_power_l1', 'sensor'), ent('entity_power_l2', 'sensor'), ent('entity_power_l3', 'sensor'),
        { name: 'model', selector: { select: { mode: 'dropdown', options: [{ value: '', label: 'Disque / Disc (' + (this._hass && String(this._hass.language).startsWith('fr') ? 'défaut' : 'default') + ')' }, { value: 'sagemcom_xs212', label: 'Sagemcom XS212 (BE, P1)' }, { value: 'landis_gyr_e360_3p', label: 'Landis+Gyr E360-3P (BE, P1)' }] } } },
        ...['entity_import_t1', 'entity_import_t2', 'entity_export_t1', 'entity_export_t2', 'entity_export', 'entity_peak', 'entity_avg', 'entity_voltage', 'entity_current', 'entity_voltage_l1', 'entity_voltage_l2', 'entity_voltage_l3', 'entity_current_l1', 'entity_current_l2', 'entity_current_l3', 'entity_battery'].map((n) => ent(n, 'sensor')),
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
