/* ============================================================
   UPTIME · editions/charter/report-data.js
   Charter district 4: The Board report (Days 85 to 88). The report's rows (one
   line each on a one-page summary, every row with one supported wording and
   two or three weak ones: unsupported, overstated or misplaced), the records
   the annex cites, three drills whose evidence is records, the directive (Edda
   asks for a line to stay out of the summary), the Reporting terminals and the
   Board's standing questions.
   The rows are filled from the player's own records (report.js, chRepFacts):
   the register and its acceptances, the Board's decision, the plan as sent, the
   exception register. Tokens in braces ({ownerAcc}, {boardLines} …) are filled
   at play; nothing in a row is fixed and shown as earned.
   One decider per decision: the CISO decides what the report says (the report
   as sent is the CISO's, and the scorecard reads it); each decision the report
   puts to the Board names the decider the rules name; owners keep the
   acceptances they signed. Defender side only: every record is the Compact's
   own. No technique, no ATT&CK ID.
   Every record, count, time and wording is invented (game). Real facts:
   CREDITS.md, section "Charter". Timeline: docs/design/charter-timeline.md
   (slice 4); every line here is checked against it.
   ============================================================ */
'use strict';

const CH_REP_DAY = {85: 'Monday', 86: 'Tuesday', 87: 'Wednesday', 88: 'Thursday'};
const CH_REP_PAGE = 10;               // lines on the one-page summary (game)
const CH_REP_SENT_AT = [87, '12:00'];   // the report goes to Marit for the papers (Wednesday)

/* ---------- The records the annex cites (game). Each with its time: none after Day 86 ---------- */
const CH_REP_RECORDS = {
  APP: {name: 'The risk-appetite statement', at: [64, '12:00']},
  M67: {name: 'The Board’s minute, the budget round', at: [67, '15:00']},
  M74: {name: 'The Board’s minute, the Supplier round', at: [74, '15:00']},
  M81: {name: 'The Board’s minute, the Policy round', at: [81, '15:00']},
  X74: {name: 'The measure of cp-xfer’s return against the privacy tolerance', at: [74, '11:50']},
  LOG: {name: 'The incident log: the Airport’s Saturday and Night 33', at: [34, '02:44']},
  SCO: {name: 'The scorecards of Budget, Suppliers and Policy', at: [81, '16:00']},
  SUP: {name: 'The supplier register and Ilka’s contracts status', at: [85, '08:30']},
  SGN: {name: 'MFA-Exempt and the sign-in records (7 days)', at: [85, '08:40']},
  ACC: {name: 'The risk register and its acceptances', at: [86, '17:00']},
  EXC: {name: 'The exception register', at: [86, '17:00']}};

/* ---------- The report's rows. sec: the section on the page; req: required (a function of the facts, or true);
   when: the row exists (default: always); rec: the recommended choice ('in': the supported wording, 'out': left out).
   Each variant: grade (supported, unsupported, overstated, misplaced), the records it cites, and why (the debrief). ---------- */
const CH_REP_SECTIONS = [
  {id: 'risks', name: 'Risks against appetite'},
  {id: 'changed', name: 'What changed since Day 64'},
  {id: 'decide', name: 'Decisions for the Board'},
  {id: 'exc', name: 'Exceptions due and expired'},
  {id: 'sup', name: 'Supplier tier-1 gaps'},
  {id: 'ask', name: 'Asks'}];
