// IT Basement checks (Town Hall district 6). Setup jumps the state past Records Hall through the debug hook
// (__UPTIME.state()); after that, real keyboard input does the work: walking, facing, A, menu choices.
// Covers: the Vault Badge door (the old stairs), arrival and the Tier 2 -> Tier 3 metrics, log source coverage (questions
// to sources; four sources onboarded), one clock for every log (UTC, NTP), retention (M-21-31 rescinded, federal only),
// the firewall rule review (owners, replace before remove, deny by default) and the Quiet Thread any-to-any clue, rule
// tuning (switching off refused; narrow exclusions; an over-broad exclusion silently hides a real attack that incident
// review surfaces later), drills (guessing scores 40; focused paths 100; Tally), save/reload mid-district, the licence
// directive (DNS stays), clock skew measured during drill 2, the alert mix, the Dojos, the Basement Board (Beacon Badge,
// Tier 3, Ledger -> Annalist, a chosen log gap closed, slower dwell with full logging), the boss (tabletop, three stages,
// the hidden exclusion named), the Quiet Thread suspicion file (consistent with every earlier clue), the summary, and
// the phone layout.
// Usage: node basement.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const DIR = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Tap a menu option by what it says (or by its meta.good flag), never by position: option order is shuffled.
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

// Front Desk to Records Hall finished: Tier 2, Vault Badge, standing on the plaza just east of the old stairs.
async function recordsDone(s, extra, party) {
  await marketDone(s, null, party);
  await s.page.evaluate((extra) => {
    const G = __UPTIME.state();
    Object.assign(G.f, { rhMet: true, rhTest: true, rhBia: true, rhOffline: true, rhCreds: true, rhNight1: true, rhDrill1: true, rhDirective: true, rhDrill2: true, rhNight2: true, rhDrill3: true,
      rhDojoMet: true, rhDojoDone: true, rhBoard: true, rhVault: true, rhNight3: true, rhBoss: true, rhSummary: true }, extra || {});
    RH(); G.rh.obj = true; G.rh.offline = 100; G.day = 10;
    G.map = 'hub'; G.x = 3; G.y = 10; G.dir = 'left';
  }, extra || null);
}

