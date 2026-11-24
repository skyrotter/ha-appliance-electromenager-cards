/* Carte « Baromètre » — custom:appliance-barometer-card
 * Baromètre analogique (cadran argenté avec hygromètre et thermomètre, photo détourée) dont les aiguilles sont dessinées en direct :
 * la grande aiguille suit la pression (hPa), les deux petites l'humidité et la température. Aiguille de repère optionnelle
 * (reference_pressure). Zones météo : tempête, pluie, variable, beau temps. Les pressions en kPa / Pa / inHg / mmHg sont converties en hPa.
 */
(() => {
  const TAG = 'appliance-barometer-card';
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Barometer",
      "storm": "Storm",
      "rain": "Rain",
      "change": "Changeable",
      "fair": "Fair weather",
      "unavailable": "Unavailable",
      "pressure": "Pressure",
      "temperature": "Temperature",
      "humidity": "Humidity",
      "f_entity_pressure": "Pressure sensor (hPa)",
      "f_reference_pressure": "Reference hand (hPa, optional)",
      "f_show_pressure": "pressure tile",
      "f_show_temperature": "temperature tile",
      "f_show_humidity": "humidity tile"
    },
    "cs": {
      "name": "Barometr",
      "storm": "Bouře",
      "rain": "Déšť",
      "change": "Proměnlivo",
      "fair": "Pěkné počasí",
      "unavailable": "Nedostupné",
      "pressure": "Tlak",
      "temperature": "Teplota",
      "humidity": "Vlhkost",
      "f_entity_pressure": "Snímač tlaku (hPa)",
      "f_reference_pressure": "Ručička pro porovnání (hPa, volitelně)",
      "f_show_pressure": "dlaždice tlaku",
      "f_show_temperature": "dlaždice teploty",
      "f_show_humidity": "dlaždice vlhkosti"
    },
    "da": {
      "name": "Barometer",
      "storm": "Storm",
      "rain": "Regn",
      "change": "Ustadigt",
      "fair": "Godt vejr",
      "unavailable": "Utilgængelig",
      "pressure": "Lufttryk",
      "temperature": "Temperatur",
      "humidity": "Luftfugtighed",
      "f_entity_pressure": "Tryksensor (hPa)",
      "f_reference_pressure": "Referencevisér (hPa, valgfri)",
      "f_show_pressure": "trykfelt",
      "f_show_temperature": "temperaturfelt",
      "f_show_humidity": "fugtighedsfelt"
    },
    "de": {
      "name": "Barometer",
      "storm": "Sturm",
      "rain": "Regen",
      "change": "Wechselhaft",
      "fair": "Schönes Wetter",
      "unavailable": "Nicht verfügbar",
      "pressure": "Luftdruck",
      "temperature": "Temperatur",
      "humidity": "Luftfeuchtigkeit",
      "f_entity_pressure": "Drucksensor (hPa)",
      "f_reference_pressure": "Merkzeiger (hPa, optional)",
      "f_show_pressure": "Druck-Kachel",
      "f_show_temperature": "Temperatur-Kachel",
      "f_show_humidity": "Feuchte-Kachel"
    },
    "es": {
      "name": "Barómetro",
      "storm": "Tormenta",
      "rain": "Lluvia",
      "change": "Variable",
      "fair": "Buen tiempo",
      "unavailable": "No disponible",
      "pressure": "Presión",
      "temperature": "Temperatura",
      "humidity": "Humedad",
      "f_entity_pressure": "Sensor de presión (hPa)",
      "f_reference_pressure": "Aguja de referencia (hPa, opcional)",
      "f_show_pressure": "tarjeta de presión",
      "f_show_temperature": "tarjeta de temperatura",
      "f_show_humidity": "tarjeta de humedad"
    },
    "fr": {
      "name": "Baromètre",
      "storm": "Tempête",
      "rain": "Pluie",
      "change": "Variable",
      "fair": "Beau temps",
      "unavailable": "Indisponible",
      "pressure": "Pression",
      "temperature": "Température",
      "humidity": "Humidité",
      "f_entity_pressure": "Capteur de pression (hPa)",
      "f_reference_pressure": "Aiguille de repère (hPa, optionnel)",
      "f_show_pressure": "tuile pression",
      "f_show_temperature": "tuile température",
      "f_show_humidity": "tuile humidité"
    },
    "hu": {
      "name": "Barométer",
      "storm": "Vihar",
      "rain": "Eső",
      "change": "Változékony",
      "fair": "Szép idő",
      "unavailable": "Nem elérhető",
      "pressure": "Légnyomás",
      "temperature": "Hőmérséklet",
      "humidity": "Páratartalom",
      "f_entity_pressure": "Nyomásérzékelő (hPa)",
      "f_reference_pressure": "Referenciamutató (hPa, opcionális)",
      "f_show_pressure": "nyomás csempe",
      "f_show_temperature": "hőmérséklet csempe",
      "f_show_humidity": "páratartalom csempe"
    },
    "it": {
      "name": "Barometro",
      "storm": "Tempesta",
      "rain": "Pioggia",
      "change": "Variabile",
      "fair": "Bel tempo",
      "unavailable": "Non disponibile",
      "pressure": "Pressione",
      "temperature": "Temperatura",
      "humidity": "Umidità",
      "f_entity_pressure": "Sensore di pressione (hPa)",
      "f_reference_pressure": "Lancetta di riferimento (hPa, opzionale)",
      "f_show_pressure": "riquadro pressione",
      "f_show_temperature": "riquadro temperatura",
      "f_show_humidity": "riquadro umidità"
    },
    "nb": {
      "name": "Barometer",
      "storm": "Storm",
      "rain": "Regn",
      "change": "Ustabilt",
      "fair": "Pent vær",
      "unavailable": "Utilgjengelig",
      "pressure": "Lufttrykk",
      "temperature": "Temperatur",
      "humidity": "Luftfuktighet",
      "f_entity_pressure": "Trykksensor (hPa)",
      "f_reference_pressure": "Referansevisning (hPa, valgfri)",
      "f_show_pressure": "trykkflis",
      "f_show_temperature": "temperaturflis",
      "f_show_humidity": "fuktighetsflis"
    },
    "nl": {
      "name": "Barometer",
      "storm": "Storm",
      "rain": "Regen",
      "change": "Veranderlijk",
      "fair": "Mooi weer",
      "unavailable": "Niet beschikbaar",
      "pressure": "Luchtdruk",
      "temperature": "Temperatuur",
      "humidity": "Luchtvochtigheid",
      "f_entity_pressure": "Druksensor (hPa)",
      "f_reference_pressure": "Referentiewijzer (hPa, optioneel)",
      "f_show_pressure": "druktegel",
      "f_show_temperature": "temperatuurtegel",
      "f_show_humidity": "vochtigheidstegel"
    },
    "pl": {
      "name": "Barometr",
      "storm": "Burza",
      "rain": "Deszcz",
      "change": "Zmienna",
      "fair": "Ładna pogoda",
      "unavailable": "Niedostępne",
      "pressure": "Ciśnienie",
      "temperature": "Temperatura",
      "humidity": "Wilgotność",
      "f_entity_pressure": "Czujnik ciśnienia (hPa)",
      "f_reference_pressure": "Wskazówka odniesienia (hPa, opcjonalnie)",
      "f_show_pressure": "kafelek ciśnienia",
      "f_show_temperature": "kafelek temperatury",
      "f_show_humidity": "kafelek wilgotności"
    },
    "pt-BR": {
      "name": "Barômetro",
      "storm": "Tempestade",
      "rain": "Chuva",
      "change": "Variável",
      "fair": "Tempo bom",
      "unavailable": "Indisponível",
      "pressure": "Pressão",
      "temperature": "Temperatura",
      "humidity": "Umidade",
      "f_entity_pressure": "Sensor de pressão (hPa)",
      "f_reference_pressure": "Ponteiro de referência (hPa, opcional)",
      "f_show_pressure": "bloco de pressão",
      "f_show_temperature": "bloco de temperatura",
      "f_show_humidity": "bloco de umidade"
    },
    "pt-PT": {
      "name": "Barómetro",
      "storm": "Tempestade",
      "rain": "Chuva",
      "change": "Variável",
      "fair": "Bom tempo",
      "unavailable": "Indisponível",
      "pressure": "Pressão",
      "temperature": "Temperatura",
      "humidity": "Humidade",
      "f_entity_pressure": "Sensor de pressão (hPa)",
      "f_reference_pressure": "Ponteiro de referência (hPa, opcional)",
      "f_show_pressure": "bloco de pressão",
      "f_show_temperature": "bloco de temperatura",
      "f_show_humidity": "bloco de humidade"
    },
    "ro": {
      "name": "Barometru",
      "storm": "Furtună",
      "rain": "Ploaie",
      "change": "Variabil",
      "fair": "Vreme frumoasă",
      "unavailable": "Indisponibil",
      "pressure": "Presiune",
      "temperature": "Temperatură",
      "humidity": "Umiditate",
      "f_entity_pressure": "Senzor de presiune (hPa)",
      "f_reference_pressure": "Ac de referință (hPa, opțional)",
      "f_show_pressure": "cardul presiune",
      "f_show_temperature": "cardul temperatură",
      "f_show_humidity": "cardul umiditate"
    },
    "ru": {
      "name": "Барометр",
      "storm": "Буря",
      "rain": "Дождь",
      "change": "Переменно",
      "fair": "Ясно",
      "unavailable": "Недоступно",
      "pressure": "Давление",
      "temperature": "Температура",
      "humidity": "Влажность",
      "f_entity_pressure": "Датчик давления (гПа)",
      "f_reference_pressure": "Стрелка-метка (гПа, необязательно)",
      "f_show_pressure": "плитка давления",
      "f_show_temperature": "плитка температуры",
      "f_show_humidity": "плитка влажности"
    },
    "sr": {
      "name": "Барометар",
      "storm": "Олуја",
      "rain": "Киша",
      "change": "Променљиво",
      "fair": "Лепо време",
      "unavailable": "Недоступно",
      "pressure": "Притисак",
      "temperature": "Температура",
      "humidity": "Влажност",
      "f_entity_pressure": "Сензор притиска (hPa)",
      "f_reference_pressure": "Референтна казаљка (hPa, опционо)",
      "f_show_pressure": "плочица притиска",
      "f_show_temperature": "плочица температуре",
      "f_show_humidity": "плочица влажности"
    },
    "sr-Latn": {
      "name": "Barometar",
      "storm": "Oluja",
      "rain": "Kiša",
      "change": "Promenljivo",
      "fair": "Lepo vreme",
      "unavailable": "Nedostupno",
      "pressure": "Pritisak",
      "temperature": "Temperatura",
      "humidity": "Vlažnost",
      "f_entity_pressure": "Senzor pritiska (hPa)",
      "f_reference_pressure": "Referentna kazaljka (hPa, opciono)",
      "f_show_pressure": "pločica pritiska",
      "f_show_temperature": "pločica temperature",
      "f_show_humidity": "pločica vlažnosti"
    },
    "uk": {
      "name": "Барометр",
      "storm": "Буря",
      "rain": "Дощ",
      "change": "Мінливо",
      "fair": "Ясно",
      "unavailable": "Недоступно",
      "pressure": "Тиск",
      "temperature": "Температура",
      "humidity": "Вологість",
      "f_entity_pressure": "Датчик тиску (гПа)",
      "f_reference_pressure": "Стрілка-мітка (гПа, необов'язково)",
      "f_show_pressure": "плитка тиску",
      "f_show_temperature": "плитка температури",
      "f_show_humidity": "плитка вологості"
    }
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée du cadran sans aiguilles (569 × 547, WebP transparent)
  const IMG = 'data:image/webp;base64,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';
  const W = 569, H = 547;
  // pivots des trois aiguilles dans l'image
  const HUB = { p: [275, 268], h: [187, 357], t: [383, 351] };
  // pression : angle (degrés, sens trigonométrique, 0° = vers la droite) des graduations 980 … 1050 hPa, interpolé entre deux
  const P_TICKS = [[980, 181.75], [990, 155], [1000, 127], [1010, 99.25], [1020, 71.25], [1030, 43.75], [1040, 17.5], [1050, -7.5]];
  const lerp = (tab, v) => {
    const lo = tab[0], hi = tab[tab.length - 1];
    if (v <= lo[0]) return lo[1] + (v - lo[0]) * (tab[1][1] - lo[1]) / (tab[1][0] - lo[0]);
    if (v >= hi[0]) return hi[1] + (v - hi[0]) * (hi[1] - tab[tab.length - 2][1]) / (hi[0] - tab[tab.length - 2][0]);
    for (let i = 1; i < tab.length; i++) if (v <= tab[i][0]) { const [a, x] = tab[i - 1], [b, y] = tab[i]; return x + (y - x) * (v - a) / (b - a); }
    return 0;
  };
  // hygromètre : 0 % en bas à gauche, 100 % en bas à droite (sens horaire) ; thermomètre : −20 °C en bas à gauche, 60 °C en bas à droite
  const H_TICKS = [[0, 228], [100, -43.4]];
  const TH_TICKS = [[-20, 207], [60, -23.5]];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const angle = { p: (v) => lerp(P_TICKS, clamp(v, 965, 1065)), h: (v) => lerp(H_TICKS, clamp(v, 0, 100)), t: (v) => lerp(TH_TICKS, clamp(v, -20, 60)) };

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --ba-ok:var(--appliance-ok-color,#2fd27a);--ba-warn:var(--appliance-warn-color,#ffb300);--ba-alert:var(--appliance-alert-color,#ff4d3d)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.fair .badge{background:color-mix(in srgb,var(--ba-ok) 22%,transparent);color:var(--ba-ok)}
.change .badge{background:color-mix(in srgb,var(--ba-warn) 26%,transparent);color:var(--ba-warn)}
.rain .badge,.storm .badge{background:color-mix(in srgb,var(--ba-alert) 22%,transparent);color:var(--ba-alert)}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.needle{transition:transform 1.2s cubic-bezier(.3,1.3,.5,1)}
.noanim .needle{transition:none}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.compact .head{display:none}`;

  const TILES = [['pressure', 'mdi:gauge', 'show_pressure'], ['temperature', 'mdi:thermometer', 'show_temperature'], ['humidity', 'mdi:water-percent', 'show_humidity']];
  const ENT = { pressure: 'entity_pressure', temperature: 'entity_temperature', humidity: 'entity_humidity' };

  // aiguille dessinée vers la droite (0°) autour de son pivot : on la fait tourner en CSS (fondu animé)
  const needleBig = (x, y) => `<g class="needle" id="bap" style="transform-origin:${x}px ${y}px"><path d="M${x - 104} ${y}H${x + 176}" stroke="#15171a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M${x + 196} ${y}L${x + 168} ${y - 6.5}V${y + 6.5}Z" fill="#15171a"/><circle cx="${x - 104}" cy="${y}" r="13" fill="#15171a"/><circle cx="${x - 98}" cy="${y - 5}" r="10" fill="#e9ecef"/>
    <circle cx="${x}" cy="${y}" r="9" fill="#c9ced3" stroke="#8d949b" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.2" fill="#6c737a"/></g>`;
  const needleSmall = (id, x, y) => `<g class="needle" id="${id}" style="transform-origin:${x}px ${y}px"><path d="M${x - 14} ${y}H${x + 52}" stroke="#15171a" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M${x + 62} ${y}L${x + 46} ${y - 4}V${y + 4}Z" fill="#15171a"/><circle cx="${x - 13}" cy="${y}" r="5.5" fill="#15171a"/><circle cx="${x}" cy="${y}" r="5" fill="#9aa1a8" stroke="#6c737a" stroke-width="1"/></g>`;
  const needleRef = (x, y) => `<g class="needle" id="bar" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y}H${x + 190}" stroke="#15171a" stroke-width="1.3" stroke-linecap="round"/></g>`;

  class ApplianceBarometerCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity_pressure: ids.find((i) => /^sensor\./.test(i) && /(pressure|pression|barom)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
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

    // pression en hPa (conversion depuis kPa, Pa, inHg, mmHg)
    _hpa(id) {
      const v = this._num(id); if (isNaN(v)) return NaN;
      const u = this._unit(id, 'hPa').toLowerCase();
      return u === 'kpa' ? v * 10 : u === 'pa' ? v / 100 : u === 'inhg' ? v * 33.8639 : u === 'mmhg' ? v * 1.33322 : v;
    }
    // zone météo selon la pression
    _zone(p) { return isNaN(p) ? 'unavailable' : p < 985 ? 'storm' : p < 1000 ? 'rain' : p < 1020 ? 'change' : 'fair'; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="batitle"></div><div class="badge" id="babadge"></div></div>
        <div class="body"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(c.name || this._t('name'))}">
          <ellipse cx="${W / 2}" cy="${H - 4}" rx="${W * 0.38}" ry="7" fill="#000" opacity=".22"/>
          <image href="${IMG}" width="${W}" height="${H}"/>
          ${needleSmall('bah', ...HUB.h)}${needleSmall('bat', ...HUB.t)}
          ${c.reference_pressure != null && c.reference_pressure !== '' ? needleRef(...HUB.p) : ''}${needleBig(...HUB.p)}</svg>
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div></ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_pressure));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[ENT[el.dataset.k]])));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const p = this._hpa(c.entity_pressure), t = this._num(c.entity_temperature), h = this._num(c.entity_humidity), zone = this._zone(p);
      card.className = `${zone}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      r.getElementById('batitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('babadge');
      badge.textContent = this._t(zone);
      badge.style.display = c.show_status === false ? 'none' : '';
      // aiguilles : la pression (grande), l'humidité et la température (petites, masquées sans entité) ; sans mesure, à l'état de repos
      const rot = (id, a, show = true) => { const el = r.getElementById(id); if (!el) return; el.style.display = show ? '' : 'none'; el.style.transform = `rotate(${(-a).toFixed(2)}deg)`; };
      rot('bap', angle.p(isNaN(p) ? 1013 : p));
      rot('bah', angle.h(isNaN(h) ? 0 : h), !!c.entity_humidity);
      rot('bat', angle.t(isNaN(t) ? 0 : t), !!c.entity_temperature);
      if (c.reference_pressure != null && c.reference_pressure !== '') rot('bar', angle.p(Number(c.reference_pressure)));
      const val = { pressure: p, temperature: t, humidity: h }, dec = { pressure: 0, temperature: 1, humidity: 0 }, dflt = { pressure: 'hPa', temperature: '°C', humidity: '%' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), id = c[ENT[k]];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = isNaN(val[k]) ? '' : k === 'pressure' ? 'hPa' : this._unit(id, dflt[k]);
        el.querySelector('.v').replaceChildren(this._fmt(val[k], dec[k]), small);
      });
    }
  }
  customElements.define(TAG, ApplianceBarometerCard);

  /* ---- éditeur visuel ---- */
  class ApplianceBarometerCardEditor extends HTMLElement {
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
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] }; // repli par clé sur l'anglais
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_pressure', 'sensor'), ent('entity_temperature', 'sensor'), ent('entity_humidity', 'sensor'),
        { name: 'reference_pressure', selector: { number: { min: 960, max: 1060, step: 1, mode: 'box', unit_of_measurement: 'hPa' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceBarometerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Baromètre analogique en photo : aiguilles dessinées en direct pour la pression, l\'humidité et la température, zones tempête / pluie / variable / beau temps.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/barometer.md',
  });
})();
