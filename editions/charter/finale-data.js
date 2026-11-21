/* ============================================================
   UPTIME · editions/charter/finale-data.js
   Charter's finale: a material incident and the disclosure clock (Days 92 to
   95). Wellhollow Backup, the Compact's tier-1 off-site backup supplier, tells
   the Compact of an incident on its service. Told only through the Compact's
   records: Wellhollow's notices as received, the Compact's own logs, times,
   decisions, notices and outcomes. Nothing here says how Wellhollow's side was
   reached, and nothing is said about Wellhollow's cause.
   The game's notification rules (CH_FIN_RULES), the events they start from,
   the facts packets (three checkpoints, every row with one supported wording
   and weak ones), the records they cite, three drills whose evidence is
   records, the decision log (one decider each), the containment choice, the
   send choices, the directive, the Disclosure terminals (the real cases, as the
   court record and the SEC's own releases state them) and the Board's standing
   questions.
   One decider per decision: Edda pauses the copies (the shared platform);
   counsel decides any legal duty to notify (Noor for the town and the shared
   services; each member's own counsel for that member); the chair decides the
   Compact's statement, on counsel's and communications' advice; each member's
   leadership decides what happens to its own data; the CISO decides what each
   packet says, and never decides disclosure.
   Every record, count, time, rule and wording is invented (game) unless cited
   in CREDITS.md ("Facts used in Charter, the finale"). Timeline:
   docs/design/charter-timeline.md (slice 5); every line is checked against it.
   ============================================================ */
'use strict';

const CH_FIN_DAY = {92: 'Monday', 93: 'Tuesday', 94: 'Wednesday', 95: 'Thursday'};

/* ---------- The events the rules start from (game times) ---------- */
const CH_FIN_EVENTS = {
  detected: {name: 'Wellhollow’s detection, as its notice states it', at: [91, '22:47']},
  notice: {name: 'Wellhollow’s notice with our named security contact', at: [92, '06:10']},
  log: {name: 'the incident log’s first entry', at: [92, '06:25'], when: f => !!f.chFinLog},
  determination: {name: 'Noor’s determination, for the town and the shared services', at: [93, '15:00'], when: f => !!f.chFinDetermine}};

/* ---------- The Compact's notification rules (game wording; no law is named or stated) ---------- */
const CH_FIN_RULES = [
  {id: 'N-1', name: 'Facts to counsel and the chair', trigger: 'log', window: {h: 4}, startsAt: 'the incident log’s first entry',
   text: 'The CISO gives counsel and the chair the facts known, what is not known, and the records behind each, within 4 hours of the incident log’s first entry, then at each checkpoint counsel sets.',
   decider: 'the CISO supplies the facts; counsel and the chair receive them', done: fin => fin.packets.P1 && fin.packets.P1.sent ? fin.packets.P1.sent.at : null},
  {id: 'N-2', name: 'Members told', trigger: 'log', window: {h: 24}, startsAt: 'the incident log’s first entry',
   text: 'Each member’s representative and its own counsel are told, within 24 hours of the incident log’s first entry, that the member’s data may be involved.',
   decider: 'the chair tells them, the CISO and Noor beside him', done: (fin, f) => f.chFinMembers ? chAt(92, '11:00') : null},
  {id: 'N-3', name: 'Notice to the people affected', trigger: 'determination', window: {wd: 10}, startsAt: 'a member’s counsel’s determination (for the town: Noor’s)',
   text: 'Where a member’s counsel determines that personal records held for that member were, or may have been, acquired by someone not authorised, that member’s notice to the people affected goes out within 10 working days of its counsel’s determination, unless a law-enforcement agency asks in writing for a delay.',
   decider: 'each member’s own counsel, for its own member (the town: Noor)', done: () => null},
  {id: 'N-4', name: 'The Compact’s statement', trigger: null, window: {}, startsAt: 'no clock of its own',
   text: 'The chair decides any public statement by the Compact, on counsel’s and communications’ advice, before any member’s notice goes out.',
   decider: 'the chair, on Noor’s and Ada’s advice', done: () => null}];

/* ---------- The comparison card [fact]: quoted from the SEC's final rule and fact sheet (CREDITS.md) ---------- */
const CH_FIN_SEC_HTML = '<h3>How a US public company would be timed (comparison only)</h3>' +
  '<p class="small">Not the Compact’s rule: the Compact is a public authority, not an SEC registrant. For comparison only.</p>' +
  '<ul class="small"><li>Form 8-K, General Instruction B.1: “A report pursuant to Item 1.05 is to be filed within four business days after the registrant determines that it has experienced a material cybersecurity incident.”</li>' +
  '<li>Instruction 1 to Item 1.05: “A registrant’s materiality determination regarding a cybersecurity incident must be made without unreasonable delay after discovery of the incident.”</li>' +
  '<li>Item 1.05(c): disclosure may be delayed only “if the United States Attorney General determines that disclosure required by paragraph (a) of this Item 1.05 poses a substantial risk to national security or public safety, and notifies the Commission of such determination in writing”.</li>' +
  '<li>Who decides: “the registrant”. The rule names no officer, and the clock starts at the determination, not at discovery.</li></ul>' +
  '<p class="small">SEC, Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure, final rule, Release No. 33-11216 (effective 5 September 2023), Federal Register, 4 August 2023.</p>';

/* ---------- The records the packets cite (game). Each with its time ---------- */
const CH_FIN_RECORDS = {
  NOT: {name: 'Wellhollow’s notice, as received', at: [92, '06:10']},
  LOGI: {name: 'The incident log, from its first entry', at: [92, '06:25']},
  JOB: {name: 'The copy job’s scope and log, exported', at: [92, '08:05']},
  DFR: {name: 'The data-flow record', at: [71, '08:30']},
  EDG: {name: 'The edge log, 35 days', at: [92, '08:30']},
  ACL: {name: 'The account lists', at: [92, '08:30']},
  CON: {name: 'Wellhollow’s contract, on the supplier register (C1, C2, C7)', at: [71, '10:30']},
  MEM: {name: 'The members’ call, as recorded', at: [92, '11:00']},
  WH2: {name: 'Wellhollow’s second answer', at: [93, '09:00']},
  JB2: {name: 'The copy job’s target store, night by night', at: [93, '09:40']},
  RST: {name: 'The test restore from our local copies', at: [93, '12:10']},
  DET: {name: 'Noor’s determination, as recorded', at: [93, '15:00']}};

