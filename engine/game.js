/* ============================================================
   UPTIME · engine/game.js
   Shared game core: overworld, rendering, HUD, script runner, investigations
   (battles), alerts, scorecard, Field Manual, menus, save/load, title, main loop,
   debug hooks for tests. Each edition supplies its data and story (EDITION,
   newState, objective, interact, triggers, editionTile, summary, introScript...).
   ============================================================ */
'use strict';

let G = null;          // saved game state
let B = null;          // current battle (not saved)
let busy = 0;          // running scripts
let moving = null;     // current step animation
let fade = 0;          // map transition fade (0..1)
let started = false;   // past the title screen
let lastT = 0, encCooldown = 0, toastT = 0, shake = 0, titleOpen = false;

const DIRS = {up:[0,-1], down:[0,1], left:[-1,0], right:[1,0]};

/* ---------- Helpers ---------- */
const say = (t, who) => UI.say(t, who);
const choose = (p, items, o) => UI.choose(p, items, o);
function toast(msg) { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); toastT = 2600; }
function unlock(kind, key) { if (!G.fm[kind + ':' + key]) { G.fm[kind + ':' + key] = true; return true; } return false; }
function touchCSF(fn) { if (!G.csf[fn]) { G.csf[fn] = true; toast('CSF ' + fn + ' unlocked in the Field Manual'); } }
function groupFixed(g) { return !!G.f[GROUPS[g].fix]; }
function tool() { return G.party[G.active]; }
function toolName(t) { return TOOLS[t.id].name + (t.tuned ? ' · Tuned' : ''); }
function hasTool(id) { return G.party.some(t => t.id === id); }
function addTool(id, lvl) { if (!hasTool(id)) G.party.push({id: id, lvl: lvl || 3, xp: 0, tuned: false}); }
function npcHere(map, x, y) { return NPCS.find(n => n.map === map && n.x === x && n.y === y && (!n.cond || n.cond(G))); }
function mapRows(m) { return MAPS[m].rows; }

/* ---------- Metrics ---------- */
function metricVals() {
  const m = G.m;
  return {
    closed: m.closed,
    acc: m.judged ? Math.round(m.correctShown / m.judged * 100) : null,
    tta: m.ttaN ? +(m.ttaSum / m.ttaN).toFixed(1) : null,
    esc: m.esc ? Math.round(m.escOk / m.esc * 100) : null,
    evid: m.judged ? Math.round((m.evOk || 0) / m.judged * 100) : null,
    uptime: +G.uptime.toFixed(2),
    mfa: Math.round(G.mfaSet.length / ACCOUNTS_TOTAL * 100),
    patch: Math.round(Object.keys(GROUPS).filter(groupFixed).length / 4 * 100),
    ...(typeof editionMetricVals === 'function' ? editionMetricVals() : {})
  };
}
const METRICS = [
  {k: 'closed', label: 'Alerts closed (read with accuracy)', unit: '', higher: true},
  {k: 'acc', label: 'Verdict accuracy', unit: '%', higher: true},
  {k: 'evid', label: 'Verdicts with evidence ≥ 40', unit: '%', higher: true},
  {k: 'tta', label: 'Time to acknowledge (game seconds)', unit: ' s', higher: false},
  {k: 'esc', label: 'Escalation precision (real, with evidence ÷ all)', unit: '%', higher: true},
  {k: 'uptime', label: 'District uptime', unit: '%', higher: true},
  {k: 'mfa', label: 'MFA coverage', unit: '%', higher: true},
  {k: 'patch', label: 'Hardening (baseline fixes)', unit: '%', higher: true}
];
if (typeof EDITION_METRICS !== 'undefined') METRICS.push(...EDITION_METRICS);
function track() {
  const v = metricVals();
  for (const d of METRICS) {
    if (d.when && !d.when()) continue;
    const x = v[d.k]; if (x === null || x === undefined) continue;
    const t = G.track[d.k] || (G.track[d.k] = {best: x, worst: x});
    if (d.higher) { t.best = Math.max(t.best, x); t.worst = Math.min(t.worst, x); }
    else { t.best = Math.min(t.best, x); t.worst = Math.max(t.worst, x); }
  }
}
function bumpUptime(d) { G.uptime = clamp(+(G.uptime + d).toFixed(3), 99.0, 100); track(); }

/* ---------- Tiles ---------- */
function tileChar(map, x, y) { const r = mapRows(map); if (y < 0 || y >= r.length || x < 0 || x >= r[0].length) return null; return r[y][x]; }
function tileDef(map, x, y) {
  const ch = tileChar(map, x, y); if (ch === null) return null;
  let d = Object.assign({ch: ch}, TILES[ch]);
  if (d.group) { const lit = groupFixed(d.group); d.spr = lit ? 'L' : 'B'; d.pal = lit ? 'L' : 'B'; }
  return editionTile(d, ch, x, y);
}
function doorAt(map, x, y) { const d = MAPS[map].doors; return d && d[x + ',' + y]; }
function blocked(map, x, y) {
  const d = tileDef(map, x, y); if (!d) return true;
  if (d.solid) return true;
  const door = doorAt(map, x, y); if (door && door.locked) return true;
  if (npcHere(map, x, y)) return true;
  return false;
}