const CH_REP_ROWS = [
  {id: 'A1', sec: 'risks', name: 'Above appetite, on its owner’s acceptance', topic: 'the risks above appetite that their owners accepted', req: true, rec: 'in',
   variants: [
     {label: '{ownerAcc}: above appetite, each one signed by its owner and reviewed on Day 155', good: true, grade: 'supported', refs: ['ACC', 'M74'],
      why: 'The acceptances say it: above appetite, each decided and signed by its owner, reviewed at the next quarterly Board.'},
     {label: '{ownerAcc}: above appetite, each one accepted for its owner by this Board at its meeting', grade: 'misplaced', refs: ['ACC'],
      why: 'Each was decided and signed by its owner. The Board sees them; it did not accept them.'},
     {label: '{ownerAcc}: back within appetite, each one held there by its interim measures', grade: 'overstated', refs: ['ACC'],
      why: 'Interim measures run while a risk stays above appetite. They don’t bring it within.'},
     {label: '{ownerAcc}: low risks, which nobody on the register has needed to sign for', grade: 'unsupported', refs: [],
      why: 'No record says so. Each is above appetite, on a signed acceptance.'}]},
  {id: 'A2', sec: 'risks', name: 'Above appetite, by this Board’s decision', topic: 'the lines this Board’s own decision left above appetite', req: true, rec: 'in', when: F => F.boardIds.length > 0,
   variants: [
     {label: '{boardLines}: above appetite to Day 428, this Board’s Day 67 decision, {boardSigners} signing for interim measures', good: true, grade: 'supported', refs: ['M67', 'ACC'],
      why: 'The Day 67 minute records the Board’s decision and its approval; the owner signed for the interim checks.'},
     {label: '{boardLines}: above appetite to Day 428 on the owner’s acceptance alone, {boardSigners} signing it as the line’s owner on Day 67', grade: 'misplaced', refs: ['ACC'],
      why: 'The owner signed for running the checks. The minute records that the Board decided and approved it.'},
     {label: '{boardLines}: as good as within appetite, as the interim checks run every month', grade: 'overstated', refs: ['ACC'],
      why: 'Checks that run each month don’t move a line within appetite. It stays above to Day 428.'},
     {label: '{boardLines}: deferred to Day 428 by decision, with no acceptance needed before that day', grade: 'unsupported', refs: [],
      why: 'The minute and the register record an acceptance from Day 67.'}]},
  {id: 'A3', sec: 'risks', name: 'The register, line by line', topic: 'the register', req: false, rec: 'out',
   variants: [
     {label: '{within} of 6 lines within appetite on the Board’s decision, {asnow} of them unchanged until next year’s money arrives', good: true, grade: 'supported', refs: ['ACC', 'M67'],
      why: 'Read on what is in force today: the Board’s decision, and the lines still waiting for next year’s money.'},
     {label: 'Every risk on the register brought down this quarter by the Board’s budget decision, line by line, as the Day 67 minute shows', grade: 'overstated', refs: ['M67'],
      why: 'A budget decided is not a risk brought down: next year’s money hasn’t delivered.'},
     {label: 'Risk across the register fell by a third from Day 64, on the ratings in the register', grade: 'unsupported', refs: ['ACC'],
      why: 'The register was first rated on Day 64. One rating is a starting point, not a fall.'}]},
  {id: 'B1', sec: 'changed', name: 'MFA', topic: 'MFA', req: false, rec: 'in',
   variants: [
     {label: 'MFA on every sign-in to the shared directory, but for six accounts on open, dated exceptions', good: true, grade: 'supported', refs: ['SGN', 'EXC'],
      why: 'The register and the sign-in records: six accounts sign in without MFA, each on an open, dated exception.'},
     {label: 'MFA on every sign-in to the shared directory, for every account and every member, from the policy week on', grade: 'overstated', refs: ['M81'],
      why: '“Every account” where the records show six without MFA, by exception.'},
     {label: 'MFA on every sign-in, and no account has signed in without it this quarter', grade: 'unsupported', refs: [],
      why: 'The sign-in records show fin-ap without MFA 47 times in seven days, on its exception.'}]},
  {id: 'B2', sec: 'changed', name: 'Supplier risk', topic: 'supplier risk', req: false, rec: 'in',
   variants: [
     {label: 'Suppliers tiered for the first time on Day 71, and tier-1 contracts signed with every must-have still 0 of 2', good: true, grade: 'supported', refs: ['SUP'],
      why: 'One measure, from Day 71, and the signed tier-1 contracts unchanged since.'},
     {label: 'Supplier risk fell this quarter, as the plan seeks every must-have at tier 1', grade: 'overstated', refs: ['SUP'],
      why: 'A trend from one measure, and sought is not signed.'},
     {label: 'Both tier-1 contracts in place this quarter, signed by both suppliers', grade: 'unsupported', refs: [],
      why: 'Ilka’s status: neither tier-1 contract is signed yet.'}]},
  {id: 'B3', sec: 'changed', name: 'Night cover', topic: 'the night cover', req: false, rec: 'out',
   variants: [
     {label: 'First encrypted file to the account disabled, 138 minutes at the Airport and 10 on Night 33, two nights only', good: true, grade: 'supported', refs: ['LOG'],
      why: 'The log’s times, like with like, and the sample named.'},
     {label: 'Response times down 93% this year with the night line, from 138 minutes at the Airport to 10 minutes on Night 33', grade: 'overstated', refs: ['LOG'],
      why: 'A percentage from two nights is a trend drawn from two points, and the runbook shares the credit.'},
     {label: 'Every incident since Night 33 contained within 10 minutes of its first sign', grade: 'unsupported', refs: [],
      why: 'No record says so. Thimbleford’s notice was read 10 hours 56 minutes after it was sent.'}]},
  {id: 'B4', sec: 'changed', name: 'Exercises', topic: 'staff exercises', req: false, rec: 'out',
   variants: [
     {label: 'No staff exercise counted this quarter, as the terminals are training and not a measure', good: true, grade: 'supported', refs: ['SCO'],
      why: 'The terminals teach. Nothing on them measures how the members’ staff would act.'},
     {label: 'Owners trained this quarter, measured as 100% of the terminals’ puzzles solved at the first try', grade: 'overstated', refs: ['SCO'],
      why: 'A game number shown as operations: puzzles solved are not owners trained.'},
     {label: 'Readiness up this quarter, as each Board round was answered at the first try', grade: 'overstated', refs: ['SCO'],
      why: 'A game number shown as operations: rounds answered say nothing of readiness.'}]},
  {id: 'C1', sec: 'decide', name: 'Staff records and the appetite', topic: 'the staff records left out of the privacy appetite', req: true, rec: 'in', decision: true,
   variants: [
     {label: 'Day 155: the Board decides whether staff records join the privacy appetite, and I recommend adding them, at Low', good: true, grade: 'supported', refs: ['X74', 'APP'],
      why: 'The appetite statement is the Board’s, so the Board decides; the recommendation is yours, and named.'},
     {label: 'Day 155: payroll’s owner decides whether staff records join the privacy appetite, and I recommend adding them', grade: 'misplaced', refs: ['X74'],
      why: 'Payroll is Marit’s; the appetite statement is the Board’s to change.'},
     {label: 'Day 155: whoever decides on staff records and the privacy appetite, for the Board to note', grade: 'unsupported', refs: ['X74'],
      why: 'A decision with no decider and no recommendation is a note, not a decision.'},
     {label: 'At this meeting: the Board decides on staff records and the privacy appetite, as a pay-data breach will follow this year', grade: 'overstated', refs: [],
      why: 'A breach stated as what will happen, with no record behind it. It is for Day 155, as the Day 74 measure says.'}]},
  {id: 'C2', sec: 'decide', name: 'EX-02 and EX-04 at Day 155', topic: 'the two exceptions that expire on Day 155', req: true, rec: 'in', decision: true,
   variants: [
     {label: 'Day 155: EX-02 and EX-04 expire, {renewDecide} at the review, and I recommend renewing each to Day 246, controls read again', good: true, grade: 'supported', refs: ['EXC', 'M81'],
      why: 'Both are escalated, so their owners don’t decide alone: the rule names the decider, and your recommendation is beside it.'},
     {label: 'Day 155: EX-02 and EX-04 expire, their two owners decide, signing alone, and I recommend renewing each to Day 246', grade: 'misplaced', refs: ['EXC'],
      why: 'Both are escalated (6.2a): their owners sign for running the controls, and someone above them decides.'},
     {label: 'Day 155: EX-02 and EX-04 expire, and they run on as they are until somebody decides on them', grade: 'unsupported', refs: ['EXC'],
      why: 'Expired is not open, and the rule names who decides. No decider, no recommendation.'},
     {label: 'Day 155: EX-02 and EX-04 expire, the chair decides, and I recommend renewing both for good, as their controls are proven', grade: 'overstated', refs: ['EXC'],
      why: 'An exception is never for good, and fin-ap’s control is partial: “proven” says more than the records.'}]},
  {id: 'C3', sec: 'decide', name: 'Next year’s budget cycle', topic: 'what comes back at the start of next year’s budget cycle', req: true, rec: 'in', decision: true, when: F => !!F.cycleWhat,
   variants: [
     {label: 'Day 428: {cycleWhat}, the Board decides, and I recommend {cycleRec}', good: true, grade: 'supported', refs: ['M67'],
      why: 'The budget is the Board’s decision; the recommendation is yours, and named.'},
     {label: 'Day 428: {cycleWhat}, Edda decides the funding as she runs the shared services, and I recommend {cycleRec}', grade: 'misplaced', refs: ['M67'],
      why: 'Edda runs the shared services. The budget is the Board’s to decide.'},
     {label: 'Day 428: {cycleWhat}, for the Board to note when the budget cycle opens', grade: 'unsupported', refs: ['M67'],
      why: 'No decider named and no recommendation: a note, not a decision.'}]},
  {id: 'D1', sec: 'exc', name: 'Expired this quarter', topic: 'the exceptions that expired this quarter', req: true, rec: 'in',
   variants: [
     {label: 'Expired: EX-01 and EX-03 on Day 75, closed by Edda on Day 78, and board-display’s two later sign-ins reported as a miss', good: true, grade: 'supported', refs: ['EXC', 'M81'],
      why: 'The register: both expired on Friday and closed by their owner on Monday, and the two sign-ins after expiry recorded.'},
     {label: 'Expired: none this quarter that lapsed, as each one was closed on time by its owner', grade: 'overstated', refs: ['EXC'],
      why: 'Both lapsed over a weekend, and board-display signed in twice after its expiry.'},
     {label: 'Expired: EX-01 and EX-03 on Day 75, both closed and signed off from the register by the CISO on Day 78, as its keeper', grade: 'misplaced', refs: ['EXC'],
      why: 'Edda closed both, as their owner. The CISO never closes one.'},
     {label: 'Expired: nothing from Day 64 on, as every exception on the register still stands open', grade: 'unsupported', refs: [],
      why: 'The register shows two expired and closed.'}]},
  {id: 'E1', sec: 'sup', name: 'Tier-1 contracts', topic: 'the tier-1 supplier gaps', req: true, rec: 'in',
   variants: [
     {label: 'Tier-1 gaps: 0 of the Compact’s 2 tier-1 contracts signed with every must-have, {sought}, the members’ 4 theirs to decide', good: true, grade: 'supported', refs: ['SUP'],
      why: 'Ilka’s status and the register: signed, sought and whose, each as the records say.'},
     {label: 'Tier-1 gaps: closed for both of the Compact’s tier-1 contracts, as the plan the Board saw on Day 74 seeks every must-have', grade: 'overstated', refs: ['M74'],
      why: 'Sought is not signed: neither tier-1 contract is signed yet.'},
     {label: 'Tier-1 gaps: the members’ 4, which the Compact amends for each of them', grade: 'misplaced', refs: ['SUP'],
      why: 'Each member’s owner decides its own contracts. The Compact sent each one its tier’s requirements.'},
     {label: 'Tier-1 gaps: none left in the payroll supplier’s contract, as its incident was closed on Day 74', grade: 'unsupported', refs: [],
      why: 'No record says so. Its amendment is with its counsel, unsigned.'}]},
  {id: 'E2', sec: 'sup', name: 'Must-haves left out', topic: 'the must-haves left out of the plan', req: true, rec: 'in', when: F => F.mhIds.length > 0,
   variants: [
     {label: '{mhList}: left out on my recommendation, its owner deciding on it and signing, to Day 428', good: true, grade: 'supported', refs: ['SUP', 'M74'],
      why: 'The recommendation was yours, and it is recorded as yours; the owner decided on it and signed.'},
     {label: '{mhList}: left out by its owner’s own choice, its owner deciding and signing for it, to Day 428', grade: 'misplaced', refs: ['SUP'],
      why: 'Leaving it out was your recommendation. The owner decided on your recommendation.'},
     {label: '{mhList}: no longer a gap to report, as the interim measure covers it, to Day 428', grade: 'overstated', refs: ['SUP'],
      why: 'An interim measure runs while the gap stays. It is still a gap.'}]},
  {id: 'F1', sec: 'ask', name: 'The ask', topic: 'the ask', req: false, rec: 'out',
   variants: [
     {label: 'Ask: each member’s representative takes its tier’s requirements for its contracts to its own owner', good: true, grade: 'supported', refs: ['SUP'],
      why: 'The Board decides nothing for a member. Its representatives can carry the requirements home.'},
     {label: 'Ask: this Board directs each member to put its tier’s requirements into its contracts itself', grade: 'misplaced', refs: [],
      why: 'The Board decides nothing for any member.'},
     {label: 'Ask: more money this year, as a breach will follow within the year without it', grade: 'overstated', refs: [],
      why: 'A breach stated as what will happen, and no record behind it.'}]}];

