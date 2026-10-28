// Quiet Thread check: the five Town Hall clues can be found by a scripted path, the series save
// ('uptime.series') keeps quietThread across reload, New game, export code and import, the
// end-of-slice summary shows the right line for >=3 and <3 clues, and slice completion is not blocked.
// Setup jumps the state to Day 2 through the debug hook (__UPTIME.state()); every clue is then
// reached with real keyboard input: walking, facing, A, menu choices.
// Usage: node quiet.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = {};
let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info) : ''); if (!ok) failed = true; }

async function session(browser, opts) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(7); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  // Pick a menu/choice option whose label matches re (keyboard only).
  async function pickLabel(re) {
    const p = await peek(); const u = p.ui;
    const idx = u.options.findIndex(o => re.test(o.label) && !o.disabled);
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options.map(o => o.label)));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 20) await press(u.type === 'modal' ? 'down' : 'right');
    await press('a');
  }
  // Advance dialogue; answer choices with the first matching regex (or the last option = leave/not yet).
  const modals = [];
  async function settle(prefs) {
    for (let i = 0; i < 200; i++) {
      await sleep(25);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return; continue; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal') modals.push(await page.textContent('#modal'));
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label)));
      if (re) await pickLabel(re); else await pickLabel(/./);
    }
    const pp = await peek(); throw new Error('settle timed out: ' + JSON.stringify({ui: pp.ui, busy: pp.busy, map: pp.map, x: pp.x, y: pp.y}).slice(0, 600));
  }
  async function newGame() { await pickLabel(/New game/); await settle(); }
  function bfs(p, gx, gy, onTile) {
    const H = p.solid.length, W = p.solid[0].length, doors = new Set(Object.keys(p.doors || {}));
    const ok = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !p.solid[y][x] && (!doors.has(x + ',' + y) || (x === gx && y === gy)) && !(p.map === 'hub' && y >= 11);
    const goals = onTile ? [[gx, gy]] : Object.values(DIR).map(([dx, dy]) => [gx + dx, gy + dy]).filter(([x, y]) => ok(x, y));
    const prev = new Map([[p.x + ',' + p.y, null]]), q = [[p.x, p.y]];
    while (q.length) {
      const [x, y] = q.shift();
      if (goals.some(([a, b]) => a === x && b === y)) { const out = []; let k = x + ',' + y; while (prev.get(k)) { const [d, pk] = prev.get(k); out.unshift(d); k = pk; } return out; }
      for (const [d, [dx, dy]] of Object.entries(DIR)) { const nx = x + dx, ny = y + dy, nk = nx + ',' + ny; if (!prev.has(nk) && ok(nx, ny)) { prev.set(nk, [d, x + ',' + y]); q.push([nx, ny]); } }
    }
    throw new Error('no path to ' + gx + ',' + gy + ' on ' + p.map);
  }
  async function stepOnce(d) {
    const p0 = await peek(); const before = [p0.map, p0.x, p0.y].join();
    await press(d);
    for (let i = 0; i < 80; i++) { await sleep(15); const q = await peek(); if (q.ui) { await settle(); return; } if (!q.moving && !q.busy && [q.map, q.x, q.y].join() !== before) return; }
  }
  // Walk next to (map,x,y), face it and press A.
  async function interactAt(map, x, y, prefs) {
    for (let n = 0; n < 200; n++) {
      const p = await peek();
      if (p.map !== map) { const door = p.map === 'desk' ? [9, 10] : [4, 6]; const path = bfs(p, door[0], door[1], true); await stepOnce(path.length ? path[0] : (p.map === 'desk' ? 'down' : 'up')); continue; }
      const path = bfs(p, x, y, false);
      if (path.length) { await stepOnce(path[0]); continue; }
      const d = Object.entries(DIR).find(([, [dx, dy]]) => p.x + dx === x && p.y + dy === y)[0];
      if (p.dir !== d) { await press(d); await sleep(40); }
      await press('a'); await settle(prefs); return;
    }
    throw new Error('could not reach ' + map + ' ' + x + ',' + y);
  }
  async function modalText() { return page.textContent('#modal'); }
  const summaryText = () => modals.filter(t => /Front Desk district: secured/.test(t)).pop() || '';
  return { ctx, page, errors, requests, peek, press, pickLabel, settle, newGame, interactAt, modalText, summaryText };
}

