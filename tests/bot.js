// Uptime Town Hall — Playwright playthrough bot + checks.
// Plays from New game through the Front Desk, the Mail Room, Clerks' Row and Market Square to the end-of-district screen using real inputs:
//   desktop: keyboard (arrows, Z, X, Enter, Shift); phone: taps on the on-screen pad and on menu options.
// Usage: node bot.js desktop|phone [outdir]   (UPTIME_FILE=file:///... to test another build)
// Also checks: no Quiet Thread technique ever shows up as an ordinary alert, and the series save
// (quietThread) survives the mid-game reload.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const MODE = process.argv[2] || 'desktop';
const GAMER = process.env.GAMER === '1';
const OUT = process.argv[3] || process.env.UPTIME_OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const phone = MODE === 'phone';
  const ctx = await browser.newContext(phone
    ? { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
    : { viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) requests.push(r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(20261027); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const shot = name => page.screenshot({ path: `${OUT}/${MODE}-${name}.png` });

  async function press(btn) {
    if (phone) await page.tap(`[data-btn="${btn}"]`);
    else await page.keyboard.press(KEY[btn]);
  }
  async function pick(p, idx) {
    const u = p.ui;
    if (phone) {
      await sleep(370); // a person can't tap faster than the UI's ghost-click guard either
      const sel = u.type === 'modal' ? `#mopts [data-i="${idx}"]` : `#popts [data-i="${idx}"]`;
      await page.tap(sel); return;
    }
    let cur = u.cursor, guard = 0;
    while (cur !== idx && guard++ < 20) {
      await press(u.type === 'modal' ? 'down' : 'right');
      const q = await peek(); if (!q.ui || q.ui.type !== u.type) return; cur = q.ui.cursor;
    }
    await press('a');
  }
  let escTried = false;
  const stats = { battles: 0, says: 0, steps: 0, shots: {}, alertTechs: {} };
  const QT_TECHS = await page.evaluate(() => Object.keys(QT_TECH));
  function chooseIndex(p) {
    const u = p.ui, o = u.options;
    const en = i => o[i] && !o[i].disabled;
    const find = f => o.findIndex((x, i) => en(i) && f(x.meta || {}, x));
    if (p.battle && GAMER && !p.battle.story) {
      const c = find(m => m.kind === 'close'); if (c >= 0) return c;
      const v = find(m => m.verdict === 'fp'); if (v >= 0) return v;
      return 0;
    }
    if (p.battle) {
      const b = p.battle;
      if (find(m => m.kind === 'close') >= 0) {
        stats.battles++;
        const esc = find(m => m.kind === 'escalate');
        if (esc >= 0 && b.kind === 'mal' && b.ev >= 50 && !escTried) { escTried = true; return esc; }
        if (b.ev < 70) {
          let best = -1, bs = -1;
          o.forEach((x, i) => { const m = x.meta || {}; if (en(i) && m.kind === 'ability' && m.type === 'inv') { const s = m.eff * 10 - m.cost; if (s > bs) { bs = s; best = i; } } });
          if (best >= 0) return best;
        }
        return find(m => m.kind === 'close');
      }
      if (find(m => m.verdict) >= 0) return find(m => m.verdict === b.kind);
      if (find(m => m.good !== undefined) >= 0 && o.some(x => x.meta && x.meta.back)) return find(m => m.good === true);
      if (find(m => m.idx !== undefined) >= 0) return o.length - 1;
    }
    if (o.some(x => x.meta && x.meta.k === 'new')) {
      const want = p.__wantContinue ? 'cont' : 'new';
      return find(m => m.k === want);
    }
    const g = find(m => m.good === true); if (g >= 0) return g;
    return find(() => true);
  }
  async function handleUI(p) {
    const u = p.ui;
    if (u.type === 'say') { stats.says++; if (phone) { await sleep(370); await page.tap('#panel'); } else await press('a'); return; }
    if (u.type === 'modal' && u.multi) {
      const goods = u.options.map((x, i) => x.meta && x.meta.good ? i : -1).filter(i => i >= 0);
      const todo = goods.filter(i => !u.sel.includes(i));
      if (todo.length && u.sel.length < u.multi) return pick(p, todo[0]);
      return pick(p, u.options.findIndex(x => x.done));
    }
    return pick(p, chooseIndex(p));
  }
  function bfs(p, gx, gy, goalIsTile) {
    const H = p.solid.length, W = p.solid[0].length;
    const doorSet = new Set(Object.keys(p.doors || {}));
    const ok = (x, y) => x >= 0 && y >= 0 && x < W && y < H && (!p.solid[y][x]) &&
      (!(doorSet.has(x + ',' + y)) || (x === gx && y === gy)) && !(p.map === 'hub' && y >= 11 && gy < 11 && !(p.f.vexDone));
    const goals = goalIsTile ? [[gx, gy]] : Object.values(DIR).map(([dx, dy]) => [gx + dx, gy + dy]).filter(([x, y]) => ok(x, y));
    const key = (x, y) => x + ',' + y;
    const prev = new Map([[key(p.x, p.y), null]]);
    const q = [[p.x, p.y]];
    while (q.length) {
      const [x, y] = q.shift();
      if (goals.some(([a, b]) => a === x && b === y)) {
        const path = []; let k = key(x, y);
        while (prev.get(k)) { const [d, pk] = prev.get(k); path.unshift(d); k = pk; }
        return { path, end: [x, y] };
      }
      for (const [d, [dx, dy]] of Object.entries(DIR)) {
        const nx = x + dx, ny = y + dy, nk = key(nx, ny);
        if (prev.has(nk) || !ok(nx, ny)) continue;
        prev.set(nk, [d, key(x, y)]); q.push([nx, ny]);
      }
    }
    return null;
  }
  // Next door to take toward another map: breadth-first search over the maps' unlocked doors.
  async function nextDoor(from, to) {
    const doors = await page.evaluate(() => Object.fromEntries(Object.entries(MAPS).map(([k, v]) => [k, Object.entries(v.doors || {}).filter(([, d]) => d.to && !d.locked).map(([xy, d]) => [xy, d.to])])));
    const prev = new Map([[from, null]]), q = [from];
    while (q.length) {
      const m = q.shift();
      if (m === to) { let k = m, hop = null; while (prev.get(k)) { hop = prev.get(k); k = hop[0]; } return hop[1].split(',').map(Number); }
      for (const [xy, t] of doors[m] || []) if (!prev.has(t)) { prev.set(t, [m, xy]); q.push(t); }
    }
    throw new Error('no door route ' + from + ' -> ' + to);
  }
  async function navigate(p) {
    let o = p.objective;
    // Worm containment: no laptop is coloured, so find the spreading ones from the fleet-search evidence, as a player would.
    if (p.map === 'clerks' && p.f.crContain && !p.f.crContained) {
      const t = await page.evaluate(() => { const r = crFleetRows().find(x => /different laptop addresses/.test(x.text) && !crIsolated(x.h)); return r ? crHostXY(r.h) : null; });
      if (t) o = { map: 'clerks', x: t.x, y: t.y };
    }
    let gx, gy, tile = false;
    if (p.map !== o.map) { tile = true; [gx, gy] = await nextDoor(p.map, o.map); }
    else { gx = o.x; gy = o.y; tile = !!o.step; }
    const r = bfs(p, gx, gy, tile);
    if (!r) throw new Error('no path to ' + JSON.stringify(o) + ' from ' + p.map + ' ' + p.x + ',' + p.y);
    if (r.path.length === 0) {
      if (tile) { await press(p.dir); return; }
      const d = Object.entries(DIR).find(([, [dx, dy]]) => p.x + dx === gx && p.y + dy === gy)[0];
      if (p.dir !== d) { await press(d); await sleep(30); }
      await press('a'); return;
    }
    const d = r.path[0];
    const before = [p.map, p.x, p.y].join();
    await press(d); stats.steps++;
    for (let i = 0; i < 60; i++) {
      await sleep(15);
      const q = await peek();
      if (q.ui || q.busy || [q.map, q.x, q.y].join() !== before) break;
    }
  }

  const t0 = Date.now();
  let savedCheck = null, savedCheckMail = null, savedCheckClerks = null, savedCheckMarket = null, iter = 0, lastProgress = Date.now(), lastSig = '';
  // Save from the Start menu, reload the page, Continue, and compare the state (plus the export-code round trip).
  async function saveReload() {
    const before = await peek();
    const waitK = async k => { for (let i = 0; i < 100; i++) { const q = await peek(); if (q.ui && q.ui.type === 'modal') { const j = q.ui.options.findIndex(x => x.meta && x.meta.k === k); if (j >= 0) return [q, j]; } await sleep(20); } throw new Error('menu option ' + k + ' never appeared: ' + JSON.stringify((await peek()).ui)); };
    const waitTitle = async t => { for (let i = 0; i < 100; i++) { const q = await peek(); const h = await page.textContent('#modal'); if (q.ui && q.ui.type === 'modal' && h.includes(t)) return q; await sleep(20); } throw new Error('modal ' + t + ' never appeared'); };
    const tag = before.map === 'hub' ? '' : '-' + before.map;
    await press('start');
    let [q, j] = await waitK('score'); await pick(q, j);
    q = await waitTitle('Now'); await shot('scorecard' + tag); await pick(q, 0);
    [q, j] = await waitK('fm'); await pick(q, j);
    q = await waitTitle('complete'); await shot('fieldmanual' + tag); await pick(q, 0);
    [q, j] = await waitK('save'); await pick(q, j);
    q = await waitTitle('Saved'); await pick(q, 0);
    [q, j] = await waitK('close'); await pick(q, j);
    const code = await page.evaluate(() => encodeSave(__UPTIME.state()));
    await page.reload();
    await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
    await page.evaluate(() => __UPTIME.turbo(true));
    [q, j] = await waitK('cont'); await pick(q, j);
    await sleep(100);
    const after = await peek();
    const same = ['map', 'x', 'y', 'day', 'rank', 'queue', 'mfa'].every(k => JSON.stringify(before[k]) === JSON.stringify(after[k])) &&
      JSON.stringify(before.f) === JSON.stringify(after.f) && JSON.stringify(before.party) === JSON.stringify(after.party) &&
      JSON.stringify(before.qt) === JSON.stringify(after.qt) && JSON.stringify(before.extra) === JSON.stringify(after.extra) &&
      JSON.stringify(before.metrics) === JSON.stringify(after.metrics);
    const decoded = await page.evaluate(c => { try { const g = decodeSave(c); return g.day; } catch (e) { return 'ERR ' + e.message; } }, code);
    return { restored: same, exportRoundTrip: decoded === before.day, day: before.day, map: before.map, x: before.x, y: before.y };
  }
  await shot('title');
  while (true) {
    if (++iter > 40000 || Date.now() - t0 > 20 * 60 * 1000) throw new Error('bot timed out at iteration ' + iter);
    const p = await peek();
    const sig = JSON.stringify([p.map, p.x, p.y, p.ui && p.ui.type, p.ui && (p.ui.text || '').slice(0, 30), p.ui && p.ui.options && p.ui.options.map(o => o.label).join('|').slice(0, 80), p.ui && p.ui.sel, p.objective && p.objective.text, p.battle && p.battle.ev, p.battle && p.battle.dwell]);
    if (sig !== lastSig) { lastSig = sig; lastProgress = Date.now(); }
    if (p.battle && !p.battle.story) stats.alertTechs[p.battle.tech] = (stats.alertTechs[p.battle.tech] || 0) + 1;
    else if (Date.now() - lastProgress > 15000) throw new Error('stuck: ' + sig);
    if (p.extra && p.extra.mkSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) break;
    if (p.extra && p.extra.crSummary && !stats.crSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) { stats.crSummary = { day: p.day, fm: p.fm, seconds: Math.round((Date.now() - t0) / 1000) }; await shot('summary-clerks'); }
    if (p.map === 'market' && !p.ui && !stats.shots.market && p.started && p.f.mkInv) { stats.shots.market = 1; await shot('market'); }
    if (p.ui && p.ui.type === 'modal' && !stats.shots.waf && /WAF rule review ·/.test(await page.textContent('#modal'))) { stats.shots.waf = 1; await shot('waf-review'); }
    if (p.extra && p.extra.mrSummary && !stats.mrSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) { stats.mrSummary = { day: p.day, fm: p.fm, seconds: Math.round((Date.now() - t0) / 1000) }; await shot('summary-mailroom'); }
    if (p.map === 'clerks' && !p.ui && !stats.shots.clerks && p.started && p.f.crTriage) { stats.shots.clerks = 1; await shot('clerks'); }
    if (p.map === 'clerks' && !p.ui && !stats.shots.contain && p.f.crContain && !p.f.crContained) { stats.shots.contain = 1; await shot('clerks-containment'); }
    if (p.ui && p.ui.type === 'modal' && !stats.shots.triage && /Patch Tuesday triage/.test(await page.textContent('#modal'))) { stats.shots.triage = 1; await shot('patch-triage'); }
    if (p.summary && !stats.fdSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) { stats.fdSummary = { day: p.day, fm: p.fm, seconds: Math.round((Date.now() - t0) / 1000) }; await shot('summary-frontdesk'); }
    if (p.map === 'mail' && p.ui && p.ui.type === 'modal' && !stats.shots['drill'] && /Drill ·/.test(await page.textContent('#modal'))) { stats.shots.drill = 1; await shot('drill'); }
    if (p.map === 'mail' && !p.ui && !stats.shots.mail && p.started) { stats.shots.mail = 1; await shot('mailroom'); }
    // screenshots at notable moments
    if (p.battle && !stats.shots.battle && p.ui && p.ui.type === 'choice') { stats.shots.battle = 1; await shot('battle'); }
    if (p.started && p.map === 'hub' && !p.ui && !stats.shots.hub) { stats.shots.hub = 1; await shot('hub'); }
    if (p.started && p.map === 'desk' && p.ui && p.ui.type === 'say' && !stats.shots.dialog) { stats.shots.dialog = 1; await shot('dialog'); }
    if (p.ui && p.ui.type === 'modal' && /Morning briefing/.test(await page.textContent('#modal')) && !stats.shots.brief) { stats.shots.brief = 1; await shot('briefing'); }
    if (GAMER && p.m && p.m.surfaced > 0) { console.log(JSON.stringify({gamer: true, missed: p.m.missed, surfaced: p.m.surfaced, acc: p.metrics.acc, day: p.day, errors, requests})); process.exit(errors.length ? 1 : 0); }
    if (p.ui) { await handleUI(p); continue; }
    if (GAMER && p.started && !p.busy && !p.moving && p.party.length && p.queue > 0 && p.focus > 4) { await press('select'); await sleep(30); continue; }
    if (!p.started || p.busy || p.moving) { await sleep(15); continue; }
    // In the Mail Room, work a few alerts from the queue so the Mail Room templates and home-threat mix get played.
    if (p.map === 'mail' && p.f.mrMet && p.queue > 0 && p.focus > 12 && (stats.mailQueue || 0) < 8) { stats.mailQueue = (stats.mailQueue || 0) + 1; await press('select'); await sleep(30); continue; }
    // Same in Clerks' Row, so its endpoint alert templates get played.
    if (p.map === 'clerks' && p.f.crMet && !p.f.crContain && p.queue > 0 && p.focus > 12 && (stats.clerksQueue || 0) < 8) { stats.clerksQueue = (stats.clerksQueue || 0) + 1; await press('select'); await sleep(30); continue; }
    if (!savedCheckClerks && p.map === 'clerks' && p.f.crDrill1 && !p.f.crException) { savedCheckClerks = await saveReload(); continue; }
    // Same in Market Square, so its web alert templates get played.
    if (p.map === 'market' && p.f.mkMet && !p.f.mkBoss && p.queue > 0 && p.focus > 12 && (stats.marketQueue || 0) < 8) { stats.marketQueue = (stats.marketQueue || 0) + 1; await press('select'); await sleep(30); continue; }
    if (!savedCheckMarket && p.map === 'market' && p.f.mkDrill1 && !p.f.mkWafBlock) { savedCheckMarket = await saveReload(); continue; }
    // mid-game save/reload check (once, on Day 2 in the hub, idle)
    if (!savedCheckMail && p.map === 'mail' && p.f.mrDrill1 && !p.f.mrReport) { savedCheckMail = await saveReload(); continue; }
    if (!savedCheck && p.day >= 2 && p.map === 'hub' && p.f.vexDone) { savedCheck = await saveReload(); continue; }
    await navigate(p);
  }
  await sleep(100);
  await shot('summary');
  const fin = await peek();
  const hscroll = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  const quietInAlerts = Object.keys(stats.alertTechs).filter(t => QT_TECHS.includes(t));
  const result = {
    quietTechInAlertMix: quietInAlerts,
    mode: MODE, finished: true, seconds: Math.round((Date.now() - t0) / 1000), iterations: iter,
    errors, requests, saveReload: savedCheck, saveReloadMailRoom: savedCheckMail, saveReloadClerks: savedCheckClerks, saveReloadMarket: savedCheckMarket, noHorizontalScroll: hscroll.sw <= hscroll.iw, hscroll,
    final: { day: fin.day, rank: fin.rank, fm: fin.fm, metrics: fin.metrics, party: fin.party, m: fin.m, mfa: fin.mfa, insider: fin.f.insider, cards: fin.f.cards, mrCards: fin.f.mrCards, mr: fin.extra && fin.extra.mr, crCards: fin.f.crCards, cr: fin.extra && fin.extra.cr, mkCards: fin.f.mkCards, mk: fin.extra && fin.extra.mk, objective: fin.objective },
    stats
  };
  console.log(JSON.stringify(result, null, 1));
  await browser.close();
  process.exit(errors.length || requests.length || !savedCheck || !savedCheck.restored || !savedCheckMail || !savedCheckMail.restored || !savedCheckMail.exportRoundTrip || !savedCheckClerks || !savedCheckClerks.restored || !savedCheckClerks.exportRoundTrip || !savedCheckMarket || !savedCheckMarket.restored || !savedCheckMarket.exportRoundTrip || quietInAlerts.length ? 1 : 0);
})().catch(async e => { console.error('BOT FAILED:', e.message); process.exit(2); });
