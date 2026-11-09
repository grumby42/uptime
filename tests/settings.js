// Settings: colour palettes, sound sets, volume / mute / alerts only, reduced flashing, text size.
//  - persistence: changed through the real Settings page (keyboard), kept across a reload in 'uptime.settings',
//    separate from the game save; storage that throws still gives working settings (in memory) and no errors
//  - palettes: each applied to canvas pixels (the player sprite, sampled) and to the CSS tokens and real elements
//  - contrast: WCAG 2.x contrast ratio >= 4.5:1 for every UI text / background pair in every palette (and Classic in
//    a dark system scheme)
//  - colour vision: every equipment state pair (each badged palette key against its unfixed key, built from PAL and
//    stateBadge, plus lit/isolated screens; at least 12) stays apart (CIELAB dE76 >= 20, at the pair's best-separated
//    colour index among those that differ) under normal vision and simulated protanopia, deuteranopia and tritanopia
//    (Machado, Oliveira & Fernandes 2009, severity 1.0) in the Colour-blind safe palette; Classic is shown to fail,
//    so the check bites
//  - no colour-only cue: every fixed / isolated / lit-because-fixed tile state has a badge shape (drawn and sampled;
//    Front Desk logging and patched laptops included), lit vs dark screens also differ in brightness in every palette,
//    the door marker keeps its outline
//  - battle bars: label and number; Dwell hatched, Evidence solid; Amber and Green fills >= 3:1 against the card
//    (WCAG 1.4.11) and Evidence vs Dwell apart in brightness
//  - sound: off by default (volume 60, muted) for new players and once for v1 settings, with a one-time toast;
//    stubbed Web Audio; nothing before a user gesture; each event fires from real play; mute, volume 0 and alerts
//    only filter; Settings previews play in alerts only; every set synthesises every event; no AudioContext never throws
//  - reduced flashing: no shake, no blink, no fade, title field still; on by default with prefers-reduced-motion
//  - text size: large applies to modals; zero console errors and zero network requests throughout
// Usage: node settings.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = []; const check = (name, ok, info) => { results.push({ name, ok: !!ok, info: ok ? undefined : info }); if (process.env.VERBOSE) console.error((ok ? 'ok   ' : 'FAIL ') + name); };

/* ---- colour science (test side, independent of the page) ---- */
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const relLum = h => { const [r, g, b] = hexRgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
// Machado, Oliveira & Fernandes (2009), severity 1.0, applied to linear RGB
const CVD = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]};
const lab = l => {
  const [r, g, b] = l, f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
};
const sim = (h, t) => { const l = hexRgb(h).map(lin); return t ? CVD[t].map(r => Math.min(1, Math.max(0, r[0] * l[0] + r[1] * l[1] + r[2] * l[2]))) : l; };
const dE = (a, b, t) => { const A = lab(sim(a, t)), B = lab(sim(b, t)); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };

async function open(ctxOpts, init, stored) {
  if (process.env.VERBOSE) console.error('open', JSON.stringify(ctxOpts));
  const b = await chromium.launch();
  const c = await b.newContext(ctxOpts || { viewport: { width: 1280, height: 800 } });
  if (init) await c.addInitScript(init);

  const p = await c.newPage(); const errs = [], reqs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) reqs.push(r.url()); });
  await p.goto(FILE); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
  // stored: settings already in the browser when the page loads (written once, then the page is reloaded)
  if (stored) { await p.evaluate(v => { try { localStorage.setItem('uptime.settings', v); } catch (e) {} }, JSON.stringify(stored)); await p.reload(); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui); }
  return { b, c, p, errs, reqs };
}
const key = async (p, k, n) => { for (let i = 0; i < (n || 1); i++) { await p.keyboard.press(k); await sleep(40); } };
const modalLabels = p => p.evaluate(() => UI.modal ? UI.modal.items.map(o => o.label) : null);
async function gotoTitleItem(p, re) {
  const labels = await modalLabels(p); const want = labels.findIndex(l => re.test(l));
  const cur = await p.evaluate(() => UI.modal.cursor);
  await key(p, want > cur ? 'ArrowDown' : 'ArrowUp', Math.abs(want - cur));
}
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
async function newGame(p) {
  await p.evaluate(() => { __UPTIME.seed(5); __UPTIME.turbo(true); });
  await sleep(400);
  await p.evaluate(() => { const i = UI.modal.items.findIndex(o => /New game/.test(o.label)); UI.modal.cursor = i; UI.handle('a'); });
  await freeOnMap(p);
}
// Fake Web Audio: records what the synth builds.
const FAKE_AUDIO = () => {
  window.__audio = { made: 0, osc: 0, noise: 0, filters: 0, started: 0 };
  const node = () => ({ connect() {}, disconnect() {}, gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } });
  class FakeAC {
    constructor() { window.__audio.made++; this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; }
    resume() { return Promise.resolve(); }
    createGain() { return node(); }
    createBiquadFilter() { window.__audio.filters++; return Object.assign(node(), { type: '', frequency: { value: 0 } }); }
    createOscillator() { window.__audio.osc++; return Object.assign(node(), { type: '', frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, detune: { value: 0 }, start() { window.__audio.started++; }, stop() {} }); }
    createBuffer(ch, len) { const d = new Float32Array(len); return { getChannelData: () => d }; }
    createBufferSource() { window.__audio.noise++; return Object.assign(node(), { buffer: null, start() { window.__audio.started++; }, stop() {} }); }
  }
  window.AudioContext = FakeAC; window.webkitAudioContext = FakeAC;
};

