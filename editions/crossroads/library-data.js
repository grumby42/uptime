/* ============================================================
   UPTIME · editions/crossroads/library-data.js
   Crossroads district 1: the Public Library (both tracks). Art, map, people,
   the manager track's tables (the risk register and tabletop, the retainer's
   arrival pack, the AAR, after-hours cover), the DFIR track's tables (the
   scoping letter, evidence intake, client stores, two reports), three drills
   per track, the directive, the Library Board, the two dojos and the boss's
   stages for each seat, and Field Manual text.
   Patron privacy: the game never says what any law requires. Noor (the town
   attorney, counsel for the Library) decides privilege, notification and
   disclosure; the Director and the Board decide the Library's services.
   People, the Library's settings, Shelfwright, hosts, cards, bookings, counts
   and times are invented (game). Addresses: RFC 5737 only. Domains: RFC 2606
   only. Real facts: CREDITS.md, section "Crossroads". Timeline: scratchpad
   crossroads-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  lbShelf: ['#1b2233', '#5b3a26', '#a8703f', '#e0b090'],
  lbCirc: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  lbCircOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  lbPub: ['#1b2233', '#2b2f3a', '#4a5163', '#8c7b70'],
  lbPubOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  lbMaker: ['#1b2233', '#3a4a6b', '#7fa2d6', '#dbeaf7'],
  lbDojo: ['#1b2233', '#1f5a8a', '#7fa2d6', '#ffd96a'],
  lbStudy: ['#1b2233', '#5b3a26', '#a8703f', '#dbeaf7'],
  lbLocker: ['#1b2233', '#2a3550', '#5a6fa0', '#d7dbe4'],
  lbBoardRack: ['#1b2233', '#1f5a8a', '#7cc6c4', '#ffd96a'],
  strand: ['#1a1a2e', '#2b1d16', '#a8703f', '#6e2a4a'],
  dot: ['#1a1a2e', '#d7dbe4', '#f2c7a0', '#2f74b5'],
  juno: ['#1a1a2e', '#141414', '#8a5a3c', '#e0a030'],
  kemal: ['#1a1a2e', '#3a1d10', '#c98a54', '#3a8a5a'],
  cyrus: ['#1a1a2e', '#8c8c8c', '#f0c8a0', '#2a3550'],
  agnes: ['#1a1a2e', '#d7dbe4', '#e0b090', '#8a3a5a'],
  ruth: ['#1a1a2e', '#5b4a42', '#e0b090', '#2f74b5']
});
Object.assign(TILES, {
  'þ': {spr: 'K', pal: 'lbShelf', solid: true},                       // bookshelves
  'Ç': {spr: 'counter', pal: 'lbCirc', solid: true, under: ','},      // the circulation desk (Shelfwright terminals)
  'ø': {spr: 'pc', pal: 'lbPub', solid: true, under: ','},            // public PCs (PUB-PC-01..08)
  'æ': {spr: 'counter', pal: 'lbMaker', solid: true, under: ','},     // makerspace benches
  '¤': {spr: 'pc', pal: 'lbDojo', solid: true, under: ','},           // dojo terminals
  '§': {spr: 'counter', pal: 'lbStudy', solid: true, under: ','},     // the study-room table
  '£': {spr: 'K', pal: 'lbLocker', solid: true},                      // the evidence locker (DFIR) / the exercise kit (manager)
  '±': {spr: 'K', pal: 'lbBoardRack', solid: true}                    // the Board room's shelves of minutes
});

/* ---------- Map: the Library and the Library Board room ---------- */
// Entrance in the north wall (back to the square). West: the public PCs; middle: the circulation desk; east of the PCs:
// the patron Wi-Fi closet; north-east: the makerspace and the dojo terminals. South: the Director's office (west), the
// study room (middle), the staff workroom (east). The Library Board room is through the east-wall door.
Object.assign(MAPS, {
  library: {
    name: 'The Public Library',
    rows: [
      "wwwwwwwwwwwwwwwEwwwwwwwwwwwwww",
      "wþþþþþ,,,,,,,,,,,,,,,,ææ,,æ,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wþþþþþ,,ÇÇÇÇ,,,,,,,,,,,¤,¤,¤,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wþþþþþ,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,ø,ø,ø,ø,,,n,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,ø,ø,ø,ø,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwww,wwwwwwwwww,wwwwwwwww,www",
      "w,,,,,,,,w,,,§§,,,,,w,,,,,,,,w",
      "w,,,,,,,,w,,,,,,£,,,w,,,,Y,,,w",
      "w,,,,,,,,w,,,,,,,,,,w,,,,,,,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'15,0': {to: 'csquare', x: 9, y: 9, dir: 'up'}, '29,7': {to: 'lboard', x: 1, y: 5, dir: 'right'}}
  },
  lboard: {
    name: 'The Library Board room',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w±±,,,,,,,,,,,,±±w",
      "w±±,,,,,,,,,,,,±±w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "E,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'0,5': {to: 'library', x: 28, y: 7, dir: 'left'}}
  }
});
const LB_MAPS = ['library', 'lboard'];
// Public PCs by map position (row 7: PUB-PC-01..04, row 9: 05..08).
const LB_PCS = {'2,7': 'PUB-PC-01', '4,7': 'PUB-PC-02', '6,7': 'PUB-PC-03', '8,7': 'PUB-PC-04', '2,9': 'PUB-PC-05', '4,9': 'PUB-PC-06', '6,9': 'PUB-PC-07', '8,9': 'PUB-PC-08'};

/* ---------- People ---------- */
const lbT = (G, t) => G.trackId === t;
NPCS.push(
  {id: 'strand', name: 'Director Mina Strand', role: 'library director', map: 'library', x: 3, y: 13, dir: 'right', pal: 'strand'},
  {id: 'dot', name: 'Dot Ferreira', role: 'circulation supervisor', map: 'library', x: 13, y: 4, dir: 'down', pal: 'dot'},
  {id: 'juno', name: 'Juno Barros', role: 'Compact field technician', map: 'library', x: 10, y: 8, dir: 'left', pal: 'juno'},
  {id: 'kemal', name: 'Kemal Osterhout', role: 'makerspace coordinator', map: 'library', x: 21, y: 4, dir: 'down', pal: 'kemal'},
  {id: 'agnes', name: 'Agnes Pell', role: 'a regular', map: 'library', x: 5, y: 6, dir: 'down', pal: 'agnes'},
  {id: 'cyrusb', name: 'Cyrus Hallowell', role: 'chair of the Library Board', map: 'lboard', x: 8, y: 3, dir: 'down', pal: 'cyrus'},
  {id: 'cyrusd', name: 'Cyrus Hallowell', role: 'chair of the Library Board', map: 'library', x: 6, y: 13, dir: 'left', pal: 'cyrus', cond: G => !!G.f.lbDirectiveDue && !G.f.lbDirective},
  {id: 'noorlb', name: 'Noor Castellanos', role: 'town attorney, counsel for the Library', map: 'library', x: 11, y: 13, dir: 'right', pal: 'noor', cond: G => lbT(G, 'dfir') && !G.f.lbLetter},
  {id: 'lucia', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'library', x: 17, y: 12, dir: 'down', pal: 'lucia', cond: G => lbT(G, 'dfir') || !!G.f.lbBoss},
  {id: 'theo', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'library', x: 12, y: 14, dir: 'up', pal: 'theo', cond: G => lbT(G, 'dfir')},
  {id: 'ruthlb', name: 'Ruth Avila', role: 'Clerks’ Row lead (endpoints)', map: 'library', x: 18, y: 14, dir: 'left', pal: 'ruth', cond: G => lbT(G, 'manager') && !!G.f.lbDrillB && !G.f.lbDrillC}
);
const LB_NPC_IDS = ['strand', 'dot', 'juno', 'kemal', 'agnes', 'cyrusb', 'cyrusd', 'noorlb', 'lucia', 'theo', 'ruthlb'];

/* ---------- Manager F1: the tabletop (risk register; CISA CTEP-style) ---------- */
const LB_RISKS = [
  {id: 'pcs', text: 'Patron PCs keep whatever the last patron left', lik: 4, imp: 3},
  {id: 'net', text: 'A patron device on LIB-GUEST reaches CIRC-01', lik: 3, imp: 4},
  {id: 'vendor', text: 'Shelfwright down or misused, and nobody knows whom to call', lik: 3, imp: 5}];
const LB_SCENARIO = [
  {label: 'Shelfwright down or misused, nobody to call: the highest impact, and the plan’s biggest unknown', good: true},
  {label: 'Patron PCs keeping files: the likeliest risk, and one everybody in the room already knows how to fix'},
  {label: 'A nation-state attack on every Compact member at once, from the news, to test the whole plan'},
  {label: 'CISA’s ransomware scenario word for word, so nobody can say the exercise was made up'}];
