/* ============================================================
   UPTIME · editions/charter/suppliers-data.js
   Charter district 2: Suppliers (Days 71 to 74). The supplier register's eight
   lines and the tiering rule, the clause catalogue and the Compact's four
   contracts in this year's plan, three drills whose evidence is records, the
   supplier incident (Cobbleton Payroll's notice, told only through the
   Compact's own records, notices, times and decisions), the directive
   (procurement wants a renewal signed today without the notification
   clause), the Suppliers terminals and the Compact Board's Supplier round.
   One decider per decision, whoever is on duty: Edda by day (the on-call lead
   at night) decides a shared-services account's suspension and its return;
   each service's business owner owns its risk and signs any acceptance for a
   must-have clause left out; procurement (Ilka) and counsel (Noor) own the
   Compact's contracts; each member's owner decides that member's contracts;
   counsel decides any notification duty; the CISO sets the security
   requirements, keeps the supplier register and advises.
   Defender side only: no intrusion mechanism, no technique, no ATT&CK ID.
   Every supplier, person, price, count, time, account and address is invented
   (game); addresses are RFC 5737. Real facts: CREDITS.md, section "Charter".
   Timeline: scratchpad charter-timeline.md (slice 2); every line is checked
   against it.
   ============================================================ */
'use strict';

const CH_SUP_ENVELOPE = 30;            // $k a year of price uplift across the Compact's four contracts (game)
const CH_SUP_REVIEW = 155;             // review dates (the Board's next quarterly meeting)
const CH_SUP_DAY = {71: 'Monday', 72: 'Tuesday', 73: 'Wednesday', 74: 'Thursday'};

/* ---------- The tiering rule (game; written by the CISO on Day 68) ---------- */
const CH_SUP_RULE = {
  crit: {High: 'a life-safety service or a member’s main service stops', Medium: 'a service slows or goes to paper', Low: 'nothing residents notice for a week'},
  data: {High: 'holds personal records in bulk, or has an account or connection into our systems', Medium: 'holds names and postal addresses only, with no way in', Low: 'holds no personal data and has no way in'},
  text: 'Tier 1 if either is High; Tier 2 if either is Medium and neither is High; Tier 3 if both are Low. Not by spend. (game)'
};

/* ---------- The supplier register: eight lines (game). Inherited: listed by annual spend, no tiers ---------- */
const CH_SUPPLIERS = [
  {id: 'inkmere', name: 'Inkmere Print & Post', short: 'Inkmere', spend: 210, crit: 'Low', data: 'Medium', owner: 'Marit Quellan', holder: 'the Compact', compact: true, wayIn: false,
   serves: 'Prints and posts the members’ notices and the town’s bills, from a file the Compact pushes to its drop site each month. Postage passes through its invoice.',
   stops: 'Bills and notices go out a few days late; the town can print urgent ones itself.', holds: 'Residents’ names and postal addresses, with each notice’s text. No account on our side.'},
  {id: 'cobbleton', name: 'Cobbleton Payroll', short: 'Cobbleton', spend: 85, crit: 'Medium', data: 'High', owner: 'Marit Quellan', holder: 'the Compact', compact: true, wayIn: true,
   serves: 'Runs pay for the members’ 1,180 staff. Collects the pay file from CP-XFER-01, the Compact’s transfer server, through its own account, cp-xfer, every other Thursday at 06:00.',
   stops: 'Pay is late, or paid by hand from the last run.', holds: 'Every member’s staff: names, pay and bank details. One account on our side: cp-xfer.'},
  {id: 'wrenfold', name: 'Wrenfold Health Software', short: 'Wrenfold', spend: 64, crit: 'High', data: 'High', owner: 'Marisol Quintero', holder: 'the Clinic', compact: false, wayIn: true,
   serves: 'The Clinic’s records system, WF-01, with its appointment schedule. Vendor support through Tetherline, on demand only, with MFA.',
   stops: 'Care goes to the downtime cart.', holds: 'Patients’ records. Tetherline into WF-01, on demand.'},
  {id: 'tarnfield', name: 'Tarnfield IT Services', short: 'Tarnfield', spend: 48, crit: 'Medium', data: 'High', owner: 'Joanna Ferreday', holder: 'the Airport', compact: false, wayIn: true,
   serves: 'Desk support and PC builds for the airport’s business office.', stops: 'Office PCs wait for repair; billing slows.', holds: 'One named admin account in the airport’s directory.'},
  {id: 'wellhollow', name: 'Wellhollow Backup', short: 'Wellhollow', spend: 36, crit: 'Low', data: 'High', owner: 'Edda Thornquist', holder: 'the Compact', compact: true, wayIn: false,
   serves: 'Keeps the Compact’s off-site copies of every member’s data, pushed to it by the Compact each night.',
   stops: 'No off-site copy until it is back; nothing stops for residents.', holds: 'Copies of every member’s data, records included. No account on our side.'},
  {id: 'stillmark', name: 'Stillmark', short: 'Stillmark', spend: 22, crit: 'High', data: 'High', owner: 'Celia Marrow', holder: 'the county 911 authority', compact: false, wayIn: true,
   serves: 'Dispatch’s CAD vendor. Since the Dispatch week: “Stillmark’s access on demand from its range with MFA, in its contract (Celia)”.',
   stops: 'A CAD fault with no support: the floor goes to cards.', holds: 'Support access into CAD, on demand.'},
  {id: 'shelfwright', name: 'Shelfwright Systems', short: 'Shelfwright', spend: 16, crit: 'Medium', data: 'High', owner: 'Director Mina Strand', holder: 'the Library', compact: false, wayIn: true,
   serves: 'The Library’s circulation system, with the patron records. Support access on demand from its documented range, with MFA. Its contract (2019) is the Director’s.',
   stops: 'Checkout goes manual.', holds: 'Patron records. Support access into CIRC-01, on demand.'},
  {id: 'glasswick', name: 'Glasswick AV', short: 'Glasswick', spend: 7, crit: 'Low', data: 'Low', owner: 'Edda Thornquist', holder: 'the Compact', compact: true, wayIn: false,
   serves: 'Services the Board room’s display and the operations room’s wall screens, on site and escorted.',
   stops: 'A blank screen in a meeting.', holds: 'No data and no account.'}];

