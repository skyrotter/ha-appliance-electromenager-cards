/* Carte « Baromètre » — custom:appliance-barometer-card
 * Baromètre analogique (cadran argenté avec hygromètre et thermomètre, photo détourée) dont les aiguilles sont dessinées en direct :
 * la grande aiguille suit la pression (hPa), les deux petites l'humidité et la température. Aiguille de repère optionnelle
 * (reference_pressure). Zones météo : tempête, pluie, variable, beau temps. Les pressions en kPa / Pa / inHg / mmHg sont converties en hPa.
 */
(() => {
  const TAG = 'appliance-barometer-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Barometer","storm":"Storm","rain":"Rain","change":"Changeable","fair":"Fair weather","unavailable":"Unavailable","pressure":"Pressure","temperature":"Temperature","humidity":"Humidity","f_entity_pressure":"Pressure sensor (hPa)","f_reference_pressure":"Reference hand (hPa, optional)","f_show_pressure":"pressure tile","f_show_temperature":"temperature tile","f_show_humidity":"humidity tile"},"cs":{"name":"Barometr","storm":"Bouře","rain":"Déšť","change":"Proměnlivo","fair":"Pěkné počasí","unavailable":"Nedostupné","pressure":"Tlak","temperature":"Teplota","humidity":"Vlhkost","f_entity_pressure":"Snímač tlaku (hPa)","f_reference_pressure":"Ručička pro porovnání (hPa, volitelně)","f_show_pressure":"dlaždice tlaku","f_show_temperature":"dlaždice teploty","f_show_humidity":"dlaždice vlhkosti"},"da":{"name":"Barometer","storm":"Storm","rain":"Regn","change":"Ustadigt","fair":"Godt vejr","unavailable":"Utilgængelig","pressure":"Lufttryk","temperature":"Temperatur","humidity":"Luftfugtighed","f_entity_pressure":"Tryksensor (hPa)","f_reference_pressure":"Referencevisér (hPa, valgfri)","f_show_pressure":"trykfelt","f_show_temperature":"temperaturfelt","f_show_humidity":"fugtighedsfelt"},"de":{"name":"Barometer","storm":"Sturm","rain":"Regen","change":"Wechselhaft","fair":"Schönes Wetter","unavailable":"Nicht verfügbar","pressure":"Luftdruck","temperature":"Temperatur","humidity":"Luftfeuchtigkeit","f_entity_pressure":"Drucksensor (hPa)","f_reference_pressure":"Merkzeiger (hPa, optional)","f_show_pressure":"Druck-Kachel","f_show_temperature":"Temperatur-Kachel","f_show_humidity":"Feuchte-Kachel"},"es":{"name":"Barómetro","storm":"Tormenta","rain":"Lluvia","change":"Variable","fair":"Buen tiempo","unavailable":"No disponible","pressure":"Presión","temperature":"Temperatura","humidity":"Humedad","f_entity_pressure":"Sensor de presión (hPa)","f_reference_pressure":"Aguja de referencia (hPa, opcional)","f_show_pressure":"tarjeta de presión","f_show_temperature":"tarjeta de temperatura","f_show_humidity":"tarjeta de humedad"},"fr":{"name":"Baromètre","storm":"Tempête","rain":"Pluie","change":"Variable","fair":"Beau temps","unavailable":"Indisponible","pressure":"Pression","temperature":"Température","humidity":"Humidité","f_entity_pressure":"Capteur de pression (hPa)","f_reference_pressure":"Aiguille de repère (hPa, optionnel)","f_show_pressure":"tuile pression","f_show_temperature":"tuile température","f_show_humidity":"tuile humidité"},"hu":{"name":"Barométer","storm":"Vihar","rain":"Eső","change":"Változékony","fair":"Szép idő","unavailable":"Nem elérhető","pressure":"Légnyomás","temperature":"Hőmérséklet","humidity":"Páratartalom","f_entity_pressure":"Nyomásérzékelő (hPa)","f_reference_pressure":"Referenciamutató (hPa, opcionális)","f_show_pressure":"nyomás csempe","f_show_temperature":"hőmérséklet csempe","f_show_humidity":"páratartalom csempe"},"it":{"name":"Barometro","storm":"Tempesta","rain":"Pioggia","change":"Variabile","fair":"Bel tempo","unavailable":"Non disponibile","pressure":"Pressione","temperature":"Temperatura","humidity":"Umidità","f_entity_pressure":"Sensore di pressione (hPa)","f_reference_pressure":"Lancetta di riferimento (hPa, opzionale)","f_show_pressure":"riquadro pressione","f_show_temperature":"riquadro temperatura","f_show_humidity":"riquadro umidità"},"nb":{"name":"Barometer","storm":"Storm","rain":"Regn","change":"Ustabilt","fair":"Pent vær","unavailable":"Utilgjengelig","pressure":"Lufttrykk","temperature":"Temperatur","humidity":"Luftfuktighet","f_entity_pressure":"Trykksensor (hPa)","f_reference_pressure":"Referansevisning (hPa, valgfri)","f_show_pressure":"trykkflis","f_show_temperature":"temperaturflis","f_show_humidity":"fuktighetsflis"},"nl":{"name":"Barometer","storm":"Storm","rain":"Regen","change":"Veranderlijk","fair":"Mooi weer","unavailable":"Niet beschikbaar","pressure":"Luchtdruk","temperature":"Temperatuur","humidity":"Luchtvochtigheid","f_entity_pressure":"Druksensor (hPa)","f_reference_pressure":"Referentiewijzer (hPa, optioneel)","f_show_pressure":"druktegel","f_show_temperature":"temperatuurtegel","f_show_humidity":"vochtigheidstegel"},"pl":{"name":"Barometr","storm":"Burza","rain":"Deszcz","change":"Zmienna","fair":"Ładna pogoda","unavailable":"Niedostępne","pressure":"Ciśnienie","temperature":"Temperatura","humidity":"Wilgotność","f_entity_pressure":"Czujnik ciśnienia (hPa)","f_reference_pressure":"Wskazówka odniesienia (hPa, opcjonalnie)","f_show_pressure":"kafelek ciśnienia","f_show_temperature":"kafelek temperatury","f_show_humidity":"kafelek wilgotności"},"pt-BR":{"name":"Barômetro","storm":"Tempestade","rain":"Chuva","change":"Variável","fair":"Tempo bom","unavailable":"Indisponível","pressure":"Pressão","temperature":"Temperatura","humidity":"Umidade","f_entity_pressure":"Sensor de pressão (hPa)","f_reference_pressure":"Ponteiro de referência (hPa, opcional)","f_show_pressure":"bloco de pressão","f_show_temperature":"bloco de temperatura","f_show_humidity":"bloco de umidade"},"pt-PT":{"name":"Barómetro","storm":"Tempestade","rain":"Chuva","change":"Variável","fair":"Bom tempo","unavailable":"Indisponível","pressure":"Pressão","temperature":"Temperatura","humidity":"Humidade","f_entity_pressure":"Sensor de pressão (hPa)","f_reference_pressure":"Ponteiro de referência (hPa, opcional)","f_show_pressure":"bloco de pressão","f_show_temperature":"bloco de temperatura","f_show_humidity":"bloco de humidade"},"ro":{"name":"Barometru","storm":"Furtună","rain":"Ploaie","change":"Variabil","fair":"Vreme frumoasă","unavailable":"Indisponibil","pressure":"Presiune","temperature":"Temperatură","humidity":"Umiditate","f_entity_pressure":"Senzor de presiune (hPa)","f_reference_pressure":"Ac de referință (hPa, opțional)","f_show_pressure":"cardul presiune","f_show_temperature":"cardul temperatură","f_show_humidity":"cardul umiditate"},"ru":{"name":"Барометр","storm":"Буря","rain":"Дождь","change":"Переменно","fair":"Ясно","unavailable":"Недоступно","pressure":"Давление","temperature":"Температура","humidity":"Влажность","f_entity_pressure":"Датчик давления (гПа)","f_reference_pressure":"Стрелка-метка (гПа, необязательно)","f_show_pressure":"плитка давления","f_show_temperature":"плитка температуры","f_show_humidity":"плитка влажности"},"sr":{"name":"Барометар","storm":"Олуја","rain":"Киша","change":"Променљиво","fair":"Лепо време","unavailable":"Недоступно","pressure":"Притисак","temperature":"Температура","humidity":"Влажност","f_entity_pressure":"Сензор притиска (hPa)","f_reference_pressure":"Референтна казаљка (hPa, опционо)","f_show_pressure":"плочица притиска","f_show_temperature":"плочица температуре","f_show_humidity":"плочица влажности"},"sr-Latn":{"name":"Barometar","storm":"Oluja","rain":"Kiša","change":"Promenljivo","fair":"Lepo vreme","unavailable":"Nedostupno","pressure":"Pritisak","temperature":"Temperatura","humidity":"Vlažnost","f_entity_pressure":"Senzor pritiska (hPa)","f_reference_pressure":"Referentna kazaljka (hPa, opciono)","f_show_pressure":"pločica pritiska","f_show_temperature":"pločica temperature","f_show_humidity":"pločica vlažnosti"},"uk":{"name":"Барометр","storm":"Буря","rain":"Дощ","change":"Мінливо","fair":"Ясно","unavailable":"Недоступно","pressure":"Тиск","temperature":"Температура","humidity":"Вологість","f_entity_pressure":"Датчик тиску (гПа)","f_reference_pressure":"Стрілка-мітка (гПа, необов'язково)","f_show_pressure":"плитка тиску","f_show_temperature":"плитка температури","f_show_humidity":"плитка вологості"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // photo détourée du cadran sans aiguilles (569 × 547, WebP transparent)
  const IMG = window.__acImg("barometer",0);
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
/* ---- compact : petits emplacements fixes ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* compact sans tuiles visibles : l'image est centrée (et prend toute la place) */
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact.notiles .body{justify-content:center}.compact.notiles .tiles{display:none}.compact.notiles svg{max-width:calc(190px * var(--illus-scale,1));margin:0 auto}`;

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
      // cadran gradué en °C : une mesure en °F (ou K) est ramenée en °C pour placer l'aiguille ; le texte de la tuile garde l'unité de l'entité
      const tC = isNaN(t) || !window.applianceTemp ? t : Number(window.applianceTemp(this._hass, { temperature_unit: 'C' }).conv(t, this._hass && this._hass.states[c.entity_temperature]));
      rot('bat', angle.t(isNaN(tC) ? 0 : tC), !!c.entity_temperature);
      if (c.reference_pressure != null && c.reference_pressure !== '') rot('bar', angle.p(Number(c.reference_pressure)));
      const val = { pressure: p, temperature: t, humidity: h }, dec = { pressure: 0, temperature: 1, humidity: 0 }, dflt = { pressure: 'hPa', temperature: '°C', humidity: '%' };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), id = c[ENT[k]];
        el.classList.toggle('hide', !id || c[opt] === false);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = isNaN(val[k]) ? '' : k === 'pressure' ? 'hPa' : this._unit(id, dflt[k]);
        el.querySelector('.v').replaceChildren(this._fmt(val[k], dec[k]), small);
      });
      card.classList.toggle('notiles', !r.querySelector('.tile:not(.hide)')); // aucune tuile visible : l'image est centrée en mode compact
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceBarometerCard);

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
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceBarometerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Baromètre analogique en photo : aiguilles dessinées en direct pour la pression, l\'humidité et la température, zones tempête / pluie / variable / beau temps.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/barometer.md',
  });
})();
