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
  notice: {name: 'Wellhollow’s notice with our named security contact', at: [92, '06:10'], when: f => !!f.chFinStart},
  log: {name: 'the incident log’s first entry', at: [92, '06:25'], when: f => !!f.chFinLog},
  determination: {name: 'Noor’s determination, for the town and the shared services', at: [93, '15:00'], when: f => !!f.chFinDetermine}};

/* ---------- The Compact's notification rules (game wording; no law is named or stated) ---------- */
const CH_FIN_RULES = [
  // N-1 and N-2 (fix pass S-1): the clock starts at whichever comes first of two recorded events, the notice's receipt by our
  // named security contact and the incident log's first entry, so the person the rule times cannot start it late.
  {id: 'N-1', name: 'Facts to counsel and the chair', trigger: ['notice', 'log'], window: {h: 4}, startsAt: 'the notice’s receipt by our named security contact or the incident log’s first entry, whichever is first',
   text: 'The CISO gives counsel and the chair the facts known, what is not known, and the records behind each, within 4 hours of the notice’s receipt by the Compact’s named security contact or the incident log’s first entry, whichever is first, then at each checkpoint counsel sets.',
   decider: 'the CISO supplies the facts; counsel and the chair receive them', done: fin => fin.packets.P1 && fin.packets.P1.sent ? fin.packets.P1.sent.at : null},
  {id: 'N-2', name: 'Members told', trigger: ['notice', 'log'], window: {h: 24}, startsAt: 'the notice’s receipt by our named security contact or the incident log’s first entry, whichever is first',
   text: 'Each member’s representative and its own counsel are told, within 24 hours of the notice’s receipt by the Compact’s named security contact or the incident log’s first entry, whichever is first, that the member’s data may be involved.',
   decider: 'the chair tells them; Noor and the CISO brief him', done: (fin, f) => f.chFinMembers ? chAt(92, '11:00') : null},
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
  '<li>Item 1.05(c): disclosure may be delayed “if the United States Attorney General determines that disclosure required by paragraph (a) of this Item 1.05 poses a substantial risk to national security or public safety, and notifies the Commission of such determination in writing”.</li>' +
  '<li>Item 1.05(d), a separate ground: a registrant “that is subject to 47 CFR 64.2011” (the FCC’s breach rule for telecommunications carriers) may delay for the period that rule sets, “and in no event for more than seven business days after notification required under such provision has been made”. Both paragraphs open “Notwithstanding General Instruction B.1. to Form 8-K”.</li>' +
  '<li>Who decides: “the registrant”. The rule names no officer, and the clock starts at the determination, not at discovery.</li></ul>' +
  '<p class="small">SEC, Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure, final rule, Release No. 33-11216, Federal Register, 4 August 2023 (effective 5 September 2023; compliance with Item 1.05 from 18 December 2023, or 15 June 2024 for smaller reporting companies, the later date in each of the SEC’s fact sheet’s two tests).</p>';

/* ---------- The records the packets cite (game). Each with its time and its custody (fix pass S-4: who took it, a hash
   noted, where it is kept). Every time is Compact time; Wellhollow's own times are as it states them. ---------- */
const CH_FIN_TIMEBASE = 'All times are Compact time; Wellhollow’s are as it states them, its time zone asked at 06:40. (game)';
const CH_FIN_RECORDS = {
  NOT: {name: 'Wellhollow’s notice, as received', at: [92, '06:10'], cust: 'the on-call mailbox, copied to the evidence share, hash noted'},
  LOGI: {name: 'The incident log, from its first entry', at: [92, '06:25'], cust: 'kept by you, on the evidence share'},
  JOB: {name: 'The copy job’s scope, settings and log, exported', at: [92, '08:05'], cust: 'exported by Edda’s team, hash noted, on the evidence share'},
  DFR: {name: 'The data-flow record', at: [71, '08:30'], cust: 'the supplier register, a copy on the evidence share'},
  EDG: {name: 'The edge log, 35 days, held from rolling off', at: [92, '08:30'], cust: 'exported by Beatriz’s team, hash noted, on the evidence share'},
  ACL: {name: 'The account lists', at: [92, '08:30'], cust: 'exported by Beatriz’s team, hash noted, on the evidence share'},
  SIL: {name: 'CP-OPS-02’s sign-in log, 30 days, for counsel only', at: [92, '09:00'], cust: 'exported by Beatriz’s team, hash noted, held for counsel'},
  CON: {name: 'Wellhollow’s contract, on the supplier register (C1, C2, C7)', at: [71, '10:30'], cust: 'the supplier register'},
  MEM: {name: 'The members’ call, as recorded', at: [92, '11:00'], cust: 'the chair’s office, on the evidence share'},
  WH2: {name: 'Wellhollow’s second answer', at: [93, '09:00'], cust: 'the on-call mailbox, copied to the evidence share, hash noted'},
  JB2: {name: 'The copy job’s target store, night by night', at: [93, '09:40'], cust: 'exported by Edda’s team, hash noted, on the evidence share'},
  RST: {name: 'The test restore from our local copies', at: [93, '12:10'], cust: 'Edda’s team, on the evidence share'},
  DET: {name: 'Noor’s determination, as recorded', at: [93, '15:00'], cust: 'Noor’s office'}};

/* ---------- The facts packets. Each row: req (required), unknown (what is not known, a required row), rec ('in' or
   'out' for optional rows); every variant cites as many records as the supported one; grade and why for the debrief ---------- */
const CH_FIN_PACKETS = [
  {id: 'P1', title: 'Facts packet 1 · to Noor and the chair', due: [92, '10:10'], dueRule: 'N-1', openItem: true,
   head: 'Facts packet 1, for Noor and the chair under N-1, prepared for counsel at counsel’s standing request: records to Day 92 09:20.',
   intro: 'Monday, 09:30. What is known, what is not, since when, and from which record. N-1 is due at 10:10.',
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
    {id: 'K2', name: 'What we sent Wellhollow', topic: 'what the Compact sent Wellhollow, and what its own job keeps there', req: true,
     variants: [
       {label: 'Sent to Wellhollow nightly: every member’s file shares, records included, 35 nights kept there by our job, any more Wellhollow’s to say', good: true, grade: 'supported', refs: ['DFR', 'JOB'],
        why: 'Our own records show what we sent and what our job keeps there. Whether Wellhollow holds more is on its side, asked at 06:40.'},
       {label: 'What Wellhollow holds of ours: not known until Wellhollow says, its notice naming no one’s copies at 06:10', grade: 'overstated', refs: ['NOT', 'DFR'],
        why: 'It denies what our own records do show: what we sent, and what our job keeps there. Only what Wellhollow holds beyond that is its to say.'},
       {label: 'Wellhollow holds 35 nights of our copies and no more, by our job’s setting: each member’s file shares, records included', grade: 'overstated', refs: ['DFR', 'JOB'],
        why: 'Our setting is what our job asks for. What Wellhollow keeps on its side, its snapshots and replicas included, is for its answer.'},
       {label: 'Wellhollow holds every record any member has kept, for each year from the start of its contract, by the data-flow record', grade: 'overstated', refs: ['DFR', 'JOB'],
        why: '“Every record, each year” where the job sends the file shares nightly and keeps 35 nights.'}]},
    {id: 'K3', name: 'Whether our copies were read or copied', topic: 'whether the Compact’s copies were read or copied', req: true, unknown: true,
     variants: [
       {label: 'Whether our copies were read or copied: not known at 09:20, the notice saying Wellhollow does not know yet', good: true, grade: 'supported', refs: ['NOT', 'LOGI'],
        why: 'What is not known, stated as not known, with since when and from which record. Counsel needs it as much as any fact.'},
       {label: 'Whether our copies were read or copied: not known at 09:20, and to be treated as no until Wellhollow says otherwise', grade: 'overstated', refs: ['NOT', 'LOGI'],
        why: 'What is not known is not “no”. Treating it as no until told otherwise is silence read as an answer.'},
       {label: 'Whether our copies were read or copied: yes, in all likelihood, at 09:20, our copies sitting on that system', grade: 'overstated', refs: ['NOT', 'JOB'],
        why: '“Likely” stated as a finding. The notice says it is not yet known.'},
       {label: 'Whether read or copied: no, at 09:20, on Wellhollow’s word to our on-call lead at 06:15', grade: 'unsupported', refs: ['NOT', 'LOGI'],
        why: 'No record holds such a word. At 06:15 the on-call lead phoned you, not Wellhollow.'}]},
    {id: 'K7', name: 'Encryption and its key', topic: 'whether our copies were encrypted before they left, and who holds the key', req: true, unknown: true,
     variants: [
       {label: 'Encrypted before sending: no, by the job’s settings, only the connection, and how Wellhollow’s store keys our copies: not known at 09:20', good: true, grade: 'supported', refs: ['JOB', 'NOT'],
        why: 'What our settings show, and what only Wellhollow can answer (asked at 06:40), stated as not known. For counsel it may be the decisive fact.'},
       {label: 'Encrypted before sending: no, only the connection, and anyone who took a copy from that store can read the records in it', grade: 'overstated', refs: ['JOB', 'NOT'],
        why: 'Whether anything was taken, and how Wellhollow’s store keys our copies, are both not known.'},
       {label: 'Encrypted before sending: yes, by the job’s settings, with our own key, and no copy taken from the store can be read', grade: 'unsupported', refs: ['JOB', 'NOT'],
        why: 'The job’s settings say the opposite: only the connection is encrypted.'},
       {label: 'Encrypted before sending: no, by the job’s settings, the platform’s director deciding at 09:00 that this makes it notifiable', grade: 'misplaced', refs: ['JOB', 'NOT'],
        why: 'Whether anything is notifiable is counsel’s to decide. Edda, the platform’s director, decides the platform.'}]},
    {id: 'K4', name: 'Our own systems', topic: 'whether anything from Wellhollow reached the Compact’s systems', req: true,
     variants: [
       {label: 'Into our systems from Wellhollow: no connection from its range in all 35 days, no account of its own', good: true, grade: 'supported', refs: ['EDG', 'ACL'],
        why: 'The edge log and the account lists, each with its time. Only our own nightly sessions went out to it.'},
       {label: 'Into our systems from Wellhollow: nothing in 35 days, and nothing can ever come in from its incident', grade: 'overstated', refs: ['EDG', 'ACL'],
        why: 'A promise beyond the records: they show 35 days, not what never will.'},
       {label: 'Into our systems from Wellhollow: one sign-in from its range at 22:40 on Day 91, on the edge log at 08:30', grade: 'unsupported', refs: ['EDG', 'ACL'],
        why: 'The edge log shows no connection opened from Wellhollow’s range: only our own nightly sessions out to it.'},
       {label: 'Into our systems from Wellhollow: nothing, Edda having decided at 08:30 that the incident is not ours to report', grade: 'misplaced', refs: ['EDG', 'ACL'],
        why: 'Whether the incident touches the town or a member for any notice is counsel’s question. Edda decides the platform.'}]},
    {id: 'K5', name: 'Containment', topic: 'what was done to contain it, and what that leaves', req: true,
     variants: [
       {label: 'Copies to Wellhollow paused 07:40, Edda’s decision on my advice, job log kept, our only off-site copy paused with them', good: true, grade: 'supported', refs: ['JOB', 'LOGI'],
        why: 'Who decided, on whose recommendation, what was kept, and the gap it opens with who decided that, from the log.'},
       {label: 'Copies to Wellhollow paused at 07:40 on my own decision, Edda carrying it out, the job log exported at 08:05', grade: 'misplaced', refs: ['JOB', 'LOGI'],
        why: 'The shared platform is Edda’s: she decided, on your recommendation.'},
       {label: 'Copies to Wellhollow paused at 07:40, our members’ data out of reach for good from here on, the job log exported at 08:05', grade: 'overstated', refs: ['JOB', 'LOGI'],
        why: 'Pausing new copies does nothing for the copies already at Wellhollow.'},
       {label: 'Copies to Wellhollow paused at 07:40, once Wellhollow had cleared it with us, the job log exported at 08:05', grade: 'unsupported', refs: ['JOB', 'LOGI'],
        why: 'No record of any clearance, and none was needed: the pause is ours.'}]},
    {id: 'K6', name: 'The contract’s clock', topic: 'the contract’s notice clock', req: false, rec: 'in',
     variants: [
       {label: 'Wellhollow’s notice inside its 24-hour clause: 22:47 on Day 91 to our contact at 06:10, 7 hours 23 minutes', good: true, grade: 'supported', refs: ['CON', 'NOT'],
        why: 'C1’s own clock: from its stated detection to our named contact, with the time zone of its 22:47 asked at 06:40.'},
       {label: 'Wellhollow’s notice outside its 24-hour clause: detected 22:47 on Day 91, with our contact 06:10, 31 hours 23 minutes', grade: 'unsupported', refs: ['CON', 'NOT'],
        why: '22:47 to 06:10 the next morning is 7 hours 23 minutes.'},
       {label: 'Wellhollow’s notice inside its clause, at 7 hours 23 minutes, and its handling of the rest to be trusted too', grade: 'overstated', refs: ['CON', 'NOT'],
        why: 'A notice on time says nothing about the rest of its handling.'}]}]},
  {id: 'P2', title: 'Facts packet 2 · to Noor and the chair', due: [93, '14:00'], dueRule: 'Noor’s checkpoint (N-1)',
   head: 'Facts packet 2, for Noor and the chair at Noor’s checkpoint under N-1, prepared at counsel’s request: records to Day 93 13:20.',
   intro: 'Tuesday, 13:30. Noor’s checkpoint is 14:00. What has changed since Monday, and what is still not known.',
   rows: [
    {id: 'L1', name: 'Wellhollow’s second answer', topic: 'what Wellhollow’s second answer says', req: true,
     variants: [
       {label: 'Wellhollow’s answer at 09:00: files on one of its stores copied out, 21:58 to 22:40 on Day 91, whose not yet named', good: true, grade: 'supported', refs: ['WH2', 'NOT'],
        why: 'The answer, in its own words and times, attributed to Wellhollow.'},
       {label: 'Wellhollow’s answer at 09:00: our files copied out of its store, 21:58 to 22:40 on Day 91, by its own account of it', grade: 'overstated', refs: ['WH2', 'NOT'],
        why: 'The answer says whose files is not yet known. “Our files” says more.'},
       {label: 'Wellhollow’s answer at 09:00: nothing copied out of any store, 21:58 to 22:40 on Day 91, by its own account', grade: 'unsupported', refs: ['WH2', 'NOT'],
        why: 'The answer says the opposite: files on one store were copied out.'},
       {label: 'Wellhollow’s answer at 09:00: files on one store copied out on Day 91, Wellhollow telling our members’ people itself', grade: 'misplaced', refs: ['WH2', 'NOT'],
        why: 'Any notice to a member’s people is that member’s decision, on its own counsel’s advice.'}]},
    {id: 'L2', name: 'Our copies on that store', topic: 'which of the Compact’s copies were on that store when files were copied out', req: true,
     variants: [
       {label: 'On that store at 21:58 to 22:40 on Day 91: our copies of Days 57 to 91, by our job log, Day 92’s going after', good: true, grade: 'supported', refs: ['JB2', 'WH2'],
        why: 'Our own job log names the store for each night, and 35 nights by our setting put Days 57 to 91 there during the window. Day 92’s copy was sent at 01:00, after it.'},
       {label: 'On that store: every copy the Compact has ever made, of every member, by our own job log at 09:40', grade: 'overstated', refs: ['JB2', 'WH2'],
        why: '“Ever made” where the log shows 35 nights.'},
       {label: 'On that store: none of ours, Wellhollow’s answer at 09:00 naming other customers’ copies', grade: 'unsupported', refs: ['WH2', 'JB2'],
        why: 'The answer names no customer, and our own job log puts every night’s copy on that store.'}]},
    {id: 'L3', name: 'Ours among the files copied out', topic: 'whether the Compact’s copies were among the files copied out', req: true, unknown: true,
     variants: [
       {label: 'Ours among the files copied out: not known at 13:20, Wellhollow still working out whose they were', good: true, grade: 'supported', refs: ['WH2', 'JB2'],
        why: 'What is not known, stated as not known, with since when and from which record.'},
       {label: 'Ours among the files copied out: yes at 13:20, our copies of every night from Day 57 on being on that store', grade: 'overstated', refs: ['WH2', 'JB2'],
        why: 'On the store is not the same as among the files copied out. Wellhollow does not know yet.'},
       {label: 'Ours among the files copied out: not known at 13:20, but no, nothing in our own logs pointing that way', grade: 'overstated', refs: ['WH2', 'JB2'],
        why: 'Our logs can’t see Wellhollow’s store. An absence on our side says nothing about theirs.'}]},
    {id: 'L4', name: 'Members told', topic: 'whether each member has been told', req: true,
     variants: [
       {label: 'Each member’s representative and its own counsel told at 11:00 on Monday, each counsel deciding for its member', good: true, grade: 'supported', refs: ['MEM', 'NOT'],
        why: 'N-2, met, and each member’s counsel deciding for its own member.'},
       {label: 'Each member’s representative and counsel told at 11:00 on Monday, Noor deciding any notice for every one of them', grade: 'misplaced', refs: ['MEM', 'NOT'],
        why: 'Noor decides for the town and the shared services. Each member’s own counsel decides for that member.'},
       {label: 'Each member’s representative told at 09:30 on Tuesday, once Wellhollow’s answer had settled it', grade: 'unsupported', refs: ['MEM', 'WH2'],
        why: 'The call record says Monday 11:00, and nothing is settled.'}]},
    {id: 'L5', name: 'Restore readiness', topic: 'whether the Compact can restore from its own copies', req: false, rec: 'in',
     variants: [
       {label: 'Our local copies intact: a test restore of the Clinic’s share good at 12:10, the other shares not yet tried', good: true, grade: 'supported', refs: ['RST', 'JB2'],
        why: 'One restore tried, and the rest named as not yet tried.'},
       {label: 'Every member’s data restorable from our local copies within the hour, the restore at 12:10 proving it for all', grade: 'overstated', refs: ['RST', 'JB2'],
        why: 'One share restored is a sample, not every member, and not a time.'},
       {label: 'Our local copies paused with the job at 07:40 on Monday, the restore at 12:10 made from Wellhollow’s copy', grade: 'unsupported', refs: ['RST', 'JB2'],
        why: 'Only the copies to Wellhollow were paused, and the restore came from our own.'}]}]},
  {id: 'P3', title: 'Facts packet 3 · for the Compact’s statement', due: [94, '11:00'], dueRule: 'the chair’s request (N-4)',
   head: 'Facts packet 3, for the chair, Noor and Ada, for the Compact’s statement: records to Day 94 09:30. No personal details.',
   intro: 'Wednesday, 09:30. The chair decides the statement at 12:00, on Noor’s and Ada’s advice, and asked for the facts by 11:00. Plain words, no personal details.',
   rows: [
    {id: 'M1', name: 'What happened', topic: 'what happened, in plain words', req: true,
     variants: [
       {label: 'On Day 92 our backup supplier told us of an incident on its service, and on Day 93 that files on one of its stores were copied out', good: true, grade: 'supported', refs: ['NOT', 'WH2'],
        why: 'What the supplier told us, and when, in plain words.'},
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
       {label: 'We stopped sending copies to the supplier on Day 92, the morning it told us, and told each member that morning', good: true, grade: 'supported', refs: ['JOB', 'MEM'],
        why: 'The pause and the members’ call, from the records.'},
       {label: 'We stopped sending copies to the supplier on Day 92, the morning it told us, and every member’s data is secure from then on', grade: 'overstated', refs: ['JOB', 'MEM'],
        why: 'The copies already at the supplier are where they were.'},
       {label: 'We stopped sending copies on Day 92, and the Compact has decided that no resident needs telling', grade: 'misplaced', refs: ['JOB', 'MEM'],
        why: 'Each member’s counsel decides any notice to its people. The Compact decides nothing for a member.'}]},
    {id: 'M4', name: 'Who decides notice', topic: 'who decides any notice', req: true,
     variants: [
       {label: 'Each member’s own counsel decides any notice to its people, and our chair decides this statement', good: true, grade: 'supported', refs: ['DET', 'MEM'],
        why: 'One decider each, as the rules name them. The chair has not decided the statement yet: he decides it at 12:00.'},
       {label: 'The Compact decides any notice to the people of every member, and our chair decides this statement', grade: 'misplaced', refs: ['DET', 'MEM'],
        why: 'Each member’s own counsel decides for that member.'},
       {label: 'Our security lead decides any notice to members’ people, counsel advising, and our chair this statement', grade: 'misplaced', refs: ['DET', 'MEM'],
        why: 'The CISO supplies the facts and decides no notice.'}]},
    {id: 'M5', name: 'The supplier’s cause', topic: 'the supplier’s cause', req: false, rec: 'out',
     variants: [
       {label: 'What caused the supplier’s incident is for the supplier to say', good: true, grade: 'supported', refs: ['WH2', 'NOT'],
        why: 'Another party’s root cause is its own to state.'},
       {label: 'The supplier’s weak sign-in controls caused its incident, by its second answer', grade: 'overstated', refs: ['WH2', 'NOT'],
        why: 'A claim about another party’s root cause, with no record behind it.'},
       {label: 'The supplier told us a member of its own staff caused its incident', grade: 'unsupported', refs: ['WH2', 'NOT'],
        why: 'Neither of its answers says so.'}]}]}];

