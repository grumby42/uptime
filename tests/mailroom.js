// Mail Room checks (Town Hall district 2). Setup jumps the state past the Front Desk through the debug hook
// (__UPTIME.state()); everything after that uses real keyboard input: walking, facing, A, menu choices.
// Covers: the Key Badge door, arrival, the inbox room (a wrong call, then right), drill 1 with a broad query,
// save/reload mid-Mail Room, drill 2 with a specific Tally question, drill 3 with Tally given "everything"
// (it truncates and is wrong), the Quiet Thread mailbox clues, the alert mix (home threats x3, Mail Room threats
// absent before arrival, Lure halved by the Seal Badge), time to quarantine from a real Quarantine, and the
// drill modal on a 360x800 phone.
// Usage: node mailroom.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = {};
let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info).slice(0, 400) : ''); if (!ok) failed = true; }

async function session(browser, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts || { viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(11); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  const modalText = () => page.textContent('#modal');
  async function waitUI(type) { for (let i = 0; i < 200; i++) { const p = await peek(); if (p.ui && (!type || p.ui.type === type)) return p; await sleep(15); } throw new Error('no ui ' + type); }
  async function pickLabel(re) {
    const p = await waitUI(); const u = p.ui;
    const idx = u.options.findIndex(o => re.test(o.label) && !o.disabled);
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options.map(o => o.label)));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 30) await press(u.type === 'modal' ? 'down' : 'right');
    await press('a'); await sleep(20);
  }
  // Advance dialogue; answer choices/modals with the first matching regex, else the option marked good, else the first.
  async function settle(prefs) {
    for (let i = 0; i < 400; i++) {
      await sleep(20);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return; continue; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal' && p.ui.multi) {
        const todo = p.ui.options.findIndex((o, i) => o.meta && o.meta.good && !p.ui.sel.includes(i));
        const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
        let guard = 0; while ((await peek()).ui.cursor !== idx && guard++ < 30) await press('down');
        await press('a'); await sleep(20); continue;
      }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      if (re) { await pickLabel(re); continue; }
      const g = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
      await pickLabel(g >= 0 ? new RegExp('^' + p.ui.options[g].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') : /./);
    }
    throw new Error('settle timed out: ' + JSON.stringify((await peek()).ui).slice(0, 300));
  }
  // Advance only 'say' boxes until a modal/choice appears (or nothing is busy).
  async function untilChoice() {
    for (let i = 0; i < 300; i++) { await sleep(15); const p = await peek(); if (p.ui && p.ui.type !== 'say') return p; if (p.ui) { await press('a'); continue; } if (!p.busy) return p; }
    throw new Error('untilChoice timed out');
  }
  async function doors() { return page.evaluate(() => Object.fromEntries(Object.entries(MAPS).map(([k, v]) => [k, Object.entries(v.doors || {}).filter(([, d]) => d.to && !d.locked).map(([xy, d]) => [xy, d.to])]))); }
  function bfs(p, gx, gy, onTile) {
    const H = p.solid.length, W = p.solid[0].length, ds = new Set(Object.keys(p.doors || {}));
    const ok = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !p.solid[y][x] && (!ds.has(x + ',' + y) || (x === gx && y === gy));
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
    for (let i = 0; i < 80; i++) { await sleep(15); const q = await peek(); if (q.ui) return 'ui'; if (!q.moving && !q.busy && [q.map, q.x, q.y].join() !== before) return; }
  }
  // Walk to (map,x,y) (onto it if onTile, else next to it, facing it, and press A). Stops at any UI that pops up.
  async function goTo(map, x, y, onTile) {
    for (let n = 0; n < 400; n++) {
      const p = await peek();
      if (p.ui || p.busy) return 'ui';
      if (p.map !== map) {
        const D = await doors(), prev = new Map([[p.map, null]]), q = [p.map]; let hop = null;
        while (q.length) { const m = q.shift(); if (m === map) { let k = m; while (prev.get(k)) { hop = prev.get(k); k = hop[0]; } break; } for (const [xy, t] of D[m] || []) if (!prev.has(t)) { prev.set(t, [m, xy]); q.push(t); } }
        const [dx, dy] = hop[1].split(',').map(Number); const path = bfs(p, dx, dy, true);
        if (await stepOnce(path.length ? path[0] : p.dir) === 'ui') return 'ui';
        continue;
      }
      const path = bfs(p, x, y, !!onTile);
      if (path.length) { if (await stepOnce(path[0]) === 'ui') return 'ui'; continue; }
      if (onTile) return;
      const d = Object.entries(DIR).find(([, [ddx, ddy]]) => p.x + ddx === x && p.y + ddy === y)[0];
      if (p.dir !== d) { await press(d); await sleep(40); }
      await press('a'); return;
    }
    throw new Error('could not reach ' + map + ' ' + x + ',' + y);
  }
  async function newGame() { await pickLabel(/New game/); await settle(); }
  return { ctx, page, errors, requests, peek, press, pickLabel, settle, untilChoice, goTo, newGame, modalText, waitUI };
}

