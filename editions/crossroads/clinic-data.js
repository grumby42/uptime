/* ============================================================
   UPTIME · editions/crossroads/clinic-data.js
   Crossroads district 3: the Community Clinic (both tracks). Art, map, people,
   the manager track's tables (the Clinic annex's retainer test, the downtime
   decision, the weekend plan, the AAR, the tabletop on a three-day outage), the
   DFIR track's tables (the scoping letter, containment that preserves, evidence
   intake), three drills per track, two reports, the directive, the Clinic Board,
   the two dojos, the boss's stages for each seat, and Field Manual text.
   One decider per decision (game): Marisol Quintero, the practice manager,
   decides the clinic's operations (downtime, restores, staffing, how the exam
   rooms sign in, the vendor contract); Tomasz Weller, the privacy officer,
   decides patient-privacy questions (what patients are told, any notice, what is
   reported, and the privacy risk the clinic accepts, such as the exam rooms'
   shared login until it goes), with counsel; Renata Osei, counsel for the Clinic, engages the firm,
   decides who receives its reports and handles privilege and the law; the Clinic
   Board decides any payment, with counsel and the insurer; clinicians decide care.
   The game never says whether HIPAA applies to the clinic, names no deadline and
   says nothing about what must be reported: HHS is quoted only in its own words
   (Field Manual). Patient data stays generic (names, contact details, appointment
   times, a visit-reason field): no diagnoses. Wrenfold, Wrenfold Health Software,
   Tetherline, the clinic, its people, hosts, counts, times and the attack are
   invented (game). Addresses: RFC 5737 only. Domains: RFC 2606 only. Real facts:
   CREDITS.md, section "Crossroads". Timeline: scratchpad crossroads-timeline.md
   (Community Clinic section); every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  cnDesk: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  cnDeskOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  cnRack: ['#1b2233', '#3a3a3a', '#7a7a7a', '#d7dbe4'],
  cnRackOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  cnExam: ['#1b2233', '#1f5a8a', '#7fa2d6', '#dbeaf7'],
  cnCart: ['#1b2233', '#6e2a2a', '#c05a5a', '#f2d7d7'],
  cnCartOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  marisol: ['#1a1a2e', '#2b1d16', '#c98a54', '#7a3d3d'],
  weller: ['#1a1a2e', '#8c8c8c', '#f0c8a0', '#2a3a6e'],
  osei: ['#1a1a2e', '#141414', '#6e4a2c', '#4a2a5a'],
  kit: ['#1a1a2e', '#3b2418', '#e0b090', '#2f6e3e'],
  okonjo: ['#1a1a2e', '#141414', '#8a5a3a', '#e0a030'],
  vidal: ['#1a1a2e', '#3a1d10', '#c98a54', '#3a8a8a'],
  ruiz: ['#1a1a2e', '#5b3a26', '#f2c7a0', '#8a3a6e'],
  kowal: ['#1a1a2e', '#d7dbe4', '#f0c8a0', '#2a5a3a']
});
Object.assign(TILES, {
  'Ð': {spr: 'counter', pal: 'cnDesk', solid: true, under: ','},   // the front desk (check-in)
  'ŋ': {spr: 'pc', pal: 'cnExam', solid: true, under: ','},        // the exam-room PCs (one shared login)
  'Ħ': {spr: 'K', pal: 'cnRack', solid: true},                     // the server closet: WF-01 and CL-FS-01
  'Ŋ': {spr: 'K', pal: 'cnCart', solid: true}                      // the downtime cart (paper forms)
});

/* ---------- Map: the clinic and the Clinic Board room ---------- */
// East door from the town square. North: two exam rooms, the server closet, the training room (dojo). Middle: the front
// desk, the waiting area, the downtime cart. South: the practice manager's office, the privacy office, the incident room
// (the table and the evidence locker), the staff room (the desk). West door: the Clinic Board room.
Object.assign(MAPS, {
  clinic: {
    name: 'Quillfield Community Clinic',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,ŋ,,,w,ŋ,,,w,Ħ,Ħ,,w¤,¤,¤,,,,w",
      "w,,,,,w,,,,,w,,,,,,w,,,,,,,,,w",
      "w,,,,,w,,,,,w,,,,,,w,,,,,,,,,w",
      "w,,,,,w,,,,,w,,,,,,w,,,,,,,,,w",
      "www,wwwww,wwwww,wwwwwwww,wwwww",
      "w,,,,,,,,,,ÐÐÐ,,Ŋ,,,,,,,,,,,,w",
      "E,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwww,wwwwwwww,wwwwww,wwwww,www",
      "w,,,,,,,,,w,,,,,w,,,,,,,w,,,,w",
      "w,,,,,,,,,w,,,,,w,,§§,,,w,,,,w",
      "w,,,,,,,,,w,,,,,w,,,,,£,w,,Y,w",
      "w,,,,,,,,,w,,,,,w,,,,,,,w,,,,w",
      "w,,,,,,,,,w,,,,,w,,,,,,,w,,,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'29,7': {to: 'csquare', x: 1, y: 5, dir: 'right'}, '0,7': {to: 'cnboard', x: 16, y: 5, dir: 'left'}}
  },
  cnboard: {
    name: 'The Clinic Board room',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w±±,,,,,,,,,,,,±±w",
      "w±±,,,,,,,,,,,,±±w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'17,5': {to: 'clinic', x: 1, y: 7, dir: 'right'}}
  }
});
const CN_MAPS = ['clinic', 'cnboard'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'marisol', name: 'Marisol Quintero', role: 'practice manager', map: 'clinic', x: 3, y: 12, dir: 'right', pal: 'marisol'},
  {id: 'weller', name: 'Tomasz Weller', role: 'privacy officer', map: 'clinic', x: 13, y: 12, dir: 'left', pal: 'weller'},
  {id: 'osei', name: 'Renata Osei', role: 'counsel for the Clinic', map: 'clinic', x: 18, y: 13, dir: 'up', pal: 'osei'},
  {id: 'kit', name: 'Kit Ambrose', role: 'the Compact’s field technician for the clinic', map: 'clinic', x: 17, y: 3, dir: 'left', pal: 'kit'},
  {id: 'okonjo', name: 'Joy Okonjo', role: 'front desk lead', map: 'clinic', x: 12, y: 7, dir: 'down', pal: 'okonjo'},
  {id: 'vidal', name: 'Ines Vidal', role: 'nurse lead', map: 'clinic', x: 9, y: 3, dir: 'left', pal: 'vidal'},
  {id: 'ruiz', name: 'Bettina Ruiz', role: 'clinical educator', map: 'clinic', x: 26, y: 3, dir: 'left', pal: 'ruiz'},
  {id: 'luciacn', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'clinic', x: 22, y: 13, dir: 'left', pal: 'lucia', cond: G => G.trackId === 'dfir' || !!G.f.cnBoss},
  {id: 'theocn', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'clinic', x: 18, y: 10, dir: 'down', pal: 'theo', cond: G => G.trackId === 'dfir'},
  {id: 'kowal', name: 'Harriet Kowal', role: 'chair of the Clinic Board', map: 'cnboard', x: 8, y: 3, dir: 'down', pal: 'kowal'}
);
const CN_NPC_IDS = ['marisol', 'weller', 'osei', 'kit', 'okonjo', 'vidal', 'ruiz', 'luciacn', 'theocn', 'kowal'];

/* ---------- Manager: the Clinic annex's retainer test (Day 12 07:35) ---------- */
const CN_ACTIVATE = [
  {label: 'Met: ransomware on a clinic PC and patient lists on the share. Call the firm now', good: true},
  {label: 'Not yet: count how many PCs are encrypted first, then call the firm with a sure number', why: 'The annex says found on any clinic system. Waiting for a count is how the call comes an hour late.'},
  {label: 'Not met: no patient record is shown to be touched yet. For now it is an IT outage for the technician', why: 'Ransomware found on a clinic system meets the annex on its own, and S: holds patient lists, so patient information may have been reached.'},
  {label: 'Marisol decides when the firm comes in, and she can phone it herself once the clinic is open', why: 'The retainer is the Compact’s and its annex says when it is called. You make the call, and Marisol and counsel are told at once.'},
  {label: 'Met, and more: the firm, the FBI and every patient on the lists, all called before the doors open', why: 'The annex calls the firm. What patients are told is Weller’s decision with counsel, on facts nobody has yet, and law enforcement is contacted with Renata’s agreement.'}];
const CN_ACT_OK = 15, CN_ACT_LATE = 20;   // game minutes

/* ---------- Manager: the downtime decision (Day 12 07:45, with the practice manager) ---------- */
const CN_DOWNTIME = [
  {label: 'Marisol decides now: paper wherever a PC shows the note, and patients seen as booked', good: true},
  {label: 'Shut Wrenfold and the clinic’s PCs down and go to paper before the 08:00 patients, to be sure', why: 'Nothing points at WF-01, and no paper is out yet. Switching the records off mid-clinic puts care at risk. Contain what is hit and keep care going.'},
  {label: 'Open as normal on the other two front-desk PCs: only one of them shows any encrypted files', why: 'They show the note too, and nobody has checked them yet. Paper wherever a PC shows the note, until it is cleared.'},
  {label: 'You decide the clinic’s downtime yourself: during an incident the IR manager runs operations', why: 'You advise. Running the clinic, paper or not, is Marisol’s decision, and clinicians decide care.'}];

/* ---------- Manager: the weekend plan (Day 12 15:30; rota/budget forecast, game) ---------- */
const CN_COVER = [
  {label: 'Two 12-hour day shifts, rota leads for each of the nights, a threshold Marisol signs', good: true, k: 'shifts', gaps: 0, overtime: 26},
  {label: 'The whole team in until it’s fixed: the clinic needs as many hands as it can get', k: 'all', gaps: 0, overtime: 58, why: 'Thirty-hour stretches make slow, thin calls by Sunday, and nobody is fresh on Monday. Forecast: 58 overtime hours against 30.'},
  {label: 'You and the technician cover it between you, day and night, with no handover to lose things in', k: 'two', gaps: 0, overtime: 44, why: 'Two people, no rest, and one of them is the only person who can rebuild the PCs. Forecast: 44 hours, and nobody sleeps.'},
  {label: 'Marisol runs Saturday’s four hours on paper alone, and everyone else stands down until Monday', k: 'none', gaps: 48, overtime: 9, why: 'Saturday’s paper clinic would have no IT cover, the share’s restore would wait, and a page about clinic data would go unanswered. Forecast: 48 hours uncovered.'},
  {label: 'The night lead also works Saturday’s day shift, to keep the picture in one head', k: 'double', gaps: 0, overtime: 31, why: 'Twelve hours on call, then twelve more: a 24-hour stretch is the tired call the rota exists to prevent.'}];

