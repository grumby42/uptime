// Council Chambers checks (Town Hall district 9, the finale). Setup jumps the state past the Water Plant through the debug
// hook (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Tide Badge door (the Water Plant's south wall), arrival and the promotion to Security team lead, the team-lead
// scorecard, the NICE work-role mapping, the one-page incident response plan (legal counsel decides notification), the risk
// register (business owners, a council-level owner; CSF 2.0 Govern categories), the delegation mini-game (a full lead, a lead
// without the skill, the unsupported "usual supplier" close caught), outside contacts and CIRCIA's status, the plain-words
// council briefing (facts match the Water Plant), three drills (a key query on the wrong source does not support a verdict that
// `needs` another; guessing scores 40; focused 100), save/reload mid-district, the road-budget directive (risk in business
// terms; the council decides), the Governance dojo, the Council Board (Charter Badge), the team lead's escalation label, the
// town-wide incident as incident command (the lead doing everything, unplugging, "no data was taken", paying and announcing
// without counsel all refused), the Quiet Thread handed over and still open, the edition ending and credits, phone layout.
// Usage: node council.js   (UPTIME_FILE=file:///... to test another build)
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

// Front Desk to Server Room finished (copied from tests/water.js).
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
// Front Desk to Water Plant finished: Tier 3 lead investigator, Tide Badge, standing in the Water Plant's desk room by its south door.
async function waterDone(s, extra) {
  await serverDone(s, null, [{ id: 'annalist', lvl: 9, xp: 0, tuned: true }, { id: 'overwatch', lvl: 8, xp: 0, tuned: false }, { id: 'tidewatch', lvl: 8, xp: 0, tuned: false }, { id: 'tessera', lvl: 7, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sifter', lvl: 5, xp: 0, tuned: false }, { id: 'mirrorcoat', lvl: 6, xp: 0, tuned: false }, { id: 'bulwark', lvl: 6, xp: 0, tuned: false }]);
  await s.page.evaluate(extra => {
    const G = __UPTIME.state();
    Object.assign(G.f, { wtMet: true, wtInv: true, wtExpose: true, wtZones: true, wtBackup: true, wtMon: true, wtNight1: true, wtDrill1: true, wtDrill2: true, wtDirective: true, wtNight2: true, wtDrill3: true,
      wtDojoMet: true, wtDojoDone: true, wtBoard: true, wtTide: true, wtNight3: true, wtBoss: true, wtFile: true, wtSummary: true }, extra || {});
    WT(); Object.assign(G.wt, { day0: 16, exposed: 0, deflt: 0, inv: 41, backup: 7, vSince: { total: 1, ok: 1 } });
    G.day = 20; G.focusMax = 50; G.focus = 50;
    G.map = 'water'; G.x = 14; G.y = 14; G.dir = 'down';
  }, extra || null);
}
async function endShiftCouncil(s) {
  for (let k = 0; k < 6; k++) {
    await s.settle();
    await s.goTo('council', 13, 13);
    let q = await s.peek();
    if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/);
    else if (!q.ui) { await s.press('a'); q = await s.peek(); if (q.ui && q.ui.type === 'choice' && q.ui.options.some(o => /End shift/.test(o.label))) await s.pickLabel(/End shift/); }
    await s.settle();
    const r = await s.peek();
    if (!r.objective || !/End your shift/.test(r.objective.text)) return;
    if (k === 5) throw new Error('could not end the shift; obj=' + (r.objective && r.objective.text));
  }
}
// Pick good options until a modal or choice whose text matches re appears (then return it), answering says on the way.
async function upTo(s, re) { return settleTo(s, re); }
const sayText = async s => (await s.waitUI('say')).ui.text;

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Tide Badge door: the Water Plant's south wall (desk room) ----
  await waterDone(s, { wtTide: false });
  await s.press('down'); await sleep(80);
  p = await s.waitUI('say');
  check('without the Tide Badge the south door stays locked', /Tide Badge/.test(p.ui.text) && (await s.peek()).map === 'water', p.ui.text);
  await s.settle();
  check('the Water Plant south wall (14,15) is a door to Council Chambers; the Council Board is its own map', await s.page.evaluate(() =>
    MAPS.water.rows[15][14] === 'D' && MAPS.water.doors['14,15'].to === 'council' && MAPS.council.doors['14,0'].to === 'water' && MAPS.council.doors['0,7'].to === 'ccboard' && MAPS.ccboard.doors['17,5'].to === 'council'));

  // ---- Arrival: promotion, the problems, the team-lead scorecard ----
  await waterDone(s);
  await s.press('down'); await sleep(200);
  p = await s.peek();
  check('the Tide Badge opens the door into Council Chambers (north wall, facing down)', p.map === 'council' && p.x === 14 && p.y === 1 && p.dir === 'down', { map: p.map, x: p.x, y: p.y, dir: p.dir });
  await s.settle();
  await s.press('down'); await sleep(200);  // the first step inside starts the arrival scene
  await s.settle();
  p = await s.peek();
  check('arrival: promoted to Security team lead; metrics start (assign 45 min, busiest load 300%, decisions owned 25%, briefings none yet, actions closed 39%)',
    p.f.ccMet && p.rank === 'Security team lead' && p.metrics.ccAssign === 45 && p.metrics.ccLoad === 300 && p.metrics.ccOwner === 25 && p.metrics.ccBrief === null && p.metrics.ccActions === 39, { rank: p.rank, m: p.metrics });
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the five team-lead metrics', /Mean time to assign/.test(sc0) && /Busiest person’s load/.test(sc0) && /Decisions with a named owner/.test(sc0) && /Council briefings on time/.test(sc0) && /Post-incident actions closed/.test(sc0));
  check('the map: dais, clerk’s desk, press room, legal office, war room, team board, dojo terminals, desk; no cabling (no new alerts on the map)', await s.page.evaluate(() => {
    const all = MAPS.council.rows.join('');
    return MAPS.council.rows.every(r => r.length === 30) && ['_', '§', '¶', '£', '¥', 'µ', '¤', 'Y'].every(c => all.includes(c)) && ![...all].some(c => TILES[c] && TILES[c].grass) && !Object.values(THREATS).some(t => t.district === 'council');
  }));
  check('NICE work role mapping: no clean match; closest Incident Response (PD-WRL-003); executive role OG-WRL-007', await s.page.evaluate(() => G.fm['fact:ccnice'] && /PD-WRL-003/.test(FACTS.ccnice.desc) && /no work role for a security team lead/.test(FACTS.ccnice.desc) && /OG-WRL-007/.test(FACTS.ccnice.desc)));

  // ---- Fieldwork 1: the one-page plan; legal counsel decides notification ----
  await s.goTo('council', 12, 7);
  p = await settleTo(s, /How do you write the town’s incident response plan/);
  await s.pickLabel(/^A full binder/);
  check('plan: a binder for every scenario is refused', /binder/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^One page:/);
  p = await settleTo(s, /who decides whether residents must be told/);
  await s.pickLabel(/^You, as incident commander/);
  check('plan: the incident commander deciding notification is refused (a legal judgement)', /legal judgement/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^Noor, the town attorney/);
  await s.settle();
  p = await s.peek();
  check('plan done: war room table carries the tick; decisions owned 5/12; SP 800-61 Rev. 3 roles (no “incident commander” in it) and CTEP facts',
    p.f.ccPlan && p.extra.cc.dec.owned === 5 && await s.page.evaluate(() => tileDef('council', 12, 7).pal === 'ccWarOk' && G.fm['fact:cc80061'] && /does not use the term “incident commander”/.test(FACTS.cc80061.desc) && /April 2025/.test(FACTS.cc80061.desc) && G.fm['fact:ccctep']), p.extra.cc.dec);

  // ---- Fieldwork 2: the risk register, owned by the business ----
  await s.goTo('council', 19, 2);
  p = await settleTo(s, /Vendor emergency access to the water plant/);
  await s.pickLabel(/^Joss Kettering/);
  check('risk register: the engineer who runs the windows is not the owner of the plant’s risk', /Gil’s/.test(await sayText(s)));
  for (let n = 0; n < 60; n++) {
    p = await s.peek();
    if (!p.ui) { await sleep(20); continue; }
    if (p.ui.type === 'choice' && /council level/.test(p.ui.text || '')) break;
    if (p.ui.type === 'say') { await s.press('a'); continue; }
    await pickGood(s);
  }
  await s.pickLabel(/^The insurer:/);
  check('risk register: the insurer does not own the town’s risk (insurance moves part of a loss)', /part of a loss/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^A councillor:/);
  await s.settle();
  p = await s.peek();
  check('risk register: four risks owned; decisions owned 9/12; clerk’s desk ticked; CSF 2.0 Govern categories verified; risk responses fact',
    p.f.ccRisk && p.extra.cc.dec.owned === 9 && Object.keys(p.extra.cc.risks).length === 4 && await s.page.evaluate(() => tileDef('council', 18, 2).pal === 'ccClerkOk' &&
      ['GV.OC', 'GV.RM', 'GV.RR', 'GV.PO', 'GV.OV', 'GV.SC'].every(x => FACTS.cccsf.desc.includes(x)) && /accept, transfer, mitigate or avoid/.test(FACTS.ccregister.desc) && G.fm['act:ccrisk']), p.extra.cc);

  // ---- Fieldwork 3: delegation (overload one lead, try a lead without the skill, catch the unsupported close) ----
  await s.goTo('council', 23, 7);
  p = await settleTo(s, /Delegate · Front Desk/);
  await s.pickLabel(/^Beatriz Solano$/);
  check('delegation: a full lead still takes it, but the case waits (+8)', /full queue/.test(await sayText(s)));
  p = await settleTo(s, /Delegate · Mail Room/);
  await s.pickLabel(/^Joss Kettering$/);
  check('delegation: a lead without the skill hands it back (+12)', /not my area/.test(await sayText(s)));
  let reviewed = 0, caughtMsg = '';
  for (let n = 0; n < 200; n++) {
    p = await s.peek();
    if (!p.ui) { if (!p.busy) break; await sleep(20); continue; }
    if (p.ui.type === 'say') { if (/calls the supplier back/.test(p.ui.text)) caughtMsg = p.ui.text; await s.press('a'); continue; }
    const txt = await s.modalText();
    if (/Delegation · result/.test(txt)) break;
    if (/Returned ·/.test(txt)) reviewed++;
    await pickGood(s);
  }
  const res = await s.modalText();
  await s.settle();
  p = await s.peek();
  check('delegation: the unsupported Mail Room close (“usual supplier”, no evidence) is sent back and caught; the call-back clears it', p.extra.cc.deleg.caught === 1 && /calls the supplier back/.test(caughtMsg) && reviewed === 8, { d: p.extra.cc.deleg, reviewed });
  check('delegation score: mean time to assign (4+8+12+4 + 6×4)/8 = 6 min; one lead over capacity; busiest load 133%; team board ticked',
    p.f.ccDeleg && p.extra.cc.deleg.mean === 6 && p.extra.cc.deleg.over === 1 && p.metrics.ccAssign === 6 && p.metrics.ccLoad === 133 && /over capacity: 1 /.test(res) && await s.page.evaluate(() => tileDef('council', 23, 7).pal === 'ccTeamOk'), { d: p.extra.cc.deleg, m: p.metrics });

  // ---- Fieldwork 4: outside contacts; CIRCIA's status ----
  await s.goTo('council', 5, 8);
  p = await settleTo(s, /What does the contact page say/);
  await s.pickLabel(/^Every resident, the press and the state/);
  check('contacts: telling everyone the same morning is refused', /wrong numbers/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^Our reports to the FBI and CISA/);
  await s.settle();
  check('contacts: CIRCIA fact says 72 h / 24 h once the final rule takes effect, proposed 4 April 2024, final rule not yet published (1 Nov 2026), coverage is counsel’s question',
    await s.page.evaluate(() => G.f.ccContacts && G.fm['fact:cccircia'] && /72 hours/.test(FACTS.cccircia.desc) && /24 hours/.test(FACTS.cccircia.desc) && /4 April 2024/.test(FACTS.cccircia.desc) && /has not been published/.test(FACTS.cccircia.desc) && /counsel/.test(FACTS.cccircia.desc)));

  // ---- Fieldwork 5: the plain-words council briefing on the booster station ----
  await s.goTo('council', 5, 2);
  p = await settleTo(s, /Briefing · What happened/);
  await s.pickLabel(/^An internet-accessible device/);
  check('briefing: jargon (ATT&CK IDs, device names) is refused for the council', /Codes and guesses/.test(await sayText(s)));
  await s.settle();
  p = await s.peek();
  check('briefing done: briefings on time 100%; decisions owned 10/12 (83%)', p.f.ccBriefed && p.metrics.ccBrief === 100 && p.metrics.ccOwner === 83, p.metrics);
  check('briefing facts match the Water Plant: zone 3 never short, pumps in hand until 16:10, modem gone', await s.page.evaluate(() => {
    const g = CC_BRIEF.map(x => x.opts.find(o => o.good).label).join(' ');
    return /Nobody in zone 3 lost water/.test(g) && /16:10/.test(g) && /modem is gone/.test(g) && /02:40/.test(CC_BRIEF[1].opts[2].label);
  }));

  // ---- Night 1; drill 1: a key query on the wrong source does not support a verdict that needs another ----
  const day0 = (await s.peek()).day;
  await endShiftCouncil(s);
  p = await s.peek();
  check('night 1: next day; leads closed four actions (13/23 = 57%)', p.f.ccNight1 && p.day === day0 + 1 && p.metrics.ccActions === 57, p.metrics);
  await s.goTo('council', 25, 8);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Paz’s query log/); await s.pickLabel(/Which sources did her queries reach/); await s.waitUI('modal');
  check('drill 1: Paz’s query log shows one query, the WAF dashboard, and no access or database log', /WAF dashboard/.test(await s.modalText()) && /No query to PORTAL-01/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^The close stands, but only now/);
  await s.pickLabel(/^Her only query was the WAF count/);
  await s.pickLabel(/One request got past the WAF/); await s.pickLabel(/scanner moved to a new address/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('drill 1 (needs): reviewing the close without PORTAL-01’s logs is unsupported and says why (score 50); T1190', /Score 50 \/ 100/.test(deb1) && /Unsupported:/.test(deb1) && /access and database logs/.test(deb1) && /T1190/.test(deb1), deb1.slice(0, 400));
  await s.settle();
  const d1 = await s.page.evaluate(() => { const D = CC_DRILLS.review; return { traps: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => x.id)), []), keys: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.key).map(q => x.id)), []), needs: D.verdicts.find(v => v.good).needs }; });
  check('drill 1: traps are Paz’s seniority and her certainty; keys are her query log and PORTAL-01’s logs; the verdict needs PORTAL-01’s logs', d1.traps.join() === 'record,note' && d1.keys.join() === 'qlog,access' && d1.needs === 'access', d1);

  // ---- Save/reload mid-district ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Council-Chambers restores map, flags, rank, party, metrics, council state, Quiet Thread',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) && JSON.stringify(before.party) === JSON.stringify(after.party) &&
    JSON.stringify(before.extra) === JSON.stringify(after.extra) && JSON.stringify(before.metrics) === JSON.stringify(after.metrics) && JSON.stringify(before.qt) === JSON.stringify(after.qt), { before: before.extra.cc, after: after.extra.cc });

  // ---- The directive: present risk in business terms, the council decides ----
  await s.goTo('council', 2, 3);
  p = await settleTo(s, /How do you answer the roads committee/);
  await s.pickLabel(/^Refuse outright/);
  check('directive: refusing outright is wrong (every budget line is the council’s)', /council’s to set/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^Warn them the town will be hacked/);
  check('directive: a threat with no numbers is wrong too', /no numbers/.test(await sayText(s)));
  await s.untilChoice(); await s.pickLabel(/^Lay out what the two posts change/);
  await s.settle();
  p = await s.peek();
  check('directive met: the council decides and signs; decisions owned 11/13; scorecard shows it (game)', p.f.ccDirective && p.extra.cc.dec.owned === 11 && p.extra.cc.dec.total === 13 && /Directive: the council keeps one night post.*\(game\)/.test(await s.page.evaluate(() => scorecardHtml())) && await s.page.evaluate(() => G.fm['act:ccriskbiz']), p.extra.cc.dec);

  // ---- Night 2; drill 2 by guessing (scores low) ----
  await endShiftCouncil(s);
  p = await s.peek();
  check('night 2: three more actions closed (16/23 = 70%)', p.f.ccNight2 && p.metrics.ccActions === 70, p.metrics);
  await s.goTo('council', 25, 2);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^About us but old/);
  await s.pickLabel(/^The sample’s file names are on Noor’s list/);
  await s.pickLabel(/Something new left this week/); await s.pickLabel(/another town’s files/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2 guessing: right verdict with no decisive query scores 40, unsupported; incident records and FS-02 decide; T1567.002', /Score 40 \/ 100/.test(deb2) && /Unsupported:/.test(deb2) && /incident records/.test(deb2) && /T1567\.002/.test(deb2), deb2.slice(0, 300));
  await s.settle();
  check('drill 2 matches Records Hall: 3.8 GB of planning applications from PLAN-LT-04; traps are the reporter and the shares; needs our records', await s.page.evaluate(() => {
    const D = CC_DRILLS.press, rec = D.sources.find(x => x.id === 'records').qs[0].res.join(' ');
    return /3\.8 GB of planning applications/.test(rec) && /PLAN-LT-04/.test(rec) && /1,204 resident records/.test(rec) && D.verdicts.find(v => v.good).needs === 'records' &&
      D.sources.filter(x => x.qs.some(q => q.kind === 'trap')).map(x => x.id).join() === 'reporter,social';
  }));

  // ---- Drill 3 focused (scores 100): the insurer's MFA question ----
  await s.goTo('council', 19, 2);
  await s.untilChoice(); await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Identity system: sign-in records/); await s.pickLabel(/What did fd-admin’s sign-ins pass with/); await s.waitUI('modal');
  check('drill 3: fd-admin’s sign-in from abroad passed on a password alone; excluded through MFA-Exceptions', /password only/.test(await s.modalText()) && /MFA-Exceptions/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: The MFA exceptions list/); await s.pickLabel(/Who was on the exceptions list/); await s.waitUI('modal');
  check('drill 3: the list held fd-admin, “for convenience”, with no approver and no expiry (the Front Desk boss’s own words)', /for convenience/.test(await s.modalText()) && /No approver/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^No: fd-admin was on the exceptions list/);
  await s.pickLabel(/^The MFA policy didn’t apply/);
  await s.pickLabel(/Another account on the exceptions list/); await s.pickLabel(/second factor the records missed/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3 focused: 100; the answer is no; counsel reads it before it is signed', /Score 100 \/ 100/.test(deb3) && /Answer no/.test(deb3) && /Noor reads the answer/.test(deb3), deb3.slice(0, 300));
  await s.settle();
  check('drill 3 traps are the policy and the CIO’s memory; the verdict needs the sign-in records; Front Desk text still says fd-admin was on an exception list “for convenience”', await s.page.evaluate(() => {
    const D = CC_DRILLS.insurer; return D.sources.filter(x => x.qs.some(q => q.kind === 'trap')).map(x => x.id).join() === 'policy,memory' && D.verdicts.find(v => v.good).needs === 'signin' && /exception” list, for convenience/.test(JSON.stringify(bossStages([])));
  }));
  p = await s.peek();
  check('three drills led', p.extra.cc.led >= 3 && Object.keys(p.extra.cc.drills).length === 3, p.extra.cc.drills);

  // ---- Dojo (one wrong answer first) ----
  await s.goTo('council', 10, 11); await s.settle();
  await s.goTo('council', 3, 11);
  await s.untilChoice(); await s.pickLabel(/^Transfer it:/);
  check('dojo 1: transferring a risk to insurance is not the treatment here', /Not quite/.test(await sayText(s)));
  await s.settle([/^Accept it in writing/]);
  await s.goTo('council', 5, 11); await s.settle([/^How exceptions work/]);
  await s.goTo('council', 7, 11); await s.settle([/^Approve \$40,000/]);
  p = await s.peek();
  check('dojo done: treatment, a policy’s exceptions process, the one-line ask', p.f.ccDojoDone && p.extra.cc.dojo.every(Boolean) && await s.page.evaluate(() => /four answers to a risk/.test(CC_DOJO[0].explain) && /fd-admin/.test(CC_DOJO[1].explain)));

  // ---- Council Board: Charter Badge ----
  await s.goTo('ccboard', 8, 2);
  p = await settleTo(s, /Round 2: do we tell residents/);
  await s.pickLabel(/^Yes, say so now/);
  check('Council Board: announcing before counsel reads the facts is refused', /before counsel/.test(await sayText(s)));
  await s.settle();
  p = await s.peek();
  const ch = await s.page.evaluate(() => { const spec = genAlert('fp'); return { ev0: spec.ev0, badges: badgeCount(), fm: G.focusMax }; });
  check('Board won: Charter Badge; every queued alert starts with Evidence 15; Focus 52; decisions owned 100%', p.f.ccBoard && p.f.ccCharter && ch.ev0 === 15 && ch.fm === 52 && p.metrics.ccOwner === 100 && ch.badges === 9, { ch, m: p.metrics });

  // ---- As team lead, an escalation goes to the district lead ----
  await s.page.evaluate(() => { G.queue = 1; G.focus = G.focusMax; });
  await s.goTo('council', 12, 12); await s.settle();
  await s.press('select');
  for (let i = 0; i < 40; i++) { p = await s.peek(); if (p.ui && p.ui.type === 'choice' && p.battle) break; if (p.ui && p.ui.type === 'say') await s.press('a'); await sleep(20); }
  check('battle: the escalation option is “Hand to the district lead” for a team lead', p.ui && p.ui.options.some(o => o.label === 'Hand to the district lead'), p.ui && p.ui.options.map(o => o.label));
  await s.settle();

  // ---- The boss: incident command (with a briefing guess and a payment refused) ----
  await endShiftCouncil(s);
  check('night 3', (await s.peek()).f.ccNight3);
  await s.goTo('council', 12, 7);
  p = await settleTo(s, /Stage 1 \(00:50\)/);
  await s.pickLabel(/^Run it yourself/);
  check('boss stage 1: the lead doing everything personally is wrong (command, then assign)', /Command, then assign/.test(await sayText(s)));
  p = await settleTo(s, /Stage 1 \(00:50\)/);
  await s.pickLabel(/^Unplug the laptop/);
  check('boss stage 1: unplugging the laptop loses its memory (preserve first)', /loses the laptop’s memory/.test(await sayText(s)));
  p = await settleTo(s, /Stage 2 \(08:00\)/);
  await s.pickLabel(/^That no resident data was taken/);
  check('boss stage 2: promising “no data was taken” before the evidence is wrong (9 MB left)', /9 MB left/.test(await sayText(s)));
  p = await settleTo(s, /Stage 3 \(14:00\)/);
  await s.pickLabel(/^Pay quietly/);
  check('boss stage 3: paying quietly without counsel is wrong', /Noor and law enforcement/.test(await sayText(s)));
  p = await settleTo(s, /Stage 3 \(14:00\)/);
  await s.pickLabel(/^Announce this evening/);
  check('boss stage 3: announcing before Noor decides is wrong', /Noor has decided/.test(await sayText(s)));
  await s.settle();
  p = await s.peek();
  check('boss done: briefings on time 1 of 3 (stage 2 and the 14:00 plan both started wrong), decisions owned 16/16, three new actions (16/26); incident-command action',
    p.f.ccBoss && p.extra.cc.brief.on === 1 && p.extra.cc.brief.total === 3 && p.metrics.ccBrief === 33 && p.extra.cc.dec.owned === 16 && p.extra.cc.dec.total === 16 && p.extra.cc.act.total === 26 && await s.page.evaluate(() => G.fm['act:cccommand']), p.extra.cc);
  check('boss stages: the wrong options include the lead doing it all, a guess, “no data taken”, paying and announcing without counsel', await s.page.evaluate(() => {
    const S = ccBossStages(), bad = Object.values(S).flatMap(x => x.resp.filter(r => !r.good).map(r => r.label)).join(' | ');
    return /Run it yourself/.test(bad) && /at least 40,000 rows/.test(bad) && /no resident data was taken/.test(bad) && /Pay quietly/.test(bad) && /Announce this evening/.test(bad);
  }));

  // ---- The Quiet Thread: handed over, not resolved ----
  const qt0 = (await s.peek()).qt.cluesFound.length;
  await s.goTo('council', 25, 8);
  p = await settleTo(s, /The suspicion file/);
  await s.pickLabel(/^Present it to the full council in open session/);
  check('quiet: an open session is public (whoever is behind svc-print can read the minutes)', /read the minutes/.test(await sayText(s)));
  p = await settleTo(s, /The suspicion file/);
  await s.pickLabel(/^Close the file:/);
  check('quiet: closing the file on ninety quiet days is refused', /can’t explain/.test(await sayText(s)));
  p = await settleTo(s, /The suspicion file/);
  await s.pickLabel(/^Hand it over formally/);
  p = await settleTo(s, /Town Hall: every district secured/);
  check('quiet: handed to the council’s risk committee and the outside firm; still open, not evicted; no new clue or technique',
    (await s.peek()).f.ccFile && await s.page.evaluate(n => { const ser = JSON.parse(localStorage.getItem('uptime.series')); return ser.editions['town-hall'].suspicionFileHandedOver === true && ser.quietThread.evicted === false && ser.quietThread.cluesFound.length === n && !Object.keys(QT_CLUES).some(k => /^cc-/.test(k)); }, qt0));

  // ---- The edition ending ----
  const sum = await s.modalText();
  check('ending: nine districts with badges and drill scores, the scorecard, the thread still open, credits, “Next edition: coming later”',
    /Town Hall: every district secured/.test(sum) && ['Front Desk', 'Mail Room', 'Clerks’ Row', 'Market Square', 'Records Hall', 'IT Basement', 'Server Room', 'Water Plant', 'Council Chambers'].every(d => sum.includes(d)) &&
    /Charter/.test(sum) && /A close that cites one query/.test(await s.page.evaluate(() => CC_DRILLS.review.title)) && /still open/.test(sum) && /Credits/.test(sum) && /Next edition: coming later/.test(sum), sum.slice(0, 500));
  await s.pickLabel(/^Credits$/);
  await s.waitUI('modal');
  check('ending: Credits list the Council Chambers sources and keep the MITRE notice', /Council Chambers: NIST CSF 2\.0/.test(await s.modalText()) && /800-61 Rev\. 3/.test(await s.modalText()) && /CIRCIA/.test(await s.modalText()) && /reproduced and distributed with the permission of The MITRE Corporation/.test(await s.modalText()));
  await s.pickLabel(/^Back$/);
  p = await settleTo(s, /Town Hall: every district secured/);
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after the ending: objective done; series save marks the edition complete; the series menu promises nothing specific', p.objective.done && /Next edition: coming later/.test(p.objective.text) && p.metrics.ccActions === 73 &&
    await s.page.evaluate(() => { const e = JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall']; return e.councilChambers === true && e.editionComplete === true; }), { obj: p.objective, m: p.metrics });
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: delegation and drill modals fit, options tappable; a clean delegation run ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await waterDone(ph);
  await ph.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, {ccMet: true, ccPlan: true, ccRisk: true}); CC(); G.rank = 'Security team lead'; G.map = 'council'; G.x = 23; G.y = 8; G.dir = 'up'; run(ccDelegate); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/council-phone-delegate.png' });
  check('phone: delegation modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  for (let n = 0; n < 80; n++) {
    const q = await ph.peek();
    if (!q.ui) { if (!q.busy) break; await sleep(30); continue; }
    if (q.ui.type === 'say') { await ph.page.tap('#panel'); await sleep(380); continue; }
    await tapOpt(ph, '@good'); await sleep(420);
  }
  await ph.settle();
  p = await ph.peek();
  check('phone: a clean delegation by taps (4 min to assign, nobody over capacity, the close caught)', p.f.ccDeleg && p.extra.cc.deleg.mean === 4 && p.extra.cc.deleg.over === 0 && p.extra.cc.deleg.caught === 1 && p.metrics.ccLoad <= 100, p.extra.cc.deleg);
  await ph.page.evaluate(() => { const G = __UPTIME.state(); Object.assign(G.f, {ccContacts: true, ccBriefed: true, ccNight1: true}); G.x = 25; G.y = 9; run(ccDrill1); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/council-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('COUNCIL TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
