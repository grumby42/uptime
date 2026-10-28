// Market Square checks (Town Hall district 4). Setup jumps the state past Clerks' Row through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Shield Badge door, arrival and the Tier 2 metrics, the internet-facing asset inventory (no single source
// finds everything), the WAF in detection mode first, the CMS patch, retiring the test site in the right order
// (subdomain takeover), payment page scope, scripts (PCI DSS 6.4.3), CSP report-only and SRI, the tamper check
// (11.6.1), drills (guessing scores low; traps and Tally cost; focused paths score full), save/reload mid-district,
// the WAF rule review and its false-positive cost (residents who can't pay), the councillor's directive, the
// Quiet Thread DMZ clue, the alert mix, the Dojo, the Web Board (Lantern Badge, Shroud -> Mirrorcoat), mean time
// to contain, the exposure-window logic and the skimming incident, the summary, and the phone layout.
// Usage: node market.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Tap a menu option by what it says (or by its meta.good flag), never by position: option order is shuffled.
async function tapOpt(sess, test) {
  const idx = await sess.page.evaluate(src => {
    const u = __UPTIME.peek().ui; const opts = (u && u.options) || [];
    if (src === '@good') return opts.findIndex(o => o.meta && o.meta.good && !o.disabled);
    const r = new RegExp(src); return opts.findIndex(o => r.test(o.label) && !o.disabled);
  }, test instanceof RegExp ? test.source : test);
  if (idx < 0) throw new Error('no option matching ' + test);
  await sess.page.tap('#mopts [data-i="' + idx + '"]');
}
const results = {};
let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info).slice(0, 500) : ''); if (!ok) failed = true; }

