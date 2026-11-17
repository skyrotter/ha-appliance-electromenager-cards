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
    "low": "Low battery",
    "backup": "Backup"
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
    "low": "Batterie faible",
    "backup": "Secours"
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
    "low": "Bateria fraca",
    "backup": "Backup"
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
    "low": "Bateria fraca",
    "backup": "Backup"
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
   que l'on recouvre pour le faire suivre l'état de charge ; cx : milieu de la face avant noire. Panneau latéral (prise de secours) à droite, comme sur l'appareil. */
const MARSTEK = { img: 'data:image/webp;base64,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', w: 360, h: 506, bar: { x1: 100, x2: 196, y: 59 }, led: { x: 147, y: 55 }, cx: 150 };
const MODELS = ['default', 'marstek_venus_e3'];
// couleur de la sortie de secours : nom CSS, #hex ou rgb() / hsl() (orange par défaut)
const BACKUP_COLOR = '#ffb02e';
const safeColor = (v) => { const k = String(v ?? '').trim(); return /^([a-z]{3,20}|#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/-]+\))$/i.test(k) ? k : ''; };

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
        // sortie de secours (off-grid) : puissance en W, tuile « Secours » et prise allumée sur la photo Marstek
        { name: 'entity_backup', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { type: 'grid', name: '', schema: [
          { name: 'backup_color', selector: { text: {} } },
          { name: 'flip', selector: { boolean: {} }, default: false },
        ] },
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
          { name: 'show_backup', selector: { boolean: {} }, default: true },
          { name: 'show_time', selector: { boolean: {} }, default: true },
          { name: 'show_calibration', selector: { boolean: {} }, default: true },
        ] },
        window.applianceTempField,
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'split'] } } },
        { name: 'status_position', selector: { select: { mode: 'dropdown', options: ['auto', 'inside', 'below'] } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(I18N_BAT),
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name === 'model' ? 'battery_model' : s.name === 'count' ? 'battery_count' : s.name === 'entity_backup' ? 'battery_entity_backup' : s.name === 'show_backup' ? 'battery_show_backup' : s.name === 'flip' ? 'battery_flip' : s.name),
    };
  }

  setConfig(config) {
    if (window.applianceSize) window.applianceSize(this, config);
    // Convention : puissance > 0 = charge (inverser avec invert_power si ton capteur est l'inverse)
    this._config = { show_power: true, show_energy: true, show_temperature: true, show_backup: true, show_time: true, show_calibration: true,
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
    const len = M.bar.x2 - M.bar.x1, fl = this._config.flip === true, cx = fl ? M.w - M.cx : M.cx;
    const unit = (i) => `
      <g transform="translate(${(x0 + i * (uw + gap)).toFixed(2)} ${y0.toFixed(2)}) scale(${s.toFixed(4)})">
        <g${fl ? ` transform="translate(${M.w} 0) scale(-1 1)"` : ''}>
        <image href="${M.img}" width="${M.w}" height="${M.h}"/>
        <rect x="${M.bar.x1 - 8}" y="${M.bar.y - 5}" width="${len + 16}" height="10" rx="2" fill="#121317"/>
        <rect x="${M.led.x - 9}" y="${M.led.y - 4}" width="18" height="8" rx="2" fill="#121317"/>
        <line x1="${M.bar.x1}" y1="${M.bar.y}" x2="${M.bar.x2}" y2="${M.bar.y}" stroke="#fff" stroke-opacity=".2" stroke-width="2.6" stroke-linecap="round"/>
        <rect class="mk-bk" x="308" y="139" width="39" height="38" rx="5"/>
        <line class="mk-bar" x1="${M.bar.x1}" y1="${M.bar.y}" x2="${M.bar.x1}" y2="${M.bar.y}" stroke-width="3.4" stroke-linecap="round"/>
        <rect class="led" x="${M.led.x - 7}" y="${M.led.y - 1.6}" width="14" height="3.2" rx="1.6"/>
        </g>
        <path class="bolt" d="M${cx + 6} 196 l-28 38 h17 l-9 32 l30 -41 h-18 z"/>
        <path class="arrow" d="M${cx} 266 l-28 -30 h17 v-34 h22 v34 h17 z"/>
        <text class="soc" x="${cx}" y="338" style="font-size:78px">%s</text>
        <text class="state" x="${cx}" y="378" style="font-size:19px"></text>
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
      .mk-bk { fill:var(--bk,#ffb02e); opacity:0; pointer-events:none; filter:drop-shadow(0 0 5px var(--bk,#ffb02e)); transition:opacity .5s; }
      .stat.bk .v { color:var(--bk,#ffb02e); }
      .backup-on .mk-bk { opacity:.8; animation:blink 1.6s infinite; }
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
    // sortie de secours (off-grid) : puissance en W (kW convertis), la prise s'allume sur la photo dès 10 W
    const bs = c.entity_backup && this._hass.states[c.entity_backup], bw = this._num(c.entity_backup) === null ? null : Math.abs(window.applianceWatts && bs ? window.applianceWatts(bs) : this._num(c.entity_backup));
    r.getElementById('svg').classList.toggle('backup-on', bw !== null && bw >= 10);
    const bkc = safeColor(c.backup_color) || BACKUP_COLOR;
    r.getElementById('svg').style.setProperty('--bk', bkc);
    if (c.show_backup !== false && c.entity_backup) it.push([this._l('backup'), f(bw, 0, 'W'), c.entity_backup, bkc]);
    if (time) it.push(['⏱', time, c.entity_soc]);
    // prochaine calibration : date lue sur l'entité (ISO date / horodatage), sinon l'état tel quel
    if (c.show_calibration && c.entity_calibration) it.push([this._l('calibration'), this._date(c.entity_calibration), c.entity_calibration]);
    r.getElementById('stats').innerHTML = it.map(([l, v, id, col]) => `<div class="stat${col ? ' bk' : ''}"${col ? ` style="--bk:${esc(col)}"` : ''}${window.applianceTileAttrs(id)}><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('');
    window.applianceLinkTiles(r.getElementById('stats'), this);
  }
}
define('appliance-battery-card', ApplianceBatteryCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'appliance-battery-card', name: 'Appliance – Solar battery / Batterie solaire', names: Object.fromEntries(Object.keys(I18N_BAT).map((l) => [l, I18N_BAT[l].name])), description: 'Batterie de stockage solaire animée', preview: true });
})();