/* ---------- The Compact's statement, in Ada's words, from packet 3's supported rows (fix pass S-8) ----------
   The known fact first, the unknown beside it, what we did, a next step for residents, the next update and a contact.
   Each sentence names the row it rests on; the last two are Ada's (communications' advice), not facts from a row. */
const CH_FIN_STATEMENT = [
  {row: 'M1', text: 'Our off-site backup supplier has told us that, on Day 91, files were copied out of one of its storage systems, which holds copies of our members’ records.'},
  {row: 'M2', text: 'We do not yet know whether our members’ copies were among them.'},
  {row: 'M3', text: 'We stopped sending copies to the supplier on Day 92, the morning it first told us, and told every member that day.'},
  {row: 'M4', text: 'Where a member finds that anyone’s information may have been taken, that member will contact them directly, under the Compact’s rules.'},
  {row: null, text: 'Next update: Day 96 by 12:00, or sooner if we learn more.'},
  {row: null, text: 'Questions: the Compact’s information line (game).'}];

/* ---------- Sending a packet: to whom and when (the CISO's choice, recorded as sent) ---------- */
// at: when the packet reaches counsel (or, for packet 3, the chair); chair: when it reaches the chair (fix pass M-1: no
// character acts on a packet before it reaches them). kind: rec (the recommended send), held, or via (through someone
// else). The first option is the recommended one.
const CH_FIN_SEND = {
  P1: [
    {label: 'Send it to Noor and the chair at 10:00, open questions included', good: true, kind: 'rec', at: [92, '10:00'], chair: [92, '10:00'], to: 'Noor and the chair'},
    {label: 'Hold it past 10:10 for Wellhollow’s answers, and send Noor the whole picture then', kind: 'held', at: [93, '09:10'], chair: [93, '09:10'], to: 'Noor and the chair, on Tuesday',
     why: 'N-1 runs from the notice’s receipt, not from Wellhollow’s answers. Counsel needs what is known now, and what is not.'},
    {label: 'Send it to the chair alone at 10:00, and leave it to him to brief Noor', kind: 'via', at: [92, '11:40'], chair: [92, '10:00'], to: 'the chair, who passed it to Noor at 11:40',
     why: 'N-1 names counsel and the chair. The facts go to counsel directly, not through anyone.'}],
  P2: [
    {label: 'Send it to Noor and the chair at 13:45, whose files still an open question in it', good: true, kind: 'rec', at: [93, '13:45'], chair: [93, '13:45'], to: 'Noor and the chair'},
    {label: 'Hold it past 14:00 until Wellhollow says whose files were copied out of its store', kind: 'held', at: [93, '16:30'], chair: [93, '16:30'], to: 'Noor and the chair, at the end of the day',
     why: 'Noor set 14:00. What is not known goes in, stated as not known; waiting does not make the packet truer.'},
    {label: 'Send it to Edda at 13:45, for her to check it and pass it on to Noor', kind: 'via', at: [93, '15:20'], chair: [93, '15:20'], to: 'Edda, who passed it to Noor and the chair at 15:20',
     why: 'The packet is yours, and N-1 sends it to counsel and the chair. Edda decides the platform, not what counsel reads.'}],
  P3: [
    {label: 'Send it to the chair, Noor and Ada at 10:00, the statement the chair’s', good: true, kind: 'rec', at: [94, '10:00'], chair: [94, '10:00'], to: 'the chair, Noor and Ada'},
    {label: 'Send it to Ada at 10:00 to publish, the facts in it being ours to state', kind: 'via', at: [94, '11:15'], chair: [94, '11:15'], to: 'Ada, who took it to the chair at 11:15',
     why: 'The chair decides the statement. Ada advises on it and drafts it; she does not publish facts on her own.'},
    {label: 'Hold it past noon for Wellhollow’s next answer, then send it to the chair', kind: 'held', at: [94, '14:30'], chair: [94, '14:30'], to: 'the chair, after the statement was decided',
     why: 'The chair asked for the facts by 11:00 and decided at 12:00 without them.'}]};