/* ---------- Manager: the AAR (Day 15 09:00; blameless; owners arrive assigned under the Library Board's rule: Bookmark Badge) ---------- */
const CN_FACTORS = [
  {id: 'console', name: 'A console nobody watched', csf: 'Detect', text: 'The clinic’s night alerts went to its own console. The 05:33 alert sat unread until 07:40.', good: true},
  {id: 'scans', name: 'One PC could reach the share', csf: 'Protect', text: 'Attachments went to a Scans folder every front-desk PC could write, so one PC could encrypt the shared files.', good: true},
  {id: 'lists', name: 'Old lists kept', csf: 'Identify', text: '90 days of daily lists and a recall list with 1,180 inactive patients sat on that share.', good: true},
  {id: 'binder', name: 'An unopened binder', csf: 'Recover', text: 'The downtime binder’s call tree named two people who had left, with no step for paper back-entry.', good: true},
  {id: 'user', name: 'User error', csf: 'Protect', text: 'Root cause: a front-desk clerk opened an attachment they should have known was a trap, and that is where it stops.'},
  {id: 'vendor', name: 'The vendor’s agent', csf: 'Protect', text: 'Wrenfold’s Tetherline agent, on day and night, let the attacker in to the clinic.'},
  {id: 'backup', name: 'A failed backup', csf: 'Recover', text: 'The nightly backup failed, and the share couldn’t be restored from it.'}];
const CN_AAR = [
  {id: 'route', name: 'Night alerts to the Compact’s on-call', owner: 'the Compact’s on-call (you)',
   dates: [{label: 'Day 12 at 15:30: done with the weekend plan', good: true},
           {label: 'As soon as possible', why: 'A date nobody can check. It was done on Friday with the weekend plan: write that.'},
           {label: 'When the budget allows', why: 'Routing costs nothing to buy. Friday, with the plan.'},
           {label: 'Day 30, a Tuesday, once the night post is filled: until then the cover is too thin', why: 'The post may take months. The rota covers the clinic now: Friday.'}]},
  {id: 'lists', name: 'Daily lists kept 7 days; the recall list inside Wrenfold', owner: 'Marisol Quintero',
   dates: [{label: 'Day 19, Friday next week', good: true},
           {label: 'As soon as possible', why: 'An action without a date doesn’t close. Day 19.'},
           {label: 'When the budget allows', why: 'Nothing to buy: Kit changes the job and the folder. Day 19.'},
           {label: 'Day 90, after the next Board meeting', why: 'The lists are what likely left. Three months is too long for a change with nothing to buy: Day 19.'}]},
  {id: 'tether', name: 'Tetherline on demand only, from the vendor’s range, with MFA', owner: 'Marisol Quintero, with Wrenfold Health Software',
   dates: [{label: 'Day 22, in the vendor’s change window after next week', good: true},
           {label: 'As soon as possible', why: 'The vendor needs a date to plan the change. Day 22.'},
           {label: 'When the budget allows', why: 'It is a setting and a contract letter, not a purchase. Day 22.'},
           {label: 'Day 16, Tuesday: tomorrow, before the vendor can plan it', why: 'Drill B found no session, and the vendor needs a change window to plan the change: rushing it could cut the support you need. Day 22.'}]}];

/* ---------- Manager: the tabletop, "Wrenfold down for three days" (Day 15 11:00; CISA CTEP-style) ---------- */
const CN_OBJECTIVE = [
  {label: 'Find the gaps of the downtime procedure before a real outage does', good: true},
  {label: 'Be sure how fast Wrenfold Health Software can restore the system once called', why: 'The vendor’s speed is its own matter. The exercise is for the clinic’s side: what staff do for three days.'},
  {label: 'Rehearse last weekend’s ransomware again, while the steps are fresh in people’s minds', why: 'The AAR has done that. A three-day outage tests a different plan: running care on paper.'},
  {label: 'Read CTEP’s ransomware scenario word for word, and nobody can say it was made up', why: 'CTEP gives templates, not this clinic’s plan. Use them for the clinic’s own outage.'}];
const CN_INJECTS = [
  {t: 'Day 1, 07:30 (exercise): Wrenfold won’t start. The vendor says up to three days. Who decides, and what first?',
   opts: [{label: 'Marisol calls downtime now: cart forms, and Ines Vidal’s clinicians decide which patients are seen on paper', good: true},
          {label: 'Cancel the appointments until it is back: nobody seen without a record on screen', why: 'Cancelling everything is the harm. Clinicians decide visit by visit, and the paper procedure exists so care goes on.'},
          {label: 'Keep seeing patients, and put the paper forms aside until Wrenfold is back up', why: 'Care without a record is how mistakes follow patients. Paper forms, every visit.'},
          {label: 'Weller decides: patient records are involved, and the privacy officer runs the clinic through an outage', why: 'Weller decides privacy questions. Running the clinic on paper is Marisol’s operations call.'}]},
  {t: 'Day 2, 10:00 (exercise): a patient asks the front desk whether her records are safe while the system is down.',
   opts: [{label: 'What is known, from Weller’s agreed script: no promises, and Weller follows up each patient', good: true},
          {label: 'Tell her they are completely safe: an outage isn’t a breach, and she needn’t worry about her records', why: 'A promise the desk can’t check. Say what is known; Weller decides what patients are told.'},
          {label: 'Send her to Renata Osei, who as counsel decides what any patient may be told', why: 'Weller decides what patients are told, with counsel. Renata doesn’t take patients’ questions: the desk answers from the agreed script.'},
          {label: 'Read her the vendor’s status email as a script, word for word: she hears it from the source', why: 'A vendor’s status email isn’t written for patients. Use the script.'}]},
  {t: 'Day 3, 16:00 (exercise): Wrenfold is back, with three days of paper to enter. Who, and in what order?',
   opts: [{label: 'Ines Vidal’s team, next visits first, so a second person reads back', good: true},
          {label: 'Whoever is free enters the paper tonight, in any order, to be finished by the morning', why: 'Tired people entering three days at speed make the errors that follow patients. A set order and a check.'},
          {label: 'The technician enters the forms: he knows Wrenfold best, and it is a data job', why: 'Kit runs the systems, not the clinical record. Ines Vidal’s team knows what the paper means.'},
          {label: 'Scan the paper and attach it to each patient instead of entering anything', why: 'A scan nobody reads isn’t in the record. Enter it, and check it.'}]}];
const CN_EX_ACTIONS = 3;

/* ---------- The directive (game): keep the shared exam-room login ---------- */
const CN_DIRECTIVE = {
  manager: [
    {label: 'A daily sign-in, then a badge or PIN per PC, two rooms first: Marisol runs it, Weller rules on privacy', good: true},
    {label: 'Keep the shared login as it is: patients come first, and no harm is shown in the exam rooms', why: 'Nothing went wrong that anyone can see: with one shared account, nobody can say who viewed what there.'},
    {label: 'Full password sign-in at each exam PC for each visit, from today, with no exceptions for anyone, clinicians included', why: 'It slows every visit, and staff will find a way round it. Fast re-authentication keeps both.'},
    {label: 'Weller decides alone how the exam rooms sign in: it touches patient records, so it is his', why: 'How the rooms run is Marisol’s decision. The privacy risk until the change is in is Weller’s, with counsel: two decisions, two deciders.'}],
  dfir: [
    {label: 'The fact: named desks could be answered, the exam rooms can’t. Then the options, for her and for Weller', good: true},
    {label: 'Tell her the report requires named logins in each room from today: Marisol must comply', why: 'A report recommends. The practice manager decides, knowing what the case showed.'},
    {label: 'Say the login is outside the letter counsel signed, and tell her no more', why: 'Renata has agreed the facts can be shared. Silence leaves her deciding blind.'},
    {label: 'Tell her, and the privacy officer, that the shared login caused the ransomware, so it must go', why: 'It didn’t: the attack came through a front-desk PC. Its cost is that nobody can say who viewed what in the exam rooms.'}]};

/* ---------- DFIR D1: the scoping letter (game) ---------- */
const CN_LETTER = [
  {label: 'Confirm the questions, then capture today what could be lost: memory, disk, then the firewall’s records', good: true},
  {label: 'Restore the share from last night’s backup first, then seal what is left and start the case', why: 'A restore before preservation can overwrite the evidence, and last night’s copy may carry the way in. Preserve first.'},
  {label: 'Image each PC in the clinic and hash it before reading the letter, in case the questions turn out wider', why: 'Collection follows the questions. Eleven images before a question is scope by worry.'},
  {label: 'Ask Weller and counsel to write to the patients today, before anything is known, to get ahead of it', why: 'What patients are told is Weller’s decision, with counsel, on facts the firm hasn’t found yet.'}];

/* ---------- DFIR D2: containment that preserves ---------- */
const CN_CONTAIN = [
  {label: 'Memory now, then shut it down and image the disk, hash both, snapshot the share, restore nothing yet', good: true},
  {label: 'Power CL-FD-02 off now and image the disk: memory changes too fast to be worth the wait', why: 'Memory holds what the disk doesn’t: the running loader, its connections, keys. It is isolated and running, so capture it first.'},
  {label: 'Reimage CL-FD-02 now and give the front desk its PC back: the share holds the rest', why: 'Wiping first destroys the record of how it got in and what it took. Preserve, then rebuild.'},
  {label: 'Reconnect CL-FD-02 for a few minutes to pull the rest of its logs, hashed as they arrive, then isolate it again', why: 'That reopens a path for whatever is running on it. The EDR’s console link is enough. Capture memory where it is.'}];

