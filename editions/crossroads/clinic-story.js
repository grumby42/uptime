/* ============================================================
   UPTIME · editions/crossroads/clinic-story.js
   Crossroads district 3: the Community Clinic, both tracks. Objectives, the
   arrival (a ransom note at the front desk; containment that keeps the evidence;
   the Clinic annex's retainer test), the manager track (the downtime decision
   with the practice manager, three records drills, the weekend plan with the
   week-2 rota's nights, the AAR, a tabletop on a three-day outage), the DFIR
   track (the scoping letter, containment that preserves, evidence intake, three
   evidence drills, two reports), the shared directive (the exam rooms' shared
   login), the Clinic Board (Pulse Badge), the dojos, the boss from each seat, the
   nights, the Quiet Thread clue and the end-of-district summary.
   Timeline: scratchpad crossroads-timeline.md (Community Clinic section); every
   line here is checked against it.
   ============================================================ */
'use strict';

function inClinic() { return CN_MAPS.includes(G.map); }
const cnMgr = () => G.trackId === 'manager', cnDfir = () => G.trackId === 'dfir';
// The Clinic's state lives in G.cr.cn, made on arrival (saves from before this slice have none until then).
function cnC() { return G.cr.cn || (G.cr.cn = {activate: null, downtime: null, cover: null, ex: 0, aar: null, night12: null, board: null, boss: null, dojo: [false, false, false], requests: null}); }
// Nights 11 to 14 are in the week-2 rota (SD_ROTA, Nights 6 to 14): the on-call lead each night is the rota's.
function cnLead(n) { return typeof sdLead === 'function' ? sdLead(n) : null; }
function cnTired(n) { return typeof sdTired === 'function' ? sdTired(n) : false; }
// Night 12 uncovered: the firm's call finds nobody, and reaches Marisol at 06:50, so the boss's first hour runs an hour later (game).
function cnN12Open() { return !!(G.cr.cn && G.cr.cn.night12 && !G.cr.cn.night12.lead); }
function cnAt(t) { if (!cnN12Open()) return t; const m = +t.slice(0, 2) * 60 + +t.slice(3) + 60; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
const CN_DAY = {12: 'Friday', 13: 'Saturday', 14: 'Sunday', 15: 'Monday'};
const cnHm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

/* ---------- Map tiles that change as the arrival problems are fixed ---------- */
function cnTile(d, ch) {
  if (ch === 'Ð' && G.f.cnFixDesk) d.pal = 'cnDeskOk';    // check-in back on Wrenfold (Monday 07:30)
  if (ch === 'Ħ' && G.f.cnFixRoute) d.pal = 'cnRackOk';   // the clinic's night alerts routed to the Compact's on-call
  if (ch === 'Ŋ' && G.f.cnFixCart) d.pal = 'cnCartOk';    // the downtime cart: next day's schedule on paper, back-entry checklist
  return d;
}

/* ---------- Objective ---------- */
function cnObjective() {
  if (!G.trackId || !G.f.sdSummary) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'clinic', x: x, y: y, district: 'clinic'});
  if (!f.cnMet) return Object.assign(at('Riverbend Community Clinic: its door is on the west side of the square.', 28, 7), {step: true});
  if (cnMgr()) {
    if (!f.cnDowntime) return at('The clinic opens at 08:00. Marisol Quintero, in her office: paper or not?', 3, 12);
    if (!f.cnDrillA) return at('Kit’s note on the encrypted PCs: the server closet.', 17, 3);
    if (!f.cnDrillC) return at('Marisol wants the share restored now: her office.', 3, 12);
    if (!f.cnDrillB) return at('Did the vendor’s remote support connect? Kit, in the server closet.', 17, 3);
    if (!f.cnStaffing) return at('The weekend: who covers it? Marisol, in her office.', 3, 12);
    if (!f.cnNight12) return at('End the day at the staff room desk.', 27, 12);
    if (!f.cnBoss) return at('05:35: a post claims patient data. Marisol, in her office.', 3, 12);
    if (!f.cnStatus) return at('The firm’s status report: Lucia, in the incident room.', 22, 13);
    if (!f.cnNight13) return at('End the day at the staff room desk.', 27, 12);
    if (!f.cnAar) return at('Monday: the after-action review with Marisol. The incident room table.', 19, 11);
    if (!f.cnTabletop) return at('Tabletop: Wrenfold down for three days. The incident room table.', 19, 11);
  } else {
    if (!f.cnLetter) return at('Read the scoping letter with Renata Osei: the incident room.', 18, 13);
    if (!f.cnContain) return at('CL-FD-02 is isolated and running. Lucia, in the incident room.', 22, 13);
    if (!f.cnIntake) return at('Evidence intake: the evidence locker in the incident room.', 22, 12);
    if (!f.cnDrillA) return at('Question 1: which systems were encrypted? The bench.', 19, 11);
    if (!f.cnIntake2) return at('Three more items at the evidence locker.', 22, 12);
    if (!f.cnDrillB) return at('Question 2: the vendor’s remote support. The bench.', 19, 11);
    if (!f.cnDrillC) return at('Question 3: 412 record views on Thursday. Theo, in the incident room.', 18, 10);
    if (!f.cnReport) return at('Write CLN-01 for Renata Osei: the bench.', 19, 11);
    if (!f.cnNight12) return at('End the day at the staff room desk.', 27, 12);
    if (!f.cnBoss) return at('05:35: a post claims patient data. Lucia, in the incident room.', 22, 13);
    if (!f.cnNight13) return at('End the day at the staff room desk.', 27, 12);
  }
  if (!f.cnDirective) return at('Marisol wants a word about the exam-room login: her office.', 3, 12);
  if (!f.cnDojoDone) {
    if (!f.cnDojoMet) return at('(Optional) Bettina Ruiz’s ' + (cnMgr() ? 'Business Continuity' : 'Ransomware Forensics') + ' dojo, in the training room.', 26, 3);
    const i = cnC().dojo.findIndex(x => !x);
    return at('(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', [20, 22, 24][i], 1);
  }
  if (!f.cnBoard) return at('Take the Clinic Board challenge: Harriet Kowal, through the west door.', 8, 3, 'cnboard');
  if (!f.cnSummary) return at('Marisol wants to close the week: her office.', 3, 12);
  return {text: 'Community Clinic done. Next: Fire & EMS Dispatch.', done: true, district: 'clinic'};
}