const LB_INJECTS = [
  {t: '02:00 (exercise): Shelfwright refuses every login. Who calls the vendor, on what number?',
   opts: [{label: 'Say it plainly: nobody here knows the escalation number. It becomes an action with an owner', good: true},
          {label: 'Juno would call them: he logs the support tickets, so he must have the number somewhere', why: 'Juno logs tickets through a web form; he has never had the escalation number either. That is the gap.'},
          {label: 'The on-call lead finds the number on the vendor’s website at 2 a.m., like anyone would', why: 'The website lists sales. The escalation line is in the contract, and nobody has it to hand. That is the gap.'},
          {label: 'Skip this inject: Shelfwright failing at 2 a.m. is unlikely enough to leave out of the exercise', why: 'Unlikely and unplanned for is what a tabletop is for. Write the gap down.'}]},
  {t: '08:30 (exercise): a patron at the desk asks Dot whether her data is safe.',
   opts: [{label: 'Dot says what is known and what isn’t, and passes the question on to the Director', good: true},
          {label: 'Dot tells her nothing was taken, to keep the queue moving while the team works it out', why: 'A promise before anyone knows is a guess, and the Library would have to take it back.'},
          {label: 'Dot phones Noor at the counter and tells the patron what Noor thinks the law requires', why: 'Noor advises the Library, not the patron at the counter, and a legal view isn’t a front-desk answer.'},
          {label: 'Dot says nothing at all and sends the patron across the square to the security team', why: 'The Library answers its own patrons, with what it knows; the Director decides what is said.'}]},
  {t: '10:00 (exercise): should circulation go offline until the vendor answers?',
   opts: [{label: 'Director Strand decides, on the facts you give her: paper checkout slips at the desk are the fallback', good: true},
          {label: 'You take it offline at once: the security of patron records outranks lending', why: 'Taking a service down is the owner’s decision. You advise; she decides, and she can lend on paper.'},
          {label: 'Keep it running whatever happens: the Library must stay open, and the vendor will sort it', why: 'Maybe, maybe not: that is a decision for the Director with the facts, not a rule in advance.'},
          {label: 'The vendor decides: it is their system, so it is their call to make', why: 'The vendor runs the software; the Library owns the service and its patrons’ records.'}]}];
// Actions the tabletop produces (they become the AAR's issues).
const LB_EX_ACTIONS = 3;

/* ---------- Manager F2: the retainer and its arrival pack (game) ---------- */
const LB_PACK = [
  {id: 'scope', name: 'Scope in writing', csf: 'Respond', text: 'One page: which member, which systems, which questions, who decides.', good: true},
  {id: 'contacts', name: 'Named contacts', csf: 'Respond', text: 'The Director, Noor and the vendor’s escalation line, each with a phone number and a deputy.', good: true},
  {id: 'access', name: 'Access the firm will need', csf: 'Respond', text: 'Which accounts, which VPN, who grants them, and when they are switched off again.', good: true},
  {id: 'evidence', name: 'Evidence held', csf: 'Respond', text: 'What has been kept, where it is sealed, and its custody record so far.', good: true},
  {id: 'diagrams', name: 'Every member’s network diagrams', csf: 'Identify', text: 'The whole Compact on paper, so the firm can look anywhere it likes.'},
  {id: 'press', name: 'A draft press statement', csf: 'Respond', text: 'Words ready for the papers before anyone knows what happened.'},
  {id: 'password', name: 'A shared admin password', csf: 'Protect', text: 'One login for the firm’s whole team, to save setting up accounts.'}];
const LB_CALLER = [
  {label: 'You call the retainer line and tell Noor at once: she decides how the firm is engaged', good: true},
  {label: 'Director Strand calls the firm herself, from the number in the contract binder, once she is sure', why: 'The retainer is the Compact’s, and the Director has a library to run. You make the call; she is told.'},
  {label: 'The on-call lead calls it, but only after the team is sure the incident is serious', why: 'Waiting for certainty is how a retainer gets called a day late. The plan’s criteria decide, not certainty.'},
  {label: 'Noor calls the firm later in the week, when the facts are settled and the scope is certain', why: 'Counsel is told at once, not at the end; the firm is needed while the evidence is fresh.'}];
const LB_ACT_OK = 15, LB_ACT_CARD = 10, LB_ACT_LATE = 20;   // game minutes

/* ---------- Manager F3: the AAR (CTEP improvement-plan columns) ---------- */
const LB_AAR = [
  {id: 'restore', issue: 'Patron PCs don’t restore between sessions', action: 'Restore at logoff and overnight (Juno does the work)', due: 'Day 3',
   owners: [{label: 'Director Strand: the public PCs are her service, and Juno does the work', good: true},
            {label: 'Juno Barros: he is the one who will do the work, so it is his'},
            {label: 'You: a restore is a security control, and controls are yours'},
            {label: '“IT”: whoever happens to be free once the licence arrives'}],
   dates: [{label: 'Day 3', good: true}, {label: 'As soon as possible'}, {label: 'When the budget allows'}, {label: 'At the next annual plan'}]},
  {id: 'split', issue: 'Patron Wi-Fi shares the circulation network', action: 'Put LIB-GUEST on its own network', due: 'Day 3',
   owners: [{label: 'Magda’s team, for the Compact: the Compact runs the Library’s network', good: true},
            {label: 'Director Strand: the Wi-Fi is the Library’s, so the fix is hers'},
            {label: 'You: separating networks is a security fix, so it is yours'},
            {label: 'The Wi-Fi vendor: it sold the access points, so it fixes them'}],
   dates: [{label: 'Day 3, written in the plan', good: true}, {label: 'As soon as possible'}, {label: 'When the budget allows'}, {label: 'At the next annual plan'}]},
  {id: 'vendor', issue: 'Nobody knows whom to call at Shelfwright', action: 'Get the escalation line and the support addresses from Shelfwright Systems, under the contract', due: 'Day 2',
   owners: [{label: 'Director Strand: the Shelfwright contract is hers', good: true},
            {label: 'Juno Barros: he logs the support tickets, so he can ask'},
            {label: 'Dot Ferreira: she uses Shelfwright every day at the desk'},
            {label: 'You: contacts belong on your incident plan’s page'}],
   dates: [{label: 'Day 2: today, by 17:00', good: true}, {label: 'As soon as possible'}, {label: 'When the budget allows'}, {label: 'At the next annual plan'}]}];

/* ---------- Manager F4: after-hours cover for the Library (rota/budget primitive) ---------- */
const LB_COVER = [
  {label: 'Route Library alerts to the Compact on-call: a night threshold the Director signs', good: true, k: 'threshold', gaps: 0, overtime: 27},
  {label: 'Add the Library to the rota as it is: every lead takes its night calls on top of the town’s', k: 'asis', gaps: 0, overtime: 42, why: 'Every Library alert pages someone at night. Forecast: 42 overtime hours against a budget of 30, and more calls on tired people.'},
  {label: 'Two leads on call every night, so nobody is alone with a Library page at 2 a.m.', k: 'double', gaps: 0, overtime: 54, why: 'No gaps, but every lead takes two more nights a week: the third night in a row comes back. Forecast: 54 overtime hours.'},
  {label: 'No cover at night: the Library is closed then, so nothing there can need anyone', k: 'none', gaps: 84, overtime: 24, why: 'The public PCs and CIRC-01 run all night, and the keylogger fired after hours. Forecast: 84 hours a week with nobody.'}];
const LB_BUDGET = 30;

/* ---------- The directive (game): the Board wants the overnight restore dropped ---------- */
const LB_DIRECTIVE = {
  manager: [
    {label: 'Lay out what the restore does and costs, with options: Director Strand decides', good: true},
    {label: 'Refuse: a restore is a security control, and a library board has no say over controls', why: 'The PCs are the Library’s service. You inform the decision; the Director owns it.'},
    {label: 'Drop it quietly: the logoff restore covers most of it, and the Board will be happier', why: 'Dropping a control without telling the owner what it costs is how the next keylogger lasts a week.'},
    {label: 'Ask the Mayor to overrule the Board, since the Compact pays for the Library’s IT', why: 'The Compact runs the IT; the Library decides its service. Going over their heads loses the member.'}],
  dfir: [
    {label: 'Give the Board the case’s facts and the options with their costs: Director Strand decides', good: true},
    {label: 'Tell the Board the report’s recommendation is final, and the restore stays as written', why: 'A report recommends. The Director decides, knowing what each option costs.'},
    {label: 'Say it no longer matters: the keylogger is gone, and PUB-PC-04 has been restored', why: 'The next program a patron leaves behind is why the restore exists; the facts from this case say so.'},
    {label: 'Say nothing: a consultant answers to counsel, and never speaks to a library board at all', why: 'Facts from the case can be given where counsel agrees, and Noor does. Silence leaves the Board guessing.'}]};

