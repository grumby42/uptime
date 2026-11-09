/* ============================================================
   UPTIME · editions/crossroads/school-data.js
   Crossroads district 2: the School District (both tracks). Art, map, people,
   the manager track's tables (the annex's retainer test, the vendor's notice and
   its contract clause, the vendor and data inventory, the tabletop, the facts
   for counsel and the privacy officer, the week-2 rota with the district's
   nights), the DFIR track's tables (the amended scoping letter, evidence intake,
   requests for vendor-held evidence, one store per client, two reports), three
   drills per track, the directive, the School Board, the two dojos and the
   boss's stages for each seat, and Field Manual text.
   Student privacy: the game never says what any law requires. Adaeze Kole
   (counsel for the School District) and Priya Lindgren (the student data privacy
   officer) decide what families are told and any disclosure; Dr Vale, the
   Superintendent, decides the district's services and contracts. FERPA is
   described only in the US Department of Education's own words (Field Manual).
   No student is a suspect; student data in the game is roster data, grades and
   attendance only. Lumenlark Learning and its breach are invented, as are
   Inkstone, Ferrylane, Chimewell, Sumcraft, every person, host, count and time
   (game). Addresses: RFC 5737 only. Domains: RFC 2606 only. Real facts:
   CREDITS.md, section "Crossroads". Timeline: scratchpad crossroads-timeline.md
   (School District section); every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  sdSis: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  sdSisOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  sdFiles: ['#1b2233', '#3a3a3a', '#7a7a7a', '#d7dbe4'],
  sdFilesOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  sdCart: ['#1b2233', '#2a3550', '#5a6fa0', '#d7dbe4'],
  sdLab: ['#1b2233', '#1f5a8a', '#7fa2d6', '#dbeaf7'],
  vale: ['#1a1a2e', '#2b1d16', '#c98a54', '#2a5a6e'],
  marsh: ['#1a1a2e', '#5b4a42', '#f0c8a0', '#4a6e2a'],
  priya: ['#1a1a2e', '#141414', '#a8703f', '#8a3a6e'],
  kole: ['#1a1a2e', '#141414', '#6e4a2c', '#2a3550'],
  brooks: ['#1a1a2e', '#8c8c8c', '#e0b090', '#5a2a2a'],
  ilse: ['#1a1a2e', '#c0a040', '#f2c7a0', '#3a8a5a'],
  sato: ['#1a1a2e', '#141414', '#e0b090', '#e0a030'],
  wim: ['#1a1a2e', '#3a1d10', '#c98a54', '#1f5a8a'],
  pike: ['#1a1a2e', '#d7dbe4', '#f0c8a0', '#6e2a4a']
});
Object.assign(TILES, {
  'Æ': {spr: 'counter', pal: 'sdSis', solid: true, under: ','},     // the Inkstone desk in the student records office
  'ð': {spr: 'K', pal: 'sdFiles', solid: true},                     // the contract file room's cabinets
  'ŧ': {spr: 'K', pal: 'sdCart', solid: true},                      // the lab's laptop cart (student laptops)
  'ŀ': {spr: 'pc', pal: 'sdLab', solid: true, under: ','}           // the lab's PCs
});

/* ---------- Map: the district office and the School Board room ---------- */
// West door from the town square. North: the student records office (the Inkstone desk), the contract file room, the
// computer lab (laptop cart, dojo terminals). The hall across the middle. South: the Superintendent's office, the
// technology office (the table and the evidence locker), the staff workroom (the desk). East door: the School Board room.
Object.assign(MAPS, {
  school: {
    name: 'The School District office',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,,,,,,,,,w,,,,,,,,,w¤,¤,¤,,,w",
      "w,ÆÆÆÆ,,,,w,ðððð,,,,w,,,,,,,,w",
      "w,,,,,,,,,w,,,,,,,,,w,ŧŧ,ŀ,ŀ,w",
      "w,,,,,,,,,w,,,,,,,,,w,,,,,,,,w",
      "wwww,wwwwwwwww,wwwwwww,wwwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "E,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwww,wwwwwwwww,wwwwwwwwww,wwww",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,,,§§,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,,,,,,,£,,w,,,,Y,,w",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'0,7': {to: 'csquare', x: 18, y: 5, dir: 'left'}, '29,7': {to: 'sboard', x: 1, y: 5, dir: 'right'}}
  },
  sboard: {
    name: 'The School Board room',
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
    doors: {'0,5': {to: 'school', x: 28, y: 7, dir: 'left'}}
  }
});
const SD_MAPS = ['school', 'sboard'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'vale', name: 'Dr Corinne Vale', role: 'Superintendent', map: 'school', x: 3, y: 12, dir: 'right', pal: 'vale'},
  {id: 'marsh', name: 'Owen Marsh', role: 'district technology director', map: 'school', x: 12, y: 13, dir: 'up', pal: 'marsh'},
  {id: 'kole', name: 'Adaeze Kole', role: 'counsel for the School District', map: 'school', x: 17, y: 13, dir: 'left', pal: 'kole'},
  {id: 'priya', name: 'Priya Lindgren', role: 'student data privacy officer', map: 'school', x: 7, y: 3, dir: 'left', pal: 'priya'},
  {id: 'sato', name: 'Nell Sato', role: 'registrar', map: 'school', x: 8, y: 2, dir: 'left', pal: 'sato'},
  {id: 'brooks', name: 'Hal Brooks', role: 'principal, Riverbend Middle School', map: 'school', x: 10, y: 6, dir: 'down', pal: 'brooks'},
  {id: 'ilse', name: 'Ilse Brandt', role: 'Grade 7 science teacher', map: 'school', x: 17, y: 8, dir: 'up', pal: 'ilse', cond: G => !!G.f.sdDrillB},
  {id: 'wim', name: 'Wim Haddad', role: 'computer-science teacher', map: 'school', x: 27, y: 4, dir: 'left', pal: 'wim'},
  {id: 'luciasd', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'school', x: 19, y: 11, dir: 'left', pal: 'lucia', cond: G => G.trackId === 'dfir' || !!G.f.sdBoss},
  {id: 'theosd', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'school', x: 12, y: 11, dir: 'right', pal: 'theo', cond: G => G.trackId === 'dfir'},
  {id: 'pike', name: 'Lorna Pike', role: 'chair of the School Board', map: 'sboard', x: 8, y: 3, dir: 'down', pal: 'pike'}
);
const SD_NPC_IDS = ['vale', 'marsh', 'kole', 'priya', 'sato', 'brooks', 'ilse', 'wim', 'luciasd', 'theosd', 'pike'];

/* ---------- Manager: the district annex's retainer test (Day 8 08:40) ---------- */
const SD_ACTIVATE = [
  {label: 'Met: our students’ records may have been reached, wherever held. Call the firm now; tell counsel', good: true},
  {label: 'Not yet: hold off for Lumenlark’s update, then call the firm once we know the data is ours', why: 'The annex says “may have been reached, wherever they are held”. Waiting for certainty is how a retainer gets called a day late.'},
  {label: 'Not met: the data sits at the vendor, and a breach there is the vendor’s incident, not ours to call in', why: 'The records are the district’s wherever Lumenlark keeps them, and the annex says so. Its criteria are met.'},
  {label: 'Dr Vale decides when the firm is called, and phones it herself once she has read the contract', why: 'The retainer is the Compact’s and its annex says when it is called. You make the call; she and counsel are told at once.'}];
const SD_ACT_OK = 15, SD_ACT_LATE = 20;   // game minutes

/* ---------- Manager M2: the vendor's notice (the clause, the questions, who sends, by when) ---------- */
const SD_CLAUSE = [
  {label: '§9, Security incidents: what every notice must say, and what the district is owed', good: true},
  {label: '§14, Notices: it is the clause about notices, and it names the addresses for them', why: '§14 gives the postal addresses for formal notices. What Lumenlark owes after an incident is in §9.'},
  {label: '§11, Termination: it covers deleting the district’s data, which is the thing families will ask about', why: '§11 is about deletion when the contract ends. The incident duties are in §9.'},
  {label: '§6, Confidentiality: a breach is a failure of confidentiality, and §6 is where that sits', why: '§6 says what each side keeps confidential. What happens after a security incident is §9.'}];
const SD_QUESTIONS = [
  {id: 'records', name: 'Our records, and how many', csf: 'Respond', text: 'Which of our district’s records were in the affected environment: all the fields, and how many students.', good: true},
  {id: 'dates', name: 'Dates, and our token', csf: 'Respond', text: 'When the access began and ended, and when our integration’s token was last used.', good: true},
  {id: 'token', name: 'Who used our token', csf: 'Respond', text: 'Whether anyone other than your sync used our integration’s token or account at all.', good: true},
  {id: 'steps', name: 'Steps, and copies', csf: 'Respond', text: 'What you have done to contain it, and whether any copy of our data has left your systems.', good: true},
  {id: 'others', name: 'Other districts', csf: 'Identify', text: 'Which other districts were affected, and what their data was, to compare notes with them and their counsel.'},
  {id: 'blame', name: 'Who is at fault', csf: 'Respond', text: 'The name of the employee or contractor responsible for the breach, and what has happened to them since.'},
  {id: 'assure', name: 'A written assurance', csf: 'Respond', text: 'A signed statement that no student data was misused, which the district can send to families this week.'}];
const SD_SENDER = [
  {label: 'Priya sends them under §9.3, Kole copied, so every answer is owed by Wednesday 17:00; logged today', good: true},
  {label: 'You send them yourself from the Compact’s mailbox: asking the incident’s questions is the IR manager’s job', why: 'The data agreement is Priya’s to manage, under the district’s contract. You draft; she sends; counsel is copied.'},
  {label: 'Owen Marsh phones Lumenlark’s support line and asks; a call is quicker than a letter', why: 'A call leaves no record of what was asked, or when. Questions under §9.3 go in writing, dated and logged.'},
  {label: 'Kole sends them once she has decided whether the district has a claim against Lumenlark', why: 'The questions don’t wait on a legal view: §9.3 gives two business days, and the clock starts when they go.'}];

