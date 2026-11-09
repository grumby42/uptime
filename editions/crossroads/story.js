/* ============================================================
   UPTIME · editions/crossroads/story.js
   Crossroads (edition 2): EDITION settings, state, the carry-over from Town
   Hall (read only: the Town Hall save is never written), the track (IR manager
   or principal DFIR consultant: chosen once, with a two-step confirmation, and
   locked per save; New Game+ after the edition ending opens the other one), the
   engine hooks, the objective chain, and the prologue in the Town Hall war room
   (the on-call rota, analyst growth, the two offers). The Public Library is in
   library-*.js. Timeline: scratchpad crossroads-timeline.md.
   ============================================================ */
'use strict';

const EDITION = {
  id: 'crossroads',
  saveKey: 'uptime.crossroads.save',
  ownMetrics: true,           // the analyst scorecard is replaced by each track's own (EDITION_METRICS)
  noTools: true,              // no tool console: you lead, or you investigate evidence
  badgeFlags: ['lbBookmark', 'sdSlate', 'cnPulse'],
  title: 'Crossroads edition',
  blurb: 'A week after Town Hall, two offers: run the region’s incident response programme, or join the outside firm working the hardest cases. Choose once; the Public Library is first, then the School District and the Community Clinic.',
  creditsName: 'Crossroads edition',
  creditsFacts: 'Crossroads: MITRE ATT&CK content v20.1 (T1056.001, T1078, T1657; Quiet Thread T1021.001). NIST SP 800-86 (August 2006): collection, examination, analysis, reporting; chain of custody; message digests of original and copy. NIST FIPS 180-4, Secure Hash Standard (SHA-256). Microsoft Learn, event 4624 (logon type 10, RemoteInteractive). CISA Tabletop Exercise Packages and the CTEP After-Action Report / Improvement Plan template. NICE Framework (CISA NICCS task pages T1450, T1510, T1617; v2.2.0 summary of changes). American Library Association: State Privacy Laws Regarding Library Records; ALA Code of Ethics. Joint Cybersecurity Advisory AA24-038A (Volt Typhoon), the basis of the Quiet Thread. School District: ATT&CK v20.1 T1078, T1550.001 and T1657; Quiet Thread T1018; US Department of Education, Student Privacy Policy Office, “What is FERPA?”, and PTAC, Protecting Student Privacy While Using Online Educational Services (February 2014); CISA, Protecting Our Future: Partnering to Safeguard K–12 Organizations from Cybersecurity Threats (January 2023). Community Clinic: ATT&CK v20.1 T1486, T1566.001, T1219 and T1657; Quiet Thread T1083; HHS, Fact Sheet: Ransomware and HIPAA; HHS 405(d), Health Industry Cybersecurity Practices (HICP, 2023 edition).'
};
const TH_SAVE_KEY = 'uptime.slice1.save';   // Town Hall's save: read for the carry-over, never written
const CR_TRACK = {manager: {rank: 'IR manager', offer: 'the Mayor’s offer'}, dfir: {rank: 'Principal DFIR consultant', offer: 'Tallowmere’s offer'}};
const TH_BADGES = [['Key', g => g.badge], ['Seal', g => g.f && g.f.mrSeal], ['Shield', g => g.f && g.f.crShield], ['Lantern', g => g.f && g.f.mkLantern],
  ['Vault', g => g.f && g.f.rhVault], ['Beacon', g => g.f && g.f.bmBeacon], ['Crown', g => g.f && g.f.svCrown], ['Tide', g => g.f && g.f.wtTide], ['Charter', g => g.f && g.f.ccCharter]];