/* ---------- Rendering ---------- */
function camera() {
  const r = mapRows(G.map), mw = r[0].length * TS, mh = r.length * TS;
  let px = G.x * TS, py = G.y * TS;
  if (moving) { const t = moving.t; px = (moving.fx + (moving.tx - moving.fx) * t) * TS; py = (moving.fy + (moving.ty - moving.fy) * t) * TS; }
  let cx = mw <= VW ? -(VW - mw) / 2 : clamp(px + 8 - VW / 2, 0, mw - VW);
  let cy = mh <= VH ? -(VH - mh) / 2 : clamp(py + 8 - VH / 2, 0, mh - VH);
  return {cx: Math.round(cx), cy: Math.round(cy), px: px, py: py};
}
function drawWorld(ctx) {
  ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, VW, VH);
  const r = mapRows(G.map), cam = camera();
  const x0 = Math.max(0, Math.floor(cam.cx / TS)), y0 = Math.max(0, Math.floor(cam.cy / TS));
  const x1 = Math.min(r[0].length - 1, Math.floor((cam.cx + VW) / TS)), y1 = Math.min(r.length - 1, Math.floor((cam.cy + VH) / TS));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const d = tileDef(G.map, x, y);
    const sx = x * TS - cam.cx, sy = y * TS - cam.cy;
    if (d.under) { const u = TILES[d.under]; ctx.drawImage(sprite(u.spr, u.pal), sx, sy); }
    ctx.drawImage(sprite(d.spr, d.pal), sx, sy);
  }
  // entities sorted by y
  const ents = NPCS.filter(n => n.map === G.map && (!n.cond || n.cond(G))).map(n => ({x: n.x * TS, y: n.y * TS, spr: n.spr || 'player', pal: n.pal, dir: n.dir}));
  const walkFrame = moving && moving.t > 0.25 && moving.t < 0.75;
  ents.push({x: cam.px, y: cam.py, spr: 'player', pal: 'player', dir: G.dir, me: true, step: walkFrame});
  ents.sort((a, b) => a.y - b.y);
  for (const e of ents) {
    const variant = e.dir === 'up' && e.spr === 'player' ? 'back' : (e.step ? 'step' : '');
    ctx.drawImage(sprite(e.spr, e.pal, {variant: variant}), Math.round(e.x - cam.cx), Math.round(e.y - cam.cy - (e.step ? 1 : 0)));
  }
  if (fade > 0) { ctx.fillStyle = 'rgba(16,20,31,' + fade + ')'; ctx.fillRect(0, 0, VW, VH); }
}
function ellipse(ctx, cx, cy, rx, ry, c1, c2) {
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
    const d = (x / rx) ** 2 + (y / ry) ** 2;
    if (d <= 1) { ctx.fillStyle = d > 0.7 ? c1 : c2; ctx.fillRect(cx + x, cy + y, 1, 1); }
  }
}
let platformCache = null;
function drawBattle(ctx) {
  if (!platformCache) {
    const c = document.createElement('canvas'); c.width = VW; c.height = VH;
    const x = c.getContext('2d');
    x.fillStyle = '#dbeaf7'; x.fillRect(0, 0, VW, 96);
    x.fillStyle = '#c9e3a8'; x.fillRect(0, 96, VW, VH - 96);
    ellipse(x, 252, 84, 40, 7, '#5aa64b', '#a6d96a');
    ellipse(x, 76, 114, 44, 7, '#5aa64b', '#a6d96a');
    platformCache = c;
  }
  ctx.drawImage(platformCache, 0, 0);
  if (!B) return;
  const sh = shake > 0 ? Math.round((Math.random() - 0.5) * 4) : 0;
  let es = B.spec.enemy;
  if (!B.spec.story && !B.revealed) es = {spr: 'beacon', pal: 'beacon'};
  const bob = Math.round(Math.sin(performance.now() / 300) * 1);
  ctx.drawImage(sprite(es.spr, es.pal), 236 + sh, 50 + bob, 32, 32);
  const t = tool();
  if (t) ctx.drawImage(sprite(TOOLS[t.id].spr, TOOLS[t.id].spr, {variant: t.tuned ? 'tuned' : ''}), 60, 80, 32, 32);
}

/* ---------- HUD ---------- */
let hudStr = '';
function hudUpdate() {
  const el = document.getElementById('hud');
  if (!G || !started || B) { if (hudStr !== '') { el.innerHTML = ''; hudStr = ''; } el.style.display = 'none'; return; }
  el.style.display = '';
  const v = metricVals();
  const s = 'Day ' + G.day + ' · ' + G.rank + ' · Focus ' + G.focus + '/' + G.focusMax + ' · Queue ' + G.queue +
    ' · Up ' + v.uptime.toFixed(2) + '%|' + objective().text;
  if (s !== hudStr) {
    hudStr = s; const p = s.split('|');
    el.innerHTML = '<div>' + esc(p[0]) + '</div><div class="obj">▸ ' + esc(p[1]) + '</div>';
  }
}

/* ---------- Script runner ---------- */
async function run(fn) {
  busy++;
  try { await fn(); }
  catch (e) { console.error(e); }
  finally {
    busy--;
    if (!busy) { UI.hidePanel(); hudUpdate(); autosave(); }
  }
}
function autosave() { if (G && started && !B) storeSet(encodeSave(G)); }

/* ---------- Movement ---------- */
function tryMove(dir) {
  G.dir = dir;
  const [dx, dy] = DIRS[dir];
  const tx = G.x + dx, ty = G.y + dy;
  const door = doorAt(G.map, tx, ty);
  if (door && door.locked) { run(async () => { await say(door.locked); }); return; }
  if (blocked(G.map, tx, ty)) return;
  moving = {fx: G.x, fy: G.y, tx: tx, ty: ty, t: 0};
}
function stepDone() {
  G.x = moving.tx; G.y = moving.ty; moving = null;
  G.steps++;
  if (G.f.logs) G.m.events += 37 + Math.floor(rnd() * 20);
  if (G.steps % 12 === 0 && G.f.starter) G.queue = Math.min(9, G.queue + 1);
  if (G.auto && G.steps % 15 === 0 && G.queue > 0 && hasTool('ledger')) {
    if (rnd() < G.fpWeight / (G.fpWeight + 50) * 0.8) {
      G.queue--; G.m.autoClosed++;
      if (rnd() < 0.02) G.m.missed++;
      toast('Ledger auto-closed a known false positive');
    }
  }
  if (encCooldown > 0) encCooldown--;
  const door = doorAt(G.map, G.x, G.y);
  if (door && door.to) { run(() => warp(door.to, door.x, door.y, door.dir)); return; }
  if (triggers()) return;
  const d = tileDef(G.map, G.x, G.y);
  if (d.grass && G.party.length && encCooldown <= 0 && rnd() < 0.12) {
    encCooldown = 4;
    run(async () => { await randomAlert('grass'); });
  }
}
async function warp(map, x, y, dir) {
  if (!UI.turbo) for (let i = 1; i <= 6; i++) { fade = i / 6; await sleep(25); }
  G.map = map; G.x = x; G.y = y; G.dir = dir || G.dir;
  if (!UI.turbo) for (let i = 5; i >= 0; i--) { fade = i / 6; await sleep(25); }
  fade = 0;
}
/* ---------- Shifts, days, briefing ---------- */
async function endShift(reason) {
  const body = '<p>Day ' + G.day + ' is over' + (reason === 'focus' ? ': your Focus ran out' : '') + '.</p>' +
    '<p>Alerts closed today: <b>' + G.m.today + '</b>. Queue left overnight: <b>' + G.queue + '</b>.</p>' +
    (G.f.overnight ? '<p>An unfinished alert waited overnight; its dwell grew.</p>' : '');
  await UI.openModal('End of shift', body, [{label: 'Go home', meta: {good: true}}], {closable: false});
  if (G.f.overnight) { bumpUptime(-0.01); G.rep -= 1; G.f.overnight = false; }
  G.day++; G.m.today = 0; G.focus = G.focusMax;
  await briefing();
  await surfaceMissed(false);
}
async function briefing() {
  const L = typeof briefList === 'function' ? briefList() : BRIEFS;
  const a = L[(G.day * 2) % L.length], b = L[(G.day * 2 + 1) % L.length];
  const body = '<p>Morning briefing, Day ' + G.day + '. Two items from the threat-intel feed:</p>' +
    '<ol><li>' + esc(a.text) + '</li><li>' + esc(b.text) + '</li></ol>' +
    '<p>Act on one and that threat’s odds drop by half for a week (game).</p>';
  const i = await UI.openModal('Morning briefing', body, [
    {label: a.act, meta: {good: true}}, {label: b.act}, {label: 'Note both, act on neither'}], {closable: false});
  touchCSF('Identify');
  if (i === 0 || i === 1) { const it = i === 0 ? a : b; G.brief[it.t] = G.day + 6; toast(THREATS[it.t].name + ' odds halved this week'); }
}