/* ---------- DFIR D3: evidence intake (the clinic's store, case CLN) ---------- */
const CN_INTAKE = {
  c01: {id: 'C-01', what: 'CL-FD-02 memory capture', form: 'Captured 08:35 by Kit Ambrose under the firm’s instruction; SHA-256 at collection recorded (Bookmark Badge).',
    opts: [{label: 'Check the hash on receipt against the collection hash, log the handover, seal it, work on a copy', good: true},
           {label: 'Compare the hashes, log the handover, then analyse it straight from Kit’s drive: copying that size takes too long', why: 'Work on a copy, always. The original stays sealed.'},
           {label: 'Skip the hash comparison on a file the technician captured under our instruction an hour ago', why: 'The check is about the file, not Kit. Compare the hashes for every item.'},
           {label: 'Seal it in the School District’s locker: it has room, and the cases run side by side', why: 'One store per client. The clinic’s evidence stays in the clinic’s store.'}]},
  c02: {id: 'C-02', what: 'CL-FD-02 disk image', form: 'Imaged 09:10–09:50 by Kit Ambrose with a write blocker; SHA-256 at collection recorded (Bookmark Badge).',
    opts: [{label: 'As each item: compare the hashes, log Kit’s handover, seal the original, and use only a copy', good: true},
           {label: 'Compare the hashes and log Kit’s handover, then mount the original read-write to recover deleted files faster', why: 'Writing to the original changes it. Copy it, and work on the copy.'},
           {label: 'Log it once the analysis is done: the log then shows only what turned out useful', why: 'The log records what was received and when, before anyone reads it.'},
           {label: 'Give the image back for the rebuild: it is the most recent copy of the PC', why: 'Evidence isn’t a rebuild source. Kit rebuilds from a clean image.'}]},
  c03: {id: 'C-03', what: 'EDR telemetry, every clinic host, Day 11 12:00 to Day 12 07:30', form: 'Exported 09:00 by Kit Ambrose from the EDR console; SHA-256 at export recorded.',
    opts: [{label: 'Hash it on receipt against the export record, log it, seal it, read a copy', good: true},
           {label: 'Read the console’s live log instead: it is the same telemetry, and more up to date', why: 'The console rolls on and changes. The export is the fixed record.'},
           {label: 'Keep only CL-FD-02’s rows of the export: the others weren’t encrypted', why: 'Which hosts were hit is question 1. Keep the whole export as it was handed over.'},
           {label: 'Seal it, and send a hashed copy to the EDR vendor for its analysts, telling counsel after', why: 'Who sees the clinic’s evidence goes through Renata. Ask her first.'}]},
  c04: {id: 'C-04', what: 'CL-FS-01 share audit and snapshot', form: 'Snapshot and audit exported 09:20 by Kit Ambrose, before any restore; SHA-256 recorded for both.',
    opts: [{label: 'Log both as handed over, compared with the export record: the audit records which session wrote each file', good: true},
           {label: 'Delete the 214 notes from the snapshot, then seal both: staff won’t open them by mistake', why: 'Editing the snapshot changes the evidence. Seal it as it was.'},
           {label: 'Trust the snapshot alone: the audit’s session records only repeat what the files show', why: 'The audit says which session wrote each file. The files can’t.'},
           {label: 'Restore the share from the snapshot now, then log what is left', why: 'Restoring from evidence uses it up. The restore comes from the backup, later.'}]},
  c05: {id: 'C-05', what: 'CL-FW firewall log, Day 11 12:00 to Day 12 07:30', form: 'Exported 09:05 by Kit Ambrose to a USB stick; SHA-256 at export recorded. The stick went to Marisol’s office before it reached the firm at 09:50; the form doesn’t say so.',
    opts: [{label: 'Record the unlogged handover as a gap: hash on receipt, compare, keep both records', good: true, gap: true},
           {label: 'The hashes match: log the handover as complete. An unchanged file is what a custody record exists to show', why: 'Matching hashes say the file is unchanged. They don’t fill a handover nobody recorded. Write the gap.'},
           {label: 'Add Marisol to Kit’s form yourself: then both records agree', why: 'That makes his form say something he didn’t record. A gap is written as a gap.'},
           {label: 'Discard it and work without the firewall log: a broken chain can’t be used', why: 'The log answers what left, and the hashes match. Keep it, with the gap written down.'}]}
};
const CN_INTAKE_VENDOR = {id: 'C-08', what: 'Wrenfold Health Software’s written confirmation', form: 'Email from its support manager, 13:25 Day 12, on the escalation contact in §8 of the contract; received with headers. Kit’s call to that §8 number came first, at 13:10.',
  opts: [{label: 'Log the email with headers as the item, hashed, and note the call as what it was', good: true},
         {label: 'Log the call as the item: a support manager’s word on the phone is more certain than an email', why: 'A call leaves no record to hash. Log the email; note the call with its time, number and caller.'},
         {label: 'Ask the vendor to send it again as a PDF on letterhead, and discard the email', why: 'The email as received, with headers, is the original. A later PDF is a copy.'},
         {label: 'Don’t log it: the vendor’s word about the vendor can’t count', why: 'It is one decisive half of question 2, read beside the session log. Log it as what it is.'}]};

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const CN_DRILLS = {
  hostsmgr: {
    id: 'hostsmgr', title: 'Kit’s note: how many PCs are encrypted?', budget: 2,
    intro: '<p>Kit Ambrose wrote a note at 09:45 for Marisol. You are reviewing the record, not the person: which clinic PCs are actually encrypted, and which only show the note?</p>',
    artefact: '<pre class="art">Kit Ambrose to Marisol Quintero · Day 12 09:45 (game data)\n' +
      '14 tickets since 07:15, five PCs showing the note.\n' +
      'Probably all five encrypted. The note says 40\n' +
      'computers. We only have 11.</pre>' +
      '<p class="small">A note on a screen can come from a folder every PC shows. Whether a PC is encrypted is in its own file records and in the share’s record of who wrote what.</p>',
    question: 'Which PCs are encrypted, and which only show the note?',
    sources: [
      {id: 'note', name: 'The ransom note', qs: [
        {q: 'What does it claim?', kind: 'trap', res: ['“All files on your network are encrypted (40 computers). Your patients’ data is with us.”', '(The clinic has 11 PCs and servers. A note says what its writer wants believed.)']}]},
      {id: 'tickets', name: 'The helpdesk queue', qs: [
        {q: 'How many people have reported it?', kind: 'trap', res: ['14 tickets since 07:15, from five PCs: CL-FD-01, CL-FD-02, CL-FD-03, CL-EX-02, CL-EX-05', '(Tickets count people who saw the note, not encrypted PCs.)']}]},
      {id: 'edr', name: 'The EDR’s file events, PC by PC', qs: [
        {q: 'Which PCs had their own files encrypted?', kind: 'focus', key: true,
         res: ['CL-FD-02: 2,140 local files renamed .rvb7, 05:31–05:41', 'CL-FD-01, CL-FD-03, CL-EX-02, CL-EX-05: no local file renamed; the note they show sits in the Clinic Notices folder on their desktops, which lives on S:', 'No other host shows the behaviour']}]},
      {id: 'audit', name: 'CL-FS-01’s share audit', qs: [
        {q: 'Which session wrote to the share in the night?', kind: 'focus', key: true,
         res: ['3,204 files in S:\\FrontDesk and S:\\Clinic Notices renamed .rvb7, and 214 notes written, 05:31–05:44', 'Every one of those writes from CL-FD-02’s session', 'No write from any other PC in the window']},
        {q: 'Every line of the share audit for the night', kind: 'broad', rows: 41200,
         wall: ['{t}  read   CL-FD-0{i}  S:\\FrontDesk\\Daily lists\\{n}.csv', '{t}  write  CL-FD-02  S:\\Clinic Notices\\README-RESTORE.txt', '{t}  rename CL-FD-02  S:\\FrontDesk\\Scans\\{n}.pdf']}]}
    ],
    ai: {everything: {text: 'Five PCs reporting a ransom note and 14 tickets indicate at least five encrypted hosts, consistent with the note’s claim of a network-wide attack. Recommend reimaging all five.', wrong: true,
                      reveal: 'Tally counted tickets and believed the note. It never read which PC’s files were renamed, or which session wrote to the share.'},
         specific: {q: 'Which PCs had local files renamed in the night?', text: 'One: CL-FD-02, 2,140 files between 05:31 and 05:41.'}},
    verdicts: [
      {label: 'One: CL-FD-02, and the share files it could write. The others show the note through the share', good: true, needs: ['edr', 'audit'],
       needsWhy: 'the finding rests on two records: each PC’s own file events, and the share’s record of who wrote what. You read only one of them.',
       why: 'The PCs’ own records and the share’s agree.'},
      {label: 'Five PCs encrypted, CL-FD-01 to 03 and two exam PCs: each one shows the note, and staff file tickets about it', why: 'A note on screen came through the shared folder. Only one PC’s own files changed.'},
      {label: 'Most of the clinic: the note says 40 computers, and attackers rarely stop at one PC', why: 'The note is the attacker’s claim. The records show one PC and the share.'}],
    reasons: [
      {label: 'Only CL-FD-02 renamed its own files, and it made every write to the share that night, the notes included', good: true, why: 'Each PC’s files from the EDR, and who wrote to the share from its audit.'},
      {label: 'Fourteen tickets from five PCs, CL-EX-02 among them, means five PCs: nobody files a ticket about a PC that works', why: 'People file tickets about what they see. The note came through the share.'},
      {label: 'The note was written by the people who did it, and they know best how far it went', why: 'A note is written to frighten, not to inform.'}],
    alts: [
      {label: 'The other four PCs encrypted later, after 05:44', good: true, why: 'Not supported: no local file renamed on any of them through 07:30, when the share was unshared.'},
      {label: 'Another PC writing to the share too', good: true, why: 'Not supported: the audit shows every write in the window from CL-FD-02’s session.'},
      {label: 'Wrenfold’s server being encrypted', why: 'Beside this question, and nothing points to it: WF-01 shows no such events.'},
      {label: 'The note on the share being a prank by a member of staff', why: 'Nothing points to it: a PC’s files were renamed.'}],
    path: '<p>“Which PCs are encrypted?” is decided by <b>each PC’s own file events</b> and <b>the share’s audit</b> (who wrote what). The note’s claim and the number of tickets fit any answer.</p>',
    response: ['Tell Marisol: one PC encrypted, CL-FD-02, plus the share files its session could write', 'The four other PCs stay off the share until the firm checks them; nothing reimaged yet', 'CL-FD-02 stays sealed, imaged after its memory was captured; the share stays unshared, nothing restored', 'Coach Kit in private: a count of tickets isn’t a count of encrypted PCs'],
    techs: ['T1486'], acts: ['cnhosts']
  },
  hostsdfir: {
    id: 'hostsdfir', title: 'Question 1: which systems were encrypted?', budget: 3,
    intro: '<p>The letter’s first question, in part: which clinic systems were encrypted? Your copies of C-01 to C-05 are on the bench. This finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case CLN-01 · question 1 (game data)\n' +
      'C-02  CL-FD-02 disk image\n' +
      'C-03  EDR telemetry, every clinic host\n' +
      'C-04  CL-FS-01 share audit and snapshot\n' +
      'Note  README-RESTORE.txt: “40 computers”</pre>' +
      '<p class="small">C-03 says which PCs changed their own files; C-04 says which session wrote to the share.</p>',
    question: 'Which clinic systems were encrypted?',
    sources: [
      {id: 'note', name: 'The ransom note', qs: [
        {q: 'What does it claim?', kind: 'trap', res: ['“All files on your network are encrypted (40 computers).”', '(The clinic has 11 PCs and servers.)']}]},
      {id: 'tickets', name: 'The helpdesk queue', qs: [
        {q: 'How many PCs were reported?', kind: 'trap', res: ['14 tickets, five PCs.', '(A ticket reports what someone saw.)']}]},
      {id: 'edr', name: 'C-03: EDR file events, every host', qs: [
        {q: 'Which hosts renamed their own files in the window?', kind: 'focus', key: true,
         res: ['CL-FD-02: 2,140 local files renamed .rvb7, 05:31–05:41', 'CL-FD-01, CL-FD-03, CL-EX-02, CL-EX-05: none; their note is the Clinic Notices folder on S:', 'WF-01, CL-FS-01 and every other host: none']}]},
      {id: 'audit', name: 'C-04: the share audit', qs: [
        {q: 'Which session wrote to the share in the window?', kind: 'focus', key: true,
         res: ['3,204 renames and 214 notes in S:\\FrontDesk and S:\\Clinic Notices, 05:31–05:44', 'All from CL-FD-02’s session; no write from any other host']},
        {q: 'Every line of the night’s share audit', kind: 'broad', rows: 41200,
         wall: ['{t}  read   CL-FD-0{i}  S:\\FrontDesk\\Daily lists\\{n}.csv', '{t}  write  CL-FD-02  S:\\Clinic Notices\\README-RESTORE.txt', '{t}  rename CL-FD-02  S:\\FrontDesk\\Scans\\{n}.pdf']}]},
      {id: 'disk', name: 'C-02: CL-FD-02’s disk timeline', qs: [
        {q: 'What ran on CL-FD-02 before the renames?', kind: 'focus', key: true,
         res: ['16:48 Day 11: a script from insurance-forms.zip, opened from S:\\FrontDesk\\Scans, starts a loader', '05:12 Day 12: an archive written to the temp folder; 05:31 the renames begin']}]}
    ],
    verdicts: [
      {label: 'CL-FD-02 and the share files it could write, and no other system', good: true, needs: ['edr', 'audit'],
       needsWhy: 'the finding rests on two sources: C-03 (each host’s own files) and C-04 (who wrote to the share). You read only one.',
       why: 'C-03 and C-04 each decide their half, and C-02 agrees.'},
      {label: 'The five PCs that showed the note, CL-FD-01 to 03 and two exam PCs: each displays the attacker’s message', why: 'Four of them show a shared folder. Their own files never changed.'},
      {label: 'Unknown until each of the 11 systems has been read in full, one by one', why: 'C-03 covers every host, and C-04 the share. The question has its answer.'}],
    reasons: [
      {label: 'C-03: only CL-FD-02 renamed its own files. C-04: it made every write to the share', good: true, why: 'Each host from its telemetry, and the share from its audit.'},
      {label: 'C-04: 214 notes written across the share means the attack reached every PC that shows one', why: 'The telemetry says what happened, not what could have.'},
      {label: 'The note says forty: assume the worst until the attacker is proven wrong', why: 'Assuming isn’t a finding.'}],
    alts: [
      {label: 'Another host writing to the share', good: true, why: 'Ruled out: C-04 shows every write in the window from CL-FD-02’s session.'},
      {label: 'WF-01 encrypted too', good: true, why: 'Ruled out: C-03 shows no rename on WF-01 at all.'},
      {label: 'A second ransomware strain on CL-EX-02 and CL-EX-05', why: 'Nothing points to it: C-03 shows no activity there.'},
      {label: 'The note on the share written by staff as a joke', why: 'Beside the point: files were renamed.'}],
    path: '<p>Two decisive sources: <b>C-03</b> (each host’s own file events) and <b>C-04</b> (who wrote to the share). C-02 agrees. The note and the tickets decide nothing.</p>',
    response: ['Report to Renata: CL-FD-02 and the share files its session could write', 'The four other PCs: no encryption; the firm checks them for the loader before they rejoin', 'Nothing restored until the snapshot and images are sealed (done by 09:50)', 'Keep C-03 and C-04 sealed; work on copies'],
    techs: ['T1486'], acts: ['cnhosts']
  },
  tethermgr: {
    id: 'tethermgr', title: 'Did the vendor’s remote support connect?', budget: 2,
    intro: '<p>Wrenfold Health Software’s remote-support tool, Tetherline, is always on at WF-01. Kit’s question at 13:30: did its support account connect between Thursday 16:00 and the isolation at 07:30? Review the record.</p>',
    artefact: '<pre class="art">Kit Ambrose · ticket · Day 12 13:30 (game data)\n' +
      'Tetherline console: activity every night at 03:00.\n' +
      'Forum post: “Wrenfold support got hacked last year”.\n' +
      'Was it them?</pre>' +
      '<p class="small">A tool that is always on checks in by itself. A session is when somebody connects. The vendor’s own word counts when it comes through a contact you already had.</p>',
    question: 'Did the remote-support account connect in the window?',
    sources: [
      {id: 'forum', name: 'A forum thread about the vendor', qs: [
        {q: 'What does it say about Wrenfold?', kind: 'trap', res: ['“Wrenfold support got hacked last year, avoid.” No source, no date.', '(A reputation fits a guilty vendor and an innocent one alike.)']}]},
      {id: 'hour', name: 'Tetherline’s activity graph', qs: [
        {q: 'When is it active?', kind: 'trap', res: ['A spike at 03:00 every night.', '(Activity isn’t a session. The graph doesn’t say which is which.)']}]},
      {id: 'sessions', name: 'Tetherline’s session log', qs: [
        {q: 'Which sessions connected, from where, and what are the 03:00 entries?', kind: 'focus', key: true,
         res: ['Last operator session: Day 9 (Tuesday) 14:05–14:40, from 198.51.100.121, inside Wrenfold’s documented range 198.51.100.112–127, ticket WF-4471, a scheduled update', 'No session since', 'The 03:00 entries every night: the agent’s check-in heartbeat, no operator, no session']}]},
      {id: 'vendor', name: 'Wrenfold’s support manager, on the escalation line', qs: [
        {q: 'What does the vendor say, on which contact?', kind: 'focus', key: true,
         res: ['13:10, Kit rang the escalation number in the contract’s incident clause, on the plan’s contact page since you arrived (Slate Badge)', 'No technician session to the clinic since Tuesday’s update; their own relay records agree', 'Written confirmation by email at 13:25']}]}
    ],
    ai: {everything: {text: 'Nightly 03:00 activity on a remote-support tool, a vendor with a reported breach and a ransomware attack at 05:31 suggest vendor-access compromise. Recommend treating Tetherline as the initial access vector.', wrong: true,
                      reveal: 'Tally joined an hour, a rumour and a ransomware note. It never read which entries were sessions, or asked the vendor on a known number.'},
         specific: {q: 'What are the 03:00 entries in Tetherline’s log?', text: 'Agent check-in heartbeats: no operator and no session.'}},
    verdicts: [
      {label: 'No session in the window: not the way in, though an always-on agent is still a risk to be fixed', good: true, needs: ['sessions', 'vendor'],
       needsWhy: 'the answer rests on two records: the tool’s own session log, and the vendor’s word on a contact you already had. You read only one.',
       why: 'The clinic’s log and the vendor’s records agree.'},
      {label: 'Yes: activity at 03:00 each night, from a vendor said to have been hacked, is how this kind of attack starts', why: 'The 03:00 entries are heartbeats, and the thread is a rumour. The session log shows no session.'},
      {label: 'Can’t say: switch Tetherline off and remove it from WF-01 today, then decide', why: 'The log and the vendor answer it. Removing it mid-incident cuts the support you may need; the AAR sets a date.'}],
    reasons: [
      {label: 'No session since Tuesday, heartbeats at 03:00, and the vendor’s word on a known contact', good: true, why: 'The clinic’s record, and the vendor’s, from a number on file.'},
      {label: 'A vendor with a breach in its past can’t be trusted: its tool is the likeliest way in for anyone', why: 'A past breach is a reason to look, not a finding.'},
      {label: 'Ransomware usually runs overnight, and what is active at 03:00 is part of it', why: 'An hour isn’t a session.'}],
    alts: [
      {label: 'A session the log didn’t record', good: true, why: 'Not supported: the vendor’s relay records, on its side, show none either.'},
      {label: 'Someone posing as the vendor on the phone', good: true, why: 'Ruled out: Kit rang the number in the contract’s incident clause. Nobody rang the clinic.'},
      {label: 'The vendor’s update on Tuesday carrying the malware', why: 'Nothing points to it: the loader came from an attachment on Thursday.'},
      {label: 'The forum poster being an attacker', why: 'Beside the point: the session log answers the question.'}],
    path: '<p>“Did the vendor connect?” is decided by <b>the tool’s session log</b> (sessions, not heartbeats) and <b>the vendor’s word on a contact you already had</b>. An hour and a reputation fit either answer. T1219 (Remote Access Tools) is the explanation this evidence ruled out.</p>',
    response: ['Tell Marisol: no remote-support session in the window; the way in was the attachment', 'Keep the session log and the vendor’s email', 'Tetherline on demand only, with MFA: an action for the AAR, with a date', 'Coach Kit in private: a heartbeat isn’t a session'],
    techs: ['T1219'], acts: ['cnvendor']
  },
  tetherdfir: {
    id: 'tetherdfir', title: 'Question 2: the vendor’s remote support', budget: 3,
    intro: '<p>The letter’s second question: did the records vendor’s remote-support access play any part? C-06 and C-08 are on the bench. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case CLN-01 · question 2 (game data)\n' +
      'C-05  CL-FW log, the window\n' +
      'C-06  Tetherline session log\n' +
      'C-08  Wrenfold’s written confirmation\n' +
      'R-01  requested Day 12 (Friday) 10:15</pre>' +
      '<p class="small">C-06 says which sessions connected; C-08 is the vendor’s account, through the contract’s escalation contact.</p>',
    question: 'Did the remote-support access play any part?',
    sources: [
      {id: 'forum', name: 'A forum thread about the vendor', qs: [
        {q: 'What does it say?', kind: 'trap', res: ['“Wrenfold support got hacked last year, avoid.”', '(No source, no date: a rumour.)']}]},
      {id: 'hour', name: 'Tetherline’s activity graph', qs: [
        {q: 'When is it busy?', kind: 'trap', res: ['03:00 every night.', '(Busy isn’t a session.)']}]},
      {id: 'sessions', name: 'C-06: the session log', qs: [
        {q: 'Which operator sessions, from where, and what is the 03:00 entry?', kind: 'focus', key: true,
         res: ['Last session: Day 9 14:05–14:40 from 198.51.100.121, in Wrenfold’s documented range, ticket WF-4471', 'None since; the 03:00 lines are the agent’s heartbeat, no operator']}]},
      {id: 'vendor', name: 'C-08: the vendor’s confirmation', qs: [
        {q: 'What does Wrenfold say, through which contact?', kind: 'focus', key: true,
         res: ['Its support manager, on the escalation contact in §8: no technician session since Tuesday; its relay records agree', 'Email 13:25 with headers; Kit’s 13:10 call to the §8 number is in the case notes']}]},
      {id: 'fw', name: 'C-05: CL-FW, the window', qs: [
        {q: 'Any Tetherline traffic beyond the heartbeat?', kind: 'focus', key: true,
         res: ['WF-01 to the vendor’s relay at 03:00 each night, a few kilobytes', 'Nothing else between WF-01 and the vendor’s range in the window']},
        {q: 'Every line of the window’s firewall log', kind: 'broad', rows: 88000,
         wall: ['{t}  allow  WF-01 → 198.51.100.11{i}:443', '{t}  allow  CL-FD-0{i} → 203.0.113.{n}:443', '{t}  deny   198.51.100.{n} → CL-FW:3389']}]}
    ],
    verdicts: [
      {label: 'No part: no session from Tuesday’s update to the isolation, from C-06 and C-08', good: true, needs: ['sessions', 'vendor'],
       needsWhy: 'the finding rests on two sources: C-06 (the sessions) and C-08 (the vendor’s account on a known contact). You read only one.',
       why: 'Each decides its half, and C-05 agrees.'},
      {label: 'Likely the way in: nightly activity, a vendor with a bad name, and ransomware two hours after', why: 'The activity is a heartbeat and the name a rumour. C-06 and C-08 show no session.'},
      {label: 'Unknown until Wrenfold sends its relay records, requested at 10:15', why: 'Its support manager’s written account already covers its side. The request stays logged, but question 2 has its answer.'}],
    reasons: [
      {label: 'C-06: no session since Tuesday. C-08: the vendor’s word, via §8’s contact', good: true, why: 'The clinic’s log and the vendor’s account, each on its own record.'},
      {label: 'C-05: WF-01 reaches the vendor’s range every night at 03:00, so the vendor was in', why: 'A rumour isn’t a record.'},
      {label: 'Anything that runs at 03:00 is suspicious, and the tool must be part of the attack', why: 'A schedule isn’t a session.'}],
    alts: [
      {label: 'A session hidden from C-06', good: true, why: 'Not supported: C-05 shows nothing but heartbeats, and the vendor’s side shows no session.'},
      {label: 'A caller posing as the vendor', good: true, why: 'Ruled out: Kit rang the contact in §8 of the contract.'},
      {label: 'Ticket WF-4471’s update on Tuesday planting the loader', why: 'Nothing points to it: C-02 shows the loader from Thursday’s attachment.'},
      {label: 'The forum poster attacking the clinic', why: 'Beside the point.'}],
    path: '<p>Two decisive sources: <b>C-06</b> (sessions, not heartbeats) and <b>C-08</b> (the vendor’s word, through a contact on file). C-05 agrees. T1219 (Remote Access Tools) is the explanation this evidence ruled out.</p>',
    response: ['Report to Renata: the remote-support access played no part, with both sources', 'R-01 stays open and dated: Day 12 (Friday) 10:15', 'Recommend Tetherline on demand only, from the vendor’s range, with MFA', 'Note in the case that the forum thread was not used'],
    techs: ['T1219'], acts: ['cnvendor']
  },
  restore: {
    id: 'restore', title: 'Marisol’s restore', budget: 2,
    intro: '<p>11:30. Marisol wants S: restored from last night’s backup now: the front desk is on paper and the queue is long. Is last night’s copy safe to restore, and what must happen first?</p>',
    artefact: '<pre class="art">Marisol Quintero · Day 12 11:30 (game data)\n' +
      'Backup ran at 01:00 last night. Encryption was\n' +
      'at 05:31. So last night’s copy is clean.\n' +
      'Restore it now, please.</pre>' +
      '<p class="small">A copy made before the encryption isn’t a copy made before the attack. What the copy holds is in the backup’s record; what the attack put into it is in the share’s audit and in a scan of the copy.</p>',
    question: 'Is last night’s copy safe to restore now, and what comes first?',
    sources: [
      {id: 'click', name: 'The backup console', qs: [
        {q: 'How hard is a restore?', kind: 'trap', res: ['“Restore to original location: one click.” Green ticks for the last 30 nights.', '(Easy says nothing about what the copy holds.)']}]},
      {id: 'queue', name: 'The front desk', qs: [
        {q: 'How bad is it out there?', kind: 'trap', res: ['31 patients this morning; check-in on paper takes twice as long.', '(A real cost, and a reason to restore well, not a reason to restore blind.)']}]},
      {id: 'backup', name: 'The backup job log', qs: [
        {q: 'When did last night’s copy run, and what does it hold?', kind: 'focus', key: true,
         res: ['Day 12 01:00–01:38, completed: S:\\FrontDesk, Scans folder included, as of 01:00', '30 daily copies on a store the share can’t write to', 'The 09:20 snapshot of the encrypted share is kept separately, for the firm']}]},
      {id: 'check', name: 'The firm’s check of the copy', qs: [
        {q: 'What did the attack put into last night’s copy?', kind: 'focus', key: true,
         res: ['The share’s audit, 16:00 Thursday to the 01:00 backup: one write from CL-FD-02’s session, Scans\\insurance-forms.zip at 16:47; nothing in S:\\Clinic Notices changed until 05:31', '11:00: Kit mounted the 01:00 copy read-only on an isolated PC and the firm scanned it: that zip flagged, nothing else', 'Before any restore: the same scan again on the day']}]},
      {id: 'timeline', name: 'The firm’s 11:15 timeline', qs: [
        {q: 'When did the attack reach the share, and what is closed?', kind: 'focus',
         res: ['Day 11 16:47: insurance-forms.zip saved from the front desk’s mailbox to S:\\FrontDesk\\Scans; 16:48 opened on CL-FD-02; 05:31 the encryption', 'Closed: the check-out account’s password reset at 08:40, after the memory capture; 203.0.113.61 blocked at 10:35; CL-FD-02 imaged by 09:50', 'Still open: the email itself and the clinic’s other mailboxes; the sweep of the other PCs for the loader, due 15:00']}]}
    ],
    ai: {everything: {text: 'The 01:00 backup completed successfully and predates the 05:31 encryption. Recommend restoring it immediately to end downtime.', wrong: true,
                      reveal: 'Tally compared two times. It never asked when the attack reached the share, which was the afternoon before.'},
         specific: {q: 'Does last night’s copy include S:\\FrontDesk\\Scans?', text: 'Yes: the whole of S:\\FrontDesk as of 01:00, Scans included.'}},
    verdicts: [
      {label: 'Not safe now as it stands: close the way in, rescan, restore without the zip, at Marisol’s time', good: true, needs: ['backup', 'check'],
       needsWhy: 'the answer rests on two records: what the copy holds, and what the attack put into it. You read only one of them.',
       why: 'The copy predates the encryption, not the attack: one file in it came from the attack, and the scan found nothing else.'},
      {label: 'Yes, now: the copy is from 01:00 and the encryption only started at 05:31, so the copy is clean', why: 'The attachment reached Scans at 16:47 the day before. Restore it as is and the way in comes back.'},
      {label: 'No restore: rebuild S: by hand from the paper forms, as any backup at all could be infected', why: 'The audit shows one file from the attack in the copy, and the scan found nothing else: leave that file out. Rebuilding by hand throws 30 days of copies away.'}],
    reasons: [
      {label: 'The copy holds Scans as of 01:00, so the zip is in it: the one file the attack wrote there', good: true, why: 'What the copy holds, against what the attack wrote, from the audit and the scan.'},
      {label: 'The console shows 30 green ticks for the last 30 nights of copies', why: 'A tick says the job ran, not what it copied.'},
      {label: 'The front desk is struggling on paper, so the fastest way back is the right one', why: 'A restore that brings the attack back is the slow way.'}],
    alts: [
      {label: 'The backup store encrypted too', good: true, why: 'Not supported: the share can’t write to the store, and the log shows 30 completed copies.'},
      {label: 'Something else from the infected PC hidden in the copy', good: true, why: 'Not supported: the audit shows one write from its session before 01:00, and the scan flags nothing else.'},
      {label: 'The backup software itself carrying the attack', why: 'Nothing points to it: the attack came by email.'},
      {label: 'Marisol overruling the firm', why: 'Beside the point: she decides when, on what the copy holds.'}],
    path: '<p>“Is the copy safe?” is decided by <b>the backup’s record</b> (what it holds, as of when) and <b>the firm’s check of the copy</b> (what the attack wrote into it, from the share’s audit, and a scan in isolation). Ease and urgency fit either answer.</p>',
    response: ['Tell Marisol: not as it stands; the time is hers, after the firm’s go-ahead', 'Before it: the evidence sealed (done by 09:50), the email held and the other mailboxes searched, the sender blocked, the other PCs swept for the loader', 'Restore Friday’s 01:00 copy without Scans\\insurance-forms.zip, scanned again on the day', 'The front desk stays on paper until then: the downtime procedure is working'],
    techs: [], acts: ['cnrestore']
  },
  views: {
    id: 'views', title: 'Question 3: 412 record views on Thursday', budget: 3,
    intro: '<p>C-07, Wrenfold’s access audit, shows 412 record views by one front-desk account on Thursday afternoon, the day before the attack. Staff work, or someone staging records to take? The finding needs two sources.</p>',
    artefact: '<pre class="art">Case CLN-01 · question 3 (game data)\n' +
      'C-07  Wrenfold access audit, 30 days\n' +
      '      j.okonjo: 412 views, Day 11 13:05–16:40\n' +
      'C-10  Front desk task sheet, Thursday; next week\n' +
      'C-05  CL-FW log, the window</pre>' +
      '<p class="small">A count is a reason to look. Where the session came from and what the person was there to do decide it.</p>',
    question: 'Were the 412 views staff work, or staging?',
    sources: [
      {id: 'count', name: 'The view count', qs: [
        {q: 'How many records in how long?', kind: 'trap', res: ['412 records in three and a half hours.', '(A big number fits a busy afternoon and a theft alike.)']}]},
      {id: 'timing', name: 'The timing', qs: [
        {q: 'When, against the attack?', kind: 'trap', res: ['The afternoon before the attack.', '(The day before is when everyone worked.)']}]},
      {id: 'host', name: 'C-07: the session in Wrenfold’s audit', qs: [
        {q: 'From which PC, and how were the records opened?', kind: 'focus', key: true,
         res: ['Every view from CL-FD-01, the reminder-call desk, not CL-FD-02', 'One record at a time, 20–40 seconds apart; no export, no print, no report run', 'In the window, no account read Wrenfold in bulk; the exam rooms’ views all show one name, “exam-shared”']},
        {q: 'Every line of the 30-day audit', kind: 'broad', rows: 186000,
         wall: ['{t}  view  exam-shared  CL-EX-0{i}  record {n}', '{t}  view  j.okonjo  CL-FD-01  record {n}', '{t}  edit  exam-shared  CL-EX-0{i}  record {n}']}]},
      {id: 'sched', name: 'C-10: the task sheet and next week', qs: [
        {q: 'What was that desk doing on Thursday afternoon?', kind: 'focus', key: true,
         res: ['Thursday 13:00–16:45: reminder calls for next week, desk 1 (CL-FD-01)', 'Next week: 418 appointments, 406 distinct patients']}]},
      {id: 'fw', name: 'C-05: CL-FW', qs: [
        {q: 'Did anything leave from CL-FD-01 that afternoon?', kind: 'focus', key: true,
         res: ['Nothing out from CL-FD-01 beyond its usual mail and updates', 'The only large transfer in the window: CL-FD-02, 05:14–05:19']}]}
    ],
    verdicts: [
      {label: 'Staff work: the reminder calls, from the reminder desk, one patient record at a time, not staging', good: true, needs: ['host', 'sched'],
       needsWhy: 'the finding rests on two sources: C-07 (where the session came from and how) and C-10 (what the desk was doing). You read only one.',
       why: 'The session’s source and pattern fit the task sheet, and C-05 agrees.'},
      {label: 'Staging: 412 records the afternoon before an attack that took patient lists is no coincidence', why: 'The timing and the count fit both. The session came from the reminder desk, one record at a time, with nothing taken.'},
      {label: 'Unknown: a named account can’t say who sat at the desk, and no more can be concluded', why: 'Who sat there isn’t the question. Where it came from and what was done are in C-07 and C-10.'}],
    reasons: [
      {label: 'C-07: desk 1, one by one, no export. C-10: next week’s reminder calls', good: true, why: 'Source and pattern from the audit, the task from the sheet.'},
      {label: 'C-07: 412 views in three and a half hours is a bulk read, whatever the desk was doing', why: 'Not for a reminder-call afternoon.'},
      {label: 'The views came the day before the attack: they must be connected to it', why: 'Before isn’t because.'}],
    alts: [
      {label: 'The attacker using that account from CL-FD-02', good: true, why: 'Ruled out: every view came from CL-FD-01.'},
      {label: 'The views copied out and sent later', good: true, why: 'Not supported: no export or print in C-07, and nothing out from CL-FD-01 in C-05.'},
      {label: 'A curious member of staff browsing through patients’ records', why: 'Nothing points to it: the records match next week’s appointments.'},
      {label: 'WF-01’s clock being wrong', why: 'Beside the point: C-10 and C-07 agree on the afternoon.'}],
    path: '<p>Two decisive sources: <b>C-07</b> (the session’s source and pattern) and <b>C-10</b> (the task). C-05 agrees. A count and a date decide nothing.</p>',
    response: ['Report to Renata: staff work, the reminder calls; no account read Wrenfold in bulk in the window', 'Name the desk, not a person, in the report', 'Note the exam rooms’ shared account: who viewed what there can’t be answered', 'Coach Theo in private: a count is a reason to look'],
    techs: [], acts: ['cnviews']
  }
};