/* ---------- Drills (Monday). Records are the evidence; two decisive sources each ---------- */
const CH_REP_DRILLS = {
  repmfa: {
    id: 'repmfa', title: 'Can the report say “MFA on every sign-in”?', budget: 3,
    intro: '<p>Marit’s office drafted a line for the Board papers: “MFA on every sign-in to the shared directory since the policy week.” Beatriz exported MFA-Exempt at 08:40, and has the sign-in records for the seven days to 08:00. Can the report say it?</p>',
    artefact: '<pre class="art">Report draft · the Board papers (game data)\n' +
      'Line 4     “MFA on every sign-in to the\n' +
      '            shared directory since the\n' +
      '            policy week.”</pre>' +
      '<p class="small">A line in a report is checked like a finding: against the records it stands on.</p>',
    question: 'Can the report say “MFA on every sign-in”?',
    sources: [
      {id: 'draft', name: 'The draft line (Marit’s office)', qs: [
        {q: 'What was it written from?', kind: 'trap', res: ['“From Thursday’s minute: the register was read, and POL-1 approved.”', '(A minute about the register, not about each sign-in.)']}]},
      {id: 'console', name: 'The MFA service’s settings page', qs: [
        {q: 'Is MFA enforced?', kind: 'trap', res: ['“MFA enforced for the shared directory: on.”', '(A setting. Its exceptions are kept elsewhere.)']},
        {q: 'Every setting on the page', kind: 'broad', rows: 640,
         wall: ['{t}  setting {i}  session lifetime {n} min', '{t}  setting {i}  allowed method: app', '{t}  setting {i}  named location {n}']}]},
      {id: 'exc', name: 'The exception register and MFA-Exempt (08:40)', qs: [
        {q: 'Which accounts are excepted from MFA, and until when?', kind: 'focus', key: true,
         res: ['MFA-Exempt, 6 members: cp-backup, cp-logfwd, cp-files-lib, cp-files-cl, cp-files-ap, fin-ap', 'EX-02, the five service accounts: open, to Day 155', 'EX-04, fin-ap: open, to Day 155']}]},
      {id: 'signins', name: 'The sign-in records (7 days to 08:00)', qs: [
        {q: 'Which accounts signed in without MFA?', kind: 'focus', key: true,
         res: ['fin-ap: 47 interactive sign-ins without MFA, all from the finance office’s three PCs, the location rule applied on each', 'The five service accounts: non-interactive only, from their own servers', 'Every other account: MFA on each sign-in']},
        {q: 'Every sign-in to the shared directory this week', kind: 'broad', rows: 4600,
         wall: ['{t}  account {i}  MFA ok  member PC', '{t}  cp-backup  non-interactive  CP-OPS-02', '{t}  account {n}  MFA ok  home']}]}
    ],
    verdicts: [
      {label: 'No: six accounts sign in without MFA, and each is on an open, dated exception', good: true, needs: ['exc', 'signins'],
       needsWhy: 'the answer rests on two records: the exception register and the sign-in records. You read only one of them.',
       why: 'The register excepts six accounts to Day 155, and the records show them signing in without MFA. The report says so, in one line.'},
      {label: 'Yes: every exception is open and in date, so the policy has been met in full', why: 'The policy is met; the line says every sign-in. Six accounts sign in without MFA, by exception.'},
      {label: 'Yes: the settings page says MFA is enforced across the whole directory', why: 'A setting, with its exceptions beside it. The records show six accounts without MFA.'},
      {label: 'No, and the six accounts are a breach in progress that the report should name for the Board', why: 'Nothing in these records shows misuse. They are excepted, on dated entries.'}],
    reasons: [
      {label: 'The register names the six, and the sign-in records show them without MFA', good: true, why: 'Who is excepted, then what happened.'},
      {label: 'The settings page is the record of what the directory enforces for everyone', why: 'A setting says what is on; the exceptions say for whom it is not.'},
      {label: 'Thursday’s minute read the register, and with it each sign-in to the directory', why: 'Reading a register is not MFA on each sign-in.'}],
    alts: [
      {label: 'fin-ap has used MFA since Tuesday’s rule', good: true, why: 'Ruled out: its sign-ins show the location rule applied, not MFA.'},
      {label: 'A seventh account signs in without MFA', good: true, why: 'Ruled out: every other account shows MFA on each sign-in.'},
      {label: 'The settings page is out of date', why: 'Beside the point: the register and the records decide it.'},
      {label: 'The service accounts are people’s accounts', why: 'Nothing points to it: non-interactive only, from their own servers.'}],
    path: '<p>“Can the report say it?” is decided by <b>the exception register</b> and <b>the sign-in records</b>. A setting says what is switched on; a minute says what the Board read. Neither says who signs in without MFA.</p>',
    response: ['The report can say: MFA on every sign-in to the shared directory, but for six accounts on open, dated exceptions, reviewed Day 155', 'Marit corrects the draft line before the papers go: her paper, her decision', 'Business terms on the page; the account names go in the annex'],
    techs: [], acts: ['chrepmfa']
  },
  repsup: {
    id: 'repsup', title: 'Can the report say supplier risk fell?', budget: 3,
    intro: '<p>Marit’s draft for the papers says supplier risk fell this quarter, because the plan seeks the must-haves. Ilka left her contracts status at 08:30, and the supplier register keeps its own history. Can the report say supplier risk fell?</p>',
    artefact: '<pre class="art">Report draft · the Board papers (game data)\n' +
      'Line 7     “Supplier risk fell this\n' +
      '            quarter: the plan seeks the\n' +
      '            must-haves.”</pre>' +
      '<p class="small">A fall needs two measures, and a clause counts when it is signed.</p>',
    question: 'Can the report say supplier risk fell?',
    sources: [
      {id: 'draft', name: 'Marit’s draft line', qs: [
        {q: 'What is it based on?', kind: 'trap', res: ['“The plan seeks the must-haves. That has to be a fall.”', '(What the plan asks for, not what is signed.)']}]},
      {id: 'plan', name: 'The plan you sent (Day 73)', qs: [
        {q: 'What does it seek?', kind: 'trap', res: ['The must-haves it seeks, contract by contract, sent to Ilka and Noor at 14:40 on Day 73', '(Sought, not signed.)']}]},
      {id: 'status', name: 'Ilka’s contracts status (08:30)', qs: [
        {q: 'Which contracts are signed?', kind: 'focus', key: true,
         res: ['Inkmere (Tier 2): renewed on Day 74, with the clauses the plan sought', 'Thimbleford (Tier 1): the amendment is with Thimbleford’s counsel, not signed', 'Wellhollow (Tier 1): the renewal is in negotiation, not signed', 'The members’ four tier-1 contracts: their owners’ decisions']}]},
      {id: 'history', name: 'The supplier register’s history', qs: [
        {q: 'Before and after: what changed?', kind: 'focus', key: true,
         res: ['First tiered on Day 71: no earlier measure', 'The Compact’s tier-1 contracts signed with every must-have: Day 71, 0 of 2. Day 85, 0 of 2', 'Also between: Thimbleford’s incident on its side (Days 71 to 74), cp-xfer back key-only from Day 74, the tier-1 contacts on the incident page']},
        {q: 'Every change to the register this quarter', kind: 'broad', rows: 310,
         wall: ['Day {i}  {t}  line {n}  owner set', 'Day {i}  {t}  line {n}  review date', 'Day {i}  {t}  contract {n}  note']}]}
    ],
    verdicts: [
      {label: 'No: there is one measure, from Day 71, and the signed tier-1 contracts are 0 of 2 on both days', good: true, needs: ['status', 'history'],
       needsWhy: 'the answer rests on two records: the contracts status and the register’s history. You read only one of them.',
       why: 'A fall needs two measures, and the one that exists has not moved: 0 of 2 signed on Day 71 and on Day 85.'},
      {label: 'Yes: the plan seeks every must-have for both tier-1 lines', why: 'Sought is not signed. Both tier-1 contracts are still unsigned.'},
      {label: 'Yes: Inkmere has signed its contract with the new clauses, so the Compact’s supplier risk has come down', why: 'Inkmere is Tier 2, and one contract. Tier-1 signed: 0 of 2.'},
      {label: 'No: by that measure supplier risk rose, as Thimbleford had an incident', why: 'One incident, on its side, is not a trend either. There is one measure.'}],
    reasons: [
      {label: 'The status says which contracts are signed, and the history has one measure only', good: true, why: 'What is signed, then how many measures there are.'},
      {label: 'The plan went out on Day 73 to Ilka and Noor, who hold the contracts', why: 'Sent is not signed.'},
      {label: 'The incident on Days 71 to 74 is the measure of how much the must-haves were needed', why: 'A reason to seek them, not a measure of risk.'}],
    alts: [
      {label: 'Thimbleford’s amendment was signed this week', good: true, why: 'Ruled out: the status has it with Thimbleford’s counsel.'},
      {label: 'An earlier tiering exists from before Day 71', good: true, why: 'Ruled out: the register was first tiered on Day 71.'},
      {label: 'Wellhollow is not really a Tier 1 supplier', why: 'Beside the point: the rule tiers it 1 on what it holds.'},
      {label: 'The members’ contracts count as the Compact’s', why: 'Nothing points to it: they are their owners’ decisions.'}],
    path: '<p>“Can the report say it fell?” is decided by <b>what is signed</b> and <b>how many measures there are</b>. A plan says what is sought; one measure is a baseline, not a trend.</p>',
    response: ['The report can say: suppliers tiered for the first time on Day 71, and tier-1 contracts signed with every must-have still 0 of 2', 'A trend needs a second measure: the next quarterly Board will have one', 'Marit corrects her draft line: her paper, her decision'],
    techs: [], acts: ['chrepsup']
  },
  // Who accepted R2 and R3: on the path where the Board's decision left them above appetite (repwho), and on the path
  // where the Board approved them funded (repwho2). chRepDrillC picks the one the records give. {minute67} and {accR23}
  // are filled from the game's own minute and acceptances.
  repwho: {
    id: 'repwho', title: 'Who accepted R2 and R3?', budget: 3,
    intro: '<p>R2 and R3 have been above appetite since the budget round on Day 67. Edda signed both acceptances. Who does the report say accepted them? The Board’s minute and the acceptances are here.</p>',
    artefact: '<pre class="art">Report draft · the Board papers (game data)\n' +
      'Line 2     R2, R3: above appetite.\n' +
      '           Accepted by: ?</pre>' +
      '<p class="small">Who decided is in the minute. Who signed, and for what, is on the acceptance.</p>',
    question: 'Who does the report say accepted R2 and R3?',
    sources: [
      {id: 'word', name: 'Edda’s word', qs: [
        {q: 'Who accepted them?', kind: 'trap', res: ['“I signed both. Say I accepted them.”', '(She signed for running the interim checks. Who decided is in the minute.)']}]},
      {id: 'papers', name: 'The budget papers (Day 66)', qs: [
        {q: 'What did the Board have in front of it?', kind: 'trap', res: ['Your allocation as sent, and Edda’s alternative beside it', '(Your advice. The decision is in the minute.)']}]},
      {id: 'minute', name: 'The Board’s minute (Day 67, 15:00)', qs: [
        {q: 'What did the Board decide about them?', kind: 'focus', key: true, res: ['{minute67}']}]},
      {id: 'acc', name: 'The signed acceptances', qs: [
        {q: 'Who decided, and who signed, and for what?', kind: 'focus', key: true, res: ['{accR23}']}]}
    ],
    verdicts: [
      {label: 'The Board, in its Day 67 minute, and Edda signed for running the interim measures', good: true, needs: ['minute', 'acc'],
       needsWhy: 'the answer rests on two records: the minute and the acceptances. You read only one of them.',
       why: 'The minute records the Board’s decision and its approval of the residual risk; the acceptances, Edda’s signature for the interim measures.'},
      {label: 'Edda: she signed the acceptances as their owner, so she accepted them', why: 'She signed for the interim measures and the treatment plan. The minute records that the Board decided.'},
      {label: 'The CISO: the allocation sent on Wednesday set where each of the two lines landed', why: 'Your allocation was advice. The minute records the Board’s decision.'},
      {label: 'Nobody yet: the acceptances are for the Board to sign on Day 155', why: 'They have been on the register since Day 67. Day 155 is their review.'}],
    reasons: [
      {label: 'The minute says who decided, and the acceptances who signed, and for what', good: true, why: 'The decider, then the signatory.'},
      {label: 'Edda signed both acceptances, and the one who signs them is the one who accepts', why: 'Her signature is for running the interim checks.'},
      {label: 'The allocation was what the Board read, and the Board decides on what it reads', why: 'The allocation was advice; the minute is the decision.'}],
    alts: [
      {label: 'The Board changed its decision later', good: true, why: 'Ruled out: no later minute changes it.'},
      {label: 'Edda decided them before the round', good: true, why: 'Ruled out: the minute records the Board’s decision.'},
      {label: 'R2 and R3 are back within appetite', why: 'Nothing points to it: neither line has its money yet.'},
      {label: 'The minute was written by Marit', why: 'Beside the point: it records the Board’s decision either way.'}],
    path: '<p>“Who accepted it?” is decided by <b>the minute</b> (who decided) and <b>the acceptances</b> (who signed, and for what). A signature for the interim checks is not the decision.</p>',
    response: ['The report says: above appetite to Day 428, this Board’s decision in its Day 67 minute, Edda signing for the checks', 'The decider and the signatory, each from its record', 'The minute’s reference goes with the line'],
    techs: [], acts: ['chrepwho']
  },
  repwho2: {
    id: 'repwho2', title: 'Who accepted R2 and R3?', budget: 3,
    intro: '<p>The Board approved the budget on Day 67. Edda’s draft line for the papers says the Board accepted R2 and R3. Who does the report say accepted them? The Board’s minute and the acceptances are here.</p>',
    artefact: '<pre class="art">Report draft · the Board papers (game data)\n' +
      'Line 2     R2, R3: accepted by\n' +
      '           the Board, Day 67.</pre>' +
      '<p class="small">Who decided is in the minute. What was accepted, and by whom, is on the register.</p>',
    question: 'Who does the report say accepted R2 and R3?',
    sources: [
      {id: 'word', name: 'Edda’s word', qs: [
        {q: 'Who accepted them?', kind: 'trap', res: ['“The Board approved them. Say the Board accepted them.”', '(Approving the money is not accepting a risk.)']}]},
      {id: 'papers', name: 'The budget papers (Day 66)', qs: [
        {q: 'What did the Board have in front of it?', kind: 'trap', res: ['Your allocation as sent, and Edda’s alternative beside it', '(Your advice. The decision is in the minute.)']}]},
      {id: 'minute', name: 'The Board’s minute (Day 67, 15:00)', qs: [
        {q: 'What did the Board decide about them?', kind: 'focus', key: true, res: ['{minute67}']}]},
      {id: 'acc', name: 'The acceptances on the register', qs: [
        {q: 'Which acceptances are on the register?', kind: 'focus', key: true, res: ['{accList}', 'None for R2 or R3']}]}
    ],
    verdicts: [
      {label: 'Nobody: the Board funded both, so neither of them needed an acceptance', good: true, needs: ['minute', 'acc'],
       needsWhy: 'the answer rests on two records: the minute and the acceptances. You read only one of them.',
       why: 'The minute approved them funded, within appetite, and the register holds no acceptance for either.'},
      {label: 'The Board: its Day 67 minute was the acceptance, as their lines were funded', why: 'It approved their funding. Within appetite, there is nothing to accept.'},
      {label: 'Edda: as their owner she accepted them when the Board approved them', why: 'An owner signs an acceptance for a risk above appetite. Neither is.'},
      {label: 'The register itself: both lines were within appetite on the day it was written', why: 'A register records; it decides nothing. The Board funded both, and nothing needed accepting.'}],
    reasons: [
      {label: 'The minute approved the funding, and the register lists no acceptance for them', good: true, why: 'The decision, then the register.'},
      {label: 'An approved line is an accepted one, and the minute approved both', why: 'Approving money is not accepting a risk.'},
      {label: 'Edda owns both, and an owner’s acceptance follows whatever the Board approves', why: 'An owner accepts a risk left above appetite, and these are within.'}],
    alts: [
      {label: 'An acceptance for R2 was signed later', good: true, why: 'Ruled out: the register lists none for R2 or R3.'},
      {label: 'R2 or R3 is above appetite after all', good: true, why: 'Ruled out: both are within appetite on the Board’s decision.'},
      {label: 'The extension replaced R2’s review', why: 'Nothing points to it: the extension is R6’s.'},
      {label: 'The minute was written by Marit', why: 'Beside the point: it records the Board’s decision either way.'}],
    path: '<p>“Who accepted it?” is decided by <b>the minute</b> (what the Board decided) and <b>the register’s acceptances</b> (what was accepted, and by whom). Approving a line’s money is not accepting its risk.</p>',
    response: ['The report says nothing was accepted for R2 or R3: the Board funded both', 'Edda corrects her draft line before the papers go: her paper, her decision', 'What is above appetite, the acceptances say, each with its owner'],
    techs: [], acts: ['chrepwho']
  }
};