/* ---------- Alerts ---------- */
// Threat for an alert. Only malicious alerts use the entry-route weights (MAL_WEIGHTS, game) and the
// briefing / Key Badge halving; false-positive and benign alerts pick a rule evenly (edition hooks still apply).
function alertThreatWeights(kind) {
  return MAL_WEIGHTS.map(x => {
    let w = kind === 'mal' ? x.w : 10;
    if (kind === 'mal' && G.brief[x.t] && G.brief[x.t] >= G.day) w *= 0.5;
    if (kind === 'mal' && G.badge && x.t === 'sprayer') w *= 0.5;
    if (typeof alertWeight === 'function') w = alertWeight(x.t, w);
    return {t: x.t, w: w};
  });
}
function genAlert(forceKind) {
  const kind = forceKind || weighted([{k: 'fp', w: G.fpWeight}, {k: 'benign', w: 30}, {k: 'mal', w: 20}]).k;
  const wts = alertThreatWeights(kind);
  const t = weighted(wts).t;
  const th = THREATS[t], tpl = ALERTS[t], v = tpl[kind];
  const chain = ALERT_CHAINS[t];
  const spec = {
    kind: kind, threat: t, tech: th.tech, tags: th.tags, story: false, group: 'a',
    title: tpl.rule, host: (typeof alertHost === 'function' && alertHost()) || pick(HOSTS) + ' · Front Desk',
    enemy: kind === 'mal' ? {spr: th.spr, pal: th.pal} : kind === 'fp' ? {spr: 'noise', pal: 'noise'} : {spr: 'player', pal: 'staffer'},
    clues: v.clues, truth: v.truth, resp: tpl.mal.resp,
    rate: kind === 'mal' ? 12 + Math.floor(rnd() * 5) : 8,
    chain: [{at: 40, text: chain[0]}, {at: 75, text: chain[1]}]
  };
  if (typeof alertDecorate === 'function') alertDecorate(spec);
  return spec;
}
async function randomAlert(src) {
  if (!G.party.length) { await say('No tool on your console yet. Talk to Rae.'); return; }
  if (G.focus <= 0) { await say('You’re out of Focus. End your shift at your desk.'); return; }
  const spec = genAlert();
  await doBattle(spec);
}
async function openQueue() {
  if (!G.party.length) { await say('No tool on your console yet. Talk to Rae.'); return; }
  if (G.queue <= 0) { await say('Alert queue: empty. New alerts arrive as the district works.'); return; }
  if (G.focus <= 0) { await say('You’re out of Focus. End your shift at your desk.'); return; }
  G.queue--;
  await doBattle(genAlert());
}

