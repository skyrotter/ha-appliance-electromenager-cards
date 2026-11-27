/* Carte « Humidificateur » — custom:appliance-humidifier-card
 * Humidificateur à évaporation (Xiaomi Smartmi Evaporative Humidifier 2…) : humidité actuelle et cible, vitesse du ventilateur,
 * modes (Dry, Clean…), niveau d'eau du réservoir, température. Deux illustrations au choix (option style) :
 *   svg (dessin générique) et smartmi (photo détourée du Smartmi Evaporative Humidifier 2).
 * Mêmes calques animés dans les deux cas, dans le repère de la photo (1023 × 1590) : écran LCD redessiné (humidité, wifi, barre d'eau,
 * vitesse, mode), brume qui monte de l'ouverture du dessus, halo du bouton « Clean » pendant le nettoyage.
 * États : off, humidifying, target (humidité cible atteinte), dry (mode Dry), clean (mode Clean), unavailable ; alerte « réservoir bas ».
 * Boutons : marche / arrêt, humidité cible − / +, un bouton par mode, un bouton par vitesse du ventilateur.
 */
(() => {
  const TAG = 'appliance-humidifier-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Humidifier","off":"Off","humidifying":"Humidifying","target":"Target reached","dry":"Dry mode","clean":"Cleaning","unavailable":"Unavailable","low_water":"Low water","low_water_alert":"Water tank almost empty","turn_on":"Turn on","turn_off":"Turn off","humidity":"Humidity","temperature":"Temperature","tank":"Water tank","fan":"Fan","mode":"Mode","low":"Low","ok":"OK","style_svg":"Drawing (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (photo)","target_tile":"Target"},"da":{"name":"Luftfugter","off":"Slukket","humidifying":"Fugter","target":"Mål nået","dry":"Tørretilstand","clean":"Rengøring","unavailable":"Utilgængelig","low_water":"Lavt vand","low_water_alert":"Vandtanken er næsten tom","turn_on":"Tænd","turn_off":"Sluk","humidity":"Luftfugtighed","temperature":"Temperatur","tank":"Vandtank","fan":"Ventilator","mode":"Tilstand","low":"Lav","ok":"OK","style_svg":"Tegning (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (foto)","target_tile":"Mål"},"de":{"name":"Luftbefeuchter","off":"Aus","humidifying":"Befeuchtet","target":"Zielwert erreicht","dry":"Dry-Modus","clean":"Reinigung","unavailable":"Nicht verfügbar","low_water":"Wenig Wasser","low_water_alert":"Wassertank fast leer","turn_on":"Einschalten","turn_off":"Ausschalten","humidity":"Luftfeuchte","temperature":"Temperatur","tank":"Wassertank","fan":"Lüfter","mode":"Modus","low":"Niedrig","ok":"OK","style_svg":"Zeichnung (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (Foto)","target_tile":"Ziel"},"es":{"name":"Humidificador","off":"Apagado","humidifying":"Humidificando","target":"Objetivo alcanzado","dry":"Modo seco","clean":"Limpiando","unavailable":"No disponible","low_water":"Agua baja","low_water_alert":"Depósito de agua casi vacío","turn_on":"Encender","turn_off":"Apagar","humidity":"Humedad","temperature":"Temperatura","tank":"Depósito de agua","fan":"Ventilador","mode":"Modo","low":"Baja","ok":"OK","style_svg":"Dibujo (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (foto)","target_tile":"Objetivo"},"fr":{"name":"Humidificateur","off":"Arrêt","humidifying":"Humidification","target":"Cible atteinte","dry":"Mode Dry","clean":"Nettoyage","unavailable":"Indisponible","low_water":"Eau basse","low_water_alert":"Réservoir d'eau presque vide","turn_on":"Allumer","turn_off":"Éteindre","humidity":"Humidité","temperature":"Température","tank":"Réservoir","fan":"Ventilateur","mode":"Mode","low":"Bas","ok":"OK","style_svg":"Dessin (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (photo)","target_tile":"Cible"},"it":{"name":"Umidificatore","off":"Spento","humidifying":"Umidifica","target":"Obiettivo raggiunto","dry":"Modalità Dry","clean":"Pulizia","unavailable":"Non disponibile","low_water":"Poca acqua","low_water_alert":"Serbatoio quasi vuoto","turn_on":"Accendi","turn_off":"Spegni","humidity":"Umidità","temperature":"Temperatura","tank":"Serbatoio","fan":"Ventola","mode":"Modalità","low":"Basso","ok":"OK","style_svg":"Disegno (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (foto)","target_tile":"Obiettivo"},"nl":{"name":"Luchtbevochtiger","off":"Uit","humidifying":"Bevochtigt","target":"Doel bereikt","dry":"Dry-modus","clean":"Reiniging","unavailable":"Niet beschikbaar","low_water":"Weinig water","low_water_alert":"Watertank bijna leeg","turn_on":"Aanzetten","turn_off":"Uitzetten","humidity":"Vochtigheid","temperature":"Temperatuur","tank":"Watertank","fan":"Ventilator","mode":"Modus","low":"Laag","ok":"OK","style_svg":"Tekening (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (foto)","target_tile":"Doel"},"pt-BR":{"name":"Umidificador","off":"Desligado","humidifying":"Umidificando","target":"Umidade desejada atingida","dry":"Modo de secagem","clean":"Limpeza","unavailable":"Indisponível","low_water":"Pouca água","low_water_alert":"Reservatório de água quase vazio","turn_on":"Ligar","turn_off":"Desligar","humidity":"Umidade","temperature":"Temperatura","tank":"Reservatório de água","fan":"Ventilador","mode":"Modo","low":"Baixo","ok":"OK","style_svg":"Desenho (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (foto)","target_tile":"Desejada"},"pt-PT":{"name":"Humidificador","off":"Desligado","humidifying":"A humidificar","target":"Humidade pretendida atingida","dry":"Modo de secagem","clean":"Limpeza","unavailable":"Indisponível","low_water":"Pouca água","low_water_alert":"Depósito de água quase vazio","turn_on":"Ligar","turn_off":"Desligar","humidity":"Humidade","temperature":"Temperatura","tank":"Depósito de água","fan":"Ventoinha","mode":"Modo","low":"Baixo","ok":"OK","style_svg":"Desenho (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (fotografia)","target_tile":"Pretendida"},"ru":{"name":"Увлажнитель воздуха","off":"Выключен","humidifying":"Увлажнение","target":"Цель достигнута","dry":"Сушка","clean":"Очистка","unavailable":"Недоступно","low_water":"Мало воды","low_water_alert":"Бак для воды почти пуст","turn_on":"Включить","turn_off":"Выключить","humidity":"Влажность","temperature":"Температура","tank":"Резервуар","fan":"Вентилятор","mode":"Режим","low":"Мало","ok":"ОК","style_svg":"Рисунок (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (фото)","target_tile":"Цель"},"sr":{"name":"Овлаживач ваздуха","off":"Искључено","humidifying":"Овлаживање","target":"Циљ достигнут","dry":"Режим сушења","clean":"Чишћење","unavailable":"Недоступно","low_water":"Мало воде","low_water_alert":"Резервоар за воду је скоро празан","turn_on":"Укључи","turn_off":"Искључи","humidity":"Влажност","temperature":"Температура","tank":"Резервоар за воду","fan":"Вентилатор","mode":"Режим","low":"Ниско","ok":"У реду","style_svg":"Цртеж (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (фотографија)","target_tile":"Циљна"},"sr-Latn":{"name":"Ovlaživač vazduha","off":"Isključeno","humidifying":"Ovlaživanje","target":"Cilj dostignut","dry":"Režim sušenja","clean":"Čišćenje","unavailable":"Nedostupno","low_water":"Malo vode","low_water_alert":"Rezervoar za vodu je skoro prazan","turn_on":"Uključi","turn_off":"Isključi","humidity":"Vlažnost","temperature":"Temperatura","tank":"Rezervoar za vodu","fan":"Ventilator","mode":"Režim","low":"Nisko","ok":"U redu","style_svg":"Crtež (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (fotografija)","target_tile":"Ciljna"},"uk":{"name":"Зволожувач","off":"Вимк.","humidifying":"Зволоження","target":"Ціль досягнуто","dry":"Режим сушіння","clean":"Очищення","unavailable":"Недоступно","low_water":"Мало води","low_water_alert":"Бак для води майже порожній","turn_on":"Увімкнути","turn_off":"Вимкнути","humidity":"Вологість","temperature":"Температура","tank":"Бак для води","fan":"Вентилятор","mode":"Режим","low":"Низький","ok":"ОК","style_svg":"Малюнок (SVG)","style_smartmi":"Smartmi Evaporative Humidifier 2 (фото)","target_tile":"Ціль"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const IMG = window.__acImg("humidifier",0);
  const STYLES = ['svg', 'smartmi'];
  const OFF_RE = /^(off|false|0|standby|idle_off)$/i, BAD_RE = /^(unavailable|unknown|none|)$/i;
  const CLEAN_RE = /clean|nettoy|reinig|pulizia|schoon|czysz|curat|очист|clea/i, DRY_RE = /^(dry|sec|trocken|secco|droog|suchy|uscat|сух)|dry/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --hm-ok:var(--appliance-ok-color,#43a047);--hm-cold:var(--appliance-cold-color,#2b9af9);--hm-warn:var(--appliance-warn-color,#ffa000);--hm-alert:var(--appliance-alert-color,#db4437);--spd:1}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.humidifying .badge{background:color-mix(in srgb,var(--hm-cold) 22%,transparent);color:var(--hm-cold)}
.target .badge{background:color-mix(in srgb,var(--hm-ok) 22%,transparent);color:var(--hm-ok)}
.dry .badge,.clean .badge{background:color-mix(in srgb,var(--hm-warn) 24%,transparent);color:var(--hm-warn)}
.lowwater .badge{background:color-mix(in srgb,var(--hm-alert) 22%,transparent);color:var(--hm-alert)}
.alert-line{display:none;margin-top:4px;font-size:12px;font-weight:600;color:var(--hm-alert);align-items:center;gap:4px}.lowwater .alert-line{display:flex}.alert-line ha-icon{--mdc-icon-size:16px}
.body{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:4px}
svg{display:block;flex:0 1 calc(190px * var(--illus-scale,1));width:calc(190px * var(--illus-scale,1));max-width:100%;height:auto;margin:0 auto;cursor:pointer;overflow:visible}
.tiles{flex:1 1 130px;display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;min-width:0}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.warn .v{color:var(--hm-alert)}
/* ---- boutons : marche / arrêt, humidité cible, modes, vitesses ---- */
.ctl{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px;margin-top:8px}.ctl.hide{display:none}
.ctl button{flex:0 1 auto;min-width:44px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 10px;cursor:pointer;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}.ctl button:hover{filter:brightness(1.12)}.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:var(--hm-cold);color:#fff}
.ctl .tg{font-size:13px;font-weight:600;min-width:64px;text-align:center;color:var(--primary-text-color)}
.ctl .lbl{width:100%;text-align:center;font-size:10px;color:var(--secondary-text-color);margin-bottom:-2px}
/* ---- compact ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact .body{flex:1 1 auto;min-height:0;flex-wrap:nowrap;gap:6px;margin-top:3px;align-items:stretch}
.compact svg{flex:1 1 0;min-width:0;width:auto;height:100%;max-width:none;margin:0}
.compact .tiles{flex:0 0 42%;grid-template-columns:1fr;gap:3px;align-content:center}
.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .l ha-icon{--mdc-icon-size:12px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
/* ---- illustration (repère 1023 × 1590) ---- */
.shadow{opacity:.2}
.lcd{transition:opacity .5s}.off .lcd,.unavailable .lcd{opacity:.1}
.mist{opacity:0}
.humidifying .mist{animation:hmrise calc(4s * var(--spd)) ease-out infinite}.dry .mist{animation:hmrise calc(5s * var(--spd)) ease-out infinite;opacity:0}
.mist.m2{animation-delay:calc(-1.3s * var(--spd))!important}.mist.m3{animation-delay:calc(-2.6s * var(--spd))!important}.mist.m4{animation-delay:calc(-3.5s * var(--spd))!important}
.cring{opacity:0;fill:none;stroke:#7fe9ff;stroke-width:6}.clean .cring{opacity:.9;animation:hmpulse 1.6s ease-in-out infinite}
.wbar{fill:#eef2f5}.wbar.e{fill:#ffffff;opacity:.22}.lowwater .wbar:not(.e){fill:#ff5a4d;animation:hmblink 1s steps(2) infinite}
.unavailable svg{filter:grayscale(.85) opacity(.65)}
.noanim *{animation:none!important}
@keyframes hmrise{0%{opacity:0;transform:translateY(40px) scale(.6)}15%{opacity:.8}100%{opacity:0;transform:translateY(-260px) scale(1.7)}}
@keyframes hmpulse{50%{opacity:.3}}
@keyframes hmblink{50%{opacity:.25}}
`;

  // corps : photo détourée (smartmi) ou dessin générique, dans le repère 1023 × 1590
  const BODY = {
    smartmi: () => `<image href="${IMG}" x="0" y="0" width="1023" height="1590"/>`,
    svg: () => `<defs><linearGradient id="hmb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3e7eb"/><stop offset=".12" stop-color="#fbfcfd"/><stop offset=".85" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3e8"/></linearGradient>
      <linearGradient id="hmt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#dde2e7"/></linearGradient></defs>
      <rect x="0" y="0" width="1023" height="1560" rx="70" fill="url(#hmb)" stroke="#d3d9df" stroke-width="5"/>
      <rect x="40" y="36" width="943" height="110" rx="50" fill="url(#hmt)"/><rect x="101" y="51" width="810" height="66" rx="30" fill="#dfe4e9"/><rect x="101" y="51" width="810" height="14" rx="7" fill="#000" opacity=".1"/>
      <path d="M2 930H1021" stroke="#cfd5db" stroke-width="5"/><path d="M2 937H1021" stroke="#fff" stroke-width="4" opacity=".9"/>
      <rect x="150" y="1546" width="110" height="44" rx="20" fill="#e6eaee" stroke="#cfd5db" stroke-width="4"/><rect x="763" y="1546" width="110" height="44" rx="20" fill="#e6eaee" stroke="#cfd5db" stroke-width="4"/>
      <rect x="209" y="324" width="604" height="98" rx="49" fill="url(#hmlcd)"/>
      <circle cx="259" cy="372" r="30" fill="none" stroke="#8d949b" stroke-width="3"/><circle cx="259" cy="372" r="7" fill="none" stroke="#8d949b" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<line x1="259" y1="348" x2="259" y2="341" stroke="#8d949b" stroke-width="3" transform="rotate(${k * 45} 259 372)"/>`).join('')}
      <circle cx="763" cy="372" r="30" fill="none" stroke="#8d949b" stroke-width="3"/>`,
  };

  const SVG = (style, label) => `<svg viewBox="-40 -250 1103 1890" role="img" aria-label="${esc(label)}"><defs>
    <linearGradient id="hmlcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25272b"/><stop offset=".5" stop-color="#0d0e10"/><stop offset="1" stop-color="#050506"/></linearGradient>
    <filter id="hmblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <ellipse class="shadow" cx="511" cy="1590" rx="470" ry="26" fill="#000"/>
    ${(BODY[style] || BODY.svg)()}
    <!-- brume : monte de l'ouverture du dessus -->
    <g filter="url(#hmblur)" fill="#8fc2e8"><ellipse class="mist m1" cx="330" cy="90" rx="95" ry="48"/><ellipse class="mist m2" cx="520" cy="80" rx="110" ry="50"/><ellipse class="mist m3" cx="700" cy="92" rx="95" ry="46"/><ellipse class="mist m4" cx="450" cy="86" rx="80" ry="42"/></g>
    <!-- écran LCD redessiné : humidité, wifi, barre d'eau, vitesse, mode -->
    <rect x="322" y="334" width="400" height="76" rx="14" fill="url(#hmlcd)"/>
    <g class="lcd" fill="#f4f7f9">
      <text id="hmv" x="362" y="394" font-size="68" font-family="Roboto,Arial,sans-serif" font-weight="300" letter-spacing="-2">--</text>
      <text x="452" y="394" font-size="30" font-family="Roboto,Arial,sans-serif" font-weight="300">%</text>
      <rect x="486" y="346" width="6" height="52" rx="3" fill="#3ddc5a"/>
      <g transform="translate(523 366)" fill="none" stroke="#f4f7f9" stroke-width="4" stroke-linecap="round"><path d="M-17 -6a24 24 0 0 1 34 0"/><path d="M-10 2a14 14 0 0 1 20 0"/><circle cx="0" cy="11" r="2.4" fill="#f4f7f9"/></g>
      <path d="M514 384h10v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="none" stroke="#f4f7f9" stroke-width="3"/>
      <g id="hmw">${[...Array(20)].map((_, k) => `<rect class="wbar e" x="${536 + k * 5.2}" y="385" width="3" height="14"/>`).join('')}</g>
      <text id="hmf" x="618" y="378" font-size="52" font-family="Roboto,Arial,sans-serif" font-weight="300" text-anchor="middle">A</text>
      <text id="hmm" x="690" y="372" font-size="24" font-family="Roboto,Arial,sans-serif" font-weight="600" text-anchor="middle" fill="#ffb74d"></text>
    </g>
    <!-- bouton Clean : tourne pendant le nettoyage -->
    <circle class="cring" cx="763" cy="372" r="34"/>
  </svg>`;

  const TILES = [['humidity', 'mdi:water-percent', 'show_humidity'], ['target', 'mdi:target', 'show_target'], ['temperature', 'mdi:thermometer', 'show_temperature'],
    ['tank', 'mdi:water', 'show_tank'], ['fan', 'mdi:fan', 'show_fan']];

  class ApplianceHumidifierCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      return { entity: ids.find((i) => /^humidifier\./.test(i) && !/dehum|deshum/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { style: 'svg', water_low: 20, target_step: 5, show_controls: true, ...Object.fromEntries(TILES.map(([, , o]) => [o, true])), ...c };
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
    _ok(s) { return !!s && !BAD_RE.test(String(s.state)) && !/^unavailable$/i.test(String(s.state)); }
    _dom(id) { return id ? String(id).split('.')[0] : ''; }
    _val(id, attr) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(attr ? s.attributes[attr] : s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _unit(id, d) { const s = this._st(id); return String((s && s.attributes && s.attributes.unit_of_measurement) || d).trim(); }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _style() { return STYLES.includes(this._c.style) ? this._c.style : 'svg'; }
    _main() { return this._c.entity || this._c.switch || ''; }

    // options d'une entité de sélection (select, input_select, fan, humidifier) et option active
    _opts(id) {
      const s = this._st(id); if (!s) return [];
      const a = s.attributes || {}, d = this._dom(id);
      return (d === 'select' || d === 'input_select' ? a.options : d === 'fan' ? a.preset_modes : d === 'humidifier' ? a.available_modes : []) || [];
    }
    _cur(id) {
      const s = this._st(id); if (!this._ok(s)) return '';
      const a = s.attributes || {}, d = this._dom(id);
      return String(d === 'fan' ? a.preset_mode ?? '' : d === 'humidifier' ? a.mode ?? '' : s.state);
    }
    // entité des modes : option mode, sinon l'entité humidifier elle-même
    _modeId() { const c = this._c; return c.mode || (this._dom(c.entity) === 'humidifier' ? c.entity : ''); }
    _fanId() { return this._c.fan_speed || ''; }
    _pick(id, opt) {
      if (!this._hass || !id) return;
      const d = this._dom(id), svc = { select: ['select', 'select_option', { option: opt }], input_select: ['input_select', 'select_option', { option: opt }],
        fan: ['fan', 'set_preset_mode', { preset_mode: opt }], humidifier: ['humidifier', 'set_mode', { mode: opt }] }[d];
      if (svc) this._hass.callService(svc[0], svc[1], { entity_id: id, ...svc[2] });
    }
    _power() {
      const id = this._c.switch || this._c.entity; if (!this._hass || !id) return;
      this._hass.callService('homeassistant', 'toggle', { entity_id: id });
    }
    // humidité cible : number / input_number ; à défaut l'attribut humidity de l'entité humidifier
    _setTarget(v) {
      const c = this._c; if (!this._hass) return;
      const t = c.target_humidity, d = this._dom(t);
      const lo = this._lim('min'), hi = this._lim('max'); v = Math.max(lo, Math.min(hi, Math.round(v)));
      if (t && (d === 'number' || d === 'input_number')) this._hass.callService(d, 'set_value', { entity_id: t, value: v });
      else if (this._dom(c.entity) === 'humidifier') this._hass.callService('humidifier', 'set_humidity', { entity_id: c.entity, humidity: v });
    }
    _lim(k) {
      const t = this._st(this._c.target_humidity), e = this._st(this._c.entity), a = (t && t.attributes) || {}, b = (e && e.attributes) || {};
      const v = Number(a[k] ?? b[`${k}_humidity`] ?? NaN);
      return isFinite(v) ? v : k === 'min' ? 30 : 80;
    }
    _targetCtl() {
      const c = this._c;
      return !!(c.target_humidity && ['number', 'input_number'].includes(this._dom(c.target_humidity))) || this._dom(c.entity) === 'humidifier';
    }

    _compute() {
      const c = this._c, e = this._st(c.entity), sw = this._st(c.switch), a = (e && e.attributes) || {};
      const mainOk = this._ok(e) || this._ok(sw);
      const stateOf = (s) => (this._ok(s) ? String(s.state).toLowerCase() : '');
      const swS = stateOf(sw), eS = stateOf(e);
      const on = swS ? !OFF_RE.test(swS) : eS ? !OFF_RE.test(eS) : false;
      const hum = !isNaN(this._val(c.humidity)) ? this._val(c.humidity) : isFinite(Number(a.current_humidity)) ? Number(a.current_humidity) : NaN;
      const tgt = !isNaN(this._val(c.target_humidity)) ? this._val(c.target_humidity) : isFinite(Number(a.humidity)) ? Number(a.humidity) : NaN;
      const mode = this._cur(this._modeId()).toLowerCase(), action = String(a.action || '').toLowerCase();
      const fanTxt = this._cur(this._fanId());
      const water = this._val(c.water_level), lowS = this._st(c.low_water);
      const wl = Number(c.water_low) > 0 ? Number(c.water_low) : 20;
      const low = (this._ok(lowS) && /^(on|true|low|empty|vide|bas)$/i.test(String(lowS.state))) || (!isNaN(water) && water <= wl);
      let st = !mainOk ? 'unavailable' : !on ? 'off' : CLEAN_RE.test(mode) ? 'clean' : DRY_RE.test(mode) ? 'dry'
        : action === 'idle' || (!isNaN(hum) && !isNaN(tgt) && hum >= tgt) ? 'target' : 'humidifying';
      if (st === 'unavailable' || st === 'off') { /* pas d'alerte réservoir quand l'appareil est éteint */ }
      return { st, on, hum, tgt, mode, fanTxt, water, low: low && st !== 'off' && st !== 'unavailable', temp: this._val(c.temperature) };
    }

    // lettre de la vitesse affichée sur l'écran : A (auto), 1, 2, 3
    _fanLetter(t) {
      const s = String(t || '').toLowerCase().trim(); if (!s) return '';
      if (/auto/.test(s)) return 'A';
      const n = s.match(/\d+/); if (n) return n[0];
      return /low|bas|nuit|night|sleep|silent|min/.test(s) ? '1' : /med|moy|mid/.test(s) ? '2' : /high|haut|max|turbo/.test(s) ? '3' : s.charAt(0).toUpperCase();
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="hmtitle"></div><div class="badge" id="hmbadge"></div></div>
        <div class="alert-line"><ha-icon icon="mdi:water-alert-outline"></ha-icon><span id="hmalert"></span></div>
        <div class="body">${SVG(this._style(), this._c.name || this._t('name'))}
          <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
        </div>
        <div class="ctl" id="hmmain"><button id="hmpw"><ha-icon icon="mdi:power"></ha-icon><span></span></button>
          <button id="hmdn" aria-label="-"><ha-icon icon="mdi:minus"></ha-icon></button><span class="tg" id="hmtg"></span><button id="hmup" aria-label="+"><ha-icon icon="mdi:plus"></ha-icon></button></div>
        <div class="ctl" id="hmmodes"></div><div class="ctl" id="hmfans"></div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.humidity || this._c.switch));
      root.getElementById('hmpw').addEventListener('click', () => this._power());
      root.getElementById('hmdn').addEventListener('click', () => { const v = this._compute().tgt; this._setTarget((isNaN(v) ? this._lim('min') + (this._lim('max') - this._lim('min')) / 2 : v) - (Number(this._c.target_step) || 5)); });
      root.getElementById('hmup').addEventListener('click', () => { const v = this._compute().tgt; this._setTarget((isNaN(v) ? this._lim('min') : v) + (Number(this._c.target_step) || 5)); });
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ humidity: c.humidity || c.entity, target: c.target_humidity || c.entity, temperature: c.temperature, tank: c.water_level || c.low_water, fan: c.fan_speed }[el.dataset.k] || c.entity);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    // une rangée de boutons (modes ou vitesses) : le bouton de l'option active est allumé
    _row(el, id, label, fmt) {
      const opts = this._opts(id), cur = this._cur(id);
      el.classList.toggle('hide', !opts.length || this._c.show_controls === false);
      el.replaceChildren();
      if (!opts.length) return;
      const lb = document.createElement('div'); lb.className = 'lbl'; lb.textContent = label; el.appendChild(lb);
      opts.forEach((o) => {
        const b = document.createElement('button'); b.textContent = fmt(o); b.className = String(o).toLowerCase() === cur.toLowerCase() ? 'on' : '';
        b.disabled = !this._ok(this._st(id)); b.addEventListener('click', () => this._pick(id, o)); el.appendChild(b);
      });
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, on, hum, tgt, mode, fanTxt, water, low, temp } = this._compute();
      card.className = `${st}${low ? ' lowwater' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      card.style.setProperty('--spd', String(st === 'humidifying' && !isNaN(hum) && !isNaN(tgt) ? Math.max(.7, Math.min(1.4, 1 + (hum - tgt) / 40)).toFixed(2) : 1));
      r.getElementById('hmtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('hmbadge');
      badge.textContent = low && st !== 'off' && st !== 'unavailable' ? this._t('low_water') : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      r.getElementById('hmalert').textContent = this._t('low_water_alert');

      // écran LCD
      const hv = r.getElementById('hmv'); hv.textContent = isNaN(hum) ? '--' : String(Math.round(hum));
      r.getElementById('hmf').textContent = this._fanLetter(fanTxt) || '';
      const mm = r.getElementById('hmm'); mm.textContent = st === 'clean' ? 'CLEAN' : st === 'dry' ? 'DRY' : ''; mm.setAttribute('fill', st === 'clean' ? '#7fe9ff' : '#ffb74d');
      const full = isNaN(water) ? (low ? 1 : 20) : Math.round(Math.max(0, Math.min(100, water)) / 5);
      r.querySelectorAll('#hmw .wbar').forEach((b, i) => b.classList.toggle('e', i >= full));

      // boutons
      const mainRow = r.getElementById('hmmain'), hasT = this._targetCtl();
      mainRow.classList.toggle('hide', c.show_controls === false || (!c.entity && !c.switch));
      const pw = r.getElementById('hmpw'); pw.classList.toggle('on', on); pw.querySelector('span').textContent = this._t(on ? 'turn_off' : 'turn_on'); pw.disabled = st === 'unavailable';
      ['hmdn', 'hmup', 'hmtg'].forEach((id) => { r.getElementById(id).style.display = hasT ? '' : 'none'; });
      r.getElementById('hmtg').textContent = isNaN(tgt) ? '-- %' : `${Math.round(tgt)} %`;
      r.getElementById('hmdn').disabled = r.getElementById('hmup').disabled = !on || st === 'unavailable';
      this._row(r.getElementById('hmmodes'), this._modeId(), this._l('mode'), (o) => String(o));
      this._row(r.getElementById('hmfans'), this._fanId(), this._l('fan'), (o) => String(o));

      const V = {
        humidity: [!isNaN(hum), this._fmt(hum, 0), '%'],
        target: [!isNaN(tgt), this._fmt(tgt, 0), '%'],
        temperature: [c.temperature, this._fmt(temp, 1), this._unit(c.temperature, '°C')],
        tank: [c.water_level || c.low_water, !isNaN(water) ? this._fmt(water, 0) : low ? this._t('low') : this._t('ok'), !isNaN(water) ? this._unit(c.water_level, '%') : ''],
        fan: [fanTxt, fanTxt, ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`), [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', k === 'tank' && low);
        el.querySelector('.lbl').textContent = this._l(k === 'target' ? 'target_tile' : k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceHumidifierCard);

  /* ---- éditeur visuel ---- */
  class ApplianceHumidifierCardEditor extends HTMLElement {
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
        { name: 'style', selector: { select: { mode: 'dropdown', options: STYLES.map((value) => ({ value, label: tr[`style_${value}`] || T.en[`style_${value}`] || value })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['humidifier', 'switch', 'fan', 'input_boolean']), ent('switch', ['switch', 'input_boolean', 'fan']),
        ent('humidity', 'sensor'), ent('target_humidity', ['number', 'input_number', 'sensor']), ent('temperature', 'sensor'),
        ent('fan_speed', ['select', 'input_select', 'fan']), ent('mode', ['select', 'input_select', 'fan', 'humidifier']),
        ent('water_level', 'sensor'), ent('low_water', ['binary_sensor', 'sensor', 'input_boolean']),
        { type: 'grid', name: '', schema: [
          { name: 'water_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
          { name: 'target_step', default: 5, selector: { number: { min: 1, max: 20, step: 1, mode: 'box', unit_of_measurement: '%' } } }] },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('compact', false), bool('show_status'), bool('show_controls'), ...TILES.map(([, , o]) => bool(o)), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceHumidifierCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Humidificateur animé (Smartmi, Xiaomi…) : humidité actuelle et cible, vitesses, modes Dry / Clean, niveau d\'eau, brume ; dessin SVG ou photo.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/humidifier.md',
  });
})();
