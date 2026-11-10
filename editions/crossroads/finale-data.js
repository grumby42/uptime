/* ============================================================
   UPTIME · editions/crossroads/finale-data.js
   Crossroads finale (slice 6): the Compact-wide incident, both tracks. Art,
   the operations room and the Compact Board room, people, the manager track's
   tables (the plan's test, the cross-member AAR, the programme roadmap), the
   DFIR track's tables (the letters and stores, intake, the report under
   challenge), three drills per track, four reports, the Compact Board, the
   boss's stages for each seat, and Field Manual text.
   Defender-side only (the spec's Revision 1): the campaign appears only as
   outcomes and log lines a defender reads afterwards (sign-ins with a valid
   password from unfamiliar addresses, files encrypted under an account, an
   account disabled at a time, sign-ins refused). Nothing here says how a
   password was got or how a directory, a sign-in, a copy or an encryption
   works. No new ATT&CK technique: T1078, T1486 and T1657 only, as already cited.
   One decider per decision (game): each member's own leaders decide for that
   member (Director Mina Strand for the Library; Dr Corinne Vale, with Owen
   Marsh running its IT, for the School District; Marisol Quintero for the
   Clinic; the supervisor on duty for Dispatch's floor, Imogen Hale by day;
   Callum Breck, the weekend duty manager, for the Airport on Saturday and
   Sunday; the Mayor for the town). Edda Thornquist, the Compact's
   shared-services director, decides for the Compact's shared services. Each
   member's counsel engages the firm for that member and decides who receives
   its report; Noor Castellanos for the town and the shared services. The
   Compact coordinates; it commands no member.
   Edda Thornquist, Ivor Penhallow, Hugo Ellerby, the operations room, the
   Compact Board, svc-fileops, CP-OPS-02, LIB-IMG-01, every host, count, time,
   address and log line, and the campaign itself are invented (game).
   Addresses: RFC 5737; domains: RFC 2606. Real facts: CREDITS.md, section
   "Crossroads". Timeline: scratchpad crossroads-timeline.md (Finale section);
   every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  fnDesk: ['#1b2233', '#2a3550', '#5a6fa0', '#d7dbe4'],
  fnRack: ['#1b2233', '#6e2a2a', '#c05a5a', '#f2d7d7'],
  fnRackOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  fnFile: ['#1b2233', '#4a3a6e', '#8a7ac0', '#e0d8f7'],
  fnLock: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  fnTable: ['#1b2233', '#1f4a6e', '#5f9fd6', '#dbeaf7'],
  thornquist: ['#1a1a2e', '#3a1d10', '#e0b090', '#2a5a5a'],
  penhallow: ['#1a1a2e', '#8c8c8c', '#f0c8a0', '#2a2a4a'],
  ellerby: ['#1a1a2e', '#2b1d16', '#c98a54', '#6e6e2a'],
  solano: ['#1a1a2e', '#3b2418', '#c98a54', '#3a6e8a']
});
Object.assign(TILES, {
  'Ɓ': {spr: 'counter', pal: 'fnDesk', solid: true, under: ','},   // the members' liaison desks
  'Ƈ': {spr: 'K', pal: 'fnRack', solid: true},                     // the shared-services rack (the shared directory's console, CP-OPS-02)
  'Ɗ': {spr: 'K', pal: 'fnFile', solid: true},                     // Rae's suspicion-file board
  'Ƒ': {spr: 'K', pal: 'fnLock', solid: true},                     // the firm's evidence lockers (one store per case)
  'Ɠ': {spr: 'counter', pal: 'fnTable', solid: true, under: ','}   // the command table
});

/* ---------- Map: the Compact operations room and the Compact Board room ---------- */
// South door from the town square (the square's north edge, west of Town Hall's). North: the liaison desks (the Library,
// the School District, the Clinic, Dispatch, the Airport, the Compact's shared services) and the shared-services rack.
// Middle: the command table; west door: the Compact Board room. South-west: the firm's bench, the meeting table and the
// desk (end the day). South-east: the evidence lockers and Rae's suspicion-file board.
Object.assign(MAPS, {
  fnops: {
    name: 'The Compact operations room',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,ƁƁ,,ƁƁ,,ƁƁ,,ƁƁ,,ƁƁ,,ƁƁ,,ƇƇ,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,ƓƓƓƓƓƓƓƓ,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwww,wwwwwwwwwwwww,wwwwwwww",
      "w,,,,,,,,,,,,w,,,,,,,,ƑƑƑƑ,,Ɗw",
      "w,,§§,,,,,,,,w,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,w,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,Y,w,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,w,,,,,,,,,,,,,,,w",
      "wwwwDwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'4,15': {to: 'csquare', x: 4, y: 1, dir: 'down'}, '0,7': {to: 'fnboard', x: 16, y: 5, dir: 'left'}}
  },
  fnboard: {
    name: 'The Compact Board room',
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
    doors: {'17,5': {to: 'fnops', x: 1, y: 7, dir: 'right'}}
  }
});
const FN_MAPS = ['fnops', 'fnboard'];
// The liaison desks, west to east (the tile pairs on row 1).
const FN_DESKS = {2: 'the Library', 3: 'the Library', 6: 'the School District', 7: 'the School District', 10: 'the Clinic', 11: 'the Clinic', 14: 'Dispatch', 15: 'Dispatch', 18: 'the Airport', 19: 'the Airport', 22: 'the Compact’s shared services', 23: 'the Compact’s shared services'};

/* ---------- People (the members' leaders at their desks or on the line; Tallowmere at the bench) ---------- */
NPCS.push(
  {id: 'strandfn', name: 'Director Mina Strand', role: 'library director, on the line (the Library’s desk)', map: 'fnops', x: 2, y: 2, dir: 'down', pal: 'strand'},
  {id: 'marshfn', name: 'Owen Marsh', role: 'district technology director (the School District’s desk)', map: 'fnops', x: 6, y: 2, dir: 'down', pal: 'marsh', cond: G => !G.f.fnMet || (G.trackId === 'manager' ? !!G.f.fnDrillC : !!G.f.fnDrillB)},
  {id: 'marisolfn', name: 'Marisol Quintero', role: 'practice manager, on the line (the Clinic’s desk)', map: 'fnops', x: 10, y: 2, dir: 'down', pal: 'marisol'},
  {id: 'halefn', name: 'Imogen Hale', role: 'day supervisor, on the line from the floor (Dispatch’s desk)', map: 'fnops', x: 14, y: 2, dir: 'down', pal: 'hale', cond: G => !G.f.fnMet || !!G.f.fnDrillB},
  {id: 'breckfn', name: 'Callum Breck', role: 'weekend duty manager, on the line (the Airport’s desk)', map: 'fnops', x: 18, y: 2, dir: 'down', pal: 'breck'},
  {id: 'edda', name: 'Edda Thornquist', role: 'the Compact’s shared-services director', map: 'fnops', x: 22, y: 2, dir: 'down', pal: 'thornquist'},
  {id: 'beatrizfn', name: 'Beatriz Solano', role: 'identity team lead (the shared directory)', map: 'fnops', x: 26, y: 2, dir: 'down', pal: 'solano'},
  {id: 'noorfn', name: 'Noor Castellanos', role: 'town attorney, counsel for the town, the shared services and the Library', map: 'fnops', x: 13, y: 6, dir: 'down', pal: 'noor'},
  {id: 'raefn', name: 'Rae Okafor', role: 'suspicion-file lead', map: 'fnops', x: 27, y: 11, dir: 'up', pal: 'rae'},
  {id: 'luciafn', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'fnops', x: 5, y: 12, dir: 'up', pal: 'lucia', cond: G => G.trackId === 'dfir' || !!G.f.fnBoss2},
  {id: 'theofn', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'fnops', x: 8, y: 12, dir: 'up', pal: 'theo', cond: G => G.trackId === 'dfir'},
  {id: 'ellerby', name: 'Hugo Ellerby', role: 'claims reviewer for the Airport Authority’s insurer', map: 'fnops', x: 2, y: 13, dir: 'right', pal: 'ellerby', cond: G => G.trackId === 'dfir' && !!G.f.fnNight35 && !G.f.fnChallenge},
  {id: 'penhallow', name: 'Ivor Penhallow', role: 'chair of the Compact Board', map: 'fnboard', x: 8, y: 3, dir: 'down', pal: 'penhallow'}
);
const FN_NPC_IDS = ['strandfn', 'marshfn', 'marisolfn', 'halefn', 'breckfn', 'edda', 'beatrizfn', 'noorfn', 'raefn', 'luciafn', 'theofn', 'ellerby', 'penhallow'];