// Day 2, onboarding and the open port done; party chosen per test.
function setupDay2(party) {
  return s => s.page.evaluate(party => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: party[0], kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true });
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 2;
    G.party = party.map(id => ({ id, lvl: 3, xp: 0, tuned: false }));
  }, party);
}
const PREF = [/Ledger console/, /Lanternkeep: inspect/, /Ask about the router/];
const SENTRY = [/Sentry: look/], LEDGER = [/Ledger: check/];

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();

  // ---- 1. Full scripted path: all five clues ----
  const s = await session(browser);
  await s.newGame();
  // Day 1, logs on: PCs offer nothing extra and no clue is recorded yet.
  await s.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, { starter: 'sentry', kiosk: true, wifi: true, logs: true }); G.party = [{ id: 'sentry', lvl: 3, xp: 0, tuned: false }, { id: 'ledger', lvl: 3, xp: 0, tuned: false }]; });
  await s.interactAt('desk', 14, 2, LEDGER);
  check('day1: no clue before the night it happens', (await s.peek()).qt.cluesFound.length === 0, (await s.peek()).qt);
  // Day 2 without Lanternkeep: the closet only hints.
  await setupDay2(['sentry', 'ledger'])(s);
  await s.interactAt('desk', 1, 1, PREF);
  check('closet without a network tool gives no clue', (await s.peek()).qt.cluesFound.length === 0);
  await setupDay2(['sentry', 'ledger', 'lantern'])(s);
  // Wrong PCs: ordinary results, no clue.
  await s.interactAt('desk', 17, 2, SENTRY);
  await s.interactAt('desk', 11, 2, LEDGER);
  check('ordinary PCs give no clue', (await s.peek()).qt.cluesFound.length === 0);
  const order = [
    ['th-signin', 'desk', 16, 7, PREF],
    ['th-logclear', 'desk', 14, 2, LEDGER],
    ['th-router', 'desk', 1, 1, PREF],
    ['th-schtask', 'desk', 11, 2, SENTRY],
    ['th-reboot', 'hub', 17, 7, PREF]
  ];
  for (const [id, map, x, y, prefs] of order) {
    await s.interactAt(map, x, y, prefs);
    const q = (await s.peek()).qt;
    check('clue ' + id, q.cluesFound.includes(id), q);
    if (q.cluesFound.length === 3) check('stage 2 at three clues', q.stage === 2, q);
  }
  const q5 = (await s.peek()).qt;
  check('five clues, stage 2, not evicted', q5.cluesFound.length === 5 && q5.stage === 2 && q5.evicted === false, q5);
  check('never in a battle', !(await s.peek()).battle);
  // Field Manual chapter via the Start menu.
  await s.press('start'); await sleep(80);
  await s.pickLabel(/Field Manual/); await sleep(80);
  const fm = await s.modalText();
  check('Field Manual shows the Unexplained chapter', /Unexplained/.test(fm) && /long campaign/.test(fm));
  check('Field Manual shows every clue technique', ['T1078', 'T1090', 'T1685.005', 'T1053.005', 'T1584.008'].every(t => fm.includes(t)));
  check('Field notes cite AA24-038A (February 2024)', /Field notes/.test(fm) && /AA24-038A/.test(fm) && /February 2024/.test(fm));
  await s.press('b'); await sleep(60); await s.press('b'); await s.settle();
  // Save, then reload: Continue restores quietThread from the series namespace.
  const stored = await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')));
  check('series key holds quietThread', stored && stored.quietThread && stored.quietThread.cluesFound.length === 5, stored);
  const editionSave = await s.page.evaluate(() => localStorage.getItem('uptime.slice1.save'));
  check('edition save is a separate key', !!editionSave && editionSave.startsWith('UPT1.'));
  const code = await s.page.evaluate(() => encodeSave(__UPTIME.state()));
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const qr = (await s.peek()).qt;
  check('quietThread kept across reload (Continue)', qr.cluesFound.length === 5 && qr.stage === 2, qr);
  // Summary with 5 clues; slice completion not blocked.
  await s.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, { vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true }); G.map = 'desk'; G.x = 15; G.y = 6; });
  await s.interactAt('desk', 16, 6, [/Keep exploring/]);
  const sum5 = s.summaryText();
  check('>=3 clues: summary says something quiet is moving', /Something quiet is moving in the network/.test(sum5) && /Hunt mode opens later/.test(sum5));
  const p5 = await s.peek();
  // Front Desk complete: the objective is either done or has moved on to the Mail Room (district 2).
  const fdDone = o => o.done === true || o.district === 'mail';
  check('slice completes with the thread unresolved', p5.summary && fdDone(p5.objective), p5.objective);
  // New game in the same browser: the edition restarts, the series record stays.
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.newGame();
  check('series survives New game', (await s.peek()).qt.cluesFound.length === 5);
  results.session1Errors = s.errors; results.session1Requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- 2. Export code carries the thread to a fresh browser (Import merges into the series) ----
  const s2 = await session(browser);
  check('fresh browser starts with an empty thread', (await s2.page.evaluate(() => __UPTIME.series().quietThread.cluesFound.length)) === 0);
  await s2.pickLabel(/Import save code/); await sleep(60);
  await s2.page.fill('#codebox', code);
  await s2.page.evaluate(() => document.activeElement.blur()); // keys are ignored while the textarea has focus
  await s2.pickLabel(/^Load$/); await s2.settle();
  const q2 = await s2.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread);
  check('import merges quietThread into the series save', q2.cluesFound.length === 5 && q2.stage === 2, q2);
  results.session2Errors = s2.errors; if (s2.errors.length || s2.requests.length) failed = true;
  await s2.ctx.close();

  // ---- 3. Fewer than three clues: only a subtle line, completion still fine ----
  const s3 = await session(browser);
  await s3.newGame();
  await setupDay2(['ledger', 'lantern'])(s3);
  await s3.interactAt('desk', 16, 7, PREF);
  await s3.interactAt('desk', 14, 2, LEDGER);
  const q3 = (await s3.peek()).qt;
  check('two clues, stage 1', q3.cluesFound.length === 2 && q3.stage === 1, q3);
  await s3.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, { vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true }); });
  // Talk to Rae; settle() records the end-of-slice page text before choosing "Keep exploring".
  await s3.interactAt('desk', 16, 6, [/Keep exploring/]);
  const summaryText = s3.summaryText();
  check('<3 clues: no explicit line', !/Something quiet|Hunt mode/.test(summaryText), summaryText);
  check('<3 clues: a subtle line only', /closet router blinked/.test(summaryText), summaryText.slice(-300));
  const p3 = await s3.peek();
  check('slice completes with <3 clues', p3.summary && (p3.objective.done === true || p3.objective.district === 'mail'), p3.objective);
  results.session3Errors = s3.errors; if (s3.errors.length || s3.requests.length) failed = true;
  await s3.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('QUIET TEST FAILED:', e.message); process.exit(2); });