/* ---------- Battle ---------- */
function eff(spec) {
  const C = CLASSES[TOOLS[tool().id].cls];
  const tac = TECH[spec.tech].tactic, tags = spec.tags || [];
  if ((C.weakTags || []).some(t => tags.includes(t))) return 0.5;
  let strong = tac.some(t => C.strong.includes(t));
  if (C.needsLogs && !G.f.logs) strong = false;
  if ((C.strongTags || []).some(t => tags.includes(t))) strong = true;
  return strong ? 2 : 1;
}
function power() { const t = tool(); return (1 + 0.08 * (t.lvl - 3)) * (t.tuned ? 1.25 : 1); }
function effLabel(m) { return m >= 2 ? 'strong ×2' : m <= 0.5 ? 'weak ×0.5' : ''; }
function bhud() {
  const card = document.getElementById('bcard'), tp = document.getElementById('btool');
  if (!B) { card.classList.remove('show'); tp.classList.remove('show'); return; }
  const s = B.spec, t = tool();
  card.innerHTML = '<div class="bt">ALERT · ' + esc(s.title) + '</div><div class="bs">' + esc(s.host) + '</div>' +
    bar('Evidence', B.ev, '#2f74b5') + bar('Dwell', B.dwell, '#b8432f');
  tp.innerHTML = '<div class="bt">' + esc(toolName(t).toUpperCase()) + ' · Lv ' + t.lvl + '</div><div class="bs">' + CLASSES[TOOLS[t.id].cls].label + ' · ' + TOOLS[t.id].sub + '</div>' +
    bar('Focus', G.focus / G.focusMax * 100, '#5aa64b', G.focus + '/' + G.focusMax);
  card.classList.add('show'); tp.classList.add('show');
}
function bar(label, pct, color, txt) {
  return '<div class="bar"><span class="bl">' + label + '</span><span class="bo"><span class="bi" style="width:' + clamp(pct, 0, 100).toFixed(0) + '%;background:' + color + '"></span></span>' + (txt ? '<span class="bn">' + txt + '</span>' : '<span class="bn">' + Math.round(clamp(pct, 0, 100)) + '</span>') + '</div>';
}
async function fightStory(spec, retryMsg) {
  while (true) {
    G.focus = G.focusMax;
    const r = await doBattle(Object.assign({}, spec));
    if (r === 'win') return;
    await say(retryMsg);
  }
}
async function doBattle(spec) {
  B = {spec: spec, ev: spec.ev0 || 0, dwell: spec.dwell0 || 0, clue: 0, disrupt: 0, t0: performance.now(), acked: false, revealed: false, chainI: 0};
  UI.showPanel(true);
  bhud();
  G.focus = Math.max(0, G.focus - 1);
  let result = null;
  try {
    await say((spec.story ? 'INCIDENT! ' : 'ALERT! ') + spec.title + '. (' + spec.host + ')');
    while (result === null) {
      bhud();
      const t = tool();
      const m = eff(spec);
      const items = TOOLS[t.id].abil.map(k => {
        const a = ABIL[k];
        return {label: a.name + ' (' + a.cost + ')', note: (a.type === 'inv' ? 'investigate' : 'contain') + (effLabel(m) ? ' · ' + effLabel(m) : ''),
          disabled: a.cost > G.focus, meta: {kind: 'ability', key: k, type: a.type, cost: a.cost, eff: m, disrupt: a.disrupt || 0}};
      });
      items.push({label: 'Close alert', note: 'verdict + response', meta: {kind: 'close'}});
      items.push({label: 'Switch tool', disabled: G.party.length < 2, meta: {kind: 'switch'}});
      if (!spec.story) items.push({label: G.rank === 'Intern' ? 'Ask Rae (escalate)' : 'Escalate to Tier 2', note: 'bring evidence', meta: {kind: 'escalate'}});
      const lastClue = B.clue > 0 ? 'Latest: ' + spec.clues[B.clue - 1] : 'What do you check first?';
      const i = await choose(lastClue, items, {cols: 2});
      const meta = items[i].meta;
      if (!B.acked && meta.kind !== 'switch') ackNow();
      if (meta.kind === 'ability') { await useAbility(meta.key, m); }
      else if (meta.kind === 'switch') {
        const opts = G.party.map((p, j) => ({label: toolName(p) + ' Lv ' + p.lvl, disabled: j === G.active, meta: {idx: j}})).concat([{label: 'Back'}]);
        const j = await choose('Switch to which tool? (Takes a moment: the attacker gets a step.)', opts, {cancel: true});
        if (j < 0 || j >= G.party.length) continue;
        G.active = j; bhud();
        await say(toolName(tool()) + ' takes over.');
      } else if (meta.kind === 'close') {
        const r = await closeFlow(); if (r === 'back') continue;
        if (r) { result = r; break; }
      } else if (meta.kind === 'escalate') {
        result = await escalate(); break;
      }
      // the clock / attacker moves
      const r2 = await attackerStep(); if (r2) { result = r2; break; }
      if (G.focus <= 0) {
        await say('Your Focus is spent. The shift ends; this alert waits in the queue overnight.');
        G.queue++; G.f.overnight = true; result = 'shift';
      }
    }
  } finally {
    B = null; bhud(); UI.showPanel(false);
  }
  track();
  if (result === 'shift') await endShift('focus');
  if (result !== 'shift' && !spec.story) await evolveCheck();
  return result;
}
function ackNow() {
  B.acked = true;
  const s = (performance.now() - B.t0) / 1000;
  G.m.ttaSum += Math.min(s, 120); G.m.ttaN++;
}
async function useAbility(k, m) {
  const a = ABIL[k], s = B.spec;
  G.focus -= a.cost;
  unlock('act', k);
  if (typeof onAbility === 'function') onAbility(k, B);
  shake = 300;
  if (a.type === 'inv') {
    let gain = a.ev * m * power();
    if (a.social && (s.tags || []).includes('voice')) gain *= 1.5;
    if (a.fpBonus && s.kind !== 'mal') gain *= 1.5;
    B.ev = clamp(B.ev + gain, 0, 100);
    bhud();
    if (B.clue < s.clues.length) { const c = s.clues[B.clue++]; await say(a.name + ': ' + c); }
    else await say(a.name + ': nothing new, but it confirms the picture. Evidence ' + Math.round(B.ev) + '.');
  } else {
    B.disrupt += a.disrupt || 0;
    B.ev = clamp(B.ev + (a.ev || 0), 0, 100);
    if (s.kind === 'mal') {
      B.dwell = clamp(B.dwell - a.dw * m * power(), 0, 100); bhud();
      await say(a.name + ': applied. The suspicious activity pauses; dwell pushed back.');
    } else {
      bhud();
      await say(a.name + ': applied.' + (a.disrupt ? ' Someone’s work is interrupted while it’s in place.' : ''));
    }
  }
}
async function attackerStep() {
  const s = B.spec;
  B.dwell = clamp(B.dwell + (s.rate || 8), 0, 100); bhud();
  if (s.kind === 'mal' && s.chain && B.chainI < s.chain.length && B.dwell >= s.chain[B.chainI].at) {
    const c = s.chain[B.chainI++];
    if (B.ev >= 25 || s.story) await say('Activity: ' + c.text);
  }
  if (B.dwell >= 100) {
    if (s.kind === 'mal') {
      await say('Dwell is full: the alert escalates without you and the attacker advances. Rae’s team takes over.');
      G.health[s.group] = Math.max(0, G.health[s.group] - 15); bumpUptime(-0.03); G.rep -= 3;
      return s.story ? 'lose' : 'escalated';
    }
    await say('Timed out. Tier 2 picked it up and closed it.');
    G.rep -= 2;
    return 'timeout';
  }
  return null;
}
async function closeFlow() {
  const s = B.spec;
  const v = await choose('Verdict?', [
    {label: 'False positive', note: 'the rule is wrong', meta: {verdict: 'fp'}},
    {label: 'Benign', note: 'real, but expected', meta: {verdict: 'benign'}},
    {label: 'Malicious', note: 'an attack', meta: {verdict: 'mal'}},
    {label: 'Back', meta: {back: true}}], {cancel: true});
  if (v < 0 || v === 3) return 'back';
  const verdict = ['fp', 'benign', 'mal'][v];
  let resp;
  if (verdict === 'fp') resp = [{label: 'Close and file a tuning request for the noisy rule', good: true, tune: true}, {label: 'Close as false positive', good: true}];
  else if (verdict === 'benign') resp = [{label: 'Close and note why it’s expected', good: true}, {label: 'Close', good: true}];
  else resp = s.resp;
  const ri = await choose('Response?', resp.map(r => ({label: r.label, meta: {good: !!r.good}})).concat([{label: 'Back', meta: {back: true}}]), {cancel: true});
  if (ri < 0 || ri === resp.length) return 'back';
  const r = resp[ri];
  const correct = verdict === s.kind;
  if (s.story) {
    if (!correct) { await say('Rae: Not that verdict. Look at the evidence again.'); return null; }
    if (!r.good) { await say('Rae: Right verdict, wrong response.' + (r.why ? ' ' + r.why : ' Think about what actually stops this attacker.')); if (r.disrupt) { bumpUptime(-0.01 * r.disrupt); } return null; }
  }
  // scoring
  G.m.closed++; G.m.today++; G.m.judged++;
  if (B.ev >= 40) G.m.evOk = (G.m.evOk || 0) + 1;
  B.revealed = correct || s.kind !== 'mal';
  const fresh = unlock('tech', s.tech);
  touchCSF('Detect');
  let xp = 10 + Math.floor(B.ev / 10);
  let msg = '';
  if (correct) {
    G.m.correctShown++;
    msg = 'Correct. ' + s.truth;
    if (s.kind === 'mal') {
      xp += 10; touchCSF('Respond');
      if (!r.good) { xp = Math.floor(xp / 2); msg += r.why ? ' Right call, weak response: ' + r.why : ' Right call, heavy-handed response.'; }
      if (r.disrupt) { G.rep -= 2 * r.disrupt; bumpUptime(-0.01 * r.disrupt); }
    }
    if (verdict === 'fp' && r.tune) { G.fpWeight = Math.max(25, G.fpWeight - 4); msg += ' Tuning request accepted: fewer false positives from now on.'; }
  } else if (s.kind === 'mal') {
    // a missed attack: nobody knows yet
    G.m.correctShown++; G.m.missed++;
    msg = 'Closed.'; xp = 4;
  } else {
    msg = 'Rae reviewed it: ' + s.truth;
    xp = 3; if (verdict === 'mal') G.rep -= 2;
  }
  if (s.kind !== 'mal' && B.disrupt > 0) {
    G.rep -= 3 * B.disrupt; bumpUptime(-0.01 * B.disrupt); G.m.overreact++;
    msg += ' But you disrupted people’s work for an alert that wasn’t an attack: reputation and uptime drop.';
  }
  if (s.kind === 'fp') { G.focus = Math.max(0, G.focus - 2); msg += ' (False positives drain Focus: −2.)'; }
  await say(msg);
  if (correct && s.kind === 'mal' && r.good && !s.story) await scopeQuestion();
  if (typeof onAlertClosed === 'function') await onAlertClosed(s, verdict, correct, r);
  await say('ATT&CK: the rule maps to ' + s.tech + ' ' + TECH[s.tech].name + ' (' + TECH[s.tech].tactic.join(', ') + ').' + (fresh ? ' Added to the Field Manual.' : ''));
  await gainXP(xp + (s.story ? 20 : 0));
  return s.story ? 'win' : 'closed';
}
// Contain -> scope -> recover: one question after a correct malicious close. Every answer is a fair next step.
async function scopeQuestion() {
  const opts = [
    {label: 'What it touched', note: 'data, hosts, mailboxes', meta: {good: true}, reply: 'Good: list what the attacker reached (files, hosts, mailboxes) before you call it closed.'},
    {label: 'Access it added', note: 'accounts, MFA devices, sessions', meta: {good: true}, reply: 'Good: new accounts, rogue MFA devices and live sessions are how attackers walk back in.'},
    {label: 'What it left behind', note: 'persistence on the host', meta: {good: true}, reply: 'Good: scheduled tasks, new services and startup entries can outlive the fix.'}];
  const i = await choose('Contained. What do you check next?', opts, {cols: 1});
  const o = opts[Math.max(0, i)];
  const fresh = unlock('act', 'scope');
  await say(o.reply + ' Contain, then scope, then recover.' + (fresh ? ' (Field Manual: Scope after containment.)' : ''));
}
// Escalation is judged on evidence: a real attack sent up with Evidence under 40 is not a good escalation.
async function escalate() {
  const s = B.spec, intern = G.rank === 'Intern', to = intern ? 'Rae' : 'Tier 2';
  G.m.esc++; G.m.closed++; G.m.today++; G.m.judged++; B.revealed = true;
  if (B.ev >= 40) G.m.evOk = (G.m.evOk || 0) + 1;
  unlock('tech', s.tech);
  if (s.kind === 'mal') {
    G.m.correctShown++; touchCSF('Respond');
    if (B.ev < 40) {
      await say(to + ' confirms it’s real: ' + s.truth + ' But you sent it up with almost no evidence (' + Math.round(B.ev) + '). Next time, gather some first: say what you saw and why it matters.');
      await gainXP(8); return 'closed';
    }
    G.m.escOk++;
    await say('Escalated with evidence (' + Math.round(B.ev) + '). ' + to + ' confirms: ' + s.truth + ' Good escalation.');
    await gainXP(20);
  } else {
    G.rep -= 2;
    await say(to + ' looked and found nothing malicious: ' + s.truth + ' Escalations cost their time; bring evidence.');
    await gainXP(3);
  }
  return 'closed';
}
async function gainXP(n) {
  const t = tool(); if (!t) return;
  t.xp += n;
  let ups = 0;
  while (t.xp >= 20 * t.lvl) { t.xp -= 20 * t.lvl; t.lvl++; ups++; }
  if (ups) await say(toolName(t) + ' reached Lv ' + t.lvl + '! (+' + n + ' XP)');
}