(async () => {
  /* ---------- 1. Defaults, persistence through the real page, reload ---------- */
  {
    const { b, p, errs, reqs } = await open(null, FAKE_AUDIO);
    const d = await p.evaluate(() => __UPTIME.settings());
    check('defaults: Classic, Soft, volume 60 but sound muted, all sounds, reduced flashing off without prefers-reduced-motion, normal text',
      d.palette === 'classic' && d.sound === 'soft' && d.volume === 60 && d.mute && !d.alertsOnly && !d.reduceFlash && d.textSize === 'normal', d);
    const tip = await p.evaluate(() => { const t = document.getElementById('toast'); return { text: t.textContent, show: t.classList.contains('show'), z: +getComputedStyle(t).zIndex, mz: +getComputedStyle(document.getElementById('modal')).zIndex, tipSaved: JSON.parse(localStorage.getItem('uptime.settings') || '{}').soundTip }; });
    check('first start: a toast says "Sound is off. Turn it on in Settings." above the title menu, and it is remembered in uptime.settings',
      tip.text === 'Sound is off. Turn it on in Settings.' && tip.show && tip.z > tip.mz && tip.tipSaved === true, tip);
    await key(p, 'ArrowDown'); await key(p, 'ArrowUp');
    const mv = await p.evaluate(() => Sound.trace.filter(t => t.ev === 'move').map(t => t.out));
    check('sound off by default: menu moves after the first gesture are muted', mv.length >= 1 && mv.every(o => o === 'muted'), mv);
    const titleHas = (await modalLabels(p)).includes('Settings');
    check('the title screen lists Settings', titleHas, await modalLabels(p));
    await gotoTitleItem(p, /^Settings$/); await key(p, 'z'); await sleep(100);
    const head = await p.evaluate(() => document.querySelector('.mhead').textContent);
    const rows = await modalLabels(p);
    check('Settings opens from the title screen with the keyboard (A)', head === 'Settings' && rows.some(l => /^Colours:/.test(l)), { head, rows });
    // Colours: right twice -> High contrast -> Colour-blind safe; live: the page itself changes at once
    await key(p, 'ArrowRight');
    const live = await p.evaluate(() => ({ pal: document.documentElement.dataset.palette, paper: getComputedStyle(document.querySelector('.mbox')).backgroundColor, prev: !!document.getElementById('setprev') }));
    check('left/right on Colours changes the palette live (page repainted, preview canvas present)', live.pal === 'contrast' && live.paper === 'rgb(0, 0, 0)' && live.prev, live);
    await key(p, 'ArrowRight');
    // Volume: down 2 rows, left 3 times (60 -> 30)
    await key(p, 'ArrowDown', 2); await key(p, 'ArrowLeft', 3);
    // Which sounds: down 2, A toggles to alerts only; Text size: down 3 (Test sound, Reduced flashing, Text size), A
    await key(p, 'ArrowDown', 2); await key(p, 'z');
    await key(p, 'ArrowDown', 3); await key(p, 'z');
    // Reduced flashing: up 1, right toggles
    await key(p, 'ArrowUp'); await key(p, 'ArrowRight');
    const after = await p.evaluate(() => __UPTIME.settings());
    const cursorRow = await p.evaluate(() => UI.modal.items[UI.modal.cursor].label);
    check('D-pad/keyboard navigation changes each value and keeps the cursor on the row',
      after.palette === 'cbsafe' && after.volume === 30 && after.alertsOnly && after.textSize === 'large' && after.reduceFlash && /^Reduced flashing: on/.test(cursorRow), { after, cursorRow });
    await key(p, 'x'); await sleep(80);
    const back = await modalLabels(p);
    check('B leaves Settings back to the title screen', back && back.includes('New game'), back);
    const stored = await p.evaluate(() => ({ s: localStorage.getItem('uptime.settings'), save: localStorage.getItem('uptime.slice1.save') }));
    check('settings are stored in their own key (uptime.settings), not in the game save', stored.s && JSON.parse(stored.s).palette === 'cbsafe' && !stored.save, stored);
    await p.reload(); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
    const tip2 = await p.evaluate(() => ({ text: document.getElementById('toast').textContent, show: document.getElementById('toast').classList.contains('show') }));
    check('the sound-off toast shows once: not again after a reload', !tip2.show && tip2.text === '', tip2);
    const re = await p.evaluate(() => ({ v: __UPTIME.settings(), pal: document.documentElement.dataset.palette, tok: getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(), calm: document.body.classList.contains('calm'), big: document.body.classList.contains('bigtext') }));
    check('persistence across reload: palette, volume, alerts only, reduced flashing and text size come back and are applied',
      re.v.palette === 'cbsafe' && re.v.volume === 30 && re.v.alertsOnly && re.v.reduceFlash && re.v.textSize === 'large' && re.pal === 'cbsafe' && re.tok === '#f7f6f2' && re.calm && re.big, re);
    // Start menu has Settings too, and settings survive a New game
    await newGame(p);
    await p.evaluate(() => { run(startMenu); }); await sleep(80);
    const menu = await modalLabels(p);
    await p.evaluate(() => { const i = UI.modal.items.findIndex(o => o.label === 'Settings'); UI.modal.cursor = i; UI.handle('a'); }); await sleep(60);
    const inSet = await p.evaluate(() => document.querySelector('.mhead').textContent);
    await key(p, 'x'); await sleep(60); await key(p, 'x'); await sleep(60);
    check('the Start menu lists Settings and opens the same page; New game keeps settings', menu.includes('Settings') && inSet === 'Settings' && (await p.evaluate(() => Settings.v.palette)) === 'cbsafe', { menu, inSet });
    const big = await p.evaluate(() => { const i = UI.openModal('T', '<p>x</p>', [{ label: 'OK' }]); const fs = getComputedStyle(document.querySelector('.mbody')).fontSize; const ofs = getComputedStyle(document.querySelector('.mopts .opt')).fontSize; UI.closeModal(-1); return { fs, ofs }; });
    check('large text: modal body and options at 18px', big.fs === '18px' && big.ofs === '18px', big);
    check('run 1: no console errors or network requests', !errs.length && !reqs.length, { errs, reqs });
    await b.close();
  }

  /* ---------- 2. Storage unavailable ---------- */
  {
    const { b, p, errs, reqs } = await open(null, () => {
      Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage disabled'); }, configurable: true });
    });
    const r = await p.evaluate(async () => {
      const ok0 = Settings.storageOk;
      Settings.set({ palette: 'amber', volume: 80 });
      const pr = settingsMenu(); await new Promise(r => setTimeout(r, 50));
      const note = document.querySelector('.mbody').textContent;
      UI.handle('b'); await pr;
      return { ok0, ok1: Settings.storageOk, pal: document.documentElement.dataset.palette, ink: getComputedStyle(document.documentElement).getPropertyValue('--paper-ink').trim(), v: Settings.v.volume, note };
    });
    check('storage unavailable: settings still work in memory, the page says they are not kept, no errors',
      r.ok0 === false && r.ok1 === false && r.pal === 'amber' && r.ink === '#ffcf70' && r.v === 80 && /blocked storage/.test(r.note) && !errs.length && !reqs.length, { r, errs, reqs });
    await b.close();
  }

  /* ---------- 2b. Settings saved by v1 (sound was on): muted once, everything else kept; corrupt values ---------- */
  {
    const { b, p, errs } = await open(null, null, { v: 1, palette: 'amber', sound: 'chip', volume: 80, mute: false, alertsOnly: false, reduceFlash: false, textSize: 'normal' });
    const v1 = await p.evaluate(() => ({ v: __UPTIME.settings(), toast: document.getElementById('toast').textContent }));
    await p.evaluate(() => Settings.set({ mute: false }));
    await p.reload(); await p.waitForFunction(() => window.__UPTIME && __UPTIME.peek().ui);
    const v1b = await p.evaluate(() => __UPTIME.settings());
    check('v1 settings: sound is muted once (volume, palette and set kept, toast shown); turning it back on sticks after a reload',
      v1.v.mute === true && v1.v.v === 2 && v1.v.volume === 80 && v1.v.palette === 'amber' && v1.v.sound === 'chip' && /Sound is off/.test(v1.toast) && v1b.mute === false && v1b.volume === 80, { v1, v1b });
    const bad = await p.evaluate(() => ['{"volume":"abc"}', '"str"', '[1,2]', '42', 'null'].map(raw => { localStorage.setItem('uptime.settings', raw); const v = Settings.load(); return { raw, vol: v.volume, keys: Object.keys(v).filter(k => /^\d+$/.test(k)).length, pal: v.palette }; }));
    check('corrupt stored settings: a non-number volume falls back to 60; a stored string, array, number or null gives the defaults', bad.every(x => x.vol === 60 && x.keys === 0 && x.pal === 'classic'), bad);
    check('run 2b: no console errors', !errs.length, errs);
    await b.close();
  }

  /* ---------- 3. Palettes: canvas pixels, CSS, contrast, colour vision, no colour-only cue ---------- */
  const contrast = {}, cvd = {}, info = {};
  {
    const { b, p, errs, reqs } = await open();
    await newGame(p);
    await p.evaluate(() => __UPTIME.turbo(false));
    const ids = await p.evaluate(() => PALETTES.map(x => x.id));
    info.palettes = await p.evaluate(() => PALETTES.map(x => ({ id: x.id, name: x.name, css: x.css || null })));
    const pairsText = [['paper-ink', 'paper'], ['muted', 'paper'], ['accent', 'paper'], ['warn', 'paper'], ['paper-ink', 'cur'], ['muted', 'cur'],
      ['box-ink', 'box'], ['box-muted', 'box'], ['box-accent', 'box'], ['box-ink', 'box-cur'], ['box-muted', 'box-cur'],
      ['hud-ink', 'hud-bg'], ['gold', 'hud-bg'], ['foot', 'bg'], ['toast-ink', 'toast']];
    const canvasBad = [], cssBad = [], contrastBad = [], lumBad = [], markerBad = [];
    let firstPlayer = null;
    for (const id of ids) {
      await p.evaluate(id => Settings.set({ palette: id }), id);
      await p.evaluate(() => __UPTIME.drawn()); await sleep(120);
      // canvas: sample the player's sprite pixel by pixel against the palette's colours
      const px = await p.evaluate(() => {
        const me = __UPTIME.drawn().find(e => e.id === 'me'); const grid = S[me.key], pal = Settings.palColours('player'), k = Screen.k;
        const img = Screen.ctx.getImageData(0, 0, Screen.canvas.width, Screen.canvas.height);
        let ok = 0, bad = 0; const seen = new Set();
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
          const v = +grid[y][x]; if (!v) continue;
          const i = ((me.y + y) * k + Math.floor(k / 2)) * img.width * 4 + ((me.x + x) * k + Math.floor(k / 2)) * 4;
          const got = '#' + [0, 1, 2].map(c => img.data[i + c].toString(16).padStart(2, '0')).join('');
          if (got === pal[v - 1].toLowerCase()) { ok++; seen.add(got); } else bad++;
        }
        return { ok, bad, seen: [...seen].sort().join(',') };
      });
      if (px.bad || px.ok < 40) canvasBad.push({ id, px });
      if (id === 'classic') firstPlayer = px.seen; else if (px.seen === firstPlayer) canvasBad.push({ id, why: 'same pixels as Classic' });
      // CSS: tokens and real elements
      const css = await p.evaluate(() => {
        const st = getComputedStyle(document.documentElement), t = {};
        for (const k of UI_TOKENS) t[k] = st.getPropertyValue('--' + k).trim().toLowerCase();
        const pr = UI.openModal('Test', '<h3>Head</h3><p class="small">small</p>', [{ label: 'A', note: 'n' }, { label: 'B' }]);
        const rgb = e => getComputedStyle(e).color, bg = e => getComputedStyle(e).backgroundColor;
        const el = { box: bg(document.querySelector('.mbox')), body: rgb(document.querySelector('.mbody')), h3: rgb(document.querySelector('.mbody h3')), cur: bg(document.querySelector('.mopts .opt.cur')), hud: rgb(document.getElementById('hud')), hudBg: bg(document.getElementById('hud')), panel: bg(document.getElementById('panel')) };
        UI.closeModal(-1);
        return { t, el, p: Settings.pal().css };
      });
      const hx = h => 'rgb(' + hexRgb(h).join(', ') + ')';
      const T = css.t;
      if (css.p) { for (const k in css.p) if (T[k] !== css.p[k]) cssBad.push({ id, token: k, got: T[k], want: css.p[k] }); }
      if (css.el.box !== hx(T.paper) || css.el.body !== hx(T['paper-ink']) || css.el.h3 !== hx(T.accent) || css.el.cur !== hx(T.cur) || css.el.hud !== hx(T['hud-ink']) || css.el.hudBg !== hx(T['hud-bg']) || css.el.panel !== hx(T.box)) cssBad.push({ id, el: css.el, T });
      contrast[id] = pairsText.map(([f, g]) => ({ pair: f + ' on ' + g, fg: T[f], bg: T[g], r: +ratio(T[f], T[g]).toFixed(2) }));
      for (const c of contrast[id]) if (c.r < 4.5) contrastBad.push({ id, c });
      // palette colours used for status pairs and the door marker
      const st = await p.evaluate(() => ({
        pc: [Settings.palColours('pcOff')[3], Settings.palColours('pcOn')[3], Settings.palColours('pcOnOk')[3]],
        lit: [Settings.palColours('B')[3], Settings.palColours('L')[3]],
        marker: [Settings.col('#1b2233'), Settings.col('#ffd96a')],
        badge: [Settings.col('#1b2233'), Settings.col('#ffffff')],
        // every badged state key against the key it replaces (pcIso / pcOnOk replace a dark PC, wafOn the bare WAF box),
        // plus the two lit screens against an isolated one; each pair at every colour index where the two keys differ
        pairs: (() => {
          const BASE_OF = { pcIso: 'pcOff', pcOnOk: 'pcOff', wafOn: 'wafBox' };
          const base = k => BASE_OF[k] || (PAL[k.replace(/Ok$/, '')] ? k.replace(/Ok$/, '') : k.replace(/Ok$/, '') + 'Bad');
          const list = Object.keys(PAL).filter(k => stateBadge(k)).map(k => [base(k), k]).concat([['pcOn', 'pcIso'], ['pcOnOk', 'pcIso']]);
          return list.map(([a, b2]) => ({ name: a + '/' + b2, missing: !PAL[a],
            idx: PAL[a] ? [0, 1, 2, 3].filter(i => PAL[a][i].toLowerCase() !== PAL[b2][i].toLowerCase()).map(i => ({ i, a: Settings.palColours(a)[i], b: Settings.palColours(b2)[i] })) : [] }));
        })(),
        extra: [{ name: 'Evidence/Dwell bars', a: Settings.barCol('ev'), b: Settings.barCol('dwell') },
          { name: 'UI accent/warn', a: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), b: getComputedStyle(document.documentElement).getPropertyValue('--warn').trim() }]
      }));
      if (ratio(st.pc[0], st.pc[1]) < 3) lumBad.push({ id, what: 'PC screen off/on', r: ratio(st.pc[0], st.pc[1]) });
      if (ratio(st.pc[0], st.pc[2]) < 3) lumBad.push({ id, what: 'PC screen off/on (fixed)', r: ratio(st.pc[0], st.pc[2]) });
      if (ratio(st.lit[0], st.lit[1]) < 1.5) lumBad.push({ id, what: 'building window dark/lit', r: ratio(st.lit[0], st.lit[1]) });
      if (ratio(st.marker[0], st.marker[1]) < 3) markerBad.push({ id, r: ratio(st.marker[0], st.marker[1]) });
      if (ratio(st.badge[0], st.badge[1]) < 4.5) markerBad.push({ id, badge: ratio(st.badge[0], st.badge[1]) });
      const score = x => ({ a: x.a, b: x.b, normal: +dE(x.a, x.b).toFixed(1), protan: +dE(x.a, x.b, 'protan').toFixed(1), deutan: +dE(x.a, x.b, 'deutan').toFixed(1), tritan: +dE(x.a, x.b, 'tritan').toFixed(1) });
      const worst = r => Math.min(r.normal, r.protan, r.deutan, r.tritan);
      cvd[id] = st.pairs.map(x => {
        if (x.missing || !x.idx.length) return { name: x.name, missing: true, normal: 0, protan: 0, deutan: 0, tritan: 0 };
        const best = x.idx.map(c => Object.assign({ i: c.i }, score(c))).sort((m, n) => worst(n) - worst(m))[0];
        return Object.assign({ name: x.name + '[' + best.i + ']' }, best);
      }).concat(st.extra.map(x => Object.assign({ name: x.name }, score(x))));
      info.pairCount = st.pairs.length;
    }
    check('every palette is applied to canvas pixels (player sprite sampled exactly; each differs from Classic)', !canvasBad.length, canvasBad);
    check('every palette is applied to the CSS tokens and to real elements (modal page, heading, cursor row, HUD, dialogue panel)', !cssBad.length, cssBad);
    check('WCAG 2.x contrast >= 4.5:1 for every UI text/background pair in every palette (' + pairsText.length + ' pairs x ' + ids.length + ')', !contrastBad.length, contrastBad);
    const cbBad = cvd.cbsafe.filter(x => x.missing || Math.min(x.normal, x.protan, x.deutan, x.tritan) < 20);
    check('Colour-blind safe: all ' + info.pairCount + ' equipment state pairs (from PAL + stateBadge) and the bar and accent pairs have dE >= 20 under normal vision, protanopia, deuteranopia and tritanopia', info.pairCount >= 12 && !cbBad.length, cbBad);
    const classicWeak = cvd.classic.filter(x => Math.min(x.protan, x.deutan, x.tritan) < 20).map(x => x.name);
    check('the colour-vision check bites: Classic has pairs that collapse under simulated colour blindness (why the badges exist)', classicWeak.length > 0, cvd.classic);
    info.classicWeak = classicWeak;
    check('lit vs dark screens and windows also differ in brightness in every palette (PC >= 3:1, windows >= 1.5:1 plus a different sprite)', !lumBad.length, lumBad);
    check('the door marker outline and the state badges keep their contrast in every palette (>= 3:1, badge >= 4.5:1)', !markerBad.length, markerBad);

    // No colour-only cue: every palette swap that an edition's tile hook makes for a fixed/isolated state draws a shape.
    const swaps = await p.evaluate(() => {
      const fns = Object.getOwnPropertyNames(window).filter(n => /^(editionTile|[a-z]{2}Tile)$/.test(n) && typeof window[n] === 'function');
      const out = [];
      for (const n of fns) { const re = /d\.pal\s*=\s*([^;]+);/g; let m; const src = window[n].toString(); while ((m = re.exec(src))) for (const k of m[1].match(/'(\w+)'/g) || []) out.push({ fn: n, pal: k.slice(1, -1), spr: /d\.spr\s*=/.test(src.slice(Math.max(0, m.index - 40), m.index)), badge: stateBadge(k.slice(1, -1)) }); }
      return out;
    });
    // allowed without a badge: only the dark/off state itself, and buildings that change sprite. A screen lit because the
    // player fixed something (Front Desk logging, a patched laptop) must use pcOnOk, which carries the tick.
    const noCue = swaps.filter(s => !s.badge && !s.spr && s.pal !== 'pcOff');
    const litFixed = swaps.filter(s => s.pal === 'pcOnOk').map(s => s.fn);
    check('no colour-only cue: every fixed / isolated / lit-because-fixed tile state an edition switches to carries a badge (' + swaps.length + ' swaps checked; lit PCs in ' + litFixed.join(', ') + ')',
      swaps.length >= 10 && !noCue.length && litFixed.includes('editionTile') && litFixed.includes('crTile'), { noCue, swaps });
    const desk = await p.evaluate(() => {
      const keep = { logs: G.f.logs, pcs: Object.assign({}, G.pcs) };
      const at = []; MAPS.desk.rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === 'p') at.push([x, y]); }));
      const read = () => at.map(([x, y]) => stateBadge(tileDef('desk', x, y).pal));
      for (const k in G.pcs) delete G.pcs[k]; G.f.logs = false; const off = read();
      G.pcs[at[0][0]] = true; const one = read();
      G.f.logs = true; const on = read();
      G.f.logs = keep.logs; for (const k in G.pcs) delete G.pcs[k]; Object.assign(G.pcs, keep.pcs);
      return { n: at.length, off, one, on };
    });
    check('Front Desk: a PC with logging on carries the tick badge, one without does not',
      desk.n >= 3 && desk.off.every(x => !x) && desk.one[0] === 'ok' && desk.one.slice(1).every(x => !x) && desk.on.every(x => x === 'ok'), desk);
    // Rendered: the kiosk before and after the fix, sampled at the badge's fill pixel
    const kiosk = await p.evaluate(async () => {
      const rows = MAPS.desk.rows; let kx = -1, ky = -1; rows.forEach((r, y) => { const x = r.indexOf('k'); if (x >= 0) { kx = x; ky = y; } });
      const keep = { map: G.map, x: G.x, y: G.y, k: G.f.kiosk };
      G.map = 'desk'; G.x = kx; G.y = ky + 1;
      const sample = async () => { await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); const cam = camera(), k = Screen.k; const sx = kx * 16 - cam.cx + 15 - 6 + 5, sy = ky * 16 - cam.cy + 1 + 0; const d = Screen.ctx.getImageData(Math.round((sx + 0.5) * k), Math.round((sy + 0.5) * k), 1, 1).data; return '#' + [0, 1, 2].map(i => d[i].toString(16).padStart(2, '0')).join(''); };
      G.f.kiosk = false; const before = await sample();
      G.f.kiosk = true; const after = await sample();
      Object.assign(G, { map: keep.map, x: keep.x, y: keep.y }); G.f.kiosk = keep.k;
      return { before, after, white: Settings.col('#ffffff') };
    });
    check('rendered: the fixed kiosk shows the tick badge (sampled), the unfixed one does not', kiosk.after === kiosk.white && kiosk.before !== kiosk.white, kiosk);
    // Battle bars carry label and number; verdict feedback is written out
    const bars = await p.evaluate(async () => {
      Settings.set({ palette: 'amber' });
      const pr = doBattle(Object.assign(genAlert('fp'), { ev0: 40, dwell0: 40 })); await new Promise(r => setTimeout(r, 80));
      const out = [...document.querySelectorAll('#bcard .bar, #btool .bar')].map(e => ({ l: e.querySelector('.bl').textContent, n: e.querySelector('.bn').textContent }));
      const fills = {};
      for (const id of PALETTES.map(x => x.id)) {
        Settings.set({ palette: id }); await new Promise(r => setTimeout(r, 30));
        const rgbHex2 = c => '#' + c.match(/\d+/g).slice(0, 3).map(v => (+v).toString(16).padStart(2, '0')).join('');
        const one = sel => { const e = document.querySelector(sel); const st = getComputedStyle(e); return { fill: rgbHex2(st.backgroundColor), hatch: /repeating-linear-gradient/.test(st.backgroundImage), w: e.getBoundingClientRect().width }; };
        const bi = [...document.querySelectorAll('#bcard .bar .bi')], ti = document.querySelector('#btool .bar .bi');
        bi[0].id = 'tEv'; bi[1].id = 'tDw'; ti.id = 'tFo';
        fills[id] = { card: rgbHex2(getComputedStyle(document.getElementById('bcard')).backgroundColor), tool: rgbHex2(getComputedStyle(document.getElementById('btool')).backgroundColor), ev: one('#tEv'), dwell: one('#tDw'), focus: one('#tFo') };
      }
      Settings.set({ palette: 'classic' });
      return { out, pr: !!pr, fills };
    });
    check('battle bars carry their label and a number (Evidence, Dwell, Focus), not colour alone', bars.out.length === 3 && bars.out.every(x => x.l && /\d/.test(x.n)), bars.out);
    info.bars = {};
    for (const id in bars.fills) { const f = bars.fills[id]; info.bars[id] = { ev: f.ev.fill + ' ' + ratio(f.ev.fill, f.card).toFixed(2), dwell: f.dwell.fill + ' ' + ratio(f.dwell.fill, f.card).toFixed(2), focus: f.focus.fill + ' ' + ratio(f.focus.fill, f.tool).toFixed(2), evVsDwell: +ratio(f.ev.fill, f.dwell.fill).toFixed(2) }; }
    const hatchBad = Object.keys(bars.fills).filter(id => { const f = bars.fills[id]; return !f.dwell.hatch || f.ev.hatch || f.focus.hatch || !(f.ev.w > 0 && f.dwell.w > 0); });
    check('Dwell is hatched and Evidence solid in every palette, so the two fills never look alike', !hatchBad.length, { hatchBad, fills: bars.fills });
    const termBad = ['amber', 'green'].filter(id => { const f = bars.fills[id]; return ratio(f.ev.fill, f.card) < 3 || ratio(f.dwell.fill, f.card) < 3 || ratio(f.focus.fill, f.tool) < 3 || ratio(f.ev.fill, f.dwell.fill) < 1.5; });
    check('Amber and Green: Evidence, Dwell and Focus fills >= 3:1 against their card (WCAG 1.4.11), Evidence vs Dwell >= 1.5:1 in brightness', !termBad.length, info.bars);
    check('run 3: no console errors or network requests', !errs.length && !reqs.length, { errs, reqs });
    await b.close();
  }

  /* ---------- 4. Classic in a dark system scheme ---------- */
  {
    const { b, p, errs } = await open({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
    const t = await p.evaluate(() => { const st = getComputedStyle(document.documentElement), o = {}; for (const k of UI_TOKENS) o[k] = st.getPropertyValue('--' + k).trim().toLowerCase(); return o; });
    const pairs = [['paper-ink', 'paper'], ['muted', 'paper'], ['accent', 'paper'], ['warn', 'paper'], ['paper-ink', 'cur'], ['muted', 'cur'], ['box-accent', 'box']];
    contrast['classic (dark scheme)'] = pairs.map(([f, g]) => ({ pair: f + ' on ' + g, fg: t[f], bg: t[g], r: +ratio(t[f], t[g]).toFixed(2) }));
    const bad = contrast['classic (dark scheme)'].filter(c => c.r < 4.5);
    check('Classic in a dark system scheme: modal text pairs >= 4.5:1 (headings and warnings re-tinted for dark)', !bad.length && !errs.length, { bad, errs });
    await b.close();
  }

  /* ---------- 5. Sound ---------- */
  const soundInfo = {};
  const SOUND_ON = { v: 2, mute: false, soundTip: true };  // a player who turned sound on
  {
    const { b, p, errs, reqs } = await open(null, FAKE_AUDIO, SOUND_ON);
    const pre = await p.evaluate(() => { const r = Sound.play('select'); return { r, made: __audio.made, out: Sound.trace[Sound.trace.length - 1].out }; });
    check('autoplay policy: before any user gesture nothing is created or played', pre.r === false && pre.made === 0 && pre.out === 'locked', pre);
    await key(p, 'ArrowDown'); // first gesture: unlocks, and is a menu move
    const g1 = await p.evaluate(() => ({ made: __audio.made, last: Sound.trace.slice(-1)[0] }));
    check('the first key press unlocks audio (one context) and the menu move plays', g1.made === 1 && g1.last.ev === 'move' && g1.last.out === 'played', g1);
    await key(p, 'ArrowUp');
    // select + back through the real UI: open Settings (select), B (back)
    await gotoTitleItem(p, /^Settings$/); await p.evaluate(() => { Sound.trace.length = 0; }); await key(p, 'z'); await sleep(60); await key(p, 'x'); await sleep(60);
    const sb = await p.evaluate(() => Sound.trace.map(t => t.ev + ':' + t.out));
    check('select and back play from the real menus', sb.includes('select:played') && sb.includes('back:played'), sb);
    // game events: battle start, alert arrives (queue grows), correct / wrong verdicts, badge
    await newGame(p);
    const ev = await p.evaluate(async () => {
      const tick = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const seen = []; const orig = Sound.play.bind(Sound);
      Sound.play = (e, s) => { const r = orig(e, s); seen.push(e + ':' + Sound.trace[Sound.trace.length - 1].out + (UI.mode === 'say' ? '' : '')); return r; };
      const sayLog = []; const os = UI.say.bind(UI); UI.say = (t, w) => { sayLog.push({ t, last: seen[seen.length - 1] }); return os(t, w); };
      await tick(); G.queue = Math.min(8, G.queue) + 1; await tick();
      const verdict = async (kind, pick) => {
        const pr = doBattle(Object.assign(genAlert(kind), { rate: 1 }));
        for (let i = 0; i < 200 && (!UI.choice || !/Verdict/.test(UI.text.textContent)); i++) {
          if (UI.mode === 'say') UI.handle('a');
          else if (UI.choice) { const j = UI.choice.items.findIndex(o => o.meta && o.meta.kind === 'close'); UI.choice.cursor = j; UI.handle('a'); }
          await new Promise(r => setTimeout(r, 5));
        }
        const vi = UI.choice.items.findIndex(o => o.meta && o.meta.verdict === pick); UI.choice.cursor = vi; UI.handle('a'); await new Promise(r => setTimeout(r, 5));
        const ri = UI.choice.items.findIndex(o => o.meta && o.meta.good); UI.choice.cursor = ri < 0 ? 0 : ri; UI.handle('a');
        for (let i = 0; i < 400; i++) { await new Promise(r => setTimeout(r, 5)); if (UI.mode === 'say') UI.handle('a'); else if (UI.choice) { UI.choice.cursor = 0; UI.handle('a'); } else if (UI.modal) UI.handle('a'); if (!B && !UI.mode && !UI.modal) break; }
        await pr;
      };
      await verdict('fp', 'fp');
      await verdict('benign', 'mal');
      await tick(); G.f.mrSeal = true; await tick();
      Sound.play = orig; UI.say = os;
      const fb = sayLog.filter(s => /^(Correct\.|Rae reviewed it)/.test(s.t)).map(s => s.t.split(':')[0].slice(0, 20) + ' <- ' + s.last);
      return { seen, fb };
    });
    soundInfo.events = ev.seen;
    const has = e => ev.seen.includes(e + ':played');
    check('battle start, alert arrives, correct, wrong and badge each play from real game events', has('battle') && has('alert') && has('correct') && has('wrong') && has('badge'), ev.seen);
    check('feedback is never sound-only: the correct / wrong sound comes with written feedback (Correct. / Rae reviewed it)', ev.fb.length === 2 && /Correct.*correct:played/.test(ev.fb[0]) && /Rae reviewed.*wrong:played/.test(ev.fb[1]), ev.fb);
    // modes
    const modes = await p.evaluate(() => {
      const run = patch => { Settings.set(patch); Sound.trace.length = 0; Sound.last = {}; for (const e of SOUND_EVENTS) Sound.play(e); return Object.fromEntries(Sound.trace.map(t => [t.ev, t.out])); };
      const out = { all: run({ mute: false, alertsOnly: false, volume: 60 }), alertsOnly: run({ alertsOnly: true }), mute: run({ alertsOnly: false, mute: true }), vol0: run({ mute: false, volume: 0 }) };
      Settings.set({ volume: 60, mute: false, alertsOnly: false });
      return out;
    });
    const evs = Object.keys(modes.all);
    check('all sounds: every event plays (' + evs.join(', ') + ')', evs.length === 8 && evs.every(e => modes.all[e] === 'played'), modes.all);
    check('alerts only: alert and battle start play; menu, verdict and badge sounds are filtered', modes.alertsOnly.alert === 'played' && modes.alertsOnly.battle === 'played' && ['move', 'select', 'back', 'correct', 'wrong', 'badge'].every(e => modes.alertsOnly[e] === 'filtered'), modes.alertsOnly);
    check('mute and volume 0 silence every event', evs.every(e => modes.mute[e] === 'muted' && modes.vol0[e] === 'muted'), { mute: modes.mute, vol0: modes.vol0 });
    const prev = await p.evaluate(() => {
      const last = () => { const t = Sound.trace[Sound.trace.length - 1]; return t.ev + ':' + t.out; };
      Settings.set({ alertsOnly: true, mute: false, volume: 60 }); Sound.last = {};
      settingsChange('sound', 1); const set = last(); settingsChange('sound', -1);
      settingsChange('volume', 1); const vol = last();
      Settings.set({ mute: true }); settingsChange('volume', -1); const muted = last();
      Settings.set({ mute: false, volume: 0 }); settingsChange('sound', 1); const zero = last(); settingsChange('sound', -1);
      Settings.set({ volume: 60, mute: false, alertsOnly: false });
      return { set, vol, muted, zero };
    });
    check('alerts only: changing the sound set or the volume in Settings still plays its preview; mute and volume 0 still silence it',
      prev.set === 'correct:played' && prev.vol === 'select:played' && prev.muted === 'select:muted' && prev.zero === 'correct:muted', prev);
    const sets = await p.evaluate(() => {
      const out = {};
      for (const s in SOUND_SETS) { out[s] = {}; for (const e of SOUND_EVENTS) { const a = __audio.osc + __audio.noise; Sound.last = {}; const ok = Sound.play(e, s); out[s][e] = ok ? __audio.osc + __audio.noise - a : -1; } }
      return out;
    });
    soundInfo.sets = sets;
    const setBad = []; for (const s in sets) for (const e in sets[s]) if (!(sets[s][e] > 0)) setBad.push(s + '/' + e);
    check('every sound set synthesises every event with Web Audio nodes (' + Object.keys(sets).length + ' sets x 8 events)', Object.keys(sets).length >= 4 && !setBad.length, setBad);
    const vol = await p.evaluate(() => { Settings.set({ volume: 100 }); const a = Sound.master.gain.value; Settings.set({ volume: 30 }); const c = Sound.master.gain.value; Settings.set({ volume: 35 }); const d = Settings.v.volume; Settings.set({ volume: 60 }); return { a, c, d }; });
    check('volume: 0 to 100 in steps of 10 drives the master gain', vol.a > vol.c && vol.c > 0 && vol.d % 10 === 0, vol);
    check('run 5: no console errors or network requests', !errs.length && !reqs.length, { errs, reqs });
    await b.close();
  }
  {
    // No Web Audio at all
    const { b, p, errs, reqs } = await open(null, () => { delete window.AudioContext; delete window.webkitAudioContext; window.AudioContext = undefined; window.webkitAudioContext = undefined; }, SOUND_ON);
    await key(p, 'ArrowDown');
    const r = await p.evaluate(() => { const out = SOUND_EVENTS.map(e => Sound.play(e)); const pr = settingsMenu(); const i = UI.modal.items.findIndex(o => o.meta.k === 'test'); UI.modal.cursor = i; UI.handle('a'); UI.handle('b'); return { out, last: Sound.trace.slice(-1)[0], ctx: Sound.ctx }; });
    await sleep(1100);
    check('AudioContext unavailable: no exception, events report noaudio, Test sound is harmless', r.out.every(x => x === false) && r.last.out === 'noaudio' && r.ctx === null && !errs.length && !reqs.length, { r, errs });
    await b.close();
  }
  {
    // Real Web Audio in Chromium: a gesture, then every set's every event
    const { b, p, errs, reqs } = await open(null, null, SOUND_ON);
    await key(p, 'ArrowDown');
    await p.evaluate(() => { for (const s in SOUND_SETS) for (const e of SOUND_EVENTS) { Sound.last = {}; Sound.play(e, s); } });
    await sleep(800);
    check('real Web Audio (Chromium): every set and event runs with no console errors', !errs.length && !reqs.length && (await p.evaluate(() => !!Sound.ctx)), { errs, reqs });
    await b.close();
  }

  /* ---------- 6. Reduced flashing ---------- */
  {
    const { b, p, errs } = await open({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const d = await p.evaluate(() => __UPTIME.settings());
    check('prefers-reduced-motion: reduced flashing is on by default', d.reduceFlash === true, d);
    const title = await p.evaluate(() => {
      const shot = t => { const c = document.createElement('canvas'); c.width = 336; c.height = 192; const x = c.getContext('2d'); drawTitleBg(x, t); return c.toDataURL(); };
      const calm = shot(0) === shot(600) && shot(0) === shot(5000);
      Settings.set({ reduceFlash: false }); const moves = shot(0) !== shot(600); Settings.set({ reduceFlash: true });
      return { calm, moves };
    });
    check('reduced flashing: the title screen field stands still (and scrolls when off)', title.calm && title.moves, title);
    const sys = await p.evaluate(() => { const keep = localStorage.getItem('uptime.settings'); localStorage.setItem('uptime.settings', JSON.stringify({ v: 2, palette: 'green', soundTip: true, reduceFlash: false })); const a = Settings.load().reduceFlash;
      localStorage.setItem('uptime.settings', JSON.stringify({ v: 2, palette: 'green', soundTip: true, reduceFlash: false, reduceFlashUser: true })); const b2 = Settings.load().reduceFlash;
      localStorage.setItem('uptime.settings', keep); Settings.load(); return { a, b2 }; });
    check('reduced flashing follows the system setting until the player changes it in Settings', sys.a === true && sys.b2 === false, sys);
    await newGame(p); await p.evaluate(() => __UPTIME.turbo(false));
    const r = await p.evaluate(async () => {
      const pmore = getComputedStyle(document.getElementById('pmore')).animationName;
      const t0 = performance.now(); await warp(G.map, G.x, G.y, G.dir); const warpMs = performance.now() - t0;
      const pr = doBattle(genAlert('fp')); await new Promise(r => setTimeout(r, 30));
      if (UI.mode === 'say') UI.handle('a'); if (UI.mode === 'say') UI.handle('a');
      await new Promise(r => setTimeout(r, 30));
      const ab = UI.choice.items.findIndex(o => o.meta && o.meta.kind === 'ability' && !o.disabled);
      UI.choice.cursor = ab; UI.handle('a'); await new Promise(r => setTimeout(r, 20));
      const sh = shake;
      Settings.set({ reduceFlash: false });
      const pmoreOn = getComputedStyle(document.getElementById('pmore')).animationName;
      const t1 = performance.now(); await warp(G.map, G.x, G.y, G.dir); const warpOn = performance.now() - t1;
      return { pmore, warpMs, sh, pmoreOn, warpOn };
    });
    check('reduced flashing: no shake on actions, no blinking prompt, no fade between rooms (and they come back when off)',
      r.pmore === 'none' && r.sh <= 0 && r.warpMs < 60 && r.pmoreOn === 'blink' && r.warpOn > 200, r);
    check('run 6: no console errors', !errs.length, errs);
    await b.close();
  }

  // ---- Crossroads (edition 2) shares the settings: one key, the palette swap, the tick on fixed equipment ----
  {
    const b = await chromium.launch(); const c = await b.newContext(); const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    p.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
    await p.goto(FILE); await p.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
    await p.evaluate(() => Settings.set({ palette: 'contrast', textSize: 'large' }));
    await p.goto('file://' + require('path').resolve(__dirname, '../editions/crossroads/index.html')); await p.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
    const r = await p.evaluate(() => ({ pal: Settings.v.palette, text: Settings.v.textSize, swapped: JSON.stringify(Settings.palColours('lbPubOk')) !== JSON.stringify(PAL.lbPubOk),
      ticks: ['lbPubOk', 'lbCircOk', 'closetOk', 'sdFilesOk', 'sdSisOk', 'cnDeskOk', 'cnRackOk', 'cnCartOk', 'dpRackOk', 'dpLinkOk', 'dpCardsOk'].every(k => stateBadge(k) === 'ok'), plain: ['lbPub', 'lbCirc', 'closetBad', 'sdFiles', 'sdSis', 'cnDesk', 'cnRack', 'cnCart', 'cnExam', 'dpRack', 'dpLink', 'dpCards', 'dpConsole', 'dpRadio', 'dpSup'].every(k => !stateBadge(k)), sdSwap: JSON.stringify(Settings.palColours('sdSisOk')) !== JSON.stringify(PAL.sdSisOk) && JSON.stringify(Settings.palColours('cnCartOk')) !== JSON.stringify(PAL.cnCartOk) && JSON.stringify(Settings.palColours('dpLinkOk')) !== JSON.stringify(PAL.dpLinkOk), key: EDITION.saveKey }));
    check('Crossroads reads the shared settings (palette, text size), swaps its own palettes (the School District’s, the Clinic’s and Dispatch’s too), and ticks its fixed equipment (not colour alone)', r.pal === 'contrast' && r.text === 'large' && r.swapped && r.sdSwap && r.ticks && r.plain && r.key === 'uptime.crossroads.save', r);
    await p.evaluate(() => Settings.set({ palette: 'classic', textSize: 'normal' }));
    check('Crossroads settings run: no console errors or requests', !errs.length, errs);
    await b.close();
  }

  const failed = results.filter(x => !x.ok);
  console.log(JSON.stringify({ suite: 'settings', passed: results.length - failed.length, failed: failed.length, results: results.map(x => x.ok ? { name: x.name, ok: true } : x), contrast, cvd, bars: info.bars, sound: soundInfo, classicWeak: info.classicWeak }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('SETTINGS FAILED:', e.stack || e.message); process.exit(2); });