/* ---------- The facts packets. Each row: req (required), unknown (what is not known, a required row), rec ('in' or
   'out' for optional rows); every variant cites as many records as the supported one; grade and why for the debrief ---------- */
const CH_FIN_PACKETS = [
  {id: 'P1', title: 'Facts packet 1 · to Noor and the chair', due: [92, '10:25'], dueRule: 'N-1', openItem: true,
   head: 'Facts packet 1, for Noor and the chair, under N-1: records to Day 92 09:20.',
   intro: 'Monday, 09:30. What is known, what is not, since when, and from which record. N-1 is due at 10:25.',
   rows: [
    {id: 'K1', name: 'Wellhollow’s notice', topic: 'what Wellhollow’s notice says', req: true,
     variants: [
       {label: 'Wellhollow’s notice at 06:10: an incident on its backup service, detected 22:47 on Day 91, being investigated', good: true, grade: 'supported', refs: ['NOT', 'LOGI'],
        why: 'The notice, in its own words and with its own times, attributed to Wellhollow.'},
       {label: 'Wellhollow’s notice, with us at 06:10: an attack on its backup service that took our copies, at 22:47 on Day 91', grade: 'overstated', refs: ['NOT', 'LOGI'],
        why: 'The notice says whether copies were read or copied is not yet known. “Took our copies” says more.'},
       {label: 'Wellhollow’s notice, with us at 06:10: an incident on its backup service on Day 91, contained at 22:47 that night', grade: 'unsupported', refs: ['NOT', 'LOGI'],
        why: 'No record says it was contained. 22:47 is when Wellhollow says it detected it.'},
       {label: 'Wellhollow’s notice, with us at 06:10: Wellhollow deciding at 22:47 on Day 91 that no customer need tell anyone', grade: 'misplaced', refs: ['NOT', 'CON'],
        why: 'Whether anyone must be told is each member’s counsel’s decision, not Wellhollow’s, and the notice says nothing of it.'}]},
    {id: 'K2', name: 'What Wellhollow holds of ours', topic: 'what Wellhollow holds of the Compact’s', req: true,
     variants: [
       {label: 'Wellhollow holds 35 nights of copies of every member’s file shares, records included, by our own records', good: true, grade: 'supported', refs: ['DFR', 'JOB'],
        why: 'Our own records: the data-flow record and the copy job’s scope.'},
       {label: 'What Wellhollow holds of ours: not known until Wellhollow says, its notice naming no one’s copies at 06:10', grade: 'unsupported', refs: ['NOT', 'DFR'],
        why: 'Our own records say it: the data-flow record and the copy job’s scope. “Not known” is for what no record shows.'},
       {label: 'Wellhollow holds every record any member has kept, for each year from the start of its contract, by the data-flow record', grade: 'overstated', refs: ['DFR', 'JOB'],
        why: '“Every record, each year” where the job keeps 35 nights of the file shares.'}]},
    {id: 'K3', name: 'Whether our copies were read or copied', topic: 'whether the Compact’s copies were read or copied', req: true, unknown: true,
     variants: [
       {label: 'Whether our copies were read or copied: not known at 09:20, the notice saying Wellhollow does not know yet', good: true, grade: 'supported', refs: ['NOT', 'LOGI'],
        why: 'What is not known, stated as not known, with since when and from which record. Counsel needs it as much as any fact.'},
       {label: 'Whether our copies were read or copied: not known at 09:20, and to be treated as no until Wellhollow says', grade: 'overstated', refs: ['NOT', 'LOGI'],
        why: 'What is not known is not “no”. Treating it as no until told otherwise is silence read as an answer.'},
       {label: 'Whether our copies were read or copied: yes, in all likelihood, at 09:20, our copies sitting on that system', grade: 'overstated', refs: ['NOT', 'JOB'],
        why: '“Likely” stated as a finding. The notice says it is not yet known.'},
       {label: 'Whether our copies were read or copied: no, at 09:20, on Wellhollow’s word to our on-call lead at 06:15', grade: 'unsupported', refs: ['NOT', 'LOGI'],
        why: 'No record holds such a word. At 06:15 the on-call lead phoned you, not Wellhollow.'}]},
    {id: 'K4', name: 'Our own systems', topic: 'whether anything from Wellhollow reached the Compact’s systems', req: true,
     variants: [
       {label: 'Into our systems from Wellhollow: nothing in 35 days on the edge log, no Wellhollow account at 08:30', good: true, grade: 'supported', refs: ['EDG', 'ACL'],
        why: 'The edge log and the account lists, each with its time.'},
       {label: 'Into our systems from Wellhollow: nothing in 35 days, and nothing can ever come in from its incident', grade: 'overstated', refs: ['EDG', 'ACL'],
        why: 'A promise beyond the records: they show 35 days, not what never will.'},
       {label: 'Into our systems from Wellhollow: one sign-in from its range at 22:40 on Day 91, on the edge log at 08:30', grade: 'unsupported', refs: ['EDG', 'ACL'],
        why: 'The edge log shows nothing in from Wellhollow’s range: only our nightly copies going out.'},
       {label: 'Into our systems from Wellhollow: nothing, Edda having decided at 08:30 that the incident is not ours', grade: 'misplaced', refs: ['EDG', 'ACL'],
        why: 'Whether the incident touches the town or a member for any notice is counsel’s question. Edda decides the platform.'}]},
    {id: 'K5', name: 'Containment', topic: 'what was done to contain it', req: true,
     variants: [
       {label: 'Copies to Wellhollow paused at 07:40, Edda’s decision on my recommendation, the job log exported at 08:05', good: true, grade: 'supported', refs: ['JOB', 'LOGI'],
        why: 'Who decided, on whose recommendation, and what was kept, from the log.'},
       {label: 'Copies to Wellhollow paused at 07:40 on my own decision, Edda carrying it out, the job log exported at 08:05', grade: 'misplaced', refs: ['JOB', 'LOGI'],
        why: 'The shared platform is Edda’s: she decided, on your recommendation.'},
       {label: 'Copies to Wellhollow paused at 07:40, our members’ data out of reach from here on, the job log exported at 08:05', grade: 'overstated', refs: ['JOB', 'LOGI'],
        why: 'Pausing new copies does nothing for the 35 nights already at Wellhollow.'},
       {label: 'Copies to Wellhollow paused at 07:40, once Wellhollow had cleared it with us, the job log exported at 08:05', grade: 'unsupported', refs: ['JOB', 'LOGI'],
        why: 'No record of any clearance, and none was needed: the pause is ours.'}]},
    {id: 'K6', name: 'The contract’s clock', topic: 'the contract’s notice clock', req: false, rec: 'in',
     variants: [
       {label: 'Wellhollow’s notice inside its 24-hour clause: detected 22:47 on Day 91, with our contact 06:10, 7 hours 23 minutes', good: true, grade: 'supported', refs: ['CON', 'NOT'],
        why: 'C1’s own clock: from its stated detection to our named contact.'},
       {label: 'Wellhollow’s notice outside its 24-hour clause: detected 22:47 on Day 91, with our contact 06:10, 31 hours 23 minutes', grade: 'unsupported', refs: ['CON', 'NOT'],
        why: '22:47 to 06:10 the next morning is 7 hours 23 minutes.'},
       {label: 'Wellhollow’s notice inside its clause, at 7 hours 23 minutes, and its handling of the rest to be trusted too', grade: 'overstated', refs: ['CON', 'NOT'],
        why: 'A notice on time says nothing about the rest of its handling.'}]}]},
  {id: 'P2', title: 'Facts packet 2 · to Noor', due: [93, '14:00'], dueRule: 'Noor’s checkpoint (N-1)',
   head: 'Facts packet 2, for Noor, at her checkpoint: records to Day 93 13:20.',
   intro: 'Tuesday, 13:30. Noor’s checkpoint is 14:00. What has changed since Monday, and what is still not known.',
   rows: [
    {id: 'L1', name: 'Wellhollow’s second answer', topic: 'what Wellhollow’s second answer says', req: true,
     variants: [
       {label: 'Wellhollow’s answer at 09:00: files on one of its stores copied out, 21:58 to 22:40 on Day 91, whose files not yet named', good: true, grade: 'supported', refs: ['WH2', 'NOT'],
        why: 'The answer, in its own words and times, attributed to Wellhollow.'},
       {label: 'Wellhollow’s answer at 09:00: our files copied out of its store, 21:58 to 22:40 on Day 91, by its own account', grade: 'overstated', refs: ['WH2', 'NOT'],
        why: 'The answer says whose files is not yet known. “Our files” says more.'},
       {label: 'Wellhollow’s answer at 09:00: nothing copied out of any store, 21:58 to 22:40 on Day 91, by its own account', grade: 'unsupported', refs: ['WH2', 'NOT'],
        why: 'The answer says the opposite: files on one store were copied out.'},
       {label: 'Wellhollow’s answer at 09:00: files on one store copied out on Day 91, Wellhollow telling our members’ people itself', grade: 'misplaced', refs: ['WH2', 'NOT'],
        why: 'Any notice to a member’s people is that member’s decision, on its own counsel’s advice.'}]},
    {id: 'L2', name: 'Our copies on that store', topic: 'whether the Compact’s copies are on that store', req: true,
     variants: [
       {label: 'On that store: every night’s copy from Day 58 to Day 92, 35 nights, by our own job log at 09:40', good: true, grade: 'supported', refs: ['JB2', 'WH2'],
        why: 'Our own job log names the store for each night.'},
       {label: 'On that store: every copy the Compact has ever made, of every member, by our own job log at 09:40', grade: 'overstated', refs: ['JB2', 'WH2'],
        why: '“Ever made” where the log shows 35 nights.'},
       {label: 'On that store: none of ours, Wellhollow’s answer at 09:00 naming other customers’ copies', grade: 'unsupported', refs: ['WH2', 'JB2'],
        why: 'The answer names no customer, and our own job log puts every night’s copy on that store.'}]},
    {id: 'L3', name: 'Ours among the files copied out', topic: 'whether the Compact’s copies were among the files copied out', req: true, unknown: true,
     variants: [
       {label: 'Ours among the files copied out: not known at 13:20, Wellhollow still working out whose they were', good: true, grade: 'supported', refs: ['WH2', 'JB2'],
        why: 'What is not known, stated as not known, with since when and from which record.'},
       {label: 'Ours among the files copied out: yes at 13:20, every night’s copy from Day 58 on being on that store', grade: 'overstated', refs: ['WH2', 'JB2'],
        why: 'On the store is not the same as among the files copied out. Wellhollow does not know yet.'},
       {label: 'Ours among the files copied out: not known at 13:20, but no, nothing in our own logs pointing that way', grade: 'overstated', refs: ['WH2', 'JB2'],
        why: 'Our logs can’t see Wellhollow’s store. An absence on our side says nothing about theirs.'}]},
    {id: 'L4', name: 'Members told', topic: 'whether each member has been told', req: true,
     variants: [
       {label: 'Each member’s representative and counsel told 11:00 Monday, each counsel deciding for its member', good: true, grade: 'supported', refs: ['MEM', 'NOT'],
        why: 'N-2, met, and each member’s counsel deciding for its own member.'},
       {label: 'Each member’s representative and counsel told at 11:00 on Monday, Noor deciding any notice for every one of them', grade: 'misplaced', refs: ['MEM', 'NOT'],
        why: 'Noor decides for the town and the shared services. Each member’s own counsel decides for that member.'},
       {label: 'Each member’s representative told at 09:30 on Tuesday, once Wellhollow’s answer at 09:00 had settled it', grade: 'unsupported', refs: ['MEM', 'WH2'],
        why: 'The call record says Monday 11:00, and nothing is settled.'}]},
    {id: 'L5', name: 'Restore readiness', topic: 'whether the Compact can restore from its own copies', req: false, rec: 'in',
     variants: [
       {label: 'Our local copies intact: a test restore of the Clinic’s share good at 12:10, the other shares not yet tried', good: true, grade: 'supported', refs: ['RST', 'JB2'],
        why: 'One restore tried, and the rest named as not yet tried.'},
       {label: 'Every member’s data restorable from our local copies within the hour, the restore at 12:10 proving it', grade: 'overstated', refs: ['RST', 'JB2'],
        why: 'One share restored is a sample, not every member, and not a time.'},
       {label: 'Our local copies paused with the job at 07:40 on Monday, the restore at 12:10 made from Wellhollow’s copy', grade: 'unsupported', refs: ['RST', 'JB2'],
        why: 'Only the copies to Wellhollow were paused, and the restore came from our own.'}]}]},
  {id: 'P3', title: 'Facts packet 3 · for the Compact’s statement', due: [94, '11:00'], dueRule: 'the chair’s request (N-4)',
   head: 'Facts packet 3, for the chair, Noor and Ada, for the Compact’s statement: records to Day 94 09:30. No personal details.',
   intro: 'Wednesday, 09:30. The chair decides the statement at 12:00, on Noor’s and Ada’s advice, and asked for the facts by 11:00. Plain words, no personal details.',
   rows: [
    {id: 'M1', name: 'What happened', topic: 'what happened, in plain words', req: true,
     variants: [
       {label: 'On Day 92 our backup supplier told us of an incident on its service, which holds copies of our members’ records', good: true, grade: 'supported', refs: ['NOT', 'WH2'],
        why: 'What the supplier told us, and what it holds, in plain words.'},
       {label: 'On Day 92 our backup supplier told us its service had been breached and every one of our members’ records stolen', grade: 'overstated', refs: ['NOT', 'WH2'],
        why: 'Whose files were copied out is not known. “Our records stolen” says more than any record.'},
       {label: 'On Day 92 our backup supplier told us of an incident on its service, resolved that night, with no records of ours affected', grade: 'unsupported', refs: ['NOT', 'WH2'],
        why: 'No record says resolved, or no records affected.'}]},
    {id: 'M2', name: 'What is not known', topic: 'what is not yet known', req: true, unknown: true,
     variants: [
       {label: 'Not yet known: whether our members’ copies were among the files taken from the supplier’s store', good: true, grade: 'supported', refs: ['WH2', 'JOB'],
        why: 'The open question, stated as open.'},
       {label: 'Not yet known: how the files were taken, though no resident’s record has been misused anywhere', grade: 'overstated', refs: ['WH2', 'JOB'],
        why: 'Nothing on our side can show that no record has been misused.'},
       {label: 'Not yet known: nothing of note, the supplier and the Compact having all of the facts in hand already', grade: 'unsupported', refs: ['WH2', 'JOB'],
        why: 'The records say whose files is still not known.'}]},
    {id: 'M3', name: 'What we did', topic: 'what the Compact did', req: true,
     variants: [
       {label: 'We stopped sending copies to the supplier on Day 92 and told each member the same morning', good: true, grade: 'supported', refs: ['JOB', 'MEM'],
        why: 'The pause and the members’ call, from the records.'},
       {label: 'We stopped sending copies to the supplier on Day 92, and every member’s data is secure from here on', grade: 'overstated', refs: ['JOB', 'MEM'],
        why: 'The copies already at the supplier are where they were.'},
       {label: 'We stopped sending copies on Day 92, and the Compact has decided that no resident needs telling', grade: 'misplaced', refs: ['JOB', 'MEM'],
        why: 'Each member’s counsel decides any notice to its people. The Compact decides nothing for a member.'}]},
    {id: 'M4', name: 'Who decides notice', topic: 'who decides any notice', req: true,
     variants: [
       {label: 'Each member’s own counsel decides any notice to its people, and our chair decided this statement', good: true, grade: 'supported', refs: ['DET', 'MEM'],
        why: 'One decider each, as the rules name them.'},
       {label: 'The Compact decides any notice to the people of every member, and our chair decided this statement', grade: 'misplaced', refs: ['DET', 'MEM'],
        why: 'Each member’s own counsel decides for that member.'},
       {label: 'Our security lead decides any notice to members’ people, counsel advising, and our chair decided this statement', grade: 'misplaced', refs: ['DET', 'MEM'],
        why: 'The CISO supplies the facts and decides no notice.'}]},
    {id: 'M5', name: 'The supplier’s cause', topic: 'the supplier’s cause', req: false, rec: 'out',
     variants: [
       {label: 'What caused the supplier’s incident is for the supplier to say', good: true, grade: 'supported', refs: ['WH2', 'NOT'],
        why: 'Another party’s root cause is its own to state.'},
       {label: 'The supplier’s weak sign-in controls caused its incident', grade: 'overstated', refs: ['WH2', 'NOT'],
        why: 'A claim about another party’s root cause, with no record behind it.'},
       {label: 'The supplier told us a member of its staff caused its incident', grade: 'unsupported', refs: ['WH2', 'NOT'],
        why: 'Neither of its answers says so.'}]}]}];

