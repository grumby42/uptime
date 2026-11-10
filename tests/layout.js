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
//  - modal share, both editions (portrait, landscape 800x360 and 844x390, desktop): a long body keeps at least 30% of the box
//    beside six long options, and a lone Back button under a long body is never squeezed or scrolled away
// Usage: node layout.js   (UPTIME_FILE=file:///... to test another build; UPTIME_PALETTE=contrast|light|... and UPTIME_TEXT=large)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SETTINGS_INIT = process.env.UPTIME_PALETTE || process.env.UPTIME_TEXT ? JSON.stringify({ v: 1, palette: process.env.UPTIME_PALETTE || 'classic', textSize: process.env.UPTIME_TEXT || 'normal' }) : null;
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
    const c = await b.newContext(opt);
    // UPTIME_PALETTE=<id> / UPTIME_TEXT=large: run the whole layout check under a palette and text size (engine/settings.js)
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [], reqs = [];
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
    // Council Chambers (the finale's map): with the Council Board as the objective, the marker sits on the west-wall door.
    await p.evaluate(() => { window.__realObjective = objective; objective = () => ({ text: 'Take the Council Board challenge.', map: 'ccboard', x: 8, y: 2 }); G.map = 'council'; G.x = 14; G.y = 6; }); await sleep(150);
    r.ccMarker = await p.evaluate(() => __UPTIME.peek().marker); r.ccHud = await hudCheck();
    check(name + ': Council Chambers: the objective’s door carries a marker (west wall 0,7 → Council Board), HUD clear of the map', r.ccMarker && r.ccMarker.x === 0 && r.ccMarker.y === 7 && !r.ccHud.overlap && !r.ccHud.truncated, { m: r.ccMarker, h: r.ccHud });
    await p.evaluate(() => { objective = window.__realObjective; });
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
  // Crossroads (edition 2): HUD band, the longest objective, modals above the pad, the rota and report modals and the
  // scorecard, at phone portrait, phone landscape and desktop. Crossroads has no battles, so no battle checks here.
  const CRF = 'file://' + path.resolve(__dirname, '../editions/crossroads/index.html');
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt);
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    await p.goto(CRF); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
    await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(450);
    await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
    for (let i = 0; i < 300; i++) { const q = await p.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
    await p.evaluate(() => __UPTIME.turbo(false)); await sleep(250);
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const hud = () => p.evaluate(() => { const hud = document.getElementById('hud'), sc = document.getElementById('screen'), ob = hud.querySelector('.obj'), st = hud.querySelector('.st');
      const h = hud.getBoundingClientRect(), s = sc.getBoundingClientRect(), lh = parseFloat(getComputedStyle(hud).lineHeight) || 15;
      return { overlap: h.bottom > s.top + 0.5 && h.top < s.bottom, truncated: ob.scrollWidth > ob.clientWidth + 1 || ob.scrollHeight > ob.clientHeight + 1 || st.scrollWidth > st.clientWidth + 1, lines: Math.round(ob.getBoundingClientRect().height / lh), sw: document.documentElement.scrollWidth, W: innerWidth }; });
    const h0 = await hud();
    check('Crossroads ' + name + ': HUD band clear of the map, nothing truncated, no horizontal scroll', !h0.overlap && !h0.truncated && h0.sw <= h0.W, h0);
    const lo = await p.evaluate(() => { const re = /(?:\bat\(|\btext:\s*)(['"])((?:(?!\1)[^\\]|\\.)*)\1/g, all = []; for (const f of [objective, lbObjective, sdObjective, cnObjective, dpObjective, apObjective]) { const src = f.toString(); let m; while ((m = re.exec(src))) all.push(m[2]); } all.sort((a, b) => b.length - a.length); return all[0]; });
    await p.evaluate(t => { window.__ro = objective; objective = () => ({ text: t, map: 'cwar', x: 1, y: 1 }); }, lo); await sleep(150);
    const h1 = await hud();
    check('Crossroads ' + name + ': the longest objective (' + lo.length + ' chars) wraps in full, at most 3 lines', !h1.truncated && !h1.overlap && h1.lines <= 3, h1);
    await p.evaluate(() => { objective = window.__ro; });
    const modalFit = () => p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad'), mb = document.getElementById('mbody');
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      const btnsOk = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); if (!q.width) return true; const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
      const t = mb.querySelector('table'); const wrapped = t ? [...t.querySelectorAll('td+td, th+th')].filter(td => { const lh = parseFloat(getComputedStyle(td).lineHeight) || 16; const rg = document.createRange(); rg.selectNodeContents(td); return rg.getBoundingClientRect().height > lh * 1.5 || td.scrollWidth > td.clientWidth + 1; }).map(td => td.textContent) : [];
      return { top: Math.round(box.top), bottom: Math.round(box.bottom), padTop: Math.round(padTop), H: innerHeight, btnsOk, overflow: mb.scrollWidth > mb.clientWidth + 1, wrapped }; });
    const fits = (m) => m.top >= 0 && (touch && portrait ? m.bottom <= m.padTop + 0.5 : m.bottom <= m.H + 0.5) && (!touch || m.btnsOk) && !m.overflow;
    await p.evaluate(() => { G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) }; G.cr.ex = { run: 1, actions: 3, closed: 3 }; G.cr.activate = 15; G.cr.aar = { total: 3, onTime: 3 }; G.trackId = 'manager'; track(); UI.openModal('Scorecard', scorecardHtml(), [{ label: 'Back' }]); }); await sleep(250);
    const sc = await modalFit();
    check('Crossroads ' + name + ': scorecard modal fits, table numbers and targets on one line', fits(sc) && !sc.wrapped.length, sc);
    await p.evaluate(() => UI.closeModal(-1)); await sleep(100);
    await p.evaluate(() => { run(() => doRota(CR_ROTA)); }); await sleep(300);
    const ro = await modalFit();
    check('Crossroads ' + name + ': rota modal (week table and seven leads) fits above the controls, no overflow', fits(ro), ro);
    await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-rota.png' });
    await p.evaluate(() => UI.closeModal(0)); await sleep(150);
    for (let i = 0; i < 12; i++) { const open = await p.evaluate(() => !!UI.modal); if (!open) break; await p.evaluate(() => UI.closeModal(0)); await sleep(60); }
    await p.evaluate(() => { run(() => doReport(LB_REPORT_PC)); }); await sleep(250);
    await p.evaluate(() => UI.closeModal(0)); await sleep(250);
    const rp = await modalFit();
    check('Crossroads ' + name + ': report finding modal (claim and the four wording options) fits above the controls', fits(rp) && /Finding 1 of 6/.test(await p.textContent('#modal')), rp);
    await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-report.png' });
    check('Crossroads ' + name + ': no console errors or network requests', !errs.length, errs);
    await c.close();
  }
  // Crossroads, School District (slice 2): the week-2 rota (two carried nights above seven), the inventory's modals, a drill
  // hub and an SCH-01 finding, at phone portrait, phone landscape and desktop: each fits above the controls, nothing
  // overflows sideways, and the body keeps at least 30% of the box (or shows whole) beside the options, so the evidence
  // the player must read is never cut to a line or two on a landscape phone.
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    land844: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt);
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const fresh = async () => {
      await p.goto(CRF); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(300);
      await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      for (let i = 0; i < 300; i++) { const q = await p.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
      await p.evaluate(() => { __UPTIME.turbo(false); G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) }; Object.assign(G.f, { lbSummary: true, lbBookmark: true, sdMet: true, sdNotice: true }); });
      await sleep(150);
    };
    const measure = () => p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad'), mb = document.getElementById('mbody'), mo = document.getElementById('mopts');
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      const btnsOk = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); if (!q.width) return true; const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
      const first = mo.querySelector('.opt'), fr = first ? first.getBoundingClientRect() : null, or = mo.getBoundingClientRect();
      return { title: document.querySelector('#modal .mhead').textContent.slice(0, 40), top: Math.round(box.top), bottom: Math.round(box.bottom), padTop: Math.round(padTop), H: innerHeight, btnsOk, overflow: mb.scrollWidth > mb.clientWidth + 1,
        box: Math.round(box.height), body: Math.round(mb.getBoundingClientRect().height), bodyAll: mb.scrollHeight <= mb.clientHeight + 1, firstRow: !fr || (fr.top >= or.top - 0.5 && fr.bottom <= or.bottom + 0.5) }; });
    const ok = m => m.top >= 0 && (touch && portrait ? m.bottom <= m.padTop + 0.5 : m.bottom <= m.H + 0.5) && (!touch || m.btnsOk) && !m.overflow && (m.bodyAll || m.body >= 0.3 * m.box) && m.firstRow;
    const shots = {};
    await fresh();
    await p.evaluate(() => { run(() => doRota(SD_ROTA, ['bea', 'ruth'])); }); await sleep(300);
    shots.rota = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-rota2.png' });
    // Review of slice 2, N2: "Leave this night uncovered" is pinned last (the cursor never opens on it) and its note
    // follows the district's threshold (07:00).
    const unc = await p.evaluate(() => { const m = UI.modal, o = [...document.querySelectorAll('#mopts .opt')]; return { last: /Leave this night uncovered/.test(o[o.length - 1].textContent) && /07:00/.test(o[o.length - 1].textContent), cursorOff: !/uncovered/.test(o[m.cursor] ? o[m.cursor].textContent : '') }; });
    check('Crossroads School District ' + name + ': the week-2 rota pins “Leave this night uncovered” last, with the district’s 07:00, and the cursor doesn’t open on it', unc.last && unc.cursorOff, unc);
    await fresh();
    await p.evaluate(() => { run(sdInventory); }); await sleep(250);
    shots.invSource = await measure();
    await p.evaluate(() => { const m = UI.modal; m.cursor = m.items.findIndex(o => o.meta && o.meta.good); UI.handle('a'); }); await sleep(250);
    shots.invTable = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-inventory.png' });
    await p.evaluate(() => UI.handle('a')); await sleep(250);
    shots.invOwner = await measure();
    await fresh();
    await p.evaluate(() => { run(() => doDrill(SD_DRILLS.tokendate)); }); await sleep(250);
    await p.evaluate(() => UI.handle('a')); await sleep(250);
    shots.drillHub = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-sddrill.png' });
    await fresh();
    await p.evaluate(() => { run(() => doReport(SD_REPORT_1)); }); await sleep(250);
    await p.evaluate(() => UI.closeModal(0)); await sleep(250);
    shots.finding = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-sch01.png' });
    for (const [k, m] of Object.entries(shots)) check('Crossroads School District ' + name + ': ' + k + ' (' + m.title.trim() + ') fits above the controls, body at least 30% of the box or whole, a full option row shown', ok(m), m);
    check('Crossroads School District ' + name + ': no console errors or network requests', !errs.length, errs);
    await c.close();
  }
  // Crossroads, Community Clinic (slice 3): the downtime decision, the weekend plan (with the week-2 rota's table), the AAR's
  // factor cards, a drill hub and a CLN-01 finding, at phone portrait, two landscape phones and desktop: each fits above the
  // controls, nothing overflows sideways, and the body keeps at least 30% of the box (or shows whole).
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    land844: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt);
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const fresh = async () => {
      await p.goto(CRF); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(300);
      await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      for (let i = 0; i < 300; i++) { const q = await p.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
      await p.evaluate(() => { __UPTIME.turbo(false); G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) };
        const a = ['beatriz', 'rae', 'bea', 'ruth', 'paz', 'odile', 'magda', 'bea', 'ruth']; G.cr.sd = { rota: { assign: a, stats: rotaStats(SD_ROTA, a) } };
        Object.assign(G.f, { lbSummary: true, lbBookmark: true, sdMet: true, sdSummary: true, sdSlate: true, cnMet: true, cnDowntime: true, cnDrillA: true, cnDrillB: true, cnDrillC: true }); G.map = 'clinic'; G.x = 4; G.y = 12; });
      await sleep(150);
    };
    const measure = () => p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad'), mb = document.getElementById('mbody'), mo = document.getElementById('mopts');
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      const btnsOk = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); if (!q.width) return true; const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
      const first = mo.querySelector('.opt'), fr = first ? first.getBoundingClientRect() : null, or = mo.getBoundingClientRect();
      return { title: document.querySelector('#modal .mhead').textContent.slice(0, 40), top: Math.round(box.top), bottom: Math.round(box.bottom), padTop: Math.round(padTop), H: innerHeight, btnsOk, overflow: mb.scrollWidth > mb.clientWidth + 1,
        box: Math.round(box.height), body: Math.round(mb.getBoundingClientRect().height), bodyAll: mb.scrollHeight <= mb.clientHeight + 1, firstRow: !fr || (fr.top >= or.top - 0.5 && fr.bottom <= or.bottom + 0.5) }; });
    const ok = m => m.top >= 0 && (touch && portrait ? m.bottom <= m.padTop + 0.5 : m.bottom <= m.H + 0.5) && (!touch || m.btnsOk) && !m.overflow && (m.bodyAll || m.body >= 0.3 * m.box) && m.firstRow;
    const shots = {};
    await fresh();
    await p.evaluate(() => { G.f.cnDowntime = false; run(cnDowntimeTask); }); await sleep(250);
    for (let i = 0; i < 10 && await p.evaluate(() => UI.mode === 'say'); i++) { await p.evaluate(() => UI.handle('a')); await sleep(60); }
    shots.downtime = await measure();
    await fresh();
    await p.evaluate(() => { run(cnStaffing); }); await sleep(250);
    for (let i = 0; i < 10 && await p.evaluate(() => UI.mode === 'say'); i++) { await p.evaluate(() => UI.handle('a')); await sleep(60); }
    shots.weekend = await measure();
    await p.evaluate(() => { const m = UI.modal; m.cursor = m.items.findIndex(o => o.meta && o.meta.good); UI.handle('a'); }); await sleep(300);
    shots.weekendPlan = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-weekend.png' });
    check('Crossroads Clinic ' + name + ': the weekend plan shows the week-2 rota’s table with Nights 12 to 14', await p.evaluate(() => /Night 12 \(Friday to Saturday\)/.test(document.getElementById('mbody').textContent) && !!document.querySelector('#mbody table.rota')), shots.weekendPlan);
    await fresh();
    await p.evaluate(() => { G.f.cnNight13 = true; G.cr.aar = { total: 3, onTime: 3 }; G.cr.cn = null; run(cnAar); }); await sleep(250);
    for (let i = 0; i < 10 && await p.evaluate(() => UI.mode === 'say'); i++) { await p.evaluate(() => UI.handle('a')); await sleep(60); }
    shots.aarCards = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-aar.png' });
    await fresh();
    await p.evaluate(() => { run(() => doDrill(CN_DRILLS.views)); }); await sleep(250);
    await p.evaluate(() => UI.handle('a')); await sleep(250);
    shots.drillHub = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-cndrill.png' });
    await fresh();
    await p.evaluate(() => { run(() => doReport(CN_REPORT_1)); }); await sleep(250);
    await p.evaluate(() => UI.closeModal(0)); await sleep(250);
    shots.finding = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-cln01.png' });
    for (const [k, m] of Object.entries(shots)) check('Crossroads Clinic ' + name + ': ' + k + ' (' + m.title.trim() + ') fits above the controls, body at least 30% of the box or whole, a full option row shown', ok(m), m);
    check('Crossroads Clinic ' + name + ': no console errors or network requests', !errs.length, errs);
    await c.close();
  }
  // Crossroads, Fire & EMS Dispatch (slice 4): the backup center's pack (cards), the 24-hour plan (with the week-3 rota's
  // table), the AAR's factor cards, a drill hub and a DSP-01 finding, at phone portrait, two landscape phones and desktop:
  // each fits above the controls, nothing overflows sideways, and the body keeps at least 30% of the box (or shows whole).
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    land844: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt);
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const fresh = async () => {
      await p.goto(CRF); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(300);
      await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      for (let i = 0; i < 300; i++) { const q = await p.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
      await p.evaluate(() => { __UPTIME.turbo(false); G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) };
        const a = ['beatriz', 'rae', 'bea', 'ruth', 'paz', 'odile', 'magda', 'bea', 'ruth']; G.cr.sd = { rota: { assign: a, stats: rotaStats(SD_ROTA, a) } };
        const w3 = ['ruth', 'paz', 'magda', 'bea', 'odile', 'beatriz', 'rae', 'magda', 'bea']; dpC().rota = { assign: w3, stats: rotaStats(DP_ROTA, w3) }; dpC().n15 = { n14: 'ruth', n15: 'paz' };
        Object.assign(G.f, { lbSummary: true, lbBookmark: true, sdMet: true, sdSummary: true, sdSlate: true, cnMet: true, cnSummary: true, cnPulse: true, dpMet: true, dpDrillA: true, dpDrillB: true, dpRota: true, dpNight16: true, dpCardsDrill: true }); G.map = 'dispatch'; G.x = 9; G.y = 8; });
      await sleep(150);
    };
    const measure = () => p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad'), mb = document.getElementById('mbody'), mo = document.getElementById('mopts');
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      const btnsOk = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); if (!q.width) return true; const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
      const first = mo.querySelector('.opt'), fr = first ? first.getBoundingClientRect() : null, or = mo.getBoundingClientRect();
      return { title: document.querySelector('#modal .mhead').textContent.slice(0, 40), top: Math.round(box.top), bottom: Math.round(box.bottom), padTop: Math.round(padTop), H: innerHeight, btnsOk, overflow: mb.scrollWidth > mb.clientWidth + 1,
        box: Math.round(box.height), body: Math.round(mb.getBoundingClientRect().height), bodyAll: mb.scrollHeight <= mb.clientHeight + 1, firstRow: !fr || (fr.top >= or.top - 0.5 && fr.bottom <= or.bottom + 0.5) }; });
    const ok = m => m.top >= 0 && (touch && portrait ? m.bottom <= m.padTop + 0.5 : m.bottom <= m.H + 0.5) && (!touch || m.btnsOk) && !m.overflow && (m.bodyAll || m.body >= 0.3 * m.box) && m.firstRow;
    const shots = {};
    const skipSays = async () => { for (let i = 0; i < 10 && await p.evaluate(() => UI.mode === 'say'); i++) { await p.evaluate(() => UI.handle('a')); await sleep(60); } };
    await fresh();
    await p.evaluate(() => { run(dpBackup); }); await sleep(250); await skipSays();
    shots.backupPack = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-dppack.png' });
    await fresh();
    await p.evaluate(() => { G.cr.dp.boss = { first: [], w1: 0 }; run(dpPlan24); }); await sleep(250); await skipSays();
    shots.plan24 = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-dpplan.png' });
    check('Crossroads Dispatch ' + name + ': the 24-hour plan shows Night 18 and the week-3 rota’s table', await p.evaluate(() => /Night 18 \(Thursday to Friday\)/.test(document.getElementById('mbody').textContent) && !!document.querySelector('#mbody table.rota')), shots.plan24);
    await fresh();
    await p.evaluate(() => { G.f.dpDrillC = true; G.cr.aar = { total: 6, onTime: 6 }; run(dpAar); }); await sleep(250); await skipSays();
    shots.aarCards = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-dpaar.png' });
    await fresh();
    await p.evaluate(() => { run(() => doDrill(DP_DRILLS.vendordfir)); }); await sleep(250);
    await p.evaluate(() => UI.handle('a')); await sleep(250);
    shots.drillHub = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-dpdrill.png' });
    await fresh();
    await p.evaluate(() => { run(() => doReport(DP_REPORT_1)); }); await sleep(250);
    await p.evaluate(() => UI.closeModal(0)); await sleep(250);
    shots.finding = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-dsp01.png' });
    for (const [k, m] of Object.entries(shots)) check('Crossroads Dispatch ' + name + ': ' + k + ' (' + m.title.trim() + ') fits above the controls, body at least 30% of the box or whole, a full option row shown', ok(m), m);
    check('Crossroads Dispatch ' + name + ': no console errors or network requests', !errs.length, errs);
    await c.close();
  }
  // Crossroads, the Regional Airport (slice 5): who owns what (cards), the weekend plan (with the week-4 rota's table), the
  // AAR's factor cards, a drill hub and an AIR-01 finding, at phone portrait, two landscape phones and desktop: each fits
  // above the controls, nothing overflows sideways, and the body keeps at least 30% of the box (or shows whole).
  for (const [name, opt] of Object.entries({
    phone360: { viewport: { width: 360, height: 800 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    phoneLand: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    land844: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    desktop: { viewport: { width: 1280, height: 800 } } })) {
    const c = await b.newContext(opt);
    if (SETTINGS_INIT) await c.addInitScript(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, SETTINGS_INIT);
    const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    const touch = !!opt.hasTouch, portrait = opt.viewport.height > opt.viewport.width;
    const fresh = async () => {
      await p.goto(CRF); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); }); await sleep(300);
      await p.evaluate(() => { [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
      for (let i = 0; i < 300; i++) { const q = await p.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
      await p.evaluate(() => { __UPTIME.turbo(false); G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) };
        const a = ['beatriz', 'rae', 'bea', 'ruth', 'paz', 'odile', 'magda', 'bea', 'ruth']; G.cr.sd = { rota: { assign: a, stats: rotaStats(SD_ROTA, a) } };
        const w3 = ['ruth', 'paz', 'magda', 'bea', 'odile', 'beatriz', 'rae', 'magda', 'bea']; dpC().rota = { assign: w3, stats: rotaStats(DP_ROTA, w3) }; dpC().n15 = { n14: 'ruth', n15: 'paz' };
        const w4 = ['magda', 'bea', 'ruth', 'paz', 'odile', 'beatriz', 'rae', 'magda', 'bea']; apC().rota = { assign: w4, stats: rotaStats(AP_ROTA, w4) };
        Object.assign(G.f, { lbSummary: true, lbBookmark: true, sdMet: true, sdSummary: true, sdSlate: true, cnMet: true, cnSummary: true, cnPulse: true, dpMet: true, dpSummary: true, dpRelay: true, apMet: true, apDrillA: true, apDrillB: true }); G.map = 'airport'; G.x = 22; G.y = 12; });
      await sleep(150);
    };
    const measure = () => p.evaluate(() => { const box = document.querySelector('#modal .mbox').getBoundingClientRect(), pad = document.getElementById('pad'), mb = document.getElementById('mbody'), mo = document.getElementById('mopts');
      const padTop = pad.getBoundingClientRect().height ? pad.getBoundingClientRect().top : innerHeight;
      const btnsOk = [...document.querySelectorAll('[data-btn]')].every(e => { const q = e.getBoundingClientRect(); if (!q.width) return true; const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return t && (t === e || e.contains(t)); });
      const first = mo.querySelector('.opt'), fr = first ? first.getBoundingClientRect() : null, or = mo.getBoundingClientRect();
      return { title: document.querySelector('#modal .mhead').textContent.slice(0, 40), top: Math.round(box.top), bottom: Math.round(box.bottom), padTop: Math.round(padTop), H: innerHeight, btnsOk, overflow: mb.scrollWidth > mb.clientWidth + 1,
        box: Math.round(box.height), body: Math.round(mb.getBoundingClientRect().height), bodyAll: mb.scrollHeight <= mb.clientHeight + 1, firstRow: !fr || (fr.top >= or.top - 0.5 && fr.bottom <= or.bottom + 0.5) }; });
    const ok = m => m.top >= 0 && (touch && portrait ? m.bottom <= m.padTop + 0.5 : m.bottom <= m.H + 0.5) && (!touch || m.btnsOk) && !m.overflow && (m.bodyAll || m.body >= 0.3 * m.box) && m.firstRow;
    const shots = {};
    const skipSays = async () => { for (let i = 0; i < 10 && await p.evaluate(() => UI.mode === 'say'); i++) { await p.evaluate(() => UI.handle('a')); await sleep(60); } };
    await fresh();
    await p.evaluate(() => { run(apOwnersTask); }); await sleep(250); await skipSays();
    shots.owners = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-apowners.png' });
    await fresh();
    await p.evaluate(() => { apC().boss = { first: [] }; run(apPlanWeekend); }); await sleep(250); await skipSays();
    shots.weekend = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-apweekend.png' });
    check('Crossroads Airport ' + name + ': the weekend plan shows Night 27 and the week-4 rota’s table', await p.evaluate(() => /Night 27 \(Saturday to Sunday\)/.test(document.getElementById('mbody').textContent) && !!document.querySelector('#mbody table.rota')), shots.weekend);
    await fresh();
    await p.evaluate(() => { G.f.apNight28 = true; G.cr.aar = { total: 9, onTime: 9 }; run(apAar); }); await sleep(250); await skipSays();
    shots.aarCards = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-apaar.png' });
    await fresh();
    await p.evaluate(() => { run(() => doDrill(AP_DRILLS.lastdfir)); }); await sleep(250);
    await p.evaluate(() => UI.handle('a')); await sleep(250);
    shots.drillHub = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-apdrill.png' });
    await fresh();
    await p.evaluate(() => { run(() => doReport(AP_REPORT_1)); }); await sleep(250);
    await p.evaluate(() => UI.closeModal(0)); await sleep(250);
    shots.finding = await measure(); await p.screenshot({ path: OUT + '/layout-crossroads-' + name + '-air01.png' });
    for (const [k, m] of Object.entries(shots)) check('Crossroads Airport ' + name + ': ' + k + ' (' + m.title.trim() + ') fits above the controls, body at least 30% of the box or whole, a full option row shown', ok(m), m);
    check('Crossroads Airport ' + name + ': no console errors or network requests', !errs.length, errs);
    await c.close();
  }
  // Modal share (review of Crossroads slice 1, B6), both editions: a long body with six long options, and a long body
  // with a lone Back button, at phone portrait, phone landscape (two sizes) and desktop. The body keeps at least 30% of
  // the box (or shows whole); the options show at least one full row (or show whole); a lone Back button is never
  // squeezed or scrolled away.
  for (const [ed, file] of [['Town Hall', FILE], ['Crossroads', 'file://' + path.resolve(__dirname, '../editions/crossroads/index.html')]]) {
    for (const [name, opt] of Object.entries({
      phone360x640: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      phone390x844: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      land800x360: { viewport: { width: 800, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      land844x390: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
      desktop: { viewport: { width: 1280, height: 800 } } })) {
      const c = await b.newContext(opt); const p = await c.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(e.message)); p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
      await p.goto(file); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
      const probe = (nOpts) => p.evaluate(async (nOpts) => {
        UI.modal = null;   // set the title menu aside without answering it (its handler would read the answer)
        const body = '<pre class="art">' + Array.from({ length: 14 }, (_, i) => 'line ' + i + ' of an artefact with some width').join('\n') + '</pre><p>' + 'A paragraph of context the player has to read. '.repeat(10) + '</p>';
        const items = nOpts === 1 ? [{ label: 'Back', meta: { back: true } }] : Array.from({ length: nOpts }, (_, i) => ({ label: 'Option ' + i + ': a reasonably long answer label that wraps onto a second line on a phone', meta: {} }));
        UI.openModal('Probe', body, items, { closable: false, cls: 'drill' });
        await new Promise(r => setTimeout(r, 150));
        const r = e => e.getBoundingClientRect(), box = r(document.querySelector('#modal .mbox')), mb = document.getElementById('mbody'), mo = document.getElementById('mopts');
        const first = mo.querySelector('.opt'), fr = r(first), or = r(mo);
        const out = { box: Math.round(box.height), body: Math.round(r(mb).height), bodyAll: mb.scrollHeight <= mb.clientHeight + 1, opts: Math.round(or.height), optsAll: mo.scrollHeight <= mo.clientHeight + 1,
          firstRowShown: fr.top >= or.top - 0.5 && fr.bottom <= or.bottom + 0.5, inView: box.top >= -0.5 && box.bottom <= innerHeight + 0.5 };
        UI.closeModal(-1);
        return out;
      }, nOpts);
      const many = await probe(6), lone = await probe(1);
      check(ed + ' ' + name + ': a long body keeps at least 30% of the modal next to six long options, and a full option row shows', (many.bodyAll || many.body >= 0.3 * many.box) && (many.optsAll || many.firstRowShown) && many.inView, many);
      check(ed + ' ' + name + ': a lone Back button under a long body is shown whole, not squeezed or scrolled', lone.optsAll && lone.firstRowShown && lone.inView, lone);
      check(ed + ' ' + name + ': modal probes raise no errors or requests', !errs.length, errs);
      await c.close();
    }
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
    await p.goto('file://' + path.resolve(__dirname, '../index.html'));
    await p.click('a.ed[href*="crossroads"]'); await p.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui, null, { timeout: 5000 });
    const opens2 = /editions\/crossroads\/index\.html$/.test(p.url()) && await p.evaluate(() => EDITION.id === 'crossroads');
    check('series menu: the Crossroads entry opens the Crossroads edition', opens2 && !errs.length && !reqs.length, { opens2, errs, reqs });
    await c.close();
  }
  await b.close();
  const failed = results.filter(x => !x.ok);
  console.log(JSON.stringify({ suite: 'layout', palette: process.env.UPTIME_PALETTE || 'classic', text: process.env.UPTIME_TEXT || 'normal', passed: results.length - failed.length, failed: failed.length, results }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('LAYOUT FAILED:', e.message); process.exit(2); });
