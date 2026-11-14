// Run with: node tests/portuguese.cjs (Node.js, no dependencies).
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const en = JSON.parse(read('src/i18n/en.json'));
const translations = {};
const tokens = (s) => [...s.matchAll(/\{\w+\}|`[^`]+`/g)].map((m) => m[0]).sort();
for (const language of ['pt-PT', 'pt-BR']) {
  const t = translations[language] = JSON.parse(read(`src/i18n/${language}.json`));
  assert.deepEqual(Object.keys(t).sort(), Object.keys(en).sort(), `${language}: sections`);
  for (const [section, strings] of Object.entries(en)) {
    assert.deepEqual(Object.keys(t[section]).sort(), Object.keys(strings).sort(), `${language}.${section}: keys`);
    for (const [key, english] of Object.entries(strings)) {
      const actual = t[section][key];
      assert.equal(typeof actual, 'string', `${language}.${section}.${key}`);
      assert.ok(actual.trim(), `${language}.${section}.${key}: empty translation`);
      assert.deepEqual(tokens(actual), tokens(english), `${language}.${section}.${key}: placeholders/configuration identifiers`);
    }
  }
}
// Execute the actual shared resolver and helpers with translation markers filled.
const context = vm.createContext({ window: {}, document: { documentElement: { lang: 'en' }, querySelector: () => null } });
const inline = (source) => source.replace(/\/\*@i18n (\w+)\*\/\{\}/g, (_, section) => JSON.stringify({
  en: en[section], ...Object.fromEntries(Object.entries(translations).map(([l, t]) => [l, t[section]])),
}));
vm.runInContext(inline(read('src/core/i18n.js')), context);
vm.runInContext(read('src/cards/card-helpers.js'), context);
// Editors list only their card's translations, with consistent names and unchanged config values.
const languageField = context.window.applianceLanguageField;
const options = languageField({ en: {}, 'pt-BR': {}, 'pt-PT': {}, 'sr-Latn': {}, zz: {} }).selector.select.options;
assert.equal(languageField({ en: {} }).name, 'language');
assert.deepEqual(Array.from(options, (o) => o.value), ['en', 'pt-BR', 'pt-PT', 'sr-Latn', 'zz']);
assert.deepEqual(Array.from(options, (o) => o.label), ['English', 'Português (Brasil)', 'Português (Portugal)', 'Srpski (latinica)', 'zz']);
assert.deepEqual(Array.from(languageField({ 'pt-BR': {} }).selector.select.options, (o) => o.value), ['pt-BR']);
const resolve = context.window.applianceResolveLanguage;
const table = { en: {}, fr: {}, nb: {}, sr: {}, 'sr-Latn': {}, 'pt-PT': {}, 'pt-BR': {} };
for (const [input, expected] of Object.entries({
  'pt-PT': 'pt-PT', 'pt-pt': 'pt-PT', pt_PT: 'pt-PT', 'PT-pt': 'pt-PT',
  'pt-BR': 'pt-BR', 'pt-br': 'pt-BR', pt_BR: 'pt-BR', PT_BR: 'pt-BR',
  pt: 'pt-PT', 'pt-AO': 'pt-PT', 'fr-FR': 'fr', no: 'nb', 'nn-NO': 'nb',
  'sr-latn': 'sr-Latn', sr_Latn: 'sr-Latn', sr: 'sr', 'xx-ZZ': 'en',
})) assert.equal(resolve(table, input), expected, input);
assert.equal(resolve({ en: {}, pt: {} }, 'pt-BR'), 'pt', 'generic table fallback');
assert.equal(resolve({ en: {} }, 'pt-PT'), 'en', 'untranslated table fallback');
assert.equal(resolve({ en: {} }, 'constructor'), 'en', 'object prototype properties are not languages');
assert.equal(resolve(Object.assign(Object.create({ fr: {} }), { en: {} }), 'fr'), 'en', 'inherited translation entries are ignored');
const hass = { language: 'pt-PT', locale: { language: 'pt-BR' } };
assert.equal(context.window.applianceLang(table, {}, hass), 'pt-BR', 'HA locale takes precedence');
assert.equal(context.window.applianceLang(table, { language: 'pt_PT' }, hass), 'pt-PT', 'explicit override');
context.testHass = hass;
assert.equal(vm.runInContext("tr(testHass, 'fridge')", context), 'Geladeira', 'core card BR strings');
context.testHass = { language: 'pt' };
assert.equal(vm.runInContext("tr(testHass, 'fridge')", context), 'Frigorífico', 'core card generic pt fallback');
context.testHass = { language: 'pt-BR' };
vm.runInContext("delete STRINGS['pt-BR'].washer", context);
assert.equal(vm.runInContext("tr(testHass, 'washer')", context), 'Washing machine', 'missing key falls back to English');
assert.equal(translations['pt-PT'].common.washer, 'Máquina de lavar roupa');
assert.equal(translations['pt-BR'].common.washer, 'Lavadora de roupas');
for (const t of Object.values(translations)) {
  assert.equal(t.ups.runtime, 'Autonomia', 'UPS runtime is remaining battery autonomy');
  assert.equal(t.pump.runtime, 'Tempo de funcionamento', 'pump runtime is elapsed operating time');
  assert.equal(t.robot_vacuum.time, 'Duração', 'vacuum duration is not time of day');
  assert.equal(t.pet_feeder.source, 'Última alimentação', 'Last feed must retain its meaning');
}
console.log('Portuguese checks passed: complete keys, placeholders, regional resolution, overrides and core strings.');
