/* ============================================================
   UPTIME · engine/settings.js
   Player settings shared by every edition (own key 'uptime.settings', separate from any save):
   colour palettes, sound sets (Web Audio, generated, no files), volume / mute / alerts only,
   reduced flashing and text size. Also the "state badge" glyphs that make fixed / isolated
   equipment readable without colour, and the Settings menu (Start menu and title screen).
   ============================================================ */
'use strict';

const SETTINGS_KEY = 'uptime.settings';

/* ---------- Colour helpers ---------- */
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
function rgbHsl(c) {
  const [r, g, b] = c.map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hslRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}
// WCAG 2.x relative luminance and contrast ratio (W3C WCAG 2.2, "relative luminance"; see CREDITS.md)
function relLum(hex) {
  const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const [r, g, b] = hexRgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a, b) { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
// Monochrome ramp: the colour's lightness picks a point along the stops (dark to light).
function rampMap(stops) {
  const S = stops.map(hexRgb);
  return hex => {
    const t = Math.pow(relLum(hex), 1 / 2.2) * (S.length - 1), i = Math.min(S.length - 2, Math.floor(t)), u = t - i;
    return rgbHex(S[i].map((v, k) => v + (S[i + 1][k] - v) * u));
  };
}
const hueIn = (h, a, b) => a <= b ? h >= a && h < b : h >= a || h < b;

/* ---------- Palettes ----------
   A palette is a whole-game swap applied at render time: `map` turns every colour the game draws (the 4-colour tile,
   sprite and character palettes, the battle scene, the door marker, the battle bars) into this palette's colour,
   `ok` (optional) recolours equipment in a fixed state, and `css` sets the UI tokens in style.css. Classic changes
   nothing. Meaning never rests on colour alone: fixed equipment carries a tick, isolated laptops a box (stateBadge),
   bars carry their label and number, and verdicts are written out. */
const UI_TOKENS = ['bg', 'ink', 'paper', 'paper-ink', 'muted', 'cur', 'accent', 'warn', 'gold', 'hud-bg', 'hud-ink',
  'box', 'box-ink', 'box-muted', 'box-cur', 'box-accent', 'line', 'foot', 'toast', 'toast-ink'];
const PALETTES = [
  {id: 'classic', name: 'Classic', note: 'The original colours (menus follow your system light or dark setting).'},
  {id: 'contrast', name: 'High contrast', note: 'Darks darker, lights lighter, stronger colour; black menus with white text.',
    map: hex => { const [h, s, l] = rgbHsl(hexRgb(hex)); return rgbHex(hslRgb(h, Math.min(1, s * 1.3), clamp(0.5 + (l - 0.5) * 1.5, 0.02, 0.98))); },
    css: {bg: '#000000', ink: '#ffffff', paper: '#000000', 'paper-ink': '#ffffff', muted: '#d6d6d6', cur: '#1d3f80', accent: '#ffe14d',
      warn: '#ff9a8a', gold: '#ffe14d', 'hud-bg': '#000000', 'hud-ink': '#ffffff', box: '#000000', 'box-ink': '#ffffff', 'box-muted': '#d6d6d6',
      'box-cur': '#1d3f80', 'box-accent': '#ffe14d', line: '#ffffff', foot: '#d6d6d6', toast: '#000000', 'toast-ink': '#ffffff'}},
  // Colour-blind safe: reds and pinks move to orange / vermilion and greens to bluish green, after the Okabe & Ito
  // colour-universal-design set; equipment in a fixed state turns blue. Orange against blue stays apart under
  // protanopia, deuteranopia and tritanopia (simulated in tests/settings.js).
  {id: 'cbsafe', name: 'Colour-blind safe', note: 'Red becomes orange, green becomes blue-green, fixed equipment turns blue.',
    map: hex => {
      const [h, s, l] = rgbHsl(hexRgb(hex)); if (s < 0.22 || l < 0.12 || l > 0.94) return hex;
      if (hueIn(h, 325, 45)) return rgbHex(hslRgb(h > 300 ? 18 : 18 + (h / 45) * 20, Math.max(s, 0.75), l));
      if (hueIn(h, 70, 175)) return rgbHex(hslRgb(166, s, l));
      return hex;
    },
    // Fixed = a saturated mid blue, never lighter than L 0.5, so it stays apart from the (light) bluish greens under
    // tritanopia too, and a lit screen stays >= 3:1 against a dark one (tests/settings.js checks every badged pair).
    ok: hex => { const [, s, l] = rgbHsl(hexRgb(hex)); return s < 0.22 || l < 0.12 ? hex : rgbHex(hslRgb(210, 1, Math.min(0.5, 0.2 + 0.8 * l))); },
    bars: {focus: '#1f8a70'},
    css: {bg: '#10141f', ink: '#e9edf5', paper: '#f7f6f2', 'paper-ink': '#1b2233', muted: '#4a5163', cur: '#d6e9f8', accent: '#005f96',
      warn: '#a34400', gold: '#ffd96a', 'hud-bg': '#161b29', 'hud-ink': '#ffffff', box: '#ffffff', 'box-ink': '#1b2233', 'box-muted': '#4a5163',
      'box-cur': '#d6e9f8', 'box-accent': '#005f96', line: '#1b2233', foot: '#8b93a7', toast: '#1b2233', 'toast-ink': '#ffffff'}},
  {id: 'amber', name: 'Amber terminal', note: 'One amber phosphor, five shades. Status reads from the tick and box (and mostly brightness).',
    map: rampMap(['#120a00', '#4d2c00', '#a35f00', '#e89a1c', '#ffd88a']),
    bars: {ev: '#ffb000', dwell: '#b86500'},
    css: {bg: '#0a0600', ink: '#ffcf70', paper: '#140b00', 'paper-ink': '#ffcf70', muted: '#d9a441', cur: '#4a2e00', accent: '#ffb000',
      warn: '#ff9a52', gold: '#ffd88a', 'hud-bg': '#140b00', 'hud-ink': '#ffcf70', box: '#140b00', 'box-ink': '#ffcf70', 'box-muted': '#d9a441',
      'box-cur': '#4a2e00', 'box-accent': '#ffb000', line: '#c98a1c', foot: '#d9a441', toast: '#140b00', 'toast-ink': '#ffcf70'}},
  {id: 'green', name: 'Green terminal', note: 'One green phosphor, five shades. Status reads from the tick and box (and mostly brightness).',
    map: rampMap(['#010d04', '#0b3d17', '#1b7a32', '#3fcf5f', '#c2ffcf']),
    bars: {ev: '#9dffb0', dwell: '#2a9a45'},
    css: {bg: '#010a03', ink: '#9dffb0', paper: '#03120a', 'paper-ink': '#9dffb0', muted: '#5fd47a', cur: '#0d4a1f', accent: '#c2ffcf',
      warn: '#ffe28a', gold: '#c2ffcf', 'hud-bg': '#03120a', 'hud-ink': '#9dffb0', box: '#03120a', 'box-ink': '#9dffb0', 'box-muted': '#5fd47a',
      'box-cur': '#0d4a1f', 'box-accent': '#c2ffcf', line: '#2fa84a', foot: '#5fd47a', toast: '#03120a', 'toast-ink': '#9dffb0'}},
  {id: 'light', name: 'Light', note: 'A daylight map and light menus and bands.',
    map: hex => rgbHex(hexRgb(hex).map(v => v + (255 - v) * 0.22)),
    bars: {focus: '#4a9a3d'},
    css: {bg: '#e9e6dc', ink: '#1b2233', paper: '#fdfcf8', 'paper-ink': '#1b2233', muted: '#4a5163', cur: '#dfeccb', accent: '#2f6e3e',
      warn: '#a8361f', gold: '#6b4a00', 'hud-bg': '#f4f1e8', 'hud-ink': '#1b2233', box: '#ffffff', 'box-ink': '#1b2233', 'box-muted': '#4a5163',
      'box-cur': '#dfeccb', 'box-accent': '#2f6e3e', line: '#1b2233', foot: '#4a5163', toast: '#1b2233', 'toast-ink': '#ffffff'}}
];

// Battle bar fills: the game's colours through the palette unless the palette sets its own (`bars`), chosen so each fill
// is >= 3:1 against the card (WCAG 1.4.11). Dwell is also hatched in every palette, so it never matches Evidence.
const BAR_COLOURS = {ev: '#2f74b5', dwell: '#b8432f', focus: '#5aa64b'};

/* ---------- State badges: meaning that never rests on colour ----------
   Equipment the player has fixed draws a tick in its top-right corner; an isolated laptop draws a small box.
   Any palette key ending in "Ok" counts as fixed; editions can add keys here. */
const STATE_BADGES = {pcIso: 'iso', wafOn: 'ok'};
function stateBadge(palKey) { return STATE_BADGES[palKey] || (/Ok$/.test(palKey || '') ? 'ok' : null); }
const BADGE_GLYPHS = {ok: [[0, 3], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]], iso: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [3, 1], [0, 2], [3, 2], [0, 3], [1, 3], [2, 3], [3, 3]]};
// Each glyph (white with a 1-px dark outline all round) is drawn once per palette into a small canvas and reused.
const BADGE_CACHE = {};
function badgeImage(kind) {
  const fill = BADGE_GLYPHS[kind]; if (!fill) return null;
  const key = kind + '|' + Settings.pal().id; if (BADGE_CACHE[key]) return BADGE_CACHE[key];
  const on = new Set(fill.map(p => p[0] + ',' + p[1])), w = Math.max(...fill.map(p => p[0])) + 1, h = Math.max(...fill.map(p => p[1])) + 1;
  const c = document.createElement('canvas'); c.width = w + 2; c.height = h + 2;
  const x = c.getContext('2d');
  x.fillStyle = Settings.col('#1b2233');
  for (const [px, py] of fill) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (!on.has((px + dx) + ',' + (py + dy))) x.fillRect(px + dx + 1, py + dy + 1, 1, 1);
  x.fillStyle = Settings.col('#ffffff');
  for (const [px, py] of fill) x.fillRect(px + 1, py + 1, 1, 1);
  c.glyphW = w;
  return (BADGE_CACHE[key] = c);
}
function drawBadge(ctx, kind, sx, sy) {
  const img = badgeImage(kind); if (!img) return;
  ctx.drawImage(img, sx + 15 - img.glyphW - 1, sy);  // top-right corner of the tile (glyph at x 15-w.., y 1..)
}

