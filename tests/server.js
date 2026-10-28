// Server Room checks (Town Hall district 7). Setup jumps the state past the IT Basement through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Beacon Badge door (the Basement's west wall), arrival and the Tier 3 scorecard, the privileged-account
// fieldwork (everyday accounts out of Tier 0), the service-account registry (owners, gMSA/vault/retire) and the Quiet
// Thread svc-print nesting clue, PAWs/LAPS/Protected Users, the directory audit policy, the tiering mini-game, three
// investigation drills (guessing scores low; focused paths 100; Tally), save/reload mid-district, the least-privilege
// directive (svc-permits), the Assessment Findings area, the Server Board (Crown Badge, Tier 3 lead investigator,
// Keyling -> Tessera, lateral halved), the boss (tabletop, three stages, evicted, krbtgt twice), the Quiet Thread
// (consistent, not resolved), the summary and the Water Plant handoff, and the phone layout.
// Usage: node server.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  await page.evaluate(() => { __UPTIME.seed(29); __UPTIME.turbo(true); });
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
  async function settle(prefs, stopRe) {
    for (let i = 0; i < 3000; i++) {
      await sleep(15);
      const p = await peek();
      if (!p.ui) { if (!p.busy) return; continue; }
      if (stopRe && p.ui.type === 'modal' && stopRe.test(await page.textContent('#modal'))) return p;
      if (p.ui.type === 'say') { await press('a'); continue; }
      if (p.ui.type === 'modal' && p.ui.multi) {
        const todo = p.ui.options.findIndex((o, j) => o.meta && o.meta.good && !p.ui.sel.includes(j));
        const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
        let guard = 0; while ((await peek()).ui.cursor !== idx && guard++ < 30) await press('down');
        await press('a'); await sleep(20); continue;
      }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      if (re) { await pickLabel(re); continue; }
      if (p.battle && p.ui.type === 'choice') {
        const o = p.ui.options, b = p.battle, en = i => o[i] && !o[i].disabled, find = f => o.findIndex((x, i) => en(i) && f(x.meta || {}, x));
        let idx;
        if (find(m => m.kind === 'close') >= 0) { idx = find(m => m.kind === 'close');
          if (b.ev < 70) { let bs = -1; o.forEach((x, i) => { const m = x.meta || {}; if (en(i) && m.kind === 'ability' && m.type === 'inv' && m.eff * 10 - m.cost > bs) { bs = m.eff * 10 - m.cost; idx = i; } }); } }
        else if (find(m => m.verdict) >= 0) idx = find(m => m.verdict === b.kind);
        else idx = find(m => m.good === true);
        if (idx < 0) idx = 0;
        await pickLabel(new RegExp('^' + o[idx].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$')); continue;
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
  async function goTo(map, x, y, onTile) {
    for (let n = 0; n < 600; n++) {
      const p = await peek();
      if (p.ui || p.busy) { if (p.battle) { await settle(); continue; } return 'ui'; }
      if (p.map !== map) {
        const D = await doors(), prev = new Map([[p.map, null]]), q = [p.map]; let hop = null;
        while (q.length) { const m = q.shift(); if (m === map) { let k = m; while (prev.get(k)) { hop = prev.get(k); k = hop[0]; } break; } for (const [xy, t] of D[m] || []) if (!prev.has(t)) { prev.set(t, [m, xy]); q.push(t); } }
        const [dx, dy] = hop[1].split(',').map(Number); const pth = bfs(p, dx, dy, true);
        if (await stepOnce(pth.length ? pth[0] : p.dir) === 'ui') { const q2 = await peek(); if (q2.battle) { await settle(); continue; } return 'ui'; }
        continue;
      }
      const pth = bfs(p, x, y, !!onTile);
      if (pth.length) { if (await stepOnce(pth[0]) === 'ui') { const q2 = await peek(); if (q2.battle) { await settle(); continue; } return 'ui'; } continue; }
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

async function pickGood(s) {
  const u = (await s.peek()).ui;
  const i = u.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
  if (i < 0) throw new Error('no good option in ' + JSON.stringify(u.options.map(o => o.label)));
  await s.pickLabel(new RegExp('^' + u.options[i].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
}
// Walk to the Server Room desk and end the shift (robust to a lingering dialogue or a wild alert on the way).
async function endShiftDesk(s) {
  for (let k = 0; k < 6; k++) {
    await s.settle();
    await s.goTo('server', 12, 13);
    let q = await s.peek();
    if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/);
    else if (!q.ui) { const pr = q.player || {}; if (q.x !== 11 || q.y < 11) { /* not at desk yet */ } else { await s.press('a'); q = await s.peek(); if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/); } }
    await s.settle();
    const r = await s.peek();
    if (!r.objective || !/End your shift/.test(r.objective.text)) return;
    if (k === 5) throw new Error('could not end the shift; at ' + r.x + ',' + r.y + ' obj=' + (r.objective && r.objective.text));
  }
}
async function settleTo(s, re) {
  for (let i = 0; i < 4000; i++) {
    await sleep(15);
    const p = await s.peek();
    if (!p.ui) { if (!p.busy) throw new Error('settleTo: script ended before ' + re); continue; }
    if (p.ui.type === 'choice' && re.test(p.ui.text || '')) return p;
    if (p.ui.type === 'modal' && re.test(await s.page.textContent('#modal'))) return p;
    if (p.ui.type === 'say') { await s.press('a'); continue; }
    if (p.ui.type === 'modal' && p.ui.multi) {
      const todo = p.ui.options.findIndex((o, j) => o.meta && o.meta.good && !p.ui.sel.includes(j));
      const idx = p.ui.sel.length < p.ui.multi && todo >= 0 ? todo : p.ui.options.findIndex(o => o.done);
      let guard = 0; while ((await s.peek()).ui.cursor !== idx && guard++ < 30) await s.press('down');
      await s.press('a'); await sleep(20); continue;
    }
    let idx = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
    if (p.battle && p.ui.type === 'choice') {
      const o = p.ui.options, b = p.battle, en = i => o[i] && !o[i].disabled, find = f => o.findIndex((x, i) => en(i) && f(x.meta || {}, x));
      if (find(m => m.kind === 'close') >= 0) { idx = find(m => m.kind === 'close');
        if (b.ev < 70) { let bs = -1; o.forEach((x, i) => { const m = x.meta || {}; if (en(i) && m.kind === 'ability' && m.type === 'inv' && m.eff * 10 - m.cost > bs) { bs = m.eff * 10 - m.cost; idx = i; } }); } }
      else if (find(m => m.verdict) >= 0) idx = find(m => m.verdict === b.kind);
      else idx = find(m => m.good === true);
    }
    if (idx < 0) idx = p.ui.options.findIndex(o => !o.disabled);
    await s.pickLabel(new RegExp('^' + p.ui.options[idx].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  }
  throw new Error('settleTo timed out: ' + re);
}

// Front Desk to IT Basement finished: Tier 3 senior analyst, Beacon Badge, standing in the Basement by the west door.
async function basementDone(s, extra, party) {
  await s.page.evaluate(([extra, party]) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'ledger', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true,
      mrArrived: true, mrMet: true, mrInbox: true, mrDrill1: true, mrReport: true, mrSms: true, mrVish: true, mrDrill2: true, mrDirective: true, mrNight: true, mrDrill3: true, mrOsintMet: true, mrOsintDone: true, mrBoard: true, mrSeal: true, mrBoss: true, mrSummary: true,
      crMet: true, crAdmin: true, crTriage: true, crAsr: true, crPslogGpo: true, crPslog: true, crDrill1: true, crException: true, crDrill2: true, crNight: true, crDrill3: true, crDojoMet: true, crDojoDone: true, crBoard: true, crShield: true, crContain: false, crContained: true, crBoss: true, crSummary: true,
      mkMet: true, mkInv: true, mkWafDetect: true, mkCms: true, mkTest: true, mkCsp: true, mkNight1: true, mkDrill1: true, mkWafBlock: true, mkDirective: true, mkDrill2: true, mkNight2: true, mkDrill3: true, mkDojoMet: true, mkDojoDone: true, mkBoard: true, mkLantern: true, mkBoss: true, mkScopeDone: true, mkSummary: true,
      rhMet: true, rhTest: true, rhBia: true, rhOffline: true, rhCreds: true, rhNight1: true, rhDrill1: true, rhDirective: true, rhDrill2: true, rhNight2: true, rhDrill3: true, rhDojoMet: true, rhDojoDone: true, rhBoard: true, rhVault: true, rhNight3: true, rhBoss: true, rhSummary: true,
      bmMet: true, bmCover: true, bmTime: true, bmRet: true, bmFw: true, bmTune: true, bmNight1: true, bmDrill1: true, bmDirective: true, bmDrill2: true, bmNight2: true, bmDrill3: true, bmLogMet: true, bmLogDone: true, bmScanMet: true, bmScanDone: true, bmBoard: true, bmBeacon: true, bmNight3: true, bmBoss: true, bmFile: true, bmSummary: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 12; G.rank = 'Tier 3 senior analyst'; G.badge = true; G.focusMax = 46; G.focus = 46;
    G.party = party || [{ id: 'annalist', lvl: 9, xp: 0, tuned: true }, { id: 'overwatch', lvl: 8, xp: 0, tuned: false }, { id: 'lantern', lvl: 6, xp: 0, tuned: false }, { id: 'keyling', lvl: 6, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sifter', lvl: 5, xp: 0, tuned: false }, { id: 'mirrorcoat', lvl: 6, xp: 0, tuned: false }, { id: 'bulwark', lvl: 6, xp: 0, tuned: false }];
    G.active = 0;
    MR(); CR(); CR().admins = 0; MK(); MK().found = MK_ASSETS.map(a => a.id); RH(); RH().obj = true; BM(); G.bm.day0 = 11;
    G.map = 'basement'; G.x = 1; G.y = 7; G.dir = 'left';
  }, [extra || null, party || null]);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Beacon Badge door: the Basement's west wall ----
  await basementDone(s, { bmBeacon: false });
  await s.press('left'); await sleep(80);
  p = await s.waitUI('say');
  check('without the Beacon Badge the west-wall door stays locked', /Beacon Badge/.test(p.ui.text) && (await s.peek()).map === 'basement', p.ui.text);
  await s.settle();
  check('the Basement west wall is a door to the Server Room', await s.page.evaluate(() => MAPS.basement.rows[7][0] === 'D' && MAPS.basement.doors['0,7'].to === 'server'));

  // ---- Arrival ----
  await basementDone(s);
  await s.press('left'); await sleep(200);
  await s.settle();
  p = await s.peek();
  check('the Beacon Badge opens the door into the Server Room', p.map === 'server' && p.x === 1 && p.y === 7, { map: p.map, x: p.x, y: p.y });
  await s.goTo('server', 14, 7);
  await s.settle();
  p = await s.peek();
  check('arrival: Beatriz met; still Tier 3; Server metrics start (Tier 0 accounts 17, owned 39%, crossings 46, investigations 0)',
    p.f.svMet && p.rank === 'Tier 3 senior analyst' && p.metrics.svPriv === 17 && p.metrics.svOwn === 39 && p.metrics.svCross === 46 && p.metrics.svLed === 0, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the five Tier 3 metrics with targets', /Privileged \(Tier 0\) accounts/.test(sc0) && /Service accounts with a named owner/.test(sc0) && /Tier-crossing sign-ins a day/.test(sc0) && /Mean time to scope/.test(sc0) && /Investigations led/.test(sc0));
  check('the Server map: DC cage, PAWs, registry, identity whiteboard, Assessment terminals, Board door, door back to the Basement', await s.page.evaluate(() => {
    const r = MAPS.server.rows; return r.length === 16 && r.every(x => x.length === 29) && r[1][1] === '!' && r[1].includes('9') && r[1].includes('(') && r[7][0] === 'D' && r[7][28] === 'D' && r[11].split('/').length === 4 && r[15][13] === 'E';
  }));

  // ---- Fieldwork 1: privileged accounts ----
  await s.goTo('server', 14, 7);
  p = await settleTo(s, /How do you bring Tier 0 down/);
  await s.pickLabel(/longer password and turn on MFA/);
  p = await s.waitUI('say');
  check('priv: MFA alone on everyday domain-admin accounts is refused', /exposes Tier 0 every time it opens an attachment|Split the roles/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Give each admin a separate Tier 0 account/);
  await s.settle();
  p = await s.peek();
  check('priv: Tier 0 down to 5 (separate admin accounts); adminsplit action', p.f.svPriv && p.metrics.svPriv === 5 && await s.page.evaluate(() => G.fm['act:adminsplit']), p.metrics);

  // ---- Fieldwork 2: the service-account registry + Quiet Thread clue ----
  await s.goTo('server', 23, 2);
  for (let n = 0; n < 3; n++) { p = await settleTo(s, /Service-account plan/); await pickGood(s); }
  await s.settle();
  p = await s.peek();
  check('registry: 21 kept accounts owned (2 retired), 91%; gMSA fact; svcreg action', p.f.svSvc && p.metrics.svOwn === 91 && await s.page.evaluate(() => G.fm['fact:svgmsa'] && G.fm['act:svcreg'] && /password automatically|manages and backs up|Windows manage|manage.*password/i.test(FACTS.svgmsa.desc)), p.metrics);
  check('Quiet Thread: svc-print nesting clue (T1078.002) found and in the series save; NOT in the Basement timeline (12 stays 12)',
    (await s.peek()).qt.cluesFound.includes('sv-nesting') &&
    await s.page.evaluate(() => QT_CLUES['sv-nesting'].tech === 'T1078.002' && QT_TECH['T1078.002'].name === 'Valid Accounts: Domain Accounts' && typeof BM_QT_LINE !== 'undefined' && !BM_QT_LINE['sv-nesting'] && JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound.includes('sv-nesting')));

  // ---- Fieldwork 3: PAWs, LAPS, Protected Users ----
  await s.goTo('server', 11, 1);
  p = await settleTo(s, /How do you separate administration/);
  await s.pickLabel(/put everyone, including the service and computer accounts/);
  p = await s.waitUI('say');
  check('PAW: Protected Users for service/computer accounts is refused', /never for service or computer accounts|secrets live on the host/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^A separate admin account for each of us/);
  await s.settle();
  p = await s.peek();
  check('PAW: PAWs, LAPS, Protected Users; crossings drop; LAPS and Protected Users facts', p.f.svPaw && p.metrics.svCross <= 26 && await s.page.evaluate(() => G.fm['act:laps'] && G.fm['act:protusers'] && /DSRM|local administrator/.test(FACTS.svlaps.desc) && /never to add service or computer|never add them/i.test(FACTS.svprot.desc)), p.metrics);

  // ---- Fieldwork 4: the directory audit policy ----
  await s.goTo('server', 2, 1);
  p = await settleTo(s, /Directory and Kerberos audit policy/);
  check('audit table lists the verified event IDs incl. 4769 encryption type, 5136, 4662', await s.page.evaluate(() => { const r = SV_AUDIT.map(a => a.id).join(); return /4769/.test(r) && /5136/.test(r) && /4662/.test(r) && /4728/.test(r) && /4697/.test(r); }));
  await settleTo(s, /Which rules do you write/);
  await s.pickLabel(/Alert on every 4624 logon/);
  p = await s.waitUI('say');
  check('audit: alerting on every logon is refused (millions of normal events)', /millions|almost all of them are normal/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Alert on privileged-group changes/);
  await s.settle();
  p = await s.peek();
  check('audit on: event 4769 and 4662 facts (RC4 0x17, replication); diraudit action', p.f.svAudit && await s.page.evaluate(() => G.fm['act:diraudit'] && /0x17/.test(FACTS.ev4769.desc) && /RC4/.test(FACTS.ev4769.desc) && /replication/.test(FACTS.ev4662.desc) && tileDef('server', 1, 1).pal === 'svCageOk'));

  // ---- Fieldwork 5: the tiering mini-game ----
  await s.goTo('server', 16, 7);
  for (let n = 0; n < 5; n++) { p = await settleTo(s, /Tiering ·/); await pickGood(s); }
  await s.settle();
  p = await s.peek();
  check('tiering: five crossings closed, tier-crossing sign-ins 46 -> 0; tiering action/fact', p.f.svTier && p.metrics.svCross === 0 && await s.page.evaluate(() => G.fm['act:tiering'] && G.fm['fact:svtier'] && /Tier 0/.test(FACTS.svtier.desc) && /privileged access workstation/.test(FACTS.svtier.desc)), p.metrics);

  // ---- Night 1, drill 1 by guessing (scores low) ----
  const day0 = (await s.peek()).day;
  await endShiftDesk(s);
  p = await s.peek();
  check('end of shift: next day, the Kerberoasting alert', p.f.svNight1 && p.day === day0 + 1, { svNight1: p.f.svNight1, day: p.day, day0, obj: p.objective && p.objective.text });
  await s.goTo('server', 14, 7);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^Kerberoasting from PK-WS-11/);
  await s.pickLabel(/all RC4, from a clerk/);
  await s.pickLabel(/monitoring server/); await s.pickLabel(/application server requesting/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('drill 1 guessing: right verdict with no decisive query scores 40 and is called unsupported; encryption type and account decide; T1558.003', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1) && /encryption type/.test(deb1) && /T1558\.003/.test(deb1), deb1.slice(0, 260));
  await s.settle();
  const d1 = await s.page.evaluate(() => { const D = SV_DRILLS.roast; return { traps: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => x.id)), []), keys: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.key).map(q => x.id)), []) }; });
  check('drill 1: traps are the ticket count and the time; keys are the encryption/account and the business reason', d1.traps.join() === 'count,time' && d1.keys.join() === 'enc,reason');

  // ---- Save/reload mid-district ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Server-Room restores map, flags, party, metrics, Quiet Thread',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) && JSON.stringify(before.party) === JSON.stringify(after.party) &&
    JSON.stringify(before.extra) === JSON.stringify(after.extra) && JSON.stringify(before.metrics) === JSON.stringify(after.metrics) && JSON.stringify(before.qt) === JSON.stringify(after.qt), { before: before.extra.sv, after: after.extra.sv });

  // ---- The directive ----
  await s.goTo('server', 18, 7);
  p = await settleTo(s, /How do you answer Hugo/);
  await s.pickLabel(/leave svc-permits a domain admin/);
  p = await s.waitUI('say');
  check('directive: keeping svc-permits a domain admin is refused', /single worst thing|Test the smaller rights/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Test the vendor/);
  await s.settle();
  check('directive met by test + risk acceptance; shown on the scorecard (game); leastpriv action', (await s.peek()).extra.sv.directive === 'test' && /Directive: svc-permits.*\(game\)/.test(await s.page.evaluate(() => scorecardHtml())) && await s.page.evaluate(() => G.fm['act:leastpriv']));

  // ---- Drill 2, focused (scores 100) ----
  await s.goTo('server', 14, 7);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: The change event/); await s.pickLabel(/What account made the change/); await s.waitUI('modal');
  check('drill 2: the Subject is hd-lwong from HD-WS-02 while Lisa was at lunch', /hd-lwong/.test(await s.modalText()) && /HD-WS-02/.test(await s.modalText()) && /lunch/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: What p.nash did/); await s.pickLabel(/What did p.nash do/); await s.waitUI('modal');
  check('drill 2: p.nash read 2,300 payroll files in the window', /2,300/.test(await s.modalText()) && /Payroll/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^hd-lwong’s credential/);
  await s.pickLabel(/^hd-lwong was the Subject/);
  await s.pickLabel(/help-desk change made in error/); await s.pickLabel(/Lisa Wong herself/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2 focused: both keys score 100; the Subject and the window decide; T1098.007', /Score 100 \/ 100/.test(deb2) && /Subject/.test(deb2) && /T1098\.007/.test(deb2), deb2.slice(0, 260));
  await s.settle();

  // ---- Night 2, drill 3 with Tally then the two keys ----
  await endShiftDesk(s);
  await s.goTo('server', 23, 2);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/); await s.waitUI('modal');
  check('drill 3: Tally given everything jumps to DCSync and over-reacts', /DCSync|isolating the host/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: The requesting account/); await s.pickLabel(/Which account made the request/); await s.waitUI('modal');
  check('drill 3: the MSOL_ connector is documented for replication', /MSOL_/.test(await s.modalText()) && /documented/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: The source host/); await s.pickLabel(/What is SYNC-02/); await s.waitUI('modal');
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^Legitimate: the documented Entra Connect/);
  await s.pickLabel(/^The requesting account is the documented/);
  await s.pickLabel(/DCSync-style credential dump/); await s.pickLabel(/rogue account quietly granted/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3 focused: both keys score 100; account and host decide; T1003.006', /Score 100 \/ 100/.test(deb3) && /T1003\.006/.test(deb3), deb3.slice(0, 260));
  await s.settle();
  check('drill 3: Entra Connect replication-permissions fact unlocked', await s.page.evaluate(() => G.fm['fact:svsync'] && /Replicate Directory Changes|replication/.test(FACTS.svsync.desc)));
  check('three investigations led so far', (await s.peek()).metrics.svLed >= 3);

  // ---- Alert mix ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const share = c => SV_HOME.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'server'; const sv = count(6000);
    G.f.svMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    let host; G.map = 'server'; do { host = genAlert('mal'); } while (!SV_HOME.includes(host.threat)); G.map = save.map;
    return { hubShare: share(hub), svShare: share(sv), pre: SV_HOME.reduce((s, t) => s + (pre[t] || 0), 0), qtHit: Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]), techs: SV_HOME.map(t => THREATS[t].tech), host: host.host };
  });
  check('alert mix: Server threats about three times as likely in the Server Room; none before arrival; alerts name a Server Room host', mix.svShare > mix.hubShare * 2.2 && mix.svShare < mix.hubShare * 3.2 && mix.pre === 0 && /Server Room$/.test(mix.host), mix);
  check('alert mix: no Quiet Thread technique among threats (T1078.002 stays out); spec IDs present', mix.qtHit.length === 0 && ['T1558.003', 'T1098.007', 'T1021.002', 'T1550.002', 'T1003.006'].every(t => mix.techs.includes(t)), mix);
  check('ATT&CK v20 names and tactics as verified', await s.page.evaluate(() =>
    TECH['T1558.003'].name === 'Steal or Forge Kerberos Tickets: Kerberoasting' && TECH['T1558.003'].tactic.join() === 'Credential Access' &&
    TECH['T1098.007'].name === 'Account Manipulation: Additional Local or Domain Groups' && TECH['T1098.007'].tactic.join() === 'Persistence,Privilege Escalation' &&
    TECH['T1021.002'].name === 'Remote Services: SMB/Windows Admin Shares' && TECH['T1021.002'].tactic.join() === 'Lateral Movement' &&
    TECH['T1550.002'].name === 'Use Alternate Authentication Material: Pass the Hash' && TECH['T1003.006'].name === 'OS Credential Dumping: DCSync' && TECH['T1003.006'].tactic.join() === 'Credential Access' &&
    TECH['T1558.001'].name === 'Steal or Forge Kerberos Tickets: Golden Ticket'));
  check('benign cases: the monitoring server, an approved two-person group change, the documented Entra Connect sync', await s.page.evaluate(() => /monitoring server’s nightly/.test(ALERTS.harvest.benign.truth) && /two-person-approved|approved.*change/.test(ALERTS.elevate.benign.truth) && /identity sync product’s documented replication|documented.*replication/.test(ALERTS.mirror.benign.truth)));

  check('length tell: the right answer is the longest option in at most 40% of the Server Room’s graded lists', await s.page.evaluate(() => {
    const L = [];
    Object.values(SV_DRILLS).forEach(D => { L.push(D.verdicts, D.reasons); });
    SV_HOME.forEach(t => L.push(ALERTS[t].mal.resp));
    SV_BOARD_SPECS().forEach(b => L.push(b.resp));
    SV_FINDINGS.forEach(x => { L.push(x.opts.map((o, j) => ({label: o, good: j === x.good}))); L.push(x.owner.map((o, j) => ({label: o, good: j === x.ownerGood}))); });
    SV_TIER_CROSS.forEach(c => L.push([{label: c.fix, good: true}].concat(c.bad.map(b => ({label: b})))));
    const tell = L.filter(l => { const m = Math.max(...l.map(x => x.label.length)); return l.some(x => x.good && x.label.length === m); }).length;
    return tell / L.length <= 0.4;
  }));
  // ---- Assessment Findings (one wrong answer, then all three) ----
  await s.goTo('server', 10, 11); await s.settle();
  await s.goTo('server', 3, 11);
  await s.waitUI('modal'); await s.pickLabel(/Leave svc-report in Domain Admins/);
  p = await s.waitUI('say');
  check('finding 1: leaving the account a domain admin is not the remediation', /isn’t the remediation|what rights does the thing actually need/.test(p.ui.text), p.ui.text);
  await s.press('a'); await s.waitUI('modal'); await s.pickLabel(/^Remove svc-report from Domain Admins/);
  await s.waitUI('modal'); await pickGood(s);
  await s.settle();
  await s.goTo('server', 5, 11); await s.settle();
  await s.goTo('server', 7, 11); await s.settle();
  p = await s.peek();
  check('all three findings reviewed: least-privilege, delegation and share remedies; unconstrained-delegation fact; identity tool levels up', p.f.svFindDone && await s.page.evaluate(() => G.fm['fact:svdeleg'] && /constrained delegation/.test(FACTS.svdeleg.desc) && G.fm['act:assessfinding']) && p.party.find(t => t.id === 'keyling').lvl === 7, p.party.find(t => t.id === 'keyling'));

  // ---- Server Board ----
  await s.goTo('svboard', 8, 2);
  await s.settle();
  p = await s.peek();
  check('Server Board won: Crown Badge; Tier 3 lead investigator; Keyling evolved into Tessera (still counts as Keyling for earlier checks)',
    p.f.svBoard && p.f.svCrown && p.rank === 'Tier 3 lead investigator' && p.party.some(t => t.id === 'tessera') && !p.party.some(t => t.id === 'keyling') && await s.page.evaluate(() => hasTool('keyling')), { party: p.party, rank: p.rank });
  const half = await s.page.evaluate(() => {
    const w = t => alertWeight(t, 10);
    return { spanner: w('spanner'), relay: w('relay'), harvest: w('harvest') };
  });
  check('Crown Badge: lateral-movement threats (Spanner, Relay) halved; non-lateral (Harvest) not', half.spanner < half.harvest && half.relay < half.harvest, half);

  // ---- The boss (with every earlier Quiet Thread clue already found) ----
  await s.page.evaluate(() => { const q = Series.qt(); Object.keys(QT_CLUES).forEach(id => { if (!q.cluesFound.includes(id)) q.cluesFound.push(id); }); q.stage = 2; Series.save(); qtMirror(); });
  await endShiftDesk(s);
  check('night 3', (await s.peek()).f.svNight3);
  await s.goTo('server', 14, 7);
  p = await settleTo(s, /Tabletop: a domain compromise/);
  check('boss: leadership told out of band automatically, not by a card', !p.ui.options.some(o => /CISA|leadership|notify|report/i.test(o.label)), p.ui.options.map(o => o.label));
  const bs = await s.page.evaluate(() => {
    const good = svBossStages(['scope', 'allatonce', 'krbtgt', 'cleanpaw']), bad = svBossStages([]);
    return { s1: good.s1.clues.join(' '), s2: good.s2.clues.join(' '), s3: good.s3.clues.join(' '), s1t: good.s1.tech, s2t: good.s2.tech, s3t: good.s3.tech, dGood: good.s3.dwell0, dBad: bad.s3.dwell0, cards: SV_CARDS.filter(x => x.good).map(x => x.id).join() };
  });
  check('boss stages: DCSync (s1), pass-the-hash (s2), Golden-Ticket eviction (s3); krbtgt twice; evicting all at once makes s3 easier',
    bs.s1t === 'T1003.006' && bs.s2t === 'T1550.002' && bs.s3t === 'T1558.001' && /k\.hale/.test(bs.s1) && /pass-the-hash|svc-sql/.test(bs.s2) && /krbtgt|twice/.test(bs.s3) && bs.dGood < bs.dBad && bs.cards === 'scope,allatonce,krbtgt,cleanpaw', bs);
  await s.settle();
  p = await s.peek();
  check('boss done: game-original, evicted in one window; eviction and krbtgt facts unlocked', p.f.svBoss && p.f.svCards.length === 4 && p.extra.sv.boss.evicted && await s.page.evaluate(() => G.fm['fact:svevict'] && G.fm['fact:svkrbtgt'] && /twice/.test(FACTS.svkrbtgt.desc) && /piecemeal|tips off|premature/i.test(FACTS.svevict.desc)), p.f.svCards);

  // ---- The Quiet Thread, handed to Rae (not resolved) ----
  await s.goTo('server', 16, 7);
  p = await settleTo(s, /svc-print on the suspicion file/);
  await s.pickLabel(/Strip svc-print out of SRV-Ops-Legacy/);
  p = await s.waitUI('say');
  check('Quiet Thread: stripping svc-print tonight is refused (could warn whoever is behind it; Rae’s call)', /warn whoever is behind it|planned change|Rae’s call/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /svc-print on the suspicion file/);
  await s.pickLabel(/^Add it to the suspicion file/);

  // ---- Summary ----
  p = await settleTo(s, /Server Room district: secured/);
  check('Quiet Thread: added to the file, not resolved, not evicted; series save records it',
    (await s.peek()).f.svFile && await s.page.evaluate(() => { const ser = JSON.parse(localStorage.getItem('uptime.series')); return ser.editions['town-hall'].svcPrintNesting === true && ser.quietThread.evicted === false; }));
  const sum = await s.modalText();
  check('summary: secured, Crown Badge, Tier 3 lead investigator, the thread still on file, “Next: the Water Plant”',
    /Server Room district: secured/.test(sum) && /Crown/.test(sum) && /Tier 3 lead investigator/.test(sum) && /still on file|Quiet Thread/.test(sum) && /Next: the Water Plant/.test(sum), sum.slice(0, 400));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after the district: objective done (Next: the Water Plant); series save marks the Server Room done', p.objective.done && /Water Plant/.test(p.objective.text) && await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].serverRoom === true), p.objective);
  check('Credits list the Server Room sources and keep the MITRE notice', await s.page.evaluate(() => { const c = creditsHtml(); return /Group Managed Service Accounts/.test(c) && /Protected Users/.test(c) && /Entra Connect/.test(c) && /CM0050/.test(c) && /reproduced and distributed with the permission of The MITRE Corporation/.test(c); }));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: tiering, registry and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await basementDone(ph, { svMet: true, svPriv: true, svSvc: true, svPaw: true, svAudit: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); SV(); G.map = 'server'; G.x = 16; G.y = 7; G.dir = 'up'; run(svTiering); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/server-phone-tiering.png' });
  check('phone: tiering modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  for (let n = 0; n < 5; n++) { await settleTo(ph, /Tiering ·/); await tapOpt(ph, '@good'); await sleep(420); }
  await ph.settle();
  p = await ph.peek();
  check('phone: tiering by taps closes the crossings (crossings 0)', p.extra.sv.cross === 0, p.extra.sv);
  await ph.page.evaluate(() => { const G = __UPTIME.state(); G.f.svTier = true; G.f.svNight1 = true; G.x = 14; G.y = 7; run(svDrill1); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/server-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('SERVER TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
