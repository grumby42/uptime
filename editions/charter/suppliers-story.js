/* ============================================================
   UPTIME · editions/charter/suppliers-story.js
   Charter district 2: Suppliers (Days 71 to 74). Monday: drill A (Inkmere and
   residents' data), the supplier register's tiers, drill B (Wellhollow's
   assurance report). Tuesday: Thimbleford Payroll's notice of an incident on its
   side, told only through the Compact's own records, notices, times and
   decisions. Wednesday: drill C (Tarnfield's notice clock), the directive
   (Ilka wants Inkmere's renewal signed today without the notification clause),
   the clause plan, the Suppliers terminals, Thimbleford's summary. Thursday:
   Thimbleford's second answer, cp-xfer returned, the timeline against Contract A,
   the Compact Board's Supplier round, the Hawser Badge and the week's summary
   ("Next: Policy").
   One decider per decision, whoever is on duty: Edda (by day) decides
   cp-xfer's suspension and its return, after the Compact's own evidence check;
   Marit owns payroll and the print-and-post service, decides and signs for any
   must-have the CISO's plan recommends leaving out of their contracts, and
   signs for cp-xfer's return measured against Monday's privacy tolerance; Ilka
   and Noor hold the Compact's contracts; counsel decides any notification duty
   (Noor for the Compact, each member's counsel for its own staff); each
   member's owner decides its own contracts; the CISO measures and advises.
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
  await UI.openModal('The supplier register', '<p class="small">Spend, tiers and dates: game data.</p>' + chSupRegisterHtml() + (sup.accept.length ? '<h3>Acceptances: must-haves left out</h3>' + chClauseAcceptHtml(sup.accept) : ''), [{label: 'Back', meta: {back: true}}], {closable: false, cls: 'drill'});
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
  await say('08:20. This came to the payroll mailbox last night: the only address Thimbleford’s contract has for us. The payroll officer read it at 08:10.', m);
  await UI.openModal('Thimbleford Payroll’s notice', '<pre class="art">From      Thimbleford Payroll, account manager\nTo        the payroll team’s shared mailbox\nSent      Day 71 (Monday) 21:14\n\n“We have identified a security incident affecting\n part of our hosted environment. We are investigating\n with outside specialists and will update customers.”</pre>' +
    '<p class="small">No detection time and no security contact. Thimbleford’s contract (2021) has neither a notification clause nor a security contact: its notices go to the payroll mailbox. (game)</p>', [{label: 'Read on', meta: {good: true}}], {closable: false, cls: 'drill'});
  await chSupStage(0);
  await say('08:30, from the register and CP-XFER-01’s log: Thimbleford reaches us through one account, cp-xfer, on the transfer server. Nothing in the shared directory. Last successful login Thursday (Day 67) at 06:00, from its documented range. And a failed login at 23:52 last night, from 203.0.113.77, outside that range. (game)');
  await chSupStage(1);
  await say('08:40: I’ve suspended cp-xfer: disabled, nothing deleted. 08:50: its log, 90 days, exported and kept. 09:00: 203.0.113.77 blocked at our edge, and ninety days of edge logs searched for it: the 23:52 attempt only. (game)', 'Edda Thornquist');
  await chSupStage(2);
  await say('09:10: sent to its account manager, Noor copied: when it detected the incident; whether our pay files and cp-xfer’s password were in the affected part; the addresses it connects from; when it next updates; and a security contact.', m);
  await say('09:15. Facts by 12:00, please: what is known, what is not, and since when. Whether anyone must be told is mine for the Compact, and each member’s counsel’s for its own staff. I’ll send them the same facts.', 'Noor Castellanos');
  await chSupStage(3);
  await chSupStage(4);
  await say('12:30. My decision for the Compact, and each member’s counsel has said the same for its staff: no notice yet. We decide again when Thimbleford answers. (game)', 'Noor Castellanos');
  G.f.chSupIncident = true; unlock('act', 'chvendorir'); touchCSF('Respond'); track();
  await say('End the day at your desk.');
}
async function chSupReturn() {
  await say('16:40. Thimbleford’s summary, to Noor and to me. It says it detected the incident on Monday at 15:05, its time; the affected part held the file store with customers’ pay files; “we have found no evidence that your files were accessed”; cp-xfer’s password isn’t kept there; it connects only from its documented range. Its review covers activity up to Monday 18:00.', 'Marit Quellan');
  await chSupStage(5);
  await say('16:55: Marit asks Thimbleford, Noor copied, for a review that runs to the present, and whether 203.0.113.77 is one of its addresses. cp-xfer stays suspended: Edda’s decision. The next pay file is Day 81. (game)');
  G.f.chSupReturn = true; track();
  await say('End the day at your desk.');
}
// cp-xfer's return, measured against Monday's privacy tolerance: above it (no MFA for a machine account), so payroll's
// owner signs for it until the Board's review. On the risk register's acceptances (G.ch.accept), like Joanna's.
function chXferAccept() {
  if (G.ch.accept.some(x => x.line === 'CP-XFER')) return;
  G.ch.accept.push({line: 'CP-XFER', name: 'cp-xfer back on CP-XFER-01 without MFA', owner: 'Marit Quellan', residual: 'Medium', appetite: chAppetite('privacy'), breaks: [chTol('privacy')],
    decider: 'Marit', decidedBy: 'Marit Quellan, payroll’s owner, on the CISO’s measure', approvedBy: null, signedBy: 'Marit Quellan', signedFor: 'the interim measures until the Board’s review', day: 74,
    expiry: CH_EXPIRY_DAY, review: CH_REVIEW_DAY, interim: 'Key-only sign-in from Thimbleford’s documented range, every session logged and read each month by Edda’s team; 203.0.113.77 blocked at our edge.'});
}
async function chSupThursday() {
  await say('11:00. Thimbleford’s second answer: its review now runs to Wednesday 12:00. 203.0.113.77 is not one of its addresses. Nothing on its side used cp-xfer’s credentials after Thursday’s 06:00 pickup. That is its statement.', 'Marit Quellan');
  await say('11:30. My decision for the Compact, and each member’s counsel has agreed for its staff: Marit tells the members’ staff today what is known and what is not. Anything more waits for Thimbleford’s final report. (game)', 'Noor Castellanos');
  // Decision 6 / review 13: the Compact's own evidence before any return, then the return measured against the tolerance.
  await say('11:45. Our side too, before anything comes back: CP-XFER-01’s log since the 08:50 export, no attempt on cp-xfer since 23:52 Monday; our edge, nothing from 203.0.113.77 since it was blocked. With Thimbleford’s answer, the evidence covers the latest activity. (game)', 'Edda Thornquist');
  await say('11:50: you measure the return Edda proposes against Monday’s privacy tolerance. CP-XFER-01 holds every member’s staff bank details, and cp-xfer reaches it from outside without MFA, which a machine account can’t answer. Key-only sign-in from one range, every session logged, keeps the logging half, not the MFA half: above the tolerance. Staff records aren’t in the appetite’s list either. Both go to the Board’s Day 155 review. (game)');
  await say('Payroll is mine, so that risk is mine to carry. I agree the conditions, and I sign for it until the Board’s review, with Edda’s team reading cp-xfer’s sessions each month.', 'Marit Quellan');
  chXferAccept();
  await say('12:00: cp-xfer is back, my decision. Key sign-in only, no password: Thimbleford’s new key, confirmed on a call-back to a known number. Sign-ins only from its documented range, each one logged; 203.0.113.77 stays blocked. The next pickup is Day 81 at 06:00.', 'Edda Thornquist');
  touchCSF('Recover');
  await UI.openModal('The Compact’s timeline, beside Contract A', chSupTimelineHtml(), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  await say('12:30: you send each member’s owner its tier’s requirements for the next change to its own contracts: Celia for Stillmark, Director Strand for Shelfwright, Marisol for Wrenfold, Joanna for Tarnfield. Their contracts, their decisions. (game)');
  const cp = (chSup().planSent || {}).thimbleford || [], ca = ['C1', 'C2', 'C3'], out = ca.filter(c => !cp.includes(c));
  await say(!out.length ? 'Contract A’s clauses C1, C2 and C3 go into Thimbleford’s amendment, then: they are in the plan you sent. 14:00, the Board.' : 'Your plan recommended leaving ' + out.join(' and ') + ' out of Thimbleford’s amendment. I decided on that and signed for it, with a date; the Board will see it. 14:00.', 'Marit Quellan');
  G.f.chSupThu = true; track();
}

/* ---------- The directive (game; Wednesday 11:30): Ilka wants Inkmere signed today ---------- */
async function chSupDirective() {
  const who = 'Ilka Thrushcombe', sup = chSup();
  await say('Ilka Thrushcombe, procurement. Noor and I hold the Compact’s contracts, and I sign renewals under the authority the Board delegated (game). Inkmere’s ends on Friday.', who);
  await say('Inkmere renews at today’s price if we sign by Friday as it stands. Reopen it for your clause and it prices C1 at $4k a year. I’d like to sign this afternoon. Shall I?', who);
  const items = CH_SUP_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Inkmere’s renewal: what do you tell Ilka?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_SUP_DIRECTIVE[i].why);
  }
  sup.directive = {first: first};
  await say('11:50, Marit, its owner: “Price it, in your plan. If Inkmere won’t settle by Friday, Ilka takes a three-month extension on today’s terms and I sign for C1 for those three months. Walking away means the town prints and posts its own mailings next month: my call, and not this one.” (game)');
  await say('Then I sign once your plan is in. 14:00 is fine.', who);
  G.f.chSupDirective = true; touchCSF('Govern'); track();
  await say('14:00: your desk. The clause plan for the Compact’s four contracts.');
}