/* ---------- Sound sets (Web Audio, generated; every motif is original) ----------
   A note: f Hz (f2: glide to), d seconds, w wave ('sine','triangle','square','sawtooth' or 'noise'), v 0..1,
   at start offset (s), lp low-pass Hz, det a second voice detuned by this many cents. */
const SOUND_EVENTS = ['move', 'select', 'back', 'alert', 'correct', 'wrong', 'badge', 'battle'];
const SOUND_EVENT_NAMES = {move: 'menu move', select: 'select', back: 'back', alert: 'alert arrives', correct: 'correct', wrong: 'wrong', badge: 'badge', battle: 'battle start'};
const ALERT_EVENTS = ['alert', 'battle'];  // what "alerts only" keeps: something new needs you
const sn = (f, d, o) => Object.assign({f: f, d: d}, o || {});
const SOUND_SETS = {
  soft: {name: 'Soft', note: 'Rounded sine and triangle tones, low and quiet.', w: 'triangle', v: 0.5, ev: {
    move: [sn(620, 0.035, {w: 'sine', v: 0.25})],
    select: [sn(700, 0.06), sn(935, 0.09, {at: 0.05})],
    back: [sn(560, 0.09, {f2: 420})],
    alert: [sn(740, 0.16, {w: 'sine'}), sn(740, 0.16, {w: 'sine', at: 0.24})],
    correct: [sn(523, 0.09), sn(698, 0.09, {at: 0.08}), sn(880, 0.2, {at: 0.16})],
    wrong: [sn(330, 0.26, {f2: 247})],
    badge: [sn(440, 0.12), sn(554, 0.12, {at: 0.1}), sn(659, 0.12, {at: 0.2}), sn(880, 0.4, {at: 0.3}), sn(1109, 0.4, {at: 0.3, v: 0.25})],
    battle: [sn(294, 0.14), sn(370, 0.14, {at: 0.12}), sn(330, 0.3, {at: 0.24})]}},
  chip: {name: 'Retro chip', note: 'Square-wave blips and quick arpeggios.', w: 'square', v: 0.22, ev: {
    move: [sn(1046, 0.025)],
    select: [sn(784, 0.03), sn(1175, 0.05, {at: 0.035})],
    back: [sn(988, 0.03), sn(659, 0.05, {at: 0.035})],
    alert: [sn(1397, 0.05), sn(1047, 0.05, {at: 0.06}), sn(1397, 0.05, {at: 0.12}), sn(1047, 0.05, {at: 0.18})],
    correct: [sn(659, 0.05), sn(831, 0.05, {at: 0.05}), sn(988, 0.05, {at: 0.1}), sn(1319, 0.12, {at: 0.15})],
    wrong: [sn(262, 0.09, {w: 'sawtooth'}), sn(196, 0.18, {w: 'sawtooth', at: 0.1})],
    badge: [sn(523, 0.06), sn(659, 0.06, {at: 0.07}), sn(784, 0.06, {at: 0.14}), sn(1047, 0.06, {at: 0.21}), sn(784, 0.06, {at: 0.28}), sn(1047, 0.3, {at: 0.35})],
    battle: [sn(220, 0.06, {f2: 880}), sn(440, 0.06, {at: 0.1}), sn(415, 0.06, {at: 0.17}), sn(440, 0.2, {at: 0.24})]}},
  console: {name: 'Console beeps', note: 'Plain terminal beeps and pager tones.', w: 'sine', v: 0.45, ev: {
    move: [sn(1200, 0.02, {v: 0.25})],
    select: [sn(1500, 0.05)],
    back: [sn(900, 0.05)],
    alert: [sn(1000, 0.1), sn(1000, 0.1, {at: 0.15}), sn(1000, 0.1, {at: 0.3})],
    correct: [sn(1200, 0.07), sn(1600, 0.1, {at: 0.09})],
    wrong: [sn(400, 0.3, {w: 'square', v: 0.2})],
    badge: [sn(1200, 0.08), sn(1500, 0.08, {at: 0.1}), sn(1800, 0.25, {at: 0.2})],
    battle: [sn(2000, 0.06), sn(1600, 0.06, {at: 0.08}), sn(2000, 0.06, {at: 0.16}), sn(1600, 0.06, {at: 0.24})]}},
  clicks: {name: 'Minimal clicks', note: 'Short ticks and soft thumps; the least intrusive.', w: 'noise', v: 0.4, ev: {
    move: [sn(0, 0.012, {lp: 3500, v: 0.25})],
    select: [sn(0, 0.015, {lp: 5000}), sn(0, 0.015, {lp: 6500, at: 0.05})],
    back: [sn(0, 0.02, {lp: 1800})],
    alert: [sn(1320, 0.05, {w: 'sine', v: 0.3}), sn(1320, 0.05, {w: 'sine', v: 0.3, at: 0.12})],
    correct: [sn(0, 0.015, {lp: 4000}), sn(880, 0.08, {w: 'sine', v: 0.25, at: 0.04})],
    wrong: [sn(140, 0.12, {w: 'sine', f2: 90, v: 0.5})],
    badge: [sn(660, 0.08, {w: 'sine', v: 0.3}), sn(990, 0.16, {w: 'sine', v: 0.3, at: 0.09})],
    battle: [sn(0, 0.03, {lp: 1200, v: 0.5}), sn(0, 0.03, {lp: 1200, v: 0.5, at: 0.09})]}},
  warm: {name: 'Warm synth', note: 'Detuned sawtooth voices through a soft filter.', w: 'sawtooth', v: 0.22, lp: 1800, det: 9, ev: {
    move: [sn(523, 0.04, {lp: 1400, v: 0.15})],
    select: [sn(587, 0.07), sn(880, 0.1, {at: 0.06})],
    back: [sn(494, 0.1, {f2: 392})],
    alert: [sn(659, 0.18), sn(587, 0.22, {at: 0.2})],
    correct: [sn(392, 0.12), sn(494, 0.12, {at: 0.1}), sn(587, 0.3, {at: 0.2})],
    wrong: [sn(233, 0.3, {f2: 196, lp: 900})],
    badge: [sn(392, 0.5, {v: 0.15}), sn(494, 0.5, {v: 0.15, at: 0.05}), sn(587, 0.5, {v: 0.15, at: 0.1}), sn(784, 0.6, {v: 0.18, at: 0.25})],
    battle: [sn(147, 0.3, {lp: 700, v: 0.3}), sn(220, 0.12, {at: 0.12}), sn(208, 0.25, {at: 0.24})]}}
};