/* ---------- Manager M1: the vendor and data inventory ---------- */
const SD_INV_SOURCE = [
  {label: 'From every record of student data we hold: sharing setup and tokens, SSO apps, payments, contracts', good: true},
  {label: 'An email to the 212 teachers asking which apps they use with their classes, with replies due by Friday', why: 'Some will answer, and nobody can say who didn’t. The district’s own records show what is shared and paid for.'},
  {label: 'Ask each vendor what it holds about our students: they know for certain what they keep, and for how long', why: 'Each vendor knows its own copy, not your whole picture, and first you would need the list of vendors.'},
  {label: 'Scan the district network for app traffic for a week and build the list from whatever shows up there', why: 'Traffic shows where devices go, not what data a vendor holds, under which contract, or who owns it.'}];
const SD_INV = [
  {id: 'lumenlark', name: 'Lumenlark Reading', data: 'six roster fields for 3,140 students (grades 3–8); reading progress made in the app', contract: 'contract and data agreement, 2023',
   owners: [{label: 'The Director of Curriculum: her department bought it and uses it every day', good: true},
            {label: 'Owen Marsh: he set up the sync and holds the token, so the relationship is his to manage'},
            {label: 'Lumenlark: it holds the data, and it decides how it is kept'},
            {label: 'Priya Lindgren: she reviews the district’s data agreements, this one included'}]},
  {id: 'ferrylane', name: 'Ferrylane Routing', data: 'student name, school, grade, bus stop', contract: 'contract, 2022; no data agreement',
   owners: [{label: 'Transportation, since it plans and pays for the routes', good: true},
            {label: 'Owen Marsh: the token Ferrylane uses to read Inkstone is his to manage'},
            {label: 'Ferrylane: the routing data is its product, and its system'},
            {label: 'Priya Lindgren: any app that holds student data is hers'}]},
  {id: 'chimewell', name: 'Chimewell', data: 'parent names, phone numbers, emails; student name and school', contract: 'contract and data agreement, 2024',
   owners: [{label: 'Communications: it sends the messages and decides what families get', good: true},
            {label: 'Owen Marsh: he connected Chimewell to Inkstone in 2024 and runs the link'},
            {label: 'The principals, each for the families of their own school’s students'},
            {label: 'Priya Lindgren: family phone numbers and emails are privacy data, so hers'}]}];

/* ---------- Manager M3: the tabletop (the district's risk register; CISA CTEP-style) ---------- */
const SD_RISKS = [
  {id: 'shared', text: 'A shared teacher login is misused, and nobody can say who used it', lik: 3, imp: 3},
  {id: 'vendor', text: 'A vendor holding student data is breached, and the district can’t say what it shared', lik: 3, imp: 5},
  {id: 'sis', text: 'Inkstone (SIS-01) is down in report-card week', lik: 2, imp: 4}];
const SD_SCENARIO = [
  {label: 'A vendor breached and we can’t say what we shared: highest impact, so rehearse it', good: true},
  {label: 'A shared teacher login misused: the likeliest risk, and one the schools here know well'},
  {label: 'Ransomware across the three schools at once, from last month’s news, to test the plan'},
  {label: 'CISA’s K-12 report word for word, so nobody on the Board can say the exercise was made up'}];
const SD_INJECTS = [
  {t: '06:00 (exercise): Lumenlark confirms our students’ data was in the files taken. Who is called, in what order?',
   opts: [{label: 'Dr Vale first, since she owns it; then Kole and Priya; then the firm', good: true},
          {label: 'Owen Marsh first, then nobody else until the technology office knows how bad it is', why: 'The people who decide hear it first, with what is known. Waiting to know more is how the Superintendent learns it from a parent.'},
          {label: 'The principals at once, to start each school answering calls before the phones ring', why: 'Principals need a script counsel and Priya have agreed, not a rumour at six. Dr Vale, counsel and Priya first.'},
          {label: 'The local paper: if the district says it first, the story is the district’s, not Lumenlark’s', why: 'What is said publicly, and when, is decided by Dr Vale with counsel. Not at six, and not by the IR manager.'}]},
  {t: '08:00 (exercise): a parent asks the front office whether her son’s grades were taken.',
   opts: [{label: 'Say what is known: grades were never shared; the rest isn’t known yet; Priya follows up', good: true},
          {label: 'Tell her nothing at all was taken, so the front office doesn’t start a panic', why: 'A promise before anyone knows is a guess the district may have to take back.'},
          {label: 'Read her the vendor’s notice word for word, and let her decide for herself what it means for her son', why: '“Some customer data” answers nothing. Say what the district knows, and who follows up.'},
          {label: 'Put her through to Kole: she decides what any parent may be told, so let her answer', why: 'Kole advises the district; the front office answers with the script she and Priya agree. She doesn’t take parents’ calls.'}]},
  {t: '10:00 (exercise): should the district stop using Lumenlark today?',
   opts: [{label: 'Dr Vale decides, on the facts you give her: it’s her service, and teachers have paper reading logs', good: true},
          {label: 'You decide and stop it at once: student data outranks a reading app', why: 'Stopping a service is the Superintendent’s decision. You advise; she decides, and teachers have paper logs.'},
          {label: 'Kole decides: a contract question is a legal question, and the contract is hers to rule on', why: 'Kole advises on the contract. Whether the district keeps using the app is Dr Vale’s service decision.'},
          {label: 'Lumenlark decides: it is their app, and they know whether it is safe', why: 'The vendor runs the app; the district decides whether its students use it.'}]}];
const SD_EX_ACTIONS = 3;

/* ---------- Manager M5: the district's nights (rota/budget primitive) ---------- */
const SD_COVER = [
  {label: 'Night alerts to the lead on call under a threshold Marsh signs, so only what matters wakes anyone; the rest waits for 07:00', good: true, k: 'threshold', gaps: 0, overtime: 24},
  {label: 'Add the district to the rota as it is: each district alert pages the lead on call at night', k: 'asis', gaps: 0, overtime: 39, why: 'Every sign-in alert and password lockout pages someone at 2 a.m. Forecast: 39 overtime hours against a budget of 30, and more calls on tired people.'},
  {label: 'Two leads on call each night from now on: one for the town and the Library, one for the district', k: 'double', gaps: 0, overtime: 51, why: 'No gaps, but every lead takes two more nights a week, and the third night in a row comes back. Forecast: 51 overtime hours.'},
  {label: 'No district cover at night: the rota is full already, the schools are empty, and nobody signs in', k: 'none', gaps: 84, overtime: 21, why: 'The sync, SIS-01 and every staff account run all night. Forecast: 84 hours a week with nobody.'}];
const SD_ROTA = {
  title: 'On-call rota, week 2', first: 6, carry: 2, nights: 9, hours: 12, maxRun: 2, maxWeek: 2, budget: 30, callCost: 3, tiredCost: 5,
  intro: '<p>Nights 8 to 14, the Library and now the School District. Nights 6 and 7 are last week’s and count for the in-a-row rule. The night post is still advertised (game).</p>',
  people: [
    {id: 'bea', name: 'Bea Lindqvist', note: 'email, identity'},
    {id: 'ruth', name: 'Ruth Avila', note: 'endpoints'},
    {id: 'paz', name: 'Paz Delgado', note: 'web'},
    {id: 'odile', name: 'Odile Brennan', note: 'backups', off: [11]},
    {id: 'magda', name: 'Magda Petrov', note: 'logs, network'},
    {id: 'beatriz', name: 'Beatriz Solano', note: 'identity, servers'},
    {id: 'rae', name: 'Rae Okafor', note: 'the suspicion file', max: 1}],
  calls: {9: 'a bulk-export alert on Inkstone at 02:15 (a short call)', 10: 'Lumenlark’s 05:10 email and the post at 05:40'}
};
// The acting team lead's week on the DFIR track (game): the first lead in this order who keeps the rules.
const SD_ROTA_ORDER = ['odile', 'magda', 'bea', 'ruth', 'beatriz', 'paz', 'rae'];

/* ---------- Manager M4: the facts for counsel and the privacy officer ---------- */
const SD_FACTS = [
  {id: 'shared', name: 'What we shared', csf: 'Identify', text: 'Six roster fields for 3,140 students in grades 3–8, nightly since August 2023.', good: true},
  {id: 'said', name: 'What Lumenlark has said', csf: 'Respond', text: 'Its notice’s own words, what they leave out, and that answers under §9.3 are due Wednesday.', good: true},
  {id: 'logs', name: 'What our logs show', csf: 'Detect', text: 'Last scheduled sync Day 1; one read at 23:58 on Day 7 from its range; the token revoked Day 8; roster reads only in 90 days.', good: true},
  {id: 'unknown', name: 'What isn’t known, and who holds it', csf: 'Respond', text: 'Whether our records were accessed at all: held by the vendor, requested on Day 8.', good: true},
  {id: 'law', name: 'The legal deadline', csf: 'Govern', text: 'A line saying FERPA requires the district to notify every family within 72 hours.'},
  {id: 'promise', name: 'A reassurance', csf: 'Respond', text: 'A line saying no student data was misused, for the letter home.'},
  {id: 'guess', name: 'Who did it', csf: 'Respond', text: 'A paragraph on the criminal group most likely to be behind it, from news reports.'}];

/* ---------- The directive (game): sign Sumcraft this week without a data review ---------- */
const SD_DIRECTIVE = {
  manager: [
    {label: 'Four questions this week (what data, where it goes, the data and breach terms, who signs); then her call', good: true},
    {label: 'Refuse: no new vendor signs anything with the district until the Lumenlark incident is over', why: 'A blanket stop moves the decision from the owner to you, and teachers will find another app without one.'},
    {label: 'Sign it now; it’s likely fine, and the review can come after the incident', why: 'After signing, the data is already flowing. Lumenlark is what “review later” looks like.'},
    {label: 'Let teachers sign up themselves with their district accounts, and skip the contract altogether: it’s free', why: 'Click-through terms are how eleven apps nobody listed got the district’s data. The district signs, after a review.'}],
  dfir: [
    {label: 'Give the case’s facts and the four questions to ask, so the choice is Dr Vale’s, made knowing them', good: true},
    {label: 'Tell her the firm’s report forbids any new vendor until the Lumenlark incident is over', why: 'A report recommends. The Superintendent decides, knowing what the case showed.'},
    {label: 'Say it is outside the letter Kole signed, and give her nothing at all, to be safe', why: 'Facts from the case can be given where counsel agrees, and Kole has. Silence leaves her guessing.'},
    {label: 'Tell her to copy Lumenlark’s contract word for word: it already has a data list and a breach clause', why: 'Lumenlark’s contract had both and its token could still read grades. The review asks what this app will take.'}]};

