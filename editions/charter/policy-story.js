/* ============================================================
   UPTIME · editions/charter/policy-story.js
   Charter district 3: Policy lifecycle (Days 78 to 81). Monday: the week opens
   (POL-1 drafted on Friday), drill 1 (is board-display's exception still
   valid?), the exception register's intake (its seed: the town's fd-admin
   exception, quoted from Town Hall), the consultation. Tuesday: drill 2 (does
   fin-ap's control cover the gap?), drill 3 (is STD-4 followed?). Wednesday:
   the replies (Noor's wording, Edda's operability point), the directive (the
   Library's Director asks for a permanent exception), the policy library's
   review dates, the Policy terminals. Thursday: the morning's checks (the
   Library's exception goes on the register), the Compact Board's Policy round,
   POL-1 approved, the standards issued and published, the Bowline Badge and the
   week's summary ("Next: The Board report").
   One decider per decision: the CISO drafts, decides what changes (except the
   legal wording, Noor's), issues the standards, measures and recommends; the
   Board approves POL-1; each exception's owner decides on it and signs (Edda for
   the shared services' accounts, Marit for fin-ap, Director Strand for the
   Library's PC); Edda decides the shared directory's settings. The CISO never
   approves, signs, renews or closes an exception.
   Timeline: scratchpad charter-timeline.md (slice 3).
   ============================================================ */
'use strict';

