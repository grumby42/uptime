/* ============================================================
   UPTIME · editions/charter/policy-data.js
   Charter district 3: Policy lifecycle (Days 78 to 81). The documents (POL-1,
   the Compact's security policy, and the five standards under it), the
   exception rule (POL-1 section 6), the exception register's entries and the
   write-ups the intake offers, three drills whose evidence is records, the
   consultation, the replies, the directive (a member's leader asks for a
   permanent exception), the Policy terminals and the Compact Board's Policy
   round.
   The register's first entry is the town's fd-admin exception, quoted from
   Town Hall (editions/town-hall: story.js and council-data.js) and nothing
   more: what Town Hall does not state is shown as not stated.
   One decider per decision: the CISO drafts the policy, decides what changes in
   the draft (except its legal wording, which is counsel's), issues the
   standards, measures them and recommends; the Board approves the policy; each
   exception's business owner asks for it and signs for running its control, and
   who decides follows the CISO's check (6.2, 6.2a): a standard one, the owner
   (the signature is its approval); an escalated one (the CISO against, a
   partial control, a risk above appetite or a broken tolerance, safety-of-life
   or personal records, a second renewal), the Board's chair for the Compact's
   services, within five working days, or a member's own leadership for that
   member's service; where the exception exists because of a Board decision, the
   Board in its minute (6.3). Edda decides the shared directory's settings. The
   CISO never approves, signs, renews or closes an exception.
   Defender side only: every record here is the Compact's own (registers, rule
   settings, sign-in and change records, notices). No technique, no ATT&CK ID.
   Every document, account, group, rule, count, time and date is invented
   (game). Real facts: CREDITS.md, section "Charter". Timeline: scratchpad
   charter-timeline.md (slice 3); every line here is checked against it.
   ============================================================ */
'use strict';

const CH_POL_DAY = {78: 'Monday', 79: 'Tuesday', 80: 'Wednesday', 81: 'Thursday'};
const CH_POL_NEXT_BOARD = 155;   // the next quarterly Board this quarter (then every 91 days: chNextBoard)
const CH_POL_BOARD_EVERY = 91;   // the Board meets each quarter: Day 155, 246, 337 …
const CH_POL_MAX_DAYS = 365;     // an exception's expiry: no more than 12 months (365 days) after its start
const CH_POL_REVIEW_MAX = 446;   // a document's review date: no more than 12 months after the Board approves POL-1 (Day 81)

/* ---------- The documents (game). None has a review date on record; four are inherited, with no owner recorded either, so
   POL-1 section 4 sets one: the CISO, as issuer (Edda's team operates STD-1, STD-4 and STD-5); POL-1 is the Board's ---------- */
const CH_POL_DOCS = [
  {id: 'POL-1', name: 'The Compact’s security policy', kind: 'policy', bot: 428, owner: 'the Compact Board (kept by the CISO)',
   what: 'Your draft, v0.1 (Friday, Day 75). The Board approves it; you keep it, measure it and report on it. Sections: scope, who decides, the appetite statement binds, standards, measurement, exceptions, legal questions, review.'},
  {id: 'STD-1', name: 'Sign-in', kind: 'standard', bot: 155, owner: 'the CISO, as issuer; operated by Edda’s team',
   what: 'Inherited: “the sign-in policy”. MFA for every account in the shared directory, except the accounts in MFA-Exempt, through the register.'},
  {id: 'STD-2', name: 'Vendor access', kind: 'standard', bot: 155, owner: 'the CISO, as issuer',
   what: 'Inherited: written by Edda’s team from each member’s own decision in its week. Vendor support on demand per ticket, from the vendor’s documented range, MFA for every vendor user.'},
  {id: 'STD-3', name: 'Suppliers', kind: 'standard', bot: 155, owner: 'the CISO, as issuer',
   what: 'Yours (Friday, Day 68): the tiering rule and the clause catalogue, with each tier’s must-haves.'},
  {id: 'STD-4', name: 'Accounts', kind: 'standard', bot: 155, owner: 'the CISO, as issuer; operated by Edda’s team',
   what: 'Inherited: “A leaver’s account in the shared directory is disabled by the end of their last working day.”',
   // v2, from Wednesday's replies (Day 80 09:20, agreed by the five members' owners at 12:40): the library and the papers carry it.
   v2: 'v2, Day 80: “A leaver’s account in the shared directory is disabled by the end of their last working day. Each member sends its leaver notice to reach the Compact by 12:00 that day (agreed by each member’s owner, Day 80); where one arrives later, the account is disabled within two working hours of its arrival, and the late notice is recorded as the member’s.” Changed after Tuesday’s records, with the reason recorded beside it.'},
  {id: 'STD-5', name: 'Updates', kind: 'standard', bot: 155, owner: 'the CISO, as issuer; operated by Edda’s team',
   what: 'Inherited: critical fixes on every system the Compact runs, within 14 days of their release.'}];