/* ---------- The decision log (Monday 14:00): six decisions to route, one decider each; the log as recorded also holds
   the decisions already taken that morning and the law-enforcement question (fix pass S-2, S-4, S-13) ---------- */
const CH_FIN_DECISIONS = [
  {id: 'D-1', short: 'Pausing the nightly copies to Wellhollow', who: 'Edda Thornquist', done: [92, '07:40']},
  {id: 'D-2', short: 'Whether the town and the shared services must notify anyone', who: 'Noor Castellanos', done: [93, '15:00']},
  {id: 'D-3', short: 'Whether the Clinic must notify its patients', who: 'The Clinic’s own counsel'},
  {id: 'D-4', short: 'The Compact’s public statement', who: 'Ivor Penhallow, the chair', done: [94, '12:00']},
  {id: 'D-5', short: 'Whether the Library’s data goes back into the off-site copies, and with whom', who: 'Director Mina Strand'},
  {id: 'D-6', short: 'What the facts packets say', who: 'You, the CISO'},
  {id: 'D-7', short: 'No off-site copy while the copies are paused: an interim copy, or the gap accepted until they resume', who: 'Edda Thornquist', done: [92, '08:05'], log: true,
   what: 'the gap accepted until the copies resume, the local copies checked each morning, the Board told on Thursday'},
  {id: 'D-8', short: 'Asking Wellhollow in writing to preserve its logs and the store as they are', who: 'Noor Castellanos', done: [92, '11:00'], log: true, what: 'asked in writing'},
  {id: 'D-9', short: 'Whether to report the incident to law enforcement', who: 'Noor Castellanos, for the town and the shared services; each member’s own counsel for its member', log: true}];
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
  {label: 'Open the incident log at 06:25, with Wellhollow’s notice as its first record', good: true},
  {label: 'Open it at 08:45 with the office, when everyone is in to agree it is an incident', why: 'The notice is in, and N-1 runs from its receipt at 06:10 whenever the log opens. The log starts now.'},
  {label: 'Open it once Wellhollow confirms our copies are involved, and not before', why: 'The log records what is known as it becomes known. Waiting for a supplier keeps counsel waiting too.'}];

