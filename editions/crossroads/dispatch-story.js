/* ============================================================
   UPTIME · editions/crossroads/dispatch-story.js
   Crossroads district 4: Fire & EMS Dispatch, both tracks. Objectives, the
   arrival (the night's handover; an admin sign-in nobody can explain; the
   Dispatch annex's retainer test), the manager track (three records drills, the
   week-3 rota, the cards drill with the supervisor, the backup center's pack,
   the boss's coordination and a 24-hour plan, the AAR measured in response
   time), the DFIR track (the scoping letter, preservation that never slows the
   floor, evidence intake, three evidence drills, separate stores, two reports),
   the shared directive (fold the center onto the county's network), the Dispatch
   Board (Relay Badge), the dojos, the boss from each seat, the nights, the Quiet
   Thread clue and the end-of-district summary.
   Life safety first: the supervisor on the floor decides dispatch operations,
   and nothing the player does slows a dispatch or leaves a caller unanswered.
   Timeline: scratchpad crossroads-timeline.md (Fire & EMS Dispatch section);
   every line here is checked against it.
   ============================================================ */
'use strict';

function inDispatch() { return DP_MAPS.includes(G.map); }
const dpMgr = () => G.trackId === 'manager', dpDfir = () => G.trackId === 'dfir';
// The district's state lives in G.cr.dp, made on arrival (saves from before this slice have none until then).
function dpC() {
  if (!G.targets.crDispatch) G.targets.crDispatch = 90;
  if (!G.targets.crAnswered) G.targets.crAnswered = 100;
  return G.cr.dp || (G.cr.dp = {activate: null, n15: null, rota: null, drill: null, pack: null, cover: null, aar: null, impact: null, night18: null, board: null, boss: null, dojo: [false, false, false], requests: null});
}
const DP_DAY = {16: 'Tuesday', 17: 'Wednesday', 18: 'Thursday', 19: 'Friday'};
const dpHm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
// Night 14 is the week-2 rota's last night; Night 15 fell between rotas and the acting team lead filled it on Monday with
// the first lead the rules allowed (game). Week 3 (Nights 16 to 22) carries both for the in-a-row rule.
function dpN15() {
  const r = G.cr.sd && G.cr.sd.rota, a = r ? r.assign : [], n13 = a[13 - SD_ROTA.first] || null, n14 = a[14 - SD_ROTA.first] || null;
  const p = SD_ROTA_ORDER.find(id => rotaRunAt([n13, n14, id], 2) <= DP_ROTA.maxRun);
  return {n14: n14, n15: p || null};
}
function dpPre() { const c = dpC(); if (!c.n15) c.n15 = dpN15(); return [c.n15.n14, c.n15.n15]; }
function dpAutoRota() { return rotaAuto(DP_ROTA, dpPre(), SD_ROTA_ORDER); }
function dpLead(n) { const r = G.cr.dp && G.cr.dp.rota; const a = r ? r.assign[n - DP_ROTA.first] : null; return a ? rotaName(DP_ROTA, a) : null; }
function dpTired(n) { const r = G.cr.dp && G.cr.dp.rota; return !!(r && r.stats.tired.includes(n)); }

/* ---------- Map tiles that change as the arrival problems are fixed ---------- */
function dpTile(d, ch) {
  if (ch === 'Ŝ' && G.f.dpFixVendor) d.pal = 'dpRackOk';    // the vendor's always-on account blocked; support on demand
  if (ch === 'Ź' && G.f.dpFixLink) d.pal = 'dpLinkOk';      // the building link's optic replaced
  if (ch === 'Ŷ' && G.f.dpFixCards) d.pal = 'dpCardsOk';    // run cards corrected, drilled each shift, a back-entry checklist
  return d;
}

/* ---------- Objective ---------- */
function dpObjective() {
  if (!G.trackId || !G.f.cnSummary) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'dispatch', x: x, y: y, district: 'dispatch'});
  if (!f.dpMet) return Object.assign(at('Fire & EMS Dispatch: its door is on the north side of the square, beside Town Hall’s.', 15, 14), {step: true});
  if (dpMgr()) {
    if (!f.dpDrillA) return at('The night’s handover note: Petra Vasko, in the CAD server room.', 26, 3);
    if (!f.dpDrillB) return at('The 03:20 sign-in: Imogen, at the supervisor’s desk.', 9, 7);
    if (!f.dpRota) return at('Next week’s nights: the rota, at the incident room table.', 20, 11);
    if (!f.dpNight16) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpCardsDrill) return at('Wednesday 09:00: the cards drill with Imogen, at the cards cabinet.', 19, 6);
    if (!f.dpBackup) return at('Oxlow’s center is on the phone: Imogen, at her desk.', 9, 7);
    if (!f.dpNight17) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpBoss) return at('Thursday, 14:09: Imogen is calling. The supervisor’s desk.', 9, 7);
    if (!f.dpStatus) return at('The firm’s status report: Lucia, in the incident room.', 23, 10);
    if (!f.dpNight18) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpDrillC) return at('Friday 07:30: the chief wants CAD back. Imogen’s desk.', 9, 7);
    if (!f.dpAar) return at('The after-action review, with Imogen and Celia: the incident room table.', 20, 11);
  } else {
    if (!f.dpLetter) return at('Read the scoping letter with Lionel Ashdown: the incident room.', 22, 13);
    if (!f.dpPreserve) return at('Collect without slowing the floor: Lucia, in the incident room.', 23, 10);
    if (!f.dpIntake) return at('Evidence intake: the evidence locker in the incident room.', 23, 12);
    if (!f.dpDrillA) return at('Question 2: the unit-status lag. The bench.', 20, 11);
    if (!f.dpDrillB) return at('Question 1: the 03:20 sign-in. The bench.', 20, 11);
    if (!f.dpDrillC) return at('Question 3: the vendor’s account. Theo, in the incident room.', 18, 13);
    if (!f.dpReport) return at('Write DSP-01 for Lionel Ashdown: the bench.', 20, 11);
    if (!f.dpNight16) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpStores) return at('Wednesday: Theo has a question about Oxlow. The incident room.', 18, 13);
    if (!f.dpNight17) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpBoss) return at('Thursday, 14:20: Lionel extends the engagement. Lucia, in the incident room.', 23, 10);
    if (!f.dpNight18) return at('End the day at the staff room desk.', 27, 12);
    if (!f.dpSwitch) return at('Friday 07:30: Chief Sayre wants a word. His office.', 3, 12);
  }
  if (!f.dpDirective) return at('The county administrator wants a word: the chief’s office.', 5, 13);
  if (!f.dpDojoDone) {
    if (!f.dpDojoMet) return at('(Optional) Hollis Grange’s ' + (dpMgr() ? 'Continuity of Operations' : 'Network Forensics') + ' dojo, in the training room.', 10, 12);
    const i = dpC().dojo.findIndex(x => !x);
    return at('(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', [8, 10, 12][i], 10);
  }
  if (!f.dpBoard) return at('Take the Dispatch Board challenge: Delphine Okoro, through the west door.', 8, 3, 'dpboard');
  if (!f.dpSummary) return at('Imogen wants to close the week: her desk.', 9, 7);
  return {text: 'Fire & EMS Dispatch done. Next: the Regional Airport, on the south side of the square.', done: true, district: 'dispatch'};
}

