/* ------------------------------------------------------------------ */
/* Carte unique « Appliance » : un seul choix dans le sélecteur de     */
/* cartes de Home Assistant, le type d'appareil se choisit dans l'éditeur. */
/* ------------------------------------------------------------------ */
(() => {
  const TAG = 'appliance-card';
  if (customElements.get(TAG)) return;

  const isOurs = (c) => c && /^appliance-.+-card$/.test(c.type) && c.type !== TAG;
  const ours = (window.customCards || []).filter(isOurs);
  const label = (c) => String(c.name || c.type).replace(/^Appliance\s*[–-]\s*/, '');
  const OPTIONS = ours.map((c) => ({ value: c.type, label: label(c) })).sort((a, b) => a.label.localeCompare(b.label));

  // Aperçu live désactivé sur chaque entrée : c'est lui qui ralentit l'onglet « Par carte »
  for (const c of ours) c.preview = false;

  const TXT = {
    fr: { appliance: 'Type d\'appareil', name: 'Appliance – Carte unique (choix du type)', desc: 'Une seule entrée dans le sélecteur : choisis ensuite l\'appareil dans l\'éditeur.', empty: 'Choisis un type d\'appareil dans l\'éditeur.' },
    en: { appliance: 'Appliance type', name: 'Appliance – Single card (pick the type)', desc: 'One single entry in the card picker: choose the appliance in the editor.', empty: 'Pick an appliance type in the editor.' },
  };
  const tx = (hass) => TXT[(hass && hass.language || '').slice(0, 2)] || TXT.en;

  // Config enveloppe -> config de la vraie carte
  const inner = (cfg) => { const { appliance, ...rest } = cfg; return { ...rest, type: 'custom:' + appliance }; };
  const wrap = (appliance, innerCfg) => { const { type, ...rest } = innerCfg; return { type: 'custom:' + TAG, appliance, ...rest }; };

  class ApplianceCard extends HTMLElement {
    setConfig(config) {
      if (!config) throw new Error('Invalid configuration');
      this._config = config;
      const tag = config.appliance;
      if (this._tag !== tag) {
        this._tag = tag;
        this._child = tag ? document.createElement(tag) : null;
        this.replaceChildren();
        if (this._child) this.appendChild(this._child);
        else this.innerHTML = `<ha-card><div style="padding:16px">${tx(this._hass).empty}</div></ha-card>`;
      }
      if (this._child) { this._child.setConfig(inner(config)); if (this._hass) this._child.hass = this._hass; }
    }
    set hass(hass) { this._hass = hass; if (this._child) this._child.hass = hass; }
    getCardSize() { return this._child && this._child.getCardSize ? this._child.getCardSize() : 3; }
    getGridOptions() { return this._child && this._child.getGridOptions ? this._child.getGridOptions() : undefined; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const first = OPTIONS[0] && OPTIONS[0].value;
      const C = first && customElements.get(first);
      const stub = C && C.getStubConfig ? C.getStubConfig(hass) : {};
      return first ? wrap(first, stub || {}) : { type: 'custom:' + TAG };
    }
  }

  class ApplianceCardEditor extends HTMLElement {
    setConfig(config) { this._config = config; this._render(); }
    set hass(hass) { this._hass = hass; if (this._form) this._form.hass = hass; if (this._sub) this._sub.hass = hass; }
    _render() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          e.stopPropagation();
          const appliance = e.detail.value.appliance;
          if (appliance === this._config.appliance) return;
          // nouveau type : on repart de la config par défaut de la carte choisie
          const C = customElements.get(appliance);
          const stub = C && C.getStubConfig ? C.getStubConfig(this._hass) : {};
          this._fire(wrap(appliance, stub || {}));
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.data = { appliance: this._config.appliance || '' };
      this._form.schema = [{ name: 'appliance', selector: { select: { mode: 'dropdown', options: OPTIONS } } }];
      this._form.computeLabel = () => tx(this._hass).appliance;

      // Éditeur de la vraie carte, affiché sous la liste
      const tag = this._config.appliance;
      if (this._subTag !== tag) {
        this._subTag = tag;
        if (this._sub) this._sub.remove();
        this._sub = null;
        const C = tag && customElements.get(tag);
        if (C && C.getConfigElement) {
          this._sub = C.getConfigElement();
          this._sub.addEventListener('config-changed', (e) => {
            e.stopPropagation();
            this._fire(wrap(this._config.appliance, e.detail.config));
          });
          this.appendChild(this._sub);
        }
      }
      if (this._sub) { this._sub.hass = this._hass; this._sub.setConfig(inner(this._config)); }
    }
    _fire(config) {
      this._config = config;
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
      this._render();
    }
  }

  customElements.define(TAG, ApplianceCard);
  customElements.define(TAG + '-editor', ApplianceCardEditor);

  const t = tx({ language: (navigator.language || 'en') });
  window.customCards.push({
    type: TAG, name: t.name, description: t.desc, preview: false,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });

  // Option : ne garder que la carte unique dans le sélecteur.
  // Active-la avec window.applianceCardsSinglePicker = true (avant le chargement du module)
  // ou localStorage.setItem('applianceCardsSinglePicker', '1') dans la console du navigateur.
  let single = !!window.applianceCardsSinglePicker;
  try { single = single || localStorage.getItem('applianceCardsSinglePicker') === '1'; } catch (e) { /* stockage bloqué */ }
  if (single) {
    const keep = window.customCards.filter((c) => !isOurs(c));
    window.customCards.length = 0;
    window.customCards.push(...keep);
  }
})();
