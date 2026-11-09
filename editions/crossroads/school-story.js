/* ============================================================
   UPTIME · editions/crossroads/school-story.js
   Crossroads district 2: the School District, both tracks. Objectives, the
   arrival (the district annex's retainer test; the vendor's notice), the
   manager track (a records drill on the first note, the notice and its clause,
   the vendor and data inventory, a tabletop with the Superintendent, the week-2
   rota with the district's nights, the facts for counsel and the privacy
   officer, two more records drills), the DFIR track (the scoping letter amended
   for a third-party incident, evidence intake, requests for vendor-held
   evidence, one store per client, three evidence drills, two reports), the
   shared directive (sign a new app without a data review), the School Board
   (Slate Badge), the dojos, the boss from each seat, the nights, the Quiet
   Thread clue and the end-of-district summary.
   Timeline: scratchpad crossroads-timeline.md (School District section); every
   line here is checked against it.
   ============================================================ */
'use strict';

function inSchool() { return SD_MAPS.includes(G.map); }
const sdMgr = () => G.trackId === 'manager', sdDfir = () => G.trackId === 'dfir';
// The district's state lives in G.cr.sd, made on arrival (saves from before this slice have none until then).
function sdC() { return G.cr.sd || (G.cr.sd = {activate: null, rota: null, cover: null, ex: 0, notice: null, inv: null, facts: null, night10: null, board: null, boss: null, dojo: [false, false, false], requests: null}); }
function sdLead(n) { const r = G.cr.sd && G.cr.sd.rota; const a = r ? r.assign[n - SD_ROTA.first] : null; return a ? rotaName(SD_ROTA, a) : null; }
function sdTired(n) { const r = G.cr.sd && G.cr.sd.rota; return !!(r && r.stats.tired.includes(n)); }
// Night 10 uncovered: the email and the post wait for Owen Marsh at 07:00, so the boss's first hour runs an hour later (game).
function sdN10Open() { return !!(G.cr.sd && G.cr.sd.night10 && !G.cr.sd.night10.lead); }
function sdAt(t) { if (!sdN10Open()) return t; const m = +t.slice(0, 2) * 60 + +t.slice(3) + 60; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
const SD_DAY = {8: 'Monday', 9: 'Tuesday', 10: 'Wednesday', 11: 'Thursday'};

/* ---------- Map tiles that change as the arrival problems are fixed ---------- */
function sdTile(d, ch) {
  if (ch === 'ð' && G.f.sdFixClause) d.pal = 'sdFilesOk';   // §9 found and on the plan's contact page
  if (ch === 'Æ' && G.f.sdFixNamed) d.pal = 'sdSisOk';      // named Inkstone accounts, shared logins retired
  return d;
}

/* ---------- Objective ---------- */
function sdObjective() {
  if (!G.trackId || !G.f.lbSummary) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'school', x: x, y: y, district: 'school'});
  if (!f.sdMet) return Object.assign(at('The School District: its door is on the east side of the square.', 2, 7), {step: true});
  if (sdMgr()) {
    if (!f.sdDrillA) return at('Owen Marsh’s note on the vendor’s notice: the technology office.', 12, 13);
    if (!f.sdNotice) return at('Work the vendor’s notice with Priya Lindgren: the student records office.', 7, 3);
    if (!f.sdInventory) return at('Which vendors hold which student data? The contract file room.', 13, 2);
    if (!f.sdTabletop) return at('Tabletop with Dr Vale: the technology office table.', 14, 11);
    if (!f.sdStaffing) return at('Nights: the district joins the rota. Owen Marsh, in the technology office.', 12, 13);
    if (!f.sdNight8) return at('End the day at the workroom desk.', 26, 12);
    if (!f.sdDrillB) return at('A 02:04 sign-in from abroad: Principal Brooks, in the hall.', 10, 6);
    if (!f.sdFacts) return at('Facts for counsel and the privacy officer: Adaeze Kole, in the technology office.', 17, 13);
    if (!f.sdDirective) return at('Dr Vale wants a word about a new app: her office.', 3, 12);
    if (!f.sdNight9) return at('End the day at the workroom desk.', 26, 12);
    if (!f.sdDrillC) return at('Lumenlark has replied, with an offer: Priya Lindgren, in the records office.', 7, 3);
  } else {
    if (!f.sdLetter) return at('Read the amended scoping letter with Adaeze Kole: the technology office.', 17, 13);
    if (!f.sdIntake) return at('Evidence intake: the evidence locker in the technology office.', 18, 12);
    if (!f.sdRequests) return at('What only the vendor holds: requests, through counsel. The bench.', 14, 11);
    if (!f.sdDrillA) return at('Question 1: were our students’ records in what Lumenlark held? The bench.', 14, 11);
    if (!f.sdStores) return at('Theo has a question about another district’s case: the technology office.', 12, 11);
    if (!f.sdNight8) return at('End the day at the workroom desk.', 26, 12);
    if (!f.sdIntake2) return at('Counsel added a question: three new items at the evidence locker.', 18, 12);
    if (!f.sdDrillB) return at('Question 4: was i.brandt’s 02:04 sign-in a compromise? The bench.', 14, 11);
    if (!f.sdReport) return at('Write SCH-01 for Adaeze Kole: the bench.', 14, 11);
    if (!f.sdDirective) return at('Dr Vale wants a word about a new app: her office.', 3, 12);
    if (!f.sdNight9) return at('End the day at the workroom desk.', 26, 12);
    if (!f.sdDrillC) return at('Lumenlark’s summary and our log disagree: Theo, in the technology office.', 12, 11);
  }
  if (!f.sdDojoDone) {
    if (!f.sdDojoMet) return at('(Optional) Wim Haddad’s ' + (sdMgr() ? 'Third-Party Risk' : 'Cloud & SaaS Log Analysis') + ' dojo, in the computer lab.', 27, 4);
    const i = sdC().dojo.findIndex(x => !x);
    return at('(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', [21, 23, 25][i], 1);
  }
  if (!f.sdBoard) return at('Take the School Board challenge: Lorna Pike, through the east door.', 8, 3, 'sboard');
  if (!f.sdNight10) return at('End the day at the workroom desk.', 26, 12);
  if (!f.sdBoss) return sdMgr() ? at('05:10: Lumenlark confirms, and a post names the district. Dr Vale, her office.', 3, 12) : at('05:10: Lumenlark confirms, and a post names the district. Lucia, the technology office.', 19, 11);
  if (sdMgr() && !f.sdStatus) return at('The firm’s status report: Lucia, in the technology office.', 19, 11);
  if (!f.sdSummary) return at('Dr Vale wants to close the week: her office.', 3, 12);
  return {text: 'School District done. Next: Community Clinic.', done: true, district: 'school'};
}

