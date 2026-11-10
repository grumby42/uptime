/* ============================================================
   UPTIME · editions/crossroads/airport-story.js
   Crossroads district 5: the Regional Airport, both tracks: its business and
   office IT only. Objectives, the arrival (an "Airport Operations" email the
   tenants got; a vendor sign-in at 02:40), the manager track (three records
   drills, who owns what, the week-4 rota, the tabletop with the airport
   manager, the boss's retainer test and coordination with a weekend plan, the
   AAR), the DFIR track (the scoping letter, what the firm may take, evidence
   intake, three evidence drills, separate stores per owner, two reports), the
   shared directive (a tenant's permanent connection), the Airport Board
   (Windsock Badge), the dojos, the boss from each seat, the nights, the Quiet
   Thread clue and the end-of-district summary.
   The airport manager on duty decides airport operations; tenants decide about
   their own systems; counsel decides what tenants are told; the Board decides
   any payment. Access control and fuelling are separate systems, not affected
   and not part of this work (game).
   Timeline: scratchpad crossroads-timeline.md (Regional Airport section);
   every line here is checked against it.
   ============================================================ */
'use strict';

function inAirport() { return AP_MAPS.includes(G.map); }
const apMgr = () => G.trackId === 'manager', apDfir = () => G.trackId === 'dfir';
// The district's state lives in G.cr.ap, made on arrival (saves from before this slice have none until then).
function apC() {
  return G.cr.ap || (G.cr.ap = {owners: null, rota: null, tt: null, activate: null, cover: null, aar: null, night27: null, board: null, boss: null, dojo: [false, false, false], requests: null});
}
const AP_DAY = {23: 'Tuesday', 24: 'Wednesday', 25: 'Thursday', 26: 'Friday', 27: 'Saturday', 28: 'Sunday', 29: 'Monday'};
const apHm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
// Week 4 (Nights 23 to 29) carries Nights 21 and 22 from the week-3 rota for the in-a-row rule (no gap between rotas).
function apPre() { const r = G.cr.dp && G.cr.dp.rota, a = r ? r.assign : []; return [a[21 - DP_ROTA.first] || null, a[22 - DP_ROTA.first] || null]; }
function apAutoRota() { return rotaAuto(AP_ROTA, apPre(), SD_ROTA_ORDER); }
function apLead(n) { const r = G.cr.ap && G.cr.ap.rota; const a = r ? r.assign[n - AP_ROTA.first] : null; return a ? rotaName(AP_ROTA, a) : null; }
function apTired(n) { const r = G.cr.ap && G.cr.ap.rota; return !!(r && r.stats.tired.includes(n)); }
function apCustody() { return G.cr.custody || (G.cr.custody = {items: 0, complete: 0, gaps: 0}); }

/* ---------- Map tiles that change as the arrival problems are fixed ---------- */
function apTile(d, ch) {
  if (ch === 'Ǐ' && G.f.apFixVendor) d.pal = 'apBillOk';      // Plinthwise's support on demand
  if (ch === 'Ǎ' && G.f.apFixDesk) d.pal = 'apDeskOk';        // named front-desk logins, the shared one switched off
  if (ch === 'Ǔ' && G.f.apFixTenants) d.pal = 'apPatchOk';    // the tenant connections list, with a keeper and an approver
  return d;
}

/* ---------- Objective ---------- */
function apObjective() {
  if (!G.trackId || !G.f.dpSummary) return null;
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'airport', x: x, y: y, district: 'airport'});
  if (!f.apMet) return Object.assign(at('The Regional Airport: its door is on the south side of the square, beside the Library’s.', 15, 1), {step: true});
  if (apMgr()) {
    if (!f.apDrillA) return at('The email the tenants got: Odette Varga, in the business office.', 24, 2);
    if (!f.apDrillB) return at('The 02:40 vendor sign-in: Dario Fenn, in the IT closet.', 13, 12);
    if (!f.apOwners) return at('Who owns what on the office network: the meeting room table.', 22, 11);
    if (!f.apRota) return at('Next week’s nights: the rota, at the meeting room table.', 22, 11);
    if (!f.apNight23) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apTabletop) return at('Wednesday 09:00: the tabletop with Joanna, at the meeting room table.', 22, 11);
    if (!f.apNight26) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apBoss) return at('Saturday, 07:45: Callum is calling from the lobby.', 17, 2);
    if (!f.apStatus) return at('The firm’s status report: Lucia, in the meeting room.', 24, 10);
    if (!f.apNight27) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apDrillC) return at('Sunday 10:00: Bronwen Teller won’t have her PC imaged. Her shop’s office.', 9, 12);
    if (!f.apNight28) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apAar) return at('Monday 13:00: the after-action review, at the meeting room table.', 22, 11);
  } else {
    if (!f.apLetter) return at('Read the scoping letter with Ansel Whitcombe: the meeting room.', 24, 13);
    if (!f.apTake) return at('What the firm may take: Lucia, in the meeting room.', 24, 10);
    if (!f.apIntake) return at('Evidence intake: the evidence locker in the meeting room.', 25, 12);
    if (!f.apDrillA) return at('Question 1: the email. The bench.', 22, 11);
    if (!f.apDrillB) return at('Question 2: the 02:40 session. The bench.', 22, 11);
    if (!f.apNight23) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apStores) return at('Wednesday: Theo has something from a tenant. The meeting room.', 21, 13);
    if (!f.apDrillC) return at('Question 2 again: when did the vendor last connect? The bench.', 22, 11);
    if (!f.apReport) return at('Write AIR-01 for Ansel Whitcombe: the bench.', 22, 11);
    if (!f.apNight26) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apBoss) return at('Saturday, 08:20: Ansel extends the engagement. Lucia, in the meeting room.', 24, 10);
    if (!f.apNight27) return at('End the day at the staff room desk.', 28, 12);
    if (!f.apNight28) return at('Sunday: the rebuild. End the day at the staff room desk.', 28, 12);
    if (!f.apSwitch) return at('Monday 07:30: Joanna wants a word before the desk goes back. Her office.', 5, 2);
  }
  if (!f.apDirective) return at('Imre Castell wants a word: the flight school’s office.', 3, 12);
  if (!f.apDojoDone) {
    if (!f.apDojoMet) return at('(Optional) Yara Quist’s ' + (apMgr() ? 'Third-Party and Tenant Risk' : 'Email and Account Forensics') + ' dojo, in the training room.', 18, 12);
    const i = apC().dojo.findIndex(x => !x);
    return at('(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', [16, 17, 18][i], 10);
  }
  if (!f.apBoard) return at('Take the Airport Board challenge: Rhoswen Adair, through the west door.', 8, 3, 'apboard');
  if (!f.apSummary) return at('Joanna wants to close the week: her office.', 5, 2);
  return {text: 'Regional Airport done. Next: the Compact-wide incident.', done: true, district: 'airport'};
}