// The review dates the policy library offers for each document (cycled; index 0 = none). Valid: a day no more than
// 12 months after Day 81 (CH_POL_REVIEW_MAX).
const CH_POL_REVIEWS = [null, 'when', 155, 428, 600];
const CH_POL_REVIEW_TEXT = {when: 'when something changes', 155: 'Day 155, the quarterly Board', 428: 'Day 428, the start of next year’s budget cycle', 600: 'Day 600'};

/* ---------- POL-1 section 6: the exception rule (game) ---------- */
const CH_POL_RULE = [
  '6.1 An exception departs from one clause of a standard, for named accounts or systems, exactly, for a stated business reason, with compensating controls that cover the gap.',
  '6.2 Its owner is the business owner of the service in scope (for a member’s service, that member’s). The owner asks for it and signs for running its control. Who decides follows the CISO’s check (6.4): a standard exception, the owner decides, and the signature is its approval; an escalated one, the owner cannot approve it (6.2a).',
  '6.2a Escalated: the CISO recommends against; the control covers only part of the gap; a risk goes above appetite or a tolerance breaks (6.7); the system serves a safety-of-life service or holds personal records; or it is a second renewal. For the Compact’s services the Board’s chair decides, on the papers, within five working days, and the Board minutes it at its next meeting; for a member’s own service, that member’s own leadership above the owner decides, and the Compact Board sees it. Until it is decided, the standard applies.',
  '6.3 Where it exists because of a Board decision (a line the Board chose not to fund), the Board approves it in its minute, and the owner signs for running the control.',
  '6.4 The CISO writes it up, checks the control against the gap, records it and recommends; the recommendation is recorded as the CISO’s. The CISO never approves, signs, renews or closes one. One the CISO recommends against is escalated (6.2a). Where the exception comes from the CISO’s own recommendation, the Board’s papers say so, and its control is checked by Edda’s team, not the CISO.',
  '6.5 It runs from a start date to an expiry no more than 12 months (365 days) later, with a review date no later than its expiry and no later than the next quarterly Board. Where the review falls on the expiry day, the renewal is decided at the review, before 17:00.',
  '6.6 At its expiry it closes, or renews through the same route with fresh evidence: the review’s record and the control’s own records. An expired exception is not open, and nothing past its expiry stays in a group such as MFA-Exempt.',
  '6.6a At its expiry, unless a renewal is on the register, Edda’s team takes the account or system out of the group on the expiry date, as a change dated in advance when the exception is recorded. The CISO reports any miss, and any sign-in outside an open exception, to its owner and to the next quarterly Board.',
  '6.7 One that leaves a risk above appetite or breaks a tolerance is also an acceptance on the risk register. The Board sees every exception at its quarterly meeting.',
  '6.8 A difference meant to last is not an exception: it goes to the standard’s review. A second renewal also opens the standard’s review.'];

