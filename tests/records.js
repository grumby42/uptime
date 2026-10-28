// Records Hall checks (Town Hall district 5). Setup jumps the state past Market Square through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Lantern Badge door, arrival and the Tier 2 recovery metrics, the timed restore test (a job that said
// Success fails to restore), the business impact analysis (the directory and DNS are on the critical list) and RTO/RPO
// agreed with the owner, 3-2-1 with an offline copy and an escrowed key, separate backup credentials, the Quiet Thread
// backup-console clue (T1555), drills (guessing scores 40; focused paths 100; Tally and a trap cost), save/reload
// mid-district, the finance directive (retention vs cost vs RPO), the alert mix and the Vault Badge halving, the Dojo,
// the Records Board (Vault Badge, Cairn -> Bulwark), mean time to contain, the restore-order rules (dependencies and
// reinfection from a tainted copy), the ransomware incident (automatic reporting, tabletop, the pay decision with the
// FBI and OFAC framing, three stages, recovery in dependency order from clean points), the summary, and the phone layout.
// Usage: node records.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));
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

// Front Desk, Mail Room, Clerks' Row and Market Square finished: Tier 2, five badges short of the Vault Badge, Day 7,
// standing on the plaza below the Records Hall door.
function marketDone(s, extra, party) {
  return s.page.evaluate(([extra, party]) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'ledger', kiosk: true, wifi: true, logs: true, onboarded: true, halHint: true, portDone: true, vexMet: true, vexDone: true, insider: 'defused', dojoMet: true, dojoDone: true, boardDone: true, bossDone: true, summaryShown: true, directive: true, autoUnlocked: true,
      mrArrived: true, mrMet: true, mrInbox: true, mrDrill1: true, mrReport: true, mrSms: true, mrVish: true, mrDrill2: true, mrDirective: true, mrNight: true, mrDrill3: true, mrOsintMet: true, mrOsintDone: true, mrBoard: true, mrSeal: true, mrBoss: true, mrSummary: true,
      crMet: true, crAdmin: true, crTriage: true, crAsr: true, crPslogGpo: true, crPslog: true, crDrill1: true, crException: true, crDrill2: true, crNight: true, crDrill3: true, crDojoMet: true, crDojoDone: true, crBoard: true, crShield: true, crContain: false, crContained: true, crBoss: true, crSummary: true,
      mkMet: true, mkInv: true, mkWafDetect: true, mkCms: true, mkTest: true, mkCsp: true, mkNight1: true, mkDrill1: true, mkWafBlock: true, mkDirective: true, mkDrill2: true, mkNight2: true, mkDrill3: true, mkDojoMet: true, mkDojoDone: true, mkBoard: true, mkLantern: true, mkBoss: true, mkScopeDone: true, mkSummary: true }, extra || {});
    G.pcs = { 11: true, 14: true, 17: true }; G.day = 7; G.rank = 'Tier 2 incident responder'; G.badge = true; G.focusMax = 40; G.focus = 40;
    G.party = party || [{ id: 'overwatch', lvl: 9, xp: 0, tuned: true }, { id: 'ledger', lvl: 4, xp: 0, tuned: false }, { id: 'lantern', lvl: 5, xp: 0, tuned: false }, { id: 'keyling', lvl: 5, xp: 0, tuned: false }, { id: 'reportbird', lvl: 5, xp: 0, tuned: false }, { id: 'sifter', lvl: 5, xp: 0, tuned: false }, { id: 'mirrorcoat', lvl: 6, xp: 0, tuned: false }];
    G.active = 0;
    MR(); G.mr.rep = { seen: 34, reported: 20 };
    CR(); G.cr.admins = 0; G.cr.triage = {}; crPatchAll();
    MK(); G.mk.found = MK_ASSETS.map(a => a.id); G.mk.check = 'q15';
    G.map = 'hub'; G.x = 15; G.y = 18; G.dir = 'up';
  }, [extra || null, party || null]);
}
// Advance until a choice or modal whose text matches re appears (dialogue and other choices are settled on the way).
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
      // In a battle: investigate until Evidence >= 70, then close with the true verdict and the good response.
      const o = p.ui.options, b = p.battle, en = i => o[i] && !o[i].disabled, find = f => o.findIndex((x, i) => en(i) && f(x.meta || {}, x));
      if (find(m => m.kind === 'close') >= 0) {
        idx = find(m => m.kind === 'close');
        if (b.ev < 70) { let bs = -1; o.forEach((x, i) => { const m = x.meta || {}; if (en(i) && m.kind === 'ability' && m.type === 'inv' && m.eff * 10 - m.cost > bs) { bs = m.eff * 10 - m.cost; idx = i; } }); }
      } else if (find(m => m.verdict) >= 0) idx = find(m => m.verdict === b.kind);
      else idx = find(m => m.good === true);
    }
    if (idx < 0) idx = p.ui.options.findIndex(o => !o.disabled);
    await s.pickLabel(new RegExp('^' + p.ui.options[idx].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  }
  throw new Error('settleTo timed out: ' + re);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Lantern Badge door ----
  await marketDone(s, { mkLantern: false });
  await s.goTo('hub', 15, 18, true);
  await s.press('up'); await sleep(60);
  p = await s.waitUI('say');
  check('Records Hall door is locked without the Lantern Badge', /Lantern Badge/.test(p.ui.text) && (await s.peek()).map === 'hub', p.ui.text);
  await s.settle();
  check('the plaza has a Records Hall building between the Identity Board and the Dojo; the Owen and Grace spots are untouched', await s.page.evaluate(() =>
    MAPS.hub.rows[15].slice(13, 17) === 'PPPP' && MAPS.hub.rows[17].slice(13, 17) === 'PPDP' && MAPS.hub.rows[10].slice(4, 8) === 'ccDc' && MAPS.hub.rows[10][8] === '.' && MAPS.hub.rows[9][12] === '.'));

  // ---- Arrival ----
  await marketDone(s);
  await s.goTo('records', 14, 6);
  await s.settle();
  p = await s.peek();
  check('arrival: Odile met; Records Hall metrics start (offline copies 0%, nothing tested, no objectives yet)', p.f.rhMet && p.metrics.rhOffline === 0 && p.metrics.rhTest === null && p.metrics.rhRto === null && p.metrics.rhRpo === null, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the Tier 2 Records Hall metrics with targets', /Restore test success rate/.test(sc0) && /measured recovery time within RTO/.test(sc0) && /within RPO/.test(sc0) && /Critical systems with an offline copy/.test(sc0) && /Mean time to contain, Records Hall/.test(sc0) && /backup console <b>domain admin<\/b>/.test(sc0));
  check('still Tier 2; the stacks, the vault, the restore lab, the Dojo and the Board door are on the map', p.rank === 'Tier 2 incident responder' && await s.page.evaluate(() => {
    const r = MAPS.records.rows; return r.length === 16 && r.every(x => x.length === 30) && r[1].includes('mm') && r[1].includes('yyy4') && r[11].split('5').length === 4 && r[11].split('7').length === 4 && r[7][29] === 'D' && r[1][1] === '0'; }));

  // ---- Fieldwork 1: the timed restore test ----
  await s.goTo('records', 5, 11);
  await s.untilChoice();
  await s.pickLabel(/Read the job reports/);
  p = await s.waitUI('say');
  check('restore test: “green means it works” is refused', /Green means the job finished/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Restore real systems into the isolated lab/);
  p = await settleTo(s, /Restore tests/);
  const rt = await s.modalText();
  check('restore test: every job said Success, 2 of 3 restore; the portal fails (its second disk was never selected)', /2 of 3 passed/.test(rt) && /second disk the job never selected/.test(rt) && /Every one of those jobs said Success/.test(rt), rt.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('restore test success rate 75% (3 of 4, the failure counts); no RTO to compare with yet', p.f.rhTest && p.metrics.rhTest === 75 && p.extra.rh.tests === 4 && p.metrics.rhRto === null, p.metrics);

  // ---- Fieldwork 2: business impact analysis, RTO and RPO with the owner ----
  await s.goTo('records', 5, 13);
  p = await settleTo(s, /Business impact analysis/);
  for (const re of [/^Records database/, /^Permits portal/, /^Department file shares/, /staff intranet/, /scanned-image archive/]) await s.pickLabel(re);
  await s.pickLabel(/This is the critical list/);
  p = await s.waitUI('say');
  check('BIA: leaving out the directory and DNS is corrected (the systems the critical services depend on)', /directory and DNS/.test(p.ui.text) && /depend on/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Zero downtime and zero data loss/);
  p = await s.waitUI('say');
  check('RTO/RPO: zero for everything is refused (objectives come from what the business can bear)', /what the business can bear/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Whatever the nightly job gives us/);
  p = await s.waitUI('say');
  check('RTO/RPO: letting the nightly job set the RPO is refused', /schedule should follow/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Ask Deshawn when the harm starts/);
  p = await settleTo(s, /Recovery objectives/);
  const obj = await s.modalText();
  check('objectives table: RTO inside the owner’s limit, SP 800-34 Rev. 1 definitions, directory and DNS never tested', /Owner’s limit \(MTD\)/.test(obj) && /NIST SP 800-34 Rev\. 1/.test(obj) && /point in time to which data must be recovered/.test(obj) && /never been tested/.test(obj), obj.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('BIA done: critical list is the five (directory and DNS included); measured within RTO 60%, recoverable within RPO 100% (permits twice a day)',
    p.f.rhBia && p.extra.rh.crit.length === 5 && p.extra.rh.crit.includes('dir') && p.extra.rh.crit.includes('dns') && p.metrics.rhRto === 60 && p.metrics.rhRpo === 100, { m: p.metrics, crit: p.extra.rh.crit });
  check('RTO is shorter than the owner’s limit for every system; SP 800-34 facts verbatim-faithful', await s.page.evaluate(() => Object.values(RH_OBJ).every(o => o.rto < o.mtd) && G.fm['fact:sp80034'] &&
    /point in time to which data must be recovered after an outage/.test(FACTS.sp80034.desc) && /RTO must normally be shorter/.test(FACTS.sp80034.desc)));

  // ---- Fieldwork 3: 3-2-1, offline, the key ----
  await s.goTo('records', 21, 1);
  await s.untilChoice(); await s.pickLabel(/second copy on the same appliance/);
  p = await s.waitUI('say');
  check('copies: a second copy on the same appliance is refused', /Same box/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/cloud storage mapped as a drive/);
  p = await s.waitUI('say');
  check('copies: a drive the file server can write to is not a safe copy', /ransomware on the file server can encrypt/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Three copies on two kinds of storage/);
  p = await s.waitUI('say');
  check('3-2-1 is taught as a rule of thumb that never said offline', /rule of thumb/.test(p.ui.text) && /offline/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/backup server’s settings/);
  p = await s.waitUI('say');
  check('key: keeping the only tape key on the backup server is refused', /only key/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^In the key vault, with an escrowed copy/);
  p = await s.untilChoice();
  check('offline coverage starts at 80%: the directory’s job writes to the appliance only', (await s.peek()).metrics.rhOffline === 80 && /4 of the 5 critical systems/.test(p.ui.text), p.ui.text);
  await s.pickLabel(/Leave it/);
  p = await s.waitUI('say');
  check('leaving the directory off the tapes is refused', /Rebuilding it from memory/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Add the directory’s backup/);
  await s.settle();
  p = await s.peek();
  check('offline copy: 100% of critical systems, key escrowed; worst 0% kept on the scorecard', p.f.rhOffline && p.metrics.rhOffline === 100 && p.extra.rh.keyEscrow && await s.page.evaluate(() => G.track.rhOffline.worst === 0 && G.track.rhOffline.best === 100), p.metrics);
  check('3-2-1 and the #StopRansomware Guide facts (NCSC wording, offline and encrypted, switch-level isolation)', await s.page.evaluate(() => G.fm['fact:rule321'] && G.fm['fact:srguide'] &&
    /at least 3 copies, on 2 devices, and 1 offsite/.test(FACTS.rule321.desc) && /doesn’t require any copy to be offline/.test(FACTS.rule321.desc) && /offline, encrypted backups/.test(FACTS.srguide.desc) && /switch level/.test(FACTS.srguide.desc)));

  // ---- Fieldwork 4: separate backup credentials ----
  await s.goTo('records', 22, 1);
  await s.untilChoice(); await s.pickLabel(/Change the domain admin password/);
  p = await s.waitUI('say');
  check('credentials: a new domain password is stolen the same way; domain passwords shouldn’t open backups', /shouldn’t open the backups/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Give backup rights to fewer domain admins/);
  p = await s.waitUI('say');
  check('credentials: fewer domain admins is still domain admins', /Steal one and you have the backups/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Separate backup admin accounts/);
  await s.settle();
  p = await s.peek();
  check('separate backup credentials with MFA; the vault changes colour; the NCSC principles fact', p.f.rhCreds && await s.page.evaluate(() => tileDef('records', 21, 1).pal === 'vaultOk' && G.fm['fact:ncscbk'] &&
    /separate from those used for the rest of the network/.test(FACTS.ncscbk.desc) && /MFA/.test(FACTS.ncscbk.desc) && /whether or not the attempt succeeds/.test(FACTS.ncscbk.desc) && /separate accounts with MFA/.test(scorecardHtml())));

  // ---- Night 1 ----
  const day0 = (await s.peek()).day;
  await s.goTo('records', 8, 14); await s.settle();
  p = await s.peek();
  check('end of shift: next day, the overnight rename alert', p.f.rhNight1 && p.day === day0 + 1, { day: p.day });

  // ---- Quiet Thread: the backup console ----
  await s.goTo('records', 21, 1); await s.settle([/Ledger: the backup console/]);
  p = await s.peek();
  check('Quiet Thread: Ledger finds svc-print exporting the backup server’s stored credentials at 03:14 (T1555); series save updated',
    p.qt.cluesFound.includes('rh-vault') && (await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound)).includes('rh-vault'), p.qt);
  check('Quiet Thread clue is consistent (svc-print, just after 03:00, the Front Desk closet router) and T1555 is never an alert', await s.page.evaluate(() => {
    const c = QT_CLUES['rh-vault']; return /svc-print/.test(c.seen) && /03:14/.test(c.seen) && /Front Desk closet/.test(c.seen) && c.tech === 'T1555' && QT_TECH.T1555.name === 'Credentials from Password Stores' &&
      QT_TECH.T1555.tactic.join() === 'Credential Access' && !Object.values(THREATS).some(t => t.tech === 'T1555') && !TECH.T1555; }));

  // ---- Drill 1 by guessing ----
  await s.goTo('records', 14, 6);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^The approved records migration/);
  await s.pickLabel(/Every rename came from/);
  await s.pickLabel(/harmless-looking extension/); await s.pickLabel(/migration’s service account/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('guessing: right verdict, reasoning and alternatives with no query scores 40 and is called unsupported', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1), deb1.slice(0, 300));
  check('drill 1 debrief: decided by who wrote the files and whether the ways back were touched; T1486/T1490', /who wrote the files/.test(deb1) && /whether the ways back were touched/.test(deb1) && /T1486/.test(deb1) && /T1490/.test(deb1));
  await s.settle();
  p = await s.peek();
  check('drill 1 recorded as unsupported', p.f.rhDrill1 && p.extra.rh.drills.rename.score === 40 && p.extra.rh.drills.rename.supported === false, p.extra.rh.drills);
  const d1 = await s.page.evaluate(() => { const D = RH_DRILLS.rename; return { traps: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => q.q)), []), keys: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.key).map(q => x.id)), []) }; });
  check('drill 1 traps are the count and the extension; keys are the file-server audit and the shadow copies', d1.traps.length === 2 && d1.traps.some(q => /How many files/.test(q)) && d1.traps.some(q => /extension/.test(q)) && d1.keys.join() === 'audit,vss', d1);

  // ---- Save/reload mid-Records Hall ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-Records Hall restores map, flags, party, tests, objectives, offline copy, drills and metrics',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) &&
    JSON.stringify(before.party) === JSON.stringify(after.party) && JSON.stringify(before.extra) === JSON.stringify(after.extra) &&
    JSON.stringify(before.metrics) === JSON.stringify(after.metrics) && JSON.stringify(before.qt) === JSON.stringify(after.qt), { before: before.extra.rh, after: after.extra.rh });

  // ---- The finance directive (game) ----
  await s.goTo('records', 18, 7);
  await s.untilChoice(); await s.pickLabel(/Keep only 7 days/);
  p = await s.waitUI('say');
  check('directive: 7 days of backups means no clean copy if the intruder is older than a week', /no clean copy/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Drop the offline tapes/);
  p = await s.waitUI('say');
  check('directive: the offline copy is the last thing to cut', /last thing to cut/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/Back up weekly instead/);
  p = await s.waitUI('say');
  check('directive: weekly backups break the permits RPO', /RPO is twelve hours/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Tier it with the owners/);
  await s.settle();
  p = await s.peek();
  check('directive met by tiering; shown on the scorecard and labelled (game)', p.f.rhDirective && p.extra.rh.directive === 'tier' && /Directive: backup storage costs down 40% this year.*\(game\)/.test(await s.page.evaluate(() => scorecardHtml())));

  // ---- Drill 2, focused path ----
  await s.goTo('records', 24, 2);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Query: Backup job log/); await s.pickLabel(/What did the job select/); await s.waitUI('modal');
  check('drill 2: the job read only E:; the shares moved to F:, which it never selects', /F: 2\.27 TB used/.test(await s.modalText()) && /not in the selection list/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Backup console audit log/); await s.pickLabel(/Who changed the job/); await s.waitUI('modal');
  check('drill 2: nobody changed the job; only the backup admins signed in, with MFA', /No change to FS-01-nightly/.test(await s.modalText()) && /each with MFA/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^A coverage gap/);
  await s.pickLabel(/The job log shows it read only E:/);
  await s.pickLabel(/attacker edited the job/); await s.pickLabel(/files were deleted from FS-01/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2: both key queries score 100; job log detail and console audit decide; totals and dedup don’t; restore tests prove it', /Score 100 \/ 100/.test(deb2) && /job log’s detail/.test(deb2) && /audit log/.test(deb2) && /deduplication ratio describe the whole repository/.test(deb2) && /restore test is what proves it/.test(deb2), deb2.slice(0, 400));
  await s.settle();
  const d2trap = await s.page.evaluate(() => RH_DRILLS.shrink.sources.find(x => x.id === 'dash').qs[0].kind);
  check('drill 2: the storage dashboard is the trap; CSF backup facts unlocked (PR.DS-11, RC.RP-03)', d2trap === 'trap' && await s.page.evaluate(() => G.fm['fact:csfbk'] && /PR\.DS-11/.test(FACTS.csfbk.desc) && /RC\.RP-03: the integrity of backups and other restoration assets is verified before using them/.test(FACTS.csfbk.desc)));

  // ---- Night 2 and drill 3: Tally, one trap, then both key queries ----
  await s.goTo('records', 8, 14); await s.settle();
  check('night 2', (await s.peek()).f.rhNight2);
  await s.goTo('records', 14, 6);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/); await s.waitUI('modal');
  check('drill 3: Tally given everything takes the note’s 200 GB at its word', /200 GB/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: The ransom note/); await s.pickLabel(/What does the note say/); await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Firewall flow records/); await s.pickLabel(/Outbound volume/); await s.waitUI('modal');
  check('drill 3: 3.8 GB from PLAN-LT-04 to a cloud storage address the town never uses; nothing else', /3\.8 GB out/.test(await s.modalText()) && /No other host sent more than 50 MB/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Endpoint history/); await s.pickLabel(/What ran on PLAN-LT-04/); await s.waitUI('modal');
  check('drill 3: hd-admin from SCAN-01, a compression utility, then an upload tool, then the encryptor', /SCAN-01/.test(await s.modalText()) && /compression utility/.test(await s.modalText()) && /sync command-line tool/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^Yes: about 3\.8 GB/);
  await s.pickLabel(/A compression utility packed the files/);
  await s.pickLabel(/planner backing up/); await s.pickLabel(/More data left through another host/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3: a trap and both keys score 95; Tally’s mistake explained; scope from your own records; T1560.001 and T1567.002', /Score 95 \/ 100/.test(deb3) && /Tally took the attacker’s note at its word/.test(deb3) && /the attacker’s words/.test(deb3) && /T1560\.001/.test(deb3) && /T1567\.002/.test(deb3) && /US state breach laws differ/.test(deb3), deb3.slice(0, 400));
  await s.settle();
  const tl = await s.page.evaluate(() => { const r = RH_DRILLS.stolen.sources.find(x => x.id === 'edr').qs[0].res.join(' '); const t = ['01:31', '01:40', '02:03', '02:06', '02:18', '02:19'].map(x => r.indexOf(x)); return { t, budget: RH_DRILLS.stolen.budget }; });
  check('drill 3 timeline runs in order (sign-in 01:31, copy 01:40, pack 02:03, upload 02:06, delete 02:18, encrypt 02:19); budget 3', tl.t.every((x, i) => x >= 0 && (i === 0 || x > tl.t[i - 1])) && tl.budget === 3, tl);

  // ---- Alert mix ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const home = RH_HOME, share = c => home.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'records'; const rh = count(6000);
    G.f.rhVault = true; const vault = count(6000); G.f.rhVault = false;
    G.f.rhMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    const qtHit = Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]);
    let host; G.map = 'records'; do { host = genAlert('mal'); } while (!RH_HOME.includes(host.threat)); G.map = save.map;
    return { hubShare: share(hub), rhShare: share(rh), lapse: rh.lapse || 0, lapseV: vault.lapse || 0, shred: rh.shredwick || 0, shredV: vault.shredwick || 0, gloam: rh.gloam || 0, gloamV: vault.gloam || 0,
      pre: home.reduce((s, t) => s + (pre[t] || 0), 0), qtHit, techs: RH_HOME.map(t => THREATS[t].tech), host: host.host };
  });
  check('alert mix: Records Hall threats about three times as likely inside Records Hall', mix.rhShare > mix.hubShare * 2.2 && mix.rhShare < mix.hubShare * 3.2, mix);
  check('alert mix: no Records Hall threats before arrival; Records Hall alerts name a Records Hall server', mix.pre === 0 && /Records Hall$/.test(mix.host), mix);
  check('alert mix: the Vault Badge halves T1490 and T1485 threats, not the others', mix.lapseV < mix.lapse * 0.65 && mix.shredV < mix.shred * 0.65 && mix.gloamV > mix.gloam * 0.85, mix);
  check('alert mix: no Quiet Thread technique among threats; spec IDs present (T1486, T1485, T1567.002, T1490)', mix.qtHit.length === 0 && ['T1486', 'T1485', 'T1567.002', 'T1490'].every(t => mix.techs.includes(t)), mix);
  check('ATT&CK v20 names and tactics as verified (Impact, Impact, Exfiltration, Collection)', await s.page.evaluate(() =>
    TECH.T1485.name === 'Data Destruction' && TECH.T1485.tactic.join() === 'Impact' && TECH.T1490.name === 'Inhibit System Recovery' && TECH.T1486.name === 'Data Encrypted for Impact' &&
    TECH['T1567.002'].name === 'Exfiltration Over Web Service: Exfiltration to Cloud Storage' && TECH['T1567.002'].tactic.join() === 'Exfiltration' &&
    TECH['T1560.001'].name === 'Archive Collected Data: Archive via Utility' && TECH['T1560.001'].tactic.join() === 'Collection'));
  check('benign cases: the archivist’s bulk copy, approved disposal, a full disk, the migration', await s.page.evaluate(() => /archivist’s approved migration/.test(ALERTS.sluice.benign.truth) && /retention schedule/.test(ALERTS.shredwick.benign.truth) && /full disk/.test(ALERTS.lapse.benign.truth) && /records migration/.test(ALERTS.gloam.benign.truth)));
  // Consistency of the incident's evidence (the earlier expert reviews' lessons).
  const rv = await s.page.evaluate(() => {
    const d = { R: 6, E: 4, B: 9 }, st = rhBossStages(['identity'], d), st0 = rhBossStages([], d);
    const s1good = st.s1.resp.find(r => r.good).label, s3 = st.s3.clues.join(' ');
    return {
      s1disables: /disable svc-scanbak/.test(s1good), s3other: /adm-bk2/.test(s3) && !/svc-scanbak signs in/.test(s3),
      earliest: /Day 4 at 02:12/.test(s3) && /earliest sign of the attacker/.test(s3),
      onlyDirClean: RH_RESTORE.dir.opts.filter(o => !o.tainted).map(o => o.k).join() === 'clean',
      goldGood: ['dns', 'db', 'app', 'fs'].every(k => RH_RESTORE[k].opts.find(o => o.good).k === 'gold' && RH_RESTORE[k].opts.find(o => o.k === 'last').tainted),
      dirLast: !/directory/.test(st.s1.clues[0].replace('except the directory', '')) && /except the directory/.test(st.s1.clues[0]),
      noKey: st0.s3.dwell0 === 40 && st.s3.dwell0 === 10,
      cards: RH_CARDS.filter(c => c.good).map(c => c.id).join() === 'isolate,preserve,verify,identity' && RH_CARDS.find(c => c.id === 'verify').csf === 'Recover' && RH_CARDS.find(c => c.id === 'isolate').csf === 'Respond' && !RH_CARDS.some(c => /notify|report|tell/i.test(c.name)),
      notes: GAME_NOTES.some(n => /Restore-order rules/.test(n) && /\(game\)/.test(n))
    };
  });
  check('incident evidence: Stage 1 disables svc-scanbak, so Stage 3’s sign-in is a second account (adm-bk2); the earliest compromise is shown', rv.s1disables && rv.s3other && rv.earliest, rv);
  check('restore points: only the pre-compromise directory copy is clean; every other system is best rebuilt from a golden image with last night’s data', rv.onlyDirClean && rv.goldGood && rv.dirLast, rv);
  check('tabletop: four technical good cards with the right CSF functions; telling people is not a card; rules labelled (game)', rv.cards && rv.notes && rv.noKey, rv);

  // ---- Dojo: one wrong answer, then the rest ----
  await s.goTo('records', 27, 12); await s.settle();
  await s.goTo('records', 22, 11);
  await s.waitUI('modal');
  await s.pickLabel(/Yes: it’s encrypted, as the vendor says/);
  p = await s.waitUI('say');
  check('dojo: Base64 “encryption” is not accepted', /Not quite/.test(p.ui.text), p.ui.text);
  await s.press('a'); await s.waitUI('modal');
  await s.pickLabel(/^No: it’s Base64/);
  p = await s.waitUI('say');
  check('dojo 1: RFC 4648 says encoding gives no computational confidentiality; FIPS 180-4 and FIPS 197 named', /RFC 4648/.test(p.ui.text) && /no computational confidentiality/.test(p.ui.text) && /FIPS 180-4/.test(p.ui.text) && /FIPS 197/.test(p.ui.text), p.ui.text);
  check('dojo 1: the encoded string really is Base64 of the password shown', await s.page.evaluate(() => atob('VGFsbG93LUZlcm4tMjAyNg==') === 'Tallow-Fern-2026' && /Tallow-Fern-2026/.test(RH_DOJO[0].opts[0])));
  await s.settle();
  await s.goTo('records', 24, 11); await s.settle();
  await s.goTo('records', 26, 11); await s.settle();
  p = await s.peek();
  check('dojo complete; Keyling levels up; key recovery (SP 800-57) and hybrid encryption (T1486 examples) taught', p.f.rhDojoDone && p.party.find(t => t.id === 'keyling').lvl === 6 && await s.page.evaluate(() => G.fm['fact:keymgmt'] && G.fm['fact:cryptostd'] && /key backups or archives/.test(FACTS.keymgmt.desc) && /AES with RSA/.test(RH_DOJO[1].explain)), p.party);

  // ---- Records Board: Vault Badge and Cairn ----
  await s.goTo('rboard', 9, 2);
  await s.settle();
  p = await s.peek();
  check('Records Board won: Vault Badge; Cairn (recovery) joins at Lv 5; still Tier 2', p.f.rhBoard && p.f.rhVault && p.party.some(t => t.id === 'cairn' && t.lvl === 5) && p.rank === 'Tier 2 incident responder', { party: p.party, rank: p.rank });
  check('Vault Badge: the building lights up, the unindexed stacks shrink; Recovery tools are strong against Impact', await s.page.evaluate(() =>
    tileDef('hub', 13, 15).spr === 'L' && tileDef('records', 1, 2).ch === '0' && tileDef('records', 1, 1).ch === ',' && CLASSES.recovery.strong.includes('Impact')));

  // ---- Mean time to contain from a real containment action ----
  await s.page.evaluate(() => {
    const G = __UPTIME.state(); G.active = G.party.findIndex(t => t.id === 'cairn'); G.focus = G.focusMax;
    let spec; G.map = 'records'; do { spec = genAlert('mal'); } while (spec.threat !== 'gloam');
    run(() => doBattle(spec));
  });
  await s.untilChoice();
  const ttc0 = (await s.peek()).extra.rh.ttc;
  await s.pickLabel(/^Lock retention/); await s.untilChoice();
  await s.pickLabel(/^Close alert/); await s.pickLabel(/^Malicious/); await s.pickLabel(/^Isolate FS-03 and the writing server/);
  await s.settle();
  p = await s.peek();
  check('mean time to contain recorded from a retention lock on a real attack', p.metrics.rhTtc !== null && p.extra.rh.ttc === ttc0 + 1, { m: p.metrics.rhTtc, ttc: p.extra.rh.ttc });

  // ---- Restore-order rules (pure) ----
  const rr = await s.page.evaluate(() => {
    const d = { R: 6, E: 4, B: 9 };
    const run1 = (steps) => { const st = { done: {}, clock: 0, reinfect: 0, depFail: 0, order: [] }; const out = steps.map(([s, k]) => rhRestoreStep(st, s, k, d).kind); return { out, sum: rhRestoreSummary(st) }; };
    const best = run1([['dir', 'clean'], ['dns', 'gold'], ['db', 'gold'], ['app', 'gold'], ['fs', 'gold']]);
    const dep = run1([['dns', 'gold'], ['dir', 'clean'], ['dns', 'gold']]);
    const reinf = run1([['dir', 'last'], ['dir', 'mid'], ['dir', 'clean'], ['dns', 'last'], ['dns', 'gold']]);
    const late = run1([['dir', 'clean'], ['dns', 'gold'], ['fs', 'gold'], ['db', 'gold'], ['app', 'gold']]);
    const old = run1([['dir', 'clean'], ['dns', 'old']]);
    return { best: best.sum, dep, reinf, late: late.sum, old: old.sum, dirLoss: rhLossHours(RH_RESTORE.dir.opts[2], d) };
  });
  check('restore order: the clean plan restores all five inside their RTOs in 27 hours; the directory misses its RPO by design (121.7 h lost)',
    rr.best.clock === 27 && rr.best.rtoMet === 5 && rr.best.rpoMet === 4 && rr.best.done.dir.loss === 121.7 && rr.dirLoss === 121.7 && !rr.best.done.dir.rpoOk, rr.best);
  check('restore order: a system restored before what it needs fails and wastes an hour', rr.dep.out.join() === 'dep,ok,ok' && rr.dep.sum.depFail === 1 && rr.dep.sum.done.dns.end === 7, rr.dep);
  check('restore order: a copy taken after the compromise reinfects (directory from last night or the arrival day; DNS whole-server from last night)', rr.reinf.out.join() === 'reinfect,reinfect,ok,reinfect,ok' && rr.reinf.sum.reinfect === 3 && rr.reinf.sum.clock === 4 + 1 + 4 + 1 + 4 + 1 + 1 + 2, rr.reinf);
  check('restore order: file shares before the database misses the database’s and portal’s RTOs; an old clean DNS copy misses its RPO', rr.late.rtoMet === 3 && !rr.late.done.db.rtoOk && !rr.late.done.app.rtoOk && !rr.old.done.dns.rpoOk && rr.old.done.dns.rtoOk, { late: rr.late, old: rr.old });

  // ---- The ransomware incident ----
  await s.goTo('records', 8, 14); await s.settle();
  check('night 3', (await s.peek()).f.rhNight3);
  await s.goTo('records', 14, 6);
  p = await settleTo(s, /Tabletop: the stacks go dark/);
  check('tabletop: leadership, the FBI and CISA are told automatically, not by a card; Atlanta facts unlocked from primary sources',
    !p.ui.options.some(o => /FBI|CISA|leadership|residents/i.test(o.label)) && await s.page.evaluate(() => G.fm['fact:atl2018'] && G.fm['fact:samsam'] &&
      /22 March 2018/.test(FACTS.atl2018.desc) && /\$51,000 in Bitcoin/.test(FACTS.atl2018.desc) && /refused to pay/.test(FACTS.atl2018.desc) && /\$7\.2 million/.test(FACTS.atl2018.desc) &&
      /28 November 2018/.test(FACTS.samsam.desc) && /more than 200 victims/.test(FACTS.samsam.desc) && /over \$6 million/.test(FACTS.samsam.desc) && /JBoss/.test(FACTS.samsam.desc)), p.ui.options.map(o => o.label));
  p = await settleTo(s, /Your recommendation on the ransom/);
  await s.pickLabel(/^Pay now/);
  p = await s.waitUI('say');
  check('pay decision: paying is answered with the FBI’s position and OFAC’s strict liability', /FBI doesn’t support paying/.test(p.ui.text) && /strict liability/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Restore order · hour 0/);
  await s.pickLabel(/^DNS-01 name service/);
  await s.waitUI('modal'); await s.pickLabel(/^Rebuild from the golden image/);
  p = await settleTo(s, /Restore order · hour 1/);
  check('restore order on screen: DNS before the directory stops after an hour; the evidence list names the earliest compromise; nothing marks the tainted copies',
    /can’t work without DIR-01 directory/.test(await s.modalText()) && /earliest known compromise/.test(await s.modalText()) && !/tainted|reinfect(s|ed)? /i.test((await s.peek()).ui.options.map(o => o.label + (o.note || '')).join(' ')));
  await s.settle(null, /Records Hall district: recovered/);
  const sum = await s.modalText();
  p = await s.peek();
  const b = p.extra.rh.boss, r = p.extra.rh.restore;
  check('incident: four good cards; Stage 3 and recovery done; one out-of-order start; all five within RTO, four within RPO; Cairn evolved into Bulwark',
    p.f.rhBoss && p.f.rhCards.length === 4 && r.depFail === 1 && r.reinfect === 0 && r.rtoMet === 5 && r.rpoMet === 4 && r.clock === 28 && p.party.some(t => t.id === 'bulwark') && !p.party.some(t => t.id === 'cairn'), { b, r, party: p.party.map(t => t.id) });
  check('pay decision recorded (first answer: pay), facts on OFAC and the FBI unlocked', p.extra.rh.pay === 'pay' && await s.page.evaluate(() => G.fm['fact:ofac'] && G.fm['fact:fbipay'] && /strict liability/.test(FACTS.ofac.desc) && /21 September 2021/.test(FACTS.ofac.desc) && /does not support paying a ransom/.test(FACTS.fbipay.desc)));
  check('scorecard after recovery: measured within RTO 100%, within RPO 80%', p.metrics.rhRto === 100 && p.metrics.rhRpo === 80, p.metrics);
  check('summary: recovered, Vault Badge, Tier 2, “Next: IT Basement”, recovery results and drills',
    /Records Hall district: recovered/.test(sum) && /Vault Badge/.test(sum) && /Tier 2 incident responder/.test(sum) && /Next: IT Basement/.test(sum) && /5 of 5<\/b> systems within RTO|5 of 5 systems within RTO/.test(sum.replace(/<[^>]+>/g, '')) && /Restore test success rate/.test(sum) && /Twelve thousand renamed files/.test(sum), sum.slice(0, 400));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after recovery: objective done (Next: IT Basement); series save marks Records Hall done', p.objective.done && /IT Basement/.test(p.objective.text) && await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].recordsHall === true), p.objective);
  check('Credits list the Records Hall sources and keep the MITRE notice', await s.page.evaluate(() => { const c = creditsHtml(); return /#StopRansomware Guide/.test(c) && /SP 800-34 Rev\. 1/.test(c) && /OFAC/.test(c) && /Keisha Lance Bottoms/.test(c) && /reproduced and distributed with the permission of The MITRE Corporation/.test(c); }));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: restore order and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await marketDone(ph, { rhMet: true, rhTest: true, rhBia: true, rhOffline: true, rhCreds: true, rhNight1: true, rhDrill1: true, rhDirective: true, rhDrill2: true, rhNight2: true, rhDrill3: true, rhBoard: true, rhVault: true, rhNight3: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); RH(); G.rh.obj = true; G.map = 'records'; G.x = 14; G.y = 7; G.dir = 'up'; run(() => rhRestoreGame({ R: 6, E: 4, B: 9 })); });
  await ph.waitUI('modal'); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/records-phone-restore.png' });
  check('phone: restore-order modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  await ph.page.tap('#mopts [data-i="0"]'); await sleep(450);
  check('phone: tapping a system opens its restore points', /Restore point · DIR-01 directory/.test(await ph.modalText()) && (await fit()).sw <= 360);
  await ph.page.tap('#mopts [data-i="2"]'); await sleep(450);
  check('phone: the directory from before the compromise comes back at hour 4', /Restore order · hour 4/.test(await ph.modalText()));
  for (let n = 0; n < 4; n++) { await ph.page.tap('#mopts [data-i="0"]'); await sleep(420); await ph.page.tap('#mopts [data-i="1"]'); await sleep(420); }
  check('phone: the recovery summary fits too', /5 of 5 within RTO/.test(await ph.modalText()) && (await fit()).sw <= 360);
  await ph.page.tap('#mopts [data-i="0"]'); await sleep(420);
  await ph.settle();
  await ph.page.evaluate(() => { const G = __UPTIME.state(); G.x = 14; G.y = 7; run(rhDrill3); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/records-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('RECORDS TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
