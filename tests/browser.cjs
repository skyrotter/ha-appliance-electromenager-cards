// Run with: node tests/browser.cjs (Node.js + local Chromium/Chrome/Edge, no npm deps).
'use strict';
const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.css': 'text/css' };

function findBrowser() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  const candidates = process.platform === 'win32'
    ? [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  for (const cmd of ['google-chrome', 'chromium', 'chromium-browser', 'chrome', 'msedge']) {
    try {
      const out = execFileSync(process.platform === 'win32' ? 'where.exe' : 'which', [cmd], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split(/\r?\n/)[0];
      if (out && fs.existsSync(out)) return out;
    } catch {}
  }
  return null;
}

function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath === '/__lazy_probe__.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!doctype html><script type="module" src="/dist/ha-appliance-electromenager-cards.js"></script>
<script>
customElements.define('ha-card', class extends HTMLElement{});
customElements.define('ha-icon', class extends HTMLElement{});
window.addEventListener('appliance-helpers-ready', async () => {
  const w = document.createElement('appliance-washer-card');
  w.setConfig({ entity: 'sensor.w' });
  document.body.appendChild(w);
  await new Promise(r => setTimeout(r, 200));
  const idleResources = performance.getEntriesByType('resource').map(e => new URL(e.name).pathname);
  await customElements.whenDefined('appliance-nas-card');
  const nas = document.createElement('appliance-nas-card');
  nas.setConfig({ model: 'synology_ds224', entity_cpu: 'sensor.c' });
  document.body.appendChild(nas);
  nas.hass = { states: { 'sensor.c': { entity_id: 'sensor.c', state: '10', attributes: { unit_of_measurement: '%' } } }, language: 'en', locale: { language: 'en' }, config: {} };
  await new Promise(r => setTimeout(r, 400));
  const nasHref = nas.shadowRoot.querySelector('image.photo')?.getAttribute('href') || '';
  const nasElCls = customElements.get('appliance-nas-card');
  const nasEd = nasElCls && nasElCls.getConfigElement ? nasElCls.getConfigElement() : null;
  if (nasEd) { document.body.appendChild(nasEd); await new Promise(r => setTimeout(r, 150)); }
  const formTags = [
    'appliance-battery-card', 'appliance-aquarium-card', 'appliance-ev-charger-card',
    'appliance-linky-card', 'appliance-pellet-boiler-card', 'appliance-robot-mower-solo-card',
    'appliance-robot-vacuum-solo-card', 'appliance-water-heat-pump-card', 'appliance-air-water-heat-pump-card',
  ];
  const formResults = {};
  for (const tag of formTags) {
    const cls = customElements.get(tag);
    const hasGetConfigElement = !!(cls && cls.getConfigElement);
    const form = cls && cls.getConfigForm ? await cls.getConfigForm() : null;
    formResults[tag] = {
      hasGetConfigElement,
      schemaLen: form && Array.isArray(form.schema) ? form.schema.length : 0,
    };
  }
  window.__lazyProbe = {
    adoptedCount: w.shadowRoot.adoptedStyleSheets ? w.shadowRoot.adoptedStyleSheets.length : 0,
    inlineStyleTags: w.shadowRoot.querySelectorAll('style').length,
    idleResources,
    afterNasResources: performance.getEntriesByType('resource').map(e => new URL(e.name).pathname),
    nasHrefLen: nasHref.length,
    nasHydrated: nasHref.startsWith('data:image/webp;base64,') && !nasHref.includes('#ac:'),
    nasEditorLen: nasEd ? nasEd.innerHTML.length : 0,
    formResults,
  };
});
</script>`);
        return;
      }
      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      const fp = path.join(ROOT, safePath === path.sep ? 'docs/tests.html' : safePath);
      if (!fp.startsWith(ROOT) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
        res.writeHead(404); res.end('Not found'); return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
      fs.createReadStream(fp).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

(async () => {
  const browser = findBrowser();
  if (!browser) throw new Error('No Chrome/Chromium/Edge binary found (set CHROME_BIN to override).');
  const { srv, port } = await startServer();
  const userDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ac-ci-browser-'));
  const proc = spawn(browser, ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=0', `--user-data-dir=${userDir}`, 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    let stderr = '';
    const wsUrl = await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Browser DevTools timeout: ${stderr}`)), 15000);
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
        const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) { clearTimeout(t); resolve(m[1]); }
      });
    });
    const listUrl = wsUrl.replace('ws://', 'http://').replace(/\/devtools\/browser\/.*/, '/json/list');
    const targets = await (await fetch(listUrl)).json();
    const pageWs = new WebSocket(targets[0].webSocketDebuggerUrl);
    await new Promise((r) => pageWs.addEventListener('open', r));

    let msgId = 0;
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++msgId;
      const onMsg = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.id === id) {
          pageWs.removeEventListener('message', onMsg);
          if (m.error) reject(new Error(m.error.message)); else resolve(m.result);
        }
      };
      pageWs.addEventListener('message', onMsg);
      pageWs.send(JSON.stringify({ id, method, params }));
    });

    await call('Page.enable');
    await call('Runtime.enable');
    const uncaught = [];
    pageWs.addEventListener('message', (ev) => {
      const m = JSON.parse(ev.data);
      if (m.method === 'Runtime.exceptionThrown') uncaught.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    });

    // 1. Verify on-demand lazy loading + adoptedStyleSheets
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/__lazy_probe__.html` });
    let lazy = null;
    for (let i = 0; i < 40; i++) {
      const r = await call('Runtime.evaluate', { expression: 'window.__lazyProbe', returnByValue: true });
      if (r.result && r.result.value) { lazy = r.result.value; break; }
      await new Promise((r) => setTimeout(r, 200));
    }
    assert.ok(lazy, 'lazy-load probe did not finish');
    assert.equal(lazy.adoptedCount, 1, 'ApplianceCardBase must use adoptedStyleSheets');
    assert.equal(lazy.inlineStyleTags, 0, 'ApplianceCardBase must not inline <style>');
    assert.equal(lazy.idleResources.filter((p) => p.endsWith('.js')).length, 3, `expected 3 JS files on startup, got ${lazy.idleResources.join(', ')}`);
    assert.ok(lazy.afterNasResources.includes('/dist/cards/nas.js') && lazy.afterNasResources.includes('/dist/assets/nas.js'), 'expected on-demand nas chunk & asset');
    assert.ok(lazy.nasHydrated && lazy.nasHrefLen > 5000, 'nas photo must hydrate to real WebP');
    assert.ok(lazy.nasEditorLen > 0, 'nas getConfigElement() must mount a non-empty editor');
    for (const [tag, res] of Object.entries(lazy.formResults)) {
      assert.equal(res.hasGetConfigElement, false, `${tag} must not define getConfigElement on its stub`);
      assert.ok(res.schemaLen > 0, `${tag} getConfigForm() must return a non-empty schema`);
    }

    // 2. Run full docs/tests.html suite
    await call('Page.addScriptToEvaluateOnNewDocument', { source: 'localStorage.setItem("applianceCardsSinglePicker", "0");' });
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/docs/tests.html` });
    let suite = null;
    for (let i = 0; i < 120; i++) {
      const r = await call('Runtime.evaluate', {
        expression: `(() => {
          const s = document.getElementById('sum')?.textContent || '';
          if (!s || s === '…') return null;
          const fails = [...document.querySelectorAll('#res tr')].filter(tr => tr.querySelector('.f')).map(tr => tr.textContent.trim());
          return { sum: s, failCount: fails.length, fails, errors: window.__errors || [] };
        })()`,
        returnByValue: true,
      });
      if (r.result && r.result.value) { suite = r.result.value; break; }
      await new Promise((r) => setTimeout(r, 250));
    }
    assert.ok(suite, 'docs/tests.html timed out');
    assert.deepEqual(uncaught, [], `uncaught page exceptions: ${uncaught.join('; ')}`);
    assert.deepEqual(suite.errors, [], `window.__errors: ${suite.errors.join('; ')}`);
    assert.equal(suite.failCount, 0, `failing browser tests (${suite.failCount}):\n${suite.fails.join('\n')}`);
    console.log(`Browser checks passed: ${suite.sum} (lazy startup: 3 JS files, adoptedStyleSheets: OK).`);
    pageWs.close();
  } finally {
    proc.kill();
    srv.close();
    setTimeout(() => { try { fs.rmSync(userDir, { recursive: true, force: true }); } catch {} process.exit(0); }, 300);
  }
})();