/* ---------- DFIR D1: the amended scoping letter (game) ---------- */
const SD_LETTER = [
  {label: 'List all we can’t see of our students’ data at the vendor; ask through Kole; collect ours', good: true},
  {label: 'Have the firm ask Lumenlark for remote access to its systems, to examine them itself today', why: 'Lumenlark’s systems are out of scope and not the firm’s to examine. What it holds is requested through counsel under §9.3.'},
  {label: 'Widen the scope to every teacher’s laptop first, in case the breach somehow started there', why: 'Nothing points at a teacher’s laptop. The letter scopes Inkstone, the SSO, FW-SD and the contracts.'},
  {label: 'Ask Dr Vale to write to families today, before anything is known, to get ahead of the news', why: 'What families are told, and when, is for Kole and Priya to decide, on facts the firm hasn’t found yet.'}];

/* ---------- DFIR D2: evidence intake (the district's store, case SCH) ---------- */
const SD_INTAKE = {
  s01: {id: 'S-01', what: 'Inkstone data-sharing setup and export history', form: 'August 2023 to Day 8 09:40; exported 09:40 by Owen Marsh; SHA-256 at export recorded.',
    opts: [{label: 'Log it as each item is logged: compare the hashes, seal the original in the district’s store, use a copy', good: true},
           {label: 'Read the history in Inkstone itself instead: it is the same data, live, and always up to date', why: 'The live screen keeps changing; the export is the fixed record. Use the export, logged and hashed.'},
           {label: 'Not needed: the export history only shows what we meant to share, not what was taken', why: 'What we meant to share, and sent, is half of question 1. It is the record of what Lumenlark received.'},
           {label: 'Seal it with Oxlow’s Lumenlark files: same vendor, same breach', why: 'One store per client. The district’s evidence stays in the district’s store.'}]},
  s02: {id: 'S-02', what: 'Inkstone API log (90 days)', form: 'To Day 8 09:40; exported 09:40 by Owen Marsh; SHA-256 at export recorded.',
    opts: [{label: 'As each item: compare hashes, seal it, work on a copy', good: true},
           {label: 'Accept it without comparing hashes: Marsh exported it an hour ago', why: 'The check is about the file, not Marsh. Compare the hashes for every item.'},
           {label: 'Trim it to the last seven days before sealing it: nobody will read 90 days of API calls', why: 'Editing evidence before it is sealed is the one thing custody exists to prevent.'},
           {label: 'Send Lumenlark a hashed copy: its investigators can compare logs with ours', why: 'What the firm shares, and with whom, goes through Kole. The district’s evidence stays in its store.'}]},
  s03: {id: 'S-03', what: 'Inkstone API token registry', form: 'Every token, its scope, issued and last-used times; exported 09:40 by Owen Marsh; SHA-256 recorded.',
    opts: [{label: 'Hash it and compare with the form: then log the handover, seal it, work on a copy', good: true},
           {label: 'Ask Marsh to clear the revoked token’s row first, so the copy you seal is tidy', why: 'Clearing a row changes the record. Seal what was exported at 09:40, as it was handed over.'},
           {label: 'Note only LL-SYNC’s row: the other tokens aren’t Lumenlark’s', why: 'Keep the whole export as it was handed over. Other rows may matter later, and the hash covers the file.'},
           {label: 'Hash a screenshot of the registry page instead: quicker than an export, and it shows the same', why: 'A screenshot shows one screen, with no hash at the source. Use the export.'}]},
  s04: {id: 'S-04', what: 'SSO sign-in log for the Lumenlark app (30 days)', form: 'Exported 09:50 by Owen Marsh with a filter “app = Lumenlark” that the form doesn’t record; SHA-256 at export recorded.',
    opts: [{label: 'Record the filter as a gap, since the form doesn’t; ask for the unfiltered export; keep both records', good: true, gap: true},
           {label: 'Hash it and use it as it is: the filter only removed rows we don’t need', why: 'The form doesn’t say what was removed, so the record doesn’t describe the file. Record it and get the unfiltered export.'},
           {label: 'Write the filter onto Marsh’s form yourself, so the record is complete', why: 'That makes his form say something he didn’t record. A gap is written down as a gap.'},
           {label: 'Throw it out and work without any SSO records: a filtered export can’t be trusted at all', why: 'The SSO answers part of question 2. Fix the record; don’t lose the evidence.'}]},
  s05: {id: 'S-05', what: 'The Lumenlark contract and data agreement (2023)', form: 'Scanned from the contract file room by Priya Lindgren, 10:20; no hash at scan.',
    opts: [{label: 'Hash the scan on receipt, log who scanned it and when, and seal the paper original', good: true},
           {label: 'Log it without a hash: a contract is a document, not evidence, and nobody will dispute it', why: 'Question 1 rests on its data list. Anything a finding rests on goes in the log.'},
           {label: 'Ask Lumenlark for its copy instead: theirs is the signed one', why: 'The district’s countersigned copy is in the file room. If the copies differ, that is for Kole.'},
           {label: 'Retype the data list into the case notes and shred the scan', why: 'A retyped list is not the document. Keep the scan, hashed, and the paper sealed.'}]}
};
const SD_INTAKE_NOTE = {id: 'S-08', what: 'Principal Brooks’s note of his 08:10 call to Ilse Brandt', form: 'Handwritten, signed 08:25 Day 9; scanned by Owen Marsh 08:40.',
  opts: [{label: 'Log it as a document: hash the scan, seal the original; it records what she said', good: true},
         {label: 'No hash needed: a note isn’t a log, and it can’t be evidence', why: 'A finding that rests on her answer rests on this note. It goes in the log as what it is.'},
         {label: 'Log it as proof of where she was at 02:04: a principal’s signed note is strong evidence', why: 'It records what she told the principal on a known number. Where she was is shown, or not, by the sign-in record.'},
         {label: 'Ask her to email you the same account, then shred the paper note', why: 'An email from her mailbox goes over the channel in question, and the signed note is the original.'}]};

/* ---------- DFIR D3: requests for vendor-held evidence (through counsel, under §9.3) ---------- */
const SD_REQUESTS = [
  {id: 'tenant', name: 'Our tenant’s access logs', csf: 'Respond', text: 'Lumenlark’s access logs for our district’s tenant and integration, for the incident window.', good: true},
  {id: 'files', name: 'The copied files', csf: 'Respond', text: 'The list of copied files that held our district’s data, with record counts and fields.', good: true},
  {id: 'tokenuse', name: 'Every use of our token', csf: 'Respond', text: 'Each use of our integration’s token in Lumenlark’s records, with the source address.', good: true},
  {id: 'keep', name: 'Keep the records', csf: 'Respond', text: 'A written commitment that Lumenlark will preserve those records until the district says otherwise.', good: true},
  {id: 'remote', name: 'Remote access', csf: 'Respond', text: 'An account on Lumenlark’s systems for the firm to examine them directly, from its own office.'},
  {id: 'attacker', name: 'Who the attacker is', csf: 'Respond', text: 'The name or group Lumenlark believes is behind the breach, and how it knows.'},
  {id: 'others', name: 'Other districts’ data', csf: 'Identify', text: 'Copies of the other affected districts’ records, to compare with ours side by side.'}];

