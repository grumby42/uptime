/* ============================================================
   UPTIME · engine.js
   RNG, sprite cache, screen scaling, input, UI primitives
   (dialogue panel with typewriter, choice lists, modal menus), save codec.
   ============================================================ */
'use strict';

const VW = 320, TS = 16, VH0 = 180;
// The logical screen is 320x180. On a portrait phone the map is as wide as the screen allows at a whole-number
// pixel scale, so the height freed above the controls shows more map rows instead (up to 20 rows, map only).
let VH = VH0;

/* ---------- RNG (mulberry32, seedable for tests) ---------- */
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let rng = makeRng((Date.now() ^ 0x5eed) >>> 0);
function rnd() { return rng(); }
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function weighted(list) { // [{w,...}]
  const tot = list.reduce((s, x) => s + x.w, 0);
  let r = rnd() * tot;
  for (const x of list) { if ((r -= x.w) < 0) return x; }
  return list[list.length - 1];
}
/* Answer order: a deterministic shuffle for lists that have a right answer, so position never gives it
   away. Opt in with {shuffle: true}. Navigation items (Back, Done, decide, ask the AI, or pin: true)
   keep their places. Seeded from the save's seed and the labels, so a list keeps its order on reload,
   and it never touches the game's own random stream. Callers still get the index into their own array.
   The highlight starts on display position 0 (the first enabled item), never on the caller's item 0, so it
   lands on a random answer; pass {cursor: i} (a caller index) to start somewhere on purpose.
   Pure navigation/confirmation menus stay in order; when one marks a preferred item with meta.good (a hint
   for the test bot), it says so with {nav: '<id>'}, an id on the reviewed allowlist in tests/highlight.js, so the
   tests can tell it from a graded list. */