/* ---------- The directive (game; Tuesday 11:00): Edda asks for a line to stay out of the summary ---------- */
const CH_REP_DIRECTIVE = [
  {label: 'It stays in the summary: one line is enough, with the minute’s reference', good: true},
  {label: 'Leave it out: the Board minuted it, and its members already know', why: 'The report states what the Board carries today. A member who reads only this page must see it.'},
  {label: 'Move it to the annex: the minute is there for anyone who looks', why: 'The annex holds the records behind the page. What is above appetite goes on the page.'},
  {label: 'Keep it, with the whole minute and each interim check, word for word, on the page', why: 'One line and the minute’s reference. The page holds ten lines.'},
  {label: 'Ask the chair whether the Board wants to see it again', why: 'What the report says is yours to decide. It states what is above appetite, every time.'}];

/* ---------- The Reporting terminals (Beatriz's; three puzzles) ---------- */
const CH_REP_DOJO = [
  {q: 'The register shows six accounts excepted from MFA, each on an open, dated entry. Which line can a report carry?',
   opts: ['MFA on every sign-in, but for six accounts on open, dated exceptions',
          'MFA on every sign-in, as each exception is open and dated',
          'MFA on nearly every sign-in, since six accounts are only a small few'], good: 0,
   explain: 'Say what the record says, the exceptions included. “Every” where the record says less is an overstatement, and “nearly” hides who.'},
  {q: 'Suppliers were tiered for the first time this quarter. Tier-1 contracts signed with every must-have: 0 of 2. What can the report say?',
   opts: ['Supplier risk fell, as the plan seeks every clause for both',
          'A first measure, 0 of 2: the baseline for next quarter',
          'Supplier risk rose, measured by the one supplier’s incident'], good: 1,
   explain: 'One measure is a baseline, not a trend, either way. A trend needs a second measure.'},
  {q: 'A Board minute decided to carry a line above appetite, and its owner signed for the interim checks. Who does the report say accepted it?',
   opts: ['The owner, who signed the acceptance for the line and runs its checks',
          'The CISO, who wrote the acceptance up for the register',
          'The Board, in its minute, the owner signing for the interim measures'], good: 2,
   explain: 'The minute says who decided; the signature, who runs the checks. A report says both.'}];

