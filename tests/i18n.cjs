// Run with: node tests/i18n.cjs (Node.js, no dependencies).
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const i18nDir = path.resolve(__dirname, '../src/i18n');
const files = fs.readdirSync(i18nDir).filter((f) => f.endsWith('.json')).sort();
assert.ok(files.includes('en.json'), 'src/i18n/en.json is required');

// Strict JSON token scanner to catch duplicate keys inside the same object (JSON.parse silently overwrites them).
function assertNoDuplicateJsonKeys(text, label) {
  let i = 0;
  const n = text.length;
  const skipWs = () => { while (i < n && /\s/.test(text[i])) i++; };
  const readStr = () => {
    assert.equal(text[i], '"', `${label}: expected string at ${i}`);
    i++;
    let out = '';
    while (i < n) {
      const ch = text[i++];
      if (ch === '"') return out;
      if (ch === '\\') {
        const esc = text[i++];
        if (esc === 'u') { out += String.fromCharCode(parseInt(text.slice(i, i + 4), 16)); i += 4; }
        else out += ({ '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' }[esc] ?? esc);
      } else out += ch;
    }
    throw new Error(`${label}: unterminated string`);
  };
  const readVal = (prefix) => {
    skipWs();
    const ch = text[i];
    if (ch === '{') {
      i++;
      skipWs();
      const seen = new Set();
      if (text[i] === '}') { i++; return; }
      while (i < n) {
        skipWs();
        const key = readStr();
        const fullKey = prefix ? `${prefix}.${key}` : key;
        assert.ok(!seen.has(key), `${label}: duplicate JSON key "${fullKey}"`);
        seen.add(key);
        skipWs();
        assert.equal(text[i++], ':', `${label}: expected ':' after "${fullKey}"`);
        readVal(fullKey);
        skipWs();
        if (text[i] === ',') { i++; continue; }
        assert.equal(text[i++], '}', `${label}: expected '}' or ',' after "${fullKey}"`);
        return;
      }
      throw new Error(`${label}: unterminated object at ${prefix}`);
    }
    if (ch === '[') {
      i++;
      skipWs();
      if (text[i] === ']') { i++; return; }
      let idx = 0;
      while (i < n) {
        readVal(`${prefix}[${idx++}]`);
        skipWs();
        if (text[i] === ',') { i++; continue; }
        assert.equal(text[i++], ']', `${label}: expected ']' or ','`);
        return;
      }
      throw new Error(`${label}: unterminated array at ${prefix}`);
    }
    if (ch === '"') { readStr(); return; }
    const m = text.slice(i).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
    assert.ok(m, `${label}: unexpected token near offset ${i}`);
    i += m[0].length;
  };
  readVal('');
  skipWs();
  assert.equal(i, n, `${label}: trailing characters after JSON document`);
}

const ph = (s) => [...s.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort();
const parsed = {};
for (const file of files) {
  const raw = fs.readFileSync(path.join(i18nDir, file), 'utf8');
  assertNoDuplicateJsonKeys(raw, file);
  parsed[file] = JSON.parse(raw);
}

const en = parsed['en.json'];
for (const file of files) {
  if (file === 'en.json') continue;
  const tr = parsed[file];
  for (const ns of Object.keys(tr)) {
    assert.ok(ns in en, `${file}: namespace "${ns}" is not in en.json`);
  }
  const checkNode = (actualNode, englishNode, where) => {
    assert.ok(actualNode && typeof actualNode === 'object' && !Array.isArray(actualNode), `${where}: expected object`);
    for (const [k, actual] of Object.entries(actualNode)) {
      assert.ok(k in englishNode, `${where}.${k}: key is not in en.json`);
      const english = englishNode[k];
      if (english && typeof english === 'object') {
        checkNode(actual, english, `${where}.${k}`);
      } else {
        assert.equal(typeof actual, 'string', `${where}.${k}: expected string`);
        assert.ok(actual.trim(), `${where}.${k}: empty translation`);
        assert.deepEqual(ph(actual), ph(english), `${where}.${k}: placeholder mismatch`);
      }
    }
  };
  for (const [ns, node] of Object.entries(tr)) checkNode(node, en[ns], `${file}.${ns}`);
}

console.log(`i18n checks passed: ${files.length} files, zero duplicate keys, zero unknown keys, all placeholders valid.`);
