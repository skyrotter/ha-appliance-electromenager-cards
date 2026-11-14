/* Carte « Chatière connectée » — custom:appliance-cat-flap-card
 * Chatière à puce (SureFlap / Sure Petcare, Petlibro, Cat Mate…) vue de face : cadre blanc, volet transparent articulé en haut.
 * Quand un animal passe (changement dedans / dehors d'un des animaux, ou capteur de mouvement), le volet se soulève,
 * une tête de chat traverse, les ondes de la puce RFID se propagent depuis la bande d'antenne.
 * Verrouillage : l'entité lock (verrouillée / déverrouillée) et/ou une entité select (unlocked, locked_in, locked_out,
 * locked_all…) dont les options deviennent des boutons, ou trois entités lock (Sure Petcare : « verrouillée », « entrée seule »,
 * « sortie seule » → entity, entity_locked_in, entity_locked_out). Les flèches « entrée » / « sortie » se barrent selon le mode.
 * Animaux : liste pets [{ entity, name, picture }] ; l'état de chaque entité (home / not_home, on / off, inside / outside…)
 * dit s'il est dedans ou dehors. Facultatifs : batterie, couvre-feu, détection d'un intrus, mouvement du volet.
 */
(() => {
  const TAG = 'appliance-cat-flap-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n cat_flap*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML sûr

  const IN_RE = /^(home|inside|in|indoor|indoors|present|on|true|yes|1|dedans|intérieur|interieur|drinnen|innen|thuis|binnen|inne|acasa|дома)$/i;
  const OUT_RE = /^(not_home|away|outside|out|outdoor|outdoors|absent|off|false|no|0|dehors|extérieur|exterieur|draußen|draussen|aussen|außen|buiten|ute|afară|afara|вне)$/i;
  // mode de verrouillage : valeur d'un select ou état d'un lock → locked_all / locked_in (reste dedans) / locked_out (reste dehors) / unlocked
  const kindOf = (v) => {
    const s = String(v ?? '').toLowerCase().replace(/[\s-]+/g, '_');
    if (!s || /^(unavailable|unknown|none_selected)$/.test(s)) return 'unknown';
    if (/^(unlocked|unlock|open|opened|none|off|free|ouvert|déverrouillé|deverrouille|entsperrt)/.test(s)) return 'unlocked';
    if (/curfew|couvre|night/.test(s)) return 'curfew';
    if (/locked_in|keep_in|lock_in|in_only|inside|^in$|enferm/.test(s)) return 'locked_in';
    if (/locked_out|keep_out|lock_out|out_only|outside|^out$/.test(s)) return 'locked_out';
    if (/lock|both|all|closed|ferm|verrouill|gesperrt/.test(s)) return 'locked_all';
    return 'unknown';
  };
  const ICONS = { unlocked: 'mdi:lock-open-variant', locked_all: 'mdi:lock', locked_in: 'mdi:home-lock', locked_out: 'mdi:tree-outline', curfew: 'mdi:moon-waning-crescent', unknown: 'mdi:help-circle-outline' };

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--cf-ok:var(--appliance-ok-color,#43a047);--cf-alert:var(--appliance-alert-color,#db4437);
  --cf-warn:var(--appliance-warn-color,#ffa000);--cf-cold:var(--appliance-cold-color,#2b9af9);--cf-c:#9aa3ad}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
ha-card.unlocked{--cf-c:var(--cf-ok)}ha-card.locked_all{--cf-c:var(--cf-alert)}ha-card.locked_in,ha-card.locked_out{--cf-c:var(--cf-warn)}ha-card.curfew{--cf-c:var(--cf-cold)}
.unlocked .badge,.locked_all .badge,.locked_in .badge,.locked_out .badge,.curfew .badge{background:color-mix(in srgb,var(--cf-c) 22%,transparent);color:var(--cf-c)}
ha-card.intruder{box-shadow:0 0 0 1px color-mix(in srgb,var(--cf-alert) 60%,transparent),0 0 22px color-mix(in srgb,var(--cf-alert) 30%,transparent)}
.alert{display:none;margin-top:2px;font-size:11px;color:var(--cf-alert);font-weight:500;text-align:center}
.alert.on{display:block}.alert.warn{color:var(--cf-warn)}.alert.info{color:var(--secondary-text-color)}
svg{display:block;width:100%;max-width:calc(230px * var(--illus-scale,1));height:auto;margin:2px auto 0;cursor:pointer;overflow:visible}
.pets{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.pets:empty{display:none}
.pet{flex:1 1 92px;max-width:150px;display:flex;align-items:center;gap:6px;background:var(--secondary-background-color);border-radius:12px;padding:4px 8px 4px 4px;cursor:pointer;min-width:0}
.pet .av{flex:none;width:30px;height:30px;border-radius:50%;background:color-mix(in srgb,var(--cf-pc,#9aa3ad) 25%,transparent);color:var(--cf-pc,#9aa3ad);display:flex;align-items:center;justify-content:center;overflow:hidden;--mdc-icon-size:18px}
.pet .av img{width:100%;height:100%;object-fit:cover}
.pet .tx{min-width:0;line-height:15px}.pet .n{font-size:12px;font-weight:600;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pet .s{font-size:10px;color:var(--cf-pc,var(--secondary-text-color));white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pet.in{--cf-pc:var(--cf-ok)}.pet.out{--cf-pc:var(--cf-cold)}.pet.unk{--cf-pc:#9aa3ad}
.ctl{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}.ctl.hide,.ctl button.hide{display:none}
.ctl button{flex:1 1 74px;max-width:130px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;border-radius:10px;padding:6px 8px;cursor:pointer;min-width:0;
  background:var(--secondary-background-color);color:var(--primary-text-color);font:500 12px/16px var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
.ctl button span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ctl button ha-icon{--mdc-icon-size:16px;flex:none}
.ctl button:hover{filter:brightness(1.12)}
.ctl button:disabled{opacity:.4;cursor:default;filter:none}
.ctl button.on{background:color-mix(in srgb,var(--cf-c) 28%,var(--secondary-background-color))}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(68px,1fr));gap:6px;margin-top:6px}
.tile{box-sizing:border-box;display:flex;flex-direction:column;background:var(--ac-tile-bg,rgba(127,127,127,.09));border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center;cursor:pointer}
:host([tile-order="value"]) .tile{flex-direction:column-reverse}:host([tile-order="value"]) .tile .v{margin:0 0 2px}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.hide{display:none}.tile.bad .v{color:var(--cf-alert)}.tile.warn .v{color:var(--cf-warn)}
/* ---- illustration ---- */
.cf-aura{opacity:.5;transition:opacity .6s}.unavailable .cf-aura,.unknown .cf-aura{opacity:0}
.cf-auras{stop-color:var(--cf-c);transition:stop-color .4s}
.cf-band{fill:color-mix(in srgb,var(--cf-c) 35%,#cfd5db);transition:fill .4s}
.unlocked .cf-band,.locked_all .cf-band{animation:cfbeat 4s ease-in-out infinite}
.cf-led{fill:var(--cf-c);transition:fill .4s}
/* panneau : transparent, articulé en haut ; il se soulève au passage d'un animal */
.cf-panel{transform-box:view-box;transform-origin:120px 44px}
.pass-in .cf-panel,.pass-out .cf-panel{animation:cfswing 2.6s ease-in-out}
.moving .cf-panel{animation:cfswing 1.8s ease-in-out infinite}
.cf-cat{opacity:0;transform-box:view-box;transform-origin:120px 112px}
.pass-in .cf-cat{animation:cfcat-in 2.6s ease-in-out both}.pass-out .cf-cat{animation:cfcat-out 2.6s ease-in-out both}
.moving .cf-cat{animation:cfcat-in 1.8s ease-in-out infinite}
/* ondes de la puce RFID */
.cf-ring{fill:none;stroke:var(--cf-c);stroke-width:1.6;opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.pass-in .cf-ring,.pass-out .cf-ring,.moving .cf-ring{animation:cfscan 1.3s ease-out 2}.moving .cf-ring{animation-iteration-count:infinite}
.cf-ring.r2{animation-delay:.3s!important}.cf-ring.r3{animation-delay:.6s!important}
/* flèches entrée / sortie : barrées quand le mode les interdit */
.cf-arrow{fill:none;stroke:var(--cf-ok);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transition:stroke .4s}
.no-in .cf-a-in,.no-out .cf-a-out{stroke:var(--cf-alert);opacity:.7}
.cf-x{stroke:var(--cf-alert);stroke-width:2.2;stroke-linecap:round;opacity:0;transition:opacity .4s}
.no-in .cf-x-in,.no-out .cf-x-out{opacity:1}
.unavailable .cf-arrow,.unknown .cf-arrow{stroke:#9aa3ad}
/* cadenas : verrouillage total */
.cf-padlock{opacity:0;transition:opacity .5s}.locked_all .cf-padlock{opacity:1}
.cf-shackle{fill:none;stroke:#fff;stroke-width:2.6;stroke-linecap:round}
/* couvre-feu (lune), intrus (alerte), batterie faible */
.cf-moon,.cf-warn,.cf-bat{opacity:0}.curfew-on .cf-moon{opacity:1}
.intruder .cf-warn{opacity:1;animation:cfblink 1s infinite}.lowbat .cf-bat{opacity:1;animation:cfblink 1.6s infinite}
.unavailable svg{filter:grayscale(.8) opacity(.6)}
.noanim *{animation:none!important;transition:none!important}
@keyframes cfbeat{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes cfswing{0%,100%{transform:none}22%,68%{transform:scaleY(.2) skewX(-5deg)}}
@keyframes cfcat-in{0%{opacity:0;transform:scale(.5) translateY(6px)}25%,62%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.35) translateY(-4px)}}
@keyframes cfcat-out{0%{opacity:0;transform:scale(1.35) translateY(-4px)}25%,62%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.5) translateY(6px)}}
@keyframes cfscan{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.4,3.2)}}
@keyframes cfblink{50%{opacity:.15}}
`;

  const DEFS = `<radialGradient id="cfaurag"><stop offset="0" class="cf-auras" stop-opacity=".5"/><stop offset=".6" class="cf-auras" stop-opacity=".12"/><stop offset="1" class="cf-auras" stop-opacity="0"/></radialGradient>
    <linearGradient id="cfbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe3e8"/></linearGradient>
    <linearGradient id="cfview" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f2"/><stop offset=".62" stop-color="#d8ecf4"/><stop offset=".62" stop-color="#b9d79a"/><stop offset="1" stop-color="#8fb86e"/></linearGradient>
    <linearGradient id="cfpanel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset=".5" stop-color="#e3f2fa" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity=".6"/></linearGradient>
    <clipPath id="cfwin"><rect x="86" y="42" width="68" height="96" rx="5"/></clipPath>`;

  const SVG = (label) => `<svg viewBox="0 0 240 180" role="img" aria-label="${esc(label)}"><defs>${DEFS}</defs>
      <ellipse class="cf-aura" cx="120" cy="92" rx="108" ry="82" fill="url(#cfaurag)"/>
      <ellipse cx="120" cy="171" rx="54" ry="5" fill="#000" fill-opacity=".16"/>
      <!-- ondes de la puce, au-dessus de la bande d'antenne -->
      ${['', ' r2', ' r3'].map((r) => `<ellipse class="cf-ring${r}" cx="120" cy="23" rx="22" ry="4"/>`).join('')}
      <!-- cadre blanc, petits pieds, bande d'antenne -->
      <rect x="92" y="161" width="14" height="6" rx="2" fill="#cfd4da"/><rect x="134" y="161" width="14" height="6" rx="2" fill="#cfd4da"/>
      <rect x="62" y="12" width="116" height="152" rx="16" fill="url(#cfbody)" stroke="#cfd4da" stroke-width="1.5"/>
      <rect class="cf-band" x="90" y="18" width="60" height="10" rx="4"/>
      <circle class="cf-led" cx="80" cy="23" r="2.4"/><circle class="cf-led" cx="160" cy="23" r="2.4"/>
      <rect x="77" y="34" width="86" height="114" rx="10" fill="#eceff2" stroke="#d0d5da"/>
      <!-- fenêtre : on voit le jardin à travers -->
      <rect x="86" y="42" width="68" height="96" rx="5" fill="url(#cfview)"/>
      <g clip-path="url(#cfwin)">
        <g class="cf-cat"><g transform="translate(120 104)">
          <path d="M-17 -5 L-15 -25 L-5 -15 Q0 -17 5 -15 L15 -25 L17 -5 Q19 9 0 15 Q-19 9 -17 -5Z" fill="#33363d"/>
          <ellipse cx="-6.5" cy="-3" rx="2.8" ry="3.4" fill="#ffd54f"/><ellipse cx="6.5" cy="-3" rx="2.8" ry="3.4" fill="#ffd54f"/>
          <ellipse cx="-6.5" cy="-3" rx="1" ry="2.6" fill="#1b1d22"/><ellipse cx="6.5" cy="-3" rx="1" ry="2.6" fill="#1b1d22"/>
          <path d="M-2 4 H2 L0 6.5Z" fill="#f4a3b0"/><path d="M-13 4 L-24 2 M-13 7 L-24 9 M13 4 L24 2 M13 7 L24 9" stroke="#8d939c" stroke-width="1" stroke-linecap="round"/>
        </g></g>
      </g>
      <!-- volet transparent -->
      <g class="cf-panel"><rect x="88" y="44" width="64" height="92" rx="4" fill="url(#cfpanel)" stroke="#9fb6c4" stroke-width="1.4"/>
        <path d="M95 52 L110 52 L95 70Z" fill="#fff" fill-opacity=".45"/><rect x="88" y="44" width="64" height="5" rx="2" fill="#aebdc7"/></g>
      <g class="cf-padlock"><circle cx="120" cy="92" r="19" fill="#db4437" fill-opacity=".92"/>
        <path class="cf-shackle" d="M112 90 V85 A8 8 0 0 1 128 85 V90"/><rect x="109" y="89" width="22" height="16" rx="3.5" fill="#fff"/><circle cx="120" cy="97" r="2.2" fill="#db4437"/></g>
      <!-- flèches sortie (←) et entrée (→) -->
      <g class="cf-arrows">
        <g><path class="cf-arrow cf-a-out" d="M112 155 H96 M101 150 L96 155 L101 160"/><path class="cf-x cf-x-out" d="M92 150 L116 160"/></g>
        <g><path class="cf-arrow cf-a-in" d="M128 155 H144 M139 150 L144 155 L139 160"/><path class="cf-x cf-x-in" d="M124 150 L148 160"/></g>
      </g>
      <g class="cf-moon"><path d="M36 30 a14 14 0 1 0 14 18 a11 11 0 0 1 -14 -18Z" fill="var(--cf-cold)"/></g>
      <g class="cf-warn"><path d="M212 18 L226 42 H198 Z" fill="#db4437"/><path d="M212 26 V34" stroke="#fff" stroke-width="2.4"/><circle cx="212" cy="38" r="1.4" fill="#fff"/></g>
      <g class="cf-bat"><rect x="14" y="152" width="22" height="12" rx="2" fill="none" stroke="#ffa000" stroke-width="2"/><rect x="36" y="155" width="3" height="6" fill="#ffa000"/><path d="M17 155 h4 v6 h-4z" fill="#ffa000"/></g>
    </svg>`;

  const TILES = [['inside', 'mdi:home', 'show_inside'], ['outside', 'mdi:tree', 'show_outside'], ['battery', 'mdi:battery', 'show_battery'], ['curfew', 'mdi:moon-waning-crescent', 'show_curfew'], ['since', 'mdi:clock-outline', 'show_since']];

  class ApplianceCatFlapCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    // détection automatique : Sure Petcare (3 locks par chatière, un binary_sensor « présence » par animal), select de mode,
    // ou toute entité dont le nom évoque une chatière ; animaux = présence / device_tracker au nom d'animal, ou attribut where
    static getStubConfig(hass) {
      const st = (hass && hass.states) || {}, ids = Object.keys(st), at = (i) => st[i].attributes || {};
      const FLAP = /chati[eè]re|cat_?flap|pet_?door|dog_?door|sure_?flap|petcare|flap|katzenklappe|gattaiola|kattenluik|katteluke/i;
      const key = (i) => { const o = i.split('.')[1], ms = [...o.matchAll(new RegExp(FLAP.source, 'gi'))], m = ms[ms.length - 1]; return m ? o.slice(0, m.index + m[0].length) : ''; };
      const dom = (d) => ids.filter((i) => i.startsWith(d + '.'));
      const locks = dom('lock').filter((i) => FLAP.test(i) || FLAP.test(at(i).friendly_name || ''));
      const sel = dom('select').find((i) => (FLAP.test(i) || /lock.*mode|locking/i.test(i)) && (at(i).options || []).some((o) => /lock|in|out/i.test(o)));
      const ref = locks[0] || sel || ids.find((i) => FLAP.test(i)) || '';
      const pre = key(ref) || (ref.split('.')[1] || '\u0000').replace(/_(locked_(in|out|all)|lock|mode|locking_mode)$/, '');
      const near = (d, re) => dom(d).find((i) => i.split('.')[1].startsWith(pre) && re.test(i)) || '';
      const lIn = locks.find((i) => /locked_in|lock_in|in_only/i.test(i)) || '', lOut = locks.find((i) => /locked_out|lock_out|out_only/i.test(i)) || '';
      const lAll = locks.find((i) => i !== lIn && i !== lOut && (/locked_all|lock_all|_all$/i.test(i) || !/_in$|_out$/.test(i))) || '';
      const pets = ids.filter((i) => /^(binary_sensor|device_tracker)\./.test(i) && !FLAP.test(i) && !/battery|connect|online|problem|motion/i.test(i)
        && (at(i).where != null || (/^(presence|occupancy)$/.test(at(i).device_class || '') && /chat|cat|minou|pet|dog|chien/i.test(i + (at(i).friendly_name || ''))) || (i.startsWith('device_tracker.') && /chat|cat|minou|dog|chien/i.test(i))));
      return {
        entity: lAll || (sel ? '' : locks[0] || ''),
        ...(lIn ? { entity_locked_in: lIn } : {}),
        ...(lOut ? { entity_locked_out: lOut } : {}),
        ...(sel ? { entity_mode: sel } : {}),
        entity_battery: near('sensor', /batter/i) || dom('sensor').find((i) => at(i).device_class === 'battery' && FLAP.test(i)) || '',
        ...(near('binary_sensor', /curfew|couvre/i) ? { entity_curfew: near('binary_sensor', /curfew|couvre/i) } : {}),
        pets: pets.slice(0, 4).map((entity) => ({ entity })),
      };
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { battery_low: 20, show_status: true, show_buttons: true, show_pets: true, show_inside: true, show_outside: true, show_battery: true, show_curfew: true, show_since: true, ...c };
      this._built = false; this._prev = null;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k, v) { let s = T[this._lang()][k] ?? T.en[k] ?? k; if (v) for (const [a, b] of Object.entries(v)) s = s.replace(`{${a}}`, b); return s; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _st(id) { return id && this._hass.states[id]; }
    _ok(s) { return !!s && !/^(unavailable|unknown)$/i.test(String(s.state)); }
    _on(s) { return this._ok(s) && /^(on|true|open|opened|1|yes|low|detected|home)$/i.test(String(s.state)); }
    _num(s) { if (!this._ok(s)) return NaN; const v = parseFloat(String(s.state).replace(',', '.')); return isFinite(v) ? v : NaN; }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    _since(t) {
      if (!t || !isFinite(t)) return '--';
      const sec = Math.max(0, (Date.now() - t) / 1000);
      const [n, u] = sec < 45 ? [0, 'second'] : sec < 3600 ? [Math.max(1, sec / 60), 'minute'] : sec < 86400 ? [sec / 3600, 'hour'] : [sec / 86400, 'day'];
      try { return n ? new Intl.NumberFormat(this._lang(), { style: 'unit', unit: u, unitDisplay: 'short' }).format(Math.floor(n)) : new Intl.RelativeTimeFormat(this._lang(), { numeric: 'auto' }).format(0, 'second'); }
      catch (e) { return `${Math.floor(n)} ${u[0]}`; }
    }
    // animaux : config pets (liste d'objets ou d'identifiants) → { id, name, picture, where: in | out | unk, s }
    _pets() {
      const raw = this._c.pets, list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return list.map((p) => (typeof p === 'string' ? { entity: p } : p)).filter((p) => p && p.entity).map((p) => {
        const s = this._st(p.entity), v = s ? String(s.state) : '';
        const where = !this._ok(s) ? 'unk' : IN_RE.test(v) ? 'in' : OUT_RE.test(v) ? 'out' : 'unk';
        const a = (s && s.attributes) || {};
        return { id: p.entity, name: p.name || a.friendly_name || p.entity.split('.')[1], picture: p.picture || a.entity_picture || '', icon: p.icon, where, s };
      });
    }
    _call(id, option) {
      if (!this._hass || !id) return;
      // trois locks (Sure Petcare) : verrouiller celui du mode choisi, « ouverte » déverrouille ceux qui sont verrouillés
      if (id === 'multi') {
        const c = this._c, L = { locked_all: c.entity, locked_in: c.entity_locked_in, locked_out: c.entity_locked_out };
        if (option !== 'unlocked') return L[option] && this._hass.callService('lock', 'lock', { entity_id: L[option] });
        const on = Object.values(L).filter((e) => e && this._st(e) && this._st(e).state === 'locked');
        if (on.length) this._hass.callService('lock', 'unlock', { entity_id: on });
        return;
      }
      const d = id.split('.')[0];
      if (d === 'select' || d === 'input_select') this._hass.callService(d, 'select_option', { entity_id: id, option });
      else if (d === 'lock') this._hass.callService('lock', option === 'unlocked' ? 'unlock' : 'lock', { entity_id: id });
    }

    _compute() {
      const c = this._c, lockS = this._st(c.entity), modeS = this._st(c.entity_mode);
      // le select (modes fins) prime sur le lock (verrouillé / déverrouillé)
      const src = c.entity_mode && this._ok(modeS) ? modeS : lockS || (!c.entity_mode && this._st(c.entity_locked_in || c.entity_locked_out));
      const dead = !src ? !(c.entity_locked_in || c.entity_locked_out) || !this._ok(this._st(c.entity_locked_in || c.entity_locked_out)) : /^unavailable$/i.test(String(src.state));
      const multi = !c.entity_mode && (c.entity_locked_in || c.entity_locked_out);
      const lk = (e) => { const x = this._st(e); return !!x && String(x.state) === 'locked'; };
      const kind = dead ? 'unavailable' : multi && src === lockS
        ? (lk(c.entity) || (lk(c.entity_locked_in) && lk(c.entity_locked_out)) ? 'locked_all' : lk(c.entity_locked_in) ? 'locked_in' : lk(c.entity_locked_out) ? 'locked_out' : 'unlocked')
        : kindOf(src.state);
      const bS = this._st(c.entity_battery), bat = this._num(bS), batBinary = !!bS && /^binary_sensor\./.test(c.entity_battery);
      const low = (batBinary && this._on(bS)) || (!isNaN(bat) && bat < Number(c.battery_low));
      const curfewS = this._st(c.entity_curfew), curfew = this._on(curfewS) || kind === 'curfew';
      const intruder = this._on(this._st(c.entity_intruder));
      const moving = this._on(this._st(c.entity_motion));
      return { src, kind, bS, bat, batBinary, low, curfewS, curfew, intruder, moving };
    }

    // un animal vient de changer de côté : volet qui se soulève, tête de chat qui traverse (relance l'animation)
    _pass(dir, name) {
      const svg = this._root && this._root.querySelector('svg'); if (!svg) return;
      svg.classList.remove('pass-in', 'pass-out'); void svg.getBoundingClientRect();
      svg.classList.add(`pass-${dir}`);
      clearTimeout(this._passTimer); this._passTimer = setTimeout(() => svg.classList.remove('pass-in', 'pass-out'), 2800);
      this._last = { dir, name, t: Date.now() };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="cftitle"></div><div class="badge" id="cfbadge"></div></div>
        ${SVG(this._c.name || this._t('name'))}
        <div class="alert" id="cfalert"></div>
        <div class="pets" id="cfpets"></div>
        <div class="ctl" id="cfctl"></div>
        <div class="tiles">${TILES.map(([k, ic]) => `<div class="tile hide" data-k="${k}"><div class="l"><ha-icon icon="${ic}"></ha-icon><span class="lbl"></span></div><div class="v"></div></div>`).join('')}</div>
      </ha-card>`;
      window.applianceBindIllus(this, root.querySelector('svg'), () => this._more(this._c.entity_mode || this._c.entity));
      root.querySelectorAll('.tile').forEach((el) => el.addEventListener('click', () => {
        const c = this._c, p = this._pets();
        this._more({ inside: (p.find((x) => x.where === 'in') || p[0] || {}).id, outside: (p.find((x) => x.where === 'out') || p[0] || {}).id,
          battery: c.entity_battery, curfew: c.entity_curfew, since: (this._lastPet || {}).id || c.entity }[el.dataset.k]);
      }));
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card;
      const { src, kind, bS, bat, batBinary, low, curfewS, curfew, intruder, moving } = this._compute();
      const pets = this._pets();

      // passage : un animal a changé de côté depuis le dernier rendu
      if (this._prev) pets.forEach((p) => { const o = this._prev[p.id]; if (o && o !== 'unk' && p.where !== 'unk' && o !== p.where) this._pass(p.where === 'in' ? 'in' : 'out', p.name); });
      this._prev = Object.fromEntries(pets.map((p) => [p.id, p.where]));

      const noIn = kind === 'locked_all' || kind === 'locked_out', noOut = kind === 'locked_all' || kind === 'locked_in';
      card.className = `${kind}${noIn ? ' no-in' : ''}${noOut ? ' no-out' : ''}${curfew ? ' curfew-on' : ''}${intruder ? ' intruder' : ''}${low ? ' lowbat' : ''}${c.animations === false ? ' noanim' : ''}`;
      r.querySelector('svg').classList.toggle('moving', moving);
      r.getElementById('cftitle').textContent = c.name || this._t('name');
      const badge = r.getElementById('cfbadge');
      badge.textContent = this._t(`mode_${kind}`) + (curfew && kind !== 'curfew' ? ` · ${this._t('curfew')}` : '');
      badge.style.display = c.show_status === false ? 'none' : '';

      // alerte : intrus, batterie faible, sinon dernier passage (10 min)
      const al = r.getElementById('cfalert'), L = this._last;
      al.textContent = intruder ? this._t('intruder_detail') : low ? this._t('battery_low') : L && Date.now() - L.t < 600000 ? this._t(`went_${L.dir}`, { n: L.name }) : '';
      al.classList.toggle('on', !!al.textContent);
      al.classList.toggle('warn', !intruder && low); al.classList.toggle('info', !intruder && !low);

      // animaux : pastilles avatar + nom + dedans / dehors
      const box = r.getElementById('cfpets');
      box.style.display = c.show_pets === false ? 'none' : '';
      box.replaceChildren(...pets.map((p) => {
        const el = document.createElement('div'); el.className = `pet ${p.where}`;
        const av = document.createElement('div'); av.className = 'av';
        if (p.picture) { const im = document.createElement('img'); im.src = p.picture; im.alt = ''; av.appendChild(im); }
        else { const ic = document.createElement('ha-icon'); ic.setAttribute('icon', p.icon || 'mdi:cat'); av.appendChild(ic); }
        const tx = document.createElement('div'); tx.className = 'tx';
        const n = document.createElement('div'); n.className = 'n'; n.textContent = p.name;
        const s = document.createElement('div'); s.className = 's'; s.textContent = this._t(p.where === 'in' ? 'inside' : p.where === 'out' ? 'outside' : 'unknown');
        tx.append(n, s); el.append(av, tx);
        el.addEventListener('click', () => this._more(p.id));
        return el;
      }));

      // boutons : une par option du select de mode, sinon Verrouiller / Déverrouiller du lock
      const ctl = r.getElementById('cfctl'), modeS = this._st(c.entity_mode);
      const opts = c.entity_mode && modeS && Array.isArray(modeS.attributes.options) ? modeS.attributes.options.map((o) => ({ id: c.entity_mode, option: o, kind: kindOf(o), label: null }))
        : c.entity_locked_in || c.entity_locked_out ? ['unlocked', c.entity_locked_in && 'locked_in', c.entity_locked_out && 'locked_out', c.entity && 'locked_all'].filter(Boolean).map((k) => ({ id: 'multi', option: k, kind: k }))
        : c.entity ? [{ id: c.entity, option: 'locked_all', kind: 'locked_all' }, { id: c.entity, option: 'unlocked', kind: 'unlocked' }] : [];
      const sig = opts.map((o) => o.option).join('|');
      if (this._sig !== sig) {
        this._sig = sig;
        ctl.replaceChildren(...opts.map((o) => {
          const b = document.createElement('button'); b.dataset.o = o.option;
          const ic = document.createElement('ha-icon'); ic.setAttribute('icon', ICONS[o.kind] || ICONS.unknown);
          const sp = document.createElement('span'); b.append(ic, sp);
          b.addEventListener('click', () => this._call(o.id, o.option));
          return b;
        }));
      }
      ctl.classList.toggle('hide', c.show_buttons === false || !opts.length);
      const human = (o) => { const t = String(o).replace(/_/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
      ctl.querySelectorAll('button').forEach((b, i) => {
        const o = opts[i]; if (!o) return;
        b.querySelector('span').textContent = o.kind !== 'unknown' ? this._t(`mode_${o.kind}`) : human(o.option);
        const cur = c.entity_mode ? modeS && modeS.state === o.option : o.id === 'multi' ? o.kind === kind : (o.kind === 'unlocked' ? kind === 'unlocked' : kind !== 'unlocked' && kind !== 'unavailable' && kind !== 'unknown');
        b.classList.toggle('on', !!cur); b.disabled = kind === 'unavailable' || !!cur;
      });

      // tuiles
      const inside = pets.filter((p) => p.where === 'in'), outside = pets.filter((p) => p.where === 'out');
      const times = pets.map((p) => Date.parse(p.s && p.s.last_changed)).filter((t) => isFinite(t));
      const lastT = times.length ? Math.max(...times) : Date.parse(src && src.last_changed);
      this._lastPet = pets.find((p) => Date.parse(p.s && p.s.last_changed) === lastT);
      const names = (a) => a.map((p) => p.name).join(', ');
      const V = {
        inside: [pets.length, String(inside.length), '', '', names(inside)],
        outside: [pets.length, String(outside.length), '', '', names(outside)],
        battery: [c.entity_battery, !isNaN(bat) && !batBinary ? String(Math.round(bat)) : this._ok(bS) ? this._t(low ? 'low' : 'ok') : '--', !isNaN(bat) && !batBinary ? '%' : '', low ? 'warn' : '', ''],
        curfew: [c.entity_curfew || kind === 'curfew', this._t(curfew ? 'on' : 'off'), '', '', ''],
        since: [src || pets.length, this._since(lastT), '', '', ''],
      };
      r.querySelector('.tile[data-k="battery"] ha-icon').setAttribute('icon', low ? 'mdi:battery-alert' : 'mdi:battery');
      TILES.forEach(([k, , opt]) => {
        const el = r.querySelector(`.tile[data-k="${k}"]`); const [show, val, unit, cls, tip] = V[k];
        el.classList.toggle('hide', !show || c[opt] === false);
        el.classList.toggle('warn', cls === 'warn'); el.title = tip || '';
        el.querySelector('.lbl').textContent = this._l(k);
        const small = document.createElement('small'); small.textContent = unit ?? '';
        el.querySelector('.v').replaceChildren(String(val ?? ''), small);
      });
    }
  }
  customElements.define(TAG, ApplianceCatFlapCard);

  /* ---- éditeur visuel ---- */
  class ApplianceCatFlapCardEditor extends HTMLElement {
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
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'pets', selector: { object: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceTileFields(this._hass),
        ent('entity', ['lock', 'select', 'input_select']),
        ent('entity_locked_in', 'lock'),
        ent('entity_locked_out', 'lock'),
        ent('entity_mode', ['select', 'input_select']),
        ent('entity_motion', 'binary_sensor'),
        ent('entity_curfew', ['binary_sensor', 'switch', 'input_boolean']),
        ent('entity_intruder', 'binary_sensor'),
        ent('entity_battery', ['sensor', 'binary_sensor']),
        { name: 'battery_low', default: 20, selector: { number: { min: 1, max: 100, step: 1, mode: 'box', unit_of_measurement: '%' } } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_pets'), bool('show_buttons'), bool('show_inside'), bool('show_outside'), bool('show_battery'), bool('show_curfew'), bool('show_since'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceCatFlapCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Chatière connectée animée (SureFlap, Sure Petcare…) : animaux dedans / dehors, passages, modes de verrouillage, batterie, couvre-feu.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/cat-flap.md',
  });
})();
