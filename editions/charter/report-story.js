/* ============================================================
   UPTIME · editions/charter/report-story.js
   Charter district 4: The Board report (Days 85 to 88). Monday: the week opens
   (Ivor's note of Friday: the first report, for Thursday's meeting), drill 1
   (can the report say "MFA on every sign-in"?), drill 2 (can it say supplier
   risk fell?), drill 3 (who does it say accepted R2 and R3?). Tuesday: the
   quarter's records (the scorecards as recorded), the directive (Edda asks for
   a line to stay out of the summary), the Reporting terminals. Wednesday: the
   report, assembled at your desk from the player's own records and sent as it
   stands. Thursday: the Compact Board's meeting, the members' questions keyed
   to the report as sent, the minute, the Rolling Hitch Badge and the week's
   summary ("Next: The finale").
   One decider per decision: the CISO decides what the report says, and the
   report as sent is recorded as the CISO's; each decision it puts to the Board
   names the decider the rules name (the Board for the appetite and the budget,
   the chair or the Board for the exceptions at Day 155); Marit and Edda decide
   their own draft lines; the Board's minute records the report as received and
   the corrections it asked for. Tolerances bind: chAudit at the minute and the
   district's end (risk.js), with the report's required rows read against the
   records (report.js, chRepAuditNow).
   The Quiet Thread is not resolved: the suspicion file is one open item on the
   page, with one observation from the recorded notes and no conclusion.
   Timeline: docs/design/charter-timeline.md (slice 4).
   ============================================================ */
'use strict';

/* ---------- The week opens (your desk, after Policy) ---------- */
async function chRepStart() {
  await UI.openModal('Friday, Day 82', '<p>Ivor’s note, after the Policy round (game):</p><p>“Your first report to the Board, for Thursday’s meeting at 14:00: the quarter since Day 64, when we last met as the quarterly Board. One page, and an annex of the records behind it. Every risk above appetite and who accepted it, as minuted; every decision we must take, with its decider and your recommendation; the exceptions due and expired; the supplier tier-1 gaps; and your asks. In our terms, not the tools’. The papers go out on Wednesday at 17:00. From Day 155, one at every quarterly Board.”</p>' +
    '<p class="small">CSF 2.0 GV.OV-01: “Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction”. One of NIST’s examples for it: “Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives”.</p>',
    [{label: 'Monday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chRepStart = true; G.day = 85; G.focus = G.focusMax; chRep(); touchCSF('Govern'); unlock('fact', 'chcsfov'); track();
  await say('Day 85, Monday, 08:45. Report week. 09:00: Beatriz has MFA-Exempt and the sign-in records at the identity desk.');
}

/* ---------- Drills (Monday) ---------- */
async function chRepDrill(key) {
  const p = chRep(), r = await doDrill(chRepDrillFill(CH_REP_DRILLS[key]));
  p.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys};
  p.needs.total++; if (r.verdictOk && r.supported) p.needs.met++;
  track();
  return r;
}
async function chRepDrillA() {
  await say('09:00. Marit’s office has a line for the papers: MFA on every sign-in since the policy week. Here is MFA-Exempt, exported at 08:40, and the sign-in records for the seven days to 08:00. Can the report say it?', 'Beatriz Solano');
  await chRepDrill('repmfa');
  await say('09:40: Marit corrects the draft line before it goes: her paper, her decision. The report can carry the six accounts in one line, on their open, dated exceptions. (game)');
  G.f.chRepDrillA = true; unlock('act', 'chrepmfa'); touchCSF('Govern'); track();
  await say('11:00: Marit, at her desk: a line about the suppliers.');
}
async function chRepDrillB() {
  await say('11:00. My draft says supplier risk fell this quarter, because the plan seeks the must-haves. Ilka left her contracts status at 08:30, and the register keeps its history. Can the report say it?', 'Marit Quellan');
  await chRepDrill('repsup');
  await say('Then my line goes: one measure, from Day 71, and the signed tier-1 contracts where they stand. The next quarterly Board gets the second measure. My paper, my decision.', 'Marit Quellan');
  G.f.chRepDrillB = true; unlock('act', 'chrepsup'); touchCSF('Govern'); track();
  await say('14:00: Edda’s desk: who the report says accepted R2 and R3.');
}
// Drill 3 reads the path the records give: R2 and R3 above appetite by the Board's decision (repwho), or funded (repwho2).
function chRepWhoKey() { return (G.ch.accept || []).some(a => (a.line === 'R2' || a.line === 'R3') && a.decider === 'Board' && !a.closed) ? 'repwho' : 'repwho2'; }
async function chRepDrillC() {
  const key = chRepWhoKey(), who = 'Edda Thornquist';
  await say(key === 'repwho' ? '14:00. R2 and R3 are mine, and I signed both acceptances. The draft says who accepted them; I think it should say me. The minute and the acceptances are here.' : '14:00. My draft line says the Board accepted R2 and R3 when it approved the budget. The minute and the acceptances are here. Is that right?', who);
  await chRepDrill(key);
  await say(key === 'repwho' ? 'The Board decided, and I signed for the checks. Fair: the line says both. My draft, my decision to change it.' : 'Nothing was accepted, then, because nothing needed accepting. My draft, my decision to change it.', who);
  G.f.chRepDrillC = true; unlock('act', 'chrepwho'); touchCSF('Govern'); track();
  await say('End the day at your desk.');
}

/* ---------- Tuesday 09:00 (your desk): the quarter's records ---------- */
async function chRepRecords() {
  const c = G.ch;
  await UI.openModal('The quarter’s records', '<p>Tuesday, 09:00. What the report is built from: your scorecard as each week left it, the acceptances on the register, and the exceptions. Your results, as recorded. (game)</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() + '<h3>Acceptances on the register</h3>' + chAcceptHtml(c.accept || []) +
    ((c.sup && c.sup.accept.length) ? '<h3>Must-haves left out</h3>' + chClauseAcceptHtml(c.sup.accept) : '') +
    '<p class="small">CSF 2.0 GV.OV-03: “Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed”. One of NIST’s examples for it: “Collect and communicate metrics on cybersecurity risk management with senior leadership”.</p>',
    [{label: 'Back to the floor', meta: {good: true}}], {closable: false, cls: 'summary'});
  chRep().records = {day: 86, at: '09:00'};
  G.f.chRepRecords = true; touchCSF('Govern'); track();
  await say('11:00: Edda has a request about the summary, at her desk.');
}

/* ---------- The directive (game; Tuesday 11:00): Edda asks for a line to stay out of the summary ---------- */
function chRepDirectiveItem() { return chRepWhoKey() === 'repwho' ? 'R2 and R3' : 'cp-xfer’s return'; }
async function chRepDirective() {
  const who = 'Edda Thornquist', p = chRep(), what = chRepDirectiveItem();
  await say(what === 'R2 and R3' ? 'Leave R2 and R3 out of the summary, would you? The Board decided them itself on Day 67. It already knows.' : 'Leave cp-xfer’s return out of the summary, would you? It was in the Supplier minute on Day 74. The Board already knows.', who);
  const items = CH_REP_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Edda’s request: what do you tell her?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_REP_DIRECTIVE[i].why);
  }
  p.directive = {first: first, item: what};
  await say('Fair. One line, with the minute’s reference: it states it, it doesn’t argue it. What goes on your page is yours.', who);
  G.f.chRepDirective = true; unlock('act', 'chrepdir'); touchCSF('Govern'); track();
  await say('14:00: Beatriz has three terminals for you, south-west.');
}

