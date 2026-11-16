/* ================================================================== */
/* appliance-battery-card.js                                        */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-battery-card — batterie de stockage solaire animée (niveau liquide, flux charge/décharge)
 * type: custom:appliance-battery-card
 */
const I18N_BAT = {
  "en": {
    "name": "Solar battery",
    "calibration": "Next calibration",
    "soc": "Charge",
    "power": "Power",
    "energy": "Energy",
    "temp": "Temperature",
    "charging": "Charging",
    "discharging": "Discharging",
    "idle": "Idle",
    "full": "Full in",
    "empty": "Empty in",
    "low": "Low battery"
  },
  "cs": {
    "name": "Solární baterie",
    "soc": "Nabití",
    "power": "Výkon",
    "energy": "Energie",
    "temp": "Teplota",
    "charging": "Nabíjí se",
    "discharging": "Vybíjí se",
    "idle": "Nečinná",
    "full": "Plná za",
    "empty": "Prázdná za",
    "low": "Slabá baterie"
  },
  "da": {
    "name": "Solcellebatteri",
    "soc": "Opladning",
    "power": "Effekt",
    "energy": "Energi",
    "temp": "Temperatur",
    "charging": "Oplader",
    "discharging": "Aflader",
    "idle": "Inaktiv",
    "full": "Fuld om",
    "empty": "Tom om",
    "low": "Lavt batteri"
  },
  "de": {
    "name": "Solarbatterie",
    "soc": "Ladestand",
    "power": "Leistung",
    "energy": "Energie",
    "temp": "Temperatur",
    "charging": "Lädt",
    "discharging": "Entlädt",
    "idle": "Ruhe",
    "full": "Voll in",
    "empty": "Leer in",
    "low": "Batterie schwach"
  },
  "es": {
    "name": "Batería solar",
    "soc": "Carga",
    "power": "Potencia",
    "energy": "Energía",
    "temp": "Temperatura",
    "charging": "Cargando",
    "discharging": "Descargando",
    "idle": "Inactiva",
    "full": "Llena en",
    "empty": "Vacía en",
    "low": "Batería baja"
  },
  "fr": {
    "name": "Batterie solaire",
    "calibration": "Prochaine calibration",
    "soc": "Charge",
    "power": "Puissance",
    "energy": "Énergie",
    "temp": "Température",
    "charging": "En charge",
    "discharging": "En décharge",
    "idle": "Repos",
    "full": "Plein dans",
    "empty": "Vide dans",
    "low": "Batterie faible"
  },
  "hu": {
    "name": "Napelem akkumulátor",
    "soc": "Töltöttség",
    "power": "Teljesítmény",
    "energy": "Energia",
    "temp": "Hőmérséklet",
    "charging": "Töltés",
    "discharging": "Kisütés",
    "idle": "Tétlen",
    "full": "Tele",
    "empty": "Üres",
    "low": "Alacsony akkuszint"
  },
  "it": {
    "name": "Batteria domestica",
    "soc": "Carica",
    "power": "Potenza",
    "energy": "Energia",
    "temp": "Temperatura",
    "charging": "In carica",
    "discharging": "In scarica",
    "idle": "Inattiva",
    "full": "Carica completa tra",
    "empty": "Scarica completa tra",
    "low": "Batteria scarica"
  },
  "nb": {
    "name": "Solbatteri",
    "soc": "Ladning",
    "power": "Effekt",
    "energy": "Energi",
    "temp": "Temperatur",
    "charging": "Lader",
    "discharging": "Utlader",
    "idle": "Inaktiv",
    "full": "Full om",
    "empty": "Tom om",
    "low": "Lavt batteri"
  },
  "nl": {
    "name": "Thuisbatterij",
    "soc": "Lading",
    "power": "Vermogen",
    "energy": "Energie",
    "temp": "Temperatuur",
    "charging": "Laden",
    "discharging": "Ontladen",
    "idle": "Inactief",
    "full": "Vol over",
    "empty": "Leeg over",
    "low": "Batterij bijna leeg"
  },
  "pl": {
    "name": "Bateria słoneczna",
    "soc": "Ładowanie",
    "power": "Moc",
    "energy": "Energia",
    "temp": "Temperatura",
    "charging": "Ładowanie",
    "discharging": "Rozładowywanie",
    "idle": "Bezczynny",
    "full": "Pełna za",
    "empty": "Pusta za",
    "low": "Niski poziom baterii"
  },
  "pt-BR": {
    "name": "Bateria solar",
    "calibration": "Próxima calibração",
    "soc": "Carga",
    "power": "Potência",
    "energy": "Energia",
    "temp": "Temperatura",
    "charging": "Carregando",
    "discharging": "Descarregando",
    "idle": "Inativo",
    "full": "Cheia em",
    "empty": "Vazia em",
    "low": "Bateria fraca"
  },
  "pt-PT": {
    "name": "Bateria solar",
    "calibration": "Próxima calibração",
    "soc": "Carga",
    "power": "Potência",
    "energy": "Energia",
    "temp": "Temperatura",
    "charging": "A carregar",
    "discharging": "A descarregar",
    "idle": "Inativo",
    "full": "Cheia em",
    "empty": "Vazia em",
    "low": "Bateria fraca"
  },
  "ro": {
    "name": "Baterie solară",
    "soc": "Încărcare",
    "power": "Putere",
    "energy": "Energie",
    "temp": "Temperatură",
    "charging": "Se încarcă",
    "discharging": "Se descarcă",
    "idle": "Repaus",
    "full": "Plină în",
    "empty": "Goală în",
    "low": "Baterie slabă"
  },
  "ru": {
    "name": "Солнечная батарея",
    "soc": "Заряд",
    "power": "Мощность",
    "energy": "Энергия",
    "temp": "Температура",
    "charging": "Зарядка",
    "discharging": "Разрядка",
    "idle": "Простой",
    "full": "Полный заряд через",
    "empty": "Разрядка через",
    "low": "Низкий заряд"
  },
  "sr": {
    "name": "Соларна батерија",
    "soc": "Напуњеност",
    "power": "Снага",
    "energy": "Енергија",
    "temp": "Температура",
    "charging": "Пуњење",
    "discharging": "Пражњење",
    "idle": "У стању мировања",
    "full": "Пуна за",
    "empty": "Празна за",
    "low": "Батерија је ниска"
  },
  "sr-Latn": {
    "name": "Solarna baterija",
    "soc": "Napunjenost",
    "power": "Snaga",
    "energy": "Energija",
    "temp": "Temperatura",
    "charging": "Punjenje",
    "discharging": "Pražnjenje",
    "idle": "U stanju mirovanja",
    "full": "Puna za",
    "empty": "Prazna za",
    "low": "Baterija je niska"
  },
  "uk": {
    "name": "Сонячний акумулятор",
    "calibration": "Наступне калібрування",
    "soc": "Заряд",
    "power": "Потужність",
    "energy": "Енергія",
    "temp": "Температура",
    "charging": "Заряджається",
    "discharging": "Розряджається",
    "idle": "Очікування",
    "full": "Повний через",
    "empty": "Порожній через",
    "low": "Низький заряд"
  }
};
// Home Assistant language, used when `language` option is not explicitly set
const lang = (h, cfg) => window.applianceLang(I18N_BAT, cfg, h);
/* Photo détourée : Marstek Venus E 3.0 (360 × 506 px). bar / led : emplacement du bandeau lumineux « BATTERY » de la photo,
   que l'on recouvre pour le faire suivre l'état de charge ; cx : milieu de la face avant noire. */