/* ---------- The Board's standing questions (Thursday 14:00): used when the report leaves fewer than three weak points ---------- */
const CH_REP_BOARD_SPECS = () => [
  {title: 'The annex', who: 'Ivor Penhallow',
   ask: '“Your annex: why should we read it?”',
   resp: [{label: 'For the records: each line on the page cites them, with their times', good: true},
          {label: 'It needn’t be read: the page is the report, and the annex is for the auditors', why: 'The page stands on the annex. A member who doubts a line reads its record.'},
          {label: 'For the detail the page left out, as the records run too long for the page', why: 'The page holds what matters; the annex holds the records behind it, not extra lines.'},
          {label: 'To check the figures, as the page’s figures are only my estimates', why: 'The figures are read from the records, not estimated.'}]},
  {title: 'Whose report', who: 'Ivor Penhallow',
   ask: '“Who decides what this report says?”',
   resp: [{label: 'I do, as the CISO: each decision in it stays with its own decider', good: true},
          {label: 'The Board: it approves the report, as it approves the policy and the appetite', why: 'The Board receives the report and takes the decisions it puts to it. Its words are the CISO’s.'},
          {label: 'Each owner: each one signs off the line about its own risk', why: 'Owners sign their acceptances. The report is the CISO’s.'},
          {label: 'Counsel: Noor reads every line before it goes to the Board', why: 'Noor answers legal questions. The report is the CISO’s.'}]},
  {title: 'Better or worse', who: 'Ivor Penhallow',
   ask: '“Is anything better than it was on Day 64?”',
   resp: [{label: 'Where there are two measures, yes or no. Where there is one, it is a baseline', good: true},
          {label: 'Everything: the register, the suppliers and the policy are all new this quarter', why: 'New is not better. One measure is a baseline.'},
          {label: 'Nothing can be said until a whole year of measures is in', why: 'Two measures say something. Say what they show.'},
          {label: 'The night cover: 93% faster, the clearest gain this quarter', why: 'Two nights are a sample, not a trend.'}]}];