/* ---------- The clause plan (Wednesday 14:00, your desk) ---------- */
async function chSupPlanTask() {
  const sup = chSup();
  await say('14:00. Four of the Compact’s contracts change this year: Thimbleford’s amendment, Wellhollow’s renewal, Inkmere’s renewal and Pewterlane’s. One envelope, ' + chMoney(CH_SUP_ENVELOPE) + ' a year, set by Marit from the services’ budgets. (game)');
  const plan = await chPlanEdit();
  sup.planSent = plan; track();
  const st = chPlanStats(plan);
  const left = CH_SUP_CONTRACTS.flatMap(k => st.per[k.id].miss.map(c => [k.id, c])), adv = chPlanAdvice(plan);
  sup.planAdvice = {poor: adv.poor, left: adv.left.map(x => x.line), extras: adv.extras};
  for (const [id, c] of left) sup.accept.push(chClauseAccept(id, c, 73, adv));
  await say('14:40: Ilka and Noor take the plan to the suppliers: ' + chMoney(st.cost) + ' a year, ' + st.mustIn + ' of ' + st.mustTotal + ' must-haves in or sought. (game)');
  if (left.length) {
    const owners = [...new Set(left.map(([id]) => chSupLine(id).owner))];
    await UI.openModal('15:00: must-haves left out', (adv.extras.length ? '<p>Extras your plan sought instead: ' + esc(adv.extras.join(', ')) + '.</p>' : '') + chClauseAcceptHtml(sup.accept.filter(x => x.day === 73)), [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
    for (const o of owners) await say('You recommend leaving out ' + left.filter(([id]) => chSupLine(id).owner === o).map(([id, c]) => chSupLine(id).short + ' ' + c).join(', ') + (adv.poor ? ', though the money covered it' : '') + '. My decision, on your recommendation: I sign for it as its owner, with the interim measure and a date. The Board sees it.', o.replace(/^Director /, ''));
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
  await say('15:00: the register goes in the minute: eight suppliers tiered, owners and review dates, the plan for the Compact’s four contracts, each acceptance its owner signed on your recommendation, and cp-xfer’s, measured against Monday’s privacy tolerance.' + (G.ch.accept.some(x => x.gap && !x.closed) ? ' Still on the register: ' + G.ch.accept.filter(x => x.gap && !x.closed).map(x => x.line + '’s gap until its line delivers, ' + x.signedBy.split(' ')[0] + '’s').join(', ') + '.' : '') + ' Each member’s owner has its tier’s requirements for its own contracts. (game)', who);
  chAudit('Suppliers: the Board’s minute (Day 74)');
  f.chSupBoard = true; f.chHawser = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chsupboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s Supplier round. This is the Hawser Badge (game).', who);
  await say('Its power, from the next district on: every Tier 1 supplier’s security contact, or its account manager where its contract names none yet, is on the incident page. And Focus +4.', who);
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
    f.chSupSummary = true; touchCSF('Govern'); chAudit('Suppliers: the district’s end (Day 74)');
    Series.markEdition('charter', {suppliers: true});
    await say('Eight suppliers in tiers, a plan within the money, and Tuesday told from our own records. Next, policy.', 'Ivor Penhallow');
  }
  const ok = l => l.every(x => x !== false), ts = chTierStats(sup.sent), ps = sup.planSent ? chPlanStats(sup.planSent) : null, ss = chSupStats();
  const body = '<p class="big">Suppliers: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: the register tiered, ' + (ts ? ts.right + ' of 8 by the rule as you sent it' : 'not sent') + '. Tuesday: Thimbleford’s notice, ' + (ok(sup.incident.first) ? 'every step right at the first try' : 'with false starts the debriefs named') + '; cp-xfer suspended at 08:40 and returned on Thursday at 12:00. Wednesday: Inkmere’s renewal ' + (sup.directive && sup.directive.first ? 'sent to its owner at the first try' : 'sent to its owner, after a false start') + '; the plan ' + (ps ? chMoney(ps.cost) + ' of ' + chMoney(CH_SUP_ENVELOPE) + ', ' + ps.mustIn + ' of ' + ps.mustTotal + ' must-haves' : 'not sent') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chSupDrillRows() + '</table>' +
    '<h3>Must-haves left out: your recommendation, their owners’ decisions</h3>' + chClauseAcceptHtml(sup.accept) +
    '<p>The members’ own contracts: ' + ss.memFull + ' of ' + ss.members + ' with every must-have for their tier. Their owners’ decisions; each has the requirements.</p>' +
    '<p>Lesson (game): tier suppliers by what stops for residents and what they hold or can reach, not by the invoice. Put each tier’s requirements into the contracts; a must-have you leave out is your recommendation, and its owner decides on it and signs. Measure a returned way in against the tolerances, as any other. When a supplier has an incident, find what it can reach on your side, suspend it while the evidence stays, ask for the facts you need, say only what the records show, and give access back when the evidence, theirs and your own, covers the latest activity. Counsel decides any notice; the clock starts where the contract says.</p>' +
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