/* ---------- DFIR F1: the scoping letter (game) ---------- */
const LB_LETTER = [
  {label: 'Go through the three questions and the scope before collecting anything new', good: true},
  {label: 'Image every PC in the Library and the Compact’s servers first, so nothing is missed later', why: 'The letter scopes the Library’s public PCs, LIB-GUEST, the circulation PCs and CIRC-01. Collecting outside it isn’t yours to do.'},
  {label: 'Start with the suspicion file: you know it best, and the Library sits on the same directory', why: 'The Library engaged us for three questions. A finding outside them goes to Noor first.'},
  {label: 'Ask Noor to let the Director tell patrons today, before anyone knows what the program recorded', why: 'Whether and how patrons are told is Noor’s decision, on facts the firm hasn’t found yet.'}];

/* ---------- DFIR F2: evidence intake, custody log and hashes ---------- */
// Each item: what arrives, and the right way to log it (game). E-01's collection form depends on the prologue
// (with Paz grown it carries its acquisition hash; otherwise it doesn't: a custody gap, recorded as one).
const LB_INTAKE = {
  e01ok: {id: 'E-01', what: 'PUB-PC-04 disk image', form: 'Imaged {IMG} by Juno with a write blocker; collection form signed by the acting team lead; SHA-256 at acquisition recorded on the form.',
    opts: [{label: 'Hash it on receipt, compare it with the form, seal the original, work on a copy', good: true},
           {label: 'Open the image directly to save time: it is already a copy of the disk', why: 'Work on a copy of the image, never the sealed original; that is what makes a second check possible.'},
           {label: 'Hash it, but skip the form: matching hashes are all the custody anyone needs', why: 'The hash shows the file hasn’t changed; the form shows who had it, and when. Custody is both.'},
           {label: 'Seal a copy on the firm’s shared drive beside Oxlow’s files, where Theo can reach it', why: 'One store per client. The Library’s evidence stays in the Library’s store.'}]},
  e01gap: {id: 'E-01', what: 'PUB-PC-04 disk image', form: 'Imaged {IMG} by Juno with a write blocker; collection form signed by the acting team lead; the SHA-256 box is empty.',
    opts: [{label: 'Hash it now and log the gap: the form has no collection hash; seal it, use a copy', good: true, gap: true},
           {label: 'Write your receipt hash into the empty box on the collection form, so the record is complete', why: 'That makes the form say something nobody recorded at collection. A gap is written down as a gap.'},
           {label: 'Refuse the image: without a collection hash it is worthless as evidence', why: 'It is still evidence. Record the gap, hash it on receipt, and say plainly in the report what the gap means.'},
           {label: 'Carry on without mentioning it: nobody reads collection forms, and the image looks fine', why: 'A gap found later, unrecorded, undermines everything built on the image. Record it now.'}]},
  e02: {id: 'E-02', what: 'Booking system export, Day 1', form: 'Exported 08:40 Day 2 by Juno; SHA-256 at export recorded.',
    opts: [{label: 'Compare its hash with the export’s: log who handed it over, seal the evidence, use a copy', good: true},
           {label: 'Leave it unsealed and read the sessions in the booking system itself instead', why: 'The live system keeps changing; the export is the fixed record. Use the export, logged and hashed.'},
           {label: 'Paste the sessions into the report draft, then delete the file once its hash is in the log', why: 'The export is the source the report rests on. It stays sealed in the store.'},
           {label: 'Accept it as it is: Juno is careful, so there is no need to compare hashes', why: 'The check is about the file, not Juno. Compare the hashes for every item.'}]},
  e03: {id: 'E-03', what: 'Patron-network flow records', form: 'Exported by Magda’s team; the form says 15:00 Day 1 to 08:00 Day 2; the file covers 14:00 to 08:00; the hash on receipt doesn’t match the form.',
    opts: [{label: 'Log the mismatch and ask for the export they hashed; keep both records', good: true, gap: true},
           {label: 'Use it as it is: an extra hour of flows can only help, whatever the form says', why: 'The form and the file disagree, so the record doesn’t say what you have. Record it and get the export they hashed.'},
           {label: 'Trim the file back to 15:00 and hash it again, so it matches the form', why: 'Editing evidence to fit the paperwork is the one thing custody exists to prevent.'},
           {label: 'Throw it out and work the case without any flow records', why: 'The flows answer question 2. Fix the record; don’t lose the evidence.'}]},
  e04: {id: 'E-04', what: 'CIRC-01 Security log export', form: 'Day 1 00:00 to Day 2 08:00, exported 08:50 Day 2 by Juno; SHA-256 at export recorded.',
    opts: [{label: 'Hash it: compare with the export hash, log the handover, seal it, use a copy', good: true},
           {label: 'Read it on CIRC-01 itself: the server’s viewer shows the same events, so no hash is needed', why: 'Reading on the live server changes it and isn’t the record you were handed. Use the logged export.'},
           {label: 'Skip it: the keylogger was on a public PC, not on the circulation server', why: 'Question 2 asks whether it reached Shelfwright. CIRC-01’s log is how you answer.'},
           {label: 'Hash it and send the copy to Rae, since CIRC-01 is on the town’s directory', why: 'It is the Library’s evidence under Noor’s letter. Anything outside the questions goes to Noor first.'}]}
};