/* ---------- State ---------- */
function newState(seed) {
  return {
    v: 1, edition: 'crossroads', seed: seed, map: 'cwar', x: 9, y: 7, dir: 'up',
    day: 1, f: {}, party: [], active: 0, items: {guide: 0},
    focus: 50, focusMax: 50, rep: 50, uptime: 99.95,
    health: {}, rank: 'Security team lead', badge: false, track: {}, trackId: null, name: 'Lead',
    m: {closed: 0, judged: 0, correctShown: 0, evOk: 0, ttaSum: 0, ttaN: 0, esc: 0, escOk: 0, missed: 0, surfaced: 0, overreact: 0, autoClosed: 0, events: 0, today: 0},
    targets: {crExAct: 100, crActivate: 30, crGaps: 0, crTired: 0, crAar: 100, crBudget: 0, crNeeds: 100, crCorrected: 0, crCustody: 100, crCGaps: 0, crFirst: 30, crClients: 2},
    mfaSet: [], fm: {}, csf: {}, brief: {}, pcs: {}, dojo: [false, false, false],
    fpWeight: 50, queue: 0, steps: 0, auto: false, autoReview: false, playMs: 0,
    cr: {carry: null, rota: null, growth: null, ex: {run: 0, actions: 0, closed: 0}, activate: null, aar: null, cover: null,
      needs: {met: 0, total: 0}, corrected: 0, custody: null, first: null, drills: {}, reports: {}, board: null, boss: null, dojo: [false, false, false], status: null, sd: null, cn: null}
  };
}
// The engine owns G.track (best/worst per metric), so the career track lives in G.trackId (and G.f.crTrack).
function crTrack() { return G && G.trackId || null; }

