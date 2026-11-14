// Modal fit (maintenance slice 1): every graded modal, in both editions, at landscape phones 800x360 and 844x390,
// portrait phones 390x844 and 360x640, and desktop 1280x800. Fails if any answer option is clipped or off-screen.
//  - The modals: every graded modal the three desktop bots open in a full play (Town Hall; Crossroads, both tracks),
//    recorded with UPTIME_MODAL_LOG (tests/bot.js; Charter's prologue and Budget too, since edition 3), plus the cases tests/modalcases.js builds from each edition's own data:
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
//  - Input (maintenance slice 1 review, S1): in every modal, at open, A must never act on an option that is not whole on
//    screen: if the highlight is out of view, A brings it into view (highlight unchanged) and the next A acts. The D-pad
//    likewise: down at open either moves to an option shown whole or first brings the hidden highlight into view; A then acts.
//  - "More below" cues (S2): while options (mscroll) or body text (mkeep) go on below what is shown, a cue says so, inside
//    the box, on screen, readable (contrast >= 4.5:1, at least 12 px, 15 px under large text); once nothing is below
//    (scrolled to the end) it is hidden. Also checked in every palette at both text sizes on a sample.
//  - A toast that arrives mid-modal (N4) never switches the layout: it shows in the lane with every option still whole, or
//    waits until the modal closes; when it fades the layout stays as it was.
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
const TH = 'file://' + ROOT + '/editions/town-hall/index.html', CRF = 'file://' + ROOT + '/editions/crossroads/index.html', CHF = 'file://' + ROOT + '/editions/charter/index.html';
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
      runBot({ UPTIME_MODAL_LOG: dir + '/cr-dfir.jsonl', UPTIME_FILE: CRF, TRACK: 'dfir' }, dir + '/bot-crd'),
      runBot({ UPTIME_MODAL_LOG: dir + '/charter.jsonl', UPTIME_FILE: CHF }, dir + '/bot-ch')]);
    check('the four desktop bots that record the graded modals finish (Town Hall, Crossroads manager, Crossroads DFIR, Charter)', rc.every(x => x === 0), rc);
  }
  const read = f => fs.existsSync(dir + '/' + f) ? fs.readFileSync(dir + '/' + f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const th = read('town-hall.jsonl'), cr = read('cr-manager.jsonl').concat(read('cr-dfir.jsonl')), ch = read('charter.jsonl');
  const dedupe = L => { const seen = new Set(); return L.filter(m => { const k = m.title + '\u0001' + m.body + '\u0001' + m.items.map(i => i.label).join('\u0001'); if (seen.has(k)) return false; seen.add(k); return true; }); };
  return { th: dedupe(th).map((m, i) => Object.assign(m, { id: 'played#' + i + ' ' + m.title.slice(0, 40) })), cr: dedupe(cr).map((m, i) => Object.assign(m, { id: 'played#' + i + ' ' + m.title.slice(0, 40) })), ch: dedupe(ch).map((m, i) => Object.assign(m, { id: 'played#' + i + ' ' + m.title.slice(0, 40) })) };
}