/* ---------- Week 5's rota (Nights 28 to 36; Nights 28 and 29 carried; drawn up by the acting team lead, not scored) ---------- */
const FN_ROTA = {
  title: 'On-call rota, week 5', first: 28, carry: 2, nights: 9, hours: 12, maxRun: 2, maxWeek: 2, budget: 30, callCost: 3, tiredCost: 5, waitUntil: '07:00',
  intro: '<p>Nights 30 to 36, every member. Nights 28 and 29 are carried from week 4 for the in-a-row rule. (game)</p>',
  people: AP_ROTA.people,
  calls: {}
};

/* ---------- Manager: the plan's test (Day 34 03:05; each member's annex as written) ---------- */
const FN_TEST = [
  {label: 'Met for the Clinic and the Airport as written: call the firm now, and let the Library and Dispatch decide with counsel', good: true},
  {label: 'Not yet: hold off for each member’s leader to ring at 08:00, as the decision is theirs', why: 'Two annexes are met as written: ransomware found on a clinic system, and on the airport’s office network. The retainer is the Compact’s to call, and the night’s evidence won’t wait.'},
  {label: 'Met for the six members, so the firm works for the Compact’s counsel, who decides for each of them', why: 'Each member’s counsel engages the firm for that member. The Library’s and Dispatch’s lines aren’t met by what is known, and the School District saw nothing.'},
  {label: 'Not met at all: the on-call lead contained it at 02:41, and our own team can work it alone', why: 'The Clinic’s and the Airport’s ransomware lines are met, whatever happened at 02:41.'},
  {label: 'Met, and more: every member onto paper, its systems shut down while the firm looks at them', why: 'Shutting a member down is its own leaders’ call, and the account has been disabled since 02:41.'}];
const FN_ACT_OK = 15, FN_ACT_LATE = 20;   // game minutes

/* ---------- Manager: the cross-member AAR (Day 36 10:00; blameless; owners arrive assigned: Bookmark Badge) ---------- */
const FN_FACTORS = [
  {id: 'rights', name: 'One account, three shares', csf: 'Protect', text: 'svc-fileops had rights on three members’ file shares, so one password reached all three.', good: true},
  {id: 'quiet', name: 'Sign-ins nobody saw', csf: 'Detect', text: 'Fourteen sign-ins from addresses new to the account raised no alert. Only the encryption did.', good: true},
  {id: 'page', name: 'The page that worked', csf: 'Respond', text: 'The night thresholds paged at 02:35 and the account was disabled at 02:41: under ten minutes of encryption.', good: true},
  {id: 'paper', name: 'Paper with an owner', csf: 'Recover', text: 'Each member’s paper fallback had a named owner and had been practised, so the branch, the clinic and the desk kept working.', good: true},
  {id: 'first', name: 'The Library first', csf: 'Identify', text: 'The Library was hit first, at 02:31: its server is where the trouble started, and its staff should answer for it.'},
  {id: 'thread', name: 'The suspicion file', csf: 'Identify', text: 'svc-print’s actor ran the campaign: the file shows it has been in the town for years.'},
  {id: 'collector', name: 'Dispatch’s collector', csf: 'Protect', text: 'DP-LOG-01 let the attackers onto the center’s network at 02:42, and from there they reached the other members.'}];
const FN_IMPACT = [
  {label: 'Three shares, under ten minutes. Paper at three members until Sunday, all of it entered', good: true},
  {label: 'No impact to report: every member opened on Saturday without paper, and nothing was lost', why: 'The branch, the clinic’s Saturday session and the airport’s desk ran on paper, and three shares were restored. Say what it cost, as counted.'},
  {label: 'Every member was down for the whole weekend, Dispatch’s floor and the School District included', why: 'Dispatch’s floor never changed and the School District was untouched. Count what happened.'},
  {label: 'Not known today: each insurer is still reviewing the weekend’s records', why: 'The paper was counted and entered by 09:30 this morning. The cost is known now.'}];
const FN_AAR = [
  {id: 'split', name: 'svc-fileops replaced by one account per member, rights only on that member’s share, signing in only from CP-OPS-02', owner: 'Edda Thornquist',
   dates: [{label: 'Day 43, a Monday', good: true},
           {label: 'As soon as possible', why: 'A date nobody can check. Day 43.'},
           {label: 'When the budget allows', why: 'Nothing to buy: the file service is paused until it is done. Day 43.'},
           {label: 'Day 90, a Saturday', why: 'The file service stays paused until then. Three months is too long: Day 43.'}]},
  {id: 'alert', name: 'An alert when a Compact service account signs in from an address new to it', owner: 'Beatriz Solano',
   dates: [{label: 'Day 38, Wednesday', good: true},
           {label: 'As soon as possible', why: 'An action without a date doesn’t close. Day 38.'},
           {label: 'When the budget allows', why: 'The platform already holds the records. Day 38.'},
           {label: 'Day 60, a Thursday', why: 'Fourteen sign-ins went unseen on Saturday. Day 38.'}]},
  {id: 'restore', name: 'Each member’s checked restore practised with the Compact every quarter, the first one done', owner: 'Odile Brennan',
   dates: [{label: 'Day 57, a Monday', good: true},
           {label: 'As soon as possible', why: 'A date nobody can check. Day 57.'},
           {label: 'When the budget allows', why: 'The copies and the members exist already. Day 57.'},
           {label: 'Day 120, a Monday', why: 'A quarter is the cycle; the first one comes before it. Day 57.'}]}];

/* ---------- Manager: the programme roadmap (Day 36 13:00; pick four) ---------- */
const FN_ROADMAP = [
  {id: 'ex', name: 'Exercises', csf: 'Govern', text: 'A cross-member tabletop each quarter, from the members’ own risk registers, with each member’s leader at the table.', good: true},
  {id: 'terms', name: 'Retainer terms', csf: 'Govern', text: 'One retainer: each member engages the firm through its own counsel, with separate cases and stores, written into the terms.', good: true},
  {id: 'rota', name: 'Rota health', csf: 'Govern', text: 'Fill the night post, nobody past two nights in a row, and gaps and overtime reported to the Compact Board each month.', good: true},
  {id: 'accts', name: 'Service accounts', csf: 'Protect', text: 'One service account per member, rights only on the shares it needs, reviewed each quarter with each member.', good: true},
  {id: 'command', name: 'One command', csf: 'Respond', text: 'In an incident the Compact decides for every member, and the six of them move as one, so no member’s board slows it.'},
  {id: 'cut', name: 'A smaller retainer', csf: 'Govern', text: 'Saturday was contained in six minutes. The retainer can be cut to half its hours, and the saving spent on tools.'},
  {id: 'magda', name: 'Nights for good', csf: 'Govern', text: 'Magda takes the nights permanently. She offered, nobody reads the platform faster, and the schedule stops changing weekly.'}];

/* ---------- DFIR D1: the letters and the stores (Day 34 04:10) ---------- */
const FN_STORES = [
  {label: 'Four cases, four stores: the account and its two addresses cross as indicators only', good: true},
  {label: 'One campaign case and one store, since it is one actor, one account and the same two addresses', why: 'Each member’s evidence is that member’s, under its own counsel’s letter. A common actor is an indicator to share, with agreement, not a reason to mix stores.'},
  {label: 'The town’s store holds the lot: the Compact looks after the shares, and its counsel decides', why: 'The shares are each member’s. Renata and Ansel engaged the firm for theirs, and their evidence goes in their stores.'},
  {label: 'The Library’s evidence in the town’s store, since Noor is counsel for each of them', why: 'One counsel, two clients, two letters: two stores.'}];

