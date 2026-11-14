/* Carte « Boîte aux lettres » — custom:appliance-mailbox-card
 * Boîte aux lettres vue de trois quarts. Courrier : une lettre tombe par la fente et le volet claque ;
 * colis : un carton rebondit au pied de la boîte ; porte ouverte : la porte pivote sur sa charnière.
 * Générique : fonctionne avec un capteur par type (entity_mail / entity_parcel), ou un seul capteur dont l'état
 * est un texte (« lettre », « colis », « vide »…) ou un nombre (lettres reçues). Tous les autres capteurs sont optionnels :
 * porte avant (entity_door) et porte arrière (entity_door_back, boîtes à double porte), compteur (entity_count), batterie, et une entité pour marquer le courrier comme relevé (entity_reset).
 * box_model: boks → photo détourée de la boîte à colis BOKS + calques animés (porte qui pivote, lettre dans la fente,
 * pictogramme colis qui s'allume, clavier qui passe au vert porte ouverte, voyant pile faible). Options propres :
 * entity_open (bouton « Ouvrir la porte »), entity_last_open (une ou plusieurs dates d'ouverture : la plus récente),
 * entity_battery_low (binary_sensor pile faible). Sans capteur de courrier, la BOKS s'affiche « Fermée » / « Porte ouverte ».
 */