/* ---------- Sending a packet: to whom and when (the CISO's choice, recorded as sent) ---------- */
// at: when the packet reaches counsel (or, for packet 3, the chair). The first option is the recommended one.
const CH_FIN_SEND = {
  P1: [
    {label: 'Send it to Noor and the chair at 10:00, open questions included', good: true, at: [92, '10:00'], to: 'Noor and the chair'},
    {label: 'Hold it past 10:25 for Wellhollow’s answers, and send Noor the whole picture then', at: [93, '09:10'], to: 'Noor and the chair, on Tuesday',
     why: 'N-1 runs from the log’s first entry, not from Wellhollow’s answers. Counsel needs what is known now, and what is not.'},
    {label: 'Send it to the chair alone at 10:00, and leave it to him to brief Noor', at: [92, '11:40'], to: 'the chair, who passed it to Noor at 11:40',
     why: 'N-1 names counsel and the chair. The facts go to counsel directly, not through anyone.'}],
  P2: [
    {label: 'Send it to Noor at 13:45, whose files still an open question in it', good: true, at: [93, '13:45'], to: 'Noor'},
    {label: 'Hold it past 14:00 until Wellhollow says whose files were copied out', at: [93, '16:30'], to: 'Noor, at the end of the day',
     why: 'Noor set 14:00. What is not known goes in, stated as not known; waiting does not make the packet truer.'},
    {label: 'Send it to Edda at 13:45, for her to check and pass on to Noor', at: [93, '15:20'], to: 'Edda, who passed it to Noor at 15:20',
     why: 'The packet is yours, and it goes to counsel. Edda decides the platform, not what counsel reads.'}],
  P3: [
    {label: 'Send it to the chair, Noor and Ada at 10:00, the statement the chair’s', good: true, at: [94, '10:00'], to: 'the chair, Noor and Ada'},
    {label: 'Send it to Ada at 10:00 to publish, the facts in it being ours to state', at: [94, '11:15'], to: 'Ada, who took it to the chair at 11:15',
     why: 'The chair decides the statement. Ada advises on it and drafts it; she does not publish facts on her own.'},
    {label: 'Hold it past noon for Wellhollow’s next answer, then send it to the chair', at: [94, '14:30'], to: 'the chair, after the statement was decided',
     why: 'The chair asked for the facts by 11:00 and decided at 12:00 without them.'}]};