async function session(browser, ctxOpts) {
  const ctx = await browser.newContext(ctxOpts || { viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(13); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  const modalText = () => page.textContent('#modal');
  async function waitUI(type) { for (let i = 0; i < 300; i++) { const p = await peek(); if (p.ui && (!type || p.ui.type === type)) return p; await sleep(15); } throw new Error('no ui ' + type + ' ' + JSON.stringify((await peek()).ui)); }
  async function pickLabel(re) {
    const p = await waitUI(); const u = p.ui;
    const idx = u.options.findIndex(o => re.test(o.label) && !o.disabled);
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options.map(o => o.label)));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 40) await press(u.type === 'modal' ? 'down' : (u.cols > 1 ? 'right' : 'down'));
    await press('a'); await sleep(20);
  }
  // In a battle: investigate until Evidence >= 70, then close with the true verdict and the good response.
  function battleIndex(p) {
    const o = p.ui.options, b = p.battle, en = i => o[i] && !o[i].disabled;
    const find = f => o.findIndex((x, i) => en(i) && f(x.meta || {}, x));
    if (find(m => m.kind === 'close') >= 0) {
      if (b.ev < 70) {
        let best = -1, bs = -1;
        o.forEach((x, i) => { const m = x.meta || {}; if (en(i) && m.kind === 'ability' && m.type === 'inv') { const s = m.eff * 10 - m.cost; if (s > bs) { bs = s; best = i; } } });
        if (best >= 0) return best;
      }
      return find(m => m.kind === 'close');
    }
    if (find(m => m.verdict) >= 0) return find(m => m.verdict === b.kind);
    if (find(m => m.good === true) >= 0) return find(m => m.good === true);
    return 0;
  }
  // Advance dialogue; answer choices/modals with the first matching regex, else the option marked good, else the first.
  async function settle(prefs, stopRe) {
    for (let i = 0; i < 3000; i++) {
      await sleep(15);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return; continue; }
      if (stopRe && p.ui.type === 'modal' && stopRe.test(await page.textContent('#modal'))) return p;
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal' && p.ui.multi) {
        const todo = p.ui.options.findIndex((o, i) => o.meta && o.meta.good && !p.ui.sel.includes(i));
        const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
        let guard = 0; while ((await peek()).ui.cursor !== idx && guard++ < 30) await press('down');
        await press('a'); await sleep(20); continue;
      }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      if (re) { await pickLabel(re); continue; }
      if (p.battle && p.ui.type === 'choice') {
        const idx = battleIndex(p);
        await pickLabel(new RegExp('^' + p.ui.options[idx].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')); continue;
      }
      const g = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
      await pickLabel(g >= 0 ? new RegExp('^' + p.ui.options[g].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') : /./);
    }
    throw new Error('settle timed out: ' + JSON.stringify((await peek()).ui).slice(0, 300));
  }
  async function untilChoice() {
    for (let i = 0; i < 400; i++) { await sleep(15); const p = await peek(); if (p.ui && p.ui.type !== 'say') return p; if (p.ui) { await press('a'); continue; } if (!p.busy) return p; }
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
  // Walk to (map,x,y): onto it if onTile, else next to it, facing it, and press A. Wild alerts on the way are settled.
  async function goTo(map, x, y, onTile) {
    for (let n = 0; n < 600; n++) {
      const p = await peek();
      if (p.ui || p.busy) { if (p.battle) { await settle(); continue; } return 'ui'; }
      if (p.map !== map) {
        const D = await doors(), prev = new Map([[p.map, null]]), q = [p.map]; let hop = null;
        while (q.length) { const m = q.shift(); if (m === map) { let k = m; while (prev.get(k)) { hop = prev.get(k); k = hop[0]; } break; } for (const [xy, t] of D[m] || []) if (!prev.has(t)) { prev.set(t, [m, xy]); q.push(t); } }
        const [dx, dy] = hop[1].split(',').map(Number); const path = bfs(p, dx, dy, true);
        if (await stepOnce(path.length ? path[0] : p.dir) === 'ui') { const q2 = await peek(); if (q2.battle) { await settle(); continue; } return 'ui'; }
        continue;
      }
      const path = bfs(p, x, y, !!onTile);
      if (path.length) { if (await stepOnce(path[0]) === 'ui') { const q2 = await peek(); if (q2.battle) { await settle(); continue; } return 'ui'; } continue; }
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

// Front Desk and Mail Room finished: Tier 1, Key and Seal Badges, Day 3, standing on the plaza below the Clerks' Row door.

// Front Desk, Mail Room and Clerks' Row finished: Tier 2, Key, Seal and Shield Badges, Day 5, standing on the plaza below the Market Square door.
function clerksDone(s, extra, party) {
  return s.page.evaluate(([extra, party]) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'ledger', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true,
      mrArrived: true, mrMet: true, mrInbox: true, mrDrill1: true, mrReport: true, mrSms: true, mrVish: true, mrDrill2: true, mrDirective: true, mrNight: true, mrDrill3: true, mrOsintMet: true, mrOsintDone: true, mrBoard: true, mrSeal: true, mrBoss: true, mrSummary: true,
      crMet: true, crAdmin: true, crTriage: true, crAsr: true, crPslogGpo: true, crPslog: true, crDrill1: true, crException: true, crDrill2: true, crNight: true, crDrill3: true, crDojoMet: true, crDojoDone: true, crBoard: true, crShield: true, crContain: false, crContained: true, crBoss: true, crSummary: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 5; G.rank = 'Tier 2 incident responder'; G.badge = true; G.focusMax = 38; G.focus = 38;
    G.party = party || [{ id: 'overwatch', lvl: 8, xp: 0, tuned: true }, { id: 'ledger', lvl: 4, xp: 0, tuned: false }, { id: 'lantern', lvl: 4, xp: 0, tuned: false }, { id: 'keyling', lvl: 5, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sifter', lvl: 5, xp: 0, tuned: false }];
    G.active = 0;
    MR(); G.mr.rep = { seen: 34, reported: 20 };
    CR(); G.cr.admins = 0; G.cr.triage = {}; crPatchAll();
    G.map = 'hub'; G.x = 26; G.y = 8; G.dir = 'up';
  }, [extra || null, party || null]);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Shield Badge door ----
  await clerksDone(s, { crShield: false });
  await s.goTo('hub', 26, 7, true);
  await s.press('up'); await sleep(60);
  p = await s.waitUI('say');
  check('Market Square door is locked without the Shield Badge', /Shield Badge/.test(p.ui.text) && (await s.peek()).map === 'hub', p.ui.text);
  await s.settle();

  // ---- Arrival ----
  await clerksDone(s);
  await s.goTo('market', 17, 7);
  await s.settle();
  p = await s.peek();
  check('arrival: Paz met; Market Square metrics start (inventory 0%, no WAF numbers yet)', p.f.mkMet && p.metrics.mkInv === 0 && p.metrics.mkWafFp === null && p.metrics.mkWindow === null, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the Tier 2 Market Square metrics with targets', /Internet-facing assets inventoried/.test(sc0) && /WAF false-positive rate/.test(sc0) && /Mean time to contain, Market Square/.test(sc0) && /Exposure window on the payment page/.test(sc0) && /≤ 1 h/.test(sc0) && /≥ 100%/.test(sc0));
  check('the market map touches the internet: row 0 is the internet, and the WAF gate is the only way down', await s.page.evaluate(() => MAPS.market.rows[0] === 'W'.repeat(30) && MAPS.market.rows[1].replace(/h/g, '') === 'AA'));

  // ---- Inventory: two sources that miss something, then one more ----
  await s.goTo('market', 7, 5);
  await s.waitUI('modal');
  await s.pickLabel(/asset spreadsheet/); await s.pickLabel(/Certificate Transparency/); await s.pickLabel(/Query these/);
  await s.waitUI('modal');
  const inv1 = await s.modalText();
  check('inventory: spreadsheet + certificate logs find 6 of 7 (the WAF admin page has no name)', /6 of 7 known so far/.test(inv1) && !/198\.51\.100\.44/.test(inv1) && /test\.townhall\.example/.test(inv1), inv1.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('inventory gap: 86%, not done, objective asks for another source', !p.f.mkInv && p.metrics.mkInv === 86 && /Inventory gaps/.test(p.objective.text), { m: p.metrics.mkInv, o: p.objective.text });
  await s.goTo('market', 7, 5);
  await s.waitUI('modal');
  await s.pickLabel(/authorised scan/); await s.pickLabel(/Query these/);
  await s.settle();
  p = await s.peek();
  check('inventory complete: 100%, both remembered-by-nobody assets found', p.f.mkInv && p.metrics.mkInv === 100 && p.extra.mk.found.includes('test') && p.extra.mk.found.includes('wafadmin'), p.extra.mk);
  check('inventory metric: best 100 on the scorecard, worst still the 0 at arrival', await s.page.evaluate(() => G.track.mkInv.best === 100 && G.track.mkInv.worst === 0));

  // ---- WAF: detection mode first ----
  await s.goTo('market', 14, 1);
  await s.untilChoice();
  await s.pickLabel(/Blocking mode now/);
  p = await s.waitUI('say');
  check('WAF: blocking at the strictest level first is explained (real residents)', /real residents/.test(p.ui.text), p.ui.text);
  await s.settle([/Detection mode first/]);
  p = await s.peek();
  check('WAF in detection mode; ModSecurity detection-only fact unlocked', p.f.mkWafDetect && await s.page.evaluate(() => !!G.fm['fact:waf_detect'] && /DetectionOnly/.test(FACTS.waf_detect.desc)));

  // ---- CMS patch ----
  await s.goTo('market', 4, 10);
  await s.untilChoice();
  await s.pickLabel(/quarterly maintenance window/);
  p = await s.waitUI('say');
  check('CMS: waiting a month for a known-exploited internet-facing flaw is refused', /long time/.test(p.ui.text), p.ui.text);
  await s.settle([/^Today/]);
  check('CMS patched today', (await s.peek()).f.mkCms);

  // ---- The forgotten test site: retire it in the right order ----
  await s.goTo('market', 18, 8);
  await s.untilChoice();
  await s.pickLabel(/Cancel the hosting account now/);
  p = await s.waitUI('say');
  check('test site: cancelling the hosting first is a subdomain takeover risk (and loses the logs)', /subdomain takeover/.test(p.ui.text) && /logs/.test(p.ui.text), p.ui.text);
  await s.settle([/Keep a copy of its logs/]);
  p = await s.peek();
  check('test site retired; its console is gone from the map', p.f.mkTest && await s.page.evaluate(() => tileDef('market', 18, 8).ch === '.'));

  // ---- Payment page: scope, scripts, CSP/SRI, tamper check ----
  await s.goTo('market', 21, 4);
  await s.untilChoice();
  await s.pickLabel(/On our own page, as now/);
  p = await s.waitUI('say');
  check('scope: a WAF never sees what a script does in the browser', /never sees/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/hosted payment page \(we redirect/);
  await s.untilChoice();
  for (let n = 0; n < 4; n++) { await s.waitUI('modal'); await s.pickLabel(/^Keep, with a written reason/); await sleep(30); }
  await s.waitUI('modal');
  const sinv = await s.modalText();
  check('script inventory: keeping analytics and chat on the payment page scores 2 of 4; 6.4.3 explained', /2 of 4 right/.test(sinv) && /6\.4\.3/.test(sinv) && /written reason/.test(sinv), sinv.slice(0, 300));
  await s.pickLabel(/Apply/);
  await s.untilChoice();
  await s.pickLabel(/Subresource Integrity hashes on every script/);
  p = await s.waitUI('say');
  check('SRI on a vendor script updated in place would block payments at its next release', /refuse the new file/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Content Security Policy in report-only mode first/);
  await s.untilChoice(); await s.pickLabel(/^Weekly/);
  await s.settle();
  p = await s.peek();
  check('payment page: scope redirect, analytics and chat removed anyway, report-only CSP, weekly tamper check', p.f.mkCsp && p.extra.mk.scope === 'redirect' && p.extra.mk.scripts.ana === 'remove' && p.extra.mk.scripts.chat === 'remove' && p.extra.mk.check === 'week', p.extra.mk);
  check('PCI facts: 6.4.3 and 11.6.1 wording, weekly or targeted risk analysis, best practice until 31 March 2025; SAQ A FAQs',
    await s.page.evaluate(() => G.fm['fact:pci643'] && G.fm['fact:pci1161'] && G.fm['fact:saqa'] && /written business or technical justification/.test(FACTS.pci643.desc) && /at least weekly/.test(FACTS.pci1161.desc) && /31 March 2025/.test(FACTS.pci1161.desc) && /does not apply to a redirect/.test(FACTS.saqa.desc)));

  // ---- Night 1 ----
  const day0 = (await s.peek()).day;
  await s.goTo('market', 8, 11); await s.settle();
  p = await s.peek();
  check('end of shift: next day, overnight WAF summary', p.f.mkNight1 && p.day === day0 + 1, { day: p.day, f: p.f.mkNight1 });

  // ---- Drill 1 by guessing ----
  await s.goTo('market', 17, 7);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^Yes: one request/);
  await s.pickLabel(/Their requests failed with 500s/);
  await s.pickLabel(/ordinary search/); await s.pickLabel(/WAF blocked the dangerous/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('guessing: right verdict, reasoning and alternatives with no query scores 40 and is called unsupported', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1), deb1.slice(0, 300));
  check('drill 1 debrief: success shows in status codes, response sizes and the database log, not the WAF count', /status codes and response sizes/.test(deb1) && /database error log/.test(deb1) && /T1190/.test(deb1));
  await s.settle();
  p = await s.peek();
  check('drill 1 recorded as unsupported', p.f.mkDrill1 && p.extra.mk.drills.sqli.score === 40 && p.extra.mk.drills.sqli.supported === false, p.extra.mk.drills);
  const trapScore = await s.page.evaluate(() => { const D = MK_DRILLS.sqli; const traps = D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => q.q)), []); return traps; });
  check('drill 1 traps are the total count and GeoIP', trapScore.length === 2 && trapScore.some(q => /How many requests matched/.test(q)) && trapScore.some(q => /Where is 203\.0\.113\.50/.test(q)), trapScore);

  // ---- Save/reload mid-Market Square ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Market Square restores map, flags, party, inventory, scripts and metrics',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) &&
    JSON.stringify(before.party) === JSON.stringify(after.party) && JSON.stringify(before.extra) === JSON.stringify(after.extra) &&
    JSON.stringify(before.metrics) === JSON.stringify(after.metrics), { before: before.extra.mk, after: after.extra.mk });

  // ---- WAF rule review: block the apostrophe rule and "GET only" on /pay/ -> residents can't pay ----
  const rep0 = await s.page.evaluate(() => ({ rep: G.rep, up: G.uptime }));
  async function review(bad) {
    for (let n = 0; n < 9; n++) {
      await s.waitUI('modal');
      const mt = await s.modalText();
      const good = (await s.peek()).ui.options.find(o => o.meta && o.meta.good).label;
      const isBad = bad && (/apostrophe/.test(mt) || /Allow only GET/.test(mt));
      await s.pickLabel(isBad ? /^Block$/ : new RegExp('^' + good + '$'));
      await sleep(30);
    }
    await s.waitUI('modal');
    return s.modalText();
  }
  await s.goTo('market', 14, 1);
  await s.untilChoice();
  const rv1 = await review(true);
  check('WAF review: blocking apostrophes and non-GET payments scores 71% (resident-blocking rules count double), FP rate 58.9%, 860 payments failing a day',
    /Rule review 71%/.test(rv1) && /false-positive rate <b>58\.9%|false-positive rate 58\.9%/.test(rv1.replace(/\s+/g, ' ')) && /bill payments failing 860/.test(rv1.replace(/\s+/g, ' ')), rv1.slice(0, 500));
  check('WAF review teaches the OWASP apostrophe point', /rejects legitimate names without making a database query safe/.test(rv1));
  await s.pickLabel(/Switch the WAF to blocking/);
  p = await s.waitUI('say');
  check('false-positive cost: residents can’t pay their bills', /can’t pay their bills/.test(p.ui.text), p.ui.text);
  await s.settle();
  const rep1 = await s.page.evaluate(() => ({ rep: G.rep, up: G.uptime }));
  p = await s.peek();
  check('false-positive cost on the scorecard: FP rate 58.9%, reputation and uptime down', p.f.mkWafBlock && p.metrics.mkWafFp === 58.9 && rep1.rep < rep0.rep && rep1.up < rep0.up, { m: p.metrics.mkWafFp, rep0, rep1 });
  await s.goTo('market', 14, 1);
  await s.untilChoice();
  await s.pickLabel(/Review the rules again/);
  await s.untilChoice();
  const rv2 = await review(false);
  check('re-tuned review: 100%, residents blocked 2 a day, FP 0.1%', /Rule review 100%/.test(rv2) && /residents’ requests blocked <b>2<\/b>|residents’ requests blocked 2/.test(rv2.replace(/\s+/g, ' ')), rv2.slice(0, 400));
  await s.pickLabel(/Switch the WAF to blocking/); await s.settle();
  p = await s.peek();
  check('WAF FP metric: now 0.1%, worst 58.9% kept on the scorecard; two reviews', p.metrics.mkWafFp === 0.1 && p.extra.mk.wafReviews === 2 && await s.page.evaluate(() => G.track.mkWafFp.worst === 58.9 && G.track.mkWafFp.best === 0.1), p.metrics.mkWafFp);

  // ---- The councillor's directive (game) ----
  await s.goTo('market', 20, 14);
  await s.untilChoice();
  await s.pickLabel(/Promise our own page back/);
  p = await s.waitUI('say');
  check('directive: promising our own page back in an hour is explained (it may bring the skimmer back)', /skimmer back/.test(p.ui.text), p.ui.text);
  await s.settle([/Agree a plan/]);
  p = await s.peek();
  check('directive agreed as a plan; shown on the scorecard and labelled (game)', p.f.mkDirective && p.extra.mk.directive === 'plan' && /Directive: online payments back within one hour of any incident\. \(game\)/.test(await s.page.evaluate(() => scorecardHtml())));

  // ---- Drill 2, focused path ----
  await s.goTo('market', 21, 4);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Change records/); await s.pickLabel(/What changed in checkout\.html/); await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Vendor change notice/); await s.pickLabel(/Does the processor’s notice/); await s.waitUI('modal');
  check('drill 2: the notice was checked on the processor’s portal, not in the email', /not by following the email/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/A legitimate vendor change/);
  await s.pickLabel(/The page changed by exactly one line/);
  await s.pickLabel(/attacker changed the page/); await s.pickLabel(/look-alike domain/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2: both key queries score 100; the change record and the vendor notice decide; minified code proves nothing', /Score 100 \/ 100/.test(deb2) && /change records/.test(deb2) && /Minified code proves nothing/.test(deb2) && /6\.4\.3/.test(deb2), deb2.slice(0, 300));
  await s.settle();

  // ---- Night 2 and drill 3: Tally, one trap, then two of three key queries ----
  await s.goTo('market', 8, 11); await s.settle();
  check('night 2', (await s.peek()).f.mkNight2);
  await s.goTo('market', 4, 10);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/); await s.waitUI('modal');
  check('drill 3: Tally given everything reads the actor field as Rafe', /rafe\.l created webmaint2/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Antivirus scan/); await s.pickLabel(/Run a full scan now/); await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: CMS audit log/); await s.pickLabel(/Full details of the 02:51:13 entry/); await s.waitUI('modal');
  check('drill 3: the session was issued at the office and reused on the web server itself (127.0.0.1)', /issued yesterday at 16:05/.test(await s.modalText()) && /reused/.test(await s.modalText()) && /127\.0\.0\.1/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Web server access log/); await s.pickLabel(/Every request from 203\.0\.113\.61/); await s.waitUI('modal');
  check('drill 3: the web shell came in before the patch day', /before you patched the upload flaw on Day \d+/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/An intruder: a web shell/);
  await s.pickLabel(/Rafe’s office session was reused/);
  await s.pickLabel(/through the VPN/); await s.pickLabel(/Another web shell or admin account/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3: a trap and two of three key queries score 88; Tally’s mistake explained; revoke every session', /Score 88 \/ 100/.test(deb3) && /Tally read the actor field as a person/.test(deb3) && /revoke every CMS session/.test(deb3) && /T1505\.003/.test(deb3) && /T1550\.004/.test(deb3), deb3.slice(0, 300));
  await s.settle();
  const d3 = await s.page.evaluate(() => { const D = MK_DRILLS.admin; return { budget: D.budget, keys: D.sources.reduce((n, x) => n + x.qs.filter(q => q.key).length, 0) }; });
  check('drill 3: budget 3 with three key queries (audit log, access log, uploads folder)', d3.budget === 3 && d3.keys === 3, d3);

  // ---- Quiet Thread: the DMZ log ----
  await s.goTo('market', 7, 5); await s.settle([/Lanternkeep: DMZ connections/]);
  p = await s.peek();
  check('Quiet Thread: Lanternkeep finds the closet router signing in to WEB-01 at 03:09 (T1090); series save updated',
    p.qt.cluesFound.includes('mk-dmzhop') && (await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound)).includes('mk-dmzhop'), p.qt);
  check('Quiet Thread clue is consistent: svc-print, just after 03:00, the Front Desk closet router', await s.page.evaluate(() => /svc-print/.test(QT_CLUES['mk-dmzhop'].seen) && /03:09/.test(QT_CLUES['mk-dmzhop'].seen) && /Front Desk closet/.test(QT_CLUES['mk-dmzhop'].seen) && QT_TECH[QT_CLUES['mk-dmzhop'].tech].name === 'Proxy'));
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/Field Manual/); await s.waitUI('modal');
  const fm = await s.modalText();
  check('Field Manual: Unexplained shows the DMZ hop; Market Square facts so far (no British Airways before the incident)', /T1090 Proxy/.test(fm) && /WEB-01/.test(fm) && /PCI DSS 6\.4\.3/.test(fm) && !/429,612/.test(fm));
  await s.press('b'); await sleep(50); await s.press('b'); await s.settle();

  // ---- Alert mix ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const home = MK_HOME, share = c => home.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'market'; const mk = count(6000);
    G.f.mkLantern = true; const lantern = count(6000); G.f.mkLantern = false;
    G.f.mkMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    const qtHit = Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]);
    const techs = MK_HOME.map(t => THREATS[t].tech);
    return { hubShare: share(hub), mkShare: share(mk), sq: mk.slipquote || 0, sqLantern: lantern.slipquote || 0, pre: home.reduce((s, t) => s + (pre[t] || 0), 0), qtHit, techs };
  });
  // Expected (game weights): Front Desk 76.5 after Key and Seal Badges, Mail Room 20, Clerks' Row 17.5 after the Shield Badge, Market Square 20:
  // plaza 20/134 = 0.149; Market Square 60/174 = 0.345.
  check('alert mix: Market Square threats ~x3 inside Market Square', Math.abs(mix.hubShare - 20 / 134) < 0.03 && Math.abs(mix.mkShare - 60 / 174) < 0.03, mix);
  check('alert mix: no Market Square threats before arrival', mix.pre === 0, mix);
  check('alert mix: Lantern Badge halves Slipquote', mix.sqLantern < mix.sq * 0.65, mix);
  check('alert mix: no Quiet Thread technique among threats; spec IDs present (T1190, T1110.004, T1505.003, T1059.007, T1595.002, T1499.002)', mix.qtHit.length === 0 && ['T1190', 'T1110.004', 'T1505.003', 'T1059.007', 'T1595.002', 'T1499.002'].every(t => mix.techs.includes(t)), mix);
  check('ATT&CK v20 tactics as verified (Credential Access, Persistence, Execution, Reconnaissance, Impact, Lateral Movement)', await s.page.evaluate(() =>
    TECH['T1110.004'].tactic.join() === 'Credential Access' && TECH['T1505.003'].tactic.join() === 'Persistence' && TECH['T1059.007'].tactic.join() === 'Execution' &&
    TECH['T1595.002'].tactic.join() === 'Reconnaissance' && TECH['T1499.002'].tactic.join() === 'Impact' && TECH['T1550.004'].tactic.join() === 'Lateral Movement'));
  check('scanning is reconnaissance: Crawler is malicious only when attempts to get in follow the scan', await s.page.evaluate(() => /reconnaissance/.test(ALERTS.crawler.mal.truth) && /attempt to get in/.test(ALERTS.crawler.mal.truth) && /not an incident/.test(ALERTS.crawler.benign.truth)));
  check('the flood alert has a benign flash crowd', await s.page.evaluate(() => /flash crowd/.test(ALERTS.stampede.benign.truth)));
  // Expert review (Market Square): consistency of the evidence and the lessons it teaches.
  const rv = await s.page.evaluate(() => {
    const adm = JSON.stringify(MK_DRILLS.admin), sq = JSON.stringify(MK_DRILLS.sqli), up = MK_WAF.find(r => r.id === 'upload');
    const st = mkBossStages(['csp'], true), st0 = mkBossStages([], false), boss = mkBossScript.toString();
    const card = id => MK_CARDS.find(c => c.id === id);
    return {
      admin127: /from 127\.0\.0\.1/.test(adm) && !/POST \/cms\/admin\/users\/new  302/.test(adm) && /the WAF never saw an admin request/.test(adm),
      wafSample: up.seen.every(x => !/203\.0\.113\.61/.test(x)) && up.seen.filter(x => /thumb\.php|x\.phtml/.test(x)).every(x => / 400 /.test(x)) && /before the patch/.test(up.why),
      sqliDay: !/\{D-1\}/.test(sq) && /Day \{D\} 02:44:07/.test(sq), noMinute: !/02:44:0\d  GET \/cms\/uploads/.test(adm),
      t1539: TECH['T1539'] && TECH['T1539'].tactic.join() === 'Credential Access' && MK_DRILLS.admin.techs.includes('T1539'),
      who: /Everyone who typed a card into our page/.test(boss) && !/completed a card payment on our page inside the window'/.test(boss) && /Before residents are told who is affected/.test(boss),
      exposure: /Tell the processor at once/.test(EXTRA_ACTIONS.exposurewin.desc) && /typed a card/.test(EXTRA_ACTIONS.exposurewin.desc),
      quiet: /router .*opened a short connection into the DMZ, to WEB-01/.test(QT_CLUES['mk-dmzhop'].seen) && /Front Desk closet opened a short connection into the DMZ/.test(mkQtRack.toString()) && !/WEB-01 opened/.test(mkQtRack.toString() + QT_CLUES['mk-dmzhop'].seen),
      csp: /narrows/.test(card('csp').fx) && /WebRTC/.test(card('csp').fx) && /narrows/.test(EXTRA_ACTIONS.csp.desc) && /change the header/.test(EXTRA_ACTIONS.csp.desc) && /header itself/.test(st.s3.clues.join(' ')),
      us: /Every US state has a breach-notification law/.test(boss) && /PCI Forensic Investigator/.test(boss) && /for comparison/.test(FACTS.ico72.name) && /US state breach laws differ/.test(sq),
      deployKey: /deploy key saved in the pipeline/.test(st0.s3.clues.join(' ')) && !/password was reset/.test(st0.s3.clues.join(' ')) && /pipeline/.test(st0.s3.truth),
      quietStuffing: /right first time/.test(st0.s2.clues.join(' ')) && !/failed sign-ins/.test(st0.s2.clues.join(' ')),
      cspInbox: /nothing alerted on them/.test(boss) && /alert on any report/.test(EXTRA_ACTIONS.csp.desc),
      hunt: /tells us nothing about old ones/.test(mkCmsPatch.toString()) && /doesn’t empty the room/.test(EXTRA_ACTIONS.patchweb.desc),
      csf: card('csp').csf === 'Respond' && card('wafonly').csf === 'Respond' && card('restore').csf === 'Recover'
    };
  });
  check('review: drill 3 admin request came from the server itself (the WAF never saw it); no shared minute with drill 1; T1539 named', rv.admin127 && rv.noMinute && rv.t1539, rv);
  check('review: WAF upload sample shows the patched CMS refusing scripts (no post-patch 200 from the drill 3 attacker)', rv.wafSample, rv);
  check('review: drill 1 dated Day D (the night after detection mode began); US-generic notification framing', rv.sqliDay && rv.us, rv);
  check('review: everyone who typed a card is affected; the processor is told at once, precision gates the resident notice', rv.who && rv.exposure, rv);
  check('review: Quiet Thread direction is one way everywhere (closet router into the DMZ, to WEB-01)', rv.quiet, rv);
  check('review: CSP narrows exits, not a seal; the tamper check watches the header; reports must alert someone', rv.csp && rv.cspInbox, rv);
  check('review: Stage 2 stuffing is quiet; Stage 3 is beaten by an unlisted pipeline deploy key; patch then hunt', rv.quietStuffing && rv.deployKey && rv.hunt, rv);
  check('review: tabletop CSF functions (enforce CSP and block domain = Respond, restore = Recover)', rv.csf, rv);

  // ---- Dojo: one wrong answer, then the rest ----
  await s.goTo('market', 26, 10); await s.settle();
  await s.goTo('market', 24, 10);
  await s.waitUI('modal');
  await s.pickLabel(/Yes: every input was validated/);
  p = await s.waitUI('say');
  check('dojo: “validated so it’s safe” is not accepted', /Not quite/.test(p.ui.text), p.ui.text);
  await s.press('a'); await s.waitUI('modal');
  await s.pickLabel(/^No: the apostrophe/);
  p = await s.waitUI('say');
  check('dojo 3: OWASP Top 10:2025 A05 says input validation is not a complete defense', /A05/.test(p.ui.text) && /not a complete defense/.test(p.ui.text), p.ui.text);
  await s.settle();
  await s.goTo('market', 20, 10); await s.settle();
  await s.goTo('market', 22, 10); await s.settle();
  p = await s.peek();
  check('dojo complete; OWASP Top 10:2025 fact (A01 Broken Access Control … A10) unlocked; the network tool levels up', p.f.mkDojoDone && p.party.find(t => t.id === 'lantern').lvl === 5 && await s.page.evaluate(() => G.fm['fact:owasp10'] && /A01 Broken Access Control/.test(FACTS.owasp10.desc) && /A10 Mishandling of Exceptional Conditions/.test(FACTS.owasp10.desc)), p.party);

  // ---- Web Board: Lantern Badge and Shroud ----
  await s.goTo('wboard', 9, 2);
  await s.settle();
  p = await s.peek();
  check('Web Board won: Lantern Badge; Shroud (WAF) joins at Lv 5; still Tier 2', p.f.mkBoard && p.f.mkLantern && p.party.some(t => t.id === 'shroud' && t.lvl === 5) && p.rank === 'Tier 2 incident responder', { party: p.party, rank: p.rank });
  check('Lantern Badge: unmonitored web paths shrink, the Market Square building lights up, market alerts start with evidence', await s.page.evaluate(() => {
    const keep = G.map; G.map = 'market'; let spec; do { spec = genAlert('mal'); } while (!MK_HOME.includes(spec.threat)); G.map = keep;
    return tileDef('market', 2, 2).ch === '.' && tileDef('market', 1, 2).ch === 'z' && tileDef('hub', 24, 4).spr === 'L' && spec.ev0 === 10;
  }));

  // ---- Mean time to contain from a real containment action ----
  await s.page.evaluate(() => {
    const G = __UPTIME.state(); G.active = G.party.findIndex(t => t.id === 'shroud'); G.focus = G.focusMax;
    let spec; do { spec = genAlert('mal'); } while (spec.threat !== 'stuffer');
    run(() => doBattle(spec));
  });
  await s.untilChoice();
  const ttc0 = (await s.peek()).extra.mk.ttc;
  await s.pickLabel(/^Rate limit/); await s.untilChoice();
  await s.pickLabel(/^Close alert/); await s.pickLabel(/^Malicious/); await s.pickLabel(/Reset and sign out the accounts/);
  await s.settle();
  p = await s.peek();
  check('mean time to contain recorded from a rate limit on a real attack', p.metrics.mkTtc !== null && p.extra.mk.ttc === ttc0 + 1, { m: p.metrics.mkTtc, ttc: p.extra.mk.ttc });

  // ---- Exposure window logic ----
  const win = await s.page.evaluate(() => ({
    best: mkWindowCalc('q15', ['hosted'], false), slow: mkWindowCalc('week', [], false),
    early: mkWindowCalc('q15', ['hosted'], true), earlyCsp: mkWindowCalc('q15', ['hosted', 'csp'], true), weekEarly: mkWindowCalc('week', ['hosted'], true)
  }));
  check('exposure window: 15-minute check + hosted checkout = 45 min (23 payments); weekly check, no fallback = 74 h',
    win.best.window === 0.75 && win.best.affected === 23 && win.slow.window === 74 && win.slow.affected === 2220, win);
  check('exposure window: bringing our own page back early adds a second stretch, unless an enforced CSP stops the re-injected copy sending',
    win.early.window === 1 && win.earlyCsp.window === 0.75 && win.weekEarly.window === 144.5, win);

  // ---- The skimming incident (weekly check, from the fieldwork) ----
  await s.goTo('market', 17, 7);
  await s.settle(null, /Leadership have been told|The processor and leadership have been told/);
  p = await s.peek();
  check('tabletop: telling the processor and leadership is automatic, not a card', !p.ui.options.some(o => /Notify|processor/i.test(o.label) && !/hosted/.test(o.label)) && await s.page.evaluate(() => G.fm['fact:ba2018'] && /429,612/.test(FACTS.ba2018.desc) && /22 June 2018/.test(FACTS.ba2018.desc) && /5 September 2018/.test(FACTS.ba2018.desc) && /£20m/.test(FACTS.ba2018.desc)), p.ui.options.map(o => o.label));
  await s.settle([/When the alert, or the processor’s call, reached us/, /Bring our own page back now/], /Market Square district: secured/);
  const sum = await s.modalText();
  p = await s.peek();
  const b = p.extra.mk.boss;
  check('boss: weekly check -> the processor calls after three days; window 72.5 h, 2,175 payments exposed (the enforced CSP stopped the re-injection counting)',
    b && b.check === 'week' && b.window === 72.5 && b.affected === 2175 && b.restoreEarly === true && b.again === 0 && b.startOk === false && b.whoOk === true, b);
  check('boss: the four picks are technical; Stage 3 and recovery done; Shroud evolved into Mirrorcoat', p.f.mkBoss && p.f.mkCards.length === 4 && p.party.some(t => t.id === 'mirrorcoat') && !p.party.some(t => t.id === 'shroud'), { cards: p.f.mkCards, party: p.party.map(t => t.id) });
  check('ICO 72-hour fact unlocked at the incident', await s.page.evaluate(() => G.fm['fact:ico72'] && /72 hours/.test(FACTS.ico72.desc)));
  check('summary: secured, Lantern Badge, Tier 2, “Next: Records Hall”, exposure window 72.5 hours, scorecard and drills',
    /Market Square district: secured/.test(sum) && /Lantern Badge/.test(sum) && /Tier 2 incident responder/.test(sum) && /Next: Records Hall/.test(sum) && /72\.5 hours/.test(sum) && /Exposure window on the payment page/.test(sum) && /Did the injection work\?/.test(sum), sum.slice(0, 400));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after recovery: objective points to Records Hall (done, or the Records Hall district); series save marks Market Square done', (p.objective.done || p.objective.district === 'records') && /Records Hall/.test(p.objective.text) && await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].marketSquare === true), p.objective);
  check('Credits list the Market Square sources', /PCI DSS v4\.0\.1/.test(await s.page.evaluate(() => creditsHtml())) && /OWASP Top 10:2025/.test(await s.page.evaluate(() => creditsHtml())));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: WAF review and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await clerksDone(ph, { mkMet: true, mkInv: true, mkWafDetect: true, mkCms: true, mkTest: true, mkCsp: true, mkNight1: true, mkDrill1: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); MK(); G.mk.found = MK_ASSETS.map(a => a.id); G.mk.check = 'q15'; G.map = 'market'; G.x = 14; G.y = 2; G.dir = 'up'; run(mkWafReview); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/market-phone-waf.png' });
  check('phone: WAF review modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  await tapOpt(ph, /^Block$/); await sleep(450);
  check('phone: tapping a choice moves to the next rule', /2 of 9/.test(await ph.modalText()));
  for (let n = 1; n < 9; n++) { await tapOpt(ph, /^Block$/); await sleep(420); }
  check('phone: the review summary fits too', /WAF review/.test(await ph.modalText()) && (await fit()).sw <= 360);
  await tapOpt(ph, /^Switch the WAF to blocking/); await sleep(420);
  await ph.settle();
  await ph.page.evaluate(() => { const G = __UPTIME.state(); G.f.mkDirective = true; G.x = 21; G.y = 5; run(mkDrill2); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/market-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('MARKET TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