/* ---------- Drills (Monday and Tuesday). Records are the evidence; two decisive sources each ---------- */
const CH_FIN_DRILLS = {
  finhold: {
    id: 'finhold', title: 'What have we sent Wellhollow?', budget: 3,
    intro: '<p>Wellhollow’s notice says a storage system holding copies for several customers, the Compact among them, is under investigation. What have we sent Wellhollow, and what does our job keep there? Edda has the data-flow record and the copy job. What Wellhollow holds beyond that is on its side: it is among your questions of 06:40.</p>',
    artefact: '<pre class="art">Wellhollow · notice to customers (as received 06:10, game data)\n' +
      '“an incident on our off-site backup service,\n' +
      ' detected at 22:47 on Day 91 … copies for\n' +
      ' several customers, the Compact among them …\n' +
      ' whether customer copies were read or copied\n' +
      ' is not yet known”</pre>' +
      '<p class="small">What we sent a supplier is read from our own records, not from its notice. What it holds on its side is its to say.</p>',
    question: 'What have we sent Wellhollow, and what does our job keep there?',
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
         res: ['Nightly at 01:00: every member’s file shares, to one target, Wellhollow’s store', 'Retention set by our job: 35 nights (what Wellhollow keeps on its side is its to say)', 'Encryption: the connection only; not encrypted before sending', 'Last run Day 92 01:00 to 01:42; paused 07:40']},
        {q: 'Every line of the job log', kind: 'broad', rows: 2900,
         wall: ['Day {i}  01:{t}  cp-backup  share {n}  sent', 'Day {i}  01:{t}  cp-backup  share {n}  verified', 'Day {i}  01:{t}  cp-backup  retention 35']}]}
    ],
    verdicts: [
      {label: 'Every member’s file shares, records included, sent nightly, 35 nights by our setting', good: true, needs: ['dataflow', 'job'],
       needsWhy: 'the answer rests on two records: the data-flow record and the copy job. You read only one of them.',
       why: 'The data-flow record says what goes, and the job how often and what it keeps there: every member’s shares, nightly, 35 nights by our setting. Anything more on Wellhollow’s side is for its answer.'},
      {label: 'The Compact’s copies among several customers’, as the notice says, and no more than that', why: 'The notice says whose. Our own records say what.'},
      {label: 'Only what the contract names, and it names nothing of ours', why: 'The contract says what happens at the end. The records say what is held.'},
      {label: 'Everything any member has ever stored, for every year of its contract', why: 'The job sends the file shares and keeps 35 nights of them.'}],
    reasons: [
      {label: 'The data-flow record says what goes, and the job what it keeps there', good: true, why: 'What, then how much, by our setting.'},
      {label: 'The notice names the Compact, and a supplier’s notice is its record of what it holds', why: 'A notice says what the supplier is investigating.'},
      {label: 'The contract is the record of what a supplier may keep, and with it of what it keeps', why: 'May keep is not keeps.'}],
    alts: [
      {label: 'The job sends only the directory’s exports', good: true, why: 'Ruled out: the job’s scope is every member’s file shares.'},
      {label: 'The job also sends our copies somewhere else', good: true, why: 'Ruled out: the job’s scope names one target, Wellhollow’s store.'},
      {label: 'Wellhollow keeps more than the job sets', why: 'Not one our records can rule out: our job sets 35 nights; what Wellhollow holds beyond that is for its answer.'},
      {label: 'The contract is out of date', why: 'Beside the point: the records decide what we sent.'}],
    path: '<p>“What have we sent it?” is decided by <b>the data-flow record</b> and <b>the copy job</b>. A notice says whose copies are involved; a contract says what happens at the end; what the supplier holds beyond our setting is its to say.</p>',
    response: ['Packet 1 says: every member’s file shares, records included, sent nightly, 35 nights by our setting; anything more is Wellhollow’s to say', 'The kinds of records named, no person named', 'Edda keeps the job paused'],
    techs: [], acts: ['chfinhold']
  },
  finedge: {
    id: 'finedge', title: 'Has anything from Wellhollow reached our systems?', budget: 3,
    intro: '<p>Wellhollow has no account on our side, by the supplier register. Has anything from Wellhollow reached the Compact’s systems? Beatriz exported the account lists and the edge log at 08:30, hash noted, and the edge log is held from rolling off.</p>',
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
        {q: 'Any connection opened from Wellhollow’s range?', kind: 'focus', key: true,
         res: ['198.51.100.0/24, Wellhollow’s documented range: no connection opened from it in 35 days', 'Only our own sessions out: CP-OPS-02 to it nightly, 01:00 to 01:45, and none since 07:40 on Day 92']},
        {q: 'Every edge entry in 35 days', kind: 'broad', rows: 88000,
         wall: ['Day {i}  {t}  out  CP-OPS-02  198.51.100.{n}  443', 'Day {i}  {t}  in  denied  203.0.113.{n}', 'Day {i}  {t}  out  member PC  web']}]}
    ],
    verdicts: [
      {label: 'No: in all five weeks no connection opened from its range, only ours out, no account', good: true, needs: ['acl', 'edge'],
       needsWhy: 'the answer rests on two records: the account lists and the edge log. You read only one of them.',
       why: 'No account to use, and no connection opened from its range: our side shows only our own sessions out.'},
      {label: 'No: the register says Wellhollow has no way in, and nothing could have reached us', why: 'The register says what was set up. The logs show what happened.'},
      {label: 'Yes: our copies went to its store every night, and that store is the one under investigation', why: 'Out is not in. Our copies going out is K2’s fact.'},
      {label: 'Not known, and not knowable from our side until Wellhollow reports on its own logs', why: 'Our own logs answer it for our side.'}],
    reasons: [
      {label: 'The account lists show no way in, the edge log no connection from its range', good: true, why: 'Who could, then what did.'},
      {label: 'A supplier with no account on the register can’t reach anything we run', why: 'A register is set up once; logs show each day.'},
      {label: 'Wellhollow would have told us in its notice if our systems had been reached', why: 'Its notice is about its side.'}],
    alts: [
      {label: 'A Wellhollow key sits on a server of ours', good: true, why: 'Ruled out: no key from Wellhollow on any server.'},
      {label: 'Its range reached us after the pause', good: true, why: 'Ruled out: no connection opened from it in 35 days, and no session out since 07:40.'},
      {label: 'Wellhollow uses a second range', why: 'Beside the point unless the contract names one; it names one.'},
      {label: 'cp-backup is a person’s account', why: 'Nothing points to it: non-interactive, from CP-OPS-02.'}],
    path: '<p>“Has anything reached us?” is decided by <b>the account lists</b> and <b>the edge log</b>. A register says what was set up; a view is a view.</p>',
    response: ['Packet 1 says: no connection opened from Wellhollow’s range in 35 days, and no Wellhollow account', 'The copies stay paused: Edda’s decision', 'Business terms in the packet; the hosts and the range are in the records'],
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
  {label: 'It goes to Noor and the chair at 14:00, whose files left as an open question', good: true},
  {label: 'Agreed: we hold it for Wellhollow past 14:00, then send Noor a packet with no open question in it', why: 'Counsel decides on what is known and what is not. A packet held back to look complete keeps counsel from deciding.'},
  {label: 'It goes, without the store: our copies sitting there is Wellhollow’s matter, not ours', why: 'Our own job log says our copies are on that store. That is the fact counsel most needs.'},
  {label: 'It goes, worded “no evidence of data loss”, true as far as it goes', why: 'Our side can’t see their store. A wording that hides what is not known misleads counsel.'},
  {label: 'Ask the chair whether Noor needs it today, and do whatever he says', why: 'Noor set the checkpoint. What goes in the packet is yours, and it goes to counsel.'}];