/* ---------- DFIR D4: one evidence store per client ---------- */
const SD_STORES = [
  {label: 'Two stores, one per district: both counsel and Lucia decide sharing', good: true},
  {label: 'One “Lumenlark” folder for both districts: one vendor and one breach means one case', why: 'Two clients, two stores. Mixing them can show one district’s students’ records to the other’s team.'},
  {label: 'Lucia decides alone, as engagement lead, and gives Oxlow a copy of S-01 to compare', why: 'Not Lucia alone: what one client’s evidence may be shared with another needs both clients’ counsel too.'},
  {label: 'Keep them apart and never mention the shared address to either counsel, so nobody can complain', why: 'An indicator that matters to both goes to the people who can decide what is shared: Lucia and each district’s counsel.'}];

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const SD_DRILLS = {
  vendmgr: {
    id: 'vendmgr', title: 'Owen Marsh’s note on the vendor’s notice', budget: 2,
    intro: '<p>Owen Marsh read Lumenlark’s notice at 07:50 and sent Dr Vale a note at 08:00. You are reviewing the record, not the person: were our students’ records in what Lumenlark held?</p>',
    artefact: '<pre class="art">Owen Marsh to Dr Vale · Day 8 08:00 (game data)\n' +
      'Lumenlark serves over 900 districts. The notice says\n' +
      '“some customer data may have been accessed”. Ours is\n' +
      'probably not involved. Rotating the token today as\n' +
      'they suggest.</pre>' +
      '<p class="small">A notice says what a vendor chooses to say. What the district sent is in its own sharing records; what the vendor may keep is in the contract.</p>',
    question: 'Were our students’ records in what Lumenlark held?',
    sources: [
      {id: 'notice', name: 'Lumenlark’s notice', qs: [
        {q: 'What does it say was affected?', kind: 'trap', res: ['“Some customer data may have been accessed.” No district named, no data named, no dates beyond “recently”.', '(The notice says nothing about whose data. It can’t answer this either way.)']}]},
      {id: 'size', name: 'Lumenlark’s website', qs: [
        {q: 'How big is Lumenlark?', kind: 'trap', res: ['“Trusted by over 900 districts.”', '(Size makes our data neither likelier nor less likely to be in what it held.)']}]},
      {id: 'export', name: 'Inkstone’s data-sharing setup and export history', qs: [
        {q: 'What have we sent Lumenlark, and until when?', kind: 'focus', key: true,
         res: ['Shared with Lumenlark: student name, student ID, school, grade level, class section, teacher name', '3,140 students (grades 3–8) every night at 01:00 since August 2023; the last scheduled sync Day 1 01:00; teachers’ Lumenlark class lists show those sections', 'One more read at 23:58 on Day 7, outside the schedule; nothing since']},
        {q: 'Every export Inkstone has ever made', kind: 'broad', rows: 24600,
         wall: ['{t}  export  lumenlark  3,1{n} rows  6 fields', '{t}  export  ferrylane  2,{n}0 rows  4 fields', '{t}  export  chimewell  4,{n}2 rows  5 fields']}]},
      {id: 'contract', name: 'The contract’s data list (Exhibit A)', qs: [
        {q: 'What may Lumenlark hold, and for how long?', kind: 'focus', key: true,
         res: ['Exhibit A: the same six roster fields, plus reading-practice progress generated in the service', 'Held for the contract’s term; deleted within 30 days of its end (§11). The contract is in force; no deletion has been asked for']}]}
    ],
    ai: {everything: {text: 'A vendor with over 900 districts reporting that “some customer data” may have been accessed makes any one district’s exposure unlikely. Recommend no action until Lumenlark names affected districts.', wrong: true,
                      reveal: 'Tally weighed the vendor’s size and the notice’s wording. It never read what the district sent Lumenlark, or what the contract lets it keep.'},
         specific: {q: 'Which Inkstone fields are shared with Lumenlark?', text: 'Six roster fields: student name, student ID, school, grade level, class section and teacher name.'}},
    verdicts: [
      {label: 'Yes: Lumenlark held six roster fields for 3,140 of our students, and their reading progress; accessed or not, the vendor’s logs hold that', good: true, needs: ['export', 'contract'],
       needsWhy: 'the finding rests on two records: what we sent (the export history) and what Lumenlark may keep (the contract). You read only one of them.',
       why: 'What was sent and what may be kept agree. Whether it was accessed isn’t on our side to see.'},
      {label: 'Probably not: a vendor serving 900 districts and saying “some customer data” is unlikely to mean ours', why: 'Size and vague wording fit either answer. The export history shows we sent it every night.'},
      {label: 'Yes, and it was accessed: “some customer data” plus our nightly sync means our students were affected', why: 'That they held it is shown; that it was accessed is not. That evidence sits at the vendor.'}],
    reasons: [
      {label: 'The export history shows the fields we sent each night, and Exhibit A shows Lumenlark may keep them', good: true, why: 'What we sent, and what they hold, each from its own record.'},
      {label: 'With 900 districts in the same system, any single district has a small chance of being in the affected part', why: 'Nothing in the notice says “part” of anything by district. Size is not a record.'},
      {label: 'The notice tells us to rotate credentials, which it wouldn’t do if our district weren’t in the data', why: 'A precaution sent to every customer says nothing about whose data was reached.'}],
    alts: [
      {label: 'Lumenlark held more fields than the contract lists', good: true, why: 'Not supported: the sharing setup sends exactly Exhibit A’s six fields.'},
      {label: 'Lumenlark had deleted our data before the breach', good: true, why: 'Not supported: the contract is in force and no deletion was asked for.'},
      {label: 'A teacher uploaded extra student files to the app', why: 'Nothing points to it; the record shows the sync, and no teacher is suspected.'},
      {label: 'The notice being a phishing email', why: 'Worth a check on its own, and beside this question: the sync records answer it.'}],
    path: '<p>“Did the vendor hold our data?” is decided by <b>our own sharing records</b> (what we sent, and until when) and <b>the contract’s data list</b> (what it may keep). The notice’s wording and the vendor’s size fit any answer.</p>',
    response: ['Tell Dr Vale: our records were in what Lumenlark held; whether they were accessed is held by the vendor, and we ask for it in writing', 'Export and hash the logs before the token is revoked; then Marsh revokes it', 'The questions go to Lumenlark under the contract today, dated and logged', 'Coach Owen Marsh in private: a note says what it rests on, and “probably” needs a source'],
    techs: [], acts: ['sdinventory']
  },
  venddfir: {
    id: 'venddfir', title: 'Question 1: were our students’ records in what Lumenlark held?', budget: 3,
    intro: '<p>The letter’s first question: were our students’ records among what Lumenlark held, and which fields? Your copies of S-01 to S-05 are on the bench. This finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case SCH-01 · question 1 (game data)\n' +
      'S-01  Inkstone data-sharing setup and export history\n' +
      'S-02  Inkstone API log (90 days)\n' +
      'S-05  Lumenlark contract and data agreement (2023)\n' +
      'Notice  Lumenlark, Day 5 16:40: “some customer data”</pre>' +
      '<p class="small">S-01 says what we sent; S-05 says what Lumenlark may hold.</p>',
    question: 'Were our students’ records in what Lumenlark held, and which fields?',
    sources: [
      {id: 'notice', name: 'Lumenlark’s notice', qs: [
        {q: 'What does it say was affected?', kind: 'trap', res: ['“Some customer data may have been accessed.”', '(Whose data, it doesn’t say.)']}]},
      {id: 'size', name: 'Lumenlark’s website', qs: [
        {q: 'How many districts use it?', kind: 'trap', res: ['“Trusted by over 900 districts.”', '(A size, not a record of ours.)']}]},
      {id: 'export', name: 'S-01: the sharing setup and export history', qs: [
        {q: 'Which fields went to Lumenlark, for whom, and until when?', kind: 'focus', key: true,
         res: ['Fields: student name, student ID, school, grade level, class section, teacher name', '3,140 students (grades 3–8) nightly at 01:00 since August 2023; the last scheduled run Day 1 01:00', 'One more read, 23:58 Day 7, the same six fields; teachers’ Lumenlark class lists show the synced sections']}]},
      {id: 'contract', name: 'S-05: Exhibit A, the data list', qs: [
        {q: 'What may Lumenlark hold?', kind: 'focus', key: true,
         res: ['The six roster fields, and reading-practice progress generated in the service', 'Held for the contract’s term (in force); deletion within 30 days of its end, certified (§11)']}]},
      {id: 'api', name: 'S-02: the API log', qs: [
        {q: 'Which endpoints did LL-SYNC call in 90 days?', kind: 'focus', key: true,
         res: ['Roster endpoints only: no grades, no attendance', 'Every call from 198.51.100.64–79, Lumenlark’s documented range']},
        {q: 'Every API call in 90 days', kind: 'broad', rows: 412000,
         wall: ['{t}  GET /rosters/section/{n}  LL-SYNC  198.51.100.7{i}', '{t}  GET /rosters/school/{i}  LL-SYNC  198.51.100.6{i}', '{t}  GET /routes/stop/{n}  FR-SYNC  198.51.100.9{i}']}]}
    ],
    verdicts: [
      {label: 'Yes: six roster fields for 3,140 students, with the reading progress it makes; whether accessed is held by the vendor', good: true, needs: ['export', 'contract'],
       needsWhy: 'the finding rests on two sources: S-01 says what we sent, and S-05 what Lumenlark may keep. You read only one.',
       why: 'S-01 and S-05 each decide their half; S-02 agrees.'},
      {label: 'Unlikely: “some customer data” across 900 districts can’t be read as ours without the vendor saying so', why: 'Whether ours was held is in our own records, and S-01 shows it was sent every night.'},
      {label: 'Yes, and accessed: our nightly sync plus the notice is enough to write that our records were taken', why: 'Held is shown; accessed isn’t. That is the vendor’s evidence, requested on Day 8.'}],
    reasons: [
      {label: 'S-01 lists the six fields and the nightly sync; S-05’s Exhibit A lets Lumenlark keep them', good: true, why: 'What was sent, and what may be kept, from their own records.'},
      {label: 'The notice was sent to us, and Lumenlark would only write to districts whose data was in the affected part', why: 'A notice to every customer says nothing about whose data was reached.'},
      {label: 'Lumenlark is one of the biggest reading apps, and the bigger the vendor the likelier any district is in a breach', why: 'Size isn’t a record of what we sent.'}],
    alts: [
      {label: 'Grades or attendance went to Lumenlark too', good: true, why: 'Not supported: S-01 shares six roster fields, and S-02 shows roster calls only in 90 days.'},
      {label: 'Our data deleted at Lumenlark before the breach', good: true, why: 'Not supported: the contract is in force; no deletion was asked for.'},
      {label: 'Lumenlark sending the notice to the wrong district', why: 'Beside the point: S-01 shows we share data with it.'},
      {label: 'A substitute’s shared login exporting the rosters', why: 'Nothing points to it: S-01 shows the sync, not a person’s export.'}],
    path: '<p>Two decisive sources: <b>S-01</b> (what we sent, and until when) and <b>S-05</b> (what the vendor may hold). S-02 agrees: roster calls only. The notice’s wording and the vendor’s size decide nothing.</p>',
    response: ['Report to Kole: our records were in what Lumenlark held, six fields and the reading progress; accessed or not is held by the vendor', 'Log the vendor-held question as unknown, with the date it was requested: Day 8 (Monday)', 'Say nothing about access until the vendor’s evidence answers it', 'Keep S-01 and S-05 sealed; work on copies'],
    techs: [], acts: ['sdthird']
  },
  signmgr: {
    id: 'signmgr', title: 'A 02:04 sign-in from abroad', budget: 2,
    intro: '<p>At 02:04 i.brandt, Ilse Brandt’s account, signed in to Inkstone from another country. Owen Marsh’s ticket asks: compromise, or travel or a VPN? Principal Brooks has spoken to her. You are reviewing the record, not the teacher.</p>',
    artefact: '<pre class="art">Technology office ticket · Day 9 07:05 (game data)\n' +
      'Alert   SSO: sign-in from a new country\n' +
      'Account i.brandt (Grade 7 science)\n' +
      'Time    02:04–02:31, Night 8\n' +
      'Address 203.0.113.140\n' +
      'Note    “Compromise? Disable the account?”</pre>' +
      '<p class="small">A country or an hour is a reason to look. The sign-in record says which device and which second factor; the owner, asked on a number you already had, says whether it was her.</p>',
    question: 'Compromise, or her own sign-in through travel or a VPN?',
    sources: [
      {id: 'alert', name: 'The SSO alert', qs: [
        {q: 'Why did it fire?', kind: 'trap', res: ['“New country for this account.”', '(A country says where an address is registered. It doesn’t say who was at the keyboard.)']}]},
      {id: 'reply', name: 'The reply from her mailbox', qs: [
        {q: 'What did she answer to “was this you?”', kind: 'trap', res: ['07:12, from i.brandt’s own mailbox: “yes, me”.', '(If the account were someone else’s now, they would answer the same. Confirm on a channel the question doesn’t touch.)']}]},
      {id: 'signin', name: 'The sign-in record', qs: [
        {q: 'Which device and which second factor, and what did the session do?', kind: 'focus', key: true,
         res: ['Her registered laptop: the same device ID as her daytime sign-ins, Days 1–8', 'MFA approved in her registered authenticator app; 203.0.113.140 belongs to a commercial VPN provider (address owner record)', 'Opened the gradebook for her own three classes; entered 26 grades; signed out 02:31; nothing else']}]},
      {id: 'owner', name: 'Principal Brooks’s call', qs: [
        {q: 'What did she say, and on which number?', kind: 'focus', key: true,
         res: ['08:10, the number in the staff directory', 'Grading at home late; a VPN app she installed last month; she approved the prompt herself']}]}
    ],
    ai: {everything: {text: 'A sign-in at 02:04 from a country the account has never used is consistent with credential theft. Recommend disabling i.brandt and resetting her password.', wrong: true,
                      reveal: 'Tally added up the hour and the country. It never read which device signed in, how the second factor was passed, or what she said on a known number.'},
         specific: {q: 'Which device ID did i.brandt’s 02:04 sign-in use?', text: 'Her registered laptop: the same device ID as her daytime sign-ins.'}},
    verdicts: [
      {label: 'Her own sign-in through a VPN: her device, her app’s approval, and her word on a known number', good: true, needs: ['signin', 'owner'],
       needsWhy: 'the finding rests on two sources: the sign-in record (her device, her second factor) and her answer on a number you already had. You read only one.',
       why: 'The record and the call tell one story.'},
      {label: 'Compromise: a sign-in at 2 a.m. from a country she has never used is how stolen passwords look', why: 'The hour and the country fit both stories. Her own device and her own approval don’t fit a thief.'},
      {label: 'Can’t be told apart until the account is disabled and the staff passwords are reset', why: 'For this account the record and the call already answer it; a district-wide reset is scope by worry.'}],
    reasons: [
      {label: 'Her own laptop and authenticator approved it, so it was her device; she said so on the directory number', good: true, why: 'Device and factor from the record; the person, on a known channel.'},
      {label: 'She replied “yes, me” from her own mailbox within minutes of the alert, so it must have been her', why: 'A reply from the account in question proves nothing about the account.'},
      {label: 'Teachers never grade at two in the morning, so a sign-in at that hour is someone else’s doing', why: 'People grade at odd hours. The record says whose device it was.'}],
    alts: [
      {label: 'Someone with her password signed in', good: true, why: 'Ruled out: her registered device, and her own approval of the prompt.'},
      {label: 'She approved a prompt she didn’t start', good: true, why: 'Ruled out: she started the sign-in herself and says so on a known number.'},
      {label: 'Her VPN app being malicious software', why: 'Nothing points to it: the sign-in passed her own device and factor.'},
      {label: 'The VPN provider spying on her', why: 'Beside the point: the question is who signed in, and the record answers it.'}],
    path: '<p>“Compromise or travel?” is decided by <b>the sign-in record</b> (device, second factor, what the session did) and <b>the owner’s answer on a number you already had</b>. The country, the hour and a reply from the same mailbox fit either story.</p>',
    response: ['Close it citing both: her device and second factor, and the principal’s call on the staff-directory number', 'Keep the sign-in records and the principal’s note', 'Whether staff may use consumer VPNs is a policy for Owen Marsh and Dr Vale, not this ticket', 'Tell Marsh in private why the mailbox reply didn’t count'],
    techs: ['T1078'], acts: ['sdsignin']
  },
  signdfir: {
    id: 'signdfir', title: 'Question 4: i.brandt’s 02:04 sign-in', budget: 3,
    intro: '<p>Kole added a question this morning, in writing: was i.brandt’s 02:04 sign-in a compromise? (Inkstone and the SSO are in scope.) S-06 to S-08 are on the bench. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case SCH-01 · question 4 (game data)\n' +
      'S-06  Inkstone and SSO sign-ins, i.brandt, Day 1 to Day 9\n' +
      'S-07  FW-SD log, Night 8\n' +
      'S-08  Principal Brooks’s note of his 08:10 call\n' +
      'Alert SSO “new country”, 02:04, 203.0.113.140</pre>' +
      '<p class="small">S-06 says which device and which second factor; S-08 records what she said on a known number.</p>',
    question: 'Compromise, or her own sign-in through travel or a VPN?',
    sources: [
      {id: 'alert', name: 'The SSO alert', qs: [
        {q: 'Why did it fire?', kind: 'trap', res: ['“New country for this account.”', '(Where an address is registered, not who used it.)']}]},
      {id: 'reply', name: 'The reply from her mailbox', qs: [
        {q: 'What came back to “was this you?”', kind: 'trap', res: ['07:12, from i.brandt’s mailbox: “yes, me”.', '(The same channel as the question: it can’t confirm it.)']}]},
      {id: 'signin', name: 'S-06: the sign-in records', qs: [
        {q: 'Device, second factor, and what the session did?', kind: 'focus', key: true,
         res: ['Device ID: her registered laptop, as in every daytime sign-in Days 1–8', 'MFA approved in her registered authenticator app; 203.0.113.140: a commercial VPN provider’s address (owner record)', 'Gradebook for her own three classes; 26 grades entered; signed out 02:31']}]},
      {id: 'owner', name: 'S-08: the principal’s note', qs: [
        {q: 'What did she say, on which number?', kind: 'focus', key: true,
         res: ['08:10, the number in the staff directory; signed 08:25', 'Grading at home; a VPN app installed last month; she approved the prompt herself']}]},
      {id: 'fw', name: 'S-07: FW-SD, Night 8', qs: [
        {q: 'Did 203.0.113.140 reach anything else?', kind: 'focus', key: true,
         res: ['Only SIS-01’s web front, 02:03–02:31', 'Nothing else from that address all night']},
        {q: 'Every line of the night’s firewall log', kind: 'broad', rows: 96000,
         wall: ['{t}  allow  203.0.113.{n} → SIS-01:443', '{t}  allow  SIS-01 → compact-logs:6514', '{t}  deny   198.51.100.{n} → SIS-01:22']}]}
    ],
    verdicts: [
      {label: 'Her own, through a VPN: S-06 has her device and approval; S-08 her answer on a known number', good: true, needs: ['signin', 'owner'],
       needsWhy: 'the finding rests on two sources: S-06 (device and second factor) and S-08 (her answer on the staff-directory number). You read only one.',
       why: 'Each source decides its half; S-07 agrees.'},
      {label: 'Compromise: a new country at 2 a.m. on an account with gradebook access must be treated as stolen', why: 'The country and the hour fit both stories. Her device and her approval don’t fit a thief.'},
      {label: 'Unknown until the 212 staff accounts have each been reset and checked against their devices', why: 'For i.brandt, S-06 and S-08 answer it; the rest is outside question 4.'}],
    reasons: [
      {label: 'S-06: her own laptop and authenticator; S-08: she started it, said on the directory number', good: true, why: 'Device and factor from the record; the person on a known channel.'},
      {label: 'Her mailbox answered “yes, me” within minutes, and no thief would bother to reply to a check', why: 'Anyone holding the account could reply. It isn’t a second channel.'},
      {label: 'Nobody grades at 2 a.m., so the hour alone is enough to call it a compromise and act', why: 'An hour isn’t a device or a factor.'}],
    alts: [
      {label: 'A stolen password used from her laptop’s address', good: true, why: 'Ruled out: the session passed her own authenticator, on her registered device.'},
      {label: 'Someone else reached SIS-01 from the same address', good: true, why: 'Ruled out: S-07 shows nothing else from 203.0.113.140.'},
      {label: 'A browser add-on replaying an old session of hers', why: 'Nothing points to it: a fresh sign-in, with her own approval.'},
      {label: 'The VPN provider logging all of her traffic that night', why: 'Beside the point: the question is who signed in.'}],
    path: '<p>Two decisive sources: <b>S-06</b> (device and second factor) and <b>S-08</b> (her answer on a number you already had). S-07 shows nothing else from the address. Country, hour and a same-channel reply decide nothing.</p>',
    response: ['Report to Kole: her own sign-in through a VPN, with both sources', 'No disable, no reset: there is nothing to contain', 'Whether staff may use consumer VPNs is a district policy question, not a finding', 'Note in the case that the mailbox reply was not used'],
    techs: ['T1078'], acts: ['sdsignin']
  },
  offer: {
    id: 'offer', title: 'Lumenlark’s “full investigation report”', budget: 2,
    intro: '<p>Day 10, 09:00: Lumenlark’s two-page summary has arrived, with an offer: its full investigation report, if the district signs its terms. Dr Vale’s pen is out. What should the district ask for, and who decides whether to accept?</p>',
    artefact: '<pre class="art">Lumenlark · offer · Day 10 09:00 (game data)\n' +
      'Full investigation report (84 pages), in 30 days,\n' +
      'on signature of the attached terms.\n' +
      'Summary: access identified Day 1; sync jobs stopped;\n' +
      'your token last used Day 1 01:00.</pre>' +
      '<p class="small">An offer’s value is in its terms. What the district is already owed is in its contract.</p>',
    question: 'What should the district ask for, and who decides acceptance?',
    sources: [
      {id: 'call', name: 'The account manager’s call', qs: [
        {q: 'What does Lumenlark say about the terms?', kind: 'trap', res: ['“Every district signs it. It’s standard.”', '(What others signed says nothing about these terms.)']}]},
      {id: 'toc', name: 'The report’s contents page', qs: [
        {q: 'How thorough does it look?', kind: 'trap', res: ['84 pages: root cause, timeline, remediation, a forensic partner’s letter.', '(Length isn’t access to the facts the district needs.)']}]},
      {id: 'terms', name: 'The offer’s terms', qs: [
        {q: 'What does the district give up by signing?', kind: 'focus', key: true,
         res: ['A release of the district’s claims against Lumenlark over the incident', 'Confidentiality that bars sharing the report with the district’s insurer, its outside firm or any regulator', 'Delivery in 30 days']}]},
      {id: 'contract', name: 'The contract, §9.3', qs: [
        {q: 'What is the district owed already?', kind: 'focus', key: true,
         res: ['On request, the information the district needs, and cooperation with its investigation', 'Answers within two business days of a request; no new terms required', 'The §9.3 questions sent Day 8: due today at 17:00, mostly unanswered by the summary']}]}
    ],
    ai: {everything: {text: 'An 84-page report from the vendor’s forensic partner is the most complete source available. Recommend signing so the district receives it quickly.', wrong: true,
                      reveal: 'Tally weighed the report’s length and the call. It never read what the terms give up, or what §9.3 already owes the district.'},
         specific: {q: 'Who may the district share the full report with, under the terms?', text: 'Nobody outside the district: the terms bar its insurer, its outside firm and regulators.'}},
    verdicts: [
      {label: 'Not as offered: ask under §9.3 for the specific facts; whether any terms are accepted is Kole’s decision', good: true, needs: ['terms', 'contract'],
       needsWhy: 'the answer rests on two records: what the terms take away, and what §9.3 already gives. You read only one.',
       why: 'The contract already owes the facts; the terms would cost the district its claims and its advisers.'},
      {label: 'Sign today: a full report from Lumenlark’s own forensic partner is worth more than the district’s questions', why: 'The terms bar the district’s firm, insurer and regulators from reading it, and release its claims. §9.3 owes the facts already.'},
      {label: 'Refuse the report outright and stop asking Lumenlark for anything until the contract is cancelled', why: 'The district still needs Lumenlark’s facts, and §9.3 owes them. Ask for them; counsel decides on the terms.'}],
    reasons: [
      {label: '§9.3 owes the facts in two business days anyway; the terms would bar the firm and the insurer', good: true, why: 'What is owed, against what signing gives up.'},
      {label: 'Other districts sign it, says Lumenlark, and the district shouldn’t be the one that holds things up', why: 'What others signed is not a reason.'},
      {label: 'An 84-page report must hold more than the two-page summary, so it is the better source', why: 'Length isn’t the facts the district needs, or the right to use them.'}],
    alts: [
      {label: 'The terms only restating what §9.3 says', good: true, why: 'Ruled out: they add a release of claims and bar the firm, the insurer and regulators.'},
      {label: 'The district was owed nothing until the report', good: true, why: 'Ruled out: §9.3 owes answers within two business days of a request.'},
      {label: 'The account manager misleading the district on purpose', why: 'Nothing points to it; the terms speak for themselves.'},
      {label: 'Lumenlark withholding the summary until the terms are signed', why: 'Beside the point: the summary has come, and it doesn’t answer the questions.'}],
    path: '<p>An offer is decided by <b>its terms</b> (what the district gives up) and <b>the contract</b> (what it is already owed). A sales call and a long contents page decide nothing.</p>',
    response: ['Kole decides whether the district accepts any terms; Dr Vale signs nothing until then', 'Priya asks again under §9.3 for the specific facts, in writing, dated and logged', 'The firm says which facts it needs, so the request is specific', 'The summary goes to the firm and to Kole as received'],
    techs: [], acts: ['sdnotice']
  },
  tokendate: {
    id: 'tokendate', title: 'Two dates for the token’s last use', budget: 3,
    intro: '<p>Lumenlark’s summary says the district’s token was last used at 01:00 on Day 1. Our API log says 23:58 on Day 7. Which is defensible, and how do you word it for Kole? The finding needs two sources.</p>',
    artefact: '<pre class="art">Case SCH-01 · the token (game data)\n' +
      'S-09  Lumenlark summary, Day 10 09:00: “your token\n' +
      '      was last used on Day 1 at 01:00”\n' +
      'S-02  Inkstone API log (90 days)\n' +
      'S-03  Inkstone API token registry</pre>' +
      '<p class="small">A summary is the vendor’s account of evidence you can’t see. Your own log records what reached your system; your registry says which token is which.</p>',
    question: 'Which date is defensible, and how is it worded?',
    sources: [
      {id: 'polish', name: 'Lumenlark’s summary', qs: [
        {q: 'How sure does Lumenlark sound?', kind: 'trap', res: ['“Our forensic partner has confirmed the token was last used on Day 1.”', '(Sure isn’t shown. You can’t see what its partner read.)']}]},
      {id: 'pref', name: 'Dr Vale', qs: [
        {q: 'Which date would the district rather report?', kind: 'trap', res: ['“Day 1, please. Fewer days of exposure.”', '(The client’s hope changes nothing a report can say.)']}]},
      {id: 'apilog', name: 'S-02: the API log', qs: [
        {q: 'When did the token last reach Inkstone, from where?', kind: 'focus', key: true,
         res: ['Day 7 23:58, token ID …7Q2K, from 198.51.100.70 (inside Lumenlark’s range): 3,140 roster rows', 'Before that: 01:00 nightly, the last on Day 1; nothing on Days 2 to 7 at 01:00', 'Nothing more with …7Q2K up to the export at 09:40 on Day 8']}]},
      {id: 'sso', name: 'S-04: SSO sign-ins for the Lumenlark app', qs: [
        {q: 'Did anything sign in to Lumenlark through our SSO near 23:58 on Day 7?', kind: 'focus', key: true,
         res: ['No: the last SSO sign-in to the Lumenlark app on Day 7 was a teacher’s, at 20:12, from her usual device', 'LL-SYNC is an Inkstone API token: it never passes through the SSO, so the SSO can’t show who used it']}]},
      {id: 'registry', name: 'S-03: the token registry', qs: [
        {q: 'Which token is …7Q2K, and was it the only one?', kind: 'focus', key: true,
         res: ['…7Q2K is LL-SYNC: Lumenlark’s integration token, the only one issued to it', 'Issued August 2023, scope “read: all”; last used Day 7 23:58 (as exported at 09:40 on Day 8, before the 10:05 revocation)']},
        {q: 'Every token and every scope', kind: 'broad', rows: 38,
         wall: ['{t}  token  …{n}  FR-SYNC  read: all', '{t}  token  …{n}  CW-SYNC  read: all', '{t}  token  …{n}  GRADEBOOK  read: grades']}]}
    ],
    verdicts: [
      {label: 'Ours, both dates written: LL-SYNC last used 23:58 Day 7; why Lumenlark says Day 1 is unknown', good: true, needs: ['apilog', 'registry'],
       needsWhy: 'the finding rests on two sources: S-02 (the last use) and S-03 (that …7Q2K is Lumenlark’s only token). You read only one.',
       why: 'Our log records what reached our system; the registry says it was the same token.'},
      {label: 'Lumenlark’s: its forensic partner has seen its own systems in full, which our API log can’t see', why: 'Its partner may have seen more of Lumenlark, but our log records what reached Inkstone, with the token’s own ID.'},
      {label: 'Ours, and the summary is wrong: write plainly in the report that Lumenlark’s date is false', why: 'We can show our date, not why theirs differs. That stays unknown until its logs answer.'}],
    reasons: [
      {label: 'S-02 has …7Q2K at 23:58 on Day 7, and S-03 shows …7Q2K is LL-SYNC: Lumenlark’s only token, so the same one', good: true, why: 'The use from our log; whose token it was from our registry.'},
      {label: 'A vendor would never misstate its own logs, since doing so would breach its own contract', why: 'A summary can be right about one thing and incomplete about another. Report what you can show.'},
      {label: 'The earlier date means fewer days of exposure, which is what the district needs to hear today', why: 'What the client would like isn’t a source.'}],
    alts: [
      {label: 'A second Lumenlark token we didn’t know about', good: true, why: 'Ruled out: S-03 lists one token issued to Lumenlark.'},
      {label: 'Inkstone’s clock being days out', good: true, why: 'Ruled out: the 01:00 nightly calls line up with the schedule to the minute.'},
      {label: 'Lumenlark lying to protect itself', why: 'Nothing points to a motive; the report says unknown, not why.'},
      {label: 'A teacher pulling rosters at 23:58', why: 'Beside the point: the call used LL-SYNC, from Lumenlark’s range.'}],
    path: '<p>Two decisive sources: <b>S-02</b> (the last use, with the token’s ID) and <b>S-03</b> (which token that is). The summary’s certainty and the client’s preference decide nothing. The difference itself is unknown, held by the vendor.</p>',
    response: ['Write: “Our API log records LL-SYNC’s last use at 23:58 on Day 7 (Sunday) from Lumenlark’s documented range; Lumenlark’s summary gives 01:00 on Day 1. Why they differ is unknown: Lumenlark’s logs are held by the vendor; requested on Day 8 (Monday).”', 'Ask again, through Kole, for every use of the token in Lumenlark’s records', 'Coach Theo in private: two sources disagreeing is a finding, not a contest', 'The Superintendent’s preference changes nothing: the report follows the evidence'],
    techs: ['T1550.001'], acts: ['sdthird']
  }
};