/* ---------- Triggers, interactions, talk ---------- */
function dpTriggers() {
  if (G.map === 'dispatch' && G.trackId && G.f.cnSummary && !G.f.dpMet) { run(dpArrive); return true; }
  return false;
}
function dpInteract(ch, tx) {
  if (!inDispatch()) return false;
  const f = G.f;
  if (!f.dpMet && G.map === 'dispatch') { if ('§£YŘŖŜŹŴŶ¤'.includes(ch)) { run(async () => { await say('The center is taking calls, not visitors, until the Clinic’s week is closed.'); }); return true; } return false; }
  if (ch === '§') { run(dpTable); return true; }
  if (ch === '£') { run(async () => { if (dpDfir() && f.dpPreserve && !f.dpIntake) await dpIntake(); else await say(dpDfir() ? 'The county’s evidence store, case DSP: a locked case and a seal log, apart from the Clinic’s and Oxlow’s.' : 'The exercise kit: CISA’s tabletop templates, a box of index cards, and a stopwatch.'); }); return true; }
  if (ch === 'Y') { run(dpDesk); return true; }
  if (ch === 'Ř') { run(async () => { await say(f.dpBoss && !f.dpDrillC && !f.dpSwitch ? 'A console position on cards: a run card clipped to the screen, a paper incident log, a pen on a string.' : 'A console position: CAD on two screens, the phone on the left, the radio on the right. Nobody touches a position but the person working it.'); }); return true; }
  if (ch === 'Ŗ') { run(async () => { await say('The radio room: the console electronics, the logging recorder, a rack of equipment. The radio consoles themselves sit at the positions. You look; you don’t touch.'); }); return true; }
  if (ch === 'Ŝ') { run(async () => { await say('The CAD server room: CAD-01, CAD-02 the standby, MQ-01 the unit-status queue, and the Compact’s collector, DP-LOG-01. ' + (f.dpFixVendor ? 'A label on CAD-01: “Vendor access on demand: county IT ticket.”' : 'A sticky note on CAD-01: “Stillmark remote access: always on.”')); }); return true; }
  if (ch === 'Ź') { run(async () => { await say(f.dpFixLink ? 'The building link’s patch panel. A new optic, and a tag with Tuesday’s date.' : 'The building link’s patch panel: the one cable between the center and the county office. Its port light flickers amber.'); }); return true; }
  if (ch === 'Ŵ') { run(async () => { await say('The supervisor’s desk: the floor on one screen, the phones on another, and a printed contact page under the glass.'); }); return true; }
  if (ch === 'Ŷ') { run(async () => { if (dpMgr() && f.dpNight16 && !f.dpCardsDrill) await dpCardsDrill(); else await say(f.dpFixCards ? 'The cards cabinet: run cards corrected on Wednesday, a back-entry checklist with two signature boxes, and this quarter’s drill sheet.' : 'The cards cabinet by the two backup positions: run cards, paper incident logs, a box of pens. The newest card is two years old.'); }); return true; }
  if (ch === '¤') { run(() => dpDojoPuzzle([8, 10, 12].indexOf(tx))); return true; }
  if (ch === '±') { run(async () => { await say('The Board’s minutes, by year. A tab marked “Compact”, and one marked “CAD replacement, deferred”.'); }); return true; }
  return false;
}
async function dpTalk(npc) {
  if (!DP_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.dpMet) { await say(f.cnSummary ? 'Come in: the supervisor’s desk is through the lobby.' : 'Once the Clinic’s week is closed, the supervisor would like a word.', who); return true; }
  switch (npc.id) {
    case 'hale':
      if (dpMgr() && f.dpDrillA && !f.dpDrillB) { await dpDrillB(); break; }
      if (dpMgr() && f.dpCardsDrill && !f.dpBackup) { await dpBackup(); break; }
      if (dpMgr() && f.dpNight17 && !f.dpBoss) { await dpBoss(); break; }
      if (dpMgr() && f.dpNight18 && !f.dpDrillC) { await dpDrillC(); break; }
      if (f.dpBoard && f.dpDirective) { await dpSummary(); break; }
      await say(dpMgr() ? 'The floor is mine. Tell me what you see, and I’ll tell you what the floor can take.' : 'Lionel says the firm reports to him. Fine, as long as nobody touches a position.', who); break;
    case 'vasko':
      if (dpMgr() && !f.dpDrillA) { await dpDrillA(); break; }
      await say(f.dpFixLink ? 'New optic in the building link. The counters are clean since 14:06 on Tuesday.' : 'Petra Vasko, county IT. We run the county’s network and the center’s servers. One network, for now.', who); break;
    case 'orrin':
      await say(f.dpDrillB || f.dpDrillA ? 'I should have rung the floor back at four that morning. I will next time.' : 'Felix Orrin, CAD administrator. I was on call last night.', who); break;
    case 'moll':
      await say('Ezra Moll, the Compact’s technician here. The collector, DP-LOG-01, is mine: it sends the center’s logs back to the town.', who); break;
    case 'reyes':
      await say(f.dpFixCards ? 'We ran the cards on Wednesday. Thursday, we knew where everything was.' : 'Tamsin Reyes. Eleven years on these consoles. I’ve used the cards once.', who); break;
    case 'sayre':
      if (dpDfir() && f.dpNight18 && !f.dpSwitch) { await dpSwitchDfir(); break; }
      await say(f.dpBoss ? 'My crews worked a second alarm on paper dispatch. The floor did that. Which units go where is mine; how the floor runs is Imogen’s.' : 'Gideon Sayre, fire and EMS chief. Which units go where is my call. The floor is Imogen’s.', who); break;
    case 'teague':
      if (!f.dpDirective && (f.dpAar || f.dpSwitch)) { await dpDirective(); break; }
      await say('Warren Teague, county administrator. I count what things cost.', who); break;
    case 'marrow':
      await say('Celia Marrow, the county 911 authority. The center’s systems are ours, and so is what we report. Facts first, please.', who); break;
    case 'ashdown':
      if (dpDfir() && !f.dpLetter) { await dpLetterTask(); break; }
      await say('Lionel Ashdown, county attorney. The firm reports to me. What the 911 authority reports is Celia’s decision, with me.', who); break;
    case 'grange': await dpDojoIntro(); break;
    case 'okoro': await dpBoardScript(); break;
    case 'luciadp':
      if (dpDfir() && f.dpLetter && !f.dpPreserve) { await dpPreserveTask(); break; }
      if (dpDfir() && f.dpNight17 && !f.dpBoss) { await dpBoss(); break; }
      if (dpMgr() && f.dpBoss && !f.dpStatus) { await dpStatusReport(); break; }
      await say(dpDfir() ? 'Nothing we do slows a dispatch. Collect from what doesn’t serve the positions.' : 'Our report goes to Lionel. You get the status, the same day.', who); break;
    case 'theodp':
      if (dpDfir() && f.dpDrillB && !f.dpDrillC) { await dpDrillCDfir(); break; }
      if (dpDfir() && f.dpNight16 && !f.dpStores) { await dpStores(); break; }
      await say('Theo. The county’s evidence is in its own store. Oxlow’s too, in theirs.', who); break;
  }
  return true;
}

