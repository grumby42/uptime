/* ============================================================
   UPTIME · editions/charter/story.js
   Charter (edition 3, the CISO): EDITION settings, state, the carry-over from
   Town Hall and Crossroads (read only: the Town Hall save, the Crossroads save
   and the Crossroads New Game+ save are never written), the engine hooks, the
   objective chain, and the prologue (Day 64, Monday): the appointment, the
   remit, the risk-appetite statement, the budget brief and the register's
   owners and review dates. District 1, Budget, is in budget-*.js; District 2,
   Suppliers, in suppliers-*.js; the primitives are in risk.js and supplier.js.
   Timeline: scratchpad charter-timeline.md.
   ============================================================ */
'use strict';

const EDITION = {
  id: 'charter',
  saveKey: 'uptime.charter.save',
  ownMetrics: true,           // the analyst scorecard is replaced by the CISO's (EDITION_METRICS)
  noTools: true,              // no tool console: the CISO's tools are the register, the budget and the Board
  badgeFlags: ['chBallast', 'chHawser'],
  title: 'Charter edition',
  blurb: 'Four weeks after the Compact-wide incident, the Compact Board appoints its first CISO: you. Set the risk appetite with the Board, then the budget: one sum, six risks, and an upgrade that wants the money too. Then the suppliers: tiers, contract clauses, and a supplier’s incident told from the Compact’s own records.',
  fmActionsCat: 'Leadership practices (game)',   // the Field Manual's heading for EXTRA_ACTIONS (engine default: D3FEND-style)
  fmIntro: 'Descriptions are our own words. No ATT&amp;CK technique in Charter so far; the entries not met yet open in later districts.',
  creditsName: 'Charter edition',
  creditsFacts: 'Charter (the prologue, Budget and Suppliers): NICE Framework work role Executive Cybersecurity Leadership (OG-WRL-007) and its tasks T1227, T1059, T1060, T1088 and T1906, as shown on CISA NICCS (NICE Framework version 2.0.0 on the role page), with the NIST NICE Framework Components v2.1.0 (3 December 2025) and v2.2.0 (28 April 2026) summaries of changes, which list no change to them; NIST CSF 2.0 GV.RM-02 and GV.RR-03 with one implementation example each, and GV.SC-04, GV.SC-05, GV.SC-06, GV.SC-07, GV.SC-08 and GV.SC-10 with the examples quoted, from NIST’s CSF 2.0 Implementation Examples (26 February 2024). No ATT&CK technique. Facts recalled from Crossroads are quoted from Crossroads.'
};
const CH_TH_KEY = 'uptime.slice1.save', CH_CR_KEY = 'uptime.crossroads.save', CH_NG_KEY = 'uptime.crossroads.ngplus.save';   // read for the carry-over, never written
const CH_TH_BADGES = [['Key', g => g.badge], ['Seal', g => g.f && g.f.mrSeal], ['Shield', g => g.f && g.f.crShield], ['Lantern', g => g.f && g.f.mkLantern],
  ['Vault', g => g.f && g.f.rhVault], ['Beacon', g => g.f && g.f.bmBeacon], ['Crown', g => g.f && g.f.svCrown], ['Tide', g => g.f && g.f.wtTide], ['Charter', g => g.f && g.f.ccCharter]];
const CH_CR_BADGES = [['Bookmark', 'lbBookmark'], ['Slate', 'sdSlate'], ['Pulse', 'cnPulse'], ['Relay', 'dpRelay'], ['Windsock', 'apWindsock'], ['Compass', 'fnCompass']];
const CH_TRACK = {manager: 'IR manager', dfir: 'principal DFIR consultant'};
const CH_DAY = {64: 'Monday', 65: 'Tuesday', 66: 'Wednesday', 67: 'Thursday', 71: 'Monday', 72: 'Tuesday', 73: 'Wednesday', 74: 'Thursday'};

/* ---------- State ---------- */
function newState(seed) {
  return {
    v: 1, edition: 'charter', seed: seed, map: 'choffice', x: 26, y: 8, dir: 'up',
    day: 64, f: {}, party: [], active: 0, items: {guide: 0},
    focus: 50, focusMax: 50, rep: 50, uptime: 99.95,
    health: {}, rank: 'CISO', badge: false, track: {}, name: 'Lead',
    m: {closed: 0, judged: 0, correctShown: 0, evOk: 0, ttaSum: 0, ttaN: 0, esc: 0, escOk: 0, missed: 0, surfaced: 0, overreact: 0, autoClosed: 0, events: 0, today: 0},
    targets: {chWithin: 100, chOwned: 100, chTop5: 80, chSupCrit: 100, chSupTier: 100, chSupNotify: 100, chSupMust: 100},
    mfaSet: [], fm: {}, csf: {}, brief: {}, pcs: {}, dojo: [false, false, false],
    fpWeight: 50, queue: 0, steps: 0, auto: false, autoReview: false, playMs: 0,
    ch: {carry: null, remit: null, appetite: null, register: null, drills: {}, needs: {met: 0, total: 0}, alloc: null, sent: null,
      board: null, decision: null, final: null, accept: [], directive: null, dojo: [false, false, false], sup: null}
  };
}