/* ---------- The exception register (game). Entries as of Monday, Day 78, 08:45 ---------- */
// EX-00 is the town's, quoted from Town Hall (story.js:487, :522; council-data.js:309, :315, :318, :341): read only.
// Fields Town Hall does not state are shown as not stated. The six service accounts of Budget week's drill are EX-02's
// five and EX-03's cp-patch; with fin-ap and board-display, the eight in MFA-Exempt.
const CH_POL_NOT_STATED = 'not stated in the town’s record';
const CH_POL_EXC_INIT = [
  {id: 'EX-00', seed: true, src: 'the town’s, from Town Hall', short: 'fd-admin',
   scope: 'fd-admin, the Front Desk admin account',
   clause: 'IS-04 (the town’s policy, game): “Multi-factor authentication is required for all remote access.” Approved 2024.',
   reason: '“for convenience”', controls: CH_POL_NOT_STATED, owner: CH_POL_NOT_STATED, approver: 'No approver recorded',
   startText: 'added in 2023, before IS-04 was approved', expiryText: 'no expiry', reviewText: 'no review', status: 'closed',
   note: 'In the town’s words: “MFA-Exceptions, that night: one member, fd-admin”; “fd-admin removed the morning after the incident; the list has been empty since”. Then: “Exceptions now need an approver and an expiry, and Bram’s committee reads the list every month.”'},
  {id: 'EX-01', short: 'board-display', std: 'STD-1', scope: 'board-display, the Board room’s display PC',
   clause: 'STD-1: MFA for every account in the shared directory', reason: 'until the Board room’s display signs in as the meeting’s host',
   controls: 'none written (Day 65)', owner: 'Edda Thornquist', start: 65, expiry: 75, expiryAt: '17:00', review: null,
   tol: 'within: no personal records, the Board room’s PC only',
   note: 'Owner and expiry set on Day 65, after the MFA records were read.'},
  {id: 'EX-02', short: 'five service accounts', std: 'STD-1', scope: 'cp-backup, cp-logfwd, cp-files-lib, cp-files-cl and cp-files-ap: five Compact service accounts',
   clause: 'STD-1: MFA for every account in the shared directory', reason: 'machine accounts: they can’t answer MFA',
   controls: 'a sign-in rule: each one non-interactive only, from its own server’s address (Beatriz, Day 65); checked Day 78 08:40: applied on every sign-in since Day 65',
   owner: 'Edda Thornquist', start: 65, expiry: 155, review: null, note: 'Owner and expiry set on Day 65.',
   // 6.2a: personal records. CL-FS-01 is the Clinic's shared drive, where its daily lists of patients sat (Crossroads,
   // clinic-data.js: "90 days of daily lists and a recall list with 1,180 inactive patients sat on that share").
   critical: 'cp-files-cl reaches CL-FS-01, the Clinic’s shared drive, which holds its daily lists of patients',
   recommendedBy: 'the CISO: for (the sign-in rule applied on every sign-in since Day 65)',
   tol: 'privacy: not reachable from outside (each only from its own server), every sign-in logged: within'},
  {id: 'EX-03', short: 'cp-patch', std: 'STD-1', scope: 'cp-patch, PATCH-01’s update account',
   clause: 'STD-1: MFA for every account in the shared directory', reason: 'until PATCH-01, the old update server, is retired',
   controls: 'non-interactive only, from PATCH-01', owner: 'Edda Thornquist', start: 65, expiry: 75, review: null, tol: 'within: an update account, non-interactive only',
   note: 'Owner and expiry set on Day 65. Edda’s change record: PATCH-01 retired Day 75 (Friday) 16:10.'},
  {id: 'EX-04', short: 'fin-ap', std: 'STD-1', boardLine: 'R4', scope: 'fin-ap, the finance office’s shared accounts-payable mailbox',
   clause: 'STD-1: MFA for every account in the shared directory', reason: 'its scanner couldn’t do MFA; named mailboxes with MFA are R4’s line',
   controls: 'sign-ins only from the finance office (the location rule, Day 65), as Marit states it; not checked yet',
   owner: 'Marit Quellan', start: 65, expiry: null, review: null, note: 'Owner set on Day 65; no expiry, no review.',
   recommendedBy: 'the CISO: for, its control to be checked'}];

/* ---------- The intake (Monday 10:30): one row per entry to write up; each cycles four write-ups ---------- */
// The as-sent register is the CISO's advice (the scorecard reads it). disp, for an expired entry: 'owner' (to its
// owner, to close or renew through the route), 'open', 'renew-ciso', 'ciso-close'.
const CH_POL_INTAKE = {
  'EX-02': [
    {label: 'The CISO’s · expires Day 155 · review Day 155, at the quarterly Board', owner: 'the CISO', expiry: 155, review: 155,
     why: 'You keep the register. The accounts run in Edda’s shared services, so she is their owner.'},
    {label: 'Edda’s · expires Day 155 · review Day 155, at the quarterly Board', owner: 'Edda Thornquist', expiry: 155, review: 155, good: true},
    {label: 'Edda’s · expires Day 155 · review when something changes', owner: 'Edda Thornquist', expiry: 155, review: 'when',
     why: 'A review “when something changes” never comes on a quiet entry. A date: Day 155.'},
    {label: 'Edda’s · no expiry: machine accounts never do MFA · review Day 155, at the quarterly Board', owner: 'Edda Thornquist', expiry: null, review: 155,
     why: 'An exception has an expiry, at most 12 months on. A difference meant to last goes to STD-1’s review.'}],
  'EX-03': [
    {label: 'Open: nothing has used cp-patch since Friday', disp: 'open',
     why: 'It expired on Friday, and PATCH-01 was retired. Expired is not open: to Edda, to close.'},
    {label: 'Renewed by you to Day 155, in case PATCH-01 comes back', disp: 'renew-ciso',
     why: 'You never renew one, and nothing needs it: PATCH-01 was retired on Friday. To Edda, to close.'},
    {label: 'Expired Friday, PATCH-01 retired: you send it to Edda, its owner, to close', disp: 'owner', good: true},
    {label: 'Expired: you take cp-patch out of MFA-Exempt yourself, now', disp: 'ciso-close',
     why: 'Right that it ends, but the directory’s settings are Edda’s, and so is closing her exception.'}],
  'EX-04': [
    {label: 'Marit’s · expires Day 155 · review Day 155 · control: as stated, to be checked', owner: 'Marit Quellan', expiry: 155, review: 155, good: true},
    {label: 'Marit’s · expires when the named mailboxes arrive · review Day 155 · control: the finance-office rule', owner: 'Marit Quellan', expiry: 'when', review: 155,
     why: '“When the mailboxes arrive” is not a date. An expiry is a day, at most 12 months on.'},
    {label: 'Edda’s: she runs the directory · expires Day 155 · review Day 155 · control: the finance-office rule', owner: 'Edda Thornquist', expiry: 155, review: 155,
     why: 'Edda runs the directory. The mailbox and its payments are finance’s: Marit owns it.'},
    {label: 'Marit’s · expires Day 428 · review Day 428 · control: the finance-office rule', owner: 'Marit Quellan', expiry: 428, review: 428,
     why: 'Day 428 is within 12 months, but its review must come by the next quarterly Board, Day 155.'}]};

