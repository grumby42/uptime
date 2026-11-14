// Charter (edition 3, the CISO) checks: the prologue and Budget, with real keyboard input.
// Covers: the series menu lists Town Hall, Crossroads, Charter, then "Next edition: coming later"; the carry-over with no
// earlier save (fresh defaults), with only a Town Hall save, with only a Crossroads first save, with only a Crossroads
// New Game+ save (its ngFrom carried: both tracks, finished), and with all three (name, tracks played, badges as
// history, the Quiet Thread notes, the Focus it adds), a damaged save ignored; the Town Hall, Crossroads and Crossroads
// New Game+ saves byte-for-byte unchanged by any of it; the remit (four "who decides" questions), the risk-appetite
// statement (a wrong pick retried, first tries recorded, the Board's levels), tolerances that bind (a line inside its
// level that breaks a tolerance is above appetite: R4 at $0, no call-back rule); the register's owners and review dates
// (the scorecard's owner metric from 0% to 100%); Day 65 a Tuesday; drill A read with one decisive source only is
// unsupported (`needs`), drills B and C supported; drill B's measure like with like (first file to the account
// disabled, 138 minutes to 10); save/reload mid-Budget and the export round trip; the allocation primitive (residual
// and tolerance per line against the appetite, the budget cap, the Send button disabled over budget, lines above
// appetite naming their owner, the tolerances shown on the allocation page and the business-terms page); the Board's
// rule (the upgrade in full; R2 and R3 deferred; R4 then R1 trimmed; no override when the upgrade is already funded;
// persuaded by a within-appetite allocation and Rounds 1 and 2 right first time, it approves the extension; R5 funded
// on every path, brute-forced over every allocation within the budget); the acceptances (the Board's decision against
// the CISO's advice, the residual approved by the Board, each signed by the line's owner for the interim measures, never
// the CISO, with an expiry and a review date) and the minute's wording; Round 3's right answer; the directive (Joanna
// signs her own acceptance; a wrong pick first); the Risk & Budget terminals (Focus +2); the Board's three rounds (a
// wrong first pick in Round 1, so the Board overrides), the Ballast Badge (Focus +4); the scorecard scoring the CISO's
// advice (the allocation as sent) with the Board's decision on its own line; the summary ("Next: Suppliers") and the
// series record; the renamed people and badge (no "Oriel", "Fanshawe" or "Plumb" in the built page); a Crossroads save
// code refused by Charter's import; the Field Manual's Charter heading and intro; zero console errors and network
// requests.
// District 2, Suppliers (slice 2): the tiering rule against the register (by criticality and data/access, not spend: the
// biggest invoice is Tier 2); the clause primitive (must-haves by tier, C6 only with a way in, insurance and indemnity
// never offered to the CISO, the envelope and each supplier's goodwill, the recommended plan, dropped must-haves); an
// acceptance for each must-have left out, decided and signed by the service's owner; the supplier metrics on the advice
// (the tiers as sent, the plan as sent for the Compact's tier-1 contracts); the incident's timeline (the Compact's own
// times, the hours lost, nothing about the supplier's side, an RFC 5737 address); played: drill A read from one decisive
// source is unsupported, a deliberate tier mistake scored on the advice and corrected on the register, a wrong first step
// in Thimbleford's incident recorded, the directive's wrong first pick, the plan sent without Inkmere's C1 (Marit signs),
// the return of cp-xfer held until the answer covers 23:52, the Supplier round, the Hawser Badge, the summary ("Next:
// Policy"), the series record, and the earlier saves unchanged.
// Slice 2 review fixes (charter2): the clause plan shows only what is known on Wednesday at 14:00 (no Thursday figure);
// the tiering rule and the data-flow record agree (Inkmere's record holds names and addresses only: Medium, Tier 2), and
// the criticality words match every supplier's own description; a must-have left out is the CISO's recommendation, the
// owner decides on it and signs, and leaving one out when every must-have fits is scored as poor advice (the plan's
// metric, the send confirmation, the acceptance, the summary), with a second case where extras push one out; Contract A's
// column credits C1 and C2 for the notice and compares entries with entries (C3); each member's counsel decides for its
// own staff (Noor for the Compact); the Compact's own evidence before the return (the edge searched for 203.0.113.77, the
// transfer server's log after the export), and the return measured against Monday's privacy tolerance (above it: Marit's
// acceptance, key-only, one range, every session logged); the directive's procurement mechanics and openers; Round 2's
// distractor; the facts-for-counsel line; C4's period wording; the renamed suppliers (Thimbleford Payroll, Pewterlane AV;
// no Cobbleton or Glasswick in the built page); the Nice items (timeline wording, answer-pattern leans, the tier metric's
// label, the register's game-data line, the Hawser power, Tarnfield's sent time and admin account, the envelope's owner,
// Wellhollow's restore line, the C1 interim's mailbox).
// Usage: node tests/charter.js   (UPTIME_FILE=file:///.../charter/index.html to test another build)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/charter/index.html');
const MENU = path.resolve(__dirname, '../index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const results = {}; let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info).slice(0, 700) : ''); if (!ok) failed = true; }

// Save codes in the engine's format (engine/engine.js encodeSave), built here so the seeded saves are exact strings.
function checksum(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }
const code = obj => { const json = JSON.stringify(obj); return 'UPT1.' + Buffer.from(json, 'utf8').toString('base64') + '.' + checksum(json); };
const TH_SAVE = code({ v: 1, seed: 3, rank: 'Security team lead', badge: true, f: { mrSeal: true, crShield: true, wtTide: true, ccCharter: true, ccSummary: true }, qt: { stage: 2, cluesFound: ['th-signin', 'th-logclear', 'rh-vault'], evicted: false } });
const CR_SAVE = code({ v: 1, edition: 'crossroads', seed: 4, name: 'Avery Lane', trackId: 'manager', rank: 'IR manager', f: { lbBookmark: true, sdSlate: true, cnPulse: true, dpRelay: true, apWindsock: true, fnCompass: true, fnSummary: true }, qt: { stage: 2, cluesFound: ['lb-rdp', 'sd-probe', 'ap-accounts'], evicted: false } });
const NG_SAVE = code({ v: 1, edition: 'crossroads', seed: 5, name: 'Lead', trackId: 'dfir', ngPlus: true, ngFrom: 'manager', rank: 'Principal DFIR consultant', f: { lbBookmark: true }, qt: { stage: 1, cluesFound: ['cn-folders'], evicted: false } });
const SERIES = JSON.stringify({ v: 1, quietThread: { stage: 0, cluesFound: [], evicted: false }, editions: { crossroads: { track: 'manager', ngPlus: true, ngTrack: 'dfir', tracksPlayed: ['manager', 'dfir'], finale: true, editionComplete: true } } });

async function session(ctx, seed) {
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  if (seed) await page.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); for (const k in s) localStorage.setItem(k, s[k]); } }, seed);
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(41); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  async function waitUI() { for (let i = 0; i < 400; i++) { const p = await peek(); if (p.ui) return p; await sleep(15); } throw new Error('no ui'); }
  async function pickLabel(re) {
    const p = await waitUI(); const u = p.ui;
    const idx = u.options.findIndex(o => re.test(o.label) && !o.disabled);
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options.map(o => o.label)));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 40) await press(u.type === 'modal' ? 'down' : (u.cols > 1 ? 'right' : 'down'));
    await press('a'); await sleep(20);
  }
  const modalText = () => page.evaluate(() => (document.querySelector('#modal') || {}).textContent || '');
  // Answer with the good option (or the bot's hint, or a preferred label) until the UI is gone, or until stop matches.
  async function settle(prefs, stop) {
    for (let i = 0; i < 6000; i++) {
      await sleep(12);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return null; continue; }
      if (stop) { const t = p.ui.type === 'modal' ? await modalText() : p.ui.text || ''; if (stop.test(t)) return p; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal' && p.ui.multi) {
        const todo = p.ui.options.findIndex((o, j) => o.meta && o.meta.good && !p.ui.sel.includes(j));
        const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
        let guard = 0; while ((await peek()).ui.cursor !== idx && guard++ < 30) await press('down');
        await press('a'); await sleep(20); continue;
      }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      if (re) { await pickLabel(re); continue; }
      let g = p.ui.options.findIndex(o => o.meta && o.meta.bot && !o.disabled);
      if (g < 0) g = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
      if (g < 0) g = p.ui.options.findIndex(o => !o.disabled);
      await pickLabel(new RegExp('^' + esc(p.ui.options[g].label) + '$'));
    }
    throw new Error('settle timed out: ' + JSON.stringify((await peek()).ui).slice(0, 300));
  }
  async function doorsMap() { return page.evaluate(() => Object.fromEntries(Object.entries(MAPS).map(([k, v]) => [k, Object.entries(v.doors || {}).filter(([, d]) => d.to && !d.locked).map(([xy, d]) => [xy, d.to])]))); }
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
    for (let i = 0; i < 80; i++) { await sleep(12); const q = await peek(); if (q.ui) return 'ui'; if (!q.moving && !q.busy && [q.map, q.x, q.y].join() !== before) return; }
  }
  // Walk to the objective's spot (through doors) and press A on it; returns once a UI opens.
  async function goTo(map, x, y) {
    for (let n = 0; n < 800; n++) {
      const p = await peek();
      if (p.ui || p.busy) return 'ui';
      if (p.map !== map) {
        const D = await doorsMap(), prev = new Map([[p.map, null]]), q = [p.map]; let hop = null;
        while (q.length) { const m = q.shift(); if (m === map) { let k = m; while (prev.get(k)) { hop = prev.get(k); k = hop[0]; } break; } for (const [xy, t] of D[m] || []) if (!prev.has(t)) { prev.set(t, [m, xy]); q.push(t); } }
        if (!hop) throw new Error('no door route to ' + map + ' from ' + p.map);
        const [dx, dy] = hop[1].split(',').map(Number); const pth = bfs(p, dx, dy, true);
        if (await stepOnce(pth.length ? pth[0] : p.dir) === 'ui') return 'ui';
        continue;
      }
      const pth = bfs(p, x, y, false);
      if (!pth.length) {
        const d = Object.entries(DIR).find(([, [dx, dy]]) => p.x + dx === x && p.y + dy === y)[0];
        if (p.dir !== d) { await press(d); await sleep(30); }
        await press('a'); await sleep(40); return 'ui';
      }
      if (await stepOnce(pth[0]) === 'ui') return 'ui';
    }
    throw new Error('goTo timed out');
  }
  async function objectiveStep(prefs, stop) { const p = await peek(); const o = p.objective; if (o.done) return 'done'; await goTo(o.map, o.x, o.y); return settle(prefs, stop); }
  // Follow the objective chain until cond(peek) is true (or a UI matches stop).
  async function follow(cond, prefs, stop) {
    for (let n = 0; n < 80; n++) {
      const p = await peek();
      if (!p.ui && !p.busy && cond(p)) return p;
      if (p.ui) { const r = await settle(prefs, stop); if (r) return r; continue; }
      const r = await objectiveStep(prefs, stop); if (r && r !== 'done') return r;
    }
    throw new Error('follow: condition never met');
  }
  async function newGame() { await pickLabel(/^New game$/); }
  return { page, errors, requests, peek, press, pickLabel, settle, goTo, follow, newGame, modalText };
}