/* ---------- DFIR D3: intake (Day 34 06:00; three items need your call) ---------- */
const FN_INTAKE = {
  l01: {id: 'L-01', what: 'LIB-IMG-01’s file events and a snapshot', form: 'Exported 05:40 by Juno Barros, the Compact’s technician at the Library; SHA-256 at export recorded.',
    opts: [{label: 'Into the Library’s store, LIB-03, with Juno’s handover and its hash', good: true},
           {label: 'Into CMP-01’s store: Juno works for the Compact, so the item is the Compact’s', why: 'Juno did the export; the server and its events are the Library’s, and LIB-03 is its case.'},
           {label: 'Log it in both stores, LIB-03 and CMP-01: the account in its records is the Compact’s', why: 'One item, one store. CMP-01 gets the indicator, with Noor agreeing for both.'},
           {label: 'Read it first, then decide which of the four stores it goes in', why: 'The log records what was received, and where, before anyone reads it.'}]},
  p05: {id: 'P-05', what: 'The Compact link’s flow records, 01:00 to 05:00', form: 'Exported 05:35 by Beatriz Solano; SHA-256 at export recorded; on the form: “no rows 02:36–02:39, the flow export restarted”.',
    opts: [{label: 'Log it as exported, the gap recorded as a gap, and work on a copy', good: true},
           {label: 'Fill the gap from the Airport’s own flows, to make the file whole', why: 'An item filled in is not the item. A gap is recorded, never filled.'},
           {label: 'Drop it: a file with a gap in it can’t support any finding', why: 'Outside the gap it shows what it shows. Log it, gap and all.'},
           {label: 'Ask Beatriz to export it again at once, for the three missing minutes', why: 'The rows don’t exist. Asking again changes nothing but the record.'}]},
  s13: {id: 'S-13', what: 'The district’s message trace, Saturday 07:00 to 08:00', form: 'Given by Owen Marsh at 08:20. At 08:15 Adaeze Kole added one question to the district’s letter, SCH-01, in writing: “is it part of the campaign?” Only that.',
    opts: [{label: 'Into the district’s store, with its limit: that one question only', good: true},
           {label: 'Into CMP-01: the question is the campaign’s, and the item goes with it', why: 'The trace is the district’s, given for one question. It goes in its own store.'},
           {label: 'Into the district’s store, for any question it may help with later', why: 'Kole agreed one question. More needs her agreement.'},
           {label: 'Skip the hash: it is a list of messages, not a disk', why: 'Any file can change once it is copied. Hash it like any item.'}]}
};