/* ---------- Drills (Monday and Tuesday). Records are the evidence; two decisive sources each ---------- */
const CH_POL_DRILLS = {
  polvalid: {
    id: 'polvalid', title: 'board-display’s exception', budget: 3,
    intro: '<p>board-display, the Board room’s display PC, signs in through MFA-Exempt. On Day 65 Edda gave it an owner, herself, and an expiry. Her team says it is fine: nobody has complained, and it still signs in. Is the exception still valid?</p>',
    artefact: '<pre class="art">MFA-Exempt · Beatriz’s export, Monday 08:40 (game data)\n' +
      'Members    8\n' +
      '  board-display   the Board room’s display PC\n' +
      '  fin-ap          finance, accounts payable\n' +
      '  cp-backup  cp-logfwd  cp-patch\n' +
      '  cp-files-lib  cp-files-cl  cp-files-ap</pre>' +
      '<p class="small">The group says what the directory lets in. The exception’s own record, and its review record, say whether it still stands.</p>',
    question: 'Is board-display’s exception still valid?',
    sources: [
      {id: 'team', name: 'Edda’s team’s note', qs: [
        {q: 'Is anything wrong with it?', kind: 'trap', res: ['“No complaints from anyone in two weeks, and it still works.”', '(No complaint is not a review.)']}]},
      {id: 'since', name: 'board-display’s sign-ins since Friday', qs: [
        {q: 'Has it signed in since Friday?', kind: 'trap', res: ['Monday 08:31 and 08:34: signed in without MFA, from the Board room’s PC', '(What the directory does. It doesn’t read the register.)']},
        {q: 'Every sign-in to the shared directory this month', kind: 'broad', rows: 18400,
         wall: ['{t}  account {i}  MFA ok  member PC', '{t}  cp-logfwd  non-interactive  CP-OPS-02', '{t}  account {n}  MFA ok  home']}]},
      {id: 'entry', name: 'The exception’s record (Day 65)', qs: [
        {q: 'Who owns it, why, and until when?', kind: 'focus', key: true,
         res: ['Owner: Edda Thornquist, set on Day 65, after the MFA records were read', 'Reason: until the Board room’s display signs in as the meeting’s host', 'Expiry: Day 75 (Friday), 17:00']}]},
      {id: 'reviews', name: 'The review record', qs: [
        {q: 'Has anyone reviewed or renewed it?', kind: 'focus', key: true,
         res: ['Reviews of board-display’s exception since Day 65: none recorded', 'No renewal recorded: nothing extends it past Friday 17:00']}]}
    ],
    verdicts: [
      {label: 'Not valid: the exception expired on Friday at 17:00, and no review renewed it', good: true, needs: ['entry', 'reviews'],
       needsWhy: 'the answer rests on two records: the exception’s expiry and its review record. You read only one of them.',
       why: 'Its record ends it on Friday at 17:00, and the review record shows nothing renewing it. Expired is not open, whatever the directory still lets in.'},
      {label: 'Valid: nobody has complained about the exception in two weeks, and it signs in fine', why: 'No complaint is not a review, and the directory lets in whatever sits in the group. Its record ended it on Friday.'},
      {label: 'Valid until its review, and it still sits in MFA-Exempt', why: 'The group is what the directory does. The record says when the exception ends: Friday at 17:00.'},
      {label: 'Not valid, and board-display has been misused after Friday at 17:00', why: 'Two sign-ins on Monday morning, both from the Board room’s PC. Nothing shows misuse.'}],
    reasons: [
      {label: 'Its record ends it on Friday at 17:00, and the review record, the team’s, shows no renewal', good: true, why: 'The expiry, then the review record.'},
      {label: 'Nobody raised a problem with it in two weeks: the best review there is', why: 'Silence is not a review.'},
      {label: 'The directory accepted Monday’s 08:31 sign-in: the exception is still in force', why: 'The directory lets in the group. It doesn’t read the register.'}],
    alts: [
      {label: 'A renewal was agreed, but never written down', good: true, why: 'Weighed: none is recorded. A renewal that isn’t on the record is no renewal; Edda can renew it through the route.'},
      {label: 'The expiry was meant to be a later day', good: true, why: 'Ruled out: Edda’s own record says Friday at 17:00.'},
      {label: 'The Board room’s PC was replaced last week', why: 'Beside the point: the exception ended on Friday either way.'},
      {label: 'Someone outside the Compact used board-display', why: 'Nothing points to it: both sign-ins came from the Board room’s PC.'}],
    path: '<p>“Is this exception still valid?” is decided by <b>its expiry date</b> and <b>the review record</b>. That nobody complained, or that the directory still lets the account in, says nothing about whether it stands.</p>',
    response: ['09:50, Edda’s decision, as its owner: closed. board-display out of MFA-Exempt; the Board room’s PC signs in as the meeting’s host, with MFA', 'The register records it closed, citing the record and the time. Monday’s 08:31 and 08:34 are recorded as two sign-ins without MFA outside an exception: a STD-1 miss, cause: nothing removed it at expiry (6.6a), reported to Edda and the next Board', 'Removal at expiry is scheduled when each exception is recorded; Beatriz’s Monday read checks it'],
    techs: [], acts: ['chpolvalid']
  },
  polcover: {
    id: 'polcover', title: 'fin-ap’s compensating control', budget: 3,
    intro: '<p>fin-ap, the finance office’s shared accounts-payable mailbox, stays excepted from MFA until it has named mailboxes. Monday’s register gives its compensating control as its owner, Marit, wrote it: sign-ins only from the finance office. Does the control actually cover the gap?</p>',
    artefact: '<pre class="art">EX-04 · fin-ap (game data)\n' +
      'Gap        no MFA: a stolen password\n' +
      '           would sign in\n' +
      'Control    “sign-ins only from the\n' +
      '            finance office” (Marit)</pre>' +
      '<p class="small">A control covers a gap only where it applies. Its settings say where; the sign-in records say whether it did.</p>',
    question: 'Does fin-ap’s compensating control cover the gap?',
    sources: [
      {id: 'marit', name: 'Marit’s write-up', qs: [
        {q: 'What covers it?', kind: 'trap', res: ['“Covered since Day 65: Beatriz set a rule, finance office only.”', '(What she was told. The rule’s own settings decide it.)']}]},
      {id: 'summary', name: 'The 7-day sign-in summary', qs: [
        {q: 'Where did fin-ap sign in from?', kind: 'trap', res: ['fin-ap: 49 sign-ins in the 7 days to 08:00, all from the finance office’s three PCs', '(Where the people sat, not what the rule made them do.)']},
        {q: 'Every sign-in to the shared directory this week', kind: 'broad', rows: 4600,
         wall: ['{t}  account {i}  MFA ok  member PC', '{t}  cp-backup  non-interactive  CP-OPS-02', '{t}  account {n}  MFA ok  home']}]},
      {id: 'rule', name: 'The location rule’s settings (Beatriz, 08:40)', qs: [
        {q: 'What does the rule apply to?', kind: 'focus', key: true,
         res: ['Rule “Finance office only”: sign-ins allowed only from the finance office’s network', 'Applies to: the group FIN-STAFF, nine named finance staff', 'fin-ap: not a member of FIN-STAFF']}]},
      {id: 'log', name: 'fin-ap’s sign-in records (7 days to 08:00)', qs: [
        {q: 'What did each of fin-ap’s sign-ins pass?', kind: 'focus', key: true,
         res: ['49 sign-ins, all from the finance office’s three PCs', 'Each one: MFA excepted (MFA-Exempt); location rule: not applied']}]}
    ],
    verdicts: [
      {label: 'No: the rule leaves fin-ap out, and its sign-ins say not applied', good: true, needs: ['rule', 'log'],
       needsWhy: 'the answer rests on two records: the rule’s scope and fin-ap’s own sign-ins. You read only one of them.',
       why: 'The rule applies to FIN-STAFF, and fin-ap isn’t in it; each of fin-ap’s sign-ins says so. The control is stated, not in place.'},
      {label: 'Covered: all 49 sign-ins in the 7 days show the finance office’s three PCs', why: 'They came from there because that is where people sat. The rule wasn’t applied to one of them.'},
      {label: 'It is covered: Marit has it in writing that the rule was set up on Day 65', why: 'The rule exists, for FIN-STAFF. fin-ap isn’t in that group.'},
      {label: 'No, and Noor should end fin-ap’s exception before Marit decides', why: 'The exception is Marit’s to decide, and nothing here is a legal question. The fix is fin-ap in the rule’s scope: Edda’s call.'}],
    reasons: [
      {label: 'The rule names FIN-STAFF only, and the excepted account’s sign-ins say not applied', good: true, why: 'What the control applies to, then whether it applied.'},
      {label: 'Each sign-in came from inside the office, which is where the exception allows', why: 'Where people sat is not a control.'},
      {label: 'Edda’s team set it up on Day 65, and its rules have passed each review', why: 'It works, for the group it names.'}],
    alts: [
      {label: 'Another location rule, set for this mailbox alone, covers fin-ap', good: true, why: 'Ruled out: each sign-in lists the rules applied, and no location rule is among them.'},
      {label: 'The summary counts a different account', good: true, why: 'Ruled out: the summary and the records give the same 49 sign-ins.'},
      {label: 'Someone outside the office signed in as fin-ap', why: 'Nothing points to it in the 7 days read. The weeks before go into the response.'},
      {label: 'The finance office’s PCs are shared by its staff', why: 'True, and beside the question: the rule’s scope decides it.'}],
    path: '<p>“Does the control cover the gap?” is decided by <b>the control’s scope</b> (what it applies to) and <b>the sign-in records</b> for the excepted account (whether it applied). Where people happened to sit is not a control.</p>',
    response: ['10:15, Edda’s decision (the directory’s settings): fin-ap goes into the rule’s scope. Beatriz adds it at 10:20', 'Beatriz reads fin-ap’s sign-ins for the whole time the rule wasn’t applied, Day 65 08:00 to 10:20 today: 99, all from the finance office’s three PCs; its mailbox rules and forwarding: none added since Day 65 (game)', 'fin-ap’s next sign-in, 10:31: location rule applied', 'The register’s entry now cites the rule’s scope and that sign-in. The rule covers sign-ins from outside the finance office; a password used at its PCs is not covered, so the control is partial (6.2a) until the named mailboxes arrive', 'Marit signs for running its control, to Day 155. Partial, it is escalated: its owner does not approve it alone (6.2a)'],
    techs: [], acts: ['chpolcover']
  },
  polfollow: {
    id: 'polfollow', title: 'Is STD-4 followed?', budget: 3,
    intro: '<p>STD-4, inherited, says a leaver’s account in the shared directory is disabled by the end of their last working day. Edda’s team attests that it is followed. On Monday you set the measurement’s plan, before anything was drawn: every leaver notice of the 30 days to Day 77, 30 of them, fewer than 50, so all are read. Beatriz exported them, and you matched each to its disable time. Is STD-4 being followed?</p>',
    artefact: '<pre class="art">STD-4 · Accounts (inherited, game data)\n' +
      '“A leaver’s account in the shared directory\n' +
      ' is disabled by the end of their last\n' +
      ' working day.”\n' +
      'Attested   each quarter, by Edda’s team</pre>' +
      '<p class="small">An attestation says what someone believes. The records, read against the standard’s own words, say what happened.</p>',
    question: 'Is STD-4 being followed?',
    sources: [
      {id: 'attest', name: 'The team’s quarterly attestation', qs: [
        {q: 'What does the team say?', kind: 'trap', res: ['“All leavers’ accounts disabled in line with STD-4.” (signed by the team’s lead)', '(A belief, signed. Not a measure.)']}]},
      {id: 'after', name: 'Leavers’ sign-ins after leaving', qs: [
        {q: 'Did any leaver sign in after leaving?', kind: 'trap', res: ['None of the 30 leavers signed in after their last working day', '(An outcome. STD-4 says when the account is disabled.)']}]},
      {id: 'words', name: 'STD-4’s own wording', qs: [
        {q: 'What exactly does it require?', kind: 'focus', key: true,
         res: ['“A leaver’s account in the shared directory is disabled by the end of their last working day.”', 'The step: Edda’s team disables it, from the member’s leaver notice']}]},
      {id: 'sample', name: 'The leaver records (all 30, the 30 days to Day 77)', qs: [
        {q: 'When was each leaver’s account disabled?', kind: 'focus', key: true,
         res: ['The CISO’s plan (Monday, before the draw): the 30 leaver notices in the 30 days to Day 77; fewer than 50, so all 30. Beatriz exported them; the CISO matched each to its disable time', '27 disabled by the end of the last working day', '3 later: 2, 4 and 9 days after. Each of the three: the member’s notice reached the Compact after the last working day']},
        {q: 'Every change in the directory this month', kind: 'broad', rows: 2300,
         wall: ['Day {i}  {t}  account {n}  password reset', 'Day {i}  {t}  account {n}  disabled', 'Day {i}  {t}  group change']}]}
    ],
    verdicts: [
      {label: 'Not as written: 3 of the 30 leavers’ accounts were disabled late', good: true, needs: ['words', 'sample'],
       needsWhy: 'the answer rests on two records: STD-4’s own words and the leaver records. You read only one of them.',
       why: 'STD-4 says by the end of the last working day. Of the 30, 27 were; 3 were disabled 2, 4 and 9 days after.'},
      {label: 'Followed: the team attests it at each quarterly review, signed by its lead', why: 'An attestation says what someone believes. The records show 3 of 30 late.'},
      {label: 'In effect: none of the 30 leavers signed in after their last day', why: 'STD-4 says disabled by the end of the last working day. Nobody signing in is an outcome, not the standard.'},
      {label: 'Not known until each leaver this year has been checked, one by one', why: 'Every record of the 30 days already answers it: not as written, 3 of 30 late. A longer period adds to that; it doesn’t undo it.'}],
    reasons: [
      {label: 'The records, read against STD-4’s words: 3 of 30 disabled late in the weeks read', good: true, why: 'The standard’s wording, then the records.'},
      {label: 'The attestation is signed by the team’s lead, who runs the step each week', why: 'A signature on a belief is still a belief.'},
      {label: 'Measured against the sign-in log, no leaver’s account was used after they left', why: 'That is the outcome so far, not what STD-4 says.'}],
    alts: [
      {label: 'The 30 days were not a usual month', good: true, why: 'Weighed: every record of the period was read, so 3 of 30 is exact for it. Whether other months differ, the next 30 days’ records say, before STD-4’s review.'},
      {label: 'The three were late because their notices were', good: true, why: 'Weighed, and named: each notice reached the Compact after the last day. STD-4 still wasn’t met.'},
      {label: 'The team disabled them on time, and the record is wrong', why: 'Nothing points to it: the change record gives each time.'},
      {label: 'The three were contractors, not staff', why: 'Beside the point: STD-4 covers every leaver’s account.'}],
    path: '<p>“Is the policy being followed?” is decided by <b>the records</b> (every one, where there are fewer than 50; otherwise a sample planned before the draw), read against <b>the standard’s own wording</b>. An attestation says what someone believes; an outcome that went well says nothing about the rule.</p>',
    response: ['Your report says what the records show: 27 of 30 disabled on time, against STD-4’s own words', 'The three late ones each came from a leaver notice that reached the Compact after the last day. The members’ notices are theirs to change', 'STD-4 is measured again on every record of the next 30 days, before its review'],
    techs: [], acts: ['chpolmeasure']
  }
};

