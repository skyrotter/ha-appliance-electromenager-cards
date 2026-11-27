/* Carte « Box internet » — custom:appliance-internet-box-card
 * Photos détourées : Freebox Pop (model: freebox_pop), Freebox Ultra (freebox_ultra), Freebox Delta (freebox_delta), SFR Box (model: sfr_box), Orange Livebox fibre (model: livebox), ASUS GT-BE98 (asus_gt_be98), ASUS RT-AC88U
 * (asus_rt_ac88u), ASUS RT-BE92U (asus_rt_be92u), ASUS RT-AC68U (asus_rt_ac68u), Xiaomi AX3000 NE (xiaomi_ax3000), TP-Link Deco M4 mesh (tplink_deco_m4) et routeur générique à antennes dessiné (router), chacune avec son dessin SVG
 * vectoriel (illustration: svg) à la place de la photo.
 * Entités : état de la connexion (binary_sensor connectivity, sensor, device_tracker…), débit descendant / montant,
 * nombre d'appareils connectés, interrupteur Wi-Fi et bouton de redémarrage (tous facultatifs).
 * Animations : ondes Wi-Fi émises par la box, paquets qui descendent vers la box (téléchargement) et en repartent
 * (envoi) à la vitesse du débit, LED de la box (blanche en ligne, rouge qui clignote hors ligne), tuile Wi-Fi allumée
 * sur l'écran de la SFR Box, nuage « Internet » barré en cas de coupure.
 * États : online, offline, unavailable.
 */
