/* ============================================================
   UPTIME · engine.js
   RNG, sprite cache, screen scaling, input, UI primitives
   (dialogue panel with typewriter, choice lists, modal menus), save codec.
   ============================================================ */
'use strict';

const VW = 320, VH = 180, TS = 16;

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
   and it never touches the game's own random stream. Callers still get the index into their own array. */
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
function shownOrder(arr, items) { return shuffleOrder(items, {shuffle: true}).filter(i => i < arr.length).map(i => arr[i]); }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Sprite cache: grid + palette -> offscreen canvas ---------- */
const SPR_CACHE = {};
function sprite(key, palKey, opts) {
  opts = opts || {};
  const id = key + '|' + palKey + '|' + (opts.variant || '');
  if (SPR_CACHE[id]) return SPR_CACHE[id];
  let grid = S[key];
  if (!grid) throw new Error('no sprite ' + key);
  if (opts.variant === 'back') grid = grid.map((r, y) => (y >= 3 && y <= 7) ? r.replace(/[34]/g, '2') : r);
  if (opts.variant === 'step') grid = grid.slice(0, 13).concat(['0000122112210000', '0000122011110000', '0000111000000000']);
  if (opts.variant === 'tuned') grid = tunedGrid(grid);
  const pal = PAL[palKey];
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
  canvas: null, ctx: null, k: 1, s: 1,
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
    let availW, availH;
    if (portrait) { availW = W; availH = Math.max(180, H * 0.42); }
    else { availW = W - (touch ? 300 : 24); availH = H - 34; }
    // largest whole number of device pixels per logical pixel that fits
    let k = Math.floor(Math.min(availW * dpr / VW, availH * dpr / VH));
    if (k < 1) k = 1;
    // keep the CSS scale a whole number where the screen is big enough (desktop: 2x, 3x, 4x...)
    if (dpr <= 1.01 || k / dpr >= 2) { const cssK = Math.max(1, Math.floor(k / dpr)); k = Math.round(cssK * dpr); }
    this.k = k; this.s = k / dpr;
    this.canvas.width = VW * k; this.canvas.height = VH * k;
    const wrap = document.getElementById('screen');
    wrap.style.width = (VW * this.s) + 'px'; wrap.style.height = (VH * this.s) + 'px';
    document.documentElement.style.setProperty('--s', this.s);
    document.documentElement.style.setProperty('--fs', Math.max(10, Math.round(4.6 * this.s)) + 'px');
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
      this.choice = {items: shown, perm, cursor: Math.max(0, perm.indexOf(o.cursor || 0)), cols: o.cols || 1, resolve: res, cancel: !!o.cancel};
      this.openedAt = performance.now();
      while (this.choice.items[this.choice.cursor] && this.choice.items[this.choice.cursor].disabled && this.choice.cursor < shown.length - 1) this.choice.cursor++;
      this.who.textContent = o.who || ''; this.who.style.display = o.who ? '' : 'none';
      this.text.textContent = prompt || '';
      this.more.style.visibility = 'hidden';
      this.showPanel(true);
      this.renderChoice();
    });
  },
  renderChoice() {
    const c = this.choice;
    this.opts.style.gridTemplateColumns = 'repeat(' + c.cols + ', minmax(0,1fr))';
    this.opts.innerHTML = c.items.map((it, i) =>
      '<button class="opt' + (i === c.cursor ? ' cur' : '') + (it.disabled ? ' dis' : '') + '" data-i="' + i + '">' +
      '<span class="car">▸</span>' + esc(it.label) + (it.note ? '<span class="note">' + esc(it.note) + '</span>' : '') + '</button>').join('');
    this.opts.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      if (this.ghost()) return;
      const i = +b.dataset.i; if (c.items[i].disabled) return;
      c.cursor = i; this.finishChoice(i);
    }));
  },
  finishChoice(i) {
    const c = this.choice;
    this.choice = null; this.mode = null;
    this.opts.innerHTML = '';
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
      const move = d => { let i = c.cursor; for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (!c.items[i].disabled) break; } c.cursor = i; this.renderChoice(); };
      if (b === 'up') move(-c.cols); else if (b === 'down') move(c.cols);
      else if (b === 'left') move(-1); else if (b === 'right') move(1);
      else if (b === 'a') { if (!c.items[c.cursor].disabled) this.finishChoice(c.cursor); }
      else if (b === 'b' && c.cancel) this.finishChoice(-1);
      return true;
    }
    return false;
  },
  /* Modal: full-screen readable page with a list of options. */
  openModal(title, bodyHtml, items, o) {
    o = o || {};
    const perm = shuffleOrder(items, o);
    return new Promise(res => {
      this.modal = {items: perm.map(i => items[i]), perm, cursor: Math.max(0, perm.indexOf(o.cursor || 0)), resolve: res, closable: o.closable !== false, multi: o.multi || 0, sel: new Set()};
      this.openedAt = performance.now();
      this.modalEl.innerHTML =
        '<div class="mbox ' + (o.cls || '') + '"><div class="mhead">' + esc(title) + '</div>' +
        '<div class="mbody" id="mbody">' + bodyHtml + '</div>' +
        '<div class="mopts" id="mopts"></div></div>';
      this.modalEl.classList.add('show');
      this.renderModal();
      const mb = document.getElementById('mbody'); if (mb) mb.scrollTop = 0;
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
      m.cursor = i; this.modalActivate(i);
    }));
    const cur = box.querySelector('.cur'); if (cur && cur.scrollIntoView) cur.scrollIntoView({block: 'nearest'});
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
    if (m) m.resolve(Array.isArray(v) ? v.map(i => m.perm[i]) : v < 0 ? v : m.perm[v]);
  },
  modalHandle(b) {
    const m = this.modal, n = m.items.length;
    const mb = document.getElementById('mbody');
    const move = d => { let i = m.cursor; for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (!m.items[i].disabled) break; } m.cursor = i; this.renderModal(); };
    if (b === 'up') { if (n <= 1 && mb) mb.scrollTop -= 60; else move(-1); }
    else if (b === 'down') { if (n <= 1 && mb) mb.scrollTop += 60; else move(1); }
    else if (b === 'left' && mb) mb.scrollTop -= 120;
    else if (b === 'right' && mb) mb.scrollTop += 120;
    else if (b === 'a') { if (!m.items[m.cursor].disabled) this.modalActivate(m.cursor); }
    else if ((b === 'b' || b === 'start') && m.closable) this.closeModal(-1);
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
function storeGet() { try { return localStorage.getItem(SAVE_KEY); } catch (e) { return null; } }
function storeSet(v) { try { localStorage.setItem(SAVE_KEY, v); return true; } catch (e) { return false; } }
function storeDel() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
