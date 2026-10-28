// Clerks' Row checks (Town Hall district 3). Setup jumps the state past the Mail Room through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Seal Badge door, arrival (Watchling when there is no Sentry), local admin removal, Patch Tuesday
// triage (CVSS vs KEV scoring, effective-patch compliance, a misplaced wormable flaw widening the worm),
// ASR and script block logging fieldwork, drills (guessing scores low; focused paths score full; Tally truncation of
// judgement), save/reload mid-district, the help-desk admin exception, end-of-shift deployment, the Quiet Thread
// laptop clues, the alert mix, the Endpoint Board (Shield Badge, promotion to Tier 2, Watchling -> Sentry ->
// Overwatch with Ledger), the Shield Badge isolation cost, mean time to contain, the worm with map containment,
// the end-of-district summary, and the triage and drill modals on a 360x800 phone.
// Usage: node clerks.js   (UPTIME_FILE=file:///... to test another build)
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
function mailDone(s, extra, party) {
  return s.page.evaluate(([extra, party]) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'ledger', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true,
      mrArrived: true, mrMet: true, mrInbox: true, mrDrill1: true, mrReport: true, mrSms: true, mrVish: true, mrDrill2: true, mrDirective: true, mrNight: true, mrDrill3: true, mrOsintMet: true, mrOsintDone: true, mrBoard: true, mrSeal: true, mrBoss: true, mrSummary: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 3; G.rank = 'Tier 1 analyst'; G.badge = true; G.focusMax = 36; G.focus = 36;
    G.party = party || [{ id: 'sentry', lvl: 6, xp: 0, tuned: true }, { id: 'ledger', lvl: 4, xp: 0, tuned: false }, { id: 'lantern', lvl: 3, xp: 0, tuned: false }, { id: 'keyling', lvl: 5, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sieve', lvl: 5, xp: 0, tuned: false }];
    G.active = 0;
    MR(); G.mr.rep = { seen: 34, reported: 20 };
    G.map = 'hub'; G.x = 25; G.y = 12; G.dir = 'up';
  }, [extra || null, party || null]);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Seal Badge door ----
  await mailDone(s, { mrSeal: false, mrBoard: false, mrBoss: false });
  await s.goTo('hub', 25, 11, true);
  await s.press('up'); await sleep(60);
  p = await s.waitUI('say');
  check('Clerks’ Row door is locked without the Seal Badge', /Seal Badge/.test(p.ui.text) && (await s.peek()).map === 'hub', p.ui.text);
  await s.settle();

  // ---- Arrival with no Sentry: Watchling joins ----
  const noSentry = [{ id: 'ledger', lvl: 4, xp: 0, tuned: false }, { id: 'lantern', lvl: 3, xp: 0, tuned: false }, { id: 'keyling', lvl: 5, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sieve', lvl: 5, xp: 0, tuned: false }];
  await mailDone(s, null, noSentry);
  await s.goTo('clerks', 14, 9);
  await s.settle();
  p = await s.peek();
  check('arrival: Ruth met; Watchling joins a console with no Sentry', p.f.crMet && p.party.some(t => t.id === 'watchling'), p.party.map(t => t.id));
  check('arrival: 18 staff with local admin, nothing lit, KEV compliance 0%', p.metrics.crAdmins === 18 && p.metrics.crKev === 0 && p.extra.cr.lit === 0, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the Clerks’ Row metrics with targets', /Patch compliance: known exploited \(KEV\)/.test(sc0) && /Mean time to contain \(game seconds\)/.test(sc0) && /Clean hosts isolated \(over-isolation\)/.test(sc0) && /Staff with local admin rights/.test(sc0) && /≤ 0/.test(sc0));

  // ---- Local admin: a wrong answer first, then the process ----
  await s.goTo('clerks', 4, 3);
  await s.untilChoice();
  await s.pickLabel(/better antivirus/);
  p = await s.waitUI('say');
  check('local admin: “better antivirus” is explained away', /with the clerk’s rights/.test(p.ui.text), p.ui.text);
  await s.settle([/exceptions go through a help-desk request/]);
  p = await s.peek();
  check('local admin removed: 18 -> 0', p.f.crAdmin && p.metrics.crAdmins === 0, p.metrics);
  check('local admin: Windows LAPS fact unlocked (one rotated local admin password per laptop)', await s.page.evaluate(() => !!G.fm['fact:laps'] && /lateral/.test(FACTS.laps.desc)));

  // ---- Patch Tuesday triage: the wormable flaw left to next week, a CVSS 9.8 we don't run put first ----
  await s.goTo('clerks', 2, 1);
  await s.untilChoice();
  const want = { 'ADV-26-101': /^Next week$/, 'ADV-26-104': /^This week$/ };
  for (let n = 0; n < 8; n++) {
    const mt = await s.modalText();
    const id = /ADV-26-1\d\d/.exec(mt)[0];
    const good = (await s.peek()).ui.options.find(o => o.meta && o.meta.good).label;
    await s.pickLabel(want[id] || new RegExp('^' + good + '$'));
    await sleep(30); await s.waitUI('modal');
  }
  await s.waitUI('modal');
  const review = await s.modalText();
  check('triage: score weights known-exploited items double (9 of 11 = 82%)', /Triage score 82%/.test(review), review.slice(0, 200));
  check('triage: only one Windows advisory (Windows fixes ship in one cumulative update)', await s.page.evaluate(() => CR_ADVISORIES.filter(a => /^Windows/.test(a.title)).length === 1));
  check('triage: review teaches CVSS is not exploitation (CISA quote) and KEV is a floor', /does not account for if the vulnerability is actually being used/.test(review) && /KEV is a floor, not a ceiling/.test(review) && /CVSS rates severity, not your exposure/.test(review));
  await s.pickLabel(/Deploy this week/);
  await s.settle();
  p = await s.peek();
  check('deployed: KEV compliance counts patches in effect (16 of 18 laptops: one offline, one restart pending)', p.metrics.crKev === 89 && p.extra.cr.triageScore === 82, p.metrics);
  check('no laptop lit while the wormable flaw waits for next week', p.extra.cr.lit === 0, p.extra.cr);

  // ---- ASR and script block logging ----
  await s.goTo('clerks', 4, 3); await s.settle();
  await s.goTo('clerks', 4, 3); await s.settle();
  p = await s.peek();
  check('ASR rolled out audit-first; logging policy pushed', p.f.crAsr && p.f.crPslogGpo, p.f);
  await s.goTo('clerks', 17, 1);
  await s.untilChoice();
  await s.pickLabel(/The Security log/);
  p = await s.waitUI('say');
  check('script block check: the Security log is the wrong place', /PowerShell’s own Operational log/.test(p.ui.text), p.ui.text);
  await s.settle([/4104 in Microsoft-Windows-PowerShell\/Operational/]);
  p = await s.peek();
  check('script block logging verified (4104, PowerShell Operational)', p.f.crPslog, p.f);

  // ---- Drill 1 by guessing: right answers, no query ----
  await s.goTo('clerks', 22, 2);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/Downloaded, not executed/);
  await s.pickLabel(/No process creation for the hash/);
  await s.pickLabel(/different name/); await s.pickLabel(/Prefetch is turned off/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('guessing: right verdict, reasoning and alternatives with no query scores 40, called unsupported', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1), deb1.slice(0, 300));
  check('drill 1 debrief: Amcache/Shimcache show presence, not execution (Microsoft IR guide)', /neither proves execution on Windows 10 and later/.test(deb1));
  await s.settle();
  p = await s.peek();
  check('drill 1 recorded as unsupported', p.f.crDrill1 && p.extra.cr.drills.hash.score === 40 && p.extra.cr.drills.hash.supported === false, p.extra.cr.drills);

  // ---- Save/reload mid-Clerks' Row ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Clerks’ Row restores map, flags, party, triage, patches and metrics',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) &&
    JSON.stringify(before.party) === JSON.stringify(after.party) && JSON.stringify(before.extra) === JSON.stringify(after.extra) &&
    JSON.stringify(before.metrics) === JSON.stringify(after.metrics), { before: before.extra.cr, after: after.extra.cr });

  // ---- Help-desk exception: one hour of admin, logged; expires at the end of the shift ----
  await s.goTo('clerks', 10, 9);
  await s.untilChoice();
  await s.pickLabel(/permanent admin/);
  p = await s.waitUI('say');
  check('exception: a permanent admin is refused (anything he opens runs as admin)', /run as an admin/.test(p.ui.text), p.ui.text);
  await s.settle([/admin rights for one hour/]);
  p = await s.peek();
  check('exception: time-limited admin counts on the scorecard (1)', p.f.crException && p.metrics.crAdmins === 1, p.metrics);

  // ---- Drill 2, focused path ----
  await s.goTo('clerks', 22, 4);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Security log/); await s.pickLabel(/Event 4698/); await s.waitUI('modal');
  check('drill 2: 4698 is silent where Audit Other Object Access Events is off', /Audit Other Object Access Events/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: EDR process tree/); await s.pickLabel(/Which process created the task/); await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/Malware running as Mateo/);
  await s.pickLabel(/process tree links the task/);
  await s.pickLabel(/legitimate per-user updater/); await s.pickLabel(/signed in remotely/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2: one key query of two scores 90; debrief explains event 106 names the account, not the person', /Score 90 \/ 100/.test(deb2) && /Event 106 says which account registered the task/.test(deb2) && /T1053\.005/.test(deb2), deb2.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('drill 2 recorded', p.f.crDrill2 && p.extra.cr.drills.task.score === 90, p.extra.cr.drills);

  // ---- End of shift: next week's batch deploys, the temporary admin expires ----
  await s.goTo('clerks', 25, 9); await s.settle();
  p = await s.peek();
  check('end of shift: next week’s batch applied (16 laptops lit), temporary admin expired, next day', p.f.crNight && p.day === 4 && p.extra.cr.lit === 16 && p.metrics.crAdmins === 0, { day: p.day, cr: p.extra.cr, m: p.metrics });

  // ---- Drill 3: Tally given everything, then the focused path ----
  await s.goTo('clerks', 4, 3);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/); await s.waitUI('modal');
  check('drill 3: Tally given everything calls it tampering', /known attacker technique \(T1685\)/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: PowerShell script block log/); await s.pickLabel(/Script blocks on CR-LT-09/); await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Change tickets/); await s.pickLabel(/Any change ticket/); await s.pickLabel(/Back to the investigation/);
  p = await s.waitUI('modal');
  check('drill 3: budget 3; after the script block log and the ticket, the sign-in log is still a decisive query',
    p.ui.options.some(o => /I have enough/.test(o.label) && !(o.meta && o.meta.good)) && p.ui.options.some(o => /Query: Sign-in log/.test(o.label) && o.meta && o.meta.good), p.ui.options);
  await s.pickLabel(/Query: Sign-in log/); await s.pickLabel(/Where did arlo\.adm sign in/); await s.waitUI('modal');
  check('drill 3: the sign-in log shows a console sign-in with his security key, and no other', /security key/.test(await s.modalText()) && /No other arlo\.adm sign-in/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/An admin change/);
  await s.pickLabel(/command ran in arlo\.adm/);
  await s.pickLabel(/attacker using Arlo/); await s.pickLabel(/Malware switched it off/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3: full marks with all three decisive queries; Tally’s technique-matching explained; tamper protection (5013) taught', /Score 100 \/ 100/.test(deb3) && /Tally matched the technique, not the case/.test(deb3) && /event 5013/.test(deb3), deb3.slice(0, 300));
  check('drill 3 debrief: the person behind the account (sign-in, MFA, call Arlo) and troubleshooting mode', /whether the person behind the account was really him/.test(deb3) && /call to Arlo on his known number/.test(deb3) && /troubleshooting mode/.test(deb3) && /sat unanswered until morning/.test(deb3));
  const two = await s.page.evaluate(() => { const D = CR_DRILLS.rtp, keys = D.sources.reduce((n, x) => n + x.qs.filter(q => q.key).length, 0); return { budget: D.budget, keys, twoOfThree: Math.round(20 * 2 / Math.min(keys, D.budget)) }; });
  check('drill 3: three key queries in a budget of 3 (two of three earns 13 of 20 query points, so 93)', two.budget === 3 && two.keys === 3 && two.twoOfThree === 13, two);
  await s.settle();
  p = await s.peek();
  check('drill 3 recorded (Tally led, the player verified)', p.f.crDrill3 && p.extra.cr.drills.rtp.verdictOk && p.extra.cr.drills.rtp.ai === 'everything', p.extra.cr.drills.rtp);

  // ---- Quiet Thread: the spare laptop CR-LT-12 ----
  await s.goTo('clerks', 21, 3); await s.settle([/Watchling: process history/]);
  check('Quiet Thread: Watchling finds the netsh port proxy (T1090.001)', (await s.peek()).qt.cluesFound.includes('cr-portproxy'));
  await s.goTo('clerks', 21, 3); await s.settle([/Ledger: script block log/]);
  p = await s.peek();
  check('Quiet Thread: Ledger’s 4104 log shows the ipconfig / netsh discovery (T1016); series save updated', p.qt.cluesFound.includes('cr-netconfig') && (await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound)).includes('cr-netconfig'), p.qt);
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/Field Manual/); await s.waitUI('modal');
  const fm = await s.modalText();
  check('Field Manual: Unexplained shows T1090.001 and T1016; Clerks’ Row facts so far (no WannaCry before the incident)', /T1090\.001 Proxy: Internal Proxy/.test(fm) && /T1016 System Network Configuration Discovery/.test(fm) && /Known exploited first/.test(fm) && !/595 of them GP practices/.test(fm));
  await s.press('b'); await sleep(50); await s.press('b'); await s.settle();

  // ---- Alert mix ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const home = CR_HOME, share = c => home.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'clerks'; const cl = count(6000);
    G.f.crShield = true; const shield = count(6000); G.f.crShield = false;
    G.f.crMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    const qtHit = Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]);
    const techs = CR_HOME.map(t => THREATS[t].tech);
    return { hubShare: share(hub), clShare: share(cl), quill: cl.quill || 0, quillShield: shield.quill || 0, pre: home.reduce((s, t) => s + (pre[t] || 0), 0), qtHit, techs };
  });
  // Expected (game weights; Key Badge halves Sprayer 32 -> 16; Seal Badge halves Lure 15 -> 7.5; Mail Room threats 20; Clerks' Row 20):
  // plaza 20/116.5 = 0.17; Clerks' Row 60/156.5 = 0.38.
  check('alert mix: Clerks’ Row threats ~x3 inside Clerks’ Row', Math.abs(mix.hubShare - 20 / 116.5) < 0.03 && Math.abs(mix.clShare - 60 / 156.5) < 0.03, mix);
  check('alert mix: no Clerks’ Row threats before arrival', mix.pre === 0, mix);
  check('alert mix: Shield Badge halves Quill', mix.quillShield < mix.quill * 0.65, mix);
  check('alert mix: no Quiet Thread technique (incl. scheduled tasks, T1053.005) among threats; spec IDs present', mix.qtHit.length === 0 && !mix.techs.includes('T1053.005') && ['T1204.002', 'T1218.011', 'T1059.001', 'T1003.001', 'T1685', 'T1490'].every(t => mix.techs.includes(t)), mix);

  // ---- Endpoint Board: Shield Badge, Tier 2, Watchling -> Sentry -> Overwatch (needs Ledger) ----
  await s.page.evaluate(() => { const G = __UPTIME.state(); G.f.crDojoMet = true; G.f.crDojoDone = true; G.active = G.party.findIndex(t => t.id === 'watchling'); });
  await s.goTo('eboard', 9, 2);
  await s.settle();
  p = await s.peek();
  check('Endpoint Board won: Shield Badge, promoted to Tier 2 incident responder', p.f.crBoard && p.f.crShield && p.rank === 'Tier 2 incident responder', { f: p.f.crShield, rank: p.rank });
  check('Watchling evolved into Sentry, then integrated with Ledger into Overwatch', p.party.some(t => t.id === 'overwatch') && !p.party.some(t => t.id === 'watchling' || t.id === 'sentry') && p.party.some(t => t.id === 'ledger'), p.party.map(t => t.id));
  const noLedger = await s.page.evaluate(async () => {
    const G = __UPTIME.state(), keep = G.party; G.party = [{ id: 'sentry', lvl: 6, xp: 0, tuned: false }]; G.f.crOverwatchAsked = 0;
    await crEvolveCheck(); const id = G.party[0].id; G.party = keep; return id;
  });
  check('Overwatch needs Ledger: without it Sentry stays Sentry', noLedger === 'sentry', noLedger);

  // ---- Tier 2 escalation label; mean time to contain from a real Isolate ----
  await s.page.evaluate(() => {
    const G = __UPTIME.state(); G.active = G.party.findIndex(t => t.id === 'overwatch'); G.focus = G.focusMax;
    let spec; do { spec = genAlert('mal'); } while (spec.threat !== 'cipher');
    run(() => doBattle(spec));
  });
  p = await s.untilChoice();
  check('Tier 2 escalates to Rae as incident lead', p.ui.options.some(o => o.label === 'Escalate to Rae (incident lead)'), p.ui.options.map(o => o.label));
  const m0 = (await s.peek()).extra.cr;
  await s.pickLabel(/^Isolate host/); await s.untilChoice();
  await s.pickLabel(/^Close alert/); await s.pickLabel(/^Malicious/); await s.pickLabel(/Isolate the laptop, kill the process/);
  await s.settle();
  p = await s.peek();
  check('mean time to contain recorded from Isolate on a real attack; that isolation counted as needed', p.metrics.crTtc !== null && p.extra.cr.ttc === m0.ttc + 1 && p.extra.cr.needed === m0.needed + 1, { m: p.metrics, cr: p.extra.cr });

  // ---- Shield Badge: isolating a clean laptop from the map costs uptime, reputation and work ----
  const c0 = await s.page.evaluate(() => ({ up: __UPTIME.state().uptime, rep: __UPTIME.state().rep, cr: JSON.parse(JSON.stringify(__UPTIME.state().cr)) }));
  await s.goTo('clerks', 11, 1);
  await s.untilChoice();
  await s.pickLabel(/Isolate \(Shield Badge\)/);
  p = await s.waitUI('say');
  check('Shield Badge: a clean laptop isolated is called out as wasted work', /It was clean/.test(p.ui.text), p.ui.text);
  await s.settle();
  const c1 = await s.page.evaluate(() => ({ up: __UPTIME.state().uptime, rep: __UPTIME.state().rep, cr: JSON.parse(JSON.stringify(__UPTIME.state().cr)) }));
  p = await s.peek();
  check('Shield Badge isolation cost: over-isolation +1, two hours of work, uptime and reputation down, tile shows isolated',
    c1.cr.over === c0.cr.over + 1 && c1.cr.work === c0.cr.work + 2 && c1.up < c0.up && c1.rep < c0.rep && p.metrics.crOver === 1 && p.metrics.crIso < 100 &&
    await s.page.evaluate(() => tileDef('clerks', 11, 1).pal === 'pcIso'), { c0: c0.cr, c1: c1.cr, m: p.metrics });
  await s.goTo('clerks', 11, 1); await s.settle([/Release isolation/]);
  check('Shield Badge: release puts the laptop back', !(await s.peek()).extra.cr.isolated.includes('CR-LT-01'));

  // ---- The worm: a misplaced ADV-26-101 widens it; containment on the map ----
  const wider = await s.page.evaluate(() => { const G = __UPTIME.state(), keep = JSON.stringify(G.cr.patched); delete G.cr.patched['CR-LT-02']['ADV-26-101']; const n = crInfectedSet().length; G.cr.patched = JSON.parse(keep); return { n, normal: crInfectedSet().length }; });
  check('worm scope follows the patch plan: 6 infected if ADV-26-101 never went out, 2 when it did (offline + restart pending)', wider.n === 6 && wider.normal === 2, wider);
  const rep0 = await s.page.evaluate(() => G.rep);
  await s.goTo('clerks', 14, 9);
  await s.settle(null, /Leadership has already been told/);
  p = await s.peek();
  check('tabletop: Notify leadership is automatic (not one of the four cards)', !p.ui.options.some(o => /Notify leadership/.test(o.label)) && (await s.page.evaluate(() => CR_CARDS.find(x => x.id === 'notify').auto === true)), { opts: p.ui.options.map(o => o.label), rep0 });
  await s.settle(null, /Fleet search from your endpoint tool/);
  const fleet = await s.modalText();
  await s.settle();
  p = await s.peek();
  check('incident: stage 1 done, containment led by the player; the four picks are technical cards', p.f.crContain && !p.f.crContained && JSON.stringify(p.extra.cr.infected) === '["CR-LT-17","CR-LT-08"]' && p.f.crCards.length === 4 && !p.f.crCards.includes('notify'), { cr: p.extra.cr, cards: p.f.crCards });
  check('containment: no red laptops; the objective names no host', await s.page.evaluate(() => CR_HOSTS_ALL.every(h => { const q = crHostXY(h); return tileDef('clerks', q.x, q.y).pal !== 'pcHot'; })) && !/CR-LT-/.test(p.objective.text) && p.objective.x === 14 && p.objective.y === 9, p.objective);
  check('fleet search: the spreading laptops fan out to other laptops; one decoy reaches only the file server', /CR-LT-17\s+outbound TCP 445 to \d+ different laptop addresses/.test(fleet) && /CR-LT-08\s+outbound TCP 445 to \d+ different laptop addresses/.test(fleet) && /CR-LT-05\s+outbound TCP 445 to FILESRV-01 only/.test(fleet), fleet.slice(0, 400));
  check('Field Manual: WannaCry (NAO) and MS17-010 facts unlocked at the incident', await s.page.evaluate(() => G.fm['fact:wannacry'] && G.fm['fact:ms17010']));
  // The decoy: inspecting it shows file-server traffic only; leave it.
  await s.goTo('clerks', 19, 1); p = await s.untilChoice();
  check('decoy laptop: its own evidence is file-server traffic, not scanning', /CR-LT-05: TCP 445 to FILESRV-01 only/.test(p.ui.text), p.ui.text);
  await s.pickLabel(/Leave it/); await s.settle();
  const ttcBefore = (await s.peek()).extra.cr.ttc;
  // Isolate exactly the hosts the evidence shows spreading.
  const targets = [...fleet.matchAll(/(CR-LT-\d\d)\s+outbound TCP 445 to \d+ different laptop addresses/g)].map(m => m[1]);
  for (const h of targets) {
    const q = await s.page.evaluate(h => crHostXY(h), h);
    await s.goTo('clerks', q.x, q.y); p = await s.untilChoice();
    if (!/different laptop addresses/.test(p.ui.text)) check('infected laptop shows its scanning evidence: ' + h, false, p.ui.text);
    await s.pickLabel(/Isolate \(Shield Badge\)/); await s.settle();
  }
  p = await s.peek();
  check('containment holds: both infected isolated, counted as needed, time to contain recorded', p.f.crContained && p.extra.cr.isolated.length === 2 && p.extra.cr.ttc === ttcBefore + 1 && p.extra.cr.over === 1, p.extra.cr);
  await s.goTo('clerks', 14, 9);
  await s.settle(null, /Clerks’ Row district: secured/);
  const sum = await s.modalText();
  check('summary: secured, Shield Badge, Tier 2, “Next: Market Square”, scorecard and drills', /Clerks’ Row district: secured/.test(sum) && /Shield Badge/.test(sum) && /Tier 2 incident responder/.test(sum) && /Next: Market Square/.test(sum) && /Mean time to contain/.test(sum) && /The flagged download <b>|The flagged download/.test(sum), sum.slice(0, 300));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after recovery: every laptop patched and lit, isolations released, objective points to Market Square',
    p.f.crBoss && p.metrics.crKev === 100 && p.metrics.crOther === 100 && p.extra.cr.lit === 18 && p.extra.cr.isolated.length === 0 && /Market Square/.test(p.objective.text) && p.extra.crSummary, { m: p.metrics, cr: p.extra.cr, o: p.objective });
  check('series save marks Clerks’ Row done', await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].clerksRow === true));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: triage and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await mailDone(ph, { crMet: true, crAdmin: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); CR(); G.cr.admins = 0; G.map = 'clerks'; G.x = 2; G.y = 2; G.dir = 'up'; run(crConsole); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/clerks-phone-triage.png' });
  check('phone: triage modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  await tapOpt(ph, /^This week$/); await sleep(450);
  check('phone: tapping a batch moves to the next advisory', /2 of 8/.test(await ph.modalText()));
  for (let n = 1; n < 8; n++) { await tapOpt(ph, /^This week$/); await sleep(420); }
  check('phone: the plan review fits too', /Patch plan review/.test(await ph.modalText()) && (await fit()).sw <= 360);
  await tapOpt(ph, /^Deploy this week/); await sleep(420);
  await ph.settle();
  await ph.page.evaluate(() => { const G = __UPTIME.state(); G.f.crPslog = true; G.x = 22; G.y = 3; run(crDrill1); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/clerks-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CLERKS TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
