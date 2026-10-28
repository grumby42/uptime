// Layout check: every pad button and the screen fit inside the viewport (phone portrait + landscape), desktop has no overflow.
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const res = {};
  for (const [name, opt] of Object.entries({
    phone: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt); const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto(FILE); await p.waitForTimeout(300);
    await p.tap ? null : null;
    await p.evaluate(() => { document.querySelector('#mopts [data-i="0"]').click(); });
    await p.waitForTimeout(600);
    res[name] = await p.evaluate(() => {
      const W = innerWidth, H = innerHeight, out = [];
      document.querySelectorAll('[data-btn], #screen').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.left < 0 || r.right > W + 0.5 || r.top < 0 || r.bottom > H + 0.5)) out.push(e.dataset.btn || e.id); });
      const sc = document.getElementById('screen').getBoundingClientRect();
      return { offscreen: out, screen: [sc.width, sc.height], scrollW: document.documentElement.scrollWidth, W, errs: 0 };
    });
    res[name].errs = errs;
    await p.screenshot({ path: OUT + '/layout-' + name + '.png' });
    await c.close();
  }
  // Series menu (repo root index.html): fits a phone, no network, and its link opens the built edition.
  {
    const c = await b.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true }); const p = await c.newPage(); const errs = [], reqs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    const scrollW = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.screenshot({ path: OUT + '/layout-menu.png' });
    await p.click('a.ed'); await p.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui, null, { timeout: 5000 });
    res.menu = { scrollW, W: 360, opensGame: /editions\/town-hall\/index\.html$/.test(p.url()), errs, reqs };
    await c.close();
  }
  console.log(JSON.stringify(res)); await b.close();
})();