/* ---------- The decision log (Monday 14:00): six decisions, one decider each ---------- */
const CH_FIN_DECISIONS = [
  {id: 'D-1', short: 'Pausing the nightly copies to Wellhollow', who: 'Edda Thornquist'},
  {id: 'D-2', short: 'Whether the town and the shared services must notify anyone', who: 'Noor Castellanos'},
  {id: 'D-3', short: 'Whether the Clinic must notify its patients', who: 'The Clinic’s own counsel'},
  {id: 'D-4', short: 'The Compact’s public statement', who: 'Ivor Penhallow, the chair'},
  {id: 'D-5', short: 'Whether the Library’s data goes back into the off-site copies, and with whom', who: 'Director Mina Strand'},
  {id: 'D-6', short: 'What the facts packets say', who: 'You, the CISO'}];
// Each decision's choices (literal lists, so the scanner reads every scored list): four of the six deciders each time,
// in a cycle, so each decider is offered four times and is right once.
const CH_FIN_ROUTE = [
  {decision: 'D-1', choices: [
    {label: "Edda Thornquist, the shared platform’s director", good: true},
    {label: "Noor Castellanos, counsel for the town and the shared services", why: "Noor decides the legal questions for the town and the shared services. This one is Edda’s."},
    {label: "The Clinic’s own counsel, for the Clinic", why: "The Clinic’s counsel decides the legal questions for the Clinic. This one is Edda’s."},
    {label: "Ivor Penhallow, the chair, on Noor’s and Ada’s advice", why: "The chair decides the Compact’s statement and chairs the Board. This one is Edda’s."}]},
  {decision: 'D-2', choices: [
    {label: "Noor Castellanos, counsel for the town and the shared services", good: true},
    {label: "The Clinic’s own counsel, for the Clinic", why: "The Clinic’s counsel decides the legal questions for the Clinic. This one is Noor’s."},
    {label: "Ivor Penhallow, the chair, on Noor’s and Ada’s advice", why: "The chair decides the Compact’s statement and chairs the Board. This one is Noor’s."},
    {label: "Director Mina Strand, for the Library", why: "Director Strand decides for the Library. This one is Noor’s."}]},
  {decision: 'D-3', choices: [
    {label: "The Clinic’s own counsel, for the Clinic", good: true},
    {label: "Ivor Penhallow, the chair, on Noor’s and Ada’s advice", why: "The chair decides the Compact’s statement and chairs the Board. This one is the Clinic’s counsel’s."},
    {label: "Director Mina Strand, for the Library", why: "Director Strand decides for the Library. This one is the Clinic’s counsel’s."},
    {label: "You, the CISO, who keep the facts", why: "You decide what your packets say, and advise everyone else. This one is the Clinic’s counsel’s."}]},
  {decision: 'D-4', choices: [
    {label: "Ivor Penhallow, the chair, on Noor’s and Ada’s advice", good: true},
    {label: "Director Mina Strand, for the Library", why: "Director Strand decides for the Library. This one is the chair’s."},
    {label: "You, the CISO, who keep the facts", why: "You decide what your packets say, and advise everyone else. This one is the chair’s."},
    {label: "Edda Thornquist, the shared platform’s director", why: "Edda decides the shared platform and how it runs. This one is the chair’s."}]},
  {decision: 'D-5', choices: [
    {label: "Director Mina Strand, for the Library", good: true},
    {label: "You, the CISO, who keep the facts", why: "You decide what your packets say, and advise everyone else. This one is Director Strand’s."},
    {label: "Edda Thornquist, the shared platform’s director", why: "Edda decides the shared platform and how it runs. This one is Director Strand’s."},
    {label: "Noor Castellanos, counsel for the town and the shared services", why: "Noor decides the legal questions for the town and the shared services. This one is Director Strand’s."}]},
  {decision: 'D-6', choices: [
    {label: "You, the CISO, who keep the facts", good: true},
    {label: "Edda Thornquist, the shared platform’s director", why: "Edda decides the shared platform and how it runs. This one is yours."},
    {label: "Noor Castellanos, counsel for the town and the shared services", why: "Noor decides the legal questions for the town and the shared services. This one is yours."},
    {label: "The Clinic’s own counsel, for the Clinic", why: "The Clinic’s counsel decides the legal questions for the Clinic. This one is yours."}]}
];

