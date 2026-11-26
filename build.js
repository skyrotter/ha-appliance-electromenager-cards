#!/usr/bin/env node
/*
 * Builds dist/ from src/. Two parts:
 *  - dist/ha-appliance-electromenager-cards.js: the 26 core cards (one shared
 *    IIFE: version, i18n, illustrations, definitions, helpers, base class,
 *    editor, style, register) plus a small loader.
 *  - dist/cards/<name>.js: the 58 extra cards (aquarium, linky, battery...),
 *    each self-contained and loaded lazily (dynamic import()) by that loader
 *    instead of being concatenated into the main file. HACS installs the
 *    whole dist/ tree (not just hacs.json's "filename"), so the chunks are
 *    fetched like any other file; this just saves parsing/evaluating all 58
 *    of them on every dashboard that only uses a handful.
 *
 *   node build.js           write dist/
 *   node build.js --check   fail if dist/ is not up to date (used by CI)
 *
 * Markers replaced while building:
 *   /*@css*\/``               the CSS files of CSS_FILES, as a template literal
 *   /*@i18n <section>*\/{}    that section of every src/i18n/<lang>.json,
 *                             giving { en: {...}, fr: {...}, ... } (substituted
 *                             independently in the main file and in each chunk)
 *
 * English (en.json) is the reference: missing keys in other languages fall
 * back to English at runtime and are reported as warnings.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const NAME = "ha-appliance-electromenager-cards.js";
const DIST = path.join(ROOT, "dist", NAME);
const CARDS_DIR = path.join(ROOT, "dist", "cards");
const ASSETS_DIR = path.join(ROOT, "dist", "assets");

/* The 26 core cards share one scope (one IIFE): order matters. */
const CORE_FILES = [
  "core/version.js",       // VERSION : à mettre à jour avant chaque release (vérifié par le workflow Release)
  "core/i18n.js",          // STRINGS, lang(), tr()
  "core/illustrations.js", // DEFS and drawing helpers, empty SVG object
  "core/svg/*.js",         // SVG.<kind> = illustration, one file per kind
  "core/definitions.js",   // DEF: what each kind shows and needs
  "core/helpers.js",       // state parsing and formatting
  "core/base.js",          // ApplianceCardBase
  "core/kinds/*.js",       // Per-kind compute, LCD and render handlers
  "core/editor.js",        // visual editor schema, stub config
  "core/style.js",         // STYLE, built from CSS_FILES
  "core/register.js",      // defines the custom elements
];
/* Concatenated into STYLE: order matters (cascade). */
const CSS_FILES = [
  "card", "illustration-shared", "washer-dryer", "dishwasher", "water-heater", "oven-microwave",
  "radiator", "cooktop", "vmc", "solar", "freezers", "printer-3d", "pool-pump", "pellet-stove",
  "fridge", "air-fryer", "coffee-maker", "tv", "range-hood", "ac-split", "heat-pump",
  "towel-dryer", "server-rack", "desktop-pc", "laptop", "wine-cooler", "beer-tap", "av-receiver", "smart-speaker", "fan", "generic", "tool-charger", "ceiling-fan", "dehumidifier", "air-purifier", "airbowl", "monitor", "kettle-toaster", "iron-steam", "infrared-panel", "projector-screen", "plugs-piano-garland", "wet-vacuum", "dosing-pump", "fitness", "ps5", "switch2", "thermomix", "cookeo", "printer", "vmc-ventoxx", "photo-appliances", "air-compressor", "contact-grill", "deep-fryer",
].map((n) => `core/style/${n}.css`);
/* Self-contained cards, each in its own IIFE: built as separate lazy chunks
 * (dist/cards/<name>.js). card-helpers and editor-labels define the
 * window.appliance* helpers the other 56 call, so the loader awaits them
 * first; the rest load in parallel. */