/* ---------- Carry-over (read only) ---------- */
function chRead(key) {
  let raw = null; try { raw = localStorage.getItem(key); } catch (e) { raw = null; }
  if (!raw) return null;
  try { return decodeSave(raw); } catch (e) { return null; }
}
function chCarry() {
  const th = chRead(CH_TH_KEY), cr = chRead(CH_CR_KEY), ng = chRead(CH_NG_KEY), ser = Series.load(), sc = ser.editions.crossroads || {}, sth = ser.editions['town-hall'] || {};
  for (const g of [th, cr, ng]) if (g && g.qt) Series.merge(g.qt);   // the series record is shared; the saves themselves are never written
  const tracks = [];
  // A New Game+ save exists only after a first save reached the ending; its ngFrom is the first save's track.
  for (const t of [cr && cr.trackId, ng && ng.trackId, ng && ng.ngFrom].concat(Array.isArray(sc.tracksPlayed) ? sc.tracksPlayed : [])) if (CH_TRACK[t] && !tracks.includes(t)) tracks.push(t);
  tracks.sort();   // alphabetical (dfir before manager), whichever was played first
  const crBadges = CH_CR_BADGES.filter(([, k]) => (cr && cr.f && cr.f[k]) || (ng && ng.f && ng.f[k])).map(([n]) => n);
  const nm = [cr, ng].map(g => g && typeof g.name === 'string' ? g.name.trim().slice(0, 24) : '').find(n => n && n !== 'Lead');
  const clues = Series.qt().cluesFound, crIds = clues.filter(id => /^(lb|sd|cn|dp|ap)-/.test(id));
  return {
    th: th ? 'save' : (sth.done || sth.editionComplete ? 'series' : 'none'), cr: cr || ng ? 'save' : (sc.track ? 'series' : 'none'),
    thBadges: th ? CH_TH_BADGES.filter(([, t]) => t(th)).map(([n]) => n) : [], crBadges: crBadges,
    tracks: tracks, crDone: !!((cr && cr.f && cr.f.fnSummary) || (ng && ng.f && ng.f.fnSummary) || sc.editionComplete || (ng && ng.ngPlus)),
    name: nm || null, clues: clues.length, crClues: crIds.length, thClues: clues.length - crIds.length
  };
}
function chTracksText(c) { return c.tracks.length === 2 ? 'both tracks (IR manager and principal DFIR consultant)' : c.tracks.length ? 'the ' + CH_TRACK[c.tracks[0]] + ' track' : 'no track recorded'; }
function chCarryHtml(c) {
  let h = '';
  h += c.th === 'none' ? '<p>No Town Hall save in this browser.</p>' : '<p>Town Hall, from your ' + (c.th === 'save' ? 'save' : 'series record') + ': badges, as history: <b>' + (c.thBadges.length ? c.thBadges.map(esc).join(' · ') : 'none recorded') + '</b>.</p>';
  h += c.cr === 'none' ? '<p>No Crossroads save in this browser. You start as the Compact’s first CISO with a clean history (game).</p>'
    : '<p>Crossroads, from your ' + (c.cr === 'save' ? 'saves' : 'series record') + ': ' + esc(chTracksText(c)) + (c.crDone ? ', the edition finished' : ', the edition not finished there (Charter starts you as CISO anyway, game)') + '. Badges, as history: <b>' + (c.crBadges.length ? c.crBadges.map(esc).join(' · ') : 'none recorded') + '</b>.</p>';
  h += '<p>The suspicion file: <b>' + c.clues + '</b> Unexplained note' + (c.clues === 1 ? '' : 's') + ' in this browser’s series record (Town Hall ' + c.thClues + ', Crossroads ' + c.crClues + '). Still open: who, and why.</p>';
  h += '<p class="small">Carried into play (game): Focus +2 for each Crossroads track played, +2 if Crossroads was finished. Nothing here changes your Town Hall or Crossroads saves; Charter keeps its own.</p>';
  return h;
}