/* ---------- DFIR F3: one evidence store per client ---------- */
const LB_STORES = [
  {label: 'Separate stores: Lucia and both clients’ counsel decide whether anything is shared', good: true},
  {label: 'Put E-01 in Oxlow’s folder: the same family on two clients is one case, and one evidence folder is faster', why: 'Two clients, two stores. Mixing them can expose one client’s evidence to the other and taint both.'},
  {label: 'Send Oxlow a copy of E-01, since a keylogger in their township may be the same one', why: 'What one client’s evidence may be shared with another is not yours to decide. Lucia and both clients’ counsel do.'},
  {label: 'Keep them apart, and never mention the match, even to either client’s counsel, so nobody can complain', why: 'A match that might matter goes to the people who can decide what to share: Lucia and both clients’ counsel.'}];

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const LB_DRILLS = {
  pcmgr: {
    id: 'pcmgr', title: 'The on-call note on PUB-PC-04', budget: 2,
    intro: '<p>Night 1’s on-call lead handled the keylogger alert on PUB-PC-04 and left a note. You are reviewing the record, not the person: was it a leftover from a patron session, or a staff-side compromise?</p>',
    artefact: '<pre class="art">On-call note · PUB-PC-04 · Night 1 18:41 (game data)\n' +
      'Alert     Keylogger.Generic (high): keyboard hook, unsigned program\n' +
      'Program   kbhelper.exe\n' +
      'Done      {DONE}\n' +
      '          (powered) · disk imaged {IMG}\n' +
      'Note      “Could be anything. Staff use that row for printing.”</pre>' +
      '<p class="small">An alert says what a rule matched. The endpoint record says which account wrote the file, and when; the booking log says whose session was open.</p>',
    question: 'A leftover from a patron session, or a staff-side compromise?',
    sources: [
      {id: 'note', name: 'The on-call note', qs: [
        {q: 'How serious is the alert?', kind: 'trap', res: ['Keylogger.Generic, severity high. The rule fires on any keyboard hook by an unsigned program.', '(Severity is how the rule was written. It says nothing about how the program got there.)']}]},
      {id: 'blog', name: 'A vendor’s blog post', qs: [
        {q: 'What does the vendor say about this family?', kind: 'trap', res: ['A security vendor’s blog ties the family name to a banking-fraud crew.', '(A family name is a label. It doesn’t say who put this copy on this PC, or when.)']}]},
      {id: 'edr', name: 'The endpoint record for PUB-PC-04', qs: [
        {q: 'When did kbhelper.exe first appear, and under which account?', kind: 'focus', key: true,
         res: ['First seen Day 1 15:12, written by the browser in the shared patron session: a download', 'A Run entry added in the patron profile at 15:12: it starts at every patron logon', 'No staff account signed in to PUB-PC-04 in its 30 days of records']},
        {q: 'Every endpoint event on PUB-PC-04 this week', kind: 'broad', rows: 18400,
         wall: ['{t}  process  explorer.exe     patron', '{t}  process  browser.exe      patron', '{t}  file     \\Users\\patron\\Downloads\\form-{n}.pdf', '{t}  logon    patron   booking B-22{n}']}]},
      {id: 'booking', name: 'The PC booking log', qs: [
        {q: 'Whose session was open on PUB-PC-04 at 15:12?', kind: 'focus', key: true,
         res: ['B-2231, card 29000•••••4417, 15:00–16:00 Day 1', 'Then B-2232 16:00–17:00, B-2233 17:00–18:00, B-2234 18:00–19:00', 'No staff booking: staff print from the circulation PCs, not this row']}]}
    ],
    ai: {everything: {text: 'A high-severity keylogger tied by a vendor to a banking-fraud crew, on a row staff use for printing, suggests a targeted staff-side compromise. Recommend treating staff credentials as exposed.', wrong: true,
                      reveal: 'Tally added up the severity, the vendor’s label and the note’s guess. It never read which account wrote the file, or whose session was open.'},
         specific: {q: 'Which account wrote kbhelper.exe on PUB-PC-04?', text: 'The shared patron account, through the browser, at 15:12 on Day 1.'}},
    verdicts: [
      {label: 'A leftover from a patron session: the patron account wrote it at 15:12, in B-2231’s hour; no staff sign-in', good: true, needs: 'edr',
       needsWhy: 'the booking log says whose session was open; only the endpoint record shows which account wrote the file, and when.',
       why: 'The endpoint record and the booking log tell one story.'},
      {label: 'Staff-side: a high-rated keylogger from a known fraud crew means someone went after the staff who print there', why: 'Severity and a family name don’t say how it got there. The record shows the patron account, and no staff sign-in.'},
      {label: 'Can’t be told apart until every PC in the Library has been imaged and examined', why: 'For this PC the endpoint record and the booking log already decide it. Imaging everything is scope by worry.'}],
    reasons: [
      {label: 'The endpoint record: the patron account at 15:12, with a Run entry; the booking log: B-2231', good: true, why: 'Who wrote it, and whose session it was, each from its own record.'},
      {label: 'Keylogger.Generic is rated high, and fraud crews go after staff, so a staff-side story is the likelier one', why: 'A rating and a crew’s habits fit both stories.'},
      {label: 'The on-call lead says staff use that row for printing, so a staff member must have picked it up there', why: 'The booking log shows no staff booking; the note’s line was a guess.'}],
    alts: [
      {label: 'A staff account signed in and installed it', good: true, why: 'Ruled out: no staff sign-in on PUB-PC-04 in 30 days.'},
      {label: 'It arrived over the network from a staff PC', good: true, why: 'Ruled out: the browser in the patron session wrote it, from a download.'},
      {label: 'The vendor’s fraud crew going after libraries in the region', why: 'Nothing points to it; a family name isn’t an actor.'},
      {label: 'The alert rule misfiring', why: 'The program and its Run entry are real.'}],
    path: '<p>“Leftover or staff-side?” is decided by <b>the endpoint record</b> (which account wrote the file, and when) and <b>the booking log</b> (whose session was open then). Severity, family names and the note’s guess fit both stories.</p>',
    response: ['Keep the image and kbhelper.exe’s hash; only then restore PUB-PC-04', 'The Director and Noor get the bookings after 15:12 (B-2232 to B-2234); Noor decides whether and how those patrons are told', 'A booking shows whose card booked the PC, not who sat at it: the note names nobody', 'Tell the on-call lead in private what the note was missing: the source behind “staff use that row”'],
    techs: ['T1056.001'], acts: ['crrestore']
  },
  pcdfir: {
    id: 'pcdfir', title: 'Question 1: kbhelper.exe on PUB-PC-04', budget: 3,
    intro: '<p>The scoping letter’s first question: what is the program on PUB-PC-04, and how did it get there? Your copies of E-01 to E-03 are on the bench. This finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case LIB-01 · question 1 (game data)\n' +
      'E-01  PUB-PC-04 disk image (your working copy)\n' +
      'E-02  booking system export, Day 1\n' +
      'E-03  patron-network flow records\n' +
      'Alert Keylogger.Generic (high), Night 1 18:41</pre>' +
      '<p class="small">The image dates the file and names its profile; the booking export says whose session was open then.</p>',
    question: 'A leftover from a patron session, or a staff-side compromise?',
    sources: [
      {id: 'alert', name: 'The alert', qs: [
        {q: 'How serious is it?', kind: 'trap', res: ['Keylogger.Generic, severity high.', '(How the rule was written, not how the program got there.)']}]},
      {id: 'blog', name: 'A vendor’s blog post', qs: [
        {q: 'Who uses this family?', kind: 'trap', res: ['A vendor ties the family name to a banking-fraud crew.', '(A label, not this copy’s history.)']}]},
      {id: 'image', name: 'E-01: the disk image (copy)', qs: [
        {q: 'When was kbhelper.exe created, and in which profile?', kind: 'focus', key: true,
         res: ['Created Day 1 15:12:06 in C:\\Users\\patron\\AppData\\Roaming\\kbhelper\\, the shared patron profile', 'Run entry in the patron profile’s registry hive, written 15:12:09', 'Browser history in that profile: a download at 15:11; no staff profile on the disk, no staff sign-in in its Security log']},
        {q: 'Every file changed on the disk that day', kind: 'broad', rows: 26800,
         wall: ['{t}  modified  \\Users\\patron\\AppData\\Local\\Temp\\~tmp{n}.dat', '{t}  created   \\Users\\patron\\Downloads\\doc-{n}.pdf', '{t}  modified  \\Windows\\Prefetch\\BROWSER.EXE-{n}.pf']}]},
      {id: 'booking', name: 'E-02: the booking export', qs: [
        {q: 'Whose session was open at 15:12?', kind: 'focus', key: true,
         res: ['B-2231, card 29000•••••4417, 15:00–16:00 Day 1', 'B-2232, B-2233 and B-2234 followed, one an hour, until 19:00']}]},
      {id: 'flows', name: 'E-03: flow records', qs: [
        {q: 'Did PUB-PC-04 talk to CIRC-01 or any staff address?', kind: 'focus', key: true,
         res: ['No connection from PUB-PC-04 to CIRC-01, the circulation PCs or any staff address all day', 'Three small HTTPS uploads to 203.0.113.88: 2 KB at 16:58, 6 KB at 17:57, 4 KB at 18:38']}]}
    ],
    verdicts: [
      {label: 'A leftover from B-2231’s session: a download into the patron profile at 15:12; no staff profile or sign-in', good: true, needs: ['image', 'booking'],
       needsWhy: 'the finding rests on two sources: E-01 dates the file and names the profile, and E-02 says whose session that was. You read only one of them.',
       why: 'E-01 and E-02 each decide their half.'},
      {label: 'Staff-side: a high-rated keylogger from a known fraud crew, on a network the staff share with the patrons', why: 'The image shows the patron profile and no staff sign-in; the flows show no staff connection.'},
      {label: 'Unknown until every public PC and CIRC-01 has been imaged and examined', why: 'For PUB-PC-04, E-01 and E-02 answer it. Everything else is outside question 1.'}],
    reasons: [
      {label: 'E-01 dates the file and its Run entry to 15:12 in the patron profile, and E-02 puts B-2231 on the PC then', good: true, why: 'Each half of the finding from its own source.'},
      {label: 'The flat network let any staff PC reach PUB-PC-04, so a staff PC is as likely a source as any patron session', why: 'Could have is not did: the flows show no staff connection, and the image shows a download.'},
      {label: 'The vendor names a crew that goes after organisations through their staff, not their visitors', why: 'A crew’s habits say nothing about this copy.'}],
    alts: [
      {label: 'It came over the network from a staff PC', good: true, why: 'Ruled out: a browser download in the patron session, and no staff connection in E-03.'},
      {label: 'The next patron (B-2232) installed it', good: true, why: 'Ruled out: it was created at 15:12, in B-2231’s hour.'},
      {label: 'A grudge against the Library from someone who was banned', why: 'Nothing points to a motive; the report doesn’t guess one.'},
      {label: 'The alert rule misfiring', why: 'The file and its Run entry are on the image.'}],
    path: '<p>Two decisive sources: <b>E-01</b> (when the file was created and in which profile) and <b>E-02</b> (whose session that was). E-03 rules out the network route. Severity and family names decide nothing.</p>',
    response: ['Hash kbhelper.exe and keep it with E-01; PUB-PC-04 is restored only after', 'Question 3 for Noor: sessions B-2232 to B-2234 could have been recorded', 'A booking proves whose card booked the PC, not who sat at it: the report names no one', 'Recommend restore at logoff and overnight, and LIB-GUEST on its own network'],
    techs: ['T1056.001'], acts: ['crcustody']
  },
  pastemgr: {
    id: 'pastemgr', title: 'A paste site says it has our patrons', budget: 2,
    intro: '<p>07:30: a post on paste.example (game) claims the Library’s patron database. Dot has had two calls already. Is it ours, and what does it contain? The firm can compare the sample on retainer hours, and the vendor’s escalation line can read Shelfwright’s audit log.</p>',
    artefact: '<pre class="art">paste.example · Day 4 07:30 (game data)\n' +
      'Title   town library patron DB · 2.4 million rows · Shelfwright\n' +
      'Poster  a forum account with a long record of real leaks\n' +
      'Sample  25 rows: name, email, date of birth,\n' +
      '        card no. (10 digits, 7…), last 5 checkouts</pre>' +
      '<p class="small">A claim says what someone wants believed. Our own schema and card format say whether the sample could be ours; the system’s own records say whether anything left.</p>',
    question: 'Is it ours, and what does it contain?',
    sources: [
      {id: 'poster', name: 'The poster’s record', qs: [
        {q: 'How reliable is the poster?', kind: 'trap', res: ['Eleven leaks in two years; the forum rates the account “trusted”.', '(A record of real leaks makes a claim plausible. It doesn’t make it ours.)']}]},
      {id: 'headline', name: 'The post’s headline', qs: [
        {q: 'How big is the claim?', kind: 'trap', res: ['2.4 million rows: about ninety times the Library’s 26,500 cardholders.', '(Size alone decides nothing: padded data and someone else’s real data both look big.)']}]},
      {id: 'compare', name: 'Tallowmere’s sample comparison', qs: [
        {q: 'Does the sample match what Shelfwright holds for us?', kind: 'focus', key: true,
         res: ['Cards: the sample’s are 10 digits starting 7; ours are 14 digits starting 29000. None of the 25 is ours', 'Fields: dates of birth (we stopped collecting them in 2021) and checkout lists (Shelfwright keeps no borrowing history here)', 'Two of the 25 names match a cardholder of ours; neither email does']}]},
      {id: 'audit', name: 'Shelfwright’s audit log (the vendor’s line)', qs: [
        {q: 'Was anything exported in bulk?', kind: 'focus', key: true,
         res: ['No bulk export in 90 days except the 04:00 holds-notice job: 300 to 500 rows a night, to the notice service', 'The backup job’s log: no copy restored or taken off the server in 90 days', 'sw-support last signed in 41 days ago, from the vendor’s documented range']},
        {q: 'Every audit entry for 90 days', kind: 'broad', rows: 91300,
         wall: ['{t}  login    staff  desk-0{i}', '{t}  checkout card 29000•••••{n}', '{t}  export   holds-notice  4{n} rows  notice-svc', '{t}  return   item 31{n}']}]}
    ],
    verdicts: [
      {label: 'Another library’s data: our card format and fields don’t match the sample, and nothing left in bulk', good: true, needs: 'compare',
       needsWhy: 'the audit log shows nothing left in bulk; only the comparison shows the sample can’t be ours.',
       why: 'The comparison and the audit log agree.'},
      {label: 'Ours: a trusted poster with eleven real leaks, naming our system, is enough to tell the Director it happened', why: 'Reputation isn’t a record. The sample’s cards and fields don’t match ours.'},
      {label: 'Can’t say: two names match cardholders of ours, so until the poster sends more rows it could be ours', why: 'Common names match anywhere. The cards, the fields and the audit log decide it.'}],
    reasons: [
      {label: 'Nothing matches: its cards, birth dates and checkout lists aren’t ours, and nothing left in bulk', good: true, why: 'The sample against our records, and the system’s own export record.'},
      {label: 'A claim of 2.4 million rows is far beyond our 26,500 cardholders, so none of it can be ours at all', why: 'Size can’t rule data in or out: ours could be padded inside it.'},
      {label: 'A poster the forum rates trusted wouldn’t stake that name on a fake, so some of it must be ours', why: 'The poster’s record says nothing about this sample.'}],
    alts: [
      {label: 'Our data mixed into someone else’s set', good: true, why: 'Ruled out: none of the 25 cards is ours, and nothing left in bulk.'},
      {label: 'A copy taken from a backup, not an export', good: true, why: 'Ruled out: no backup restored or taken off the server in 90 days.'},
      {label: 'A former staff member posting it under a forum name', why: 'Nothing points to it, and the data isn’t ours.'},
      {label: 'The forum faking the poster’s rating', why: 'Beside the point: the sample decides it.'}],
    path: '<p>A leak claim is decided by <b>the sample against your own records</b> (formats and fields) and by <b>the system’s export record</b>. The claim’s size and the poster’s reputation fit a true claim and a false one alike.</p>',
    response: ['Tell Shelfwright Systems: another customer may be affected, and what follows for them is the vendor’s to decide', 'Director Strand and Noor get the comparison; Noor decides whether anything more is needed', 'Capture the post for the record', 'Say only what we know: our records don’t match the sample'],
    techs: ['T1657'], acts: ['crclaim']
  },
  pastedfir: {
    id: 'pastedfir', title: 'A paste site says it has our patrons', budget: 3,
    intro: '<p>07:30: a post on paste.example (game) claims the Library’s patron database. Noor asks the firm under the same letter (Shelfwright on CIRC-01 is in scope): is it ours, and what does it contain? The finding needs two sources.</p>',
    artefact: '<pre class="art">paste.example · Day 4 07:30 (game data)\n' +
      'Title   town library patron DB · 2.4 million rows · Shelfwright\n' +
      'Poster  a forum account with a long record of real leaks\n' +
      'Sample  25 rows: name, email, date of birth,\n' +
      '        card no. (10 digits, 7…), last 5 checkouts\n' +
      'E-05    Shelfwright audit log export, CIRC-01, 08:00 Day 4</pre>' +
      '<p class="small">The sample against the schema says whether it could be ours; E-05 says whether anything left.</p>',
    question: 'Is it ours, and what does it contain?',
    sources: [
      {id: 'poster', name: 'The poster’s record', qs: [
        {q: 'How reliable is the poster?', kind: 'trap', res: ['Eleven leaks in two years; rated “trusted”.', '(Plausible is not ours.)']}]},
      {id: 'headline', name: 'The post’s headline', qs: [
        {q: 'How big is the claim?', kind: 'trap', res: ['2.4 million rows, about ninety times our 26,500 cardholders.', '(Size decides nothing either way.)']}]},
      {id: 'sample', name: 'The sample against Shelfwright’s schema', qs: [
        {q: 'Could these rows have come from our Shelfwright?', kind: 'focus', key: true,
         res: ['Cards: 10 digits starting 7; ours are 14 digits starting 29000. None of the 25 is ours', 'Our schema has no date-of-birth field since 2021 and no borrowing history; the sample has both', 'Two names match a cardholder of ours; neither email does']}]},
      {id: 'audit', name: 'E-05: Shelfwright audit log export', qs: [
        {q: 'Was anything exported in bulk in its 90 days?', kind: 'focus', key: true,
         res: ['Only the 04:00 holds-notice job: 300 to 500 rows a night, to the notice service', 'No backup copy restored or taken off the server in 90 days', 'sw-support: last sign-in 41 days ago, from the vendor’s documented range']},
        {q: 'Every audit entry for 90 days', kind: 'broad', rows: 91300,
         wall: ['{t}  login    staff  desk-0{i}', '{t}  checkout card 29000•••••{n}', '{t}  export   holds-notice  4{n} rows  notice-svc']}]}
    ],
    verdicts: [
      {label: 'Another library’s data: the schema can’t produce these rows, and E-05 shows no bulk export', good: true, needs: ['sample', 'audit'],
       needsWhy: 'the finding rests on two sources: the schema comparison (could it be ours?) and E-05 (did anything leave?). You read only one.',
       why: 'Both halves, each from its own source.'},
      {label: 'Ours: a trusted poster with real leaks behind them, naming our system, is evidence enough', why: 'A reputation isn’t a record; the sample doesn’t fit our schema.'},
      {label: 'Unknown: two names match cardholders of ours, so it may be ours until the poster proves otherwise', why: 'Names collide everywhere. The schema and E-05 decide it.'}],
    reasons: [
      {label: 'Our schema can’t produce those rows, and E-05 records no bulk export', good: true, why: 'The schema for the sample, E-05 for what left.'},
      {label: '2.4 million rows is ninety times our cardholders, so the claim can’t be about us at all', why: 'Size neither rules ours in nor out.'},
      {label: 'Eleven real leaks in two years make this poster the likeliest honest source on the forum', why: 'The poster’s past says nothing about this sample.'}],
    alts: [
      {label: 'Our rows hidden among someone else’s', good: true, why: 'Ruled out: none of the 25 cards is ours, and E-05 shows no bulk export.'},
      {label: 'A backup copy taken off the server', good: true, why: 'Ruled out: no backup restored or moved in 90 days.'},
      {label: 'A former staff member posting it', why: 'Nothing points to it.'},
      {label: 'The poster wanting money from the Library for silence', why: 'Possible, and beside the point: the sample decides it.'}],
    path: '<p>Two decisive sources: <b>the sample against our schema</b> (formats and fields) and <b>E-05</b> (exports). The claim’s size and the poster’s reputation decide nothing.</p>',
    response: ['Report to Noor: not from the Library’s Shelfwright, with both comparisons', 'Noor decides what Shelfwright Systems is told; another customer may be affected', 'Capture the post and hash the capture into the custody log', 'Say only what we know: our records don’t match the sample'],
    techs: ['T1657'], acts: ['crclaim']
  },
  aar: {
    id: 'aar', title: '“Root cause: user error”', budget: 2,
    intro: '<p>Ruth Avila took the morning follow-up on PUB-PC-04 and wrote the after-action review. Every AAR gets a second look. Was its root cause supported?</p>',
    artefact: '<pre class="art">AAR · PUB-PC-04 keylogger · Ruth Avila (game data)\n' +
      'Root cause  user error: a patron installed a keylogger\n' +
      'Action      a sign at the PCs: do not install software\n' +
      'Timeline    15:12 download in B-2231 · 18:41 alert ·\n' +
      '            three sessions in between</pre>' +
      '<p class="small">An AAR asks why something worked and why it stayed. The PCs’ build record says what the patron’s session was allowed to do.</p>',
    question: 'Is “user error” supported as the root cause?',
    sources: [
      {id: 'ruth', name: 'Ruth’s record', qs: [
        {q: 'How experienced is Ruth with endpoints?', kind: 'trap', res: ['Ruth led the Clerks’ Row worm containment; nobody in the Compact knows endpoints better.', '(Experience makes a good AAR likelier. It doesn’t show this one is supported.)']}]},
      {id: 'terms', name: 'The PC terms of use', qs: [
        {q: 'What did the patron agree to?', kind: 'trap', res: ['Patrons accept at the booking screen: do not install software.', '(A broken rule explains the trigger, not why it worked.)']}]},
      {id: 'build', name: 'The public PCs’ build record', qs: [
        {q: 'What could a patron session do on these PCs?', kind: 'focus', key: true,
         res: ['The shared patron profile can write to AppData and add Run entries: no application control on the public PCs', 'Restore at logoff and overnight: off since the restore software’s licence lapsed in 2023; nobody owned the renewal', 'LIB-GUEST shared one flat network with CIRC-01 until Day 3']}]},
      {id: 'timeline', name: 'The AAR’s own timeline', qs: [
        {q: 'Why did it stay through three sessions?', kind: 'focus', key: true,
         res: ['Nothing restored the PC between sessions, so the Run entry started it at each patron logon', 'No staff sign-in on PUB-PC-04 at any point']},
        {q: 'Every line of the AAR’s source notes', kind: 'broad', rows: 640,
         wall: ['{t}  note  Juno: PC unplugged, powered', '{t}  note  booking B-22{n} checked', '{t}  note  endpoint event {n}']}]}
    ],
    verdicts: [
      {label: 'Not supported: a patron set it off, but the build record shows why it worked and stayed', good: true, needs: 'build',
       needsWhy: 'the timeline shows it stayed; only the build record shows why a patron session could do it at all.',
       why: 'The trigger was a patron’s; the causes were the build’s.'},
      {label: 'Supported: the patron broke the terms of use they accepted, and the AAR says so plainly', why: 'A broken rule is the trigger. The build record shows a session allowed to install, and no restore since 2023.'},
      {label: 'Supported, and the action should be stronger: bar the cardholder from the public PCs as well as the sign', why: 'Blaming harder changes nothing on the PCs; the next patron could do the same.'}],
    reasons: [
      {label: 'No restore since 2023, and a profile that could add Run entries: the act was only the trigger', good: true, why: 'Why it worked and why it stayed, from the build record.'},
      {label: 'Ruth has handled more endpoint incidents than anyone in the Compact, so her root cause should stand', why: 'Experience isn’t a source.'},
      {label: 'The terms of use forbid installing software, so the incident follows from the patron breaking them', why: 'A rule explains what was forbidden, not what was possible.'}],
    alts: [
      {label: 'The restore was on and failed that day', good: true, why: 'Ruled out: off since the licence lapsed in 2023.'},
      {label: 'A staff member’s mistake let it in', good: true, why: 'Ruled out: no staff sign-in on PUB-PC-04.'},
      {label: 'Ruth covering for someone on the Library’s staff', why: 'Nothing points to it; a review is about the evidence, not a motive.'},
      {label: 'The patron meaning no harm', why: 'Beside the point: the AAR is about why it worked.'}],
    path: '<p>An AAR’s root cause is decided by <b>the build or configuration record</b> (what the system allowed) and <b>the timeline</b> (why it stayed). Seniority and the terms of use fit a sound AAR and a blaming one alike.</p>',
    response: ['Rewrite it blameless: the trigger, the contributing factors (no restore since 2023, a writable autostart, the flat network) and what changes', 'Each action with an owner and a date: the restore (Director Strand, done), application control on the public PCs (the Compact), the licence renewal owned (Director Strand)', 'Coach Ruth in private: an AAR asks why it worked, not who to blame', 'The sign can stay; it changes nothing on its own'],
    techs: ['T1056.001'], acts: ['craar']
  },
  clocks: {
    id: 'clocks', title: 'Two timelines, five hours apart', budget: 3,
    intro: '<p>Theo’s two timelines of the keylogger disagree. Timeline 1 has kbhelper.exe created at 15:12, inside B-2231. Timeline 2 has it at 20:12, after the Library closed at 20:00, which would point at the closing staff. Which is defensible? The finding needs two sources.</p>',
    artefact: '<pre class="art">Theo Marchetti · LIB-01 timelines (game data)\n' +
      'T1  15:00 B-2231 starts · 15:12 kbhelper.exe created\n' +
      '    15:12 Run entry · 18:41 alert            31 entries\n' +
      'T2  15:00 B-2231 starts · 18:41 alert\n' +
      '    20:12 kbhelper.exe created (after close)  48 entries</pre>' +
      '<p class="small">A timeline is only as good as its clocks. Each source’s header says its time zone; the analyst’s notes say what was converted.</p>',
    question: 'Which timeline is defensible?',
    sources: [
      {id: 'length', name: 'The two timelines side by side', qs: [
        {q: 'Which one is more detailed?', kind: 'trap', res: ['Timeline 2 has 48 entries; Timeline 1 has 31.', '(More rows isn’t more right.)']}]},
      {id: 'theo', name: 'Ask Theo', qs: [
        {q: 'Which one does he stand behind?', kind: 'trap', res: ['Theo: “Timeline 2. I spent the night on it.”', '(Effort and certainty are his, not the evidence’s.)']}]},
      {id: 'pref', name: 'Director Strand', qs: [
        {q: 'Which would the Library prefer?', kind: 'trap', res: ['“The second one, please: it doesn’t point at a patron.”', '(The client’s hope changes nothing a report can say.)']}]},
      {id: 'header', name: 'The endpoint export’s header', qs: [
        {q: 'What clock are its times in?', kind: 'focus', key: true,
         res: ['Header: “All times UTC” (game)', 'kbhelper.exe created 20:12:06 UTC; the town is on UTC−5 this season: 15:12:06 local', 'PUB-PC-04’s clock against the time server: 2 seconds off']}]},
      {id: 'notes', name: 'Theo’s working notes', qs: [
        {q: 'What did he convert, in each timeline?', kind: 'focus', key: true,
         res: ['Timeline 1: endpoint times converted from UTC to local (−5 h); booking times already local: one clock', 'Timeline 2: endpoint times taken as local, booking times local: two clocks in one table', 'Neither timeline writes its conversion at the top']},
        {q: 'Every raw entry behind both timelines', kind: 'broad', rows: 3100,
         wall: ['{t}Z  endpoint  process  explorer.exe', '{t}   booking   B-22{n}  start', '{t}Z  endpoint  file  \\Users\\patron\\{n}.tmp']}]}
    ],
    verdicts: [
      {label: 'Timeline 1: the export is in UTC and Theo converted it; Timeline 2 mixes two clocks', good: true, needs: ['header', 'notes'],
       needsWhy: 'the finding rests on two sources: the header (which clock the times are in) and Theo’s notes (what he converted). You read only one.',
       why: 'One clock in Timeline 1; two in Timeline 2.'},
      {label: 'Timeline 2: more entries, Theo is surer of it, and the Director prefers it', why: 'None of those is a clock. The header says UTC, and Timeline 2 read it as local.'},
      {label: 'Neither: two timelines that disagree by five hours mean the evidence can’t date the file at all', why: 'The disagreement has a cause, written in the header and the notes. Once found, the file is dated.'}],
    reasons: [
      {label: 'The header says UTC; 20:12 UTC is 15:12 local; Theo’s notes show Timeline 2 read it as local', good: true, why: 'The clock from the header, the mistake from the notes.'},
      {label: 'Timeline 2 puts the drop after closing, which keeps every patron out of it', why: 'What the client would like is not a source.'},
      {label: 'A longer timeline draws on more sources, so its times are more likely to be the right ones', why: 'Rows don’t fix a clock.'}],
    alts: [
      {label: 'PUB-PC-04’s own clock was five hours off', good: true, why: 'Ruled out: 2 seconds off the time server.'},
      {label: 'A second copy created at 20:12', good: true, why: 'Ruled out: one create event, at 20:12:06 UTC.'},
      {label: 'Theo shading it to please the client', why: 'Nothing points to it; his notes show a clock mistake, not a motive.'},
      {label: 'The booking system’s clock being wrong', why: 'Beside the point: the five hours are the UTC offset.'}],
    path: '<p>Two decisive sources: <b>the export header</b> (which clock) and <b>the analyst’s notes</b> (what was converted). Length, certainty and the client’s preference decide nothing.</p>',
    response: ['File Timeline 1, with the conversion written at its top: UTC to local, −5 hours, every source named', 'Withdraw Timeline 2, and say why, before anyone relies on it', 'Coach Theo in private: one clock per timeline, and the conversion in writing', 'The Director’s preference changes nothing: the report follows the evidence'],
    techs: ['T1056.001'], acts: ['crclock']
  }
};