function shuffleOrder(items, o) {
  const perm = items.map((_, i) => i);
  if (!o || !o.shuffle) return perm;
  const pinned = it => it.pin || it.done || (it.meta && (it.meta.back || it.meta.done || it.meta.decide || it.meta.ai));
  const free = perm.filter(i => !pinned(items[i]));
  if (free.length < 2) return perm;
  let h = 2166136261 ^ ((typeof G !== 'undefined' && G && G.seed) >>> 0);
  const key = items.map(it => it.label).join('\u0001');
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  const r = makeRng(h >>> 0), sh = free.slice();
  for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = sh[i]; sh[i] = sh[j]; sh[j] = x; }
  free.forEach((pos, k) => { perm[pos] = sh[k]; });
  return perm; // perm[display position] = caller's index
}
// The first arr.length items of a shuffled list, in the order the player sees them (for card text in the body).
function initialCursor(shown, perm, o) {
  let c = o && o.cursor !== undefined && o.cursor !== null ? Math.max(0, perm.indexOf(o.cursor)) : 0;
  for (let k = 0; k < shown.length && shown[c] && shown[c].disabled; k++) c = (c + 1) % shown.length;
  return c;
}
function shownOrder(arr, items) { return shuffleOrder(items, {shuffle: true}).filter(i => i < arr.length).map(i => arr[i]); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Sprite cache: grid + palette -> offscreen canvas ---------- */
const SPR_CACHE = {};
function sprite(key, palKey, opts) {
  opts = opts || {};
  // Colours come through the active palette (engine/settings.js), so a palette change redraws every sprite.
  const id = key + '|' + palKey + '|' + (opts.variant || '') + '|' + (typeof Settings !== 'undefined' && Settings.v ? Settings.v.palette : '');
  if (SPR_CACHE[id]) return SPR_CACHE[id];
  let grid = S[key];
  if (!grid) throw new Error('no sprite ' + key);
  if (opts.variant === 'tuned') grid = tunedGrid(grid);
  const pal = typeof Settings !== 'undefined' && Settings.v ? Settings.palColours(palKey) : PAL[palKey];
  const c = document.createElement('canvas');
  c.width = 16; c.height = 16;
  const x = c.getContext('2d');
  grid.forEach((row, yy) => {
    for (let xx = 0; xx < 16; xx++) {
      const v = +row[xx];
      if (v) { x.fillStyle = pal[v - 1]; x.fillRect(xx, yy, 1, 1); }
    }
  });
  SPR_CACHE[id] = c;
  return c;
}
// "Tuned" form: adds an antenna and a status light along the top edge (original variation).
function tunedGrid(grid) {
  const g = grid.map(r => r.split(''));
  g[0][7] = '1'; g[0][8] = '1'; g[1][7] = '4'; g[1][8] = '4';
  for (let y = 12; y < 16; y++) { if (g[y][0] === '0') g[y][0] = y % 2 ? '4' : '0'; if (g[y][15] === '0') g[y][15] = y % 2 ? '4' : '0'; }
  return g.map(r => r.join(''));
}

/* ---------- Screen & scaling ---------- */
const Screen = {
  canvas: null, ctx: null, k: 1, s: 1, tallOK: false, tall: false,
  init() {
    this.canvas = document.getElementById('cv');
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', () => this.fit());
    window.addEventListener('orientationchange', () => setTimeout(() => this.fit(), 100));
    this.fit();
  },
  fit() {
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    const touch = document.body.classList.contains('touch');
    const portrait = H > W * 1.05 || W < 560;
    document.body.classList.toggle('portrait', portrait);
    document.body.classList.toggle('landscape', !portrait);
    // Room for the map: below the HUD band; in portrait also above the dialogue panel and the controls at the bottom.
    const hh = id => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().height : 0; };
    let availW, availH;
    // Touch landscape in a battle: the HUD and footer are hidden (CSS), and the choice panel gets its own band below the
    // scene, between the on-screen controls, so it never covers the sprites or the cards.
    const landBattle = !portrait && touch && document.body.classList.contains('inbattle');
    if (portrait) { availW = W; availH = Math.max(90, H - hh('hud') - 150 - hh('pad') - hh('foot')); }
    else if (landBattle) { availW = W - 300; availH = H - 6; }
    else { availW = W - (touch ? 300 : 24); availH = H - 34 - hh('hud'); }
    // largest whole number of device pixels per logical pixel that fits
    const scaleFor = h => {
      let k = Math.floor(Math.min(availW * dpr / VW, h * dpr / VH0));
      if (k < 1) k = 1;
      // keep the CSS scale a whole number where the screen is big enough (desktop: 2x, 3x, 4x...)
      if (dpr <= 1.01 || k / dpr >= 2) { const cssK = Math.max(1, Math.floor(k / dpr)); k = Math.round(cssK * dpr); }
      return k;
    };
    let k = scaleFor(availH);
    // Desktop / keyboard landscape: if the map keeps its scale with a dialogue band below it, put the dialogue there.
    const PANEL_H = 170, LAND_PANEL_H = 150;
    let below = !portrait && !touch && scaleFor(availH - PANEL_H) === k;
    if (landBattle) { k = scaleFor(availH - LAND_PANEL_H); below = true; }
    document.body.classList.toggle('below', below);
    // The band below the map takes the room that is really left (the footer stays on screen), so nothing in it is cut off.
    if (below) document.documentElement.style.setProperty('--panelH', Math.floor(Math.max(120, Math.min(320, (landBattle ? H - 4 : H - hh('hud') - hh('foot') - 10) - VH0 * k / dpr))) + 'px');
    this.k = k; this.s = k / dpr;
    this.tall = portrait && this.tallOK;
    VH = this.tall ? clamp(Math.floor(availH / this.s / TS) * TS, VH0, 20 * TS) : VH0;
    this.canvas.width = VW * k; this.canvas.height = VH * k;
    const wrap = document.getElementById('screen');
    wrap.style.width = (VW * this.s) + 'px'; wrap.style.height = (VH * this.s) + 'px';
    document.documentElement.style.setProperty('--s', this.s);
    document.documentElement.style.setProperty('--fs', Math.max(10, Math.round(4.6 * this.s)) + 'px');
    document.documentElement.style.setProperty('--hudW', (VW * this.s) + 'px');
    const pad = document.getElementById('pad');
    document.documentElement.style.setProperty('--padZone', portrait && pad ? Math.max(0, Math.ceil(H - pad.getBoundingClientRect().top)) + 'px' : '0px');
    if (typeof UI !== 'undefined' && UI.fitModal) UI.fitModal();
    this.ctx.setTransform(k, 0, 0, k, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }
};

/* ---------- Input ---------- */
const BTN_KEYS = {
  ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right',
  z:'a', Z:'a', x:'b', X:'b', Enter:'start', Shift:'select'
};
const Input = {
  held: {}, taps: [], handler: null,
  init() {
    window.addEventListener('keydown', e => {
      const b = BTN_KEYS[e.key];
      if (!b) return;
      if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
      e.preventDefault();
      if (e.repeat && !['up','down','left','right'].includes(b)) return;
      this.down(b, e.repeat);
    });
    window.addEventListener('keyup', e => { const b = BTN_KEYS[e.key]; if (b) this.up(b); });
    window.addEventListener('blur', () => { this.held = {}; });
    document.querySelectorAll('[data-btn]').forEach(el => {
      const b = el.dataset.btn;
      const on = e => { e.preventDefault(); el.classList.add('on'); this.down(b, false); };
      const off = e => { e.preventDefault(); el.classList.remove('on'); this.up(b); };
      el.addEventListener('pointerdown', on);
      el.addEventListener('pointerup', off);
      el.addEventListener('pointercancel', off);
      el.addEventListener('pointerleave', off);
      el.addEventListener('contextmenu', e => e.preventDefault());
    });
  },
  down(b, repeat) {
    const wasHeld = this.held[b];
    this.held[b] = true;
    if (!wasHeld || repeat) this.taps.push(b);
    if (this.handler) this.handler(b, repeat);
  },
  up(b) { this.held[b] = false; }
};

/* ---------- UI: dialogue panel, choices, modal ---------- */
const UI = {
  panel: null, text: null, who: null, opts: null, more: null,
  mode: null,            // 'say' | 'choice' | null
  typing: false, full: '', shown: 0, resolve: null,
  choice: null,          // {items, cursor, cols, resolve, cancel}
  modalEl: null, modal: null, // {items, cursor, resolve, closable}
  turbo: false, openedAt: 0,
  ghost() { return performance.now() - this.openedAt < 350; }, // ignore the click that belongs to the tap which opened this UI
  init() {
    this.panel = document.getElementById('panel');
    this.text = document.getElementById('ptext');
    this.who = document.getElementById('pwho');
    this.opts = document.getElementById('popts');
    this.more = document.getElementById('pmore');
    this.modalEl = document.getElementById('modal');
    this.panel.addEventListener('click', e => {
      if (e.target.closest('[data-i]')) return;
      if (this.mode === 'say' && !this.ghost()) this.handle('a');
    });
  },
  showPanel(on) { this.panel.classList.toggle('show', !!on); },
  say(text, who) {
    return new Promise(res => {
      this.mode = 'say'; this.resolve = res; this.openedAt = performance.now();
      this.full = text; this.shown = 0; this.typing = true;
      this.who.textContent = who || ''; this.who.style.display = who ? '' : 'none';
      this.opts.innerHTML = ''; this.more.style.visibility = 'hidden';
      this.text.textContent = '';
      this.showPanel(true);
      if (this.turbo) { this.shown = this.full.length; }
    });
  },
  tick(dt) {
    if (this.mode === 'say' && this.typing) {
      this.shown = Math.min(this.full.length, this.shown + dt * 0.09);
      this.text.textContent = this.full.slice(0, Math.floor(this.shown));
      if (this.shown >= this.full.length) { this.typing = false; this.more.style.visibility = 'visible'; }
    }
  },
  choose(prompt, items, o) {
    o = o || {};
    const perm = shuffleOrder(items, o);
    const shown = perm.map(i => items[i]);
    return new Promise(res => {
      this.mode = 'choice';
      this.choice = {items: shown, perm, cursor: initialCursor(shown, perm, o), cols: o.cols || 1, resolve: res, cancel: !!o.cancel, opts: o};
      this.openedAt = performance.now();
      this.who.textContent = o.who || ''; this.who.style.display = o.who ? '' : 'none';
      this.text.textContent = prompt || '';
      this.more.style.visibility = 'hidden';
      this.panel.classList.add('choosing');
      this.showPanel(true);
      this.renderChoice();
    });
  },
  renderChoice() {
    const c = this.choice;
    this.opts.style.gridTemplateColumns = 'repeat(' + c.cols + ', minmax(0,1fr))';
    this.opts.classList.toggle('cols2', c.cols > 1);
    this.opts.innerHTML = c.items.map((it, i) =>
      '<button class="opt' + (i === c.cursor ? ' cur' : '') + (it.disabled ? ' dis' : '') + '" data-i="' + i + '">' +
      '<span class="car">▸</span>' + esc(it.label) + (it.note ? '<span class="note">' + esc(it.note) + '</span>' : '') + '</button>').join('');
    this.opts.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      if (this.ghost()) return;
      const i = +b.dataset.i; if (c.items[i].disabled) return;
      c.cursor = i; sfx('select'); this.finishChoice(i);
    }));
    const cur = this.opts.querySelector('.cur'); if (cur && cur.scrollIntoView) cur.scrollIntoView({block: 'nearest'});
  },
  finishChoice(i) {
    const c = this.choice;
    this.choice = null; this.mode = null;
    this.opts.innerHTML = ''; this.panel.classList.remove('choosing');
    c.resolve(i < 0 ? i : c.perm[i]);
  },
  hidePanel() { if (!this.mode) this.showPanel(false); },
  handle(b) {
    if (this.modal) return this.modalHandle(b);
    if (this.mode === 'say') {
      if (b === 'a' || b === 'b') {
        if (this.typing) { this.shown = this.full.length; this.text.textContent = this.full; this.typing = false; this.more.style.visibility = 'visible'; }
        else { const r = this.resolve; this.mode = null; this.resolve = null; r(); }
      }
      return true;
    }
    if (this.mode === 'choice') {
      const c = this.choice, n = c.items.length;
      const move = d => { let i = c.cursor; for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (!c.items[i].disabled) break; } if (i !== c.cursor) sfx('move'); c.cursor = i; this.renderChoice(); };
      if (b === 'up') move(-c.cols); else if (b === 'down') move(c.cols);
      else if (b === 'left') move(-1); else if (b === 'right') move(1);
      else if (b === 'a') { if (!c.items[c.cursor].disabled) { sfx('select'); this.finishChoice(c.cursor); } }
      else if (b === 'b' && c.cancel) { sfx('back'); this.finishChoice(-1); }
      return true;
    }
    return false;
  },
  /* Modal: full-screen readable page with a list of options. */
  openModal(title, bodyHtml, items, o) {
    o = o || {};
    const perm = shuffleOrder(items, o);
    return new Promise(res => {
      const shown = perm.map(i => items[i]);
      this.modal = {items: shown, perm, cursor: initialCursor(shown, perm, o), resolve: res, closable: o.closable !== false, multi: o.multi || 0, sel: new Set(), opts: o};
      this.openedAt = performance.now();
      this.modalEl.innerHTML =
        '<div class="mbox ' + (o.cls || '') + '"><div class="mhead">' + esc(title) + '</div>' +
        '<div class="mbody" id="mbody">' + bodyHtml + '<div class="mmore mmore-t" id="mmoreT" role="button" aria-label="More text below"></div></div>' +
        '<div class="mopts" id="mopts"></div><div class="mmore mmore-o" id="mmoreO" role="button" aria-label="Options below: show them"></div></div>' +
        '<div class="mtoast" id="mtoast" role="status"></div>';
      this.modalEl.classList.add('show');
      this.syncToast();
      this.renderModal();
      // The page opens at its top (title, then the body), whichever layout fitModal chose. If the highlighted option is
      // then out of view (the 'mscroll' page on a small screen), the "more below" cue says so and A, up or down first
      // bring the options into view (maintenance slice 1 review, S1/S2): nothing is ever picked unseen.
      const mb = document.getElementById('mbody'); if (mb) mb.scrollTop = 0;
      const bx = this.modalEl.querySelector('.mbox'); if (bx) bx.scrollTop = 0;
      const ct = document.getElementById('mmoreT'), co = document.getElementById('mmoreO'), sync = () => this.syncMore();
      if (mb) mb.addEventListener('scroll', sync, {passive: true});
      if (bx) bx.addEventListener('scroll', sync, {passive: true});
      if (ct) ct.addEventListener('click', e => { e.stopPropagation(); if (mb) mb.scrollTop += Math.max(40, mb.clientHeight * 0.8); this.syncMore(); });
      if (co) co.addEventListener('click', e => { e.stopPropagation(); this.revealCursor(); });
      // {inView: true}: a page that reopens itself in place after each change (Settings) keeps its highlighted row in view,
      // scrolled no further than needed, so the row just changed never vanishes below the fold.
      if (o.inView) { const cur = document.querySelector('#mopts .cur'); if (cur && cur.scrollIntoView && !this.cursorVisible()) cur.scrollIntoView({block: 'nearest'}); }
      this.syncMore();
    });
  },
  renderModal() {
    const m = this.modal; if (!m) return;
    const box = document.getElementById('mopts');
    box.innerHTML = m.items.map((it, i) =>
      '<button class="opt' + (i === m.cursor ? ' cur' : '') + (it.disabled ? ' dis' : '') + (m.sel.has(i) ? ' sel' : '') + '" data-i="' + i + '">' +
      '<span class="car">▸</span>' + (m.multi && !it.done ? '<span class="chk">' + (m.sel.has(i) ? '■' : '□') + '</span>' : '') + esc(it.label) +
      (it.note ? '<span class="note">' + esc(it.note) + '</span>' : '') + '</button>').join('');
    box.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
      if (this.ghost()) return;
      const i = +b.dataset.i; if (m.items[i].disabled) return;
      m.cursor = i; sfx(m.items[i].meta && m.items[i].meta.back ? 'back' : 'select'); this.modalActivate(i);
    }));
    this.fitModal();
    const cur = box.querySelector('.cur'); if (cur && cur.scrollIntoView) cur.scrollIntoView({block: 'nearest'});
    this.syncMore();
  },
  // Maintenance slice 1: an answer option is never clipped, however long the clues or findings above it are.
  // 'mkeep': the options keep their whole height (they never scroll), and the body scrolls in what is left, which must be
  //          at least 30% of the modal area (or the whole body), so a long body keeps its share (slice-1 review, B6) and a
  //          lone Back button is never squeezed.
  // 'mscroll': when the options and that much body can't both fit (long options on a landscape phone), the whole box
  //          scrolls as one page: body first, then every option in full. Nothing scrolls inside a pane of its own.
  // The modal area is what the overlay leaves: above the pad on a portrait phone, between the controls on a landscape
  // one, less the toast lane while a toast shows.
  // A toast lane that shows while a modal is open counts for the rest of that modal (modal.laneRes), so a toast that comes
  // or goes mid-modal never switches the layout under the reader (review N4; see syncToast).
  laneHeight() { const lane = document.getElementById('mtoast'); return lane && lane.classList.contains('show') ? lane.offsetHeight + (parseFloat(getComputedStyle(lane).marginTop) || 0) : 0; },
  keepFor(laneH) {  // true: 'mkeep' fits; false: 'mscroll'; null: no room measured
    const mo = document.getElementById('mopts'), mb = document.getElementById('mbody'); if (!mo || !mb || !this.modalEl) return null;
    const box = mo.parentElement; if (!box) return null;
    mo.style.minHeight = ''; mb.style.minHeight = '';  // (scrollHeight below is the content's height in either layout)
    const cs = getComputedStyle(this.modalEl);
    const avail = this.modalEl.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - laneH;
    if (!(avail > 0)) return null;
    const bs = getComputedStyle(box), head = box.querySelector('.mhead');
    const inner = avail - (parseFloat(bs.borderTopWidth) || 0) - (parseFloat(bs.borderBottomWidth) || 0) - (head ? head.offsetHeight : 0);
    const optsH = mo.scrollHeight, bodyH = mb.scrollHeight, floor = Math.min(bodyH, Math.ceil(avail * 0.3) + 2);  // + 2: rounding, so the body never falls a hair under 30%
    return optsH + floor <= inner;
  },
  fitModal() {
    const mo = document.getElementById('mopts'); if (!mo || !mo.parentElement) return;
    const box = mo.parentElement, m = this.modal;
    let laneH = this.laneHeight(); if (m) { m.laneRes = Math.max(m.laneRes || 0, laneH); laneH = m.laneRes; }
    const keep = this.keepFor(laneH);
    if (keep === null) { box.classList.remove('mkeep', 'mscroll'); return; }
    box.classList.toggle('mkeep', keep); box.classList.toggle('mscroll', !keep);  // toggled, not reset, so a scrolled page keeps its place
    this.syncMore();
  },
  /* "More below" cues (review S2). 'mscroll': a strip pinned to the box's bottom edge, "▼ options below", while any option
     lies below what the box shows (tap it, or press A / up / down, to bring the options into view). 'mkeep': a strip at the
     bottom of the body, "▼ more below", while the body's text goes on below. The words are CSS content, so a page's text is
     unchanged; colours are the page's own tokens (every palette), sizes follow large text. */
  syncMore() {
    const mo = document.getElementById('mopts'), mb = document.getElementById('mbody'), ct = document.getElementById('mmoreT'), co = document.getElementById('mmoreO');
    if (!mo || !mb || !ct || !co) return;
    const box = mo.parentElement, scroll = box.classList.contains('mscroll');
    ct.classList.toggle('on', !scroll && box.classList.contains('mkeep') && mb.scrollHeight - mb.scrollTop - mb.clientHeight > 2);
    let below = false;
    if (scroll) {
      const opts = mo.querySelectorAll('.opt'), last = opts.length ? opts[opts.length - 1] : mb;
      const B = box.getBoundingClientRect(), bottom = Math.min(B.top + box.clientTop + box.clientHeight, innerHeight);
      below = last.getBoundingClientRect().bottom > bottom - co.offsetHeight + 0.5;
      co.classList.toggle('txt', !opts.length);
    }
    co.classList.toggle('on', below);
  },
  // Is the highlighted option whole on screen (inside the box, above the "options below" strip, inside the window)?
  cursorVisible() {
    const m = this.modal, mo = document.getElementById('mopts'); if (!m || !mo) return true;
    const el = mo.querySelector('[data-i="' + m.cursor + '"]'); if (!el) return true;
    this.syncMore();
    const box = mo.parentElement, B = box.getBoundingClientRect(), r = el.getBoundingClientRect(), co = document.getElementById('mmoreO');
    let top = Math.max(B.top + box.clientTop, 0), bottom = Math.min(B.top + box.clientTop + box.clientHeight, innerHeight);
    if (co && co.classList.contains('on') && co.offsetHeight) bottom = Math.min(bottom, co.getBoundingClientRect().top);
    return r.height > 0 && r.top >= top - 0.5 && r.bottom <= bottom + 0.5;
  },
  // Bring the options into view with the highlight whole: the whole option list if it fits (the end of the page), else the
  // list from its first option, moved on just enough to show the highlight.
  revealCursor() {
    const m = this.modal, mo = document.getElementById('mopts'); if (!m || !mo) return;
    if (!mo.querySelector('.opt.cur[data-i="' + m.cursor + '"]')) this.renderModal();
    const el = mo.querySelector('[data-i="' + m.cursor + '"]'), box = mo.parentElement; if (!el) return;
    if (box.classList.contains('mscroll')) {
      const B = box.getBoundingClientRect(), y0 = B.top + box.clientTop - box.scrollTop, co = document.getElementById('mmoreO');
      const moTop = mo.getBoundingClientRect().top - y0, r = el.getBoundingClientRect(), curTop = r.top - y0, curBot = r.bottom - y0;
      const maxS = box.scrollHeight - box.clientHeight, view = box.clientHeight - (co ? co.offsetHeight : 0);
      let t = maxS <= moTop ? maxS : moTop;
      if (curBot - t > view) t = curBot - view;
      if (curTop < t) t = curTop;
      box.scrollTop = Math.max(0, Math.min(maxS, t));
    } else if (el.scrollIntoView) el.scrollIntoView({block: 'nearest'});
    this.syncMore();
  },
  // The element that scrolls the page's text: the whole box in 'mscroll', otherwise the body.
  scroller() { const mb = document.getElementById('mbody'), box = mb && mb.parentElement; return box && box.classList.contains('mscroll') ? box : mb; },
  /* Toasts (unlocks, badges, notices). On the map they show in #toast, inside the screen. While a modal is open they
     show in the modal's toast lane (#mtoast) below its box, which fitModal leaves room for, so a toast never covers modal
     text, options, the HUD or the controls. One at a time; a new one replaces the old, as before. */
  toastMsg: '', toastLeft: 0, toastHeld: false,
  toast(msg, ms) { this.toastMsg = String(msg); this.toastLeft = ms || 2600; this.toastHeld = false; this.syncToast(); },
  toastTick(dt) { if (this.toastLeft > 0 && !this.toastHeld) { this.toastLeft -= dt; if (this.toastLeft <= 0) { this.toastLeft = 0; this.syncToast(); } } },
  syncToast() {
    const el = document.getElementById('toast'), lane = document.getElementById('mtoast');
    const inModal = !!(lane && this.modalEl && this.modalEl.classList.contains('show'));
    if (!inModal) this.toastHeld = false;
    const on = this.toastLeft > 0 && !!this.toastMsg && !this.toastHeld;
    if (el) { if (on) el.textContent = this.toastMsg; el.classList.toggle('show', on && !inModal); }
    if (lane) {
      const was = lane.classList.contains('show');
      lane.textContent = on ? this.toastMsg : ''; lane.classList.toggle('show', on && inModal);
      // Mid-modal (the layout already chosen): a toast that would leave the options without their whole height in 'mkeep'
      // waits, its time paused, until the modal closes, and then shows on the map (review N4). A lane that hides keeps its
      // space for the rest of the modal (fitModal), so nothing switches when a toast fades either.
      const box = lane.previousElementSibling;
      if (on && inModal && box && box.classList.contains('mkeep') && this.keepFor(Math.max(this.laneHeight(), (this.modal && this.modal.laneRes) || 0)) === false) {
        lane.classList.remove('show'); lane.textContent = ''; this.toastHeld = true;
        if (el) el.classList.remove('show');
      }
      if (was !== lane.classList.contains('show') || on) this.fitModal();
    }
  },
  modalActivate(i) {
    const m = this.modal;
    if (m.multi && !m.items[i].done) {
      if (m.sel.has(i)) m.sel.delete(i); else if (m.sel.size < m.multi) m.sel.add(i);
      this.renderModal(); return;
    }
    if (m.multi && m.items[i].done && m.sel.size !== m.multi) return;
    this.closeModal(m.multi ? [...m.sel] : i);
  },
  closeModal(v) {
    const m = this.modal; this.modal = null;
    this.modalEl.classList.remove('show'); this.modalEl.innerHTML = '';
    this.syncToast();
    // {lr, i}: left/right on a settings-style row (opts.lr); i is already the caller's index
    if (m) m.resolve(Array.isArray(v) ? v.map(i => m.perm[i]) : v && typeof v === 'object' ? v : v < 0 ? v : m.perm[v]);
  },
  modalHandle(b) {
    const m = this.modal, n = m.items.length;
    const mb = this.scroller();
    const move = d => { let i = m.cursor; for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (!m.items[i].disabled) break; } if (i !== m.cursor) sfx('move'); m.cursor = i; this.renderModal(); };
    const it = m.items[m.cursor];
    // Never act on an option the player can't see (review S1): while the highlight is out of view, A, up and down (and
    // left/right on a settings row) first bring the options into view, highlight unchanged; the next press acts.
    const acts = b === 'a' || ((b === 'up' || b === 'down') && n > 1) || ((b === 'left' || b === 'right') && m.opts.lr && it && it.meta && it.meta.lr);
    if (acts && n && !this.cursorVisible()) { sfx('move'); this.revealCursor(); return true; }
    // Settings-style rows: left/right change the value (the caller reopens the page with the new value).
    if ((b === 'left' || b === 'right') && m.opts.lr && it && it.meta && it.meta.lr) { sfx('move'); this.closeModal({lr: true, d: b === 'left' ? -1 : 1, i: m.perm[m.cursor]}); return true; }
    if (b === 'up') { if (n <= 1 && mb) mb.scrollTop -= 60; else move(-1); }
    else if (b === 'down') { if (n <= 1 && mb) mb.scrollTop += 60; else move(1); }
    else if (b === 'left' && mb) mb.scrollTop -= 120;
    else if (b === 'right' && mb) mb.scrollTop += 120;
    else if (b === 'a') { if (!m.items[m.cursor].disabled) { sfx(it.meta && it.meta.back ? 'back' : 'select'); this.modalActivate(m.cursor); } }
    else if ((b === 'b' || b === 'start') && m.closable) { sfx('back'); this.closeModal(-1); }
    return true;
  }
};

/* ---------- Save codec ---------- */
const SAVE_KEY = 'uptime.slice1.save';
function checksum(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }
function encodeSave(obj) {
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return 'UPT1.' + b64 + '.' + checksum(json);
}
function decodeSave(code) {
  code = String(code || '').trim().replace(/\s+/g, '');
  const parts = code.split('.');
  if (parts.length !== 3 || parts[0] !== 'UPT1') throw new Error('Not an Uptime save code.');
  const json = decodeURIComponent(escape(atob(parts[1])));
  if (checksum(json) !== parts[2]) throw new Error('Save code is damaged (checksum mismatch).');
  return JSON.parse(json);
}
// Each edition keeps its own save (EDITION.saveKey; Town Hall's is SAVE_KEY), so one edition never writes another's.
function saveKey() { return (typeof EDITION !== 'undefined' && EDITION.saveKey) || SAVE_KEY; }
function storeGet() { try { return localStorage.getItem(saveKey()); } catch (e) { return null; } }
function storeSet(v) { try { localStorage.setItem(saveKey(), v); return true; } catch (e) { return false; } }
function storeDel() { try { localStorage.removeItem(saveKey()); } catch (e) {} }