/* ---------- The consultation (Monday 14:00, your desk): pick three ---------- */
const CH_POL_CONSULT = [
  {label: 'The members’ owners: what it asks of their services', good: true},
  {label: 'Counsel: the legal wording, which is counsel’s to decide', good: true},
  {label: 'Edda: whether the shared services can run what you wrote', good: true},
  {label: 'The Board: to approve it first, then ask the others', why: 'Approval comes after the consultation: the Board approves what the consultation has tested.'},
  {label: 'Ilka: the suppliers on the register must follow it too', why: 'A supplier’s terms are in its contract, which Ilka and Noor hold. Suppliers aren’t consulted on the Compact’s own policy.'},
  {label: 'The members’ staff: each clause decided by a vote', why: 'A vote makes hundreds of deciders. Each member’s owner answers for its services.'}];

/* ---------- The replies (Wednesday 09:00): whose wording for section 7 ---------- */
const CH_POL_REPLY = [
  {title: 'The replies · Wednesday 09:00', who: 'Noor Castellanos',
   ask: 'Noor rewrote section 7. Yours read “The Compact complies with every law that applies to it.” Hers reads “Where a law may apply, counsel says what it requires, and of whom.” Whose wording goes in?',
   resp: [{label: 'Noor’s: legal wording is counsel’s to decide, as she wrote it', good: true},
          {label: 'Yours: you own the draft, and each word in it is yours to keep', why: 'You own the draft. Its legal wording is counsel’s.'},
          {label: 'The Board’s: let it choose on Thursday between Noor’s and the draft', why: 'A legal question goes to counsel, not to a vote.'},
          {label: 'Neither: drop section 7, and leave the law to counsel’s own review', why: 'Then the policy no longer says who answers legal questions. Keep Noor’s.'}]}];

