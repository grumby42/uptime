// Modal fit (maintenance slice 1): every graded modal, in both editions, at landscape phones 800x360 and 844x390,
// portrait phones 390x844 and 360x640, and desktop 1280x800. Fails if any answer option is clipped or off-screen.
//  - The modals: every graded modal the three desktop bots open in a full play (Town Hall; Crossroads, both tracks),
//    recorded with UPTIME_MODAL_LOG (tests/bot.js), plus the cases tests/modalcases.js builds from each edition's own data:
//    every drill (hub, questions, verdict, reasoning, alternatives) with the findings empty, longest first and shortest
//    first; every report finding at every position a seed can give it; every clue stage with its clues as written,
//    longest first and shortest first.
//  - Each option is scrolled into view the way the game scrolls the highlight (scrollIntoView, nearest), and must then lie
//    whole inside the modal box, inside the window and clear of the on-screen controls, with no text cut sideways. In the
//    'mkeep' layout (the options keep their own height) every option must be in view when the modal opens, with no
//    scrolling at all, and the body keeps at least 30% of the box or shows whole; in 'mscroll' the box scrolls as one page.
//  - The modal opens at its top (the title shows); the box sits above the pad on a portrait phone and clear of the
//    controls on a landscape one; every pad button stays visible and tappable (touch viewports), in every graded modal
//    (the investigation drills and the Mail Room's inbox among them) and in the Start menu, which the pad drives.
//  - Toasts: with a modal open a toast shows in the lane below the box, clear of the box, the HUD and the controls, and the
//    map toast is hidden; a toast that started on the map moves to the lane when a modal opens and back when it closes;
//    on the map the toast sits inside the screen, clear of the HUD band.
// Usage: node tests/modalfit.js            (plays the three desktop bots first, about 4 minutes, in parallel)
//        MODAL_CORPUS=dir node tests/modalfit.js   (reuse town-hall.jsonl, cr-manager.jsonl and cr-dfir.jsonl from dir)
//        SHOTS=dir: also save screenshots of a sample of modals at each viewport into dir
//        UPTIME_PALETTE=contrast|light|... and UPTIME_TEXT=large: run it under a palette / text size
const { chromium } = require('playwright');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const MC = require('./modalcases');
const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
const TH = 'file://' + ROOT + '/editions/town-hall/index.html', CRF = 'file://' + ROOT + '/editions/crossroads/index.html';
const VIEWPORTS = {
  land800x360: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  land844x390: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  phone390x844: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  phone360x640: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop1280x800: { viewport: { width: 1280, height: 800 } } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
// UPTIME_PALETTE=<id> / UPTIME_TEXT=large: run the whole check under a palette and text size (as tests/layout.js does)
const SETTINGS_INIT = process.env.UPTIME_PALETTE || process.env.UPTIME_TEXT ? JSON.stringify({ v: 1, palette: process.env.UPTIME_PALETTE || 'classic', textSize: process.env.UPTIME_TEXT || 'normal' }) : null;
const results = []; const check = (name, ok, info) => results.push({ name, ok: !!ok, info: ok ? undefined : info });

function runBot(env, outdir) {
  return new Promise(res => execFile('node', [path.join(__dirname, 'bot.js'), 'desktop', outdir], { env: Object.assign({}, process.env, env), maxBuffer: 1 << 26, timeout: 45 * 60 * 1000 }, (err) => res(err ? (err.code || 1) : 0)));
}
async function corpus() {
  let dir = process.env.MODAL_CORPUS;
  if (!dir) {
    dir = OUT + '/modals'; fs.mkdirSync(dir, { recursive: true });
    const rc = await Promise.all([
      runBot({ UPTIME_MODAL_LOG: dir + '/town-hall.jsonl', UPTIME_FILE: TH }, dir + '/bot-th'),
      runBot({ UPTIME_MODAL_LOG: dir + '/cr-manager.jsonl', UPTIME_FILE: CRF, TRACK: 'manager' }, dir + '/bot-crm'),
      runBot({ UPTIME_MODAL_LOG: dir + '/cr-dfir.jsonl', UPTIME_FILE: CRF, TRACK: 'dfir' }, dir + '/bot-crd')]);
    check('the three desktop bots that record the graded modals finish (Town Hall, Crossroads manager, Crossroads DFIR)', rc.every(x => x === 0), rc);
  }
  const read = f => fs.existsSync(dir + '/' + f) ? fs.readFileSync(dir + '/' + f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const th = read('town-hall.jsonl'), cr = read('cr-manager.jsonl').concat(read('cr-dfir.jsonl'));
  const dedupe = L => { const seen = new Set(); return L.filter(m => { const k = m.title + '\u0001' + m.body + '\u0001' + m.items.map(i => i.label).join('\u0001'); if (seen.has(k)) return false; seen.add(k); return true; }); };
  return { th: dedupe(th).map((m, i) => Object.assign(m, { id: 'played#' + i + ' ' + m.title.slice(0, 40) })), cr: dedupe(cr).map((m, i) => Object.assign(m, { id: 'played#' + i + ' ' + m.title.slice(0, 40) })) };
}

// Page side: open each case and measure it. Returns the failures and a summary.
function measureAll(cases) {
  const W = innerWidth, H = innerHeight, touch = document.body.classList.contains('touch'), portrait = document.body.classList.contains('portrait');
  const btns = [...document.querySelectorAll('[data-btn]')].filter(e => e.getBoundingClientRect().width > 0);
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const pad = document.getElementById('pad'), padR = pad.getBoundingClientRect(), padTop = portrait && touch && padR.height ? padR.top : H;
  const bad = [], stat = { n: 0, keep: 0, scroll: 0, minShare: 1 };
  for (const c of cases) {
    UI.modal = null;
    UI.openModal(c.title, c.body, c.items, c.o);
    const box = document.querySelector('#modal .mbox'), mb = document.getElementById('mbody'), mo = document.getElementById('mopts'), head = box.querySelector('.mhead');
    const mode = box.classList.contains('mkeep') ? 'mkeep' : box.classList.contains('mscroll') ? 'mscroll' : 'none';
    const B = box.getBoundingClientRect(), fail = [];
    stat.n++; if (mode === 'mkeep') stat.keep++; if (mode === 'mscroll') stat.scroll++;
    if (mode === 'none') fail.push('no layout chosen');
    if (B.top < -0.5 || B.left < -0.5 || B.right > W + 0.5 || B.bottom > H + 0.5) fail.push('box off-screen ' + [B.top, B.bottom].map(Math.round));
    if (touch && portrait && B.bottom > padTop + 0.5) fail.push('box under the pad');
    if (touch) for (const e of btns) if (hit(B, e.getBoundingClientRect())) fail.push('box under ' + e.dataset.btn);
    if (touch) for (const e of btns) { const q = e.getBoundingClientRect(), t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (!t || !(t === e || e.contains(t))) fail.push('control covered ' + e.dataset.btn); }
    if (head && head.offsetHeight && head.getBoundingClientRect().top < B.top - 0.5) fail.push('opens below its top');
    if (mo.scrollWidth > mo.clientWidth + 1) fail.push('options wider than their pane');
    // The options never sit in a pane that scrolls on its own: such a pane cuts the option at its edge (the landscape
    // fold the reviews kept finding). In either layout the options pane is as tall as its options.
    if (mo.scrollHeight > mo.clientHeight + 1) fail.push('options pane scrolls (' + Math.round(mo.clientHeight) + ' of ' + mo.scrollHeight + ' px shown)');
    const opts = [...mo.querySelectorAll('.opt')];
    // mkeep: every option in view at open, nothing scrolled
    if (mode === 'mkeep') {
      const share = mb.scrollHeight <= mb.clientHeight + 1 ? 1 : mb.getBoundingClientRect().height / B.height; stat.minShare = Math.min(stat.minShare, share);
      if (share < 0.3 - 1e-6) fail.push('body share ' + share.toFixed(2));
      opts.forEach((o, i) => { const r = o.getBoundingClientRect(); if (r.top < B.top - 0.5 || r.bottom > B.bottom + 0.5 || r.bottom > H + 0.5) fail.push('option ' + i + ' not in view at open'); });
    }
    if (mode === 'mscroll' && mb.scrollHeight > mb.clientHeight + 1) fail.push('mscroll but the body scrolls inside the box');
    // every option: scrolled into view like the highlight, then whole and clear
    opts.forEach((o, i) => {
      o.scrollIntoView({ block: 'nearest' });
      const r = o.getBoundingClientRect(), b = box.getBoundingClientRect(), p = mo.getBoundingClientRect();
      const top = Math.max(b.top + 3, p.top, 0), bottom = Math.min(b.bottom - 3, p.bottom, H, padTop);
      if (r.top < top - 0.5 || r.bottom > bottom + 0.5) fail.push('option ' + i + ' clipped ' + [r.top, r.bottom, top, bottom].map(Math.round));
      if (r.left < b.left - 0.5 || r.right > b.right + 0.5 || r.left < -0.5 || r.right > W + 0.5) fail.push('option ' + i + ' off the side');
      if (o.scrollWidth > o.clientWidth + 1) fail.push('option ' + i + ' text cut sideways');
      if (touch) for (const e of btns) if (hit(r, e.getBoundingClientRect())) fail.push('option ' + i + ' under ' + e.dataset.btn);
      const t = document.elementFromPoint(Math.min(r.right - 4, r.left + 16), (r.top + r.bottom) / 2);
      if (!t || !(t === o || o.contains(t))) fail.push('option ' + i + ' covered');
    });
    if (fail.length) bad.push({ id: c.id, mode, fail: fail.slice(0, 4) });
    UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = '';
  }
  return { bad, stat };
}

// Page side: the toast lane and the map toast.
function toastCheck() {
  if (typeof UI.toast !== 'function') return { map: { missing: true }, lane: { missing: true }, lane2: {}, back: {} };
  const H = innerHeight, W = innerWidth, touch = document.body.classList.contains('touch');
  const rect = e => { const r = e.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, w: r.width, h: r.height }; };
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const btns = touch ? [...document.querySelectorAll('[data-btn]')].filter(e => e.getBoundingClientRect().width > 0).map(rect) : [];
  const hudEl = document.getElementById('hud'), hud = rect(hudEl), hudOn = getComputedStyle(hudEl).visibility !== 'hidden' && hud.h > 0;
  const msg = 'Weekly sample: a person caught a real alert Ledger had auto-closed. It is back in the queue.';
  const out = {};
  // 1. a toast that starts on the map
  UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = '';
  UI.toast(msg, 60000);
  const t = document.getElementById('toast'), tr = rect(t), sc = rect(document.getElementById('screen'));
  out.map = { shown: t.classList.contains('show'), inScreen: tr.top >= sc.top - 0.5 && tr.bottom <= sc.bottom + 0.5 && tr.left >= sc.left - 0.5 && tr.right <= sc.right + 0.5, hud: hudOn && hit(tr, hud), btn: btns.some(b => hit(tr, b)) };
  // 2. a modal opens while it shows: it moves to the lane
  const body = '<pre class="art">' + Array.from({ length: 14 }, (_, i) => 'line ' + i + ' of an artefact with some width').join('\n') + '</pre><p>' + 'A paragraph of context the player has to read. '.repeat(8) + '</p>';
  const items = Array.from({ length: 5 }, (_, i) => ({ label: 'Option ' + i + ': a reasonably long answer label that wraps onto a second line on a phone', meta: { good: i === 0 } }));
  UI.openModal('Toast lane probe', body, items, { shuffle: true, closable: false, cls: 'drill' });
  const lane = document.getElementById('mtoast'), box = rect(document.querySelector('#modal .mbox'));
  // options as shown: clipped to the box (in 'mscroll' the ones below the fold lie outside the box's rect, out of view)
  const lr = rect(lane), opts = [...document.querySelectorAll('#mopts .opt')].map(rect).map(o => ({ left: o.left, right: o.right, top: Math.max(o.top, box.top), bottom: Math.min(o.bottom, box.bottom) })).filter(o => o.bottom > o.top);
  out.lane = { shown: lane.classList.contains('show') && lr.h > 0, text: lane.textContent === msg, mapHidden: !t.classList.contains('show') || getComputedStyle(t).opacity === '0',
    box: hit(lr, box), opts: opts.some(o => hit(lr, o)), hud: hudOn && hit(lr, hud), btn: btns.some(b => hit(lr, b)), onScreen: lr.top >= -0.5 && lr.bottom <= H + 0.5 && lr.left >= -0.5 && lr.right <= W + 0.5,
    boxOn: box.top >= -0.5 && box.bottom <= H + 0.5 };
  // 3. a new toast while the modal is open goes to the lane too
  UI.toast('CSF Detect unlocked in the Field Manual', 60000);
  const lr2 = rect(lane);
  out.lane2 = { shown: lane.classList.contains('show'), text: lane.textContent === 'CSF Detect unlocked in the Field Manual', box: hit(lr2, rect(document.querySelector('#modal .mbox'))), mapHidden: !t.classList.contains('show') };
  // 4. the modal closes: the toast is back on the map
  UI.closeModal(-1);
  out.back = { shown: t.classList.contains('show'), text: t.textContent === 'CSF Detect unlocked in the Field Manual' };
  UI.toast('', 1); UI.toastTick(5);
  out.gone = !t.classList.contains('show');
  return out;
}

(async () => {
  const C = await corpus();
  const b = await chromium.launch();
  const SHOTS = process.env.SHOTS;
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  for (const [ed, file, dir, played] of [['Town Hall', TH, 'town-hall', C.th], ['Crossroads', CRF, 'crossroads', C.cr]]) {
    const N = MC.names(ROOT + '/editions/' + dir);
    check(ed + ': the generator finds drill sets' + (dir === 'crossroads' ? ', reports' : '') + ' and clue stages (' + N.drills.length + ' drill sets, ' + N.reports.length + ' reports, ' + N.stages.length + ' stage functions)', N.drills.length >= (dir === 'crossroads' ? 6 : 8) && N.stages.length >= (dir === 'crossroads' ? 12 : 1) && (dir !== 'crossroads' || N.reports.length >= 10), N);
    check(ed + ': the recorded play has graded modals (' + played.length + ')', played.length >= (dir === 'crossroads' ? 150 : 150), played.length);
    for (const [vn, opt] of Object.entries(VIEWPORTS)) {
      const c = await b.newContext(opt); const errs = [];
      if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
      const p = await c.newPage();
      p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
      await p.goto(file); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(300);
      await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      for (let i = 0; i < 400; i++) {
        const q = await p.evaluate(() => __UPTIME.peek());
        if (!q.ui && !q.busy && q.started && (dir === 'crossroads' || (q.party && q.party.length))) break;
        if (!q.ui) { if (!q.busy && q.started && dir !== 'crossroads' && !q.party.length) await p.evaluate(() => { G.dir = 'right'; interact(); }); await sleep(30); continue; }
        await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } });
        await sleep(15);
      }
      await p.evaluate(() => __UPTIME.turbo(false));
      if (dir === 'crossroads') await p.evaluate(() => { // the state the finale's stage functions read (as tests/layout.js sets it)
        G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) };
        const w4 = ['magda', 'bea', 'ruth', 'paz', 'odile', 'beatriz', 'rae', 'magda', 'bea']; apC().rota = { assign: w4, stats: rotaStats(AP_ROTA, w4) }; fnC().rota = rotaAuto(FN_ROTA, fnPre(), SD_ROTA_ORDER); G.day = 34; });
      await p.evaluate('window.__mfT = {' + [].concat(N.drills, N.reports, N.stages).map(n => n + ': (typeof ' + n + ' !== "undefined" ? ' + n + ' : null)').join(', ') + '}');
      const g = await p.evaluate(MC.gen, N);
      if (vn === 'land800x360') check(ed + ': every generated case builds (' + g.cases.length + ' cases)', !g.errors.length && g.cases.length > 50, g.errors);
      const all = g.cases.concat(played);
      const res = { bad: [], stat: { n: 0, keep: 0, scroll: 0, minShare: 1 } };
      for (let i = 0; i < all.length; i += 150) {
        const r = await p.evaluate(measureAll, all.slice(i, i + 150));
        res.bad.push(...r.bad); res.stat.n += r.stat.n; res.stat.keep += r.stat.keep; res.stat.scroll += r.stat.scroll; res.stat.minShare = Math.min(res.stat.minShare, r.stat.minShare);
      }
      check(ed + ' ' + vn + ': every graded modal (' + res.stat.n + ': ' + g.cases.length + ' built from the data, ' + played.length + ' from the recorded play; ' + res.stat.keep + ' keep the options whole, ' + res.stat.scroll + ' scroll as one page; smallest body share ' + res.stat.minShare.toFixed(2) + ') shows every option whole, on screen and clear of the controls',
        !res.bad.length, { n: res.bad.length, first: res.bad.slice(0, 12) });
      const tc = await p.evaluate(toastCheck);
      check(ed + ' ' + vn + ': a toast on the map sits inside the screen, clear of the HUD' + (opt.hasTouch ? ' and the controls' : ''), tc.map.shown && tc.map.inScreen && !tc.map.hud && !tc.map.btn, tc.map);
      check(ed + ' ' + vn + ': with a modal open the toast shows in the lane below the box, clear of the box, its options, the HUD and the controls; the map toast is hidden', tc.lane.shown && tc.lane.text && tc.lane.mapHidden && !tc.lane.box && !tc.lane.opts && !tc.lane.hud && !tc.lane.btn && tc.lane.onScreen && tc.lane.boxOn, tc.lane);
      check(ed + ' ' + vn + ': a toast raised during a modal goes to the lane; after the modal it shows on the map, then fades', tc.lane2.shown && tc.lane2.text && !tc.lane2.box && tc.lane2.mapHidden && tc.back.shown && tc.back.text && tc.gone, tc);
      if (SHOTS) {
        const pickIds = dir === 'crossroads' ? [/^FN_REPORT_CMP\.claim\d+\.at1$/, /^fnMgrBossStages\.s2\.long$/, /^FN_DRILLS\.fnsigndfir\.verdict\.long$/, /^AP_DRILLS\.[a-z]+\.hub\.long$/]
          : [/^RH_DRILLS\.[a-z]+\.verdict\.long$/, /^ccBossStages\.s1\.long$/, /^MR_DRILLS\.[a-z]+\.hub\.long$/, /^CC_DRILLS\.insurer\.verdict\.long$/];
        for (const re of pickIds) {
          const cs = g.cases.find(x => re.test(x.id)); if (!cs) continue;
          await p.evaluate(cs => { UI.modal = null; UI.openModal(cs.title, cs.body, cs.items, cs.o); }, cs); await sleep(80);
          await p.screenshot({ path: SHOTS + '/' + dir + '-' + vn + '-' + cs.id.replace(/[^A-Za-z0-9.]+/g, '_') + '.png' });
        }
        await p.evaluate(() => UI.toast('CSF Detect unlocked in the Field Manual', 60000)); await sleep(80);
        await p.screenshot({ path: SHOTS + '/' + dir + '-' + vn + '-toast-lane.png' });
      }
      if (opt.hasTouch) {
        // The Start menu (not graded, so not in the replay): the pad stays visible and drives it.
        await p.evaluate(() => { UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = ''; run(startMenu); }); await sleep(450);
        const m0 = await p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect();
          const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
          const btns = [...document.querySelectorAll('[data-btn]')].map(e => { const q = e.getBoundingClientRect(), t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return { b: e.dataset.btn, ok: q.width > 0 && !!t && (t === e || e.contains(t)) && !hit(box, q) }; });
          return { btns, cursor: UI.modal && UI.modal.cursor, n: UI.modal && UI.modal.items.length }; });
        await p.tap('[data-btn="down"]'); await sleep(120);
        const c1 = await p.evaluate(() => UI.modal && UI.modal.cursor);
        await p.tap('[data-btn="b"]'); await sleep(150);
        const closed = await p.evaluate(() => !UI.modal);
        check(ed + ' ' + vn + ': with the Start menu open every pad button stays visible, tappable and clear of the box, and the pad drives it (down moves, B closes)', m0.btns.every(x => x.ok) && c1 === (m0.cursor + 1) % m0.n && closed, { m0, c1, closed });
      }
      check(ed + ' ' + vn + ': no console errors or network requests', !errs.length, errs);
      await c.close();
    }
  }
  await b.close();
  const failed = results.filter(x => !x.ok);
  console.log(JSON.stringify({ suite: 'modalfit', passed: results.length - failed.length, failed: failed.length, results }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('MODALFIT FAILED:', e.stack || e.message); process.exit(2); });