/* ---------- Triggers, interactions, talk ---------- */
function apTriggers() {
  if (G.map === 'airport' && G.trackId && G.f.dpSummary && !G.f.apMet) { run(apArrive); return true; }
  return false;
}
function apInteract(ch, tx) {
  if (!inAirport()) return false;
  const f = G.f;
  if (!f.apMet && G.map === 'airport') { if ('§£YǍǏǑǓǕǗǙ¤'.includes(ch)) { run(async () => { await say('The offices are busy with the day. Once Dispatch’s week is closed, the airport manager would like a word.'); }); return true; } return false; }
  if (ch === '§') { run(apTable); return true; }
  if (ch === '£') { run(async () => { if (apDfir() && f.apTake && !f.apIntake) await apIntake(); else await say(apDfir() ? 'The airport’s evidence store, case AIR: a locked case and a seal log. A second, smaller case beside it holds one tenant’s item, apart.' : 'The exercise kit: CISA’s tabletop templates, a stopwatch, and a box of blank paper receipts.'); }); return true; }
  if (ch === 'Y') { run(apDesk); return true; }
  if (ch === 'Ǎ') { run(async () => { await say(f.apBoss && !f.apNight28 ? 'The front desk on paper: a receipt book, a paper log, and a sign: “Billing by hand today, thank you for your patience.”' : f.apFixDesk ? 'The front desk: two PCs, each person signing in with their own name. A paper kit in the drawer, practised on Thursday.' : 'The front desk: two PCs and one login, “frontdesk”, on a sticky note under the keyboard.'); }); return true; }
  if (ch === 'Ǐ') { run(async () => { await say('AP-BIL-01, Plinthwise’s server: billing, hangar leases, tenant records. ' + (f.apFixVendor ? 'A label: “Vendor support on demand: business office ticket.”' : 'A sticky note: “Plinthwise remote support: always on.”')); }); return true; }
  if (ch === 'Ǒ') { run(async () => { await say('A tenant’s own PC. It isn’t the airport’s, and you don’t touch it.'); }); return true; }
  if (ch === 'Ǔ') { run(async () => { await say(f.apFixTenants ? 'The tenant patch panel: every port labelled with its tenant and a contact. The list is taped inside the door, signed by Joanna.' : 'The tenant patch panel: cables in, no labels. Nobody here can say which port is whose.'); }); return true; }
  if (ch === 'Ǖ') { run(async () => { await say('The airport manager’s desk: the week’s schedule, the tenant list, and a printed contact page under the glass.'); }); return true; }
  if (ch === 'Ǘ') { run(async () => { await say(f.apBoss && !f.apNight28 ? 'A business office PC, switched off and labelled “Do not use: preserved”.' : 'A business office PC: Plinthwise on one screen, a lease on the other.'); }); return true; }
  if (ch === 'Ǚ') { run(async () => { await say('The IT closet’s rack: AP-SW-01, the office switch; AP-DC-01, the directory; AP-FS-01, the file server; the firewall above them.'); }); return true; }
  if (ch === '¤') { run(() => apDojoPuzzle([16, 17, 18].indexOf(tx))); return true; }
  if (ch === '±') { run(async () => { await say('The Board’s minutes, by year. A tab marked “Compact”, and one marked “Tenant agreements: to review”.'); }); return true; }
  return false;
}
async function apTalk(npc) {
  if (!AP_NPC_IDS.includes(npc.id)) return false;
  const f = G.f, who = npc.name;
  if (!f.apMet) { await say(f.dpSummary ? 'Come in: the airport manager’s office is through the lobby, on the left.' : 'Once Dispatch’s week is closed, the airport manager would like a word.', who); return true; }
  switch (npc.id) {
    case 'ferreday':
      if (apDfir() && f.apNight28 && !f.apSwitch) { await apSwitchDfir(); break; }
      if (f.apBoard && f.apDirective) { await apSummary(); break; }
      await say(apMgr() ? 'The airport is mine to run, on weekdays. Callum has it at weekends. Tell me what you see.' : 'Ansel says the firm reports to him. Fine. The terminal is mine to run.', who); break;
    case 'breck':
      if (apMgr() && f.apNight26 && !f.apBoss) { await apBoss(); break; }
      await say(f.apBoss ? 'The desk is on paper and it is working. I decide the terminal today; Joanna knows.' : 'Callum Breck, weekend duty manager. On Saturdays and Sundays the terminal is mine.', who); break;
    case 'moreau':
      await say(f.apBoss && !f.apNight28 ? 'Paper receipts, a paper log. We practised it on Thursday: eleven minutes. It took us nine today.' : f.apFixDesk ? 'My own login now. The sticky note is in the bin.' : 'Lise Moreau, front desk. We all use the same login. Everyone knows it.', who); break;
    case 'darrow':
      await say('Yusuf Darrow, Corrowind Aviation. Our counter, our systems. I got that email too, and I didn’t pay it.', who); break;
    case 'varga':
      if (apMgr() && !f.apDrillA) { await apDrillA(); break; }
      await say(f.apFixVendor ? 'Plinthwise’s support is off until I ask for it now. One ticket, one session.' : 'Odette Varga, business office. Plinthwise is mine: billing, leases, tenant records, and the contract.', who); break;
    case 'castell':
      if (!f.apDirective && (f.apAar || f.apSwitch)) { await apDirective(); break; }
      await say(f.apDrillA ? 'Glad I asked before paying. The bank details looked perfect.' : 'Imre Castell, Kettlebrook Flight School. Our PCs are ours.', who); break;
    case 'teller':
      if (apMgr() && f.apNight27 && !f.apDrillC) { await apDrillC(); break; }
      await say(f.apDrillC || (apDfir() && f.apNight27) ? 'My own IT will look at it. My PC, my people. Thank you for asking first.' : 'Bronwen Teller, Brackenlow Aero Services. My shop’s systems are my business.', who); break;
    case 'fenn':
      if (apMgr() && f.apDrillA && !f.apDrillB) { await apDrillB(); break; }
      await say(f.apFixTenants ? 'Forty-six ports, fifteen of them tenants’, every one labelled. I keep the list; Joanna signs it.' : 'Dario Fenn, IT. One network for everyone, for now.', who); break;
    case 'whitcombe':
      if (apDfir() && !f.apLetter) { await apLetterTask(); break; }
      await say('Ansel Whitcombe, counsel to the Authority. The firm reports to me. What tenants are told about their records is my decision.', who); break;
    case 'quist': await apDojoIntro(); break;
    case 'adair': await apBoardScript(); break;
    case 'luciaap':
      if (apDfir() && f.apLetter && !f.apTake) { await apTakeTask(); break; }
      if (apDfir() && f.apNight26 && !f.apBoss) { await apBoss(); break; }
      if (apMgr() && f.apBoss && !f.apStatus) { await apStatusReport(); break; }
      await say(apDfir() ? 'Tenants’ systems are theirs. We take what we are given, and we record whose it is.' : 'Our report goes to Ansel. You get the status, the same day.', who); break;
    case 'theoap':
      if (apDfir() && f.apNight23 && !f.apStores) { await apStores(); break; }
      await say('Theo. The airport’s evidence in its store; the shop’s log in its own.', who); break;
  }
  return true;
}

/* ---------- Arrival (Day 23, Tuesday) ---------- */
async function apArrive() {
  const f = G.f, c = apC();
  f.apMet = true; G.day = Math.max(G.day, 23); G.focus = G.focusMax; touchCSF('Identify');
  if (apDfir()) c.rota = apAutoRota();
  await say('Day 23, Tuesday, ' + (apMgr() ? '08:00' : '08:35') + '. The Regional Airport, the terminal offices. (Dispatch’s week closed on Friday. game)');
  await say('Joanna Ferreday, airport manager. Four things, plainly. The tenants, the flight school, the maintenance shop and the FBO, all plug into our office network. Plinthwise, our billing and lease system, has vendor support that is always on. Nobody has a list of which connections are tenants’. And the front desk shares one login.', 'Joanna Ferreday');
  await say('This is the business side only: billing, leases, tenant records, email. Access control and fuelling are separate systems, and they aren’t part of this. (game)', 'Joanna Ferreday');
  await say('And this morning: at 07:50 Imre, at the flight school, forwarded an email “from Airport Operations” saying our bank account has changed. Bronwen and Yusuf got it too. And the Compact’s day lead read an alert from the night: Plinthwise’s support account signed in at 02:40.', 'Joanna Ferreday');
  unlock('fact', 'apcisa'); unlock('fact', 'apnotam'); unlock('fact', 'apacrp');
  if (apMgr()) {
    await say('The Airport annex to the Compact’s plan (game): the retainer is called when ransomware or another destructive attack is found on the airport’s office network; when billing or tenant records may have left the airport’s control; or when the on-call lead can’t contain an incident. A vendor’s unexplained access is checked first with the vendor on the contract’s own number; if it can’t be confirmed within the hour, the retainer is called.');
    await say('08:45: Odette rings Plinthwise’s support line from the contract and reaches it: the 02:40 session was its scheduled work, it says. 08:55: she writes and signs a note of the call. Nothing destructive found, nothing shown to have left: the annex isn’t met. The Compact’s own team works it. (game)');
    await say('Plinthwise’s incident clause, §9, and its escalation line are already on the plan’s contact page (Slate Badge). Odette has the email at her desk. (game)');
  } else {
    const lead = G.cr.growth === 'paz' ? 'Paz' : G.cr.growth === 'beatriz' ? 'Ruth' : 'Beatriz';
    await say('07:55: Joanna rang ' + lead + ', the town’s acting team lead, who put her through to Ansel Whitcombe, the Authority’s counsel, on the plan’s contact page. 08:30: Ansel engages Tallowmere under a letter. (The airport has no IR manager applying its annex: counsel engages the firm for two questions and a map, his decision. game)');
    await say('08:45: Odette is ringing Plinthwise’s support line from the contract. She’ll write a note of it. (game)');
    await say('You lead it. The meeting room is ours. Ansel first, and nothing a tenant owns is touched.', 'Lucia Ferrand');
  }
}