/* ---------- DFIR report 1: SCH-01, for counsel ---------- */
const SD_REPORT_1 = {
  title: 'SCH-01: the Lumenlark integration', audience: 'Adaeze Kole, counsel for the School District',
  intro: '<p>Six findings for Kole, each from the evidence in the custody log. Where the decisive evidence sits at Lumenlark, say so, and when it was requested.</p>',
  claims: [
    {id: 'sent', text: 'The nightly sync sent Lumenlark the records of 3,140 students, in six roster fields.', truth: 'confirmed',
     evidence: ['S-01: the sharing setup (six fields) and the export history, nightly since August 2023', 'S-02: LL-SYNC’s roster calls, 3,140 rows a night'], why: 'Our own records show it.'},
    {id: 'scope', text: 'LL-SYNC could also read grades and attendance, which the contract’s data list doesn’t include.', truth: 'confirmed',
     evidence: ['S-03: LL-SYNC issued August 2023 with Inkstone’s default scope “read: all”', 'S-05: Exhibit A lists the six roster fields and the reading progress only'], why: 'The registry and the contract, side by side.'},
    {id: 'ninety', text: 'In the 90 days the API log keeps, LL-SYNC read rosters only.', truth: 'confirmed',
     evidence: ['S-02: every LL-SYNC call in 90 days went to roster endpoints', 'The API log records every call (game)'], why: 'The log is complete for its 90 days.'},
    {id: 'sunday', text: 'The roster read at 23:58 on Day 7 was not Lumenlark’s scheduled sync.', truth: 'likely',
     evidence: ['S-02: LL-SYNC ran at 01:00 every night until Day 1, and never at 01:00 after it', 'S-02: the 23:58 call used LL-SYNC from 198.51.100.70, inside Lumenlark’s documented range', 'Who or what made the call is not in our records'], why: 'Off-schedule points to it; who ran it isn’t shown.'},
    {id: 'accessed', text: 'Our students’ records were among the data accessed at Lumenlark.', truth: 'unknown',
     evidence: ['Lumenlark’s notice: “some customer data may have been accessed”', 'Lumenlark’s own logs are held by the vendor; requested on Day 8 (Monday)'], why: 'Unknown: held by the vendor; requested on Day 8 (Monday).'},
    {id: 'before', text: 'LL-SYNC never read grades or attendance at any time since it was issued in 2023.', truth: 'unknown',
     evidence: ['S-02 keeps 90 days', 'S-01’s export history records the configured roster shares, not every API call'], why: 'Nothing on our side covers the earlier months.'}]
};

