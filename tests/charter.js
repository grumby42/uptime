// Charter (edition 3, the CISO) checks: the prologue and Budget, with real keyboard input.
// Covers: the series menu lists Town Hall, Crossroads, Charter, then "Next edition: coming later"; the carry-over with no
// earlier save (fresh defaults), with only a Town Hall save, with a Crossroads save, with only a Crossroads New Game+ save,
// and with all three (name, tracks played, badges as history, the Quiet Thread notes, the Focus it adds), a damaged save
// ignored; the Town Hall, Crossroads and Crossroads New Game+ saves byte-for-byte unchanged by any of it; the remit (four
// "who decides" questions), the risk-appetite statement (a wrong pick retried, first tries recorded, the Board's levels),
// the register's owners and review dates (the scorecard's owner metric from 0% to 100%); Day 65 a Tuesday; drill A read
// with one decisive source only is unsupported (`needs`), drills B and C supported; save/reload mid-Budget and the export
// round trip; the allocation primitive (residual per line against the appetite, the budget cap, the Send button disabled
// over budget, lines above appetite naming their owner), the Board's override rule (the upgrade in full; R2 and R3
// deferred; R4 then R1 trimmed; R5 never cut; no override when the upgrade is already funded), the acceptances (signed by
// each line's owner, never the CISO, with an expiry and a review date); the directive (Joanna signs her own acceptance;
// a wrong pick first); the Risk & Budget terminals (Focus +2); the Board's three rounds, the Plumb Badge (Focus +4); the
// scorecard (risks within appetite, owners and review dates, top-five share); the summary ("Next: Suppliers") and the
// series record; a Crossroads save code refused by Charter's import; zero console errors and network requests.
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
const NG_SAVE = code({ v: 1, edition: 'crossroads', seed: 5, name: 'Lead', trackId: 'dfir', ngPlus: true, rank: 'Principal DFIR consultant', f: { lbBookmark: true }, qt: { stage: 1, cluesFound: ['cn-folders'], evicted: false } });
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
  check('carry-over, a Crossroads New Game+ save only: the DFIR track, the Bookmark Badge, its note, Focus 52; the save byte-for-byte unchanged',
    JSON.stringify(c2.r.carry.tracks) === JSON.stringify(['dfir']) && JSON.stringify(c2.r.carry.crBadges) === JSON.stringify(['Bookmark']) && c2.r.carry.crClues === 1 && c2.r.focusMax === 52 && c2.unchanged && c2.r.ng !== null && !c2.r.carry.crDone, c2.r);
  const c3 = await carry({ 'uptime.slice1.save': 'UPT1.garbage.0', 'uptime.crossroads.save': 'not a save' }, 'damaged');
  check('carry-over, damaged saves: ignored (fresh defaults), left as they were, no error', c3.r.carry.th === 'none' && c3.r.carry.cr === 'none' && c3.r.name === 'Lead' && c3.unchanged && c3.r.th === 'UPT1.garbage.0' && !c3.errors.length, c3.r);
  for (const c of [c0, c1, c2, c3]) check('carry-over (' + c.label + '): no console errors or network requests', !c.errors.length && !c.requests.length, { e: c.errors, r: c.requests });

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
  const p1 = await A.page.evaluate(() => ({ remit: G.ch.remit, ap: G.ch.appetite, f: G.f, fm: G.fm, within: [chWithin('avail', 'Medium'), chWithin('privacy', 'Medium'), chWithin('safety', 'Low'), chWithin('fin', 'Medium')], m: metricVals() }));
  check('remit: four “who decides” questions, right first time, the remit and NICE facts unlocked', p1.remit.first.length === 4 && p1.remit.first.every(Boolean) && p1.fm['act:chremit'] && p1.fm['fact:chnice'], p1.remit);
  check('appetite: a wrong first pick is retried and recorded; the Board’s levels (availability Moderate, privacy Low, safety Low, financial Moderate) with measurable tolerances; within-appetite tests follow them',
    p1.ap.first[0] === false && p1.ap.first.slice(1).every(Boolean) && JSON.stringify(p1.ap.levels) === JSON.stringify({ avail: 'Moderate', privacy: 'Low', safety: 'Low', fin: 'Moderate' }) && /24 hours/.test(p1.ap.tol.avail) && /\$25k/.test(p1.ap.tol.fin) && JSON.stringify(p1.within) === JSON.stringify([true, false, true, true]) && p1.fm['fact:chcsf'], p1.ap);
  await A.follow(p => p.f.chBudgetBrief, []);
  const own0 = (await A.peek()).metrics.chOwned;
  await A.follow(p => p.f.chRegister, []);
  const p2 = await A.page.evaluate(() => ({ reg: G.ch.register, m: metricVals(), pal: tileDef('choffice', 2, 1).pal }));
  check('register: three named owners (Edda, Oriel, Celia) for the department lines, Day 155 reviews; the owner-and-review metric goes 0% → 100%; the wall ticks',
    own0 === 0 && p2.m.chOwned === 100 && p2.reg.owners.R2 === 'Edda Thornquist' && p2.reg.owners.R4 === 'Oriel Fanshawe' && p2.reg.owners.R5 === 'Celia Marrow' && Object.values(p2.reg.review).every(d => d === 155) && p2.pal === 'chRegOk', { own0, p2 });
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
    const dRec = chBoardDecide(rec), dUp = chBoardDecide(Object.assign({}, rec, {R6: 2, R2: 0, R3: 0, R4: 0}));
    const noR5 = chBoardDecide(Object.assign({}, rec, {R1: 2, R2: 2, R3: 2, R4: 1}));
    const acc = chAboveAppetite(dRec.final).map(l => chAcceptance(l, dRec.final, 'the Board', 67));
    const r5off = chAboveAppetite(Object.assign({}, rec, {R5: 0})).map(l => l.id + ':' + l.owner);
    return { sRec, sZero: {total: sZero.total, within: sZero.within, above: sZero.above.map(l => l.id)}, sMax: sMax.total, dRec, dUp, noR5: noR5.final.R5, acc, r5off, budget: CH_BUDGET, qa: chWithin('privacy', CH_LINES[0].opts[1].res) };
  });
  check('allocation: the recommended allocation is $480k, every line within appetite, 96% on the top five; with nothing funded only R4 is within; everything at once is over budget; Quote A leaves R1 above appetite',
    prim.sRec.total === 480 && prim.sRec.within === 6 && prim.sRec.topPct === 96 && prim.sZero.total === 0 && prim.sZero.within === 1 && JSON.stringify(prim.sZero.above) === JSON.stringify(['R1', 'R2', 'R3', 'R5', 'R6']) && prim.sMax > prim.budget && prim.qa === false, prim);
  check('the Board’s override rule: the upgrade in full, R2 and R3 deferred, then R4 trimmed to fit $480k; no override when the upgrade is already funded; R5 never cut',
    prim.dRec.override && prim.dRec.final.R6 === 2 && prim.dRec.final.R2 === 0 && prim.dRec.final.R3 === 0 && prim.dRec.final.R4 === 0 && prim.dRec.final.R1 === 2 && prim.dRec.final.R5 === 1 && JSON.stringify(prim.dRec.cut) === JSON.stringify(['R2', 'R3', 'R4']) && !prim.dUp.override && prim.noR5 === 1, prim.dRec);
  check('acceptances: each line left above appetite is signed by its owner (Edda for R2 and R3; Celia for R5 if it were unfunded), never the CISO, with expiry Day 428 and review Day 155',
    prim.acc.length === 2 && prim.acc.every(a => a.signedBy === a.owner && a.signedBy === 'Edda Thornquist' && a.expiry === 428 && a.review === 155) && JSON.stringify(prim.r5off) === JSON.stringify(['R5:Celia Marrow']), { acc: prim.acc, r5off: prim.r5off });

  // Play the allocation: first push R6 to the upgrade and R5 off (over budget? no: check the Send button), then the bot's path.
  await A.goTo('choffice', 26, 9);
  await A.settle([], /Budget · next year/);
  const al0 = await A.page.evaluate(() => ({ items: UI.modal.items.map(o => ({ label: o.label, dis: !!o.disabled, k: o.meta && o.meta.k })), body: document.getElementById('mbody').textContent }));
  check('the allocation page: six lines, each with its cost and residual, “above appetite” where it is, owners named for the lines needing an acceptance; Send enabled at $0',
    al0.items.filter(i => /^R\d/.test(i.label)).length === 6 && /R1 Vendor support by hand: \$0, Medium, above appetite/.test(al0.items[0].label) && /R4 Payment fraud by email: \$0, Medium$/.test(al0.items[3].label) && /\(Edda Thornquist\)/.test(al0.body) && /\(Celia Marrow\)/.test(al0.body) && !al0.items.find(i => i.k === 'send').dis, al0);
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
  check('the allocation sent (the recommended one): every line within appetite (100%), 96% of it on the top five; Wednesday’s papers', JSON.stringify(pAl.sent) === JSON.stringify({ R1: 2, R2: 1, R3: 2, R4: 1, R5: 1, R6: 1 }) && pAl.m.chWithin === 100 && pAl.m.chTop5 === 96 && pAl.f.chAlloc, pAl);

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

  // The Board's budget round.
  const fm1 = await A.page.evaluate(() => G.focusMax);
  await A.follow(p => p.f.chBoard, []);
  const pBo = await A.page.evaluate(() => ({ b: G.ch.board, dec: G.ch.decision, fin: G.ch.final, acc: G.ch.accept, f: G.f, fm: G.focusMax, m: metricVals(), badges: EDITION.badgeFlags, day: G.day }));
  check('the Board: three rounds right first time; the override (upgrade in full; R2, R3 and R4 deferred); two acceptances signed by Edda, the owner; Joanna’s before it too; the Plumb Badge, Focus +4; Thursday',
    pBo.b.first.length === 3 && pBo.b.first.every(Boolean) && pBo.dec.override && JSON.stringify(pBo.dec.cut) === JSON.stringify(['R2', 'R3', 'R4']) && pBo.fin.R6 === 2 && pBo.acc.length === 3 && pBo.acc.filter(a => a.day === 67).every(a => a.signedBy === 'Edda Thornquist') && pBo.f.chPlumb && pBo.badges.includes('chPlumb') && pBo.fm === fm1 + 4 && pBo.day === 67, pBo);
  check('scorecard after the Board: risks within appetite 67% (4 of 6), owners and review dates 100%, top five 100%', pBo.m.chWithin === 67 && pBo.m.chOwned === 100 && pBo.m.chTop5 === 100, pBo.m);
  await A.follow(() => false, [], /End of Budget/);
  const sum = await A.modalText();
  const pS = await A.page.evaluate(() => ({ obj: objective(), ser: Series.load().editions.charter, f: G.f, keep: { th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save') } }));
  check('the summary: “Next: Suppliers”, the drills, the Board’s decision, the acceptances signed by their owners, the scorecard, the thread still open; the series records Budget; the objective done',
    /Next: Suppliers/.test(sum) && /Two quotes for R1/.test(sum) && /overrode your allocation/.test(sum) && /Signed by Edda Thornquist, its owner/.test(sum) && /Signed by Joanna Ferreday, its owner/.test(sum) && /Risks within appetite/.test(sum) && /still open/.test(sum) && pS.ser.budget === true && pS.obj.done && pS.f.chSummary, { ser: pS.ser, obj: pS.obj });
  check('the Town Hall, Crossroads and Crossroads New Game+ saves are byte-for-byte as seeded after the whole run', pS.keep.th === TH_SAVE && pS.keep.cr === CR_SAVE && pS.keep.ng === NG_SAVE, null);
  await A.settle([/^Keep exploring/]);

  // A Crossroads save code is refused by Charter's import; Charter's own still loads.
  const imp = await A.page.evaluate(async c => {
    try { sameEdition(decodeSave(c)); return 'accepted'; } catch (e) { return e.message; }
  }, CR_SAVE);
  check('a Crossroads save code is refused by Charter (“from another Uptime edition”)', /another Uptime edition/.test(imp), imp);

  // The Field Manual: the CSF and NICE facts, the game notes.
  const fmT = await A.page.evaluate(() => fmHtml());
  check('Field Manual: GV.RM-02 and GV.RR-03 quoted, the NICE tasks, the game notes labelled (game)', /GV\.RM-02/.test(fmT) && /GV\.RR-03/.test(fmT) && /T1059/.test(fmT) && /OG-WRL-007/.test(fmT) && /\(game\)/.test(fmT), null);

  check('full run: no console errors or network requests', !A.errors.length && !A.requests.length, { e: A.errors, r: A.requests });
  await browser.close();
  const out = { suite: 'charter', seconds: Math.round((Date.now() - t0) / 1000), passed: Object.values(results).filter(v => v === 'ok').length, failed: Object.values(results).filter(v => v !== 'ok').length, results };
  console.log(JSON.stringify(out, null, 1));
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CHARTER FAILED:', e.stack || e.message); process.exit(2); });