/* ---------- The Disclosure terminals (Noor's; three puzzles: the real cases and the comparison) [fact] ---------- */
const CH_FIN_DOJO = [
  {q: 'United States v. Sullivan, as the court record says it. Which line can a briefing carry?',
   opts: ['Convicted 5 October 2022 of FTC obstruction and misprision, probation and a $50,000 fine, affirmed, certiorari denied',
          'Convicted for paying a bug bounty, which the court held to be illegal in itself; three years in prison; the appeal still open',
          'Convicted on 5 October 2022 for not telling the public of a breach, a duty the court held every security officer has'], good: 0,
   explain: 'The record: convicted 5 October 2022 (18 U.S.C. § 1505 and § 4); sentenced 5 May 2023 to three years’ probation and a $50,000 fine; the Ninth Circuit affirmed (No. 23-927; filed 13 March 2025, amended 12 November 2025); certiorari denied 29 June 2026. The court’s words: “Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary.” It said it need not decide whether a bug bounty program may give researchers prior authorisation. Lesson: the facts go to counsel.'},
  {q: 'SEC v. SolarWinds Corp. and Brown: what can a briefing say about how it ended?',
   opts: ['The court found in July 2024 that the CISO’s Security Statement was false, and he settled with the SEC in 2025 on terms',
          'Allegations: most of the SEC’s claims dismissed at the pleading stage, then dismissed with prejudice in 2025',
          'The SEC won in July 2024, and the case was closed in November 2025, the company paying a penalty'], good: 1,
   explain: 'The SEC alleged; nothing was found. In July 2024 the court “denies in part, but grants in large part, the motion to dismiss”: only fraud claims based on the pre-incident Security Statement went on, at the pleading stage. On 20 November 2025 the SEC dismissed “with prejudice”, “in the exercise of its discretion” (Litigation Release No. 26423). Discussion question: would our own statement match what our records say?'},
  {q: 'Comparison only (the Compact is not an SEC registrant): a US public company determines on a Tuesday that an incident is material. When is its Form 8-K Item 1.05 report due?',
   opts: ['Within four calendar days of discovering the incident, whoever discovered it',
          'When its CISO judges the facts complete, the delay the company’s own to set',
          'Four business days after that determination, the registrant’s call'], good: 2,
   explain: 'General Instruction B.1: “within four business days after the registrant determines that it has experienced a material cybersecurity incident”. The determination “must be made without unreasonable delay after discovery”. A national-security or public-safety delay comes only from the US Attorney General’s written notice to the SEC (Item 1.05(c)); a separate paragraph, 1.05(d), covers registrants subject to the FCC’s breach rule, 47 CFR 64.2011. The registrant decides; the rule names no officer.'}];