(async () => {
  const browser = await chromium.launch();
  const t0 = Date.now();
  const s = await session(browser);
  await s.newGame();
  let p;

  // ---- The Vault Badge door: the stairs locked since slice 1 ----
  await recordsDone(s, { rhVault: false });
  await s.press('left'); await sleep(60);
  p = await s.waitUI('say');
  check('the old stairs stay locked without the Vault Badge', /Vault Badge/.test(p.ui.text) && (await s.peek()).map === 'hub', p.ui.text);
  await s.settle();
  check('the stairs are a door now; nothing else on the plaza moved', await s.page.evaluate(() => MAPS.hub.rows[10][2] === 'X' && MAPS.hub.doors['2,10'].to === 'basement' && MAPS.hub.rows[15].slice(13, 17) === 'PPPP'));

  // ---- Arrival ----
  await recordsDone(s);
  await s.press('left'); await sleep(200);
  await s.settle();
  p = await s.peek();
  check('the Vault Badge opens the stairs into the IT Basement', p.map === 'basement' && p.x === 14 && p.y === 14, { map: p.map, x: p.x, y: p.y });
  await s.goTo('basement', 14, 7);
  await s.settle();
  p = await s.peek();
  check('arrival: Magda met; still Tier 2; basement metrics start (coverage 38%, skew 420 s, precision 14%, owners 63%, modelled MTTD 157 h)',
    p.f.bmMet && p.rank === 'Tier 2 incident responder' && p.metrics.bmCov === 38 && p.metrics.bmSkew === 420 && p.metrics.bmPrec === 14 && p.metrics.bmFwOwn === 63 && p.metrics.bmMttd === 157, p.metrics);
  const sc0 = await s.page.evaluate(() => scorecardHtml());
  check('scorecard shows the five basement metrics with targets', /Log source coverage/.test(sc0) && /Largest clock skew/.test(sc0) && /Detection precision/.test(sc0) && /Firewall rules with a named owner/.test(sc0) && /Mean time to detect, modelled/.test(sc0) && /≤ 1 s/.test(sc0));
  check('the basement map: racks with the collector, the clock, SIEM consoles, firewall and binder, two Dojos, the Board door, the stairs up', await s.page.evaluate(() => {
    const r = MAPS.basement.rows; return r.length === 16 && r.every(x => x.length === 30) && r[0][17] === '@' && r[1][3] === '#' && r[1].includes('%%') && r[1].includes('&&') && r[1].split('$').length === 3 &&
      r[11].split('*').length === 4 && r[11].split('+').length === 4 && r[7][29] === 'D' && r[15][14] === 'E'; }));

  // ---- Fieldwork 1: coverage ----
  await s.goTo('basement', 3, 1);
  p = await settleTo(s, /Who signed in to the VPN/);
  await s.pickLabel(/^Identity sign-ins/);
  p = await s.waitUI('say');
  check('coverage: the wrong source for a question is refused', /can’t answer it/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Log sources: what to collect next/);
  for (const re of [/^VPN appliance/, /^Edge firewall/, /^DNS resolver/, /^Printer page counts/]) await s.pickLabel(re);
  await s.pickLabel(/Onboard these four/);
  p = await s.waitUI('say');
  check('coverage: page counts instead of server process creation are refused', /Page counts and debug logs/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Log sources: what to collect next/);
  for (const re of [/^VPN appliance/, /^Edge firewall/, /^DNS resolver/, /^Endpoint process creation, servers/]) await s.pickLabel(re);
  await s.pickLabel(/Onboard these four/);
  await s.settle();
  p = await s.peek();
  check('coverage: VPN, firewall, DNS and server process creation onboarded; 88%; ASD-led guide fact (UTC, 18 months, edge devices, DNS)', p.f.bmCover && p.metrics.bmCov === 88 && await s.page.evaluate(() =>
    G.fm['fact:asdlog'] && /UTC as the preferred time standard/.test(FACTS.asdlog.desc) && /up to 18 months/.test(FACTS.asdlog.desc) && /boundary routers and firewalls/.test(FACTS.asdlog.desc) && /DNS/.test(FACTS.asdlog.desc)), p.metrics);

  // ---- Fieldwork 2: clocks ----
  await s.goTo('basement', 17, 0);
  p = await settleTo(s, /Clocks against a reference/);
  check('clock table: FS-02 seven minutes slow; SP 800-92 quoted', /-420 s/.test(await s.modalText()) && /SP 800-92/.test(await s.modalText()));
  p = await settleTo(s, /How do you make the clocks agree/);
  await s.pickLabel(/local time/);
  p = await s.waitUI('say');
  check('clocks: local time per device is refused (UTC preferred, ISO 8601)', /UTC the preferred standard/.test(p.ui.text) && /ISO 8601/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Two internal NTP servers/);
  await s.settle();
  p = await s.peek();
  check('clocks: one NTP source; skew 0.4 s; worst 420 kept; RFC 5905 and SP 800-92 facts', p.f.bmTime && p.metrics.bmSkew === 0.4 && await s.page.evaluate(() => G.track.bmSkew.worst === 420 && G.fm['fact:rfc5905'] && /June 2010/.test(FACTS.rfc5905.desc) && /RFC 1305/.test(FACTS.rfc5905.desc) && G.fm['fact:sp80092'] && tileDef('basement', 17, 0).pal === 'ntpOk'), p.metrics);

  // ---- Fieldwork 3: retention ----
  await s.goTo('basement', 13, 1);
  await s.untilChoice(); await s.pickLabel(/M-21-31/);
  p = await s.waitUI('say');
  check('retention: M-21-31 was rescinded by M-26-14 (22 May 2026) and is federal-only', /rescinded on 22 May 2026/.test(p.ui.text) && /M-26-14/.test(p.ui.text) && /federal agencies, not towns/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^7 days is plenty/);
  p = await s.waitUI('say');
  check('retention: seven days is refused (incidents found up to 18 months later)', /18 months/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^From a risk assessment/);
  await s.settle();
  p = await s.peek();
  check('retention: 90 days searchable, 18 months archived; M-26-14 fact labelled federal-only', p.f.bmRet && p.extra.bm.ret === 90 && await s.page.evaluate(() => /federal agencies only/.test(FACTS.m2614.name) && /rescinded M-21-31/.test(FACTS.m2614.desc) && /6 months/.test(FACTS.m2614.desc)));

  // ---- Fieldwork 4: the firewall rule review ----
  await s.goTo('basement', 25, 1);
  for (let n = 0; n < 2; n++) { p = await settleTo(s, /Rule review · R[12]/); await s.pickLabel(/^Keep it/); }
  p = await settleTo(s, /Rule review · R3/);
  await s.pickLabel(/^Remove it/);
  p = await s.waitUI('say');
  check('firewall: removing the any-any rule blind is refused (it still carries traffic)', /412 hits/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Rule review · R3/);
  await s.pickLabel(/^Read what it carries/);
  p = await settleTo(s, /last rule, at the bottom/);
  check('Quiet Thread: the any-to-any rule’s hit log shows the closet router on WEB-01’s admin service around 03:09 (T1090); series save updated',
    (await s.peek()).qt.cluesFound.includes('bm-anyany') && (await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).quietThread.cluesFound)).includes('bm-anyany'));
  await s.pickLabel(/^Block everything inbound, allow everything outbound/);
  p = await s.waitUI('say');
  check('deny by default both ways (NIST SP 800-41 wording)', /block all inbound and outbound traffic that hasn’t been expressly permitted/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Deny everything not expressly permitted/);
  await s.settle();
  p = await s.peek();
  check('firewall review done: owners 100%, R4 narrowed by change (not deleted), R3 replaced, R6/R7 removed, default deny; the firewall tile changes', p.f.bmFw && p.metrics.bmFwOwn === 100 && p.extra.bm.rules.narrowed.join() === 'R4' && p.extra.bm.rules.removed.includes('R3') && await s.page.evaluate(() => tileDef('basement', 20, 1).pal === 'edgefwOk' && /expressly permitted/.test(FACTS.sp80041.desc) && /egress filtering/.test(FACTS.sp80041.desc)), p.extra.bm.rules);

  // ---- Fieldwork 5: rule tuning, with the over-broad exclusion ----
  const missed0 = (await s.peek()).m.missed;
  await s.goTo('basement', 11, 2);
  p = await settleTo(s, /Rule tuning · the scan rule/);
  await s.pickLabel(/^Disable the rule/);
  p = await s.waitUI('say');
  check('tuning: switching the rule off is refused', /Never switch a detection off/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Rule tuning · the scan rule/);
  for (const re of [/^Exclude VS-01 only/, /^Exclude BKP-01 only/, /^Exclude PM-01 only/]) { await s.pickLabel(re); await s.waitUI('modal'); }
  check('tuning screen: with the three narrow exclusions, 2 alerts a week remain (precision as triaged 50%)', /Alerts a week: <b>2<\/b>|Alerts a week: 2/.test(await s.modalText()) && /precision as triaged: 50%/.test((await s.modalText()).replace(/<[^>]+>/g, '')));
  await s.pickLabel(/^Exclude the whole IT subnet/); await s.waitUI('modal');
  check('the over-broad IT-subnet exclusion looks better on screen (precision as triaged 100%)', /precision as triaged: 100%/.test((await s.modalText()).replace(/<[^>]+>/g, '')));
  await s.pickLabel(/^Ship this tuning/);
  await s.untilChoice(); await s.pickLabel(/^No need/);
  p = await s.waitUI('say');
  check('tuning: exclusions need a reason, an owner and an expiry', /reason and an expiry/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Each one in the rule’s change history/);
  p = await settleTo(s, /Tuning shipped/);
  check('tuning shipped: recall explained; the hidden attack is not shown', /recall/.test(await s.modalText()) && /not shown until incident review/.test(await s.modalText()));
  await s.settle();
  p = await s.peek();
  check('the over-broad exclusion silently hides MGMT-01’s real scan: missed attacks +1, precision reads 100%, nothing on screen says so', p.f.bmTune && p.extra.bm.tune.hidden && p.m.missed === missed0 + 1 && p.metrics.bmPrec === 100 && p.extra.bm.tune.left === 1, { tune: p.extra.bm.tune, m: p.m });
  const tv = await s.page.evaluate(() => {
    const e = a => bmTuneEval(a);
    return { good: e(['vs', 'bk', 'pm']), subnet: e(['subnet']), night: e(['night']), thresh: e(['thresh']), off: e(['off']), none: e([]) };
  });
  check('tuning rules: narrow exclusions keep both real attacks (precision 100, recall 100); the subnet, night-window and threshold changes each hide MGMT-01; switching off hides both',
    tv.good.left === 2 && tv.good.prec === 100 && tv.good.recall === 100 && !tv.good.hidesReal && tv.subnet.hidesReal && tv.night.hidesReal && tv.thresh.hidesReal && tv.off.recall === 0 && tv.none.left === 14 && tv.none.prec === 14, tv);

  // ---- Night 1, drill 1 by guessing ----
  const day0 = (await s.peek()).day;
  await s.goTo('basement', 13, 13); await s.settle();
  check('end of shift: next day, the “source went quiet” alert', (await s.peek()).f.bmNight1 && (await s.peek()).day === day0 + 1);
  await s.goTo('basement', 14, 7);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/I have enough/);
  await s.pickLabel(/^Collector outage/);
  await s.pickLabel(/^FS-02’s local log still holds/);
  await s.pickLabel(/cleared FS-02’s Security log/); await s.pickLabel(/stopped FS-02’s forwarding/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb1 = await s.modalText();
  check('guessing: right verdict and reasoning with no query scores 40 and is called unsupported', /Score 40 \/ 100/.test(deb1) && /Unsupported:/.test(deb1), deb1.slice(0, 300));
  check('drill 1 debrief: the host’s own log (event 1102) and the collector’s health log decide; T1685.005', /the host’s own log/.test(deb1) && /1102/.test(deb1) && /collector’s own health log/.test(deb1) && /T1685\.005/.test(deb1));
  await s.settle();
  const d1 = await s.page.evaluate(() => { const D = BM_DRILLS.gap; return { traps: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.kind === 'trap').map(q => x.id)), []), keys: D.sources.reduce((a, x) => a.concat(x.qs.filter(q => q.key).map(q => x.id)), []) }; });
  check('drill 1: traps are the SIEM count and the owner’s word; keys are the host log and the collector health log; event 1102 fact (Microsoft Learn)', d1.traps.join() === 'count,nico' && d1.keys.join() === 'host,health' && await s.page.evaluate(() => G.fm['fact:ev1102'] && /The audit log was cleared/.test(FACTS.ev1102.desc)), d1);

  // ---- Save/reload mid-basement ----
  const before = await s.peek();
  await s.press('start'); await s.waitUI('modal'); await s.pickLabel(/^Save$/); await s.settle([/^OK$/, /^Close$/]);
  await s.page.reload();
  await s.page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await s.page.evaluate(() => __UPTIME.turbo(true));
  await s.pickLabel(/Continue/); await s.settle();
  const after = await s.peek();
  check('save/reload mid-basement restores map, flags, party, sources, rules, tuning, drills and metrics',
    ['map', 'x', 'y', 'day', 'rank'].every(k => before[k] === after[k]) && JSON.stringify(before.f) === JSON.stringify(after.f) && JSON.stringify(before.party) === JSON.stringify(after.party) &&
    JSON.stringify(before.extra) === JSON.stringify(after.extra) && JSON.stringify(before.metrics) === JSON.stringify(after.metrics) && JSON.stringify(before.qt) === JSON.stringify(after.qt), { before: before.extra.bm, after: after.extra.bm });

  // ---- The directive ----
  await s.goTo('basement', 18, 7);
  await s.untilChoice(); await s.pickLabel(/^Drop DNS/);
  p = await s.waitUI('say');
  check('directive: dropping DNS is refused (priority source; tunnels and command channels)', /priority list/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Keep a random 10%/);
  p = await s.waitUI('say');
  check('directive: sampling loses the one line that matters', /one line/.test(p.ui.text), p.ui.text);
  await s.untilChoice(); await s.pickLabel(/^Keep DNS/);
  await s.settle();
  check('directive met by tiering, DNS kept; on the scorecard, labelled (game)', (await s.peek()).extra.bm.directive === 'tier' && /Directive: SIEM licence cost down 30%.*\(game\)/.test(await s.page.evaluate(() => scorecardHtml())));

  // ---- Drill 2, focused ----
  await s.goTo('basement', 23, 2);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  check('drill 2 measures MGMT-01’s skew: 630 s while the drill runs', (await s.peek()).metrics.bmSkew === 630);
  await s.pickLabel(/Query: Time status/); await s.pickLabel(/clock offset/); await s.waitUI('modal');
  check('drill 2: MGMT-01 never synchronised (management network blocked from NTP), +10 min 30 s', /\+10 min 30 s/.test(await s.modalText()) && /UDP 123/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: A shared reference event/); await s.pickLabel(/Find one connection/); await s.waitUI('modal');
  check('drill 2: one connection both devices recorded gives the exact correction', /14:00:05/.test(await s.modalText()) && /14:10:35/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^The sign-in came first/);
  await s.pickLabel(/^MGMT-01 wasn’t synchronised/);
  await s.pickLabel(/attacker used fw-devraj/); await s.pickLabel(/firewall’s clock is the wrong one/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb2 = await s.modalText();
  check('drill 2: both keys score 100; ingest time is not event time', /Score 100 \/ 100/.test(deb2) && /ingest time/.test(deb2), deb2.slice(0, 300));
  await s.settle();
  p = await s.peek();
  check('after drill 2: skew back to 0.4 s, worst 630 s on the scorecard; the arithmetic holds (14:10:00 − 10 min 30 s = 13:59:30, before 14:03:10)', p.metrics.bmSkew === 0.4 && await s.page.evaluate(() => G.track.bmSkew.worst === 630) &&
    (14 * 3600 + 10 * 60 - 630) === (13 * 3600 + 59 * 60 + 30) && (13 * 3600 + 59 * 60 + 30) < (14 * 3600 + 3 * 60 + 10) && (14 * 3600 + 10 * 60 + 35 - 630) === (14 * 3600 + 5), p.metrics);

  // ---- Night 2, drill 3 with Tally then both keys ----
  await s.goTo('basement', 13, 13); await s.settle();
  await s.goTo('basement', 11, 2);
  await s.untilChoice();
  await s.pickLabel(/Start investigating/);
  await s.pickLabel(/Ask Tally/); await s.pickLabel(/Give Tally everything/); await s.waitUI('modal');
  check('drill 3: Tally given everything calls it from shape and volume', /high-entropy/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Endpoint DNS and process telemetry/); await s.pickLabel(/Which host and which process/); await s.waitUI('modal');
  check('drill 3: one host, an unsigned program in a temp folder; not the signed agent', /PL-WS-07/.test(await s.modalText()) && /unsigned/.test(await s.modalText()) && /signed process/.test(await s.modalText()));
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Query: Domain ownership/); await s.pickLabel(/Who owns cdn-metrics/); await s.waitUI('modal');
  await s.pickLabel(/Back to the investigation/);
  await s.pickLabel(/Budget spent/);
  await s.pickLabel(/^A DNS tunnel: an unsigned program/);
  await s.pickLabel(/^Endpoint telemetry names an unsigned program/);
  await s.pickLabel(/security agent’s telemetry/); await s.pickLabel(/content delivery network/); await s.pickLabel(/Done: these are my 2/);
  await s.waitUI('modal');
  const deb3 = await s.modalText();
  check('drill 3: both keys score 100; Tally’s shortcut explained; process and owner decide (Sysmon event 22); T1071.004', /Score 100 \/ 100/.test(deb3) && /About Tally/.test(deb3) && /Sysmon event 22/.test(deb3) && /T1071\.004/.test(deb3), deb3.slice(0, 300));
  await s.settle();
  check('Sysmon event 22 fact as Microsoft documents it', await s.page.evaluate(() => G.fm['fact:sysmon22'] && /whether the result succeeds or fails, cached or not/.test(FACTS.sysmon22.desc) && /Windows 8\.1/.test(FACTS.sysmon22.desc)));

  // ---- Alert mix ----
  const mix = await s.page.evaluate(() => {
    const G = __UPTIME.state(), save = { map: G.map, f: Object.assign({}, G.f), brief: G.brief }; G.brief = {};
    const count = n => { const c = {}; for (let i = 0; i < n; i++) { const a = genAlert('mal'); c[a.threat] = (c[a.threat] || 0) + 1; } return c; };
    const share = c => BM_HOME.reduce((s, t) => s + (c[t] || 0), 0) / Object.values(c).reduce((a, b) => a + b, 0);
    G.map = 'hub'; const hub = count(6000);
    G.map = 'basement'; const bm = count(6000);
    G.f.bmMet = false; G.map = 'hub'; const pre = count(4000);
    G.map = save.map; G.f = save.f; G.brief = save.brief;
    let host; G.map = 'basement'; do { host = genAlert('mal'); } while (!BM_HOME.includes(host.threat)); G.map = save.map;
    return { hubShare: share(hub), bmShare: share(bm), pre: BM_HOME.reduce((s, t) => s + (pre[t] || 0), 0), qtHit: Object.keys(THREATS).filter(t => QT_TECH[THREATS[t].tech]), techs: BM_HOME.map(t => THREATS[t].tech), host: host.host };
  });
  check('alert mix: basement threats about three times as likely in the basement; none before arrival; basement alerts name a basement host', mix.bmShare > mix.hubShare * 2.2 && mix.bmShare < mix.hubShare * 3.2 && mix.pre === 0 && /IT Basement$/.test(mix.host), mix);
  check('alert mix: no Quiet Thread technique among threats (T1685.005 stays out: the wild log-clearing alert is the Linux sub-technique); spec IDs present', mix.qtHit.length === 0 && ['T1685.006', 'T1686.002', 'T1046', 'T1071.004', 'T1572'].every(t => mix.techs.includes(t)), mix);
  check('ATT&CK v20 names and tactics as verified', await s.page.evaluate(() =>
    TECH['T1685.005'].name === 'Disable or Modify Tools: Clear Windows Event Logs' && TECH['T1685.005'].tactic.join() === 'Defense Impairment' &&
    TECH['T1685.006'].name === 'Disable or Modify Tools: Clear Linux or Mac System Logs' && TECH['T1686.002'].name === 'Disable or Modify System Firewall: Network Device Firewall' && TECH['T1686.002'].tactic.join() === 'Defense Impairment' &&
    TECH.T1046.name === 'Network Service Discovery' && TECH.T1046.tactic.join() === 'Discovery' && TECH['T1071.004'].name === 'Application Layer Protocol: DNS' && TECH['T1071.004'].tactic.join() === 'Command and Control' &&
    TECH.T1572.name === 'Protocol Tunneling' && TECH.T1572.tactic.join() === 'Command and Control' && TECH['T1110.001'].name === 'Brute Force: Password Guessing'));
  check('benign cases: the town’s own vulnerability scanner, a collector restart, an NTP drift correction', await s.page.evaluate(() => /authorised vulnerability scan/.test(ALERTS.sweep.benign.truth) && /collector’s planned restart/.test(ALERTS.scrub.benign.truth) && /NTP clock correction/.test(ALERTS.scrub.fp.truth)));

  // ---- Dojos: one wrong answer in each, then the rest ----
  await s.goTo('basement', 9, 11); await s.settle();
  await s.goTo('basement', 3, 11);
  await s.waitUI('modal'); await s.pickLabel(/^User “frank” signed in/);
  p = await s.waitUI('say');
  check('log dojo: a wrong reading is not accepted', /Not quite/.test(p.ui.text));
  await s.press('a'); await s.waitUI('modal'); await s.pickLabel(/^198\.51\.100\.23 sent a login POST at 03:14:07 UTC/);
  p = await s.waitUI('say');
  check('log dojo 1: the Apache time field with its offset converts to UTC', /\[day\/month\/year:hour:minute:second zone\]/.test(p.ui.text) && /03:14:07 UTC/.test(p.ui.text));
  await s.settle();
  const tl = await s.page.evaluate(() => { const toUtc = (h, m, s, off) => ((h - off) * 3600 + m * 60 + s + 86400) % 86400; return { A: toUtc(22, 14, 7, -5), B: toUtc(3, 13, 52, 0), C: toUtc(23, 16, 40, -4) }; });
  check('log dojo 2: the answer order B, A, C is right in UTC', tl.B < tl.A && tl.A < tl.C, tl);
  await s.goTo('basement', 5, 11); await s.settle();
  await s.goTo('basement', 7, 11); await s.settle();
  await s.goTo('basement', 21, 11); await s.settle();
  await s.goTo('basement', 23, 11); await s.waitUI('modal'); await s.pickLabel(/^A TCP connect scan/);
  p = await s.waitUI('say');
  check('scan dojo: “connect scan” for a half-open trace is not accepted', /Not quite/.test(p.ui.text));
  await s.press('a'); await s.waitUI('modal'); await s.pickLabel(/^A TCP SYN scan/);
  p = await s.waitUI('say');
  check('scan dojo 1: half-open, and connect scans are more likely to be logged (Nmap reference guide)', /half-open/.test(p.ui.text) && /more likely to log it/.test(p.ui.text));
  await s.settle();
  await s.goTo('basement', 25, 11); await s.settle();
  await s.goTo('basement', 27, 11); await s.settle();
  p = await s.peek();
  check('both Dojos complete: the log tool and the network tool level up; scanning needs written permission', p.f.bmLogDone && p.f.bmScanDone && p.party.find(t => t.id === 'ledger').lvl === 5 && p.party.find(t => t.id === 'lantern').lvl === 6 && await s.page.evaluate(() => G.fm['act:scanscope'] && G.fm['fact:nmap']), p.party);

  // ---- Basement Board ----
  await s.goTo('bboard', 9, 2);
  await s.settle();
  p = await s.peek();
  check('Basement Board won: Beacon Badge; Tier 3 senior analyst; Ledger evolved into Annalist (and still counts as Ledger for earlier checks); one gap closed (coverage 94%)',
    p.f.bmBoard && p.f.bmBeacon && p.rank === 'Tier 3 senior analyst' && p.party.some(t => t.id === 'annalist') && !p.party.some(t => t.id === 'ledger') && await s.page.evaluate(() => hasTool('ledger')) && p.metrics.bmCov === 94 && ['bms', 'proxy'].includes(p.extra.bm.gap), { party: p.party, rank: p.rank, cov: p.metrics.bmCov });
  const slow = await s.page.evaluate(() => {
    const G = __UPTIME.state(), m = G.map; G.map = 'basement'; let a; do { a = genAlert('mal'); } while (!BM_HOME.includes(a.threat));
    const fullBm = bmFullHere(); G.map = 'records'; const fullRh = bmFullHere(); G.map = m;
    return { rate: a.rate, fullBm, fullRh };
  });
  check('Beacon Badge: the basement has full logging, so dwell grows slower there (rate ≤ 13)', slow.fullBm && slow.rate <= 13, slow);
  check('Tier 3 escalates to Rae as incident lead; the cable trays shrink', await s.page.evaluate(() => tileDef('basement', 1, 3).ch === ',' && tileDef('basement', 1, 2).ch === '~'));

  // ---- Night 3 and the boss (with every earlier Unexplained note in the series save) ----
  await s.page.evaluate(() => { const q = Series.qt(); Object.keys(QT_CLUES).forEach(id => { if (!q.cluesFound.includes(id)) q.cluesFound.push(id); }); q.stage = 2; Series.save(); qtMirror(); });
  await s.goTo('basement', 13, 13); await s.settle();
  check('night 3', (await s.peek()).f.bmNight3);
  await s.goTo('basement', 14, 7);
  p = await settleTo(s, /Tabletop: a log that starts at 02:41/);
  check('boss: incident review surfaces the hidden scan as a missed attack; leadership and CISA told automatically, not by a card', (await s.peek()).m.surfaced >= 1 && !p.ui.options.some(o => /CISA|leadership|notify|report/i.test(o.label)), p.ui.options.map(o => o.label));
  const bs = await s.page.evaluate(() => { const a = bmBossStages(['hunt'], {hidden: true, reopened: false}), b = bmBossStages(['hunt'], {hidden: false, reopened: true}), c = bmBossStages([], null);
    return { hiddenClue: a.s3.clues[0], openClue: b.s3.clues[0], reopenClue: b.s3.clues[1], dHidden: a.s3.dwell0, dReopen: b.s3.dwell0, dNone: c.s3.dwell0, s1: a.s1.clues.join(' '), s2: a.s2.clues.join(' '), cards: BM_CARDS.filter(x => x.good).map(x => x.id + ':' + x.csf).join() }; });
  check('boss stages: the hidden exclusion is named in stage 3 and makes it harder; reopening the unticketed alert helps; the forwarded copies survive the 1102; R4 was the way in',
    /exclusion you shipped/.test(bs.hiddenClue) && /fired at 03:24/.test(bs.openClue) && /reopened ticket/.test(bs.reopenClue) && bs.dHidden === 25 && bs.dReopen === 5 && bs.dNone === 35 &&
    /02:40:52/.test(bs.s1) && /1102/.test(bs.s1) && /R4/.test(bs.s2) && bs.cards === 'preserve:Respond,timeline:Respond,rule:Respond,hunt:Detect', bs);
  await s.settle();
  p = await s.peek();
  check('boss done: game-original case, ATT&CK G1017 outline fact unlocked', p.f.bmBoss && p.f.bmCards.length === 4 && await s.page.evaluate(() => G.fm['fact:g1017'] && /selectively cleared/.test(FACTS.g1017.desc) && /game-original/.test(FACTS.g1017.desc)), p.f.bmCards);

  // ---- The suspicion file ----
  await s.goTo('basement', 16, 7);
  p = await settleTo(s, /Suspicion file/);
  const file = await s.modalText();
  await s.pickLabel(/^Disable svc-print and pull the router tonight/);
  p = await s.waitUI('say');
  check('suspicion file: acting alone tonight is refused (could warn whoever is behind it; Rae’s decision)', /warn whoever is behind it/.test(p.ui.text), p.ui.text);
  p = await settleTo(s, /Suspicion file/);
  await s.pickLabel(/^Hand it to Rae as a suspicion file/);
  await s.settle();
  p = await s.peek();
  const qc = await s.page.evaluate(() => {
    const ids = Object.keys(QT_CLUES), line = bmQtTimeline();
    return { allTimed: ids.every(id => BM_QT_LINE[id]), timesInSeen: ids.every(id => QT_CLUES[id].seen.includes(BM_QT_LINE[id].t)), techOk: line.every(x => QT_TECH[x.tech]),
      sorted: line.every((x, i) => i === 0 || line[i - 1].t <= x.t), n: line.length, nClues: ids.length,
      svcOk: ids.filter(id => /svc-print/.test(BM_QT_LINE[id].who)).every(id => /svc-print/.test(QT_CLUES[id].seen)),
      routerOk: ids.filter(id => /router/.test(BM_QT_LINE[id].where + BM_QT_LINE[id].who)).every(id => /router/.test(QT_CLUES[id].seen)),
      window: line.every(x => x.t >= '03:00' && x.t <= '03:40'), series: JSON.parse(localStorage.getItem('uptime.series')) };
  });
  check('suspicion file: every Unexplained note (12) is on one timeline in clock order, and each time, account and router mention matches the clue’s own text', qc.allTimed && qc.timesInSeen && qc.techOk && qc.sorted && qc.n === 12 && qc.nClues === 12 && qc.svcOk && qc.routerOk && qc.window, qc);
  check('suspicion file: carries the clock caveat; handed to Rae; recorded in the series save; the thread is not evicted', /order inside one night is uncertain/.test(file) && p.f.bmFile && p.extra.bm.file.clues.length === 12 && qc.series.editions['town-hall'].suspicionFile.length === 12 && qc.series.quietThread.evicted === false && qc.series.quietThread.stage === 2);

  // ---- Summary ----
  await s.goTo('basement', 14, 7);
  p = await settleTo(s, /IT Basement district: secured/);
  const sum = await s.modalText();
  check('summary: secured, Beacon Badge, Tier 3, the hidden attack named, the thread on file, “Next: the Server Room”',
    /IT Basement district: secured/.test(sum) && /Beacon Badge/.test(sum) && /Tier 3 senior analyst/.test(sum) && /one real attack hidden by an exclusion/.test(sum) && /The Quiet Thread is on file/.test(sum) && /Next: the Server Room/.test(sum) && /Forty quiet minutes/.test(sum), sum.slice(0, 400));
  await s.pickLabel(/Keep exploring/); await s.settle();
  p = await s.peek();
  check('after the district: objective done (Next: the Server Room); series save marks the IT Basement done', p.objective.done && /Server Room/.test(p.objective.text) && await s.page.evaluate(() => JSON.parse(localStorage.getItem('uptime.series')).editions['town-hall'].itBasement === true), p.objective);
  check('Credits list the basement sources and keep the MITRE notice', await s.page.evaluate(() => { const c = creditsHtml(); return /SP 800-41 Rev\. 1/.test(c) && /RFC 5905/.test(c) && /M-26-14/.test(c) && /Sysmon/.test(c) && /Nmap/.test(c) && /reproduced and distributed with the permission of The MITRE Corporation/.test(c); }));
  results.errors = s.errors; results.requests = s.requests;
  if (s.errors.length || s.requests.length) failed = true;
  await s.ctx.close();

  // ---- Phone 360x800: tuning, rule review and drill modals fit, options tappable ----
  const ph = await session(browser, { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ph.newGame();
  await recordsDone(ph, { bmMet: true, bmCover: true, bmTime: true, bmRet: true, bmFw: true });
  await ph.page.evaluate(() => { const G = __UPTIME.state(); BM(); G.map = 'basement'; G.x = 11; G.y = 3; G.dir = 'up'; run(bmTuning); });
  await ph.untilChoice(); await sleep(400);
  const fit = () => ph.page.evaluate(() => {
    const W = innerWidth, box = document.querySelector('.mbox').getBoundingClientRect();
    const opts = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect());
    return { sw: document.documentElement.scrollWidth, box: [box.left, box.right], optsInside: opts.every(r => r.left >= 0 && r.right <= W + 0.5) };
  });
  let lay = await fit();
  await ph.page.screenshot({ path: OUT + '/basement-phone-tuning.png' });
  check('phone: rule-tuning modal fits 360 px, no horizontal scroll', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  for (const re of [/^Exclude VS-01 only/, /^Exclude BKP-01 only/, /^Exclude PM-01 only/]) { await tapOpt(ph, re); await sleep(420); }
  await tapOpt(ph, /^Ship this tuning/); await sleep(420);
  await ph.settle();
  p = await ph.peek();
  check('phone: narrow tuning by taps keeps both real alerts (2 a week, nothing hidden, reopened)', p.extra.bm.tune.left === 2 && !p.extra.bm.tune.hidden && p.extra.bm.tune.reopened && p.metrics.bmPrec === 100, p.extra.bm.tune);
  await ph.page.evaluate(() => { const G = __UPTIME.state(); G.x = 23; G.y = 3; run(bmDrill2); });
  await ph.untilChoice(); await sleep(400);
  lay = await fit();
  await ph.page.screenshot({ path: OUT + '/basement-phone-drill.png' });
  check('phone: drill modal fits 360 px', lay.sw <= 360 && lay.box[0] >= 0 && lay.box[1] <= 360.5 && lay.optsInside, lay);
  results.phoneErrors = ph.errors; if (ph.errors.length || ph.requests.length) failed = true;
  await ph.ctx.close();

  results.seconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('BASEMENT TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
