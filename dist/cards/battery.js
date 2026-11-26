/* ================================================================== */
/* appliance-battery-card.js                                        */
/* ================================================================== */
(() => {
"use strict";
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr
const define = (tag, cls) => { if (!(window.__acHasReal||customElements.get.bind(customElements))(tag)) customElements.define(tag, cls); };
window.customCards = window.customCards || [];
/* appliance-battery-card — batterie de stockage solaire animée (niveau liquide, flux charge/décharge)
 * type: custom:appliance-battery-card
 */
const I18N_BAT = {"en":{"name":"Solar battery","calibration":"Next calibration","soc":"Charge","power":"Power","energy":"Energy","temp":"Temperature","charging":"Charging","discharging":"Discharging","idle":"Idle","full":"Full in","empty":"Empty in","low":"Low battery","backup":"Backup","soc_min":"Min charge","soc_max":"Max charge","mode":"Mode"},"cs":{"name":"Solární baterie","soc":"Nabití","power":"Výkon","energy":"Energie","temp":"Teplota","charging":"Nabíjí se","discharging":"Vybíjí se","idle":"Nečinná","full":"Plná za","empty":"Prázdná za","low":"Slabá baterie"},"da":{"name":"Solcellebatteri","soc":"Opladning","power":"Effekt","energy":"Energi","temp":"Temperatur","charging":"Oplader","discharging":"Aflader","idle":"Inaktiv","full":"Fuld om","empty":"Tom om","low":"Lavt batteri"},"de":{"name":"Solarbatterie","soc":"Ladestand","power":"Leistung","energy":"Energie","temp":"Temperatur","charging":"Lädt","discharging":"Entlädt","idle":"Ruhe","full":"Voll in","empty":"Leer in","low":"Batterie schwach"},"es":{"name":"Batería solar","calibration":"Próxima calibración","soc":"Carga","power":"Potencia","energy":"Energía","temp":"Temperatura","charging":"Cargando","discharging":"Descargando","idle":"Inactiva","full":"Llena en","empty":"Vacía en","low":"Batería baja","backup":"Respaldo","soc_min":"Carga mín.","soc_max":"Carga máx.","mode":"Modo"},"fr":{"name":"Batterie solaire","calibration":"Prochaine calibration","soc":"Charge","power":"Puissance","energy":"Énergie","temp":"Température","charging":"En charge","discharging":"En décharge","idle":"Repos","full":"Plein dans","empty":"Vide dans","low":"Batterie faible","backup":"Secours","soc_min":"Charge min","soc_max":"Charge max","mode":"Mode"},"hu":{"name":"Napelem akkumulátor","soc":"Töltöttség","power":"Teljesítmény","energy":"Energia","temp":"Hőmérséklet","charging":"Töltés","discharging":"Kisütés","idle":"Tétlen","full":"Tele","empty":"Üres","low":"Alacsony akkuszint"},"it":{"name":"Batteria domestica","soc":"Carica","power":"Potenza","energy":"Energia","temp":"Temperatura","charging":"In carica","discharging":"In scarica","idle":"Inattiva","full":"Carica completa tra","empty":"Scarica completa tra","low":"Batteria scarica"},"nb":{"name":"Solbatteri","soc":"Ladning","power":"Effekt","energy":"Energi","temp":"Temperatur","charging":"Lader","discharging":"Utlader","idle":"Inaktiv","full":"Full om","empty":"Tom om","low":"Lavt batteri"},"nl":{"name":"Thuisbatterij","soc":"Lading","power":"Vermogen","energy":"Energie","temp":"Temperatuur","charging":"Laden","discharging":"Ontladen","idle":"Inactief","full":"Vol over","empty":"Leeg over","low":"Batterij bijna leeg"},"pl":{"name":"Bateria słoneczna","soc":"Ładowanie","power":"Moc","energy":"Energia","temp":"Temperatura","charging":"Ładowanie","discharging":"Rozładowywanie","idle":"Bezczynny","full":"Pełna za","empty":"Pusta za","low":"Niski poziom baterii"},"pt-BR":{"name":"Bateria solar","calibration":"Próxima calibração","soc":"Carga","power":"Potência","energy":"Energia","temp":"Temperatura","charging":"Carregando","discharging":"Descarregando","idle":"Inativo","full":"Cheia em","empty":"Vazia em","low":"Bateria fraca","backup":"Backup","soc_min":"Carga mín.","soc_max":"Carga máx.","mode":"Modo"},"pt-PT":{"name":"Bateria solar","calibration":"Próxima calibração","soc":"Carga","power":"Potência","energy":"Energia","temp":"Temperatura","charging":"A carregar","discharging":"A descarregar","idle":"Inativo","full":"Cheia em","empty":"Vazia em","low":"Bateria fraca","backup":"Backup","soc_min":"Carga mín.","soc_max":"Carga máx.","mode":"Modo"},"ro":{"name":"Baterie solară","soc":"Încărcare","power":"Putere","energy":"Energie","temp":"Temperatură","charging":"Se încarcă","discharging":"Se descarcă","idle":"Repaus","full":"Plină în","empty":"Goală în","low":"Baterie slabă"},"ru":{"name":"Солнечная батарея","calibration":"Следующая калибровка","soc":"Заряд","power":"Мощность","energy":"Энергия","temp":"Температура","charging":"Зарядка","discharging":"Разрядка","idle":"Простой","full":"Полный заряд через","empty":"Разрядка через","low":"Низкий заряд","backup":"Резервный выход","soc_min":"Мин. заряд","soc_max":"Макс. заряд","mode":"Режим"},"sr":{"name":"Соларна батерија","soc":"Напуњеност","power":"Снага","energy":"Енергија","temp":"Температура","charging":"Пуњење","discharging":"Пражњење","idle":"У стању мировања","full":"Пуна за","empty":"Празна за","low":"Батерија је ниска"},"sr-Latn":{"name":"Solarna baterija","soc":"Napunjenost","power":"Snaga","energy":"Energija","temp":"Temperatura","charging":"Punjenje","discharging":"Pražnjenje","idle":"U stanju mirovanja","full":"Puna za","empty":"Prazna za","low":"Baterija je niska"},"uk":{"name":"Сонячний акумулятор","calibration":"Наступне калібрування","soc":"Заряд","power":"Потужність","energy":"Енергія","temp":"Температура","charging":"Заряджається","discharging":"Розряджається","idle":"Очікування","full":"Повний через","empty":"Порожній через","low":"Низький заряд","backup":"Резерв","soc_min":"Мін. заряд","soc_max":"Макс. заряд","mode":"Режим"}};
// Home Assistant language, used when `language` option is not explicitly set
const lang = (h, cfg) => window.applianceLang(I18N_BAT, cfg, h);
/* Photo détourée : Marstek Venus E 3.0 (360 × 506 px). bar / led : emplacement du bandeau lumineux « BATTERY » de la photo,
   que l'on recouvre pour le faire suivre l'état de charge ; cx : milieu de la face avant noire. Panneau latéral (prise de secours) à droite, comme sur l'appareil. */
const MARSTEK = { img: window.__acImg("battery",0), w: 360, h: 506, bar: { x1: 100, x2: 196, y: 59 }, led: { x: 147, y: 55 }, cx: 150 };
/* Photo détourée : Zendure SolarFlow 2400 AC+ (370 × 314 px). L'icône batterie de l'écran (pastille noire) est recouverte puis redessinée :
   ses 4 segments suivent l'état de charge. cx : milieu de la face avant. */
const ZENDURE = { img: window.__acImg("battery",1), w: 370, h: 314, cx: 200, bat: { x: 188, y: 47, w: 24, h: 11 },
  soc: { y: 250, fs: 56 }, state: { y: 267, fs: 15 }, ic: { x: 200, y: 132, k: .8 } };
/* Photo détourée : Zendure SolarFlow 800 Plus (313 × 193 px). Même principe que le 2400 AC+ : l'icône batterie du petit écran (pastille noire,
   entre l'icône de puissance et celle du Wi-Fi) est recouverte puis redessinée à 4 segments ; le % et l'état sont écrits sur la face avant. */
const ZENDURE_SF = { img: window.__acImg("battery",2), w: 313, h: 193, cx: 157, bat: { x: 147, y: 17.8, w: 19.5, h: 8.9 },
  soc: { y: 122, fs: 40 }, state: { y: 140, fs: 11 }, ic: { x: 85, y: 90, k: .42 } };
const MODELS = ['default', 'marstek_venus_e3', 'zendure_ac2400', 'zendure_sf800_plus'];
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
        { name: 'entity_charge_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_discharge_power', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { name: 'entity_energy', selector: { entity: { domain: 'sensor', device_class: 'energy' } } },
        { name: 'entity_temperature', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
        // sortie de secours (off-grid) : puissance en W, tuile « Secours » et prise allumée sur la photo Marstek
        { name: 'entity_backup', selector: { entity: { domain: 'sensor', device_class: 'power' } } },
        { type: 'grid', name: '', schema: [
          { name: 'backup_color', selector: { text: {} } },
          { name: 'flip', selector: { boolean: {} }, default: false },
        ] },
        // limites de charge (SOC min / max) et mode de fonctionnement : entités number / select (ex. Zendure)
        { name: 'entity_soc_min', selector: { entity: { domain: ['number', 'input_number', 'sensor'] } } },
        { name: 'entity_soc_max', selector: { entity: { domain: ['number', 'input_number', 'sensor'] } } },
        { name: 'entity_mode', selector: { entity: { domain: ['select', 'input_select', 'sensor'] } } },
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
          { name: 'show_soc_min', selector: { boolean: {} }, default: true },
          { name: 'show_soc_max', selector: { boolean: {} }, default: true },
          { name: 'show_mode', selector: { boolean: {} }, default: true },
        ] },
        window.applianceTempField,
        { name: 'layout', selector: { select: { mode: 'dropdown', options: ['default', 'split'] } } },
        { name: 'status_position', selector: { select: { mode: 'dropdown', options: ['auto', 'inside', 'below'] } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(I18N_BAT),
      ],
      computeLabel: (s) => window.applianceEditorLabel(s.name === 'model' ? 'battery_model' : s.name === 'count' ? 'battery_count' : s.name === 'entity_backup' ? 'battery_entity_backup' : s.name === 'entity_mode' ? 'battery_entity_mode' : s.name === 'show_mode' ? 'battery_show_mode' : s.name === 'show_backup' ? 'battery_show_backup' : s.name === 'flip' ? 'battery_flip' : s.name),
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

  // Scène « photo » Zendure SolarFlow 2400 AC+ : icône batterie de l'écran à 4 segments, état de charge, flux (count : plusieurs unités côte à côte)
  _zendureScene() {
    const M = this._config.model === 'zendure_sf800_plus' ? ZENDURE_SF : ZENDURE, n = Math.max(1, Math.min(4, Math.round(Number(this._config.count)) || 1)), gap = 12;
    const s = Math.min(168 / M.h, (300 - (n - 1) * gap) / (n * M.w)), uw = M.w * s, total = n * uw + (n - 1) * gap, x0 = (320 - total) / 2, y0 = -2 + (168 - M.h * s) / 2;
    // icône batterie dessinée dans un repère 24 × 11 (celui du 2400 AC+), mise à l'échelle de l'écran du modèle
    const b = M.bat, kb = b.w / 24, ic = M.ic, unit = (i) => `
      <g transform="translate(${(x0 + i * (uw + gap)).toFixed(2)} ${y0.toFixed(2)}) scale(${s.toFixed(4)})">
        <image href="${M.img}" width="${M.w}" height="${M.h}"/>
        <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${(3 * kb).toFixed(1)}" fill="#0a0a0a"/>
        <g transform="translate(${b.x} ${b.y}) scale(${kb.toFixed(4)})">
          <rect class="zd-ol" x="2" y="2" width="19" height="7" rx="1.8"/>
          <rect class="zd-tip" x="21.6" y="4" width="1.3" height="3" rx=".6"/>
          ${[0, 1, 2, 3].map((k) => `<rect class="zd-seg" data-i="${k}" x="${(3.2 + k * 4.2).toFixed(1)}" y="3.2" width="3.2" height="4.6" rx=".5"/>`).join('')}
        </g>
        <path class="bolt" transform="translate(${ic.x} ${ic.y}) scale(${ic.k})" d="M6 0 l-28 38 h17 l-9 32 l30 -41 h-18 z"/>
        <path class="arrow" transform="translate(${ic.x} ${ic.y}) scale(${ic.k})" d="M0 70 l-28 -30 h17 v-34 h22 v34 h17 z"/>
        <text class="soc" x="${M.cx}" y="${M.soc.y}" style="font-size:${M.soc.fs}px"></text>
        <text class="state" x="${M.cx}" y="${M.state.y}" style="font-size:${M.state.fs}px"></text>
      </g>`;
    return Array.from({ length: n }, (_, i) => unit(i)).join('');
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const zendure = ['zendure_ac2400', 'zendure_sf800_plus'].includes(this._config.model), photo = this._config.model === 'marstek_venus_e3' || zendure;
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
      .zendure .soc { fill:#27303a; opacity:.92; } .zendure .state { fill:#4a5561; }
      .zd-seg { fill:var(--lc,#43a047); opacity:.12; filter:drop-shadow(0 0 1.2px var(--lc,#43a047)); transition:opacity .4s, fill .8s; } .zd-seg.on { opacity:1; }
      .charging .zd-seg.last { animation:blink 1s infinite; } .zd-ol { fill:none; stroke:var(--lc,#43a047); stroke-width:1.1; transition:stroke .8s; } .zd-tip { fill:var(--lc,#43a047); }
      .bolt { fill:#ffb300; opacity:0; } .charging .bolt { opacity:1; animation:blink 1.2s infinite; }
      .arrow { fill:#00acc1; opacity:0; } .discharging .arrow { opacity:1; animation:blink 1.2s infinite; }
      .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(78px,1fr)); gap:8px; margin-top:6px; }
      .stat { text-align:center; display:flex; flex-direction:column; background:var(--ac-tile-bg, rgba(127,127,127,.09)); border-radius:10px; padding:6px 4px; }
      :host([tile-order="name"]) .stat { flex-direction:column-reverse; }
      .stat .v { font-weight:700; font-size:1.05em; } .stat .l { font-size:.7em; opacity:.65; text-transform:uppercase; letter-spacing:.04em; }
      @keyframes dash { to { stroke-dashoffset:-11; } } @keyframes blink { 50% { opacity:.35; } }
      @keyframes wave { from { transform:translate(-12px, var(--wy,0px)); } to { transform:translate(8px, var(--wy,0px)); } }
    </style>
    <ha-card id="card" class="${photo ? 'photo-card ' : ''}${zendure ? 'zendure ' : ''}sp-${['inside', 'below'].includes(this._config.status_position) ? this._config.status_position : 'auto'}${this._config.layout === 'split' ? ' layout-split' : ''}">
      <div class="title"><span>${esc(this._config.name || this._t('name'))}</span><span class="badge">${this._t('low')}</span></div>
      <svg viewBox="0 -6 320 176" id="svg">${zendure ? this._zendureScene() : photo ? this._photoScene() : `
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
  // puissance en W (capteur en W, kW ou MW converti)
  _w(id) {
    if (!id || !this._hass) return null;
    const s = this._hass.states[id];
    if (!s || ['unavailable', 'unknown'].includes(s.state)) return null;
    const n = window.applianceWatts ? window.applianceWatts(s) : parseFloat(s.state); return Number.isFinite(n) ? n : null;
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
    let p = this._w(c.entity_power);
    // deux capteurs séparés (ex. Zendure : puissance vers la batterie / depuis la batterie) : charge − décharge, positif = charge
    if (!c.entity_power && (c.entity_charge_power || c.entity_discharge_power)) {
      const ch = this._w(c.entity_charge_power), di = this._w(c.entity_discharge_power);
      p = ch === null && di === null ? null : (ch || 0) - (di || 0);
    }
    if (p !== null && c.invert_power) p = -p; // invert_power s'applique au capteur signé comme à la paire charge / décharge
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
    // Zendure : segments de l'icône batterie (4 × 25 %), le dernier allumé clignote pendant la charge
    const lit = soc === null ? 0 : Math.ceil(pct / 25);
    r.querySelectorAll('.zd-seg').forEach((el) => { const k = +el.dataset.i; el.classList.toggle('on', k < lit); el.classList.toggle('last', k === lit - 1); });
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
      // minutes totales arrondies d'abord, puis découpées (évite « 1h60 »)
      const mins = Math.round(kwh * 60000 / Math.abs(p));
      time = `${p > 0 ? this._t('full') : this._t('empty')} ${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}`;
    }
    const f = (v, d, u) => (v === null ? '—' : `${v.toFixed(d)} ${u}`);
    const it = [];
    if (c.show_power) it.push([this._l('power'), f(p === null ? null : Math.abs(p), 0, 'W'), c.entity_power || c.entity_charge_power || c.entity_discharge_power]);
    if (c.show_energy) it.push([this._l('energy'), f(energy !== null ? energy : (soc === null ? null : c.capacity_kwh * pct / 100), 1, 'kWh'), c.entity_energy || c.entity_soc]);
    if (c.show_temperature) it.push([this._l('temp'), f(temp, 0, tc.unit), c.entity_temperature]);
    // limites de charge et mode de fonctionnement (ex. Zendure : number min_soc / soc_set, select du mode)
    if (c.entity_soc_min && c.show_soc_min !== false) it.push([this._l('soc_min'), f(this._num(c.entity_soc_min), 0, '%'), c.entity_soc_min]);
    if (c.entity_soc_max && c.show_soc_max !== false) it.push([this._l('soc_max'), f(this._num(c.entity_soc_max), 0, '%'), c.entity_soc_max]);
    if (c.entity_mode && c.show_mode !== false) {
      const ms = this._hass.states[c.entity_mode];
      let mv = !ms || ['unavailable', 'unknown'].includes(ms.state) ? '—' : ms.state;
      try { if (ms && mv !== '—' && this._hass.formatEntityState) mv = this._hass.formatEntityState(ms) || mv; } catch (e) { /* état brut */ }
      it.push([this._l('mode'), mv, c.entity_mode]);
    }
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
