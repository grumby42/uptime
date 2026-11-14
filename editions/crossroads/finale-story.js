/* ============================================================
   UPTIME · editions/crossroads/finale-story.js
   Crossroads finale (slice 6): the Compact-wide incident, both tracks.
   Objectives, the arrival (Night 33: three members' shares encrypted under one
   Compact service account, the account disabled at 02:41), the manager track
   (the plan's test, command across members, three records drills, the
   restoration order, the briefings, the cross-member AAR, the programme
   roadmap), the DFIR track (four letters and four stores, preservation,
   intake, three evidence drills, the way back, one report per member and one
   for the shared services, the report under challenge), Rae's suspicion file
   laid out (the Quiet Thread brought together, still open), the Compact
   Board (the Compass Badge), the nights, and the edition ending: the
   summary across every district, the credits, and New Game+ on a fresh save.
   Each member's own leaders decide for it; Edda Thornquist decides for the
   Compact's shared services; each member's counsel decides about its report.
   Defender-side only: what the records show afterwards, never how.
   Timeline: scratchpad crossroads-timeline.md (Finale section); every line
   here is checked against it.
   ============================================================ */
'use strict';

function inFinale() { return FN_MAPS.includes(G.map); }
const fnMgr = () => G.trackId === 'manager', fnDfir = () => G.trackId === 'dfir';
// The finale's state lives in G.cr.fn, made on arrival (saves from before this slice have none until then).
function fnC() {
  return G.cr.fn || (G.cr.fn = {rota: null, activate: null, boss: null, aar: null, roadmap: null, board: null, challenge: null, stores: null, requests: null, revised: false});
}
const FN_DAY = {34: 'Saturday', 35: 'Sunday', 36: 'Monday'};
const fnHm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
// Week 5 (Nights 30 to 36) carries Nights 28 and 29 from the week-4 rota, drawn up by the acting team lead (not scored).
function fnPre() { const r = G.cr.ap && G.cr.ap.rota, a = r ? r.assign : []; return [a[28 - AP_ROTA.first] || null, a[29 - AP_ROTA.first] || null]; }
function fnLead(n) { const r = fnC().rota; const a = r ? r.assign[n - FN_ROTA.first] : null; return a ? rotaName(FN_ROTA, a) : null; }
function fnActing() { return G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz'; }
function fnCustody() { return G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0}); }

/* ---------- Map tiles that change ---------- */
function fnTile(d, ch) {
  if (ch === 'Ƈ' && G.f.fnReset) d.pal = 'fnRackOk';   // the shared directory reviewed and every admin and service password in it reset (svc-print excepted, the Mayor’s decision)
  return d;
}

/* ---------- Objective ---------- */
function fnObjective() {
  if (!G.trackId || !G.f.apSummary) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'fnops', x: x, y: y, district: 'finale'});
  if (!f.fnMet) return Object.assign(at('The Compact operations room: its door is on the north side of the square, west of Town Hall’s.', 4, 14), {step: true});
  if (fnMgr()) {
    if (!f.fnTest) return at('03:05: the plan’s test for each member, at the command table.', 13, 4);
    if (!f.fnBoss1) return at(fnHm(fnMgrTimes().s1) + ': six members, one room. The command table.', 13, 4);
    if (!f.fnDrillB) return at('06:30: the 01:52 sign-ins. Beatriz, at the shared-services rack.', 26, 2);
    if (!f.fnDrillC) return at('07:20: Imogen is on the line at Dispatch’s desk.', 14, 2);
    if (!f.fnDrillA) return at('08:10: Owen Marsh, at the School District’s desk, has a report.', 6, 2);
    if (!f.fnBoss2) return at('09:30: what comes back first? The command table.', 13, 4);
    if (!f.fnBoss3) return at('12:00: the briefings. The command table.', 13, 4);
    if (!f.fnNight34) return at('End the day at the desk in the south-west room.', 11, 13);
    if (!f.fnRae) return at('Sunday 18:00: Rae, at the suspicion-file board.', 27, 11);
    if (!f.fnNight35) return at('End the day at the desk in the south-west room.', 11, 13);
    if (!f.fnAar) return at('Monday 10:00: the cross-member AAR, at the meeting table.', 3, 11);
    if (!f.fnRoadmap) return at('13:00: the programme roadmap, at the meeting table.', 3, 11);
  } else {
    if (!f.fnStoresSet) return at('04:10: the letters and the stores. Lucia, at the bench.', 5, 12);
    if (!f.fnBoss1) return at('04:30: preserve. The bench.', 3, 11);
    if (!f.fnIntake) return at('06:00: evidence intake, at the lockers in the south-east room.', 22, 10);
    if (!f.fnDrillB) return at('07:00: CMP-01, question 1. The bench.', 3, 11);
    if (!f.fnDrillA) return at('08:30: the district’s question. The bench.', 3, 11);
    if (!f.fnDrillC) return at('10:00: CMP-01, question 2: the collector. The bench.', 3, 11);
    if (!f.fnBoss2) return at('12:00: what did it reach? The bench.', 3, 11);
    if (!f.fnNight34) return at('End the day at the desk in the south-west room.', 11, 13);
    if (!f.fnBoss3) return at('Sunday 07:30: the way back. The bench.', 3, 11);
    if (!f.fnReports) return at('15:00: write the four reports, at the bench.', 3, 11);
    if (!f.fnRae) return at('18:00: Rae, at the suspicion-file board.', 27, 11);
    if (!f.fnNight35) return at('End the day at the desk in the south-west room.', 11, 13);
    if (!f.fnChallenge) return at('Monday 09:00: Hugo Ellerby, with Ansel, by the bench.', 2, 13);
  }
  if (!f.fnBoard) return at('14:00: the Compact Board. Ivor Penhallow, through the west door.', 8, 3, 'fnboard');
  if (!f.fnSummary) return at('16:00: Edda wants to close the week, at her desk.', 22, 2);
  return {text: 'The Compact-wide incident is closed, and the edition with it. Next: Charter.', done: true, district: 'finale'};
}