/* ---------- DFIR: the report under challenge (Day 36 09:00; Hugo Ellerby, with Ansel present) ---------- */
const FN_CHALLENGE = [
  {title: 'The challenge · round 1', ask: '“Finding 3 says likely. No record shows a transfer above 1 MB, so make it confirmed and the claim closes.”',
   resp: [{label: 'It stays likely: P-05 has three minutes without rows, and the town’s edge records, asked for on Sunday, aren’t in', good: true},
          {label: 'Agreed: the insurer pays for the work, and its reading of the evidence decides it', why: 'The evidence decides the wording, not who pays. Confirmed needs a record that covers the gap.'},
          {label: 'A filed report isn’t open to discussion: put it to counsel in writing if you disagree', why: 'Ansel decided you should hear this. Answer it from the evidence.'},
          {label: 'Confirmed is fine: P-05’s three-minute gap is too short for anything to go out', why: 'Nobody can say what three minutes allow. Likely, with the next step named.'}]},
  {title: 'The challenge · round 2', ask: '“Then if you can’t confirm it, you don’t know. Write unknown.”',
   resp: [{label: 'It stays likely: unknown would drop what two records show', good: true},
          {label: 'Unknown, to be safe, whatever the gap: nobody can blame the firm for not knowing', why: 'An underclaim is wrong too. The records point somewhere; say so.'},
          {label: 'Unknown, and the Airport’s own flows can be set aside as the airport’s', why: 'T-03 is evidence like any other. It points the same way as P-05.'},
          {label: 'Write both words, likely and unknown, and let the reader choose between them', why: 'One wording, the one the evidence supports.'}]},
  {title: 'The challenge · round 3', ask: '“In plain words, for my file: what can you say?”',
   resp: [{label: '“No transfer over 1 MB in the records I read. One has a gap, so likely. Under 1 MB: unknown.”', good: true},
          {label: '“The Authority has no legal duty to tell anyone, since the records show nothing left the airport.”', why: 'Whether anyone must be told is counsel’s question. The records show nothing above 1 MB, likely, and can’t speak to less.'},
          {label: '“Beyond any doubt nothing was taken from the share, and the claim should be paid in full.”', why: 'Overclaimed: a small file fits under 1 MB. The claim is the insurer’s and Ansel’s business, not the firm’s.'},
          {label: '“I would rather say nothing at all until the town’s edge records arrive on my desk.”', why: 'Say what the evidence shows now, and what is still to come.'}]}];

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const FN_DRILLS = {
  fnsignmgr: {
    id: 'fnsignmgr', title: 'The 01:52 sign-ins', budget: 2,
    intro: '<p>06:30, the shared-services rack. Beatriz Solano: “The night lead’s note asks whether svc-fileops was on a job. Read it before anyone says so.” Review the record: Compact work, or someone else using the account?</p>',
    artefact: '<pre class="art">Compact log platform · page · Day 34 02:35 (game data)\n' +
      'Files renamed at volume\n' +
      'Hosts    LIB-IMG-01, CL-FS-01, AP-FS-01\n' +
      'Account  svc-fileops\n' +
      'Note     first sign-in of the night 01:52</pre>' +
      '<p class="small">An account is a name, not a person. Whether a job was due is in the Compact’s change records; where the account signed in from is in the shared directory’s sign-in records.</p>',
    question: 'Were the 01:52 sign-ins Compact work, or someone else using svc-fileops?',
    sources: [
      {id: 'hour', name: 'The hour', qs: [
        {q: 'When does the file service run?', kind: 'trap', res: ['Nightly, at 23:00.', '(Night work fits a job and an intruder alike.)']}]},
      {id: 'age', name: 'The account’s age', qs: [
        {q: 'How old is svc-fileops?', kind: 'trap', res: ['Created in 2024 for the file service.', '(An old account is a risk, not a record of last night.)']}]},
      {id: 'changes', name: 'The Compact’s change records', qs: [
        {q: 'Was any job or change due for svc-fileops on Night 33?', kind: 'focus', key: true,
         res: ['None. Its one scheduled run is 23:00 nightly, from CP-OPS-02', 'The last change to the account: Day 12, a rights review Edda approved']}]},
      {id: 'signins', name: 'The shared directory’s sign-in records', qs: [
        {q: 'Where did svc-fileops sign in from on Night 33, and is that usual?', kind: 'focus', key: true,
         res: ['23:00 from CP-OPS-02, as every night. Then 14 sign-ins 01:52–02:28 with its own password, from 192.0.2.140 and 192.0.2.141', 'Neither address appears for svc-fileops in the 30 days kept']},
        {q: 'Every sign-in in the shared directory on Night 33', kind: 'broad', rows: 8400,
         wall: ['{t}  ok  staff{i}  CP-OPS-02', '{t}  ok  svc-backup  CP-OPS-01', '{t}  ok  lib-desk{i}  CIRC-01']}]}
    ],
    ai: {everything: {text: 'svc-fileops is a service account that runs nightly file jobs. Sign-ins after midnight are consistent with scheduled maintenance. No further action is recommended.', wrong: true,
                      reveal: 'Tally matched the hour to the file service. It never read the change records, or where the sign-ins came from.'},
         specific: {q: 'Has 192.0.2.140 signed in as svc-fileops before?', text: 'Not in the 30 days of sign-in records kept.'}},
    verdicts: [
      {label: 'Someone else, with the account’s own password: no job was due, and both addresses are new to it', good: true, needs: ['changes', 'signins'],
       needsWhy: 'the answer rests on two records: the change records (no job was due) and the sign-in records (where it came from). You read only one of them.',
       why: 'The change records and the sign-in records agree.'},
      {label: 'Compact work: the file service runs at night, and new addresses mean nothing for a service', why: 'No job was due, and the sign-ins came from addresses the account has never used.'},
      {label: 'Beatriz’s team, testing the account after hours from home, likely without telling Edda', why: 'Nothing names a person, and the two addresses aren’t the Compact’s.'}],
    reasons: [
      {label: 'No job or change was due, and the addresses are new to it in 30 days of sign-ins', good: true, why: 'The schedule, and the account’s own record of where it signs in from.'},
      {label: 'An account created in 2024, with records this old, must have had its password leak', why: 'Old is a risk, not a record of how anything happened.'},
      {label: 'Any sign-in after midnight is an intruder: service accounts never work then', why: 'The file service itself runs at 23:00. The hour decides nothing.'}],
    alts: [
      {label: 'A job nobody wrote down', good: true, why: 'Ruled out: the change records show none, and the account’s own run came at 23:00 from CP-OPS-02.'},
      {label: 'Staff using the account from home', good: true, why: 'Not supported: the two addresses aren’t the Compact’s, and nothing names anyone.'},
      {label: 'A clock running off on the directory', why: 'Nothing points to it: the 23:00 sign-in is on time.'},
      {label: 'Whoever wrote the ransom note', why: 'Beside the point: a note names nobody we can check.'}],
    path: '<p>“Compact work, or someone else?” is decided by <b>the Compact’s change records</b> and <b>the shared directory’s sign-in records</b>. The hour and the account’s age fit either answer. T1078 (Valid Accounts) is what the records show: a real account, its own password, from addresses new to it.</p>',
    response: ['svc-fileops stays disabled, as it has been since 02:41', 'The two addresses stay blocked at the Compact’s edge', 'How its password was got stays unknown: nothing read so far says', 'When the file service returns is Edda’s decision'],
    techs: ['T1078'], acts: ['fnsign']
  },
  fnsigndfir: {
    id: 'fnsigndfir', title: 'CMP-01, question 1: the 01:52 sign-ins', budget: 3,
    intro: '<p>07:00, the bench. Noor’s first question for the shared services: who signed in as svc-fileops on Night 33? P-01, P-02 and P-04 are on the bench. The finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case CMP-01 · question 1 (game data)\n' +
      'P-01  shared directory sign-ins, 30 days\n' +
      'P-02  the Compact’s change records, 30 days\n' +
      'P-04  directory change record, snapshot\n' +
      'Note  page 02:35; account disabled 02:41</pre>' +
      '<p class="small">P-01 says where the account signed in from; P-02 says whether anything was due.</p>',
    question: 'Were the 01:52 sign-ins Compact work?',
    sources: [
      {id: 'hour', name: 'The hour', qs: [
        {q: 'When does the file service run?', kind: 'trap', res: ['23:00.', '(A time, not a record of who.)']}]},
      {id: 'age', name: 'The account’s age', qs: [
        {q: 'How old is it?', kind: 'trap', res: ['Created in 2024.', '(A risk, not a record.)']}]},
      {id: 'p01', name: 'P-01: the sign-in records', qs: [
        {q: 'Where did svc-fileops sign in from on Night 33?', kind: 'focus', key: true,
         res: ['23:00 from CP-OPS-02. 01:52–02:28: 14 sign-ins with its own password, from 192.0.2.140 and 192.0.2.141', 'Neither address appears for it in P-01’s 30 days']},
        {q: 'Every sign-in in P-01’s 30 days', kind: 'broad', rows: 241000,
         wall: ['{t}  ok  staff{i}  CP-OPS-02', '{t}  ok  clinic-fd{i}  CL-FD-0{i}', '{t}  fail  desk{i}  PUB-PC-0{i}']}]},
      {id: 'p02', name: 'P-02: the change records', qs: [
        {q: 'Was any job or change due for svc-fileops?', kind: 'focus', key: true,
         res: ['None on Night 33 but its 23:00 run from CP-OPS-02', 'Its last change: Day 12, a rights review']}]},
      {id: 'p04', name: 'P-04: the directory’s change record', qs: [
        {q: 'Was svc-fileops changed before 01:52?', kind: 'focus', key: true,
         res: ['No change to it between Day 12 and the 02:41 disable']}]}
    ],
    verdicts: [
      {label: 'Not Compact work: P-01’s new addresses and P-02’s empty schedule show it, with P-04 in support', good: true, needs: ['p01', 'p02'],
       needsWhy: 'the finding rests on two sources: P-01 (where it came from) and P-02 (what was due). You read only one.',
       why: 'Each decides its part.'},
      {label: 'Compact work: P-02 shows the file service runs at night, and nothing in it changed', why: 'P-02 shows nothing due, and P-01 shows addresses the account has never used.'},
      {label: 'Open: every member’s file events need reading first', why: 'Those say what was encrypted, not who signed in. P-01 and P-02 answer this.'}],
    reasons: [
      {label: 'P-01: two addresses new to it, its own password. P-02: nothing was due', good: true, why: 'Where it came from, and what was scheduled.'},
      {label: 'P-04: no change to the account, which proves the password was guessed', why: 'P-04 shows the account unchanged. How the password was got is unknown.'},
      {label: 'The 02:35 page fired: the sign-ins from those addresses were hostile by definition', why: 'A page is a reason to look.'}],
    alts: [
      {label: 'A job nobody wrote down', good: true, why: 'Ruled out: P-02 shows none, and the account’s own run came at 23:00 from CP-OPS-02.'},
      {label: 'A change to the account before 01:52', good: true, why: 'Ruled out: P-04 shows none between Day 12 and the disable.'},
      {label: 'Two people working together', why: 'Nothing points to it.'},
      {label: 'The directory’s clock running off', why: 'Beside the point: P-01 and P-02 agree on the 23:00 run.'}],
    path: '<p>Two decisive sources: <b>P-01</b> (where the account signed in from) and <b>P-02</b> (what was due). P-04 agrees. T1078 (Valid Accounts) is what they show: the account’s own password, from addresses new to it.</p>',
    response: ['Report to Noor: not Compact work, the account’s own password, two addresses', 'svc-fileops stays disabled; the addresses stay blocked', 'How the password was got: unknown, and written so', 'The indicators go to Renata’s and Ansel’s cases, each counsel agreeing'],
    techs: ['T1078'], acts: ['fnsign']
  },
  fnfloormgr: {
    id: 'fnfloormgr', title: 'Imogen’s question', budget: 2,
    intro: '<p>07:20, Dispatch’s desk. Imogen Hale, on the floor since 07:00: “Your collector on my network saw that account. Does anything change on my floor?” Review the record.</p>',
    artefact: '<pre class="art">Compact log platform · DP-LOG-01 · Night 33 (game data)\n' +
      '02:42  sign-in  svc-fileops  192.0.2.141  refused\n' +
      '02:42  sign-in  svc-fileops  192.0.2.141  refused\n' +
      '02:44  192.0.2.140, .141 blocked at the edge</pre>' +
      '<p class="small">The collector receives the center’s logs. Whether the floor changes is the supervisor on duty’s call; your part is the facts.</p>',
    question: 'Does anything on the dispatch floor need to change?',
    sources: [
      {id: 'center', name: 'The center itself', qs: [
        {q: 'How serious is it when a 911 center is touched?', kind: 'trap', res: ['As serious as it gets.', '(Seriousness is a reason to read the records, not an answer.)']}]},
      {id: 'others', name: 'The other members', qs: [
        {q: 'How many members did the account reach?', kind: 'trap', res: ['Three shares, at three other members.', '(What happened elsewhere says nothing about this collector.)']}]},
      {id: 'log', name: 'DP-LOG-01’s own log', qs: [
        {q: 'What did the account do on the collector?', kind: 'focus', key: true,
         res: ['02:42: two sign-ins refused, the account disabled since 02:41', 'Nothing else under svc-fileops: no session, nothing run']}]},
      {id: 'floor', name: 'The floor’s own records', qs: [
        {q: 'Has anything on the floor changed overnight?', kind: 'focus', key: true,
         res: ['CAD-01 and the phones normal all night; answer-to-dispatch as usual (game)', 'The collector receives logs. Nothing in CAD depends on it']}]}
    ],
    ai: {everything: {text: 'Any unauthorised activity on a 911 center’s network is critical. Recommend moving the floor to manual cards until the investigation completes.', wrong: true,
                      reveal: 'Tally weighed the word “911”. It never read the collector’s log or the floor’s own records.'},
         specific: {q: 'Did any sign-in on DP-LOG-01 succeed?', text: 'No. Both were refused: the account had been disabled at 02:41.'}},
    verdicts: [
      {label: 'Nothing on the floor changes. Imogen, on duty, decides, on these records', good: true, needs: ['log', 'floor'],
       needsWhy: 'the answer rests on two records: what the account did on the collector, and what the floor’s own records show. You read only one.',
       why: 'The collector refused both, and nothing on the floor depends on it.'},
      {label: 'Cards as a precaution for the weekend: Edda decides that for the center', why: 'The floor is the supervisor on duty’s to run, and nothing reached it.'},
      {label: 'Shut DP-LOG-01 down, and tell Imogen once it is off', why: 'Both tries were refused, and the center’s logs would stop arriving. The supervisor hears first, and decides.'},
      {label: 'Keep Imogen out of it: the collector and its records are the Compact’s, not hers', why: 'It sits on her network. The supervisor on duty decides anything that touches the floor.'}],
    reasons: [
      {label: 'Both tries were refused, and nothing on the floor depends on it', good: true, why: 'What the account did, and what the floor needs.'},
      {label: 'A 911 center always goes to cards when anything on its network is touched', why: 'An absolute with a cost: slower dispatch, for nothing that reached the floor.'},
      {label: 'Three members were encrypted: the center is next unless it acts', why: 'The account has been disabled since 02:41, and both tries here were refused.'}],
    alts: [
      {label: 'A sign-in that worked', good: true, why: 'Ruled out: both refused, the account disabled.'},
      {label: 'CAD reached through the collector', good: true, why: 'Not supported: nothing in CAD depends on it, and CAD-01 was normal all night.'},
      {label: 'Someone on Imogen’s own staff', why: 'Nothing points to anyone.'},
      {label: 'The radio room', why: 'Beside the point: nothing in the records touches it.'}],
    path: '<p>“Does the floor change?” is decided by <b>the collector’s own log</b> and <b>the floor’s own records</b>. The word “911” and what happened at other members fit either answer. The supervisor on duty decides; you give the facts.</p>',
    response: ['Imogen keeps the floor on CAD: her decision, on these facts', 'DP-LOG-01 stays up and receiving', 'Ezra keeps its log as exported, its hash recorded', 'The open risk stands: the collector is joined to the shared directory'],
    techs: [], acts: ['fnfloor']
  },
  fncollectdfir: {
    id: 'fncollectdfir', title: 'CMP-01, question 2: the collector', budget: 3,
    intro: '<p>10:00, the bench. Noor’s second question: what did svc-fileops do on DP-LOG-01, the Compact’s collector on the dispatch center’s network? Imogen is waiting for the facts. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case CMP-01 · question 2 (game data)\n' +
      'P-01  shared directory sign-ins, 30 days\n' +
      'P-03  DP-LOG-01’s own security and process log\n' +
      'P-04  directory change record, snapshot\n' +
      'Note  addresses blocked 02:44</pre>' +
      '<p class="small">P-03 is the collector’s own account of the night; P-01 is the directory’s.</p>',
    question: 'What did the 02:42 sign-ins on DP-LOG-01 do?',
    sources: [
      {id: 'center', name: 'The center itself', qs: [
        {q: 'How serious is it?', kind: 'trap', res: ['A 911 center.', '(Weight, not a record.)']}]},
      {id: 'others', name: 'The other members', qs: [
        {q: 'What did the account do elsewhere?', kind: 'trap', res: ['Encrypted three shares.', '(Elsewhere is elsewhere.)']}]},
      {id: 'p03', name: 'P-03: the collector’s own log', qs: [
        {q: 'What did svc-fileops do on DP-LOG-01?', kind: 'focus', key: true,
         res: ['02:42: two sign-ins from 192.0.2.141, refused: account disabled', 'Nothing run under svc-fileops on Night 33']},
        {q: 'Every line of P-03 for Night 33', kind: 'broad', rows: 52000,
         wall: ['{t}  recv  CAD-0{i}  syslog', '{t}  recv  MQ-01  syslog', '{t}  fwd  platform  batch {n}']}]},
      {id: 'p01', name: 'P-01: the directory’s record', qs: [
        {q: 'What does the directory record for those two sign-ins?', kind: 'focus', key: true,
         res: ['02:41: svc-fileops disabled. 02:42: two sign-ins for DP-LOG-01, refused, from 192.0.2.141', 'None for the account after 02:42, to P-01’s end at 05:00']}]}
    ],
    verdicts: [
      {label: 'Nothing, confirmed: both refused, no session. P-03 and P-01 agree', good: true, needs: ['p03', 'p01'],
       needsWhy: 'the finding rests on two sources: P-03 (the collector’s own record) and P-01 (the directory’s). You read only one.',
       why: 'Each decides its part.'},
      {label: 'Likely nothing, though a refused sign-in in P-03 may hide a session nobody logged', why: 'Both records show the refusals, and P-03 shows nothing run. It is confirmed.'},
      {label: 'Open: DP-LOG-01’s disk must be copied and read first', why: 'P-03 and P-01 already answer it, and the collector keeps working meanwhile.'},
      {label: 'Something ran: the account reached three other members that same night', why: 'Elsewhere is elsewhere. Here both tries were refused.'}],
    reasons: [
      {label: 'P-03: refused, nothing run. P-01: disabled at 02:41, both refusals logged', good: true, why: 'The collector’s record and the directory’s.'},
      {label: 'P-04 shows the account disabled, so nothing that happened on the collector matters', why: 'It matters: someone tried. The control held, and that is a finding too.'},
      {label: 'The center is a 911 center, and the worst goes in writing', why: 'Assumed is not found. Write what the records show.'}],
    alts: [
      {label: 'A session that was never logged', good: true, why: 'Ruled out: both records show the refusals, and P-03 shows nothing run.'},
      {label: 'Another account on the collector', good: true, why: 'Not supported: P-03 shows nothing but the center’s logs arriving.'},
      {label: 'Imogen’s staff', why: 'Nothing points to anyone.'},
      {label: 'The collector’s age', why: 'Beside the point.'}],
    path: '<p>Two decisive sources: <b>P-03</b> (the collector’s own log) and <b>P-01</b> (the directory’s record). The center’s weight and what the account did elsewhere fit either answer. The facts go to Imogen, who decides the floor.</p>',
    response: ['Report to Noor: two refused sign-ins, nothing run', 'The facts to Imogen at 10:20, under Noor’s rule: she decides the floor', 'P-03 kept as exported, its hash recorded', 'Name the open risk: the collector is joined to the shared directory'],
    techs: [], acts: ['fnfloor']
  },
  fnphishmgr: {
    id: 'fnphishmgr', title: 'Wim’s email', budget: 2,
    intro: '<p>08:10, the School District’s desk. Owen Marsh: “Wim Haddad reported this at 07:31. It came in at 07:12. Is it part of last night’s?” Review the record.</p>',
    artefact: '<pre class="art">Forwarded by w.haddad · Day 34 07:31 (game data)\n' +
      'From:    IT Help &lt;help@staff-verify.example&gt;\n' +
      'Subject: Action needed: confirm your account\n' +
      'Sign in below by noon today to keep access.\n' +
      '[a button: Confirm]</pre>' +
      '<p class="small">The campaign’s marks: svc-fileops and two addresses, 192.0.2.140 and .141. The district’s mail keeps a message trace; its SSO sign-ins reach the Compact’s platform.</p>',
    question: 'Is Wim’s email part of the campaign?',
    sources: [
      {id: 'morning', name: 'The morning', qs: [
        {q: 'Did it arrive the same morning as the campaign?', kind: 'trap', res: ['07:12, five hours after the encryption.', '(Two things on one morning aren’t one thing.)']}]},
      {id: 'subject', name: 'The subject line', qs: [
        {q: 'Does it mention accounts?', kind: 'trap', res: ['“Confirm your account.”', '(Most phishing does.)']}]},
      {id: 'signins', name: 'The Compact’s sign-in records for the district', qs: [
        {q: 'Did any district account sign in from the campaign’s addresses?', kind: 'focus', key: true,
         res: ['None from 192.0.2.140 or .141 for any district account, Night 33 or since', 'w.haddad’s last sign-in: Friday 15:40, from Hollinmere Middle. svc-fileops has no rights at the district']}]},
      {id: 'trace', name: 'The district’s message trace', qs: [
        {q: 'Where did the email come from, and to whom?', kind: 'focus', key: true,
         res: ['07:12: one outside sender, to 40 district mailboxes', 'Its link goes to staff-verify.example. Nothing in the campaign’s records names that domain or sender']},
        {q: 'Every message the district received on Saturday', kind: 'broad', rows: 2900,
         wall: ['{t}  in  newsletter  → staff{i}', '{t}  in  parent{i}  → office@', '{t}  out  noreply  → family{i}']}]}
    ],
    ai: {everything: {text: 'The email arrived during an active Compact-wide incident and targets account credentials. It is likely part of the same campaign. Recommend treating the School District as affected.', wrong: true,
                      reveal: 'Tally joined two events by their timing. It never read the sign-in records or the trace.'},
         specific: {q: 'Has any district account signed in from 192.0.2.140?', text: 'No. None in the Compact’s records.'}},
    verdicts: [
      {label: 'Not part of the campaign: the district’s own phishing report, Owen’s to handle', good: true, needs: ['signins', 'trace'],
       needsWhy: 'the answer rests on two records: the district’s sign-ins and the district’s message trace. You read only one of them.',
       why: 'No district account touched the campaign’s addresses, and the email came from somewhere the campaign never used.'},
      {label: 'Part of the campaign: the same morning, and it asks for accounts', why: 'A morning and a subject line fit any phishing run. The records show no link.'},
      {label: 'Part of it: likely how svc-fileops’s password was got from an outside address last night', why: 'It arrived five hours after. How the password was got is unknown, and nothing ties this email to it.'},
      {label: 'Open: the firm must first read every district mailbox and its records', why: 'The trace and the sign-ins already answer it, and the mailboxes are the district’s.'}],
    reasons: [
      {label: 'No district sign-in from the campaign’s addresses, and one outside sender the campaign never used', good: true, why: 'The district’s sign-ins, and the email’s own route.'},
      {label: 'Phishing and ransomware on one weekend are always one attack', why: 'An absolute. Two events are one only when a record joins them.'},
      {label: 'Wim reported it quickly: he must have typed his password', why: 'Quick reporting is what you want. Nothing says he typed anything.'}],
    alts: [
      {label: 'A district account used in the campaign', good: true, why: 'Ruled out: none signed in from its addresses.'},
      {label: 'The same sender as the campaign', good: true, why: 'Not supported: nothing in the campaign’s records names the domain or the sender.'},
      {label: 'A teacher sending it as a test', why: 'Nothing points to it.'},
      {label: 'The district’s mail filter failing', why: 'Beside the point: a report to handle either way.'}],
    path: '<p>“Part of the campaign?” is decided by <b>the Compact’s sign-in records for the district</b> and <b>the district’s message trace</b>. The morning and the subject fit either answer. Here the right answer is no: a real report, handled by the district.</p>',
    response: ['Owen pulls the 40 messages and blocks the sender: his to do', 'Anyone who typed a password changes it. Nobody has said so yet', 'Dr Vale is told; the operations room notes the district as not part of it', 'Thank Wim: nineteen minutes from arrival to report'],
    techs: [], acts: ['fnphish']
  },
  fnphishdfir: {
    id: 'fnphishdfir', title: 'The district’s question', budget: 3,
    intro: '<p>08:30, the bench. Adaeze Kole has agreed one question for the district: is Wim Haddad’s email part of the campaign? P-01 and S-13 are on the bench, each in its own store. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case CMP-01 and the district’s store (game data)\n' +
      'P-01  shared directory sign-ins, with the\n' +
      '      district’s SSO sign-ins as forwarded\n' +
      'S-13  the district’s message trace, 07:00–08:00\n' +
      'Note  w.haddad reported it at 07:31</pre>' +
      '<p class="small">S-13 may be used for this one question. P-01 is CMP-01’s; what is said about the district goes to Kole.</p>',
    question: 'Is the district’s email part of the campaign?',
    sources: [
      {id: 'morning', name: 'The morning', qs: [
        {q: 'Same morning?', kind: 'trap', res: ['07:12.', '(A coincidence of time, not a link.)']}]},
      {id: 'subject', name: 'The subject line', qs: [
        {q: 'Does it ask about accounts?', kind: 'trap', res: ['“Confirm your account.”', '(So does most phishing.)']}]},
      {id: 'p01', name: 'P-01: the sign-in records', qs: [
        {q: 'Did any district account sign in from 192.0.2.140 or .141?', kind: 'focus', key: true,
         res: ['None from Night 33 to 05:00, P-01’s end, in the district’s forwarded SSO sign-ins', 'w.haddad’s last to 05:00: Friday 15:40, Hollinmere Middle']}]},
      {id: 's13', name: 'S-13: the message trace', qs: [
        {q: 'Where did it come from, and to whom?', kind: 'focus', key: true,
         res: ['07:12: one outside sender to 40 district mailboxes', 'The link: staff-verify.example. Neither appears in CMP-01’s records']},
        {q: 'Every line of S-13', kind: 'broad', rows: 610,
         wall: ['{t}  in  bulletin  → staff{i}', '{t}  in  vendor{i}  → office@', '{t}  quarantined  promo{i}']}]}
    ],
    verdicts: [
      {label: 'Not part of the campaign: P-01 and S-13 show it. The district handles the report', good: true, needs: ['p01', 's13'],
       needsWhy: 'the finding rests on two sources: P-01 (the district’s sign-ins) and S-13 (the email’s route). You read only one.',
       why: 'Each decides its part.'},
      {label: 'Likely part of it: P-01 and S-13 cover the same morning, and both concern accounts', why: 'Timing is not a record. P-01 and S-13 show no link.'},
      {label: 'Open: every district mailbox needs examining first', why: 'The mailboxes are the district’s, and P-01 and S-13 already answer the question.'}],
    reasons: [
      {label: 'P-01: no district sign-in from its addresses. S-13: a sender it never used', good: true, why: 'The district’s sign-ins, and the email’s own route.'},
      {label: 'P-01 aside, S-13 alone: forty mailboxes is too many for a targeted campaign', why: 'A count of recipients is not a link either way.'},
      {label: 'It arrived after the encryption: it can’t be connected', why: 'Order in time proves nothing. The records decide it.'}],
    alts: [
      {label: 'A district account used in the campaign', good: true, why: 'Ruled out: P-01 shows none from its addresses.'},
      {label: 'The campaign’s own sender', good: true, why: 'Not supported: S-13’s sender and domain appear nowhere in CMP-01.'},
      {label: 'A test by the district', why: 'Nothing points to it.'},
      {label: 'The email’s wording', why: 'Beside the point.'}],
    path: '<p>Two decisive sources: <b>P-01</b> (the district’s sign-ins, as forwarded) and <b>S-13</b> (the message trace). The morning and the subject fit either answer. Not part of the campaign: the district handles it.</p>',
    response: ['To Kole: not part of the campaign, from P-01 and S-13', 'S-13 used for that question only, as she agreed', 'Owen pulls the messages, blocks the sender and checks the district’s own sign-ins since 05:00: the district’s to do', 'The district’s store stays apart from CMP-01'],
    techs: [], acts: ['fnphish']
  }
};