const MARSTEK = { img: 'data:image/webp;base64,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', w: 360, h: 506, bar: { x1: 168, x2: 264, y: 63 }, led: { x: 217, y: 58 }, cx: 210 };
const MODELS = ['default', 'marstek_venus_e3'];

class ApplianceBatteryCard extends HTMLElement {
  static getStubConfig(hass) {
    // batterie domestique : niveau (device_class battery) et puissance dont le nom évoque une batterie
    const S = (hass && hass.states) || {}, ids = Object.keys(S).filter((i) => i.startsWith('sensor.') && /batter|storage|powerwall/i.test(i)), dc = (i) => (S[i].attributes || {}).device_class;
    return { entity_soc: ids.find((i) => dc(i) === 'battery') || '', entity_power: ids.find((i) => dc(i) === 'power') || '', entity_energy: '', entity_temperature: '', entity_calibration: '', capacity_kwh: 10, max_power: 5000 };
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(),
        // modèle photo (Marstek Venus E 3.0) et nombre d'unités côte à côte (plusieurs batteries sous un seul capteur de charge)
        { type: 'grid', name: '', schema: [
          { name: 'model', selector: { select: { mode: 'dropdown', options: MODELS.map((value) => ({ value, label: window.applianceEditorLabel('battery_model_' + value) })) } } },
          { name: 'count', selector: { number: { min: 1, max: 4, step: 1, mode: 'box' } } },
        ] },
        { name: 'entity_soc', selector: { entity: { domain: 'sensor', device_class: 'battery' } } },
        { name: 'entity_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'invert_power', selector: { boolean: {} } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        // date de la prochaine calibration (ex. batteries Zendure) : capteur date/horodatage ou input_datetime
        { name: 'entity_calibration', selector: { entity: { domain: ['sensor', 'input_datetime'] } } },
        { type: 'grid', name: '', schema: [
          { name: 'capacity_kwh', selector: { number: { min: 1, max: 100, step: 0.1, mode: 'box', unit_of_measurement: 'kWh' } } },
          { name: 'max_power', selector: { number: { min: 500, max: 20000, step: 100, mode: 'box', unit_of_measurement: 'W' } } },
          { name: 'low_threshold', selector: { number: { min: 0, max: 50, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ] },
        { type: 'grid', name: '', schema: [
          { name: 'show_power', selector: { boolean: {} }, default: true },
          { name: 'show_energy', selector: { boolean: {} }, default: true },
          { name: 'show_temperature', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_calibration', selector: { boolean: {} }, default: true },
        ] },
        window.applianceTempField,
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'split'] } } },
        { name: 'status_position', selector: { select: { mode: 'dropdown', options: ['auto', 'inside', 'below'] } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(I18N_BAT),
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name === 'model' ? 'battery_model' : s.name === 'count' ? 'battery_count' : s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    // Convention : puissance > 0 = charge (inverser avec invert_power si ton capteur est l'inverse)
    this._config = { show_power: true, show_energy: true, show_temperature: true, show_time: true, show_calibration: true,
      capacity_kwh: 10, max_power: 5000, low_threshold: 15, invert_power: false, status_position: 'auto', layout: 'default', model: 'default', count: 1, ...config };
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
  _t(k) { return (I18N_BAT[lang(this._hass, this._config)] || I18N_BAT.en)[k] ?? I18N_BAT.en[k] ?? k; }
  // libellé perso (option labels) sinon traduction
  _l(k) { const L = this._config && this._config.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }

  // Scène « photo » : une ou plusieurs Marstek Venus E 3.0 côte à côte (option count), bandeau lumineux piloté par l'état de charge
  _photoScene() {
    const M = MARSTEK, n = Math.max(1, Math.min(4, Math.round(Number(this._config.count)) || 1)), gap = 12;
    const s = Math.min(168 / M.h, (300 - (n - 1) * gap) / (n * M.w)), uw = M.w * s, total = n * uw + (n - 1) * gap, x0 = (320 - total) / 2, y0 = -2 + (168 - M.h * s) / 2;
    const len = M.bar.x2 - M.bar.x1;
    const unit = (i) => `
      <g transform="translate(${(x0 + i * (uw + gap)).toFixed(2)} ${y0.toFixed(2)}) scale(${s.toFixed(4)})">
        <image href="${M.img}" width="${M.w}" height="${M.h}"/>
        <rect x="${M.bar.x1 - 8}" y="${M.bar.y - 5}" width="${len + 16}" height="10" rx="2" fill="#121317"/>
        <rect x="${M.led.x - 9}" y="${M.led.y - 4}" width="18" height="8" rx="2" fill="#121317"/>
        <line x1="${M.bar.x1}" y1="${M.bar.y}" x2="${M.bar.x2}" y2="${M.bar.y}" stroke="#fff" stroke-opacity=".2" stroke-width="2.6" stroke-linecap="round"/>
        <line class="mk-bar" x1="${M.bar.x1}" y1="${M.bar.y}" x2="${M.bar.x1}" y2="${M.bar.y}" stroke-width="3.4" stroke-linecap="round"/>
        <rect class="led" x="${M.led.x - 7}" y="${M.led.y - 1.6}" width="14" height="3.2" rx="1.6"/>
        <path class="bolt" d="M${M.cx + 6} 196 l-28 38 h17 l-9 32 l30 -41 h-18 z"/>
        <path class="arrow" d="M${M.cx} 266 l-28 -30 h17 v-34 h22 v34 h17 z"/>
        <text class="soc" x="${M.cx}" y="338" style="font-size:78px">%s</text>
        <text class="state" x="${M.cx}" y="378" style="font-size:19px"></text>
      </g>`.replace('%s', '');
    return Array.from({ length: n }, (_, i) => unit(i)).join('');
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const photo = this._config.model === 'marstek_venus_e3';
    // 3 modules façon photo : corps blanc nervuré, couvercle noir, étiquette, câbles orange
    const X = [24, 112, 200], TOP = 40, LID = 22, BODY = 98, W = 80, D = 14;
    const mod = (x0, i) => {
      const ribs = Array.from({ length: 9 }, (_, k) => `<line x1="${x0 + 44 + k * 4}" y1="${TOP + LID + 4}" x2="${x0 + 44 + k * 4}" y2="${TOP + LID + BODY - 4}" stroke="#d9dde1" stroke-width="1"/>`).join('');
      return `
      <g class="mod">
        <polygon points="${x0 + W},${TOP + LID} ${x0 + W + D},${TOP + LID - D} ${x0 + W + D},${TOP + LID + BODY - D} ${x0 + W},${TOP + LID + BODY}" fill="#c9ced3"/>
        <polygon points="${x0 + W},${TOP} ${x0 + W + D},${TOP - D} ${x0 + W + D},${TOP + LID - D} ${x0 + W},${TOP + LID}" fill="#0d0d0d"/>
        <polygon points="${x0},${TOP} ${x0 + D},${TOP - D} ${x0 + W + D},${TOP - D} ${x0 + W},${TOP}" fill="#2a2a2a"/>
        <polygon points="${x0 + 36},${TOP - 4} ${x0 + 42},${TOP - 10} ${x0 + 72},${TOP - 10} ${x0 + 66},${TOP - 4}" fill="#f2f2f2"/>
        <rect x="${x0}" y="${TOP}" width="${W}" height="${LID}" rx="3" fill="#161616"/>
        <rect x="${x0 + 8}" y="${TOP + 7}" width="20" height="6" rx="3" fill="#000"/>
        <circle class="led" cx="${x0 + W - 10}" cy="${TOP + 11}" r="3" style="animation-delay:${i * 0.3}s"/>
        <rect x="${x0}" y="${TOP + LID}" width="${W}" height="${BODY}" fill="url(#body)"/>
        ${ribs}
        <g clip-path="url(#c${i})">
          <rect class="liquid" id="liq${i}" x="${x0}" y="${TOP + LID + BODY}" width="${W}" height="0"/>
          <path class="wave" id="wave${i}" d="M${x0 - 20} 0 q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 v 10 h-120z" style="animation-delay:${-i * 0.7}s"/>
        </g>
        <circle cx="${x0 + 6}" cy="${TOP + LID + BODY - 6}" r="2" fill="#9aa3ad"/>
      </g>`;
    };
    const clips = X.map((x, i) => `<clipPath id="c${i}"><rect x="${x}" y="${TOP + LID}" width="${W}" height="${BODY}"/></clipPath>`).join('');
    // Câbles orange entre bornes (dessus des couvercles) + câble de sortie
    const cab = (x1, x2) => `M${x1} ${TOP - 6} C ${x1} ${TOP - 30}, ${x2} ${TOP - 30}, ${x2} ${TOP - 6}`;
    const cables = [cab(46, 128), cab(134, 216), `M${X[2] + W + 8} ${TOP - 6} C ${X[2] + W + 30} ${TOP - 20}, ${X[2] + W + 26} ${TOP + 60}, ${X[2] + W + 22} ${TOP + 110}`];
    this.shadowRoot.innerHTML = `
    <style>
      :host { display:block; }:host{height:100%} ha-card{height:100%;box-sizing:border-box}
      ha-card { padding:12px; overflow:hidden; container-type:inline-size; }
      .title { font-weight:600; margin:0 4px 4px; display:flex; justify-content:space-between; align-items:center; }
      .badge { font-size:.75em; color:#fff; background:#e53935; border-radius:10px; padding:2px 8px; display:none; animation:blink 1s infinite; }
      .low .badge { display:inline-block; }
      svg { width:100%; max-width:calc(100% * var(--illus-scale,1)); margin-left:auto; margin-right:auto; height:auto; display:block; overflow:visible; transform:scale(0.8); transform-origin:top center; }
      .liquid { fill:var(--lc,#43a047); opacity:.35; transition:y 1.2s ease, height 1.2s ease, fill .8s; }
      .wave { fill:var(--lc,#43a047); opacity:.45; animation:wave 2.6s ease-in-out infinite alternate; transition:fill .8s; }
      .led { fill:var(--lc,#43a047); animation:blink var(--bl,2s) infinite; filter:drop-shadow(0 0 3px var(--lc,#43a047)); }
      .cable { fill:none; stroke:#ff7a1a; stroke-width:5; stroke-linecap:round; }
      .cable-b { fill:none; stroke:#111; stroke-width:8; stroke-linecap:round; }
      .flow { fill:none; stroke-width:2.5; stroke-linecap:round; stroke-dasharray:2 9; opacity:0; }
      .charging .flow { stroke:#fff6a0; opacity:1; animation:dash var(--fs,1s) linear infinite reverse; }
      .discharging .flow { stroke:#b3f5ff; opacity:1; animation:dash var(--fs,1s) linear infinite; }
      .soc { fill:#1d2733; font:800 26px system-ui,sans-serif; text-anchor:middle; }
      .state { fill:#4b5563; font:700 7.5px system-ui,sans-serif; text-anchor:middle; letter-spacing:.12em; }
      .status-line { display:none; text-align:center; font-weight:700; font-size:max(11px, .75em); letter-spacing:.08em; text-transform:uppercase; color:var(--secondary-text-color); margin:2px 0 4px; }
      .sp-below .status-line { display:block; } .sp-below #state { display:none; }
      @container (max-width:260px) { .sp-auto .status-line { display:block; } .sp-auto #state { display:none; } }
      .layout-split { display:grid; grid-template-columns:minmax(0, .8fr) minmax(0, 1.2fr); grid-template-rows:auto auto 1fr; column-gap:8px; align-content:center; }
      .layout-split svg { grid-column:1; grid-row:1 / 4; align-self:center; transform:none; }
      .layout-split .title { grid-column:2; grid-row:1; flex-wrap:wrap; gap:4px; margin:0 0 2px; font-size:.95em; }
      .layout-split .title span { min-width:0; overflow-wrap:anywhere; }
      .layout-split .status-line { grid-column:2; grid-row:2; display:block; text-align:left; margin:0 0 4px; }
      .layout-split #state { display:none; }
      .layout-split .stats { grid-column:2; grid-row:3; grid-template-columns:minmax(0, 1fr); min-width:0; align-self:start; gap:4px; margin-top:0; }
      .layout-split .stat { padding:4px 6px; text-align:left; }
      .layout-split .stat { min-width:0; overflow-wrap:anywhere; }
      .layout-split .stat .v { font-size:.95em; }
      .mk-bar { stroke:var(--lc,#43a047); filter:drop-shadow(0 0 3px var(--lc,#43a047)); transition:stroke .8s; }
      .charging .mk-bar { stroke-dasharray:9 4; animation:dash var(--fs,1s) linear infinite reverse; }
      .discharging .mk-bar { stroke-dasharray:9 4; animation:dash var(--fs,1s) linear infinite; }
      .photo-card svg { transform:none; }
      .photo-card .soc { fill:#fff; opacity:.92; } .photo-card .state { fill:#9fb0c0; }
      .bolt { fill:#ffb300; opacity:0; } .charging .bolt { opacity:1; animation:blink 1.2s infinite; }
      .arrow { fill:#00acc1; opacity:0; } .discharging .arrow { opacity:1; animation:blink 1.2s infinite; }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; display:flex; flex-direction:column; background:var(--ac-tile-bg, rgba(127,127,127,.09)); border-radius:10px; padding:6px 4px; }
      :host([tile-order="name"]) .stat { flex-direction:column-reverse; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } } @keyframes blink { 50% { opacity:.35; } }
      @keyframes wave { from { transform:translate(-12px, var(--wy,0px)); } to { transform:translate(8px, var(--wy,0px)); } }
    </style>
    <ha-card id="card" class="${photo ? 'photo-card ' : ''}sp-${['inside', 'below'].includes(this._config.status_position) ? this._config.status_position : 'auto'}${this._config.layout === 'split' ? ' layout-split' : ''}">
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge">${this._t('low')}</span></div>
      <svg viewBox="0 -6 320 176" id="svg">${photo ? this._photoScene() : `
        <defs>
          <linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f7f8f9"/><stop offset="1" stop-color="#e3e6e9"/></linearGradient>
          ${clips}
        </defs>
        ${[2, 1, 0].map((i) => mod(X[i], i)).join('')}
        ${cables.map((d) => `<path class="cable-b" d="${d}"/><path class="cable" d="${d}"/><path class="flow" d="${d}"/>`).join('')}
        <text class="state" id="state" x="${X[1] + W / 2}" y="${TOP + LID + 20}"></text>
        <text class="soc" id="soc" x="${X[1] + W / 2}" y="${TOP + LID + 52}"></text>
        <path class="bolt" d="M${X[1] + 44} ${TOP + LID + 60} l-9 13 h6 l-3 11 l9 -13 h-6 z"/>
        <path class="arrow" d="M${X[1] + 40} ${TOP + LID + 84} l-7 -9 h4 v-9 h6 v9 h4 z"/>`}
      </svg>
      <div class="status-line" id="statusline"></div>
      <div class="stats" id="stats"></div>
    </ha-card>`;
    window.applianceBindIllus(this, this.shadowRoot.getElementById('svg'), () => window.applianceMore(this, this._config.entity_soc || this._config.entity_power));
    this._built = true;
  }

  _num(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = parseFloat(s.state); return Number.isFinite(n) ? n : null;
  }

  // date d'une entité (sensor timestamp/date, input_datetime) formatée dans la langue de HA ; texte brut si non datable
  _date(id) {
    const st = this._hass && this._hass.states[id];
    if (!st || ['unavailable', 'unknown', ''].includes(st.state)) return '—';
    const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(st.state) ? `${st.state}T12:00:00` : st.state);
    if (isNaN(d)) return st.state;
    const opt = { day: 'numeric', month: 'short' };
    if (d.getFullYear() !== new Date().getFullYear()) opt.year = 'numeric';
    return d.toLocaleDateString(window.applianceLocale(this._config, this._hass), opt);
  }

  _update() {
    if (!this._built || !this._hass) return;
    const c = this._config, r = this.shadowRoot;
    const soc = this._num(c.entity_soc), energy = this._num(c.entity_energy);
    const tc = window.applianceTemp(this._hass, c), temp = tc.conv(this._num(c.entity_temperature), this._hass.states[c.entity_temperature]);
    let p = this._num(c.entity_power); if (p !== null && c.invert_power) p = -p;
    const pct = soc === null ? 0 : Math.max(0, Math.min(100, soc));
    // Remplissage des 3 modules (corps : y 62 → 160)
    const h = 98 * pct / 100;
    [0, 1, 2].forEach((i) => {
      const liq = r.getElementById(`liq${i}`); if (!liq) return;
      liq.setAttribute('y', 160 - h); liq.setAttribute('height', h);
      r.getElementById(`wave${i}`).style.setProperty('--wy', `${160 - h - 5}px`);
    });
    // modèle photo : le bandeau lumineux se remplit selon l'état de charge
    r.querySelectorAll('.mk-bar').forEach((el) => { const b = MARSTEK.bar; el.setAttribute('x2', (b.x1 + (b.x2 - b.x1) * pct / 100).toFixed(1)); el.style.opacity = pct > 0 ? 1 : 0; });
    r.querySelectorAll('#svg .soc').forEach((el) => { el.textContent = soc === null ? '—' : `${Math.round(pct)}%`; });
    const color = pct <= c.low_threshold ? '#e53935' : pct <= 40 ? '#fb8c00' : '#43a047';
    const svg = r.getElementById('svg'); svg.style.setProperty('--lc', color);
    const mode = p === null || Math.abs(p) < 10 ? 'idle' : p > 0 ? 'charging' : 'discharging';
    svg.classList.remove('charging', 'discharging', 'idle'); svg.classList.add(mode);
    r.querySelectorAll('#svg .state').forEach((el) => { el.textContent = this._t(mode).toUpperCase(); }); r.getElementById('statusline').textContent = this._t(mode).toUpperCase();
    const ratio = Math.min(Math.abs(p || 0) / c.max_power, 1);
    svg.style.setProperty('--fs', `${(1.4 - ratio * 1.1).toFixed(2)}s`);
    svg.style.setProperty('--bl', mode === 'idle' ? '3s' : '1s');
    r.getElementById('card').classList.toggle('low', soc !== null && pct <= c.low_threshold);

    // Temps restant avant plein / vide
    let time = null;
    if (c.show_time && p !== null && Math.abs(p) >= 10 && c.capacity_kwh) {
      const kwh = p > 0 ? c.capacity_kwh * (100 - pct) / 100 : c.capacity_kwh * pct / 100;
      const hrs = kwh * 1000 / Math.abs(p);
      time = `${p > 0 ? this._t('full') : this._t('empty')} ${Math.floor(hrs)}h${String(Math.round((hrs % 1) * 60)).padStart(2, '0')}`;
    }
    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), f(p === null ? null : Math.abs(p), 0, 'W'), c.entity_power]);
    if (c.show_energy) it.push([this._l('energy'), f(energy !== null ? energy : (soc === null ? null : c.capacity_kwh * pct / 100), 1, 'kWh'), c.entity_energy || c.entity_soc]);
    if (c.show_temperature) it.push([this._l('temp'), f(temp, 0, tc.unit), c.entity_temperature]);
    if (time) it.push(['⏱', time, c.entity_soc]);
    // prochaine calibration : date lue sur l'entité (ISO date / horodatage), sinon l'état tel quel
    if (c.show_calibration && c.entity_calibration) it.push([this._l('calibration'), this._date(c.entity_calibration), c.entity_calibration]);
    r.getElementById('stats').innerHTML = it.map(([l, v, id]) => `<div class="stat"${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
    window.applianceLinkTiles(r.getElementById('stats'), this);
  }
}
define('appliance-battery-card', ApplianceBatteryCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-battery-card', name: 'Appliance – Solar battery / Batterie solaire', names: Object.fromEntries(Object.keys(I18N_BAT).map((l) => [l, I18N_BAT[l].name])), description: 'Batterie de stockage solaire animée', preview: true });
})();