/* ---------- Triggers, interactions, talk ---------- */
function fnTriggers() {
  if (G.map === 'fnops' && G.trackId && G.f.apSummary && !G.f.fnMet) { run(fnArrive); return true; }
  return false;
}
function fnInteract(ch, tx) {
  if (!inFinale()) return false;
  const f = G.f;
  if (!f.fnMet && G.map === 'fnops') { if ('ƁƇƊƑƓ§Y'.includes(ch)) { run(async () => { await say('The operations room is quiet. Once the Airport’s week is closed, it is yours to use.'); }); return true; } return false; }
  if (ch === 'Ɠ') { run(fnCommandTable); return true; }
  if (ch === '§') { run(fnBench); return true; }
  if (ch === 'Ƒ') { run(async () => { if (fnDfir() && f.fnBoss1 && !f.fnIntake) await fnIntake(); else await say(fnDfir() ? 'Four locked cases, each with its own seal log: CMP-01, LIB-03, CLN-03, AIR-03. A fifth, smaller, holds the School District’s one item, under its letter SCH-01 for one question: apart.' : 'The firm’s lockers, one per case. Not yours to open.'); }); return true; }
  if (ch === 'Ɗ') { run(async () => { if (f.fnNight34 && !f.fnRae) await fnRaeFile(); else await say(f.fnRae ? 'The suspicion file, laid out: every note in its place, and a card at the bottom: “Who, and why: open.”' : 'Rae’s board: the suspicion file’s notes, pinned and dated. Rae lays it out on Sunday evening.'); }); return true; }
  if (ch === 'Ɓ') { run(async () => { await say('The liaison desk for ' + (FN_DESKS[tx] || 'a member') + ': a phone, the plan’s contact page for that member, and a card: “This member’s leaders decide for it.”'); }); return true; }
  if (ch === 'Ƈ') { run(async () => { await say(f.fnReset ? 'The shared-services rack: the shared directory’s console and CP-OPS-02. A label: “Reviewed Sunday 07:30–09:30. Every admin and service password reset, svc-print excepted (the Mayor’s decision). svc-fileops: disabled.”' : 'The shared-services rack: the shared directory’s console and CP-OPS-02, the Compact’s operations server.' + (f.fnMet ? ' A label: “svc-fileops disabled 02:41.”' : '')); }); return true; }
  if (ch === 'Y') { run(fnDesk); return true; }
  if (ch === '±') { run(async () => { await say('The Compact Board’s minutes, by year. This year’s binder: “The Compact’s incident response programme: one member at a time.”'); }); return true; }
  return false;
}
async function fnTalk(npc) {
  if (!FN_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.fnMet) { await say(f.apSummary ? 'Come in: the operations room is ready for whatever comes next.' : 'Once the Airport’s week is closed, the operations room is ready.', who); return true; }
  switch (npc.id) {
    case 'strandfn':
      await say(f.fnBoss3 || f.fnBoss2 ? 'The branch is on paper slips until the directory has been looked at. My call, and Dot is quicker on paper than most are on screen.' : 'The Library decides for the Library. Tell me what the image server shows, and what it doesn’t.', who); break;
    case 'marshfn':
      if (fnMgr() && f.fnDrillC && !f.fnDrillA) { await fnDrillAMgr(); break; }
      await say(f.fnDrillA ? 'Not ours, then. I’ll pull the forty messages myself. Wim did the right thing.' : 'Owen Marsh, the district. Nothing of ours on your list so far. I’ll ring if that changes.', who); break;
    case 'marisolfn':
      await say(f.fnBoss3 || f.fnBoss2 ? 'Saturday’s patients on the cart, and Joy enters it all on Monday. I pick when the folder comes back.' : 'The front-desk folder is the clinic’s. Wrenfold is the clinic’s. Tell me what each shows.', who); break;
    case 'halefn':
      if (fnMgr() && f.fnDrillB && !f.fnDrillC) { await fnDrillCMgr(); break; }
      await say(f.fnDrillC ? 'The floor stays on CAD. My call, on your facts. Ring me if anything changes on my network.' : 'Imogen Hale, on the line from the floor. I take the floor at 07:00 on Saturdays.', who); break;
    case 'breckfn':
      await say(f.fnBoss2 ? 'Front desk on paper since 07:30: the receipt templates live on that share. It’s my terminal at weekends; Joanna knows.' : 'Callum Breck, weekend duty manager. The terminal is mine on Saturdays and Sundays.', who); break;
    case 'edda':
      if (f.fnBoard) { await fnSummary(); break; }
      await say(f.fnReset ? 'Every admin and service password in the directory reset but svc-print’s, the directory reviewed first. svc-fileops stays off until each member has its own account.' : 'Edda Thornquist, shared services. I decide for the Compact’s own services. I decide for no member.', who); break;
    case 'beatrizfn':
      if (fnMgr() && f.fnBoss1 && !f.fnDrillB) { await fnDrillBMgr(); break; }
      await say(f.fnReset ? 'Resets done: every admin and service account, the town’s too, svc-print excepted as the Mayor decided. Two people checked each one.' : 'Beatriz. I run the shared directory for Edda. Exports, resets, nothing else without her say.', who); break;
    case 'noorfn':
      await say(fnDfir() ? 'Three letters from me: the town, the shared services, the Library. Three stores. Renata and Ansel have their own.' : 'I engage the firm for the town, the shared services and the Library, separately. Renata and Ansel do their own.', who); break;
    case 'raefn':
      if (f.fnNight34 && !f.fnRae) { await fnRaeFile(); break; }
      await say(f.fnRae ? 'Who, and why: still open. It goes onward with the file.' : 'Nothing changes on svc-print without a plan. Sunday evening, I’ll lay the whole file out for you.', who); break;
    case 'luciafn':
      if (fnDfir() && !f.fnStoresSet) { await fnStoresTask(); break; }
      await say(fnDfir() ? 'Four cases, four stores, one account across them. Keep it that way.' : 'Our reports go to each member’s counsel. You get the status the same day.', who); break;
    case 'theofn':
      await say('Theo. LIB-03, CLN-03 and AIR-03 in their own lockers, CMP-01 in its own. I label twice.', who); break;
    case 'ellerby':
      if (fnDfir() && f.fnNight35 && !f.fnChallenge) { await fnChallengeTask(); break; }
      await say('Hugo Ellerby, for the Authority’s insurer. Ansel gave me AIR-03. I have questions.', who); break;
    case 'penhallow': await fnBoardScript(); break;
  }
  return true;
}