/* ---------- DFIR reports (Day 35 15:00): one per member, and the shared services ---------- */
const FN_REPORT_LIB = {
  title: 'LIB-03: the image server', audience: 'Noor Castellanos, counsel for the Library',
  intro: '<p>Three findings for Noor, for the Library, from LIB-03’s store.</p>',
  claims: [
    {id: 'enc', text: 'Files on LIB-IMG-01 were encrypted 02:31–02:38 on Night 33 under svc-fileops.', truth: 'confirmed',
     evidence: ['L-01: LIB-IMG-01’s file events, each write under svc-fileops', 'L-02: the ransom note and ten encrypted samples'], why: 'The server’s own events, and the files themselves.'},
    {id: 'circ', text: 'CIRC-01 shows no sign-in by svc-fileops on Night 33.', truth: 'confirmed',
     evidence: ['L-03: CIRC-01’s Security log for Night 33: no sign-in by svc-fileops'], why: 'Its own sign-in record, over the night it covers.'},
    {id: 'out', text: 'Whether anything was copied out of LIB-IMG-01.', truth: 'unknown',
     evidence: ['L-04: the Library firewall’s log for Night 33 records connections at its edge, not their size', 'The patron-network flow records cover the public PCs and patron Wi-Fi, not LIB-IMG-01', 'P-05, as shared with Noor’s agreement: no rows 02:36–02:39'], why: 'No record in scope says what left LIB-IMG-01 over the whole window.'}]
};
const FN_REPORT_CLN = {
  title: 'CLN-03: the front-desk folder', audience: 'Renata Osei, counsel for the Clinic',
  intro: '<p>Four findings for Renata, from CLN-03’s store.</p>',
  claims: [
    {id: 'enc', text: 'Files in CL-FS-01’s S:\\FrontDesk were encrypted 02:33–02:39 on Night 33 under svc-fileops.', truth: 'confirmed',
     evidence: ['N-01: the share audit, each write under svc-fileops', 'N-01: the snapshot, the folder’s files encrypted'], why: 'The share’s own audit, and its files.'},
    {id: 'wf', text: 'WF-01, which runs Wrenfold, shows no sign-in by svc-fileops on Night 33.', truth: 'confirmed',
     evidence: ['N-02: WF-01’s sign-in log for Night 33'], why: 'Its own record, over the night it covers.'},
    {id: 'out', text: 'No transfer above 1 MB left S:\\FrontDesk for an outside address, 01:30–03:00.', truth: 'likely',
     evidence: ['N-03: none from CL-FS-01 at CL-FW, 01:30–03:00', 'P-05, as shared with Noor’s agreement: none in the link’s records, but no rows 02:36–02:39'], why: 'Two records point to it; one has a gap.'},
    {id: 'small', text: 'Whether anything smaller than 1 MB left S:\\FrontDesk, 01:30–03:00.', truth: 'unknown',
     evidence: ['N-03 and P-05 answer by size, and a day’s list is a few kilobytes', 'Nothing in scope records what the sessions read'], why: 'Below the threshold the records can’t tell a list from the sessions’ own traffic.'}]
};
const FN_REPORT_AIR = {
  title: 'AIR-03: the office file share', audience: 'Ansel Whitcombe, counsel to the Thistlecombe Airport Authority',
  intro: '<p>Four findings for Ansel, from AIR-03’s store.</p>',
  claims: [
    {id: 'enc', text: 'Files on AP-FS-01 were encrypted 02:34–02:40 on Night 33 under svc-fileops.', truth: 'confirmed',
     evidence: ['T-01: AP-FS-01’s file events, each write under svc-fileops', 'T-01: the snapshot, the share’s files encrypted'], why: 'The share’s own events, and its files.'},
    {id: 'bil', text: 'AP-BIL-02, which runs Plinthwise, shows no sign-in by svc-fileops on Night 33.', truth: 'confirmed',
     evidence: ['T-02: AP-BIL-02’s sign-in log for Night 33'], why: 'Its own record, over the night it covers.'},
    {id: 'out', text: 'No transfer above 1 MB left AP-FS-01 for an outside address, 01:30–03:00.', truth: 'likely',
     evidence: ['T-03: none from AP-FS-01 at AP-FW-01, 01:30–03:00', 'P-05, as shared with Noor’s agreement: none in the link’s records, but no rows 02:36–02:39'], why: 'Two records point to it; one has a gap.'},
    {id: 'small', text: 'Whether anything smaller than 1 MB left AP-FS-01, 01:30–03:00.', truth: 'unknown',
     evidence: ['T-03 and P-05 answer by size, and a small file fits under it', 'Nothing in scope records what the sessions read'], why: 'Below the threshold the records can’t tell a file from the sessions’ own traffic.'}]
};
const FN_REPORT_CMP = {
  title: 'CMP-01: the shared services', audience: 'Noor Castellanos, counsel for the town and the Compact’s shared services',
  intro: '<p>Six findings for Noor, from CMP-01’s store. She decides who receives them.</p>',
  claims: [
    {id: 'sign', text: 'svc-fileops signed in 14 times, 01:52–02:28, with its own password from two addresses new to it.', truth: 'confirmed',
     evidence: ['P-01: the sign-ins, from 192.0.2.140 and 192.0.2.141; neither in the account’s 30 days', 'P-02: no job or change due on Night 33'], why: 'The sign-in records and the change records agree.'},
    {id: 'reach', text: 'Those sessions reached LIB-IMG-01, CL-FS-01 and AP-FS-01; two attempts on DP-LOG-01 were refused.', truth: 'confirmed',
     evidence: ['P-01: the sign-ins’ targets', 'P-03: the collector’s own refusals'], why: 'The directory and the collector agree.'},
    {id: 'off', text: 'svc-fileops was disabled at 02:41 and has not signed in since, to Sunday 07:30.', truth: 'confirmed',
     evidence: ['P-04: the disable in the directory’s change record', 'P-06: no sign-in for it from 02:41 to Sunday 07:30, only the two refusals at 02:42'], why: 'The change record and the review agree, over the window they cover.'},
    {id: 'dir', text: 'Every change in the shared directory from Day 5 to Sunday 07:30 matches an approved change record.', truth: 'confirmed',
     evidence: ['P-06: the review of the directory’s 30 days of records against P-02', 'P-02: Day 12, svc-fileops’s rights review (Edda) and the resets of the passwords used on CL-FD-02 (Kit, for the Clinic)', 'P-04: the 02:41 disable under the runbook; Saturday’s 05:30 snapshot matches, and nothing changed after it to Sunday 07:30'], why: 'The review, the change records and the snapshot agree, over the window they cover.'},
    {id: 'how', text: 'How svc-fileops’s password was got.', truth: 'unknown',
     evidence: ['P-01: the first sign-in from a new address at 01:52, with the right password', 'Nothing in scope records how it was got'], why: 'The records say when and from where, not how.'},
    {id: 'link', text: 'That this campaign is linked to svc-print’s notes in the suspicion file.', truth: 'unknown',
     evidence: ['P-01: no svc-print sign-in 01:00–03:00 on Night 33', 'No note in the file shares the two addresses'], why: 'Nothing in scope links them, and nothing rules a link out.'}]
};

