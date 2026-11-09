/* ============================================================
   UPTIME · editions/crossroads/library-story.js
   Crossroads district 1: the Public Library, both tracks. Objectives,
   arrival, the manager track (tabletop, retainer drill, AAR, after-hours
   cover, three records drills), the DFIR track (scoping letter, evidence
   intake with a custody log, one store per client, three evidence drills, two
   reports), the shared directive, the Library Board (Bookmark Badge), the dojos,
   the boss from each seat, the nights between days (where the rota's fatigue
   shows), the Quiet Thread clue and the end-of-district summary.
   Timeline: scratchpad crossroads-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

function inLib() { return LB_MAPS.includes(G.map); }
const lbMgr = () => G.trackId === 'manager', lbDfir = () => G.trackId === 'dfir';
function lbTired(n) { return !!(G.cr.rota && G.cr.rota.stats.tired.includes(n)); }
function lbLead(n) { const a = G.cr.rota ? G.cr.rota.assign[n - 1] : null; return a ? rotaName(CR_ROTA, a) : null; }
function lbImg() { return G.cr.nightOneUncovered ? '08:20 Day 2' : '21:30 Night 1'; }
function lbDone() { return G.cr.nightOneUncovered ? '203.0.113.88 blocked 08:05 · out of service 08:10' : '203.0.113.88 blocked 18:50 · out of service 19:05'; }
// Night 1 uncovered: the day lead handled the alert in the morning, so the note is the day lead's (review S2).
function lbNoteBy() { return G.cr.nightOneUncovered ? 'With Night 1 uncovered, the day lead' : 'Night 1’s on-call lead'; }
function lbFill(o) {
  return JSON.parse(JSON.stringify(o).replace(/\{IMG\}/g, lbImg()).replace(/\{DONE\}/g, lbDone()).replace(/\{NOTEBY\}/g, lbNoteBy())
    .replace(/\{NOTE\}/g, G.cr.nightOneUncovered ? 'Day lead’s note' : 'On-call note').replace(/\{THELEAD\}/g, G.cr.nightOneUncovered ? 'the day lead' : 'the on-call lead'));
}
// Night 4 uncovered: the email waits for the Director at 07:00, so the boss's first hour runs an hour later (game).
function lbN4Open() { return !!(G.cr.night4 && !G.cr.night4.lead); }
function lbAt(t) { if (!lbN4Open()) return t; const m = +t.slice(0, 2) * 60 + +t.slice(3) + 60; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

/* ---------- Map tiles that change as the arrival problems are fixed ---------- */
function lbTile(d, ch) {
  if (ch === 'ø' && G.f.lbFixPcs) d.pal = 'lbPubOk';        // restore at logoff and overnight: a tick
  if (ch === 'n' && G.f.lbFixWifi) d.pal = 'closetOk';      // LIB-GUEST on its own network
  if (ch === 'Ç' && G.f.lbFixVendor) d.pal = 'lbCircOk';    // the vendor's escalation line on the contact page
  return d;
}

/* ---------- Objective ---------- */
function lbObjective() {
  if (!G.trackId) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'library', x: x, y: y, district: 'library'});
  if (!f.lbMet) return Object.assign(at('Across the square: the Public Library.', 15, 2), {step: true});
  if (lbMgr()) {
    if (!f.lbTabletop) return at('Tabletop with Director Strand, from the Library’s risk register: the study-room table.', 13, 12);
    if (!f.lbRetainer) return at('Retainer drill: who calls the firm, and what it needs on arrival. The study-room table.', 13, 12);
    if (!f.lbAar) return at('After-action review: owners and dates. The study-room table.', 13, 12);
    if (!f.lbNight2) return at('End the day at the workroom desk.', 25, 13);
    if (!f.lbDrillA) return at('Review the keylogger note on PUB-PC-04: Juno, by the public PCs.', 10, 8);
    if (!f.lbCover) return at('After-hours cover for the Library: Director Strand, in her office.', 3, 13);
    if (!f.lbDirective) return at('The Board’s chair is with the Director about the overnight restore.', 6, 13);
    if (!f.lbNight3) return at('End the day at the workroom desk.', 25, 13);
    if (!f.lbDrillB) return at('A paste site claims the patron database: Dot, at the circulation desk.', 13, 4);
    if (!f.lbDrillC) return at('Ruth’s AAR on the keylogger is in: the study room.', 18, 14);
  } else {
    if (!f.lbLetter) return at('Read the scoping letter with Noor: the study room.', 11, 13);
    if (!f.lbIntake) return at('Evidence intake: the evidence locker in the study room.', 16, 13);
    if (!f.lbStores) return at('Theo has a question about case folders: the study room.', 12, 14);
    if (!f.lbNight2) return at('End the day at the workroom desk.', 25, 13);
    if (!f.lbDrillA) return at('Question 1: leftover or staff-side? Your bench, the study-room table.', 13, 12);
    if (!f.lbReport) return at('Write the keylogger findings for Noor: the study-room table.', 13, 12);
    if (!f.lbNight3) return at('End the day at the workroom desk.', 25, 13);
    if (!f.lbDrillB) return at('A paste site claims the patron database: Dot, at the circulation desk.', 13, 4);
    if (!f.lbDirective) return at('The Board’s chair is with the Director about the overnight restore.', 6, 13);
    if (!f.lbDrillC) return at('Theo’s two timelines disagree: the study room.', 12, 14);
  }
  if (!f.lbDojoDone) {
    if (!f.lbDojoMet) return at('(Optional) Kemal’s ' + (lbMgr() ? 'Incident Management' : 'Forensics Reporting') + ' dojo, in the makerspace.', 21, 4);
    const i = G.cr.dojo.findIndex(x => !x);
    return at('(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', [23, 25, 27][i], 3);
  }
  if (!f.lbBoard) return at('Take the Library Board challenge: Cyrus Hallowell, through the east door.', 8, 3, 'lboard');
  if (!f.lbNight4) return at('End the day at the workroom desk.', 25, 13);
  if (!f.lbBoss) return lbMgr() ? at('05:52: an extortion email. Director Strand, in her office.', 3, 13) : at('05:52: an extortion email. Lucia, in the study room.', 17, 12);
  if (lbMgr() && !f.lbStatus) return at('The firm’s status report: Lucia, in the study room.', 17, 12);
  if (!f.lbSummary) return at('Director Strand wants to close the week: her office.', 3, 13);
  return {text: 'Public Library done. Next: School District.', done: true, district: 'library'};
}