/* ---------- The clause catalogue (game, written fresh; no text from any real contract or template) ---------- */
// must: the tiers for which the clause is a must-have; wayIn: a must-have only where the supplier has a way in.
const CH_CLAUSES = [
  {id: 'C1', name: 'Notify within 24 h', must: [1, 2], text: 'Tell the Compact’s named security contact within 24 hours of detecting a security incident on any system used for the service, with the time it was detected.',
   without: 'You hear of its incident when someone reads a mailbox (Tuesday: 10 h 56 min after Cobbleton sent its notice).'},
  {id: 'C2', name: 'Security contacts', must: [1, 2, 3], text: 'A named security contact on each side, reachable at any hour, kept current.',
   without: 'Nobody to call at night; the account manager is the only name you have.'},
  {id: 'C3', name: 'Logs and access to them', must: [1], text: 'Keep logs of access to the Compact’s data and connections for 12 months, and give the Compact the entries relevant to it within one working day of asking.',
   without: 'You ask, and wait (Cobbleton: 49 h 50 min to an answer covering the 23:52 login).'},
  {id: 'C4', name: 'Independent assurance', must: [1, 2], text: 'An independent assessment of the service the Compact uses, no older than 12 months, or the Compact’s right to assess.',
   without: 'A clean report on another service, or an old one, is all you can ask for.'},
  {id: 'C5', name: 'Subcontractors named', must: [1], text: 'Name every subcontractor that handles the Compact’s data, and tell the Compact before adding one.',
   without: 'Your data can sit with a company you have never heard of.'},
  {id: 'C6', name: 'Access conditions', must: [1], wayIn: true, text: 'Reach the Compact’s systems only through named accounts, from agreed addresses, with MFA for every person, and each session approved or scheduled.',
   without: 'An account in, on whatever terms it was set up with.'},
  {id: 'C7', name: 'Return and delete at exit', must: [1, 2], text: 'At the end, return the Compact’s data and delete every copy, confirmed in writing.',
   without: 'At exit, copies of your data stay where they are.'},
  {id: 'C8', name: 'Fix timelines', must: [1], text: 'Fix critical vulnerabilities in the service within 14 days, and say when it is done.',
   without: 'A known flaw stays open as long as the supplier likes.'}];
const CH_CLAUSE_COUNSEL = ['Insurance', 'Indemnity'];   // counsel's and procurement's call (Noor and Ilka), never the CISO's