// Page side: open each case and measure it. Returns the failures and a summary.
function measureAll(cases) {
  const W = innerWidth, H = innerHeight, touch = document.body.classList.contains('touch'), portrait = document.body.classList.contains('portrait');
  const btns = [...document.querySelectorAll('[data-btn]')].filter(e => e.getBoundingClientRect().width > 0);
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const pad = document.getElementById('pad'), padR = pad.getBoundingClientRect(), padTop = portrait && touch && padR.height ? padR.top : H;
  const bad = [], bad2 = [], stat = { n: 0, keep: 0, scroll: 0, minShare: 1, hidAtOpen: 0, aRevealed: 0, cueO: 0, cueT: 0, toastLane: 0, toastHeld: 0 };
  const big = document.body.classList.contains('bigtext');
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const reset = () => { UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = ''; UI.toastLeft = 0; UI.toastHeld = false; UI.toastMsg = ''; UI.syncToast(); };
  const open = c => { reset(); UI.openModal(c.title, c.body, c.items, c.o); return document.querySelector('#modal .mbox'); };
  // the test's own view of "whole on screen": inside the box's inner area and the window, above the pad, nothing over it
  const whole = (el, box) => {
    const r = el.getBoundingClientRect(), B = box.getBoundingClientRect(), it = B.top + box.clientTop, ib = it + box.clientHeight;
    if (!(r.height > 0) || r.top < Math.max(it, 0) - 0.5 || r.bottom > Math.min(ib, H, padTop) + 0.5) return false;
    const x = Math.min(r.right - 4, r.left + 16);
    return [r.top + 3, (r.top + r.bottom) / 2, r.bottom - 3].every(y => { const t = document.elementFromPoint(x, y); return t && (t === el || el.contains(t)); });
  };
  const curEl = () => document.querySelector('#mopts [data-i="' + UI.modal.cursor + '"]');
  const pressA = (box, fail, tag) => { const mm = UI.modal, s0 = mm.sel.size, vis = whole(curEl(), box); UI.handle('a'); const acted = UI.modal !== mm || mm.sel.size !== s0; if (acted && !vis) fail.push(tag + ': A acted on option ' + mm.cursor + ', not whole on screen'); return acted; };
  // a cue that is shown: visible, inside the box and the window, its words present, readable
  const cueOk = (el, box) => {
    if (!el) return 'missing';
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), B = box.getBoundingClientRect(), af = getComputedStyle(el, '::after').content || '';
    if (cs.display === 'none' || cs.visibility !== 'visible' || !(r.height > 0)) return 'not shown';
    if (r.top < B.top - 0.5 || r.bottom > B.bottom + 0.5 || r.top < -0.5 || r.bottom > H + 0.5 || r.bottom > padTop + 0.5) return 'off the box ' + [r.top, r.bottom, B.top, B.bottom].map(Math.round);
    if (!/below/.test(af)) return 'no words';
    const fs = parseFloat(cs.fontSize); if (fs < (big ? 15 : 12) - 0.01) return 'font ' + fs;
    const cr = ratio(cs.color, cs.backgroundColor); if (cr < 4.5) return 'contrast ' + cr.toFixed(2);
    return '';
  };
  const cueShown = el => !!el && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility === 'visible';
  for (const c of cases) {
    UI.modal = null; UI.toastLeft = 0; UI.toastHeld = false; UI.toastMsg = ''; UI.syncToast();
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
    const fin = [];
    // S2: the cues at open, and once scrolled to the end
    {
      const bx = open(c), mb2 = document.getElementById('mbody'), m2 = bx.classList.contains('mscroll') ? 'mscroll' : 'mkeep';
      const co = document.getElementById('mmoreO'), ct = document.getElementById('mmoreT');
      const optsBelow = [...document.querySelectorAll('#mopts .opt')].some(o => !whole(o, bx) && o.getBoundingClientRect().top > bx.getBoundingClientRect().top);
      const textBelow = m2 === 'mkeep' && mb2.scrollHeight - mb2.scrollTop - mb2.clientHeight > 2;
      if (m2 === 'mscroll' && optsBelow) { stat.cueO++; const e = cueOk(co, bx); if (e) fin.push('options below at open, cue: ' + e); }
      if (m2 === 'mscroll' && !optsBelow && cueShown(co)) fin.push('options cue shown with nothing below');
      if (textBelow) { stat.cueT++; const e = cueOk(ct, bx); if (e) fin.push('text below at open, cue: ' + e); }
      if (!textBelow && cueShown(ct)) fin.push('text cue shown with nothing below');
      if (m2 === 'mscroll' && cueShown(ct)) fin.push('text cue in mscroll');
      if (m2 === 'mkeep' && cueShown(co)) fin.push('options cue in mkeep');
      // scrolled to the end (as a player's swipe would: the scroll event updates the cue)
      bx.scrollTop = bx.scrollHeight; bx.dispatchEvent(new Event('scroll')); mb2.scrollTop = mb2.scrollHeight; mb2.dispatchEvent(new Event('scroll'));
      if (cueShown(co) || cueShown(ct)) fin.push('a cue still shows at the end of the page');
      if (m2 === 'mscroll') { const lastO = [...document.querySelectorAll('#mopts .opt')].pop(); if (lastO && !whole(lastO, bx)) fin.push('last option not whole at the end of the page'); }
    }
    // S1: A at open never acts on an option not whole on screen; it reveals it, and the next A acts
    {
      const bx = open(c), mm = UI.modal, en = !mm.items[mm.cursor].disabled;
      const vis0 = whole(curEl(), bx); if (!vis0) stat.hidAtOpen++;
      const acted = pressA(bx, fin, 'A at open');
      if (!acted && en) {
        if (!vis0) stat.aRevealed++;
        if (UI.modal !== mm || !whole(curEl(), bx)) fin.push('A at open did not bring the highlight whole into view');
        if (UI.modal === mm && !pressA(bx, fin, 'second A')) fin.push('second A did nothing');
      }
    }
    // S1, the D-pad: down at open moves to an option shown whole, or first reveals the hidden highlight; A then acts
    {
      const bx = open(c), mm = UI.modal, n = mm.items.length, c0 = mm.cursor, vis0 = whole(curEl(), bx);
      UI.handle('down');
      if (UI.modal === mm && n > 1) {
        if (!vis0 && mm.cursor !== c0) fin.push('down at open moved the highlight while it was out of view');
        if (!whole(curEl(), bx)) fin.push('after down the highlight (' + mm.cursor + ') is not whole on screen');
        let ok = false; for (let k = 0; k < 3 && !ok && UI.modal === mm; k++) { if (mm.items[mm.cursor].disabled) { ok = true; break; } ok = pressA(bx, fin, 'A after down'); }
        if (!ok && UI.modal === mm) fin.push('A after down never acted');
      }
    }
    // N4: a toast mid-modal never switches the layout
    {
      const bx = open(c), m0 = bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll';
      UI.toast('Badge earned: Patient Analyst. A person caught a real alert Ledger had auto-closed, and it is back in the queue.', 60000);
      const lane = document.getElementById('mtoast'), m1 = bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll';
      if (m1 !== m0) fin.push('a toast mid-modal switched ' + m0 + ' to ' + m1);
      if (lane.classList.contains('show')) {
        stat.toastLane++;
        const L = lane.getBoundingClientRect(), B = bx.getBoundingClientRect();
        if (L.top < B.bottom - 0.5 || L.bottom > Math.min(H, padTop) + 0.5) fin.push('toast lane over the box or off screen');
        if (m0 === 'mkeep') [...document.querySelectorAll('#mopts .opt')].forEach((o, i) => { if (!whole(o, bx)) fin.push('with a toast, option ' + i + ' not whole'); });
      } else {
        stat.toastHeld++;
        if (!UI.toastHeld) fin.push('toast neither in the lane nor held');
        if (document.getElementById('toast').classList.contains('show')) fin.push('held toast shows on the map over the modal');
      }
      UI.toastLeft = 1; UI.toastTick(5);
      const m3 = bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll';
      if (m3 !== m0 && UI.modal) fin.push('a toast fading mid-modal switched ' + m0 + ' to ' + m3);
      if (UI.modal) { UI.renderModal(); if ((bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll') !== m0) fin.push('after a toast faded, a cursor move switched the layout'); }
    }
    // ... and a toast already showing when the modal opens keeps its lane's space after it fades
    {
      reset(); UI.toast('Badge earned: Patient Analyst. A person caught a real alert Ledger had auto-closed, and it is back in the queue.', 60000);
      UI.openModal(c.title, c.body, c.items, c.o);
      const bx = document.querySelector('#modal .mbox'), m0 = bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll';
      UI.toastLeft = 1; UI.toastTick(5); UI.renderModal();
      const m1 = bx.classList.contains('mkeep') ? 'mkeep' : 'mscroll';
      if (m1 !== m0) fin.push('a toast shown at open faded and a cursor move switched ' + m0 + ' to ' + m1);
    }
    if (fail.length) bad.push({ id: c.id, mode, fail: fail.slice(0, 4) });
    if (fin.length) bad2.push({ id: c.id, mode, fail: fin.slice(0, 4) });
    reset();
  }
  return { bad, bad2, stat };
}

// Page side (S2): the "more below" cues in every palette at both text sizes, on the first cases that open with options
// below (mscroll) and with body text below (mkeep): shown, inside the box, words present, contrast >= 4.5:1 against their
// own background, at least 12 px (15 px under large text).
function cueSample(cases) {
  const H = innerHeight, out = [], seen = {};
  const lum = c => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const v0 = Object.assign({}, Settings.v);
  for (const pal of PALETTES.map(p => p.id)) for (const ts of ['normal', 'large']) {
    Settings.set({ palette: pal, textSize: ts });
    let n = 0;
    for (const want of ['mscroll', 'mkeep']) {
      for (const c of cases) {
        UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = '';
        UI.openModal(c.title, c.body, c.items, c.o);
        const box = document.querySelector('#modal .mbox'), mb = document.getElementById('mbody');
        if (!box.classList.contains(want)) continue;
        if (want === 'mkeep' && !(mb.scrollHeight - mb.clientHeight > 2)) continue;
        const el = document.getElementById(want === 'mscroll' ? 'mmoreO' : 'mmoreT'), cs = getComputedStyle(el), r = el.getBoundingClientRect(), B = box.getBoundingClientRect();
        const fs = parseFloat(cs.fontSize), cr = ratio(cs.color, cs.backgroundColor), af = getComputedStyle(el, '::after').content || '';
        const ok = cs.visibility === 'visible' && cs.display !== 'none' && r.height > 0 && r.top >= B.top - 0.5 && r.bottom <= Math.min(B.bottom, H) + 0.5 && /below/.test(af) && fs >= (ts === 'large' ? 15 : 12) - 0.01 && cr >= 4.5;
        n++; if (!ok) out.push({ pal, ts, want, id: c.id, fs, cr: +cr.toFixed(2), vis: cs.visibility, af });
        break;
      }
    }
    seen[pal + '/' + ts] = n;
  }
  UI.modal = null; UI.modalEl.classList.remove('show'); UI.modalEl.innerHTML = '';
  Settings.set({ palette: v0.palette, textSize: v0.textSize });
  return { out, seen };
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
  for (const [ed, file, dir, played] of [['Town Hall', TH, 'town-hall', C.th], ['Crossroads', CRF, 'crossroads', C.cr], ['Charter', CHF, 'charter', C.ch]]) {
    const N = MC.names(ROOT + '/editions/' + dir);
    check(ed + ': the generator finds drill sets' + (dir === 'crossroads' ? ', reports' : '') + ' and clue stages (' + N.drills.length + ' drill sets, ' + N.reports.length + ' reports, ' + N.stages.length + ' stage functions)', N.drills.length >= (dir === 'charter' ? 1 : dir === 'crossroads' ? 6 : 8) && N.stages.length >= (dir === 'charter' ? 0 : dir === 'crossroads' ? 12 : 1) && (dir !== 'crossroads' || N.reports.length >= 10), N);
    check(ed + ': the recorded play has graded modals (' + played.length + ')', played.length >= (dir === 'charter' ? 30 : 150), played.length);
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
        if (!q.ui && !q.busy && q.started && (dir !== 'town-hall' || (q.party && q.party.length))) break;
        if (!q.ui) { if (!q.busy && q.started && dir === 'town-hall' && !q.party.length) await p.evaluate(() => { G.dir = 'right'; interact(); }); await sleep(30); continue; }
        await p.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } });
        await sleep(15);
      }
      await p.evaluate(() => __UPTIME.turbo(false));
      if (dir === 'crossroads') await p.evaluate(() => { // the state the finale's stage functions read (as tests/layout.js sets it)
        G.trackId = 'manager'; G.cr.rota = { assign: ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae'], stats: rotaStats(CR_ROTA, ['bea', 'ruth', 'paz', 'odile', 'magda', 'beatriz', 'rae']) };
        const w4 = ['magda', 'bea', 'ruth', 'paz', 'odile', 'beatriz', 'rae', 'magda', 'bea']; apC().rota = { assign: w4, stats: rotaStats(AP_ROTA, w4) }; fnC().rota = rotaAuto(FN_ROTA, fnPre(), SD_ROTA_ORDER); G.day = 34; });
      await p.evaluate('window.__mfT = {' + [].concat(N.drills, N.reports, N.stages).map(n => n + ': (typeof ' + n + ' !== "undefined" ? ' + n + ' : null)').join(', ') + '}');
      const g = await p.evaluate(MC.gen, N);
      if (vn === 'land800x360') check(ed + ': every generated case builds (' + g.cases.length + ' cases)', !g.errors.length && g.cases.length > (dir === 'charter' ? 30 : 50), g.errors);
      const all = g.cases.concat(played);
      const res = { bad: [], bad2: [], stat: { n: 0, keep: 0, scroll: 0, minShare: 1, hidAtOpen: 0, aRevealed: 0, cueO: 0, cueT: 0, toastLane: 0, toastHeld: 0 } };
      for (let i = 0; i < all.length; i += 150) {
        const r = await p.evaluate(measureAll, all.slice(i, i + 150));
        res.bad.push(...r.bad); res.bad2.push(...r.bad2); res.stat.minShare = Math.min(res.stat.minShare, r.stat.minShare);
        for (const k of Object.keys(r.stat)) if (k !== 'minShare') res.stat[k] += r.stat[k];
      }
      console.error(ed + ' ' + vn + ' ' + JSON.stringify(res.stat) + ' bad ' + res.bad.length + ' input/cue/toast ' + res.bad2.length);
      check(ed + ' ' + vn + ': every graded modal (' + res.stat.n + ': ' + g.cases.length + ' built from the data, ' + played.length + ' from the recorded play; ' + res.stat.keep + ' keep the options whole, ' + res.stat.scroll + ' scroll as one page; smallest body share ' + res.stat.minShare.toFixed(2) + ') shows every option whole, on screen and clear of the controls',
        !res.bad.length, { n: res.bad.length, first: res.bad.slice(0, 12) });
      check(ed + ' ' + vn + ': A at open never acts on an option not whole on screen (' + res.stat.hidAtOpen + ' open with the highlight out of view; A brought it into view in ' + res.stat.aRevealed + '), and down then A acts only on a shown option; "more below" cues show while options (' + res.stat.cueO + ') or text (' + res.stat.cueT + ') go on below, readable, and hide at the end; a toast mid-modal (' + res.stat.toastLane + ' in the lane, ' + res.stat.toastHeld + ' held until close) never switches the layout',
        !res.bad2.length && res.stat.aRevealed === res.stat.hidAtOpen, { n: res.bad2.length, hid: res.stat.hidAtOpen, revealed: res.stat.aRevealed, first: res.bad2.slice(0, 12) });
      if (vn === 'land800x360' || vn === 'phone360x640') {
        const cs = await p.evaluate(cueSample, all);
        check(ed + ' ' + vn + ': the "more below" cues are shown and readable in every palette at both text sizes (' + Object.keys(cs.seen).length + ' combinations, ' + Object.values(cs.seen).reduce((a, b) => a + b, 0) + ' cues)', !cs.out.length && Object.values(cs.seen).every(n => n === 2), cs);
      }
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