/* ---------- Triggers, interactions, talk ---------- */
function sdTriggers() {
  if (G.map === 'school' && G.trackId && G.f.lbSummary && !G.f.sdMet) { run(sdArrive); return true; }
  return false;
}
function sdInteract(ch, tx) {
  if (!inSchool()) return false;
  const f = G.f;
  if (!f.sdMet && G.map === 'school') { if ('§£YÆðŧŀ¤'.includes(ch)) { run(async () => { await say('The district office opens to you on Monday, once the Library’s week is closed.'); }); return true; } return false; }
  if (ch === '§') { run(sdTable); return true; }
  if (ch === '£') { run(async () => { if (sdDfir() && f.sdLetter && !f.sdIntake) await sdIntake(); else if (sdDfir() && f.sdNight8 && !f.sdIntake2) await sdIntake2(); else await say(sdDfir() ? 'The district’s evidence store: a locked case, a seal log, and nothing of Oxlow’s in it.' : 'The exercise kit: CISA’s tabletop templates, the district’s risk register, a box of index cards.'); }); return true; }
  if (ch === 'Y') { run(sdDesk); return true; }
  if (ch === 'ð') { run(async () => { if (sdMgr() && f.sdNotice && !f.sdInventory) await sdInventory(); else await say((f.sdFixList ? 'The contract file room. A new binder on top: “Vendors and student data: who holds what, under which contract, who owns it.”' : 'The contract file room: a cabinet per year, and no list of which vendor holds what.') + (f.sdFixClause ? ' §9 of Lumenlark’s contract is flagged, and on the plan’s contact page.' : '')); }); return true; }
  if (ch === 'Æ') { run(async () => { await say(f.sdFixNamed ? 'The Inkstone desk. A notice: “Every teacher signs in as themselves. Shared logins retired.”' : 'The Inkstone desk. A sticky note on the monitor: “rms-science / ask Nell for the password.”'); }); return true; }
  if (ch === 'ŧ') { run(async () => { await say('The lab’s laptop cart: thirty student laptops charging. Nothing in this case points at a student, and none of them is part of it.'); }); return true; }
  if (ch === 'ŀ') { run(async () => { await say('A lab PC: a half-built web page about volcanoes on the screen, and a sign: “Save your work to your own folder.”'); }); return true; }
  if (ch === '¤') { run(() => sdDojoPuzzle([21, 23, 25].indexOf(tx))); return true; }
  if (ch === '±') { run(async () => { await say('The Board’s minutes, by year. This year’s binder has a tab marked “Compact”.'); }); return true; }
  return false;
}
async function sdTalk(npc) {
  if (!SD_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.sdMet) { await say(f.lbSummary ? 'Come in: Dr Vale is expecting you.' : 'We’ll see you on Monday, once the Library’s week is closed.', who); return true; }
  switch (npc.id) {
    case 'vale':
      if (f.sdNight8 && !f.sdDirective && (sdDfir() ? f.sdReport : f.sdFacts)) { await sdDirective(); break; }
      if (f.sdNight10 && !f.sdBoss && sdMgr()) { await sdBoss(); break; }
      if (f.sdBoss && (sdDfir() || f.sdStatus)) { await sdSummary(); break; }
      await say(sdMgr() ? 'I decide what the district does. You make sure I know what I’m deciding.' : 'Kole says you tell her, and she tells me. Fine by me.', who); break;
    case 'marsh':
      if (sdMgr() && f.sdMet && !f.sdDrillA) { await sdDrillA(); break; }
      if (sdMgr() && f.sdTabletop && !f.sdStaffing) { await sdStaffing(); break; }
      await say(f.sdFixNamed ? 'Forty-one teachers on their own accounts since Wednesday morning. Nobody misses the shared ones.' : 'Owen Marsh. Two of us run IT for three schools. I’ll export whatever you need, hashed.', who); break;
    case 'kole':
      if (sdDfir() && !f.sdLetter) { await sdLetterTask(); break; }
      if (sdMgr() && f.sdDrillB && !f.sdFacts) { await sdFactsPack(); break; }
      await say('Facts to me. Privilege, what notice is required and what it says: Priya and I decide those. Dr Vale sends it.', who); break;
    case 'priya':
      if (sdMgr() && f.sdDrillA && !f.sdNotice) { await sdNoticeTask(); break; }
      if (sdMgr() && f.sdNight9 && !f.sdDrillC) { await sdDrillC(); break; }
      await say('Priya Lindgren. Every data agreement crosses my desk; until this week, not every app did.', who); break;
    case 'sato': await say(f.sdFixNamed ? 'Nobody asks me for the department passwords any more. I won’t miss it.' : 'Nell Sato, registrar. Half the substitutes know the science login. I’m not proud of it.', who); break;
    case 'brooks':
      if (sdMgr() && f.sdNight8 && !f.sdDrillB) { await sdDrillB(); break; }
      await say(f.sdNight8 ? 'I rang Ilse on the number in the staff directory, not the one in the email. Habit from the fire drills.' : 'Hal Brooks, Hollinmere Middle. My teachers want to know if the reading app is safe. So do I.', who); break;
    case 'ilse': await say('Grading at two in the morning through a VPN app. It was me, and I said so to Hal on the phone.', who); break;
    case 'wim': await sdDojoIntro(); break;
    case 'pike': await sdBoardScript(); break;
    case 'luciasd':
      if (sdDfir() && f.sdNight10 && !f.sdBoss) { await sdBoss(); break; }
      if (sdMgr() && f.sdBoss && !f.sdStatus) { await sdStatusReport(); break; }
      await say(sdDfir() ? 'What we can see, we report as what it shows. What we can’t, we say where it is and when we asked.' : 'Our report goes to Kole; you get the status, the same day.', who); break;
    case 'theosd':
      if (f.sdDrillA && !f.sdStores) { await sdStores(); break; }
      if (f.sdNight9 && !f.sdDrillC) { await sdDrill('tokendate'); f.sdDrillC = true; touchCSF('Detect'); await say('Two dates, both written down, and the difference called unknown. I’d have picked one.', who); break; }
      await say('Theo. I keep the districts in separate folders now.', who); break;
  }
  return true;
}