/* ---------- The Compact's four contracts in this year's plan (game) ---------- */
// has: clauses in the contract now. offer: what each missing clause costs, [uplift $k a year, goodwill].
const CH_SUP_CONTRACTS = [
  {id: 'cobbleton', what: 'An amendment, after Tuesday', goodwill: 7, has: ['C5', 'C7'],
   offer: {C1: [3, 1], C2: [0, 1], C3: [4, 2], C4: [3, 1], C6: [2, 1], C8: [3, 1]}},
  {id: 'wellhollow', what: 'Renewal this year', goodwill: 4, has: ['C1', 'C2', 'C7'],
   offer: {C3: [2, 1], C4: [3, 1], C5: [0, 1], C8: [2, 1]}},
  {id: 'inkmere', what: 'Renewal: the old contract ends on Friday, Day 75', goodwill: 4, has: ['C7'],
   offer: {C1: [4, 1], C2: [0, 1], C4: [2, 1], C3: [3, 1], C5: [0, 1], C8: [2, 1]}},
  {id: 'glasswick', what: 'Renewal this year', goodwill: 2, has: [],
   offer: {C2: [0, 1], C5: [0, 1]}}];
// The members' own contracts: their owners' decisions. The CISO sends each owner its tier's requirements (Thursday).
const CH_SUP_MEMBER_HAS = {wrenfold: ['C1', 'C2', 'C3', 'C6', 'C7'], tarnfield: ['C1', 'C2', 'C6', 'C7', 'C8'], stillmark: ['C2', 'C6', 'C7'], shelfwright: ['C2']};
// What an owner does meanwhile when a must-have clause is left out of a contract (the acceptance's interim measure).
const CH_CLAUSE_INTERIM = {
  C1: 'The owner’s team reads the supplier’s mailbox and status page each working day, and the on-call number is sent to the supplier by letter.',
  C2: 'The account manager’s number is on the incident page until a security contact is named.',
  C3: 'The Compact keeps its own logs of the supplier’s connections for 12 months.',
  C4: 'The owner asks for the supplier’s current report each quarter and records what it covers.',
  C5: 'The owner asks each quarter who handles the Compact’s data.',
  C6: 'Edda’s team limits the account to the supplier’s documented addresses and reviews its sign-ins monthly.',
  C7: 'The owner keeps a list of where the Compact’s data sits with the supplier.',
  C8: 'The owner asks each quarter which critical fixes are open, and for how long.'};