/* ---------- Engine hooks ---------- */
function hudStatus() { return 'Day ' + G.day + (CH_DAY[G.day] ? ' (' + CH_DAY[G.day] + ')' : '') + ' · ' + G.rank + ' · Focus ' + G.focus + '/' + G.focusMax + ' · the Compact'; }
async function editionQueue() { await say('No alert queue on the CISO’s desk: the Compact’s on-call leads work it, and what needs you reaches you as a risk, a record or a Board paper.'); }
function editionTile(d, ch) { if (ch === 'µ' && G.f.chRegister) d.pal = 'chRegOk'; return d; }
function surfaceMissed() { return Promise.resolve(); }   // no wild alerts here, so nothing can be missed
async function evolveCheck() {}
function triggers() { return false; }
// The allocation the scorecard reads: the CISO's advice, the allocation as sent (— before it is sent). The Board's
// final allocation is the Board's decision, shown on its own line, never scored as the CISO's.
function chScored() { const c = G.ch || {}; return c.sent || null; }
function chOwnedPct() {
  const r = G.ch && G.ch.register; if (!r) return 0;
  return Math.round(CH_LINES.filter(l => r.owners[l.id] && !/^(IT|Finance|Dispatch)$/.test(r.owners[l.id]) && r.review[l.id]).length / CH_LINES.length * 100);
}
function editionMetricVals() {
  const a = chScored(), s = a ? chAllocStats(a) : null, ss = G.ch && G.ch.sup ? chSupStats() : null;
  return {chWithin: s ? s.withinPct : null, chOwned: G.f.chBudgetBrief ? chOwnedPct() : null, chTop5: s ? s.topPct : null,
    chSupCrit: ss ? ss.crit : null, chSupTier: ss ? ss.tier : null, chSupNotify: ss ? ss.notify : null, chSupMust: ss ? ss.must : null};
}
const EDITION_METRICS = [
  {k: 'chWithin', label: 'Risks within appetite (your advice)', unit: '%', higher: true},
  {k: 'chOwned', label: 'Register risks with a business owner and review date', unit: '%', higher: true},
  {k: 'chTop5', label: 'Budget spent against top-five risks', unit: '%', higher: true},
  // Suppliers (slice 2): on the CISO's advice, the tiers as sent and the plan as sent for the Compact's own contracts.
  {k: 'chSupCrit', label: 'Critical suppliers with must-have clauses (your plan)', unit: '%', higher: true, when: () => !!G.f.chSupStart},
  // Owners and review dates came with every line (the Ballast Badge), so this metric reads the tiers alone.
  {k: 'chSupTier', label: 'Suppliers tiered by the rule (your advice)', unit: '%', higher: true, when: () => !!G.f.chSupStart},
  {k: 'chSupNotify', label: 'Notification clause, tier-1 suppliers (your plan)', unit: '%', higher: true, when: () => !!G.f.chSupStart},
  // Every must-have fits the envelope, so each one the plan leaves out is the CISO's poor advice.
  {k: 'chSupMust', label: 'Must-haves in your plan (your advice)', unit: '%', higher: true, when: () => !!G.f.chSupStart}
];
function editionScorecard() {
  const v = metricVals(), c = G.ch || {};
  const fmt = (d, x) => x === null || x === undefined ? '—' : x + d.unit;
  const rows = METRICS.filter(d => !d.when || d.when()).map(d => { const tr = G.track[d.k] || {}; return '<tr><td>' + d.label + '</td><td><b>' + fmt(d, v[d.k]) + '</b></td><td>' + fmt(d, tr.best) + '</td><td>' + fmt(d, tr.worst) + '</td><td>≥ ' + (G.targets[d.k] === undefined ? 100 : G.targets[d.k]) + d.unit + '</td></tr>'; }).join('');
  const ss = G.f.chSupStart ? chSupStats() : null, sup = G.ch && G.ch.sup;
  return '<table class="sc score"><tr><th>Metric</th><th>Now</th><th>Best</th><th>Worst</th><th>Target</th></tr>' + rows + '</table>' +
    '<p>' + (c.sent ? 'Scored on your advice: the allocation you sent, against Monday’s appetite and tolerances.' : 'No allocation sent yet.') + (c.final ? ' The Board’s decision: <b>' + chAllocStats(c.final).within + ' of ' + CH_LINES.length + '</b> lines within appetite' + (c.decision && c.decision.override ? ', overriding your advice' : '') + '.' : c.sent ? ' The Board decides on Thursday.' : '') + ' Drills with every needs met: <b>' + c.needs.met + ' of ' + c.needs.total + '</b>. Acceptances on the register: <b>' + (c.accept || []).length + '</b>' + ((c.accept || []).length ? ' (signed by ' + [...new Set(c.accept.map(x => x.signedBy))].map(esc).join(', ') + ')' : '') + '.</p>' +
    (ss ? '<p>Suppliers: scored on your advice, the tiers you sent and your plan for the Compact’s own contracts. The members’ own contracts are their owners’ decisions: <b>' + ss.memFull + ' of ' + ss.members + '</b> with every must-have. Owners and review dates came with every line (the Ballast Badge). Must-haves left out on your recommendation, decided and signed by their owners: <b>' + sup.accept.length + '</b>' + (ss.poor ? ' (poor advice: a plan with every must-have fitted)' : '') + '. Supplier drills with every needs met: <b>' + sup.needs.met + ' of ' + sup.needs.total + '</b>.</p>' : '') +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Day ' + G.day + (CH_DAY[G.day] ? ' (' + CH_DAY[G.day] + ')' : '') + ' · appetite statement: ' + (c.appetite ? 'approved' : 'not yet') + ' · Ballast Badge: ' + (G.f.chBallast ? 'yes' : 'not yet') + (G.f.chSupStart ? ' · Hawser Badge: ' + (G.f.chHawser ? 'yes' : 'not yet') : '') + '</p>' +
    (c.carry ? '<p class="small">Carried: ' + esc(chTracksText(c.carry)) + (c.carry.crBadges.length ? ' · Crossroads badges ' + c.carry.crBadges.join(', ') : '') + (c.carry.thBadges.length ? ' · Town Hall badges ' + c.carry.thBadges.join(', ') : '') + ' · suspicion file ' + qtCount() + ' notes.</p>' : '') +
    '<p class="small">Every number here is a game model (game). Objective: ' + esc(objective().text) + '</p>';
}
function peekExtra() {
  return {chSummary: !!(G.f && G.f.chSummary), chSupSummary: !!(G.f && G.f.chSupSummary), ch: G.ch ? JSON.parse(JSON.stringify(G.ch)) : null, series: Series.load().editions.charter || null};
}