/* ---------- Carry-over from Town Hall (read only) ---------- */
function crReadTownHall() {
  let raw = null; try { raw = localStorage.getItem(TH_SAVE_KEY); } catch (e) { raw = null; }
  if (!raw) return null;
  try { return decodeSave(raw); } catch (e) { return null; }
}
function crCarry() {
  const th = crReadTownHall(), ser = Series.load(), the = ser.editions['town-hall'] || {};
  if (th && th.qt) Series.merge(th.qt);   // the series record is shared; the Town Hall save itself is not touched
  const c = {from: th ? 'save' : (the.done ? 'series' : 'none'), rank: th ? th.rank : null, badges: th ? TH_BADGES.filter(([, t]) => t(th)).map(([n]) => n) : [],
    complete: !!((th && th.f && th.f.ccSummary) || the.editionComplete), name: th && typeof th.name === 'string' && th.name.trim() ? th.name.trim().slice(0, 24) : null,
    clues: Series.qt().cluesFound.length, charter: !!(th && th.f && th.f.ccCharter)};
  return c;
}
function crCarryHtml(c) {
  let h = '';
  if (c.from === 'none') h += '<p>No Town Hall save in this browser. You start as the town’s security team lead with a clean history (game).</p>';
  else {
    h += '<p>From your Town Hall ' + (c.from === 'save' ? 'save' : 'series record') + ': ' + (c.rank ? 'rank reached <b>' + esc(c.rank) + '</b>' : 'the edition marked done') + (c.complete ? ', the edition finished.' : '. The edition wasn’t finished there; Crossroads starts you as Security team lead anyway (game).') + '</p>';
    h += '<p>Badges, as history: <b>' + (c.badges.length ? c.badges.map(esc).join(' · ') : 'none recorded') + '</b>.</p>';
  }
  const lines = crQtPriorLines();
  h += '<p>The suspicion file: <b>' + c.clues + '</b> Unexplained note' + (c.clues === 1 ? '' : 's') + ' in this browser’s series record.</p>' + (lines.length ? '<ul>' + lines.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
    '<p class="small">Nothing here changes your Town Hall save; Crossroads keeps its own.</p>';
  return h;
}

/* ---------- Series record for this edition: the track, New Game+ ---------- */
function crSeries() { const s = Series.load(); return s.editions.crossroads || {}; }
function crLockedTrack() { const s = crSeries(); return s.track && !s.ngPlus ? s.track : null; }
// Granted by the edition ending (a later slice); tests call it directly.
function crGrantNgPlus() { Series.markEdition('crossroads', {ngPlus: true}); return crSeries(); }

/* ---------- Engine hooks ---------- */
function hudStatus() { return 'Day ' + G.day + ' · ' + G.rank + ' · Focus ' + G.focus + '/' + G.focusMax + (G.map === 'library' || G.map === 'lboard' ? ' · Library' : G.map === 'school' || G.map === 'sboard' ? ' · School District' : G.map === 'clinic' || G.map === 'cnboard' ? ' · Clinic' : ''); }
async function editionQueue() {
  const t = crTrack();
  await say(t === 'dfir' ? 'No alert queue on a consultant’s desk: your cases come to you through scoping letters. The Compact’s on-call leads work its queue.'
    : t === 'manager' ? 'The on-call queue: the Compact’s leads work it, and anything that needs you reaches you by phone. Your job is the rota, the exercises and the records.'
    : 'The team’s queue: the leads have it. Today is the rota and the people.');
}
function editionTile(d, ch, x, y) { if (typeof lbTile === 'function') d = lbTile(d, ch, x, y); if (typeof sdTile === 'function') d = sdTile(d, ch, x, y); if (typeof cnTile === 'function') d = cnTile(d, ch, x, y); return d; }
function surfaceMissed() { return Promise.resolve(); }   // no wild alerts here, so nothing can be missed
async function evolveCheck() {}
const crPct = (a, b) => b ? Math.round(a / b * 100) : null;
function editionMetricVals() {
  const c = G.cr || {}, r = c.rota ? c.rota.stats : null, sd = c.sd || {}, r2 = sd.rota ? sd.rota.stats : null, cn = c.cn || {};
  // Week 2 (the School District) adds its rota and the district's cover to the gaps and tired nights; the Clinic adds its
  // weekend plan's gaps. The budget line shows the latest cover forecast (the Clinic's weekend once it is set, game).
  return {
    crExAct: c.ex && c.ex.actions ? crPct(c.ex.closed, c.ex.actions) : null,
    crActivate: c.activate === null || c.activate === undefined ? null : c.activate,
    crGaps: r ? r.gaps + (c.cover && c.cover.gaps ? c.cover.gaps : 0) + (crTrack() === 'manager' && r2 ? r2.gaps + (sd.cover && sd.cover.gaps ? sd.cover.gaps : 0) : 0) + (crTrack() === 'manager' && cn.cover && cn.cover.gaps ? cn.cover.gaps : 0) : null,
    crTired: r ? r.tired.length + (crTrack() === 'manager' && r2 ? r2.tired.length : 0) : null,
    crAar: c.aar ? crPct(c.aar.onTime, c.aar.total) : null,
    crBudget: r ? (cn.cover && cn.cover.variance !== undefined ? cn.cover.variance : sd.cover && sd.cover.variance !== undefined ? sd.cover.variance : c.cover && c.cover.variance !== undefined ? c.cover.variance : r.variance) : null,
    crNeeds: c.needs && c.needs.total ? crPct(c.needs.met, c.needs.total) : null,
    crCorrected: crTrack() === 'dfir' ? c.corrected : null,
    crCustody: c.custody ? crPct(c.custody.complete, c.custody.items) : null,
    crCGaps: c.custody ? c.custody.gaps : null,
    crFirst: c.first === null || c.first === undefined ? null : c.first,
    crClients: crTrack() === 'dfir' && G.f.sdStores ? 3 : crTrack() === 'dfir' && G.f.lbStores ? 2 : null
  };
}
const crMgr = () => !!G && (crTrack() === 'manager' || !crTrack());
const crDfir = () => !!G && crTrack() === 'dfir';
const EDITION_METRICS = [
  {k: 'crExAct', label: 'Exercise actions closed', unit: '%', higher: true, when: () => crTrack() === 'manager'},
  {k: 'crActivate', label: 'Time to activate outside help (game min)', unit: ' min', higher: false, lower: true, when: () => crTrack() === 'manager'},
  {k: 'crGaps', label: 'Rota gaps (hours uncovered)', unit: ' h', higher: false, lower: true, when: crMgr},
  {k: 'crTired', label: 'Nights on call past two in a row', unit: '', higher: false, lower: true, when: crMgr},
  {k: 'crAar', label: 'AAR actions closed by their due date', unit: '%', higher: true, when: () => crTrack() === 'manager'},
  {k: 'crBudget', label: 'Overtime against budget', unit: '%', higher: false, lower: true, when: crMgr},
  {k: 'crNeeds', label: 'Findings with every needed source read', unit: '%', higher: true, when: crDfir},
  {k: 'crCorrected', label: 'Claims corrected after review', unit: '', higher: false, lower: true, when: crDfir},
  {k: 'crCustody', label: 'Evidence items with full custody', unit: '%', higher: true, when: crDfir},
  {k: 'crCGaps', label: 'Custody gaps', unit: '', higher: false, lower: true, when: crDfir},
  {k: 'crFirst', label: 'Time to first defensible finding (game h)', unit: ' h', higher: false, lower: true, when: crDfir},
  {k: 'crClients', label: 'Clients in parallel', unit: '', higher: true, when: crDfir}
];
function editionScorecard() {
  const v = metricVals();
  const fmt = (d, x) => x === null || x === undefined ? '—' : x + d.unit;
  const rows = METRICS.filter(d => !d.when || d.when()).map(d => {
    const tr = G.track[d.k] || {}, tgt = G.targets[d.k];
    return '<tr><td>' + d.label + '</td><td><b>' + fmt(d, v[d.k]) + '</b></td><td>' + fmt(d, tr.best) + '</td><td>' + fmt(d, tr.worst) + '</td><td>' + (d.lower ? '≤ ' : '≥ ') + tgt + d.unit + '</td></tr>';
  }).join('');
  const t = crTrack(), c = G.cr;
  return '<table class="sc score"><tr><th>Metric</th><th>Now</th><th>Best</th><th>Worst</th><th>Target</th></tr>' + rows + '</table>' +
    (typeof lbScoreHtml === 'function' ? lbScoreHtml() : '') + (typeof sdScoreHtml === 'function' ? sdScoreHtml() : '') + (typeof cnScoreHtml === 'function' ? cnScoreHtml() : '') +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Day ' + G.day + (t ? ' · track: ' + (t === 'manager' ? 'IR manager (the Compact)' : 'principal DFIR consultant (Tallowmere)') : ' · the offers come at 16:00') +
    ' · Bookmark Badge: ' + (G.f.lbBookmark ? 'yes' : 'not yet') + (G.f.sdMet ? ' · Slate Badge: ' + (G.f.sdSlate ? 'yes' : 'not yet') : '') + (G.f.cnMet ? ' · Pulse Badge: ' + (G.f.cnPulse ? 'yes' : 'not yet') : '') + '</p>' +
    (c && c.carry ? '<p class="small">Carried from Town Hall: ' + (c.carry.rank ? esc(c.carry.rank) : 'no save') + (c.carry.badges.length ? ' · badges ' + c.carry.badges.join(', ') : '') + ' · suspicion file ' + qtCount() + ' notes.</p>' : '') +
    '<p class="small">Every number here is a game model (game). Objective: ' + esc(objective().text) + '</p>';
}
function peekExtra() {
  // crSummary: the end of the edition so far (the Community Clinic's summary, slice 3); sdSummary and lbSummary: the
  // School District's and the Library's.
  return {track: crTrack(), crSummary: !!(G.f && G.f.cnSummary), sdSummary: !!(G.f && G.f.sdSummary), lbSummary: !!(G.f && G.f.lbSummary), cr: G.cr ? JSON.parse(JSON.stringify(G.cr)) : null, series: crSeries()};
}

/* ---------- Intro (new game) ---------- */
async function introScript() {
  const c = crCarry();
  G.cr.carry = c;
  if (c.name) G.name = c.name;
  if (c.charter) { G.focusMax = 52; G.focus = 52; }
  qtMirror();
  await say('Day 1, Monday, 09:00. Town Hall, the war room. Nine days after the night of the portal export.');
  await UI.openModal('What you carry from Town Hall', crCarryHtml(c), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  const i = await UI.openModal('The nameplate on the war room door', '<p>What should it say? Type it, then tap or click your choice. (Leave it blank to keep “' + esc(G.name) + '”.)</p><textarea id="codebox" rows="1" maxlength="24" placeholder="' + esc(G.name) + '"></textarea>',
    [{label: 'Keep “' + G.name + '”', meta: {good: true, k: 'keep'}}, {label: 'Use the name I typed', meta: {k: 'use'}}], {closable: false, nav: 'name-plate'});
  if (i === 1) { const n = String(lastImportText || '').replace(/[^\p{L}\p{N} .’'-]/gu, '').trim().slice(0, 24); if (n) G.name = n; }
  lastImportText = '';
  await say('Controls: move with the arrows or D-pad. A (Z) talks and confirms. B (X) goes back. Start (Enter) opens the menu: scorecard, Field Manual, save.');
  await say('Rae is at the team board, top left.');
  track();
}

/* ---------- Objective ---------- */
function objective() {
  const f = G.f, at = (text, map, x, y) => ({text: text, map: map, x: x, y: y});
  if (!f.crRota) return at('Talk to Rae at the team board: next week’s nights are uncovered.', 'cwar', 2, 2);
  if (!f.crMagda && !f.crGrowth) return at('Paz wants a word about the insurer’s timeline.', 'cwar', 13, 5);
  if (!f.crGrowth) return at('Paz wants a word about the insurer’s timeline.', 'cwar', 13, 5);
  if (!G.trackId) return at('16:00: the Mayor is on her way to the war room. The command table.', 'cwar', 7, 3);
  if (typeof lbObjective === 'function') { const o = lbObjective(); if (o && !o.done) return o; }
  if (typeof sdObjective === 'function') { const o = sdObjective(); if (o && !o.done) return o; }
  if (typeof cnObjective === 'function') { const o = cnObjective(); if (o) return o; }
  return {text: 'Community Clinic done. Next: Fire & EMS Dispatch.', done: true};
}

/* ---------- Triggers and interactions ---------- */
function triggers() { return (typeof lbTriggers === 'function' && lbTriggers()) || (typeof sdTriggers === 'function' && sdTriggers()) || (typeof cnTriggers === 'function' && cnTriggers()); }
function interact() {
  const [dx, dy] = DIRS[G.dir];
  const tx = G.x + dx, ty = G.y + dy;
  const npc = npcHere(G.map, tx, ty);
  if (npc) { run(() => talk(npc)); return; }
  const ch = tileChar(G.map, tx, ty);
  const door = doorAt(G.map, tx, ty);
  if (door && door.locked) { run(async () => { await say(door.locked); }); return; }
  if (typeof lbInteract === 'function' && lbInteract(ch, tx, ty)) return;
  if (typeof sdInteract === 'function' && sdInteract(ch, tx, ty)) return;
  if (typeof cnInteract === 'function' && cnInteract(ch, tx, ty)) return;
  if (G.map !== 'cwar' && G.map !== 'csquare') return;
  if (ch === 'µ') run(async () => { await say(G.cr.rota ? 'The team board: next week’s nights, a name on each, and the night post still advertised.' : 'The team board: next week’s nights, every one of them blank.'); });
  else if (ch === '¥') run(crCommandTable);
  else if (ch === 'Y') run(async () => { await say(G.trackId ? 'Your desk, cleared for whoever sits here next.' : 'Your desk: the team board on a screen, the plan on the wall behind it.'); });
  else if (ch === 'S') run(async () => { await say('THE TOWN SQUARE. North: Town Hall. South: the Public Library. East: the School District. West: the Community Clinic.'); });
}
async function talk(npc) {
  if (typeof lbTalk === 'function' && await lbTalk(npc)) return;
  if (typeof sdTalk === 'function' && await sdTalk(npc)) return;
  if (typeof cnTalk === 'function' && await cnTalk(npc)) return;
  const who = npc.name, f = G.f;
  switch (npc.id) {
    case 'raecr':
      if (!f.crRota) { await crRotaScript(); return; }
      if (!G.trackId) { await say('Tallowmere and I have been a week in the file. Nothing has changed on svc-print, and nothing will without a plan.', who); return; }
      await say(G.trackId === 'dfir' ? 'You’ll see the file from the other side now. Same rule: nothing changes on svc-print without a plan.' : 'You’ll get the firm’s reports. I’ll get your rota. Fair trade.', who);
      return;
    case 'pazcr':
      if (!f.crRota) { await say('Rae first: the rota. Then I’ve got a question for you.', who); return; }
      if (!f.crGrowth) { await crGrowthScript(); return; }
      await say(G.cr.growth === 'paz' ? 'The timeline’s on your desk with my notes. Read it as hard as you like.' : 'I’m on the portal’s admin path this week. Plenty to do.', who);
      return;
    case 'magdacr':
      await say(!f.crRota ? 'If the rota needs someone, I’m up at night anyway.' : (G.cr.rota && G.cr.rota.stats.tired.length ? 'Five nights. I said I was fine. Ask me on Friday.' : 'Two nights, then I sleep. Thanks.'), who);
      return;
    case 'merrincr': case 'luciacr':
      await crCommandTable();
      return;
  }
}

/* ---------- Prologue F1: the on-call rota (the rota primitive) ---------- */
const CR_ROTA = {
  title: 'On-call rota', nights: 7, hours: 12, maxRun: 2, maxWeek: 2, budget: 30, callCost: 3, tiredCost: 5,
  intro: '<p>Next week, Night 1 is tonight. One lead on call each night, 18:00–06:00. The night post the council kept is advertised and not filled yet (game).</p>',
  people: [
    {id: 'bea', name: 'Bea Lindqvist', note: 'email, identity'},
    {id: 'ruth', name: 'Ruth Avila', note: 'endpoints'},
    {id: 'paz', name: 'Paz Delgado', note: 'web'},
    {id: 'odile', name: 'Odile Brennan', note: 'backups', off: [3]},
    {id: 'magda', name: 'Magda Petrov', note: 'logs, network'},
    {id: 'beatriz', name: 'Beatriz Solano', note: 'identity, servers', off: [1, 2]},
    {id: 'rae', name: 'Rae Okafor', note: 'the suspicion file', max: 1}],
  calls: {1: 'the Library’s keylogger alert', 3: 'the Library’s patron Wi-Fi dropping at 23:20', 4: 'the extortion email at 05:52'}
};
async function crRotaScript() {
  const who = 'Rae Okafor', c = G.cr;
  await say('Morning. Tallowmere has been in the file with me since last Monday. Nothing has changed on svc-print, and nothing will without a plan.', who);
  await say('Your problem is closer to home. The council kept one night post, and it’s still advertised. Until somebody fills it, the leads take the nights. Next week’s rota is blank.', who);
  await say('Seven nights, one lead on call each. Joss is on the plant’s own rota, Beatriz is buried in the insurer’s access review until Night 3, Odile has a restore test in the lab on Night 3, and I can give you one night, not two.', who);
  await say('Put me on Nights 1 to 5. I’m up at night anyway, and nobody reads the SIEM faster.', 'Magda Petrov');
  let preset = null;
  while (true) {
    const i = await choose('Magda’s offer:', [
      {label: 'Thank her, and spread the nights: two in a row is the most anyone takes this week', meta: {good: true, k: 'spread'}},
      {label: 'Take her up on Nights 1 to 5: she knows the SIEM best of anyone, and she offered', meta: {k: 'five'}},
      {label: 'Give her Nights 1 to 3 now, then see how she feels before the weekend', meta: {k: 'three'}},
      {label: 'Put her on the whole week: one name on call is simpler for the members to remember', meta: {k: 'all'}}], {shuffle: true});
    const k = ['spread', 'five', 'three', 'all'][i];
    G.f.crMagda = k;
    if (k === 'spread') break;
    if (k === 'five') { preset = ['magda', 'magda', 'magda', 'magda', 'magda']; await say('Rae: Five nights running is how good people make slow calls on the fourth. It’s your rota. (Rule, game: no more than two in a row.)', who); break; }
    if (k === 'three') await say('A third night in a row is the one that goes wrong, and “see how she feels” means she’ll say she’s fine. Two in a row, then rest.', who);
    else await say('One name is one point of failure, and seven nights is how you lose her for a month. Spread it.', who);
  }
  if (preset) CR_ROTA.people.find(p => p.id === 'magda').max = 5;
  const r = await doRota(CR_ROTA, preset);
  CR_ROTA.people.find(p => p.id === 'magda').max = undefined;
  c.rota = {assign: r.assign, stats: r.stats, magda: G.f.crMagda};
  G.f.crRota = true; unlock('act', 'crrota'); unlock('fact', 'crnicemgr'); touchCSF('Govern'); track();
  const L = rotaForecast(CR_ROTA, r.assign);
  await UI.openModal('Rota · the week', rotaTable(CR_ROTA, r.assign) +
    '<p>Rota gaps <b>' + r.stats.gaps + ' h</b> · nights past two in a row <b>' + r.stats.tired.length + '</b> · overtime forecast <b>' + r.stats.overtime + ' of ' + CR_ROTA.budget + ' h</b> (game)</p>' +
    (L.length ? '<ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '<p class="small">Nights 5 to 7 fall after the Library: a forecast only. (game)</p>',
    [{label: 'Pin it to the team board', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say(r.stats.tired.length ? 'Pinned. Somebody’s on a third night in a row in there; we’ll see it in the calls. (game)' : r.stats.gaps ? 'Pinned, with a hole in it. Whatever fires that night waits for the morning.' : 'Pinned. Every night covered, nobody past two in a row. That’s a rota people can keep.', who);
  await say('Paz has been hovering. Something about the insurer.', who);
}

/* ---------- Prologue F2: analyst growth ---------- */
async function crGrowthScript() {
  const who = 'Paz Delgado', c = G.cr;
  await say('The insurer wants a timeline of the portal export night by Friday: every step, every source. It’s the hardest write-up we’ve had. Who takes it?', who);
  const opts = [
    {label: 'Paz takes it: you read her timeline the way Noor will, before it goes to her', meta: {good: true, k: 'paz'}},
    {label: 'Do it yourself tonight: you know the night of the export better than anyone', meta: {k: 'self'}},
    {label: 'Paz takes it and sends it straight to Noor: reading it first would undercut her', meta: {k: 'unread'}},
    {label: 'Beatriz takes it: the most senior lead writes the best version for the insurer', meta: {k: 'beatriz'}}];
  const i = await choose('The next hard job: who takes it?', opts, {shuffle: true});
  const k = opts[i].meta.k;
  c.growth = k;
  if (k === 'paz') await say('Me? Then read it like Noor will. I’d rather hear it from you on Thursday than from the insurer next month.', who);
  else if (k === 'self') await say('Fair. Faster, I suppose. (It’s also another late night for you, and the next hard one lands on you again. Growth is a decision too.)', who);
  else if (k === 'unread') await say('Straight to Noor? Every close gets a second look; that was your rule last week. (Noor will find what a review would have.)', who);
  else await say('Beatriz is full with the access review. (The most senior person is rarely the one who most needs the stretch.)', who);
  G.f.crGrowth = true; unlock('act', 'crgrowth'); touchCSF('Govern');
  await say('16:00, the war room table. The Mayor asked for you, and someone from Tallowmere is coming with her.', 'Rae Okafor');
}

/* ---------- Prologue: the two offers, the locked choice ---------- */
async function crCommandTable() {
  const f = G.f;
  if (!f.crGrowth) { await say('The command table: the plan on the wall, the timeline from the night of the portal export beside it.'); return; }
  if (G.trackId) { await say('The command table. Someone else’s now, or still yours: you chose.'); return; }
  f.crOffers = true;
  await say('16:00. The Mayor, and beside her someone from the firm that has been in the suspicion file all week.');
  await say('The council and the members of the Riverbend Shared Services Compact voted on Friday (game). One incident response programme for all of them: the town, the Public Library, the School District, the Community Clinic, Fire & EMS Dispatch and the Regional Airport. Run from here, permanent, with a budget and a rota. I want you to run it: IR manager.', 'Mayor Dalia Merrin');
  await say('Lucia Ferrand, Tallowmere Forensics. We worked the portal export with you and we’ve had the file since last Monday. We want you on the team: the hardest cases, several clients at once, reports that stand up. Principal DFIR consultant.', 'Lucia Ferrand');
  await say('The Mayor’s seat is people, money, exercises and the calls nobody else wants to make. Tallowmere’s is evidence, custody and reports. Both stay with the file. You can’t take both.', 'Rae Okafor');
  const locked = crLockedTrack();
  while (true) {
    const items = ['manager', 'dfir'].map(t => ({label: t === 'manager' ? 'The Mayor: IR manager for the Compact' : 'Tallowmere: principal DFIR consultant',
      note: locked && locked !== t ? 'locked: chosen on another save in this browser; New Game+ comes with the edition’s ending, in a later slice' : t === 'manager' ? 'people, rota, exercises, retainers, AARs' : 'evidence, custody, reports, several clients',
      disabled: !!(locked && locked !== t), meta: {track: t, good: !(locked && locked !== t)}}));
    const i = await UI.openModal('Two offers', '<p>Choose the seat you take for the rest of this edition. Both tracks visit the same districts; the work differs.</p>', items, {closable: false, nav: 'track-pick'});
    const t = items[i].meta.track;
    const j = await UI.openModal('Are you sure?', '<p>You are taking <b>' + esc(CR_TRACK[t].rank) + '</b>.</p><p>This can’t be changed on this save. New Game+ comes with the edition’s ending (a later slice) and opens the other track on a fresh save; until then this browser keeps the track you take.</p>',
      [{label: 'Take it: ' + CR_TRACK[t].rank, meta: {good: true, k: 'yes'}}, {label: 'Go back to the two offers', meta: {k: 'no'}}], {closable: false, nav: 'track-confirm', cursor: 1});
    if (j !== 0) continue;
    crSetTrack(t);
    break;
  }
  const t = G.trackId, lead = G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz';
  if (t === 'manager') await say('Good. The Library asked for help this morning; it’s your first member. ' + lead + ' takes the town team’s board, acting. (game)', 'Mayor Dalia Merrin');
  else await say('Welcome aboard. Start tomorrow. If the Library calls us, Noor will engage us for it, and you’ll lead. ' + lead + ' takes your board here, acting. (game)', 'Lucia Ferrand');
  await crNightOne();
}
function crSetTrack(t) {
  G.trackId = t; G.f.crTrack = t; G.rank = CR_TRACK[t].rank;
  const s = crSeries(), played = (s.tracksPlayed || []).filter(x => x !== t).concat([t]);
  Series.markEdition('crossroads', {track: t, tracksPlayed: played, started: true});
  touchCSF('Govern'); track();
}
// The evening and Night 1: the Library's keylogger alert, handled by Night 1's lead (from your rota).
async function crNightOne() {
  const a = G.cr.rota.assign, lead = a[0] ? rotaName(CR_ROTA, a[0]) : null;
  await UI.openModal('Night 1', '<p>On call: <b>' + esc(lead || 'nobody') + '</b>.</p>' +
    '<p>18:41: the Compact’s endpoint tool flags PUB-PC-04, a public PC in the Library: “Keylogger.Generic (high): keyboard hook by an unsigned program”. ' +
    (lead ? lead.split(' ')[0] + ' blocks the address it talks to at 18:50 and has Juno, the Compact’s technician at the Library, take the PC out of service at 19:05, unplugged from the network. At 21:30 Juno captures its memory, shuts it down and images the disk with a write blocker.' : 'Nobody is on call: the alert waits until 08:00. The Library closes at 20:00, so nobody uses the PC overnight.') +
    ' (game)</p>', [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  if (!lead) G.cr.nightOneUncovered = true;
  G.day = 2; G.focus = G.focusMax;
  if (G.trackId === 'manager' && G.cr.growth === 'paz') { G.focusMax += 4; G.focus = G.focusMax; }
  if (G.cr.growth === 'self') G.focus = Math.max(10, G.focus - 6);   // up late with the insurer's timeline, on either track
  track();
  await say(G.trackId === 'manager' ? 'Day 2, 08:00. Director Strand of the Public Library has asked the Compact for help with PUB-PC-04. The Library is across the square.' : 'Day 2, 08:00. Noor engaged Tallowmere for the Public Library at 08:00. Lucia: “You lead it. The study room is ours.” The Library is across the square.');
}