const CARD_FILES = [
  "card-helpers", "editor-labels", "aquarium", "reef-aquarium", "linky", "battery", "ev-charger", "robot-vacuum", "robot-mower", "pellet-boiler", "gas-boiler", "water-heat-pump", "air-water-heat-pump", "diesel-heater", "jacuzzi", "internet-box", "hue-sync-box", "door-sensor", "motion-sensor", "alarm-keypad", "air-quality", "pet-feeder", "portable-ac", "access", "sauna", "pumps", "pool-robot", "ups", "underfloor-heating", "lights", "shutters", "water-meter", "gas-meter", "electric-meter", "trv", "room-climate", "mailbox", "smoke-detector", "smart-lock", "cat-flap", "pet-fountain", "soundbar", "leak-detector", "mini-pc", "nas", "tv-box", "scale", "thermo-heater", "water-valves", "water-softener", "camera", "poe-switch", "raspberry-pi", "water-filter", "irrigation", "led-strip", "rain-gauge", "plant-monitor", "co2-monitor", "litter-box", "barometer", "weather-station", "energy-monitor", "kitchen-timer", "oven-hob", "solar-house", "htpc", "humidifier", "fan-heater", "inflatable-spa", "heat-meter", "poubelle", "picker", "zigbee-coordinator", "wall-tablet", "breezer", "video-doorbell",
].map((n) => `cards/${n}.js`);

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
// one trailing newline per file, so files are joined by exactly one blank line
const load = (rel) => read(path.join(SRC, rel)).replace(/\s+$/, "") + "\n";
const expand = (rel) => {
  if (!rel.includes("*")) return [rel];
  const dir = path.dirname(rel), ext = path.extname(rel);
  return fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith(ext)).sort().map((f) => `${dir}/${f}`);
};

let warnings = 0;
const warn = (msg) => { warnings++; console.warn(`warning: ${msg}`); };

// Every source file must be listed, so nothing is silently left out
const listed = new Set(["header.js", ...CORE_FILES.flatMap(expand), ...CSS_FILES, ...CARD_FILES]);
const walk = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`]);
// fichier oublié : erreur bloquante (build et --check), sinon il manquerait en silence dans dist/
const unlisted = walk("").filter((f) => /\.(js|css)$/.test(f) && !listed.has(f));
if (unlisted.length) {
  for (const f of unlisted) console.error(`error: src/${f} is not listed in build.js`);
  process.exit(1);
}

/* ---- i18n ---- */
const I18N_DIR = path.join(SRC, "i18n");
const langs = fs.readdirSync(I18N_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5))
  .sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b)));
if (!langs.includes("en")) throw new Error("src/i18n/en.json is required (reference language)");
const i18n = Object.fromEntries(langs.map((l) => [l, JSON.parse(read(path.join(I18N_DIR, `${l}.json`)))]));
for (const l of langs.filter((l) => l !== "en")) {
  for (const [ns, ref] of Object.entries(i18n.en)) {
    const strings = i18n[l][ns] || {};
    const missing = Object.keys(ref).filter((k) => !(k in strings));
    const extra = Object.keys(strings).filter((k) => !(k in ref));
    if (missing.length) warn(`${l}.json ${ns}: missing ${missing.join(", ")}`);
    if (extra.length) warn(`${l}.json ${ns}: not in en.json ${extra.join(", ")}`);
  }
  for (const ns of Object.keys(i18n[l]).filter((ns) => !(ns in i18n.en))) warn(`${l}.json: namespace "${ns}" not in en.json`);
}
const usedI18n = new Set();
// substitutes every /*@i18n <section>*/{} marker found in `text` (core file or one card chunk)
const substituteI18n = (text) => text.replace(/^([ \t]*)(.*?)\/\*@i18n (\w+)\*\/\{\}/gm, (_, indent, before, ns) => {
  if (!i18n.en[ns]) throw new Error(`namespace "${ns}" missing from src/i18n/en.json`);
  usedI18n.add(ns);
  const table = Object.fromEntries(langs.filter((l) => i18n[l][ns]).map((l) => [l, i18n[l][ns]]));
  return indent + before + JSON.stringify(table);
});

/* ---- dynamic image assets (extracted from core & cards into dist/assets/*.js) ---- */
const B64_RE = /(["'])(data:image\/(?:webp|png);base64,[A-Za-z0-9+/=]{1000,})\1/g;
const assetGroups = new Map();
const extractBase64Assets = (code, group) => code.replace(B64_RE, (_, _q, dataUri) => {
  let list = assetGroups.get(group);
  if (!list) { list = []; assetGroups.set(group, list); }
  let idx = list.indexOf(dataUri);
  if (idx < 0) { idx = list.length; list.push(dataUri); }
  return `window.__acImg(${JSON.stringify(group)},${idx})`;
});

/* ---- core (one shared IIFE) ---- */
const compactCss = (raw) => raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s+/gm, "").replace(/\n{2,}/g, "\n").trim();
const css = compactCss(CSS_FILES.map(load).join("\n")).replace(/[\\`]|\$\{/g, (c) => `\\${c}`);
let core = '(() => {\n"use strict";\n'
  + CORE_FILES.flatMap(expand).map((rel) => extractBase64Assets(load(rel), `core-${path.basename(rel, ".js")}`)).join("\n")
  + "})();\n";