const Sound = {
  ctx: null, master: null, noiseBuf: null, unlocked: false, trace: [], last: {},
  // Audio starts only from a user gesture (browser autoplay policy). Never throws when Web Audio is missing.
  unlock() {
    if (this.unlocked) { try { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {} return; }
    this.unlocked = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
      this.setVolume();
      if (this.ctx.state === 'suspended' && this.ctx.resume) this.ctx.resume();
    } catch (e) { this.ctx = null; }
  },
  setVolume() { try { if (this.master) this.master.gain.value = Math.pow(Settings.v.volume / 100, 2) * 0.6; } catch (e) {} },
  // A preview (changing the sound set or the volume in Settings) ignores "alerts only" so the player hears what they
  // picked; mute and volume 0 still silence it.
  allowed(ev, preview) {
    const v = Settings.v;
    if (v.mute || v.volume <= 0) return 'muted';
    if (!preview && v.alertsOnly && ALERT_EVENTS.indexOf(ev) < 0) return 'filtered';
    return 'ok';
  },
  preview(ev) { return this.play(ev, null, true); },
  play(ev, setId, preview) {
    let out = this.allowed(ev, preview);
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (out === 'ok' && ev === 'move' && now - (this.last.move || 0) < 35) out = 'rate';
    if (out === 'ok') { this.last[ev] = now; out = !this.unlocked ? 'locked' : !this.ctx ? 'noaudio' : 'played'; }
    this.trace.push({ev: ev, set: setId || Settings.v.sound, out: out, preview: !!preview});
    if (this.trace.length > 300) this.trace.splice(0, 100);
    if (out !== 'played') return false;
    try { this.synth(SOUND_SETS[setId || Settings.v.sound] || SOUND_SETS.soft, ev); return true; }
    catch (e) { return false; }
  },
  synth(set, ev) {
    const c = this.ctx, t0 = c.currentTime + 0.01;
    for (const raw of set.ev[ev] || []) {
      const p = Object.assign({w: set.w, v: set.v, lp: set.lp, det: set.det, at: 0}, raw);
      const t = t0 + p.at, end = t + p.d;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(p.v, t + Math.min(0.006, p.d / 3));
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      let out = g;
      if (p.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = p.lp; g.connect(f); out = f; }
      out.connect(this.master);
      const voices = [];
      if (p.w === 'noise') {
        if (!this.noiseBuf) { const len = Math.floor(c.sampleRate * 0.25); this.noiseBuf = c.createBuffer(1, len, c.sampleRate); const d = this.noiseBuf.getChannelData(0); let s = 7; for (let i = 0; i < len; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; } }
        const src = c.createBufferSource(); src.buffer = this.noiseBuf; voices.push(src);
      } else {
        for (const cents of p.det ? [-p.det, p.det] : [0]) {
          const o = c.createOscillator(); o.type = p.w; o.frequency.setValueAtTime(p.f, t);
          if (p.f2) o.frequency.exponentialRampToValueAtTime(p.f2, end);
          if (cents) o.detune.value = cents;
          voices.push(o);
        }
      }
      const last = voices[voices.length - 1], filt = out === g ? null : out;
      last.onended = () => { try { for (const v of voices) v.disconnect(); g.disconnect(); if (filt) filt.disconnect(); } catch (e) {} };
      for (const v of voices) { v.connect(g); v.start(t); v.stop(end + 0.02); }
    }
  }
};
function sfx(ev) { try { Sound.play(ev); } catch (e) {} }