// Front Desk finished: Tier 1, Key Badge, Day 2, standing on the plaza.
function frontDeskDone(s, extra) {
  return s.page.evaluate(extra => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'sentry', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 2; G.rank = 'Tier 1 analyst'; G.badge = true; G.focusMax = 34; G.focus = 34;
    G.party = [{ id: 'sentry', lvl: 6, xp: 0, tuned: true }, { id: 'ledger', lvl: 3, xp: 0, tuned: false }, { id: 'lantern', lvl: 3, xp: 0, tuned: false }, { id: 'keyling', lvl: 5, xp: 0, tuned: false }];
    G.map = 'hub'; G.x = 19; G.y = 13; G.dir = 'up';
  }, extra);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();

  // ---- The Key Badge door ----
  await frontDeskDone(s, { boardDone: false, bossDone: false });
  await s.goTo('hub', 19, 11, true);
  await s.press('up'); await sleep(60);
  let p = await s.waitUI('say');
  check('Mail Room door is locked without the Key Badge', /Key Badge/.test(p.ui.text) && (await s.peek()).map === 'hub', p.ui.text);
  await s.settle();
  await frontDeskDone(s);
  await s.page.evaluate(() => { const G = __UPTIME.state(); G.x = 19; G.y = 13; });

  // ---- Arrival ----
  await s.goTo('mail', 14, 9);
  await s.settle();
  p = await s.peek();
  check('arrival: Bea met, Drillbit on the console', p.f.mrMet && p.party.some(t => t.id === 'drillbit'), p.f);
  check('arrival: report rate 10% on the scorecard', p.metrics.report === 10, p.metrics);

  // ---- Inbox room: a wrong call first, then right ----
  await s.goTo('mail', 15, 2);
  await s.untilChoice();
  await s.pickLabel(/Inspect the sender/); await s.waitUI('modal');
  check('inbox room: inspecting the sender reveals the address', /freemail\.example/.test(await s.modalText()));
  await s.pickLabel(/Trust it/); await s.waitUI('modal');
  check('inbox room: trusting the display-name spoof is caught', /Not this one/.test(await s.modalText()));
  await s.pickLabel(/Try again/);
  await s.settle();
  p = await s.peek();
  check('inbox room solved; report rate 20%', p.f.mrInbox && p.metrics.report === 20, p.metrics);

  // ---- Drill 1: one broad query (a wall), one focused key query ----
  await s.goTo('mail', 13, 4);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  const f0 = (await s.peek()).focus;
  await s.pickLabel(/Query: Identity provider/); await s.pickLabel(/Every sign-in for every account/);
  await s.waitUI('modal');
  const wall = await s.modalText();
  check('drill: broad query returns a wall of rows and costs 3 Focus', /21,406 rows returned/.test(wall) && (await s.peek()).focus === f0 - 3, { focus: (await s.peek()).focus, f0 });
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Mailbox audit/); await s.pickLabel(/New inbox rules/);
  await s.waitUI('modal');
  check('drill: focused query returns the inbox rule', /RSS Subscriptions/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  const dec = (await s.waitUI('modal')).ui.options;
  check('drill: budget spent after two queries', dec.some(o => /Budget spent/.test(o.label)) && dec.filter(o => /^Query/.test(o.label)).every(o => o.disabled));
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/Credentials were submitted and used/);
  await s.pickLabel(/New sign-in from an unfamiliar hosting IP/);
  await s.pickLabel(/VPN or a hotspot/); await s.pickLabel(/help desk re-enrolled/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb = await s.modalText();
  check('drill debrief: score with a broad-query penalty, focused path explained', /Score 85 \/ 100/.test(deb) && /The focused path/.test(deb) && /T1564\.008/.test(deb), deb.slice(0, 200));
  await s.settle();
  p = await s.peek();
  check('drill 1 recorded', p.f.mrDrill1 && p.extra.mr.drills.link.score === 85, p.extra.mr);

  // ---- Save/reload mid-Mail Room ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Mail Room restores map, flags, party, drills and metrics',
    ['map', 'x', 'y', 'day'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) &&
    JSON.stringify(before.party) === JSON.stringify(after.party) && JSON.stringify(before.extra) === JSON.stringify(after.extra) &&
    JSON.stringify(before.metrics) === JSON.stringify(after.metrics), { before: before.extra, after: after.extra });

  // ---- Report button: Drillbit evolves into Reportbird ----
  await s.goTo('mail', 14, 9); await s.settle();
  p = await s.peek();
  check('Drillbit -> Reportbird; report rate 37%', p.party.some(t => t.id === 'reportbird') && !p.party.some(t => t.id === 'drillbit') && p.metrics.report === 37, p.metrics);

  // ---- Drill 2 with a specific Tally question ----
  await s.page.evaluate(() => Object.assign(__UPTIME.state().f, { mrSms: true, mrVish: true }));
  await s.goTo('mail', 18, 4);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Ask Tally: “Does a DMARC pass/);
  await s.waitUI('modal');
  check('Tally answers a specific question correctly', /No\. A DMARC pass shows/.test(await s.modalText()));
  await s.settle();
  p = await s.peek();
  check('drill 2 done; BEC payment stopped; directive raises the report target', p.f.mrDrill2 && p.metrics.bec === 1 && p.f.mrDirective, p.metrics);
  const sc = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the Mail Room metrics and the directive', /Phishing report rate/.test(sc) && /Time to quarantine/.test(sc) && /BEC payments stopped/.test(sc) && /70% by quarter end/.test(sc));

  // ---- Drill 3: Tally given everything truncates and is wrong; the player follows it ----
  await s.goTo('mail', 23, 9); await s.settle();
  p = await s.peek();
  check('end of shift in the Mail Room starts the next day', p.f.mrNight && p.day === 3, { day: p.day });
  await s.goTo('mail', 3, 8);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/);
  await s.waitUI('modal');
  check('Tally given everything says nothing happened', /All 26 prompts were denied/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/Blocked attack/);
  await s.pickLabel(/Twenty-six denials/);
  await s.pickLabel(/identity provider double-logged/); await s.pickLabel(/daylight-saving/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3 debrief: wrong verdict, Tally truncation explained', /not supported/.test(deb3) && /line 187/.test(deb3) && /context limit/.test(deb3), deb3.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('drill 3 recorded as an AI-led miss', p.f.mrDrill3 && p.extra.mr.drills.push.aiWrong === true && p.extra.mr.drills.push.verdictOk === false, p.extra.mr.drills.push);

  // ---- Quiet Thread: the old shared-mailbox console ----
  await s.goTo('mail', 8, 1); await s.settle([/Ledger: sign-in audit/]);
  check('Quiet Thread: Ledger finds the 03:16 legacy sign-in', (await s.peek()).qt.cluesFound.includes('mr-legacy'));
  await s.goTo('mail', 8, 1); await s.settle([/Leave it/]);
  check('Quiet Thread: no rules clue without a mail tool', !(await s.peek()).qt.cluesFound.includes('mr-fwdrule'));
  await s.page.evaluate(() => __UPTIME.state().party.push({ id: 'sieve', lvl: 5, xp: 0, tuned: false }));
  await s.goTo('mail', 8, 1); await s.settle([/Sieve: rules/]);
  p = await s.peek();
  check('Quiet Thread: Sieve finds the forwarding rule; series save updated', p.qt.cluesFound.includes('mr-fwdrule') && (await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound)).includes('mr-fwdrule'), p.qt);
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/Field Manual/); await s.waitUI('modal');
  const fm = await s.modalText();
  check('Field Manual: Unexplained shows T1114.003; Mail Room facts unlocked so far (IC3 waits for the boss)', /T1114\.003 Email Collection: Email Forwarding Rule/.test(fm) && /RFC 9989/.test(fm) && !/24,768/.test(fm), [/T1114\.003 Email Collection/.test(fm), /RFC 9989/.test(fm), /24,768/.test(fm)]);
  await s.press('b'); await sleep(50); await s.press('b'); await s.settle();

  // ---- Alert mix: home threats x3 in the Mail Room, absent before arrival, Lure halved by the Seal Badge ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f) };
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const home = ['lure', 'caller', 'clasp', 'chirp', 'buzzer', 'grant', 'payee'];
    const share = c => home.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'mail'; const mail = count(6000);
    G.f.mrSeal = true; const seal = count(6000); G.f.mrSeal = false;
    G.f.mrMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f;
    const qtHit = Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]);
    return { hubShare: share(hub), mailShare: share(mail), lureMail: mail.lure || 0, lureSeal: seal.lure || 0,
      preMail: ['clasp', 'chirp', 'buzzer', 'grant', 'payee'].reduce((s, t) => s + (pre[t] || 0), 0), qtHit };
  });
  // Expected (game weights, Key Badge halves Sprayer 32 -> 16): plaza 44/104 = 0.42; Mail Room 132/192 = 0.69.
  check('alert mix: Mail Room home threats are ~x3 inside the Mail Room', Math.abs(mix.hubShare - 44 / 104) < 0.03 && Math.abs(mix.mailShare - 132 / 192) < 0.03, mix);
  check('alert mix: no Mail Room threats before arrival', mix.preMail === 0, mix);
  check('alert mix: Seal Badge halves Lure', mix.lureSeal < mix.lureMail * 0.65, mix);
  check('alert mix: no Quiet Thread technique among threats', mix.qtHit.length === 0, mix.qtHit);

  // ---- Time to quarantine, from a real Quarantine in a Mail Room alert ----
  await s.page.evaluate(() => {
    const G = __UPTIME.state(); G.active = G.party.findIndex(t => t.id === 'sieve'); G.focus = G.focusMax;
    let spec; do { spec = genAlert('mal'); } while (spec.threat !== 'clasp');
    run(() => doBattle(spec));
  });
  await s.untilChoice();
  await s.pickLabel(/^Quarantine/); await s.untilChoice();
  await s.pickLabel(/^Close alert/); await s.pickLabel(/^Malicious/); await s.pickLabel(/Quarantine every copy/);
  await s.settle();
  p = await s.peek();
  check('time to quarantine recorded; phishing alert counted in the report rate', p.metrics.tq !== null && p.extra.mr.tq === 1 && p.extra.mr.rep.seen === 31, { m: p.metrics, mr: p.extra.mr });
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: a drill modal fits, no horizontal scroll, options reachable by tap ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await frontDeskDone(ph, { mrArrived: true, mrMet: true, mrInbox: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); MR(); G.map = 'mail'; G.x = 13; G.y = 5; G.dir = 'up'; run(mrDrill1); });
  await ph.untilChoice();
  await sleep(400); await ph.page.tap('#mopts [data-i="0"]'); await sleep(450);
  await ph.page.screenshot({ path: OUT + '/mailroom-phone-drill.png' });
  const lay = await ph.page.evaluate(() => {
    const W = innerWidth, H = innerHeight, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, W, H, box: [box.left, box.right, box.top, box.bottom], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  check('phone: drill modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  await ph.page.tap('#mopts [data-i="2"]'); await sleep(450);
  check('phone: tapping a source opens its questions', /Which question do you put/.test(await ph.modalText()));
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('MAILROOM TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