/* ---------- Menus ---------- */
function scorecardHtml() {
  const v = metricVals();
  const fmt = (d, x) => x === null || x === undefined ? '—' : (d.k === 'uptime' ? x.toFixed(2) : x) + d.unit;
  const rows = METRICS.filter(d => !d.when || d.when()).map(d => {
    const tr = G.track[d.k] || {};
    const tgt = G.targets[d.k];
    const tgtS = (d.k === 'tta' || d.lower ? '≤ ' : '≥ ') + (d.k === 'uptime' ? tgt.toFixed(1) : tgt) + d.unit;
    const na = d.tier1 && G.rank === 'Intern';
    return '<tr><td>' + d.label + (na ? ' <small>(Tier 1)</small>' : '') + '</td><td><b>' + fmt(d, v[d.k]) + '</b></td><td>' + fmt(d, tr.best) + '</td><td>' + fmt(d, tr.worst) + '</td><td>' + tgtS + '</td></tr>';
  }).join('');
  return '<table class="sc"><tr><th>Metric</th><th>Now</th><th>Best</th><th>Worst</th><th>Target</th></tr>' + rows + '</table>' +
    (G.f.directive ? '<p class="dir">Directive: time-to-acknowledge target cut from 20 s to 15 s.</p>' : '') +
    (typeof editionScoreHtml === 'function' ? editionScoreHtml() : '') +
    '<p>Rank <b>' + G.rank + '</b> · Day ' + G.day + ' · Reputation ' + G.rep + ' · Badge: ' + (G.badge ? 'Key Badge' : 'none') + '</p>' +
    '<p>Buildings: ' + Object.keys(GROUPS).map(g => GROUPS[g].name + ' ' + (groupFixed(g) ? 'lit' : 'dark') + ' (' + G.health[g] + '%)').join(' · ') + '</p>' +
    '<p>Ticking: events ingested <b>' + G.m.events.toLocaleString('en-US') + '</b> · queue <b>' + G.queue + '</b> · auto-closed <b>' + G.m.autoClosed + '</b>' + (G.f.autoUnlocked ? ' · automation ' + (G.auto ? 'ON' : 'off') : '') + '</p>' +
    '<p class="small">Uptime, reputation and building health are game models (game). Objective: ' + esc(objective().text) + '</p>';
}
function fmEntries() {
  const out = [];
  for (const id in TECH) out.push({cat: 'ATT&CK techniques', key: 'tech:' + id, name: id + ' ' + TECH[id].name, desc: TECH[id].desc + ' Tactic: ' + TECH[id].tactic.join(', ') + '.'});
  for (const k in ABIL) out.push({cat: 'Defensive actions (D3FEND-style)', key: 'act:' + k, name: ABIL[k].name, desc: ABIL[k].desc});
  for (const k in EXTRA_ACTIONS) out.push({cat: 'Defensive actions (D3FEND-style)', key: 'act:' + k, name: EXTRA_ACTIONS[k].name, desc: EXTRA_ACTIONS[k].desc});
  for (const k in CSF) out.push({cat: 'NIST CSF 2.0 functions', key: 'csf:' + k, name: k, desc: CSF[k]});
  for (const k in FACTS) out.push({cat: 'Facts', key: 'fact:' + k, name: FACTS[k].name, desc: FACTS[k].desc + ' Source: ' + FACTS[k].src + '.'});
  return out;
}
function fmUnlocked(e) { return e.key.startsWith('csf:') ? !!G.csf[e.key.slice(4)] : !!G.fm[e.key]; }
function fmPct() { const e = fmEntries(); return Math.round(e.filter(fmUnlocked).length / e.length * 100); }
function fmHtml() {
  const e = fmEntries(); let cat = '', h = '<p>' + fmPct() + '% complete. Descriptions are our own words; IDs are from MITRE ATT&amp;CK.</p>';
  for (const x of e) {
    if (x.cat !== cat) { cat = x.cat; h += '<h3>' + esc(cat) + '</h3>'; }
    h += fmUnlocked(x) ? '<div class="fm"><b>' + esc(x.name) + '</b><br>' + esc(x.desc) + '</div>' : '<div class="fm lock">??? (not met yet)</div>';
  }
  h += qtFmHtml();
  h += '<h3>Game rules (invented)</h3>' + GAME_NOTES.map(n => '<div class="fm">' + esc(n) + '</div>').join('');
  return h;
}
function toolsHtml() {
  return G.party.map((t, i) => {
    const T = TOOLS[t.id];
    return '<div class="fm"><b>' + esc(toolName(t)) + '</b> · ' + CLASSES[T.cls].label + ' · ' + T.sub + ' · Lv ' + t.lvl + ' (' + t.xp + '/' + (20 * t.lvl) + ' XP)' + (i === G.active ? ' · <i>active</i>' : '') +
      '<br>' + esc(T.blurb) + '<br><small>Strong vs: ' + (CLASSES[T.cls].strongLabel || CLASSES[T.cls].strong.join(', ')) + (T.cls === 'logging' ? ' (with logging on)' : '') + '</small><br><small>' + T.abil.map(k => ABIL[k].name + ' (' + ABIL[k].cost + ')').join(' · ') + '</small></div>';
  }).join('') + '<p>Tuning Guide: ' + (G.items.guide ? '1 (use on a Lv 5+ tool)' : 'none') + '</p>';
}
function creditsHtml() {
  return '<p><b>UPTIME</b>, ' + esc(EDITION.creditsName) + '. Original game: story, characters, tools, art and rules are original.</p>' +
    '<p>Build <b>' + BUILD_ID + '</b> · built ' + BUILD_TS + '</p>' +
    '<h3>Frameworks</h3><p>MITRE ATT&amp;CK® technique IDs and names (checked against ATT&amp;CK v20.0, October 2026). © 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.</p>' +
    '<p>MITRE ATT&amp;CK® and ATT&amp;CK® are registered trademarks of The MITRE Corporation.</p>' +
    '<p>Defensive actions are written in our own words in the style of MITRE D3FEND. Function names are from the NIST Cybersecurity Framework (CSF) 2.0.</p>' +
    '<h3>ATT&amp;CK licence (MITRE Terms of Use)</h3>' +
    '<p class="small"><b>License.</b> The MITRE Corporation (MITRE) hereby grants you a non-exclusive, royalty-free license to use ATT&amp;CK® for research, development, and commercial purposes. Any copy you make for such purposes is authorized provided that you reproduce MITRE\'s copyright designation and this license in any such copy.</p>' +
    '<p class="small">"© 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation."</p>' +
    '<p class="small"><b>Disclaimers.</b> MITRE does not claim ATT&amp;CK enumerates all possibilities for the types of actions and behaviors documented as part of its adversary model and framework of techniques. Using the information contained within ATT&amp;CK to address or cover full categories of techniques will not guarantee full defensive coverage as there may be undisclosed techniques or variations on existing techniques not documented by ATT&amp;CK.</p>' +
    '<p class="small">ALL DOCUMENTS AND THE INFORMATION CONTAINED THEREIN ARE PROVIDED ON AN "AS IS" BASIS AND THE CONTRIBUTOR, THE ORGANIZATION HE/SHE REPRESENTS OR IS SPONSORED BY (IF ANY), THE MITRE CORPORATION, ITS BOARD OF TRUSTEES, OFFICERS, AGENTS, AND EMPLOYEES, DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION THEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</p>' +
    '<h3>Facts used</h3><p>' + esc(EDITION.creditsFacts) + '</p>' +
    '<h3>Inspiration only</h3><p>Genre inspiration from classic handheld monster-collecting RPGs; the 1990s CGI series set inside a computer; incident-response card games such as Backdoors &amp; Breaches by Black Hills Information Security; and the National Cyber League / Cyber Skyline. No names, art, cards or other material from those works are used.</p>' +
    '<p>Uptime is an independent learning game. It is not affiliated with, sponsored by or endorsed by Nintendo, The Pokémon Company, Mainframe Entertainment or any other rights holder of ReBoot, Black Hills Information Security, the National Cyber League, Cyber Skyline, or The MITRE Corporation. Their names and marks belong to their owners.</p>' +
    (EDITION.creditsInspiration ? '<p>' + esc(EDITION.creditsInspiration) + '</p>' : '') +
    '<p class="small">Everything invented for play is labelled (game) in the Field Manual. No network requests; saves stay in this browser.</p>';
}
async function startMenu() {
  while (true) {
    const items = [
      {label: 'Scorecard', meta: {k: 'score'}}, {label: 'Field Manual (' + fmPct() + '%)', meta: {k: 'fm'}},
      {label: 'Tools', meta: {k: 'tools'}}, {label: 'Save', meta: {k: 'save'}},
      {label: 'Export save code', meta: {k: 'export'}}, {label: 'Import save code', meta: {k: 'import'}}];
    if (G.f.autoUnlocked) items.push({label: 'Automation: ' + (G.auto ? 'ON' : 'off'), meta: {k: 'auto'}});
    items.push({label: 'Credits', meta: {k: 'credits'}}, {label: 'Close', meta: {k: 'close'}});
    const body = '<p><b>' + esc(objective().text) + '</b></p><p class="small">Day ' + G.day + ' · ' + G.rank + ' · Focus ' + G.focus + '/' + G.focusMax + ' · played ' + fmtTime(G.playMs) + '</p>' +
      '<p class="small">Controls: arrows / D-pad move · Z = A (talk, confirm) · X = B (back) · Enter = Start (this menu) · Shift = Select (alert queue)</p><p class="small">Build ' + BUILD_ID + ' · ' + BUILD_TS + '</p>';
    const i = await UI.openModal('Menu', body, items);
    if (i < 0) return;
    const k = items[i].meta.k;
    if (k === 'close') return;
    if (k === 'score') await UI.openModal('Scorecard', scorecardHtml(), [{label: 'Back'}]);
    if (k === 'fm') await UI.openModal('Field Manual', fmHtml(), [{label: 'Back'}]);
    if (k === 'tools') await toolsMenu();
    if (k === 'save') { const ok = storeSet(encodeSave(G)); await UI.openModal('Save', ok ? '<p>Saved in this browser.</p>' : '<p>This browser blocked storage. Use Export save code instead.</p>', [{label: 'OK'}]); }
    if (k === 'export') await exportSave();
    if (k === 'import') { if (await importFlow()) return; }
    if (k === 'auto') G.auto = !G.auto;
    if (k === 'credits') await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]);
  }
}
async function toolsMenu() {
  const items = G.party.map((t, i) => ({label: 'Make ' + toolName(t) + ' active', disabled: i === G.active, meta: {i: i}}));
  const canTune = G.items.guide ? G.party.filter(t => t.lvl >= 5 && !t.tuned) : [];
  canTune.forEach(t => items.push({label: 'Tune ' + TOOLS[t.id].name + ' (uses Tuning Guide)', meta: {tune: t.id}}));
  items.push({label: 'Back', meta: {}});
  const i = await UI.openModal('Tools', toolsHtml(), items);
  if (i < 0) return;
  const m = items[i].meta;
  if (m.i !== undefined) G.active = m.i;
  if (m.tune) { const t = G.party.find(p => p.id === m.tune); t.tuned = true; G.items.guide = 0; await UI.openModal('Tuned', '<p>' + esc(TOOLS[t.id].name) + ' was Tuned. Power ×1.25.</p>', [{label: 'OK'}]); }
}
async function exportSave() {
  const code = encodeSave(G);
  await UI.openModal('Export save code', '<p>Copy this code somewhere safe. Import it on any device.</p><textarea id="codebox" readonly rows="6">' + esc(code) + '</textarea>', [{label: 'Done'}]);
}
function fmtTime(ms) { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }

/* ---------- Title ---------- */
async function titleScreen() {
  titleOpen = true;
  const has = !!storeGet();
  const items = [];
  if (has) items.push({label: 'Continue', meta: {k: 'cont'}});
  items.push({label: 'New game', meta: {k: 'new'}}, {label: 'Import save code', meta: {k: 'import'}}, {label: 'Credits', meta: {k: 'credits'}});
  const body = '<div class="title"><div class="logo">UPTIME</div><div>' + esc(EDITION.title) + '</div></div>' +
    '<p>' + esc(EDITION.blurb) + '</p>' +
    '<p class="small">Move: arrows / D-pad · A: Z · B: X · Start: Enter · Select: Shift (alert queue)</p>' +
    '<p class="small">Build ' + BUILD_ID + ' · ' + BUILD_TS + '</p>';
  const i = await UI.openModal('', body, items, {closable: false, cls: 'titlebox'});
  const k = items[i].meta.k;
  titleOpen = false;
  if (k === 'cont') {
    try { G = decodeSave(storeGet()); fixupState(); qtAdopt(); started = true; hudUpdate(); }
    catch (e) { await UI.openModal('Continue', '<p>That save could not be read: ' + esc(e.message) + '</p>', [{label: 'OK'}]); return titleScreen(); }
    return;
  }
  if (k === 'credits') { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); return titleScreen(); }
  if (k === 'import') { const ok = await importFlow(); if (!ok) return titleScreen(); return; }
  newGame();
}
function fixupState() {
  const base = newState(G.seed || 1);
  for (const k in base) if (G[k] === undefined) G[k] = base[k];
  for (const k in base.m) if (G.m[k] === undefined) G.m[k] = base.m[k];
  for (const k in base.targets) if (G.targets[k] === undefined) G.targets[k] = base.targets[k];
  if (G.targets.esc === 1) G.targets.esc = base.targets.esc; // older saves: the escalation target was a count
  if (!G.qt) G.qt = Series.blankQT();
}
let seedOverride = null;
function newGame() {
  const seed = seedOverride !== null ? seedOverride : (Date.now() >>> 0);
  rng = makeRng(seed);
  G = newState(seed); started = true;
  qtMirror();
  track(); hudUpdate();
  run(introScript);
}
async function importFlow() {
  const i = await UI.openModal('Import save code', '<p>Paste a save code, then choose Load.</p><textarea id="codebox" rows="6" placeholder="UPT1.…"></textarea>', [{label: 'Load'}, {label: 'Cancel'}]);
  // the textarea is removed when the modal closes, so read it on click (see modal hook below)
  if (i !== 0) return false;
  try {
    G = decodeSave(lastImportText); fixupState(); qtAdopt(); started = true; storeSet(encodeSave(G)); hudUpdate();
    await UI.openModal('Import', '<p>Save loaded. Day ' + G.day + ', ' + esc(G.rank) + '.</p>', [{label: 'OK'}]);
    return true;
  } catch (e) {
    await UI.openModal('Import', '<p>' + esc(e.message) + '</p>', [{label: 'OK'}]);
    return false;
  }
}
let lastImportText = '';
document.addEventListener('input', e => { if (e.target && e.target.id === 'codebox') lastImportText = e.target.value; }, true);