/* ---------- Drills (Monday and Wednesday). Records are the evidence; two decisive sources each ---------- */
const CH_SUP_DRILLS = {
  supdata: {
    id: 'supdata', title: 'Inkmere and residents’ data', budget: 3,
    intro: '<p>Inkmere Print & Post is the biggest invoice on the register. Its questionnaire, returned at its last renewal, says it holds no personal data. Beatriz exported the account lists, and Edda’s data-flow record, at 08:30. Does Inkmere have access to residents’ data?</p>',
    artefact: '<pre class="art">Supplier questionnaire · Inkmere Print & Post (game data)\n' +
      'Personal data held?        “No personal data is held.”\n' +
      'Access to your systems?    “No.”</pre>' +
      '<p class="small">A questionnaire says what a supplier believes. The data-flow record and the account lists say what goes to it, and how it could reach us.</p>',
    question: 'Does Inkmere have access to residents’ data?',
    sources: [
      {id: 'answer', name: 'Inkmere’s questionnaire', qs: [
        {q: 'What does it say it holds?', kind: 'trap', res: ['“No personal data is held.”', '(What it believes. Not a record.)']}]},
      {id: 'phone', name: 'Inkmere’s account manager, by phone', qs: [
        {q: 'What does Inkmere do with what we send?', kind: 'trap', res: ['“We only print what you send us.”', '(True, and beside the question.)']}]},
      {id: 'flows', name: 'The data-flow record (outbound jobs, 08:30 export)', qs: [
        {q: 'What goes to Inkmere, how, and how often?', kind: 'focus', key: true,
         res: ['Monthly, first working day: the members’ notices and the town’s bills, pushed by the Compact to Inkmere’s drop site', 'Fields: name, postal address, notice type, the notice’s text (for bills, the amount due)', 'About 14,200 residents a month (game)']},
        {q: 'Every outbound job, in full', kind: 'broad', rows: 640,
         wall: ['job {i}  {t}  push  member {n}', 'job {i}  {t}  pull  backup set {n}', 'job {i}  {t}  push  report {n}']}]},
      {id: 'accounts', name: 'The account lists (shared directory, CP-XFER-01)', qs: [
        {q: 'Does Inkmere have any account on our side?', kind: 'focus', key: true,
         res: ['Shared directory: no Inkmere account', 'CP-XFER-01: no Inkmere account (the Compact pushes; Inkmere never connects in)', 'Vendor support at the members: none for Inkmere']}]}
    ],
    verdicts: [
      {label: 'Yes: it holds residents’ names and addresses every month, with no way into our systems', good: true, needs: ['flows', 'accounts'],
       needsWhy: 'the answer rests on two records: what goes to it (the data-flow record) and how it could reach us (the account lists). You read only one of them.',
       why: 'The data-flow record shows the monthly file of names and addresses; the account lists show no way in. On the rule: data Medium, so Tier 2.'},
      {label: 'No: as its questionnaire says, it holds no names or other personal data, and no account', why: 'The questionnaire is what Inkmere believes. The data-flow record shows 14,200 residents’ names and addresses a month.'},
      {label: 'It can reach our systems too: Tier 1, as it collects the file from CP-XFER-01', why: 'The account lists show no Inkmere account: the Compact pushes the file to it.'},
      {label: 'Not known until Inkmere’s account manager writes it down for the register', why: 'The answer is in our own records already: what we send, and that it has no account.'}],
    reasons: [
      {label: 'The data-flow record shows the monthly file. The account lists show no way in', good: true, why: 'What goes to it, and how it could reach us.'},
      {label: 'Its questionnaire answers it: a supplier knows what it holds, and it wrote that down', why: 'A questionnaire is a belief, written down. The records show what is sent.'},
      {label: 'It only prints and posts: what it handles ends up as paper in envelopes', why: 'Paper begins as a file of names and addresses, held on its side.'}],
    alts: [
      {label: 'The monthly file goes to another company’s drop site', good: true, why: 'Ruled out: the job names Inkmere’s drop site.'},
      {label: 'Inkmere connects in to fetch the file', good: true, why: 'Ruled out: no Inkmere account on CP-XFER-01 or in the directory; the Compact pushes.'},
      {label: 'The questionnaire was filled in by the wrong person at Inkmere', why: 'Beside the point: the records decide it, whoever filled it in.'},
      {label: 'The town’s bills hold no personal data', why: 'They hold names, postal addresses and amounts due.'}],
    path: '<p>“Does this supplier have access to our data?” is decided by <b>the data-flow record</b> (what goes to it) and <b>the account lists</b> (how it could reach us). A questionnaire says what the supplier believes.</p>',
    response: ['Inkmere on the rule: data Medium (names and addresses, no way in), criticality Low: Tier 2', 'Its questionnaire answer is corrected on the register, the record cited', 'Marit, its owner, is told: its contract ends on Friday'],
    techs: [], acts: ['chdataflow']
  },
  supattest: {
    id: 'supattest', title: 'Wellhollow’s assurance report', budget: 3,
    intro: '<p>Wellhollow Backup holds the Compact’s off-site copies of every member’s data. For its renewal, Wellhollow sent its Brindlemark Assurance Report (a game name). Is it enough for the Compact’s requirement?</p>',
    artefact: '<pre class="art">Brindlemark Assurance Report · Wellhollow (game data)\n' +
      'Opinion    “No exceptions noted.”</pre>' +
      '<p class="small">The requirement is in the clause catalogue (C4). The report has a scope page and a period.</p>',
    question: 'Is Wellhollow’s report enough for the Compact’s requirement?',
    sources: [
      {id: 'cover', name: 'The report’s cover letter', qs: [
        {q: 'What did the assessors find?', kind: 'trap', res: ['“Clean opinion: no exceptions noted.”', '(Clean about what it looked at.)']}]},
      {id: 'badge', name: 'Wellhollow’s website', qs: [
        {q: 'What does Wellhollow say about it?', kind: 'trap', res: ['A badge: “Brindlemark assured”.', '(A badge, not a scope.)']}]},
      {id: 'req', name: 'The requirement (C4, the clause catalogue, Day 68)', qs: [
        {q: 'What must an assurance report cover?', kind: 'focus', key: true,
         res: ['The service the Compact uses', 'No older than 12 months when the Compact relies on it', 'Or the Compact’s right to assess']}]},
      {id: 'scope', name: 'The report’s scope and period pages', qs: [
        {q: 'Which service, and which dates?', kind: 'focus', key: true,
         res: ['In scope: Wellhollow’s hosted file-sharing service', 'Not in scope: Wellhollow’s off-site backup service', 'Period: twelve months, ended 15 months before this week (the report’s own dates, game)']},
        {q: 'Every page of the report', kind: 'broad', rows: 140,
         wall: ['page {n}  control {i}  tested', 'page {n}  control {i}  description', 'page {n}  appendix {i}']}]}
    ],
    verdicts: [
      {label: 'No: Wellhollow’s report covers another service, and its period ended 15 months ago', good: true, needs: ['req', 'scope'],
       needsWhy: 'the answer rests on two records: the requirement and the report’s scope and period. You read only one of them.',
       why: 'C4 asks for the service the Compact uses, within 12 months. The report covers file sharing, not backup, and its period is past.'},
      {label: 'Enough: a clean report with no exceptions meets the Compact’s requirement', why: 'Clean about file sharing. The Compact uses backup.'},
      {label: 'No, and it should be dropped at its renewal for misleading us', why: 'Nothing shows it misled anyone. Ask for a report that covers backup, or the right to assess.'},
      {label: 'Can’t tell until every page of it has been read', why: 'The scope page and the period answer it; the rest is detail.'}],
    reasons: [
      {label: 'Its scope names file sharing, not backup, and its period is older than 12 months', good: true, why: 'The requirement, then the scope and the dates.'},
      {label: 'No exceptions were noted, which means the controls it tested must be sound', why: 'Perhaps, for file sharing. It tested nothing in backup.'},
      {label: 'Its website carries the badge, which the assessors would not allow if it were stale', why: 'A badge isn’t a scope or a date.'}],
    alts: [
      {label: 'The backup service runs on the same controls', good: true, why: 'Weighed: nothing in the report shows it. Ask for a report on backup, or assess.'},
      {label: 'A newer report exists', good: true, why: 'Weighed: none was sent. Ask for it.'},
      {label: 'The assessors who wrote it were not independent', why: 'Nothing points to it.'},
      {label: 'Brindlemark reports are worthless', why: 'Beside the point: this one covers the wrong service and dates.'}],
    path: '<p>“Is the report enough?” is decided by <b>the requirement</b> and <b>the report’s scope and period</b>. A clean opinion is clean about what it looked at, when it looked.</p>',
    response: ['Wellhollow is asked for a current report covering backup, or C4 (the right to assess) goes into the renewal', 'Edda, its owner, is told; the service carries on as it is', 'The register records the gap, with the report’s scope and dates'],
    techs: [], acts: ['chattest']
  },
  supclock: {
    id: 'supclock', title: 'Tarnfield’s notice clock', budget: 3,
    intro: '<p>Tarnfield IT Services told the airport of an incident on its side before you were appointed. Its renewal is next month, and Joanna asks whether it met its notification clause. The contract is the airport’s; the clause and the notice are on file.</p>',
    artefact: '<pre class="art">Notice · Tarnfield IT Services to the airport (game data)\n' +
      '“We first logged unusual activity on Day 51 at 22:40.\n' +
      ' We detected a security incident on our service-desk\n' +
      ' platform on Day 52 at 16:10, and confirmed it on\n' +
      ' Day 54 at 11:00.”</pre>' +
      '<p class="small">Three times in one notice. The clause says which one starts the clock.</p>',
    question: 'Did Tarnfield meet its notification clause?',
    sources: [
      {id: 'tarn', name: 'Tarnfield’s account manager', qs: [
        {q: 'How long did it take?', kind: 'trap', res: ['“Well inside: 31 hours from confirming it.”', '(Its preferred start.)']}]},
      {id: 'ops', name: 'The operations room’s note', qs: [
        {q: 'What did the room make of it?', kind: 'trap', res: ['“From its first log line it is over 90 hours: a day late.”', '(Our preferred start.)']}]},
      {id: 'clause', name: 'Clause 11 of the airport’s contract with Tarnfield', qs: [
        {q: 'What does the clause say starts the clock, and stops it?', kind: 'focus', key: true,
         res: ['“Tarnfield notifies the Airport’s named security contact in writing within 72 hours of detecting a security incident on any system used to provide the service.” (game)', 'Named security contact: Dario Fenn, the airport’s IT coordinator']}]},
      {id: 'times', name: 'The notice’s times and the airport’s mail log', qs: [
        {q: 'When did Tarnfield detect it, and when did the notice reach Dario?', kind: 'focus', key: true,
         res: ['Detected, in the notice’s own words: Day 52 (Wednesday) 16:10', 'Reached Dario Fenn’s mailbox: Day 55 (Saturday) 18:30 (the mail log)']}]}
    ],
    verdicts: [
      {label: 'Not met: 74 hours 20 minutes from detecting to the named contact, against 72', good: true, needs: ['clause', 'times'],
       needsWhy: 'the answer rests on two records: the clause’s trigger and the notice’s times. You read only one of them.',
       why: 'The clause starts at detection, Day 52 16:10, and stops when the named contact has it: Day 55 18:30. Late by 2 hours 20 minutes.'},
      {label: 'Met: from confirming it on Day 54 at 11:00, the notice took 31 hours 30 minutes', why: 'The clause says detecting, not confirming.'},
      {label: 'Not met: from its first log line on Day 51, the notice took 91 hours 50 minutes', why: 'The clause says detecting, not first logging. Right answer, wrong clock.'},
      {label: 'Met: the airport heard within the week, and that is what counts', why: 'The clause counts hours, from detection.'}],
    reasons: [
      {label: 'The clause starts at detection, and the notice and Dario’s mailbox give the times', good: true, why: 'The trigger in the contract, then the times.'},
      {label: 'Tarnfield counts from confirming it, and it knows its own process better than we do', why: 'Its process isn’t the contract.'},
      {label: 'The room counts from the first log line, as the earliest time is the safest one', why: 'Earliest isn’t what the contract says.'}],
    alts: [
      {label: 'Dario’s mailbox clock was wrong that day', good: true, why: 'Weighed: the mailbox’s time matches the notice’s own sent time.'},
      {label: '“Detected” means something else in the notice', good: true, why: 'Weighed: the notice uses the clause’s own word.'},
      {label: 'Tarnfield hid the incident from the airport for days', why: 'Nothing points to it.'},
      {label: 'Dario missed the message', why: 'Beside the point: it reached his mailbox at 18:30.'}],
    path: '<p>“Did the supplier meet its clause?” is decided by <b>the clause’s trigger and window</b> and <b>the times</b>: when it detected the incident, in its own words, and when the notice reached the named contact. The clock starts where the contract says.</p>',
    response: ['On the register: late by 2 hours 20 minutes against the 72-hour clause', 'Any remedy under the contract is Joanna’s, with the airport’s counsel', 'At renewal, the Compact’s tier-1 requirement asks for 24 hours to the named contact'],
    techs: [], acts: ['chclock']
  }
};