/* ---------- Intro (new game) ---------- */
async function introScript() {
  const c = chCarry();
  G.ch.carry = c;
  if (c.name) G.name = c.name;
  G.focusMax = 50 + 2 * c.tracks.length + (c.crDone ? 2 : 0); G.focus = G.focusMax;
  qtMirror();
  Series.markEdition('charter', {started: true});
  await say('Day 64, Monday, 08:45. The Compact offices, beside the operations room. Four weeks after the Compact Board met about the weekend of Night 33.');
  await UI.openModal('What you carry into Charter', chCarryHtml(c), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  const i = await UI.openModal('The nameplate on the CISO’s door', '<p>What should it say? Type it, then tap or click your choice. (Leave it blank to keep “' + esc(G.name) + '”.)</p><textarea id="codebox" rows="1" maxlength="24" placeholder="' + esc(G.name) + '"></textarea>',
    [{label: 'Keep “' + G.name + '”', meta: {good: true, k: 'keep'}}, {label: 'Use the name I typed', meta: {k: 'use'}}], {closable: false, nav: 'name-plate'});
  if (i === 1) { const n = String(lastImportText || '').replace(/[^\p{L}\p{N} .’'-]/gu, '').trim().slice(0, 24); if (n) G.name = n; }
  lastImportText = '';
  await say('On Day 57, Monday last week, the Compact Board voted to create the post of Chief Information Security Officer, and appointed you. Today is your first day. (game)');
  if (c.tracks.includes('manager')) await say('The IR programme you ran for the Compact keeps running. It reports to you now.');
  if (c.tracks.includes('dfir')) await say('You left Tallowmere on Friday. The firm stays the Compact’s retainer, and you step off its Compact cases.');
  await say('Controls: move with the arrows or D-pad. A (Z) talks and confirms. B (X) goes back. Start (Enter) opens the menu: scorecard, Field Manual, save.');
  await say('09:00: the Compact Board room, through the west door. Ivor Penhallow is waiting.');
  track();
}

/* ---------- Objective ---------- */
function chDojoNext() { return G.ch.dojo.findIndex(x => !x); }
function objective() {
  const f = G.f, at = (text, map, x, y) => ({text: text, map: map, x: x, y: y});
  if (!f.chAppetite) return at('09:00: the Compact Board room, through the west door. Ivor Penhallow is waiting.', 'chboard', 8, 3);
  if (!f.chBudgetBrief) return at('13:30: Marit Quellan, finance, at her desk in the offices.', 'choffice', 24, 2);
  if (!f.chRegister) return at('The risk register on the wall: three owners to name, and a review date for every line.', 'choffice', 3, 1);
  if (!f.chDay64) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chDrillA) return at('Tuesday 09:00: Beatriz Solano, at the identity desk: the claim about MFA.', 'choffice', 12, 2);
  if (!f.chDrillB) return at('11:00: Edda Thornquist’s desk: the night-cover line.', 'choffice', 18, 2);
  if (!f.chDrillC) return at('14:00: Marit’s desk: two quotes for R1.', 'choffice', 24, 2);
  if (!f.chDay65) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chAlloc) return at('Wednesday 09:00: your desk. The allocation is due with Marit by 17:00.', 'choffice', 26, 9);
  if (!f.chDirective) return at('11:30: Joanna Ferreday is waiting by the register.', 'choffice', 6, 3);
  if (!f.chDojoMet) return at('13:00: Marit has three terminals for you. Talk to her first.', 'choffice', 24, 2);
  if (!f.chDojoDone) return at('The Risk & Budget terminals, south-west: ' + (3 - G.ch.dojo.filter(Boolean).length) + ' left.', 'choffice', 3 + 2 * Math.max(0, chDojoNext()), 9);
  if (!f.chDay66) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chBoard) return at('Thursday 14:00: the Compact Board room: the budget round.', 'chboard', 8, 3);
  if (!f.chSummary) return at('16:00: your desk: close the week.', 'choffice', 26, 9);
  return supObjective(at);
}
// District 2, Suppliers (Days 71 to 74).
function supObjective(at) {
  const f = G.f, sup = G.ch.sup;
  if (!f.chSupStart) return at('Next week, Monday: your desk.', 'choffice', 26, 9);
  if (!f.chSupDrillA) return at('Monday 09:00: Beatriz, at the identity desk: Inkmere and residents’ data.', 'choffice', 12, 2);
  if (!f.chSupTier) return at('10:30: the supplier register, in the contracts cabinet: eight suppliers to tier.', 'choffice', 27, 1);
  if (!f.chSupDrillB) return at('14:00: Edda’s desk: Wellhollow’s assurance report.', 'choffice', 18, 2);
  if (!f.chSupDay71) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chSupIncident) return at('Tuesday 08:20: Marit’s desk: a notice from Thimbleford Payroll.', 'choffice', 24, 2);
  if (!f.chSupDay72) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chSupDrillC) return at('Wednesday 09:00: Joanna, by the register: Tarnfield’s notice.', 'choffice', 6, 3);
  if (!f.chSupDirective) return at('11:30: Ilka Thrushcombe, procurement, by the contracts cabinet.', 'choffice', 27, 3);
  if (!f.chSupPlan) return at('14:00: your desk: the clause plan for the Compact’s contracts.', 'choffice', 26, 9);
  if (!f.chSupDojoMet) return at('15:30: Ilka has three terminals for you. Talk to her first.', 'choffice', 27, 3);
  if (!f.chSupDojoDone) return at('The Suppliers terminals, south-west: ' + (3 - sup.dojo.filter(Boolean).length) + ' left.', 'choffice', 3 + 2 * Math.max(0, sup.dojo.findIndex(x => !x)), 9);
  if (!f.chSupReturn) return at('Wednesday afternoon: Marit was asking for you.', 'choffice', 24, 2);
  if (!f.chSupDay73) return at('End the day at your desk.', 'choffice', 26, 9);
  if (!f.chSupThu) return at('Thursday 11:00: Marit’s desk: Thimbleford’s second answer.', 'choffice', 24, 2);
  if (!f.chSupBoard) return at('Thursday 14:00: the Compact Board room: the Supplier round.', 'chboard', 8, 3);
  if (!f.chSupSummary) return at('16:00: your desk: close the week.', 'choffice', 26, 9);
  return {text: 'Suppliers done. Next: Policy.', done: true};
}

