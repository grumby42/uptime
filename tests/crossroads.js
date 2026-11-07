// Crossroads (edition 2) checks: the prologue and the Public Library, both tracks, with real keyboard input.
// Covers: the series menu lists Crossroads between Town Hall and "coming later"; carry-over without a Town Hall save
// (fresh defaults) and with one (rank, badges as history, the Charter Badge's Focus, the suspicion file), the Town Hall
// save byte-for-byte unchanged afterwards; the name plate; the rota primitive (Magda's five nights: tired nights 3-5, a
// forecast in Evidence and Focus, then Focus -10 on the morning after a tired night and a thin first look at the boss);
// analyst growth; the two offers with the two-step confirmation (Go back works, Take it locks); the lock in the edition and
// series saves; save/reload mid-Library and the export round trip; the arrival problems fixed on the map; manager drills
// (`needs`), tabletop, retainer, AAR, cover, directive, Board (Bookmark Badge), boss and the firm's status report with the
// Quiet Thread clue (T1021.001, not in the alert mix, thread not evicted); the DFIR track's letter, custody log (a missing
// collection hash recorded as a gap), separate client stores, a two-source `needs` verdict read from one source is
// unsupported, the report primitive (an overclaim is corrected and counted), the boss and the end summary ("Next: School
// District"); a fresh save on the locked browser shows the other track locked, and New Game+ (test hook) opens it; a Town
// Hall save code is refused by Crossroads' import; zero console errors and network requests.
// Usage: node tests/crossroads.js   (UPTIME_FILE=file:///.../crossroads/index.html to test another build)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/crossroads/index.html');
const TH_FILE = 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const MENU = path.resolve(__dirname, '../index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const results = {}; let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info).slice(0, 600) : ''); if (!ok) failed = true; }

async function session(ctx, file) {
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  await page.goto(file || FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(31); __UPTIME.turbo(true); });
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
  // Answer everything with the good option (or a preferred label), until the UI is gone, or a modal/choice matches stop.
  async function settle(prefs, stop) {
    for (let i = 0; i < 5000; i++) {
      await sleep(12);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return null; continue; }
      if (stop) { const t = p.ui.type === 'modal' ? await page.textContent('#modal') : p.ui.type === 'choice' ? p.ui.text : p.ui.text || ''; if (stop.test(t)) return p; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal' && p.ui.multi) {
        const todo = p.ui.options.findIndex((o, j) => o.meta && o.meta.good && !p.ui.sel.includes(j));
        const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
        let guard = 0; while ((await peek()).ui.cursor !== idx && guard++ < 30) await press('down');
        await press('a'); await sleep(20); continue;
      }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      if (re) { await pickLabel(re); continue; }
      let g = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
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
  async function goTo(map, x, y, onTile) {
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
      const pth = bfs(p, x, y, !!onTile);
      if (pth.length) { if (await stepOnce(pth[0]) === 'ui') return 'ui'; continue; }
      if (onTile) { await press(p.dir); return; }
      const d = Object.entries(DIR).find(([, [ddx, ddy]]) => p.x + ddx === x && p.y + ddy === y)[0];
      if (p.dir !== d) { await press(d); await sleep(30); }
      await press('a'); return;
    }
    throw new Error('could not reach ' + map + ' ' + x + ',' + y);
  }
  // Follow the objective chain until stopWhen(peek) is true, answering with the good options (and prefs first).
  async function follow(stopWhen, prefs, stopUi) {
    for (let n = 0; n < 400; n++) {
      const p = await peek();
      if (stopWhen(p)) return p;
      if (p.ui) { const r = await settle(prefs, stopUi); if (r) return r; continue; }
      if (p.busy || p.moving) { await sleep(20); continue; }
      const o = p.objective;
      if (o.done) return p;
      await goTo(o.map, o.x, o.y, !!o.step);
    }
    throw new Error('follow: too many steps');
  }
  async function saveReload() {
    const before = await peek();
    await page.evaluate(() => storeSet(encodeSave(__UPTIME.state())));
    const code = await page.evaluate(() => encodeSave(__UPTIME.state()));
    await page.reload(); await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
    await page.evaluate(() => __UPTIME.turbo(true));
    await pickLabel(/^Continue$/); await sleep(80);
    const after = await peek();
    const same = ['map', 'x', 'y', 'day', 'rank', 'focus'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) &&
      JSON.stringify(before.extra) === JSON.stringify(after.extra) && JSON.stringify(before.qt) === JSON.stringify(after.qt);
    const rt = await page.evaluate(c => { try { return decodeSave(c).day; } catch (e) { return 'ERR'; } }, code);
    return { same, roundTrip: rt === before.day, before: { map: before.map, day: before.day, track: before.extra.track } };
  }
  return { page, errors, requests, peek, press, pickLabel, settle, goTo, follow, saveReload, modalText: () => page.textContent('#modal') };
}

