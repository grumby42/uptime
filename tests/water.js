// Water Plant checks (Town Hall district 8). Setup jumps the state past the Server Room through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Crown Badge door (the Server Room's west wall), arrival and the plant scorecard, the OT asset inventory
// (active scanning refused), internet exposure and default passwords (a new port and unplugging every station refused),
// the zones and conduits mini-game (exposure left vs operations broken on the first pass, finance's exception), offline
// PLC backups and the manual drill, passive monitoring, three investigation drills (guessing scores low; a key query on
// the wrong source does not support a verdict that `needs` another; focused 100), save/reload mid-district, the vendor
// remote-access directive (on demand) and the Quiet Thread svc-print clue on the vendor box (T0859), the alert mix and
// ATT&CK for ICS v20 IDs, over-reaction distractors everywhere, the dojo, the Plant Board (Tide Badge: operator sign-off
// before any shutdown, internet-exposed encounters halved; Lanternkeep -> Tidewatch), the boss (hand control, read-out,
// restore and operator test), the Quiet Thread not resolved, the summary and the Council Chambers handoff, phone layout.
// Usage: node water.js   (UPTIME_FILE=file:///... to test another build)
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
// Walk to the Water Plant desk and end the shift (robust to a lingering dialogue or a wild alert on the way).
async function endShiftDesk(s) {
  for (let k = 0; k < 6; k++) {
    await s.settle();
    await s.goTo('water', 12, 13);
    let q = await s.peek();
    if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/);
    else if (!q.ui) { const pr = q.player || {}; if (q.y < 12) { /* not at desk yet */ } else { await s.press('a'); q = await s.peek(); if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/); } }
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