/* ---------- DFIR report 1: CLN-01, for counsel (Day 12 17:00) ---------- */
const CN_REPORT_1 = {
  title: 'CLN-01: the ransomware at the front desk', audience: 'Renata Osei, counsel for the Clinic',
  intro: '<p>Ten findings for Renata, covering her three questions, each from the evidence in the custody log.</p>',
  claims: [
    {id: 'one', text: 'Only CL-FD-02 had files encrypted on its own disk; the four other PCs that showed the note had none.', truth: 'confirmed',
     evidence: ['C-03: CL-FD-02 renamed 2,140 local files; no other host renamed any', 'C-04: the note on the other four came from S:\\Clinic Notices'], why: 'Each host’s own records, and the share’s.'},
    {id: 'share', text: 'From CL-FD-02’s session, 3,204 shared files were encrypted and 214 notes written, 05:31–05:44.', truth: 'confirmed',
     evidence: ['C-04: every rename and note in the window, all from CL-FD-02’s session'], why: 'The share’s audit records every write.'},
    {id: 'way', text: 'It came in as an email attachment, saved to the Scans folder and opened on CL-FD-02 at 16:48 Thursday.', truth: 'confirmed',
     evidence: ['C-09: the email “Updated insurance card forms”, as received at 16:47, with headers', 'C-02: insurance-forms.zip saved from the mailbox to S:\\FrontDesk\\Scans at 16:47; opened at 16:48', 'C-03: the process tree from the attachment to the loader, and on to the renames'], why: 'The email, the disk and the telemetry agree.'},
    {id: 'tether', text: 'The vendor’s remote support played no part: no Tetherline session from Tuesday 14:40 to Friday’s isolation.', truth: 'confirmed',
     evidence: ['C-06: no operator session since Day 9; the 03:00 lines are heartbeats', 'C-08: the vendor’s written word, through the contact in §8', 'C-05: nothing but heartbeats between WF-01 and the vendor'], why: 'The clinic’s log and the vendor’s account agree.'},
    {id: 'left', text: 'The archive of the front desk’s daily lists and the recall list left the clinic at 05:14–05:19.', truth: 'likely',
     evidence: ['C-02: the 38.1 MB archive in CL-FD-02’s temp folder', 'C-05: 38.4 MB from CL-FD-02 to 203.0.113.61, 05:14–05:19, encrypted in transit'], why: 'Size and timing point to it; the contents in transit can’t be read.'},
    {id: 'contents', text: 'The archive still on CL-FD-02’s disk holds 90 days of daily lists and the recall list: 5,210 patients, 1,180 of them inactive.', truth: 'confirmed',
     evidence: ['C-02: the archive’s file list and contents, read on a copy', 'Fields: name, phone, email, appointment times, visit reason; the recall list’s last visit date. No clinical notes'], why: 'Read from the archive itself.'},
    {id: 'foothold', text: 'No other clinic host ran the loader, and the check-out desk account signed in on no clinic host but CL-FD-02 in the window.', truth: 'confirmed',
     evidence: ['C-03: the loader’s process tree on CL-FD-02 only; no other host shows its file or its connection', 'C-03: every sign-in by that account in the window was on CL-FD-02', 'C-01: the loader running as that account, with one outbound connection'], why: 'Every host’s telemetry, and the loader in memory.'},
    {id: 'saved', text: 'Whether the loader took other passwords saved on CL-FD-02, and used them outside the clinic’s hosts.', truth: 'unknown',
     evidence: ['C-01: the loader and its one connection, not what it read before the capture', 'The town’s directory and the mail service are outside the letter’s scope'], why: 'Nothing in scope can say. Every password used on CL-FD-02 was reset on Friday at 15:00.'},
    {id: 'bulk', text: 'No account read Wrenfold in bulk in the window; Thursday’s 412 views were the reminder calls.', truth: 'confirmed',
     evidence: ['C-07: every view logged; the 412 from CL-FD-01, one at a time, no export', 'C-10: reminder calls for next week, desk 1'], why: 'The audit and the task sheet agree.'},
    {id: 'sender', text: 'Who sent the email, and whether other organisations received it.', truth: 'unknown',
     evidence: ['C-09: the sender is a free-mail address; none of the clinic’s other mailboxes received it', 'Nothing in scope shows other organisations’ mail'], why: 'Nothing in scope can say.'}]
};