/* ---------- The Compact Board (original; Ivor Penhallow; three rounds per track) ---------- */
const FN_BOARD_SPECS_MGR = () => [
  {title: 'Round 1: who was in charge?', who: 'Ivor Penhallow',
   ask: '“Who was in charge on Saturday night?”',
   resp: [{label: 'Each for itself: each member’s leaders, Edda for the shared services', good: true},
          {label: 'The IR manager commanded every member: one incident, one commander', why: 'You coordinated. Each member decided for itself, and Edda for the shared services.'},
          {label: 'The firm ran it for each member: it had seen this kind of attack before', why: 'The firm worked for each member’s counsel. It decided nothing for any member.'}]},
  {title: 'Round 2: should the Compact pay?', who: 'Ivor Penhallow',
   ask: '“Three notes asked for money. Should the Compact pay?”',
   resp: [{label: 'Each member decides for itself, with its counsel and insurer', good: true},
          {label: 'Pay once for the three members from the Compact’s own budget: cheaper than three negotiations', why: 'The Compact pays for no member. Each member’s leadership decides, with its counsel and insurer.'},
          {label: 'The IR manager will decide that today for each member, once the firm’s reports are in', why: 'You advise. A payment is each member’s own leaders’ decision.'}]},
  {title: 'Round 3: what next?', who: 'Ivor Penhallow',
   ask: '“What does the programme do next?”',
   resp: [{label: 'The roadmap: exercises, retainer terms, rota health, accounts per member', good: true},
          {label: 'Nothing: it was contained in six minutes, and the programme works as it is', why: 'One account reached three members. The roadmap says what changes.'},
          {label: 'A new security product for every member, bought by the Compact this quarter', why: 'A product fixes neither one account’s reach nor the members’ practice.'}]}];