/* ---------- The supplier incident (Tuesday and Wednesday): graded steps, one decider each ---------- */
// The Compact's own records only: the notice, the transfer server's log, the times, who decided what.
const CH_SUP_INCIDENT = [
  {title: 'Cobbleton’s notice · 08:20', who: 'Marit Quellan',
   ask: 'The notice is with you, forwarded from the payroll mailbox. What first?',
   resp: [{label: 'Find what Cobbleton can reach in our systems: its accounts and its connections', good: true},
          {label: 'Ask the payroll company how its environment was attacked, and by whom', why: 'That is Cobbleton’s to find. What we need first is what it can reach on our side.'},
          {label: 'Wait for Cobbleton’s update: the incident, and its systems, are its own', why: 'Its systems are its own. Its way into ours is our question.'},
          {label: 'Have Marit send the members’ staff a notice at 08:30: their bank details were taken', why: 'Nothing shows that. And whether anyone must be told is Noor’s to decide.'}]},
  {title: 'cp-xfer · 08:35', who: 'Edda Thornquist',
   ask: 'cp-xfer is Cobbleton’s one way in: last used Thursday at 06:00, and a failed login at 23:52 last night. Edda decides. What do you advise?',
   resp: [{label: 'Suspend it now, and export its log after that: suspending destroys nothing', good: true},
          {label: 'Export its log first, then suspend it, and that way no line is lost', why: 'Suspending destroys nothing. Every minute it stays open is a minute it can be used.'},
          {label: 'Delete the account and its folder: then there is no account left for anyone to reach', why: 'Deleting it loses its record. Suspend it: the log and the folder stay as they are.'},
          {label: 'Leave it on until Day 81, as Marit’s next pay file isn’t due before then', why: 'Open until then means open to whoever tried it at 23:52.'}]},
  {title: 'The questions · 09:05', who: 'Marit Quellan',
   ask: 'Marit will write to Cobbleton’s account manager, the only contact in the contract. What should she ask?',
   resp: [{label: 'When Cobbleton detected it, if our pay files or cp-xfer’s password were in it, its addresses', good: true},
          {label: 'How the attackers got in over there, which tools they used, and who they are', why: 'Cobbleton’s root cause is its own. Ask for what the Compact needs to act.'},
          {label: 'A written promise from Cobbleton that none of the Compact’s staff data was taken by anyone', why: 'Nobody can promise that yet. Ask for facts with times.'},
          {label: 'Every log it holds, for all its customers, so we can look for ourselves', why: 'Not ours to read. Ask for what touches the Compact.'}]},
  {title: 'Facts for counsel · 12:00', who: 'Noor Castellanos',
   ask: 'Noor asked for the facts by 12:00. What do you give her?',
   resp: [{label: 'A failed login at 23:52, none since Thursday, cp-xfer off 08:40, pay files not known', good: true},
          {label: 'Likely an attack on us as well: the 23:52 login was whoever got into the payroll company’s systems', why: 'Nothing ties the 23:52 address to Cobbleton’s incident. Say what the log shows.'},
          {label: 'Nothing to worry about: the login failed, and our staff’s data is safe', why: 'The pay files sit at Cobbleton. Whether they were reached is not known yet.'},
          {label: 'Our staff’s bank details were taken from Cobbleton’s file store on Monday', why: 'Nothing shows that. Known, not known, and when you asked.'}]},
  {title: 'Who decides · 12:05', who: 'Noor Castellanos',
   ask: 'Does anyone have to be told, and who decides that?',
   resp: [{label: 'Noor decides, as counsel. You give her the facts by the time she set', good: true},
          {label: 'Marit decides: payroll is her service, and its notices are hers to send', why: 'Marit owns the service. Whether the law asks for a notice is counsel’s.'},
          {label: 'You decide it: you hold the facts, and counsel only reads them', why: 'You supply the facts. Counsel decides what they require.'},
          {label: 'Cobbleton decides: the incident is its own, and so is any duty', why: 'Cobbleton has its own duties. The Compact’s are Noor’s to decide.'}]},
  {title: 'Cobbleton’s summary · Wednesday 16:50', who: 'Edda Thornquist',
   ask: 'Cobbleton’s summary: “no evidence that your files were accessed”, its review covering activity to Monday 18:00. Edda asks: does cp-xfer come back?',
   resp: [{label: 'Not yet: Cobbleton’s review ends at 18:00, before the 23:52 login. Ask for one up to this hour', good: true},
          {label: 'Give it back now: its summary found no evidence that any of our files were read or copied', why: 'Its review stops at 18:00 on Monday. The 23:52 login is after it.'},
          {label: 'Give it back today, so the members’ staff are paid on time', why: 'The next pay file is Day 81. There is time to get an answer that covers 23:52.'},
          {label: 'Keep it off for good, and move payroll to another provider', why: 'That is Marit’s decision, with Ilka and Noor, and not today’s question.'}]}];