/* ---------- Interactions ---------- */
function interact() {
  const [dx, dy] = DIRS[G.dir];
  const tx = G.x + dx, ty = G.y + dy;
  const npc = npcHere(G.map, tx, ty);
  if (npc) { run(() => talk(npc)); return; }
  const ch = tileChar(G.map, tx, ty), f = G.f;
  const door = doorAt(G.map, tx, ty);
  if (door && door.locked) { run(async () => { await say(door.locked); }); return; }
  if (ch === 'µ') run(async () => { if (f.chBudgetBrief && !f.chRegister) await chRegisterTask(); else await chRegisterView(); });
  else if (ch === 'Y') run(chDesk);
  else if (ch === '¤') run(() => f.chBoard ? chSupDojoPuzzle([3, 5, 7].indexOf(tx)) : chDojoPuzzle([3, 5, 7].indexOf(tx)));
  else if (ch === '£') run(async () => { if (f.chSupDrillA && !f.chSupTier) await chSupTierTask(); else if (f.chSupTier) await chSupRegisterView(); else await say(f.chDrillC ? 'The contracts cabinet. The two quotes for R1 are filed together now, Quote B’s on top. The supplier register sits in the drawer below.' : 'The contracts cabinet: the members’ vendor contracts, and two new quotes in a folder marked R1.'); });
  else if (ch === 'Ɓ') run(async () => { await say(tx < 15 ? 'The identity desk: the shared directory’s console, and Beatriz’s exports.' : tx < 21 ? 'The shared-services desk: the platform’s support notice is pinned to it.' : 'The finance desk: next year’s budget papers, in Marit’s neat piles.'); });
  else if (ch === '±') run(async () => { await say('The Compact Board’s minutes, by year. This year’s binder ends with the weekend of Night 33.'); });
  else if (ch === 'Ɠ') run(async () => { await say('The Board table: one seat for each member’s representative, the chair’s at the head.'); });
}
async function talk(npc) {
  const f = G.f, who = npc.name;
  switch (npc.id) {
    case 'penhallow':
      if (!f.chAppetite) { await chAppointment(); return; }
      if (f.chDay66 && !f.chBoard) { await chBoardRound(); return; }
      if (f.chSupThu && !f.chSupBoard) { await chSupBoardRound(); return; }
      if (f.chSupBoard) { await say('The Hawser Badge: a supplier’s trouble reaches us through our own records first. Keep them that way.', who); return; }
      await say(f.chBoard ? 'The Ballast Badge says this Board can hold you to a measure. Keep giving it one.' : 'Thursday at 14:00. Bring both cases, laid out the same way.', who); return;
    case 'noorch':
      await say(f.chAppetite ? 'I’m here for anything legal. The budget is the Board’s.' : 'Bring me the facts, on time. Whether the law asks for anything is mine to answer, or a member’s own counsel’s.', who); return;
    case 'beatrizch':
      if (f.chDay64 && !f.chDrillA) { await chDrillA(); return; }
      if (f.chSupStart && !f.chSupDrillA) { await chSupDrillA(); return; }
      if (f.chSupStart) { await say(f.chSupDrillA ? 'Inkmere’s line cites the data-flow record now. Thimbleford’s cp-xfer is the only supplier account on the transfer server.' : 'The account lists, when you’re ready.', who); return; }
      await say(f.chDrillA ? 'fin-ap goes to Marit, board-display has an owner and an expiry, and the six service accounts keep theirs, owned and dated.' : 'Exports and resets for Edda. Tomorrow you’ll want the sign-in records, I expect.', who); return;
    case 'edda':
      if (f.chDrillA && !f.chDrillB) { await chDrillB(); return; }
      if (f.chSupTier && !f.chSupDrillB) { await chSupDrillB(); return; }
      if (f.chSupStart) { await say(f.chSupThu ? 'cp-xfer is back, key-only, from Thimbleford’s range, every session logged. It was my call both times, on the facts you brought, and our own logs.' : f.chSupIncident ? 'cp-xfer stays suspended until Thimbleford’s answer covers the 23:52 login. My call, on your advice.' : 'Wellhollow keeps our off-site copies. Its renewal is on my desk.', who); return; }
      await say(!f.chAppetite ? 'Edda Thornquist. I run the shared services. You’ll want me at the Board at nine.' : f.chBoard ? (G.ch.decision && G.ch.decision.override ? 'The upgrade is funded. The Board chose the trade-off, with your advice against it in the minute, and I signed for running the interim checks.' : G.ch.final && G.ch.final.R6 === 2 ? 'The upgrade is funded as you sent it. What it leaves, the owners have signed.' : 'The upgrade waits a year and the extension carries us. Fair, laid out the way you laid it out.') : 'My request is with Marit: the platform leaves its vendor’s support next year. It’s a fair case. Make yours as plainly.', who); return;
    case 'quellan':
      if (f.chAppetite && !f.chBudgetBrief) { await chBudgetBrief(); return; }
      if (f.chSupDay71 && !f.chSupIncident) { await chSupIncident(); return; }
      if (f.chSupDojoDone && !f.chSupReturn) { await chSupReturn(); return; }
      if (f.chSupDay73 && !f.chSupThu) { await chSupThursday(); return; }
      if (f.chSupStart) { await say(f.chSupThu ? 'The members’ staff have been told what we know. Thimbleford’s amendment is with Ilka.' : f.chSupIncident ? 'cp-xfer is suspended, and Thimbleford has our questions. Noor has the facts.' : 'Inkmere and Thimbleford are both mine. Tell me what each one needs in its contract.', who); return; }
      if (f.chDrillB && !f.chDrillC) { await chDrillC(); return; }
      if (f.chDirective && !f.chDojoMet) { await chDojoIntro(); return; }
      await say(f.chDojoMet && !f.chDojoDone ? 'The three terminals, south-west. Residual risk, cost against benefit, and who signs.' : !f.chAppetite ? 'Marit Quellan, finance. After the Board’s session, come and see me about the money.' : 'Your section joins the Board papers on Wednesday at 17:00. Numbers, and what each one buys.', who); return;
    case 'ferreday':
      await chDirective(); return;
    case 'ferredaysup':
      if (!f.chSupDrillC) { await chSupDrillC(); return; }
      await say('Late by 2 hours 20 minutes, on the clause’s own clock. I’ll take it to our counsel.', who); return;
    case 'thrushcombe':
      if (!f.chSupDirective) { await chSupDirective(); return; }
      if (f.chSupPlan && !f.chSupDojoMet) { await chSupDojoIntro(); return; }
      await say(f.chSupPlan ? 'Inkmere signs on Thursday, with the clauses your plan priced. Thimbleford’s amendment goes out with Noor.' : 'I sign Inkmere once your plan is in. 14:00.', who); return;
  }
}

