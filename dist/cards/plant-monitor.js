/* Carte « Moniteur de plante » — custom:appliance-plant-monitor-card
 * Capteur de plante BLE (Xiaomi Mi Flora / HHCC, Parrot Flower Power…) : humidité du sol, température, conductivité (engrais),
 * luminosité, batterie et signal. Quatre illustrations au choix (option style) :
 *   plant (SVG : plante panachée dans un pot), sensor (SVG : capteur planté dans la terre),
 *   plant_photo / sensor_photo (photos détourées de la plante et du capteur).
 * La terre s'assombrit avec l'humidité, les feuilles s'affaissent et une goutte appelle l'arrosage sous min_moisture ;
 * les autres seuils (min_temperature, min_brightness, min_conductivity, min_battery) déclenchent une alerte sur la carte.
 * États : ok, dry (à arroser), alert (autre seuil franchi), unavailable.
 */
(() => {
  const TAG = 'appliance-plant-monitor-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Plant monitor","ok":"Healthy","dry":"Needs water","cold":"Too cold","dark":"Not enough light","hungry":"Needs fertiliser","low_battery":"Low battery","unavailable":"Unavailable","moisture":"Soil moisture","temperature":"Temperature","conductivity":"Fertility","brightness":"Light","battery":"Battery","rssi":"Signal","style_plant":"Plant (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Plant (photo)","style_sensor_photo":"Sensor (photo)"},"da":{"name":"Plantesensor","ok":"Sund","dry":"Skal vandes","cold":"For koldt","dark":"For lidt lys","hungry":"Skal gødes","low_battery":"Lavt batteri","unavailable":"Utilgængelig","moisture":"Jordfugtighed","temperature":"Temperatur","conductivity":"Næring","brightness":"Lys","battery":"Batteri","rssi":"Signal","style_plant":"Plante (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Plante (foto)","style_sensor_photo":"Sensor (foto)"},"de":{"name":"Pflanzenmonitor","ok":"Gesund","dry":"Braucht Wasser","cold":"Zu kalt","dark":"Zu wenig Licht","hungry":"Braucht Dünger","low_battery":"Batterie schwach","unavailable":"Nicht verfügbar","moisture":"Bodenfeuchte","temperature":"Temperatur","conductivity":"Nährstoffe","brightness":"Licht","battery":"Batterie","rssi":"Signal","style_plant":"Pflanze (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Pflanze (Foto)","style_sensor_photo":"Sensor (Foto)"},"es":{"name":"Monitor de plantas","ok":"Sana","dry":"Necesita agua","cold":"Demasiado frío","dark":"Poca luz","hungry":"Necesita abono","low_battery":"Batería baja","unavailable":"No disponible","moisture":"Humedad del suelo","temperature":"Temperatura","conductivity":"Fertilidad","brightness":"Luz","battery":"Batería","rssi":"Señal","style_plant":"Planta (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Planta (foto)","style_sensor_photo":"Sensor (foto)"},"fr":{"name":"Moniteur de plante","ok":"En forme","dry":"Besoin d'eau","cold":"Trop froid","dark":"Manque de lumière","hungry":"Besoin d'engrais","low_battery":"Batterie faible","unavailable":"Indisponible","moisture":"Humidité du sol","temperature":"Température","conductivity":"Fertilité","brightness":"Luminosité","battery":"Batterie","rssi":"Signal","style_plant":"Plante (SVG)","style_sensor":"Capteur (SVG)","style_plant_photo":"Plante (photo)","style_sensor_photo":"Capteur (photo)"},"it":{"name":"Monitor della pianta","ok":"In forma","dry":"Ha bisogno di acqua","cold":"Troppo freddo","dark":"Poca luce","hungry":"Ha bisogno di concime","low_battery":"Batteria scarica","unavailable":"Non disponibile","moisture":"Umidità del terreno","temperature":"Temperatura","conductivity":"Fertilità","brightness":"Luce","battery":"Batteria","rssi":"Segnale","style_plant":"Pianta (SVG)","style_sensor":"Sensore (SVG)","style_plant_photo":"Pianta (foto)","style_sensor_photo":"Sensore (foto)"},"nl":{"name":"Plantenmonitor","ok":"Gezond","dry":"Heeft water nodig","cold":"Te koud","dark":"Te weinig licht","hungry":"Heeft mest nodig","low_battery":"Batterij bijna leeg","unavailable":"Niet beschikbaar","moisture":"Bodemvocht","temperature":"Temperatuur","conductivity":"Voedingswaarde","brightness":"Licht","battery":"Batterij","rssi":"Signaal","style_plant":"Plant (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Plant (foto)","style_sensor_photo":"Sensor (foto)"},"pt-BR":{"name":"Monitor de plantas","ok":"Saudável","dry":"Precisa de água","cold":"Muito frio","dark":"Luz insuficiente","hungry":"Precisa de fertilizante","low_battery":"Bateria fraca","unavailable":"Indisponível","moisture":"Umidade do solo","temperature":"Temperatura","conductivity":"Fertilidade","brightness":"Luz","battery":"Bateria","rssi":"Sinal","style_plant":"Planta (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Planta (foto)","style_sensor_photo":"Sensor (foto)"},"pt-PT":{"name":"Monitor de plantas","ok":"Saudável","dry":"Precisa de água","cold":"Demasiado frio","dark":"Luz insuficiente","hungry":"Precisa de fertilizante","low_battery":"Bateria fraca","unavailable":"Indisponível","moisture":"Humidade do solo","temperature":"Temperatura","conductivity":"Fertilidade","brightness":"Luz","battery":"Bateria","rssi":"Sinal","style_plant":"Planta (SVG)","style_sensor":"Sensor (SVG)","style_plant_photo":"Planta (fotografia)","style_sensor_photo":"Sensor (fotografia)"},"ru":{"name":"Датчик растения","ok":"В норме","dry":"Нужен полив","cold":"Слишком холодно","dark":"Мало света","hungry":"Нужно удобрение","low_battery":"Батарея разряжена","unavailable":"Недоступно","moisture":"Влажность почвы","temperature":"Температура","conductivity":"Плодородие","brightness":"Освещённость","battery":"Батарея","rssi":"Сигнал","style_plant":"Растение (SVG)","style_sensor":"Датчик (SVG)","style_plant_photo":"Растение (фото)","style_sensor_photo":"Датчик (фото)"},"sr":{"name":"Монитор за биљке","ok":"Здрава","dry":"Потребна вода","cold":"Прехладно","dark":"Недовољно светла","hungry":"Потребно ђубриво","low_battery":"Слаба батерија","unavailable":"Недоступно","moisture":"Влажност земљишта","temperature":"Температура","conductivity":"Плодност","brightness":"Светлост","battery":"Батерија","rssi":"Сигнал","style_plant":"Биљка (SVG)","style_sensor":"Сензор (SVG)","style_plant_photo":"Биљка (фотографија)","style_sensor_photo":"Сензор (фотографија)"},"sr-Latn":{"name":"Monitor za biljke","ok":"Zdrava","dry":"Potrebna voda","cold":"Prehladno","dark":"Nedovoljno svetla","hungry":"Potrebno đubrivo","low_battery":"Slaba baterija","unavailable":"Nedostupno","moisture":"Vlažnost zemljišta","temperature":"Temperatura","conductivity":"Plodnost","brightness":"Svetlost","battery":"Baterija","rssi":"Signal","style_plant":"Biljka (SVG)","style_sensor":"Senzor (SVG)","style_plant_photo":"Biljka (fotografija)","style_sensor_photo":"Senzor (fotografija)"},"uk":{"name":"Датчик рослини","ok":"Здорова","dry":"Потрібна вода","cold":"Занадто холодно","dark":"Мало світла","hungry":"Потрібне добриво","low_battery":"Низький заряд","unavailable":"Недоступно","moisture":"Вологість ґрунту","temperature":"Температура","conductivity":"Родючість","brightness":"Світло","battery":"Батарея","rssi":"Сигнал","style_plant":"Рослина (SVG)","style_sensor":"Датчик (SVG)","style_plant_photo":"Рослина (фото)","style_sensor_photo":"Датчик (фото)"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photos détourées (fond retiré, WebP transparent) : schefflera panaché en pot (260 × 332) et capteur Mi Flora (120 × 586)
  const IMG_PLANT = window.__acImg("plant-monitor",0);
  const IMG_SENSOR = window.__acImg("plant-monitor",1);
  const STYLES = ['plant', 'sensor', 'plant_photo', 'sensor_photo'];

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --pm-ok:var(--appliance-ok-color,#43a047);--pm-warn:var(--appliance-warn-color,#ffa000);--pm-alert:var(--appliance-alert-color,#db4437);
  --pm-water:#2b9af9;--m:.5;--wilt:0;--sun:.5}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ok .badge{background:color-mix(in srgb,var(--pm-ok) 22%,transparent);color:var(--pm-ok)}
.dry .badge{background:color-mix(in srgb,var(--pm-water) 22%,transparent);color:var(--pm-water)}
.alert .badge{background:color-mix(in srgb,var(--pm-warn) 26%,transparent);color:var(--pm-warn)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--pm-warn)}.tile.bad .v{color:var(--pm-water)}
/* ---- compact : petits emplacements fixes ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration ---- */
.shadow{opacity:.28}
.sunr{opacity:calc(var(--sun) * .9);transition:opacity 1s}.sunr .rays{transform-box:fill-box;transform-origin:50% 50%;animation:pmspin 40s linear infinite}
/* feuilles : angle de base --r, sens d'affaissement --d (±1) ; --wilt (0 à 50°) grandit quand la terre est sèche */
.lf{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--r) * 1deg + var(--wilt) * var(--d) * 1deg));transition:transform 1.6s ease;animation:pmsway 5s ease-in-out infinite alternate;animation-delay:calc(var(--i) * -.7s)}
.lf .g{fill:#4f9a45}.lf .g2{fill:#3d8338}.lf .y{fill:#e3d95a;opacity:.92}
.dry .lf .g,.alert.cold .lf .g{fill:#8f9c4c}.dry .lf .g2{fill:#7d8a40}.dry .lf .y{fill:#cdb94a}
.soilw{opacity:var(--m);transition:opacity 1.4s}
.sprout{fill:#43a047}.dry .sprout{fill:#d9a441}.alert .sprout{fill:var(--pm-warn)}
.led{fill:var(--pm-ok)}.dry .led{fill:var(--pm-water);animation:pmblink 1.2s steps(2) infinite}.alert .led{fill:var(--pm-warn)}
.ph{transition:filter 1.2s;transform-box:fill-box;transform-origin:50% 100%;animation:pmsway2 6s ease-in-out infinite alternate}
.dry .ph.pl{filter:saturate(.5) sepia(.45) brightness(.92)}.alert .ph.pl{filter:saturate(.75) sepia(.15)}
.drop{opacity:0;fill:var(--pm-water);transform-box:fill-box;transform-origin:50% 100%}
.dry .drop{opacity:1;animation:pmdrop 1.6s ease-in-out infinite}
.warnb{opacity:0}.alert .warnb{opacity:1;animation:pmblink 1.6s ease-in-out infinite}
.rgbat{opacity:0}.lowbat .rgbat{opacity:1;animation:pmblink 2s infinite}
.wdrop{fill:#6fb8ff;opacity:0}.ok .wdrop,.alert .wdrop{animation:pmseep 4s ease-in infinite}.wdrop:nth-of-type(2){animation-delay:-1.4s!important}.wdrop:nth-of-type(3){animation-delay:-2.7s!important}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
@keyframes pmsway{from{transform:rotate(calc(var(--r) * 1deg + var(--wilt) * var(--d) * 1deg - 1.2deg))}to{transform:rotate(calc(var(--r) * 1deg + var(--wilt) * var(--d) * 1deg + 1.2deg))}}
@keyframes pmsway2{from{transform:rotate(-.6deg)}to{transform:rotate(.6deg)}}
@keyframes pmspin{to{transform:rotate(360deg)}}
@keyframes pmblink{50%{opacity:.25}}
@keyframes pmdrop{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.12)}}
@keyframes pmseep{0%{opacity:0;transform:translateY(0)}20%{opacity:.8}100%{opacity:0;transform:translateY(22px)}}
`;

  // feuille (pointe en haut, base en 0,0) : limbe vert, nervure sombre, panachure jaune sur un côté
  const LEAF = (x, y, r, s, d, i) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="lf" style="--r:${r};--d:${d};--i:${i}">
    <path class="g" d="M0 0C-10 -9 -10 -30 0 -46C10 -30 10 -9 0 0Z"/><path class="g2" d="M0 0C-1 -14 -1 -32 0 -46" stroke="#2f6b2c" stroke-width="1" fill="none"/>
    <path class="y" d="M0 -2C4 -10 8 -22 3 -38C8 -28 10 -14 0 -2Z"/><path class="y" d="M-1 -10C-6 -16 -8 -26 -3 -35C-8 -26 -9 -17 -1 -10Z" opacity=".75"/></g></g>`;
  // feuilles en ombrelle autour de deux tiges
  const LEAVES = [[100, 96, -78, .75, -1, 0], [100, 96, 78, .75, 1, 1], [100, 100, -52, .95, -1, 2], [100, 100, 52, .95, 1, 3], [100, 92, -24, 1.05, -1, 4], [100, 92, 24, 1.05, 1, 5], [100, 88, 0, 1.1, 1, 6],
    [88, 118, -64, .7, -1, 7], [112, 118, 64, .7, 1, 8], [92, 112, -36, .8, -1, 9], [108, 112, 36, .8, 1, 10]];

  // terre vue en coupe : plus sombre quand elle est humide (--m), gouttes qui s'infiltrent
  const SOIL = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#b8926a"/>
    <rect class="soilw" x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#4a3322"/>
    ${[[.18, .3], [.42, .6], [.7, .35], [.82, .7], [.3, .82], [.58, .18]].map(([a, b]) => `<circle cx="${x + w * a}" cy="${y + h * b}" r="1.8" fill="#000" opacity=".16"/>`).join('')}
    <rect x="${x}" y="${y}" width="${w}" height="4" rx="2" fill="#000" opacity=".14"/>
    <circle class="wdrop" cx="${x + w * .3}" cy="${y + 8}" r="1.7"/><circle class="wdrop" cx="${x + w * .66}" cy="${y + 6}" r="1.7"/><circle class="wdrop" cx="${x + w * .82}" cy="${y + 10}" r="1.7"/></g>`;

  const FX = `<g class="sunr"><g class="rays" stroke="#ffcf3d" stroke-width="2" stroke-linecap="round">${[...Array(8)].map((_, k) => `<line x1="22" y1="${16 - 14}" x2="22" y2="${16 - 10}" transform="rotate(${k * 45} 22 16)"/>`).join('')}</g><circle cx="22" cy="16" r="6.5" fill="#ffd54a"/></g>
    <path class="drop" d="M152 14C145 24 143 30 143 34a9 9 0 0 0 18 0C161 30 159 24 152 14Z"/>
    <g class="warnb"><circle cx="152" cy="26" r="10" fill="#ffa000"/><rect x="150.6" y="20" width="2.8" height="8" rx="1.2" fill="#fff"/><circle cx="152" cy="31.2" r="1.7" fill="#fff"/></g>
    <g class="rgbat"><rect x="168" y="6" width="20" height="11" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="188" y="8.5" width="3" height="6" fill="#ffa000"/><rect x="171" y="9" width="4" height="5" fill="#ffa000"/></g>`;

  const SCENES = {
    // plante panachée dans un pot en terre cuite
    plant: () => `<ellipse class="shadow" cx="100" cy="184" rx="52" ry="5" fill="#000"/>
      <path d="M100 150C99 130 100 112 100 96M100 150C96 136 91 126 88 118M100 150C104 136 109 126 112 118" stroke="#6b5a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${LEAVES.map((l) => LEAF(...l)).join('')}
      <path d="M62 150H138L128 184Q127 187 123 187H77Q73 187 72 184Z" fill="#c4683e"/><path d="M62 150H138L136 158H64Z" fill="#d9794a"/><path d="M62 150H138L136 158H64Z" fill="#000" opacity=".08"/>
      <path d="M64 158H136" stroke="#000" stroke-opacity=".14"/><path d="M74 160L78 184" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="100" cy="151" rx="38" ry="5.5" fill="#b8926a"/><ellipse class="soilw" cx="100" cy="151" rx="38" ry="5.5" fill="#4a3322"/>`,
    // capteur Mi Flora planté dans la terre (coupe), tête blanche et fourche noire
    sensor: () => `<ellipse class="shadow" cx="100" cy="186" rx="64" ry="4" fill="#000"/>
      <g><path d="M90 100H110V150H90Z" fill="#1d1f23"/><rect x="88" y="52" width="24" height="62" rx="9" fill="#f3f5f6"/><rect x="88" y="52" width="24" height="62" rx="9" fill="url(#pmhead)"/>
      <path class="sprout" d="M100 94V82M100 84C94 84 92 79 92 75C98 75 100 79 100 84M100 82C106 82 108 77 108 73C102 73 100 77 100 82Z" stroke="#43a047" stroke-width="1.4" fill-rule="evenodd"/>
      <circle class="led" cx="100" cy="62" r="2.2"/>
      <path d="M90 112H110V168Q110 172 108 172H102V128H98V172H92Q90 172 90 168Z" fill="#202328"/><circle cx="94" cy="160" r="2.2" fill="#c7ccd2"/><circle cx="106" cy="160" r="2.2" fill="#c7ccd2"/></g>
      ${SOIL(26, 120, 148, 60)}
      <g><path d="M86 120H114V176H102V132H98V176H86Z" fill="none"/></g>
      <rect x="88" y="52" width="24" height="12" rx="6" fill="#fff" opacity=".35"/>`,
    // photo détourée de la plante, posée sur son ombre
    plant_photo: () => `<ellipse class="shadow" cx="100" cy="184" rx="50" ry="5" fill="#000"/>
      <image class="ph pl" href="${IMG_PLANT}" x="38" y="14" width="124" height="158" preserveAspectRatio="xMidYMax meet"/>`,
    // photo détourée du capteur planté dans la terre
    sensor_photo: () => `<ellipse class="shadow" cx="100" cy="186" rx="64" ry="4" fill="#000"/>
      <image href="${IMG_SENSOR}" x="85" y="20" width="30" height="150" preserveAspectRatio="xMidYMin meet"/>
      ${SOIL(26, 120, 148, 60)}`,
  };
  const SVG = (style, label) => `<svg viewBox="0 0 200 190" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="pmhead" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>
    ${FX}${(SCENES[style] || SCENES.plant)()}</svg>`;

  const TILES = [['moisture', 'mdi:water-percent', 'show_moisture'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['conductivity', 'mdi:flash', 'show_conductivity'],
    ['brightness', 'mdi:white-balance-sunny', 'show_brightness'], ['battery', 'mdi:battery', 'show_battery'], ['rssi', 'mdi:wifi', 'show_rssi']];
  const ENT = Object.fromEntries(TILES.map(([k]) => [k, `entity_${k}`]));
  // seuils d'alerte : [tuile, option, état affiché] par ordre de priorité
  const LIMITS = [['moisture', 'min_moisture', 'dry'], ['temperature', 'min_temperature', 'cold'], ['brightness', 'min_brightness', 'dark'], ['conductivity', 'min_conductivity', 'hungry'], ['battery', 'min_battery', 'low_battery']];

  class AppliancePlantMonitorCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_moisture: ids.find((i) => /^sensor\./.test(i) && /(moisture|humidit|soil|plant|flower|flora)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { style: 'plant', min_moisture: 20, min_battery: 15, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _style() { return STYLES.includes(this._c.style) ? this._c.style : 'plant'; }

    // état global : premier seuil franchi (priorité : humidité, température, lumière, engrais, batterie)
    _compute() {
      const c = this._c, v = Object.fromEntries(TILES.map(([k]) => [k, this._num(c[ENT[k]])]));
      const known = TILES.some(([k]) => !isNaN(v[k]) || this._ok(this._st(c[ENT[k]])));
      const hit = {};
      LIMITS.forEach(([k, opt]) => { const lim = c[opt] === '' || c[opt] == null ? NaN : Number(c[opt]); hit[k] = isFinite(lim) && !isNaN(v[k]) && v[k] < lim; });
      const first = LIMITS.find(([k]) => hit[k]);
      const msg = !known ? 'unavailable' : first ? first[2] : 'ok';
      const st = !known ? 'unavailable' : !first ? 'ok' : first[0] === 'moisture' ? 'dry' : 'alert';
      return { v, hit, msg, st, low: !!hit.battery, cold: !!hit.temperature };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="pmtitle"></div><div class="badge" id="pmbadge"></div></div>
        <div class="body">${SVG(this._style(), this._c.name || this._t('name'))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_moisture || TILES.map(([k]) => this._c[ENT[k]]).find(Boolean)));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { v, hit, msg, st, low, cold } = this._compute();
      card.className = `${st}${low ? ' lowbat' : ''}${cold ? ' cold' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      // humidité 0-1 (terre), affaissement des feuilles (0 à 50°) quand l'humidité passe sous le seuil, soleil selon la luminosité (0 à 20 000 lx)
      const m = isNaN(v.moisture) ? .5 : Math.max(0, Math.min(1, v.moisture / 100));
      const lim = Number(c.min_moisture) > 0 ? Number(c.min_moisture) : 20;
      const wilt = st === 'unavailable' || isNaN(v.moisture) ? 0 : Math.max(0, Math.min(1, (lim * 1.15 - v.moisture) / (lim * 1.15))) * 50;
      card.style.setProperty('--m', m.toFixed(3));
      card.style.setProperty('--wilt', wilt.toFixed(1));
      card.style.setProperty('--sun', isNaN(v.brightness) ? '0' : String(Math.max(.08, Math.min(1, v.brightness / 20000)).toFixed(2)));
      r.getElementById('pmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('pmbadge');
      badge.textContent = this._t(msg);
      badge.style.display = c.show_status === false ? 'none' : '';

      const dec = { moisture: 0, temperature: 1, conductivity: 0, brightness: 0, battery: 0, rssi: 0 }, dflt = { moisture: '%', temperature: '°C', conductivity: 'µS/cm', brightness: 'lx', battery: '%', rssi: 'dBm' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), id = c[ENT[k]];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.classList.toggle('bad', k === 'moisture' && hit.moisture);
        el.classList.toggle('warn', k !== 'moisture' && !!hit[k]);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = isNaN(v[k]) ? '' : this._unit(id, dflt[k]);
        el.querySelector('.v').replaceChildren(this._fmt(v[k], dec[k]), small);
      });
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, AppliancePlantMonitorCard);

  /* ---- éditeur visuel ---- */
  class AppliancePlantMonitorCardEditor extends HTMLElement {
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
      const num = (name, def, min, max, step, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', unit_of_measurement: unit } } });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'style', selector: { select: { mode: 'dropdown', options: STYLES.map((value) => ({ value, label: tr[`style_${value}`] || T.en[`style_${value}`] || value })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_moisture', 'sensor'), ent('entity_temperature', 'sensor'), ent('entity_conductivity', 'sensor'), ent('entity_brightness', 'sensor'), ent('entity_battery', 'sensor'), ent('entity_rssi', 'sensor'),
        { type: 'grid', name: '', schema: [num('min_moisture', 20, 0, 100, 1, '%'), num('min_temperature', undefined, -20, 60, 0.5, '°C'), num('min_conductivity', undefined, 0, 5000, 10, 'µS/cm'),
          num('min_brightness', undefined, 0, 100000, 100, 'lx'), num('min_battery', 15, 0, 100, 1, '%')] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', AppliancePlantMonitorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Moniteur de plante animé (Mi Flora, Flower Power…) : humidité du sol, température, conductivité, luminosité, batterie, signal ; plante ou capteur en SVG ou en photo, alertes sur seuils.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/plant-monitor.md',
  });
})();
