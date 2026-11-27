/* Carte « Coordinateur Zigbee » — custom:appliance-zigbee-coordinator-card
 * Coordinateur Zigbee en photo détourée (SMLIGHT SLZB-06) avec ses LED animées : LED Zigbee2MQTT (verte quand le bridge
 * est connecté, rouge clignotante si un redémarrage est requis) et les deux LED du port Ethernet (lien / activité).
 * Boutons : autoriser l'appairage (switch, confirmation), redémarrer le cœur / Zigbee (button, confirmation).
 * Tuiles : températures (cœur, puce Zigbee), RAM, disponibilité Zigbee, version du bridge.
 */
(() => {
  const TAG = 'appliance-zigbee-coordinator-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Zigbee coordinator","online":"Online","offline":"Offline","unavailable":"Unavailable","join":"Allow pairing","restart_core":"Restart core","restart_zigbee":"Restart Zigbee","join_confirm":"Allow new Zigbee devices to join the network?","restart_confirm":"Restart the coordinator? Zigbee devices will be briefly unavailable.","temp_core":"Core temp.","temp_zigbee":"Zigbee chip temp.","ram":"RAM","uptime":"Zigbee uptime","version":"Bridge version","devices":"Devices","f_model":"Coordinator model","f_entity_connection":"Zigbee2MQTT bridge connection (binary_sensor)","f_entity_restart_required":"Bridge restart required (binary_sensor, optional)","f_entity_ethernet":"Ethernet link (binary_sensor)","f_entity_permit_join":"Permit join (switch)","f_entity_restart_core":"Restart core (button)","f_entity_restart_zigbee":"Restart Zigbee (button)","f_entity_temp_core":"Core chip temperature (sensor)","f_entity_temp_zigbee":"Zigbee chip temperature (sensor)","f_entity_ram":"RAM usage (sensor, %)","f_entity_uptime":"Zigbee uptime (sensor, seconds or timestamp)","f_entity_version":"Zigbee2MQTT bridge version (sensor)","f_entity_devices":"Paired devices count (sensor, optional)"},"es":{"name":"Coordinador Zigbee","online":"En línea","offline":"Desconectado","unavailable":"No disponible","join":"Permitir emparejar","restart_core":"Reiniciar núcleo","restart_zigbee":"Reiniciar Zigbee","join_confirm":"¿Permitir que nuevos dispositivos Zigbee se unan a la red?","restart_confirm":"¿Reiniciar el coordinador? Los dispositivos Zigbee quedarán brevemente no disponibles.","temp_core":"Temp. núcleo","temp_zigbee":"Temp. chip Zigbee","ram":"RAM","uptime":"Actividad Zigbee","version":"Versión del bridge","devices":"Dispositivos","f_model":"Modelo del coordinador","f_entity_connection":"Conexión del bridge Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Reinicio del bridge requerido (binary_sensor, opcional)","f_entity_ethernet":"Enlace Ethernet (binary_sensor)","f_entity_permit_join":"Permitir emparejar (switch)","f_entity_restart_core":"Reiniciar núcleo (button)","f_entity_restart_zigbee":"Reiniciar Zigbee (button)","f_entity_temp_core":"Temperatura del chip del núcleo (sensor)","f_entity_temp_zigbee":"Temperatura del chip Zigbee (sensor)","f_entity_ram":"Uso de RAM (sensor, %)","f_entity_uptime":"Actividad de Zigbee (sensor, segundos o fecha)","f_entity_version":"Versión del bridge Zigbee2MQTT (sensor)","f_entity_devices":"Nº de dispositivos emparejados (sensor, opcional)"},"fr":{"name":"Coordinateur Zigbee","online":"En ligne","offline":"Hors ligne","unavailable":"Indisponible","join":"Autoriser l’appairage","restart_core":"Redémarrer le cœur","restart_zigbee":"Redémarrer Zigbee","join_confirm":"Autoriser de nouveaux appareils Zigbee à rejoindre le réseau ?","restart_confirm":"Redémarrer le coordinateur ? Les appareils Zigbee seront brièvement indisponibles.","temp_core":"Temp. cœur","temp_zigbee":"Temp. puce Zigbee","ram":"RAM","uptime":"Disponibilité Zigbee","version":"Version du bridge","devices":"Appareils","f_model":"Modèle du coordinateur","f_entity_connection":"Connexion du bridge Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Redémarrage du bridge requis (binary_sensor, optionnel)","f_entity_ethernet":"Liaison Ethernet (binary_sensor)","f_entity_permit_join":"Autoriser l’appairage (switch)","f_entity_restart_core":"Redémarrer le cœur (button)","f_entity_restart_zigbee":"Redémarrer Zigbee (button)","f_entity_temp_core":"Température de la puce cœur (sensor)","f_entity_temp_zigbee":"Température de la puce Zigbee (sensor)","f_entity_ram":"Utilisation RAM (sensor, %)","f_entity_uptime":"Disponibilité Zigbee (sensor, secondes ou horodatage)","f_entity_version":"Version du bridge Zigbee2MQTT (sensor)","f_entity_devices":"Nombre d’appareils appairés (sensor, optionnel)"},"pt-BR":{"name":"Coordenador Zigbee","online":"Conectado","offline":"Desconectado","unavailable":"Indisponível","join":"Permitir emparelhamento","restart_core":"Reiniciar núcleo","restart_zigbee":"Reiniciar Zigbee","join_confirm":"Permitir que novos dispositivos Zigbee entrem na rede?","restart_confirm":"Reiniciar o coordenador? Os dispositivos Zigbee ficarão brevemente indisponíveis.","temp_core":"Temp. do núcleo","temp_zigbee":"Temp. do chip Zigbee","ram":"RAM","uptime":"Tempo de atividade Zigbee","version":"Versão da ponte","devices":"Dispositivos","f_model":"Modelo do coordenador","f_entity_connection":"Conexão da ponte Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Reinício da ponte necessário (binary_sensor, opcional)","f_entity_ethernet":"Conexão Ethernet (binary_sensor)","f_entity_permit_join":"Permitir emparelhamento (switch)","f_entity_restart_core":"Reiniciar núcleo (button)","f_entity_restart_zigbee":"Reiniciar Zigbee (button)","f_entity_temp_core":"Temperatura do chip principal (sensor)","f_entity_temp_zigbee":"Temperatura do chip Zigbee (sensor)","f_entity_ram":"Uso de RAM (sensor, %)","f_entity_uptime":"Tempo de atividade Zigbee (sensor, segundos ou timestamp)","f_entity_version":"Versão da ponte Zigbee2MQTT (sensor)","f_entity_devices":"Número de dispositivos emparelhados (sensor, opcional)"},"pt-PT":{"name":"Coordenador Zigbee","online":"Ligado","offline":"Desligado","unavailable":"Indisponível","join":"Permitir emparelhamento","restart_core":"Reiniciar núcleo","restart_zigbee":"Reiniciar Zigbee","join_confirm":"Permitir que novos dispositivos Zigbee se juntem à rede?","restart_confirm":"Reiniciar o coordenador? Os dispositivos Zigbee ficarão brevemente indisponíveis.","temp_core":"Temp. do núcleo","temp_zigbee":"Temp. do chip Zigbee","ram":"RAM","uptime":"Tempo de atividade Zigbee","version":"Versão da ponte","devices":"Dispositivos","f_model":"Modelo do coordenador","f_entity_connection":"Ligação da ponte Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Reinício da ponte necessário (binary_sensor, opcional)","f_entity_ethernet":"Ligação Ethernet (binary_sensor)","f_entity_permit_join":"Permitir emparelhamento (switch)","f_entity_restart_core":"Reiniciar núcleo (button)","f_entity_restart_zigbee":"Reiniciar Zigbee (button)","f_entity_temp_core":"Temperatura do chip principal (sensor)","f_entity_temp_zigbee":"Temperatura do chip Zigbee (sensor)","f_entity_ram":"Utilização de RAM (sensor, %)","f_entity_uptime":"Tempo de atividade Zigbee (sensor, segundos ou carimbo de data/hora)","f_entity_version":"Versão da ponte Zigbee2MQTT (sensor)","f_entity_devices":"Número de dispositivos emparelhados (sensor, opcional)"},"ru":{"name":"Координатор Zigbee","online":"В сети","offline":"Не в сети","unavailable":"Недоступно","join":"Разрешить сопряжение","restart_core":"Перезапустить ядро","restart_zigbee":"Перезапустить Zigbee","join_confirm":"Разрешить новым устройствам Zigbee подключаться к сети?","restart_confirm":"Перезапустить координатор? Устройства Zigbee будут временно недоступны.","temp_core":"Темп. ядра","temp_zigbee":"Темп. чипа Zigbee","ram":"ОЗУ","uptime":"Время работы Zigbee","version":"Версия моста","devices":"Устройства","f_model":"Модель координатора","f_entity_connection":"Соединение моста Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Требуется перезапуск моста (binary_sensor, необязательно)","f_entity_ethernet":"Соединение Ethernet (binary_sensor)","f_entity_permit_join":"Разрешить сопряжение (switch)","f_entity_restart_core":"Перезапуск ядра (button)","f_entity_restart_zigbee":"Перезапуск Zigbee (button)","f_entity_temp_core":"Температура основного чипа (sensor)","f_entity_temp_zigbee":"Температура чипа Zigbee (sensor)","f_entity_ram":"Использование ОЗУ (sensor, %)","f_entity_uptime":"Время работы Zigbee (sensor, секунды или метка времени)","f_entity_version":"Версия моста Zigbee2MQTT (sensor)","f_entity_devices":"Количество устройств (sensor, необязательно)"},"uk":{"name":"Координатор Zigbee","online":"У мережі","offline":"Не в мережі","unavailable":"Недоступно","join":"Дозволити підключення","restart_core":"Перезапустити ядро","restart_zigbee":"Перезапустити Zigbee","join_confirm":"Дозволити новим пристроям Zigbee приєднуватися до мережі?","restart_confirm":"Перезапустити координатор? Пристрої Zigbee ненадовго стануть недоступними.","temp_core":"Темп. ядра","temp_zigbee":"Темп. чипа Zigbee","ram":"ОЗП","uptime":"Час роботи Zigbee","version":"Версія моста","devices":"Пристрої","f_model":"Модель координатора","f_entity_connection":"З'єднання моста Zigbee2MQTT (binary_sensor)","f_entity_restart_required":"Потрібен перезапуск моста (binary_sensor, необов'язково)","f_entity_ethernet":"Ethernet-з'єднання (binary_sensor)","f_entity_permit_join":"Дозвіл на підключення (switch)","f_entity_restart_core":"Перезапуск ядра (button)","f_entity_restart_zigbee":"Перезапуск Zigbee (button)","f_entity_temp_core":"Температура чипа ядра (sensor)","f_entity_temp_zigbee":"Температура чипа Zigbee (sensor)","f_entity_ram":"Використання ОЗП (sensor, %)","f_entity_uptime":"Час роботи Zigbee (sensor, секунди або мітка часу)","f_entity_version":"Версія моста Zigbee2MQTT (sensor)","f_entity_devices":"Кількість підключених пристроїв (sensor, необов'язково)"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // modèles : photo détourée (pw × ph = repère propre à la photo), box = emplacement dans le viewBox 220×230 de la carte,
  // led_zigbee = LED d'état Zigbee2MQTT (face latérale), led_eth = LED liaison / activité du port Ethernet (RJ45)
  const MODELS = {
    slzb06: {
      label: 'SMLIGHT SLZB-06', pw: 640, ph: 884, box: [45, 14, 130, 179],
      led_zigbee: [113, 665],
      led_eth: [[589, 782], [617, 771]],
      img: window.__acImg("zigbee-coordinator",0),
    },
  };
  const modelKey = (m) => (MODELS[String(m || '').toLowerCase()] ? String(m).toLowerCase() : 'slzb06');

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--zc-ok:var(--appliance-ok-color,#43a047);--zc-warn:var(--appliance-warn-color,#ffa000);--zc-alert:var(--appliance-alert-color,#db4437)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--zc-ok) 20%,transparent);color:var(--zc-ok)}
.unavailable .badge{background:color-mix(in srgb,var(--zc-alert) 20%,transparent);color:var(--zc-alert)}
svg{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:4px auto 0;overflow:visible}
.photo{filter:drop-shadow(0 3px 4px rgba(0,0,0,.35))}
.ledglow{opacity:0;filter:blur(2.5px);transition:opacity .4s}
.led{fill:#2b3138;transition:fill .3s}
.zig .ledglow,.zig .led{fill:#3ddc6a}
.online .zig .led{fill:#3ddc6a;filter:drop-shadow(0 0 2px #3ddc6a)}.online .zig .ledglow{opacity:.6}
.restart .zig .ledglow,.restart .zig .led{fill:var(--zc-warn)}
.restart .zig .led{filter:drop-shadow(0 0 2px var(--zc-warn));animation:zcblink 1s steps(1) infinite}.restart .zig .ledglow{opacity:.6}
.eth-g .ledglow,.eth-g .led{fill:#3ddc6a}.eth-a .ledglow,.eth-a .led{fill:#ffb300}
.ethup .eth-g .led,.ethup .eth-a .led{filter:drop-shadow(0 0 2px currentColor)}.ethup .eth-g .ledglow,.ethup .eth-a .ledglow{opacity:.55}
.join .zig .ledglow,.join .zig .led{fill:#29b6f6}.join .zig .led{filter:drop-shadow(0 0 2.5px #29b6f6);animation:zcblink .6s steps(1) infinite}.join .zig .ledglow{opacity:.7}
@keyframes zcblink{0%,100%{opacity:1}50%{opacity:.25}}
.noanim *{animation:none!important}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.ctrls{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctrls button.on{background:#29b6f6;color:#06202b}
.ctrls button ha-icon{--mdc-icon-size:16px}
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none}.compact .title{font-size:12px;line-height:16px}.compact .badge{font-size:10px;padding:0 6px}
.compact svg{margin-top:3px}.compact .tiles{gap:3px;margin-top:4px}.compact .tile{padding:2px 5px;border-radius:8px}.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
`;

  const uptimeSeconds = (st) => {
    if (!st || /^(unavailable|unknown|none)$/i.test(String(st.state))) return NaN;
    const raw = String(st.state), n = parseFloat(raw.replace(',', '.'));
    if ((st.attributes || {}).device_class === 'timestamp' || (!isFinite(n) && !isNaN(Date.parse(raw)))) { const ms = Date.now() - Date.parse(raw); return ms > 0 ? ms / 1000 : NaN; }
    if (!isFinite(n)) return NaN;
    const u = String((st.attributes || {}).unit_of_measurement || 's').toLowerCase();
    return n * (u === 'd' ? 86400 : u === 'h' ? 3600 : u === 'min' ? 60 : u === 'ms' ? 0.001 : 1);
  };
  const fmtUptime = (sec, loc) => {
    if (!isFinite(sec)) return '--';
    const f = (v, unit) => new Intl.NumberFormat(loc, { style: 'unit', unit, unitDisplay: 'narrow', maximumFractionDigits: 0 }).format(v);
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), mi = Math.floor((sec % 3600) / 60);
    return d ? `${f(d, 'day')} ${f(h, 'hour')}` : h ? `${f(h, 'hour')} ${f(mi, 'minute')}` : f(mi, 'minute');
  };

  // illustration : photo dans son repère pw × ph, mise à l'échelle dans le viewBox 220×230 via box=[x,y,w,h] ;
  // les LED (petits cercles avec halo) sont placées dans ce même repère, donc en coordonnées de la photo
  const SVG = (label, m) => {
    const [bx, by, bw] = m.box, k = bw / m.pw;
    const led = (cx, cy, cls, r = 15, gr = 22) => `<g class="${cls}"><ellipse class="ledglow" cx="${cx}" cy="${cy}" rx="${gr}" ry="${gr * 0.45}"/><circle class="led" cx="${cx}" cy="${cy}" r="${r}"/></g>`;
    return `
<svg viewBox="0 0 220 230" role="img" aria-label="${esc(label)}">
 <g transform="translate(${bx} ${by}) scale(${k.toFixed(5)})">
  <image class="photo" href="${m.img}" x="0" y="0" width="${m.pw}" height="${m.ph}"/>
  ${led(m.led_zigbee[0], m.led_zigbee[1], 'zig')}
  ${led(m.led_eth[0][0], m.led_eth[0][1], 'eth-g', 9, 13)}
  ${led(m.led_eth[1][0], m.led_eth[1][1], 'eth-a', 9, 13)}
 </g>
</svg>`;
  };

  class ApplianceZigbeeCoordinatorCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const pick = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      return {
        model: 'slzb06',
        entity_connection: pick(/zigbee2mqtt.*bridge.*connection/i, 'binary_sensor'),
        entity_ethernet: pick(/slzb.*ethernet/i, 'binary_sensor'),
        entity_permit_join: pick(/zigbee2mqtt.*permit.*join/i, 'switch'),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, animations: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 4; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(id) { const s = this._st(id); return this._ok(s) && /^(on|true|1)$/i.test(String(s.state).trim()); }
    _num(id) { const s = this._st(id); if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _unit(id, d) { return String((this._st(id)?.attributes || {}).unit_of_measurement || d || '').trim(); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      this._model = m;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="zctitle"></div><div class="badge" id="zcbadge"></div></div>
        ${SVG(this._c.name || m.label, m)}
        <div class="ctrls" id="zcctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="temp_core"><div class="l"><ha-icon icon="mdi:thermometer"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="temp_zigbee"><div class="l"><ha-icon icon="mdi:thermometer"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="ram"><div class="l"><ha-icon icon="mdi:memory"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="uptime"><div class="l"><ha-icon icon="mdi:clock-outline"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="version"><div class="l"><ha-icon icon="mdi:chip"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="devices"><div class="l"><ha-icon icon="mdi:zigbee"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_connection));
      const tgt = { temp_core: 'entity_temp_core', temp_zigbee: 'entity_temp_zigbee', ram: 'entity_ram', uptime: 'entity_uptime', version: 'entity_version', devices: 'entity_devices' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]])));
      root.getElementById('zcctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true;
    }

    _state() {
      const c = this._c, s = this._st(c.entity_connection) || this._st(c.entity_ethernet);
      if (!s) return 'unavailable';
      if (!this._ok(s)) return 'unavailable';
      return /^(on|true|1)$/i.test(String(s.state).trim()) ? 'online' : 'offline';
    }

    _cmd(k) {
      const c = this._c, hass = this._hass; if (!hass) return;
      if (k === 'join' && c.entity_permit_join) {
        const on = this._on(c.entity_permit_join);
        if (on || !window.confirm || window.confirm(this._t('join_confirm'))) hass.callService('switch', on ? 'turn_off' : 'turn_on', { entity_id: c.entity_permit_join });
      } else if (k === 'restart_core' && c.entity_restart_core) {
        if (!window.confirm || window.confirm(this._t('restart_confirm'))) hass.callService('button', 'press', { entity_id: c.entity_restart_core });
      } else if (k === 'restart_zigbee' && c.entity_restart_zigbee) {
        if (!window.confirm || window.confirm(this._t('restart_confirm'))) hass.callService('button', 'press', { entity_id: c.entity_restart_zigbee });
      }
    }

    _render() {
      if (!this._built || this._model !== MODELS[modelKey(this._c.model)]) this._build();
      const c = this._c, r = this._root, card = this._card;
      const st = this._state(), join = c.entity_permit_join && this._on(c.entity_permit_join);
      const restartReq = c.entity_restart_required && this._on(c.entity_restart_required);
      const ethUp = c.entity_ethernet ? this._on(c.entity_ethernet) : st === 'online';
      card.className = `${st}${ethUp ? ' ethup' : ''}${join ? ' join' : restartReq ? ' restart' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;

      r.getElementById('zctitle').textContent = c.name || this._model.label;
      const badge = r.getElementById('zcbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      const ctr = r.getElementById('zcctrls');
      const btns = [
        c.entity_permit_join ? ['join', join ? 'mdi:account-check' : 'mdi:account-plus', 'join', join] : null,
        c.entity_restart_core ? ['restart_core', 'mdi:restart', 'restart_core', false] : null,
        c.entity_restart_zigbee ? ['restart_zigbee', 'mdi:zigbee', 'restart_zigbee', false] : null,
      ].filter(Boolean);
      ctr.classList.toggle('hide', !btns.length || c.show_controls === false);
      const sig = btns.map((b) => b.join('|')).join(';');
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on]) => `<button class="${on ? 'on' : ''}" data-k="${k}" title="${esc(this._l(lbl))}" aria-label="${esc(this._l(lbl))}"><ha-icon icon="${icon}"></ha-icon></button>`).join('');
      }

      const tc = this._num(c.entity_temp_core), tz = this._num(c.entity_temp_zigbee), ram = this._num(c.entity_ram);
      const up = uptimeSeconds(this._st(c.entity_uptime)), dv = this._num(c.entity_devices);
      const verSt = this._st(c.entity_version);
      const V = {
        temp_core: [!!this._st(c.entity_temp_core), this._fmt(tc, 0), this._unit(c.entity_temp_core, '°C')],
        temp_zigbee: [!!this._st(c.entity_temp_zigbee), this._fmt(tz, 0), this._unit(c.entity_temp_zigbee, '°C')],
        ram: [!!this._st(c.entity_ram), this._fmt(ram, 0), this._unit(c.entity_ram, '%')],
        uptime: [!!this._st(c.entity_uptime), fmtUptime(up, window.applianceLocale(this._c, this._hass)), ''],
        version: [!!verSt, this._ok(verSt) ? String(verSt.state) : '--', ''],
        devices: [!!this._st(c.entity_devices), this._fmt(dv, 0), ''],
      };
      Object.entries(V).forEach(([k, [show, val, unit]]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`);
        el.classList.toggle('hide', !show);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit;
        el.querySelector('.v').replaceChildren(String(val), small);
      });
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceZigbeeCoordinatorCard);

  /* ---- éditeur visuel ---- */
  class ApplianceZigbeeCoordinatorCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => { this._c = e.detail.value; this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true })); });
        this.appendChild(this._form);
      }
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } }, { name: 'labels', selector: { object: {} } },
        { name: 'model', default: 'slzb06', selector: { select: { mode: 'dropdown', options: Object.entries(MODELS).map(([value, m]) => ({ value, label: m.label })) } } },
        ent('entity_connection', 'binary_sensor'), ent('entity_restart_required', 'binary_sensor'), ent('entity_ethernet', 'binary_sensor'),
        ent('entity_permit_join', 'switch'), ent('entity_restart_core', 'button'), ent('entity_restart_zigbee', 'button'),
        ent('entity_temp_core', 'sensor'), ent('entity_temp_zigbee', 'sensor'), ent('entity_ram', 'sensor'), ent('entity_uptime', 'sensor'),
        ent('entity_version', 'sensor'), ent('entity_devices', 'sensor'),
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => { const l = window.applianceLang(T, this._c, this._hass); return T[l][`f_${s.name}`] ?? T.en[`f_${s.name}`] ?? window.applianceEditorLabel(s.name, this._hass); };
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceZigbeeCoordinatorCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: "Coordinateur Zigbee en photo détourée (SMLIGHT SLZB-06) avec Zigbee2MQTT : LED de connexion et de liaison Ethernet, autoriser l'appairage, redémarrer, températures, RAM, disponibilité.", preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/zigbee-coordinator.md',
  });
})();