/* ---------- Triggers, interactions, talk ---------- */
function lbTriggers() {
  if (G.map === 'library' && G.trackId && !G.f.lbMet) { run(lbArrive); return true; }
  return false;
}
function lbInteract(ch, tx, ty) {
  if (!inLib()) return false;
  const f = G.f;
  if (ch === '§') { run(lbStudyTable); return true; }
  if (ch === '£') { run(async () => { if (lbDfir() && f.lbLetter && !f.lbIntake) await lbIntake(); else await say(lbDfir() ? 'The Library’s evidence store: a locked case, a seal log, and nothing of Oxlow’s in it.' : 'The exercise kit: CISA’s tabletop templates, printed, and a box of index cards.'); }); return true; }
  if (ch === 'Y') { run(lbDesk); return true; }
  if (ch === 'ø') { run(async () => { const id = LB_PCS[tx + ',' + ty]; await say(id + (f.lbFixPcs ? ': restores to a clean image when a patron logs off, and again overnight.' : id === 'PUB-PC-04' ? ': out of service, powered off and sealed. A label: “Evidence: do not use.”' : ': a patron’s files from this morning are still on the desktop.')); }); return true; }
  if (ch === 'n') { run(async () => { await say(f.lbFixWifi ? 'The patron Wi-Fi closet: LIB-GUEST now has its own network, internet only.' : 'The patron Wi-Fi closet: one switch, one flat network: LIB-GUEST, the circulation PCs and CIRC-01 together.'); }); return true; }
  if (ch === 'Ç') { run(async () => { await say(f.lbFixVendor ? 'The circulation desk. Taped to the Shelfwright terminal: the vendor’s escalation line and its support addresses.' : 'The circulation desk: three Shelfwright terminals, and a binder labelled “Shelfwright contract (2019)”.'); }); return true; }
  if (ch === '¤') { run(() => lbDojoPuzzle([23, 25, 27].indexOf(tx))); return true; }
  if (ch === 'æ') { run(async () => { await say('The makerspace: two 3D printers, a laser cutter under a cover, a sign-up sheet for Saturday.'); }); return true; }
  if (ch === 'þ') { run(async () => { await say('Shelves of local history, a reading chair, and a sign: “Ask us about your privacy.”'); }); return true; }
  if (ch === '±') { run(async () => { await say('The Board’s minutes, by year. This year’s binder has a tab marked “Compact”.'); }); return true; }
  return false;
}
async function lbTalk(npc) {
  if (!LB_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.lbMet && npc.map === 'library') { await say('Welcome. Director Strand is expecting you.', who); return true; }
  switch (npc.id) {
    case 'strand':
      if (lbMgr() && f.lbDrillA && !f.lbCover) { await lbCover(); break; }
      if (f.lbNight4 && !f.lbBoss && lbMgr()) { await lbBoss(); break; }
      if (f.lbBoss && (lbDfir() || f.lbStatus) && !f.lbSummary) { await lbSummary(); break; }
      if (f.lbSummary) { await lbSummary(); break; }
      await say(lbMgr() ? 'One thing at a time, and I decide what the Library does. That suits me.' : 'Noor says you tell her, and she tells me. I can live with that.', who); break;
    case 'dot':
      if (f.lbNight3 && !f.lbDrillB) { await lbDrillB(); break; }
      await say(f.lbDrillB ? 'Two more calls about that post. I told them what you told me: our records don’t match it.' : 'Dot Ferreira, circulation. If Shelfwright stops, I lend on paper slips and type them in later.', who); break;
    case 'juno':
      if (lbMgr() && f.lbNight2 && !f.lbDrillA) { await lbDrillA(); break; }
      await say(f.lbFixPcs ? 'Restore at logoff and overnight, and LIB-GUEST on its own network. The PCs come back clean every time now.' : 'Juno Barros, the Compact’s technician here. PUB-PC-04 has been powered off and sealed since I imaged it. Nobody has touched it.', who); break;
    case 'kemal': await lbDojoIntro(); break;
    case 'agnes': await say(f.lbFixPcs ? 'The PCs wipe themselves when I log off now. I keep my CV on my own stick. Sensible.' : 'Somebody’s holiday photos were on PC-2 when I sat down this morning. Not mine.', who); break;
    case 'cyrusb': await lbBoardScript(); break;
    case 'cyrusd': await lbDirective(); break;
    case 'noorlb': await lbLetterTask(); break;
    case 'lucia':
      if (lbDfir() && f.lbNight4 && !f.lbBoss) { await lbBoss(); break; }
      if (lbMgr() && f.lbBoss && !f.lbStatus) { await lbStatusReport(); break; }
      await say(lbDfir() ? 'Write what the evidence shows, and say what it can’t. That’s the whole job.' : 'Our report goes to Noor; you get the status, the same day.', who); break;
    case 'theo':
      if (f.lbIntake && !f.lbStores) { await lbStores(); break; }
      if (f.lbNight3 && f.lbDrillB && f.lbDirective && !f.lbDrillC) { await lbDrill('clocks'); f.lbDrillC = true; touchCSF('Respond'); await say('One clock, written at the top. I won’t forget that.', who); break; }
      await say('Theo Marchetti. Junior. I check everything twice now.', who); break;
    case 'ruthlb':
      if (!f.lbDrillC) { await say('My AAR on PUB-PC-04 is in. Read it like you’d read anyone’s.', who); await lbDrill('aar'); f.lbDrillC = true; touchCSF('Govern'); await say(G.cr.drills.aar && G.cr.drills.aar.verdictOk ? 'The patron set it off; the PCs let it stay. I’ll rewrite it blameless, with owners.' : 'It’s the build, then: no restore since 2023. I’ll rewrite it blameless, with owners.', who); }
      break;
  }
  return true;
}