/* ---------- Containment (Monday 07:20, Edda's desk) ---------- */
const CH_FIN_CONTAIN = [
  {label: 'Pause the copies to Wellhollow, the job log and our local copies kept as they are', good: true},
  {label: 'Export the job log first, then pause the copies once it is kept elsewhere', why: 'Pausing the copies destroys nothing: the job log stays where it is. Pause now, export after.'},
  {label: 'Keep the copies running until Wellhollow says whether its store is sound', why: 'Containment is not delayed for a supplier’s answer when pausing costs no evidence.'},
  {label: 'Delete the copies Wellhollow holds, with our upload key, before anyone reads them', why: 'That destroys what counsel and Wellhollow need, and it is not ours to do on its side.'}];
// Opening the incident log (Monday 06:15): the first entry is the clock's start.
const CH_FIN_LOGOPEN = [
  {label: 'Open the incident log at 06:25, with the notice as its first record', good: true},
  {label: 'Open it at 08:45 with the office, when everyone is in to agree it is an incident', why: 'The notice is in. The log starts now: a clock that starts late is still late.'},
  {label: 'Open it once Wellhollow confirms our copies are involved, and not before', why: 'The log records what is known as it becomes known. Waiting for a supplier keeps counsel waiting too.'}];

/* ---------- Drills (Monday and Tuesday). Records are the evidence; two decisive sources each ---------- */
const CH_FIN_DRILLS = {
  finhold: {
    id: 'finhold', title: 'What does Wellhollow hold of ours?', budget: 3,
    intro: '<p>Wellhollow’s notice says a storage system holding copies for several customers, the Compact among them, is under investigation. What does Wellhollow hold of the Compact’s? Edda has the data-flow record and the copy job.</p>',
    artefact: '<pre class="art">Wellhollow · notice to customers (as received 06:10, game data)\n' +
      '“an incident on our off-site backup service,\n' +
      ' detected at 22:47 on Day 91 … copies for\n' +
      ' several customers, the Compact among them …\n' +
      ' whether customer copies were read or copied\n' +
      ' is not yet known”</pre>' +
      '<p class="small">What a supplier holds of ours is read from our own records, not from its notice.</p>',
    question: 'What does Wellhollow hold of ours?',
    sources: [
      {id: 'notice', name: 'Wellhollow’s notice', qs: [
        {q: 'Whose copies does it name?', kind: 'trap', res: ['“Copies for several customers, the Compact among them.”', '(Whose, not what.)']}]},
      {id: 'contract', name: 'Wellhollow’s contract', qs: [
        {q: 'What does it say Wellhollow keeps?', kind: 'trap', res: ['C7: “At the end, return the Compact’s data and delete every copy, confirmed in writing.”', '(What happens at the end, not what is held now.)']}]},
      {id: 'dataflow', name: 'The data-flow record (Day 71 08:30)', qs: [
        {q: 'What goes to Wellhollow?', kind: 'focus', key: true,
         res: ['Wellhollow Backup: copies of every member’s file shares, records included', 'Kinds of records: staff pay and bank details, patients’, students’ and patrons’ records', 'No Wellhollow account on our side']}]},
      {id: 'job', name: 'The copy job (cp-backup on CP-OPS-02)', qs: [
        {q: 'What does it send, and how long is it kept?', kind: 'focus', key: true,
         res: ['Nightly at 01:00: every member’s file shares, to Wellhollow’s store', 'Kept at Wellhollow: 35 nights', 'Last run Day 92 01:00 to 01:42; paused 07:40']},
        {q: 'Every line of the job log', kind: 'broad', rows: 2900,
         wall: ['Day {i}  01:{t}  cp-backup  share {n}  sent', 'Day {i}  01:{t}  cp-backup  share {n}  verified', 'Day {i}  01:{t}  cp-backup  retention 35']}]}
    ],
    verdicts: [
      {label: 'Copies of every member’s file shares, records included, kept for five weeks', good: true, needs: ['dataflow', 'job'],
       needsWhy: 'the answer rests on two records: the data-flow record and the copy job. You read only one of them.',
       why: 'The data-flow record says what goes, and the job how much is kept: every member’s shares, 35 nights.'},
      {label: 'The Compact’s copies among several customers’, as the notice says, and no more than that', why: 'The notice says whose. Our own records say what.'},
      {label: 'Only what the contract names, and it names nothing of ours', why: 'The contract says what happens at the end. The records say what is held.'},
      {label: 'Everything any member has ever stored, for every year of its contract', why: 'The job keeps 35 nights of the file shares.'}],
    reasons: [
      {label: 'The data-flow record says what goes, and the job log how long it is kept', good: true, why: 'What, then how much.'},
      {label: 'The notice names the Compact, and a supplier’s notice is its record of what it holds', why: 'A notice says what the supplier is investigating.'},
      {label: 'The contract is the record of what a supplier may keep, and with it of what it keeps', why: 'May keep is not keeps.'}],
    alts: [
      {label: 'The job sends only the directory’s exports', good: true, why: 'Ruled out: the job’s scope is every member’s file shares.'},
      {label: 'Wellhollow keeps more than the job sets', good: true, why: 'Ruled out: the job sets 35 nights at Wellhollow.'},
      {label: 'The contract is out of date', why: 'Beside the point: the records decide what is held.'},
      {label: 'Wellhollow’s other customers are members', why: 'Nothing points to it: the notice says several customers.'}],
    path: '<p>“What does it hold of ours?” is decided by <b>the data-flow record</b> and <b>the copy job</b>. A notice says whose copies are involved; a contract says what happens at the end.</p>',
    response: ['Packet 1 says: 35 nights of copies of every member’s file shares, records included, from our own records', 'The kinds of records named, no person named', 'Edda keeps the job paused'],
    techs: [], acts: ['chfinhold']
  },
  finedge: {
    id: 'finedge', title: 'Has anything from Wellhollow reached our systems?', budget: 3,
    intro: '<p>Wellhollow has no account on our side, by the supplier register. Has anything from Wellhollow reached the Compact’s systems? Beatriz exported the account lists and the edge log at 08:30.</p>',
    artefact: '<pre class="art">Supplier register · Wellhollow (game data)\n' +
      'Holds      copies of every member’s data\n' +
      'Way in     none on our side</pre>' +
      '<p class="small">A register says what was set up. The logs say what happened.</p>',
    question: 'Has anything from Wellhollow reached our systems?',
    sources: [
      {id: 'register', name: 'The supplier register', qs: [
        {q: 'Does Wellhollow have a way in?', kind: 'trap', res: ['“No account on our side.”', '(What was set up, not what happened.)']}]},
      {id: 'word', name: 'Edda’s view', qs: [
        {q: 'Could anything have come in?', kind: 'trap', res: ['“They’ve no account. Nothing could.”', '(A view. The logs decide it.)']}]},
      {id: 'acl', name: 'The account lists (08:30)', qs: [
        {q: 'Any Wellhollow account, anywhere?', kind: 'focus', key: true,
         res: ['The shared directory: no Wellhollow account', 'CP-OPS-02: cp-backup sends to Wellhollow; no account receives from it', 'No key from Wellhollow on any server']}]},
      {id: 'edge', name: 'The edge log (35 days to 08:30)', qs: [
        {q: 'Anything in from Wellhollow’s range?', kind: 'focus', key: true,
         res: ['198.51.100.0/24, Wellhollow’s documented range: in, none in 35 days', 'Out: CP-OPS-02 to it nightly, 01:00 to 01:45, and nothing since 07:40 on Day 92']},
        {q: 'Every edge entry in 35 days', kind: 'broad', rows: 88000,
         wall: ['Day {i}  {t}  out  CP-OPS-02  198.51.100.{n}  443', 'Day {i}  {t}  in  denied  203.0.113.{n}', 'Day {i}  {t}  out  member PC  web']}]}
    ],
    verdicts: [
      {label: 'No: nothing came in from its range in five weeks, and it has no account with us', good: true, needs: ['acl', 'edge'],
       needsWhy: 'the answer rests on two records: the account lists and the edge log. You read only one of them.',
       why: 'No account to use, and nothing in from its range: our side shows only our copies going out.'},
      {label: 'No: the register says Wellhollow has no way in, and nothing could have reached us', why: 'The register says what was set up. The logs show what happened.'},
      {label: 'Yes: our copies went to its store every night, and that store is the one under investigation', why: 'Out is not in. Our copies going out is K2’s fact.'},
      {label: 'Not known, and not knowable from our side until Wellhollow reports on its own logs', why: 'Our own logs answer it for our side.'}],
    reasons: [
      {label: 'The account lists show no way in, and the edge log nothing in from its range', good: true, why: 'Who could, then what did.'},
      {label: 'A supplier with no account on the register can’t reach anything we run', why: 'A register is set up once; logs show each day.'},
      {label: 'Wellhollow would have told us in its notice if our systems had been reached', why: 'Its notice is about its side.'}],
    alts: [
      {label: 'A Wellhollow key sits on a server of ours', good: true, why: 'Ruled out: no key from Wellhollow on any server.'},
      {label: 'Its range reached us after the pause', good: true, why: 'Ruled out: nothing in from it in 35 days, and nothing out since 07:40.'},
      {label: 'Wellhollow uses a second range', why: 'Beside the point unless the contract names one; it names one.'},
      {label: 'cp-backup is a person’s account', why: 'Nothing points to it: non-interactive, from CP-OPS-02.'}],
    path: '<p>“Has anything reached us?” is decided by <b>the account lists</b> and <b>the edge log</b>. A register says what was set up; a view is a view.</p>',
    response: ['Packet 1 says: nothing in from Wellhollow in 35 days, and no Wellhollow account', 'The copies stay paused: Edda’s decision', 'Business terms in the packet; the hosts and the range are in the records'],
    techs: [], acts: ['chfinedge']
  },
  finclock: {
    id: 'finclock', title: 'When does N-3’s clock start for the town?', budget: 3,
    intro: '<p>N-3 gives a member ten working days for its notice to the people affected. For the town, when does its clock start? Noor has the rule and her determination of 15:00.</p>',
    artefact: '<pre class="art">The Compact’s notification rules · N-3 (game)\n' +
      '“… within 10 working days of its counsel’s\n' +
      ' determination …”</pre>' +
      '<p class="small">A clock starts where its rule says, not where anyone prefers.</p>',
    question: 'When does N-3’s clock start for the town?',
    sources: [
      {id: 'notice', name: 'Wellhollow’s notice', qs: [
        {q: 'When was it detected?', kind: 'trap', res: ['“Detected at 22:47 on Day 91.”', '(Wellhollow’s clock under its contract, not N-3’s.)']}]},
      {id: 'view', name: 'Marit’s view', qs: [
        {q: 'When should it start?', kind: 'trap', res: ['“When Wellhollow tells us whose files. Until then there’s nothing to count.”', '(A preference. The rule names its trigger.)']}]},
      {id: 'rule', name: 'The rule, N-3', qs: [
        {q: 'What starts its clock?', kind: 'focus', key: true, res: ['“… within 10 working days of its counsel’s determination …”', 'Counsel: for the town, Noor; for each member, its own counsel']}]},
      {id: 'det', name: 'Noor’s determination (15:00)', qs: [
        {q: 'What was determined, for whom, and when?', kind: 'focus', key: true,
         res: ['Day 93 15:00: personal records held for the town may have been acquired by someone not authorised', 'For the town and the shared services; each member’s counsel decides for its own member']}]}
    ],
    verdicts: [
      {label: 'At Noor’s determination, Day 93 15:00: due Day 107 15:00, ten working days on', good: true, needs: ['rule', 'det'],
       needsWhy: 'the answer rests on two records: the rule and the determination. You read only one of them.',
       why: 'The rule names counsel’s determination as its trigger, and the record times it: Day 93 15:00. Ten working days, the weekends skipped, is Day 107 15:00.'},
      {label: 'At Wellhollow’s detection, Day 91 22:47: due Day 103 22:47, ten working days on', why: 'Detection starts Wellhollow’s clause, not N-3.'},
      {label: 'At the notice’s arrival, Day 92 06:10: due Day 106 06:10, ten working days on', why: 'The notice starts N-1’s and N-2’s work, not N-3.'},
      {label: 'Not yet: it waits until Wellhollow says whose files, then runs ten working days', why: 'The rule names counsel’s determination, not Wellhollow’s answer.'}],
    reasons: [
      {label: 'The rule names its own trigger, and the record says when it happened', good: true, why: 'The trigger, then its time.'},
      {label: 'A notice clock always starts at detection, whoever detected it', why: 'Each clock starts where its own rule says.'},
      {label: 'Ten working days from the notice is the fairest reading for everyone', why: 'Fair is not the rule’s word.'}],
    alts: [
      {label: 'A law-enforcement agency asked in writing for a delay', good: true, why: 'Ruled out: no such request is on the record.'},
      {label: 'Noor’s determination covers every member', good: true, why: 'Ruled out: it is for the town and the shared services; each member’s counsel decides for its own.'},
      {label: 'The weekend counts as working days', why: 'Beside the point: the rule says working days.'},
      {label: 'Wellhollow’s clause is longer than 24 hours', why: 'Nothing points to it: C1 says 24 hours.'}],
    path: '<p>“When does it start?” is decided by <b>the rule’s own trigger</b> and <b>the record of that trigger</b>. A detection time, a notice’s arrival and a preference are other clocks, or none.</p>',
    response: ['N-3 for the town: from Day 93 15:00, due Day 107 15:00', 'Each member’s counsel decides its own, at its own time', 'The clock goes in Thursday’s papers as the rules set it'],
    techs: [], acts: ['chfinclock']
  }
};