/* ---------- DFIR report 1: the keylogger findings, for Noor ---------- */
const LB_REPORT_PC = {
  title: 'LIB-01: kbhelper.exe on PUB-PC-04', audience: 'Noor Castellanos, counsel for the Library',
  intro: '<p>Six findings for Noor, each from the evidence in the custody log.</p>',
  claims: [
    {id: 'when', text: 'kbhelper.exe was written to the shared patron profile at 15:12 on Day 1, during booking B-2231.', truth: 'confirmed',
     evidence: ['E-01: created 15:12:06 in the patron profile; Run entry 15:12:09', 'E-02: B-2231 15:00–16:00 on PUB-PC-04'], why: 'The image dates it, the booking export places it.'},
    {id: 'record', text: 'It recorded keystrokes in sessions B-2232, B-2233 and B-2234.', truth: 'confirmed',
     evidence: ['E-01: kbhelper’s own log file holds keystrokes stamped inside each of the three sessions', 'E-02: those sessions followed B-2231 on PUB-PC-04'], why: 'Its own log file shows it.'},
    {id: 'sent', text: 'Those keystrokes were sent to 203.0.113.88.', truth: 'likely',
     evidence: ['E-03: three uploads to 203.0.113.88 (2 KB, 6 KB, 4 KB), one near the end of each session', 'The uploads are encrypted: their contents can’t be read'], why: 'The timing points to it; the contents can’t be shown.'},
    {id: 'who', text: 'The cardholder of booking B-2231 installed it.', truth: 'likely',
     evidence: ['E-02: card 29000•••••4417 booked 15:00–16:00', 'E-01: the download happened in the shared patron profile at 15:11', 'A booking records whose card booked the PC, not who sat at it'], why: 'The booking points to the cardholder; it can’t show who was at the keyboard.'},
    {id: 'staff', text: 'Nothing on PUB-PC-04 reached CIRC-01, Shelfwright or any staff system.', truth: 'confirmed',
     evidence: ['E-03: no connection from PUB-PC-04 to CIRC-01, the circulation PCs or any staff address (complete for the patron network)', 'E-04: no sign-in on CIRC-01 from PUB-PC-04'], why: 'Two complete records agree.'},
    {id: 'reuse', text: 'Passwords typed in those sessions have been used elsewhere.', truth: 'unknown',
     evidence: ['Nothing in E-01 to E-04 can show what happened to the data after it left', 'The patrons’ accounts elsewhere are outside the letter’s scope'], why: 'No evidence in scope can say; Noor decides whether patrons are told to change them.'}]
};