/* ---------- Arrival ---------- */
async function lbArrive() {
  const f = G.f;
  f.lbMet = true; touchCSF('Identify');
  await say('Day ' + G.day + '. The Public Library: shelves to the west, eight public PCs, the circulation desk, a makerspace in the north-east corner, and three rooms along the south wall.');
  await say('Mina Strand, Director. Three things, plainly. The public PCs don’t reset between patrons: the software’s licence lapsed in 2023 and nobody renewed it. The patron Wi-Fi is on the same network as the circulation system. And if Shelfwright breaks, nobody here knows whom to call: the person who did left.', 'Director Mina Strand');
  await say('Our patrons’ records are the thing we protect. We keep no borrowing history: a book comes back and the link to the patron is gone. Whatever you do here, do it like that.', 'Director Mina Strand');
  unlock('fact', 'crala');
  if (lbMgr()) {
    await say('08:30, with Noor and Director Strand: the keylogger against the plan’s retainer criteria. It has been contained, and nothing so far shows it reached Shelfwright or the patron records it holds, so the firm is not called; if that changes, it is. Juno’s image is sealed and held for Noor; Juno is sending her and the Director the list of PUB-PC-04’s bookings since 15:00 yesterday, and Noor will decide about telling those patrons. (game)');
    await say('The keylogger note gets its review tomorrow. First, the tabletop: Director Strand has an hour at the study-room table.');
  } else {
    await say('Lucia is in the study room with Noor. The scoping letter first: nothing gets collected before it. (game)');
  }
}

/* ---------- The study-room table (manager: exercises; DFIR: the bench) ---------- */
async function lbStudyTable() {
  const f = G.f;
  if (lbMgr()) {
    if (!f.lbTabletop) return lbTabletop();
    if (!f.lbRetainer) return lbRetainer();
    if (!f.lbAar) return lbAarTask();
    return say('The study-room table: index cards in three piles: done, owned, still open.');
  }
  if (!f.lbLetter) return say('The bench. Noor has the letter; read it with her first.');
  if (f.lbNight2 && !f.lbDrillA) { await lbDrill('pcdfir'); f.lbDrillA = true; touchCSF('Detect'); await say(G.cr.drills.pcdfir.supported ? 'Question 1, answered from the image and the booking export.' : 'Question 1 has an answer, but write it only from what you’ve read.', 'Lucia Ferrand'); return; }
  if (f.lbDrillA && !f.lbReport) return lbReportPc();
  return say('Your bench: working copies only. The originals are sealed in the store.');
}

/* ---------- Manager F1: the tabletop ---------- */
async function lbTabletop() {
  const c = G.cr, who = 'Director Mina Strand';
  await say('An hour, and I want it to be about us, not about the news. Pick the scenario from our own register.', who);
  const reg = '<table class="sc"><tr><th>Risk</th><th>Likelihood</th><th>Impact</th></tr>' + LB_RISKS.map(r => '<tr><td>' + esc(r.text) + '</td><td>' + r.lik + '</td><td>' + r.imp + '</td></tr>').join('') + '</table><p class="small">The Library’s risk register, 1 to 5 (game). CISA’s tabletop packages give the templates: objectives, scenario, discussion questions, an after-action report.</p>';
  while (true) {
    const items = LB_SCENARIO.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Tabletop · the scenario', reg, items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(i === 1 ? 'Likely, and already understood: an exercise teaches most where the plan is weakest. The register’s highest impact is also its biggest unknown.' : i === 2 ? 'A scenario from the news tests nobody’s real plan. Use the register: these are the Library’s risks.' : 'A template is a start, not the scenario. Tailor it to the register, or it tests somebody else’s library.');
  }
  for (const inj of LB_INJECTS) {
    const items = inj.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Tabletop · inject', '<p><b>' + esc(inj.t) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(inj.opts[i].why);
    }
  }
  c.ex.run += 1; c.ex.actions += LB_EX_ACTIONS; track();
  G.f.lbTabletop = true; unlock('act', 'crtabletop'); unlock('act', 'lbtabletop'); unlock('fact', 'crctep'); touchCSF('Govern'); touchCSF('Respond');
  await say('Three gaps, written down: the PCs, the network, and the vendor’s number nobody has. That’s three actions, and I want owners. (game)', who);
  await say('Before the AAR: if this were real, how fast could the firm be here? A retainer drill, now.', who);
}

/* ---------- Manager F2: the retainer drill ---------- */
async function lbRetainer() {
  const c = G.cr;
  await say('Retainer drill (game). It’s 11:00 on the exercise clock: the Library’s Shelfwright scenario has become real enough to call the firm. Who calls, and what goes in the arrival pack?');
  let mins = LB_ACT_OK;
  while (true) {
    const items = LB_CALLER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Retainer · who makes the call', '<p>The Compact holds the retainer with Tallowmere Forensics (game). The plan says the retainer is called when Shelfwright or the patron records it holds may have been reached, or when the on-call lead can’t contain an incident.</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    mins += LB_ACT_LATE;
    await say(LB_CALLER[i].why + ' (+' + LB_ACT_LATE + ' game minutes)');
  }
  const items = LB_PACK.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'Send the pack', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> things the firm needs on arrival.</p>' + shownOrder(LB_PACK, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('Retainer · the arrival pack', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !LB_PACK[i].good);
  mins += wrong.length * LB_ACT_CARD;
  for (const i of wrong) await say(LB_PACK[i].name + ': ' + (LB_PACK[i].id === 'diagrams' ? 'scope by worry. The firm works to the written scope.' : LB_PACK[i].id === 'press' ? 'words before facts. Noor and the Director decide what is said, when it is known.' : 'one shared login for a whole team means nobody can tell who did what. Named accounts, switched off afterwards.') + ' (+' + LB_ACT_CARD + ' game minutes)');
  c.activate = mins; track();
  G.f.lbRetainer = true; unlock('act', 'crretainer'); touchCSF('Respond');
  const ack = 11 * 60 + 4 + mins;
  await say('11:04 retainer line called · ' + String(Math.floor(ack / 60)).padStart(2, '0') + ':' + String(ack % 60).padStart(2, '0') + ' the firm acknowledges · pack complete: time to activate outside help ' + mins + ' game minutes. (game)');
  await say('Now the after-action review. Three actions, three owners, three dates.', 'Director Mina Strand');
}