/* ---------- Triggers, interactions, talk ---------- */
function cnTriggers() {
  if (G.map === 'clinic' && G.trackId && G.f.sdSummary && !G.f.cnMet) { run(cnArrive); return true; }
  return false;
}
function cnInteract(ch, tx) {
  if (!inClinic()) return false;
  const f = G.f;
  if (!f.cnMet && G.map === 'clinic') { if ('§£YÐŋĦŊ¤'.includes(ch)) { run(async () => { await say('The clinic is open to patients, not to you yet: the School District’s week isn’t closed.'); }); return true; } return false; }
  if (ch === '§') { run(cnTable); return true; }
  if (ch === '£') { run(async () => { if (cnDfir() && f.cnContain && !f.cnIntake) await cnIntake(); else if (cnDfir() && f.cnDrillA && !f.cnIntake2) await cnIntake2(); else await say(cnDfir() ? 'The clinic’s evidence store, case CLN: a locked case and a seal log, apart from the School District’s.' : 'The exercise kit: CISA’s tabletop templates, the clinic’s downtime binder, a box of index cards.'); }); return true; }
  if (ch === 'Y') { run(cnDesk); return true; }
  if (ch === 'Ð') { run(async () => { await say(f.cnFixDesk ? 'The front desk. Check-in is back on Wrenfold; a tray of Saturday’s paper forms waits to be entered, each with a tick.' : f.cnMet ? 'The front desk. Paper check-in forms, a pen on a string, and a note: “CL-FD-02: do not touch.”' : 'The front desk.'); }); return true; }
  if (ch === 'ŋ') { run(async () => { await say('An exam-room PC, signed in as “exam-shared” since 07:55, the way it is every day.'); }); return true; }
  if (ch === 'Ħ') { run(async () => { await say('The server closet: WF-01, which runs Wrenfold, and CL-FS-01, the shared drive. ' + (f.cnFixRoute ? 'A new label on the rack: “Night alerts → the Compact’s on-call.”' : 'Tetherline’s agent light blinks on WF-01, always on.')); }); return true; }
  if (ch === 'Ŋ') { run(async () => { await say(f.cnFixCart ? 'The downtime cart: paper forms, tomorrow’s schedule printed last night, and a back-entry checklist with two signature boxes.' : 'The downtime cart: check-in forms, visit forms and a blank schedule sheet. The binder on top is dated 2022.'); }); return true; }
  if (ch === '¤') { run(() => cnDojoPuzzle([20, 22, 24].indexOf(tx))); return true; }
  if (ch === '±') { run(async () => { await say('The Board’s minutes, by year. This year’s binder has a tab marked “Compact”.'); }); return true; }
  return false;
}
async function cnTalk(npc) {
  if (!CN_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.cnMet) { await say(f.sdSummary ? 'Please come in: Marisol is expecting you.' : 'Once the School District’s week is closed, the practice manager would like a word.', who); return true; }
  switch (npc.id) {
    case 'marisol':
      if (cnMgr() && !f.cnDowntime) { await cnDowntimeTask(); break; }
      if (cnMgr() && f.cnDrillA && !f.cnDrillC) { await cnDrillC(); break; }
      if (cnMgr() && f.cnDrillB && !f.cnStaffing) { await cnStaffing(); break; }
      if (cnMgr() && f.cnNight12 && !f.cnBoss) { await cnBoss(); break; }
      if (f.cnNight13 && !f.cnDirective && (cnDfir() || f.cnTabletop)) { await cnDirective(); break; }
      if (f.cnBoard && f.cnDirective) { await cnSummary(); break; }
      await say(cnMgr() ? 'I run the clinic. You tell me what I’m deciding, and what it costs.' : 'Renata says the firm reports to her. Fine by me, as long as somebody tells me when I can have my front desk back.', who); break;
    case 'kit':
      if (cnMgr() && f.cnDowntime && !f.cnDrillA) { await cnDrillA(); break; }
      if (cnMgr() && f.cnDrillC && !f.cnDrillB) { await cnDrillB(); break; }
      await say(f.cnFixRoute ? 'Night alerts go to the Compact’s on-call now. I sleep better already.' : 'Kit Ambrose. I keep the clinic’s PCs running for the Compact. CL-FD-02 hasn’t been touched since I isolated it.', who); break;
    case 'osei':
      if (cnDfir() && !f.cnLetter) { await cnLetterTask(); break; }
      await say('Facts to me. Who receives the firm’s reports is mine to decide. What patients are told is Tomasz’s decision, with me.', who); break;
    case 'weller':
      await say(f.cnBoss ? 'I have the field list, inactive records included. What patients are told is my decision, with Renata, and it rests on that list.' : 'Tomasz Weller, privacy officer. Patient-privacy questions come to me, and I decide them with counsel. Bring me facts.', who); break;
    case 'okonjo':
      await say(f.cnFixDesk ? 'Back on Wrenfold. Saturday’s paper goes in with a second pair of eyes on every form.' : 'I found the note at ten past seven and rang Marisol straight away. The paper forms work. They’re just slow.', who); break;
    case 'vidal':
      await say(f.cnFixCart ? 'Tomorrow’s schedule is printed every night now, and the checklist has two signature boxes.' : 'Ines Vidal, nurse lead. The exam rooms are on Wrenfold as normal. If it goes down, we have the cart, and an old binder.', who); break;
    case 'ruiz': await cnDojoIntro(); break;
    case 'kowal': await cnBoardScript(); break;
    case 'luciacn':
      if (cnDfir() && f.cnLetter && !f.cnContain) { await cnContainTask(); break; }
      if (cnDfir() && f.cnNight12 && !f.cnBoss) { await cnBoss(); break; }
      if (cnMgr() && f.cnBoss && !f.cnStatus) { await cnStatusReport(); break; }
      await say(cnDfir() ? 'Preserve first, then answer the questions in the letter, and nothing beyond them without Renata.' : 'Our report goes to Renata; you get the status, the same day.', who); break;
    case 'theocn':
      if (cnDfir() && f.cnDrillB && !f.cnDrillC) { await cnDrillCDfir(); break; }
      await say('Theo. The clinic’s evidence is in its own store. I checked twice.', who); break;
  }
  return true;
}