/* ---------- DFIR report 2 (the boss, stage 3): CLN-02, what left ---------- */
const CN_REPORT_2 = {
  title: 'CLN-02: what the post shows, and what left', audience: 'Renata Osei, counsel for the Clinic',
  intro: '<p>Six findings on the post and its sample, each from the evidence logged since Friday.</p>',
  claims: [
    {id: 'sample', text: 'The 20 sample rows in the post are all in the archived daily lists.', truth: 'confirmed',
     evidence: ['C-12: the post’s 20 rows', 'C-02: all 20 match rows in the archive’s daily lists (a copy, never the original)'], why: 'The sample against the archive.'},
    {id: 'archive', text: 'The archive held 90 days of daily lists and the recall list: 5,210 patients, 1,180 inactive.', truth: 'confirmed',
     evidence: ['C-02: the archive’s file list and contents', 'Fields: name, phone, email, appointment times, visit reason; the recall list’s last visit date'], why: 'Read from the archive itself.'},
    {id: 'left', text: 'That archive is what left at 05:14–05:19.', truth: 'likely',
     evidence: ['C-05: 38.4 MB out to 203.0.113.61 against a 38.1 MB archive', 'C-03: the archive written at 05:12, the transfer at 05:14'], why: 'Size and timing point to it; the transfer itself is encrypted.'},
    {id: 'notes', text: 'No clinical notes were in the archive, and Wrenfold shows no bulk read in the window.', truth: 'confirmed',
     evidence: ['C-02: the archive holds lists only', 'C-07: no bulk read by any account'], why: 'The archive and the audit.'},
    {id: 'pub', text: 'The lists have been published in full or passed on.', truth: 'unknown',
     evidence: ['C-12: the post shows 20 rows', 'Nothing in scope can show where the archive went'], why: 'Nothing in scope can say.'},
    {id: 'more', text: 'The attacker holds patient data from anywhere other than the archive.', truth: 'unknown',
     evidence: ['C-11: the email claims “12,000 patients’ full medical records”', 'Nothing in the clinic’s records shows anything else leaving'], why: 'The claim isn’t supported by what likely left the clinic, and nothing in scope can show what else they hold.'}]
};