/* ---------- Main loop ---------- */
function frame(t) {
  const dt = Math.min(50, t - (lastT || t)); lastT = t;
  UI.tick(dt);
  if (toastT > 0) { toastT -= dt; if (toastT <= 0) document.getElementById('toast').classList.remove('show'); }
  if (shake > 0) shake -= dt;
  if (G && started) {
    if (!titleOpen) G.playMs += dt;
    if (moving) {
      moving.t += dt / (UI.turbo ? 45 : 140);
      if (moving.t >= 1) {
        const mv = moving; stepDone();
        if (!busy && !UI.mode && !UI.modal && !moving) {
          const held = ['up', 'down', 'left', 'right'].find(d => Input.held[d]);
          const tap = Input.taps.find(b => DIRS[b]);
          Input.taps = Input.taps.filter(b => !DIRS[b]);
          const nd = tap || held;
          if (nd) tryMove(nd);
        }
      }
    } else if (!busy && !UI.mode && !UI.modal) {
      const tap = Input.taps.find(b => DIRS[b]);
      Input.taps = Input.taps.filter(b => !DIRS[b]);
      const held = ['up', 'down', 'left', 'right'].find(d => Input.held[d]);
      const nd = tap || held;
      if (nd) tryMove(nd);
    } else { Input.taps = Input.taps.filter(b => !DIRS[b]); }
    if (B) drawBattle(Screen.ctx); else drawWorld(Screen.ctx);
    hudUpdate();
  } else {
    drawTitleBg(Screen.ctx, t);
  }
  requestAnimationFrame(frame);
}
function drawTitleBg(ctx, t) {
  for (let y = 0; y < 12; y++) for (let x = 0; x < 21; x++) {
    const k = (x + y) % 7 === 0 ? 'L' : (x * 3 + y) % 5 === 0 ? 'K' : 'G';
    ctx.drawImage(sprite(S[k] ? k : 'G', k), x * 16 - (Math.floor(t / 60) % 16), y * 16);
  }
}

