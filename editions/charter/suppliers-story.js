/* ============================================================
   UPTIME · editions/charter/suppliers-story.js
   Charter district 2: Suppliers (Days 71 to 74). Monday: drill A (Inkmere and
   residents' data), the supplier register's tiers, drill B (Wellhollow's
   assurance report). Tuesday: Cobbleton Payroll's notice of an incident on its
   side, told only through the Compact's own records, notices, times and
   decisions. Wednesday: drill C (Tarnfield's notice clock), the directive
   (Ilka wants Inkmere's renewal signed today without the notification clause),
   the clause plan, the Suppliers terminals, Cobbleton's summary. Thursday:
   Cobbleton's second answer, cp-xfer returned, the timeline against Contract A,
   the Compact Board's Supplier round, the Hawser Badge and the week's summary
   ("Next: Policy").
   One decider per decision, whoever is on duty: Edda (by day) decides
   cp-xfer's suspension and its return; Marit owns payroll and the print-and-
   post service and signs for any must-have left out of their contracts; Ilka
   and Noor hold the Compact's contracts; Noor decides any notification duty;
   each member's owner decides its own contracts; the CISO advises.
   Timeline: scratchpad charter-timeline.md (slice 2).
   ============================================================ */
'use strict';

/* ---------- The week opens (your desk, after Budget) ---------- */
async function chSupStart() {
  await UI.openModal('Friday, Day 68', '<p>Between the weeks you wrote three things for the supplier register (game):</p><ul><li>the tiering rule: what stops for residents if a supplier stops, and what it holds or can reach;</li><li>the clause catalogue: eight security clauses, and which ones each tier must have;</li><li>Contract A: the catalogue’s tier-1 clauses, as model terms.</li></ul><p class="small">CSF 2.0 GV.SC-05: “Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties”.</p>',
    [{label: 'Monday', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chSupStart = true; G.day = 71; G.focus = G.focusMax; chSup(); touchCSF('Govern'); track();
  await say('Day 71, Monday, 08:45. Suppliers week. 09:00: Beatriz has the account lists at the identity desk.');
}

/* ---------- Drills ---------- */
async function chSupDrill(key) {
  const sup = chSup(), r = await doDrill(CH_SUP_DRILLS[key]);
  sup.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys};
  sup.needs.total++; if (r.verdictOk && r.supported) sup.needs.met++;
  track();
  return r;
}
async function chSupDrillA() {
  await say('09:00. Inkmere is the biggest invoice we pay, and its questionnaire says it holds no personal data. Here are the account lists, and Edda’s data-flow record, exported at 08:30.', 'Beatriz Solano');
  await chSupDrill('supdata');
  await say('10:15: the register’s Inkmere line now cites the data-flow record: names and postal addresses each month, no account on our side. Marit is told. (game)');
  G.f.chSupDrillA = true; unlock('act', 'chdataflow'); touchCSF('Identify'); track();
  await say('10:30: the supplier register, by the contracts cabinet. Eight lines to tier.');
}
async function chSupDrillB() {
  await say('14:00. Wellhollow sent its Brindlemark report for the renewal. It says no exceptions. Is it enough for C4?', 'Edda Thornquist');
  await chSupDrill('supattest');
  await say('Then I ask Wellhollow for a current report on the backup service, and if there isn’t one, the right to assess goes into the renewal. The service carries on meanwhile.', 'Edda Thornquist');
  G.f.chSupDrillB = true; unlock('act', 'chattest'); track();
  await say('End the day at your desk.');
}
async function chSupDrillC() {
  await say('09:00. Tarnfield’s renewal is next month. Before you were appointed, it told us of an incident on its side. Did it meet its clause? The contract is ours; the clause and the notice are here.', 'Joanna Ferreday');
  await chSupDrill('supclock');
  await say('Late by 2 hours 20 minutes, then. What I do about it under the contract is for me and our counsel. At the renewal I’ll ask for your 24 hours. Thank you.', 'Joanna Ferreday');
  G.f.chSupDrillC = true; unlock('act', 'chclock'); track();
  await say('11:30: Ilka Thrushcombe, procurement, is waiting by the contracts cabinet.');
}

/* ---------- The supplier register (Monday 10:30, the contracts cabinet) ---------- */
async function chSupTierTask() {
  const sup = chSup();
  await UI.openModal('The supplier register (inherited)', '<p>Eight suppliers, listed by what we pay them. No tiers. (game)</p>' + chSupRegisterHtml() + chRuleHtml(),
    [{label: 'Tier them', meta: {good: true}}], {closable: false, cls: 'drill'});
  const t = await chTierEdit();
  sup.sent = Object.assign({}, t); track();
  const st = chTierStats(sup.sent);
  await UI.openModal('The tiers you put on the register', chTierDebrief(sup.sent) + (st.wrong.length ? '<p>You correct your own register before Wednesday’s plan: the tiers the rule gives. Your first tiering is what the scorecard reads.</p>' : ''),
    [{label: 'Pin it back in the cabinet', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chSupTier = true; unlock('act', 'chtier'); unlock('fact', 'chcsfsc'); touchCSF('Govern'); track();
  await say('Six suppliers in Tier 1, and the biggest invoice is not one of them. 14:00: Edda’s desk, Wellhollow’s report.');
}
async function chSupRegisterView() {
  const sup = chSup();
  await UI.openModal('The supplier register', chSupRegisterHtml() + (sup.accept.length ? '<h3>Acceptances: must-haves left out</h3>' + chClauseAcceptHtml(sup.accept) : ''), [{label: 'Back', meta: {back: true}}], {closable: false, cls: 'drill'});
}

/* ---------- The supplier incident (Tuesday; then Wednesday 16:50) ---------- */
async function chSupStage(i) {
  const sup = chSup(), s = CH_SUP_INCIDENT[i], items = s.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
  let first = true;
  while (true) {
    const k = await UI.openModal(s.title, '<p><b>' + esc(s.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
    if (items[k].meta.good) break;
    first = false;
    await say(s.resp[k].why, s.who);
  }
  sup.incident.first[i] = first; track();
}
async function chSupIncident() {
  const m = 'Marit Quellan';
  await say('08:20. This came to the payroll mailbox last night: the only address Cobbleton’s contract has for us. The payroll officer read it at 08:10.', m);
  await UI.openModal('Cobbleton Payroll’s notice', '<pre class="art">From      Cobbleton Payroll, account manager\nTo        the payroll team’s shared mailbox\nSent      Day 71 (Monday) 21:14\n\n“We have identified a security incident affecting\n part of our hosted environment. We are investigating\n with outside specialists and will update customers.”</pre>' +
    '<p class="small">No detection time and no security contact. Cobbleton’s contract (2021) has neither a notification clause nor a security contact: its notices go to the payroll mailbox. (game)</p>', [{label: 'Read on', meta: {good: true}}], {closable: false, cls: 'drill'});
  await chSupStage(0);
  await say('08:30, from the register and CP-XFER-01’s log: Cobbleton reaches us through one account, cp-xfer, on the transfer server. Nothing in the shared directory. Last successful login Thursday (Day 67) at 06:00, from its documented range. And a failed login at 23:52 last night, from 203.0.113.77, outside that range. (game)');
  await chSupStage(1);
  await say('08:40: I’ve suspended cp-xfer: disabled, nothing deleted. 08:50: its log, 90 days, exported and kept. 09:00: 203.0.113.77 blocked at our edge.', 'Edda Thornquist');
  await chSupStage(2);
  await say('09:10: sent to its account manager, Noor copied: when it detected the incident; whether our pay files and cp-xfer’s password were in the affected part; the addresses it connects from; when it next updates; and a security contact.', m);
  await say('09:15. Facts by 12:00, please: what is known, what is not, and since when. Whether anyone must be told is mine to answer.', 'Noor Castellanos');
  await chSupStage(3);
  await chSupStage(4);
  await say('12:30. My decision, as counsel: no notice to staff yet. I decide again when Cobbleton answers. (game)', 'Noor Castellanos');
  G.f.chSupIncident = true; unlock('act', 'chvendorir'); touchCSF('Respond'); track();
  await say('End the day at your desk.');
}
async function chSupReturn() {
  await say('16:40. Cobbleton’s summary, to Noor and to me. It says it detected the incident on Monday at 15:05, its time; the affected part held the file store with customers’ pay files; “we have found no evidence that your files were accessed”; cp-xfer’s password isn’t kept there; it connects only from its documented range. Its review covers activity up to Monday 18:00.', 'Marit Quellan');
  await chSupStage(5);
  await say('16:55: Marit asks Cobbleton, Noor copied, for a review that runs to the present, and whether 203.0.113.77 is one of its addresses. cp-xfer stays suspended: Edda’s decision. The next pay file is Day 81. (game)');
  G.f.chSupReturn = true; track();
  await say('End the day at your desk.');
}
async function chSupThursday() {
  await say('11:00. Cobbleton’s second answer: its review now runs to Wednesday 12:00. 203.0.113.77 is not one of its addresses. Nothing on its side used cp-xfer’s credentials after Thursday’s 06:00 pickup. That is its statement.', 'Marit Quellan');
  await say('11:30. My decision, as counsel: Marit tells the members’ staff today what is known and what is not. Anything more waits for Cobbleton’s final report. (game)', 'Noor Castellanos');
  await say('12:00: cp-xfer is back. A new password, set by us and given to Cobbleton’s account manager on a call-back to a known number; logins only from its documented range; 203.0.113.77 stays blocked. The next pickup is Day 81 at 06:00.', 'Edda Thornquist');
  touchCSF('Recover');
  await UI.openModal('The Compact’s timeline, beside Contract A', chSupTimelineHtml(), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  await say('12:30: you send each member’s owner its tier’s requirements for the next change to its own contracts: Celia for Stillmark, Director Strand for Shelfwright, Marisol for Wrenfold, Joanna for Tarnfield. Their contracts, their decisions. (game)');
  const cp = (chSup().planSent || {}).cobbleton || [], both = ['C1', 'C3'].every(c => cp.includes(c));
  await say(both ? 'Contract A’s two clauses go into Cobbleton’s amendment, then: they are in the plan you sent. 14:00, the Board.' : 'Your plan left ' + ['C1', 'C3'].filter(c => !cp.includes(c)).join(' and ') + ' out of Cobbleton’s amendment. I signed for that, with a date; the Board will see it. 14:00.', 'Marit Quellan');
  G.f.chSupThu = true; track();
}

/* ---------- The directive (game; Wednesday 11:30): Ilka wants Inkmere signed today ---------- */
async function chSupDirective() {
  const who = 'Ilka Thrushcombe', sup = chSup();
  await say('Ilka Thrushcombe, procurement. Noor and I hold the Compact’s contracts. Inkmere’s ends on Friday.', who);
  await say('Inkmere holds its price only if we sign today, as it stands. Your notification clause adds $4k a year. I’d like to sign this afternoon. Shall I?', who);
  const items = CH_SUP_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Inkmere’s renewal: what do you tell Ilka?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_SUP_DIRECTIVE[i].why);
  }
  sup.directive = {first: first};
  await say('11:50, Marit, its owner: “Price it, in your plan. If it won’t fit, I’ll sign for what’s left, with a date.” Inkmere’s offer stands until Friday. (game)');
  await say('Then I sign once your plan is in. 14:00 is fine.', who);
  G.f.chSupDirective = true; touchCSF('Govern'); track();
  await say('14:00: your desk. The clause plan for the Compact’s four contracts.');
}

/* ---------- The clause plan (Wednesday 14:00, your desk) ---------- */
async function chSupPlanTask() {
  const sup = chSup();
  await say('14:00. Four of the Compact’s contracts change this year: Cobbleton’s amendment, Wellhollow’s renewal, Inkmere’s renewal and Glasswick’s. One envelope, ' + chMoney(CH_SUP_ENVELOPE) + ' a year. (game)');
  const plan = await chPlanEdit();
  sup.planSent = plan; track();
  const st = chPlanStats(plan);
  const left = CH_SUP_CONTRACTS.flatMap(k => st.per[k.id].miss.map(c => [k.id, c]));
  for (const [id, c] of left) sup.accept.push(chClauseAccept(id, c, 73));
  await say('14:40: Ilka and Noor take the plan to the suppliers: ' + chMoney(st.cost) + ' a year, ' + st.mustIn + ' of ' + st.mustTotal + ' must-haves in or sought. (game)');
  if (left.length) {
    const owners = [...new Set(left.map(([id]) => chSupLine(id).owner))];
    await UI.openModal('15:00: must-haves left out', chClauseAcceptHtml(sup.accept.filter(x => x.day === 73)), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
    for (const o of owners) await say('I sign for ' + left.filter(([id]) => chSupLine(id).owner === o).map(([id, c]) => chSupLine(id).short + ' ' + c).join(', ') + ' as its owner, with the interim measure and a date. The Board sees it.', o.replace(/^Director /, ''));
  } else await say('Every must-have in or sought. Nothing for an owner to sign. (game)');
  G.f.chSupPlan = true; unlock('act', 'chclause'); touchCSF('Govern'); track();
  await say('15:30: Ilka has three terminals for you, south-west.');
}

/* ---------- The Suppliers terminals (Ilka's) ---------- */
async function chSupDojoIntro() {
  G.f.chSupDojoMet = true;
  await say('Three terminals, south-west, while the plan goes out: tiers, clauses within the money, and the clock. I use them with every new contract owner.', 'Ilka Thrushcombe');
}
async function chSupDojoPuzzle(i) {
  const f = G.f, sup = chSup();
  if (i < 0) return;
  if (!f.chSupDojoMet) { await say('A training terminal: “Suppliers”. Ilka’s. Talk to her first.'); return; }
  const p = CH_SUP_DOJO[i];
  if (sup.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the contract reads.');
  }
  await say('Correct. ' + p.explain);
  sup.dojo[i] = true; touchCSF('Govern');
  if (!sup.dojo.every(Boolean) || f.chSupDojoDone) return;
  f.chSupDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2); track();
  await say('All three. Focus ' + G.focusMax + ' (game). Marit was asking for you.', 'Ilka Thrushcombe');
}

/* ---------- The Compact Board's Supplier round (Thursday 14:00) ---------- */
async function chSupBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, sup = chSup();
  await say('14:00. The members’ representatives, Edda, Marit, Ilka, and Noor for anything legal. Suppliers, and Tuesday. Three questions.', who);
  sup.board = {first: []};
  await chStages(CH_SUP_BOARD_SPECS(), sup.board.first);
  await say('15:00: the register goes in the minute: eight suppliers tiered, owners and review dates, the plan for the Compact’s four contracts, and each acceptance an owner signed. Each member’s owner has its tier’s requirements for its own contracts. (game)', who);
  f.chSupBoard = true; f.chHawser = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chsupboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s Supplier round. This is the Hawser Badge (game).', who);
  await say('Its power, from the next district on: every Tier 1 supplier’s security contact is on the incident page. And Focus +4.', who);
  await say('16:00: your desk. Close the week.');
}

/* ---------- The week's summary ---------- */
function chSupDrillRows() {
  const sup = chSup();
  return Object.keys(CH_SUP_DRILLS).map(k => { const d = sup.drills[k]; return '<tr><td>' + esc(CH_SUP_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function chSupSummary() {
  const f = G.f, sup = chSup();
  if (!f.chSupSummary) {
    f.chSupSummary = true; touchCSF('Govern');
    Series.markEdition('charter', {suppliers: true});
    await say('Eight suppliers in tiers, a plan within the money, and Tuesday told from our own records. Next, policy.', 'Ivor Penhallow');
  }
  const ok = l => l.every(x => x !== false), ts = chTierStats(sup.sent), ps = sup.planSent ? chPlanStats(sup.planSent) : null, ss = chSupStats();
  const body = '<p class="big">Suppliers: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: the register tiered, ' + (ts ? ts.right + ' of 8 by the rule as you sent it' : 'not sent') + '. Tuesday: Cobbleton’s notice, ' + (ok(sup.incident.first) ? 'every step right at the first try' : 'with false starts the debriefs named') + '; cp-xfer suspended at 08:40 and returned on Thursday at 12:00. Wednesday: Inkmere’s renewal ' + (sup.directive && sup.directive.first ? 'sent to its owner at the first try' : 'sent to its owner, after a false start') + '; the plan ' + (ps ? chMoney(ps.cost) + ' of ' + chMoney(CH_SUP_ENVELOPE) + ', ' + ps.mustIn + ' of ' + ps.mustTotal + ' must-haves' : 'not sent') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chSupDrillRows() + '</table>' +
    '<h3>Must-haves left out, signed by their owners</h3>' + chClauseAcceptHtml(sup.accept) +
    '<p>The members’ own contracts: ' + ss.memFull + ' of ' + ss.members + ' with every must-have for their tier. Their owners’ decisions; each has the requirements.</p>' +
    '<p>Lesson (game): tier suppliers by what stops for residents and what they hold or can reach, not by the invoice. Put each tier’s requirements into the contracts; an owner signs for any must-have left out. When a supplier has an incident, find what it can reach on your side, suspend it while the evidence stays, ask for the facts you need, say only what the records show, and give access back when the evidence covers the latest activity. Counsel decides any notice; the clock starts where the contract says.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: ' + qtCount() + ' notes in the suspicion file. Who, and why: not yet known.</p>') +
    '<p class="big">Next: Policy.</p>';
  while (true) {
    const i = await UI.openModal('End of Suppliers', body, [{label: 'Keep exploring the Compact offices', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