/* ---------- The directive (game; Wednesday 11:30): sign Inkmere today without the notification clause? ---------- */
const CH_SUP_DIRECTIVE = [
  {label: 'It’s a must-have. Marit chooses: price it, sign her acceptance, or walk away', good: true},
  {label: 'Sign it as it stands: the notification clause can wait for next year’s renewal', why: 'A must-have left out needs its owner’s signed acceptance. Marit hasn’t signed one.'},
  {label: 'Don’t sign: I won’t allow it without the clause, whatever Noor and Ilka say', why: 'You set the requirement. Marit owns the service, and Ilka and Noor the contract.'},
  {label: 'Sign it, and I’ll sign the acceptance for Marit to spare her the time', why: 'An acceptance is its owner’s. Marit signs, or the clause goes in.'},
  {label: 'Sign it, and add the clause by a side letter once it is signed', why: 'A promise after signing is a request the supplier can refuse. Price it now, or Marit accepts it.'}];

/* ---------- The Suppliers terminals (Ilka's; three puzzles) ---------- */
const CH_SUP_DOJO = [
  {q: 'A supplier holds no personal data and has no way into your systems. If it stops, the 911 center’s radios go quiet. Which tier?',
   opts: ['Tier 1: if it stops, a life-safety service stops',
          'Tier 3: it holds no personal data, and it has no way in',
          'Tier 2: one of its two measures is Low, the other High'], good: 0,
   explain: 'Either measure High makes Tier 1. What stops for residents counts as much as the data.'},
  {q: '$5k is left in the envelope. A Tier 2 supplier lacks its notification clause ($4k, a must-have for Tier 2) and a log clause ($3k, not one for Tier 2). What do you seek?',
   opts: ['The notification clause: its tier makes it a must-have',
          'The log clause: at any tier, logs matter more than a phone call',
          'Both: ask, and let the supplier set the total price for the two'], good: 0,
   explain: 'Must-haves by tier first. Anything else only if the envelope has room.'},
  {q: 'The clause: 48 hours from detecting. Detected Tuesday 09:30; confirmed Wednesday 14:00; the notice reached the general inbox Thursday 08:00, and the named contact Thursday 11:00. Met?',
   opts: ['Not met: it reached the named contact 49½ hours after detecting',
          'Met: from its confirmation on Wednesday, it took 21 hours',
          'Met: it reached the general inbox well inside 48 hours of detecting'], good: 0,
   explain: 'The clock starts at detection and stops when the named contact has it: 49½ hours.'}];