/* ---------- Arrival (Day 16, Tuesday) ---------- */
async function dpArrive() {
  const f = G.f, c = dpC();
  f.dpMet = true; G.day = Math.max(G.day, 16); G.focus = G.focusMax; touchCSF('Respond');
  c.n15 = dpN15();
  if (dpDfir()) c.rota = dpAutoRota();
  const n15 = c.n15.n15 ? rotaName(DP_ROTA, c.n15.n15) : 'nobody';
  await say('Day 16, Tuesday, ' + (dpMgr() ? '08:00' : '08:35') + '. Fire & EMS Dispatch. (The Clinic’s week closed yesterday. game)');
  await say('Imogen Hale, day supervisor. The night’s handover, at 06:50: unit status has lagged since Sunday, worse overnight. The night supervisor rang county IT’s on-call at 03:02 and nobody rang back.', 'Imogen Hale');
  await say('And three more things, plainly: CAD and our records system share one network with the county office next door. The cards haven’t been drilled in two years. And Stillmark, our CAD vendor, has remote access that is always on.', 'Imogen Hale');
  await say('What we measure here is the time from answering a call to dispatching it: a median of 64 seconds last week. (game)', 'Imogen Hale');
  await say('07:05: the Compact’s day lead read an alert from the night: “CAD admin sign-in outside hours”, f.orrin-adm, 03:20, from the county office subnet. Nobody here can explain it yet. (Night 15’s on-call lead, ' + n15 + ', had no page: the center’s systems page county IT’s own on-call, not the Compact’s. game)');
  unlock('fact', 'dpcisa'); unlock('fact', 'dpng911'); unlock('fact', 'dpfcc');
  if (dpMgr()) {
    await say('08:10, the Dispatch annex to the Compact’s plan: the retainer is called when a dispatch system may have been reached by someone not authorised; when ransomware or another destructive attack is found on any system that shares the center’s network, the county office’s included; or when the on-call lead can’t contain an incident. (game)');
    let mins = DP_ACT_OK;
    while (true) {
      const items = DP_ACTIVATE.map(o => ({label: o.label, meta: {good: !!o.good}}));
      const i = await UI.openModal('The annex’s test', '<p>An admin sign-in on CAD-01 at 03:20 that nobody here can explain yet. The night supervisor rang county IT’s on-call about the lag at 03:02. The floor is working normally, apart from the lag. Are the annex’s criteria met?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      mins += DP_ACT_LATE;
      await say(DP_ACTIVATE[i].why + ' (+' + DP_ACT_LATE + ' game minutes)');
    }
    c.activate = mins; G.cr.activate = mins; track();
    // You ring Felix at 08:10 and get no answer (he is off after his on-call night), so the sign-in stays unexplained and
    // the annex is met. Each wrong answer is a later call (game): the call, its acknowledgement and counsel's engagement follow.
    const call = 8 * 60 + 13 + (mins - DP_ACT_OK), ack = call + DP_ACT_OK, eng = Math.max(8 * 60 + 30, ack + 5);
    await say('08:10: you ring Felix Orrin on the county staff directory number. No answer: he is off after his on-call night. Nobody can confirm the 03:20 sign-in, so the annex’s may is met. (game)');
    await say(dpHm(call) + ' retainer line called · ' + dpHm(ack) + ' Tallowmere acknowledges. Lionel Ashdown, the county attorney, engages the firm at ' + dpHm(eng) + ' under a letter, and tells the county’s cyber insurer. Stillmark’s incident clause, §7, and its escalation line are already on the plan’s contact page (Slate Badge). (game)');
    await say('08:40: Imogen rings Felix Orrin, the CAD administrator, on the county staff directory number again, and reaches him. 08:50: she writes and signs a note of the call. Petra Vasko has the queue’s records and the link’s counters in the CAD server room. (game)');
  } else {
    const lead = G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz';
    await say('07:20: ' + lead + ', the town’s acting team lead, rang Imogen and Lionel Ashdown, the county attorney, on the plan’s contact page. 08:30: Lionel engages Tallowmere under a letter. (The county has no IR manager applying its annex: counsel engages the firm, as before. game)');
    await say('08:40: Imogen is ringing Felix Orrin, the CAD administrator, on the county staff directory number. She’ll write a note of it. (game)');
    await say('You lead it. The incident room is ours. Lionel first, and nothing we do touches a position.', 'Lucia Ferrand');
  }
}

/* ---------- The incident room table (manager: the rota and the AAR; DFIR: the bench) ---------- */
async function dpTable() {
  const f = G.f;
  if (dpMgr()) {
    if (f.dpDrillB && !f.dpRota) return dpRotaTask();
    if (f.dpDrillC && !f.dpAar) return dpAar();
    return say(f.dpAar ? 'The table: three index cards, each with an owner and a date, and the measured numbers on a fourth.' : 'The incident room table. A whiteboard with the center’s floor plan.');
  }
  if (!f.dpLetter) return say('The bench. Lionel has the letter; read it with him first.');
  if (f.dpIntake && !f.dpDrillA) { await dpDrill('lagdfir'); f.dpDrillA = true; touchCSF('Detect'); await say(G.cr.drills.lagdfir.supported ? 'The link, from D-04 and D-05.' : 'Question 2 has its answer, but write it only from what you’ve read.', 'Lucia Ferrand'); await say('11:15: D-08 is in, logged and sealed: county IT’s on-call ticket and the county office’s door log for Night 15, exported by Petra at 11:00, and Imogen’s signed note of her 08:40 call, scanned at 11:05 and hashed on receipt, the paper sealed. Question 1 is on the bench. (game)', 'Lucia Ferrand'); const cu = dpCustody(); cu.items++; cu.complete++; track(); return; }
  if (f.dpDrillA && !f.dpDrillB) { await dpDrill('admindfir'); f.dpDrillB = true; touchCSF('Detect'); await say('Felix, on call, from D-03 and D-08. 13:30: Stillmark’s support manager wrote, on the §7 contact: no technician used its access on Sunday night. Logged as D-09 with its headers, hashed. Theo has it. (game)', 'Lucia Ferrand'); const cu = dpCustody(); cu.items++; cu.complete++; track(); return; }
  if (f.dpDrillC && !f.dpReport) return dpReport1();
  return say('Your bench: working copies only. The originals are sealed in the store.');
}
function dpCustody() { return G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0}); }

