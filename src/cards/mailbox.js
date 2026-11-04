/* Carte « Boîte aux lettres » — custom:appliance-mailbox-card
 * Boîte aux lettres vue de trois quarts. Courrier : une lettre tombe par la fente et le volet claque ;
 * colis : un carton rebondit au pied de la boîte ; porte ouverte : la porte pivote sur sa charnière.
 * Générique : fonctionne avec un capteur par type (entity_mail / entity_parcel), ou un seul capteur dont l'état
 * est un texte (« lettre », « colis », « vide »…) ou un nombre (lettres reçues). Tous les autres capteurs sont optionnels :
 * porte avant (entity_door) et porte arrière (entity_door_back, boîtes à double porte), compteur (entity_count), batterie, et une entité pour marquer le courrier comme relevé (entity_reset).
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
.ctl{display:flex;justify-content:center;margin-top:6px}.ctl.hide{display:none}
.ctl button{display:flex;align-items:center;gap:4px;border:0;border-radius:10px;padding:6px 14px;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button ha-icon{--mdc-icon-size:16px}
.ctl button:disabled{opacity:.5;cursor:default}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
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

  const TILES = [['last', 'mdi:clock-outline', 'show_since'], ['count', 'mdi:email-multiple-outline', 'show_count'], ['battery', 'mdi:battery', 'show_battery'],
    ['door_front', 'mdi:door', 'show_doors'], ['door_back', 'mdi:door', 'show_doors']]; // les 3 premières : 1re ligne, les portes : 2e ligne

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
      this._c = { show_status: true, show_since: true, show_count: true, show_battery: true, show_buttons: true, show_doors: true, box_color: 'anthracite', ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c) this._render(); }, 60000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { let l = (this._c.language || (this._hass && (this._hass.locale?.language || this._hass.language)) || 'en'); if (!T[l]) l = l.slice(0, 2); if (l === 'no' || l === 'nn') l = 'nb'; return T[l] ? l : 'en'; }
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
      const usable = [c.entity_mail, c.entity_parcel].some((i) => this._ok(this._st(i)));
      const st = !usable ? 'unavailable' : mail && parcel ? 'both' : parcel ? 'parcel' : mail ? 'mail' : 'empty';
      // dernier dépôt : changement le plus récent des entités qui annoncent du courrier
      const full = [[c.entity_mail, m], [c.entity_parcel, p]].filter(([, r]) => r && (r.mail || r.parcel)).map(([i]) => this._st(i));
      const last = full.reduce((a, s) => Math.max(a, Date.parse(s.last_changed) || 0), 0);
      return { st, mail, parcel, opened, openedBack, count, last };
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
        <div class="scene">${SVG(this._c.name || this._t('name'))}<div class="count" id="mbcount"></div></div>
        <div class="ctl" id="mbctl"><button><ha-icon icon="mdi:email-check-outline"></ha-icon><span></span></button></div>
        ${[TILES.slice(0, 3), TILES.slice(3)].map((row, i) => `<div class="tiles" id="mbrow${i}">${row.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>`).join('')}
      </ha-card>`;
      root.querySelector('.scene').addEventListener('click', () => this._more(this._c.entity_mail || this._c.entity_parcel || this._c.entity_door));
      root.querySelector('#mbctl button').addEventListener('click', () => this._collect());
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c; this._more({ last: c.entity_mail || c.entity_parcel, count: c.entity_count || c.entity_mail, battery: c.entity_battery, door_front: c.entity_door, door_back: c.entity_door_back }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { st, opened, openedBack, count, last } = this._compute();
      card.className = `${st}${opened ? ' opened' : ''}${opened || openedBack ? ' door_open' : ''}${c.animations === false ? ' noanim' : ''}`;
      // couleur : nom connu ou #hex (nuances dérivées par color-mix)
      const col = COLORS[String(c.box_color || '').toLowerCase()];
      const hex = !col && /^#[0-9a-f]{3,8}$/i.test(String(c.box_color)) ? c.box_color : null;
      const [c0, c1, c2] = col || (hex ? [`color-mix(in srgb,${hex} 55%,#000)`, hex, `color-mix(in srgb,${hex} 70%,#fff)`] : COLORS.anthracite);
      card.style.setProperty('--mb-c0', c0); card.style.setProperty('--mb-c1', c1); card.style.setProperty('--mb-c2', c2);

      r.getElementById('mbtitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('mbbadge');
      // avec une 2e porte, le badge dit laquelle est ouverte
      const dbl = !!c.entity_door_back;
      badge.textContent = opened && openedBack ? this._t('open_both') : opened ? this._t(dbl ? 'open_front' : 'open') : openedBack ? this._t('open_back') : this._t(st);
      badge.style.display = c.show_status === false ? 'none' : '';
      const cnt = r.getElementById('mbcount'), showN = !isNaN(count) && count > 0;
      cnt.textContent = showN ? String(Math.round(count)) : '';
      cnt.classList.toggle('on', showN && (st === 'mail' || st === 'both' || !c.entity_mail));

      const ctl = r.getElementById('mbctl'), btn = ctl.querySelector('button');
      ctl.classList.toggle('hide', !c.entity_reset || c.show_buttons === false);
      btn.querySelector('span').textContent = this._t('collect');
      btn.disabled = !this._st(c.entity_reset) || st === 'empty';

      const bat = this._st(c.entity_battery), batV = this._ok(bat) ? parseFloat(bat.state) : NaN;
      const V = {
        last: [c.entity_mail || c.entity_parcel, st === 'empty' || st === 'unavailable' ? '--' : this._when(last), ''],
        count: [c.entity_count, isNaN(count) ? '--' : String(Math.round(count)), ''],
        battery: [c.entity_battery, isNaN(batV) ? '--' : String(Math.round(batV)), '%'],
        // tuiles des portes : seulement si une porte arrière est configurée
        door_front: [dbl && c.entity_door, this._doorTxt(c.entity_door, opened), ''],
        door_back: [c.entity_door_back, this._doorTxt(c.entity_door_back, openedBack), ''],
      };
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('bad', k === 'battery' && batV < 20 || k === 'door_front' && opened || k === 'door_back' && openedBack);
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
        // icône des portes selon l'état : porte ouverte / porte fermée
        if (k === 'door_front' || k === 'door_back') {
          const o = k === 'door_front' ? opened : openedBack;
          el.querySelector('ha-icon').setAttribute('icon', !this._ok(this._st(show)) ? 'mdi:door' : o ? 'mdi:door-open' : 'mdi:door-closed');
        }
      });
      // 2 lignes : dépôt / lettres / batterie, puis porte avant / porte arrière ; une ligne vide est masquée
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
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      const lang = this._hass && (this._hass.locale?.language || this._hass.language) || 'en';
      const tr = T[lang] || T[String(lang).slice(0, 2)] || T.en;
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('entity_mail', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number', 'input_select', 'input_text', 'event']),
        ent('entity_parcel', ['binary_sensor', 'input_boolean', 'sensor', 'switch', 'counter', 'input_number']),
        ent('entity_door', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_door_back', ['binary_sensor', 'input_boolean', 'cover', 'lock']),
        ent('entity_count', ['sensor', 'counter', 'input_number']),
        ent('entity_reset', ['button', 'input_button', 'input_boolean', 'switch', 'counter', 'script', 'automation', 'scene', 'input_number']),
        ent('entity_battery', 'sensor'),
        { type: 'grid', name: '', schema: [{ name: 'mail_states', selector: { text: {} } }, { name: 'parcel_states', selector: { text: {} } }] },
        { name: 'box_color', selector: { select: { mode: 'dropdown', custom_value: true, options: Object.keys(COLORS).map((value) => ({ value, label: tr['color_' + value] || value })) } } },
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_since'), bool('show_count'), bool('show_battery'), bool('show_buttons'), bool('show_doors'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMailboxCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`,
    description: 'Boîte aux lettres animée : courrier, colis, porte ouverte, compteur, dernier dépôt et bouton « relevé ».', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/mailbox.md',
  });
})();