/* ---------- The Compact Board's Supplier round (Thursday 14:00; Ivor Penhallow; three rounds) ---------- */
const CH_SUP_BOARD_SPECS = () => [
  {title: 'Round 1: which supplier', who: 'Ivor Penhallow',
   ask: '“Which of our suppliers should worry this Board most?”',
   resp: [{label: 'The Tier 1 ones, that can stop a service or reach our records, not the biggest invoice', good: true},
          {label: 'Inkmere: it is the biggest invoice we pay, at $210k a year, by a long way', why: 'Spend is what we pay, not what breaks. Inkmere is Tier 2.'},
          {label: 'Cobbleton: the latest incident puts it in a tier of its own, above the rest', why: 'Recent isn’t ranked. Cobbleton is one of six Tier 1 suppliers.'},
          {label: 'All eight the same: any one of them can hurt the Compact as badly as any other could', why: 'Then none comes first. The tiers say which ones do.'}]},
  {title: 'Round 2: what Tuesday cost', who: 'Ivor Penhallow',
   ask: '“What did the missing clauses cost us on Tuesday?”',
   resp: [{label: 'About 11 hours before anyone could act, then two days of asking', good: true},
          {label: 'No damage: the 23:52 login failed, and so no harm was done', why: 'Eleven hours with the account open, and two days of asking. The cost is the time.'},
          {label: 'Our staff’s bank details, taken from Cobbleton’s file store on Monday night', why: 'Nothing shows that. Say what the records show.'},
          {label: 'Only money: Noor will claim the costs back under the contract', why: 'The contract has no such clause. Whether anything is owed is Noor’s question.'}]},
  {title: 'Round 3: the members’ contracts', who: 'Ivor Penhallow',
   ask: '“Will you fix the members’ supplier contracts for them, as our CISO?”',
   resp: [{label: 'No: each member’s owner decides its contracts. Each has our requirements', good: true},
          {label: 'Yes: the Compact will renegotiate all of them centrally this year', why: 'The Compact decides nothing for a member. Each owner decides its own contracts.'},
          {label: 'The Board should instruct the members to add the clauses by the end of the year', why: 'The Board governs the programme. Each member’s contracts are its owner’s.'},
          {label: 'Only the Tier 1 ones, and only once one of them has had an incident', why: 'By then the clause is missing when it is needed. Send the requirements now.'}]}];