/* ---------- Settings store ----------
   v2: sound starts muted (volume kept at 60) for new players and, once, for anyone whose stored settings are v1; a
   one-time toast says so (soundTip). Reduced flashing follows the system's prefers-reduced-motion until the player
   changes it here (reduceFlashUser); after that their choice wins. */
const SETTINGS_VERSION = 2;
const Settings = {
  v: null, stored: false, storageOk: true, _col: {}, hooks: [],
  defaults() {
    let calm = false;
    try { calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
    return {v: SETTINGS_VERSION, palette: 'classic', sound: 'soft', volume: 60, mute: true, alertsOnly: false, reduceFlash: calm, reduceFlashUser: false, textSize: 'normal', soundTip: false};
  },
  load() {
    const d = this.defaults();
    let raw = null;
    try { raw = localStorage.getItem(SETTINGS_KEY); this.storageOk = true; } catch (e) { this.storageOk = false; }
    let o = {};
    if (raw) { try { o = JSON.parse(raw); this.stored = true; } catch (e) { o = null; } }
    if (!o || typeof o !== 'object' || Array.isArray(o)) o = {};
    if (this.stored && !(o.v >= 2)) { o.mute = true; o.reduceFlashUser = 'reduceFlash' in o; o.v = SETTINGS_VERSION; }  // v1 -> v2, once
    if (!o.reduceFlashUser) delete o.reduceFlash;  // not chosen here: follow the system setting
    this.v = this.clean(Object.assign(d, o));
    this.apply();
    return this.v;
  },
  clean(v) {
    if (!PALETTES.some(p => p.id === v.palette)) v.palette = 'classic';
    if (!SOUND_SETS[v.sound]) v.sound = 'soft';
    const vol = +v.volume;
    v.volume = isNaN(vol) || v.volume === null || v.volume === '' ? 60 : clamp(Math.round(vol / 10) * 10, 0, 100);
    v.mute = !!v.mute; v.alertsOnly = !!v.alertsOnly; v.reduceFlash = !!v.reduceFlash; v.reduceFlashUser = !!v.reduceFlashUser; v.soundTip = !!v.soundTip;
    v.v = SETTINGS_VERSION;
    if (v.textSize !== 'large') v.textSize = 'normal';
    return v;
  },
  save() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.v)); this.storageOk = true; this.stored = true; return true; }
    catch (e) { this.storageOk = false; return false; }
  },
  set(patch) { if ('reduceFlash' in patch) patch = Object.assign({reduceFlashUser: true}, patch); Object.assign(this.v, patch); this.clean(this.v); this.apply(); this.save(); return this.v; },
  // One-time notice on first start that sound is off (remembered in the settings key).
  soundNotice() { if (this.v.soundTip) return null; this.set({soundTip: true}); return 'Sound is off. Turn it on in Settings.'; },
  pal() { const id = this.v ? this.v.palette : 'classic'; if (!this._p || this._p.id !== id) this._p = PALETTES.find(p => p.id === id) || PALETTES[0]; return this._p; },
  calm() { return !!(this.v && this.v.reduceFlash); },
  // Every colour the canvas draws goes through here.
  col(hex) {
    const p = this.pal(); if (!p.map) return hex;
    const k = p.id + hex, r = this._col[k]; if (r !== undefined) return r;
    return (this._col[k] = /^#[0-9a-f]{6}$/i.test(hex) ? p.map(hex.toLowerCase()) : hex);
  },
  barCol(which) { const p = this.pal(); return (p.bars && p.bars[which]) || this.col(BAR_COLOURS[which]); },
  palColours(key) {
    const p = this.pal(), base = PAL[key];
    if (!base || !p.map) return base;
    if (p.ok && stateBadge(key) === 'ok') return base.map(h => p.ok(h));
    return base.map(h => this.col(h));
  },
  apply() {
    const root = document.documentElement, p = this.pal();
    for (const t of UI_TOKENS) { if (p.css) root.style.setProperty('--' + t, p.css[t]); else root.style.removeProperty('--' + t); }
    root.setAttribute('data-palette', p.id);
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = p.css ? p.css.bg : '#10141f';
    const body = document.body;
    if (body) {
      const big = body.classList.contains('bigtext');
      body.classList.toggle('calm', this.calm());
      body.classList.toggle('bigtext', this.v.textSize === 'large');
      if (big !== (this.v.textSize === 'large') && typeof Screen !== 'undefined' && Screen.canvas) Screen.fit();
    }
    Sound.setVolume();
    for (const h of this.hooks) { try { h(); } catch (e) {} }
  }
};