/* ---------- Manager F3: the AAR (owners and dates) ---------- */
async function lbAarTask() {
  const c = G.cr;
  let onTime = 0;
  for (const a of LB_AAR) {
    let first = true;
    const owners = a.owners.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · owner', '<div class="card"><b>' + esc(a.issue) + '</b><br>Corrective action: ' + esc(a.action) + '</div><p>Primary responsible organisation: who owns it?</p>', owners, {shuffle: true, closable: false, cls: 'drill'});
      if (owners[i].meta.good) break;
      first = false;
      await say(a.id === 'split' ? 'The Compact runs the Library’s network and nothing has to be bought, so the Compact’s network team owns the fix; the Director is told it’s done.' : a.id === 'restore' ? 'The restore needs the licence renewed: the Director’s budget and contract, and the PCs are her service, so she owns it. Juno does the work.' : 'The Shelfwright contract is the Director’s, so getting the escalation line under it is hers. Others help.');
    }
    const dates = a.dates.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · completion date', '<div class="card"><b>' + esc(a.action) + '</b></div><p>Completion date?</p>', dates, {shuffle: true, closable: false, cls: 'drill'});
      if (dates[i].meta.good) break;
      first = false;
      await say(a.dates[i].why || '“' + a.dates[i].label + '” is not a date, and an action without one slips. One day, in the plan.');
    }
    if (first) onTime++;
  }
  c.aar = {total: LB_AAR.length, onTime: onTime}; track();
  G.f.lbAar = true; unlock('act', 'craar'); touchCSF('Govern');
  G.f.lbFixVendor = true; unlock('act', 'crvendor');
  await say('17:00: Director Strand has Shelfwright Systems’ escalation line and its support addresses (198.51.100.40 to .49), under the contract. They go on the plan’s contact page. (game)');
  await say('Juno does the restore and the network split tonight, as written. Go home; your rota has tonight.', 'Director Mina Strand');
}