/* ---------- Dojos (original puzzles; concepts only, no tool syntax) ---------- */
const CN_DOJO_MGR = [
  {q: 'Your records system could be down for three days. What must exist before that day?',
   opts: ['A practised procedure: what to write on, who runs it, how it gets back in',
          'A promise from the vendor to restore within four hours, written into the contract',
          'A second copy of the system somewhere else, so that downtime can never happen'], good: 0,
   explain: 'A practised procedure keeps care going whatever the cause. A vendor’s promise doesn’t treat patients, and no copy makes downtime impossible.'},
  {q: 'Ransomware hit the shared drive. Before restoring from backup, what first?',
   opts: ['Keep the evidence, close the way in, make sure the copy is safe: it mustn’t carry the attack back',
          'Restore the newest copy at once: each hour on paper costs the clinic and its staff',
          'Never restore: rebuild by hand, as a backup could be infected'], good: 0,
   explain: 'Preserve, close, check, then restore. A blind restore can bring the attack back; refusing every copy throws away the recovery you paid for.'},
  {q: 'Who decides that the clinic goes to paper?',
   opts: ['Operations, on advice: clinicians decide care',
          'The IR manager decides: an incident puts security in charge',
          'The records vendor decides: it is their system'], good: 0,
   explain: 'The person who runs the clinic decides how it runs. Security advises; clinicians decide care; the vendor supports.'}];