/* ---------- DFIR report 2 (the boss, stage 3): SCH-02, what could have left ---------- */
const SD_REPORT_2 = {
  title: 'SCH-02: what could have left through the integration', audience: 'Adaeze Kole, counsel for the School District',
  intro: '<p>Six findings on the vendor’s confirmation and the post, each from the evidence logged this morning.</p>',
  claims: [
    {id: 'sample', text: 'The 10 sample rows in the post match our students’ records.', truth: 'confirmed',
     evidence: ['S-11: student IDs, schools, grades and sections in the post’s sample', 'S-01: all 10 match rows in our last export to Lumenlark'], why: 'The sample against our own export.'},
    {id: 'copied', text: 'Lumenlark’s copied files included our students’ roster data.', truth: 'likely',
     evidence: ['S-10: Lumenlark’s 05:10 email says the files copied included roster data from our integration', 'The files themselves are held by the vendor; requested on Day 8 (Monday)'], why: 'The vendor says so and the sample fits; the files aren’t ours to see.'},
    {id: 'after', text: 'No call with LL-SYNC reached Inkstone after it was revoked at 10:05 on Day 8.', truth: 'confirmed',
     evidence: ['S-12: the API log from Day 8 09:40 to Day 11 07:00 has no call with …7Q2K after 10:05', 'S-12: the registry shows LL-SYNC revoked at 10:05'], why: 'Our log covers the whole time since.'},
    {id: 'grades', text: 'No grades or attendance left through the integration in the 90 days before the revocation.', truth: 'confirmed',
     evidence: ['S-02 and S-12: LL-SYNC called roster endpoints only', 'S-11: the sample holds no grades or attendance'], why: 'The API log is complete for those 90 days.'},
    {id: 'when', text: 'Our data was copied from Lumenlark on Day 1, the day it identified the access.', truth: 'unknown',
     evidence: ['Nothing in S-01 to S-12 shows Lumenlark’s systems', 'Lumenlark’s logs are held by the vendor; requested on Day 8 (Monday)'], why: 'Unknown: held by the vendor; requested on Day 8 (Monday).'},
    {id: 'published', text: 'The rows have been published in full or passed on.', truth: 'unknown',
     evidence: ['S-11: the post shows 10 sample rows for our district', 'Nothing in scope can show where the files went'], why: 'Nothing in scope can say.'}]
};