/* ---------- The directive (game; Wednesday 11:30): a permanent exception, "because it's always been this way" ---------- */
const CH_POL_DIRECTIVE = [
  {label: 'Not as a permanent one: the exception is yours to decide and sign, with an expiry, a review and a control', good: true},
  {label: 'Grant it permanently: it has always been this way, and you keep the register', why: 'An exception has an expiry, and its owner signs it. A difference meant to last goes to STD-5’s review.'},
  {label: 'Refuse it outright: an old PC like that is unacceptable, and it comes off the network', why: 'An absolute, and not your decision: the PC is the Library’s. There is a route: an exception with a control, or STD-5’s review.'},
  {label: 'Grant the exception yourself for a year, with the segment as its control', why: 'You write it up and recommend. Its owner decides and signs; you never grant one.'},
  {label: 'Send it to the Board to decide, as the Library’s own request', why: 'The Board decides nothing for a member; it sees every exception. The Library’s Director decides for the Library.'}];

/* ---------- The Policy terminals (Edda's; three puzzles) ---------- */
const CH_POL_DOJO = [
  {q: 'An exception starts on Day 80, a Wednesday, for the longest the policy allows: 12 months, counted as 365 days. When does it expire?',
   opts: ['Day 445, a Thursday',
          'Day 445, a Wednesday',
          'Day 444, a Wednesday'], good: 0,
   explain: '365 days is 52 weeks and one day: Day 445, one weekday on from Wednesday. Day 444 counts Day 80 as one of the 365; the rule counts 365 days later, so the longest is Day 445.'},
  {q: 'The Board chose not to fund a line, so an account stays excepted from MFA for a year. Who approves the exception?',
   opts: ['The Board, in its minute: its owner signs for running the control',
          'Its owner alone, who runs the control and the account in that service',
          'The CISO, who keeps the exception register and checks it'], good: 0,
   explain: 'The choice was the Board’s, so the Board approves it in its minute, and the owner signs for the control. Otherwise the CISO’s check decides: a standard one, its owner decides and signs; an escalated one, the chair. The CISO never approves one.',
   // Round 2 of the same terminal (6.2a): an escalated exception.
   then: {q: 'Its owner signs; the CISO recommends against. Who decides?',
     opts: ['The Board’s chair, for the Board, within five working days',
            'Its owner: the signature is its approval, the CISO’s advice beside it',
            'The CISO, who recommended against it and keeps the register'], good: 0,
     explain: 'A CISO’s “against” escalates it (6.2a): the chair decides for the Compact’s services, a member’s own leadership for its own. One decider, and never the CISO.'}},
  {q: 'Gap: a shared mailbox excepted from MFA, so a stolen password would sign in. Control: an alert on any sign-in from outside the country. Covered?',
   opts: ['No: a stolen password used inside the country raises nothing',
          'Yes: a sign-in from abroad pages the on-call lead within a minute',
          'Covered once the alert has been tested and has fired once'], good: 0,
   explain: 'Measure the control against the gap, not against the threat you picture. The gap is any sign-in with the password, from anywhere.'}];