const CN_DOJO_DFIR = [
  {q: 'Five PCs show a ransom note. How do you tell which are encrypted?',
   opts: ['Each PC’s own file records, and who wrote to the share',
          'The note itself, which lists what the attacker encrypted',
          'The tickets: more tickets from a PC mean more of its files are encrypted'], good: 0,
   explain: 'A note can arrive through a shared folder. A PC’s own files and the share’s audit say what changed, and where from.'},
  {q: 'An encrypted PC is isolated from the network and still running. In what order?',
   opts: ['Memory first, then shut down and image the disk: hash both, restore only after',
          'Power off, then image the disk and hash both copies: memory changes too fast to be useful as evidence',
          'Reimage it now: the shared drive holds what matters'], good: 0,
   explain: 'Memory holds what the disk doesn’t: the running program, its connections and keys. Preserve both before anything is rebuilt.'},
  {q: 'An archive left before the encryption. What can you write about what the attacker holds?',
   opts: ['What the archive held, that it likely left, and what can’t be known beyond it',
          'The whole records system: assume they have it, and plan for the worst',
          'Only the rows they published, not what the archive held'], good: 0,
   explain: 'Write what the evidence shows and no more: the archive’s contents, the likely transfer, and an honest unknown for the rest.'}];

/* ---------- The Clinic Board (original; Harriet Kowal; three rounds per track) ---------- */
const CN_BOARD_SPECS_MGR = () => [
  {title: 'Round 1: what do we tell patients?', who: 'Harriet Kowal',
   ask: '“Patients are asking at the desk whether their medical records were stolen. What do we say?”',
   resp: [{label: 'From Weller’s script, agreed by counsel: HIPAA questions are theirs', good: true},
          {label: 'That their medical records are safe: only lists left, so HIPAA doesn’t apply', why: 'A promise, and a legal conclusion. Whether HIPAA applies is for Weller and counsel; say what the evidence shows.'},
          {label: 'No script from Weller until the investigation is closed, so nobody is told anything wrong', why: 'Silence at the desk is its own answer. A short, agreed script, and a date for more.'}]},
  {title: 'Round 2: why didn’t we just pay?', who: 'Harriet Kowal',
   ask: '“Why didn’t we just pay on Saturday?”',
   resp: [{label: 'You decided, with counsel and the insurer: I brought facts and options', good: true},
          {label: 'Because paying is always wrong: I made sure the clinic would have nothing to do with it', why: 'Not an absolute, and not the IR manager’s call. The Board decided, on Renata’s and the insurer’s advice.'},
          {label: 'I decided we wouldn’t: a security matter is the IR manager’s, so it was mine', why: 'Payment is a leadership decision. The IR manager advises.'}]},
  {title: 'Round 3: what stops this next time?', who: 'Marisol Quintero',
   ask: '“What changes, and how will the Board know?”',
   resp: [{label: 'Night alerts routed, downtime drilled quarterly, lists out of the share, a monthly status to the Board', good: true},
          {label: 'A new antivirus product across the whole clinic, before anything else changes, and a training video', why: 'The gaps were routing, old lists and an untested binder. A product fixes none of them.'},
          {label: 'Nothing much: one clerk made a mistake, and a reminder to the whole staff will do', why: 'Blame fixes nothing. The share, the lists and the binder made one click this costly.'}]}];
const CN_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: were medical records taken?', who: 'Harriet Kowal',
   ask: '“Were our patients’ medical records taken?”',
   resp: [{label: 'Likely left: contact details, appointments and visit reasons for 5,210 patients, 1,180 of them inactive', good: true},
          {label: 'Yes: 12,000 patients’ full records, as the post says, so the Board should assume the worst', why: 'That is the attacker’s claim. The archive held lists only, and Wrenfold shows no bulk read.'},
          {label: 'No: only the 20 rows in the sample. That is what anyone has seen', why: 'The sample is 20 rows of an archive that held 5,210 patients.'}]},
  {title: 'Round 2: who opened it?', who: 'Harriet Kowal',
   ask: '“Who opened the attachment? The Board wants a name.”',
   resp: [{label: 'The report names a desk and a time, not a person: the AAR asks why one click did this', good: true},
          {label: 'The check-out clerk on Thursday’s rota: whoever was sitting at that desk at 16:48 that afternoon', why: 'A rota says who was scheduled, not who was at the keyboard, and naming someone fixes nothing.'},
          {label: 'The technician, for not stopping it before it spread from the PC to the shared drive', why: 'Nobody watched the console at night: that was routing, not a person.'}]},
  {title: 'Round 3: the report', who: 'Harriet Kowal',
   ask: '“Can the Board have the firm’s report today?”',
   resp: [{label: 'Renata decides who receives it, and what the Board is shown', good: true},
          {label: 'Yes: I will email it to each member tonight, without troubling Renata. The Board is the client', why: 'Counsel engaged the firm and decides who receives its report.'},
          {label: 'Never, as reports are for the firm only, whatever counsel decides', why: 'An absolute nobody asked for. Renata decides.'}]}];