// Front Desk to Server Room finished: Tier 3 lead investigator, Crown Badge, standing in the Server Room by its west door.
async function serverDone(s, extra, party) {
  await s.page.evaluate(([extra, party]) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'ledger', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true,
      mrArrived: true, mrMet: true, mrInbox: true, mrDrill1: true, mrReport: true, mrSms: true, mrVish: true, mrDrill2: true, mrDirective: true, mrNight: true, mrDrill3: true, mrOsintMet: true, mrOsintDone: true, mrBoard: true, mrSeal: true, mrBoss: true, mrSummary: true,
      crMet: true, crAdmin: true, crTriage: true, crAsr: true, crPslogGpo: true, crPslog: true, crDrill1: true, crException: true, crDrill2: true, crNight: true, crDrill3: true, crDojoMet: true, crDojoDone: true, crBoard: true, crShield: true, crContain: false, crContained: true, crBoss: true, crSummary: true,
      mkMet: true, mkInv: true, mkWafDetect: true, mkCms: true, mkTest: true, mkCsp: true, mkNight1: true, mkDrill1: true, mkWafBlock: true, mkDirective: true, mkDrill2: true, mkNight2: true, mkDrill3: true, mkDojoMet: true, mkDojoDone: true, mkBoard: true, mkLantern: true, mkBoss: true, mkScopeDone: true, mkSummary: true,
      rhMet: true, rhTest: true, rhBia: true, rhOffline: true, rhCreds: true, rhNight1: true, rhDrill1: true, rhDirective: true, rhDrill2: true, rhNight2: true, rhDrill3: true, rhDojoMet: true, rhDojoDone: true, rhBoard: true, rhVault: true, rhNight3: true, rhBoss: true, rhSummary: true,
      bmMet: true, bmCover: true, bmTime: true, bmRet: true, bmFw: true, bmTune: true, bmNight1: true, bmDrill1: true, bmDirective: true, bmDrill2: true, bmNight2: true, bmDrill3: true, bmLogMet: true, bmLogDone: true, bmScanMet: true, bmScanDone: true, bmBoard: true, bmBeacon: true, bmNight3: true, bmBoss: true, bmFile: true, bmSummary: true,
      svMet: true, svPriv: true, svSvc: true, svPaw: true, svAudit: true, svTier: true, svNight1: true, svDrill1: true, svDirective: true, svDrill2: true, svNight2: true, svDrill3: true, svFindMet: true, svFindDone: true, svBoard: true, svCrown: true, svNight3: true, svBoss: true, svFile: true, svSummary: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 16; G.rank = 'Tier 3 lead investigator'; G.badge = true; G.focusMax = 48; G.focus = 48;
    G.party = party || [{ id: 'annalist', lvl: 9, xp: 0, tuned: true }, { id: 'overwatch', lvl: 8, xp: 0, tuned: false }, { id: 'lantern', lvl: 6, xp: 0, tuned: false }, { id: 'tessera', lvl: 7, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sifter', lvl: 5, xp: 0, tuned: false }, { id: 'mirrorcoat', lvl: 6, xp: 0, tuned: false }, { id: 'bulwark', lvl: 6, xp: 0, tuned: false }];
    G.active = 0;
    MR(); CR(); CR().admins = 0; MK(); MK().found = MK_ASSETS.map(a => a.id); RH(); RH().obj = true; BM(); G.bm.day0 = 11;
    SV(); G.sv.day0 = 13; G.sv.priv = 4; G.sv.owned = 21; G.sv.cross = 0; G.sv.finds = [true, true, true]; G.sv.led = 4;
    G.map = 'server'; G.x = 1; G.y = 12; G.dir = 'left';
  }, [extra || null, party || null]);
}
const optLabels = async s => ((await s.peek()).ui.options || []).map(o => o.label);

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Crown Badge door: the Server Room's west wall (lower room) ----
  await serverDone(s, { svCrown: false });
  await s.press('left'); await sleep(80);
  p = await s.waitUI('say');
  check('without the Crown Badge the west-wall door stays locked', /Crown Badge/.test(p.ui.text) && (await s.peek()).map === 'server', p.ui.text);
  await s.settle();
  check('the Server Room west wall (row 12) is a door to the Water Plant; the Plant Board is its own map', await s.page.evaluate(() => MAPS.server.rows[12][0] === 'D' && MAPS.server.doors['0,12'].to === 'water' && MAPS.water.doors['28,12'].to === 'server' && MAPS.water.doors['0,7'].to === 'ptboard' && MAPS.wboard.doors['0,6'] !== undefined));

  // ---- Arrival ----
  await serverDone(s);
  await s.press('left'); await sleep(200);
  await s.settle();
  p = await s.peek();
  check('the Crown Badge opens the door into the Water Plant (east wall, facing left)', p.map === 'water' && p.x === 27 && p.y === 12 && p.dir === 'left', { map: p.map, x: p.x, y: p.y });
  await s.goTo('water', 4, 3);
  await s.settle();
  p = await s.peek();
  check('arrival: Mae met; rank unchanged; plant metrics start (exposed 2, default 9, inventoried 29%, backups 0%, vendor approved 21%)',
    p.f.wtMet && p.rank === 'Tier 3 lead investigator' && p.metrics.wtExposed === 2 && p.metrics.wtDefault === 9 && p.metrics.wtInv === 29 && p.metrics.wtBackup === 0 && p.metrics.wtVend === 21, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the five plant metrics with targets', /Internet-exposed OT devices/.test(sc0) && /Default credentials remaining/.test(sc0) && /OT assets inventoried/.test(sc0) && /PLC logic backups current/.test(sc0) && /Vendor remote sessions approved/.test(sc0));
  check('the Water Plant map: HMIs, PLC cabinets, historian, dosing skid, FW-OT, vendor box, network rack, dojo terminals, desk, cabling', await s.page.evaluate(() => {
    const r = MAPS.water.rows; const all = r.join('');
    return r.length === 16 && r.every(x => x.length === 29) && ['[', ']', '{', '>', '}', '<', '-', '`', 'Y', '|'].every(c => all.includes(c)) && r[7][0] === 'D' && r[12][28] === 'D' && r[11].split('`').length === 4;
  }));
  check('the dosing skid is shown, never operated: interacting only describes it', await s.page.evaluate(() => /never touch/.test(wtInteract.toString())));

  // ---- Fieldwork 1: the asset inventory (active scanning refused) ----
  await s.goTo('water', 14, 3);
  p = await settleTo(s, /How do you build the plant’s asset inventory/);
  await s.pickLabel(/Run a fast active scan/);
  p = await s.waitUI('say');
  check('inventory: an active scan of the running plant is refused (fragile controllers; passive listening)', /fragile|passive/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Walk the plant with the operators/);
  await s.settle();
  p = await s.peek();
  check('inventory: 41 of 41 OT assets (100%); asset-inventory guidance fact; otinv action', p.f.wtInv && p.metrics.wtInv === 100 && await s.page.evaluate(() => G.fm['act:otinv'] && G.fm['fact:wtinvguide'] && /five stages/.test(FACTS.wtinvguide.desc)), p.metrics);

  // ---- Fieldwork 2: exposure and default passwords ----
  await s.goTo('water', 4, 1);
  p = await settleTo(s, /How do you deal with the exposure and the passwords/);
  await s.pickLabel(/non-default port and a new password/);
  p = await s.waitUI('say');
  check('exposure: a new port instead of taking the PLC off the internet is refused (AA23-335A)', /AA23-335A/.test(p.ui.text) && /not a closed door/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Unplug the communications at every booster station/);
  p = await s.waitUI('say');
  check('exposure: unplugging every booster station is refused as over-reaction', /loses every booster station|Remove the one exposure/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Off the internet first/);
  await s.settle();
  p = await s.peek();
  check('exposure: 2 -> 1 (the vendor box is still always on); default passwords 9 -> 0; HMI tiles carry the tick; AA23-335A facts', p.f.wtExpose && p.metrics.wtExposed === 1 && p.metrics.wtDefault === 0 && await s.page.evaluate(() => tileDef('water', 4, 1).pal === 'wtHmiOk' && G.fm['fact:wtaa23'] && /Disconnect|disconnect PLCs from the public internet/.test(FACTS.wtaa23.desc) && G.fm['tech:T0883']), p.metrics);

  // ---- Fieldwork 3: zones and conduits (one wrong allow, one wrong deny on the first pass) ----
  await s.goTo('water', 13, 7);
  p = await settleTo(s, /Zones · RPT-01/);
  await s.pickLabel(/^Field/);
  p = await s.waitUI('say');
  check('zones: the reporting server is not a field device', /enterprise zone/.test(p.ui.text), p.ui.text);
  for (let n = 0; n < 40; n++) {
    p = await s.peek();
    if (!p.ui) { await sleep(20); continue; }
    if (p.ui.type === 'say') { await s.press('a'); continue; }
    const txt = await s.modalText();
    if (/Zones and conduits · result/.test(txt)) break;
    if (/Conduits · Any office PC → the PLCs/.test(txt)) { await s.pickLabel(/^Allow this conduit/); continue; }
    if (/Conduits · HMI-01 ↔ the PLCs/.test(txt)) { await s.pickLabel(/^Deny this conduit/); continue; }
    await pickGood(s);
  }
  const res1 = await s.modalText();
  check('zones: the first pass scores exposure left (office → PLCs) and operations broken (HMI ↔ PLCs) with their consequences', /Exposure left: 1/.test(res1) && /operations broken: 1/.test(res1) && /Every office PC can talk straight to a controller/.test(res1) && /Operators lose view/.test(res1), res1.slice(0, 300));
  p = await settleTo(s, /What do you do about finance’s job until Friday/);
  await s.pickLabel(/^Keep the old office-to-PLC rule/);
  p = await s.waitUI('say');
  check('zones: keeping the old office-to-PLC rule for finance is refused (one host, one PLC, an owner, an end date)', /owner and an end date/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^A temporary exception, RPT-01/);
  await s.settle();
  p = await s.peek();
  check('zones done: first-pass score kept (exposure 1, broken 1); FW-OT carries the tick; zones action and 62443 / SP 800-82 facts', p.f.wtZones && p.extra.wt.zones.exposure === 1 && p.extra.wt.zones.broken === 1 && await s.page.evaluate(() => tileDef('water', 13, 7).pal === 'wtFwOk' && G.fm['act:zones'] && /zones and conduits/.test(FACTS.wtzones.desc) && /DMZ/.test(FACTS.wt80082.desc)), p.extra.wt.zones);

  // ---- Fieldwork 4: backups and a manual drill ----
  await s.goTo('water', 11, 1);
  p = await settleTo(s, /How do you back up the controllers/);
  await s.pickLabel(/Save the backups on EWS-01/);
  p = await s.waitUI('say');
  check('backups: keeping them on the engineering workstation is refused', /goes down with it|Offline/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/skip the manual drill/);
  p = await s.waitUI('say');
  check('backups: skipping the manual drill is refused (practise manual operation, CISA/FBI/EPA/DOE)', /by hand/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Two offline copies/);
  await s.settle();
  p = await s.peek();
  check('backups: 7 of 7 PLCs (100%); cabinets carry the tick; primary-mitigations fact (manual operation)', p.f.wtBackup && p.metrics.wtBackup === 100 && await s.page.evaluate(() => tileDef('water', 11, 1).pal === 'wtPlcOk' && G.fm['fact:wtprimary'] && /manually/.test(FACTS.wtprimary.desc)), p.metrics);

  // ---- Fieldwork 5: passive monitoring ----
  const lantLv = (await s.peek()).party.find(t => t.id === 'lantern').lvl;
  await s.goTo('water', 19, 7);
  p = await settleTo(s, /How do you watch the plant’s traffic/);
  await s.pickLabel(/Scan every PLC actively/);
  p = await s.waitUI('say');
  check('monitoring: hourly active scans are refused', /active scan/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^A listen-only sensor/);
  await s.settle();
  p = await s.peek();
  check('monitoring on: passive-monitoring action and fact (active scanning caution); Lanternkeep levels up', p.f.wtMon && p.party.find(t => t.id === 'lantern').lvl === lantLv + 1 && await s.page.evaluate(() => G.fm['act:passivemon'] && /passive monitoring/.test(FACTS.wtpassive.desc)), p.party);

  // ---- Night 1, drill 1 by guessing (scores low) ----
  const day0 = (await s.peek()).day;
  await endShiftDesk(s);
  p = await s.peek();
  check('end of shift: next day, the set-point alert', p.f.wtNight1 && p.day === day0 + 1, { n: p.f.wtNight1, day: p.day, obj: p.objective && p.objective.text });
  await s.goTo('water', 4, 3);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^The night operator’s planned change/);
  await s.pickLabel(/^HMI-02’s audit log names/);
  await s.pickLabel(/Someone else using Tunde/); await s.pickLabel(/pushed from outside/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('drill 1 guessing: right verdict with no decisive query scores 40 and is called unsupported; audit log and shift log decide; T0836', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1) && /audit log/.test(deb1) && /T0836/.test(deb1), deb1.slice(0, 300));
  await s.settle();
  const d1 = await s.page.evaluate(() => { const D = WT_DRILLS.setpoint; return { traps: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => x.id)), []), keys: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.key).map(q => x.id)), []), needs: D.verdicts.find(v => v.good).needs }; });
  check('drill 1: traps are the trend and the alarm count; keys are the HMI audit log and the shift log; the verdict needs the audit log', d1.traps.join() === 'trend,alarms' && d1.keys.join() === 'audit,shift' && d1.needs === 'audit', d1);

  // ---- Save/reload mid-district ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Water-Plant restores map, flags, party, metrics, plant state, Quiet Thread',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) && JSON.stringify(before.party) === JSON.stringify(after.party) &&
    JSON.stringify(before.extra) === JSON.stringify(after.extra) && JSON.stringify(before.metrics) === JSON.stringify(after.metrics) && JSON.stringify(before.qt) === JSON.stringify(after.qt), { before: before.extra.wt, after: after.extra.wt });

  // ---- Drill 2: a key query on the wrong source does not support a verdict that needs the engineering record ----
  await s.goTo('water', 14, 3);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: RA-01 session log/); await s.pickLabel(/Whose session was on EWS-01/); await s.waitUI('modal');
  check('drill 2: the RA-01 log names pv-ksato, the vendor confirms WO-5521 (Gil’s request) on a call-back', /pv-ksato/.test(await s.modalText()) && /WO-5521/.test(await s.modalText()) && /Gil/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^An unapproved change/);
  await s.pickLabel(/^The archive stops at 4\.2/);
  await s.pickLabel(/intruder using the vendor/); await s.pickLabel(/approved change made in a hurry/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2 (needs): the right verdict without the engineering record is unsupported and says why (score 50, not 100); T0843', /Score 50 \/ 100/.test(deb2) && /Unsupported:/.test(deb2) && /engineering record/.test(deb2) && /T0843/.test(deb2), deb2.slice(0, 400));
  await s.settle();

  // ---- The directive and the Quiet Thread clue ----
  await s.goTo('water', 7, 7);
  p = await settleTo(s, /How do you answer Gil/);
  await s.pickLabel(/keep RA-01 on permanently/);
  p = await s.waitUI('say');
  check('directive: leaving the vendor box always on is refused (last night’s unapproved change)', /no ticket|next session might not be the vendor/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Unplug RA-01 for good/);
  p = await s.waitUI('say');
  check('directive: unplugging the vendor box for good is refused too (the plant needs the support)', /two-hour drive|needs the support/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^On demand:/);
  await s.settle();
  p = await s.peek();
  check('directive met: exposed 1 -> 0; vendor box carries the tick; scorecard shows the directive (game); vendor figure waits for the first session',
    p.f.wtDirective && p.metrics.wtExposed === 0 && p.extra.wt.directive === 'ondemand' && p.metrics.wtVend === null && /Directive: the vendor box stays, on demand only.*\(game\)/.test(await s.page.evaluate(() => scorecardHtml())) && await s.page.evaluate(() => tileDef('water', 16, 7).pal === 'wtVendOk' && G.fm['act:vendorod']), p.metrics);
  check('Quiet Thread: svc-print on RA-01 (T0859, ATT&CK for ICS) found, in the series save, never in the alert mix, not in the Basement timeline',
    (await s.peek()).qt.cluesFound.includes('wt-vendorbox') && await s.page.evaluate(() => QT_CLUES['wt-vendorbox'].tech === 'T0859' && QT_TECH.T0859.name === 'Valid Accounts' && !BM_QT_LINE['wt-vendorbox'] && !Object.values(THREATS).some(t => t.tech === 'T0859') && /a\.kerr-adm/.test(QT_CLUES['wt-vendorbox'].seen) && /2019/.test(QT_CLUES['wt-vendorbox'].seen) && JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound.includes('wt-vendorbox')));

  // ---- Night 2, drill 3 focused (scores 100) ----
  await endShiftDesk(s);
  await s.goTo('water', 14, 3);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Endpoint telemetry/); await s.pickLabel(/Which hosts and processes/); await s.waitUI('modal');
  check('drill 3: the 09:12 source is OF-WS-22 and an unsigned program; reads only', /OF-WS-22/.test(await s.modalText()) && /unsigned program/.test(await s.modalText()) && /read requests only/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: The FW-OT rule/); await s.pickLabel(/Which firewall rule allowed it/); await s.waitUI('modal');
  check('drill 3: R-114 was implemented for the whole office subnet, not RPT-01; owner and expiry shown', /R-114/.test(await s.modalText()) && /whole office subnet/.test(await s.modalText()) && /expires Friday/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^An infected office PC/);
  await s.pickLabel(/^OF-WS-22 ran an unsigned program/);
  await s.pickLabel(/reporting job running a second time/); await s.pickLabel(/engineer testing from the office/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3 focused: both keys score 100; host and rule decide; no plant shutdown; T0888', /Score 100 \/ 100/.test(deb3) && /T0888/.test(deb3) && /No plant shutdown/.test(deb3), deb3.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('three investigations led; the first on-demand vendor session (approved) makes the vendor figure 100%', p.extra.wt.led >= 3 && p.metrics.wtVend === 100, p.extra.wt);

  // ---- Alert mix, techniques, Tide Badge mechanics (before the badge) ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const share = c => WT_HOME.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'water'; const wt = count(6000);
    G.f.wtMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    let host; G.map = 'water'; do { host = genAlert('mal'); } while (!WT_HOME.includes(host.threat)); G.map = save.map;
    return { hubShare: share(hub), wtShare: share(wt), pre: WT_HOME.reduce((s, t) => s + (pre[t] || 0), 0), qtHit: Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]), techs: WT_HOME.map(t => THREATS[t].tech), host: host.host };
  });
  check('alert mix: plant threats about three times as likely at the Water Plant; none before arrival; alerts name a plant host', mix.wtShare > mix.hubShare * 2.2 && mix.wtShare < mix.hubShare * 3.2 && mix.pre === 0 && /Water Plant$/.test(mix.host), mix);
  check('alert mix: no Quiet Thread technique among threats; the spec’s ICS IDs present', mix.qtHit.length === 0 && ['T1694.001', 'T0843', 'T0836', 'T0829', 'T0886'].every(t => mix.techs.includes(t)), mix);
  check('ATT&CK for ICS v20 names and tactics as verified', await s.page.evaluate(() =>
    TECH['T1694.001'].name === 'Insecure Credentials: Default Credentials' && TECH['T1694.001'].tactic.join() === 'Persistence,Lateral Movement' &&
    TECH.T0883.name === 'Internet Accessible Device' && TECH.T0883.tactic.join() === 'Initial Access' &&
    TECH.T0843.name === 'Program Download' && TECH.T0843.tactic.join() === 'Lateral Movement' &&
    TECH.T0836.name === 'Modify Parameter' && TECH.T0836.tactic.join() === 'Impair Process Control' &&
    TECH.T0829.name === 'Loss of View' && TECH.T0829.tactic.join() === 'Impact' &&
    TECH.T0886.name === 'Remote Services' && TECH.T0886.tactic.join() === 'Initial Access,Lateral Movement' &&
    TECH.T0888.name === 'Remote System Information Discovery' && TECH.T0888.tactic.join() === 'Discovery' && /T0812/.test(TECH['T1694.001'].desc)));
  check('benign cases: an approved vendor session, an operator’s storm change, the historian copy catching up after a reboot', await s.page.evaluate(() => /scheduled vendor maintenance session under an approved ticket/.test(ALERTS.preset.benign.truth) && /storm/.test(ALERTS.nudge.benign.truth) && /historian copy catching up after a reboot/.test(ALERTS.crossing.benign.truth)));
  check('every plant alert, Board round and boss stage has an over-reaction (shut down / power off) among its wrong answers', await s.page.evaluate(() =>
    WT_HOME.every(t => ALERTS[t].mal.resp.some(r => !r.good && r.shutdown && r.disrupt > 0)) && WT_BOARD_SPECS().every(b => b.resp.some(r => !r.good && r.shutdown)) &&
    Object.values(wtBossStages(['safe', 'asis', 'offnet', 'restore'])).some(st => st.resp.some(r => !r.good && r.shutdown)) && WT_CARDS.some(c => c.id === 'poweroff' && !c.good)));
  const tide0 = await s.page.evaluate(() => { const spec = {threat: 'nudge', resp: ALERTS.nudge.mal.resp}; alertDecorate(spec); return spec.resp.find(r => r.shutdown).disrupt; });
  check('before the Tide Badge a shutdown response still disrupts the plant', tide0 === 2, tide0);

  // ---- Dojo (one wrong answer first) ----
  await s.goTo('water', 10, 11); await s.settle();
  await s.goTo('water', 3, 11);
  await s.untilChoice(); await s.pickLabel(/^The PLC sent 0\.3 MB/);
  p = await s.waitUI('say');
  check('dojo 1: a flow record is metadata, not a burst or the values', /Not quite/.test(p.ui.text), p.ui.text);
  await s.settle([/^HIST-01 held one long/]);
  await s.goTo('water', 5, 11); await s.settle([/^The new source and its new rhythm/]);
  await s.goTo('water', 7, 11); await s.settle([/^Something on the panel calls out/]);
  p = await s.peek();
  check('dojo done: flows, baselines, a device calling out; the network tool levels up', p.f.wtDojoDone && p.extra.wt.dojo.every(Boolean) && await s.page.evaluate(() => /metadata/.test(WT_DOJO[0].explain) && /new is not/.test(WT_DOJO[1].explain) && /never talk to the internet/.test(WT_DOJO[2].explain)));

  // ---- Plant Board: Tide Badge, Lanternkeep -> Tidewatch ----
  await s.goTo('ptboard', 8, 2);
  await s.settle();
  p = await s.peek();
  check('Plant Board won: Tide Badge; rank stays Tier 3 lead investigator; Lanternkeep evolved into Tidewatch (still counts as Lanternkeep)',
    p.f.wtBoard && p.f.wtTide && p.rank === 'Tier 3 lead investigator' && p.party.some(t => t.id === 'tidewatch') && !p.party.some(t => t.id === 'lantern') && await s.page.evaluate(() => hasTool('lantern') && TOOLS.tidewatch.abil.includes('listen') && ABIL.listen.type === 'inv'), { party: p.party, rank: p.rank });
  const tide = await s.page.evaluate(() => {
    const spec = {threat: 'nudge', resp: ALERTS.nudge.mal.resp}; alertDecorate(spec);
    const sd = spec.resp.find(r => r.shutdown), ok = spec.resp.find(r => r.good);
    return { disrupt: sd.disrupt, signoff: !!sd.signoff, why: sd.why, good: ok.good, w: { preset: alertWeight('preset', 10), rewrite: alertWeight('rewrite', 10) }, badges: badgeCount() };
  });
  check('Tide Badge: a shutdown response is refused by the operators (no disruption, still wrong); internet-exposed (Preset) encounters halved',
    tide.disrupt === 0 && tide.signoff && /operators refused to sign off/.test(tide.why) && tide.good && tide.w.preset < tide.w.rewrite, tide);

  // ---- The boss (with every Quiet Thread clue already found) ----
  await s.page.evaluate(() => { const q = Series.qt(); Object.keys(QT_CLUES).forEach(id => { if (!q.cluesFound.includes(id)) q.cluesFound.push(id); }); q.stage = 2; Series.save(); qtMirror(); });
  await endShiftDesk(s);
  check('night 3', (await s.peek()).f.wtNight3);
  await s.goTo('water', 4, 3);
  p = await settleTo(s, /Tabletop: a booster station goes dark/);
  check('boss: leadership, CISA, the FBI and WaterISAC are told automatically, not by a card', !p.ui.options.some(o => /CISA|FBI|leadership|notify|report/i.test(o.label)), p.ui.options.map(o => o.label));
  check('boss: exposure and a default password reappear (BS-3, the vendor modem nobody listed)', p.metrics.wtExposed === 1 && p.metrics.wtDefault === 1, p.metrics);
  const bs = await s.page.evaluate(() => {
    const good = wtBossStages(['safe', 'asis', 'offnet', 'restore']), bad = wtBossStages([]);
    return { s1: good.s1.clues.join(' '), s2: good.s2.clues.join(' '), s3: good.s3.clues.join(' '), t: [good.s1.tech, good.s2.tech, good.s3.tech].join(), dGood: good.s3.dwell0, dBad: bad.s3.dwell0, cards: WT_CARDS.filter(x => x.good).map(x => x.id).join() };
  });
  check('boss stages: internet-exposed device (s1), loss of view (s2), default credentials (s3); hand control, read-out, restore and operator test; good cards make s3 easier',
    bs.t === 'T0883,T0829,T1694.001' && /in hand/.test(bs.s1) && /touched nothing/.test(bs.s1) && /read out and compared with the offline backup/.test(bs.s2) && /sign-off/.test(bs.s3) && bs.dGood < bs.dBad && bs.cards === 'safe,asis,offnet,restore', bs);
  await s.settle();
  p = await s.peek();
  check('boss done: restored safely; exposed and default back to 0; the real case cited (CISA alert, AA23-335A); safety-first response action',
    p.f.wtBoss && p.f.wtCards.length === 4 && p.extra.wt.boss.restored && p.metrics.wtExposed === 0 && p.metrics.wtDefault === 0 &&
    await s.page.evaluate(() => G.fm['fact:wtcase'] && /28 November 2023/.test(FACTS.wtcase.desc) && /switched to manual operations/.test(FACTS.wtcase.desc) && /CyberAv3ngers/.test(FACTS.wtcase.desc) && /default passwords/.test(FACTS.wtcase.desc) && G.fm['act:otrespond']), p.metrics);

  // ---- The Quiet Thread, handed to Rae (not resolved) ----
  await s.goTo('water', 16, 8);
  p = await settleTo(s, /svc-print on the vendor box/);
  await s.pickLabel(/^Delete svc-print from RA-01/);
  p = await s.waitUI('say');
  check('Quiet Thread: deleting svc-print’s account now is refused (it tells whoever made it; Rae’s call)', /tells whoever made it|my call/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /svc-print on the vendor box/);
  await s.pickLabel(/^Leave svc-print’s account on RA-01/);

  // ---- Summary ----
  p = await settleTo(s, /Water Plant district: secured/);
  check('Quiet Thread: added to the file, not resolved, not evicted; series save records it',
    (await s.peek()).f.wtFile && await s.page.evaluate(() => { const ser = JSON.parse(localStorage.getItem('uptime.series')); return ser.editions['town-hall'].svcPrintVendorBox === true && ser.quietThread.evicted === false; }));
  const sum = await s.modalText();
  check('summary: secured, Tide Badge, the drills, the thread still on file, “Next: Council Chambers”',
    /Water Plant district: secured/.test(sum) && /Tide/.test(sum) && /A set point at ten past two/.test(sum) && /still on file/.test(sum) && /Next: Council Chambers/.test(sum), sum.slice(0, 400));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after the district: objective points to Council Chambers (done, or the Council Chambers district); series save marks the Water Plant done', (p.objective.done || p.objective.district === 'council') && /Council Chambers/.test(p.objective.text) && await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].waterPlant === true), p.objective);
  check('Credits list the Water Plant sources and keep the MITRE notice', await s.page.evaluate(() => { const c = creditsHtml(); return /AA23-335A/.test(c) && /800-82/.test(c) && /62443-3-2/.test(c) && /T1694\.001/.test(c) && /reproduced and distributed with the permission of The MITRE Corporation/.test(c); }));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: zones and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await serverDone(ph, { wtMet: true, wtInv: true, wtExpose: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); WT(); G.map = 'water'; G.x = 13; G.y = 6; G.dir = 'down'; run(wtZones); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/water-phone-zones.png' });
  check('phone: zones modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  for (let n = 0; n < 40; n++) {
    const q = await ph.peek();
    if (!q.ui) { if (!q.busy) break; await sleep(30); continue; }
    if (q.ui.type === 'say') { await ph.page.tap('#panel'); await sleep(380); continue; }
    if (q.ui.type === 'choice') break;
    await tapOpt(ph, '@good'); await sleep(420);
  }
  await ph.settle();
  p = await ph.peek();
  check('phone: zones and conduits by taps (first pass clean: exposure 0, broken 0)', p.f.wtZones && p.extra.wt.zones.exposure === 0 && p.extra.wt.zones.broken === 0, p.extra.wt);
  await ph.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, {wtBackup: true, wtMon: true, wtNight1: true}); G.x = 4; G.y = 4; run(wtDrill1); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/water-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('WATER TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