/* ---------- Arrival: Days 30 to 33 narrated; Night 33; Day 34, Saturday ---------- */
async function fnArrive() {
  const f = G.f, c = fnC(), lead = G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz';
  f.fnMet = true; touchCSF('Identify');
  c.rota = rotaAuto(FN_ROTA, fnPre(), SD_ROTA_ORDER);
  await UI.openModal('Days 30 to 33', '<p>Tuesday 09:00: week 5’s rota, Nights 30 to 36, drawn up by ' + esc(lead) + ', the town team’s acting lead, to the rota’s rules' + (fnMgr() ? ', and signed by you' : '') + ' (not on your scorecard: you didn’t build it, game). ' + (fnMgr() ? 'Tuesday: Dario sets out the tenant network options for Joanna, as the AAR asked. ' : '') + 'Wednesday: the Airport’s night threshold with the Compact, in writing, Joanna’s decision.</p>' +
    '<p>Wednesday: the Compact operations room opens, off the square: a desk for each member’s liaison, for incidents that touch more than one member. Edda Thornquist, the Compact’s shared-services director, runs it day to day. Nights 30 to 32: quiet. Friday 23:00: the Compact’s nightly copies of the members’ shares it looks after, held off the network, as every night. (game)</p>',
    [{label: 'Night 33', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 34; G.focus = G.focusMax;
  const n33l = fnLead(33), n33 = n33l || 'the Compact’s on-call lead';
  await UI.openModal('Night 33 (Friday to Saturday)', '<p>On call: <b>' + esc(n33) + '</b>.</p>' +
    '<p>02:35: the Compact’s log platform pages, under the members’ night thresholds: “files renamed at volume on LIB-IMG-01, CL-FS-01, AP-FS-01, account svc-fileops”. svc-fileops is a Compact service account with rights on those three members’ file shares (game). 02:41: ' + esc(n33l ? n33l.split(' ')[0] : 'the on-call lead') + ' disables svc-fileops in the shared directory, under the runbook Edda signed: a service account seen encrypting is disabled at once, and disabling destroys nothing. 02:44: the two addresses its sign-ins came from, 192.0.2.140 and 192.0.2.141, blocked at the Compact’s edge. No file event under svc-fileops anywhere after 02:40. (game)</p>' +
    '<p>02:50: ' + (fnMgr() ? 'you are rung, as the plan says for an incident at more than one member. By then the account record says svc-fileops has no rights on CIRC-01, WF-01, AP-BIL-02 or CAD, and the platform shows no sign-in by it on CIRC-01.' : esc(lead) + ', the acting team lead, is rung, and rings Noor at 02:55, and each member’s counsel from the plan’s contact page.') + ' 02:55: Dispatch’s night supervisor hears that DP-LOG-01, the Compact’s collector on the center’s network, refused two sign-ins as svc-fileops at 02:42, and keeps the floor as it is: their call. (game)</p>',
    [{label: 'Saturday', meta: {good: true}}], {closable: false, cls: 'summary'});
  unlock('tech', 'T1486'); unlock('tech', 'T1657');
  if (fnMgr()) {
    await say('Day 34, Saturday, 03:00. The Compact operations room. Edda Thornquist arrives at 03:05.');
    await say('Three shares at three members, one account, one night. Each member’s leaders are on their way to the phone. Read me the plan.', 'Edda Thornquist');
    await say('(Windsock Badge: the firm, like every third party, is on the plan’s page with its owner, its contact and what it owns. game)');
  } else {
    await say('03:30: Noor engages Tallowmere for the town and the Compact’s shared services, case CMP-01. 03:40: Renata Osei for the Clinic, CLN-03; and Celia Marrow, for the 911 authority, decides with Lionel Ashdown, the county attorney, that the firm needn’t look at anything of the center’s own: DP-LOG-01 is the Compact’s, in CMP-01. 03:45: Ansel Whitcombe for the Airport, AIR-03. 03:50: Director Strand decides, with Noor, that the firm looks at LIB-IMG-01, and Noor engages it for the Library, separately: LIB-03. One counsel can sign two letters; each letter is its own case. (game)');
    await say('Day 34, Saturday, 04:00. The Compact operations room. Lucia rang at 03:35.');
    await say('Four letters, one account across all of them. Before anything else, the stores. At the bench.', 'Lucia Ferrand');
  }
}

/* ---------- Manager: the command table (the plan's test; the boss's three stages) ---------- */
async function fnCommandTable() {
  const f = G.f;
  if (fnDfir()) { await say(f.fnBoss2 ? 'The command table: the members’ restore times on cards, each card signed by the member’s own leader.' : 'The command table. The IR programme’s table; the firm works at the bench.'); return; }
  if (!f.fnTest) return fnTestTask();
  if (!f.fnBoss1) return fnBossStage('s1');
  if (f.fnDrillA && !f.fnBoss2) return fnBossStage('s2');
  if (f.fnBoss2 && !f.fnBoss3) return fnBossStage('s3');
  await say(f.fnBoss3 ? 'The command table: the members’ restore times on cards, each card signed by the member’s own leader.' : 'The command table. The drills first: the records are with Beatriz, Imogen and Owen.');
}
async function fnTestTask() {
  const c = fnC();
  await say('03:05. Each member’s annex to the Compact’s plan says when the retainer is called. The Clinic’s: “when patient information may have been reached, wherever it is held; when ransomware or another destructive attack is found on any clinic system; or when the on-call lead can’t contain an incident.” The Airport’s: “when ransomware or another destructive attack is found on the airport’s office network; when billing or tenant records may have left the airport’s control; or when the on-call lead can’t contain an incident” (its vendor line isn’t in play: no vendor’s access is in question). The Library’s: “when Shelfwright or the patron records it holds may have been reached, or when the on-call lead can’t contain an incident.” Dispatch’s: “when a dispatch system may have been reached by someone not authorised; when ransomware or another destructive attack is found on any system that shares the center’s network, the county office’s included; or when the on-call lead can’t contain an incident.” None of the three shares is on the center’s network: each is on its own member’s. (game)');
  let mins = FN_ACT_OK;
  while (true) {
    const items = FN_TEST.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose('The plan’s test, member by member:', items, {shuffle: true});
    if (items[i].meta.good) break;
    mins += FN_ACT_LATE;
    await say(FN_TEST[i].why + ' (+' + FN_ACT_LATE + ' game minutes)');
  }
  c.activate = mins; G.cr.activate = mins;
  const t = fnMgrTimes();
  await say(fnHm(t.call) + ' retainer line called · ' + fnHm(t.ack) + ' Tallowmere acknowledges. Renata Osei engages the firm for the Clinic at ' + fnHm(t.ren) + ' and Ansel Whitcombe for the Airport at ' + fnHm(t.ans) + '. Noor engages it for the town and the shared services. ' + fnHm(t.ren) + ': Celia Marrow, for the 911 authority, decides with Lionel Ashdown, the county attorney, that the firm needn’t look at anything of the center’s own: DP-LOG-01 is the Compact’s, in Noor’s case. ' + fnHm(t.lib) + ': Director Strand decides, with Noor, that the firm looks at LIB-IMG-01, and Noor engages it for the Library, separately. (game)');
  G.f.fnTest = true; unlock('act', 'crretainer'); touchCSF('Respond'); track();
}
// The manager's night clock after the plan's test (Review S4): each wrong answer moves the call 20 game minutes, and
// everything that waits on the call or on counsel's engagement moves with it; at best the times are as the timeline gives them.
function fnMgrTimes() {
  const a = G.cr.fn ? G.cr.fn.activate : null, mins = a === null || a === undefined ? FN_ACT_OK : a;
  const call = 3 * 60 + 8 + (mins - FN_ACT_OK), ack = call + FN_ACT_OK, ren = Math.max(3 * 60 + 40, ack + 5), ans = Math.max(3 * 60 + 45, ack + 10);
  const s1 = Math.max(3 * 60 + 20, call + 5), line = Math.max(3 * 60 + 30, s1 + 10);
  return {call: call, ack: ack, ren: ren, ans: ans, lib: Math.max(3 * 60 + 50, ack + 15), s1: s1, line: line, mayor: Math.max(4 * 60, line), fbi: Math.max(4 * 60 + 30, ans + 5)};
}
async function fnBossStage(k) {
  const c = fnC(), t = fnMgrTimes();
  if (!c.boss) c.boss = {first: []};
  const st = fnMgrBossStages()[k];
  if (k === 's1') await say(fnHm(t.s1) + '. On the line: Director Strand, Marisol, Callum and Dispatch’s night supervisor. Edda is here. The Mayor will be told at ' + fnHm(t.mayor) + '.');
  const items = st.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
  let first = true;
  while (true) {
    const i = await UI.openModal(st.title, '<ul>' + st.clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false;
    await say(st.resp[i].why);
  }
  c.boss.first.push(first);
  if (k === 's1') {
    G.f.fnBoss1 = true; unlock('act', 'fncommand'); touchCSF('Respond'); track();
    await say(fnHm(t.line) + ': each leader on the line, each deciding for their own. ' + fnHm(t.mayor) + ': the Mayor told, for the town. ' + fnHm(t.fbi) + ': with each counsel’s agreement, the FBI contact on the plan’s page is told, and the CISA contact on the plan’s page too. 06:00: the Compact’s heads-up to every member’s contact: svc-fileops, the two addresses, the three shares, what to watch for. (game)');
    await say('06:30. Beatriz has the night’s records at the shared-services rack.');
  } else if (k === 's2') {
    G.f.fnBoss2 = true; unlock('act', 'fnorder'); touchCSF('Recover'); track();
    await say('Agreed round the room: Dispatch settled by Imogen; the Clinic’s care, the airport’s desk and the branch on paper, each by its own leader; nothing returns before the shared directory is reviewed and its passwords reset, Edda’s decision for the shared services; each member’s leader picks its own time once its copy is checked. (game)');
    await say('11:00, the firm, through each counsel: three shares encrypted under svc-fileops 02:31–02:40; no sign-in by it on Shelfwright, Wrenfold, Plinthwise or CAD; two refused tries on DP-LOG-01; no transfer above 1 MB from the shares in the records read, with one three-minute gap in the link’s records, 02:36–02:39; smaller transfers: not ruled out; how the password was got: unknown. (game)');
  } else {
    c.boss.ok = c.boss.first.every(Boolean); c.boss.done = true;
    G.f.fnBoss3 = true; touchCSF('Respond'); track();
    await say('12:00 to 12:40: each leader hears their member’s facts, what isn’t known, and 16:00 for the next update. What each member’s public is told is its own counsel’s decision. Nobody has asked the Compact to pay anything. (game)');
    await UI.openModal('Saturday, as counted', '<p>Three shares encrypted for under ten minutes, 02:31–02:40. The branch on paper slips from 09:00 (Director Strand’s call), the Clinic’s Saturday session on the cart from 08:00 (Marisol’s), the airport’s front desk on paper from 07:30 (Callum’s). Dispatch’s floor unchanged, on CAD (Imogen’s). The School District untouched. (game)</p><p class="small">The Compact’s cover this weekend: 12-hour shifts with handovers at 07:00 and 19:00, Night 34’s rota lead on call. Not graded and not scored: it is week 5’s rota, which you didn’t build. (game)</p>', [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
    await say('16:00: the next update, as promised. End the day when you’re ready.');
  }
}

/* ---------- Drills ---------- */
async function fnDrill(key) {
  const c = G.cr;
  const r = await doDrill(FN_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (fnDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function fnDrillBMgr() {
  await say('The night lead’s note asks whether svc-fileops was on a job. I have the sign-in records and the change records. Read them before anyone says so.', 'Beatriz Solano');
  const r = await fnDrill('fnsignmgr');
  G.f.fnDrillB = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Not ours, then. It stays off.' : 'No job was due, and those two addresses are new to it in thirty days. Not ours. It stays off.', 'Beatriz Solano');
  await say('07:00: Imogen Hale takes Dispatch’s floor for the Saturday day shift, and is on the line at her desk here. (game)');
}
async function fnDrillCMgr() {
  await say('Your collector on my network saw that account. Does anything change on my floor? Give me the records, and I’ll decide.', 'Imogen Hale');
  const r = await fnDrill('fnfloormgr');
  G.f.fnDrillC = true; touchCSF('Respond');
  await say(r.verdictOk ? 'Then the floor stays on CAD. My call.' : 'Both refused, and nothing on my floor hangs off it. The floor stays on CAD. My call.', 'Imogen Hale');
  await say('07:30: Callum puts the airport’s front desk on paper: its receipt templates and day sheet live on AP-FS-01. His call. 07:00 Marisol put the Clinic’s Saturday session on the downtime cart. 07:40: Owen Marsh rang about an email; he is at the School District’s desk since 08:05. (game)');
}
async function fnDrillAMgr() {
  await say('Wim Haddad forwarded this at 07:31; it reached forty of us at 07:12. Is it part of last night’s? I have our message trace, and the Compact has our sign-ins.', 'Owen Marsh');
  const r = await fnDrill('fnphishmgr');
  G.f.fnDrillA = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Not part of it. Ours to handle, then. I’ll tell Dr Vale.' : 'None of our sign-ins from those addresses, and a sender your campaign never used. Not part of it. Ours to handle. I’ll tell Dr Vale.', 'Owen Marsh');
  await say('08:30: Director Strand opens the branch at 09:00 on offline circulation, Dot’s paper slips, with the public PCs out of service until their image server is back: her call, until the shared directory has been reviewed. 09:30: what comes back first, at the command table. (game)');
}

/* ---------- DFIR: the bench ---------- */
async function fnBench() {
  const f = G.f;
  if (fnMgr()) {
    if (f.fnNight35 && !f.fnAar) return fnAar();
    if (f.fnAar && !f.fnRoadmap) return fnRoadmap();
    return say(f.fnRoadmap ? 'The meeting table: three action cards, each with an owner and a date, and the roadmap’s four lines above them.' : 'The meeting table, by the firm’s bench. The AAR is on Monday.');
  }
  if (!f.fnStoresSet) return say('The bench. Lucia first: the letters and the stores.');
  if (!f.fnBoss1) return fnDfirStage('s1');
  if (!f.fnIntake) return say('The bench. The exports are at the lockers first.');
  if (!f.fnDrillB) {
    await fnDrill('fnsigndfir'); f.fnDrillB = true; touchCSF('Detect');
    await say(G.cr.drills.fnsigndfir.supported ? 'Not Compact work, from P-01 and P-02. To Noor, and the indicators to Renata’s and Ansel’s cases with their agreement.' : 'Not Compact work: write it only from what you’ve read.', 'Lucia Ferrand');
    await say('07:40: Owen Marsh rang the operations room about an email Wim Haddad reported at 07:31. 08:15: Adaeze Kole adds one question to the district’s letter, SCH-01, in writing: is the email part of the campaign? For that, the firm may use the district’s message trace. (game)', 'Lucia Ferrand');
    return;
  }
  if (!f.fnDrillA) {
    await fnIntakeS13();
    await fnDrill('fnphishdfir'); f.fnDrillA = true; touchCSF('Detect');
    await say('To Kole: not part of the campaign. The district pulls the forty messages and blocks the sender itself. (game)', 'Lucia Ferrand');
    return;
  }
  if (!f.fnDrillC) {
    await fnDrill('fncollectdfir'); f.fnDrillC = true; touchCSF('Respond');
    await say('10:20, under Noor’s rule for live operations: the facts to Imogen Hale, who took Dispatch’s floor at 07:00. Her decision: the floor stays on CAD. (game)', 'Lucia Ferrand');
    await say('By 09:00 Callum had the airport’s desk on paper since 07:30, Marisol the Clinic’s session on the cart since 08:00, and Director Strand the branch on paper slips from 09:00: each its own leader’s call. (game)');
    return;
  }
  if (!f.fnBoss2) return fnDfirStage('s2');
  if (f.fnNight34 && !f.fnBoss3) return fnDfirStage('s3');
  if (f.fnBoss3 && !f.fnReports) return fnReports();
  return say('Your bench: working copies only. The originals are sealed, each in its own case’s locker.');
}
async function fnDfirStage(k) {
  const c = fnC(), cu = fnCustody();
  if (!c.boss) c.boss = {first: []};
  const st = fnDfirBossStages()[k];
  const items = st.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
  let first = true;
  while (true) {
    const i = await UI.openModal(st.title, '<ul>' + st.clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false;
    await say(st.resp[i].why);
  }
  c.boss.first.push(first);
  if (k === 's1') {
    G.f.fnBoss1 = true; touchCSF('Respond'); track();
    await say('05:00 to 05:55, each export by its own people, hashed at export: P-01 the shared directory’s sign-in records (Beatriz), P-02 the Compact’s change records (Edda’s team), P-03 DP-LOG-01’s own log (Ezra Moll), P-04 the directory’s change record and a snapshot (Beatriz), P-05 the Compact link’s flow records (Beatriz); L-01 to L-04 for the Library (Juno; L-04 the Library firewall’s log for Night 33, which records connections, not their size), N-01 to N-03 for the Clinic (Kit), T-01 to T-03 for the Airport (Dario). Magda’s team checks the patron-network flow records: they cover the public PCs and patron Wi-Fi, not LIB-IMG-01. Hosts left running, svc-fileops left disabled. (Bookmark Badge: the Compact’s handovers carry their collection hashes. game)', 'Lucia Ferrand');
    await say('06:00: intake at the lockers. Two of them need your call.', 'Lucia Ferrand');
  } else if (k === 's2') {
    c.boss.ok2 = true;
    G.f.fnBoss2 = true; touchCSF('Respond'); track();
    await say('12:20: the finding to each counsel, for its own member; with each counsel’s agreement, to that member’s leader. Noor agrees that P-05’s rows for each share may be cited in that member’s report. The acting team lead told the FBI contact and the CISA contact on the plan’s page at 04:30, with each counsel’s agreement. (game)', 'Lucia Ferrand');
    await say('End the day when you’re ready. Tomorrow, the way back.', 'Lucia Ferrand');
  } else {
    c.boss.ok = c.boss.first.every(Boolean); c.boss.done = true;
    G.f.fnBoss3 = true; unlock('act', 'fnway'); touchCSF('Recover'); track();
    await fnSunday();
  }
}
// Sunday (both tracks): the directory reviewed, the passwords reset, each copy checked, each member's own restore time.
function fnSundayHtml() {
  return '<p>07:30–09:30: the firm reviews the shared directory (P-06): accounts, groups, policies, delegations and sign-ins over the 30 days its records keep, Day 5 to 07:30 today, against Saturday’s 05:30 snapshot and the Compact’s change records (P-02). Every change in them has an approved change record: on Day 12, svc-fileops’s rights review (Edda’s) and the resets of the passwords used on CL-FD-02 (Kit’s, for the Clinic); at 02:41, the disable under the runbook. Nothing else created or changed. svc-fileops: CP-OPS-02 nightly at 23:00, then 192.0.2.140 and .141 01:52–02:28 Saturday, none since 02:41.</p>' +
    '<p>09:00: the Mayor decides, with Rae, that the town’s admin accounts in the shared directory are reset too, svc-print excepted under Rae’s plan: its sign-ins watched, its rights on the members’ servers reviewed by Day 43, each member’s leader told. 09:30–10:30: Beatriz resets the password of every admin and service account in the shared directory, the Compact’s on Edda’s decision and the town’s on the Mayor’s, but svc-print’s (P-07). svc-fileops stays disabled; the file service stays paused until each member has its own account. 10:00: the firm checks Friday’s 23:00 copies of the three shares in isolation: scanned clean, nothing in them later than 23:04 Friday.</p>' +
    '<p>11:00: S:\\FrontDesk restored, at the time Marisol picks; Saturday’s paper to be entered by 09:30 Monday, each entry checked by a second person. 12:00: AP-FS-01 restored, at the time Callum picks; a test entry, the desk off paper at 12:30, the weekend’s slips entered by 17:00, each checked. 13:00: Director Strand puts the branch back on Shelfwright. 14:00: LIB-IMG-01 restored, at the time she picks; 15:00 the public PCs back after a clean restore; Saturday’s slips entered by 17:00, each checked. (game)</p>';
}
async function fnSunday() {
  const cu = fnCustody();
  await UI.openModal('Sunday: the way back', fnSundayHtml(), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.fnReset = true; cu.items += 2; cu.complete += 2; touchCSF('Recover'); track();   // P-06, P-07
  fnC().requests = {date: 'Day 35 (Sunday) 14:00'};
  await say('14:00, through Ansel and Renata to Noor: R-31, the town’s internet edge flow records for 02:30 to 02:45 on Night 33: the Compact’s edge sits behind the town’s, so anything that went out through it in P-05’s gap went out through the town’s edge too. Logged as it went: “requested Day 35 (Sunday) 14:00” (Slate Badge). 15:00: the four reports, at the bench. (game)', 'Lucia Ferrand');
}

/* ---------- DFIR D1: the letters and the stores ---------- */
async function fnStoresTask() {
  const who = 'Lucia Ferrand', c = fnC();
  await say('Noor signed two letters, Renata one, Ansel one. One account, the same two addresses in all of them. How many stores?', who);
  while (true) {
    const items = FN_STORES.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The letters and the stores · 04:10', '<p>Four letters: CMP-01 (Noor: the town and the Compact’s shared services), LIB-03 (Noor: the Library), CLN-03 (Renata Osei: the Clinic), AIR-03 (Ansel Whitcombe: the Airport). How do you hold the evidence?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(FN_STORES[i].why);
  }
  c.stores = 4;
  G.f.fnStoresSet = true; unlock('act', 'fnstores'); unlock('act', 'crstores'); touchCSF('Govern'); track();
  await say('Four lockers, four seal logs. The account name and the two addresses go on a card in each case, marked “indicator, shared with each counsel’s agreement”. Nothing else crosses. 04:30, at the bench: what we preserve first.', who);
}

/* ---------- DFIR D3: intake ---------- */
async function fnIntakeItem(it) {
  const cu = fnCustody();
  let first = true;
  const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
  while (true) {
    const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 34. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
    if (opts[i].meta.good) break;
    first = false; cu.gaps++;
    await say(it.opts[i].why);
  }
  cu.items++; if (first) cu.complete++;
}
async function fnIntake() {
  const cu = fnCustody();
  await say('Fifteen items in four cases. Thirteen are routine: log each with its handover and its hash on receipt against the form, seal the original in its own case’s locker, work on copies. Two need your call.', 'Lucia Ferrand');
  await fnIntakeItem(FN_INTAKE.l01);
  await fnIntakeItem(FN_INTAKE.p05);
  cu.items += 13; cu.complete += 13;   // the other thirteen, hashed on receipt against each export record, sealed in their own cases
  G.f.fnIntake = true; unlock('act', 'crcustody'); touchCSF('Respond'); track();
  await say('Fifteen logged: CMP-01 five, LIB-03 four, CLN-03 three, AIR-03 three. 07:00, at the bench: CMP-01’s first question.', 'Lucia Ferrand');
}
async function fnIntakeS13() {
  await say('08:20: Owen Marsh hands over S-13, the district’s message trace for 07:00 to 08:00, for the one question Kole added to SCH-01. Log it.', 'Theo Marchetti');
  await fnIntakeItem(FN_INTAKE.s13);
  track();
}

/* ---------- DFIR: the four reports (Sunday 15:00) ---------- */
async function fnReports() {
  const c = G.cr;
  await say('Four reports, one per letter. Each to its own counsel; nothing from one store in another’s report unless both counsel agreed.', 'Lucia Ferrand');
  for (const [k, R] of [['fnlib', FN_REPORT_LIB], ['fncln', FN_REPORT_CLN], ['fnair', FN_REPORT_AIR], ['fncmp', FN_REPORT_CMP]]) {
    const r = await doReport(R);
    c.reports[k] = {score: r.score, over: r.over, under: r.under};
    c.corrected += r.over; track();
  }
  G.f.fnReports = true; touchCSF('Respond'); track();
  await say('LIB-03 and CMP-01 to Noor, CLN-03 to Renata, AIR-03 to Ansel, by 15:40. 16:00: Renata and Ansel ask for CMP-01; Noor agrees. Ansel tells us his insurer’s reviewer will want a word on Monday. 18:00: Rae has the suspicion file laid out at her board.', 'Lucia Ferrand');
}

/* ---------- DFIR: the report under challenge (Monday 09:00) ---------- */
async function fnChallengeTask() {
  const c = fnC(), who = 'Hugo Ellerby';
  await say('Ansel Whitcombe, counsel to the Authority: “Hugo has AIR-03 because I gave it to him. Answer him from the evidence. Anything about what the Authority must do is mine.”');
  await say('Hugo Ellerby, for the Authority’s insurer. Three questions about finding 3.', who);
  c.challenge = {first: []};
  for (const s of FN_CHALLENGE) {
    const items = s.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal(s.title, '<div class="card"><b>AIR-03, finding 3 (Likely):</b> ' + esc(FN_REPORT_AIR.claims.find(x => x.id === 'out').text) + '</div><p><b>' + esc(who) + ':</b> ' + esc(s.ask) + '</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(s.resp[i].why, 'Lucia Ferrand');
    }
    c.challenge.first.push(first);
  }
  G.f.fnChallenge = true; unlock('act', 'fnchallenge'); touchCSF('Respond'); track();
  await say('Fair. Likely, with the next record named and dated. I can write that down.', who);
  const cu = fnCustody(); cu.items++; cu.complete++;   // P-08
  c.revised = true;
  await say('11:30: P-08, the town’s internet edge flow records for 02:30 to 02:45, exported by Beatriz with Noor’s agreement, hashed: no transfer above 1 MB to any outside address in the gap, the Compact’s edge’s traffic included. With Renata’s and Ansel’s agreement, CLN-03’s and AIR-03’s finding 3, no transfer above 1 MB, are reissued as confirmed for 01:30 to 03:00, the change and its reason written in each; finding 4, anything smaller, stays unknown. LIB-03 stays unknown: the Library’s own edge logs no sizes, and P-08 shows only what left through the town. A finding revised on new evidence, not a claim corrected. (game)', 'Lucia Ferrand');
  await say('14:00: the Compact Board, through the west door.', 'Lucia Ferrand');
}

/* ---------- Rae: the suspicion file, laid out (both tracks; Sunday 18:00) ---------- */
// Each Crossroads clue's time, as its own text gives it.
const FN_QT_TIMES = {'lb-rdp': '03:12', 'sd-probe': '03:21', 'cn-folders': '03:14', 'dp-conns': '03:11', 'ap-accounts': '03:13'};
const FN_QT_CR = ['lb-rdp', 'sd-probe', 'cn-folders', 'dp-conns', 'ap-accounts'];
const FN_QT_VERBS = {'lb-rdp': 'signing in', 'sd-probe': 'pinging', 'cn-folders': 'listing folders', 'dp-conns': 'listing connections', 'ap-accounts': 'listing accounts'};
const FN_QT_CHANGES = ['th-logclear', 'th-schtask', 'mr-fwdrule', 'cr-portproxy', 'rh-vault', 'sv-nesting', 'wt-vendorbox'];   // Town Hall notes that record a change made (a task, a rule, a proxy, a group, an account), or something taken
function fnQtHtml() {
  const found = Series.qt().cluesFound, cr = FN_QT_CR.filter(id => found.includes(id)), th = crQtPriorLines();
  let h = '';
  h += '<h3>Inside the town (Town Hall’s notes)</h3>' + (th.length ? '<ul>' + th.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p>None in this browser’s series record.</p>');
  h += '<h3>Across the members (Crossroads)</h3>';
  if (!cr.length) h += '<p>None noted: each member’s note was optional, and each was left unread.</p>';
  else h += cr.map(id => '<div class="card"><b>' + esc(QT_CLUES[id].tech + ' · ' + QT_CLUES[id].where) + '</b><br>' + esc(QT_CLUES[id].seen) + '</div>').join('');
  if (cr.length) {
    const ts = cr.map(id => FN_QT_TIMES[id]).sort(), span = ts[0] === ts[ts.length - 1] ? 'at ' + (ts[0] === '03:21' ? '03:21–03:22' : ts[0]) : 'between ' + ts[0] + ' and ' + (ts[ts.length - 1] === '03:21' ? '03:22' : ts[ts.length - 1]);
    h += '<h3>What the members’ notes share</h3><p>' + (cr.length === 1 ? 'One note: ' : 'In every one of them: ') + 'svc-print, a town account, or FD-STAFF-11’s address, Town Hall’s front-desk PC; ' + span + ' at night. ' + (v => v.charAt(0).toUpperCase() + v.slice(1))(cr.map(id => FN_QT_VERBS[id]).join(', ')) + ': discovery. No record in them shows a change made or anything taken' + (cr.includes('lb-rdp') ? '; on CIRC-01, what the session did is unknown' : '') + '.</p>';
  }
  if (FN_QT_CHANGES.some(id => found.includes(id))) h += '<p>Inside the town it was different: Town Hall’s notes above include changes made or something taken.</p>';
  h += '<h3>This weekend</h3><p>The campaign used svc-fileops, from 192.0.2.140 and 192.0.2.141. The shared directory’s records show no svc-print sign-in between 01:00 and 03:00 on Night 33, and no note in the file shares those addresses. Nothing links the two, and nothing rules a link out.</p>';
  h += '<p class="big">Open: who, and why.</p><p class="small">Not this edition’s to answer. The file goes onward with it. (game)</p>';
  return h;
}
// Rae's closing line follows the members' notes found, not Town Hall's (Review S8); never further than the records go.
function fnRaeLine(found) {
  const cr = FN_QT_CR.filter(id => found.includes(id));
  if (cr.length) return 'One pattern among the members, patient and quiet: looking, as far as the records go' + (cr.includes('lb-rdp') ? ', and on CIRC-01 we can’t say' : '') + '. Who, and why: I can’t tell you. Not from this.';
  if (found.length) return 'Nothing noted among the members: their notes went unread, so the file can’t say what happened out there. Inside the town, it holds what you read. Who, and why: still open.';
  return 'An empty board tells you what you didn’t read, not what wasn’t there.';
}
async function fnRaeFile() {
  const who = 'Rae Okafor';
  await say('Sunday, 18:00. Everything in the file, in one place, for the first time. Read it with me. Then we decide nothing, because nothing changes on svc-print without a plan.', who);
  await UI.openModal('The suspicion file, laid out', fnQtHtml(), [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say(fnRaeLine(Series.qt().cluesFound), who);
  G.f.fnRae = true; touchCSF('Identify'); track();
  await say('End the day when you’re ready.');
}

/* ---------- The desk: end the day, and the nights ---------- */
async function fnDesk() {
  const f = G.f;
  const ready = fnMgr() ? ((f.fnBoss3 && !f.fnNight34) || (f.fnRae && !f.fnNight35)) : ((f.fnBoss2 && !f.fnNight34) || (f.fnRae && !f.fnNight35));
  if (!ready) { await say('The desk in the south-west room. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.fnNight34) await fnNight34(); else await fnNight35();
}
async function fnNight34() {
  const lead = fnLead(34);
  await UI.openModal('Night 34', '<p>Night 34 (Saturday to Sunday). On call: <b>' + esc(lead || 'the Compact’s on-call lead') + '</b>. No page. Nothing under svc-fileops anywhere; the two addresses still blocked. (game)</p>', [{label: 'Sunday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 35; G.focus = G.focusMax; G.f.fnNight34 = true; track();
  if (fnMgr()) {
    await say('Day 35, Sunday. The way back, in the order agreed yesterday.');
    await UI.openModal('Sunday: the way back', fnSundayHtml(), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
    G.f.fnReset = true; unlock('act', 'fnway'); touchCSF('Recover'); track();
    await say('18:00: Rae has the suspicion file laid out at her board.');
  } else await say('Day 35, Sunday, 07:30. Lucia is at the bench: the way back.');
}
async function fnNight35() {
  const lead = fnLead(35);
  await UI.openModal('Night 35', '<p>Night 35 (Sunday to Monday). On call: <b>' + esc(lead || 'the Compact’s on-call lead') + '</b>. No page. (game)</p>', [{label: 'Monday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 36; G.focus = G.focusMax; G.f.fnNight35 = true; track();
  await say('Day 36, Monday. ' + (fnMgr() ? 'By 09:30 the Clinic’s Saturday paper is entered and checked. 10:00: the cross-member AAR, at the meeting table, every member’s liaison there.' : '09:00: Ansel Whitcombe and his insurer’s reviewer, Hugo Ellerby, are by the bench.'));
}

/* ---------- Manager: the cross-member AAR (Monday 10:00) ---------- */
async function fnAar() {
  const c = G.cr, d = fnC(), who = 'Edda Thornquist';
  await say('Blameless, every member at the table. How did one account reach three of us, what kept each of us working, and what did it cost each one?', who);
  const items = FN_FACTORS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> contributing factors the AAR should record.</p>' + shownOrder(FN_FACTORS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('AAR · contributing factors', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !FN_FACTORS[i].good);
  for (const i of wrong) await say(FN_FACTORS[i].name + ': ' + (FN_FACTORS[i].id === 'first' ? 'a blame, not a cause. The order the shares were hit says nothing about who let anyone in.' : FN_FACTORS[i].id === 'thread' ? 'nothing in the evidence links the campaign to svc-print.' : 'both sign-ins there were refused, and nothing ran.'));
  let impFirst = true;
  while (true) {
    const its = FN_IMPACT.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('AAR · the impact', '<p>The cost, member by member, from 02:31 Saturday to 09:30 this morning. What goes in the review?</p>', its, {shuffle: true, closable: false, cls: 'drill'});
    if (its[i].meta.good) break;
    impFirst = false; await say(FN_IMPACT[i].why);
  }
  await say('The three actions arrive with their owners already assigned, under the Library Board’s rule (Bookmark Badge). What’s left is the dates.');
  let onTime = 0;
  for (const a of FN_AAR) {
    let ok = true;
    const opts = a.dates.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · due date', '<div class="card"><b>' + esc(a.name) + '</b><br>Owner: ' + esc(a.owner) + '</div><p>When is it due?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      ok = false; await say(a.dates[i].why);
    }
    if (ok) onTime++;
  }
  c.aar = {total: ((c.aar && c.aar.total) || 0) + FN_AAR.length, onTime: ((c.aar && c.aar.onTime) || 0) + onTime};
  d.aar = {factorsWrong: wrong.length, onTime: onTime, impactFirst: impFirst};
  G.f.fnAar = true; unlock('act', 'fnaar'); unlock('act', 'craar'); touchCSF('Govern'); track();
  await say('Three actions, three owners, three dates, the cost as counted, and nobody blamed. 13:00: the programme’s next year, here.', who);
}

/* ---------- Manager: the programme roadmap (Monday 13:00) ---------- */
async function fnRoadmap() {
  const d = fnC(), who = 'Edda Thornquist';
  await say('Your programme, for the next year. Four lines the Compact Board can hold you to.', who);
  const items = FN_ROADMAP.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> lines for the roadmap.</p>' + shownOrder(FN_ROADMAP, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('The programme roadmap', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !FN_ROADMAP[i].good);
  for (const i of wrong) await say(FN_ROADMAP[i].name + ': ' + (FN_ROADMAP[i].id === 'command' ? 'the Compact coordinates; each member decides for itself, in an incident too.' : FN_ROADMAP[i].id === 'cut' ? 'six minutes was the page and the runbook. The firm still worked four cases.' : 'one person on every night is the tired call the rota exists to prevent.'));
  d.roadmap = {wrong: wrong.length};
  G.f.fnRoadmap = true; unlock('act', 'fnroadmap'); touchCSF('Govern'); track();
  await say('Exercises, terms, rota health, accounts: each line with an owner and a date in the plan. 14:00: the Compact Board, through the west door.', who);
}

/* ---------- The Compact Board ---------- */
async function fnBoardScript() {
  const who = 'Ivor Penhallow', f = G.f, c = fnC();
  if (f.fnBoard) { await say('The Compass Badge says the members trust how this programme works. Keep earning it.', who); return; }
  if (!(fnMgr() ? f.fnRoadmap : f.fnChallenge)) { await say('The Board sits on Monday at 14:00, once the weekend’s work is done.', who); return; }
  await say('The Compact Board: one seat for each member. Three questions, the way our members’ boards will put them to us. We grade the answer we can act on.', who);
  const specs = fnMgr() ? FN_BOARD_SPECS_MGR() : FN_BOARD_SPECS_DFIR();
  c.board = {first: []};
  for (const s of specs) {
    const items = s.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal(s.title, '<p><b>' + esc(s.who) + ':</b> ' + esc(s.ask) + '</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(s.resp[i].why, s.who);
    }
    c.board.first.push(first);
  }
  f.fnBoard = true; f.fnCompass = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the Compact Board. This is the Compass Badge (game).', who);
  await say('It goes in your history with the others. And you carry a little more now: Focus +4.', who);
  touchCSF('Govern');
  await say('16:00: Edda wants to close the week, at her desk.');
}

/* ---------- Scorecard extra and the edition ending ---------- */
function fnScoreHtml() {
  if (!G.trackId || !G.f.fnMet) return '';
  const c = G.cr, s = c.fn || {};
  if (fnMgr()) return '<p>The Compact-wide incident: retainer ' + (s.activate !== null && s.activate !== undefined ? '<b>' + s.activate + ' min</b>' : 'not called') + ' · AAR ' + (G.f.fnAar ? '<b>held</b>' : 'not yet') + ' · roadmap ' + (G.f.fnRoadmap ? '<b>set</b>' : 'not yet') + ' (game)</p>';
  return '<p>The Compact-wide incident: cases in parallel <b>' + (s.stores || '—') + '</b> · requests logged <b>' + (s.requests ? esc(s.requests.date) : 'not yet') + '</b> · reports filed <b>' + ['fnlib', 'fncln', 'fnair', 'fncmp'].filter(k => c.reports[k]).length + '</b> (game)</p>';
}
// One row per district, prologue to finale, from what each district recorded (game).
function fnHistoryRows() {
  const c = G.cr, t = G.trackId, yes = b => b ? 'yes' : 'not yet';
  const first = st => st && st.first && st.first.length ? st.first.filter(Boolean).length + ' of ' + st.first.length : '—';
  const boss = st => st && st.first ? (st.ok ? 'first try' : 'with false starts') : '—';
  const rep = ks => t === 'dfir' ? ks.filter(k => c.reports[k]).map(k => c.reports[k].score).join(', ') || '—' : '';
  const rows = [
    ['The prologue', '—', '—', '—', '—', ''],
    ['The Public Library', 'Bookmark: ' + yes(G.f.lbBookmark), first(c.board), boss(c.boss), '', rep(['pc', 'boss'])],
    ['The School District', 'Slate: ' + yes(G.f.sdSlate), first(c.sd && c.sd.board), boss(c.sd && c.sd.boss), '', rep(['sd1', 'sd2'])],
    ['The Community Clinic', 'Pulse: ' + yes(G.f.cnPulse), first(c.cn && c.cn.board), boss(c.cn && c.cn.boss), '', rep(['cn1', 'cn2'])],
    ['Fire & EMS Dispatch', 'Relay: ' + yes(G.f.dpRelay), first(c.dp && c.dp.board), boss(c.dp && c.dp.boss), '', rep(['dp1', 'dp2'])],
    ['The Regional Airport', 'Windsock: ' + yes(G.f.apWindsock), first(c.ap && c.ap.board), boss(c.ap && c.ap.boss), '', rep(['ap1', 'ap2'])],
    ['The Compact-wide incident', 'Compass: ' + yes(G.f.fnCompass), first(c.fn && c.fn.board), boss(c.fn && c.fn.boss), '', rep(['fnlib', 'fncln', 'fnair', 'fncmp'])]];
  return '<table class="sc"><tr><th>District</th><th>Badge</th><th>Board, right first time</th><th>Boss</th>' + (t === 'dfir' ? '<th>Reports (game score)</th>' : '') + '</tr>' +
    rows.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td>' + (t === 'dfir' ? '<td>' + esc(r[5]) + '</td>' : '') + '</tr>').join('') + '</table>' +
    (c.rota ? '<p class="small">The prologue’s rota: ' + c.rota.stats.gaps + ' h uncovered, ' + c.rota.stats.tired.length + ' nights past two in a row (game).</p>' : '');
}
function fnDrillRows() {
  const keys = fnMgr() ? ['fnsignmgr', 'fnfloormgr', 'fnphishmgr'] : ['fnsigndfir', 'fncollectdfir', 'fnphishdfir'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(FN_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function fnSummary() {
  const f = G.f, c = fnC(), t = G.trackId;
  if (!f.fnSummary) {
    f.fnSummary = true; touchCSF('Govern');
    crSeriesMark({finale: true, done: true, editionComplete: true});
    if (!G.ngPlus) crGrantNgPlus();
    await say((t === 'manager' ? 'Six members, one room, and nobody decided for anybody else. Every share came back from a copy somebody checked, onto a directory somebody reviewed. ' : 'Four cases that never touched, one account across them, and every finding worded the way the records hold it. ') + 'And the file Rae keeps is still open. Thank you.', 'Edda Thornquist');
  }
  const body = '<p class="big">The Crossroads edition: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (FN_DAY[G.day] || '') + ')' + (G.ngPlus ? ' · New Game+' : '') + '</p>' +
    '<h3>The finale’s drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + fnDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>The report under challenge: ' + (c.challenge && c.challenge.first.every(Boolean) ? 'held from the evidence at the first try' : 'held, with false starts the debriefs named') + '; CLN-03 and AIR-03 revised on new evidence (no transfer above 1 MB; anything smaller still unknown), LIB-03 kept at unknown (game).</p>' : '<p>The plan’s test: ' + (c.activate !== null && c.activate !== undefined ? c.activate + ' game minutes to the retainer' : '—') + ' · the AAR’s impact ' + (c.aar && c.aar.impactFirst ? 'as counted, first time' : 'as counted') + ' (game).</p>') +
    '<p>Lesson (game): one Compact account with rights on three members’ shares let one password reach all three in under ten minutes. The night thresholds and a runbook turned it off at 02:41, each member’s own leaders ran their own paper and picked their own times, and every share came back from a checked copy onto a directory reviewed first. The firm kept four cases apart though one account ran through them.</p>' +
    '<h3>Every district, prologue to finale (game)</h3>' + fnHistoryRows() +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, FD-STAFF-11’s address, the 03:00 pattern' + (qtCount() ? ', ' + qtCount() + ' notes in the suspicion file' : '') + '. Who, and why: open. It goes onward with the file.</p>') +
    '<p class="big">Next: Charter, the third edition (the series menu).</p>';
  const ngSave = crNgSave(), canNg = !G.ngPlus;
  while (true) {
    const items = [{label: 'Keep exploring the operations room', meta: {good: true}}, {label: 'Credits'}];
    if (canNg) items.push({label: ngSave ? 'New Game+: continue it from the title screen' : 'New Game+: the other track, on a fresh save', meta: {k: 'ng'}});
    items.push({label: 'Title screen', meta: {k: 'title'}});
    const i = await UI.openModal('The end of the Crossroads edition', body, items, {nav: 'district-end', closable: false, cls: 'summary'});
    const k = items[i].meta && items[i].meta.k;
    if (items[i].label === 'Credits') { await UI.openModal('Credits', creditsHtml() + '<p class="big">Next: Charter, the third edition (the series menu).</p>', [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (k === 'ng' && !ngSave) { if (await fnNgPlusStart()) return; continue; }
    if (k === 'ng' || k === 'title') { started = false; titleScreen(); }
    break;
  }
}
// New Game+ from the ending: the first save is kept as it stands (saved above, in its own slot); a fresh save on the other
// track goes in the second slot. The Town Hall save is never touched.
async function fnNgPlusStart() {
  const other = G.trackId === 'manager' ? 'dfir' : 'manager';
  const j = await UI.openModal('New Game+', '<p>A fresh save on the other track: <b>' + esc(CR_TRACK[other].rank) + '</b>.</p><p>Your save on this track is kept exactly as it stands, in its own slot: Continue opens it from the title screen. Town Hall’s save is never touched.</p>',
    [{label: 'Start New Game+', meta: {k: 'go'}}, {label: 'Back to the ending', meta: {k: 'back'}}], {closable: false, nav: 'ng-confirm', cursor: 1});
  if (j !== 0) return false;
  crNgBegin(other);
  return true;
}