const cssMarkers = core.split("/*@css*/``").length - 1;
if (cssMarkers !== 1) throw new Error(`expected one /*@css*/\`\` marker, found ${cssMarkers}`);
core = core.replace("/*@css*/``", () => "`\n" + css + "`");
core = substituteI18n(core);

/* ---- cards: one chunk per file, substituted independently ---- */
const chunkNames = CARD_FILES.map((f) => path.basename(f, ".js"));
// /*@asset nom*/{} : insère src/assets/<nom>.json tel quel (photos détourées en base64 pour les cartes en photo)
const substituteAssets = (text) => text.replace(/\/\*@asset ([\w-]+)\*\/\{\}/g, (_, n) => fs.readFileSync(path.join(SRC, "assets", `${n}.json`), "utf8").trim());
const chunks = Object.fromEntries(CARD_FILES.map((f) => {
  const name = path.basename(f, ".js");
  let code = extractBase64Assets(substituteAssets(substituteI18n(load(f))), name);
  if (name !== "card-helpers" && name !== "editor-labels" && name !== "picker") {
    code = code.replace(/\bcustomElements\.get\(/g, "(window.__acHasReal||customElements.get.bind(customElements))(");
  }
  return [name, code];
}));
const assetNames = [...assetGroups.keys()].sort();
const assetChunks = Object.fromEntries(assetNames.map((g) => [g, `window.__acRegisterAssets(${JSON.stringify(g)},${JSON.stringify(assetGroups.get(g))});\n`]));

for (const ns of Object.keys(i18n.en).filter((ns) => !usedI18n.has(ns))) warn(`en.json: namespace "${ns}" is not used by the source`);

// Chaque carte doit avoir une catégorie dans le sélecteur de la carte unique (CATS de src/cards/picker.js) : sans elle, elle
// tomberait dans « Robots, animaux et divers » sans qu'on s'en aperçoive. Les cartes sont lues dans le README (tableau « The cards »)
// et dans les noms `appliance-…-card` écrits dans les sources.
{
  const picker = read(path.join(SRC, "cards/picker.js")), blk = (picker.match(/const CATS = \{([\s\S]*?)\n  \};/) || [])[1] || "";
  const categorised = new Set([...blk.matchAll(/(\w+): '([^']+)'/g)].flatMap((m) => m[2].split(/\s+/).map((n) => `appliance-${n}-card`)));
  const found = new Set();
  const readme = read(path.join(ROOT, "README.md"));
  for (const m of readme.matchAll(/`custom:(appliance-[a-z0-9-]+-card)`/g)) found.add(m[1]);
  for (const f of walk("cards/").filter((f) => f.endsWith(".js"))) for (const m of read(path.join(SRC, f)).matchAll(/['"`](appliance-[a-z0-9-]+-card)['"`]/g)) found.add(m[1]);
  const ignore = new Set(["appliance-card", "appliance-electromenager-card"]); // la carte unique elle-même et le nom du dépôt
  for (const t of [...found].filter((t) => !ignore.has(t) && !categorised.has(t)).sort()) warn(`${t} has no category: add it to CATS in src/cards/picker.js`);
}

/* ---- extract standalone card manifest & custom element tag map at build time ---- */
const standaloneNames = chunkNames.filter((n) => n !== "card-helpers" && n !== "editor-labels" && n !== "picker");
const tagToChunk = {};
const manifestCards = [];
{
  class DummyEl { attachShadow() { return { innerHTML: "", adoptedStyleSheets: [], querySelector: () => null, querySelectorAll: () => [], appendChild: () => {} }; } }
  const defined = {};
  const customCards = [];
  let currentChunk = "";
  const sandbox = {
    window: {
      customCards,
      addEventListener: () => {},
      dispatchEvent: () => {},
      location: { href: "http://localhost/" },
      applianceResolveLanguage: () => "en",
      __acImg: () => "data:image/webp;base64,",
    },
    customElements: {
      define: (tag, cls) => {
        defined[tag] = cls;
        if (currentChunk) tagToChunk[String(tag).toLowerCase()] = currentChunk;
      },
      get: (tag) => defined[tag],
      whenDefined: () => Promise.resolve(),
    },
    document: { documentElement: { lang: "en" }, querySelector: () => null, createElement: () => new DummyEl() },
    navigator: { language: "en" },
    HTMLElement: DummyEl,
    CustomEvent: class {},
    CSSStyleSheet: class { replaceSync() {} },
    Intl, JSON, Math, Object, Array, String, Number, Boolean, Date, RegExp, Map, Set, Promise, Error, console,
    parseFloat, parseInt, isNaN, isFinite, queueMicrotask: () => {}, setTimeout, clearTimeout, setInterval, clearInterval,
  };
  sandbox.window.window = sandbox.window;
  sandbox.self = sandbox.window;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(chunks["card-helpers"], sandbox);
  for (const name of standaloneNames) {
    const prevLen = customCards.length;
    currentChunk = name;
    vm.runInContext(chunks[name], sandbox);
    for (let i = prevLen; i < customCards.length; i++) manifestCards.push(customCards[i]);
  }
  var formTags = Object.entries(defined)
    .filter(([t, cls]) => tagToChunk[String(t).toLowerCase()] && typeof cls?.getConfigForm === "function" && typeof cls?.getConfigElement !== "function")
    .map(([t]) => String(t).toLowerCase());
}

/* ---- main file: header + asset bootstrap + core + on-demand lazy loader ---- */
const VERSION_STR = /const VERSION = "([^"]+)"/.exec(load("core/version.js"))[1];
const bootstrap = `
/* Runtime bootstrap: dynamic photo asset hydrator & event pre-hook */
(() => {
  const w = window;
  w.__acAssets = w.__acAssets || {};
  const BLANK = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
  const roots = new Set();
  const RE_AC = /#ac:([^:]+):(\\d+)$/;
  const hydrateRoot = (root, onlyGroup) => {
    if (!root) return;
    for (const el of root.querySelectorAll('[href*="#ac:"],[src*="#ac:"]')) {
      const attr = el.hasAttribute("href") ? "href" : "src";
      const val = el.getAttribute(attr);
      const m = val && RE_AC.exec(val);
      if (!m) continue;
      const g = m[1], idx = Number(m[2]);
      if (onlyGroup && g !== onlyGroup) continue;
      const real = w.__acAssets[g] && w.__acAssets[g][idx];
      if (real) {
        el.setAttribute(attr, real);
        if (attr === "href" && el.hasAttribute("xlink:href")) el.setAttribute("xlink:href", real);
      } else if (typeof w.applianceLoadAsset === "function") {
        w.applianceLoadAsset(g);
      }
    }
  };
  w.__acHydrateRoot = (root) => hydrateRoot(root);
  w.__acHydrateAssets = (group) => { roots.forEach((r) => hydrateRoot(r, group)); };
  w.__acImg = (group, idx) => {
    const arr = w.__acAssets[group];
    return (arr && arr[idx]) ? arr[idx] : \`\${BLANK}#ac:\${group}:\${idx}\`;
  };
  w.__acRegisterAssets = (group, list) => {
    w.__acAssets[group] = list;
    w.__acHydrateAssets(group);
  };
  if (typeof Element !== "undefined" && Element.prototype.attachShadow && !Element.prototype._acPatchedShadow) {
    const origAttach = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
      const sr = origAttach.call(this, init);
      if (this.localName && (this.localName.startsWith("appliance-") || this.localName.startsWith("ac-impl-appliance-"))) {
        roots.add(sr);
        if (typeof MutationObserver !== "undefined") {
          let pending = false;
          new MutationObserver(() => {
            if (pending) return;
            pending = true;
            Promise.resolve().then(() => { pending = false; hydrateRoot(sr); });
          }).observe(sr, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "src"] });
        }
      }
      return sr;
    };
    Element.prototype._acPatchedShadow = true;
  }
  const origAdd = w.addEventListener.bind(w);
  w.addEventListener = function (type, fn, opts) {
    if (type === "appliance-cards-ready") {
      w.__acWantAll = true;
      if (typeof w.applianceLoadAllCards === "function") w.applianceLoadAllCards();
    }
    return origAdd(type, fn, opts);
  };
})();
`;

const loader = `
/* On-demand lazy loader for card chunks (dist/cards/*.js) and image assets (dist/assets/*.js).
 * Only card-helpers and picker load on startup; standalone card chunks, editor-labels (i18n),
 * and photo asset packs load dynamically on demand when a card/editor/photo is actually rendered. */
(async () => {
  const w = window;
  const base = import.meta.url;
  const TAG_TO_CHUNK = ${JSON.stringify(tagToChunk)};
  const FORM_TAGS = new Set(${JSON.stringify(formTags)});
  const ALL_CHUNKS = ${JSON.stringify(standaloneNames)};
  const ASSET_GROUPS = ${JSON.stringify(assetNames)};
  const MANIFEST_CARDS = ${JSON.stringify(manifestCards)};

  w.customCards = w.customCards || [];
  const origPush = w.customCards.push.bind(w.customCards);
  w.customCards.push = function (...items) {
    let res = w.customCards.length;
    for (const item of items) {
      if (item && w.__acHideCustomCard && w.__acHideCustomCard(item)) continue;
      const idx = item && item.type ? w.customCards.findIndex((x) => x && x.type === item.type) : -1;
      if (idx >= 0) w.customCards[idx] = item;
      else res = origPush(item);
    }
    return res;
  };
  w.customCards.push(...MANIFEST_CARDS);

  const chunkPromises = new Map();
  const loadChunk = (name) => {
    if (!name) return Promise.resolve();
    let p = chunkPromises.get(name);
    if (!p) {
      p = import(new URL(\`cards/\${name}.js?v=${VERSION_STR}\`, base).href)
        .catch((e) => console.error(\`ha-appliance-electromenager-cards: chunk "\${name}" failed to load\`, e));
      chunkPromises.set(name, p);
    }
    return p;
  };
  w.applianceLoadChunk = loadChunk;
  w.applianceLoadChunkForTag = (tag) => loadChunk(TAG_TO_CHUNK[String(tag || "").toLowerCase()]);

  const assetPromises = new Map();
  w.applianceLoadAsset = (group) => {
    if (!group || w.__acAssets[group]) return Promise.resolve();
    let p = assetPromises.get(group);
    if (!p) {
      p = import(new URL(\`assets/\${group}.js?v=${VERSION_STR}\`, base).href)
        .catch((e) => console.error(\`ha-appliance-electromenager-cards: asset "\${group}" failed to load\`, e));
      assetPromises.set(group, p);
    }
    return p;
  };

  let allCardsPromise = null;
  let readyDispatched = false;
  w.applianceLoadAllCards = () => {
    if (!allCardsPromise) {
      allCardsPromise = Promise.all([
        loadChunk("card-helpers"),
        loadChunk("editor-labels"),
        Promise.allSettled(ASSET_GROUPS.map(w.applianceLoadAsset)),
      ]).then(() => Promise.allSettled(ALL_CHUNKS.map(loadChunk)))
        .then(() => {
          if (!readyDispatched) {
            readyDispatched = true;
            if (typeof w.__acApplySelectorPrefs === "function") w.__acApplySelectorPrefs(true);
            w.dispatchEvent(new Event("appliance-cards-ready"));
            if (typeof w.__acApplySelectorPrefs === "function") w.__acApplySelectorPrefs(false);
          }
        });
    }
    return allCardsPromise;
  };

  if (typeof customElements !== "undefined") {
    const ce = customElements;
    const origWhen = ce.whenDefined.bind(ce);
    const origGet = ce.get.bind(ce);
    const origDefine = ce.define.bind(ce);
    const REAL = {};
    const STUBS = new Set();
    const PENDING = new Map();
    w.__acHasReal = (tag) => {
      const k = String(tag || "").toLowerCase();
      return REAL[k] || (STUBS.has(k) ? undefined : origGet(tag));
    };
    const notifyReal = (k, cls) => {
      REAL[k] = cls;
      STUBS.delete(k);
      const list = PENDING.get(k);
      if (list) { PENDING.delete(k); list.forEach((fn) => fn(cls)); }
    };
    ce.define = function (tag, cls, opts) {
      const k = String(tag || "").toLowerCase();
      if (STUBS.has(k)) {
        const implTag = \`ac-impl-\${k}\`;
        if (!origGet(implTag)) origDefine(implTag, cls, opts);
        notifyReal(k, cls);
        return;
      }
      if (!origGet(tag)) origDefine(tag, cls, opts);
      REAL[k] = cls;
    };
    ce.whenDefined = function (tag) {
      const k = String(tag || "").toLowerCase();
      const baseTag = k.replace(/-editor$/, "");
      const chunkName = TAG_TO_CHUNK[k] || TAG_TO_CHUNK[baseTag];
      if (chunkName && !REAL[k]) {
        return loadChunk(chunkName).then(() => REAL[k] || origWhen(tag));
      }
      return origWhen(tag);
    };
    ce.get = function (tag) {
      const existing = origGet(tag);
      if (!existing) {
        const k = String(tag || "").toLowerCase();
        const chunkName = TAG_TO_CHUNK[k] || TAG_TO_CHUNK[k.replace(/-editor$/, "")];
        if (chunkName) loadChunk(chunkName);
      }
      return existing;
    };
    if (!w.__acWantAll && typeof HTMLElement !== "undefined") {
      const onReal = (k, fn) => {
        if (REAL[k]) { fn(REAL[k]); return; }
        let arr = PENDING.get(k);
        if (!arr) { arr = []; PENDING.set(k, arr); }
        arr.push(fn);
      };
      for (const [tag, chunkName] of Object.entries(TAG_TO_CHUNK)) {
        const k = tag.toLowerCase();
        const isForm = FORM_TAGS.has(k);
        if (!origGet(k)) {
          STUBS.add(k);
          const StubCard = class extends HTMLElement {
            static getStubConfig(hass) {
              loadChunk(chunkName);
              return REAL[k] && REAL[k].getStubConfig ? REAL[k].getStubConfig(hass) : {};
            }
            constructor() {
              super();
              this._cfg = null; this._h = null; this._impl = null;
              loadChunk(chunkName);
              onReal(k, (Cls) => this._mount(Cls));
            }
            connectedCallback() {
              if (this._impl && this._impl.parentNode !== this) {
                this.style.display = "block";
                this.style.height = "100%";
                this.replaceChildren(this._impl);
              }
            }
            _mount(Cls) {
              if (!this._impl) this._impl = new Cls();
              if (this.isConnected && this._impl.parentNode !== this) {
                this.style.display = "block";
                this.style.height = "100%";
                this.replaceChildren(this._impl);
              }
              if (this._pv !== undefined) this._impl.preview = this._pv;
              if (this._em !== undefined) this._impl.editMode = this._em;
              if (this._cfg) this._impl.setConfig(this._cfg);
              if (this._h) this._impl.hass = this._h;
            }
            get shadowRoot() { return this._impl ? this._impl.shadowRoot : super.shadowRoot; }
            get _config() { return this._impl ? this._impl._config : this._cfg; }
            setConfig(c) { this._cfg = c; if (this._impl) this._impl.setConfig(c); else loadChunk(chunkName); }
            set hass(h) { this._h = h; if (this._impl) this._impl.hass = h; }
            set preview(v) { this._pv = v; if (this._impl) this._impl.preview = v; }
            get preview() { return this._impl ? this._impl.preview : !!this._pv; }
            set editMode(v) { this._em = v; if (this._impl) this._impl.editMode = v; }
            get editMode() { return this._impl ? this._impl.editMode : !!this._em; }
            getCardSize() { return this._impl && this._impl.getCardSize ? this._impl.getCardSize() : 3; }
            getGridOptions() { return this._impl && this._impl.getGridOptions ? this._impl.getGridOptions() : { columns: 6, min_columns: 3, rows: "auto", min_rows: 1 }; }
          };
          if (isForm) {
            StubCard.getConfigForm = async () => {
              await loadChunk(chunkName);
              return REAL[k] && REAL[k].getConfigForm ? REAL[k].getConfigForm() : { schema: [] };
            };
          } else {
            StubCard.getConfigElement = () => document.createElement(\`\${k}-editor\`);
          }
          origDefine(k, StubCard);
        }
        const ek = \`\${k}-editor\`;
        if (!isForm && !origGet(ek)) {
          STUBS.add(ek);
          const StubEditor = class extends HTMLElement {
            constructor() {
              super();
              this._cfg = null; this._h = null; this._impl = null;
              loadChunk(chunkName);
              onReal(ek, (Cls) => {
                if (!this._impl) this._impl = new Cls();
                if (this.isConnected && this._impl.parentNode !== this) this.replaceChildren(this._impl);
                if (this._h) this._impl.hass = this._h;
                if (this._cfg) this._impl.setConfig(this._cfg);
              });
            }
            connectedCallback() {
              if (this._impl && this._impl.parentNode !== this) this.replaceChildren(this._impl);
            }
            setConfig(c) { this._cfg = c; if (this._impl) this._impl.setConfig(c); }
            set hass(h) { this._h = h; if (this._impl) this._impl.hass = h; }
          };
          origDefine(ek, StubEditor);
        }
      }
    }
  }
  if (typeof document !== "undefined" && document.createElement) {
    const origCreate = document.createElement.bind(document);
    document.createElement = function (tag, opts) {
      const chunkName = TAG_TO_CHUNK[String(tag || "").toLowerCase()];
      if (chunkName && !customElements.get(tag)) loadChunk(chunkName);
      return origCreate(tag, opts);
    };
  }

  await loadChunk("card-helpers");
  w.dispatchEvent(new Event("appliance-helpers-ready"));
  await loadChunk("picker");
  if (w.__acWantAll) await w.applianceLoadAllCards();
})();
`;
const out = load("header.js") + bootstrap + core + loader;

if (process.argv.includes("--check")) {
  const upToDate = (file, expected) => fs.existsSync(file) && read(file) === expected;
  let ok = upToDate(DIST, out);
  if (!ok) console.error(`dist/${NAME} is out of date.`);
  for (const name of chunkNames) {
    if (!upToDate(path.join(CARDS_DIR, `${name}.js`), chunks[name])) { ok = false; console.error(`dist/cards/${name}.js is out of date.`); }
  }
  for (const g of assetNames) {
    if (!upToDate(path.join(ASSETS_DIR, `${g}.js`), assetChunks[g])) { ok = false; console.error(`dist/assets/${g}.js is out of date.`); }
  }
  // dist/cards/ and dist/assets/ must not contain anything stale from a renamed/removed card
  const extra = fs.existsSync(CARDS_DIR) ? fs.readdirSync(CARDS_DIR).filter((f) => !chunkNames.includes(path.basename(f, ".js"))) : [];
  for (const f of extra) { ok = false; console.error(`dist/cards/${f} is not built by build.js (stale file?).`); }
  const extraAssets = fs.existsSync(ASSETS_DIR) ? fs.readdirSync(ASSETS_DIR).filter((f) => !assetNames.includes(path.basename(f, ".js"))) : [];
  for (const f of extraAssets) { ok = false; console.error(`dist/assets/${f} is not built by build.js (stale file?).`); }
  if (!ok) { console.error("run `node build.js` and commit the result."); process.exit(1); }
  console.log(`dist/ is up to date: ${NAME} + ${chunkNames.length} chunks + ${assetNames.length} assets (${langs.join(", ")}).`);
} else {
  fs.mkdirSync(path.dirname(DIST), { recursive: true });
  fs.writeFileSync(DIST, out);
  fs.rmSync(CARDS_DIR, { recursive: true, force: true });
  fs.mkdirSync(CARDS_DIR, { recursive: true });
  for (const name of chunkNames) fs.writeFileSync(path.join(CARDS_DIR, `${name}.js`), chunks[name]);
  fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  for (const g of assetNames) fs.writeFileSync(path.join(ASSETS_DIR, `${g}.js`), assetChunks[g]);
  console.log(`built dist/${NAME} + ${chunkNames.length} chunks in dist/cards/ + ${assetNames.length} assets in dist/assets/ (${langs.join(", ")}${warnings ? `, ${warnings} warning(s)` : ""}).`);
}