/* ---------- DFIR report 2 (the boss, stage 3): what was taken ---------- */
const LB_REPORT_BOSS = {
  title: 'LIB-02: the holds export', audience: 'Noor Castellanos, counsel for the Library',
  intro: '<p>Six findings on the extortion claim, each from the evidence logged this morning.</p>',
  claims: [
    {id: 'export', text: 'sw-support exported 6,212 holds-notice rows at 02:41–02:44.', truth: 'confirmed',
     evidence: ['E-06: Shelfwright audit log: sw-support sign-in 02:38 from 192.0.2.77; manual holds-notice export 02:41–02:44, 6,212 rows; sign-out 02:47', 'The export file’s row count in the log matches'], why: 'The audit log records it.'},
    {id: 'fields', text: 'Each row holds a name, an email, a card number, a pickup branch and the title on hold.', truth: 'confirmed',
     evidence: ['E-06: the holds-notice export’s field list', 'The email’s 20 sample rows are all among the 6,212, with the same five fields'], why: 'The field list and the sample agree.'},
    {id: 'other', text: 'No other Shelfwright data was read in bulk that night.', truth: 'likely',
     evidence: ['E-07: the database query log shows no other bulk read', 'The query log records only queries that return more than 100 rows'], why: 'The log points to it, but smaller reads wouldn’t show.'},
    {id: 'password', text: 'The attacker used sw-support’s shared support password.', truth: 'likely',
     evidence: ['Shelfwright Systems: sw-support’s password is shared across its customers, last changed in 2022', 'E-06: the sign-in succeeded first time from an address outside the vendor’s range'], why: 'It fits; how they obtained it is not shown.'},
    {id: 'shared', text: 'The rows have been published or passed on.', truth: 'unknown',
     evidence: ['No copy found anywhere so far', 'Nothing in scope can show where the file went after 02:44'], why: 'Nothing in scope can say.'},
    {id: 'thread', text: 'The export is linked to svc-print and the suspicion file.', truth: 'unknown',
     evidence: ['No svc-print activity on CIRC-01 that night', 'Different account, different hour, a different way in: nothing ties them, and nothing rules a link out'], why: 'Nothing ties them; the question stays open.'}]
};