/* ---------- The desk: end the day, and the night between ---------- */
async function lbDesk() {
  const f = G.f, mgr = lbMgr();
  const ready = mgr ? ((f.lbAar && !f.lbNight2) || (f.lbDirective && !f.lbNight3) || (f.lbBoard && !f.lbNight4))
                    : ((f.lbStores && !f.lbNight2) || (f.lbReport && !f.lbNight3) || (f.lbBoard && !f.lbNight4));
  if (!ready) { await say('A hot desk in the staff workroom. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.lbNight2) await lbNight(2);
  else if (!f.lbNight3) await lbNight(3);
  else await lbNight(4);
}
async function lbNight(n) {
  const c = G.cr, lead = lbLead(n), tired = lbTired(n);
  let body = '<p>Night ' + n + '. On call: <b>' + esc(lead || 'nobody') + '</b>' + (tired ? ' (night ' + rotaRunAt(c.rota.assign, n - 1) + ' in a row)' : '') + '.</p>';
  if (n === 2) body += '<p>A quiet night. (game)</p>';
  if (n === 3) body += '<p>23:20: LIB-GUEST drops for ten minutes; ' + (lead ? lead.split(' ')[0] + ' takes the call' + (tired ? ', slowly: a thin first look, and at 00:40 a call to you' : '') + '.' : 'nobody is on call, and patrons in the reading room lose Wi-Fi until somebody notices in the morning.') + ' (game)</p>';
  if (n === 4) body += '<p>05:52: an email reaches the Director and the Library’s public inbox. ' + (lead ? lead.split(' ')[0] + ' takes the first call' + (tired ? ', on a third night or more in a row: a thin first look, with fewer facts in it' : ': a clear first look') + '.' : 'Nobody is on call: it waits for the Director to read it at 07:00.') + ' (game)</p>';
  await UI.openModal('Night ' + n, body, [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = n + 1; G.focus = G.focusMax;
  if (tired && lbMgr() && n >= 3) { G.focus = Math.max(10, G.focus - 10); await say('You were up at 00:40 with a tired on-call lead. Focus ' + G.focus + '/' + G.focusMax + ' this morning. (game)'); }
  G.f['lbNight' + n] = true;
  if (n === 2 && c.growth === 'unread') await say('Noor sent the insurer’s timeline back overnight with two corrections, the kind a read-through would have caught. (game)', 'Noor Castellanos');
  if (n === 2 && lbMgr()) {
    G.f.lbFixPcs = true; G.f.lbFixWifi = true; c.ex.closed += LB_EX_ACTIONS; unlock('act', 'crrestore'); unlock('act', 'crsplit'); touchCSF('Protect');
    await say('Day 3, 09:00. Juno set it up last night: the public PCs restore at logoff and overnight (the overnight run is set for 07:30), and LIB-GUEST is on its own network. Juno has the keylogger note on PUB-PC-04 for your review.');
  }
  if (n === 3) await say('Day 4, 07:40. Dot is waving from the circulation desk: “A website says it has all our patrons.”');
  if (n === 4) { c.night4 = {lead: lead, tired: tired}; await say(lbMgr() ? 'Day 5, ' + (lead ? '06:15' : '07:05') + '. Director Strand is in her office with the email open.' : 'Day 5, ' + lbAt('06:20') + '. Noor has engaged the firm again. Lucia is in the study room.'); }
  track();
}

/* ---------- Drills ---------- */
async function lbDrill(key) {
  const c = G.cr;
  const r = await doDrill(lbFill(LB_DRILLS[key]));
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (lbDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function lbDrillA() {
  await say('The keylogger note on PUB-PC-04. Read it the way you’d read anyone’s close: what does it rest on?', 'Juno Barros');
  const r = await lbDrill('pcmgr');
  G.f.lbDrillA = true; touchCSF('Detect');
  await say(r.verdictOk ? 'A patron’s session left it there. I’ll keep the image and the hash, then restore it. Noor has the three bookings after it.' : 'The records say a patron’s session, B-2231. Image kept, hash kept; Noor has the three bookings after it.', 'Juno Barros');
  await say('Director Strand wants to talk about nights: who covers the Library after hours.');
}
async function lbDrillB() {
  await say('“Town library patron DB, 2.4 million rows, Shelfwright.” Two patrons have called already. Is it us?', 'Dot Ferreira');
  const r = await lbDrill(lbMgr() ? 'pastemgr' : 'pastedfir');
  G.f.lbDrillB = true; touchCSF('Respond');
  if (lbDfir()) { G.cr.custody.items++; G.cr.custody.complete++; }
  await say(r.verdictOk ? 'Not ours, then, and I can say why. Thank you.' : 'Our cards don’t look like that, and we don’t keep birthdays. Not ours. I’ll say only that.', 'Dot Ferreira');
  if (lbDfir()) { G.f.lbDirectiveDue = true; await say('Cyrus Hallowell, the Board’s chair, has come in about this morning’s restore. He is in the Director’s office.', 'Dot Ferreira'); }
  else await say('Ruth’s AAR on the keylogger is in the study room.');
}

/* ---------- Manager F4: after-hours cover ---------- */
async function lbCover() {
  const c = G.cr, who = 'Director Mina Strand';
  await say('PUB-PC-04 fired at 18:41, after our staff had gone home for the evening. Who watches the Library at night, without wearing out the people who watch the town?', who);
  const fc = (o) => '<li>' + esc(o.label.split(':')[0].split(',')[0]) + ': overtime forecast ' + o.overtime + ' h of ' + LB_BUDGET + ', gaps ' + o.gaps + ' h a week (game)</li>';
  let pick;
  while (true) {
    const items = LB_COVER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('After-hours cover', '<p>The rota as it stands, plus the Library’s nights. The forecasts come from this week’s calls (game).</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    pick = LB_COVER[i];
    if (pick.good) break;
    await say(pick.why);
  }
  c.cover = {k: pick.k, gaps: pick.gaps, overtime: pick.overtime, variance: Math.round((pick.overtime - LB_BUDGET) / LB_BUDGET * 100)}; track();
  G.f.lbCover = true; unlock('act', 'crcover'); touchCSF('Govern');
  await say('Agreed and signed: at night, a page only for anything touching CIRC-01, patron data, or a host that spreads; the rest waits for 08:00. Retainer hours for anything bigger. Overtime forecast ' + pick.overtime + ' of ' + LB_BUDGET + ' hours. (game)', who);
  await UI.openModal('Cover · the forecast', '<ul>' + LB_COVER.map(fc).join('') + '</ul>', [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.lbDirectiveDue = true;
  await say('Cyrus Hallowell, our Board’s chair, has just arrived. He wants a word about the overnight restore.', who);
}

/* ---------- The directive (both tracks) ---------- */
async function lbDirective() {
  const who = 'Cyrus Hallowell', t = G.trackId;
  if (G.f.lbDirective) { await say('Done by 02:40, and the staff come in at nine to clean PCs. I should have asked that first.', who); return; }
  await say('I’ve had Board members on the phone all morning (game). The overnight restore ran from 07:30 to 08:40 today, and staff couldn’t set the PCs up for nine. The Board wants it dropped, and I’m to take your answer back to them.', who);
  if (t === 'dfir') await say('Director Strand tells us your recommendation was the restore. Should we drop it?', who);
  const L = LB_DIRECTIVE[t];
  while (true) {
    const items = L.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose(t === 'dfir' ? 'What do you tell the Board’s chair?' : 'How do you answer the Board?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(L[i].why);
  }
  await say(t === 'dfir' ? 'The facts from the case: kbhelper.exe ran through three patron sessions because nothing restored the PC. Options: move the overnight run to 01:30, so it’s done by 02:40; keep only the logoff restore; or drop it, with the Director’s signature on the risk. Noor agreed I could say that much.' :
    'What it does: clears whatever one patron leaves for the next, which is how the keylogger lasted three sessions. What it costs: an hour a night. Options: move it to 01:30, done by 02:40; logoff restore only; or drop it, with Director Strand’s signature on the risk.');
  await say('Move it to 01:30 and keep the logoff restore; review in three months. I’ll take that to the Board as my decision on the service. (game)', 'Director Mina Strand');
  await say('Fine. I’ll tell the Board. Nobody asked us what time it ran. (game)', who);
  G.f.lbDirective = true; unlock('act', 'crrestore'); touchCSF('Govern');
  await say(lbMgr() ? '(Present the trade-off; the owner decides.) End the day when you’re ready.' : '(Give the facts; the owner decides.) Theo is waiting in the study room.');
}

/* ---------- DFIR F1: the scoping letter ---------- */
async function lbLetterTask() {
  const who = 'Noor Castellanos', f = G.f;
  if (f.lbLetter) { await say('Facts to me first. Privilege, notification, what the Board sees: those are mine to decide, not yours.', who); return; }
  const row = (k, v) => '<tr><th style="vertical-align:top;white-space:nowrap">' + k + '</th><td>' + v + '</td></tr>';
  const letter = '<p><b>Scoping letter · Tallowmere Forensics · case LIB-01 (game)</b></p><table class="sc letter">' +
    row('Engaged by', 'Noor Castellanos, town attorney, for the Public Library') +
    row('Questions', '1. What is the program on PUB-PC-04, and how did it get there?<br>2. Did it reach any staff system or Shelfwright?<br>3. Whose sessions could it have recorded?') +
    row('In scope', 'public PCs, LIB-GUEST, circulation PCs, CIRC-01') +
    row('Out of scope', 'other Compact members; Shelfwright Systems’ own systems') +
    row('Report to', 'Noor Castellanos; she decides distribution') +
    row('Counsel', 'privilege, notification and disclosure are counsel’s; the firm reports facts. Anything outside the questions goes to counsel first.') + '</table>';
  await say('I engaged the firm for the Library this morning. Read it before you touch anything. I don’t give you legal conclusions, and I don’t want them from you.', who);
  while (true) {
    const items = LB_LETTER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The scoping letter', letter + '<p><b>Your first step?</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(LB_LETTER[i].why);
  }
  f.lbLetter = true; unlock('act', 'crscope'); unlock('fact', 'crnicedfir'); touchCSF('Govern');
  G.cr.custody = {items: 0, complete: 0, gaps: 0}; track();
  await say('Good. The custody log is open, and Juno is bringing what the town collected. The evidence locker, when you’re ready.', 'Lucia Ferrand');
}

/* ---------- DFIR F2: evidence intake ---------- */
async function lbIntake() {
  const c = G.cr, cu = c.custody;
  const items = [c.growth === 'paz' ? LB_INTAKE.e01ok : LB_INTAKE.e01gap, LB_INTAKE.e02, LB_INTAKE.e03, LB_INTAKE.e04].map(lbFill);
  await say('Four items from the town’s team, each with a collection form. Log each one: who handed it over, when, the hash on receipt against the hash on the form, where the original is sealed. Work on copies.', 'Lucia Ferrand');
  unlock('fact', 'cr80086'); unlock('fact', 'crfips');
  for (const it of items) {
    let first = true;
    const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received from Juno Barros, Day 2. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      first = false; cu.gaps++;
      await say(it.opts[i].why);
    }
    const inherent = !!it.opts.find(o => o.good).gap;
    cu.items++; if (inherent) cu.gaps++;
    if (first && !(inherent && it.id === 'E-01')) cu.complete++;
    if (it.id === 'E-03') await say('14:10: Magda’s team sends the export they hashed, 15:00 to 08:00. Both records stay in the log. (game)');
    if (it.id === 'E-04') await lbQtEvidence();
  }
  track();
  G.f.lbIntake = true; unlock('act', 'crcustody'); touchCSF('Respond');
  await say('Custody log: ' + cu.items + ' items, ' + cu.complete + ' with a full record, ' + cu.gaps + ' gap' + (cu.gaps === 1 ? '' : 's') + ' written down as gaps. Theo has a question about folders. (game)', 'Lucia Ferrand');
}
// The Quiet Thread clue, seen in E-04 (DFIR). Noticing is the mechanic: the prompt opens on "Leave it".
async function lbQtEvidence() {
  if (qtFound('lb-rdp')) return;
  const i = await choose('E-04, CIRC-01’s Security log. Question 2 needs the sign-ins from PUB-PC-04: there are none. The log runs on through the night.', [{label: 'Read the rest of the night’s sign-ins too'}, {label: 'Leave it: question 2 is answered'}], {cursor: 1});
  if (i !== 0) return;
  await say('03:12, Day 2: svc-print, the printer’s service account, signs in to CIRC-01 over remote desktop (logon type 10) from FD-STAFF-11’s address. 03:16: signed out. CIRC-01 audits sign-ins, not process starts: what it did in four minutes is unknown.');
  await say('Not one of the letter’s three questions. It goes to Noor first; with her agreement, to Lucia and Rae’s suspicion-file team. Nothing changes on svc-print without a plan.');
  await crQtAfterNote(qtNote('lb-rdp'));
}

/* ---------- DFIR F3: one store per client ---------- */
async function lbStores() {
  const who = 'Theo Marchetti';
  await say('Oxlow Township’s keylogger looks like the same family as ours. Can I put E-01 in Oxlow’s case folder? It would be quicker to compare them side by side. (game)', who);
  while (true) {
    const items = LB_STORES.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('Two clients, one family', '<p>Tallowmere has two clients this week: the Public Library (LIB-01) and Oxlow Township (game). Each has its own sealed evidence store.</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(LB_STORES[i].why);
  }
  G.f.lbStores = true; unlock('act', 'crstores'); touchCSF('Govern'); track();
  await say('Separate stores. I’ll ask Lucia about the hash. (She asks both clients’ counsel; Noor agrees the hash alone may go to Oxlow’s counsel. game)', who);
  await say('End the day when you’re ready. Question 1 tomorrow, on the bench.', 'Lucia Ferrand');
}

/* ---------- DFIR: the keylogger report ---------- */
async function lbReportPc() {
  const c = G.cr;
  const r = await doReport(LB_REPORT_PC);
  c.reports.pc = {score: r.score, over: r.over, under: r.under};
  c.corrected += r.over; c.first = 26 + 3 * r.over; track();
  G.f.lbReport = true; touchCSF('Respond');
  G.f.lbFixPcs = true; G.f.lbFixWifi = true; G.f.lbFixVendor = true; unlock('act', 'crrestore'); unlock('act', 'crsplit'); unlock('act', 'crvendor'); touchCSF('Protect');
  await say('To Noor at 12:00. With her agreement, the recommendations went to Director Strand, who accepted them for the Library: restore at logoff and overnight, LIB-GUEST on its own network, and the vendor’s escalation line on the contact page. Juno has them done by 17:00; the overnight run is set for 07:30. (game)', 'Lucia Ferrand');
  await say('End the day when you’re ready. Tomorrow, Theo’s timelines.', 'Lucia Ferrand');
}

/* ---------- Dojo (Kemal; original puzzles) ---------- */
function lbDojo() { return lbMgr() ? LB_DOJO_MGR : LB_DOJO_DFIR; }
async function lbDojoIntro() {
  const who = 'Kemal Osterhout', f = G.f;
  if (!f.lbDrillC) { await say('Kemal Osterhout, makerspace. The practice terminals are free once your week’s cases are done.', who); return; }
  if (!f.lbDojoMet) { f.lbDojoMet = true; await say(lbMgr() ? 'Incident Management: three terminals. Updates, owners, and when to call for help. No tools; just decisions.' : 'Forensics Reporting: three terminals. What you can write, what you can’t, and for whom.', who); return; }
  if (f.lbDojoDone) { await say(lbMgr() ? 'Say what you know, give every action one owner, call for help by the plan.' : 'Write what is shown. Absence of a log is not absence of an event. Write for the reader.', who); return; }
  await say('Puzzles solved: ' + G.cr.dojo.filter(Boolean).length + ' of 3. The terminals are behind me.', who);
}
async function lbDojoPuzzle(i) {
  const f = G.f, c = G.cr;
  if (i < 0) return;
  if (!f.lbDojoMet) { await say('A practice terminal. Talk to Kemal first.'); return; }
  const p = lbDojo()[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who has to act on it would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF(lbMgr() ? 'Respond' : 'Detect');
  if (!c.dojo.every(Boolean) || f.lbDojoDone) return;
  f.lbDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2);
  await say('All three. Focus ' + G.focusMax + ' (game).', 'Kemal Osterhout');
}

/* ---------- The Library Board ---------- */
async function lbBoardScript() {
  const who = 'Cyrus Hallowell', f = G.f, c = G.cr;
  if (f.lbBoard) { await say('The Bookmark Badge says the Library trusts how you work. Keep earning it.', who); return; }
  if (!f.lbDrillC) { await say('The Board sits once your week’s cases are done.', who); return; }
  await say('The Library Board. Three questions, the way the Board really asks them. We grade the answer we can act on.', who);
  const specs = lbMgr() ? LB_BOARD_SPECS_MGR() : LB_BOARD_SPECS_DFIR();
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
  f.lbBoard = true; f.lbBookmark = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the Library Board. This is the Bookmark Badge (game).', who);
  await say(lbMgr() ? 'Its power: every action you assign in an AAR from now on arrives with the owner the Board approved, and you carry a little more: Focus +4.' : 'Its power: evidence the Compact hands you arrives with its collection hash recorded, so no gap from a missing hash, and you carry a little more: Focus +4.', who);
  touchCSF('Govern');
  await say('End the day when you’re ready.');
}

/* ---------- The boss (game-original): the patron-records extortion claim ---------- */
async function lbStages(S, keys) {
  const c = G.cr;
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
    c.boss.first.push(first);
  }
}
async function lbBoss() {
  const c = G.cr, n4 = c.night4 || {lead: lbLead(4), tired: lbTired(4)};
  c.boss = {day: G.day, first: [], look: n4.tired ? 'thin' : n4.lead ? 'clear' : 'none'};
  if (lbMgr()) {
    await say('05:52. “We have all 26,500 of your patrons: names, addresses, reading history. Pay by Monday or we publish.” Twenty rows attached. Tell me what we do, and in what order.', 'Director Mina Strand');
    await say((c.boss.look === 'none' ? 'No first look: Night 4 had nobody on call, so the email waited for the Director at 07:00.' : c.boss.look === 'thin' ? 'The night’s on-call lead, on a third night running, sent a thin first look: the account and the address come later, from the day lead.' : 'The night’s on-call lead sent a clear first look: the account, the address and the export.') + ' Nothing so far ties the night to svc-print; that question stays open. (game)');
    const S = lbMgrBossStages();
    await lbStages(S, ['s1']);
    await say(lbAt('06:40') + ': Noor is on her way. The vendor’s escalation line answers: sw-support is blocked at once, nothing cleared, and its records are kept. Shelfwright was reached, which meets the plan’s criteria: the retainer is called with the arrival pack, and the firm acknowledges at ' + lbAt('06:55') + '. Cyrus is told. (game)');
    await lbStages(S, ['s2']);
    await say('09:00: the Board heard what we know, what we don’t, and 13:00 for the next update. (game)');
    await lbStages(S, ['s3']);
    await say('13:00, on time. The Board and the Director decide: no payment, on Noor’s advice; the FBI has the email, as the plan’s contact page says. Shelfwright gives the Library its own support password, on demand from its documented range, with MFA. Noor has the field list, titles on hold included, and decides who must be told. (game)');
  } else {
    await say('Noor engaged us again at ' + lbAt('06:20') + ': what was taken, and how. Your case. The vendor wants to reset its support account right now.', 'Lucia Ferrand');
    const open = lbN4Open(), handover = open || (n4.tired && !G.f.lbBookmark);
    c.custody.items += 5; c.custody.complete += handover ? 4 : 5; if (handover) c.custody.gaps++;   // E-06 to E-10
    await say(open ? 'With Night 4 uncovered, Director Strand forwarded the email herself at 07:05: no hash recorded when it was saved. You log the gap and hash your copy on receipt. Logged as E-08. (game)' : handover ? 'The town’s on-call lead forwarded the email at 06:05, on a third night or more in a row: no hash recorded when it was saved. You log the gap and hash your copy on receipt. Logged as E-08. (game)' : 'The town’s on-call lead forwarded the email at 06:05 with its hash recorded' + (G.f.lbBookmark ? ' (Bookmark Badge)' : '') + '. Logged as E-08. (game)');
    const S = lbDfirBossStages();
    await lbStages(S, ['s1']);
    await say(lbAt('06:45') + ': the vendor blocks sw-support, clearing nothing. ' + lbAt('07:10') + ': E-06 (Shelfwright’s audit log), E-07 (its query log), E-09 (CIRC-01’s Security log for Night 4) and E-10 (the Library firewall’s log for Night 4) are exported, hashed and sealed; the vendor keeps its own records of sw-support at Noor’s request; then it resets the account. (game)');
    await lbStages(S, ['s2']);
    const r = await doReport(LB_REPORT_BOSS);
    c.reports.boss = {score: r.score, over: r.over, under: r.under};
    c.corrected += r.over;
    await say('14:00: to Noor. The Board and the Director decide on payment, on her advice: no payment, and the FBI has the email. Noor has the field list and decides who must be told. (game)');
  }
  c.boss.ok = c.boss.first.every(Boolean);
  G.f.lbBoss = true; unlock('tech', 'T1078'); unlock('tech', 'T1657'); touchCSF('Respond'); touchCSF('Recover'); track();
  if (lbMgr()) await say('Lucia has the firm’s status report for you in the study room.', 'Director Mina Strand');
  else await say('Director Strand wants to close the week in her office.', 'Lucia Ferrand');
}

/* ---------- Manager: the firm's status report (and the Quiet Thread clue) ---------- */
async function lbStatusReport() {
  const who = 'Lucia Ferrand', c = G.cr;
  const body = '<pre class="art">Tallowmere · status · LIB-02 · Day 5 15:00 (game)\n' +
    'Found       one export by sw-support, 02:41–02:44: 6,212 holds rows\n' +
    '            (name, email, card number, pickup branch, title on hold)\n' +
    'Not found   where the rows went after 02:44; how the password\n' +
    '            was obtained (the vendor’s shared password is likely)\n' +
    'Way in      192.0.2.77, through CIRC-01’s remote-support port,\n' +
    '            open to any address since 2019\n' +
    'Evidence    audit, query, firewall and CIRC-01 Security logs\n' +
    '            and the email: hashed, sealed\n' +
    'Report      to Noor Castellanos\n' +
    'Appendix    one observation relevant to “how”, not yet explained,\n' +
    '            passed to counsel first: it touches the suspicion file</pre>';
  await say('The status, as promised. The report itself goes to Noor; this is yours.', who);
  await UI.openModal('The firm’s status report', body, [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  c.status = {read: true};
  if (!qtFound('lb-rdp')) {
    const i = await choose('The appendix: an observation not yet explained.', [{label: 'Read the appendix'}, {label: 'Leave it: it’s with Noor'}], {cursor: 1});
    if (i === 0) {
      await say('Appendix: reviewing CIRC-01’s Security log back to Day 1, the firm saw svc-print sign in over remote desktop (logon type 10) at 03:12 on Day 2, from FD-STAFF-11’s address, and sign out at 03:16. CIRC-01 audits no process starts. Passed to counsel; with her agreement, to Rae’s suspicion-file team. Not acted on.');
      await say('Nothing changes on svc-print without a plan. You pass it to Rae, through Noor.');
      await crQtAfterNote(qtNote('lb-rdp'));
    }
  }
  G.f.lbStatus = true; touchCSF('Respond'); track();
  await say('Director Strand wants to close the week in her office.', who);
}

/* ---------- Scorecard extra and the end-of-district summary ---------- */
function lbScoreHtml() {
  if (!G.trackId || !G.f.lbMet) return '';
  const c = G.cr;
  if (lbMgr()) return '<p>Library: exercises run <b>' + c.ex.run + '</b> · actions <b>' + c.ex.closed + ' of ' + c.ex.actions + '</b> closed · cover ' + (c.cover ? '<b>' + esc(c.cover.k) + '</b>' : 'not set') + ' (game)</p>';
  return '<p>Library: custody log <b>' + (c.custody ? c.custody.items : 0) + '</b> items · reports filed <b>' + Object.keys(c.reports).length + '</b> · claims corrected <b>' + c.corrected + '</b> (game)</p>';
}
function lbDrillRows() {
  const keys = lbMgr() ? ['pcmgr', 'pastemgr', 'aar'] : ['pcdfir', 'pastedfir', 'clocks'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(LB_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function lbSummary() {
  const f = G.f, c = G.cr, t = G.trackId;
  if (!f.lbSummary) {
    f.lbSummary = true; touchCSF('Govern');
    if (t === 'manager' && f.lbBookmark) c.bossActions = {owned: 3, total: 3};
    Series.markEdition('crossroads', {track: t, library: true});
    await say('The PCs come back clean, LIB-GUEST has its own network, and I know whom to call at Shelfwright. And I know who decides what. Thank you.', 'Director Mina Strand');
  }
  const body = '<p class="big">The Public Library: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Days <b>' + G.day + '</b></p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + lbDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>Reports filed: keylogger <b>' + (c.reports.pc ? c.reports.pc.score : '—') + '</b> · holds export <b>' + (c.reports.boss ? c.reports.boss.score : '—') + '</b> (game)</p>' : '') +
    '<p>The extortion claim: ' + (c.boss && c.boss.ok ? 'handled at the first try from your seat' : 'handled, with false starts the debriefs named') + '. ' + (t === 'manager' ? 'Coordinated: the Director decided, Noor advised, the vendor and the firm were called in order.' : 'What was taken: 6,212 holds rows, five fields; the rest written as likely or unknown.') + '</p>' +
    (t === 'manager' && c.bossActions ? '<p>Bookmark Badge: the extortion’s three new actions arrived with the owners the Board approved.</p>' : '') +
    '<p>Open risk (game): CIRC-01 joined the town’s directory when the Compact took over the Library’s IT this year, so every account with admin rights on the town’s member servers has them on the patron-records server' + (qtFound('sv-nesting') || qtFound('lb-rdp') ? ', svc-print among them' : '') + '. Nobody has accepted that risk yet: it goes to Rae and the council’s risk committee for an owner.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, the 03:00 pattern' + (qtFound('lb-rdp') ? ', and now a remote-desktop sign-in on the Library’s server' : '') + '. It continues.</p>') +
    '<p class="big">Next: School District.</p>';
  while (true) {
    const i = await UI.openModal('End of the Public Library', body, [{label: 'Keep exploring the Library', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
