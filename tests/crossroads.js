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
// Fire & EMS Dispatch (slice 4), both tracks: the door opens only with the Pulse Badge; Day 16 is a Tuesday; the manager meets
// the Dispatch annex (an admin sign-in nobody can explain), reviews three records drills (one read with a single `needs`
// source is unsupported), builds the week-3 rota with Nights 14 and 15 carried, runs the cards drill with the supervisor and
// the backup center's pack, coordinates the boss with a 24-hour plan, and runs the AAR measured in response time; the DFIR
// consultant works the letter, collects without slowing the floor (from the standby), logs intake (an export by the account
// owner in question gets a second export, compared), three two-source drills and DSP-01/DSP-02 (an overclaim corrected; the
// vendor's account written as unknown; the response impact as measured); save/reload mid-Dispatch; the Relay Badge; the
// Quiet Thread clue dp-conns (T1049); the dispatch measures on the scorecard; the summary ("Next: the Regional Airport").
// Regional Airport (slice 5), both tracks, business and office IT only: the door opens only with the Relay Badge; Day 23 is a
// Tuesday; the manager reviews three records drills (one read with a single `needs` source is unsupported), records who owns
// what, builds the week-4 rota with Nights 21 and 22 carried, runs the tabletop with the airport manager, meets the Airport
// annex on Saturday (ransomware on the office network) and coordinates the boss with a weekend plan, and runs the AAR; the DFIR
// consultant works the letter, takes only what each owner gives (a tenant's copy with its consent), logs intake, three
// two-source drills, separate stores per owner and AIR-01/AIR-02 (an overclaim corrected; tenant records likely left, never
// confirmed); save/reload mid-Airport; the Windsock Badge; the Quiet Thread clue ap-accounts (T1087); the summary ("Next: the
// Compact-wide incident").
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
    check('Clinic manager: drill C (the restore) and drill B (the vendor’s remote support) right and supported; the weekend plan: day shifts, 0 gaps, 26 of 30 h (29 if a weak Night 12 was swapped to a rested lead); night alerts routed (tick)', cst.C.verdictOk && cst.C.supported && cst.B.verdictOk && cst.B.supported && cst.cover.k === 'shifts' && cst.cover.gaps === 0 && cst.cover.overtime === (cst.cover.n12 === 'swap' ? 29 : 26) && cst.rack === 'cnRackOk' && cst.budget === (cst.cover.n12 === 'swap' ? -3 : -13), cst);
    // Drill C's right verdict rests on the copy's contents and the firm's check of it (review B2), not on one known file.
    check('Clinic restore drill: the right verdict needs the backup record and the check of the copy (the share’s audit and a scan); no “copy is good” claim', await A.page.evaluate(() => { const D = CN_DRILLS.restore, v = D.verdicts.find(x => x.good); return JSON.stringify(v.needs) === JSON.stringify(['backup', 'check']) && D.sources.some(s => s.id === 'check' && s.qs.some(q => q.key && q.res.some(r => /scanned/.test(r)) && q.res.some(r => /audit/.test(r)))) && !/copy is good/.test(JSON.stringify(D)); }));
    await A.follow(p => p.f.cnBoss, []);
    const cboss = await A.page.evaluate(() => ({ day: G.day, boss: G.cr.cn.boss, n12: G.cr.cn.night12, lead: cnLead(12), tired: cnTired(12) }));
    check('Clinic boss on Day 13 (Saturday): Night 12’s lead is the week-2 rota’s; first look clear unless that lead is tired; all three stages right first time', cboss.day === 13 && cboss.n12.lead === cboss.lead && cboss.boss.look === (cboss.tired ? 'thin' : cboss.lead ? 'clear' : 'none') && cboss.boss.ok, cboss);
    await A.follow(() => false, [], /End of the Community Clinic/);
    const cnA = await A.page.evaluate(() => ({ pulse: G.f.cnPulse, clue: qtFound('cn-folders'), tech: QT_CLUES['cn-folders'].tech, qt: !!QT_TECH.T1083, inAlerts: Object.keys(THREATS).length, evicted: Series.qt().evicted, obj: objective(), ser: crSeries(), ex: G.cr.ex, aar: G.cr.aar, cart: tileDef('clinic', 16, 6).pal, desk: tileDef('clinic', 11, 6).pal, day: G.day, exam: tileDef('clinic', 2, 1).pal }));
    const cnSum = await A.modalText();
    check('Clinic Board cleared: the Pulse Badge; Day 15 (Monday)', cnA.pulse === true && cnA.day === 15, cnA);
    check('Clinic manager: the AAR adds three actions (owners arrive approved), the tabletop three more, closed at 16:00 (the cart and the front desk tick; the exam PCs don’t)', cnA.aar.total === 6 && cnA.aar.onTime === 6 && cnA.ex.run === 3 && cnA.ex.actions === 9 && cnA.ex.closed === 9 && cnA.cart === 'cnCartOk' && cnA.desk === 'cnDeskOk' && cnA.exam === 'cnExam', cnA);
    check('Quiet Thread (manager): the firm’s status report shows svc-print listing the Facilities share (cn-folders, T1083), not in the alert mix, not evicted', cnA.clue && cnA.tech === 'T1083' && cnA.qt && cnA.inAlerts === 0 && !cnA.evicted, cnA);
    check('Clinic summary: “Next: Fire & EMS Dispatch”, with its door; series records the Clinic; the shared exam login named as an accepted open risk; the objective moves to Dispatch', /Next: Fire (&amp;|&) EMS Dispatch\. Its door is on the north side of the square/.test(cnSum) && /Open risk/.test(cnSum) && /shared login/.test(cnSum) && !cnA.obj.done && cnA.obj.map === 'dispatch' && /Fire & EMS Dispatch/.test(cnA.obj.text) && cnA.ser.clinic === true && cnA.ser.school === true, cnA.obj);
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
      // Review of slice 3: what left is "likely" in the DFIR boss's answer too; Friday's CLN-01 says what the archive held
      // (S6) and whether the attacker is anywhere else, with an honest unknown (S4); the original email is evidence (S5).
      const c1 = id => CN_REPORT_1.claims.find(c => c.id === id) || {};
      out.likely2 = /^Likely/.test(db.s2.resp.find(r => r.good).label) && /likely/i.test(CN_BOARD_SPECS_DFIR()[0].resp.find(r => r.good).label);
      out.cln1 = c1('contents').truth === 'confirmed' && /5,210/.test(c1('contents').text) && c1('foothold').truth === 'confirmed' && c1('saved').truth === 'unknown' && c1('way').evidence.some(e => /^C-09/.test(e));
      // HHS appears only in the Field Manual, in its own words, with the clinic's status left to counsel and the privacy officer.
      out.hhs = /The presence of ransomware \(or any malware\) on a covered entity’s or business associate’s computer systems is a security incident under the HIPAA Security Rule\./.test(FACTS.cnhipaa.desc) && /The game says neither/.test(FACTS.cnhipaa.desc) && !/within \d+ (days|hours)/.test(JSON.stringify(CN_DRILLS) + all.join(' '));
      // The vendor's remote-support drill tags T1219 as the explanation ruled out.
      out.t1219 = CN_DRILLS.tethermgr.techs[0] === 'T1219' && /ruled out/.test(CN_DRILLS.tethermgr.path) && /ruled out/.test(CN_DRILLS.tetherdfir.path);
      return out; });
    check('Clinic rules on the text: one decider for patient privacy (Weller), payment (the Board), operations (Marisol); memory before shutdown; over- and under-reaction distractors; counts include inactive records; what left is “likely”; HHS only in its own words; T1219 ruled out', Object.values(rules).every(Boolean), rules);
    await A.pickLabel(/^Keep exploring/); await A.settle();
    // ---- Fire & EMS Dispatch (slice 4), manager track ----
    const ddoor = await A.page.evaluate(() => { const keep = G.f.cnPulse; G.f.cnPulse = false; const d = MAPS.csquare.doors['15,0'], shut = d.locked; G.f.cnPulse = keep; return { shut, open: !d.locked, to: d.to }; });
    check('Dispatch: the square’s north door is locked without the Pulse Badge and opens with it', /Pulse Badge/.test(ddoor.shut || '') && ddoor.open && ddoor.to === 'dispatch', ddoor);
    await A.follow(p => p.f.dpMet && !p.ui && !p.busy, []);
    const darr = await A.page.evaluate(() => ({ day: G.day, act: G.cr.dp.activate, act2: G.cr.activate, hud: hudStatus(), obj: objective().text, n15: G.cr.dp.n15 }));
    check('Dispatch arrival: Day 16 (Tuesday); an admin sign-in nobody can explain meets the Dispatch annex; the retainer called in 15 game minutes; Night 15 filled between rotas; next, the night’s handover with Petra', darr.day === 16 && darr.act === 15 && darr.act2 === 15 && /Dispatch/.test(darr.hud) && /Petra/.test(darr.obj) && darr.n15 && 'n15' in darr.n15, darr);
    // Drill A read with one of its two `needs` sources: unsupported.
    await A.goTo('dispatch', 26, 3);
    await A.settle([], /Investigation drill/); await A.pickLabel(/^Start investigating$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: MQ-01’s own metrics/);
    await A.settle([], /Which question/); await A.pickLabel(/Where is the time lost/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: The crews’ complaints/);
    await A.settle([], /Which question/); await A.pickLabel(/How many, and how angry/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/I have enough|Budget spent/);
    await A.settle([], /^Verdict/); await A.pickLabel(/^Not an attack: a failing building link/);
    await A.settle([], /^Reasoning/); await A.pickLabel(/^MDG-01’s messages arrive late/);
    await A.settle([], /Debrief/);
    const debDA = await A.modalText();
    check('Dispatch manager drill A: the right verdict from the queue’s records alone is unsupported (the link’s counters are also needed)', /Unsupported/.test(debDA) && /two records/.test(debDA), debDA.slice(0, 300));
    await A.settle();
    const srD = await A.saveReload();
    check('save/reload mid-Dispatch (manager) restores the state; the export code round-trips', srD.same && srD.roundTrip && srD.before.map === 'dispatch', srD);
    await A.follow(p => p.f.dpRota, []);
    const drt = await A.page.evaluate(() => ({ B: G.cr.drills.adminmgr, rota: G.cr.dp.rota, n15: G.cr.dp.n15, rack: tileDef('dispatch', 21, 1).pal, link: tileDef('dispatch', 27, 1).pal, carry: DP_ROTA.carry, first: DP_ROTA.first, calls: Object.keys(DP_ROTA.calls).length }));
    check('Dispatch manager: drill B (the 03:20 sign-in: staff) right and supported; the vendor account blocked (tick) and the link fixed (tick); the week-3 rota carries Nights 14 and 15 and shows no forecast calls', drt.B.verdictOk && drt.B.supported && drt.rack === 'dpRackOk' && drt.link === 'dpLinkOk' && drt.first === 14 && drt.carry === 2 && drt.calls === 0 && drt.rota.assign[0] === drt.n15.n14 && drt.rota.assign[1] === drt.n15.n15 && drt.rota.assign.length === 9, drt);
    await A.follow(p => p.f.dpBackup, []);
    const dcd = await A.page.evaluate(() => ({ ex: G.cr.ex, pack: G.cr.dp.pack, day: G.day }));
    check('Dispatch manager: the cards drill on Wednesday (Day 17) adds an exercise and three actions; the backup center gets four right things', dcd.day === 17 && dcd.ex.run === 4 && dcd.ex.actions === 12 && dcd.pack.wrong === 0, dcd);
    await A.follow(p => p.f.dpBoss, []);
    const dboss = await A.page.evaluate(() => ({ day: G.day, boss: G.cr.dp.boss, cover: G.cr.dp.cover, m: metricVals(), lead: dpLead(18), tired: dpTired(18), cards: tileDef('dispatch', 19, 6).pal, ex: G.cr.ex }));
    check('Dispatch boss on Day 18 (Thursday): all three stages right first time; the floor’s measures (87 s on cards, 100% answered) on the scorecard; the 24-hour plan: shifts, 0 gaps, 22 of 30 h (25 if a weak Night 18 was swapped); the cards actions closed Wednesday 17:00 (tick)', dboss.day === 18 && dboss.boss.ok && dboss.boss.w1 === 0 && dboss.m.crDispatch === 87 && dboss.m.crAnswered === 100 && dboss.cover.k === 'shifts' && dboss.cover.gaps === 0 && dboss.cover.overtime === (dboss.cover.n18 === 'swap' ? 25 : 22) && dboss.cards === 'dpCardsOk' && dboss.ex.closed === 12, dboss);
    await A.follow(() => false, [], /End of Fire & EMS Dispatch/);
    const dpA = await A.page.evaluate(() => ({ relay: G.f.dpRelay, clue: qtFound('dp-conns'), tech: QT_CLUES['dp-conns'].tech, qt: !!QT_TECH.T1049, inAlerts: Object.keys(THREATS).length, evicted: Series.qt().evicted, obj: objective(), ser: crSeries(), aar: G.cr.aar, day: G.day, drillC: G.cr.drills.switchmgr, impact: G.cr.dp.aar, m: metricVals(), n18: G.cr.dp.night18, cover: G.cr.dp.cover }));
    const dpSum = await A.modalText();
    check('Dispatch Board cleared: the Relay Badge; Day 19 (Friday); drill C (the chief wants CAD back) right and supported', dpA.relay === true && dpA.day === 19 && dpA.drillC.verdictOk && dpA.drillC.supported, dpA);
    check('Dispatch manager: the AAR adds three actions (owners arrive approved), the impact as measured, first time; Night 18’s call-out added to the plan’s overtime', dpA.aar.total === 9 && dpA.aar.onTime === 9 && dpA.impact.impactFirst === true && dpA.cover.overtime === (dpA.cover.n18 === 'swap' ? 25 : 22) + dpA.n18.overtime, dpA);
    check('Quiet Thread (manager): the firm’s status report shows svc-print listing the dispatch collector’s connections (dp-conns, T1049), not in the alert mix, not evicted', dpA.clue && dpA.tech === 'T1049' && dpA.qt && dpA.inAlerts === 0 && !dpA.evicted, dpA);
    check('Dispatch summary: “Next: the Regional Airport”, with its door; the measured times; series records Dispatch; the collector named as an open risk; the objective moves to the Airport', /Next: the Regional Airport\. Its door is on the south side of the square/.test(dpSum) && /87 s/.test(dpSum) && /Open risk/.test(dpSum) && /DP-LOG-01/.test(dpSum) && !dpA.obj.done && dpA.obj.map === 'airport' && /Regional Airport/.test(dpA.obj.text) && dpA.ser.dispatch === true && dpA.ser.clinic === true, dpA.obj);
    const dbr = await A.page.evaluate(() => {
      const keep = G.cr.dp.boss, out = {};
      const tk = G.trackId;
      try { G.cr.dp.boss = { first: [], w1: 2, done: true }; out.w1 = dpCardsMedian() === 99 && metricVals().crDispatch === 99 && /99 s/.test(dpReport2().claims.find(c => c.id === 'time').text);
        G.trackId = 'dfir'; out.dfirFixed = dpCardsMedian() === 87; } finally { G.cr.dp.boss = keep; G.trackId = tk; }
      return out; });
    check('Dispatch: each false start in the manager’s first boss stage costs the floor 6 s on cards, and the measured numbers follow it; the DFIR seat’s choices don’t move it (game)', dbr.w1 && dbr.dfirFixed, dbr);
    // The slice's rules, checked on the text: life safety, one decider per decision, preservation that never slows the floor, honest wording.
    const drules = await A.page.evaluate(() => {
      const out = {}, goods = [], all = [];
      const add = (arr) => arr.forEach(o => { all.push(o.label); if (o.good) goods.push(o.label); });
      [DP_ACTIVATE, DP_DRILL_OBJ, DP_COVER, DP_DIRECTIVE.manager, DP_DIRECTIVE.dfir, DP_LETTER, DP_PRESERVE, DP_STORES, DP_SWITCH_DFIR].forEach(add);
      DP_DRILL_INJECTS.forEach(i => add(i.opts)); DP_BOARD_SPECS_MGR().concat(DP_BOARD_SPECS_DFIR()).forEach(b => add(b.resp));
      const mb = dpMgrBossStages(), db = dpDfirBossStages(); [mb.s1, mb.s2, db.s1, db.s2].forEach(st => add(st.resp));
      // Life safety: over-reaction (CAD offline mid-shift, CAD-01 shut down) and under-reaction (keep running a failing CAD) both graded wrong.
      out.overUnder = DP_ACTIVATE.some(o => !o.good && /take CAD offline/.test(o.label)) && mb.s1.resp.some(r => !r.good && /Shut CAD-01 down/.test(r.label)) && mb.s1.resp.some(r => !r.good && /Keep the floor on CAD/.test(r.label)) && DP_DRILL_OBJ.some(o => !o.good && /whole floor goes off CAD/.test(o.label));
      // The floor's switch to cards and back is the supervisor's; the chief decides response policy, not the switch.
      out.floor = /Imogen/.test(DP_DRILL_INJECTS[0].opts.find(o => o.good).label) && /Imogen/.test(DP_DRILL_INJECTS[2].opts.find(o => o.good).label) && /Imogen decides the time, not the chief/.test(DP_DRILLS.switchmgr.verdicts.find(v => v.good).label) && DP_DRILL_INJECTS[2].opts.some(o => !o.good && /The chief decides/.test(o.label));
      // Patient care: the medical protocol is unchanged on paper; changing it is medical direction's.
      out.care = /ambulance from the run card at once, then the same protocol/.test(DP_DRILL_INJECTS[1].opts.find(o => o.good).label) && DP_DRILL_INJECTS[1].opts.some(o => !o.good && /only then send the ambulance/.test(o.label)) && DP_DRILL_INJECTS[1].opts.some(o => !o.good && /Skip the instructions/.test(o.label));
      // Preservation never slows the floor: collection from the standby, never CAD-01 offline for a copy.
      out.preserve = /doesn’t serve the positions/.test(DP_PRESERVE.find(o => o.good).label) && DP_PRESERVE.some(o => !o.good && /offline/.test(o.label)) && db.s1.resp.some(r => !r.good && /Shut CAD-01 down/.test(r.label));
      // The vendor's account: our records as confirmed, who used it unknown, never "the vendor lied".
      const r1 = id => DP_REPORT_1.claims.find(c => c.id === id) || {};
      out.vendor = r1('session').truth === 'confirmed' && r1('who').truth === 'unknown' && r1('network').truth === 'likely' && r1('what').truth === 'unknown' && !goods.some(g => /statement is false/.test(g));
      // Response impact stated only as measured; harm unknown.
      const r2 = id => dpReport2().claims.find(c => c.id === id) || {};
      out.measured = r2('time').truth === 'confirmed' && /against 64 s/.test(r2('time').text) && r2('harm').truth === 'unknown' && r1('time').truth === 'confirmed' && !goods.some(g => /doubled/.test(g));
      // Reporting is the 911 authority's with counsel; the FCC page only in its own words; nothing about NFPA.
      out.reporting = /The game says neither/.test(FACTS.dpfcc.desc) && /must swiftly notify the Commission/.test(FACTS.dpfcc.desc) && !/NFPA/.test(JSON.stringify(FACTS) + JSON.stringify(EXTRA_ACTIONS) + all.join(' '));
      // Containment never waits for evidence: the vendor account is blocked as soon as the session is seen.
      out.block = /block it at once, clearing nothing/.test(EXTRA_ACTIONS.dpvendor.desc);
      // The way back never re-enables the blocked vendor account, and the check rests on evidence taken after its session (B3).
      const n18 = dpNight18.toString(), firm = DP_DRILLS.switchmgr.sources.find(s => s.id === 'firm').qs[0].res.join(' ');
      out.wayBack = /one-time account/.test(n18) && /sm-support stays blocked/.test(n18) && !/sm-support enabled/.test(n18) && /23:50/.test(n18) && /after the vendor session/.test(firm) && /23:50/.test(firm) && /night supervisor keeps the floor/.test(n18);
      // The drill is a shadow position, and its times are drill times (B2); the link cut waits for the supervisor (S6).
      out.shadow = /shadows every live call/.test(DP_DRILL_OBJ.find(o => o.good).label) && !/never slows a caller/.test(JSON.stringify(EXTRA_ACTIONS) + all.join(' ')) && /when she agrees/.test(mb.s1.resp.find(r => r.good).label);
      out.t1078 = DP_DRILLS.adminmgr.techs[0] === 'T1078' && /ruled out/.test(DP_DRILLS.adminmgr.path) && DP_DRILLS.vendordfir.techs[0] === 'T1133' && /can’t yet answer/.test(DP_DRILLS.vendordfir.path);
      return out; });
    check('Dispatch rules on the text: over- and under-reaction both wrong; the supervisor decides the floor, the chief response policy, medical direction the protocol; collection never slows the floor; the vendor account written honestly; impact only as measured; reporting left to the 911 authority with counsel; no NFPA text; T1078 ruled out, T1133 open', Object.values(drules).every(Boolean), drules);
    await A.pickLabel(/^Keep exploring/); await A.settle();
    // ---- Regional Airport (slice 5), manager track ----
    const adoor = await A.page.evaluate(() => { const keep = G.f.dpRelay; G.f.dpRelay = false; const d = MAPS.csquare.doors['15,10'], shut = d.locked; G.f.dpRelay = keep; return { shut, open: !d.locked, to: d.to }; });
    check('Airport: the square’s south door beside the Library’s is locked without the Relay Badge and opens with it', /Relay Badge/.test(adoor.shut || '') && adoor.open && adoor.to === 'airport', adoor);
    await A.follow(p => p.f.apMet && !p.ui && !p.busy, []);
    const aarr = await A.page.evaluate(() => ({ day: G.day, act: G.cr.ap.activate, hud: hudStatus(), obj: objective().text, bill: tileDef('airport', 27, 1).pal }));
    check('Airport arrival: Day 23 (Tuesday); the annex not met (the vendor confirmed the 02:40 session on the contract’s number); no retainer call; next, the email with Odette', aarr.day === 23 && aarr.act === null && /Airport/.test(aarr.hud) && /Odette/.test(aarr.obj) && aarr.bill === 'apBill', aarr);
    // Drill A read with one of its two `needs` sources: unsupported.
    await A.goTo('airport', 24, 2);
    await A.settle([], /Investigation drill/); await A.pickLabel(/^Start investigating$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: The airport’s message trace/);
    await A.settle([], /Which question/); await A.pickLabel(/Did any airport mailbox send it/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/^Query: The deadline/);
    await A.settle([], /Which question/); await A.pickLabel(/How urgent is it/);
    await A.settle([], /^Result/); await A.pickLabel(/^Back to the investigation$/);
    await A.settle([], /Budget left/); await A.pickLabel(/I have enough|Budget spent/);
    await A.settle([], /^Verdict/); await A.pickLabel(/^Not ours: an impersonation/);
    await A.settle([], /^Reasoning/); await A.pickLabel(/^We sent nothing to tenants/);
    await A.settle([], /Debrief/);
    const debAA = await A.modalText();
    check('Airport manager drill A: the right verdict from the trace and headers alone is unsupported (the business office on a known number is also needed); T1657 tagged', /Unsupported/.test(debAA) && /two records/.test(debAA) && /T1657/.test(debAA), debAA.slice(0, 300));
    await A.settle();
    const srAp = await A.saveReload();
    check('save/reload mid-Airport (manager) restores the state; the export code round-trips', srAp.same && srAp.roundTrip && srAp.before.map === 'airport', srAp);
    await A.follow(p => p.f.apRota, []);
    const art = await A.page.evaluate(() => ({ B: G.cr.drills.vendmgr, owners: G.cr.ap.owners, rota: G.cr.ap.rota, pre: apPre(), bill: tileDef('airport', 27, 1).pal, first: AP_ROTA.first, carry: AP_ROTA.carry, calls: Object.keys(AP_ROTA.calls).length }));
    check('Airport manager: drill B (the 02:40 sign-in: the vendor’s scheduled work) right and supported; vendor support on demand (tick); who owns what, no wrong card; the week-4 rota carries Nights 21 and 22 from week 3 and shows no forecast calls', art.B.verdictOk && art.B.supported && art.bill === 'apBillOk' && art.owners.wrong === 0 && art.first === 21 && art.carry === 2 && art.calls === 0 && art.rota.assign[0] === art.pre[0] && art.rota.assign[1] === art.pre[1] && art.rota.assign.length === 9, art);
    await A.follow(p => p.f.apTabletop, []);
    const att = await A.page.evaluate(() => ({ ex: G.cr.ex, day: G.day }));
    check('Airport manager: the tabletop with the airport manager on Wednesday (Day 24) adds an exercise and three actions', att.day === 24 && att.ex.run === 5 && att.ex.actions === 15, att);
    await A.follow(p => p.f.apBoss, []);
    const aboss = await A.page.evaluate(() => ({ day: G.day, boss: G.cr.ap.boss, cover: G.cr.ap.cover, act: G.cr.ap.activate, act2: G.cr.activate, desk: tileDef('airport', 11, 2).pal, patch: tileDef('airport', 14, 10).pal, ex: G.cr.ex, m: metricVals() }));
    const wk = aboss.cover && aboss.cover.n27 === 'swap' ? 23 : 20;
    check('Airport boss on Day 27 (Saturday): the annex met as written (ransomware on the office network), the retainer called in 15 game minutes; all three stages right first time; the weekend plan: shifts, 0 gaps, 20 of 30 h (23 if a weak Night 27 was swapped); the tabletop’s actions closed by Friday (the front desk and the tenant panel tick)', aboss.day === 27 && aboss.boss.ok && aboss.act === 15 && aboss.act2 === 15 && aboss.cover.k === 'shifts' && aboss.cover.gaps === 0 && aboss.cover.overtime === wk && aboss.m.crBudget === Math.round((wk - 30) / 30 * 100) && aboss.desk === 'apDeskOk' && aboss.patch === 'apPatchOk' && aboss.ex.closed === 15, aboss);
    await A.follow(() => false, [], /End of the Regional Airport/);
    const apA = await A.page.evaluate(() => ({ windsock: G.f.apWindsock, clue: qtFound('ap-accounts'), tech: QT_CLUES['ap-accounts'].tech, qt: !!QT_TECH.T1087, inAlerts: Object.keys(THREATS).length, evicted: Series.qt().evicted, obj: objective(), ser: crSeries(), aar: G.cr.aar, day: G.day, C: G.cr.drills.tenantmgr, impact: G.cr.ap.aar, n27: G.cr.ap.night27, cover: G.cr.ap.cover, badges: EDITION.badgeFlags }));
    const apSum = await A.modalText();
    check('Airport Board cleared: the Windsock Badge (in the edition’s badge flags); Day 29 (Monday); drill C (the tenant’s PC) right and supported', apA.windsock === true && apA.badges.includes('apWindsock') && apA.day === 29 && apA.C.verdictOk && apA.C.supported, apA);
    check('Airport manager: the AAR adds three actions (owners arrive approved), the impact as counted, first time; Night 27’s call-out added to the weekend plan’s overtime', apA.aar.total === 12 && apA.aar.onTime === 12 && apA.impact.impactFirst === true && apA.cover.overtime === (apA.cover.n27 === 'swap' ? 23 : 20) + apA.n27.overtime, apA);
    check('Quiet Thread (manager): the firm’s status report shows svc-print listing the airport directory’s accounts (ap-accounts, T1087), not in the alert mix, not evicted', apA.clue && apA.tech === 'T1087' && apA.qt && apA.inAlerts === 0 && !apA.evicted, apA);
    check('Airport summary: “Next: the Compact-wide incident”; series records the Airport; the directory trust named as an open risk; the objective done', /Next: the Compact-wide incident/.test(apSum) && /Open risk/.test(apSum) && /trusts the town’s/.test(apSum) && apA.obj.done && /Compact-wide incident/.test(apA.obj.text) && apA.ser.airport === true && apA.ser.dispatch === true, apA.obj);
    // The slice's rules, checked on the text: business IT only, one decider per decision, restore only from a checked copy, honest wording.
    const arules = await A.page.evaluate(() => {
      const out = {}, goods = [], all = [];
      const add = (arr) => arr.forEach(o => { all.push(o.label); if (o.good) goods.push(o.label); });
      [AP_ACTIVATE, AP_TT_OBJ, AP_COVER, AP_IMPACT, AP_DIRECTIVE.manager, AP_DIRECTIVE.dfir, AP_LETTER, AP_TAKE, AP_STORES, AP_SWITCH_DFIR].forEach(add);
      AP_TT_INJECTS.forEach(i => add(i.opts)); AP_BOARD_SPECS_MGR().concat(AP_BOARD_SPECS_DFIR()).forEach(b => add(b.resp));
      const mb = apMgrBossStages(), db = apDfirBossStages(); [mb.s1, mb.s2, db.s1, db.s2].forEach(st => add(st.resp));
      // Over-reaction (shut the terminal, shut every host down) and under-reaction (wait for Monday) both graded wrong.
      out.overUnder = AP_ACTIVATE.some(o => !o.good && /shut the terminal/.test(o.label)) && mb.s1.resp.some(r => !r.good && /shut each office PC/i.test(r.label)) && mb.s1.resp.some(r => !r.good && /Hold off for Joanna and Odette on Monday/.test(r.label)) && AP_TT_INJECTS[1].opts.some(o => !o.good && /airport is shut/.test(o.label));
      // One decider: the manager on duty runs the terminal, the airport manager its network, Ansel what tenants are told, the Board any payment.
      out.deciders = /Callum/.test(mb.s1.resp.find(r => r.good).label) && /Callum’s to decide today/.test(AP_DRILLS.tenantmgr.verdicts.find(v => v.good).label) && !/Joanna/.test(AP_DRILLS.tenantmgr.verdicts.find(v => v.good).label) && /^Callum, on duty/.test(AP_DRILLS.tenantmgr.response[0]) && !/Joanna (keeps|asks)|rang Joanna|rings Joanna/.test(apNight27.toString() + apDrillC.toString()) && /Ansel decides what tenants are told/.test(AP_BOARD_SPECS_DFIR()[2].resp.find(r => r.good).label) && /The Board decides/.test(AP_BOARD_SPECS_MGR()[1].resp.find(r => r.good).label) && AP_TT_INJECTS[0].opts.some(o => !o.good && /You decide it/.test(o.label));
      // Pilots decide about their own flights; nobody promises safety.
      out.pilots = /pilots’ call/.test(AP_TT_INJECTS[1].opts.find(o => o.good).label) && !goods.some(g => /\bsafe\b/i.test(g));
      // Restore only from a copy checked in isolation; the rebuild keeps pw-support disabled; the check comes after the vendor's session.
      const n27 = apNight27.toString(), n28 = apNight28.toString();
      out.restore = db.s1.resp.some(r => !r.good && /Restore Plinthwise from the nightly copy/.test(r.label)) && /in isolation/.test(n27 + n28) && /one-time account/.test(n27) && /pw-support stays disabled/.test(n27) && /after the session/.test(n28) && /13:10/.test(n28) && /review of AP-DC-01/.test(n28) && n28.indexOf('review of AP-DC-01') < n28.indexOf('10:30 restored') && n28.indexOf('resets the password of every admin and service account') < n28.indexOf('10:30 restored') && /directory it rejoins/.test(EXTRA_ACTIONS.apcopy.desc) && /in the directory/.test(AP_SWITCH_DFIR.find(o => o.good).label);
      // Tenant records: likely, never confirmed; MS-PC-01, the way in and publication unknown.
      const r2 = id => AP_REPORT_2.claims.find(c => c.id === id) || {};
      out.likely = r2('left').truth === 'likely' && r2('pub').truth === 'unknown' && r2('mspc').truth === 'unknown' && r2('way').truth === 'unknown' && /between 04:00 and 08:00/.test(r2('dc').text) && /likely/i.test(mb.s2.resp.find(r => r.good).label) && !goods.some(g => /confirmed stolen/.test(g));
      // Scope: the airport's business and office IT only, with the one game line; no TSA, no depiction of access control, fuel or Wi-Fi.
      const txt = JSON.stringify(AP_DRILLS) + JSON.stringify(AP_REPORT_1) + JSON.stringify(AP_REPORT_2) + all.join(' ') + apArrive.toString() + apBoss.toString() + JSON.stringify(FACTS.apnotam) + JSON.stringify(FACTS.apcisa) + JSON.stringify(FACTS.apacrp);
      out.scope = /Access control and fuelling are separate systems, and they aren’t part of this/.test(apArrive.toString()) && !/\bTSA\b|Wi-?Fi|badge reader|fuel farm|runway|gate log/i.test(txt);
      // Real facts only in their own words.
      out.facts = /A NOTAM is a notice containing information essential to personnel concerned with flight operations/.test(FACTS.apnotam.desc) && /Aviation includes aircraft, air traffic control systems, and about 19,700 airports, heliports, and landing strips\./.test(FACTS.apcisa.desc) && /ACRP Report 140, Guidebook on Best Practices for Airport Cybersecurity \(2015\)/.test(FACTS.apacrp.desc);
      out.techs = AP_DRILLS.mailmgr.techs[0] === 'T1657' && AP_DRILLS.vendmgr.techs[0] === 'T1133' && /ruled out/.test(AP_DRILLS.vendmgr.path) && AP_DRILLS.lastdfir.techs[0] === 'T1133' && /can’t yet answer/.test(AP_DRILLS.lastdfir.path) && !Object.values(THREATS).some(t => t.tech === 'T1087');
      return out; });
    check('Airport rules on the text: over- and under-reaction both wrong; the manager on duty runs the terminal, the airport manager decides the network, counsel what tenants are told, the Board any payment; pilots decide their flights; restore only from a checked copy, after the vendor’s session, pw-support kept disabled; tenant records likely, never confirmed; business and office IT only; facts in their own words; T1657, T1133 ruled out and open', Object.values(arules).every(Boolean), arules);
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
      await B.settle([], /Finding \d+ of \d+/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = SD_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'accessed' ? 'Likely' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      const said = await B.settle([], /./);
      if (cl && cl.id === 'accessed') unkWhy = said && said.ui && said.ui.text || '';
      await B.settle([], n < nSch1 ? /Finding \d+ of \d+/ : /Report filed/);
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
      await B.settle([], /Finding \d+ of \d+/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = CN_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'left' ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < nCln1 ? /Finding \d+ of \d+/ : /Report filed/);
    }
    const filedC = await B.page.innerHTML('#modal');
    await B.settle();
    check('CLN-01: what left goes out as “Likely” (the overclaim corrected before filing and counted); the sender as “Unknown”', /Likely:<\/b> The archive of the front desk’s daily lists/.test(filedC) && /Unknown:<\/b> Who sent the email/.test(filedC) && /corrected in review/.test(filedC) && await B.page.evaluate(() => G.cr.reports.cn1.over === 1), filedC.slice(0, 400));
    await B.follow(() => false, [], /End of the Community Clinic/);
    const cnB = await B.page.evaluate(() => ({ cu: G.cr.custody, r2: G.cr.reports.cn2, pulse: G.f.cnPulse, needs: G.cr.needs, obj: objective(), ser: crSeries(), corrected: G.cr.corrected }));
    check('DFIR Clinic: CLN-02 filed, 35 custody items (Library 10 + district 12 + Clinic 13, the original email included), Pulse Badge, summary “Next: Fire & EMS Dispatch”', cnB.cu.items === 35 && !!cnB.r2 && cnB.pulse && !cnB.obj.done && cnB.obj.map === 'dispatch' && cnB.ser.clinic === true && /Next: Fire/.test(await B.modalText()), cnB);
    check('CLN-02: the archive held 5,210 patients, 1,180 of them inactive (confirmed); what left is likely; publication and anything beyond the archive unknown', await B.page.evaluate(() => { const c = id => CN_REPORT_2.claims.find(x => x.id === id); return c('archive').truth === 'confirmed' && /1,180/.test(c('archive').text) && c('left').truth === 'likely' && c('pub').truth === 'unknown' && c('more').truth === 'unknown'; }));
    await B.pickLabel(/^Keep exploring/); await B.settle();
    // ---- Fire & EMS Dispatch (slice 4), DFIR track ----
    await B.follow(p => p.f.dpPreserve, []);
    check('Dispatch DFIR: the letter first, then collection that doesn’t touch a position (Day 16, Tuesday)', await B.page.evaluate(() => G.f.dpLetter && G.f.dpPreserve && G.day === 16 && /doesn’t serve the positions/.test(DP_PRESERVE.find(o => o.good).label)));
    const cu0 = await B.page.evaluate(() => JSON.parse(JSON.stringify(G.cr.custody)));
    await B.follow(p => p.f.dpIntake, []);
    const cuD = await B.page.evaluate(() => ({ cu: G.cr.custody, req: G.cr.dp.requests, clue: qtFound('dp-conns'), rack: tileDef('dispatch', 21, 1).pal }));
    check('Dispatch DFIR intake: six items and CAD-01’s EDR for Night 14 (D-07), all complete (the export by the account owner in question gets a second export, compared); the vendor request logged with its date as it went; the vendor account blocked', cuD.cu.items === cu0.items + 7 && cuD.cu.complete === cu0.complete + 7 && cuD.cu.gaps === cu0.gaps && cuD.req && cuD.req.date === 'Day 16 (Tuesday) 10:30' && cuD.rack === 'dpRackOk', { now: cuD, before: cu0 });
    check('Quiet Thread (DFIR): seen in D-06, the collector’s own log (dp-conns, T1049)', cuD.clue && await B.page.evaluate(() => QT_CLUES['dp-conns'].tech === 'T1049' && !!QT_TECH.T1049));
    // Drill A with one of its two needed sources and the supporting one: unsupported.
    await B.goTo('dispatch', 20, 11);
    await B.settle([], /Investigation drill/); await B.pickLabel(/^Start investigating$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: D-04/);
    await B.settle([], /Which question/); await B.pickLabel(/Where is the time lost/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: D-02/);
    await B.settle([], /Which question/); await B.pickLabel(/Anything new talking to MQ-01/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/I have enough|Budget spent/);
    await B.settle([], /^Verdict/); await B.pickLabel(/^Not an attack: a failing link, as D-04/);
    await B.settle([], /^Reasoning/); await B.pickLabel(/^D-04: the delay before the queue/);
    await B.settle([], /Debrief/);
    const debDB = await B.modalText();
    check('Dispatch DFIR drill A: two decisive sources; D-04 and the supporting D-02 without D-05 is unsupported', /Unsupported/.test(debDB) && /two sources/.test(debDB), debDB.slice(0, 300));
    await B.settle();
    const srDB = await B.saveReload();
    check('save/reload mid-Dispatch (DFIR) restores the state; the export code round-trips', srDB.same && srDB.roundTrip && srDB.before.track === 'dfir' && srDB.before.map === 'dispatch', srDB);
    await B.follow(p => p.f.dpDrillC, []);
    check('Dispatch DFIR drills B (the 03:20 sign-in) and C (the vendor’s account, worded honestly) right and supported', await B.page.evaluate(() => G.cr.drills.admindfir.verdictOk && G.cr.drills.admindfir.supported && G.cr.drills.vendordfir.verdictOk && G.cr.drills.vendordfir.supported));
    // DSP-01: write "network" (likely) as confirmed: an overclaim, corrected and counted.
    await B.goTo('dispatch', 20, 11);
    await B.settle([], /Report · /); await B.pickLabel(/^Start writing$/);
    const nDsp1 = await B.page.evaluate(() => DP_REPORT_1.claims.length);
    for (let n = 1; n <= nDsp1; n++) {
      await B.settle([], /Finding \d+ of \d+/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = DP_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'network' ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < nDsp1 ? /Finding \d+ of \d+/ : /Report filed/);
    }
    const filedD = await B.page.innerHTML('#modal');
    await B.settle();
    check('DSP-01: the session through Stillmark’s network goes out as “Likely” (the overclaim corrected and counted); who used the account as “Unknown”; the lag’s measured times as “Confirmed”', /Likely:<\/b> That session came through Stillmark’s own support network/.test(filedD) && /Unknown:<\/b> Who used sm-support that night/.test(filedD) && /Confirmed:<\/b> During the lag, answer-to-dispatch/.test(filedD) && /corrected in review/.test(filedD) && await B.page.evaluate(() => G.cr.reports.dp1.over === 1), filedD.slice(0, 400));
    await B.follow(() => false, [], /End of Fire & EMS Dispatch/);
    const dpB = await B.page.evaluate(() => ({ cu: G.cr.custody, r2: G.cr.reports.dp2, relay: G.f.dpRelay, obj: objective(), ser: crSeries(), corrected: G.cr.corrected, sw: G.f.dpSwitch, stores: G.f.dpStores, m: metricVals(), day: G.day }));
    check('DFIR Dispatch: DSP-02 filed, 53 custody items (35 + Dispatch 18), the chief’s question answered, separate stores, Relay Badge, the dispatch measures on the scorecard, summary “Next: the Regional Airport”', dpB.cu.items === 53 && !!dpB.r2 && dpB.sw && dpB.stores && dpB.relay && !dpB.obj.done && dpB.obj.map === 'airport' && dpB.ser.dispatch === true && dpB.day === 19 && dpB.m.crDispatch === 87 && dpB.m.crAnswered === 100 && /Next: the Regional Airport/.test(await B.modalText()), dpB);
    check('DSP-02: no file on CAD encrypted (confirmed); cut off from the county’s directory (confirmed); nothing left on CAD-01 (likely); the response impact as measured; harm unknown', await B.page.evaluate(() => { const c = id => dpReport2().claims.find(x => x.id === id); return c('enc').truth === 'confirmed' && /between 13:00 and 15:00/.test(c('enc').text) && c('enc').evidence.length === 3 && c('cut').truth === 'confirmed' && c('clean').truth === 'likely' && c('time').truth === 'confirmed' && /87 s/.test(c('time').text) && /Oxlow’s answer times/.test(c('time').evidence[0]) && c('harm').truth === 'unknown' && c('link').truth === 'unknown'; }));
    await B.pickLabel(/^Keep exploring/); await B.settle();
    // ---- Regional Airport (slice 5), DFIR track ----
    await B.follow(p => p.f.apTake, []);
    check('Airport DFIR: the letter first, then what the firm may take: the airport’s own records and a tenant’s copy only as it is given (Day 23, Tuesday)', await B.page.evaluate(() => G.f.apLetter && G.f.apTake && G.day === 23 && /only as Imre gives it/.test(AP_TAKE.find(o => o.good).label)));
    const cuA0 = await B.page.evaluate(() => JSON.parse(JSON.stringify(G.cr.custody)));
    await B.follow(p => p.f.apIntake, []);
    const cuA = await B.page.evaluate(() => ({ cu: G.cr.custody, req: G.cr.ap.requests, clue: qtFound('ap-accounts'), bill: tileDef('airport', 27, 1).pal, a02: AP_INTAKE.a02.opts.find(o => o.good).label }));
    check('Airport DFIR intake: six items, then A-07 and A-08, all complete; the tenant’s copy logged as the tenant’s, with its consent’s limit; the vendor request logged with its date as it went; vendor support on demand', cuA.cu.items === cuA0.items + 8 && cuA.cu.complete === cuA0.complete + 8 && cuA.cu.gaps === cuA0.gaps && cuA.req && cuA.req.date === 'Day 23 (Tuesday) 11:15' && cuA.bill === 'apBillOk' && /flight school’s, with its consent/.test(cuA.a02), { now: cuA, before: cuA0 });
    check('Quiet Thread (DFIR): seen in A-06, the directory’s query log (ap-accounts, T1087)', cuA.clue && await B.page.evaluate(() => QT_CLUES['ap-accounts'].tech === 'T1087' && !!QT_TECH.T1087));
    // Drill A with one of its two needed sources and the supporting one: unsupported.
    await B.goTo('airport', 22, 11);
    await B.settle([], /Investigation drill/); await B.pickLabel(/^Start investigating$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: A-01/);
    await B.settle([], /Which question/); await B.pickLabel(/Did any airport mailbox send a message/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/^Query: A-04/);
    await B.settle([], /Which question/); await B.pickLabel(/Did the invoice account change/);
    await B.settle([], /^Result/); await B.pickLabel(/^Back to the investigation$/);
    await B.settle([], /Budget left/); await B.pickLabel(/I have enough|Budget spent/);
    await B.settle([], /^Verdict/); await B.pickLabel(/^No: an impersonation/);
    await B.settle([], /^Reasoning/); await B.pickLabel(/^A-01: we sent nothing/);
    await B.settle([], /Debrief/);
    const debAB = await B.modalText();
    check('Airport DFIR drill A: two decisive sources; A-01 and the supporting A-04 without A-02 is unsupported', /Unsupported/.test(debAB) && /two sources/.test(debAB), debAB.slice(0, 300));
    await B.settle();
    const srAB = await B.saveReload();
    check('save/reload mid-Airport (DFIR) restores the state; the export code round-trips', srAB.same && srAB.roundTrip && srAB.before.track === 'dfir' && srAB.before.map === 'airport', srAB);
    await B.follow(p => p.f.apDrillC, []);
    check('Airport DFIR drills B (the 02:40 session: the vendor’s update) and C (the vendor’s log and our flows, worded honestly) right and supported; separate stores per owner', await B.page.evaluate(() => G.cr.drills.venddfir.verdictOk && G.cr.drills.venddfir.supported && G.cr.drills.lastdfir.verdictOk && G.cr.drills.lastdfir.supported && G.f.apStores));
    // AIR-01: write "network" (likely) as confirmed: an overclaim, corrected and counted.
    await B.goTo('airport', 22, 11);
    await B.settle([], /Report · /); await B.pickLabel(/^Start writing$/);
    const nAir1 = await B.page.evaluate(() => AP_REPORT_1.claims.length);
    for (let n = 1; n <= nAir1; n++) {
      await B.settle([], /Finding \d+ of \d+/);
      const card = (await B.page.textContent('#modal .card')).trim();
      const cl = await B.page.evaluate(t => { const c = AP_REPORT_1.claims.find(x => x.text === t); return c ? { id: c.id, truth: c.truth } : null; }, card);
      const want = cl && cl.id === 'network' ? 'Confirmed' : { confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown' }[cl && cl.truth];
      await B.pickLabel(new RegExp('^' + want + '$'));
      await B.settle([], n < nAir1 ? /Finding \d+ of \d+/ : /Report filed/);
    }
    const filedA = await B.page.innerHTML('#modal');
    await B.settle();
    check('AIR-01: the Wednesday connections through Plinthwise’s network go out as “Likely” (the overclaim corrected and counted); who sent the email as “Unknown”; the ports map as “Confirmed”', /Likely:<\/b> The Wednesday connections came from Plinthwise’s own support network/.test(filedA) && /Unknown:<\/b> Who sent the email/.test(filedA) && /Confirmed:<\/b> Of the office switch’s 46 ports/.test(filedA) && /corrected in review/.test(filedA) && await B.page.evaluate(() => G.cr.reports.ap1.over === 1), filedA.slice(0, 400));
    await B.follow(() => false, [], /End of the Regional Airport/);
    const apB = await B.page.evaluate(() => ({ cu: G.cr.custody, r2: G.cr.reports.ap2, windsock: G.f.apWindsock, obj: objective(), ser: crSeries(), sw: G.f.apSwitch, stores: G.f.apStores, day: G.day }));
    check('DFIR Airport: AIR-02 filed, 79 custody items (53 + the Airport’s 26: A-01 to A-25 and the shop’s own store, S-01), the airport manager’s question answered, separate stores per owner, Windsock Badge, summary “Next: the Compact-wide incident”', apB.cu.items === 79 && !!apB.r2 && apB.sw && apB.stores && apB.windsock && apB.obj.done && apB.ser.airport === true && apB.day === 29 && /Next: the Compact-wide incident/.test(await B.modalText()), apB);
    check('AIR-02: the office systems encrypted from AP-OF-03 (confirmed); AP-DC-01 not encrypted over the window covered (confirmed); no directory change in the 14 days its log covers (confirmed); the export (confirmed); tenant records left (likely); MS-PC-01, the way in and publication unknown, the way in from the directory’s sign-in records', await B.page.evaluate(() => { const c = id => AP_REPORT_2.claims.find(x => x.id === id); return c('enc').truth === 'confirmed' && c('dc').truth === 'confirmed' && /between 04:00 and 08:00/.test(c('dc').text) && c('dir').truth === 'confirmed' && /14 days/.test(c('dir').text) && /^A-22: ap-admin’s first sign-in/.test(c('way').evidence[0]) && c('export').truth === 'confirmed' && c('left').truth === 'likely' && c('mspc').truth === 'unknown' && c('way').truth === 'unknown' && c('pub').truth === 'unknown'; }));
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