/* ---------- Dojos (original puzzles; concepts only) ---------- */
const LB_DOJO_MGR = [
  {q: 'The Board wants an update at 09:00 and the facts are half in. What must the update hold?',
   opts: ['What we know, what we don’t yet, what we’re doing, and when the next update comes',
          'The full technical timeline, so the Board can judge the response for itself',
          'A reassurance that it is under control, with the details to follow when they are certain'], good: 0,
   explain: 'An update with gaps is still on time if it says what the gaps are and when they close. A timeline is for the team; reassurance before the facts is a promise you may have to take back.'},
  {q: 'Two leads both think they own the call to the vendor, so neither makes it. What fixes it?',
   opts: ['One named owner for each action, written in the plan, with a deputy',
          'Both make the call, to be safe: two calls are better than none',
          'Whoever is more senior makes it, on the night'], good: 0,
   explain: 'Shared ownership is nobody’s. Two callers give the vendor two stories; seniority on the night is a decision you could have made in advance.'},
  {q: 'When should the IR manager call in the retainer?',
   opts: ['When the plan’s criteria are met, agreed in advance, not only once you’re sure',
          'Only once the team is certain the incident is serious enough to justify the cost',
          'At the first alert of any kind, so the firm is always there early'], good: 0,
   explain: 'Criteria agreed beforehand take the hesitation out of the call. Waiting for certainty loses the hours the firm is for; calling on every alert spends the retainer on noise.'}];
const LB_DOJO_DFIR = [
  {q: 'Which of these can be written as confirmed?',
   opts: ['The export ran at 02:41: the audit log records it, in the copy you logged',
          'The attacker is a former vendor employee: they knew exactly which support account to use',
          'The data will be published on Friday: the email says so'], good: 0,
   explain: 'Confirmed means the evidence shows it. Knowing an account points nowhere in particular; a threat is a claim about the future, not a finding.'},
  {q: 'The firewall kept no log for that night, and there is no record of an upload. What can you write?',
   opts: ['Unknown: with no log for the night, the absence of a record shows nothing',
          'Confirmed: no data left, because there is no record of an upload',
          'Likely: no data left, because uploads usually leave a record'], good: 0,
   explain: 'Absence of evidence is evidence only where something would have been recorded. No log, no inference: write unknown, and the next step.'},
  {q: 'One finding, three readers. Which line is the one for the Library Board?',
   opts: ['6,212 patrons’ names, emails and held titles were taken; who must be told is being decided',
          'SHA-256 of E-06: the export record is intact, and its hash matches at collection and on receipt',
          'The Library must notify every affected patron within the legal deadline'], good: 0,
   explain: 'The Board needs the impact in plain words and who is deciding what. The hash is for the technical record; what the law requires is counsel’s to say, not the report’s.'}];

/* ---------- The Library Board (original; Cyrus Hallowell; three rounds per track) ---------- */
const LB_BOARD_SPECS_MGR = () => [
  {title: 'Round 1: why pay into the Compact?', who: 'Cyrus Hallowell',
   ask: 'The Library pays a share of the Compact’s IR programme from next year (game). Tell us why.',
   resp: [{label: 'In the Library’s terms: what a bad week costs, what the share buys, when you report back', good: true},
          {label: 'Because libraries are easy targets, and without the programme you will be hacked within the year', why: 'Fear without numbers forces a decision instead of informing one.'},
          {label: 'The figures: our MTTC, the on-call SLA, the retainer’s hourly rate and the SIEM ingest per member', why: 'Accurate, and meaningless to the people deciding. Say what it costs and what it changes.'}]},
  {title: 'Round 2: the police and patron records', who: 'Cyrus Hallowell',
   ask: '“If the police ask the Compact for a patron’s records, will you hand them over?”',
   resp: [{label: 'No request is answered by the security team: it goes to Director Strand and Noor, who decide', good: true},
          {label: 'Yes: the police always get what they ask for, and Noor can sort out the paperwork later', why: 'Whether a request must be met, and how, is a legal question for Noor, and the Director decides for the Library.'},
          {label: 'No, never, whatever the law turns out to say, to protect patrons’ privacy', why: 'An absolute promise about the law is a legal answer. Noor gives those, and the Director decides.'}]},
  {title: 'Round 3: what changes now?', who: 'Director Mina Strand',
   ask: '“After the tabletop and this week, what changes, and how will the Board know?”',
   resp: [{label: 'The AAR’s actions: each with an owner and a date, and the Board sees them closed', good: true},
          {label: 'A new product for the public PCs: the vendor’s demo said it stops every keylogger there is', why: 'A purchase isn’t a change. Who does what, by when, and how the Board sees it done.'},
          {label: 'Nothing much: the tabletop went well, and the keylogger was dealt with', why: 'Every exercise and incident leaves actions with owners.'}]}];