/* ---------- The boss: a post claiming patient data, the clinic on paper (game-original), one seat per track ---------- */
function cnMgrBossStages() {
  const open = cnN12Open(), thin = !!(G.cr.cn && G.cr.cn.night12 && G.cr.cn.night12.tired);
  return {
    s1: {title: 'Stage 1 (' + cnAt('06:20') + '): coordinate',
      clues: [thin ? '05:35: an email to Marisol and the clinic’s public inbox demands payment and claims patients’ records. She has it; nobody has checked its rows against anything, or captured the post.' : '05:35: an email to Marisol and the clinic’s public inbox: “We have 12,000 patients’ full medical records. Pay by Wednesday or everything is published.” 20 sample rows: name, phone, appointment time, visit reason.',
        open ? '05:50: Tallowmere’s leak-site watch rang the on-call number and found nobody on call. At 06:50 the firm rang Marisol, the next name on the plan’s contact page; she rang you at 07:00.'
        : thin ? '05:50: paged by the firm’s leak-site watch, the on-call lead, on a third night running, sends a thin first look: “a post names the clinic, something about patients.”'
        : '05:50: paged by the firm’s leak-site watch, the on-call lead captures a post on leaks.example naming the clinic, with the same 20 rows, and forwards the email as received.',
        'Saturday’s hours start at 08:00, check-in on paper. Renata, Weller and the Board chair don’t know yet. The firm has been engaged since Friday.'],
      ask: 'You are the IR manager. Who does what, first?',
      resp: [{label: 'Marisol runs Saturday on paper as planned. Renata, Weller and the firm now, Kowal told', good: true},
             {label: 'Marisol cancels Saturday’s appointments and closes the clinic until the data question is settled', why: 'Care runs on paper as planned, and the lists likely left on Friday. Closing helps no patient.'},
             {label: 'Weller emails each patient at 07:00 to warn them, before the post spreads further', why: 'What patients are told is Weller’s decision, with counsel, on facts. Not at seven, from a claim.'},
             {label: 'Take Wrenfold offline now: if they have the front desk lists, the records system may be next', why: 'Nothing points at WF-01, and switching the exam rooms’ records off mid-clinic puts care at risk. The downtime procedure is there if it’s needed.'},
             {label: 'Marisol puts it off until the firm’s report on Monday: it is the weekend, and the post may be a bluff', why: 'The post names the clinic and patients come in at eight. The people who decide hear it this morning.'}]},
    s2: {title: 'Stage 2 (09:00): the Board chair, and the front desk',
      clues: ['08:40, the firm: all 20 sample rows are in the archived daily lists; the archive held 90 days of lists and the recall list: 5,210 patients, 1,180 of them inactive records.', 'In it: names, phones, emails, appointment times, visit reasons. No clinical notes were in it, and Wrenfold shows no bulk read.', 'Not known: whether the lists are published in full or passed on. Patients at the desk are asking.'],
      ask: 'Kowal wants a briefing, and the desk wants words. What do you give them?',
      resp: [{label: 'Known and not, Weller’s desk script agreed by counsel, the next update at 13:00, no promises', good: true},
             {label: 'A script from Weller telling patients their medical records are safe: only lists left', why: 'A promise about data the clinic no longer controls. Weller decides the words; the desk uses his script.'},
             {label: 'Hold off until Monday: a half answer would only worry patients more', why: 'The chair hears it from you first, with the gaps named and a time for the next update.'},
             {label: 'Give Kowal the attacker’s figure, 12,000 full records, as the scale to plan for', why: 'That is the attacker’s claim. Brief what the evidence shows: 5,210 patients’ lists.'}]},
    s3: {title: 'Stage 3 (13:00): the demand',
      clues: ['The demand: pay by Wednesday. Renata has updated the insurer, and says any payment would need her sanctions check first.', 'Kowal wants the Board’s options at 15:00.', 'The FBI contact on the plan’s page was told of the ransomware on Friday, and has had the email and the post since 10:00.'],
      ask: 'What do you take to the Board?',
      resp: [{label: 'The Board decides today, with counsel and the insurer: I bring the facts, the options and their limits', good: true},
             {label: 'Recommend paying today, as the IR manager’s decision, so the lists aren’t published', why: 'Payment is the Board’s decision, with Renata and the insurer. You bring facts and options; payment buys a promise from the people who took the lists.'},
             {label: 'Refuse on the clinic’s behalf, and tell the attacker before the Board meets', why: 'Not yours to decide or to say. The Board decides; nobody answers the attacker without counsel.'},
             {label: 'Open talks with the attacker to buy time while the Board and counsel make up their minds about paying the demand', why: 'Nobody talks to the attacker without leadership and counsel deciding it.'}]}
  };
}
function cnDfirBossStages() {
  const open = cnN12Open(), thin = !!(G.cr.cn && G.cr.cn.night12 && G.cr.cn.night12.tired);
  return {
    s1: {title: 'Stage 1 (' + cnAt('06:40') + '): preserve, then scope',
      clues: ['05:35: an email to the clinic claims “12,000 patients’ full medical records”, with 20 sample rows; 05:40: the same rows in a post on leaks.example.',
        open ? 'Nobody was on call: Marisol forwarded the email at 07:05, and the firm captured the post itself at 07:00.' : thin ? 'The on-call lead’s first look was thin: Marisol forwarded the email at 06:35, and the firm captured the post itself at 06:30.' : 'The on-call lead has the email as received and a capture of the post.', 'Renata has engaged the firm under a second letter: what the post shows, and what left (game).'],
      ask: 'What do you do first?',
      resp: [{label: 'Hash email and capture now, Kit re-exports, each patient row checked on a C-02 copy', good: true},
             {label: 'Reply to the post, with counsel copied, and ask how many patients they hold, to size the problem', why: 'Nobody talks to the attacker without leadership and counsel. The evidence is in the archive.'},
             {label: 'Kit reimages CL-FD-02 today: it is imaged, and the front desk needs it back', why: 'Not the first step this morning: the sample is compared against the sealed copy, and the PC stays sealed until the case allows.'},
             {label: 'Ask Weller to tell each patient now, before the post spreads', why: 'Weller decides what patients are told, with counsel, on the facts the firm is about to give him.'}]},
    s2: {title: 'Stage 2 (11:00): what left',
      clues: ['C-02: the archive held 90 daily lists and the recall list.', 'Across them: 5,210 distinct patients, 1,180 of them inactive records; name, phone, email, appointment times, visit reason.', 'C-07: no bulk read of Wrenfold in the window. Wrenfold holds 12,960 records: 9,840 active, 3,120 inactive.'],
      ask: 'From the evidence, what left the clinic?',
      resp: [{label: 'Likely the archive: 5,210 patients, 1,180 of them inactive, contact details, appointments and visit reasons', good: true},
             {label: '12,000 patients’ full medical records, as the post says: they are certain of what they took from the clinic', why: 'That is the claim. The archive held lists only, and Wrenfold shows no bulk read.'},
             {label: 'Only the 20 rows in the sample and nothing else shown to have left', why: 'The sample is 20 rows of an archive that held 5,210 patients.'},
             {label: 'The 9,840 active patients in Wrenfold: active records are the ones that matter', why: 'That isn’t what was archived, and it leaves out the 1,180 inactive records that were.'}]}
  };
}

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  cnhosts: {name: 'Encrypted, or only showing the note?', desc: 'A ransom note on a screen can come through a shared folder. Which PCs were encrypted is in each PC’s own file records and in the share’s record of which session wrote what.'},
  cnvendor: {name: 'Vendor remote access: sessions, not heartbeats', desc: 'An always-on support tool checks in by itself. A session is when somebody connects. Read the session log, and confirm with the vendor on a contact you already hold. Then make remote support on demand, from the vendor’s range, with MFA.'},
  cnrestore: {name: 'Restore after preserving, and not the attack', desc: 'A copy made before the encryption may still hold the way in. Preserve the evidence, close the way in, check what the attack wrote into the copy (the share’s audit for the window, and a scan of the copy in isolation), leave the bad file out, then restore, when the owner decides.'},
  cnviews: {name: 'Bulk views: work or staging?', desc: 'A count is a reason to look. Where the session came from, how the records were opened, and what the person was there to do decide it.'},
  cnpreserve: {name: 'Containment that preserves', desc: 'Isolate the host from the network and leave it running; capture memory, then shut it down and image the disk; hash both; snapshot the share. Nothing is wiped or restored until it is preserved.'},
  cndowntime: {name: 'Downtime: care on paper', desc: 'The person who runs operations decides when the clinic goes to paper, on advice; clinicians decide care, visit by visit. Paper forms from the cart, a printed schedule and a summary for each patient that the clinicians agree, and a checked back-entry when the system returns.'},
  cnweekend: {name: 'Incident shifts with rest', desc: 'Day shifts of 12 hours with written handovers, nights with the on-call rota under a signed threshold, outside help for the specialist work, and nobody on the day after their night.'},
  cnaar: {name: 'A blameless AAR', desc: 'What made one click this costly, not who clicked: the routing, the share, the old lists, the binder. Each action has one owner and a date.'},
  cnreauth: {name: 'Fast re-authentication instead of a shared login', desc: 'One sign-in a day, then a badge tap or a short PIN at each shared PC, and a screen that locks when nobody is there. Each person is named in the record without slowing each visit. Operations decides how staff sign in; the privacy officer, with counsel, decides the privacy risk the clinic accepts until it is in.'},
  cnstatus: {name: 'Read the firm’s status report', desc: 'A retained firm reports what it found, what it didn’t, and anything it saw outside its questions, which goes to counsel first.'}
});
Object.assign(FACTS, {
  cnhipaa: {name: 'Ransomware and HIPAA, in HHS’s words', desc: 'HHS’s Fact Sheet: Ransomware and HIPAA (content last reviewed September 20, 2021) says: “The presence of ransomware (or any malware) on a covered entity’s or business associate’s computer systems is a security incident under the HIPAA Security Rule.” It also says: “Whether or not the presence of ransomware would be a breach under the HIPAA Rules is a fact-specific determination.” It calls implementing a data backup plan “a Security Rule requirement” for covered entities and business associates, and names disaster recovery planning, emergency operations planning, analysing the criticality of applications and data, and periodic testing of contingency plans. Whether HIPAA applies to the Community Clinic, and what would follow, is for the clinic’s counsel and its privacy officer. The game says neither.', src: 'HHS, Fact Sheet: Ransomware and HIPAA'},
  cnhicp: {name: 'HICP: health-sector practices', desc: 'HHS’s 405(d) program publishes Health Industry Cybersecurity Practices: Managing Threats and Protecting Patients (HICP), 2023 edition. It names five threats: Social Engineering; Ransomware; Loss or Theft of Equipment or Data; Insider, Accidental or Malicious Data Loss; and Attacks Against Network Connected Medical Devices. Its ten practices include Email Protection Systems, Endpoint Protection Systems, Identity and Access Management, Data Protection and Loss Prevention, and Security Operations Center & Incident Response.', src: 'HHS Cyber Gateway, HICP page (the HICP publication itself was not read)'}
});
TECH['T1486'] = {name: 'Data Encrypted for Impact', tactic: ['Impact'], desc: 'Encrypting data on one system or many, local or on shared drives, to make it unusable, often with a note demanding payment. Here: one front-desk PC, and the shared files its session could write.'};
TECH['T1219'] = {name: 'Remote Access Tools', tactic: ['Command and Control'], desc: 'Using legitimate remote-access software as an interactive channel into a network. Here it is the explanation the Clinic’s evidence ruled out: the vendor’s support tool had no session in the window.'};
TECH['T1566.001'] = {name: 'Phishing: Spearphishing Attachment', tactic: ['Initial Access'], desc: 'An email with a malicious attachment, sent to get access to the systems where it is opened. Here: an insurance-forms archive opened at the front desk.'};
GAME_NOTES.push(
  'Quillfield Community Clinic, its hours and counts, Wrenfold and Wrenfold Health Software, Tetherline, WF-01, CL-FS-01, every clinic PC, the shared drive and its folders, the daily lists and the recall list, the attack, the note, the archive, the post on leaks.example and every log line are invented. Patient data in the game is names, contact details, appointment times and a visit-reason field only. (game)',
  'The Clinic’s annex to the Compact’s plan, its night threshold, the weekend plan and its forecasts, the AAR and tabletop, the Pulse Badge’s effects, the report scores and every time and count are invented. The game never says whether HIPAA applies to the clinic, names no deadline and says nothing about what must be reported: the privacy officer, with counsel, decides patient-privacy questions. (game)'
);