/* ---------- Dojos (original puzzles; concepts only, no tool syntax) ---------- */
const SD_DOJO_MGR = [
  {q: 'A department wants a free app with click-through terms for next week. What is the least the district needs before students use it?',
   opts: ['Four questions answered: what data, where it goes, the data and breach terms, who decides',
          'Nothing: the terms are standard, and teachers know their classes and their apps best',
          'A full security audit of the app’s source code by the technology office, before anything else'], good: 0,
   explain: 'A minimum review answers four questions and leaves the decision with the owner. Skipping it is how data ends up with vendors nobody listed; a code audit is more than most schools can do, and isn’t the question.'},
  {q: 'A vendor’s notice says “some customer data may have been accessed”. What do you need first?',
   opts: ['Your own record of what you share with that vendor, and the contract clause on incidents',
          'The vendor’s next update, before doing anything that might turn out to be wasted effort',
          'A letter to families today saying their data was taken, so nobody hears it from the news first'], good: 0,
   explain: 'Your own records tell you what was at risk today; the clause tells you what you can ask for. Waiting gives up both; a letter before the facts may have to be taken back.'},
  {q: 'Who owns the risk of a vendor relationship?',
   opts: ['The department that uses it, since it owns the choice; the technology office is its technical contact',
          'The vendor, because it holds the data and knows best how it is protected',
          'The security team, because a breach is a security matter and security owns the controls'], good: 0,
   explain: 'The owner is whoever decides to use the service and can stop it. The vendor holds the data but not the district’s decision; security advises.'}];
const SD_DOJO_DFIR = [
  {q: 'A SaaS app keeps 30 days of logs. The incident may have started 45 days ago. What do you write about days 31 to 45?',
   opts: ['Unknown: not logged; the next step is the provider’s own records',
          'Confirmed: nothing happened in those days, because the log shows nothing at all',
          'Likely: nothing happened, because the 30 logged days are quiet'], good: 0,
   explain: 'No log, no inference. Write unknown, and the request that could answer it.'},
  {q: 'An API token’s scope allows grades, and its log shows only roster calls. What can you write?',
   opts: ['It could read grades: in the period the log covers, it read rosters only',
          'Grades were taken, because the token could read them and nothing stopped it',
          'Grades were never at risk at all, because the log shows no grade calls'], good: 0,
   explain: 'Scope is what it could do; the log is what it did, for as long as the log reaches. Keep the two apart.'},
  {q: 'A sign-in comes from a country you didn’t expect. What makes it suspicious, beyond the country?',
   opts: ['Device, factor and activity that don’t fit the account, since a country alone fits travel; and the owner, asked on a known number',
          'The country alone: an unexpected country is enough to treat the account as stolen',
          'The hour alone: a sign-in in the middle of the night is enough to act on'], good: 0,
   explain: 'Countries and hours fit travel, VPNs and late work. Device, factor, behaviour and a known-channel answer decide it.'}];

/* ---------- The School Board (original; Lorna Pike; three rounds per track) ---------- */
const SD_BOARD_SPECS_MGR = () => [
  {title: 'Round 1: are our students’ data safe?', who: 'Lorna Pike',
   ask: '“Parents are asking us at the school gate. Are our students’ data safe?”',
   resp: [{label: 'What is known and isn’t, who holds each answer, and when the Board hears next, so parents get facts', good: true},
          {label: 'Yes: the district’s own systems weren’t breached, only the vendor’s, and that is what counts', why: 'Where it was breached doesn’t make the data safe: the vendor held our students’ rosters.'},
          {label: 'Assume the worst: every student record the district has is out', why: 'Repeating a fear as fact. The vendor held six roster fields; grades and attendance were never shared with it.'}]},
  {title: 'Round 2: drop Lumenlark today?', who: 'Lorna Pike',
   ask: '“Should we drop Lumenlark today?”',
   resp: [{label: 'Dr Vale decides, after Kole: dropping it stops the sync, not the vendor’s copy', good: true},
          {label: 'Yes, today: cancelling the contract deletes our data at the vendor', why: 'Cancelling doesn’t delete their copy: §11 gives 30 days and a certificate. Dr Vale decides, on Kole’s advice.'},
          {label: 'The Board decides tonight, without the Superintendent or counsel: it is the Board’s district', why: 'The contract is the Superintendent’s to manage, with counsel. The Board can ask; it shouldn’t decide blind.'}]},
  {title: 'Round 3: what stops this next time?', who: 'Dr Corinne Vale',
   ask: '“What changes, and how will the Board know?”',
   resp: [{label: 'The inventory with owners, a review before signing, tokens limited to each contract', good: true},
          {label: 'A ban on ed-tech apps until the district can vet them properly, starting with Lumenlark', why: 'A ban moves teachers to apps nobody lists. Review, own, scope.'},
          {label: 'Nothing much: it was Lumenlark’s breach, not the district’s, and the vendor will fix it', why: 'The token could read more than the contract listed, and nobody knew the clause. Those are the district’s to fix.'}]}];
const SD_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: which students were affected?', who: 'Lorna Pike',
   ask: '“Which of our students were affected?”',
   resp: [{label: 'From our side, 3,140 students’ rosters were shared: whether accessed is held by the vendor, requested Monday', good: true},
          {label: 'All 4,860: the token could read every student record in Inkstone, so assume all of them', why: 'Could read is not read: the log shows roster calls for grades 3 to 8 only.'},
          {label: 'Only the 10 in the post’s sample: those are the ones we can see', why: 'The sample shows those 10 rows, not that the rest are safe.'}]},
  {title: 'Round 2: whose fault was it?', who: 'Lorna Pike',
   ask: '“Was it a teacher’s fault? I hear one signed in from abroad.”',
   resp: [{label: 'No: that sign-in was hers, and the shared logins and the token’s scope are setup, not anyone’s fault', good: true},
          {label: 'Partly: the teacher’s VPN let the attacker in', why: 'Nothing ties her sign-in to the breach. Her own device and her own approval; the report names nobody.'},
          {label: 'The vendor’s fault alone: nothing on the district’s side needed fixing', why: 'The token could read more than the contract listed, and the shared logins were the district’s to fix.'}]},
  {title: 'Round 3: Lumenlark’s report', who: 'Dr Corinne Vale',
   ask: '“Can the Board read Lumenlark’s full report?”',
   resp: [{label: 'Kole decides that: the full report comes only under terms she is still weighing', good: true},
          {label: 'Yes: sign the terms tonight and send it to the Board members before the next meeting', why: 'The terms bar the district’s own firm and insurer. Whether to sign is Kole’s decision.'},
          {label: 'No, never: vendor reports are always worthless', why: 'An absolute about a report nobody has read. Counsel decides on the terms.'}]}];