const LB_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: was anyone’s data taken?', who: 'Cyrus Hallowell',
   ask: '“In the keylogger case: was anyone’s data taken?”',
   resp: [{label: 'The evidence: three sessions recorded and the data likely sent out; what each held is unknown', good: true},
          {label: 'No: the keylogger has been removed, so nothing can have been taken', why: 'Removing it now says nothing about what it sent before.'},
          {label: 'Yes: every patron who has ever used the public PCs is affected', why: 'The evidence covers three sessions, not every patron ever.'}]},
  {title: 'Round 2: who did it?', who: 'Cyrus Hallowell',
   ask: '“Can you tell us who did it? Name the patron.”',
   resp: [{label: 'A booking shows whose card booked the PC, not who sat there: the report names nobody', good: true},
          {label: 'Name the cardholder: the booking export is evidence of whose card it was', why: 'A card booking isn’t identity, and naming a person is not a finding the evidence supports.'},
          {label: 'Organised criminals from abroad, as the vendor’s blog suggests about this family', why: 'A family name isn’t an actor; the report says only what the evidence shows.'}]},
  {title: 'Round 3: the report, today', who: 'Director Mina Strand',
   ask: '“Can the Board have the report today?”',
   resp: [{label: 'It goes to Noor, who engaged us: she decides who receives it, and when', good: true},
          {label: 'Yes: send it to every Board member this afternoon and copy Noor, as the chair asked', why: 'The letter sends the report to Noor. Distribution is her decision.'},
          {label: 'Post a summary on the Library’s website today, so patrons hear it first', why: 'What is said publicly, and when, is for Noor and the Director, not the firm.'}]}];

/* ---------- The boss: the patron-records extortion claim (game-original), one seat per track ---------- */
function lbMgrBossStages() {
  return {
    s1: {title: 'Stage 1 (06:20): coordinate',
      clues: ['05:52: an email to the Director and the Library’s public inbox: “We have all 26,500 of your patrons: names, addresses, reading history. Pay by Friday or we publish.” 20 sample rows attached.', '06:10: the on-call lead finds sw-support signed in to Shelfwright at 02:38 from 192.0.2.77, outside the vendor’s documented range, and a manual export at 02:41.', 'The Director is on her way in; Noor, the vendor, the firm and the Board chair don’t know yet.'],
      ask: 'You are the IR manager. Who does what, first?',
      resp: [{label: 'The Director decides; Noor now; the vendor keeps the logs, then disables sw-support; firm called', good: true},
             {label: 'Do it all yourself: you know the Library now, and five calls at six would slow it', why: 'One person becomes the bottleneck, and the people who decide don’t know. Coordinate; don’t do it all.'},
             {label: 'Unplug CIRC-01 and the Library network at once, then wake everyone at eight', why: 'Unplugging first loses the logs the vendor holds and stops lending; the owners are not told.'},
             {label: 'Reply to the email to buy time, and wait until the Director confirms the data is real', why: 'Nobody talks to the extortionist without the Director and Noor, and waiting is not a plan.'}]},
    s2: {title: 'Stage 2 (09:00): brief the Board',
      clues: ['08:40, the firm: one export, 6,212 rows, the holds-notice list; fields being confirmed. Shelfwright keeps no borrowing history.', '08:50: all 20 sample rows are among the 6,212.', 'Not known: whether the rows have been passed on; how the attacker had sw-support’s password.'],
      ask: 'Emergency Board meeting. What do you tell them?',
      resp: [{label: 'What we know: one export, 6,212 rows; what we don’t; what’s being done; next at 13:00', good: true},
             {label: 'Only 6,212 rows and no reading history: the email exaggerates, so there is little to worry about', why: 'Minimising before the fields are confirmed is a guess, and the rows include the titles on hold.'},
             {label: 'All 26,500 patrons and their reading history are out, as the email says, so prepare for the worst', why: 'Repeating the criminal’s claim as fact; the evidence says one export of 6,212 rows.'},
             {label: 'Nothing until the firm and Noor have finished: a partial picture would only confuse the Board', why: 'The Board hears it from you first, with the gaps named and a time for the next update.'}]},
    s3: {title: 'Stage 3 (13:00): the deadline and the way back',
      clues: ['12:30, the firm’s fields: name, email, card number, pickup branch and the title on hold. No addresses, no borrowing history.', 'Shelfwright Systems: sw-support’s password was shared across its customers and last changed in 2022 (game).', 'Friday is the extortionist’s deadline. The Board asks you whether to pay.'],
      ask: 'Which plan do you take to the Director, the Board and Noor?',
      resp: [{label: 'Payment is for the Board and the Director, on Noor’s advice, FBI told; vendor access on demand', good: true},
             {label: 'Pay quietly before Friday through the insurance policy, and tell Noor once the file is deleted', why: 'A payment buys a promise from the people who took the rows; it is the Board’s decision, on Noor’s advice, never a quiet one.'},
             {label: 'Announce this afternoon that 6,212 patrons were affected, then send Noor the list', why: 'Noor decides who must be told and how; an announcement before that can be wrong or premature.'},
             {label: 'Give sw-support back to the vendor with a new password, and reopen as before', why: 'The same shared, always-on account is how they got in. Access on demand, from the vendor’s range, with MFA and a password of the Library’s own.'}]}
  };
}
function lbDfirBossStages() {
  return {
    s1: {title: 'Stage 1 (06:40): preserve, then scope',
      clues: ['05:52: the extortion email reaches the Director and the public inbox, with 20 sample rows.', '06:30: Shelfwright Systems wants to reset sw-support straight away and clear its sessions.', 'Noor has engaged the firm under a second letter: what was taken, and how (game).'],
      ask: 'What do you do first?',
      resp: [{label: 'Keep the audit and query logs and the email first: export, log, then the vendor’s reset', good: true},
             {label: 'Let the vendor reset sw-support now: every minute it stays live is a minute the attacker keeps', why: 'Disable it, yes; but its records go first. A reset that clears sessions can take the evidence of the night with it.'},
             {label: 'Image every PC in the Library before anything else, in case the attacker came through one', why: 'The way in so far is the vendor’s account on CIRC-01. Scope follows the evidence.'},
             {label: 'Reply to the email asking for proof of the full 26,500 before collecting anything', why: 'Nobody talks to the extortionist without the Director and Noor; your proof is in the logs.'}]},
    s2: {title: 'Stage 2 (11:00): what was taken',
      clues: ['E-06, Shelfwright’s audit log: sw-support signed in 02:38 from 192.0.2.77, manual holds-notice export 02:41–02:44, 6,212 rows, sign-out 02:47.', 'The export’s field list: name, email, card number, pickup branch, title on hold. Shelfwright has no borrowing-history field to export.', 'All 20 sample rows are among the 6,212.'],
      ask: 'What does the evidence say was taken?',
      resp: [{label: '6,212 holds rows, five fields, one export; no borrowing history: none is kept', good: true},
             {label: 'All 26,500 patrons and their reading history, as the email says: assume the worst', why: 'The audit log records one export of 6,212 rows. Assuming the claim is overclaiming.'},
             {label: 'Nothing proven: the sample could be made up, so wait for the attacker to show more', why: 'The 20 rows are in the export the log records. That is shown.'},
             {label: '6,212 rows, and nothing else of the Library’s has left anywhere at all', why: 'That this export is all the logs show is not that nothing else left. Say what is shown.'}]}
  };
}

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  lbtabletop: {name: 'Run the tabletop, write the gaps down', desc: 'In an exercise the gaps are the result: each one becomes an action with an owner. The service owner makes the service decisions in the exercise as she would for real.'},
  lbstatus: {name: 'Read the firm’s status report', desc: 'A retained firm reports what it found, what it didn’t, and anything it saw outside its questions, which goes to counsel first.'}
});
GAME_NOTES.push(
  'The Public Library’s 26,500 cardholders, eight public PCs, bookings, card numbers (14 digits starting 29000), its settings (no borrowing history; no dates of birth since 2021), Shelfwright and sw-support, every log line and the extortion claim are invented. (game)',
  'The Library’s risk register, likelihood and impact (1–5), the tabletop injects, the retainer’s 15 game minutes (+10 a wrong card, +20 if the pack waits), the AAR dates, the after-hours cover forecasts and the directive’s times are invented. (game)'
);
