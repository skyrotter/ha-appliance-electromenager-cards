/* ================================================================== */
/* appliance-ev-charger-card.js                                     */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!(window.__acHasReal||customElements.get.bind(customElements))(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-ev-charger-card — wallbox murale + voiture branchée, animée
 * type: custom:appliance-ev-charger-card
 */

/* Photos détourées (scène « photo ») : borne Legrand Green'up sur pied, Renault Zoé blanche, Volkswagen ID.3 grise.
   pw / ph = taille de la photo ; box = emplacement dans la scène 340 × 190 ; port = prise de recharge de la voiture (fraction de la photo) ;
   lamp = voyant lumineux de la borne (fraction de la photo) ; rear = prise à l'arrière (câble qui passe derrière la voiture). */
const PHOTO = {
  green_up: { img: window.__acImg("ev-charger",0), pw: 90, ph: 321, box: [14, 18, 43, 154], lamp: [.30, .075, .46, .16], hook: [.58, .30] },
  zoe: { img: window.__acImg("ev-charger",1), pw: 480, ph: 261, box: [116, 53, 216, 117], port: [0.13, 0.52] },
  id3: { img: window.__acImg("ev-charger",2), pw: 480, ph: 247, box: [112, 56, 222, 114], port: [0.93, 0.5], rear: true },
  scenic: { img: window.__acImg("ev-charger",3), pw: 480, ph: 291, box: [126, 46, 206, 125], gauge: [.56, .40], port: [0.19, 0.515] },
  puma: { img: window.__acImg("ev-charger",4), pw: 560, ph: 314, box: [126, 56, 206, 116], gauge: [.55, .52], port: [0.27, 0.5] },
  megane: { img: window.__acImg("ev-charger",5), pw: 560, ph: 306, box: [126, 50, 206, 113], gauge: [.56, .42], port: [0.19, 0.51] },
  green_up_wall: { img: window.__acImg("ev-charger",6), pw: 200, ph: 241, box: [12, 54, 66, 80], hook: [.5, .985], wall: true },
  schneider: { img: window.__acImg("ev-charger",7), pw: 240, ph: 340, box: [16, 60, 58, 82], ring: [.55, .759, .15], hook: [.55, .78], wall: true },
};
const I18N_EV = {"en":{"name":"EV charger","power":"Power","energy":"Session","soc":"Battery","status":"Status","duration":"Duration","cost":"Cost","charging":"Charging","plugged":"Plugged in","done":"Complete","disconnected":"Unplugged","climate_pill":"A/C","climate_heat_pill":"Heat","climate":"Climate","climate_heat":"Heating","climate_cool":"Cooling","climate_off":"Off","doors":"Doors","doors_open":"Open","doors_closed":"Closed","charger_image":"Charger image (URL or /local/ file, front view, transparent background)"},"cs":{"name":"Nabíječka EV","power":"Výkon","energy":"Relace","soc":"Baterie","status":"Stav","duration":"Doba","cost":"Cena","charging":"Nabíjí se","plugged":"Připojeno","done":"Dokončeno","disconnected":"Odpojeno"},"da":{"name":"Elbillader","power":"Effekt","energy":"Session","soc":"Batteri","status":"Status","duration":"Varighed","cost":"Pris","charging":"Oplader","plugged":"Tilsluttet","done":"Færdig","disconnected":"Frakoblet"},"de":{"name":"Wallbox","power":"Leistung","energy":"Ladevorgang","soc":"Akku","status":"Status","duration":"Dauer","cost":"Kosten","charging":"Lädt","plugged":"Eingesteckt","done":"Fertig","disconnected":"Nicht verbunden"},"es":{"name":"Cargador de coche eléctrico","power":"Potencia","energy":"Sesión","soc":"Batería","status":"Estado","duration":"Duración","cost":"Coste","charging":"Cargando","plugged":"Conectado","done":"Completa","disconnected":"Desconectado","climate_pill":"A/C","climate_heat_pill":"Calor","climate":"Climatización","climate_heat":"Calentando","climate_cool":"Enfriando","climate_off":"Apagada","doors":"Puertas","doors_open":"Abiertas","doors_closed":"Cerradas","charger_image":"Imagen del cargador (URL o archivo /local/, vista frontal, fondo transparente)"},"fr":{"name":"Borne de recharge","power":"Puissance","energy":"Session","soc":"Batterie","status":"Statut","duration":"Durée","cost":"Coût","charging":"En charge","plugged":"Branchée","done":"Terminée","disconnected":"Débranchée","climate_pill":"Clim","climate_heat_pill":"Chauff.","climate":"Clim","climate_heat":"Chauffage","climate_cool":"Clim","climate_off":"Arrêt","doors":"Portes","doors_open":"Ouvertes","doors_closed":"Fermées","charger_image":"Image de la borne (URL ou fichier /local/, vue de face, fond transparent)"},"hu":{"name":"EV töltő","power":"Teljesítmény","energy":"Munkamenet","soc":"Akkumulátor","status":"Állapot","duration":"Időtartam","cost":"Költség","charging":"Töltés","plugged":"Csatlakoztatva","done":"Kész","disconnected":"Leválasztva"},"it":{"name":"Colonnina di ricarica","power":"Potenza","energy":"Sessione","soc":"Batteria","status":"Stato","duration":"Durata","cost":"Costo","charging":"In carica","plugged":"Collegata","done":"Completata","disconnected":"Scollegata"},"nb":{"name":"Elbillader","power":"Effekt","energy":"Økt","soc":"Batteri","status":"Status","duration":"Varighet","cost":"Kostnad","charging":"Lader","plugged":"Tilkoblet","done":"Ferdig","disconnected":"Frakoblet"},"nl":{"name":"Laadpaal","power":"Vermogen","energy":"Sessie","soc":"Batterij","status":"Status","duration":"Duur","cost":"Kost","charging":"Laden","plugged":"Aangesloten","done":"Volgeladen","disconnected":"Niet aangesloten"},"pl":{"name":"Ładowarka EV","power":"Moc","energy":"Sesja","soc":"Bateria","status":"Status","duration":"Czas trwania","cost":"Koszt","charging":"Ładowanie","plugged":"Podłączono","done":"Zakończono","disconnected":"Odłączono","charger_image":"Obraz ładowarki (URL lub plik /local/, widok z przodu, przezroczyste tło)"},"pt-BR":{"name":"Carregador de veículo elétrico","power":"Potência","energy":"Sessão","soc":"Bateria","status":"Estado","duration":"Duração","cost":"Custo","charging":"Carregando","plugged":"Conectado à tomada","done":"Concluído","disconnected":"Desconectado da tomada","climate_pill":"A/C","climate_heat_pill":"Aquec.","climate":"Clima","climate_heat":"Aquecimento","climate_cool":"Resfriamento","climate_off":"Desligado","doors":"Portas","doors_open":"Abertas","doors_closed":"Fechadas","charger_image":"Imagem do carregador (URL ou arquivo /local/, vista de frente, fundo transparente)"},"pt-PT":{"name":"Carregador de veículo elétrico","power":"Potência","energy":"Sessão","soc":"Bateria","status":"Estado","duration":"Duração","cost":"Custo","charging":"A carregar","plugged":"Ligado à tomada","done":"Concluído","disconnected":"Desligado da tomada","climate_pill":"A/C","climate_heat_pill":"Aquec.","climate":"Clima","climate_heat":"Aquecimento","climate_cool":"Arrefecimento","climate_off":"Desligado","doors":"Portas","doors_open":"Abertas","doors_closed":"Fechadas","charger_image":"Imagem do carregador (URL ou ficheiro /local/, vista de frente, fundo transparente)"},"ro":{"name":"Stație de încărcare","power":"Putere","energy":"Sesiune","soc":"Baterie","status":"Stare","duration":"Durată","cost":"Cost","charging":"Se încarcă","plugged":"Conectat","done":"Finalizat","disconnected":"Deconectat"},"ru":{"name":"Зарядка электромобиля","power":"Мощность","energy":"Сессия","soc":"Батарея","status":"Статус","duration":"Длительность","cost":"Стоимость","charging":"Зарядка","plugged":"Подключено","done":"Завершено","disconnected":"Отключено","climate_pill":"Климат","climate_heat_pill":"Обогрев","climate":"Климат","climate_heat":"Обогрев","climate_cool":"Охлаждение","climate_off":"Выкл","doors":"Двери","doors_open":"Открыты","doors_closed":"Закрыты","charger_image":"Изображение зарядной станции (URL или /local/, вид спереди, прозрачный фон)"},"sr":{"name":"Пуњач за ЕВ","power":"Снага","energy":"Сесија","soc":"Батерија","status":"Статус","duration":"Трајање","cost":"Трошак","charging":"Пуњење","plugged":"Прикључен","done":"Завршено","disconnected":"Искључен"},"sr-Latn":{"name":"Punjač za EV","power":"Snaga","energy":"Sesija","soc":"Baterija","status":"Status","duration":"Trajanje","cost":"Trošak","charging":"Punjenje","plugged":"Priključen","done":"Završeno","disconnected":"Isključen"},"uk":{"name":"Зарядна станція для EV","power":"Потужність","energy":"Сесія","soc":"Акумулятор","status":"Стан","duration":"Тривалість","cost":"Вартість","charging":"Заряджається","plugged":"Підключено","done":"Завершено","disconnected":"Відключено","climate_pill":"Кондиціонер","climate_heat_pill":"Обігрів","climate":"Клімат","climate_heat":"Обігрів","climate_cool":"Охолодження","climate_off":"Вимк.","doors":"Двері","doors_open":"Відчинені","doors_closed":"Зачинені","charger_image":"Зображення зарядної станції (URL або файл /local/, вигляд спереду, прозорий фон)"}};
// Langue de Home Assistant (no / nn → nb), utilisée quand `language` n'est pas configuré
const lang = (h, cfg) => window.applianceLang(I18N_EV, cfg, h);

class ApplianceEvChargerCard extends HTMLElement {
  static getStubConfig(hass) {
    // borne : puissance dont le nom évoque une borne / wallbox
    const S = (hass && hass.states) || {}, ids = Object.keys(S).filter((i) => i.startsWith('sensor.') && /charger|wallbox|borne|evse|zappi|easee|_ev_/i.test(i)), dc = (i) => (S[i].attributes || {}).device_class;
    return { entity_power: ids.find((i) => dc(i) === 'power') || '', entity_session_energy: '', entity_car_soc: '', entity_status: '', max_power: 7400, price_per_kwh: 0.2 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(),
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_session_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_car_soc', selector: { entity: { domain: 'sensor' } } },
        { name: 'entity_status', selector: { entity: { domain: ['sensor', 'binary_sensor', 'select'] } } },
        { name: 'entity_cost', selector: { entity: { domain: 'sensor' } } },
        { name: 'car_model', selector: { select: { mode: 'dropdown', options: [{ value: 'generic', label: 'Voiture de profil (dessin) / Drawn car' }, { value: 'zoe', label: 'Renault Zoé (photo)' }, { value: 'id3', label: 'Volkswagen ID.3 (photo)' }, { value: 'scenic', label: 'Renault Scénic E-Tech (photo)' }, { value: 'puma', label: 'Ford Puma Gen-E jaune (photo)' }, { value: 'megane', label: 'Renault Mégane E-Tech (photo)' }] } } },
        { name: 'charger_model', selector: { select: { mode: 'dropdown', options: [{ value: 'green_up', label: "Legrand Green'up sur pied (photo) / Pedestal" }, { value: 'schneider', label: 'Schneider Charge murale (photo) / Wall box' }, { value: 'green_up_wall', label: "Legrand Green'up prise murale (photo) / Wall socket" }, { value: 'wallbox', label: 'Wallbox murale (dessin) / Drawn wallbox' }] } } },
        { name: 'entity_plugged', selector: { entity: { domain: ['binary_sensor', 'switch', 'sensor'] } } },
        { name: 'entity_climate', selector: { entity: { domain: ['climate', 'binary_sensor', 'switch', 'sensor'] } } },
        { name: 'entity_doors', selector: { entity: { domain: ['binary_sensor', 'cover', 'sensor'], multiple: true } } },
        { type: 'grid', name: '', schema: [
          { name: 'max_power', selector: { number: { min: 1000, max: 22000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'price_per_kwh', selector: { number: { min: 0, max: 2, step: 0.0001, mode: 'box' } } },
          { name: 'currency', selector: { text: {} } },
          { name: 'car_color', selector: { text: {} } },
          { name: 'car_image', selector: { text: {} } },
        { name: 'charger_image', selector: { text: {} } },
          { name: 'car_image_align', selector: { select: { mode: 'dropdown', options: [{ value: 'right', label: 'Droite (défaut) / Right (default)' }, { value: 'center', label: 'Centre / Center' }, { value: 'left', label: 'Gauche, près de la borne / Left, next to the charger' }] } } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_soc', selector: { boolean: {} }, default: true },
          { name: 'show_status', selector: { boolean: {} }, default: true },
          { name: 'show_duration', selector: { boolean: {} }, default: true },
          { name: 'show_cost', selector: { boolean: {} }, default: true },
          { name: 'show_climate', selector: { boolean: {} }, default: true },
          { name: 'show_doors', selector: { boolean: {} }, default: true },
        ] },
        ...window.applianceActionFields,
        window.applianceLanguageField(I18N_EV),
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    this._config = { show_power: true, show_energy: true, show_soc: true, show_status: true, show_duration: true, show_cost: true,
      max_power: 7400, price_per_kwh: 0.2, car_color: '#3d6fb6', show_climate: true, show_doors: true, car_model: 'generic', ...config };
    this._built = false; this._build();
  }
  set hass(h) {
    this._hass = h;
    // Sans `language` dans la config, on suit la langue de Home Assistant (reconstruit si elle change)
    const l = lang(h, this._config);
    if (l !== this._lng) { this._lng = l; this._built = false; this._build(); }
    if (window.applianceChanged(this, h, this._config)) this._update();
  }
  getCardSize() { return 5; }
  getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }
  connectedCallback() { this._timer = setInterval(() => this._update(), 30000); } // rafraîchit la durée
  disconnectedCallback() { clearInterval(this._timer); }
  _t(k) { return (I18N_EV[lang(this._hass, this._config)] || I18N_EV.en)[k] ?? I18N_EV.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  _css() {
    return `
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; }
      .title { font-weight:600; margin:0 4px 4px; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; }
      .ledbar { fill:var(--st,#9e9e9e); filter:drop-shadow(0 0 4px var(--st,#9e9e9e)); transition:fill .6s; }
      .charging .ledbar { animation:breathe var(--sp,2s) ease-in-out infinite; }
      .scr { fill:#0c1a24; } .scrtxt { fill:#7fe0ff; font:700 8px 'Courier New',monospace; text-anchor:middle; }
      .cable { fill:none; stroke:#1b1b1b; stroke-width:6; stroke-linecap:round; }
      .flow { fill:none; stroke:#7cff9b; stroke-width:2.6; stroke-linecap:round; stroke-dasharray:2 9; opacity:0; }
      .charging .flow { opacity:1; animation:dash var(--sp,1s) linear infinite; }
      .plugged-cable { transition:opacity .6s; } .disconnected .plugged-cable { opacity:0; }
      .hang { opacity:0; transition:opacity .6s; } .disconnected .hang { opacity:1; }
      .spark { fill:#fff59d; opacity:0; } .charging .spark { animation:spark 1.2s ease-in-out infinite; }
      .gfill { fill:var(--gc,#43a047); transition:width 1.2s ease, fill .6s; }
      .charging .gfill { animation:breathe 2s ease-in-out infinite; }
      .gtxt { fill:#fff; font:800 10px system-ui,sans-serif; text-anchor:middle; text-shadow:0 1px 2px rgba(0,0,0,.6); }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; display:flex; flex-direction:column; background:var(--ac-tile-bg, rgba(127,127,127,.09)); border-radius:10px; padding:6px 4px; }
      :host([tile-order="name"]) .stat { flex-direction:column-reverse; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } }
      @keyframes breathe { 50% { opacity:.45; } }
      @keyframes spark { 0%,100% { opacity:0; transform:scale(.6); } 50% { opacity:1; transform:scale(1.1); } }
      .carimg { transition:filter .4s; }
      .cimg { filter:drop-shadow(0 0 4px var(--st,#9e9e9e)); transition:filter .6s; } .charging .cimg { animation:cglow var(--sp,2s) ease-in-out infinite; }
      @keyframes cglow { 50% { filter:drop-shadow(0 0 1px var(--st,#9e9e9e)); } }
      .ring { fill:none; stroke-linecap:round; stroke:#3ddc5a; stroke-width:2.4; opacity:.95; filter:drop-shadow(0 0 1.6px #3ddc5a); transition:stroke .6s; } .charging .ring { stroke:#2f9bff; filter:drop-shadow(0 0 2.2px #2f9bff); animation:breathe var(--sp,2s) ease-in-out infinite; }
      .lamp { fill:var(--st,#9e9e9e); opacity:.62; filter:blur(.6px); transition:fill .6s; } .charging .lamp { animation:breathe var(--sp,2s) ease-in-out infinite; }
      .clim-g, .doors-g { opacity:0; transition:opacity .5s; pointer-events:none; } .clim .clim-g, .doors .doors-g { opacity:1; }
      .cw { fill:none; stroke:var(--cc,#4fc3f7); stroke-width:2.2; stroke-linecap:round; opacity:0; } .clim .cw { animation:cwave 2.4s ease-out infinite; } .cw.w2 { animation-delay:.6s !important; } .cw.w3 { animation-delay:1.2s !important; }
      .pill { fill:rgba(20,24,30,.78); stroke:var(--cc,#4fc3f7); stroke-width:1.2; } .pilltxt { fill:#fff; font:700 8.5px system-ui,sans-serif; }
      .doors .carimg { filter:drop-shadow(0 0 5px rgba(255,152,0,.95)); animation:dblink 1.1s ease-in-out infinite; } .doors .pill.dp { stroke:#ff9800; }
      .tcable { fill:none; stroke:#2b2f36; stroke-width:4; stroke-linecap:round; } .tcableo { fill:none; stroke:rgba(255,255,255,.22); stroke-width:5.6; stroke-linecap:round; }
      @keyframes cwave { 0% { opacity:.9; transform:scale(.7); } 100% { opacity:0; transform:scale(1.5); } }
      @keyframes dblink { 50% { filter:drop-shadow(0 0 2px rgba(255,152,0,.4)); } }
    `;
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    if (PHOTO[this._config.car_model]) return this._buildPhoto();
    const car = esc(this._config.car_color);
    const cable = 'M44 112 C 44 168, 112 170, 134 118';
    this.shadowRoot.innerHTML = `
    <style>${this._css()}</style>
    <ha-card>
      <div class="title">${esc(this._config.name || this._t('name'))}</div>
      <svg viewBox="0 0 340 172" id="svg">
        <defs>
          <linearGradient id="wb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#40454d"/><stop offset="1" stop-color="#16191d"/></linearGradient>
          <linearGradient id="carb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${car}"/><stop offset="1" stop-color="${car}" stop-opacity=".75"/></linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc3dc"/><stop offset="1" stop-color="#2d4456"/></linearGradient>
        </defs>

        <!-- Wallbox : image perso (charger_image) ou dessin -->
        ${this._config.charger_image
          ? `<image class="cimg" href="${esc(this._config.charger_image)}" x="12" y="6" width="64" height="106" preserveAspectRatio="xMidYMax meet"/><text id="scr" style="display:none"></text>`
          : `        <rect x="12" y="6" width="64" height="106" rx="14" fill="url(#wb)"/>
        <rect x="18" y="12" width="52" height="94" rx="10" fill="#2c3036" stroke="rgba(255,255,255,.08)"/>
        <rect class="ledbar" x="41" y="22" width="6" height="44" rx="3"/>
        <rect class="scr" x="25" y="76" width="38" height="16" rx="3"/>
        <text class="scrtxt" x="44" y="87" id="scr"></text>
        <rect x="36" y="104" width="16" height="10" rx="3" fill="#111"/>`}
        <!-- Câble rangé (débranché) -->
        <path class="hang cable" d="M44 112 C 44 150, 92 150, 84 110"/>
        <rect class="hang" x="78" y="96" width="12" height="16" rx="3" fill="#2a2a2a"/>

        <!-- Voiture de profil (avant à droite) -->
        <ellipse cx="228" cy="160" rx="108" ry="5" fill="rgba(0,0,0,.18)"/>
        ${this._config.car_image
          // image perso du véhicule (PNG / WebP détouré, vu de profil, avant à droite) à la place du dessin
          ? `<image href="${esc(this._config.car_image)}" x="122" y="52" width="216" height="94" preserveAspectRatio="${{ left: 'xMinYMax', center: 'xMidYMax' }[this._config.car_image_align] || 'xMaxYMax'} meet"/>`
          : `
        <path d="M122 142 L122 120 Q124 108 142 104 L180 99 Q200 78 236 75 L272 75 Q300 77 318 98 L328 102 Q338 106 338 122 L338 142 Z" fill="url(#carb)"/>
        <path d="M188 99 Q206 82 236 80 L250 80 L250 99 Z" fill="url(#glass)"/>
        <path d="M256 80 L272 80 Q294 82 308 99 L256 99 Z" fill="url(#glass)"/>
        <rect x="251" y="80" width="4" height="20" fill="${car}"/>
        <path d="M200 104 V138 M256 104 V138" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
        <rect x="236" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/><rect x="292" y="108" width="10" height="2.5" rx="1" fill="rgba(0,0,0,.35)"/>
        <path d="M330 106 l6 2 v6 l-7 -1 z" fill="#fff6c2"/><rect x="122" y="108" width="5" height="8" rx="1" fill="#e53935"/>
        <rect x="122" y="132" width="216" height="6" fill="rgba(0,0,0,.25)"/>
        ${[160, 300].map((x) => `<g><circle cx="${x}" cy="142" r="17" fill="#141414"/><circle cx="${x}" cy="142" r="9" fill="#9aa3ad"/><circle cx="${x}" cy="142" r="3" fill="#555"/></g>`).join('')}
        <!-- Trappe de recharge -->
        <rect x="130" y="112" width="10" height="10" rx="2" fill="#1d1d1d"/>
`}
        <!-- Jauge batterie voiture sur la portière -->
        <g id="gauge">
          <rect x="205" y="110" width="80" height="20" rx="5" fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/>
          <rect x="285" y="116" width="4" height="8" rx="1.5" fill="rgba(255,255,255,.85)"/>
          <rect class="gfill" id="gfill" x="208" y="113" width="0" height="14" rx="3"/>
          <text class="gtxt" x="245" y="124" id="gtxt"></text>
        </g>

        <!-- Câble branché + flux -->
        <g class="plugged-cable">
          <path class="cable" d="${cable}"/>
          <path class="flow" d="${cable}"/>
          <rect x="128" y="111" width="12" height="12" rx="3" fill="#2a2a2a"/>
          <g transform="translate(134 117)"><path class="spark" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" style="transform-box:fill-box;transform-origin:center"/></g>
        </g>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    window.applianceBindIllus(this, this.shadowRoot.getElementById('svg'), () => window.applianceMore(this, this._config.entity_status || this._config.entity_power));
    this._built = true;
  }

  // Scène « photo » : borne Legrand Green'up sur pied (ou wallbox dessinée) + Renault Zoé / Volkswagen ID.3 en photo détourée
  _buildPhoto() {
    const c = this._config, car = PHOTO[c.car_model];
    // charger_image : image perso de la borne (PNG / WebP détouré, vue de face) à la place des photos intégrées ; voyant d'état en haut de l'image
    const ch = c.charger_image ? { img: esc(c.charger_image), box: [12, 40, 64, 106], custom: true, hook: [.5, .96] }
      : c.charger_model === 'wallbox' ? null : c.charger_model === 'schneider' ? PHOTO.schneider : c.charger_model === 'green_up_wall' ? PHOTO.green_up_wall : PHOTO.green_up;
    const [cx, cy, cw, chh] = car.box, port = [cx + car.port[0] * cw, cy + car.port[1] * chh];
    // départ du câble : prise de la borne (pied : au pied du voyant ; wallbox dessinée : sous le boîtier)
    const [px, py, pw, ph] = ch ? ch.box : [12, 40, 64, 106];
    const hook = ch ? [px + ch.hook[0] * pw, py + ch.hook[1] * ph] : [px + 32, py + 106 - 2];
    const f = (n) => n.toFixed(1);
    const cable = car.rear
      ? `M${f(hook[0])} ${f(hook[1])} C ${f(hook[0])} 170, 190 188, ${f(cx + cw * .96)} 168`
      : `M${f(hook[0])} ${f(hook[1])} C ${f(hook[0])} ${f(hook[1] + 92)}, ${f(port[0] - 46)} ${f(port[1] + 74)}, ${f(port[0])} ${f(port[1])}`;
    const hang = `M${f(hook[0])} ${f(hook[1])} C ${f(hook[0])} ${f(hook[1] + 36)}, ${f(hook[0] + 20)} ${f(hook[1] + 36)}, ${f(hook[0] + 16)} ${f(hook[1] + 8)}`;
    // borne Schneider : anneau autour de la prise (vert = disponible, bleu qui respire = en charge) ; Green'up : rectangle du voyant
    const lamp = !ch || ch.custom || (ch.wall && !ch.ring) ? '' : ch.wall
      ? (() => { const rx = px + ch.ring[0] * pw, ry = py + ch.ring[1] * ph, rr = ch.ring[2] * pw; return `<path class="ring" d="M${f(rx - rr)} ${f(ry)}A${f(rr)} ${f(rr)} 0 0 0 ${f(rx + rr)} ${f(ry)}"/>`; })()
      : `<rect class="lamp" x="${f(px + ch.lamp[0] * pw)}" y="${f(py + ch.lamp[1] * ph)}" width="${f(ch.lamp[2] * pw)}" height="${f(ch.lamp[3] * ph)}" rx="3"/>`;
    const post = ch
      ? `<image${ch.custom ? ' class="cimg" preserveAspectRatio="xMidYMax meet"' : ''} href="${ch.img}" x="${px}" y="${py}" width="${pw}" height="${ph}"/>${lamp}`
      : `<rect x="12" y="40" width="64" height="106" rx="14" fill="url(#wb)"/><rect x="18" y="46" width="52" height="94" rx="10" fill="#2c3036" stroke="rgba(255,255,255,.08)"/><rect class="ledbar" x="41" y="56" width="6" height="44" rx="3"/><rect class="scr" x="25" y="110" width="38" height="16" rx="3"/><text class="scrtxt" x="44" y="121" id="scr"></text>`;
    const wx = cx + cw * .5, wy = cy + 2;
    // jauge de batterie : sur la voiture, ou juste au-dessus de la borne murale (Schneider)
    const gx = ch && ch.wall ? px + pw / 2 - 43 : cx + cw * (car.gauge ? car.gauge[0] : .30), gy = ch && ch.wall ? py - 26 : cy + chh * (car.gauge ? car.gauge[1] : .66);
    this.shadowRoot.innerHTML = `
    <style>${this._css()}</style>
    <ha-card>
      <div class="title">${esc(c.name || this._t('name'))}</div>
      <svg viewBox="0 0 340 190" id="svg" class="photo">
        <defs><linearGradient id="wb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#40454d"/><stop offset="1" stop-color="#16191d"/></linearGradient></defs>
        <ellipse cx="${f(cx + cw * .5)}" cy="${f(cy + chh - 1)}" rx="${f(cw * .52)}" ry="6" fill="rgba(0,0,0,.34)"/>
        ${ch && ch.wall ? "" : `<ellipse cx="${f(px + pw / 2)}" cy="${f(py + ph - 1)}" rx="${f(pw * .62)}" ry="4" fill="rgba(0,0,0,.3)"/>`}
        ${car.rear ? `<g class="plugged-cable"><path class="tcableo" d="${cable}"/><path class="tcable" d="${cable}"/><path class="flow" d="${cable}"/></g>` : ''}
        <image class="carimg" href="${car.img}" x="${cx}" y="${cy}" width="${cw}" height="${chh}"/>
        ${post}
        ${ch ? '<text id="scr" style="display:none"></text>' : ''}
        <g class="hang"><path class="tcableo" d="${hang}"/><path class="tcable" d="${hang}"/></g>
        ${car.rear ? '' : `<g class="plugged-cable"><path class="tcableo" d="${cable}"/><path class="tcable" d="${cable}"/><path class="flow" d="${cable}"/><rect x="${f(port[0] - 6)}" y="${f(port[1] - 6)}" width="12" height="12" rx="3" fill="#2a2a2a"/><g transform="translate(${f(port[0])} ${f(port[1])})"><path class="spark" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" style="transform-box:fill-box;transform-origin:center"/></g></g>`}
        <!-- Climatisation : ondes au-dessus du toit + pastille -->
        <g class="clim-g">
          <g style="transform-box:fill-box;transform-origin:center">${[0, 1, 2].map((i) => `<path class="cw w${i + 1}" d="M${f(wx - 26 - i * 6)} ${f(wy + 6 + i * 3)} Q${f(wx)} ${f(wy - 14 - i * 6)} ${f(wx + 26 + i * 6)} ${f(wy + 6 + i * 3)}" style="transform-box:fill-box;transform-origin:50% 100%"/>`).join('')}</g>
          <rect class="pill" x="${cx + 4}" y="${cy - 6}" width="46" height="16" rx="8"/>
          <g stroke="var(--cc,#4fc3f7)" stroke-width="1.4" stroke-linecap="round"><path d="M${cx + 14} ${cy + 2}h7M${cx + 17.5} ${cy - .5}v5M${cx + 15} ${cy - .2}l5 4.4M${cx + 20} ${cy - .2}l-5 4.4"/></g>
          <text class="pilltxt" x="${cx + 25}" y="${cy + 5.2}" id="climtxt">A/C</text>
        </g>
        <!-- Portes ouvertes : pastille orange sur la voiture -->
        <g class="doors-g"><rect class="pill dp" x="${cx + cw - 80}" y="${cy - 6}" width="76" height="16" rx="8"/>
          <path d="M${cx + cw - 72} ${cy + 3.5}v-6h6l2 6z" fill="none" stroke="#ff9800" stroke-width="1.3" stroke-linejoin="round"/>
          <text class="pilltxt" x="${cx + cw - 60}" y="${cy + 5.2}" id="doortxt">Portes</text></g>
        <!-- Jauge batterie sur la voiture -->
        <g id="gauge" transform="translate(${f(gx)} ${f(gy)})">
          <rect x="0" y="0" width="82" height="19" rx="5" fill="rgba(0,0,0,.55)" stroke="rgba(255,255,255,.85)" stroke-width="1.4"/>
          <rect x="82" y="5.5" width="4" height="8" rx="1.5" fill="rgba(255,255,255,.85)"/>
          <rect class="gfill" id="gfill" x="3" y="3" width="0" height="13" rx="3"/>
          <text class="gtxt" x="41" y="13.4" id="gtxt"></text>
        </g>
      </svg>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    window.applianceBindIllus(this, this.shadowRoot.getElementById('svg'), () => window.applianceMore(this, this._config.entity_status || this._config.entity_power));
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }
  // énergie en kWh (capteur en Wh, kWh ou MWh converti)
  _kwh(id) {
    const n = this._num(id); if (n === null) return null;
    const u = String((this._hass.states[id].attributes || {}).unit_of_measurement || '').trim();
    return /^wh$/i.test(u) ? n / 1000 : u === 'MWh' ? n * 1000 : n;
  }

  // état d'une ou plusieurs entités : true / false / null (inconnu) ; texte, binary_sensor, switch, cover, climate…
  _flag(ids) {
    const L = (Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    if (!L.length || !this._hass) return null;
    let any = false, known = false;
    for (const id of L) {
      const st = this._hass.states[id]; if (!st) continue;
      const v = String(st.state).toLowerCase(); if (['unavailable', 'unknown', ''].includes(v)) continue;
      known = true;
      const act = String((st.attributes && st.attributes.hvac_action) || '').toLowerCase();
      if (/^(off|closed|close|false|no|unplugged|disconnected|idle|none|locked|0)$/.test(v) && !/heat|cool/.test(act)) continue;
      if (st.entity_id.startsWith('climate.') && /^(off|idle)$/.test(act) && v !== 'heat' && v !== 'cool') continue;
      any = true;
    }
    return known ? any : null;
  }
  // climatisation : « heat » si l'entité chauffe, sinon « cool »
  _climMode() {
    const st = this._hass.states[this._config.entity_climate]; if (!st) return 'cool';
    const t = `${st.state} ${(st.attributes && st.attributes.hvac_action) || ''}`.toLowerCase();
    return /heat|chauff/.test(t) ? 'heat' : 'cool';
  }

  // Statut : depuis l'entité si fournie (mots-clés FR/EN), sinon déduit de la puissance
  _status(watts) {
    const c = this._config, s = c.entity_status && this._hass.states[c.entity_status];
    if (s) {
      // mots entiers ; un mot précédé d'une négation (not / no / non / pas, 2 mots avant au plus) ou suivi de « pas » ne compte pas,
      // et les préfixes négatifs (dis-, un-, dé-, off…) ne correspondent pas (« disconnected », « unplugged », « offline » ≠ connecté)
      const ws = String(s.state).toLowerCase().split(/[^a-z0-9à-ÿ]+/).filter(Boolean);
      const NEG = /^(not|no|non|pas|never|jamais)$/;
      const hit = (re) => ws.some((x, i) => re.test(x) && !NEG.test(ws[i - 1] || '') && !NEG.test(ws[i - 2] || '') && ws[i + 1] !== 'pas');
      const done = hit(/^(complete[d]?|finish[a-zà-ÿ]*|termin[a-zà-ÿ]*|full|plein|done)$/);
      if (hit(/^(charging|charge)$/) && !done) return 'charging';
      if (done) return 'done';
      if (hit(/^(connect[a-zà-ÿ]*|plug[a-zà-ÿ]*|branch[a-zà-ÿ]*|on|a?wait[a-zà-ÿ]*|attente|ready|prêt[a-zà-ÿ]*)$/)) return watts > 50 ? 'charging' : 'plugged';
      // « not charging » / « ne charge pas » : voiture branchée sans charge (sauf si l'état dit aussi débranché)
      if (ws.some((x) => /^charg/.test(x)) && !ws.some((x) => /^(disconn|unplug|offline|d[ée]branch)/.test(x))) return 'plugged';
      return 'disconnected';
    }
    return watts > 50 ? 'charging' : 'plugged';
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const ps = c.entity_power && this._hass.states[c.entity_power];
    let w = this._num(c.entity_power);
    if (w !== null && ps && /kw/i.test(ps.attributes.unit_of_measurement || '')) w *= 1000;
    const energy = this._kwh(c.entity_session_energy), soc = this._num(c.entity_car_soc);
    let cost = this._num(c.entity_cost);
    if (cost === null && energy !== null && c.price_per_kwh && Number.isFinite(window.appliancePrice(this._hass, c.price_per_kwh, this, c.entity_session_energy))) cost = energy * window.appliancePrice(this._hass, c.price_per_kwh, this, c.entity_session_energy);
    let st = this._status(w || 0);
    const pl = this._flag(c.entity_plugged), clim = this._flag(c.entity_climate), doors = this._flag(c.entity_doors);
    if (pl === true && st === 'disconnected') st = 'plugged'; else if (pl === false && st !== 'charging') st = 'disconnected';

    const svg = r.getElementById('svg');
    svg.classList.remove('charging', 'plugged', 'done', 'disconnected', 'clim', 'doors'); svg.classList.add(st);
    if (clim) { svg.classList.add('clim'); svg.style.setProperty('--cc', this._climMode() === 'heat' ? '#ff9a3c' : '#4fc3f7'); }
    if (doors) svg.classList.add('doors');
    const ct = r.getElementById('climtxt'), dt = r.getElementById('doortxt');
    if (ct) ct.textContent = this._climMode() === 'heat' ? this._t('climate_heat_pill') : this._t('climate_pill');
    if (dt) dt.textContent = this._t('doors');
    const colors = { charging: '#43ff64', plugged: '#3fa9ff', done: '#43a047', disconnected: '#d0d0d0' };
    svg.style.setProperty('--st', colors[st]);
    const ratio = Math.min((w || 0) / c.max_power, 1);
    svg.style.setProperty('--sp', `${(1.6 - ratio * 1.2).toFixed(2)}s`);
    const scrEl = r.getElementById('scr'); if (scrEl) scrEl.textContent = st === 'charging' ? `${((w || 0) / 1000).toFixed(1)} kW` : this._t(st).toUpperCase().slice(0, 9);

    // Jauge voiture
    const pct = soc === null ? 0 : Math.max(0, Math.min(100, soc));
    r.getElementById('gfill').setAttribute('width', (74 * pct / 100).toFixed(1));
    r.getElementById('gauge').style.display = soc === null ? 'none' : '';
    svg.style.setProperty('--gc', pct < 20 ? '#e53935' : pct < 50 ? '#fb8c00' : '#43a047');
    r.getElementById('gtxt').textContent = soc === null ? '' : `${Math.round(pct)}%`;

    // Durée depuis le dernier changement d'état (statut, sinon puissance)
    let dur = null;
    const ref = (c.entity_status && this._hass.states[c.entity_status]) || ps;
    if (st === 'charging' && ref && ref.last_changed) {
      const m = Math.max(0, Math.round((Date.now() - new Date(ref.last_changed).getTime()) / 60000));
      dur = `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
    }

    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), w === null ? '—' : w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${Math.round(w)} W`, c.entity_power]);
    if (c.show_energy) it.push([this._l('energy'), f(energy, 1, 'kWh'), c.entity_session_energy]);
    if (c.show_soc && soc !== null) it.push([this._l('soc'), f(soc, 0, '%'), c.entity_car_soc]);
    if (c.show_status) it.push([this._l('status'), this._t(st), c.entity_status || c.entity_power]);
    if (c.show_duration) it.push([this._l('duration'), dur || '—', c.entity_status || c.entity_power]);
    // Devise : option `currency`, sinon l'unité du capteur de coût, sinon €.
    const cs = c.entity_cost && this._hass.states[c.entity_cost];
    const costU = c.currency || (cs && cs.attributes && cs.attributes.unit_of_measurement) || '€';
    if (c.show_cost) it.push([this._l('cost'), f(cost, 2, costU), c.entity_cost || c.entity_session_energy]);
    if (c.show_climate && c.entity_climate && clim !== null) it.push([this._l('climate'), clim ? this._t(this._climMode() === 'heat' ? 'climate_heat' : 'climate_cool') : this._t('climate_off'), c.entity_climate]);
    if (c.show_doors && c.entity_doors && doors !== null) it.push([this._l('doors'), doors ? this._t('doors_open') : this._t('doors_closed'), [].concat(c.entity_doors)[0]]);
    // 5-6 valeurs → 2 lignes équilibrées
    r.getElementById('stats').style.gridTemplateColumns = `repeat(${it.length > 4 ? Math.ceil(it.length / 2) : it.length}, 1fr)`;
    r.getElementById('stats').innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
    window.applianceLinkTiles(r.getElementById('stats'), this);
  }
}
define('appliance-ev-charger-card', ApplianceEvChargerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-ev-charger-card', name: 'Appliance – EV charger / Borne de recharge', names: Object.fromEntries(Object.keys(I18N_EV).map((l) => [l, I18N_EV[l].name])), description: 'Wallbox murale animée avec voiture branchée', preview: true });
})();