/* ---------- Prologue (Day 64 09:00, the Board room): the appointment, the remit and the appetite statement ---------- */
async function chStages(list, rec) {
  for (const s of list) {
    const items = s.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal(s.title, '<p><b>' + esc(s.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(s.resp[i].why, s.who || 'Ivor Penhallow');
    }
    rec.push(first);
  }
}
async function chAppointment() {
  const who = 'Ivor Penhallow', f = G.f, c = G.ch;
  if (!f.chAppoint) {
    await say('09:00. Welcome. Noor and Edda you know. The Board has wanted one person to run the Compact’s risk programme since the weekend of Night 33. That is you, from today.', who);
    await UI.openModal('The remit (game)', '<ul><li>You report to the Compact Board, through me as its chair.</li><li>Edda Thornquist runs the shared services’ IT: their operations are hers.</li><li>Each member’s own leadership decides for that member. The Compact coordinates; it doesn’t command.</li><li>Counsel decides legal questions: Noor for the town and the shared services, each member’s own counsel for that member.</li><li>You own the risk programme: the register, policy, and reporting to this Board. Everyone else, you advise.</li></ul>',
      [{label: 'Understood', meta: {good: true}}], {closable: false, cls: 'summary'});
    await say('Four questions, so we both know you heard it.', who);
    c.remit = {first: []};
    await chStages(CH_REMIT, c.remit.first);
    f.chAppoint = true; unlock('act', 'chremit'); unlock('fact', 'chnice'); touchCSF('Govern'); track();
    await say('Bring me the facts on time, and I’ll tell you what the law asks of whom.', 'Noor Castellanos');
  }
  await say('10:30. The members’ representatives are in. Before anyone spends a dollar, this Board says how much risk it will carry, and in numbers anyone can measure. Draft it with us.', who);
  const ap = await chAppetiteBuild(CH_APPETITE);
  c.appetite = {levels: ap.levels, tol: ap.tol, first: ap.first, approved: 'Day 64, 12:00'};
  await UI.openModal('The risk-appetite statement', chAppetiteHtml(ap, CH_APPETITE) +
    '<p>And one rule in it: a risk above appetite stays only with an acceptance signed by its business owner, with an expiry, a review date and interim measures. The Board sees each one, and a risk the Board itself decides to carry above appetite is minuted as the Board’s decision and approved by it. (game)</p>' +
    '<p class="small">CSF 2.0 GV.RM-02: “Risk appetite and risk tolerance statements are established, communicated, and maintained”. One of NIST’s examples: “Translate risk appetite statements into specific, measurable, and broadly understandable risk tolerance statements”.</p>',
    [{label: '12:00: the Board approves it, and Ivor signs', meta: {good: true}}], {closable: false, cls: 'summary'});
  f.chAppetite = true; unlock('act', 'chappetite'); unlock('fact', 'chcsf'); touchCSF('Govern'); track();
  await say('Every decision this week is measured against that. Thursday at 14:00, the budget round.', who);
  await say('My request is with Marit already. You’ll see it.', 'Edda Thornquist');
  await say('13:30: Marit Quellan, finance, at her desk in the offices.');
}

/* ---------- Prologue (Day 64 13:30): the budget brief ---------- */
async function chBudgetBrief() {
  const who = 'Marit Quellan';
  await say('Marit Quellan, finance. Next year’s security programme lines get $480k, one-off and recurring costs together this year. The upgrade would be a one-off. (game)', who);
  await say('The Board’s budget round is Thursday at 14:00. The agenda goes out with the papers this evening; your section reaches me by Wednesday at 17:00 and joins them. (game)', who);
  await say('Edda’s request came in on Friday: the platform upgrade, $250k. Two quotes for the vendor-access line came in the same day.', who);
  await say('I don’t need a security case. I need each line priced against what it buys and what it leaves.', who);
  G.f.chBudgetBrief = true; touchCSF('Govern'); track();
  await say('The register on the wall first. Three of its lines name a department, not a person, and none has a review date.', who);
}

/* ---------- Prologue (Day 64 14:00): the register's owners and review dates ---------- */
function chRegisterInit() {
  if (!G.ch.register) G.ch.register = {owners: {R1: 'Edda Thornquist', R2: 'IT', R3: 'Edda Thornquist', R4: 'Finance', R5: 'Dispatch', R6: 'Edda Thornquist'}, review: {}, first: []};
  return G.ch.register;
}
function chRegisterHtml() {
  const r = chRegisterInit();
  return '<table class="sc"><tr><th>Line</th><th>Rank</th><th>Owner</th><th>Review</th></tr>' + CH_LINES.slice().sort((a, b) => a.rank - b.rank).map(l =>
    '<tr><td>' + l.id + '</td><td>' + l.rank + '</td><td>' + esc(r.owners[l.id].split(' ')[0]) + '</td><td>' + (r.review[l.id] ? 'Day ' + r.review[l.id] : '—') + '</td></tr>').join('') + '</table>' +
    '<ul>' + CH_LINES.slice().sort((a, b) => a.rank - b.rank).map(l => '<li><b>' + l.id + ' ' + esc(l.name) + '</b>: ' + esc(l.catName) + ' · ' + esc(l.opts[0].what) + '</li>').join('') + '</ul>';
}
async function chRegisterView() {
  await UI.openModal('The risk register', chRegisterHtml() + (G.ch.accept.length ? '<h3>Acceptances</h3>' + chAcceptHtml(G.ch.accept) : ''), [{label: 'Back', meta: {back: true}}], {closable: false, cls: 'drill'});
}
async function chRegisterTask() {
  const r = chRegisterInit();
  await UI.openModal('The risk register (inherited)', '<p>Six top lines, ranked (1 = highest). Three name a department as owner; none has a review date. A risk nobody owns is a risk nobody decides about.</p>' + chRegisterHtml(),
    [{label: 'Name the owners', meta: {good: true}}], {closable: false, cls: 'drill'});
  for (const q of CH_OWNERS) {
    const items = q.resp.map(x => ({label: x.label, meta: {good: !!x.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal('Owner · ' + q.line, '<p>Was: <b>' + esc(q.was) + '</b>. ' + esc(q.ask) + '</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) { r.owners[q.line] = q.resp[i].label.split(',')[0]; break; }
      first = false;
      await say(q.resp[i].why);
    }
    r.first.push(first);
  }
  const items = CH_REVIEW.map(x => ({label: x.label, meta: {good: !!x.good}}));
  let first = true;
  while (true) {
    const i = await UI.openModal('Review dates', '<p>When is each line next reviewed?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_REVIEW[i].why);
  }
  r.first.push(first);
  for (const l of CH_LINES) r.review[l.id] = CH_REVIEW_DAY;
  G.f.chRegister = true; unlock('act', 'chowner'); touchCSF('Identify'); track();
  await UI.openModal('The risk register', chRegisterHtml(), [{label: 'Pin it back on the wall', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say('Every line with a person’s name and a date the Board can hold you to. End the day at your desk when you’re ready.');
}

/* ---------- Your desk: the ends of the days, the allocation, the week's summary ---------- */
async function chDesk() {
  const f = G.f;
  if (f.chRegister && !f.chDay64) {
    await UI.openModal('Monday, done', '<p>The Board has an appetite statement it signed, and the register has an owner and a review date on every line. (game)</p>', [{label: 'Tuesday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chDay64 = true; G.day = 65; G.focus = G.focusMax; track();
    await say('Day 65, Tuesday, 09:00. Beatriz has the sign-in records at the identity desk.'); return;
  }
  if (f.chDrillC && !f.chDay65) {
    await UI.openModal('Tuesday, done', '<p>Three claims read against the records: the MFA line, the night-cover line, and the two quotes. (game)</p>', [{label: 'Wednesday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chDay65 = true; G.day = 66; G.focus = G.focusMax; track();
    await say('Day 66, Wednesday, 09:00. The allocation is due with Marit by 17:00. Your desk.'); return;
  }
  if (f.chDay65 && !f.chAlloc) { await chAllocTask(); return; }
  if (f.chDojoDone && !f.chDay66) {
    await UI.openModal('Wednesday, done', '<p>17:00: your section joins the Board papers, your allocation and Edda’s alternative side by side. (game)</p>', [{label: 'Thursday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chDay66 = true; G.day = 67; G.focus = G.focusMax; track();
    await say('Day 67, Thursday. 14:00: the Compact Board room, the budget round.'); return;
  }
  if (f.chBoard && !f.chSummary) { await chSummary(); return; }
  if (f.chSummary && !f.chSupStart) { await chSupStart(); return; }
  if (f.chSupDrillB && !f.chSupDay71) {
    await UI.openModal('Monday, done', '<p>Inkmere’s data read from the records, eight suppliers tiered, and Wellhollow’s report read against its scope and dates. (game)</p>', [{label: 'Tuesday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chSupDay71 = true; G.day = 72; G.focus = G.focusMax; track();
    await say('Day 72, Tuesday, 08:20. Marit is at her desk with something from the payroll mailbox.'); return;
  }
  if (f.chSupIncident && !f.chSupDay72) {
    await UI.openModal('Tuesday, done', '<p>17:30: Thimbleford’s account manager writes that its logs and its investigation are confidential, and a summary will follow. 17:50: Noor writes to Thimbleford’s counsel for the facts in writing. cp-xfer stays suspended. (game)</p>', [{label: 'Wednesday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chSupDay72 = true; G.day = 73; G.focus = G.focusMax; track();
    await say('Day 73, Wednesday, 09:00. Joanna Ferreday is by the register.'); return;
  }
  if (f.chSupDirective && !f.chSupPlan) { await chSupPlanTask(); return; }
  if (f.chSupReturn && !f.chSupDay73) {
    await UI.openModal('Wednesday, done', '<p>Tarnfield’s clock read from the clause, Inkmere’s renewal sent to its owner, the plan with Ilka and Noor, and cp-xfer kept off until Thimbleford’s answer covers 23:52. (game)</p>', [{label: 'Thursday', meta: {good: true}}], {closable: false, cls: 'summary'});
    f.chSupDay73 = true; G.day = 74; G.focus = G.focusMax; track();
    await say('Day 74, Thursday, 11:00. Marit has Thimbleford’s second answer.'); return;
  }
  if (f.chSupBoard) { await chSupSummary(); return; }
  if (f.chSummary) { await say('Your desk: the supplier register on one screen, Thimbleford’s thread on the other.'); return; }
  await say(f.chDay64 ? 'Your desk: the register on one screen, the Board papers on the other.' : 'Your desk: an empty in-tray and a new nameplate.');
}