const FN_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: one attacker?', who: 'Ivor Penhallow',
   ask: '“Was it one attacker across the members?”',
   resp: [{label: 'One account, two addresses, three shares. Who is behind them is unknown', good: true},
          {label: 'The same people as svc-print, who have been in the town for years', why: 'Nothing in scope links the two. Say what the records show.'},
          {label: 'Three separate attacks that happened to share two addresses on the same night', why: 'One account, two addresses and nine minutes. The records join them.'}]},
  {title: 'Round 2: did anything leave?', who: 'Ivor Penhallow',
   ask: '“Did anything leave any member?”',
   resp: [{label: 'Over 1 MB: none at the Clinic or the Airport. Smaller, or at the Library: unknown', good: true},
          {label: 'Nothing left anywhere: the firm has shown it, member by member, in its four reports', why: 'Nothing above 1 MB at two members; below that, and at the Library, whose edge logs no sizes, unknown.'},
          {label: 'Everything on the three shares left: assume the worst, and tell everyone today', why: 'The records show no transfer above 1 MB at two members. Say what is known.'}]},
  {title: 'Round 3: can we publish?', who: 'Ivor Penhallow',
   ask: '“Can the Board publish the firm’s reports?”',
   resp: [{label: 'Each counsel decides for its report: Noor for CMP-01', good: true},
          {label: 'The firm publishes the four tonight, so nobody is kept guessing', why: 'The firm reports to each counsel. Publication is theirs to decide.'},
          {label: 'Never: no counsel publishes incident reports', why: 'An absolute nobody asked for. Each counsel decides.'}]}];