(() => {
  const TAG = 'appliance-mailbox-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n mailbox*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  // états texte reconnus par défaut (toutes langues des traductions), complétés par mail_states / parcel_states
  const MAIL_WORDS = ['mail', 'letter', 'letters', 'post', 'lettre', 'lettres', 'courrier', 'brief', 'briefe', 'posta', 'lettera', 'lettere', 'brev', 'scrisoare', 'scrisori', 'письмо', 'почта', 'pismo', 'писмо', 'pošta', 'пошта'];
  const PARCEL_WORDS = ['parcel', 'package', 'packet', 'colis', 'paket', 'pacco', 'pakke', 'pakket', 'pakketje', 'colet', 'посылка', 'посылки', 'пакет'];
  const BOTH_WORDS = ['both', 'mail_and_parcel', 'les deux', 'courrier et colis', 'lettre et colis'];
  const EMPTY_WORDS = ['off', 'false', 'empty', 'no', 'none', 'closed', 'clear', 'vide', 'aucun', 'leer', 'vuoto', 'tom', 'leeg', 'gol', 'пусто', 'prazno', 'празно', '0'];
  const ON_RE = /^(on|true|yes|open|detected|full|plein|pleine|1)$/i;

  // couleurs de la boîte : [ombre, face, clair]
  const COLORS = {
    anthracite: ['#1d2127', '#30353d', '#474e59'], black: ['#0c0d10', '#1c1e22', '#2e3137'],
    grey: ['#5b6169', '#8a9099', '#aeb4bc'], white: ['#9aa1ab', '#d9dde3', '#f4f6f8'],
    green: ['#1f3a2a', '#2f5a3f', '#46805b'], red: ['#4a1515', '#7a2222', '#a63434'],
    blue: ['#16294a', '#24427a', '#3a5ea3'], yellow: ['#8a6a0c', '#d6a516', '#f1c63c'], brown: ['#3b2618', '#5e3d26', '#7f5638'],
  };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--mb-mail:var(--appliance-cold-color,#2b9af9);--mb-parcel:var(--appliance-warm-color,#ff9800);
  --mb-alert:var(--appliance-alert-color,#db4437);--mb-ok:var(--appliance-ok-color,#43a047)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.empty .badge{background:color-mix(in srgb,var(--mb-ok) 20%,transparent);color:var(--mb-ok)}
.mail .badge{background:color-mix(in srgb,var(--mb-mail) 22%,transparent);color:var(--mb-mail)}
.parcel .badge,.both .badge{background:color-mix(in srgb,var(--mb-parcel) 22%,transparent);color:var(--mb-parcel)}
.door_open .badge{background:color-mix(in srgb,var(--mb-alert) 22%,transparent);color:var(--mb-alert)}
.scene{position:relative;width:100%;max-width:calc(200px * var(--illus-scale,1));margin:2px auto 0;cursor:pointer}
svg{display:block;width:100%;height:auto;overflow:visible}
.count{position:absolute;top:0;right:12%;min-width:24px;height:24px;padding:0 6px;box-sizing:border-box;border-radius:12px;background:var(--mb-mail);color:#fff;
  font:700 12px/24px var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-align:center;box-shadow:0 2px 8px color-mix(in srgb,var(--mb-mail) 60%,transparent);
  transform:scale(0);transition:transform .4s cubic-bezier(.3,1.6,.5,1)}
.count.on{transform:scale(1)}
.ctl{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:disabled{opacity:.5;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tiles.hide,.tile.hide{display:none}.tile.bad .v{color:var(--mb-alert)}
/* ---- illustration ---- */
.mb-c0{fill:var(--mb-c0)}.mb-c1{fill:var(--mb-c1)}.mb-c2{fill:var(--mb-c2)}
.mb-door{transform-box:view-box;transform-origin:18px 105px;transition:transform .7s cubic-bezier(.3,1.3,.5,1)}
.mb-flap{transform-box:view-box;transform-origin:90px 46px}
.mb-letter,.mb-pile,.mb-parcel{opacity:0;transition:opacity .3s}
/* courrier : la lettre tombe par la fente, le volet claque, la pile se voit porte ouverte */
.mail .mb-letter,.both .mb-letter{animation:mbdrop 3.2s ease-in infinite}
.mail .mb-flap,.both .mb-flap{animation:mbflap 3.2s ease-in-out infinite}
.mail .mb-pile,.both .mb-pile{opacity:1}
/* colis : carton au pied de la boîte, petit rebond */
.parcel .mb-parcel,.both .mb-parcel{opacity:1}
.parcel .mb-pk,.both .mb-pk{transform-box:fill-box;transform-origin:50% 100%;animation:mbland 2.6s cubic-bezier(.3,1.4,.5,1) infinite}
/* porte ouverte (s'ajoute aux autres états) */
.opened .mb-door{transform:perspective(500px) rotateY(-72deg)}
.opened .mb-letter{animation:none;opacity:0}
.unavailable svg{filter:grayscale(.7) opacity(.7)}
.noanim .mb-letter,.noanim .mb-flap,.noanim .mb-pk{animation:none}
/* ---- BOKS (photo) : coordonnées en pixels de la photo détourée (595 × 863) ---- */
.bk-door{transform-box:view-box;transform-origin:25px 430px;transition:transform .7s cubic-bezier(.3,1.3,.5,1)}
.opened .bk-door{transform:perspective(1500px) rotateY(-70deg)}
.bk-letter,.bk-glow,.bk-keys,.bk-bat,.bk-in{opacity:0;transition:opacity .3s}
.mail .bk-letter,.both .bk-letter{animation:bkdrop 3.2s ease-in infinite}
.parcel .bk-glow,.both .bk-glow{animation:bkglow 2s ease-in-out infinite}
.opened .bk-keys{opacity:1;animation:bkkeys 1.2s ease-in-out infinite alternate}
.opened .bk-letter{animation:none;opacity:0}
.opened.parcel .bk-in,.opened.both .bk-in{opacity:1}
.batlow .bk-bat{animation:bkblink 1.2s ease-in-out infinite}
.noanim .bk-letter,.noanim .bk-glow,.noanim .bk-keys,.noanim .bk-bat{animation:none}
.noanim.parcel .bk-glow,.noanim.both .bk-glow,.noanim.batlow .bk-bat{opacity:1}
@keyframes bkdrop{0%{transform:translateY(-150px);opacity:0}15%{transform:translateY(-110px);opacity:1}55%{transform:translateY(40px);opacity:1}60%,100%{transform:translateY(40px);opacity:0}}
@keyframes bkglow{0%,100%{opacity:.25}50%{opacity:.9}}
@keyframes bkkeys{from{opacity:.45}to{opacity:.95}}
@keyframes bkblink{0%,100%{opacity:0}50%{opacity:1}}
@keyframes mbdrop{0%{transform:translateY(-30px);opacity:0}15%{transform:translateY(-14px);opacity:1}45%{transform:translateY(40px);opacity:1}50%,100%{transform:translateY(40px);opacity:0}}
@keyframes mbflap{0%,30%{transform:scaleY(1)}38%{transform:scaleY(-.25)}48%{transform:scaleY(1.08)}56%,100%{transform:scaleY(1)}}
@keyframes mbland{0%,60%,100%{transform:translateY(0) scale(1,1)}70%{transform:translateY(-10px) scale(.97,1.04)}80%{transform:translateY(0) scale(1.05,.94)}88%{transform:scale(1,1)}}
`;

  /* boîte en vue 3/4 : côté, dessus, intérieur, porte (charnière à gauche), lettre, colis — cadre 200 × 190 */
  const SVG = (label) => `<svg viewBox="0 0 200 190" role="img" aria-label="${esc(label)}"><defs>
    <radialGradient id="mbsh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="mbfront" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--mb-c2)"/><stop offset="1" style="stop-color:var(--mb-c1)"/></linearGradient>
    <linearGradient id="mbside" x1="0" x2="1"><stop offset="0" style="stop-color:var(--mb-c1)"/><stop offset="1" style="stop-color:var(--mb-c0)"/></linearGradient></defs>
    <ellipse cx="96" cy="182" rx="80" ry="7" fill="url(#mbsh)"/>
    <path d="M18 34 L52 14 L52 150 L18 176 Z" fill="url(#mbside)"/>
    <path class="mb-c2" d="M18 34 L52 14 L184 14 L160 34 Z" opacity=".9"/>
    <path class="mb-c0" d="M160 34 L184 14 L184 150 L160 176 Z" opacity=".55"/>
    <rect x="22" y="38" width="134" height="134" fill="#0d1018"/>
    <g class="mb-pile"><rect x="104" y="150" width="44" height="6" rx="1" fill="#f2f4f8"/><rect x="100" y="156" width="48" height="6" rx="1" fill="#dfe4ee"/><rect x="106" y="162" width="40" height="6" rx="1" fill="#e9d9b8"/></g>
    <g class="mb-letter"><rect x="64" y="0" width="52" height="34" rx="2" fill="#f5f7fb"/><path d="M64 0 L90 20 L116 0" fill="none" stroke="#c3c9d6" stroke-width="2"/></g>
    <g class="mb-door">
      <rect x="18" y="34" width="142" height="142" rx="3" fill="url(#mbfront)"/>
      <rect x="18" y="34" width="142" height="142" rx="3" fill="none" stroke="#fff" stroke-opacity=".08"/>
      <path class="mb-flap mb-c2" d="M32 46 H148 V70 Q120 64 90 72 Q60 64 32 70 Z" stroke="#000" stroke-opacity=".35"/>
      <circle cx="34" cy="90" r="5" fill="#b9bec8"/><rect x="33" y="87" width="2" height="6" fill="#444"/>
      <rect x="112" y="82" width="34" height="14" rx="2" fill="#e8ebf0"/><rect x="117" y="87" width="24" height="3" rx="1" fill="#99a"/>
    </g>
    <g class="mb-parcel"><g class="mb-pk">
      <path d="M118 132 L132 122 L192 122 L178 132 Z" fill="#dcae74"/>
      <path d="M178 132 L192 122 L192 170 L178 180 Z" fill="#a8763f"/>
      <rect x="118" y="132" width="60" height="48" rx="2" fill="#c9965b"/>
      <rect x="143" y="132" width="10" height="48" fill="#e3c08f"/><path d="M143 132 L157 122 L167 122 L153 132 Z" fill="#efd3a8"/>
      <rect x="124" y="160" width="16" height="10" rx="1" fill="#f4f6f8" opacity=".85"/>
    </g></g>
  </svg>`;

  /* BOKS : photo détourée (issue #206) ; la porte est la même photo découpée par bk-clip, qui pivote sur sa charnière */
  const BOKS_IMG = 'data:image/webp;base64,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';
  const BOKS_DOOR = 'M25 38 L300 35 L300 255 C300 300 350 300 350 350 L350 832 L28 822 Z';
  const SVG_BOKS = (label) => `<svg viewBox="-10 -150 615 1013" role="img" aria-label="${esc(label)}"><defs>
    <clipPath id="bkclip"><path d="${BOKS_DOOR}"/></clipPath>
    <clipPath id="bkslot"><rect x="0" y="-150" width="595" height="238"/></clipPath>
    <radialGradient id="bkglowg"><stop offset="0" stop-color="#ff9800" stop-opacity=".9"/><stop offset="1" stop-color="#ff9800" stop-opacity="0"/></radialGradient>
    <radialGradient id="bksh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="300" cy="850" rx="300" ry="22" fill="url(#bksh)"/>
    <image href="${BOKS_IMG}" x="0" y="0" width="595" height="863"/>
    <!-- intérieur, visible porte ouverte ; colis posé au fond -->
    <path d="${BOKS_DOOR}" fill="#11151b"/>
    <path d="M25 38 L300 35 L300 255 C300 300 350 300 350 350 L350 832 L320 800 L320 360 C320 320 280 300 280 260 L280 70 L55 72 L55 800 L28 822 Z" fill="#1d232b"/>
    <g class="bk-in"><path d="M140 700 L170 676 L300 676 L270 700 Z" fill="#dcae74"/><path d="M270 700 L300 676 L300 776 L270 800 Z" fill="#a8763f"/>
      <rect x="140" y="700" width="130" height="100" rx="3" fill="#c9965b"/><rect x="198" y="700" width="16" height="100" fill="#e3c08f"/></g>
    <!-- lettre qui tombe dans la fente (masquée sous le bord de la fente) -->
    <g clip-path="url(#bkslot)"><g class="bk-letter"><rect x="95" y="-10" width="140" height="90" rx="4" fill="#f5f7fb" stroke="#c3c9d6" stroke-width="2"/><path d="M95 -10 L165 40 L235 -10" fill="none" stroke="#c3c9d6" stroke-width="4"/></g></g>
    <g class="bk-door">
      <image href="${BOKS_IMG}" x="0" y="0" width="595" height="863" clip-path="url(#bkclip)"/>
      <!-- pictogramme colis qui s'allume quand un colis est annoncé -->
      <circle class="bk-glow" cx="160" cy="200" r="85" fill="url(#bkglowg)" style="mix-blend-mode:screen"/>
    </g>
    <!-- clavier : rétroéclairage vert porte ouverte -->
    <rect class="bk-keys" x="321" y="104" width="37" height="142" rx="4" fill="#4caf50" style="mix-blend-mode:screen"/>
    <!-- voyant pile faible sous le clavier -->
    <g class="bk-bat"><rect x="326" y="255" width="26" height="14" rx="2" fill="#e53935"/><rect x="352" y="259" width="3" height="6" fill="#e53935"/><rect x="329" y="258" width="5" height="8" fill="#fff"/></g>
  </svg>`;

  const TILES = [['last', 'mdi:clock-outline', 'show_since'], ['count', 'mdi:email-multiple-outline', 'show_count'], ['battery', 'mdi:battery', 'show_battery'], ['battery_back', 'mdi:battery', 'show_battery_back'],
    ['door_front', 'mdi:door', 'show_doors'], ['door_back', 'mdi:door', 'show_doors'], ['last_open', 'mdi:door-open', 'show_last_open'], ['presence', 'mdi:motion-sensor', 'show_presence']]; // les 4 premières : 1re ligne, portes et dernière ouverture : 2e ligne

  class ApplianceMailboxCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config

    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const box = (i) => /(mail|letter|lettre|courrier|boite|boîte|postbox|letterbox|briefkasten|cassetta|postkasse|brievenbus)/i.test(i);
      return {
        entity_mail: ids.find((i) => box(i) && /^(binary_sensor|input_boolean|sensor)\./.test(i) && !/(colis|parcel|package|paket|door|porte|battery|batterie)/i.test(i)) || '',
        entity_parcel: ids.find((i) => /(colis|parcel|package|paket|pacco)/i.test(i) && /^(binary_sensor|input_boolean|sensor)\./.test(i)) || '',
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, show_since: true, show_count: true, show_battery: true, show_battery_back: true, show_presence: true, show_buttons: true, show_doors: true, show_last_open: true, box_color: 'anthracite', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _list(v) { return (Array.isArray(v) ? v : v == null || v === '' ? [] : String(v).split(',')).map((s) => String(s).trim().toLowerCase()).filter(Boolean); }

    /* lit l'état d'une entité : { mail, parcel, n } (n = nombre si l'état est numérique)
     * kind = 'mail' ou 'parcel' : ce qu'un simple « on » ou un nombre > 0 veut dire pour cette entité */
    _read(id, kind) {
      const s = this._st(id); if (!this._ok(s)) return null;
      const raw = String(s.state).trim(), v = raw.toLowerCase(), c = this._c;
      const has = (words) => words.some((w) => v === w || (w.length > 3 && v.includes(w)));
      const n = parseFloat(raw.replace(',', '.'));
      if (isFinite(n) && /^-?[\d.,]+$/.test(raw)) return { mail: kind === 'mail' && n > 0, parcel: kind === 'parcel' && n > 0, n };
      if (EMPTY_WORDS.includes(v)) return { mail: false, parcel: false, n: NaN };
      if (has(BOTH_WORDS)) return { mail: true, parcel: true, n: NaN };
      // un texte peut annoncer les deux (« courrier et colis ») : chaque type est cherché séparément
      const isM = has([...MAIL_WORDS, ...this._list(c.mail_states)]), isP = has([...PARCEL_WORDS, ...this._list(c.parcel_states)]);
      if (isM || isP) return { mail: isM, parcel: isP, n: NaN };
      const on = ON_RE.test(v);
      return { mail: on && kind === 'mail', parcel: on && kind === 'parcel', n: NaN };
    }

    _compute() {
      const c = this._c;
      const m = this._read(c.entity_mail, 'mail'), p = this._read(c.entity_parcel, 'parcel');
      const mail = !!(m && m.mail || p && p.mail), parcel = !!(m && m.parcel || p && p.parcel);
      // porte avant (entity_door) et porte arrière (entity_door_back, double porte) : « ouverte » = on / open / unlocked…
      const isOpen = (id) => { const d = this._st(id); return this._ok(d) && (ON_RE.test(String(d.state)) || String(d.state).toLowerCase() === 'unlocked'); };
      const opened = isOpen(c.entity_door), openedBack = isOpen(c.entity_door_back);
      // nombre de lettres : entity_count, sinon l'état numérique de entity_mail
      const cs = this._st(c.entity_count);
      let count = this._ok(cs) ? parseFloat(String(cs.state).replace(',', '.')) : m ? m.n : NaN;
      if (!isFinite(count)) count = NaN;
      const boks = this._boks(), noSensor = boks && !c.entity_mail && !c.entity_parcel;
      // BOKS sans capteur de courrier : la porte suffit à rendre la carte utilisable
      const usable = [c.entity_mail, c.entity_parcel, ...(noSensor ? [c.entity_door] : [])].some((i) => this._ok(this._st(i)));
      const st = !usable ? 'unavailable' : noSensor ? 'shut' : mail && parcel ? 'both' : parcel ? 'parcel' : mail ? 'mail' : 'empty';
      // dernier dépôt : changement le plus récent des entités qui annoncent du courrier
      const full = [[c.entity_mail, m], [c.entity_parcel, p]].filter(([, r]) => r && (r.mail || r.parcel)).map(([i]) => this._st(i));
      const last = full.reduce((a, s) => Math.max(a, Date.parse(s.last_changed) || 0), 0);
      // dernière ouverture : la plus récente des dates (sensor timestamp) de entity_last_open, une ou plusieurs
      const lastOpen = this._ids(c.entity_last_open).map((i) => this._st(i)).filter((x) => this._ok(x)).reduce((a, x) => Math.max(a, Date.parse(x.state) || 0), 0);
      const bl = this._st(c.entity_battery_low), batLow = this._ok(bl) && ON_RE.test(String(bl.state));
      const bbl = this._st(c.entity_battery_back_low), batBackLow = this._ok(bbl) && ON_RE.test(String(bbl.state)); // pile faible du capteur de la porte arrière
      return { st, mail, parcel, opened, openedBack, count, last, lastOpen, batLow, batBackLow };
    }

    _boks() { return String(this._c.box_model || '').toLowerCase() === 'boks'; }
    _ids(v) { return (Array.isArray(v) ? v : v ? String(v).split(',') : []).map((x) => String(x).trim()).filter(Boolean); }
    // « Ouvrir la porte » : l'action dépend du domaine de entity_open
    _openDoor() {
      const id = this._c.entity_open; if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const call = { button: ['button', 'press'], input_button: ['input_button', 'press'], lock: ['lock', 'unlock'], script: ['script', 'turn_on'],
        switch: ['switch', 'turn_on'], input_boolean: ['input_boolean', 'turn_on'], automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'] }[dom] || ['homeassistant', 'turn_on'];
      this._hass.callService(call[0], call[1], { entity_id: id });
    }

    _doorTxt(id, open) { return !this._ok(this._st(id)) ? '--' : open ? this._t('open_short') : this._t('closed'); }

    _when(t) {
      if (!t) return '--';
      const d = new Date(t), now = new Date(), loc = this._lang();
      const time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
      if (d.toDateString() === now.toDateString()) return time;
      return `${d.toLocaleDateString(loc, { day: 'numeric', month: 'short' })} ${time}`;
    }

    // « relevé » : l'action dépend du domaine de entity_reset
    _collect() {
      const id = this._c.entity_reset; if (!this._hass || !id) return;
      const dom = id.split('.')[0];
      const call = { button: ['button', 'press'], input_button: ['input_button', 'press'], counter: ['counter', 'reset'], script: ['script', 'turn_on'],
        automation: ['automation', 'trigger'], scene: ['scene', 'turn_on'], input_boolean: ['input_boolean', 'turn_off'], switch: ['switch', 'turn_off'],
        input_number: ['input_number', 'set_value'], input_select: ['input_select', 'select_first'] }[dom] || ['homeassistant', 'turn_off'];
      this._hass.callService(call[0], call[1], dom === 'input_number' ? { entity_id: id, value: 0 } : { entity_id: id });
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mbtitle"></div><div class="badge" id="mbbadge"></div></div>
        <div class="scene">${(this._boks() ? SVG_BOKS : SVG)(this._c.name || this._t('name'))}<div class="count" id="mbcount"></div></div>
        <div class="ctl" id="mbctl"><button id="mbcollect"><ha-icon icon="mdi:email-check-outline"></ha-icon><span></span></button><button id="mbopen"><ha-icon icon="mdi:door-open"></ha-icon><span></span></button></div>
        ${[TILES.slice(0, 4), TILES.slice(4)].map((row, i) => `<div class="tiles" id="mbrow${i}">${row.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${window.applianceIcon(this._c, k, ic)}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>`).join('')}
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('.scene'), () => this._more(this._c.entity_mail || this._c.entity_parcel || this._c.entity_door));
      root.querySelector('#mbcollect').addEventListener('click', () => this._collect());
      root.querySelector('#mbopen').addEventListener('click', () => this._openDoor());
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ last: c.entity_mail || c.entity_parcel, count: c.entity_count || c.entity_mail, battery: c.entity_battery, battery_back: c.entity_battery_back, door_front: c.entity_door, door_back: c.entity_door_back, last_open: this._ids(c.entity_last_open)[0], presence: c.entity_presence }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, opened, openedBack, count, last, lastOpen, batLow, batBackLow } = this._compute();
      card.className = `${st}${opened ? ' opened' : ''}${opened || openedBack ? ' door_open' : ''}${batLow || batBackLow ? ' batlow' : ''}${c.animations === false ? ' noanim' : ''}`;
      // couleur : nom connu ou #hex (nuances dérivées par color-mix)
      const col = COLORS[String(c.box_color || '').toLowerCase()];
      const hex = !col && /^#[0-9a-f]{3,8}$/i.test(String(c.box_color)) ? c.box_color : null;
      const [c0, c1, c2] = col || (hex ? [`color-mix(in srgb,${hex} 55%,#000)`, hex, `color-mix(in srgb,${hex} 70%,#fff)`] : COLORS.anthracite);
      card.style.setProperty('--mb-c0', c0); card.style.setProperty('--mb-c1', c1); card.style.setProperty('--mb-c2', c2);

      r.getElementById('mbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('mbbadge');
      // avec une 2e porte, le badge dit laquelle est ouverte
      const dbl = !!c.entity_door_back;
      badge.textContent = opened && openedBack ? this._t('open_both') : opened ? this._t(dbl ? 'open_front' : 'open') : openedBack ? this._t('open_back') : this._t(st === 'shut' ? 'closed' : st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const cnt = r.getElementById('mbcount'), showN = !isNaN(count) && count > 0;
      cnt.textContent = showN ? String(Math.round(count)) : '';
      cnt.classList.toggle('on', showN && (st === 'mail' || st === 'both' || !c.entity_mail));

      const ctl = r.getElementById('mbctl'), btn = r.getElementById('mbcollect'), ob = r.getElementById('mbopen');
      ctl.classList.toggle('hide', !(c.entity_reset || c.entity_open) || c.show_buttons === false);
      btn.classList.toggle('hide', !c.entity_reset);
      btn.querySelector('span').textContent = this._t('collect');
      btn.disabled = !this._st(c.entity_reset) || st === 'empty';
      ob.classList.toggle('hide', !c.entity_open);
      ob.querySelector('span').textContent = this._t('open_door');
      // un bouton vaut « unknown » tant qu'il n'a jamais été pressé : seul « unavailable » (ou une entité absente) le grise
      const os = this._st(c.entity_open); ob.disabled = !os || /^unavailable$/i.test(String(os.state));

      const bat = this._st(c.entity_battery), batV = this._ok(bat) ? parseFloat(bat.state) : NaN;
      const bat2 = this._st(c.entity_battery_back), batBackV = this._ok(bat2) ? parseFloat(bat2.state) : NaN;
      const V = {
        last: [c.entity_mail || c.entity_parcel, st === 'empty' || st === 'unavailable' ? '--' : this._when(last), ''],
        count: [c.entity_count, isNaN(count) ? '--' : String(Math.round(count)), ''],
        battery: [c.entity_battery, isNaN(batV) ? '--' : String(Math.round(batV)), '%'],
        battery_back: [c.entity_battery_back, isNaN(batBackV) ? '--' : String(Math.round(batBackV)), '%'],
        // tuiles des portes : seulement si une porte arrière est configurée
        door_front: [dbl && c.entity_door, this._doorTxt(c.entity_door, opened), ''],
        door_back: [c.entity_door_back, this._doorTxt(c.entity_door_back, openedBack), ''],
        last_open: [this._ids(c.entity_last_open)[0], this._when(lastOpen), ''],
        // capteur de présence / mouvement : « Détectée » tant qu'il est actif, « Aucune » sinon
        presence: [c.entity_presence, !this._ok(this._st(c.entity_presence)) ? '--' : ON_RE.test(String(this._st(c.entity_presence).state)) ? this._t('detected') : this._t('none'), ''],
      };
      TILES.forEach(([k, defIcon, opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'battery' && (batV < 20 || batLow) || k === 'battery_back' && (batBackV < 20 || batBackLow) || k === 'door_front' && opened || k === 'door_back' && openedBack);
        el.querySelector('.lbl').textContent = this._l(k);
        // icône perso (option `icons`), sinon celle par défaut ; les portes gardent leur icône selon l'état
        el.querySelector('ha-icon').setAttribute('icon', window.applianceIcon(c, k, defIcon));
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        // icône des portes selon l'état : porte ouverte / porte fermée
        // (sauf si l'utilisateur a choisi son icône dans `icons`)
        if ((k === 'door_front' || k === 'door_back') && window.applianceIcon(c, k, '') === '') {
          const o = k === 'door_front' ? opened : openedBack;
          el.querySelector('ha-icon').setAttribute('icon', !this._ok(this._st(show)) ? 'mdi:door' : o ? 'mdi:door-open' : 'mdi:door-closed');
        }
      });
      // 2 lignes : dépôt / lettres / batterie, puis porte avant / porte arrière / dernière ouverture ; une ligne vide est masquée
      [0, 1].forEach((i) => { const row = r.getElementById('mbrow' + i); row.classList.toggle('hide', !row.querySelector('.tile:not(.hide)')); });
    }
  }
  customElements.define(TAG, ApplianceMailboxCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMailboxCardEditor extends HTMLElement {
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
      const ent = (name, domain, extra) => ({ name, selector: { entity: { ...(domain ? { domain } : {}), ...(extra || {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const tr = T[window.applianceLang(T, null, this._hass)] || T.en;
      this._form.hass = this._hass;
      // entity_last_open : une entité ou une liste ; le sélecteur multiple attend un array
      const lo = this._c && this._c.entity_last_open;
      this._form.data = { ...this._c, entity_last_open: Array.isArray(lo) ? lo : lo ? String(lo).split(',').map((x) => x.trim()).filter(Boolean) : [] };
      const boks = String(this._c && this._c.box_model || '').toLowerCase() === 'boks';
      this._form.schema = [
        { name: 'box_model', selector: { select: { mode: 'dropdown', options: [{ value: 'standard', label: tr.model_standard || 'Standard' }, { value: 'boks', label: tr.model_boks || 'BOKS' }] } } },
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'icons', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity_mail', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number', 'input_select', 'input_text', 'event']),
        ent('entity_parcel', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number']),
        ent('entity_door', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_door_back', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_count', ['sensor', 'counter', 'input_number']),
        ent('entity_reset', ['button', 'input_button', 'input_boolean', 'switch', 'counter', 'script', 'automation', 'scene', 'input_number']),
        ent('entity_battery', 'sensor'),
        ent('entity_battery_low', ['binary_sensor', 'input_boolean']),
        ent('entity_presence', ['binary_sensor', 'input_boolean']),
        ent('entity_battery_back', 'sensor'),
        ent('entity_battery_back_low', ['binary_sensor', 'input_boolean']),
        ent('entity_open', ['button', 'input_button', 'lock', 'script', 'switch', 'input_boolean']),
        ent('entity_last_open', 'sensor', { multiple: true }),
        { type: 'grid', name: '', schema: [{ name: 'mail_states', selector: { text: {} } }, { name: 'parcel_states', selector: { text: {} } }] },
        ...(boks ? [] : [{ name: 'box_color', selector: { select: { mode: 'dropdown', custom_value: true, options: Object.keys(COLORS).map((value) => ({ value, label: tr['color_' + value] || value })) } } }]),
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_count'), bool('show_battery'), bool('show_battery_back'), bool('show_presence'), bool('show_buttons'), bool('show_doors'), bool('show_last_open'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMailboxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Boîte aux lettres animée : courrier, colis, porte ouverte, compteur, dernier dépôt et bouton « relevé ».', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/mailbox.md',
  });
})();
