/* ------------------------------------------------------------------ */
/* Carte unique « Appliance » : un seul choix dans le sélecteur de     */
/* cartes de Home Assistant, le type d'appareil se choisit dans l'éditeur. */
/* ------------------------------------------------------------------ */
(() => {
  const TAG = 'appliance-card';
  if (customElements.get(TAG)) return;

  const isOurs = (c) => c && /^appliance-.+-card$/.test(c.type) && c.type !== TAG;
  // Les 56 autres cartes se chargent en parallèle (dist/cards/*.js) et peuvent finir dans
  // n'importe quel ordre : on ne fige jamais la liste, on la relit à chaque usage pour ne
  // pas rater celles pas encore enregistrées au moment où ce fichier s'exécute.
  // Mode « carte unique » : applySelectorPrefs retire nos cartes de window.customCards pour les masquer dans le sélecteur de HA.
  // On les garde ici, sinon la liste déroulante du type d'appareil se retrouve vide (issue 514).
  const hidden = [];
  const getOurs = () => {
    const live = (window.customCards || []).filter(isOurs);
    return live.concat(hidden.filter((h) => !live.some((l) => l.type === h.type)));
  };
  const label = (c) => String(c.name || c.type).replace(/^Appliance\s*[–-]\s*/, '');
  // ordre d'origine (noms « anglais / français ») : sert seulement à choisir le type par défaut d'une nouvelle carte
  const OPTIONS = () => getOurs().map((c) => ({ value: c.type, label: label(c) })).sort((a, b) => a.label.localeCompare(b.label));
  // Resolve against all registered names, preserving regional language variants.
  const haLang = (hass) => window.applianceResolveLanguage(Object.assign({}, ...getOurs().map((c) => c.names)),
    (hass && (hass.locale?.language || hass.language)) || navigator.language || 'en');
  // liste des types d'appareils dans la langue de Home Assistant, triée dans cette langue
  // names : noms traduits déclarés par chaque carte ; à défaut, le nom « anglais / français » d'origine
  const optionsFor = (hass) => {
    const l = haLang(hass);
    return getOurs().map((c) => ({ value: c.type, label: (c.names && (c.names[l] || c.names.en)) || label(c) }))
      .sort((a, b) => a.label.localeCompare(b.label, l, { sensitivity: 'base' }));
  };

  // Préférences du sélecteur, enregistrées dans le navigateur (localStorage peut être bloqué)
  const SINGLE_KEY = 'applianceCardsSinglePicker', NOPREV_KEY = 'applianceCardsNoPreview', PREV_KEY = 'applianceCardsPreviews';
  const getPref = (k) => { try { return localStorage.getItem(k) === '1'; } catch (e) { return false; } };
  const setPref = (k, on) => { try { if (on) localStorage.setItem(k, '1'); else localStorage.removeItem(k); } catch (e) { /* stockage bloqué */ } };

  // Aperçu live désactivé par défaut sur chaque entrée : c'est lui qui ralentit l'onglet « Par carte ».
  // Case « Aperçus des cartes Appliance » de l'éditeur de la carte unique (ou localStorage applianceCardsPreviews = '1') pour le réactiver.
  const setPreviews = (on) => { for (const c of getOurs()) c.preview = on; };

  // « single » et « previews » dépendent de voir la liste complète des cartes, mais les 56
  // chunks se chargent en parallèle et peuvent finir après ce fichier. On applique une
  // première fois tout de suite (cas déjà couvert si tout est chargé), puis une seconde fois
  // quand le chargeur principal signale que tous les chunks ont terminé (voir build.js).
  const applySelectorPrefs = () => {
    setPreviews(!!window.applianceCardsPreviews || getPref(PREV_KEY));
    if (window.applianceCardsSinglePicker || getPref(SINGLE_KEY)) {
      window.customCards.filter(isOurs).forEach((c) => { if (!hidden.some((h) => h.type === c.type)) hidden.push(c); });
      const keep = window.customCards.filter((c) => !isOurs(c));
      window.customCards.length = 0;
      window.customCards.push(...keep);
    }
  };
  applySelectorPrefs();
  window.addEventListener('appliance-cards-ready', applySelectorPrefs, { once: true });

  // Option : aucun aperçu live dans le sélecteur, y compris pour les cartes d'autres dépôts.
  // Les entrées déjà déclarées sont modifiées, celles déclarées plus tard le sont au moment du push.
  if (window.applianceCardsNoPreview || getPref(NOPREV_KEY)) {
    const list = window.customCards;
    list.forEach((c) => { if (c) c.preview = false; });
    const push = list.push;
    list.push = function (...items) { items.forEach((c) => { if (c) c.preview = false; }); return push.apply(this, items); };
  }

  // Catégories du sélecteur de type : chaque carte appartient à une catégorie (les cartes non listées vont dans « home »).
  // Les « sous-catégories » sont les variantes de l'appareil (style, modèle, finition…), remontées en tête de l'éditeur.
  const CATS = {
    kitchen: 'washer washer-dryer dryer dishwasher oven microwave fridge chest-freezer drawer-freezer hob air-fryer coffee-maker thermomix cookeo kettle toaster range-hood wine-cooler beer-tap contact-grill deep-fryer',
    climate: 'water-heater thermo-heater fan-heater underfloor-heating radiator towel-dryer pellet-stove pellet-boiler gas-boiler diesel-heater water-heat-pump air-water-heat-pump ac-split portable-ac heat-pump vmc room-climate trv dehumidifier humidifier air-purifier air-quality co2-monitor fan ceiling-fan',
    energy: 'solar battery ev-charger linky water-meter heat-meter gas-meter electric-meter ups smart-plug power-strip phone-charger tool-charger',
    water: 'pool-pump dosing-pump pool-robot jacuzzi inflatable-spa sauna aquarium reef-aquarium irrigation rain-gauge plant-monitor water-pump industrial-pump sump-pump rainwater-tank water-valve smart-tap water-softener water-filter robot-mower-solo',
    security: 'barrier sliding-gate swing-gate garage-door mailbox smart-lock door-sensor motion-sensor alarm-keypad smoke-detector leak-detector camera nvr',
    lighting: 'light-bulb color-bulb filament-bulb pendant-light pendant-cluster desk-lamp floor-lamp chandelier garden-spotlight ceiling-spot ceiling-globe christmas-tree garland led-strip hue-sync-box',
    shutters: 'roller-shutter sliding-curtain venetian-blind swing-shutter pergola roof-window awning double-awning',
    media: 'tv av-receiver soundbar smart-speaker ps5 tv-box piano elliptical exercise-bike rowing-machine treadmill',
    it: 'server-rack mini-pc nas internet-box desktop-pc monitor laptop printer printer-3d raspberry-pi poe-switch zigbee-coordinator wall-tablet',
    // catégorie par défaut des cartes non listées ; chaque carte doit pourtant être listée (build.js avertit sinon)
    home: 'iron steam-station poubelle robot-vacuum-solo robot-vacuum robot-mower canister-vacuum wet-vacuum pet-feeder pet-fountain cat-flap scale air-compressor water-softener-generic generic',
  };
  const CAT_ORDER = Object.keys(CATS);
  const CAT_OF = {};
  for (const [k, list] of Object.entries(CATS)) list.split(' ').forEach((n) => { CAT_OF[`appliance-${n}-card`] = k; });
  const catOf = (type) => CAT_OF[type] || 'home';
  // champs « variante » d'un appareil (style de frigo, modèle d'enceinte, finition…) : affichés juste sous le type d'appareil
  const VARIANTS = ['model', 'style', 'finish', 'variant', 'illustration'];
  const hoist = (schema) => {
    const picked = [];
    const walk = (list) => list.filter((it) => { if (it && it.name && VARIANTS.includes(it.name) && it.selector) { picked.push(it); return false; } return true; })
      .map((it) => (it && Array.isArray(it.schema) ? { ...it, schema: walk(it.schema) } : it))
      .filter((it) => !(it && Array.isArray(it.schema) && it.schema.length === 0));
    const rest = walk(schema);
    return [...picked, ...rest];
  };

  const TXT = {
    fr: { appliance: 'Type d\'appareil', name: 'Appliance – Carte unique (choix du type)', desc: 'Une seule entrée dans le sélecteur : choisis ensuite l\'appareil dans l\'éditeur.', empty: 'Choisis un type d\'appareil dans l\'éditeur.',
      opts: 'Sélecteur de cartes (sur cet appareil)', single: 'N\'afficher que la carte unique Appliance', previews: 'Afficher l\'aperçu des cartes Appliance dans le sélecteur (plus lent)', nopreview: 'Désactiver les aperçus de toutes les cartes personnalisées',
      hint: 'Réglage enregistré dans ce navigateur (à refaire sur le smartphone). Recharge la page pour l\'appliquer.',
      category: 'Catégorie', all: 'Toutes les catégories',
      cats: { kitchen: 'Cuisine et lessive', climate: 'Chauffage, climatisation et air', energy: 'Énergie et alimentation', water: 'Piscine, jardin et eau', security: 'Accès, sécurité et capteurs', lighting: 'Éclairage', shutters: 'Volets et stores', media: 'Loisirs et multimédia', it: 'Informatique et réseau', home: 'Robots, animaux et divers' } },
    en: { appliance: 'Appliance type', name: 'Appliance – Single card (pick the type)', desc: 'One single entry in the card picker: choose the appliance in the editor.', empty: 'Pick an appliance type in the editor.',
      opts: 'Card picker (on this device)', single: 'Only show the single Appliance card', previews: 'Show Appliance card previews in the picker (slower)', nopreview: 'Turn off previews of all custom cards',
      hint: 'Saved in this browser (set it again on your phone). Reload the page to apply it.',
      category: 'Category', all: 'All categories',
      cats: { kitchen: 'Kitchen and laundry', climate: 'Heating, cooling and air', energy: 'Energy and power', water: 'Pool, garden and water', security: 'Access, security and sensors', lighting: 'Lighting', shutters: 'Shutters and blinds', media: 'Entertainment and leisure', it: 'Computing and network', home: 'Robots, pets and more' } },
    'pt-PT': { appliance: 'Tipo de aparelho', name: 'Appliance – Cartão único (escolha do tipo)', desc: 'Uma única entrada no seletor de cartões: escolha o aparelho no editor.', empty: 'Escolha um tipo de aparelho no editor.',
      opts: 'Seletor de cartões (neste dispositivo)', single: 'Mostrar apenas o cartão único Appliance', previews: 'Mostrar pré-visualizações dos cartões Appliance no seletor (mais lento)', nopreview: 'Desativar as pré-visualizações de todos os cartões personalizados',
      hint: 'Definição guardada neste navegador (configure novamente no telemóvel). Recarregue a página para aplicar.' },
    'pt-BR': { appliance: 'Tipo de aparelho', name: 'Appliance – Cartão único (escolha do tipo)', desc: 'Uma única entrada no seletor de cartões: escolha o aparelho no editor.', empty: 'Escolha um tipo de aparelho no editor.',
      opts: 'Seletor de cartões (neste dispositivo)', single: 'Mostrar apenas o cartão único Appliance', previews: 'Mostrar prévias dos cartões Appliance no seletor (mais lento)', nopreview: 'Desativar as prévias de todos os cartões personalizados',
      hint: 'Configuração salva neste navegador (configure novamente no celular). Recarregue a página para aplicar.' },
  };
  // langues sans traduction des catégories : repli sur l'anglais
  const tx = (hass) => Object.assign({}, TXT.en, TXT[window.applianceLang(TXT, null, hass)] || {});

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
      }
      if (this._child) { this._child.setConfig(inner(config)); if (this._hass) this._child.hass = this._hass; }
      else this._renderEmpty();
    }
    set hass(hass) {
      this._hass = hass;
      if (this._child) this._child.hass = hass;
      else if (this._config) this._renderEmpty();
    }
    _renderEmpty() { this.innerHTML = `<ha-card><div style="padding:16px">${tx(this._hass).empty}</div></ha-card>`; }
    getCardSize() { return this._child && this._child.getCardSize ? this._child.getCardSize() : 3; }
    getGridOptions() { return this._child && this._child.getGridOptions ? this._child.getGridOptions() : undefined; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const opts = OPTIONS();
      const first = opts[0] && opts[0].value;
      const C = first && customElements.get(first);
      const stub = C && C.getStubConfig ? C.getStubConfig(hass) : {};
      return first ? wrap(first, stub || {}) : { type: 'custom:' + TAG };
    }
  }

  class ApplianceCardEditor extends HTMLElement {
    setConfig(config) { this._config = config; this._render(); }
    set hass(hass) {
      const changed = haLang(hass) !== haLang(this._hass);
      this._hass = hass;
      if (changed && this._config) this._render();
      else { if (this._form) this._form.hass = hass; if (this._sub) this._sub.hass = hass; }
    }
    _render() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          e.stopPropagation();
          const { appliance, category } = e.detail.value;
          // changement de catégorie : on filtre seulement la liste des types, la carte actuelle n'est pas modifiée
          if (category !== undefined && category !== this._cat) { this._cat = category; this._render(); return; }
          if (!appliance || appliance === this._config.appliance) return;
          // nouveau type : on repart de la config par défaut de la carte choisie
          const C = customElements.get(appliance);
          const stub = C && C.getStubConfig ? C.getStubConfig(this._hass) : {};
          this._fire(wrap(appliance, stub || {}));
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      const T = tx(this._hass);
      if (this._cat === undefined) this._cat = this._config.appliance ? catOf(this._config.appliance) : '';
      const opts = optionsFor(this._hass).filter((o) => !this._cat || catOf(o.value) === this._cat);
      const catOpts = [{ value: '', label: T.all }].concat(CAT_ORDER.filter((k) => optionsFor(this._hass).some((o) => catOf(o.value) === k)).map((k) => ({ value: k, label: T.cats[k] })));
      this._form.data = { category: this._cat, appliance: opts.some((o) => o.value === this._config.appliance) ? this._config.appliance : '' };
      this._form.schema = [
        { name: 'category', selector: { select: { mode: 'dropdown', options: catOpts } } },
        { name: 'appliance', selector: { select: { mode: 'dropdown', options: opts } } },
      ];
      this._form.computeLabel = (sc) => (sc.name === 'category' ? T.category : T.appliance);

      // Options du sélecteur : propres au navigateur, hors config de la carte
      if (!this._opt) {
        const box = document.createElement('div'); box.style.cssText = 'margin:8px 0 16px;padding:8px 12px;border-radius:12px;background:var(--secondary-background-color)';
        const title = document.createElement('div'); title.style.cssText = 'font-weight:500;margin:4px 0';
        const hint = document.createElement('div'); hint.style.cssText = 'font-size:12px;color:var(--secondary-text-color);margin:2px 0 4px';
        this._opt = document.createElement('ha-form');
        this._opt.addEventListener('value-changed', (e) => {
          e.stopPropagation();
          const v = e.detail.value;
          setPref(SINGLE_KEY, v.single); setPref(PREV_KEY, v.previews); setPref(NOPREV_KEY, v.nopreview);
          setPreviews(!!v.previews && !v.nopreview); // effet immédiat sur le sélecteur
          this._opt.data = { single: getPref(SINGLE_KEY), previews: getPref(PREV_KEY), nopreview: getPref(NOPREV_KEY) };
        });
        box.append(title, this._opt, hint); this.appendChild(box);
        this._optTitle = title; this._optHint = hint;
      }
      const t = tx(this._hass);
      this._optTitle.textContent = t.opts; this._optHint.textContent = t.hint;
      this._opt.hass = this._hass;
      this._opt.data = { single: getPref(SINGLE_KEY), previews: getPref(PREV_KEY), nopreview: getPref(NOPREV_KEY) };
      this._opt.schema = [{ name: 'single', selector: { boolean: {} } }, { name: 'previews', selector: { boolean: {} } }, { name: 'nopreview', selector: { boolean: {} } }];
      this._opt.computeLabel = (sc) => t[sc.name];

      // Éditeur de la vraie carte, affiché sous la liste
      const tag = this._config.appliance;
      if (this._subTag !== tag) {
        this._subTag = tag;
        if (this._sub) this._sub.remove();
        this._sub = null; this._subForm = null;
        const C = tag && customElements.get(tag);
        if (C && C.getConfigElement) {
          this._sub = C.getConfigElement();
          this._sub.addEventListener('config-changed', (e) => {
            e.stopPropagation();
            this._fire(wrap(this._config.appliance, e.detail.config));
          });
          this.appendChild(this._sub);
        } else if (C && C.getConfigForm) {
          // cartes « de base » : pas d'éditeur dédié, seulement un schéma ha-form (entité, capteurs, options…)
          const f = C.getConfigForm();
          this._sub = document.createElement('ha-form');
          this._subForm = f;
          this._sub.schema = hoist(f.schema);
          this._sub.computeLabel = f.computeLabel;
          this._sub.addEventListener('value-changed', (e) => {
            e.stopPropagation();
            this._fire(wrap(this._config.appliance, e.detail.value));
          });
          this.appendChild(this._sub);
        }
      }
      if (this._sub) {
        this._sub.hass = this._hass;
        if (this._subForm) this._sub.data = inner(this._config);
        else {
          this._sub.setConfig(inner(this._config));
          // éditeur dédié : variantes (style, modèle, finition…) remontées en tête de son formulaire
          const sf = this._sub._form;
          if (sf && Array.isArray(sf.schema)) sf.schema = hoist(sf.schema);
        }
        // réglages du sélecteur (propres au navigateur) : en bas de l'éditeur
        if (this._opt && this._opt.parentNode) this.appendChild(this._opt.parentNode);
      }
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
})();