/* ---------- The Board's questions on a packet sent late or not straight to its rule's recipients (fix pass M-7) ----------
   Keyed to the packet's send choice as recorded (held, or via someone). The ask is filled from the packet as sent. */
const CH_FIN_SENT_QS = {
  P1: {
    held: {title: 'Packet 1, held', who: 'Ivor Penhallow',
      resp: [{label: 'N-1 runs from the notice, and the unknowns belonged in it as unknowns', good: true},
             {label: 'Wellhollow’s answers were not in yet, and a packet held for them is a truer one', why: 'Waiting does not make it truer. Counsel needed what was known then, and what was not.'},
             {label: 'N-1’s clock runs from Wellhollow’s answers, and the second one came on Tuesday', why: 'N-1 runs from the notice’s receipt or the log’s first entry, whichever is first.'},
             {label: 'Noor heard of the incident on the members’ call, and the packet could go a day later', why: 'The call told the members their data may be involved. Counsel decides on the facts packet.'}]},
    via: {title: 'Packet 1, through the chair', who: 'Ivor Penhallow',
      resp: [{label: 'N-1 names us both, and nobody stands between counsel and the facts', good: true},
             {label: 'The chair outranks counsel, and the facts go to him first for him to pass on', why: 'N-1 names both. Nobody stands between counsel and the facts.'},
             {label: 'It reached the chair by 10:10, and N-1 is met once either of them has it', why: 'N-1 names counsel and the chair. It is met when both have it.'},
             {label: 'Noor needed the chair’s reading of the facts before she read them herself', why: 'Counsel reads the facts as you sent them.'}]}},
  P2: {
    held: {title: 'Packet 2, held', who: 'Ivor Penhallow',
      resp: [{label: 'Noor set 14:00, and whose files went belonged in the packet as an open question, not a reason to wait', good: true},
             {label: 'Wellhollow had not said whose files, and a packet with an open question in it alarms people', why: 'An open question is a fact counsel needs. Noor set 14:00.'},
             {label: 'Noor’s checkpoint was a guide, and N-1 has no clock of its own after the first packet', why: 'N-1 says “then at each checkpoint counsel sets”. Noor set 14:00.'},
             {label: 'Marit asked for it to be held, and payroll’s copies are hers to decide on', why: 'Payroll is Marit’s. What goes to counsel, and when, is yours under N-1.'}]},
    via: {title: 'Packet 2, through Edda', who: 'Ivor Penhallow',
      resp: [{label: 'The packet is mine to send, and N-1 names who receives it, not the platform’s director', good: true},
             {label: 'The platform’s director checks each word that goes to counsel about her platform', why: 'Edda decides the platform. What counsel reads is the CISO’s packet.'},
             {label: 'It reached the platform’s director by 14:00, and the checkpoint is met once anyone has it', why: 'The checkpoint is Noor’s: it is met when she has it.'},
             {label: 'Counsel reads about a platform only what its director has approved first', why: 'Counsel reads the facts as you sent them.'}]}},
  P3: {
    held: {title: 'Packet 3, held', who: 'Ivor Penhallow',
      resp: [{label: 'You asked for it by 11:00 and decided at noon, on the facts you had then', good: true},
             {label: 'Wellhollow’s next answer was due, and the statement could be decided after it', why: 'You asked for the facts by 11:00 and decided at 12:00. The statement did not wait.'},
             {label: 'A statement is decided on what the chair hears in the room, and the packet was a formality', why: 'The packet is the facts the statement rests on. You decided without it.'},
             {label: 'N-4 gives the statement no clock, and its packet had none either', why: 'N-4 has no clock, but you set 11:00 for the facts.'}]},
    via: {title: 'Packet 3, through Ada', who: 'Ivor Penhallow',
      resp: [{label: 'The statement is yours to decide, and its facts go to you, Noor and Ada together', good: true},
             {label: 'Communications is Ada’s, and the facts for a statement go to her to publish', why: 'Ada advises and drafts. The chair decides the statement.'},
             {label: 'It reached Ada by 11:00, and the chair’s request is met once she has it', why: 'You asked for the facts by 11:00 yourself.'},
             {label: 'A statement’s facts are public already, and it matters little who has them first', why: 'They are not public until the chair decides the statement.'}]}}};