/* ---------- The directive (game; Tuesday 11:30): Marit asks to hold packet 2 ---------- */
const CH_FIN_DIRECTIVE = [
  {label: 'It goes to Noor at 14:00, as she asked, whose files left as an open question', good: true},
  {label: 'Agreed: we hold it for Wellhollow past 14:00, then send Noor a packet with no open question in it', why: 'Counsel decides on what is known and what is not. A packet held back to look complete keeps counsel from deciding.'},
  {label: 'It goes, without the store: our copies sitting there is Wellhollow’s matter, not ours', why: 'Our own job log says our copies are on that store. That is the fact counsel most needs.'},
  {label: 'It goes, worded “no evidence of data loss”, true as far as it goes', why: 'Our side can’t see their store. A wording that hides what is not known misleads counsel.'},
  {label: 'Ask the chair whether Noor needs it today, and do whatever he says', why: 'Noor set the checkpoint. What goes in the packet is yours, and it goes to counsel.'}];

/* ---------- The Disclosure terminals (Noor's; three puzzles: the real cases and the comparison) [fact] ---------- */
const CH_FIN_DOJO = [
  {q: 'United States v. Sullivan, as the court record says it. Which line can a briefing carry?',
   opts: ['Convicted on 5 October 2022 of obstructing an FTC proceeding and of misprision; three years’ probation and a $50,000 fine; affirmed; certiorari denied',
          'Convicted for paying a bug bounty, which the court held to be illegal in itself; three years in prison; the appeal still open',
          'Convicted on 5 October 2022 for not telling the public of a breach, a duty the court held every security officer has'], good: 0,
   explain: 'The record: convicted 5 October 2022 (18 U.S.C. § 1505 and § 4); sentenced 5 May 2023 to three years’ probation and a $50,000 fine; the Ninth Circuit affirmed (No. 23-927; filed 13 March 2025, amended 12 November 2025); certiorari denied 29 June 2026. The court’s words: “Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary.” It said it need not decide whether a bug bounty program may give researchers prior authorisation. Lesson: the facts go to counsel.'},
  {q: 'SEC v. SolarWinds Corp. and Brown: what can a briefing say about how it ended?',
   opts: ['The court found in July 2024 that the CISO’s Security Statement was false, and he settled with the SEC in 2025',
          'Allegations only: most claims dismissed in July 2024, then the SEC dismissed the case with prejudice on 20 November 2025',
          'The SEC won in July 2024, and the case was closed in November 2025, the company paying a penalty'], good: 1,
   explain: 'The SEC alleged; nothing was found. In July 2024 the court “denies in part, but grants in large part, the motion to dismiss”: only fraud claims based on the pre-incident Security Statement went on, at the pleading stage. On 20 November 2025 the SEC dismissed “with prejudice”, “in the exercise of its discretion” (Litigation Release No. 26423). Discussion question: would our own statement match what our records say?'},
  {q: 'Comparison only (the Compact is not an SEC registrant): a US public company determines on a Tuesday that an incident is material. When is its Form 8-K Item 1.05 report due?',
   opts: ['Within four calendar days of discovering the incident, whoever discovered it',
          'When its CISO judges the facts complete, the delay the company’s own to set',
          'Within four business days after that determination, the registrant’s own call'], good: 2,
   explain: 'General Instruction B.1: “within four business days after the registrant determines that it has experienced a material cybersecurity incident”. The determination “must be made without unreasonable delay after discovery”, and only the US Attorney General’s written notice to the SEC can delay disclosure. The registrant decides; the rule names no officer.'}];