(async () => {
  const t0 = Date.now();
  const browser = await chromium.launch();

  // ---- The series menu ----
  {
    const html = fs.readFileSync(MENU, 'utf8');
    const iT = html.indexOf('editions/town-hall/index.html'), iC = html.indexOf('editions/crossroads/index.html'), iS = html.indexOf('Next edition: coming later');
    check('series menu: Town Hall, then Crossroads, then “Next edition: coming later”', iT > 0 && iC > iT && iS > iC, { iT, iC, iS });
  }

  // ======== A: manager track, no Town Hall save ========
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const A = await session(ctxA);
  {
    check('title: the Crossroads edition, its own save key, no Town Hall save in this browser', /Crossroads edition/.test(await A.modalText()) &&
      await A.page.evaluate(() => EDITION.saveKey === 'uptime.crossroads.save' && localStorage.getItem('uptime.slice1.save') === null));
    await A.pickLabel(/^New game$/);
    const carry = await A.settle([], /What you carry from Town Hall/);
    check('carry-over without a Town Hall save: a clean history and sensible defaults', /No Town Hall save in this browser/.test(await A.modalText()) &&
      await A.page.evaluate(() => G.cr.carry.from === 'none' && G.rank === 'Security team lead' && G.focusMax === 50 && G.cr.carry.badges.length === 0 && G.trackId === null), carry && carry.ui);
    await A.settle([], /nameplate/);
    await A.page.fill('#codebox', 'Sam');
    await A.page.evaluate(() => document.activeElement.blur());  // keys typed in the box stay in the box (engine rule)
    await A.pickLabel(/^Use the name I typed$/);
    await A.settle();
    check('the name plate: a typed name is kept', (await A.page.evaluate(() => G.name)) === 'Sam');
    // Rota: Magda's five nights accepted (a wrong answer the game allows, with its consequences).
    await A.goTo('cwar', 2, 2);
    await A.settle([/^Take her up on Nights 1 to 5/], /Rota · the week/);
    const rota = await A.page.evaluate(() => G.cr.rota);
    const fc = await A.modalText();
    check('rota: Magda on Nights 1–5 means tired nights 3, 4 and 5, shown in the forecast as Evidence and Focus', JSON.stringify(rota.stats.tired) === '[3,4,5]' && rota.assign.slice(0, 5).every(x => x === 'magda') && /Evidence 5 instead of 15/.test(fc) && /Focus −10/.test(fc), rota);
    check('rota: the other nights keep the rules (no gaps; overtime counted against the 30-hour budget)', rota.stats.gaps === 0 && rota.assign[5] && rota.assign[6] && rota.assign[5] !== 'magda' && rota.stats.overtime === 13, rota.stats);
    await A.settle();
    // Analyst growth: do it yourself.
    await A.goTo('cwar', 13, 5);
    await A.settle([/^Do it yourself tonight/]);
    check('analyst growth: the choice is recorded', (await A.page.evaluate(() => G.cr.growth)) === 'self');
    // The offers: pick, go back, pick, take it.
    await A.goTo('cwar', 7, 3);
    await A.settle([], /Two offers/);
    const offers = (await A.peek()).ui.options;
    check('the two offers: both open on a fresh browser', offers.length === 2 && offers.every(o => !o.disabled), offers);
    await A.pickLabel(/^The Mayor: IR manager/);
    await A.settle([], /Are you sure\?/);
    check('two-step confirmation: the second screen says it can’t be changed on this save and names New Game+', /can’t be changed on this save/.test(await A.modalText()) && /New Game\+/.test(await A.modalText()));
    await A.pickLabel(/^Go back to the two offers$/);
    await sleep(60);
    check('Go back returns to the offers without choosing', /Two offers/.test(await A.modalText()) && (await A.page.evaluate(() => G.trackId)) === null);
    await A.pickLabel(/^The Mayor: IR manager/);
    await A.settle([], /Are you sure\?/);
    await A.pickLabel(/^Take it/);
    await A.settle();
    const lockA = await A.page.evaluate(() => ({ t: G.trackId, rank: G.rank, ser: JSON.parse(localStorage.getItem('uptime.series')).editions.crossroads, day: G.day, focus: G.focus, fmax: G.focusMax }));
    check('track locked: edition save and series save record manager; rank IR manager; Day 2', lockA.t === 'manager' && lockA.rank === 'IR manager' && lockA.ser.track === 'manager' && lockA.day === 2, lockA);
    check('growth “yourself”: Focus −6 on Day 2 (game)', lockA.focus === lockA.fmax - 6, lockA);
    // To the Library; tabletop, retainer, AAR; night 2.
    await A.follow(p => p.f.lbAar, []);
    const t1 = await A.page.evaluate(() => ({ pcs: tileDef('library', 8, 7).pal, circ: tileDef('library', 8, 3).pal, act: G.cr.activate, aar: G.cr.aar, ex: G.cr.ex }));
    check('manager fieldwork: tabletop (3 actions), retainer activated in 15 game minutes, AAR with owners and dates', t1.ex.run === 1 && t1.ex.actions === 3 && t1.act === 15 && t1.aar.onTime === 3 && t1.circ === 'lbCircOk' && t1.pcs === 'lbPub', t1);
    await A.follow(p => p.f.lbNight2, []);
    const t2 = await A.page.evaluate(() => ({ pcs: tileDef('library', 8, 7).pal, wifi: tileDef('library', 12, 7).pal, closed: G.cr.ex.closed }));
    check('Day 3: the public PCs restore (tick palette), LIB-GUEST split, exercise actions closed', t2.pcs === 'lbPubOk' && t2.wifi === 'closetOk' && t2.closed === 3, t2);
    // Drill A (manager) then save/reload.
    await A.follow(p => p.f.lbDrillA, []);
    check('manager drill A: supported and right (the endpoint record is the needed source)', await A.page.evaluate(() => G.cr.drills.pcmgr.verdictOk && G.cr.drills.pcmgr.supported));
    const sr = await A.saveReload();
    check('save/reload mid-Library restores the state; the export code round-trips', sr.same && sr.roundTrip && sr.before.track === 'manager', sr);
    // Night 3 was a tired night (Magda's third): Focus −10 the next morning.
    await A.follow(p => p.f.lbNight3, []);
    const n3 = await A.page.evaluate(() => ({ focus: G.focus, fmax: G.focusMax, cover: G.cr.cover, dir: G.f.lbDirective }));
    check('cover and directive done; the morning after a tired night: Focus −10 (game)', n3.focus === n3.fmax - 10 && n3.cover.k === 'threshold' && n3.cover.variance === -10 && n3.dir, n3);
    await A.follow(p => p.f.lbBoss, []);
    const boss = await A.page.evaluate(() => ({ ev: G.cr.boss.ev, ok: G.cr.boss.ok, badge: G.f.lbBookmark, n4: G.cr.night4 }));
    check('the boss after a tired Night 4: a thin first look (Evidence 5); Board cleared (Bookmark Badge)', boss.ev === 5 && boss.badge && boss.n4.tired, boss);
    await A.follow(() => false, [], /End of the Public Library/);
    const endA = await A.page.evaluate(() => ({ qt: Series.qt(), clue: qtFound('lb-rdp'), threats: Object.keys(THREATS).length, obj: objective(), ser: JSON.parse(localStorage.getItem('uptime.series')).editions.crossroads }));
    const sumTxt = await A.modalText();
    check('Quiet Thread: the firm’s status report shows svc-print over RDP on CIRC-01 (lb-rdp, T1021.001); not in the alert mix; not evicted', endA.clue && endA.qt.evicted === false && endA.threats === 0 &&
      await A.page.evaluate(() => QT_CLUES['lb-rdp'].tech === 'T1021.001' && !!QT_TECH['T1021.001']), endA);
    check('end summary: “Next: School District”; series records the Library done on the manager track', /Next: School District/.test(sumTxt) && endA.obj.done && endA.ser.library === true && endA.ser.track === 'manager', endA);
    await A.pickLabel(/^Keep exploring/); await A.settle();
    // A fresh save on this browser: the other track is locked; New Game+ opens it.
    await A.page.evaluate(() => { started = false; newGame(); });
    await A.settle([], /nameplate/); await A.settle();
    await A.page.evaluate(() => { G.f.crRota = true; G.f.crGrowth = true; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) }; G.cr.growth = 'paz'; run(crCommandTable); });
    await A.settle([], /Two offers/);
    const locked = (await A.peek()).ui.options;
    check('a fresh save on the same browser: the DFIR offer is locked (chosen elsewhere), the manager offer open', locked.find(o => /Tallowmere/.test(o.label)).disabled && !locked.find(o => /Mayor/.test(o.label)).disabled, locked);
    await A.pickLabel(/^The Mayor/); await A.settle([], /Are you sure/); await A.pickLabel(/^Go back/); await sleep(40);
    await A.page.evaluate(() => { crGrantNgPlus(); UI.closeModal(0); });
    await A.settle();
    await A.page.evaluate(() => { started = false; newGame(); });
    await A.settle([], /nameplate/); await A.settle();
    await A.page.evaluate(() => { G.f.crRota = true; G.f.crGrowth = true; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) }; G.cr.growth = 'paz'; run(crCommandTable); });
    await A.settle([], /Two offers/);
    const ng = (await A.peek()).ui.options;
    check('New Game+ (test hook): the other track opens on a fresh save', ng.every(o => !o.disabled) && (await A.page.evaluate(() => crSeries().ngPlus)) === true, ng);
    // A Town Hall save code is refused.
    const refused = await A.page.evaluate(() => { const th = encodeSave({ v: 1, seed: 1, map: 'hub', rank: 'Intern', f: {} }); try { sameEdition(decodeSave(th)); return false; } catch (e) { return /another Uptime edition/.test(e.message); } });
    check('Crossroads refuses a Town Hall save code (and keeps its own state)', refused);
    check('manager session: zero console errors and network requests', !A.errors.length && !A.requests.length, { e: A.errors, r: A.requests });
  }
  await ctxA.close();

  // ======== B: DFIR track, with a Town Hall save ========
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const T = await session(ctxB, TH_FILE);
  await T.pickLabel(/^New game$/); await T.settle();
  const thSave = await T.page.evaluate(() => {
    const g = __UPTIME.state();
    g.rank = 'Security team lead'; g.badge = true;
    Object.assign(g.f, { mrSeal: true, crShield: true, mkLantern: true, rhVault: true, bmBeacon: true, svCrown: true, wtTide: true, ccCharter: true, ccSummary: true });
    qtNote('th-signin'); qtNote('th-router'); qtNote('th-schtask');
    storeSet(encodeSave(g));
    return localStorage.getItem('uptime.slice1.save');
  });
  const B = await session(ctxB);
  {
    await B.pickLabel(/^New game$/);
    await B.settle([], /What you carry from Town Hall/);
    const ctext = await B.modalText();
    const carry = await B.page.evaluate(() => ({ c: G.cr.carry, fmax: G.focusMax, qt: Series.qt().cluesFound }));
    check('carry-over with a Town Hall save: rank, all nine badges as history, the edition finished, the suspicion file', carry.c.from === 'save' && carry.c.rank === 'Security team lead' && carry.c.badges.length === 9 && carry.c.complete && carry.c.clues === 3 && /PrinterHealthCheck/.test(ctext), carry);
    check('carry-over: the Charter Badge carries Focus 52', carry.fmax === 52, carry);
    await B.settle([], /nameplate/); await B.pickLabel(/^Keep/); await B.settle();
    // Spread rota, Paz grows? No: Beatriz (so E-01 arrives without its collection hash).
    await B.goTo('cwar', 2, 2); await B.settle();
    await B.goTo('cwar', 13, 5); await B.settle([/^Beatriz takes it/]);
    await B.goTo('cwar', 7, 3);
    await B.settle([/^Tallowmere: principal DFIR consultant/]);
    check('DFIR track locked; rank Principal DFIR consultant', await B.page.evaluate(() => G.trackId === 'dfir' && G.rank === 'Principal DFIR consultant' && crSeries().track === 'dfir'));
    await B.follow(p => p.f.lbIntake, []);
    const cu = await B.page.evaluate(() => G.cr.custody);
    check('custody log: four items; E-01’s missing collection hash and E-03’s mismatch recorded as gaps; E-01 not counted as a full record', cu.items === 4 && cu.gaps === 2 && cu.complete === 3, cu);
    check('Quiet Thread: seen in E-04 (CIRC-01’s Security log) on the DFIR track', await B.page.evaluate(() => qtFound('lb-rdp') && Series.qt().cluesFound.length === 4));
    await B.follow(p => p.f.lbNight2, []);
    // Drill A with only one of its two needed sources read: unsupported.
    await B.goTo('library', 13, 12);
    await B.settle([], /Investigation drill/); await B.pickLabel(/^Start investigating$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: E-01/);
    await B.settle([], /Which question/); await B.pickLabel(/When was kbhelper.exe created/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/I have enough|Budget spent/);
    await B.settle([], /^Verdict/); await B.pickLabel(/^A leftover from B-2231/);
    await B.settle([], /^Reasoning/); await B.pickLabel(/^E-01 dates the file/);
    await B.settle([], /Debrief/);
    const deb = await B.modalText();
    check('a two-source `needs` verdict read from one source is unsupported (the debrief says so)', /Unsupported/.test(deb) && /two sources/.test(deb) && await B.page.evaluate(() => true), deb.slice(0, 300));
    await B.settle();
    check('the drill records an unsupported finding (findings with every needed source read < 100%)', await B.page.evaluate(() => G.cr.drills.pcdfir.supported === false && G.cr.needs.met === 0 && G.cr.needs.total === 1));
    // The report: overclaim finding 3 (likely written as confirmed).
    await B.goTo('library', 13, 12);
    await B.settle([], /Report · /); await B.pickLabel(/^Start writing$/);
    for (let n = 1; n <= 6; n++) {
      await B.settle([], /Finding \d of 6/);
      const truth = await B.page.evaluate(k => LB_REPORT_PC.claims[k].truth, n - 1);
      const want = n === 3 ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < 6 ? /Finding \d of 6/ : /Report filed/);
    }
    const filed = await B.modalText(), filedHtml = await B.page.innerHTML('#modal');
    await B.settle();
    const rep = await B.page.evaluate(() => ({ r: G.cr.reports.pc, corr: G.cr.corrected, first: G.cr.first }));
    check('report primitive: an overclaim is corrected before filing, scored 0 for that finding, counted as a claim corrected', rep.r && rep.r.over === 1 && rep.r.score === 83 && rep.corr === 1 && rep.first === 29 && /corrected in review/.test(filed) && /Likely:<\/b> Those keystrokes/.test(filedHtml), rep);
    check('DFIR: the report’s recommendations fix the arrival problems on the map', await B.page.evaluate(() => tileDef('library', 8, 7).pal === 'lbPubOk' && tileDef('library', 12, 7).pal === 'closetOk' && tileDef('library', 8, 3).pal === 'lbCircOk'));
    await B.follow(() => false, [], /End of the Public Library/);
    const endB = await B.page.evaluate(() => ({ cr: G.cr, obj: objective(), ser: crSeries() }));
    check('DFIR track: custody log grows with the paste claim and the boss (8 items), boss report filed, end summary', endB.cr.custody.items === 8 && !!endB.cr.reports.boss && endB.obj.done && endB.ser.library && /Next: School District/.test(await B.modalText()), endB.cr.custody);
    await B.pickLabel(/^Keep exploring/); await B.settle();
    await B.page.evaluate(() => storeSet(encodeSave(G)));
    const after = await B.page.evaluate(() => localStorage.getItem('uptime.slice1.save'));
    check('the Town Hall save is byte-for-byte unchanged after a Crossroads playthrough', after === thSave);
    const thLoad = await T.page.evaluate(() => { try { const g = decodeSave(localStorage.getItem('uptime.slice1.save')); return g.rank === 'Security team lead' && g.edition === undefined; } catch (e) { return false; } });
    check('the Town Hall edition still loads its own save', thLoad);
    check('DFIR session: zero console errors and network requests', !B.errors.length && !B.requests.length && !T.errors.length && !T.requests.length, { e: B.errors.concat(T.errors), r: B.requests.concat(T.requests) });
  }
  await ctxB.close();
  await browser.close();
  const fails = Object.values(results).filter(v => v !== 'ok').length;
  console.log(JSON.stringify({ suite: 'crossroads', passed: Object.keys(results).length - fails, failed: fails, seconds: Math.round((Date.now() - t0) / 1000), results }, null, 1));
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('CROSSROADS FAILED:', e.stack || e.message); process.exit(2); });