/* ---------- The meeting room table (manager: owners, the rota, the tabletop, the AAR; DFIR: the bench) ---------- */
async function apTable() {
  const f = G.f;
  if (apMgr()) {
    if (f.apDrillB && !f.apOwners) return apOwnersTask();
    if (f.apOwners && !f.apRota) return apRotaTask();
    if (f.apNight23 && !f.apTabletop) return apTabletop();
    if (f.apNight28 && !f.apAar) return apAar();
    return say(f.apAar ? 'The table: three index cards, each with an owner and a date, and the receipt count on a fourth.' : 'The meeting room table. A whiteboard with the office network drawn on it, one big box.');
  }
  if (!f.apLetter) return say('The bench. Ansel has the letter; read it with him first.');
  if (f.apIntake && !f.apDrillA) {
    await apDrill('maildfir'); f.apDrillA = true; touchCSF('Detect');
    await say(G.cr.drills.maildfir.supported ? 'Not ours, from A-01 and A-02.' : 'Question 1 has its answer, but write it only from what you’ve read.', 'Lucia Ferrand');
    await say('09:40: Odette has rung every tenant on its lease-file number: no change, don’t pay. Nobody had paid. 09:45: Dario blocked rvb-airports.example at the airport’s mail. (game)', 'Lucia Ferrand');
    return;
  }
  if (f.apDrillA && !f.apDrillB) {
    await apDrill('venddfir'); f.apDrillB = true; touchCSF('Detect');
    await say('Plinthwise’s update, from A-03 and A-08. 14:30: A-09 is in, the switch’s 46 ports, 15 with tenants’ devices, Dario’s list checked by Theo against the switch’s own table. Hashed, sealed. (game)', 'Lucia Ferrand');
    const cu = apCustody(); cu.items++; cu.complete++; track();
    await say('End the day when you’re ready.', 'Lucia Ferrand');
    return;
  }
  if (f.apStores && !f.apDrillC) {
    await apDrill('lastdfir'); f.apDrillC = true; touchCSF('Detect');
    await say(G.cr.drills.lastdfir.verdictOk ? 'Our records, their word, and an honest unknown with the date. And the control worked.' : 'What each record shows, and who tried as unknown, with R-02 dated. A session and a connection are different things.', 'Theo Marchetti');
    await say('AIR-01 for Ansel, at the bench, when you’re ready.', 'Lucia Ferrand');
    return;
  }
  if (f.apDrillC && !f.apReport) return apReport1();
  return say('Your bench: working copies only. The originals are sealed in the store.');
}

/* ---------- Drills ---------- */
async function apDrill(key) {
  const c = G.cr;
  const r = await doDrill(AP_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai};
  if (apDfir()) { c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++; }
  track();
  return r;
}
async function apDrillA() {
  await say('Imre’s copy is here, forwarded as an attachment, and Dario has pulled our mail’s trace. Imre rang me at 08:30, too. Read it like you’d read anyone’s.', 'Odette Varga');
  const r = await apDrill('mailmgr');
  G.f.apDrillA = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Not us, then. I’ll ring every tenant myself.' : 'The trace says we sent nothing, the headers say someone else did, and our account hasn’t changed. Not us. I’ll ring every tenant myself.', 'Odette Varga');
  await say('09:40: Odette has rung every tenant on its lease-file number: no change, don’t pay. Nobody had paid. 09:45: Dario blocks rvb-airports.example at the airport’s mail. Each tenant asks its own bank about anything it sent. (game)');
  await say('Dario has the 02:40 alert in the IT closet.');
}
async function apDrillB() {
  await say('The connector’s log, and Odette’s note of her call. The account is from 2019 and nobody has changed its password since. Read it.', 'Dario Fenn');
  const r = await apDrill('vendmgr');
  G.f.apDrillB = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Plinthwise, then. And it is still always on.' : 'The ticket, the range and the vendor’s own word agree: their update. And it is still always on.', 'Dario Fenn');
  await say('11:00: with Odette’s agreement, Dario sets pw-support to on demand: disabled, enabled by Odette for one ticket at a time, its logs kept. Odette asks Plinthwise, under its contract, for MFA and a new password. (game)');
  G.f.apFixVendor = true; track();
  await say('Next: who owns what on this network. The meeting room table.');
}
async function apDrillC() {
  await say('My shop, my PC, my customers’ records. Your firm wants to image it. Tell me why I should let them, and who says so.', 'Bronwen Teller');
  const r = await apDrill('tenantmgr');
  G.f.apDrillC = true; touchCSF('Respond');
  await say(r.verdictOk ? 'My people will look at it tomorrow, then. Memory first, they say. And I’ll share what they find about those two connections, through Ansel.' : 'It stays off your network and my own IT checks it. That I can live with. Memory first, they say. What they find about those two connections, I’ll share through Ansel.', 'Bronwen Teller');
  await say('Joanna keeps MS-PC-01’s port shut until it is checked. Ansel writes to Bronwen: what the airport saw, and what it asks. Monday 09:00: her own IT firm preserves MS-PC-01, memory and disk, and keeps the copies. (game)');
  await say('End the day when you’re ready.');
}

/* ---------- Manager: who owns what (Tuesday 11:30) ---------- */
async function apOwnersTask() {
  const c = apC();
  await say('Before anyone touches anything on a shared network, write down whose each thing is. Pick the four that are true.');
  const items = AP_OWNERS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> statements the plan should record.</p>' + shownOrder(AP_OWNERS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('Who owns what · the office network', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !AP_OWNERS[i].good);
  for (const i of wrong) await say(AP_OWNERS[i].name + ': ' + (AP_OWNERS[i].id === 'share' ? 'sharing a network doesn’t make a PC the airport’s. The tenant decides about it.' : AP_OWNERS[i].id === 'vendor' ? 'the vendor supports the system; the data is the airport’s, and Odette’s to decide.' : 'the firm comes and goes. The list needs a keeper who is here every day.'));
  c.owners = {wrong: wrong.length};
  G.f.apOwners = true; unlock('act', 'apowners'); touchCSF('Identify'); touchCSF('Govern'); track();
  await say('12:00: Joanna’s office rings each tenant for a named contact and a list of its devices on the network. Their answers are due on Thursday and Friday. (game)');
  await say('Next week’s nights need a rota, and you have the airport too now. At the table, when you’re ready.');
}