/* ---------- The Board's standing questions (Thursday 14:00): used when the packets leave fewer than three weak points ---------- */
const CH_FIN_BOARD_SPECS = () => [
  {title: 'Who heard first', who: 'Ivor Penhallow',
   ask: '“Why did Noor have the facts before most of this Board?”',
   resp: [{label: 'N-1 names counsel and the chair, within four hours: counsel decides any notice', good: true},
          {label: 'Noor asked for them first under N-1, and the CISO answers whoever asks first', why: 'The rule names who receives them, not who asks.'},
          {label: 'The Board needed only the statement, and the facts were for counsel', why: 'The chair had them at 10:00 too; the Board has them today.'},
          {label: 'To keep the incident quiet until Wellhollow’s answers were in', why: 'Nothing was kept back: what was not known went in as not known.'}]},
  {title: 'The court record', who: 'Ivor Penhallow',
   ask: '“In United States v. Sullivan, what does the court record say about counsel?”',
   resp: [{label: 'That he did not inform Uber’s general counsel, in the appeals court’s own words', good: true},
          {label: 'That he paid a bug bounty, and that the court held such payments illegal', why: 'The court said it need not decide that.'},
          {label: 'That he went to prison for keeping it from the company’s counsel', why: 'Three years’ probation and a $50,000 fine.'},
          {label: 'That any security officer must tell the public within a set number of days', why: 'The record says nothing of the kind.'}]},
  {title: 'Our statement', who: 'Ivor Penhallow',
   ask: '“Who decided our statement on Wednesday?”',
   resp: [{label: 'You did, on Noor’s and Ada’s advice, from the facts packet', good: true},
          {label: 'Ada did: communications is hers, and she published it', why: 'Ada advised and drafted. The chair decided.'},
          {label: 'Noor did: anything said in public is a legal matter', why: 'Noor advised. The chair decided.'},
          {label: 'The CISO did: the facts in it were the CISO’s', why: 'The CISO supplied the facts. The chair decided.'}]}];
