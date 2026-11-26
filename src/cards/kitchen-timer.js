/* Carte « Minuteur de cuisine » — custom:appliance-kitchen-timer-card
 * Minuteur de cuisine piloté par une entité timer.* de Home Assistant (donc il survit au rechargement de la page et peut déclencher des automatisations
 * à la fin) : cadran rond avec anneau qui se vide, temps restant au centre, boutons démarrer / pause / reprendre / annuler et durées prédéfinies
 * (presets, en minutes). À la fin, la cloche sonne (se secoue) et « Terminé » clignote jusqu'au prochain appui.
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
:host{display:block;height:100%}ha-card{height:100%;box-sizing:border-box;display:block;padding:10px 12px 12px;overflow:hidden;--kt-run:#ff7043;--kt-pause:#f9a825;--kt-done:var(--appliance-alert-color,#e53935);--kt-c:#8a929a}
ha-card.active{--kt-c:var(--kt-run)}ha-card.paused{--kt-c:var(--kt-pause)}ha-card.done{--kt-c:var(--kt-done)}ha-card.idle{--kt-c:var(--primary-color,#03a9f4)}
.head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.title{font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;white-space:nowrap;background:color-mix(in srgb,var(--kt-c) 22%,transparent);color:var(--kt-c)}
svg.dial{display:block;width:calc(100% * var(--illus-scale,1));max-width:calc(210px * var(--illus-scale,1));height:auto;margin:6px auto 2px;cursor:pointer;overflow:visible}
.body{fill:var(--card-background-color,#fff);stroke:rgba(127,127,127,.35);stroke-width:2}
.track{fill:none;stroke:rgba(127,127,127,.18);stroke-width:9}.prog{fill:none;stroke:var(--kt-c);stroke-width:9;stroke-linecap:round;transition:stroke .4s}
.tick{stroke:rgba(127,127,127,.5);stroke-width:2;stroke-linecap:round}
.digits{font:700 38px ui-monospace,"SF Mono",Menlo,Consolas,monospace;fill:var(--primary-text-color);text-anchor:middle;letter-spacing:-1px}
.sub{font:600 11px system-ui,sans-serif;fill:var(--kt-c);text-anchor:middle;letter-spacing:.8px;text-transform:uppercase}
.bell{transform-box:fill-box;transform-origin:50% 0;opacity:.0;transition:opacity .3s}
.done .bell{opacity:1;animation:ktring .5s ease-in-out infinite}.done .digits{animation:ktblink 1s steps(1) infinite}
.noanim *{animation:none!important}
.ctl{display:flex;justify-content:center;gap:8px;margin-top:6px}
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

  class ApplianceKitchenTimerCard extends HTMLElement {
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) { return { entity: Object.keys((hass && hass.states) || {}).find((i) => i.startsWith('timer.')) || '' }; }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      if (!c.entity) throw new Error('A timer entity is required (entity: timer.…)');
      this._c = { show_presets: true, ...c };
      this._built = false; this._prev = undefined; this._done = 0;
      if (this._hass) this._render();
    }
    set hass(h) { const ch = this._c && window.applianceChanged(this, h, this._c); this._hass = h; if (ch) this._render(); }
    connectedCallback() { this._tick = setInterval(() => { if (this._hass && this._c && this._built) this._paint(); }, 1000); }
    disconnectedCallback() { clearInterval(this._tick); }
    getCardSize() { return 5; }
    getGridOptions() { return { columns: 6, min_columns: 3, rows: 'auto', min_rows: 2 }; }

    _lang() { return window.applianceLang(T, this._c, this._hass); }
    _t(k) { return (T[this._lang()] || {})[k] ?? T.en[k] ?? k; }
    _presets() { const p = Array.isArray(this._c.presets) ? this._c.presets.map(Number).filter((x) => x > 0 && x <= 1440) : [1, 5, 10, 15, 30]; return p.slice(0, 8); }
    _call(service, data = {}) { this._hass.callService('timer', service, { entity_id: this._c.entity, ...data }); }
    _more() { this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: this._c.entity }, bubbles: true, composed: true })); }

    // état courant : { state, total, left }
    _info() {
      const s = this._hass.states[this._c.entity], a = (s && s.attributes) || {};
      if (!s || /^(unavailable|unknown)$/i.test(String(s.state))) return { state: 'unavailable', total: NaN, left: NaN };
      const total = secs(a.duration), st = String(s.state);
      const left = st === 'active' ? Math.max(0, (Date.parse(a.finishes_at) - Date.now()) / 1000) : st === 'paused' ? secs(a.remaining) : total;
      return { state: st, total, left };
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const ticks = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r1 = 93, r2 = i % 3 === 0 ? 87 : 90; return `<path class="tick" d="M${(Math.sin(a) * r1).toFixed(1)} ${(-Math.cos(a) * r1).toFixed(1)}L${(Math.sin(a) * r2).toFixed(1)} ${(-Math.cos(a) * r2).toFixed(1)}"/>`; }).join('');
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="kttitle"></div><div class="badge" id="ktbadge"></div></div>
        <svg class="dial" viewBox="-100 -100 200 200" role="img" id="ktdial">
          <circle class="body" r="98"/>${ticks}<circle class="track" r="78"/><circle class="prog" id="ktprog" r="78" transform="rotate(-90)" stroke-dasharray="0 ${CIRC.toFixed(1)}"/>
          <g class="bell"><path d="M-9 -52c0-9 4-14 9-14s9 5 9 14c0 8 4 10 6 13h-30c2-3 6-5 6-13z" fill="var(--kt-c)"/><circle cx="0" cy="-37" r="3" fill="var(--kt-c)"/></g>
          <text class="digits" id="ktdig" x="0" y="14"></text><text class="sub" id="ktsub" x="0" y="40"></text></svg>
        <div class="ctl"><button class="main" id="ktmain"><ha-icon id="ktmi" icon="mdi:play"></ha-icon><span id="ktml"></span></button><button id="ktcancel"><ha-icon icon="mdi:stop"></ha-icon><span id="ktcl"></span></button></div>
        <div class="presets" id="ktpre"></div></ha-card>`;
      window.applianceBindIllus(this, root.getElementById('ktdial'), () => this._more());
      root.getElementById('ktmain').addEventListener('click', () => {
        const st = this._info().state; this._done = 0;
        if (st === 'active') this._call('pause'); else this._call('start'); // idle : durée du timer ; paused : reprend
      });
      root.getElementById('ktcancel').addEventListener('click', () => { this._done = 0; this._skip = true; this._call('cancel'); });
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true;
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root;
      r.getElementById('kttitle').textContent = c.name || this._t('name');
      const pre = r.getElementById('ktpre'), list = this._presets();
      pre.classList.toggle('hide', c.show_presets === false || !list.length);
      if (pre.dataset.k !== list.join(',')) {
        pre.dataset.k = list.join(',');
        pre.innerHTML = list.map((m) => `<button data-m="${m}">${m >= 60 && m % 60 === 0 ? `${m / 60} h` : `${m} ${esc(this._t('min'))}`}</button>`).join('');
        pre.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { this._done = 0; this._call('start', { duration: hms(+b.dataset.m * 60) }); }));
      }
      r.getElementById('ktml').textContent = ''; r.getElementById('ktcl').textContent = this._t('cancel');
      this._paint();
    }

    // partie animée (rappelée chaque seconde) : temps restant, anneau, boutons, état « terminé »
    _paint() {
      const r = this._root, c = this._c, I = this._info(), now = Date.now();
      // fin de décompte : active → idle
      if (this._prev === 'active' && I.state === 'idle') { if (this._skip) this._skip = false; else this._done = now; } // annulation volontaire : pas de sonnerie
      if (this._prev === 'active' && I.state === 'active' && I.left <= 0) this._done = now;
      this._prev = I.state;
      const done = this._done && now - this._done < 120000 && I.state !== 'active' && I.state !== 'paused';
      const cls = I.state === 'unavailable' ? '' : done ? 'done' : I.state;
      this._card.className = `${cls}${c.animations === false ? ' noanim' : ''}`;
      const total = fin(I.total) && I.total > 0 ? I.total : NaN, left = fin(I.left) ? I.left : NaN;
      const frac = I.state === 'idle' ? 1 : fin(total) && fin(left) ? Math.max(0, Math.min(1, left / total)) : 0;
      r.getElementById('ktprog').setAttribute('stroke-dasharray', `${(done ? CIRC : frac * CIRC).toFixed(1)} ${CIRC.toFixed(1)}`);
      r.getElementById('ktdig').textContent = I.state === 'unavailable' ? '--:--' : done ? '00:00' : fin(left) ? clock(left) : '--:--';
      const label = I.state === 'unavailable' ? 'unavailable' : done ? 'done' : ({ idle: 'ready', active: 'running', paused: 'paused' })[I.state] || 'ready';
      r.getElementById('ktsub').textContent = this._t(label);
      r.getElementById('ktbadge').textContent = this._t(label);
      const main = r.getElementById('ktmain'), icon = I.state === 'active' ? 'mdi:pause' : 'mdi:play', txt = this._t(I.state === 'active' ? 'pause' : I.state === 'paused' ? 'resume' : 'start');
      r.getElementById('ktmi').setAttribute('icon', icon); r.getElementById('ktml').textContent = txt;
      main.disabled = I.state === 'unavailable'; r.getElementById('ktcancel').classList.toggle('hide', I.state === 'idle' || I.state === 'unavailable');
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