/* ---------- The boss: the vendor confirms, and an extortion post (game-original), one seat per track ---------- */
function sdMgrBossStages() {
  const open = sdN10Open(), thin = !!(G.cr.sd && G.cr.sd.night10 && G.cr.sd.night10.tired);
  return {
    s1: {title: 'Stage 1 (' + sdAt('06:20') + '): coordinate',
      clues: ['05:10: Lumenlark emails Owen Marsh: “files copied from our environment included roster data from your district’s integration.” No dates, no counts.',
        open ? '07:00: Owen Marsh reads it, finds the post on leaks.example naming the district, and calls you at 07:10.'
        : thin ? '05:40: the on-call lead, on a third night running, sends a thin first look: “a post names the district, something about Lumenlark.” The email and the sample rows come at 07:10, from Marsh.'
        : '05:40: the on-call lead captures a post on leaks.example: “Lumenlark: student records from 900+ districts. Lumenlark has until Monday to pay.” It names the district, with 10 sample rows.',
        'Dr Vale is on her way in; Kole, Priya and the Board chair don’t know yet. The firm has been engaged since Monday.'],
      ask: 'You are the IR manager. Who does what, first?',
      resp: [{label: 'Dr Vale owns the decisions; Kole and Priya now; the firm gets the email and the capture; Pike told', good: true},
             {label: 'Reply to the poster asking which of our students they hold, before anyone else in the district is up', why: 'Nobody talks to an extortionist without the Superintendent and counsel, and the answer would be a claim, not a fact.'},
             {label: 'Email families at seven, before the news reaches them some other way and the phones start', why: 'What families are told is for Kole and Priya to decide, on facts. A letter at seven would be the post’s version.'},
             {label: 'Take SIS-01 offline at once: the data is out, so shut down the system it came from today', why: 'The rows left from Lumenlark’s copy, and the sync is already off. Shutting Inkstone stops the schools, not the leak.'}]},
    s2: {title: 'Stage 2 (09:00): the Board, and the families’ calls',
      clues: ['08:40, the firm: all 10 sample rows match our students’ records (IDs, schools, grades, sections); no grades or attendance in the sample.', 'Our side: the sync sent six roster fields; grades and attendance were never shared with Lumenlark, and the integration read rosters only in the 90 days before it was revoked.', 'Not known: when, how many of ours, whether more will be published. Phones at every school opened at 08:00.'],
      ask: 'Emergency Board meeting, and principals asking what to say. What do you give them?',
      resp: [{label: 'What we know and don’t; Kole and Priya decide what families hear; next update 13:00; no promises', good: true},
             {label: 'Tell families their children’s data is safe: only names and classes, nothing that matters', why: 'A promise about data the district no longer controls. Say what was shared; counsel and Priya decide the message.'},
             {label: 'Nothing until the investigation ends: a half answer would only worry families more', why: 'The Board hears it from you first, with the gaps named and a time for the next update.'},
             {label: 'Lead with the post’s “900+ districts”: it shows this isn’t the district’s fault, and parents will see that', why: 'The post’s claim is the criminal’s. Say what the evidence shows about our students.'}]},
    s3: {title: 'Stage 3 (13:00): the way back',
      clues: ['12:30, the firm: no call with the token since it was revoked on Monday at 10:05.', 'Lumenlark still holds our students’ rosters and reading progress (Exhibit A).', 'The demand in the post is to Lumenlark, not the district.'],
      ask: 'Which plan do you take to Dr Vale and Kole?',
      resp: [{label: 'Sync paused; ask what Lumenlark still holds; re-enable only after a review and a token limited to Exhibit A', good: true},
             {label: 'Re-enable the sync this afternoon with a new token: teachers need fresh rosters, and the old token is gone', why: 'A new token with the same scope repeats the problem. Review first, and scope it to Exhibit A.'},
             {label: 'Cancel the contract today and tell families the data has been deleted at the vendor, so they can stop worrying', why: 'Cancelling doesn’t delete the vendor’s copy, and Dr Vale decides the contract. Ask for deletion, and say only what is certified.'},
             {label: 'Offer the poster a payment to take our district’s rows down before Monday’s deadline', why: 'A payment buys a promise from the people who took the rows; it isn’t yours to offer, and the demand isn’t to the district.'}]}
  };
}
function sdDfirBossStages() {
  return {
    s1: {title: 'Stage 1 (' + sdAt('06:40') + '): preserve, then scope',
      clues: ['05:10: Lumenlark’s email to Owen Marsh: the copied files included roster data from our integration.', '05:40: a post on leaks.example names the district, with 10 sample rows; the Compact’s on-call lead captured it.', 'Kole has engaged the firm under a second letter: what could have left through the integration, and anything on our side since the revocation (game).'],
      ask: 'What do you do first?',
      resp: [{label: 'Hash the capture and email; re-export the log and registry; via Kole, ask Lumenlark to keep its records', good: true},
             {label: 'Re-enable LL-SYNC with a watch on it, to see who uses it next and catch them in the act', why: 'That would open the student rosters again to whoever holds the token. Keep it revoked; your logs answer the question.'},
             {label: 'Ask Lumenlark for an account on its systems so you can look for yourself, with Kole’s blessing', why: 'Its systems are out of scope and not the firm’s to examine. Request its records through counsel.'},
             {label: 'Reply to the post asking how many of our students’ rows they hold, to size the problem', why: 'Nobody talks to an extortionist without the Superintendent and counsel; the evidence is in your logs and the vendor’s.'}]},
    s2: {title: 'Stage 2 (11:00): what could have left through the integration',
      clues: ['S-01: the sync shared six roster fields for 3,140 students.', 'S-03: LL-SYNC’s scope was “read: all”: rosters, grades, attendance.', 'S-02 and S-12: in the 90 days before its revocation, LL-SYNC called roster endpoints only; nothing after 10:05 on Day 8.', 'S-11: the 10 sample rows hold student IDs, schools, grades and sections; no grades, no attendance.'],
      ask: 'From our side, what could have left through the integration?',
      resp: [{label: 'Six fields for all 3,140 students: grades and attendance were readable but unread in 90 days; earlier unknown', good: true},
             {label: 'Everything in Inkstone: the token was “read: all”, so write that all of it left through the integration', why: 'What the token could read is not what it read. The log shows roster calls only, for 90 days.'},
             {label: 'Only the 10 rows in the sample: nothing else is shown to have left the vendor or the district', why: 'The sample shows 10 rows, not that the other 3,130 stayed. Our side shows what was shared.'},
             {label: 'Nothing: LL-SYNC has been revoked since Monday, so nothing could leave', why: 'Revoking stopped new reads. What was shared before it is what could have left.'}]}
  };
}

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  sdinventory: {name: 'A vendor and data inventory', desc: 'From the district’s own records (what the systems share, which apps sign in, what is paid for, what is signed): who holds which student data, under which contract, and who owns each relationship. The owner is the department that uses the service; the technology office is the technical contact.'},
  sdnotice: {name: 'Work a vendor’s breach notice', desc: 'Find the contract’s incident clause, send specific questions under it in writing, dated, with a reply date, and log them. A vague notice is the start of the questions, not the answer.'},
  sdreview: {name: 'A minimum data review before signing', desc: 'Four questions before any new app gets student data: what it takes, where it goes, what its terms say about the data and about a breach, and who signs and owns it. The owner decides, with the privacy officer’s review.'},
  sdfacts: {name: 'Facts for counsel and the privacy officer', desc: 'What was shared, what the vendor has said, what your own logs show, and what isn’t known and who holds it. No legal conclusions, no promises, no guesses: counsel and the privacy officer decide what families are told.'},
  sdthird: {name: 'Unknown: held by the vendor', desc: 'When the decisive evidence sits at a third party, the finding is unknown, with where it is and when it was requested: “unknown: held by the vendor; requested on Day 8”. Your own side’s evidence is still reported as what it shows.'},
  sdsignin: {name: 'Judge an unusual sign-in', desc: 'A country or an hour is a reason to look. Device, second factor and what the session did come from the sign-in record; the owner’s answer comes on a channel the question doesn’t touch, such as a number you already had.'},
  sdscope: {name: 'Scope tokens to the contract', desc: 'An integration token should read only what the contract’s data list allows. A default “read everything” scope turns a vendor’s breach into a question about everything the token could reach.'},
  sdnamed: {name: 'Named accounts, not shared logins', desc: 'Every person signs in as themselves. A shared login means nobody can say who did what, and every question about it becomes unanswerable.'},
  sdstatus: {name: 'Read the firm’s status report', desc: 'A retained firm reports what it found, what it didn’t, and anything it saw outside its questions, which goes to counsel first.'}
});
Object.assign(FACTS, {
  sdferpa: {name: 'FERPA, in the Department of Education’s words', desc: 'The US Department of Education’s Student Privacy Policy Office describes the Family Educational Rights and Privacy Act (FERPA) as a federal law that affords parents the right to have access to their children’s education records, the right to seek to have the records amended, and the right to have some control over the disclosure of personally identifiable information from the education records. When a student turns 18, or enters a postsecondary institution at any age, the rights transfer to the student. The statute is 20 U.S.C. § 1232g; the regulations are 34 CFR Part 99. What FERPA, or your state’s student-privacy law, requires after a vendor’s breach is for the district’s counsel and privacy officer to say: check your state’s law. The game states no requirement.', src: 'US Department of Education, Student Privacy Policy Office, “What is FERPA?”'},
  sdptac: {name: 'Online educational services: ED’s best practices', desc: 'The Department of Education’s Privacy Technical Assistance Center (PTAC), in Protecting Student Privacy While Using Online Educational Services: Requirements and Best Practices (February 2014; the page says it is being reviewed and updated), lists best practices including “Be aware of which online educational services are currently being used in your district”, “Have policies and procedures to evaluate and approve proposed online educational services” and “When possible, use a written contract or legal agreement”, and suggests that agreements describe each party’s responsibilities in the event of a data breach.', src: 'US Department of Education, PTAC, Protecting Student Privacy While Using Online Educational Services (February 2014)'},
  sdcisak12: {name: 'CISA on K-12 cybersecurity', desc: 'CISA’s report Protecting Our Future: Partnering to Safeguard K–12 Organizations from Cybersecurity Threats (January 2023) finds, in CISA’s release, that K-12 organizations need “resources, simplicity and prioritization”, and makes three recommendations: “Invest in the most impactful security measures and build toward a mature cybersecurity plan.” “Recognize and actively address resource constraints.” “Focus on collaboration and information-sharing.”', src: 'CISA, release of 24 January 2023 (URL date) and CISA’s K-12 page'}
});
TECH['T1550.001'] = {name: 'Use Alternate Authentication Material: Application Access Token', tactic: ['Lateral Movement'], desc: 'Using a stolen application access token in place of a login to reach accounts, data or services. Here it is the question the district’s evidence can’t yet answer: whether anyone but the vendor’s sync used the integration’s token.'};
GAME_NOTES.push(
  'The School District’s schools, its 4,860 students and 212 teachers, student ID numbers, Inkstone and SIS-01, the shared logins, the SSO, FW-SD, Lumenlark Learning and its breach, the contract and its clauses (§6, §9, §11, §14, Exhibit A), LL-SYNC and its scope, Ferrylane, Chimewell, Sumcraft, Oxlow Area Schools, leaks.example and every log line are invented. (game)',
  'The district’s annex to the Compact’s plan, the night threshold, the week-2 rota and its calls, the risk register and tabletop injects, the vendor’s offer and its terms, the report scores, the Slate Badge’s effects and every time and count are invented. No student is a suspect in anything. (game)'
);
