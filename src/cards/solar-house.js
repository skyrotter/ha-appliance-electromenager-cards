/* Carte « Maison solaire » — custom:appliance-solar-house-card
 * Schéma animé d'une installation photovoltaïque : panneaux sur la toiture, tableau électrique (onduleur) dans la maison, batterie de
 * stockage, réseau électrique (poteaux), et en option borne de recharge et chauffe-eau (routeur solaire).
 * Des points lumineux circulent le long des câbles dans le sens réel de l'énergie, plus vite quand la puissance est forte :
 *   panneaux → maison, maison → batterie (charge) ou batterie → maison (décharge), maison → réseau (injection) ou réseau → maison
 *   (soutirage), maison → borne, maison → chauffe-eau. Chaque élément affiche sa puissance en temps réel (légendes dynamiques).
 * Entités (toutes facultatives sauf la production) : production solaire (W ou kW), consommation de la maison (sinon calculée),
 * puissance de la batterie (+ = charge) et niveau (%), réseau (+ = soutirage, − = injection, ou deux capteurs séparés), borne, ballon.
 * Mise à jour automatique à chaque changement d'état des entités (pas d'interrogation périodique).
 */
(() => {
  const TAG = 'appliance-solar-house-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n solar_house*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // couleurs des flux selon leur source : soleil (jaune), batterie (vert), réseau (violet)
  const COL = { solar: '#ffb300', battery: '#2fbf71', grid: '#8c6cf0', idle: '#c3cad3' };
  const THR = 10; // en dessous de 10 W, un flux est considéré comme nul

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.autonomous .badge{background:color-mix(in srgb,#2fbf71 22%,transparent);color:#2fbf71}
.injecting .badge{background:color-mix(in srgb,#ffb300 24%,transparent);color:#e0a000}
.drawing .badge{background:color-mix(in srgb,#8c6cf0 22%,transparent);color:#8c6cf0}
svg{display:block;width:100%;max-width:calc(100% * var(--illus-scale,1));height:auto;margin:6px auto 0;border-radius:12px;cursor:pointer}
/* ciel : clair le jour, bleu nuit la nuit */
.sky{transition:fill 1s}.night .sky{fill:#1b2440}
.sun{transition:opacity 1s}.night .sun{opacity:0}.moon{opacity:0;transition:opacity 1s}.night .moon{opacity:1}
.stars{opacity:0}.night .stars{opacity:.8}
.ray{transform-box:fill-box;transform-origin:center;animation:shspin 24s linear infinite}
.night .win{fill:#ffd36b}
/* câbles : gris au repos, couleur de la source quand l'énergie circule */
.cable{fill:none;stroke:#c3cad3;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:stroke .4s}
.cable.on{stroke-width:3.4}
.dot{filter:drop-shadow(0 0 3px currentColor)}
/* panneaux : reflet qui balaie quand ça produit */
.glint{opacity:0}.producing .glint{opacity:.55;animation:shglint 3.2s ease-in-out infinite}
.cell{transition:fill .6s}
/* batterie : niveau, voyant */
.blevel{transition:height .8s,y .8s,fill .4s}
/* étiquettes (légendes dynamiques) */
.pill rect{fill:#fff;stroke:rgba(0,0,0,.08)}.pill text{font:600 10px system-ui,-apple-system,Roboto,sans-serif;fill:#26313d}
.pill .k{font-weight:500;fill:#6b7784}
.night .pill rect{fill:#2a3350;stroke:rgba(255,255,255,.12)}.night .pill text{fill:#f1f4f8}.night .pill .k{fill:#aab4c2}
.pill.off{opacity:.55}
.lamp{opacity:0;transition:opacity .4s}.home-on .lamp{opacity:1}
.heat{opacity:0;transition:opacity .4s}.wh-on .heat{opacity:1;animation:shpulse 1.6s ease-in-out infinite}
.evled{fill:#9aa3ad}.ev-on .evled{fill:#38a8ff;filter:drop-shadow(0 0 3px #38a8ff);animation:shpulse 1.4s ease-in-out infinite}
.hide{display:none}
/* tuiles */
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .s{font-size:10px;color:var(--secondary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile.hide,.tiles.hide{display:none}
.noanim *{animation:none!important}
@keyframes shspin{to{transform:rotate(360deg)}}
@keyframes shpulse{50%{opacity:.45}}
@keyframes shglint{0%{transform:translateX(-60px)}60%,100%{transform:translateX(120px)}}
`;

  // panneaux solaires sur le pan de toit (trapèze vu de face) : grille de 2 × 5 modules par interpolation bilinéaire
  const ROOF = { tl: [158, 64], tr: [272, 64], bl: [120, 116], br: [310, 116] };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const at = (u, v) => lerp(lerp(ROOF.tl, ROOF.tr, u), lerp(ROOF.bl, ROOF.br, u), v);
  const PANELS = (() => {
    const cols = 5, rows = 2, mu = .08, mv = .12, gu = .02, gv = .06, out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u0 = mu + c * ((1 - 2 * mu + gu) / cols), u1 = u0 + (1 - 2 * mu + gu) / cols - gu;
      const v0 = mv + r * ((1 - 2 * mv + gv) / rows), v1 = v0 + (1 - 2 * mv + gv) / rows - gv;
      const p = [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)];
      // lignes des cellules (3 horizontales, 2 verticales) pour l'aspect « module »
      const lines = [];
      for (let k = 1; k < 3; k++) { const a = at(u0 + (u1 - u0) * k / 3, v0), b = at(u0 + (u1 - u0) * k / 3, v1); lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`); }
      for (let k = 1; k < 4; k++) { const a = at(u0, v0 + (v1 - v0) * k / 4), b = at(u1, v0 + (v1 - v0) * k / 4); lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`); }
      out.push(`<path class="cell" d="M${p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L')}Z" fill="url(#shpv)" stroke="#9fb4c8" stroke-width=".8"/><path d="${lines.join('')}" stroke="#5d7a96" stroke-width=".35" opacity=".8"/>`);
    }
    return out.join('');
  })();

  // tracés des câbles (le sens « avant » va du premier au dernier point)
  const PATHS = {
    solar: 'M215 110 V134',                    // panneaux → tableau
    home: 'M204 146 H182',                     // tableau → pièce de vie (fenêtre gauche)
    battery: 'M204 154 H186 V200 H74',         // tableau → batterie (le long du sol)
    grid: 'M226 158 V184 H302 V132 L372 70',   // tableau → réseau (poteau)
    ev: 'M222 158 V198 H332',                  // tableau → borne
    water: 'M226 146 H254',                    // tableau → chauffe-eau (fenêtre droite)
  };

  // une à trois batteries côte à côte (zone x = 6 à 74) ; chaque batterie a son niveau, son éclair de charge et, si plusieurs, son pourcentage
  const BATTS = (n) => {
    const span = 68, gap = n > 1 ? 4 : 0, w = n === 1 ? 34 : (span - gap * (n - 1)) / n, x0 = n === 1 ? 40 : 6, out = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (w + gap), pad = n === 1 ? 6 : 4, iw = w - 2 * pad, cx = x + w / 2;
      out.push(`<g><rect x="${x.toFixed(1)}" y="146" width="${w.toFixed(1)}" height="62" rx="5" fill="url(#shbatt)" stroke="#aab4bf"/>
    <rect x="${(x + pad).toFixed(1)}" y="156" width="${iw.toFixed(1)}" height="44" rx="3" fill="#dfe5ea"/><rect class="blevel" data-i="${i}" x="${(x + pad).toFixed(1)}" y="200" width="${iw.toFixed(1)}" height="0" rx="3" fill="#2fbf71"/>
    <rect x="${(cx - 5).toFixed(1)}" y="150" width="10" height="2.4" rx="1.2" fill="#9aa3ad"/>
    <path class="bbolt" data-i="${i}" d="M0 0l-5 9h4l-2 7 6-10h-4z" transform="translate(${(cx).toFixed(1)} 166)" fill="#fff" opacity=".9"/>
    ${n > 1 ? `<text class="bsoc" data-i="${i}" x="${cx.toFixed(1)}" y="190" text-anchor="middle" font-size="8" font-weight="700" fill="#4b5560"></text>` : ''}</g>`);
    }
    return out.join('');
  };

  const SCENE = () => `<svg viewBox="0 0 400 226" role="img">
  <defs>
    <linearGradient id="shsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8ff"/><stop offset="1" stop-color="#f2f8ff"/></linearGradient>
    <linearGradient id="shpv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b4a73"/><stop offset=".55" stop-color="#1c3252"/><stop offset="1" stop-color="#2f5687"/></linearGradient>
    <linearGradient id="shroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b65a3c"/><stop offset="1" stop-color="#8f4027"/></linearGradient>
    <linearGradient id="shwall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf6ee"/><stop offset="1" stop-color="#efe6d8"/></linearGradient>
    <linearGradient id="shbatt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9edf1"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dfe5"/></linearGradient>
    <linearGradient id="shglint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="shroofclip"><path d="M${ROOF.tl.join(' ')}L${ROOF.tr.join(' ')}L${ROOF.br.join(' ')}L${ROOF.bl.join(' ')}Z"/></clipPath>
  </defs>
  <rect class="sky" width="400" height="226" fill="url(#shsky)"/>
  <g class="stars" fill="#fff">${[[30, 20], [70, 46], [110, 18], [300, 24], [340, 48], [250, 14], [180, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>
  <g class="sun"><g class="ray" stroke="#ffc533" stroke-width="2.2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="44" y1="14" x2="44" y2="19" transform="rotate(${a} 44 36)"/>`).join('')}</g><circle cx="44" cy="36" r="12" fill="#ffc533"/></g>
  <path class="moon" d="M50 24a13 13 0 1 0 8 22a11 11 0 1 1 -8 -22z" fill="#f4e7b5"/>
  <!-- sol -->
  <rect y="208" width="400" height="18" fill="#cfe3b4"/><rect y="208" width="400" height="3" fill="#b5d095"/>
  <!-- maison : murs, toit, panneaux -->
  <rect x="120" y="116" width="190" height="94" fill="url(#shwall)" stroke="#d9ccb8"/>
  <path d="M104 118 L158 62 L272 62 L326 118 Z" fill="url(#shroof)"/><path d="M104 118 L326 118" stroke="#7b3720" stroke-width="3" stroke-linecap="round"/>
  ${PANELS}
  <g clip-path="url(#shroofclip)"><rect class="glint" x="120" y="60" width="40" height="60" fill="url(#shglint)" transform="skewX(-20)"/></g>
  <!-- fenêtre gauche (pièce de vie, lampe) et fenêtre droite (chauffe-eau) -->
  <rect class="win" x="136" y="140" width="46" height="32" rx="2" fill="#dbe9f5" stroke="#b8c7d4"/><path d="M159 140v32M136 156h46" stroke="#b8c7d4"/>
  <g class="lamp"><path d="M159 141v5" stroke="#6b7784"/><path d="M153 146h12l-3 5h-6z" fill="#ffcf5a"/><circle cx="159" cy="154" r="9" fill="#ffd36b" opacity=".35"/></g>
  <rect class="win" x="254" y="140" width="40" height="32" rx="2" fill="#dbe9f5" stroke="#b8c7d4"/>
  <g class="whg"><rect x="266" y="142" width="16" height="28" rx="7" fill="#f7f9fb" stroke="#aab4bf"/><circle cx="274" cy="153" r="3.2" fill="none" stroke="#7b8794" stroke-width=".9"/>
    <rect class="heat" x="268" y="161" width="12" height="6" rx="3" fill="#ff7043"/></g>
  <!-- porte -->
  <rect x="190" y="172" width="22" height="38" rx="2" fill="#a8744f"/><circle cx="207" cy="191" r="1.3" fill="#f1d9a6"/>
  <!-- tableau électrique / onduleur -->
  <rect x="204" y="134" width="22" height="24" rx="3" fill="#ffffff" stroke="#9aa3ad"/><path d="M209 141h12M209 146h12M209 151h7" stroke="#c3cad3" stroke-width="1.6" stroke-linecap="round"/><circle cx="221" cy="151" r="1.5" fill="#2fbf71"/>
  <!-- compteur (Linky) sur le mur droit -->
  <rect x="296" y="166" width="12" height="16" rx="2" fill="#e8f3d8" stroke="#9ab27a"/><rect x="298.5" y="169" width="7" height="4" rx="1" fill="#2c3a22"/>
  <!-- batterie(s) de stockage : dessinées dynamiquement (battery_count) -->
  <g class="batt" id="battg"></g>
  <!-- borne de recharge -->
  <g class="evg"><rect x="330" y="164" width="16" height="44" rx="3" fill="#3a4047"/><rect x="332" y="168" width="12" height="20" rx="2" fill="#f2f4f6"/><rect class="evled" x="335.5" y="171" width="5" height="10" rx="2"/>
    <path d="M346 186c8 2 8 12 0 14" fill="none" stroke="#2b3036" stroke-width="2"/></g>
  <!-- poteau électrique (réseau) -->
  <g class="pole"><rect x="369" y="60" width="6" height="150" fill="#8d6e55"/><rect x="352" y="64" width="40" height="5" rx="1.5" fill="#7a5d47"/>
    ${[356, 372, 388].map((x) => `<rect x="${x - 2}" y="58" width="4" height="7" rx="1.5" fill="#cfd8e3"/>`).join('')}
    <path d="M388 60 Q396 66 404 62M356 60 Q348 66 340 64" stroke="#55606b" stroke-width=".8" fill="none"/></g>
  <!-- câbles et flux -->
  ${Object.entries(PATHS).map(([k, d]) => `<path id="fp-${k}" class="cable c-${k}" d="${d}"/>`).join('')}
  <g id="dots"></g>
  <!-- légendes dynamiques -->
  ${[['solar', 215, 44], ['battery', 57, 132], ['grid', 344, 44]].map(([k, x, y]) =>
    `<g class="pill p-${k}" transform="translate(${x} ${y})"><rect x="-27" y="-9" width="54" height="16" rx="8"/><text class="k" x="0" y="-12" text-anchor="middle" font-size="8"></text><text class="v" x="0" y="2.5" text-anchor="middle"></text></g>`).join('')}
  ${[['home', 159, 128, 'M2 7l5-4.5 5 4.5v5H8.5V9h-3v3H2z'], ['water', 274, 128, 'M7 1.5C4.4 4.8 3 6.8 3 8.5a4 4 0 0 0 8 0c0-1.7-1.4-3.7-4-7z'], ['ev', 338, 217, 'M8 1L3.5 7.5h3l-1 4.5L10 5.5H7z']].map(([k, x, y, ic]) =>
    `<g class="pill p-${k}" transform="translate(${x} ${y})"><rect x="-27" y="-8" width="54" height="15" rx="7.5"/><path d="${ic}" fill="#ffb300" transform="translate(-24 -6.5)"/><text class="k" x="0" y="0" font-size="0"></text><text class="v" x="5" y="3" text-anchor="middle"></text></g>`).join('')}
</svg>`;

  const TILES = [['production', 'mdi:solar-power-variant'], ['consumption', 'mdi:home-lightning-bolt-outline'], ['battery', 'mdi:home-battery-outline'], ['grid', 'mdi:transmission-tower'], ['ev', 'mdi:ev-station'], ['water', 'mdi:water-boiler']];

  class ApplianceSolarHouseCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const S = (hass && hass.states) || {}, ids = Object.keys(S), pw = (i) => i.startsWith('sensor.') && (S[i].attributes || {}).device_class === 'power';
      return { entity_solar: ids.find((i) => pw(i) && /(solar|pv|photo|production|onduleur|inverter)/i.test(i)) || '',
        entity_grid: ids.find((i) => pw(i) && /(grid|reseau|linky|net)/i.test(i)) || '' };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { max_power: 6000, show_tiles: true, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 6, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // puissance d'une entité en W (kW et MW convertis), NaN si absente ou indisponible
    _w(id) {
      const s = id && this._hass.states[id];
      if (!s || /^(unavailable|unknown|none|)$/i.test(String(s.state))) return NaN;
      const v = parseFloat(String(s.state).replace(',', '.')); if (!isFinite(v)) return NaN;
      const u = String((s.attributes && s.attributes.unit_of_measurement) || 'W').trim();
      return v * ({ kW: 1000, MW: 1e6, mW: 1e-3 }[u] || 1);
    }
    _fmt(w) {
      if (!isFinite(w)) return '--';
      const loc = window.applianceLocale(this._c, this._hass), a = Math.abs(w);
      return a >= 1000 ? `${(w / 1000).toLocaleString(loc, { maximumFractionDigits: a >= 10000 ? 1 : 2, minimumFractionDigits: 1 })} kW` : `${Math.round(w).toLocaleString(loc)} W`;
    }

    // bilan des puissances (W) ; les entités manquantes valent 0, la consommation est calculée si elle n'est pas fournie
    _compute() {
      const c = this._c, z = (v) => (isFinite(v) ? v : 0);
      const sol = Math.max(0, z(this._w(c.entity_solar)));
      let batt = this._w(c.entity_battery_power); if (isFinite(batt) && c.battery_invert) batt = -batt;
      let grid = this._w(c.entity_grid); if (isFinite(grid) && c.grid_invert) grid = -grid;
      if (!isFinite(grid) && (c.entity_grid_import || c.entity_grid_export)) grid = z(this._w(c.entity_grid_import)) - z(this._w(c.entity_grid_export));
      const ev = Math.max(0, z(this._w(c.entity_ev))), wh = Math.max(0, z(this._w(c.entity_water_heater)));
      let home = this._w(c.entity_home);
      if (isFinite(home)) home = Math.max(0, home); // une consommation ne peut pas être négative (pince ampèremétrique qui oscille autour de 0, injection…) : négatif = 0
      // consommation calculée : production + soutirage + décharge − injection − charge − borne − ballon
      if (!isFinite(home)) home = Math.max(0, sol + z(grid) - z(batt) - ev - wh);
      // plusieurs batteries (battery_count, 1 à 3) : soit chacune a ses entités (entity_battery_2_power / _soc…), la puissance totale est alors la somme
      // et le niveau la moyenne ; soit elles reflètent toutes les entités uniques (capteurs combinés)
      const MAXB = 3, inv = (x) => (isFinite(x) && c.battery_invert ? -x : x), socOf = (id) => { const st = id && this._hass.states[id]; const x = st ? parseFloat(st.state) : NaN; return x; };
      const idx = [2, 3].filter((i) => c[`entity_battery_${i}_power`] || c[`entity_battery_${i}_soc`]);
      const own = idx.length > 0, nb = Math.max(1, Math.min(MAXB, Math.round(Number(c.battery_count)) || 1, MAXB));
      const count = own ? Math.max(nb, ...idx) : nb;
      const bats = [];
      for (let i = 1; i <= count; i++) {
        const pid = i === 1 ? c.entity_battery_power : c[`entity_battery_${i}_power`], sid = i === 1 ? c.entity_battery_soc : c[`entity_battery_${i}_soc`];
        const w = own ? inv(this._w(pid)) : batt, sc = own ? socOf(sid) : socOf(c.entity_battery_soc);
        bats.push({ w, soc: sc });
      }
      if (own) { const ws = bats.map((x) => x.w).filter(isFinite); if (ws.length) batt = ws.reduce((x, y) => x + y, 0); }
      const socs = bats.map((x) => x.soc).filter(isFinite);
      const soc = socs.length ? socs.reduce((x, y) => x + y, 0) / socs.length : NaN;
      const carS = c.entity_car_soc && this._hass.states[c.entity_car_soc], car = carS ? parseFloat(carS.state) : NaN;
      const sun = this._hass.states['sun.sun'];
      const night = sun ? sun.state === 'below_horizon' : sol < THR;
      return { sol, batt, grid, ev, wh, home, soc, car, night, bats, hasBatt: !!(c.entity_battery_power || c.entity_battery_soc || bats.some((x) => isFinite(x.w) || isFinite(x.soc))), hasGrid: isFinite(grid), hasEv: !!(c.entity_ev || c.entity_car_soc), hasWh: !!c.entity_water_heater };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="shtitle"></div><div class="badge" id="shbadge"></div></div>
        ${SCENE()}
        <div class="tiles" id="shtiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div><div class="s"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_solar));
      const ENT = { production: 'entity_solar', consumption: 'entity_home', battery: 'entity_battery_soc', grid: 'entity_grid', ev: 'entity_ev', water: 'entity_water_heater' };
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c, k = el.dataset.k;
        this._more(c[ENT[k]] || (k === 'battery' && c.entity_battery_power) || (k === 'grid' && (c.entity_grid_import || c.entity_grid_export)) || c.entity_solar);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._sig = ''; this._nB = null; this._built = true;
    }

    // points lumineux : 3 par flux actif, sens et vitesse selon la puissance ; reconstruits seulement quand un flux change
    _flows(F) {
      const max = Number(this._c.max_power) > 0 ? Number(this._c.max_power) : 6000;
      const dur = (w) => Math.max(.7, 3.4 - 2.7 * Math.min(1, Math.abs(w) / max));
      const sig = JSON.stringify(F.map((f) => [f.k, f.rev, f.col, Math.round(dur(f.w) * 10)]));
      const r = this._root;
      Object.keys(PATHS).forEach((k) => { const f = F.find((x) => x.k === k), p = r.querySelector(`.c-${k}`); p.classList.toggle('on', !!f); p.style.stroke = f ? f.col : ''; });
      if (sig === this._sig) return;
      this._sig = sig;
      r.getElementById('dots').innerHTML = F.map((f) => {
        const d = dur(f.w).toFixed(2);
        return [0, 1, 2].map((i) => `<circle class="dot" r="3.2" fill="${f.col}" style="color:${f.col}"><animateMotion dur="${d}s" repeatCount="indefinite" begin="${(-i * d / 3).toFixed(2)}s" keyPoints="${f.rev ? '1;0' : '0;1'}" keyTimes="0;1" calcMode="linear"><mpath href="#fp-${f.k}"/></animateMotion></circle>`).join('');
      }).join('');
    }

    _pill(k, label, value, on, show = true) {
      const g = this._root.querySelector(`.p-${k}`); if (!g) return;
      g.classList.toggle('hide', !show); g.classList.toggle('off', !on);
      g.querySelector('.k').textContent = label; g.querySelector('.v').textContent = value;
      const ico = !!g.querySelector('path'), w = Math.max(ico ? 50 : 54, value.length * 6.2 + (ico ? 24 : 14)); const rc = g.querySelector('rect'); rc.setAttribute('width', w); rc.setAttribute('x', -w / 2);
      g.querySelector('.k').style.display = ico ? 'none' : ''; // pastilles à icône (maison, ballon, borne) : pas de libellé au-dessus
      if (ico) { g.querySelector('path').setAttribute('transform', `translate(${(-w / 2 + 4).toFixed(1)} -6.5)`); g.querySelector('.v').setAttribute('x', '6'); }
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, v = this._compute();
      const exp = v.hasGrid && v.grid < -THR, imp = v.hasGrid && v.grid > THR, chg = v.hasBatt && v.batt > THR, dis = v.hasBatt && v.batt < -THR;
      const st = exp ? 'injecting' : imp ? 'drawing' : v.sol > THR ? 'autonomous' : 'idle';
      card.className = `${st}${v.night ? ' night' : ''}${v.sol > THR ? ' producing' : ''}${v.home > THR ? ' home-on' : ''}${v.ev > THR ? ' ev-on' : ''}${v.wh > THR ? ' wh-on' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.getElementById('shtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('shbadge'); badge.textContent = this._t(st); badge.style.display = c.show_status === false ? 'none' : '';
      // éléments facultatifs masqués si l'entité n'est pas configurée
      r.querySelector('.batt').classList.toggle('hide', !v.hasBatt); r.querySelector('.c-battery').classList.toggle('hide', !v.hasBatt);
      r.querySelector('.evg').classList.toggle('hide', !v.hasEv); r.querySelector('.c-ev').classList.toggle('hide', !v.hasEv);
      r.querySelector('.whg').classList.toggle('hide', !v.hasWh); r.querySelector('.c-water').classList.toggle('hide', !v.hasWh);
      // niveau de la batterie (vert, orange sous 30 %, rouge sous 15 %)
      const nB = v.bats.length, many = nB > 1;
      if (this._nB !== nB) { this._nB = nB; r.getElementById('battg').innerHTML = BATTS(nB); r.querySelector('.p-battery').setAttribute('transform', `translate(${nB === 1 ? 57 : 40} 132)`); }
      v.bats.forEach((b, i) => {
        const soc = isFinite(b.soc) ? Math.max(0, Math.min(100, b.soc)) : 50, lv = r.querySelector(`.blevel[data-i="${i}"]`), hh = 44 * soc / 100;
        lv.setAttribute('y', (200 - hh).toFixed(1)); lv.setAttribute('height', hh.toFixed(1)); lv.setAttribute('fill', soc < 15 ? '#ef5350' : soc < 30 ? '#ffa726' : '#2fbf71');
        r.querySelector(`.bbolt[data-i="${i}"]`).style.opacity = isFinite(b.w) && b.w > THR ? '.95' : '0';
        const tx = r.querySelector(`.bsoc[data-i="${i}"]`); if (tx) tx.textContent = isFinite(b.soc) ? `${Math.round(b.soc)}` : '';
      });
      // source dominante des consommateurs : soleil, sinon batterie, sinon réseau
      const src = v.sol > THR ? COL.solar : dis ? COL.battery : imp ? COL.grid : COL.solar;
      const F = [];
      if (v.sol > THR) F.push({ k: 'solar', w: v.sol, col: COL.solar });
      if (v.home > THR) F.push({ k: 'home', w: v.home, col: src });
      if (chg) F.push({ k: 'battery', w: v.batt, col: v.sol > THR ? COL.solar : COL.grid });
      if (dis) F.push({ k: 'battery', w: v.batt, col: COL.battery, rev: true });
      if (exp) F.push({ k: 'grid', w: v.grid, col: v.sol > THR ? COL.solar : COL.battery });
      if (imp) F.push({ k: 'grid', w: v.grid, col: COL.grid, rev: true });
      if (v.ev > THR) F.push({ k: 'ev', w: v.ev, col: src });
      if (v.wh > THR) F.push({ k: 'water', w: v.wh, col: src });
      this._flows(F);
      // légendes dynamiques
      this._pill('solar', this._l('production'), this._fmt(v.sol), v.sol > THR);
      this._pill('home', this._l('consumption'), this._fmt(v.home), v.home > THR);
      this._pill('battery', isFinite(v.soc) ? `${this._l('battery')} ${Math.round(v.soc)} %` : this._l('battery'), isFinite(v.batt) ? `${chg ? '+' : dis ? '−' : ''}${this._fmt(Math.abs(v.batt))}` : '--', chg || dis, v.hasBatt);
      this._pill('grid', exp ? this._l('export') : imp ? this._l('import') : this._l('grid'), v.hasGrid ? this._fmt(Math.abs(v.grid)) : '--', exp || imp, v.hasGrid);
      this._pill('ev', this._l('ev'), `${isFinite(v.car) ? `${Math.round(v.car)} % · ` : ''}${this._fmt(v.ev)}`, v.ev > THR || isFinite(v.car), v.hasEv);
      const evTxt = r.querySelector('.p-ev .v'); if (evTxt) evTxt.style.fill = isFinite(v.car) && v.car < 20 ? (v.car < 10 ? '#e53935' : '#ef8a00') : '';
      this._pill('water', this._l('water_heater'), this._fmt(v.wh), v.wh > THR, v.hasWh);
      // tuiles
      const tiles = r.getElementById('shtiles'); tiles.classList.toggle('hide', c.show_tiles === false);
      const set = (k, show, val, sub) => { const el = r.querySelector(`.tile[data-k="${k}"]`); el.classList.toggle('hide', !show); el.querySelector('.lbl').textContent = this._l(k === 'water' ? 'water_heater' : k); el.querySelector('.v').textContent = val; el.querySelector('.s').textContent = sub || ''; };
      set('production', true, this._fmt(v.sol));
      set('consumption', true, this._fmt(v.home));
      set('battery', v.hasBatt, isFinite(v.soc) ? `${Math.round(v.soc)} %` : this._fmt(v.batt), chg ? `${this._t('charging')} ${this._fmt(v.batt)}` : dis ? `${this._t('discharging')} ${this._fmt(-v.batt)}` : '');
      set('grid', v.hasGrid, this._fmt(Math.abs(v.grid)), exp ? this._t('export') : imp ? this._t('import') : '');
      set('ev', v.hasEv, this._fmt(v.ev), isFinite(v.car) ? `${this._t('car')} ${Math.round(v.car)} %` : '');
      const evSub = r.querySelector('.tile[data-k="ev"] .s'); if (evSub) evSub.style.color = isFinite(v.car) && v.car < 20 ? (v.car < 10 ? '#e53935' : '#ef8a00') : ''; set('water', v.hasWh, this._fmt(v.wh));
    }
  }
  customElements.define(TAG, ApplianceSolarHouseCard);

  /* ---- éditeur visuel ---- */
  class ApplianceSolarHouseCardEditor extends HTMLElement {
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
      const pw = (name) => ({ name, selector: { entity: { domain: 'sensor', device_class: 'power' } } });
      const bool = (name, def = true) => ({ name, selector: { boolean: {} }, default: def });
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        pw('entity_solar'), pw('entity_home'),
        pw('entity_battery_power'), { name: 'entity_battery_soc', selector: { entity: { domain: 'sensor' } } },
        { name: 'battery_count', default: 1, selector: { number: { min: 1, max: 3, step: 1, mode: 'box' } } },
        pw('entity_battery_2_power'), { name: 'entity_battery_2_soc', selector: { entity: { domain: 'sensor' } } },
        pw('entity_battery_3_power'), { name: 'entity_battery_3_soc', selector: { entity: { domain: 'sensor' } } },
        pw('entity_grid'), pw('entity_grid_import'), pw('entity_grid_export'),
        pw('entity_ev'), { name: 'entity_car_soc', selector: { entity: { domain: 'sensor' } } }, pw('entity_water_heater'),
        { type: 'grid', name: '', schema: [bool('battery_invert', false), bool('grid_invert', false),
          { name: 'max_power', default: 6000, selector: { number: { min: 500, max: 50000, step: 100, mode: 'box', unit_of_measurement: 'W' } } }] },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_tiles'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceSolarHouseCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Schéma animé d\'une maison solaire : panneaux sur le toit, batterie, réseau (poteaux), borne et chauffe-eau, avec des points lumineux qui suivent le sens et la puissance de l\'énergie.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/solar-house.md',
  });
})();