/* ---------- The Compact Board's Policy round (Thursday 14:00; Ivor Penhallow; three rounds) ---------- */
const CH_POL_BOARD_SPECS = () => [
  {title: 'Round 1: what we approve', who: 'Ivor Penhallow',
   ask: '“What are we approving today: the policy, or every standard under it too?”',
   resp: [{label: 'The policy: I issue the standards under it, each with an owner and a review date', good: true},
          {label: 'Every standard too: the Board signs each rule, and each change to it, before it applies', why: 'The Board governs the programme and approves its policy. The standards under it are the CISO’s to issue, and the Board sees each one.'},
          {label: 'Nothing: a policy is the CISO’s own, and it is only read here', why: 'Monday’s lifecycle: the Board approves the policy, and the CISO issues the standards under it. (NIST’s example asks for approval from senior management; for the Compact, the Board holds that.)'},
          {label: 'The members’ own rules as well: the Board decides them for the six', why: 'The Board decides nothing for a member. Each member’s owner decides for its own.'}]},
  {title: 'Round 2: the register', who: 'Ivor Penhallow',
   ask: '“The register says what we carry. Will you tell us what is in it?”',
   resp: [{label: 'Yes: each one’s owner, dates and control, and any past its expiry', good: true},
          {label: 'Yes: that each one is in order, as no owner has raised a problem with it at review', why: 'Silence is not a review. Say what the register shows, dates and all.'},
          {label: 'The count only: fewer exceptions, and fewer controls to check', why: 'A count hides which ones matter. Each one’s owner, dates and control do not.'},
          {label: 'No: exceptions are their owners’ to review, not this room’s', why: 'The Board sees every exception at its quarterly meeting. That is the rule.'}]},
  {title: 'Round 3: the town’s list', who: 'Ivor Penhallow',
   ask: '“The town’s policy said ‘all’, and its list had no approver, no expiry and no review. What stops that here?”',
   resp: [{label: 'The register: each owned, dated and checked, and read at this Board each quarter', good: true},
          {label: 'A stricter policy that allows no exceptions of any kind, and leaves no list to read', why: 'Then the exceptions happen anyway, off the record: a list nobody approved.'},
          {label: 'The directory: it takes an account out of the group by itself when its date passes', why: 'It doesn’t: board-display still signed in on Monday. The register’s dates do it, if someone reads them.'},
          {label: 'Counsel: Noor reads every exception before its owner signs it, word by word', why: 'Noor answers legal questions. An exception is its owner’s to decide, and the register is read here.'}]}];