/* ---------- Settings menu (Start menu and title screen) ---------- */
const VOLUME_STEP = 10;
function cyc(list, cur, d) { const i = list.indexOf(cur); return list[(i + d + list.length) % list.length]; }
function settingsItems() {
  const v = Settings.v, p = Settings.pal(), s = SOUND_SETS[v.sound];
  return [
    {label: 'Colours: ' + p.name, note: p.note + ' (left/right or A to change)', meta: {k: 'palette', lr: true}},
    {label: 'Sound set: ' + s.name, note: s.note, meta: {k: 'sound', lr: true}},
    {label: 'Volume: ' + v.volume, note: '0 to 100 in steps of ' + VOLUME_STEP + ' (left/right)', meta: {k: 'volume', lr: true}},
    {label: 'Sound: ' + (v.mute ? 'muted' : 'on'), meta: {k: 'mute', lr: true}},
    {label: 'Which sounds: ' + (v.alertsOnly ? 'alerts only' : 'all'), note: v.alertsOnly ? 'only new alerts and incidents make a sound' : 'menus, verdicts, badges, alerts', meta: {k: 'alertsOnly', lr: true}},
    {label: 'Test sound', note: 'plays select, correct and an alert with these settings', meta: {k: 'test'}},
    {label: 'Reduced flashing: ' + (v.reduceFlash ? 'on' : 'off'), note: 'no screen shake, blinking or fades', meta: {k: 'reduceFlash', lr: true}},
    {label: 'Text size: ' + (v.textSize === 'large' ? 'large' : 'normal'), note: 'menus and dialogue (the status band keeps its size so the map fits)', meta: {k: 'textSize', lr: true}},
    {label: 'Back', meta: {k: 'back', back: true}}
  ];
}
function settingsChange(k, d) {
  const v = Settings.v;
  if (k === 'palette') Settings.set({palette: cyc(PALETTES.map(p => p.id), v.palette, d)});
  else if (k === 'sound') { Settings.set({sound: cyc(Object.keys(SOUND_SETS), v.sound, d)}); Sound.preview('correct'); }
  else if (k === 'volume') { Settings.set({volume: clamp(v.volume + d * VOLUME_STEP, 0, 100)}); Sound.preview('select'); }
  else if (k === 'mute') Settings.set({mute: !v.mute});
  else if (k === 'alertsOnly') Settings.set({alertsOnly: !v.alertsOnly});
  else if (k === 'reduceFlash') Settings.set({reduceFlash: !v.reduceFlash});
  else if (k === 'textSize') Settings.set({textSize: v.textSize === 'large' ? 'normal' : 'large'});
}
function settingsBody() {
  return '<div class="setprev"><canvas id="setprev" width="160" height="32" aria-label="Palette preview"></canvas></div>' +
    '<p class="small">Preview: grass, floor, door with the objective marker, you, a threat, and the kiosk and network closet before and after a fix (a tick marks fixed equipment in every palette).</p>' +
    '<p class="small">Saved in this browser for every Uptime edition, apart from your game saves.' +
    (Settings.storageOk ? '' : ' <span class="err">This browser blocked storage: settings last until you close the page.</span>') + '</p>';
}
function drawSettingsPreview() {
  const c = document.getElementById('setprev'); if (!c) return;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = Settings.col('#10141f'); x.fillRect(0, 0, c.width, c.height);
  const tiles = [['G', 'G'], ['P', 'P'], ['door', 'door'], ['floor', 'floor'], ['kiosk', 'kioskBad', 'floor'], ['kiosk', 'kioskOk', 'floor'], ['K', 'closetBad'], ['K', 'closetOk'], ['G', 'G'], ['P', 'P']];
  tiles.forEach((t, i) => {
    for (const row of [0, 1]) {
      const sx = i * 16, sy = row * 16;
      if (t[2]) x.drawImage(sprite(t[2], t[2]), sx, sy);
      if (row === 0 || t[0] === 'G' || t[0] === 'P') { x.drawImage(sprite(t[0], t[1]), sx, sy); if (row === 0) { const b = stateBadge(t[1]); if (b) drawBadge(x, b, sx, sy); } }
      else x.drawImage(sprite('floor', 'floor'), sx, sy);
    }
  });
  x.drawImage(sprite('player', 'player'), 3 * 16, 16);
  if (S.sprayer) x.drawImage(sprite('sprayer', 'sprayer'), 8 * 16, 16);
  // the objective marker on the door (same shape as the game's)
  const rows = ['1111111', '1444441', '0144410', '0014100', '0001000'];
  rows.forEach((r, yy) => { for (let xx = 0; xx < 7; xx++) { const ch = r[xx]; if (ch === '0') continue; x.fillStyle = Settings.col(ch === '1' ? '#1b2233' : '#ffd96a'); x.fillRect(2 * 16 + 5 + xx, 3 + yy, 1, 1); } });
}
async function settingsMenu() {
  let cursor = 0;
  while (true) {
    const items = settingsItems();
    const pr = UI.openModal('Settings', settingsBody(), items, {cursor: cursor, lr: true, cls: 'setbox'});
    drawSettingsPreview();
    const r = await pr;
    if (r && typeof r === 'object') { cursor = r.i; settingsChange(items[r.i].meta.k, r.d); continue; }
    if (r < 0) return;
    cursor = r;
    const k = items[r].meta.k;
    if (k === 'back') return;
    if (k === 'test') { const s = Sound; s.play('select'); setTimeout(() => s.play('correct'), 260); setTimeout(() => s.play('alert'), 900); continue; }
    settingsChange(k, 1);
  }
}