/* ---------- The supplier incident's timeline: as it was, beside Contract A's C1 and C3 (game) ---------- */
// The Compact's own times (charter-timeline.md, Day 72 to Day 74). Contract A's column is what its two clauses would
// have changed, and is labelled so; nothing here says what happened on Cobbleton's side.
const CH_SUP_TIMELINE = [
  ['The notice', 'Sent 21:14 Monday to the payroll mailbox, read 08:10 Tuesday', 'C1: the on-call lead paged at 21:14 Monday'],
  ['cp-xfer suspended', '08:40 Tuesday, by Edda, on duty', 'About 21:20 Monday, by the on-call lead, on duty'],
  ['The 23:52 login', 'Failed; found at 08:30 Tuesday in our log', 'Against a suspended account'],
  ['Cobbleton’s entries for us', 'None; a summary at 16:40 Wednesday, to 18:00 Monday', 'C3: within one working day, by 09:10 Wednesday'],
  ['An answer covering 23:52', '11:00 Thursday', 'By 09:10 Wednesday']];
const CH_SUP_LOST = [
  'Notice to someone who could act: 10 h 56 min (21:14 Monday to 08:10 Tuesday).',
  'cp-xfer open 11 h 20 min longer than under Contract A (about 21:20 Monday to 08:40 Tuesday), with the 23:52 login inside that time.',
  'Cobbleton’s entries: the summary 7 h 30 min after C3’s time, and an answer covering 23:52 25 h 50 min after it (49 h 50 min after the 09:10 request).',
  'Not changed by Contract A: what happened on Cobbleton’s side, or Edda’s call at 08:40.'];