/* ---------- Button dispatch ---------- */
function onButton(b) {
  if (UI.modal || UI.mode) { UI.handle(b); Input.taps = []; return; }
  if (!G || !started || busy || moving) return;
  if (b === 'a') interact();
  else if (b === 'start') run(startMenu);
  else if (b === 'select') run(openQueue);
}

/* ---------- Debug / test hooks (no effect on play) ---------- */
window.__UPTIME = {
  peek() {
    let ui = null;
    if (UI.modal) ui = {type: 'modal', options: UI.modal.items.map(o => ({label: o.label, meta: o.meta || null, disabled: !!o.disabled, done: !!o.done})), cursor: UI.modal.cursor, multi: UI.modal.multi, sel: [...UI.modal.sel]};
    else if (UI.mode === 'say') ui = {type: 'say', typing: UI.typing, text: UI.full};
    else if (UI.mode === 'choice') ui = {type: 'choice', options: UI.choice.items.map(o => ({label: o.label, meta: o.meta || null, disabled: !!o.disabled})), cursor: UI.choice.cursor, cols: UI.choice.cols, text: UI.text.textContent};
    if (!G) return {started: false, ui: ui};
    const solid = mapRows(G.map).map((r, y) => r.split('').map((c, x) => blocked(G.map, x, y) ? 1 : 0));
    return {
      started: started, map: G.map, x: G.x, y: G.y, dir: G.dir, moving: !!moving, busy: busy, day: G.day, focus: G.focus,
      f: G.f, rank: G.rank, ui: ui, objective: objective(), solid: solid, doors: MAPS[G.map].doors,
      battle: B ? {kind: B.spec.kind, ev: B.ev, dwell: B.dwell, story: !!B.spec.story, tech: B.spec.tech} : null,
      party: G.party, metrics: metricVals(), m: G.m, fm: fmPct(), queue: G.queue, mfa: G.mfaSet.length, summary: !!G.f.summaryShown,
      qt: Series.qt(),
      extra: typeof peekExtra === 'function' ? peekExtra() : null
    };
  },
  turbo(on) { UI.turbo = !!on; },
  seed(n) { seedOverride = n >>> 0; },
  state() { return G; },
  series() { return Series.load(); }
};

/* ---------- Boot ---------- */
function boot() {
  const touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
  document.body.classList.toggle('touch', !!touch);
  Series.load();
  Screen.init(); UI.init(); Input.init();
  Input.handler = onButton;
  document.querySelectorAll('.buildid').forEach(e => e.textContent = BUILD_ID + ' · ' + BUILD_TS);
  requestAnimationFrame(frame);
  titleScreen();
}
window.addEventListener('DOMContentLoaded', boot);
