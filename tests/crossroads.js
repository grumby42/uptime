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
// School District (slice 2), both tracks: the door opens only with the Bookmark Badge; Day 8 is a Monday; the manager
// meets the district annex's retainer criteria (15 game minutes), works the notice under §9, builds the inventory with
// owners, runs the tabletop, absorbs the district into a week-2 rota whose in-a-row rule counts last week's nights, and
// reviews three records drills (one read with a single `needs` source is unsupported); the DFIR consultant works the
// amended letter, logs five items (the SSO filter as a gap), requests vendor-held evidence dated Day 8, keeps the
// districts' stores apart (3 clients), and writes SCH-01 (seven findings) and SCH-02 with "unknown: held by the vendor; requested on Day
// 8 (Monday)"; save/reload mid-district; the Slate Badge; the Quiet Thread clue sd-probe (T1018) on both tracks; the
// end summary ("Next: Community Clinic").
// Community Clinic (slice 3), both tracks: the door opens only with the Slate Badge; Day 12 is a Friday; the manager meets
// the Clinic annex (ransomware found), leaves the downtime decision to the practice manager, reviews three records drills
// (one read with a single `needs` source is unsupported), signs a weekend plan, and runs the boss, the AAR and a tabletop;
// the DFIR consultant works the letter, containment that preserves, intake (an unlogged handover as a gap; the vendor
// request dated as it went), three two-source drills and CLN-01/CLN-02 (an overclaim corrected; inactive records counted);
// save/reload mid-Clinic; the Pulse Badge; the Quiet Thread clue cn-folders (T1083); the summary ("Next: Fire & EMS Dispatch").
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
    check('rota: Magda on Nights 1–5 means tired nights 3, 4 and 5, shown in the forecast as a thinner first look and Focus', JSON.stringify(rota.stats.tired) === '[3,4,5]' && rota.assign.slice(0, 5).every(x => x === 'magda') && /thinner first look/.test(fc) && !/Evidence 5/.test(fc) && /Focus −10/.test(fc), rota);
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
    { const u = (await A.peek()).ui; check('two-step confirmation opens on “Go back”, so A twice from the offers does not lock the save', /^Go back/.test(u.options[u.cursor].label), u.options[u.cursor]); }
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
    const boss = await A.page.evaluate(() => ({ look: G.cr.boss.look, ok: G.cr.boss.ok, badge: G.f.lbBookmark, n4: G.cr.night4 }));
    check('the boss after a tired Night 4: a thin first look; Board cleared (Bookmark Badge)', boss.look === 'thin' && boss.badge && boss.n4.tired, boss);
    await A.follow(() => false, [], /End of the Public Library/);
    const endA = await A.page.evaluate(() => ({ qt: Series.qt(), clue: qtFound('lb-rdp'), threats: Object.keys(THREATS).length, obj: objective(), ser: JSON.parse(localStorage.getItem('uptime.series')).editions.crossroads }));
    const sumTxt = await A.modalText();
    check('Quiet Thread: the firm’s status report shows svc-print over RDP on CIRC-01 (lb-rdp, T1021.001); not in the alert mix; not evicted', endA.clue && endA.qt.evicted === false && endA.threats === 0 &&
      await A.page.evaluate(() => QT_CLUES['lb-rdp'].tech === 'T1021.001' && !!QT_TECH['T1021.001']), endA);
    check('end summary: “Next: School District”; series records the Library done on the manager track; the objective moves to the School District', /Next: School District/.test(sumTxt) && !endA.obj.done && /School District/.test(endA.obj.text) && endA.ser.library === true && endA.ser.track === 'manager', endA);
    check('end summary: the CIRC-01 directory-join risk is named as open, with where it goes', /Open risk/.test(sumTxt) && /risk committee/.test(sumTxt));
    // The rota's uncovered nights and the thin first look change the text (review S2, S15); checked on the state directly, then restored.
    const br = await A.page.evaluate(() => {
      const keep = [G.cr.nightOneUncovered, G.cr.night4], out = {};
      try {
        G.cr.nightOneUncovered = true; const d = lbFill(LB_DRILLS.pcmgr);
        out.n1 = /the day lead/.test(d.intro) && /Day lead’s note/.test(d.artefact) && d.response.some(x => /Tell the day lead in private/.test(x));
        G.cr.nightOneUncovered = false; const d2 = lbFill(LB_DRILLS.pcmgr);
        out.n1cov = /Night 1’s on-call lead/.test(d2.intro) && d2.response.some(x => /Tell the on-call lead in private/.test(x));
        G.cr.night4 = { lead: null, tired: false }; const s = lbMgrBossStages().s1, t = lbDfirBossStages().s1;
        out.n4open = lbAt('06:20') === '07:20' && /07:20/.test(s.title) && /07:00: Director Strand reads it/.test(s.clues[1]) && /07:40/.test(t.title);
        G.cr.night4 = { lead: 'Magda Petrov', tired: true }; const s2 = lbMgrBossStages().s1;
        out.n4thin = lbAt('06:20') === '06:20' && /thin first look/.test(s2.clues[1]) && !/192\.0\.2\.77/.test(s2.clues[1]);
        out.paste = LB_DRILLS.pastemgr.techs.length === 0 && LB_DRILLS.pastedfir.techs.length === 0;
      } finally { G.cr.nightOneUncovered = keep[0]; G.cr.night4 = keep[1]; }
      return out;
    });
    check('uncovered Night 1: the note is the day lead’s, and the day lead is coached; covered: the on-call lead’s', br.n1 && br.n1cov, br);
    check('uncovered Night 4: the boss’s first hour starts after the Director reads the email at 07:00; a tired lead’s first look has no account or address', br.n4open && br.n4thin, br);
    check('the paste-site drills tag no ATT&CK technique (T1657 is the boss’s)', br.paste, br);
    await A.pickLabel(/^Keep exploring/); await A.settle();
    // ---- School District, manager track ----
    const door = await A.page.evaluate(() => { const keep = G.f.lbBookmark; G.f.lbBookmark = false; const d = MAPS.csquare.doors['19,5'], shut = d.locked; G.f.lbBookmark = keep; return { shut, open: !d.locked, to: d.to }; });
    check('School District: the square’s east door is locked without the Bookmark Badge and opens with it', /Bookmark Badge/.test(door.shut || '') && door.open && door.to === 'school', door);
    await A.follow(p => p.f.sdMet && !p.ui && !p.busy, []);
    const arr = await A.page.evaluate(() => ({ day: G.day, act: G.cr.sd.activate, act2: G.cr.activate, rank: G.rank, hud: hudStatus() }));
    check('School District arrival: Day 8 (Monday); the annex’s criteria met and the retainer called in 15 game minutes', arr.day === 8 && arr.act === 15 && arr.act2 === 15 && /School District/.test(arr.hud), arr);
    // Drill A read with one of its two `needs` sources: unsupported.
    await A.goTo('school', 12, 13);
    await A.settle([], /Investigation drill/); await A.pickLabel(/^Start investigating$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: Inkstone’s data-sharing/);
    await A.settle([], /Which question/); await A.pickLabel(/What have we sent Lumenlark/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: Lumenlark’s notice/);
    await A.settle([], /Which question/); await A.pickLabel(/What does it say was affected/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/I have enough|Budget spent/);
    await A.settle([], /^Verdict/); await A.pickLabel(/^Yes: Lumenlark held six roster fields/);
    await A.settle([], /^Reasoning/); await A.pickLabel(/^The export history shows/);
    await A.settle([], /Debrief/);
    const debA = await A.modalText();
    check('manager drill A: the right verdict from the export history alone is unsupported (the contract’s data list is also needed)', /Unsupported/.test(debA) && /two records/.test(debA), debA.slice(0, 300));
    await A.settle();
    check('manager drill A recorded as right but unsupported', await A.page.evaluate(() => G.cr.drills.vendmgr.verdictOk && !G.cr.drills.vendmgr.supported));
    await A.follow(p => p.f.sdTabletop, []);
    const mid = await A.page.evaluate(() => ({ notice: G.cr.sd.notice, inv: G.cr.sd.inv, ex: G.cr.ex, list: tileDef('school', 13, 2).pal, sis: tileDef('school', 3, 2).pal }));
    check('manager fieldwork: §9 found and the questions sent; the inventory with three owners; the tabletop adds three actions', mid.notice && mid.inv.owned === 3 && mid.ex.run === 2 && mid.ex.actions === 6 && mid.sis === 'sdSis', mid);
    await A.follow(p => p.f.sdStaffing, []);
    const r2 = await A.page.evaluate(() => {
      const s = G.cr.sd.rota, out = { assign: s.assign, stats: s.stats, cover: G.cr.sd.cover };
      // The fatigue rule holds across the week boundary: last week's Nights 6-7 count for the in-a-row rule.
      const a = ['bea', 'bea', undefined, undefined, undefined, undefined, undefined, undefined, undefined];
      out.fitsThird = rotaFits(SD_ROTA, a, 2, SD_ROTA.people.find(p => p.id === 'bea'));
      out.tired = rotaStats(SD_ROTA, ['bea', 'bea', 'bea', 'ruth', 'paz', 'paz', 'odile', 'magda', 'rae']).tired;
      out.weekOnly = rotaStats(SD_ROTA, [null, null, 'bea', 'ruth', 'paz', 'paz', 'odile', 'magda', 'rae']).gaps;
      out.prologue = rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']).overtime;
      return out; });
    check('week-2 rota: the district’s nights under a signed threshold; nobody past two in a row; Nights 6–7 carried for the rule', r2.cover.k === 'threshold' && r2.stats.tired.length === 0 && r2.stats.gaps === 0 && r2.assign.length === 9 && r2.assign.slice(2).every(Boolean), r2);
    check('week-2 rota: a third night in a row across the week boundary is refused and counted as tired; carried nights count no gaps; the prologue rota scores as before', r2.fitsThird === false && JSON.stringify(r2.tired) === '[8]' && r2.weekOnly === 0 && r2.prologue === 9, r2);
    await A.follow(p => p.f.sdDrillB, []);
    const srA = await A.saveReload();
    check('save/reload mid-district (manager) restores the state; the export code round-trips', srA.same && srA.roundTrip && srA.before.map === 'school', srA);
    await A.follow(p => p.f.sdNight9, []);
    const n9 = await A.page.evaluate(() => ({ day: G.day, sis: tileDef('school', 3, 2).pal, files: tileDef('school', 13, 2).pal, closed: G.cr.ex.closed, facts: G.cr.sd.facts, dir: G.f.sdDirective, B: G.cr.drills.signmgr }));
    check('Day 10 (Wednesday): named accounts (tick), §9 on the contact page (tick), tabletop actions closed; facts pack without law or promises; directive done; drill B right and supported', n9.day === 10 && n9.sis === 'sdSisOk' && n9.files === 'sdFilesOk' && n9.closed === 6 && n9.facts.wrong === 0 && n9.dir && n9.B.verdictOk && n9.B.supported, n9);
    await A.follow(() => false, [], /End of the School District/);
    const sdA = await A.page.evaluate(() => ({ C: G.cr.drills.offer, slate: G.f.sdSlate, boss: G.cr.sd.boss, clue: qtFound('sd-probe'), tech: QT_CLUES['sd-probe'].tech, qt: !!QT_TECH.T1018, inAlerts: Object.keys(THREATS).length, evicted: Series.qt().evicted, obj: objective(), ser: crSeries(), focusMax: G.focusMax }));
    const sdSum = await A.modalText();
    check('manager drill C (the vendor’s offer): right and supported', sdA.C.verdictOk && sdA.C.supported, sdA.C);
    check('School Board cleared: the Slate Badge', sdA.slate === true, sdA);
    check('Quiet Thread (manager): the firm’s status report shows the pings (sd-probe, T1018), not in the alert mix, not evicted', sdA.clue && sdA.tech === 'T1018' && sdA.qt && sdA.inAlerts === 0 && !sdA.evicted, sdA);
    check('School District summary: “Next: Community Clinic”, with its door; series records the district; the token-scope risk named as open; the objective moves to the Clinic', /Next: Community Clinic\. Its door is on the west side of the square/.test(sdSum) && /Open risk/.test(sdSum) && /read: all/.test(sdSum) && !sdA.obj.done && /Community Clinic/.test(sdA.obj.text) && sdA.obj.map === 'clinic' && sdA.ser.school === true, sdA.obj);
    const brS = await A.page.evaluate(() => {
      const keep = G.cr.sd.night10, out = {};
      try {
        G.cr.sd.night10 = { lead: null, tired: false }; const s = sdMgrBossStages().s1, t = sdDfirBossStages().s1;
        out.open = sdAt('06:20') === '07:20' && /07:20/.test(s.title) && /07:00: Owen Marsh reads it/.test(s.clues[1]) && /07:40/.test(t.title);
        G.cr.sd.night10 = { lead: 'Magda Petrov', tired: true }; const s2 = sdMgrBossStages().s1;
        out.thin = /thin first look/.test(s2.clues[1]) && !/10 sample rows/.test(s2.clues[1]);
      } finally { G.cr.sd.night10 = keep; }
      return out; });
    check('uncovered Night 10: the boss’s first hour starts after Owen Marsh at 07:00; a tired lead’s first look has no sample rows', brS.open && brS.thin, brS);
    // Review of slice 2 (9 Nov 2026): B2, B3, B4, S2, S3, S11, S12, N1, N2 checked on the text and state directly.
    const rv = await A.page.evaluate(() => {
      const out = {}, arrive = sdArrive.toString(), letter = sdLetterTask.toString(), night = sdNight.toString(), all = JSON.stringify(SD_DRILLS) + arrive + letter;
      out.b3 = /revoke LL-SYNC now and pause the sync, clearing nothing/.test(arrive) && /At 08:50[^']*revokes it[^']*at 09:40 he exports/.test(arrive) &&
        /revokes LL-SYNC at 09:20[^']*clearing nothing[^']*09:40/.test(letter) && !/before the token is revoked|before he revokes|10:05/.test(all);
      const inj = SD_INJECTS[1].opts.find(o => o.good).label, why = SD_BOARD_SPECS_MGR()[0].resp.map(r => r.why || '').join(' '), s2 = sdMgrBossStages().s2.clues.join(' ');
      out.b2 = !/never shared/.test(inj + why + s2) && /roster reads only/.test(inj);
      const txt = s => s.ask + ' ' + s.resp.map(r => r.label + ' ' + (r.why || '')).join(' ');
      out.b4 = SD_BOARD_SPECS_DFIR().concat(SD_BOARD_SPECS_MGR()).every(s => !/\bpost\b|post’s|sample|school gate/.test(txt(s)));
      out.s2 = /4,410/.test(SD_REPORT_1.claims[0].text) && /former/.test(sdMgrBossStages().s3.clues[1]);
      out.s3 = /in her office/.test(sdMgrBossStages().s1.clues[2]) && !/on her way in/.test(sdMgrBossStages().s1.clues[2]) && /thin note/.test(night);
      out.s11 = /pings/.test(QT_CLUES['sd-probe'].seen) && !/\bports?\b/.test(QT_CLUES['sd-probe'].seen);
      out.s12 = SD_REPORT_1.claims.length === 7 && SD_REPORT_1.claims.some(c => c.id === 'brandt' && c.truth === 'confirmed') && SD_REPORT_1.claims.some(c => /no writes/.test(c.text));
      out.n1 = /Math\.max\(9 \* 60, ack \+ 5\)/.test(arrive) && SD_ROTA.waitUntil === '07:00';
      return out; });
    check('review fixes (slice 2): revoke first, clearing nothing, then export, on both tracks (B3); no “grades were never shared” to a parent (B2); no Day 10 Board line mentions the post or its sample (B4); 4,410 students, former ones included (S2); Dr Vale in her office on Day 11 (S3); the clue is pings, T1018 (S11); SCH-01 answers all four questions (S12); the retainer clock and the district’s 07:00 (N1, N2)', Object.values(rv).every(Boolean), rv);
    await A.pickLabel(/^Keep exploring/); await A.settle();
    // ---- Community Clinic (slice 3), manager track ----
    const cdoor = await A.page.evaluate(() => { const keep = G.f.sdSlate; G.f.sdSlate = false; const d = MAPS.csquare.doors['0,5'], shut = d.locked; G.f.sdSlate = keep; return { shut, open: !d.locked, to: d.to }; });
    check('Clinic: the square’s west door is locked without the Slate Badge and opens with it', /Slate Badge/.test(cdoor.shut || '') && cdoor.open && cdoor.to === 'clinic', cdoor);
    await A.follow(p => p.f.cnMet && !p.ui && !p.busy, []);
    const carr = await A.page.evaluate(() => ({ day: G.day, act: G.cr.cn.activate, act2: G.cr.activate, hud: hudStatus(), obj: objective().text }));
    check('Clinic arrival: Day 12 (Friday); ransomware found meets the Clinic annex; the retainer called in 15 game minutes; next, the downtime decision with Marisol', carr.day === 12 && carr.act === 15 && carr.act2 === 15 && /Clinic/.test(carr.hud) && /Marisol/.test(carr.obj), carr);
    await A.follow(p => p.f.cnDowntime, []);
    check('downtime: Marisol decides, check-in on paper, exam rooms stay on Wrenfold (first time)', await A.page.evaluate(() => G.cr.cn.downtime.first === true && CN_DOWNTIME.some(o => !o.good && /Shut Wrenfold/.test(o.label)) && CN_DOWNTIME.some(o => !o.good && /Open as normal/.test(o.label))));
    // Drill A read with one of its two `needs` sources: unsupported.
    await A.goTo('clinic', 17, 3);
    await A.settle([], /Investigation drill/); await A.pickLabel(/^Start investigating$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: The EDR’s file events/);
    await A.settle([], /Which question/); await A.pickLabel(/Which PCs had their own files encrypted/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: The helpdesk queue/);
    await A.settle([], /Which question/); await A.pickLabel(/How many people/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/I have enough|Budget spent/);
    await A.settle([], /^Verdict/); await A.pickLabel(/^One: CL-FD-02/);
    await A.settle([], /^Reasoning/); await A.pickLabel(/^Only CL-FD-02 renamed/);
    await A.settle([], /Debrief/);
    const debCA = await A.modalText();
    check('Clinic manager drill A: the right verdict from the endpoint records alone is unsupported (the share’s audit is also needed)', /Unsupported/.test(debCA) && /two records/.test(debCA) && /T1486/.test(debCA), debCA.slice(0, 300));
    await A.settle();
    const srC = await A.saveReload();
    check('save/reload mid-Clinic (manager) restores the state; the export code round-trips', srC.same && srC.roundTrip && srC.before.map === 'clinic', srC);
    await A.follow(p => p.f.cnStaffing, []);
    const cst = await A.page.evaluate(() => ({ C: G.cr.drills.restore, B: G.cr.drills.tethermgr, cover: G.cr.cn.cover, rack: tileDef('clinic', 14, 1).pal, gaps: metricVals().crGaps, budget: metricVals().crBudget }));
    check('Clinic manager: drill C (the restore) and drill B (the vendor’s remote support) right and supported; the weekend plan: day shifts, 0 gaps, 26 of 30 h; night alerts routed (tick)', cst.C.verdictOk && cst.C.supported && cst.B.verdictOk && cst.B.supported && cst.cover.k === 'shifts' && cst.cover.gaps === 0 && cst.cover.overtime === 26 && cst.rack === 'cnRackOk' && cst.budget === -13, cst);
    await A.follow(p => p.f.cnBoss, []);
    const cboss = await A.page.evaluate(() => ({ day: G.day, boss: G.cr.cn.boss, n12: G.cr.cn.night12, lead: cnLead(12), tired: cnTired(12) }));
    check('Clinic boss on Day 13 (Saturday): Night 12’s lead is the week-2 rota’s; first look clear unless that lead is tired; all three stages right first time', cboss.day === 13 && cboss.n12.lead === cboss.lead && cboss.boss.look === (cboss.tired ? 'thin' : cboss.lead ? 'clear' : 'none') && cboss.boss.ok, cboss);
    await A.follow(() => false, [], /End of the Community Clinic/);
    const cnA = await A.page.evaluate(() => ({ pulse: G.f.cnPulse, clue: qtFound('cn-folders'), tech: QT_CLUES['cn-folders'].tech, qt: !!QT_TECH.T1083, inAlerts: Object.keys(THREATS).length, evicted: Series.qt().evicted, obj: objective(), ser: crSeries(), ex: G.cr.ex, aar: G.cr.aar, cart: tileDef('clinic', 16, 6).pal, desk: tileDef('clinic', 11, 6).pal, day: G.day, exam: tileDef('clinic', 2, 1).pal }));
    const cnSum = await A.modalText();
    check('Clinic Board cleared: the Pulse Badge; Day 15 (Monday)', cnA.pulse === true && cnA.day === 15, cnA);
    check('Clinic manager: the AAR adds three actions (owners arrive approved), the tabletop three more, closed at 16:00 (the cart and the front desk tick; the exam PCs don’t)', cnA.aar.total === 6 && cnA.aar.onTime === 6 && cnA.ex.run === 3 && cnA.ex.actions === 9 && cnA.ex.closed === 9 && cnA.cart === 'cnCartOk' && cnA.desk === 'cnDeskOk' && cnA.exam === 'cnExam', cnA);
    check('Quiet Thread (manager): the firm’s status report shows svc-print listing the Facilities share (cn-folders, T1083), not in the alert mix, not evicted', cnA.clue && cnA.tech === 'T1083' && cnA.qt && cnA.inAlerts === 0 && !cnA.evicted, cnA);
    check('Clinic summary: “Next: Fire & EMS Dispatch”; series records the Clinic; the shared exam login named as an accepted open risk; the objective done', /Next: Fire &amp; EMS Dispatch|Next: Fire & EMS Dispatch/.test(cnSum) && /Open risk/.test(cnSum) && /shared login/.test(cnSum) && cnA.obj.done && cnA.ser.clinic === true && cnA.ser.school === true, cnA.obj);
    const brC = await A.page.evaluate(() => {
      const keep = G.cr.cn.night12, out = {};
      try {
        G.cr.cn.night12 = { lead: null, tired: false }; const s = cnMgrBossStages().s1, t = cnDfirBossStages().s1;
        out.open = cnAt('06:20') === '07:20' && /07:20/.test(s.title) && /rang Marisol/.test(s.clues[1]) && /07:40/.test(t.title);
        G.cr.cn.night12 = { lead: 'Magda Petrov', tired: true }; const s2 = cnMgrBossStages().s1;
        out.thin = /thin first look/.test(s2.clues[1]) && !/20 sample rows/.test(s2.clues[0] + s2.clues[1]);
      } finally { G.cr.cn.night12 = keep; }
      return out; });
    check('uncovered Night 12: the boss’s first hour starts an hour later (07:20); a tired lead’s first look has no sample rows', brC.open && brC.thin, brC);
    // The slice's rules, checked on the text: one decider per decision; containment that keeps evidence; counts include inactive records; no overclaim; HHS only in its own words.
    const rules = await A.page.evaluate(() => {
      const out = {}, goods = [], all = [];
      const add = (arr) => arr.forEach(o => { all.push(o.label); if (o.good) goods.push(o.label); });
      [CN_ACTIVATE, CN_DOWNTIME, CN_COVER, CN_OBJECTIVE, CN_DIRECTIVE.manager, CN_DIRECTIVE.dfir, CN_LETTER, CN_CONTAIN].forEach(add);
      CN_INJECTS.forEach(i => add(i.opts)); CN_BOARD_SPECS_MGR().concat(CN_BOARD_SPECS_DFIR()).forEach(b => add(b.resp));
      const mb = cnMgrBossStages(), db = cnDfirBossStages(); [mb.s1, mb.s2, mb.s3, db.s1, db.s2].forEach(st => add(st.resp));
      // Patient-privacy questions: the right answers name Weller, never counsel alone or the IR manager.
      out.privacy = goods.filter(g => /patients? (are |is )?told|script/.test(g)).every(g => /Weller/.test(g));
      // Payment: the Board decides, with counsel and the insurer; no right answer has the player deciding it.
      out.payment = /Board decides/.test(mb.s3.resp.find(r => r.good).label) && !goods.some(g => /I decided|IR manager’s decision/.test(g));
      // Containment: memory before shutdown and nothing restored before preservation; an over-reaction distractor and an under-reaction one exist.
      out.contain = /^Memory now, then shut it down/.test(CN_CONTAIN.find(o => o.good).label) && CN_CONTAIN.some(o => !o.good && /Power CL-FD-02 off/.test(o.label));
      out.overUnder = CN_DOWNTIME.some(o => !o.good && /Shut Wrenfold/.test(o.label)) && mb.s1.resp.some(r => !r.good && /Take Wrenfold offline/.test(r.label)) && mb.s1.resp.some(r => !r.good && /cancels Saturday/.test(r.label));
      // Counts include inactive records everywhere they are stated.
      out.inactive = [CN_REPORT_2.claims.find(c => c.id === 'archive').text, db.s2.resp.find(r => r.good).label, CN_BOARD_SPECS_DFIR()[0].resp.find(r => r.good).label].every(t => /inactive/.test(t) && /5,210/.test(t));
      // What left: "likely", never "confirmed"; the attacker's "full medical records" is never a right answer.
      out.likely = CN_REPORT_1.claims.find(c => c.id === 'left').truth === 'likely' && CN_REPORT_2.claims.find(c => c.id === 'left').truth === 'likely' && !goods.some(g => /full (medical )?records/.test(g) && !/not/.test(g));
      // HHS appears only in the Field Manual, in its own words, with the clinic's status left to counsel and the privacy officer.
      out.hhs = /The presence of ransomware \(or any malware\) on a covered entity’s or business associate’s computer systems is a security incident under the HIPAA Security Rule\./.test(FACTS.cnhipaa.desc) && /The game says neither/.test(FACTS.cnhipaa.desc) && !/within \d+ (days|hours)/.test(JSON.stringify(CN_DRILLS) + all.join(' '));
      // The vendor's remote-support drill tags T1219 as the explanation ruled out.
      out.t1219 = CN_DRILLS.tethermgr.techs[0] === 'T1219' && /ruled out/.test(CN_DRILLS.tethermgr.path) && /ruled out/.test(CN_DRILLS.tetherdfir.path);
      return out; });
    check('Clinic rules on the text: one decider for patient privacy (Weller), payment (the Board), operations (Marisol); memory before shutdown; over- and under-reaction distractors; counts include inactive records; what left is “likely”; HHS only in its own words; T1219 ruled out', Object.values(rules).every(Boolean), rules);
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
    // The findings come in a shuffled order (review S9): read the shown claim and look it up.
    const shownOrder = [];
    for (let n = 1; n <= 6; n++) {
      await B.settle([], /Finding \d of 6/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = LB_REPORT_PC.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      shownOrder.push(cl && cl.id);
      const want = cl && cl.id === 'sent' ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < 6 ? /Finding \d of 6/ : /Report filed/);
    }
    check('report primitive: the findings are written in a shuffled order (not the spec order), each one found by its text', shownOrder.every(Boolean) && shownOrder.join() !== 'when,record,sent,who,staff,reuse', shownOrder);
    const filed = await B.modalText(), filedHtml = await B.page.innerHTML('#modal');
    await B.settle();
    const rep = await B.page.evaluate(() => ({ r: G.cr.reports.pc, corr: G.cr.corrected, first: G.cr.first }));
    check('report primitive: an overclaim is corrected before filing, scored 0 for that finding, counted as a claim corrected', rep.r && rep.r.over === 1 && rep.r.score === 83 && rep.corr === 1 && rep.first === 29 && /corrected in review/.test(filed) && /Likely:<\/b> Those keystrokes/.test(filedHtml), rep);
    check('DFIR: the report’s recommendations fix the arrival problems on the map', await B.page.evaluate(() => tileDef('library', 8, 7).pal === 'lbPubOk' && tileDef('library', 12, 7).pal === 'closetOk' && tileDef('library', 8, 3).pal === 'lbCircOk'));
    await B.follow(() => false, [], /End of the Public Library/);
    const endB = await B.page.evaluate(() => ({ cr: G.cr, obj: objective(), ser: crSeries() }));
    check('DFIR track: custody log grows with the paste claim and the boss (10 items: E-09 and E-10 added), boss report filed, end summary', endB.cr.custody.items === 10 && !!endB.cr.reports.boss && !endB.obj.done && endB.ser.library && /Next: School District/.test(await B.modalText()), endB.cr.custody);
    await B.pickLabel(/^Keep exploring/); await B.settle();
    // ---- School District, DFIR track ----
    await B.follow(p => p.f.sdIntake, []);
    const cuB = await B.page.evaluate(() => ({ cu: G.cr.custody, letter: G.f.sdLetter }));
    check('DFIR: the amended letter first; intake logs five district items, the SSO export’s unrecorded filter as a gap', cuB.letter && cuB.cu.items === 15 && cuB.cu.gaps === endB.cr.custody.gaps + 1 && cuB.cu.complete === endB.cr.custody.complete + 4, { now: cuB.cu, library: endB.cr.custody });
    await B.follow(p => p.f.sdRequests, []);
    check('DFIR: requests for vendor-held evidence logged “requested Day 8 (Monday)”', await B.page.evaluate(() => G.cr.sd.requests.date === 'Day 8 (Monday)' && G.cr.sd.requests.wrong === 0));
    // Drill A with only one of its two needed sources: unsupported.
    await B.goTo('school', 14, 11);
    await B.settle([], /Investigation drill/); await B.pickLabel(/^Start investigating$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: S-01/);
    await B.settle([], /Which question/); await B.pickLabel(/Which fields went to Lumenlark/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: S-02/);
    await B.settle([], /Which question/); await B.pickLabel(/Which endpoints/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/I have enough|Budget spent/);
    await B.settle([], /^Verdict/); await B.pickLabel(/^Yes: six roster fields/);
    await B.settle([], /^Reasoning/); await B.pickLabel(/^S-01 lists the six fields/);
    await B.settle([], /Debrief/);
    const debB = await B.modalText();
    check('DFIR drill A: two decisive sources; S-01 and the supporting S-02 without S-05 is unsupported', /Unsupported/.test(debB) && /two sources/.test(debB), debB.slice(0, 300));
    await B.settle();
    await B.follow(p => p.f.sdStores, []);
    check('DFIR: separate stores; clients in parallel 3', await B.page.evaluate(() => metricVals().crClients === 3));
    await B.follow(p => p.f.sdIntake2, []);
    check('Quiet Thread (DFIR): seen in S-07, FW-SD’s Night 8 log (sd-probe, T1018)', await B.page.evaluate(() => qtFound('sd-probe') && QT_CLUES['sd-probe'].tech === 'T1018'));
    await B.follow(p => p.f.sdDrillB, []);
    const srB = await B.saveReload();
    check('save/reload mid-district (DFIR) restores the state; the export code round-trips', srB.same && srB.roundTrip && srB.before.track === 'dfir', srB);
    // SCH-01: write "accessed" (unknown, held by the vendor) as likely: an overclaim, corrected and counted.
    await B.goTo('school', 14, 11);
    await B.settle([], /Report · /); await B.pickLabel(/^Start writing$/);
    let unkWhy = '';
    const nSch1 = await B.page.evaluate(() => SD_REPORT_1.claims.length);   // 7 since the slice-2 review (S12)
    for (let n = 1; n <= nSch1; n++) {
      await B.settle([], /Finding \d of \d/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = SD_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'accessed' ? 'Likely' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      const said = await B.settle([], /./);
      if (cl && cl.id === 'accessed') unkWhy = said && said.ui && said.ui.text || '';
      await B.settle([], n < nSch1 ? /Finding \d of \d/ : /Report filed/);
    }
    const filedB = await B.page.innerHTML('#modal');
    await B.settle();
    check('SCH-01: the vendor-held finding goes out as “Unknown: held by the vendor; requested on Day 8 (Monday)”; the overclaim is corrected and counted', /Unknown:<\/b> Our students’ records were among the data accessed/.test(filedB) && /held by the vendor; requested on Day 8 \(Monday\)/.test(unkWhy) && /corrected in review/.test(filedB) && await B.page.evaluate(() => G.cr.reports.sd1.over === 1), { unkWhy, filed: filedB.slice(0, 400) });
    await B.follow(p => p.f.sdDrillC, []);
    const tdB = await B.page.evaluate(() => ({ d: G.cr.drills.tokendate, resp: SD_DRILLS.tokendate.response[0] }));
    check('DFIR drill C: our log, worded with both dates and “unknown: … held by the vendor; requested on Day 8 (Monday)”; right and supported', tdB.d.verdictOk && tdB.d.supported && /held by the vendor; requested on Day 8 \(Monday\)/.test(tdB.resp), tdB);
    await B.follow(() => false, [], /End of the School District/);
    const sdB = await B.page.evaluate(() => ({ cu: G.cr.custody, r2: G.cr.reports.sd2, slate: G.f.sdSlate, needs: G.cr.needs, obj: objective(), ser: crSeries() }));
    check('DFIR School District: SCH-02 filed, 22 custody items (Library 10 + district 12), Slate Badge, summary “Next: Community Clinic”, the objective moves to the Clinic', sdB.cu.items === 22 && !!sdB.r2 && sdB.slate && !sdB.obj.done && sdB.obj.map === 'clinic' && sdB.ser.school === true && /Next: Community Clinic/.test(await B.modalText()), sdB);
    check('SCH-02 carries the vendor-held unknown', await B.page.evaluate(() => SD_REPORT_2.claims.some(c => c.truth === 'unknown' && /held by the vendor; requested on Day 8 \(Monday\)/.test(c.why))));
    await B.pickLabel(/^Keep exploring/); await B.settle();
    // ---- Community Clinic (slice 3), DFIR track ----
    await B.follow(p => p.f.cnContain, []);
    check('Clinic DFIR: the letter first, then containment that preserves (memory, then the disk image)', await B.page.evaluate(() => G.f.cnLetter && G.f.cnContain && G.day === 12));
    await B.follow(p => p.f.cnIntake, []);
    const cuC = await B.page.evaluate(() => ({ cu: G.cr.custody, req: G.cr.cn.requests, clue: qtFound('cn-folders') }));
    check('Clinic DFIR intake: five items; the firewall log’s unlogged handover recorded as a gap; the vendor request logged with its date as it went (Slate Badge)', cuC.cu.items === sdB.cu.items + 5 && cuC.cu.gaps === sdB.cu.gaps + 1 && cuC.cu.complete === sdB.cu.complete + 4 && cuC.req && cuC.req.date === 'Day 12 (Friday) 10:15', { now: cuC, school: sdB.cu });
    check('Quiet Thread (DFIR): seen in C-04, the share audit (cn-folders, T1083)', cuC.clue && await B.page.evaluate(() => QT_CLUES['cn-folders'].tech === 'T1083' && !!QT_TECH.T1083));
    // Drill A with one of its two needed sources and the supporting one: unsupported.
    await B.goTo('clinic', 19, 11);
    await B.settle([], /Investigation drill/); await B.pickLabel(/^Start investigating$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: C-03/);
    await B.settle([], /Which question/); await B.pickLabel(/Which hosts renamed/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: C-02/);
    await B.settle([], /Which question/); await B.pickLabel(/What ran on CL-FD-02/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/I have enough|Budget spent/);
    await B.settle([], /^Verdict/); await B.pickLabel(/^CL-FD-02 and the share files/);
    await B.settle([], /^Reasoning/); await B.pickLabel(/^C-03: only CL-FD-02/);
    await B.settle([], /Debrief/);
    const debCB = await B.modalText();
    check('Clinic DFIR drill A: two decisive sources; C-03 and the supporting C-02 without C-04 is unsupported', /Unsupported/.test(debCB) && /two sources/.test(debCB), debCB.slice(0, 300));
    await B.settle();
    const srCB = await B.saveReload();
    check('save/reload mid-Clinic (DFIR) restores the state; the export code round-trips', srCB.same && srCB.roundTrip && srCB.before.track === 'dfir' && srCB.before.map === 'clinic', srCB);
    await B.follow(p => p.f.cnDrillC, []);
    check('Clinic DFIR drills B (the vendor’s remote support) and C (412 views: staff work) right and supported', await B.page.evaluate(() => G.cr.drills.tetherdfir.verdictOk && G.cr.drills.tetherdfir.supported && G.cr.drills.views.verdictOk && G.cr.drills.views.supported));
    // CLN-01: write "left" (likely) as confirmed: an overclaim, corrected and counted.
    await B.goTo('clinic', 19, 11);
    await B.settle([], /Report · /); await B.pickLabel(/^Start writing$/);
    const nCln1 = await B.page.evaluate(() => CN_REPORT_1.claims.length);
    for (let n = 1; n <= nCln1; n++) {
      await B.settle([], /Finding \d of \d/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = CN_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'left' ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < nCln1 ? /Finding \d of \d/ : /Report filed/);
    }
    const filedC = await B.page.innerHTML('#modal');
    await B.settle();
    check('CLN-01: what left goes out as “Likely” (the overclaim corrected before filing and counted); the sender as “Unknown”', /Likely:<\/b> The archive of the front desk’s daily lists/.test(filedC) && /Unknown:<\/b> Who sent the email/.test(filedC) && /corrected in review/.test(filedC) && await B.page.evaluate(() => G.cr.reports.cn1.over === 1), filedC.slice(0, 400));
    await B.follow(() => false, [], /End of the Community Clinic/);
    const cnB = await B.page.evaluate(() => ({ cu: G.cr.custody, r2: G.cr.reports.cn2, pulse: G.f.cnPulse, needs: G.cr.needs, obj: objective(), ser: crSeries(), corrected: G.cr.corrected }));
    check('DFIR Clinic: CLN-02 filed, 34 custody items (Library 10 + district 12 + Clinic 12), Pulse Badge, summary “Next: Fire & EMS Dispatch”', cnB.cu.items === 34 && !!cnB.r2 && cnB.pulse && cnB.obj.done && cnB.ser.clinic === true && /Next: Fire/.test(await B.modalText()), cnB);
    check('CLN-02: the archive held 5,210 patients, 1,180 of them inactive (confirmed); what left is likely; publication and anything beyond the archive unknown', await B.page.evaluate(() => { const c = id => CN_REPORT_2.claims.find(x => x.id === id); return c('archive').truth === 'confirmed' && /1,180/.test(c('archive').text) && c('left').truth === 'likely' && c('pub').truth === 'unknown' && c('more').truth === 'unknown'; }));
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
