/* Carte « Distributeur de croquettes » — custom:appliance-pet-feeder-card
 * Distributeur connecté (Aqara Smart Pet Feeder C1 via Zigbee2MQTT, Petlibro, PETKIT…) : photo détourée de l'Aqara C1.
 * Entités (toutes facultatives) : distribution (select / button / switch), source de la dernière distribution, taille de la portion,
 * portions et poids du jour, erreur, indicateur LED, sécurité enfant, mode (manuel / programmé), portions réglées, poids d'une portion.
 * Animations : croquettes qui tombent de la trappe dans la gamelle pendant la distribution, tas de croquettes qui grossit avec les
 * portions du jour, écran qui s'allume, voyant rouge qui clignote en cas d'erreur, cadenas affiché quand la sécurité enfant est active.
 * Réserve de croquettes (facultatif) : `entity_level` (grammes restants ou %) + `hopper_capacity` → tuiles Réserve et
 * Autonomie (jours), alerte sous `food_low` %, bouton Remplir (remet `entity_level` à la capacité).
 * États : ready, feeding, error, unavailable.
 */
(() => {
  const TAG = 'appliance-pet-feeder-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Pet feeder","ready":"Ready","feeding":"Feeding","error":"Error","unavailable":"Unavailable","feed":"Feed","led":"LED indicator","child_lock":"Child lock","portions":"Portions","weight":"Weight","serving":"Serving","source":"Last feed","mode":"Mode","level":"Hopper","autonomy":"Autonomy","refill":"Refill","low_food":"Food running low","days_short":"days","portions_unit":"portions","v_schedule":"Schedule","v_manual":"Manual","v_remote":"Remote","v_unknown":"Unknown","v_none":"None"},"da":{"name":"Foderautomat","ready":"Klar","feeding":"Fodrer","error":"Fejl","unavailable":"Utilgængelig","feed":"Fodr","led":"LED-indikator","child_lock":"Børnesikring","portions":"Portioner","weight":"Vægt","serving":"Portion","source":"Seneste fodring","mode":"Tilstand","portions_unit":"portioner","v_schedule":"Tidsplan","v_manual":"Manuel","v_remote":"Fjernstyret","v_unknown":"Ukendt","v_none":"Ingen"},"de":{"name":"Futterautomat","ready":"Bereit","feeding":"Füttert","error":"Fehler","unavailable":"Nicht verfügbar","feed":"Füttern","led":"LED-Anzeige","child_lock":"Kindersicherung","portions":"Portionen","weight":"Gewicht","serving":"Portionsgröße","source":"Letzte Fütterung","mode":"Modus","level":"Futterbehälter","autonomy":"Reichweite","refill":"Nachfüllen","low_food":"Futter wird knapp","days_short":"Tage","portions_unit":"Portionen","v_schedule":"Zeitplan","v_manual":"Manuell","v_remote":"Fernbedienung","v_unknown":"Unbekannt","v_none":"Keine"},"es":{"name":"Comedero para mascotas","ready":"Listo","feeding":"Dispensando","error":"Error","unavailable":"No disponible","feed":"Dispensar","led":"Indicador LED","child_lock":"Bloqueo infantil","portions":"Porciones","weight":"Peso","serving":"Ración","source":"Última comida","mode":"Modo","level":"Tolva","autonomy":"Autonomía","refill":"Rellenar","low_food":"Queda poca comida","days_short":"días","portions_unit":"porciones","v_schedule":"Programada","v_manual":"Manual","v_remote":"Remota","v_unknown":"Desconocida","v_none":"Ninguna"},"fr":{"name":"Distributeur de croquettes","ready":"Prêt","feeding":"Distribution","error":"Erreur","unavailable":"Indisponible","feed":"Nourrir","led":"Voyant LED","child_lock":"Sécurité enfant","portions":"Portions","weight":"Poids","serving":"Portion","source":"Dernière","mode":"Mode","level":"Réserve","autonomy":"Autonomie","refill":"Remplir","low_food":"Réserve de croquettes basse","days_short":"jours","portions_unit":"portions","v_schedule":"Programmé","v_manual":"Manuel","v_remote":"À distance","v_unknown":"Inconnu","v_none":"Aucune"},"pt-BR":{"name":"Alimentador de animais","ready":"Pronto","feeding":"Alimentando","error":"Erro","unavailable":"Indisponível","feed":"Alimentar","led":"Indicador LED","child_lock":"Bloqueio infantil","portions":"Porções","weight":"Peso","serving":"Refeição","source":"Última alimentação","mode":"Modo","level":"Reservatório","autonomy":"Autonomia","refill":"Reabastecer","low_food":"Pouco alimento","days_short":"dias","portions_unit":"porções","v_schedule":"Horário","v_manual":"Manual","v_remote":"Remoto","v_unknown":"Desconhecido","v_none":"Nenhum"},"pt-PT":{"name":"Alimentador de animais","ready":"Pronto","feeding":"A alimentar","error":"Erro","unavailable":"Indisponível","feed":"Alimentar","led":"Indicador LED","child_lock":"Bloqueio infantil","portions":"Porções","weight":"Peso","serving":"Refeição","source":"Última alimentação","mode":"Modo","level":"Reservatório","autonomy":"Autonomia","refill":"Reabastecer","low_food":"Pouco alimento","days_short":"dias","portions_unit":"porções","v_schedule":"Horário","v_manual":"Manual","v_remote":"Remoto","v_unknown":"Desconhecido","v_none":"Nenhum"},"ru":{"name":"Умная кормушка","ready":"Готова","feeding":"Кормление","error":"Ошибка","unavailable":"Недоступно","feed":"Покормить","led":"Светодиод","child_lock":"Защита от детей","portions":"Порции","weight":"Вес","serving":"Порция","source":"Последнее кормление","mode":"Режим","level":"Бункер","autonomy":"Запас","refill":"Досыпать","low_food":"Корм заканчивается","days_short":"дн.","portions_unit":"порц.","v_schedule":"По расписанию","v_manual":"Вручную","v_remote":"Удалённо","v_unknown":"Неизвестно","v_none":"Нет"},"sr":{"name":"Хранилица за љубимце","ready":"Спремно","feeding":"Храњење у току","error":"Грешка","unavailable":"Недоступно","feed":"Нахрани","led":"ЛЕД индикатор","child_lock":"Дечја брава","portions":"Порције","weight":"Тежина","serving":"Сервирање","source":"Последње храњење","mode":"Режим","level":"Резервоар","autonomy":"Аутономија","refill":"Допуна","low_food":"Храна је при крају","days_short":"дана","portions_unit":"порција","v_schedule":"Распоред","v_manual":"Ручно","v_remote":"Даљински","v_unknown":"Непознато","v_none":"Ништа"},"sr-Latn":{"name":"Hranilica za ljubimce","ready":"Spremno","feeding":"Hranjenje u toku","error":"Greška","unavailable":"Nedostupno","feed":"Nahrani","led":"LED indikator","child_lock":"Dečja brava","portions":"Porcije","weight":"Težina","serving":"Serviranje","source":"Poslednje hranjenje","mode":"Režim","level":"Rezervoar","autonomy":"Autonomija","refill":"Dopuna","low_food":"Hrana je pri kraju","days_short":"dana","portions_unit":"porcija","v_schedule":"Raspored","v_manual":"Ručno","v_remote":"Daljinski","v_unknown":"Nepoznato","v_none":"Ništa"},"uk":{"name":"Годівниця для тварин","ready":"Готово","feeding":"Годування","error":"Помилка","unavailable":"Недоступно","feed":"Нагодувати","led":"LED-індикатор","child_lock":"Захист від дітей","portions":"Порції","weight":"Вага","serving":"Порція","source":"Останнє годування","mode":"Режим","level":"Бункер","autonomy":"Автономність","refill":"Поповнити","low_food":"Корм закінчується","days_short":"дн.","portions_unit":"порцій","v_schedule":"За розкладом","v_manual":"Вручну","v_remote":"Віддалено","v_unknown":"Невідомо","v_none":"Немає"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Repère du dessin = pixels de la photo (356 × 464). */
  const MODELS = {
    aqara_c1: {
      label: 'Aqara Smart Pet Feeder C1', pw: 356, ph: 464, box: [84, 8, 131, 171],
      img: window.__acImg("pet-feeder",0),
    },
  };
  const modelKey = () => 'aqara_c1';
  const BAD_RE = /^(on|error|fault|problem|true|1|jam|blocked|stuck|low_battery|food_low|empty)$/i;
  const ON_RE = /^(on|true|1|locked|lock|enabled|enable)$/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --pf-ok:var(--appliance-ok-color,#43a047);--pf-alert:var(--appliance-alert-color,#db4437);--kib:#b5682a;--glow:#4db2ff;--fill:0}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ready .badge{background:color-mix(in srgb,var(--pf-ok) 22%,transparent);color:var(--pf-ok)}
.feeding .badge{background:color-mix(in srgb,var(--kib) 28%,transparent);color:var(--kib)}
.error .badge{background:color-mix(in srgb,var(--pf-alert) 22%,transparent);color:var(--pf-alert)}
.alert{display:none;margin-top:4px;font-size:11px;color:var(--pf-alert);font-weight:500;text-align:center}
.error .alert,.lowfood .alert{display:block}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile .v small.pc{display:block;margin:0;line-height:12px}
.tile.hide{display:none}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{height:34px;min-width:34px;padding:0 10px;border-radius:17px;border:0;display:inline-flex;align-items:center;justify-content:center;gap:5px;cursor:pointer;color:var(--primary-text-color);font:600 12px var(--paper-font-body1_-_font-family,Roboto,sans-serif);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:18px}
.ctrls button:hover{transform:scale(1.05)}.ctrls button:active{transform:scale(.94)}
.ctrls button.main{background:var(--kib);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--kib) 55%,transparent)}
.ctrls button.on{background:var(--glow);color:#fff}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- distributeur ---- */
.photo{transition:filter .6s}
.unavailable .photo{filter:grayscale(.6) brightness(.8)}
.disp{fill:var(--glow);opacity:0;filter:blur(2.5px);transition:opacity .5s,fill .4s}
.ready .disp{opacity:.18}
.feeding .disp{opacity:.7;animation:pfdisp .8s ease-in-out infinite}
.error .disp{fill:#ff3b30;opacity:.8;animation:pfblink 1s steps(2) infinite}
@keyframes pfdisp{50%{opacity:.25}}
@keyframes pfblink{50%{opacity:.1}}
.btnglow{fill:var(--glow);opacity:0}
.feeding .btnglow{animation:pfdisp .8s ease-in-out infinite}
.lock{opacity:0;fill:none;stroke:#e8eaef;stroke-width:2.4;stroke-linecap:round}
.lock rect{fill:#e8eaef;stroke:none}
.locked .lock{opacity:.95}
.kib{fill:var(--kib);opacity:0;stroke:#7a3f12;stroke-width:.8}
.feeding .kib{animation:pffall 1.1s cubic-bezier(.4,0,.8,.6) infinite}
.kib:nth-child(2){animation-delay:.18s!important}.kib:nth-child(3){animation-delay:.36s!important}.kib:nth-child(4){animation-delay:.55s!important}.kib:nth-child(5){animation-delay:.74s!important}.kib:nth-child(6){animation-delay:.9s!important}
@keyframes pffall{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate(var(--dx,24px),48px)}}
.kib:nth-child(2){--dx:30px}.kib:nth-child(3){--dx:20px}.kib:nth-child(4){--dx:36px}.kib:nth-child(5){--dx:26px}.kib:nth-child(6){--dx:32px}
.mound{fill:var(--kib);stroke:#7a3f12;stroke-width:1;transform-box:fill-box;transform-origin:50% 100%;transform:scale(calc(.25 + var(--fill) * .75));opacity:calc(var(--fill) * 1.4);transition:transform .8s,opacity .8s}
.mound.dots{fill:#8b4a17;stroke:none}
.feeding .mound{animation:pfbump .55s ease-in-out infinite}
@keyframes pfbump{50%{transform:scale(calc(.3 + var(--fill) * .75)) translateY(-1px)}}
.tile.bad .v{color:var(--pf-alert)}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .alert{flex:none;font-size:10px;margin-top:2px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{height:22px;min-width:22px;padding:0 6px;font-size:10px;--mdc-icon-size:13px}
`;

  const SVG = (label, m) => {
    const [bx, by, bw, bh] = m.box, k = bw / m.pw;
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <g transform="translate(${bx} ${by}) scale(${k.toFixed(5)})">
  <image class="photo" href="${m.img}" x="0" y="0" width="${m.pw}" height="${m.ph}"/>
  <!-- tas de croquettes dans la gamelle -->
  <g class="mounds"><ellipse class="mound" cx="232" cy="378" rx="46" ry="17"/><g class="mound dots"><circle cx="212" cy="368" r="4"/><circle cx="226" cy="362" r="4"/><circle cx="242" cy="364" r="4"/><circle cx="256" cy="370" r="4"/><circle cx="234" cy="372" r="4"/></g></g>
  <!-- croquettes qui tombent de la trappe -->
  <g class="kibs"><circle class="kib" cx="172" cy="334" r="4.5"/><circle class="kib" cx="184" cy="332" r="4"/><circle class="kib" cx="178" cy="336" r="4.5"/><circle class="kib" cx="192" cy="334" r="4"/><circle class="kib" cx="168" cy="332" r="4"/><circle class="kib" cx="186" cy="336" r="4.5"/></g>
  <!-- écran, boutons, cadenas -->
  <rect class="disp" x="152" y="196" width="62" height="86" rx="28"/>
  <g class="btnglow"><circle cx="164" cy="285" r="7"/><circle cx="184" cy="285" r="7"/><circle cx="205" cy="285" r="7"/></g>
  <g class="lock" transform="translate(183 258)"><path d="M-5 -2 V-6 a5 5 0 0 1 10 0 V-2"/><rect x="-8" y="-2" width="16" height="12" rx="2.5"/></g>
 </g>
</svg>`;
  };

  class AppliancePetFeederCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom) => ids.find((i) => (!dom || dom.includes(i.split('.')[0])) && re.test(i)) || '';
      const feed = f(/feed/i, ['select', 'button', 'switch']);
      const base = feed.replace(/^[a-z_]+\./, '').replace(/_feed(er)?$|^feed_?/i, '');
      const pick = (re, dom) => f(re, dom);
      return { model: 'aqara_c1', ...(feed ? { entity_feed: feed } : {}), ...(pick(/portions_per_day/i, ['sensor']) ? { entity_portions: pick(/portions_per_day/i, ['sensor']) } : {}), ...(pick(/weight_per_day/i, ['sensor']) ? { entity_weight: pick(/weight_per_day/i, ['sensor']) } : {}), ...(base && pick(new RegExp(base + '.*error', 'i'), ['binary_sensor', 'sensor']) ? { entity_error: pick(new RegExp(base + '.*error', 'i'), ['binary_sensor', 'sensor']) } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_portions: true, show_weight: true, show_source: true, show_serving: true, show_mode: true, show_level: true, show_autonomy: true, food_low: 25, daily_goal: 6, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    disconnectedCallback() { clearTimeout(this._feedT); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _unit(id, d = '') { return (this._st(id)?.attributes || {}).unit_of_measurement || d; }
    _isOn(id) { const s = this._st(id); return !!s && ON_RE.test(String(s.state)); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      this._model = m;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="pftitle"></div><div class="badge" id="pfbadge"></div></div>
        <div class="alert" id="pfalert"></div>
        ${SVG(this._c.name || m.label, m)}
        <div class="ctrls" id="pfctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="portions"><div class="l"><ha-icon icon="mdi:food-drumstick"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="weight"><div class="l"><ha-icon icon="mdi:scale"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="serving"><div class="l"><ha-icon icon="mdi:bowl-mix"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="source"><div class="l"><ha-icon icon="mdi:history"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="mode"><div class="l"><ha-icon icon="mdi:calendar-clock"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="level"><div class="l"><ha-icon icon="mdi:storage-tank-outline"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="autonomy"><div class="l"><ha-icon icon="mdi:calendar-end"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_feed || this._c.entity_portions));
      const tgt = { portions: 'entity_portions', weight: 'entity_weight', serving: 'entity_serving', source: 'entity_source', mode: 'entity_mode', level: 'entity_level', autonomy: 'entity_level' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]])));
      root.getElementById('pfctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true; this._lastPortions = undefined;
    }

    _feedAnim(sec = 7) { this._feeding = true; clearTimeout(this._feedT); this._feedT = setTimeout(() => { this._feeding = false; if (this._built) this._render(); }, sec * 1000); }

    _cmd(k) {
      const c = this._c, h = this._hass; if (!h) return;
      if (k === 'feed' && c.entity_feed) {
        const d = c.entity_feed.split('.')[0];
        if (d === 'select') {
          // option envoyée telle que le select la déclare (« start » accepte « START », « Start »…)
          const want = String(c.feed_option || 'start'), fs = this._st(c.entity_feed), opts = (fs && fs.attributes && fs.attributes.options) || [];
          const opt = opts.find((o) => String(o) === want) ?? opts.find((o) => String(o).toLowerCase() === want.toLowerCase()) ?? want;
          h.callService('select', 'select_option', { entity_id: c.entity_feed, option: opt });
        }
        else if (d === 'button' || d === 'input_button') h.callService(d, 'press', { entity_id: c.entity_feed });
        else h.callService(d === 'script' ? 'script' : 'homeassistant', 'turn_on', { entity_id: c.entity_feed });
        this._feedAnim(); this._render();
      } else if (k === 'led' && c.entity_led) h.callService('homeassistant', 'toggle', { entity_id: c.entity_led });
      else if (k === 'lock' && c.entity_child_lock) h.callService('homeassistant', 'toggle', { entity_id: c.entity_child_lock });
      else if (k === 'refill' && c.entity_level) {
        // trémie remplie : remet le niveau à la capacité (grammes, ou 100 si l'entité est en %)
        const d = c.entity_level.split('.')[0], pct = /%/.test(this._unit(c.entity_level));
        h.callService(d, 'set_value', { entity_id: c.entity_level, value: pct ? 100 : this._cap() });
      }
    }

    _cap() { return Number(this._c.hopper_capacity) > 0 ? Number(this._c.hopper_capacity) : 1500; }
    // niveau de la trémie : { frac (0-1), grams, days } ; NaN si `entity_level` absente ou indisponible
    _level() {
      const c = this._c, v = this._num(c.entity_level), cap = this._cap();
      if (isNaN(v)) return { frac: NaN, grams: NaN, days: NaN };
      const frac = Math.max(0, Math.min(1, /%/.test(this._unit(c.entity_level)) ? v / 100 : v / cap)), grams = frac * cap;
      // consommation par jour : option daily_consumption (g), sinon poids du jour, sinon portions du jour × poids d'une portion
      const w = this._num(c.entity_weight), pp = this._num(c.entity_portions), pw = this._num(c.entity_portion_weight);
      const daily = Number(c.daily_consumption) > 0 ? Number(c.daily_consumption) : w > 0 ? w : pp > 0 && pw > 0 ? pp * pw : NaN;
      return { frac, grams, days: isNaN(daily) ? NaN : grams / daily };
    }

    _state() {
      const c = this._c;
      const main = this._st(c.entity_feed) || this._st(c.entity_portions) || this._st(c.entity_weight);
      if (!main || /^(unavailable)$/i.test(String(main.state))) return 'unavailable';
      const e = this._st(c.entity_error);
      if (e && String(e.state) && !/^(off|false|0|none|ok|no_error|unknown|unavailable|)$/i.test(String(e.state)) && BAD_RE.test(String(e.state).replace(/\s+/g, '_'))) return 'error';
      if (e && !/^(off|false|0|none|ok|no_error|unknown|unavailable|)$/i.test(String(e.state)) && e.entity_id.startsWith('sensor.')) return 'error';
      if (this._feeding) return 'feeding';
      return 'ready';
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, m = this._model;
      // une portion de plus aujourd'hui = une distribution vient d'avoir lieu
      const pp = this._num(c.entity_portions);
      if (this._lastPortions !== undefined && !isNaN(pp) && pp > this._lastPortions) this._feedAnim();
      if (!isNaN(pp)) this._lastPortions = pp;
      const st = this._state(), lv = this._level();
      const low = !isNaN(lv.frac) && lv.frac * 100 <= (Number(c.food_low) >= 0 ? Number(c.food_low) : 25);
      card.className = `${st}${low ? ' lowfood' : ''}${this._isOn(c.entity_child_lock) ? ' locked' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;
      const goal = Number(c.daily_goal) > 0 ? Number(c.daily_goal) : 6;
      card.style.setProperty('--fill', (isNaN(pp) ? 0 : Math.max(0, Math.min(1, pp / goal))).toFixed(3));

      r.getElementById('pftitle').textContent = c.name || m.label;
      const badge = r.getElementById('pfbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      const es = this._st(c.entity_error);
      r.getElementById('pfalert').textContent = st === 'error' ? `${this._t('error')}${es && !/^(on|true)$/i.test(es.state) ? ` : ${es.state}` : ''}` : low && st !== 'unavailable' ? this._t('low_food') : '';

      const modeS = this._st(c.entity_mode), ledOn = this._isOn(c.entity_led), lockOn = this._isOn(c.entity_child_lock);
      const btns = [
        ['feed', 'mdi:food-drumstick', this._t('feed'), 'main', !!c.entity_feed && !!this._st(c.entity_feed)],
        ['led', 'mdi:led-on', this._t('led'), ledOn ? 'on' : '', !!this._st(c.entity_led)],
        ['lock', lockOn ? 'mdi:lock' : 'mdi:lock-open-variant', this._t('child_lock'), lockOn ? 'on' : '', !!this._st(c.entity_child_lock)],
        // Remplir : seulement si le niveau est un input_number / number (modifiable)
        ['refill', 'mdi:bucket-outline', this._t('refill'), '', !!this._st(c.entity_level) && /^(input_number|number)\./.test(c.entity_level)],
      ].filter((b) => b[4] && c.show_controls !== false);
      const ctr = r.getElementById('pfctrls');
      ctr.classList.toggle('hide', !btns.length);
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, cls]) => `<button class="${cls}" data-k="${k}" title="${esc(lbl)}" aria-label="${esc(lbl)}"${st === 'unavailable' || (k === 'feed' && (st === 'feeding' || this._isOn(c.entity_child_lock))) ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon>${k === 'feed' ? `<span>${esc(lbl)}</span>` : ''}</button>`).join('');
      }

      const w = this._num(c.entity_weight), sv = this._num(c.entity_serving), pw = this._num(c.entity_portion_weight);
      const src = this._st(c.entity_source), val = (s) => (s ? String(s.state) : '');
      const V = {
        portions: [!!this._st(c.entity_portions) && c.show_portions !== false, this._fmt(pp, 0), ''],
        weight: [!!this._st(c.entity_weight) && c.show_weight !== false, this._fmt(w, 0), this._unit(c.entity_weight, 'g')],
        serving: [!!this._st(c.entity_serving) && c.show_serving !== false, this._fmt(sv, 0), isNaN(pw) ? this._t('portions_unit') : `× ${this._fmt(pw, 0)} g`],
        source: [!!src && c.show_source !== false, this._tr(val(src)), ''],
        mode: [!!modeS && c.show_mode !== false, this._tr(val(modeS)), ''],
        level: [!isNaN(lv.frac) && c.show_level !== false, this._fmt(lv.grams, 0), 'g', `${this._fmt(lv.frac * 100, 0)} %`],
        autonomy: [!isNaN(lv.days) && c.show_autonomy !== false, this._fmt(lv.days, lv.days < 10 ? 1 : 0), this._t('days_short')],
      };
      Object.entries(V).forEach(([k, [show, v, unit, sub]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit;
        const parts = [String(v), small];
        if (sub) { const pc = document.createElement('small'); pc.className = 'pc'; pc.textContent = sub; parts.push(pc); }
        el.querySelector('.v').replaceChildren(...parts);
        el.classList.toggle('bad', low && (k === 'level' || k === 'autonomy'));
      });
    }
    // valeurs Zigbee2MQTT (schedule, manual, remote, mode…) → texte traduit quand il existe
    _tr(v) { const k = `v_${String(v).toLowerCase().replace(/[^a-z0-9]+/g, '_')}`; return T[this._lang()][k] ?? T.en[k] ?? v; }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, AppliancePetFeederCard);

  /* ---- éditeur visuel ---- */
  class AppliancePetFeederCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'model', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: m.label })) } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_feed'), { name: 'feed_option', selector: { text: {} } }, ent('entity_source'), ent('entity_serving', 'number'), ent('entity_portion_weight', 'number'),
        ent('entity_portions', 'sensor'), ent('entity_weight', 'sensor'), ent('entity_error'), ent('entity_led', 'switch'), ent('entity_child_lock', 'switch'), ent('entity_mode', 'select'),
        ent('entity_level', ['input_number', 'number', 'sensor']),
        { name: 'hopper_capacity', default: 1500, selector: { number: { min: 50, max: 20000, step: 50, mode: 'box', unit_of_measurement: 'g' } } },
        { name: 'daily_consumption', selector: { number: { min: 0, max: 2000, step: 5, mode: 'box', unit_of_measurement: 'g' } } },
        { name: 'food_low', default: 25, selector: { number: { min: 0, max: 100, step: 5, mode: 'box', unit_of_measurement: '%' } } },
        { name: 'daily_goal', default: 6, selector: { number: { min: 1, max: 20, step: 1, mode: 'box' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_portions'), bool('show_weight'), bool('show_serving'), bool('show_source'), bool('show_mode'), bool('show_level'), bool('show_autonomy'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'pet_feeder_model' : s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', AppliancePetFeederCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Distributeur de croquettes en photo (Aqara Smart Pet Feeder C1) : croquettes qui tombent dans la gamelle, portions du jour, erreur, sécurité enfant, mode.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
