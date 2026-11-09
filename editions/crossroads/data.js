/* ============================================================
   UPTIME · editions/crossroads/data.js
   Crossroads (edition 2): base tables the shared engine needs, the prologue's
   maps (the Town Hall war room and the town square), the people met there,
   the ATT&CK techniques this edition shows, Field Manual text and the game notes.
   Crossroads has no wild alerts: no cabling, no alert mix (THREATS is empty).
   Its loops are the rota, exercises, records reviews and drills (IR manager) or
   evidence, custody and reports (principal DFIR consultant).
   People, hosts, accounts, counts and times are invented (game). Real facts
   are cited in CREDITS.md, section "Crossroads". Timeline: scratchpad
   crossroads-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Palettes (people: the Town Hall leads keep their Town Hall colours) ---------- */
Object.assign(PAL, {
  crWar: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  crTeam: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  crSquare: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  merrin: ['#1a1a2e', '#5b4a42', '#c98a54', '#4a1414'],
  noor: ['#1a1a2e', '#141414', '#a8703f', '#3a4a6b'],
  paz: ['#1a1a2e', '#3b2418', '#c98a54', '#2f6e3e'],
  magda: ['#1a1a2e', '#3b2418', '#c98a54', '#7a3d8a'],
  lucia: ['#1a1a2e', '#2b1d16', '#e0b090', '#5a2a6e'],
  theo: ['#1a1a2e', '#c0a040', '#f0c8a0', '#3a6e8a']
});

/* ---------- Tiles (single UTF-16 units, so map rows keep their lengths) ---------- */
Object.assign(TILES, {
  '¥': {spr: 'counter', pal: 'crWar', solid: true, under: ','},   // the war room's incident command table
  'µ': {spr: 'K', pal: 'crTeam', solid: true}                      // the team board
});

/* ---------- Maps: the Town Hall war room and the town square ---------- */
// The war room (prologue): the team board (north-west), the command table, your desk, the door south to the square.
// The square: Town Hall's door in the north edge, the Library's door in the south edge, the School District's in the east
// edge, the Community Clinic's in the west edge, Fire & EMS Dispatch's in the north edge beside Town Hall's.
const MAPS = {
  cwar: {
    name: 'Town Hall · war room',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "w,µµ,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,¥¥¥¥¥¥,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,Y,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'csquare', x: 9, y: 1, dir: 'down'}}
  },
  csquare: {
    name: 'The town square',
    rows: [
      "hhhhhhhhhEhhhhhDhhhh",
      "h..................h",
      "h..S...............h",
      "h..................h",
      "h..hhhh......hhhh..h",
      "D..................D",
      "h..................h",
      "h..hhhh......hhhh..h",
      "h..................h",
      "h..................h",
      "hhhhhhhhhDhhhhhhhhhh"
    ],
    doors: {'9,0': {to: 'cwar', x: 9, y: 9, dir: 'up'},
      '9,10': {to: 'library', x: 15, y: 1, dir: 'down',
        get locked() { return (typeof G !== 'undefined' && G && G.trackId) ? undefined : 'The Public Library. It opens to you once you’ve answered the two offers (game).'; }},
      '19,5': {to: 'school', x: 1, y: 7, dir: 'right',
        get locked() { return (typeof G !== 'undefined' && G && G.trackId && G.f && G.f.lbBookmark) ? undefined : 'The School District office. Its door opens to you after the Library Board (the Bookmark Badge, game).'; }},
      '0,5': {to: 'clinic', x: 28, y: 7, dir: 'left',
        get locked() { return (typeof G !== 'undefined' && G && G.trackId && G.f && G.f.sdSlate) ? undefined : 'Quillfield Community Clinic. Its door opens to you after the School Board (the Slate Badge, game).'; }},
      '15,0': {to: 'dispatch', x: 15, y: 14, dir: 'up',
        get locked() { return (typeof G !== 'undefined' && G && G.trackId && G.f && G.f.cnPulse) ? undefined : 'Fire & EMS Dispatch. Its door opens to you after the Clinic Board (the Pulse Badge, game).'; }}},
    outdoor: true
  }
};
const GROUPS = {};          // no building groups: Crossroads has no baseline-hardening metric
const ACCOUNTS_TOTAL = 1;   // unused (no MFA metric here)

/* ---------- People in the prologue ---------- */
const NPCS = [
  {id: 'raecr', name: 'Rae Okafor', role: 'suspicion-file lead', map: 'cwar', x: 2, y: 2, dir: 'down', pal: 'rae'},
  {id: 'pazcr', name: 'Paz Delgado', role: 'digital services lead', map: 'cwar', x: 13, y: 5, dir: 'left', pal: 'paz'},
  {id: 'magdacr', name: 'Magda Petrov', role: 'IT operations lead', map: 'cwar', x: 4, y: 5, dir: 'right', pal: 'magda'},
  {id: 'merrincr', name: 'Mayor Dalia Merrin', role: 'mayor and council chair', map: 'cwar', x: 5, y: 4, dir: 'right', pal: 'merrin', cond: G => !!G.f.crOffers && !G.trackId},
  {id: 'luciacr', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'cwar', x: 12, y: 4, dir: 'left', pal: 'lucia', cond: G => !!G.f.crOffers && !G.trackId}
];