/* ---------- Arrival (Day 12, Friday) ---------- */
async function cnArrive() {
  const f = G.f, c = cnC();
  f.cnMet = true; G.day = Math.max(G.day, 12); G.focus = G.focusMax; touchCSF('Respond');
  const n11 = cnLead(11);
  await say('Day 12, Friday, 07:20. Riverbend Community Clinic. (The School District’s week closed yesterday. game)');
  await say('I came in at ten past seven and CL-FD-02 had a note on it. Files on the shared drive won’t open. I rang Marisol at 07:12.', 'Joy Okonjo');
  await say('Marisol Quintero, practice manager. I rang the Compact’s day line at 07:18. And three more things, plainly: the exam rooms run on one shared login all day, our downtime binder has never been opened, and Wrenfold’s vendor has a support tool on our server that is always on.', 'Marisol Quintero');
  await say('(Night 11’s on-call lead, ' + (n11 ? n11 : 'nobody: the night was uncovered') + ', had no page: the clinic’s alerts went only to its own console, which nobody watches at night. game)');
  unlock('fact', 'cnhipaa'); unlock('fact', 'cnhicp');
  if (cnMgr()) {
    await say('07:25, your advice, with Marisol agreeing: isolate CL-FD-02 with the endpoint tool, leaving it running so its memory is kept; stop sharing the drive on CL-FS-01, leaving the server up; leave the PCs that show the note running, off the share. Clear nothing, restore nothing. Kit does it at 07:30–07:34. (game)');
    await say('07:35, the Clinic’s annex to the Compact’s plan: the retainer is called when patient information may have been reached, wherever it is held; when ransomware or another destructive attack is found on any clinic system; or when the on-call lead can’t contain an incident. (game)');
    let mins = CN_ACT_OK;
    while (true) {
      const items = CN_ACTIVATE.map(o => ({label: o.label, meta: {good: !!o.good}}));
      const i = await UI.openModal('The annex’s test', '<p>A ransom note on CL-FD-02; files on S: renamed. S: holds the front desk’s daily lists. Are the annex’s criteria met?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      mins += CN_ACT_LATE;
      await say(CN_ACTIVATE[i].why + ' (+' + CN_ACT_LATE + ' game minutes)');
    }
    c.activate = mins; G.cr.activate = mins; track();
    // Each wrong answer is a later call (game): the call, its acknowledgement and counsel's engagement follow from it.
    const call = 7 * 60 + 35 + (mins - CN_ACT_OK), ack = call + CN_ACT_OK, eng = Math.max(8 * 60, ack + 5);
    const retainer = cnHm(call) + ' retainer line called · ' + cnHm(ack) + ' Tallowmere acknowledges. Renata Osei, counsel for the Clinic, engages the firm at ' + cnHm(eng) + ' under a letter, and tells the clinic’s cyber insurer. Wrenfold’s incident clause, §8, and its escalation line are already on the plan’s contact page (Slate Badge). (game)';
    const alert = '07:40: Kit finds the endpoint tool’s 05:33 alert on the clinic’s console: “Ransomware behaviour (high)”, CL-FD-02. Nobody saw it at night. (game)';
    if (call <= 7 * 60 + 40) { await say(retainer); await say(alert); } else { await say(alert); await say(retainer); }
    await say('The doors open at eight. I have to decide about paper before then. My office.', 'Marisol Quintero');
  } else {
    const lead = G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz';
    await say('07:20: ' + lead + ', the town’s acting team lead, answered the Compact’s day line and had Kit, the Compact’s technician, follow the plan’s runbook: CL-FD-02 isolated with the endpoint tool at 07:30, left running; the drive unshared on CL-FS-01 at 07:34; nothing cleared, nothing restored. 07:40: Kit found the 05:33 alert nobody saw at night. (game)');
    await say('07:45: Marisol decides the front desk checks patients in on the paper forms from the downtime cart; the exam rooms stay on Wrenfold, watched. The clinic opens at 08:00. (game)');
    await say('08:00: Renata Osei, counsel for the Clinic, engages Tallowmere under a letter, and tells the clinic’s cyber insurer. (The Compact has no IR manager applying the Clinic’s annex: counsel engages the firm, as before. game)');
    await say('You lead it. The incident room is ours. Renata first: nothing gets collected before the letter, and Kit has touched nothing since he isolated it.', 'Lucia Ferrand');
  }
}

/* ---------- Manager: the downtime decision (07:45) ---------- */
async function cnDowntimeTask() {
  const c = cnC(), who = 'Marisol Quintero';
  await say('Thirty-one patients this morning, the first at eight. CL-FD-02 is isolated, the drive is off, and the other two front-desk PCs show the same note. What do I do with my clinic?', who);
  let first = true;
  while (true) {
    const items = CN_DOWNTIME.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Downtime · 07:45', '<p>The front desk can’t use the share, and nobody has checked the PCs that show the note. Wrenfold (WF-01) shows nothing, and the exam rooms use it. Who decides, and what?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false; await say(CN_DOWNTIME[i].why);
  }
  c.downtime = {first: first};
  G.f.cnDowntime = true; unlock('act', 'cndowntime'); touchCSF('Recover'); track();
  await say('My decision: the front desk goes to the paper forms on the cart, the exam rooms stay on Wrenfold, and if anything else alerts, the whole clinic goes to paper. (game)', who);
  await say('07:50: the downtime binder, opened for the first time. Its call tree names two people who have left, and it has no step for entering the paper back into Wrenfold. 08:00: the clinic opens, check-in on paper. (game)');
  await say('Kit is in the server closet with a note about the PCs. Read it before anyone touches them.', who);
}

/* ---------- The incident room table (manager: the AAR and the tabletop; DFIR: the bench) ---------- */
async function cnTable() {
  const f = G.f;
  if (cnMgr()) {
    if (f.cnNight13 && !f.cnAar) return cnAar();
    if (f.cnAar && !f.cnTabletop) return cnTabletop();
    return say(f.cnTabletop ? 'The table: six index cards, each with an owner and a date.' : 'The incident room table. Monday’s review will be here.');
  }
  if (!f.cnLetter) return say('The bench. Renata has the letter; read it with her first.');
  if (f.cnIntake && !f.cnDrillA) { await cnDrill('hostsdfir'); f.cnDrillA = true; touchCSF('Detect'); await say(G.cr.drills.hostsdfir.supported ? 'One PC, and the share files it could reach, from C-03 and C-04.' : 'Question 1 has its answer, but write it only from what you’ve read.', 'Lucia Ferrand'); await say('11:15: our first note to Renata, and with her agreement to Weller: one PC encrypted, the way in, and the archive likely what left. (game)', 'Lucia Ferrand'); await say('Three more items will be at the locker after lunch: the vendor’s tool, Wrenfold’s audit, and the vendor’s own word.', 'Lucia Ferrand'); return; }
  if (f.cnIntake2 && !f.cnDrillB) { await cnDrill('tetherdfir'); f.cnDrillB = true; touchCSF('Detect'); await say('No session, from C-06 and C-08. R-01 stays logged and dated. Theo has something in Wrenfold’s audit.', 'Lucia Ferrand'); return; }
  if (f.cnDrillC && !f.cnReport) return cnReport1();
  return say('Your bench: working copies only. The originals are sealed in the store.');
}

/* ---------- Drills ---------- */
async function cnDrill(key) {
  const c = G.cr;
  const r = await doDrill(CN_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (cnDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function cnDrillA() {
  await say('My note to Marisol at 09:45. Read it like you’d read anyone’s.', 'Kit Ambrose');
  const r = await cnDrill('hostsmgr');
  G.f.cnDrillA = true; touchCSF('Detect');
  await say(r.verdictOk ? 'One PC, then, and the share. I counted tickets, not files.' : 'The endpoint records say one PC, and the share’s audit says every write came from it. I’ll count files next time.', 'Kit Ambrose');
  await say('11:15, the firm’s first note: an attachment saved to S:\\FrontDesk\\Scans at 16:47 on Thursday and opened on CL-FD-02 at 16:48; an archive of the front desk’s daily lists and the recall list made at 05:12, and 38 MB sent to 203.0.113.61 at 05:14–05:19. Likely what left; the firm is checking. (game)');
  await say('11:20: you pass it to Tomasz Weller and Renata Osei: what patients are told is Weller’s decision, with counsel. (Kit blocked 203.0.113.61 at the clinic’s firewall at 10:35, at the firm’s request, the moment it was seen; the check-out desk account’s password was reset at 08:40, right after the firm’s 08:35 memory capture. game)');
  await say('Marisol wants the shared drive back. She’s in her office.');
}
async function cnDrillC() {
  await say('The backup ran at one this morning and the encryption was at half past five, so last night’s copy is clean. Restore it, please. The front desk is drowning in paper.', 'Marisol Quintero');
  const r = await cnDrill('restore');
  G.f.cnDrillC = true; touchCSF('Recover');
  await say(r.verdictOk ? 'Not as it stands, then: the copy has Thursday’s attachment in it. Tomorrow at two, without that file, once the firm says the way in is closed. My decision.' : 'The attachment reached the share the afternoon before the backup. Tomorrow at two, without that file, once the firm says the way in is closed. My decision.', 'Marisol Quintero');
  await say('The front desk stays on paper through Saturday’s hours. Kit wants a word about the vendor’s tool.', 'Marisol Quintero');
}
async function cnDrillB() {
  await say('13:10: Wrenfold’s support manager rang back on the escalation line from the plan’s contact page, and put it in writing at 13:25. (game)');
  await say('The vendor’s tool lights up every night at three. Was it them?', 'Kit Ambrose');
  const r = await cnDrill('tethermgr');
  G.f.cnDrillB = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Heartbeats, not sessions. Still, an always-on agent is a door left on the latch.' : 'The session log says nothing since Tuesday, and the vendor says the same on a number we had. The 03:00 lines are the agent checking in.', 'Kit Ambrose');
  await say('15:00: the firm clears the four PCs that showed the note: no encryption, no loader. Marisol keeps check-in on paper until the share is back. She wants to talk about the weekend. (game)');
}
async function cnDrillCDfir() {
  const cu = G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0});
  await say('15:10: C-09, the front desk’s task sheet for Thursday and next week’s appointment count, scanned by Marisol, hashed on receipt, the paper sealed. (game)');
  cu.items++; cu.complete++;
  await say('Four hundred and twelve record views from one front-desk account on Thursday afternoon, the day before. Staging?', 'Theo Marchetti');
  const r = await cnDrill('views');
  G.f.cnDrillC = true; touchCSF('Detect');
  await say(r.verdictOk ? 'The reminder calls, one at a time, from desk 1. I’d have written “staging” from the count.' : 'Desk 1, one record at a time, with next week’s list beside it. A count is a reason to look.', 'Theo Marchetti');
  await say('CLN-01 for Renata, at the bench, when you’re ready.', 'Lucia Ferrand');
}

/* ---------- Manager: the weekend plan (Friday 15:30) ---------- */
async function cnStaffing() {
  const c = cnC(), who = 'Marisol Quintero';
  await say('Saturday is four hours of clinic on paper, then Kit restores the drive. Sunday the clinic is shut. Who covers the weekend, and who covers our nights from now on?', who);
  const fc = o => '<li>' + esc(o.label.split(':')[0].split(',')[0]) + ': overtime forecast ' + o.overtime + ' h of ' + SD_ROTA.budget + ', gaps ' + o.gaps + ' h (game)</li>';
  let pick;
  while (true) {
    const items = CN_COVER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The weekend', '<p>Nights 12 to 14 are already in the week-2 rota. The days, and the clinic’s night alerts, are not (game).</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    pick = CN_COVER[i];
    if (pick.good) break;
    await say(pick.why);
  }
  c.cover = {k: pick.k, gaps: pick.gaps, overtime: pick.overtime, variance: Math.round((pick.overtime - SD_ROTA.budget) / SD_ROTA.budget * 100)};
  const r = G.cr.sd && G.cr.sd.rota, nights = [12, 13, 14].map(n => 'Night ' + n + ' (' + CN_DAY[n] + ' to ' + CN_DAY[n + 1] + '): ' + (cnLead(n) || 'nobody') + (cnTired(n) ? ', a third night or more in a row: a thin first look on any call' : ''));
  await UI.openModal('The weekend · the plan', '<ul>' + CN_COVER.map(fc).join('') + '</ul>' + (r ? rotaTable(SD_ROTA, r.assign) : '') + '<ul>' + nights.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p class="small">Day shifts: Kit, and a lead who wasn’t on call the night before, 07:00–19:00, written handovers. The firm’s retainer hours for the forensic work. (game)</p>',
    [{label: 'Sign it', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.cnStaffing = true; G.f.cnFixRoute = true; unlock('act', 'cnweekend'); unlock('act', 'crcover'); touchCSF('Govern'); track();
  await say('Signed. At night, a page only for ransomware or anything destructive, bulk reads or exports of Wrenfold, any Tetherline session, or anything claimed or published about clinic data. The rest waits for 07:00. (game)', who);
  await say('17:00, the firm’s Friday status: one PC encrypted, and the share files it could reach; the way in, Thursday’s attachment; no vendor session; the archive likely what left. Weller and Renata have it. (game)');
  await say('End the day when you’re ready.');
}

/* ---------- Manager: the AAR (Monday 09:00) ---------- */
async function cnAar() {
  const c = G.cr, n = cnC(), who = 'Marisol Quintero';
  await say('Blameless, please. I don’t want a name. I want to know why one click cost us a weekend.', who);
  const items = CN_FACTORS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> contributing factors the AAR should record.</p>' + shownOrder(CN_FACTORS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('AAR · contributing factors', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !CN_FACTORS[i].good);
  for (const i of wrong) await say(CN_FACTORS[i].name + ': ' + (CN_FACTORS[i].id === 'user' ? 'a name, not a cause. One click did this much because of the share, the lists and the routing.' : CN_FACTORS[i].id === 'vendor' ? 'drill B found no session in the window. The way in was the attachment.' : 'it ran at 01:00 and the share was restored from it on Saturday.'));
  await say('The three actions arrive with the owners the Board approved (Bookmark Badge). What’s left is the dates.');
  let onTime = 0;
  for (const a of CN_AAR) {
    let ok = true;
    const opts = a.dates.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · due date', '<div class="card"><b>' + esc(a.name) + '</b><br>Owner: ' + esc(a.owner) + '</div><p>When is it due?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      ok = false; await say(a.dates[i].why);
    }
    if (ok) onTime++;
  }
  c.aar = {total: ((c.aar && c.aar.total) || 0) + CN_AAR.length, onTime: ((c.aar && c.aar.onTime) || 0) + onTime};
  n.aar = {factorsWrong: wrong.length, onTime: onTime};
  G.f.cnAar = true; unlock('act', 'cnaar'); unlock('act', 'craar'); touchCSF('Govern'); track();
  await say('Three actions, three owners, three dates, and nobody blamed. Now the other thing the binder taught me: the tabletop, at this table.', who);
}

/* ---------- Manager: the tabletop, Wrenfold down for three days (Monday 11:00) ---------- */
async function cnTabletop() {
  const c = G.cr, who = 'Marisol Quintero';
  await say('Ines and I have an hour. What if it had been Wrenfold itself, down for three days?', who);
  while (true) {
    const items = CN_OBJECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Tabletop · the objective', '<p>Scenario: Wrenfold down for three days. CISA’s tabletop packages give the templates (game: the scenario is the clinic’s own).</p><p>What is the exercise for?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(CN_OBJECTIVE[i].why);
  }
  for (const inj of CN_INJECTS) {
    const items = inj.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Tabletop · inject', '<p><b>' + esc(inj.t) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(inj.opts[i].why);
    }
  }
  c.ex.run += 1; c.ex.actions += CN_EX_ACTIONS; cnC().ex = CN_EX_ACTIONS; track();
  G.f.cnTabletop = true; unlock('act', 'crtabletop'); unlock('fact', 'crctep'); touchCSF('Recover'); touchCSF('Govern');
  await say('Three gaps, three actions (game): a paper print of the next day’s schedule and contact sheet every night, kept in the cart (Marisol; Kit sets it up; by 16:00 today); a back-entry checklist with a second-person check (Ines Vidal; by 16:00 today); the binder’s call tree and Wrenfold’s escalation line updated, and a 20-minute downtime drill each quarter (Marisol; the update by 16:00 today).', who);
  await say('And the exam-room login. I want a word about it, in my office.', who);
}

/* ---------- The directive (both tracks): keep the shared exam-room login ---------- */
async function cnDirective() {
  const who = 'Marisol Quintero', t = G.trackId;
  if (G.f.cnDirective) { await say('Two rooms from next week. My decision, and my signature on the risk until then.', who); return; }
  await say('One thing I won’t give up: the shared login in the exam rooms. Individual logins slow every visit, and my patients wait long enough.', who);
  if (t === 'dfir') await say('Renata says you can tell me what the case showed. Does the login matter?', who);
  const L = CN_DIRECTIVE[t];
  while (true) {
    const items = L.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose(t === 'dfir' ? 'What do you tell Marisol?' : 'How do you answer the practice manager?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(L[i].why);
  }
  await say(t === 'dfir' ? 'The fact from the case: Thursday’s 412 views could be answered because the front desk signs in by name. In the exam rooms, Wrenfold’s audit shows one name, “exam-shared”, so who viewed what there can’t be answered. The options are hers. Renata agreed I could say that much.' :
    'A workable alternative: each clinician signs in once a day, then taps back in at each exam PC with a badge or a short PIN, and the screen locks after a few idle minutes. Try it in two rooms for two weeks. Then it is her decision, and she records the risk she accepts until then.');
  await say('Two rooms from next week; all six by Day 45 if it works. Until then I accept the shared login, in writing. My decision. (game)', who);
  G.f.cnDirective = true; unlock('act', 'cnreauth'); touchCSF('Protect');
  await say(cnMgr() ? '(Present the trade-off; the owner decides.)' : '(Give the facts; the owner decides.)');
}

/* ---------- DFIR D1: the scoping letter ---------- */
async function cnLetterTask() {
  const who = 'Renata Osei', f = G.f;
  const row = (k, v) => '<tr><th style="vertical-align:top;white-space:nowrap">' + k + '</th><td>' + v + '</td></tr>';
  const letter = '<p><b>Scoping letter · Tallowmere Forensics · case CLN-01 (game)</b></p><table class="sc letter">' +
    row('Engaged by', 'Renata Osei, counsel for the Clinic') +
    row('Questions', '1. Which clinic systems were encrypted, and how did the attack get in?<br>2. Did the records vendor’s remote-support access play any part?<br>3. Was patient information accessed or taken, and which?') +
    row('In scope', 'The clinic’s PCs and servers (CL-FD-01 to 03, CL-EX-01 to 06, CL-FS-01, WF-01), Wrenfold’s audit, CL-FW, the Tetherline console') +
    row('Can’t see', 'Wrenfold Health Software’s own systems: requests through counsel, logged when sent') +
    row('Report to', 'Renata Osei, who decides who receives it. Patient-privacy questions: Tomasz Weller, with counsel') +
    row('Counsel', 'privilege and the law are counsel’s; the firm reports facts. Anything outside the questions goes to counsel first.') + '</table>';
  await say('Read it before you touch anything. The PC is isolated and running, and the clinic is open on paper. Both of those matter to how you work.', who);
  while (true) {
    const items = CN_LETTER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The scoping letter', letter + '<p><b>Your first step?</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(CN_LETTER[i].why);
  }
  f.cnLetter = true; unlock('act', 'crscope'); touchCSF('Govern'); track();
  await say('Lucia is waiting for you with Kit. CL-FD-02 first.', who);
}

/* ---------- DFIR D2: containment that preserves ---------- */
async function cnContainTask() {
  const who = 'Lucia Ferrand';
  await say('CL-FD-02 has been isolated since 07:30 and it is still running. The share is unshared. Kit is standing by. In what order?', who);
  while (true) {
    const items = CN_CONTAIN.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Containment that preserves · 08:20', '<p>CL-FD-02: isolated by the endpoint tool, powered, untouched. CL-FS-01: up, not sharing. Nothing restored. What now?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(CN_CONTAIN[i].why);
  }
  G.f.cnContain = true; unlock('act', 'cnpreserve'); touchCSF('Respond'); track();
  await say('08:35: Kit captures CL-FD-02’s memory under our instruction, hashed at collection. 08:40: with the memory kept, the check-out desk account’s password is reset. 08:55: he shuts it down; 09:10–09:50 he images the disk with a write blocker, hashed. 09:00: the endpoint tool’s telemetry; 09:05: the firewall log; 09:20: the share’s snapshot and audit, before any restore. The evidence locker, when you’re ready. (game)', who);
}

/* ---------- DFIR D3: evidence intake; the vendor request; the Quiet Thread ---------- */
async function cnIntake() {
  const c = G.cr, cu = c.custody || (c.custody = {items: 0, complete: 0, gaps: 0});
  await say('Five items: memory and the disk from Kit, the endpoint telemetry, the share, the firewall. Log each one: who, when, the hash on receipt against the form, where the original is sealed. Work on copies.', 'Lucia Ferrand');
  for (const it of [CN_INTAKE.c01, CN_INTAKE.c02, CN_INTAKE.c03, CN_INTAKE.c04, CN_INTAKE.c05]) {
    let first = true;
    const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 12. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      first = false; cu.gaps++;
      await say(it.opts[i].why);
    }
    const inherent = !!it.opts.find(o => o.good).gap;
    cu.items++; if (inherent) cu.gaps++;
    if (first && !inherent) cu.complete++;
    if (it.id === 'C-04') await cnQtEvidence();
    if (it.id === 'C-05') await say('The firewall log’s hash on receipt matches Kit’s export hash: the file is unchanged. The handover through Marisol’s office stays in the log as a gap. (game)');
  }
  const cn = cnC(); cn.requests = {date: 'Day 12 (Friday) 10:15'};
  G.f.cnIntake = true; unlock('act', 'crcustody'); touchCSF('Respond'); track();
  await say('10:15, through Renata: a request to Wrenfold Health Software for its own relay records of Tetherline sessions to the clinic’s agent. Logged as it went: R-01, “requested Day 12 (Friday) 10:15” (Slate Badge). (game)', 'Lucia Ferrand');
  await say('10:30: C-05 shows 38.4 MB from CL-FD-02 to 203.0.113.61 at 05:14–05:19. At our request Kit blocks the address at the clinic’s firewall at 10:35, the moment we see it: blocking keeps every record. Question 1 is on the bench; Renata gets a first note when it has an answer. (game)', 'Lucia Ferrand');
}
// The Quiet Thread clue, seen in C-04 (DFIR). Noticing is the mechanic: the prompt opens on "Leave it".
async function cnQtEvidence() {
  if (qtFound('cn-folders')) return;
  const i = await choose('C-04, the share audit. Question 1 needs the writes from 05:31 to 05:44. The audit runs on through the night.', [{label: 'Read the rest of the night’s audit too'}, {label: 'Leave it: question 1 has what it needs'}], {cursor: 1});
  if (i !== 0) return;
  await say('03:14, Night 11: svc-print, from FD-STAFF-11’s address, lists the folders of CL-FS-01’s Facilities share (building plans, the generator’s service records) for under a minute, and opens no file. Nothing alerted. What listed them, and why, is unknown. The ransomware’s writes, two hours later, came from CL-FD-02’s session; nothing in the evidence links the two.');
  await say('Not one of the letter’s questions. It goes to Renata first; with her agreement, to Lucia and Rae’s suspicion-file team. Nothing changes on svc-print without a plan.');
  await crQtAfterNote(qtNote('cn-folders'));
}
async function cnIntake2() {
  const c = G.cr, cu = c.custody || (c.custody = {items: 0, complete: 0, gaps: 0});
  await say('C-06, Tetherline’s session log, exported by Kit at 11:50, and C-07, Wrenfold’s access audit for 30 days, exported by Kit from WF-01 at 12:10: both hashed at export, logged and sealed. (game)', 'Lucia Ferrand');
  cu.items += 2; cu.complete += 2;
  let first = true;
  const it = CN_INTAKE_VENDOR, opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
  while (true) {
    const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 12. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
    if (opts[i].meta.good) break;
    first = false; cu.gaps++;
    await say(it.opts[i].why);
  }
  cu.items++; if (first) cu.complete++;
  G.f.cnIntake2 = true; touchCSF('Respond'); track();
  await say('Question 2 is on the bench when you are.', 'Lucia Ferrand');
}

/* ---------- DFIR: CLN-01 ---------- */
async function cnReport1() {
  const c = G.cr;
  const r = await doReport(CN_REPORT_1);
  c.reports.cn1 = {score: r.score, over: r.over, under: r.under};
  c.corrected += r.over; track();
  G.f.cnReport = true; G.f.cnFixRoute = true; touchCSF('Respond');
  await say('To Renata at 17:00. With her agreement the recommendations went to Marisol, who accepted them: the clinic’s night alerts to the Compact’s on-call (done at 15:30 under a threshold Marisol signed), attachments no longer saved to a share every front-desk PC can write, the daily lists kept seven days and the recall list run inside Wrenfold, Tetherline on demand only with MFA, and named sign-in in the exam rooms, which is her decision. (game)', 'Lucia Ferrand');
  await say('End the day when you’re ready.', 'Lucia Ferrand');
}

/* ---------- The desk: end the day, and the nights between ---------- */
async function cnDesk() {
  const f = G.f, mgr = cnMgr();
  const ready = mgr ? ((f.cnStaffing && !f.cnNight12) || (f.cnStatus && !f.cnNight13)) : ((f.cnReport && !f.cnNight12) || (f.cnBoss && !f.cnNight13));
  if (!ready) { await say('A hot desk in the staff room. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.cnNight12) await cnNight12(); else await cnWeekend();
}
async function cnNight12() {
  const c = cnC(), lead = cnLead(12), tired = cnTired(12), first = lead ? lead.split(' ')[0] : null;
  const run = tired && G.cr.sd && G.cr.sd.rota ? rotaRunAt(G.cr.sd.rota.assign, 12 - SD_ROTA.first) : 0;
  const body = '<p>Night 12 (Friday to Saturday). On call: <b>' + esc(lead || 'nobody') + '</b>' + (tired ? ' (night ' + run + ' in a row)' : '') + '.</p>' +
    '<p>05:35: an email to Marisol and the clinic’s public inbox. 05:40: a post on leaks.example names the clinic. 05:50: Tallowmere’s leak-site watch sees it and rings the Compact’s on-call number, which the clinic’s new threshold pages for. ' +
    (first ? first + ' takes the page' + (tired ? ', on a third night or more in a row: a thin first look, with fewer facts in it' : ': a clear first look, the post captured and the email forwarded as received') + '.' : 'Nobody is on call: the call goes unanswered, and the firm rings Marisol at 06:50.') + ' (game)</p>';
  await UI.openModal('Night 12', body, [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 13; G.focus = G.focusMax;
  c.night12 = {lead: lead, tired: tired};
  if (tired && cnMgr()) { G.focus = Math.max(10, G.focus - 10); await say('You were up at 05:55 with a tired on-call lead. Focus ' + G.focus + '/' + G.focusMax + ' this morning. (game)'); }
  G.f.cnNight12 = true;
  await say(cnMgr() ? (!lead ? 'Day 13, Saturday, 07:10. Marisol is in her office with the email open. The doors open at eight, on paper.' : tired ? 'Day 13, Saturday, 06:15. Marisol is in her office with the on-call lead’s thin note: a post names the clinic, something about patients.' : 'Day 13, Saturday, 06:15. Marisol is in her office with the email, forwarded as received by the on-call lead at 05:58. The doors open at eight, on paper.') : 'Day 13, Saturday, ' + cnAt('06:20') + '. Renata has engaged the firm again. Lucia is in the incident room.');
  track();
}
async function cnWeekend() {
  const n13 = cnLead(13), n14 = cnLead(14);
  await UI.openModal('Sunday', '<p>Night 13 (Saturday to Sunday): on call <b>' + esc(n13 || 'nobody') + '</b>. Night 14 (Sunday to Monday): on call <b>' + esc(n14 || 'nobody') + '</b>. No page on either.</p>' +
    '<p>Sunday: ' + (cnMgr() ? 'the weekend plan you signed with Marisol held' : 'the acting team lead’s weekend plan held') + '. Two day shifts with written handovers, nobody past twelve hours. The clinic was shut. (game)</p>', [{label: 'Monday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 15; G.focus = G.focusMax;
  G.f.cnNight13 = true; G.f.cnFixDesk = true;
  await say('Day 15, Monday, 07:30. Check-in is back on Wrenfold. Ines Vidal’s team enters Saturday’s paper with a checklist they wrote on the spot: the binder had no step for it. (game)');
  await say(cnMgr() ? 'Marisol wants the after-action review at nine, at the incident room table.' : 'Marisol wants a word about the exam-room login. Her office.');
  track();
}

/* ---------- Dojo (Bettina Ruiz; original puzzles) ---------- */
function cnDojo() { return cnMgr() ? CN_DOJO_MGR : CN_DOJO_DFIR; }
async function cnDojoIntro() {
  const who = 'Bettina Ruiz', f = G.f;
  if (!f.cnDirective) { await say('Bettina Ruiz, clinical educator. The training terminals are free once your week’s work is done.', who); return; }
  if (!f.cnDojoMet) { f.cnDojoMet = true; await say(cnMgr() ? 'Business Continuity: three terminals. What keeps care going when the systems don’t.' : 'Ransomware Forensics: three terminals. What a note proves, what memory holds, and what you can say about what left.', who); return; }
  if (f.cnDojoDone) { await say(cnMgr() ? 'Practise the paper. Preserve, then restore. The person who runs the clinic decides.' : 'A note isn’t a count. Memory first. Write what left, and no more.', who); return; }
  await say('Puzzles solved: ' + cnC().dojo.filter(Boolean).length + ' of 3. The terminals are behind you, along the north wall.', who);
}
async function cnDojoPuzzle(i) {
  const f = G.f, c = cnC();
  if (i < 0) return;
  if (!f.cnDojoMet) { await say('A training terminal. Talk to Bettina first.'); return; }
  const p = cnDojo()[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who has to act on it would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF(cnMgr() ? 'Recover' : 'Detect');
  if (!c.dojo.every(Boolean) || f.cnDojoDone) return;
  f.cnDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2);
  await say('All three. Focus ' + G.focusMax + ' (game).', 'Bettina Ruiz');
}

/* ---------- The Clinic Board ---------- */
async function cnBoardScript() {
  const who = 'Harriet Kowal', f = G.f, c = cnC();
  if (f.cnBoard) { await say('The Pulse Badge says the clinic trusts how you work. Keep earning it.', who); return; }
  if (!f.cnDirective) { await say('The Board sits once your week’s work is done.', who); return; }
  await say('The Clinic Board. Three questions, the way patients and staff put them to us. We grade the answer we can act on.', who);
  const specs = cnMgr() ? CN_BOARD_SPECS_MGR() : CN_BOARD_SPECS_DFIR();
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
  f.cnBoard = true; f.cnPulse = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the Clinic Board. This is the Pulse Badge (game).', who);
  await say(cnMgr() ? 'Its power, from the next district on: every downtime decision arrives with its owner and its paper fallback already named. And you carry a little more now: Focus +4.' : 'Its power, from the next district on: every host you contain arrives with its memory captured before shutdown. And you carry a little more now: Focus +4.', who);
  touchCSF('Govern');
  await say('Marisol wants to close the week in her office.');
}

/* ---------- The boss (game-original): a post claiming patient data, the clinic on paper ---------- */
async function cnStages(S, keys) {
  const b = cnC().boss;
  for (const k of keys) {
    const st = S[k];
    const items = st.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal(st.title, '<ul>' + st.clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(st.resp[i].why);
    }
    b.first.push(first);
  }
}
async function cnBoss() {
  const c = cnC(), n12 = c.night12 || {lead: cnLead(12), tired: cnTired(12)};
  c.boss = {first: [], look: n12.tired ? 'thin' : n12.lead ? 'clear' : 'none'};
  if (cnMgr()) {
    await say(c.boss.look === 'thin' ? 'A post names us, “something about patients”: that’s all the note says. I’ll have the email itself in a minute. The doors open at eight. Tell me what we do, and in what order.' : '“We have 12,000 patients’ full medical records.” Twenty rows, with names and appointment times. The doors open at eight. Tell me what we do, and in what order.', 'Marisol Quintero');
    await say((c.boss.look === 'none' ? 'No first look: Night 12 had nobody on call, so the firm rang Marisol at 06:50.' : c.boss.look === 'thin' ? 'The night’s on-call lead, on a third night running, sent a thin first look: the email and the sample come later, from Marisol.' : 'The night’s on-call lead sent a clear first look: the post captured, the email forwarded as received.') + ' The firm has been on this since Friday. (game)');
    const S = cnMgrBossStages();
    await cnStages(S, ['s1']);
    await say(cnAt('06:40') + ': Renata and Weller are on their way. The firm has the email and the capture. Harriet Kowal is told, and Renata updates the clinic’s cyber insurer. 08:00: the doors open; check-in on paper, as planned. (game)');
    await cnStages(S, ['s2']);
    await say('09:00: Kowal heard what we know, what we don’t, who decides what patients are told, and 13:00 for the next update. The front desk has Weller’s script, agreed with Renata. 12:00: Saturday’s hours close on paper, every booked patient seen. (game)');
    await cnStages(S, ['s3']);
    await say('14:00–17:00: Kit restores S: from Friday’s 01:00 copy without the attachment, on Marisol’s decision and the firm’s go-ahead. 15:00: the Clinic Board, with Renata and the insurer, decides not to pay. With Renata’s agreement the FBI has the email and the post, as the plan’s contact page says. Weller, with counsel, decides what patients are told, from the field list, inactive records included. (game)');
  } else {
    await say('Renata engaged us again at ' + cnAt('06:20') + ': what the post shows, and what left. Your case.', 'Lucia Ferrand');
    const cu = G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0});
    const open = c.boss.look === 'none';
    cu.items += 3; cu.complete += open ? 2 : 3; if (open) cu.gaps++;   // C-10 to C-12; uncovered: the email came through Marisol, a hop recorded as a gap
    await say(open ? 'Nobody was on call: Marisol forwarded the email at 07:05, hashed on receipt, with the forwarding hop recorded as a gap; we captured the post ourselves. Logged as C-10 and C-11. (game)' : 'The Compact’s on-call lead captured the post at 05:55 and forwarded the email as received at 05:58, both hashed. Logged as C-10 and C-11. (game)');
    const S = cnDfirBossStages();
    await cnStages(S, ['s1']);
    await say('07:20: C-12, Kit’s re-export of the firewall and endpoint records since the isolation, hashed and sealed: nothing out to 203.0.113.61, or anything like it, since the block. 08:40: all 20 sample rows are in the archive on a copy of C-02. (game)');
    await cnStages(S, ['s2']);
    const r = await doReport(CN_REPORT_2);
    G.cr.reports.cn2 = {score: r.score, over: r.over, under: r.under};
    G.cr.corrected += r.over;
    await say('14:00: to Renata. 14:00–17:00 Kit restores S: without the attachment, on Marisol’s decision. 15:00: the Clinic Board, with Renata and the insurer, decides not to pay. Weller, with counsel, decides what patients are told, from the field list; with Renata’s agreement the FBI has the email and the post. (game)');
  }
  c.boss.ok = c.boss.first.every(Boolean);
  G.f.cnBoss = true; unlock('tech', 'T1657'); unlock('tech', 'T1566.001'); touchCSF('Respond'); touchCSF('Recover'); track();
  if (cnMgr()) await say('Lucia has the firm’s status report for you in the incident room.', 'Marisol Quintero');
  else await say('End the day when you’re ready. Monday, Marisol wants a word.', 'Lucia Ferrand');
}

/* ---------- Manager: the firm's status report (and the Quiet Thread clue) ---------- */
async function cnStatusReport() {
  const who = 'Lucia Ferrand';
  const body = '<pre class="art">Tallowmere · status · CLN-02 · Day 13 16:00 (game)\n' +
    'Found       one PC encrypted, CL-FD-02, and the share\n' +
    '            files its session could write; the way in:\n' +
    '            an attachment opened Thursday 16:48\n' +
    '            the 20 sample rows are in the archived\n' +
    '            lists: 5,210 patients, 1,180 inactive;\n' +
    '            no clinical notes in it\n' +
    'Not found   whether the lists are published in full\n' +
    '            or passed on\n' +
    'Evidence    C-01 to C-12: hashed, sealed\n' +
    'Report      to Renata Osei\n' +
    'Appendix    one observation outside the clinic’s\n' +
    '            questions, not yet explained, passed to\n' +
    '            counsel first: it touches the suspicion file</pre>';
  await say('The status, as promised. The report itself goes to Renata; this is yours.', who);
  await UI.openModal('The firm’s status report', body, [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  if (!qtFound('cn-folders')) {
    const i = await choose('The appendix: an observation not yet explained.', [{label: 'Read the appendix'}, {label: 'Leave it: it’s with Renata'}], {cursor: 1});
    if (i === 0) {
      await say('Appendix: reading CL-FS-01’s share audit for Night 11, for the question of which PCs were encrypted, the firm saw svc-print, from FD-STAFF-11’s address, list the folders of the Facilities share at 03:14 for under a minute and open no file. Nothing links it to the ransomware. Passed to counsel; with her agreement, to Rae’s suspicion-file team. Not acted on.');
      await say('Nothing changes on svc-print without a plan. You pass it to Rae, through Renata.');
      await crQtAfterNote(qtNote('cn-folders'));
    }
  }
  G.f.cnStatus = true; unlock('act', 'cnstatus'); touchCSF('Respond'); track();
  await say('End the day when you’re ready. Monday is the review.', who);
}

/* ---------- Scorecard extra and the end-of-district summary ---------- */
function cnScoreHtml() {
  if (!G.trackId || !G.f.cnMet) return '';
  const c = G.cr, s = c.cn || {};
  if (cnMgr()) return '<p>Community Clinic: retainer ' + (s.activate !== null && s.activate !== undefined ? '<b>' + s.activate + ' min</b>' : 'not called') + ' · downtime ' + (s.downtime ? (s.downtime.first ? '<b>first time</b>' : '<b>after a false start</b>') : 'not yet') + ' · weekend ' + (s.cover ? '<b>' + esc(s.cover.k) + '</b>' : 'not set') + ' (game)</p>';
  return '<p>Community Clinic: request logged <b>' + (s.requests ? esc(s.requests.date) : 'not yet') + '</b> · reports filed <b>' + ['cn1', 'cn2'].filter(k => c.reports[k]).length + '</b> (game)</p>';
}
function cnDrillRows() {
  const keys = cnMgr() ? ['hostsmgr', 'restore', 'tethermgr'] : ['hostsdfir', 'tetherdfir', 'views'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(CN_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function cnSummary() {
  const f = G.f, c = cnC(), t = G.trackId;
  if (!f.cnSummary) {
    if (t === 'manager' && !f.cnExClosed) { f.cnExClosed = true; G.cr.ex.closed += c.ex || 0; f.cnFixCart = true; touchCSF('Recover'); await say('16:00: the tabletop’s three actions closed: tomorrow’s schedule printed into the cart tonight, the back-entry checklist written, the binder’s call tree and Wrenfold’s escalation line updated. (game)'); }
    f.cnSummary = true; touchCSF('Govern');
    Series.markEdition('crossroads', {track: t, clinic: true});
    await say((t === 'manager' ? 'We ran a Saturday on paper and nobody went unseen. ' : 'I know what left, and what didn’t, and I can say it to a patient without guessing. ') + 'And I know who decides what. Thank you.', 'Marisol Quintero');
  }
  const body = '<p class="big">The Community Clinic: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CN_DAY[G.day] || '') + ')</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + cnDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>Reports filed: CLN-01 <b>' + (G.cr.reports.cn1 ? G.cr.reports.cn1.score : '—') + '</b> · CLN-02 <b>' + (G.cr.reports.cn2 ? G.cr.reports.cn2.score : '—') + '</b> (game)</p>' : '') +
    '<p>The post: ' + (c.boss && c.boss.ok ? 'handled at the first try from your seat' : 'handled, with false starts the debriefs named') + '. ' + (t === 'manager' ? 'Coordinated: care ran on paper, Marisol decided operations, Weller with counsel decides what patients are told, the Board decided payment with counsel and the insurer, and nobody promised what nobody knew.' : 'What left: the front desk’s lists for 5,210 patients, 1,180 of them inactive records; no clinical notes in them; the rest written as unknown.') + '</p>' +
    '<p>Lesson (game): what left was 90 days of daily lists and a recall list holding 1,180 inactive patients, kept on a share every front-desk PC could write. The 05:33 alert reached a console nobody watched, but the archive had already left at 05:14: keeping less, for less time, mattered more than the alert. Care went on, on paper; the binder had no step for entering it back until Monday.</p>' +
    (t === 'manager' && f.lbBookmark ? '<p>Bookmark Badge: the AAR’s three actions arrived with their owners agreed. Slate Badge: Wrenfold’s incident clause was on the plan’s contact page before you needed it.</p>' : '') +
    '<p>Open risk (game): the exam rooms keep their shared login until Marisol’s trial ends (Day 45), a risk she has accepted in writing. Until then Wrenfold’s audit can’t say which clinician viewed what in the exam rooms.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, the 03:00 pattern' + (qtFound('lb-rdp') ? ', a remote-desktop sign-in on the Library’s server' : '') + (qtFound('sd-probe') ? ', pings to eleven of the district’s addresses' : '') + (qtFound('cn-folders') ? ', and now a listing of the clinic’s Facilities share' : '') + '. It continues.</p>') +
    '<p class="big">Next: Fire &amp; EMS Dispatch.</p>';
  while (true) {
    const i = await UI.openModal('End of the Community Clinic', body, [{label: 'Keep exploring the clinic', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