/* ---------- The Board's standing questions (Thursday 14:00): used when the packets leave fewer than three questions ---------- */
// "Who heard first" is asked only when packet 1 went on time and straight to Noor and the chair (fix pass M-7); no
// standing question presumes what the packets as sent do not show.
const CH_FIN_BOARD_SPECS = () => [
  {title: 'Who heard first', who: 'Ivor Penhallow', when: 'p1direct',
   ask: '“Why did Noor have the facts before most of this Board?”',
   resp: [{label: 'N-1 names counsel and the chair, within four hours: counsel decides any notice', good: true},
          {label: 'Noor asked for them first under N-1, and the CISO answers whoever asks for them first', why: 'The rule names who receives them, not who asks.'},
          {label: 'The Board needed only the statement, and the facts were for counsel', why: 'The chair had them at 10:00 too; the Board has them today.'},
          {label: 'To keep the incident quiet until Wellhollow’s answers were in', why: 'Nothing was kept back: what was not known went in as not known.'}]},
  {title: 'The court record', who: 'Ivor Penhallow',
   ask: '“In United States v. Sullivan, what does the court record say about counsel?”',
   resp: [{label: 'That he did not inform Uber’s general counsel, in the appeals court’s words', good: true},
          {label: 'That he paid a bug bounty, and that the court held such payments to be illegal in themselves', why: 'The court said it need not decide that.'},
          {label: 'That he went to prison for keeping it from the company’s counsel', why: 'Three years’ probation and a $50,000 fine.'},
          {label: 'That any security officer must tell the public within a set number of days', why: 'The record says nothing of the kind.'}]},
  {title: 'Our statement', who: 'Ivor Penhallow',
   ask: '“Who decided our statement on Wednesday?”',
   resp: [{label: 'The chair, on Noor’s and Ada’s advice, from the facts before him at noon', good: true},
          {label: 'Ada did, communications being hers, and she published it once Noor had read it', why: 'Ada advised and drafted. The chair decided.'},
          {label: 'Noor did, anything said in public being a legal matter for counsel alone', why: 'Noor advised. The chair decided.'},
          {label: 'The CISO did, the facts in it being the CISO’s', why: 'The CISO supplied the facts. The chair decided.'}]}];