/* ---------- Manager: the week-4 rota (Tuesday 16:30) ---------- */
async function apRotaTask() {
  const c = apC();
  await say('Next week’s nights: Nights 23 to 29. Nights 21 and 22 were the week-3 rota’s last two: both count for the in-a-row rule. (game)');
  const r = await doRota(AP_ROTA, apPre());
  c.rota = {assign: r.assign, stats: r.stats};
  const L = rotaForecast(AP_ROTA, r.assign);
  await UI.openModal('Rota · week 4', rotaTable(AP_ROTA, r.assign) +
    '<p>Rota gaps <b>' + r.stats.gaps + ' h</b> · nights past two in a row <b>' + r.stats.tired.length + '</b> · overtime so far <b>' + r.stats.overtime + ' of ' + AP_ROTA.budget + ' h</b> (game)</p>' +
    (L.length ? '<ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + '<p class="small">No calls are forecast: nothing is known yet. Each call-out is costed when it happens. (game)</p>',
    [{label: 'Pin it to the team board', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.apRota = true; unlock('act', 'crrota'); touchCSF('Govern'); track();
  await say(r.stats.tired.length ? 'Somebody’s on a third night in a row in there. We’ll see it if anything pages. (game)' : r.stats.gaps ? 'There’s a hole in it. Whatever pages that night waits for the morning.' : 'Week 4, nobody past two in a row. End the day when you’re ready.');
}

/* ---------- Manager: the tabletop with the airport manager (Wednesday 09:00) ---------- */
async function apTabletop() {
  const c = G.cr, who = 'Joanna Ferreday';
  await say('Callum runs the terminal at weekends, so he’s here too. Our risk register’s worst line is the office down on a busy weekend. Help me test it.', who);
  while (true) {
    const items = AP_TT_OBJ.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The tabletop · the scenario', '<p>An exercise finds the gaps before they matter. Where does the scenario come from, and who is at the table?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(AP_TT_OBJ[i].why);
  }
  for (const inj of AP_TT_INJECTS) {
    const items = inj.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('The tabletop · inject', '<p><b>' + esc(inj.t) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(inj.opts[i].why);
    }
  }
  c.ex.run += 1; c.ex.actions += AP_EX_ACTIONS; apC().tt = {actions: AP_EX_ACTIONS}; track();
  G.f.apTabletop = true; unlock('act', 'appaper'); unlock('act', 'crtabletop'); touchCSF('Recover'); touchCSF('Govern');
  await say('Three actions (game): a paper kit at the front desk, practised on Thursday at 10:00 (me); named front-desk logins, the shared one switched off, by Thursday 17:00 (Dario); Callum holds the plan’s contact page and the paper procedure by Friday noon (me).', who);
  await say('End the day when you’re ready.');
}

/* ---------- Manager: the AAR (Monday 13:00) ---------- */
async function apAar() {
  const c = G.cr, d = apC(), who = 'Joanna Ferreday';
  await say('Blameless. No names. I want to know how one PC reached everything on Saturday, and what it cost us and the tenants.', who);
  const items = AP_FACTORS.map(p => ({label: p.name, meta: {good: !!p.good}})).concat([{label: 'These are the four', done: true, meta: {done: true}}]);
  const body = '<p>Pick the <b>four</b> contributing factors the AAR should record.</p>' + shownOrder(AP_FACTORS, items).map(p => '<div class="card"><b>' + esc(p.name) + '</b><br>' + esc(p.text) + '</div>').join('');
  const sel = await UI.openModal('AAR · contributing factors', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const wrong = sel.filter(i => !AP_FACTORS[i].good);
  for (const i of wrong) await say(AP_FACTORS[i].name + ': ' + (AP_FACTORS[i].id === 'login' ? 'a blame, not a cause, and the shared login was switched off on Thursday. Nothing shows it was used.' : AP_FACTORS[i].id === 'vendor' ? 'pw-support has been disabled since Tuesday, and Wednesday’s attempts were rejected.' : 'the tabletop is why the paper worked on Saturday.'));
  let impFirst = true;
  while (true) {
    const its = AP_IMPACT.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('AAR · the impact', '<p>The cost, from 07:40 Saturday to 12:00 Monday. What goes in the review?</p>', its, {shuffle: true, closable: false, cls: 'drill'});
    if (its[i].meta.good) break;
    impFirst = false; await say(AP_IMPACT[i].why);
  }
  await say('The three actions arrive with their owners already assigned, under the Library Board’s rule (Bookmark Badge). What’s left is the dates.');
  let onTime = 0;
  for (const a of AP_AAR) {
    let ok = true;
    const opts = a.dates.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('AAR · due date', '<div class="card"><b>' + esc(a.name) + '</b><br>Owner: ' + esc(a.owner) + '</div><p>When is it due?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      ok = false; await say(a.dates[i].why);
    }
    if (ok) onTime++;
  }
  c.aar = {total: ((c.aar && c.aar.total) || 0) + AP_AAR.length, onTime: ((c.aar && c.aar.onTime) || 0) + onTime};
  d.aar = {factorsWrong: wrong.length, onTime: onTime, impactFirst: impFirst};
  G.f.apAar = true; unlock('act', 'apaar'); unlock('act', 'craar'); touchCSF('Govern'); track();
  await say('Three actions, three owners, three dates, the cost as counted, and nobody blamed. Imre wants a word in his office.', who);
}

/* ---------- The directive (both tracks): a tenant's permanent direct connection ---------- */
async function apDirective() {
  const who = 'Imre Castell', t = G.trackId;
  await say('Give the flight school a direct, permanent connection into the airport’s office network. Our people could reach Plinthwise’s tenant pages and the shared printer without the portal. It worked fine for years.', who);
  if (t === 'dfir') await say('Ansel says you can tell me what the case showed. Is keeping us apart worth it?', who);
  const L = AP_DIRECTIVE[t];
  while (true) {
    const items = L.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose(t === 'dfir' ? 'What do you tell Imre?' : 'How do you answer Imre?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(L[i].why);
  }
  await say(t === 'dfir' ? 'The facts from the case: on Saturday the encrypting PC, AP-OF-03, reached a tenant’s PC across the one network the tenants share. How the attacker got in is unknown. The decision about what connects is Joanna’s. Ansel agreed I could say that much.' :
    'The trade-off: what a direct link saves the flight school (no portal sign-in, the printer); what Saturday showed it costs (one shared network let the encrypting PC reach a tenant’s PC); and the options: a tenant segment that reaches only the tenant portal and the internet, under a signed tenant agreement; the flight school’s own network kept its own; or the old direct link with the risk accepted in writing. Joanna decides.');
  await say('Tenants get their own segment: the tenant portal and the internet, nothing else, under a tenant agreement Ansel is drafting. No direct links. My decision; review in 90 days. (game)', 'Joanna Ferreday');
  G.f.apDirective = true; unlock('act', 'apseg'); touchCSF('Protect');
  await say(apMgr() ? '(Present the trade-off; the owner decides.)' : '(Give the facts; the owner decides.)');
}

/* ---------- DFIR D1: the scoping letter ---------- */
async function apLetterTask() {
  const who = 'Ansel Whitcombe', f = G.f;
  const row = (k, v) => '<tr><th style="vertical-align:top;white-space:nowrap">' + k + '</th><td>' + v + '</td></tr>';
  const letter = '<p><b>Scoping letter · Tallowmere Forensics · case AIR-01 (game)</b></p><table class="sc letter">' +
    row('Engaged by', 'Ansel Whitcombe, counsel to the Airport Authority, at 08:30') +
    row('Questions', '1. Did the “Airport Operations” email to tenants come from the airport’s mail system?<br>2. Who used pw-support at 02:40 today, and what was done?<br>3. On the office network, what is the airport’s and what is a tenant’s?') +
    row('In scope', 'The airport’s own systems: the mail service’s admin console and trace, AP-BIL-01, AP-FS-01, AP-DC-01, AP-FW-01, AP-SW-01') +
    row('Can’t touch', 'Tenants’ PCs and systems: only what a tenant chooses to give, with its consent recorded. Plinthwise’s own systems: requests through counsel, logged when sent') +
    row('Report to', 'Ansel Whitcombe, who decides who receives it') +
    row('The terminal', 'Anything about the terminal and how it runs is Joanna Ferreday’s decision.') + '</table>';
  await say('Read it before you touch anything. Three owners share that network: us, the tenants, and the vendor. You may touch one of them.', who);
  while (true) {
    const items = AP_LETTER.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('The scoping letter', letter + '<p><b>Your first step?</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(AP_LETTER[i].why);
  }
  f.apLetter = true; unlock('act', 'crscope'); unlock('act', 'apowners'); touchCSF('Govern'); track();
  await say('Imre has offered the flight school’s copy of the email. Lucia is waiting for you.', who);
}

/* ---------- DFIR D2: what the firm may take ---------- */
async function apTakeTask() {
  const who = 'Lucia Ferrand';
  await say('The email sits in three tenants’ mailboxes, none of them ours. The session is in the airport’s own logs. What do we take, and from whom?', who);
  while (true) {
    const items = AP_TAKE.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await UI.openModal('What the firm may take · 09:10', '<p>Three owners share the office network. What do you collect, and from whom?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[i].meta.good) break;
    await say(AP_TAKE[i].why);
  }
  G.f.apTake = true; unlock('act', 'aptenant'); touchCSF('Respond'); track();
  await say('09:20: Dario exports the mail trace. 09:25: Imre gives us the flight school’s copy, forwarded as an attachment, and signs a consent: for question 1 only. 09:30: Dario, the connector’s log. 09:35: Odette, Plinthwise’s audit. 09:40: Dario, the flows. 09:45: Dario, the directory’s query log. All hashed at export or on receipt. The evidence locker, when you’re ready. (game)', who);
}

/* ---------- DFIR D3: evidence intake; the vendor's access; the request; the Quiet Thread ---------- */
async function apIntake() {
  const cu = apCustody();
  await say('Six items. Four need your call; the trace and the flows are routine. Log each one: whose it is, who handed it over, when, the hash on receipt against the form, where the original is sealed. Work on copies.', 'Lucia Ferrand');
  for (const it of [AP_INTAKE.a02, AP_INTAKE.a03, AP_INTAKE.a04, AP_INTAKE.a06]) {
    let first = true;
    const opts = it.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Custody log · ' + it.id, '<div class="card"><b>' + esc(it.id + ' · ' + it.what) + '</b><br>' + esc(it.form) + '</div><p>Received Day 23. How do you log it?</p>', opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      first = false; cu.gaps++;
      await say(it.opts[i].why);
    }
    cu.items++; if (first) cu.complete++;
    if (it.id === 'A-02') await say('Logged as the flight school’s item, in the airport’s case, marked “question 1 only”: whose it is, and what it was given for. (game)');
    if (it.id === 'A-06') await apQtEvidence();
  }
  cu.items += 2; cu.complete += 2;   // A-01 and A-05: hashed on receipt against Dario's export record, sealed
  G.f.apIntake = true; unlock('act', 'crcustody'); touchCSF('Respond'); track();
  await say('10:40: A-07, AP-BIL-01’s EDR for 02:00 to 04:00, exported by Dario, hashed. 11:00: at our advice, with Odette’s agreement, Dario sets pw-support to on demand: disabled, enabled for one ticket at a time, clearing nothing. 11:05: A-08, Odette’s signed note of her 08:45 call with Plinthwise’s Day 15 email announcing PW-4471, headers kept, hashed on receipt. (game)', 'Lucia Ferrand');
  G.f.apFixVendor = true; cu.items += 2; cu.complete += 2;
  apC().requests = {date: 'Day 23 (Tuesday) 11:15'};
  await say('11:15, through Ansel: R-01 to Plinthwise for its own records of the 02:40 session, and a commitment to keep them. Logged as it went: “requested Day 23 (Tuesday) 11:15” (Slate Badge). Question 1 is on the bench. (game)', 'Lucia Ferrand');
  track();
}
// The Quiet Thread clue, seen in A-06 (DFIR). Noticing is the mechanic: the prompt opens on "Leave it".
async function apQtEvidence() {
  if (qtFound('ap-accounts')) return;
  const i = await choose('A-06, the directory’s query log. The letter’s questions don’t need it. Its seven days run back to last Wednesday.', [{label: 'Read the rest of the query log too'}, {label: 'Leave it: the questions have what they need'}], {cursor: 1});
  if (i !== 0) return;
  await say('03:13, Night 21, Sunday to Monday: one query from svc-print, a town account, from FD-STAFF-11’s address (Town Hall’s front-desk PC), over the Compact’s link and through the airport directory’s trust with the town’s. It asks for every account: 214 entries returned, names and account names. No password is asked for. Nothing changed, and nothing else was queried. What it did with the list is unknown.');
  await say('Not one of the letter’s questions. It goes to Ansel first; with his agreement, to Lucia and Rae’s suspicion-file team. Nothing changes on svc-print without a plan.');
  await crQtAfterNote(qtNote('ap-accounts'));
}

/* ---------- DFIR: AIR-01 ---------- */
async function apReport1() {
  const c = G.cr;
  const r = await doReport(AP_REPORT_1);
  c.reports.ap1 = {score: r.score, over: r.over, under: r.under};
  c.corrected += r.over; track();
  G.f.apReport = true; touchCSF('Respond');
  await say('To Ansel at 17:00. 18:00: with his agreement the recommendations went to Joanna, Odette and Dario, who accepted them: named front-desk logins (Dario, Thursday); the tenant connections list with one keeper and one approver (Dario and Joanna, Friday); pw-support on demand with MFA and a new password, in Plinthwise’s contract (Odette); and tenants on their own segment, which is Joanna’s question to decide. (game)', 'Lucia Ferrand');
  await say('End the day when you’re ready.', 'Lucia Ferrand');
}

/* ---------- DFIR D5: separate stores per owner (Wednesday 10:00) ---------- */
async function apStores() {
  await say('Bronwen emailed us her shop’s own firewall log, “in case it helps”. And Imre asked whether we’d check the flight school’s PCs while we’re here. Where does Bronwen’s log go?', 'Theo Marchetti');
  while (true) {
    const items = AP_STORES.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose('Theo has a tenant’s item and a tenant’s request.', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(AP_STORES[i].why);
  }
  const cu = apCustody(); cu.items++; cu.complete++;   // S-01: the shop's log, in a store of its own
  G.f.apStores = true; unlock('act', 'crstores'); touchCSF('Govern'); track();
  await say('S-01, in its own store, sealed and unread. And the flight school’s PCs are Imre’s: if he wants them checked, he engages someone himself. (game)', 'Theo Marchetti');
  await say('09:30 today, through Ansel: A-10, Plinthwise’s answer to R-01: its portal log for Days 20 to 23, the last session for the airport Tuesday 02:40 to 03:25, PW-4471. Hashed, logged. (game)');
  await say('14:05: two sign-ins on pw-support rejected, account disabled, from 203.0.113.44, inside Plinthwise’s range. 14:40: Dario exports the flows for 13:00 to 14:30 (A-11) and the connector’s log for the same window (A-12). 15:00, through Ansel: R-02 for Plinthwise’s records on that address, logged “requested Day 24 (Wednesday) 15:00”. 15:40: Plinthwise’s written answer (A-13): no session or technician activity for the airport today; 203.0.113.44 is one of its support addresses; it is checking. (game)');
  cu.items += 4; cu.complete += 4; track();   // A-10 to A-13
  await say('16:00. Question 2 again, on the bench: when did the vendor last connect?');
}

/* ---------- DFIR, Monday 07:30: the airport manager asks the consultant ---------- */
async function apSwitchDfir() {
  const who = 'Joanna Ferreday';
  await say('Plinthwise has been back on a new server since yesterday afternoon and the desk has been on paper since Saturday. You looked at it. Can we go back?', who);
  while (true) {
    const items = AP_SWITCH_DFIR.map(o => ({label: o.label, meta: {good: !!o.good}}));
    const i = await choose('What do you tell Joanna?', items, {shuffle: true});
    if (items[i].meta.good) break;
    await say(AP_SWITCH_DFIR[i].why);
  }
  G.f.apSwitch = true; unlock('act', 'apcopy'); touchCSF('Recover'); track();
  await say('The firm’s check of AP-BIL-02 finished at 14:00 yesterday, after the vendor’s session: nothing foreign in a fresh memory capture or in its EDR since 07:00, nothing set to persist, the one-time account removed at 13:10, and the copy it was restored from checked in isolation before it was used. When the desk goes back is Joanna’s.');
  await say('Joanna’s decision: a test entry, then the desk back on Plinthwise at 08:00. By 12:00 the weekend’s 64 paper receipts are entered, each checked by a second person. MS-PC-01 stays off the airport’s network. (game)');
}

/* ---------- The desk: end the day, and the nights between ---------- */
async function apDesk() {
  const f = G.f, mgr = apMgr();
  const ready = mgr ? ((f.apRota && !f.apNight23) || (f.apTabletop && !f.apNight26) || (f.apStatus && !f.apNight27) || (f.apDrillC && !f.apNight28))
    : ((f.apDrillB && !f.apNight23) || (f.apReport && !f.apNight26) || (f.apBoss && !f.apNight27) || (f.apNight27 && !f.apNight28));
  if (!ready) { await say('A hot desk in the staff room. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('End the day?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  if (!f.apNight23) await apNight23(); else if (!f.apNight26) await apNights24(); else if (!f.apNight27) await apNight27(); else await apNight28();
}
async function apNight23() {
  const lead = apLead(23);
  await UI.openModal('Night 23', '<p>Night 23 (Tuesday to Wednesday). On call: <b>' + esc(lead || 'nobody') + '</b>' + (apTired(23) ? ', a third night or more in a row' : '') + '. No page. (game)</p>', [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 24; G.focus = G.focusMax; G.f.apNight23 = true;
  await say('Day 24, Wednesday. ' + (apMgr() ? '09:00: Joanna and Callum are at the meeting room table for the tabletop.' : 'Theo is in the meeting room with something from a tenant.'));
  track();
}
async function apNights24() {
  const mgr = apMgr(), L = n => (apLead(n) || 'nobody') + (apTired(n) ? ', a third night or more in a row' : '');
  G.f.apFixDesk = true; G.f.apFixTenants = true;
  if (mgr) G.cr.ex.closed += AP_EX_ACTIONS;
  touchCSF('Protect'); touchCSF('Identify');
  const body = (mgr ? '<p>Wednesday 14:05: two sign-ins on pw-support rejected, account disabled, from 203.0.113.44, inside Plinthwise’s range. 14:30: Dario tells you. 14:40: Odette asks Plinthwise on its contract’s line; 15:40, in writing: no session or technician activity of its own for the airport today. Who tried is unknown; noted in the plan’s log. (game)</p>' : '') +
    '<p>Nights 24 to 26 (Wednesday to Saturday). On call: <b>' + esc(L(24)) + '</b>, <b>' + esc(L(25)) + '</b>, <b>' + esc(L(26)) + '</b>. No page on any of them. (game)</p>' +
    '<p>Thursday 10:00: ' + (mgr ? '' : 'on Joanna’s own plan, ') + 'the front desk practises the paper procedure: 11 minutes from “Plinthwise is down” to the first paper receipt (practice time, game). 17:00: named front-desk logins; “frontdesk” switched off. Friday 12:00: Callum has the plan’s contact page and the paper procedure. 16:00: the tenant connections list: 46 ports, 15 of them tenants’, each with a tenant contact, kept by Dario, signed by Joanna. (game)</p>';
  await UI.openModal('Nights 24 to 26', body, [{label: 'Saturday morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 27; G.focus = G.focusMax; G.f.apNight26 = true;
  await say('Day 27, Saturday, one of the airport’s busiest weekends of the autumn (game). ' + (mgr ? '07:45: Callum Breck, the weekend duty manager, is calling you from the lobby.' : '08:20: Lucia is in the meeting room. Ansel has just rung her.'));
  track();
}
async function apNight27() {
  const c = apC(), lead = apLead(27), tired = apTired(27);
  const cost = lead ? (tired ? AP_ROTA.tiredCost : AP_ROTA.callCost) : 0;
  const body = '<p>Night 27 (Saturday to Sunday). On call: <b>' + esc(lead || 'nobody') + '</b>' + (tired ? ', a third night or more in a row' : '') + (apMgr() ? ', on site at the airport under the plan' : '') + '.</p>' +
    '<p>Callum keeps the front desk on paper overnight and through Sunday: his call. The office stays cut off. Nothing new on the office network all night. (game)</p>' +
    (lead ? '<p>The call-out: ' + cost + ' overtime hours.</p>' : '<p>Nobody on call for the Compact: the firm worked the night on its retainer hours.</p>');
  await UI.openModal('Night 27', body, [{label: 'Morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.day = 28; G.focus = G.focusMax;
  c.night27 = {lead: lead, tired: tired, overtime: cost};
  if (cost && c.cover) { c.cover.overtime += cost; c.cover.variance = Math.round((c.cover.overtime - AP_ROTA.budget) / AP_ROTA.budget * 100); }
  if (tired && apMgr()) { G.focus = Math.max(10, G.focus - 10); await say('You were rung at 02:10 by a tired on-call lead. Focus ' + G.focus + '/' + G.focusMax + ' this morning. (game)'); }
  G.f.apNight27 = true;
  await say('Day 28, Sunday, 07:00. Dario starts building a new Plinthwise server, AP-BIL-02. Plinthwise’s support works through a one-time account Odette authorised for this session, with MFA; pw-support stays disabled; the firm watches. 08:00: the firm checks Saturday’s 01:00 nightly copy in isolation before anyone restores it. (game)');
  if (apMgr()) await say('Bronwen Teller rang Joanna at 09:40: she won’t have the firm image her shop’s PC. Joanna asks you to see her at 10:00.');
  else await say('10:00: Bronwen Teller declines the firm’s offer to image MS-PC-01, her shop’s PC: it’s hers. Joanna keeps its port shut until it is checked. Her own IT firm will preserve it on Monday. (game)');
  track();
}
async function apNight28() {
  const lead = apLead(28);
  const body = '<p>Sunday (game): 08:00 the firm’s check of the 01:00 copy, in isolation: scanned clean, its own audit tables ending at 00:58 with no ap-admin sign-in and no unknown account. 10:30 restored onto AP-BIL-02. ap-admin replaced by two named admin accounts with MFA (Dario). 13:10 the vendor’s one-time account removed. 14:00 the firm’s check of AP-BIL-02 after the session: a fresh memory capture and the EDR’s processes, connections and file events since 07:00: nothing foreign, nothing set to persist. AP-OF-03 stays off; the other office PCs are reimaged from a clean image after their disks were imaged.</p>' +
    '<p>Night 28 (Sunday to Monday). On call: <b>' + esc(lead || 'nobody') + '</b>' + (apTired(28) ? ', a third night or more in a row' : '') + '. No page. (game)</p>';
  await UI.openModal('Night 28', body, [{label: 'Monday morning', meta: {good: true}}], {closable: false, cls: 'summary'});
  if (apDfir()) { const cu = apCustody(); cu.items += 2; cu.complete += 2; }   // A-22 the vendor session's record, A-23 the check of AP-BIL-02
  G.day = 29; G.focus = G.focusMax; G.f.apNight28 = true;
  if (apMgr()) await say('Day 29, Monday, 07:30. Joanna, back on duty, decides: a test entry, then the front desk back on Plinthwise at 08:00. By 12:00 the weekend’s 64 paper receipts are entered, each checked by a second person. MS-PC-01 stays off the network; Bronwen’s own IT preserves it at 09:00. The AAR at 13:00. (game)');
  else await say('Day 29, Monday, 07:30. Joanna wants a word in her office before the desk goes back.');
  track();
}

/* ---------- Dojo (Yara Quist; original puzzles) ---------- */
function apDojo() { return apMgr() ? AP_DOJO_MGR : AP_DOJO_DFIR; }
async function apDojoIntro() {
  const who = 'Yara Quist', f = G.f;
  if (!f.apDirective) { await say('Yara Quist, training officer. The terminals are free once your week’s work is done.', who); return; }
  if (!f.apDojoMet) { f.apDojoMet = true; await say(apMgr() ? 'Third-Party and Tenant Risk: three terminals. Whose is it, who decides, and who keeps the list.' : 'Email and Account Forensics: three terminals. Traces, headers, and two records that disagree.', who); return; }
  if (f.apDojoDone) { await say(apMgr() ? 'Ask the owner. Decide your own network. One keeper for the list.' : 'Trace and headers. Attachments, not screenshots. Each record for what it records.', who); return; }
  await say('Puzzles solved: ' + apC().dojo.filter(Boolean).length + ' of 3. The terminals are along the north wall, behind me.', who);
}
async function apDojoPuzzle(i) {
  const f = G.f, c = apC();
  if (i < 0) return;
  if (!f.apDojoMet) { await say('A training terminal. Talk to Yara first.'); return; }
  const p = apDojo()[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who has to act on it would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF(apMgr() ? 'Govern' : 'Detect');
  if (!c.dojo.every(Boolean) || f.apDojoDone) return;
  f.apDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2);
  await say('All three. Focus ' + G.focusMax + ' (game).', 'Yara Quist');
}

/* ---------- The Airport Board ---------- */
async function apBoardScript() {
  const who = 'Rhoswen Adair', f = G.f, c = apC();
  if (f.apBoard) { await say('The Windsock Badge says this airport trusts how you work. Keep earning it.', who); return; }
  if (!f.apDirective) { await say('The Board sits once your week’s work is done.', who); return; }
  await say('The Airport Board. Three questions, the way the tenants and the public put them to us. We grade the answer we can act on.', who);
  const specs = apMgr() ? AP_BOARD_SPECS_MGR() : AP_BOARD_SPECS_DFIR();
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
  f.apBoard = true; f.apWindsock = true;
  G.focusMax += 4; G.focus = G.focusMax; track();
  await say('You cleared the Airport Board. This is the Windsock Badge (game).', who);
  await say(apMgr() ? 'Its power, from the next district on: every third party in an incident arrives with its owner, its contact and what it owns on the plan’s page. And you carry a little more now: Focus +4.' : 'Its power, from the next district on: every item a third party hands over arrives with its owner and its consent recorded. And you carry a little more now: Focus +4.', who);
  touchCSF('Govern');
  await say('Joanna wants to close the week in her office.');
}

/* ---------- The boss (game-original): ransomware on the office network on a busy weekend ---------- */
async function apStages(S, keys) {
  const b = apC().boss;
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
async function apPlanWeekend() {
  const c = apC();
  const pick = AP_COVER.find(o => o.good);
  c.cover = {k: pick.k, gaps: pick.gaps, overtime: pick.overtime, variance: Math.round((pick.overtime - AP_ROTA.budget) / AP_ROTA.budget * 100)};
  const r = c.rota, fc = o => '<li>' + esc(o.label.split(':')[0].split(',')[0]) + ': overtime forecast ' + o.overtime + ' h of ' + AP_ROTA.budget + ', gaps ' + o.gaps + ' h (game)</li>';
  const i27 = 27 - AP_ROTA.first, weak = !!r && (!r.assign[i27] || apTired(27));
  const rested = weak ? AP_ROTA.people.find(p => { const a = r.assign.slice(); a[i27] = null; return p.id !== r.assign[i27] && a[i27 - 1] !== p.id && rotaFits(AP_ROTA, a, i27, p); }) : null;
  const signOpts = rested ? [{label: 'Swap Night 27 to ' + rested.name.split(' ')[0] + ': rested, for 3 more overtime hours', meta: {good: true, k: 'swap'}}, {label: 'Sign it as it stands: Night 27 is in the rota', meta: {good: false, k: 'keep'}}] : [{label: 'Sign it', meta: {good: true, k: 'sign'}}];
  const night = 'Night 27 (Saturday to Sunday): ' + (apLead(27) || 'nobody') + (apTired(27) ? ', a third night or more in a row: a thin first look on any call' : '');
  const k = await UI.openModal('The weekend · the plan', '<ul><li>' + esc(night) + '</li></ul><ul>' + AP_COVER.map(fc).join('') + '</ul>' + (r ? rotaTable(AP_ROTA, r.assign) : '') + '<p class="small">Saturday 19:00–07:00: Night 27’s lead on site as the on-call (on call from 18:00 under the rota; the rota costs that night as its call-out when it happens, so it isn’t in this forecast). Sunday 07:00–19:00: a lead who wasn’t on call Saturday night. Written handovers at 19:00 and 07:00. The firm’s retainer hours for the forensic work. Dario’s hours are Joanna’s to set; the front desk’s are Callum’s. (game)</p>',
    signOpts, {shuffle: !!rested, closable: false, cls: 'drill'});
  c.cover.n27 = signOpts[k].meta.k;
  if (c.cover.n27 === 'swap') {
    r.assign[i27] = rested.id; r.stats = rotaStats(AP_ROTA, r.assign);
    c.cover.overtime += 3; c.cover.variance = Math.round((c.cover.overtime - AP_ROTA.budget) / AP_ROTA.budget * 100);
    await say('Night 27 goes to ' + rested.name + ', rested. Three more overtime hours in the forecast, and a clear head on site tonight. (game)');
  } else if (c.cover.n27 === 'keep') await say('Night 27 is the night after the attack. ' + (r.assign[i27] ? 'A third night running makes a thin first look' : 'Nobody on call means nobody for the Compact') + ': that is the night the rota exists to make well. Signed as it stands. (game)');
  unlock('act', 'apweekend'); unlock('act', 'crcover');
}
async function apBoss() {
  const c = apC();
  c.boss = {first: []};
  if (apMgr()) {
    await say('07:40: Lise opened the front desk. A ransom note on the PC, and Plinthwise won’t open. 07:48: I put the desk on paper. It’s my terminal today. Joanna’s off; I’ll tell her.', 'Callum Breck');
    await say('(Pulse Badge: the paper fallback and its owner, the manager on duty, were named on the plan’s page. Relay Badge: its measured switch time was there too, 11 minutes from Thursday’s practice. game)');
    let mins = AP_ACT_OK;
    while (true) {
      const items = AP_ACTIVATE.map(o => ({label: o.label, meta: {good: !!o.good}}));
      const i = await UI.openModal('The annex’s test · 07:55', '<p>A ransom note on the front-desk PC and Plinthwise won’t open. The airfield’s own systems are separate and working. Are the Airport annex’s criteria met?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      mins += AP_ACT_LATE;
      await say(AP_ACTIVATE[i].why + ' (+' + AP_ACT_LATE + ' game minutes)');
    }
    c.activate = mins; G.cr.activate = mins; track();
    const call = 7 * 60 + 58 + (mins - AP_ACT_OK), ack = call + AP_ACT_OK, eng = Math.max(8 * 60 + 20, ack + 5);
    await say(apHm(call) + ' retainer line called · ' + apHm(ack) + ' Tallowmere acknowledges. Ansel Whitcombe engages the firm at ' + apHm(eng) + ' under a letter, and tells the Authority’s insurer at ' + apHm(Math.max(8 * 60 + 40, eng + 20)) + '. (game)');
    const S = apMgrBossStages();
    await apStages(S, ['s1']);
    await say('08:05: Dario cuts the office network off from the internet and from the tenants’ ports, Callum’s OK on the time, hosts left running. 08:10: ap-admin disabled, clearing nothing. 08:30: Callum and Odette ring each tenant on its contact from Friday’s list: the shared network is cut from their offices; their own systems are theirs to check; the firm can help only if a tenant asks. 08:40: the firm captures memory from AP-OF-03, AP-BIL-01 and AP-DC-01, running and cut off. (game)');
    await say('09:00: Callum tells Joanna; Joanna tells Rhoswen Adair, the Board’s chair. 09:15: Odette tells Plinthwise under §9 (Slate Badge: on the contact page). 09:30: with Ansel’s agreement, you tell the FBI contact on the plan’s page. 11:00, the firm, through Ansel: the office systems encrypted from AP-OF-03; AP-DC-01 not encrypted; the tenant records exported at 04:28 and 1.4 GB sent out at 04:31 to 05:02. (game)');
    await apStages(S, ['s2']);
    await say('12:30: Callum, Joanna and Rhoswen heard what is known, what isn’t, and 16:00 for the next update. What tenants are told about their records is Ansel’s decision; any payment would be the Board’s, with Ansel and the insurer. Nobody has asked for one today. (game)');
    await apStages(S, ['s3']);
    await apPlanWeekend();
    await say('Signed. 16:00: the next update, as promised. (game)');
  } else {
    const cu = apCustody();
    await say('Ransomware on the office network. Ansel extended our engagement at 08:20 under a second letter, AIR-02: what did it reach? Did tenant records leave? What can’t the evidence say yet? Tenants’ PCs stay outside it. Your case.', 'Lucia Ferrand');
    await say('What we know: 07:40, a ransom note on the front-desk PC, and Plinthwise won’t open. 07:48: Callum, the duty manager, put the desk on paper. 08:05: Dario cut the office network off from the internet and from the tenants’ ports, Callum’s OK on the time, hosts left running. 08:10: ap-admin disabled, clearing nothing. With Ansel’s agreement, the acting team lead will tell the FBI contact on the plan’s page at 09:30. (game)', 'Lucia Ferrand');
    const S = apDfirBossStages();
    await apStages(S, ['s1']);
    await say('08:40: A-14, AP-OF-03’s memory. 08:50: A-15, AP-BIL-01’s. 09:00: A-16, AP-DC-01’s, and a snapshot of its directory database (Pulse Badge: memory before any shutdown). 09:20: A-17, the EDR’s file events, 04:00 to 08:00. 09:30: A-18, Plinthwise’s audit as forwarded to the Compact’s platform, handed over by the Compact’s day lead with its collection hash (Bookmark Badge). 09:40: A-19, the flows since midnight. 10:00: A-20, the ransom note and twenty encrypted samples. 12:00: A-21, AP-OF-03’s disk. The 01:00 nightly copy named first and left untouched (Relay Badge). All hashed, sealed. (game)');
    cu.items += 8; cu.complete += 8;
    await apStages(S, ['s2']);
    await say('13:10: the finding to Ansel; with his agreement, to Joanna, Odette and Callum. (game)');
    const r = await doReport(AP_REPORT_2);
    G.cr.reports.ap2 = {score: r.score, over: r.over, under: r.under};
    G.cr.corrected += r.over;
    await say('15:30: AIR-02 to Ansel. 16:00: with his agreement, the FBI contact has the findings. Plinthwise’s way back runs tomorrow: Dario, with the vendor on a one-time account with MFA, us watching, and the nightly copy checked in isolation before it is used. (game)');
  }
  c.boss.ok = c.boss.first.every(Boolean); c.boss.done = true;
  G.f.apBoss = true; unlock('tech', 'T1486'); unlock('act', 'apcopy'); unlock('act', 'appaper'); touchCSF('Respond'); touchCSF('Recover'); track();
  await UI.openModal('Saturday, as counted', '<p>The front desk on paper from <b>07:48</b>, every payment on a paper receipt. The office network cut off at 08:05; the tenants rung by 08:30. The airfield’s own systems separate and not affected. (game)</p>', [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  if (apMgr()) await say('19:00: Lucia has the firm’s status report for you in the meeting room.', 'Callum Breck');
  else await say('End the day when you’re ready. Tomorrow, the rebuild.', 'Lucia Ferrand');
}

/* ---------- Manager: the firm's status report (and the Quiet Thread clue) ---------- */
async function apStatusReport() {
  const who = 'Lucia Ferrand';
  const body = '<pre class="art">Tallowmere · status · AIR-02 · Day 27 19:00 (game)\n' +
    'Found       AP-FS-01, AP-BIL-01, both front-desk PCs and\n' +
    '            the four office PCs encrypted 05:52–06:20,\n' +
    '            from AP-OF-03 under ap-admin; AP-DC-01 not\n' +
    '            encrypted; the tenant records table exported\n' +
    '            04:28; 1.4 GB out 04:31–05:02\n' +
    'Likely      tenant records left the network\n' +
    'Open        how ap-admin was got; MS-PC-01 (the\n' +
    '            tenant’s); whether anything is published;\n' +
    '            Wednesday’s attempts on pw-support\n' +
    'Evidence    hashed, sealed\n' +
    'Report      to Ansel Whitcombe\n' +
    'Appendix    one observation outside the airport’s\n' +
    '            questions, not yet explained, passed to\n' +
    '            counsel first: it touches the suspicion file</pre>';
  await say('The status, as promised. The report itself goes to Ansel; this is yours.', who);
  await UI.openModal('The firm’s status report', body, [{label: 'Back', meta: {good: true}}], {closable: false, cls: 'drill'});
  if (!qtFound('ap-accounts')) {
    const i = await choose('The appendix: an observation not yet explained.', [{label: 'Read the appendix'}, {label: 'Leave it: it’s with Ansel'}], {cursor: 1});
    if (i === 0) {
      await say('Appendix: reading AP-DC-01’s directory query log today for ap-admin’s use, the firm saw one query at 03:13 last Monday: svc-print, a town account, from FD-STAFF-11’s address (Town Hall’s front-desk PC), over the Compact’s link and through the airport directory’s trust with the town’s, listing the airport’s accounts. 214 entries, names only; nothing changed. Nothing links it to the email, the vendor’s sign-ins or today. Passed to counsel; with his agreement, to Rae’s suspicion-file team. Not acted on.');
      await say('Nothing changes on svc-print without a plan. You pass it to Rae, through Ansel.');
      await crQtAfterNote(qtNote('ap-accounts'));
    }
  }
  G.f.apStatus = true; unlock('act', 'apstatus'); touchCSF('Respond'); track();
  await say('End the day when you’re ready. The desk stays on paper tonight; tomorrow, the rebuild.', who);
}

/* ---------- Scorecard extra and the end-of-district summary ---------- */
function apScoreHtml() {
  if (!G.trackId || !G.f.apMet) return '';
  const c = G.cr, s = c.ap || {};
  if (apMgr()) return '<p>Regional Airport: retainer ' + (s.activate !== null && s.activate !== undefined ? '<b>' + s.activate + ' min</b>' : 'not called') + ' · tabletop ' + (G.f.apTabletop ? '<b>run</b>' : 'not yet') + ' · weekend plan ' + (s.cover ? '<b>' + esc(s.cover.k) + '</b>' : 'not set') + ' (game)</p>';
  return '<p>Regional Airport: requests logged <b>' + (s.requests ? esc(s.requests.date) : 'not yet') + '</b> · reports filed <b>' + ['ap1', 'ap2'].filter(k => c.reports[k]).length + '</b> (game)</p>';
}
function apDrillRows() {
  const keys = apMgr() ? ['mailmgr', 'vendmgr', 'tenantmgr'] : ['maildfir', 'venddfir', 'lastdfir'];
  return keys.map(k => { const d = G.cr.drills[k]; return '<tr><td>' + esc(AP_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function apSummary() {
  const f = G.f, c = apC(), t = G.trackId;
  if (!f.apSummary) {
    f.apSummary = true; touchCSF('Govern');
    Series.markEdition('crossroads', {track: t, airport: true});
    await say((t === 'manager' ? 'We kept the terminal working on paper, told every tenant what we knew and nothing we didn’t, and came back on a copy somebody checked first. ' : 'I know what was encrypted, what likely left, and what nobody can say yet, and I can tell the tenants without guessing. ') + 'And I know whose each thing is on this network. Thank you.', 'Joanna Ferreday');
  }
  const body = '<p class="big">Regional Airport: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (AP_DAY[G.day] || '') + ')</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + apDrillRows() + '</table>' +
    (t === 'dfir' ? '<p>Reports filed: AIR-01 <b>' + (G.cr.reports.ap1 ? G.cr.reports.ap1.score : '—') + '</b> · AIR-02 <b>' + (G.cr.reports.ap2 ? G.cr.reports.ap2.score : '—') + '</b> (game)</p>' : '') +
    '<p>Saturday: ' + (c.boss && c.boss.ok ? 'handled at the first try from your seat' : 'handled, with false starts the debriefs named') + '. The front desk on paper from 07:48 Saturday to 08:00 Monday, 64 receipts entered and checked; the airfield’s own systems separate and not affected (game). ' + (t === 'manager' ? 'Coordinated: Callum ran the terminal, Dario cut the office off, Odette dealt with the vendor, Ansel decided what tenants were told, each tenant decided about its own PCs, and nobody promised what nobody knew.' : 'Found: the office encrypted from one PC under one account; tenant records likely copied out; the tenant’s PC and the way in written as unknown.') + '</p>' +
    '<p>Lesson (game): one office PC, under one account with admin rights everywhere, reached every office system across a network the tenants shared. The airport kept working on paper because the paper had been practised, and Plinthwise came back from a copy that was checked before it was trusted.</p>' +
    (t === 'manager' ? '<p>Bookmark Badge: the AAR’s actions arrived with their owners agreed. Slate Badge: Plinthwise’s incident clause was on the contact page. Pulse Badge: the paper fallback and its owner were named. Relay Badge: its switch time was measured before Saturday.</p>' : '') +
    '<p>Open risk (game): the airport’s directory trusts the town’s, set up so the Compact’s admins can sign in, so every town account can list the airport’s accounts' + (qtFound('ap-accounts') ? ' (svc-print among them)' : '') + '. Nobody has accepted that risk; it goes to Rae and the council’s risk committee for an owner.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: svc-print, the 03:00 pattern' + (qtFound('lb-rdp') ? ', a remote-desktop sign-in on the Library’s server' : '') + (qtFound('sd-probe') ? ', pings to eleven of the district’s addresses' : '') + (qtFound('cn-folders') ? ', a listing of the clinic’s Facilities share' : '') + (qtFound('dp-conns') ? ', a listing of the dispatch collector’s connections' : '') + (qtFound('ap-accounts') ? ', and now a listing of the airport directory’s accounts' : '') + '. It continues.</p>') +
    '<p class="big">Next: the Compact-wide incident.</p>';
  while (true) {
    const i = await UI.openModal('End of the Regional Airport', body, [{label: 'Keep exploring the airport', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