/* ---------- ATT&CK techniques met in this edition (checked on attack.mitre.org, 7 Nov 2026, ATT&CK content v20.1) ---------- */
const TECH = {
  'T1056.001': {name: 'Input Capture: Keylogging', tactic: ['Collection', 'Credential Access'], desc: 'Recording what a person types, often to catch passwords as they are entered.'},
  'T1078': {name: 'Valid Accounts', tactic: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Stealth'], desc: 'Signing in with real credentials that were stolen or guessed, so the activity looks legitimate. Here: a vendor’s support account in the Library; in the School District, the explanation a teacher’s sign-in drill rules out.'},
  'T1657': {name: 'Financial Theft', tactic: ['Impact'], desc: 'Stealing money or demanding it, for example by threatening to publish stolen data unless a payment is made.'}
};

/* ---------- No wild alerts (the engine's alert tables stay empty) ---------- */
const THREATS = {};
const MAL_WEIGHTS = [];
const HOSTS = ['CIRC-01'];
const ALERTS = {};
const ALERT_CHAINS = {};
const BRIEFS = [];

/* ---------- Field Manual ---------- */
const EXTRA_ACTIONS = {
  crrota: {name: 'An on-call rota with rest', desc: 'One person on call each night, nobody on call too many nights in a row, and the week’s overtime counted against a budget. A tired responder makes slower, thinner calls: rest is part of the coverage, not a favour.'},
  crgrowth: {name: 'Stretch work, with review', desc: 'Give the next hard job to the person who should grow into it, and read their work before it goes out. Doing it yourself keeps you the bottleneck; sending it unread skips the review every close gets.'},
  crtabletop: {name: 'Exercise from the risk register', desc: 'Pick the scenario from the organisation’s own risks, where the plan is weakest and the impact highest. The exercise is for finding gaps; each gap becomes an action.'},
  crretainer: {name: 'Activate a retainer with an arrival pack', desc: 'Know who makes the call and have four things ready: the scope in writing, named contacts with phone numbers, the access the firm will need, and the evidence already held with its custody record. Counsel is told at once and decides how the firm is engaged.'},
  craar: {name: 'An after-action review with owners and dates', desc: 'Blameless: what happened, why it worked, what changes. Each corrective action has one owner from the organisation that runs the service and a completion date, and someone checks it closed.'},
  crcover: {name: 'After-hours cover with a threshold', desc: 'Agree with the service owner which alerts page someone at night and which wait for the morning, in writing, and keep outside help for the pages that need more hands. Cover nobody can sustain is no cover.'},
  crscope: {name: 'Work to the scoping letter', desc: 'Read the questions, the scope and who receives the report before collecting anything. A finding outside the questions goes to counsel first; counsel decides privilege, notification and disclosure.'},
  crcustody: {name: 'Custody log and hashes', desc: 'For every item: who handed it over, when, the hash at collection and the hash on receipt, where the original is sealed. Work on a copy. A gap is recorded as a gap, never filled in.'},
  crstores: {name: 'One evidence store per client', desc: 'Each client’s evidence stays in its own store. If an indicator matters to two clients, the engagement leads and each client’s counsel decide what may be shared.'},
  crwording: {name: 'Confirmed, likely, unknown', desc: 'Confirmed: the evidence shows it. Likely: the evidence points to it but doesn’t show it. Unknown: the evidence can’t say. Overclaiming is as wrong as a wrong verdict; an honest unknown, with the next step, is a finding.'},
  crrestore: {name: 'Restore public PCs between sessions', desc: 'Return each public PC to a clean image when a patron logs off and again overnight, so nothing one patron leaves behind (files, logins, a program) is there for the next.'},
  crsplit: {name: 'Separate the patron network', desc: 'Put patron Wi-Fi and public PCs on their own network that reaches the internet but not staff systems or the patron-records server.'},
  crvendor: {name: 'A vendor escalation contact', desc: 'Every system a vendor supports has a named escalation contact on the plan’s contact page, and a list of the addresses the vendor’s support comes from.'},
  crclaim: {name: 'Check a leak claim against your own records', desc: 'Compare the sample with your own schema and formats, and read your system’s export records. A claim’s size and its poster’s reputation fit a true claim and a false one alike.'},
  crclock: {name: 'One clock for every timeline', desc: 'Note each source’s time zone, convert everything to one (usually UTC), and write the conversion down, so anyone can check it.'}
};
const FACTS = {
  cr80086: {name: 'NIST SP 800-86: forensics in incident response', desc: 'NIST SP 800-86, Guide to Integrating Forensic Techniques into Incident Response (August 2006), describes a forensic process in four phases: collection, examination, analysis and reporting. It says a clearly defined chain of custody should be followed to avoid allegations of mishandling or tampering, that integrity is usually checked by computing the message digest of the original and of the copy and comparing them, and that examination and analysis should use only a copy. It takes an IT view, not a law-enforcement one, and tells readers to consult management and legal counsel.', src: 'NIST SP 800-86 (August 2006)'},
  crfips: {name: 'FIPS 180-4: the Secure Hash Standard', desc: 'FIPS 180-4 specifies hash algorithms including SHA-256. In its own words, the digests are used to detect whether messages have been changed since the digests were generated. The 2015 edition changed only the applicability clause of the 2012 one.', src: 'NIST FIPS 180-4, Secure Hash Standard (2012; 2015 edition)'},
  crctep: {name: 'CISA tabletop packages and the after-action report', desc: 'CISA’s Tabletop Exercise Packages (CTEP) give template objectives, scenarios and discussion questions, with templates including an After Action Report. CTEP’s After-Action Report / Improvement Plan template has an improvement plan whose columns include “Issue/Area for Improvement”, “Corrective Action”, “Primary Responsible Organization”, “Start Date” and “Completion Date”.', src: 'CISA, CISA Tabletop Exercise Packages; CTEP AAR-IP template (2020)'},
  crnicemgr: {name: 'IR manager in the NICE Framework', desc: 'The NICE Framework has no IR manager work role. The closest are Incident Response (PD-WRL-003), “Responsible for investigating, analyzing, and responding to network cybersecurity incidents”, and Cybersecurity Workforce Management (OG-WRL-003), which develops workforce plans, assessments, strategies and guidance; one of its tasks is T1450, “Allocate and distribute human capital assets”. An on-call rota is one way of doing that (game).', src: 'CISA NICCS task T1450 and task T1617 pages (no version label shown); NICE Framework Components v2.2.0 summary of changes (April 2026), which lists no change to these roles or tasks'},
  crnicedfir: {name: 'Principal DFIR consultant in the NICE Framework', desc: 'The closest work role is Digital Forensics (PD-WRL-002), “Responsible for analyzing digital evidence from computer security incidents to derive useful information in support of system and network vulnerability mitigation”. Its tasks include T1510, “Preserve digital evidence”, and T1617, “Prepare cyber defense reports” (also an Incident Response task). “Principal” and “consultant” are market words: NICE work roles carry no seniority and no employment model, and no NICE task is worded as being an expert witness.', src: 'CISA NICCS task T1510 and T1617 pages (no version label shown); NICE Framework Components v2.2.0 summary of changes (April 2026)'},
  crala: {name: 'Library records and privacy', desc: 'The American Library Association says that forty-eight states and the District of Columbia have laws protecting the confidentiality of library records, and that Kentucky and Hawaii rely on attorney general opinions (ALA page, updated November 2021). The ALA Code of Ethics (amended 2021) begins its third principle: “We protect each library user’s right to privacy and confidentiality with respect to information sought or received...” Which law applies to this library, and what it requires, is the town attorney’s question, not the security team’s.', src: 'ALA, State Privacy Laws Regarding Library Records; ALA Code of Ethics'}
};
const GAME_NOTES = [
  'Crossroads has no wild alerts and no cabling: its work is the rota, exercises, records reviews and drills (IR manager) or evidence, custody and reports (DFIR). Select says what the on-call queue is doing. (game)',
  'The rota’s rules (one lead a night, 18:00–06:00, no more than two nights in a row or two in the week), the 30-hour overtime budget, 3 overtime hours a call-out (5 when the lead is tired), and the fatigue effects (a thinner first look, with fewer facts in it; your Focus −10 the next morning; on the DFIR track a handover without its collection hash) are invented. (game)',
  'Every person, the Riverbend Shared Services Compact, Tallowmere Forensics, Oxlow Township, the Public Library’s settings, Shelfwright and Shelfwright Systems, hosts, accounts, card numbers, bookings, counts, times and addresses are invented. Addresses are documentation ranges. (game)',
  'The scoping letter, the retainer and its arrival pack, the time-to-activate clock, the report-writing scores (an overclaim scores like a wrong verdict and counts as a claim corrected; an underclaim scores 8 of 20) and both scorecards are game models. (game)',
  'The game never says what any law requires. Noor, the town attorney, decides privilege, notification and what may be disclosed; the Director and the Library Board decide the Library’s services and any payment. (game)',
  'The Bookmark Badge’s effects (owners on arrival for AAR actions; collection hashes on the Compact’s handovers; Focus +4) are invented. (game)'
];
