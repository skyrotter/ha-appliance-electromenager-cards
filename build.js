#!/usr/bin/env node
/*
 * Builds dist/ha-appliance-electromenager-cards.js from src/ (HACS installs a
 * single file). No dependencies: files are concatenated in the order below,
 * like <script> tags in a page.
 *
 *   node build.js           write dist/
 *   node build.js --check   fail if dist/ is not up to date (used by CI)
 *
 * Markers replaced while building:
 *   /*@css*\/``               the CSS files of CSS_FILES, as a template literal
 *   /*@i18n <section>*\/{}    that section of every src/i18n/<lang>.json,
 *                             giving { en: {...}, fr: {...}, ... }
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
  "towel-dryer", "server-rack", "desktop-pc", "laptop", "wine-cooler", "beer-tap", "av-receiver", "fan", "generic", "tool-charger", "ceiling-fan", "dehumidifier", "monitor", "kettle-toaster", "plugs-piano-garland", "wet-vacuum", "ps5",
].map((n) => `core/style/${n}.css`);
/* Self-contained cards, each in its own IIFE. */
const CARD_FILES = [
  "editor-labels", "aquarium", "linky", "battery", "ev-charger", "robot-vacuum", "robot-mower", "pellet-boiler", "gas-boiler", "water-heat-pump", "diesel-heater", "jacuzzi", "access", "sauna", "pumps", "pool-robot", "ups", "underfloor-heating", "lights", "shutters", "water-meter",
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

/* ---- assemble ---- */
const css = CSS_FILES.map(load).join("\n").replace(/[\\`]|\$\{/g, (c) => `\\${c}`);
let out = load("header.js")
  + '(() => {\n"use strict";\n' + CORE_FILES.flatMap(expand).map(load).join("\n") + "})();\n"
  + CARD_FILES.map((f) => "\n" + load(f)).join("");

const cssMarkers = out.split("/*@css*/``").length - 1;
if (cssMarkers !== 1) throw new Error(`expected one /*@css*/\`\` marker, found ${cssMarkers}`);
out = out.replace("/*@css*/``", () => "`\n" + css + "`");

const used = new Set();
out = out.replace(/^([ \t]*)(.*?)\/\*@i18n (\w+)\*\/\{\}/gm, (_, indent, before, ns) => {
  if (!i18n.en[ns]) throw new Error(`namespace "${ns}" missing from src/i18n/en.json`);
  used.add(ns);
  const table = Object.fromEntries(langs.filter((l) => i18n[l][ns]).map((l) => [l, i18n[l][ns]]));
  return indent + before + JSON.stringify(table, null, 2).replace(/\n/g, `\n${indent}`);
});
for (const ns of Object.keys(i18n.en).filter((ns) => !used.has(ns))) warn(`en.json: namespace "${ns}" is not used by the source`);

if (process.argv.includes("--check")) {
  const current = fs.existsSync(DIST) ? read(DIST) : "";
  if (current !== out) {
    console.error(`dist/${NAME} is out of date: run \`node build.js\` and commit the result.`);
    process.exit(1);
  }
  console.log(`dist/${NAME} is up to date (${langs.join(", ")}).`);
} else {
  fs.writeFileSync(DIST, out);
  console.log(`built dist/${NAME} (${langs.join(", ")}${warnings ? `, ${warnings} warning(s)` : ""}).`);
}