/* ---------- Drills ---------- */
async function dpDrill(key) {
  const c = G.cr;
  const r = await doDrill(DP_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (dpDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function dpDrillA() {
  await say('The night supervisor’s note is on the wall. She thinks someone is messing with us. Here are the queue’s own records and the link’s counters. You tell me.', 'Petra Vasko');
  const r = await dpDrill('lagmgr');
  G.f.dpDrillA = true; touchCSF('Detect');
  await say(r.verdictOk ? 'The link, then. I’ll have an optic here by two, if Imogen gives me the minutes.' : 'The queue gets the messages late, and the link is throwing errors. It’s the link. I’ll have an optic here by two, if Imogen gives me the minutes.', 'Petra Vasko');
  await say('10:05: the firm, reading the vendor gateway’s log, finds a session on Stillmark’s support account, sm-support, on Night 14 from 02:10 to 02:40, from 198.51.100.183, inside Stillmark’s documented range. No Stillmark ticket for it. 10:08: you agree with the firm’s advice. 10:10: Petra blocks sm-support on the gateway, clearing nothing: its logs stay. Imogen is told: no floor impact, and Stillmark’s support is on demand from now, by county IT ticket. (game)');
  G.f.dpFixVendor = true; track();
  await say('10:30: Lionel sends Stillmark the firm’s questions through the escalation contact in §7. Imogen has the 03:20 question at her desk. (game)');
}
async function dpDrillB() {
  await say('I rang Felix at 08:40 on the directory number. Here’s my note, and the county’s ticket. Read it like you’d read anyone’s.', 'Imogen Hale');
  const r = await dpDrill('adminmgr');
  G.f.dpDrillB = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Felix, on call, at his desk. Next time county IT works on CAD at night, it tells my floor.' : 'The ticket, the gateway and Felix’s own word agree: on-call work. Next time county IT works on CAD at night, it tells my floor.', 'Imogen Hale');
  await say('13:30: Stillmark’s support manager writes, on the §7 contact: “No Stillmark technician accessed your system on the night of Sunday to Monday. Our ticket system has no open work for your site.” (game)');
  await say('14:00–14:06: Petra’s team replaces the building link’s optic at the time Imogen agreed. Unit statuses come by radio for six minutes; CAD stays up throughout. 14:10: the queue’s delays are under a second. (game)');
  G.f.dpFixLink = true; track();
  await say('15:00, the firm’s status (its note went to Lionel): the 03:20 sign-in was Felix, on call; the lag was the link, fixed at 14:06; the Night 14 session on sm-support came from Stillmark’s range, Stillmark says no technician used it, and who did is unknown. Blocked at 10:10; Stillmark’s records requested at 10:30. (game)');
  await say('Next week’s nights need a rota, and you have the center too now. The incident room table.', 'Imogen Hale');
}
async function dpDrillCDfir() {
  await say('Stillmark says its access wasn’t used on Sunday night. Our gateway says its account signed in. I’d write that they’re lying.', 'Theo Marchetti');
  const r = await dpDrill('vendordfir');
  G.f.dpDrillC = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Our records, their word, and an honest unknown with the date. I’d have written “false”.' : 'What each record shows, and who used it as unknown, with R-01 dated. A statement isn’t a log line, either way.', 'Theo Marchetti');
  await say('14:00–14:06: Petra’s team replaced the building link’s optic at the time Imogen agreed; CAD up throughout. 15:00: D-10, CAD’s answer-to-dispatch report for Days 7 to 16, from CAD-02’s copy, exported by Petra, hashed, sealed. DSP-01 for Lionel at the bench. (game)', 'Lucia Ferrand');
  G.f.dpFixLink = true; const cu = dpCustody(); cu.items++; cu.complete++; track();
}
async function dpDrillC() {
  await say('The chief wants the floor back on CAD. County IT says it’s been up since 23:40. My checklist needs the day shift. Read it with me.', 'Imogen Hale');
  const r = await dpDrill('switchmgr');
  G.f.dpDrillC = true; touchCSF('Recover');
  await say(r.verdictOk ? 'Not yet, then, and my decision. The checklist from 08:10.' : 'The firm’s check is done; my checklist isn’t. My decision: the checklist from 08:10.', 'Imogen Hale');
  await say('08:10–09:05: a test incident end to end through CAD, the open incidents entered from the cards and checked by a second telecommunicator, unit statuses matched. 09:10: back on CAD, Imogen’s decision. Unit statuses come by radio, entered by hand, until the county office is clean and the link is back. By 11:00 the closed incidents from the cards are back-entered, each checked. (game)');
  await say('The review at ten thirty, at the incident room table. Celia will be there.', 'Imogen Hale');
}

/* ---------- Manager: the week-3 rota (Tuesday 16:30) ---------- */
async function dpRotaTask() {
  const c = dpC();
  await say('Next week’s nights: Nights 16 to 22. Night 14 was the week-2 rota’s last, and Night 15 fell between rotas: the acting team lead filled it on Monday. Both count for the in-a-row rule. (game)');
  const r = await doRota(DP_ROTA, dpPre());
  c.rota = {assign: r.assign, stats: r.stats};
  const L = rotaForecast(DP_ROTA, r.assign);
  await UI.openModal('Rota · week 3', rotaTable(DP_ROTA, r.assign) +
    '<p>Rota gaps <b>' + r.stats.gaps + ' h</b> · nights past two in a row <b>' + r.stats.tired.length + '</b> · overtime so far <b>' + r.stats.overtime + ' of ' + DP_ROTA.budget + ' h</b> (game)</p>' +
    (L.length ? '<ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '<p class="small">No calls are forecast: nothing is known yet. Each call-out is costed when it happens. (game)</p>',
    [{label: 'Pin it to the team board', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.dpRota = true; unlock('act', 'crrota'); touchCSF('Govern'); track();
  await say(r.stats.tired.length ? 'Somebody’s on a third night in a row in there. We’ll see it if anything pages. (game)' : r.stats.gaps ? 'There’s a hole in it. Whatever pages that night waits for the morning.' : 'Week 3, nobody past two in a row. End the day when you’re ready.');
}

/* ---------- Manager: the cards drill with the supervisor (Wednesday 09:00) ---------- */
async function dpCardsDrill() {
  const c = G.cr, who = 'Imogen Hale';
  await say('Two years since anyone here worked a call on cards. I want to know what breaks before it matters. My floor, my decision. Help me plan it.', who);
  while (true) {
    const items = DP_DRILL_OBJ.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The cards drill · the plan', '<p>The First 48 advice in CISA’s 911 package, from public safety colleagues, urges exercising “operating under manual mode” (Field Manual). How does the center drill it without slowing a single caller?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(DP_DRILL_OBJ[i].why);
  }
  for (const inj of DP_DRILL_INJECTS) {
    const items = inj.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('The cards drill · inject', '<p><b>' + esc(inj.t) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(inj.opts[i].why);
    }
  }
  c.ex.run += 1; c.ex.actions += DP_EX_ACTIONS; dpC().drill = {actions: DP_EX_ACTIONS}; track();
  G.f.dpCardsDrill = true; unlock('act', 'dpcards'); unlock('act', 'crtabletop'); touchCSF('Recover'); touchCSF('Govern');
  await say('Measured at the shadow position: 101 seconds from answer to a complete run-card pick on paper on the first run, 84 on the second. The live positions dispatched every one of those calls on CAD as usual. Drill times, not dispatch times. (game)', who);
  await say('Two run cards were out of date: two engines moved stations last year. Three actions (game): the run cards corrected, with the chief’s office for the content (me, by 17:00 today); a shadow cards drill on every shift each quarter: the day shift’s done this morning, the night shift’s tonight at 20:00 (me); a back-entry checklist with a second-person check (me, by 17:00 today).', who);
  await say('And one more thing: if this floor can’t take calls, Oxlow’s center takes our overflow. Nobody has ever tested that. At my desk.', who);
}

/* ---------- Manager: the backup center (Wednesday 11:00) ---------- */
async function dpBackup() {
  const c = dpC(), who = 'Imogen Hale';
  await say('Oxlow’s supervisor is on the line. If I roll our overflow to them, what do they need to take a call for our area and pass it back to us?', who);
  const items = DP_PACK.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> things Oxlow’s center needs.</p>' + shownOrder(DP_PACK, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('The backup center · what Oxlow needs', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !DP_PACK[i].good);
  for (const i of wrong) await say(DP_PACK[i].name + ': ' + (DP_PACK[i].id === 'login' ? 'a shared login into our CAD is a new way in, and Oxlow takes calls, not our system.' : DP_PACK[i].id === 'db' ? 'more data than any call needs, sitting at another client’s center.' : 'the radio room isn’t touched, and Oxlow passes calls back on the supervisor’s line.'));
  c.pack = {wrong: wrong.length};
  G.f.dpBackup = true; unlock('act', 'dpbackup'); touchCSF('Recover'); track();
  await say('When to roll over is my decision. How many lines Oxlow takes is theirs. 11:30: the test call rolls to Oxlow and is answered in six seconds. (game)', who);
  await say('End the day when you’re ready.');
}

/* ---------- Manager: the AAR (Friday 10:30) ---------- */
function dpImpactOpts() {
  const m = dpCardsMedian();
  return [
    {label: 'Measured: ' + m + ' s on cards against 64 s, 151 calls answered, all 3 hang-ups called back', good: true},
    {label: 'No impact to report: each call was answered, and calls are what count', why: 'Answering isn’t dispatching. The time from answer to dispatch rose, and it was measured.'},
    {label: 'Response times doubled across the county, to well over 120 seconds, while it was on paper', why: 'That isn’t what was measured. The phones and the radio logger give the numbers.'},
    {label: 'Unknown: CAD’s own report has to be rebuilt before anyone can say', why: 'The phone system and the radio logger measured it while CAD was down.'}];
}
async function dpAar() {
  const c = G.cr, d = dpC(), who = 'Imogen Hale';
  await say('Blameless. I don’t want a name. I want to know why the county’s bad afternoon reached my floor, and what it cost the people who rang us.', who);
  const items = DP_FACTORS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> contributing factors the AAR should record.</p>' + shownOrder(DP_FACTORS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('AAR · contributing factors', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !DP_FACTORS[i].good);
  for (const i of wrong) await say(DP_FACTORS[i].name + ': ' + (DP_FACTORS[i].id === 'user' ? 'a name, not a cause, and how it reached the county office isn’t known.' : DP_FACTORS[i].id === 'vendor' ? 'nothing links it to Thursday, and the account was blocked on Tuesday.' : 'the drill is why the cards worked on Thursday.'));
  const imp = dpImpactOpts();
  let impFirst = true;
  while (true) {
    const its = imp.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('AAR · the impact', '<p>The impact on the people who rang, from 14:07 Thursday to 09:10 Friday. What goes in the review?</p>', its, {shuffle: true, closable: false, cls: 'drill'});
    if (its[i].meta.good) break;
    impFirst = false; await say(imp[i].why);
  }
  await say('The three actions arrive with their owners already assigned, under the Library Board’s rule (Bookmark Badge). What’s left is the dates.');
  let onTime = 0;
  for (const a of DP_AAR) {
    let ok = true;
    const opts = a.dates.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · due date', '<div class="card"><b>' + esc(a.name) + '</b><br>Owner: ' + esc(a.owner) + '</div><p>When is it due?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      ok = false; await say(a.dates[i].why);
    }
    if (ok) onTime++;
  }
  c.aar = {total: ((c.aar && c.aar.total) || 0) + DP_AAR.length, onTime: ((c.aar && c.aar.onTime) || 0) + onTime};
  d.aar = {factorsWrong: wrong.length, onTime: onTime, impactFirst: impFirst};
  G.f.dpAar = true; unlock('act', 'dpaar'); unlock('act', 'craar'); unlock('act', 'dpmeasure'); touchCSF('Govern'); track();
  await say('Three actions, three owners, three dates, the impact as measured, and nobody blamed. The county administrator wants a word in the chief’s office.', who);
}

/* ---------- The directive (both tracks): fold the center onto the county's general network ---------- */
async function dpDirective() {
  const who = 'Warren Teague', t = G.trackId;
  await say('One network, one directory, one server room, one set of contracts. Fold the center onto the county’s general network and the county saves real money every year. Thursday was bad luck.', who);
  if (t === 'dfir') await say('Lionel says you can tell me what the case showed. Is a separate network worth it?', who);
  const L = DP_DIRECTIVE[t];
  while (true) {
    const items = L.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose(t === 'dfir' ? 'What do you tell the county administrator?' : 'How do you answer the county administrator?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(L[i].why);
  }
  await say(t === 'dfir' ? 'The facts from the case: CAD wasn’t encrypted. It failed because it signed in and looked up names through the county’s directory, across a network it shared with the county office, and the floor’s measured times rose while it was down. The First 48 advice in CISA’s 911 package says emergency communications “should operate separately from the municipality administrative network”. The decision is Celia’s. Lionel agreed I could say that much.' :
    'The trade-off: what folding it in saves (one network to run, fewer contracts: the county’s estimate); what Thursday showed it costs (CAD failed when the county’s directory went down); the First 48 advice’s line, in CISA’s 911 package, that emergency communications “should operate separately from the municipality administrative network”; and the options: the center’s own segment and sign-in sharing county IT’s people and hardware, one network with a firewall and CAD’s own sign-in, or fold it in with the risk accepted in writing. Celia decides, with the chief’s view on response risk on record.');
  await say('The center keeps its own segment and its own sign-in, and shares county IT’s people and hardware where that doesn’t put CAD behind the county’s servers. My decision, with the chief’s view on record. Review at the next budget. (game)', 'Celia Marrow');
  G.f.dpDirective = true; unlock('act', 'dpsegment'); touchCSF('Protect');
  await say(dpMgr() ? '(Present the trade-off; the owner decides.)' : '(Give the facts; the owner decides.)');
}

/* ---------- DFIR D1: the scoping letter ---------- */
async function dpLetterTask() {
  const who = 'Lionel Ashdown', f = G.f;
  const row = (k, v) => '<tr><th style="vertical-align:top;white-space:nowrap">' + k + '</th><td>' + v + '</td></tr>';
  const letter = '<p><b>Scoping letter · Tallowmere Forensics · case DSP-01 (game)</b></p><table class="sc letter">' +
    row('Engaged by', 'Lionel Ashdown, county attorney, at 08:30') +
    row('Questions', '1. Who signed in to CAD-01 as f.orrin-adm at 03:20, and what was done?<br>2. Is the unit-status lag an attack?<br>3. Has anyone used the CAD vendor’s remote access outside its support work, and what did it reach?') +
    row('In scope', 'CAD-01, CAD-02, MQ-01, RMS-01, DP-SW-01, DP-VPN, DP-LOG-01, and the county’s flow records for the center’s hosts and the building link') +
    row('Can’t see', 'Stillmark’s own systems: requests through counsel, logged when sent. The county office’s own systems, beyond their flows to the center') +
    row('Report to', 'Lionel Ashdown, who decides who receives it. Reporting by the 911 authority: Celia Marrow, with counsel') +
    row('The floor', 'Anything on the floor is Imogen Hale’s decision. Collection must not slow a dispatch.') + '</table>';
  await say('Read it before you touch anything. The floor is taking calls as we speak, and that matters to how you work.', who);
  while (true) {
    const items = DP_LETTER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The scoping letter', letter + '<p><b>Your first step?</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(DP_LETTER[i].why);
  }
  f.dpLetter = true; unlock('act', 'crscope'); touchCSF('Govern'); track();
  await say('Imogen says: anything that doesn’t touch a position, and nothing restarted. Lucia is waiting for you.', who);
}

/* ---------- DFIR D2: preserve without taking the floor down ---------- */
async function dpPreserveTask() {
  const who = 'Lucia Ferrand';
  await say('CAD-01 serves six positions right now. CAD-02 keeps a copy of its database and audit tables, and the vendor gateway keeps 48 hours (game). Where do we collect from?', who);
  while (true) {
    const items = DP_PRESERVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Collect without slowing the floor · 09:10', '<p>The floor is live on CAD-01. Nothing may slow a dispatch. What do you collect, and from where?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(DP_PRESERVE[i].why);
  }
  G.f.dpPreserve = true; unlock('act', 'dpstandby'); touchCSF('Respond'); track();
  await say('09:20: Felix exports CAD’s audit log from CAD-02’s copy. 09:25: Petra, the flows. 09:30: the gateway’s log. 09:35: the queue’s metrics. 09:40: the switch’s counters. 09:45: Ezra, the collector’s own log. All hashed at export. Not one position touched. The evidence locker, when you’re ready. (game)', who);
}

/* ---------- DFIR D3: evidence intake; the vendor account; the request; the Quiet Thread ---------- */
async function dpIntake() {
  const c = G.cr, cu = dpCustody();
  await say('Six items. Four need your call; the queue’s metrics and the switch’s counters are routine. Log each one: who, when, the hash on receipt against the form, where the original is sealed. Work on copies.', 'Lucia Ferrand');
  for (const it of [DP_INTAKE.d01, DP_INTAKE.d02, DP_INTAKE.d03, DP_INTAKE.d06]) {
    let first = true;
    const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 16. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      first = false; cu.gaps++;
      await say(it.opts[i].why);
    }
    cu.items++; if (first) cu.complete++;
    if (it.id === 'D-01') await say('Asked at 10:00: Petra will export the same range from CAD-02 herself, for comparison. (game)');
    if (it.id === 'D-06') await dpQtEvidence();
  }
  cu.items += 2; cu.complete += 2;   // D-04 and D-05: hashed on receipt against Petra's export record, sealed
  G.f.dpIntake = true; unlock('act', 'crcustody'); touchCSF('Respond'); track();
  await say('10:05: Theo, reading D-03 on a copy, finds a session on sm-support, Stillmark’s account, on Night 14 from 02:10 to 02:40, from 198.51.100.183, inside Stillmark’s documented range. No Stillmark ticket for it. 10:10: at our request Petra blocks sm-support on the gateway, clearing nothing; its logs stay. Imogen is told: no floor impact, and Stillmark’s support is on demand from now. 10:15: Petra’s second export of D-01’s range from CAD-02: the hashes match; both records kept, each with who made it. 10:20: for question 3, Petra exports CAD-01’s EDR telemetry for Night 14, 02:00 to 03:00, from the EDR console: processes, files and connections. Hashed, logged and sealed as D-07. (game)', 'Lucia Ferrand');
  G.f.dpFixVendor = true; cu.items++; cu.complete++;
  const d = dpC(); d.requests = {date: 'Day 16 (Tuesday) 10:30'};
  await say('10:30, through Lionel: R-01 to Stillmark for its own access records for sm-support, Days 13 to 16, and a commitment to keep them. Logged as it went: “requested Day 16 (Tuesday) 10:30” (Slate Badge). Question 2 is on the bench. (game)', 'Lucia Ferrand');
  track();
}
// The Quiet Thread clue, seen in D-06 (DFIR). Noticing is the mechanic: the prompt opens on "Leave it".
async function dpQtEvidence() {
  if (qtFound('dp-conns')) return;
  const i = await choose('D-06, the collector’s own log. The letter’s questions don’t need it beyond the copies of CAD’s logs it holds. Its process log runs back to Saturday.', [{label: 'Read the rest of the collector’s log too'}, {label: 'Leave it: the questions have what they need'}], {cursor: 1});
  if (i !== 0) return;
  await say('03:11, Night 13, Saturday to Sunday: svc-print signs in to DP-LOG-01 from FD-STAFF-11’s address (Town Hall’s front-desk PC), over the Compact’s link, and lists the collector’s network connections: which of the center’s hosts send it logs. CAD-01, CAD-02, MQ-01, RMS-01, the gateway, the switch. Under a minute, nothing else run, signed out at 03:12. Nothing alerted. What it did with the list is unknown.');
  await say('Not one of the letter’s questions. It goes to Lionel first; with his agreement, to Lucia and Rae’s suspicion-file team. Nothing changes on svc-print without a plan.');
  await crQtAfterNote(qtNote('dp-conns'));
}

/* ---------- DFIR: DSP-01 ---------- */
async function dpReport1() {
  const c = G.cr;
  const r = await doReport(DP_REPORT_1);
  c.reports.dp1 = {score: r.score, over: r.over, under: r.under};
  c.corrected += r.over; track();
  G.f.dpReport = true; touchCSF('Respond');
  await say('To Lionel at 15:30. 16:30: with his agreement the recommendations went to Celia and Imogen, who accepted them: Stillmark’s access on demand from its range with MFA, in its contract (Celia); county IT’s on-call tells the floor whenever it works on CAD at night (Petra); a shadow cards drill on every shift, and a rollover test with Oxlow (Imogen); and the center’s network apart from the county office’s, which is Celia’s question to decide. Whether a stale status sent a farther unit to any call is for the chief’s office to review, call by call. (game)', 'Lucia Ferrand');
  await say('End the day when you’re ready.', 'Lucia Ferrand');
}

/* ---------- DFIR D5: separate stores (Wednesday 10:00) ---------- */
async function dpStores() {
  await say('Oxlow’s center is the county’s backup, and it runs Stillmark CAD too. Can I put our sm-support findings in Oxlow Township’s case folder as well? They’d want to know.', 'Theo Marchetti');
  while (true) {
    const items = DP_STORES.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose('Theo wants to share the county’s findings with Oxlow’s case.', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(DP_STORES[i].why);
  }
  G.f.dpStores = true; unlock('act', 'crstores'); touchCSF('Govern'); track();
  await say('One store each. If the address matters to Oxlow, Lucia asks Lionel and Oxlow’s counsel.', 'Theo Marchetti');
  await say('Wednesday, from the firm’s recommendation: 09:00–10:00, Imogen’s shadow cards drill with the day shift. A trainee worked live calls on paper while CAD dispatched them: 101 seconds to a paper run-card pick on the first run, 84 on the second (drill times, not dispatch times). Two run cards corrected. The night shift’s drill is at 20:00. 11:30: the rollover test to Oxlow, answered in six seconds. (game)');
}

/* ---------- DFIR, Friday 07:30: the chief asks the consultant ---------- */
async function dpSwitchDfir() {
  const who = 'Chief Gideon Sayre';
  await say('CAD has been up since midnight and my crews are on paper dispatch. You looked at it. Is it safe to switch back?', who);
  while (true) {
    const items = DP_SWITCH_DFIR.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose('What do you tell the chief?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(DP_SWITCH_DFIR[i].why);
  }
  G.f.dpSwitch = true; unlock('act', 'dpreturn'); touchCSF('Recover'); track();
  await say('The firm’s check finished at 02:00, after the vendor session: no file encrypted on CAD-01 or CAD-02, nothing foreign in a fresh capture of CAD-01’s memory at 23:50 or in its EDR since 21:00, nothing set to persist, no sign-in from a county office host since 14:00 on Thursday. Whether the floor is ready is Imogen’s checklist, and the time is hers.');
  await say('08:10–09:05: Imogen’s checklist. 09:10: back on CAD, her decision. Unit statuses by radio until the county office is clean and the link is back. By 11:00 the closed incidents from the cards are back-entered, each checked. (game)');
}

/* ---------- The desk: end the day, and the nights between ---------- */
async function dpDesk() {
  const f = G.f, mgr = dpMgr();
  const ready = mgr ? ((f.dpRota && !f.dpNight16) || (f.dpBackup && !f.dpNight17) || (f.dpStatus && !f.dpNight18)) : ((f.dpReport && !f.dpNight16) || (f.dpStores && !f.dpNight17) || (f.dpBoss && !f.dpNight18));
  if (!ready) { await say('A hot desk in the staff room. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.dpNight16) await dpNightQuiet(16); else if (!f.dpNight17) await dpNightQuiet(17); else await dpNight18();
}
async function dpNightQuiet(n) {
  const lead = dpLead(n);
  if (n === 17 && !G.f.dpFixCards) {
    G.f.dpFixCards = true; if (dpMgr()) G.cr.ex.closed += DP_EX_ACTIONS - 1; touchCSF('Recover');
    await say('Wednesday, 17:00: the run cards corrected, the back-entry checklist written, the day shift’s shadow drill done. The night shift’s is at 20:00. (game)');
  }
  await UI.openModal('Night ' + n, '<p>Night ' + n + ' (' + DP_DAY[n] + ' to ' + DP_DAY[n + 1] + '). On call: <b>' + esc(lead || 'nobody') + '</b>' + (dpTired(n) ? ', a third night or more in a row' : '') + '. No page. (game)</p>', [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = n + 1; G.focus = G.focusMax;
  if (n === 16) { G.f.dpNight16 = true; await say('Day 17, Wednesday. ' + (dpMgr() ? '09:00: Imogen has the cards cabinet open for the drill.' : 'Theo is in the incident room with a question about Oxlow.')); }
  else {
    G.f.dpNight17 = true; if (dpMgr()) G.cr.ex.closed += 1;
    await say('Day 18, Thursday. 07:00: the night shift ran its shadow drill at 20:00, so this week’s drills are done on both shifts. A quiet morning: the link holds and the statuses are on time. ' + (dpMgr() ? '14:09: Imogen is calling you from her desk.' : '14:20: Lucia is in the incident room. Lionel has just rung her.'));
  }
  track();
}
async function dpNight18() {
  const c = dpC(), lead = dpLead(18), tired = dpTired(18);
  const cost = lead ? (tired ? DP_ROTA.tiredCost : DP_ROTA.callCost) : 0;
  const body = '<p>Night 18 (Thursday to Friday). On call: <b>' + esc(lead || 'nobody') + '</b>' + (tired ? ', a third night or more in a row' : '') + (dpMgr() ? ', on site at the center under the plan' : '') + '.</p>' +
    '<p>The night supervisor keeps the floor on cards overnight, as Imogen handed over at 19:00. 21:00–23:40: county IT sets CAD-01 to its local sign-in mode. Stillmark’s support works through a one-time account Petra made for the session, with MFA, on Celia’s decision; sm-support stays blocked. The firm watches, and the session’s record is kept (D-17). CAD is up at 23:40 without the county’s directory. 23:50: the firm captures CAD-01’s memory again and reviews its EDR processes, connections and file events since 15:00 (D-18). 02:00: the firm’s check of CAD-01 and CAD-02, after the session, is complete. (game)</p>' +
    (lead ? '<p>The call-out: ' + cost + ' overtime hours.</p>' : '<p>Nobody on call for the Compact: the firm worked the night on its retainer hours.</p>');
  await UI.openModal('Night 18', body, [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 19; G.focus = G.focusMax;
  c.night18 = {lead: lead, tired: tired, overtime: cost};
  if (dpDfir()) { const cu = dpCustody(); cu.items += 2; cu.complete += 2; }   // D-17 the session's record, D-18 the fresh capture and EDR review
  if (cost && c.cover) { c.cover.overtime += cost; c.cover.variance = Math.round((c.cover.overtime - DP_ROTA.budget) / DP_ROTA.budget * 100); }
  if (tired && dpMgr()) { G.focus = Math.max(10, G.focus - 10); await say('You were rung at 01:30 by a tired on-call lead. Focus ' + G.focus + '/' + G.focusMax + ' this morning. (game)'); }
  G.f.dpNight18 = true;
  await say('Day 19, Friday, 07:15. Chief Sayre: “It’s been up since midnight. Why are we still on cards?” ' + (dpMgr() ? 'Imogen wants you at her desk.' : 'He wants a word with you in his office.'));
  track();
}

/* ---------- Dojo (Hollis Grange; original puzzles) ---------- */
function dpDojo() { return dpMgr() ? DP_DOJO_MGR : DP_DOJO_DFIR; }
async function dpDojoIntro() {
  const who = 'Hollis Grange', f = G.f;
  if (!f.dpDirective) { await say('Hollis Grange, training coordinator. The terminals are free once your week’s work is done.', who); return; }
  if (!f.dpDojoMet) { f.dpDojoMet = true; await say(dpMgr() ? 'Continuity of Operations: three terminals. What keeps a service going when its system doesn’t.' : 'Network Forensics: three terminals. Links, sessions, and what a cut-off server looks like.', who); return; }
  if (f.dpDojoDone) { await say(dpMgr() ? 'Drill the fallback. Return with a checklist. Measure what callers feel.' : 'Timings and counters. Records, not tone. Its own files, its own log.', who); return; }
  await say('Puzzles solved: ' + dpC().dojo.filter(Boolean).length + ' of 3. The terminals are behind me, along the north wall.', who);
}
async function dpDojoPuzzle(i) {
  const f = G.f, c = dpC();
  if (i < 0) return;
  if (!f.dpDojoMet) { await say('A training terminal. Talk to Hollis first.'); return; }
  const p = dpDojo()[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who has to act on it would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF(dpMgr() ? 'Recover' : 'Detect');
  if (!c.dojo.every(Boolean) || f.dpDojoDone) return;
  f.dpDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2);
  await say('All three. Focus ' + G.focusMax + ' (game).', 'Hollis Grange');
}

/* ---------- The Dispatch Board ---------- */
async function dpBoardScript() {
  const who = 'Delphine Okoro', f = G.f, c = dpC();
  if (f.dpBoard) { await say('The Relay Badge says this center trusts how you work. Keep earning it.', who); return; }
  if (!f.dpDirective) { await say('The Board sits once your week’s work is done.', who); return; }
  await say('The Dispatch Board. Three questions, the way the public and the crews put them to us. We grade the answer we can act on.', who);
  const specs = dpMgr() ? DP_BOARD_SPECS_MGR() : DP_BOARD_SPECS_DFIR();
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
  f.dpBoard = true; f.dpRelay = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the Dispatch Board. This is the Relay Badge (game).', who);
  await say(dpMgr() ? 'Its power, from the next district on: every service outage arrives with its fallback’s measured time on the plan’s page. And you carry a little more now: Focus +4.' : 'Its power, from the next district on: every collection from a live service arrives with a standby or a copy named first. And you carry a little more now: Focus +4.', who);
  touchCSF('Govern');
  await say('Imogen wants to close the week at her desk.');
}

/* ---------- The boss (game-original): ransomware at the county office, CAD failing during a working fire ---------- */
async function dpStages(S, keys) {
  const b = dpC().boss;
  for (const k of keys) {
    const st = S[k];
    const items = st.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true, wrong = 0;
    while (true) {
      const i = await UI.openModal(st.title, '<ul>' + st.clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false; wrong++;
      await say(st.resp[i].why);
    }
    if (k === 's1') b.w1 = wrong;
    b.first.push(first);
  }
}
async function dpPlan24() {
  const c = dpC();
  const pick = DP_COVER.find(o => o.good);
  c.cover = {k: pick.k, gaps: pick.gaps, overtime: pick.overtime, variance: Math.round((pick.overtime - DP_ROTA.budget) / DP_ROTA.budget * 100)};
  const r = c.rota, fc = o => '<li>' + esc(o.label.split(':')[0].split(',')[0]) + ': overtime forecast ' + o.overtime + ' h of ' + DP_ROTA.budget + ', gaps ' + o.gaps + ' h (game)</li>';
  const i18 = 18 - DP_ROTA.first, weak = !!r && (!r.assign[i18] || dpTired(18));
  const rested = weak ? DP_ROTA.people.find(p => { const a = r.assign.slice(); a[i18] = null; return p.id !== r.assign[i18] && a[i18 - 1] !== p.id && rotaFits(DP_ROTA, a, i18, p); }) : null;
  const signOpts = rested ? [{label: 'Swap Night 18 to ' + rested.name.split(' ')[0] + ': rested, for 3 more overtime hours', meta: {good: true, k: 'swap'}}, {label: 'Sign it as it stands: Night 18 is in the rota', meta: {good: false, k: 'keep'}}] : [{label: 'Sign it', meta: {good: true, k: 'sign'}}];
  const night = 'Night 18 (Thursday to Friday): ' + (dpLead(18) || 'nobody') + (dpTired(18) ? ', a third night or more in a row: a thin first look on any call' : '');
  const k = await UI.openModal('The next 24 hours · the plan', '<ul><li>' + esc(night) + '</li></ul><ul>' + DP_COVER.map(fc).join('') + '</ul>' + (r ? rotaTable(DP_ROTA, r.assign) : '') + '<p class="small">Thursday 19:00–07:00: Night 18’s lead on site as the on-call (on call from 18:00 under the rota; the rota costs that night as its call-out when it happens, so it isn’t in this forecast). Friday 07:00–19:00: Ezra and a lead who wasn’t on call Thursday night. Written handovers at 19:00 and 07:00: the forecast covers Friday’s day shift and the handovers. The firm’s retainer hours for the forensic work. County IT’s shifts are Petra’s; the floor’s are Imogen’s. (game)</p>',
    signOpts, {shuffle: !!rested, closable: false, cls: 'drill'});
  c.cover.n18 = signOpts[k].meta.k;
  if (c.cover.n18 === 'swap') {
    r.assign[i18] = rested.id; r.stats = rotaStats(DP_ROTA, r.assign);
    c.cover.overtime += 3; c.cover.variance = Math.round((c.cover.overtime - DP_ROTA.budget) / DP_ROTA.budget * 100);
    await say('Night 18 goes to ' + rested.name + ', rested. Three more overtime hours in the forecast, and a clear head on site tonight. (game)');
  } else if (c.cover.n18 === 'keep') await say('Night 18 is the night CAD is rebuilt. ' + (r.assign[i18] ? 'A third night running makes a thin first look' : 'Nobody on call means nobody for the Compact') + ': that is the night the rota exists to make well. Signed as it stands. (game)');
  unlock('act', 'dpshifts'); unlock('act', 'crcover');
}
async function dpBoss() {
  const c = dpC();
  c.boss = {first: [], w1: 0};
  if (dpMgr()) {
    await say('13:52: a house fire on the east side, dispatched on CAD at 13:53. 13:59: the first engine reports a working fire, and the incident commander on scene runs it. (game)');
    await say('14:02: ransomware at the county office. 14:05: CAD’s sign-ins and address look-ups hang, two positions freeze, the unit board goes stale. 14:06: the incident commander asks for a second alarm. 14:07: I called cards. 14:08: the second alarm went out from the run card. 14:10: I rolled our overflow 911 calls to Oxlow.', 'Imogen Hale');
    await say('(Pulse Badge: the floor’s fallback, the cards, and its owner, the supervisor, were already named on the plan’s page. game)');
    const S = dpMgrBossStages();
    await dpStages(S, ['s1']);
    await say('The Dispatch annex is met again, as written: ransomware found on a system that shares the center’s network. The firm, engaged since Tuesday, is told at 14:12. (game)');
    await say('14:15: Petra cuts the building link, with Imogen’s OK on the time: the floor is on cards, and unit statuses go to the radio. The 911 phones and the radio don’t cross that link (game). The county office’s containment is Petra’s. 14:20: Lionel extends the firm’s engagement under a second letter and updates the county’s cyber insurer. 14:25: Imogen takes the rollover off: the floor has settled on cards, 4 calls answered at Oxlow. 14:30: with Lionel’s agreement, you tell the FBI contact on the plan’s page. Chief Sayre arranges cover for the rest of the district while two alarms are committed (move-ups or mutual aid): his call. (game)');
    await say('14:40: the firm captures CAD-01’s memory with it running. 16:10, the firm, through Lionel: no file on CAD-01 or CAD-02 encrypted from 13:00 to 15:00, and their data opens. CAD has been cut off since 14:05, when the county’s directory server stopped answering. (game)');
    await dpStages(S, ['s2']);
    await say('16:30: the chief, Celia and the county administrator heard what is known, what isn’t, the measured numbers, and 18:30 for the next update. What the 911 authority reports, and to whom, is Celia’s decision, with Lionel. (game)');
    await dpStages(S, ['s3']);
    await dpPlan24();
    await say('Signed. 18:30: the next update, as promised. 18:30: with Lionel’s agreement the FBI contact has the firm’s findings so far. (game)');
  } else {
    const cu = dpCustody();
    await say('Lionel extended our engagement at 14:20 under a second letter, DSP-02: is CAD encrypted, or only cut off? Did the attack reach the center’s systems? And the floor’s measured response impact since 14:07. Your case.', 'Lucia Ferrand');
    await say('What we know: 13:52, a house fire on the east side, dispatched on CAD at 13:53, a working fire at 13:59. 14:02: ransomware at the county office. 14:05: CAD hangs, two positions freeze. 14:07: Imogen called cards; 14:08 the second alarm went out from the run card; 14:10 overflow rolled to Oxlow. 14:15: Petra cut the building link, with Imogen’s OK on the time; the 911 phones and the radio don’t cross it (game). With Lionel’s agreement, the acting team lead tells the FBI contact on the plan’s page at 14:30. (game)', 'Lucia Ferrand');
    const S = dpDfirBossStages();
    await dpStages(S, ['s1']);
    await say('14:40: Felix captures CAD-01’s memory under our instruction, CAD-01 running, hashed at collection (D-11; Pulse Badge: captured before anyone considered a restart). 14:50: CAD-02’s snapshot (D-12). 15:05: the center’s EDR file events (D-13). 15:10: CAD-01’s service log (D-14). 15:15: the flows since 13:00 (D-15). All hashed, sealed. No position touched. (game)');
    cu.items += 5; cu.complete += 5;
    await dpStages(S, ['s2']);
    await say('16:10: the finding to Lionel; with his agreement, to Imogen, Petra and Celia. 17:50: Oxlow’s supervisor sends Imogen its answer times for the 4 rolled calls. 18:05: D-16, the phone system’s answer, rollover and call-back times and the radio logger’s dispatch times, 14:07 to 18:00, with Oxlow’s times, exported by Petra and the center’s radio technician, hashed. Nobody from the firm touched the radio room. (game)');
    cu.items += 1; cu.complete += 1;
    const r = await doReport(dpReport2());
    G.cr.reports.dp2 = {score: r.score, over: r.over, under: r.under};
    G.cr.corrected += r.over;
    await say('18:20: DSP-02 to Lionel. 18:30: with his agreement, the FBI contact has the findings. CAD’s way back runs tonight: county IT, with Stillmark’s support on a one-time account with MFA, us watching, and a fresh check of CAD-01 after it. (game)');
  }
  c.boss.ok = c.boss.first.every(Boolean); c.boss.done = true;
  G.f.dpBoss = true; unlock('tech', 'T1486'); unlock('act', 'dpcutoff'); unlock('act', 'dpcards'); unlock('act', 'dpmeasure'); touchCSF('Respond'); touchCSF('Recover'); track();
  await UI.openModal('The floor, Thursday 14:07 to 18:00', '<p>911 calls answered: <b>38</b>, 4 of them at Oxlow on overflow; 2 hang-ups before answer, each called back. Median answer-to-dispatch on cards: <b>' + dpCardsMedian() + ' s</b>, against 64 s on CAD the week before. The second alarm: requested 14:06, dispatched 14:08. (game' + (dpMgr() ? ': ' + (c.boss.w1 ? c.boss.w1 + ' false start' + (c.boss.w1 === 1 ? '' : 's') + ' in the first stage cost the floor time in the first hour' : 'no false start in the first stage') : '') + ')</p>', [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  if (dpMgr()) await say('Lucia has the firm’s status report for you in the incident room.', 'Imogen Hale');
  else await say('End the day when you’re ready. Tomorrow, the chief will want CAD back.', 'Lucia Ferrand');
}

/* ---------- Manager: the firm's status report (and the Quiet Thread clue) ---------- */
async function dpStatusReport() {
  const who = 'Lucia Ferrand';
  const body = '<pre class="art">Tallowmere · status · DSP-02 · Day 18 19:00 (game)\n' +
    'Found       no file encrypted on CAD-01 or CAD-02,\n' +
    '            13:00 to 15:00, and their data opens;\n' +
    '            CAD cut off at 14:05 when the county’s\n' +
    '            directory stopped answering; the county\n' +
    '            PC’s attempt on CAD-01 refused\n' +
    'Measured    answer-to-dispatch on cards since 14:07:\n' +
    '            ' + dpCardsMedian() + ' s, against 64 s on CAD; 38 answered,\n' +
    '            2 hang-ups called back\n' +
    'Open        who used sm-support on Night 14;\n' +
    '            whether it is linked to today\n' +
    'Evidence    D-01 to D-16: hashed, sealed\n' +
    'Report      to Lionel Ashdown\n' +
    'Appendix    one observation outside the county’s\n' +
    '            questions, not yet explained, passed to\n' +
    '            counsel first: it touches the suspicion file</pre>';
  await say('The status, as promised. The report itself goes to Lionel; this is yours.', who);
  await UI.openModal('The firm’s status report', body, [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  if (!qtFound('dp-conns')) {
    const i = await choose('The appendix: an observation not yet explained.', [{label: 'Read the appendix'}, {label: 'Leave it: it’s with Lionel'}], {cursor: 1});
    if (i === 0) {
      await say('Appendix: reading DP-LOG-01’s own log on Tuesday, for the copies of CAD’s logs it holds, the firm saw svc-print, from FD-STAFF-11’s address (Town Hall’s front-desk PC) over the Compact’s link, sign in to the collector at 03:11 on Sunday and list its network connections, which of the center’s hosts send it logs, for under a minute. Nothing links it to the lag, Sunday night’s session or today. Passed to counsel; with his agreement, to Rae’s suspicion-file team. Not acted on.');
      await say('Nothing changes on svc-print without a plan. You pass it to Rae, through Lionel.');
      await crQtAfterNote(qtNote('dp-conns'));
    }
  }
  G.f.dpStatus = true; unlock('act', 'dpstatus'); touchCSF('Respond'); track();
  await say('End the day when you’re ready. The floor stays on cards tonight; tomorrow, the way back.', who);
}

/* ---------- Scorecard extra and the end-of-district summary ---------- */
function dpScoreHtml() {
  if (!G.trackId || !G.f.dpMet) return '';
  const c = G.cr, s = c.dp || {};
  const floor = s.boss && s.boss.done ? ' · the floor on cards <b>' + dpCardsMedian() + ' s</b>, calls answered <b>100%</b> (the floor’s, fixed)' : '';
  if (dpMgr()) return '<p>Fire &amp; EMS Dispatch: retainer ' + (s.activate !== null && s.activate !== undefined ? '<b>' + s.activate + ' min</b>' : 'not called') + ' · cards drill ' + (G.f.dpCardsDrill ? '<b>run</b>' : 'not yet') + ' · 24-hour plan ' + (s.cover ? '<b>' + esc(s.cover.k) + '</b>' : 'not set') + floor + ' (game)</p>';
  return '<p>Fire &amp; EMS Dispatch: request logged <b>' + (s.requests ? esc(s.requests.date) : 'not yet') + '</b> · reports filed <b>' + ['dp1', 'dp2'].filter(k => c.reports[k]).length + '</b>' + floor + ' (game)</p>';
}
function dpDrillRows() {
  const keys = dpMgr() ? ['lagmgr', 'adminmgr', 'switchmgr'] : ['lagdfir', 'admindfir', 'vendordfir'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(DP_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function dpSummary() {
  const f = G.f, c = dpC(), t = G.trackId, m = dpCardsMedian();
  if (!f.dpSummary) {
    f.dpSummary = true; touchCSF('Govern');
    Series.markEdition('crossroads', {track: t, dispatch: true});
    await say((t === 'manager' ? 'We answered every call, called back every hang-up, and dispatched every one that needed it, and we know how long it took. ' : 'I know what happened to CAD and what didn’t, and I can say it to a crew without guessing. ') + 'And I know who decides what on my floor. Thank you.', 'Imogen Hale');
  }
  const body = '<p class="big">Fire &amp; EMS Dispatch: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (DP_DAY[G.day] || '') + ')</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + dpDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>Reports filed: DSP-01 <b>' + (G.cr.reports.dp1 ? G.cr.reports.dp1.score : '—') + '</b> · DSP-02 <b>' + (G.cr.reports.dp2 ? G.cr.reports.dp2.score : '—') + '</b> (game)</p>' : '') +
    '<p>Thursday: ' + (c.boss && c.boss.ok ? 'handled at the first try from your seat' : 'handled, with false starts the debriefs named') + '. Every 911 call answered, 4 at Oxlow on overflow, every hang-up called back; median answer-to-dispatch on cards <b>' + m + ' s</b> against 64 s on CAD (game). ' + (t === 'manager' ? 'Coordinated: Imogen ran the floor, the chief kept the district covered, Petra contained the county office, Celia decides what the 911 authority reports, and nobody promised what nobody knew.' : 'Found: CAD cut off, not encrypted; the vendor-account session written as unknown, with the request dated.') + '</p>' +
    '<p>Lesson (game): CAD wasn’t encrypted. It failed because it signed in and looked up names through the county’s directory, across a network it shared with the county office. The floor kept answering every call and dispatching on cards, helped by Wednesday’s drill: ' + m + ' seconds against 64, measured.</p>' +
    (t === 'manager' ? '<p>Bookmark Badge: the AAR’s actions arrived with their owners agreed. Slate Badge: Stillmark’s incident clause was on the plan’s contact page before you needed it. Pulse Badge: the cards and their owner were named before Thursday.</p>' : '') +
    '<p>Open risk (game): the Compact’s own collector at the center, DP-LOG-01, is joined to the town’s directory and reachable from the whole town network over the Compact’s link, so every account with admin rights on the town’s member servers' + (qtFound('dp-conns') ? ' (svc-print among them)' : '') + ' has them on a server on the center’s network. Nobody has accepted that risk; it goes to Rae and the council’s risk committee for an owner.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, the 03:00 pattern' + (qtFound('lb-rdp') ? ', a remote-desktop sign-in on the Library’s server' : '') + (qtFound('sd-probe') ? ', pings to eleven of the district’s addresses' : '') + (qtFound('cn-folders') ? ', a listing of the clinic’s Facilities share' : '') + (qtFound('dp-conns') ? ', and now a listing of the dispatch collector’s connections' : '') + '. It continues.</p>') +
    '<p class="big">Next: the Regional Airport. Its door is on the south side of the square, beside the Library’s.</p>';
  while (true) {
    const i = await UI.openModal('End of Fire & EMS Dispatch', body, [{label: 'Keep exploring the center', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
