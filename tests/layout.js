// Layout check, at phone portrait 360x800 and 412x915, phone landscape 800x360 and desktop 1280x800:
//  - every pad button and the screen fit inside the viewport; no horizontal scroll
//  - the HUD is its own band: it never overlaps the map, and the objective is never cut off (wraps instead),
//    even for the longest objective in the edition
//  - with a modal open (menu, drill) the touch controls stay visible and tappable, the modal sits clear of them,
//    and the pad's D-pad / A / B drive the modal
//  - battle: alert card, tool card and both sprites never overlap each other and stay on the screen; the choice panel
//    never covers any of them, and every option and note in it is fully visible or reachable by scrolling it
//  - scorecard / summary table: numbers and targets never wrap, the table never overflows its page
//  - the current objective's door carries a marker
// Usage: node layout.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
// The longest objective text in the edition is read from the page itself: every string literal returned as an
// objective by objective() and the districts' xxObjective() functions (computed, not hand-copied).
let LONG = null;
const longestObjective = p => p.evaluate(() => {
  const fns = Object.getOwnPropertyNames(window).filter(n => /^(objective|[a-z]{2}Objective)$/.test(n) && typeof window[n] === 'function');
  const re = /(?:\bat\(|\btext:\s*)(['"])((?:(?!\1)[^\\]|\\.)*)\1/g, all = [];
  for (const n of fns) { const src = window[n].toString(); let m; while ((m = re.exec(src))) all.push(m[2].replace(/\\(.)/g, '$1')); }
  all.sort((a, b) => b.length - a.length);
  return { fns, n: all.length, longest: all[0] };
});
const results = []; const check = (name, ok, info) => results.push({ name, ok: !!ok, info: ok ? undefined : info });

async function freeOnMap(p) {
  for (let i = 0; i < 400; i++) {
    const q = await p.evaluate(() => __UPTIME.peek());
    if (!q.ui && q.party && q.party.length && !q.busy) return;
    if (!q.ui) { if (!q.busy && q.started && !q.party.length) await p.evaluate(() => { G.dir = 'right'; interact(); }); await sleep(30); continue; }
    if (q.ui.type === 'say') await p.evaluate(() => UI.handle('a'));
    else { const g = q.ui.options.findIndex(o => o.meta && o.meta.good); await p.evaluate(i => { const m = UI.modal || UI.choice; m.cursor = i; UI.handle('a'); }, g < 0 ? 0 : g); }
    await sleep(20);
  }
  throw new Error('intro never finished');
}
const overlap = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;

(async () => {
  const b = await chromium.launch(); const res = {};
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phone412: { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt); const p = await c.newPage(); const errs = [], reqs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
    await p.goto(FILE); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
    await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); });
    await sleep(450);
    await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
    await freeOnMap(p);
    await p.evaluate(() => __UPTIME.turbo(false)); await sleep(300);
    if (!LONG) {
      const lo = await longestObjective(p); LONG = lo.longest;
      check('longest objective found from the edition’s objective functions (' + lo.fns.length + ' functions, ' + lo.n + ' texts): ' + LONG.length + ' chars', lo.fns.length >= 7 && lo.n >= 60 && LONG.length > 60, lo);
    }
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const r = {};
    const fits = () => p.evaluate(() => {
      const W = innerWidth, H = innerHeight, out = [];
      document.querySelectorAll('[data-btn], #screen, #hud').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.left < -0.5 || r.right > W + 0.5 || r.top < -0.5 || r.bottom > H + 0.5)) out.push(e.dataset.btn || e.id); });
      return { offscreen: out, scrollW: document.documentElement.scrollWidth, W };
    });
    const hudCheck = () => p.evaluate(() => {
      const hud = document.getElementById('hud'), sc = document.getElementById('screen'), ob = hud.querySelector('.obj'), st = hud.querySelector('.st');
      const h = hud.getBoundingClientRect(), s = sc.getBoundingClientRect(), cs = getComputedStyle(ob);
      const lh = parseFloat(getComputedStyle(hud).lineHeight) || 15;
      return { hudBottom: Math.round(h.bottom), screenTop: Math.round(s.top), overlap: h.bottom > s.top + 0.5 && h.top < s.bottom,
        visible: getComputedStyle(hud).visibility !== 'hidden' && h.height > 0,
        truncated: ob.scrollWidth > ob.clientWidth + 1 || ob.scrollHeight > ob.clientHeight + 1 || st.scrollWidth > st.clientWidth + 1 || (cs.textOverflow === 'ellipsis' && cs.whiteSpace === 'nowrap'),
        objLines: Math.round(ob.getBoundingClientRect().height / lh), text: ob.textContent };
    });
    // 1. map: fits, HUD band, marker
    Object.assign(r, await fits());
    r.hud = await hudCheck();
    check(name + ': nothing off-screen, no horizontal scroll', !r.offscreen.length && r.scrollW <= r.W, r);
    check(name + ': HUD band sits above the map, not over it', r.hud.visible && !r.hud.overlap, r.hud);
    check(name + ': objective not truncated', !r.hud.truncated, r.hud);
    await p.screenshot({ path: OUT + '/layout-' + name + '.png' });
    await p.evaluate(t => { window.__realObjective = objective; objective = () => ({ text: t, map: 'desk', x: 1, y: 1 }); }, LONG);
    await sleep(150);
    r.hudLong = await hudCheck();
    check(name + ': longest objective wraps in full, no overlap', !r.hudLong.truncated && !r.hudLong.overlap && r.hudLong.text.includes(LONG.slice(-12)) && r.hudLong.objLines <= 3, r.hudLong);
    await p.evaluate(() => { objective = window.__realObjective; });
    await p.evaluate(() => { G.map = 'hub'; G.x = 14; G.y = 7; }); await sleep(150);
    r.marker = await p.evaluate(() => __UPTIME.peek().marker);
    check(name + ': the objective’s door carries a marker (hub → Front Desk door 4,6)', r.marker && r.marker.x === 4 && r.marker.y === 6, r.marker);
    await p.evaluate(() => { G.map = 'desk'; G.x = 9; G.y = 8; }); await sleep(100);
    // 2. modal open: controls visible and working
    await p.evaluate(() => { run(startMenu); }); await sleep(500);
    r.modal = await p.evaluate(() => {
      const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad');
      const btns = [...document.querySelectorAll('[data-btn]')].map(e => { const q = e.getBoundingClientRect(); const top = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        return { b: e.dataset.btn, shown: q.width > 0 && getComputedStyle(e).visibility !== 'hidden' && !!top && (top === e || e.contains(top)) }; });
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      return { padShown: getComputedStyle(pad).display !== 'none', btns, boxBottom: Math.round(box.bottom), boxTop: Math.round(box.top), padTop: Math.round(padTop), H: innerHeight, cursor: UI.modal && UI.modal.cursor };
    });
    if (touch) {
      check(name + ': touch controls stay visible and tappable with a modal open', r.modal.padShown && r.modal.btns.every(x => x.shown), r.modal);
      if (portrait) check(name + ': the modal sits above the controls', r.modal.boxBottom <= r.modal.padTop + 0.5 && r.modal.boxTop >= 0, r.modal);
      await sleep(400);
      await p.tap('[data-btn="down"]'); await sleep(120);
      const c1 = await p.evaluate(() => UI.modal && UI.modal.cursor);
      await p.tap('[data-btn="b"]'); await sleep(150);
      const closed = await p.evaluate(() => !UI.modal);
      check(name + ': the pad drives the modal (D-pad moves, B closes)', c1 === (r.modal.cursor + 1) && closed, { before: r.modal.cursor, after: c1, closed });
    } else {
      check(name + ': the modal fits the window', r.modal.boxTop >= 0 && r.modal.boxBottom <= r.modal.H, r.modal);
      await p.keyboard.press('x'); await sleep(150);
    }
    // 3. drill: same checks while a long modal is open
    if (touch) {
      await p.evaluate(() => { run(() => doDrill(Object.values(MR_DRILLS)[0])); }); await sleep(400);
      await p.evaluate(() => UI.handle('a')); await sleep(300);
      r.drill = await p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad').getBoundingClientRect();
        const ok = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
        const o = [...document.querySelectorAll('#mopts .opt')].map(e => e.getBoundingClientRect()); let optsOverlap = false;
        for (let i = 1; i < o.length; i++) if (o[i].top < o[i - 1].bottom - 0.5) optsOverlap = true;
        const mb = document.getElementById('mbody').getBoundingClientRect();
        return { ok, optsOverlap, bodyH: Math.round(mb.height), boxBottom: Math.round(box.bottom), padTop: Math.round(pad.top) }; });
      check(name + ': drill modal: controls visible, modal clear of them, options never overlap, body still shown', r.drill.ok && !r.drill.optsOverlap && r.drill.bodyH >= 40 && (!portrait || r.drill.boxBottom <= r.drill.padTop + 0.5), r.drill);
      await p.screenshot({ path: OUT + '/layout-' + name + '-drill.png' });
      await c.close();
      // fresh page for the battle (the drill can't be abandoned)
    }
    let q = p;
    if (touch) {
      const c2 = await b.newContext(opt); q = await c2.newPage();
      q.on('pageerror', e => errs.push(e.message)); q.on('console', m => m.type() === 'error' && errs.push(m.text()));
      q.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
      await q.goto(FILE); await q.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await q.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(450);
      await q.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      await freeOnMap(q); await q.evaluate(() => __UPTIME.turbo(false)); await sleep(200);
    }
    // 4. battle: boxes and sprites never overlap
    await q.evaluate(() => { G.party.push({ id: 'lantern', lvl: 3, xp: 0, tuned: false }); run(async () => { await doBattle(Object.assign(genAlert('mal'), { title: 'Remote desktop sign-in from overseas, then a new local administrator account' })); }); });
    await sleep(500); await q.evaluate(() => UI.handle('a')); await sleep(300); await q.evaluate(() => UI.handle('a')); await sleep(400);
    r.battle = await q.evaluate(() => {
      const sc = document.getElementById('screen').getBoundingClientRect(), k = sc.width / VW;
      const L = BATTLE_LAYOUT, R = (o, bob) => ({ left: sc.left + o.x * k, top: sc.top + (o.y - bob) * k, right: sc.left + (o.x + o.w) * k, bottom: sc.top + (o.y + o.h + bob) * k });
      const box = id => { const e = document.getElementById(id).getBoundingClientRect(); return { left: e.left, top: e.top, right: e.right, bottom: e.bottom }; };
      const items = { card: box('bcard'), tool: box('btool'), enemy: R(L.enemy, 1), toolSprite: R(L.tool, 0) };
      const inside = Object.entries(items).filter(([, v]) => v.left < sc.left - 0.5 || v.right > sc.right + 0.5 || v.top < sc.top - 0.5 || v.bottom > sc.bottom + 0.5).map(([k]) => k);
      return { items, inside, screen: { top: sc.top, bottom: sc.bottom, h: sc.height }, vh: VH };
    });
    const names = Object.keys(r.battle.items), clash = [];
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) if (overlap(r.battle.items[names[i]], r.battle.items[names[j]])) clash.push(names[i] + '/' + names[j]);
    check(name + ': battle: alert card, tool card and sprites never overlap, all on screen', !clash.length && !r.battle.inside.length && r.battle.vh === 180, { clash, offscreen: r.battle.inside, battle: r.battle });
    // The choice panel: never over the sprites or the cards; every option and its note fully visible, or reachable by
    // scrolling the panel; nothing hidden under the on-screen controls; the panel itself on screen.
    r.bpanel = await q.evaluate(() => {
      const panel = document.getElementById('panel'), pr = panel.getBoundingClientRect();
      const opts = [...panel.querySelectorAll('#popts .opt')], bad = [];
      const scrolls = panel.scrollHeight > panel.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(panel).overflowY);
      for (const o of opts) {
        o.scrollIntoView({ block: 'nearest' });
        const pc = panel.getBoundingClientRect(), r = o.getBoundingClientRect();
        const note = o.querySelector('.note'), nr = note ? note.getBoundingClientRect() : r;
        const inside = x => x.top >= pc.top - 0.5 && x.bottom <= pc.top + panel.clientHeight + 3.5 && x.left >= pc.left - 0.5 && x.right <= pc.right + 0.5 && x.bottom <= innerHeight + 0.5 && x.top >= -0.5;
        const pts = [[r.left + 12, (r.top + r.bottom) / 2], [r.right - 6, (r.top + r.bottom) / 2], [nr.left + 4, (nr.top + nr.bottom) / 2]];
        const covered = pts.some(([x, y]) => { const t = document.elementFromPoint(x, y); return !t || !(t === o || o.contains(t) || t === panel || t.id === 'popts'); });
        if (!inside(r) || !inside(nr) || covered) bad.push({ label: o.textContent, r: [r.top, r.bottom].map(Math.round), note: [nr.top, nr.bottom].map(Math.round), panel: [pc.top, pc.top + panel.clientHeight].map(Math.round), covered });
      }
      panel.scrollTop = 0;
      return { n: opts.length, labels: opts.map(o => o.textContent), bad, scrolls, rect: { left: pr.left, top: pr.top, right: pr.right, bottom: pr.bottom }, onScreen: pr.top >= -0.5 && pr.bottom <= innerHeight + 0.5 && pr.left >= -0.5 && pr.right <= innerWidth + 0.5 };
    });
    const pclash = Object.entries(r.battle.items).filter(([, v]) => overlap(v, r.bpanel.rect)).map(([k]) => k);
    check(name + ': battle: the choice panel never covers the sprites or the cards, and sits on screen', !pclash.length && r.bpanel.onScreen && r.bpanel.n >= 6, { pclash, panel: r.bpanel.rect, n: r.bpanel.n });
    check(name + ': battle: every option and note in the choice panel is fully visible (or reachable by scrolling it), none under the controls', !r.bpanel.bad.length, { bad: r.bpanel.bad, scrolls: r.bpanel.scrolls });
    check(name + ': battle: the action menu fits its panel without scrolling (nothing clipped at the bottom)', !r.bpanel.scrolls, r.bpanel);
    await q.screenshot({ path: OUT + '/layout-' + name + '-battle.png' });
    const fitsB = await q.evaluate(() => { const H = innerHeight, W = innerWidth; return [...document.querySelectorAll('[data-btn], #screen')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.top < -0.5 || r.bottom > H + 0.5 || r.left < -0.5 || r.right > W + 0.5); }).map(e => e.dataset.btn || e.id); });
    check(name + ': battle: nothing off-screen', !fitsB.length, fitsB);
    // 5. scorecard: no wrapped numbers or targets, no overflow
    await q.evaluate(() => { B = null; bhud(); G.f.directive = true; G.track.esc = { best: 100, worst: 0 }; G.m.esc = 3; G.m.escOk = 2; UI.choice = null; UI.mode = null; UI.openModal('Scorecard', scorecardHtml(), [{ label: 'Back' }]); });
    await sleep(300);
    r.score = await q.evaluate(() => {
      const t = document.querySelector('#modal table.sc'), mb = document.getElementById('mbody');
      const wrapped = [...t.querySelectorAll('td+td, th+th')].filter(td => { const lh = parseFloat(getComputedStyle(td).lineHeight) || 16; const range = document.createRange(); range.selectNodeContents(td); return range.getBoundingClientRect().height > lh * 1.5 || td.scrollWidth > td.clientWidth + 1; }).map(td => td.textContent);
      return { wrapped, overflow: mb.scrollWidth > mb.clientWidth + 1 || t.getBoundingClientRect().right > mb.getBoundingClientRect().right + 0.5 };
    });
    check(name + ': scorecard: numbers and targets on one line, no overflow', !r.score.wrapped.length && !r.score.overflow, r.score);
    await q.screenshot({ path: OUT + '/layout-' + name + '-score.png' });
    check(name + ': no console errors or network requests', !errs.length && !reqs.length, { errs, reqs });
    res[name] = r;
    await q.context().close().catch(() => {});
  }
  // Series menu (repo root index.html): fits a phone, no network, and its link opens the built edition.
  {
    const c = await b.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true }); const p = await c.newPage(); const errs = [], reqs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    const scrollW = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.screenshot({ path: OUT + '/layout-menu.png' });
    await p.click('a.ed'); await p.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui, null, { timeout: 5000 });
    const opens = /editions\/town-hall\/index\.html$/.test(p.url());
    check('series menu: fits a phone, opens the edition, no errors or requests', scrollW <= 360 && opens && !errs.length && !reqs.length, { scrollW, opens, errs, reqs });
    await c.close();
  }
  await b.close();
  const failed = results.filter(x => !x.ok);
  console.log(JSON.stringify({ suite: 'layout', passed: results.length - failed.length, failed: failed.length, results }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('LAYOUT FAILED:', e.message); process.exit(2); });