/* ---------- Arrival (Day 8, Monday) ---------- */
async function sdArrive() {
  const f = G.f, c = sdC();
  f.sdMet = true; G.day = Math.max(G.day, 8); G.focus = G.focusMax; touchCSF('Identify');
  if (sdDfir() && !c.rota) c.rota = sdAutoRota();
  await say('Day 8, Monday, 08:30. The School District’s office, in the old wing of Hollinmere Middle School. (The weekend passed: no call reached the on-call lead on Nights 5 to 7. The Library’s deadline is today; the Board and the Director decided on Friday not to pay, and the firm has found nothing published so far, which is not the same as nothing published. game)');
  await say('Corinne Vale, Superintendent. On Friday at 16:40 Lumenlark, the reading app in grades 3 to 8, emailed our technology inbox: “Some customer data may have been accessed.” Nothing about whose, or what.', 'Dr Corinne Vale');
  await say('Three more things, plainly. We have no list of which vendors hold which student data. Half our science teachers sign in to Inkstone on a shared department login. And nobody here can tell me which clause of Lumenlark’s contract covers this.', 'Dr Corinne Vale');
  unlock('fact', 'sdcisak12'); unlock('fact', 'sdferpa');
  if (sdMgr()) {
    await say('08:40, the district’s annex to the Compact’s plan: the retainer is called when the district’s student records may have been reached, wherever they are held, or when the on-call lead can’t contain an incident. (game)');
    let mins = SD_ACT_OK;
    while (true) {
      const items = SD_ACTIVATE.map(o => ({label: o.label, meta: {good: !!o.good}}));
      const i = await UI.openModal('The annex’s test', '<p>Lumenlark holds roster data from Inkstone for grades 3 to 8. Its notice says some customer data may have been accessed. Are the annex’s criteria met?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      mins += SD_ACT_LATE;
      await say(SD_ACTIVATE[i].why + ' (+' + SD_ACT_LATE + ' game minutes)');
    }
    c.activate = mins; G.cr.activate = mins; track();
    // Each wrong answer is a later call (game): the call, its acknowledgement and counsel's engagement follow from it.
    const hm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
    const call = 8 * 60 + 40 + (mins - SD_ACT_OK), ack = call + SD_ACT_OK, eng = Math.max(9 * 60, ack + 5);
    const retainer = hm(call) + ' retainer line called · ' + hm(ack) + ' Tallowmere acknowledges. Adaeze Kole, the district’s counsel, engages the firm at ' + hm(eng) + ' under a letter amended for a third-party incident, and tells the district’s cyber insurer. (game)';
    const revoke = '08:45, your advice to Owen Marsh: revoke LL-SYNC now and pause the sync, clearing nothing. Revoking stops new reads; it doesn’t erase the API log, the token registry or the export history. At 08:50, with Dr Vale’s agreement, he revokes it and notes the registry row as it stands; at 09:40 he exports and hashes all three. Teachers keep the rosters Lumenlark already has. (game)';
    if (call <= 8 * 60 + 45) { await say(retainer); await say(revoke); } else { await say(revoke); await say(retainer); }
    await say('Marsh wrote me a note at eight. I’d like you to read it before we do anything else.', 'Dr Corinne Vale');
  } else {
    await say('09:00: Adaeze Kole, the district’s counsel, engages Tallowmere under a letter amended for a third-party incident, and tells the district’s cyber insurer. (The district has no IR manager applying its annex: its counsel engages the firm, as Noor did for the Library. game)');
    await say('You lead it. The technology office is ours. Kole first: nothing gets collected before the letter.', 'Lucia Ferrand');
  }
}

/* ---------- The technology office table (manager: the tabletop; DFIR: the bench) ---------- */
async function sdTable() {
  const f = G.f;
  if (sdMgr()) {
    if (f.sdInventory && !f.sdTabletop) return sdTabletop();
    return say(f.sdTabletop ? 'The table: three index cards, each with an owner and a date.' : 'The technology office table. Dr Vale’s tabletop, once the inventory is done.');
  }
  if (!f.sdLetter) return say('The bench. Kole has the letter; read it with her first.');
  if (f.sdIntake && !f.sdRequests) return sdRequests();
  if (f.sdRequests && !f.sdDrillA) { await sdDrill('venddfir'); f.sdDrillA = true; touchCSF('Detect'); await say(G.cr.drills.venddfir.supported ? 'Question 1, from S-01 and S-05: held, yes; accessed, the vendor’s to show.' : 'Question 1 has an answer, but write it only from what you’ve read.', 'Lucia Ferrand'); await say('Theo has a question. He’s by the table.', 'Lucia Ferrand'); return; }
  if (f.sdIntake2 && !f.sdDrillB) { await sdDrill('signdfir'); f.sdDrillB = true; touchCSF('Detect'); await say('Her own sign-in, from S-06 and S-08. No disable, no reset: nothing to contain.', 'Lucia Ferrand'); return; }
  if (f.sdDrillB && !f.sdReport) return sdReport1();
  return say('Your bench: working copies only. The originals are sealed in the store.');
}

/* ---------- Drills ---------- */
async function sdDrill(key) {
  const c = G.cr;
  const r = await doDrill(SD_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (sdDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function sdDrillA() {
  await say('My note to Dr Vale at eight. Read it like you’d read anyone’s.', 'Owen Marsh');
  const r = await sdDrill('vendmgr');
  G.f.sdDrillA = true; touchCSF('Identify');
  await say(r.verdictOk ? 'Ours were in it, then: six fields, every night. I wrote “probably” about something I could have looked up.' : 'The export history says we sent six fields every night. I’ll write what we sent, not what we hope.', 'Owen Marsh');
  await say('Priya Lindgren has the notice in the records office. She wants the questions out today.');
}
async function sdDrillB() {
  await say('I rang Ilse at 08:10 on the number in the staff directory and wrote it down. Owen wants to know: compromise, or her?', 'Hal Brooks');
  const r = await sdDrill('signmgr');
  G.f.sdDrillB = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Her own sign-in, then, and I can say why. I’ll tell Owen not to disable her.' : 'Her laptop, her app, and she told me herself on a number I already had. That’s her.', 'Hal Brooks');
  await say('Adaeze Kole and Priya want the facts for families. The technology office.');
}
async function sdDrillC() {
  await say('Lumenlark’s reply came at nine: two pages, and an offer of an 84-page report if we sign their terms. Dr Vale has her pen out.', 'Priya Lindgren');
  const r = await sdDrill('offer');
  G.f.sdDrillC = true; touchCSF('Govern');
  await say(r.verdictOk ? 'Ask under §9.3 again, specifically, and nothing gets signed until Kole has cleared the terms. I’ll send it at ten.' : '§9.3 already owes us the facts, and those terms would lock out our own firm. Kole clears or refuses the terms; I ask again.', 'Priya Lindgren');
  await say('10:00: Priya asks again under §9.3, in writing, dated and logged; Kole is reviewing the terms; Dr Vale signs nothing until she has. (game)');
}

/* ---------- Manager M2: the vendor's notice ---------- */
async function sdNoticeTask() {
  const c = sdC(), who = 'Priya Lindgren';
  await say('The notice says almost nothing. Before we write back: which part of the contract are we writing under? Nobody knows, and the contract is forty pages.', who);
  let first = true;
  while (true) {
    const items = SD_CLAUSE.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The contract · which clause?', '<p>Lumenlark’s contract and data agreement (2023, game). Which clause covers a security incident?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false; await say(SD_CLAUSE[i].why);
  }
  unlock('fact', 'sdptac');
  await say('§9: 9.1, notice within 72 hours of confirming an incident; 9.2, what a notice must state (the data, the students, the dates, the steps taken); 9.3, on our request, the information we need and their cooperation, answered within two business days. (game)', who);
  const items = SD_QUESTIONS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'Send the questions', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> questions to send under §9.3.</p>' + shownOrder(SD_QUESTIONS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('The notice · our questions', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !SD_QUESTIONS[i].good);
  for (const i of wrong) { first = false; await say(SD_QUESTIONS[i].name + ': ' + (SD_QUESTIONS[i].id === 'others' ? 'other districts’ data isn’t ours to ask for, and Lumenlark can’t give it. Ask about ours.' : SD_QUESTIONS[i].id === 'blame' ? 'a name helps nobody decide anything. Ask what happened to our data.' : 'a promise the vendor can’t make, for a letter Kole and Priya haven’t decided to send.')); }
  while (true) {
    const its = SD_SENDER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The notice · who sends, by when', '<p>Four questions, under §9.3. Who sends them, and when are the answers due?</p>', its, {shuffle: true, closable: false, cls: 'drill'});
    if (its[i].meta.good) break;
    first = false; await say(SD_SENDER[i].why);
  }
  c.notice = {first: first};
  G.f.sdNotice = true; unlock('act', 'sdnotice'); touchCSF('Respond'); track();
  await say('11:30: sent under §9.3, Kole copied, answers due Wednesday at 17:00, and anything urgent out of hours to the Compact’s on-call number. Logged: “requested Day 8 (Monday) 11:30”. Kole checks whether §14’s formal-notice method applies to a §9.3 request; a copy goes to §14’s address in case it does. (game)', who);
  await say('Next: which other vendors hold what? The contract file room is through the door to my right.', who);
}

/* ---------- Manager M1: the vendor and data inventory ---------- */
async function sdInventory() {
  const c = sdC();
  let first = true;
  while (true) {
    const items = SD_INV_SOURCE.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Inventory · where the list comes from', '<p>Nobody has a list of which vendors hold which student data. Where does it come from?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    first = false; await say(SD_INV_SOURCE[i].why);
  }
  const tbl = '<table class="sc"><tr><th>Service</th><th>Student data</th><th>Paper</th></tr>' + SD_INV.map(r => '<tr><td>' + esc(r.name) + '</td><td>' + esc(r.data) + '</td><td>' + esc(r.contract) + '</td></tr>').join('') +
    '<tr><td>11 apps</td><td>unknown: teachers signed up with their district accounts</td><td>click-through terms</td></tr></table><p class="small">From Inkstone’s sharing setup and token list, the SSO’s app list, accounts payable and the contract files (game).</p>';
  await UI.openModal('Inventory · who holds what', tbl, [{label: 'Now the owners', meta: {good: true}}], {closable: false, cls: 'drill'});
  let owned = 0;
  for (const r of SD_INV) {
    let ok = true;
    const opts = r.owners.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Inventory · owner', '<div class="card"><b>' + esc(r.name) + '</b><br>' + esc(r.data) + '<br>' + esc(r.contract) + '</div><p>Who owns this relationship?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      ok = false; first = false;
      await say(/Marsh/.test(r.owners[i].label) ? 'Marsh is the technical contact: he connects it and can switch it off, but he didn’t choose it and doesn’t decide what it’s for.' : /Priya/.test(r.owners[i].label) ? 'Priya reviews the data agreement; she doesn’t run the service or decide whether the district uses it.' : /principal/i.test(r.owners[i].label) ? 'One relationship, one owner: the office that signed it and decides what it sends.' : 'The vendor holds the data; the district owns the decision to use the service.');
    }
    if (ok) owned++;
  }
  c.inv = {first: first, owned: owned};
  G.f.sdInventory = true; G.f.sdFixList = true; unlock('act', 'sdinventory'); touchCSF('Identify'); track();
  await say('A list, with owners. And eleven apps nobody can describe yet: each gets a short review before it keeps any student data. (game)', 'Priya Lindgren');
  await say('Dr Vale has the afternoon for a tabletop, at the technology office table.');
}

/* ---------- Manager M3: the tabletop with the Superintendent ---------- */
async function sdTabletop() {
  const c = G.cr, who = 'Dr Corinne Vale';
  await say('An hour. Make it about us, not about the news. Pick it from our register.', who);
  const reg = '<table class="sc"><tr><th>Risk</th><th>Likelihood</th><th>Impact</th></tr>' + SD_RISKS.map(r => '<tr><td>' + esc(r.text) + '</td><td>' + r.lik + '</td><td>' + r.imp + '</td></tr>').join('') + '</table><p class="small">The district’s risk register, 1 to 5 (game). CISA’s tabletop packages give the templates.</p>';
  while (true) {
    const items = SD_SCENARIO.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Tabletop · the scenario', reg, items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(i === 1 ? 'Likely and well understood: an exercise teaches most where the plan is weakest. The vendor risk is the highest impact and the biggest unknown, and it’s live: rehearse the confirmation before it comes.' : i === 2 ? 'A scenario from the news tests nobody’s real plan. Use the register.' : 'A report is a source, not a scenario. Use the register: these are the district’s risks.');
  }
  for (const inj of SD_INJECTS) {
    const items = inj.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Tabletop · inject', '<p><b>' + esc(inj.t) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(inj.opts[i].why);
    }
  }
  c.ex.run += 1; c.ex.actions += SD_EX_ACTIONS; sdC().ex = SD_EX_ACTIONS; track();
  G.f.sdTabletop = true; unlock('act', 'crtabletop'); unlock('fact', 'crctep'); touchCSF('Govern'); touchCSF('Respond');
  await say('Three gaps, three actions (game): named Inkstone accounts for every teacher, retiring the shared logins (Owen Marsh, by Wednesday 08:00); §9, Lumenlark’s incident line, and a monitored address plus the on-call number for every vendor’s security notices, on the plan’s contact page (Priya, today by 17:00); a script for the front offices, written by Priya and agreed by Kole (by Tuesday noon).' + (G.f.lbBookmark ? ' Bookmark Badge: the owners arrive already agreed.' : ''), who);
  await say('The gap behind the second one: Lumenlark’s notice reached a general inbox at 16:40 on Friday and was read at 07:50 on Monday, with the token live and the advice to rotate it unread. The only unexplained read came on Sunday at 23:58, in between. From now on Owen Marsh acts on a vendor’s “rotate credentials” advice the same day. (game)', who);
  await say('Before you go: Owen says the district’s nights are now yours too. Talk to him about cover.', who);
}

/* ---------- Manager M5: the district's nights and the week-2 rota ---------- */
function sdAutoRota() {
  const pre = G.cr.rota ? [G.cr.rota.assign[5] || null, G.cr.rota.assign[6] || null] : [null, null];
  return rotaAuto(SD_ROTA, pre, SD_ROTA_ORDER);
}
async function sdStaffing() {
  const c = sdC(), who = 'Owen Marsh';
  await say('Your rota covers the town and the Library at night. Now us too. Who watches three schools after hours without wearing out the people who watch everything else?', who);
  const fc = o => '<li>' + esc(o.label.split(':')[0].split(',')[0]) + ': overtime forecast ' + o.overtime + ' h of ' + SD_ROTA.budget + ' in a typical week, gaps ' + o.gaps + ' h (game)</li>';
  let pick;
  while (true) {
    const items = SD_COVER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The district’s nights', '<p>The rota as it stands, plus the district. The forecasts are for a typical week with both members (game).</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    pick = SD_COVER[i];
    if (pick.good) break;
    await say(pick.why);
  }
  c.cover = {k: pick.k, gaps: pick.gaps, overtime: pick.overtime, variance: Math.round((pick.overtime - SD_ROTA.budget) / SD_ROTA.budget * 100)};
  await say('Signed: at night, a page only for bulk reads or exports of student records, anything touching the vendor integration, or a host that spreads. The rest waits for 07:00. Retainer hours for anything bigger. (game)', who);
  await UI.openModal('Cover · the forecast', '<ul>' + SD_COVER.map(fc).join('') + '</ul>', [{label: 'Now the week', meta: {good: true}}], {closable: false, cls: 'drill'});
  const pre = G.cr.rota ? [G.cr.rota.assign[5] || null, G.cr.rota.assign[6] || null] : [null, null];
  const r = await doRota(SD_ROTA, pre);
  c.rota = {assign: r.assign, stats: r.stats};
  const L = rotaForecast(SD_ROTA, r.assign);
  await UI.openModal('Rota · week 2', rotaTable(SD_ROTA, r.assign) +
    '<p>Rota gaps <b>' + r.stats.gaps + ' h</b> · nights past two in a row <b>' + r.stats.tired.length + '</b> · overtime this week <b>' + r.stats.overtime + ' of ' + SD_ROTA.budget + ' h</b> (game)</p>' +
    (L.length ? '<ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '<p class="small">Nights 11 to 14 fall after the School District: a forecast only. (game)</p>',
    [{label: 'Pin it to the team board', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.sdStaffing = true; unlock('act', 'crrota'); unlock('act', 'crcover'); touchCSF('Govern'); track();
  await say(r.stats.tired.length ? 'Somebody’s on a third night in a row in there. We’ll see it in the calls. (game)' : r.stats.gaps ? 'There’s a hole in it. Whatever fires that night waits for the morning.' : 'Two members, one rota, nobody past two in a row. That’s a week people can keep.', who);
}

/* ---------- Manager M4: the facts for counsel and the privacy officer ---------- */
async function sdFactsPack() {
  const c = sdC(), who = 'Adaeze Kole';
  await say('Priya and I decide what families are told, and how. I want facts, not law and not comfort. What goes in the pack?', who);
  const items = SD_FACTS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'Hand over the pack', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> pages for counsel and the privacy officer.</p>' + shownOrder(SD_FACTS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('Facts for counsel · the pack', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !SD_FACTS[i].good);
  for (const i of wrong) await say(SD_FACTS[i].name + ': ' + (SD_FACTS[i].id === 'law' ? 'a legal conclusion, and not one anybody here has checked. What the law requires is Kole’s to say.' : SD_FACTS[i].id === 'promise' ? 'a promise about data the district no longer holds. Kole and Priya decide what the letter says.' : 'a guess from the news. The pack says what the evidence shows.'));
  c.facts = {wrong: wrong.length};
  G.f.sdFacts = true; unlock('act', 'sdfacts'); touchCSF('Respond'); track();
  await say(wrong.length ? 'I’ve taken those pages out. The rest is what I need: what we shared, what they said, what our logs show, what we don’t know and who holds it.' : 'That is what I need. Priya and I will decide what families hear, and when. Thank you.', who);
  await say('Dr Vale has a new app she wants to talk about. Her office.');
}

/* ---------- The directive (both tracks): sign Sumcraft this week ---------- */
async function sdDirective() {
  const who = 'Dr Corinne Vale', t = G.trackId;
  if (G.f.sdDirective) { await say('Priya’s review is on my desk. If it passes, I sign on Friday, with a token that reads three fields.', who); return; }
  await say('Teachers have asked for Sumcraft, a maths-practice app, from next week. The vendor is ready, the price is fine, and I want to sign this week without a data review. They need it.', who);
  if (t === 'dfir') await say('Kole says you can tell me what this case taught us. Can I sign?', who);
  const L = SD_DIRECTIVE[t];
  while (true) {
    const items = L.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose(t === 'dfir' ? 'What do you tell Dr Vale?' : 'How do you answer the Superintendent?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(L[i].why);
  }
  await say(t === 'dfir' ? 'The facts from the case: Lumenlark’s token could read grades and attendance though the contract lists rosters only, and nobody knew which clause covered a breach. Four questions before signing: what data it takes, where it goes, what its terms say about the data and a breach, and who owns it. Kole agreed I could say that much.' :
    'A minimum review: what data Sumcraft takes, where it goes, what its terms say about the data and about a breach, and who signs and owns it. Priya can do it by Wednesday. Then it is your decision, with her review.');
  await say('Then Priya reviews it by Wednesday. If it passes, I sign on Friday, with a token scoped to what it needs. My decision. (game)', who);
  G.f.sdDirective = true; unlock('act', 'sdreview'); touchCSF('Govern');
  await say(sdMgr() ? '(Present the trade-off; the owner decides.) End the day when you’re ready.' : '(Give the facts; the owner decides.) End the day when you’re ready.');
}

/* ---------- DFIR D1: the amended scoping letter ---------- */
async function sdLetterTask() {
  const who = 'Adaeze Kole', f = G.f;
  const row = (k, v) => '<tr><th style="vertical-align:top;white-space:nowrap">' + k + '</th><td>' + v + '</td></tr>';
  const letter = '<p><b>Scoping letter · Tallowmere Forensics · case SCH-01, amended for a third-party incident (game)</b></p><table class="sc letter">' +
    row('Engaged by', 'Adaeze Kole, counsel for the School District') +
    row('Questions', '1. Were our students’ records among what Lumenlark held, and which fields?<br>2. What does our side show about the integration: its token, its scope, its use?<br>3. Did anything reach Inkstone through the integration beyond the token’s reads?') +
    row('In scope', 'Inkstone (SIS-01) and its logs, the district’s SSO, FW-SD’s log, the contract files') +
    row('Can’t see', 'Lumenlark’s systems: out of scope, not ours to examine. Requests for what it holds go through counsel under §9.3') +
    row('Report to', 'Adaeze Kole; she and Priya Lindgren decide what families are told') +
    row('Counsel', 'privilege, notification and disclosure are counsel’s; the firm reports facts. Anything outside the questions goes to counsel first.') + '</table>';
  await say('Read it before you touch anything. Half of what you’d want is on Lumenlark’s side of the fence, and that changes how you work.', who);
  while (true) {
    const items = SD_LETTER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The scoping letter', letter + '<p><b>Your first step?</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(SD_LETTER[i].why);
  }
  f.sdLetter = true; unlock('act', 'crscope'); touchCSF('Govern'); track();
  await say('09:15: at our request, and with Dr Vale’s agreement, Owen Marsh revokes LL-SYNC at 09:20 and pauses the sync, clearing nothing: revoking doesn’t erase the API log or the registry row. Then he exports and hashes them, at 09:40. The evidence locker, when they come. (game)', 'Lucia Ferrand');
}

/* ---------- DFIR D2: evidence intake ---------- */
async function sdIntake() {
  const c = G.cr, cu = c.custody || (c.custody = {items: 0, complete: 0, gaps: 0});
  await say('Five items: three from Owen Marsh, hashed at export; the SSO log; the contract, scanned by Priya. Log each one: who, when, the hash on receipt against the form, where the original is sealed. Work on copies.', 'Lucia Ferrand');
  for (const it of [SD_INTAKE.s01, SD_INTAKE.s02, SD_INTAKE.s03, SD_INTAKE.s04, SD_INTAKE.s05]) {
    let first = true;
    const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 8. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      first = false; cu.gaps++;
      await say(it.opts[i].why);
    }
    const inherent = !!it.opts.find(o => o.good).gap;
    cu.items++; if (inherent) cu.gaps++;
    if (first && !inherent) cu.complete++;
    if (it.id === 'S-04') await say('11:10: Marsh sends the unfiltered SSO export for the same 30 days, hashed. Both records stay in the log. (game)');
  }
  track();
  G.f.sdIntake = true; unlock('act', 'crcustody'); touchCSF('Respond');
  await say('Custody log, the district’s store: five items in. Now the part we can’t see: what do we ask Lumenlark for? The bench.', 'Lucia Ferrand');
}

/* ---------- DFIR D3: requests for vendor-held evidence ---------- */
async function sdRequests() {
  const c = sdC();
  const items = SD_REQUESTS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'Send them through Kole', done: true, meta: {done: true}}]);
  const body = '<p>Lumenlark’s systems are out of scope. Pick the <b>four</b> things to request through Kole, under §9.3.</p>' + shownOrder(SD_REQUESTS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('Requests · what only the vendor holds', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !SD_REQUESTS[i].good);
  for (const i of wrong) await say(SD_REQUESTS[i].name + ': ' + (SD_REQUESTS[i].id === 'remote' ? 'its systems are out of the letter’s scope and not ours to examine. Ask for its records.' : SD_REQUESTS[i].id === 'attacker' ? 'a name isn’t evidence, and it answers none of the questions. Ask for records.' : 'other districts’ students’ records aren’t ours to hold. Ask about ours.'));
  c.requests = {wrong: wrong.length, date: 'Day 8 (Monday)'};
  G.f.sdRequests = true; unlock('act', 'sdthird'); touchCSF('Respond'); track();
  const nReq = SD_REQUESTS.filter(p => p.good).length - wrong.length;
  await say('11:30: Kole sends ' + (nReq === 1 ? 'it' : 'them') + ' with Priya’s §9.3 questions, one letter, with the Compact’s on-call number for anything urgent out of hours. Logged ' + (nReq === 1 ? 'R-01' : 'R-01 to R-0' + nReq) + ': “requested Day 8 (Monday)”. Every unknown that rests on Lumenlark’s records will carry that date. (game)', 'Lucia Ferrand');
}

/* ---------- DFIR D4: one store per client ---------- */
async function sdStores() {
  const who = 'Theo Marchetti';
  await say('Oxlow Area Schools engaged us yesterday: they use Lumenlark too. One breach, one vendor. Can I put both districts’ Lumenlark evidence in one case folder? (game)', who);
  while (true) {
    const items = SD_STORES.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Two districts, one vendor', '<p>Tallowmere’s clients this week: the Library (LIB-02, still open), the School District (SCH) and Oxlow Area Schools (game). Each has its own sealed store.</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(SD_STORES[i].why);
  }
  G.f.sdStores = true; unlock('act', 'crstores'); touchCSF('Govern'); track();
  await say('Separate stores. I’ll ask Lucia about 198.51.100.70. (She asks both districts’ counsel; Kole agrees the address alone may go to Oxlow’s counsel. game)', who);
  await say('End the day when you’re ready.', 'Lucia Ferrand');
}

/* ---------- DFIR (Day 9): counsel's added question; three items; the Quiet Thread ---------- */
async function sdIntake2() {
  const c = G.cr, cu = c.custody || (c.custody = {items: 0, complete: 0, gaps: 0});
  await say('Kole’s question, in writing at 07:45: was i.brandt’s 02:04 sign-in a compromise? Marsh exported S-06 (her Inkstone and SSO sign-ins, Day 1 to Day 9) and S-07 (FW-SD’s log for Night 8) at 08:30, hashed. Logged and sealed. (game)', 'Lucia Ferrand');
  cu.items += 2; cu.complete += 2;
  let first = true;
  const it = SD_INTAKE_NOTE, opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
  while (true) {
    const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 9. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
    if (opts[i].meta.good) break;
    first = false; cu.gaps++;
    await say(it.opts[i].why);
  }
  cu.items++; if (first) cu.complete++;
  await sdQtEvidence();
  G.f.sdIntake2 = true; touchCSF('Respond'); track();
  await say('Question 4 is on the bench when you are.', 'Lucia Ferrand');
}
// The Quiet Thread clue, seen in S-07 (DFIR). Noticing is the mechanic: the prompt opens on "Leave it".
async function sdQtEvidence() {
  if (qtFound('sd-probe')) return;
  const i = await choose('S-07, FW-SD’s log for Night 8. Question 4 needs 203.0.113.140: it reached only SIS-01’s web front. The log runs on through the night.', [{label: 'Read the rest of the night’s log too'}, {label: 'Leave it: question 4 has its answer'}], {cursor: 1});
  if (i !== 0) return;
  await say('03:21–03:22, Night 8: FW-SD drops echo requests (pings) from FD-STAFF-11’s address, arriving over the Compact’s link, to eleven district addresses in turn, one each, SIS-01’s among them: a check of which hosts are there, not of any service. The link lets only logs out of the district, so none got through. Nothing alerted. What sent them is unknown.');
  await say('Not one of the letter’s questions. It goes to Kole first; with her agreement, to Lucia and Rae’s suspicion-file team. Nothing changes on svc-print without a plan.');
  await crQtAfterNote(qtNote('sd-probe'));
}

/* ---------- DFIR: SCH-01 ---------- */
async function sdReport1() {
  const c = G.cr;
  const r = await doReport(SD_REPORT_1);
  c.reports.sd1 = {score: r.score, over: r.over, under: r.under};
  c.corrected += r.over; track();
  G.f.sdReport = true; touchCSF('Respond');
  unlock('act', 'sdscope'); unlock('fact', 'sdptac');
  await say('To Kole at 12:00. With her agreement the recommendations went to Dr Vale, who accepted them: named Inkstone accounts for every teacher (Marsh, by Wednesday 08:00), §9, Lumenlark’s incident line and a monitored address for every vendor’s security notices on the plan’s contact page (Priya, done by 17:00), a vendor’s “rotate credentials” advice acted on the same day (Marsh), and any new token scoped to the contract’s data list. (game)', 'Lucia Ferrand');
  await say('Dr Vale wants a word about a new app. Her office.', 'Lucia Ferrand');
}

/* ---------- The desk: end the day, and the night between ---------- */
async function sdDesk() {
  const f = G.f, mgr = sdMgr();
  const ready = mgr ? ((f.sdStaffing && !f.sdNight8) || (f.sdDirective && !f.sdNight9) || (f.sdBoard && !f.sdNight10))
                    : ((f.sdStores && !f.sdNight8) || (f.sdDirective && !f.sdNight9) || (f.sdBoard && !f.sdNight10));
  if (!ready) { await say('A hot desk in the staff workroom. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.sdNight8) await sdNight(8);
  else if (!f.sdNight9) await sdNight(9);
  else await sdNight(10);
}
async function sdNight(n) {
  const c = sdC(), lead = sdLead(n), tired = sdTired(n), first = lead ? lead.split(' ')[0] : null;
  const run = tired ? rotaRunAt(c.rota.assign, n - SD_ROTA.first) : 0;
  let body = '<p>Night ' + n + ' (' + SD_DAY[n] + ' to ' + SD_DAY[n + 1] + '). On call: <b>' + esc(lead || 'nobody') + '</b>' + (tired ? ' (night ' + run + ' in a row)' : '') + '.</p>';
  if (n === 8) body += '<p>02:04: a staff sign-in from another country lands in the technology office’s queue. Under the district’s threshold, one sign-in with no bulk read waits for 07:00. (game)</p>';
  if (n === 9) body += '<p>02:15: a bulk-export alert on Inkstone, which the district’s threshold pages. ' + (first ? first + ' checks the job: the registrar’s report-card export, scheduled for the wrong night; it wrote to SIS-01’s own disk and nothing left the district' + (tired ? '. Slowly: a thin first look, and at 02:40 a call to you' : '') + '.' : 'Nobody is on call: it waits for Owen Marsh at 07:00, who finds the registrar’s report-card export, scheduled for the wrong night.') + ' Marsh also moves 41 teachers onto their own Inkstone accounts. (game)</p>';
  if (n === 10) body += '<p>05:10: Lumenlark emails Owen Marsh, and at 05:30 its incident team rings the after-hours number the district gave it on Monday. 05:40: a post names the district. ' + (first ? first + ' takes the page' + (tired ? ', on a third night or more in a row: a thin first look, with fewer facts in it' : ': a clear first look, and the post captured') + '.' : 'Nobody is on call: the call goes unanswered, and both wait for Owen Marsh at 07:00.') + ' (game)</p>';
  await UI.openModal('Night ' + n, body, [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = n + 1; G.focus = G.focusMax;
  if (tired && sdMgr() && SD_ROTA.calls[n]) { G.focus = Math.max(10, G.focus - 10); await say('You were up at ' + (n === 9 ? '02:40' : '05:45') + ' with a tired on-call lead. Focus ' + G.focus + '/' + G.focusMax + ' this morning. (game)'); }
  G.f['sdNight' + n] = true;
  if (n === 8 && sdMgr()) G.f.sdFixClause = true;   // Priya's tabletop action, done by 17:00 on Day 8
  if (n === 8) await say((sdMgr() ? 'Day 9, Tuesday, 07:05. Owen Marsh has an alert: i.brandt signed in at 02:04 from another country. By 08:25 Principal Brooks has called her on the number in the staff directory, and written it down. He’s in the hall.' : 'Day 9, Tuesday, 07:45. Kole adds a question to the letter, in writing: was i.brandt’s 02:04 sign-in a compromise? Three new items are at the evidence locker.') + ' (Monday passed with nothing of the Library’s published that the firm has found. game)');
  if (n === 9) {
    G.f.sdFixNamed = true; G.f.sdFixClause = true; unlock('act', 'sdnamed');   // DFIR: the report's recommendations, done Day 9 17:00 (the clause) and Day 10 08:00
    if (sdMgr()) { G.cr.ex.closed += c.ex || 0; touchCSF('Protect'); }
    await say('Day 10, Wednesday, 09:00. Every teacher signs in to Inkstone as themselves now. Lumenlark’s reply has arrived: two pages, and an offer. (game)');
    if (sdDfir()) { const cu = G.cr.custody; cu.items++; cu.complete++; await say('Lumenlark’s summary is logged on receipt as S-09, hashed. Theo has it side by side with our API log. (game)', 'Lucia Ferrand'); }
  }
  if (n === 10) { c.night10 = {lead: lead, tired: tired}; await say(sdMgr() ? (!lead ? 'Day 11, Thursday, 07:10. Dr Vale is in her office with Lumenlark’s email open.' : tired ? 'Day 11, Thursday, 06:15. Dr Vale is in her office with the on-call lead’s thin note: a post names the district, something about Lumenlark.' : 'Day 11, Thursday, 06:15. Dr Vale is in her office with Lumenlark’s email, forwarded by Owen Marsh at 05:50.') : 'Day 11, Thursday, ' + sdAt('06:20') + '. Kole has engaged the firm again. Lucia is in the technology office.'); }
  track();
}

/* ---------- Dojo (Wim Haddad; original puzzles) ---------- */
function sdDojo() { return sdMgr() ? SD_DOJO_MGR : SD_DOJO_DFIR; }
async function sdDojoIntro() {
  const who = 'Wim Haddad', f = G.f;
  if (!f.sdDrillC) { await say('Wim Haddad, computer science. The practice terminals are free once your week’s cases are done.', who); return; }
  if (!f.sdDojoMet) { f.sdDojoMet = true; await say(sdMgr() ? 'Third-Party Risk: three terminals. What to know before a vendor gets data, and what to do when it tells you something went wrong.' : 'Cloud and SaaS Log Analysis: three terminals. Logs that stop, scopes that overreach, sign-ins that look odd.', who); return; }
  if (f.sdDojoDone) { await say(sdMgr() ? 'Know what you share, own each relationship, review before you sign.' : 'Could is not did. No log, no inference. A country is a reason to look.', who); return; }
  await say('Puzzles solved: ' + sdC().dojo.filter(Boolean).length + ' of 3. The terminals are behind you, along the north wall.', who);
}
async function sdDojoPuzzle(i) {
  const f = G.f, c = sdC();
  if (i < 0) return;
  if (!f.sdDojoMet) { await say('A practice terminal. Talk to Wim first.'); return; }
  const p = sdDojo()[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who has to act on it would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF(sdMgr() ? 'Govern' : 'Detect');
  if (!c.dojo.every(Boolean) || f.sdDojoDone) return;
  f.sdDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2);
  await say('All three. Focus ' + G.focusMax + ' (game).', 'Wim Haddad');
}

/* ---------- The School Board ---------- */
async function sdBoardScript() {
  const who = 'Lorna Pike', f = G.f, c = sdC();
  if (f.sdBoard) { await say('The Slate Badge says the district trusts how you work. Keep earning it.', who); return; }
  if (!f.sdDrillC) { await say('The Board sits once your week’s cases are done.', who); return; }
  await say('The School Board. Three questions, the way parents will put them to us. We grade the answer we can act on.', who);
  const specs = sdMgr() ? SD_BOARD_SPECS_MGR() : SD_BOARD_SPECS_DFIR();
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
  f.sdBoard = true; f.sdSlate = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the School Board. This is the Slate Badge (game).', who);
  await say(sdMgr() ? 'Its power, from the next district on: every vendor in an incident arrives with its contract’s incident clause already on the plan’s contact page. And you carry a little more now: Focus +4.' : 'Its power, from the next district on: every request you make for vendor-held evidence is logged with its date the moment it goes, so each unknown carries its next step. And you carry a little more now: Focus +4.', who);
  touchCSF('Govern');
  await say('End the day when you’re ready.');
}

/* ---------- The boss (game-original): the vendor confirms, and an extortion post ---------- */
async function sdStages(S, keys) {
  const b = sdC().boss;
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
async function sdBoss() {
  const c = sdC(), n10 = c.night10 || {lead: sdLead(10), tired: sdTired(10)};
  c.boss = {first: [], look: n10.tired ? 'thin' : n10.lead ? 'clear' : 'none'};
  if (sdMgr()) {
    await say(c.boss.look === 'thin' ? 'A post names us, “something about Lumenlark”: that’s all the note says. Owen brings Lumenlark’s email at 07:10. Tell me what we do, and in what order.' : '“Files copied from our environment included roster data from your district’s integration.” That’s all it says. And Owen says there’s a post. Tell me what we do, and in what order.', 'Dr Corinne Vale');
    await say((c.boss.look === 'none' ? 'No first look: Night 10 had nobody on call, so both waited for Owen Marsh at 07:00.' : c.boss.look === 'thin' ? 'The night’s on-call lead, on a third night running, sent a thin first look: the email and the sample rows come later, from Marsh.' : 'The night’s on-call lead sent a clear first look: the post captured, the district named, ten sample rows.') + ' The firm has been on this since Monday. (game)');
    const S = sdMgrBossStages();
    await sdStages(S, ['s1']);
    await say(sdAt('06:40') + ': Kole and Priya are on their way. The firm has the email and the capture. Lorna Pike is told, and Kole updates the district’s cyber insurer. Priya asks Lumenlark under §9.3 for the list of files that held our district’s data. (game)');
    await sdStages(S, ['s2']);
    await say('09:00: the Board heard what we know, what we don’t, who decides what families hear, and 13:00 for the next update. Principals have Priya’s script, agreed by Kole. (game)');
    await sdStages(S, ['s3']);
    await say('13:00, on time. Dr Vale keeps the sync paused and asks Lumenlark, under §11 and §9.3, what it still holds of ours; deletion when she decides. Before any re-enable: the minimum review and a token scoped to Exhibit A. Kole and Priya have the field list and decide what families are told. With Kole’s agreement the FBI has the post, as the plan’s contact page says. Nobody contacts the poster. (game)');
  } else {
    await say('Kole engaged us again at ' + sdAt('06:20') + ': what could have left through the integration, and anything on our side since the revocation. Your case.', 'Lucia Ferrand');
    const cu = G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0});
    cu.items += 3; cu.complete += 3;   // S-10 to S-12
    await say('The Compact’s on-call lead captured the post at 05:40 with its hash recorded' + (G.f.lbBookmark ? ' (Bookmark Badge)' : '') + '. Logged as S-11. (game)');
    const S = sdDfirBossStages();
    await sdStages(S, ['s1']);
    await say(sdAt('06:50') + ': S-10 (Lumenlark’s email, with headers) hashed. ' + sdAt('07:10') + ': S-12 (Inkstone’s API log and token registry since Monday 09:40) exported, hashed and sealed. Kole asks Lumenlark again, in writing, to keep every record of our tenant. (game)');
    await sdStages(S, ['s2']);
    const r = await doReport(SD_REPORT_2);
    G.cr.reports.sd2 = {score: r.score, over: r.over, under: r.under};
    G.cr.corrected += r.over;
    await say('14:00: to Kole. The sync stays paused. Kole and Priya have the field list and decide who must be told; Dr Vale decides about the contract; Kole has updated the district’s cyber insurer; with her agreement, the FBI has the post. (game)');
  }
  c.boss.ok = c.boss.first.every(Boolean);
  G.f.sdBoss = true; unlock('tech', 'T1657'); unlock('tech', 'T1550.001'); touchCSF('Respond'); touchCSF('Recover'); track();
  if (sdMgr()) await say('Lucia has the firm’s status report for you in the technology office.', 'Dr Corinne Vale');
  else await say('Dr Vale wants to close the week in her office.', 'Lucia Ferrand');
}

/* ---------- Manager: the firm's status report (and the Quiet Thread clue) ---------- */
async function sdStatusReport() {
  const who = 'Lucia Ferrand';
  const body = '<pre class="art">Tallowmere · status · SCH-02 · Day 11 15:00 (game)\n' +
    'Found       the 10 sample rows match our students’ records;\n' +
    '            six roster fields shared, 4,410 students since 2023;\n' +
    '            roster reads only in 90 days; none after Monday 08:50\n' +
    'Not found   when our data was copied, by whom, how much;\n' +
    '            held by the vendor, requested Day 8 (Monday)\n' +
    'Evidence    S-01 to S-12: hashed, sealed\n' +
    'Report      to Adaeze Kole\n' +
    'Appendix    one observation outside the district’s questions,\n' +
    '            not yet explained, passed to counsel first:\n' +
    '            it touches the suspicion file</pre>';
  await say('The status, as promised. The report itself goes to Kole; this is yours.', who);
  await UI.openModal('The firm’s status report', body, [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  if (!qtFound('sd-probe')) {
    const i = await choose('The appendix: an observation not yet explained.', [{label: 'Read the appendix'}, {label: 'Leave it: it’s with Kole'}], {cursor: 1});
    if (i === 0) {
      await say('Appendix: reading FW-SD’s log for Night 8, for counsel’s question about a teacher’s sign-in, the firm saw pings from FD-STAFF-11’s address, over the Compact’s link, to eleven district addresses in turn, SIS-01’s among them, at 03:21–03:22. All dropped: the link lets only logs out. Passed to counsel; with her agreement, to Rae’s suspicion-file team. Not acted on.');
      await say('Nothing changes on svc-print without a plan. You pass it to Rae, through Kole.');
      await crQtAfterNote(qtNote('sd-probe'));
    }
  }
  G.f.sdStatus = true; unlock('act', 'sdstatus'); touchCSF('Respond'); track();
  await say('Dr Vale wants to close the week in her office.', who);
}

/* ---------- Scorecard extra and the end-of-district summary ---------- */
function sdScoreHtml() {
  if (!G.trackId || !G.f.sdMet) return '';
  const c = G.cr, s = c.sd || {};
  if (sdMgr()) return '<p>School District: retainer ' + (s.activate !== null && s.activate !== undefined ? '<b>' + s.activate + ' min</b>' : 'not called') + ' · inventory ' + (s.inv ? '<b>' + s.inv.owned + ' of 3</b> owners first time' : 'not yet') + ' · district nights ' + (s.cover ? '<b>' + esc(s.cover.k) + '</b>' : 'not set') + ' (game)</p>';
  return '<p>School District: requests logged <b>' + (s.requests ? SD_REQUESTS.filter(p => p.good).length - s.requests.wrong : 0) + '</b> (requested Day 8) · reports filed <b>' + ['sd1', 'sd2'].filter(k => c.reports[k]).length + '</b> · clients in parallel <b>' + (G.f.sdStores ? 3 : 2) + '</b> (game)</p>';
}
function sdDrillRows() {
  const keys = sdMgr() ? ['vendmgr', 'signmgr', 'offer'] : ['venddfir', 'signdfir', 'tokendate'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(SD_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function sdSummary() {
  const f = G.f, c = sdC(), t = G.trackId;
  if (!f.sdSummary) {
    f.sdSummary = true; touchCSF('Govern');
    Series.markEdition('crossroads', {track: t, school: true});
    await say((t === 'manager' ? 'I know what we share and with whom, ' : 'I know what we shared with Lumenlark, ') + 'every teacher signs in as themselves, and I know which clause to read. And I know who decides what. Thank you.', 'Dr Corinne Vale');
  }
  const body = '<p class="big">The School District: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (SD_DAY[G.day] || '') + ')</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + sdDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>Reports filed: SCH-01 <b>' + (G.cr.reports.sd1 ? G.cr.reports.sd1.score : '—') + '</b> · SCH-02 <b>' + (G.cr.reports.sd2 ? G.cr.reports.sd2.score : '—') + '</b> (game)</p>' : '') +
    '<p>The vendor’s breach: ' + (c.boss && c.boss.ok ? 'handled at the first try from your seat' : 'handled, with false starts the debriefs named') + '. ' + (t === 'manager' ? 'Coordinated: Dr Vale decided, Kole and Priya decide what families hear, the insurer was told early, the firm had the evidence, nobody promised what nobody knew.' : 'What could have left: six roster fields for 4,410 students, former students included; the rest written as unknown, held by the vendor, requested on Day 8.') + '</p>' +
    '<p>Lesson (game): Lumenlark’s notice waited in a general inbox from Friday 16:40 to Monday 07:50, with the token live; its only unexplained read came on Sunday at 23:58. Vendors’ notices now go to a monitored address and the on-call number, and “rotate credentials” is acted on the same day.</p>' +
    (t === 'manager' && f.lbBookmark ? '<p>Bookmark Badge: the tabletop’s three actions arrived with their owners agreed.</p>' : '') +
    '<p>Open risk (game): Inkstone issued every integration token with its default “read: all” scope. Ferrylane’s and Chimewell’s still have it. Their owners, Transportation and Communications, with Owen Marsh, have not yet accepted or fixed that risk. And Ferrylane holds student names and bus stops under a 2022 contract with no data agreement: Transportation, with Priya, to put one in place.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, the 03:00 pattern' + (qtFound('lb-rdp') ? ', a remote-desktop sign-in on the Library’s server' : '') + (qtFound('sd-probe') ? ', and now pings from FD-STAFF-11’s address to eleven of the district’s addresses' : '') + '. It continues.</p>') +
    '<p class="big">Next: Community Clinic. Its door is on the west side of the square.</p>';
  while (true) {
    const i = await UI.openModal('End of the School District', body, [{label: 'Keep exploring the district', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
