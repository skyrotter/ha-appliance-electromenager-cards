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

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const NAME = "ha-appliance-electromenager-cards.js";
const DIST = path.join(ROOT, "dist", NAME);
const CARDS_DIR = path.join(ROOT, "dist", "cards");

/* The 26 core cards share one scope (one IIFE): order matters. */
const CORE_FILES = [
  "core/version.js",       // VERSION : à mettre à jour avant chaque release (vérifié par le workflow Release)
  "core/i18n.js",          // STRINGS, lang(), tr()
  "core/illustrations.js", // DEFS and drawing helpers, empty SVG object
  "core/svg/*.js",         // SVG.<kind> = illustration, one file per kind
  "core/definitions.js",   // DEF: what each kind shows and needs
  "core/helpers.js",       // state parsing and formatting
  "core/base.js",          // ApplianceCardBase
  "core/editor.js",        // visual editor schema, stub config
  "core/style.js",         // STYLE, built from CSS_FILES
  "core/register.js",      // defines the custom elements
];
/* Concatenated into STYLE: order matters (cascade). */
const CSS_FILES = [
  "card", "illustration-shared", "washer-dryer", "dishwasher", "water-heater", "oven-microwave",
  "radiator", "cooktop", "vmc", "solar", "freezers", "printer-3d", "pool-pump", "pellet-stove",
  "fridge", "air-fryer", "coffee-maker", "tv", "range-hood", "ac-split", "heat-pump",
  "towel-dryer", "server-rack", "desktop-pc", "laptop", "wine-cooler", "beer-tap", "av-receiver", "smart-speaker", "fan", "generic", "tool-charger", "ceiling-fan", "dehumidifier", "air-purifier", "monitor", "kettle-toaster", "plugs-piano-garland", "wet-vacuum", "dosing-pump", "fitness", "ps5", "thermomix", "cookeo", "printer",
].map((n) => `core/style/${n}.css`);
/* Self-contained cards, each in its own IIFE: built as separate lazy chunks
 * (dist/cards/<name>.js). card-helpers and editor-labels define the
 * window.appliance* helpers the other 56 call, so the loader awaits them
 * first; the rest load in parallel. */
const CARD_FILES = [
  "card-helpers", "editor-labels", "aquarium", "reef-aquarium", "linky", "battery", "ev-charger", "robot-vacuum", "robot-mower", "pellet-boiler", "gas-boiler", "water-heat-pump", "air-water-heat-pump", "diesel-heater", "jacuzzi", "internet-box", "pet-feeder", "portable-ac", "access", "sauna", "pumps", "pool-robot", "ups", "underfloor-heating", "lights", "shutters", "water-meter", "gas-meter", "electric-meter", "trv", "room-climate", "mailbox", "smoke-detector", "smart-lock", "cat-flap", "pet-fountain", "leak-detector", "mini-pc", "nas", "tv-box", "scale", "thermo-heater", "water-valves", "water-softener", "camera", "poe-switch", "raspberry-pi", "water-filter", "irrigation", "led-strip", "rain-gauge", "plant-monitor", "humidifier", "fan-heater", "inflatable-spa", "heat-meter", "picker", "zigbee-coordinator",
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
for (const f of walk("").filter((f) => /\.(js|css)$/.test(f) && !listed.has(f))) warn(`src/${f} is not listed in build.js`);

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
  return indent + before + JSON.stringify(table, null, 2).replace(/\n/g, `\n${indent}`);
});

/* ---- core (one shared IIFE) ---- */
const css = CSS_FILES.map(load).join("\n").replace(/[\\`]|\$\{/g, (c) => `\\${c}`);
let core = '(() => {\n"use strict";\n' + CORE_FILES.flatMap(expand).map(load).join("\n") + "})();\n";
const cssMarkers = core.split("/*@css*/``").length - 1;
if (cssMarkers !== 1) throw new Error(`expected one /*@css*/\`\` marker, found ${cssMarkers}`);
core = core.replace("/*@css*/``", () => "`\n" + css + "`");
core = substituteI18n(core);

/* ---- cards: one chunk per file, substituted independently ---- */
const chunkNames = CARD_FILES.map((f) => path.basename(f, ".js"));
const chunks = Object.fromEntries(CARD_FILES.map((f) => [path.basename(f, ".js"), substituteI18n(load(f))]));

for (const ns of Object.keys(i18n.en).filter((ns) => !usedI18n.has(ns))) warn(`en.json: namespace "${ns}" is not used by the source`);

/* ---- main file: header + core + the loader for the card chunks ---- */
const [first, second, ...rest] = chunkNames; // card-helpers, editor-labels, then the 56 lazy cards
const loader = `
/* Lazy-loaded card chunks (dist/cards/*.js, fetched by HACS like any other
 * file in dist/). card-helpers and editor-labels define the window.appliance*
 * helpers the other chunks call, so they load first and are awaited; the
 * rest load in parallel (their relative finish order isn't guaranteed).
 * Requires this file to be registered as an ES module (import()/import.meta
 * need it), which is how HACS/Lovelace load it. */
(async () => {
  const base = import.meta.url;
  const chunk = (name) => import(new URL(\`cards/\${name}.js\`, base).href);
  await chunk(${JSON.stringify(first)});
  await chunk(${JSON.stringify(second)});
  await Promise.all([${rest.map((n) => JSON.stringify(n)).join(", ")}].map(chunk));
  // Fires once every chunk has finished registering its card(s): anything that
  // needs to see the complete window.customCards list (e.g. the single-card
  // picker) must wait for this instead of assuming load order.
  window.dispatchEvent(new Event("appliance-cards-ready"));
})();
`;
const out = load("header.js") + core + loader;

if (process.argv.includes("--check")) {
  const upToDate = (file, expected) => fs.existsSync(file) && read(file) === expected;
  let ok = upToDate(DIST, out);
  if (!ok) console.error(`dist/${NAME} is out of date.`);
  for (const name of chunkNames) {
    if (!upToDate(path.join(CARDS_DIR, `${name}.js`), chunks[name])) { ok = false; console.error(`dist/cards/${name}.js is out of date.`); }
  }
  // dist/cards/ must not contain anything stale from a renamed/removed card
  const extra = fs.existsSync(CARDS_DIR) ? fs.readdirSync(CARDS_DIR).filter((f) => !chunkNames.includes(path.basename(f, ".js"))) : [];
  for (const f of extra) { ok = false; console.error(`dist/cards/${f} is not built by build.js (stale file?).`); }
  if (!ok) { console.error("run `node build.js` and commit the result."); process.exit(1); }
  console.log(`dist/ is up to date: ${NAME} + ${chunkNames.length} chunks (${langs.join(", ")}).`);
} else {
  fs.mkdirSync(path.dirname(DIST), { recursive: true });
  fs.writeFileSync(DIST, out);
  fs.rmSync(CARDS_DIR, { recursive: true, force: true });
  fs.mkdirSync(CARDS_DIR, { recursive: true });
  for (const name of chunkNames) fs.writeFileSync(path.join(CARDS_DIR, `${name}.js`), chunks[name]);
  console.log(`built dist/${NAME} + ${chunkNames.length} chunks in dist/cards/ (${langs.join(", ")}${warnings ? `, ${warnings} warning(s)` : ""}).`);
}