(async () => {
  const t0 = Date.now();
  const browser = await chromium.launch();

  // ---- The series menu ----
  {
    const html = fs.readFileSync(MENU, 'utf8');
    const iT = html.indexOf('editions/town-hall/index.html'), iC = html.indexOf('editions/crossroads/index.html'), iH = html.indexOf('editions/charter/index.html'), iS = html.indexOf('Next edition: coming later');
    check('series menu: Town Hall, then Crossroads, then Charter, then “Next edition: coming later”', iT > 0 && iC > iT && iH > iC && iS > iH, { iT, iC, iH, iS });
  }

  // ======== Carry-over: fresh, Town Hall only, NG+ only, a damaged save ========
  const carry = async (seed, label) => {
    const ctx = await browser.newContext();
    const S = await session(ctx, seed);
    const before = await S.page.evaluate(() => ({ th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save') }));
    await S.newGame();
    const txt = (await S.settle([], /What you carry into Charter/)) ? await S.modalText() : '';
    await S.settle([]);
    const r = await S.page.evaluate(() => ({ carry: G.ch.carry, name: G.name, focusMax: G.focusMax, rank: G.rank, day: G.day, map: G.map, th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save'), ser: Series.load().editions.charter, key: EDITION.saveKey }));
    const unchanged = r.th === before.th && r.cr === before.cr && r.ng === before.ng;
    await ctx.close();
    return { r, txt, unchanged, errors: S.errors, requests: S.requests, label };
  };
  const c0 = await carry(null, 'fresh');
  check('carry-over, no earlier save: name “Lead”, no tracks, no badges, Focus 50, rank CISO, Day 64 in the offices, Charter’s own save key, the series marks Charter started',
    c0.r.name === 'Lead' && c0.r.carry.tracks.length === 0 && !c0.r.carry.thBadges.length && !c0.r.carry.crBadges.length && c0.r.focusMax === 50 && c0.r.rank === 'CISO' && c0.r.day === 64 && c0.r.map === 'choffice' && c0.r.key === 'uptime.charter.save' && c0.r.ser && c0.r.ser.started === true && /No Crossroads save in this browser/.test(c0.txt) && /No Town Hall save/.test(c0.txt), c0.r);
  const c1 = await carry({ 'uptime.slice1.save': TH_SAVE }, 'th');
  check('carry-over, Town Hall only: its badges as history (Key, Seal, Shield, Tide, Charter), its three notes counted, no tracks, Focus 50; the Town Hall save byte-for-byte unchanged',
    JSON.stringify(c1.r.carry.thBadges) === JSON.stringify(['Key', 'Seal', 'Shield', 'Tide', 'Charter']) && c1.r.carry.thClues === 3 && c1.r.carry.crClues === 0 && !c1.r.carry.tracks.length && c1.r.focusMax === 50 && c1.unchanged && c1.r.th !== null, c1.r);
  const c2 = await carry({ 'uptime.crossroads.ngplus.save': NG_SAVE }, 'ng');
  check('carry-over, a Crossroads New Game+ save only (ngFrom: manager): both tracks (its own DFIR and the first save’s manager, from ngFrom), Crossroads finished (a New Game+ save exists only after the ending), the Bookmark Badge, its note, Focus 56; the save byte-for-byte unchanged',
    JSON.stringify(c2.r.carry.tracks) === JSON.stringify(['dfir', 'manager']) && JSON.stringify(c2.r.carry.crBadges) === JSON.stringify(['Bookmark']) && c2.r.carry.crClues === 1 && c2.r.focusMax === 56 && c2.unchanged && c2.r.ng !== null && c2.r.carry.crDone === true, c2.r);
  const c4 = await carry({ 'uptime.crossroads.save': CR_SAVE }, 'cr');
  check('carry-over, a Crossroads first save only: its name, the manager track, its six badges, its three notes, finished, Focus 54; the save byte-for-byte unchanged',
    c4.r.name === 'Avery Lane' && JSON.stringify(c4.r.carry.tracks) === JSON.stringify(['manager']) && c4.r.carry.crBadges.length === 6 && c4.r.carry.crClues === 3 && c4.r.carry.crDone === true && c4.r.focusMax === 54 && c4.unchanged && c4.r.cr === CR_SAVE, c4.r);
  const c3 = await carry({ 'uptime.slice1.save': 'UPT1.garbage.0', 'uptime.crossroads.save': 'not a save' }, 'damaged');
  check('carry-over, damaged saves: ignored (fresh defaults), left as they were, no error', c3.r.carry.th === 'none' && c3.r.carry.cr === 'none' && c3.r.name === 'Lead' && c3.unchanged && c3.r.th === 'UPT1.garbage.0' && !c3.errors.length, c3.r);
  for (const c of [c0, c1, c2, c3, c4]) check('carry-over (' + c.label + '): no console errors or network requests', !c.errors.length && !c.requests.length, { e: c.errors, r: c.requests });

  // ======== The full run: all three earlier saves present ========
  const ctx = await browser.newContext();
  const seed = { 'uptime.slice1.save': TH_SAVE, 'uptime.crossroads.save': CR_SAVE, 'uptime.crossroads.ngplus.save': NG_SAVE, 'uptime.series': SERIES };
  const A = await session(ctx, seed);
  await A.newGame();
  await A.settle([]);
  const a0 = await A.page.evaluate(() => ({ carry: G.ch.carry, name: G.name, focusMax: G.focusMax, obj: objective().text }));
  check('carry-over, all three saves: the name from the Crossroads save, both tracks, Town Hall’s and Crossroads’ badges, every note (3 + 4), Crossroads finished, Focus 56',
    a0.name === 'Avery Lane' && JSON.stringify(a0.carry.tracks) === JSON.stringify(['dfir', 'manager']) && a0.carry.thBadges.includes('Charter') && a0.carry.crBadges.length === 6 && a0.carry.thClues === 3 && a0.carry.crClues === 4 && a0.carry.crDone && a0.focusMax === 56 && /Ivor Penhallow/.test(a0.obj), a0);

  // The remit and the appetite: a wrong pick on the first appetite category, then the right one.
  await A.goTo('chboard', 8, 3);
  const firstAp = await A.settle([], /Risk appetite · Service availability/);
  const wrongAp = firstAp.ui.options.findIndex(o => !(o.meta && o.meta.good));
  await A.pickLabel(new RegExp('^' + esc(firstAp.ui.options[wrongAp].label) + '$'));
  await A.settle([]);
  const p1 = await A.page.evaluate(() => ({ remit: G.ch.remit, ap: G.ch.appetite, f: G.f, fm: G.fm, within: [chWithin('avail', 'Medium'), chWithin('privacy', 'Medium'), chWithin('safety', 'Low'), chWithin('fin', 'Medium')], tolBroken: chWithin('fin', 'Medium', ['a tolerance']), r4: CH_LINES.find(l => l.id === 'R4').opts.map(o => chOptWithin(CH_LINES.find(l => l.id === 'R4'), o)), tolFin: chTol('fin'), m: metricVals() }));
  check('remit: four “who decides” questions, right first time, the remit and NICE facts unlocked', p1.remit.first.length === 4 && p1.remit.first.every(Boolean) && p1.fm['act:chremit'] && p1.fm['fact:chnice'], p1.remit);
  check('appetite: a wrong first pick is retried and recorded; the Board’s levels (availability Moderate, privacy Low, safety Low, financial Moderate) with measurable tolerances; within-appetite tests follow them',
    p1.ap.first[0] === false && p1.ap.first.slice(1).every(Boolean) && JSON.stringify(p1.ap.levels) === JSON.stringify({ avail: 'Moderate', privacy: 'Low', safety: 'Low', fin: 'Moderate' }) && /24 hours/.test(p1.ap.tol.avail) && /\$25k/.test(p1.ap.tol.fin) && JSON.stringify(p1.within) === JSON.stringify([true, false, true, true]) && p1.fm['fact:chcsf'], p1.ap);
  check('tolerances bind: a Medium financial line inside the Moderate level but breaking a tolerance is above appetite; R4 at $0 (no call-back rule) is above, R4 at $20k within; the approved financial tolerance names the call-back',
    p1.tolBroken === false && JSON.stringify(p1.r4) === JSON.stringify([false, true]) && /call-back on a known number/.test(p1.tolFin), { tolBroken: p1.tolBroken, r4: p1.r4, tolFin: p1.tolFin });
  await A.follow(p => p.f.chBudgetBrief, []);
  const own0 = (await A.peek()).metrics.chOwned;
  await A.follow(p => p.f.chRegister, []);
  const p2 = await A.page.evaluate(() => ({ reg: G.ch.register, m: metricVals(), pal: tileDef('choffice', 2, 1).pal }));
  check('register: three named owners (Edda, Marit, Celia) for the department lines, Day 155 reviews; the owner-and-review metric goes 0% → 100%; the wall ticks',
    own0 === 0 && p2.m.chOwned === 100 && p2.reg.owners.R2 === 'Edda Thornquist' && p2.reg.owners.R4 === 'Marit Quellan' && p2.reg.owners.R5 === 'Celia Marrow' && Object.values(p2.reg.review).every(d => d === 155) && p2.pal === 'chRegOk', { own0, p2 });
  await A.follow(p => p.f.chDay64, []);
  const d65 = await A.page.evaluate(() => ({ day: G.day, wd: CH_DAY[G.day], hud: hudStatus() }));
  check('Day 65 is a Tuesday (the series day count: Day 1 was a Monday)', d65.day === 65 && d65.wd === 'Tuesday' && (65 - 1) % 7 === 1 && /Tuesday/.test(d65.hud), d65);

  // Drill A, read from one decisive source only: right verdict, unsupported.
  await A.goTo('choffice', 12, 2);
  await A.settle([], /Investigation drill · “MFA on every sign-in”/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/^Query: The sign-in policy and its exceptions/);
  await A.pickLabel(/^Who is excepted from MFA/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/I have enough: decide/);
  await A.settle([]);
  const pA = await A.page.evaluate(() => ({ d: G.ch.drills.mfaclaim, needs: G.ch.needs, f: G.f }));
  check('drill A (the MFA claim): the right verdict read from the policy alone is unsupported (needs: the policy and the sign-in records)', pA.d.verdictOk === true && pA.d.supported === false && pA.needs.met === 0 && pA.needs.total === 1 && pA.f.chDrillA, pA);

  // Save / reload mid-Budget, and the export round trip.
  const before = await A.page.evaluate(() => JSON.stringify({ f: G.f, ch: G.ch, day: G.day, map: G.map, x: G.x, y: G.y, focus: G.focus }));
  const exp = await A.page.evaluate(() => encodeSave(G));
  await A.page.evaluate(() => storeSet(encodeSave(G)));
  await A.page.reload(); await A.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await A.page.evaluate(() => __UPTIME.turbo(true));
  await A.pickLabel(/^Continue$/); await sleep(150);
  const after = await A.page.evaluate(() => JSON.stringify({ f: G.f, ch: G.ch, day: G.day, map: G.map, x: G.x, y: G.y, focus: G.focus }));
  const rt = await A.page.evaluate(c => { const g = decodeSave(c); return g.edition === 'charter' && g.day === G.day && JSON.stringify(g.ch) === JSON.stringify(G.ch); }, exp);
  check('save/reload mid-Budget restores the state exactly; the export code round-trips', before === after && rt, { same: before === after, rt });

  await A.follow(p => p.f.chDrillC, []);
  const pB = await A.page.evaluate(() => ({ d: G.ch.drills, needs: G.ch.needs }));
  check('drills B (the night-cover line) and C (two quotes): both decisive sources read, supported', pB.d.nightline.supported && pB.d.quotes.supported && pB.d.nightline.verdictOk && pB.d.quotes.verdictOk && pB.needs.met === 2 && pB.needs.total === 3, pB);
  await A.follow(p => p.f.chDay65, []);

  // The allocation primitive, checked on its own rules before it is played.
  const prim = await A.page.evaluate(() => {
    const rec = Object.fromEntries(CH_LINES.map(l => [l.id, l.rec])), zero = Object.fromEntries(CH_LINES.map(l => [l.id, 0])), max = Object.fromEntries(CH_LINES.map(l => [l.id, l.opts.length - 1]));
    const sRec = chAllocStats(rec), sZero = chAllocStats(zero), sMax = chAllocStats(max);
    const dRec = chBoardDecide(rec), dRecP = chBoardDecide(rec, true), dUp = chBoardDecide(Object.assign({}, rec, {R6: 2, R2: 0, R3: 0, R4: 0}));
    const noR5 = chBoardDecide(Object.assign({}, rec, {R1: 2, R2: 2, R3: 2, R4: 1}));
    // The review's case: the upgrade funded by the CISO and R5 left at $0. Never approved as sent.
    const r5case = {R1: 2, R2: 1, R3: 1, R4: 0, R5: 0, R6: 2}, dR5 = chBoardDecide(r5case), dR5p = chBoardDecide(r5case, true);
    const r5caseB = {R1: 2, R2: 1, R3: 1, R4: 1, R5: 0, R6: 2}, dR5B = chBoardDecide(r5caseB, true);
    // Every allocation within the budget, persuaded or not: R5 funded in the final, the total within the budget; the
    // advice score (the allocation as sent) is best only for allocations that keep every line within appetite.
    const all = []; const walk = (i, cur) => { if (i === CH_LINES.length) { all.push(Object.assign({}, cur)); return; } for (let k = 0; k < CH_LINES[i].opts.length; k++) { cur[CH_LINES[i].id] = k; walk(i + 1, cur); } };
    walk(0, {});
    const fits = all.filter(x => chAllocStats(x).total <= CH_BUDGET);
    const guard = fits.every(x => [false, true].every(p => { const d = chBoardDecide(x, p); return d.final.R5 === 1 && chAllocStats(d.final).total <= CH_BUDGET && (x.R5 === 1 || (d.restored.includes('R5') && JSON.stringify(d.final) !== JSON.stringify(x))); }));
    const best = Math.max(...fits.map(x => chAllocStats(x).within)), bestAll = fits.filter(x => chAllocStats(x).within === best);
    const accDec = {decidedBy: 'the Compact Board (minute, Day 67), against the CISO’s advice', approvedBy: 'the Compact Board'};
    const acc = chAboveAppetite(dRec.final).map(l => chAcceptance(l, dRec.final, accDec, 67));
    const r5off = chAboveAppetite(Object.assign({}, rec, {R5: 0})).map(l => l.id + ':' + l.owner);
    const min = {R1: 2, R2: 1, R3: 1, R4: 0, R5: 1, R6: 1}, minOk = Object.assign({}, min, {R4: 1});
    return { sRec, sZero: {total: sZero.total, within: sZero.within, above: sZero.above.map(l => l.id)}, sMax: sMax.total, dRec, dRecP, dUp, noR5: noR5.final.R5, dR5, dR5p, dR5B, guard, nFits: fits.length, best, bestAll: bestAll.length, bestHaveR5: bestAll.every(x => x.R5 === 1),
      overAbove: chAboveAppetite(dRec.final).map(l => l.id), r4final: chOptWithin(chLine('R4'), chOpt(dRec.final, chLine('R4'))), acc, r5off, budget: CH_BUDGET, qa: chWithin('privacy', CH_LINES[0].opts[1].res),
      min: chAllocStats(min).within, minOk: [chAllocStats(minOk).within, chAllocStats(minOk).total], advR5: chAllocStats(r5case).within };
  });
  check('allocation: the recommended allocation is $480k, every line within appetite and its tolerances, 96% on the top five; with nothing funded no line is within (R4 at $0 breaks the call-back tolerance); everything at once is over budget; Quote A leaves R1 above appetite',
    prim.sRec.total === 480 && prim.sRec.within === 6 && prim.sRec.topPct === 96 && prim.sZero.total === 0 && prim.sZero.within === 0 && JSON.stringify(prim.sZero.above) === JSON.stringify(['R1', 'R2', 'R3', 'R4', 'R5', 'R6']) && prim.sMax > prim.budget && prim.qa === false, prim.sZero);
  check('tolerances in the allocation: the cheapest all-within set needs R4’s $20k ($440k): with R4 at $0 ($420k) only 5 of 6 are within',
    prim.min === 5 && prim.minOk[0] === 6 && prim.minOk[1] === 440, { min: prim.min, minOk: prim.minOk });
  check('the Board’s override rule: the upgrade in full, R2 and R3 deferred, then R4 trimmed to fit $480k; no override when the upgrade is already funded; R5 never cut',
    prim.dRec.override && prim.dRec.final.R6 === 2 && prim.dRec.final.R2 === 0 && prim.dRec.final.R3 === 0 && prim.dRec.final.R4 === 0 && prim.dRec.final.R1 === 2 && prim.dRec.final.R5 === 1 && JSON.stringify(prim.dRec.cut) === JSON.stringify(['R2', 'R3', 'R4']) && !prim.dUp.override && prim.noR5 === 1, prim.dRec);
  check('the override is consistent with the tolerances: its R4 at $0 does not read as within (it breaks the call-back tolerance), so R2, R3 and R4 are left above appetite',
    prim.r4final === false && JSON.stringify(prim.overAbove) === JSON.stringify(['R2', 'R3', 'R4']), { r4final: prim.r4final, overAbove: prim.overAbove });
  check('the Board persuaded (an allocation within appetite on every line, Rounds 1 and 2 right first time): it approves the recommended allocation as sent, the extension carrying R6',
    !prim.dRecP.override && prim.dRecP.persuaded && JSON.stringify(prim.dRecP.final) === JSON.stringify({ R1: 2, R2: 1, R3: 2, R4: 1, R5: 1, R6: 1 }) && !prim.dRecP.cut.length && !prim.dRecP.restored.length, prim.dRecP);
  check('R5 guard on every path: {R5: $0, the upgrade funded} is never approved as sent (R5 funded in the minute, R2 then R3 trimmed to fit), persuaded or not; across all ' + prim.nFits + ' allocations within $480k, persuaded or not, the Board’s final always funds R5 and fits the budget',
    prim.dR5.restored.includes('R5') && prim.dR5.final.R5 === 1 && !prim.dR5.override && JSON.stringify(prim.dR5.cut) === JSON.stringify(['R2', 'R3']) && prim.dR5p.final.R5 === 1 && prim.dR5p.restored.includes('R5') && prim.dR5B.final.R5 === 1 && prim.guard, { dR5: prim.dR5, dR5B: prim.dR5B, guard: prim.guard });
  check('the scorecard rewards the advice: the best advice score (6 of 6 within appetite and tolerances) is reached only by allocations that fund R5; the review’s {R5: $0, upgrade} allocation scores 4 of 6',
    prim.best === 6 && prim.bestAll >= 1 && prim.bestHaveR5 && prim.advR5 === 4, { best: prim.best, bestAll: prim.bestAll, advR5: prim.advR5 });
  check('acceptances: each line the Board’s override leaves above appetite (R2, R3, R4) is the Board’s decision, approved by the Board, and signed by its owner (Edda for R2 and R3, Marit for R4, with the broken call-back tolerance), never the CISO, with expiry Day 428 and review Day 155; R5 unfunded would be Celia’s line',
    prim.acc.length === 3 && prim.acc.every(a => a.signedBy === a.owner && a.decider === 'Board' && a.approvedBy === 'the Compact Board' && /Compact Board \(minute, Day 67\), against the CISO’s advice/.test(a.decidedBy) && a.expiry === 428 && a.review === 155) &&
    prim.acc.filter(a => a.signedBy === 'Edda Thornquist').map(a => a.line).join() === 'R2,R3' && prim.acc.find(a => a.line === 'R4').signedBy === 'Marit Quellan' && /call-back/.test(prim.acc.find(a => a.line === 'R4').breaks.join()) && JSON.stringify(prim.r5off) === JSON.stringify(['R5:Celia Marrow']), { acc: prim.acc, r5off: prim.r5off });
  const txt = await A.page.evaluate(() => ({ r3: CH_BOARD_SPECS()[2].resp.map(r => [r.label, !!r.good]), drillB: JSON.stringify(CH_DRILLS.nightline), opts: chOptionsHtml(), allData: [...document.scripts].map(x => x.textContent).join('\n') }));
  const r3good = txt.r3.find(r => r[1]);
  check('Round 3’s right answer: no, each owner signs for running it and the minute records that the Board chose and accepted it; “the Board signs them all instead of the owners” is wrong for a stated reason (nobody runs the interim checks)',
    /^No: each owner signs for running it, and the minute records that the Board chose and accepted it/.test(r3good[0]) && txt.r3.some(r => !r[1] && /^The Board signs them all instead of the owners, and nobody runs the interim checks$/.test(r[0])), txt.r3);
  check('drill B compares like with like: first file to the account disabled, 138 minutes to 10 (05:52 → 08:10, 02:31 → 02:41); no “108 minutes” or “first look” left; a hedged distractor is wrong',
    /first file to the account disabled fell from 138 minutes to 10/.test(txt.drillB) && /138 minutes to 10 on these two nights/.test(txt.drillB) && !/108|first look/.test(txt.drillB) && /Can’t say from two nights alone/.test(txt.drillB), null);
  check('the business-terms page: “(game)” in its first line, Monday’s tolerance under each of the six lines, and R4 at $0 shown as breaking the call-back tolerance',
    /^<p class="small">Every price, rating and figure on this page is game data \(game\)\./.test(txt.opts) && (txt.opts.match(/Tolerance \(Monday\): /g) || []).length === 6 && /\$0: As now: fin-ap[^<]*Left: Medium, above appetite: it breaks the tolerance “no payment detail changed without a call-back on a known number”/.test(txt.opts), null);
  check('names: no “Oriel”, “Fanshawe” or “Plumb” anywhere in the built Charter page’s scripts; the finance director is Marit Quellan and the badge the Ballast Badge',
    !/Oriel|Fanshawe|Plumb/.test(txt.allData) && /Ballast Badge/.test(txt.allData) && /Marit/.test(txt.allData), null);

  // Play the allocation: first push R6 to the upgrade and R5 off (over budget? no: check the Send button), then the bot's path.
  await A.goTo('choffice', 26, 9);
  await A.settle([], /Budget · next year/);
  const al0 = await A.page.evaluate(() => ({ items: UI.modal.items.map(o => ({ label: o.label, note: o.note || '', dis: !!o.disabled, k: o.meta && o.meta.k })), body: document.getElementById('mbody').textContent }));
  check('the allocation page: six lines, each with its cost and residual, “above appetite” where it is, R4 at $0 “breaks a tolerance”, each line’s note naming its tolerance; owners named for the lines needing an acceptance; Send enabled at $0',
    al0.items.filter(i => /^R\d/.test(i.label)).length === 6 && /R1 Vendor support by hand: \$0, Medium, above appetite/.test(al0.items[0].label) && /R4 Payment fraud by email: \$0, Medium, breaks a tolerance$/.test(al0.items[3].label) &&
    al0.items.filter(i => /^R\d/.test(i.label)).every(i => /Tolerance: /.test(i.note) && /\(A cycles\)$/.test(i.note)) && /call-back on a known number\. This option breaks it\./.test(al0.items[3].note) &&
    /\(Edda Thornquist\)/.test(al0.body) && /\(Celia Marrow\)/.test(al0.body) && /R4 \(Marit Quellan\), breaking a tolerance/.test(al0.body) && !al0.items.find(i => i.k === 'send').dis, al0);
  // Every line to its most expensive option with the keyboard (right arrow), then check the cap.
  // One line changed with the real right-arrow key (R1, the highlighted row at open), the rest through the same lr path.
  // (if the highlighted row is out of view at open, the first press only brings it into view: the engine's S1 guard)
  let key1 = 0, presses = 0;
  while (key1 === 0 && presses < 3) { await A.press('right'); presses++; await sleep(150); key1 = await A.page.evaluate(() => G.ch.alloc.R1); }
  const over = await A.page.evaluate(async () => {
    for (let r = 0; r < 6; r++) { const want = CH_LINES[r].opts.length - 1; for (let g = 0; g < 6 && G.ch.alloc[CH_LINES[r].id] !== want; g++) { if (!UI.modal) await new Promise(z => setTimeout(z, 60)); UI.closeModal({lr: true, d: 1, i: r}); await new Promise(z => setTimeout(z, 60)); } }
    await new Promise(z => setTimeout(z, 100));
    const send = UI.modal.items.find(o => o.meta && o.meta.k === 'send');
    return { label: send.label, dis: !!send.disabled, total: chAllocStats(G.ch.alloc).total };
  });
  check('the right arrow moves a line to its next option (R1 $0 → Quote A); the budget cap: every line at its dearest option totals $670k, and Send is disabled with “Over the budget by $190k”', key1 === 1 && over.total === 670 && over.dis && /Over the budget by \$190k/.test(over.label), { key1, over });
  await A.settle([]);
  const pAl = await A.page.evaluate(() => ({ sent: G.ch.sent, f: G.f, m: metricVals() }));
  check('the allocation sent (the recommended one): every line within appetite and tolerances (100%), 96% of it on the top five; Wednesday’s papers', JSON.stringify(pAl.sent) === JSON.stringify({ R1: 2, R2: 1, R3: 2, R4: 1, R5: 1, R6: 1 }) && pAl.m.chWithin === 100 && pAl.m.chTop5 === 96 && pAl.f.chAlloc, pAl);

  // The directive: a wrong pick first (signing it for her), then the right one.
  await A.goTo('choffice', 6, 3);
  const dir = await A.settle([], /Joanna’s acceptance/);
  await A.pickLabel(/^Sign it for her/);
  await A.settle([]);
  const pD = await A.page.evaluate(() => ({ d: G.ch.directive, acc: G.ch.accept, f: G.f }));
  check('directive: Joanna signs her own acceptance (a wrong first pick, “sign it for her”, recorded); residual Medium against the Low privacy appetite; expiry and review dated',
    !!dir && pD.d.first === false && pD.acc.length === 1 && pD.acc[0].signedBy === 'Joanna Ferreday' && pD.acc[0].owner === 'Joanna Ferreday' && pD.acc[0].residual === 'Medium' && pD.acc[0].appetite === 'Low' && pD.acc[0].expiry === 428 && pD.f.chDirective, pD);
  const fm0 = await A.page.evaluate(() => G.focusMax);
  await A.follow(p => p.f.chDojoDone, []);
  const pJ = await A.page.evaluate(() => ({ dojo: G.ch.dojo, fm: G.focusMax }));
  check('the Risk & Budget terminals: three puzzles solved, Focus +2', pJ.dojo.every(Boolean) && pJ.fm === fm0 + 2, pJ);
  await A.follow(p => p.f.chDay66, []);

  // The Board's budget round: a wrong first pick in Round 1 (so the Board is not persuaded and overrides), the rest right.
  const fm1 = await A.page.evaluate(() => G.focusMax);
  const r1 = await A.follow(p => p.f.chBoard, [], /Round 1: two asks, one budget/);
  const wrongR1 = r1.ui.options.findIndex(o => !(o.meta && o.meta.good));
  await A.pickLabel(new RegExp('^' + esc(r1.ui.options[wrongR1].label) + '$'));
  await A.follow(p => p.f.chBoard, [], /The minute records the Board’s decision/);
  const minuteTxt = await A.modalText();
  await A.follow(p => p.f.chBoard, []);
  const pBo = await A.page.evaluate(() => ({ b: G.ch.board, dec: G.ch.decision, fin: G.ch.final, acc: G.ch.accept, f: G.f, fm: G.focusMax, m: metricVals(), badges: EDITION.badgeFlags, day: G.day, sc: editionScorecard() }));
  const d67 = pBo.acc.filter(a => a.day === 67);
  check('the Board: a wrong first pick in Round 1 recorded, so it is not persuaded and overrides (upgrade in full; R2, R3 and R4 deferred); three acceptances, each the Board’s decision against the CISO’s advice, approved by the Board, signed by its owner (Edda R2 and R3, Marit R4); Joanna’s before it too; the Ballast Badge, Focus +4; Thursday',
    JSON.stringify(pBo.b.first) === JSON.stringify([false, true, true]) && pBo.dec.override && !pBo.dec.persuaded && JSON.stringify(pBo.dec.cut) === JSON.stringify(['R2', 'R3', 'R4']) && pBo.fin.R6 === 2 && pBo.fin.R5 === 1 && pBo.acc.length === 4 &&
    d67.map(a => a.line + ':' + a.signedBy).join() === 'R2:Edda Thornquist,R3:Edda Thornquist,R4:Marit Quellan' && d67.every(a => a.decider === 'Board' && a.approvedBy === 'the Compact Board' && /against the CISO’s advice/.test(a.decidedBy) && a.signedBy === a.owner) &&
    pBo.f.chBallast && pBo.badges.includes('chBallast') && pBo.fm === fm1 + 4 && pBo.day === 67, pBo);
  check('the Board’s minute records its decision to carry R2, R3 and R4 above appetite until Day 428 with the CISO’s advice against it, and its acceptance of the residual risk approved by the Board; the table shows who decided and who signed',
    /The minute records the Board’s decision to carry R2, R3 and R4 above appetite until Day 428, with the CISO’s advice against it and the objection noted, and its acceptance of the residual risk, approved by the Board\. Each owner signs for the interim measures and owns the treatment plan\./.test(minuteTxt) && /Decided/.test(minuteTxt) && /carrying the residual risk approved by the Compact Board/.test(minuteTxt) && /breaks the tolerance “no payment detail changed without a call-back on a known number”/.test(minuteTxt), minuteTxt.slice(0, 600));
  check('scorecard after the Board scores the advice, not the override: risks within appetite (your advice) 100%, owners and review dates 100%, top five 96%; the Board’s decision shown on its own line (3 of 6, overriding your advice)',
    pBo.m.chWithin === 100 && pBo.m.chOwned === 100 && pBo.m.chTop5 === 96 && /Risks within appetite \(your advice\)/.test(pBo.sc) && /The Board’s decision: <b>3 of 6<\/b> lines within appetite, overriding your advice/.test(pBo.sc), { m: pBo.m, sc: pBo.sc.slice(0, 900) });
  await A.follow(() => false, [], /End of Budget/);
  const sum = await A.modalText();
  const pS = await A.page.evaluate(() => ({ obj: objective(), ser: Series.load().editions.charter, f: G.f, keep: { th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save') } }));
  check('the summary: “Next: Suppliers”, the drills, your advice and the Board’s decision on separate lines, the acceptances (the Board’s decisions, signed by their owners; Joanna’s, her own), the lesson on the governing body’s minute, the scorecard, the thread still open; the series records Budget; the objective moves on to Suppliers',
    /Next: Suppliers/.test(sum) && /Two quotes for R1/.test(sum) && /Your advice: the allocation you sent, 6 of 6 lines within appetite and its tolerances/.test(sum) && /overrode your allocation/.test(sum) && /The Board’s decision: 3 of 6 lines within appetite/.test(sum) &&
    /Signed by Edda Thornquist, its owner/.test(sum) && /Signed by Marit Quellan, its owner/.test(sum) && /Signed by Joanna Ferreday, its owner/.test(sum) && /a risk the governing body decides to carry above its own appetite is also minuted as the governing body’s decision/.test(sum) &&
    /Risks within appetite/.test(sum) && /still open/.test(sum) && pS.ser.budget === true && !pS.obj.done && /^Next week, Monday: your desk\.$/.test(pS.obj.text) && pS.f.chSummary, { ser: pS.ser, obj: pS.obj, sum: sum.slice(0, 1500) });
  check('the Town Hall, Crossroads and Crossroads New Game+ saves are byte-for-byte as seeded after the whole run', pS.keep.th === TH_SAVE && pS.keep.cr === CR_SAVE && pS.keep.ng === NG_SAVE, null);
  await A.settle([/^Keep exploring/]);

  // ======== District 2: Suppliers ========
  const sp = await A.page.evaluate(() => {
    const rule = CH_SUPPLIERS.map(s => s.id + ':' + chTierRule(s)), spendOrder = CH_SUPPLIERS.map(s => s.spend);
    const must = Object.fromEntries(CH_SUPPLIERS.map(s => [s.id, chMust(s)]));
    const offered = [].concat(...CH_SUP_CONTRACTS.map(k => Object.keys(k.offer)));
    const rec = Object.fromEntries(CH_SUP_CONTRACTS.map(k => [k.id, chPlanRec(k.id)])), sRec = chPlanStats(rec);
    const plus = JSON.parse(JSON.stringify(rec)); plus.inkmere.push('C3'); const sPlus = chPlanStats(plus);
    const greedy = JSON.parse(JSON.stringify(rec)); greedy.inkmere.push('C5', 'C8'); const sGreedy = chPlanStats(greedy);
    const none = Object.fromEntries(CH_SUP_CONTRACTS.map(k => [k.id, []])), sNone = chPlanStats(none);
    const noC1 = JSON.parse(JSON.stringify(rec)); noC1.thimbleford = noC1.thimbleford.filter(c => c !== 'C1');
    const sup = chSup(), keep = JSON.parse(JSON.stringify(sup));
    sup.sent = Object.fromEntries(CH_SUPPLIERS.map(s => [s.id, chTierRule(s)])); sup.planSent = rec; const mRec = chSupStats();
    sup.planSent = noC1; const mNoC1 = chSupStats();
    sup.sent = Object.assign({}, sup.sent, {inkmere: 3}); const mTier = chSupStats();
    G.ch.sup = keep;
    const acc = chClauseAccept('inkmere', 'C1', 73);
    // Decision 3: leaving a must-have out is the CISO's recommendation; the owner decides on it and signs; poor advice when
    // every must-have fits. Case 1: Inkmere C1 left out with room for it. Case 2: extras (Inkmere C3, C8) push it out.
    const noInkC1 = JSON.parse(JSON.stringify(rec)); noInkC1.inkmere = noInkC1.inkmere.filter(c => c !== 'C1');
    const adv1 = chPlanAdvice(noInkC1), acc1 = chClauseAccept('inkmere', 'C1', 73, adv1);
    const extras = JSON.parse(JSON.stringify(noInkC1)); extras.inkmere.push('C3', 'C8');
    const sEx = chPlanStats(extras), adv2 = chPlanAdvice(extras), acc2 = chClauseAccept('inkmere', 'C1', 73, adv2), advRec = chPlanAdvice(rec);
    const keep2 = G.ch.sup; G.ch.sup = sup; sup.sent = Object.fromEntries(CH_SUPPLIERS.map(s => [s.id, chTierRule(s)])); sup.planSent = noInkC1; const mNoInk = chSupStats(); G.ch.sup = keep2;
    const fit = s => adv1.left.map(x => chFitText(x, adv1)).join();
    return { rule, spendOrder, must, offered, sRec, sPlus: {cost: sPlus.cost, ok: sPlus.ok}, sGreedy: {ok: sGreedy.ok, over: sGreedy.per.inkmere.overGoodwill}, sNone: {ok: sNone.ok, mustIn: sNone.mustIn, mustTotal: sNone.mustTotal},
      mRec, mNoC1, mTier, acc, acc1, acc2, adv1, adv2, advRec, sEx: {cost: sEx.cost, ok: sEx.ok}, mNoInk, fit1: fit(), accHtml: chClauseAcceptHtml([acc1, acc2]),
      tl: chSupTimelineHtml(), counsel: CH_CLAUSE_COUNSEL, sTiers: CH_SUPPLIERS.map(s => [s.id, s.compact, s.owner]) };
  });
  check('suppliers: the tiering rule gives Inkmere Tier 2, Thimbleford, Wrenfold, Tarnfield, Wellhollow, Stillmark and Shelfwright Tier 1, Pewterlane Tier 3; the register is inherited in order of spend, and the biggest invoice (Inkmere) is not Tier 1',
    sp.rule.join() === 'inkmere:2,thimbleford:1,wrenfold:1,tarnfield:1,wellhollow:1,stillmark:1,shelfwright:1,pewterlane:3' && sp.spendOrder.every((x, i) => !i || x <= sp.spendOrder[i - 1]) && sp.spendOrder[0] === 210, { rule: sp.rule, spend: sp.spendOrder });
  check('clauses: must-haves follow the tier (Tier 1 with a way in: C1–C8; Wellhollow, no way in: no C6; Tier 2: C1, C2, C4, C7; Tier 3: C2); insurance and indemnity are counsel’s and procurement’s, never offered',
    sp.must.thimbleford.join() === 'C1,C2,C3,C4,C5,C6,C7,C8' && sp.must.wellhollow.join() === 'C1,C2,C3,C4,C5,C7,C8' && sp.must.inkmere.join() === 'C1,C2,C4,C7' && sp.must.pewterlane.join() === 'C2' && sp.counsel.join() === 'Insurance,Indemnity' && !sp.offered.some(c => !/^C[1-8]$/.test(c)), sp.must);
  check('the clause plan: every missing must-have sought costs $28k of the $30k envelope, within every supplier’s goodwill; adding Inkmere’s log clause goes over the envelope ($31k); asking Inkmere for C5 and C8 too goes over its goodwill; sending nothing leaves 6 of 20 must-haves',
    sp.sRec.cost === 28 && sp.sRec.ok && sp.sRec.mustIn === 20 && sp.sPlus.cost === 31 && !sp.sPlus.ok && !sp.sGreedy.ok && sp.sGreedy.over && sp.sNone.ok && sp.sNone.mustIn === 6 && sp.sNone.mustTotal === 20, { rec: sp.sRec, plus: sp.sPlus, greedy: sp.sGreedy, none: sp.sNone });
  check('the supplier metrics read the advice: the recommended tiers and plan give 100/100/100/100; the plan without Thimbleford’s C1 gives critical 50%, notification 50%, must-haves 95%; without Inkmere’s C1, critical and notification stay 100% but must-haves fall to 95% (poor advice); Inkmere tiered 3 gives tiers 88%',
    sp.mRec.tier === 100 && sp.mRec.crit === 100 && sp.mRec.notify === 100 && sp.mRec.must === 100 && !sp.mRec.poor && sp.mNoC1.crit === 50 && sp.mNoC1.notify === 50 && sp.mNoC1.must === 95 && sp.mNoC1.poor &&
    sp.mNoInk.crit === 100 && sp.mNoInk.notify === 100 && sp.mNoInk.must === 95 && sp.mNoInk.poor && sp.mTier.tier === 88 && sp.mRec.memFull === 0 && sp.mRec.members === 4, { rec: sp.mRec, noC1: sp.mNoC1, noInk: sp.mNoInk, tier: sp.mTier });
  check('a must-have left out (decision 3): the CISO’s recommendation, recorded as the CISO’s; the owner (Inkmere C1: Marit) decides on it and signs, one decider, never the CISO, with expiry Day 428, review Day 155 and an interim measure; with room for it in the envelope and goodwill, poor advice, and the fit stated ($6k of the envelope left, goodwill 2 left)',
    sp.acc1.recommendedBy === 'the CISO (your plan)' && sp.acc1.decider === 'Marit' && sp.acc1.signedBy === 'Marit Quellan' && sp.acc1.decidedBy === 'Marit Quellan, its owner, on the CISO’s recommendation' && sp.acc1.poor === true &&
    sp.acc1.expiry === 428 && sp.acc1.review === 155 && sp.acc1.interim.length > 20 && sp.adv1.poor && sp.adv1.fitsAll && sp.adv1.left.length === 1 && sp.adv1.left[0].fitsNow && sp.fit1 === 'Inkmere C1 fits: $6k of the envelope left, goodwill 2 left' &&
    sp.acc.decidedBy === 'Marit Quellan, its owner, on the CISO’s recommendation' && sp.acc.poor === true && !sp.advRec.left.length && !sp.advRec.poor &&
    /<th>Advised<\/th><th>Decided<\/th><th>Signed<\/th>/.test(sp.accHtml) && /left out on the CISO’s recommendation \(your plan\): poor advice \(game\)/.test(sp.accHtml) && /Decided by Marit Quellan, its owner, on the CISO’s recommendation; signed by Marit Quellan/.test(sp.accHtml), { acc1: sp.acc1, adv1: sp.adv1, fit: sp.fit1 });
  check('a must-have pushed out by extras (decision 3, second case): Inkmere C3 and C8 sought instead of C1 ($29k, goodwill 4 of 4): C1 no longer fits as sent, fits once the extras go; still poor advice; Marit decides on the CISO’s recommendation, the extras named, and signs',
    sp.sEx.cost === 29 && sp.sEx.ok && sp.adv2.left.length === 1 && !sp.adv2.left[0].fitsNow && sp.adv2.poor && sp.adv2.extras.join() === 'Inkmere C3,Inkmere C8' &&
    sp.acc2.decidedBy === 'Marit Quellan, its owner, on the CISO’s recommendation (extras sought instead: Inkmere C3, Inkmere C8)' && sp.acc2.signedBy === 'Marit Quellan' && /fits once the extras go \(Inkmere C3, Inkmere C8\)/.test(sp.acc2.fit), { adv2: sp.adv2, acc2: sp.acc2 });
  check('the incident timeline: the Compact’s own times (21:14, 08:10, 08:40, 23:52, 16:40, 11:00), the hours lost (10 h 56 min, about 11 h 20 min, 7 h 30 min, 25 h 50 min, 49 h 50 min), Contract A’s column labelled (game), nothing about how Thimbleford was reached, no ATT&CK ID',
    ['21:14', '08:10', '08:40', '23:52', '16:40', '11:00', '10 h 56 min', 'about 11 h 20 min', '7 h 30 min', '25 h 50 min', '49 h 50 min', '(game)'].every(t => sp.tl.includes(t)) && !/\bT1\d{3}\b|phish|malware|exploit|ransom/i.test(sp.tl), sp.tl.slice(0, 400));
  check('the timeline, like with like (review 4, 5, 17): Contract A’s notice row credits C1 and C2 (the named contact, the on-call page, the detection time 15:05); the 21:14 notice was 6 h 9 min after detection, inside C1’s 24 hours; entries are compared with entries (C3, “for us to read”) and Thimbleford’s statement is not called its entries; the clauses named C1, C2 and C3; what Contract A does not change is the call itself',
    /<td>The notice<\/td><td>[^<]*<\/td><td>C1 and C2: the same notice to the named contact, the on-call page, at 21:14, with its detection time \(15:05\)<\/td>/.test(sp.tl) && /6 h 9 min after it detected the incident: inside C1’s 24 hours/.test(sp.tl) &&
    /<td>Entries covering 23:52<\/td><td>None; Thimbleford’s statement at 11:00 Thursday<\/td><td>C3: the entries, by 09:10 Wednesday, for us to read<\/td>/.test(sp.tl) && /Thimbleford’s entries: never given/.test(sp.tl) && !/An answer covering 23:52/.test(sp.tl) &&
    /Contract A’s clauses C1, C2 and C3 would have changed/.test(sp.tl) && /the call itself \(suspend, then export\), made about 21:20 by the on-call lead instead of 08:40 by Edda/.test(sp.tl), sp.tl.slice(0, 1500));
  const supAll = await A.page.evaluate(() => [...document.scripts].map(x => x.textContent).join('\n'));
  const ips = (supAll.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || []).filter(x => /^203\.0\.113\.77$/.test(x));
  check('Suppliers uses only a documentation address for the 23:52 login (203.0.113.77, RFC 5737), and names no ATT&CK technique', ips.length >= 1 && !/(T1\d{3})[^\d]/.test(supAll.slice(supAll.indexOf('CH_SUP_DRILLS'), supAll.indexOf('CH_SUP_LOST') + 2000)), ips.length);
  const sd = await A.page.evaluate(() => {
    const lab = l => l.map(o => typeof o === 'string' ? o : o.label);
    const clauseTxt = CH_CLAUSES.map(c => c.text + ' ' + c.without).join(' | ');
    const flows = CH_SUP_DRILLS.supdata.sources.find(x => x.id === 'flows').qs[0].res.join(' | ');
    const ink = chSupLine('inkmere'), why = CH_SUPPLIERS.map(s => s.id + ':' + s.crit + ':' + s.stops);
    return { clauseTxt, flows, ink, why, rule: CH_SUP_RULE, verdA: CH_SUP_DRILLS.supdata.verdicts.find(v => v.good), notes: GAME_NOTES.join(' | '),
      inc: CH_SUP_INCIDENT.map(x => x.resp.map(r => [r.label, !!r.good, r.why || ''])), dir: CH_SUP_DIRECTIVE.map(o => [o.label, !!o.good, o.why || '']),
      dojo: CH_SUP_DOJO.map(p => [p.opts, p.good]), board: CH_SUP_BOARD_SPECS().map(x => x.resp.map(r => [r.label, !!r.good, r.why || ''])),
      attest: CH_SUP_DRILLS.supattest, clock: JSON.stringify(CH_SUP_DRILLS.supclock.sources), c4: chClause('C4').text, interimC1: CH_CLAUSE_INTERIM.C1,
      reqC4: CH_SUP_DRILLS.supattest.sources.find(x => x.id === 'req').qs[0].res.join(' | '), wh: chSupLine('wellhollow').stops, names: [...document.scripts].map(x => x.textContent).join('\n') };
  });
  check('decision 1: the clause plan’s text (every clause and its “without it” line, shown on Wednesday at 14:00) holds no figure from after Wednesday 14:00 (no 49 h, 25 h 50, 16:40, 11:00 Thursday or the 15:05 detection time); C3’s line says only what was known (asked Tuesday 09:10; 17:30 “confidential”; nothing yet); the Field Manual’s game notes, readable from Monday, name no incident time or address',
    !/49 h|25 h 50|16:40|11:00 Thursday|15:05/.test(sd.clauseTxt) && /asked Tuesday 09:10; at 17:30 its logs were “confidential”, a summary to follow; nothing yet/.test(sd.clauseTxt) && !/23:52|203\.0\.113|15:05|49 h|Thimbleford’s incident/.test(sd.notes), { clause: sd.clauseTxt.slice(0, 900) });
  check('decision 2: the tiering rule and the data-flow record agree: the record shows names and postal addresses only (the town’s address file, the same letters for every household, the members post their own), no letter text or amount due; the rule’s Medium is “names and postal addresses only, with no way in”; Inkmere data Medium, criticality Low, Tier 2; the verdict needs the data-flow record and the account lists',
    /Fields: name, postal address\. The letters are the town’s standard mailings, the same for every household/.test(sd.flows) && /the members post their own letters/.test(sd.flows) && !/amount due|notice’s text|letter’s text|notice type/.test(sd.flows + ' ' + sd.ink.holds + ' ' + sd.ink.serves) &&
    sd.rule.data.Medium === 'holds names and postal addresses only, with no way in' && /beyond names and addresses/.test(sd.rule.data.High) && sd.ink.data === 'Medium' && sd.ink.crit === 'Low' && sd.ink.data === 'Medium' && JSON.stringify(sd.verdA.needs) === JSON.stringify(['flows', 'accounts']), { flows: sd.flows, ink: sd.ink, rule: sd.rule.data });
  check('review 11: the criticality words match the suppliers’ own lines: High “stops or falls back to paper” (Wrenfold’s downtime cart, Stillmark’s cards, Shelfwright’s manual checkout, now High), Medium a back-office service (pay, billing, office PCs); Wellhollow Low “until we need a restore”; every tier unchanged',
    sd.rule.crit.High === 'a life-safety service, or a member’s main service, stops or falls back to paper' && sd.rule.crit.Medium === 'a back-office service slows or goes to paper (pay, billing, office PCs)' &&
    sd.why.map(x => x.split(':').slice(0, 2).join(':')).join() === 'inkmere:Low,thimbleford:Medium,wrenfold:High,tarnfield:Medium,wellhollow:Low,stillmark:High,shelfwright:High,pewterlane:Low' &&
    /until we need a restore: then it is our only off-site copy/.test(sd.wh), sd.why);
  const incGood = sd.inc.map(l => l.find(r => r[1])[0]), dirGood = sd.dir.find(o => o[1])[0];
  check('decision 5 and review 14, 19: the 12:05 right answer is counsel, Noor for the Compact and each member’s for its own staff; the facts for counsel read “one failed login at 23:52, no successful one since Thursday 06:00”; the summary step’s right answer is trimmed; no option opens “Likely”',
    /^Counsel: Noor for the Compact, each member’s for its staff\. You bring the facts$/.test(incGood[4]) && /^One failed login at 23:52, no successful one since Thursday 06:00, cp-xfer off 08:40, pay files not known$/.test(incGood[3]) && !/none since Thursday/.test(JSON.stringify(sd.inc)) &&
    /^Not yet: its review stops at 18:00, before 23:52\. Ask for one to the present$/.test(incGood[5]) && ![].concat(...sd.inc, sd.dir, ...sd.board).some(r => /^Likely/.test(r[0])) && /^An attack on us as well/.test(sd.inc[3][1][0]), incGood);
  check('review 9: the directive’s right answer opens “Not as it stands” with an “I”, two wrong options open “Don’t sign” (one: walk away unless the clause is free, Marit’s call) and two “Sign it”',
    /^Not as it stands: I’ll put C1 in the plan, and Marit chooses: price it, sign, or walk away$/.test(dirGood) && sd.dir.filter(o => !o[1] && /^Don’t sign/.test(o[0])).length === 2 && sd.dir.filter(o => !o[1] && /^Sign it/.test(o[0])).length === 2 &&
    sd.dir.some(o => !o[1] && /^Don’t sign: tell Inkmere the Compact walks away unless the clause is free$/.test(o[0]) && /Walking away is Marit’s call/.test(o[2])), sd.dir);
  check('review 10 and 19: Round 2’s money distractor is wrong because claims are Noor’s question and the Board asked about time (no claim about the contract’s clauses); the attestation drill has a two-reason wrong verdict; the notice-clock terminal has a right-verdict, wrong-reason option',
    sd.board[1].some(r => /^Only money/.test(r[0]) && r[2] === 'Whether anything can be claimed is Noor’s question. What the Board asked is what it cost us: the time.') && !/no such clause/.test(JSON.stringify(sd.board)) &&
    sd.attest.verdicts.some(v => !v.good && /^Enough: a clean opinion, and the assessors who gave it are independent$/.test(v.label)) && sd.dojo[2][0].length === 4 && sd.dojo[2][0].some((o, j) => j !== sd.dojo[2][1] && /^Not met: it reached the general inbox first/.test(o)), null);
  check('review 15, 23, 26: C4 measures the period (“covering a period that ended within the last 12 months”), not “older”; Tarnfield’s times record its sent time (18:29) and the airport’s own record of its admin account (suspended 18:50, back Day 58 once the review covered its last sign-in); the C1 interim reads the mailbox the supplier writes to; Wellhollow asked what has changed since the period ended',
    /covering a period that ended within the last 12 months/.test(sd.c4) && !/older than/i.test(sd.c4 + sd.reqC4) && /Its period ended within the last 12 months/.test(sd.reqC4) && /Sent: Day 55 18:29 \(the notice’s header\)/.test(sd.clock) && /Day 55 18:50: Dario suspended Tarnfield’s admin account/.test(sd.clock) && /Day 58 \(Tuesday\)/.test(sd.clock) &&
    /reads the mailbox the supplier writes to/.test(sd.interimC1) && sd.attest.response.some(x => /what has changed/.test(x)), null);
  check('decision 4: the AV supplier is Pewterlane AV and the payroll provider Thimbleford Payroll; no “Glasswick” or “Cobbleton” anywhere in the built Charter page’s scripts',
    !/Glasswick|glasswick|Cobbleton|cobbleton/.test(sd.names) && /Pewterlane AV/.test(sd.names) && /Thimbleford Payroll/.test(sd.names), null);
  // Every say() from here on is logged, to check what is said, by whom, and in which order.
  await A.page.evaluate(() => { window.__sayLog = []; const os = UI.say.bind(UI); UI.say = (t, w) => { window.__sayLog.push((w || '') + '|' + t); return os(t, w); }; });
  const sayLog = () => A.page.evaluate(() => window.__sayLog.slice());

  // Monday: the week opens, drill A read from one decisive source only (unsupported).
  await A.follow(p => p.f.chSupStart, []);
  const dS = await A.page.evaluate(() => ({ day: G.day, wd: CH_DAY[G.day], m: metricVals(), sc: editionScorecard() }));
  check('Suppliers opens on Day 71, a Monday; the supplier metrics show “—” until the tiers and the plan are sent; the scorecard names the Hawser Badge as not yet',
    dS.day === 71 && dS.wd === 'Monday' && (71 - 1) % 7 === 0 && dS.m.chSupTier === null && dS.m.chSupCrit === null && dS.m.chSupMust === null && /Suppliers tiered by the rule \(your advice\)/.test(dS.sc) && !/Suppliers tiered, with owner and review date/.test(dS.sc) && /Must-haves in your plan \(your advice\)/.test(dS.sc) && /Owners and review dates came with every line \(the Ballast Badge\)/.test(dS.sc) && /Hawser Badge: not yet/.test(dS.sc), dS);
  await A.goTo('choffice', 12, 2);
  await A.settle([], /Investigation drill · Inkmere and residents’ data/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/^Query: The data-flow record/);
  await A.pickLabel(/^What goes to Inkmere/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/I have enough: decide/);
  await A.settle([]);
  const sA = await A.page.evaluate(() => ({ d: G.ch.sup.drills.supdata, needs: G.ch.sup.needs }));
  check('supplier drill A (Inkmere and residents’ data): the right verdict read from the data-flow record alone is unsupported (needs: the data-flow record and the account lists)', sA.d.verdictOk && !sA.d.supported && sA.needs.met === 0 && sA.needs.total === 1, sA);

  // The tiers: Inkmere put in Tier 3 on purpose, then sent; scored on the advice, corrected on the register.
  await A.goTo('choffice', 27, 1);
  await A.settle([], /The supplier register · tiers/);
  await A.page.evaluate(() => { const t = G.ch.sup.tiers; for (const s of CH_SUPPLIERS) t[s.id] = chTierRule(s); t.inkmere = 2; });
  await A.page.evaluate(() => UI.closeModal({lr: true, d: 1, i: 0})); await sleep(120);
  await A.pickLabel(/^Put the tiers on the register$/);
  await A.settle([], /The tiers you put on the register/);
  const tierTxt = await A.modalText();
  await A.settle([]);
  const sT = await A.page.evaluate(() => ({ sent: G.ch.sup.sent, m: metricVals(), reg: chSupRegisterHtml() }));
  check('the tiers as sent (Inkmere in Tier 3, the rest by the rule): the metric reads the advice, 88%; the debrief gives the rule’s Tier 2 and why; the register then shows the rule’s tiers',
    sT.sent.inkmere === 3 && sT.m.chSupTier === 88 && /Inkmere: Tier 2\. If it stops: Low/.test(tierTxt) && /<td>Inkmere<\/td><td>2<\/td>/.test(sT.reg), { sent: sT.sent, m: sT.m.chSupTier, txt: tierTxt.slice(0, 600) });

  // Tuesday: Thimbleford's notice, with a wrong first step at cp-xfer (export the log first).
  await A.follow(p => p.f.chSupDay71, []);
  const inc = await A.follow(p => p.f.chSupIncident, [], /cp-xfer · 08:35/);
  const wrongInc = inc.ui.options.findIndex(o => /^Export its log first/.test(o.label));
  await A.pickLabel(new RegExp('^' + esc(inc.ui.options[wrongInc].label) + '$'));
  await A.follow(p => p.f.chSupIncident, []);
  const sI = await A.page.evaluate(() => ({ first: G.ch.sup.incident.first, f: G.f, fm: G.fm }));
  check('Thimbleford’s incident: six steps planned, the five Tuesday ones answered, the wrong first step at cp-xfer recorded (export first), the rest right first time; the Field Manual entry unlocked',
    JSON.stringify(sI.first) === JSON.stringify([true, false, true, true, true]) && sI.f.chSupIncident && sI.fm['act:chvendorir'], sI.first);

  // Wednesday: drill C, the directive (a wrong first pick), the plan without Inkmere's C1.
  await A.follow(p => p.f.chSupDrillC, []);
  const dirS = await A.follow(p => p.f.chSupDirective, [], /Inkmere’s renewal: what do you tell Ilka/);
  await A.pickLabel(/^Sign it as it stands/);
  await A.follow(p => p.f.chSupDirective, []);
  await A.follow(p => false, [], /Clause plan · the Compact’s contracts/);
  await A.page.evaluate(() => { const p = chPlanInit(); for (const k of CH_SUP_CONTRACTS) p[k.id] = chPlanRec(k.id); p.inkmere = p.inkmere.filter(c => c !== 'C1'); });
  const planBody = await A.modalText();
  await A.pickLabel(/^Thimbleford Payroll/); await A.settle([], /^Clauses · Thimbleford/);
  const clauseModal = await A.page.evaluate(() => document.getElementById('mbody').textContent + ' | ' + UI.modal.items.map(o => o.label + ' ' + (o.note || '')).join(' | '));
  await A.pickLabel(/^Back to the contracts/);
  await A.settle([], /Clause plan · the Compact’s contracts/);
  await A.pickLabel(/^Send it to Ilka and Noor/);
  await A.settle([], /Send the plan\?/);
  const sendTxt = await A.modalText();
  await A.pickLabel(/^Send it$/);
  await A.follow(p => p.f.chSupPlan, []);
  const sP = await A.page.evaluate(() => ({ d: G.ch.sup.directive, plan: G.ch.sup.planSent, acc: G.ch.sup.accept, adv: G.ch.sup.planAdvice, m: metricVals(), sc: editionScorecard() }));
  const sayP = await sayLog();
  check('decision 1, played: the clause plan on Wednesday 14:00 (Thimbleford’s clauses with their notes, the plan page) shows no figure from after it (49 h, 25 h 50, 16:40, 11:00 Thursday, 15:05); the envelope set by Marit from the services’ budgets',
    !/49 h|25 h 50|16:40|11:00 Thursday|15:05/.test(clauseModal + planBody) && /C3 Logs and access to them/.test(clauseModal) && /nothing yet/.test(clauseModal) && /set by Marit from the services’ budgets/.test(planBody), clauseModal.slice(0, 900));
  check('directive and plan (decision 3, played): the wrong first pick (sign it as it stands) recorded; the plan sent without Inkmere’s C1 ($24k); the send confirmation says it fits ($6k left, goodwill 2 left) and that the scorecard reads it as poor advice; the acceptance is the CISO’s recommendation, Marit decides on it and signs (one decider); Marit says the money covered it; critical and notification stay 100%, must-haves 95%, the scorecard says poor advice',
    !!dirS && sP.d.first === false && !sP.plan.inkmere.includes('C1') && sP.acc.length === 1 && sP.acc[0].line === 'Inkmere C1' && sP.acc[0].signedBy === 'Marit Quellan' && sP.acc[0].decider === 'Marit' && sP.acc[0].recommendedBy === 'the CISO (your plan)' && /on the CISO’s recommendation$/.test(sP.acc[0].decidedBy) && sP.acc[0].poor &&
    /Must-haves left out, on your recommendation, each needing its owner’s decision and signed acceptance: Inkmere C1\./.test(sendTxt) && /Inkmere C1 fits: \$6k of the envelope left, goodwill 2 left\. Its owner would be signing for a gap the money covers: the scorecard reads that as poor advice \(game\)\./.test(sendTxt) &&
    sayP.some(x => /^Marit Quellan\|You recommend leaving out Inkmere C1, though the money covered it\. My decision, on your recommendation: I sign for it as its owner/.test(x)) && sP.adv.poor &&
    sP.m.chSupCrit === 100 && sP.m.chSupNotify === 100 && sP.m.chSupMust === 95 && /poor advice: a plan with every must-have fitted/.test(sP.sc), { m: sP.m, adv: sP.adv, sc: /poor advice: a plan/.test(sP.sc), sendTxt: sendTxt.slice(0, 500), marit: sayP.filter(x => /^Marit/.test(x)).slice(-2) });
  check('review 8 (played): Ilka signs renewals under the Board’s delegated authority, and Inkmere holds today’s price until Friday as it stands (no “today only”); Marit names the three-month extension and what walking away would mean, as her call',
    sayP.some(x => /^Ilka Thrushcombe\|.*I sign renewals under the authority the Board delegated \(game\)/.test(x)) && sayP.some(x => /^Ilka Thrushcombe\|Inkmere renews at today’s price if we sign by Friday as it stands/.test(x)) && !sayP.some(x => /only if we sign today/.test(x)) &&
    sayP.some(x => /three-month extension on today’s terms/.test(x) && /Walking away means the town prints and posts its own mailings next month: my call/.test(x)), sayP.filter(x => /Ilka|Marit/.test(x)).slice(-6));

  // Wednesday 16:50 and Thursday: cp-xfer held until the answer covers 23:52, the timeline, the Supplier round.
  await A.follow(p => p.f.chSupReturn, []);
  await A.follow(p => p.f.chSupThu, [], /The Compact’s timeline, beside Contract A/);
  const tlTxt = await A.modalText();
  const sayT = await sayLog(), at = re => sayT.findIndex(x => re.test(x));
  const xfer = await A.page.evaluate(() => ({ acc: G.ch.accept.find(x => x.line === 'CP-XFER'), tol: chTol('privacy') }));
  const iEdge = at(/^Edda Thornquist\|08:40: I’ve suspended cp-xfer.*09:00: 203\.0\.113\.77 blocked at our edge, and ninety days of edge logs searched for it: the 23:52 attempt only/), iCheck = at(/^Edda Thornquist\|11:45\. Our side too, before anything comes back: CP-XFER-01’s log since the 08:50 export, no attempt on cp-xfer since 23:52 Monday; our edge, nothing from 203\.0\.113\.77 since it was blocked/);
  const iMeasure = at(/^\|11:50: you measure the return Edda proposes against Monday’s privacy tolerance\..*above the tolerance/), iSign = at(/^Marit Quellan\|Payroll is mine, so that risk is mine to carry\. I agree the conditions, and I sign for it/), iReturn = at(/^Edda Thornquist\|12:00: cp-xfer is back/);
  check('decision 6 and review 13, 24 (played): before any return the Compact checks its own evidence (Tuesday 09:00: 203.0.113.77 searched across ninety days of edge logs; Thursday 11:45: CP-XFER-01’s log since the 08:50 export and the edge since the block); then the return is measured against Monday’s privacy tolerance (above it: no MFA for a machine account), Marit, payroll’s owner, agrees the conditions and signs, and only then Edda returns it: key-only, from its documented range, each sign-in logged, 203.0.113.77 still blocked',
    iEdge >= 0 && iCheck > iEdge && iMeasure > iCheck && iSign > iMeasure && iReturn > iSign && /Key sign-in only, no password/.test(sayT[iReturn]) && /Sign-ins only from its documented range, each one logged; 203\.0\.113\.77 stays blocked/.test(sayT[iReturn]) &&
    !!xfer.acc && xfer.acc.signedBy === 'Marit Quellan' && xfer.acc.decider === 'Marit' && xfer.acc.day === 74 && xfer.acc.breaks.join() === xfer.tol && /no system holding personal records reachable from outside without MFA/.test(xfer.tol) && xfer.acc.appetite === 'Low' && /every session logged/.test(xfer.acc.interim) && /documented range/.test(xfer.acc.interim),
    { iEdge, iCheck, iMeasure, iSign, iReturn, xfer, tail: sayT.slice(-12) });
  check('decision 5 (played): Noor decides for the Compact and each member’s counsel for its own staff, at 09:15 (she sends them the same facts), 12:30 and 11:30 Thursday',
    at(/^Noor Castellanos\|09:15\..*Whether anyone must be told is mine for the Compact, and each member’s counsel’s for its own staff\. I’ll send them the same facts\./) >= 0 && at(/^Noor Castellanos\|12:30\. My decision for the Compact, and each member’s counsel has said the same for its staff: no notice yet/) >= 0 &&
    at(/^Noor Castellanos\|11:30\. My decision for the Compact, and each member’s counsel has agreed for its staff: Marit tells the members’ staff today/) >= 0 && at(/My decision, as counsel/) < 0, sayT.filter(x => /^Noor/.test(x)));

  const fmS = await A.page.evaluate(() => G.focusMax);
  await A.follow(p => p.f.chSupBoard, []);
  const sB = await A.page.evaluate(() => ({ first: G.ch.sup.incident.first, b: G.ch.sup.board, f: G.f, fm: G.focusMax, badges: EDITION.badgeFlags, sc: editionScorecard(), day: G.day }));
  check('Wednesday 16:50 (cp-xfer stays off until the answer covers 23:52) right first time; the timeline modal with both columns; the Supplier round (three rounds), the Hawser Badge, Focus +4; Thursday; the scorecard on the advice (tiers 88%, critical 100%, notification 100%) with the members’ contracts on their own line',
    sB.first[5] === true && /As it was/.test(tlTxt) && /Contract A/.test(tlTxt) && /10 h 56 min/.test(tlTxt) && sB.b.first.length === 3 && sB.f.chHawser && sB.badges.includes('chHawser') && sB.fm === fmS + 4 && sB.day === 74 &&
    /The members’ own contracts are their owners’ decisions: <b>0 of 4<\/b>/.test(sB.sc) && /Hawser Badge: yes/.test(sB.sc), { b: sB.b, fm: [fmS, sB.fm], sc: sB.sc.slice(0, 1200) });
  const sayB = await sayLog();
  check('review 4 (played): with C1, C2 and C3 all in the plan, Marit says Contract A’s clauses C1, C2 and C3 go into Thimbleford’s amendment',
    sayB.some(x => /^Marit Quellan\|Contract A’s clauses C1, C2 and C3 go into Thimbleford’s amendment/.test(x)), sayB.filter(x => /^Marit/.test(x)).slice(-3));
  check('review 22 (played): the Hawser Badge’s power names the account manager where a contract names no security contact yet; the Board’s minute names the acceptances signed on the CISO’s recommendation and cp-xfer’s, measured against the privacy tolerance',
    sayB.some(x => /every Tier 1 supplier’s security contact, or its account manager where its contract names none yet, is on the incident page/.test(x)) && sayB.some(x => /each acceptance its owner signed on your recommendation, and cp-xfer’s, measured against Monday’s privacy tolerance/.test(x)), sayB.slice(-6));
  const regView = await A.page.evaluate(async () => { run(() => chSupRegisterView()); await new Promise(z => setTimeout(z, 250)); return document.getElementById('mbody').textContent; });
  await A.settle([]);
  check('review 21: the supplier register view opens with “Spend, tiers and dates: game data.”', /^Spend, tiers and dates: game data\./.test(regView.trim()), regView.slice(0, 200));
  await A.follow(() => false, [], /End of Suppliers/);
  const supSum = await A.modalText();
  const sS = await A.page.evaluate(() => ({ obj: objective(), ser: Series.load().editions.charter, m: metricVals(), keep: { th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save') } }));
  check('the Suppliers summary: “Next: Policy”, the drills, the acceptance Marit signed, the members’ contracts as their owners’ decisions, the lesson, the scorecard; the series records Suppliers; the objective done; the earlier saves byte-for-byte as seeded',
    /Next: Policy/.test(supSum) && /Tarnfield’s notice clock/.test(supSum) && /Must-haves left out: your recommendation, their owners’ decisions/.test(supSum) && /Decided by Marit Quellan, its owner, on the CISO’s recommendation; signed by Marit Quellan/.test(supSum) && /poor advice \(game\)/.test(supSum) && /their owners’ decisions/.test(supSum) && /the clock starts where the contract says/.test(supSum) &&
    /the evidence, theirs and your own, covers the latest activity/.test(supSum) && /Measure a returned way in against the tolerances/.test(supSum) &&
    sS.ser.suppliers === true && sS.obj.done && /^Suppliers done\. Next: Policy\.$/.test(sS.obj.text) && sS.m.chSupTier === 88 && sS.keep.th === TH_SAVE && sS.keep.cr === CR_SAVE && sS.keep.ng === NG_SAVE, { obj: sS.obj, ser: sS.ser, sum: supSum.slice(0, 1200) });
  await A.settle([/^Keep exploring/]);

  // A Crossroads save code is refused by Charter's import; Charter's own still loads.
  const imp = await A.page.evaluate(async c => {
    try { sameEdition(decodeSave(c)); return 'accepted'; } catch (e) { return e.message; }
  }, CR_SAVE);
  check('a Crossroads save code is refused by Charter (“from another Uptime edition”)', /another Uptime edition/.test(imp), imp);

  // The Field Manual: the CSF and NICE facts, the game notes.
  const fmT = await A.page.evaluate(() => fmHtml());
  check('Field Manual (Suppliers): GV.SC-04, -05, -06, -07, -08 and -10 quoted with NIST’s examples, the supplier practices, and the game notes for the suppliers and Thimbleford’s incident',
    /GV\.SC-04: “Suppliers are known and prioritized by criticality”/.test(fmT) && /GV\.SC-10/.test(fmT) && /A supplier’s incident, from your side/.test(fmT) && /The clock starts where the contract says/.test(fmT) && /Any supplier incident in Suppliers is told only through the Compact’s records/.test(fmT) && /check your own logs and edge too/.test(fmT) && /Leaving one out when the money covers it is poor advice/.test(fmT), null);
  check('Field Manual: GV.RM-02 and GV.RR-03 quoted, the NICE tasks, “CISO” a job title (a job may cover one or more work roles, or part of one), the game notes labelled (game); Charter’s practices under “Leadership practices (game)”, not D3FEND, and no ATT&CK claim in its intro',
    /GV\.RM-02/.test(fmT) && /GV\.RR-03/.test(fmT) && /T1059/.test(fmT) && /OG-WRL-007/.test(fmT) && /\(game\)/.test(fmT) && /a job may cover one or more work roles, or part of one/.test(fmT) && !/seniority/.test(fmT) && /<h3>Leadership practices \(game\)<\/h3>/.test(fmT) && !/D3FEND/.test(fmT) && !/IDs are from MITRE/.test(fmT) && /open in later districts/.test(fmT), null);

  check('full run: no console errors or network requests', !A.errors.length && !A.requests.length, { e: A.errors, r: A.requests });
  await browser.close();
  const out = { suite: 'charter', seconds: Math.round((Date.now() - t0) / 1000), passed: Object.values(results).filter(v => v === 'ok').length, failed: Object.values(results).filter(v => v !== 'ok').length, results };
  console.log(JSON.stringify(out, null, 1));
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CHARTER FAILED:', e.stack || e.message); process.exit(2); });
