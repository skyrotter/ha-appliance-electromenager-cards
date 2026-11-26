/* Carte « Minuteur de cuisine » — custom:appliance-kitchen-timer-card
 * Minuteur de cuisine piloté par une entité timer.* de Home Assistant (donc il survit au rechargement de la page et peut déclencher des automatisations
 * à la fin) : cadran rond avec anneau qui se vide, temps restant au centre, boutons démarrer / pause / reprendre / annuler et durées prédéfinies
 * (presets, en minutes). À la fin, la cloche sonne (se secoue) et « Terminé » clignote jusqu'au prochain appui.
 * Plusieurs timers sur la même carte (entities: [timer.four, timer.plaque]) : un cadran par timer, côte à côte, chacun avec ses boutons.
 * États du timer : idle (prêt, affiche la durée), active (décompte local à la seconde d'après finishes_at), paused (reste le temps restant).
 */
(() => {
  const TAG = 'appliance-kitchen-timer-card';
  if (customElements.get(TAG)) return;

  const T = /*@i18n kitchen_timer*/{};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const fin = (v) => typeof v === 'number' && Number.isFinite(v);
  const CIRC = 2 * Math.PI * 78;

  const CSS = `
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--kt-run:#ff7043;--kt-pause:#f9a825;--kt-done:var(--appliance-alert-color,#e53935)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--kt-c) 22%,transparent);color:var(--kt-c)}
.tms{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:6px}
.tm{--kt-c:#8a929a;min-width:0;display:flex;flex-direction:column;align-items:center}
.tm.active{--kt-c:var(--kt-run)}.tm.paused{--kt-c:var(--kt-pause)}.tm.done{--kt-c:var(--kt-done)}.tm.idle{--kt-c:var(--primary-color,#03a9f4)}
.tm .lab{display:flex;align-items:center;gap:6px;max-width:100%;font-size:13px;font-weight:600;color:var(--primary-text-color)}.tm .lab span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.multi .tm .lab .badge{font-size:10px;padding:1px 6px}
svg.dial{display:block;width:calc(100% * var(--illus-scale,1));max-width:calc(210px * var(--illus-scale,1));height:auto;margin:4px auto 2px;cursor:pointer;overflow:visible}
.body{fill:var(--card-background-color,#fff);stroke:rgba(127,127,127,.35);stroke-width:2}
.track{fill:none;stroke:rgba(127,127,127,.18);stroke-width:9}.prog{fill:none;stroke:var(--kt-c);stroke-width:9;stroke-linecap:round;transition:stroke .4s}
.tick{stroke:rgba(127,127,127,.5);stroke-width:2;stroke-linecap:round}
.digits{font:700 38px ui-monospace,"SF Mono",Menlo,Consolas,monospace;fill:var(--primary-text-color);text-anchor:middle;letter-spacing:-1px}
.sub{font:600 11px system-ui,sans-serif;fill:var(--kt-c);text-anchor:middle;letter-spacing:.8px;text-transform:uppercase}
.bell{transform-box:fill-box;transform-origin:50% 0;opacity:0;transition:opacity .3s}
.done .bell{opacity:1;animation:ktring .5s ease-in-out infinite}.done .digits{animation:ktblink 1s steps(1) infinite}
.noanim *{animation:none!important}
.ctl{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:6px}
button{font:inherit;cursor:pointer;border:0;border-radius:18px;padding:7px 16px;font-size:13px;font-weight:600;color:var(--primary-text-color);background:var(--secondary-background-color,rgba(127,127,127,.15));display:inline-flex;align-items:center;gap:6px}
button ha-icon{--mdc-icon-size:18px}button.main{background:var(--kt-c);color:#fff}button:disabled{opacity:.4;cursor:default}button.hide{display:none}
.presets{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:10px}.presets.hide{display:none}
.presets button{padding:5px 12px;font-size:12px;font-weight:600;border-radius:14px;background:var(--ac-tile-bg,rgba(127,127,127,.12))}
@keyframes ktring{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}@keyframes ktblink{50%{opacity:.25}}
`;

  // « H:MM:SS » (durée d'un timer HA) → secondes
  const secs = (s) => { const m = String(s || '').match(/^(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)$/); return m ? (+(m[1] || 0)) * 3600 + (+m[2]) * 60 + parseFloat(m[3]) : NaN; };
  const hms = (n) => { n = Math.max(0, Math.round(n)); return `${String(Math.floor(n / 3600)).padStart(2, '0')}:${String(Math.floor(n % 3600 / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`; };
  const clock = (n) => { n = Math.max(0, Math.ceil(n)); const h = Math.floor(n / 3600), m = Math.floor(n % 3600 / 60), s = n % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
  const TICKS = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r1 = 93, r2 = i % 3 === 0 ? 87 : 90; return `<path class="tick" d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * r2).toFixed(1)} ${(-Math.cos(a) * r2).toFixed(1)}"/>`; }).join('');

  class ApplianceKitchenTimerCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) { return { entity: Object.keys((hass && hass.states) || {}).find((i) => i.startsWith('timer.')) || '' }; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      const list = this._parse(c);
      if (!list.length) throw new Error('A timer entity is required (entity: timer.… or entities: [timer.…, timer.…])');
      this._c = { show_presets: true, ...c };
      this._list = list; this._built = false; this._st = [];
      if (this._hass) this._render();
    }
    // entity (un timer) ou entities (plusieurs : « timer.x » ou { entity, name, presets })
    _parse(c) {
      const raw = Array.isArray(c.entities) && c.entities.length ? c.entities : c.entity ? [c.entity] : [];
      return raw.map((x) => (typeof x === 'string' ? { entity: x } : x && x.entity ? x : null)).filter(Boolean).slice(0, 6);
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c && this._built) this._paint(); }, 1000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 4 + this._list.length; }
    getGridOptions() { return { columns: this._list && this._list.length > 1 ? 12 : 6, min_columns: 3, rows: 'auto', min_rows: 2 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _presets(it) { const raw = Array.isArray(it.presets) ? it.presets : this._c.presets; const p = Array.isArray(raw) ? raw.map(Number).filter((x) => x > 0 && x <= 1440) : [1, 5, 10, 15, 30]; return p.slice(0, 8); }
    _call(id, service, data = {}) { this._hass.callService('timer', service, { entity_id: id, ...data }); }
    _more(id) { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }

    // état d'un timer : { state, total, left }
    _info(id) {
      const s = this._hass.states[id], a = (s && s.attributes) || {};
      if (!s || /^(unavailable|unknown)$/i.test(String(s.state))) return { state: 'unavailable', total: NaN, left: NaN };
      const total = secs(a.duration), st = String(s.state);
      const left = st === 'active' ? Math.max(0, (Date.parse(a.finishes_at) - Date.now()) / 1000) : st === 'paused' ? secs(a.remaining) : total;
      return { state: st, total, left };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' }), multi = this._list.length > 1;
      root.innerHTML = `<style>${CSS}</style><ha-card class="${multi ? 'multi' : ''}">
        <div class="head"><div class="title" id="kttitle"></div></div>
        <div class="tms">${this._list.map((it, i) => `<div class="tm" data-i="${i}">
          ${multi ? '<div class="lab"><span class="nm"></span><span class="badge"></span></div>' : ''}
          <svg class="dial" viewBox="-100 -100 200 200" role="img">
            <circle class="body" r="98"/>${TICKS}<circle class="track" r="78"/><circle class="prog" r="78" transform="rotate(-90)" stroke-dasharray="0 ${CIRC.toFixed(1)}"/>
            <g class="bell"><path d="M-9 -52c0-9 4-14 9-14s9 5 9 14c0 8 4 10 6 13h-30c2-3 6-5 6-13z" fill="var(--kt-c)"/><circle cx="0" cy="-37" r="3" fill="var(--kt-c)"/></g>
            <text class="digits" x="0" y="14"></text><text class="sub" x="0" y="40"></text></svg>
          <div class="ctl"><button class="main"><ha-icon icon="mdi:play"></ha-icon><span class="ml"></span></button><button class="cancel"><ha-icon icon="mdi:stop"></ha-icon><span class="cl"></span></button></div>
          <div class="presets"></div></div>`).join('')}</div></ha-card>`;
      if (!multi) { const hd = root.querySelector('.head'); hd.insertAdjacentHTML('beforeend', '<div class="badge" id="ktbadge"></div>'); }
      this._list.forEach((it, i) => {
        const el = root.querySelector(`.tm[data-i="${i}"]`);
        window.applianceBindIllus(this, el.querySelector('svg.dial'), () => this._more(it.entity));
        el.querySelector('.main').addEventListener('click', () => { const st = this._info(it.entity).state; this._stt(i).done = 0; this._call(it.entity, st === 'active' ? 'pause' : 'start'); }); // idle : durée du timer ; paused : reprend
        el.querySelector('.cancel').addEventListener('click', () => { const x = this._stt(i); x.done = 0; x.skip = true; this._call(it.entity, 'cancel'); });
      });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }
    _stt(i) { return (this._st[i] = this._st[i] || { prev: undefined, done: 0, skip: false }); }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, multi = this._list.length > 1;
      r.getElementById('kttitle').textContent = c.name || (multi ? this._t('name') : '');
      r.querySelector('.head').style.display = c.name || multi || true ? '' : 'none';
      this._list.forEach((it, i) => {
        const el = r.querySelector(`.tm[data-i="${i}"]`), pre = el.querySelector('.presets'), list = this._presets(it), s = this._hass.states[it.entity];
        if (multi) el.querySelector('.nm').textContent = it.name || (s && s.attributes && s.attributes.friendly_name) || it.entity;
        else if (!c.name) r.getElementById('kttitle').textContent = it.name || (s && s.attributes && s.attributes.friendly_name) || this._t('name');
        pre.classList.toggle('hide', c.show_presets === false || !list.length);
        if (pre.dataset.k !== list.join(',')) {
          pre.dataset.k = list.join(',');
          pre.innerHTML = list.map((m) => `<button data-m="${m}">${m >= 60 && m % 60 === 0 ? `${m / 60} h` : `${m} ${esc(this._t('min'))}`}</button>`).join('');
          pre.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { this._stt(i).done = 0; this._call(it.entity, 'start', { duration: hms(+b.dataset.m * 60) }); }));
        }
        el.querySelector('.cl').textContent = this._t('cancel');
      });
      this._paint();
    }

    // partie animée (rappelée chaque seconde) : temps restant, anneau, boutons, état « terminé »
    _paint() {
      const r = this._root, c = this._c, now = Date.now(), multi = this._list.length > 1;
      this._card.classList.toggle('noanim', c.animations === false);
      this._list.forEach((it, i) => {
        const el = r.querySelector(`.tm[data-i="${i}"]`), x = this._stt(i), I = this._info(it.entity);
        // fin de décompte : active → idle (une annulation volontaire ne sonne pas)
        if (x.prev === 'active' && I.state === 'idle') { if (x.skip) x.skip = false; else x.done = now; }
        if (x.prev === 'active' && I.state === 'active' && I.left <= 0) x.done = now;
        x.prev = I.state;
        const done = x.done && now - x.done < 120000 && I.state !== 'active' && I.state !== 'paused';
        el.className = `tm ${I.state === 'unavailable' ? '' : done ? 'done' : I.state}`;
        const total = fin(I.total) && I.total > 0 ? I.total : NaN, left = fin(I.left) ? I.left : NaN;
        const frac = I.state === 'idle' ? 1 : fin(total) && fin(left) ? Math.max(0, Math.min(1, left / total)) : 0;
        el.querySelector('.prog').setAttribute('stroke-dasharray', `${(done ? CIRC : frac * CIRC).toFixed(1)} ${CIRC.toFixed(1)}`);
        el.querySelector('.digits').textContent = I.state === 'unavailable' ? '--:--' : done ? '00:00' : fin(left) ? clock(left) : '--:--';
        const label = I.state === 'unavailable' ? 'unavailable' : done ? 'done' : ({ idle: 'ready', active: 'running', paused: 'paused' })[I.state] || 'ready';
        el.querySelector('.sub').textContent = this._t(label);
        if (multi) el.querySelector('.lab .badge').textContent = this._t(label); else r.getElementById('ktbadge').textContent = this._t(label);
        if (!multi) r.getElementById('ktbadge').style.cssText = `--kt-c:${getComputedStyle(el).getPropertyValue('--kt-c')}`;
        const main = el.querySelector('.main');
        el.querySelector('.main ha-icon').setAttribute('icon', I.state === 'active' ? 'mdi:pause' : 'mdi:play');
        el.querySelector('.ml').textContent = this._t(I.state === 'active' ? 'pause' : I.state === 'paused' ? 'resume' : 'start');
        main.disabled = I.state === 'unavailable'; el.querySelector('.cancel').classList.toggle('hide', I.state === 'idle' || I.state === 'unavailable');
      });
    }
  }
  customElements.define(TAG, ApplianceKitchenTimerCard);

  /* ---- éditeur visuel ---- */
  class ApplianceKitchenTimerCardEditor extends HTMLElement {
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
      const tr = { ...T.en, ...T[window.applianceLang(T, this._c, this._hass)] };
      this._form.hass = this._hass; this._form.data = { ...this._c };
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'entity', selector: { entity: { domain: 'timer' } } },
        { name: 'entities', selector: { entity: { domain: 'timer', multiple: true } } },
        { name: 'presets', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ...window.applianceActionFields,
        window.applianceLanguageField(T),
        { type: 'grid', name: '', schema: [{ name: 'show_presets', selector: { boolean: {} }, default: true }, { name: 'animations', selector: { boolean: {} }, default: true }] },
      ];
      this._form.computeLabel = (s) => tr[`f_${s.name}`] || window.applianceEditorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceKitchenTimerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, name: `Appliance – ${T.en.name} / ${T.fr.name}`, names: Object.fromEntries(Object.keys(T).map((l) => [l, T[l].name])),
    description: 'Minuteur de cuisine piloté par une entité timer : cadran avec anneau qui se vide, démarrer / pause / annuler, durées prédéfinies, cloche à la fin.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/kitchen-timer.md',
  });
})();