/* ---------- The boss: the Compact-wide incident (game-original), one seat per track ---------- */
function fnMgrBossStages() {
  return {
    s1: {title: 'Stage 1 (' + (typeof fnMgrTimes === 'function' && typeof G !== 'undefined' && G && G.cr ? fnHm(fnMgrTimes().s1) : '03:20') + '): stand up command',
      clues: ['02:31–02:40: files encrypted on LIB-IMG-01, CL-FS-01’s S:\\FrontDesk and AP-FS-01 under svc-fileops. 02:41: the account disabled.', 'On the line: Director Strand, Marisol, Callum (weekend duty manager), Dispatch’s night supervisor. Edda is in the room.', 'The firm has been called. Each member’s counsel is engaging it for that member.'],
      ask: 'Six members, one room. Who decides what?',
      resp: [{label: 'Each member’s leaders decide for their member, Edda for the shared services. You coordinate, the firm through counsel', good: true},
             {label: 'You command every member for as long as it lasts: one incident needs one commander', why: 'The Compact coordinates; it commands no member. Each member’s leaders decide for it.'},
             {label: 'The firm takes command of the six members through Noor, as it knows this kind of attack', why: 'The firm works for each member’s counsel. It decides nothing for any member.'},
             {label: 'Hold everything for each leader to ring in the morning: nobody need be woken for file shares', why: 'Three members are hit. Their leaders decide now, on what is known.'},
             {label: 'The Compact sets every member’s downtime to match the others’, and tells each leader', why: 'Each member decides its own downtime. Matching them helps nobody.'}]},
    s2: {title: 'Stage 2 (09:30): what comes back first?',
      clues: ['The shared directory hasn’t been reviewed yet. Friday’s 23:00 copies of the three shares are held off the network.', 'Dispatch: two sign-ins refused on DP-LOG-01. Imogen, on duty, keeps the floor on CAD.', 'The Clinic’s Saturday session on the cart since 08:00; the airport’s desk on paper since 07:30; the branch on paper slips from 09:00.'],
      ask: 'Restoring across members: in what order, and who picks the times?',
      resp: [{label: 'Dispatch first in practice, and settled by Imogen. Then care, the desk, the branch. Each leader picks its time', good: true},
             {label: 'Edda moves Dispatch to cards first, as a precaution, and tells Imogen once it is done', why: 'The floor is the supervisor on duty’s, and nothing reached it. She has decided.'},
             {label: 'The Library first, on its own: it was hit first, at 02:31', why: 'Order by life safety and service, not by the clock.'},
             {label: 'Everything back at 09:00 from last night’s copies, with the paper dropped the same minute as it returns', why: 'Nothing returns before the shared directory is reviewed and its passwords reset, and each copy is checked.'},
             {label: 'Skip Dispatch: nothing there was encrypted, and its people needn’t hear', why: 'Its supervisor still needs the facts, first. She decides.'}]},
    s3: {title: 'Stage 3 (12:00): the briefings',
      clues: ['11:00, the firm, through each counsel: three shares encrypted under svc-fileops; nothing on Shelfwright, Wrenfold, Plinthwise or CAD; two refused tries on DP-LOG-01.', 'Not known: how the password was got; whether anything under 1 MB left, or anything at all in the link’s three-minute gap.', 'Each member’s counsel decides what its public is told.'],
      ask: 'What does each member’s leadership hear?',
      resp: [{label: 'What is known today for their member, what isn’t, 16:00 next. Nothing promised', good: true},
             {label: 'Promise every member its share back by Monday morning', why: 'A promise nobody can keep yet. The next update at 16:00.'},
             {label: 'Tell them nothing was taken from any member, gap or no gap', why: 'Not known: one record has a gap, nothing rules out a small transfer, and the Library’s edge logs no sizes.'},
             {label: 'Tell them the suspicion file’s actor did this', why: 'Nothing in the evidence links the two.'},
             {label: 'Nothing until counsel has the firm’s final reports, so nobody repeats a mistake', why: 'Silence leaves each leader guessing. Say what is known, and when more comes.'}]}
  };
}
function fnDfirBossStages() {
  return {
    s1: {title: 'Stage 1 (04:30): preserve',
      clues: ['svc-fileops disabled at 02:41; the two addresses blocked at 02:44. No file event under it anywhere after 02:40.', 'Three shares encrypted at three members, each under its own counsel’s letter. The shared directory’s sign-in records keep 30 days.', 'Marisol, Callum and Director Strand each want their share back today.'],
      ask: 'What do you do first?',
      resp: [{label: 'The sign-in records now, then each share’s snapshot by its own people, to its own store', good: true},
             {label: 'Enable svc-fileops again for an hour, to see where it goes next', why: 'Never. Disabling destroyed nothing; enabling it hands it back.'},
             {label: 'Shut every member’s file server down now, before anything else can happen on any of them', why: 'It is contained: nothing since 02:40. Shutting down loses what is running, for nothing.'},
             {label: 'Restore the three shares from Friday’s copies, and let the members work', why: 'Restoring before preserving, before the copies are checked and the directory reviewed, can bring it back.'},
             {label: 'One store for the lot, because one actor used one account and two addresses', why: 'Each member’s evidence goes in its own store, under its own letter.'}]},
    s2: {title: 'Stage 2 (12:00): what did it reach?',
      clues: ['L-01, N-01, T-01: writes under svc-fileops on LIB-IMG-01 02:31–02:38, S:\\FrontDesk 02:33–02:39, AP-FS-01 02:34–02:40.', 'L-03, N-02, T-02: no sign-in by svc-fileops on CIRC-01, WF-01 or AP-BIL-02. P-03: two refusals on DP-LOG-01.', 'N-03, T-03, P-05: no transfer above 1 MB from the shares, but P-05 has no rows 02:36–02:39. L-04: the Library’s edge logs connections, not sizes.'],
      ask: 'From the evidence, what did it reach?',
      resp: [{label: 'Three shares, from svc-fileops’s sessions. Two refused tries on the collector. Nothing else', good: true},
             {label: 'Every member’s systems, the School District’s among them', why: 'The district saw none of it. Say what each store shows.'},
             {label: 'Shelfwright too: the account is the Compact’s, and the Compact runs CIRC-01 for the Library', why: 'L-03 shows no sign-in by svc-fileops on CIRC-01, and it has no rights there.'},
             {label: 'The clinic’s patient lists, copied out in the gap before the encryption', why: 'No record shows a transfer above 1 MB, and none shows a list copied. Say what the records show.'},
             {label: 'Nothing left any of the three members, at any time that night', why: 'One record has a gap, a small transfer isn’t ruled out, and the Library’s edge logs no sizes.'}]},
    s3: {title: 'Stage 3 (Sunday 07:30): the way back',
      clues: ['Friday’s 23:00 copies of the three shares are held off the network.', 'The shared directory: nothing reviewed yet since Saturday’s 05:30 snapshot.', 'Edda decides for the shared services, the Mayor for the town’s accounts; each member’s leader decides its own restore time.'],
      ask: 'What has to happen before any share returns?',
      resp: [{label: 'Review the shared directory and reset every admin and service password in it first. Copies checked in isolation', good: true},
             {label: 'Restore the three now, and review the directory on Monday', why: 'A share back on a directory nobody has checked can bring it back.'},
             {label: 'A new password for svc-fileops, and switch it back on: the file service needs it', why: 'The account the campaign used stays disabled. Edda decides what replaces it.'},
             {label: 'Edda picks each member’s restore time, as she knows when the copies are ready', why: 'The firm says what it found. Each member’s leader picks the time.'}]}
  };
}

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  fnsign: {name: 'A valid sign-in from somewhere new', desc: 'When an account signs in with its own password, nothing fails, so nothing alerts. Check it against the change records (was anything due?) and its own sign-in history (has it ever come from there?). The hour and the account’s age fit either answer.'},
  fnfloor: {name: 'The facts to the floor’s decider', desc: 'When something touches a member’s live operations, the facts go to that member’s decider on duty at once: what was tried, what it reached, what depends on it. The supervisor on duty decides the floor; nobody else does.'},
  fnphish: {name: 'Not part of it is a finding', desc: 'On a busy morning every report looks connected. Join two events only when a record joins them: the sign-ins and the message trace. A report that isn’t part of the campaign is still handled, by its own member.'},
  fncommand: {name: 'Many members, one room', desc: 'In an incident across members, each member’s own leaders decide for that member, the shared services’ owner decides for the shared services, the firm works for each member through its own counsel, and the IR manager coordinates. Nobody commands anyone else’s organisation.'},
  fnorder: {name: 'Restore by life safety, then service', desc: 'Order the way back by life safety and service impact, not by which member was hit first. Nothing returns before the shared directory is reviewed and its passwords reset, and each member’s leader picks its own time once its copy is checked.'},
  fnstores: {name: 'A common actor, separate stores', desc: 'One actor across several clients is still several cases: each client’s evidence in its own store, under its own counsel’s letter. Indicators (an account name, addresses) pass between cases, with each counsel agreeing; the evidence itself never does.'},
  fnway: {name: 'The way back across members', desc: 'Review the directory the members share before anything returns: its accounts, groups, policies and sign-ins over every day its records keep. Reset every admin and service password, keep the account the attack used disabled, check each copy in isolation, and let each member pick its own time.'},
  fnchallenge: {name: 'Defend a finding, or revise it honestly', desc: 'When a reader disputes a wording, answer from the evidence: what each record shows, and what it doesn’t. Don’t strengthen it to please, or weaken it to be safe. When new evidence arrives, revise it, and say what changed and why. Plain words, no legal conclusions: those are counsel’s.'},
  fnaar: {name: 'An AAR across members', desc: 'Blameless, with every member at the table: what let one account reach several members, what kept each of them working, and what it cost each one, as counted. Each action has one owner from the organisation that runs the service, and a date.'},
  fnroadmap: {name: 'A programme roadmap', desc: 'After the capstone incident: exercises across members from their own risk registers, retainer terms that keep each member’s case its own, a rota people can keep, and accounts scoped to one member each. Each line has an owner and a date.'}
});
GAME_NOTES.push(
  'The finale’s campaign, svc-fileops and its rights, CP-OPS-02, LIB-IMG-01, the two addresses, every sign-in, encryption window, refusal and flow record, the three-minute gap, the Compact operations room, Edda Thornquist, Ivor Penhallow, Hugo Ellerby and the Compact Board are invented. Only outcomes and log lines a defender reads afterwards are shown: the game never says how a password was got or how anything was done. (game)',
  'Week 5’s rota was drawn up by the acting team lead and is not on your scorecard. The night thresholds’ page, the six-minute disable, each member’s paper, the copies, the restores and their times, the AAR, the roadmap, the Compass Badge’s Focus +4 and every score are invented. Each member’s counsel decides what its public is told and who receives its report; each member’s leaders decide any payment. (game)'
);