/* ---------- The Reporting terminals (Beatriz's) ---------- */
async function chRepDojoIntro() {
  G.f.chRepDojoMet = true;
  await say('Three terminals, south-west: a line against its record, a trend from one point, and who decided. I export the records for every report, so I wrote them.', 'Beatriz Solano');
}
async function chRepDojoPuzzle(i) {
  const f = G.f, p = chRep();
  if (i < 0) return;
  if (!f.chRepDojoMet) { await say('A training terminal: “Reporting”. Beatriz’s. Talk to her first.'); return; }
  const q = CH_REP_DOJO[i];
  if (p.dojo[i]) { await say('Solved. ' + q.explain); return; }
  while (true) {
    const k = await choose(q.q, q.opts.map((o, j) => ({label: o, meta: {good: j === q.good}})), {shuffle: true});
    if (k === q.good) break;
    await say('Not quite. Read it as the record reads.');
  }
  await say('Correct. ' + q.explain);
  p.dojo[i] = true; touchCSF('Govern');
  if (!p.dojo.every(Boolean) || f.chRepDojoDone) return;
  f.chRepDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2); track();
  await say('All three. Focus ' + G.focusMax + ' (game). End the day at your desk.', 'Beatriz Solano');
}

/* ---------- Wednesday 09:00 (your desk): the report ---------- */
async function chRepEditTask() {
  const p = chRep();
  await say('09:00. The page, from your own records: what the register, the minutes and the registers of exceptions and suppliers say. Each line has its wordings; the page holds ten. (game)');
  const picks = await chRepEdit();
  const F = chRepFacts();
  p.sent = {picks: Object.assign({}, picks), at: CH_REP_SENT_AT.slice(), facts: F};
  p.grade = chRepGrade(p.sent.picks, F); track();
  await UI.openModal('The report you sent', '<p>12:00: to Marit for the papers, as you sent it. (game)</p>' + chRepDebriefHtml(p.grade) +
    (p.grade.weak.length || p.grade.omitted.length ? '<p>The papers carry it as you sent it. The Board reads it on Thursday.</p>' : '<p>Every line on the page is what its records say.</p>'),
    [{label: 'Into the Board papers', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chRepSent = true; unlock('act', 'chrepbuild'); touchCSF('Govern'); track();
  await say('17:00: the papers go out, with your report as you sent it. End the day at your desk.');
}

/* ---------- The Compact Board's meeting (Thursday 14:00) ---------- */
function chRepMinute(asked) {
  const p = chRep(), g = p.grade, F = chRepFacts(), rows = chRepRows(F);
  const fixed = asked.filter(q => q.row).map(q => chRepRow(q.row)), rest = g.rows.filter(x => (x.grade !== 'supported' && x.in) || x.grade === 'omitted').filter(x => !asked.some(q => q.row === x.id));
  const kname = {chair: 'the chair', board: 'this Board, in its minute', owner: 'its owner', member: 'the member’s leadership'};
  const dec = rows.filter(r => r.decision).map(r => r.id + ' (' + (r.id === 'C2' ? [...new Set(F.renewKeys.map(k => kname[k]))].join(' and ') : 'this Board') + ')');
  const oi = chRepOpenItem();
  return '15:00. The minute records the report as received (Day 87 12:00): ' + g.lines + ' line' + (g.lines === 1 ? '' : 's') + ' and an annex of ' + chRepRefs(p.sent.picks, F).length + ' records.' +
    (fixed.length ? ' Corrected in this minute, at the members’ questions: ' + fixed.map(r => r.id + ', “' + chRepFill(r.variants[chRepGood(r) - 1].label, F) + '”').join('; ') + '.' : ' No correction asked.') +
    (rest.length ? ' The chair asks for ' + rest.map(x => x.id).join(', ') + ' to be read again against the records before Day 155.' : '') +
    ' The decisions it puts to the Board: ' + dec.join(', ') + ', each with its decider.' + (oi ? ' The suspicion file noted as an open item, with no conclusion.' : '') + ' (game)';
}
async function chRepBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, p = chRep();
  await say('14:00. The members’ representatives, Edda, Marit, and Noor for anything legal. Your report is in the papers as you sent it. The members have three questions.', who);
  const qs = chRepBoardQs();
  p.board = {first: [], asked: qs.map(q => q.row || q.title)};
  await chStages(qs, p.board.first);
  p.minute = chRepMinute(qs);
  await say(p.minute, who);
  chAudit('Report: the Board’s minute (Day 88)');
  f.chRepBoard = true; f.chRollingHitch = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chrepboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s first report. This is the Rolling Hitch Badge (game).', who);
  await say('Its power, from the next district on: every line in a report to this Board arrives with its record’s reference and time. And Focus +4.', who);
  await say('16:00: your desk. Close the week.');
}

/* ---------- The week's summary ---------- */
function chRepDrillRows() {
  const p = chRep();
  return ['repmfa', 'repsup', chRepWhoKey()].map(k => { const d = p.drills[k]; return '<tr><td>' + esc(CH_REP_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function chRepSummary() {
  const f = G.f, p = chRep();
  if (!f.chRepSummary) {
    f.chRepSummary = true; touchCSF('Govern'); chAudit('Report: the district’s end (Day 88)');
    Series.markEdition('charter', {report: true});
    await say('A report this Board can read on one page and check line by line. Next, the finale.', 'Ivor Penhallow');
  }
  const ok = l => l.every(x => x !== false), g = p.grade;
  const body = '<p class="big">The Board report: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: three draft lines read against their records. Tuesday: the quarter’s records; Edda’s request ' + (p.directive && p.directive.first ? 'answered at the first try' : 'answered, after a false start') + '. Wednesday: the report sent, ' + (g ? g.lines + ' lines, ' + g.supported + ' supported' + (g.omitted.length ? ', ' + g.omitted.length + ' required left out' : '') : 'not sent') + '. Thursday: the members’ questions ' + (p.board && ok(p.board.first) ? 'answered at the first try' : 'answered, with false starts the debriefs named') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chRepDrillRows() + '</table>' +
    (g ? '<h3>Your report, as sent</h3>' + chRepDebriefHtml(g) : '') +
    (p.minute ? '<p class="small">' + esc(p.minute) + '</p>' : '') +
    '<p>Lesson (game): a report to the board is one page it can check line by line against the records behind it. Say what the record says: “every” only where the record says every, a trend only where there are two measures, “likely” never as fact, and a game or drill number never as operations. Every risk above appetite goes on the page, briefly, with who decided and who signed, as minuted, even when the board already knows. Every decision has one decider and your recommendation. An omission is worse than a dull line.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: ' + qtCount() + ' notes in the suspicion file. Who, and why: not yet known.</p>') +
    '<p class="big">Next: The finale.</p>';
  while (true) {
    const i = await UI.openModal('End of the Board report', body, [{label: 'Keep exploring the Compact offices', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
