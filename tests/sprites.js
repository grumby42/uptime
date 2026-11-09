// Character sprites and facing:
//  (a) every character sprite (player, and every NPC's sprite) has down/up/left/right frames, standing and stepping,
//      16x16 with palette indices 0-4, the four facings drawn differently, and every NPC names a valid facing and palette;
//      plus a second stepping frame (the other foot: the mirror of the first for front and back views);
//  (b) the player turns to the last move or attempted move (walking, bumping into a wall), the screen shows that facing
//      (pixel sample of the canvas against the sprite), walking alternates the two stepping frames on successive steps,
//      and save/reload keeps the facing;
//  (c) arriving through a door, the player faces the door's `dir`, even when facing another way as the step lands (every
//      open door; warp alone must set the facing);
//  (d) an NPC turns to face the player while talking (drawn facing and canvas pixels), and goes back to its own facing
//      when the conversation ends;
//  (e) a scripted speaker (a scene started by walking, not by talking) turns to face the player while speaking, and back after;
//  (f) no NPC faces straight into an adjacent solid tile or off the map, except the allowlisted ones behind a desk or counter.
// Usage: node sprites.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter' };
const V = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
function check(name, ok, info) { results.push(ok ? { name, ok: true } : { name, ok: false, info }); }

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(7); __UPTIME.turbo(true); __UPTIME.drawn(); });  // drawn(): start recording drawn characters
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  async function pickLabel(re) {
    let u = (await peek()).ui; for (let i = 0; i < 40 && !(u && u.options); i++) { await sleep(25); u = (await peek()).ui; }
    if (!u || !u.options) throw new Error('no menu open for ' + re + ': ' + JSON.stringify(await peek()).slice(0, 300));
    const idx = u.options.findIndex(o => re.test(o.label) && !o.disabled);
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options.map(o => o.label)));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 30) await press(u.type === 'modal' ? 'down' : 'right');
    await press('a');
  }
  async function settle(prefs) {
    for (let i = 0; i < 300; i++) {
      await sleep(25);
      const p = await peek();
      if (!p.ui) { if (!p.busy && !p.moving) return; continue; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      const re = (prefs || []).find(r => p.ui.options.some(o => r.test(o.label) && !o.disabled));
      await pickLabel(re || /./);
    }
    const pp = await peek(); throw new Error('settle timed out: ' + JSON.stringify({ui: pp.ui, busy: pp.busy, moving: pp.moving, map: pp.map, x: pp.x, y: pp.y}).slice(0, 700));
  }
  // Press a direction and wait until the game has taken the tap (it is consumed on the next frame), finished any move
  // or door transition, and drawn two more frames.
  async function step(d) {
    await press(d);
    await page.waitForFunction(() => !Input.taps.length, null, { timeout: 2000 }).catch(() => {});
    await idle();
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  }
  async function idle() { for (let i = 0; i < 200; i++) { const p = await peek(); if (!p.moving && !p.busy && !p.ui) return p; await sleep(15); } return peek(); }
  // The player's entity in the last drawn frame, plus how its 16x16 screen area compares with the expected sprite
  // and with the down sprite (canvas pixels sampled at the centre of each logical pixel; transparent pixels skipped).
  // For an NPC, `want` is the sprite key it should show; the mismatch is counted against that key, not the reported one.
  const ent = (id, want) => page.evaluate(([id, want]) => {
    const ents = (__UPTIME.drawn && __UPTIME.drawn()) || [];
    const e = ents.find(x => x.id === id); if (!e) return null;
    const k = Screen.k, img = Screen.ctx.getImageData(0, 0, Screen.canvas.width, Screen.canvas.height);
    const hex = (px, py) => { const i = ((py * k + (k >> 1)) * img.width + (px * k + (k >> 1))) * 4; return '#' + [0, 1, 2].map(j => img.data[i + j].toString(16).padStart(2, '0')).join(''); };
    const diff = key => { let n = 0; S[key].forEach((row, y) => [...row].forEach((c, x) => { if (c !== '0' && hex(e.x + x, e.y + y) !== PAL[e.pal][+c - 1].toLowerCase()) n++; })); return n; };
    const base = e.key.replace(/[ULR]?(W2?)?$/, '');
    return { key: e.key, dir: e.dir, mismatch: diff(want || e.key), vsDown: diff(base) };
  }, [id, want || null]);
  const me = () => ent('me');
  const frames = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

  // ---------- (a) sprite definitions ----------
  const defs = await page.evaluate(() => {
    const bad = [], info = {};
    if (typeof CHAR_SPRITES === 'undefined' || typeof FACINGS === 'undefined' || typeof facingKey !== 'function') return { bad: ['no CHAR_SPRITES / FACINGS / facingKey in this build'], count: 0 };
    const dirs = ['down', 'up', 'left', 'right'];
    const used = new Set(NPCS.map(n => n.spr || 'player').concat(['player']));
    for (const c of used) if (CHAR_SPRITES.indexOf(c) < 0) bad.push('character sprite ' + c + ' not in CHAR_SPRITES');
    let count = 0;
    for (const c of CHAR_SPRITES) {
      const seen = {};
      const mirror = g => g.map(r => r.split('').reverse().join('')).join('');
      for (const d of dirs) for (const w of [0, 1, 2]) {
        const k = facingKey(c, d, w), g = S[k]; count++;
        if (!g) { bad.push(c + ' ' + d + (w ? ' step ' + w : '') + ': missing (' + k + ')'); continue; }
        if (g.length !== 16 || g.some(r => typeof r !== 'string' || r.length !== 16)) bad.push(k + ': not 16x16');
        if (g.some(r => /[^0-4]/.test(r))) bad.push(k + ': palette index outside 0-4');
        if (!w) { seen[d] = g.join(''); if ((d === 'down' || d === 'up') && mirror(g) !== g.join('')) bad.push(k + ': front/back view not left-right symmetric'); }
        else if (g.join('') === S[facingKey(c, d, 0)].join('')) bad.push(k + ': step frame same as standing');
        if (w === 2 && S[facingKey(c, d, 1)]) {
          if (g.join('') === S[facingKey(c, d, 1)].join('')) bad.push(k + ': second step frame same as the first (feet never alternate)');
          if ((d === 'down' || d === 'up') && g.join('') !== mirror(S[facingKey(c, d, 1)])) bad.push(k + ': not the mirror of the first step frame');
        }
      }
      for (const w of [0, 1, 2]) if (S[facingKey(c, 'right', w)] && S[facingKey(c, 'left', w)] && S[facingKey(c, 'right', w)].join('') !== mirror(S[facingKey(c, 'left', w)])) bad.push(facingKey(c, 'right', w) + ': not the mirror of ' + facingKey(c, 'left', w));
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (seen[dirs[i]] && seen[dirs[i]] === seen[dirs[j]]) bad.push(c + ': ' + dirs[i] + ' and ' + dirs[j] + ' identical');
      info[c] = dirs.map(d => facingKey(c, d, false));
    }
    for (const n of NPCS) {
      if (!FACINGS.hasOwnProperty(n.dir)) bad.push('npc ' + n.id + ' facing ' + n.dir);
      const p = PAL[n.pal]; if (!p || p.length !== 4 || p.some(c => !/^#[0-9a-f]{6}$/i.test(c))) bad.push('npc ' + n.id + ' palette ' + n.pal);
    }
    return { bad, count, info, npcs: NPCS.length, chars: CHAR_SPRITES.slice() };
  });
  check('(a) every character sprite has down/up/left/right (standing + two step frames), 16x16, indices 0-4, facings distinct; NPC facings/palettes valid', defs.bad.length === 0 && defs.count >= 24, defs.bad);

  // ---------- new game ----------
  await pickLabel(/New game/); await settle([/Ledger/]);
  await idle();

  // ---------- (b) move / bump in each direction ----------
  const moveLog = [];
  for (const d of ['up', 'left', 'down', 'right', 'left', 'up']) {
    const before = await peek();
    // start facing the opposite way so a pass can only come from this key press
    await page.evaluate(o => { __UPTIME.state().dir = o; }, OPP[d]);
    await sleep(40);
    await step(d);
    const p = await peek(), m = await me();
    moveLog.push({ d, moved: p.x !== before.x || p.y !== before.y, dir: p.dir, drawn: m });
  }
  check('(b) after each key the player faces that way (state and drawn sprite key)', moveLog.every(r => r.dir === r.d && r.drawn && r.drawn.key === 'player' + { down: '', up: 'U', left: 'L', right: 'R' }[r.d]), moveLog);
  check('(b) pixel sample: the canvas shows the facing sprite (0 mismatched pixels; differs from the down sprite unless facing down)',
    moveLog.every(r => r.drawn && r.drawn.mismatch === 0 && (r.d === 'down' || r.drawn.vsDown > 0)), moveLog.map(r => r.drawn));

  // bump: stand next to a wall in each direction and push into it
  const bumps = [];
  for (const d of ['up', 'down', 'left', 'right']) {
    const spot = await page.evaluate(d => {
      const G = __UPTIME.state(), rows = MAPS[G.map].rows, v = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]}[d];
      for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) {
        if (blocked(G.map, x, y) || doorAt(G.map, x, y)) continue;
        const tx = x + v[0], ty = y + v[1];
        if (tileDef(G.map, tx, ty) && tileDef(G.map, tx, ty).solid && !doorAt(G.map, tx, ty) && !npcHere(G.map, tx, ty)) return {x, y};
      }
      return null;
    }, d);
    if (!spot) { bumps.push({ d, err: 'no wall spot' }); continue; }
    await page.evaluate(([s, o]) => { const G = __UPTIME.state(); G.x = s.x; G.y = s.y; G.dir = o; }, [spot, OPP[d]]);
    await sleep(40);
    await step(d);
    const p = await peek(), m = await me();
    bumps.push({ d, stayed: p.x === spot.x && p.y === spot.y, dir: p.dir, key: m && m.key, mismatch: m && m.mismatch });
  }
  check('(b) bumping into a wall turns the player to face it without moving (drawn sprite matches)', bumps.every(b => b.stayed && b.dir === b.d && b.key === 'player' + { down: '', up: 'U', left: 'L', right: 'R' }[b.d] && b.mismatch === 0), bumps);

  // walk cycle: hold a direction with normal speed and record, per step (G.steps before it lands), the frames drawn
  await page.evaluate(() => __UPTIME.turbo(false));
  const walk = {};
  for (const d of ['left', 'right', 'up', 'down']) {
    const spot = await page.evaluate(d => {
      const G = __UPTIME.state(), rows = MAPS[G.map].rows, v = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]}[d];
      for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[0].length; x++) {
        let ok = true; for (let i = 0; i <= 6; i++) { const xx = x + v[0] * i, yy = y + v[1] * i; const t = tileDef(G.map, xx, yy); if (!t || blocked(G.map, xx, yy) || doorAt(G.map, xx, yy) || t.grass) ok = false; }
        if (ok) return {x, y};
      }
      return null;
    }, d);
    if (!spot) { walk[d] = 'no spot'; continue; }
    await page.evaluate(s => { const G = __UPTIME.state(); G.x = s.x; G.y = s.y; window.__keys = new Set(); window.__steps = {}; window.__rec = true;
      (function loop() { const e = (__UPTIME.drawn ? __UPTIME.drawn() : []).find(x => x.id === 'me');
        if (e) { __keys.add(e.key); if (/W2?$/.test(e.key)) { const n = __UPTIME.state().steps; (__steps[n] = __steps[n] || []).includes(e.key) || __steps[n].push(e.key); } }
        if (__rec) requestAnimationFrame(loop); })(); }, spot);
    await page.keyboard.down(KEY[d]); await sleep(620); await page.keyboard.up(KEY[d]);
    await idle();
    walk[d] = await page.evaluate(() => { __rec = false; return { keys: [...__keys], steps: Object.keys(__steps).map(Number).sort((a, b) => a - b).map(n => ({n, keys: __steps[n]})) }; });
  }
  await page.evaluate(() => __UPTIME.turbo(true));
  const SUF = { down: '', up: 'U', left: 'L', right: 'R' };
  check('(b) walking shows standing and stepping frames for each facing',
    Object.entries(walk).every(([d, w]) => w.keys && w.keys.includes('player' + SUF[d]) && w.keys.some(k => k.startsWith('player' + SUF[d] + 'W'))), walk);
  // each step shows exactly one stepping frame, successive steps alternate W / W2 (feet alternate), at least 3 steps
  const alt = Object.entries(walk).map(([d, w]) => {
    if (!w.steps) return { d, ok: false, w };
    const st = w.steps, ok = st.length >= 3 && st.every(s => s.keys.length === 1) &&
      st.every((s, i) => i === 0 || (s.n === st[i - 1].n + 1 && s.keys[0] !== st[i - 1].keys[0])) &&
      st.every(s => s.keys[0] === 'player' + SUF[d] + (s.n % 2 ? 'W2' : 'W'));
    return { d, ok, steps: st };
  });
  check('(b) walking alternates the two stepping frames (left foot, right foot) on successive steps', alt.every(a => a.ok), alt);

  // save / reload keeps the facing
  await page.evaluate(() => { __UPTIME.state().dir = 'down'; });
  await step('left');
  const savedDir = (await peek()).dir;
  for (let i = 0; i < 10 && !(await peek()).ui; i++) { await press('start'); await sleep(120); }
  await pickLabel(/^Save/); await settle([/^(OK|Back|Close)$/]);
  await page.reload();
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(7); __UPTIME.turbo(true); __UPTIME.drawn(); });
  await pickLabel(/Continue/); await settle(); await sleep(80); await frames();
  const re = await peek(), rm = await me();
  check('save/reload keeps the player facing (state and drawn sprite)', savedDir === 'left' && re.dir === 'left' && rm && rm.key === 'playerL' && rm.mismatch === 0, { savedDir, dir: re.dir, drawn: rm });

  // ---------- (e) scripted speaker turns to the player ----------
  // Walking into the Mail Room before the Front Desk is secure starts a scene in which Bea speaks (a trigger, not a talk).
  // The player stands west of Bea, so she should turn left while speaking and go back to her own facing after.
  const scene = await page.evaluate(() => {
    const G = __UPTIME.state(), n = NPCS.find(n => n.id === 'bea');
    if (G.f.bossDone) return { err: 'boss already done' };
    for (let x = n.x - 3; x > 0; x--) { if (!blocked(n.map, x, n.y) && !blocked(n.map, x - 1, n.y) && !doorAt(n.map, x - 1, n.y) && !doorAt(n.map, x, n.y)) { G.map = n.map; G.x = x; G.y = n.y; G.dir = 'right'; return { x: x - 1, def: n.dir, spr: n.spr || 'player' }; } }
    return { err: 'no free tile' };
  });
  let sceneLog = { scene };
  if (!scene.err) {
    await sleep(40); await frames();
    const before = await ent('bea');
    await press('left');
    let during = null;
    for (let i = 0; i < 80 && !during; i++) { await sleep(25); const p = await peek(); if (p.ui && p.ui.type === 'say') { await frames(); during = await ent('bea', scene.spr + 'L'); } }
    await settle(); await frames();
    const after = await ent('bea');
    sceneLog = { scene, before, during, after };
  }
  check('(e) a scripted speaker (scene started by walking) turns to face the player while speaking (drawn facing and pixels)',
    !!(sceneLog.during && sceneLog.during.dir === 'left' && sceneLog.during.key === scene.spr + 'L' && sceneLog.during.mismatch === 0 && sceneLog.during.vsDown > 0), sceneLog);
  check('(e) the scripted speaker faces its own way before the scene and goes back to it after',
    !!(sceneLog.before && sceneLog.after && sceneLog.before.dir === scene.def && sceneLog.after.dir === scene.def), sceneLog);

  // ---------- (c) door arrival ----------
  const doors = await page.evaluate(() => {
    const out = [], v = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};
    for (const m in MAPS) for (const k in (MAPS[m].doors || {})) {
      const d = MAPS[m].doors[k]; if (!d.to || d.locked) continue;
      const [x, y] = k.split(',').map(Number), ax = x - v[d.dir][0], ay = y - v[d.dir][1];
      const t = tileDef(m, ax, ay);
      if (!t || t.solid || doorAt(m, ax, ay) || NPCS.some(n => n.map === m && n.x === ax && n.y === ay)) continue;
      out.push({m, x, y, ax, ay, to: d.to, dir: d.dir, tx: d.x, ty: d.y});
    }
    return out;
  });
  const arrivals = [];
  for (const d of doors) {
    // The step onto the door is already under way (tryMove has run) and the player faces away from the door's `dir`
    // when it lands, so only warp() can turn them: a test that walked in with the key would pass on tryMove alone.
    await page.evaluate(d => { const G = __UPTIME.state(); G.map = d.m; G.x = d.ax; G.y = d.ay;
      G.dir = {up: 'down', down: 'up', left: 'right', right: 'left'}[d.dir];
      moving = {fx: d.ax, fy: d.ay, tx: d.x, ty: d.y, t: 0.9}; }, d);
    await idle(); await frames();
    const p = await peek(), m = await me();
    arrivals.push({ door: d.m + ' ' + d.x + ',' + d.y + ' -> ' + d.to, want: d.dir, map: p.map, at: p.x + ',' + p.y, dir: p.dir, key: m && m.key, mismatch: m && m.mismatch });
    if (p.ui) await settle();
  }
  const badArr = arrivals.filter(a => a.map !== a.door.split(' -> ')[1] || a.dir !== a.want || a.key !== 'player' + SUF[a.want] || a.mismatch !== 0);
  check('(c) door arrival: warp turns the player to the door `dir` from the opposite facing (state and drawn sprite), every open door', arrivals.length >= 20 && badArr.length === 0, { tested: arrivals.length, bad: badArr });

  // ---------- (d) NPC turns to the player while talking ----------
  const talks = [];
  for (const [id, side] of [['sam', 'left'], ['hal', 'up'], ['tomas', 'right'], ['dee', 'right'], ['rae', 'left'], ['sunita', 'up']]) {
    // side: where the player stands relative to the NPC; the NPC should then face that way
    const spot = await page.evaluate(([id, side]) => {
      const n = NPCS.find(n => n.id === id), v = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]}[side];
      const G = __UPTIME.state(), x = n.x + v[0], y = n.y + v[1];
      if (blocked(n.map, x, y) || doorAt(n.map, x, y)) return null;
      G.map = n.map; G.x = x; G.y = y; G.dir = side;  // facing away; the key press below turns toward the NPC
      return {def: n.dir, map: n.map};
    }, [id, side]);
    if (!spot) { talks.push({ id, side, err: 'no free tile' }); continue; }
    await sleep(40);
    await step(OPP[side]);
    const before = await page.evaluate(id => ((__UPTIME.drawn ? __UPTIME.drawn() : []).find(e => e.id === id) || {}).dir, id);
    await press('a');
    let during = null;
    const spr = await page.evaluate(id => NPCS.find(n => n.id === id).spr || 'player', id);
    for (let i = 0; i < 40 && !during; i++) { await sleep(25); const p = await peek(); if (p.ui) { await frames(); during = await ent(id, spr + SUF[side]); } }
    await settle([/^(Leave|Not now|Later|Bye|Back)/i]);
    await sleep(60);
    const after = await page.evaluate(id => ((__UPTIME.drawn ? __UPTIME.drawn() : []).find(e => e.id === id) || {}).dir, id);
    talks.push({ id, side, def: spot.def, before, during: during && during.dir, duringKey: during && during.key, mismatch: during && during.mismatch, vsDown: during && during.vsDown, after });
  }
  check('(d) an NPC turns to face the player while talking (drawn facing)', talks.every(t => t.during === t.side && /^(player|actor)[ULR]?$/.test(t.duringKey || '') && t.duringKey.endsWith(SUF[t.side])), talks);
  check('(d) the NPC keeps its own facing before talking and goes back to it after', talks.every(t => t.before === t.def && t.after === t.def), talks);
  // pixel sample of the turned NPC against the sprite it should show (not the key it reports), for every NPC talked to
  const px = talks.filter(t => t.mismatch === 0 && (t.side === 'down' || t.vsDown > 0));
  check('(d) pixel sample: the canvas shows each talked-to NPC turned to the player (0 mismatched pixels, at least 2 NPCs)', px.length === talks.length && px.length >= 2, talks.map(t => ({ id: t.id, side: t.side, mismatch: t.mismatch, vsDown: t.vsDown })));

  // ---------- (f) NPC facing data ----------
  // Allowed to face an adjacent solid tile: NPCs behind a desk or counter, facing across it to the room.
  const FACE_ALLOW = { rae: 'behind the desk, facing the room', kofi: 'behind the help desk counter', oona: 'at the payment kiosk she runs' };
  const facing = await page.evaluate(() => {
    const V = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};
    return NPCS.map(n => { const v = V[n.dir] || [0, 0], t = tileDef(n.map, n.x + v[0], n.y + v[1]);
      return { id: n.id, map: n.map, dir: n.dir, ahead: t ? (t.name || t.spr) : 'off map', solid: !t || !!t.solid }; });
  });
  const intoWall = facing.filter(f => f.solid && !FACE_ALLOW[f.id]);
  const staleAllow = Object.keys(FACE_ALLOW).filter(id => !facing.some(f => f.id === id && f.solid));
  check('(f) no NPC faces straight into an adjacent solid tile or off the map (allowlist: behind a desk or counter)', facing.length > 0 && intoWall.length === 0 && staleAllow.length === 0, { intoWall, staleAllow });

  // ---------- Crossroads (edition 2): the same rules on its maps and people ----------
  {
    const CRF = 'file://' + path.resolve(__dirname, '../editions/crossroads/index.html');
    const cp = await ctx.newPage();
    cp.on('pageerror', e => errs.push('crossroads pageerror: ' + e.message));
    cp.on('console', m => { if (m.type() === 'error') errs.push('crossroads: ' + m.text()); });
    cp.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('crossroads request ' + r.url()); });
    await cp.goto(CRF); await cp.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
    await cp.evaluate(() => { __UPTIME.seed(7); __UPTIME.turbo(true); __UPTIME.drawn(); [...document.querySelectorAll('#mopts .opt')].find(e => /New game/.test(e.textContent)).click(); });
    for (let i = 0; i < 300; i++) { const q = await cp.evaluate(() => __UPTIME.peek()); if (!q.ui && !q.busy && q.started) break; if (q.ui) await cp.evaluate(() => { if (UI.mode === 'say') UI.handle('a'); else { const m = UI.modal || UI.choice; const g = m.items.findIndex(o => o.meta && o.meta.good); m.cursor = g < 0 ? 0 : g; UI.handle('a'); } }); await sleep(15); }
    const cf = await cp.evaluate(() => { const V = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};
      return NPCS.map(n => { const v = V[n.dir] || [0, 0], t = tileDef(n.map, n.x + v[0], n.y + v[1]); return { id: n.id, map: n.map, solid: !t || !!t.solid, chars: CHAR_SPRITES.includes(n.spr || 'player') }; }); });
    check('Crossroads (f): no NPC faces into an adjacent solid tile; every NPC uses a four-facing character sprite', cf.length >= 15 && cf.every(f => !f.solid && f.chars), cf.filter(f => f.solid || !f.chars));
    const arr = await cp.evaluate(async () => {
      const out = []; G.trackId = 'manager'; G.f.lbMet = true; G.f.lbBookmark = true; G.f.lbSummary = true; G.f.sdMet = true; G.f.sdSlate = true; G.f.sdSummary = true; G.f.cnMet = true; G.f.cnPulse = true; G.f.cnSummary = true; G.f.dpMet = true;
      for (const m in MAPS) for (const k in MAPS[m].doors || {}) {
        const d = MAPS[m].doors[k]; if (!d.to || d.locked) continue;
        G.dir = {up: 'down', down: 'up', left: 'right', right: 'left'}[d.dir];
        await warp(d.to, d.x, d.y, d.dir); out.push({ door: m + ' ' + k, want: d.dir, got: G.dir, map: G.map === d.to });
      }
      return out;
    });
    check('Crossroads (c): every door’s warp turns the player to face away from it (all 18 links, the School District’s, the Clinic’s and Dispatch’s included)', arr.length === 18 && arr.every(a => a.got === a.want && a.map) && arr.some(a => /^school /.test(a.door)) && arr.some(a => /^sboard /.test(a.door)) && arr.some(a => /^clinic /.test(a.door)) && arr.some(a => /^cnboard /.test(a.door)) && arr.some(a => /^dispatch /.test(a.door)) && arr.some(a => /^dpboard /.test(a.door)), arr);
    const turn = await cp.evaluate(async () => {
      G.map = 'library'; G.x = 12; G.y = 4; G.dir = 'right'; G.f.lbMet = true; G.trackId = 'manager';
      interact(); await new Promise(r => setTimeout(r, 120));
      const e = __UPTIME.drawn().find(x => x.id === 'dot'); const dir = e && e.dir;
      for (let i = 0; i < 20 && (UI.mode || UI.modal); i++) { UI.handle('a'); await new Promise(r => setTimeout(r, 30)); }
      await new Promise(r => setTimeout(r, 80));
      const e2 = __UPTIME.drawn().find(x => x.id === 'dot');
      return { during: dir, after: e2 && e2.dir };
    });
    check('Crossroads (d): an NPC turns to the player while talking (Dot faces left), then back to her own facing', turn.during === 'left' && turn.after === 'down', turn);
    const turn2 = await cp.evaluate(async () => {
      G.map = 'school'; G.x = 8; G.y = 3; G.dir = 'up'; G.f.sdMet = true; G.f.lbSummary = true; G.trackId = 'manager';
      interact(); await new Promise(r => setTimeout(r, 120));
      const e = __UPTIME.drawn().find(x => x.id === 'sato'); const dir = e && e.dir;
      for (let i = 0; i < 20 && (UI.mode || UI.modal); i++) { UI.handle('a'); await new Promise(r => setTimeout(r, 30)); }
      await new Promise(r => setTimeout(r, 80));
      const e2 = __UPTIME.drawn().find(x => x.id === 'sato');
      return { during: dir, after: e2 && e2.dir };
    });
    check('Crossroads (d): in the School District, Nell Sato turns to the player while talking (faces down), then back (left)', turn2.during === 'down' && turn2.after === 'left', turn2);
    const turn3 = await cp.evaluate(async () => {
      G.map = 'clinic'; G.x = 13; G.y = 7; G.dir = 'left'; G.f.cnMet = true; G.f.sdSummary = true; G.trackId = 'dfir';
      interact(); await new Promise(r => setTimeout(r, 120));
      const e = __UPTIME.drawn().find(x => x.id === 'okonjo'); const dir = e && e.dir;
      for (let i = 0; i < 20 && (UI.mode || UI.modal); i++) { UI.handle('a'); await new Promise(r => setTimeout(r, 30)); }
      await new Promise(r => setTimeout(r, 80));
      const e2 = __UPTIME.drawn().find(x => x.id === 'okonjo');
      return { during: dir, after: e2 && e2.dir };
    });
    check('Crossroads (d): in the Clinic, Joy Okonjo turns to the player while talking (faces right), then back (down)', turn3.during === 'right' && turn3.after === 'down', turn3);
    const turn4 = await cp.evaluate(async () => {
      G.map = 'dispatch'; G.x = 9; G.y = 2; G.dir = 'left'; G.f.dpMet = true; G.f.cnSummary = true; G.trackId = 'manager';
      interact(); await new Promise(r => setTimeout(r, 120));
      const e = __UPTIME.drawn().find(x => x.id === 'reyes'); const dir = e && e.dir;
      for (let i = 0; i < 20 && (UI.mode || UI.modal); i++) { UI.handle('a'); await new Promise(r => setTimeout(r, 30)); }
      await new Promise(r => setTimeout(r, 80));
      const e2 = __UPTIME.drawn().find(x => x.id === 'reyes');
      return { during: dir, after: e2 && e2.dir };
    });
    check('Crossroads (d): at Dispatch, Tamsin Reyes turns to the player while talking (faces right), then back (left)', turn4.during === 'right' && turn4.after === 'left', turn4);
    await cp.close();
  }

  check('no console errors or network requests', errs.length === 0, errs);
  await browser.close();
  const failed = results.filter(r => !r.ok);
  console.log(JSON.stringify({ suite: 'sprites', passed: results.length - failed.length, failed: failed.length, sprites: defs.chars, frames: defs.count, results }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('SPRITES FAILED:', e.message); process.exit(2); });