(() => {
  const TAG = 'appliance-internet-box-card';
  if ((window.__acHasReal||customElements.get.bind(customElements))(TAG)) return;

  const T = {"en":{"name":"Internet box","online":"Online","offline":"Offline","unavailable":"Unavailable","download":"Download","upload":"Upload","devices":"Devices","wifi":"Wi-Fi","on":"On","off":"Off","reboot":"Restart","reboot_confirm":"Restart the box? The internet connection will be cut for a few minutes.","ping":"Ping","wan_ip":"WAN IP","uptime":"Uptime","cpu":"CPU","memory":"Memory","wifi_24":"Wi-Fi 2.4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Guest Wi-Fi","wifi_iot":"IoT Wi-Fi"},"da":{"name":"Router","online":"Online","offline":"Offline","unavailable":"Utilgængelig","download":"Download","upload":"Upload","devices":"Enheder","wifi":"Wi-Fi","on":"Til","off":"Fra","reboot":"Genstart","reboot_confirm":"Genstart routeren? Internetforbindelsen afbrydes i nogle minutter.","ping":"Ping","wan_ip":"WAN-IP","uptime":"Oppetid","cpu":"CPU","memory":"Hukommelse","wifi_24":"Wi-Fi 2,4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Gæste-Wi-Fi","wifi_iot":"IoT-Wi-Fi"},"de":{"name":"Internet-Box","online":"Online","offline":"Offline","unavailable":"Nicht verfügbar","download":"Download","upload":"Upload","devices":"Geräte","wifi":"WLAN","on":"Ein","off":"Aus","reboot":"Neustart","reboot_confirm":"Box neu starten? Die Internetverbindung ist einige Minuten unterbrochen.","ping":"Ping","wan_ip":"WAN-IP","uptime":"Betriebszeit","cpu":"CPU","memory":"Speicher","wifi_24":"WLAN 2,4 GHz","wifi_5":"WLAN 5 GHz","wifi_6":"WLAN 6 GHz","wifi_guest":"Gast-WLAN","wifi_iot":"IoT-WLAN"},"es":{"name":"Router de internet","online":"En línea","offline":"Desconectado","unavailable":"No disponible","download":"Descarga","upload":"Subida","devices":"Dispositivos","wifi":"Wi-Fi","on":"Activado","off":"Desactivado","reboot":"Reiniciar","reboot_confirm":"¿Reiniciar el router? La conexión a internet se cortará durante unos minutos.","ping":"Ping","wan_ip":"IP WAN","uptime":"Tiempo en marcha","cpu":"CPU","memory":"Memoria","wifi_24":"Wi-Fi 2,4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi de invitados","wifi_iot":"Wi-Fi IoT"},"fr":{"name":"Box internet","online":"En ligne","offline":"Hors ligne","unavailable":"Indisponible","download":"Descendant","upload":"Montant","devices":"Appareils","wifi":"Wi-Fi","on":"Activé","off":"Coupé","reboot":"Redémarrer","reboot_confirm":"Redémarrer la box ? La connexion internet sera coupée quelques minutes.","ping":"Ping","wan_ip":"IP WAN","uptime":"Disponibilité","cpu":"Processeur","memory":"Mémoire","wifi_24":"Wi-Fi 2,4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi invités","wifi_iot":"Wi-Fi objets connectés"},"pt-BR":{"name":"Roteador de Internet","online":"Online","offline":"Offline","unavailable":"Indisponível","download":"Download","upload":"Upload","devices":"Dispositivos","wifi":"Wi-Fi","on":"Ligado","off":"Desligado","reboot":"Reiniciar","reboot_confirm":"Reiniciar o roteador? A conexão com a Internet será interrompida durante alguns minutos.","ping":"Ping","wan_ip":"IP WAN","uptime":"Tempo de atividade","cpu":"CPU","memory":"Memória","wifi_24":"Wi-Fi 2.4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi de convidados","wifi_iot":"Wi-Fi IoT"},"pt-PT":{"name":"Router de Internet","online":"Online","offline":"Offline","unavailable":"Indisponível","download":"Receção","upload":"Envio","devices":"Dispositivos","wifi":"Wi-Fi","on":"Ligado","off":"Desligado","reboot":"Reiniciar","reboot_confirm":"Reiniciar o router? A ligação à Internet será interrompida durante alguns minutos.","ping":"Ping","wan_ip":"IP WAN","uptime":"Tempo de atividade","cpu":"CPU","memory":"Memória","wifi_24":"Wi-Fi 2.4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi de convidados","wifi_iot":"Wi-Fi IoT"},"ru":{"name":"Роутер","online":"В сети","offline":"Не в сети","unavailable":"Недоступно","download":"Скачивание","upload":"Отдача","devices":"Устройства","wifi":"Wi-Fi","on":"Вкл","off":"Выкл","reboot":"Перезагрузить","reboot_confirm":"Перезагрузить роутер? Интернет-соединение прервётся на несколько минут.","ping":"Пинг","wan_ip":"WAN IP","uptime":"Время работы","cpu":"ЦП","memory":"Память","wifi_24":"Wi-Fi 2.4 ГГц","wifi_5":"Wi-Fi 5 ГГц","wifi_6":"Wi-Fi 6 ГГц","wifi_guest":"Гостевой Wi-Fi","wifi_iot":"IoT Wi-Fi"},"sr":{"name":"Интернет рутер","online":"На мрежи","offline":"Ван мреже","unavailable":"Недоступно","download":"Преузимање","upload":"Слање","devices":"Уређаји","wifi":"Wi-Fi","on":"Укључено","off":"Искључено","reboot":"Поново покрени","reboot_confirm":"Поново покренути рутер? Интернет веза ће бити прекинута на неколико минута.","ping":"Пинг","wan_ip":"WAN IP","uptime":"Време рада","cpu":"Процесор","memory":"Меморија","wifi_24":"Wi-Fi 2.4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi за госте","wifi_iot":"IoT Wi-Fi"},"sr-Latn":{"name":"Internet ruter","online":"Na mreži","offline":"Van mreže","unavailable":"Nedostupno","download":"Preuzimanje","upload":"Slanje","devices":"Uređaji","wifi":"Wi-Fi","on":"Uključeno","off":"Isključeno","reboot":"Ponovo pokreni","reboot_confirm":"Ponovo pokrenuti ruter? Internet veza će biti prekinuta na nekoliko minuta.","ping":"Ping","wan_ip":"WAN IP","uptime":"Vreme rada","cpu":"Procesor","memory":"Memorija","wifi_24":"Wi-Fi 2.4 GHz","wifi_5":"Wi-Fi 5 GHz","wifi_6":"Wi-Fi 6 GHz","wifi_guest":"Wi-Fi za goste","wifi_iot":"IoT Wi-Fi"},"uk":{"name":"Інтернет-роутер","online":"У мережі","offline":"Не в мережі","unavailable":"Недоступно","download":"Завантаження","upload":"Вивантаження","devices":"Пристрої","wifi":"Wi-Fi","on":"Увімк.","off":"Вимк.","reboot":"Перезапустити","reboot_confirm":"Перезапустити роутер? Інтернет-з'єднання зникне на кілька хвилин.","ping":"Пінг","wan_ip":"WAN IP","uptime":"Час роботи","cpu":"ЦП","memory":"Пам'ять","wifi_24":"Wi-Fi 2,4 ГГц","wifi_5":"Wi-Fi 5 ГГц","wifi_6":"Wi-Fi 6 ГГц","wifi_guest":"Гостьовий Wi-Fi","wifi_iot":"Wi-Fi для IoT"}};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* Routeur générique à antennes : bloc graphite, 4 antennes articulées, voyants à l'avant (repère 300 × 200). */
  const ROUTER_SVG = `
        <defs>
          <linearGradient id="ib-rtbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f58"/><stop offset=".45" stop-color="#2a2d33"/><stop offset="1" stop-color="#17191d"/></linearGradient>
          <linearGradient id="ib-rtant" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#15171a"/><stop offset=".35" stop-color="#4b505a"/><stop offset="1" stop-color="#1b1d21"/></linearGradient>
        </defs>
        ${[[62, -14], [112, -5], [188, 5], [238, 14]].map(([x, a]) => `<g transform="rotate(${a} ${x} 146)"><rect x="${x - 7}" y="14" width="14" height="136" rx="7" fill="url(#ib-rtant)"/><rect x="${x - 4.5}" y="18" width="3" height="120" rx="1.5" fill="#fff" opacity=".18"/><rect x="${x - 9}" y="138" width="18" height="12" rx="3" fill="#202226"/></g>`).join('')}
        <path d="M30 156 L48 128 H252 L270 156 V176 Q270 186 258 186 H42 Q30 186 30 176 Z" fill="url(#ib-rtbody)"/>
        <path d="M48 128 H252 L270 156 H30 Z" fill="#fff" opacity=".08"/>
        <path d="M30 156 H270" stroke="#000" stroke-opacity=".5" stroke-width="1.2"/>
        <g stroke="#0c0d0f" stroke-width="2" stroke-linecap="round" opacity=".7"><path d="M92 140 H208"/><path d="M92 146 H208"/></g>
        <g fill="#7b818c"><circle cx="76" cy="172" r="2.4"/><circle cx="92" cy="172" r="2.4"/><circle cx="108" cy="172" r="2.4"/></g>
        ${[[30.1, 18, 0], [100.5, 14.5, .45], [199.5, 14.5, .9], [269.9, 18, 1.35]].map(([x, y, d]) => `<circle class="anttip" cx="${x}" cy="${y}" r="3.4" style="animation-delay:${d}s"/>`).join('')}
        <text x="204" y="176" fill="#9aa0aa" font-family="system-ui,sans-serif" font-size="9" font-weight="600" letter-spacing="1.6">WI-FI</text>`;
  const ROUTER_LED = `<ellipse class="ledglow" cx="150" cy="172" rx="22" ry="8"/><circle class="led" cx="150" cy="172" r="3.6"/>`;
  // dessin générique ramené dans le repère d'une photo (pw × ph), pour « illustration: svg » sur les modèles en photo
  const ROUTER_FOR = (pw, ph) => { const s = Math.min(pw / 300, ph / 200); return `<g transform="translate(${((pw - 300 * s) / 2).toFixed(1)} ${((ph - 200 * s) / 2).toFixed(1)}) scale(${s.toFixed(4)})">${ROUTER_SVG}</g>`; };

  /* Chaque modèle : photo (px de la photo = repère du dessin), emplacement dans la carte (box = x, y, w, h sur 300 × 180),
     point d'émission des ondes Wi-Fi, LED, et dessin SVG vectoriel dans le même repère que la photo. */
  // afficheur à points de la Freebox Delta : l'heure réelle (fuseau de Home Assistant), police 3 × 5 points
  const DOTS = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001010010', 8: '111101111101111', 9: '111101111001111' };
  const clockDots = (txt, cx, cy, p) => {
    const cols = [], col = (bits) => cols.push(bits); // une colonne = 5 bits (haut → bas)
    [...txt].forEach((ch, i) => {
      if (ch === ':') { cols.push(0, 0); col(0b01010); cols.push(0, 0); return; }
      const g = DOTS[ch]; if (!g) return;
      for (let x = 0; x < 3; x++) { let b = 0; for (let y = 0; y < 5; y++) if (g[y * 3 + x] === '1') b |= 1 << (4 - y); col(b); }
      if (i < txt.length - 1 && txt[i + 1] !== ':' && ch !== ':') cols.push(0);
    });
    const x0 = cx - (cols.length - 1) * p / 2, y0 = cy - 2 * p;
    return cols.map((b, i) => [0, 1, 2, 3, 4].filter((y) => b & (1 << (4 - y))).map((y) => `<circle cx="${(x0 + i * p).toFixed(1)}" cy="${(y0 + y * p).toFixed(1)}" r="2.3"/>`).join('')).join('');
  };

  const MODELS = {
    freebox_pop: {
      label: 'Freebox Pop', pw: 601, ph: 335, box: [70, 56, 160, 89], wave: [150, 52],
      img: window.__acImg("internet-box",0),
      // voyant blanc sur le rebord avant
      led: `<ellipse class="ledglow" cx="300" cy="272" rx="14" ry="10"/><circle class="led" cx="300" cy="272" r="5"/>`,
      svg: `
        <path d="M8 138 V204 A292 124 0 0 0 592 204 V138 Z" fill="url(#ib-fbside)"/>
        <ellipse cx="300" cy="138" rx="292" ry="130" fill="url(#ib-fbtop)"/>
        <ellipse cx="300" cy="138" rx="292" ry="130" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
        <rect x="252" y="70" width="270" height="40" rx="20" fill="url(#ib-fbslot)"/>
        <text x="338" y="98" fill="#e8e8ea" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="30" letter-spacing="1">free</text>
        <circle cx="486" cy="90" r="22" fill="#15161a"/><circle cx="486" cy="90" r="22" fill="none" stroke="#5a5c63" stroke-width="2"/>
        <path d="M478 84 L492 90 L478 96 Z" fill="#8a8d96"/>`,
    },
    // freebox_ultra : Freebox Ultra (Free), photo détourée ; le voyant s'allume autour du bouton rond à droite de la fente
    freebox_ultra: {
      label: 'Freebox Ultra', pw: 300, ph: 140, box: [70, 70.3, 160, 74.7], wave: [150, 66.3],
      img: window.__acImg("internet-box",1),
      led: `<ellipse class="ledglow" cx="222.4" cy="34.0" rx="20.6" ry="8.7"/><circle class="led" cx="222.4" cy="34.0" r="4.4"/>`,
      svg: `
        <rect x="6" y="44" width="288" height="84" rx="41" fill="url(#ib-fbside)"/>
        <rect x="6" y="6" width="288" height="87" rx="44" fill="url(#ib-fbtop)"/>
        <rect x="6" y="6" width="288" height="87" rx="44" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
        <rect x="133" y="25" width="78" height="17" rx="9" fill="url(#ib-fbslot)"/>
        <text x="149" y="38" fill="#e8e8ea" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="14">free</text>
        <circle cx="222.4" cy="34.0" r="9.5" fill="#d5d8de" stroke="#8c8f96" stroke-width="1.5"/>`,
    },
    // freebox_delta : Freebox Delta (Free), photo détourée ; le voyant s'allume sur le symbole Wi-Fi du dôme
    freebox_delta: {
      label: 'Freebox Delta', pw: 600, ph: 341, box: [70, 54, 160, 91], wave: [150, 50],
      img: window.__acImg("internet-box",2),
      led: `<g class="dclock" data-cx="300" data-cy="282.8" data-p="7.4"></g><ellipse class="ledglow" cx="287.9" cy="191.0" rx="14" ry="10"/><circle class="led" cx="287.9" cy="191.0" r="4"/>`,
      svg: `
        <path d="M12 232 V262 Q12 322 80 326 H520 Q588 322 588 262 V232 Z" fill="url(#ib-fbside)"/>
        <path d="M300 14 Q420 14 520 120 Q592 188 588 238 Q580 252 520 252 H80 Q20 252 12 238 Q8 188 80 120 Q180 14 300 14 Z" fill="url(#ib-fbtop)"/>
        <path d="M300 14 Q420 14 520 120 Q592 188 588 238 Q580 252 520 252 H80 Q20 252 12 238 Q8 188 80 120 Q180 14 300 14 Z" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
        <text x="300" y="318" text-anchor="middle" fill="#5a5c63" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="15">free</text>`,
    },
    // livebox : Orange Livebox fibre (6 / 7), photo détourée ; le voyant s'allume sur le liseré orange de la tranche gauche
    livebox: {
      label: 'Orange Livebox (fibre)', pw: 214, ph: 330, box: [96, 12, 107, 165], wave: [150, 10],
      img: window.__acImg("internet-box",3),
      led: `<ellipse class="ledglow" cx="45" cy="56" rx="12" ry="26"/><path class="led" d="M36 76 L40 76 Q41 54 57 41 L54 36 Q36 48 36 76Z"/>`,
      svg: `
        <rect x="8" y="34" width="70" height="288" rx="16" fill="#15171b"/>
        <rect x="14" y="8" width="196" height="304" rx="34" fill="#2a2c31"/>
        <rect x="14" y="8" width="196" height="304" rx="34" fill="none" stroke="#4a4d54" stroke-width="2"/>
        <path d="M16 46 Q22 14 60 10 H176" fill="none" stroke="#0c0d10" stroke-opacity=".6" stroke-width="6"/>
        <path d="M36 76 L40 76 Q41 54 57 41 L54 36 Q36 48 36 76Z" fill="#ff7900"/>
        <g fill="#2f3238" stroke="#5a5e66" stroke-width="1.2"><circle cx="38" cy="168" r="8"/><circle cx="38" cy="192" r="8"/><circle cx="38" cy="216" r="8"/></g>
        <text x="22" y="250" fill="#9a9ea6" font-family="system-ui,sans-serif" font-size="9">Livebox</text>
        <rect x="150" y="176" width="28" height="28" fill="#8c8e93"/><rect x="150" y="198" width="28" height="6" fill="#d9dadd"/>`,
    },
    router: {
      label: 'Router with antennas (generic)', pw: 300, ph: 200, box: [75, 36, 150, 100], wave: [150, 34], img: null,
      waves: [[90, 43], [125, 40], [175, 40], [210, 43]],
      led: ROUTER_LED, svg: ROUTER_SVG,
    },
    asus_gt_be98: {
      label: 'ASUS ROG Rapture GT-BE98', pw: 640, ph: 450, box: [72, 36, 156, 110], wave: [150, 32],
      waves: [[90, 50], [112, 36], [189, 36], [211, 50]],
      img: window.__acImg("internet-box",4),
      // rangée de voyants blancs sur l'avant, et voyant de la prise d'alimentation
      led: `<ellipse class="rogglow" cx="392" cy="305" rx="78" ry="42"/><ellipse class="ledglow" cx="324" cy="402" rx="50" ry="13"/><circle class="led" cx="361" cy="378" r="3.4"/>`,
      svg: ROUTER_FOR(640, 450),
    },
    asus_rt_ac88u: {
      label: 'ASUS RT-AC88U', pw: 560, ph: 449, box: [80, 36, 140, 112], wave: [150, 32],
      waves: [[107, 43], [147, 39], [183, 39], [213, 36]],
      img: window.__acImg("internet-box",5),
      led: `<ellipse class="ledglow" cx="150" cy="330" rx="46" ry="11"/><circle class="led" cx="210" cy="342" r="3.4"/>`,
      svg: ROUTER_FOR(560, 449),
    },
    asus_rt_be92u: {
      label: 'ASUS RT-BE92U', pw: 420, ph: 489, box: [99, 32, 101, 118], wave: [150, 30],
      waves: [[107, 35], [135, 32], [163, 32], [191, 35]],
      img: window.__acImg("internet-box",6),
      // voyant d'état sur le panneau de gauche, et lueur de la bande rouge centrale
      led: `<rect class="rogglow" x="200" y="240" width="18" height="205" rx="9"/><ellipse class="ledglow" cx="35" cy="314" rx="12" ry="9"/><circle class="led" cx="35" cy="314" r="2.4"/>`,
      svg: ROUTER_FOR(420, 489),
    },
    asus_rt_ac68u: {
      label: 'ASUS RT-AC68U', pw: 600, ph: 830, box: [105, 30, 90, 125], wave: [300, 31],
      waves: [[60, 76], [300, 31], [575, 8]],
      img: window.__acImg("internet-box",7),
      // voyants LAN/USB/wifi/alimentation sur la facade avant
      led: `<ellipse class="ledglow" cx="366" cy="729" rx="40" ry="10"/><circle class="led" cx="396" cy="729" r="3"/>`,
      svg: ROUTER_FOR(600, 830),
    },
    xiaomi_ax3000: {
      label: 'Xiaomi Mesh System AX3000 NE', pw: 300, ph: 588, box: [118, 30, 64, 125], wave: [150, 26],
      img: window.__acImg("internet-box",8),
      // barre lumineuse verticale sur la façade
      led: `<rect class="ledglow" x="140" y="56" width="22" height="150" rx="11"/><rect class="led" x="147" y="66" width="8" height="128" rx="4"/>`,
      svg: ROUTER_FOR(300, 588),
    },
    // TP-Link Deco M4 : dessin vectoriel (la photo disponible est trop petite et blanche sur blanc pour un détourage net)
    tplink_deco_m4: {
      label: 'TP-Link Deco M4 (mesh)', pw: 240, ph: 504, box: [114, 15, 72, 151], wave: [120, 30],
      // fin anneau lumineux entre la grille noire et le corps (halo doux autour, grille non teintée)
      led: `<path class="ledglow" fill-rule="evenodd" d="M6 56a114 33 0 1 0 228 0a114 33 0 1 0 -228 0ZM20 56a100 26 0 1 1 200 0a100 26 0 1 1 -200 0Z"/><path class="led" fill-rule="evenodd" d="M16 56a104 28 0 1 0 208 0a104 28 0 1 0 -208 0ZM19 56a101 25.6 0 1 1 202 0a101 25.6 0 1 1 -202 0Z"/>`,
      svg: `<defs>
          <linearGradient id="ib-dcbody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9ced4"/><stop offset=".12" stop-color="#eef0f3"/><stop offset=".38" stop-color="#ffffff"/><stop offset=".62" stop-color="#f6f7f9"/><stop offset=".88" stop-color="#dfe2e6"/><stop offset="1" stop-color="#b9bfc6"/></linearGradient>
          <linearGradient id="ib-dcrim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e6e9ed"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#d3d7dc"/></linearGradient>
          <radialGradient id="ib-dcgrille" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#2b2d31"/><stop offset="1" stop-color="#0f1012"/></radialGradient>
        </defs>
        <ellipse cx="124" cy="478" rx="112" ry="22" fill="#000" opacity=".18"/>
        <path d="M10 56 V450 A110 30 0 0 0 230 450 V56 Z" fill="url(#ib-dcbody)"/>
        <path d="M10 56 V450 A110 30 0 0 0 230 450 V56" fill="none" stroke="#aeb4bb" stroke-width="1" opacity=".7"/>
        <ellipse cx="120" cy="56" rx="110" ry="30" fill="url(#ib-dcrim)"/>
        <ellipse cx="120" cy="54" rx="102" ry="26" fill="url(#ib-dcgrille)"/>
        <g fill="none" stroke="#4a4d53" stroke-width="2.6">${[92, 80, 68, 56, 44, 32, 20].map((r) => `<ellipse cx="120" cy="54" rx="${r}" ry="${(r * .255).toFixed(1)}"/>`).join('')}</g>
        <path d="M168 31 L236 44 L170 46 Z" fill="#050506" opacity=".85"/>
        <ellipse cx="120" cy="54" rx="102" ry="26" fill="none" stroke="#d8dce1" stroke-width="1.4"/>
        <path d="M22 70 V430" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55"/>
        <g fill="#6f757d" font-family="system-ui,-apple-system,sans-serif" font-weight="600"><text x="120" y="338" font-size="19" text-anchor="middle" letter-spacing=".5">tp-link</text></g>`,
    },
    sfr_box: {
      label: 'SFR Box', pw: 139, ph: 205, box: [100, 28, 99, 146], wave: [150, 24],
      img: window.__acImg("internet-box",9),
      // fente lumineuse au-dessus de l'écran tactile
      led: `<rect class="ledglow" x="25" y="52" width="16" height="9" rx="4.5"/><rect class="led" x="28" y="55" width="10" height="2.6" rx="1.3"/>
            <rect class="wifitile" x="34" y="107" width="12" height="12" rx="2.5"/>`,
      svg: `
        <path d="M10 22 Q12 8 40 7 L64 7 V197 L40 197 Q14 196 12 184 Z" fill="url(#ib-sfwhite)"/>
        <path d="M64 7 Q124 9 129 42 L131 168 Q127 197 64 197 Z" fill="#26262a"/>
        <path d="M64 7 Q124 9 129 42 L131 168 Q127 197 64 197 Z" fill="url(#ib-sffabric)"/>
        <path d="M64 7 V197" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>
        <rect x="14" y="70" width="38" height="95" rx="3.5" fill="#0b0c0e" stroke="#2a2b2f" stroke-width="1"/>
        <rect x="19" y="82" width="11" height="3" rx="1.5" fill="#8d9097"/><circle cx="46" cy="83.5" r="2.4" fill="none" stroke="#8d9097" stroke-width=".9"/>
        <g fill="#d8dadf"><rect x="19" y="107" width="12" height="12" rx="2.5"/><rect x="34" y="107" width="12" height="12" rx="2.5"/><rect x="19" y="122" width="12" height="12" rx="2.5"/><rect x="34" y="122" width="12" height="12" rx="2.5"/></g>
        <g fill="none" stroke="#2b2d33" stroke-width="1.1" stroke-linecap="round"><path d="M36.5 114.5 q3.5 -3.5 7 0 M38.4 116.4 q1.6 -1.6 3.2 0"/><path d="M23 128 l5 -4 M22 132 q3 -1 6 -6"/><path d="M40 130 q3 0 3 -4 l-1 -1 l-3 3 z"/><rect x="21.5" y="109.5" width="7" height="7" rx="1"/></g>
        <circle cx="40" cy="117.4" r=".9" fill="#2b2d33"/>
        <rect x="27" y="52" width="12" height="3.4" rx="1.7" fill="#d2d4d9" stroke="#b9bbc1" stroke-width=".5"/>`,
    },
  };
  // interrupteurs Wi-Fi par bande : [clé = suffixe de l'option entity_…, icône, texte court du bouton, libellé]
  const BANDS = [['wifi_24', 'mdi:wifi', '2.4', 'wifi_24'], ['wifi_5', 'mdi:wifi', '5', 'wifi_5'], ['wifi_6', 'mdi:wifi', '6', 'wifi_6'], ['wifi_guest', 'mdi:account-multiple', '', 'wifi_guest'], ['wifi_iot', 'mdi:chip', '', 'wifi_iot']];
  // durée de fonctionnement : capteur en secondes / minutes / heures / jours, ou horodatage du dernier démarrage
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
  const ALIAS = { generic: 'router', antennas: 'router', routeur: 'router', rog: 'asus_gt_be98', gtbe98: 'asus_gt_be98', rapture: 'asus_gt_be98', ac88u: 'asus_rt_ac88u', rtac88u: 'asus_rt_ac88u', be92u: 'asus_rt_be92u', rtbe92u: 'asus_rt_be92u', xiaomi: 'xiaomi_ax3000', deco: 'tplink_deco_m4', decom4: 'tplink_deco_m4', tplink: 'tplink_deco_m4', tplinkdeco: 'tplink_deco_m4', m4: 'tplink_deco_m4', ax3000: 'xiaomi_ax3000', freebox: 'freebox_pop', pop: 'freebox_pop', delta: 'freebox_delta', freeboxdelta: 'freebox_delta', ultra: 'freebox_ultra', freeboxultra: 'freebox_ultra', free: 'freebox_pop', sfr: 'sfr_box', sfrbox: 'sfr_box', box8: 'sfr_box', sfrbox8: 'sfr_box', orange: 'livebox', livebox6: 'livebox', livebox7: 'livebox', livebox5: 'livebox', liveboxfibre: 'livebox' };
  const modelKey = (m) => { const k = String(m || '').toLowerCase(); if (MODELS[k]) return k; const n = k.replace(/[^a-z0-9]/g, ''); return ALIAS[n] || 'freebox_pop'; };

  const ON_RE = /^(on|online|connected|connect[ée]|home|up|true|ok|available|running|active|1)$/i;
  const OFF_RE = /^(off|offline|disconnected|d[ée]connect[ée]|not_home|down|false|problem|inactive|0)$/i;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;
  --ib-ok:var(--appliance-ok-color,#43a047);--ib-alert:var(--appliance-alert-color,#db4437);--dn:#2f9bff;--up:#ff9f1a;--wifi:#4db2ff;--act:0;--spd:2s}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.online .badge{background:color-mix(in srgb,var(--ib-ok) 22%,transparent);color:var(--ib-ok)}
.offline .badge{background:color-mix(in srgb,var(--ib-alert) 22%,transparent);color:var(--ib-alert)}
svg{display:block;width:100%;max-width:calc(300px * var(--illus-scale,1));height:var(--appliance-illustration-height,auto);margin:2px auto 0;overflow:visible;cursor:pointer}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}
.tile[data-k=download] .l ha-icon{color:var(--dn)}.tile[data-k=upload] .l ha-icon{color:var(--up)}
.ctrls{display:flex;justify-content:center;gap:6px;margin-top:6px;flex-wrap:wrap}
.ctrls.hide{display:none}
.ctrls button{width:34px;height:34px;border-radius:50%;border:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--primary-text-color);
  background:var(--secondary-background-color,rgba(127,127,127,.18));transition:transform .15s,background .3s,box-shadow .3s;--mdc-icon-size:19px;padding:0}
.ctrls button:hover{transform:scale(1.08)}.ctrls button:active{transform:scale(.92)}
.ctrls button.on{background:var(--wifi);color:#fff;box-shadow:0 0 12px color-mix(in srgb,var(--wifi) 60%,transparent)}
.ctrls button.band{width:auto;min-width:34px;padding:0 10px 0 7px;border-radius:17px;gap:3px;font:600 11px/1 var(--paper-font-body1_-_font-family,inherit)}
.ctrls button.band ha-icon{--mdc-icon-size:16px}
.tile[data-k="wan_ip"]{grid-column:span 2}
.compact .tile[data-k="wan_ip"]{grid-column:auto}.compact .tile[data-k="wan_ip"] .v{font-size:10.5px}
.ctrls button:disabled{opacity:.35;cursor:default;transform:none}

/* ---- box ---- */
.shadow{opacity:.55}
.photo{transition:filter .6s}
.offline .photo,.unavailable .photo{filter:saturate(.6) brightness(.85)}
.unavailable .box{opacity:.6}
.dclock circle{fill:#fff;filter:drop-shadow(0 0 1.2px rgba(60,66,76,.55))}
.ledglow{fill:var(--ledc,#fff);opacity:0;filter:blur(3px);transition:opacity .6s}
.led{fill:var(--ledc,#fff);opacity:0;filter:drop-shadow(0 0 3px var(--ledc,#fff));transition:opacity .6s,fill .4s}
.online .led{--ledc:#f4fbff;opacity:1}.online .ledglow{--ledc:#7fd0ff;opacity:.85;animation:ibled 3.2s ease-in-out infinite}
.offline .led,.offline .ledglow{--ledc:#ff3b30;opacity:1;animation:ibblink 1.2s steps(2) infinite}
.offline .ledglow{opacity:.8}
@keyframes ibled{50%{opacity:.35}}
@keyframes ibblink{50%{opacity:.1}}
.wifitile{fill:var(--wifi);opacity:0;filter:drop-shadow(0 0 3px var(--wifi))}
.online.wifion .wifitile{animation:ibtile 2.4s ease-in-out infinite}
@keyframes ibtile{0%,100%{opacity:.1}50%{opacity:.55}}
.waves path{fill:none;stroke:var(--wifi);stroke-width:1.8;stroke-linecap:round;opacity:0}
.online.wifion .waves path{animation:ibwave 2.2s ease-out infinite}
.waves path{animation-delay:var(--wd,0s)!important}.waves path:nth-child(2){animation-delay:calc(var(--wd,0s) + .35s)!important}.waves path:nth-child(3){animation-delay:calc(var(--wd,0s) + .7s)!important}
.anttip{fill:var(--wifi);opacity:0;filter:drop-shadow(0 0 3px var(--wifi))}
.online.wifion .anttip{animation:ibtip 1.8s ease-in-out infinite}
@keyframes ibtip{0%,100%{opacity:.15}50%{opacity:1}}
.rogglow{fill:#ff2a2a;opacity:0;filter:blur(7px)}
.online .rogglow{animation:ibrog 2.6s ease-in-out infinite}
@keyframes ibrog{0%,100%{opacity:.05}50%{opacity:.45}}
@keyframes ibwave{0%{opacity:0;transform:translateY(6px)}25%{opacity:.9}100%{opacity:0;transform:translateY(-8px)}}

/* ---- ligne Internet : nuage, paquets, appareils ---- */
.line{fill:none;stroke-width:1.6;stroke-linecap:round;opacity:.22;transition:opacity .6s}
.line.dn{stroke:var(--dn)}.line.up{stroke:var(--up)}
.pk{fill:none;stroke-width:3;stroke-linecap:round;stroke-dasharray:0.1 11;opacity:0;transition:opacity .6s}
.pk.dn{stroke:var(--dn);filter:drop-shadow(0 0 2px var(--dn))}.pk.up{stroke:var(--up);filter:drop-shadow(0 0 2px var(--up))}
.online .pk{opacity:calc(.35 + var(--act) * .65);animation:ibpk var(--spd) linear infinite}
@keyframes ibpk{to{stroke-dashoffset:-22}}
.cloud{fill:var(--secondary-text-color);opacity:.55;transition:fill .5s,opacity .5s}
.online .cloud{fill:var(--dn);opacity:.85}
.offline .cloud{fill:var(--ib-alert);opacity:.9}
.cut{stroke:var(--ib-alert);stroke-width:2.4;stroke-linecap:round;opacity:0}
.offline .cut{opacity:1}
.dev{fill:var(--secondary-text-color);opacity:.55;transition:fill .5s,opacity .5s}
.online .dev{fill:var(--wifi);opacity:.85}
.dev.d2{animation:none}.online .dev.d2{animation:ibdev 3s ease-in-out infinite}
.online .dev.d3{animation:ibdev 3s ease-in-out infinite;animation-delay:-1.5s}
@keyframes ibdev{50%{opacity:.4}}
.noanim *{animation:none!important;transition:none!important}

/* ---- compact : petits emplacements fixes ; l'illustration prend la hauteur restante (même règles que les autres cartes) ---- */
ha-card.compact{display:flex;flex-direction:column;padding:6px}
.compact .head{flex:none;gap:4px}
.compact .title{font-size:12px;line-height:16px}
.compact .badge{font-size:10px;padding:0 6px}
.compact .tiles{flex:none;gap:4px;margin-top:4px;grid-template-columns:repeat(auto-fit,minmax(56px,1fr))}
.compact .tile{padding:2px 5px;border-radius:8px}
.compact .tile .l ha-icon{--mdc-icon-size:12px}
.compact .tile .v{font-size:12px;line-height:15px;margin-top:0}
.compact > svg{flex:1 1 0;min-height:40px;width:calc(100% * min(1, var(--illus-scale,1)));max-width:none;height:auto;margin-top:3px}
.compact .ctrls{flex:none;gap:2px;margin-top:4px;flex-wrap:nowrap}
.compact .ctrls button{width:21px;height:21px;--mdc-icon-size:13px}
.compact .ctrls button.band{width:auto;min-width:21px;padding:0 6px 0 4px;font-size:9px}
`;

  const SVG = (label, m, drawing) => {
    const [bx, by, bw, bh] = m.box, k = bw / m.pw;
    const pts = m.waves || [m.wave]; // points d'émission des ondes : une par antenne si le modèle en a
    const mid = by + bh * 0.62; // hauteur de la ligne Internet
    return `
<svg viewBox="0 0 300 180" role="img" aria-label="${esc(label)}">
 <defs>
  <radialGradient id="ib-shadow"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="ib-fbtop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eceef1"/><stop offset="1" stop-color="#d3d6db"/></linearGradient>
  <linearGradient id="ib-fbside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd2d7"/><stop offset=".25" stop-color="#f7f8fa"/><stop offset=".6" stop-color="#e3e5e9"/><stop offset="1" stop-color="#b9bdc4"/></linearGradient>
  <linearGradient id="ib-fbslot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7178"/><stop offset=".5" stop-color="#3a3b40"/><stop offset="1" stop-color="#26272b"/></linearGradient>
  <linearGradient id="ib-sfwhite" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9eaec"/><stop offset=".6" stop-color="#fafafa"/><stop offset="1" stop-color="#dcdde0"/></linearGradient>
  <linearGradient id="ib-sffabric" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
 </defs>
 <!-- ligne Internet : nuage à gauche, appareils à droite -->
 <g class="net">
  <path class="line dn" d="M40 ${mid} H${bx - 4}"/><path class="line up" d="M${bx + bw + 4} ${mid} H260"/>
  <path class="pk dn" d="M40 ${mid} H${bx - 4}"/><path class="pk up" d="M260 ${mid} H${bx + bw + 4}"/>
  <g transform="translate(8 ${mid - 17})"><path class="cloud" d="M9 28 a7 7 0 0 1 1 -14 a10 10 0 0 1 19 -2 a8 8 0 0 1 4 16 z"/><path class="cut" d="M5 31 L35 7"/></g>
  <g transform="translate(264 ${mid - 17})">
   <rect class="dev" x="4" y="2" width="9" height="15" rx="2"/>
   <rect class="dev d2" x="16" y="8" width="18" height="12" rx="1.5"/><rect class="dev d2" x="13" y="21" width="24" height="2.2" rx="1"/>
   <circle class="dev d3" cx="9" cy="28" r="3"/>
  </g>
 </g>
 <g class="box">
  <ellipse class="shadow" cx="${bx + bw / 2}" cy="${by + bh - 1}" rx="${bw * 0.5}" ry="5" fill="url(#ib-shadow)"/>
  ${pts.map(([px, py], i) => `<g class="waves" transform="translate(${px} ${py}) scale(${pts.length > 1 ? 0.5 : 1})" style="--wd:${(i * 0.45).toFixed(2)}s"><path d="M-7 0 q7 -6 14 0"/><path d="M-12 -5 q12 -11 24 0"/><path d="M-17 -10 q17 -16 34 0"/></g>`).join('')}
  <g transform="translate(${bx} ${by}) scale(${k.toFixed(5)})">
   ${drawing ? `<g class="photo">${m.svg}</g>` : `<image class="photo" href="${m.img}" x="0" y="0" width="${m.pw}" height="${m.ph}"/>`}
   ${m.led}
  </g>
 </g>
</svg>`;
  };

  // état → débit en Mb/s (pour régler la vitesse des paquets)
  const toMbps = (v, unit) => {
    const u = String(unit || '');
    let f = 1;
    if (/^g/i.test(u)) f = 1000; else if (/^k/i.test(u)) f = 0.001; else if (/^m/i.test(u)) f = 1; else if (/^t/i.test(u)) f = 1e6; else if (/^[bo]\/s|^bit/i.test(u)) f = 1e-6;
    if (/B\/s|o\/s/.test(u)) f *= 8; // octets → bits
    return v * f;
  };

  class ApplianceInternetBoxCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const pick = (re, dom) => ids.find((i) => (!dom || i.startsWith(dom + '.')) && re.test(i)) || '';
      const entity = pick(/freebox|sfr|livebox|bbox|box|wan|internet|connectivity/i, 'binary_sensor');
      const down = pick(/(download|down|rx).*(speed|rate)|(speed|rate).*(download|down)|download/i, 'sensor');
      const up = pick(/(upload|up|tx).*(speed|rate)|(speed|rate).*(upload|up)|upload/i, 'sensor');
      return { model: /sfr/i.test(entity) ? 'sfr_box' : /livebox|orange/i.test(entity) ? 'livebox' : /ultra/i.test(entity) ? 'freebox_ultra' : /delta/i.test(entity) ? 'freebox_delta' : 'freebox_pop', ...(entity ? { entity } : {}), ...(down ? { entity_download: down } : {}), ...(up ? { entity_upload: up } : {}) };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_controls: true, show_download: true, show_upload: true, show_devices: true, show_wifi: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._clockTick = setInterval(() => this._clock(), 15000); this._clock(); }
    disconnectedCallback() { clearInterval(this._clockTick); }
    // heure de l'afficheur à points (modèles qui en ont un) : HH:MM, fuseau de Home Assistant
    _clock() {
      const g = this._root && this._root.querySelector('.dclock'); if (!g) return;
      let t;
      try { t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: (this._hass && this._hass.config && this._hass.config.time_zone) || undefined }).format(new Date()); }
      catch (e) { const d = new Date(); t = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
      if (g.dataset.t === t) return;
      g.dataset.t = t; g.innerHTML = clockDots(t, Number(g.dataset.cx), Number(g.dataset.cy), Number(g.dataset.p));
    }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass && this._hass.states[id]; }
    _num(id) { const s = this._st(id); if (!s) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(window.applianceLocale(this._c, this._hass), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (window.applianceMore) window.applianceMore(this, id); }
    _unit(id) { return (this._st(id)?.attributes || {}).unit_of_measurement || ''; }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const m = MODELS[modelKey(this._c.model)];
      const drawing = !m.img || /^(svg|drawing|dessin)$/i.test(String(this._c.illustration || ''));
      this._model = m; this._drawing = drawing;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="ibtitle"></div><div class="badge" id="ibbadge"></div></div>
        ${SVG(this._c.name || m.label, m, drawing)}
        <div class="ctrls" id="ibctrls"></div>
        <div class="tiles">
          <div class="tile hide" data-k="download"><div class="l"><ha-icon icon="mdi:download"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="upload"><div class="l"><ha-icon icon="mdi:upload"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="devices"><div class="l"><ha-icon icon="mdi:devices"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="wifi"><div class="l"><ha-icon icon="mdi:wifi"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="ping"><div class="l"><ha-icon icon="mdi:timer-sand"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="wan_ip"><div class="l"><ha-icon icon="mdi:ip-network"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="uptime"><div class="l"><ha-icon icon="mdi:clock-outline"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="cpu"><div class="l"><ha-icon icon="mdi:cpu-64-bit"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
          <div class="tile hide" data-k="memory"><div class="l"><ha-icon icon="mdi:memory"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>
        </div>
      </ha-card>`;
      this._card = root.querySelector('ha-card');
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity || this._c.entity_download));
      const tgt = { download: 'entity_download', upload: 'entity_upload', devices: 'entity_devices', wifi: 'entity_wifi', ping: 'entity_ping', wan_ip: 'entity_wan_ip', uptime: 'entity_uptime', cpu: 'entity_cpu', memory: 'entity_memory' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => this._more(this._c[tgt[el.dataset.k]])));
      root.getElementById('ibctrls').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { e.stopPropagation(); this._cmd(b.dataset.k); } });
      this._root = root; this._built = true;
    }

    _state() {
      const c = this._c, s = this._st(c.entity);
      if (c.entity) {
        if (!s) return 'unavailable';
        const raw = String(s.state).trim();
        if (/^(unavailable|unknown)$/i.test(raw)) return 'unavailable';
        if (OFF_RE.test(raw)) return 'offline';
        return 'online'; // on, connected, home… ou n'importe quel texte (type de connexion « FTTH », IP…)
      }
      // sans entité d'état : en ligne dès qu'un débit est lisible
      const d = this._st(c.entity_download) || this._st(c.entity_upload);
      return d && !/^(unavailable|unknown)$/i.test(String(d.state)) ? 'online' : 'unavailable';
    }

    _cmd(k) {
      const c = this._c, hass = this._hass; if (!hass) return;
      // Wi-Fi (ou une bande) : couper demande confirmation (désactivable avec confirm_actions: false), rallumer se fait d'un appui
      const wid = k === 'wifi' ? c.entity_wifi : BANDS.some((b) => b[0] === k) ? c['entity_' + k] : '';
      if (wid) {
        const run = () => this._hass && this._hass.callService('homeassistant', 'toggle', { entity_id: wid });
        const st = hass.states[wid], on = !!st && String(st.state).toLowerCase() === 'on';
        if (!on || c.confirm_actions === false || !window.applianceConfirm) run();
        else window.applianceConfirm(this, { action: 'toggle', confirmation: true }, run);
      } else if (k === 'reboot' && c.entity_reboot) {
        if (!window.confirm || window.confirm(this._t('reboot_confirm'))) hass.callService(c.entity_reboot.split('.')[0], c.entity_reboot.startsWith('button.') ? 'press' : 'turn_on', { entity_id: c.entity_reboot });
      }
    }

    _render() {
      if (!this._built || this._model !== MODELS[modelKey(this._c.model)] || this._drawing !== (!MODELS[modelKey(this._c.model)].img || /^(svg|drawing|dessin)$/i.test(String(this._c.illustration || '')))) this._build();
      const c = this._c, r = this._root, card = this._card, m = this._model;
      const st = this._state();
      this._clock();
      const wifiS = this._st(c.entity_wifi), wifiOn = !wifiS || String(wifiS.state).toLowerCase() === 'on';
      card.className = `${st}${wifiOn ? ' wifion' : ''}${c.animations === false ? ' noanim' : ''}${c.compact === true ? ' compact' : ''}`;

      // activité : débit cumulé / débit de référence (max_speed, 1000 Mb/s par défaut) → vitesse et visibilité des paquets
      const dn = this._num(c.entity_download), up = this._num(c.entity_upload);
      const mbDn = isNaN(dn) ? 0 : toMbps(dn, this._unit(c.entity_download)), mbUp = isNaN(up) ? 0 : toMbps(up, this._unit(c.entity_upload));
      const ref = Number(c.max_speed) > 0 ? Number(c.max_speed) : 1000;
      const act = Math.max(0, Math.min(1, Math.sqrt((mbDn + mbUp) / ref)));
      card.style.setProperty('--act', act.toFixed(3));
      card.style.setProperty('--spd', (2.6 - act * 2.1).toFixed(2) + 's');
      const only = (cls, mb) => r.querySelectorAll(cls).forEach((el) => { el.style.animationDuration = (2.6 - Math.max(0, Math.min(1, Math.sqrt(mb / ref))) * 2.1).toFixed(2) + 's'; });
      only('.pk.dn', mbDn); only('.pk.up', mbUp);

      r.getElementById('ibtitle').textContent = c.name || m.label;
      const badge = r.getElementById('ibbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';

      // boutons : Wi-Fi (interrupteur) et redémarrage
      const ctr = r.getElementById('ibctrls');
      const btns = [
        ['wifi', wifiOn ? 'mdi:wifi' : 'mdi:wifi-off', 'wifi', wifiOn, !!wifiS],
        ...BANDS.map(([k, icon, txt]) => { const s = this._st(c['entity_' + k]), on = !!s && String(s.state).toLowerCase() === 'on'; return [k, on || !s || txt ? icon : icon, k, on, !!s, txt]; }),
        ['reboot', 'mdi:restart', 'reboot', null, !!this._st(c.entity_reboot)],
      ].filter((b) => b[4] && c.show_controls !== false);
      ctr.classList.toggle('hide', !btns.length);
      const sig = btns.map((b) => b.join('|')).join(';') + st;
      if (ctr._sig !== sig) {
        ctr._sig = sig;
        ctr.innerHTML = btns.map(([k, icon, lbl, on, , txt]) => `<button class="${on ? 'on' : ''}${txt ? ' band' : ''}" data-k="${k}" title="${esc(this._l(lbl))}" aria-label="${esc(this._l(lbl))}"${st === 'unavailable' ? ' disabled' : ''}><ha-icon icon="${icon}"></ha-icon>${txt ? `<span>${txt}</span>` : ''}</button>`).join('');
      }

      const dv = this._num(c.entity_devices), pg = this._num(c.entity_ping), cp = this._num(c.entity_cpu), mm = this._num(c.entity_memory);
      const V = {
        download: [!!this._st(c.entity_download) && c.show_download !== false, this._fmt(dn, dn < 10 ? 1 : 0), this._unit(c.entity_download) || 'Mb/s'],
        upload: [!!this._st(c.entity_upload) && c.show_upload !== false, this._fmt(up, up < 10 ? 1 : 0), this._unit(c.entity_upload) || 'Mb/s'],
        devices: [!!this._st(c.entity_devices) && c.show_devices !== false, this._fmt(dv, 0), ''],
        wifi: [!!wifiS && c.show_wifi !== false, this._t(wifiOn ? 'on' : 'off'), ''],
        ping: [!!this._st(c.entity_ping) && c.show_ping !== false, this._fmt(pg, pg < 10 ? 1 : 0), this._unit(c.entity_ping) || 'ms'],
        wan_ip: [!!this._st(c.entity_wan_ip) && c.show_wan_ip !== false, /^(unavailable|unknown)$/i.test(String(this._st(c.entity_wan_ip)?.state)) ? '--' : String(this._st(c.entity_wan_ip)?.state ?? '--'), ''],
        uptime: [!!this._st(c.entity_uptime) && c.show_uptime !== false, fmtUptime(uptimeSeconds(this._st(c.entity_uptime)), window.applianceLocale(this._c, this._hass)), ''],
        cpu: [!!this._st(c.entity_cpu) && c.show_cpu !== false, this._fmt(cp, 0), this._unit(c.entity_cpu) || '%'],
        memory: [!!this._st(c.entity_memory) && c.show_memory !== false, this._fmt(mm, 0), this._unit(c.entity_memory) || '%'],
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
  (window.__acDefine||customElements.define.bind(customElements))(TAG, ApplianceInternetBoxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceInternetBoxCardEditor extends HTMLElement {
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
        { name: 'illustration', selector: { select: { mode: 'dropdown', options: [{ value: 'photo', label: 'Photo' }, { value: 'svg', label: 'SVG' }] } } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity'), ent('entity_download', 'sensor'), ent('entity_upload', 'sensor'), ent('entity_devices', 'sensor'), ent('entity_wifi', 'switch'), ent('entity_reboot'),
        ent('entity_ping', 'sensor'), ent('entity_wan_ip', 'sensor'), ent('entity_uptime', 'sensor'), ent('entity_cpu', 'sensor'), ent('entity_memory', 'sensor'),
        ent('entity_wifi_24', 'switch'), ent('entity_wifi_5', 'switch'), ent('entity_wifi_6', 'switch'), ent('entity_wifi_guest', 'switch'), ent('entity_wifi_iot', 'switch'),
        { name: 'max_speed', default: 1000, selector: { number: { min: 10, max: 10000, step: 10, mode: 'box', unit_of_measurement: 'Mb/s' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('compact', false), bool('show_controls'), bool('show_download'), bool('show_upload'), bool('show_devices'), bool('show_wifi'), bool('show_ping'), bool('show_wan_ip'), bool('show_uptime'), bool('show_cpu'), bool('show_memory'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name === 'model' ? 'internet_box_model' : s.name, this._hass);
    }
  }
  (window.__acDefine||customElements.define.bind(customElements))(TAG + '-editor', ApplianceInternetBoxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Box internet en photo ou en dessin SVG (Freebox Pop, SFR Box) : ondes Wi-Fi, paquets à la vitesse du débit, LED de la box, appareils connectés, Wi-Fi et redémarrage.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