/* ---------- The week opens (your desk, after Suppliers) ---------- */
async function chPolStart() {
  await UI.openModal('Friday, Day 75', '<p>Between the weeks you drafted POL-1, the Compact’s security policy (v0.1), and listed the documents under it (game):</p><ul><li>POL-1: scope, who decides, the appetite statement, standards, measurement, exceptions, legal questions, review;</li><li>five standards under it: STD-1 Sign-in, STD-2 Vendor access, STD-3 Suppliers, STD-4 Accounts, STD-5 Updates. Four are inherited, with no owner or review date on record; STD-3 is yours;</li><li>the exception records from the Budget and Suppliers weeks, for one register.</li></ul>' +
    '<p>The lifecycle, one decider per step: you draft; each consultee answers for its own part, and you decide what changes, except the legal wording, which is counsel’s; the Board approves the policy, and you issue the standards under it; you publish; each document is measured by sample against its own words; and each is reviewed on its date.</p>' +
    '<p class="small">CSF 2.0 GV.PO-01: “Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced”. One of NIST’s examples for it: “Require approval from senior management on policy”.</p>',
    [{label: 'Monday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chPolStart = true; G.day = 78; G.focus = G.focusMax; chPol(); chExcInit(); touchCSF('Govern'); unlock('fact', 'chcsfpo'); unlock('act', 'chpolcycle'); track();
  await say('Day 78, Monday, 08:45. Policy week. 09:00: Edda’s desk: board-display’s exception.');
}

/* ---------- Drills ---------- */
async function chPolDrill(key) {
  const p = chPol(), r = await doDrill(CH_POL_DRILLS[key]);
  p.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys};
  p.needs.total++; if (r.verdictOk && r.supported) p.needs.met++;
  track();
  return r;
}
async function chPolDrillA() {
  const who = 'Edda Thornquist';
  await say('09:00. board-display: my team says it’s fine. Nobody has complained, and it still signs in. Your register will want it written up. Is it still valid?', who);
  await chPolDrill('polvalid');
  await say('Then it’s closed, my decision: 09:50, board-display out of MFA-Exempt. The Board room’s PC signs in as the meeting’s host from today, with MFA. If it’s ever needed again, it comes back through the route.', who);
  const e = chExc('EX-01'); chExcClose(e, 'Edda Thornquist', 78, 'Closed by Edda, its owner, at 09:50 on Day 78: its record ended it on Friday at 17:00, and no review renewed it.'); e.closedAt = '09:50';
  G.f.chPolDrillA = true; unlock('act', 'chpolvalid'); track();
  await say('10:30: the exception register, on the wall beside the risk register.');
}
async function chPolDrillB() {
  await say('09:00. fin-ap’s entry says it’s covered by the finance-office rule. Marit wrote that from what I told her on Day 65. Here are the rule’s settings, and fin-ap’s sign-ins. Does the control cover the gap?', 'Beatriz Solano');
  await chPolDrill('polcover');
  const e = chExc('EX-04');
  e.controls = 'sign-ins only from the finance office: the location rule, with fin-ap in its scope since Day 79 10:20 (Edda’s decision); checked: fin-ap’s sign-in at 10:31, location rule applied';
  await say('10:31: fin-ap’s next sign-in: location rule applied. Its entry now cites the rule’s scope and that sign-in. The exception stays Marit’s, on her signature. (game)');
  G.f.chPolDrillB = true; unlock('act', 'chpolcover'); touchCSF('Protect'); track();
  await say('14:00: Edda’s desk: STD-4.');
}
async function chPolDrillC() {
  const who = 'Edda Thornquist';
  await say('14:00. STD-4: my team attests it every quarter. Beatriz drew a sample from the leaver notices anyway. Is it followed?', who);
  await chPolDrill('polfollow');
  await say('Seven of ten, then, and the three late ones came from late notices. I’ll answer that in my reply to your draft.', who);
  G.f.chPolDrillC = true; unlock('act', 'chpolmeasure'); touchCSF('Govern'); track();
  await say('End the day at your desk.');
}

/* ---------- The exception register (Monday 10:30, the wall) ---------- */
async function chPolRegisterTask() {
  const p = chPol(), seed = chExc('EX-00');
  await UI.openModal('The register’s first entry: the town’s list', '<p>08:50, Beatriz’s export: the town’s directory is the shared directory, so the town’s list, MFA-Exceptions, sits beside the Compact’s MFA-Exempt. MFA-Exceptions has no members today. Its history, as the town recorded it, is the register’s first entry. (game)</p>' +
    '<p>' + chExcItemHtml(seed) + '</p>' +
    '<p>The town’s rule covered the town’s list. MFA-Exempt is the Compact’s own group, made under the Compact’s sign-in policy, and the town’s rule never reached it: on Day 65 none of its exceptions had an owner or an expiry. (game)</p>' +
    '<p class="small">Quoted from the town’s records (Town Hall). What they don’t state, the register shows as not stated.</p>',
    [{label: 'Read the Compact’s records', meta: {good: true}}], {closable: false, cls: 'drill'});
  await UI.openModal('The exception register (from the records)', '<p>Every exception the Compact carries, from the Budget and Suppliers weeks’ records. (game)</p>' + chExcRegisterHtml() + chPolRuleHtml(),
    [{label: 'Write it up', meta: {good: true}}], {closable: false, cls: 'drill'});
  const t = await chExcIntakeEdit();
  p.intakeSent = Object.assign({}, t); track();
  const wrong = Object.keys(CH_POL_INTAKE).filter(id => t[id] !== chIntakeRight(id));
  await UI.openModal('The register you put up', chIntakeDebrief(t) + (wrong.length ? '<p>You correct your own register: the write-ups the rule gives. The first one you sent is what the scorecard reads.</p>' : ''),
    [{label: 'Pin it to the wall', meta: {good: true}}], {closable: false, cls: 'summary'});
  for (const id of Object.keys(CH_POL_INTAKE)) chExcApplyWriteup(id, chIntakeRight(id));
  const e3 = chExc('EX-03'); chExcClose(e3, 'Edda Thornquist', 78, 'Closed by Edda, its owner, at 11:10 on Day 78: PATCH-01, the server it served, was retired on Friday at 16:10.'); e3.closedAt = '11:10';
  await say('11:10: cp-patch is out of MFA-Exempt. PATCH-01 went on Friday, so its exception goes too. My decision.', 'Edda Thornquist');
  G.f.chPolRegister = true; unlock('act', 'chexcreg'); touchCSF('Govern'); track();
  await UI.openModal('The exception register', chExcRegisterHtml(), [{label: 'Back to the floor', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say('14:00: your desk. The draft goes out for consultation.');
}
async function chPolRegisterView() {
  await UI.openModal('The exception register', '<p class="small">Entries, owners and dates: game data, except EX-00, quoted from the town’s records.</p>' + chExcRegisterHtml(), [{label: 'Back', meta: {back: true}}], {closable: false, cls: 'drill'});
}

/* ---------- The consultation (Monday 14:00, your desk) ---------- */
async function chPolConsult() {
  const p = chPol();
  await say('14:00. POL-1 v0.1 is ready to go out. Who reads it before the Board does, and for what? Pick three. (game)');
  const items = CH_POL_CONSULT.map(o => ({label: o.label, meta: {good: !!o.good}})).concat([{label: 'Send it to these three', done: true, meta: {done: true}}]);
  let first = true;
  while (true) {
    const sel = await UI.openModal('POL-1 v0.1 · the consultation', '<p>Pick <b>three</b>: who reads the draft, and for what.</p>', items, {shuffle: true, multi: 3, closable: false, cls: 'drill'});
    const bad = sel.filter(i => !items[i].meta.good);
    if (!bad.length) break;
    first = false;
    for (const i of bad) await say(CH_POL_CONSULT[i].why);
  }
  p.consult = {first: first};
  await say('14:20: sent, to each member’s owner, to Noor and to Edda. Replies by Wednesday at 09:00. (game)');
  G.f.chPolConsult = true; touchCSF('Govern'); track();
  await say('End the day at your desk when you’re ready.');
}

/* ---------- The replies (Wednesday 09:00, your desk) ---------- */
async function chPolReplies() {
  const p = chPol();
  await UI.openModal('The replies to POL-1 v0.1', '<p>Wednesday, 09:00 (game):</p><ul><li>Five members’ owners: no change asked.</li><li>The Library’s Director: a request. She will come by at 11:30.</li><li>Edda: “STD-4 works only if a member’s leaver notice reaches us by 12:00 on the last working day. With that, my team can run it.”</li><li>Noor: section 7 rewritten.</li></ul>',
    [{label: 'Read Noor’s', meta: {good: true}}], {closable: false, cls: 'drill'});
  p.replies = {first: []};
  await chStages(CH_POL_REPLY, p.replies.first);
  await say('09:20: section 7 is Noor’s. And you add Edda’s point to STD-4: the member’s leaver notice reaches the Compact by 12:00 on the last working day. STD-4 is yours to issue; how each member sends its notices is that member’s decision. (game)');
  G.f.chPolReplies = true; touchCSF('Govern'); track();
  await say('11:30: Director Mina Strand, from the Library, is waiting by the risk register.');
}

/* ---------- The directive (game; Wednesday 11:30): a permanent exception ---------- */
async function chPolDirective() {
  const who = 'Director Mina Strand', p = chPol();
  if (G.f.chPolDirective) { await say('Until Day 428, signed, and my case goes to STD-5’s review. Thank you for not granting it for me.', who); return; }
  await say('Mina Strand, the Library. LIB-FILM-01, the local-history room’s microfilm PC, can’t take updates: its scanner software needs the old system. It’s always been this way.', who);
  await say('So make it a permanent exception to STD-5, would you? You keep the register.', who);
  const items = CH_POL_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('The Library’s request: what do you tell its Director?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_POL_DIRECTIVE[i].why);
  }
  p.directive = {first: first, decision: {owner: 'Director Mina Strand', expiry: 428, review: 155, day: 80}};
  await say('11:50, her decision: “Then until Day 428, signed: LIB-FILM-01 on its own segment, no internet, no sign-in to the shared directory, used offline. Reviewed at the quarterly Board, Day 155. And when STD-5 is reviewed, I’ll ask for old readers to be allowed that way.” (game)');
  await say('Your recommendation, recorded as yours: for, once the control is in and checked. It goes on the register when Edda’s team has set the segment and the check is in. Edda: “15:00, my team.” (game)');
  G.f.chPolDirective = true; unlock('act', 'chexcroute'); touchCSF('Govern'); track();
  await say('14:00: your desk. The policy library.');
}

/* ---------- The policy library (Wednesday 14:00, your desk) ---------- */
function chPolLibHtml(lib) {
  return '<table class="sc"><tr><th>Doc</th><th>Review</th><th>Dated</th></tr>' + CH_POL_DOCS.map(d => '<tr><td>' + esc(d.id) + '</td><td>' + esc(typeof lib[d.id] === 'number' ? 'Day ' + lib[d.id] : lib[d.id] === 'when' ? 'on change' : 'none') + '</td><td>' + (chLibValid(lib[d.id]) ? 'yes' : '<b>no</b>') + '</td></tr>').join('') + '</table><p class="small">Dated: a review day within 12 months. “On change”: when something changes, which is no date.</p>';
}
async function chPolLibTask() {
  const p = chPol();
  await say('14:00. Six documents, and not one has a review date on record. Each needs one in Thursday’s Board papers. (game)');
  const lib = await chPolLibEdit();
  p.libSent = lib; track();
  const bad = CH_POL_DOCS.filter(d => !chLibValid(lib[d.id]));
  await UI.openModal('The policy library you sent', chPolLibHtml(lib) + (bad.length ? '<p>' + bad.map(d => esc(d.id)).join(', ') + ': no review date within 12 months. Section 8 asks for one. The library you sent is what the scorecard reads, and the Board’s papers carry it as sent.</p>' : '<p>Every document with a review date within 12 months.</p>'),
    [{label: 'Into the Board papers', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chPolLib = true; touchCSF('Govern'); track();
  await say('15:30: Edda has three terminals for you, south-west.');
}

/* ---------- The Policy terminals (Edda's) ---------- */
async function chPolDojoIntro() {
  G.f.chPolDojoMet = true;
  await say('Three terminals, south-west: expiry dates, who approves, and whether a control covers its gap. Mine; I give them to every new owner of an exception.', 'Edda Thornquist');
}
async function chPolDojoPuzzle(i) {
  const f = G.f, p = chPol();
  if (i < 0) return;
  if (!f.chPolDojoMet) { await say('A training terminal: “Policy”. Edda’s. Talk to her first.'); return; }
  const q = CH_POL_DOJO[i];
  if (p.dojo[i]) { await say('Solved. ' + q.explain); return; }
  while (true) {
    const k = await choose(q.q, q.opts.map((o, j) => ({label: o, meta: {good: j === q.good}})), {shuffle: true});
    if (k === q.good) break;
    await say('Not quite. Read it as the register reads it.');
  }
  await say('Correct. ' + q.explain);
  p.dojo[i] = true; touchCSF('Govern');
  if (!p.dojo.every(Boolean) || f.chPolDojoDone) return;
  f.chPolDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2); track();
  await say('All three. Focus ' + G.focusMax + ' (game). End the day at your desk.', 'Edda Thornquist');
}

/* ---------- Thursday 09:00 (Edda's desk): the morning's checks ---------- */
function chPolLibEntry() {
  const p = chPol();
  if (chExcInit().some(e => e.id === 'EX-05')) return;
  p.exc.push({id: 'EX-05', short: 'LIB-FILM-01', std: 'STD-5', scope: 'LIB-FILM-01, the Library’s local-history microfilm PC',
    clause: 'STD-5: critical fixes within 14 days of their release', reason: 'its scanner software needs the old system',
    controls: 'its own segment, no internet, no sign-in to the shared directory, used offline (Edda’s team, set Day 80 15:00); checked Day 81 09:00: no connection in or out since',
    owner: 'Director Mina Strand', start: 81, expiry: 428, review: 155, recommendedBy: 'the CISO: for, once the control was in and checked',
    note: 'Decided and signed by the Library’s Director on Day 80 at 11:50; on the register from Day 81 09:05, when the check was in.'});
}
async function chPolCheck() {
  const who = 'Edda Thornquist';
  await say('09:00. 06:00: Thimbleford’s pickup ran: cp-xfer, key-only, from its documented range, the session logged. (game)', who);
  await say('LIB-FILM-01’s segment, set at 15:00 yesterday: its log since then shows no connection in or out. (game)', who);
  chPolLibEntry();
  await say('09:05: EX-05 goes on the register: LIB-FILM-01, STD-5, its owner Director Strand, who signed it; the check cited; it expires on Day 428 and is reviewed on Day 155. Your recommendation beside it: for. (game)');
  await say('And this week’s read of MFA-Exempt against the register: six accounts, the five service accounts and fin-ap, each on an open entry in date. (game)', who);
  G.f.chPolCheck = true; touchCSF('Govern'); track();
  await say('14:00: the Compact Board room: the Policy round.');
}

/* ---------- The Compact Board's Policy round (Thursday 14:00) ---------- */
function chPolMinute() {
  const L = chExcInit().filter(e => !e.seed), open = L.filter(e => chExcStatus(e) !== 'closed'), closed = L.filter(e => chExcStatus(e) === 'closed');
  const past = open.filter(e => chExcStatus(e) === 'expired'), board = open.filter(e => chExcBoardChose(e));
  return {open: open.map(e => e.id), closed: closed.map(e => e.id), past: past.map(e => e.id), board: board.map(e => e.id),
    text: '15:00. POL-1 is approved: the Board’s decision. The minute records the register as read: ' + open.length + ' open exception' + (open.length === 1 ? '' : 's') + ' (' + open.map(e => e.id + ' ' + e.short).join(', ') + '), each with its owner, its approver by the rule, its expiry and its review date; closed this week: ' + closed.map(e => e.id + ' ' + e.short).join(' and ') + '; ' + (past.length ? past.map(e => e.id).join(', ') + ' past its expiry' : 'none open past its expiry') + '.' +
      (board.length ? ' ' + board.map(e => e.id + ' ' + e.short).join(', ') + ': approved here, as the Board’s own decision of Day 67 left it (section 6.3); its owner signs for running the control.' : '') +
      (open.some(e => e.id === 'EX-05') ? ' EX-05, the Library’s, stands on its owner’s signature, with your recommendation beside it.' : '') + ' (game)'};
}
async function chPolBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, p = chPol();
  await say('14:00. The members’ representatives, Edda, Marit, and Noor for anything legal. POL-1 is in the papers, with the register and the library. Three questions.', who);
  p.board = {first: []};
  await chStages(CH_POL_BOARD_SPECS(), p.board.first);
  p.minute = chPolMinute();
  await say(p.minute.text, who);
  f.chPolBoard = true; f.chBowline = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chpolboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s Policy round. This is the Bowline Badge (game).', who);
  await say('Its power, from the next district on: every exception’s expiry and review date reaches your desk on the Monday before it falls due. And Focus +4.', who);
  // 15:30: the standards issued under POL-1 and published, each with its review date from the library as sent; any
  // without one within 12 months gets one before it goes, as section 8 asks (the scorecard still reads the library sent).
  const lib = p.libSent || {}, bad = CH_POL_DOCS.filter(d => !chLibValid(lib[d.id]));
  p.published = Object.fromEntries(CH_POL_DOCS.map(d => [d.id, chLibValid(lib[d.id]) ? lib[d.id] : d.bot]));
  await say('15:30: you issue STD-1 to STD-5 under POL-1, and publish them with it to every member’s staff, each with its owner and its review date' + (bad.length ? '. ' + bad.map(d => d.id).join(', ') + ' had none within 12 months in the library you sent: under section 8 each gets one before it goes (15:40), ' + bad.map(d => d.id + ' Day ' + d.bot).join(', ') + '. The scorecard reads the library as you sent it.' : '.') + ' (game)');
  await say('16:00: your desk. Close the week.');
}

/* ---------- The week's summary ---------- */
function chPolDrillRows() {
  const p = chPol();
  return Object.keys(CH_POL_DRILLS).map(k => { const d = p.drills[k]; return '<tr><td>' + esc(CH_POL_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function chPolSummary() {
  const f = G.f, p = chPol();
  if (!f.chPolSummary) {
    f.chPolSummary = true; touchCSF('Govern');
    Series.markEdition('charter', {policy: true});
    await say('A policy this Board approved, standards with dates, and a register that says who carries what, and until when. Next, the Board report.', 'Ivor Penhallow');
  }
  const ok = l => l.every(x => x !== false), st = chPolStats(), sent = p.intakeSent || {};
  const wrong = Object.keys(CH_POL_INTAKE).filter(id => sent[id] !== chIntakeRight(id));
  const body = '<p class="big">Policy: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: board-display closed by its owner on an expired record; the register written up, ' + (wrong.length ? 'with ' + wrong.join(', ') + ' differing from the rule as you sent it' : 'every row as the rule asks') + '; cp-patch closed; the draft out ' + (p.consult && p.consult.first ? 'to the right three at the first try' : 'to the right three, after a false start') + '. Tuesday: fin-ap’s control put in scope, and STD-4 measured by sample. Wednesday: Noor’s wording in; the Library’s request ' + (p.directive && p.directive.first ? 'sent through the route at the first try' : 'sent through the route, after a false start') + '. Thursday: POL-1 approved, the standards issued and published. Its rounds ' + (p.board && ok(p.board.first) ? 'at the first try' : 'with false starts the debriefs named') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chPolDrillRows() + '</table>' +
    '<h3>The exception register</h3>' + chExcRegisterHtml() +
    '<p>Lesson (game): a policy that says “all” needs a register that is read. Each exception names its clause, its exact scope, its reason and a control that covers the gap; its owner decides and signs, and the Board approves only what its own decision left; it has an expiry and a review date, and at its expiry it closes or renews through the same route with fresh evidence. The CISO writes it up, checks the control against its records, recommends, and never grants one. A policy is drafted, consulted on, approved by the governing body, published, measured by sample against its own words, and reviewed on a date.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: ' + qtCount() + ' notes in the suspicion file. Who, and why: not yet known.</p>') +
    '<p class="big">Next: The Board report.</p>';
  while (true) {
    const i = await UI.openModal('End of Policy', body, [{label: 'Keep exploring the Compact offices', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
